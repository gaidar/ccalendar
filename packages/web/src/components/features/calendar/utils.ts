/**
 * Format a date as YYYY-MM-DD (using local timezone)
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate > today;
}

/**
 * Check if a date is within a range (inclusive)
 */
export function isInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  return d >= s && d <= e;
}

/**
 * Get days for a calendar month grid (includes leading/trailing days)
 */
export function getCalendarDays(year: number, month: number): Date[] {
  const days: Date[] = [];

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Start from the Sunday before the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  // End on the Saturday after the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  // Generate all days
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Get month name
 */
export function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'long' });
}

/**
 * Get short month name
 */
export function getShortMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' });
}

/**
 * Format date for display (e.g., "January 15, 2024")
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('default', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get weekday names
 */
export function getWeekdayNames(short = false): string[] {
  const baseDate = new Date(2024, 0, 7); // A Sunday
  const days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(baseDate);
    day.setDate(baseDate.getDate() + i);
    days.push(
      day.toLocaleDateString('default', {
        weekday: short ? 'narrow' : 'short',
      })
    );
  }

  return days;
}
