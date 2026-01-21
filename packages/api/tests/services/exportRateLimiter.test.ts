import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { exportRateLimiter } from '../../src/services/exportRateLimiter.js';
import { EXPORT_RATE_LIMIT, EXPORT_RATE_LIMIT_WINDOW_MS } from '../../src/validators/reportsValidator.js';

describe('ExportRateLimiter', () => {
  const testUserId = 'test-user-123';
  const otherUserId = 'other-user-456';

  beforeEach(() => {
    // Clear all entries before each test
    exportRateLimiter.clearAll();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('checkAndIncrement', () => {
    it('should allow requests within rate limit', () => {
      const result = exportRateLimiter.checkAndIncrement(testUserId);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(EXPORT_RATE_LIMIT);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 1);
      expect(result.resetAt).toBeGreaterThan(Date.now());
    });

    it('should decrement remaining count on each call', () => {
      // First call
      let result = exportRateLimiter.checkAndIncrement(testUserId);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 1);

      // Second call
      result = exportRateLimiter.checkAndIncrement(testUserId);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 2);

      // Third call
      result = exportRateLimiter.checkAndIncrement(testUserId);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 3);
    });

    it('should deny requests when rate limit exceeded', () => {
      // Use up all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      // Next request should be denied
      const result = exportRateLimiter.checkAndIncrement(testUserId);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterSeconds).toBeDefined();
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
    });

    it('should track users independently', () => {
      // User 1 uses all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      // User 1 is rate limited
      expect(exportRateLimiter.checkAndIncrement(testUserId).allowed).toBe(false);

      // User 2 should still have full quota
      const result = exportRateLimiter.checkAndIncrement(otherUserId);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 1);
    });

    it('should reset after window expires', () => {
      // Use up all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      // Verify rate limited
      expect(exportRateLimiter.checkAndIncrement(testUserId).allowed).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(EXPORT_RATE_LIMIT_WINDOW_MS + 1000);

      // Should be allowed again
      const result = exportRateLimiter.checkAndIncrement(testUserId);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 1);
    });
  });

  describe('getInfo', () => {
    it('should return full quota for new user', () => {
      const result = exportRateLimiter.getInfo(testUserId);

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(EXPORT_RATE_LIMIT);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT);
    });

    it('should not increment counter', () => {
      // Check info multiple times
      exportRateLimiter.getInfo(testUserId);
      exportRateLimiter.getInfo(testUserId);
      exportRateLimiter.getInfo(testUserId);

      // Should still have full quota
      const result = exportRateLimiter.checkAndIncrement(testUserId);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 1);
    });

    it('should reflect current rate limit state', () => {
      // Use 2 requests
      exportRateLimiter.checkAndIncrement(testUserId);
      exportRateLimiter.checkAndIncrement(testUserId);

      // Check info
      const result = exportRateLimiter.getInfo(testUserId);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT - 2);
    });

    it('should show rate limited state', () => {
      // Use up all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      const result = exportRateLimiter.getInfo(testUserId);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterSeconds).toBeDefined();
    });
  });

  describe('reset', () => {
    it('should reset rate limit for specific user', () => {
      // Use up all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      // Verify rate limited
      expect(exportRateLimiter.getInfo(testUserId).allowed).toBe(false);

      // Reset
      exportRateLimiter.reset(testUserId);

      // Should have full quota again
      const result = exportRateLimiter.getInfo(testUserId);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(EXPORT_RATE_LIMIT);
    });

    it('should not affect other users', () => {
      // Both users use requests
      exportRateLimiter.checkAndIncrement(testUserId);
      exportRateLimiter.checkAndIncrement(otherUserId);

      // Reset only test user
      exportRateLimiter.reset(testUserId);

      // Test user has full quota
      expect(exportRateLimiter.getInfo(testUserId).remaining).toBe(EXPORT_RATE_LIMIT);

      // Other user still has reduced quota
      expect(exportRateLimiter.getInfo(otherUserId).remaining).toBe(EXPORT_RATE_LIMIT - 1);
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', () => {
      // Create entries for multiple users
      exportRateLimiter.checkAndIncrement(testUserId);
      exportRateLimiter.checkAndIncrement(otherUserId);

      // Advance time past window
      vi.advanceTimersByTime(EXPORT_RATE_LIMIT_WINDOW_MS + 1000);

      // Run cleanup
      exportRateLimiter.cleanup();

      // New requests should start fresh
      const result1 = exportRateLimiter.checkAndIncrement(testUserId);
      expect(result1.remaining).toBe(EXPORT_RATE_LIMIT - 1);

      const result2 = exportRateLimiter.checkAndIncrement(otherUserId);
      expect(result2.remaining).toBe(EXPORT_RATE_LIMIT - 1);
    });
  });

  describe('retryAfterSeconds calculation', () => {
    it('should calculate correct retry after seconds', () => {
      // Use up all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      const result = exportRateLimiter.checkAndIncrement(testUserId);

      // Should be approximately the full window (3600 seconds for 1 hour)
      expect(result.retryAfterSeconds).toBeGreaterThan(3590);
      expect(result.retryAfterSeconds).toBeLessThanOrEqual(3600);
    });

    it('should decrease retry after as time passes', () => {
      // Use up all requests
      for (let i = 0; i < EXPORT_RATE_LIMIT; i++) {
        exportRateLimiter.checkAndIncrement(testUserId);
      }

      // Advance time by 30 minutes
      vi.advanceTimersByTime(30 * 60 * 1000);

      const result = exportRateLimiter.checkAndIncrement(testUserId);

      // Should be approximately 30 minutes (1800 seconds)
      expect(result.retryAfterSeconds).toBeGreaterThan(1790);
      expect(result.retryAfterSeconds).toBeLessThanOrEqual(1800);
    });
  });
});
