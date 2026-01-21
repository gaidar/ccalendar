# navigation Specification

## Purpose
TBD - created by archiving change add-frontend-landing-auth. Update Purpose after archive.
## Requirements
### Requirement: Responsive Header

The application SHALL provide a responsive header that adapts to different screen sizes.

#### Scenario: Header content - unauthenticated
- **WHEN** the header is displayed for an unauthenticated user
- **THEN** it SHALL include:
  - The application logo (links to landing page)
  - Navigation links (if applicable for public pages)
  - "Login" and "Register" buttons

#### Scenario: Header content - authenticated
- **WHEN** the header is displayed for an authenticated user
- **THEN** it SHALL include:
  - The application logo (links to dashboard)
  - Navigation links (Calendar, Reports)
  - User profile dropdown or avatar
  - Logout option

#### Scenario: Desktop header layout
- **WHEN** the header is displayed on desktop (>= 1024px)
- **THEN** all navigation links SHALL be visible inline
- **AND** the hamburger menu SHALL NOT be displayed

#### Scenario: Mobile header layout
- **WHEN** the header is displayed on mobile (< 1024px)
- **THEN** a hamburger menu icon SHALL be displayed
- **AND** navigation links SHALL be hidden until the menu is opened

#### Scenario: Header sticky behavior
- **WHEN** a user scrolls down the page
- **THEN** the header SHALL remain fixed at the top of the viewport

### Requirement: Mobile Hamburger Menu

The application SHALL provide a hamburger menu for mobile navigation.

#### Scenario: Hamburger menu toggle
- **WHEN** a user taps the hamburger menu icon
- **THEN** a slide-out navigation drawer SHALL appear
- **AND** the drawer SHALL overlay the main content

#### Scenario: Hamburger menu content - unauthenticated
- **WHEN** the hamburger menu is opened by an unauthenticated user
- **THEN** it SHALL display:
  - Login link
  - Register link

#### Scenario: Hamburger menu content - authenticated
- **WHEN** the hamburger menu is opened by an authenticated user
- **THEN** it SHALL display:
  - User name and email (or avatar)
  - Calendar link
  - Reports link
  - Profile link
  - Logout button

#### Scenario: Hamburger menu close
- **WHEN** a user taps outside the menu drawer
- **OR** taps a navigation link
- **OR** taps the close button
- **THEN** the menu drawer SHALL close

#### Scenario: Hamburger menu accessibility
- **WHEN** the hamburger menu is opened
- **THEN** focus SHALL be trapped within the menu
- **AND** pressing Escape SHALL close the menu
- **AND** the menu SHALL have `role="dialog"` and `aria-modal="true"`

### Requirement: Mobile Bottom Navigation

The application SHALL provide a bottom navigation bar on mobile for authenticated users.

#### Scenario: Bottom nav visibility - authenticated mobile
- **WHEN** an authenticated user views the app on mobile (< 768px)
- **THEN** a bottom navigation bar SHALL be displayed

#### Scenario: Bottom nav visibility - unauthenticated
- **WHEN** an unauthenticated user views the app
- **THEN** the bottom navigation bar SHALL NOT be displayed

#### Scenario: Bottom nav visibility - desktop
- **WHEN** the app is viewed on desktop (>= 768px)
- **THEN** the bottom navigation bar SHALL NOT be displayed

#### Scenario: Bottom nav items
- **WHEN** the bottom navigation is displayed
- **THEN** it SHALL include icons and labels for:
  - Calendar (home/primary view)
  - Reports
  - Profile

#### Scenario: Bottom nav active state
- **WHEN** a user is on a specific page
- **THEN** the corresponding bottom nav item SHALL be visually highlighted

#### Scenario: Bottom nav touch targets
- **WHEN** the bottom navigation is displayed
- **THEN** each navigation item SHALL have a touch target of at least 48x48 pixels

#### Scenario: Bottom nav safe area
- **WHEN** the bottom navigation is displayed on devices with a home indicator (iPhone X+)
- **THEN** the navigation SHALL account for the safe area inset

### Requirement: Navigation State Management

The application SHALL manage navigation state for active indicators and transitions.

#### Scenario: Active route indication
- **WHEN** a user navigates to a page
- **THEN** the corresponding navigation link SHALL be visually marked as active

#### Scenario: Route-based header changes
- **WHEN** a user navigates between public and protected pages
- **THEN** the header content SHALL update accordingly (auth buttons vs user menu)

#### Scenario: Navigation during loading
- **WHEN** navigation is in progress
- **THEN** a loading indicator MAY be displayed
- **AND** the previous page SHALL remain visible until the new page is ready

### Requirement: Navigation Accessibility

All navigation components SHALL be accessible.

#### Scenario: Landmark roles
- **WHEN** the header is rendered
- **THEN** it SHALL have `role="banner"` or use `<header>` element
- **AND** the main navigation SHALL have `role="navigation"` or use `<nav>` element

#### Scenario: Skip link
- **WHEN** the page is loaded
- **THEN** a "Skip to main content" link SHALL be the first focusable element
- **AND** it SHALL be visible on focus

#### Scenario: Current page indication
- **WHEN** a navigation link represents the current page
- **THEN** it SHALL have `aria-current="page"`

#### Scenario: Mobile nav button
- **WHEN** the hamburger menu button is rendered
- **THEN** it SHALL have `aria-expanded` indicating menu state
- **AND** it SHALL have `aria-controls` referencing the menu ID
- **AND** it SHALL have an accessible label (e.g., "Open menu" / "Close menu")

### Requirement: Footer Component

The application SHALL provide a footer component.

#### Scenario: Footer content
- **WHEN** the footer is displayed
- **THEN** it SHALL include:
  - Copyright notice with current year
  - Links to Terms of Service and Privacy Policy
  - Contact/Support link (if applicable)

#### Scenario: Footer responsive layout
- **WHEN** the footer is viewed on mobile
- **THEN** links SHALL stack vertically or wrap appropriately
- **AND** text SHALL be centered or left-aligned

#### Scenario: Footer visibility
- **WHEN** the page content is shorter than the viewport
- **THEN** the footer SHALL remain at the bottom of the viewport (sticky footer pattern)

