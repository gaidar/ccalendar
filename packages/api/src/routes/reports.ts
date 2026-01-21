import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getSummary,
  getStatistics,
  exportRecords,
} from '../controllers/reportsController.js';

const router = Router();

// All reports endpoints require authentication
router.use(authenticate);

// GET /reports/summary?days=30 or ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/summary', getSummary);

// GET /reports/statistics?days=30 or ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/statistics', getStatistics);

// GET /reports/export?format=csv|xlsx&start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/export', exportRecords);

export default router;
