# Change: Reports & Export

## Why

Country Calendar users need to understand their travel patterns and extract their data. This change implements the reports API endpoints for summary statistics, the frontend reports UI with dashboard cards and country statistics, and data export functionality in CSV and XLSX formats with appropriate rate limiting.

## What Changes

- **NEW**: Summary report API endpoint (total days, countries, top countries)
- **NEW**: Dashboard summary cards UI component
- **NEW**: Country statistics view (days per country list)
- **NEW**: Export to CSV endpoint with streaming download
- **NEW**: Export to XLSX endpoint with formatted Excel file
- **NEW**: Date range filter for reports (7/30/90/365 days + custom)
- **NEW**: Export rate limiting (5 exports per hour per user)

## Impact

- Affected specs: All new capabilities
  - `reports-api` - Backend API for summary and statistics
  - `reports-ui` - Frontend dashboard and statistics views
  - `export` - Data export functionality (CSV, XLSX)
- Affected code:
  - `/packages/api/src/routes/reports.ts`
  - `/packages/api/src/controllers/reportsController.ts`
  - `/packages/api/src/services/reportsService.ts`
  - `/packages/api/src/services/exportService.ts`
  - `/packages/web/src/pages/Reports.tsx`
  - `/packages/web/src/components/features/reports/ReportsSummary.tsx`
  - `/packages/web/src/components/features/reports/CountryStats.tsx`
  - `/packages/web/src/components/features/reports/ExportOptions.tsx`
  - `/packages/web/src/components/features/reports/DateRangeFilter.tsx`
  - `/packages/web/src/hooks/useReports.ts`
  - `/packages/web/src/services/reportService.ts`

## Dependencies

- Phase 1: Foundation & Infrastructure (API boilerplate, frontend setup)
- Phase 2: Authentication System (JWT auth for protected endpoints)
- Phase 3: Core Travel Features (Travel records data)
- Phase 4: Frontend Landing & Auth UI (Layout, navigation)

## Success Criteria

1. `GET /api/v1/reports/summary?days=30` returns correct statistics
2. Summary includes total days, total countries, and top countries list
3. Dashboard displays summary cards with key statistics
4. Country statistics view shows days per country sorted by frequency
5. `GET /api/v1/reports/export?format=csv` downloads valid CSV file
6. `GET /api/v1/reports/export?format=xlsx` downloads valid XLSX file
7. Date range filter supports preset periods and custom ranges
8. Custom date ranges are limited to 5 years maximum
9. Export date ranges are limited to 10 years maximum
10. Export rate limiting enforces 5 exports per hour per user
11. Empty state displays when user has no travel data
12. Reports page is responsive across all breakpoints
