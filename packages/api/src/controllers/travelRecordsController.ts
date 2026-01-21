import { Request, Response, NextFunction } from 'express';
import { travelRecordsService } from '../services/travelRecordsService.js';
import {
  createRecordSchema,
  dateRangeQuerySchema,
  bulkUpdateSchema,
  recordIdSchema,
} from '../validators/countryValidator.js';
import { UnauthorizedError } from '../middleware/errorHandler.js';

/**
 * POST /travel-records
 * Create a single travel record
 */
export async function createRecord(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const input = createRecordSchema.parse(req.body);

    const record = await travelRecordsService.createRecord(
      req.user.userId,
      input.date,
      input.countryCode
    );

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /travel-records/:id
 * Delete a travel record (own records only)
 */
export async function deleteRecord(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const { id } = recordIdSchema.parse(req.params);

    await travelRecordsService.deleteRecord(req.user.userId, id);

    res.status(200).json({
      message: 'Record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /travel-records?start=YYYY-MM-DD&end=YYYY-MM-DD&page=1&limit=100
 * Get travel records within a date range with optional pagination
 */
export async function getRecordsByDateRange(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const query = dateRangeQuerySchema.parse(req.query);

    const result = await travelRecordsService.getRecordsByDateRange(
      req.user.userId,
      query.start,
      query.end,
      query.page,
      query.limit
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /travel-records/bulk
 * Bulk update records for a date range
 */
export async function bulkUpdateRecords(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const input = bulkUpdateSchema.parse(req.body);

    const result = await travelRecordsService.bulkUpdateRecords(
      req.user.userId,
      input.startDate,
      input.endDate,
      input.countryCodes
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
