import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';

// Create mock sendMail function at module level
const mockSendMail = vi.fn();
const mockLoggerInfo = vi.fn();
const mockLoggerWarn = vi.fn();
const mockLoggerDebug = vi.fn();
const mockLoggerError = vi.fn();

// Mock dependencies first before any imports
vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: mockSendMail,
      })),
    },
  };
});

vi.mock('nodemailer-mailgun-transport', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('../../../src/config/index.js', () => ({
  config: {
    env: 'production', // Use production to avoid dev-mode bypass
    frontend: { url: 'http://localhost:3000' },
    email: {
      mailgunApiKey: 'test-api-key',
      mailgunDomain: 'test.mailgun.org',
      from: 'noreply@countrycalendar.app',
      replyTo: 'support@countrycalendar.app',
      adminEmail: 'admin@countrycalendar.app',
      isConfigured: true,
    },
  },
}));

vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: mockLoggerInfo,
    warn: mockLoggerWarn,
    debug: mockLoggerDebug,
    error: mockLoggerError,
  },
}));

describe('emailService', () => {
  // Use dynamic import to get fresh instance with mocks applied
  let emailService: Awaited<typeof import('../../../src/services/email/emailService.js')>['emailService'];
  let logger: Awaited<typeof import('../../../src/utils/logger.js')>['logger'];

  beforeAll(async () => {
    // Reset modules to ensure fresh import with mocks
    vi.resetModules();

    // Dynamically import after mocks are set up
    const emailModule = await import('../../../src/services/email/emailService.js');
    emailService = emailModule.emailService;

    const loggerModule = await import('../../../src/utils/logger.js');
    logger = loggerModule.logger;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock to return success
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct subject', async () => {
      const result = await emailService.sendWelcomeEmail({
        name: 'John Doe',
        email: 'john@example.com',
        confirmationLink: 'https://example.com/confirm?token=abc123',
      });

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('john@example.com');
      expect(callArgs.subject).toBe(
        'Welcome to Country Calendar! Please confirm your email'
      );
      expect(callArgs.html).toContain('John Doe');
      expect(callArgs.html).toContain('https://example.com/confirm?token=abc123');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct subject', async () => {
      const result = await emailService.sendPasswordResetEmail({
        name: 'Jane Doe',
        email: 'jane@example.com',
        resetLink: 'https://example.com/reset?token=xyz789',
      });

      expect(result.success).toBe(true);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('jane@example.com');
      expect(callArgs.subject).toBe('Reset your Country Calendar password');
      expect(callArgs.html).toContain('Jane Doe');
      expect(callArgs.html).toContain('https://example.com/reset?token=xyz789');
    });
  });

  describe('sendPasswordChangedEmail', () => {
    it('should send password changed confirmation email', async () => {
      const result = await emailService.sendPasswordChangedEmail({
        name: 'Bob Smith',
        email: 'bob@example.com',
        dateTime: 'Monday, January 20, 2025 at 10:30 AM EST',
      });

      expect(result.success).toBe(true);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('bob@example.com');
      expect(callArgs.subject).toBe('Your Country Calendar password was changed');
      expect(callArgs.html).toContain('Bob Smith');
      expect(callArgs.html).toContain('Monday, January 20, 2025');
    });
  });

  describe('sendAccountDeletionEmail', () => {
    it('should send account deletion email with record count', async () => {
      const result = await emailService.sendAccountDeletionEmail({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        recordCount: 42,
      });

      expect(result.success).toBe(true);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('alice@example.com');
      expect(callArgs.subject).toBe(
        'Your Country Calendar account has been deleted'
      );
      expect(callArgs.html).toContain('Alice Johnson');
      expect(callArgs.html).toContain('42 travel records');
    });
  });

  describe('sendSupportTicketEmail', () => {
    it('should send support ticket confirmation with reference ID', async () => {
      const result = await emailService.sendSupportTicketEmail({
        name: 'Support User',
        email: 'support.user@example.com',
        referenceId: 'TKT-ABC12345',
        subject: 'Test Issue',
        category: 'technical',
        message: 'This is a test message.',
      });

      expect(result.success).toBe(true);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('support.user@example.com');
      expect(callArgs.subject).toBe(
        'We received your support request [TKT-ABC12345]'
      );
      expect(callArgs.html).toContain('TKT-ABC12345');
      expect(callArgs.html).toContain('Test Issue');
    });
  });

  describe('sendAdminNotification', () => {
    it('should send admin notification for new tickets', async () => {
      const result = await emailService.sendAdminNotification({
        referenceId: 'TKT-XYZ98765',
        name: 'Reporter Name',
        email: 'reporter@example.com',
        userId: 'user-123',
        category: 'bug',
        subject: 'Bug Report',
        message: 'Found a bug!',
        createdAt: new Date('2025-01-20T15:30:00Z'),
      });

      expect(result.success).toBe(true);

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('admin@countrycalendar.app');
      expect(callArgs.subject).toBe('[New Ticket] TKT-XYZ98765: Bug Report');
    });
  });

  describe('email validation', () => {
    it('should fail for invalid email addresses', async () => {
      const result = await emailService.sendWelcomeEmail({
        name: 'Invalid',
        email: 'not-an-email',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email address');
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should fail for empty email', async () => {
      const result = await emailService.sendWelcomeEmail({
        name: 'Empty',
        email: '',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(result.success).toBe(false);
      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });

  describe('retry logic', () => {
    it('should retry on failure', async () => {
      mockSendMail
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ messageId: 'success-after-retries' });

      const result = await emailService.sendWelcomeEmail({
        name: 'Retry Test',
        email: 'retry@example.com',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      mockSendMail.mockRejectedValue(new Error('Persistent error'));

      const result = await emailService.sendWelcomeEmail({
        name: 'Fail Test',
        email: 'fail@example.com',
        confirmationLink: 'https://example.com/confirm',
      });

      expect(result.success).toBe(false);
      expect(mockSendMail).toHaveBeenCalledTimes(3); // MAX_RETRY_ATTEMPTS
      expect(logger.error).toHaveBeenCalledWith(
        'Email send failed after all retries',
        expect.any(Object)
      );
    });
  });

  describe('isReady', () => {
    it('should return true when configured', () => {
      expect(emailService.isReady()).toBe(true);
    });
  });
});
