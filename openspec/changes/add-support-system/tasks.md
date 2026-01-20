# Tasks: Support System

## 1. Support Service (Backend)

- [ ] 1.1 Create `supportService.ts` service file
- [ ] 1.2 Implement `createTicket(data, userId?)` method
- [ ] 1.3 Generate reference ID (TKT-XXXXXXXX format)
- [ ] 1.4 Ensure reference ID uniqueness
- [ ] 1.5 Link ticket to user if authenticated
- [ ] 1.6 Store ticket in database
- [ ] 1.7 Implement `getTicketByReference(referenceId)` method (for future use)
- [ ] 1.8 Write unit tests for support service

## 2. Reference ID Generator (Backend)

- [ ] 2.1 Create reference ID generation utility
- [ ] 2.2 Generate 8 uppercase alphanumeric characters
- [ ] 2.3 Add TKT- prefix
- [ ] 2.4 Check uniqueness and regenerate if collision
- [ ] 2.5 Write unit tests for reference ID generator

## 3. Support Validation (Backend)

- [ ] 3.1 Create `support.ts` validation file
- [ ] 3.2 Define category enum schema (general, account, bug, feature, billing, other)
- [ ] 3.3 Define createTicket schema with Zod
- [ ] 3.4 Validate name (1-100 chars, trimmed)
- [ ] 3.5 Validate email (valid format, max 120 chars, lowercase)
- [ ] 3.6 Validate subject (5-200 chars, trimmed)
- [ ] 3.7 Validate message (20-5000 chars, trimmed)
- [ ] 3.8 Write unit tests for validation schemas

## 4. Support Controller (Backend)

- [ ] 4.1 Create `supportController.ts` controller file
- [ ] 4.2 Implement `POST /support` handler
- [ ] 4.3 Extract user ID from token if authenticated
- [ ] 4.4 Validate request body
- [ ] 4.5 Create ticket via service
- [ ] 4.6 Trigger email notifications
- [ ] 4.7 Return reference ID and success message
- [ ] 4.8 Write unit tests for support controller

## 5. Support Routes (Backend)

- [ ] 5.1 Create `support.ts` router file
- [ ] 5.2 Register POST /support route (public)
- [ ] 5.3 Apply optional auth middleware (to extract user if logged in)
- [ ] 5.4 Apply validation middleware
- [ ] 5.5 Apply rate limiting (5 requests per hour per IP)
- [ ] 5.6 Write integration tests for support endpoints

## 6. Support Email Service (Backend)

- [ ] 6.1 Create user confirmation email template
- [ ] 6.2 Include reference ID, subject, category, message
- [ ] 6.3 Create admin notification email template
- [ ] 6.4 Include reference ID, submitter details, admin panel link
- [ ] 6.5 Implement `sendTicketConfirmation(ticket)` method
- [ ] 6.6 Implement `sendAdminNotification(ticket)` method
- [ ] 6.7 Write unit tests for email templates

## 7. Support API Service (Frontend)

- [ ] 7.1 Create `supportService.ts` API service
- [ ] 7.2 Implement `createTicket(data)` API call
- [ ] 7.3 Handle success response with reference ID
- [ ] 7.4 Handle validation errors
- [ ] 7.5 Handle rate limit errors
- [ ] 7.6 Write unit tests for support API service

## 8. Support Form Component (Frontend)

- [ ] 8.1 Create `SupportForm.tsx` component
- [ ] 8.2 Implement name input field
- [ ] 8.3 Implement email input field
- [ ] 8.4 Implement category dropdown (general, account, bug, feature, billing, other)
- [ ] 8.5 Implement subject input field
- [ ] 8.6 Implement message textarea with character counter
- [ ] 8.7 Pre-fill name and email if user is logged in
- [ ] 8.8 Add client-side validation
- [ ] 8.9 Show validation errors inline
- [ ] 8.10 Implement form submission handler
- [ ] 8.11 Show loading state during submission
- [ ] 8.12 Write component tests for support form

## 9. Support Confirmation Component (Frontend)

- [ ] 9.1 Create `SupportConfirmation.tsx` component
- [ ] 9.2 Display reference ID prominently
- [ ] 9.3 Display submitted ticket summary
- [ ] 9.4 Show estimated response time message
- [ ] 9.5 Add "Return to Home" button
- [ ] 9.6 Add "Submit Another" button
- [ ] 9.7 Write component tests for confirmation

## 10. Support Page (Frontend)

- [ ] 10.1 Create `Support.tsx` page component
- [ ] 10.2 Integrate support form
- [ ] 10.3 Handle form submission success
- [ ] 10.4 Switch to confirmation view on success
- [ ] 10.5 Handle form submission errors
- [ ] 10.6 Show rate limit error with retry time
- [ ] 10.7 Add page title and description
- [ ] 10.8 Add responsive layout
- [ ] 10.9 Write integration tests for support page

## 11. Category Display (Frontend)

- [ ] 11.1 Create category label mapping (technical names to display names)
- [ ] 11.2 Create category icon mapping (optional)
- [ ] 11.3 Display user-friendly category names in form and confirmation

## 12. Accessibility & Polish

- [ ] 12.1 Add ARIA labels to all form fields
- [ ] 12.2 Associate labels with inputs properly
- [ ] 12.3 Add form error announcements for screen readers
- [ ] 12.4 Ensure keyboard navigation works correctly
- [ ] 12.5 Ensure color contrast meets WCAG 2.1 AA
- [ ] 12.6 Add focus indicators for all interactive elements
- [ ] 12.7 Test with screen reader
- [ ] 12.8 Run accessibility audit and fix issues

## 13. Integration & Review

- [ ] 13.1 Run all unit tests and ensure they pass
- [ ] 13.2 Run all integration tests and ensure they pass
- [ ] 13.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 13.4 Test ticket creation flow end-to-end
- [ ] 13.5 Test with authenticated user (auto-link)
- [ ] 13.6 Test with unauthenticated user
- [ ] 13.7 Verify user confirmation email
- [ ] 13.8 Verify admin notification email
- [ ] 13.9 Test rate limiting behavior
- [ ] 13.10 Review code for SOLID principles compliance
- [ ] 13.11 Cross-browser testing (Chrome, Firefox, Safari)
