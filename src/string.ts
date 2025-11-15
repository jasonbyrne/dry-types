/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Convert a value to a string
 */
export function toString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Format a string with optional transformations
 */
export function formatString(
  value: unknown,
  options?: {
    uppercase?: boolean;
    lowercase?: boolean;
    trim?: boolean;
    maxLength?: number;
  }
): string {
  let result = toString(value);

  if (options?.trim) {
    result = result.trim();
  }
  if (options?.uppercase) {
    result = result.toUpperCase();
  }
  if (options?.lowercase) {
    result = result.toLowerCase();
  }
  if (options?.maxLength !== undefined && result.length > options.maxLength) {
    result = result.substring(0, options.maxLength);
  }

  return result;
}
