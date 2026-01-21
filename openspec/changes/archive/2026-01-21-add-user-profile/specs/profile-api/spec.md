## ADDED Requirements

### Requirement: Get Profile Endpoint

The API SHALL provide an endpoint for retrieving user profile information.

#### Scenario: Successful profile retrieval
- **WHEN** `GET /api/v1/profile` is called
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include user profile data

#### Scenario: Profile response structure
- **WHEN** a profile is retrieved
- **THEN** the response SHALL include:
  - `id`: user UUID
  - `name`: user display name
  - `email`: user email address
  - `isAdmin`: boolean admin flag
  - `createdAt`: account creation timestamp
  - `stats`: object with travel statistics
  - `oauthProviders`: array of connected provider names

#### Scenario: Profile stats calculation
- **WHEN** a profile is retrieved
- **THEN** `stats.totalCountries` SHALL be the count of unique countries visited
- **AND** `stats.totalDays` SHALL be the count of unique dates with travel records

#### Scenario: Unauthenticated profile request
- **WHEN** `GET /api/v1/profile` is called without authentication
- **THEN** the response SHALL have status 401
- **AND** the error code SHALL be `UNAUTHORIZED`

### Requirement: Update Profile Endpoint

The API SHALL provide an endpoint for updating user profile information.

#### Scenario: Successful profile update
- **WHEN** `PATCH /api/v1/profile` is called with valid data
- **AND** the user is authenticated
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include the updated profile data

#### Scenario: Update name
- **WHEN** a profile update includes a new name
- **THEN** the user's name SHALL be updated
- **AND** the name SHALL be trimmed of leading/trailing whitespace

#### Scenario: Update email
- **WHEN** a profile update includes a new email
- **THEN** the user's email SHALL be updated
- **AND** the email SHALL be stored in lowercase

#### Scenario: Email uniqueness validation
- **WHEN** a profile update includes an email that already exists
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `EMAIL_EXISTS`
- **AND** the error message SHALL indicate the email is already in use

#### Scenario: Invalid email format
- **WHEN** a profile update includes an invalid email format
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate invalid email format

#### Scenario: Empty name validation
- **WHEN** a profile update includes an empty name
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate name is required

#### Scenario: Name length validation
- **WHEN** a profile update includes a name exceeding 100 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate maximum name length

### Requirement: Change Password Endpoint

The API SHALL provide an endpoint for changing user password.

#### Scenario: Successful password change with current password
- **WHEN** `POST /api/v1/profile/change-password` is called
- **AND** the user has a password set
- **AND** the current password is correct
- **AND** the new password meets requirements
- **THEN** the response SHALL have status 200
- **AND** the message SHALL indicate password changed successfully

#### Scenario: Password change for OAuth-only user
- **WHEN** `POST /api/v1/profile/change-password` is called
- **AND** the user registered via OAuth only (no password)
- **THEN** the current password field SHALL be optional
- **AND** the user SHALL be able to set a password

#### Scenario: Incorrect current password
- **WHEN** a password change is attempted with incorrect current password
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `INVALID_CURRENT_PASSWORD`

#### Scenario: Password minimum length
- **WHEN** a new password is less than 8 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate minimum password length of 8 characters

#### Scenario: Password maximum length
- **WHEN** a new password exceeds 128 characters
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate maximum password length

#### Scenario: Password hashing
- **WHEN** a password is changed
- **THEN** the new password SHALL be hashed with bcrypt
- **AND** the cost factor SHALL be at least 10

### Requirement: Delete Account Endpoint

The API SHALL provide an endpoint for deleting user accounts.

#### Scenario: Successful account deletion
- **WHEN** `DELETE /api/v1/profile` is called
- **AND** the confirmation field equals "DELETE"
- **THEN** the response SHALL have status 200
- **AND** the message SHALL indicate account deleted successfully

#### Scenario: Account deletion data cleanup
- **WHEN** an account is deleted
- **THEN** all user travel records SHALL be deleted
- **AND** all user OAuth connections SHALL be deleted
- **AND** all user refresh tokens SHALL be invalidated
- **AND** the user record SHALL be deleted

#### Scenario: Invalid deletion confirmation
- **WHEN** `DELETE /api/v1/profile` is called
- **AND** the confirmation field does not equal "DELETE"
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `INVALID_CONFIRMATION`
- **AND** the error message SHALL indicate confirmation must be "DELETE"

#### Scenario: Missing confirmation
- **WHEN** `DELETE /api/v1/profile` is called without confirmation
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate confirmation is required

### Requirement: Disconnect OAuth Provider Endpoint

The API SHALL provide an endpoint for disconnecting OAuth providers.

#### Scenario: Successful OAuth disconnect
- **WHEN** `DELETE /api/v1/profile/oauth/:provider` is called
- **AND** the user has the specified provider connected
- **AND** the user has an alternative authentication method
- **THEN** the response SHALL have status 200
- **AND** the message SHALL indicate provider disconnected

#### Scenario: OAuth disconnect validation
- **WHEN** a user attempts to disconnect their only authentication method
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `CANNOT_DISCONNECT`
- **AND** the error message SHALL indicate user must have at least one authentication method

#### Scenario: Provider not connected
- **WHEN** `DELETE /api/v1/profile/oauth/:provider` is called
- **AND** the user does not have the specified provider connected
- **THEN** the response SHALL have status 404
- **AND** the error code SHALL be `PROVIDER_NOT_FOUND`

#### Scenario: Invalid provider
- **WHEN** `DELETE /api/v1/profile/oauth/:provider` is called
- **AND** the provider is not a valid OAuth provider
- **THEN** the response SHALL have status 400
- **AND** the error SHALL indicate invalid provider

#### Scenario: Valid provider values
- **WHEN** disconnecting an OAuth provider
- **THEN** valid provider values SHALL be: `google`, `facebook`, `apple`
