import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDateKey,
  isSameDay,
  isToday,
  isFuture,
  isInRange,
  getCalendarDays,
  getMonthName,
  getShortMonthName,
  formatDisplayDate,
  getWeekdayNames,
} from './utils';

describe('formatDateKey', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    expect(formatDateKey(date)).toBe('2024-01-15');
  });

  it('pads single digit months and days', () => {
    const date = new Date(2024, 0, 5); // January 5, 2024
    expect(formatDateKey(date)).toBe('2024-01-05');
  });

  it('handles December correctly', () => {
    const date = new Date(2024, 11, 25); // December 25, 2024
    expect(formatDateKey(date)).toBe('2024-12-25');
  });
});

describe('isSameDay', () => {
  it('returns true for same day', () => {
    const a = new Date(2024, 0, 15, 10, 30);
    const b = new Date(2024, 0, 15, 18, 45);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('returns false for different days', () => {
    const a = new Date(2024, 0, 15);
    const b = new Date(2024, 0, 16);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('returns false for same day different month', () => {
    const a = new Date(2024, 0, 15);
    const b = new Date(2024, 1, 15);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('returns false for same day different year', () => {
    const a = new Date(2024, 0, 15);
    const b = new Date(2025, 0, 15);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 5, 15, 12, 0, 0)); // June 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for today', () => {
    const today = new Date(2024, 5, 15);
    expect(isToday(today)).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date(2024, 5, 14);
    expect(isToday(yesterday)).toBe(false);
  });

  it('returns false for tomorrow', () => {
    const tomorrow = new Date(2024, 5, 16);
    expect(isToday(tomorrow)).toBe(false);
  });
});

describe('isFuture', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 5, 15, 12, 0, 0)); // June 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false for today', () => {
    const today = new Date(2024, 5, 15);
    expect(isFuture(today)).toBe(false);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date(2024, 5, 14);
    expect(isFuture(yesterday)).toBe(false);
  });

  it('returns true for tomorrow', () => {
    const tomorrow = new Date(2024, 5, 16);
    expect(isFuture(tomorrow)).toBe(true);
  });

  it('returns true for next week', () => {
    const nextWeek = new Date(2024, 5, 22);
    expect(isFuture(nextWeek)).toBe(true);
  });
});

describe('isInRange', () => {
  it('returns true for date in range', () => {
    const date = new Date(2024, 0, 15);
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    expect(isInRange(date, start, end)).toBe(true);
  });

  it('returns true for date equal to start', () => {
    const date = new Date(2024, 0, 10);
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    expect(isInRange(date, start, end)).toBe(true);
  });

  it('returns true for date equal to end', () => {
    const date = new Date(2024, 0, 20);
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    expect(isInRange(date, start, end)).toBe(true);
  });

  it('returns false for date before range', () => {
    const date = new Date(2024, 0, 5);
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    expect(isInRange(date, start, end)).toBe(false);
  });

  it('returns false for date after range', () => {
    const date = new Date(2024, 0, 25);
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    expect(isInRange(date, start, end)).toBe(false);
  });
});

describe('getCalendarDays', () => {
  it('returns correct number of days for a full grid', () => {
    const days = getCalendarDays(2024, 0); // January 2024
    // Should be 5 weeks = 35 days (Jan 2024 starts on Monday)
    expect(days.length).toBeGreaterThanOrEqual(28);
    expect(days.length).toBeLessThanOrEqual(42);
    expect(days.length % 7).toBe(0);
  });

  it('starts from Sunday', () => {
    const days = getCalendarDays(2024, 0); // January 2024
    expect(days[0].getDay()).toBe(0); // Sunday
  });

  it('includes leading days from previous month', () => {
    const days = getCalendarDays(2024, 0); // January 2024
    // January 2024 starts on Monday, so Sunday Dec 31 should be first
    const firstDay = days[0];
    expect(firstDay.getMonth()).toBe(11); // December
  });

  it('includes trailing days from next month', () => {
    const days = getCalendarDays(2024, 0); // January 2024
    const lastDay = days[days.length - 1];
    // Last day should be a Saturday
    expect(lastDay.getDay()).toBe(6);
  });

  it('contains all days of the month', () => {
    const days = getCalendarDays(2024, 1); // February 2024 (leap year)
    const februaryDays = days.filter(d => d.getMonth() === 1);
    expect(februaryDays.length).toBe(29);
  });
});

describe('getMonthName', () => {
  it('returns full month name', () => {
    const date = new Date(2024, 0, 1);
    expect(getMonthName(date)).toBe('January');
  });

  it('returns correct month for December', () => {
    const date = new Date(2024, 11, 1);
    expect(getMonthName(date)).toBe('December');
  });
});

describe('getShortMonthName', () => {
  it('returns short month name', () => {
    const date = new Date(2024, 0, 1);
    expect(getShortMonthName(date)).toBe('Jan');
  });
});

describe('formatDisplayDate', () => {
  it('formats date for display', () => {
    const date = new Date(2024, 0, 15);
    const formatted = formatDisplayDate(date);
    expect(formatted).toContain('January');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });
});

describe('getWeekdayNames', () => {
  it('returns 7 days', () => {
    const days = getWeekdayNames();
    expect(days.length).toBe(7);
  });

  it('returns short names by default', () => {
    const days = getWeekdayNames();
    expect(days[0]).toBe('Sun');
    expect(days[1]).toBe('Mon');
  });

  it('returns single letter names when short is true', () => {
    const days = getWeekdayNames(true);
    expect(days[0]).toBe('S');
    expect(days[1]).toBe('M');
  });
});
