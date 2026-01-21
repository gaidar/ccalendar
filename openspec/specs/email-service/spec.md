# email-service Specification

## Purpose
TBD - created by archiving change add-email-system. Update Purpose after archive.
## Requirements
### Requirement: Email Service Setup

The system SHALL provide an email service using Nodemailer with Mailgun transport.

#### Scenario: Email service initialization
- **WHEN** the application starts
- **THEN** the email service SHALL be initialized with Mailgun configuration
- **AND** credentials SHALL be loaded from environment variables

#### Scenario: Required environment variables
- **WHEN** configuring the email service
- **THEN** the following environment variables SHALL be required:
  - `MAILGUN_API_KEY`: Mailgun API key
  - `MAILGUN_DOMAIN`: Mailgun sending domain

#### Scenario: Optional environment variables
- **WHEN** configuring the email service
- **THEN** the following environment variables SHALL be optional with defaults:
  - `FROM_EMAIL`: sender address (default: noreply@countrycalendar.app)
  - `REPLY_TO_EMAIL`: reply-to address (default: support@countrycalendar.app)
  - `ADMIN_EMAIL`: admin notification address

#### Scenario: Missing configuration
- **WHEN** required environment variables are missing
- **THEN** the application SHALL log a warning
- **AND** email sending SHALL be disabled gracefully

### Requirement: Send Email Function

The email service SHALL provide a base function for sending emails.

#### Scenario: Successful email send
- **WHEN** `sendEmail(to, subject, html, text)` is called
- **AND** all parameters are valid
- **THEN** the email SHALL be sent via Mailgun
- **AND** the function SHALL return success

#### Scenario: Email address validation
- **WHEN** sending an email
- **THEN** the recipient address SHALL be validated for format
- **AND** invalid addresses SHALL cause an error

#### Scenario: Email headers
- **WHEN** an email is sent
- **THEN** the From header SHALL be set from configuration
- **AND** the Reply-To header SHALL be set from configuration

### Requirement: Development Mode

The email service SHALL support development/sandbox mode.

#### Scenario: Sandbox mode enabled
- **WHEN** the application is in development mode
- **THEN** emails MAY be sent to Mailgun sandbox
- **AND** only authorized test recipients SHALL receive emails

#### Scenario: Email logging in development
- **WHEN** the application is in development mode
- **THEN** all email content SHALL be logged for debugging

