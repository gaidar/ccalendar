## ADDED Requirements

### Requirement: Admin Authentication Middleware

The system SHALL provide middleware to protect admin-only routes.

#### Scenario: Admin access granted
- **WHEN** a request is made to an admin endpoint
- **AND** the user is authenticated
- **AND** the user has `isAdmin = true`
- **THEN** the request SHALL proceed to the handler

#### Scenario: Unauthenticated access denied
- **WHEN** a request is made to an admin endpoint
- **AND** the user is not authenticated
- **THEN** the response SHALL have status 401
- **AND** the error code SHALL be `UNAUTHORIZED`

#### Scenario: Non-admin access denied
- **WHEN** a request is made to an admin endpoint
- **AND** the user is authenticated
- **AND** the user has `isAdmin = false`
- **THEN** the response SHALL have status 403
- **AND** the error code SHALL be `FORBIDDEN`
- **AND** the error message SHALL indicate admin access required

### Requirement: Admin Self-Protection

The system SHALL prevent admins from removing their own admin access.

#### Scenario: Admin self-demotion prevented
- **WHEN** an admin attempts to set their own `isAdmin` to false
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `CANNOT_DEMOTE_SELF`
- **AND** the error message SHALL indicate admins cannot demote themselves

#### Scenario: Admin self-deletion prevented
- **WHEN** an admin attempts to delete their own account via admin endpoint
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `CANNOT_DELETE_SELF`
- **AND** the error message SHALL indicate admins cannot delete themselves

### Requirement: Audit Logging

The system SHALL log all admin actions for audit purposes.

#### Scenario: Audit log entry
- **WHEN** an admin performs an action
- **THEN** an audit log entry SHALL be created
- **AND** the entry SHALL include:
  - Timestamp
  - Admin user ID
  - Action type
  - Target type and ID
  - Action details

#### Scenario: Audit action types
- **WHEN** admin actions are logged
- **THEN** the following action types SHALL be supported:
  - `USER_VIEWED`
  - `USER_UPDATED`
  - `USER_DELETED`
  - `TICKET_VIEWED`
  - `TICKET_UPDATED`
  - `TICKET_DELETED`

#### Scenario: Audit log retention
- **WHEN** audit logs are stored
- **THEN** they SHALL be retained for 5 years
