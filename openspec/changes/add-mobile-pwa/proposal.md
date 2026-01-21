# Change: Add Progressive Web App (PWA) & Mobile App Preparation

## Why

Country Calendar is designed as a mobile-first responsive web application, but currently lacks the capability to be installed as a standalone app on mobile devices. Users cannot access the app offline, receive push notifications for reminders, or have a native app-like experience. This change prepares the web application for mobile use and lays the foundation for iOS/Android wrapper apps.

## What Changes

- **PWA Infrastructure**: Add web app manifest, service worker with caching strategies, and install prompts
- **Mobile-Optimized Experience**: Enhance touch interactions, safe area handling, and mobile viewport behavior
- **Offline Support**: Cache critical assets and enable basic offline access with sync-when-online capability
- **Native App Wrapper Foundation**: Configure web app to work seamlessly within Capacitor/WebView wrappers
- **App Icons & Splash Screens**: Generate all required icon sizes and splash screens for PWA and native wrappers

## Impact

- Affected specs: New `pwa` capability
- Affected code:
  - `packages/web/vite.config.ts` - PWA plugin integration
  - `packages/web/index.html` - Manifest link, meta tags
  - `packages/web/public/` - Icons, manifest, service worker assets
  - `packages/web/src/` - Install prompt components, offline detection hooks
  - `packages/web/tailwind.config.js` - Safe area utilities
- New dependencies: `vite-plugin-pwa`, `workbox-*`
- Native wrapper: New `packages/mobile/` directory for Capacitor configuration
