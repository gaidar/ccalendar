import type { Request, Response, NextFunction } from 'express';
import { tokenService, AccessTokenPayload } from '../services/tokenService.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

// Extend Express Request type to include our custom user type
// Note: Passport sets req.user to LoginResult in OAuth flows,
// while our JWT middleware sets it to AccessTokenPayload
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // Empty interface extends AccessTokenPayload for passport compatibility
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends AccessTokenPayload {}
  }
}

// Helper type guard to check if user is AccessTokenPayload (from JWT)
export function isJwtUser(user: unknown): user is AccessTokenPayload {
  return (
    user !== null &&
    typeof user === 'object' &&
    'userId' in user &&
    'email' in user &&
    typeof (user as AccessTokenPayload).userId === 'string'
  );
}

/**
 * Middleware to authenticate requests using JWT access token
 * Requires valid Bearer token in Authorization header
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Authorization header required');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
    }

    const token = parts[1];

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if valid token is present, but doesn't fail if missing
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = payload;
    } catch {
      // Token invalid, continue without user
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to require admin privileges
 * Must be used after authenticate middleware
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (!req.user.isAdmin) {
    return next(new ForbiddenError('Admin access required'));
  }

  next();
}
