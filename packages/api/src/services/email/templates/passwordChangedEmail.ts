import {
  baseTemplate,
  emailHeading,
  emailParagraph,
  emailInfoBox,
  emailDivider,
} from './baseTemplate.js';

export interface PasswordChangedEmailData {
  name: string;
  dateTime: string;
}

export const PASSWORD_CHANGED_SUBJECT = 'Your Country Calendar password was changed';

export function passwordChangedEmailTemplate(data: PasswordChangedEmailData): string {
  const content = `
    ${emailHeading('Password Changed Successfully')}
    ${emailParagraph(`Hi ${data.name},`)}
    ${emailParagraph('Your Country Calendar password was successfully changed.')}
    ${emailParagraph(`<strong>Changed on:</strong> ${data.dateTime}`)}
    ${emailDivider()}
    ${emailInfoBox('<strong>Didn\'t make this change?</strong><br><br>If you didn\'t change your password, your account may have been compromised. Please <a href="mailto:support@countrycalendar.app" style="color: #1e40af; text-decoration: underline;">contact our support team</a> immediately for assistance.', 'warning')}
    ${emailParagraph('For your security, all other devices have been logged out. You\'ll need to sign in again with your new password.', true)}
  `;

  return baseTemplate({
    title: PASSWORD_CHANGED_SUBJECT,
    content,
  });
}
