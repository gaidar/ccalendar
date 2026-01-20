# Change: Add Authentication System

## Why

Country Calendar requires secure user authentication to protect personal travel data and provide personalized experiences. Users must be able to register, login, and manage their accounts through multiple authentication methods including email/password and OAuth providers.

## What Changes

- **BREAKING**: None (greenfield implementation)
- Add email/password registration with email confirmation
- Add JWT-based authentication with access and refresh tokens
- Add password reset flow with email verification
- Add brute force protection with account lockout
- Add Google OAuth integration
- Add Facebook OAuth integration
- Add Apple Sign In integration
- Add logout (single session and all devices)
- Add rate limiting on authentication endpoints

## Impact

- Affected specs: `auth` (new capability)
- Affected code:
  - `packages/api/src/routes/auth.ts`
  - `packages/api/src/controllers/authController.ts`
  - `packages/api/src/services/authService.ts`
  - `packages/api/src/services/tokenService.ts`
  - `packages/api/src/services/emailService.ts`
  - `packages/api/src/middleware/authenticate.ts`
  - `packages/api/src/middleware/rateLimit.ts`
  - `packages/api/src/validators/auth.ts`
  - `packages/api/prisma/schema.prisma` (User, OAuth, RefreshToken models)

## Dependencies

- Phase 1 (Foundation & Infrastructure) must be completed
- Email service (Nodemailer + Mailgun) configuration
- PostgreSQL database with Prisma ORM
