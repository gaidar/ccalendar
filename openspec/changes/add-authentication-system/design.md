# Design: Authentication System

## Context

Country Calendar needs a robust authentication system to:
- Protect user travel data
- Enable personalized experiences
- Support multiple authentication methods (email/password, OAuth)
- Ensure security best practices

**Stakeholders**: All users, administrators

**Constraints**:
- Must work with PostgreSQL + Prisma
- Must support mobile web and future native app wrapper
- Must comply with security best practices (OWASP)

## Goals / Non-Goals

**Goals**:
- Secure user authentication with industry-standard practices
- Support email/password and OAuth (Google, Facebook, Apple)
- Provide seamless token refresh without user intervention
- Protect against common attacks (brute force, token theft)

**Non-Goals**:
- Multi-factor authentication (deferred to future phase)
- Biometric authentication (mobile app only, future)
- SSO with enterprise providers (SAML, OIDC beyond consumer OAuth)

## Decisions

### 1. JWT Token Strategy

**Decision**: Use short-lived access tokens (15 minutes) with long-lived refresh tokens (7 days)

**Rationale**:
- Short access tokens limit exposure if compromised
- Refresh tokens enable seamless UX without frequent re-login
- Rotating refresh tokens (invalidate on use, issue new) prevent token replay

**Alternatives considered**:
- Session-based auth: Rejected due to stateless API requirement and horizontal scaling needs
- Single long-lived JWT: Rejected due to security concerns (token revocation difficulty)

### 2. Token Storage

**Decision**: Store access token in memory (JavaScript variable), refresh token in httpOnly cookie

**Rationale**:
- Access token in memory: XSS cannot extract it from localStorage
- Refresh token in httpOnly cookie: Protected from JavaScript access, sent automatically
- CSRF protection via SameSite=Strict cookie attribute

**Alternatives considered**:
- Both in localStorage: Vulnerable to XSS
- Both in cookies: Increases request size, CSRF complexity

### 3. Password Hashing

**Decision**: Use bcrypt with cost factor 12

**Rationale**:
- Industry standard, well-tested
- Cost factor 12 provides ~300ms hash time, good balance of security/performance
- bcrypt handles salt generation automatically

**Alternatives considered**:
- Argon2: Better theoretical properties but less library maturity in Node.js ecosystem
- scrypt: Less common, fewer battle-tested libraries

### 4. Email Confirmation

**Decision**: Require email confirmation before login, 48-hour token expiry

**Rationale**:
- Ensures valid email for password reset flow
- 48 hours gives reasonable time for users to check email
- Prevents spam account creation

**Alternatives considered**:
- Allow login without confirmation: Risks unverified email issues
- 24-hour expiry: Too short for users with infrequent email checking

### 5. OAuth Account Linking

**Decision**: Auto-link OAuth to existing account if email matches and is verified

**Rationale**:
- Seamless UX for users who register then add OAuth
- Email verification requirement prevents account hijacking
- Users can have multiple OAuth providers linked

**Alternatives considered**:
- Manual linking only: Worse UX
- Auto-link without verification: Security risk (email spoofing)

### 6. Brute Force Protection

**Decision**: Account lockout after 5 failed attempts, 15-minute lockout duration

**Rationale**:
- 5 attempts balances security with typo tolerance
- 15 minutes is enough to deter automated attacks
- Lockout per account (not IP) to handle shared networks

**Alternatives considered**:
- IP-based rate limiting only: Can lock out legitimate users on shared IPs
- CAPTCHA after N attempts: Adds UX friction, implementation complexity

## Architecture

### Token Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Application                        │
├─────────────────────────────────────────────────────────────────┤
│  Access Token (memory)    │    Refresh Token (httpOnly cookie)  │
└─────────────────────────────────────────────────────────────────┘
                │                              │
                │ Authorization: Bearer <at>   │ Cookie: refreshToken=<rt>
                ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
├─────────────────────────────────────────────────────────────────┤
│  authenticate middleware  │  /auth/refresh endpoint             │
│  - Verify JWT signature   │  - Validate refresh token           │
│  - Check expiration       │  - Rotate token (invalidate old)    │
│  - Extract user context   │  - Issue new access + refresh       │
└─────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL                                │
├─────────────────────────────────────────────────────────────────┤
│  RefreshToken table       │  LoginAttempt table                 │
│  - token (hashed)         │  - userId                           │
│  - userId                 │  - success: boolean                 │
│  - expiresAt              │  - ipAddress                        │
│  - isRevoked              │  - createdAt                        │
└─────────────────────────────────────────────────────────────────┘
```

### OAuth Flow

```
┌────────┐     ┌─────────┐     ┌──────────────┐     ┌──────────┐
│ Client │────▶│   API   │────▶│ OAuth Provider│────▶│ Callback │
└────────┘     └─────────┘     └──────────────┘     └──────────┘
                                                         │
    ┌────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OAuth Callback Handler                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Receive provider token + profile                             │
│ 2. Find or create user by provider ID                           │
│ 3. If email matches existing user → link accounts               │
│ 4. Generate access + refresh tokens                             │
│ 5. Redirect to frontend with tokens                             │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Additions

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique @db.VarChar(64)  // SHA-256 hash
  userId    String
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}

model EmailConfirmationToken {
  id        String   @id @default(uuid())
  token     String   @unique @db.VarChar(64)
  userId    String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("email_confirmation_tokens")
}

model PasswordResetToken {
  id        String   @id @default(uuid())
  token     String   @unique @db.VarChar(64)
  userId    String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("password_reset_tokens")
}

model LoginAttempt {
  id        String   @id @default(uuid())
  userId    String?
  email     String   @db.VarChar(120)
  success   Boolean
  ipAddress String   @db.VarChar(45)
  userAgent String?  @db.VarChar(500)
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([email, createdAt])
  @@index([userId, createdAt])
  @@map("login_attempts")
}
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Refresh token theft | Account takeover | Rotate tokens, short expiry, secure cookie flags |
| Email service downtime | Users cannot register/reset password | Queue emails, retry logic, monitoring |
| OAuth provider changes | Login failures | Abstract provider logic, monitor deprecation notices |
| Brute force at scale | Service degradation | IP rate limiting in addition to account lockout |

## Migration Plan

1. Deploy database schema changes (additive, no breaking changes)
2. Deploy API endpoints (behind feature flag if needed)
3. Deploy frontend auth UI
4. Enable email confirmation requirement
5. Monitor for issues, adjust rate limits as needed

## Rollback

- Disable new endpoints via feature flag
- Revert frontend to previous version
- Database changes are additive; no rollback needed for schema

## Open Questions

None - all major decisions resolved based on project.md specifications.

## Environment Variables

```bash
# JWT
JWT_ACCESS_SECRET=<random-256-bit-key>
JWT_REFRESH_SECRET=<random-256-bit-key>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (Mailgun)
MAILGUN_API_KEY=<key>
MAILGUN_DOMAIN=<domain>
EMAIL_FROM=noreply@countrycalendar.app

# OAuth - Google
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/oauth/google/callback

# OAuth - Facebook
FACEBOOK_CLIENT_ID=<client-id>
FACEBOOK_CLIENT_SECRET=<client-secret>
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/v1/auth/oauth/facebook/callback

# OAuth - Apple
APPLE_CLIENT_ID=<client-id>
APPLE_TEAM_ID=<team-id>
APPLE_KEY_ID=<key-id>
APPLE_PRIVATE_KEY=<private-key-content>
APPLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/oauth/apple/callback

# Security
ACCOUNT_LOCKOUT_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION_MINUTES=15
```
