import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  countryCodeSchema,
  dateSchema,
  createRecordSchema,
  dateRangeQuerySchema,
  bulkUpdateSchema,
  recordIdSchema,
} from '../../src/validators/countryValidator.js';

// Mock the countriesService
vi.mock('../../src/services/countriesService.js', () => ({
  countriesService: {
    isValidCountryCode: (code: string) => {
      const validCodes = ['US', 'GB', 'FR', 'DE', 'JP', 'CA', 'AU'];
      return validCodes.includes(code.toUpperCase());
    },
  },
}));

describe('Travel Record Validators', () => {
  describe('countryCodeSchema', () => {
    it('should accept valid country code', () => {
      const result = countryCodeSchema.safeParse('US');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('US');
      }
    });

    it('should normalize lowercase to uppercase', () => {
      const result = countryCodeSchema.safeParse('us');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('US');
      }
    });

    it('should reject empty string', () => {
      const result = countryCodeSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject code with wrong length (1 char)', () => {
      const result = countryCodeSchema.safeParse('U');
      expect(result.success).toBe(false);
    });

    it('should reject code with wrong length (3 chars)', () => {
      const result = countryCodeSchema.safeParse('USA');
      expect(result.success).toBe(false);
    });

    it('should reject invalid country code', () => {
      const result = countryCodeSchema.safeParse('XX');
      expect(result.success).toBe(false);
    });
  });

  describe('dateSchema', () => {
    const MOCK_NOW = new Date('2024-06-15T12:00:00Z').getTime();

    beforeEach(() => {
      // Mock Date.now to return a fixed date: 2024-06-15
      vi.spyOn(global.Date, 'now').mockReturnValue(MOCK_NOW);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should accept valid date in YYYY-MM-DD format', () => {
      const result = dateSchema.safeParse('2024-06-15');
      expect(result.success).toBe(true);
    });

    it('should accept past date', () => {
      const result = dateSchema.safeParse('2024-01-01');
      expect(result.success).toBe(true);
    });

    it('should reject future date', () => {
      const result = dateSchema.safeParse('2025-01-01');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('future');
      }
    });

    it('should reject date more than 100 years in the past', () => {
      const result = dateSchema.safeParse('1900-01-01');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('100 years');
      }
    });

    it('should reject invalid date format (DD-MM-YYYY)', () => {
      const result = dateSchema.safeParse('15-06-2024');
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format (MM/DD/YYYY)', () => {
      const result = dateSchema.safeParse('06/15/2024');
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = dateSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject invalid date values', () => {
      const result = dateSchema.safeParse('2024-13-45');
      expect(result.success).toBe(false);
    });
  });

  describe('createRecordSchema', () => {
    const MOCK_NOW = new Date('2024-06-15T12:00:00Z').getTime();

    beforeEach(() => {
      vi.spyOn(global.Date, 'now').mockReturnValue(MOCK_NOW);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should accept valid create record input', () => {
      const result = createRecordSchema.safeParse({
        countryCode: 'US',
        date: '2024-06-10',
      });
      expect(result.success).toBe(true);
    });

    it('should normalize country code to uppercase', () => {
      const result = createRecordSchema.safeParse({
        countryCode: 'us',
        date: '2024-06-10',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe('US');
      }
    });

    it('should reject missing countryCode', () => {
      const result = createRecordSchema.safeParse({
        date: '2024-06-10',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing date', () => {
      const result = createRecordSchema.safeParse({
        countryCode: 'US',
      });
      expect(result.success).toBe(false);
    });

    it('should reject future date', () => {
      const result = createRecordSchema.safeParse({
        countryCode: 'US',
        date: '2025-06-10',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid country code', () => {
      const result = createRecordSchema.safeParse({
        countryCode: 'XX',
        date: '2024-06-10',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('dateRangeQuerySchema', () => {
    it('should accept valid date range', () => {
      const result = dateRangeQuerySchema.safeParse({
        start: '2024-01-01',
        end: '2024-01-31',
      });
      expect(result.success).toBe(true);
    });

    it('should accept same start and end date', () => {
      const result = dateRangeQuerySchema.safeParse({
        start: '2024-01-15',
        end: '2024-01-15',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when start is after end', () => {
      const result = dateRangeQuerySchema.safeParse({
        start: '2024-01-31',
        end: '2024-01-01',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('before or equal');
      }
    });

    it('should reject missing start', () => {
      const result = dateRangeQuerySchema.safeParse({
        end: '2024-01-31',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing end', () => {
      const result = dateRangeQuerySchema.safeParse({
        start: '2024-01-01',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format in start', () => {
      const result = dateRangeQuerySchema.safeParse({
        start: '01-01-2024',
        end: '2024-01-31',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format in end', () => {
      const result = dateRangeQuerySchema.safeParse({
        start: '2024-01-01',
        end: '31-01-2024',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('bulkUpdateSchema', () => {
    const MOCK_NOW = new Date('2024-06-15T12:00:00Z').getTime();

    beforeEach(() => {
      vi.spyOn(global.Date, 'now').mockReturnValue(MOCK_NOW);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should accept valid bulk update input', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        countryCodes: ['US', 'GB'],
      });
      expect(result.success).toBe(true);
    });

    it('should accept single country', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        countryCodes: ['US'],
      });
      expect(result.success).toBe(true);
    });

    it('should normalize country codes to uppercase', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        countryCodes: ['us', 'gb'],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCodes).toEqual(['US', 'GB']);
      }
    });

    it('should reject empty countryCodes array', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        countryCodes: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one country');
      }
    });

    it('should reject more than 10 countries', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        countryCodes: ['US', 'GB', 'FR', 'DE', 'JP', 'CA', 'AU', 'US', 'GB', 'FR', 'DE'],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Maximum 10 countries');
      }
    });

    it('should reject when start date is after end date', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-10',
        endDate: '2024-06-01',
        countryCodes: ['US'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject date range exceeding 365 days', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2022-01-01',
        endDate: '2024-01-01',
        countryCodes: ['US'],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasRangeError = result.error.issues.some(
          issue => issue.message.includes('365 days')
        );
        expect(hasRangeError).toBe(true);
      }
    });

    it('should reject future dates', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2025-06-10',
        countryCodes: ['US'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid country code in array', () => {
      const result = bulkUpdateSchema.safeParse({
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        countryCodes: ['US', 'XX'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('recordIdSchema', () => {
    it('should accept valid UUID', () => {
      const result = recordIdSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      const result = recordIdSchema.safeParse({
        id: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = recordIdSchema.safeParse({
        id: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing id', () => {
      const result = recordIdSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
