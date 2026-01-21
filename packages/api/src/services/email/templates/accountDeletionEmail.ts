import {
  baseTemplate,
  emailHeading,
  emailParagraph,
  emailInfoBox,
  emailList,
  emailDivider,
} from './baseTemplate.js';

export interface AccountDeletionEmailData {
  name: string;
  recordCount: number;
}

export const ACCOUNT_DELETION_SUBJECT = 'Your Country Calendar account has been deleted';

export function accountDeletionEmailTemplate(data: AccountDeletionEmailData): string {
  const content = `
    ${emailHeading('Account Deleted')}
    ${emailParagraph(`Hi ${data.name},`)}
    ${emailParagraph('Your Country Calendar account has been successfully deleted. We\'re sorry to see you go.')}
    ${emailParagraph('The following data has been permanently removed:')}
    ${emailList([
      'Your account profile and settings',
      `${data.recordCount} travel record${data.recordCount !== 1 ? 's' : ''}`,
      'All connected OAuth accounts',
      'Support ticket associations (ticket history is preserved)',
    ])}
    ${emailInfoBox('<strong>This action is irreversible.</strong> Your data cannot be recovered once deleted.', 'warning')}
    ${emailDivider()}
    ${emailInfoBox('<strong>Didn\'t request this deletion?</strong><br><br>If you did not delete your account, please <a href="mailto:support@countrycalendar.app" style="color: #1e40af; text-decoration: underline;">contact our support team</a> immediately.', 'warning')}
    ${emailDivider()}
    ${emailParagraph('We\'d love to hear your feedback on why you decided to leave. Feel free to reply to this email or reach out to support@countrycalendar.app.', true)}
    ${emailParagraph('Thank you for being part of Country Calendar. We hope to see you again in the future!', true)}
  `;

  return baseTemplate({
    title: ACCOUNT_DELETION_SUBJECT,
    content,
  });
}
