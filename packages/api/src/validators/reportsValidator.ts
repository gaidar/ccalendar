import { z } from 'zod';

// Date format regex for YYYY-MM-DD
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Supported preset periods in days
export const PRESET_PERIODS = [7, 30, 90, 365] as const;
export type PresetPeriod = (typeof PRESET_PERIODS)[number];

// Maximum years for custom date range in reports
const MAX_CUSTOM_RANGE_YEARS = 5;

// Maximum years for export date range
const MAX_EXPORT_RANGE_YEARS = 10;

// Export rate limit
export const EXPORT_RATE_LIMIT = 5; // exports per hour
export const EXPORT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Calculates the difference in years between two dates
 */
function getYearsDifference(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays / 365;
}

/**
 * Schema for summary report query parameters
 * Supports either preset `days` or custom `start` and `end` dates
 */
export const summaryQuerySchema = z
  .object({
    days: z.coerce
      .number()
      .refine(val => PRESET_PERIODS.includes(val as PresetPeriod), {
        message: `Days must be one of: ${PRESET_PERIODS.join(', ')}`,
      })
      .optional(),
    start: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'Start date must be in YYYY-MM-DD format')
      .optional(),
    end: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'End date must be in YYYY-MM-DD format')
      .optional(),
  })
  .refine(
    data => {
      // Either days or both start and end must be provided
      const hasDays = data.days !== undefined;
      const hasCustomRange = data.start !== undefined && data.end !== undefined;
      return hasDays || hasCustomRange;
    },
    { message: 'Either days or both start and end dates are required' }
  )
  .refine(
    data => {
      // If days is provided, ignore start/end
      if (data.days !== undefined) return true;
      // If custom range, validate start <= end
      if (data.start && data.end) {
        return new Date(data.start) <= new Date(data.end);
      }
      return true;
    },
    { message: 'Start date must be before or equal to end date' }
  )
  .refine(
    data => {
      // If custom range, validate it doesn't exceed 5 years
      if (data.days !== undefined) return true;
      if (data.start && data.end) {
        const years = getYearsDifference(new Date(data.start), new Date(data.end));
        return years <= MAX_CUSTOM_RANGE_YEARS;
      }
      return true;
    },
    { message: `Custom date range cannot exceed ${MAX_CUSTOM_RANGE_YEARS} years` }
  );

/**
 * Schema for export query parameters
 */
export const exportQuerySchema = z
  .object({
    format: z.enum(['csv', 'xlsx', 'json'], {
      errorMap: () => ({ message: 'Format must be csv, xlsx, or json' }),
    }),
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
  )
  .refine(
    data => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      const years = getYearsDifference(start, end);
      return years <= MAX_EXPORT_RANGE_YEARS;
    },
    { message: `Export date range cannot exceed ${MAX_EXPORT_RANGE_YEARS} years` }
  );

// Type exports
export type SummaryQueryInput = z.infer<typeof summaryQuerySchema>;
export type ExportQueryInput = z.infer<typeof exportQuerySchema>;
export type ExportFormat = 'csv' | 'xlsx' | 'json';
