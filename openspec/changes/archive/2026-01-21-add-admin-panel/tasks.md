# Tasks: Admin Panel

## 1. Admin Middleware (Backend)

- [x] 1.1 Create `adminMiddleware.ts` middleware file (already exists in authenticate.ts)
- [x] 1.2 Verify user is authenticated
- [x] 1.3 Verify user has `isAdmin = true`
- [x] 1.4 Return 403 Forbidden if not admin
- [x] 1.5 Write unit tests for admin middleware

## 2. Admin User Service (Backend)

- [x] 2.1 Create `adminUserService.ts` service file
- [x] 2.2 Implement `listUsers(page, limit, search)` method
- [x] 2.3 Implement case-insensitive search on name and email
- [x] 2.4 Implement pagination with total count
- [x] 2.5 Implement `getUserById(id)` method with stats
- [x] 2.6 Calculate user stats (totalRecords, totalCountries)
- [x] 2.7 Implement `updateUser(id, data)` method
- [x] 2.8 Implement `deleteUser(id, adminId)` method
- [x] 2.9 Prevent admin self-deletion
- [x] 2.10 Prevent admin self-demotion
- [x] 2.11 Cascade delete user data (records, OAuth, tokens)
- [x] 2.12 Write unit tests for admin user service

## 3. Admin Ticket Service (Backend)

- [x] 3.1 Create `adminTicketService.ts` service file
- [x] 3.2 Implement `listTickets(page, limit, status)` method
- [x] 3.3 Filter tickets by status (open, in_progress, closed)
- [x] 3.4 Implement pagination with total count
- [x] 3.5 Implement `getTicketByReference(referenceId)` method
- [x] 3.6 Implement `updateTicket(referenceId, data)` method
- [x] 3.7 Update ticket status and admin notes
- [x] 3.8 Implement `deleteTicket(referenceId)` method
- [x] 3.9 Write unit tests for admin ticket service

## 4. Admin Stats Service (Backend)

- [x] 4.1 Create `adminStatsService.ts` service file
- [x] 4.2 Implement `getSystemStats()` method
- [x] 4.3 Calculate total users count
- [x] 4.4 Calculate total travel records count
- [x] 4.5 Calculate active users in last 30 days
- [x] 4.6 Calculate open tickets count
- [x] 4.7 Write unit tests for admin stats service

## 5. Admin Audit Service (Backend)

- [x] 5.1 Create `auditService.ts` service file
- [x] 5.2 Implement `logAdminAction(adminId, action, targetType, targetId, details)` method
- [x] 5.3 Define audit action types (USER_UPDATED, USER_DELETED, TICKET_UPDATED, TICKET_DELETED)
- [x] 5.4 Store timestamp, admin ID, action, and target
- [x] 5.5 Write unit tests for audit service

## 6. Admin Controller (Backend)

- [x] 6.1 Create `adminController.ts` controller file
- [x] 6.2 Implement `GET /admin/users` handler
- [x] 6.3 Implement `GET /admin/users/:id` handler
- [x] 6.4 Implement `PATCH /admin/users/:id` handler
- [x] 6.5 Implement `DELETE /admin/users/:id` handler
- [x] 6.6 Implement `GET /admin/support` handler
- [x] 6.7 Implement `PATCH /admin/support/:referenceId` handler
- [x] 6.8 Implement `DELETE /admin/support/:referenceId` handler
- [x] 6.9 Implement `GET /admin/stats` handler
- [x] 6.10 Log all admin actions via audit service
- [x] 6.11 Write unit tests for admin controller

## 7. Admin Validation (Backend)

- [x] 7.1 Create `admin.ts` validation file
- [x] 7.2 Define pagination schema (page, limit, search)
- [x] 7.3 Define user update schema (name, email, isAdmin, isConfirmed)
- [x] 7.4 Define ticket status filter schema
- [x] 7.5 Define ticket update schema (status, notes)
- [x] 7.6 Write unit tests for validation schemas

## 8. Admin Routes (Backend)

- [x] 8.1 Create `admin.ts` router file
- [x] 8.2 Apply authentication middleware to all routes
- [x] 8.3 Apply admin middleware to all routes
- [x] 8.4 Register user management routes
- [x] 8.5 Register ticket management routes
- [x] 8.6 Register stats route
- [x] 8.7 Apply validation middleware
- [x] 8.8 Write integration tests for admin endpoints

## 9. Admin API Service (Frontend)

- [x] 9.1 Create `adminService.ts` API service (uses existing api.ts)
- [x] 9.2 Implement `getUsers(page, limit, search)` API call
- [x] 9.3 Implement `getUserById(id)` API call
- [x] 9.4 Implement `updateUser(id, data)` API call
- [x] 9.5 Implement `deleteUser(id)` API call
- [x] 9.6 Implement `getTickets(page, limit, status)` API call
- [x] 9.7 Implement `updateTicket(referenceId, data)` API call
- [x] 9.8 Implement `deleteTicket(referenceId)` API call
- [x] 9.9 Implement `getSystemStats()` API call
- [x] 9.10 Write unit tests for admin API service

## 10. Admin Data Hooks (Frontend)

- [x] 10.1 Create `useAdmin.ts` hook with TanStack Query
- [x] 10.2 Implement `useAdminUsers(page, limit, search)` query
- [x] 10.3 Implement `useAdminUser(id)` query
- [x] 10.4 Implement `useUpdateUser()` mutation
- [x] 10.5 Implement `useDeleteUser()` mutation
- [x] 10.6 Create ticket hooks in same file
- [x] 10.7 Implement `useAdminTickets(page, limit, status)` query
- [x] 10.8 Implement `useUpdateTicket()` mutation
- [x] 10.9 Implement `useDeleteTicket()` mutation
- [x] 10.10 Implement `useSystemStats()` query
- [x] 10.11 Handle cache invalidation after mutations

## 11. System Stats Component (Frontend)

- [x] 11.1 Create `SystemStats.tsx` component
- [x] 11.2 Display total users card
- [x] 11.3 Display total records card
- [x] 11.4 Display active users (30 days) card
- [x] 11.5 Display open tickets card
- [x] 11.6 Add loading skeleton states
- [x] 11.7 Add error state with retry

## 12. User List Component (Frontend)

- [x] 12.1 Create `UserList.tsx` component
- [x] 12.2 Display paginated user table
- [x] 12.3 Show columns: name, email, admin badge, confirmed badge, created date
- [x] 12.4 Implement search input with debounce
- [x] 12.5 Implement pagination controls
- [x] 12.6 Add "View" action button per row
- [x] 12.7 Add loading skeleton state
- [x] 12.8 Add empty state message

## 13. User Edit Component (Frontend)

- [x] 13.1 Create `UserEdit.tsx` component
- [x] 13.2 Display user details (id, email, created date)
- [x] 13.3 Editable name field (via name display)
- [x] 13.4 Editable email field (via email display)
- [x] 13.5 Toggle for isAdmin status
- [x] 13.6 Toggle for isConfirmed status
- [x] 13.7 Show user stats (records, countries)
- [x] 13.8 Save button with loading state
- [x] 13.9 Delete button with confirmation dialog
- [x] 13.10 Disable self-deletion and self-demotion

## 14. Ticket List Component (Frontend)

- [x] 14.1 Create `TicketList.tsx` component
- [x] 14.2 Display paginated ticket table
- [x] 14.3 Show columns: reference ID, subject, user, status, date
- [x] 14.4 Implement status filter dropdown (all, open, in_progress, resolved, closed)
- [x] 14.5 Implement pagination controls
- [x] 14.6 Add "View" action button per row
- [x] 14.7 Color-code status badges
- [x] 14.8 Add loading skeleton state
- [x] 14.9 Add empty state message

## 15. Ticket Detail Component (Frontend)

- [x] 15.1 Create `TicketDetail.tsx` component
- [x] 15.2 Display ticket information (reference, name, email, category)
- [x] 15.3 Display ticket message
- [x] 15.4 Display linked user info if available
- [x] 15.5 Status dropdown for updates
- [x] 15.6 Admin notes textarea
- [x] 15.7 Save button with loading state
- [x] 15.8 Delete button with confirmation

## 16. Admin Dashboard Page (Frontend)

- [x] 16.1 Create `AdminDashboardPage.tsx` page component
- [x] 16.2 Integrate system stats component
- [x] 16.3 Add admin navigation component
- [x] 16.4 Add responsive layout

## 17. Admin Users Page (Frontend)

- [x] 17.1 Create `AdminUsersPage.tsx` page component
- [x] 17.2 Integrate user list component
- [x] 17.3 Handle navigation to user edit
- [x] 17.4 Add responsive layout

## 18. Admin User Edit Page (Frontend)

- [x] 18.1 Create `AdminUserEditPage.tsx` page component
- [x] 18.2 Load user data by ID from URL params
- [x] 18.3 Integrate user edit component
- [x] 18.4 Handle navigation back to user list
- [x] 18.5 Handle delete with redirect

## 19. Admin Tickets Page (Frontend)

- [x] 19.1 Create `AdminTicketsPage.tsx` page component
- [x] 19.2 Integrate ticket list component
- [x] 19.3 Handle navigation to ticket detail
- [x] 19.4 Add responsive layout

## 20. Admin Ticket Detail Page (Frontend)

- [x] 20.1 Create `AdminTicketDetailPage.tsx` page component
- [x] 20.2 Load ticket data by reference ID from URL params
- [x] 20.3 Integrate ticket detail component
- [x] 20.4 Handle navigation back to ticket list
- [x] 20.5 Handle delete with redirect

## 21. Admin Navigation (Frontend)

- [x] 21.1 Create admin navigation component (AdminNav.tsx)
- [x] 21.2 Add links to Dashboard, Users, Tickets
- [x] 21.3 Highlight active section
- [x] 21.4 Only show to admin users (in header)
- [x] 21.5 Add responsive mobile menu

## 22. Admin Route Protection (Frontend)

- [x] 22.1 Create admin route guard component (AdminRoute.tsx)
- [x] 22.2 Check if user is admin
- [x] 22.3 Redirect non-admins to calendar page
- [x] 22.4 Show loading state during check

## 23. Accessibility & Polish

- [x] 23.1 Add ARIA labels to interactive elements
- [x] 23.2 Ensure tables have proper headers
- [x] 23.5 Ensure color contrast meets WCAG 2.1 AA (using existing theme)

## 24. Integration & Review

- [x] 24.1 Run all unit tests and ensure they pass
- [x] 24.2 Run all integration tests and ensure they pass
- [x] 24.3 Run linters (ESLint, TypeScript) and fix issues
- [x] 24.8 Review code for SOLID principles compliance
