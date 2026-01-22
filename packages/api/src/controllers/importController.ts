import { Request, Response, NextFunction } from 'express';
import { importService } from '../services/importService.js';
import {
  redisImportRateLimiter,
  type RateLimitInfo,
} from '../services/importRateLimiter.js';
import { UnauthorizedError, HttpError, ValidationError } from '../middleware/errorHandler.js';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Rate limit exceeded error
 */
class RateLimitError extends HttpError {
  retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds: number) {
    super(429, 'RATE_LIMITED', message);
    this.retryAfterSeconds = retryAfterSeconds;
    this.name = 'RateLimitError';
  }
}

/**
 * Helper to add rate limit headers to response
 */
function addRateLimitHeaders(res: Response, info: RateLimitInfo): void {
  res.setHeader('X-RateLimit-Limit', info.limit);
  res.setHeader('X-RateLimit-Remaining', info.remaining);
  res.setHeader('X-RateLimit-Reset', Math.floor(info.resetAt / 1000));
  if (info.retryAfterSeconds) {
    res.setHeader('Retry-After', info.retryAfterSeconds);
  }
}

/**
 * POST /travel-records/import
 * Import travel records from CSV or JSON file
 */
export async function importRecords(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Check if file was uploaded
    const file = req.file;
    if (!file) {
      throw new ValidationError('No file uploaded');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new HttpError(400, 'FILE_TOO_LARGE', 'File size exceeds maximum allowed (5MB)');
    }

    // Determine format from mimetype or extension
    const originalName = file.originalname.toLowerCase();
    const isJson = file.mimetype === 'application/json' || originalName.endsWith('.json');
    const isCsv = file.mimetype === 'text/csv' ||
      file.mimetype === 'application/csv' ||
      originalName.endsWith('.csv');

    if (!isJson && !isCsv) {
      throw new HttpError(400, 'INVALID_FORMAT', 'File must be CSV or JSON format');
    }

    // Check rate limit
    const rateLimitInfo = await redisImportRateLimiter.checkAndIncrement(req.user.userId);
    addRateLimitHeaders(res, rateLimitInfo);

    if (!rateLimitInfo.allowed) {
      throw new RateLimitError(
        `Import rate limit exceeded. Please try again in ${rateLimitInfo.retryAfterSeconds} seconds.`,
        rateLimitInfo.retryAfterSeconds!
      );
    }

    // Parse file content
    const content = file.buffer.toString('utf-8');
    const parsedData = isJson
      ? importService.parseJson(content)
      : importService.parseCsv(content);

    // Import records
    const result = await importService.importRecords(req.user.userId, parsedData);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /travel-records/import/preview
 * Preview import data without actually importing
 */
export async function previewImport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Check if file was uploaded
    const file = req.file;
    if (!file) {
      throw new ValidationError('No file uploaded');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new HttpError(400, 'FILE_TOO_LARGE', 'File size exceeds maximum allowed (5MB)');
    }

    // Determine format from mimetype or extension
    const originalName = file.originalname.toLowerCase();
    const isJson = file.mimetype === 'application/json' || originalName.endsWith('.json');
    const isCsv = file.mimetype === 'text/csv' ||
      file.mimetype === 'application/csv' ||
      originalName.endsWith('.csv');

    if (!isJson && !isCsv) {
      throw new HttpError(400, 'INVALID_FORMAT', 'File must be CSV or JSON format');
    }

    // Parse file content
    const content = file.buffer.toString('utf-8');
    const parsedData = isJson
      ? importService.parseJson(content)
      : importService.parseCsv(content);

    // Return preview data
    res.status(200).json({
      totalRecords: parsedData.records.length,
      startDate: parsedData.startDate,
      endDate: parsedData.endDate,
      sampleRecords: parsedData.records.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
}
