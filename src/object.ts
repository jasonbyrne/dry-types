import { isObject } from "./is";

// is* functions moved to ./is.ts

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
  // For other types, wrap in an object
  return { value };
}

/**
 * Checks if an object has a property
 * @param obj - The object to check
 * @param key - The property key to check for
 * @returns True if the object has the property
 */
export function hasProperty(obj: unknown, key: string | number | symbol): boolean {
  if (!isObject(obj)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Safely gets a property from an object with a default value
 * @param obj - The object to get the property from
 * @param key - The property key to get
 * @param defaultValue - The default value to return if property doesn't exist (default: undefined)
 * @returns The property value or the default value
 */
export function getProperty<T, K extends string | number | symbol, D = undefined>(
  obj: T,
  key: K,
  defaultValue?: D
): unknown {
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

