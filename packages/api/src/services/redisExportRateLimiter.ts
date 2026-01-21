import { getRedisClient, isRedisAvailable } from '../utils/redis.js';
import { EXPORT_RATE_LIMIT, EXPORT_RATE_LIMIT_WINDOW_MS } from '../validators/reportsValidator.js';
import { logger } from '../utils/logger.js';

const WINDOW_SECONDS = Math.ceil(EXPORT_RATE_LIMIT_WINDOW_MS / 1000);

export interface RateLimitInfo {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

/**
 * Redis-based rate limiter for export endpoints.
 * Uses Redis INCR with EXPIRE for atomic rate limit counting.
 * Falls back to allowing requests when Redis is unavailable (fail-open).
 */
class RedisExportRateLimiter {
  private getKey(userId: string): string {
    return `export:ratelimit:${userId}`;
  }

  /**
   * Check if a user can make an export request and update their counter
   */
  async checkAndIncrement(userId: string): Promise<RateLimitInfo> {
    const redis = getRedisClient();
    const now = Date.now();

    // If Redis is not available, fail open (allow the request)
    if (!redis || !isRedisAvailable()) {
      logger.warn('Redis unavailable for export rate limiting, allowing request', { userId });
      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining: EXPORT_RATE_LIMIT - 1,
        resetAt: now + EXPORT_RATE_LIMIT_WINDOW_MS,
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
      const resetAt = ttl > 0 ? now + ttl * 1000 : now + EXPORT_RATE_LIMIT_WINDOW_MS;

      const remaining = Math.max(0, EXPORT_RATE_LIMIT - count);

      if (count > EXPORT_RATE_LIMIT) {
        const retryAfterSeconds = ttl > 0 ? ttl : WINDOW_SECONDS;
        return {
          allowed: false,
          limit: EXPORT_RATE_LIMIT,
          remaining: 0,
          resetAt,
          retryAfterSeconds,
        };
      }

      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining,
        resetAt,
      };
    } catch (error) {
      // On Redis error, fail open (allow the request)
      logger.error('Redis error during export rate limiting', { error, userId });
      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining: EXPORT_RATE_LIMIT - 1,
        resetAt: now + EXPORT_RATE_LIMIT_WINDOW_MS,
      };
    }
  }

  /**
   * Get current rate limit info without incrementing
   */
  async getInfo(userId: string): Promise<RateLimitInfo> {
    const redis = getRedisClient();
    const now = Date.now();

    if (!redis || !isRedisAvailable()) {
      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining: EXPORT_RATE_LIMIT,
        resetAt: now + EXPORT_RATE_LIMIT_WINDOW_MS,
      };
    }

    const key = this.getKey(userId);

    try {
      const [countStr, ttl] = await Promise.all([redis.get(key), redis.ttl(key)]);

      const count = countStr ? parseInt(countStr, 10) : 0;
      const resetAt = ttl > 0 ? now + ttl * 1000 : now + EXPORT_RATE_LIMIT_WINDOW_MS;
      const remaining = Math.max(0, EXPORT_RATE_LIMIT - count);

      if (count >= EXPORT_RATE_LIMIT) {
        const retryAfterSeconds = ttl > 0 ? ttl : WINDOW_SECONDS;
        return {
          allowed: false,
          limit: EXPORT_RATE_LIMIT,
          remaining: 0,
          resetAt,
          retryAfterSeconds,
        };
      }

      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining,
        resetAt,
      };
    } catch (error) {
      logger.error('Redis error getting export rate limit info', { error, userId });
      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining: EXPORT_RATE_LIMIT,
        resetAt: now + EXPORT_RATE_LIMIT_WINDOW_MS,
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
      logger.error('Redis error resetting export rate limit', { error, userId });
    }
  }
}

export const redisExportRateLimiter = new RedisExportRateLimiter();
