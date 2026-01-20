# Change: Core Travel Features

## Why

Country Calendar's primary value proposition is tracking countries visited on specific dates. This change implements the core travel record CRUD operations and countries list endpoint that all other features depend on, including the calendar view, reports, and exports.

## What Changes

- **NEW**: Create travel record endpoint (single date + country)
- **NEW**: Delete travel record endpoint (own records only)
- **NEW**: Get travel records by date range endpoint
- **NEW**: Bulk update records endpoint (date range + multiple countries)
- **NEW**: Countries list endpoint with colors (cached)
- **NEW**: Validation rules for travel records (no future dates, valid country codes, date limits)

## Impact

- Affected specs: All new capabilities
  - `travel-records` - CRUD operations for travel records
  - `countries` - Countries list endpoint
- Affected code:
  - `/packages/api/src/routes/travelRecords.ts`
  - `/packages/api/src/controllers/travelRecordsController.ts`
  - `/packages/api/src/services/travelRecordsService.ts`
  - `/packages/api/src/validators/travelRecord.ts`
  - `/packages/api/src/routes/countries.ts`
  - `/packages/api/src/controllers/countriesController.ts`
  - `/packages/api/src/services/countriesService.ts`

## Dependencies

- Phase 1: Foundation & Infrastructure (database schema, API boilerplate)
- Phase 2: Authentication System (JWT auth for protected endpoints)

## Success Criteria

1. `POST /api/v1/travel-records` creates a single travel record
2. `DELETE /api/v1/travel-records/:id` deletes own records only
3. `GET /api/v1/travel-records?start=&end=` returns records in date range
4. `POST /api/v1/travel-records/bulk` handles bulk updates
5. `GET /api/v1/countries` returns all 249 countries with colors
6. All validation rules enforced (no future dates, valid codes, date limits)
7. All endpoints have proper error responses
8. Unit and integration tests pass
