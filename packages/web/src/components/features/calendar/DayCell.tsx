import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { isToday, isFuture, formatDateKey } from './utils';
import type { TravelRecord } from '@/types';
import type { Country } from '@/hooks/useCountries';

interface DayCellProps {
  date: Date;
  currentMonth: number;
  records: TravelRecord[];
  countries: Country[];
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInSelectedRange: boolean;
  onClick: (date: Date) => void;
  onKeyDown: (e: KeyboardEvent, date: Date) => void;
}

const MAX_VISIBLE_DOTS = 3;

export function DayCell({
  date,
  currentMonth,
  records,
  countries,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isInSelectedRange,
  onClick,
  onKeyDown,
}: DayCellProps) {
  const isCurrentMonth = date.getMonth() === currentMonth;
  const isTodayDate = isToday(date);
  const isFutureDate = isFuture(date);
  const hasRecords = records.length > 0;
  const overflow = records.length > MAX_VISIBLE_DOTS ? records.length - MAX_VISIBLE_DOTS : 0;

  const getCountryColor = (countryCode: string): string => {
    const country = countries.find(c => c.code.toUpperCase() === countryCode.toUpperCase());
    return country?.color || '#94a3b8';
  };

  const handleClick = () => {
    if (!isFutureDate) {
      onClick(date);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    onKeyDown(e, date);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isFutureDate}
      aria-label={`${formatDateKey(date)}${hasRecords ? `, ${records.length} countries` : ''}`}
      aria-current={isTodayDate ? 'date' : undefined}
      aria-selected={isSelected}
      className={cn(
        'relative flex min-h-[52px] flex-col items-start justify-start p-1.5 text-sm transition-colors',
        'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        // Base states
        isCurrentMonth ? 'bg-card text-card-foreground' : 'bg-muted/30 text-muted-foreground',
        // Future dates
        isFutureDate && 'cursor-not-allowed opacity-40',
        // Interactive states (only for non-future dates)
        !isFutureDate && 'cursor-pointer hover:bg-accent',
        // Today highlight
        isTodayDate && 'ring-2 ring-primary ring-offset-1',
        // Selected state
        isSelected && !isInSelectedRange && 'bg-primary text-primary-foreground hover:bg-primary/90',
        // Range selection states
        isRangeStart && 'rounded-l-lg bg-primary text-primary-foreground',
        isRangeEnd && 'rounded-r-lg bg-primary text-primary-foreground',
        isInSelectedRange && !isRangeStart && !isRangeEnd && 'bg-primary/20 rounded-none',
        // Touch target
        'sm:min-h-[60px] md:min-h-[72px]'
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          'font-medium tabular-nums',
          isTodayDate && !isSelected && 'text-primary font-bold'
        )}
      >
        {date.getDate()}
      </span>

      {/* Country indicators */}
      {hasRecords && (
        <div className="mt-auto flex flex-wrap items-center gap-0.5">
          {records.slice(0, MAX_VISIBLE_DOTS).map(record => (
            <span
              key={record.id}
              className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
              style={{ backgroundColor: getCountryColor(record.countryCode) }}
              title={record.countryCode}
            />
          ))}
          {overflow > 0 && (
            <span className="text-[10px] font-medium text-muted-foreground">
              +{overflow}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
