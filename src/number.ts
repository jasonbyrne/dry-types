import { toString } from "./string";
import { isNullOrUndefined, isNumber, isInteger } from "./is";

// is* functions moved to ./is.ts

/**
 * Converts a value to a number
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails (default: 0)
 * @returns A number, or the default value if conversion fails
 */
export function toNumber<T extends number | undefined | null>(
  value: unknown,
  defaultValue: T = 0 as T
): T | number {
  if (isNullOrUndefined(value)) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const parsed = parseFloat(toString(value));
  return isNaN(parsed) || !isFinite(parsed) ? defaultValue : parsed;
}

/**
 * Converts a value to an integer
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails or value is not an integer (default: 0)
 * @returns An integer, or the default value if conversion fails
 */
export function toInteger<T extends number | undefined | null>(
  value: unknown,
  defaultValue: T = 0 as T
): T | number {
  const num = toNumber(value, defaultValue);
  if (!isInteger(num)) return defaultValue;
  return num;
}

/**
 * Converts a value to a positive number
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails or value is not positive (default: 0)
 * @returns A positive number, or the default value if conversion fails or value is not positive
 */
export function toPositiveNumber<T extends number | undefined | null>(
  value: unknown,
  defaultValue: number = 0
): T | number {
  const num = toNumber(value, defaultValue);
  if (!isNumber(num)) return defaultValue;
  return num > 0 ? num : defaultValue;
}

/**
 * Converts a value to a non-negative number (zero or positive)
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails or value is negative (default: 0)
 * @returns A non-negative number, or the default value if conversion fails or value is negative
 */
export function toNonNegativeNumber<T extends number | undefined | null>(
  value: unknown,
  defaultValue: number = 0
): T | number {
  const num = toNumber(value, defaultValue);
  if (!isNumber(num)) return defaultValue;
  return num >= 0 ? num : defaultValue;
}

/**
 * Converts a value to a non-positive number (zero or negative)
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails or value is positive (default: 0)
 * @returns A non-positive number, or the default value if conversion fails or value is positive
 */
export function toNonPositiveNumber<T extends number | undefined | null>(
  value: unknown,
  defaultValue: number = 0
): T | number {
  const num = toNumber(value, defaultValue);
  if (!isNumber(num)) return defaultValue;
  return num <= 0 ? num : defaultValue;
}

/**
 * Converts a value to a negative number
 * @param value - The value to convert
 * @param defaultValue - The default value to return if conversion fails or value is not negative (default: 0)
 * @returns A negative number, or the default value if conversion fails or value is not negative
 */
export function toNegativeNumber<T extends number | undefined | null>(
  value: unknown,
  defaultValue: number = 0
): T | number {
  const num = toNumber(value, defaultValue);
  if (!isNumber(num)) return defaultValue;
  return num < 0 ? num : defaultValue;
}

/**
 * Clamps a number between a minimum and maximum value
 * @param value - The value to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped number (between min and max, inclusive)
 */
export function toClampedNumber(
  value: unknown,
  min: number,
  max: number
): number {
  const num = toNumber(value, min);
  return Math.max(min, Math.min(num, max));
}

// is* functions moved to ./is.ts

/**
 * Rounds a number to a specified precision
 * @param value - The value to round
 * @param precision - The number of decimal places (default: 0)
 * @returns The rounded number, or 0 if conversion fails
 */
export function round(value: unknown, precision: number = 0): number {
  const num = toNumber(value, null);
  if (num === null) return 0;
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Rounds a number down to a specified precision
 * @param value - The value to round down
 * @param precision - The number of decimal places (default: 0)
 * @returns The rounded down number, or 0 if conversion fails
 */
export function roundDown(value: unknown, precision: number = 0): number {
  const num = toNumber(value, null);
  if (num === null) return 0;
  return Math.floor(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Rounds a number up to a specified precision
 * @param value - The value to round up
 * @param precision - The number of decimal places (default: 0)
 * @returns The rounded up number, or 0 if conversion fails
 */
export function roundUp(value: unknown, precision: number = 0): number {
  const num = toNumber(value, null);
  if (num === null) return 0;
  return Math.ceil(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * Generates an array of numbers between min and max (inclusive) with a specified step
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @param step - The step size between numbers (default: 1)
 * @returns An array of numbers from min to max with the specified step
 * @example
 * ```ts
 * getNumbersBetween(1, 5) // [1, 2, 3, 4, 5]
 * getNumbersBetween(0, 10, 2) // [0, 2, 4, 6, 8, 10]
 * ```
 */
export const getNumbersBetween = (
  min: number,
  max: number,
  step: number = 1
): number[] => {
  const numbers = [];
  for (let i = min; i <= max; i += step) {
    numbers.push(i);
  }
  return numbers;
};
