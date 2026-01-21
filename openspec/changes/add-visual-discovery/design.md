# Design: Visual & Discovery Features

## Context

Country Calendar needs visual differentiation from spreadsheet-based tracking and mechanisms for user growth. This design covers three interconnected features: world map visualization, data import, and public profiles with sharing.

**Stakeholders:** End users, growth/marketing, development team
**Constraints:** Must work on mobile, maintain existing auth patterns, respect privacy

## Goals / Non-Goals

### Goals
- Provide engaging visual representation of travel history
- Enable easy onboarding for users with existing travel data
- Create viral growth mechanism through shareable profiles
- Maintain mobile-first responsive design
- Keep implementation simple and maintainable

### Non-Goals
- Real-time collaboration features
- Location tracking or GPS integration
- Complex social features (following, comments)
- Paid/premium tiers (all features free)
- Native mobile app changes

## Decisions

### 1. Map Library Selection

**Decision:** Use `react-simple-maps` with Natural Earth GeoJSON data

**Alternatives considered:**
- `@react-leaflet/core` - Full mapping library, overkill for country-level visualization
- `d3-geo` - Powerful but steep learning curve, more code
- `mapbox-gl` - Requires API key, commercial implications
- Custom SVG - Maximum control but significant development effort

**Rationale:**
- Lightweight (~50KB gzipped with data)
- Built specifically for country-level choropleth maps
- Good React integration with hooks
- No external API dependencies
- Active maintenance and community

### 2. Map Data Source

**Decision:** Bundle Natural Earth 110m simplified GeoJSON

**Rationale:**
- 110m resolution sufficient for world view (~150KB)
- Can lazy-load 50m for zoomed views if needed
- No external API calls
- Works offline after initial load
- Country codes align with ISO 3166-1 alpha-2 (matches our existing data)

### 3. Import File Parsing

**Decision:** Client-side parsing with `papaparse` (CSV) and existing `xlsx` library (Excel)

**Alternatives considered:**
- Server-side parsing - Requires file upload, memory concerns
- Web Workers - Good for large files, adds complexity
- Streaming parser - Overkill for typical file sizes (<10MB)

**Rationale:**
- Instant preview without network roundtrip
- No server memory/storage concerns
- Existing xlsx dependency already available
- Add Web Worker only if performance issues arise

### 4. Import Processing Architecture

**Decision:** Batch API calls with client-managed progress

```
[File] → [Parse locally] → [Validate] → [Preview] → [Batch POST /api/travel/bulk]
```

**Rationale:**
- Reuse existing bulk update endpoint
- Simple implementation
- User sees progress in UI
- No background job infrastructure needed
- Rollback is easy (delete imported records)

### 5. Username System

**Decision:** Optional username for public profiles

**Format:** 3-30 chars, alphanumeric + underscore, case-insensitive stored lowercase

**Validation rules:**
- Must start with letter
- No consecutive underscores
- Reserved words blacklist (admin, api, app, www, etc.)
- Unique constraint in database

**Rationale:**
- Optional keeps friction low for privacy-conscious users
- Familiar format from other platforms
- Case-insensitivity prevents confusion
- Reasonable length limits

### 6. Public Profile URL Structure

**Decision:** `/u/{username}` pattern

**Alternatives considered:**
- `/profile/{username}` - Longer, less clean
- `/{username}` - Conflicts with routes like `/map`, `/import`
- `/users/{username}` - More REST-like but verbose

**Rationale:**
- Short and memorable
- Clear namespace separation
- Common pattern (GitHub uses similar)

### 7. OpenGraph Image Generation

**Decision:** Server-side SVG generation, converted to PNG

**Implementation:**
- Generate SVG with user stats and mini map
- Use `sharp` library to convert SVG → PNG
- Cache generated images (1 hour TTL)
- Serve from `/api/og/{username}.png`

**Alternatives considered:**
- Client-side canvas capture - Requires browser, complex
- Third-party service (Cloudinary, Vercel OG) - External dependency
- Static placeholder - Misses personalization opportunity

**Rationale:**
- Full control over design
- `sharp` already commonly used, fast
- Caching reduces compute load
- Personalized images improve click-through

### 8. Privacy Model

**Decision:** Simple public/private toggle per user

**Default:** Private (opt-in to public)

**What's visible when public:**
- Username
- Total countries visited (count)
- Total days tracked (count)
- Mini world map showing visited countries
- Account creation date

**What's never visible:**
- Email address
- Specific dates of travel
- Daily breakdown
- Full calendar view

**Rationale:**
- Simple mental model
- Privacy-first default
- Shares aggregate data only
- No accidental exposure of sensitive travel dates

## Data Model Changes

### User Table Updates

```prisma
model User {
  // ... existing fields ...
  username    String?   @unique
  isPublic    Boolean   @default(false)
}
```

### ImportJob Table (for tracking)

```prisma
model ImportJob {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  filename      String
  totalRows     Int
  processedRows Int      @default(0)
  errorRows     Int      @default(0)
  status        ImportStatus @default(PENDING)
  errors        Json?    // Array of {row, error}
  createdAt     DateTime @default(now())
  completedAt   DateTime?
}

enum ImportStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## API Endpoints

### Map Data
- `GET /api/travel/map-data` - Returns country codes with visit counts for current user

### Import
- `POST /api/import/preview` - Validate and preview import (no persistence)
- `POST /api/import/execute` - Execute import with validated data
- `GET /api/import/jobs` - List user's import history
- `GET /api/import/jobs/:id` - Get specific import job status

### Public Profile
- `GET /api/users/:username/public` - Get public profile data
- `PATCH /api/profile/username` - Set/update username
- `PATCH /api/profile/visibility` - Toggle public/private
- `GET /api/og/:username.png` - OpenGraph image

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large import files crash browser | Limit to 10,000 rows, show warning for large files |
| Username squatting | Reserved words list, require email confirmation for public profiles |
| Map rendering performance on mobile | Use 110m resolution, lazy-load higher res only on zoom |
| OG image generation load | Cache aggressively, rate limit generation |
| Privacy concerns with public profiles | Default to private, clear UI for visibility setting |

## Migration Plan

1. **Database migration:** Add `username`, `isPublic` to User table (nullable, no breaking change)
2. **Deploy API endpoints:** All new endpoints, no breaking changes
3. **Deploy frontend:** New pages behind feature flags initially
4. **Enable features:** Remove flags after validation
5. **Rollback:** Drop new columns, remove new routes (no data loss for existing features)

## Open Questions

1. Should we support import from Google Calendar ICS files? (Deferred to future iteration)
2. Should public profiles show badges/achievements? (Requires achievements feature first)
3. Should we add rate limiting to OG image generation? (Yes, implement with existing rate limit patterns)
