// Utility is* functions
// Must be standalone functions to avoid circular dependencies

import { JSONValue } from "./generics";

/**
 * Checks if a value is null or undefined
 * @param value - The value to check
 * @returns True if the value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if a value is undefined
 * @param value - The value to check
 * @returns True if the value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Checks if a value is null
 * @param value - The value to check
 * @returns True if the value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if a value is empty
 * - null/undefined: true
 * - string: true if length is 0
 * - object: true if no keys
 * - array: true if length is 0
 * - other: false
 * @param value - The value to check
 * @returns True if the value is empty
 */
export function isEmpty(value: unknown): boolean {
  if (isNullOrUndefined(value)) return true;
  if (typeof value === "string") return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Checks if a value is falsy (converts to false when coerced to boolean)
 * @param value - The value to check
 * @returns True if the value is falsy
 */
export function isFalsy(value: unknown): boolean {
  return Boolean(value) === false;
}

/**
 * Checks if a value is truthy (converts to true when coerced to boolean)
 * @param value - The value to check
 * @returns True if the value is truthy
 */
export function isTruthy(value: unknown): boolean {
  return Boolean(value) === true;
}

/**
 * Checks if a value is exactly true (strict equality)
 * @param value - The value to check
 * @returns True if the value is exactly true
 */
export function isTrue(value: unknown): boolean {
  return value === true;
}

/**
 * Checks if a value is exactly false (strict equality)
 * @param value - The value to check
 * @returns True if the value is exactly false
 */
export function isFalse(value: unknown): boolean {
  return value === false;
}

/**
 * Checks if a value is a boolean
 * @param value - The value to check
 * @returns True if the value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Checks if a value is a function
 * @param value - The value to check
 * @returns True if the value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

/**
 * Checks if a value is a primitive type
 * Primitive types are: string, number, boolean, null, undefined, symbol, and bigint
 * @param value - The value to check
 * @returns True if the value is a primitive type
 */
export function isPrimitive(
  value: unknown
): value is string | number | boolean | null | undefined | symbol | bigint {
  if (value === null || value === undefined) return true;
  const type = typeof value;
  return ["string", "number", "boolean", "symbol", "bigint"].includes(type);
}

/**
 * Checks if a value is a Symbol
 * @param value - The value to check
 * @returns True if the value is a Symbol
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === "symbol";
}

// String is* functions
/**
 * Checks if a value is a string
 * @param value - The value to check
 * @returns True if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Checks if a value is a non-empty string (after trimming)
 * @param value - The value to check
 * @returns True if the value is a string with non-whitespace content
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

/**
 * Validates email format
 * @param value - The value to validate
 * @returns True if the value is a valid email format
 */
export function isEmail(value: unknown): boolean {
  if (!isString(value)) return false;
  // RFC 5322 compliant email regex (simplified but covers most cases)
  // Requires at least one dot in the domain part
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(value);
}

/**
 * Validates URL format
 * @param value - The value to validate
 * @returns True if the value is a valid URL format
 */
export function isUrl(value: unknown): boolean {
  if (!isString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates UUID format (supports all UUID versions)
 * @param value - The value to validate
 * @returns True if the value is a valid UUID format
 */
export function isUuid(value: unknown): boolean {
  if (!isString(value)) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Checks if string contains only numbers
 * @param value - The value to check
 * @returns True if the value is a string containing only numeric characters
 */
export function isNumericString(value: unknown): boolean {
  if (!isString(value)) return false;
  return /^\d+$/.test(value);
}

// Number is* functions
/**
 * Checks if a value is a valid number (not NaN and finite)
 * @param value - The value to check
 * @returns True if the value is a valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Checks if a value is an integer
 * @param value - The value to check
 * @returns True if the value is an integer
 */
export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * Checks if a value is a positive number
 * @param value - The value to check
 * @returns True if the value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

/**
 * Checks if a value is a negative number
 * @param value - The value to check
 * @returns True if the value is a negative number
 */
export function isNegativeNumber(value: unknown): value is number {
  return isNumber(value) && value < 0;
}

/**
 * Checks if a value is a non-negative number (zero or positive)
 * @param value - The value to check
 * @returns True if the value is a non-negative number
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return isNumber(value) && value >= 0;
}

/**
 * Checks if a value is a non-positive number (zero or negative)
 * @param value - The value to check
 * @returns True if the value is a non-positive number
 */
export function isNonPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value <= 0;
}

/**
 * Checks if a number is between two values (inclusive)
 * @param value - The value to check
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns True if the value is between min and max (inclusive)
 */
export function isNumberBetween(
  value: unknown,
  min: number,
  max: number
): boolean {
  if (!isNumber(value)) return false;
  return value >= min && value <= max;
}

/**
 * Checks if a number is greater than a minimum value
 * @param value - The value to check
 * @param min - The minimum value to compare against
 * @returns True if the value is greater than min
 */
export function isGreaterThan(value: unknown, min: number): boolean {
  if (!isNumber(value)) return false;
  return value > min;
}

/**
 * Checks if a number is greater than or equal to a minimum value
 * @param value - The value to check
 * @param min - The minimum value to compare against
 * @returns True if the value is greater than or equal to min
 */
export function isGreaterThanOrEqualTo(value: unknown, min: number): boolean {
  if (!isNumber(value)) return false;
  return value >= min;
}

/**
 * Checks if a number is less than a maximum value
 * @param value - The value to check
 * @param max - The maximum value to compare against
 * @returns True if the value is less than max
 */
export function isLessThan(value: unknown, max: number): boolean {
  if (!isNumber(value)) return false;
  return value < max;
}

/**
 * Checks if a number is less than or equal to a maximum value
 * @param value - The value to check
 * @param max - The maximum value to compare against
 * @returns True if the value is less than or equal to max
 */
export function isLessThanOrEqualTo(value: unknown, max: number): boolean {
  if (!isNumber(value)) return false;
  return value <= max;
}

// Array is* functions
/**
 * Checks if a value is an array
 * @param value - The value to check
 * @returns True if the value is an array
 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

/**
 * Checks if an array is empty
 * @param value - The value to check
 * @returns True if the value is an array and has no elements
 */
export function isEmptyArray(value: unknown): value is any[] {
  return isArray(value) && value.length === 0;
}

/**
 * Checks if an array has items (is not empty)
 * @param value - The value to check
 * @returns True if the value is an array and has at least one element
 */
export function isNonEmptyArray(value: unknown): value is any[] {
  return isArray(value) && value.length > 0;
}

// Object is* functions
/**
 * Checks if a value is an object (not null, not array)
 * @param value - The value to check
 * @returns True if the value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Checks if a value is a plain object (not array, Date, RegExp, etc.)
 * @param value - The value to check
 * @returns True if the value is a plain object
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // Check if it's an array
  if (Array.isArray(value)) {
    return false;
  }

  // Check if it's a Date, RegExp, or other built-in object types
  if (value instanceof Date || value instanceof RegExp) {
    return false;
  }

  // Check if the constructor is Object (plain object)
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Checks if an object has no keys
 * @param value - The value to check
 * @returns True if the object has no keys
 */
export function isEmptyObject(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }
  return Object.keys(value).length === 0;
}

// Date is* functions
// Helper functions for date validation (not exported, used internally)
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})$/;
const DATE_TIME_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

function isValidDateString(value: unknown): value is string {
  if (!isString(value)) return false;
  const match = value.match(DATE_REGEX);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  // Check month range
  if (month < 1 || month > 12) return false;

  // Create a date object and check if it's valid
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidTimeString(value: unknown): value is string {
  if (!isString(value)) return false;
  const match = value.match(TIME_REGEX);
  if (!match) return false;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);

  // Validate ranges
  return (
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59 &&
    seconds >= 0 &&
    seconds <= 59
  );
}

/**
 * Checks if a value is a Date object
 * @param value - The value to check
 * @returns True if the value is a Date instance
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Checks if a value is a date string in YYYY-MM-DD format
 * @param value - The value to check
 * @returns True if the value is a valid date string
 */
export function isDateString(value: unknown): value is string {
  return typeof value === "string" && isValidDateString(value);
}

/**
 * Checks if a value is a time string in HH:MM:SS format
 * @param value - The value to check
 * @returns True if the value is a valid time string
 */
export function isTimeString(value: unknown): value is string {
  return typeof value === "string" && isValidTimeString(value);
}

/**
 * Checks if a value is a date-time string in YYYY-MM-DDTHH:MM:SS format
 * @param value - The value to check
 * @returns True if the value is a valid date-time string
 */
export function isDateTimeString(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const match = value.match(DATE_TIME_REGEX);
  if (!match) return false;

  const datePart = `${match[1]}-${match[2]}-${match[3]}`;
  const timePart = `${match[4]}:${match[5]}:${match[6]}`;

  return isValidDateString(datePart) && isValidTimeString(timePart);
}

/**
 * Checks if a value is a JSON string
 * @param value - The value to check
 * @returns True if the value is a JSON string
 */
export function isJsonString(value: unknown): value is string {
  if (!isString(value)) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
