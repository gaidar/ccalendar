import { describe, it, expect, vi } from 'vitest';

// Mock the config for adminNotificationEmail template
vi.mock('../../../src/config/index.js', () => ({
  config: {
    frontend: { url: 'http://localhost:3000' },
  },
}));

import {
  welcomeEmailTemplate,
  WELCOME_EMAIL_SUBJECT,
  confirmationReminderEmailTemplate,
  CONFIRMATION_REMINDER_SUBJECT,
  passwordResetEmailTemplate,
  PASSWORD_RESET_SUBJECT,
  passwordChangedEmailTemplate,
  PASSWORD_CHANGED_SUBJECT,
  accountDeletionEmailTemplate,
  ACCOUNT_DELETION_SUBJECT,
  supportTicketEmailTemplate,
  getSupportTicketSubject,
  adminNotificationEmailTemplate,
  getAdminNotificationSubject,
} from '../../../src/services/email/templates/index.js';

describe('Email Templates', () => {
  describe('welcomeEmailTemplate', () => {
    it('should include user name', () => {
      const html = welcomeEmailTemplate({
        name: 'John Doe',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(html).toContain('John Doe');
    });

    it('should include confirmation link', () => {
      const html = welcomeEmailTemplate({
        name: 'John',
        confirmationLink: 'https://example.com/confirm?token=abc123',
      });

      expect(html).toContain('https://example.com/confirm?token=abc123');
    });

    it('should include 48-hour expiry notice', () => {
      const html = welcomeEmailTemplate({
        name: 'John',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(html).toContain('48 hours');
    });

    it('should have correct subject', () => {
      expect(WELCOME_EMAIL_SUBJECT).toBe(
        'Welcome to Country Calendar! Please confirm your email'
      );
    });
  });

  describe('confirmationReminderEmailTemplate', () => {
    it('should include user name', () => {
      const html = confirmationReminderEmailTemplate({
        name: 'Jane Doe',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(html).toContain('Jane Doe');
    });

    it('should include 24-hour expiry notice', () => {
      const html = confirmationReminderEmailTemplate({
        name: 'Jane',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(html).toContain('24 hours');
    });

    it('should have correct subject', () => {
      expect(CONFIRMATION_REMINDER_SUBJECT).toBe(
        'Reminder: Please confirm your Country Calendar account'
      );
    });
  });

  describe('passwordResetEmailTemplate', () => {
    it('should include user name and reset link', () => {
      const html = passwordResetEmailTemplate({
        name: 'Bob',
        resetLink: 'https://example.com/reset?token=xyz',
      });

      expect(html).toContain('Bob');
      expect(html).toContain('https://example.com/reset?token=xyz');
    });

    it('should include 1-hour expiry notice', () => {
      const html = passwordResetEmailTemplate({
        name: 'Bob',
        resetLink: 'https://example.com/reset',
      });

      expect(html).toContain('1 hour');
    });

    it('should have correct subject', () => {
      expect(PASSWORD_RESET_SUBJECT).toBe('Reset your Country Calendar password');
    });
  });

  describe('passwordChangedEmailTemplate', () => {
    it('should include user name and date/time', () => {
      const html = passwordChangedEmailTemplate({
        name: 'Alice',
        dateTime: 'Monday, January 20, 2025 at 10:30 AM EST',
      });

      expect(html).toContain('Alice');
      expect(html).toContain('Monday, January 20, 2025');
    });

    it('should include security warning', () => {
      const html = passwordChangedEmailTemplate({
        name: 'Alice',
        dateTime: 'Monday, January 20, 2025',
      });

      expect(html.toLowerCase()).toContain('support');
    });

    it('should have correct subject', () => {
      expect(PASSWORD_CHANGED_SUBJECT).toBe(
        'Your Country Calendar password was changed'
      );
    });
  });

  describe('accountDeletionEmailTemplate', () => {
    it('should include user name and record count', () => {
      const html = accountDeletionEmailTemplate({
        name: 'Charlie',
        recordCount: 25,
      });

      expect(html).toContain('Charlie');
      expect(html).toContain('25 travel records');
    });

    it('should handle singular record count', () => {
      const html = accountDeletionEmailTemplate({
        name: 'Charlie',
        recordCount: 1,
      });

      expect(html).toContain('1 travel record');
    });

    it('should include irreversibility notice', () => {
      const html = accountDeletionEmailTemplate({
        name: 'Charlie',
        recordCount: 0,
      });

      expect(html.toLowerCase()).toContain('irreversible');
    });

    it('should have correct subject', () => {
      expect(ACCOUNT_DELETION_SUBJECT).toBe(
        'Your Country Calendar account has been deleted'
      );
    });
  });

  describe('supportTicketEmailTemplate', () => {
    it('should include reference ID prominently', () => {
      const html = supportTicketEmailTemplate({
        name: 'Dave',
        referenceId: 'TKT-ABC12345',
        subject: 'Test Subject',
        category: 'technical',
        message: 'Test message',
      });

      expect(html).toContain('TKT-ABC12345');
    });

    it('should include submitted message', () => {
      const html = supportTicketEmailTemplate({
        name: 'Dave',
        referenceId: 'TKT-ABC12345',
        subject: 'Test Subject',
        category: 'technical',
        message: 'This is my support message',
      });

      expect(html).toContain('This is my support message');
    });

    it('should escape HTML in message', () => {
      const html = supportTicketEmailTemplate({
        name: 'Dave',
        referenceId: 'TKT-ABC12345',
        subject: 'Test Subject',
        category: 'technical',
        message: '<script>alert("XSS")</script>',
      });

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>');
    });

    it('should generate correct subject', () => {
      expect(getSupportTicketSubject('TKT-ABC12345')).toBe(
        'We received your support request [TKT-ABC12345]'
      );
    });
  });

  describe('adminNotificationEmailTemplate', () => {
    it('should include ticket details', () => {
      const html = adminNotificationEmailTemplate({
        referenceId: 'TKT-XYZ98765',
        name: 'Reporter',
        email: 'reporter@example.com',
        userId: 'user-123',
        category: 'bug',
        subject: 'Bug Report',
        message: 'Found a bug!',
        createdAt: new Date('2025-01-20T15:30:00Z'),
      });

      expect(html).toContain('TKT-XYZ98765');
      expect(html).toContain('Reporter');
      expect(html).toContain('reporter@example.com');
      expect(html).toContain('user-123');
      expect(html).toContain('bug');
      expect(html).toContain('Bug Report');
      expect(html).toContain('Found a bug!');
    });

    it('should show Guest for null userId', () => {
      const html = adminNotificationEmailTemplate({
        referenceId: 'TKT-XYZ98765',
        name: 'Guest User',
        email: 'guest@example.com',
        userId: null,
        category: 'general',
        subject: 'General Question',
        message: 'Question text',
        createdAt: new Date(),
      });

      expect(html).toContain('Guest');
    });

    it('should generate correct subject', () => {
      expect(getAdminNotificationSubject('TKT-XYZ', 'Bug Report')).toBe(
        '[New Ticket] TKT-XYZ: Bug Report'
      );
    });
  });

  describe('Base template structure', () => {
    it('should include Country Calendar branding', () => {
      const html = welcomeEmailTemplate({
        name: 'Test',
        confirmationLink: 'https://example.com',
      });

      expect(html).toContain('Country Calendar');
    });

    it('should include support contact', () => {
      const html = welcomeEmailTemplate({
        name: 'Test',
        confirmationLink: 'https://example.com',
      });

      expect(html).toContain('support@countrycalendar.app');
    });

    it('should include copyright notice', () => {
      const html = welcomeEmailTemplate({
        name: 'Test',
        confirmationLink: 'https://example.com',
      });

      expect(html).toContain('Country Calendar');
      expect(html).toMatch(/\d{4}/); // Contains year
    });

    it('should be valid HTML', () => {
      const html = welcomeEmailTemplate({
        name: 'Test',
        confirmationLink: 'https://example.com',
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
    });
  });
});
