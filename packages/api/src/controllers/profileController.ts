import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profileService.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  oauthProviderSchema,
} from '../validators/profile.js';
import { emailService } from '../services/email/index.js';
import { prisma } from '../utils/prisma.js';

export async function getProfile(
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

    const profile = await profileService.getProfile(req.user.userId);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
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

    const input = updateProfileSchema.parse(req.body);

    const profile = await profileService.updateProfile(req.user.userId, input);

    res.json({
      profile,
      message: 'Profile updated successfully',
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

    await profileService.changePassword(req.user.userId, {
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    });

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

    res.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
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

    // Get user info and record count before deletion (for email notification)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { name: true, email: true },
    });

    const recordCount = await prisma.travelRecord.count({
      where: { userId: req.user.userId },
    });

    const input = deleteAccountSchema.parse(req.body);

    await profileService.deleteAccount(req.user.userId, input.confirmation);

    // Send account deletion confirmation email
    if (user) {
      emailService.sendAccountDeletionEmailAsync({
        name: user.name,
        email: user.email,
        recordCount,
      });
    }

    res.json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getConnectedProviders(
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

    const providers = await profileService.getConnectedProviders(req.user.userId);

    res.json({ providers });
  } catch (error) {
    next(error);
  }
}

export async function disconnectProvider(
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

    const provider = oauthProviderSchema.parse(req.params.provider);

    await profileService.disconnectProvider(req.user.userId, provider);

    res.json({
      message: `${provider} account disconnected successfully`,
    });
  } catch (error) {
    next(error);
  }
}
