import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, Check, AlertCircle } from 'lucide-react';

const MAX_COUNTRIES_PER_DAY = 3;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Flag } from '@/components/ui/Flag';
import { useCountries, useCountrySearch, type Country } from '@/hooks/useCountries';
import { useRecentCountries } from '@/hooks/useRecentCountries';
import { cn } from '@/lib/utils';
import { formatDisplayDate } from './utils';

interface CountryPickerProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate: Date | null;
  selectedCountryCodes: string[];
  onSave: (countryCodes: string[]) => void;
  isLoading?: boolean;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function CountryPicker({
  isOpen,
  onClose,
  targetDate,
  selectedCountryCodes,
  onSave,
  isLoading = false,
}: CountryPickerProps) {
  const { data: countriesData } = useCountries();
  const countries = countriesData?.countries || [];
  const { searchTerm, setSearchTerm, filteredCountries } = useCountrySearch(countries);
  const { recentCountries, addRecentCountries } = useRecentCountries();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Reset selected countries when opening
  useEffect(() => {
    if (isOpen) {
      setSelected(new Set(selectedCountryCodes.map(c => c.toUpperCase())));
      setSearchTerm('');
    }
  }, [isOpen, selectedCountryCodes, setSearchTerm]);

  const recentCountryObjects = useMemo(() => {
    return recentCountries
      .map(code => countries.find(c => c.code.toUpperCase() === code))
      .filter((c): c is Country => c !== undefined);
  }, [recentCountries, countries]);

  // Sort filtered countries with selected ones at the top
  const sortedFilteredCountries = useMemo(() => {
    return [...filteredCountries].sort((a, b) => {
      const aSelected = selected.has(a.code.toUpperCase());
      const bSelected = selected.has(b.code.toUpperCase());
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [filteredCountries, selected]);

  const toggleCountry = useCallback((code: string) => {
    const upperCode = code.toUpperCase();
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(upperCode)) {
        next.delete(upperCode);
      } else if (next.size < MAX_COUNTRIES_PER_DAY) {
        next.add(upperCode);
      }
      return next;
    });
  }, []);

  const isAtLimit = selected.size >= MAX_COUNTRIES_PER_DAY;

  const handleSave = () => {
    const codes = Array.from(selected);
    addRecentCountries(codes);
    onSave(codes);
  };

  const handleClear = () => {
    setSelected(new Set());
  };

  const title = targetDate ? formatDisplayDate(targetDate) : 'Select Countries';

  const content = (
    <div className="flex h-full flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search countries..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-9 pr-9"
          autoFocus={!isMobile}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Recent countries */}
      {recentCountryObjects.length > 0 && !searchTerm && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recentCountryObjects.map(country => {
              const isSelected = selected.has(country.code.toUpperCase());
              const isDisabled = isAtLimit && !isSelected;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => toggleCountry(country.code)}
                  disabled={isDisabled}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                    'border',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isDisabled
                        ? 'bg-muted border-transparent opacity-50 cursor-not-allowed'
                        : 'bg-muted hover:bg-accent border-transparent'
                  )}
                >
                  <Flag
                    countryCode={country.code}
                    size="xs"
                    fallbackColor={country.color}
                  />
                  {country.code}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Limit warning */}
      {isAtLimit && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>Maximum {MAX_COUNTRIES_PER_DAY} countries per day</span>
        </div>
      )}

      {/* Country list */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="space-y-0.5">
          {sortedFilteredCountries.map(country => {
            const isSelected = selected.has(country.code.toUpperCase());
            const isDisabled = isAtLimit && !isSelected;
            return (
              <label
                key={country.code}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors',
                  isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-accent',
                  isSelected && 'bg-accent'
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleCountry(country.code)}
                  disabled={isDisabled}
                />
                <Flag
                  countryCode={country.code}
                  size="sm"
                  fallbackColor={country.color}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: country.color }}
                />
                <span className="flex-1 truncate">{country.name}</span>
                <span className="text-xs text-muted-foreground">{country.code}</span>
                {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
              </label>
            );
          })}
          {sortedFilteredCountries.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No countries found
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          {selected.size} selected
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClear} disabled={selected.size === 0}>
            Clear
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col">
          <SheetHeader className="text-left">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>Select countries you visited on this day</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Select countries you visited on this day</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
