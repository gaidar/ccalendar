import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  changePasswordSchema,
  resendConfirmationSchema,
} from '../validators/auth.js';
import { config } from '../config/index.js';

// Cookie options for refresh token
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
};

function getClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.ip ||
    'unknown'
  );
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);

    const { user, confirmationToken } = await authService.register(input);

    // In a real application, you would send an email here
    // For development, we'll include the token in the response
    const emailLink = `${config.frontend.url}/confirm-email?token=${confirmationToken}`;

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: 'Registration successful. Please check your email to confirm your account.',
      // Only include in development
      ...(config.env === 'development' && { _devEmailLink: emailLink }),
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.params;

    const user = await authService.confirmEmail(token);

    res.json({
      message: 'Email confirmed successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function resendConfirmation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = resendConfirmationSchema.parse(req.body);

    const confirmationToken = await authService.resendConfirmation(input.email);

    // Always return success to prevent email enumeration
    // In a real application, you would send an email here
    const response: Record<string, unknown> = {
      message: 'If an unconfirmed account exists with this email, a confirmation link has been sent.',
    };

    // Only include in development when token is generated
    if (config.env === 'development' && confirmationToken) {
      response._devEmailLink = `${config.frontend.url}/confirm-email?token=${confirmationToken}`;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(input, ipAddress, userAgent);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.json({
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'No refresh token provided',
        details: [],
      });
      return;
    }

    const tokens = await authService.refreshTokens(refreshToken);

    // Set new refresh token in httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    // Clear cookie on error
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
        details: [],
      });
      return;
    }

    await authService.logoutAll(req.user.userId);

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });

    res.json({
      message: 'Logged out from all devices successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = passwordResetRequestSchema.parse(req.body);

    const resetToken = await authService.requestPasswordReset(input.email);

    // Always return success to prevent email enumeration
    // In a real application, you would send an email here
    const response: Record<string, unknown> = {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };

    // Only include in development when token is generated
    if (config.env === 'development' && resetToken) {
      response._devResetLink = `${config.frontend.url}/reset-password?token=${resetToken}`;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = passwordResetSchema.parse(req.body);

    await authService.resetPassword(input.token, input.password);

    res.json({
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
        details: [],
      });
      return;
    }

    const input = changePasswordSchema.parse(req.body);

    await authService.changePassword(
      req.user.userId,
      input.currentPassword,
      input.newPassword
    );

    // Clear refresh token cookie to force re-login
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });

    res.json({
      message: 'Password changed successfully. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
        details: [],
      });
      return;
    }

    const user = await authService.getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User not found',
        details: [],
      });
      return;
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
}
