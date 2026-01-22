# API Documentation

This document describes the REST API endpoints for Country Calendar.

## Base URL

- **Development:** `http://localhost:3001/api/v1`
- **Production:** `https://countrycalendar.app/api/v1`

## Authentication

Most endpoints require authentication via JWT tokens.

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Flow

1. Login/register to receive access and refresh tokens
2. Include access token in Authorization header
3. When access token expires (15 min), use refresh token to get new tokens
4. Refresh tokens expire after 7 days

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Authentication

#### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful. Please check your email to confirm your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/login

Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:**
- `401`: Invalid credentials
- `403`: Account locked (too many failed attempts)
- `403`: Email not confirmed

#### POST /auth/logout

Invalidate refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

#### POST /auth/refresh

Get new access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### POST /auth/forgot-password

Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "If an account exists with this email, a reset link has been sent."
}
```

#### POST /auth/reset-password

Reset password using token from email.

**Request:**
```json
{
  "token": "reset-token-from-email",
  "password": "newSecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset successfully"
}
```

#### GET /auth/confirm-email/:token

Confirm email address.

**Response:** `200 OK`
```json
{
  "message": "Email confirmed successfully"
}
```

---

### OAuth

#### GET /auth/google

Initiate Google OAuth flow. Redirects to Google.

#### GET /auth/facebook

Initiate Facebook OAuth flow. Redirects to Facebook.

#### GET /auth/apple

Initiate Apple Sign In flow. Redirects to Apple.

#### GET /auth/callback/:provider

OAuth callback handler. Redirects to frontend with tokens.

---

### Countries

#### GET /countries

Get list of all countries.

**Response:** `200 OK`
```json
{
  "countries": [
    {
      "code": "US",
      "name": "United States",
      "region": "Americas"
    },
    {
      "code": "GB",
      "name": "United Kingdom",
      "region": "Europe"
    }
  ]
}
```

#### GET /countries/:code

Get single country by ISO code.

**Response:** `200 OK`
```json
{
  "country": {
    "code": "US",
    "name": "United States",
    "region": "Americas"
  }
}
```

---

### Travel Records

**Authentication required for all endpoints.**

#### GET /travel-records

Get user's travel records with optional filtering.

**Query Parameters:**
- `startDate`: ISO date (optional)
- `endDate`: ISO date (optional)
- `countryCode`: Filter by country (optional)

**Response:** `200 OK`
```json
{
  "records": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "countryCode": "JP",
      "countryName": "Japan",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /travel-records

Create a new travel record.

**Request:**
```json
{
  "date": "2024-01-15",
  "countryCode": "JP"
}
```

**Response:** `201 Created`
```json
{
  "record": {
    "id": "uuid",
    "date": "2024-01-15",
    "countryCode": "JP",
    "countryName": "Japan"
  }
}
```

**Errors:**
- `400`: Future date not allowed
- `409`: Record already exists for this date

#### PUT /travel-records/:id

Update an existing travel record.

**Request:**
```json
{
  "countryCode": "KR"
}
```

**Response:** `200 OK`
```json
{
  "record": {
    "id": "uuid",
    "date": "2024-01-15",
    "countryCode": "KR",
    "countryName": "South Korea"
  }
}
```

#### DELETE /travel-records/:id

Delete a travel record.

**Response:** `204 No Content`

#### POST /travel-records/bulk-update

Create or update records for a date range.

**Request:**
```json
{
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "countryCode": "JP"
}
```

**Response:** `200 OK`
```json
{
  "created": 4,
  "updated": 2,
  "records": [...]
}
```

---

### Reports

**Authentication required for all endpoints.**

#### GET /reports/summary

Get overall travel summary statistics.

**Query Parameters:**
- `startDate`: ISO date (optional)
- `endDate`: ISO date (optional)

**Response:** `200 OK`
```json
{
  "totalDays": 150,
  "uniqueCountries": 12,
  "mostVisited": {
    "countryCode": "JP",
    "countryName": "Japan",
    "days": 45
  },
  "firstRecord": "2023-01-15",
  "lastRecord": "2024-01-15"
}
```

#### GET /reports/by-year

Get travel breakdown by year.

**Response:** `200 OK`
```json
{
  "years": [
    {
      "year": 2024,
      "totalDays": 45,
      "uniqueCountries": 5,
      "countries": [
        { "code": "JP", "name": "Japan", "days": 20 }
      ]
    }
  ]
}
```

#### GET /reports/by-country

Get travel breakdown by country.

**Response:** `200 OK`
```json
{
  "countries": [
    {
      "code": "JP",
      "name": "Japan",
      "totalDays": 45,
      "firstVisit": "2023-03-15",
      "lastVisit": "2024-01-10",
      "visitsByYear": {
        "2023": 25,
        "2024": 20
      }
    }
  ]
}
```

---

### Profile

**Authentication required for all endpoints.**

#### GET /profile/me

Get current user profile.

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false,
    "createdAt": "2023-01-15T10:30:00Z"
  }
}
```

#### PUT /profile/me

Update user profile.

**Request:**
```json
{
  "name": "Jane Doe"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

#### DELETE /profile/me

Delete user account.

**Response:** `204 No Content`

#### POST /profile/change-password

Change user password.

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

#### GET /profile/connected-accounts

Get linked OAuth accounts.

**Response:** `200 OK`
```json
{
  "accounts": [
    {
      "provider": "google",
      "connectedAt": "2023-06-15T10:30:00Z"
    }
  ]
}
```

#### DELETE /profile/oauth/:provider

Unlink OAuth account.

**Response:** `204 No Content`

---

### Support

#### POST /support/tickets

Create a support ticket.

**Request:**
```json
{
  "category": "bug",
  "subject": "Calendar not loading",
  "message": "When I click on the calendar...",
  "email": "user@example.com"
}
```

**Response:** `201 Created`
```json
{
  "ticket": {
    "referenceId": "SUP-ABC123",
    "status": "open"
  }
}
```

#### GET /support/tickets/:referenceId

Get ticket status by reference ID.

**Response:** `200 OK`
```json
{
  "ticket": {
    "referenceId": "SUP-ABC123",
    "category": "bug",
    "subject": "Calendar not loading",
    "status": "in_progress",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /support/categories

Get available support categories.

**Response:** `200 OK`
```json
{
  "categories": [
    { "id": "bug", "name": "Bug Report" },
    { "id": "feature", "name": "Feature Request" },
    { "id": "account", "name": "Account Issue" },
    { "id": "other", "name": "Other" }
  ]
}
```

#### POST /support/export

Export travel data as CSV or XLSX.

**Request:**
```json
{
  "format": "csv",
  "startDate": "2023-01-01",
  "endDate": "2024-01-01"
}
```

**Response:** File download

**Rate Limit:** 5 exports per hour per user

---

### Admin

**Admin authentication required for all endpoints.**

#### GET /admin/stats

Get system statistics.

**Response:** `200 OK`
```json
{
  "users": {
    "total": 1500,
    "active": 1200,
    "newThisMonth": 50
  },
  "records": {
    "total": 45000
  },
  "tickets": {
    "open": 12,
    "inProgress": 5,
    "resolved": 230
  }
}
```

#### GET /admin/users

Get paginated user list.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by email or name
- `status`: Filter by status (active/disabled)

**Response:** `200 OK`
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "pages": 75
  }
}
```

#### POST /admin/users/:id

Update user (enable/disable, set admin).

**Request:**
```json
{
  "isActive": false,
  "isAdmin": true
}
```

**Response:** `200 OK`

#### DELETE /admin/users/:id

Delete user account.

**Response:** `204 No Content`

#### GET /admin/tickets

Get support tickets.

**Query Parameters:**
- `status`: Filter by status (open/in_progress/resolved/closed)
- `page`: Page number
- `limit`: Items per page

**Response:** `200 OK`

#### PUT /admin/tickets/:id

Update ticket status.

**Request:**
```json
{
  "status": "resolved",
  "response": "Thank you for reporting. This has been fixed."
}
```

**Response:** `200 OK`

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Global | 100 requests/minute |
| Login | 5 attempts/15 minutes |
| Password reset | 3 requests/hour |
| Export | 5 requests/hour |
