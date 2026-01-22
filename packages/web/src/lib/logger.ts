/**
 * Frontend structured logger
 * Environment-aware logging that integrates with error tracking in production
 *
 * - Development: Full console output for debugging
 * - Production: Errors are captured by Sentry via ErrorBoundary, no console pollution
 */

/* eslint-disable no-console */
const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * Log an error message
   * In development, outputs to console.error
   * In production, suppresses console output (Sentry captures via ErrorBoundary)
   */
  error: (message: string, error?: unknown): void => {
    if (isDev) {
      console.error(message, error);
    }
    // In production, errors are captured by Sentry via ErrorBoundary
    // For explicit error logging, use Sentry.captureException if needed
  },

  /**
   * Log a warning message
   * Only outputs in development
   */
  warn: (message: string, data?: unknown): void => {
    if (isDev) {
      console.warn(message, data);
    }
  },

  /**
   * Log an info message
   * Only outputs in development
   */
  info: (message: string, data?: unknown): void => {
    if (isDev) {
      console.info(message, data);
    }
  },

  /**
   * Log a debug message
   * Only outputs in development
   */
  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      console.debug(message, data);
    }
  },
};
