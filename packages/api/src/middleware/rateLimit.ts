import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Helper to create consistent rate limit response
function createRateLimitResponse(message: string) {
  return (_req: Request, res: Response) => {
    res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message,
      details: [],
    });
  };
}

/**
 * Rate limiter for login endpoint
 * 5 requests per minute per IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many login attempts. Please try again later.'),
  skip: () => isTestEnv,
});

/**
 * Rate limiter for registration endpoint
 * 3 requests per minute per IP
 */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many registration attempts. Please try again later.'),
  skip: () => isTestEnv,
});

/**
 * Rate limiter for password reset request endpoint
 * 3 requests per hour per IP
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many password reset requests. Please try again later.'),
  skip: () => isTestEnv,
});

/**
 * Rate limiter for token refresh endpoint
 * 30 requests per minute per IP
 */
export const refreshRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
  skip: () => isTestEnv,
});

/**
 * Rate limiter for resend confirmation endpoint
 * 3 requests per hour per IP
 */
export const resendConfirmationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
  skip: () => isTestEnv,
});

/**
 * General API rate limiter
 * 100 requests per minute per IP
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitResponse('Too many requests. Please try again later.'),
  skip: () => isTestEnv,
});
