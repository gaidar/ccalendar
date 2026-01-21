import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../src/utils/prisma.js';
import { adminStatsService } from '../../src/services/adminStatsService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      count: vi.fn(),
    },
    travelRecord: {
      count: vi.fn(),
    },
    loginAttempt: {
      findMany: vi.fn(),
    },
    supportTicket: {
      count: vi.fn(),
    },
  },
}));

describe('AdminStatsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSystemStats', () => {
    it('should return system statistics', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(100);
      vi.mocked(prisma.travelRecord.count).mockResolvedValue(500);
      vi.mocked(prisma.loginAttempt.findMany).mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
        { userId: 'user-3' },
      ] as never);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(5);

      const result = await adminStatsService.getSystemStats();

      expect(result).toEqual({
        totalUsers: 100,
        totalRecords: 500,
        activeUsers30Days: 3,
        openTickets: 5,
      });
    });

    it('should filter active users by last 30 days', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(0);
      vi.mocked(prisma.travelRecord.count).mockResolvedValue(0);
      vi.mocked(prisma.loginAttempt.findMany).mockResolvedValue([]);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(0);

      await adminStatsService.getSystemStats();

      expect(prisma.loginAttempt.findMany).toHaveBeenCalledWith({
        where: {
          success: true,
          createdAt: { gte: expect.any(Date) },
          userId: { not: null },
        },
        distinct: ['userId'],
        select: { userId: true },
      });
    });

    it('should filter open tickets correctly', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(0);
      vi.mocked(prisma.travelRecord.count).mockResolvedValue(0);
      vi.mocked(prisma.loginAttempt.findMany).mockResolvedValue([]);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(10);

      await adminStatsService.getSystemStats();

      expect(prisma.supportTicket.count).toHaveBeenCalledWith({
        where: { status: 'open' },
      });
    });

    it('should handle zero stats', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(0);
      vi.mocked(prisma.travelRecord.count).mockResolvedValue(0);
      vi.mocked(prisma.loginAttempt.findMany).mockResolvedValue([]);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(0);

      const result = await adminStatsService.getSystemStats();

      expect(result).toEqual({
        totalUsers: 0,
        totalRecords: 0,
        activeUsers30Days: 0,
        openTickets: 0,
      });
    });
  });
});
