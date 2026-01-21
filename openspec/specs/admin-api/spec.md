## Purpose

Provide administrative API endpoints for managing users, support tickets, and system statistics.
## Requirements
### Requirement: List Users Endpoint

The API SHALL provide an endpoint for listing users with pagination and search.

#### Scenario: Successful user listing
- **WHEN** `GET /api/v1/admin/users` is called by an admin
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include a `users` array
- **AND** the response SHALL include `pagination` object

#### Scenario: Pagination parameters
- **WHEN** listing users
- **THEN** the following query parameters SHALL be supported:
  - `page`: page number (default: 1)
  - `limit`: items per page (default: 20, max: 100)
  - `search`: search string (optional)

#### Scenario: Pagination response
- **WHEN** users are listed
- **THEN** the pagination object SHALL include:
  - `page`: current page number
  - `limit`: items per page
  - `total`: total user count
  - `pages`: total page count

#### Scenario: User search
- **WHEN** a search parameter is provided
- **THEN** results SHALL be filtered by name OR email
- **AND** the search SHALL be case-insensitive
- **AND** partial matches SHALL be included

#### Scenario: User list fields
- **WHEN** users are listed
- **THEN** each user SHALL include: id, name, email, isAdmin, isConfirmed, createdAt

### Requirement: Get User Endpoint

The API SHALL provide an endpoint for retrieving user details.

#### Scenario: Successful user retrieval
- **WHEN** `GET /api/v1/admin/users/:id` is called by an admin
- **AND** the user exists
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include user details with stats

#### Scenario: User details response
- **WHEN** a user is retrieved
- **THEN** the response SHALL include:
  - `id`: user UUID
  - `name`: display name
  - `email`: email address
  - `isAdmin`: admin status
  - `isConfirmed`: email confirmation status
  - `createdAt`: registration timestamp
  - `stats`: object with totalRecords and totalCountries

#### Scenario: User not found
- **WHEN** `GET /api/v1/admin/users/:id` is called
- **AND** the user does not exist
- **THEN** the response SHALL have status 404
- **AND** the error code SHALL be `USER_NOT_FOUND`

### Requirement: Update User Endpoint

The API SHALL provide an endpoint for updating user information.

#### Scenario: Successful user update
- **WHEN** `PATCH /api/v1/admin/users/:id` is called by an admin
- **AND** the request body is valid
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include the updated user

#### Scenario: Updatable fields
- **WHEN** updating a user
- **THEN** the following fields SHALL be updatable:
  - `name`: display name
  - `email`: email address
  - `isAdmin`: admin status
  - `isConfirmed`: email confirmation status

#### Scenario: Email uniqueness validation
- **WHEN** updating a user's email
- **AND** the new email is already in use by another user
- **THEN** the response SHALL have status 400
- **AND** the error code SHALL be `EMAIL_EXISTS`

#### Scenario: Update non-existent user
- **WHEN** `PATCH /api/v1/admin/users/:id` is called
- **AND** the user does not exist
- **THEN** the response SHALL have status 404
- **AND** the error code SHALL be `USER_NOT_FOUND`

### Requirement: Delete User Endpoint

The API SHALL provide an endpoint for deleting users.

#### Scenario: Successful user deletion
- **WHEN** `DELETE /api/v1/admin/users/:id` is called by an admin
- **AND** the user exists
- **AND** the user is not the requesting admin
- **THEN** the response SHALL have status 200
- **AND** the message SHALL indicate user deleted successfully

#### Scenario: User deletion cascade
- **WHEN** a user is deleted
- **THEN** all user travel records SHALL be deleted
- **AND** all user OAuth connections SHALL be deleted
- **AND** all user refresh tokens SHALL be invalidated

#### Scenario: Delete non-existent user
- **WHEN** `DELETE /api/v1/admin/users/:id` is called
- **AND** the user does not exist
- **THEN** the response SHALL have status 404
- **AND** the error code SHALL be `USER_NOT_FOUND`

### Requirement: Get System Stats Endpoint

The API SHALL provide an endpoint for retrieving system statistics.

#### Scenario: Successful stats retrieval
- **WHEN** `GET /api/v1/admin/stats` is called by an admin
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include system statistics

#### Scenario: Stats response
- **WHEN** system stats are retrieved
- **THEN** the response SHALL include:
  - `totalUsers`: count of all users
  - `totalRecords`: count of all travel records
  - `activeUsers30Days`: count of users with login in last 30 days
  - `openTickets`: count of support tickets with status "open"

### Requirement: List Support Tickets Endpoint

The API SHALL provide an endpoint for listing support tickets.

#### Scenario: Successful ticket listing
- **WHEN** `GET /api/v1/admin/support` is called by an admin
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include a `tickets` array
- **AND** the response SHALL include `pagination` object

#### Scenario: Ticket filter parameters
- **WHEN** listing tickets
- **THEN** the following query parameters SHALL be supported:
  - `page`: page number (default: 1)
  - `limit`: items per page (default: 20, max: 100)
  - `status`: filter by status (optional: open, in_progress, closed)

#### Scenario: Ticket list fields
- **WHEN** tickets are listed
- **THEN** each ticket SHALL include: referenceId, name, email, subject, category, status, createdAt

#### Scenario: Ticket list ordering
- **WHEN** tickets are listed
- **THEN** they SHALL be sorted by createdAt descending (newest first)

### Requirement: Update Support Ticket Endpoint

The API SHALL provide an endpoint for updating support ticket status and notes.

#### Scenario: Successful ticket update
- **WHEN** `PATCH /api/v1/admin/support/:referenceId` is called by an admin
- **AND** the request body is valid
- **THEN** the response SHALL have status 200
- **AND** the response SHALL include the updated ticket

#### Scenario: Updatable ticket fields
- **WHEN** updating a ticket
- **THEN** the following fields SHALL be updatable:
  - `status`: ticket status (open, in_progress, closed)
  - `notes`: admin notes (private, not visible to user)

#### Scenario: Ticket status values
- **WHEN** updating ticket status
- **THEN** valid status values SHALL be: `open`, `in_progress`, `closed`

#### Scenario: Update non-existent ticket
- **WHEN** `PATCH /api/v1/admin/support/:referenceId` is called
- **AND** the ticket does not exist
- **THEN** the response SHALL have status 404
- **AND** the error code SHALL be `TICKET_NOT_FOUND`

### Requirement: Delete Support Ticket Endpoint

The API SHALL provide an endpoint for deleting support tickets.

#### Scenario: Successful ticket deletion
- **WHEN** `DELETE /api/v1/admin/support/:referenceId` is called by an admin
- **AND** the ticket exists
- **THEN** the response SHALL have status 200
- **AND** the message SHALL indicate ticket deleted successfully

#### Scenario: Delete non-existent ticket
- **WHEN** `DELETE /api/v1/admin/support/:referenceId` is called
- **AND** the ticket does not exist
- **THEN** the response SHALL have status 404
- **AND** the error code SHALL be `TICKET_NOT_FOUND`

### Requirement: Admin Stats Query Optimization
The admin statistics service SHALL use efficient database queries.

#### Scenario: Active users count
- **WHEN** counting active users in the last 30 days
- **THEN** the system SHALL use `findMany` with `distinct: ['userId']`
- **AND** NOT use `groupBy` for simple distinct counting

#### Scenario: User statistics query
- **WHEN** fetching user travel statistics
- **THEN** the system SHALL combine count and country queries into single `groupBy` query
- **AND** calculate total records from grouped results

### Requirement: Login Attempt Cleanup
The authentication service SHALL limit the scope of login attempt cleanup operations.

#### Scenario: Cleanup on successful login
- **WHEN** a user logs in successfully
- **THEN** the system SHALL delete failed login attempts older than 30 days
- **AND** NOT delete recent failed attempts (may be needed for security analysis)

#### Scenario: Cleanup constraint
- **WHEN** deleting failed login attempts
- **THEN** the system SHALL include `createdAt: { lt: thirtyDaysAgo }` condition

