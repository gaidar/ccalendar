import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import countriesRouter from './countries.js';
import authRouter from './auth.js';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Countries endpoints
router.use('/countries', countriesRouter);

// Auth endpoints
router.use('/auth', authRouter);

export default router;
