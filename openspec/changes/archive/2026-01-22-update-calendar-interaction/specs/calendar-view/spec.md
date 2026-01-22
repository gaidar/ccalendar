## MODIFIED Requirements

### Requirement: Date Range Selection

The application SHALL support selecting a range of dates for bulk operations using a click-based interaction model.

#### Scenario: Single date selection via double-click
- **WHEN** a user double-clicks on a calendar day (not in the future)
- **THEN** the country picker SHALL open for that single date
- **AND** any existing countries for that date SHALL be pre-selected

#### Scenario: Range selection via two clicks
- **WHEN** a user single-clicks on a first date (not in the future)
- **THEN** that date SHALL be visually marked as "range start"
- **AND** a subtle indicator SHALL show that a second click will complete the range

#### Scenario: Complete range selection
- **WHEN** a user has clicked a first date (range start)
- **AND** the user single-clicks on a second date
- **THEN** all dates between the two clicks SHALL be visually highlighted as a range
- **AND** the bulk update modal SHALL open automatically
- **AND** if the second date is before the first, they SHALL be swapped

#### Scenario: Range hover preview
- **WHEN** a user has clicked a first date (range start)
- **AND** the user hovers over other dates
- **THEN** a preview highlight SHALL show the potential range
- **AND** the preview SHALL use a lighter/dimmed version of the selection color

#### Scenario: Cancel range selection via Escape
- **WHEN** a user has clicked a first date (range start)
- **AND** the user presses Escape
- **THEN** the range start SHALL be cleared
- **AND** the calendar SHALL return to normal state

#### Scenario: Cancel range selection via clicking same date
- **WHEN** a user has clicked a first date (range start)
- **AND** the user single-clicks on the same date again
- **THEN** the range start SHALL be cleared
- **AND** the country picker SHALL open for that single date

#### Scenario: Range selection validation
- **WHEN** a user selects a date range
- **THEN** future dates SHALL NOT be selectable as range end
- **AND** the range SHALL be limited to dates up to and including today

#### Scenario: Keyboard alternative for double-click
- **WHEN** a user focuses a day cell and presses Enter or Space
- **THEN** the country picker SHALL open for that date (equivalent to double-click)
- **AND** pressing Enter/Space again while picker is closed SHALL open it

#### Scenario: Touch device support
- **WHEN** a user taps a date on a touch device
- **THEN** a single tap SHALL start range selection (mark as range start)
- **AND** a second tap on another date SHALL complete the range
- **AND** a tap on the same date SHALL open the country picker for that date
- **AND** a long-press MAY provide additional options (future enhancement)

### Requirement: Day Cell Display

Each day cell SHALL display the date and any associated travel records with country flags.

#### Scenario: Day cell with no records
- **WHEN** a day has no travel records
- **THEN** only the day number SHALL be displayed
- **AND** the cell SHALL have the default background

#### Scenario: Day cell with country records showing flags
- **WHEN** a day has 1-3 travel records
- **THEN** the day number SHALL be displayed
- **AND** small country flag icons SHALL be displayed for each record
- **AND** flags SHALL be 16x12px on mobile, 20x15px on desktop

#### Scenario: Day cell with overflow records
- **WHEN** a day has more than 3 travel records
- **THEN** 3 country flag icons SHALL be displayed
- **AND** an overflow indicator "+N" SHALL show the additional count

#### Scenario: Flag loading fallback
- **WHEN** a country flag fails to load
- **THEN** the country's color dot SHALL be displayed as fallback
- **AND** no error SHALL be shown to the user

#### Scenario: Range start indicator
- **WHEN** a date is selected as range start (first click)
- **THEN** the cell SHALL have a distinct "pending selection" style
- **AND** a pulsing or highlighted border SHALL indicate waiting for second click

## ADDED Requirements

### Requirement: Calendar Help Block

The application SHALL display an explanatory help block to guide users on calendar interactions.

#### Scenario: Help block display for new users
- **WHEN** a user visits the calendar page
- **AND** the user has not dismissed the help block before
- **THEN** a help block SHALL be displayed above or below the calendar
- **AND** the block SHALL explain the double-click and range selection interactions

#### Scenario: Help block content
- **WHEN** the help block is displayed
- **THEN** it SHALL contain:
  - Text explaining double-click opens country picker for one day
  - Text explaining click-click selects a date range
  - A visual diagram or icons illustrating the interactions
  - A dismiss/close button

#### Scenario: Dismiss help block
- **WHEN** a user clicks the dismiss button on the help block
- **THEN** the help block SHALL be hidden
- **AND** the dismissed state SHALL be persisted in localStorage
- **AND** the help block SHALL NOT appear again on subsequent visits

#### Scenario: Re-show help block
- **WHEN** a user has dismissed the help block
- **THEN** a small help icon/button SHALL be visible in the calendar header
- **AND** clicking the help icon SHALL re-display the help block

#### Scenario: Help block accessibility
- **WHEN** the help block is displayed
- **THEN** it SHALL have role="complementary" or role="note"
- **AND** the dismiss button SHALL be keyboard accessible
- **AND** screen readers SHALL announce the help content

### Requirement: Country Flags Display

The application SHALL display country flags as visual identifiers throughout the calendar interface.

#### Scenario: Flag assets bundled locally
- **WHEN** the application is built
- **THEN** all country flag SVG files SHALL be bundled with the application
- **AND** flags SHALL be served from `/flags/{country-code}.svg` or similar local path
- **AND** no external CDN SHALL be required for flag display

#### Scenario: Flag component rendering
- **WHEN** a country is displayed anywhere in the UI
- **THEN** the Flag component SHALL render the appropriate country flag
- **AND** the component SHALL accept a country code (ISO 3166-1 alpha-2)
- **AND** the component SHALL support size variants (sm, md, lg)

#### Scenario: Flag preloading
- **WHEN** the calendar page loads
- **THEN** flags for recent countries SHALL be preloaded
- **AND** flags for countries in the current month view SHALL be preloaded
- **AND** other flags SHALL be loaded on demand

#### Scenario: Flag not found handling
- **WHEN** a flag SVG does not exist for a country code
- **THEN** a generic placeholder or the country's color SHALL be displayed
- **AND** no console error SHALL be logged to the user
