# auth Specification

## Purpose
TBD - created by archiving change add-authentication-system. Update Purpose after archive.
## Requirements
### Requirement: User Registration

The system SHALL allow users to create accounts using email and password.

- Registration requires name (1-100 chars), email (valid format, max 120 chars), and password
- Password MUST be at least 8 characters with uppercase, lowercase, and number
- Email MUST be unique (case-insensitive)
- Password MUST be hashed using bcrypt with cost factor 12
- User account is created with `isConfirmed: false`
- System MUST send confirmation email upon successful registration

#### Scenario: Successful registration

- **WHEN** user submits valid name, email, and password
- **THEN** user account is created with `isConfirmed: false`
- **AND** confirmation email is sent to provided email address
- **AND** response includes user id, name, email (status 201)

#### Scenario: Registration with existing email

- **WHEN** user submits email that already exists in database
- **THEN** registration fails with error "Email already registered" (status 409)

#### Scenario: Registration with weak password

- **WHEN** user submits password without uppercase, lowercase, or number
- **THEN** registration fails with validation error (status 400)

#### Scenario: Registration with invalid email format

- **WHEN** user submits malformed email address
- **THEN** registration fails with validation error (status 400)

---

### Requirement: Email Confirmation

The system SHALL require users to confirm their email address before logging in.

- Confirmation token MUST be cryptographically secure (64 bytes, URL-safe)
- Confirmation token MUST expire after 48 hours
- Token MUST be single-use
- Successful confirmation sets `isConfirmed: true` and `confirmedAt` timestamp

#### Scenario: Successful email confirmation

- **WHEN** user clicks valid confirmation link within 48 hours
- **THEN** user account is confirmed (`isConfirmed: true`)
- **AND** `confirmedAt` timestamp is set
- **AND** confirmation token is invalidated
- **AND** response confirms successful verification (status 200)

#### Scenario: Expired confirmation token

- **WHEN** user clicks confirmation link after 48 hours
- **THEN** confirmation fails with error "Confirmation link has expired" (status 400)
- **AND** system offers to resend confirmation email

#### Scenario: Invalid or used confirmation token

- **WHEN** user clicks invalid or already-used confirmation link
- **THEN** confirmation fails with error "Invalid confirmation link" (status 400)

#### Scenario: Resend confirmation email

- **WHEN** user requests new confirmation email for unconfirmed account
- **THEN** previous confirmation token is invalidated
- **AND** new confirmation email is sent
- **AND** rate limit applies (max 3 requests per hour)

---

### Requirement: User Login

The system SHALL authenticate users with valid email and password credentials.

- Login requires email and password
- System MUST verify password against bcrypt hash
- System MUST reject login for unconfirmed accounts
- Successful login returns JWT access token and sets refresh token cookie
- Access token expires in 15 minutes
- Refresh token expires in 7 days

#### Scenario: Successful login with confirmed account

- **WHEN** user submits valid email and password for confirmed account
- **THEN** JWT access token is returned in response body
- **AND** refresh token is set in httpOnly cookie
- **AND** response includes user profile (id, name, email, isAdmin)

#### Scenario: Login with unconfirmed account

- **WHEN** user submits valid credentials for unconfirmed account
- **THEN** login fails with error "Please confirm your email address" (status 403)

#### Scenario: Login with invalid password

- **WHEN** user submits incorrect password
- **THEN** login fails with error "Invalid email or password" (status 401)
- **AND** failed login attempt is recorded

#### Scenario: Login with non-existent email

- **WHEN** user submits email that does not exist
- **THEN** login fails with error "Invalid email or password" (status 401)
- **AND** response timing is consistent with invalid password (prevent enumeration)

---

### Requirement: Token Refresh

The system SHALL allow clients to obtain new access tokens using valid refresh tokens.

- Refresh endpoint accepts refresh token from httpOnly cookie
- System MUST validate refresh token signature and expiry
- System MUST check refresh token is not revoked
- Successful refresh issues new access token and rotates refresh token
- Old refresh token MUST be invalidated upon rotation

#### Scenario: Successful token refresh

- **WHEN** client sends request with valid, non-revoked refresh token
- **THEN** new access token is returned in response body
- **AND** new refresh token is set in httpOnly cookie
- **AND** old refresh token is invalidated

#### Scenario: Refresh with expired token

- **WHEN** client sends request with expired refresh token
- **THEN** refresh fails with error "Session expired, please login again" (status 401)
- **AND** refresh token cookie is cleared

#### Scenario: Refresh with revoked token

- **WHEN** client sends request with revoked refresh token
- **THEN** refresh fails with error "Session invalid" (status 401)
- **AND** refresh token cookie is cleared

---

### Requirement: Single Session Logout

The system SHALL allow users to logout from their current session.

- Logout endpoint requires valid access token
- System MUST revoke the current refresh token
- System MUST clear refresh token cookie

#### Scenario: Successful logout

- **WHEN** authenticated user requests logout
- **THEN** current refresh token is revoked
- **AND** refresh token cookie is cleared
- **AND** response confirms successful logout (status 200)

#### Scenario: Logout without authentication

- **WHEN** unauthenticated request attempts logout
- **THEN** logout fails with error "Unauthorized" (status 401)

---

### Requirement: Password Reset Request

The system SHALL allow users to request password reset via email.

- Password reset request requires only email address
- System MUST NOT reveal whether email exists (timing attack prevention)
- Reset token expires in 1 hour
- Reset token MUST be cryptographically secure (64 bytes)
- Only one active reset token per user at a time

#### Scenario: Password reset request for existing account

- **WHEN** user requests password reset for registered email
- **THEN** password reset email is sent with reset link
- **AND** any previous reset token is invalidated
- **AND** response message is identical for existing/non-existing emails

#### Scenario: Password reset request for non-existent email

- **WHEN** user requests password reset for unregistered email
- **THEN** no email is sent
- **AND** response message is identical to existing email case
- **AND** response timing is consistent (prevent enumeration)

#### Scenario: Password reset rate limiting

- **WHEN** user requests password reset more than 3 times per hour
- **THEN** request fails with error "Too many requests" (status 429)

---

### Requirement: Password Reset Execution

The system SHALL allow users to set a new password using a valid reset token.

- Reset requires valid token and new password
- New password MUST meet same requirements as registration
- Successful reset invalidates the token and all refresh tokens
- System MUST send password changed notification email

#### Scenario: Successful password reset

- **WHEN** user submits valid reset token and new password
- **THEN** password is updated with new bcrypt hash
- **AND** reset token is marked as used
- **AND** all user refresh tokens are revoked
- **AND** password changed notification email is sent
- **AND** response confirms successful reset (status 200)

#### Scenario: Password reset with expired token

- **WHEN** user submits reset token after 1 hour expiry
- **THEN** reset fails with error "Reset link has expired" (status 400)

#### Scenario: Password reset with used token

- **WHEN** user submits already-used reset token
- **THEN** reset fails with error "Reset link has already been used" (status 400)

#### Scenario: Password reset with weak password

- **WHEN** user submits password not meeting requirements
- **THEN** reset fails with validation error (status 400)

---

### Requirement: Account Lockout

The system SHALL protect against brute force attacks by locking accounts after repeated failed login attempts.

- Account is locked after 5 consecutive failed login attempts
- Lockout duration is 15 minutes
- Successful login resets failed attempt counter
- Lockout is per account, not per IP address
- Admin users MUST NOT be exempt from lockout

#### Scenario: Account lockout after failed attempts

- **WHEN** user fails 5 consecutive login attempts
- **THEN** account is locked for 15 minutes
- **AND** login attempts during lockout fail with error "Account temporarily locked" (status 429)
- **AND** lockout applies even with correct password

#### Scenario: Lockout timer expiration

- **WHEN** 15 minutes pass after account lockout
- **THEN** account is unlocked
- **AND** failed attempt counter is reset
- **AND** user can attempt login again

#### Scenario: Successful login resets counter

- **WHEN** user logs in successfully with fewer than 5 failed attempts
- **THEN** failed attempt counter is reset to 0

---

### Requirement: Google OAuth

The system SHALL allow users to authenticate using their Google account.

- System MUST use Passport.js Google OAuth 2.0 strategy
- OAuth flow MUST request email and profile scopes
- System MUST handle account linking for existing emails
- New users via OAuth are automatically confirmed

#### Scenario: First-time Google OAuth login

- **WHEN** user authenticates with Google for the first time
- **AND** no account exists with matching email
- **THEN** new user account is created with `isConfirmed: true`
- **AND** OAuth record is created linking Google ID to user
- **AND** user receives JWT tokens and is logged in

#### Scenario: Google OAuth with existing email

- **WHEN** user authenticates with Google
- **AND** account exists with matching verified email
- **THEN** OAuth record is linked to existing account
- **AND** user receives JWT tokens and is logged in

#### Scenario: Google OAuth linking conflict

- **WHEN** user authenticates with Google
- **AND** account exists with matching unverified email
- **THEN** OAuth login fails with error "Please verify your email first" (status 403)

#### Scenario: Google OAuth with existing link

- **WHEN** user authenticates with Google
- **AND** Google account is already linked to their user account
- **THEN** user receives JWT tokens and is logged in

---

### Requirement: Facebook OAuth

The system SHALL allow users to authenticate using their Facebook account.

- System MUST use Passport.js Facebook OAuth strategy
- OAuth flow MUST request email and public_profile scopes
- System MUST handle account linking for existing emails
- New users via OAuth are automatically confirmed

#### Scenario: First-time Facebook OAuth login

- **WHEN** user authenticates with Facebook for the first time
- **AND** no account exists with matching email
- **THEN** new user account is created with `isConfirmed: true`
- **AND** OAuth record is created linking Facebook ID to user
- **AND** user receives JWT tokens and is logged in

#### Scenario: Facebook OAuth with existing email

- **WHEN** user authenticates with Facebook
- **AND** account exists with matching verified email
- **THEN** OAuth record is linked to existing account
- **AND** user receives JWT tokens and is logged in

#### Scenario: Facebook OAuth without email permission

- **WHEN** user denies email permission during Facebook OAuth
- **THEN** OAuth login fails with error "Email permission required" (status 400)

---

### Requirement: Apple Sign In

The system SHALL allow users to authenticate using their Apple ID.

- System MUST implement Apple Sign In with POST callback
- System MUST handle Apple's "Hide My Email" feature
- System MUST handle account linking for existing emails
- New users via OAuth are automatically confirmed

#### Scenario: First-time Apple Sign In

- **WHEN** user authenticates with Apple for the first time
- **AND** no account exists with matching email
- **THEN** new user account is created with `isConfirmed: true`
- **AND** OAuth record is created linking Apple ID to user
- **AND** user receives JWT tokens and is logged in

#### Scenario: Apple Sign In with hidden email

- **WHEN** user authenticates with Apple using "Hide My Email"
- **THEN** account is created with Apple's relay email address
- **AND** system treats relay email as verified

#### Scenario: Apple Sign In with existing email

- **WHEN** user authenticates with Apple
- **AND** account exists with matching verified email
- **THEN** OAuth record is linked to existing account
- **AND** user receives JWT tokens and is logged in

---

### Requirement: Logout All Devices

The system SHALL allow users to invalidate all their active sessions.

- Endpoint requires valid access token
- System MUST revoke all refresh tokens for the user
- System MUST clear refresh token cookie for current session

#### Scenario: Successful logout all devices

- **WHEN** authenticated user requests logout from all devices
- **THEN** all user refresh tokens are revoked
- **AND** refresh token cookie is cleared
- **AND** response confirms successful logout (status 200)

#### Scenario: Sessions invalidated on other devices

- **WHEN** user has active sessions on multiple devices
- **AND** user logs out from all devices on one device
- **THEN** other devices receive "Session invalid" on next token refresh

---

### Requirement: Rate Limiting

The system SHALL protect authentication endpoints from abuse through rate limiting.

- Login endpoint: 5 requests per minute per IP
- Registration endpoint: 3 requests per minute per IP
- Password reset request: 3 requests per hour per IP
- Token refresh: 30 requests per minute per IP
- Rate limit headers MUST be included in responses

#### Scenario: Login rate limit exceeded

- **WHEN** IP address exceeds 5 login requests per minute
- **THEN** subsequent requests fail with error "Too many requests" (status 429)
- **AND** response includes Retry-After header

#### Scenario: Registration rate limit exceeded

- **WHEN** IP address exceeds 3 registration requests per minute
- **THEN** subsequent requests fail with error "Too many requests" (status 429)

#### Scenario: Rate limit headers in response

- **WHEN** client makes request to rate-limited endpoint
- **THEN** response includes X-RateLimit-Limit header
- **AND** response includes X-RateLimit-Remaining header
- **AND** response includes X-RateLimit-Reset header

