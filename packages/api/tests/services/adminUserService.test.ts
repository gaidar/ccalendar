import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../../src/utils/prisma.js';
import { adminUserService } from '../../src/services/adminUserService.js';
import { NotFoundError, HttpError } from '../../src/middleware/errorHandler.js';

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
      findMany: vi.fn(),
    },
  },
}));

describe('AdminUserService', () => {
  const mockUserId = 'user-123';
  const mockAdminId = 'admin-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listUsers', () => {
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
        {
          id: 'user-2',
          name: 'User Two',
          email: 'user2@example.com',
          isAdmin: true,
          isConfirmed: true,
          createdAt: new Date('2024-01-02'),
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as never);
      vi.mocked(prisma.user.count).mockResolvedValue(25);

      const result = await adminUserService.listUsers({ page: 1, limit: 20 });

      expect(result.users).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 25,
        pages: 2,
      });
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should filter users by search term', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      await adminUserService.listUsers({ page: 1, limit: 20, search: 'test' });

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { email: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should handle pagination offset correctly', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);
      vi.mocked(prisma.user.count).mockResolvedValue(50);

      await adminUserService.listUsers({ page: 3, limit: 10 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        })
      );
    });
  });

  describe('getUserById', () => {
    it('should return user with stats', async () => {
      const mockUser = {
        id: mockUserId,
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
        { countryCode: 'FR' },
      ] as never);

      const result = await adminUserService.getUserById(mockUserId);

      expect(result).toEqual({
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
        stats: {
          totalRecords: 10,
          totalCountries: 3,
        },
      });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.travelRecord.findMany).mockResolvedValue([]);

      await expect(adminUserService.getUserById(mockUserId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateUser', () => {
    it('should update user fields', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
        isAdmin: true,
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as never);

      const result = await adminUserService.updateUser(mockUserId, mockAdminId, {
        name: 'Updated Name',
        isAdmin: true,
      });

      expect(result.name).toBe('Updated Name');
      expect(result.isAdmin).toBe(true);
    });

    it('should prevent admin from demoting themselves', async () => {
      const mockUser = {
        id: mockAdminId,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      await expect(
        adminUserService.updateUser(mockAdminId, mockAdminId, { isAdmin: false })
      ).rejects.toThrow(HttpError);

      await expect(
        adminUserService.updateUser(mockAdminId, mockAdminId, { isAdmin: false })
      ).rejects.toMatchObject({ code: 'CANNOT_DEMOTE_SELF' });
    });

    it('should prevent email duplication', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      const existingUser = {
        id: 'other-user',
        email: 'existing@example.com',
      };

      vi.mocked(prisma.user.findUnique)
        .mockResolvedValueOnce(mockUser as never)
        .mockResolvedValueOnce(existingUser as never);

      await expect(
        adminUserService.updateUser(mockUserId, mockAdminId, { email: 'existing@example.com' })
      ).rejects.toThrow(HttpError);

      await expect(
        adminUserService.updateUser(mockUserId, mockAdminId, { email: 'existing@example.com' })
      ).rejects.toMatchObject({ code: 'EMAIL_EXISTS' });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        adminUserService.updateUser(mockUserId, mockAdminId, { name: 'New Name' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = {
        id: mockUserId,
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser as never);

      await expect(
        adminUserService.deleteUser(mockUserId, mockAdminId)
      ).resolves.toBeUndefined();

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: mockUserId } });
    });

    it('should prevent admin from deleting themselves', async () => {
      const mockUser = {
        id: mockAdminId,
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
        isConfirmed: true,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      await expect(
        adminUserService.deleteUser(mockAdminId, mockAdminId)
      ).rejects.toThrow(HttpError);

      await expect(
        adminUserService.deleteUser(mockAdminId, mockAdminId)
      ).rejects.toMatchObject({ code: 'CANNOT_DELETE_SELF' });
    });

    it('should throw NotFoundError for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        adminUserService.deleteUser(mockUserId, mockAdminId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
