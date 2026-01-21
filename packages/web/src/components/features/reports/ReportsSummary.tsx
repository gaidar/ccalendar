import type { ReactNode } from 'react';
import { Calendar, Globe, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { SummaryResponse } from '@/types';

interface ReportsSummaryProps {
  data: SummaryResponse | undefined;
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon, label, value, iconBg, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-3 ${iconBg}`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsSummary({ data, isLoading }: ReportsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const totalDays = data?.totalDays ?? 0;
  const totalCountries = data?.totalCountries ?? 0;
  const topCountry = data?.topCountries?.[0];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={<Calendar className="h-6 w-6" />}
        label="Total Days Traveled"
        value={totalDays}
        iconBg="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        icon={<Globe className="h-6 w-6" />}
        label="Countries Visited"
        value={totalCountries}
        iconBg="bg-green-100 dark:bg-green-900/30"
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6" />}
        label="Top Destination"
        value={topCountry?.name ?? '—'}
        iconBg="bg-purple-100 dark:bg-purple-900/30"
        iconColor="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}
