import { isObject, isPlainObject, isArray } from "./is";

/**
 * Object manipulation and conversion utilities
 *
 * This module provides functions for:
 * - Converting values to objects
 * - Object transformations (picking, omitting keys)
 * - Object merging and deep operations
 */

/**
 * Converts a value to an object
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: {})
 * @returns An object representation of the value, or the default value
 */
export function toObject<T extends Record<string, unknown> | undefined | null>(
  value: unknown,
  defaultValue: T = {} as T
): Record<string, unknown> | T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (isObject(value)) {
    return value;
  }
  // Wrap primitives in an object with a 'value' key
  return { value };
}

/**
 * Converts a value to a plain object (not array, Date, RegExp, etc.)
 * Only returns the value if it's a plain object, otherwise returns the default value
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is not a plain object (default: {})
 * @returns A plain object representation of the value, or the default value
 * @example
 * ```ts
 * toPlainObject({ a: 1 }) // { a: 1 }
 * toPlainObject(new Date()) // {} (Date is not a plain object)
 * toPlainObject([1, 2, 3]) // {} (Array is not a plain object)
 * ```
 */
export function toPlainObject<
  T extends Record<string, unknown> | undefined | null
>(value: unknown, defaultValue: T = {} as T): Record<string, unknown> | T {
  return isPlainObject(value) ? value : defaultValue;
}

/**
 * Checks if an object has a property
 * @param obj - The object to check
 * @param key - The property key to check for
 * @returns True if the object has the property
 */
export function hasProperty(
  obj: unknown,
  key: string | number | symbol
): boolean {
  return isPlainObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Safely gets a property from an object with a default value
 * Returns the property value if it exists, otherwise returns the default value
 *
 * @param obj - The object to get the property from
 * @param key - The property key to get (string, number, or symbol)
 * @param defaultValue - The default value to return if property doesn't exist (default: undefined)
 * @returns The property value or the default value
 *
 * @example
 * ```ts
 * const obj = { name: "John", age: 30 };
 * getProperty(obj, "name") // "John"
 * getProperty(obj, "email", "unknown") // "unknown"
 * getProperty(obj, "email") // undefined
 * ```
 */
export function getProperty<
  T,
  K extends string | number | symbol,
  D = undefined
>(obj: T, key: K, defaultValue?: D): unknown {
  if (!isObject(obj)) {
    return defaultValue;
  }
  if (hasProperty(obj, key)) {
    return (obj as Record<string | number | symbol, unknown>)[key];
  }
  return defaultValue;
}

/**
 * Gets object keys as an array
 * @param obj - The object to get keys from
 * @returns An array of object keys
 */
export function toKeysArray(obj: unknown): string[] {
  if (!isObject(obj)) {
    return [];
  }
  return Object.keys(obj);
}

/**
 * Gets object values as an array
 * @param obj - The object to get values from
 * @returns An array of object values
 */
export function toValuesArray(obj: unknown): unknown[] {
  if (!isObject(obj)) {
    return [];
  }
  return Object.values(obj);
}

/**
 * Strips undefined values from an object, array, or nested structures
 * Recursively processes nested objects and arrays, removing undefined values
 * @param obj - The object, array, or value to strip undefined values from
 * @returns A new object/array with undefined values removed recursively
 * @example
 * ```ts
 * stripUndefined({ a: 1, b: undefined, c: { d: 2, e: undefined } })
 * // { a: 1, c: { d: 2 } }
 * stripUndefined([1, undefined, 2, { a: 3, b: undefined }])
 * // [1, 2, { a: 3 }]
 * ```
 */
export function stripUndefined<T>(obj: T): T {
  // Handle null or undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays - recursively process and filter out undefined
  if (isArray(obj)) {
    return obj
      .map((item) => stripUndefined(item))
      .filter((item) => item !== undefined) as T;
  }

  // Handle plain objects - recursively process values
  if (isPlainObject(obj)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = stripUndefined(value);
      }
    }
    return result as T;
  }

  // For other types (primitives, Date, RegExp, etc.), return as-is
  return obj;
}
