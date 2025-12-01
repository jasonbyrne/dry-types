/**
 * Phone number formatting utilities
 *
 * This module provides functions for:
 * - Encoding/normalizing phone numbers for database storage
 * - Formatting phone numbers for human-readable display
 * - Handling extensions and special formats (conference calls, etc.)
 */

import { toString } from "./string";
import { isNullOrUndefined } from "./is";

/**
 * Base options shared by all phone format styles
 */
interface BaseFormatPhoneOptions {
  /**
   * Default value to return if phone number is null/undefined/empty
   * @default null
   */
  defaultValue?: string | null;
  /**
   * Whether to strip leading 1 (US country code) when normalizing
   * @default true
   */
  stripLeadingOne?: boolean;
}

/**
 * Options for database format (normalize for storage)
 */
interface DatabaseFormatPhoneOptions extends BaseFormatPhoneOptions {
  style: "database";
}

/**
 * Options for dash format (123-456-7890)
 */
interface DashFormatPhoneOptions extends BaseFormatPhoneOptions {
  style: "dash";
}

/**
 * Options for parentheses format ((123) 456-7890)
 */
interface ParenthesesFormatPhoneOptions extends BaseFormatPhoneOptions {
  style: "parentheses";
}

/**
 * Options for international format (+1 123-456-7890)
 * Note: stripLeadingOne is not available for international format as it always includes country code
 */
interface InternationalFormatPhoneOptions
  extends Omit<BaseFormatPhoneOptions, "stripLeadingOne"> {
  style: "international";
}

/**
 * Options for link format (for tel: links)
 * Note: stripLeadingOne is not available for link format - it always includes +1 prefix
 */
interface LinkFormatPhoneOptions
  extends Omit<BaseFormatPhoneOptions, "stripLeadingOne"> {
  style: "link";
}

/**
 * Options for default format (parentheses when style is not specified)
 */
interface DefaultFormatPhoneOptions extends BaseFormatPhoneOptions {
  style?: "parentheses";
}

/**
 * Options for formatting phone numbers
 *
 * The type system ensures that `stripLeadingOne` is only available for styles that support it:
 * - Available for: 'database', 'dash', 'parentheses', and default (no style specified)
 * - Not available for: 'international', 'link'
 */
export type FormatPhoneOptions =
  | DatabaseFormatPhoneOptions
  | DashFormatPhoneOptions
  | ParenthesesFormatPhoneOptions
  | InternationalFormatPhoneOptions
  | LinkFormatPhoneOptions
  | DefaultFormatPhoneOptions;

/**
 * Parses a phone number string into its components
 * @internal
 */
interface PhoneComponents {
  countryCode: string;
  areaCode: string;
  exchange: string;
  number: string;
  extension: string;
  conferenceParts: string[];
}

/**
 * Extracts phone number components from a string
 * @internal
 */
function parsePhoneNumber(
  phone: string
): PhoneComponents & { phoneWithoutExtension: string } {
  const result: PhoneComponents & { phoneWithoutExtension: string } = {
    countryCode: "",
    areaCode: "",
    exchange: "",
    number: "",
    extension: "",
    conferenceParts: [],
    phoneWithoutExtension: phone,
  };

  // Check if this is a conference call format (contains commas, #, or *)
  const hasConferenceFormat =
    phone.includes(",") || phone.includes("#") || phone.includes("*");

  if (hasConferenceFormat) {
    // Preserve conference format
    result.conferenceParts = phone.split(",");
    return result;
  }

  // Extract extension (look for 'x', 'ext', 'extension', 'ext.', etc.)
  const extensionMatch = phone.match(
    /[xX](?:\s*)(\d+)|(?:ext|extension|ext\.)[\s:]*(\d+)/i
  );
  if (extensionMatch) {
    result.extension = extensionMatch[1] || extensionMatch[2] || "";
    phone = phone.substring(0, extensionMatch.index!);
    result.phoneWithoutExtension = phone;
  }

  // Extract only digits from the main phone number
  const digits = phone.replace(/\D/g, "");

  // Handle US numbers (10 or 11 digits)
  if (digits.length === 11 && digits.startsWith("1")) {
    result.countryCode = "1";
    const rest = digits.slice(1);
    if (rest.length === 10) {
      result.areaCode = rest.slice(0, 3);
      result.exchange = rest.slice(3, 6);
      result.number = rest.slice(6);
    }
  } else if (digits.length === 10) {
    result.areaCode = digits.slice(0, 3);
    result.exchange = digits.slice(3, 6);
    result.number = digits.slice(6);
  } else if (digits.length > 0) {
    // For other lengths, try to parse as best we can
    // Assume first 3 digits are area code if we have at least 7 digits
    if (digits.length >= 7) {
      result.areaCode = digits.slice(0, 3);
      result.exchange = digits.slice(3, 6);
      result.number = digits.slice(6);
    } else {
      // Just store as number if too short
      result.number = digits;
    }
  }

  return result;
}

/**
 * Formats a phone number according to the specified style
 *
 * @param phone - The phone number to format (string or number)
 * @param options - Formatting options
 * @returns Formatted phone number string, or the default value
 *
 * @example
 * ```ts
 * // Database format (normalized)
 * formatPhone("(123) 456-7890") // "1234567890"
 * formatPhone("+1 123-456-7890 ext 123") // "1234567890x123"
 * formatPhone("1-123-456-7890", { stripLeadingOne: true }) // "1234567890"
 *
 * // Dash format
 * formatPhone("1234567890", { style: "dash" }) // "123-456-7890"
 *
 * // Parentheses format
 * formatPhone("1234567890", { style: "parentheses" }) // "(123) 456-7890"
 *
 * // International format
 * formatPhone("1234567890", { style: "international" }) // "+1 123-456-7890"
 *
 * // Link format (for tel: links - always includes +1 prefix)
 * formatPhone("1234567890", { style: "link" }) // "+11234567890"
 * formatPhone("1234567890 ext 123", { style: "link" }) // "+11234567890,123" (comma for auto-dial)
 *
 * // Conference call format (automatically preserved)
 * formatPhone("8662345689,223345099#,*324569") // "8662345689 223345099# *324569" (space-separated for display)
 * formatPhone("8662345689,223345099#,*324569", { style: "database" }) // "8662345689,223345099#,*324569" (comma-separated)
 * ```
 */
export function formatPhone<T extends string | null | undefined>(
  phone: unknown,
  options: FormatPhoneOptions = { style: "parentheses" }
): string | T {
  const style = options.style ?? "parentheses";
  const defaultValue = options.defaultValue ?? (null as T);

  // Extract stripLeadingOne only for styles that support it
  // TypeScript ensures this is only available for database, dash, parentheses, and default
  const stripLeadingOneOption =
    "stripLeadingOne" in options ? options.stripLeadingOne : undefined;

  // For link format, always include +1 prefix (stripLeadingOne not available via types)
  // For other formats, default to stripping leading 1 (stripLeadingOne = true)
  const stripLeadingOne =
    style === "link"
      ? false // Link format always includes +1
      : stripLeadingOneOption ?? true;

  if (isNullOrUndefined(phone)) {
    return defaultValue as string | T;
  }

  const phoneStr = toString(phone, "").trim();

  if (phoneStr === "") {
    return defaultValue as string | T;
  }

  const components = parsePhoneNumber(phoneStr);

  // If we detected conference format, handle it based on style
  if (components.conferenceParts.length > 0) {
    if (style === "database" || style === "link") {
      // For database and link formats, use comma separator
      return components.conferenceParts.join(",");
    } else {
      // For human-readable formats, use space separator
      return components.conferenceParts.join(" ");
    }
  }

  // Link format: for tel: links (similar to database but with optional + prefix)
  if (style === "link") {
    let digits = "";

    // Build digits from components
    if (components.areaCode && components.exchange && components.number) {
      digits = components.areaCode + components.exchange + components.number;
      // Add +1 prefix unless stripLeadingOne is true
      if (!stripLeadingOne) {
        digits = `+1${digits}`;
      }
    } else if (components.number) {
      // We have some number digits but not a full phone number
      digits = components.number;
      // Add +1 prefix unless stripLeadingOne is true
      if (!stripLeadingOne) {
        digits = `+1${digits}`;
      }
    } else {
      // Fallback: extract all digits from phone string after extension removal
      const phoneWithoutExtension = (components as any).phoneWithoutExtension;
      if (phoneWithoutExtension) {
        const allDigits = phoneWithoutExtension.replace(/\D/g, "");
        if (allDigits.length > 0) {
          digits = allDigits;
          // Strip leading 1 from input if requested
          if (
            stripLeadingOne &&
            digits.startsWith("1") &&
            digits.length === 11
          ) {
            digits = digits.slice(1);
          }
          // Add +1 prefix unless stripLeadingOne is true
          if (!stripLeadingOne) {
            if (digits.length === 10) {
              digits = `+1${digits}`;
            } else if (digits.length === 11 && digits.startsWith("1")) {
              digits = `+${digits}`;
            }
          }
        }
      }
    }

    // If we have no digits but have extension, return default value
    if (!digits && components.extension) {
      return defaultValue as string | T;
    }

    // If we have no digits at all, return default value
    if (!digits) {
      return defaultValue as string | T;
    }

    // Add extension if present (use comma separator for auto-dialing in tel: links)
    if (components.extension) {
      return `${digits},${components.extension}`;
    }

    return digits;
  }

  // Database format: normalize for storage
  if (style === "database") {
    let digits = "";

    // Build digits from components
    if (components.areaCode && components.exchange && components.number) {
      // Include country code if stripLeadingOne is false
      if (!stripLeadingOne && components.countryCode) {
        digits =
          components.countryCode +
          components.areaCode +
          components.exchange +
          components.number;
      } else {
        digits = components.areaCode + components.exchange + components.number;
      }
    } else if (components.number) {
      // We have some number digits but not a full phone number
      digits = components.number;
      // Include country code if present and stripLeadingOne is false
      if (!stripLeadingOne && components.countryCode) {
        digits = components.countryCode + digits;
      }
    } else {
      // Fallback: extract all digits from phone string after extension removal
      const phoneWithoutExtension = (components as any).phoneWithoutExtension;
      if (phoneWithoutExtension) {
        const allDigits = phoneWithoutExtension.replace(/\D/g, "");
        if (allDigits.length > 0) {
          digits = allDigits;
          // Strip leading 1 if requested
          if (
            stripLeadingOne &&
            digits.startsWith("1") &&
            digits.length === 11
          ) {
            digits = digits.slice(1);
          }
        }
      }
    }

    // If we have no digits but have extension, return default value
    if (!digits && components.extension) {
      return defaultValue as string | T;
    }

    // If we have no digits at all, return default value
    if (!digits) {
      return defaultValue as string | T;
    }

    // Add extension if present
    if (components.extension) {
      return `${digits}x${components.extension}`;
    }

    return digits;
  }

  // Display formats require area code, exchange, and number
  if (!components.areaCode || !components.exchange || !components.number) {
    // If we can't parse it properly, try to extract digits and format best we can
    const allDigits = phoneStr.replace(/\D/g, "");
    if (allDigits.length === 10) {
      components.areaCode = allDigits.slice(0, 3);
      components.exchange = allDigits.slice(3, 6);
      components.number = allDigits.slice(6);
    } else if (allDigits.length === 11 && allDigits.startsWith("1")) {
      components.countryCode = "1";
      components.areaCode = allDigits.slice(1, 4);
      components.exchange = allDigits.slice(4, 7);
      components.number = allDigits.slice(7);
    } else {
      // Can't format properly, return as-is or default
      return defaultValue as string | T;
    }
  }

  // Format based on style
  let formatted = "";

  switch (style) {
    case "dash":
      formatted = `${components.areaCode}-${components.exchange}-${components.number}`;
      break;

    case "parentheses":
      formatted = `(${components.areaCode}) ${components.exchange}-${components.number}`;
      break;

    case "international":
      const countryCode = components.countryCode || "1";
      formatted = `+${countryCode} ${components.areaCode}-${components.exchange}-${components.number}`;
      break;

    default:
      formatted = `(${components.areaCode}) ${components.exchange}-${components.number}`;
  }

  // Add extension if present (use " x" format for human-readable)
  if (components.extension) {
    formatted += ` x${components.extension}`;
  }

  return formatted;
}
