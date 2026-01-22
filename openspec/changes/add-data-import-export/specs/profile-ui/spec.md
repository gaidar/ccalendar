## ADDED Requirements

### Requirement: Import Data Section
The profile/account page SHALL provide a data import section.

#### Scenario: Import section display
- **WHEN** the profile page is displayed
- **THEN** an "Import Data" section SHALL be available
- **AND** it SHALL appear after the export section (if present) or in the data management area

#### Scenario: Import section layout
- **WHEN** the import section is displayed
- **THEN** it SHALL include:
  - Title "Import Travel Data"
  - Description explaining import behavior (overwrites existing data in date range)
  - File upload area accepting CSV and JSON
  - Supported formats indication

#### Scenario: File upload interaction
- **WHEN** a user interacts with the file upload area
- **THEN** they SHALL be able to click to select a file
- **AND** they SHALL be able to drag and drop a file
- **AND** accepted file types SHALL be limited to .csv and .json

#### Scenario: File selection feedback
- **WHEN** a user selects a file
- **THEN** the filename SHALL be displayed
- **AND** the file size SHALL be displayed
- **AND** a "Remove" option SHALL be available to clear the selection

### Requirement: Import Preview
The import flow SHALL show a preview before executing.

#### Scenario: Import preview display
- **WHEN** a user selects a valid import file
- **THEN** a preview SHALL be displayed showing:
  - Number of records to import
  - Date range of the import (earliest and latest dates)
  - Warning that existing data in this range will be overwritten
  - Sample of records (first 5)

#### Scenario: Import confirmation required
- **WHEN** the preview is displayed
- **THEN** "Cancel" and "Import" buttons SHALL be available
- **AND** the user MUST click "Import" to proceed
- **AND** clicking "Cancel" SHALL clear the file selection

#### Scenario: Preview loading state
- **WHEN** the file is being parsed for preview
- **THEN** a loading indicator SHALL be displayed
- **AND** the user SHALL NOT be able to submit

### Requirement: Import Progress and Results
The import flow SHALL show progress and results.

#### Scenario: Import in progress
- **WHEN** an import is being processed
- **THEN** a loading indicator SHALL be displayed
- **AND** the "Import" button SHALL be disabled
- **AND** a message "Importing your travel data..." SHALL be shown

#### Scenario: Import success
- **WHEN** an import completes successfully
- **THEN** a success message SHALL be displayed
- **AND** the message SHALL include:
  - Number of records imported
  - Number of records overwritten (deleted)
  - Date range affected
- **AND** the file selection SHALL be cleared

#### Scenario: Import error display
- **WHEN** an import fails
- **THEN** an error message SHALL be displayed
- **AND** the message SHALL explain the failure (file too large, invalid format, validation errors)
- **AND** for validation errors, specific issues SHALL be listed (up to 10)

#### Scenario: Import validation errors detail
- **WHEN** import fails due to data validation
- **THEN** the error display SHALL show:
  - Total number of invalid records
  - List of first 10 errors with line/index number and issue description
  - Suggestion to fix the file and retry

### Requirement: Import Rate Limit Handling
The import UI SHALL handle rate limiting gracefully.

#### Scenario: Import rate limit reached
- **WHEN** an import fails due to rate limiting
- **THEN** an error message SHALL indicate the user has reached the import limit
- **AND** the message SHALL indicate when they can try again
- **AND** the "Import" button SHALL be disabled until the limit resets

### Requirement: Import Section Responsive Design
The import section SHALL be responsive.

#### Scenario: Mobile import layout
- **WHEN** viewed on mobile (< 640px)
- **THEN** the import section SHALL stack vertically
- **AND** the file upload area SHALL be full-width
- **AND** touch targets SHALL be at least 44x44 pixels

#### Scenario: Desktop import layout
- **WHEN** viewed on desktop (>= 768px)
- **THEN** the import section MAY use a wider container
- **AND** the preview MAY display in a modal dialog

## MODIFIED Requirements

### Requirement: Profile Page
The application SHALL provide a profile page for managing user account settings.

#### Scenario: Profile page access
- **WHEN** an authenticated user navigates to `/profile`
- **THEN** the profile page SHALL be displayed
- **AND** the page SHALL load the user's profile data

#### Scenario: Profile page layout
- **WHEN** the profile page is displayed
- **THEN** it SHALL include:
  - Profile information section
  - Change password section
  - Connected accounts section
  - Data management section (export and import)
  - Delete account section (danger zone)

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user navigates to `/profile`
- **THEN** they SHALL be redirected to the login page
