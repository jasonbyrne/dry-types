import { toString } from "./string";
import { isNullOrUndefined, isNumber, isInteger } from "./is";
import { NumberConstraint, SignDisplay } from "./generics";

/**
 * Number manipulation and conversion utilities
 *
 * This module provides functions for:
 * - Converting values to numbers with type safety
 * - Number formatting and localization
 * - Mathematical operations (rounding, clamping, etc.)
 * - Number range generation
 */

export interface NumberStringOptions {
  /**
   * Locale to use for formatting (e.g., "en-US", "de-DE", "fr-FR")
   * @default "en-US"
   */
  locale?: Intl.LocalesArgument;

  /**
   * Maximum number of decimal places to display
   * Maps to Intl.NumberFormat's maximumFractionDigits
   */
  maxDecimalPlaces?: number;

  /**
   * Minimum number of decimal places to display (pads with zeros)
   * Maps to Intl.NumberFormat's minimumFractionDigits
   * @default 0
   */
  minDecimalPlaces?: number;

  /**
   * Constraint on which values are allowed
   * @default "all"
   */
  constraint?: NumberConstraint;

  /**
   * How to display signs
   * @default "auto"
   */
  signDisplay?: SignDisplay;

  /**
   * Value to return for null/undefined/invalid inputs
   * @default ""
   */
  nullValue?: string;

  /**
   * Additional Intl.NumberFormat options (can include style: "currency", etc.)
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
 * @param defaultValue - The default value to return if conversion fails (default: 0)
 * @returns An integer (rounded to nearest), or the default value if conversion fails
 *
 * @example
 * ```ts
 * toInteger(123) // 123
 * toInteger(3.14) // 3
 * toInteger(3.5) // 4
 * toInteger("123") // 123
 * toInteger("3.14") // 3
 * toInteger(null) // 0
 * toInteger(null, 100) // 100
 * ```
 */
export function toInteger<T extends number | undefined | null>(
  value: unknown,
  defaultValue: T = 0 as T
): T | number {
  const num = toNumber(value, null);
  if (num === null) return defaultValue;
  return Math.round(num);
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
 * Rounds a number to the nearest multiple of a divisor
 * @param value - The value to round
 * @param divisor - The divisor to round to (must be positive and finite)
 * @returns The rounded number, or 0 if conversion fails or divisor is invalid
 *
 * @example
 * ```ts
 * roundToNearest(1234.56, 10) // 1230
 * roundToNearest(1234.56, 100) // 1200
 * roundToNearest(1234.56, 1000) // 1000
 * roundToNearest(1234.56, 0.5) // 1234.5
 * roundToNearest(1234.21, 0.25) // 1234.25
 * roundToNearest(1237, 5) // 1235
 * ```
 */
export function roundToNearest(value: unknown, divisor: number): number {
  const num = toNumber(value, null);
  if (num === null) return 0;

  // Validate divisor: must be a positive, finite number
  if (!isNumber(divisor) || divisor <= 0 || !isFinite(divisor)) {
    return 0;
  }

  return Math.round(num / divisor) * divisor;
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
 * Checks if a number meets the specified constraint
 */
function meetsConstraint(num: number, constraint?: NumberConstraint): boolean {
  if (!constraint) return true;
  switch (constraint) {
    case "positive-only":
      return num > 0;
    case "negative-only":
      return num < 0;
    case "non-negative":
      return num >= 0;
    case "non-positive":
      return num <= 0;
    case "non-zero":
      return num !== 0;
    case "zero-only":
      return num === 0;
    default:
      return true;
  }
}

/**
 * Converts a number (or number-like value) into a formatted string using Intl.NumberFormat.
 *
 * @param value - The value to format (number, string, etc.)
 * @param opts - Formatting options
 * @returns Formatted number string, or nullValue/empty string if value is invalid or doesn't meet constraints
 *
 * @example
 * ```ts
 * // Basic formatting
 * toNumberString(1234.56) // "1,234.56"
 * toNumberString(1234.5, { minDecimalPlaces: 2 }) // "1,234.50"
 * toNumberString(1234.567, { maxDecimalPlaces: 2 }) // "1,234.57"
 *
 * // Locale-aware formatting
 * toNumberString(1234.56, { locale: "de-DE" }) // "1.234,56"
 *
 * // Constraints
 * toNumberString(-100, { constraint: "non-negative" }) // ""
 * toNumberString(0, { constraint: "non-zero" }) // ""
 *
 * // Sign display
 * toNumberString(100, { signDisplay: "always" }) // "+100"
 * toNumberString(-100, { signDisplay: "parentheses" }) // "(100)"
 *
 * // Integer formatting
 * toNumberString(1234, { maxDecimalPlaces: 0 }) // "1,234"
 * ```
 */
export function toNumberString(
  value: unknown,
  opts: NumberStringOptions = {}
): string {
  const nullValue = opts.nullValue ?? "";
  // Convert to number, it already handles null/undefined/NaN/Infinity
  const num = toNumber(value, null);
  if (num === null) return nullValue;
  if (!meetsConstraint(num, opts.constraint)) return nullValue;

  // Default options
  const locale = opts.locale ?? "en-US";
  const signDisplay = opts.signDisplay ?? "auto";
  // Create number format options
  const intlOptions: Intl.NumberFormatOptions = {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: opts.minDecimalPlaces ?? 0,
    maximumFractionDigits: opts.maxDecimalPlaces ?? 20,
    ...opts.intlOptions,
  };

  // Handle sign display
  if (signDisplay === "parentheses") {
    // For parentheses, we'll format normally and post-process
    intlOptions.signDisplay = "auto";
  } else {
    // Map our SignDisplay to Intl's signDisplay
    if (
      signDisplay === "always" ||
      signDisplay === "exceptZero" ||
      signDisplay === "never"
    ) {
      intlOptions.signDisplay = signDisplay;
    } else {
      // "auto" or "negative" both map to "auto"
      intlOptions.signDisplay = "auto";
    }
  }

  try {
    let formatted = new Intl.NumberFormat(locale, intlOptions).format(num);

    // Post-process for parentheses display
    if (signDisplay === "parentheses" && num < 0) {
      // Check if Intl already formatted with parentheses (e.g., currencySign: "accounting")
      // If it already starts with "(" and ends with ")", don't add another set
      if (formatted.startsWith("(") && formatted.endsWith(")")) {
        // Already has parentheses, do nothing
      } else {
        // Remove the negative sign and wrap in parentheses
        formatted = `(${formatted.replace(/^-/, "")})`;
      }
    }

    return formatted;
  } catch (error) {
    // Return nullValue if formatting fails
    return nullValue;
  }
}
