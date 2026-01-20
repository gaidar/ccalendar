# Tasks: Email System

## 1. Email Service Setup (Backend)

- [ ] 1.1 Install Nodemailer and Mailgun transport packages
- [ ] 1.2 Create `emailService.ts` service file
- [ ] 1.3 Configure Nodemailer with Mailgun transport
- [ ] 1.4 Load Mailgun credentials from environment variables
- [ ] 1.5 Implement `sendEmail(to, subject, html, text)` base method
- [ ] 1.6 Add email address validation before sending
- [ ] 1.7 Implement error handling for send failures
- [ ] 1.8 Add logging for all email operations
- [ ] 1.9 Write unit tests for email service

## 2. Email Configuration (Backend)

- [ ] 2.1 Add MAILGUN_API_KEY environment variable
- [ ] 2.2 Add MAILGUN_DOMAIN environment variable
- [ ] 2.3 Add FROM_EMAIL environment variable (default: noreply@countrycalendar.app)
- [ ] 2.4 Add REPLY_TO_EMAIL environment variable (default: support@countrycalendar.app)
- [ ] 2.5 Add ADMIN_EMAIL environment variable for notifications
- [ ] 2.6 Configure sandbox mode for development
- [ ] 2.7 Document email configuration in .env.example

## 3. Base Template (Backend)

- [ ] 3.1 Create `templates/` directory for email templates
- [ ] 3.2 Create base HTML template with header, content area, footer
- [ ] 3.3 Apply Country Calendar branding (colors, logo)
- [ ] 3.4 Ensure 600px max width for email clients
- [ ] 3.5 Use inline CSS for email client compatibility
- [ ] 3.6 Add responsive styles for mobile
- [ ] 3.7 Create template rendering utility with variable substitution
- [ ] 3.8 Write unit tests for template rendering

## 4. Plain Text Generator (Backend)

- [ ] 4.1 Create `generatePlainText(html)` utility function
- [ ] 4.2 Strip HTML tags while preserving content
- [ ] 4.3 Convert links to "text (url)" format
- [ ] 4.4 Preserve line breaks and spacing
- [ ] 4.5 Write unit tests for plain text generator

## 5. Welcome Email Template (Backend)

- [ ] 5.1 Create welcome email HTML template
- [ ] 5.2 Include greeting with user name
- [ ] 5.3 Add confirmation button with link
- [ ] 5.4 Include 48-hour expiry notice
- [ ] 5.5 Add plain text fallback
- [ ] 5.6 Implement `sendWelcomeEmail(user, confirmationLink)` method
- [ ] 5.7 Write unit tests for welcome email

## 6. Confirmation Reminder Email Template (Backend)

- [ ] 6.1 Create confirmation reminder HTML template
- [ ] 6.2 Include friendly reminder message
- [ ] 6.3 Add confirmation button with link
- [ ] 6.4 Include 24-hour expiry notice
- [ ] 6.5 Add plain text fallback
- [ ] 6.6 Implement `sendConfirmationReminder(user, confirmationLink)` method
- [ ] 6.7 Write unit tests for confirmation reminder email

## 7. Password Reset Email Template (Backend)

- [ ] 7.1 Create password reset HTML template
- [ ] 7.2 Include greeting with user name
- [ ] 7.3 Add reset button with link
- [ ] 7.4 Include 1-hour expiry notice
- [ ] 7.5 Add security notice about single-use link
- [ ] 7.6 Add plain text fallback
- [ ] 7.7 Implement `sendPasswordResetEmail(user, resetLink)` method
- [ ] 7.8 Write unit tests for password reset email

## 8. Password Changed Email Template (Backend)

- [ ] 8.1 Create password changed HTML template
- [ ] 8.2 Include greeting with user name
- [ ] 8.3 Include date and time of change
- [ ] 8.4 Add security warning about unauthorized changes
- [ ] 8.5 Add link to contact support
- [ ] 8.6 Add plain text fallback
- [ ] 8.7 Implement `sendPasswordChangedEmail(user)` method
- [ ] 8.8 Write unit tests for password changed email

## 9. Account Deletion Email Template (Backend)

- [ ] 9.1 Create account deletion HTML template
- [ ] 9.2 Include greeting with user name
- [ ] 9.3 List deleted data (account, records count, tickets)
- [ ] 9.4 Add note about irreversibility
- [ ] 9.5 Add note about unauthorized deletion
- [ ] 9.6 Add feedback invitation
- [ ] 9.7 Add plain text fallback
- [ ] 9.8 Implement `sendAccountDeletionEmail(user, recordCount)` method
- [ ] 9.9 Write unit tests for account deletion email

## 10. Support Ticket Confirmation Email Template (Backend)

- [ ] 10.1 Create support confirmation HTML template
- [ ] 10.2 Include greeting with submitter name
- [ ] 10.3 Display reference ID prominently
- [ ] 10.4 Include subject and category
- [ ] 10.5 Include copy of submitted message
- [ ] 10.6 Add response time estimate (24-48 hours)
- [ ] 10.7 Add note about replying to add information
- [ ] 10.8 Add plain text fallback
- [ ] 10.9 Implement `sendTicketConfirmationEmail(ticket)` method
- [ ] 10.10 Write unit tests for ticket confirmation email

## 11. Admin Notification Email Template (Backend)

- [ ] 11.1 Create admin notification HTML template
- [ ] 11.2 Include reference ID in subject and body
- [ ] 11.3 Display submitter name and email
- [ ] 11.4 Include user ID or "Guest" indicator
- [ ] 11.5 Display category and timestamp
- [ ] 11.6 Include full message content
- [ ] 11.7 Add link to admin panel
- [ ] 11.8 Add plain text fallback
- [ ] 11.9 Implement `sendAdminTicketNotification(ticket)` method
- [ ] 11.10 Write unit tests for admin notification email

## 12. Email Retry Logic (Backend)

- [ ] 12.1 Implement retry mechanism for failed sends
- [ ] 12.2 Configure maximum 3 retry attempts
- [ ] 12.3 Implement exponential backoff between retries
- [ ] 12.4 Log each retry attempt
- [ ] 12.5 Log final failure after all retries exhausted
- [ ] 12.6 Write unit tests for retry logic

## 13. Email Integration (Backend)

- [ ] 13.1 Integrate welcome email in registration flow
- [ ] 13.2 Integrate password reset email in reset request flow
- [ ] 13.3 Integrate password changed email in password change flow
- [ ] 13.4 Integrate account deletion email in deletion flow
- [ ] 13.5 Integrate ticket confirmation in support ticket creation
- [ ] 13.6 Integrate admin notification in support ticket creation
- [ ] 13.7 Ensure emails don't block main operations (async)
- [ ] 13.8 Write integration tests for email triggers

## 14. Email Testing Utilities (Backend)

- [ ] 14.1 Create email preview endpoint for development
- [ ] 14.2 Configure Mailgun sandbox for test emails
- [ ] 14.3 Create mock email service for unit tests
- [ ] 14.4 Write helper to capture sent emails in tests
- [ ] 14.5 Document testing procedures

## 15. Accessibility & Polish

- [ ] 15.1 Ensure all images have alt text
- [ ] 15.2 Use semantic HTML in templates
- [ ] 15.3 Ensure sufficient color contrast
- [ ] 15.4 Test templates in major email clients (Gmail, Outlook, Apple Mail)
- [ ] 15.5 Test responsive design on mobile clients
- [ ] 15.6 Verify plain text versions are readable

## 16. Integration & Review

- [ ] 16.1 Run all unit tests and ensure they pass
- [ ] 16.2 Run all integration tests and ensure they pass
- [ ] 16.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 16.4 Test email delivery to real addresses (staging)
- [ ] 16.5 Verify all template variables are populated
- [ ] 16.6 Test retry logic with simulated failures
- [ ] 16.7 Review code for SOLID principles compliance
- [ ] 16.8 Document email service API
