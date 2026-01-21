## ADDED Requirements

### Requirement: Admin Dashboard Page

The application SHALL provide an admin dashboard page.

#### Scenario: Admin dashboard access
- **WHEN** an admin user navigates to `/admin`
- **THEN** the admin dashboard SHALL be displayed

#### Scenario: Non-admin access denied
- **WHEN** a non-admin user navigates to `/admin`
- **THEN** they SHALL be redirected to the home page

#### Scenario: Dashboard content
- **WHEN** the admin dashboard is displayed
- **THEN** it SHALL include:
  - System statistics cards
  - Quick links to Users and Tickets management
  - Admin navigation

### Requirement: System Statistics Display

The admin dashboard SHALL display system statistics.

#### Scenario: Statistics cards
- **WHEN** system statistics are displayed
- **THEN** the following cards SHALL be shown:
  - Total Users (with user icon)
  - Total Travel Records (with calendar icon)
  - Active Users (30 days) (with activity icon)
  - Open Tickets (with ticket icon)

#### Scenario: Statistics loading state
- **WHEN** statistics are being fetched
- **THEN** skeleton placeholders SHALL be displayed

#### Scenario: Statistics error state
- **WHEN** statistics fail to load
- **THEN** an error message SHALL be displayed
- **AND** a retry button SHALL be available

### Requirement: User List Page

The admin panel SHALL provide a user management page.

#### Scenario: User list page access
- **WHEN** an admin navigates to `/admin/users`
- **THEN** the user list page SHALL be displayed

#### Scenario: User list table
- **WHEN** the user list is displayed
- **THEN** a table SHALL show:
  - Name column
  - Email column
  - Admin badge (if admin)
  - Confirmed badge (if confirmed)
  - Created date column
  - Actions column (View, Edit)

#### Scenario: User search
- **WHEN** the user list is displayed
- **THEN** a search input SHALL be available
- **AND** searching SHALL filter by name or email
- **AND** search SHALL have debounce (300ms)

#### Scenario: User list pagination
- **WHEN** more than 20 users exist
- **THEN** pagination controls SHALL be displayed
- **AND** users can navigate between pages

#### Scenario: User list loading state
- **WHEN** users are being fetched
- **THEN** a loading skeleton SHALL be displayed

#### Scenario: User list empty state
- **WHEN** no users match the search
- **THEN** a "No users found" message SHALL be displayed

### Requirement: User Edit Page

The admin panel SHALL provide a user edit page.

#### Scenario: User edit page access
- **WHEN** an admin navigates to `/admin/users/:id`
- **THEN** the user edit page SHALL be displayed

#### Scenario: User edit form fields
- **WHEN** the user edit form is displayed
- **THEN** the following fields SHALL be editable:
  - Name (text input)
  - Email (text input)
  - Is Admin (toggle/checkbox)
  - Is Confirmed (toggle/checkbox)

#### Scenario: User edit read-only fields
- **WHEN** the user edit form is displayed
- **THEN** the following SHALL be shown as read-only:
  - User ID
  - Created date
  - User stats (total records, total countries)

#### Scenario: Save user changes
- **WHEN** an admin saves user changes
- **THEN** a loading indicator SHALL be displayed
- **AND** on success, a confirmation message SHALL be shown

#### Scenario: Delete user action
- **WHEN** an admin clicks "Delete User"
- **THEN** a confirmation dialog SHALL be displayed
- **AND** the dialog SHALL warn about permanent deletion

#### Scenario: Self-edit restrictions
- **WHEN** an admin views their own edit page
- **THEN** the "Is Admin" toggle SHALL be disabled
- **AND** the "Delete User" button SHALL be disabled
- **AND** tooltips SHALL explain why these are disabled

#### Scenario: User not found
- **WHEN** navigating to a non-existent user
- **THEN** a "User not found" message SHALL be displayed
- **AND** a link back to user list SHALL be provided

### Requirement: Ticket List Page

The admin panel SHALL provide a ticket management page.

#### Scenario: Ticket list page access
- **WHEN** an admin navigates to `/admin/tickets`
- **THEN** the ticket list page SHALL be displayed

#### Scenario: Ticket list table
- **WHEN** the ticket list is displayed
- **THEN** a table SHALL show:
  - Reference ID column
  - Subject column
  - Category column
  - Status column (with colored badge)
  - Created date column
  - Actions column (View)

#### Scenario: Ticket status filter
- **WHEN** the ticket list is displayed
- **THEN** a status filter dropdown SHALL be available
- **AND** options SHALL be: All, Open, In Progress, Closed

#### Scenario: Ticket status badges
- **WHEN** ticket status is displayed
- **THEN** badges SHALL be color-coded:
  - Open: yellow/warning
  - In Progress: blue/info
  - Closed: green/success

#### Scenario: Ticket list pagination
- **WHEN** more than 20 tickets exist
- **THEN** pagination controls SHALL be displayed

#### Scenario: Ticket list loading state
- **WHEN** tickets are being fetched
- **THEN** a loading skeleton SHALL be displayed

#### Scenario: Ticket list empty state
- **WHEN** no tickets match the filter
- **THEN** a "No tickets found" message SHALL be displayed

### Requirement: Ticket Detail Page

The admin panel SHALL provide a ticket detail page.

#### Scenario: Ticket detail page access
- **WHEN** an admin navigates to `/admin/tickets/:referenceId`
- **THEN** the ticket detail page SHALL be displayed

#### Scenario: Ticket detail content
- **WHEN** the ticket detail is displayed
- **THEN** the following SHALL be shown:
  - Reference ID
  - Submitter name and email
  - Category
  - Subject
  - Message content
  - Created date
  - Linked user (if authenticated submission)
  - Current status

#### Scenario: Ticket status update
- **WHEN** updating ticket status
- **THEN** a status dropdown SHALL be available
- **AND** options SHALL be: Open, In Progress, Closed

#### Scenario: Admin notes field
- **WHEN** the ticket detail is displayed
- **THEN** an admin notes textarea SHALL be available
- **AND** notes SHALL be saveable
- **AND** a note SHALL indicate these are private

#### Scenario: Save ticket changes
- **WHEN** an admin saves ticket changes
- **THEN** a loading indicator SHALL be displayed
- **AND** on success, a confirmation message SHALL be shown

#### Scenario: Delete ticket action
- **WHEN** an admin clicks "Delete Ticket"
- **THEN** a confirmation dialog SHALL be displayed

#### Scenario: Ticket not found
- **WHEN** navigating to a non-existent ticket
- **THEN** a "Ticket not found" message SHALL be displayed
- **AND** a link back to ticket list SHALL be provided

### Requirement: Admin Navigation

The admin panel SHALL provide consistent navigation.

#### Scenario: Admin navigation display
- **WHEN** any admin page is displayed
- **THEN** admin navigation SHALL be visible
- **AND** links SHALL include: Dashboard, Users, Tickets

#### Scenario: Active link indication
- **WHEN** on an admin page
- **THEN** the corresponding navigation link SHALL be highlighted

#### Scenario: Back to main app
- **WHEN** admin navigation is displayed
- **THEN** a link to return to the main application SHALL be available

### Requirement: Admin Responsive Design

The admin panel SHALL be responsive across device sizes.

#### Scenario: Mobile layout
- **WHEN** viewed on mobile (< 640px)
- **THEN** tables SHALL be horizontally scrollable
- **AND** admin navigation SHALL collapse to a menu

#### Scenario: Desktop layout
- **WHEN** viewed on desktop (>= 1024px)
- **THEN** admin navigation MAY be a sidebar
- **AND** tables SHALL display all columns

### Requirement: Admin Accessibility

The admin panel SHALL be fully accessible.

#### Scenario: Table accessibility
- **WHEN** data tables are rendered
- **THEN** proper table headers SHALL be used
- **AND** scope attributes SHALL be applied

#### Scenario: Status announcements
- **WHEN** actions complete (save, delete)
- **THEN** success/error messages SHALL be announced to screen readers

#### Scenario: Keyboard navigation
- **WHEN** navigating with keyboard
- **THEN** all interactive elements SHALL be reachable
- **AND** focus order SHALL be logical
