import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '@/lib/api';
import type { TravelRecord } from '@/types';

interface TravelRecordsResponse {
  records: TravelRecord[];
  total: number;
}

interface CreateRecordRequest {
  date: string;
  countryCode: string;
}

interface CreateRecordResponse {
  id: string;
  date: string;
  countryCode: string;
  countryName: string;
  createdAt: string;
}

interface DeleteRecordResponse {
  message: string;
}

interface BulkUpdateRequest {
  startDate: string;
  endDate: string;
  countryCodes: string[];
}

interface BulkUpdateResponse {
  message: string;
  created: number;
  deleted: number;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getMonthRange(date: Date): { start: string; end: string } {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get first day of month, but include previous week for leading days
  const firstDay = new Date(year, month, 1);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());

  // Get last day of month, but include next week for trailing days
  const lastDay = new Date(year, month + 1, 0);
  lastDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
}

export function useTravelRecords(viewMonth: Date) {
  const { start, end } = useMemo(() => getMonthRange(viewMonth), [viewMonth]);

  return useQuery({
    queryKey: ['travelRecords', start, end],
    queryFn: () =>
      api.get<TravelRecordsResponse>(`/travel-records?start=${start}&end=${end}`),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useTravelRecordsByDate(date: string) {
  const { data } = useTravelRecords(new Date(date));

  return useMemo(() => {
    if (!data?.records) return [];
    return data.records.filter(r => r.date === date);
  }, [data?.records, date]);
}

export function useRecordsByDateMap(viewMonth: Date) {
  const { data, isLoading, error } = useTravelRecords(viewMonth);

  const recordsByDate = useMemo(() => {
    const map = new Map<string, TravelRecord[]>();
    if (!data?.records) return map;

    for (const record of data.records) {
      const existing = map.get(record.date) || [];
      existing.push(record);
      map.set(record.date, existing);
    }

    return map;
  }, [data?.records]);

  return { recordsByDate, isLoading, error };
}

export function useCreateTravelRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecordRequest) =>
      api.post<CreateRecordResponse>('/travel-records', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelRecords'] });
    },
  });
}

export function useDeleteTravelRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<DeleteRecordResponse>(`/travel-records/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelRecords'] });
    },
  });
}

export function useBulkUpdateTravelRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateRequest) =>
      api.post<BulkUpdateResponse>('/travel-records/bulk', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelRecords'] });
    },
  });
}
