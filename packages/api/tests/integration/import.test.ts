import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { prisma } from '../../src/utils/prisma.js';
import { tokenService } from '../../src/services/tokenService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    travelRecord: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock countries service
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

// Mock rate limiter
vi.mock('../../src/services/importRateLimiter.js', () => ({
  redisImportRateLimiter: {
    checkAndIncrement: vi.fn(),
    reset: vi.fn(),
  },
  IMPORT_RATE_LIMIT: 10,
  IMPORT_RATE_LIMIT_WINDOW_MS: 3600000,
}));

import { redisImportRateLimiter } from '../../src/services/importRateLimiter.js';

const app = createTestApp();

// Mock Date for validation
const MOCK_NOW = new Date('2024-06-15T12:00:00Z').getTime();

describe('Import Integration Tests', () => {
  const testUserId = 'test-user-123';
  const testEmail = 'test@example.com';
  let validToken: string;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global.Date, 'now').mockReturnValue(MOCK_NOW);

    // Re-apply rate limiter mock after clearAllMocks
    vi.mocked(redisImportRateLimiter.checkAndIncrement).mockResolvedValue({
      allowed: true,
      limit: 10,
      remaining: 9,
      resetAt: Date.now() + 3600000,
    });

    validToken = tokenService.generateAccessToken({
      userId: testUserId,
      email: testEmail,
      isAdmin: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/v1/travel-records/import', () => {
    it('should import CSV file successfully', async () => {
      const transactionMock = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          travelRecord: {
            deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
            createMany: vi.fn().mockResolvedValue({ count: 3 }),
          },
        };
        return callback(tx);
      });

      vi.mocked(prisma.$transaction).mockImplementation(transactionMock);

      const csvContent = `date,country_code
2024-06-01,US
2024-06-02,GB
2024-06-02,FR`;

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(200);
      expect(response.body.imported).toBe(3);
      expect(response.body.deleted).toBe(2);
      expect(response.body.startDate).toBe('2024-06-01');
      expect(response.body.endDate).toBe('2024-06-02');
    });

    it('should import JSON file successfully', async () => {
      const transactionMock = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          travelRecord: {
            deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return callback(tx);
      });

      vi.mocked(prisma.$transaction).mockImplementation(transactionMock);

      const jsonContent = JSON.stringify([
        { date: '2024-06-01', countryCode: 'US' },
        { date: '2024-06-02', countryCode: 'GB' },
      ]);

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(jsonContent), 'import.json');

      expect(response.status).toBe(200);
      expect(response.body.imported).toBe(2);
      expect(response.body.startDate).toBe('2024-06-01');
      expect(response.body.endDate).toBe('2024-06-02');
    });

    it('should import JSON export format', async () => {
      const transactionMock = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          travelRecord: {
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return callback(tx);
      });

      vi.mocked(prisma.$transaction).mockImplementation(transactionMock);

      const jsonContent = JSON.stringify({
        exportDate: '2024-06-15T12:00:00Z',
        startDate: '2024-06-01',
        endDate: '2024-06-02',
        totalRecords: 2,
        records: [
          { date: '2024-06-01', countryCode: 'US', countryName: 'United States' },
          { date: '2024-06-02', countryCode: 'GB', countryName: 'United Kingdom' },
        ],
      });

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(jsonContent), 'export.json');

      expect(response.status).toBe(200);
      expect(response.body.imported).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const csvContent = `date,country_code
2024-06-01,US`;

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid file format', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from('some content'), 'import.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('INVALID_FORMAT');
    });

    it('should return 400 for invalid CSV structure', async () => {
      const csvContent = `wrong_header
some_value`;

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid JSON', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from('invalid json'), 'import.json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for validation errors with details', async () => {
      const csvContent = `date,country_code
2024-06-01,XX
invalid-date,US`;

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('invalid record');
    });

    it('should return 400 for future dates', async () => {
      const csvContent = `date,country_code
2025-06-01,US`;

      const response = await request(app)
        .post('/api/v1/travel-records/import')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('future');
    });
  });

  describe('POST /api/v1/travel-records/import/preview', () => {
    it('should preview CSV file successfully', async () => {
      const csvContent = `date,country_code
2024-06-01,US
2024-06-02,GB
2024-06-03,FR`;

      const response = await request(app)
        .post('/api/v1/travel-records/import/preview')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(200);
      expect(response.body.totalRecords).toBe(3);
      expect(response.body.startDate).toBe('2024-06-01');
      expect(response.body.endDate).toBe('2024-06-03');
      expect(response.body.sampleRecords).toHaveLength(3);
    });

    it('should limit sample records to 5', async () => {
      const records = Array.from({ length: 10 }, (_, i) =>
        `2024-06-${String(i + 1).padStart(2, '0')},US`
      ).join('\n');
      const csvContent = `date,country_code\n${records}`;

      const response = await request(app)
        .post('/api/v1/travel-records/import/preview')
        .set('Authorization', `Bearer ${validToken}`)
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(200);
      expect(response.body.totalRecords).toBe(10);
      expect(response.body.sampleRecords).toHaveLength(5);
    });

    it('should return 401 without authentication', async () => {
      const csvContent = `date,country_code
2024-06-01,US`;

      const response = await request(app)
        .post('/api/v1/travel-records/import/preview')
        .attach('file', Buffer.from(csvContent), 'import.csv');

      expect(response.status).toBe(401);
    });
  });
});
