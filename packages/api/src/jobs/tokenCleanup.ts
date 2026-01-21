import { logger } from '../utils/logger.js';
import { tokenService } from '../services/tokenService.js';

// Run cleanup every hour by default
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Run the token cleanup job
 */
async function runCleanup(): Promise<void> {
  try {
    logger.info('Starting expired token cleanup');
    await tokenService.cleanupExpiredTokens();
    logger.info('Expired token cleanup completed');
  } catch (error) {
    logger.error('Token cleanup job failed', { error });
  }
}

/**
 * Start the scheduled token cleanup job
 */
export function startTokenCleanupJob(): void {
  if (intervalId) {
    logger.warn('Token cleanup job already running');
    return;
  }

  logger.info('Starting token cleanup scheduler', {
    intervalMs: CLEANUP_INTERVAL_MS,
  });

  // Run immediately on startup, then schedule periodic runs
  runCleanup();
  intervalId = setInterval(runCleanup, CLEANUP_INTERVAL_MS);
}

/**
 * Stop the scheduled token cleanup job
 */
export function stopTokenCleanupJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Token cleanup job stopped');
  }
}
