import { prisma } from '../utils/prisma.js';
import { passwordService } from './passwordService.js';
import { tokenService } from './tokenService.js';
import { HttpError, ForbiddenError, UnauthorizedError } from '../middleware/errorHandler.js';
import type { RegisterInput, LoginInput } from '../validators/auth.js';

const LOCKOUT_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export const authService = {
  /**
   * Register a new user with email and password
   */
  async register(
    input: RegisterInput
  ): Promise<{ user: AuthUser; confirmationToken: string }> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new HttpError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    // Hash password
    const hashedPassword = await passwordService.hash(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        isConfirmed: false,
      },
    });

    // Create email confirmation token
    const confirmationToken = await tokenService.createEmailConfirmationToken(
      user.id
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      confirmationToken,
    };
  },

  /**
   * Confirm email with token
   */
  async confirmEmail(token: string): Promise<AuthUser> {
    const tokenData = await tokenService.validateEmailConfirmationToken(token);

    if (!tokenData) {
      throw new HttpError(400, 'INVALID_TOKEN', 'Invalid or expired confirmation link');
    }

    // Update user to confirmed
    const user = await prisma.user.update({
      where: { id: tokenData.userId },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    });

    // Consume the token
    await tokenService.consumeEmailConfirmationToken(token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  },

  /**
   * Resend confirmation email
   */
  async resendConfirmation(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isConfirmed) {
      // Don't reveal whether user exists or is already confirmed
      return null;
    }

    return tokenService.createEmailConfirmationToken(user.id);
  },

  /**
   * Check if account is locked out due to failed login attempts
   */
  async isAccountLockedOut(email: string): Promise<boolean> {
    const lockoutCutoff = new Date(
      Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000
    );

    const failedAttempts = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: lockoutCutoff },
      },
    });

    return failedAttempts >= LOCKOUT_ATTEMPTS;
  },

  /**
   * Record a login attempt
   */
  async recordLoginAttempt(
    email: string,
    success: boolean,
    ipAddress: string,
    userAgent: string | undefined,
    userId?: string
  ): Promise<void> {
    await prisma.loginAttempt.create({
      data: {
        email,
        success,
        ipAddress,
        userAgent: userAgent?.substring(0, 500),
        userId,
      },
    });

    // If successful, delete old failed attempts for this email
    if (success) {
      await prisma.loginAttempt.deleteMany({
        where: {
          email,
          success: false,
        },
      });
    }
  },

  /**
   * Login with email and password
   */
  async login(
    input: LoginInput,
    ipAddress: string,
    userAgent: string | undefined
  ): Promise<LoginResult> {
    // Check for account lockout
    const isLockedOut = await this.isAccountLockedOut(input.email);
    if (isLockedOut) {
      throw new HttpError(
        429,
        'ACCOUNT_LOCKED',
        'Account temporarily locked. Please try again later.'
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    // Constant-time comparison to prevent timing attacks
    if (!user || !user.password) {
      // Still hash something to maintain constant timing
      await passwordService.hash(input.password);
      await this.recordLoginAttempt(input.email, false, ipAddress, userAgent);
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await passwordService.verify(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      await this.recordLoginAttempt(
        input.email,
        false,
        ipAddress,
        userAgent,
        user.id
      );
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if email is confirmed
    if (!user.isConfirmed) {
      throw new ForbiddenError('Please confirm your email address');
    }

    // Record successful login
    await this.recordLoginAttempt(
      input.email,
      true,
      ipAddress,
      userAgent,
      user.id
    );

    // Generate tokens
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
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const tokenData = await tokenService.validateRefreshToken(refreshToken);

    if (!tokenData) {
      throw new UnauthorizedError('Session expired, please login again');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
    });

    if (!user) {
      throw new UnauthorizedError('Session invalid');
    }

    // Generate new access token
    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    // Rotate refresh token
    const newRefreshToken = await tokenService.rotateRefreshToken(
      tokenData.tokenId,
      user.id
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  /**
   * Logout from current session
   */
  async logout(refreshToken: string): Promise<void> {
    await tokenService.revokeRefreshToken(refreshToken);
  },

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await tokenService.revokeAllUserTokens(userId);
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether user exists
      return null;
    }

    return tokenService.createPasswordResetToken(user.id);
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenData = await tokenService.validatePasswordResetToken(token);

    if (!tokenData) {
      throw new HttpError(400, 'INVALID_TOKEN', 'Invalid or expired reset link');
    }

    // Check if token has already been used
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        id: tokenData.tokenId,
        usedAt: { not: null },
      },
    });

    if (resetToken) {
      throw new HttpError(400, 'TOKEN_USED', 'Reset link has already been used');
    }

    // Hash new password
    const hashedPassword = await passwordService.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: tokenData.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await tokenService.markPasswordResetTokenUsed(tokenData.tokenId);

    // Revoke all refresh tokens (force re-login on all devices)
    await tokenService.revokeAllUserTokens(tokenData.userId);
  },

  /**
   * Change password (for authenticated users)
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new UnauthorizedError('Cannot change password for this account');
    }

    // Verify current password
    const isPasswordValid = await passwordService.verify(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await passwordService.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens except current (force re-login on other devices)
    await tokenService.revokeAllUserTokens(userId);
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  },
};
