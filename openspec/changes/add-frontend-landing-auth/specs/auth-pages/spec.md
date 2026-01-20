## ADDED Requirements

### Requirement: Login Page

The application SHALL provide a login page for user authentication.

#### Scenario: Login page layout
- **WHEN** a user navigates to `/login`
- **THEN** the page SHALL display:
  - A login form with email and password fields
  - OAuth sign-in buttons (Google, Facebook, Apple)
  - A "Forgot password?" link
  - A "Don't have an account? Register" link

#### Scenario: Successful email/password login
- **WHEN** a user submits valid credentials
- **THEN** the user SHALL be authenticated
- **AND** the JWT token SHALL be stored
- **AND** the user SHALL be redirected to the dashboard

#### Scenario: Invalid credentials
- **WHEN** a user submits invalid credentials
- **THEN** the error message "Invalid email or password. Please try again." SHALL be displayed
- **AND** the password field SHALL be cleared
- **AND** the email field SHALL retain its value

#### Scenario: Account locked
- **WHEN** a user attempts to log in to a locked account
- **THEN** the error message "Too many login attempts. Please try again in 15 minutes." SHALL be displayed

#### Scenario: Unconfirmed email login
- **WHEN** a user with an unconfirmed email logs in successfully
- **THEN** the user SHALL be logged in
- **AND** a banner prompting email confirmation SHALL be displayed

#### Scenario: Login form validation
- **WHEN** a user submits the login form with invalid data
- **THEN** client-side validation errors SHALL be displayed
- **AND** the form SHALL NOT be submitted to the server

### Requirement: Registration Page

The application SHALL provide a registration page for new users.

#### Scenario: Registration page layout
- **WHEN** a user navigates to `/register`
- **THEN** the page SHALL display:
  - A registration form with name, email, and password fields
  - OAuth sign-up buttons (Google, Facebook, Apple)
  - An "Already have an account? Login" link

#### Scenario: Successful registration
- **WHEN** a user submits valid registration data
- **THEN** the account SHALL be created
- **AND** a confirmation email SHALL be sent
- **AND** the message "Registration successful! Please check your email to confirm your account." SHALL be displayed

#### Scenario: Email already exists
- **WHEN** a user attempts to register with an existing email
- **THEN** the error message "An account with this email already exists. Try logging in instead." SHALL be displayed

#### Scenario: Registration form validation
- **WHEN** a user submits the registration form
- **THEN** the following validations SHALL be enforced:
  - Name: required, 1-100 characters
  - Email: required, valid email format, max 120 characters
  - Password: required, 8-72 characters, at least one uppercase, one lowercase, one number

#### Scenario: Password strength indicator
- **WHEN** a user types in the password field
- **THEN** a password strength indicator SHALL provide visual feedback

### Requirement: OAuth Authentication

The application SHALL support OAuth authentication via Google, Facebook, and Apple.

#### Scenario: OAuth button display
- **WHEN** the login or register page is displayed
- **THEN** OAuth buttons SHALL be displayed for:
  - Google ("Continue with Google")
  - Facebook ("Continue with Facebook")
  - Apple ("Continue with Apple")

#### Scenario: OAuth initiation
- **WHEN** a user clicks an OAuth button
- **THEN** the user SHALL be redirected to the OAuth provider's consent screen

#### Scenario: OAuth callback success
- **WHEN** the OAuth provider redirects back with a success response
- **THEN** the application SHALL extract the token from the callback URL
- **AND** the user SHALL be authenticated
- **AND** the user SHALL be redirected to the dashboard

#### Scenario: OAuth callback error
- **WHEN** the OAuth provider redirects back with an error
- **THEN** the error message "Unable to sign in with {Provider}. Please try again or use another method." SHALL be displayed
- **AND** the user SHALL be on the login page

#### Scenario: OAuth account linking
- **WHEN** a user authenticates via OAuth with an email that matches an existing account
- **THEN** the OAuth provider SHALL be linked to the existing account
- **AND** the user SHALL be logged in

### Requirement: Password Reset Request Page

The application SHALL provide a password reset request page.

#### Scenario: Password reset request page layout
- **WHEN** a user navigates to `/forgot-password`
- **THEN** the page SHALL display:
  - An email input field
  - A "Send Reset Link" button
  - A "Back to Login" link

#### Scenario: Successful password reset request
- **WHEN** a user submits a valid email address
- **THEN** the message "If an account exists with this email, you will receive a password reset link." SHALL be displayed
- **AND** this message SHALL be shown regardless of whether the email exists (security)

#### Scenario: Password reset request validation
- **WHEN** a user submits an invalid email format
- **THEN** a validation error SHALL be displayed
- **AND** the form SHALL NOT be submitted

### Requirement: Password Reset Page

The application SHALL provide a password reset page for users with a valid reset token.

#### Scenario: Password reset page layout
- **WHEN** a user navigates to `/reset-password/:token`
- **THEN** the page SHALL display:
  - A new password field
  - A confirm password field
  - A "Reset Password" button

#### Scenario: Successful password reset
- **WHEN** a user submits a valid new password with a valid token
- **THEN** the password SHALL be updated
- **AND** the message "Your password has been reset. Please log in with your new password." SHALL be displayed
- **AND** the user SHALL be redirected to the login page

#### Scenario: Expired or invalid token
- **WHEN** a user accesses the password reset page with an expired or invalid token
- **THEN** an error message SHALL be displayed
- **AND** a link to request a new reset email SHALL be provided

#### Scenario: Password reset validation
- **WHEN** a user submits the password reset form
- **THEN** the password SHALL meet the same requirements as registration
- **AND** the confirm password SHALL match the new password

### Requirement: Email Confirmation Page

The application SHALL provide an email confirmation page.

#### Scenario: Email confirmation page with valid token
- **WHEN** a user navigates to `/confirm-email/:token` with a valid token
- **THEN** the email SHALL be confirmed automatically
- **AND** the message "Your email has been confirmed. You can now access all features." SHALL be displayed
- **AND** a link to the login page SHALL be provided

#### Scenario: Email confirmation with invalid token
- **WHEN** a user navigates to `/confirm-email/:token` with an invalid token
- **THEN** an error message SHALL be displayed
- **AND** an option to resend the confirmation email SHALL be provided

#### Scenario: Email confirmation with expired token
- **WHEN** a user navigates to `/confirm-email/:token` with an expired token (> 48 hours)
- **THEN** the message SHALL indicate the token has expired
- **AND** an option to resend the confirmation email SHALL be provided

#### Scenario: Resend confirmation email
- **WHEN** a user clicks "Resend confirmation email"
- **THEN** an email input SHALL be displayed (or pre-filled if known)
- **AND** a new confirmation email SHALL be sent on submission

### Requirement: Auth Page Accessibility

All authentication pages SHALL be accessible.

#### Scenario: Form labels and ARIA
- **WHEN** authentication forms are rendered
- **THEN** all inputs SHALL have associated labels
- **AND** error messages SHALL be associated with inputs via `aria-describedby`
- **AND** required fields SHALL have `aria-required="true"`

#### Scenario: Keyboard navigation
- **WHEN** a user navigates auth pages with keyboard only
- **THEN** all interactive elements SHALL be focusable
- **AND** focus order SHALL be logical (top to bottom, left to right)
- **AND** focus indicators SHALL be visible

#### Scenario: Screen reader support
- **WHEN** a screen reader user interacts with auth pages
- **THEN** form errors SHALL be announced
- **AND** success messages SHALL be announced
- **AND** loading states SHALL be announced

### Requirement: Auth Page Responsive Design

All authentication pages SHALL be mobile-first responsive.

#### Scenario: Mobile layout
- **WHEN** auth pages are viewed on mobile devices (< 768px)
- **THEN** forms SHALL be single-column
- **AND** inputs SHALL be full-width
- **AND** touch targets SHALL be at least 44x44 pixels

#### Scenario: Desktop layout
- **WHEN** auth pages are viewed on desktop (>= 1024px)
- **THEN** the form SHALL be centered with a maximum width
- **AND** the layout MAY include decorative side panels
