import { toString } from "./string";
import {
  isNullOrUndefined,
  isDateString,
  isTimeString,
  isDateTimeString,
} from "./is";

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})$/;
const DATE_TIME_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  locale?: Intl.LocalesArgument;
}

/**
 * Validates if a date string represents a valid date
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns True if the date is valid
 */
function isValidDateString(dateStr: string): boolean {
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
 * Validates if a time string represents a valid time
 * @param timeStr - Time string in HH:MM:SS format
 * @returns True if the time is valid
 */
function isValidTimeString(timeStr: string): boolean {
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

// is* functions moved to ./is.ts

/**
 * Converts a value to a Date object
 * @param value - The value to convert (string, Date, number, or unknown)
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns A Date object, or the default value if conversion fails
 */
export function toDate<T extends Date | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): Date | T {
  if (isNullOrUndefined(value)) return defaultValue;
  if (value instanceof Date) {
    // Validate that it's not an Invalid Date
    if (isNaN(value.getTime())) return defaultValue;
    return value;
  }
  // Handle numbers (timestamps) directly
  if (typeof value === "number") {
    const date = new Date(value);
    if (isNaN(date.getTime())) return defaultValue;
    return date;
  }
  const transformed = toString(value);
  if (typeof transformed === "string") {
    // If it looks like a date string, validate it first
    if (DATE_REGEX.test(transformed)) {
      if (!isValidDateString(transformed)) {
        return defaultValue;
      }
    }
    // If it looks like a date-time string, validate it
    if (DATE_TIME_REGEX.test(transformed)) {
      if (!isDateTimeString(transformed)) {
        return defaultValue;
      }
    }
    const date = new Date(transformed);
    // Validate that it's not an Invalid Date
    if (isNaN(date.getTime())) return defaultValue;
    // For date strings, verify the date wasn't auto-corrected
    if (DATE_REGEX.test(transformed)) {
      const dateStr = date.toISOString().split("T")[0];
      if (dateStr !== transformed) {
        return defaultValue;
      }
    }
    return date;
  }
  return defaultValue;
}

/**
 * Converts a value to an epoch timestamp in milliseconds
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns The epoch timestamp in milliseconds, or the default value if conversion fails
 */
export function toEpochMsTimestamp<T extends number | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): number | T {
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return date.getTime();
}

/**
 * Converts a value to an epoch timestamp in seconds
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns The epoch timestamp in seconds, or the default value if conversion fails
 */
export function toEpochSecondsTimestamp<T extends number | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): number | T {
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return Math.floor(date.getTime() / 1000);
}

/**
 * Converts a value to an ISO date string
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns An ISO date string, or the default value if conversion fails
 */
export function toISODateString<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): string | T {
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return date.toISOString();
}

/**
 * Converts a value to a locale-formatted date string
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @param opts - Formatting options for locale-specific formatting
 * @returns A locale-formatted date string, or the default value if conversion fails
 */
export function toLocaleDateString<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = null as T,
  opts: DateTimeFormatOptions = {}
): string | T {
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return date.toLocaleDateString(opts.locale, opts);
}

/**
 * Converts a value to a locale-formatted time string
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @param opts - Formatting options for locale-specific formatting (default: { hour: "numeric", minute: "2-digit" })
 * @returns A locale-formatted time string, or the default value if conversion fails
 */
export function toLocaleTimeString<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = null as T,
  opts: DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  }
): string | T {
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return date.toLocaleTimeString(opts.locale, opts);
}

/**
 * Converts a value to a date string in YYYY-MM-DD format
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns A date string in YYYY-MM-DD format, or the default value if conversion fails
 */
export function toDateString<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): string | T {
  if (isDateString(value)) return value;
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return date.toISOString().split("T")[0];
}

/**
 * Converts a value to a time string in HH:MM:SS format
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns A time string in HH:MM:SS format, or the default value if conversion fails
 */
export function toTimeString<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): string | T {
  if (isTimeString(value)) return value;
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return date.toISOString().split("T")[1].split(".")[0].replace("Z", "");
}

/**
 * Converts a value to a date-time string in YYYY-MM-DD HH:MM:SS format
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: null)
 * @returns A date-time string in YYYY-MM-DD HH:MM:SS format, or the default value if conversion fails
 */
export function toDateTimeString<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = null as T
): string | T {
  if (isDateTimeString(value)) return value;
  const date = toDate(value, null);
  if (date === null) return defaultValue;
  return `${toDateString(value, null)} ${toTimeString(value, null)}`;
}

/**
 * Checks if a date is between two other dates (inclusive)
 * @param value - The date to check
 * @param start - The start date
 * @param end - The end date
 * @returns True if the date is between start and end (inclusive)
 */
export function isDateBetween(
  value: unknown,
  start: unknown,
  end: unknown
): boolean {
  const compareDate = toDate(value, null);
  if (compareDate === null) return false;
  const startDate = toDate(start, null);
  if (startDate === null) return false;
  const endDate = toDate(end, null);
  if (endDate === null) return false;
  return compareDate >= startDate && compareDate <= endDate;
}

/**
 * Checks if a date is after another date
 * @param value - The date to check
 * @param date - The date to compare against
 * @returns True if the first date is after the second date
 */
export function isAfter(value: unknown, date: unknown): boolean {
  const compareDate = toDate(value, null);
  if (compareDate === null) return false;
  const dateDate = toDate(date, null);
  if (dateDate === null) return false;
  return compareDate > dateDate;
}

/**
 * Checks if a date is before another date
 * @param value - The date to check
 * @param date - The date to compare against
 * @returns True if the first date is before the second date
 */
export function isBefore(value: unknown, date: unknown): boolean {
  const compareDate = toDate(value, null);
  if (compareDate === null) return false;
  const dateDate = toDate(date, null);
  if (dateDate === null) return false;
  return compareDate < dateDate;
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
 * Gets the last date of the month for a given date
 * @param value - The date to get the last date of month for (default: current date)
 * @returns The last date of the month as a YYYY-MM-DD string
 */
export function getLastDateOfMonth(value?: unknown): string {
  const date = toDate(value, new Date());
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return toDateString(lastDate);
}

/**
 * Gets the last date of the year for a given date
 * @param value - The date to get the last date of year for (default: current date)
 * @returns The last date of the year as a YYYY-MM-DD string
 */
export function getLastDateOfYear(value?: unknown): string {
  const date = toDate(value, new Date());
  const lastDate = new Date(date.getFullYear(), 11, 31);
  return toDateString(lastDate);
}

/**
 * Gets the last date of the week (7 days from the given date)
 * @param value - The date to get the last date of week for (default: current date)
 * @returns The last date of the week as a YYYY-MM-DD string
 */
export function getLastDateOfWeek(value?: unknown): string {
  const date = toDate(value, new Date());
  const lastDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 7
  );
  return toDateString(lastDate);
}

/**
 * Gets the last date of the quarter for a given date
 * @param value - The date to get the last date of quarter for (default: current date)
 * @returns The last date of the quarter as a YYYY-MM-DD string
 */
export function getLastDateOfQuarter(value?: unknown): string {
  const date = toDate(value, new Date());
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 3, 0);
  return toDateString(lastDate);
}

/**
 * Gets the first date of the month for a given date
 * @param value - The date to get the first date of month for (default: current date)
 * @returns The first date of the month as a YYYY-MM-DD string
 */
export function getFirstDateOfMonth(value?: unknown): string {
  const date = toDate(value, new Date());
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  return toDateString(firstDate);
}

/**
 * Gets the first date of the year for a given date
 * @param value - The date to get the first date of year for (default: current date)
 * @returns The first date of the year as a YYYY-MM-DD string
 */
export function getFirstDateOfYear(value?: unknown): string {
  const date = toDate(value, new Date());
  const firstDate = new Date(date.getFullYear(), 0, 1);
  return toDateString(firstDate);
}

/**
 * Gets the first date of the week (Sunday) for a given date
 * @param value - The date to get the first date of week for (default: current date)
 * @returns The first date of the week as a YYYY-MM-DD string
 */
export function getFirstDateOfWeek(value?: unknown): string {
  const date = toDate(value, new Date());
  const firstDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay()
  );
  return toDateString(firstDate);
}

/**
 * Gets the first date of the quarter for a given date
 * @param value - The date to get the first date of quarter for (default: current date)
 * @returns The first date of the quarter as a YYYY-MM-DD string
 */
export function getFirstDateOfQuarter(value?: unknown): string {
  const date = toDate(value, new Date());
  const quarter = Math.floor(date.getMonth() / 3);
  const firstDate = new Date(date.getFullYear(), quarter * 3, 1);
  return toDateString(firstDate);
}

/**
 * Returns the current date and time as a Date object
 * @returns The current Date object
 */
export function now(): Date {
  return new Date();
}

/**
 * Returns the earliest (minimum) date from the provided values
 * Returns null if no valid dates are provided
 *
 * @param values - Array of date values to compare
 * @returns The earliest date, or null if no valid dates found
 *
 * @example
 * ```ts
 * // Get the earliest date from multiple options
 * const earliest = getMinDate([first_joined_date, start_date, new Date()]);
 * ```
 */
export function getMinDate(values: Array<unknown>): Date | null {
  const validDates: Date[] = [];
  for (const value of values) {
    const date = toDate(value, null);
    if (date !== null && date !== undefined && !isNaN(date.getTime())) {
      validDates.push(date);
    }
  }
  if (validDates.length === 0) return null;
  return new Date(Math.min(...validDates.map((d) => d.getTime())));
}

/**
 * Returns the latest (maximum) date from the provided values
 * Returns null if no valid dates are provided
 *
 * @param values - Array of date values to compare
 * @returns The latest date, or null if no valid dates found
 *
 * @example
 * ```ts
 * // Get the latest date from multiple options
 * const latest = getMaxDate([first_joined_date, start_date, new Date()]);
 * ```
 */
export function getMaxDate(values: Array<unknown>): Date | null {
  const validDates: Date[] = [];
  for (const value of values) {
    const date = toDate(value, null);
    if (date !== null && date !== undefined && !isNaN(date.getTime())) {
      validDates.push(date);
    }
  }
  if (validDates.length === 0) return null;
  return new Date(Math.max(...validDates.map((d) => d.getTime())));
}

/**
 * Returns the current date string in YYYY-MM-DD format
 * @returns Current date string (YYYY-MM-DD)
 */
export function getCurrentDateString(): string {
  return new Date().toISOString().split("T")[0];
}

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
 * Converts a date value to the start of that day (00:00:00.000)
 * Used for start_date comparisons - start dates are considered active from the beginning of the day
 * Automatically detects and converts unknown types
 *
 * @param value - Date value (string, Date, number, or unknown)
 * @returns Date object set to start of day (00:00:00.000), or null if invalid
 */
export function getStartOfDay(value: unknown): Date | null {
  if (value === null || value === undefined) return null;

  const date = toDate(value);
  if (!date) return null;

  // Set to start of day (00:00:00.000)
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Converts a date value to the end of that day (23:59:59.999)
 * Used for end_date comparisons - end dates are considered active until the end of the day
 * Automatically detects and converts unknown types
 *
 * @param value - Date value (string, Date, number, or unknown)
 * @returns Date object set to end of day (23:59:59.999), or null if invalid
 */
export function getEndOfDay(value: unknown): Date | null {
  if (value === null || value === undefined) return null;

  const date = toDate(value);
  if (!date) return null;

  // Set to end of day (23:59:59.999)
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * Checks if a date is before another date, considering end dates as end of day
 * For end_date comparisons: if end_date is 2024-12-31, it's still valid until 23:59:59.999 on that day
 * Automatically detects and converts unknown types
 *
 * @param dateToCheck - The date to check (automatically detected and converted)
 * @param endDate - The end date to compare against (treated as end of day, automatically detected and converted)
 * @returns true if dateToCheck is before or equal to the end of endDate's day
 */
export function isBeforeEndDate(
  dateToCheck: unknown,
  endDate: unknown
): boolean {
  if (endDate === null || endDate === undefined) return false; // No end date means no limit
  if (dateToCheck === null || dateToCheck === undefined) return false;

  const checkDate = getStartOfDay(dateToCheck);
  const endOfEndDate = getEndOfDay(endDate);

  if (!checkDate || !endOfEndDate) return false;

  return checkDate <= endOfEndDate;
}

/**
 * Checks if a date is after another date, considering start dates as start of day
 * For start_date comparisons: if start_date is 2024-01-01, it's active from 00:00:00.000 on that day
 * Automatically detects and converts unknown types
 *
 * @param dateToCheck - The date to check (automatically detected and converted)
 * @param startDate - The start date to compare against (treated as start of day, automatically detected and converted)
 * @returns true if dateToCheck is after or equal to the start of startDate's day
 */
export function isAfterStartDate(
  dateToCheck: unknown,
  startDate: unknown
): boolean {
  if (startDate === null || startDate === undefined) return true; // No start date means always valid
  if (dateToCheck === null || dateToCheck === undefined) return false;

  const checkDate = getStartOfDay(dateToCheck);
  const startOfStartDate = getStartOfDay(startDate);

  if (!checkDate || !startOfStartDate) return false;

  return checkDate >= startOfStartDate;
}

/**
 * Checks if a date is within a date range, considering:
 * - start_date as start of day (00:00:00.000)
 * - end_date as end of day (23:59:59.999)
 * Automatically detects and converts unknown types
 *
 * @param dateToCheck - The date to check (automatically detected and converted)
 * @param startDate - The start date of the range (treated as start of day, automatically detected and converted)
 * @param endDate - The end date of the range (treated as end of day, automatically detected and converted)
 * @returns true if dateToCheck is within the range (inclusive)
 */
export function isDateInRange(
  dateToCheck: unknown,
  startDate: unknown,
  endDate: unknown
): boolean {
  if (dateToCheck === null || dateToCheck === undefined) return false;

  // If no start date, only check end date
  if (startDate === null || startDate === undefined) {
    return isBeforeEndDate(dateToCheck, endDate);
  }

  // If no end date, only check start date
  if (endDate === null || endDate === undefined) {
    return isAfterStartDate(dateToCheck, startDate);
  }

  // Check both boundaries
  return (
    isAfterStartDate(dateToCheck, startDate) &&
    isBeforeEndDate(dateToCheck, endDate)
  );
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
 * Checks if a date is today
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to check
 * @returns true if the date is today, false otherwise
 *
 * @example
 * ```ts
 * isToday(new Date()) // true
 * isToday("2024-01-15") // true if today is 2024-01-15
 * ```
 */
export function isToday(date: unknown): boolean {
  const dateObj = toDate(date, null);
  if (dateObj === null) return false;

  const today = new Date();
  const todayStr = toDateString(today);
  const dateStr = toDateString(dateObj);
  return todayStr === dateStr;
}

/**
 * Checks if a date is yesterday
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to check
 * @returns true if the date is yesterday, false otherwise
 *
 * @example
 * ```ts
 * const yesterday = new Date();
 * yesterday.setDate(yesterday.getDate() - 1);
 * isYesterday(yesterday) // true
 * ```
 */
export function isYesterday(date: unknown): boolean {
  const dateObj = toDate(date, null);
  if (dateObj === null) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateString(yesterday);
  const dateStr = toDateString(dateObj);
  return yesterdayStr === dateStr;
}

/**
 * Checks if a date is tomorrow
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to check
 * @returns true if the date is tomorrow, false otherwise
 *
 * @example
 * ```ts
 * const tomorrow = new Date();
 * tomorrow.setDate(tomorrow.getDate() + 1);
 * isTomorrow(tomorrow) // true
 * ```
 */
export function isTomorrow(date: unknown): boolean {
  const dateObj = toDate(date, null);
  if (dateObj === null) return false;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = toDateString(tomorrow);
  const dateStr = toDateString(dateObj);
  return tomorrowStr === dateStr;
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
   * Maximum unit to use (default: 'year')
   */
  maxUnit?: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
  /**
   * Minimum unit to use (default: 'second')
   */
  minUnit?: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
}

/**
 * Gets a human-readable relative time string (e.g., "2 years ago", "3 minutes ago", "just now", "1 hour from now")
 * Automatically detects and converts unknown date types
 *
 * @param date - Date value (string, Date, number, or unknown) to get relative time for
 * @param options - Configuration options for relative time formatting
 * @returns Relative time string, or null if date is invalid
 *
 * @example
 * ```ts
 * getRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 * getRelativeTime("2020-01-01") // "X years ago" (depending on current date)
 * getRelativeTime(new Date(Date.now() + 3600000)) // "1 hour from now"
 * getRelativeTime(new Date(Date.now() - 5000)) // "just now"
 * getRelativeTime(date, { threshold: 5 }) // Custom threshold for "just now"
 * getRelativeTime(date, { round: false }) // Use floor instead of rounding
 * ```
 */
export function getRelativeTime(
  date: unknown,
  options: RelativeTimeOptions = {}
): string | null {
  const dateObj = toDate(date, null);
  if (dateObj === null) return null;

  const {
    referenceDate,
    threshold = 10,
    round = true,
    maxUnit = "year",
    minUnit = "second",
  } = options;

  const refDate =
    referenceDate !== undefined ? toDate(referenceDate, null) : new Date();
  if (refDate === null) return null;

  const diffSeconds = Math.floor(
    (dateObj.getTime() - refDate.getTime()) / 1000
  );
  const absDiffSeconds = Math.abs(diffSeconds);
  const isFuture = diffSeconds > 0;

  // Handle "just now" for very recent times
  if (absDiffSeconds < threshold) {
    return "just now";
  }

  // Define units in seconds
  const units: Array<{
    name: string;
    plural: string;
    seconds: number;
    key: RelativeTimeOptions["maxUnit"];
  }> = [
    { name: "second", plural: "seconds", seconds: 1, key: "second" },
    { name: "minute", plural: "minutes", seconds: 60, key: "minute" },
    { name: "hour", plural: "hours", seconds: 3600, key: "hour" },
    { name: "day", plural: "days", seconds: 86400, key: "day" },
    { name: "week", plural: "weeks", seconds: 604800, key: "week" },
    { name: "month", plural: "months", seconds: 2592000, key: "month" }, // ~30 days
    { name: "year", plural: "years", seconds: 31536000, key: "year" }, // ~365 days
  ];

  // Filter units based on min/max
  const maxUnitIndex = units.findIndex((u) => u.key === maxUnit);
  const minUnitIndex = units.findIndex((u) => u.key === minUnit);
  const availableUnits = units.slice(
    Math.max(0, minUnitIndex),
    maxUnitIndex >= 0 ? maxUnitIndex + 1 : units.length
  );

  // Find the most appropriate unit
  let selectedUnit: (typeof units)[0] | null = null;
  let value = 0;

  // Check if we should use years or months (more accurate than seconds-based calculation)
  const canUseYear = availableUnits.some((u) => u.key === "year");
  const canUseMonth = availableUnits.some((u) => u.key === "month");

  // Try years and months first (more accurate) - but only if time difference is large enough
  // Only use months/years if the difference is at least ~20 days (to avoid using months for small differences)
  if ((canUseYear || canUseMonth) && absDiffSeconds >= 20 * 24 * 60 * 60) {
    const monthsDiff = getMonthsBetween(dateObj, refDate);
    if (monthsDiff !== null) {
      const absMonths = Math.abs(monthsDiff);

      // Check if we should use years
      if (absMonths >= 12 && canUseYear) {
        const yearsDiff = getYearsBetween(dateObj, refDate);
        if (yearsDiff !== null) {
          const absYears = Math.abs(yearsDiff);
          const remainingMonths = absMonths % 12;

          // Use years if we have at least 1 year, or if rounding would make it 1 year
          if (absYears > 0 || (round && remainingMonths >= 6)) {
            const yearUnit = units.find((u) => u.key === "year");
            if (yearUnit && availableUnits.some((u) => u.key === "year")) {
              selectedUnit = yearUnit;
              value = round && remainingMonths >= 6 ? absYears + 1 : absYears;
              value = Math.max(1, value);
            }
          }
        }
      }

      // Use months if we haven't selected a unit yet and months are available
      if (!selectedUnit && canUseMonth && absMonths > 0) {
        const monthUnit = units.find((u) => u.key === "month");
        if (monthUnit && availableUnits.some((u) => u.key === "month")) {
          selectedUnit = monthUnit;
          value = round ? Math.round(absMonths) : absMonths;
        }
      }
    }
  }

  // If we haven't selected a unit yet, use seconds-based calculation for smaller units
  if (!selectedUnit) {
    // Iterate from largest to smallest available unit
    for (let i = availableUnits.length - 1; i >= 0; i--) {
      const unit = availableUnits[i];
      // Skip months and years as we already handled them
      if (unit.key === "month" || unit.key === "year") continue;

      const unitValue = absDiffSeconds / unit.seconds;
      if (unitValue >= 1) {
        selectedUnit = unit;
        value = round ? Math.round(unitValue) : Math.floor(unitValue);
        break;
      }
    }
  }

  // Fallback to smallest available unit if nothing was selected
  if (!selectedUnit) {
    selectedUnit = availableUnits[0];
    value = absDiffSeconds;
  }

  // Ensure value is at least 1
  value = Math.max(1, value);

  const unitLabel = value === 1 ? selectedUnit.name : selectedUnit.plural;
  const direction = isFuture ? "from now" : "ago";

  return `${value} ${unitLabel} ${direction}`;
}
