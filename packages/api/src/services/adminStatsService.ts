import { prisma } from '../utils/prisma.js';

export interface SystemStats {
  totalUsers: number;
  totalRecords: number;
  activeUsers30Days: number;
  openTickets: number;
}

export const adminStatsService = {
  /**
   * Get system statistics for admin dashboard
   */
  async getSystemStats(): Promise<SystemStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, totalRecords, activeUsers, openTickets] =
      await Promise.all([
        prisma.user.count(),
        prisma.travelRecord.count(),
        // Use findMany with distinct instead of groupBy for better performance
        prisma.loginAttempt.findMany({
          where: {
            success: true,
            createdAt: { gte: thirtyDaysAgo },
            userId: { not: null },
          },
          distinct: ['userId'],
          select: { userId: true },
        }),
        prisma.supportTicket.count({
          where: { status: 'open' },
        }),
      ]);

    return {
      totalUsers,
      totalRecords,
      activeUsers30Days: activeUsers.length,
      openTickets,
    };
  },
};
