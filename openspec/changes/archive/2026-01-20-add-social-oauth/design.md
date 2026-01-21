# Social OAuth Implementation Design

## Context

The application currently supports email/password authentication. Users expect social login options, particularly in a mobile-first travel app. The authentication spec already defines requirements for Google, Facebook, and Apple OAuth, but these are not yet implemented.

Key constraint: OAuth buttons should only be visible in production to avoid development complexity with OAuth provider configurations.

## Goals / Non-Goals

### Goals
- Implement Google, Facebook, and Apple OAuth authentication
- Support account linking for existing verified email accounts
- Auto-confirm accounts created via OAuth
- Hide OAuth buttons in development environment
- Follow existing authentication patterns and code style

### Non-Goals
- OAuth provider management in user profile (separate change)
- Multiple accounts per user (one user = one account)
- Social profile data sync beyond initial registration

## Decisions

### 1. OAuth Library Choice: Passport.js + apple-signin-auth

**Decision**: Use Passport.js for Google and Facebook, apple-signin-auth for Apple.

**Rationale**:
- Passport.js is the spec-defined choice and industry standard
- Apple Sign In requires special handling (POST callback, JWT verification)
- apple-signin-auth handles Apple's unique requirements cleanly

**Alternatives considered**:
- Grant.js: More complex setup, less community support
- Manual OAuth implementation: Higher maintenance burden

### 2. OAuth Flow Architecture

**Decision**: Server-side OAuth with redirect flow

```
Frontend                  Backend                    Provider
   |                         |                          |
   |-- Click OAuth btn ----->|                          |
   |                         |-- Redirect to OAuth ---->|
   |                         |                          |
   |                         |<-- Callback with code ---|
   |                         |                          |
   |                         |-- Exchange code -------->|
   |                         |<-- User profile ---------|
   |                         |                          |
   |<-- Redirect with JWT ---|                          |
```

**Rationale**:
- More secure than client-side (tokens never exposed to browser)
- Simpler error handling
- Works with existing JWT-based auth system

### 3. Environment-Based Feature Toggle

**Decision**: Use `/api/auth/providers` endpoint to return available OAuth providers

```typescript
// Response in development
{ providers: [] }

// Response in production
{ providers: ['google', 'facebook', 'apple'] }
```

**Rationale**:
- Single source of truth (backend controls availability)
- Frontend doesn't need environment detection
- Easy to enable/disable individual providers
- Can be extended for A/B testing or gradual rollout

### 4. Account Linking Strategy

**Decision**: Auto-link OAuth to existing accounts with matching verified email

```
OAuth Email matches existing account?
├── No existing account → Create new account (auto-confirmed)
├── Existing account, verified email → Link OAuth and login
└── Existing account, unverified email → Error: "Please verify your email first"
```

**Rationale**:
- Prevents account takeover via unverified emails
- Seamless experience for verified users
- Clear error message guides users to verify first

### 5. Apple Sign In "Hide My Email" Handling

**Decision**: Treat Apple relay emails as verified and valid

**Rationale**:
- Apple guarantees delivery to real email
- Relay email is permanent for that user-app pair
- User made explicit choice to hide email

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| OAuth providers change APIs | Use well-maintained passport strategies, monitor for deprecations |
| Apple's unique requirements | Use specialized library (apple-signin-auth) |
| OAuth credentials exposure | Store in environment variables, never in code |
| Development testing difficulty | OAuth disabled in dev; use email/password for testing |

## Migration Plan

1. Add dependencies (passport, passport-google-oauth20, passport-facebook, apple-signin-auth)
2. Add OAuth config to environment schema (optional in dev, required in prod)
3. Implement OAuth service and routes
4. Add OAuth buttons to frontend (conditionally rendered)
5. Test in production-like environment before deployment

## Rollback

- OAuth is additive; existing email/password auth unaffected
- Remove OAuth routes and frontend buttons to rollback
- No database migration needed (OAuth model exists)

## Open Questions

None - requirements are well-defined in existing spec.
