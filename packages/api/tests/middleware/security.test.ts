import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { sanitizeInput } from '../../src/middleware/sanitize.js';
import {
  globalRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
} from '../../src/middleware/rateLimit.js';

// Create test app
function createTestApp() {
  const app = express();

  // Add helmet with same config as main app
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'http://localhost:3000'],
          fontSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  // Add CORS
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    })
  );

  app.use(express.json());
  app.use(sanitizeInput);

  // Test routes
  app.get('/test', (_req, res) => {
    res.json({ message: 'OK' });
  });

  app.post('/test', (req, res) => {
    res.json({ body: req.body });
  });

  return app;
}

describe('Security Headers (Helmet)', () => {
  const app = createTestApp();

  it('should set Content-Security-Policy header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
  });

  it('should set Strict-Transport-Security header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['strict-transport-security']).toBeDefined();
    expect(response.headers['strict-transport-security']).toContain('max-age=31536000');
    expect(response.headers['strict-transport-security']).toContain('includeSubDomains');
  });

  it('should set X-Frame-Options header to DENY', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['x-frame-options']).toBe('DENY');
  });

  it('should set X-Content-Type-Options header to nosniff', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should set Referrer-Policy header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  it('should set X-DNS-Prefetch-Control header', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
  });
});

describe('CORS Configuration', () => {
  const app = createTestApp();

  it('should allow requests from allowed origin', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:3000');
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('should allow credentials', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:3000');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should handle preflight requests', async () => {
    const response = await request(app)
      .options('/test')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST');
    expect(response.status).toBe(204);
  });
});

describe('Input Sanitization', () => {
  const app = createTestApp();

  it('should trim whitespace from string inputs', async () => {
    const response = await request(app)
      .post('/test')
      .send({ name: '  John Doe  ' });
    expect(response.body.body.name).toBe('John Doe');
  });

  it('should lowercase email addresses', async () => {
    const response = await request(app)
      .post('/test')
      .send({ email: 'John.DOE@Example.COM' });
    expect(response.body.body.email).toBe('john.doe@example.com');
  });

  it('should remove control characters', async () => {
    const response = await request(app)
      .post('/test')
      .send({ name: 'John\x00Doe\x08' });
    expect(response.body.body.name).toBe('JohnDoe');
  });

  it('should handle nested objects', async () => {
    const response = await request(app)
      .post('/test')
      .send({ user: { name: '  Jane  ', email: 'JANE@TEST.COM' } });
    expect(response.body.body.user.name).toBe('Jane');
    expect(response.body.body.user.email).toBe('jane@test.com');
  });

  it('should handle arrays', async () => {
    const response = await request(app)
      .post('/test')
      .send({ names: ['  Alice  ', '  Bob  '] });
    expect(response.body.body.names).toEqual(['Alice', 'Bob']);
  });

  it('should preserve non-string values', async () => {
    const response = await request(app)
      .post('/test')
      .send({ count: 42, active: true, data: null });
    expect(response.body.body.count).toBe(42);
    expect(response.body.body.active).toBe(true);
    expect(response.body.body.data).toBe(null);
  });
});

describe('Rate Limiting', () => {
  // Note: These tests verify the rate limiter configuration
  // Actual rate limiting behavior is tested with slower tests
  // that are skipped in normal test runs

  it('globalRateLimiter should be defined', () => {
    expect(globalRateLimiter).toBeDefined();
  });

  it('loginRateLimiter should be defined', () => {
    expect(loginRateLimiter).toBeDefined();
  });

  it('registerRateLimiter should be defined', () => {
    expect(registerRateLimiter).toBeDefined();
  });
});
