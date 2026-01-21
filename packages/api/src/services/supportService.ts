import { randomBytes } from 'crypto';
import { prisma } from '../utils/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import type { CreateTicketInput, SupportCategory } from '../validators/support.js';

export interface SupportTicket {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  message: string;
  userId: string | null;
  status: string;
  createdAt: Date;
}

export interface CreateTicketResult {
  referenceId: string;
  ticket: SupportTicket;
}

/**
 * Generates a unique reference ID in format TKT-XXXXXXXX
 * Uses uppercase alphanumeric characters
 */
function generateReferenceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(8);
  let result = 'TKT-';
  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

class SupportService {
  /**
   * Creates a new support ticket
   * Generates a unique reference ID and stores the ticket
   */
  async createTicket(
    data: CreateTicketInput,
    userId?: string
  ): Promise<CreateTicketResult> {
    // Generate unique reference ID with collision check
    let referenceId: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      referenceId = generateReferenceId();
      const existing = await prisma.supportTicket.findUnique({
        where: { referenceId },
        select: { id: true },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new HttpError(500, 'REFERENCE_ID_GENERATION_FAILED', 'Failed to generate unique reference ID');
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        referenceId,
        name: data.name,
        email: data.email,
        subject: data.subject,
        category: data.category,
        message: data.message,
        userId: userId ?? null,
        status: 'open',
      },
    });

    return {
      referenceId: ticket.referenceId,
      ticket: {
        id: ticket.id,
        referenceId: ticket.referenceId,
        name: ticket.name,
        email: ticket.email,
        subject: ticket.subject,
        category: ticket.category as SupportCategory,
        message: ticket.message,
        userId: ticket.userId,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    };
  }

  /**
   * Gets a ticket by its reference ID
   */
  async getTicketByReference(referenceId: string): Promise<SupportTicket | null> {
    const ticket = await prisma.supportTicket.findUnique({
      where: { referenceId },
    });

    if (!ticket) return null;

    return {
      id: ticket.id,
      referenceId: ticket.referenceId,
      name: ticket.name,
      email: ticket.email,
      subject: ticket.subject,
      category: ticket.category as SupportCategory,
      message: ticket.message,
      userId: ticket.userId,
      status: ticket.status,
      createdAt: ticket.createdAt,
    };
  }
}

export const supportService = new SupportService();
