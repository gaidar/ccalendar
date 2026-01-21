import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../src/utils/prisma.js';
import { adminTicketService } from '../../src/services/adminTicketService.js';
import { NotFoundError } from '../../src/middleware/errorHandler.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    supportTicket: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('AdminTicketService', () => {
  const mockReferenceId = 'TKT-ABCD1234';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listTickets', () => {
    it('should list tickets with pagination', async () => {
      const mockTickets = [
        {
          referenceId: 'TKT-ABCD1234',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Need help',
          category: 'account',
          status: 'open',
          createdAt: new Date('2024-01-01'),
        },
        {
          referenceId: 'TKT-EFGH5678',
          name: 'Jane Doe',
          email: 'jane@example.com',
          subject: 'Bug report',
          category: 'bug',
          status: 'in_progress',
          createdAt: new Date('2024-01-02'),
        },
      ];

      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue(mockTickets as never);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(15);

      const result = await adminTicketService.listTickets({ page: 1, limit: 20 });

      expect(result.tickets).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 15,
        pages: 1,
      });
      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should filter tickets by status', async () => {
      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue([]);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(0);

      await adminTicketService.listTickets({ page: 1, limit: 20, status: 'open' });

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        where: { status: 'open' },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should handle pagination offset correctly', async () => {
      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue([]);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(50);

      await adminTicketService.listTickets({ page: 3, limit: 10 });

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        })
      );
    });
  });

  describe('getTicketByReference', () => {
    it('should return ticket details', async () => {
      const mockTicket = {
        id: 'ticket-123',
        referenceId: mockReferenceId,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        category: 'account',
        message: 'I need help with my account.',
        status: 'open',
        notes: null,
        userId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket as never);

      const result = await adminTicketService.getTicketByReference(mockReferenceId);

      expect(result).toEqual(mockTicket);
    });

    it('should throw NotFoundError for non-existent ticket', async () => {
      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);

      await expect(
        adminTicketService.getTicketByReference(mockReferenceId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateTicket', () => {
    it('should update ticket status', async () => {
      const mockTicket = {
        id: 'ticket-123',
        referenceId: mockReferenceId,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        category: 'account',
        message: 'I need help with my account.',
        status: 'open',
        notes: null,
        userId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const updatedTicket = {
        ...mockTicket,
        status: 'in_progress',
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket as never);
      vi.mocked(prisma.supportTicket.update).mockResolvedValue(updatedTicket as never);

      const result = await adminTicketService.updateTicket(mockReferenceId, {
        status: 'in_progress',
      });

      expect(result.status).toBe('in_progress');
      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { referenceId: mockReferenceId },
        data: { status: 'in_progress' },
      });
    });

    it('should update ticket notes', async () => {
      const mockTicket = {
        id: 'ticket-123',
        referenceId: mockReferenceId,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        category: 'account',
        message: 'I need help with my account.',
        status: 'open',
        notes: null,
        userId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const updatedTicket = {
        ...mockTicket,
        notes: 'Admin notes here',
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket as never);
      vi.mocked(prisma.supportTicket.update).mockResolvedValue(updatedTicket as never);

      const result = await adminTicketService.updateTicket(mockReferenceId, {
        notes: 'Admin notes here',
      });

      expect(result.notes).toBe('Admin notes here');
    });

    it('should throw NotFoundError for non-existent ticket', async () => {
      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);

      await expect(
        adminTicketService.updateTicket(mockReferenceId, { status: 'closed' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteTicket', () => {
    it('should delete ticket successfully', async () => {
      const mockTicket = {
        id: 'ticket-123',
        referenceId: mockReferenceId,
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        category: 'account',
        message: 'I need help with my account.',
        status: 'open',
        notes: null,
        userId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket as never);
      vi.mocked(prisma.supportTicket.delete).mockResolvedValue(mockTicket as never);

      await expect(
        adminTicketService.deleteTicket(mockReferenceId)
      ).resolves.toBeUndefined();

      expect(prisma.supportTicket.delete).toHaveBeenCalledWith({
        where: { referenceId: mockReferenceId },
      });
    });

    it('should throw NotFoundError for non-existent ticket', async () => {
      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);

      await expect(
        adminTicketService.deleteTicket(mockReferenceId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
