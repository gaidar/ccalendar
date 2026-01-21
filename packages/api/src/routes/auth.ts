import { Router } from 'express';
import {
  register,
  confirmEmail,
  resendConfirmation,
  login,
  refresh,
  logout,
  logoutAll,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getMe,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
  refreshRateLimiter,
  resendConfirmationRateLimiter,
} from '../middleware/rateLimit.js';
import oauthRouter from './oauth.js';

const router = Router();

// OAuth routes (providers, google, facebook, apple)
router.use('/', oauthRouter);

// Public routes
router.post('/register', registerRateLimiter, register);
router.get('/confirm/:token', confirmEmail);
router.post('/resend-confirmation', resendConfirmationRateLimiter, resendConfirmation);
router.post('/login', loginRateLimiter, login);
router.post('/refresh', refreshRateLimiter, refresh);
router.post('/reset-password', passwordResetRateLimiter, requestPasswordReset);
router.post('/reset-password/confirm', resetPassword);

// Protected routes
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.post('/change-password', authenticate, changePassword);
router.get('/me', authenticate, getMe);

export default router;
