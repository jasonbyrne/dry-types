/**
 * Date conversion utilities
 * 
 * Functions for converting values to Date objects and various date string formats
 */

import { toString } from "../string";
import { isNullOrUndefined, isDateString, isTimeString, isDateTimeString } from "../is";
import { DATE_REGEX, DATE_TIME_REGEX, DateTimeFormatOptions, isValidDateString } from "./constants";

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

