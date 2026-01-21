## ADDED Requirements

### Requirement: Reports Page

The application SHALL provide a reports page for viewing travel statistics.

#### Scenario: Reports page access
- **WHEN** an authenticated user navigates to `/reports`
- **THEN** the reports page SHALL be displayed
- **AND** the page SHALL load summary data for the default period (30 days)

#### Scenario: Reports page layout
- **WHEN** the reports page is displayed
- **THEN** it SHALL include:
  - Date range filter at the top
  - Summary cards section
  - Country statistics section
  - Export options section

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user navigates to `/reports`
- **THEN** they SHALL be redirected to the login page

### Requirement: Summary Cards

The reports page SHALL display summary statistics in card format.

#### Scenario: Summary cards display
- **WHEN** summary data is loaded
- **THEN** summary cards SHALL display:
  - Total days traveled (with calendar icon)
  - Total countries visited (with globe icon)
  - Current date range being displayed

#### Scenario: Summary cards loading state
- **WHEN** summary data is being fetched
- **THEN** skeleton placeholders SHALL be displayed for each card

#### Scenario: Summary cards layout
- **WHEN** viewed on mobile (< 640px)
- **THEN** summary cards SHALL stack in a single column

#### Scenario: Summary cards desktop layout
- **WHEN** viewed on desktop (>= 768px)
- **THEN** summary cards SHALL display in a row (2-3 columns)

### Requirement: Country Statistics View

The reports page SHALL display statistics per country.

#### Scenario: Country statistics list
- **WHEN** the country statistics section is displayed
- **THEN** countries SHALL be listed in descending order by days visited
- **AND** each entry SHALL show: country flag/emoji, name, day count

#### Scenario: Country statistics visualization
- **WHEN** a country entry is displayed
- **THEN** a percentage bar SHALL visualize days relative to the maximum
- **AND** the country's assigned color SHALL be used in the visualization

#### Scenario: Country statistics default view
- **WHEN** the user has visited more than 10 countries
- **THEN** the top 10 countries SHALL be displayed by default
- **AND** a "Show all" button SHALL reveal the complete list

#### Scenario: Country statistics expanded view
- **WHEN** a user clicks "Show all"
- **THEN** all countries SHALL be displayed
- **AND** a "Show less" button SHALL collapse back to top 10

#### Scenario: Country statistics loading state
- **WHEN** data is being fetched
- **THEN** skeleton rows SHALL be displayed

#### Scenario: Country statistics empty state
- **WHEN** the user has no travel records in the selected period
- **THEN** a message "No travel data for this period" SHALL be displayed

### Requirement: Date Range Filter

The reports page SHALL provide date range filtering.

#### Scenario: Preset period buttons
- **WHEN** the date range filter is displayed
- **THEN** buttons for preset periods SHALL be available: 7 days, 30 days, 90 days, 365 days
- **AND** the currently selected period SHALL be visually highlighted

#### Scenario: Default period
- **WHEN** the reports page loads
- **THEN** the 30-day period SHALL be selected by default

#### Scenario: Preset period selection
- **WHEN** a user clicks a preset period button
- **THEN** the period SHALL be selected
- **AND** summary and statistics SHALL refresh for the new period

#### Scenario: Custom date range option
- **WHEN** a user clicks the "Custom" option
- **THEN** a date range picker SHALL open
- **AND** the user SHALL be able to select start and end dates

#### Scenario: Custom range validation
- **WHEN** a user selects a custom date range exceeding 5 years
- **THEN** an error message SHALL be displayed
- **AND** the range SHALL NOT be applied

#### Scenario: Custom range selection
- **WHEN** a user selects a valid custom date range
- **THEN** the range SHALL be applied
- **AND** summary and statistics SHALL refresh for the custom range

### Requirement: Reports Empty State

The reports page SHALL handle empty data gracefully.

#### Scenario: New user empty state
- **WHEN** a user with no travel records views the reports page
- **THEN** a friendly empty state message SHALL be displayed
- **AND** a call-to-action to add travel records SHALL be provided

#### Scenario: Empty period
- **WHEN** no records exist for the selected date range
- **THEN** summary SHALL show zeros
- **AND** country statistics SHALL show "No travel data for this period"

### Requirement: Reports Error State

The reports page SHALL handle errors gracefully.

#### Scenario: Data fetch error
- **WHEN** fetching reports data fails
- **THEN** an error message SHALL be displayed
- **AND** a "Retry" button SHALL be available

#### Scenario: Retry after error
- **WHEN** a user clicks "Retry"
- **THEN** the data fetch SHALL be attempted again

### Requirement: Reports Responsive Design

The reports page SHALL be responsive across all device sizes.

#### Scenario: Mobile layout
- **WHEN** viewed on mobile (< 640px)
- **THEN** all sections SHALL stack vertically
- **AND** touch targets SHALL be at least 44x44 pixels

#### Scenario: Tablet layout
- **WHEN** viewed on tablet (640px - 1024px)
- **THEN** summary cards MAY display in 2 columns
- **AND** other sections SHALL maintain readability

#### Scenario: Desktop layout
- **WHEN** viewed on desktop (> 1024px)
- **THEN** the layout MAY use wider containers
- **AND** summary cards SHALL display in a row
