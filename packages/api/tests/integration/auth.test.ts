import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { prisma } from '../../src/utils/prisma.js';
import { passwordService } from '../../src/services/passwordService.js';
import { tokenService } from '../../src/services/tokenService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    emailConfirmationToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    loginAttempt: {
      create: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const app = createTestApp();

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: false,
        confirmedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.emailConfirmationToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.emailConfirmationToken.create).mockResolvedValue({
        id: 'token-id',
        token: 'hashed-token',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.message).toContain('Registration successful');
    });

    it('should reject registration with existing email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'john@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('EMAIL_EXISTS');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'Password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'weak',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await passwordService.hash('Password123');

      vi.mocked(prisma.loginAttempt.count).mockResolvedValue(0);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.loginAttempt.create).mockResolvedValue({
        id: 'attempt-id',
        userId: 'test-user-id',
        email: 'john@example.com',
        success: true,
        ipAddress: '::ffff:127.0.0.1',
        userAgent: null,
        createdAt: new Date(),
      });
      vi.mocked(prisma.loginAttempt.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({
        id: 'refresh-token-id',
        token: 'hashed-token',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isRevoked: false,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const hashedPassword = await passwordService.hash('Password123');

      vi.mocked(prisma.loginAttempt.count).mockResolvedValue(0);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.loginAttempt.create).mockResolvedValue({
        id: 'attempt-id',
        userId: 'test-user-id',
        email: 'john@example.com',
        success: false,
        ipAddress: '::ffff:127.0.0.1',
        userAgent: null,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should reject login for unconfirmed account', async () => {
      const hashedPassword = await passwordService.hash('Password123');

      vi.mocked(prisma.loginAttempt.count).mockResolvedValue(0);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false,
        isConfirmed: false,
        confirmedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.loginAttempt.create).mockResolvedValue({
        id: 'attempt-id',
        userId: 'test-user-id',
        email: 'john@example.com',
        success: true,
        ipAddress: '::ffff:127.0.0.1',
        userAgent: null,
        createdAt: new Date(),
      });
      vi.mocked(prisma.loginAttempt.deleteMany).mockResolvedValue({ count: 0 });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('should reject login when account is locked', async () => {
      vi.mocked(prisma.loginAttempt.count).mockResolvedValue(5);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Password123',
        });

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('ACCOUNT_LOCKED');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile with valid token', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const accessToken = tokenService.generateAccessToken({
        userId: 'test-user-id',
        email: 'john@example.com',
        isAdmin: false,
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('john@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      vi.mocked(prisma.refreshToken.updateMany).mockResolvedValue({ count: 1 });

      const accessToken = tokenService.generateAccessToken({
        userId: 'test-user-id',
        email: 'john@example.com',
        isAdmin: false,
      });

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', 'refreshToken=test-refresh-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Logged out');
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    it('should accept password reset request', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        isAdmin: false,
        isConfirmed: true,
        confirmedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({
        id: 'token-id',
        token: 'hashed-token',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        usedAt: null,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          email: 'john@example.com',
        });

      expect(response.status).toBe(200);
      // Should not reveal whether email exists
      expect(response.body.message).toContain('If an account exists');
    });

    it('should return same message for non-existent email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          email: 'nonexistent@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('If an account exists');
    });
  });
});
