import type { ReactNode } from 'react';
import { Users, Calendar, Activity, Ticket, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSystemStats } from '@/hooks/useAdmin';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SystemStats() {
  const { data: stats, isLoading, isError, refetch } = useSystemStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Failed to load statistics</p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<Users className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Total Records"
        value={stats.totalRecords}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        description="Travel records"
      />
      <StatCard
        title="Active Users"
        value={stats.activeUsers30Days}
        icon={<Activity className="h-6 w-6 text-primary" />}
        description="Last 30 days"
      />
      <StatCard
        title="Open Tickets"
        value={stats.openTickets}
        icon={<Ticket className="h-6 w-6 text-primary" />}
        description="Support requests"
      />
    </div>
  );
}
