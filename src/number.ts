/**
 * Check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Convert a value to a number
 */
export function toNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return defaultValue;
}

/**
 * Format a number as a string
 */
export function formatNumber(
  value: unknown,
  options?: {
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
  }
): string {
  const num = toNumber(value);
  const decimals = options?.decimals ?? 2;
  const thousandsSeparator = options?.thousandsSeparator ?? ',';
  const decimalSeparator = options?.decimalSeparator ?? '.';

  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  
  // Add thousands separator
  parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator) ?? '';

  return parts.join(decimalSeparator);
}
