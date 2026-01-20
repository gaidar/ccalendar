# Tasks: User Profile

## 1. Profile Service (Backend)

- [ ] 1.1 Create `profileService.ts` service file
- [ ] 1.2 Implement `getProfile(userId)` method
- [ ] 1.3 Calculate user stats (totalCountries, totalDays)
- [ ] 1.4 Get connected OAuth providers list
- [ ] 1.5 Implement `updateProfile(userId, data)` method
- [ ] 1.6 Validate email uniqueness on update
- [ ] 1.7 Handle email change confirmation flow (if required)
- [ ] 1.8 Write unit tests for profile service

## 2. Password Change Service (Backend)

- [ ] 2.1 Implement `changePassword(userId, currentPassword, newPassword)` method
- [ ] 2.2 Validate current password for users with password
- [ ] 2.3 Skip current password validation for OAuth-only users
- [ ] 2.4 Hash new password with bcrypt
- [ ] 2.5 Write unit tests for password change

## 3. Account Deletion Service (Backend)

- [ ] 3.1 Implement `deleteAccount(userId, confirmation)` method
- [ ] 3.2 Validate confirmation equals "DELETE"
- [ ] 3.3 Delete all user travel records
- [ ] 3.4 Delete all user OAuth connections
- [ ] 3.5 Delete all user refresh tokens
- [ ] 3.6 Delete user account
- [ ] 3.7 Write unit tests for account deletion

## 4. OAuth Management Service (Backend)

- [ ] 4.1 Implement `getConnectedProviders(userId)` method
- [ ] 4.2 Implement `disconnectProvider(userId, provider)` method
- [ ] 4.3 Validate user has alternative auth method before disconnect
- [ ] 4.4 Return error if trying to disconnect only auth method
- [ ] 4.5 Write unit tests for OAuth management

## 5. Profile Controller (Backend)

- [ ] 5.1 Create `profileController.ts` controller file
- [ ] 5.2 Implement `GET /profile` handler
- [ ] 5.3 Implement `PATCH /profile` handler
- [ ] 5.4 Validate update request body with Zod
- [ ] 5.5 Implement `POST /profile/change-password` handler
- [ ] 5.6 Validate password change request body
- [ ] 5.7 Implement `DELETE /profile` handler
- [ ] 5.8 Validate delete request body
- [ ] 5.9 Implement `DELETE /profile/oauth/:provider` handler
- [ ] 5.10 Validate provider parameter
- [ ] 5.11 Write unit tests for profile controller

## 6. Profile Routes (Backend)

- [ ] 6.1 Create `profile.ts` router file
- [ ] 6.2 Register all profile routes with authentication middleware
- [ ] 6.3 Apply validation middleware for request bodies
- [ ] 6.4 Write integration tests for profile endpoints

## 7. Profile API Service (Frontend)

- [ ] 7.1 Create `profileService.ts` API service
- [ ] 7.2 Implement `getProfile()` API call
- [ ] 7.3 Implement `updateProfile(data)` API call
- [ ] 7.4 Implement `changePassword(data)` API call
- [ ] 7.5 Implement `deleteAccount(confirmation)` API call
- [ ] 7.6 Implement `disconnectOAuth(provider)` API call
- [ ] 7.7 Write unit tests for profile service

## 8. Profile Data Hook (Frontend)

- [ ] 8.1 Create `useProfile.ts` hook with TanStack Query
- [ ] 8.2 Implement `useProfile()` query
- [ ] 8.3 Implement `useUpdateProfile()` mutation
- [ ] 8.4 Implement `useChangePassword()` mutation
- [ ] 8.5 Implement `useDeleteAccount()` mutation
- [ ] 8.6 Implement `useDisconnectOAuth()` mutation
- [ ] 8.7 Handle cache invalidation after mutations
- [ ] 8.8 Write unit tests for profile hook

## 9. Profile Info Component (Frontend)

- [ ] 9.1 Create `ProfileInfo.tsx` component
- [ ] 9.2 Display user name, email, creation date
- [ ] 9.3 Display travel statistics (countries, days)
- [ ] 9.4 Implement edit mode for name and email
- [ ] 9.5 Add form validation for fields
- [ ] 9.6 Show loading state during save
- [ ] 9.7 Show success/error feedback
- [ ] 9.8 Write component tests for profile info

## 10. Change Password Component (Frontend)

- [ ] 10.1 Create `ChangePassword.tsx` component
- [ ] 10.2 Implement form with current/new/confirm password fields
- [ ] 10.3 Conditionally show current password (not for OAuth-only)
- [ ] 10.4 Add password strength indicator
- [ ] 10.5 Validate passwords match
- [ ] 10.6 Validate minimum password length (8 chars)
- [ ] 10.7 Show loading state during submit
- [ ] 10.8 Show success/error feedback
- [ ] 10.9 Clear form on successful change
- [ ] 10.10 Write component tests for change password

## 11. Connected Accounts Component (Frontend)

- [ ] 11.1 Create `ConnectedAccounts.tsx` component
- [ ] 11.2 Display list of connected OAuth providers
- [ ] 11.3 Show provider icon/logo for each
- [ ] 11.4 Show connect button for unconnected providers
- [ ] 11.5 Show disconnect button for connected providers
- [ ] 11.6 Disable disconnect if only auth method
- [ ] 11.7 Show tooltip explaining why disconnect is disabled
- [ ] 11.8 Handle disconnect confirmation
- [ ] 11.9 Show loading state during operations
- [ ] 11.10 Write component tests for connected accounts

## 12. Delete Account Component (Frontend)

- [ ] 12.1 Create `DeleteAccount.tsx` component
- [ ] 12.2 Show warning about permanent data deletion
- [ ] 12.3 Require typing "DELETE" to confirm
- [ ] 12.4 Disable delete button until confirmation matches
- [ ] 12.5 Show confirmation dialog before final deletion
- [ ] 12.6 Show loading state during deletion
- [ ] 12.7 Redirect to home page after deletion
- [ ] 12.8 Write component tests for delete account

## 13. Profile Page (Frontend)

- [ ] 13.1 Create `Profile.tsx` page component
- [ ] 13.2 Integrate profile info section
- [ ] 13.3 Integrate change password section
- [ ] 13.4 Integrate connected accounts section
- [ ] 13.5 Integrate delete account section (danger zone)
- [ ] 13.6 Add section headers and visual separation
- [ ] 13.7 Implement loading state for initial load
- [ ] 13.8 Implement error state with retry
- [ ] 13.9 Add responsive layout
- [ ] 13.10 Write integration tests for profile page

## 14. Accessibility & Polish

- [ ] 14.1 Add ARIA labels to all interactive elements
- [ ] 14.2 Ensure form labels are properly associated
- [ ] 14.3 Add keyboard navigation support
- [ ] 14.4 Announce status changes to screen readers
- [ ] 14.5 Ensure color contrast meets WCAG 2.1 AA
- [ ] 14.6 Add focus indicators for all interactive elements
- [ ] 14.7 Run accessibility audit and fix issues

## 15. Integration & Review

- [ ] 15.1 Run all unit tests and ensure they pass
- [ ] 15.2 Run all integration tests and ensure they pass
- [ ] 15.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 15.4 Test password change flow end-to-end
- [ ] 15.5 Test account deletion flow end-to-end
- [ ] 15.6 Test OAuth disconnect with fallback validation
- [ ] 15.7 Review code for SOLID principles compliance
- [ ] 15.8 Cross-browser testing (Chrome, Firefox, Safari)
