/**
 * URL formatting utilities
 *
 * This module provides functions for:
 * - Normalizing URL strings for database storage
 * - Formatting URLs for human-readable display
 * - Formatting URLs for use in links (with protocol)
 * - Handling relative, absolute, and full URLs
 */

import { toString, truncate } from "./string";
import { isNullOrUndefined } from "./is";

/**
 * Base options shared by all URL format styles
 */
interface BaseFormatUrlOptions {
  /**
   * Default value to return if URL is null/undefined/empty
   * @default null
   */
  defaultValue?: string | null;
  /**
   * Maximum length for query string in human display format
   * @default 50
   */
  maxQueryLength?: number;
  /**
   * Maximum length for hash/fragment in human display format
   * @default 30
   */
  maxHashLength?: number;
}

/**
 * Options for database format (normalize for storage)
 */
interface DatabaseFormatUrlOptions extends BaseFormatUrlOptions {
  style: "database";
}

/**
 * Options for human display format (without protocol, truncated query/hash)
 */
interface HumanFormatUrlOptions extends BaseFormatUrlOptions {
  style: "human";
  /**
   * Whether to truncate long query strings
   * @default true
   */
  truncateQuery?: boolean;
  /**
   * Whether to truncate long hash/fragment
   * @default true
   */
  truncateHash?: boolean;
}

/**
 * Options for link format (with protocol, for use in href attributes)
 */
interface LinkFormatUrlOptions extends BaseFormatUrlOptions {
  style: "link";
  /**
   * Default protocol to use if URL doesn't have one
   * @default "https"
   */
  defaultProtocol?: "http" | "https";
}

/**
 * Options for default format (human when style is not specified)
 */
interface DefaultFormatUrlOptions extends BaseFormatUrlOptions {
  style?: "human";
  /**
   * Whether to truncate long query strings
   * @default true
   */
  truncateQuery?: boolean;
  /**
   * Whether to truncate long hash/fragment
   * @default true
   */
  truncateHash?: boolean;
}

/**
 * Options for formatting URLs
 */
export type FormatUrlOptions =
  | DatabaseFormatUrlOptions
  | HumanFormatUrlOptions
  | LinkFormatUrlOptions
  | DefaultFormatUrlOptions;

/**
 * Parsed URL components
 * @internal
 */
interface UrlComponents {
  url?: URL;
  path: string;
  query: string;
  hash: string;
  isRelative: boolean;
  isAbsolute: boolean;
  isFull: boolean;
  isProtocolRelative: boolean;
  originalUrl: string;
}

/**
 * Parses a URL string into its components using native URL API when possible
 * @internal
 */
function parseUrl(urlStr: string): UrlComponents {
  const result: UrlComponents = {
    path: "",
    query: "",
    hash: "",
    isRelative: false,
    isAbsolute: false,
    isFull: false,
    isProtocolRelative: false,
    originalUrl: urlStr,
  };

  // Check if it's a protocol-relative URL (starts with //)
  if (urlStr.startsWith("//")) {
    result.isProtocolRelative = true;
    result.isFull = true;
    // Don't parse it yet - we'll need the defaultProtocol from options
    return result;
  }

  // Check if it's a full URL (has protocol)
  try {
    result.url = new URL(urlStr);
    result.isFull = true;
    return result;
  } catch {
    // Not a full URL, check if it's absolute or relative
  }

  // Extract hash and query from the string before determining path type
  let urlWithoutHash = urlStr;
  const hashIndex = urlStr.indexOf("#");
  if (hashIndex !== -1) {
    result.hash = urlStr.substring(hashIndex + 1);
    urlWithoutHash = urlStr.substring(0, hashIndex);
  }

  let urlWithoutQuery = urlWithoutHash;
  const queryIndex = urlWithoutHash.indexOf("?");
  if (queryIndex !== -1) {
    result.query = urlWithoutHash.substring(queryIndex + 1);
    urlWithoutQuery = urlWithoutHash.substring(0, queryIndex);
  }

  if (urlWithoutQuery.startsWith("/")) {
    // Absolute path (starts with /)
    result.isAbsolute = true;
    result.path = urlWithoutQuery;
  } else {
    // Relative path
    result.isRelative = true;
    result.path = urlWithoutQuery;
  }

  return result;
}

/**
 * Formats a URL according to the specified style
 *
 * @param url - The URL to format
 * @param options - Formatting options
 * @returns Formatted URL string, or the default value
 *
 * @example
 * ```ts
 * // Database format (normalized, preserves full URL structure)
 * formatUrl("https://example.com/path?query=value#hash") // "https://example.com/path?query=value#hash"
 * formatUrl("http://example.com") // "http://example.com"
 * formatUrl("/relative/path") // "/relative/path"
 * formatUrl("relative/path") // "relative/path"
 *
 * // Human display format (without protocol, truncated query/hash)
 * formatUrl("https://example.com/path", { style: "human" }) // "example.com/path"
 * formatUrl("https://example.com/path?verylongquerystring=value", { style: "human" }) // "example.com/path?verylongquerystring=val..."
 * formatUrl("https://example.com/path#verylonghashfragment", { style: "human" }) // "example.com/path#verylonghashfrag..."
 *
 * // Link format (with protocol, for href attributes)
 * formatUrl("example.com/path", { style: "link" }) // "https://example.com/path"
 * formatUrl("//example.com/path", { style: "link" }) // "https://example.com/path"
 * formatUrl("/relative/path", { style: "link" }) // "/relative/path" (preserves relative/absolute paths)
 * formatUrl("relative/path", { style: "link" }) // "relative/path" (preserves relative paths)
 * ```
 */
export function formatUrl<T extends string | null | undefined>(
  url: unknown,
  options: FormatUrlOptions = { style: "human" }
): string | T {
  const style = options.style ?? "human";
  const defaultValue = options.defaultValue ?? (null as T);
  const maxQueryLength = options.maxQueryLength ?? 50;
  const maxHashLength = options.maxHashLength ?? 30;

  if (isNullOrUndefined(url)) {
    return defaultValue as string | T;
  }

  const urlStr = toString(url, "").trim();

  if (urlStr === "") {
    return defaultValue as string | T;
  }

  const components = parseUrl(urlStr);

  // Database format: normalize and preserve full structure
  if (style === "database") {
    if (components.isFull && components.url) {
      // Full URL - use native URL API and normalize
      const normalizedUrl = new URL(components.url);
      const protocol = normalizedUrl.protocol.toLowerCase().replace(":", "");
      normalizedUrl.hostname = normalizedUrl.hostname.toLowerCase();
      normalizedUrl.pathname = normalizedUrl.pathname.toLowerCase();
      // Reconstruct URL string to preserve authentication if present
      let result = `${protocol}://`;
      if (normalizedUrl.username || normalizedUrl.password) {
        result += `${normalizedUrl.username || ""}${
          normalizedUrl.password ? `:${normalizedUrl.password}` : ""
        }@`;
      }
      result += normalizedUrl.host;
      result += normalizedUrl.pathname;
      if (normalizedUrl.search) {
        result += normalizedUrl.search;
      }
      if (normalizedUrl.hash) {
        result += normalizedUrl.hash;
      }
      return result;
    } else {
      // Absolute or relative path - preserve as-is
      let normalized = components.path;
      if (components.query) {
        normalized += `?${components.query}`;
      }
      if (components.hash) {
        normalized += `#${components.hash}`;
      }
      return normalized;
    }
  }

  // Link format: ensure protocol for full URLs, preserve relative/absolute paths
  if (style === "link") {
    const defaultProtocol =
      (options as LinkFormatUrlOptions).defaultProtocol ?? "https";

    if (components.isFull && components.url) {
      // Already has protocol - use native URL API
      let result = components.url.toString();
      // Remove trailing slash for root paths
      if (
        components.url.pathname === "/" &&
        !components.url.search &&
        !components.url.hash
      ) {
        result = result.replace(/\/$/, "");
      }
      return result;
    } else if (components.isProtocolRelative) {
      // Protocol-relative URL - add default protocol using native URL
      try {
        const url = new URL(`${defaultProtocol}:${components.originalUrl}`);
        let result = url.toString();
        // Remove trailing slash for root paths (only if original didn't have one)
        if (
          url.pathname === "/" &&
          !url.search &&
          !url.hash &&
          !components.originalUrl.endsWith("/")
        ) {
          result = result.replace(/\/$/, "");
        }
        return result;
      } catch {
        // Fallback if URL parsing fails
        return `${defaultProtocol}:${components.originalUrl}`;
      }
    } else if (components.isAbsolute) {
      // Absolute path - preserve as-is (don't add protocol)
      let link = components.path;
      if (components.query) {
        link += `?${components.query}`;
      }
      if (components.hash) {
        link += `#${components.hash}`;
      }
      return link;
    } else {
      // Check if it looks like a domain (has a dot and matches domain pattern)
      // This handles cases like "example.com" or "example.com/path"
      // But preserves relative paths like "path/to/file" or "./file.html"
      const domainPattern =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+/;
      const firstPart = components.path.split("/")[0];

      if (domainPattern.test(firstPart) && !components.path.startsWith(".")) {
        // Looks like a domain without protocol - add default protocol using native URL
        try {
          const url = new URL(`${defaultProtocol}://${urlStr}`);
          let result = url.toString();
          // Remove trailing slash for root paths
          if (url.pathname === "/" && !url.search && !url.hash) {
            result = result.replace(/\/$/, "");
          }
          return result;
        } catch {
          // Fallback if URL parsing fails
          return `${defaultProtocol}://${urlStr}`;
        }
      } else {
        // Relative path - preserve as-is (don't add protocol)
        let link = components.path;
        if (components.query) {
          link += `?${components.query}`;
        }
        if (components.hash) {
          link += `#${components.hash}`;
        }
        return link;
      }
    }
  }

  // Human display format: remove protocol, truncate query/hash
  const truncateQuery =
    "truncateQuery" in options ? options.truncateQuery ?? true : true;
  const truncateHash =
    "truncateHash" in options ? options.truncateHash ?? true : true;

  let display = "";

  if (components.isFull && components.url) {
    // Full URL - remove protocol using native URL properties
    // Reconstruct host with authentication if present
    let hostPart = components.url.host;
    if (components.url.username || components.url.password) {
      const auth = `${components.url.username || ""}${
        components.url.password ? `:${components.url.password}` : ""
      }`;
      hostPart = `${auth}@${components.url.host}`;
    }
    // Use pathname and preserve trailing slash if original had it
    let pathname = components.url.pathname;
    // Only remove trailing slash if original URL didn't have one
    if (
      pathname === "/" &&
      !components.url.search &&
      !components.url.hash &&
      !components.originalUrl.endsWith("/")
    ) {
      pathname = "";
    }
    display = `${hostPart}${pathname}`;
  } else {
    // Relative or absolute path - use as-is
    display = components.path;
  }

  // Add query string (truncated if needed)
  if (components.isFull && components.url) {
    // Use native URL search property
    const search = components.url.search;
    if (search) {
      let query = search.substring(1); // Remove leading '?'
      if (truncateQuery && query.length > maxQueryLength) {
        query = truncate(query, maxQueryLength);
      }
      display += `?${query}`;
    }
  } else if (components.query) {
    let query = components.query;
    if (truncateQuery && query.length > maxQueryLength) {
      query = truncate(query, maxQueryLength);
    }
    display += `?${query}`;
  }

  // Add hash/fragment (truncated if needed)
  if (components.isFull && components.url) {
    // Use native URL hash property
    const hash = components.url.hash;
    if (hash) {
      let hashValue = hash.substring(1); // Remove leading '#'
      if (truncateHash && hashValue.length > maxHashLength) {
        hashValue = truncate(hashValue, maxHashLength);
      }
      display += `#${hashValue}`;
    }
  } else if (components.hash) {
    let hash = components.hash;
    if (truncateHash && hash.length > maxHashLength) {
      hash = truncate(hash, maxHashLength);
    }
    display += `#${hash}`;
  }

  return display;
}
