/**
 * Date conversion utilities
 *
 * Functions for converting values to Date objects and various date string formats
 */

import { toString } from "../string";
import {
  isNullOrUndefined,
  isDateString,
  isTimeString,
  isDateTimeString,
} from "../is";
import {
  DATE_REGEX,
  DATE_TIME_REGEX,
  DateTimeFormatOptions,
  isValidDateString,
} from "./constants";
import { createTypedEnum } from "../enum";

/**
 * Duration unit types
 * - ms: milliseconds
 * - s: seconds
 * - m: minutes
 * - h: hours
 * - D: days
 * - W: weeks
 * - M: months
 * - Y: years
 * - Q: quarters
 */
export const DURATION = createTypedEnum({
  ms: {
    label: "millisecond",
    milliseconds: 1,
  },
  s: {
    label: "second",
    milliseconds: 1000,
  },
  m: {
    label: "minute",
    milliseconds: 60 * 1000,
  },
  h: {
    label: "Hour",
    milliseconds: 60 * 60 * 1000,
  },
  D: {
    label: "day",
    milliseconds: 24 * 60 * 60 * 1000,
  },
  W: {
    label: "week",
    milliseconds: 7 * 24 * 60 * 60 * 1000,
  },
  M: {
    label: "month",
    useRelative: true,
  },
  Y: {
    label: "year",
    useRelative: true,
  },
  Q: {
    label: "quarter",
    useRelative: true,
  },
});

export type DurationUnit = keyof typeof DURATION.values;

export interface Duration {
  value: number;
  unit: DurationUnit;
}

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
    // Detect unix timestamps in seconds (10 digits) vs milliseconds (13 digits)
    // 10-digit numbers (1000000000 to 9999999999) are likely seconds timestamps
    // 13-digit numbers (1000000000000 to 9999999999999) are likely milliseconds timestamps
    let timestamp = value;
    if (value >= 1000000000 && value <= 9999999999) {
      // 10 digits: likely unix timestamp in seconds, convert to milliseconds
      timestamp = value * 1000;
    }
    // 11-12 digit numbers are ambiguous but likely milliseconds (closer to current date range)
    // 13+ digit numbers are definitely milliseconds
    const date = new Date(timestamp);
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
 * Parses a duration string (e.g., "1D", "5Y", "2h", "M", "m") and converts it to a duration object
 * Supports optional + and - signs
 *
 * Unit mappings from DURATION enum:
 * - ms: milliseconds
 * - s: seconds
 * - m: minutes (lowercase)
 * - h: hours
 * - D: days
 * - W: weeks
 * - M: months (uppercase, useRelative: true)
 * - Y: years (useRelative: true)
 * - Q: quarters (useRelative: true)
 *
 * For relative units (M, Y, Q), milliseconds will be 0 since they require calendar-based calculation
 *
 * @param duration - Duration string to parse (e.g., "1D", "+5Y", "-2h", "M", "m") or number (milliseconds) or object with value and unit
 * @returns Duration object with milliseconds, value, and unit, or null if parsing fails
 *
 * @example
 * ```ts
 * parseDuration("1D") // { milliseconds: 86400000, value: 1, unit: "D" }
 * parseDuration("2h") // { milliseconds: 7200000, value: 2, unit: "h" }
 * parseDuration("M") // { milliseconds: 0, value: 1, unit: "M" } (relative unit)
 * parseDuration("m") // { milliseconds: 60000, value: 1, unit: "m" }
 * parseDuration("+1D") // { milliseconds: 86400000, value: 1, unit: "D" }
 * parseDuration("-2h") // { milliseconds: -7200000, value: -2, unit: "h" }
 * parseDuration(86400000) // { milliseconds: 86400000, value: 86400000, unit: "ms" }
 * parseDuration({ value: 1, unit: "D" }) // { milliseconds: 86400000, value: 1, unit: "D" }
 * ```
 */
export function parseDuration(
  duration: string | number | Duration
): (Duration & { milliseconds?: number }) | null {
  // Handle number input (treat as milliseconds)
  if (typeof duration === "number") {
    return {
      milliseconds: duration,
      value: duration,
      unit: "ms",
    };
  }

  // Handle object input
  if (
    typeof duration === "object" &&
    duration !== null &&
    "value" in duration &&
    "unit" in duration
  ) {
    const { value, unit } = duration;
    if (!DURATION.isValueValid(unit)) return null;

    const unitEntry = DURATION.enumMap[unit] as any;
    if (!unitEntry) return null;

    // Check if unit is relative (calendar-based)
    if (unitEntry.useRelative === true) {
      // For relative units, milliseconds is 0 (will be handled by calendar functions)
      return {
        milliseconds: 0,
        value,
        unit,
      };
    }

    // For fixed units, calculate milliseconds
    const millisecondsPerUnit = unitEntry.milliseconds;
    if (typeof millisecondsPerUnit !== "number") return null;

    return {
      milliseconds: value * millisecondsPerUnit,
      value,
      unit,
    };
  }

  // Handle string input
  if (typeof duration !== "string") return null;

  const trimmed = duration.trim();
  if (!trimmed) return null;

  // Extract sign (optional + or -)
  let sign = 1;
  let remaining = trimmed;
  if (remaining.startsWith("+")) {
    sign = 1;
    remaining = remaining.substring(1).trim();
  } else if (remaining.startsWith("-")) {
    sign = -1;
    remaining = remaining.substring(1).trim();
  }

  if (!remaining) return null;

  // Parse number and unit
  // Match: optional number (integer or decimal) followed by unit letter(s)
  // Examples: "1D", "1.5D", ".5D", "D"
  const match = remaining.match(/^(\d+\.?\d*|\.\d+)?([a-zA-Z]+)$/);
  if (!match) return null;

  const numberPart = match[1];
  const unitPart = match[2];

  // If no number part, default to 1
  const value = numberPart ? parseFloat(numberPart) : 1;
  if (isNaN(value) || value < 0) return null;

  // Map string unit to DURATION enum key
  // Handle case variations and aliases
  const unitMap: Record<string, DurationUnit> = {
    // Milliseconds
    ms: "ms",
    // Seconds
    s: "s",
    S: "s",
    // Minutes (lowercase m)
    m: "m",
    // Hours
    h: "h",
    H: "h",
    // Days
    d: "D",
    D: "D",
    // Weeks
    w: "W",
    W: "W",
    // Months (uppercase M)
    M: "M",
    // Years
    y: "Y",
    Y: "Y",
    // Quarters
    q: "Q",
    Q: "Q",
  };

  const normalizedUnit = unitMap[unitPart];
  if (!normalizedUnit || !DURATION.isValueValid(normalizedUnit)) {
    return null;
  }

  const unitEntry = DURATION.enumMap[normalizedUnit] as any;
  if (!unitEntry) return null;

  // Check if unit is relative (calendar-based)
  if (unitEntry.useRelative === true) {
    // For relative units, milliseconds is 0 (will be handled by calendar functions)
    return {
      milliseconds: 0,
      value: sign * value,
      unit: normalizedUnit,
    };
  }

  // For fixed units, calculate milliseconds
  const millisecondsPerUnit = unitEntry.milliseconds;
  if (typeof millisecondsPerUnit !== "number") return null;

  return {
    milliseconds: sign * value * millisecondsPerUnit,
    value: sign * value,
    unit: normalizedUnit,
  };
}
