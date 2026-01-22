import { describe, it, expect, beforeEach, vi } from 'vitest';
import { importService } from '../../src/services/importService.js';

// Mock countries service
vi.mock('../../src/services/countriesService.js', () => ({
  countriesService: {
    isValidCountryCode: (code: string) => {
      return ['US', 'GB', 'FR', 'DE', 'JP', 'CA', 'AU'].includes(code.toUpperCase());
    },
  },
}));

// Mock prisma
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    travelRecord: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock Date for future date checks
const MOCK_NOW = new Date('2024-06-15T12:00:00Z').getTime();

describe('ImportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global.Date, 'now').mockReturnValue(MOCK_NOW);
  });

  describe('parseCsv', () => {
    it('should parse valid CSV with header row', () => {
      const csv = `date,country_code,country_name
2024-06-01,US,United States
2024-06-02,GB,United Kingdom`;

      const result = importService.parseCsv(csv);

      expect(result.records).toHaveLength(2);
      expect(result.records[0]).toEqual({ date: '2024-06-01', countryCode: 'US' });
      expect(result.records[1]).toEqual({ date: '2024-06-02', countryCode: 'GB' });
      expect(result.startDate).toBe('2024-06-01');
      expect(result.endDate).toBe('2024-06-02');
    });

    it('should handle countryCode as column name', () => {
      const csv = `date,countryCode
2024-06-01,US`;

      const result = importService.parseCsv(csv);

      expect(result.records).toHaveLength(1);
      expect(result.records[0].countryCode).toBe('US');
    });

    it('should normalize country codes to uppercase', () => {
      const csv = `date,country_code
2024-06-01,us
2024-06-02,gb`;

      const result = importService.parseCsv(csv);

      expect(result.records[0].countryCode).toBe('US');
      expect(result.records[1].countryCode).toBe('GB');
    });

    it('should deduplicate records', () => {
      const csv = `date,country_code
2024-06-01,US
2024-06-01,US
2024-06-01,GB`;

      const result = importService.parseCsv(csv);

      expect(result.records).toHaveLength(2);
    });

    it('should skip empty lines', () => {
      const csv = `date,country_code
2024-06-01,US

2024-06-02,GB`;

      const result = importService.parseCsv(csv);

      expect(result.records).toHaveLength(2);
    });

    it('should handle quoted fields', () => {
      const csv = `date,country_code,country_name
2024-06-01,US,"United States"
2024-06-02,GB,"United Kingdom, Great Britain"`;

      const result = importService.parseCsv(csv);

      expect(result.records).toHaveLength(2);
    });

    it('should throw error for missing date column', () => {
      const csv = `country_code
US`;

      expect(() => importService.parseCsv(csv)).toThrow('missing required column: date');
    });

    it('should throw error for missing country_code column', () => {
      const csv = `date
2024-06-01`;

      expect(() => importService.parseCsv(csv)).toThrow('missing required column: country_code');
    });

    it('should throw error for empty file (header only)', () => {
      const csv = `date,country_code`;

      expect(() => importService.parseCsv(csv)).toThrow('header row and at least one data row');
    });

    it('should throw error for invalid date format', () => {
      const csv = `date,country_code
01-06-2024,US`;

      expect(() => importService.parseCsv(csv)).toThrow('YYYY-MM-DD');
    });

    it('should throw error for future dates', () => {
      const csv = `date,country_code
2025-06-01,US`;

      expect(() => importService.parseCsv(csv)).toThrow('future dates');
    });

    it('should throw error for invalid country code', () => {
      const csv = `date,country_code
2024-06-01,XX`;

      expect(() => importService.parseCsv(csv)).toThrow('Invalid country code');
    });

    it('should include line number in validation errors', () => {
      const csv = `date,country_code
2024-06-01,US
invalid-date,GB`;

      expect(() => importService.parseCsv(csv)).toThrow('Line 3');
    });
  });

  describe('parseJson', () => {
    it('should parse JSON array of records', () => {
      const json = JSON.stringify([
        { date: '2024-06-01', countryCode: 'US' },
        { date: '2024-06-02', countryCode: 'GB' },
      ]);

      const result = importService.parseJson(json);

      expect(result.records).toHaveLength(2);
      expect(result.startDate).toBe('2024-06-01');
      expect(result.endDate).toBe('2024-06-02');
    });

    it('should parse JSON with records array (export format)', () => {
      const json = JSON.stringify({
        exportDate: '2024-06-15T12:00:00Z',
        startDate: '2024-06-01',
        endDate: '2024-06-02',
        totalRecords: 2,
        records: [
          { date: '2024-06-01', countryCode: 'US', countryName: 'United States' },
          { date: '2024-06-02', countryCode: 'GB', countryName: 'United Kingdom' },
        ],
      });

      const result = importService.parseJson(json);

      expect(result.records).toHaveLength(2);
    });

    it('should handle country_code field name', () => {
      const json = JSON.stringify([
        { date: '2024-06-01', country_code: 'US' },
      ]);

      const result = importService.parseJson(json);

      expect(result.records[0].countryCode).toBe('US');
    });

    it('should normalize country codes to uppercase', () => {
      const json = JSON.stringify([
        { date: '2024-06-01', countryCode: 'us' },
      ]);

      const result = importService.parseJson(json);

      expect(result.records[0].countryCode).toBe('US');
    });

    it('should deduplicate records', () => {
      const json = JSON.stringify([
        { date: '2024-06-01', countryCode: 'US' },
        { date: '2024-06-01', countryCode: 'US' },
      ]);

      const result = importService.parseJson(json);

      expect(result.records).toHaveLength(1);
    });

    it('should throw error for invalid JSON', () => {
      const json = 'invalid json';

      expect(() => importService.parseJson(json)).toThrow('Invalid JSON');
    });

    it('should throw error for missing records', () => {
      const json = JSON.stringify({ someField: 'value' });

      expect(() => importService.parseJson(json)).toThrow('records');
    });

    it('should throw error for empty records array', () => {
      const json = JSON.stringify([]);

      expect(() => importService.parseJson(json)).toThrow('no records');
    });

    it('should throw error for invalid date format', () => {
      const json = JSON.stringify([
        { date: '01-06-2024', countryCode: 'US' },
      ]);

      expect(() => importService.parseJson(json)).toThrow('YYYY-MM-DD');
    });

    it('should throw error for future dates', () => {
      const json = JSON.stringify([
        { date: '2025-06-01', countryCode: 'US' },
      ]);

      expect(() => importService.parseJson(json)).toThrow('future dates');
    });

    it('should throw error for invalid country code', () => {
      const json = JSON.stringify([
        { date: '2024-06-01', countryCode: 'XX' },
      ]);

      expect(() => importService.parseJson(json)).toThrow('Invalid country code');
    });

    it('should include index in validation errors', () => {
      const json = JSON.stringify([
        { date: '2024-06-01', countryCode: 'US' },
        { date: 'invalid-date', countryCode: 'GB' },
      ]);

      expect(() => importService.parseJson(json)).toThrow('Index 1');
    });
  });
});
