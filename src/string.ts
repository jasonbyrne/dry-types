/**
 * String manipulation and conversion utilities
 *
 * This module provides functions for:
 * - Converting values to strings with various formats (camelCase, snake_case, etc.)
 * - String transformations (capitalization, case conversion)
 * - String cleaning and sanitization
 * - String escaping (HTML, regex)
 * - String padding and formatting
 */

/**
 * Converts a value to a string
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns A string representation of the value, or the default value
 */
export function toString<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value === "string") {
    return value;
  }
  return String(value);
}

/**
 * Converts a value to a trimmed string (removes leading and trailing whitespace)
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns A trimmed string, or the default value
 */
export function toTrimmedString<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  const transformed = toString(value, defaultValue);
  if (typeof transformed === "string") {
    return transformed.trim();
  }
  return transformed;
}

/**
 * Converts a value to lowercase
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns A lowercase string, or the default value
 */
export function toLowerCase<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const transformed = toString(value, defaultValue);
  if (typeof transformed === "string") {
    return transformed.toLowerCase();
  }
  return transformed;
}

/**
 * Converts a value to uppercase
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns An uppercase string, or the default value
 */
export function toUpperCase<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const transformed = toString(value, defaultValue);
  if (typeof transformed === "string") {
    return transformed.toUpperCase();
  }
  return transformed;
}

/**
 * Capitalizes the first letter of a string
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns A string with the first letter capitalized, or the default value
 */
export function toCapitalized<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const transformed = toString(value, defaultValue);
  if (typeof transformed === "string") {
    if (transformed.length === 0) return transformed;
    return (
      transformed.charAt(0).toUpperCase() + transformed.slice(1).toLowerCase()
    );
  }
  return transformed;
}

/**
 * Truncates a string to a maximum length with an optional suffix
 * @param value - The value to truncate
 * @param maxLength - Maximum length of the resulting string (including suffix)
 * @param suffix - Suffix to append when truncating (default: "...")
 * @returns A truncated string, or the original string if it's shorter than maxLength
 */
export function truncate(
  value: unknown,
  maxLength: number,
  suffix: string = "..."
): string {
  const str = toString(value, "");
  if (str.length <= maxLength) return str;
  if (maxLength <= suffix.length) return suffix.slice(0, maxLength);
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Converts a string to camelCase
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns A camelCase string, or the default value
 */
export function toCamelCase<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  const transformed = toString(value, defaultValue);
  if (typeof transformed !== "string") return transformed;
  if (transformed.length === 0) return transformed;

  // First, split on spaces, underscores, and hyphens
  // Then handle camelCase/PascalCase by splitting on capital letters
  const words = transformed
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter((word) => word.length > 0);

  return words
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

/**
 * Converts a string to snake_case
 * @param value - The value to convert
 * @param defaultValue - The default value to return if value is null or undefined (default: "")
 * @returns A snake_case string, or the default value
 */
export function toSnakeCase<T extends string | undefined | null>(
  value: unknown,
  defaultValue: T = "" as T
): string | T {
  const transformed = toString(value, defaultValue);
  if (typeof transformed !== "string") return transformed;
  if (transformed.length === 0) return transformed;

  return transformed
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Gets a clamped string from a value and an array of enum values
 * @param value - The value to get the clamped string from
 * @param enumValues - The array of enum values
 * @returns The clamped string, or the first enum value if the value is not in the array
 */
export function getClampedString<T extends string>(
  value: unknown,
  enumValues: T[]
): T {
  const stringValue = String(value);
  return enumValues.includes(stringValue as T)
    ? (stringValue as T)
    : enumValues[0];
}

/**
 * Converts a string to title case (capitalizes first letter of each word, except common articles/prepositions)
 * @param str - The string to convert
 * @returns A title case string, or empty string if input is falsy
 */
export function toTitleCase(str: string): string {
  if (!str) return "";

  const ignoreWords = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "on",
    "at",
    "to",
    "from",
    "by",
    "with",
    "in",
    "of",
  ];

  const lowerCaseString = str.toLowerCase();
  const words = lowerCaseString.split(" ");

  // If the first word is an ignore word, keep the entire string lowercase
  if (words.length > 0 && ignoreWords.includes(words[0])) {
    return lowerCaseString;
  }

  return words
    .map((word) => {
      // Capitalize non-ignore words
      if (ignoreWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Converts a string to kebab-case (lowercase with hyphens)
 * @param str - The string to convert
 * @returns A kebab-case string
 */
export function toKebabCase(str: string): string {
  // First, handle camelCase by just lowercasing (no hyphen insertion)
  // Check if it's camelCase (has lowercase followed by uppercase)
  if (/([a-z])([A-Z])/.test(str)) {
    // For camelCase, just lowercase everything
    return str.toLowerCase();
  }
  // For strings with spaces, convert spaces to hyphens
  return str
    .replace(/\b\w/g, (match) => match.toLowerCase())
    .replace(/ /g, "-");
}

/**
 * Converts a string to PascalCase (capitalizes first letter of each word, no separators)
 * @param str - The string to convert
 * @returns A PascalCase string
 */
export function toPascalCase(str: string): string {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

/**
 * Converts a string to sentence case (capitalizes first letter of each word, rest lowercase)
 * @param str - The string to convert
 * @returns A sentence case string
 */
export function toSentenceCase(str: string): string {
  if (!str) return "";
  const lower = str.toLowerCase();
  return lower
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Removes special characters from a string, keeping only alphanumeric characters, hyphens, and spaces
 * @param str - The string to clean
 * @returns A string with special characters removed
 */
export function stripSpecialCharacters(str: string): string {
  return str.replace(/[^a-z0-9- ]/gi, "");
}

/**
 * Replaces multiple consecutive whitespace characters with a single space
 * @param str - The string to clean
 * @returns A string with normalized whitespace
 */
export function stripExtraWhitespace(str: string): string {
  return str.replace(/\s+/g, " ");
}

/**
 * Removes all non-alphanumeric characters from a string (keeps only letters and numbers)
 * @param str - The string to clean
 * @returns A string with only alphanumeric characters
 */
export function stripNonAlphanumeric(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Removes all non-numeric characters from a string (keeps only digits)
 * @param str - The string to clean
 * @returns A string with only numeric characters
 */
export function stripNonNumeric(str: string): string {
  return str.replace(/[^0-9]/g, "");
}

/**
 * Removes all non-alphabetic characters from a string (keeps only letters)
 * @param str - The string to clean
 * @returns A string with only alphabetic characters
 */
export function stripNonAlphabetic(str: string): string {
  return str.replace(/[^a-zA-Z]/g, "");
}

/**
 * Reverses a string
 * @param str - The string to reverse
 * @returns The reversed string
 */
export function reverse(str: string): string {
  return str.split("").reverse().join("");
}

/**
 * Counts the number of occurrences of a substring in a string
 * Note: Overlapping matches are counted (e.g., "aaa" contains "aa" twice)
 * @param str - The string to search in
 * @param substring - The substring to count
 * @returns The number of occurrences
 */
export function countOccurrences(str: string, substring: string): number {
  if (!substring) return 0;
  let count = 0;
  let index = 0;
  while ((index = str.indexOf(substring, index)) !== -1) {
    count++;
    index++; // Move forward by 1 to allow overlapping matches
  }
  return count;
}

/**
 * Converts a string to a URL-friendly slug
 * @param str - The string to convert
 * @returns A URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Masks a portion of a string, useful for hiding sensitive data
 * @param str - The string to mask
 * @param start - Start position (0-based, inclusive)
 * @param end - End position (0-based, exclusive)
 * @param maskChar - Character to use for masking (default: "*")
 * @returns The masked string
 */
export function mask(
  str: string,
  start: number,
  end: number,
  maskChar: string = "*"
): string {
  if (start < 0) start = 0;
  if (end > str.length) end = str.length;
  if (start >= end) return str;
  return str.slice(0, start) + maskChar.repeat(end - start) + str.slice(end);
}

/**
 * Escapes special HTML characters
 * @param str - The string to escape
 * @returns The escaped string
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Unescapes HTML entities
 * @param str - The string to unescape
 * @returns The unescaped string
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
  };
  return str.replace(/&(amp|lt|gt|quot|#039|apos);/g, (m) => map[m] || m);
}

/**
 * Escapes special regex characters
 * @param str - The string to escape
 * @returns The escaped string safe for use in regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Centers a string by padding it on both sides with spaces
 * @param str - The string to center
 * @param length - The target length of the resulting string
 * @param padChar - The character to use for padding (default: " ")
 * @returns A centered string padded to the specified length
 */
export function padCenter(
  str: unknown,
  length: number,
  padChar: string = " "
): string {
  const s = toString(str, "");
  if (s.length >= length) return s;
  const padLength = length - s.length;
  const leftPad = Math.floor(padLength / 2);
  const rightPad = padLength - leftPad;
  return padChar.repeat(leftPad) + s + padChar.repeat(rightPad);
}

/**
 * Returns a string with a number and the singular or plural form of a noun
 * @param count - The number to include in the result
 * @param singular - The singular form of the noun
 * @param plural - Optional plural form. If not provided, will attempt to pluralize automatically
 * @returns A string in the format "{count} {noun}" with the correct singular/plural form
 * @example
 * pluralize(1, "cat") // "1 cat"
 * pluralize(2, "cat") // "2 cats"
 * pluralize(0, "cat") // "0 cats"
 * pluralize(1, "mouse", "mice") // "1 mouse"
 * pluralize(2, "mouse", "mice") // "2 mice"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const noun =
    Math.abs(count) === 1 ? singular : plural ?? pluralizeNoun(singular);
  return `${count} ${noun}`;
}

/**
 * Attempts to pluralize a noun using common English rules
 * @param singular - The singular form of the noun
 * @returns The plural form of the noun
 */
function pluralizeNoun(singular: string): string {
  if (!singular) return singular;

  const lower = singular.toLowerCase();
  const lastChar = lower[lower.length - 1];
  const lastTwoChars = lower.slice(-2);

  // Words ending in s, x, z, ch, sh -> add "es"
  if (
    lastChar === "s" ||
    lastChar === "x" ||
    lastChar === "z" ||
    lastTwoChars === "ch" ||
    lastTwoChars === "sh"
  ) {
    return singular + "es";
  }

  // Words ending in "y" preceded by a consonant -> change "y" to "ies"
  if (lastChar === "y" && lower.length > 1) {
    const secondLastChar = lower[lower.length - 2];
    const isVowel = /[aeiou]/.test(secondLastChar);
    if (!isVowel) {
      return singular.slice(0, -1) + "ies";
    }
  }

  // Words ending in "f" -> change to "ves" (common cases)
  if (lastChar === "f") {
    return singular.slice(0, -1) + "ves";
  }

  // Words ending in "fe" -> change to "ves"
  if (lastTwoChars === "fe") {
    return singular.slice(0, -2) + "ves";
  }

  // Default: add "s"
  return singular + "s";
}
