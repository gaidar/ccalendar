// Base template components
export {
  baseTemplate,
  emailButton,
  emailHeading,
  emailParagraph,
  emailDivider,
  emailInfoBox,
  emailList,
} from './baseTemplate.js';

// Email templates
export {
  welcomeEmailTemplate,
  WELCOME_EMAIL_SUBJECT,
} from './welcomeEmail.js';
export type { WelcomeEmailData } from './welcomeEmail.js';

export {
  confirmationReminderEmailTemplate,
  CONFIRMATION_REMINDER_SUBJECT,
} from './confirmationReminderEmail.js';
export type { ConfirmationReminderEmailData } from './confirmationReminderEmail.js';

export {
  passwordResetEmailTemplate,
  PASSWORD_RESET_SUBJECT,
} from './passwordResetEmail.js';
export type { PasswordResetEmailData } from './passwordResetEmail.js';

export {
  passwordChangedEmailTemplate,
  PASSWORD_CHANGED_SUBJECT,
} from './passwordChangedEmail.js';
export type { PasswordChangedEmailData } from './passwordChangedEmail.js';

export {
  accountDeletionEmailTemplate,
  ACCOUNT_DELETION_SUBJECT,
} from './accountDeletionEmail.js';
export type { AccountDeletionEmailData } from './accountDeletionEmail.js';

export {
  supportTicketEmailTemplate,
  getSupportTicketSubject,
} from './supportTicketEmail.js';
export type { SupportTicketEmailData } from './supportTicketEmail.js';

export {
  adminNotificationEmailTemplate,
  getAdminNotificationSubject,
} from './adminNotificationEmail.js';
export type { AdminNotificationEmailData } from './adminNotificationEmail.js';
