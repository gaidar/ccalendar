# email-delivery Specification

## Purpose
TBD - created by archiving change add-email-system. Update Purpose after archive.
## Requirements
### Requirement: Email Delivery

The system SHALL deliver emails reliably via Mailgun.

#### Scenario: Successful delivery
- **WHEN** an email is sent successfully
- **THEN** the delivery status SHALL be logged
- **AND** the calling function SHALL receive success response

#### Scenario: Delivery failure
- **WHEN** email delivery fails
- **THEN** the error SHALL be logged with details
- **AND** retry logic SHALL be triggered

### Requirement: Retry Logic

The email service SHALL implement retry logic for failed deliveries.

#### Scenario: Retry attempts
- **WHEN** an email fails to send
- **THEN** the system SHALL retry up to 3 times

#### Scenario: Exponential backoff
- **WHEN** retrying a failed email
- **THEN** delays SHALL increase exponentially between attempts
- **AND** delays SHALL be: 1 second, 2 seconds, 4 seconds

#### Scenario: Retry logging
- **WHEN** retrying an email
- **THEN** each attempt SHALL be logged with attempt number

#### Scenario: Final failure
- **WHEN** all retry attempts are exhausted
- **THEN** the failure SHALL be logged as final
- **AND** the error SHALL be returned to the caller

### Requirement: Async Email Sending

The email service SHALL send emails asynchronously.

#### Scenario: Non-blocking operations
- **WHEN** an email is triggered by a user action
- **THEN** the email sending SHALL NOT block the main operation
- **AND** the user action SHALL complete regardless of email status

#### Scenario: Email send failure handling
- **WHEN** an email fails to send
- **THEN** the triggering operation SHALL still succeed
- **AND** the failure SHALL be logged for investigation

### Requirement: Email Logging

The email service SHALL log all email operations.

#### Scenario: Send logging
- **WHEN** an email is sent
- **THEN** the following SHALL be logged:
  - Recipient address
  - Subject
  - Template name
  - Timestamp
  - Success/failure status

#### Scenario: Content logging in development
- **WHEN** in development mode
- **THEN** email content MAY be logged for debugging

#### Scenario: Production logging
- **WHEN** in production mode
- **THEN** email content SHALL NOT be logged (privacy)
- **AND** only metadata SHALL be logged

### Requirement: Email Rate Limiting

The email service SHALL respect Mailgun rate limits.

#### Scenario: Rate limit handling
- **WHEN** Mailgun returns a rate limit error
- **THEN** the send SHALL be retried after the specified delay

### Requirement: Email Validation

The email service SHALL validate emails before sending.

#### Scenario: Invalid recipient address
- **WHEN** an invalid email address is provided
- **THEN** the send SHALL fail immediately
- **AND** an error SHALL be returned without contacting Mailgun

#### Scenario: Empty recipient
- **WHEN** an empty recipient is provided
- **THEN** the send SHALL fail with a validation error

### Requirement: Template Rendering

The email service SHALL render templates with variables.

#### Scenario: Variable substitution
- **WHEN** rendering a template
- **THEN** all {{variable}} placeholders SHALL be replaced with values

#### Scenario: Missing variable handling
- **WHEN** a template variable is not provided
- **THEN** the placeholder SHALL be replaced with an empty string
- **AND** a warning SHALL be logged

#### Scenario: HTML escaping
- **WHEN** user-provided content is inserted into templates
- **THEN** special characters SHALL be escaped to prevent XSS
- **AND** safe HTML SHALL NOT be escaped (like links)

