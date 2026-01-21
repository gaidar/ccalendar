# profile-ui Specification

## Purpose
TBD - created by archiving change add-user-profile. Update Purpose after archive.
## Requirements
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
  - Delete account section (danger zone)

#### Scenario: Unauthenticated access
- **WHEN** an unauthenticated user navigates to `/profile`
- **THEN** they SHALL be redirected to the login page

### Requirement: Profile Information Section

The profile page SHALL display and allow editing of user information.

#### Scenario: Profile info display
- **WHEN** the profile information section is displayed
- **THEN** the following SHALL be shown:
  - User's display name
  - User's email address
  - Account creation date
  - Travel statistics (total countries, total days)

#### Scenario: Edit profile mode
- **WHEN** a user clicks "Edit" on profile information
- **THEN** name and email fields SHALL become editable
- **AND** "Save" and "Cancel" buttons SHALL be displayed

#### Scenario: Save profile changes
- **WHEN** a user saves profile changes
- **THEN** a loading indicator SHALL be displayed
- **AND** on success, a confirmation message SHALL be shown
- **AND** the view SHALL return to display mode

#### Scenario: Cancel profile edit
- **WHEN** a user clicks "Cancel" during profile editing
- **THEN** changes SHALL be discarded
- **AND** the view SHALL return to display mode with original values

#### Scenario: Profile validation errors
- **WHEN** profile update validation fails
- **THEN** error messages SHALL be displayed below the relevant fields
- **AND** the form SHALL remain in edit mode

#### Scenario: Profile loading state
- **WHEN** profile data is being fetched
- **THEN** skeleton placeholders SHALL be displayed

### Requirement: Change Password Section

The profile page SHALL provide password change functionality.

#### Scenario: Password form fields
- **WHEN** the change password section is displayed
- **THEN** the form SHALL include:
  - Current password field (if user has a password)
  - New password field
  - Confirm new password field

#### Scenario: OAuth-only user password form
- **WHEN** the user registered via OAuth only
- **THEN** the current password field SHALL NOT be displayed
- **AND** a message SHALL explain they can set a password

#### Scenario: Password strength indicator
- **WHEN** a user types a new password
- **THEN** a password strength indicator SHALL be displayed
- **AND** the strength SHALL update in real-time

#### Scenario: Password mismatch error
- **WHEN** new password and confirmation do not match
- **THEN** an error message SHALL be displayed
- **AND** the submit button SHALL be disabled

#### Scenario: Successful password change
- **WHEN** password is changed successfully
- **THEN** a success message SHALL be displayed
- **AND** the form SHALL be cleared

#### Scenario: Password change error
- **WHEN** password change fails
- **THEN** an error message SHALL be displayed
- **AND** the form SHALL retain entered values

### Requirement: Connected Accounts Section

The profile page SHALL display and manage OAuth connections.

#### Scenario: Connected accounts display
- **WHEN** the connected accounts section is displayed
- **THEN** all available OAuth providers SHALL be listed
- **AND** connected providers SHALL show a "Disconnect" button
- **AND** unconnected providers SHALL show a "Connect" button

#### Scenario: Provider icons
- **WHEN** OAuth providers are displayed
- **THEN** each provider SHALL show its recognizable icon/logo

#### Scenario: Connect OAuth provider
- **WHEN** a user clicks "Connect" for a provider
- **THEN** the user SHALL be redirected to the OAuth flow
- **AND** on completion, the provider SHALL be connected to their account

#### Scenario: Disconnect OAuth provider
- **WHEN** a user clicks "Disconnect" for a connected provider
- **AND** they have an alternative authentication method
- **THEN** a confirmation dialog SHALL be displayed
- **AND** upon confirmation, the provider SHALL be disconnected

#### Scenario: Cannot disconnect only auth method
- **WHEN** a user has only one authentication method
- **THEN** the disconnect button for that method SHALL be disabled
- **AND** a tooltip SHALL explain why disconnect is unavailable

#### Scenario: Disconnect confirmation dialog
- **WHEN** disconnect confirmation is displayed
- **THEN** it SHALL warn about losing login ability via that provider
- **AND** "Cancel" and "Disconnect" buttons SHALL be available

### Requirement: Delete Account Section

The profile page SHALL provide account deletion functionality.

#### Scenario: Delete account section appearance
- **WHEN** the delete account section is displayed
- **THEN** it SHALL be visually distinct (danger zone styling)
- **AND** a warning about permanent deletion SHALL be displayed

#### Scenario: Delete account confirmation input
- **WHEN** a user wants to delete their account
- **THEN** they SHALL be required to type "DELETE" to confirm
- **AND** the delete button SHALL be disabled until the confirmation matches

#### Scenario: Delete account final confirmation
- **WHEN** a user clicks delete with correct confirmation
- **THEN** a final confirmation dialog SHALL be displayed
- **AND** the dialog SHALL clearly state all data will be permanently deleted

#### Scenario: Successful account deletion
- **WHEN** account deletion succeeds
- **THEN** the user SHALL be logged out
- **AND** they SHALL be redirected to the home page
- **AND** a farewell message MAY be displayed

#### Scenario: Account deletion error
- **WHEN** account deletion fails
- **THEN** an error message SHALL be displayed
- **AND** the user SHALL remain on the profile page

### Requirement: Profile Responsive Design

The profile page SHALL be responsive across all device sizes.

#### Scenario: Mobile layout
- **WHEN** viewed on mobile (< 640px)
- **THEN** all sections SHALL stack vertically
- **AND** form inputs SHALL be full-width
- **AND** touch targets SHALL be at least 44x44 pixels

#### Scenario: Desktop layout
- **WHEN** viewed on desktop (>= 768px)
- **THEN** sections MAY use wider containers
- **AND** forms MAY have side-by-side elements where appropriate

### Requirement: Profile Error States

The profile page SHALL handle errors gracefully.

#### Scenario: Profile load error
- **WHEN** loading profile data fails
- **THEN** an error message SHALL be displayed
- **AND** a "Retry" button SHALL be available

#### Scenario: Retry after error
- **WHEN** a user clicks "Retry"
- **THEN** the profile data fetch SHALL be attempted again

