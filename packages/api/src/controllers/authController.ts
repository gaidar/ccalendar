import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { captchaService } from '../services/captchaService.js';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  changePasswordSchema,
  resendConfirmationSchema,
} from '../validators/auth.js';
import { config } from '../config/index.js';
import { emailService } from '../services/email/index.js';
import { prisma } from '../utils/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';

// Cookie options for refresh token
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
};

// Extended cookie options for "remember me" (30 days)
const EXTENDED_REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...REFRESH_TOKEN_COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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

    const confirmationLink = `${config.frontend.url}/confirm-email?token=${confirmationToken}`;

    // Send welcome email asynchronously (won't block the response)
    emailService.sendWelcomeEmailAsync({
      name: user.name,
      email: user.email,
      confirmationLink,
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: 'Registration successful. Please check your email to confirm your account.',
      // Only include in development
      ...(config.env === 'development' && { _devEmailLink: confirmationLink }),
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

    // Send confirmation reminder email if token was generated (user exists and is unconfirmed)
    if (confirmationToken) {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { name: true },
      });

      if (user) {
        const confirmationLink = `${config.frontend.url}/confirm-email?token=${confirmationToken}`;
        emailService.sendConfirmationReminderAsync({
          name: user.name,
          email: input.email,
          confirmationLink,
        });
      }
    }

    // Always return success to prevent email enumeration
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

    // Validate CAPTCHA in production
    if (captchaService.isRequired()) {
      if (!input.captchaToken) {
        throw new HttpError(400, 'CAPTCHA_REQUIRED', 'CAPTCHA verification is required');
      }
      const isCaptchaValid = await captchaService.validateToken(input.captchaToken);
      if (!isCaptchaValid) {
        throw new HttpError(400, 'CAPTCHA_INVALID', 'CAPTCHA verification failed');
      }
    }

    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(input, ipAddress, userAgent, input.rememberMe);

    // Set refresh token in httpOnly cookie with appropriate expiration
    const cookieOptions = result.rememberMe
      ? EXTENDED_REFRESH_TOKEN_COOKIE_OPTIONS
      : REFRESH_TOKEN_COOKIE_OPTIONS;
    res.cookie('refreshToken', result.tokens.refreshToken, cookieOptions);

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

    // Send password reset email if token was generated (user exists)
    if (resetToken) {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { name: true },
      });

      if (user) {
        const resetLink = `${config.frontend.url}/reset-password?token=${resetToken}`;
        emailService.sendPasswordResetEmailAsync({
          name: user.name,
          email: input.email,
          resetLink,
        });
      }
    }

    // Always return success to prevent email enumeration
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

    // Get user info before reset (we need email for notification)
    const tokenData = await prisma.passwordResetToken.findFirst({
      where: { token: input.token, usedAt: null },
      include: { user: { select: { name: true, email: true } } },
    });

    await authService.resetPassword(input.token, input.password);

    // Send password changed notification email
    if (tokenData?.user) {
      const dateTime = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      emailService.sendPasswordChangedEmailAsync({
        name: tokenData.user.name,
        email: tokenData.user.email,
        dateTime,
      });
    }

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

    // Get user info before password change (for email notification)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { name: true, email: true },
    });

    const input = changePasswordSchema.parse(req.body);

    await authService.changePassword(
      req.user.userId,
      input.currentPassword,
      input.newPassword
    );

    // Send password changed notification email
    if (user) {
      const dateTime = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      emailService.sendPasswordChangedEmailAsync({
        name: user.name,
        email: user.email,
        dateTime,
      });
    }

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
