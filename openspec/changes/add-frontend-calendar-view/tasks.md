# Tasks: Frontend Calendar View

## 1. Calendar Grid Component

- [x] 1.1 Create `Calendar.tsx` main component
- [x] 1.2 Implement month grid layout with 7 columns (days of week)
- [x] 1.3 Implement day header row (Mon, Tue, Wed... or M, T, W on mobile)
- [x] 1.4 Calculate and render days for current month view
- [x] 1.5 Include leading/trailing days from adjacent months (grayed)
- [x] 1.6 Add responsive styles for mobile/tablet/desktop breakpoints
- [ ] 1.7 Write component tests for calendar grid

## 2. Day Cell Component

- [x] 2.1 Create `DayCell.tsx` component
- [x] 2.2 Display day number in top-left corner
- [x] 2.3 Implement country color dots (max 3 visible)
- [x] 2.4 Implement overflow indicator (+N) when > 3 countries
- [x] 2.5 Implement visual states: default, today, selected, has-records
- [x] 2.6 Implement future date state (grayed, non-interactive)
- [x] 2.7 Implement outside-month state (lighter text)
- [x] 2.8 Add hover state for desktop
- [x] 2.9 Add focus state for keyboard navigation
- [x] 2.10 Ensure touch target is at least 44x44 pixels on mobile
- [ ] 2.11 Write component tests for day cell

## 3. Calendar Navigation

- [x] 3.1 Create `MonthNavigation.tsx` component
- [x] 3.2 Implement previous/next month buttons
- [x] 3.3 Implement month/year display with click to open selector
- [ ] 3.4 Create month selector dropdown/modal
- [ ] 3.5 Create year selector dropdown/modal
- [x] 3.6 Implement "Today" button to jump to current date
- [ ] 3.7 Add keyboard shortcuts for navigation (if applicable)
- [ ] 3.8 Write component tests for navigation

## 4. Country Picker Modal

- [x] 4.1 Create `CountryPicker.tsx` component
- [x] 4.2 Implement modal wrapper for desktop (centered dialog)
- [x] 4.3 Implement bottom sheet wrapper for mobile (slide up)
- [x] 4.4 Add search input field at top
- [x] 4.5 Implement recent countries quick-pick section
- [x] 4.6 Implement scrollable country list with checkboxes
- [x] 4.7 Show selected countries with visual indicator (checked)
- [x] 4.8 Add country flag/emoji display alongside name
- [x] 4.9 Implement "Clear" and "Save" action buttons
- [x] 4.10 Handle modal close (backdrop click, Escape key, X button)
- [ ] 4.11 Write component tests for country picker

## 5. Fuzzy Country Search

- [x] 5.1 Install and configure Fuse.js
- [x] 5.2 Create search index for countries (code, name)
- [x] 5.3 Implement debounced search input handler
- [x] 5.4 Filter country list based on search query
- [ ] 5.5 Highlight matching text in search results
- [x] 5.6 Handle no results state
- [ ] 5.7 Write unit tests for search functionality

## 6. Recent Countries Feature

- [x] 6.1 Track recently used countries in local storage
- [x] 6.2 Limit recent countries to last 5-10 used
- [x] 6.3 Display recent countries as quick-pick chips
- [x] 6.4 Allow single-click to toggle recent country
- [x] 6.5 Update recent list when countries are selected
- [ ] 6.6 Write unit tests for recent countries logic

## 7. Date Range Selection

- [x] 7.1 Create `DateRangePicker.tsx` component (integrated in Calendar)
- [x] 7.2 Implement "Select Range" button/mode toggle
- [x] 7.3 Track start and end date selection
- [x] 7.4 Highlight selected range on calendar
- [x] 7.5 Show range selection UI (start date → end date)
- [x] 7.6 Validate range (start <= end, both not in future)
- [x] 7.7 Clear range selection on cancel
- [ ] 7.8 Write component tests for date range selection

## 8. Bulk Update Modal

- [x] 8.1 Create `BulkUpdateModal.tsx` component
- [x] 8.2 Display selected date range in header
- [x] 8.3 Integrate country picker for multi-selection
- [x] 8.4 Show confirmation: "Add {countries} to {X} days?"
- [x] 8.5 Implement loading state during bulk update
- [x] 8.6 Handle success (close modal, show toast)
- [x] 8.7 Handle error (show error message, keep modal open)
- [ ] 8.8 Write component tests for bulk update modal

## 9. Calendar State Management

- [x] 9.1 Create `calendarStore.ts` Zustand store
- [x] 9.2 Implement `selectedDate` state and setter
- [x] 9.3 Implement `viewMonth` state for current view
- [x] 9.4 Implement `selectedRange` state for bulk selection
- [x] 9.5 Implement `isRangeMode` state toggle
- [x] 9.6 Create `useTravelRecords` hook with TanStack Query
- [x] 9.7 Fetch records for visible month range (include adjacent days)
- [x] 9.8 Cache records by month to avoid refetching
- [ ] 9.9 Write unit tests for calendar store

## 10. Optimistic UI Updates

- [ ] 10.1 Implement optimistic update for single record creation
- [ ] 10.2 Implement optimistic update for record deletion
- [ ] 10.3 Implement optimistic rollback on API error
- [x] 10.4 Show subtle loading indicator during save
- [x] 10.5 Invalidate and refetch on confirmed save
- [ ] 10.6 Write unit tests for optimistic update logic

## 11. Keyboard Navigation

- [ ] 11.1 Implement arrow key navigation between days
- [x] 11.2 Implement Enter/Space to select date and open picker
- [x] 11.3 Implement Escape to close picker/modal
- [x] 11.4 Implement Tab navigation through calendar
- [x] 11.5 Manage focus when modal opens/closes
- [x] 11.6 Add `aria-label` and `role` attributes for accessibility
- [ ] 11.7 Write tests for keyboard navigation

## 12. Countries Data Hook

- [x] 12.1 Create `useCountries` hook with TanStack Query
- [x] 12.2 Fetch countries list from API
- [x] 12.3 Cache countries indefinitely (static data)
- [x] 12.4 Provide `getCountryByCode` helper
- [x] 12.5 Provide `getCountryColor` helper
- [ ] 12.6 Write unit tests for countries hook

## 13. Calendar Page

- [x] 13.1 Create `Calendar.tsx` page component
- [x] 13.2 Integrate calendar grid with navigation
- [x] 13.3 Integrate country picker modal
- [x] 13.4 Integrate bulk update functionality
- [x] 13.5 Add loading skeleton while data fetches
- [ ] 13.6 Add empty state for months with no records
- [ ] 13.7 Add error state with retry option
- [ ] 13.8 Write integration tests for calendar page

## 14. Accessibility & Polish

- [x] 14.1 Add ARIA labels to all interactive calendar elements
- [x] 14.2 Implement `aria-current="date"` for today
- [ ] 14.3 Announce month changes to screen readers
- [x] 14.4 Ensure color contrast meets WCAG 2.1 AA
- [ ] 14.5 Respect `prefers-reduced-motion` for animations
- [ ] 14.6 Test with VoiceOver/NVDA screen readers
- [ ] 14.7 Run accessibility audit and fix issues

## 15. Integration & Review

- [ ] 15.1 Run all unit tests and ensure they pass
- [ ] 15.2 Run all integration tests and ensure they pass
- [x] 15.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 15.4 Test on mobile devices/simulators
- [ ] 15.5 Test touch interactions (tap, swipe, long-press)
- [x] 15.6 Review code for SOLID principles compliance
- [ ] 15.7 Cross-browser testing (Chrome, Firefox, Safari)
