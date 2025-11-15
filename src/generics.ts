export type Maybe<T> = T | null | undefined;

export type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint;

export type Object<T = unknown> = Record<string, T>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Required<T> = T extends undefined ? never : T;

export type Readonly<T> = { readonly [K in keyof T]: T[K] };

export type Writable<T> = { -readonly [K in keyof T]: T[K] };

export type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

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
