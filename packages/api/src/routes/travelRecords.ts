import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
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

// POST /travel-records
router.post('/', createRecord);

// POST /travel-records/bulk
router.post('/bulk', bulkUpdateRecords);

// DELETE /travel-records/:id
router.delete('/:id', deleteRecord);

export default router;
