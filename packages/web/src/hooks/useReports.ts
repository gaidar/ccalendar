import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  SummaryResponse,
  CountryStatisticsResponse,
  PresetPeriod,
  ExportFormat,
} from '@/types';

// In production, use relative path (same origin). In development, use localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1');

interface ReportsQueryParams {
  days?: PresetPeriod;
  start?: string;
  end?: string;
}

function buildQueryString(params: ReportsQueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.days !== undefined) {
    searchParams.set('days', params.days.toString());
  } else if (params.start && params.end) {
    searchParams.set('start', params.start);
    searchParams.set('end', params.end);
  }
  return searchParams.toString();
}

/**
 * Hook to fetch summary report data
 */
export function useSummary(params: ReportsQueryParams) {
  const queryString = buildQueryString(params);

  return useQuery({
    queryKey: ['reports', 'summary', params],
    queryFn: () => api.get<SummaryResponse>(`/reports/summary?${queryString}`),
    staleTime: 60 * 1000, // 1 minute
    enabled: params.days !== undefined || (!!params.start && !!params.end),
  });
}

/**
 * Hook to fetch country statistics data
 */
export function useCountryStatistics(params: ReportsQueryParams) {
  const queryString = buildQueryString(params);

  return useQuery({
    queryKey: ['reports', 'statistics', params],
    queryFn: () =>
      api.get<CountryStatisticsResponse>(`/reports/statistics?${queryString}`),
    staleTime: 60 * 1000, // 1 minute
    enabled: params.days !== undefined || (!!params.start && !!params.end),
  });
}

interface ExportParams {
  format: ExportFormat;
  start: string;
  end: string;
}

interface ExportRateLimitError {
  message: string;
  retryAfterSeconds: number;
}

/**
 * Hook for exporting travel data
 */
export function useExport() {
  return useMutation({
    mutationFn: async (params: ExportParams) => {
      const token = localStorage.getItem('accessToken');
      const url = `${API_BASE_URL}/reports/export?format=${params.format}&start=${params.start}&end=${params.end}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract rate limit info from headers
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');
      const retryAfter = response.headers.get('Retry-After');

      if (response.status === 429) {
        const error: ExportRateLimitError = {
          message: 'Export rate limit exceeded',
          retryAfterSeconds: retryAfter ? parseInt(retryAfter, 10) : 3600,
        };
        throw error;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `travel-records.${params.format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return {
        success: true,
        filename,
        rateLimitRemaining: rateLimitRemaining ? parseInt(rateLimitRemaining, 10) : null,
        rateLimitReset: rateLimitReset ? parseInt(rateLimitReset, 10) : null,
      };
    },
  });
}

/**
 * Helper to check if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): error is ExportRateLimitError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'retryAfterSeconds' in error &&
    typeof (error as ExportRateLimitError).retryAfterSeconds === 'number'
  );
}

/**
 * Format seconds into human-readable time
 */
export function formatRetryTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  const minutes = Math.ceil(seconds / 60);
  if (minutes === 1) {
    return '1 minute';
  }
  return `${minutes} minutes`;
}
