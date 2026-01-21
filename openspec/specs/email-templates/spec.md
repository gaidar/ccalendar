# email-templates Specification

## Purpose
TBD - created by archiving change add-email-system. Update Purpose after archive.
## Requirements
### Requirement: Base Email Template

The system SHALL provide a branded base template for all emails.

#### Scenario: Template structure
- **WHEN** an email is generated
- **THEN** the base template SHALL include:
  - Header with Country Calendar logo
  - Content area for message
  - Footer with copyright and support link

#### Scenario: Template styling
- **WHEN** an email is generated
- **THEN** the template SHALL use:
  - Maximum width of 600px
  - Primary color #3b82f6
  - System font stack with Arial fallback
  - Inline CSS for email client compatibility

#### Scenario: Template variables
- **WHEN** rendering a template
- **THEN** variables SHALL be substituted using {{variable}} syntax
- **AND** missing variables SHALL be replaced with empty string

### Requirement: Welcome Email Template

The system SHALL provide a welcome email template for new registrations.

#### Scenario: Welcome email content
- **WHEN** a welcome email is generated
- **THEN** it SHALL include:
  - Personalized greeting with user name
  - Welcome message
  - Email confirmation button
  - 48-hour expiry notice
  - Note about ignoring if not requested

#### Scenario: Welcome email subject
- **WHEN** a welcome email is sent
- **THEN** the subject SHALL be "Welcome to Country Calendar! Please confirm your email"

#### Scenario: Welcome email trigger
- **WHEN** a user registers successfully
- **THEN** a welcome email SHALL be sent to their email address

### Requirement: Confirmation Reminder Email Template

The system SHALL provide an email confirmation reminder template.

#### Scenario: Reminder email content
- **WHEN** a confirmation reminder is generated
- **THEN** it SHALL include:
  - Personalized greeting with user name
  - Friendly reminder message
  - Email confirmation button
  - 24-hour expiry notice

#### Scenario: Reminder email subject
- **WHEN** a confirmation reminder is sent
- **THEN** the subject SHALL be "Reminder: Please confirm your Country Calendar account"

### Requirement: Password Reset Email Template

The system SHALL provide a password reset email template.

#### Scenario: Password reset email content
- **WHEN** a password reset email is generated
- **THEN** it SHALL include:
  - Personalized greeting with user name
  - Reset request acknowledgment
  - Reset password button
  - 1-hour expiry notice
  - Security notice about single-use link
  - Note about ignoring if not requested

#### Scenario: Password reset email subject
- **WHEN** a password reset email is sent
- **THEN** the subject SHALL be "Reset your Country Calendar password"

#### Scenario: Password reset email trigger
- **WHEN** a password reset is requested
- **THEN** a password reset email SHALL be sent if the account exists

### Requirement: Password Changed Email Template

The system SHALL provide a password changed confirmation email template.

#### Scenario: Password changed email content
- **WHEN** a password changed email is generated
- **THEN** it SHALL include:
  - Personalized greeting with user name
  - Confirmation of password change
  - Date and time of change
  - Security warning about unauthorized changes
  - Link to contact support

#### Scenario: Password changed email subject
- **WHEN** a password changed email is sent
- **THEN** the subject SHALL be "Your Country Calendar password was changed"

#### Scenario: Password changed email trigger
- **WHEN** a user successfully changes their password
- **THEN** a password changed email SHALL be sent

### Requirement: Account Deletion Email Template

The system SHALL provide an account deletion confirmation email template.

#### Scenario: Account deletion email content
- **WHEN** an account deletion email is generated
- **THEN** it SHALL include:
  - Personalized greeting with user name
  - Confirmation of account deletion
  - List of deleted data (account, records count, tickets)
  - Note about irreversibility
  - Warning about unauthorized deletions
  - Invitation to provide feedback

#### Scenario: Account deletion email subject
- **WHEN** an account deletion email is sent
- **THEN** the subject SHALL be "Your Country Calendar account has been deleted"

#### Scenario: Account deletion email trigger
- **WHEN** a user deletes their account
- **THEN** an account deletion email SHALL be sent

### Requirement: Support Ticket Confirmation Email Template

The system SHALL provide a support ticket confirmation email template.

#### Scenario: Ticket confirmation email content
- **WHEN** a ticket confirmation email is generated
- **THEN** it SHALL include:
  - Personalized greeting with submitter name
  - Reference ID prominently displayed
  - Subject and category of ticket
  - Copy of submitted message
  - Response time estimate (24-48 hours)
  - Note about replying to add information

#### Scenario: Ticket confirmation email subject
- **WHEN** a ticket confirmation email is sent
- **THEN** the subject SHALL be "We received your support request [{{reference_id}}]"

#### Scenario: Ticket confirmation email trigger
- **WHEN** a support ticket is created
- **THEN** a ticket confirmation email SHALL be sent to the submitter

### Requirement: Admin Notification Email Template

The system SHALL provide an admin notification email template for new tickets.

#### Scenario: Admin notification email content
- **WHEN** an admin notification is generated
- **THEN** it SHALL include:
  - Reference ID
  - Submitter name and email
  - User ID or "Guest" indicator
  - Category
  - Submission timestamp
  - Full message content
  - Link to view in admin panel

#### Scenario: Admin notification email subject
- **WHEN** an admin notification is sent
- **THEN** the subject SHALL be "[New Ticket] {{reference_id}}: {{subject}}"

#### Scenario: Admin notification email trigger
- **WHEN** a support ticket is created
- **THEN** an admin notification email SHALL be sent to the admin address

### Requirement: Plain Text Versions

All email templates SHALL have plain text alternatives.

#### Scenario: Plain text generation
- **WHEN** an email is sent
- **THEN** both HTML and plain text versions SHALL be included

#### Scenario: Plain text formatting
- **WHEN** generating plain text from HTML
- **THEN** HTML tags SHALL be stripped
- **AND** links SHALL be formatted as "text (url)"
- **AND** line breaks SHALL be preserved

