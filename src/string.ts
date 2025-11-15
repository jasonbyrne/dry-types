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

// is* functions moved to ./is.ts

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
export const toTitleCase = (str: string) => {
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
};

/**
 * Converts a string to kebab-case (lowercase with hyphens)
 * @param str - The string to convert
 * @returns A kebab-case string
 */
export const toKebabCase = (str: string) => {
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
};

/**
 * Converts a string to PascalCase (capitalizes first letter of each word, no separators)
 * @param str - The string to convert
 * @returns A PascalCase string
 */
export const toPascalCase = (str: string) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};

/**
 * Converts a string to sentence case (capitalizes first letter of each word, rest lowercase)
 * @param str - The string to convert
 * @returns A sentence case string
 */
export const toSentenceCase = (str: string) => {
  if (!str) return "";
  const lower = str.toLowerCase();
  return lower
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Removes special characters from a string, keeping only alphanumeric characters, hyphens, and spaces
 * @param str - The string to clean
 * @returns A string with special characters removed
 */
export const stripSpecialCharacters = (str: string) => {
  return str.replace(/[^a-z0-9- ]/gi, "");
};

/**
 * Replaces multiple consecutive whitespace characters with a single space
 * @param str - The string to clean
 * @returns A string with normalized whitespace
 */
export const stripExtraWhitespace = (str: string) => {
  return str.replace(/\s+/g, " ");
};
