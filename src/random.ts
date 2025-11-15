/**
 * Picks a random element from an array, or multiple random elements if count is provided
 * @param arr - The array to pick from
 * @param count - Optional number of random elements to pick
 * @returns A single random element, or an array of random elements if count is provided
 * @example
 * ```ts
 * pickRandom([1, 2, 3, 4, 5]) // Returns one random number
 * pickRandom([1, 2, 3, 4, 5], 3) // Returns array of 3 random numbers
 * ```
 */
export function pickRandom<T>(arr: T[]): T;
export function pickRandom<T>(arr: T[], count: number): T[];
export function pickRandom<T>(arr: T[], count?: number) {
  if (count === undefined) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  count = Math.floor(Math.min(count, arr.length));
  if (count <= 0) return [];
  return arr.sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Picks a random index from an array, or multiple random indices if count is provided
 * @param arr - The array to pick indices from
 * @param count - Optional number of random indices to pick
 * @returns A single random index, or an array of random indices if count is provided
 * @example
 * ```ts
 * pickRandomIndex([1, 2, 3, 4, 5]) // Returns one random index (0-4)
 * pickRandomIndex([1, 2, 3, 4, 5], 3) // Returns array of 3 random indices
 * ```
 */
export function pickRandomIndex<T>(arr: T[]): number;
export function pickRandomIndex<T>(arr: T[], count: number): number[];
export function pickRandomIndex<T>(
  arr: T[],
  count?: number
): number | number[] {
  if (count === undefined) {
    return Math.floor(Math.random() * arr.length);
  }
  count = Math.floor(Math.min(count, arr.length));
  if (count <= 0) return [];

  // Generate array of indices [0, 1, 2, ..., arr.length-1]
  const indices = Array.from({ length: arr.length }, (_, i) => i);
  // Shuffle the indices and return the first 'count' indices
  return indices.sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 * @example
 * ```ts
 * randomInt(1, 10) // Returns a random integer from 1 to 10
 * ```
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random floating-point number between min (inclusive) and max (exclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns A random float between min and max
 * @example
 * ```ts
 * randomFloat(0, 1) // Returns a random float from 0 to 0.999...
 * ```
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random boolean value
 * @returns A random boolean (true or false)
 * @example
 * ```ts
 * randomBoolean() // Returns true or false randomly
 * ```
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}

/**
 * Generates a random alphanumeric string of specified length
 * @param length - The desired length of the string
 * @returns A random string of the specified length
 * @example
 * ```ts
 * randomString(8) // Returns a random 8-character string
 * ```
 */
export function randomString(length: number): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

/**
 * Generates a random Date between min and max
 * @param min - The minimum date
 * @param max - The maximum date
 * @returns A random Date between min and max
 * @example
 * ```ts
 * randomDate(new Date("2024-01-01"), new Date("2024-12-31")) // Random date in 2024
 * ```
 */
export function randomDate(min: Date, max: Date): Date {
  const range = max.getTime() - min.getTime();
  const randomTime = Math.random() * range;
  return new Date(min.getTime() + randomTime);
}

/**
 * Generates a random hex color code
 * @returns A random hex color string (e.g., "#a3f2b1")
 * @example
 * ```ts
 * randomColor() // Returns a random hex color like "#ff3a2b"
 * ```
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}
