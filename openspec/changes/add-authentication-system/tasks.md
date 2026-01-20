# Tasks: Add Authentication System

## 1. Database Schema & Models

- [ ] 1.1 Add RefreshToken model to Prisma schema
- [ ] 1.2 Add EmailConfirmationToken model to Prisma schema
- [ ] 1.3 Add PasswordResetToken model to Prisma schema
- [ ] 1.4 Add LoginAttempt model for brute force tracking
- [ ] 1.5 Run Prisma migration
- [ ] 1.6 Create database indexes for performance

## 2. Core Authentication Services

- [ ] 2.1 Create tokenService.ts (JWT generation, verification, refresh logic)
- [ ] 2.2 Create passwordService.ts (bcrypt hashing, verification)
- [ ] 2.3 Create emailService.ts (Nodemailer + Mailgun integration)
- [ ] 2.4 Create authService.ts (registration, login, logout business logic)

## 3. Validation Schemas

- [ ] 3.1 Create registerSchema with Zod
- [ ] 3.2 Create loginSchema with Zod
- [ ] 3.3 Create passwordResetRequestSchema with Zod
- [ ] 3.4 Create passwordResetSchema with Zod
- [ ] 3.5 Create changePasswordSchema with Zod

## 4. Middleware

- [ ] 4.1 Create authenticate middleware (JWT verification)
- [ ] 4.2 Create optionalAuth middleware
- [ ] 4.3 Create rateLimitMiddleware for auth endpoints
- [ ] 4.4 Create bruteForceMiddleware for login protection

## 5. Email/Password Authentication

- [ ] 5.1 Implement POST /auth/register endpoint
- [ ] 5.2 Create registration email template
- [ ] 5.3 Implement GET /auth/confirm/:token endpoint
- [ ] 5.4 Implement POST /auth/login endpoint
- [ ] 5.5 Implement POST /auth/logout endpoint
- [ ] 5.6 Implement POST /auth/logout-all endpoint
- [ ] 5.7 Implement POST /auth/refresh endpoint

## 6. Password Reset Flow

- [ ] 6.1 Implement POST /auth/reset-password (request reset)
- [ ] 6.2 Create password reset email template
- [ ] 6.3 Implement POST /auth/reset-password/:token (perform reset)
- [ ] 6.4 Create password changed notification email template

## 7. OAuth Integration

- [ ] 7.1 Configure Passport.js Google strategy
- [ ] 7.2 Implement GET /auth/oauth/google
- [ ] 7.3 Implement GET /auth/oauth/google/callback
- [ ] 7.4 Configure Passport.js Facebook strategy
- [ ] 7.5 Implement GET /auth/oauth/facebook
- [ ] 7.6 Implement GET /auth/oauth/facebook/callback
- [ ] 7.7 Configure Apple Sign In
- [ ] 7.8 Implement GET /auth/oauth/apple
- [ ] 7.9 Implement POST /auth/oauth/apple/callback
- [ ] 7.10 Implement OAuth account linking logic

## 8. Security Features

- [ ] 8.1 Implement account lockout after 5 failed attempts
- [ ] 8.2 Implement 15-minute lockout duration
- [ ] 8.3 Configure rate limiting: 5/min login, 3/hour password reset
- [ ] 8.4 Add request logging for security auditing
- [ ] 8.5 Implement secure token storage (httpOnly cookies or secure headers)

## 9. Unit Tests

- [ ] 9.1 Test tokenService (generate, verify, refresh)
- [ ] 9.2 Test passwordService (hash, verify)
- [ ] 9.3 Test authService (register, login, logout)
- [ ] 9.4 Test validation schemas
- [ ] 9.5 Test middleware functions

## 10. Integration Tests

- [ ] 10.1 Test full registration flow
- [ ] 10.2 Test login with valid/invalid credentials
- [ ] 10.3 Test email confirmation flow
- [ ] 10.4 Test password reset flow
- [ ] 10.5 Test token refresh flow
- [ ] 10.6 Test OAuth flows (mocked providers)
- [ ] 10.7 Test brute force protection
- [ ] 10.8 Test rate limiting

## 11. Documentation

- [ ] 11.1 Update API documentation with auth endpoints
- [ ] 11.2 Document environment variables required
- [ ] 11.3 Document OAuth provider setup instructions
