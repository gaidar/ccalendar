# support Specification

## Purpose
TBD - created by archiving change add-support-system. Update Purpose after archive.
## Requirements
### Requirement: Support Ticket Creation

The system SHALL allow users (authenticated or anonymous) to create support tickets via a public API endpoint.

The ticket MUST include:
- Name (1-100 characters)
- Email (valid email format, max 120 characters)
- Category (one of: general, bug, account, billing, feature)
- Subject (1-200 characters)
- Message (1-5000 characters)

The system SHALL generate a unique reference ID in the format SUP-XXXXXX (where X is alphanumeric).

The system SHALL optionally link the ticket to the authenticated user if a valid JWT is provided.

The system SHALL apply rate limiting of 5 tickets per hour per IP address.

#### Scenario: Anonymous user creates ticket successfully
- **WHEN** an anonymous user submits a valid support ticket
- **THEN** the system creates the ticket with status "open"
- **AND** returns the unique reference ID
- **AND** userId is null

#### Scenario: Authenticated user creates ticket
- **WHEN** an authenticated user submits a valid support ticket
- **THEN** the system creates the ticket with status "open"
- **AND** returns the unique reference ID
- **AND** links the ticket to the user's account

#### Scenario: Invalid ticket data rejected
- **WHEN** a user submits a ticket with invalid data (missing fields, invalid email, etc.)
- **THEN** the system returns a 400 error with validation details

#### Scenario: Rate limit exceeded
- **WHEN** a user exceeds 5 tickets per hour from the same IP
- **THEN** the system returns a 429 error with retry-after information

### Requirement: Support Form UI

The system SHALL provide a support form page accessible at /support.

The form MUST include:
- Name input field
- Email input field
- Category dropdown (General, Bug Report, Account Issue, Billing, Feature Request)
- Subject input field
- Message textarea

The form SHALL pre-fill name and email fields if the user is authenticated.

The form SHALL display inline validation errors.

The form SHALL show a loading state during submission.

#### Scenario: Form displays correctly for anonymous user
- **WHEN** an anonymous user navigates to /support
- **THEN** the form displays with empty name and email fields
- **AND** all form fields are editable

#### Scenario: Form pre-fills for authenticated user
- **WHEN** an authenticated user navigates to /support
- **THEN** the form pre-fills name and email from the user's account
- **AND** the user can still edit these fields

#### Scenario: Form validation on submit
- **WHEN** a user submits the form with invalid data
- **THEN** inline validation errors are displayed
- **AND** the form is not submitted to the server

### Requirement: Ticket Confirmation Page

The system SHALL display a confirmation page after successful ticket submission.

The page MUST show:
- The unique reference ID prominently
- A success message
- Information about expected response time
- Options to submit another ticket or return home

#### Scenario: Confirmation displays after successful submission
- **WHEN** a user successfully submits a support ticket
- **THEN** they are redirected to /support/confirmation/:referenceId
- **AND** the reference ID is displayed prominently
- **AND** instructions for follow-up are shown

