# performance Specification Delta

## MODIFIED Requirements

### Requirement: Database Indexes

The database SHALL have appropriate indexes for query performance.

#### Scenario: User email index
- **WHEN** the database is set up
- **THEN** a unique index on `users.email` SHALL exist

#### Scenario: Travel records date index
- **WHEN** the database is set up
- **THEN** a compound index on `travel_records(userId, date)` SHALL exist

#### Scenario: Travel records unique constraint
- **WHEN** the database is set up
- **THEN** a unique constraint on `travel_records(userId, date, countryCode)` SHALL exist

#### Scenario: OAuth unique constraint
- **WHEN** the database is set up
- **THEN** a unique constraint on `oauth_accounts(provider, providerId)` SHALL exist

#### Scenario: Support ticket reference index
- **WHEN** the database is set up
- **THEN** a unique index on `support_tickets.referenceId` SHALL exist

#### Scenario: User createdAt index
- **WHEN** the database is set up
- **THEN** an index on `users.createdAt` SHALL exist
- **AND** this index SHALL support admin user listing sorted by creation date

#### Scenario: Support ticket compound index
- **WHEN** the database is set up
- **THEN** a compound index on `support_tickets(userId, createdAt)` SHALL exist
- **AND** this index SHALL support user ticket queries with date ordering

#### Scenario: OAuth userId index
- **WHEN** the database is set up
- **THEN** an index on `oauth_accounts.userId` SHALL exist
- **AND** this index SHALL support foreign key lookups

---

### Requirement: Frontend Optimizations

The frontend SHALL implement performance optimizations.

#### Scenario: Component memoization
- **WHEN** rendering expensive components
- **THEN** React.memo SHALL be used to prevent unnecessary re-renders

#### Scenario: DayCell memoization
- **WHEN** rendering the calendar view
- **THEN** DayCell component SHALL be wrapped with React.memo
- **AND** this SHALL prevent re-rendering all 42 cells on parent state changes

#### Scenario: Admin list row memoization
- **WHEN** rendering admin user list or ticket list
- **THEN** UserRow and TicketRow components SHALL be wrapped with React.memo
- **AND** this SHALL prevent re-rendering all rows when list state changes

#### Scenario: CountryRow memoization
- **WHEN** rendering country statistics list
- **THEN** CountryRow component SHALL be wrapped with React.memo

#### Scenario: Computation memoization
- **WHEN** performing expensive calculations
- **THEN** useMemo SHALL be used to cache results

#### Scenario: Callback stability
- **WHEN** passing callbacks to child components
- **THEN** useCallback SHALL be used for stable references

#### Scenario: CountryPicker callback memoization
- **WHEN** CountryPicker provides toggleCountry callback
- **THEN** toggleCountry SHALL be wrapped with useCallback
- **AND** dependencies SHALL include MAX_COUNTRIES_PER_DAY constant

#### Scenario: Admin search callback memoization
- **WHEN** admin user list provides search handler
- **THEN** handleSearchChange SHALL be wrapped with useCallback

#### Scenario: Image lazy loading
- **WHEN** images are displayed
- **THEN** images below the fold SHALL be lazy loaded

---

## ADDED Requirements

### Requirement: Batch Data Fetching

The backend SHALL use batch fetching patterns to avoid N+1 query performance issues.

- Service methods that transform multiple records MUST pre-fetch related data in batches
- Country lookups for multiple records MUST be batched into a single operation
- Batch fetch results SHALL be stored in a Map for O(1) lookup during transformation

#### Scenario: Reports export batch lookup

- **WHEN** exporting travel records to CSV or XLSX
- **THEN** all country codes SHALL be collected before transformation
- **AND** countries SHALL be fetched in a single batch operation
- **AND** each record transformation SHALL use O(1) Map lookup

#### Scenario: Reports summary batch lookup

- **WHEN** generating top countries report
- **THEN** country data SHALL be batch fetched before mapping
- **AND** individual lookups in loop SHALL NOT occur

#### Scenario: Travel records response batch lookup

- **WHEN** listing travel records for a user
- **THEN** country data for all records SHALL be batch fetched
- **AND** toResponse transformation SHALL use pre-fetched country map

#### Scenario: Import date range optimization

- **WHEN** calculating date range for imported records
- **THEN** Math.min and Math.max SHALL be used instead of sorting
- **AND** this SHALL provide O(n) instead of O(n log n) complexity
