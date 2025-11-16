/**
 * Date operation utilities
 * 
 * Functions for date arithmetic, comparisons, and calculations
 */

import { toDate, toDateString } from "./conversion";

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
export function addDays(days: number, date?: unknown): string {
  const dateObj = date !== undefined ? toDate(date) : null;
  const baseDate = dateObj ?? new Date();
  return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

/**
 * Adds months to a date
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to add months to
 * @param months - Number of months to add (can be negative to subtract)
 * @returns Date object with months added, or null if date is invalid
 *
 * @example
 * ```ts
 * addMonths(new Date("2024-01-15"), 2) // Date object for 2024-03-15
 * addMonths("2024-01-15", -1) // Date object for 2023-12-15
 * ```
 */
export function addMonths(date: unknown, months: number): Date | null {
  const dateObj = toDate(date, null);
  if (dateObj === null) return null;

  const result = new Date(dateObj);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Adds years to a date
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to add years to
 * @param years - Number of years to add (can be negative to subtract)
 * @returns Date object with years added, or null if date is invalid
 *
 * @example
 * ```ts
 * addYears(new Date("2024-01-15"), 1) // Date object for 2025-01-15
 * addYears("2024-01-15", -2) // Date object for 2022-01-15
 * ```
 */
export function addYears(date: unknown, years: number): Date | null {
  const dateObj = toDate(date, null);
  if (dateObj === null) return null;

  const result = new Date(dateObj);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Adds hours to a date
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to add hours to
 * @param hours - Number of hours to add (can be negative to subtract)
 * @returns Date object with hours added, or null if date is invalid
 *
 * @example
 * ```ts
 * addHours(new Date("2024-01-15T12:00:00"), 2) // Date object for 2024-01-15T14:00:00
 * addHours("2024-01-15T12:00:00", -1) // Date object for 2024-01-15T11:00:00
 * ```
 */
export function addHours(date: unknown, hours: number): Date | null {
  const dateObj = toDate(date, null);
  if (dateObj === null) return null;

  const result = new Date(dateObj);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Adds minutes to a date
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to add minutes to
 * @param minutes - Number of minutes to add (can be negative to subtract)
 * @returns Date object with minutes added, or null if date is invalid
 *
 * @example
 * ```ts
 * addMinutes(new Date("2024-01-15T12:00:00"), 30) // Date object for 2024-01-15T12:30:00
 * addMinutes("2024-01-15T12:00:00", -15) // Date object for 2024-01-15T11:45:00
 * ```
 */
export function addMinutes(date: unknown, minutes: number): Date | null {
  const dateObj = toDate(date, null);
  if (dateObj === null) return null;

  const result = new Date(dateObj);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

/**
 * Adds seconds to a date
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to add seconds to
 * @param seconds - Number of seconds to add (can be negative to subtract)
 * @returns Date object with seconds added, or null if date is invalid
 *
 * @example
 * ```ts
 * addSeconds(new Date("2024-01-15T12:00:00"), 45) // Date object for 2024-01-15T12:00:45
 * addSeconds("2024-01-15T12:00:00", -30) // Date object for 2024-01-15T11:59:30
 * ```
 */
export function addSeconds(date: unknown, seconds: number): Date | null {
  const dateObj = toDate(date, null);
  if (dateObj === null) return null;

  const result = new Date(dateObj);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
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

