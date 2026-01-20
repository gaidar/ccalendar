import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),
      setLoading: isLoading => set({ isLoading }),
      logout: () => {
        localStorage.removeItem('accessToken');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
