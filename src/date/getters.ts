/**
 * Date getter utilities
 * 
 * Functions for extracting date components and getting specific date values
 */

import { toDate, toDateString } from "./conversion";
import { isPlainObject } from "../is";
import { toPlainObject } from "../object";
import { MonthFormatOptions, DayOfWeekFormatOptions } from "./constants";

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
 * Returns the year of a given date
 * @param date - The date to get the year from (default: current date)
 * @returns The year of the date
 */
export function getYear(date?: unknown): number {
  return toDate(date, new Date()).getFullYear();
}

/**
 * Gets the month for a given date
 * Supports multiple formats: number (1-12, where 1 is January), number-zero-based (0-11, where 0 is January), or localized string formats
 *
 * @overload
 * @param date - The date to get the month for
 * @param opts - Options with format set to "number" or "number-zero-based"
 * @returns The month as a number (1-12 for "number", 0-11 for "number-zero-based")
 *
 * @overload
 * @param date - The date to get the month for
 * @param opts - Options with format set to "long", "short", or "narrow"
 * @returns The month as a localized string
 *
 * @overload
 * @param opts - Options with format set to "number" or "number-zero-based" (date defaults to current date)
 * @returns The month as a number (1-12 for "number", 0-11 for "number-zero-based")
 *
 * @overload
 * @param opts - Options with format set to "long", "short", or "narrow" (date defaults to current date)
 * @returns The month as a localized string
 *
 * @param a - Either the date value or options object (if date is omitted)
 * @param b - Options object (if date is provided as first argument)
 * @returns The month as a number or string, depending on the format option
 *
 * @example
 * ```ts
 * getMonth(new Date("2024-01-15"), { format: "number" }) // 1 (January)
 * getMonth(new Date("2024-01-15"), { format: "number-zero-based" }) // 0 (January)
 * getMonth("2024-01-15", { format: "long" }) // "January"
 * getMonth("2024-01-15", { format: "short" }) // "Jan"
 * getMonth("2024-01-15", { format: "narrow" }) // "J"
 * getMonth({ format: "number" }) // Current month as number (1-12)
 * getMonth({ format: "number-zero-based" }) // Current month as number (0-11)
 * getMonth({ format: "long", locale: "es" }) // Current month in Spanish
 * ```
 */
export function getMonth(
  date: unknown,
  opts: MonthFormatOptions & { format: "number" | "number-zero-based" }
): number;
export function getMonth(
  date: unknown,
  opts: MonthFormatOptions & { format: "long" | "short" | "narrow" }
): string;
export function getMonth(
  opts: MonthFormatOptions & { format: "number" | "number-zero-based" }
): number;
export function getMonth(
  opts: MonthFormatOptions & { format: "long" | "short" | "narrow" }
): string;
export function getMonth(
  a?: unknown | MonthFormatOptions,
  b?: MonthFormatOptions
): number | string {
  // Determine if first argument is options (plain object) or date
  const isFirstArgOptions = b === undefined && isPlainObject(a);
  const dateObj = isFirstArgOptions ? new Date() : toDate(a, new Date());
  const opts = toPlainObject(
    b || (isFirstArgOptions ? a : {}) || {}
  ) as MonthFormatOptions;

  if (opts.format === "number" || opts.format === "number-zero-based") {
    // getMonth() returns 0-11, "number" returns 1-12, "number-zero-based" returns 0-11
    return opts.format === "number"
      ? dateObj.getMonth() + 1
      : dateObj.getMonth();
  }
  return dateObj.toLocaleDateString(opts.locale ?? undefined, {
    month: opts.format ?? "long",
  });
}

/**
 * Returns the day of a given date
 * @param date - The date to get the day from (default: current date)
 * @returns The day of the date
 */
export function getDayOfMonth(date?: unknown): number {
  return toDate(date, new Date()).getDate();
}

/**
 * Gets the day of the week for a given date
 * Supports multiple formats: number (1-7, where 1 is Sunday), number-zero-based (0-6, where 0 is Sunday), or localized string formats
 *
 * @overload
 * @param date - The date to get the day of week for
 * @param opts - Options with format set to "number" or "number-zero-based"
 * @returns The day of the week as a number (1-7 for "number" where 1 is Sunday, 0-6 for "number-zero-based" where 0 is Sunday)
 *
 * @overload
 * @param date - The date to get the day of week for
 * @param opts - Options with format set to "long", "short", or "narrow"
 * @returns The day of the week as a localized string
 *
 * @overload
 * @param opts - Options with format set to "number" or "number-zero-based" (date defaults to current date)
 * @returns The day of the week as a number (1-7 for "number", 0-6 for "number-zero-based")
 *
 * @overload
 * @param opts - Options with format set to "long", "short", or "narrow" (date defaults to current date)
 * @returns The day of the week as a localized string
 *
 * @param a - Either the date value or options object (if date is omitted)
 * @param b - Options object (if date is provided as first argument)
 * @returns The day of the week as a number or string, depending on the format option
 *
 * @example
 * ```ts
 * getDayOfWeek(new Date("2024-01-14"), { format: "number" }) // 1 (Sunday)
 * getDayOfWeek(new Date("2024-01-15"), { format: "number" }) // 2 (Monday)
 * getDayOfWeek(new Date("2024-01-14"), { format: "number-zero-based" }) // 0 (Sunday)
 * getDayOfWeek(new Date("2024-01-15"), { format: "number-zero-based" }) // 1 (Monday)
 * getDayOfWeek("2024-01-15", { format: "long" }) // "Monday"
 * getDayOfWeek("2024-01-15", { format: "short" }) // "Mon"
 * getDayOfWeek("2024-01-15", { format: "narrow" }) // "M"
 * getDayOfWeek({ format: "number" }) // Current day of week as number (1-7)
 * getDayOfWeek({ format: "number-zero-based" }) // Current day of week as number (0-6)
 * getDayOfWeek({ format: "long", locale: "es" }) // Current day in Spanish
 * ```
 */
export function getDayOfWeek(
  date: unknown,
  opts: DayOfWeekFormatOptions & { format: "number" | "number-zero-based" }
): number;
export function getDayOfWeek(
  date: unknown,
  opts: DayOfWeekFormatOptions & { format: "long" | "short" | "narrow" }
): string;
export function getDayOfWeek(
  opts: DayOfWeekFormatOptions & { format: "number" | "number-zero-based" }
): number;
export function getDayOfWeek(
  opts: DayOfWeekFormatOptions & { format: "long" | "short" | "narrow" }
): string;
export function getDayOfWeek(
  a?: unknown | DayOfWeekFormatOptions,
  b?: DayOfWeekFormatOptions
): number | string {
  // Determine if first argument is options (plain object) or date
  const isFirstArgOptions = b === undefined && isPlainObject(a);
  const dateObj = isFirstArgOptions ? new Date() : toDate(a, new Date());
  const opts = toPlainObject(
    b || (isFirstArgOptions ? a : {}) || {}
  ) as DayOfWeekFormatOptions;
  if (opts.format === "number" || opts.format === "number-zero-based") {
    return opts.format === "number" ? dateObj.getDay() + 1 : dateObj.getDay();
  }
  return dateObj.toLocaleDateString(opts.locale ?? undefined, {
    weekday: opts.format ?? "long",
  });
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

