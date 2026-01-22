# Tasks

## 1. Update Calendar Interaction Model

- [x] 1.1 Remove range mode toggle button from MonthNavigation component
- [x] 1.2 Remove `isRangeMode` state and `toggleRangeMode` action from calendarStore
- [x] 1.3 Implement double-click detection on DayCell for single-date selection
- [x] 1.4 Implement click-to-start-range, click-to-end-range logic
- [x] 1.5 Add visual feedback for "range start selected" intermediate state
- [x] 1.6 Update CalendarPage to handle new interaction flow
- [x] 1.7 Add hover preview for range when first date is selected
- [x] 1.8 Update keyboard navigation to support new interaction model

## 2. Add Country Flags

- [x] 2.1 Source and bundle SVG flag files (use flag-icons or similar open-source set)
- [x] 2.2 Create Flag component (`packages/web/src/components/ui/Flag.tsx`)
- [x] 2.3 Add flag cache/preload mechanism for performance
- [x] 2.4 Update DayCell to show flags instead of/alongside color dots
- [x] 2.5 Update CountryPicker list items to show flags
- [x] 2.6 Update recent countries chips to show flags
- [x] 2.7 Update BulkUpdateModal country display with flags
- [x] 2.8 Ensure flags scale properly across responsive breakpoints

## 3. Add Help/Explanation Block

- [x] 3.1 Design help block UI (dismissible card/banner)
- [x] 3.2 Create CalendarHelp component
- [x] 3.3 Implement localStorage persistence for dismissed state
- [x] 3.4 Add help icon button to re-show the explanation
- [x] 3.5 Write clear, concise help text explaining the interaction model
- [x] 3.6 Add subtle animation or visual treatment to make help discoverable

## 4. Testing

- [x] 4.1 Write unit tests for new click interaction logic
- [x] 4.2 Write unit tests for Flag component
- [x] 4.3 Update existing calendar E2E tests for new interaction
- [x] 4.4 Add E2E tests for help block dismiss/show behavior
- [x] 4.5 Test flag loading and caching behavior

## 5. Review and Polish

- [x] 5.1 Code review for all changes
- [x] 5.2 Accessibility audit (double-click alternative for keyboard users)
- [x] 5.3 Performance check (flag bundle size, lazy loading if needed)
- [x] 5.4 Mobile testing for touch interactions
