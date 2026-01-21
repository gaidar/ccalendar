# support-api Specification

## Purpose
TBD - created by archiving change add-support-system. Update Purpose after archive.
## Requirements
### Requirement: Create Support Ticket Endpoint

The API SHALL provide a public endpoint for creating support tickets.

#### Scenario: Successful ticket creation
- **WHEN** `POST /api/v1/support` is called with valid data
- **THEN** the response SHALL have status 201
- **AND** the response SHALL include a `referenceId`
- **AND** the response SHALL include a success message

#### Scenario: Response structure
- **WHEN** a ticket is created successfully
- **THEN** the response SHALL include:
  - `referenceId`: ticket reference ID (e.g., "TKT-A1B2C3D4")
  - `message`: "Support ticket created successfully"

#### Scenario: Ticket persistence
- **WHEN** a ticket is created
- **THEN** the ticket SHALL be stored in the database
- **AND** the status SHALL be set to "open"
- **AND** the createdAt timestamp SHALL be recorded

### Requirement: Reference ID Generation

The system SHALL generate unique reference IDs for support tickets.

#### Scenario: Reference ID format
- **WHEN** a ticket is created
- **THEN** the reference ID SHALL follow the format `TKT-XXXXXXXX`
- **AND** X SHALL be uppercase alphanumeric characters (A-Z, 0-9)

#### Scenario: Reference ID uniqueness
- **WHEN** generating a reference ID
- **THEN** the system SHALL ensure the ID is unique
- **AND** if a collision occurs, a new ID SHALL be generated

### Requirement: Ticket Data Validation

The create ticket endpoint SHALL validate all input fields.

#### Scenario: Valid ticket data
- **WHEN** a ticket is created with valid data
- **THEN** the ticket SHALL be accepted
- **AND** string fields SHALL be trimmed of whitespace

#### Scenario: Name validation
- **WHEN** the name field is empty
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate name is required

#### Scenario: Name length validation
- **WHEN** the name exceeds 100 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate maximum name length

#### Scenario: Email validation
- **WHEN** the email is not a valid email format
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate invalid email format

#### Scenario: Email length validation
- **WHEN** the email exceeds 120 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate maximum email length

#### Scenario: Subject minimum length
- **WHEN** the subject is less than 5 characters
- **THEN** the response SHALL have status 400
- **AND** the error message SHALL indicate "Subject must be at least 5 characters"

#### Scenario: Subject maximum length
- **WHEN** the subject exceeds 200 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate maximum subject length

#### Scenario: Message minimum length
- **WHEN** the message is less than 20 characters
- **THEN** the response SHALL have status 400
- **AND** the error message SHALL indicate "Message must be at least 20 characters"

#### Scenario: Message maximum length
- **WHEN** the message exceeds 5000 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate maximum message length

#### Scenario: Category validation
- **WHEN** the category is not a valid option
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate invalid category

#### Scenario: Valid category values
- **WHEN** creating a ticket
- **THEN** valid category values SHALL be: `general`, `account`, `bug`, `feature`, `billing`, `other`

### Requirement: Anonymous Ticket Creation

The support endpoint SHALL allow unauthenticated users to create tickets.

#### Scenario: Anonymous ticket
- **WHEN** `POST /api/v1/support` is called without authentication
- **THEN** the ticket SHALL be created successfully
- **AND** the `userId` field SHALL be null

### Requirement: Authenticated User Linking

The support endpoint SHALL automatically link tickets to authenticated users.

#### Scenario: Authenticated ticket
- **WHEN** `POST /api/v1/support` is called by an authenticated user
- **THEN** the ticket SHALL be linked to the user's account
- **AND** the `userId` field SHALL contain the user's ID

#### Scenario: User ID persistence
- **WHEN** a ticket is linked to a user
- **THEN** the link SHALL persist even if the user changes their email

### Requirement: Support Rate Limiting

The support endpoint SHALL enforce rate limiting to prevent spam.

#### Scenario: Rate limit configuration
- **WHEN** the support endpoint is called
- **THEN** a rate limit of 5 requests per hour per IP SHALL be enforced

#### Scenario: Rate limit exceeded
- **WHEN** an IP exceeds 5 support requests per hour
- **THEN** the response SHALL have status 429
- **AND** the error code SHALL be `RATE_LIMITED`
- **AND** the Retry-After header SHALL indicate when the limit resets

#### Scenario: Rate limit headers
- **WHEN** a support request is made
- **THEN** the response SHALL include rate limit headers:
  - `X-RateLimit-Limit`: 5
  - `X-RateLimit-Remaining`: remaining requests
  - `X-RateLimit-Reset`: reset timestamp

### Requirement: Input Sanitization

The support endpoint SHALL sanitize input data.

#### Scenario: Email normalization
- **WHEN** a ticket is created
- **THEN** the email SHALL be stored in lowercase

#### Scenario: Whitespace trimming
- **WHEN** a ticket is created
- **THEN** all string fields SHALL be trimmed of leading/trailing whitespace

#### Scenario: HTML in message
- **WHEN** the message contains HTML tags
- **THEN** the message SHALL be stored as-is (not rendered as HTML)
- **AND** line breaks SHALL be preserved

