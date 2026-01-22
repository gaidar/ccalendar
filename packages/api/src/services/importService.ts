import { prisma } from '../utils/prisma.js';
import { countriesService } from './countriesService.js';
import { ValidationError } from '../middleware/errorHandler.js';
import type { JsonExportData } from './exportService.js';

export interface ImportRecord {
  date: string;
  countryCode: string;
}

export interface ImportResult {
  imported: number;
  deleted: number;
  startDate: string;
  endDate: string;
}

export interface ParsedImportData {
  records: ImportRecord[];
  startDate: string;
  endDate: string;
}

export interface ImportValidationError {
  line?: number;
  index?: number;
  field: string;
  message: string;
}

// Date format regex for YYYY-MM-DD
const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks if a date is in the future
 * Uses Date.now() to enable mocking in tests
 */
function isFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date(Date.now());
  today.setHours(23, 59, 59, 999);
  return date > today;
}

class ImportService {
  /**
   * Parse CSV content into import records
   */
  parseCsv(content: string): ParsedImportData {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length < 2) {
      throw new ValidationError('CSV file must have a header row and at least one data row');
    }

    // Parse header row (case-insensitive)
    const headerRow = lines[0].toLowerCase();
    const headers = headerRow.split(',').map(h => h.trim());

    const dateIndex = headers.findIndex(h => h === 'date');
    const countryIndex = headers.findIndex(h => h === 'country_code' || h === 'countrycode');

    if (dateIndex === -1) {
      throw new ValidationError('CSV is missing required column: date');
    }
    if (countryIndex === -1) {
      throw new ValidationError('CSV is missing required column: country_code or countryCode');
    }

    const records: ImportRecord[] = [];
    const errors: ImportValidationError[] = [];
    const seen = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      const values = this.parseCsvLine(line);
      const date = values[dateIndex]?.trim();
      const countryCode = values[countryIndex]?.trim().toUpperCase();

      // Validate date
      if (!date) {
        errors.push({ line: i + 1, field: 'date', message: 'Date is required' });
        continue;
      }
      if (!DATE_FORMAT_REGEX.test(date)) {
        errors.push({ line: i + 1, field: 'date', message: 'Date must be in YYYY-MM-DD format' });
        continue;
      }
      if (isFutureDate(date)) {
        errors.push({ line: i + 1, field: 'date', message: 'Cannot import future dates' });
        continue;
      }

      // Validate country code
      if (!countryCode) {
        errors.push({ line: i + 1, field: 'country_code', message: 'Country code is required' });
        continue;
      }
      if (countryCode.length !== 2) {
        errors.push({ line: i + 1, field: 'country_code', message: 'Country code must be exactly 2 characters' });
        continue;
      }
      if (!countriesService.isValidCountryCode(countryCode)) {
        errors.push({ line: i + 1, field: 'country_code', message: `Invalid country code: ${countryCode}` });
        continue;
      }

      // Deduplicate
      const key = `${date}:${countryCode}`;
      if (!seen.has(key)) {
        seen.add(key);
        records.push({ date, countryCode });
      }
    }

    if (errors.length > 0) {
      const errorDetails = errors.slice(0, 10).map(e =>
        `Line ${e.line}: ${e.field} - ${e.message}`
      ).join('; ');
      throw new ValidationError(
        `Import validation failed: ${errors.length} invalid record(s). ${errorDetails}`,
        errors.slice(0, 10)
      );
    }

    if (records.length === 0) {
      throw new ValidationError('Import file contains no valid records');
    }

    // Calculate date range using O(n) reduce instead of O(n log n) sort
    const { startDate, endDate } = records.reduce(
      (acc, r) => ({
        startDate: r.date < acc.startDate ? r.date : acc.startDate,
        endDate: r.date > acc.endDate ? r.date : acc.endDate,
      }),
      { startDate: records[0].date, endDate: records[0].date }
    );

    return { records, startDate, endDate };
  }

  /**
   * Parse a single CSV line handling quoted fields
   */
  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }

  /**
   * Parse JSON content into import records
   */
  parseJson(content: string): ParsedImportData {
    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch {
      throw new ValidationError('Invalid JSON format');
    }

    // Handle both full export format and simple records array
    let rawRecords: unknown[];
    if (Array.isArray(data)) {
      rawRecords = data;
    } else if (typeof data === 'object' && data !== null && 'records' in data) {
      const exportData = data as JsonExportData;
      if (!Array.isArray(exportData.records)) {
        throw new ValidationError('JSON "records" field must be an array');
      }
      rawRecords = exportData.records;
    } else {
      throw new ValidationError('JSON must be an array of records or an object with a "records" array');
    }

    if (rawRecords.length === 0) {
      throw new ValidationError('Import file contains no records');
    }

    const records: ImportRecord[] = [];
    const errors: ImportValidationError[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < rawRecords.length; i++) {
      const record = rawRecords[i];
      if (typeof record !== 'object' || record === null) {
        errors.push({ index: i, field: 'record', message: 'Each record must be an object' });
        continue;
      }

      const rec = record as Record<string, unknown>;
      const date = typeof rec.date === 'string' ? rec.date.trim() : '';
      const countryCode = typeof rec.countryCode === 'string'
        ? rec.countryCode.trim().toUpperCase()
        : typeof rec.country_code === 'string'
          ? (rec.country_code as string).trim().toUpperCase()
          : '';

      // Validate date
      if (!date) {
        errors.push({ index: i, field: 'date', message: 'Date is required' });
        continue;
      }
      if (!DATE_FORMAT_REGEX.test(date)) {
        errors.push({ index: i, field: 'date', message: 'Date must be in YYYY-MM-DD format' });
        continue;
      }
      if (isFutureDate(date)) {
        errors.push({ index: i, field: 'date', message: 'Cannot import future dates' });
        continue;
      }

      // Validate country code
      if (!countryCode) {
        errors.push({ index: i, field: 'countryCode', message: 'Country code is required' });
        continue;
      }
      if (countryCode.length !== 2) {
        errors.push({ index: i, field: 'countryCode', message: 'Country code must be exactly 2 characters' });
        continue;
      }
      if (!countriesService.isValidCountryCode(countryCode)) {
        errors.push({ index: i, field: 'countryCode', message: `Invalid country code: ${countryCode}` });
        continue;
      }

      // Deduplicate
      const key = `${date}:${countryCode}`;
      if (!seen.has(key)) {
        seen.add(key);
        records.push({ date, countryCode });
      }
    }

    if (errors.length > 0) {
      const errorDetails = errors.slice(0, 10).map(e =>
        `Index ${e.index}: ${e.field} - ${e.message}`
      ).join('; ');
      throw new ValidationError(
        `Import validation failed: ${errors.length} invalid record(s). ${errorDetails}`,
        errors.slice(0, 10)
      );
    }

    if (records.length === 0) {
      throw new ValidationError('Import file contains no valid records');
    }

    // Calculate date range using O(n) reduce instead of O(n log n) sort
    const { startDate, endDate } = records.reduce(
      (acc, r) => ({
        startDate: r.date < acc.startDate ? r.date : acc.startDate,
        endDate: r.date > acc.endDate ? r.date : acc.endDate,
      }),
      { startDate: records[0].date, endDate: records[0].date }
    );

    return { records, startDate, endDate };
  }

  /**
   * Import records into the database, overwriting existing records in the date range
   */
  async importRecords(userId: string, data: ParsedImportData): Promise<ImportResult> {
    const { records, startDate, endDate } = data;

    const result = await prisma.$transaction(async tx => {
      // Delete all existing records in the date range
      const deleteResult = await tx.travelRecord.deleteMany({
        where: {
          userId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });

      // Create all new records
      const recordsToCreate = records.map(record => ({
        userId,
        date: new Date(record.date),
        countryCode: record.countryCode,
      }));

      const createResult = await tx.travelRecord.createMany({
        data: recordsToCreate,
      });

      return {
        deleted: deleteResult.count,
        created: createResult.count,
      };
    });

    return {
      imported: result.created,
      deleted: result.deleted,
      startDate,
      endDate,
    };
  }
}

export const importService = new ImportService();
