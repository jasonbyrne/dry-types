import { formatNumber, NumberFormatOptions } from "./number";

export interface CurrencyFormatOptions {
  /**
   * Locale to use for formatting (e.g., "en-US", "de-DE", "fr-FR")
   * @default "en-US"
   */
  locale?: string;

  /**
   * Currency code to use (e.g., "USD", "EUR", "GBP")
   * @default "USD"
   */
  currency?: string;

  /**
   * Whether to allow negative values
   * @default true
   */
  allowNegative?: boolean;

  /**
   * Maximum number of decimal places to display
   * @default 2 (standard for most currencies)
   */
  maxDecimalPlaces?: number;

  /**
   * Minimum number of decimal places to display (pads with zeros)
   * @default 2 (standard for most currencies)
   */
  minDecimalPlaces?: number;
}

/**
 * Converts a value to a currency-formatted string using formatNumber internally
 * @param value - The value to convert to currency format
 * @param defaultValue - The default value to return if conversion fails (default: "")
 * @param opts - Formatting options
 * @returns A currency-formatted string, or the default value if conversion fails or negative values are not allowed
 * @example
 * ```ts
 * toCurrency(1234.56) // "$1,234.56"
 * toCurrency(1234.56, "", { currency: "EUR", locale: "de-DE" }) // "1.234,56 €"
 * toCurrency(-100, "", { allowNegative: false }) // ""
 * toCurrency(1234.5, "", { minDecimalPlaces: 2 }) // "$1,234.50"
 * ```
 */
export function toCurrency<T extends string | null | undefined>(
  value: unknown,
  defaultValue: T = "" as T,
  opts: CurrencyFormatOptions = {}
): T | string {
  const {
    locale = "en-US",
    currency = "USD",
    allowNegative = true,
    maxDecimalPlaces = 2,
    minDecimalPlaces = 2,
  } = opts;

  // Use formatNumber with currency-specific options
  const formatOpts: NumberFormatOptions = {
    useLocaleFormatting: true,
    locale,
    allowNegative,
    maxDecimalPlaces,
    minDecimalPlaces,
    intlOptions: {
      style: "currency",
      currency,
    },
  };

  const formatted = formatNumber(value, formatOpts);

  // Return default value if formatting resulted in empty string (invalid value or constraint violation)
  // Note: If formatted is empty string and defaultValue is also empty string, return empty string
  if (formatted === "") {
    return defaultValue;
  }

  return formatted;
}
