import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { generatePlainText } from './plainTextGenerator.js';
import {
  welcomeEmailTemplate,
  WelcomeEmailData,
  WELCOME_EMAIL_SUBJECT,
  confirmationReminderEmailTemplate,
  ConfirmationReminderEmailData,
  CONFIRMATION_REMINDER_SUBJECT,
  passwordResetEmailTemplate,
  PasswordResetEmailData,
  PASSWORD_RESET_SUBJECT,
  passwordChangedEmailTemplate,
  PasswordChangedEmailData,
  PASSWORD_CHANGED_SUBJECT,
  accountDeletionEmailTemplate,
  AccountDeletionEmailData,
  ACCOUNT_DELETION_SUBJECT,
  supportTicketEmailTemplate,
  SupportTicketEmailData,
  getSupportTicketSubject,
  adminNotificationEmailTemplate,
  AdminNotificationEmailData,
  getAdminNotificationSubject,
} from './templates/index.js';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retry configuration
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff in ms

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = config.email.isConfigured;

    if (this.isConfigured) {
      this.initializeTransporter();
    } else {
      logger.warn('Email service not configured: MAILGUN_API_KEY or MAILGUN_DOMAIN missing');
    }
  }

  private initializeTransporter(): void {
    try {
      const mailgunAuth = {
        auth: {
          api_key: config.email.mailgunApiKey!,
          domain: config.email.mailgunDomain!,
        },
      };

      this.transporter = nodemailer.createTransport(mailgunTransport(mailgunAuth));
      logger.info('Email service initialized with Mailgun transport');
    } catch (error) {
      logger.error('Failed to initialize email transporter', { error });
      this.isConfigured = false;
    }
  }

  /**
   * Validates an email address format
   */
  private validateEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
  }

  /**
   * Delays execution for a specified number of milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Sends an email with retry logic
   */
  private async sendWithRetry(options: SendEmailOptions): Promise<SendEmailResult> {
    if (!this.isConfigured || !this.transporter) {
      // In development without email config, log the email instead
      if (config.env === 'development' || config.env === 'test') {
        logger.debug('Email would be sent (email service not configured)', {
          to: options.to,
          subject: options.subject,
          // Only log content in development
          ...(config.env === 'development' && { htmlPreview: options.html.substring(0, 500) }),
        });
        return { success: true, messageId: 'dev-mode-no-send' };
      }

      logger.error('Cannot send email: email service not configured');
      return { success: false, error: 'Email service not configured' };
    }

    // Validate email address
    if (!this.validateEmail(options.to)) {
      logger.error('Invalid email address', { to: options.to });
      return { success: false, error: 'Invalid email address' };
    }

    // Generate plain text if not provided
    const text = options.text || generatePlainText(options.html);

    const mailOptions = {
      from: `Country Calendar <${config.email.from}>`,
      replyTo: config.email.replyTo,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        if (attempt > 0) {
          logger.info(`Retrying email send (attempt ${attempt + 1}/${MAX_RETRY_ATTEMPTS})`, {
            to: options.to,
            subject: options.subject,
          });
        }

        const info = await this.transporter.sendMail(mailOptions);

        // Log success (without content in production)
        if (config.env === 'production') {
          logger.info('Email sent successfully', {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId,
          });
        } else {
          logger.debug('Email sent successfully', {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId,
          });
        }

        return { success: true, messageId: info.messageId };
      } catch (error) {
        lastError = error as Error;

        logger.warn(`Email send attempt ${attempt + 1} failed`, {
          to: options.to,
          subject: options.subject,
          error: lastError.message,
        });

        // Check if it's a rate limit error
        if (lastError.message.includes('rate limit') || lastError.message.includes('429')) {
          // For rate limit errors, wait longer
          await this.delay(RETRY_DELAYS[attempt] * 2);
        } else if (attempt < MAX_RETRY_ATTEMPTS - 1) {
          // Regular exponential backoff
          await this.delay(RETRY_DELAYS[attempt]);
        }
      }
    }

    // All retries exhausted
    logger.error('Email send failed after all retries', {
      to: options.to,
      subject: options.subject,
      error: lastError?.message,
    });

    return { success: false, error: lastError?.message || 'Unknown error' };
  }

  /**
   * Sends an email asynchronously (fire and forget, won't block caller)
   * Errors are logged but not thrown
   */
  private sendAsync(options: SendEmailOptions): void {
    // Use Promise to run async without blocking
    void (async (): Promise<void> => {
      try {
        await this.sendWithRetry(options);
      } catch (error) {
        logger.error('Async email send error', { error, to: options.to });
      }
    })();
  }

  /**
   * Sends welcome email with email confirmation link
   */
  async sendWelcomeEmail(data: WelcomeEmailData & { email: string }): Promise<SendEmailResult> {
    const html = welcomeEmailTemplate(data);
    return this.sendWithRetry({
      to: data.email,
      subject: WELCOME_EMAIL_SUBJECT,
      html,
    });
  }

  /**
   * Sends welcome email asynchronously
   */
  sendWelcomeEmailAsync(data: WelcomeEmailData & { email: string }): void {
    const html = welcomeEmailTemplate(data);
    this.sendAsync({
      to: data.email,
      subject: WELCOME_EMAIL_SUBJECT,
      html,
    });
  }

  /**
   * Sends confirmation reminder email
   */
  async sendConfirmationReminder(data: ConfirmationReminderEmailData & { email: string }): Promise<SendEmailResult> {
    const html = confirmationReminderEmailTemplate(data);
    return this.sendWithRetry({
      to: data.email,
      subject: CONFIRMATION_REMINDER_SUBJECT,
      html,
    });
  }

  /**
   * Sends confirmation reminder email asynchronously
   */
  sendConfirmationReminderAsync(data: ConfirmationReminderEmailData & { email: string }): void {
    const html = confirmationReminderEmailTemplate(data);
    this.sendAsync({
      to: data.email,
      subject: CONFIRMATION_REMINDER_SUBJECT,
      html,
    });
  }

  /**
   * Sends password reset email
   */
  async sendPasswordResetEmail(data: PasswordResetEmailData & { email: string }): Promise<SendEmailResult> {
    const html = passwordResetEmailTemplate(data);
    return this.sendWithRetry({
      to: data.email,
      subject: PASSWORD_RESET_SUBJECT,
      html,
    });
  }

  /**
   * Sends password reset email asynchronously
   */
  sendPasswordResetEmailAsync(data: PasswordResetEmailData & { email: string }): void {
    const html = passwordResetEmailTemplate(data);
    this.sendAsync({
      to: data.email,
      subject: PASSWORD_RESET_SUBJECT,
      html,
    });
  }

  /**
   * Sends password changed confirmation email
   */
  async sendPasswordChangedEmail(data: PasswordChangedEmailData & { email: string }): Promise<SendEmailResult> {
    const html = passwordChangedEmailTemplate(data);
    return this.sendWithRetry({
      to: data.email,
      subject: PASSWORD_CHANGED_SUBJECT,
      html,
    });
  }

  /**
   * Sends password changed email asynchronously
   */
  sendPasswordChangedEmailAsync(data: PasswordChangedEmailData & { email: string }): void {
    const html = passwordChangedEmailTemplate(data);
    this.sendAsync({
      to: data.email,
      subject: PASSWORD_CHANGED_SUBJECT,
      html,
    });
  }

  /**
   * Sends account deletion confirmation email
   */
  async sendAccountDeletionEmail(data: AccountDeletionEmailData & { email: string }): Promise<SendEmailResult> {
    const html = accountDeletionEmailTemplate(data);
    return this.sendWithRetry({
      to: data.email,
      subject: ACCOUNT_DELETION_SUBJECT,
      html,
    });
  }

  /**
   * Sends account deletion email asynchronously
   */
  sendAccountDeletionEmailAsync(data: AccountDeletionEmailData & { email: string }): void {
    const html = accountDeletionEmailTemplate(data);
    this.sendAsync({
      to: data.email,
      subject: ACCOUNT_DELETION_SUBJECT,
      html,
    });
  }

  /**
   * Sends support ticket confirmation email to the submitter
   */
  async sendSupportTicketEmail(data: SupportTicketEmailData & { email: string }): Promise<SendEmailResult> {
    const html = supportTicketEmailTemplate(data);
    const subject = getSupportTicketSubject(data.referenceId);
    return this.sendWithRetry({
      to: data.email,
      subject,
      html,
    });
  }

  /**
   * Sends support ticket confirmation email asynchronously
   */
  sendSupportTicketEmailAsync(data: SupportTicketEmailData & { email: string }): void {
    const html = supportTicketEmailTemplate(data);
    const subject = getSupportTicketSubject(data.referenceId);
    this.sendAsync({
      to: data.email,
      subject,
      html,
    });
  }

  /**
   * Sends admin notification email for new support ticket
   */
  async sendAdminNotification(data: AdminNotificationEmailData): Promise<SendEmailResult> {
    const adminEmail = config.email.adminEmail;

    if (!adminEmail) {
      logger.warn('Admin notification skipped: ADMIN_EMAIL not configured');
      return { success: false, error: 'Admin email not configured' };
    }

    const html = adminNotificationEmailTemplate(data);
    const subject = getAdminNotificationSubject(data.referenceId, data.subject);
    return this.sendWithRetry({
      to: adminEmail,
      subject,
      html,
    });
  }

  /**
   * Sends admin notification email asynchronously
   */
  sendAdminNotificationAsync(data: AdminNotificationEmailData): void {
    const adminEmail = config.email.adminEmail;

    if (!adminEmail) {
      logger.warn('Admin notification skipped: ADMIN_EMAIL not configured');
      return;
    }

    const html = adminNotificationEmailTemplate(data);
    const subject = getAdminNotificationSubject(data.referenceId, data.subject);
    this.sendAsync({
      to: adminEmail,
      subject,
      html,
    });
  }

  /**
   * Checks if the email service is configured and ready to send
   */
  isReady(): boolean {
    return this.isConfigured && this.transporter !== null;
  }
}

// Export a singleton instance
export const emailService = new EmailService();
