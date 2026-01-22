import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { config } from '../../src/config/index.js';

// Mock config
vi.mock('../../src/config/index.js', () => ({
  config: {
    env: 'development',
    port: 3001,
    jwt: {
      secret: 'test-secret-key-that-is-at-least-32-chars-long',
      accessExpiry: '15m',
      refreshExpiry: '7d',
    },
    frontend: {
      url: 'http://localhost:3000',
    },
    oauth: {
      google: {
        clientId: undefined,
        clientSecret: undefined,
        get isConfigured() {
          return !!(this.clientId && this.clientSecret);
        },
      },
      facebook: {
        appId: undefined,
        appSecret: undefined,
        get isConfigured() {
          return !!(this.appId && this.appSecret);
        },
      },
      apple: {
        clientId: undefined,
        teamId: undefined,
        keyId: undefined,
        privateKey: undefined,
        get isConfigured() {
          return !!(this.clientId && this.teamId && this.keyId && this.privateKey);
        },
      },
      get isEnabled() {
        return config.env === 'production' && (
          this.google.isConfigured || this.facebook.isConfigured || this.apple.isConfigured
        );
      },
    },
    email: {
      mailgunApiKey: undefined,
      mailgunDomain: undefined,
      from: 'noreply@countrycalendar.app',
      replyTo: 'support@countrycalendar.app',
      adminEmail: undefined,
      isConfigured: false,
    },
    recaptcha: {
      publicKey: undefined,
      privateKey: undefined,
      isRequired: false,
    },
  },
}));

// Mock Prisma
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    oAuth: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
    },
  },
}));

const app = createTestApp();

describe('OAuth Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/auth/providers', () => {
    it('should return empty providers in development', async () => {
      const response = await request(app)
        .get('/api/v1/auth/providers');

      expect(response.status).toBe(200);
      expect(response.body.providers).toEqual([]);
    });

    it('should return configured providers in production', async () => {
      // Temporarily switch to production mode with configured providers
      vi.mocked(config).env = 'production';
      vi.mocked(config.oauth.google).clientId = 'google-client-id';
      vi.mocked(config.oauth.google).clientSecret = 'google-client-secret';

      const response = await request(app)
        .get('/api/v1/auth/providers');

      expect(response.status).toBe(200);
      expect(response.body.providers).toContain('google');

      // Reset
      vi.mocked(config).env = 'development';
      vi.mocked(config.oauth.google).clientId = undefined;
      vi.mocked(config.oauth.google).clientSecret = undefined;
    });
  });

  describe('GET /api/v1/auth/google', () => {
    it('should return error when provider not available', async () => {
      const response = await request(app)
        .get('/api/v1/auth/google');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('not available');
    });
  });

  describe('GET /api/v1/auth/facebook', () => {
    it('should return error when provider not available', async () => {
      const response = await request(app)
        .get('/api/v1/auth/facebook');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('not available');
    });
  });

  describe('POST /api/v1/auth/apple/callback', () => {
    it('should return error when provider not available', async () => {
      const response = await request(app)
        .post('/api/v1/auth/apple/callback')
        .send({ id_token: 'test-token' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('not available');
    });

    it('should return error when id_token missing', async () => {
      // Enable Apple in production
      vi.mocked(config).env = 'production';
      vi.mocked(config.oauth.apple).clientId = 'apple-client-id';
      vi.mocked(config.oauth.apple).teamId = 'apple-team-id';
      vi.mocked(config.oauth.apple).keyId = 'apple-key-id';
      vi.mocked(config.oauth.apple).privateKey = 'apple-private-key';

      const response = await request(app)
        .post('/api/v1/auth/apple/callback')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('token is required');

      // Reset
      vi.mocked(config).env = 'development';
      vi.mocked(config.oauth.apple).clientId = undefined;
      vi.mocked(config.oauth.apple).teamId = undefined;
      vi.mocked(config.oauth.apple).keyId = undefined;
      vi.mocked(config.oauth.apple).privateKey = undefined;
    });
  });
});
