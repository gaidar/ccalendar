# Tasks: Add Authentication System

## 1. Database Schema & Models

- [x] 1.1 Add RefreshToken model to Prisma schema
- [x] 1.2 Add EmailConfirmationToken model to Prisma schema
- [x] 1.3 Add PasswordResetToken model to Prisma schema
- [x] 1.4 Add LoginAttempt model for brute force tracking
- [x] 1.5 Run Prisma migration
- [x] 1.6 Create database indexes for performance

## 2. Core Authentication Services

- [x] 2.1 Create tokenService.ts (JWT generation, verification, refresh logic)
- [x] 2.2 Create passwordService.ts (bcrypt hashing, verification)
- [ ] 2.3 Create emailService.ts (Nodemailer + Mailgun integration)
- [x] 2.4 Create authService.ts (registration, login, logout business logic)

## 3. Validation Schemas

- [x] 3.1 Create registerSchema with Zod
- [x] 3.2 Create loginSchema with Zod
- [x] 3.3 Create passwordResetRequestSchema with Zod
- [x] 3.4 Create passwordResetSchema with Zod
- [x] 3.5 Create changePasswordSchema with Zod

## 4. Middleware

- [x] 4.1 Create authenticate middleware (JWT verification)
- [x] 4.2 Create optionalAuth middleware
- [x] 4.3 Create rateLimitMiddleware for auth endpoints
- [x] 4.4 Create bruteForceMiddleware for login protection

## 5. Email/Password Authentication

- [x] 5.1 Implement POST /auth/register endpoint
- [ ] 5.2 Create registration email template
- [x] 5.3 Implement GET /auth/confirm/:token endpoint
- [x] 5.4 Implement POST /auth/login endpoint
- [x] 5.5 Implement POST /auth/logout endpoint
- [x] 5.6 Implement POST /auth/logout-all endpoint
- [x] 5.7 Implement POST /auth/refresh endpoint

## 6. Password Reset Flow

- [x] 6.1 Implement POST /auth/reset-password (request reset)
- [ ] 6.2 Create password reset email template
- [x] 6.3 Implement POST /auth/reset-password/confirm (perform reset)
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

- [x] 8.1 Implement account lockout after 5 failed attempts
- [x] 8.2 Implement 15-minute lockout duration
- [x] 8.3 Configure rate limiting: 5/min login, 3/hour password reset
- [x] 8.4 Add request logging for security auditing
- [x] 8.5 Implement secure token storage (httpOnly cookies or secure headers)

## 9. Unit Tests

- [x] 9.1 Test tokenService (generate, verify, refresh)
- [x] 9.2 Test passwordService (hash, verify)
- [x] 9.3 Test authService (register, login, logout)
- [x] 9.4 Test validation schemas
- [x] 9.5 Test middleware functions

## 10. Integration Tests

- [x] 10.1 Test full registration flow
- [x] 10.2 Test login with valid/invalid credentials
- [x] 10.3 Test email confirmation flow
- [x] 10.4 Test password reset flow
- [x] 10.5 Test token refresh flow
- [ ] 10.6 Test OAuth flows (mocked providers)
- [x] 10.7 Test brute force protection
- [x] 10.8 Test rate limiting

## 11. Documentation

- [ ] 11.1 Update API documentation with auth endpoints
- [ ] 11.2 Document environment variables required
- [ ] 11.3 Document OAuth provider setup instructions
