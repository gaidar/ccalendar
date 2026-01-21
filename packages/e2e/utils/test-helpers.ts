import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

// Initialize Prisma client for test database operations
const prisma = new PrismaClient();

export interface TestUser {
  name: string;
  email: string;
  password: string;
  id?: string;
}

/**
 * Hash a password using the same algorithm as the API
 * Note: This is a simplified version - the API uses bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  // We'll use bcrypt-compatible hash via the API instead
  // For now, we create users through the registration flow
  return password;
}

/**
 * Create a test user directly in the database
 */
export async function createTestUser(user: TestUser): Promise<string | undefined> {
  try {
    // Import bcrypt dynamically to hash password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email.toLowerCase(),
        password: hashedPassword,
        isConfirmed: false,
      },
    });

    return createdUser.id;
  } catch (error) {
    console.error('Failed to create test user:', error);
    return undefined;
  }
}

/**
 * Delete a test user from the database
 */
export async function deleteTestUser(userId: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    // User may already be deleted or not exist
    console.warn('Failed to delete test user:', error);
  }
}

/**
 * Delete a test user by email from the database
 */
export async function deleteTestUserByEmail(email: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { email: email.toLowerCase() },
    });
  } catch (error) {
    // User may not exist
    console.warn('Failed to delete test user by email:', error);
  }
}

/**
 * Confirm a user's email directly in the database
 */
export async function confirmUser(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to confirm user:', error);
  }
}

/**
 * Get the email confirmation token for a user
 */
export async function getConfirmationToken(userId: string): Promise<string | null> {
  try {
    const token = await prisma.emailConfirmationToken.findUnique({
      where: { userId },
    });
    return token?.token || null;
  } catch (error) {
    console.error('Failed to get confirmation token:', error);
    return null;
  }
}

/**
 * Create a confirmed test user
 */
export async function createConfirmedTestUser(user: TestUser): Promise<string | undefined> {
  const userId = await createTestUser(user);
  if (userId) {
    await confirmUser(userId);
  }
  return userId;
}

/**
 * Create travel records for a test user
 */
export async function createTestTravelRecord(
  userId: string,
  date: Date,
  countryCode: string
): Promise<string | undefined> {
  try {
    const record = await prisma.travelRecord.create({
      data: {
        userId,
        date,
        countryCode: countryCode.toUpperCase(),
      },
    });
    return record.id;
  } catch (error) {
    console.error('Failed to create travel record:', error);
    return undefined;
  }
}

/**
 * Delete all travel records for a user
 */
export async function deleteUserTravelRecords(userId: string): Promise<void> {
  try {
    await prisma.travelRecord.deleteMany({
      where: { userId },
    });
  } catch (error) {
    console.error('Failed to delete travel records:', error);
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<{ id: string; isConfirmed: boolean } | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, isConfirmed: true },
    });
    return user;
  } catch (error) {
    console.error('Failed to get user by email:', error);
    return null;
  }
}

/**
 * Clean up all test data created during tests
 * This is useful for running in global teardown
 */
export async function cleanupTestData(): Promise<void> {
  try {
    // Delete users with test email patterns
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@e2e-test.local',
        },
      },
    });
  } catch (error) {
    console.error('Failed to cleanup test data:', error);
  }
}

/**
 * Disconnect Prisma client
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Generate a random email for testing
 */
export function generateTestEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}@e2e-test.local`;
}
