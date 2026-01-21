import {
  baseTemplate,
  emailHeading,
  emailParagraph,
  emailInfoBox,
  emailDivider,
} from './baseTemplate.js';

export interface SupportTicketEmailData {
  name: string;
  referenceId: string;
  subject: string;
  category: string;
  message: string;
}

export const SUPPORT_TICKET_SUBJECT_TEMPLATE = 'We received your support request [{{referenceId}}]';

export function getSupportTicketSubject(referenceId: string): string {
  return `We received your support request [${referenceId}]`;
}

export function supportTicketEmailTemplate(data: SupportTicketEmailData): string {
  // Escape HTML in user-provided message while preserving line breaks
  const escapedMessage = data.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');

  const content = `
    ${emailHeading('We\'ve Received Your Request')}
    ${emailParagraph(`Hi ${data.name},`)}
    ${emailParagraph('Thank you for contacting Country Calendar support. We\'ve received your request and will get back to you as soon as possible.')}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0; background-color: #f9fafb; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Reference ID</p>
          <p style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #3b82f6; font-family: monospace;">${data.referenceId}</p>

          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Subject</p>
          <p style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937;">${data.subject}</p>

          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Category</p>
          <p style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937;">${data.category}</p>

          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Your Message</p>
          <div style="margin: 0; padding: 16px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #1f2937; line-height: 1.6;">${escapedMessage}</div>
        </td>
      </tr>
    </table>

    ${emailInfoBox('Our support team typically responds within <strong>24-48 hours</strong>. Please keep your reference ID handy when contacting us about this request.', 'info')}
    ${emailDivider()}
    ${emailParagraph('Want to add more information? Simply reply to this email and it will be added to your support request.', true)}
  `;

  return baseTemplate({
    title: getSupportTicketSubject(data.referenceId),
    content,
  });
}
