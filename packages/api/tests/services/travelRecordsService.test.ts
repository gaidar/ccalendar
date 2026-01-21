import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../src/utils/prisma.js';
import { travelRecordsService } from '../../src/services/travelRecordsService.js';
import { NotFoundError, ConflictError } from '../../src/middleware/errorHandler.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
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
    getCountryByCode: (code: string) => {
      const countries: Record<string, { code: string; name: string; color: string }> = {
        US: { code: 'US', name: 'United States', color: '#ff0000' },
        GB: { code: 'GB', name: 'United Kingdom', color: '#00ff00' },
        FR: { code: 'FR', name: 'France', color: '#0000ff' },
      };
      return countries[code.toUpperCase()] || null;
    },
    isValidCountryCode: (code: string) => {
      return ['US', 'GB', 'FR', 'DE', 'JP'].includes(code.toUpperCase());
    },
  },
}));

describe('TravelRecordsService', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createRecord', () => {
    it('should create a new travel record', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: mockUserId,
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date('2024-06-15T10:00:00Z'),
        updatedAt: new Date('2024-06-15T10:00:00Z'),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.travelRecord.create).mockResolvedValue(mockRecord);

      const result = await travelRecordsService.createRecord(
        mockUserId,
        '2024-06-15',
        'US'
      );

      expect(result).toEqual({
        id: 'record-123',
        date: '2024-06-15',
        countryCode: 'US',
        countryName: 'United States',
        createdAt: expect.any(String),
      });

      expect(prisma.travelRecord.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          date: expect.any(Date),
          countryCode: 'US',
        },
      });
    });

    it('should throw ConflictError for duplicate record', async () => {
      const existingRecord = {
        id: 'existing-record-123',
        userId: mockUserId,
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(existingRecord);

      await expect(
        travelRecordsService.createRecord(mockUserId, '2024-06-15', 'US')
      ).rejects.toThrow(ConflictError);
    });

    it('should normalize country code to uppercase', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: mockUserId,
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.travelRecord.create).mockResolvedValue(mockRecord);

      await travelRecordsService.createRecord(mockUserId, '2024-06-15', 'us');

      expect(prisma.travelRecord.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          date: expect.any(Date),
          countryCode: 'US',
        },
      });
    });
  });

  describe('deleteRecord', () => {
    it('should delete a record owned by user', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: mockUserId,
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(mockRecord);
      vi.mocked(prisma.travelRecord.delete).mockResolvedValue(mockRecord);

      await expect(
        travelRecordsService.deleteRecord(mockUserId, 'record-123')
      ).resolves.not.toThrow();

      expect(prisma.travelRecord.delete).toHaveBeenCalledWith({
        where: { id: 'record-123' },
      });
    });

    it('should throw NotFoundError for non-existent record', async () => {
      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);

      await expect(
        travelRecordsService.deleteRecord(mockUserId, 'non-existent-id')
      ).rejects.toThrow(NotFoundError);

      expect(prisma.travelRecord.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError for record owned by another user', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: 'other-user-456',
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(mockRecord);

      await expect(
        travelRecordsService.deleteRecord(mockUserId, 'record-123')
      ).rejects.toThrow(NotFoundError);

      expect(prisma.travelRecord.delete).not.toHaveBeenCalled();
    });
  });

  describe('getRecordsByDateRange', () => {
    it('should return records within date range', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          userId: mockUserId,
          countryCode: 'US',
          date: new Date('2024-06-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'record-2',
          userId: mockUserId,
          countryCode: 'GB',
          date: new Date('2024-06-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await travelRecordsService.getRecordsByDateRange(
        mockUserId,
        '2024-06-01',
        '2024-06-30'
      );

      expect(result.records).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.records[0].countryCode).toBe('US');
      expect(result.records[1].countryCode).toBe('GB');

      expect(prisma.travelRecord.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: [{ date: 'asc' }, { countryCode: 'asc' }],
      });
    });

    it('should return empty array when no records in range', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const result = await travelRecordsService.getRecordsByDateRange(
        mockUserId,
        '2024-06-01',
        '2024-06-30'
      );

      expect(result.records).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('bulkUpdateRecords', () => {
    it('should delete existing records and create new ones', async () => {
      const transactionMock = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          travelRecord: {
            deleteMany: vi.fn().mockResolvedValue({ count: 5 }),
            createMany: vi.fn().mockResolvedValue({ count: 6 }),
          },
        };
        return callback(tx);
      });

      vi.mocked(prisma.$transaction).mockImplementation(transactionMock);

      const result = await travelRecordsService.bulkUpdateRecords(
        mockUserId,
        '2024-06-01',
        '2024-06-03',
        ['US', 'GB']
      );

      expect(result.message).toBe('Records updated successfully');
      expect(result.deleted).toBe(5);
      expect(result.created).toBe(6); // 3 days * 2 countries = 6 records
    });

    it('should normalize country codes to uppercase', async () => {
      let createManyData: any[] = [];

      const transactionMock = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          travelRecord: {
            deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
            createMany: vi.fn().mockImplementation(({ data }) => {
              createManyData = data;
              return Promise.resolve({ count: data.length });
            }),
          },
        };
        return callback(tx);
      });

      vi.mocked(prisma.$transaction).mockImplementation(transactionMock);

      await travelRecordsService.bulkUpdateRecords(
        mockUserId,
        '2024-06-01',
        '2024-06-01',
        ['us', 'gb']
      );

      expect(createManyData.every((r) => r.countryCode === r.countryCode.toUpperCase())).toBe(true);
    });
  });

  describe('getRecordById', () => {
    it('should return record owned by user', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: mockUserId,
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(mockRecord);

      const result = await travelRecordsService.getRecordById(mockUserId, 'record-123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('record-123');
      expect(result?.countryCode).toBe('US');
    });

    it('should return null for non-existent record', async () => {
      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(null);

      const result = await travelRecordsService.getRecordById(mockUserId, 'non-existent');

      expect(result).toBeNull();
    });

    it('should return null for record owned by another user', async () => {
      const mockRecord = {
        id: 'record-123',
        userId: 'other-user-456',
        countryCode: 'US',
        date: new Date('2024-06-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.travelRecord.findUnique).mockResolvedValue(mockRecord);

      const result = await travelRecordsService.getRecordById(mockUserId, 'record-123');

      expect(result).toBeNull();
    });
  });
});
