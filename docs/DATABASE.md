# Database Documentation

This document describes the database schema, models, and data management for Country Calendar.

## Overview

- **Database:** PostgreSQL 15+
- **ORM:** Prisma 5.9
- **Schema Location:** `packages/api/prisma/schema.prisma`
- **Migrations:** `packages/api/prisma/migrations/`

## Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│      User        │       │   TravelRecord   │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │──┐    │ id (PK)          │
│ email (unique)   │  │    │ userId (FK)      │──┐
│ passwordHash     │  │    │ date             │  │
│ name             │  │    │ countryCode      │  │
│ isAdmin          │  │    │ createdAt        │  │
│ isActive         │  │    │ updatedAt        │  │
│ emailConfirmed   │  │    └──────────────────┘  │
│ createdAt        │  │                          │
│ updatedAt        │  │    ┌──────────────────┐  │
└──────────────────┘  │    │     OAuth        │  │
         │            │    ├──────────────────┤  │
         │            └───▶│ id (PK)          │  │
         │                 │ userId (FK)      │◀─┘
         │                 │ provider         │
         │                 │ providerId       │
         │                 │ createdAt        │
         │                 └──────────────────┘
         │
         │            ┌──────────────────────┐
         │            │    RefreshToken      │
         │            ├──────────────────────┤
         └───────────▶│ id (PK)              │
         │            │ userId (FK)          │
         │            │ token (unique)       │
         │            │ expiresAt            │
         │            │ createdAt            │
         │            └──────────────────────┘
         │
         │            ┌──────────────────────┐
         │            │ EmailConfirmToken    │
         │            ├──────────────────────┤
         └───────────▶│ id (PK)              │
         │            │ userId (FK, unique)  │
         │            │ token (unique)       │
         │            │ expiresAt            │
         │            │ createdAt            │
         │            └──────────────────────┘
         │
         │            ┌──────────────────────┐
         │            │ PasswordResetToken   │
         │            ├──────────────────────┤
         └───────────▶│ id (PK)              │
         │            │ userId (FK)          │
         │            │ token (unique)       │
         │            │ expiresAt            │
         │            │ createdAt            │
         │            └──────────────────────┘
         │
         │            ┌──────────────────────┐
         │            │   SupportTicket      │
         │            ├──────────────────────┤
         └───────────▶│ id (PK)              │
         │            │ userId (FK, nullable)│
         │            │ referenceId (unique) │
         │            │ email                │
         │            │ category             │
         │            │ subject              │
         │            │ message              │
         │            │ status               │
         │            │ response             │
         │            │ createdAt            │
         │            │ updatedAt            │
         │            └──────────────────────┘
         │
         │            ┌──────────────────────┐
         │            │    LoginAttempt      │
         │            ├──────────────────────┤
         └───────────▶│ id (PK)              │
                      │ userId (FK, nullable)│
                      │ email                │
                      │ ipAddress            │
                      │ success              │
                      │ createdAt            │
                      └──────────────────────┘

┌──────────────────────┐
│     AuditLog         │
├──────────────────────┤
│ id (PK)              │
│ adminId              │
│ action               │
│ targetType           │
│ targetId             │
│ details              │
│ createdAt            │
└──────────────────────┘
```

## Models

### User

Primary user account model.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| email | String | Unique, not null | User email address |
| passwordHash | String | Nullable | Bcrypt hashed password (null for OAuth-only) |
| name | String | Not null | Display name |
| isAdmin | Boolean | Default false | Admin privileges |
| isActive | Boolean | Default true | Account status |
| emailConfirmed | Boolean | Default false | Email verification status |
| createdAt | DateTime | Default now | Account creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Relations:**
- 1:M with TravelRecord
- 1:M with OAuth
- 1:M with RefreshToken
- 1:1 with EmailConfirmationToken
- 1:M with PasswordResetToken
- 1:M with SupportTicket
- 1:M with LoginAttempt

### TravelRecord

User's travel history entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, not null | Record owner |
| date | Date | Not null | Date of travel |
| countryCode | String(2) | Not null | ISO 3166-1 alpha-2 code |
| createdAt | DateTime | Default now | Record creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Unique Constraint:** `(userId, date, countryCode)`

**Index:** `userId` for faster lookups

### OAuth

Third-party authentication providers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, not null | Linked user |
| provider | String | Not null | Provider name (google, facebook, apple) |
| providerId | String | Not null | User ID from provider |
| createdAt | DateTime | Default now | Link creation timestamp |

**Unique Constraint:** `(provider, providerId)`

**Index:** `userId` for faster lookups

### RefreshToken

JWT refresh token storage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, not null | Token owner |
| token | String | Unique, not null | JWT token string |
| expiresAt | DateTime | Not null | Expiration timestamp |
| createdAt | DateTime | Default now | Token creation timestamp |

**Index:** `token` for fast lookup, `expiresAt` for cleanup job

### EmailConfirmationToken

Email verification tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, unique | One token per user |
| token | String | Unique, not null | Verification token |
| expiresAt | DateTime | Not null | Expiration timestamp |
| createdAt | DateTime | Default now | Token creation timestamp |

### PasswordResetToken

Password reset tokens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, not null | Token owner |
| token | String | Unique, not null | Reset token |
| expiresAt | DateTime | Not null | Expiration timestamp |
| createdAt | DateTime | Default now | Token creation timestamp |

### SupportTicket

Customer support tickets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, nullable | Ticket creator (if logged in) |
| referenceId | String | Unique, not null | Public reference (SUP-XXXXX) |
| email | String | Not null | Contact email |
| category | String | Not null | Ticket category |
| subject | String | Not null | Ticket subject |
| message | String | Not null | Ticket content |
| status | Enum | Default 'open' | open, in_progress, resolved, closed |
| response | String | Nullable | Admin response |
| createdAt | DateTime | Default now | Ticket creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

### LoginAttempt

Security audit trail for login attempts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| userId | UUID | FK to User, nullable | User (if found) |
| email | String | Not null | Attempted email |
| ipAddress | String | Not null | Client IP address |
| success | Boolean | Not null | Attempt result |
| createdAt | DateTime | Default now | Attempt timestamp |

**Index:** `(email, createdAt)` for lockout checks

### AuditLog

Admin action audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| adminId | UUID | Not null | Admin who performed action |
| action | String | Not null | Action type (create, update, delete) |
| targetType | String | Not null | Target entity type |
| targetId | String | Not null | Target entity ID |
| details | JSON | Nullable | Additional action details |
| createdAt | DateTime | Default now | Action timestamp |

## Migrations

### Running Migrations

```bash
# Development: Create and apply migration
cd packages/api
npx prisma migrate dev --name migration_name

# Production: Apply pending migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration Best Practices

1. **Never edit applied migrations** - Create new migrations for fixes
2. **Use descriptive names** - `add_user_preferences`, `create_audit_log`
3. **Test migrations** - Run on local copy of production data
4. **Backup before deploy** - Always backup production database

## Seeding

### Development Seed Data

```bash
cd packages/api
npx prisma db seed
```

Seed file location: `packages/api/prisma/seed.ts`

## Queries

### Common Query Patterns

#### Get user with travel records
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    travelRecords: {
      orderBy: { date: 'desc' }
    }
  }
});
```

#### Get records for date range
```typescript
const records = await prisma.travelRecord.findMany({
  where: {
    userId,
    date: {
      gte: startDate,
      lte: endDate
    }
  },
  orderBy: { date: 'asc' }
});
```

#### Aggregate travel statistics
```typescript
const stats = await prisma.travelRecord.groupBy({
  by: ['countryCode'],
  where: { userId },
  _count: { countryCode: true }
});
```

## Performance Considerations

### Indexes

The following indexes are defined for performance:

- `User.email` - Unique, for login lookups
- `TravelRecord.userId` - For user record queries
- `TravelRecord.(userId, date)` - Composite for date range queries
- `RefreshToken.token` - For token validation
- `LoginAttempt.(email, createdAt)` - For lockout checks

### Query Optimization

1. **Use `select` for partial data** - Only fetch needed columns
2. **Paginate large result sets** - Use `take` and `skip`
3. **Batch operations** - Use `createMany` for bulk inserts
4. **Avoid N+1 queries** - Use `include` for relations

## Backup & Recovery

### Production Backup (Heroku)

Heroku PostgreSQL provides automatic daily backups.

```bash
# Manual backup
heroku pg:backups:capture --app countrycalendar

# Download backup
heroku pg:backups:download --app countrycalendar

# Restore from backup
heroku pg:backups:restore BACKUP_ID --app countrycalendar
```

### Local Backup

```bash
# Backup
pg_dump -h localhost -p 5434 -U postgres ccalendar > backup.sql

# Restore
psql -h localhost -p 5434 -U postgres ccalendar < backup.sql
```
