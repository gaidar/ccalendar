import { prisma } from '../utils/prisma.js';
import { HttpError, NotFoundError } from '../middleware/errorHandler.js';
import type { UserListQueryInput, UserUpdateInput } from '../validators/admin.js';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isConfirmed: boolean;
  createdAt: Date;
}

export interface AdminUserWithStats extends AdminUser {
  stats: {
    totalRecords: number;
    totalCountries: number;
  };
}

export interface PaginatedUsers {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminUserService = {
  /**
   * List users with pagination and optional search
   */
  async listUsers(input: UserListQueryInput): Promise<PaginatedUsers> {
    const { page, limit, search } = input;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          isConfirmed: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get user by ID with stats
   */
  async getUserById(id: string): Promise<AdminUserWithStats> {
    // Combine user fetch with record count using _count
    const [user, countries] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          isConfirmed: true,
          createdAt: true,
          _count: {
            select: { travelRecords: true },
          },
        },
      }),
      prisma.travelRecord.findMany({
        where: { userId: id },
        distinct: ['countryCode'],
        select: { countryCode: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      createdAt: user.createdAt,
      stats: {
        totalRecords: user._count.travelRecords,
        totalCountries: countries.length,
      },
    };
  },

  /**
   * Update user information
   */
  async updateUser(
    id: string,
    adminId: string,
    data: UserUpdateInput
  ): Promise<AdminUser> {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent self-demotion
    if (id === adminId && data.isAdmin === false) {
      throw new HttpError(400, 'CANNOT_DEMOTE_SELF', 'Admins cannot demote themselves');
    }

    // Check email uniqueness if updating email
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new HttpError(400, 'EMAIL_EXISTS', 'Email already in use by another user');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.isAdmin !== undefined && { isAdmin: data.isAdmin }),
        ...(data.isConfirmed !== undefined && { isConfirmed: data.isConfirmed }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isConfirmed: true,
        createdAt: true,
      },
    });

    return updatedUser;
  },

  /**
   * Delete user and cascade delete related data
   */
  async deleteUser(id: string, adminId: string): Promise<void> {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent self-deletion
    if (id === adminId) {
      throw new HttpError(400, 'CANNOT_DELETE_SELF', 'Admins cannot delete themselves');
    }

    // Delete user - cascade will handle related data
    await prisma.user.delete({ where: { id } });
  },
};
