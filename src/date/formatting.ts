/**
 * Date formatting utilities
 * 
 * Functions for formatting dates into human-readable strings
 */

import { toDate } from "./conversion";
import { RelativeTimeOptions } from "./constants";
import { getMonthsBetween, getYearsBetween } from "./operations";

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

