import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { prisma } from '../../src/utils/prisma.js';
import { tokenService } from '../../src/services/tokenService.js';

// Track Redis rate limit counts per user
const mockRedisStore = new Map<string, { count: number; expireAt: number }>();

// Mock Redis client
vi.mock('../../src/utils/redis.js', () => ({
  getRedisClient: () => ({
    incr: vi.fn(async (key: string) => {
      const existing = mockRedisStore.get(key);
      if (existing && existing.expireAt > Date.now()) {
        existing.count++;
        return existing.count;
      }
      mockRedisStore.set(key, { count: 1, expireAt: Date.now() + 3600000 });
      return 1;
    }),
    expire: vi.fn(async () => true),
    ttl: vi.fn(async (key: string) => {
      const existing = mockRedisStore.get(key);
      if (existing && existing.expireAt > Date.now()) {
        return Math.ceil((existing.expireAt - Date.now()) / 1000);
      }
      return -2;
    }),
    get: vi.fn(async (key: string) => {
      const existing = mockRedisStore.get(key);
      if (existing && existing.expireAt > Date.now()) {
        return String(existing.count);
      }
      return null;
    }),
    del: vi.fn(async (key: string) => {
      mockRedisStore.delete(key);
      return 1;
    }),
  }),
  isRedisAvailable: () => true,
  disconnectRedis: vi.fn(),
}));

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    travelRecord: {
      findMany: vi.fn(),
    },
  },
}));

// Mock countries service for validation
vi.mock('../../src/services/countriesService.js', () => ({
  countriesService: {
    getAllCountries: () => [
      { code: 'US', name: 'United States', color: '#ff0000' },
      { code: 'GB', name: 'United Kingdom', color: '#00ff00' },
      { code: 'FR', name: 'France', color: '#0000ff' },
    ],
    getCountryByCode: (code: string) => {
      const countries: Record<string, { code: string; name: string; color: string }> = {
        US: { code: 'US', name: 'United States', color: '#ff0000' },
        GB: { code: 'GB', name: 'United Kingdom', color: '#00ff00' },
        FR: { code: 'FR', name: 'France', color: '#0000ff' },
      };
      return countries[code.toUpperCase()] || null;
    },
    isValidCountryCode: (code: string) => {
      return ['US', 'GB', 'FR', 'DE', 'JP', 'CA', 'AU'].includes(code.toUpperCase());
    },
    getCountryCount: () => 249,
  },
}));

const app = createTestApp();

describe('Reports Integration Tests', () => {
  const testUserId = 'test-user-123';
  const testEmail = 'test@example.com';
  let validToken: string;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRedisStore.clear();

    // Generate a valid access token
    validToken = tokenService.generateAccessToken({
      userId: testUserId,
      email: testEmail,
      isAdmin: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/v1/reports/summary', () => {
    it('should return summary with preset days parameter', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-02'), countryCode: 'US' },
        { date: new Date('2024-06-03'), countryCode: 'GB' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ days: 30 })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalDays).toBe(3);
      expect(response.body.totalCountries).toBe(2);
      expect(response.body.topCountries).toHaveLength(2);
      expect(response.body.period).toBeDefined();
      expect(response.body.period.start).toBeDefined();
      expect(response.body.period.end).toBeDefined();
    });

    it('should return summary with custom date range', async () => {
      const mockRecords = [
        { date: new Date('2024-01-15'), countryCode: 'US' },
        { date: new Date('2024-01-20'), countryCode: 'FR' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ start: '2024-01-01', end: '2024-01-31' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalDays).toBe(2);
      expect(response.body.totalCountries).toBe(2);
      expect(response.body.period.start).toBe('2024-01-01');
      expect(response.body.period.end).toBe('2024-01-31');
    });

    it('should return zeros for user with no records', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ days: 30 })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalDays).toBe(0);
      expect(response.body.totalCountries).toBe(0);
      expect(response.body.topCountries).toHaveLength(0);
    });

    it('should return 400 for invalid preset days', async () => {
      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ days: 15 })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when neither days nor date range provided', async () => {
      const response = await request(app)
        .get('/api/v1/reports/summary')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when custom range exceeds 5 years', async () => {
      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ start: '2015-01-01', end: '2024-01-01' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when start date is after end date', async () => {
      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ start: '2024-12-01', end: '2024-01-01' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/reports/summary')
        .query({ days: 30 });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/reports/statistics', () => {
    it('should return country statistics with percentages', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-02'), countryCode: 'US' },
        { date: new Date('2024-06-03'), countryCode: 'GB' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/api/v1/reports/statistics')
        .query({ days: 30 })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.countries).toHaveLength(2);
      expect(response.body.countries[0].code).toBe('US');
      expect(response.body.countries[0].days).toBe(2);
      expect(response.body.countries[0].percentage).toBe(100);
      expect(response.body.countries[1].code).toBe('GB');
      expect(response.body.countries[1].percentage).toBe(50);
      expect(response.body.totalDays).toBe(3);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/reports/statistics')
        .query({ days: 30 });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/reports/export', () => {
    it('should export to CSV successfully', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-02'), countryCode: 'GB' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv', start: '2024-06-01', end: '2024-06-30' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.headers['content-disposition']).toContain('.csv');

      // Check CSV content
      const csvContent = response.text;
      expect(csvContent).toContain('date,country_code,country_name');
      expect(csvContent).toContain('2024-06-01,US,United States');
      expect(csvContent).toContain('2024-06-02,GB,United Kingdom');
    });

    it('should export to XLSX successfully', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'xlsx', start: '2024-06-01', end: '2024-06-30' })
        .set('Authorization', `Bearer ${validToken}`)
        .buffer(true);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.headers['content-disposition']).toContain('.xlsx');
    });

    it('should include rate limit headers', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv', start: '2024-06-01', end: '2024-06-30' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBe('4');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });

    it('should return 429 when rate limit exceeded', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      // Make 5 requests to exhaust the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/v1/reports/export')
          .query({ format: 'csv', start: '2024-06-01', end: '2024-06-30' })
          .set('Authorization', `Bearer ${validToken}`);
      }

      // 6th request should be rate limited
      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv', start: '2024-06-01', end: '2024-06-30' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(429);
      expect(response.body.error).toBe('RATE_LIMITED');
      expect(response.headers['retry-after']).toBeDefined();
    });

    it('should return 400 for invalid format', async () => {
      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'pdf', start: '2024-06-01', end: '2024-06-30' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when date range missing', async () => {
      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when date range exceeds 10 years', async () => {
      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv', start: '2010-01-01', end: '2024-01-01' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv', start: '2024-06-01', end: '2024-06-30' });

      expect(response.status).toBe(401);
    });

    it('should export empty file with only header when no records', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/v1/reports/export')
        .query({ format: 'csv', start: '2024-06-01', end: '2024-06-30' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);

      // Should have header row but no data rows
      const lines = response.text.trim().split('\n');
      expect(lines).toHaveLength(1);
      expect(lines[0]).toBe('date,country_code,country_name');
    });
  });
});
