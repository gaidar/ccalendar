import { Request, Response, NextFunction } from 'express';
import { adminUserService } from '../services/adminUserService.js';
import { adminTicketService } from '../services/adminTicketService.js';
import { adminStatsService } from '../services/adminStatsService.js';
import { auditService } from '../services/auditService.js';
import {
  userListQuerySchema,
  userUpdateSchema,
  uuidParamSchema,
  ticketListQuerySchema,
  ticketUpdateSchema,
  referenceIdParamSchema,
} from '../validators/admin.js';

// User Management

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = userListQuerySchema.parse(req.query);
    const result = await adminUserService.listUsers(query);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const user = await adminUserService.getUserById(id);

    // Log admin action
    await auditService.logAdminAction({
      adminId: req.user!.userId,
      action: 'USER_VIEWED',
      targetType: 'user',
      targetId: id,
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = userUpdateSchema.parse(req.body);
    const adminId = req.user!.userId;

    const user = await adminUserService.updateUser(id, adminId, data);

    // Log admin action
    await auditService.logAdminAction({
      adminId,
      action: 'USER_UPDATED',
      targetType: 'user',
      targetId: id,
      details: { updatedFields: Object.keys(data) },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const adminId = req.user!.userId;

    await adminUserService.deleteUser(id, adminId);

    // Log admin action
    await auditService.logAdminAction({
      adminId,
      action: 'USER_DELETED',
      targetType: 'user',
      targetId: id,
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Ticket Management

export async function listTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = ticketListQuerySchema.parse(req.query);
    const result = await adminTicketService.listTickets(query);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { referenceId } = referenceIdParamSchema.parse(req.params);
    const ticket = await adminTicketService.getTicketByReference(referenceId);

    // Log admin action
    await auditService.logAdminAction({
      adminId: req.user!.userId,
      action: 'TICKET_VIEWED',
      targetType: 'ticket',
      targetId: referenceId,
    });

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { referenceId } = referenceIdParamSchema.parse(req.params);
    const data = ticketUpdateSchema.parse(req.body);
    const adminId = req.user!.userId;

    const ticket = await adminTicketService.updateTicket(referenceId, data);

    // Log admin action
    await auditService.logAdminAction({
      adminId,
      action: 'TICKET_UPDATED',
      targetType: 'ticket',
      targetId: referenceId,
      details: { updatedFields: Object.keys(data) },
    });

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { referenceId } = referenceIdParamSchema.parse(req.params);
    const adminId = req.user!.userId;

    await adminTicketService.deleteTicket(referenceId);

    // Log admin action
    await auditService.logAdminAction({
      adminId,
      action: 'TICKET_DELETED',
      targetType: 'ticket',
      targetId: referenceId,
    });

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// System Statistics

export async function getStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await adminStatsService.getSystemStats();

    res.json({ stats });
  } catch (error) {
    next(error);
  }
}
