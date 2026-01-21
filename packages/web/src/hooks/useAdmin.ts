import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  AdminUsersResponse,
  AdminUserResponse,
  AdminTicketsResponse,
  AdminTicketResponse,
  SystemStatsResponse,
  UpdateUserData,
  UpdateTicketData,
  TicketStatus,
} from '@/types';

interface MessageResponse {
  message: string;
}

// User management hooks

export function useAdminUsers(page: number = 1, limit: number = 20, search?: string) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    queryParams.set('search', search);
  }

  return useQuery({
    queryKey: ['admin', 'users', page, limit, search],
    queryFn: () => api.get<AdminUsersResponse>(`/admin/users?${queryParams.toString()}`),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => api.get<AdminUserResponse>(`/admin/users/${id}`),
    select: (data) => data.user,
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      api.patch<AdminUserResponse>(`/admin/users/${id}`, data),
    onSuccess: (response, { id }) => {
      queryClient.setQueryData(['admin', 'users', id], response);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<MessageResponse>(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// Ticket management hooks

export function useAdminTickets(
  page: number = 1,
  limit: number = 20,
  status?: TicketStatus
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) {
    queryParams.set('status', status);
  }

  return useQuery({
    queryKey: ['admin', 'tickets', page, limit, status],
    queryFn: () =>
      api.get<AdminTicketsResponse>(`/admin/support?${queryParams.toString()}`),
    staleTime: 30 * 1000,
  });
}

export function useAdminTicket(referenceId: string) {
  return useQuery({
    queryKey: ['admin', 'tickets', referenceId],
    queryFn: () => api.get<AdminTicketResponse>(`/admin/support/${referenceId}`),
    select: (data) => data.ticket,
    enabled: !!referenceId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      referenceId,
      data,
    }: {
      referenceId: string;
      data: UpdateTicketData;
    }) => api.patch<AdminTicketResponse>(`/admin/support/${referenceId}`, data),
    onSuccess: (response, { referenceId }) => {
      queryClient.setQueryData(['admin', 'tickets', referenceId], response);
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referenceId: string) =>
      api.delete<MessageResponse>(`/admin/support/${referenceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
    },
  });
}

// System stats hook

export function useSystemStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<SystemStatsResponse>('/admin/stats'),
    select: (data) => data.stats,
    staleTime: 60 * 1000, // 1 minute
  });
}
