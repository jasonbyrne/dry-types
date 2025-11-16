/**
 * Date validation utilities
 * 
 * Functions for checking date relationships and validations
 */

import { toDate, toDateString } from "./conversion";
import { getStartOfDay, getEndOfDay } from "./getters";

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

