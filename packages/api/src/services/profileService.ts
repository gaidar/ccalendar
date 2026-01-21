import { prisma } from '../utils/prisma.js';
import { passwordService } from './passwordService.js';
import { tokenService } from './tokenService.js';
import { HttpError, NotFoundError } from '../middleware/errorHandler.js';

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  stats: {
    totalCountries: number;
    totalDays: number;
  };
  oauthProviders: string[];
  hasPassword: boolean;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

const VALID_OAUTH_PROVIDERS = ['google', 'facebook', 'apple'] as const;
export type OAuthProvider = (typeof VALID_OAUTH_PROVIDERS)[number];

export function isValidOAuthProvider(provider: string): provider is OAuthProvider {
  return VALID_OAUTH_PROVIDERS.includes(provider as OAuthProvider);
}

export const profileService = {
  /**
   * Get user profile with stats and OAuth providers
   */
  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthAccounts: {
          select: { provider: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Calculate stats
    const [countryStats, dayStats] = await Promise.all([
      prisma.travelRecord.groupBy({
        by: ['countryCode'],
        where: { userId },
      }),
      prisma.travelRecord.groupBy({
        by: ['date'],
        where: { userId },
      }),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      stats: {
        totalCountries: countryStats.length,
        totalDays: dayStats.length,
      },
      oauthProviders: user.oauthAccounts.map((oa) => oa.provider),
      hasPassword: !!user.password,
    };
  },

  /**
   * Update user profile (name and/or email)
   */
  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<ProfileResponse> {
    // Check if email is being changed and if it's already taken
    if (input.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new HttpError(400, 'EMAIL_EXISTS', 'Email is already in use');
      }
    }

    // Strip HTML tags from name if provided
    const sanitizedName = input.name
      ? input.name.replace(/<[^>]*>/g, '').trim()
      : undefined;

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(sanitizedName !== undefined && { name: sanitizedName }),
        ...(input.email !== undefined && { email: input.email.toLowerCase().trim() }),
      },
    });

    return this.getProfile(userId);
  },

  /**
   * Change user password
   * OAuth-only users can set a password without providing current password
   */
  async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // If user has a password, they must provide current password
    if (user.password) {
      if (!input.currentPassword) {
        throw new HttpError(
          400,
          'CURRENT_PASSWORD_REQUIRED',
          'Current password is required'
        );
      }

      const isPasswordValid = await passwordService.verify(
        input.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new HttpError(
          400,
          'INVALID_CURRENT_PASSWORD',
          'Current password is incorrect'
        );
      }
    }

    // Hash and save new password
    const hashedPassword = await passwordService.hash(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens to force re-login on all devices
    await tokenService.revokeAllUserTokens(userId);
  },

  /**
   * Delete user account with all associated data
   */
  async deleteAccount(userId: string, confirmation: string): Promise<void> {
    if (confirmation !== 'DELETE') {
      throw new HttpError(
        400,
        'INVALID_CONFIRMATION',
        'Please type "DELETE" to confirm account deletion'
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete all user data in a transaction
    // Note: Most relations have onDelete: Cascade, but we'll be explicit
    await prisma.$transaction([
      // Delete travel records
      prisma.travelRecord.deleteMany({ where: { userId } }),
      // Delete OAuth connections
      prisma.oAuth.deleteMany({ where: { userId } }),
      // Delete refresh tokens
      prisma.refreshToken.deleteMany({ where: { userId } }),
      // Delete email confirmation tokens
      prisma.emailConfirmationToken.deleteMany({ where: { userId } }),
      // Delete password reset tokens
      prisma.passwordResetToken.deleteMany({ where: { userId } }),
      // Delete login attempts (userId can be null, so use direct reference)
      prisma.loginAttempt.deleteMany({ where: { userId } }),
      // Update support tickets to remove user reference
      prisma.supportTicket.updateMany({
        where: { userId },
        data: { userId: null },
      }),
      // Finally, delete the user
      prisma.user.delete({ where: { id: userId } }),
    ]);
  },

  /**
   * Get list of connected OAuth providers
   */
  async getConnectedProviders(userId: string): Promise<string[]> {
    const oauthAccounts = await prisma.oAuth.findMany({
      where: { userId },
      select: { provider: true },
    });

    return oauthAccounts.map((oa) => oa.provider);
  },

  /**
   * Check if user has alternative authentication method
   */
  async hasAlternativeAuthMethod(
    userId: string,
    excludeProvider?: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthAccounts: {
          select: { provider: true },
        },
      },
    });

    if (!user) {
      return false;
    }

    // User has password
    if (user.password) {
      return true;
    }

    // User has other OAuth providers
    const otherProviders = user.oauthAccounts.filter(
      (oa) => oa.provider !== excludeProvider
    );

    return otherProviders.length > 0;
  },

  /**
   * Disconnect an OAuth provider from user account
   */
  async disconnectProvider(userId: string, provider: string): Promise<void> {
    if (!isValidOAuthProvider(provider)) {
      throw new HttpError(400, 'INVALID_PROVIDER', 'Invalid OAuth provider');
    }

    // Check if provider is connected
    const oauthAccount = await prisma.oAuth.findFirst({
      where: { userId, provider },
    });

    if (!oauthAccount) {
      throw new HttpError(404, 'PROVIDER_NOT_FOUND', 'Provider is not connected');
    }

    // Check if user has alternative auth method
    const hasAlternative = await this.hasAlternativeAuthMethod(userId, provider);

    if (!hasAlternative) {
      throw new HttpError(
        400,
        'CANNOT_DISCONNECT',
        'Cannot disconnect your only authentication method. Please set a password or connect another provider first.'
      );
    }

    // Delete the OAuth connection
    await prisma.oAuth.delete({
      where: { id: oauthAccount.id },
    });
  },
};
