// Main email service
export { emailService } from './emailService.js';

// Template utilities
export { renderTemplate, escapeHtml, validateTemplateData } from './templateRenderer.js';

// Plain text generator
export { generatePlainText } from './plainTextGenerator.js';

// Template types and constants (re-export for convenience)
export type {
  WelcomeEmailData,
  ConfirmationReminderEmailData,
  PasswordResetEmailData,
  PasswordChangedEmailData,
  AccountDeletionEmailData,
  SupportTicketEmailData,
  AdminNotificationEmailData,
} from './templates/index.js';

export {
  WELCOME_EMAIL_SUBJECT,
  CONFIRMATION_REMINDER_SUBJECT,
  PASSWORD_RESET_SUBJECT,
  PASSWORD_CHANGED_SUBJECT,
  ACCOUNT_DELETION_SUBJECT,
} from './templates/index.js';
