import { toString } from "./string";
import { isNullOrUndefined, isNumber, isInteger } from "./is";

/**
 * Number manipulation and conversion utilities
 *
 * This module provides functions for:
 * - Converting values to numbers with type safety
 * - Number formatting and localization
 * - Mathematical operations (rounding, clamping, etc.)
 * - Number range generation
 */

export interface NumberFormatOptions {
  /**
   * Locale to use for formatting (e.g., "en-US", "de-DE", "fr-FR")
   * When provided, uses Intl.NumberFormat for locale-aware formatting
   * @default "en-US"
   */
  locale?: Intl.LocalesArgument;

  /**
   * Thousands separator character
   * If not provided, will be determined from locale or default to ","
   * @default ","
   */
  thousandSeparator?: string;

  /**
   * Decimal separator character
   * If not provided, will be determined from locale or default to "."
   * @default "."
   */
  decimalSeparator?: string;

  /**
   * Maximum number of decimal places to display
   * @default undefined (no limit, but will remove trailing zeros if minDecimalPlaces is not set)
   */
  maxDecimalPlaces?: number;

  /**
   * Minimum number of decimal places to display (pads with zeros)
   * @default 0
   */
  minDecimalPlaces?: number;

  /**
   * Whether to allow negative numbers
   * If false, negative numbers will return empty string
   * @default true
   */
  allowNegative?: boolean;

  /**
   * Whether to allow positive numbers
   * If false, positive numbers will return empty string
   * @default true
   */
  allowPositive?: boolean;

  /**
   * Whether to allow zero
   * If false, zero will return empty string
   * @default true
   */
  allowZero?: boolean;

  /**
   * Use Intl.NumberFormat for locale-aware formatting
   * When true, thousandSeparator and decimalSeparator are ignored (use locale defaults)
   * @default false (uses manual formatting for more control)
   */
  useLocaleFormatting?: boolean;

  /**
   * Additional Intl.NumberFormat options (only used when useLocaleFormatting is true)
   */
  intlOptions?: Intl.NumberFormatOptions;
}

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

/**
 * Rounds a number to a specified precision
 * @param value - The value to round
 * @param precision - The number of decimal places (default: 0)
 * @returns The rounded number, or 0 if conversion fails
 */
export function round(value: unknown, precision: number = 0): number {
  const num = toNumber(value, null);
  if (num === null) return 0;
  const multiplier = Math.pow(10, precision);
  return Math.round(num * multiplier) / multiplier;
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
  const multiplier = Math.pow(10, precision);
  return Math.floor(num * multiplier) / multiplier;
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
  const multiplier = Math.pow(10, precision);
  return Math.ceil(num * multiplier) / multiplier;
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
export function getNumbersBetween(
  min: number,
  max: number,
  step: number = 1
): number[] {
  const numbers = [];
  for (let i = min; i <= max; i += step) {
    numbers.push(i);
  }
  return numbers;
}

/**
 * Formats a number (or number-like value) into a readable string with thousands separators,
 * decimal places, and other formatting options.
 *
 * @param value - The value to format (number, string, etc.)
 * @param opts - Formatting options
 * @returns Formatted number string, or empty string if value is invalid or doesn't meet constraints
 *
 * @example
 * ```ts
 * // Basic formatting
 * formatNumber(1234.56) // "1,234.56"
 * formatNumber(1234.5, { minDecimalPlaces: 2 }) // "1,234.50"
 * formatNumber(1234.567, { maxDecimalPlaces: 2 }) // "1,234.57"
 *
 * // Custom separators
 * formatNumber(1234.56, { thousandSeparator: ".", decimalSeparator: "," }) // "1.234,56"
 *
 * // Locale-aware formatting
 * formatNumber(1234.56, { useLocaleFormatting: true, locale: "de-DE" }) // "1.234,56"
 *
 * // Constraints
 * formatNumber(-100, { allowNegative: false }) // ""
 * formatNumber(0, { allowZero: false }) // ""
 *
 * // Integer formatting
 * formatNumber(1234, { maxDecimalPlaces: 0 }) // "1,234"
 * ```
 */
export function formatNumber(
  value: unknown,
  opts: NumberFormatOptions = {}
): string {
  // Convert to number
  const num = toNumber(value, null);
  if (num === null) return "";

  // Check for NaN or Infinity
  if (isNaN(num) || !isFinite(num)) return "";

  // Apply constraints
  const { allowNegative = true, allowPositive = true, allowZero = true } = opts;

  if (!allowNegative && num < 0) return "";
  if (!allowPositive && num > 0) return "";
  if (!allowZero && num === 0) return "";

  // Use locale formatting if requested
  if (opts.useLocaleFormatting) {
    return formatWithIntl(num, opts);
  }

  // Manual formatting for more control
  return formatManually(num, opts);
}

/**
 * Formats a number using Intl.NumberFormat (locale-aware)
 */
function formatWithIntl(num: number, opts: NumberFormatOptions): string {
  const {
    locale = "en-US",
    maxDecimalPlaces,
    minDecimalPlaces,
    intlOptions = {},
  } = opts;

  const formatOptions: Intl.NumberFormatOptions = {
    ...intlOptions,
    style: intlOptions.style || "decimal",
  };

  // Handle decimal places
  if (maxDecimalPlaces !== undefined || minDecimalPlaces !== undefined) {
    formatOptions.minimumFractionDigits = minDecimalPlaces ?? 0;
    formatOptions.maximumFractionDigits = maxDecimalPlaces ?? 20;
  }

  try {
    return new Intl.NumberFormat(locale, formatOptions).format(num);
  } catch (error) {
    // Fallback to manual formatting if locale is invalid
    return formatManually(num, opts);
  }
}

/**
 * Formats a number manually with custom separators
 */
function formatManually(num: number, opts: NumberFormatOptions): string {
  const {
    thousandSeparator = ",",
    decimalSeparator = ".",
    maxDecimalPlaces,
    minDecimalPlaces = 0,
  } = opts;

  // Handle rounding and decimal places
  // Use toFixed for better precision when maxDecimalPlaces is specified
  let roundedNum = num;
  let numStr: string;

  if (maxDecimalPlaces !== undefined) {
    roundedNum = round(num, maxDecimalPlaces);
    // Use toFixed to ensure proper decimal representation
    numStr = Math.abs(roundedNum).toFixed(maxDecimalPlaces);
  } else {
    numStr = Math.abs(roundedNum).toString();
  }

  // Split into integer and decimal parts
  const isNegative = roundedNum < 0;
  const parts = numStr.split(".");
  let integerPart = parts[0] || "0";
  let decimalPart = parts[1] || "";

  // Remove trailing zeros if we used toFixed (unless minDecimalPlaces requires them)
  if (maxDecimalPlaces !== undefined && minDecimalPlaces === 0) {
    decimalPart = decimalPart.replace(/0+$/, "");
  }

  // Apply min decimal places (pad with zeros)
  if (minDecimalPlaces > 0) {
    if (decimalPart.length < minDecimalPlaces) {
      decimalPart = decimalPart.padEnd(minDecimalPlaces, "0");
    }
  } else if (maxDecimalPlaces === undefined) {
    // Remove trailing zeros if no minDecimalPlaces and no maxDecimalPlaces
    decimalPart = decimalPart.replace(/0+$/, "");
  }

  // Add thousands separators to integer part
  integerPart = addThousandsSeparator(integerPart, thousandSeparator);

  // Combine parts
  let result = integerPart;
  if (decimalPart || minDecimalPlaces > 0) {
    result += decimalSeparator + decimalPart;
  }

  // Add negative sign
  if (isNegative) {
    result = "-" + result;
  }

  return result;
}

/**
 * Adds thousands separators to an integer string
 */
function addThousandsSeparator(integerPart: string, separator: string): string {
  // Handle negative sign separately
  const isNegative = integerPart.startsWith("-");
  const digits = isNegative ? integerPart.slice(1) : integerPart;

  // Add separators from right to left
  let result = "";
  for (let i = digits.length - 1; i >= 0; i--) {
    const pos = digits.length - 1 - i;
    if (pos > 0 && pos % 3 === 0) {
      result = separator + result;
    }
    result = digits[i] + result;
  }

  return isNegative ? "-" + result : result;
}
