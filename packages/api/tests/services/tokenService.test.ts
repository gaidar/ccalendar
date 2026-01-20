import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { tokenService } from '../../src/services/tokenService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
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
  },
}));

describe('tokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        isAdmin: false,
      };

      const token = tokenService.generateAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include payload data in token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        isAdmin: true,
      };

      const token = tokenService.generateAccessToken(payload);
      const decoded = jwt.decode(token) as Record<string, unknown>;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.isAdmin).toBe(payload.isAdmin);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        isAdmin: false,
      };

      const token = tokenService.generateAccessToken(payload);
      const decoded = tokenService.verifyAccessToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.isAdmin).toBe(payload.isAdmin);
    });

    it('should throw for invalid token', () => {
      expect(() => {
        tokenService.verifyAccessToken('invalid-token');
      }).toThrow();
    });

    it('should throw for tampered token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        isAdmin: false,
      };

      const token = tokenService.generateAccessToken(payload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => {
        tokenService.verifyAccessToken(tamperedToken);
      }).toThrow();
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a 64-character hex token', () => {
      const token = tokenService.generateSecureToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = tokenService.generateSecureToken();
      const token2 = tokenService.generateSecureToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('hashToken', () => {
    it('should hash a token using SHA-256', () => {
      const token = 'test-token';
      const hash = tokenService.hashToken(token);

      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });

    it('should produce consistent hashes for the same input', () => {
      const token = 'test-token';
      const hash1 = tokenService.hashToken(token);
      const hash2 = tokenService.hashToken(token);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = tokenService.hashToken('token1');
      const hash2 = tokenService.hashToken('token2');

      expect(hash1).not.toBe(hash2);
    });
  });
});
