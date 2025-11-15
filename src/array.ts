import { toString } from "./string";
import { toNumber } from "./number";
import { isUndefined, isArray, isNumber } from "./is";

// is* functions moved to ./is.ts

/**
 * Converts a value to an array
 * If the value is undefined, returns the default value
 * If the value is already an array, returns it as-is
 * Otherwise, wraps the value in an array
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is undefined (default: [])
 * @returns An array containing the value, or the default value
 */
export function toArray<T extends any[] | undefined | null>(
  value: unknown,
  defaultValue: T = [] as unknown as T
): T | any[] {
  if (isUndefined(value)) return defaultValue;
  if (isArray(value)) return value;
  return [value] as T;
}

/**
 * Converts a value to a unique array (removes duplicates)
 * If the value is undefined, returns the default value
 * If the value is already an array, returns a new array with unique values
 * Otherwise, wraps the value in an array
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is undefined (default: [])
 * @returns An array with unique values, or the default value
 */
export function toUniqueArray<T extends any[] | undefined | null>(
  value: unknown,
  defaultValue: T = [] as unknown as T
): T | any[] {
  if (isUndefined(value)) return defaultValue;
  if (isArray(value)) return [...new Set(value)];
  return [value] as T;
}

/**
 * Converts a value to an array of strings
 * If the value is undefined, returns the default value
 * If the value is already an array, converts each item to a string
 * Otherwise, wraps the value in an array after converting to string
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is undefined (default: [])
 * @returns An array of strings, or the default value
 */
export function toStringArray<T extends string[] | undefined | null>(
  value: unknown,
  defaultValue: T = [] as unknown as T
): T | string[] {
  if (isUndefined(value)) return defaultValue;
  if (isArray(value)) return value.map((item) => toString(item));
  return [toString(value)] as T;
}

/**
 * Converts a value to an array of numbers
 * If the value is undefined, returns the default value
 * If the value is already an array, converts each item to a number
 * Otherwise, wraps the value in an array after converting to number
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is undefined (default: [])
 * @returns An array of numbers, or the default value
 */
export function toNumberArray<T extends number[] | undefined | null>(
  value: unknown,
  defaultValue: T = [] as unknown as T
): T | number[] {
  if (isUndefined(value)) return defaultValue;
  if (isArray(value)) return value.map((item) => toNumber(item));
  return [toNumber(value)] as T;
}

// is* functions moved to ./is.ts

/**
 * Gets the first element of an array
 * @param array - The array to get the first element from
 * @param defaultValue - The default value to return if array is empty or undefined (default: undefined)
 * @returns The first element of the array, or the default value
 */
export function getFirst<T, D = undefined>(
  array: T[] | undefined | null,
  defaultValue?: D
): T | D | undefined {
  if (!isArray(array) || array.length === 0) {
    return defaultValue as D | undefined;
  }
  return array[0];
}

/**
 * Gets the last element of an array
 * @param array - The array to get the last element from
 * @param defaultValue - The default value to return if array is empty or undefined (default: undefined)
 * @returns The last element of the array, or the default value
 */
export function getLast<T, D = undefined>(
  array: T[] | undefined | null,
  defaultValue?: D
): T | D | undefined {
  if (!isArray(array) || array.length === 0) {
    return defaultValue as D | undefined;
  }
  return array[array.length - 1];
}

/**
 * Calculates the sum of an array of numbers
 * @param array - The array of numbers to sum
 * @returns The sum of all numbers in the array, or 0 if array is empty or invalid
 */
export function getSum(array: unknown[] | undefined | null): number {
  if (!isArray(array)) return 0;
  return array.reduce((sum: number, item) => {
    const num = toNumber(item, 0);
    return sum + num;
  }, 0);
}

/**
 * Calculates the average of an array of numbers
 * @param array - The array of numbers to average
 * @returns The average of all numbers in the array, or 0 if array is empty or invalid
 */
export function getAverage(array: unknown[] | undefined | null): number {
  if (!isArray(array) || array.length === 0) return 0;
  const numbers = array.map((item) => toNumber(item, null)).filter(isNumber);
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Gets the maximum value from an array
 * @param array - The array to find the maximum value from
 * @returns The maximum value, or undefined if array is empty or invalid
 */
export function getMax(
  array: unknown[] | undefined | null
): number | undefined {
  if (!isArray(array) || array.length === 0) return undefined;
  const numbers = array.map((item) => toNumber(item, null)).filter(isNumber);
  if (numbers.length === 0) return undefined;
  return Math.max(...numbers);
}

/**
 * Gets the minimum value from an array
 * @param array - The array to find the minimum value from
 * @returns The minimum value, or undefined if array is empty or invalid
 */
export function getMin(
  array: unknown[] | undefined | null
): number | undefined {
  if (!isArray(array) || array.length === 0) return undefined;
  const numbers = array.map((item) => toNumber(item, null)).filter(isNumber);
  if (numbers.length === 0) return undefined;
  return Math.min(...numbers);
}

/**
 * Flattens a nested array to a specified depth
 * @param array - The array to flatten
 * @param depth - The depth level to flatten to (default: Infinity)
 * @returns A new flattened array
 */
export function toFlattenedArray<T>(
  array: T[] | undefined | null,
  depth: number = Infinity
): any[] {
  if (!isArray(array)) return [];
  if (depth === 0) return array;
  return array.flat(depth) as any[];
}
