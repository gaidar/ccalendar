import rateLimit, { Options } from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';

// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Helper to create consistent rate limit response
function createRateLimitResponse(message: string): (_req: Request, res: Response) => void {
  return (req: Request, res: Response): void => {
    // Log rate limit hit
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    res.status(429).json({
      error: 'RATE_LIMITED',
      message,
      details: [],
    });
  };
}

// Base configuration for all rate limiters
const baseConfig: Partial<Options> = {
  standardHeaders: true, // Return rate limit info in headers (RateLimit-*)
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skip: () => isTestEnv,
  validate: { xForwardedForHeader: false, default: !isTestEnv }, // Disable validation warnings in test
};

/**
 * Global rate limiter for all API endpoints
 * 100 requests per 15 minutes per IP
 */
export const globalRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
});

/**
 * Rate limiter for login endpoint
 * 5 requests per minute per IP
 */
export const loginRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  handler: createRateLimitResponse('Too many login attempts. Please try again later.'),
});

/**
 * Rate limiter for registration endpoint
 * 3 requests per hour per IP
 */
export const registerRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  handler: createRateLimitResponse('Too many registration attempts. Please try again later.'),
});

/**
 * Rate limiter for password reset request endpoint
 * 3 requests per hour per IP
 */
export const passwordResetRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  handler: createRateLimitResponse('Too many password reset requests. Please try again later.'),
});

/**
 * Rate limiter for token refresh endpoint
 * 30 requests per minute per IP
 */
export const refreshRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
});

/**
 * Rate limiter for resend confirmation endpoint
 * 3 requests per hour per IP
 */
export const resendConfirmationRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
});

/**
 * General API rate limiter
 * 100 requests per minute per IP
 */
export const generalRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
});

/**
 * Rate limiter for support ticket creation
 * 5 tickets per hour per IP
 */
export const supportRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  handler: createRateLimitResponse('Too many support tickets. Please try again later.'),
});

/**
 * Rate limiter for OAuth endpoints
 * 10 requests per minute per IP
 */
export const oauthRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  handler: createRateLimitResponse('Too many OAuth requests. Please try again later.'),
});

/**
 * Rate limiter for travel records creation
 * 60 requests per minute per user
 */
export const travelRecordsRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
  // Use user ID if authenticated, otherwise fall back to IP
  keyGenerator: (req) => {
    const user = req.user as { userId?: string } | undefined;
    return user?.userId || req.ip || 'unknown';
  },
});

/**
 * Rate limiter for export endpoints
 * 5 requests per hour per user
 */
export const exportRateLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  handler: createRateLimitResponse('Too many export requests. Please try again later.'),
  // Use user ID if authenticated, otherwise fall back to IP
  keyGenerator: (req) => {
    const user = req.user as { userId?: string } | undefined;
    return user?.userId || req.ip || 'unknown';
  },
});
