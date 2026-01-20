## ADDED Requirements

### Requirement: Calendar State Management

The application SHALL manage calendar UI state using Zustand.

#### Scenario: Selected date state
- **WHEN** a user selects a date on the calendar
- **THEN** the selected date SHALL be stored in the calendar store
- **AND** the country picker SHALL open for that date

#### Scenario: View month state
- **WHEN** a user navigates to a different month
- **THEN** the current view month SHALL be stored in the calendar store
- **AND** travel records for the new month SHALL be fetched

#### Scenario: Range selection state
- **WHEN** a user enters date range selection mode
- **THEN** the range mode flag SHALL be set to true
- **AND** start and end dates SHALL be tracked as they are selected

#### Scenario: State persistence
- **WHEN** a user refreshes the page
- **THEN** the selected date and view month MAY be restored from URL or session
- **AND** the user SHALL see the same calendar view as before refresh

### Requirement: Travel Records Data Fetching

The application SHALL fetch travel records using TanStack Query.

#### Scenario: Fetch records for visible month
- **WHEN** the calendar displays a month
- **THEN** travel records SHALL be fetched for the visible date range
- **AND** the range SHALL include leading/trailing days from adjacent months
- **AND** the query key SHALL include the month/year for caching

#### Scenario: Records caching
- **WHEN** records for a month have been fetched
- **AND** the user navigates away and back to that month
- **THEN** cached records SHALL be displayed immediately
- **AND** a background refetch MAY occur to check for updates

#### Scenario: Records invalidation
- **WHEN** a user creates, updates, or deletes a travel record
- **THEN** the records query SHALL be invalidated
- **AND** fresh data SHALL be fetched for the affected month

#### Scenario: Fetch error handling
- **WHEN** fetching travel records fails
- **THEN** an error state SHALL be displayed
- **AND** a "Retry" button SHALL be available
- **AND** the error SHALL be logged for debugging

### Requirement: Optimistic UI Updates

The application SHALL provide optimistic updates for a responsive user experience.

#### Scenario: Optimistic record creation
- **WHEN** a user adds a country to a date
- **THEN** the calendar SHALL update immediately (optimistically)
- **AND** a subtle loading indicator MAY be shown
- **AND** the API call SHALL happen in the background

#### Scenario: Optimistic record deletion
- **WHEN** a user removes a country from a date
- **THEN** the calendar SHALL update immediately (optimistically)
- **AND** the country indicator SHALL be removed from the day cell
- **AND** the API call SHALL happen in the background

#### Scenario: Optimistic rollback on error
- **WHEN** an optimistic update fails (API error)
- **THEN** the calendar SHALL rollback to the previous state
- **AND** an error toast SHALL notify the user
- **AND** the user MAY retry the operation

#### Scenario: Optimistic update during bulk operation
- **WHEN** a bulk update is in progress
- **THEN** the affected days SHALL show a loading state
- **AND** optimistic updates SHALL NOT be applied until confirmed

### Requirement: Countries Data Hook

The application SHALL provide a hook for accessing countries data.

#### Scenario: Fetch countries list
- **WHEN** the countries hook is used
- **THEN** the countries list SHALL be fetched from the API
- **AND** the data SHALL be cached indefinitely (static data)

#### Scenario: Get country by code
- **WHEN** `getCountryByCode("FR")` is called
- **THEN** the country object for France SHALL be returned
- **AND** the result SHALL include code, name, and color

#### Scenario: Get country color
- **WHEN** `getCountryColor("US")` is called
- **THEN** the hex color for United States SHALL be returned
- **AND** the color SHALL be used for calendar day indicators

#### Scenario: Countries loading state
- **WHEN** countries data is being fetched
- **THEN** a loading state SHALL be available from the hook
- **AND** components MAY show loading skeletons

### Requirement: Travel Records Hook

The application SHALL provide a hook for travel records CRUD operations.

#### Scenario: Create record mutation
- **WHEN** `createRecord(date, countryCode)` is called
- **THEN** a POST request SHALL be made to the API
- **AND** the calendar SHALL update optimistically
- **AND** the mutation status SHALL be available (loading, error, success)

#### Scenario: Delete record mutation
- **WHEN** `deleteRecord(recordId)` is called
- **THEN** a DELETE request SHALL be made to the API
- **AND** the calendar SHALL update optimistically
- **AND** the mutation status SHALL be available

#### Scenario: Bulk update mutation
- **WHEN** `bulkUpdate(startDate, endDate, countryCodes)` is called
- **THEN** a POST request SHALL be made to the bulk update API
- **AND** the affected months SHALL be invalidated on success
- **AND** the mutation status SHALL be available

#### Scenario: Records for date helper
- **WHEN** `getRecordsForDate(date)` is called
- **THEN** all travel records for that date SHALL be returned from cache
- **AND** if not cached, an empty array SHALL be returned

### Requirement: Calendar URL State

The application SHALL support persisting calendar state in the URL for shareability.

#### Scenario: View month in URL
- **WHEN** a user navigates to a specific month
- **THEN** the URL MAY be updated to include the month/year
- **AND** navigating to that URL SHALL display the specified month

#### Scenario: Selected date in URL
- **WHEN** a user selects a date
- **THEN** the URL MAY be updated to include the selected date
- **AND** navigating to that URL SHALL select and highlight that date

#### Scenario: Default URL state
- **WHEN** a user navigates to the calendar without URL parameters
- **THEN** the current month SHALL be displayed
- **AND** no date SHALL be pre-selected

### Requirement: Calendar Data Prefetching

The application SHALL support prefetching data for adjacent months to improve navigation speed.

#### Scenario: Prefetch adjacent months
- **WHEN** a month is displayed
- **THEN** data for the previous and next months MAY be prefetched
- **AND** prefetching SHALL use low priority
- **AND** prefetched data SHALL be available in cache

#### Scenario: Prefetch on hover
- **WHEN** a user hovers over the navigation buttons (desktop)
- **THEN** data for the target month MAY be prefetched
- **AND** navigation SHALL feel instant when clicked
