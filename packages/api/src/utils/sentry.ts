import * as Sentry from '@sentry/node';
import { config } from '../config/index.js';
import { logger } from './logger.js';

// Sensitive fields to filter from Sentry events
const sensitiveFields = [
  'password',
  'token',
  'refreshToken',
  'accessToken',
  'authorization',
  'cookie',
  'secret',
  'apiKey',
  'creditCard',
  'ssn',
];

/**
 * Check if a key contains sensitive information
 */
function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()));
}

/**
 * Recursively filter sensitive data from an object
 */
function filterSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(filterSensitiveData);

  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (isSensitiveKey(key)) {
      filtered[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      filtered[key] = filterSensitiveData(value);
    } else {
      filtered[key] = value;
    }
  }
  return filtered;
}

/**
 * Initialize Sentry for error tracking
 */
export function initSentry(): void {
  if (!config.sentry.isConfigured) {
    logger.info('Sentry is not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    release: config.sentry.release,
    integrations: [
      // Enable HTTP request tracing
      Sentry.httpIntegration(),
      // Enable Express integration
      Sentry.expressIntegration(),
    ],
    // Performance monitoring
    tracesSampleRate: config.env === 'production' ? 0.1 : 1.0,
    // Filter sensitive data
    beforeSend(event) {
      // Filter sensitive data from request body
      if (event.request?.data) {
        event.request.data = filterSensitiveData(event.request.data) as string;
      }
      // Filter sensitive data from headers
      if (event.request?.headers) {
        event.request.headers = filterSensitiveData(event.request.headers) as Record<string, string>;
      }
      // Filter sensitive data from extra context
      if (event.extra) {
        event.extra = filterSensitiveData(event.extra) as Record<string, unknown>;
      }
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      // Filter sensitive data from breadcrumb data
      if (breadcrumb.data) {
        breadcrumb.data = filterSensitiveData(breadcrumb.data) as Record<string, unknown>;
      }
      return breadcrumb;
    },
  });

  logger.info('Sentry initialized successfully', {
    environment: config.sentry.environment,
    release: config.sentry.release,
  });
}

/**
 * Set user context for Sentry (without email for privacy)
 */
export function setSentryUser(userId: string): void {
  if (!config.sentry.isConfigured) return;

  Sentry.setUser({ id: userId });
}

/**
 * Clear user context from Sentry
 */
export function clearSentryUser(): void {
  if (!config.sentry.isConfigured) return;

  Sentry.setUser(null);
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (!config.sentry.isConfigured) return;

  Sentry.captureException(error, {
    extra: context ? filterSensitiveData(context) as Record<string, unknown> : undefined,
  });
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, unknown>): void {
  if (!config.sentry.isConfigured) return;

  Sentry.captureMessage(message, {
    level,
    extra: context ? filterSensitiveData(context) as Record<string, unknown> : undefined,
  });
}

/**
 * Get Sentry request handler middleware
 */
export function getSentryRequestHandler(): ReturnType<typeof Sentry.setupExpressErrorHandler> | null {
  if (!config.sentry.isConfigured) return null;

  return Sentry.setupExpressErrorHandler;
}

/**
 * Sentry middleware exports
 */
export const sentryMiddleware = {
  requestHandler: Sentry.Handlers?.requestHandler?.(),
  errorHandler: Sentry.Handlers?.errorHandler?.(),
};

// Re-export Sentry for direct access when needed
export { Sentry };
