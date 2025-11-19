/**
 * A type that represents a value that might be null or undefined
 */
export type Maybe<T> = T | null | undefined;

/**
 * A union type representing all primitive JavaScript types
 */
export type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint;

/**
 * A generic object type with string keys
 */
export type Object<T = unknown> = Record<string, T>;

/**
 * A type that allows null in addition to the base type
 */
export type Nullable<T> = T | null;

/**
 * A type that allows undefined in addition to the base type
 */
export type Optional<T> = T | undefined;

/**
 * A type that removes undefined from a type (makes it required)
 */
export type Required<T> = T extends undefined ? never : T;

/**
 * A type that removes undefined from a type, similar to Required but with a different name
 * Useful when you want to exclude undefined but keep the semantic meaning clear
 */
export type NotUndefined<T> = T extends undefined ? never : T;

/**
 * Makes all properties of T readonly
 */
export type Readonly<T> = { readonly [K in keyof T]: T[K] };

/**
 * Makes all readonly properties of T writable
 */
export type Writable<T> = { -readonly [K in keyof T]: T[K] };

/**
 * Recursively makes all properties of T readonly, including nested objects
 */
export type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

/**
 * Recursively makes all readonly properties of T writable, including nested objects
 */
export type DeepWritable<T> = { -readonly [K in keyof T]: DeepWritable<T[K]> };

/**
 * Make K in T required
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Make everything in T optional, except for the keys in K
 */
export type RequireOnly<T, K extends keyof T> = Partial<T> & {
  [P in K]-?: T[P];
};

/**
 * Recursively makes all properties of T optional, including nested objects
 * Unlike Partial, this applies the optional modifier deeply to all nested properties
 *
 * @example
 * ```ts
 * type User = { name: string; address: { street: string; city: string } };
 * type PartialUser = DeepPartial<User>;
 * // Result: { name?: string; address?: { street?: string; city?: string } }
 * ```
 */
export type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;

/**
 * Makes at least one of the specified keys required in type T
 * All other keys remain optional, but at least one of the specified keys must be present
 *
 * @param T - The base type
 * @param Keys - The keys that must have at least one required (defaults to all keys)
 *
 * @example
 * ```ts
 * type Config = { host?: string; port?: number; path?: string };
 * type RequiredConfig = RequireAtLeastOne<Config, 'host' | 'port'>;
 * // Result: At least one of 'host' or 'port' must be provided
 * ```
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * A plain object type with string keys
 */
export type PlainObject<T = unknown> = Record<string, T>;

type JSONPrimitive = string | number | boolean | null;
type JSONObject = { [key: string]: JSON };
type JSONArray = JSON[];
/**
 * A type representing any valid JSON value (primitive, object, or array)
 */
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

/**
 * Extracts the return type of an async function after unwrapping the Promise
 * Similar to ReturnType, but unwraps Promise<T> to T
 *
 * @param T - An async function type that returns a Promise
 * @returns The unwrapped return type of the Promise
 *
 * @example
 * ```ts
 * async function fetchUser(): Promise<{ id: number; name: string }> {
 *   return { id: 1, name: 'John' };
 * }
 * type User = AsyncReturnType<typeof fetchUser>;
 * // Result: { id: number; name: string }
 * ```
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>;

/**
 * Flattens intersection types to make them more readable in IDE tooltips
 * Converts complex intersection types into a single object type for better type display
 *
 * @param T - The type to prettify
 * @returns A flattened version of the type that's easier to read
 *
 * @example
 * ```ts
 * type A = { a: number };
 * type B = { b: string };
 * type Intersection = A & B;
 * type Prettified = Prettify<Intersection>;
 * // Result: { a: number; b: string } (instead of A & B in tooltips)
 * ```
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Constraint type for number formatting - determines which values are allowed
 */
export type NumberConstraint =
  | "positive-only" // Only positive numbers (> 0)
  | "negative-only" // Only negative numbers (< 0)
  | "non-negative" // Zero and positive (>= 0)
  | "non-positive" // Zero and negative (<= 0)
  | "non-zero" // All except zero
  | "zero-only"; // Only zero

/**
 * Sign display type for number formatting - determines how signs are displayed
 */
export type SignDisplay =
  | "auto" // Default: show - for negatives only
  | "always" // Always show sign: + for positives, - for negatives
  | "exceptZero" // Show sign except for zero
  | "negative" // Only show - for negatives (same as auto)
  | "never" // Never show sign
  | "parentheses"; // Use parentheses for negatives: (100), no sign for positives
