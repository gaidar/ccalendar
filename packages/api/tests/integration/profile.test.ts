import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { prisma } from '../../src/utils/prisma.js';
import { tokenService } from '../../src/services/tokenService.js';
import { passwordService } from '../../src/services/passwordService.js';

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
      count: vi.fn(),
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
    hash: vi.fn().mockResolvedValue('hashed-password'),
    verify: vi.fn(),
  },
}));

// Mock token service (partial mock to keep generateAccessToken working)
vi.mock('../../src/services/tokenService.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/services/tokenService.js')>();
  return {
    tokenService: {
      ...actual.tokenService,
      revokeAllUserTokens: vi.fn().mockResolvedValue(undefined),
    },
  };
});

const app = createTestApp();

describe('Profile Integration Tests', () => {
  const testUserId = 'test-user-123';
  const testEmail = 'test@example.com';
  let validToken: string;

  beforeEach(() => {
    vi.clearAllMocks();

    // Generate a valid access token
    validToken = tokenService.generateAccessToken({
      userId: testUserId,
      email: testEmail,
      isAdmin: false,
    });
  });

  describe('GET /api/v1/profile', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: testEmail,
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy)
        .mockResolvedValueOnce([{ countryCode: 'US' }, { countryCode: 'GB' }] as never)
        .mockResolvedValueOnce([{ date: new Date('2024-06-01') }] as never);

      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.profile).toEqual({
        id: testUserId,
        name: 'Test User',
        email: testEmail,
        isAdmin: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        stats: {
          totalCountries: 2,
          totalDays: 1,
        },
        oauthProviders: ['google'],
        hasPassword: true,
      });
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/v1/profile');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should return 404 for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/v1/profile', () => {
    it('should update profile name successfully', async () => {
      const mockUser = {
        id: testUserId,
        name: 'Updated Name',
        email: testEmail,
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [],
      };

      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy).mockResolvedValue([] as never);

      const response = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.profile.name).toBe('Updated Name');
      expect(response.body.message).toBe('Profile updated successfully');
    });

    it('should update profile email successfully', async () => {
      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: 'newemail@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [],
      };

      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(null) // Email check
        .mockResolvedValueOnce(mockUser); // Profile fetch

      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.groupBy).mockResolvedValue([] as never);

      const response = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ email: 'newemail@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.profile.email).toBe('newemail@example.com');
    });

    it('should return 400 when email is already taken', async () => {
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

      const response = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ email: 'existing@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('EMAIL_EXISTS');
    });

    it('should return 400 when no fields provided', async () => {
      const response = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for name exceeding 100 characters', async () => {
      const response = await request(app)
        .patch('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'a'.repeat(101) });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch('/api/v1/profile')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/profile/change-password', () => {
    it('should change password successfully', async () => {
      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: testEmail,
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

      const response = await request(app)
        .post('/api/v1/profile/change-password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password changed successfully');
    });

    it('should allow OAuth user to set password without current password', async () => {
      const mockUser = {
        id: testUserId,
        name: 'OAuth User',
        email: testEmail,
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(passwordService.hash).mockResolvedValue('new-hashed-password');
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/profile/change-password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password changed successfully');
    });

    it('should return 400 when current password is incorrect', async () => {
      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: testEmail,
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(passwordService.verify).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/v1/profile/change-password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'WrongPassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('INVALID_CURRENT_PASSWORD');
    });

    it('should return 400 when passwords do not match', async () => {
      const response = await request(app)
        .post('/api/v1/profile/change-password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'DifferentPassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when new password is too short', async () => {
      const response = await request(app)
        .post('/api/v1/profile/change-password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'OldPassword123',
          newPassword: 'Short1',
          confirmPassword: 'Short1',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/profile/change-password')
        .send({
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/profile', () => {
    it('should delete account with correct confirmation', async () => {
      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: testEmail,
        password: 'hashed',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(prisma.travelRecord.count).mockResolvedValue(5);
      vi.mocked(prisma.$transaction).mockResolvedValue([]);

      const response = await request(app)
        .delete('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ confirmation: 'DELETE' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account deleted successfully');
    });

    it('should return 400 with incorrect confirmation', async () => {
      const response = await request(app)
        .delete('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ confirmation: 'delete' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 without confirmation', async () => {
      const response = await request(app)
        .delete('/api/v1/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/v1/profile')
        .send({ confirmation: 'DELETE' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/profile/oauth', () => {
    it('should return connected providers', async () => {
      const mockOAuthAccounts = [{ provider: 'google' }, { provider: 'facebook' }];

      vi.mocked(prisma.oAuth.findMany).mockResolvedValue(mockOAuthAccounts as never);

      const response = await request(app)
        .get('/api/v1/profile/oauth')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.providers).toEqual(['google', 'facebook']);
    });

    it('should return empty array when no providers connected', async () => {
      vi.mocked(prisma.oAuth.findMany).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/v1/profile/oauth')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.providers).toEqual([]);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/v1/profile/oauth');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/v1/profile/oauth/:provider', () => {
    it('should disconnect provider successfully', async () => {
      const mockOAuthAccount = {
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: testUserId,
        token: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: testEmail,
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

      const response = await request(app)
        .delete('/api/v1/profile/oauth/google')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('google account disconnected successfully');
    });

    it('should return 400 when trying to disconnect only auth method', async () => {
      const mockOAuthAccount = {
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: testUserId,
        token: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockUser = {
        id: testUserId,
        name: 'Test User',
        email: testEmail,
        password: null,
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        oauthAccounts: [{ provider: 'google' }],
      };

      vi.mocked(prisma.oAuth.findFirst).mockResolvedValue(mockOAuthAccount);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const response = await request(app)
        .delete('/api/v1/profile/oauth/google')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('CANNOT_DISCONNECT');
    });

    it('should return 404 when provider is not connected', async () => {
      vi.mocked(prisma.oAuth.findFirst).mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/profile/oauth/google')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PROVIDER_NOT_FOUND');
    });

    it('should return 400 for invalid provider', async () => {
      const response = await request(app)
        .delete('/api/v1/profile/oauth/invalid')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).delete('/api/v1/profile/oauth/google');

      expect(response.status).toBe(401);
    });
  });
});
