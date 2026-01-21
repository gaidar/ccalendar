import { prisma } from '../utils/prisma.js';
import { tokenService } from './tokenService.js';
import { config } from '../config/index.js';
import { ForbiddenError } from '../middleware/errorHandler.js';
import type { LoginResult } from './authService.js';

export type OAuthProvider = 'google' | 'facebook' | 'apple';

export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name: string;
  emailVerified?: boolean;
}

export const oauthService = {
  /**
   * Get list of available OAuth providers based on environment and configuration
   */
  getAvailableProviders(): OAuthProvider[] {
    // OAuth is disabled in development
    if (config.env !== 'production') {
      return [];
    }

    const providers: OAuthProvider[] = [];

    if (config.oauth.google.isConfigured) {
      providers.push('google');
    }
    if (config.oauth.facebook.isConfigured) {
      providers.push('facebook');
    }
    if (config.oauth.apple.isConfigured) {
      providers.push('apple');
    }

    return providers;
  },

  /**
   * Check if a specific OAuth provider is available
   */
  isProviderAvailable(provider: OAuthProvider): boolean {
    return this.getAvailableProviders().includes(provider);
  },

  /**
   * Find or create a user from OAuth profile
   * Implements account linking logic:
   * - New email: Create new confirmed account
   * - Existing verified email: Link OAuth and login
   * - Existing unverified email: Error
   */
  async findOrCreateOAuthUser(profile: OAuthProfile): Promise<LoginResult> {
    // Check if OAuth account already exists
    const existingOAuth = await prisma.oAuth.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
      include: { user: true },
    });

    if (existingOAuth) {
      // User already has this OAuth linked, just login
      return this.generateLoginResult(existingOAuth.user);
    }

    // Check if user with this email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
    });

    if (existingUser) {
      // Check if the existing account is confirmed
      if (!existingUser.isConfirmed) {
        throw new ForbiddenError('Please verify your email first');
      }

      // Link OAuth to existing confirmed account
      await prisma.oAuth.create({
        data: {
          provider: profile.provider,
          providerId: profile.providerId,
          userId: existingUser.id,
        },
      });

      return this.generateLoginResult(existingUser);
    }

    // Create new user with OAuth (auto-confirmed)
    const newUser = await prisma.user.create({
      data: {
        name: profile.name,
        email: profile.email.toLowerCase(),
        password: null, // OAuth users don't have password
        isConfirmed: true,
        confirmedAt: new Date(),
        oauthAccounts: {
          create: {
            provider: profile.provider,
            providerId: profile.providerId,
          },
        },
      },
    });

    return this.generateLoginResult(newUser);
  },

  /**
   * Generate login result with tokens for a user
   */
  async generateLoginResult(user: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }): Promise<LoginResult> {
    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    const refreshToken = await tokenService.createRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  /**
   * Get OAuth accounts linked to a user
   */
  async getUserOAuthProviders(userId: string): Promise<OAuthProvider[]> {
    const oauthAccounts = await prisma.oAuth.findMany({
      where: { userId },
      select: { provider: true },
    });

    return oauthAccounts.map(account => account.provider as OAuthProvider);
  },
};
