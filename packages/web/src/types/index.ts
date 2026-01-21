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

// Reports types
export interface TopCountry {
  code: string;
  name: string;
  color: string;
  days: number;
}

export interface SummaryPeriod {
  start: string;
  end: string;
}

export interface SummaryResponse {
  totalDays: number;
  totalCountries: number;
  topCountries: TopCountry[];
  period: SummaryPeriod;
}

export interface CountryStatistic {
  code: string;
  name: string;
  color: string;
  days: number;
  percentage: number;
}

export interface CountryStatisticsResponse {
  countries: CountryStatistic[];
  totalDays: number;
  period: SummaryPeriod;
}

export type PresetPeriod = 7 | 30 | 90 | 365;

export type ExportFormat = 'csv' | 'xlsx';

// Profile types
export interface ProfileStats {
  totalCountries: number;
  totalDays: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  stats: ProfileStats;
  oauthProviders: string[];
  hasPassword: boolean;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface ProfileUpdateResponse {
  profile: Profile;
  message: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export type OAuthProvider = 'google' | 'facebook' | 'apple';

// Admin types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isConfirmed: boolean;
  createdAt: string;
}

export interface AdminUserStats {
  totalRecords: number;
  totalCountries: number;
}

export interface AdminUserWithStats extends AdminUser {
  stats: AdminUserStats;
  lastLoginAt: string | null;
  recordCount: number;
  ticketCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface AdminUserResponse {
  user: AdminUserWithStats;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  isConfirmed?: boolean;
}

export interface AdminTicket {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  userName: string;
  userId: string | null;
}

export interface AdminTicketDetail extends AdminTicket {
  message: string;
  adminNotes: string | null;
  userEmail: string;
  updatedAt: string;
}

export interface AdminTicketsResponse {
  tickets: AdminTicket[];
  pagination: Pagination;
}

export interface AdminTicketResponse {
  ticket: AdminTicketDetail;
}

export interface UpdateTicketData {
  status?: TicketStatus;
  adminNotes?: string;
}

export interface SystemStats {
  totalUsers: number;
  totalRecords: number;
  activeUsers30Days: number;
  openTickets: number;
}

export interface SystemStatsResponse {
  stats: SystemStats;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
