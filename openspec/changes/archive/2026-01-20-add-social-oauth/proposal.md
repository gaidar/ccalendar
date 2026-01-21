# Change: Add Social OAuth Authentication (Google, Facebook, Apple)

## Why

Currently, users can only register and login with email/password. Social OAuth provides:
- Faster onboarding with one-click sign-in
- Reduced friction for users who prefer social login
- Automatic email verification through OAuth providers
- Industry-standard authentication that users expect

## What Changes

### Backend
- Add Passport.js with Google, Facebook, and Apple OAuth strategies
- Create OAuth callback endpoints for each provider
- Implement account linking logic (link OAuth to existing verified accounts)
- Add OAuth configuration environment variables
- Create endpoint to return available OAuth providers based on environment

### Frontend
- Add OAuth login buttons to Login and Register pages
- **Production-only display**: OAuth buttons are only shown in production environment
- Handle OAuth callback redirect and token exchange
- Show connected OAuth providers in user profile (future)

## Impact

- **Affected specs**: `auth` - adding OAuth provider availability requirement
- **Affected code**:
  - `packages/api/src/routes/auth.ts` - new OAuth routes
  - `packages/api/src/services/authService.ts` - OAuth authentication logic
  - `packages/api/src/config/index.ts` - OAuth configuration
  - `packages/web/src/pages/LoginPage.tsx` - OAuth buttons
  - `packages/web/src/pages/RegisterPage.tsx` - OAuth buttons
- **New dependencies**:
  - `passport` - authentication middleware
  - `passport-google-oauth20` - Google strategy
  - `passport-facebook` - Facebook strategy
  - `apple-signin-auth` - Apple Sign In verification
- **Database**: No schema changes (OAuth model already exists)
