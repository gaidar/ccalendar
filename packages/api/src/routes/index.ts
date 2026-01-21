import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import countriesRouter from './countries.js';
import authRouter from './auth.js';
import travelRecordsRouter from './travelRecords.js';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Countries endpoints
router.use('/countries', countriesRouter);

// Auth endpoints
router.use('/auth', authRouter);

// Travel records endpoints
router.use('/travel-records', travelRecordsRouter);

export default router;
