# auth Specification Delta

## ADDED Requirements

### Requirement: OAuth Cookie Security

The OAuth authentication flow SHALL use secure cookie settings consistent with standard authentication.

- OAuth refresh token cookies MUST use `sameSite: 'strict'` to match standard auth flow
- OAuth refresh token cookies MUST use `httpOnly: true`
- OAuth refresh token cookies MUST use `secure: true` in production
- Cookie settings SHALL be identical between OAuth and standard login flows

#### Scenario: OAuth callback sets strict cookies

- **WHEN** OAuth callback successfully authenticates user
- **THEN** refresh token cookie MUST be set with `sameSite: 'strict'`
- **AND** cookie settings MUST match standard login refresh token cookie

#### Scenario: OAuth cookie prevents CSRF

- **WHEN** a cross-site request attempts to use OAuth refresh token
- **THEN** the cookie SHALL NOT be sent due to `sameSite: 'strict'` policy
- **AND** the request SHALL fail authentication

---

### Requirement: OAuth Error Message Sanitization

The OAuth flow SHALL sanitize error messages to prevent information leakage.

- OAuth provider errors MUST be mapped to generic user-friendly messages
- Internal error details (provider names, token issues, scopes) MUST NOT be exposed to frontend
- Error messages MUST be URL-encoded before including in redirect URL
- Predefined error message mappings SHALL be used:
  - `access_denied` -> "You cancelled the sign-in process"
  - `invalid_request` -> "Sign-in request was invalid. Please try again."
  - `server_error` -> "The authentication service is unavailable. Please try again later."
  - Default -> "Authentication failed. Please try again."

#### Scenario: OAuth error with access_denied

- **WHEN** OAuth provider returns `access_denied` error
- **THEN** user SHALL be redirected to login with message "You cancelled the sign-in process"
- **AND** original error details SHALL NOT appear in URL

#### Scenario: OAuth error with server_error

- **WHEN** OAuth provider returns `server_error`
- **THEN** user SHALL be redirected to login with generic service unavailable message
- **AND** no internal provider details SHALL be exposed

#### Scenario: OAuth error with unknown error

- **WHEN** OAuth provider returns an unrecognized error code
- **THEN** user SHALL be redirected with generic "Authentication failed. Please try again." message
- **AND** original error message SHALL NOT be passed through
