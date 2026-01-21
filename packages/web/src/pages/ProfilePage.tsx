import { Settings } from 'lucide-react';
import {
  ProfileInfo,
  ChangePassword,
  ConnectedAccounts,
  DeleteAccount,
} from '@/components/features/profile';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your profile, security, and account preferences
        </p>
      </div>

      {/* Two-column layout for larger screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column - Profile info and password */}
        <div className="space-y-6">
          <ProfileInfo profile={profile} isLoading={isLoading} />
          <ChangePassword profile={profile} />
        </div>

        {/* Right column - Connected accounts and danger zone */}
        <div className="space-y-6">
          <ConnectedAccounts profile={profile} isLoading={isLoading} />
          <DeleteAccount profile={profile} />
        </div>
      </div>
    </div>
  );
}
