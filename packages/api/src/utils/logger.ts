import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const useJsonFormat = isProduction || isTest;

// Custom format for filtering sensitive data
const filterSensitiveData = winston.format((info) => {
  const sensitiveFields = ['password', 'token', 'refreshToken', 'accessToken', 'authorization', 'secret', 'apiKey'];

  const filterObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    const filtered: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        filtered[key] = '[REDACTED]';
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        filtered[key] = filterObject(value as Record<string, unknown>);
      } else {
        filtered[key] = value;
      }
    }
    return filtered;
  };

  // Filter the entire info object except for the standard fields
  const { level, message, timestamp, ...rest } = info;
  const filteredRest = filterObject(rest);

  return { level, message, timestamp, ...filteredRest };
});

// Development format with colors
const developmentFormat = winston.format.combine(
  filterSensitiveData(),
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

// Production format in JSON
const productionFormat = winston.format.combine(
  filterSensitiveData(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports array
const transports: winston.transport[] = [
  new winston.transports.Console({
    silent: isTest,
  }),
];

// Add file transports in production (not in test)
if (isProduction && !isTest) {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: useJsonFormat ? productionFormat : developmentFormat,
  transports,
  exitOnError: false,
});

// Security event logging helpers
export const securityLogger = {
  loginFailure(email: string, ip: string, reason: string): void {
    logger.warn('Authentication failure', {
      event: 'LOGIN_FAILURE',
      email,
      ip,
      reason,
    });
  },

  loginSuccess(userId: string, ip: string): void {
    logger.info('Authentication success', {
      event: 'LOGIN_SUCCESS',
      userId,
      ip,
    });
  },

  rateLimitHit(ip: string, endpoint: string): void {
    logger.warn('Rate limit exceeded', {
      event: 'RATE_LIMIT_HIT',
      ip,
      endpoint,
    });
  },

  adminAction(adminId: string, action: string, targetType: string, targetId: string, details?: unknown): void {
    logger.info('Admin action', {
      event: 'ADMIN_ACTION',
      adminId,
      action,
      targetType,
      targetId,
      details,
    });
  },

  suspiciousActivity(ip: string, reason: string, details?: unknown): void {
    logger.warn('Suspicious activity detected', {
      event: 'SUSPICIOUS_ACTIVITY',
      ip,
      reason,
      details,
    });
  },
};

// Performance logging helpers
export const performanceLogger = {
  slowQuery(query: string, duration: number): void {
    logger.warn('Slow database query', {
      event: 'SLOW_QUERY',
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
    });
  },

  slowRequest(method: string, path: string, duration: number): void {
    if (duration > 1000) {
      logger.warn('Slow request', {
        event: 'SLOW_REQUEST',
        method,
        path,
        duration: `${duration}ms`,
      });
    }
  },
};
