## ADDED Requirements

### Requirement: Authentication Method Validation

The system SHALL ensure users always have at least one authentication method.

#### Scenario: User with password and OAuth
- **WHEN** a user has both password and OAuth provider connected
- **THEN** they SHALL be able to disconnect the OAuth provider
- **AND** they SHALL be able to remove their password (by not having one)

#### Scenario: User with only password
- **WHEN** a user has only password authentication
- **THEN** they SHALL NOT be able to remove their password
- **AND** they SHALL be encouraged to connect an OAuth provider

#### Scenario: User with only OAuth
- **WHEN** a user has only OAuth authentication
- **THEN** they SHALL NOT be able to disconnect their only OAuth provider
- **AND** they SHALL be encouraged to set a password

#### Scenario: Multiple OAuth providers
- **WHEN** a user has multiple OAuth providers connected
- **THEN** they SHALL be able to disconnect any provider except the last one
- **AND** a warning SHALL be shown when only one auth method remains

### Requirement: Password Security Rules

The system SHALL enforce password security requirements.

#### Scenario: Minimum password length
- **WHEN** a user sets or changes their password
- **THEN** the password SHALL be at least 8 characters long

#### Scenario: Maximum password length
- **WHEN** a user sets or changes their password
- **THEN** the password SHALL NOT exceed 128 characters

#### Scenario: Password hashing
- **WHEN** a password is stored
- **THEN** it SHALL be hashed using bcrypt
- **AND** the cost factor SHALL be at least 10

#### Scenario: Password comparison
- **WHEN** verifying a password
- **THEN** timing-safe comparison SHALL be used
- **AND** the plain text password SHALL never be logged

### Requirement: Account Deletion Security

The system SHALL implement secure account deletion.

#### Scenario: Deletion confirmation requirement
- **WHEN** deleting an account
- **THEN** the user SHALL type "DELETE" exactly to confirm
- **AND** the confirmation SHALL be case-sensitive

#### Scenario: Deletion completeness
- **WHEN** an account is deleted
- **THEN** all associated data SHALL be removed:
  - User record
  - All travel records
  - All OAuth connections
  - All refresh tokens
  - All session data

#### Scenario: Deletion audit
- **WHEN** an account is deleted
- **THEN** the deletion event MAY be logged for audit purposes
- **AND** no personally identifiable information SHALL be retained in logs

### Requirement: OAuth Security

The system SHALL implement secure OAuth management.

#### Scenario: OAuth token storage
- **WHEN** storing OAuth connection data
- **THEN** only the provider name and provider user ID SHALL be stored
- **AND** OAuth tokens SHALL NOT be stored long-term

#### Scenario: OAuth disconnect cleanup
- **WHEN** an OAuth provider is disconnected
- **THEN** all associated OAuth data SHALL be removed
- **AND** the user's sessions SHALL remain valid (via other auth methods)

#### Scenario: OAuth reconnection
- **WHEN** a user reconnects a previously disconnected OAuth provider
- **THEN** a new OAuth connection record SHALL be created
- **AND** the connection SHALL link to the existing user account

### Requirement: Profile Update Security

The system SHALL implement secure profile updates.

#### Scenario: Email change validation
- **WHEN** a user changes their email
- **THEN** the new email SHALL be validated for format
- **AND** the new email SHALL be checked for uniqueness

#### Scenario: Input sanitization
- **WHEN** profile data is updated
- **THEN** all string inputs SHALL be trimmed
- **AND** HTML tags SHALL be stripped from name fields

#### Scenario: Rate limiting profile updates
- **WHEN** multiple profile update requests are made
- **THEN** rate limiting MAY be applied
- **AND** the limit SHALL be reasonable for normal use (e.g., 10 updates per minute)
