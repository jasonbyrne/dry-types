/**
 * Shared constants and types for date utilities
 */

export const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
export const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})$/;
export const DATE_TIME_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  locale?: Intl.LocalesArgument;
}

export type MonthFormatOptions = {
  format?: "long" | "short" | "narrow" | "number" | "number-zero-based";
  locale?: Intl.LocalesArgument;
};

export type DayOfWeekFormatOptions = MonthFormatOptions;

export interface RelativeTimeOptions {
  /**
   * Reference date to compare against (defaults to current date/time)
   */
  referenceDate?: unknown;
  /**
   * Threshold in seconds for "just now" (default: 10)
   */
  threshold?: number;
  /**
   * Whether to round to the nearest unit (default: true)
   * If false, uses floor (e.g., "1 hour ago" instead of "2 hours ago" for 1.5 hours)
   */
  round?: boolean;
  /**
   * Format variant (default: 'standard')
   * - 'standard': Full format (e.g., "5 days ago", "2 hours ago")
   * - 'short': Abbreviated format with direction (e.g., "5D ago", "13H ago", "2M ago", "15m ago", "10s ago")
   * - 'abbreviation': Abbreviated format without direction (e.g., "5D", "13H", "2M", "15m", "10s")
   */
  variant?: "standard" | "short" | "abbreviation";
  /**
   * Map of unit keys to their labels
   * Can provide singular/plural array or single string (auto-pluralized)
   * For abbreviation variants, single string is used directly
   */
  unitLabels?: Partial<
    Record<
      "second" | "minute" | "hour" | "day" | "week" | "month" | "year",
      [singular: string, plural: string] | string
    >
  >;
}

/**
 * Internal helper: Validates if a date string represents a valid date
 */
export function isValidDateString(dateStr: string): boolean {
  const match = dateStr.match(DATE_REGEX);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  // Check month range
  if (month < 1 || month > 12) return false;

  // Create a date object and check if it's valid
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Internal helper: Validates if a time string represents a valid time
 */
export function isValidTimeString(timeStr: string): boolean {
  const match = timeStr.match(TIME_REGEX);
  if (!match) return false;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);

  // Validate ranges
  return (
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59 &&
    seconds >= 0 &&
    seconds <= 59
  );
}
