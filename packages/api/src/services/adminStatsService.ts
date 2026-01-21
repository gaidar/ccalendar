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

    const [totalUsers, totalRecords, activeUsers30Days, openTickets] =
      await Promise.all([
        prisma.user.count(),
        prisma.travelRecord.count(),
        prisma.loginAttempt.groupBy({
          by: ['userId'],
          where: {
            success: true,
            createdAt: { gte: thirtyDaysAgo },
            userId: { not: null },
          },
        }),
        prisma.supportTicket.count({
          where: { status: 'open' },
        }),
      ]);

    return {
      totalUsers,
      totalRecords,
      activeUsers30Days: activeUsers30Days.length,
      openTickets,
    };
  },
};
