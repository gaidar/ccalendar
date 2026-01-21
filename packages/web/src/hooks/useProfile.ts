import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  Profile,
  ProfileResponse,
  ProfileUpdateResponse,
  UpdateProfileData,
  ChangePasswordData,
  OAuthProvider,
} from '@/types';

interface MessageResponse {
  message: string;
}

interface ProvidersResponse {
  providers: string[];
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<ProfileResponse>('/profile'),
    select: (data) => data.profile,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileData) =>
      api.patch<ProfileUpdateResponse>('/profile', data),
    onSuccess: (response) => {
      queryClient.setQueryData(['profile'], { profile: response.profile });
      // Update auth store with new user info
      if (user) {
        setUser({
          ...user,
          name: response.profile.name,
          email: response.profile.email,
        });
      }
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      api.post<MessageResponse>('/profile/change-password', data),
    onSuccess: () => {
      // Invalidate profile to refresh hasPassword status
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useDeleteAccount() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: (confirmation: string) =>
      api.delete<MessageResponse>('/profile', { confirmation }),
    onSuccess: async () => {
      await logout();
      window.location.href = '/';
    },
  });
}

export function useConnectedProviders() {
  return useQuery({
    queryKey: ['profile', 'oauth'],
    queryFn: () => api.get<ProvidersResponse>('/profile/oauth'),
    select: (data) => data.providers as OAuthProvider[],
    staleTime: 60 * 1000,
  });
}

export function useDisconnectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: OAuthProvider) =>
      api.delete<MessageResponse>(`/profile/oauth/${provider}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Helper to check if user can disconnect a provider
export function canDisconnectProvider(
  profile: Profile | undefined,
  provider: OAuthProvider
): boolean {
  if (!profile) return false;

  // If user has password, they can disconnect any provider
  if (profile.hasPassword) return true;

  // If user has multiple OAuth providers, they can disconnect any except the last one
  const otherProviders = profile.oauthProviders.filter((p) => p !== provider);
  return otherProviders.length > 0;
}
