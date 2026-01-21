import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  ReportsSummary,
  CountryStats,
  DateRangeFilter,
  ExportOptions,
} from '@/components/features/reports';
import { useSummary, useCountryStatistics } from '@/hooks/useReports';
import type { PresetPeriod } from '@/types';

const DEFAULT_PRESET: PresetPeriod = 30;

export default function ReportsPage() {
  const [selectedDays, setSelectedDays] = useState<PresetPeriod | null>(DEFAULT_PRESET);
  const [customRange, setCustomRange] = useState<{ start: string; end: string } | null>(null);

  // Build query params based on selection
  const queryParams =
    customRange !== null
      ? { start: customRange.start, end: customRange.end }
      : { days: selectedDays ?? DEFAULT_PRESET };

  const { data: summaryData, isLoading: summaryLoading } = useSummary(queryParams);
  const { data: statisticsData, isLoading: statisticsLoading } = useCountryStatistics(queryParams);

  const handlePresetSelect = (days: PresetPeriod) => {
    setSelectedDays(days);
    setCustomRange(null);
  };

  const handleCustomRangeSelect = (start: string, end: string) => {
    setCustomRange({ start, end });
    setSelectedDays(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Travel Reports</h1>
        </div>
        <p className="text-muted-foreground">
          View your travel statistics and export your data
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-8">
        <DateRangeFilter
          selectedDays={selectedDays}
          customRange={customRange}
          onPresetSelect={handlePresetSelect}
          onCustomRangeSelect={handleCustomRangeSelect}
        />
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <ReportsSummary data={summaryData} isLoading={summaryLoading} />
      </div>

      {/* Two-column layout for larger screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Country Statistics */}
        <CountryStats countries={statisticsData?.countries} isLoading={statisticsLoading} />

        {/* Export Options */}
        <ExportOptions selectedDays={selectedDays} customRange={customRange} />
      </div>
    </div>
  );
}
