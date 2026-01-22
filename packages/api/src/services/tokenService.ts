import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { prisma } from '../utils/prisma.js';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiry}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * multipliers[unit];
}

export const tokenService = {
  /**
   * Generate a JWT access token
   */
  generateAccessToken(payload: AccessTokenPayload): string {
    const expiresInSeconds = parseExpiry(config.jwt.accessExpiry);
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: expiresInSeconds,
    });
  },

  /**
   * Verify and decode a JWT access token
   */
  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, config.jwt.secret) as AccessTokenPayload;
  },

  /**
   * Generate a secure random token (64 bytes, hex encoded)
   */
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  },

  /**
   * Hash a token using SHA-256 for storage
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  /**
   * Create a refresh token and store in database
   * @param userId - The user ID
   * @param extendedExpiry - If true, use 30-day expiry for "remember me" feature
   */
  async createRefreshToken(userId: string, extendedExpiry = false): Promise<string> {
    const rawToken = this.generateSecureToken();
    const hashedToken = this.hashToken(rawToken);
    const expirySeconds = extendedExpiry
      ? 30 * 24 * 60 * 60 // 30 days
      : parseExpiry(config.jwt.refreshExpiry);
    const expiresAt = new Date(Date.now() + expirySeconds * 1000);

    await prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });

    return rawToken;
  },

  /**
   * Validate a refresh token
   */
  async validateRefreshToken(
    rawToken: string
  ): Promise<{ userId: string; tokenId: string } | null> {
    const hashedToken = this.hashToken(rawToken);

    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token: hashedToken },
    });

    if (!refreshToken) {
      return null;
    }

    if (refreshToken.isRevoked) {
      return null;
    }

    if (refreshToken.expiresAt < new Date()) {
      return null;
    }

    return {
      userId: refreshToken.userId,
      tokenId: refreshToken.id,
    };
  },

  /**
   * Rotate a refresh token (revoke old, create new)
   * @param tokenId - The old token ID to revoke
   * @param userId - The user ID
   * @param extendedExpiry - If true, use 30-day expiry for "remember me" feature
   */
  async rotateRefreshToken(tokenId: string, userId: string, extendedExpiry = false): Promise<string> {
    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: tokenId },
      data: { isRevoked: true },
    });

    // Create new token
    return this.createRefreshToken(userId, extendedExpiry);
  },

  /**
   * Revoke a specific refresh token by its raw value
   */
  async revokeRefreshToken(rawToken: string): Promise<boolean> {
    const hashedToken = this.hashToken(rawToken);

    const result = await prisma.refreshToken.updateMany({
      where: { token: hashedToken },
      data: { isRevoked: true },
    });

    return result.count > 0;
  },

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  },

  /**
   * Create an email confirmation token
   */
  async createEmailConfirmationToken(userId: string): Promise<string> {
    const rawToken = this.generateSecureToken();
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Delete any existing confirmation token for this user
    await prisma.emailConfirmationToken.deleteMany({
      where: { userId },
    });

    await prisma.emailConfirmationToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });

    return rawToken;
  },

  /**
   * Validate an email confirmation token
   */
  async validateEmailConfirmationToken(
    rawToken: string
  ): Promise<{ userId: string } | null> {
    const hashedToken = this.hashToken(rawToken);

    const confirmationToken = await prisma.emailConfirmationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!confirmationToken) {
      return null;
    }

    if (confirmationToken.expiresAt < new Date()) {
      return null;
    }

    return { userId: confirmationToken.userId };
  },

  /**
   * Consume an email confirmation token (delete after use)
   */
  async consumeEmailConfirmationToken(rawToken: string): Promise<boolean> {
    const hashedToken = this.hashToken(rawToken);

    const result = await prisma.emailConfirmationToken.deleteMany({
      where: { token: hashedToken },
    });

    return result.count > 0;
  },

  /**
   * Create a password reset token
   */
  async createPasswordResetToken(userId: string): Promise<string> {
    const rawToken = this.generateSecureToken();
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing unused reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });

    return rawToken;
  },

  /**
   * Validate a password reset token
   */
  async validatePasswordResetToken(
    rawToken: string
  ): Promise<{ userId: string; tokenId: string } | null> {
    const hashedToken = this.hashToken(rawToken);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetToken) {
      return null;
    }

    if (resetToken.usedAt) {
      return null;
    }

    if (resetToken.expiresAt < new Date()) {
      return null;
    }

    return { userId: resetToken.userId, tokenId: resetToken.id };
  },

  /**
   * Mark a password reset token as used
   */
  async markPasswordResetTokenUsed(tokenId: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  },

  /**
   * Clean up expired tokens (can be run as a scheduled job)
   */
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();

    await Promise.all([
      prisma.refreshToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: now } }, { isRevoked: true }],
        },
      }),
      prisma.emailConfirmationToken.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          OR: [{ expiresAt: { lt: now } }, { usedAt: { not: null } }],
        },
      }),
    ]);
  },
};
