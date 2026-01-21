# Tasks: Email System

## 1. Email Service Setup (Backend)

- [x] 1.1 Install Nodemailer and Mailgun transport packages
- [x] 1.2 Create `emailService.ts` service file
- [x] 1.3 Configure Nodemailer with Mailgun transport
- [x] 1.4 Load Mailgun credentials from environment variables
- [x] 1.5 Implement `sendEmail(to, subject, html, text)` base method
- [x] 1.6 Add email address validation before sending
- [x] 1.7 Implement error handling for send failures
- [x] 1.8 Add logging for all email operations
- [x] 1.9 Write unit tests for email service

## 2. Email Configuration (Backend)

- [x] 2.1 Add MAILGUN_API_KEY environment variable
- [x] 2.2 Add MAILGUN_DOMAIN environment variable
- [x] 2.3 Add FROM_EMAIL environment variable (default: noreply@countrycalendar.app)
- [x] 2.4 Add REPLY_TO_EMAIL environment variable (default: support@countrycalendar.app)
- [x] 2.5 Add ADMIN_EMAIL environment variable for notifications
- [x] 2.6 Configure sandbox mode for development
- [x] 2.7 Document email configuration in .env.example

## 3. Base Template (Backend)

- [x] 3.1 Create `templates/` directory for email templates
- [x] 3.2 Create base HTML template with header, content area, footer
- [x] 3.3 Apply Country Calendar branding (colors, logo)
- [x] 3.4 Ensure 600px max width for email clients
- [x] 3.5 Use inline CSS for email client compatibility
- [x] 3.6 Add responsive styles for mobile
- [x] 3.7 Create template rendering utility with variable substitution
- [x] 3.8 Write unit tests for template rendering

## 4. Plain Text Generator (Backend)

- [x] 4.1 Create `generatePlainText(html)` utility function
- [x] 4.2 Strip HTML tags while preserving content
- [x] 4.3 Convert links to "text (url)" format
- [x] 4.4 Preserve line breaks and spacing
- [x] 4.5 Write unit tests for plain text generator

## 5. Welcome Email Template (Backend)

- [x] 5.1 Create welcome email HTML template
- [x] 5.2 Include greeting with user name
- [x] 5.3 Add confirmation button with link
- [x] 5.4 Include 48-hour expiry notice
- [x] 5.5 Add plain text fallback
- [x] 5.6 Implement `sendWelcomeEmail(user, confirmationLink)` method
- [x] 5.7 Write unit tests for welcome email

## 6. Confirmation Reminder Email Template (Backend)

- [x] 6.1 Create confirmation reminder HTML template
- [x] 6.2 Include friendly reminder message
- [x] 6.3 Add confirmation button with link
- [x] 6.4 Include 24-hour expiry notice
- [x] 6.5 Add plain text fallback
- [x] 6.6 Implement `sendConfirmationReminder(user, confirmationLink)` method
- [x] 6.7 Write unit tests for confirmation reminder email

## 7. Password Reset Email Template (Backend)

- [x] 7.1 Create password reset HTML template
- [x] 7.2 Include greeting with user name
- [x] 7.3 Add reset button with link
- [x] 7.4 Include 1-hour expiry notice
- [x] 7.5 Add security notice about single-use link
- [x] 7.6 Add plain text fallback
- [x] 7.7 Implement `sendPasswordResetEmail(user, resetLink)` method
- [x] 7.8 Write unit tests for password reset email

## 8. Password Changed Email Template (Backend)

- [x] 8.1 Create password changed HTML template
- [x] 8.2 Include greeting with user name
- [x] 8.3 Include date and time of change
- [x] 8.4 Add security warning about unauthorized changes
- [x] 8.5 Add link to contact support
- [x] 8.6 Add plain text fallback
- [x] 8.7 Implement `sendPasswordChangedEmail(user)` method
- [x] 8.8 Write unit tests for password changed email

## 9. Account Deletion Email Template (Backend)

- [x] 9.1 Create account deletion HTML template
- [x] 9.2 Include greeting with user name
- [x] 9.3 List deleted data (account, records count, tickets)
- [x] 9.4 Add note about irreversibility
- [x] 9.5 Add note about unauthorized deletion
- [x] 9.6 Add feedback invitation
- [x] 9.7 Add plain text fallback
- [x] 9.8 Implement `sendAccountDeletionEmail(user, recordCount)` method
- [x] 9.9 Write unit tests for account deletion email

## 10. Support Ticket Confirmation Email Template (Backend)

- [x] 10.1 Create support confirmation HTML template
- [x] 10.2 Include greeting with submitter name
- [x] 10.3 Display reference ID prominently
- [x] 10.4 Include subject and category
- [x] 10.5 Include copy of submitted message
- [x] 10.6 Add response time estimate (24-48 hours)
- [x] 10.7 Add note about replying to add information
- [x] 10.8 Add plain text fallback
- [x] 10.9 Implement `sendTicketConfirmationEmail(ticket)` method
- [x] 10.10 Write unit tests for ticket confirmation email

## 11. Admin Notification Email Template (Backend)

- [x] 11.1 Create admin notification HTML template
- [x] 11.2 Include reference ID in subject and body
- [x] 11.3 Display submitter name and email
- [x] 11.4 Include user ID or "Guest" indicator
- [x] 11.5 Display category and timestamp
- [x] 11.6 Include full message content
- [x] 11.7 Add link to admin panel
- [x] 11.8 Add plain text fallback
- [x] 11.9 Implement `sendAdminTicketNotification(ticket)` method
- [x] 11.10 Write unit tests for admin notification email

## 12. Email Retry Logic (Backend)

- [x] 12.1 Implement retry mechanism for failed sends
- [x] 12.2 Configure maximum 3 retry attempts
- [x] 12.3 Implement exponential backoff between retries
- [x] 12.4 Log each retry attempt
- [x] 12.5 Log final failure after all retries exhausted
- [x] 12.6 Write unit tests for retry logic

## 13. Email Integration (Backend)

- [x] 13.1 Integrate welcome email in registration flow
- [x] 13.2 Integrate password reset email in reset request flow
- [x] 13.3 Integrate password changed email in password change flow
- [x] 13.4 Integrate account deletion email in deletion flow
- [x] 13.5 Integrate ticket confirmation in support ticket creation
- [x] 13.6 Integrate admin notification in support ticket creation
- [x] 13.7 Ensure emails don't block main operations (async)
- [x] 13.8 Write integration tests for email triggers

## 14. Email Testing Utilities (Backend)

- [ ] 14.1 Create email preview endpoint for development
- [ ] 14.2 Configure Mailgun sandbox for test emails
- [x] 14.3 Create mock email service for unit tests
- [x] 14.4 Write helper to capture sent emails in tests
- [ ] 14.5 Document testing procedures

## 15. Accessibility & Polish

- [x] 15.1 Ensure all images have alt text
- [x] 15.2 Use semantic HTML in templates
- [x] 15.3 Ensure sufficient color contrast
- [ ] 15.4 Test templates in major email clients (Gmail, Outlook, Apple Mail)
- [ ] 15.5 Test responsive design on mobile clients
- [x] 15.6 Verify plain text versions are readable

## 16. Integration & Review

- [x] 16.1 Run all unit tests and ensure they pass
- [x] 16.2 Run all integration tests and ensure they pass
- [x] 16.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 16.4 Test email delivery to real addresses (staging)
- [x] 16.5 Verify all template variables are populated
- [x] 16.6 Test retry logic with simulated failures
- [x] 16.7 Review code for SOLID principles compliance
- [ ] 16.8 Document email service API
