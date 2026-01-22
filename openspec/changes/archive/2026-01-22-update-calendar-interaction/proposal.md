# Change: Update Calendar Interaction and Add Country Flags

## Why

The current calendar interaction requires users to toggle a "Range Mode" button before selecting date ranges, which adds friction to the workflow. Additionally, countries are only represented by color dots, making it difficult to quickly identify specific countries. Users need clearer visual feedback and a more intuitive interaction model.

## What Changes

1. **Remove range selection button** - Replace explicit range mode with gesture-based selection:
   - Double-click on a day opens country picker for that single date
   - Single-click on first date, then single-click on second date selects a range and opens bulk country picker

2. **Add country flags** - Display small flag icons alongside country names and color indicators:
   - Bundle flag SVGs locally with the application (no external dependencies)
   - Show flags in calendar day cells (replacing or alongside color dots)
   - Show flags in country picker list items
   - Show flags in recent countries chips

3. **Add help/explanation block** - Display an explanatory UI element on the calendar page:
   - Explain the double-click vs range-click interaction model
   - Can be dismissed and remembered (localStorage)
   - Shown to new users or accessible via help icon

## Impact

- Affected specs: `calendar-view`, `country-picker`
- Affected code:
  - `packages/web/src/components/features/calendar/Calendar.tsx`
  - `packages/web/src/components/features/calendar/DayCell.tsx`
  - `packages/web/src/components/features/calendar/CountryPicker.tsx`
  - `packages/web/src/components/features/calendar/BulkUpdateModal.tsx`
  - `packages/web/src/stores/calendarStore.ts`
  - `packages/web/src/pages/CalendarPage.tsx`
  - New: `packages/web/src/components/ui/Flag.tsx`
  - New: `packages/web/public/flags/` (bundled SVG flags)
