# Country Calendar - Feature Tracker

## Legend

| Status | Description |
|--------|-------------|
| `[ ]` | Not started |
| `[S]` | Specification created |
| `[P]` | In progress |
| `[X]` | Completed |
| `[~]` | Partially implemented |

---

## Completed Features (MVP)

All MVP features are implemented and deployed. Summary by area:

| Area | Features |
|------|----------|
| **Infrastructure** | Monorepo (packages/api, packages/web), Docker dev environment, Prisma + PostgreSQL, Redis caching, Heroku deployment, GitHub Actions CI/CD |
| **Authentication** | Email/password with confirmation, JWT (access + refresh tokens), Google/Facebook/Apple OAuth, password reset, account lockout, rate limiting |
| **Travel Records** | CRUD operations, bulk updates, date range queries, validation (no future dates) |
| **Calendar UI** | Month view with navigation, day cells with country indicators, country picker with fuzzy search, date range selection, recent countries quick-pick |
| **Reports & Export** | Summary statistics, dashboard cards, country stats, CSV/XLSX export with rate limiting |
| **User Profile** | View/update profile, change password, delete account, OAuth provider management |
| **Admin Panel** | User management (CRUD, search, pagination), support ticket management, system statistics |
| **Email System** | Nodemailer + Mailgun, HTML templates for: welcome, confirmation, password reset, account deletion, support tickets |
| **Security** | Helmet.js headers, CORS, input sanitization, Winston logging, Sentry error tracking |
| **Testing** | Vitest setup, unit tests (auth, travel records), integration tests (auth, travel, admin), frontend component tests |

### Pending Items (Minor)

| Status | Feature | Notes |
|--------|---------|-------|
| `[~]` | Optimistic UI updates | Basic loading/invalidation done |
| `[X]` | Keyboard navigation | Full support including arrows, Enter/Space for picker |
| `[X]` | E2E tests (Playwright) | Setup + critical journeys (registration, login, travel records) |
| `[X]` | Country flags display | SVG flags bundled locally, shown in calendar and picker |
| `[X]` | Calendar help block | Dismissible help explaining double-click/range interactions |

---

## Future Features (Post-MVP)

### Phase 14: Visual & Discovery Features

High-impact features for user engagement and acquisition.

| Status | Feature | Priority | Description |
|--------|---------|----------|-------------|
| `[ ]` | **World Map Visualization** | P1 | Interactive SVG/WebGL world map showing visited countries with color coding by visit frequency. Zoom, pan, tooltips with country stats. Key differentiator from spreadsheet tracking. |
| `[ ]` | **Data Import** | P1 | Import travel history from CSV/Excel files, Google Calendar, TripIt, or manual entry wizard. Critical for onboarding users with existing travel data. |
| `[ ]` | **Public Profile & Sharing** | P2 | Shareable profile page with travel stats, visited countries map, and badges. Social media sharing cards (OG images). Viral growth mechanism. |

### Phase 15: Planning & Organization

Features for power users and frequent travelers.

| Status | Feature | Priority | Description |
|--------|---------|----------|-------------|
| `[ ]` | **Trip Planning** | P2 | Create future trips with dates, countries, and notes. Countdown timers. Integration with calendar apps (ICS export). Auto-fill travel records when trip date arrives. |
| `[ ]` | **Multiple Calendars** | P2 | Separate calendars for work vs personal travel. Per-calendar colors, filtering, and reporting. Useful for expense reporting and tax purposes. |
| `[ ]` | **Travel Insights** | P3 | AI-powered analytics: travel patterns, seasonal trends, carbon footprint estimates, "you've spent X% of the year abroad", year-in-review summaries. |

### Phase 16: Engagement & Gamification

Features to increase retention and daily usage.

| Status | Feature | Priority | Description |
|--------|---------|----------|-------------|
| `[ ]` | **Achievements & Badges** | P3 | Unlock badges for milestones: first trip logged, 10 countries, all continents, etc. Profile badge display. Leaderboard opt-in. |
| `[ ]` | **Streak Tracking** | P3 | Track consecutive days/weeks of logging. Streak reminders. "Don't break the chain" motivation. |
| `[ ]` | **Push Notifications** | P3 | Reminders to log travel, streak warnings, trip date notifications. Web Push API for browser, FCM for mobile. |

### Phase 17: Mobile & Offline

Native mobile experience.

| Status | Feature | Priority | Description |
|--------|---------|----------|-------------|
| `[ ]` | **Progressive Web App (PWA)** | P2 | Service worker for offline access. Install prompt. Home screen icon. Sync when back online. |
| `[ ]` | **React Native App** | P3 | Native iOS/Android wrapper with shared business logic. App Store presence. Native navigation and gestures. |
| `[ ]` | **Biometric Auth** | P3 | Face ID / Touch ID / fingerprint for mobile app login. Secure token storage in Keychain/Keystore. |

### Phase 18: Integrations & API

Extend platform capabilities.

| Status | Feature | Priority | Description |
|--------|---------|----------|-------------|
| `[ ]` | **Public API** | P3 | REST API with API keys for third-party integrations. Rate limiting, usage dashboard. Enables automation and integrations. |
| `[ ]` | **Calendar Sync** | P3 | Two-way sync with Google Calendar, Apple Calendar, Outlook. Auto-detect travel from calendar events. |
| `[ ]` | **Location Services** | P3 | Optional GPS-based country detection. Background location tracking (with explicit consent). Auto-suggest country based on location. |

---

## Priority Definitions

| Priority | Description | Timeline |
|----------|-------------|----------|
| **P1** | High impact, should implement next | Next 1-2 sprints |
| **P2** | Medium impact, valuable addition | Next quarter |
| **P3** | Nice to have, future roadmap | 6+ months |

---

## Recommended Implementation Order

### Next Sprint: Visual Impact
1. World Map Visualization (high visual impact, key differentiator)
2. Data Import (removes onboarding friction)

### Following Sprint: Growth
3. Public Profile & Sharing (viral growth)
4. PWA / Offline mode (retention)

### Subsequent Sprints
5. Trip Planning
6. Multiple Calendars
7. Achievements & Badges
8. Travel Insights

---

## Notes

- Each feature requires a specification in `/openspec/specs/` before implementation
- P1 features are prioritized for maximum user value and differentiation
- Mobile features (React Native) deferred until web platform is mature
- API integrations should follow established demand from users
