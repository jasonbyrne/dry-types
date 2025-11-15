/**
 * Utility functions for creating cryptographic hashes
 */

/**
 * Creates a SHA-256 hash from a JSON object
 * Normalizes the object by sorting properties to ensure consistent hashing
 * regardless of property order
 *
 * @param data - Any JSON-serializable object
 * @returns A hex string representation of the SHA-256 hash
 */
export async function createObjectHash(data: unknown): Promise<string> {
  // Normalize the object by sorting keys
  const normalized = JSON.stringify(data, (_, value) => {
    // If value is an object and not null, sort its keys
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((result: Record<string, unknown>, key) => {
          result[key] = value[key];
          return result;
        }, {});
    }
    // Handle arrays by recursively sorting their contents if they contain objects
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (item && typeof item === "object") {
          // Recursively apply the same normalization to array items
          return JSON.parse(
            JSON.stringify(item, (_, v) => {
              if (v && typeof v === "object" && !Array.isArray(v)) {
                return Object.keys(v)
                  .sort()
                  .reduce((result: Record<string, unknown>, key) => {
                    result[key] = v[key];
                    return result;
                  }, {});
              }
              return v;
            })
          );
        }
        return item;
      });
    }
    return value;
  });

  // Convert the normalized string to a buffer
  const encoder = new TextEncoder();
  const data_buffer = encoder.encode(normalized);

  // Create the hash
  const hash_buffer = await crypto.subtle.digest("SHA-256", data_buffer);

  // Convert the hash to a hex string
  return Array.from(new Uint8Array(hash_buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates a deterministic hash from any JSON-serializable data
 * This is a synchronous version that returns a simple hash
 * Not cryptographically secure, but useful for quick object comparison
 *
 * @param data - Any JSON-serializable object
 * @returns A numeric hash code
 */
export function quickHash(data: unknown): number {
  const str = JSON.stringify(data, (_, value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((result: Record<string, unknown>, key) => {
          result[key] = value[key];
          return result;
        }, {});
    }
    return value;
  });

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
