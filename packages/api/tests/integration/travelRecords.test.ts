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

// Mock Date for validation - using a date that works for our tests
const MOCK_NOW = new Date('2024-06-15T12:00:00Z').getTime();
const OriginalDate = Date;

describe('Travel Records Integration Tests', () => {
  const testUserId = 'test-user-123';
  const testEmail = 'test@example.com';
  let validToken: string;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Date.now() for validation checks without breaking async operations
    vi.spyOn(global.Date, 'now').mockReturnValue(MOCK_NOW);

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

  describe('POST /api/v1/travel-records', () => {
    it('should create a travel record successfully', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: testUserId,
        countryCode: 'US',
        date: new Date('2024-06-10'),
        createdAt: new Date('2024-06-10T10:00:00Z'),
        updatedAt: new Date('2024-06-10T10:00:00Z'),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.travelRecord.create).mockResolvedValue(mockRecord);

      const response = await request(app)
        .post('/api/v1/travel-records')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          countryCode: 'US',
          date: '2024-06-10',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe('record-123');
      expect(response.body.countryCode).toBe('US');
      expect(response.body.countryName).toBe('United States');
      expect(response.body.date).toBe('2024-06-10');
    });

    it('should return 409 for duplicate record', async () => {
      const existingRecord = {
        id: 'existing-record-123',
        userId: testUserId,
        countryCode: 'US',
        date: new Date('2024-06-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(existingRecord);

      const response = await request(app)
        .post('/api/v1/travel-records')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          countryCode: 'US',
          date: '2024-06-10',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('DUPLICATE_RECORD');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records')
        .send({
          countryCode: 'US',
          date: '2024-06-10',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should return 400 for future date', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          countryCode: 'US',
          date: '2025-06-10',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid country code', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          countryCode: 'XX',
          date: '2024-06-10',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          countryCode: 'US',
          date: '10-06-2024',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should normalize lowercase country code to uppercase', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: testUserId,
        countryCode: 'US',
        date: new Date('2024-06-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.travelRecord.create).mockResolvedValue(mockRecord);

      const response = await request(app)
        .post('/api/v1/travel-records')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          countryCode: 'us',
          date: '2024-06-10',
        });

      expect(response.status).toBe(201);
      expect(response.body.countryCode).toBe('US');
    });
  });

  describe('DELETE /api/v1/travel-records/:id', () => {
    const validRecordId = '550e8400-e29b-41d4-a716-446655440000';

    it('should delete a record owned by user', async () => {
      const mockRecord = {
        id: validRecordId,
        userId: testUserId,
        countryCode: 'US',
        date: new Date('2024-06-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(mockRecord);
      vi.mocked(prisma.travelRecord.delete).mockResolvedValue(mockRecord);

      const response = await request(app)
        .delete(`/api/v1/travel-records/${validRecordId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Record deleted successfully');
    });

    it('should return 404 for non-existent record', async () => {
      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/travel-records/550e8400-e29b-41d4-a716-446655440000')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('NOT_FOUND');
    });

    it('should return 404 for record owned by another user (security)', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: 'other-user-456',
        countryCode: 'US',
        date: new Date('2024-06-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(mockRecord);

      const response = await request(app)
        .delete('/api/v1/travel-records/550e8400-e29b-41d4-a716-446655440000')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('NOT_FOUND');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/v1/travel-records/record-123');

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid record ID format', async () => {
      const response = await request(app)
        .delete('/api/v1/travel-records/invalid-uuid')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/travel-records', () => {
    it('should return records within date range', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          userId: testUserId,
          countryCode: 'US',
          date: new Date('2024-06-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'record-2',
          userId: testUserId,
          countryCode: 'GB',
          date: new Date('2024-06-10'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/api/v1/travel-records')
        .query({ start: '2024-06-01', end: '2024-06-15' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.records).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });

    it('should return empty array when no records in range', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/v1/travel-records')
        .query({ start: '2024-06-01', end: '2024-06-15' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.records).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should return 400 when start parameter is missing', async () => {
      const response = await request(app)
        .get('/api/v1/travel-records')
        .query({ end: '2024-06-15' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when end parameter is missing', async () => {
      const response = await request(app)
        .get('/api/v1/travel-records')
        .query({ start: '2024-06-01' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when start is after end', async () => {
      const response = await request(app)
        .get('/api/v1/travel-records')
        .query({ start: '2024-06-30', end: '2024-06-01' })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/travel-records')
        .query({ start: '2024-06-01', end: '2024-06-15' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/travel-records/bulk', () => {
    it('should perform bulk update successfully', async () => {
      const transactionMock = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          travelRecord: {
            deleteMany: vi.fn().mockResolvedValue({ count: 3 }),
            createMany: vi.fn().mockResolvedValue({ count: 4 }),
          },
        };
        return callback(tx);
      });

      vi.mocked(prisma.$transaction).mockImplementation(transactionMock);

      const response = await request(app)
        .post('/api/v1/travel-records/bulk')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          startDate: '2024-06-01',
          endDate: '2024-06-02',
          countryCodes: ['US', 'GB'],
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Records updated successfully');
      expect(response.body.deleted).toBe(3);
      expect(response.body.created).toBe(4);
    });

    it('should return 400 for empty countryCodes array', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/bulk')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          startDate: '2024-06-01',
          endDate: '2024-06-02',
          countryCodes: [],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for more than 10 countries', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/bulk')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          startDate: '2024-06-01',
          endDate: '2024-06-02',
          countryCodes: ['US', 'GB', 'FR', 'DE', 'JP', 'CA', 'AU', 'US', 'GB', 'FR', 'DE'],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when date range exceeds 365 days', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/bulk')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          startDate: '2022-01-01',
          endDate: '2024-01-01',
          countryCodes: ['US'],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for future dates', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/bulk')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          startDate: '2024-06-01',
          endDate: '2025-06-15',
          countryCodes: ['US'],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/travel-records/bulk')
        .send({
          startDate: '2024-06-01',
          endDate: '2024-06-02',
          countryCodes: ['US'],
        });

      expect(response.status).toBe(401);
    });
  });
});
