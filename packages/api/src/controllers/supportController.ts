import { Request, Response, NextFunction } from 'express';
import { supportService } from '../services/supportService.js';
import { createTicketSchema } from '../validators/support.js';
import { emailService } from '../services/email/index.js';

/**
 * POST /support
 * Create a new support ticket (public endpoint)
 */
export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = createTicketSchema.parse(req.body);

    // Get user ID if authenticated (optional)
    const userId = req.user?.userId;

    const result = await supportService.createTicket(input, userId);

    // Send confirmation email to the submitter
    emailService.sendSupportTicketEmailAsync({
      name: result.ticket.name,
      email: result.ticket.email,
      referenceId: result.ticket.referenceId,
      subject: result.ticket.subject,
      category: result.ticket.category,
      message: result.ticket.message,
    });

    // Send notification email to admin
    emailService.sendAdminNotificationAsync({
      referenceId: result.ticket.referenceId,
      name: result.ticket.name,
      email: result.ticket.email,
      userId: result.ticket.userId,
      category: result.ticket.category,
      subject: result.ticket.subject,
      message: result.ticket.message,
      createdAt: result.ticket.createdAt,
    });

    res.status(201).json({
      message: 'Support ticket created successfully',
      referenceId: result.referenceId,
      ticket: {
        referenceId: result.ticket.referenceId,
        name: result.ticket.name,
        email: result.ticket.email,
        subject: result.ticket.subject,
        category: result.ticket.category,
        status: result.ticket.status,
        createdAt: result.ticket.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}
