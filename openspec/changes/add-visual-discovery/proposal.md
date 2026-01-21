# Change: Add Visual & Discovery Features (Phase 14)

## Why

Country Calendar currently tracks travel data in a calendar format, but lacks visual impact and growth mechanisms. Users cannot see their travels on a map, import existing travel history, or share their achievements. These gaps limit user engagement, onboarding, and viral growth potential.

## What Changes

### 1. World Map Visualization
- Interactive SVG world map showing visited countries
- Color coding by visit frequency (gradient from light to dark)
- Zoom, pan, and tooltip interactions
- Country click to view details
- Responsive design for mobile and desktop
- New `/map` route and navigation item

### 2. Data Import
- Import travel history from CSV/Excel files
- Column mapping wizard for flexible formats
- Duplicate detection and conflict resolution
- Import preview with validation
- Batch processing for large files
- New `/import` route with multi-step wizard

### 3. Public Profile & Sharing
- Optional public profile page (`/u/{username}`)
- Username selection and uniqueness validation
- Privacy controls (public/private toggle)
- Travel statistics display (countries visited, total days)
- Mini world map on profile
- Social sharing with OpenGraph images
- New profile settings for public visibility

## Impact

- **New specs:**
  - `world-map` - Map visualization capability
  - `data-import` - Import functionality
  - `public-profile` - Public profiles and sharing

- **Modified specs:**
  - `navigation` - Add Map and Import nav items
  - `profile-ui` - Add public profile settings

- **Database changes:**
  - Add `username` field to User table (unique, optional)
  - Add `isPublic` field to User table (default: false)
  - Add `ImportJob` table for tracking import progress

- **New dependencies:**
  - `react-simple-maps` or `@react-leaflet` for map rendering
  - `papaparse` for CSV parsing
  - `xlsx` for Excel parsing (already used for export)

- **Affected code:**
  - `packages/web/src/pages/` - New MapPage, ImportPage, PublicProfilePage
  - `packages/web/src/components/` - MapView, ImportWizard, ProfileCard
  - `packages/api/src/routes/` - New import routes, public profile routes
  - `packages/api/src/services/` - ImportService, PublicProfileService
  - `packages/api/prisma/schema.prisma` - User model updates, ImportJob model
