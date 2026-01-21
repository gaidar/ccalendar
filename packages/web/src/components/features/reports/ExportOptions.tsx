import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExport, isRateLimitError, formatRetryTime } from '@/hooks/useReports';
import type { ExportFormat, PresetPeriod } from '@/types';

interface ExportOptionsProps {
  selectedDays: PresetPeriod | null;
  customRange: { start: string; end: string } | null;
}

function formatDateForExport(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateRange(
  selectedDays: PresetPeriod | null,
  customRange: { start: string; end: string } | null
): { start: string; end: string } {
  if (customRange) {
    return customRange;
  }

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (selectedDays || 30));

  return {
    start: formatDateForExport(start),
    end: formatDateForExport(end),
  };
}

export function ExportOptions({ selectedDays, customRange }: ExportOptionsProps) {
  const exportMutation = useExport();
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const [rateLimitError, setRateLimitError] = useState<{
    message: string;
    retryAfterSeconds: number;
  } | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setRateLimitError(null);
    setExportingFormat(format);

    const { start, end } = getDateRange(selectedDays, customRange);

    try {
      await exportMutation.mutateAsync({ format, start, end });
    } catch (error) {
      if (isRateLimitError(error)) {
        setRateLimitError({
          message: error.message,
          retryAfterSeconds: error.retryAfterSeconds,
        });
      }
    } finally {
      setExportingFormat(null);
    }
  };

  const isExporting = exportMutation.isPending;
  const isCustomSelected = customRange !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Export your travel records for{' '}
          {isCustomSelected
            ? `${customRange?.start} to ${customRange?.end}`
            : `the last ${selectedDays || 30} days`}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="gap-2"
          >
            {exportingFormat === 'csv' ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('xlsx')}
            disabled={isExporting}
            className="gap-2"
          >
            {exportingFormat === 'xlsx' ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Export Excel
          </Button>
        </div>

        {rateLimitError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Export limit reached</p>
              <p className="text-sm mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Try again in {formatRetryTime(rateLimitError.retryAfterSeconds)}
              </p>
            </div>
          </div>
        )}

        {exportMutation.isSuccess && !rateLimitError && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Export completed successfully!
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          You can export up to 5 times per hour.
        </p>
      </CardContent>
    </Card>
  );
}
