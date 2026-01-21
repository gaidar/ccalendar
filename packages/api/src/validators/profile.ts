import { z } from 'zod';

// Password requirements: at least 8 characters, max 128, uppercase, lowercase, and number
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(120, 'Email must be at most 120 characters')
    .toLowerCase()
    .trim()
    .optional(),
}).refine(
  (data) => data.name !== undefined || data.email !== undefined,
  { message: 'At least one field (name or email) must be provided' }
);

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
);

export const deleteAccountSchema = z.object({
  confirmation: z.string().refine(
    (val) => val === 'DELETE',
    { message: 'Please type "DELETE" to confirm account deletion' }
  ),
});

export const oauthProviderSchema = z.enum(['google', 'facebook', 'apple']);

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type OAuthProviderInput = z.infer<typeof oauthProviderSchema>;
