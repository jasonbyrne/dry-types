import { toString } from "./string";
import { toNumber } from "./number";
import { isUndefined, isArray, isNumber } from "./is";
import { toISODateString } from "./date";

/**
 * Array manipulation and conversion utilities
 *
 * This module provides functions for:
 * - Converting values to arrays
 * - Array transformations (flattening, sorting, grouping)
 * - Array statistics (average, min, max, sum)
 * - Array filtering and searching
 * - Array shuffling and random selection
 */

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
  let sum = 0;
  let count = 0;
  for (const item of array) {
    const num = toNumber(item, null);
    if (isNumber(num)) {
      sum += num;
      count++;
    }
  }
  if (count === 0) return 0;
  return sum / count;
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
  let max: number | undefined = undefined;
  for (const item of array) {
    const num = toNumber(item, null);
    if (isNumber(num)) {
      if (max === undefined || num > max) {
        max = num;
      }
    }
  }
  return max;
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
  let min: number | undefined = undefined;
  for (const item of array) {
    const num = toNumber(item, null);
    if (isNumber(num)) {
      if (min === undefined || num < min) {
        min = num;
      }
    }
  }
  return min;
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

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Returns a new shuffled array (does not mutate the original)
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(array: T[] | undefined | null): T[] {
  if (!isArray(array) || array.length === 0) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Splits an array into chunks of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns An array of chunks
 */
export function chunkArray<T>(
  array: T[] | undefined | null,
  size: number
): T[][] {
  if (!isArray(array) || array.length === 0) return [];
  if (size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Groups array elements by a key function
 * @param array - The array to group
 * @param keyFn - Function that returns the key for each element
 * @returns An object with keys as group names and values as arrays of elements
 */
export function groupBy<T, K extends string | number | symbol>(
  array: T[] | undefined | null,
  keyFn: (item: T) => K
): Record<K, T[]> {
  if (!isArray(array)) return {} as Record<K, T[]>;
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * Partitions an array into two arrays based on a predicate
 * @param array - The array to partition
 * @param predicate - Function that returns true for items in the first partition
 * @returns A tuple with [items that match predicate, items that don't match]
 */
export function partition<T>(
  array: T[] | undefined | null,
  predicate: (item: T) => boolean
): [T[], T[]] {
  if (!isArray(array)) return [[], []];
  const truthy: T[] = [];
  const falsy: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
}

/**
 * Removes falsy values from an array (null, undefined, false, 0, "", NaN)
 * @param array - The array to compact
 * @returns A new array with falsy values removed
 */
export function compact<T>(
  array:
    | (T | null | undefined | false | 0 | "" | typeof NaN)[]
    | undefined
    | null
): T[] {
  if (!isArray(array)) return [];
  return array.filter((item): item is T => Boolean(item));
}

/**
 * Gets the intersection of two arrays (elements present in both)
 * @param array1 - First array
 * @param array2 - Second array
 * @returns A new array with elements present in both arrays
 */
export function intersection<T>(
  array1: T[] | undefined | null,
  array2: T[] | undefined | null
): T[] {
  if (!isArray(array1) || !isArray(array2)) return [];
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}

/**
 * Gets the difference between two arrays (elements in first but not in second)
 * @param array1 - First array
 * @param array2 - Second array
 * @returns A new array with elements in first array but not in second
 */
export function difference<T>(
  array1: T[] | undefined | null,
  array2: T[] | undefined | null
): T[] {
  if (!isArray(array1)) return [];
  if (!isArray(array2)) return [...array1];
  const set2 = new Set(array2);
  return array1.filter((item) => !set2.has(item));
}

/**
 * Gets the union of two arrays (combines and removes duplicates)
 * @param array1 - First array
 * @param array2 - Second array
 * @returns A new array with unique elements from both arrays
 */
export function union<T>(
  array1: T[] | undefined | null,
  array2: T[] | undefined | null
): T[] {
  if (!isArray(array1) && !isArray(array2)) return [];
  if (!isArray(array1)) return [...new Set(array2)];
  if (!isArray(array2)) return [...new Set(array1)];
  return [...new Set([...array1, ...array2])];
}

/**
 * Gets a random sample of elements from an array
 * @param array - The array to sample from
 * @param count - Number of elements to sample (default: 1)
 * @returns An array of sampled elements
 */
export function sample<T>(
  array: T[] | undefined | null,
  count: number = 1
): T[] {
  if (!isArray(array) || array.length === 0 || count <= 0) return [];
  if (count >= array.length) return shuffleArray(array);
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

/**
 * Gets a random element from an array
 * @param array - The array to sample from
 * @param defaultValue - Default value if array is empty (default: undefined)
 * @returns A random element or the default value
 */
export function sampleOne<T, D = undefined>(
  array: T[] | undefined | null,
  defaultValue?: D
): T | D | undefined {
  if (!isArray(array) || array.length === 0)
    return defaultValue as D | undefined;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Sorts an array based on the provided options
 * Returns a new sorted array (does not mutate the original)
 * @param array - The array to sort
 * @param opts - Sorting options
 * @param opts.method - Sort direction: "asc" (ascending) or "desc" (descending)
 * @param opts.key - Optional function to extract the value to sort by
 * @param opts.format - Type of data to sort: "string", "number", or "date"
 * @returns A new sorted array
 */
export function sortArray<T>(
  array: T[] | undefined | null,
  opts: {
    method: "asc" | "desc";
    key?: (item: T) => unknown;
    format: "string" | "number" | "date";
  } = {
    method: "asc",
    format: "string",
  }
): T[] {
  if (!isArray(array) || array.length === 0) return [];
  const { method, key, format } = opts;

  // Create a copy to avoid mutating the original
  const sorted = [...array];

  return sorted.sort((a, b) => {
    // Extract values using key function if provided
    let aVal = key ? key(a) : a;
    let bVal = key ? key(b) : b;

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1; // null/undefined goes to end
    if (bVal == null) return -1;

    // Convert dates to strings if format is "date"
    if (format === "date") {
      const aStr = toISODateString(aVal, String(aVal));
      const bStr = toISODateString(bVal, String(bVal));
      // Sort as strings
      const comparison = String(aStr).localeCompare(String(bStr));
      return method === "asc" ? comparison : -comparison;
    }

    let comparison = 0;

    if (format === "string") {
      const aStr = String(aVal);
      const bStr = String(bVal);
      comparison = aStr.localeCompare(bStr);
    } else if (format === "number") {
      const aNum = toNumber(aVal, 0);
      const bNum = toNumber(bVal, 0);
      comparison = aNum - bNum;
    }

    return method === "asc" ? comparison : -comparison;
  });
}
