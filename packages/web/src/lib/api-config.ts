/**
 * Shared API configuration
 * Single source of truth for API URL across all components and hooks
 */

// In production, use relative path (same origin). In development, use localhost.
export const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1');
