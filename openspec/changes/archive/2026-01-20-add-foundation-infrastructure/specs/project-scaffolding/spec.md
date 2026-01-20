## ADDED Requirements

### Requirement: Monorepo Structure

The project SHALL use a monorepo structure with npm workspaces to manage multiple packages.

The root `package.json` SHALL define workspaces for:
- `packages/api` - Backend Express.js application
- `packages/web` - Frontend React application

The project SHALL use a single `node_modules` at the root with hoisted dependencies.

#### Scenario: Root package.json configuration
- **WHEN** the root `package.json` is examined
- **THEN** it SHALL contain a `workspaces` field with `["packages/*"]`
- **AND** it SHALL define scripts for running both packages (`dev`, `build`, `test`, `lint`)
- **AND** it SHALL specify `private: true` to prevent accidental publishing

#### Scenario: Package dependencies
- **WHEN** `npm install` is run from the root directory
- **THEN** all dependencies for both packages SHALL be installed
- **AND** shared dependencies SHALL be hoisted to the root `node_modules`
- **AND** each package SHALL be able to import its dependencies correctly

### Requirement: API Package Structure

The `packages/api` directory SHALL contain the backend application following a layered architecture.

#### Scenario: API directory structure
- **WHEN** the `packages/api/src` directory is examined
- **THEN** it SHALL contain the following subdirectories:
  - `config/` - Configuration management
  - `controllers/` - Route handlers
  - `middleware/` - Express middleware
  - `routes/` - Route definitions
  - `services/` - Business logic
  - `utils/` - Utility functions
  - `validators/` - Zod schemas
- **AND** it SHALL contain an `index.ts` entry point

#### Scenario: API TypeScript configuration
- **WHEN** the `packages/api/tsconfig.json` is examined
- **THEN** it SHALL extend from a base configuration or define strict TypeScript settings
- **AND** it SHALL target ES2022 or later
- **AND** it SHALL enable `strict` mode
- **AND** it SHALL configure path aliases for clean imports

### Requirement: Web Package Structure

The `packages/web` directory SHALL contain the frontend application following a feature-based architecture.

#### Scenario: Web directory structure
- **WHEN** the `packages/web/src` directory is examined
- **THEN** it SHALL contain the following subdirectories:
  - `components/` - React components (with `ui/`, `layout/`, `features/` subdirectories)
  - `hooks/` - Custom React hooks
  - `lib/` - Utilities and helpers
  - `pages/` - Page components
  - `services/` - API client services
  - `stores/` - Zustand stores
  - `styles/` - Global styles
  - `types/` - TypeScript types
- **AND** it SHALL contain `App.tsx` root component and `main.tsx` entry point

#### Scenario: Web TypeScript configuration
- **WHEN** the `packages/web/tsconfig.json` is examined
- **THEN** it SHALL enable strict TypeScript settings
- **AND** it SHALL configure JSX support for React
- **AND** it SHALL define path aliases (e.g., `@/` for `src/`)

### Requirement: Shared Configuration Files

The project root SHALL contain shared configuration files for consistent tooling.

#### Scenario: Root configuration files exist
- **WHEN** the project root is examined
- **THEN** it SHALL contain:
  - `.gitignore` with appropriate patterns for Node.js and IDE files
  - `.nvmrc` specifying Node.js 20 LTS
  - `README.md` with project overview and setup instructions
  - `.prettierrc` for code formatting
  - `.eslintrc.js` or `eslint.config.js` for linting rules
