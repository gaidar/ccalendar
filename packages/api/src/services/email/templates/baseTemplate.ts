/**
 * Base HTML email template with Country Calendar branding
 *
 * Design specifications:
 * - Max width: 600px
 * - Primary color: #3b82f6
 * - System font stack with Arial fallback
 * - Inline CSS for email client compatibility
 */

export interface BaseTemplateOptions {
  /** Email title (shown in preview) */
  title: string;
  /** Main content HTML */
  content: string;
  /** Year for copyright (defaults to current year) */
  year?: number;
}

const PRIMARY_COLOR = '#3b82f6';
const TEXT_COLOR = '#1f2937';
const TEXT_MUTED = '#6b7280';
const BACKGROUND_COLOR = '#f9fafb';
const CARD_BACKGROUND = '#ffffff';
const BORDER_COLOR = '#e5e7eb';

export function baseTemplate({ title, content, year = new Date().getFullYear() }: BaseTemplateOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .button { padding: 12px 24px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${BACKGROUND_COLOR}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${BACKGROUND_COLOR};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <!-- Logo Icon -->
                    <div style="width: 40px; height: 40px; background-color: ${PRIMARY_COLOR}; border-radius: 8px; display: inline-block; vertical-align: middle; text-align: center; line-height: 40px;">
                      <span style="color: #ffffff; font-size: 20px; font-weight: bold;">CC</span>
                    </div>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <span style="font-size: 24px; font-weight: 700; color: ${TEXT_COLOR};">Country Calendar</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td style="background-color: ${CARD_BACKGROUND}; border-radius: 12px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 40px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: ${TEXT_MUTED};">
                &copy; ${year} Country Calendar. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 14px; color: ${TEXT_MUTED};">
                Need help? <a href="mailto:support@countrycalendar.app" style="color: ${PRIMARY_COLOR}; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a styled button HTML for use in email templates
 */
export function emailButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
  <tr>
    <td style="border-radius: 8px; background-color: ${PRIMARY_COLOR};">
      <a href="${url}" class="button" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: ${PRIMARY_COLOR};">
        ${text}
      </a>
    </td>
  </tr>
</table>`;
}

/**
 * Generates a styled heading for email content
 */
export function emailHeading(text: string, level: 1 | 2 | 3 = 1): string {
  const sizes: Record<number, string> = {
    1: '24px',
    2: '20px',
    3: '18px',
  };

  return `<h${level} style="margin: 0 0 16px 0; font-size: ${sizes[level]}; font-weight: 600; color: ${TEXT_COLOR};">${text}</h${level}>`;
}

/**
 * Generates styled paragraph text
 */
export function emailParagraph(text: string, muted = false): string {
  return `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: ${muted ? TEXT_MUTED : TEXT_COLOR};">${text}</p>`;
}

/**
 * Generates a divider line
 */
export function emailDivider(): string {
  return `<hr style="margin: 24px 0; border: none; border-top: 1px solid ${BORDER_COLOR};">`;
}

/**
 * Generates a styled info box
 */
export function emailInfoBox(content: string, variant: 'info' | 'warning' | 'success' = 'info'): string {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
    success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
  };

  const style = colors[variant];

  return `<div style="margin: 16px 0; padding: 16px; background-color: ${style.bg}; border-left: 4px solid ${style.border}; border-radius: 0 8px 8px 0;">
  <p style="margin: 0; font-size: 14px; color: ${style.text};">${content}</p>
</div>`;
}

/**
 * Generates a styled list
 */
export function emailList(items: string[]): string {
  const listItems = items.map(item =>
    `<li style="margin-bottom: 8px; color: ${TEXT_COLOR};">${item}</li>`
  ).join('\n');

  return `<ul style="margin: 16px 0; padding-left: 24px; font-size: 16px; line-height: 1.6;">
  ${listItems}
</ul>`;
}
