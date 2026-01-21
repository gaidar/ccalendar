import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import { AdminNav, UserEdit } from '@/components/features/admin';

export default function AdminUserEditPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Manage user details and permissions</p>
          </div>
        </div>
      </div>

      <AdminNav />
      <UserEdit userId={id} />
    </div>
  );
}
