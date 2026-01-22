import { useState } from 'react';
import { X, HelpCircle, MousePointer2, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const STORAGE_KEY = 'calendar-help-dismissed';

function getInitialDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

interface CalendarHelpProps {
  /** Initial dismissed state (for testing). When undefined, reads from localStorage. */
  initialDismissed?: boolean;
}

export function CalendarHelp({ initialDismissed }: CalendarHelpProps = {}) {
  const [isDismissed, setIsDismissed] = useState(
    initialDismissed ?? getInitialDismissed
  );

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleShow = () => {
    setIsDismissed(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (isDismissed) {
    return (
      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShow}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label="How it works"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">How it works</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      role="note"
      aria-label="Calendar usage instructions"
      className={cn(
        'mt-6 rounded-xl border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4',
        'animate-in fade-in slide-in-from-bottom-2 duration-300'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-foreground">How to use the calendar</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Double-click instruction */}
            <div className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <MousePointerClick className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Double-click a day</p>
                <p className="text-xs text-muted-foreground">
                  Opens the country picker for that single date
                </p>
              </div>
            </div>

            {/* Range selection instruction */}
            <div className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <div className="flex items-center gap-0.5">
                  <MousePointer2 className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-bold text-primary">→</span>
                  <MousePointer2 className="h-3 w-3 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Click two different days</p>
                <p className="text-xs text-muted-foreground">
                  Selects a date range to add countries to multiple days at once
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd> to cancel range selection
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss help"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
