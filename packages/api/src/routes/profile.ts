import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getConnectedProviders,
  disconnectProvider,
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Profile endpoints
router.get('/', getProfile);
router.patch('/', updateProfile);
router.post('/change-password', changePassword);
router.delete('/', deleteAccount);

// OAuth management endpoints
router.get('/oauth', getConnectedProviders);
router.delete('/oauth/:provider', disconnectProvider);

export default router;
