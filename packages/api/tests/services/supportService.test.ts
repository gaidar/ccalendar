import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supportService } from '../../src/services/supportService.js';
import { prisma } from '../../src/utils/prisma.js';

// Mock Prisma
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    supportTicket: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('SupportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTicket', () => {
    const validTicketData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Need help with account',
      category: 'account' as const,
      message: 'I need help with my account. This is a detailed message.',
    };

    it('should create a ticket with a unique reference ID', async () => {
      const mockCreatedTicket = {
        id: 'ticket-uuid-123',
        referenceId: 'TKT-ABCD1234',
        name: validTicketData.name,
        email: validTicketData.email,
        subject: validTicketData.subject,
        category: validTicketData.category,
        message: validTicketData.message,
        userId: null,
        status: 'open',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // No collision on first check
      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.supportTicket.create).mockResolvedValue(mockCreatedTicket);

      const result = await supportService.createTicket(validTicketData);

      expect(result.referenceId).toBeDefined();
      expect(result.referenceId).toMatch(/^TKT-[A-Z0-9]{8}$/);
      expect(result.ticket.status).toBe('open');
      expect(result.ticket.userId).toBeNull();
    });

    it('should link ticket to user when userId is provided', async () => {
      const userId = 'user-uuid-123';
      const mockCreatedTicket = {
        id: 'ticket-uuid-123',
        referenceId: 'TKT-ABCD1234',
        name: validTicketData.name,
        email: validTicketData.email,
        subject: validTicketData.subject,
        category: validTicketData.category,
        message: validTicketData.message,
        userId,
        status: 'open',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.supportTicket.create).mockResolvedValue(mockCreatedTicket);

      const result = await supportService.createTicket(validTicketData, userId);

      expect(result.ticket.userId).toBe(userId);
      expect(vi.mocked(prisma.supportTicket.create)).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
        }),
      });
    });

    it('should regenerate reference ID on collision', async () => {
      const existingTicket = {
        id: 'existing-ticket',
      };
      const mockCreatedTicket = {
        id: 'ticket-uuid-123',
        referenceId: 'TKT-NEWID123',
        name: validTicketData.name,
        email: validTicketData.email,
        subject: validTicketData.subject,
        category: validTicketData.category,
        message: validTicketData.message,
        userId: null,
        status: 'open',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // First call returns existing (collision), second returns null (no collision)
      vi.mocked(prisma.supportTicket.findUnique)
        .mockResolvedValueOnce(existingTicket as never)
        .mockResolvedValueOnce(null);
      vi.mocked(prisma.supportTicket.create).mockResolvedValue(mockCreatedTicket);

      const result = await supportService.createTicket(validTicketData);

      expect(vi.mocked(prisma.supportTicket.findUnique)).toHaveBeenCalledTimes(2);
      expect(result.referenceId).toBeDefined();
    });

    it('should throw error after max collision attempts', async () => {
      const existingTicket = {
        id: 'existing-ticket',
      };

      // Always return existing ticket (collision)
      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(existingTicket as never);

      await expect(supportService.createTicket(validTicketData)).rejects.toThrow(
        'Failed to generate unique reference ID'
      );

      expect(vi.mocked(prisma.supportTicket.findUnique)).toHaveBeenCalledTimes(10);
    });
  });

  describe('getTicketByReference', () => {
    it('should return ticket when found', async () => {
      const mockTicket = {
        id: 'ticket-uuid-123',
        referenceId: 'TKT-ABCD1234',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test subject',
        category: 'general',
        message: 'Test message',
        userId: null,
        status: 'open',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket);

      const result = await supportService.getTicketByReference('TKT-ABCD1234');

      expect(result).not.toBeNull();
      expect(result?.referenceId).toBe('TKT-ABCD1234');
      expect(result?.name).toBe('John Doe');
    });

    it('should return null when ticket not found', async () => {
      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);

      const result = await supportService.getTicketByReference('TKT-NOTFOUND');

      expect(result).toBeNull();
    });
  });
});
