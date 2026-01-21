# Tasks: Support System

## 1. Support Service (Backend)

- [x] 1.1 Create `supportService.ts` service file
- [x] 1.2 Implement `createTicket(data, userId?)` method
- [x] 1.3 Generate reference ID (TKT-XXXXXXXX format)
- [x] 1.4 Ensure reference ID uniqueness
- [x] 1.5 Link ticket to user if authenticated
- [x] 1.6 Store ticket in database
- [x] 1.7 Implement `getTicketByReference(referenceId)` method (for future use)
- [x] 1.8 Write unit tests for support service

## 2. Reference ID Generator (Backend)

- [x] 2.1 Create reference ID generation utility
- [x] 2.2 Generate 8 uppercase alphanumeric characters
- [x] 2.3 Add TKT- prefix
- [x] 2.4 Check uniqueness and regenerate if collision
- [x] 2.5 Write unit tests for reference ID generator

## 3. Support Validation (Backend)

- [x] 3.1 Create `support.ts` validation file
- [x] 3.2 Define category enum schema (general, account, bug, feature, billing, other)
- [x] 3.3 Define createTicket schema with Zod
- [x] 3.4 Validate name (1-100 chars, trimmed)
- [x] 3.5 Validate email (valid format, max 120 chars, lowercase)
- [x] 3.6 Validate subject (5-200 chars, trimmed)
- [x] 3.7 Validate message (20-5000 chars, trimmed)
- [x] 3.8 Write unit tests for validation schemas

## 4. Support Controller (Backend)

- [x] 4.1 Create `supportController.ts` controller file
- [x] 4.2 Implement `POST /support` handler
- [x] 4.3 Extract user ID from token if authenticated
- [x] 4.4 Validate request body
- [x] 4.5 Create ticket via service
- [ ] 4.6 Trigger email notifications (deferred to Phase 10)
- [x] 4.7 Return reference ID and success message
- [x] 4.8 Write unit tests for support controller

## 5. Support Routes (Backend)

- [x] 5.1 Create `support.ts` router file
- [x] 5.2 Register POST /support route (public)
- [x] 5.3 Apply optional auth middleware (to extract user if logged in)
- [x] 5.4 Apply validation middleware
- [x] 5.5 Apply rate limiting (5 requests per hour per IP)
- [x] 5.6 Write integration tests for support endpoints

## 6. Support Email Service (Backend)

- [ ] 6.1 Create user confirmation email template (deferred to Phase 10)
- [ ] 6.2 Include reference ID, subject, category, message (deferred to Phase 10)
- [ ] 6.3 Create admin notification email template (deferred to Phase 10)
- [ ] 6.4 Include reference ID, submitter details, admin panel link (deferred to Phase 10)
- [ ] 6.5 Implement `sendTicketConfirmation(ticket)` method (deferred to Phase 10)
- [ ] 6.6 Implement `sendAdminNotification(ticket)` method (deferred to Phase 10)
- [ ] 6.7 Write unit tests for email templates (deferred to Phase 10)

## 7. Support API Service (Frontend)

- [x] 7.1 Create `supportService.ts` API service
- [x] 7.2 Implement `createTicket(data)` API call
- [x] 7.3 Handle success response with reference ID
- [x] 7.4 Handle validation errors
- [x] 7.5 Handle rate limit errors
- [ ] 7.6 Write unit tests for support API service (optional)

## 8. Support Form Component (Frontend)

- [x] 8.1 Create `SupportPage.tsx` component (combined form)
- [x] 8.2 Implement name input field
- [x] 8.3 Implement email input field
- [x] 8.4 Implement category dropdown (general, account, bug, feature, billing, other)
- [x] 8.5 Implement subject input field
- [x] 8.6 Implement message textarea with character counter
- [x] 8.7 Pre-fill name and email if user is logged in
- [x] 8.8 Add client-side validation
- [x] 8.9 Show validation errors inline
- [x] 8.10 Implement form submission handler
- [x] 8.11 Show loading state during submission
- [ ] 8.12 Write component tests for support form (optional)

## 9. Support Confirmation Component (Frontend)

- [x] 9.1 Create `SupportConfirmationPage.tsx` component
- [x] 9.2 Display reference ID prominently
- [x] 9.3 Copy reference ID to clipboard feature
- [x] 9.4 Show estimated response time message
- [x] 9.5 Add "Return to Home" button
- [x] 9.6 Add "Submit Another" button
- [ ] 9.7 Write component tests for confirmation (optional)

## 10. Support Page (Frontend)

- [x] 10.1 Create `SupportPage.tsx` page component
- [x] 10.2 Integrate support form
- [x] 10.3 Handle form submission success (navigate to confirmation)
- [x] 10.4 Handle form submission errors
- [x] 10.5 Show rate limit error with retry time
- [x] 10.6 Add page title and description
- [x] 10.7 Add responsive layout
- [ ] 10.8 Write integration tests for support page (optional)

## 11. Category Display (Frontend)

- [x] 11.1 Create category label mapping (technical names to display names)
- [x] 11.2 Display user-friendly category names in form

## 12. Accessibility & Polish

- [x] 12.1 Add ARIA labels to all form fields
- [x] 12.2 Associate labels with inputs properly
- [x] 12.3 Add form error announcements for screen readers
- [x] 12.4 Ensure keyboard navigation works correctly
- [x] 12.5 Add focus indicators for all interactive elements

## 13. Integration & Review

- [x] 13.1 Run all unit tests and ensure they pass (271 tests)
- [x] 13.2 Run all integration tests and ensure they pass
- [x] 13.3 Run linters (ESLint, TypeScript) and fix issues
