# Tasks: Add PWA & Mobile App Preparation

## 1. PWA Infrastructure

- [ ] 1.1 Install vite-plugin-pwa and workbox dependencies
- [ ] 1.2 Configure vite-plugin-pwa in vite.config.ts with workbox options
- [ ] 1.3 Create web app manifest (manifest.json) with app metadata
- [ ] 1.4 Generate PWA icons in all required sizes (72x72 to 512x512)
- [ ] 1.5 Create maskable icon for Android adaptive icons
- [ ] 1.6 Add Apple touch icon and iOS-specific meta tags
- [ ] 1.7 Update index.html with manifest link and theme-color meta tags

## 2. Service Worker & Caching

- [ ] 2.1 Configure precaching for static assets (JS, CSS, fonts)
- [ ] 2.2 Set up runtime caching strategy for API routes (network-first)
- [ ] 2.3 Create offline fallback page (offline.html)
- [ ] 2.4 Configure navigation preload for faster responses
- [ ] 2.5 Add cache versioning and cleanup strategy

## 3. PWA UI Components

- [ ] 3.1 Create useOnlineStatus hook for detecting network state
- [ ] 3.2 Create usePWAInstall hook for install prompt handling
- [ ] 3.3 Build InstallPrompt component with dismissable banner
- [ ] 3.4 Build OfflineIndicator component for offline state feedback
- [ ] 3.5 Build UpdatePrompt component for service worker updates
- [ ] 3.6 Integrate PWA components into Layout

## 4. Mobile Optimization

- [ ] 4.1 Add safe-area-inset Tailwind utilities (if not complete)
- [ ] 4.2 Configure viewport meta tag for PWA/native behavior
- [ ] 4.3 Add apple-mobile-web-app meta tags for iOS standalone
- [ ] 4.4 Disable pull-to-refresh in standalone mode (optional)
- [ ] 4.5 Add touch-action CSS for better touch handling
- [ ] 4.6 Test and fix any overflow/scroll issues on mobile

## 5. Capacitor Setup

- [ ] 5.1 Initialize packages/mobile with Capacitor
- [ ] 5.2 Configure capacitor.config.ts with app ID and server settings
- [ ] 5.3 Add iOS platform and configure Info.plist
- [ ] 5.4 Add Android platform and configure AndroidManifest.xml
- [ ] 5.5 Generate splash screens for iOS and Android
- [ ] 5.6 Configure status bar plugin for native status bar control
- [ ] 5.7 Add build scripts for syncing web build to native projects

## 6. Testing & Documentation

- [ ] 6.1 Test PWA installation on Chrome (desktop and Android)
- [ ] 6.2 Test PWA installation on Safari (iOS)
- [ ] 6.3 Test offline mode and cache behavior
- [ ] 6.4 Test Capacitor iOS build in simulator
- [ ] 6.5 Test Capacitor Android build in emulator
- [ ] 6.6 Document PWA installation process for users
- [ ] 6.7 Document native app build process for developers
- [ ] 6.8 Write unit tests for PWA hooks
