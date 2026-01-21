# Social OAuth Implementation Tasks

## 1. Backend: Dependencies & Configuration
- [x] 1.1 Install OAuth dependencies (passport, passport-google-oauth20, passport-facebook, apple-signin-auth)
- [x] 1.2 Add OAuth environment variables to config schema (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY)
- [x] 1.3 Create OAuth config section with production-only validation

## 2. Backend: OAuth Service
- [x] 2.1 Create `packages/api/src/services/oauthService.ts` with provider handling
- [x] 2.2 Implement `findOrCreateOAuthUser` for account linking logic
- [x] 2.3 Implement `getAvailableProviders` to return providers based on environment
- [x] 2.4 Add OAuth-specific error handling

## 3. Backend: Passport Strategies
- [x] 3.1 Create `packages/api/src/config/passport.ts` with strategy setup
- [x] 3.2 Configure Google OAuth 2.0 strategy
- [x] 3.3 Configure Facebook OAuth strategy
- [x] 3.4 Implement Apple Sign In verification (using apple-signin-auth)

## 4. Backend: OAuth Routes
- [x] 4.1 Add `GET /api/auth/providers` endpoint (returns available providers)
- [x] 4.2 Add `GET /api/auth/google` route to initiate Google OAuth
- [x] 4.3 Add `GET /api/auth/google/callback` route for Google callback
- [x] 4.4 Add `GET /api/auth/facebook` route to initiate Facebook OAuth
- [x] 4.5 Add `GET /api/auth/facebook/callback` route for Facebook callback
- [x] 4.6 Add `POST /api/auth/apple` route for Apple Sign In (POST callback)
- [x] 4.7 Add `POST /api/auth/apple/callback` route for Apple callback

## 5. Backend: Tests
- [x] 5.1 Write unit tests for oauthService (account linking scenarios)
- [x] 5.2 Write integration tests for OAuth routes (mock OAuth providers)
- [x] 5.3 Test provider availability endpoint in different environments

## 6. Frontend: OAuth Buttons Component
- [x] 6.1 Create `packages/web/src/components/features/OAuthButtons.tsx`
- [x] 6.2 Add Google sign-in button with Google branding
- [x] 6.3 Add Facebook sign-in button with Facebook branding
- [x] 6.4 Add Apple sign-in button with Apple branding
- [x] 6.5 Implement provider availability check (fetch from `/api/auth/providers`)
- [x] 6.6 Conditionally render buttons only when providers available

## 7. Frontend: Integration
- [x] 7.1 Add OAuthButtons to LoginPage.tsx (with divider "or continue with")
- [x] 7.2 Add OAuthButtons to RegisterPage.tsx (with divider)
- [x] 7.3 Create `packages/web/src/pages/OAuthCallbackPage.tsx` for handling redirects
- [x] 7.4 Add route for OAuth callback page
- [x] 7.5 Handle OAuth errors and display appropriate messages

## 8. Documentation & Environment
- [x] 8.1 Update .env.example with OAuth environment variables
- [ ] 8.2 Document OAuth setup in README (provider configuration)
- [ ] 8.3 Add OAuth credentials to production environment

## 9. Review & Validation
- [x] 9.1 Run linting on all new code
- [x] 9.2 Run all tests
- [x] 9.3 Code review for security (token handling, error messages)
- [x] 9.4 Verify OAuth buttons hidden in development
- [ ] 9.5 Test full OAuth flow in production-like environment
