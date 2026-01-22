import { useCallback, useMemo, useEffect, type KeyboardEvent } from 'react';
import { DayCell } from './DayCell';
import { MonthNavigation } from './MonthNavigation';
import { getCalendarDays, getWeekdayNames, formatDateKey, isSameDay, isInRange } from './utils';
import { useCalendarStore } from '@/stores/calendarStore';
import { useRecordsByDateMap } from '@/hooks/useTravelRecords';
import { useCountries } from '@/hooks/useCountries';
import { cn } from '@/lib/utils';

export function Calendar() {
  const {
    viewMonth,
    selectedDate,
    selectedRange,
    rangeStart,
    hoveredDate,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    handleSingleClick,
    handleDoubleClick,
    setHoveredDate,
    clearRange,
  } = useCalendarStore();

  const { recordsByDate, isLoading } = useRecordsByDateMap(viewMonth);
  const { data: countriesData } = useCountries();
  const countries = countriesData?.countries || [];

  const days = useMemo(
    () => getCalendarDays(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth]
  );

  const weekdays = useMemo(() => getWeekdayNames(), []);
  const mobileWeekdays = useMemo(() => getWeekdayNames(true), []);

  // Handle escape key to cancel range selection
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && rangeStart) {
        clearRange();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [rangeStart, clearRange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, date: Date) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Keyboard acts like double-click (opens picker for single date)
        handleDoubleClick(date);
      }
    },
    [handleDoubleClick]
  );

  const handleMouseEnter = useCallback(
    (date: Date) => {
      if (rangeStart) {
        setHoveredDate(date);
      }
    },
    [rangeStart, setHoveredDate]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, [setHoveredDate]);

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  };

  const isRangeStartDate = (date: Date): boolean => {
    if (selectedRange) return isSameDay(date, selectedRange.start);
    if (rangeStart) return isSameDay(date, rangeStart);
    return false;
  };

  const isRangeEnd = (date: Date): boolean => {
    if (selectedRange) return isSameDay(date, selectedRange.end);
    return false;
  };

  const isInSelectedRange = (date: Date): boolean => {
    if (!selectedRange) return false;
    return isInRange(date, selectedRange.start, selectedRange.end);
  };

  // Preview range when hovering (before second click)
  const isInHoverRange = (date: Date): boolean => {
    if (!rangeStart || !hoveredDate) return false;
    if (isSameDay(rangeStart, hoveredDate)) return false;
    const start = rangeStart < hoveredDate ? rangeStart : hoveredDate;
    const end = rangeStart < hoveredDate ? hoveredDate : rangeStart;
    return isInRange(date, start, end);
  };

  return (
    <div className="space-y-4">
      <MonthNavigation
        viewMonth={viewMonth}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-lg border bg-muted/50">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b bg-muted">
          {weekdays.map((day, i) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-muted-foreground"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{mobileWeekdays[i]}</span>
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className={cn('grid grid-cols-7 gap-px bg-border', isLoading && 'opacity-50')}>
          {days.map(date => {
            const dateKey = formatDateKey(date);
            const records = recordsByDate.get(dateKey) || [];

            return (
              <DayCell
                key={dateKey}
                date={date}
                currentMonth={viewMonth.getMonth()}
                records={records}
                countries={countries}
                isSelected={isDateSelected(date)}
                isRangeStart={isRangeStartDate(date)}
                isRangeEnd={isRangeEnd(date)}
                isInSelectedRange={isInSelectedRange(date)}
                isInHoverRange={isInHoverRange(date)}
                isPendingRangeStart={!!rangeStart && isSameDay(date, rangeStart)}
                onClick={handleSingleClick}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
