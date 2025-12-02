/**
 * Date operation utilities
 *
 * Functions for date arithmetic, comparisons, and calculations
 */

import { toDate, parseDuration, Duration } from "./conversion";

/**
 * Adds days to a date and returns the result as a YYYY-MM-DD string
 * Automatically detects and converts unknown date types
 *
 * @param days - Number of days to add (can be negative to subtract)
 * @param date - Date value (string, Date, number, or unknown) to add days to, or current date if not provided
 * @returns Date string with days added (YYYY-MM-DD)
 *
 * @example
 * ```ts
 * addDays(10, "2025-01-15") // "2025-01-25"
 * addDays(30, new Date()) // 30 days from now
 * addDays(-5, "2025-01-15") // "2025-01-10"
 * addDays(10) // 10 days from today
 * ```
 */
export function addDays(days: number, date?: unknown): Date | null {
  return addToDate(days * 24 * 60 * 60 * 1000, date);
}

/**
 * Adds months to a date using calendar months
 * Automatically detects and converts unknown date types
 * Handles month boundaries correctly (e.g., adding 1 month to Feb 1 gives Mar 1)
 *
 * @param months - Number of months to add (can be negative to subtract)
 * @param date - Optional date value (string, Date, number, or unknown) to add months to. Defaults to current date/time if not provided
 * @returns Date object with months added, or null if date is invalid
 *
 * @example
 * ```ts
 * addMonths(2, new Date("2024-01-15")) // Date object for 2024-03-15
 * addMonths(-1, "2024-01-15") // Date object for 2023-12-15
 * addMonths(1, "2024-02-01") // Date object for 2024-03-01
 * addMonths(1) // 1 month from now
 * ```
 */
export function addMonths(months: number, date?: unknown): Date | null {
  const dateObj = date !== undefined ? toDate(date, null) : new Date();
  if (dateObj === null) return null;

  // Extract date components - use UTC methods for date strings to avoid timezone issues
  // For Date objects created from strings like "2024-02-01", use UTC to get the actual date
  const isDateString =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date);
  const year = isDateString ? dateObj.getUTCFullYear() : dateObj.getFullYear();
  const month = isDateString ? dateObj.getUTCMonth() : dateObj.getMonth();
  const day = isDateString ? dateObj.getUTCDate() : dateObj.getDate();
  const hours = isDateString ? dateObj.getUTCHours() : dateObj.getHours();
  const minutes = isDateString ? dateObj.getUTCMinutes() : dateObj.getMinutes();
  const seconds = isDateString ? dateObj.getUTCSeconds() : dateObj.getSeconds();
  const milliseconds = isDateString
    ? dateObj.getUTCMilliseconds()
    : dateObj.getMilliseconds();

  // Create new date with adjusted month
  // For date strings, use UTC constructor to preserve the date correctly
  // For Date objects, use local time constructor to preserve timezone
  if (isDateString) {
    const result = new Date(
      Date.UTC(year, month + months, day, hours, minutes, seconds, milliseconds)
    );
    return result;
  } else {
    const result = new Date(
      year,
      month + months,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    );
    return result;
  }
}

/**
 * Adds years to a date using calendar years
 * Automatically detects and converts unknown date types
 * Handles leap years correctly (e.g., adding 1 year to Feb 29, 2024 gives Feb 28, 2025)
 *
 * @param years - Number of years to add (can be negative to subtract)
 * @param date - Optional date value (string, Date, number, or unknown) to add years to. Defaults to current date/time if not provided
 * @returns Date object with years added, or null if date is invalid
 *
 * @example
 * ```ts
 * addYears(1, new Date("2024-01-15")) // Date object for 2025-01-15
 * addYears(-2, "2024-01-15") // Date object for 2022-01-15
 * addYears(1, "2024-02-01") // Date object for 2025-02-01
 * addYears(1) // 1 year from now
 * ```
 */
export function addYears(years: number, date?: unknown): Date | null {
  const dateObj = date !== undefined ? toDate(date, null) : new Date();
  if (dateObj === null) return null;

  // Extract date components - use UTC methods for date strings to avoid timezone issues
  // For Date objects created from strings like "2024-02-01", use UTC to get the actual date
  const isDateString =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date);
  const year = isDateString ? dateObj.getUTCFullYear() : dateObj.getFullYear();
  const month = isDateString ? dateObj.getUTCMonth() : dateObj.getMonth();
  const day = isDateString ? dateObj.getUTCDate() : dateObj.getDate();
  const hours = isDateString ? dateObj.getUTCHours() : dateObj.getHours();
  const minutes = isDateString ? dateObj.getUTCMinutes() : dateObj.getMinutes();
  const seconds = isDateString ? dateObj.getUTCSeconds() : dateObj.getSeconds();
  const milliseconds = isDateString
    ? dateObj.getUTCMilliseconds()
    : dateObj.getMilliseconds();

  // Create new date with adjusted year
  // For date strings, use UTC constructor to preserve the date correctly
  // For Date objects, use local time constructor to preserve timezone
  if (isDateString) {
    const result = new Date(
      Date.UTC(year + years, month, day, hours, minutes, seconds, milliseconds)
    );
    return result;
  } else {
    const result = new Date(
      year + years,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    );
    return result;
  }
}

/**
 * Adds hours to a date
 * Automatically detects and converts unknown date types
 *
 * @param hours - Number of hours to add (can be negative to subtract)
 * @param date - Optional date value (string, Date, number, or unknown) to add hours to. Defaults to current date/time if not provided
 * @returns Date object with hours added, or null if date is invalid
 *
 * @example
 * ```ts
 * addHours(2, new Date("2024-01-15T12:00:00")) // Date object for 2024-01-15T14:00:00
 * addHours(-1, "2024-01-15T12:00:00") // Date object for 2024-01-15T11:00:00
 * addHours(2) // 2 hours from now
 * ```
 */
export function addHours(hours: number, date?: unknown): Date | null {
  return addToDate(hours * 60 * 60 * 1000, date);
}

/**
 * Adds minutes to a date
 * Automatically detects and converts unknown date types
 *
 * @param minutes - Number of minutes to add (can be negative to subtract)
 * @param date - Optional date value (string, Date, number, or unknown) to add minutes to. Defaults to current date/time if not provided
 * @returns Date object with minutes added, or null if date is invalid
 *
 * @example
 * ```ts
 * addMinutes(30, new Date("2024-01-15T12:00:00")) // Date object for 2024-01-15T12:30:00
 * addMinutes(-15, "2024-01-15T12:00:00") // Date object for 2024-01-15T11:45:00
 * addMinutes(30) // 30 minutes from now
 * ```
 */
export function addMinutes(minutes: number, date?: unknown): Date | null {
  return addToDate(minutes * 60 * 1000, date);
}

/**
 * Adds seconds to a date
 * Automatically detects and converts unknown date types
 *
 * @param seconds - Number of seconds to add (can be negative to subtract)
 * @param date - Optional date value (string, Date, number, or unknown) to add seconds to. Defaults to current date/time if not provided
 * @returns Date object with seconds added, or null if date is invalid
 *
 * @example
 * ```ts
 * addSeconds(45, new Date("2024-01-15T12:00:00")) // Date object for 2024-01-15T12:00:45
 * addSeconds(-30, "2024-01-15T12:00:00") // Date object for 2024-01-15T11:59:30
 * addSeconds(45) // 45 seconds from now
 * ```
 */
export function addSeconds(seconds: number, date?: unknown): Date | null {
  return addToDate(seconds * 1000, date);
}

/**
 * Adds a duration to a date
 * Accepts either a duration string (e.g., "1D", "5Y", "2h", "M", "m") or milliseconds
 * Automatically detects and converts unknown date types
 *
 * @param duration - Duration string (e.g., "1D", "+5Y", "-2h") or number of milliseconds
 * @param date - Optional date value (string, Date, number, or unknown) to add duration to. Defaults to current date/time if not provided
 * @returns Date object with duration added, or null if duration or date is invalid
 *
 * @example
 * ```ts
 * addToDate("1D") // 1 day from now
 * addToDate("5Y", "2024-01-15") // 5 years from 2024-01-15
 * addToDate("-2h", new Date()) // 2 hours ago from now
 * addToDate(86400000) // 1 day from now (milliseconds)
 * addToDate(86400000, "2024-01-15") // 1 day from 2024-01-15
 * addToDate("M") // 1 month from now
 * addToDate("m") // 1 minute from now
 * ```
 */
export function addToDate(
  duration: string | number | Duration,
  date?: unknown
): Date | null {
  // Parse duration
  const parsed = parseDuration(duration);
  if (parsed === null) return null;

  // Get the base date (default to now if not provided)
  const dateObj = date !== undefined ? toDate(date, null) : new Date();
  if (dateObj === null) return null;

  const { milliseconds, value, unit } = parsed;

  // Handle relative units (calendar-based) using appropriate functions
  // Relative units (M, Y, Q) have milliseconds set to 0 by parseDuration
  if (unit === "M" || unit === "Y" || unit === "Q") {
    // Pass the original date argument (not the converted Date object) to preserve timezone handling
    const dateArg = date !== undefined ? date : dateObj;
    if (unit === "M") {
      return addMonths(value, dateArg);
    } else if (unit === "Y") {
      return addYears(value, dateArg);
    } else if (unit === "Q") {
      // Quarters are 3 months
      return addMonths(value * 3, dateArg);
    }
  }

  // For fixed units or number input, add milliseconds
  return new Date(dateObj.getTime() + (milliseconds ?? 0));
}

/**
 * Compares two date values
 * Automatically detects and converts unknown date types
 *
 * @param date1 - First date value (string, Date, number, or unknown)
 * @param date2 - Second date value (string, Date, number, or unknown)
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2, or null if either date is invalid
 *
 * @example
 * ```ts
 * compareDates("2025-01-15", "2025-01-20") // -1 (date1 is before date2)
 * compareDates(new Date("2025-01-15"), "2025-01-20") // -1
 * compareDates("2025-01-15", "2025-01-15") // 0 (equal)
 * compareDates("2025-01-20", "2025-01-15") // 1 (date1 is after date2)
 * ```
 */
export function compareDates(date1: unknown, date2: unknown): number | null {
  const d1 = toDate(date1);
  const d2 = toDate(date2);

  if (!d1 || !d2) return null;

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
}

/**
 * Gets the difference between two dates in milliseconds
 * @param value - The first date
 * @param date - The second date
 * @returns The difference in milliseconds (value - date), or 0 if either date is invalid
 */
export function getDateDifference(value: unknown, date: unknown): number {
  const compareDate = toDate(value, null);
  if (compareDate === null) return 0;
  const dateDate = toDate(date, null);
  if (dateDate === null) return 0;
  return compareDate.getTime() - dateDate.getTime();
}

/**
 * Gets the number of days between two dates
 * Automatically detects and converts unknown date types
 *
 * @param date1 - First date value (string, Date, number, or unknown)
 * @param date2 - Second date value (string, Date, number, or unknown)
 * @returns Number of days between the dates (date1 - date2), or null if either date is invalid
 *
 * @example
 * ```ts
 * getDaysBetween("2024-01-15", "2024-01-10") // 5
 * getDaysBetween("2024-01-10", "2024-01-15") // -5
 * ```
 */
export function getDaysBetween(date1: unknown, date2: unknown): number | null {
  const d1 = toDate(date1, null);
  const d2 = toDate(date2, null);
  if (d1 === null || d2 === null) return null;

  const diffMs = d1.getTime() - d2.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Gets the number of months between two dates
 * Automatically detects and converts unknown date types
 *
 * @param date1 - First date value (string, Date, number, or unknown)
 * @param date2 - Second date value (string, Date, number, or unknown)
 * @returns Number of months between the dates (date1 - date2), or null if either date is invalid
 *
 * @example
 * ```ts
 * getMonthsBetween("2024-03-15", "2024-01-15") // 2
 * getMonthsBetween("2024-01-15", "2024-03-15") // -2
 * ```
 */
export function getMonthsBetween(
  date1: unknown,
  date2: unknown
): number | null {
  const d1 = toDate(date1, null);
  const d2 = toDate(date2, null);
  if (d1 === null || d2 === null) return null;

  const yearsDiff = d1.getFullYear() - d2.getFullYear();
  const monthsDiff = d1.getMonth() - d2.getMonth();
  return yearsDiff * 12 + monthsDiff;
}

/**
 * Gets the number of years between two dates
 * Automatically detects and converts unknown date types
 *
 * @param date1 - First date value (string, Date, number, or unknown)
 * @param date2 - Second date value (string, Date, number, or unknown)
 * @returns Number of years between the dates (date1 - date2), or null if either date is invalid
 *
 * @example
 * ```ts
 * getYearsBetween("2025-01-15", "2024-01-15") // 1
 * getYearsBetween("2024-01-15", "2025-01-15") // -1
 * ```
 */
export function getYearsBetween(date1: unknown, date2: unknown): number | null {
  const d1 = toDate(date1, null);
  const d2 = toDate(date2, null);
  if (d1 === null || d2 === null) return null;

  return d1.getFullYear() - d2.getFullYear();
}

/**
 * Calculates age from a birth date
 * Automatically detects and converts unknown date types
 *
 * @param birthDate - Birth date value (string, Date, number, or unknown)
 * @returns Age in years, or null if birth date is invalid
 *
 * @example
 * ```ts
 * getAge("2000-01-15") // Age in years from 2000-01-15 to today
 * getAge(new Date("1990-05-20")) // Age in years from 1990-05-20 to today
 * ```
 */
export function getAge(birthDate: unknown): number | null {
  const birth = toDate(birthDate, null);
  if (birth === null) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
