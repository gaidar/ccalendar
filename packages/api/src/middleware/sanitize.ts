import { Request, Response, NextFunction } from 'express';

/**
 * Recursively sanitize an object's string values
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

/**
 * Sanitize a string value:
 * - Trim whitespace
 * - Remove control characters (except newlines and tabs)
 * - Normalize unicode
 */
function sanitizeString(str: string): string {
  return (
    str
      // Trim whitespace
      .trim()
      // Remove control characters (except \n, \r, \t)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normalize unicode
      .normalize('NFC')
  );
}

/**
 * Sanitize all string values in an object
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Special handling for email fields - lowercase them
    if (key.toLowerCase() === 'email' && typeof value === 'string') {
      result[key] = sanitizeString(value).toLowerCase();
    } else {
      result[key] = sanitizeValue(value);
    }
  }
  return result;
}

/**
 * Input sanitization middleware
 * Sanitizes request body, query, and params
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query as Record<string, unknown>) as typeof req.query;
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params) as typeof req.params;
  }

  next();
}
