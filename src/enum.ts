/**
 * Properties that can be defined for each enum entry.
 * The `label` property is optional and will default to the key if not provided.
 * Any additional properties can be included and will be preserved in the output.
 *
 * @example
 * ```typescript
 * {
 *   label: 'Donor',
 *   variant: 'primary',
 *   description: 'Individual who makes donations',
 * }
 * ```
 */
export interface EnumEntryProps {
  /** Display label for the enum value. Defaults to the key if not provided. */
  label?: string;
  /** Allow any additional properties */
  [key: string]: unknown;
}

/**
 * Output properties for enum entries.
 * Always includes `value` and `label`, plus any additional properties from the input.
 */
export interface EnumEntryOutput {
  /** The enum value (key) */
  value: string | number;
  /** The display label */
  label: string;
  /** Any additional properties from the input */
  [key: string]: unknown;
}

/**
 * Map of enum keys to their properties.
 * Keys can be strings or numbers.
 */
export interface EnumDefinition {
  [key: string | number]: EnumEntryProps;
}

/**
 * Type that maps enum keys to their literal key values.
 * Useful for type-safe access: `CONTACT_TAG.values.donor` has type `"donor"`.
 */
type EnumValues<T extends EnumDefinition> = {
  [K in keyof T]: K;
};

/**
 * Full properties for a single enum entry, including the value and all input properties.
 */
type EnumEntry<T extends EnumDefinition, K extends keyof T> = {
  label: string;
  value: K;
} & Omit<T[K], "label">;

/**
 * Array of all enum entries with their full properties.
 * Useful for populating dropdowns and select components.
 */
type EnumOptions<T extends EnumDefinition> = Array<EnumEntry<T, keyof T>>;

/**
 * Map of enum keys to their full entry objects.
 */
type EnumEntries<T extends EnumDefinition> = {
  [K in keyof T]: EnumEntry<T, K>;
};

/**
 * Untyped enum mapper interface (for internal use).
 */
export interface UntypedEnumMapper {
  readonly values: Readonly<Record<string, string>>;
  readonly options: readonly EnumEntryOutput[];
  readonly enumMap: Readonly<Record<string, EnumEntryOutput>>;
  getLabel(value: string | number): string;
  getValue(label: string): string | number;
  isValueValid(value: string | number): boolean;
}

/**
 * Typed enum mapper that provides type-safe access to enum values, options, and utilities.
 *
 * @template T - The enum definition type
 *
 * @example
 * ```typescript
 * const CONTACT_TAG = createTypedEnum({
 *   donor: {
 *     label: 'Donor',
 *     variant: 'primary',
 *     description: 'Individual who makes donations'
 *   },
 *   volunteer: {
 *     label: 'Volunteer',
 *     variant: 'info',
 *     description: 'Person who volunteers time and effort'
 *   }
 * });
 *
 * // Type-safe values
 * const tag: "donor" | "volunteer" = CONTACT_TAG.values.donor;
 *
 * // Array for dropdowns
 * const options = CONTACT_TAG.options; // [{ value: "donor", label: "Donor", ... }, ...]
 *
 * // Get label by value
 * const label = CONTACT_TAG.getLabel("donor"); // "Donor"
 *
 * // Check if value is valid
 * if (CONTACT_TAG.isValueValid("donor")) {
 *   // TypeScript knows it's a valid enum value here
 * }
 * ```
 */
export interface TypedEnum<T extends EnumDefinition>
  extends Omit<
    UntypedEnumMapper,
    "values" | "options" | "enumMap" | "isValueValid"
  > {
  /** Object mapping enum keys to their literal key values for type-safe access */
  readonly values: EnumValues<T>;
  /** Array of all enum entries, useful for populating dropdowns and select components */
  readonly options: EnumOptions<T>;
  /** Map of enum keys to their full entry objects */
  readonly enumMap: EnumEntries<T>;
  /**
   * Converts the enum to an array of [value, label] tuples.
   * @returns Array of tuples where each tuple is [value, label]
   */
  toTupleArray(): [string | number, string][];
  /**
   * Gets the label for a given enum value.
   * @param value - The enum value to get the label for
   * @returns The label, or the value as a string if no label is defined
   */
  getLabel(value: string | number): string;
  /**
   * Gets the enum value for a given label.
   * @param label - The label to find the value for
   * @returns The enum value
   * @throws Error if no enum value is found for the given label
   */
  getValue(label: string): string | number;
  /**
   * Type guard to check if a value is a valid enum key.
   * @param value - The value to check
   * @returns True if the value is a valid enum key, false otherwise
   */
  isValueValid(
    value: string | number
  ): value is Extract<keyof T, string | number>;
}

/**
 * Helper function to normalize enum keys.
 * Converts numeric string keys to numbers to preserve type information.
 *
 * @param key - The key to normalize
 * @param enumMap - The enum definition map
 * @returns The normalized key (number if it was a numeric string, otherwise the original string)
 */
function normalizeKey(key: string, enumMap: EnumDefinition): string | number {
  const numKey = Number(key);
  if (!isNaN(numKey) && numKey.toString() === key && key in enumMap) {
    // Key is a valid numeric string (e.g., "100", not "100.5" or "100abc")
    // and it exists in the enumMap - use the number version
    return numKey;
  }
  return key;
}

/**
 * Creates a typed enum definition from a map of enum entries.
 *
 * This function allows you to define enum-like constants once and use them for:
 * - Type-safe enum values
 * - Arrays for populating dropdowns/selects
 * - Label/value lookups
 * - Any other use case where you need enum-like behavior without repetition
 *
 * @template T - The enum definition type
 * @param enumMap - An object mapping enum keys to their properties
 * @returns A typed enum mapper with values, options, and utility methods
 *
 * @example
 * ```typescript
 * export const CONTACT_TAG = createTypedEnum({
 *   donor: {
 *     label: 'Donor',
 *     variant: 'primary',
 *     description: 'Individual who makes donations'
 *   },
 *   volunteer: {
 *     label: 'Volunteer',
 *     variant: 'info',
 *     description: 'Person who volunteers time and effort'
 *   }
 * });
 *
 * // Use as type
 * type ContactTag = keyof typeof CONTACT_TAG.values; // "donor" | "volunteer"
 *
 * // Use in dropdown
 * <select>
 *   {CONTACT_TAG.options.map(option => (
 *     <option key={option.value} value={option.value}>
 *       {option.label}
 *     </option>
 *   ))}
 * </select>
 *
 * // Get label
 * const label = CONTACT_TAG.getLabel("donor"); // "Donor"
 *
 * // Check validity
 * if (CONTACT_TAG.isValueValid(userInput)) {
 *   // TypeScript knows userInput is a valid enum value
 * }
 * ```
 */
export function createTypedEnum<T extends EnumDefinition>(
  enumMap: T
): TypedEnum<T> {
  type Key = Extract<keyof T, string | number>;

  // Create values object where each key maps to its literal value
  const values = {} as EnumValues<T>;
  for (const key in enumMap) {
    if (Object.prototype.hasOwnProperty.call(enumMap, key)) {
      const normalizedKey = normalizeKey(key, enumMap);
      (values as Record<string | number, string | number>)[key] =
        normalizedKey as Key;
    }
  }

  // Helper to preserve all properties except "label" (which we add ourselves)
  const preserveProps = (entry: EnumEntryProps): Record<string, unknown> => {
    const rest: Record<string, unknown> = {};
    for (const prop in entry) {
      if (
        prop !== "label" &&
        Object.prototype.hasOwnProperty.call(entry, prop)
      ) {
        rest[prop] = entry[prop];
      }
    }
    return rest;
  };

  // Create options array - preserve all properties from input
  const options = Object.entries(enumMap).map(([key, entry]) => {
    const normalizedKey = normalizeKey(key, enumMap);
    const base = {
      label: entry.label ?? String(key),
      value: normalizedKey as Key,
    };
    return { ...base, ...preserveProps(entry) } as EnumEntry<T, Key>;
  });

  // Create enumMap object - preserve all properties from input
  const enumMapResult = {} as EnumEntries<T>;
  for (const key in enumMap) {
    if (Object.prototype.hasOwnProperty.call(enumMap, key)) {
      const entry = enumMap[key];
      const normalizedKey = normalizeKey(key, enumMap);
      const base = {
        label: entry.label ?? String(key),
        value: normalizedKey as Key,
      };
      (enumMapResult as unknown as Record<string | number, EnumEntry<T, Key>>)[
        key
      ] = {
        ...base,
        ...preserveProps(entry),
      } as EnumEntry<T, Key>;
    }
  }

  return {
    values: values as EnumValues<T>,
    options: options as EnumOptions<T>,
    enumMap: enumMapResult as EnumEntries<T>,
    toTupleArray: (): [string | number, string][] => {
      return Object.entries(enumMap).map(([key, entry]) => [
        normalizeKey(key, enumMap),
        entry.label ?? String(key),
      ]);
    },
    getLabel: (value: string | number): string => {
      return enumMap[value as keyof T]?.label ?? String(value);
    },
    getValue: (label: string): string | number => {
      const found = Object.entries(enumMap).find(
        ([_, entry]) => entry.label === label
      );
      if (!found) {
        throw new Error(`No enum value found for label: ${label}`);
      }
      return normalizeKey(found[0], enumMap);
    },
    isValueValid: (
      value: string | number
    ): value is Extract<keyof T, string | number> => {
      return value in enumMap;
    },
  } as const;
}

/**
 * Extracts the enum keys (values) from either a TypedEnum instance or an EnumDefinition.
 *
 * @template T - Either a TypedEnum instance or an EnumDefinition
 *
 * @example
 * ```typescript
 * // From a TypedEnum instance
 * const CONTACTS = createTypedEnum({
 *   donor: { label: "Donor" },
 *   volunteer: { label: "Volunteer" }
 * });
 * type Contact = Enum<typeof CONTACTS>; // "donor" | "volunteer"
 *
 * // From an EnumDefinition type
 * type ContactDefinition = {
 *   donor: { label: string };
 *   volunteer: { label: string };
 * };
 * type Contact = Enum<ContactDefinition>; // "donor" | "volunteer"
 * ```
 */
export type Enum<T extends TypedEnum<any> | EnumDefinition> =
  T extends TypedEnum<infer U>
    ? Extract<keyof U, string | number>
    : T extends EnumDefinition
    ? Extract<keyof T, string | number>
    : never;
