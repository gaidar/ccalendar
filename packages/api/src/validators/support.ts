import { z } from 'zod';

/**
 * Support ticket categories
 */
export const SUPPORT_CATEGORIES = [
  'general',
  'account',
  'bug',
  'feature',
  'billing',
  'other',
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

/**
 * Schema for creating a support ticket
 */
export const createTicketSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email format')
    .max(120, 'Email must be at most 120 characters')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be at most 200 characters')
    .trim(),
  category: z.enum(SUPPORT_CATEGORIES, {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(5000, 'Message must be at most 5000 characters')
    .trim(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
