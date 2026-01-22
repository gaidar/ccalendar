import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authenticate.js';
import { travelRecordsRateLimiter } from '../middleware/rateLimit.js';
import {
  createRecord,
  deleteRecord,
  getRecordsByDateRange,
  bulkUpdateRecords,
} from '../controllers/travelRecordsController.js';
import { importRecords, previewImport } from '../controllers/importController.js';

const router = Router();

// Configure multer for file uploads (memory storage, 5MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['text/csv', 'application/csv', 'application/json'];
    const allowedExts = ['.csv', '.json'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'));
    }
  },
});

// All travel record endpoints require authentication
router.use(authenticate);

// GET /travel-records?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/', getRecordsByDateRange);

// POST /travel-records - Rate limited to 60 requests per minute per user
router.post('/', travelRecordsRateLimiter, createRecord);

// POST /travel-records/bulk - Rate limited to 60 requests per minute per user
router.post('/bulk', travelRecordsRateLimiter, bulkUpdateRecords);

// POST /travel-records/import - Import from CSV or JSON file
router.post('/import', upload.single('file'), importRecords);

// POST /travel-records/import/preview - Preview import without executing
router.post('/import/preview', upload.single('file'), previewImport);

// DELETE /travel-records/:id
router.delete('/:id', deleteRecord);

export default router;
