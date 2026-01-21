import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../src/utils/prisma.js';
import { profileService } from '../../src/services/profileService.js';
import { passwordService } from '../../src/services/passwordService.js';
import { tokenService } from '../../src/services/tokenService.js';
import { HttpError, NotFoundError } from '../../src/middleware/errorHandler.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    travelRecord: {
      groupBy: vi.fn(),
      deleteMany: vi.fn(),
    },
    oAuth: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    refreshToken: {
      deleteMany: vi.fn(),
    },
    emailConfirmationToken: {
      deleteMany: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
    },
    loginAttempt: {
      deleteMany: vi.fn(),
    },
    supportTicket: {
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock password service
vi.mock('../../src/services/passwordService.js', () => ({
  passwordService: {
    hash: vi.fn(),
    verify: vi.fn(),
  },
}));

// Mock token service
vi.mock('../../src/services/tokenService.js', () => ({
  tokenService: {
    revokeAllUserTokens: vi.fn(),
  },
}));

describe('ProfileService', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile with stats and OAuth providers', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }, { provider: 'facebook' }],
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy)
        .mockResolvedValueOnce([{ countryCode: 'US' }, { countryCode: 'GB' }] as never)
        .mockResolvedValueOnce([
          { date: new Date('2024-06-01') },
          { date: new Date('2024-06-02') },
          { date: new Date('2024-06-03') },
        ] as never);

      const result = await profileService.getProfile(mockUserId);

      expect(result).toEqual({
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        createdAt: mockUser.createdAt,
        stats: {
          totalCountries: 2,
          totalDays: 3,
        },
        oauthProviders: ['google', 'facebook'],
        hasPassword: true,
      });
    });

    it('should indicate hasPassword as false for OAuth-only user', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'OAuth User',
        email: 'oauth@example.com',
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy).mockResolvedValue([] as never);

      const result = await profileService.getProfile(mockUserId);

      expect(result.hasPassword).toBe(false);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(profileService.getProfile(mockUserId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('should update user name', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Updated Name',
        email: 'test@example.com',
        password: 'hashed',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [],
      };

      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy).mockResolvedValue([] as never);

      const result = await profileService.updateProfile(mockUserId, { name: 'Updated Name' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: 'Updated Name' },
      });
      expect(result.name).toBe('Updated Name');
    });

    it('should update user email in lowercase', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'new@example.com',
        password: 'hashed',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [],
      };

      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null) // Email check
        .mockResolvedValueOnce(mockUser); // Profile fetch after update

      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy).mockResolvedValue([] as never);

      await profileService.updateProfile(mockUserId, { email: 'NEW@EXAMPLE.COM' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { email: 'new@example.com' },
      });
    });

    it('should throw error when email is already taken by another user', async () => {
      const existingUser = {
        id: 'other-user',
        name: 'Other User',
        email: 'existing@example.com',
        password: 'hashed',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

      await expect(
        profileService.updateProfile(mockUserId, { email: 'existing@example.com' })
      ).rejects.toThrow(HttpError);

      await expect(
        profileService.updateProfile(mockUserId, { email: 'existing@example.com' })
      ).rejects.toMatchObject({ code: 'EMAIL_EXISTS' });
    });

    it('should strip HTML tags from name', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Clean Name',
        email: 'test@example.com',
        password: 'hashed',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [],
      };

      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy).mockResolvedValue([] as never);

      await profileService.updateProfile(mockUserId, { name: '<script>alert("xss")</script>Clean Name' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: 'alert("xss")Clean Name' },
      });
    });
  });

  describe('changePassword', () => {
    it('should change password when current password is valid', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'old-hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(passwordService.verify).mockResolvedValue(true);
      vi.mocked(passwordService.hash).mockResolvedValue('new-hashed-password');
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(tokenService.revokeAllUserTokens).mockResolvedValue();

      await profileService.changePassword(mockUserId, {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      });

      expect(passwordService.verify).toHaveBeenCalledWith('oldpassword', 'old-hashed-password');
      expect(passwordService.hash).toHaveBeenCalledWith('newpassword');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { password: 'new-hashed-password' },
      });
      expect(tokenService.revokeAllUserTokens).toHaveBeenCalledWith(mockUserId);
    });

    it('should allow OAuth-only user to set password without current password', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'OAuth User',
        email: 'oauth@example.com',
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(passwordService.hash).mockResolvedValue('new-hashed-password');
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(tokenService.revokeAllUserTokens).mockResolvedValue();

      await profileService.changePassword(mockUserId, {
        newPassword: 'newpassword',
      });

      expect(passwordService.verify).not.toHaveBeenCalled();
      expect(passwordService.hash).toHaveBeenCalledWith('newpassword');
    });

    it('should throw error when current password is incorrect', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(passwordService.verify).mockResolvedValue(false);

      await expect(
        profileService.changePassword(mockUserId, {
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword',
        })
      ).rejects.toThrow(HttpError);

      await expect(
        profileService.changePassword(mockUserId, {
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword',
        })
      ).rejects.toMatchObject({ code: 'INVALID_CURRENT_PASSWORD' });
    });

    it('should throw error when user with password does not provide current password', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      await expect(
        profileService.changePassword(mockUserId, {
          newPassword: 'newpassword',
        })
      ).rejects.toThrow(HttpError);

      await expect(
        profileService.changePassword(mockUserId, {
          newPassword: 'newpassword',
        })
      ).rejects.toMatchObject({ code: 'CURRENT_PASSWORD_REQUIRED' });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        profileService.changePassword(mockUserId, {
          currentPassword: 'oldpassword',
          newPassword: 'newpassword',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteAccount', () => {
    it('should delete account with correct confirmation', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.$transaction).mockResolvedValue([]);

      await profileService.deleteAccount(mockUserId, 'DELETE');

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw error with incorrect confirmation', async () => {
      await expect(profileService.deleteAccount(mockUserId, 'delete')).rejects.toThrow(HttpError);

      await expect(profileService.deleteAccount(mockUserId, 'REMOVE')).rejects.toMatchObject({
        code: 'INVALID_CONFIRMATION',
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(profileService.deleteAccount(mockUserId, 'DELETE')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getConnectedProviders', () => {
    it('should return list of connected providers', async () => {
      const mockOAuthAccounts = [{ provider: 'google' }, { provider: 'facebook' }];

      vi.mocked(prisma.oAuth.findMany).mockResolvedValue(mockOAuthAccounts as never);

      const result = await profileService.getConnectedProviders(mockUserId);

      expect(result).toEqual(['google', 'facebook']);
    });

    it('should return empty array when no providers connected', async () => {
      vi.mocked(prisma.oAuth.findMany).mockResolvedValue([]);

      const result = await profileService.getConnectedProviders(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('hasAlternativeAuthMethod', () => {
    it('should return true when user has password', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await profileService.hasAlternativeAuthMethod(mockUserId, 'google');

      expect(result).toBe(true);
    });

    it('should return true when user has another OAuth provider', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }, { provider: 'facebook' }],
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await profileService.hasAlternativeAuthMethod(mockUserId, 'google');

      expect(result).toBe(true);
    });

    it('should return false when user has only one OAuth provider and no password', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await profileService.hasAlternativeAuthMethod(mockUserId, 'google');

      expect(result).toBe(false);
    });
  });

  describe('disconnectProvider', () => {
    it('should disconnect provider when user has alternative auth method', async () => {
      const mockOAuthAccount = {
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: mockUserId,
        token: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.oAuth.findFirst).mockResolvedValue(mockOAuthAccount);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.oAuth.delete).mockResolvedValue(mockOAuthAccount);

      await profileService.disconnectProvider(mockUserId, 'google');

      expect(prisma.oAuth.delete).toHaveBeenCalledWith({
        where: { id: 'oauth-123' },
      });
    });

    it('should throw error when trying to disconnect only auth method', async () => {
      const mockOAuthAccount = {
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: mockUserId,
        token: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.oAuth.findFirst).mockResolvedValue(mockOAuthAccount);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      await expect(profileService.disconnectProvider(mockUserId, 'google')).rejects.toThrow(HttpError);

      await expect(profileService.disconnectProvider(mockUserId, 'google')).rejects.toMatchObject({
        code: 'CANNOT_DISCONNECT',
      });
    });

    it('should throw error when provider is not connected', async () => {
      vi.mocked(prisma.oAuth.findFirst).mockResolvedValue(null);

      await expect(profileService.disconnectProvider(mockUserId, 'google')).rejects.toThrow(HttpError);

      await expect(profileService.disconnectProvider(mockUserId, 'google')).rejects.toMatchObject({
        code: 'PROVIDER_NOT_FOUND',
      });
    });

    it('should throw error for invalid provider', async () => {
      await expect(profileService.disconnectProvider(mockUserId, 'invalid')).rejects.toThrow(HttpError);

      await expect(profileService.disconnectProvider(mockUserId, 'invalid')).rejects.toMatchObject({
        code: 'INVALID_PROVIDER',
      });
    });
  });
});
