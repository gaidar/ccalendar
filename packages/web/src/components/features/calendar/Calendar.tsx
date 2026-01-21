import { useCallback, useMemo, type KeyboardEvent } from 'react';
import { DayCell } from './DayCell';
import { MonthNavigation } from './MonthNavigation';
import { getCalendarDays, getWeekdayNames, formatDateKey, isSameDay, isInRange } from './utils';
import { useCalendarStore } from '@/stores/calendarStore';
import { useRecordsByDateMap } from '@/hooks/useTravelRecords';
import { useCountries } from '@/hooks/useCountries';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onDayClick: (date: Date) => void;
}

export function Calendar({ onDayClick }: CalendarProps) {
  const {
    viewMonth,
    selectedDate,
    isRangeMode,
    selectedRange,
    rangeStart,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    selectDate,
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

  const handleDayClick = useCallback(
    (date: Date) => {
      if (isRangeMode) {
        selectDate(date);
      } else {
        onDayClick(date);
      }
    },
    [isRangeMode, selectDate, onDayClick]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, date: Date) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDayClick(date);
      }
    },
    [handleDayClick]
  );

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  };

  const isRangeStart = (date: Date): boolean => {
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

  return (
    <div className="space-y-4">
      <MonthNavigation
        viewMonth={viewMonth}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      {/* Range mode indicator */}
      {isRangeMode && (
        <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          {rangeStart
            ? 'Select end date'
            : selectedRange
              ? `Selected: ${formatDateKey(selectedRange.start)} to ${formatDateKey(selectedRange.end)}`
              : 'Select start date'}
        </div>
      )}

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
                isRangeStart={isRangeStart(date)}
                isRangeEnd={isRangeEnd(date)}
                isInSelectedRange={isInSelectedRange(date)}
                onClick={handleDayClick}
                onKeyDown={handleKeyDown}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
