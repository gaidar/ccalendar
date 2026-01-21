import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { prisma } from '../../src/utils/prisma.js';
import { tokenService } from '../../src/services/tokenService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    travelRecord: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    supportTicket: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    loginAttempt: {
      findMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

const app = createTestApp();

describe('Admin Integration Tests', () => {
  const adminUserId = '550e8400-e29b-41d4-a716-446655440000';
  const adminEmail = 'admin@example.com';
  const regularUserId = '550e8400-e29b-41d4-a716-446655440001';
  const regularEmail = 'user@example.com';
  let adminToken: string;
  let userToken: string;

  beforeEach(() => {
    vi.clearAllMocks();

    // Generate tokens
    adminToken = tokenService.generateAccessToken({
      userId: adminUserId,
      email: adminEmail,
      isAdmin: true,
    });

    userToken = tokenService.generateAccessToken({
      userId: regularUserId,
      email: regularEmail,
      isAdmin: false,
    });

    // Mock audit log creation
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as never);
  });

  describe('Admin Middleware', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/v1/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('UNAUTHORIZED');
    });

    it('should return 403 when not admin', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('FORBIDDEN');
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should list users with pagination', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          name: 'User One',
          email: 'user1@example.com',
          isAdmin: false,
          isConfirmed: true,
          createdAt: new Date('2024-01-01'),
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as never);
      vi.mocked(prisma.user.count).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      });
    });

    it('should filter users by search', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const response = await request(app)
        .get('/api/v1/admin/users?search=test')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { email: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        })
      );
    });
  });

  describe('GET /api/v1/admin/users/:id', () => {
    it('should return user details with stats', async () => {
      const mockUser = {
        id: regularUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        _count: { travelRecords: 10 },
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([
        { countryCode: 'US' },
        { countryCode: 'GB' },
      ] as never);

      const response = await request(app)
        .get(`/api/v1/admin/users/${regularUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        id: regularUserId,
        name: 'Test User',
        stats: {
          totalRecords: 10,
          totalCountries: 2,
        },
      });
    });

    it('should return 404 for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/admin/users/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400); // Invalid UUID format
    });
  });

  describe('PATCH /api/v1/admin/users/:id', () => {
    it('should update user', async () => {
      const mockUser = {
        id: regularUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      const updatedUser = { ...mockUser, name: 'Updated Name' };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as never);

      const response = await request(app)
        .patch(`/api/v1/admin/users/${regularUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe('Updated Name');
    });

    it('should prevent self-demotion', async () => {
      const mockUser = {
        id: adminUserId,
        name: 'Admin User',
        email: adminEmail,
        isAdmin: true,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const response = await request(app)
        .patch(`/api/v1/admin/users/${adminUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isAdmin: false });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('CANNOT_DEMOTE_SELF');
    });
  });

  describe('DELETE /api/v1/admin/users/:id', () => {
    it('should delete user', async () => {
      const mockUser = {
        id: regularUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as never);

      const response = await request(app)
        .delete(`/api/v1/admin/users/${regularUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should prevent self-deletion', async () => {
      const mockUser = {
        id: adminUserId,
        name: 'Admin User',
        email: adminEmail,
        isAdmin: true,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const response = await request(app)
        .delete(`/api/v1/admin/users/${adminUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('CANNOT_DELETE_SELF');
    });
  });

  describe('GET /api/v1/admin/support', () => {
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
      ];

      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue(mockTickets as never);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/admin/support')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tickets).toHaveLength(1);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      });
    });

    it('should filter tickets by status', async () => {
      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue([]);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(0);

      const response = await request(app)
        .get('/api/v1/admin/support?status=open')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'open' },
        })
      );
    });
  });

  describe('PATCH /api/v1/admin/support/:referenceId', () => {
    it('should update ticket status', async () => {
      const mockTicket = {
        id: 'ticket-123',
        referenceId: 'TKT-ABCD1234',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        category: 'account',
        message: 'I need help.',
        status: 'open',
        notes: null,
        userId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const updatedTicket = { ...mockTicket, status: 'in_progress' };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket as never);
      vi.mocked(prisma.supportTicket.update).mockResolvedValue(updatedTicket as never);

      const response = await request(app)
        .patch('/api/v1/admin/support/TKT-ABCD1234')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'in_progress' });

      expect(response.status).toBe(200);
      expect(response.body.ticket.status).toBe('in_progress');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch('/api/v1/admin/support/TKT-ABCD1234')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/v1/admin/support/:referenceId', () => {
    it('should delete ticket', async () => {
      const mockTicket = {
        id: 'ticket-123',
        referenceId: 'TKT-ABCD1234',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help',
        category: 'account',
        message: 'I need help.',
        status: 'open',
        notes: null,
        userId: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(mockTicket as never);
      vi.mocked(prisma.supportTicket.delete).mockResolvedValue(mockTicket as never);

      const response = await request(app)
        .delete('/api/v1/admin/support/TKT-ABCD1234')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Ticket deleted successfully');
    });
  });

  describe('GET /api/v1/admin/stats', () => {
    it('should return system statistics', async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(100);
      vi.mocked(prisma.travelRecord.count).mockResolvedValue(500);
      vi.mocked(prisma.loginAttempt.findMany).mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
      ] as never);
      vi.mocked(prisma.supportTicket.count).mockResolvedValue(5);

      const response = await request(app)
        .get('/api/v1/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stats).toEqual({
        totalUsers: 100,
        totalRecords: 500,
        activeUsers30Days: 2,
        openTickets: 5,
      });
    });
  });

  describe('Audit Logging', () => {
    it('should log admin action on user view', async () => {
      const mockUser = {
        id: regularUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        _count: { travelRecords: 0 },
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      await request(app)
        .get(`/api/v1/admin/users/${regularUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          adminId: adminUserId,
          action: 'USER_VIEWED',
          targetType: 'user',
          targetId: regularUserId,
        }),
      });
    });
  });
});
