# Proposal: Email System

## Summary

Add a transactional email system using Nodemailer with Mailgun as the email provider. This includes setting up the email service, creating branded HTML templates, and implementing all required transactional emails for user lifecycle events.

## Motivation

Transactional emails are essential for user communication including email verification, password resets, security notifications, and support ticket confirmations. A well-designed email system ensures reliable delivery and consistent branding.

## Scope

### In Scope

- Email service setup with Nodemailer + Mailgun
- Base HTML email template with branding
- Welcome/email confirmation email
- Email confirmation reminder (24 hours)
- Password reset email
- Password changed confirmation email
- Account deletion confirmation email
- Support ticket confirmation email
- Admin notification for new support tickets
- Both HTML and plain text versions
- Email delivery error handling and retry

### Out of Scope

- Marketing emails
- Email analytics/tracking
- Unsubscribe management (for transactional emails)
- Email scheduling/queuing system
- Attachment handling

## Design

### Email Service Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Application    │────▶│  Email Service  │────▶│    Mailgun      │
│  (triggers)     │     │  (Nodemailer)   │     │    (delivery)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Templates      │
                        │  (HTML + Text)  │
                        └─────────────────┘
```

### Email Templates

All emails follow a consistent design:
- From: "Country Calendar" <noreply@countrycalendar.app>
- Reply-To: support@countrycalendar.app
- Max width: 600px
- Primary color: #3b82f6
- System font stack with Arial fallback

### Transactional Emails

| Email Type | Trigger | Variables |
|------------|---------|-----------|
| Welcome | Registration | name, confirmation_link |
| Confirmation Reminder | 24hr after registration | name, confirmation_link |
| Password Reset | Reset request | name, reset_link |
| Password Changed | Password change | name, date, time |
| Account Deleted | Account deletion | name, record_count |
| Support Confirmation | Ticket created | name, reference_id, subject, category, message |
| Admin Notification | Ticket created | reference_id, name, email, user_id, category, message, admin_link |

## Technical Considerations

- Use environment variables for Mailgun credentials
- Support sandbox mode for development/testing
- Implement retry logic for failed sends (up to 3 attempts)
- Log all email sends and failures
- Generate plain text version from HTML
- Validate email addresses before sending
- Handle missing template variables gracefully
