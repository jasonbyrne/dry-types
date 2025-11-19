import { toNumber, toNumberString, NumberStringOptions } from "./number";
import { NumberConstraint, SignDisplay } from "./generics";

/**
 * Currency formatting options
 */
export interface CurrencyFormatOptions {
  /**
   * Grain/format type for currency display
   * - "cents": Always show cents, min 2 decimals (e.g., "$1,234.00")
   * - "cents-optional": Show cents only if non-zero, min 2 decimals when shown (e.g., "$1,234", "$1,234.56")
   * - "whole": Round to nearest whole unit, no cents (e.g., "$1,235")
   * - "compact": Automatically group to K/M/B based on value magnitude with auto decimals
   * @default "cents"
   */
  grain?: "cents" | "cents-optional" | "whole" | "compact";

  /**
   * Currency code (e.g., "USD", "EUR", "GBP")
   * Affects symbol only, formatting stays US-style
   * @default "USD"
   */
  currency?: string;

  /**
   * Constraint on which values are allowed
   * @default "all"
   */
  constraint?: NumberConstraint;

  /**
   * How to display signs
   * @default "auto"
   */
  signDisplay?: SignDisplay;

  /**
   * Value to return for null/undefined inputs
   * @default "--"
   */
  nullValue?: string;

  /**
   * Maximum number of decimal places for cents
   * @default 2
   */
  maxDecimalPlaces?: number;

  /**
   * Locale to use for formatting (e.g., "en-US", "de-DE", "fr-FR")
   * @default "en-US"
   */
  locale?: Intl.LocalesArgument;

  /**
   * Additional Intl.NumberFormat options
   */
  intlOptions?: Intl.NumberFormatOptions;
}

export function toCurrency(
  value: unknown,
  opts: CurrencyFormatOptions = {}
): string {
  // Initialize defaults
  const grain = opts.grain || "cents";
  const locale: Intl.LocalesArgument = opts.locale || "en-US";
  const currency = opts.currency || "USD";
  const signDisplay = opts.signDisplay ?? "auto";

  // Pre-processing: convert to number
  let num = toNumber(value, null);
  if (num === null) return opts.nullValue ?? "--";

  // Round if needed
  if (!["cents", "cents-optional"].includes(grain)) {
    num = Math.round(num);
  }

  // Calculate decimal places based on grain
  let minimumFractionDigits = 0;
  let maximumFractionDigits = 2;
  const hasCents = num % 1 !== 0;
  if (grain === "cents") {
    minimumFractionDigits = 2;
    maximumFractionDigits = opts.maxDecimalPlaces || 2;
  } else if (grain === "cents-optional") {
    minimumFractionDigits = hasCents ? 2 : 0;
    maximumFractionDigits = hasCents ? opts.maxDecimalPlaces || 2 : 0;
  }

  // Map currency options to toNumberString options
  const numberStringOpts: NumberStringOptions = {
    locale,
    minDecimalPlaces: minimumFractionDigits,
    maxDecimalPlaces: maximumFractionDigits,
    constraint: opts.constraint,
    signDisplay,
    nullValue: opts.nullValue ?? "--",
    intlOptions: {
      style: "currency",
      currency,
      notation: grain === "compact" ? "compact" : "standard",
      useGrouping: true,
      currencyDisplay: "symbol",
      currencySign: signDisplay === "parentheses" ? "accounting" : "standard",
      ...opts.intlOptions,
    },
  };

  // Call toNumberString
  let formatted = toNumberString(num, numberStringOpts);

  // Handle edge case of invalid currency (e.g. "XYZ 0.00"), change to $
  if (/^[A-Z]+\s/.test(formatted)) {
    // Strip the currency code and replace with $
    formatted = formatted.replace(/^[A-Z]+\s/, "$");
  }

  return formatted;
}
