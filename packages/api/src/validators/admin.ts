import { z } from 'zod';

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// User list query schema
export const userListQuerySchema = paginationSchema.extend({
  search: z.string().max(100).trim().optional(),
});

// User update schema
export const userUpdateSchema = z.object({
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
  isAdmin: z.boolean().optional(),
  isConfirmed: z.boolean().optional(),
});

// Ticket status enum
export const ticketStatusSchema = z.enum(['open', 'in_progress', 'closed']);

// Ticket list query schema
export const ticketListQuerySchema = paginationSchema.extend({
  status: ticketStatusSchema.optional(),
});

// Ticket update schema
export const ticketUpdateSchema = z.object({
  status: ticketStatusSchema.optional(),
  notes: z.string().max(5000, 'Notes must be at most 5000 characters').trim().optional(),
});

// UUID param schema
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

// Reference ID param schema
export const referenceIdParamSchema = z.object({
  referenceId: z
    .string()
    .regex(/^TKT-[A-Z0-9]{8}$/, 'Invalid ticket reference ID format'),
});

// Export types
export type PaginationInput = z.infer<typeof paginationSchema>;
export type UserListQueryInput = z.infer<typeof userListQuerySchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type TicketListQueryInput = z.infer<typeof ticketListQuerySchema>;
export type TicketUpdateInput = z.infer<typeof ticketUpdateSchema>;
