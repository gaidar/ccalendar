import { Shield } from 'lucide-react';
import { AdminNav, SystemStats } from '@/components/features/admin';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and statistics</p>
          </div>
        </div>
      </div>

      <AdminNav />
      <SystemStats />
    </div>
  );
}
