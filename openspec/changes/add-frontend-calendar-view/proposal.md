# Change: Frontend Calendar View

## Why

The calendar view is the core user interface of Country Calendar, where users interact with their travel records daily. This change implements the month calendar grid, day cells with country indicators, country picker modal, date range selection for bulk updates, and all the supporting interactions that make tracking travel intuitive and efficient.

## What Changes

- **NEW**: Month calendar view with responsive grid layout
- **NEW**: Day cells with country color indicators and overflow (+N)
- **NEW**: Single date country picker modal/sheet with search
- **NEW**: Date range selection with visual highlighting
- **NEW**: Bulk update modal for multi-country selection
- **NEW**: Fuzzy country search using Fuse.js
- **NEW**: Recent countries quick-pick based on user history
- **NEW**: Optimistic UI updates for immediate feedback
- **NEW**: Calendar navigation (prev/next month, month/year selector)
- **NEW**: Today highlight with visual indicator
- **NEW**: Keyboard navigation (arrow keys, Enter/Space)

## Impact

- Affected specs: All new capabilities
  - `calendar-view` - Month grid, day cells, navigation, keyboard support
  - `country-picker` - Country selection modal, fuzzy search, recent countries
  - `calendar-state` - State management, optimistic updates, data fetching
- Affected code:
  - `/packages/web/src/pages/Calendar.tsx`
  - `/packages/web/src/components/features/calendar/Calendar.tsx`
  - `/packages/web/src/components/features/calendar/DayCell.tsx`
  - `/packages/web/src/components/features/calendar/CountryPicker.tsx`
  - `/packages/web/src/components/features/calendar/DateRangePicker.tsx`
  - `/packages/web/src/components/features/calendar/BulkUpdateModal.tsx`
  - `/packages/web/src/components/features/calendar/MonthNavigation.tsx`
  - `/packages/web/src/stores/calendarStore.ts`
  - `/packages/web/src/hooks/useTravelRecords.ts`
  - `/packages/web/src/hooks/useCountries.ts`

## Dependencies

- Phase 1: Foundation & Infrastructure (React setup, Tailwind, shadcn/ui)
- Phase 3: Core Travel Features (Travel records API, Countries API)
- Phase 4: Frontend Landing & Auth UI (Layout, navigation, auth state)

## Success Criteria

1. Month calendar displays correctly with all days
2. Day cells show country color dots (max 3 visible, +N overflow)
3. Clicking a day opens the country picker
4. Country search filters countries in real-time (fuzzy matching)
5. Recent countries appear as quick-pick options
6. Selecting countries updates the calendar optimistically
7. Date range selection highlights selected dates
8. Bulk update applies countries to all dates in range
9. Navigation changes months/years correctly
10. Today is visually highlighted
11. Keyboard navigation works (arrows, Enter, Escape)
12. Future dates are disabled/grayed out
13. Mobile: Uses bottom sheet for country picker
14. Desktop: Uses modal for country picker
15. Calendar loads travel records for visible month range
