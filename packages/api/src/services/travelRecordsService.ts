import { prisma } from '../utils/prisma.js';
import { countriesService } from './countriesService.js';
import { NotFoundError, ConflictError } from '../middleware/errorHandler.js';

export interface TravelRecordResponse {
  id: string;
  date: string;
  countryCode: string;
  countryName: string;
  createdAt: string;
}

export interface BulkUpdateResult {
  message: string;
  created: number;
  deleted: number;
}

export interface RecordsListResponse {
  records: TravelRecordResponse[];
  total: number;
  pagination?: {
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Formats a Date object to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Transforms a Prisma travel record to API response format
 */
function toResponse(record: {
  id: string;
  date: Date;
  countryCode: string;
  createdAt: Date;
}): TravelRecordResponse {
  const country = countriesService.getCountryByCode(record.countryCode);
  return {
    id: record.id,
    date: formatDate(record.date),
    countryCode: record.countryCode,
    countryName: country?.name ?? 'Unknown',
    createdAt: record.createdAt.toISOString(),
  };
}

/**
 * Generates all dates between start and end (inclusive)
 */
function getDateRange(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

class TravelRecordsService {
  /**
   * Create a single travel record
   */
  async createRecord(
    userId: string,
    date: string,
    countryCode: string
  ): Promise<TravelRecordResponse> {
    const recordDate = new Date(date);

    // Check for existing record
    const existing = await prisma.travelRecord.findUnique({
      where: {
        userId_date_countryCode: {
          userId,
          date: recordDate,
          countryCode: countryCode.toUpperCase(),
        },
      },
    });

    if (existing) {
      throw new ConflictError('Record already exists for this date and country', [
        toResponse(existing),
      ]);
    }

    const record = await prisma.travelRecord.create({
      data: {
        userId,
        date: recordDate,
        countryCode: countryCode.toUpperCase(),
      },
    });

    return toResponse(record);
  }

  /**
   * Delete a travel record (only if owned by user)
   */
  async deleteRecord(userId: string, recordId: string): Promise<void> {
    // Find the record first to check ownership
    const record = await prisma.travelRecord.findUnique({
      where: { id: recordId },
    });

    // Return 404 for both not found and not owned (security: don't reveal record exists)
    if (!record || record.userId !== userId) {
      throw new NotFoundError('Record not found');
    }

    await prisma.travelRecord.delete({
      where: { id: recordId },
    });
  }

  /**
   * Get travel records for a user within a date range with optional pagination
   */
  async getRecordsByDateRange(
    userId: string,
    start: string,
    end: string,
    page?: number,
    limit?: number
  ): Promise<RecordsListResponse> {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const where = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    // If pagination is requested
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;

      const [records, total] = await Promise.all([
        prisma.travelRecord.findMany({
          where,
          orderBy: [{ date: 'asc' }, { countryCode: 'asc' }],
          skip,
          take: limit,
        }),
        prisma.travelRecord.count({ where }),
      ]);

      return {
        records: records.map(toResponse),
        total,
        pagination: {
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    }

    // No pagination - return all records
    const records = await prisma.travelRecord.findMany({
      where,
      orderBy: [{ date: 'asc' }, { countryCode: 'asc' }],
    });

    return {
      records: records.map(toResponse),
      total: records.length,
    };
  }

  /**
   * Bulk update: delete all existing records in date range and create new ones
   */
  async bulkUpdateRecords(
    userId: string,
    startDate: string,
    endDate: string,
    countryCodes: string[]
  ): Promise<BulkUpdateResult> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const normalizedCodes = countryCodes.map(code => code.toUpperCase());

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async tx => {
      // Delete all existing records in the date range
      const deleteResult = await tx.travelRecord.deleteMany({
        where: {
          userId,
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      // Generate all date/country combinations
      const dates = getDateRange(startDate, endDate);
      const recordsToCreate = dates.flatMap(date =>
        normalizedCodes.map(countryCode => ({
          userId,
          date,
          countryCode,
        }))
      );

      // Create all new records
      const createResult = await tx.travelRecord.createMany({
        data: recordsToCreate,
      });

      return {
        deleted: deleteResult.count,
        created: createResult.count,
      };
    });

    return {
      message: 'Records updated successfully',
      created: result.created,
      deleted: result.deleted,
    };
  }

  /**
   * Get a single record by ID (only if owned by user)
   */
  async getRecordById(
    userId: string,
    recordId: string
  ): Promise<TravelRecordResponse | null> {
    const record = await prisma.travelRecord.findUnique({
      where: { id: recordId },
    });

    // Return null for both not found and not owned (security)
    if (!record || record.userId !== userId) {
      return null;
    }

    return toResponse(record);
  }
}

export const travelRecordsService = new TravelRecordsService();
