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
  WelcomeEmailData,
  WELCOME_EMAIL_SUBJECT,
} from './welcomeEmail.js';

export {
  confirmationReminderEmailTemplate,
  ConfirmationReminderEmailData,
  CONFIRMATION_REMINDER_SUBJECT,
} from './confirmationReminderEmail.js';

export {
  passwordResetEmailTemplate,
  PasswordResetEmailData,
  PASSWORD_RESET_SUBJECT,
} from './passwordResetEmail.js';

export {
  passwordChangedEmailTemplate,
  PasswordChangedEmailData,
  PASSWORD_CHANGED_SUBJECT,
} from './passwordChangedEmail.js';

export {
  accountDeletionEmailTemplate,
  AccountDeletionEmailData,
  ACCOUNT_DELETION_SUBJECT,
} from './accountDeletionEmail.js';

export {
  supportTicketEmailTemplate,
  SupportTicketEmailData,
  getSupportTicketSubject,
} from './supportTicketEmail.js';

export {
  adminNotificationEmailTemplate,
  AdminNotificationEmailData,
  getAdminNotificationSubject,
} from './adminNotificationEmail.js';
