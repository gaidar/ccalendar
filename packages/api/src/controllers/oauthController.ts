import type { Request, Response, NextFunction } from 'express';
import appleSignIn from 'apple-signin-auth';
import { oauthService, type OAuthProfile } from '../services/oauthService.js';
import { config } from '../config/index.js';
import { HttpError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { LoginResult } from '../services/authService.js';

/**
 * Type guard to validate LoginResult shape from OAuth callback
 */
function isLoginResult(value: unknown): value is LoginResult {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;

  // Check user object
  if (!obj.user || typeof obj.user !== 'object') return false;
  const user = obj.user as Record<string, unknown>;
  if (typeof user.id !== 'string') return false;
  if (typeof user.email !== 'string') return false;

  // Check tokens object
  if (!obj.tokens || typeof obj.tokens !== 'object') return false;
  const tokens = obj.tokens as Record<string, unknown>;
  if (typeof tokens.accessToken !== 'string') return false;
  if (typeof tokens.refreshToken !== 'string') return false;

  return true;
}

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * Map OAuth provider errors to generic user-friendly messages
 * Prevents leaking internal error details to the frontend
 */
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'You cancelled the sign-in process',
  invalid_request: 'Sign-in request was invalid. Please try again.',
  server_error: 'The authentication service is unavailable. Please try again later.',
  temporarily_unavailable: 'The authentication service is temporarily unavailable. Please try again later.',
};

function sanitizeOAuthError(error: Error): string {
  const errorMessage = error.message?.toLowerCase() || '';

  // Check for known error patterns
  for (const [key, message] of Object.entries(OAUTH_ERROR_MESSAGES)) {
    if (errorMessage.includes(key)) {
      return message;
    }
  }

  // Default generic message for unknown errors
  return 'Authentication failed. Please try again.';
}

/**
 * Get available OAuth providers and auth config
 * GET /api/auth/providers
 */
export function getProviders(_req: Request, res: Response): void {
  const providers = oauthService.getAvailableProviders();
  res.json({
    providers,
    captcha: {
      required: config.recaptcha.isRequired,
      siteKey: config.recaptcha.isRequired ? config.recaptcha.publicKey : null,
    },
  });
}

/**
 * Handle successful OAuth callback
 * Sets refresh token cookie and redirects to frontend with access token
 */
export function handleOAuthSuccess(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // OAuth callback stores LoginResult in req.user via passport
  // Validate the shape before using it
  if (!isLoginResult(req.user)) {
    logger.error('OAuth callback received invalid LoginResult shape', { user: req.user });
    res.redirect(`${config.frontend.url}/login?error=oauth_failed`);
    return;
  }

  const result = req.user;

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // Redirect to frontend with access token in URL fragment (more secure than query params)
  res.redirect(
    `${config.frontend.url}/oauth/callback#token=${result.tokens.accessToken}`
  );
}

/**
 * Handle OAuth error
 * Sanitizes error messages to prevent information leakage
 */
export function handleOAuthError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the actual error for debugging (not exposed to user)
  logger.error('OAuth error', { error: err.message });

  // Use sanitized error message for frontend
  const sanitizedMessage = sanitizeOAuthError(err);
  const errorMessage = encodeURIComponent(sanitizedMessage);
  res.redirect(`${config.frontend.url}/login?error=${errorMessage}`);
}

/**
 * Apple Sign In callback
 * POST /api/auth/apple/callback
 * Apple uses form POST instead of redirect with query params
 */
export async function appleCallback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!oauthService.isProviderAvailable('apple')) {
      throw new HttpError(400, 'PROVIDER_UNAVAILABLE', 'Apple Sign In is not available');
    }

    const { id_token, user: userJson } = req.body;

    if (!id_token) {
      throw new HttpError(400, 'MISSING_TOKEN', 'Apple ID token is required');
    }

    // Verify the Apple ID token
    const appleUser = await appleSignIn.verifyIdToken(id_token, {
      audience: config.oauth.apple.clientId!,
      ignoreExpiration: false,
    });

    // Apple only sends user info on first authorization
    // Parse user data if provided (it comes as a JSON string)
    let userData: { name?: { firstName?: string; lastName?: string } } | null = null;
    if (userJson) {
      try {
        userData = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
      } catch {
        // Ignore parse errors, user data is optional
      }
    }

    // Build name from user data or use email prefix
    const firstName = userData?.name?.firstName || '';
    const lastName = userData?.name?.lastName || '';
    const name = [firstName, lastName].filter(Boolean).join(' ') ||
                 appleUser.email?.split('@')[0] ||
                 'Apple User';

    const oauthProfile: OAuthProfile = {
      provider: 'apple',
      providerId: appleUser.sub,
      email: appleUser.email!,
      name,
      emailVerified: appleUser.email_verified === 'true',
    };

    const result = await oauthService.findOrCreateOAuthUser(oauthProfile);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    // Redirect to frontend with access token
    res.redirect(
      `${config.frontend.url}/oauth/callback#token=${result.tokens.accessToken}`
    );
  } catch (error) {
    next(error);
  }
}
