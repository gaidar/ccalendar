# Tasks: Reports & Export

## 1. Reports Service (Backend)

- [ ] 1.1 Create `reportsService.ts` service file
- [ ] 1.2 Implement `getSummary(userId, startDate, endDate)` method
- [ ] 1.3 Calculate total unique days with travel records
- [ ] 1.4 Calculate total unique countries visited
- [ ] 1.5 Calculate top countries by days visited (sorted descending)
- [ ] 1.6 Implement date range calculation for preset periods (7/30/90/365 days)
- [ ] 1.7 Implement `getCountryStatistics(userId, startDate, endDate)` method
- [ ] 1.8 Write unit tests for reports service

## 2. Reports Controller (Backend)

- [ ] 2.1 Create `reportsController.ts` controller file
- [ ] 2.2 Implement `GET /reports/summary` handler
- [ ] 2.3 Validate `days` query parameter (7, 30, 90, 365)
- [ ] 2.4 Validate custom date range parameters (start, end)
- [ ] 2.5 Enforce 5-year maximum for custom date ranges
- [ ] 2.6 Write unit tests for reports controller

## 3. Reports Routes (Backend)

- [ ] 3.1 Create `reports.ts` router file
- [ ] 3.2 Register routes with authentication middleware
- [ ] 3.3 Apply validation middleware for query parameters
- [ ] 3.4 Write integration tests for reports endpoints

## 4. Export Service (Backend)

- [ ] 4.1 Create `exportService.ts` service file
- [ ] 4.2 Implement `exportToCsv(userId, startDate, endDate)` method
- [ ] 4.3 Implement CSV streaming for large datasets
- [ ] 4.4 Define CSV columns: date, country_code, country_name
- [ ] 4.5 Implement `exportToXlsx(userId, startDate, endDate)` method
- [ ] 4.6 Add XLSX formatting (headers, column widths, date formatting)
- [ ] 4.7 Enforce 10-year maximum for export date ranges
- [ ] 4.8 Write unit tests for export service

## 5. Export Controller & Routes (Backend)

- [ ] 5.1 Create export handler in reports controller
- [ ] 5.2 Implement `GET /reports/export` handler
- [ ] 5.3 Validate `format` query parameter (csv, xlsx)
- [ ] 5.4 Validate date range parameters
- [ ] 5.5 Set appropriate Content-Type and Content-Disposition headers
- [ ] 5.6 Implement streaming response for large files
- [ ] 5.7 Write integration tests for export endpoint

## 6. Export Rate Limiting (Backend)

- [ ] 6.1 Create rate limiter for export endpoint
- [ ] 6.2 Configure 5 requests per hour per user limit
- [ ] 6.3 Store rate limit counters (Redis or in-memory)
- [ ] 6.4 Return 429 with Retry-After header when limit exceeded
- [ ] 6.5 Write unit tests for export rate limiting

## 7. Reports API Service (Frontend)

- [ ] 7.1 Create `reportService.ts` API service
- [ ] 7.2 Implement `getSummary(period)` API call
- [ ] 7.3 Implement `getSummary(startDate, endDate)` for custom range
- [ ] 7.4 Implement `exportData(format, startDate, endDate)` for downloads
- [ ] 7.5 Handle file download response (blob)
- [ ] 7.6 Write unit tests for report service

## 8. Reports Data Hook (Frontend)

- [ ] 8.1 Create `useReports.ts` hook with TanStack Query
- [ ] 8.2 Implement `useSummary(period)` query
- [ ] 8.3 Implement query caching with period-based keys
- [ ] 8.4 Implement `useExport()` mutation for downloads
- [ ] 8.5 Handle loading and error states
- [ ] 8.6 Write unit tests for reports hook

## 9. Summary Cards Component (Frontend)

- [ ] 9.1 Create `ReportsSummary.tsx` component
- [ ] 9.2 Implement total days card with icon
- [ ] 9.3 Implement total countries card with icon
- [ ] 9.4 Implement date range display
- [ ] 9.5 Add loading skeleton state
- [ ] 9.6 Add responsive grid layout (1 col mobile, 2-3 cols desktop)
- [ ] 9.7 Write component tests for summary cards

## 10. Country Statistics Component (Frontend)

- [ ] 10.1 Create `CountryStats.tsx` component
- [ ] 10.2 Display countries list sorted by days (descending)
- [ ] 10.3 Show country flag/emoji, name, and day count
- [ ] 10.4 Show country color indicator
- [ ] 10.5 Implement percentage bar visualization
- [ ] 10.6 Add "Show more" for long lists (default 10, expand to all)
- [ ] 10.7 Add loading skeleton state
- [ ] 10.8 Write component tests for country statistics

## 11. Date Range Filter Component (Frontend)

- [ ] 11.1 Create `DateRangeFilter.tsx` component
- [ ] 11.2 Implement preset period buttons (7, 30, 90, 365 days)
- [ ] 11.3 Implement "Custom" option to open date picker
- [ ] 11.4 Create custom date range picker (start/end)
- [ ] 11.5 Validate custom range does not exceed 5 years
- [ ] 11.6 Show selected period with visual indicator
- [ ] 11.7 Trigger data refetch on period change
- [ ] 11.8 Write component tests for date range filter

## 12. Export Options Component (Frontend)

- [ ] 12.1 Create `ExportOptions.tsx` component
- [ ] 12.2 Implement CSV export button
- [ ] 12.3 Implement XLSX export button
- [ ] 12.4 Show loading state during export
- [ ] 12.5 Handle rate limit error (show remaining time)
- [ ] 12.6 Show success feedback on download start
- [ ] 12.7 Implement date range selection for export
- [ ] 12.8 Validate export range does not exceed 10 years
- [ ] 12.9 Write component tests for export options

## 13. Reports Page (Frontend)

- [ ] 13.1 Create `Reports.tsx` page component
- [ ] 13.2 Integrate date range filter at top
- [ ] 13.3 Integrate summary cards section
- [ ] 13.4 Integrate country statistics section
- [ ] 13.5 Integrate export options section
- [ ] 13.6 Implement empty state for new users
- [ ] 13.7 Implement error state with retry option
- [ ] 13.8 Add responsive layout for all sections
- [ ] 13.9 Write integration tests for reports page

## 14. Accessibility & Polish

- [ ] 14.1 Add ARIA labels to all interactive elements
- [ ] 14.2 Ensure charts/visualizations have text alternatives
- [ ] 14.3 Add keyboard navigation for filter buttons
- [ ] 14.4 Announce data updates to screen readers
- [ ] 14.5 Ensure color contrast meets WCAG 2.1 AA
- [ ] 14.6 Run accessibility audit and fix issues

## 15. Integration & Review

- [ ] 15.1 Run all unit tests and ensure they pass
- [ ] 15.2 Run all integration tests and ensure they pass
- [ ] 15.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 15.4 Test export with large datasets
- [ ] 15.5 Test rate limiting behavior
- [ ] 15.6 Review code for SOLID principles compliance
- [ ] 15.7 Cross-browser testing (Chrome, Firefox, Safari)
