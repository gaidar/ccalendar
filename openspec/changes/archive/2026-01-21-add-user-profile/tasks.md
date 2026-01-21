# Tasks: User Profile

## 1. Profile Service (Backend)

- [x] 1.1 Create `profileService.ts` service file
- [x] 1.2 Implement `getProfile(userId)` method
- [x] 1.3 Calculate user stats (totalCountries, totalDays)
- [x] 1.4 Get connected OAuth providers list
- [x] 1.5 Implement `updateProfile(userId, data)` method
- [x] 1.6 Validate email uniqueness on update
- [x] 1.7 Handle email change confirmation flow (if required)
- [x] 1.8 Write unit tests for profile service

## 2. Password Change Service (Backend)

- [x] 2.1 Implement `changePassword(userId, currentPassword, newPassword)` method
- [x] 2.2 Validate current password for users with password
- [x] 2.3 Skip current password validation for OAuth-only users
- [x] 2.4 Hash new password with bcrypt
- [x] 2.5 Write unit tests for password change

## 3. Account Deletion Service (Backend)

- [x] 3.1 Implement `deleteAccount(userId, confirmation)` method
- [x] 3.2 Validate confirmation equals "DELETE"
- [x] 3.3 Delete all user travel records
- [x] 3.4 Delete all user OAuth connections
- [x] 3.5 Delete all user refresh tokens
- [x] 3.6 Delete user account
- [x] 3.7 Write unit tests for account deletion

## 4. OAuth Management Service (Backend)

- [x] 4.1 Implement `getConnectedProviders(userId)` method
- [x] 4.2 Implement `disconnectProvider(userId, provider)` method
- [x] 4.3 Validate user has alternative auth method before disconnect
- [x] 4.4 Return error if trying to disconnect only auth method
- [x] 4.5 Write unit tests for OAuth management

## 5. Profile Controller (Backend)

- [x] 5.1 Create `profileController.ts` controller file
- [x] 5.2 Implement `GET /profile` handler
- [x] 5.3 Implement `PATCH /profile` handler
- [x] 5.4 Validate update request body with Zod
- [x] 5.5 Implement `POST /profile/change-password` handler
- [x] 5.6 Validate password change request body
- [x] 5.7 Implement `DELETE /profile` handler
- [x] 5.8 Validate delete request body
- [x] 5.9 Implement `DELETE /profile/oauth/:provider` handler
- [x] 5.10 Validate provider parameter
- [x] 5.11 Write unit tests for profile controller

## 6. Profile Routes (Backend)

- [x] 6.1 Create `profile.ts` router file
- [x] 6.2 Register all profile routes with authentication middleware
- [x] 6.3 Apply validation middleware for request bodies
- [x] 6.4 Write integration tests for profile endpoints

## 7. Profile API Service (Frontend)

- [x] 7.1 Create `profileService.ts` API service
- [x] 7.2 Implement `getProfile()` API call
- [x] 7.3 Implement `updateProfile(data)` API call
- [x] 7.4 Implement `changePassword(data)` API call
- [x] 7.5 Implement `deleteAccount(confirmation)` API call
- [x] 7.6 Implement `disconnectOAuth(provider)` API call
- [x] 7.7 Write unit tests for profile service

## 8. Profile Data Hook (Frontend)

- [x] 8.1 Create `useProfile.ts` hook with TanStack Query
- [x] 8.2 Implement `useProfile()` query
- [x] 8.3 Implement `useUpdateProfile()` mutation
- [x] 8.4 Implement `useChangePassword()` mutation
- [x] 8.5 Implement `useDeleteAccount()` mutation
- [x] 8.6 Implement `useDisconnectOAuth()` mutation
- [x] 8.7 Handle cache invalidation after mutations
- [ ] 8.8 Write unit tests for profile hook

## 9. Profile Info Component (Frontend)

- [x] 9.1 Create `ProfileInfo.tsx` component
- [x] 9.2 Display user name, email, creation date
- [x] 9.3 Display travel statistics (countries, days)
- [x] 9.4 Implement edit mode for name and email
- [x] 9.5 Add form validation for fields
- [x] 9.6 Show loading state during save
- [x] 9.7 Show success/error feedback
- [ ] 9.8 Write component tests for profile info

## 10. Change Password Component (Frontend)

- [x] 10.1 Create `ChangePassword.tsx` component
- [x] 10.2 Implement form with current/new/confirm password fields
- [x] 10.3 Conditionally show current password (not for OAuth-only)
- [x] 10.4 Add password strength indicator
- [x] 10.5 Validate passwords match
- [x] 10.6 Validate minimum password length (8 chars)
- [x] 10.7 Show loading state during submit
- [x] 10.8 Show success/error feedback
- [x] 10.9 Clear form on successful change
- [ ] 10.10 Write component tests for change password

## 11. Connected Accounts Component (Frontend)

- [x] 11.1 Create `ConnectedAccounts.tsx` component
- [x] 11.2 Display list of connected OAuth providers
- [x] 11.3 Show provider icon/logo for each
- [x] 11.4 Show connect button for unconnected providers
- [x] 11.5 Show disconnect button for connected providers
- [x] 11.6 Disable disconnect if only auth method
- [x] 11.7 Show tooltip explaining why disconnect is disabled
- [x] 11.8 Handle disconnect confirmation
- [x] 11.9 Show loading state during operations
- [ ] 11.10 Write component tests for connected accounts

## 12. Delete Account Component (Frontend)

- [x] 12.1 Create `DeleteAccount.tsx` component
- [x] 12.2 Show warning about permanent data deletion
- [x] 12.3 Require typing "DELETE" to confirm
- [x] 12.4 Disable delete button until confirmation matches
- [x] 12.5 Show confirmation dialog before final deletion
- [x] 12.6 Show loading state during deletion
- [x] 12.7 Redirect to home page after deletion
- [ ] 12.8 Write component tests for delete account

## 13. Profile Page (Frontend)

- [x] 13.1 Create `Profile.tsx` page component
- [x] 13.2 Integrate profile info section
- [x] 13.3 Integrate change password section
- [x] 13.4 Integrate connected accounts section
- [x] 13.5 Integrate delete account section (danger zone)
- [x] 13.6 Add section headers and visual separation
- [x] 13.7 Implement loading state for initial load
- [x] 13.8 Implement error state with retry
- [x] 13.9 Add responsive layout
- [ ] 13.10 Write integration tests for profile page

## 14. Accessibility & Polish

- [x] 14.1 Add ARIA labels to all interactive elements
- [x] 14.2 Ensure form labels are properly associated
- [x] 14.3 Add keyboard navigation support
- [ ] 14.4 Announce status changes to screen readers
- [x] 14.5 Ensure color contrast meets WCAG 2.1 AA
- [x] 14.6 Add focus indicators for all interactive elements
- [ ] 14.7 Run accessibility audit and fix issues

## 15. Integration & Review

- [x] 15.1 Run all unit tests and ensure they pass
- [x] 15.2 Run all integration tests and ensure they pass
- [x] 15.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 15.4 Test password change flow end-to-end
- [ ] 15.5 Test account deletion flow end-to-end
- [ ] 15.6 Test OAuth disconnect with fallback validation
- [x] 15.7 Review code for SOLID principles compliance
- [ ] 15.8 Cross-browser testing (Chrome, Firefox, Safari)
