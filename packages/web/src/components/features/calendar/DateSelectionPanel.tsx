import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flag } from '@/components/ui/Flag';
import type { TravelRecord } from '@/types';
import type { Country } from '@/hooks/useCountries';
import { formatDisplayDate } from './utils';
import { cn } from '@/lib/utils';

const MAX_COUNTRIES_PER_DAY = 3;

interface DateSelectionPanelProps {
  date: Date;
  records: TravelRecord[];
  countries: Country[];
  onRemoveCountry: (recordId: string) => void;
  onAddCountries: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function DateSelectionPanel({
  date,
  records,
  countries,
  onRemoveCountry,
  onAddCountries,
  onClose,
  isLoading = false,
}: DateSelectionPanelProps) {
  const getCountryInfo = (countryCode: string): Country | undefined => {
    return countries.find(c => c.code.toUpperCase() === countryCode.toUpperCase());
  };

  const canAddMore = records.length < MAX_COUNTRIES_PER_DAY;

  return (
    <div
      role="region"
      aria-label={`Countries for ${formatDisplayDate(date)}`}
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm',
        'animate-in fade-in slide-in-from-top-1 duration-200'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {formatDisplayDate(date)}
          </span>

          {records.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {records.map(record => {
                const country = getCountryInfo(record.countryCode);
                return (
                  <div
                    key={record.id}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full pl-2 pr-1 py-0.5',
                      'bg-muted text-sm',
                      isLoading && 'opacity-50'
                    )}
                  >
                    <Flag
                      countryCode={record.countryCode}
                      size="xs"
                      fallbackColor={country?.color}
                    />
                    <span className="text-xs font-medium">
                      {country?.name || record.countryCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveCountry(record.id)}
                      disabled={isLoading}
                      className={cn(
                        'rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-background',
                        'transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      )}
                      aria-label={`Remove ${country?.name || record.countryCode}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No countries</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {canAddMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddCountries}
              disabled={isLoading}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
