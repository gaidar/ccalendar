import type { Request, Response, NextFunction } from 'express';
import appleSignIn from 'apple-signin-auth';
import { oauthService, type OAuthProfile } from '../services/oauthService.js';
import { config } from '../config/index.js';
import { HttpError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { LoginResult } from '../services/authService.js';

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * Get available OAuth providers
 * GET /api/auth/providers
 */
export function getProviders(_req: Request, res: Response): void {
  const providers = oauthService.getAvailableProviders();
  res.json({ providers });
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
  const result = req.user as unknown as LoginResult;

  if (!result) {
    res.redirect(`${config.frontend.url}/login?error=oauth_failed`);
    return;
  }

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', result.tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  // Redirect to frontend with access token in URL fragment (more secure than query params)
  res.redirect(
    `${config.frontend.url}/oauth/callback#token=${result.tokens.accessToken}`
  );
}

/**
 * Handle OAuth error
 */
export function handleOAuthError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('OAuth error', { error: err.message });

  const errorMessage = encodeURIComponent(err.message || 'Authentication failed');
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
