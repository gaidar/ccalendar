# Change: Frontend Landing & Auth UI

## Why

Country Calendar needs public-facing pages and authentication UI to allow users to discover the application, create accounts, and sign in. This change implements the landing page, all authentication-related pages, and the responsive navigation system that provides a consistent user experience across mobile and desktop devices.

## What Changes

- **NEW**: Landing page with hero section, features, and call-to-action
- **NEW**: Login page with email/password form and OAuth buttons
- **NEW**: Register page with email/password form and OAuth buttons
- **NEW**: Password reset request page (email input)
- **NEW**: Password reset page (new password form with token)
- **NEW**: Email confirmation page (token verification)
- **NEW**: OAuth callback handling (redirect with token)
- **NEW**: Responsive header with desktop nav and mobile hamburger menu
- **NEW**: Mobile bottom navigation (Calendar, Reports, Profile)

## Impact

- Affected specs: All new capabilities
  - `landing-page` - Public landing page
  - `auth-pages` - Authentication pages (login, register, password reset, email confirmation, OAuth)
  - `navigation` - Responsive header and mobile navigation
- Affected code:
  - `/packages/web/src/pages/Landing.tsx`
  - `/packages/web/src/pages/Login.tsx`
  - `/packages/web/src/pages/Register.tsx`
  - `/packages/web/src/pages/PasswordResetRequest.tsx`
  - `/packages/web/src/pages/PasswordReset.tsx`
  - `/packages/web/src/pages/EmailConfirmation.tsx`
  - `/packages/web/src/pages/OAuthCallback.tsx`
  - `/packages/web/src/components/layout/Header.tsx`
  - `/packages/web/src/components/layout/MobileNav.tsx`
  - `/packages/web/src/components/layout/Layout.tsx`
  - `/packages/web/src/components/features/auth/LoginForm.tsx`
  - `/packages/web/src/components/features/auth/RegisterForm.tsx`
  - `/packages/web/src/components/features/auth/OAuthButtons.tsx`
  - `/packages/web/src/components/features/auth/PasswordReset.tsx`

## Dependencies

- Phase 1: Foundation & Infrastructure (Vite + React setup, Tailwind, shadcn/ui)
- Phase 2: Authentication System (API endpoints for auth)

## Success Criteria

1. Landing page renders with hero, features, and CTA sections
2. Login page handles email/password and OAuth flows
3. Register page handles email/password and OAuth registration
4. Password reset flow works end-to-end
5. Email confirmation page validates tokens
6. OAuth callback properly handles redirect with tokens
7. Header is responsive (hamburger on mobile, full nav on desktop)
8. Mobile bottom navigation shows on small screens
9. All forms validate input with Zod schemas
10. All pages are mobile-first responsive
11. Touch targets meet minimum 44x44 pixel requirement
