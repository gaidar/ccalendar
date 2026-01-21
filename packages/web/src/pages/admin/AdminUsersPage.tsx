import { Users } from 'lucide-react';
import { AdminNav, UserList } from '@/components/features/admin';

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">View and manage user accounts</p>
          </div>
        </div>
      </div>

      <AdminNav />
      <UserList />
    </div>
  );
}
