## ADDED Requirements

### Requirement: Month Calendar Grid

The application SHALL display a month calendar grid for viewing and managing travel records.

#### Scenario: Calendar grid structure
- **WHEN** the calendar page is displayed
- **THEN** a month grid SHALL be rendered with 7 columns (one per day of week)
- **AND** the grid SHALL display 5-6 rows depending on the month
- **AND** day headers SHALL show day names (full on desktop, abbreviated on mobile)

#### Scenario: Calendar displays current month by default
- **WHEN** a user navigates to the calendar page
- **THEN** the current month SHALL be displayed
- **AND** today's date SHALL be visually highlighted

#### Scenario: Adjacent month days displayed
- **WHEN** the calendar month view is rendered
- **THEN** leading days from the previous month SHALL be displayed (grayed)
- **AND** trailing days from the next month SHALL be displayed (grayed)
- **AND** clicking adjacent month days SHALL navigate to that month

### Requirement: Day Cell Display

Each day cell SHALL display the date and any associated travel records.

#### Scenario: Day cell with no records
- **WHEN** a day has no travel records
- **THEN** only the day number SHALL be displayed
- **AND** the cell SHALL have the default background

#### Scenario: Day cell with country records
- **WHEN** a day has 1-3 travel records
- **THEN** the day number SHALL be displayed
- **AND** country color dots SHALL be displayed for each record

#### Scenario: Day cell with overflow records
- **WHEN** a day has more than 3 travel records
- **THEN** 3 country color dots SHALL be displayed
- **AND** an overflow indicator "+N" SHALL show the additional count

#### Scenario: Today highlight
- **WHEN** a day is the current date
- **THEN** the cell SHALL have a distinct visual indicator (e.g., blue border)
- **AND** the highlight SHALL be visible regardless of selection state

#### Scenario: Selected day state
- **WHEN** a user selects a day
- **THEN** the cell SHALL have a selected visual state (e.g., blue background)
- **AND** the country picker SHALL open

#### Scenario: Future date state
- **WHEN** a day is in the future
- **THEN** the cell SHALL be visually grayed out
- **AND** clicking the cell SHALL NOT open the country picker
- **AND** a tooltip MAY indicate "Cannot add records for future dates"

### Requirement: Calendar Navigation

The application SHALL provide navigation controls for changing the displayed month.

#### Scenario: Previous month navigation
- **WHEN** a user clicks the previous month button
- **THEN** the calendar SHALL display the previous month
- **AND** travel records for the new month SHALL be fetched

#### Scenario: Next month navigation
- **WHEN** a user clicks the next month button
- **THEN** the calendar SHALL display the next month
- **AND** travel records for the new month SHALL be fetched

#### Scenario: Month/year selector
- **WHEN** a user clicks on the month/year display
- **THEN** a selector SHALL open to choose a specific month and year
- **AND** selecting a month/year SHALL navigate to that view

#### Scenario: Today button
- **WHEN** a user clicks the "Today" button
- **THEN** the calendar SHALL navigate to the current month
- **AND** today's date SHALL be visible and highlighted

#### Scenario: Keyboard navigation between days
- **WHEN** a user presses arrow keys while focus is on a day cell
- **THEN** left/right arrows SHALL move focus to adjacent days
- **AND** up/down arrows SHALL move focus to the same day in adjacent weeks

### Requirement: Date Range Selection

The application SHALL support selecting a range of dates for bulk operations.

#### Scenario: Enter range selection mode
- **WHEN** a user activates range selection mode (button or long-press)
- **THEN** the calendar SHALL enter range selection mode
- **AND** a visual indicator SHALL show range mode is active

#### Scenario: Select date range
- **WHEN** a user clicks a start date in range mode
- **AND** then clicks an end date
- **THEN** all dates between start and end SHALL be visually highlighted
- **AND** the bulk update modal SHALL open

#### Scenario: Range selection validation
- **WHEN** a user selects a date range
- **THEN** future dates SHALL NOT be selectable in the range
- **AND** if start date is after end date, they SHALL be swapped

#### Scenario: Cancel range selection
- **WHEN** a user cancels range selection (Escape or cancel button)
- **THEN** the range highlight SHALL be cleared
- **AND** the calendar SHALL return to normal selection mode

### Requirement: Calendar Responsive Design

The calendar SHALL adapt to different screen sizes.

#### Scenario: Mobile layout
- **WHEN** the calendar is viewed on mobile (< 640px)
- **THEN** day headers SHALL use single-letter abbreviations (M, T, W...)
- **AND** day cells SHALL be compact but maintain 44x44px touch targets
- **AND** the country picker SHALL open as a bottom sheet

#### Scenario: Tablet layout
- **WHEN** the calendar is viewed on tablet (640px - 1024px)
- **THEN** day headers SHALL use abbreviated names (Mon, Tue, Wed...)
- **AND** day cells SHALL be larger with comfortable touch targets

#### Scenario: Desktop layout
- **WHEN** the calendar is viewed on desktop (> 1024px)
- **THEN** day headers SHALL use full day names (Monday, Tuesday...)
- **AND** day cells SHALL have hover states
- **AND** keyboard navigation SHALL be fully supported

### Requirement: Calendar Accessibility

The calendar SHALL be accessible to users with disabilities.

#### Scenario: Screen reader support
- **WHEN** a screen reader user navigates the calendar
- **THEN** each day cell SHALL announce the date and number of records
- **AND** the current month and year SHALL be announced on navigation
- **AND** today's date SHALL be indicated with `aria-current="date"`

#### Scenario: Keyboard focus management
- **WHEN** a user navigates the calendar with keyboard
- **THEN** focus SHALL be visible on the focused day cell
- **AND** focus SHALL move logically through the calendar grid
- **AND** focus SHALL be trapped in modals when open

#### Scenario: Color independence
- **WHEN** country records are displayed
- **THEN** information SHALL NOT rely solely on color
- **AND** tooltips or labels SHALL provide country names on hover/focus

### Requirement: Calendar Loading States

The calendar SHALL provide feedback during data loading.

#### Scenario: Initial load
- **WHEN** the calendar page is first loaded
- **THEN** a skeleton grid SHALL be displayed
- **AND** the skeleton SHALL match the calendar grid structure

#### Scenario: Month navigation loading
- **WHEN** navigating to a new month
- **THEN** a loading indicator SHALL be displayed
- **AND** the previous month MAY remain visible until new data loads

#### Scenario: Empty month state
- **WHEN** a month has no travel records
- **THEN** the calendar grid SHALL still be displayed
- **AND** a subtle message MAY indicate "No travel records for this month"
