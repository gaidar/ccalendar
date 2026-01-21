import { Router } from 'express';
import { createTicket } from '../controllers/supportController.js';
import { optionalAuth } from '../middleware/authenticate.js';
import { supportRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * POST /support
 * Create a new support ticket
 * Public endpoint with optional auth (to link ticket to user if logged in)
 */
router.post('/', supportRateLimiter, optionalAuth, createTicket);

export default router;
