// API Response types
export interface ApiError {
  error: string;
  message: string;
  details: unknown[];
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Country types
export interface Country {
  code: string;
  name: string;
  color: string;
}

export interface CountriesResponse {
  countries: Country[];
  total: number;
}

// Travel record types
export interface TravelRecord {
  id: string;
  userId: string;
  countryCode: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Health check types
export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  version: string;
  database: 'connected' | 'disconnected';
}
