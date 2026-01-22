import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CountryStatistic } from '@/types';

interface CountryStatsProps {
  countries: CountryStatistic[] | undefined;
  isLoading: boolean;
}

const DEFAULT_VISIBLE_COUNT = 10;

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-1">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-2 w-full bg-muted rounded animate-pulse" />
      </div>
      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
    </div>
  );
}

interface CountryRowProps {
  country: CountryStatistic;
}

const CountryRow = memo(function CountryRow({ country }: CountryRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
        style={{ backgroundColor: country.color }}
        title={country.code}
      >
        {country.code}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{country.name}</p>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${country.percentage}%`,
              backgroundColor: country.color,
            }}
          />
        </div>
      </div>
      <div className="text-right whitespace-nowrap">
        <span className="font-semibold">{country.days}</span>
        <span className="text-muted-foreground text-sm ml-1">
          {country.days === 1 ? 'day' : 'days'}
        </span>
      </div>
    </div>
  );
});

export function CountryStats({ countries, isLoading }: CountryStatsProps) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Country Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Country Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No travel data for this period</p>
            <p className="text-sm mt-1">
              Start adding travel records to see your statistics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visibleCountries = showAll
    ? countries
    : countries.slice(0, DEFAULT_VISIBLE_COUNT);
  const hasMore = countries.length > DEFAULT_VISIBLE_COUNT;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Country Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {visibleCountries.map(country => (
            <CountryRow key={country.code} country={country} />
          ))}
        </div>
        {hasMore && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="gap-1"
            >
              {showAll ? (
                <>
                  Show less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show all ({countries.length} countries){' '}
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
