# Public Profile & Sharing

## ADDED Requirements

### Requirement: Username System

The system SHALL support optional usernames for public profile URLs.

**Username rules:**
- Length: 3-30 characters
- Characters: lowercase letters, numbers, underscores
- Must start with a letter
- No consecutive underscores
- Unique across all users
- Case-insensitive (stored lowercase)

**Reserved words:** admin, api, app, www, help, support, about, terms, privacy, settings, login, register, calendar, map, import, profile, user, users

#### Scenario: Set valid username
- **WHEN** user sets username `traveler_jane`
- **THEN** username is saved as `traveler_jane`
- **AND** public profile is accessible at `/u/traveler_jane`

#### Scenario: Username validation - too short
- **WHEN** user attempts to set username `ab`
- **THEN** error message indicates minimum 3 characters required

#### Scenario: Username validation - invalid characters
- **WHEN** user attempts to set username `jane-doe`
- **THEN** error message indicates only letters, numbers, and underscores allowed

#### Scenario: Username validation - starts with number
- **WHEN** user attempts to set username `123jane`
- **THEN** error message indicates username must start with a letter

#### Scenario: Username validation - reserved word
- **WHEN** user attempts to set username `admin`
- **THEN** error message indicates username is reserved

#### Scenario: Username already taken
- **WHEN** user attempts to set username that exists
- **THEN** error message indicates username is not available

#### Scenario: Change username
- **WHEN** user changes username from `jane` to `jane_travels`
- **THEN** old username becomes available
- **AND** new username is assigned to user
- **AND** public profile URL changes

---

### Requirement: Profile Visibility Toggle

The system SHALL allow users to toggle profile visibility between public and private.

**Default:** Private
**Setting location:** Profile settings page

#### Scenario: Enable public profile
- **WHEN** user enables public profile toggle
- **AND** user has set a username
- **THEN** profile becomes publicly accessible
- **AND** confirmation message displays

#### Scenario: Disable public profile
- **WHEN** user disables public profile toggle
- **THEN** profile becomes private
- **AND** public URL returns 404

#### Scenario: Enable without username
- **WHEN** user attempts to enable public profile without username
- **THEN** user is prompted to set username first
- **AND** toggle remains disabled until username is set

---

### Requirement: Public Profile Page

The system SHALL provide a public profile page displaying travel statistics.

**Route:** `/u/{username}`
**Access:** Public (no authentication required)

**Displayed information:**
- Username (display name)
- Total countries visited (count)
- Total days tracked (count)
- Mini world map showing visited countries
- Member since date

**Not displayed:**
- Email address
- Specific travel dates
- Daily calendar view
- Full travel record details

#### Scenario: View public profile
- **WHEN** visitor navigates to `/u/jane_travels`
- **THEN** public profile page displays
- **AND** travel statistics are shown
- **AND** mini world map highlights visited countries

#### Scenario: Private profile access
- **WHEN** visitor navigates to `/u/private_user`
- **AND** user has disabled public profile
- **THEN** 404 page displays
- **AND** no user information is revealed

#### Scenario: Non-existent username
- **WHEN** visitor navigates to `/u/nonexistent`
- **THEN** 404 page displays
- **AND** message indicates profile not found

---

### Requirement: Public Profile API

The system SHALL provide an API endpoint for public profile data.

**Endpoint:** `GET /api/users/:username/public`

**Response (public profile):**
```json
{
  "username": "jane_travels",
  "totalCountries": 25,
  "totalDays": 180,
  "memberSince": "2023-06-15",
  "countries": ["US", "FR", "DE", "JP", "..."]
}
```

**Response (private/not found):**
```json
{
  "error": "Profile not found"
}
```
Status: 404

#### Scenario: Fetch public profile data
- **WHEN** client requests `GET /api/users/jane_travels/public`
- **AND** profile is public
- **THEN** response status is 200
- **AND** response contains public statistics

#### Scenario: Fetch private profile data
- **WHEN** client requests `GET /api/users/private_user/public`
- **AND** profile is private
- **THEN** response status is 404
- **AND** response indicates profile not found

---

### Requirement: Mini World Map

The system SHALL display a simplified world map on public profiles.

**Features:**
- Smaller, non-interactive map
- Countries colored as visited/not visited (binary)
- No tooltips or click handlers
- Optimized for fast loading

#### Scenario: Mini map displays visited countries
- **WHEN** public profile loads
- **THEN** mini world map renders
- **AND** visited countries are highlighted
- **AND** unvisited countries are neutral gray

---

### Requirement: Social Sharing

The system SHALL provide sharing functionality for public profiles.

**Share options:**
- Copy link button
- Twitter/X share
- Facebook share
- LinkedIn share

**Share content:**
- URL: `https://countrycalendar.app/u/{username}`
- Default text: "Check out my travel history on Country Calendar!"

#### Scenario: Copy profile link
- **WHEN** user clicks copy link button
- **THEN** profile URL is copied to clipboard
- **AND** success message displays

#### Scenario: Share to Twitter
- **WHEN** user clicks Twitter share button
- **THEN** Twitter compose window opens
- **AND** pre-filled with profile URL and default text

---

### Requirement: OpenGraph Meta Tags

The system SHALL provide OpenGraph meta tags for social media previews.

**Tags:**
- `og:title`: "{username}'s Travel History"
- `og:description`: "Visited {count} countries | {days} days tracked"
- `og:image`: Dynamic image with stats and mini map
- `og:url`: Profile URL
- `twitter:card`: summary_large_image

#### Scenario: Social media preview
- **WHEN** user shares profile link on Twitter
- **THEN** Twitter card displays with custom image
- **AND** title shows username and "Travel History"
- **AND** description shows country and day counts

---

### Requirement: OpenGraph Image Generation

The system SHALL generate dynamic OpenGraph images for public profiles.

**Endpoint:** `GET /api/og/:username.png`

**Image specifications:**
- Size: 1200x630 pixels
- Format: PNG
- Content: Username, stats, mini world map, branding
- Cache: 1 hour TTL in Redis

**Rate limiting:** 60 requests per hour per IP

#### Scenario: Generate OG image
- **WHEN** social platform requests `GET /api/og/jane_travels.png`
- **THEN** image is generated with user's stats
- **AND** image is cached for 1 hour
- **AND** PNG image is returned

#### Scenario: OG image cache hit
- **WHEN** image is requested within cache TTL
- **THEN** cached image is returned
- **AND** no regeneration occurs

#### Scenario: Private profile OG image
- **WHEN** OG image is requested for private profile
- **THEN** generic placeholder image is returned
- **AND** no user data is revealed

#### Scenario: OG image rate limit
- **WHEN** IP exceeds 60 requests per hour
- **THEN** status 429 is returned
- **AND** error message indicates rate limit exceeded

---

### Requirement: Profile Settings API

The system SHALL provide API endpoints for managing profile settings.

**Endpoints:**
- `PATCH /api/profile/username` - Set or update username
- `PATCH /api/profile/visibility` - Toggle public/private
- `GET /api/profile/public-status` - Get current public profile status

#### Scenario: Set username via API
- **WHEN** authenticated user sends `PATCH /api/profile/username` with `{"username": "new_name"}`
- **THEN** username is updated
- **AND** response confirms new username

#### Scenario: Toggle visibility via API
- **WHEN** authenticated user sends `PATCH /api/profile/visibility` with `{"isPublic": true}`
- **THEN** profile visibility is updated
- **AND** response confirms new status

---

### Requirement: Profile Settings UI

The system SHALL provide UI for managing public profile settings.

**Location:** Profile/Settings page

**Elements:**
- Username input field with validation feedback
- Availability check (real-time)
- Public/private toggle switch
- Preview link (when public)
- Share buttons (when public)

#### Scenario: Username availability check
- **WHEN** user types username in input field
- **THEN** availability is checked in real-time
- **AND** green checkmark shows if available
- **AND** red X shows if taken or invalid

#### Scenario: Preview public profile
- **WHEN** user has public profile enabled
- **THEN** "Preview" link is shown
- **AND** clicking opens profile in new tab
