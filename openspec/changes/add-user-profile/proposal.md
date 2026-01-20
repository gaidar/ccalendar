# Proposal: User Profile

## Summary

Add user profile management features including viewing and updating profile information, changing password, deleting account, and managing OAuth provider connections.

## Motivation

Users need to be able to manage their account settings, update their personal information, change their password, and control their OAuth connections. This is essential functionality for any user-facing application.

## Scope

### In Scope

- View profile (name, email, stats, OAuth providers)
- Update profile (name, email)
- Change password (with/without current password for OAuth-only users)
- Delete account with confirmation
- View connected OAuth providers
- Disconnect OAuth provider (with fallback validation)
- Connect additional OAuth provider
- Profile UI page with all management sections

### Out of Scope

- Profile picture upload
- Two-factor authentication
- Account activity log
- Session management (view/revoke sessions)

## Design

### Profile API

The API will provide endpoints for profile management:

- `GET /api/v1/profile` - Get current user profile with stats
- `PATCH /api/v1/profile` - Update profile fields (name, email)
- `POST /api/v1/profile/change-password` - Change password
- `DELETE /api/v1/profile` - Delete account with confirmation
- `DELETE /api/v1/profile/oauth/:provider` - Disconnect OAuth provider
- `POST /api/v1/profile/oauth/:provider` - Connect additional OAuth provider (redirects to OAuth flow)

### Profile UI

The profile page will include:

1. **Profile Information Section**
   - Display name, email, account creation date
   - Edit name and email with inline editing or modal
   - Show travel statistics

2. **Security Section**
   - Change password form
   - OAuth-only users don't need current password
   - Password strength indicator

3. **Connected Accounts Section**
   - List of connected OAuth providers
   - Connect/disconnect buttons
   - Validation to prevent disconnecting last authentication method

4. **Danger Zone Section**
   - Delete account with "DELETE" confirmation
   - Clear warning about data loss

## Technical Considerations

- Email change should require re-confirmation
- Password change should invalidate other sessions (optional)
- Disconnecting OAuth provider must validate fallback auth exists
- Account deletion should be soft-delete with grace period (future enhancement)
- All actions require authentication
