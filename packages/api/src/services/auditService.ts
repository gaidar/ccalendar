import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

export type AuditAction =
  | 'USER_VIEWED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'TICKET_VIEWED'
  | 'TICKET_UPDATED'
  | 'TICKET_DELETED';

export type AuditTargetType = 'user' | 'ticket';

export interface AuditLogEntry {
  adminId: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId: string;
  details?: Record<string, unknown>;
}

export const auditService = {
  /**
   * Log an admin action for audit purposes
   */
  async logAdminAction(entry: AuditLogEntry): Promise<void> {
    await prisma.auditLog.create({
      data: {
        adminId: entry.adminId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        details: entry.details
          ? (entry.details as Prisma.InputJsonObject)
          : Prisma.JsonNull,
      },
    });
  },
};
