/**
 * Address formatting utilities
 *
 * This module provides functions for:
 * - Formatting postal codes (US and international formats)
 * - Formatting city/region/country combinations
 * - Formatting full addresses with various output formats
 */

import { toString } from "./string";
import { isNullOrUndefined } from "./is";

/**
 * Address component interface
 */
export interface AddressComponents {
  street?: string | string[] | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

/**
 * Options for formatting full addresses
 */
export interface FormatAddressOptions {
  /**
   * Format style: 'single-line', 'url-query', or 'multi-line'
   * @default 'single-line'
   */
  style?: "single-line" | "url-query" | "multi-line";
  /**
   * Whether to use HTML formatting (uses <br /> for line breaks in multi-line format)
   * @default false
   */
  html?: boolean;
  /**
   * Separator for single-line format
   * @default ', '
   */
  separator?: string;
}

/**
 * Formats a postal code with optional formatting
 * Handles US zip codes (5-digit and ZIP+4 format) and international formats
 *
 * @param postalCode - The postal code to format (string or number)
 * @param options - Formatting options
 * @param options.format - Format style: 'standard' (12345 or 12345-6789), 'digits-only' (removes all non-digits), or 'hyphenated' (forces hyphen for 9-digit US codes)
 * @param options.defaultValue - Default value to return if postalCode is null/undefined (default: null)
 * @returns Formatted postal code string, or the default value
 *
 * @example
 * ```ts
 * formatPostalCode("12345") // "12345"
 * formatPostalCode("123456789") // "12345-6789"
 * formatPostalCode("12345-6789") // "12345-6789"
 * formatPostalCode("SW1A 1AA") // "SW1A 1AA" (UK postcode)
 * formatPostalCode("123456789", { format: "digits-only" }) // "123456789"
 * formatPostalCode("12345-6789", { format: "hyphenated" }) // "12345-6789"
 * ```
 */
export function formatPostalCode<T extends string | null | undefined>(
  postalCode: unknown,
  options: {
    format?: "standard" | "digits-only" | "hyphenated";
    defaultValue?: T;
  } = {}
): string | T {
  const { format = "standard", defaultValue = null as T } = options;

  if (isNullOrUndefined(postalCode)) {
    return defaultValue as string | T;
  }

  const postalStr = toString(postalCode, "").trim();

  if (postalStr === "") {
    return defaultValue as string | T;
  }

  // If format is digits-only, remove spaces and special characters but keep alphanumeric
  if (format === "digits-only") {
    return postalStr.replace(/[^a-zA-Z0-9]/g, "");
  }

  // For standard and hyphenated formats, handle US zip codes
  // US zip codes: 5 digits or 9 digits (can be with or without hyphen)
  const digitsOnly = postalStr.replace(/\D/g, "");

  if (digitsOnly.length === 9) {
    // US ZIP+4 format
    const formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    // If original had non-digit characters, preserve them if they're in the right place
    if (format === "hyphenated" || postalStr.includes("-")) {
      return formatted;
    }
    // For standard format, return hyphenated if it was already hyphenated or if we're forcing it
    return formatted;
  } else if (digitsOnly.length === 5) {
    // US 5-digit format
    return digitsOnly;
  }

  // For international formats or other formats, return as-is (trimmed)
  return postalStr;
}

/**
 * Formats a city, region, and country combination
 *
 * @param components - City, region, and/or country components
 * @param options - Formatting options
 * @param options.separator - Separator between components (default: ", ")
 * @param options.defaultValue - Default value to return if all components are empty (default: null)
 * @returns Formatted string, or the default value
 *
 * @example
 * ```ts
 * formatCityStateCountry({ city: "New York", region: "NY" }) // "New York, NY"
 * formatCityStateCountry({ city: "London", country: "UK" }) // "London, UK"
 * formatCityStateCountry({ city: "Paris", region: "Île-de-France", country: "France" }) // "Paris, Île-de-France, France"
 * formatCityStateCountry({ city: "New York", region: "NY", country: "USA" }, { separator: " | " }) // "New York | NY | USA"
 * ```
 */
export function formatCityStateCountry<T extends string | null | undefined>(
  components: {
    city?: string | null;
    region?: string | null;
    country?: string | null;
  },
  options: {
    separator?: string;
    defaultValue?: T;
  } = {}
): string | T {
  const { separator = ", ", defaultValue = null as T } = options;

  const parts: string[] = [];

  if (components.city) {
    parts.push(components.city.trim());
  }

  if (components.region) {
    parts.push(components.region.trim());
  }

  if (components.country) {
    parts.push(components.country.trim());
  }

  if (parts.length === 0) {
    return defaultValue as string | T;
  }

  return parts.join(separator);
}

/**
 * Formats a full address with various output formats
 *
 * @param address - Address components
 * @param options - Formatting options
 * @returns Formatted address string
 *
 * @example
 * ```ts
 * const address = {
 *   street: ["123 Main St", "Apt 4B"],
 *   city: "New York",
 *   region: "NY",
 *   postalCode: "10001",
 *   country: "USA"
 * };
 *
 * // Single line (default)
 * formatAddress(address) // "123 Main St, Apt 4B, New York, NY 10001, USA"
 *
 * // Multi-line
 * formatAddress(address, { style: "multi-line" })
 * // "123 Main St\nApt 4B\nNew York, NY 10001\nUSA"
 *
 * // Multi-line HTML
 * formatAddress(address, { style: "multi-line", html: true })
 * // "123 Main St<br />Apt 4B<br />New York, NY 10001<br />USA"
 *
 * // URL query string (for Google Maps)
 * formatAddress(address, { style: "url-query" })
 * // "123+Main+St,+Apt+4B,+New+York,+NY+10001,+USA"
 * ```
 */
export function formatAddress(
  address: AddressComponents,
  options: FormatAddressOptions = {}
): string {
  const { style = "single-line", html = false, separator = ", " } = options;

  const parts: string[] = [];

  // Street address - handle both string and array
  if (address.street) {
    if (Array.isArray(address.street)) {
      // Filter out empty strings and trim each line
      const streetLines = address.street
        .map((line) => (line ? line.trim() : ""))
        .filter((line) => line !== "");
      parts.push(...streetLines);
    } else {
      const trimmed = address.street.trim();
      if (trimmed !== "") {
        parts.push(trimmed);
      }
    }
  }

  // City, Region, Postal Code - handle these together for proper formatting
  const hasCity = !!address.city;
  const hasRegion = !!address.region;
  const hasPostalCode = !!address.postalCode;

  // Build city/region/postalCode combination based on what's available
  let cityRegionPostalCombined: string | null = null;

  // Only process city/region/postalCode if at least one has a value
  if (hasCity || hasRegion || hasPostalCode) {
    const cityPart = address.city ? address.city.trim() : null;
    const regionPart = address.region ? address.region.trim() : null;
    const postalPart = address.postalCode ? address.postalCode.trim() : null;

    // Build combination from available parts
    if (cityPart !== null || regionPart !== null || postalPart !== null) {
      const cityRegionPostalParts: string[] = [];
      if (cityPart !== null) cityRegionPostalParts.push(cityPart);
      if (regionPart !== null) cityRegionPostalParts.push(regionPart);
      if (postalPart !== null) cityRegionPostalParts.push(postalPart);

      // For single-line and url-query, combine city/region/postalCode intelligently
      if (style === "single-line" || style === "url-query") {
        if (cityRegionPostalParts.length === 3) {
          // City, Region PostalCode
          cityRegionPostalCombined = `${cityRegionPostalParts[0]}, ${cityRegionPostalParts[1]} ${cityRegionPostalParts[2]}`;
        } else if (cityRegionPostalParts.length === 2) {
          // Check if second part is a postal code (digits or alphanumeric with space/hyphen pattern)
          const secondPart = cityRegionPostalParts[1];
          // Check if it looks like a postal code (contains digits, may have letters/spaces/hyphens)
          const isPostalCode =
            /^[\dA-Z\s-]+$/i.test(secondPart) && /\d/.test(secondPart);
          if (isPostalCode) {
            // City PostalCode (no comma)
            cityRegionPostalCombined = `${cityRegionPostalParts[0]} ${secondPart}`;
          } else {
            // City, Region
            cityRegionPostalCombined = `${cityRegionPostalParts[0]}, ${secondPart}`;
          }
        } else if (cityRegionPostalParts.length === 1) {
          cityRegionPostalCombined = cityRegionPostalParts[0];
        }
      } else {
        // For multi-line, add each component separately
        parts.push(...cityRegionPostalParts);
      }

      // Add combined city/region/postalCode for single-line and url-query
      if (cityRegionPostalCombined !== null) {
        parts.push(cityRegionPostalCombined);
      }
    }
  }

  // Country
  if (address.country) {
    const trimmed = address.country.trim();
    if (trimmed !== "") {
      parts.push(trimmed);
    }
  }

  if (parts.length === 0) {
    return "";
  }

  // Format based on style
  if (style === "url-query") {
    // URL encode the entire address string
    // Join with commas and spaces, then encode
    const joined = parts.join(", ");
    return encodeURIComponent(joined).replace(/%20/g, "+");
  }

  if (style === "multi-line") {
    const lineBreak = html ? "<br />" : "\n";
    return parts.join(lineBreak);
  }

  // Single-line format (default)
  return parts.join(separator);
}
