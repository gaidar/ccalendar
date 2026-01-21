# World Map Visualization

## ADDED Requirements

### Requirement: Map Data Endpoint

The system SHALL provide an API endpoint to retrieve aggregated travel data formatted for map visualization.

**Endpoint:** `GET /api/travel/map-data`

**Response:**
```json
{
  "countries": [
    { "code": "US", "name": "United States", "visitCount": 45, "color": "#1e40af" },
    { "code": "FR", "name": "France", "visitCount": 12, "color": "#3b82f6" }
  ],
  "totalCountries": 15,
  "totalDays": 234
}
```

The color SHALL be computed based on visit frequency using a gradient scale.

#### Scenario: Authenticated user retrieves map data
- **WHEN** authenticated user requests `GET /api/travel/map-data`
- **THEN** response status is 200
- **AND** response contains array of countries with visit counts
- **AND** each country has a computed color based on visit frequency

#### Scenario: Unauthenticated request
- **WHEN** unauthenticated user requests `GET /api/travel/map-data`
- **THEN** response status is 401
- **AND** response contains error message

#### Scenario: User with no travel records
- **WHEN** authenticated user with no travel records requests map data
- **THEN** response status is 200
- **AND** countries array is empty
- **AND** totalCountries is 0
- **AND** totalDays is 0

---

### Requirement: Map Data Caching

The system SHALL cache map data in Redis to reduce database load.

**Cache key:** `map-data:{userId}`
**TTL:** 5 minutes

The cache SHALL be invalidated when travel records are created, updated, or deleted.

#### Scenario: Cache hit
- **WHEN** user requests map data within 5 minutes of previous request
- **THEN** data is served from Redis cache
- **AND** database is not queried

#### Scenario: Cache invalidation on record change
- **WHEN** user creates a new travel record
- **THEN** map data cache for that user is invalidated
- **AND** next map data request queries the database

---

### Requirement: Interactive World Map Component

The system SHALL provide an interactive world map component displaying visited countries.

**Features:**
- SVG-based map using Natural Earth 110m data
- Countries colored by visit frequency (gradient scale)
- Zoom and pan controls
- Hover tooltips showing country name and visit count
- Click to view country details

#### Scenario: Map displays visited countries
- **WHEN** user navigates to the map page
- **THEN** world map renders with visited countries highlighted
- **AND** unvisited countries are shown in neutral gray
- **AND** visited countries use gradient coloring based on frequency

#### Scenario: Hover tooltip
- **WHEN** user hovers over a visited country
- **THEN** tooltip displays country name
- **AND** tooltip displays total days visited
- **AND** tooltip displays visit count

#### Scenario: Hover over unvisited country
- **WHEN** user hovers over an unvisited country
- **THEN** tooltip displays country name
- **AND** tooltip displays "Not visited yet"

#### Scenario: Click country for details
- **WHEN** user clicks on a visited country
- **THEN** modal or panel opens with country details
- **AND** details include list of visit date ranges
- **AND** user can navigate to calendar for specific dates

---

### Requirement: Map Color Scale

The system SHALL use a consistent color scale for visit frequency visualization.

**Color scale:**
- 0 visits: `#e5e7eb` (neutral gray)
- 1-5 visits: `#93c5fd` (light blue)
- 6-15 visits: `#3b82f6` (medium blue)
- 16-30 visits: `#1d4ed8` (dark blue)
- 31+ visits: `#1e3a8a` (very dark blue)

#### Scenario: Color assignment
- **WHEN** map renders a country with 3 days visited
- **THEN** country is colored `#93c5fd` (light blue)

#### Scenario: High frequency country
- **WHEN** map renders a country with 50 days visited
- **THEN** country is colored `#1e3a8a` (very dark blue)

---

### Requirement: Map Page

The system SHALL provide a dedicated map page accessible from main navigation.

**Route:** `/map`
**Access:** Authenticated users only

#### Scenario: Navigate to map page
- **WHEN** authenticated user clicks Map in navigation
- **THEN** user is directed to `/map`
- **AND** world map component loads
- **AND** summary statistics display (total countries, total days)

#### Scenario: Unauthenticated access
- **WHEN** unauthenticated user navigates to `/map`
- **THEN** user is redirected to login page
- **AND** after login, user is redirected back to `/map`

---

### Requirement: Map Responsive Design

The system SHALL provide responsive map display for all screen sizes.

**Desktop (>1024px):**
- Full-width map with sidebar statistics
- Zoom controls visible

**Tablet (768-1024px):**
- Full-width map
- Statistics below map
- Touch-friendly zoom

**Mobile (<768px):**
- Full-width map
- Statistics in collapsible panel
- Pinch-to-zoom support

#### Scenario: Mobile map interaction
- **WHEN** user views map on mobile device
- **THEN** map fits within viewport
- **AND** pinch-to-zoom is enabled
- **AND** statistics are accessible via tap

#### Scenario: Desktop map layout
- **WHEN** user views map on desktop
- **THEN** map displays with sidebar
- **AND** statistics show in sidebar
- **AND** mouse wheel zoom is enabled

---

### Requirement: Map Loading State

The system SHALL display appropriate loading states while map data loads.

#### Scenario: Initial map load
- **WHEN** user navigates to map page
- **THEN** skeleton loader displays for map area
- **AND** once data loads, map renders with animation
- **AND** loading indicator disappears

#### Scenario: Map load error
- **WHEN** map data fails to load
- **THEN** error message displays
- **AND** retry button is provided
- **AND** user can retry loading
