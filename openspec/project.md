# Country Calendar (ccalendar) - Technical Specification

## 1. Executive Summary

**Product Name:** Country Calendar (ccalendar)
**Purpose:** A web application enabling users to track countries visited on specific dates, visualize travel history on an interactive calendar, and generate travel reports
**Production URL:** https://countrycalendar.app/
**Development Environment:** Docker
**Production Platform:** Heroku with PostgreSQL
**Target Devices:** Mobile-first responsive design, with native mobile app wrapper planned

---

## 2. Technology Stack

### 2.1 Backend

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 20 LTS |
| Framework | Express.js | 4.x |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 5.x |
| Authentication | Passport.js | 0.7.x |
| JWT | jsonwebtoken | 9.x |
| Password Hashing | bcrypt | 5.x |
| Validation | Zod | 3.x |
| Email | Nodemailer + Mailgun | Latest |
| Rate Limiting | express-rate-limit | 7.x |

### 2.2 Frontend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | React | 18.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| Component Library | shadcn/ui | Latest |
| State Management | Zustand | 4.x |
| Data Fetching | TanStack Query | 5.x |
| Routing | React Router | 6.x |
| Calendar | react-big-calendar or FullCalendar React | Latest |
| Forms | React Hook Form + Zod | Latest |
| Icons | Lucide React | Latest |

### 2.3 Development & Deployment

| Component | Technology |
|-----------|------------|
| Containerization | Docker + Docker Compose |
| Production Hosting | Heroku |
| Database (Prod) | Heroku Postgres |
| CI/CD | GitHub Actions |
| API Documentation | OpenAPI/Swagger |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React SPA (Vite)                        │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │  │
│  │  │ Landing │ │Calendar │ │ Reports │ │  Admin Panel    │  │  │
│  │  │  Page   │ │  View   │ │  View   │ │  (if admin)     │  │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘  │  │
│  │                                                            │  │
│  │  shadcn/ui Components + Tailwind CSS                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│              Mobile App Wrapper (React Native WebView)           │
└─────────────────────────────────────────────────────────────────┘
                               │
                          REST API
                               │
┌─────────────────────────────────────────────────────────────────┐
│                       Backend Layer                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Express.js Server                        │  │
│  │                                                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │   Auth   │ │  Travel  │ │  Reports │ │    Admin     │  │  │
│  │  │  Routes  │ │  Routes  │ │  Routes  │ │   Routes     │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │              Middleware Layer                       │   │  │
│  │  │  Auth │ Rate Limit │ Validation │ Error Handler    │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                         Prisma ORM                               │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL                              │  │
│  │  ┌────────┐ ┌─────────────┐ ┌───────┐ ┌───────────────┐   │  │
│  │  │  User  │ │TravelRecord │ │ OAuth │ │ SupportTicket │   │  │
│  │  └────────┘ └─────────────┘ └───────┘ └───────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Directory Structure

```
ccalendar/
├── docker/
│   ├── Dockerfile.api          # Backend container
│   ├── Dockerfile.web          # Frontend container
│   └── docker-compose.yml      # Development orchestration
│
├── packages/
│   ├── api/                    # Backend (Node.js/Express)
│   │   ├── src/
│   │   │   ├── config/         # Configuration management
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── routes/         # Route definitions
│   │   │   ├── services/       # Business logic
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── validators/     # Zod schemas
│   │   │   └── index.ts        # Entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database migrations
│   │   ├── tests/              # API tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Frontend (React/Vite)
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── ui/         # shadcn/ui components
│       │   │   ├── layout/     # Layout components
│       │   │   └── features/   # Feature components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utilities and helpers
│       │   ├── pages/          # Page components
│       │   ├── services/       # API client services
│       │   ├── stores/         # Zustand stores
│       │   ├── styles/         # Global styles
│       │   ├── types/          # TypeScript types
│       │   ├── App.tsx         # Root component
│       │   └── main.tsx        # Entry point
│       ├── public/             # Static assets
│       ├── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       └── vite.config.ts
│
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│
├── package.json                # Root package.json (workspaces)
├── Procfile                    # Heroku deployment
├── SPECIFICATION.md
└── README.md
```

---

## 4. Data Models

### 4.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                           User                               │
├─────────────────────────────────────────────────────────────┤
│ PK  id              UUID                                     │
│     name            VARCHAR(100)                             │
│ UK  email           VARCHAR(120)                             │
│     password        VARCHAR(60)    [bcrypt hash, nullable]   │
│     isAdmin         BOOLEAN        [default: false]          │
│     isConfirmed     BOOLEAN        [default: false]          │
│     confirmedAt     TIMESTAMP                                │
│     createdAt       TIMESTAMP      [default: now()]          │
│     updatedAt       TIMESTAMP      [auto-update]             │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ 1:N               │ 1:N               │ 1:N
         ▼                    ▼                    ▼
┌─────────────────┐  ┌────────────────┐  ┌─────────────────────┐
│  TravelRecord   │  │     OAuth      │  │   SupportTicket     │
├─────────────────┤  ├────────────────┤  ├─────────────────────┤
│ PK id (UUID)    │  │ PK id (UUID)   │  │ PK id (UUID)        │
│ FK userId       │  │    provider    │  │ UK referenceId      │
│    countryCode  │  │    providerId  │  │    name             │
│    date         │  │ FK userId      │  │    email            │
│    createdAt    │  │    token(JSON) │  │    subject          │
│    updatedAt    │  │    createdAt   │  │    category         │
├─────────────────┤  │    updatedAt   │  │    message          │
│ IDX (userId,    │  ├────────────────┤  │ FK userId (opt)     │
│      date)      │  │ UK (provider,  │  │    status           │
│ UK  (userId,    │  │     providerId)│  │    notes            │
│      date,      │  └────────────────┘  │    createdAt        │
│      country    │                      │    updatedAt        │
│      Code)      │                      └─────────────────────┘
└─────────────────┘
```

### 4.2 Prisma Schema

```prisma
// packages/api/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  name          String    @db.VarChar(100)
  email         String    @unique @db.VarChar(120)
  password      String?   @db.VarChar(60)
  isAdmin       Boolean   @default(false)
  isConfirmed   Boolean   @default(false)
  confirmedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  travelRecords  TravelRecord[]
  oauthAccounts  OAuth[]
  supportTickets SupportTicket[]

  @@map("users")
}

model TravelRecord {
  id          String   @id @default(uuid())
  userId      String
  countryCode String   @db.VarChar(2)
  date        DateTime @db.Date
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date, countryCode])
  @@index([userId, date])
  @@map("travel_records")
}

model OAuth {
  id         String   @id @default(uuid())
  provider   String   @db.VarChar(50)
  providerId String   @db.VarChar(255)
  userId     String
  token      Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerId])
  @@map("oauth_accounts")
}

model SupportTicket {
  id          String   @id @default(uuid())
  referenceId String   @unique @db.VarChar(10)
  name        String   @db.VarChar(100)
  email       String   @db.VarChar(120)
  subject     String   @db.VarChar(200)
  category    String   @db.VarChar(20)
  message     String   @db.Text
  userId      String?
  status      String   @default("open") @db.VarChar(20)
  notes       String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("support_tickets")
}
```

### 4.3 Model Specifications

#### User Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| name | String(100) | NOT NULL | Display name |
| email | String(120) | UNIQUE, NOT NULL | Login identifier |
| password | String(60) | nullable | Bcrypt hash (null for OAuth-only) |
| isAdmin | Boolean | default=false | Admin privileges |
| isConfirmed | Boolean | default=false | Email verified |
| confirmedAt | DateTime | nullable | Confirmation timestamp |
| createdAt | DateTime | default=now() | Registration time |
| updatedAt | DateTime | auto-update | Last modification |

#### TravelRecord Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| userId | UUID | FK(User.id), NOT NULL, CASCADE | Owner reference |
| countryCode | String(2) | NOT NULL | ISO 3166-1 alpha-2 |
| date | Date | NOT NULL | Travel date |
| createdAt | DateTime | default=now() | Record creation time |
| updatedAt | DateTime | auto-update | Last modification |

**Indexes:**
- Composite: `(userId, date)` - fast date range queries
- Unique: `(userId, date, countryCode)` - prevent duplicates

#### OAuth Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| provider | String(50) | NOT NULL | google/facebook/apple |
| providerId | String(255) | NOT NULL | External user ID |
| userId | UUID | FK(User.id), NOT NULL, CASCADE | Local user reference |
| token | JSON | nullable | OAuth token data |

**Constraints:**
- Unique: `(provider, providerId)`

#### SupportTicket Model
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| referenceId | String(10) | UNIQUE | User-facing ticket ID |
| name | String(100) | NOT NULL | Submitter name |
| email | String(120) | NOT NULL | Contact email |
| subject | String(200) | NOT NULL | Ticket subject |
| category | String(20) | NOT NULL | general/account/bug/feature/billing/other |
| message | Text | NOT NULL | Ticket content |
| userId | UUID | FK, nullable, SET NULL | Linked user (if logged in) |
| status | String(20) | default='open' | open/in_progress/closed |
| notes | Text | nullable | Admin-only notes |
| createdAt | DateTime | default=now() | Submission time |
| updatedAt | DateTime | auto-update | Last modification |

### 4.4 Validation Schemas

All input validation uses Zod schemas. These schemas are shared between frontend and backend.

#### User Validation

```typescript
// packages/api/src/validators/user.ts
import { z } from 'zod';

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')
  .trim();

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(120, 'Email must be 120 characters or less')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or less') // bcrypt limit
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(), // Optional for OAuth-only users
  newPassword: passwordSchema,
});
```

#### Travel Record Validation

```typescript
// packages/api/src/validators/travelRecord.ts
import { z } from 'zod';
import { isValid, parseISO, isFuture, subYears } from 'date-fns';

// Valid ISO 3166-1 alpha-2 country codes (loaded from countries.json)
const VALID_COUNTRY_CODES = new Set([
  'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR',
  // ... all 249 codes (see Appendix E)
]);

export const countryCodeSchema = z
  .string()
  .length(2, 'Country code must be exactly 2 characters')
  .toUpperCase()
  .refine((code) => VALID_COUNTRY_CODES.has(code), {
    message: 'Invalid country code',
  });

export const dateSchema = z
  .string()
  .refine((str) => isValid(parseISO(str)), {
    message: 'Invalid date format. Use YYYY-MM-DD',
  })
  .refine((str) => !isFuture(parseISO(str)), {
    message: 'Cannot add travel records for future dates',
  })
  .refine((str) => parseISO(str) >= subYears(new Date(), 100), {
    message: 'Date cannot be more than 100 years in the past',
  });

export const createRecordSchema = z.object({
  date: dateSchema,
  countryCode: countryCodeSchema,
});

export const bulkUpdateSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
  countryCodes: z
    .array(countryCodeSchema)
    .min(1, 'At least one country is required')
    .max(10, 'Maximum 10 countries per bulk update'),
}).refine((data) => parseISO(data.startDate) <= parseISO(data.endDate), {
  message: 'Start date must be before or equal to end date',
  path: ['endDate'],
}).refine((data) => {
  const start = parseISO(data.startDate);
  const end = parseISO(data.endDate);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 365;
}, {
  message: 'Date range cannot exceed 365 days',
  path: ['endDate'],
});

export const dateRangeQuerySchema = z.object({
  start: dateSchema,
  end: dateSchema,
}).refine((data) => parseISO(data.start) <= parseISO(data.end), {
  message: 'Start date must be before or equal to end date',
});
```

#### Support Ticket Validation

```typescript
// packages/api/src/validators/support.ts
import { z } from 'zod';

export const supportCategorySchema = z.enum([
  'general',
  'account',
  'bug',
  'feature',
  'billing',
  'other',
]);

export const createTicketSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(120).toLowerCase().trim(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200).trim(),
  category: supportCategorySchema,
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000).trim(),
});

export const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'closed']).optional(),
  notes: z.string().max(5000).optional(),
});
```

#### Admin Validation

```typescript
// packages/api/src/validators/admin.ts
import { z } from 'zod';

export const adminUpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(120).optional(),
  isAdmin: z.boolean().optional(),
  isConfirmed: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
});
```

---

## 5. API Specification

### 5.1 Base URL

- **Development:** `http://localhost:3001/api/v1`
- **Production:** `https://countrycalendar.app/api/v1`

### 5.2 Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201 Created):
{
  "message": "Registration successful. Please check your email to confirm your account.",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200 OK):
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

#### OAuth Initiate
```
GET /auth/oauth/:provider
# provider: google | facebook | apple

Response: Redirect to OAuth provider
```

#### OAuth Callback
```
GET /auth/oauth/:provider/callback
POST /auth/oauth/apple/callback  # Apple uses POST

Response: Redirect to frontend with token
```

#### Confirm Email
```
GET /auth/confirm/:token

Response (200 OK):
{
  "message": "Email confirmed successfully"
}
```

#### Request Password Reset
```
POST /auth/reset-password
Content-Type: application/json

Request:
{
  "email": "john@example.com"
}

Response (200 OK):
{
  "message": "If an account exists, a reset email has been sent"
}
```

#### Reset Password
```
POST /auth/reset-password/:token
Content-Type: application/json

Request:
{
  "password": "newSecurePassword123"
}

Response (200 OK):
{
  "message": "Password reset successfully"
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Logged out successfully"
}
```

### 5.3 Travel Records Endpoints

All endpoints require authentication: `Authorization: Bearer <token>`

#### Create Record
```
POST /travel-records
Content-Type: application/json

Request:
{
  "date": "2024-01-15",
  "countryCode": "FR"
}

Response (201 Created):
{
  "id": "uuid",
  "date": "2024-01-15",
  "countryCode": "FR",
  "countryName": "France",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Delete Record
```
DELETE /travel-records/:id

Response (200 OK):
{
  "message": "Record deleted successfully"
}
```

#### Get Records by Date Range
```
GET /travel-records?start=2024-01-01&end=2024-01-31

Response (200 OK):
{
  "records": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "countryCode": "FR",
      "countryName": "France"
    }
  ],
  "total": 1
}
```

#### Bulk Update Records
```
POST /travel-records/bulk
Content-Type: application/json

Request:
{
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "countryCodes": ["FR", "DE"]
}

Response (200 OK):
{
  "message": "Records updated successfully",
  "created": 10,
  "deleted": 2
}
```

### 5.4 Reports Endpoints

#### Get Summary
```
GET /reports/summary?days=30

Response (200 OK):
{
  "totalDays": 15,
  "totalCountries": 5,
  "topCountries": [
    { "code": "FR", "name": "France", "days": 7 },
    { "code": "DE", "name": "Germany", "days": 5 }
  ],
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

#### Export Data
```
GET /reports/export?format=csv&start=2024-01-01&end=2024-12-31
# format: csv | xlsx

Response: File download (streaming)
```

### 5.5 Countries Endpoint

```
GET /countries

Response (200 OK):
{
  "countries": [
    { "code": "AF", "name": "Afghanistan", "color": "#d4a59a" },
    { "code": "AL", "name": "Albania", "color": "#e6b9b8" }
  ]
}
```

### 5.6 Profile Endpoints

#### Get Profile
```
GET /profile

Response (200 OK):
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "stats": {
    "totalCountries": 25,
    "totalDays": 150
  },
  "oauthProviders": ["google"]
}
```

#### Update Profile
```
PATCH /profile
Content-Type: application/json

Request:
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}

Response (200 OK):
{
  "id": "uuid",
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Change Password
```
POST /profile/change-password
Content-Type: application/json

Request:
{
  "currentPassword": "oldPassword",  // Optional for OAuth-only users
  "newPassword": "newSecurePassword123"
}

Response (200 OK):
{
  "message": "Password changed successfully"
}
```

#### Delete Account
```
DELETE /profile
Content-Type: application/json

Request:
{
  "confirmation": "DELETE"
}

Response (200 OK):
{
  "message": "Account deleted successfully"
}
```

#### Disconnect OAuth Provider
```
DELETE /profile/oauth/:provider

Response (200 OK):
{
  "message": "OAuth provider disconnected"
}
```

### 5.7 Support Endpoints

#### Create Ticket
```
POST /support
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Cannot export data",
  "category": "bug",
  "message": "When I try to export..."
}

Response (201 Created):
{
  "referenceId": "TKT-A1B2C3",
  "message": "Support ticket created successfully"
}
```

### 5.8 Admin Endpoints

All endpoints require admin authentication.

#### List Users
```
GET /admin/users?page=1&limit=20&search=john

Response (200 OK):
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Get User
```
GET /admin/users/:id

Response (200 OK):
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "isConfirmed": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "stats": {
    "totalRecords": 150,
    "totalCountries": 25
  }
}
```

#### Update User
```
PATCH /admin/users/:id
Content-Type: application/json

Request:
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "isAdmin": true
}

Response (200 OK):
{
  "id": "uuid",
  "name": "John Smith",
  ...
}
```

#### Delete User
```
DELETE /admin/users/:id

Response (200 OK):
{
  "message": "User deleted successfully"
}
```

#### Get System Stats
```
GET /admin/stats

Response (200 OK):
{
  "totalUsers": 1000,
  "totalRecords": 50000,
  "activeUsers30Days": 250,
  "openTickets": 5
}
```

#### List Support Tickets
```
GET /admin/support?status=open&page=1&limit=20

Response (200 OK):
{
  "tickets": [...],
  "pagination": {...}
}
```

#### Update Ticket
```
PATCH /admin/support/:referenceId
Content-Type: application/json

Request:
{
  "status": "in_progress",
  "notes": "Investigating the issue"
}

Response (200 OK):
{
  "referenceId": "TKT-A1B2C3",
  "status": "in_progress",
  ...
}
```

#### Delete Ticket
```
DELETE /admin/support/:referenceId

Response (200 OK):
{
  "message": "Ticket deleted successfully"
}
```

### 5.9 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid country code",
    "details": [
      {
        "field": "countryCode",
        "message": "Must be a valid ISO 3166-1 alpha-2 code"
      }
    ]
  }
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

### 5.10 Business Rules

This section defines the core business logic and rules that govern application behavior.

#### 5.10.1 User Account Rules

| Rule | Description |
|------|-------------|
| **Email Uniqueness** | Email addresses must be unique across all users (case-insensitive) |
| **Email Confirmation Required** | Users must confirm their email before accessing protected features |
| **Unconfirmed Login** | Unconfirmed users can log in but see a banner prompting email confirmation. Full access granted after confirmation |
| **Password for OAuth Users** | OAuth-only users have `password = null`. They can set a password via "Change Password" without providing current password |
| **OAuth Account Linking** | If a user registers with email/password, then later uses OAuth with same email, accounts are linked automatically |
| **OAuth Unlinking** | Users can unlink OAuth providers only if they have a password set OR another OAuth provider linked |
| **Account Deletion** | Immediate hard delete of user and all associated data (travel records, OAuth links, support tickets) |
| **Admin Self-Demotion** | Admins cannot remove their own admin status |
| **Last Admin Protection** | System must have at least one admin user at all times |

#### 5.10.2 Travel Record Rules

| Rule | Description |
|------|-------------|
| **No Future Dates** | Travel records cannot be created for dates in the future |
| **Historical Limit** | Travel records cannot be created for dates more than 100 years in the past |
| **Multiple Countries Per Day** | Users can record multiple countries for the same date (e.g., border crossing) |
| **Unique Constraint** | Same user + date + country combination cannot exist twice |
| **Bulk Update Limit** | Maximum date range for bulk updates is 365 days |
| **Bulk Update Behavior** | Bulk update replaces all records in the date range with new countries |
| **Countries Per Day Limit** | Maximum 10 different countries can be recorded for a single date |
| **Record Ownership** | Users can only view/edit/delete their own travel records |

#### 5.10.3 Report & Export Rules

| Rule | Description |
|------|-------------|
| **Days Calculation** | "Total days" counts unique dates with at least one travel record |
| **Countries Calculation** | "Total countries" counts unique country codes across all records |
| **Export Date Range** | Maximum export range is 10 years of data |
| **Export Rate Limit** | Maximum 5 exports per hour per user |
| **Summary Periods** | Supported periods: 7 days, 30 days, 90 days, 365 days, custom range |
| **Custom Range Limit** | Custom date ranges cannot exceed 5 years |

#### 5.10.4 Authentication Rules

| Rule | Description |
|------|-------------|
| **Login Attempts** | After 5 failed login attempts, account is locked for 15 minutes |
| **Password Reset** | Reset tokens expire after 1 hour |
| **Email Confirmation** | Confirmation tokens expire after 48 hours |
| **Session Duration** | Access token: 15 minutes, Refresh token: 7 days |
| **Concurrent Sessions** | Unlimited concurrent sessions allowed |
| **Token Refresh** | Refresh tokens are rotated on each use (one-time use) |
| **Logout** | Logout invalidates the current refresh token only |
| **Logout All** | "Logout all devices" invalidates all refresh tokens for the user |

#### 5.10.5 Support Ticket Rules

| Rule | Description |
|------|-------------|
| **Reference ID Format** | 8-character uppercase alphanumeric (e.g., `TKT-A1B2C3D4`) |
| **Anonymous Tickets** | Support tickets can be created without logging in |
| **Logged-in Linking** | If user is logged in, ticket is automatically linked to their account |
| **Status Transitions** | open → in_progress → closed (no reverse transitions via API) |
| **Ticket Viewing** | Users can only view tickets they created (by email match or user_id) |
| **Admin Notes** | Admin notes are never visible to the ticket creator |

#### 5.10.6 Admin Rules

| Rule | Description |
|------|-------------|
| **Admin Access** | Only users with `isAdmin = true` can access admin endpoints |
| **User Deletion** | Admins can delete any user except themselves |
| **Admin Promotion** | Any admin can promote/demote other users |
| **Activity Definition** | "Active user" = user with at least one login in the specified period |
| **Audit Logging** | All admin actions are logged with timestamp, admin ID, action, and target |

#### 5.10.7 Data Retention

| Data Type | Retention |
|-----------|-----------|
| User accounts | Until deleted by user or admin |
| Travel records | Until deleted by user or cascaded on account deletion |
| Support tickets | 2 years after closure, then anonymized |
| Audit logs | 5 years |
| Session tokens | Until expiry or logout |

### 5.11 User Feedback Messages

Standard messages displayed to users for common operations.

#### Success Messages

| Operation | Message |
|-----------|---------|
| Registration | "Registration successful! Please check your email to confirm your account." |
| Email Confirmed | "Your email has been confirmed. You can now access all features." |
| Login | (No message, redirect to dashboard) |
| Logout | "You have been logged out successfully." |
| Password Reset Request | "If an account exists with this email, you will receive a password reset link." |
| Password Reset Complete | "Your password has been reset. Please log in with your new password." |
| Password Changed | "Your password has been changed successfully." |
| Profile Updated | "Your profile has been updated." |
| Travel Record Added | (No message, optimistic UI update) |
| Travel Record Deleted | (No message, optimistic UI update) |
| Bulk Update Complete | "Travel records updated for {X} days." |
| Export Started | "Your export is being prepared. Download will start automatically." |
| Support Ticket Created | "Your support request has been submitted. Reference: {REF_ID}" |
| Account Deleted | "Your account has been deleted. We're sorry to see you go." |
| OAuth Connected | "{Provider} account connected successfully." |
| OAuth Disconnected | "{Provider} account disconnected." |

#### Error Messages

| Error Code | User Message |
|------------|--------------|
| AUTH_INVALID_CREDENTIALS | "Invalid email or password. Please try again." |
| AUTH_EMAIL_NOT_CONFIRMED | "Please confirm your email address before logging in. Check your inbox for the confirmation link." |
| AUTH_TOKEN_EXPIRED | "Your session has expired. Please log in again." |
| AUTH_TOKEN_INVALID | "Invalid session. Please log in again." |
| AUTH_OAUTH_FAILED | "Unable to sign in with {Provider}. Please try again or use another method." |
| AUTH_ACCOUNT_LOCKED | "Too many login attempts. Please try again in 15 minutes." |
| USER_NOT_FOUND | "No account found with this email address." |
| USER_EMAIL_EXISTS | "An account with this email already exists. Try logging in instead." |
| RECORD_NOT_FOUND | "Travel record not found." |
| RECORD_EXISTS | "You've already recorded this country for this date." |
| VALIDATION_FAILED | "Please check your input and try again." |
| RATE_LIMIT_EXCEEDED | "Too many requests. Please wait a moment and try again." |
| INTERNAL_ERROR | "Something went wrong. Please try again later." |
| OAUTH_UNLINK_BLOCKED | "Cannot disconnect this account. You need a password or another sign-in method first." |
| FUTURE_DATE | "Cannot add travel records for future dates." |
| INVALID_DATE_RANGE | "Start date must be before end date." |
| EXPORT_RANGE_EXCEEDED | "Export date range cannot exceed 10 years." |

---

## 6. Authentication System

### 6.1 Authentication Methods

| Method | Flow | Token Expiry |
|--------|------|--------------|
| Email/Password | Register -> Email Confirm -> Login | Access: 15min, Refresh: 7days |
| Google OAuth | Redirect -> Consent -> Callback -> Login | Access: 15min, Refresh: 7days |
| Facebook OAuth | Redirect -> Consent -> Callback -> Login | Access: 15min, Refresh: 7days |
| Apple Sign In | Redirect -> Apple UI -> POST Callback -> Login | Access: 15min, Refresh: 7days |
| Password Reset | Request -> Email -> Token Verify -> Reset | Token: 1hr |
| Email Confirm | Registration -> Email -> Token Verify | Token: 48hr |

### 6.2 JWT Token Structure

**Access Token:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "isAdmin": false,
  "type": "access",
  "iat": 1704067200,
  "exp": 1704068100
}
```

**Refresh Token:**
```json
{
  "sub": "user-uuid",
  "type": "refresh",
  "iat": 1704067200,
  "exp": 1704672000
}
```

### 6.3 OAuth Flow

```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│  User  │────>│ Frontend│────>│  Backend │────>│ Provider │
└────────┘     └─────────┘     └──────────┘     └──────────┘
    │               │               │               │
    │ Click OAuth   │ Redirect to   │ Generate      │
    │ button        │ /auth/oauth/  │ state token   │
    │               │ :provider     │ Redirect to   │
    │               │               │ provider      │
    │               │               │               │
    │               │               │ Callback with │
    │               │               │ code + state  │
    │               │               │               │
    │               │  Redirect to  │ Verify state  │
    │               │  frontend     │ Exchange code │
    │               │  with tokens  │ Create/login  │
    │               │               │ user          │
```

### 6.4 Security Measures

| Feature | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with 12 rounds |
| Token Storage | Access in memory, Refresh in httpOnly cookie |
| CSRF Protection | State tokens for OAuth, CSRF tokens for forms |
| XSS Prevention | Content-Security-Policy headers |
| Rate Limiting | express-rate-limit with Redis store |
| Input Validation | Zod schemas on all endpoints |
| SQL Injection | Prisma ORM parameterized queries |

---

## 7. Rate Limiting

### 7.1 Rate Limit Configuration

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| Global | 100 requests | 15 minutes | General protection |
| POST /auth/register | 3 requests | 1 hour | Prevent spam accounts |
| POST /auth/login | 5 requests | 1 minute | Brute force protection |
| POST /auth/reset-password | 3 requests | 1 hour | Email flood protection |
| GET /auth/oauth/* | 10 requests | 1 minute | OAuth abuse prevention |
| POST /travel-records | 60 requests | 1 minute | API abuse prevention |
| GET /reports/export | 5 requests | 1 hour | Export abuse prevention |

### 7.2 Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
Retry-After: 60
```

---

## 8. Frontend Architecture

### 8.1 Component Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx           # Mobile slide-out panels
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Header.tsx          # Responsive navbar
│   │   ├── MobileNav.tsx       # Bottom navigation (mobile)
│   │   ├── Sidebar.tsx         # Desktop sidebar
│   │   ├── Footer.tsx
│   │   └── Layout.tsx          # Main layout wrapper
│   │
│   └── features/
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── OAuthButtons.tsx
│       │   └── PasswordReset.tsx
│       │
│       ├── calendar/
│       │   ├── Calendar.tsx
│       │   ├── DayCell.tsx
│       │   ├── CountryPicker.tsx
│       │   └── DateRangePicker.tsx
│       │
│       ├── reports/
│       │   ├── ReportsSummary.tsx
│       │   ├── CountryStats.tsx
│       │   └── ExportOptions.tsx
│       │
│       ├── profile/
│       │   ├── ProfileView.tsx
│       │   ├── ProfileEdit.tsx
│       │   └── SecuritySettings.tsx
│       │
│       └── admin/
│           ├── UserList.tsx
│           ├── UserEdit.tsx
│           ├── TicketList.tsx
│           └── SystemStats.tsx
│
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Calendar.tsx
│   ├── Reports.tsx
│   ├── Profile.tsx
│   ├── Support.tsx
│   ├── Admin.tsx
│   └── NotFound.tsx
│
├── hooks/
│   ├── useAuth.ts              # Authentication hook
│   ├── useTravelRecords.ts     # Travel records CRUD
│   ├── useCountries.ts         # Countries data
│   ├── useReports.ts           # Reports data
│   └── useMediaQuery.ts        # Responsive helpers
│
├── stores/
│   ├── authStore.ts            # Auth state (Zustand)
│   ├── calendarStore.ts        # Calendar UI state
│   └── uiStore.ts              # Global UI state
│
├── services/
│   ├── api.ts                  # Axios instance with interceptors
│   ├── authService.ts          # Auth API calls
│   ├── travelService.ts        # Travel records API
│   ├── reportService.ts        # Reports API
│   └── adminService.ts         # Admin API
│
└── lib/
    ├── utils.ts                # Utility functions (cn, etc.)
    ├── validators.ts           # Zod schemas
    └── constants.ts            # App constants
```

### 8.2 Mobile-First Design

#### Breakpoints (Tailwind)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
    }
  }
}
```

#### Mobile Navigation Pattern
```
┌─────────────────────────────────────┐
│  Header (Logo + Hamburger Menu)     │  <- Mobile: hamburger
├─────────────────────────────────────┤     Desktop: full nav
│                                     │
│         Main Content Area           │
│                                     │
│   (Scrollable, touch-optimized)     │
│                                     │
├─────────────────────────────────────┤
│  ☐ Home  ☐ Calendar  ☐ Reports  ☐   │  <- Mobile bottom nav
└─────────────────────────────────────┘     Desktop: hidden
```

#### Touch Target Sizes
- Minimum touch target: 44x44 pixels
- Spacing between interactive elements: 8px minimum
- Bottom navigation icons: 48x48 pixels

### 8.3 Mobile App Wrapper Considerations

The web app is designed to work within a React Native WebView wrapper:

| Feature | Web Implementation | Mobile App Notes |
|---------|-------------------|------------------|
| Navigation | React Router | Deep linking support via URL schemes |
| Auth State | localStorage + cookies | Shared with WebView |
| Push Notifications | Not applicable | Native implementation in wrapper |
| Offline Mode | Service Worker (PWA) | WebView cache + native storage |
| Camera Access | Not used | Can be added via native bridge |
| Location | Not used | Can be added via native bridge |
| Pull-to-Refresh | CSS overscroll-behavior | Native gesture handling |
| Safe Areas | CSS env() variables | Automatic in WebView |

#### WebView Communication Bridge
```typescript
// For future mobile app integration
interface MobileBridge {
  // Called by native app
  onAuthStateChange(token: string): void;
  onPushNotification(payload: object): void;

  // Called by web app
  requestPushPermission(): Promise<boolean>;
  shareContent(data: ShareData): Promise<void>;
  hapticFeedback(type: 'light' | 'medium' | 'heavy'): void;
}

declare global {
  interface Window {
    MobileBridge?: MobileBridge;
  }
}
```

### 8.4 State Management

#### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
}
```

#### Calendar Store
```typescript
interface CalendarState {
  selectedDate: Date;
  selectedCountries: string[];
  viewMode: 'month' | 'week' | 'day';

  setSelectedDate: (date: Date) => void;
  toggleCountry: (code: string) => void;
  setViewMode: (mode: ViewMode) => void;
}
```

### 8.5 UI/UX Specifications

#### 8.5.1 Calendar Interactions

**Single Date Selection:**
1. User clicks on a calendar day
2. Country picker modal/sheet opens
3. User selects one or more countries from searchable list
4. Countries are saved immediately (optimistic update)
5. Day cell shows colored indicators for selected countries

**Date Range Selection (Bulk Update):**
1. User clicks "Select Range" button or long-presses a date
2. User clicks start date, then end date (highlighted selection)
3. Country picker opens with multi-select enabled
4. User selects countries to apply to all dates
5. Confirmation dialog: "Add {countries} to {X} days?"
6. On confirm, bulk update executes with loading indicator

**Visual Indicators:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Day Cell Design                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐                                                    │
│  │   15    │  <- Day number (top-left)                         │
│  │  🟦🟩   │  <- Country color dots (max 3 visible)            │
│  │   +2    │  <- Overflow indicator if >3 countries            │
│  └─────────┘                                                    │
│                                                                  │
│  States:                                                         │
│  - Default: White background                                    │
│  - Today: Blue border                                           │
│  - Selected: Blue background                                    │
│  - Has records: Country color dots                              │
│  - Future: Grayed out, not clickable                            │
│  - Outside month: Lighter text color                            │
└─────────────────────────────────────────────────────────────────┘
```

**Country Picker Modal:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Country Picker                                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  🔍 Search countries...                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Recent (if available):                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ 🇫🇷 France │ │ 🇩🇪 Germany│ │ 🇪🇸 Spain  │                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
│                                                                  │
│  All Countries:                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ □ 🇦🇫 Afghanistan                                           ││
│  │ □ 🇦🇱 Albania                                               ││
│  │ ☑ 🇫🇷 France (selected)                                     ││
│  │ ...                                                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │           [Clear]    [Save]                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### 8.5.2 Form Interactions

**Loading States:**
| Component | Loading Behavior |
|-----------|-----------------|
| Buttons | Show spinner, disable click, maintain width |
| Forms | Disable all inputs, show overlay spinner |
| Lists | Show skeleton placeholders |
| Calendar | Show skeleton grid |
| Charts | Show pulsing placeholder |

**Error Display:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Field-Level Errors                                              │
├─────────────────────────────────────────────────────────────────┤
│  Email                                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  invalid-email                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│  ⚠️ Invalid email address                    <- Red text below  │
│                                                                  │
│  Form-Level Errors (toast):                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ❌ Unable to save. Please try again.              [×]      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Form Submission Flow:**
1. User fills form
2. Client-side validation on blur and submit
3. If invalid, show field errors immediately
4. If valid, show button loading state
5. On API success, show success toast/message
6. On API error, show error toast, re-enable form
7. On network error, show retry option

#### 8.5.3 Toast Notifications

| Type | Duration | Position | Dismissible |
|------|----------|----------|-------------|
| Success | 3 seconds | Top-right (desktop), Top (mobile) | Yes |
| Error | 5 seconds | Top-right (desktop), Top (mobile) | Yes |
| Warning | 5 seconds | Top-right (desktop), Top (mobile) | Yes |
| Info | 4 seconds | Top-right (desktop), Top (mobile) | Yes |
| Loading | Until resolved | Top-right (desktop), Top (mobile) | No |

#### 8.5.4 Modal/Dialog Patterns

**Confirmation Dialogs (Destructive Actions):**
```
┌─────────────────────────────────────────────────────────────────┐
│                        Delete Account?                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  This will permanently delete your account and all travel       │
│  records. This action cannot be undone.                         │
│                                                                  │
│  Type "DELETE" to confirm:                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│                              [Cancel]    [Delete Account]        │
│                                          (red, disabled until    │
│                                           "DELETE" typed)        │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile Sheets (Bottom):**
- Used for: Country picker, date picker, filters, menus
- Swipe down to dismiss
- Backdrop click to dismiss
- Maximum height: 90% of viewport

#### 8.5.5 Responsive Behavior

| Breakpoint | Navigation | Calendar View | Sidebar |
|------------|------------|---------------|---------|
| < 640px (mobile) | Bottom nav | Month (compact) | Hidden |
| 640-768px (tablet portrait) | Bottom nav | Month | Hidden |
| 768-1024px (tablet landscape) | Top nav | Month | Collapsible |
| > 1024px (desktop) | Top nav + sidebar | Month/Week/Day | Always visible |

**Calendar Responsive Adaptations:**
- **Mobile**: Day names abbreviated (M, T, W...), smaller touch targets
- **Tablet**: Full day names, comfortable touch targets
- **Desktop**: Full day names, hover states, keyboard navigation

#### 8.5.6 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | All interactive elements focusable via Tab |
| Focus Indicators | Visible focus rings on all focusable elements |
| Screen Reader | ARIA labels on icons, live regions for updates |
| Color Contrast | Minimum 4.5:1 for text, 3:1 for UI elements |
| Motion | Respect `prefers-reduced-motion` media query |
| Font Scaling | Support up to 200% text zoom |

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `←` / `→` | Navigate calendar days |
| `↑` / `↓` | Navigate calendar weeks |
| `Enter` / `Space` | Select date, open picker |
| `Escape` | Close modal/picker |
| `Tab` | Move focus forward |
| `Shift+Tab` | Move focus backward |

#### 8.5.7 Empty States

| Screen | Empty State Message | Action |
|--------|---------------------|--------|
| Dashboard (new user) | "Welcome! Start tracking your travels by adding your first country." | [Add First Record] button |
| Calendar (no records) | "No travel records for this month." | Click any date to add |
| Reports (no data) | "No travel data to display. Add some records first!" | [Go to Calendar] button |
| Search (no results) | "No countries match your search." | Clear search button |

#### 8.5.8 Color Scheme

**Light Mode:**
```css
--background: #ffffff;
--foreground: #0f172a;
--primary: #3b82f6;
--primary-foreground: #ffffff;
--secondary: #f1f5f9;
--accent: #f97316;
--destructive: #ef4444;
--success: #22c55e;
--warning: #eab308;
--muted: #64748b;
--border: #e2e8f0;
```

**Dark Mode:**
```css
--background: #0f172a;
--foreground: #f8fafc;
--primary: #60a5fa;
--primary-foreground: #0f172a;
--secondary: #1e293b;
--accent: #fb923c;
--destructive: #f87171;
--success: #4ade80;
--warning: #facc15;
--muted: #94a3b8;
--border: #334155;
```

---

## 9. Development Environment

### 9.1 Docker Configuration

#### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: docker/Dockerfile.api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/ccalendar
      - JWT_SECRET=dev-secret-key
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./packages/api:/app
      - /app/node_modules
    depends_on:
      - db
      - redis
    command: npm run dev

  web:
    build:
      context: .
      dockerfile: docker/Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:3001/api/v1
    volumes:
      - ./packages/web:/app
      - /app/node_modules
    command: npm run dev

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=ccalendar
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
  redis_data:
```

#### Dockerfile.api
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY packages/api/package*.json ./

RUN npm ci

COPY packages/api .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
```

#### Dockerfile.web
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY packages/web/package*.json ./

RUN npm ci

COPY packages/web .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 9.2 Development Commands

```bash
# Start all services
docker compose up

# Start specific service
docker compose up api

# Rebuild containers
docker compose up --build

# Run database migrations
docker compose exec api npx prisma migrate dev

# Generate Prisma client
docker compose exec api npx prisma generate

# Open Prisma Studio
docker compose exec api npx prisma studio

# Run API tests
docker compose exec api npm test

# Run frontend tests
docker compose exec web npm test

# Lint code
docker compose exec api npm run lint
docker compose exec web npm run lint

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

### 9.3 Environment Variables

#### Development (.env.development)
```bash
# API
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@db:5432/ccalendar
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
REDIS_URL=redis://redis:6379

# OAuth (use test credentials)
GOOGLE_CLIENT_ID=test-google-client-id
GOOGLE_CLIENT_SECRET=test-google-client-secret
FACEBOOK_CLIENT_ID=test-facebook-client-id
FACEBOOK_CLIENT_SECRET=test-facebook-client-secret
APPLE_CLIENT_ID=test-apple-client-id
APPLE_TEAM_ID=test-team-id
APPLE_KEY_ID=test-key-id
APPLE_PRIVATE_KEY=test-private-key

# Email (use Mailgun sandbox or Mailtrap)
MAILGUN_API_KEY=test-mailgun-key
MAILGUN_DOMAIN=sandbox.mailgun.org

# Frontend
VITE_API_URL=http://localhost:3001/api/v1
```

---

## 10. Production Deployment

### 10.1 Heroku Configuration

#### Procfile
```
web: cd packages/api && npm start
```

#### app.json
```json
{
  "name": "Country Calendar",
  "description": "Track your travel history",
  "repository": "https://github.com/gaidar/ccalendar",
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ],
  "addons": [
    {
      "plan": "heroku-postgresql:essential-0"
    },
    {
      "plan": "heroku-redis:mini"
    }
  ],
  "env": {
    "NODE_ENV": {
      "value": "production"
    },
    "JWT_SECRET": {
      "generator": "secret"
    },
    "JWT_REFRESH_SECRET": {
      "generator": "secret"
    }
  }
}
```

### 10.2 Production Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | production |
| `DATABASE_URL` | Heroku Postgres connection string |
| `REDIS_URL` | Heroku Redis connection string |
| `JWT_SECRET` | Production JWT signing key |
| `JWT_REFRESH_SECRET` | Production refresh token key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth client ID |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth secret |
| `APPLE_CLIENT_ID` | Apple Sign In client ID |
| `APPLE_TEAM_ID` | Apple team ID |
| `APPLE_KEY_ID` | Apple key ID |
| `APPLE_PRIVATE_KEY` | Apple .p8 key contents |
| `MAILGUN_API_KEY` | Mailgun API key |
| `MAILGUN_DOMAIN` | Mailgun domain |
| `FRONTEND_URL` | https://countrycalendar.app |

### 10.3 Deployment Process

```bash
# 1. Build frontend
cd packages/web
npm run build

# 2. Copy build to API static folder
cp -r dist ../api/public

# 3. Deploy to Heroku
git push heroku main

# 4. Run migrations
heroku run "cd packages/api && npx prisma migrate deploy"

# 5. Verify deployment
heroku logs --tail
```

### 10.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: countrycalendar
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## 11. Testing

### 11.1 API Testing

```
packages/api/
├── tests/
│   ├── setup.ts                # Test configuration
│   ├── fixtures/               # Test data factories
│   │   ├── userFactory.ts
│   │   └── travelRecordFactory.ts
│   ├── unit/
│   │   ├── services/
│   │   │   ├── authService.test.ts
│   │   │   └── travelService.test.ts
│   │   └── utils/
│   │       └── validators.test.ts
│   └── integration/
│       ├── auth.test.ts
│       ├── travelRecords.test.ts
│       └── admin.test.ts
```

#### Test Configuration
```typescript
// packages/api/tests/setup.ts
import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, beforeEach } from 'vitest';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.travelRecord.deleteMany();
  await prisma.oauth.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.user.deleteMany();
});
```

### 11.2 Frontend Testing

```
packages/web/
├── tests/
│   ├── setup.ts
│   ├── components/
│   │   ├── LoginForm.test.tsx
│   │   └── Calendar.test.tsx
│   ├── hooks/
│   │   └── useAuth.test.ts
│   └── pages/
│       ├── Dashboard.test.tsx
│       └── Reports.test.tsx
```

#### Test Tools
| Tool | Purpose |
|------|---------|
| Vitest | Test runner (API + Frontend) |
| Testing Library | React component testing |
| MSW | API mocking |
| Playwright | E2E testing |

### 11.3 Test Cases

#### 11.3.1 Authentication Tests

**Registration:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid registration | Valid name, email, password | 201, user created, confirmation email sent |
| Duplicate email | Existing email | 409 USER_EMAIL_EXISTS |
| Invalid email format | "notanemail" | 400 VALIDATION_FAILED |
| Weak password | "123" | 400 VALIDATION_FAILED (password rules) |
| Empty name | "" | 400 VALIDATION_FAILED |
| SQL injection attempt | "'; DROP TABLE users;--" | 400 VALIDATION_FAILED |

**Login:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid credentials | Correct email/password | 200, JWT tokens returned |
| Wrong password | Correct email, wrong password | 401 AUTH_INVALID_CREDENTIALS |
| Non-existent user | Unknown email | 401 AUTH_INVALID_CREDENTIALS |
| Unconfirmed email | Valid but unconfirmed user | 401 AUTH_EMAIL_NOT_CONFIRMED |
| Account locked | >5 failed attempts | 429 AUTH_ACCOUNT_LOCKED |
| Case-insensitive email | "User@Example.COM" | 200 (matches "user@example.com") |

**OAuth:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid OAuth login | Valid provider token | 200, user logged in or created |
| Invalid state token | Tampered state | 401 AUTH_OAUTH_FAILED |
| Provider error | Provider returns error | 401 AUTH_OAUTH_FAILED |
| Link to existing account | OAuth email matches existing | 200, accounts linked |

**Password Reset:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid email | Existing user email | 200, email sent |
| Non-existent email | Unknown email | 200 (same response, no email sent) |
| Valid reset token | Valid token + new password | 200, password changed |
| Expired token | 2-hour old token | 401 AUTH_TOKEN_EXPIRED |
| Used token | Previously used token | 401 AUTH_TOKEN_INVALID |

#### 11.3.2 Travel Record Tests

**Create Record:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid record | Today's date, valid country | 201, record created |
| Future date | Tomorrow's date | 400 VALIDATION_FAILED |
| Invalid country code | "XX" | 400 VALIDATION_FAILED |
| Duplicate record | Same date + country as existing | 409 RECORD_EXISTS |
| Past date (valid) | Yesterday | 201, record created |
| Very old date | 200 years ago | 400 VALIDATION_FAILED |
| Multiple countries same day | Different country, same date | 201, record created |

**Delete Record:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Own record | User's own record ID | 200, deleted |
| Other user's record | Different user's record ID | 403 FORBIDDEN |
| Non-existent record | Invalid UUID | 404 RECORD_NOT_FOUND |

**Bulk Update:**
| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid bulk update | 7 days, 2 countries | 200, records created |
| Too many days | 400 days | 400 VALIDATION_FAILED |
| Too many countries | 15 countries | 400 VALIDATION_FAILED |
| End before start | start > end date | 400 VALIDATION_FAILED |
| Overlapping dates | Existing records in range | 200, old deleted, new created |

#### 11.3.3 Report Tests

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Summary 30 days | period=30 | 200, correct summary |
| Summary with no data | User with no records | 200, zeros |
| Custom date range | Valid start/end | 200, correct summary |
| Export CSV | format=csv | 200, valid CSV file |
| Export XLSX | format=xlsx | 200, valid Excel file |
| Export too large range | 15 years | 400 VALIDATION_FAILED |
| Export empty data | No records | 200, file with headers only |

#### 11.3.4 Admin Tests

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| List users as admin | Admin token | 200, paginated list |
| List users as non-admin | Regular user token | 403 FORBIDDEN |
| Update user | Valid user ID + changes | 200, user updated |
| Delete user | Valid user ID | 200, user deleted |
| Delete self | Own user ID | 400 (cannot delete self) |
| Demote last admin | Last admin's ID | 400 (must have one admin) |
| Search users | search=john | 200, filtered results |

#### 11.3.5 E2E Test Scenarios

**Critical User Journeys:**

1. **New User Registration Flow**
   - Visit landing page
   - Click "Sign Up"
   - Fill registration form
   - Submit and see confirmation message
   - Check email (use Mailgun test mode)
   - Click confirmation link
   - Verify redirect to dashboard

2. **Add Travel Record Flow**
   - Login as existing user
   - Navigate to calendar
   - Click on a date
   - Select country from picker
   - Verify country appears on calendar
   - Refresh page, verify persistence

3. **Bulk Update Flow**
   - Login as existing user
   - Navigate to calendar
   - Select date range
   - Choose multiple countries
   - Confirm bulk update
   - Verify all dates show countries

4. **Export Data Flow**
   - Login as user with records
   - Navigate to reports
   - Select date range
   - Click export CSV
   - Verify file downloads
   - Verify file contents

5. **Password Reset Flow**
   - Visit login page
   - Click "Forgot Password"
   - Enter email
   - Check email for link
   - Click link, enter new password
   - Login with new password

6. **OAuth Login Flow**
   - Visit landing page
   - Click "Sign in with Google"
   - Complete OAuth consent (mocked)
   - Verify redirect to dashboard
   - Verify user profile

#### 11.3.6 Test Data Factories

```typescript
// packages/api/tests/fixtures/userFactory.ts
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const createUser = async (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: await bcrypt.hash('TestPassword123', 12),
  isAdmin: false,
  isConfirmed: true,
  confirmedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createUnconfirmedUser = () => createUser({
  isConfirmed: false,
  confirmedAt: null,
});

export const createAdminUser = () => createUser({
  isAdmin: true,
});

export const createOAuthOnlyUser = () => createUser({
  password: null,
});
```

```typescript
// packages/api/tests/fixtures/travelRecordFactory.ts
import { faker } from '@faker-js/faker';
import { subDays } from 'date-fns';

const COUNTRY_CODES = ['US', 'FR', 'DE', 'JP', 'GB', 'IT', 'ES', 'CA', 'AU', 'BR'];

export const createTravelRecord = (userId: string, overrides = {}) => ({
  id: faker.string.uuid(),
  userId,
  countryCode: faker.helpers.arrayElement(COUNTRY_CODES),
  date: faker.date.recent({ days: 30 }),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTravelRecordsForDateRange = (
  userId: string,
  startDate: Date,
  days: number,
  countryCodes: string[]
) => {
  const records = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(startDate, -i);
    for (const countryCode of countryCodes) {
      records.push(createTravelRecord(userId, { date, countryCode }));
    }
  }
  return records;
};
```

---

## 12. Security

### 12.1 Security Checklist

- [x] Bcrypt password hashing (12 rounds)
- [x] JWT with short expiry (15 min access, 7 day refresh)
- [x] httpOnly cookies for refresh tokens
- [x] CSRF protection for state-changing operations
- [x] Rate limiting on all endpoints
- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma ORM)
- [x] XSS prevention (React escaping + CSP headers)
- [x] Secure headers (Helmet.js)
- [x] HTTPS enforcement in production
- [x] OAuth state parameter validation

### 12.2 Security Headers

```typescript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.countrycalendar.app"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

### 12.3 Database Safety Rules

- Never use raw SQL queries - always use Prisma
- Never store sensitive data unencrypted
- Always use parameterized queries
- Implement soft deletes for audit trails
- Regular backups with point-in-time recovery

---

## 13. Monitoring & Logging

### 13.1 Logging

```typescript
// Winston logger configuration
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

### 13.2 Metrics

| Metric | Tool |
|--------|------|
| Request latency | Heroku Metrics |
| Error rate | Heroku Metrics |
| Database performance | Heroku Postgres metrics |
| Memory usage | Heroku Metrics |

### 13.3 Error Tracking

- Use Sentry for production error tracking
- Log all authentication failures
- Log all rate limit hits
- Log all admin actions

---

## 14. Performance Considerations

### 14.1 API Optimizations

- Database connection pooling (Prisma)
- Redis caching for countries list
- Streaming exports for large datasets
- Pagination on all list endpoints
- Database indexes on frequently queried fields

### 14.2 Frontend Optimizations

- Code splitting per route
- Lazy loading of components
- Image optimization (WebP, lazy loading)
- Service Worker for offline support
- Memoization of expensive computations
- Virtual scrolling for long lists

### 14.3 Mobile Optimizations

- Reduced payload sizes
- Touch-optimized interactions
- Offline-first architecture
- Optimistic UI updates
- Prefetching of likely next screens

---

## 15. Future Considerations

### 15.1 Planned Features

- [ ] Trip planning feature
- [ ] Social sharing
- [ ] Travel statistics insights
- [ ] Map visualization
- [ ] Multiple calendars per user
- [ ] Travel goals/achievements
- [ ] Data import from other services

### 15.2 Mobile App Roadmap

- [ ] React Native wrapper app
- [ ] Push notifications for trip reminders
- [ ] Widget for quick entry
- [ ] Offline mode with sync
- [ ] Biometric authentication
- [ ] Camera integration for travel photos

### 15.3 Technical Debt

- [ ] Implement comprehensive E2E tests
- [ ] Add OpenAPI documentation
- [ ] Set up performance monitoring
- [ ] Implement audit logging
- [ ] Add data export compliance (GDPR)

---

## Appendix A: Country Data Format

```json
{
  "countries": [
    {
      "code": "US",
      "name": "United States",
      "color": "#3b82f6"
    }
  ]
}
```

## Appendix B: API Error Codes Reference

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_INVALID_CREDENTIALS | 401 | Wrong email or password |
| AUTH_EMAIL_NOT_CONFIRMED | 401 | Email not verified |
| AUTH_TOKEN_EXPIRED | 401 | JWT token expired |
| AUTH_TOKEN_INVALID | 401 | JWT token invalid |
| AUTH_OAUTH_FAILED | 401 | OAuth authentication failed |
| USER_NOT_FOUND | 404 | User does not exist |
| USER_EMAIL_EXISTS | 409 | Email already registered |
| RECORD_NOT_FOUND | 404 | Travel record not found |
| RECORD_EXISTS | 409 | Record already exists for date |
| VALIDATION_FAILED | 400 | Input validation error |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Appendix C: Supported Countries

ISO 3166-1 alpha-2 codes for all 249 countries and territories.

---

## Appendix D: Email Templates

### D.1 Email Design System

**Common Elements:**
- From: "Country Calendar" <noreply@countrycalendar.app>
- Reply-To: support@countrycalendar.app
- Max width: 600px
- Font: System font stack (Arial fallback)
- Primary color: #3b82f6
- Footer: Unsubscribe link (for marketing), support link

**Template Structure:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: #3b82f6; text-align: center;">
              <img src="https://countrycalendar.app/logo-white.png" alt="Country Calendar" width="180">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              {{CONTENT}}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
              <p>© 2024 Country Calendar. All rights reserved.</p>
              <p><a href="https://countrycalendar.app/support" style="color: #3b82f6;">Contact Support</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### D.2 Welcome Email (After Registration)

**Subject:** Welcome to Country Calendar! Please confirm your email

**Content:**
```
Hi {{name}},

Welcome to Country Calendar! We're excited to have you on board.

To get started tracking your travels, please confirm your email address by clicking the button below:

[Confirm Email Address]
{{confirmation_link}}

This link will expire in 48 hours.

If you didn't create an account with Country Calendar, you can safely ignore this email.

Happy travels!
The Country Calendar Team
```

### D.3 Email Confirmation Reminder (24 hours after registration)

**Subject:** Reminder: Please confirm your Country Calendar account

**Content:**
```
Hi {{name}},

We noticed you haven't confirmed your email address yet.

Click the button below to confirm your account and start tracking your travels:

[Confirm Email Address]
{{confirmation_link}}

This link will expire in 24 hours.

If you're having trouble, contact our support team.

Best regards,
The Country Calendar Team
```

### D.4 Password Reset Email

**Subject:** Reset your Country Calendar password

**Content:**
```
Hi {{name}},

We received a request to reset your password for your Country Calendar account.

Click the button below to set a new password:

[Reset Password]
{{reset_link}}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

For security, this link can only be used once.

Best regards,
The Country Calendar Team
```

### D.5 Password Changed Confirmation

**Subject:** Your Country Calendar password was changed

**Content:**
```
Hi {{name}},

This email confirms that your Country Calendar password was successfully changed on {{date}} at {{time}}.

If you made this change, no further action is needed.

If you didn't change your password, please contact our support team immediately and secure your account.

Best regards,
The Country Calendar Team
```

### D.6 Support Ticket Confirmation

**Subject:** We received your support request [{{reference_id}}]

**Content:**
```
Hi {{name}},

Thank you for contacting Country Calendar support. We've received your request and will get back to you as soon as possible.

Your Reference ID: {{reference_id}}

Subject: {{subject}}
Category: {{category}}

Your Message:
---
{{message}}
---

You can reply to this email to add more information to your request.

We typically respond within 24-48 hours.

Best regards,
The Country Calendar Support Team
```

### D.7 Admin: New Support Ticket Notification

**Subject:** [New Ticket] {{reference_id}}: {{subject}}

**Content:**
```
New support ticket received.

Reference: {{reference_id}}
From: {{name}} <{{email}}>
User ID: {{user_id}} (or "Guest")
Category: {{category}}
Submitted: {{timestamp}}

Message:
---
{{message}}
---

[View in Admin Panel]
{{admin_link}}
```

### D.8 Account Deletion Confirmation

**Subject:** Your Country Calendar account has been deleted

**Content:**
```
Hi {{name}},

This email confirms that your Country Calendar account and all associated data have been permanently deleted.

What was deleted:
- Your account and profile information
- All travel records ({{record_count}} records)
- Any support tickets

This action cannot be undone.

If you didn't request this deletion, please contact us immediately.

We're sorry to see you go. If you'd like to share feedback about why you left, reply to this email.

Best regards,
The Country Calendar Team
```

### D.9 OAuth Account Connected

**Subject:** {{provider}} connected to your Country Calendar account

**Content:**
```
Hi {{name}},

Your {{provider}} account has been successfully connected to Country Calendar.

You can now sign in using {{provider}} in addition to your email and password.

Connected Account: {{provider_email}}
Connected On: {{date}}

If you didn't connect this account, please log in to Country Calendar and disconnect it from your profile settings, then change your password.

Best regards,
The Country Calendar Team
```

---

## Appendix E: Country Data

### E.1 Country Data Source

Country data is stored in `packages/api/data/countries.json` and cached in memory at startup.

### E.2 Complete Country List (ISO 3166-1 alpha-2)

```json
{
  "countries": [
    { "code": "AF", "name": "Afghanistan", "color": "#d4a59a" },
    { "code": "AL", "name": "Albania", "color": "#e6b9b8" },
    { "code": "DZ", "name": "Algeria", "color": "#a8d4a0" },
    { "code": "AS", "name": "American Samoa", "color": "#9ecae1" },
    { "code": "AD", "name": "Andorra", "color": "#fdae6b" },
    { "code": "AO", "name": "Angola", "color": "#a1d99b" },
    { "code": "AI", "name": "Anguilla", "color": "#9ecae1" },
    { "code": "AQ", "name": "Antarctica", "color": "#c6dbef" },
    { "code": "AG", "name": "Antigua and Barbuda", "color": "#fdae6b" },
    { "code": "AR", "name": "Argentina", "color": "#9ecae1" },
    { "code": "AM", "name": "Armenia", "color": "#fc9272" },
    { "code": "AW", "name": "Aruba", "color": "#9ecae1" },
    { "code": "AU", "name": "Australia", "color": "#a1d99b" },
    { "code": "AT", "name": "Austria", "color": "#fc9272" },
    { "code": "AZ", "name": "Azerbaijan", "color": "#9ecae1" },
    { "code": "BS", "name": "Bahamas", "color": "#9ecae1" },
    { "code": "BH", "name": "Bahrain", "color": "#fc9272" },
    { "code": "BD", "name": "Bangladesh", "color": "#a1d99b" },
    { "code": "BB", "name": "Barbados", "color": "#fdae6b" },
    { "code": "BY", "name": "Belarus", "color": "#fc9272" },
    { "code": "BE", "name": "Belgium", "color": "#fdae6b" },
    { "code": "BZ", "name": "Belize", "color": "#9ecae1" },
    { "code": "BJ", "name": "Benin", "color": "#a1d99b" },
    { "code": "BM", "name": "Bermuda", "color": "#9ecae1" },
    { "code": "BT", "name": "Bhutan", "color": "#fdae6b" },
    { "code": "BO", "name": "Bolivia", "color": "#a1d99b" },
    { "code": "BA", "name": "Bosnia and Herzegovina", "color": "#9ecae1" },
    { "code": "BW", "name": "Botswana", "color": "#9ecae1" },
    { "code": "BR", "name": "Brazil", "color": "#a1d99b" },
    { "code": "BN", "name": "Brunei", "color": "#fdae6b" },
    { "code": "BG", "name": "Bulgaria", "color": "#a1d99b" },
    { "code": "BF", "name": "Burkina Faso", "color": "#fc9272" },
    { "code": "BI", "name": "Burundi", "color": "#fc9272" },
    { "code": "CV", "name": "Cabo Verde", "color": "#9ecae1" },
    { "code": "KH", "name": "Cambodia", "color": "#9ecae1" },
    { "code": "CM", "name": "Cameroon", "color": "#a1d99b" },
    { "code": "CA", "name": "Canada", "color": "#fc9272" },
    { "code": "KY", "name": "Cayman Islands", "color": "#9ecae1" },
    { "code": "CF", "name": "Central African Republic", "color": "#9ecae1" },
    { "code": "TD", "name": "Chad", "color": "#fdae6b" },
    { "code": "CL", "name": "Chile", "color": "#9ecae1" },
    { "code": "CN", "name": "China", "color": "#fc9272" },
    { "code": "CO", "name": "Colombia", "color": "#fdae6b" },
    { "code": "KM", "name": "Comoros", "color": "#a1d99b" },
    { "code": "CG", "name": "Congo", "color": "#a1d99b" },
    { "code": "CD", "name": "Congo (DRC)", "color": "#9ecae1" },
    { "code": "CR", "name": "Costa Rica", "color": "#9ecae1" },
    { "code": "CI", "name": "Côte d'Ivoire", "color": "#fdae6b" },
    { "code": "HR", "name": "Croatia", "color": "#9ecae1" },
    { "code": "CU", "name": "Cuba", "color": "#fc9272" },
    { "code": "CY", "name": "Cyprus", "color": "#fdae6b" },
    { "code": "CZ", "name": "Czechia", "color": "#9ecae1" },
    { "code": "DK", "name": "Denmark", "color": "#fc9272" },
    { "code": "DJ", "name": "Djibouti", "color": "#9ecae1" },
    { "code": "DM", "name": "Dominica", "color": "#a1d99b" },
    { "code": "DO", "name": "Dominican Republic", "color": "#9ecae1" },
    { "code": "EC", "name": "Ecuador", "color": "#fdae6b" },
    { "code": "EG", "name": "Egypt", "color": "#fc9272" },
    { "code": "SV", "name": "El Salvador", "color": "#9ecae1" },
    { "code": "GQ", "name": "Equatorial Guinea", "color": "#a1d99b" },
    { "code": "ER", "name": "Eritrea", "color": "#9ecae1" },
    { "code": "EE", "name": "Estonia", "color": "#9ecae1" },
    { "code": "SZ", "name": "Eswatini", "color": "#9ecae1" },
    { "code": "ET", "name": "Ethiopia", "color": "#a1d99b" },
    { "code": "FJ", "name": "Fiji", "color": "#9ecae1" },
    { "code": "FI", "name": "Finland", "color": "#9ecae1" },
    { "code": "FR", "name": "France", "color": "#9ecae1" },
    { "code": "GA", "name": "Gabon", "color": "#a1d99b" },
    { "code": "GM", "name": "Gambia", "color": "#fc9272" },
    { "code": "GE", "name": "Georgia", "color": "#fc9272" },
    { "code": "DE", "name": "Germany", "color": "#fdae6b" },
    { "code": "GH", "name": "Ghana", "color": "#fdae6b" },
    { "code": "GR", "name": "Greece", "color": "#9ecae1" },
    { "code": "GD", "name": "Grenada", "color": "#fc9272" },
    { "code": "GT", "name": "Guatemala", "color": "#9ecae1" },
    { "code": "GN", "name": "Guinea", "color": "#fc9272" },
    { "code": "GW", "name": "Guinea-Bissau", "color": "#fc9272" },
    { "code": "GY", "name": "Guyana", "color": "#a1d99b" },
    { "code": "HT", "name": "Haiti", "color": "#9ecae1" },
    { "code": "HN", "name": "Honduras", "color": "#9ecae1" },
    { "code": "HK", "name": "Hong Kong", "color": "#fc9272" },
    { "code": "HU", "name": "Hungary", "color": "#fc9272" },
    { "code": "IS", "name": "Iceland", "color": "#9ecae1" },
    { "code": "IN", "name": "India", "color": "#fdae6b" },
    { "code": "ID", "name": "Indonesia", "color": "#fc9272" },
    { "code": "IR", "name": "Iran", "color": "#a1d99b" },
    { "code": "IQ", "name": "Iraq", "color": "#fc9272" },
    { "code": "IE", "name": "Ireland", "color": "#a1d99b" },
    { "code": "IL", "name": "Israel", "color": "#9ecae1" },
    { "code": "IT", "name": "Italy", "color": "#a1d99b" },
    { "code": "JM", "name": "Jamaica", "color": "#a1d99b" },
    { "code": "JP", "name": "Japan", "color": "#fc9272" },
    { "code": "JO", "name": "Jordan", "color": "#fc9272" },
    { "code": "KZ", "name": "Kazakhstan", "color": "#9ecae1" },
    { "code": "KE", "name": "Kenya", "color": "#fc9272" },
    { "code": "KI", "name": "Kiribati", "color": "#fc9272" },
    { "code": "KP", "name": "North Korea", "color": "#fc9272" },
    { "code": "KR", "name": "South Korea", "color": "#9ecae1" },
    { "code": "KW", "name": "Kuwait", "color": "#a1d99b" },
    { "code": "KG", "name": "Kyrgyzstan", "color": "#fc9272" },
    { "code": "LA", "name": "Laos", "color": "#fc9272" },
    { "code": "LV", "name": "Latvia", "color": "#fc9272" },
    { "code": "LB", "name": "Lebanon", "color": "#fc9272" },
    { "code": "LS", "name": "Lesotho", "color": "#9ecae1" },
    { "code": "LR", "name": "Liberia", "color": "#9ecae1" },
    { "code": "LY", "name": "Libya", "color": "#a1d99b" },
    { "code": "LI", "name": "Liechtenstein", "color": "#9ecae1" },
    { "code": "LT", "name": "Lithuania", "color": "#fdae6b" },
    { "code": "LU", "name": "Luxembourg", "color": "#9ecae1" },
    { "code": "MO", "name": "Macao", "color": "#a1d99b" },
    { "code": "MG", "name": "Madagascar", "color": "#fc9272" },
    { "code": "MW", "name": "Malawi", "color": "#fc9272" },
    { "code": "MY", "name": "Malaysia", "color": "#9ecae1" },
    { "code": "MV", "name": "Maldives", "color": "#fc9272" },
    { "code": "ML", "name": "Mali", "color": "#a1d99b" },
    { "code": "MT", "name": "Malta", "color": "#fc9272" },
    { "code": "MH", "name": "Marshall Islands", "color": "#9ecae1" },
    { "code": "MR", "name": "Mauritania", "color": "#a1d99b" },
    { "code": "MU", "name": "Mauritius", "color": "#fc9272" },
    { "code": "MX", "name": "Mexico", "color": "#a1d99b" },
    { "code": "FM", "name": "Micronesia", "color": "#9ecae1" },
    { "code": "MD", "name": "Moldova", "color": "#fdae6b" },
    { "code": "MC", "name": "Monaco", "color": "#fc9272" },
    { "code": "MN", "name": "Mongolia", "color": "#9ecae1" },
    { "code": "ME", "name": "Montenegro", "color": "#fc9272" },
    { "code": "MA", "name": "Morocco", "color": "#fc9272" },
    { "code": "MZ", "name": "Mozambique", "color": "#fdae6b" },
    { "code": "MM", "name": "Myanmar", "color": "#fc9272" },
    { "code": "NA", "name": "Namibia", "color": "#9ecae1" },
    { "code": "NR", "name": "Nauru", "color": "#9ecae1" },
    { "code": "NP", "name": "Nepal", "color": "#fc9272" },
    { "code": "NL", "name": "Netherlands", "color": "#fdae6b" },
    { "code": "NZ", "name": "New Zealand", "color": "#9ecae1" },
    { "code": "NI", "name": "Nicaragua", "color": "#9ecae1" },
    { "code": "NE", "name": "Niger", "color": "#fdae6b" },
    { "code": "NG", "name": "Nigeria", "color": "#a1d99b" },
    { "code": "MK", "name": "North Macedonia", "color": "#fc9272" },
    { "code": "NO", "name": "Norway", "color": "#fc9272" },
    { "code": "OM", "name": "Oman", "color": "#fc9272" },
    { "code": "PK", "name": "Pakistan", "color": "#a1d99b" },
    { "code": "PW", "name": "Palau", "color": "#9ecae1" },
    { "code": "PS", "name": "Palestine", "color": "#fc9272" },
    { "code": "PA", "name": "Panama", "color": "#9ecae1" },
    { "code": "PG", "name": "Papua New Guinea", "color": "#fc9272" },
    { "code": "PY", "name": "Paraguay", "color": "#9ecae1" },
    { "code": "PE", "name": "Peru", "color": "#fc9272" },
    { "code": "PH", "name": "Philippines", "color": "#9ecae1" },
    { "code": "PL", "name": "Poland", "color": "#fc9272" },
    { "code": "PT", "name": "Portugal", "color": "#fc9272" },
    { "code": "PR", "name": "Puerto Rico", "color": "#9ecae1" },
    { "code": "QA", "name": "Qatar", "color": "#9ecae1" },
    { "code": "RO", "name": "Romania", "color": "#fdae6b" },
    { "code": "RU", "name": "Russia", "color": "#9ecae1" },
    { "code": "RW", "name": "Rwanda", "color": "#9ecae1" },
    { "code": "KN", "name": "Saint Kitts and Nevis", "color": "#a1d99b" },
    { "code": "LC", "name": "Saint Lucia", "color": "#9ecae1" },
    { "code": "VC", "name": "Saint Vincent and the Grenadines", "color": "#9ecae1" },
    { "code": "WS", "name": "Samoa", "color": "#fc9272" },
    { "code": "SM", "name": "San Marino", "color": "#9ecae1" },
    { "code": "ST", "name": "São Tomé and Príncipe", "color": "#a1d99b" },
    { "code": "SA", "name": "Saudi Arabia", "color": "#a1d99b" },
    { "code": "SN", "name": "Senegal", "color": "#a1d99b" },
    { "code": "RS", "name": "Serbia", "color": "#fc9272" },
    { "code": "SC", "name": "Seychelles", "color": "#9ecae1" },
    { "code": "SL", "name": "Sierra Leone", "color": "#9ecae1" },
    { "code": "SG", "name": "Singapore", "color": "#fc9272" },
    { "code": "SK", "name": "Slovakia", "color": "#9ecae1" },
    { "code": "SI", "name": "Slovenia", "color": "#9ecae1" },
    { "code": "SB", "name": "Solomon Islands", "color": "#a1d99b" },
    { "code": "SO", "name": "Somalia", "color": "#9ecae1" },
    { "code": "ZA", "name": "South Africa", "color": "#a1d99b" },
    { "code": "SS", "name": "South Sudan", "color": "#fc9272" },
    { "code": "ES", "name": "Spain", "color": "#fc9272" },
    { "code": "LK", "name": "Sri Lanka", "color": "#fdae6b" },
    { "code": "SD", "name": "Sudan", "color": "#fc9272" },
    { "code": "SR", "name": "Suriname", "color": "#a1d99b" },
    { "code": "SE", "name": "Sweden", "color": "#fdae6b" },
    { "code": "CH", "name": "Switzerland", "color": "#fc9272" },
    { "code": "SY", "name": "Syria", "color": "#fc9272" },
    { "code": "TW", "name": "Taiwan", "color": "#9ecae1" },
    { "code": "TJ", "name": "Tajikistan", "color": "#fc9272" },
    { "code": "TZ", "name": "Tanzania", "color": "#9ecae1" },
    { "code": "TH", "name": "Thailand", "color": "#9ecae1" },
    { "code": "TL", "name": "Timor-Leste", "color": "#fc9272" },
    { "code": "TG", "name": "Togo", "color": "#a1d99b" },
    { "code": "TO", "name": "Tonga", "color": "#fc9272" },
    { "code": "TT", "name": "Trinidad and Tobago", "color": "#fc9272" },
    { "code": "TN", "name": "Tunisia", "color": "#fc9272" },
    { "code": "TR", "name": "Turkey", "color": "#fc9272" },
    { "code": "TM", "name": "Turkmenistan", "color": "#a1d99b" },
    { "code": "TV", "name": "Tuvalu", "color": "#9ecae1" },
    { "code": "UG", "name": "Uganda", "color": "#fdae6b" },
    { "code": "UA", "name": "Ukraine", "color": "#9ecae1" },
    { "code": "AE", "name": "United Arab Emirates", "color": "#a1d99b" },
    { "code": "GB", "name": "United Kingdom", "color": "#9ecae1" },
    { "code": "US", "name": "United States", "color": "#9ecae1" },
    { "code": "UY", "name": "Uruguay", "color": "#9ecae1" },
    { "code": "UZ", "name": "Uzbekistan", "color": "#9ecae1" },
    { "code": "VU", "name": "Vanuatu", "color": "#fc9272" },
    { "code": "VA", "name": "Vatican City", "color": "#fdae6b" },
    { "code": "VE", "name": "Venezuela", "color": "#fdae6b" },
    { "code": "VN", "name": "Vietnam", "color": "#fc9272" },
    { "code": "YE", "name": "Yemen", "color": "#fc9272" },
    { "code": "ZM", "name": "Zambia", "color": "#fc9272" },
    { "code": "ZW", "name": "Zimbabwe", "color": "#a1d99b" }
  ]
}
```

### E.3 Color Assignment Algorithm

Colors are assigned to countries based on geographic region to create visual clustering on calendar views:

| Region | Base Color | Hex |
|--------|------------|-----|
| Europe | Blue | #9ecae1 |
| Asia | Red/Orange | #fc9272, #fdae6b |
| Africa | Green | #a1d99b |
| North America | Blue | #9ecae1 |
| South America | Green/Blue | #a1d99b, #9ecae1 |
| Oceania | Blue | #9ecae1 |

### E.4 Country Data API Response

```typescript
// GET /countries response type
interface CountriesResponse {
  countries: Country[];
  total: number;
}

interface Country {
  code: string;    // ISO 3166-1 alpha-2 (e.g., "US")
  name: string;    // Full name (e.g., "United States")
  color: string;   // Hex color for calendar display
}
```

### E.5 Country Search Implementation

The country picker should implement fuzzy search:

```typescript
// packages/web/src/lib/countrySearch.ts
import Fuse from 'fuse.js';
import { countries } from '@/data/countries.json';

const fuse = new Fuse(countries, {
  keys: ['name', 'code'],
  threshold: 0.3,
  includeScore: true,
});

export function searchCountries(query: string): Country[] {
  if (!query) return countries;
  return fuse.search(query).map(result => result.item);
}
```

---

## Appendix F: Glossary

| Term | Definition |
|------|------------|
| **Travel Record** | A single entry tracking a user's presence in a country on a specific date |
| **Bulk Update** | Adding multiple travel records across a date range in a single operation |
| **OAuth** | Open Authorization - protocol for third-party sign-in (Google, Facebook, Apple) |
| **JWT** | JSON Web Token - secure token format for API authentication |
| **Access Token** | Short-lived JWT used to authenticate API requests |
| **Refresh Token** | Long-lived token used to obtain new access tokens |
| **Country Code** | ISO 3166-1 alpha-2 two-letter country identifier |
| **Reference ID** | User-facing ticket identifier (e.g., TKT-A1B2C3D4) |
| **Active User** | User who has logged in within the specified time period |
