import { z } from 'zod';
import { countriesService } from '../services/countriesService.js';

// Date format regex for YYYY-MM-DD
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Maximum years in the past for travel records
const MAX_YEARS_IN_PAST = 100;

// Maximum countries per bulk update
const MAX_BULK_COUNTRIES = 10;

// Maximum days per bulk update range
const MAX_BULK_DAYS = 365;

/**
 * Validates and normalizes a country code to uppercase ISO 3166-1 alpha-2
 */
export const countryCodeSchema = z
  .string()
  .min(1, 'Country code is required')
  .length(2, 'Country code must be exactly 2 characters')
  .transform(code => code.toUpperCase())
  .refine(code => countriesService.isValidCountryCode(code), {
    message: 'Invalid country code',
  });

/**
 * Gets the current date (end of day) for comparison
 * Uses Date.now() to enable mocking in tests
 */
function getCurrentDateEndOfDay(): Date {
  const today = new Date(Date.now());
  today.setHours(23, 59, 59, 999);
  return today;
}

/**
 * Gets the minimum allowed date (100 years ago)
 * Uses Date.now() to enable mocking in tests
 */
function getMinAllowedDate(): Date {
  const minDate = new Date(Date.now());
  minDate.setFullYear(minDate.getFullYear() - MAX_YEARS_IN_PAST);
  return minDate;
}

export const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .regex(DATE_FORMAT_REGEX, 'Date must be in YYYY-MM-DD format')
  .refine(
    dateStr => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid date' }
  )
  .refine(
    dateStr => {
      const date = new Date(dateStr);
      return date <= getCurrentDateEndOfDay();
    },
    { message: 'Cannot add travel records for future dates' }
  )
  .refine(
    dateStr => {
      const date = new Date(dateStr);
      return date >= getMinAllowedDate();
    },
    { message: `Date cannot be more than ${MAX_YEARS_IN_PAST} years in the past` }
  );

/**
 * Schema for creating a single travel record
 */
export const createRecordSchema = z.object({
  countryCode: countryCodeSchema,
  date: dateSchema,
});

/**
 * Schema for date range query parameters
 */
export const dateRangeQuerySchema = z
  .object({
    start: z
      .string()
      .min(1, 'Start date is required')
      .regex(DATE_FORMAT_REGEX, 'Start date must be in YYYY-MM-DD format'),
    end: z
      .string()
      .min(1, 'End date is required')
      .regex(DATE_FORMAT_REGEX, 'End date must be in YYYY-MM-DD format'),
  })
  .refine(
    data => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      return start <= end;
    },
    { message: 'Start date must be before or equal to end date' }
  );

/**
 * Schema for bulk update requests
 */
export const bulkUpdateSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema,
    countryCodes: z
      .array(countryCodeSchema)
      .min(1, 'At least one country is required')
      .max(MAX_BULK_COUNTRIES, `Maximum ${MAX_BULK_COUNTRIES} countries per bulk update`),
  })
  .refine(
    data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    { message: 'Start date must be before or equal to end date' }
  )
  .refine(
    data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end
      return diffDays <= MAX_BULK_DAYS;
    },
    { message: `Date range cannot exceed ${MAX_BULK_DAYS} days` }
  );

/**
 * Schema for validating record ID parameter
 */
export const recordIdSchema = z.object({
  id: z.string().uuid('Invalid record ID format'),
});

// Type exports
export type CountryCode = z.infer<typeof countryCodeSchema>;
export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
export type BulkUpdateInput = z.infer<typeof bulkUpdateSchema>;
export type RecordIdParam = z.infer<typeof recordIdSchema>;
