## ADDED Requirements

### Requirement: OAuth Provider Availability

The system SHALL provide an endpoint to query available OAuth providers based on the current environment.

- Endpoint: `GET /api/auth/providers`
- In production environment, return all configured OAuth providers
- In development environment, return an empty list (OAuth disabled)
- Response MUST include provider names that can be used to initiate OAuth flow

#### Scenario: Query providers in production

- **WHEN** client requests available OAuth providers in production environment
- **AND** Google, Facebook, and Apple OAuth are configured
- **THEN** response includes `{ providers: ['google', 'facebook', 'apple'] }` (status 200)

#### Scenario: Query providers in development

- **WHEN** client requests available OAuth providers in development environment
- **THEN** response includes `{ providers: [] }` (status 200)
- **AND** OAuth buttons SHOULD be hidden in frontend

#### Scenario: Partially configured OAuth

- **WHEN** client requests available OAuth providers in production
- **AND** only Google OAuth is configured
- **THEN** response includes only configured providers `{ providers: ['google'] }`
