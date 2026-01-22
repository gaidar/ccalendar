import { getRedisClient, isRedisAvailable } from '../utils/redis.js';
import { logger } from '../utils/logger.js';

// Import rate limit: 10 imports per hour
export const IMPORT_RATE_LIMIT = 10;
export const IMPORT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const WINDOW_SECONDS = Math.ceil(IMPORT_RATE_LIMIT_WINDOW_MS / 1000);

export interface RateLimitInfo {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

/**
 * Redis-based rate limiter for import endpoints.
 * Uses Redis INCR with EXPIRE for atomic rate limit counting.
 * Falls back to allowing requests when Redis is unavailable (fail-open).
 */
class RedisImportRateLimiter {
  private getKey(userId: string): string {
    return `import:ratelimit:${userId}`;
  }

  /**
   * Check if a user can make an import request and update their counter
   */
  async checkAndIncrement(userId: string): Promise<RateLimitInfo> {
    const redis = getRedisClient();
    const now = Date.now();

    // If Redis is not available, fail open (allow the request)
    if (!redis || !isRedisAvailable()) {
      logger.warn('Redis unavailable for import rate limiting, allowing request', { userId });
      return {
        allowed: true,
        limit: IMPORT_RATE_LIMIT,
        remaining: IMPORT_RATE_LIMIT - 1,
        resetAt: now + IMPORT_RATE_LIMIT_WINDOW_MS,
      };
    }

    const key = this.getKey(userId);

    try {
      // Atomic increment
      const count = await redis.incr(key);

      // Set expiry only on first request (when count is 1)
      if (count === 1) {
        await redis.expire(key, WINDOW_SECONDS);
      }

      // Get TTL for reset time calculation
      const ttl = await redis.ttl(key);
      const resetAt = ttl > 0 ? now + ttl * 1000 : now + IMPORT_RATE_LIMIT_WINDOW_MS;

      const remaining = Math.max(0, IMPORT_RATE_LIMIT - count);

      if (count > IMPORT_RATE_LIMIT) {
        const retryAfterSeconds = ttl > 0 ? ttl : WINDOW_SECONDS;
        return {
          allowed: false,
          limit: IMPORT_RATE_LIMIT,
          remaining: 0,
          resetAt,
          retryAfterSeconds,
        };
      }

      return {
        allowed: true,
        limit: IMPORT_RATE_LIMIT,
        remaining,
        resetAt,
      };
    } catch (error) {
      // On Redis error, fail open (allow the request)
      logger.error('Redis error during import rate limiting', { error, userId });
      return {
        allowed: true,
        limit: IMPORT_RATE_LIMIT,
        remaining: IMPORT_RATE_LIMIT - 1,
        resetAt: now + IMPORT_RATE_LIMIT_WINDOW_MS,
      };
    }
  }

  /**
   * Reset rate limit for a user (for testing purposes)
   */
  async reset(userId: string): Promise<void> {
    const redis = getRedisClient();
    if (!redis || !isRedisAvailable()) return;

    const key = this.getKey(userId);
    try {
      await redis.del(key);
    } catch (error) {
      logger.error('Redis error resetting import rate limit', { error, userId });
    }
  }
}

export const redisImportRateLimiter = new RedisImportRateLimiter();
