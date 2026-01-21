import { prisma } from '../utils/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import type { TicketListQueryInput, TicketUpdateInput } from '../validators/admin.js';

export interface AdminTicket {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  notes: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminTicketListItem {
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  status: string;
  createdAt: Date;
}

export interface PaginatedTickets {
  tickets: AdminTicketListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminTicketService = {
  /**
   * List tickets with pagination and optional status filter
   */
  async listTickets(input: TicketListQueryInput): Promise<PaginatedTickets> {
    const { page, limit, status } = input;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        select: {
          referenceId: true,
          name: true,
          email: true,
          subject: true,
          category: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get ticket by reference ID
   */
  async getTicketByReference(referenceId: string): Promise<AdminTicket> {
    const ticket = await prisma.supportTicket.findUnique({
      where: { referenceId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    return ticket;
  },

  /**
   * Update ticket status and/or notes
   */
  async updateTicket(
    referenceId: string,
    data: TicketUpdateInput
  ): Promise<AdminTicket> {
    // Check if ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { referenceId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { referenceId },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return updatedTicket;
  },

  /**
   * Delete ticket by reference ID
   */
  async deleteTicket(referenceId: string): Promise<void> {
    // Check if ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { referenceId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    await prisma.supportTicket.delete({ where: { referenceId } });
  },
};
