import { toNumber } from "./number";

/**
 * Converts a value to a currency-formatted string
 * @param value - The value to convert to currency format
 * @param defaultValue - The default value to return if conversion fails (default: "")
 * @param opts - Formatting options
 * @param opts.locale - The locale to use for formatting (e.g., "en-US", "de-DE")
 * @param opts.currency - The currency code to use (default: "USD")
 * @param opts.allowNegative - Whether to allow negative values (default: true)
 * @returns A currency-formatted string, or the default value if conversion fails or negative values are not allowed
 * @example
 * ```ts
 * toCurrency(1234.56) // "$1,234.56"
 * toCurrency(1234.56, "", { currency: "EUR", locale: "de-DE" }) // "1.234,56 €"
 * toCurrency(-100, "", { allowNegative: false }) // ""
 * ```
 */
export function toCurrency<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = "" as T,
  opts: {
    locale?: string;
    currency?: string;
    allowNegative?: boolean;
  } = {
    currency: "USD",
    allowNegative: true,
  }
): T | string {
  const num = toNumber(value, null);
  if (num === null) return defaultValue;
  // Check for NaN or Infinity
  if (isNaN(num) || !isFinite(num)) return defaultValue;
  if (!opts.allowNegative && num < 0) {
    return defaultValue;
  }
  // Ensure currency is provided
  if (!opts.currency) {
    opts.currency = "USD";
  }
  // Use currency formatting
  const formatted = num.toLocaleString(opts.locale, {
    style: "currency",
    currency: opts.currency,
  });
  return formatted;
}
