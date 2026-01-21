import { describe, it, expect, beforeEach, vi } from 'vitest';
import { oauthService, type OAuthProfile } from '../../src/services/oauthService.js';
import { prisma } from '../../src/utils/prisma.js';
import { config } from '../../src/config/index.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    oAuth: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
    },
  },
}));

// Mock config
vi.mock('../../src/config/index.js', () => ({
  config: {
    env: 'development',
    jwt: {
      secret: 'test-secret-key-that-is-at-least-32-chars',
      accessExpiry: '15m',
      refreshExpiry: '7d',
    },
    oauth: {
      google: { isConfigured: false },
      facebook: { isConfigured: false },
      apple: { isConfigured: false },
    },
  },
}));

describe('OAuth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableProviders', () => {
    it('should return empty array in development environment', () => {
      const providers = oauthService.getAvailableProviders();
      expect(providers).toEqual([]);
    });

    it('should return configured providers in production', () => {
      // Temporarily change config for this test
      vi.mocked(config).env = 'production';
      vi.mocked(config.oauth.google).isConfigured = true;
      vi.mocked(config.oauth.facebook).isConfigured = true;
      vi.mocked(config.oauth.apple).isConfigured = false;

      const providers = oauthService.getAvailableProviders();
      expect(providers).toContain('google');
      expect(providers).toContain('facebook');
      expect(providers).not.toContain('apple');

      // Reset config
      vi.mocked(config).env = 'development';
      vi.mocked(config.oauth.google).isConfigured = false;
      vi.mocked(config.oauth.facebook).isConfigured = false;
    });

    it('should return empty array in production when no providers configured', () => {
      vi.mocked(config).env = 'production';

      const providers = oauthService.getAvailableProviders();
      expect(providers).toEqual([]);

      vi.mocked(config).env = 'development';
    });
  });

  describe('isProviderAvailable', () => {
    it('should return false for any provider in development', () => {
      expect(oauthService.isProviderAvailable('google')).toBe(false);
      expect(oauthService.isProviderAvailable('facebook')).toBe(false);
      expect(oauthService.isProviderAvailable('apple')).toBe(false);
    });
  });

  describe('findOrCreateOAuthUser', () => {
    const mockOAuthProfile: OAuthProfile = {
      provider: 'google',
      providerId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    };

    it('should login existing OAuth user', async () => {
      const existingUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.oAuth.findUnique).mockResolvedValue({
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: 'user-123',
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: existingUser,
      } as any);

      vi.mocked(prisma.refreshToken.create).mockResolvedValue({
        id: 'token-123',
        token: 'hashed-token',
        userId: 'user-123',
        expiresAt: new Date(),
        isRevoked: false,
        createdAt: new Date(),
      });

      const result = await oauthService.findOrCreateOAuthUser(mockOAuthProfile);

      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should link OAuth to existing verified account', async () => {
      const existingUser = {
        id: 'user-456',
        name: 'Existing User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.oAuth.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);
      vi.mocked(prisma.oAuth.create).mockResolvedValue({
        id: 'oauth-new',
        provider: 'google',
        providerId: 'google-123',
        userId: 'user-456',
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({
        id: 'token-456',
        token: 'hashed-token',
        userId: 'user-456',
        expiresAt: new Date(),
        isRevoked: false,
        createdAt: new Date(),
      });

      const result = await oauthService.findOrCreateOAuthUser(mockOAuthProfile);

      expect(prisma.oAuth.create).toHaveBeenCalledWith({
        data: {
          provider: 'google',
          providerId: 'google-123',
          userId: 'user-456',
        },
      });
      expect(result.user.id).toBe('user-456');
    });

    it('should reject OAuth for unverified existing account', async () => {
      const unverifiedUser = {
        id: 'user-789',
        name: 'Unverified User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: false,
        confirmedAt: null,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.oAuth.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(unverifiedUser);

      await expect(oauthService.findOrCreateOAuthUser(mockOAuthProfile))
        .rejects.toThrow('Please verify your email first');
    });

    it('should create new user for first-time OAuth', async () => {
      const newUser = {
        id: 'new-user-123',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.oAuth.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(newUser);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({
        id: 'token-new',
        token: 'hashed-token',
        userId: 'new-user-123',
        expiresAt: new Date(),
        isRevoked: false,
        createdAt: new Date(),
      });

      const result = await oauthService.findOrCreateOAuthUser(mockOAuthProfile);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: null,
          isConfirmed: true,
        }),
      });
      expect(result.user.isAdmin).toBe(false);
    });
  });

  describe('getUserOAuthProviders', () => {
    it('should return list of linked OAuth providers', async () => {
      vi.mocked(prisma.oAuth.findMany).mockResolvedValue([
        { provider: 'google' } as any,
        { provider: 'facebook' } as any,
      ]);

      const providers = await oauthService.getUserOAuthProviders('user-123');

      expect(providers).toContain('google');
      expect(providers).toContain('facebook');
      expect(providers).not.toContain('apple');
    });

    it('should return empty array for user with no OAuth links', async () => {
      vi.mocked(prisma.oAuth.findMany).mockResolvedValue([]);

      const providers = await oauthService.getUserOAuthProviders('user-123');

      expect(providers).toEqual([]);
    });
  });
});
