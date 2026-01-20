# Tasks: Admin Panel

## 1. Admin Middleware (Backend)

- [ ] 1.1 Create `adminMiddleware.ts` middleware file
- [ ] 1.2 Verify user is authenticated
- [ ] 1.3 Verify user has `isAdmin = true`
- [ ] 1.4 Return 403 Forbidden if not admin
- [ ] 1.5 Write unit tests for admin middleware

## 2. Admin User Service (Backend)

- [ ] 2.1 Create `adminUserService.ts` service file
- [ ] 2.2 Implement `listUsers(page, limit, search)` method
- [ ] 2.3 Implement case-insensitive search on name and email
- [ ] 2.4 Implement pagination with total count
- [ ] 2.5 Implement `getUserById(id)` method with stats
- [ ] 2.6 Calculate user stats (totalRecords, totalCountries)
- [ ] 2.7 Implement `updateUser(id, data)` method
- [ ] 2.8 Implement `deleteUser(id, adminId)` method
- [ ] 2.9 Prevent admin self-deletion
- [ ] 2.10 Prevent admin self-demotion
- [ ] 2.11 Cascade delete user data (records, OAuth, tokens)
- [ ] 2.12 Write unit tests for admin user service

## 3. Admin Ticket Service (Backend)

- [ ] 3.1 Create `adminTicketService.ts` service file
- [ ] 3.2 Implement `listTickets(page, limit, status)` method
- [ ] 3.3 Filter tickets by status (open, in_progress, closed)
- [ ] 3.4 Implement pagination with total count
- [ ] 3.5 Implement `getTicketByReference(referenceId)` method
- [ ] 3.6 Implement `updateTicket(referenceId, data)` method
- [ ] 3.7 Update ticket status and admin notes
- [ ] 3.8 Implement `deleteTicket(referenceId)` method
- [ ] 3.9 Write unit tests for admin ticket service

## 4. Admin Stats Service (Backend)

- [ ] 4.1 Create `adminStatsService.ts` service file
- [ ] 4.2 Implement `getSystemStats()` method
- [ ] 4.3 Calculate total users count
- [ ] 4.4 Calculate total travel records count
- [ ] 4.5 Calculate active users in last 30 days
- [ ] 4.6 Calculate open tickets count
- [ ] 4.7 Write unit tests for admin stats service

## 5. Admin Audit Service (Backend)

- [ ] 5.1 Create `auditService.ts` service file
- [ ] 5.2 Implement `logAdminAction(adminId, action, targetType, targetId, details)` method
- [ ] 5.3 Define audit action types (USER_UPDATED, USER_DELETED, TICKET_UPDATED, TICKET_DELETED)
- [ ] 5.4 Store timestamp, admin ID, action, and target
- [ ] 5.5 Write unit tests for audit service

## 6. Admin Controller (Backend)

- [ ] 6.1 Create `adminController.ts` controller file
- [ ] 6.2 Implement `GET /admin/users` handler
- [ ] 6.3 Implement `GET /admin/users/:id` handler
- [ ] 6.4 Implement `PATCH /admin/users/:id` handler
- [ ] 6.5 Implement `DELETE /admin/users/:id` handler
- [ ] 6.6 Implement `GET /admin/support` handler
- [ ] 6.7 Implement `PATCH /admin/support/:referenceId` handler
- [ ] 6.8 Implement `DELETE /admin/support/:referenceId` handler
- [ ] 6.9 Implement `GET /admin/stats` handler
- [ ] 6.10 Log all admin actions via audit service
- [ ] 6.11 Write unit tests for admin controller

## 7. Admin Validation (Backend)

- [ ] 7.1 Create `admin.ts` validation file
- [ ] 7.2 Define pagination schema (page, limit, search)
- [ ] 7.3 Define user update schema (name, email, isAdmin, isConfirmed)
- [ ] 7.4 Define ticket status filter schema
- [ ] 7.5 Define ticket update schema (status, notes)
- [ ] 7.6 Write unit tests for validation schemas

## 8. Admin Routes (Backend)

- [ ] 8.1 Create `admin.ts` router file
- [ ] 8.2 Apply authentication middleware to all routes
- [ ] 8.3 Apply admin middleware to all routes
- [ ] 8.4 Register user management routes
- [ ] 8.5 Register ticket management routes
- [ ] 8.6 Register stats route
- [ ] 8.7 Apply validation middleware
- [ ] 8.8 Write integration tests for admin endpoints

## 9. Admin API Service (Frontend)

- [ ] 9.1 Create `adminService.ts` API service
- [ ] 9.2 Implement `getUsers(page, limit, search)` API call
- [ ] 9.3 Implement `getUserById(id)` API call
- [ ] 9.4 Implement `updateUser(id, data)` API call
- [ ] 9.5 Implement `deleteUser(id)` API call
- [ ] 9.6 Implement `getTickets(page, limit, status)` API call
- [ ] 9.7 Implement `updateTicket(referenceId, data)` API call
- [ ] 9.8 Implement `deleteTicket(referenceId)` API call
- [ ] 9.9 Implement `getSystemStats()` API call
- [ ] 9.10 Write unit tests for admin API service

## 10. Admin Data Hooks (Frontend)

- [ ] 10.1 Create `useAdminUsers.ts` hook with TanStack Query
- [ ] 10.2 Implement `useUsers(page, limit, search)` query
- [ ] 10.3 Implement `useUser(id)` query
- [ ] 10.4 Implement `useUpdateUser()` mutation
- [ ] 10.5 Implement `useDeleteUser()` mutation
- [ ] 10.6 Create `useAdminTickets.ts` hook
- [ ] 10.7 Implement `useTickets(page, limit, status)` query
- [ ] 10.8 Implement `useUpdateTicket()` mutation
- [ ] 10.9 Implement `useDeleteTicket()` mutation
- [ ] 10.10 Create `useAdminStats.ts` hook
- [ ] 10.11 Implement `useSystemStats()` query
- [ ] 10.12 Handle cache invalidation after mutations
- [ ] 10.13 Write unit tests for admin hooks

## 11. System Stats Component (Frontend)

- [ ] 11.1 Create `SystemStats.tsx` component
- [ ] 11.2 Display total users card
- [ ] 11.3 Display total records card
- [ ] 11.4 Display active users (30 days) card
- [ ] 11.5 Display open tickets card
- [ ] 11.6 Add loading skeleton states
- [ ] 11.7 Add error state with retry
- [ ] 11.8 Write component tests for system stats

## 12. User List Component (Frontend)

- [ ] 12.1 Create `UserList.tsx` component
- [ ] 12.2 Display paginated user table
- [ ] 12.3 Show columns: name, email, admin badge, confirmed badge, created date
- [ ] 12.4 Implement search input with debounce
- [ ] 12.5 Implement pagination controls
- [ ] 12.6 Add "View" and "Edit" action buttons per row
- [ ] 12.7 Add loading skeleton state
- [ ] 12.8 Add empty state message
- [ ] 12.9 Write component tests for user list

## 13. User Edit Component (Frontend)

- [ ] 13.1 Create `UserEdit.tsx` component
- [ ] 13.2 Display user details (id, email, created date)
- [ ] 13.3 Editable name field
- [ ] 13.4 Editable email field
- [ ] 13.5 Toggle for isAdmin status
- [ ] 13.6 Toggle for isConfirmed status
- [ ] 13.7 Show user stats (records, countries)
- [ ] 13.8 Save button with loading state
- [ ] 13.9 Delete button with confirmation dialog
- [ ] 13.10 Disable self-deletion and self-demotion
- [ ] 13.11 Show validation errors
- [ ] 13.12 Write component tests for user edit

## 14. Ticket List Component (Frontend)

- [ ] 14.1 Create `TicketList.tsx` component
- [ ] 14.2 Display paginated ticket table
- [ ] 14.3 Show columns: reference ID, subject, category, status, date
- [ ] 14.4 Implement status filter dropdown (all, open, in_progress, closed)
- [ ] 14.5 Implement pagination controls
- [ ] 14.6 Add "View" action button per row
- [ ] 14.7 Color-code status badges
- [ ] 14.8 Add loading skeleton state
- [ ] 14.9 Add empty state message
- [ ] 14.10 Write component tests for ticket list

## 15. Ticket Detail Component (Frontend)

- [ ] 15.1 Create `TicketDetail.tsx` component
- [ ] 15.2 Display ticket information (reference, name, email, category)
- [ ] 15.3 Display ticket message
- [ ] 15.4 Display linked user info if available
- [ ] 15.5 Status dropdown for updates
- [ ] 15.6 Admin notes textarea
- [ ] 15.7 Save button with loading state
- [ ] 15.8 Delete button with confirmation
- [ ] 15.9 Show success/error feedback
- [ ] 15.10 Write component tests for ticket detail

## 16. Admin Dashboard Page (Frontend)

- [ ] 16.1 Create `AdminDashboard.tsx` page component
- [ ] 16.2 Integrate system stats component
- [ ] 16.3 Add quick links to Users and Tickets sections
- [ ] 16.4 Add responsive layout
- [ ] 16.5 Write integration tests for admin dashboard

## 17. Admin Users Page (Frontend)

- [ ] 17.1 Create `AdminUsers.tsx` page component
- [ ] 17.2 Integrate user list component
- [ ] 17.3 Handle navigation to user edit
- [ ] 17.4 Add responsive layout
- [ ] 17.5 Write integration tests for admin users page

## 18. Admin User Edit Page (Frontend)

- [ ] 18.1 Create `AdminUserEdit.tsx` page component
- [ ] 18.2 Load user data by ID from URL params
- [ ] 18.3 Integrate user edit component
- [ ] 18.4 Handle navigation back to user list
- [ ] 18.5 Handle delete with redirect
- [ ] 18.6 Write integration tests for admin user edit page

## 19. Admin Tickets Page (Frontend)

- [ ] 19.1 Create `AdminTickets.tsx` page component
- [ ] 19.2 Integrate ticket list component
- [ ] 19.3 Handle navigation to ticket detail
- [ ] 19.4 Add responsive layout
- [ ] 19.5 Write integration tests for admin tickets page

## 20. Admin Ticket Detail Page (Frontend)

- [ ] 20.1 Create `AdminTicketDetail.tsx` page component
- [ ] 20.2 Load ticket data by reference ID from URL params
- [ ] 20.3 Integrate ticket detail component
- [ ] 20.4 Handle navigation back to ticket list
- [ ] 20.5 Handle delete with redirect
- [ ] 20.6 Write integration tests for admin ticket detail page

## 21. Admin Navigation (Frontend)

- [ ] 21.1 Create admin navigation component
- [ ] 21.2 Add links to Dashboard, Users, Tickets
- [ ] 21.3 Highlight active section
- [ ] 21.4 Only show to admin users
- [ ] 21.5 Add responsive mobile menu

## 22. Admin Route Protection (Frontend)

- [ ] 22.1 Create admin route guard component
- [ ] 22.2 Check if user is admin
- [ ] 22.3 Redirect non-admins to home page
- [ ] 22.4 Show loading state during check
- [ ] 22.5 Write tests for admin route protection

## 23. Accessibility & Polish

- [ ] 23.1 Add ARIA labels to all interactive elements
- [ ] 23.2 Ensure tables have proper headers and scope
- [ ] 23.3 Add keyboard navigation for tables
- [ ] 23.4 Ensure focus management for modals
- [ ] 23.5 Ensure color contrast meets WCAG 2.1 AA
- [ ] 23.6 Add status announcements for screen readers
- [ ] 23.7 Run accessibility audit and fix issues

## 24. Integration & Review

- [ ] 24.1 Run all unit tests and ensure they pass
- [ ] 24.2 Run all integration tests and ensure they pass
- [ ] 24.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 24.4 Test user management flow end-to-end
- [ ] 24.5 Test ticket management flow end-to-end
- [ ] 24.6 Test admin self-protection rules
- [ ] 24.7 Verify audit logging
- [ ] 24.8 Review code for SOLID principles compliance
- [ ] 24.9 Cross-browser testing (Chrome, Firefox, Safari)
