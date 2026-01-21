import { describe, it, expect } from 'vitest';
import {
  createTicketSchema,
  SUPPORT_CATEGORIES,
} from '../../src/validators/support.js';

describe('Support Validators', () => {
  describe('createTicketSchema', () => {
    it('should validate valid ticket data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Need help with account',
        category: 'account',
        message: 'I need help with my account. This is a detailed message that meets the minimum length requirement.',
      };

      const result = createTicketSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const data = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        subject: 'Test subject here',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.parse(data);

      expect(result.email).toBe('john@example.com');
    });

    it('should trim name', () => {
      const data = {
        name: '  John Doe  ',
        email: 'john@example.com',
        subject: 'Test subject here',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.parse(data);

      expect(result.name).toBe('John Doe');
    });

    it('should trim subject and message', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: '  Test subject here  ',
        category: 'general',
        message: '  This is a test message with enough characters.  ',
      };

      const result = createTicketSchema.parse(data);

      expect(result.subject).toBe('Test subject here');
      expect(result.message).toBe('This is a test message with enough characters.');
    });

    it('should reject empty name', () => {
      const data = {
        name: '',
        email: 'john@example.com',
        subject: 'Test subject here',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 characters', () => {
      const data = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        subject: 'Test subject here',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test subject here',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject email longer than 120 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'a'.repeat(110) + '@example.com',
        subject: 'Test subject here',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject subject shorter than 5 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hi',
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject subject longer than 200 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'A'.repeat(201),
        category: 'general',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test subject here',
        category: 'invalid-category',
        message: 'This is a test message with enough characters.',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should accept all valid categories', () => {
      for (const category of SUPPORT_CATEGORIES) {
        const data = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test subject here',
          category,
          message: 'This is a test message with enough characters.',
        };

        const result = createTicketSchema.safeParse(data);

        expect(result.success).toBe(true);
      }
    });

    it('should reject message shorter than 20 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test subject here',
        category: 'general',
        message: 'Short msg',
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should reject message longer than 5000 characters', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test subject here',
        category: 'general',
        message: 'A'.repeat(5001),
      };

      const result = createTicketSchema.safeParse(data);

      expect(result.success).toBe(false);
    });
  });
});
