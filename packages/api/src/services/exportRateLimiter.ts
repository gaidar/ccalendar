import { EXPORT_RATE_LIMIT, EXPORT_RATE_LIMIT_WINDOW_MS } from '../validators/reportsValidator.js';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitInfo {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

/**
 * In-memory rate limiter for export endpoints.
 * Uses a per-user counter that resets after the window expires.
 *
 * Note: This is a fallback when Redis is unavailable. In production with
 * multiple instances, Redis-based rate limiting (redisExportRateLimiter.ts)
 * is preferred for consistency across instances.
 *
 * Memory characteristics:
 * - One entry per user with active rate limit (~100 bytes per entry)
 * - Entries auto-expire after EXPORT_RATE_LIMIT_WINDOW_MS (1 hour)
 * - Periodic cleanup runs every minute to remove expired entries
 */
class ExportRateLimiter {
  private entries: Map<string, RateLimitEntry> = new Map();

  /**
   * Check if a user can make an export request and update their counter
   */
  checkAndIncrement(userId: string): RateLimitInfo {
    const now = Date.now();
    let entry = this.entries.get(userId);

    // Clean up expired entry
    if (entry && now >= entry.resetAt) {
      this.entries.delete(userId);
      entry = undefined;
    }

    // Create new entry if not exists
    if (!entry) {
      entry = {
        count: 0,
        resetAt: now + EXPORT_RATE_LIMIT_WINDOW_MS,
      };
      this.entries.set(userId, entry);
    }

    const remaining = EXPORT_RATE_LIMIT - entry.count;
    const resetAt = entry.resetAt;

    // Check if limit exceeded
    if (entry.count >= EXPORT_RATE_LIMIT) {
      const retryAfterSeconds = Math.ceil((resetAt - now) / 1000);
      return {
        allowed: false,
        limit: EXPORT_RATE_LIMIT,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
      };
    }

    // Increment counter
    entry.count++;

    return {
      allowed: true,
      limit: EXPORT_RATE_LIMIT,
      remaining: remaining - 1,
      resetAt,
    };
  }

  /**
   * Get current rate limit info without incrementing
   */
  getInfo(userId: string): RateLimitInfo {
    const now = Date.now();
    const entry = this.entries.get(userId);

    // No entry or expired entry means full limit available
    if (!entry || now >= entry.resetAt) {
      return {
        allowed: true,
        limit: EXPORT_RATE_LIMIT,
        remaining: EXPORT_RATE_LIMIT,
        resetAt: now + EXPORT_RATE_LIMIT_WINDOW_MS,
      };
    }

    const remaining = EXPORT_RATE_LIMIT - entry.count;

    if (remaining <= 0) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      return {
        allowed: false,
        limit: EXPORT_RATE_LIMIT,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfterSeconds,
      };
    }

    return {
      allowed: true,
      limit: EXPORT_RATE_LIMIT,
      remaining,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Clean up expired entries (call periodically to prevent memory leaks)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [userId, entry] of this.entries) {
      if (now >= entry.resetAt) {
        this.entries.delete(userId);
      }
    }
  }

  /**
   * Reset rate limit for a user (for testing purposes)
   */
  reset(userId: string): void {
    this.entries.delete(userId);
  }

  /**
   * Clear all entries (for testing purposes)
   */
  clearAll(): void {
    this.entries.clear();
  }
}

export const exportRateLimiter = new ExportRateLimiter();

// Cleanup expired entries every minute for better memory efficiency
// This is low overhead since it only iterates over entries with active rate limits
setInterval(
  () => {
    exportRateLimiter.cleanup();
  },
  60 * 1000
);
