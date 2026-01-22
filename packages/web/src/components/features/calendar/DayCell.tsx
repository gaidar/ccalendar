import { useRef, useCallback, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { isToday, isFuture, formatDateKey } from './utils';
import { Flag } from '@/components/ui/Flag';
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
  isInHoverRange?: boolean;
  isPendingRangeStart?: boolean;
  onClick: (date: Date) => void;
  onDoubleClick: (date: Date) => void;
  onKeyDown: (e: KeyboardEvent, date: Date) => void;
  onMouseEnter?: (date: Date) => void;
  onMouseLeave?: () => void;
}

const MAX_VISIBLE_FLAGS = 3;
const DOUBLE_CLICK_DELAY = 300;

export function DayCell({
  date,
  currentMonth,
  records,
  countries,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isInSelectedRange,
  isInHoverRange = false,
  isPendingRangeStart = false,
  onClick,
  onDoubleClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  const isCurrentMonth = date.getMonth() === currentMonth;
  const isTodayDate = isToday(date);
  const isFutureDate = isFuture(date);
  const hasRecords = records.length > 0;
  const overflow = records.length > MAX_VISIBLE_FLAGS ? records.length - MAX_VISIBLE_FLAGS : 0;
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  const getCountryColor = (countryCode: string): string => {
    const country = countries.find(c => c.code.toUpperCase() === countryCode.toUpperCase());
    return country?.color || '#94a3b8';
  };

  const handleClick = useCallback(() => {
    if (isFutureDate) return;

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      // First click - wait to see if it's a double-click
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          onClick(date);
        }
        clickCountRef.current = 0;
      }, DOUBLE_CLICK_DELAY);
    } else if (clickCountRef.current === 2) {
      // Second click (double-click)
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickCountRef.current = 0;
      onDoubleClick(date);
    }
  }, [date, isFutureDate, onClick, onDoubleClick]);

  const handleKeyDown = (e: KeyboardEvent) => {
    onKeyDown(e, date);
  };

  const handleMouseEnter = () => {
    if (!isFutureDate && onMouseEnter) {
      onMouseEnter(date);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={isFutureDate}
      aria-label={`${formatDateKey(date)}${hasRecords ? `, ${records.length} countries` : ''}`}
      aria-current={isTodayDate ? 'date' : undefined}
      aria-selected={isSelected || isRangeStart || isRangeEnd || isPendingRangeStart}
      className={cn(
        'relative flex min-h-[52px] flex-col items-start justify-start p-1.5 text-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
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
        // Pending range start (waiting for second click)
        isPendingRangeStart && 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 animate-pulse',
        // Range selection states
        isRangeStart && !isPendingRangeStart && 'rounded-l-lg bg-primary text-primary-foreground',
        isRangeEnd && 'rounded-r-lg bg-primary text-primary-foreground',
        isInSelectedRange && !isRangeStart && !isRangeEnd && 'bg-primary/20 rounded-none',
        // Hover preview for range
        isInHoverRange && !isInSelectedRange && 'bg-primary/10 rounded-none',
        // Touch target
        'sm:min-h-[60px] md:min-h-[72px]'
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          'font-medium tabular-nums',
          isTodayDate && !isSelected && !isPendingRangeStart && 'text-primary font-bold'
        )}
      >
        {date.getDate()}
      </span>

      {/* Country flags */}
      {hasRecords && (
        <div className="mt-auto flex flex-wrap items-center gap-0.5">
          {records.slice(0, MAX_VISIBLE_FLAGS).map(record => (
            <Flag
              key={record.id}
              countryCode={record.countryCode}
              size="sm"
              fallbackColor={getCountryColor(record.countryCode)}
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
