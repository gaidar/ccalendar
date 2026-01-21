import {
  baseTemplate,
  emailButton,
  emailHeading,
  emailParagraph,
  emailInfoBox,
} from './baseTemplate.js';

export interface ConfirmationReminderEmailData {
  name: string;
  confirmationLink: string;
}

export const CONFIRMATION_REMINDER_SUBJECT = 'Reminder: Please confirm your Country Calendar account';

export function confirmationReminderEmailTemplate(data: ConfirmationReminderEmailData): string {
  const content = `
    ${emailHeading('Don\'t forget to confirm your email!')}
    ${emailParagraph(`Hi ${data.name},`)}
    ${emailParagraph('We noticed you haven\'t confirmed your email address yet. Your account is almost ready - just one click away!')}
    ${emailParagraph('Please confirm your email address to start tracking your travels:')}
    ${emailButton('Confirm Email Address', data.confirmationLink)}
    ${emailInfoBox('<strong>Important:</strong> Your confirmation link will expire in <strong>24 hours</strong>. After that, you\'ll need to request a new confirmation email.', 'warning')}
    ${emailParagraph('If you\'ve already confirmed your email, please ignore this reminder.', true)}
  `;

  return baseTemplate({
    title: CONFIRMATION_REMINDER_SUBJECT,
    content,
  });
}
