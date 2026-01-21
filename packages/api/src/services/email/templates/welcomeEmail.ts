import {
  baseTemplate,
  emailButton,
  emailHeading,
  emailParagraph,
  emailInfoBox,
} from './baseTemplate.js';

export interface WelcomeEmailData {
  name: string;
  confirmationLink: string;
}

export const WELCOME_EMAIL_SUBJECT = 'Welcome to Country Calendar! Please confirm your email';

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  const content = `
    ${emailHeading('Welcome to Country Calendar!')}
    ${emailParagraph(`Hi ${data.name},`)}
    ${emailParagraph('Thank you for joining Country Calendar! We\'re excited to help you track your travel adventures around the world.')}
    ${emailParagraph('To get started, please confirm your email address by clicking the button below:')}
    ${emailButton('Confirm Email Address', data.confirmationLink)}
    ${emailInfoBox('This confirmation link will expire in <strong>48 hours</strong>. If you don\'t confirm within this time, you\'ll need to request a new confirmation email.', 'info')}
    ${emailParagraph('If you didn\'t create an account with Country Calendar, you can safely ignore this email.', true)}
  `;

  return baseTemplate({
    title: WELCOME_EMAIL_SUBJECT,
    content,
  });
}
