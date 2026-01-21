import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import countriesRouter from './countries.js';
import authRouter from './auth.js';
import travelRecordsRouter from './travelRecords.js';
import reportsRouter from './reports.js';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Countries endpoints
router.use('/countries', countriesRouter);

// Auth endpoints
router.use('/auth', authRouter);

// Travel records endpoints
router.use('/travel-records', travelRecordsRouter);

// Reports endpoints
router.use('/reports', reportsRouter);

export default router;
