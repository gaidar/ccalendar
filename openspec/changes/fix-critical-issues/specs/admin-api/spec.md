# Admin API - Delta Spec

## MODIFIED Requirements

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
