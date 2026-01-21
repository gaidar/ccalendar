# PWA & Mobile Readiness Specification

## ADDED Requirements

### Requirement: Web App Manifest

The application SHALL provide a valid web app manifest that enables installation as a standalone application.

The manifest MUST include:
- Application name and short name
- Description of the application
- Start URL pointing to the calendar page
- Display mode set to "standalone"
- Theme color matching the application's primary color
- Background color for splash screen
- Icons in sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- At least one maskable icon for Android adaptive icon support
- Shortcuts for quick access to calendar and reports pages

#### Scenario: Manifest loaded by browser
- **GIVEN** a user visits the application
- **WHEN** the browser parses the HTML
- **THEN** the manifest.json file SHALL be loaded
- **AND** the browser SHALL recognize the app as installable

#### Scenario: App installed on Android
- **GIVEN** a user on Chrome Android
- **WHEN** they install the PWA from the browser menu
- **THEN** an app icon SHALL appear on the home screen
- **AND** launching the icon SHALL open the app in standalone mode without browser chrome

#### Scenario: App installed on iOS
- **GIVEN** a user on Safari iOS
- **WHEN** they use "Add to Home Screen"
- **THEN** an app icon SHALL appear on the home screen using the apple-touch-icon
- **AND** launching the icon SHALL open the app in standalone mode

---

### Requirement: Service Worker Registration

The application SHALL register a service worker that enables offline capabilities and improves performance through caching.

#### Scenario: Service worker registered on first visit
- **GIVEN** a user visits the application for the first time
- **WHEN** the page loads
- **THEN** the service worker SHALL be registered
- **AND** static assets SHALL be precached for offline use

#### Scenario: Service worker updates
- **GIVEN** a new version of the application is deployed
- **WHEN** a user revisits the application
- **THEN** the service worker SHALL detect the update
- **AND** the user SHALL be prompted to refresh for the new version

---

### Requirement: Offline Asset Caching

The application SHALL cache static assets to enable offline access to the application shell.

The following MUST be precached:
- JavaScript bundles (vendor, main, chunks)
- CSS stylesheets
- Web fonts
- Application icons and images
- Offline fallback page

#### Scenario: App shell available offline
- **GIVEN** a user has previously visited the application
- **WHEN** they lose network connectivity
- **THEN** navigating to the application SHALL show the cached app shell
- **AND** the user SHALL see an offline indicator

#### Scenario: Cache invalidation on deployment
- **GIVEN** a new version of the application is deployed
- **WHEN** a user visits the application
- **THEN** the service worker SHALL fetch and cache new assets
- **AND** old cached assets SHALL be cleaned up

---

### Requirement: API Response Caching

The application SHALL cache API responses with a network-first strategy to provide offline access to previously fetched data.

#### Scenario: API data served from network when online
- **GIVEN** a user is online
- **WHEN** they navigate to the calendar page
- **THEN** travel records SHALL be fetched from the network
- **AND** the response SHALL be cached for offline use

#### Scenario: API data served from cache when offline
- **GIVEN** a user has previously loaded their calendar
- **WHEN** they lose network connectivity and navigate to the calendar
- **THEN** cached travel records SHALL be displayed
- **AND** an offline indicator SHALL be visible

#### Scenario: Stale-while-revalidate for non-critical endpoints
- **GIVEN** a user requests country data
- **WHEN** cached data exists
- **THEN** the cached data SHALL be served immediately
- **AND** the cache SHALL be updated in the background

---

### Requirement: Install Prompt

The application SHALL provide a user-friendly install prompt for eligible users.

The prompt MUST:
- Only appear to users who have not installed the app
- Be dismissable and not reappear for at least 7 days after dismissal
- Provide clear value proposition for installation
- Work on both desktop and mobile browsers

#### Scenario: Install prompt shown to eligible user
- **GIVEN** a user on a supported browser who has not installed the app
- **WHEN** they visit the application and meet engagement criteria
- **THEN** an install prompt banner SHALL appear
- **AND** the prompt SHALL explain the benefits of installation

#### Scenario: Install prompt dismissed
- **GIVEN** the install prompt is visible
- **WHEN** the user dismisses it
- **THEN** the prompt SHALL not appear again for 7 days
- **AND** the dismissal preference SHALL persist in localStorage

#### Scenario: Successful installation
- **GIVEN** the install prompt is visible
- **WHEN** the user clicks "Install"
- **THEN** the native browser install dialog SHALL appear
- **AND** upon successful installation, the prompt SHALL be hidden permanently

---

### Requirement: Online Status Indicator

The application SHALL display a clear indicator when the user is offline.

#### Scenario: Offline indicator shown when disconnected
- **GIVEN** a user is using the application
- **WHEN** they lose network connectivity
- **THEN** an offline indicator SHALL appear within 2 seconds
- **AND** the indicator SHALL be non-intrusive but visible

#### Scenario: Offline indicator hidden when reconnected
- **GIVEN** the offline indicator is visible
- **WHEN** network connectivity is restored
- **THEN** the indicator SHALL disappear
- **AND** any pending sync operations SHALL resume (future enhancement)

#### Scenario: Mutations disabled when offline
- **GIVEN** a user is offline
- **WHEN** they attempt to add or modify travel records
- **THEN** the action SHALL be prevented
- **AND** a message SHALL explain that changes require network connectivity

---

### Requirement: Update Prompt

The application SHALL notify users when a new version is available and prompt them to update.

#### Scenario: Update available notification
- **GIVEN** a new service worker has been installed
- **WHEN** the user has the app open in a tab
- **THEN** an update prompt SHALL appear
- **AND** the prompt SHALL offer to reload the application

#### Scenario: Update applied on reload
- **GIVEN** the update prompt is visible
- **WHEN** the user clicks "Update"
- **THEN** the service worker SHALL skip waiting
- **AND** the page SHALL reload with the new version

#### Scenario: Update deferred
- **GIVEN** the update prompt is visible
- **WHEN** the user dismisses it
- **THEN** the update SHALL be applied on next visit
- **AND** the prompt SHALL not reappear in the current session

---

### Requirement: iOS Standalone Mode Support

The application SHALL provide an optimized experience when running in iOS standalone mode (Add to Home Screen).

The application MUST:
- Use apple-mobile-web-app-capable meta tag
- Provide apple-touch-icon for home screen
- Configure apple-mobile-web-app-status-bar-style
- Handle safe areas for notched devices
- Prevent bounce scrolling in standalone mode

#### Scenario: iOS standalone mode detection
- **GIVEN** a user launches the app from iOS home screen
- **WHEN** the application loads
- **THEN** the app SHALL detect standalone mode
- **AND** the UI SHALL adapt accordingly (no browser chrome expected)

#### Scenario: Safe area handling on notched devices
- **GIVEN** a user on an iPhone with a notch
- **WHEN** viewing the application in standalone mode
- **THEN** content SHALL not be obscured by the notch
- **AND** the bottom navigation SHALL respect the home indicator area

---

### Requirement: Capacitor Native Wrapper Configuration

The application SHALL be configured to run within Capacitor native shells for iOS and Android distribution.

The configuration MUST include:
- Application ID suitable for app stores
- Server configuration pointing to web build output
- iOS deployment target of 13.0 or higher
- Android minimum SDK of 22 (Android 5.1)
- Splash screen configuration for both platforms
- Status bar configuration for native appearance

#### Scenario: iOS app build
- **GIVEN** the web application is built
- **WHEN** running `npx cap sync ios`
- **THEN** the iOS project SHALL be updated with latest web assets
- **AND** the app SHALL be runnable in Xcode simulator

#### Scenario: Android app build
- **GIVEN** the web application is built
- **WHEN** running `npx cap sync android`
- **THEN** the Android project SHALL be updated with latest web assets
- **AND** the app SHALL be runnable in Android Studio emulator

#### Scenario: Native status bar integration
- **GIVEN** the app is running in Capacitor shell
- **WHEN** the app loads
- **THEN** the status bar color SHALL match the app's theme color
- **AND** the status bar style SHALL be appropriate for the background

---

### Requirement: PWA Performance Requirements

The application SHALL meet performance criteria for PWA quality.

The application MUST:
- Score 90+ on Lighthouse PWA audit
- First Contentful Paint under 2 seconds on 3G
- Time to Interactive under 5 seconds on 3G
- Service worker must not block main thread

#### Scenario: Lighthouse PWA audit passes
- **GIVEN** the production build of the application
- **WHEN** running Lighthouse PWA audit
- **THEN** the installability score SHALL be 100%
- **AND** the PWA optimized score SHALL be at least 90%

#### Scenario: Fast subsequent loads
- **GIVEN** a user has previously visited the application
- **WHEN** they revisit the application
- **THEN** cached assets SHALL enable sub-second First Contentful Paint
- **AND** the application SHALL be interactive within 2 seconds
