import {
  baseTemplate,
  emailButton,
  emailHeading,
  emailParagraph,
  emailDivider,
} from './baseTemplate.js';
import { config } from '../../../config/index.js';

export interface AdminNotificationEmailData {
  referenceId: string;
  name: string;
  email: string;
  userId: string | null;
  category: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export function getAdminNotificationSubject(referenceId: string, subject: string): string {
  return `[New Ticket] ${referenceId}: ${subject}`;
}

export function adminNotificationEmailTemplate(data: AdminNotificationEmailData): string {
  // Escape HTML in user-provided message while preserving line breaks
  const escapedMessage = data.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');

  const userType = data.userId ? `Registered (ID: ${data.userId})` : 'Guest';
  const formattedDate = data.createdAt.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const adminLink = `${config.frontend.url}/admin/tickets`;

  const content = `
    ${emailHeading('New Support Ticket Received')}
    ${emailParagraph('A new support ticket has been submitted and requires attention.')}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
      <tr>
        <td style="padding: 16px;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #92400e;">
            Reference ID: <span style="font-family: monospace; font-size: 16px;">${data.referenceId}</span>
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0; border: 1px solid #e5e7eb; border-radius: 8px;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="30%" style="padding: 8px 0; font-size: 14px; color: #6b7280; vertical-align: top;">From</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1f2937;"><strong>${data.name}</strong> (${userType})</td>
            </tr>
            <tr>
              <td width="30%" style="padding: 8px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1f2937;"><a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></td>
            </tr>
            <tr>
              <td width="30%" style="padding: 8px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Category</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1f2937;">${data.category}</td>
            </tr>
            <tr>
              <td width="30%" style="padding: 8px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Subject</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1f2937;"><strong>${data.subject}</strong></td>
            </tr>
            <tr>
              <td width="30%" style="padding: 8px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Submitted</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1f2937;">${formattedDate}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${emailParagraph('<strong>Message:</strong>')}
    <div style="margin: 0 0 24px 0; padding: 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #1f2937; line-height: 1.6;">${escapedMessage}</div>

    ${emailDivider()}
    ${emailButton('View in Admin Panel', adminLink)}
  `;

  return baseTemplate({
    title: getAdminNotificationSubject(data.referenceId, data.subject),
    content,
  });
}
