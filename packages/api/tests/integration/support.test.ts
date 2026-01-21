import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../testApp.js';
import { prisma } from '../../src/utils/prisma.js';
import { tokenService } from '../../src/services/tokenService.js';

// Mock Prisma client
vi.mock('../../src/utils/prisma.js', () => ({
  prisma: {
    supportTicket: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const app = createTestApp();

describe('Support Integration Tests', () => {
  const testUserId = 'test-user-123';
  const testEmail = 'test@example.com';
  let validToken: string;

  beforeEach(() => {
    vi.clearAllMocks();

    // Generate a valid access token
    validToken = tokenService.generateAccessToken({
      userId: testUserId,
      email: testEmail,
      isAdmin: false,
    });
  });

  describe('POST /api/v1/support', () => {
    const validTicketData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Need help with my account',
      category: 'account',
      message: 'I need help with my account. This is a detailed message that meets the minimum length.',
    };

    it('should create a ticket successfully as anonymous user', async () => {
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

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.supportTicket.create).mockResolvedValue(mockCreatedTicket);

      const response = await request(app)
        .post('/api/v1/support')
        .send(validTicketData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Support ticket created successfully');
      expect(response.body.referenceId).toBeDefined();
      expect(response.body.referenceId).toMatch(/^TKT-[A-Z0-9]{8}$/);
      expect(response.body.ticket.status).toBe('open');
    });

    it('should create a ticket and link to user when authenticated', async () => {
      const mockCreatedTicket = {
        id: 'ticket-uuid-123',
        referenceId: 'TKT-ABCD1234',
        name: validTicketData.name,
        email: validTicketData.email,
        subject: validTicketData.subject,
        category: validTicketData.category,
        message: validTicketData.message,
        userId: testUserId,
        status: 'open',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.supportTicket.create).mockResolvedValue(mockCreatedTicket);

      const response = await request(app)
        .post('/api/v1/support')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validTicketData);

      expect(response.status).toBe(201);
      expect(vi.mocked(prisma.supportTicket.create)).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: testUserId,
        }),
      });
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/api/v1/support')
        .send({
          email: 'john@example.com',
          subject: 'Need help with my account',
          category: 'account',
          message: 'I need help with my account. This is a detailed message that meets the minimum length.',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/support')
        .send({
          ...validTicketData,
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid category', async () => {
      const response = await request(app)
        .post('/api/v1/support')
        .send({
          ...validTicketData,
          category: 'invalid-category',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for subject too short', async () => {
      const response = await request(app)
        .post('/api/v1/support')
        .send({
          ...validTicketData,
          subject: 'Hi',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for message too short', async () => {
      const response = await request(app)
        .post('/api/v1/support')
        .send({
          ...validTicketData,
          message: 'Short',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should accept all valid categories', async () => {
      const categories = ['general', 'account', 'bug', 'feature', 'billing', 'other'];

      for (const category of categories) {
        vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);
        vi.mocked(prisma.supportTicket.create).mockResolvedValue({
          id: 'ticket-uuid-123',
          referenceId: 'TKT-ABCD1234',
          name: validTicketData.name,
          email: validTicketData.email,
          subject: validTicketData.subject,
          category,
          message: validTicketData.message,
          userId: null,
          status: 'open',
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const response = await request(app)
          .post('/api/v1/support')
          .send({
            ...validTicketData,
            category,
          });

        expect(response.status).toBe(201);
      }
    });

    it('should continue without user when invalid token is provided', async () => {
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

      vi.mocked(prisma.supportTicket.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.supportTicket.create).mockResolvedValue(mockCreatedTicket);

      const response = await request(app)
        .post('/api/v1/support')
        .set('Authorization', 'Bearer invalid-token')
        .send(validTicketData);

      // optionalAuth continues even with invalid token
      expect(response.status).toBe(201);
      expect(vi.mocked(prisma.supportTicket.create)).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: null,
        }),
      });
    });
  });
});
