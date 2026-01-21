import {
  baseTemplate,
  emailButton,
  emailHeading,
  emailParagraph,
  emailInfoBox,
} from './baseTemplate.js';

export interface PasswordResetEmailData {
  name: string;
  resetLink: string;
}

export const PASSWORD_RESET_SUBJECT = 'Reset your Country Calendar password';

export function passwordResetEmailTemplate(data: PasswordResetEmailData): string {
  const content = `
    ${emailHeading('Reset Your Password')}
    ${emailParagraph(`Hi ${data.name},`)}
    ${emailParagraph('We received a request to reset your password for your Country Calendar account. Click the button below to create a new password:')}
    ${emailButton('Reset Password', data.resetLink)}
    ${emailInfoBox('This link will expire in <strong>1 hour</strong> and can only be used once. If the link has expired, you\'ll need to request a new password reset.', 'warning')}
    ${emailParagraph('If you didn\'t request a password reset, you can safely ignore this email. Your password will remain unchanged.', true)}
    ${emailParagraph('For security reasons, this link is unique to your account and should not be shared with anyone.', true)}
  `;

  return baseTemplate({
    title: PASSWORD_RESET_SUBJECT,
    content,
  });
}
