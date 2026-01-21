import { prisma } from '../utils/prisma.js';
import { countriesService } from './countriesService.js';
import type { PresetPeriod } from '../validators/reportsValidator.js';

export interface TopCountry {
  code: string;
  name: string;
  color: string;
  days: number;
}

export interface SummaryPeriod {
  start: string;
  end: string;
}

export interface SummaryResponse {
  totalDays: number;
  totalCountries: number;
  topCountries: TopCountry[];
  period: SummaryPeriod;
}

export interface CountryStatistic {
  code: string;
  name: string;
  color: string;
  days: number;
  percentage: number;
}

export interface CountryStatisticsResponse {
  countries: CountryStatistic[];
  totalDays: number;
  period: SummaryPeriod;
}

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string as a local date (not UTC)
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calculates the start date based on preset period (days ago from today)
 */
function getStartDateFromPeriod(days: PresetPeriod): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - days + 1); // +1 to include today in the count
  return start;
}

/**
 * Calculates the end date (today)
 */
function getEndDate(): Date {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

class ReportsService {
  /**
   * Get summary statistics for a user's travel records
   */
  async getSummary(
    userId: string,
    daysOrStart: PresetPeriod | string,
    end?: string
  ): Promise<SummaryResponse> {
    let startDate: Date;
    let endDate: Date;

    if (typeof daysOrStart === 'number') {
      // Preset period
      startDate = getStartDateFromPeriod(daysOrStart);
      endDate = getEndDate();
    } else {
      // Custom date range - parse as local dates
      startDate = parseLocalDate(daysOrStart);
      startDate.setHours(0, 0, 0, 0);
      endDate = parseLocalDate(end!);
      endDate.setHours(23, 59, 59, 999);
    }

    // Get all records in the date range
    const records = await prisma.travelRecord.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        countryCode: true,
      },
    });

    // Calculate unique days
    const uniqueDates = new Set(records.map(r => formatDate(r.date)));
    const totalDays = uniqueDates.size;

    // Calculate unique countries
    const uniqueCountries = new Set(records.map(r => r.countryCode));
    const totalCountries = uniqueCountries.size;

    // Calculate days per country
    const countryDays = new Map<string, number>();
    for (const record of records) {
      const current = countryDays.get(record.countryCode) || 0;
      countryDays.set(record.countryCode, current + 1);
    }

    // Sort by days descending and build top countries list
    const topCountries: TopCountry[] = Array.from(countryDays.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([code, days]) => {
        const country = countriesService.getCountryByCode(code);
        return {
          code,
          name: country?.name ?? 'Unknown',
          color: country?.color ?? '#888888',
          days,
        };
      });

    return {
      totalDays,
      totalCountries,
      topCountries,
      period: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
    };
  }

  /**
   * Get detailed country statistics for a user's travel records
   */
  async getCountryStatistics(
    userId: string,
    daysOrStart: PresetPeriod | string,
    end?: string
  ): Promise<CountryStatisticsResponse> {
    const summary = await this.getSummary(userId, daysOrStart, end);

    // Calculate percentage for each country (relative to the country with most days)
    const maxDays = summary.topCountries.length > 0 ? summary.topCountries[0].days : 0;

    const countries: CountryStatistic[] = summary.topCountries.map(country => ({
      ...country,
      percentage: maxDays > 0 ? Math.round((country.days / maxDays) * 100) : 0,
    }));

    return {
      countries,
      totalDays: summary.totalDays,
      period: summary.period,
    };
  }

  /**
   * Get all travel records for export
   */
  async getRecordsForExport(
    userId: string,
    start: string,
    end: string
  ): Promise<Array<{ date: string; countryCode: string; countryName: string }>> {
    const startDate = parseLocalDate(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = parseLocalDate(end);
    endDate.setHours(23, 59, 59, 999);

    const records = await prisma.travelRecord.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ date: 'asc' }, { countryCode: 'asc' }],
      select: {
        date: true,
        countryCode: true,
      },
    });

    return records.map(record => {
      const country = countriesService.getCountryByCode(record.countryCode);
      return {
        date: formatDate(record.date),
        countryCode: record.countryCode,
        countryName: country?.name ?? 'Unknown',
      };
    });
  }
}

export const reportsService = new ReportsService();
