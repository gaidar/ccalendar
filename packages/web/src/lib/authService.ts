import { api } from './api';
import type { User } from '@/stores/authStore';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  password: string;
}

export interface EmailConfirmationResponse {
  message: string;
  user: User;
}

export interface ResendConfirmationRequest {
  email: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: unknown[];
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', credentials);
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post<RegisterResponse>('/auth/register', data);
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/reset-password', { email });
  }

  async confirmPasswordReset(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/reset-password/confirm', {
      token,
      password,
    });
  }

  async confirmEmail(token: string): Promise<EmailConfirmationResponse> {
    return api.get<EmailConfirmationResponse>(`/auth/confirm/${token}`);
  }

  async resendConfirmation(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/resend-confirmation', { email });
  }

  async getMe(): Promise<User> {
    return api.get<User>('/auth/me');
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    return api.post<{ accessToken: string }>('/auth/refresh');
  }
}

export const authService = new AuthService();
