import { Request, Response, NextFunction } from 'express';
import { logger, performanceLogger } from '../utils/logger.js';

// Fields that should be masked in logs
const sensitiveFields = ['password', 'token', 'authorization', 'cookie'];

/**
 * Mask sensitive data in request body for logging
 */
function maskSensitiveData(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string | undefined;

  // Log incoming request in debug mode
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Incoming request', {
      method: req.method,
      path: req.path,
      query: req.query,
      body: maskSensitiveData(req.body),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      ...(requestId && { requestId }),
    });
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      ...(requestId && { requestId }),
    };

    if (res.statusCode >= 500) {
      logger.error('Request completed with error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request completed with client error', logData);
    } else {
      logger.info('Request completed', logData);
    }

    // Log slow requests
    performanceLogger.slowRequest(req.method, req.path, duration);
  });

  next();
}
