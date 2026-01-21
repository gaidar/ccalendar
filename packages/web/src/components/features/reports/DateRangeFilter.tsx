import { useState, useCallback } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PresetPeriod } from '@/types';

interface DateRangeFilterProps {
  selectedDays: PresetPeriod | null;
  customRange: { start: string; end: string } | null;
  onPresetSelect: (days: PresetPeriod) => void;
  onCustomRangeSelect: (start: string, end: string) => void;
}

const PRESET_OPTIONS: { value: PresetPeriod; label: string }[] = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 365, label: '1 year' },
];

// Maximum 5 years in milliseconds
const MAX_RANGE_MS = 5 * 365 * 24 * 60 * 60 * 1000;

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateRangeFilter({
  selectedDays,
  customRange,
  onPresetSelect,
  onCustomRangeSelect,
}: DateRangeFilterProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState(
    customRange?.start || formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  );
  const [customEnd, setCustomEnd] = useState(
    customRange?.end || formatDateForInput(new Date())
  );
  const [customError, setCustomError] = useState<string | null>(null);

  const isCustomSelected = customRange !== null;

  const handlePresetClick = useCallback(
    (days: PresetPeriod) => {
      setIsCustomOpen(false);
      setCustomError(null);
      onPresetSelect(days);
    },
    [onPresetSelect]
  );

  const handleCustomToggle = useCallback(() => {
    setIsCustomOpen(!isCustomOpen);
    setCustomError(null);
  }, [isCustomOpen]);

  const validateAndApplyCustomRange = useCallback(() => {
    const start = new Date(customStart);
    const end = new Date(customEnd);

    // Validate start <= end
    if (start > end) {
      setCustomError('Start date must be before end date');
      return;
    }

    // Validate range doesn't exceed 5 years
    if (end.getTime() - start.getTime() > MAX_RANGE_MS) {
      setCustomError('Date range cannot exceed 5 years');
      return;
    }

    setCustomError(null);
    onCustomRangeSelect(customStart, customEnd);
    setIsCustomOpen(false);
  }, [customStart, customEnd, onCustomRangeSelect]);

  const today = formatDateForInput(new Date());

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESET_OPTIONS.map(option => (
          <Button
            key={option.value}
            variant={selectedDays === option.value && !isCustomSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePresetClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
        <Button
          variant={isCustomSelected ? 'default' : 'outline'}
          size="sm"
          onClick={handleCustomToggle}
          className="gap-1"
        >
          <Calendar className="h-4 w-4" />
          Custom
          <ChevronDown className={`h-4 w-4 transition-transform ${isCustomOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Custom date picker */}
      {isCustomOpen && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStart}
                  max={today}
                  onChange={e => setCustomStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customEnd}
                  max={today}
                  onChange={e => setCustomEnd(e.target.value)}
                />
              </div>
            </div>
            {customError && (
              <p className="text-sm text-destructive mt-2">{customError}</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={() => setIsCustomOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={validateAndApplyCustomRange}>
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show current selection */}
      {(selectedDays || customRange) && (
        <p className="text-sm text-muted-foreground">
          {isCustomSelected
            ? `Showing data from ${customRange?.start} to ${customRange?.end}`
            : `Showing last ${selectedDays} days`}
        </p>
      )}
    </div>
  );
}
