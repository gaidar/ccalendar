import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTravelRecords, useRecordsByDateMap } from './useTravelRecords';
import { api } from '@/lib/api';

// Mock the API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useTravelRecords', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches travel records for the month', async () => {
    const mockRecords = {
      records: [
        { id: '1', date: '2024-06-15', countryCode: 'US', userId: 'u1', createdAt: '', updatedAt: '' },
      ],
      total: 1,
    };
    mockApi.get.mockResolvedValue(mockRecords);

    const viewMonth = new Date(2024, 5, 15); // June 2024
    const { result } = renderHook(() => useTravelRecords(viewMonth), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockRecords);
    expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('/travel-records?'));
  });

  it('includes date range in query params', async () => {
    mockApi.get.mockResolvedValue({ records: [], total: 0 });

    const viewMonth = new Date(2024, 5, 15); // June 2024
    renderHook(() => useTravelRecords(viewMonth), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalled();
    });

    const callArg = mockApi.get.mock.calls[0][0];
    expect(callArg).toContain('start=');
    expect(callArg).toContain('end=');
  });
});

describe('useRecordsByDateMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('groups records by date', async () => {
    const mockRecords = {
      records: [
        { id: '1', date: '2024-06-15', countryCode: 'US', userId: 'u1', createdAt: '', updatedAt: '' },
        { id: '2', date: '2024-06-15', countryCode: 'CA', userId: 'u1', createdAt: '', updatedAt: '' },
        { id: '3', date: '2024-06-16', countryCode: 'MX', userId: 'u1', createdAt: '', updatedAt: '' },
      ],
      total: 3,
    };
    mockApi.get.mockResolvedValue(mockRecords);

    const viewMonth = new Date(2024, 5, 15);
    const { result } = renderHook(() => useRecordsByDateMap(viewMonth), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { recordsByDate } = result.current;
    expect(recordsByDate.get('2024-06-15')?.length).toBe(2);
    expect(recordsByDate.get('2024-06-16')?.length).toBe(1);
    expect(recordsByDate.get('2024-06-17')).toBeUndefined();
  });

  it('returns empty map when no records', async () => {
    mockApi.get.mockResolvedValue({ records: [], total: 0 });

    const viewMonth = new Date(2024, 5, 15);
    const { result } = renderHook(() => useRecordsByDateMap(viewMonth), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recordsByDate.size).toBe(0);
  });

  it('returns error state on API failure', async () => {
    mockApi.get.mockRejectedValue(new Error('API Error'));

    const viewMonth = new Date(2024, 5, 15);
    const { result } = renderHook(() => useRecordsByDateMap(viewMonth), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
  });
});
