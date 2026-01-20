# Tasks: Core Travel Features

## 1. Travel Records Validation

- [ ] 1.1 Create `countryCodeSchema` with ISO 3166-1 alpha-2 validation
- [ ] 1.2 Create `dateSchema` with format, future date, and 100-year limit validation
- [ ] 1.3 Create `createRecordSchema` for single record creation
- [ ] 1.4 Create `bulkUpdateSchema` with date range and country array validation
- [ ] 1.5 Create `dateRangeQuerySchema` for query parameters
- [ ] 1.6 Write unit tests for all validation schemas

## 2. Travel Records Service

- [ ] 2.1 Implement `createRecord(userId, date, countryCode)` service method
- [ ] 2.2 Implement `deleteRecord(userId, recordId)` service method with ownership check
- [ ] 2.3 Implement `getRecordsByDateRange(userId, start, end)` service method
- [ ] 2.4 Implement `bulkUpdateRecords(userId, startDate, endDate, countryCodes)` service method
- [ ] 2.5 Write unit tests for travel records service

## 3. Travel Records Controller

- [ ] 3.1 Implement `POST /travel-records` controller handler
- [ ] 3.2 Implement `DELETE /travel-records/:id` controller handler
- [ ] 3.3 Implement `GET /travel-records` controller handler with query params
- [ ] 3.4 Implement `POST /travel-records/bulk` controller handler
- [ ] 3.5 Write unit tests for travel records controller

## 4. Travel Records Routes

- [ ] 4.1 Create travel records router with authentication middleware
- [ ] 4.2 Register all travel records endpoints
- [ ] 4.3 Apply validation middleware to each endpoint
- [ ] 4.4 Write integration tests for all endpoints

## 5. Countries Service

- [ ] 5.1 Create countries data file with ISO 3166-1 alpha-2 codes and colors
- [ ] 5.2 Implement `getAllCountries()` service method with caching
- [ ] 5.3 Implement `getCountryByCode(code)` service method
- [ ] 5.4 Implement `isValidCountryCode(code)` helper for validation
- [ ] 5.5 Write unit tests for countries service

## 6. Countries Controller & Routes

- [ ] 6.1 Implement `GET /countries` controller handler
- [ ] 6.2 Create countries router (public endpoint, no auth required)
- [ ] 6.3 Add cache headers for countries response
- [ ] 6.4 Write integration tests for countries endpoint

## 7. Error Handling

- [ ] 7.1 Create `RecordNotFoundError` custom error class
- [ ] 7.2 Create `RecordAccessDeniedError` custom error class
- [ ] 7.3 Create `InvalidCountryCodeError` custom error class
- [ ] 7.4 Create `InvalidDateError` custom error class
- [ ] 7.5 Update error handling middleware to handle new error types

## 8. Integration & Review

- [ ] 8.1 Run all unit tests and ensure they pass
- [ ] 8.2 Run all integration tests and ensure they pass
- [ ] 8.3 Run linters (ESLint, TypeScript) and fix any issues
- [ ] 8.4 Review code for SOLID principles compliance
- [ ] 8.5 Update API documentation if applicable
