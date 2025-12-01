/**
 * Date formatting utilities
 *
 * Functions for formatting dates into human-readable strings
 */

import { toDate } from "./conversion";
import {
  RelativeTimeOptions,
  DATE_REGEX,
  isValidDateString,
} from "./constants";
import { getMonthsBetween, getYearsBetween } from "./operations";
import { toString } from "../string";
import { isNullOrUndefined } from "../is";

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
 * getRelativeTime(date, { variant: "short" }) // "5D ago", "13H ago", "2M ago", "15m ago", "10s ago"
 * getRelativeTime(date, { variant: "abbreviation" }) // "5D", "13H", "2M", "15m", "10s"
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
    variant = "standard",
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

  const direction = isFuture ? "from now" : "ago";

  if (variant === "short" || variant === "abbreviation") {
    // Abbreviated format mapping
    const abbreviations: Record<string, string> = {
      second: "s",
      minute: "m",
      hour: "H",
      day: "D",
      week: "W",
      month: "M",
      year: "Y",
    };
    const unitKey = selectedUnit.key;
    const abbreviation =
      unitKey && abbreviations[unitKey]
        ? abbreviations[unitKey]
        : unitKey
        ? unitKey[0].toUpperCase()
        : "?";

    if (variant === "abbreviation") {
      return `${value}${abbreviation}`;
    }

    return `${value}${abbreviation} ${direction}`;
  }

  // Standard format
  const unitLabel = value === 1 ? selectedUnit.name : selectedUnit.plural;
  return `${value} ${unitLabel} ${direction}`;
}

/**
 * Formats a date value to a specified format string, avoiding timezone conversions.
 * This function handles date-only formatting and ensures dates are not shifted due to timezone issues.
 *
 * Supports format patterns:
 * - YYYY: 4-digit year
 * - YY: 2-digit year
 * - MM: 2-digit month (01-12)
 * - M: Month without leading zero (1-12)
 * - DD: 2-digit day (01-31)
 * - D: Day without leading zero (1-31)
 *
 * Common format examples:
 * - "YYYY-MM-DD": 2024-01-15
 * - "M/d/y": 1/15/24
 * - "M/d/YYYY": 1/15/2024
 * - "DD/MM/YYYY": 15/01/2024
 *
 * @param value - Date value to format (string in YYYY-MM-DD format, Date object, number timestamp, or year-only string/number)
 * @param format - Output format string (default: "YYYY-MM-DD")
 * @param defaultValue - Default value to return if conversion fails (default: null)
 * @returns Formatted date string, or the default value if conversion fails
 *
 * @example
 * ```ts
 * formatDate("2024-01-15", "M/d/y") // "1/15/24"
 * formatDate("2024-01-15", "YYYY-MM-DD") // "2024-01-15"
 * formatDate("2024", "M/d/YYYY") // "1/1/2024" (year-only becomes Jan 1st)
 * formatDate(2024, "YYYY-MM-DD") // "2024-01-01" (year-only becomes Jan 1st)
 * formatDate(new Date(2024, 0, 15), "M/d/y") // "1/15/24"
 * ```
 */
export function formatDate<T extends string | null | undefined>(
  value: unknown,
  format: string = "YYYY-MM-DD",
  defaultValue: T = null as T
): string | T {
  if (isNullOrUndefined(value)) return defaultValue;

  let year: number;
  let month: number;
  let day: number;

  // Handle year-only input (string or number)
  if (typeof value === "number" && value >= 1000 && value <= 9999) {
    // Treat 4-digit numbers as years
    year = value;
    month = 1;
    day = 1;
  } else if (typeof value === "string") {
    const str = value.trim();

    // Check if it's just a year (4 digits)
    if (/^\d{4}$/.test(str)) {
      year = parseInt(str, 10);
      month = 1;
      day = 1;
    } else if (DATE_REGEX.test(str)) {
      // Handle YYYY-MM-DD format
      if (!isValidDateString(str)) {
        return defaultValue;
      }
      const match = str.match(DATE_REGEX);
      if (!match) return defaultValue;
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      day = parseInt(match[3], 10);
    } else {
      // Try to parse as Date object, but extract local date components
      const date = toDate(value, null);
      if (date === null) return defaultValue;
      // Use local date methods to avoid timezone issues
      year = date.getFullYear();
      month = date.getMonth() + 1; // getMonth() returns 0-11
      day = date.getDate();
    }
  } else if (value instanceof Date) {
    // Use local date methods to avoid timezone issues
    if (isNaN(value.getTime())) return defaultValue;
    year = value.getFullYear();
    month = value.getMonth() + 1; // getMonth() returns 0-11
    day = value.getDate();
  } else {
    // Try to convert to Date and extract local components
    const date = toDate(value, null);
    if (date === null) return defaultValue;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  }

  // Validate the date components
  if (
    year < 1 ||
    year > 9999 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return defaultValue;
  }

  // Create a local date to validate it's a real date
  const localDate = new Date(year, month - 1, day);
  if (
    localDate.getFullYear() !== year ||
    localDate.getMonth() !== month - 1 ||
    localDate.getDate() !== day
  ) {
    return defaultValue;
  }

  // Format the date according to the format string
  // Process from longest patterns to shortest to avoid partial matches
  // Support both uppercase and lowercase format patterns
  let result = format;

  const year4 = year.toString().padStart(4, "0");
  const year2 = (year % 100).toString().padStart(2, "0");
  const month2 = month.toString().padStart(2, "0");
  const month1 = month.toString();
  const day2 = day.toString().padStart(2, "0");
  const day1 = day.toString();

  // Replace YYYY/yyyy with 4-digit year (must be before YY/yy)
  result = result.replace(/YYYY/gi, year4);

  // Replace MM/mm with 2-digit month (must be before M/m)
  result = result.replace(/MM/gi, month2);

  // Replace DD/dd with 2-digit day (must be before D/d)
  result = result.replace(/DD/gi, day2);

  // Replace YY/yy with 2-digit year (after YYYY/yyyy to avoid conflicts)
  result = result.replace(/YY/gi, year2);

  // Process character by character to handle single M/m, D/d, and Y/y correctly
  let output = "";
  let i = 0;
  while (i < result.length) {
    const char = result[i];
    const prevChar = i > 0 ? result[i - 1] : "";
    const nextChar = i < result.length - 1 ? result[i + 1] : "";

    // Handle single M or m (not part of MM/mm)
    if (
      (char === "M" || char === "m") &&
      prevChar.toLowerCase() !== "m" &&
      nextChar.toLowerCase() !== "m"
    ) {
      output += month1;
      i++;
    }
    // Handle single D or d (not part of DD/dd)
    else if (
      (char === "D" || char === "d") &&
      prevChar.toLowerCase() !== "d" &&
      nextChar.toLowerCase() !== "d"
    ) {
      output += day1;
      i++;
    }
    // Handle single Y or y (not part of YY/yy or YYYY/yyyy)
    else if (
      (char === "Y" || char === "y") &&
      prevChar.toLowerCase() !== "y" &&
      nextChar.toLowerCase() !== "y"
    ) {
      // Single Y/y should be treated as 2-digit year
      output += year2;
      i++;
    } else {
      output += char;
      i++;
    }
  }

  return output;
}
