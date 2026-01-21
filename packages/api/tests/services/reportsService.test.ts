import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../src/utils/prisma.js';
import { reportsService } from '../../src/services/reportsService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    travelRecord: {
      findMany: vi.fn(),
    },
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
        DE: { code: 'DE', name: 'Germany', color: '#ffff00' },
        JP: { code: 'JP', name: 'Japan', color: '#ff00ff' },
      };
      return countries[code.toUpperCase()] || null;
    },
    isValidCountryCode: (code: string) => {
      return ['US', 'GB', 'FR', 'DE', 'JP'].includes(code.toUpperCase());
    },
  },
}));

describe('ReportsService', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return correct summary with preset period', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-01'), countryCode: 'GB' }, // Same day, different country
        { date: new Date('2024-06-02'), countryCode: 'US' },
        { date: new Date('2024-06-03'), countryCode: 'FR' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getSummary(mockUserId, 30);

      // Total unique days: 3 (June 1, 2, 3)
      expect(result.totalDays).toBe(3);

      // Total unique countries: 3 (US, GB, FR)
      expect(result.totalCountries).toBe(3);

      // Top countries should be sorted by days
      expect(result.topCountries).toHaveLength(3);
      expect(result.topCountries[0].code).toBe('US'); // 2 days
      expect(result.topCountries[0].days).toBe(2);
      expect(result.topCountries[1].days).toBe(1); // GB and FR have 1 day each

      // Period should be present
      expect(result.period.start).toBeDefined();
      expect(result.period.end).toBeDefined();
    });

    it('should return correct summary with custom date range', async () => {
      const mockRecords = [
        { date: new Date('2024-01-15'), countryCode: 'US' },
        { date: new Date('2024-01-20'), countryCode: 'GB' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getSummary(
        mockUserId,
        '2024-01-01',
        '2024-01-31'
      );

      expect(result.totalDays).toBe(2);
      expect(result.totalCountries).toBe(2);
      expect(result.period.start).toBe('2024-01-01');
      expect(result.period.end).toBe('2024-01-31');
    });

    it('should return zeros for empty data', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const result = await reportsService.getSummary(mockUserId, 30);

      expect(result.totalDays).toBe(0);
      expect(result.totalCountries).toBe(0);
      expect(result.topCountries).toHaveLength(0);
    });

    it('should count multiple countries on same day correctly', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-01'), countryCode: 'GB' },
        { date: new Date('2024-06-01'), countryCode: 'FR' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getSummary(mockUserId, 7);

      // Only 1 unique day
      expect(result.totalDays).toBe(1);

      // But 3 unique countries
      expect(result.totalCountries).toBe(3);

      // Each country has 1 day
      expect(result.topCountries).toHaveLength(3);
      expect(result.topCountries.every(c => c.days === 1)).toBe(true);
    });

    it('should include country name and color in top countries', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getSummary(mockUserId, 7);

      expect(result.topCountries[0]).toEqual({
        code: 'US',
        name: 'United States',
        color: '#ff0000',
        days: 1,
      });
    });

    it('should handle unknown country codes gracefully', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'XX' }, // Unknown
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getSummary(mockUserId, 7);

      expect(result.topCountries[0].code).toBe('XX');
      expect(result.topCountries[0].name).toBe('Unknown');
      expect(result.topCountries[0].color).toBe('#888888');
    });
  });

  describe('getCountryStatistics', () => {
    it('should return country statistics with percentages', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-02'), countryCode: 'US' },
        { date: new Date('2024-06-03'), countryCode: 'US' },
        { date: new Date('2024-06-04'), countryCode: 'US' },
        { date: new Date('2024-06-05'), countryCode: 'GB' },
        { date: new Date('2024-06-06'), countryCode: 'GB' },
        { date: new Date('2024-06-07'), countryCode: 'FR' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getCountryStatistics(mockUserId, 30);

      expect(result.countries).toHaveLength(3);

      // US has 4 days (100% - max)
      expect(result.countries[0].code).toBe('US');
      expect(result.countries[0].days).toBe(4);
      expect(result.countries[0].percentage).toBe(100);

      // GB has 2 days (50% of max)
      expect(result.countries[1].code).toBe('GB');
      expect(result.countries[1].days).toBe(2);
      expect(result.countries[1].percentage).toBe(50);

      // FR has 1 day (25% of max)
      expect(result.countries[2].code).toBe('FR');
      expect(result.countries[2].days).toBe(1);
      expect(result.countries[2].percentage).toBe(25);

      expect(result.totalDays).toBe(7);
    });

    it('should handle empty data', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const result = await reportsService.getCountryStatistics(mockUserId, 30);

      expect(result.countries).toHaveLength(0);
      expect(result.totalDays).toBe(0);
    });
  });

  describe('getRecordsForExport', () => {
    it('should return formatted records for export', async () => {
      const mockRecords = [
        { date: new Date('2024-06-01'), countryCode: 'US' },
        { date: new Date('2024-06-02'), countryCode: 'GB' },
      ];

      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue(mockRecords);

      const result = await reportsService.getRecordsForExport(
        mockUserId,
        '2024-06-01',
        '2024-06-30'
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: '2024-06-01',
        countryCode: 'US',
        countryName: 'United States',
      });
      expect(result[1]).toEqual({
        date: '2024-06-02',
        countryCode: 'GB',
        countryName: 'United Kingdom',
      });
    });

    it('should query database with correct date range', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      await reportsService.getRecordsForExport(
        mockUserId,
        '2024-01-01',
        '2024-12-31'
      );

      expect(prisma.travelRecord.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: [{ date: 'asc' }, { countryCode: 'asc' }],
        select: {
          date: true,
          countryCode: true,
        },
      });
    });

    it('should return empty array when no records', async () => {
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      const result = await reportsService.getRecordsForExport(
        mockUserId,
        '2024-01-01',
        '2024-12-31'
      );

      expect(result).toHaveLength(0);
    });
  });
});
