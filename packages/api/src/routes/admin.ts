import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/authenticate.js';
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  listTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  getStats,
} from '../controllers/adminController.js';

const router = Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// User management routes
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Ticket management routes
router.get('/support', listTickets);
router.get('/support/:referenceId', getTicket);
router.patch('/support/:referenceId', updateTicket);
router.delete('/support/:referenceId', deleteTicket);

// System statistics route
router.get('/stats', getStats);

export default router;
