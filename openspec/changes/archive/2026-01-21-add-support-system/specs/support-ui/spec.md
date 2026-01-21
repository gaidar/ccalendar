## ADDED Requirements

### Requirement: Support Page

The application SHALL provide a support page for submitting support requests.

#### Scenario: Support page access
- **WHEN** a user navigates to `/support`
- **THEN** the support page SHALL be displayed
- **AND** the support form SHALL be shown

#### Scenario: Support page accessibility
- **WHEN** any user (authenticated or not) navigates to `/support`
- **THEN** the page SHALL be accessible without login

#### Scenario: Support page layout
- **WHEN** the support page is displayed
- **THEN** it SHALL include:
  - Page title and description
  - Support form
  - Response time information

### Requirement: Support Form

The support page SHALL display a form for submitting support requests.

#### Scenario: Form fields
- **WHEN** the support form is displayed
- **THEN** the following fields SHALL be present:
  - Name (text input)
  - Email (email input)
  - Category (dropdown/select)
  - Subject (text input)
  - Message (textarea)
  - Submit button

#### Scenario: Category options
- **WHEN** the category dropdown is displayed
- **THEN** the following options SHALL be available:
  - General Inquiry
  - Account Issues
  - Bug Report
  - Feature Request
  - Billing
  - Other

#### Scenario: Message character counter
- **WHEN** the message field is displayed
- **THEN** a character counter SHALL show current/maximum characters
- **AND** the counter SHALL update as the user types

#### Scenario: Pre-filled fields for logged-in users
- **WHEN** an authenticated user views the support form
- **THEN** the name field SHALL be pre-filled with their name
- **AND** the email field SHALL be pre-filled with their email

#### Scenario: Empty fields for guests
- **WHEN** an unauthenticated user views the support form
- **THEN** all fields SHALL be empty

### Requirement: Form Validation

The support form SHALL validate input before submission.

#### Scenario: Required field validation
- **WHEN** a user attempts to submit with empty required fields
- **THEN** error messages SHALL be displayed below the relevant fields
- **AND** the form SHALL NOT be submitted

#### Scenario: Email format validation
- **WHEN** a user enters an invalid email format
- **THEN** an error message SHALL be displayed
- **AND** the form SHALL NOT be submitted

#### Scenario: Subject minimum length
- **WHEN** a user enters a subject with less than 5 characters
- **THEN** an error message "Subject must be at least 5 characters" SHALL be displayed

#### Scenario: Message minimum length
- **WHEN** a user enters a message with less than 20 characters
- **THEN** an error message "Message must be at least 20 characters" SHALL be displayed

#### Scenario: Real-time validation
- **WHEN** a user interacts with a field and then leaves it
- **THEN** validation SHALL run on blur
- **AND** errors SHALL be shown immediately

### Requirement: Form Submission

The support form SHALL handle submission states appropriately.

#### Scenario: Submission loading state
- **WHEN** the form is being submitted
- **THEN** a loading indicator SHALL be displayed on the submit button
- **AND** the submit button SHALL be disabled
- **AND** form fields SHALL be disabled

#### Scenario: Successful submission
- **WHEN** the form is submitted successfully
- **THEN** the form SHALL be replaced with a confirmation view
- **AND** the confirmation SHALL display the reference ID

#### Scenario: Validation error response
- **WHEN** the server returns validation errors
- **THEN** error messages SHALL be displayed below the relevant fields
- **AND** the form SHALL remain editable

#### Scenario: Rate limit error
- **WHEN** the server returns a rate limit error
- **THEN** an error message SHALL be displayed
- **AND** the message SHALL indicate when the user can try again

#### Scenario: Network error
- **WHEN** submission fails due to network error
- **THEN** a generic error message SHALL be displayed
- **AND** a retry option SHALL be available

### Requirement: Confirmation View

The support page SHALL display a confirmation after successful submission.

#### Scenario: Confirmation display
- **WHEN** a ticket is created successfully
- **THEN** the confirmation view SHALL be displayed
- **AND** the reference ID SHALL be prominently shown

#### Scenario: Confirmation content
- **WHEN** the confirmation view is displayed
- **THEN** it SHALL include:
  - Reference ID (e.g., "TKT-A1B2C3D4")
  - Submitted subject and category
  - Estimated response time (24-48 hours)
  - Confirmation that an email has been sent

#### Scenario: Confirmation actions
- **WHEN** the confirmation view is displayed
- **THEN** a "Return to Home" button SHALL be available
- **AND** a "Submit Another Request" button SHALL be available

#### Scenario: Submit another request
- **WHEN** a user clicks "Submit Another Request"
- **THEN** the form SHALL be reset and displayed
- **AND** pre-filled fields (for logged-in users) SHALL be restored

### Requirement: Support Page Responsive Design

The support page SHALL be responsive across all device sizes.

#### Scenario: Mobile layout
- **WHEN** viewed on mobile (< 640px)
- **THEN** all form fields SHALL be full-width
- **AND** touch targets SHALL be at least 44x44 pixels

#### Scenario: Desktop layout
- **WHEN** viewed on desktop (>= 768px)
- **THEN** the form MAY have a maximum width for readability
- **AND** the layout SHALL be centered

### Requirement: Support Page Accessibility

The support form SHALL be fully accessible.

#### Scenario: Form labels
- **WHEN** the form is rendered
- **THEN** all inputs SHALL have associated labels
- **AND** labels SHALL be programmatically linked to inputs

#### Scenario: Error announcements
- **WHEN** validation errors occur
- **THEN** errors SHALL be announced to screen readers
- **AND** focus SHALL move to the first error field

#### Scenario: Keyboard navigation
- **WHEN** navigating with keyboard
- **THEN** all form fields SHALL be reachable via Tab
- **AND** the submit button SHALL be focusable
