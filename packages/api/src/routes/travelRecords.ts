import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { travelRecordsRateLimiter } from '../middleware/rateLimit.js';
import {
  createRecord,
  deleteRecord,
  getRecordsByDateRange,
  bulkUpdateRecords,
} from '../controllers/travelRecordsController.js';

const router = Router();

// All travel record endpoints require authentication
router.use(authenticate);

// GET /travel-records?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/', getRecordsByDateRange);

// POST /travel-records - Rate limited to 60 requests per minute per user
router.post('/', travelRecordsRateLimiter, createRecord);

// POST /travel-records/bulk - Rate limited to 60 requests per minute per user
router.post('/bulk', travelRecordsRateLimiter, bulkUpdateRecords);

// DELETE /travel-records/:id
router.delete('/:id', deleteRecord);

export default router;
