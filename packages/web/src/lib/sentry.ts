import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Sensitive fields to filter
const sensitiveFields = [
  'password',
  'token',
  'refreshToken',
  'accessToken',
  'authorization',
  'cookie',
  'secret',
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
 * Initialize Sentry for the frontend
 */
export function initSentry(): void {
  if (!SENTRY_DSN) {
    // Sentry DSN not configured, skipping initialization
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    release: APP_VERSION,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
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
      // Don't send console breadcrumbs that might contain sensitive data
      if (breadcrumb.category === 'console' && breadcrumb.message) {
        const message = breadcrumb.message.toLowerCase();
        if (sensitiveFields.some(field => message.includes(field.toLowerCase()))) {
          return null;
        }
      }
      return breadcrumb;
    },
  });
}

/**
 * Set user context for Sentry (without email for privacy)
 */
export function setSentryUser(userId: string): void {
  if (!SENTRY_DSN) return;
  Sentry.setUser({ id: userId });
}

/**
 * Clear user context from Sentry
 */
export function clearSentryUser(): void {
  if (!SENTRY_DSN) return;
  Sentry.setUser(null);
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (!SENTRY_DSN) return;

  Sentry.captureException(error, {
    extra: context ? filterSensitiveData(context) as Record<string, unknown> : undefined,
  });
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, unknown>): void {
  if (!SENTRY_DSN) return;

  Sentry.captureMessage(message, {
    level,
    extra: context ? filterSensitiveData(context) as Record<string, unknown> : undefined,
  });
}

// Re-export Sentry for direct access when needed
export { Sentry };
