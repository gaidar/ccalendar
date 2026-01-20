# Tasks: Frontend Landing & Auth UI

## 1. Layout Components

- [ ] 1.1 Create `Layout.tsx` wrapper component with header/footer slots
- [ ] 1.2 Create `Header.tsx` responsive header component
- [ ] 1.3 Implement desktop navigation in header (logo, nav links, auth buttons)
- [ ] 1.4 Implement mobile hamburger menu with slide-out drawer
- [ ] 1.5 Create `MobileNav.tsx` bottom navigation component
- [ ] 1.6 Implement mobile nav icons (Calendar, Reports, Profile)
- [ ] 1.7 Create `Footer.tsx` component with links and copyright
- [ ] 1.8 Write component tests for layout components

## 2. Landing Page

- [ ] 2.1 Create `Landing.tsx` page component
- [ ] 2.2 Implement hero section with headline, subheadline, and CTA buttons
- [ ] 2.3 Implement features section showcasing key capabilities
- [ ] 2.4 Implement social proof/testimonials section (if applicable)
- [ ] 2.5 Implement final CTA section before footer
- [ ] 2.6 Add responsive styles for mobile/tablet/desktop
- [ ] 2.7 Add animations/transitions for visual polish
- [ ] 2.8 Write component tests for landing page

## 3. Auth Form Components

- [ ] 3.1 Create `LoginForm.tsx` with email/password fields
- [ ] 3.2 Create `RegisterForm.tsx` with name/email/password fields
- [ ] 3.3 Create `OAuthButtons.tsx` with Google, Facebook, Apple buttons
- [ ] 3.4 Create `PasswordResetRequestForm.tsx` with email field
- [ ] 3.5 Create `PasswordResetForm.tsx` with new password fields
- [ ] 3.6 Implement Zod validation schemas for all forms
- [ ] 3.7 Implement React Hook Form integration for all forms
- [ ] 3.8 Style form error states and validation messages
- [ ] 3.9 Write unit tests for all form components

## 4. Login Page

- [ ] 4.1 Create `Login.tsx` page component
- [ ] 4.2 Integrate `LoginForm` and `OAuthButtons`
- [ ] 4.3 Implement login API call with error handling
- [ ] 4.4 Handle successful login (store token, redirect to dashboard)
- [ ] 4.5 Display account locked message when applicable
- [ ] 4.6 Add "Forgot password?" link to password reset
- [ ] 4.7 Add "Don't have an account? Register" link
- [ ] 4.8 Write integration tests for login flow

## 5. Register Page

- [ ] 5.1 Create `Register.tsx` page component
- [ ] 5.2 Integrate `RegisterForm` and `OAuthButtons`
- [ ] 5.3 Implement registration API call with error handling
- [ ] 5.4 Handle successful registration (show confirmation message)
- [ ] 5.5 Display email already exists error when applicable
- [ ] 5.6 Add "Already have an account? Login" link
- [ ] 5.7 Write integration tests for registration flow

## 6. Password Reset Pages

- [ ] 6.1 Create `PasswordResetRequest.tsx` page component
- [ ] 6.2 Implement password reset request API call
- [ ] 6.3 Display generic success message (security: don't reveal if email exists)
- [ ] 6.4 Create `PasswordReset.tsx` page component with token from URL
- [ ] 6.5 Implement password reset API call with token
- [ ] 6.6 Handle expired/invalid token errors
- [ ] 6.7 Redirect to login on successful reset
- [ ] 6.8 Write integration tests for password reset flow

## 7. Email Confirmation Page

- [ ] 7.1 Create `EmailConfirmation.tsx` page component
- [ ] 7.2 Extract token from URL parameters
- [ ] 7.3 Implement email confirmation API call on page load
- [ ] 7.4 Display success message with redirect to login
- [ ] 7.5 Handle expired/invalid token errors
- [ ] 7.6 Implement resend confirmation email option
- [ ] 7.7 Write integration tests for email confirmation flow

## 8. OAuth Callback Handling

- [ ] 8.1 Create `OAuthCallback.tsx` page component
- [ ] 8.2 Extract token and provider from URL parameters
- [ ] 8.3 Store authentication token in auth store
- [ ] 8.4 Handle OAuth errors (display message, redirect options)
- [ ] 8.5 Redirect to dashboard on successful OAuth
- [ ] 8.6 Write integration tests for OAuth callback

## 9. Auth State Management

- [ ] 9.1 Create `authStore.ts` Zustand store
- [ ] 9.2 Implement `login()` action with token storage
- [ ] 9.3 Implement `logout()` action with token clearing
- [ ] 9.4 Implement `refreshToken()` action for token refresh
- [ ] 9.5 Create `useAuth()` hook for components
- [ ] 9.6 Implement protected route wrapper component
- [ ] 9.7 Write unit tests for auth store

## 10. API Service Layer

- [ ] 10.1 Create `api.ts` Axios instance with interceptors
- [ ] 10.2 Implement automatic token refresh on 401 responses
- [ ] 10.3 Create `authService.ts` with login/register/reset methods
- [ ] 10.4 Handle rate limit errors (429) with user feedback
- [ ] 10.5 Write unit tests for API services

## 11. Routing

- [ ] 11.1 Configure React Router routes for all pages
- [ ] 11.2 Implement public route guards (redirect to dashboard if logged in)
- [ ] 11.3 Implement protected route guards (redirect to login if not logged in)
- [ ] 11.4 Handle OAuth callback route with query params
- [ ] 11.5 Handle email confirmation route with token param
- [ ] 11.6 Handle password reset route with token param

## 12. Accessibility & Polish

- [ ] 12.1 Add proper ARIA labels to all interactive elements
- [ ] 12.2 Ensure keyboard navigation works for all forms
- [ ] 12.3 Add focus indicators for all interactive elements
- [ ] 12.4 Verify touch targets are minimum 44x44 pixels
- [ ] 12.5 Add loading states for all async operations
- [ ] 12.6 Add toast notifications for success/error feedback
- [ ] 12.7 Run accessibility audit and fix issues

## 13. Integration & Review

- [ ] 13.1 Run all unit tests and ensure they pass
- [ ] 13.2 Run all integration tests and ensure they pass
- [ ] 13.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 13.4 Test on mobile devices/simulators
- [ ] 13.5 Review code for SOLID principles compliance
- [ ] 13.6 Cross-browser testing (Chrome, Firefox, Safari)
