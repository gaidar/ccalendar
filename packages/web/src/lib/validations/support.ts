import { z } from 'zod';

export const SUPPORT_CATEGORIES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'account', label: 'Account Issue' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Other' },
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number]['value'];

export const supportTicketSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(120, 'Email must not exceed 120 characters'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  category: z.enum(['general', 'account', 'bug', 'feature', 'billing', 'other'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
