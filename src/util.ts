import { JSONValue } from "./generics";
import { isNullOrUndefined } from "./is";
import { toString } from "./string";

/**
 * General utility functions
 *
 * This module provides:
 * - Type-safe conditional transformations
 * - Value coalescing and default handling
 * - JSON serialization/deserialization
 * - Async function utilities (debounce, defer)
 * - Deep equality comparison
 * - Unique ID generation
 */

/**
 * Type-safe conditional transformation: returns undefined if value is undefined,
 * otherwise transforms the value using the callback function.
 * @param value - The value to check and potentially transform
 * @param callback - Function to transform the value if it's not undefined
 * @returns The result of the callback function, or undefined
 */
export function ifDefined<Input, Output>(
  value: Input | undefined,
  callback: (value: Input) => Output
): Output | undefined {
  if (value === undefined) return undefined;
  return callback(value);
}

/**
 * Returns the first non-null, non-undefined value from the provided arguments
 * @param values - The values to check
 * @returns The first non-null, non-undefined value, or null if all values are null/undefined
 */
export function coalesce<T>(...values: T[]): T | null {
  return values.find((value) => !isNullOrUndefined(value)) ?? null;
}

/**
 * Gets the length of a value
 * For strings and arrays, returns their length
 * For objects, returns the number of keys
 * For numbers, returns the string representation length
 * For null/undefined, returns 0
 * @param value - The value to get the length of
 * @returns The length of the value, or 0 if not applicable
 */
export function toLength(value: unknown): number {
  if (isNullOrUndefined(value)) return 0;
  if (typeof value === "string") return value.length;
  if (typeof value === "object") return Object.keys(value).length;
  if (Array.isArray(value)) return value.length;
  if (typeof value === "number") return String(value).length;
  return 0;
}

/**
 * Converts a value to a boolean
 * - null/undefined: false
 * - boolean: returns as-is
 * - string: true if lowercase equals "true", otherwise false
 * - number: true if > 0, otherwise false
 * - other: false
 * @param value - The value to convert
 * @returns A boolean representation of the value
 */
export function toBoolean(value: unknown): boolean {
  if (isNullOrUndefined(value)) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value > 0;
  return false;
}

/**
 * Safely stringify a value to JSON
 * Returns the JSON string representation of the value, or the default value if stringification fails
 * @param value - The value to stringify
 * @param defaultValue - The default value to return if stringification fails
 * @returns The JSON string representation, or the default value
 */
export function toJsonString<T = string | null | undefined>(
  value: JSONValue,
  defaultValue: T = null as T
): JSONValue | T {
  try {
    const result = JSON.stringify(value);
    // JSON.stringify returns undefined for functions and undefined values
    if (result === undefined) {
      return defaultValue;
    }
    return result;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely parse a JSON string
 * Returns the parsed value, or the default value if parsing fails
 * @param value - The JSON string to parse
 * @param defaultValue - The default value to return if parsing fails
 * @returns The parsed value, or the default value
 */
export function toJsonValue<T>(
  value: unknown,
  defaultValue: T = null as T
): JSONValue | T {
  const jsonString = toString(value, null);
  if (jsonString === null) return defaultValue;
  try {
    const result = JSON.parse(jsonString);
    // JSON.parse returns undefined for functions and undefined values
    if (result === undefined) {
      return defaultValue;
    }
    return result as JSONValue | T;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Defers execution of a function by a specified delay
 * @param fn - The function to execute after the delay
 * @param delay - The delay in milliseconds (default: 100)
 * @returns The timeout ID that can be used to cancel the deferred execution
 * @example
 * ```ts
 * defer(() => console.log("Hello"), 1000) // Logs "Hello" after 1 second
 * ```
 */
export function defer(
  fn: () => Promise<void> | void,
  delay: number = 100
): ReturnType<typeof setTimeout> {
  return setTimeout(fn, delay);
}

/**
 * Debounces an async function, executing it only after the specified delay has passed since the last invocation.
 * All calls made within the debounce window will receive the same promise, ensuring only one execution occurs.
 *
 * @param func - The async function to debounce
 * @param delay - The delay in milliseconds before executing the function (default: 300)
 * @returns A debounced version of the function that returns a Promise
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce(async (query: string) => {
 *   return await fetch(`/api/search?q=${query}`);
 * }, 500);
 *
 * // Multiple rapid calls will only execute once after 500ms
 * debouncedSearch("test"); // Promise A
 * debouncedSearch("test2"); // Same Promise A (previous call cancelled)
 * debouncedSearch("test3"); // Same Promise A (previous call cancelled)
 * // After 500ms, only the last call executes and all promises resolve with its result
 * ```
 */
export function debounce<TArgs extends unknown[], TResult>(
  func: (...args: TArgs) => Promise<TResult>,
  delay = 300
): (...args: TArgs) => Promise<TResult> {
  let timeoutId: ReturnType<typeof setTimeout>;
  let pendingPromise: Promise<TResult> | null = null;
  let lastArgs: TArgs | null = null;
  let resolveCallbacks: Array<(value: TResult) => void> = [];
  let rejectCallbacks: Array<(error: unknown) => void> = [];

  // Function to execute the actual call
  const executeCall = async (): Promise<void> => {
    if (!lastArgs) {
      const error = new Error("No arguments provided for debounced function");
      rejectCallbacks.forEach((reject) => reject(error));
      resolveCallbacks = [];
      rejectCallbacks = [];
      pendingPromise = null;
      lastArgs = null;
      return;
    }

    const args = lastArgs;
    lastArgs = null;
    const resolvers = resolveCallbacks;
    const rejecters = rejectCallbacks;
    resolveCallbacks = [];
    rejectCallbacks = [];

    try {
      const result = await func(...args);
      resolvers.forEach((resolve) => resolve(result));
      pendingPromise = null;
    } catch (error) {
      rejecters.forEach((reject) => reject(error));
      pendingPromise = null;
    }
  };

  return (...args: TArgs): Promise<TResult> => {
    lastArgs = args;

    // Cancel any existing timeout
    clearTimeout(timeoutId);

    // Create a new promise for this call
    const callPromise = new Promise<TResult>((resolve, reject) => {
      resolveCallbacks.push(resolve);
      rejectCallbacks.push(reject);
    });

    // If there's no pending promise, set this as the pending promise
    if (!pendingPromise) {
      pendingPromise = callPromise;
    }

    // Set up the timeout to execute after delay
    timeoutId = setTimeout(() => {
      executeCall();
    }, delay);

    // Return the same promise for all calls within the debounce window
    return pendingPromise;
  };
}

/**
 * Generates a unique ID for form elements and other components
 * @param prefix - Optional prefix for the ID (e.g., 'input', 'select', 'textarea')
 * @returns A unique ID string
 */
export function generateUniqueId(prefix?: string): string {
  const randomId = Math.random().toString(36).slice(2, 11);
  return prefix ? `${prefix}-${randomId}` : randomId;
}

/**
 * Performs a deep equality comparison between two values, handling circular references
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @param aStack - Internal stack for tracking circular references in a (used recursively)
 * @param bStack - Internal stack for tracking circular references in b (used recursively)
 * @returns True if the values are deeply equal, false otherwise
 * @example
 * ```ts
 * deepEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) // true
 * deepEquals([1, 2, 3], [1, 2, 3]) // true
 * deepEquals(new Date("2024-01-01"), new Date("2024-01-01")) // true
 * ```
 */
export function deepEquals(
  a: unknown,
  b: unknown,
  aStack: unknown[] = [],
  bStack: unknown[] = []
): boolean {
  // Handle primitive types and null/undefined
  if (a === b) return true;
  if (a === null || b === null) return a === b;

  // Handle Date objects
  if (a instanceof Date || b instanceof Date) {
    if (!(a instanceof Date) || !(b instanceof Date)) return false;
    return a.getTime() === b.getTime();
  }

  if (typeof a !== "object" || typeof b !== "object") return a === b;

  // Handle arrays
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i], [...aStack, a], [...bStack, b])) return false;
    }
    return true;
  }

  // Handle circular references
  const aIndex = aStack.indexOf(a);
  const bIndex = bStack.indexOf(b);
  if (aIndex !== -1 || bIndex !== -1) {
    // If both are in the same position in their respective stacks, they have the same circular structure
    return aIndex === bIndex && aIndex !== -1;
  }

  // Add current objects to the stack
  aStack.push(a);
  bStack.push(b);

  // Get and sort keys
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  // Check if number of keys match
  if (aKeys.length !== bKeys.length) {
    aStack.pop();
    bStack.pop();
    return false;
  }

  // Check if all keys are the same
  for (let i = 0; i < aKeys.length; i++) {
    if (aKeys[i] !== bKeys[i]) {
      aStack.pop();
      bStack.pop();
      return false;
    }
  }

  // Check all values recursively
  for (const key of aKeys) {
    if (
      !deepEquals(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
        [...aStack],
        [...bStack]
      )
    ) {
      aStack.pop();
      bStack.pop();
      return false;
    }
  }

  // Clean up
  aStack.pop();
  bStack.pop();
  return true;
}
