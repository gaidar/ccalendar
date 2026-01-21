import { Router, type Request, type Response, type NextFunction } from 'express';
import { passport } from '../config/passport.js';
import { oauthService } from '../services/oauthService.js';
import { oauthRateLimiter } from '../middleware/rateLimit.js';
import {
  getProviders,
  handleOAuthSuccess,
  handleOAuthError,
  appleCallback,
} from '../controllers/oauthController.js';

const router = Router();

// Apply rate limiting to OAuth endpoints
router.use(oauthRateLimiter);

// Get available OAuth providers
router.get('/providers', getProviders);

// Google OAuth
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  if (!oauthService.isProviderAvailable('google')) {
    res.status(400).json({ error: 'Google OAuth is not available' });
    return;
  }
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

router.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' })(req, res, next);
  },
  handleOAuthSuccess,
  handleOAuthError
);

// Facebook OAuth
router.get('/facebook', (req: Request, res: Response, next: NextFunction) => {
  if (!oauthService.isProviderAvailable('facebook')) {
    res.status(400).json({ error: 'Facebook OAuth is not available' });
    return;
  }
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

router.get(
  '/facebook/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', { session: false, failureRedirect: '/login?error=facebook_failed' })(req, res, next);
  },
  handleOAuthSuccess,
  handleOAuthError
);

// Apple Sign In (POST callback)
router.post('/apple/callback', appleCallback);

export default router;
