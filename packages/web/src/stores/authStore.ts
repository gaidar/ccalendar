import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isConfirmed: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),
      setLoading: isLoading => set({ isLoading }),
      login: (accessToken: string, user: User) => {
        localStorage.setItem('accessToken', accessToken);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Ignore errors - we're logging out anyway
        }
        localStorage.removeItem('accessToken');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      initialize: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isLoading: false, isInitialized: true });
          return;
        }

        try {
          const user = await authService.getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch {
          // Token is invalid or expired
          localStorage.removeItem('accessToken');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
