/**
 * Comprehensive regex utility functions for pattern matching and extraction
 */

export type Pattern = RegExp | string;

/**
 * Internal helper to escape special regex characters in a string
 */
function escapeRegexString(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Tests if any of the provided patterns match the input string
 * @param input - The string to test
 * @param patterns - Array of patterns (RegExp or string) to test against
 * @returns True if any pattern matches the input
 * @example
 * ```ts
 * matchesAnyPattern("hello world", [/hello/, "foo"]) // true
 * matchesAnyPattern("hello world", ["foo", "bar"]) // false
 * ```
 */
export function matchesAnyPattern(
  input: string,
  patterns: Array<Pattern>
): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return input.toLowerCase().includes(pattern.toLowerCase());
    }
    return pattern.test(input);
  });
}

/**
 * Tests if all of the provided patterns match the input string
 * @param input - The string to test
 * @param patterns - Array of patterns (RegExp or string) to test against
 * @returns True if all patterns match the input
 * @example
 * ```ts
 * matchesAllPatterns("hello world", [/hello/, /world/]) // true
 * matchesAllPatterns("hello world", [/hello/, "foo"]) // false
 * ```
 */
export function matchesAllPatterns(
  input: string,
  patterns: Array<Pattern>
): boolean {
  return patterns.every((pattern) => {
    if (typeof pattern === "string") {
      return input.toLowerCase().includes(pattern.toLowerCase());
    }
    return pattern.test(input);
  });
}

/**
 * Returns the first successful match from any of the provided patterns
 * @param input - The string to search
 * @param patterns - Array of patterns (RegExp or string) to search with
 * @returns The first match found, or null if no match
 * @example
 * ```ts
 * extractFromAnyPattern("hello 123", [/\d+/, /world/]) // Match object for "123"
 * ```
 */
export function extractFromAnyPattern(
  input: string,
  patterns: Array<Pattern>
): RegExpMatchArray | null {
  for (const pattern of patterns) {
    if (typeof pattern === "string") {
      // For string patterns, create a simple regex to get match details
      const regex = new RegExp(escapeRegexString(pattern), "i");
      const match = input.match(regex);
      if (match) return match;
    } else {
      const match = input.match(pattern);
      if (match) return match;
    }
  }
  return null;
}

/**
 * Returns all matches from all patterns that match the input
 * @param input - The string to search
 * @param patterns - Array of patterns (RegExp or string) to search with
 * @returns Array of all matches found
 * @example
 * ```ts
 * extractAllMatches("hello 123 world 456", [/\d+/g]) // [Match for "123", Match for "456"]
 * ```
 */
export function extractAllMatches(
  input: string,
  patterns: Array<Pattern>
): RegExpMatchArray[] {
  const matches: RegExpMatchArray[] = [];
  for (const pattern of patterns) {
    if (typeof pattern === "string") {
      const regex = new RegExp(escapeRegexString(pattern), "gi");
      const stringMatches = [...input.matchAll(regex)];
      matches.push(...stringMatches);
    } else {
      const globalPattern = new RegExp(
        pattern.source,
        pattern.flags + (pattern.global ? "" : "g")
      );
      const patternMatches = [...input.matchAll(globalPattern)];
      matches.push(...patternMatches);
    }
  }
  return matches;
}

/**
 * Extracts a specific capture group from the first matching pattern
 * @param input - The string to search
 * @param patterns - Array of patterns (RegExp or string) to search with
 * @param groupIndex - The index of the capture group to extract (default: 1, first capture group)
 * @returns The captured group value, or null if no match
 * @example
 * ```ts
 * extractCaptureGroup("hello 123", [/(\d+)/], 1) // "123"
 * ```
 */
export function extractCaptureGroup(
  input: string,
  patterns: Array<Pattern>,
  groupIndex: number = 1
): string | null {
  const match = extractFromAnyPattern(input, patterns);
  return match && match[groupIndex] ? match[groupIndex] : null;
}

/**
 * Extracts all capture groups from the first matching pattern
 * @param input - The string to search
 * @param patterns - Array of patterns (RegExp or string) to search with
 * @returns Array of all capture group values, or empty array if no match
 * @example
 * ```ts
 * extractAllCaptureGroups("2024-01-15", [/(\d{4})-(\d{2})-(\d{2})/]) // ["2024", "01", "15"]
 * ```
 */
export function extractAllCaptureGroups(
  input: string,
  patterns: Array<Pattern>
): string[] {
  const match = extractFromAnyPattern(input, patterns);
  return match ? match.slice(1) : [];
}

/**
 * Finds the first pattern that matches (returns the pattern itself, not the match)
 * @param input - The string to test
 * @param patterns - Array of patterns (RegExp or string) to test against
 * @returns The first matching pattern, or null if no match
 * @example
 * ```ts
 * findFirstMatchingPattern("hello world", [/world/, /foo/]) // /world/
 * ```
 */
export function findFirstMatchingPattern(
  input: string,
  patterns: Array<Pattern>
): Pattern | null {
  for (const pattern of patterns) {
    if (typeof pattern === "string") {
      if (input.toLowerCase().includes(pattern.toLowerCase())) {
        return pattern;
      }
    } else {
      if (pattern.test(input)) {
        return pattern;
      }
    }
  }
  return null;
}

/**
 * Extracts text between two patterns (useful for extracting content between delimiters)
 * @param input - The string to search
 * @param startPattern - The pattern marking the start of extraction
 * @param endPattern - The pattern marking the end of extraction
 * @returns The extracted text between patterns, or null if patterns not found
 * @example
 * ```ts
 * extractBetween("start:hello:end", "start:", ":end") // "hello"
 * ```
 */
export function extractBetween(
  input: string,
  startPattern: Pattern,
  endPattern: Pattern
): string | null {
  const startRegex =
    typeof startPattern === "string"
      ? new RegExp(escapeRegexString(startPattern), "i")
      : startPattern;

  const endRegex =
    typeof endPattern === "string"
      ? new RegExp(escapeRegexString(endPattern), "i")
      : endPattern;

  const startMatch = input.match(startRegex);
  if (!startMatch) return null;

  const startIndex = startMatch.index! + startMatch[0].length;
  const remaining = input.slice(startIndex);
  const endMatch = remaining.match(endRegex);

  if (!endMatch) return null;

  return remaining.slice(0, endMatch.index);
}

/**
 * Extracts numeric values from the first matching pattern's capture groups
 * @param input - The string to search
 * @param patterns - Array of patterns (RegExp or string) to search with
 * @returns Array of numeric values extracted from capture groups
 * @example
 * ```ts
 * extractNumbersFromPattern("price: $123.45", [/\$(\d+)\.(\d+)/]) // [123, 45]
 * ```
 */
export function extractNumbersFromPattern(
  input: string,
  patterns: Array<Pattern>
): number[] {
  const match = extractFromAnyPattern(input, patterns);
  if (!match) return [];

  return match
    .slice(1) // Skip the full match
    .filter((group) => group && /^\d+(\.\d+)?$/.test(group))
    .map((num) => parseFloat(num));
}

/**
 * Tests if input matches a pattern and extracts a specific data type using a custom extractor function
 * @param input - The string to search
 * @param patterns - Array of patterns (RegExp or string) to search with
 * @param extractor - Function to extract/transform the match result
 * @returns The extracted value, or null if no match
 * @example
 * ```ts
 * matchAndExtract("age: 25", [/age: (\d+)/], (match) => parseInt(match[1])) // 25
 * ```
 */
export function matchAndExtract<T>(
  input: string,
  patterns: Array<Pattern>,
  extractor: (match: RegExpMatchArray) => T
): T | null {
  const match = extractFromAnyPattern(input, patterns);
  return match ? extractor(match) : null;
}

/**
 * Converts a string pattern to a RegExp
 * @param pattern - The string pattern to convert
 * @param caseInsensitive - Whether the regex should be case-insensitive (default: true)
 * @param escapeSpecialChars - Whether to escape special regex characters (default: false)
 * @returns A RegExp object
 * @example
 * ```ts
 * toRegex("hello", true, false) // /hello/i
 * toRegex("hello.world", true, true) // /hello\.world/i
 * ```
 */
export function toRegex(
  pattern: string,
  caseInsensitive: boolean = true,
  escapeSpecialChars: boolean = false
): RegExp {
  const processedPattern = escapeSpecialChars
    ? escapeRegexString(pattern)
    : pattern;

  return new RegExp(processedPattern, caseInsensitive ? "i" : "");
}

/**
 * Tests if the input string contains any of the provided patterns (alias for matchesAnyPattern)
 * @param input - The string to test
 * @param patterns - Array of patterns (RegExp or string) to test against
 * @returns True if any pattern matches the input
 * @example
 * ```ts
 * containsAny("hello world", ["hello", "foo"]) // true
 * ```
 */
export function containsAny(input: string, patterns: Array<Pattern>): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return input.toLowerCase().includes(pattern.toLowerCase());
    }
    return pattern.test(input);
  });
}

/**
 * Tests if the input string contains all of the provided patterns (alias for matchesAllPatterns)
 * @param input - The string to test
 * @param patterns - Array of patterns (RegExp or string) to test against
 * @returns True if all patterns match the input
 * @example
 * ```ts
 * containsAll("hello world", ["hello", "world"]) // true
 * ```
 */
export function containsAll(input: string, patterns: Array<Pattern>): boolean {
  return patterns.every((pattern) => {
    if (typeof pattern === "string") {
      return input.toLowerCase().includes(pattern.toLowerCase());
    }
    return pattern.test(input);
  });
}

/**
 * Finds the index of the first pattern that matches the input
 * @param input - The string to test
 * @param patterns - Array of patterns (RegExp or string) to test against
 * @returns The index of the first matching pattern, or -1 if no match
 * @example
 * ```ts
 * findIndexOfFirstMatch("hello world", ["foo", "world", "bar"]) // 1
 * ```
 */
export function findIndexOfFirstMatch(
  input: string,
  patterns: Array<Pattern>
): number {
  return patterns.findIndex((pattern) => {
    if (typeof pattern === "string") {
      return input.toLowerCase().includes(pattern.toLowerCase());
    }
    return pattern.test(input);
  });
}
