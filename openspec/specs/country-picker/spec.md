# country-picker Specification

## Purpose
Provides the country selection interface including the picker modal, search functionality, recent countries quick-pick, country list, and bulk update modal for managing travel records.
## Requirements
### Requirement: Country Picker Modal

The application SHALL provide a country picker modal for selecting countries on a specific date.

#### Scenario: Open country picker for single date
- **WHEN** a user clicks on a calendar day (not in the future)
- **THEN** the country picker SHALL open
- **AND** the selected date SHALL be displayed in the picker header
- **AND** any existing countries for that date SHALL be pre-selected

#### Scenario: Country picker desktop layout
- **WHEN** the country picker opens on desktop (>= 768px)
- **THEN** it SHALL display as a centered modal dialog
- **AND** the modal SHALL have a maximum width (e.g., 480px)
- **AND** a backdrop SHALL dim the background

#### Scenario: Country picker mobile layout
- **WHEN** the country picker opens on mobile (< 768px)
- **THEN** it SHALL display as a bottom sheet
- **AND** the sheet SHALL slide up from the bottom
- **AND** the sheet SHALL have a maximum height of 90% viewport

#### Scenario: Close country picker
- **WHEN** a user clicks the backdrop, close button, or presses Escape
- **THEN** the country picker SHALL close
- **AND** unsaved changes SHALL be discarded

### Requirement: Country Search

The country picker SHALL provide fuzzy search functionality.

#### Scenario: Search input field
- **WHEN** the country picker is open
- **THEN** a search input field SHALL be displayed at the top
- **AND** the field SHALL have a placeholder "Search countries..."
- **AND** the field SHALL auto-focus on picker open (desktop only)

#### Scenario: Fuzzy search matching
- **WHEN** a user types in the search field
- **THEN** the country list SHALL filter using fuzzy matching (Fuse.js)
- **AND** matches SHALL include partial matches and typo tolerance
- **AND** results SHALL be sorted by relevance

#### Scenario: Search highlights
- **WHEN** search results are displayed
- **THEN** the matching portion of country names SHALL be highlighted

#### Scenario: Search no results
- **WHEN** a search query returns no matches
- **THEN** a message "No countries found" SHALL be displayed
- **AND** a suggestion to try a different search MAY be shown

#### Scenario: Search debouncing
- **WHEN** a user types in the search field
- **THEN** the search SHALL be debounced (e.g., 150ms delay)
- **AND** the UI SHALL remain responsive during typing

### Requirement: Recent Countries Quick-Pick

The country picker SHALL display recently used countries with flag icons for quick selection.

#### Scenario: Recent countries display with flags
- **WHEN** the country picker opens
- **AND** the user has previously selected countries
- **THEN** a "Recent" section SHALL display at the top
- **AND** up to 8 recent countries SHALL be shown as chips
- **AND** each chip SHALL display: flag icon, country name (abbreviated if needed)

#### Scenario: Quick-pick selection
- **WHEN** a user clicks a recent country chip
- **THEN** the country SHALL be toggled (selected/deselected)
- **AND** the main list checkbox SHALL update accordingly

#### Scenario: No recent countries
- **WHEN** the country picker opens for a new user
- **AND** no countries have been selected previously
- **THEN** the "Recent" section SHALL NOT be displayed

#### Scenario: Recent countries persistence
- **WHEN** a user selects countries and saves
- **THEN** the selected countries SHALL be added to recent history
- **AND** recent history SHALL persist across sessions (localStorage)

#### Scenario: Recent chip flag display
- **WHEN** a recent country chip is rendered
- **THEN** a small flag icon (12x9px) SHALL appear before the country text
- **AND** the chip background MAY use a subtle tint of the country's assigned color

### Requirement: Country List

The country picker SHALL display a scrollable list of all countries with flag icons.

#### Scenario: Country list display with flags
- **WHEN** the country picker is open
- **THEN** all 249 countries SHALL be available in the list
- **AND** countries SHALL be sorted alphabetically by name
- **AND** each country SHALL display: checkbox, flag icon, name, color indicator

#### Scenario: Country selection toggle
- **WHEN** a user clicks on a country row or checkbox
- **THEN** the country SHALL be toggled (selected/deselected)
- **AND** the checkbox SHALL reflect the current state

#### Scenario: Multiple countries per day
- **WHEN** a user selects multiple countries
- **THEN** all selected countries SHALL be tracked
- **AND** there SHALL be a maximum of 10 countries per day

#### Scenario: Maximum countries reached
- **WHEN** a user attempts to select more than 10 countries
- **THEN** additional selections SHALL be prevented
- **AND** a message SHALL indicate the maximum limit

#### Scenario: Country color display
- **WHEN** a country is displayed in the list
- **THEN** the country's assigned color SHALL be visible as a small dot or badge
- **AND** the color SHALL appear after the flag icon
- **AND** the color SHALL match the calendar day cell indicators

#### Scenario: Flag display in country row
- **WHEN** a country row is rendered
- **THEN** a flag icon (16x12px) SHALL appear before the country name
- **AND** the flag SHALL be the country's official flag
- **AND** flags SHALL have rounded corners (2px radius) for visual consistency

### Requirement: Country Picker Actions

The country picker SHALL provide action buttons for saving or clearing selections.

#### Scenario: Save button
- **WHEN** a user clicks the "Save" button
- **THEN** the selected countries SHALL be saved for the date
- **AND** the picker SHALL close
- **AND** the calendar SHALL update optimistically

#### Scenario: Clear button
- **WHEN** a user clicks the "Clear" button
- **THEN** all selections SHALL be removed
- **AND** the picker SHALL remain open for new selections

#### Scenario: Save with no changes
- **WHEN** the user clicks "Save" without making changes
- **THEN** the picker SHALL close
- **AND** no API call SHALL be made

#### Scenario: Save removes countries
- **WHEN** a user deselects all countries and clicks "Save"
- **THEN** all travel records for that date SHALL be deleted
- **AND** the calendar day cell SHALL show no country indicators

### Requirement: Bulk Update Modal

The application SHALL provide a modal for bulk updating countries across a date range.

#### Scenario: Bulk update modal display
- **WHEN** a user completes date range selection
- **THEN** the bulk update modal SHALL open
- **AND** the selected date range SHALL be displayed in the header
- **AND** the country picker interface SHALL be embedded

#### Scenario: Bulk update confirmation
- **WHEN** a user selects countries and clicks "Apply"
- **THEN** a confirmation message SHALL display: "Add {countries} to {X} days?"
- **AND** "Confirm" and "Cancel" buttons SHALL be available

#### Scenario: Bulk update execution
- **WHEN** a user confirms the bulk update
- **THEN** a loading indicator SHALL be displayed
- **AND** the bulk update API SHALL be called
- **AND** on success, the modal SHALL close and calendar SHALL refresh

#### Scenario: Bulk update replaces existing
- **WHEN** a bulk update is executed on dates with existing records
- **THEN** a warning SHALL indicate existing records will be replaced
- **AND** the user SHALL confirm before proceeding

#### Scenario: Bulk update error handling
- **WHEN** the bulk update API returns an error
- **THEN** an error message SHALL be displayed
- **AND** the modal SHALL remain open
- **AND** a retry option SHALL be available

### Requirement: Country Picker Accessibility

The country picker SHALL be accessible.

#### Scenario: Keyboard navigation in list
- **WHEN** a user navigates the country list with keyboard
- **THEN** up/down arrows SHALL move focus between items
- **AND** Space/Enter SHALL toggle selection
- **AND** Tab SHALL move to action buttons

#### Scenario: Screen reader support
- **WHEN** a screen reader user interacts with the picker
- **THEN** the picker title and date SHALL be announced
- **AND** selected state of countries SHALL be announced
- **AND** the total selected count SHALL be available

#### Scenario: Focus trap
- **WHEN** the country picker is open
- **THEN** focus SHALL be trapped within the picker
- **AND** Tab SHALL cycle through picker elements only
- **AND** focus SHALL return to trigger element on close

