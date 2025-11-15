/**
 * Check if a value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Convert a value to a Date
 */
export function toDate(value: unknown, defaultValue?: Date): Date {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? (defaultValue ?? new Date()) : value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? (defaultValue ?? new Date()) : date;
  }
  return defaultValue ?? new Date();
}

/**
 * Format a date as a string
 */
export function formatDate(
  value: unknown,
  format: 'ISO' | 'locale' | 'date' | 'time' | 'datetime' = 'ISO'
): string {
  const date = toDate(value);

  switch (format) {
    case 'ISO':
      return date.toISOString();
    case 'locale':
      return date.toLocaleString();
    case 'date':
      return date.toLocaleDateString();
    case 'time':
      return date.toLocaleTimeString();
    case 'datetime':
      return date.toLocaleString();
    default:
      return date.toISOString();
  }
}

/**
 * Check if a date is after another date
 */
export function isAfter(date: Date | unknown, compareDate: Date | unknown): boolean {
  const d1 = toDate(date);
  const d2 = toDate(compareDate);
  return d1.getTime() > d2.getTime();
}

/**
 * Check if a date is before another date
 */
export function isBefore(date: Date | unknown, compareDate: Date | unknown): boolean {
  const d1 = toDate(date);
  const d2 = toDate(compareDate);
  return d1.getTime() < d2.getTime();
}

/**
 * Get the minimum date from an array of dates
 */
export function minDate(...dates: (Date | unknown)[]): Date {
  const validDates = dates.map(d => toDate(d));
  return new Date(Math.min(...validDates.map(d => d.getTime())));
}

/**
 * Get the maximum date from an array of dates
 */
export function maxDate(...dates: (Date | unknown)[]): Date {
  const validDates = dates.map(d => toDate(d));
  return new Date(Math.max(...validDates.map(d => d.getTime())));
}
