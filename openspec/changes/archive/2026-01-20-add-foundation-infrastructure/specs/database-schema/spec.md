## ADDED Requirements

### Requirement: Prisma ORM Configuration

The project SHALL use Prisma as the ORM for database access and migrations.

#### Scenario: Prisma schema location
- **WHEN** the Prisma schema is examined
- **THEN** it SHALL be located at `packages/api/prisma/schema.prisma`
- **AND** it SHALL configure PostgreSQL as the datasource
- **AND** it SHALL use `prisma-client-js` as the generator

#### Scenario: Database connection
- **WHEN** Prisma connects to the database
- **THEN** it SHALL use the `DATABASE_URL` environment variable
- **AND** connection pooling SHALL be enabled for production readiness

### Requirement: User Model

The database SHALL have a User model for storing user account information.

#### Scenario: User model fields
- **WHEN** the User model is examined
- **THEN** it SHALL contain:
  - `id` - UUID, primary key, auto-generated
  - `name` - VARCHAR(100), NOT NULL
  - `email` - VARCHAR(120), UNIQUE, NOT NULL
  - `password` - VARCHAR(60), nullable (for OAuth-only users)
  - `isAdmin` - BOOLEAN, default false
  - `isConfirmed` - BOOLEAN, default false
  - `confirmedAt` - TIMESTAMP, nullable
  - `createdAt` - TIMESTAMP, default now()
  - `updatedAt` - TIMESTAMP, auto-update

#### Scenario: User model relations
- **WHEN** a User record exists
- **THEN** it SHALL have one-to-many relations with:
  - TravelRecord (cascade delete)
  - OAuth (cascade delete)
  - SupportTicket (set null on delete)

#### Scenario: User email uniqueness
- **WHEN** a new User is created with an email that already exists
- **THEN** the database SHALL reject the insertion with a unique constraint violation

### Requirement: TravelRecord Model

The database SHALL have a TravelRecord model for storing travel history entries.

#### Scenario: TravelRecord model fields
- **WHEN** the TravelRecord model is examined
- **THEN** it SHALL contain:
  - `id` - UUID, primary key, auto-generated
  - `userId` - UUID, foreign key to User, NOT NULL
  - `countryCode` - VARCHAR(2), NOT NULL (ISO 3166-1 alpha-2)
  - `date` - DATE, NOT NULL
  - `createdAt` - TIMESTAMP, default now()
  - `updatedAt` - TIMESTAMP, auto-update

#### Scenario: TravelRecord indexes
- **WHEN** the TravelRecord model is examined
- **THEN** it SHALL have:
  - Composite index on `(userId, date)` for fast date range queries
  - Unique constraint on `(userId, date, countryCode)` to prevent duplicates

#### Scenario: TravelRecord cascade delete
- **WHEN** a User is deleted
- **THEN** all associated TravelRecord entries SHALL be deleted

### Requirement: OAuth Model

The database SHALL have an OAuth model for storing OAuth provider connections.

#### Scenario: OAuth model fields
- **WHEN** the OAuth model is examined
- **THEN** it SHALL contain:
  - `id` - UUID, primary key, auto-generated
  - `provider` - VARCHAR(50), NOT NULL (google/facebook/apple)
  - `providerId` - VARCHAR(255), NOT NULL (external user ID)
  - `userId` - UUID, foreign key to User, NOT NULL
  - `token` - JSON, nullable (OAuth token data)
  - `createdAt` - TIMESTAMP, default now()
  - `updatedAt` - TIMESTAMP, auto-update

#### Scenario: OAuth unique constraint
- **WHEN** the OAuth model is examined
- **THEN** it SHALL have a unique constraint on `(provider, providerId)`
- **AND** this SHALL prevent the same OAuth account from being linked to multiple users

### Requirement: SupportTicket Model

The database SHALL have a SupportTicket model for storing support requests.

#### Scenario: SupportTicket model fields
- **WHEN** the SupportTicket model is examined
- **THEN** it SHALL contain:
  - `id` - UUID, primary key, auto-generated
  - `referenceId` - VARCHAR(10), UNIQUE (user-facing ticket ID)
  - `name` - VARCHAR(100), NOT NULL
  - `email` - VARCHAR(120), NOT NULL
  - `subject` - VARCHAR(200), NOT NULL
  - `category` - VARCHAR(20), NOT NULL (general/account/bug/feature/billing/other)
  - `message` - TEXT, NOT NULL
  - `userId` - UUID, foreign key to User, nullable
  - `status` - VARCHAR(20), default 'open' (open/in_progress/closed)
  - `notes` - TEXT, nullable (admin-only notes)
  - `createdAt` - TIMESTAMP, default now()
  - `updatedAt` - TIMESTAMP, auto-update

#### Scenario: SupportTicket user relation
- **WHEN** a User is deleted
- **THEN** associated SupportTicket records SHALL have their `userId` set to NULL

### Requirement: Database Migrations

Prisma migrations SHALL manage database schema changes.

#### Scenario: Initial migration
- **WHEN** `npx prisma migrate dev` is run for the first time
- **THEN** it SHALL create all tables with proper indexes and constraints
- **AND** the migration SHALL be stored in `packages/api/prisma/migrations/`

#### Scenario: Migration reproducibility
- **WHEN** `npx prisma migrate deploy` is run on a fresh database
- **THEN** all migrations SHALL apply successfully
- **AND** the resulting schema SHALL match the Prisma schema definition

### Requirement: Table Naming Convention

All database tables SHALL use snake_case naming.

#### Scenario: Table names
- **WHEN** the database schema is examined
- **THEN** tables SHALL be named:
  - `users` (not `User`)
  - `travel_records` (not `TravelRecord`)
  - `oauth_accounts` (not `OAuth`)
  - `support_tickets` (not `SupportTicket`)
