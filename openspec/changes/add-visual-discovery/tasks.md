# Tasks: Visual & Discovery Features

## 1. Database & Schema

- [ ] 1.1 Add `username` field to User model (unique, nullable, 3-30 chars)
- [ ] 1.2 Add `isPublic` field to User model (boolean, default false)
- [ ] 1.3 Create `ImportJob` model with status tracking
- [ ] 1.4 Create and run Prisma migration
- [ ] 1.5 Add database indexes for username lookup

## 2. World Map Visualization

### 2.1 Backend
- [ ] 2.1.1 Create `GET /api/travel/map-data` endpoint
- [ ] 2.1.2 Return aggregated country visit counts for user
- [ ] 2.1.3 Add caching for map data (Redis, 5 min TTL)
- [ ] 2.1.4 Write unit tests for map data endpoint

### 2.2 Frontend
- [ ] 2.2.1 Install `react-simple-maps` dependency
- [ ] 2.2.2 Add Natural Earth 110m GeoJSON to public assets
- [ ] 2.2.3 Create `WorldMap` component with zoom/pan
- [ ] 2.2.4 Implement country coloring by visit frequency
- [ ] 2.2.5 Add tooltip showing country name and visit count
- [ ] 2.2.6 Add country click handler to show details modal
- [ ] 2.2.7 Create `MapPage` with responsive layout
- [ ] 2.2.8 Add Map to navigation (desktop and mobile)
- [ ] 2.2.9 Add loading skeleton for map
- [ ] 2.2.10 Write component tests for WorldMap

## 3. Data Import

### 3.1 Backend
- [ ] 3.1.1 Create `POST /api/import/preview` endpoint
- [ ] 3.1.2 Create `POST /api/import/execute` endpoint
- [ ] 3.1.3 Create `GET /api/import/jobs` endpoint
- [ ] 3.1.4 Create `GET /api/import/jobs/:id` endpoint
- [ ] 3.1.5 Implement duplicate detection logic
- [ ] 3.1.6 Implement validation for imported data
- [ ] 3.1.7 Add rate limiting for import endpoints (5/hour)
- [ ] 3.1.8 Write unit tests for import service
- [ ] 3.1.9 Write integration tests for import flow

### 3.2 Frontend
- [ ] 3.2.1 Install `papaparse` dependency
- [ ] 3.2.2 Create `ImportWizard` multi-step component
- [ ] 3.2.3 Step 1: File upload with drag-drop support
- [ ] 3.2.4 Step 2: Column mapping interface
- [ ] 3.2.5 Step 3: Preview with validation errors
- [ ] 3.2.6 Step 4: Progress and completion
- [ ] 3.2.7 Create `ImportPage` with wizard
- [ ] 3.2.8 Add Import to navigation
- [ ] 3.2.9 Add import history view
- [ ] 3.2.10 Handle large file warning (>10,000 rows)
- [ ] 3.2.11 Write component tests for ImportWizard

## 4. Public Profile & Sharing

### 4.1 Backend
- [ ] 4.1.1 Create `GET /api/users/:username/public` endpoint
- [ ] 4.1.2 Create `PATCH /api/profile/username` endpoint
- [ ] 4.1.3 Create `PATCH /api/profile/visibility` endpoint
- [ ] 4.1.4 Implement username validation (format, reserved words)
- [ ] 4.1.5 Create `GET /api/og/:username.png` endpoint
- [ ] 4.1.6 Implement OG image SVG generation
- [ ] 4.1.7 Add sharp for SVG to PNG conversion
- [ ] 4.1.8 Add Redis caching for OG images (1 hour TTL)
- [ ] 4.1.9 Add rate limiting for OG generation (60/hour)
- [ ] 4.1.10 Write unit tests for public profile service
- [ ] 4.1.11 Write integration tests for profile endpoints

### 4.2 Frontend
- [ ] 4.2.1 Create `PublicProfilePage` component
- [ ] 4.2.2 Create `ProfileCard` with stats display
- [ ] 4.2.3 Create `MiniWorldMap` component (simplified map)
- [ ] 4.2.4 Add username setting to profile page
- [ ] 4.2.5 Add public/private toggle to profile page
- [ ] 4.2.6 Add share button with copy link
- [ ] 4.2.7 Add social share buttons (Twitter, Facebook)
- [ ] 4.2.8 Add OpenGraph meta tags to public profile
- [ ] 4.2.9 Handle 404 for non-existent usernames
- [ ] 4.2.10 Write component tests for PublicProfilePage

## 5. Navigation Updates

- [ ] 5.1 Add Map icon and route to desktop navigation
- [ ] 5.2 Add Map icon to mobile bottom navigation
- [ ] 5.3 Add Import link to profile/settings area
- [ ] 5.4 Update navigation tests

## 6. Testing & Quality

- [ ] 6.1 Run all existing tests to verify no regressions
- [ ] 6.2 Manual testing of map on mobile devices
- [ ] 6.3 Manual testing of import with various file formats
- [ ] 6.4 Manual testing of public profile sharing
- [ ] 6.5 Verify OG images render correctly on social platforms
- [ ] 6.6 Performance testing for map rendering
- [ ] 6.7 Accessibility audit for new components

## 7. Documentation

- [ ] 7.1 Update API documentation with new endpoints
- [ ] 7.2 Add import file format documentation
- [ ] 7.3 Add user-facing help for public profiles

## 8. Deployment

- [ ] 8.1 Run database migration on staging
- [ ] 8.2 Deploy and test on staging environment
- [ ] 8.3 Run database migration on production
- [ ] 8.4 Deploy to production
- [ ] 8.5 Monitor for errors post-deployment
