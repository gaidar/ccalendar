import { Request, Response, NextFunction } from 'express';
import { reportsService } from '../services/reportsService.js';
import { exportService } from '../services/exportService.js';
import { exportRateLimiter, type RateLimitInfo } from '../services/exportRateLimiter.js';
import {
  summaryQuerySchema,
  exportQuerySchema,
  type PresetPeriod,
} from '../validators/reportsValidator.js';
import { UnauthorizedError, HttpError } from '../middleware/errorHandler.js';

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
 * GET /reports/summary
 * Get summary statistics for user's travel records
 */
export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const input = summaryQuerySchema.parse(req.query);

    let summary;
    if (input.days !== undefined) {
      // Preset period
      summary = await reportsService.getSummary(
        req.user.userId,
        input.days as PresetPeriod
      );
    } else {
      // Custom date range
      summary = await reportsService.getSummary(
        req.user.userId,
        input.start!,
        input.end
      );
    }

    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /reports/statistics
 * Get detailed country statistics for user's travel records
 */
export async function getStatistics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const input = summaryQuerySchema.parse(req.query);

    let statistics;
    if (input.days !== undefined) {
      // Preset period
      statistics = await reportsService.getCountryStatistics(
        req.user.userId,
        input.days as PresetPeriod
      );
    } else {
      // Custom date range
      statistics = await reportsService.getCountryStatistics(
        req.user.userId,
        input.start!,
        input.end
      );
    }

    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /reports/export
 * Export travel records in CSV or XLSX format
 */
export async function exportRecords(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const input = exportQuerySchema.parse(req.query);

    // Check rate limit
    const rateLimitInfo = exportRateLimiter.checkAndIncrement(req.user.userId);
    addRateLimitHeaders(res, rateLimitInfo);

    if (!rateLimitInfo.allowed) {
      throw new RateLimitError(
        `Export rate limit exceeded. Please try again in ${rateLimitInfo.retryAfterSeconds} seconds.`,
        rateLimitInfo.retryAfterSeconds!
      );
    }

    // Generate export
    const result = await exportService.export(
      req.user.userId,
      input.format,
      input.start,
      input.end
    );

    // Set response headers
    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`
    );

    // Stream the response
    result.stream.pipe(res);
  } catch (error) {
    next(error);
  }
}
