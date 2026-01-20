# Proposal: Admin Panel

## Summary

Add administrative functionality including user management, support ticket management, system statistics, and a dedicated admin UI. All admin features are restricted to users with `isAdmin = true`.

## Motivation

Administrators need tools to manage users, respond to support tickets, monitor system health, and perform administrative tasks. A dedicated admin panel provides a centralized interface for these operations.

## Scope

### In Scope

- Admin middleware for protecting admin routes
- User management (list, view, update, delete)
- Support ticket management (list, update status, add notes, delete)
- System statistics dashboard
- Admin UI pages for all management functions
- Audit logging for admin actions
- Pagination and search for lists

### Out of Scope

- Role-based access control (RBAC) beyond admin/non-admin
- Bulk operations on users
- User impersonation
- Advanced analytics/reporting
- Email management

## Design

### Admin API

The API will provide admin-only endpoints:

**User Management:**
- `GET /api/v1/admin/users` - List users with pagination and search
- `GET /api/v1/admin/users/:id` - Get user details with stats
- `PATCH /api/v1/admin/users/:id` - Update user (name, email, isAdmin, isConfirmed)
- `DELETE /api/v1/admin/users/:id` - Delete user (with protections)

**Support Ticket Management:**
- `GET /api/v1/admin/support` - List tickets with status filter
- `PATCH /api/v1/admin/support/:referenceId` - Update ticket status/notes
- `DELETE /api/v1/admin/support/:referenceId` - Delete ticket

**System Statistics:**
- `GET /api/v1/admin/stats` - Get system statistics

### Admin UI

The admin interface will include:

1. **Admin Dashboard**
   - System statistics cards
   - Quick links to management sections
   - Recent activity summary

2. **User Management**
   - Paginated user list with search
   - User details view with stats
   - Edit user form (name, email, admin status, confirmed status)
   - Delete user with confirmation

3. **Ticket Management**
   - Paginated ticket list with status filter
   - Ticket detail view
   - Status update (open → in_progress → closed)
   - Admin notes (private, not visible to users)
   - Delete ticket

## Technical Considerations

- Admin middleware validates `isAdmin = true` before processing
- Admins cannot delete themselves
- Admins cannot demote themselves (last admin protection)
- All admin actions are logged for audit
- Pagination uses offset-based approach (page, limit)
- Search is case-insensitive on name and email
- Admin notes are never exposed to ticket creators
