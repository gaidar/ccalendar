# Design: PWA & Mobile App Preparation

## Context

Country Calendar is a travel tracking app where users log countries visited on specific dates. The app already has a mobile-first responsive design with a bottom navigation bar. This change adds PWA capabilities and prepares the architecture for native mobile app wrappers.

**Stakeholders**: End users (travelers), mobile users, product team
**Constraints**: Must work within existing React/Vite stack, minimize disruption to current functionality

## Goals / Non-Goals

### Goals
- Enable installation as standalone app on iOS, Android, and desktop
- Provide basic offline access to previously viewed data
- Create native-like experience with proper splash screens and icons
- Prepare codebase for Capacitor-based iOS/Android wrappers
- Maintain existing web functionality

### Non-Goals
- Full offline-first architecture (Phase 2)
- Background sync for data mutations (Phase 2)
- Push notifications (separate Phase 16 feature)
- React Native rewrite (explicitly out of scope)
- Complex caching strategies beyond static assets

## Decisions

### Decision 1: Vite PWA Plugin for Service Worker

**What**: Use `vite-plugin-pwa` with Workbox for service worker generation
**Why**:
- Integrates seamlessly with existing Vite build
- Workbox provides battle-tested caching strategies
- Auto-generates service worker with configurable options
- Handles cache versioning and cleanup automatically

**Alternatives considered**:
- Manual service worker: More control but significant maintenance burden
- Parcel PWA: Would require build tool migration
- Create React App PWA template: Not compatible with Vite

### Decision 2: Capacitor for Native Wrappers

**What**: Use Capacitor (not Cordova or React Native) for iOS/Android apps
**Why**:
- WebView-based approach reuses existing web code (minimal effort)
- Access to native APIs (biometrics, haptics, status bar) when needed
- Active maintenance by Ionic team
- TypeScript-first API
- Can be added incrementally without major codebase changes

**Alternatives considered**:
- React Native: Full rewrite required, doesn't meet "wrapper" requirement
- Cordova: Legacy, less active maintenance
- Electron: Desktop only, not for mobile
- TWA (Trusted Web Activity): Android-only, limited native API access

### Decision 3: Caching Strategy - Cache-First for Assets, Network-First for API

**What**:
- Static assets (JS, CSS, images, fonts): Cache-first with background update
- API responses: Network-first with stale-while-revalidate fallback
- Navigation: Network-first for app shell

**Why**:
- Static assets rarely change, safe to serve from cache
- API data should be fresh when network available
- Stale data acceptable as fallback when offline

### Decision 4: Safe Area Handling

**What**: Use CSS `env()` variables and Tailwind utilities for safe areas
**Why**:
- Works in both PWA and native wrapper contexts
- `env(safe-area-inset-*)` is the web standard
- Already partially implemented (`pb-safe` class exists)
- No JavaScript required for layout

### Decision 5: Web App Manifest Configuration

**What**: Comprehensive manifest with all icon sizes and display modes
**Why**:
- Different platforms require different icon sizes
- `standalone` display mode for native-like experience
- Theme colors for status bar integration
- Shortcuts for quick actions from home screen

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Web App (PWA)                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React SPA                           │  │
│  │  - Install prompt component                            │  │
│  │  - Offline indicator component                         │  │
│  │  - useOnlineStatus hook                                │  │
│  │  - usePWAInstall hook                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Service Worker (Workbox)                  │  │
│  │  - Precache static assets                              │  │
│  │  - Runtime caching for API                             │  │
│  │  - Offline fallback page                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    Native Wrapper (Optional)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Capacitor Shell                           │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │   iOS (Swift)    │  │ Android (Kotlin)│                   │
│  │   WebView        │  │    WebView      │                   │
│  └─────────────────┘  └─────────────────┘                   │
│  - Native status bar control                                 │
│  - Haptic feedback (future)                                  │
│  - Biometric auth (future)                                   │
│  - App Store / Play Store distribution                       │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
packages/web/
├── public/
│   ├── manifest.json           # Web app manifest
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   ├── icon-512x512.png
│   │   ├── maskable-icon-512x512.png
│   │   └── apple-touch-icon.png
│   └── offline.html            # Offline fallback page
├── src/
│   ├── components/
│   │   └── pwa/
│   │       ├── InstallPrompt.tsx
│   │       ├── OfflineIndicator.tsx
│   │       └── UpdatePrompt.tsx
│   └── hooks/
│       ├── useOnlineStatus.ts
│       └── usePWAInstall.ts
└── vite.config.ts              # PWA plugin configuration

packages/mobile/                 # Capacitor project (separate package)
├── capacitor.config.ts
├── ios/                        # Generated iOS project
├── android/                    # Generated Android project
└── package.json
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Service worker caching may serve stale content | Use cache busting with content hashes, show update prompts |
| iOS PWA limitations (no push, limited storage) | Document limitations, recommend native wrapper for full iOS experience |
| Capacitor adds build complexity | Keep native wrapper optional, CI/CD for automated builds |
| Offline mode may confuse users with stale data | Clear offline indicator, disable mutations when offline |

## Migration Plan

1. **Phase 1 - PWA Foundation** (This change)
   - Add vite-plugin-pwa configuration
   - Create manifest and icons
   - Implement basic service worker with asset caching
   - Add install prompt and offline indicator

2. **Phase 2 - Capacitor Integration** (This change)
   - Initialize Capacitor project in packages/mobile
   - Configure iOS and Android projects
   - Build and test wrapper apps
   - Document App Store submission process

3. **Future Phases** (Separate changes)
   - Background sync for offline mutations
   - Push notifications via Capacitor plugin
   - Biometric authentication

## Open Questions

1. **Icon design**: Need design assets for all icon sizes - should we create a script to generate from a single source SVG?
2. **App name**: Should the native apps have a different name than "Country Calendar"?
3. **Offline data scope**: How much historical data should be cached for offline access?
