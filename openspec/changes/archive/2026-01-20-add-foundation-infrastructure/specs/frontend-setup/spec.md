## ADDED Requirements

### Requirement: Vite Build Configuration

The frontend SHALL use Vite as the build tool and development server.

#### Scenario: Development server
- **WHEN** `npm run dev` is executed in `packages/web`
- **THEN** Vite SHALL start a development server at `http://localhost:3000`
- **AND** Hot Module Replacement (HMR) SHALL be enabled
- **AND** changes to source files SHALL be reflected immediately without full page reload

#### Scenario: Production build
- **WHEN** `npm run build` is executed
- **THEN** Vite SHALL create an optimized production bundle in `dist/`
- **AND** the build SHALL include code splitting for routes
- **AND** assets SHALL be hashed for cache busting

#### Scenario: Path aliases
- **WHEN** importing modules in the frontend
- **THEN** the `@/` alias SHALL resolve to `src/`
- **AND** this SHALL be configured in both `vite.config.ts` and `tsconfig.json`

### Requirement: React Application Setup

The frontend SHALL be a React 18 single-page application.

#### Scenario: React initialization
- **WHEN** the application loads
- **THEN** React 18 SHALL render the root component into `#root`
- **AND** StrictMode SHALL be enabled in development

#### Scenario: Root component structure
- **WHEN** the App component renders
- **THEN** it SHALL include:
  - React Router provider for routing
  - TanStack Query provider for data fetching
  - Zustand stores accessible throughout the app

### Requirement: Tailwind CSS Configuration

The frontend SHALL use Tailwind CSS for styling.

#### Scenario: Tailwind configuration
- **WHEN** the Tailwind config is examined
- **THEN** it SHALL include:
  - Content paths pointing to all component files
  - Custom theme extensions for the application design
  - The tailwindcss-animate plugin for animations

#### Scenario: CSS processing
- **WHEN** styles are processed
- **THEN** PostCSS SHALL be configured with Tailwind and Autoprefixer
- **AND** unused CSS SHALL be purged in production builds

#### Scenario: Global styles
- **WHEN** the application loads
- **THEN** `src/styles/globals.css` SHALL be imported
- **AND** it SHALL include Tailwind directives (@tailwind base, components, utilities)
- **AND** CSS variables for theming SHALL be defined

### Requirement: shadcn/ui Component Library

The frontend SHALL use shadcn/ui for UI components.

#### Scenario: Component installation
- **WHEN** shadcn/ui is initialized
- **THEN** components SHALL be installed to `src/components/ui/`
- **AND** a `components.json` config file SHALL exist at the project root
- **AND** the configuration SHALL use the "new-york" style variant

#### Scenario: Base components available
- **WHEN** the initial setup is complete
- **THEN** the following base components SHALL be installed:
  - Button
  - Input
  - Card
  - Dialog
  - Sheet
  - Form (with react-hook-form integration)
  - Toast/Sonner for notifications

#### Scenario: Component customization
- **WHEN** shadcn/ui components are used
- **THEN** they SHALL use the application's CSS variables for theming
- **AND** components SHALL be fully customizable in `src/components/ui/`

### Requirement: Zustand State Management

The frontend SHALL use Zustand for global state management.

#### Scenario: Store structure
- **WHEN** stores are created
- **THEN** they SHALL be located in `src/stores/`
- **AND** each domain SHALL have its own store file

#### Scenario: Auth store initialization
- **WHEN** the auth store is examined
- **THEN** it SHALL include:
  - `user` - current user object or null
  - `isAuthenticated` - boolean
  - `isLoading` - boolean
  - `login(credentials)` - async action
  - `logout()` - action
  - `setUser(user)` - action

### Requirement: TanStack Query Configuration

The frontend SHALL use TanStack Query for server state management.

#### Scenario: Query client configuration
- **WHEN** the QueryClient is created
- **THEN** it SHALL be configured with:
  - `staleTime` of 5 minutes for general queries
  - `retry` count of 3 for failed requests
  - `refetchOnWindowFocus` enabled

#### Scenario: Query provider
- **WHEN** the application renders
- **THEN** QueryClientProvider SHALL wrap the app
- **AND** DevTools SHALL be available in development

### Requirement: React Router Configuration

The frontend SHALL use React Router v6 for client-side routing.

#### Scenario: Router setup
- **WHEN** the router is configured
- **THEN** it SHALL use `BrowserRouter` for history-based routing
- **AND** routes SHALL be defined in a centralized location

#### Scenario: Initial routes
- **WHEN** the initial routes are defined
- **THEN** the following routes SHALL exist:
  - `/` - Landing page (public)
  - `/login` - Login page (public)
  - `/register` - Registration page (public)
  - `/calendar` - Calendar view (protected, placeholder)
  - `*` - 404 Not Found page

### Requirement: API Client Configuration

The frontend SHALL have a configured API client for backend communication.

#### Scenario: Base API client
- **WHEN** the API client is configured
- **THEN** it SHALL use `fetch` or `axios` with a base URL from `VITE_API_URL`
- **AND** it SHALL automatically include auth tokens in requests
- **AND** it SHALL handle 401 responses by redirecting to login

#### Scenario: Environment-based configuration
- **WHEN** the API client initializes
- **THEN** it SHALL use `import.meta.env.VITE_API_URL` for the base URL
- **AND** this SHALL default to `http://localhost:3001/api/v1` in development

### Requirement: TypeScript Configuration

The frontend SHALL use strict TypeScript configuration.

#### Scenario: TypeScript compiler options
- **WHEN** the frontend TypeScript is configured
- **THEN** it SHALL use:
  - `strict: true`
  - `jsx: "react-jsx"`
  - `moduleResolution: "bundler"`
  - Path aliases configured (`@/*`)

#### Scenario: Type definitions
- **WHEN** types are needed
- **THEN** shared types SHALL be in `src/types/`
- **AND** API response types SHALL match backend contracts
