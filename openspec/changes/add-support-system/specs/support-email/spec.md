## ADDED Requirements

### Requirement: User Confirmation Email

The system SHALL send a confirmation email to users when a ticket is created.

#### Scenario: Email trigger
- **WHEN** a support ticket is created successfully
- **THEN** a confirmation email SHALL be sent to the provided email address

#### Scenario: Email subject
- **WHEN** a confirmation email is sent
- **THEN** the subject SHALL be "We received your support request [{{reference_id}}]"

#### Scenario: Email content
- **WHEN** a confirmation email is sent
- **THEN** the email SHALL include:
  - Greeting with the user's name
  - Reference ID
  - Subject of the ticket
  - Category of the ticket
  - Copy of the submitted message
  - Estimated response time (24-48 hours)
  - Information about replying to add more details

#### Scenario: Email sender
- **WHEN** a confirmation email is sent
- **THEN** the From address SHALL be the configured support email
- **AND** the Reply-To SHALL allow users to respond

### Requirement: Admin Notification Email

The system SHALL send a notification email to administrators when a ticket is created.

#### Scenario: Admin email trigger
- **WHEN** a support ticket is created successfully
- **THEN** a notification email SHALL be sent to the admin notification address

#### Scenario: Admin email subject
- **WHEN** an admin notification is sent
- **THEN** the subject SHALL be "[New Ticket] {{reference_id}}: {{subject}}"

#### Scenario: Admin email content
- **WHEN** an admin notification is sent
- **THEN** the email SHALL include:
  - Reference ID
  - Submitter name and email
  - User ID (or "Guest" if anonymous)
  - Category
  - Submission timestamp
  - Full message content
  - Link to view in admin panel

#### Scenario: Admin panel link
- **WHEN** an admin notification is sent
- **THEN** the email SHALL include a direct link to the ticket in the admin panel

### Requirement: Email Delivery

The email system SHALL handle delivery reliably.

#### Scenario: Email sending failure
- **WHEN** email sending fails
- **THEN** the ticket creation SHALL still succeed
- **AND** the failure SHALL be logged for retry

#### Scenario: Email retry
- **WHEN** an email fails to send
- **THEN** the system MAY retry sending up to 3 times
- **AND** each retry SHALL have increasing delay

### Requirement: Email Formatting

The support emails SHALL be properly formatted.

#### Scenario: HTML and plain text
- **WHEN** emails are sent
- **THEN** both HTML and plain text versions SHALL be included

#### Scenario: Message preservation
- **WHEN** the user's message is included in the email
- **THEN** line breaks SHALL be preserved
- **AND** the message SHALL be visually separated from other content

#### Scenario: Consistent branding
- **WHEN** emails are sent
- **THEN** they SHALL follow the application's email template design
- **AND** the Country Calendar branding SHALL be included
