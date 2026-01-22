## MODIFIED Requirements

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
