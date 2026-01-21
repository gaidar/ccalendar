import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMonthName } from './utils';

interface MonthNavigationProps {
  viewMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function MonthNavigation({
  viewMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: MonthNavigationProps) {
  const monthYear = `${getMonthName(viewMonth)} ${viewMonth.getFullYear()}`;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          aria-label="Next month"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-lg font-semibold sm:text-xl">{monthYear}</h2>

      <Button
        variant="outline"
        size="sm"
        onClick={onToday}
        className="gap-1.5"
      >
        <CalendarDays className="h-4 w-4" />
        <span className="hidden sm:inline">Today</span>
      </Button>
    </div>
  );
}
