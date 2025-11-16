# dry-types

Reusable utility functions for type conversions and checks. Stop writing the same type conversion and validation code over and over.

## Installation

```bash
npm install @jasonbyrne/dry-types
```

## Usage

```javascript
import { toNumber, isNumber, toString, isString } from "@jasonbyrne/dry-types";

// Type conversions
const num = toNumber("42"); // 42
const str = toString(42); // '42'

// Type checks
if (isNumber(value)) {
  // TypeScript knows value is number here
  console.log(value * 2);
}
```

## API Reference

### Type Guards and Validators (`is*`)

Functions that check if a value matches a certain condition. Return `boolean` and use TypeScript type predicates when appropriate.

#### General Type Checks

- `isNullOrUndefined(value: unknown): value is null | undefined` - Checks if value is null or undefined
- `isUndefined(value: unknown): value is undefined` - Checks if value is undefined
- `isNull(value: unknown): value is null` - Checks if value is null
- `isEmpty(value: unknown): boolean` - Checks if value is empty (null, undefined, empty string, empty array, or empty object)
- `isFalsy(value: unknown): boolean` - Checks if value is falsy
- `isTruthy(value: unknown): boolean` - Checks if value is truthy
- `isTrue(value: unknown): boolean` - Checks if value is exactly `true`
- `isFalse(value: unknown): boolean` - Checks if value is exactly `false`
- `isBoolean(value: unknown): value is boolean` - Checks if value is a boolean
- `isFunction(value: unknown): value is Function` - Checks if value is a function
- `isPrimitive(value: unknown): value is string | number | boolean | null | undefined | symbol | bigint` - Checks if value is a primitive type
- `isSymbol(value: unknown): value is symbol` - Checks if value is a Symbol

#### String Validators

- `isString(value: unknown): value is string` - Checks if value is a string
- `isNonEmptyString(value: unknown): value is string` - Checks if value is a non-empty string (after trimming)
- `isEmail(value: unknown): boolean` - Validates email format
- `isUrl(value: unknown): boolean` - Validates URL format
- `isUuid(value: unknown): boolean` - Validates UUID format (supports all UUID versions)
- `isNumericString(value: unknown): boolean` - Checks if string contains only numbers
- `isJsonString(value: unknown): value is string` - Checks if value is a valid JSON string

#### Number Validators

- `isNumber(value: unknown): value is number` - Checks if value is a valid number (not NaN and finite)
- `isInteger(value: unknown): value is number` - Checks if value is an integer
- `isPositiveNumber(value: unknown): value is number` - Checks if value is a positive number
- `isNegativeNumber(value: unknown): value is number` - Checks if value is a negative number
- `isNonNegativeNumber(value: unknown): value is number` - Checks if value is a non-negative number (zero or positive)
- `isNonPositiveNumber(value: unknown): value is number` - Checks if value is a non-positive number (zero or negative)
- `isNumberBetween(value: unknown, min: number, max: number): boolean` - Checks if number is between two values (inclusive)
- `isGreaterThan(value: unknown, min: number): boolean` - Checks if number is greater than a minimum value
- `isGreaterThanOrEqualTo(value: unknown, min: number): boolean` - Checks if number is greater than or equal to a minimum value
- `isLessThan(value: unknown, max: number): boolean` - Checks if number is less than a maximum value
- `isLessThanOrEqualTo(value: unknown, max: number): boolean` - Checks if number is less than or equal to a maximum value

#### Array Validators

- `isArray(value: unknown): value is any[]` - Checks if value is an array
- `isEmptyArray(value: unknown): value is any[]` - Checks if array is empty
- `isNonEmptyArray(value: unknown): value is any[]` - Checks if array has items (is not empty)

#### Object Validators

- `isObject(value: unknown): value is Record<string, unknown>` - Checks if value is an object (not null, not array)
- `isPlainObject(value: unknown): value is Record<string, unknown>` - Checks if value is a plain object (not array, Date, RegExp, etc.)
- `isEmptyObject(value: unknown): boolean` - Checks if object has no keys

#### Date Validators

- `isDate(value: unknown): value is Date` - Checks if value is a Date object
- `isDateString(value: unknown): value is string` - Checks if value is a date string in YYYY-MM-DD format
- `isTimeString(value: unknown): value is string` - Checks if value is a time string in HH:MM:SS format
- `isDateTimeString(value: unknown): value is string` - Checks if value is a date-time string in YYYY-MM-DDTHH:MM:SS format
- `isDateBetween(value: unknown, start: unknown, end: unknown): boolean` - Checks if date is between two other dates (inclusive)
- `isAfter(value: unknown, date: unknown): boolean` - Checks if date is after another date
- `isBefore(value: unknown, date: unknown): boolean` - Checks if date is before another date
- `isBeforeEndDate(dateToCheck: unknown, endDate: unknown): boolean` - Checks if date is before end date (treats end date as end of day)
- `isAfterStartDate(dateToCheck: unknown, startDate: unknown): boolean` - Checks if date is after start date (treats start date as start of day)
- `isDateInRange(dateToCheck: unknown, startDate: unknown, endDate: unknown): boolean` - Checks if date is within a date range
- `isToday(date: unknown): boolean` - Checks if date is today

### Type Converters (`to*`)

Functions that transform or convert a value from one type/format to another. Return the converted value or a default value if conversion fails.

#### String Converters

- `toString(value: unknown, defaultValue?: string): string` - Converts a value to a string
- `toTrimmedString(value: unknown, defaultValue?: string): string` - Converts a value to a trimmed string (removes leading and trailing whitespace)
- `toLowerCase(value: unknown, defaultValue?: string): string` - Converts a value to lowercase
- `toUpperCase(value: unknown, defaultValue?: string): string` - Converts a value to uppercase
- `toCapitalized(value: unknown, defaultValue?: string): string` - Capitalizes the first letter of a string
- `toCamelCase(value: unknown, defaultValue?: string): string` - Converts a string to camelCase
- `toSnakeCase(value: unknown, defaultValue?: string): string` - Converts a string to snake_case
- `toKebabCase(str: string): string` - Converts a string to kebab-case (lowercase with hyphens)
- `toPascalCase(str: string): string` - Converts a string to PascalCase (capitalizes first letter of each word, no separators)
- `toTitleCase(str: string): string` - Converts a string to title case (capitalizes first letter of each word, except common articles/prepositions)
- `toSentenceCase(str: string): string` - Converts a string to sentence case (capitalizes first letter of each word, rest lowercase)
- `truncate(value: unknown, maxLength: number, suffix?: string): string` - Truncates a string to a maximum length with an optional suffix
- `stripSpecialCharacters(str: string): string` - Removes special characters from a string, keeping only alphanumeric characters, hyphens, and spaces
- `stripExtraWhitespace(str: string): string` - Replaces multiple consecutive whitespace characters with a single space
- `getClampedString<T extends string>(value: unknown, enumValues: T[]): T` - Gets a clamped string from a value and an array of enum values

#### Number Converters

- `toNumber(value: unknown, defaultValue?: number): number` - Converts a value to a number
- `toInteger(value: unknown, defaultValue?: number): number` - Converts a value to an integer
- `toPositiveNumber(value: unknown, defaultValue?: number): number` - Converts a value to a positive number
- `toNegativeNumber(value: unknown, defaultValue?: number): number` - Converts a value to a negative number
- `toNonNegativeNumber(value: unknown, defaultValue?: number): number` - Converts a value to a non-negative number (zero or positive)
- `toNonPositiveNumber(value: unknown, defaultValue?: number): number` - Converts a value to a non-positive number (zero or negative)
- `toClampedNumber(value: unknown, min: number, max: number): number` - Clamps a number between a minimum and maximum value
- `round(value: unknown, precision?: number): number` - Rounds a number to a specified precision
- `roundDown(value: unknown, precision?: number): number` - Rounds a number down to a specified precision
- `roundUp(value: unknown, precision?: number): number` - Rounds a number up to a specified precision

#### Date Converters

- `toDate(value: unknown, defaultValue?: Date | null): Date | null` - Converts a value to a Date object
- `toEpochMsTimestamp(value: unknown, defaultValue?: number | null): number | null` - Converts a value to an epoch timestamp in milliseconds
- `toEpochSecondsTimestamp(value: unknown, defaultValue?: number | null): number | null` - Converts a value to an epoch timestamp in seconds
- `toISODateString(value: unknown, defaultValue?: string | null): string | null` - Converts a value to an ISO date string
- `toLocaleDateString(value: unknown, defaultValue?: string | null, opts?: DateTimeFormatOptions): string | null` - Converts a value to a locale-formatted date string
- `toLocaleTimeString(value: unknown, defaultValue?: string | null, opts?: DateTimeFormatOptions): string | null` - Converts a value to a locale-formatted time string
- `toDateString(value: unknown, defaultValue?: string | null): string | null` - Converts a value to a date string in YYYY-MM-DD format
- `toTimeString(value: unknown, defaultValue?: string | null): string | null` - Converts a value to a time string in HH:MM:SS format
- `toDateTimeString(value: unknown, defaultValue?: string | null): string | null` - Converts a value to a date-time string in YYYY-MM-DD HH:MM:SS format

#### Array Converters

- `toArray(value: unknown, defaultValue?: any[]): any[]` - Converts a value to an array
- `toUniqueArray(value: unknown, defaultValue?: any[]): any[]` - Converts a value to a unique array (removes duplicates)
- `toStringArray(value: unknown, defaultValue?: string[]): string[]` - Converts a value to an array of strings
- `toNumberArray(value: unknown, defaultValue?: number[]): number[]` - Converts a value to an array of numbers
- `toFlattenedArray<T>(array: T[] | undefined | null, depth?: number): any[]` - Flattens a nested array to a specified depth

#### Object Converters

- `toObject(value: unknown, defaultValue?: Record<string, unknown>): Record<string, unknown>` - Converts a value to an object
- `toKeysArray(obj: unknown): string[]` - Gets object keys as an array
- `toValuesArray(obj: unknown): unknown[]` - Gets object values as an array

#### Other Converters

- `toBoolean(value: unknown): boolean` - Converts a value to a boolean
- `toLength(value: unknown): number` - Gets the length of a value (strings, arrays, objects, numbers)
- `toCurrency(value: unknown, defaultValue?: string, opts?: { locale?: string; currency?: string; allowNegative?: boolean }): string` - Converts a value to a currency-formatted string
- `toJSON(value: unknown, defaultValue?: string | null): string | null` - Safely stringify a value to JSON
- `fromJSON<T>(value: unknown, defaultValue: T): T` - Safely parse a JSON string

### Getters and Computed Values (`get*`)

Functions that retrieve or compute a value from input(s). These don't convert types but rather extract or calculate values.

#### Array Getters

- `getFirst<T, D>(array: T[] | undefined | null, defaultValue?: D): T | D | undefined` - Gets the first element of an array
- `getLast<T, D>(array: T[] | undefined | null, defaultValue?: D): T | D | undefined` - Gets the last element of an array
- `getSum(array: unknown[] | undefined | null): number` - Calculates the sum of an array of numbers
- `getAverage(array: unknown[] | undefined | null): number` - Calculates the average of an array of numbers
- `getMax(array: unknown[] | undefined | null): number | undefined` - Gets the maximum value from an array
- `getMin(array: unknown[] | undefined | null): number | undefined` - Gets the minimum value from an array

#### Date Getters

- `getDateDifference(value: unknown, date: unknown): number` - Gets the difference between two dates in milliseconds
- `getDaysBetween(date1: unknown, date2: unknown): number | null` - Gets the number of days between two dates
- `getMonthsBetween(date1: unknown, date2: unknown): number | null` - Gets the number of months between two dates
- `getYearsBetween(date1: unknown, date2: unknown): number | null` - Gets the number of years between two dates
- `getAge(birthDate: unknown): number | null` - Calculates age from a birth date
- `getRelativeTime(date: unknown, options?: RelativeTimeOptions): string | null` - Gets a human-readable relative time string (e.g., "2 years ago", "3 minutes ago")
- `getLastDateOfMonth(value?: unknown): string` - Gets the last date of the month for a given date
- `getLastDateOfYear(value?: unknown): string` - Gets the last date of the year for a given date
- `getLastDateOfWeek(value?: unknown): string` - Gets the last date of the week (7 days from the given date)
- `getLastDateOfQuarter(value?: unknown): string` - Gets the last date of the quarter for a given date
- `getFirstDateOfMonth(value?: unknown): string` - Gets the first date of the month for a given date
- `getFirstDateOfYear(value?: unknown): string` - Gets the first date of the year for a given date
- `getFirstDateOfWeek(value?: unknown): string` - Gets the first date of the week (Sunday) for a given date
- `getFirstDateOfQuarter(value?: unknown): string` - Gets the first date of the quarter for a given date
- `getStartOfDay(value: unknown): Date | null` - Converts a date value to the start of that day (00:00:00.000)
- `getEndOfDay(value: unknown): Date | null` - Converts a date value to the end of that day (23:59:59.999)
- `getCurrentDateString(): string` - Returns the current date string in YYYY-MM-DD format
- `getMinDate(values: Array<unknown>): Date | null` - Returns the earliest (minimum) date from the provided values
- `getMaxDate(values: Array<unknown>): Date | null` - Returns the latest (maximum) date from the provided values
- `getNumbersBetween(min: number, max: number, step?: number): number[]` - Generates an array of numbers between min and max (inclusive) with a specified step

#### Object Getters

- `hasProperty(obj: unknown, key: string | number | symbol): boolean` - Checks if an object has a property
- `getProperty<T, K, D>(obj: T, key: K, defaultValue?: D): unknown` - Safely gets a property from an object with a default value

### Generators (`generate*`)

Functions that generate or create new values, often random or unique.

- `generatePassword(length?: number): string` - Generates a secure random password
- `generateUniqueId(prefix?: string): string` - Generates a unique ID for form elements and other components

### Random Selection (`pick*`)

Functions that randomly select or pick values from collections.

- `pickRandom<T>(arr: T[]): T` - Picks a random element from an array
- `pickRandom<T>(arr: T[], count: number): T[]` - Picks multiple random elements from an array
- `pickRandomIndex<T>(arr: T[]): number` - Picks a random index from an array
- `pickRandomIndex<T>(arr: T[], count: number): number[]` - Picks multiple random indices from an array

### Random Generators

- `randomInt(min: number, max: number): number` - Generates a random integer between min and max (inclusive)
- `randomFloat(min: number, max: number): number` - Generates a random floating-point number between min (inclusive) and max (exclusive)
- `randomBoolean(): boolean` - Generates a random boolean value
- `randomString(length: number): string` - Generates a random alphanumeric string of specified length
- `randomDate(min: Date, max: Date): Date` - Generates a random Date between min and max
- `randomColor(): string` - Generates a random hex color code

### Date Operations

- `addDays(days: number, date?: unknown): string` - Adds days to a date and returns the result as a YYYY-MM-DD string
- `addMonths(date: unknown, months: number): Date | null` - Adds months to a date
- `addYears(date: unknown, years: number): Date | null` - Adds years to a date
- `addHours(date: unknown, hours: number): Date | null` - Adds hours to a date
- `addMinutes(date: unknown, minutes: number): Date | null` - Adds minutes to a date
- `addSeconds(date: unknown, seconds: number): Date | null` - Adds seconds to a date
- `compareDates(date1: unknown, date2: unknown): number | null` - Compares two date values (-1 if date1 < date2, 0 if equal, 1 if date1 > date2)

### Regex Utilities

- `matchesAnyPattern(input: string, patterns: Array<Pattern>): boolean` - Tests if any of the provided patterns match the input string
- `matchesAllPatterns(input: string, patterns: Array<Pattern>): boolean` - Tests if all of the provided patterns match the input string
- `extractFromAnyPattern(input: string, patterns: Array<Pattern>): RegExpMatchArray | null` - Returns the first successful match from any of the provided patterns
- `extractAllMatches(input: string, patterns: Array<Pattern>): RegExpMatchArray[]` - Returns all matches from all patterns that match the input
- `extractCaptureGroup(input: string, patterns: Array<Pattern>, groupIndex?: number): string | null` - Extracts a specific capture group from the first matching pattern
- `extractAllCaptureGroups(input: string, patterns: Array<Pattern>): string[]` - Extracts all capture groups from the first matching pattern
- `findFirstMatchingPattern(input: string, patterns: Array<Pattern>): Pattern | null` - Finds the first pattern that matches (returns the pattern itself, not the match)
- `extractBetween(input: string, startPattern: Pattern, endPattern: Pattern): string | null` - Extracts text between two patterns
- `extractNumbers(input: string, patterns: Array<Pattern>): number[]` - Extracts numeric values from the first matching pattern's capture groups
- `matchAndExtract<T>(input: string, patterns: Array<Pattern>, extractor: (match: RegExpMatchArray) => T): T | null` - Tests if input matches a pattern and extracts a specific data type using a custom extractor function
- `toRegex(pattern: string, caseInsensitive?: boolean, escapeSpecialChars?: boolean): RegExp` - Converts a string pattern to a RegExp
- `containsAny(input: string, patterns: Array<Pattern>): boolean` - Tests if the input string contains any of the provided patterns
- `containsAll(input: string, patterns: Array<Pattern>): boolean` - Tests if the input string contains all of the provided patterns
- `findIndexOfFirstMatch(input: string, patterns: Array<Pattern>): number` - Finds the index of the first pattern that matches the input

### Hash Utilities

- `generateObjectHash(data: unknown): Promise<string>` - Creates a SHA-256 hash from a JSON object (normalizes the object by sorting properties)
- `generateQuickHash(data: unknown): number` - Creates a deterministic hash from any JSON-serializable data (synchronous, not cryptographically secure)

### Enum Utilities

- `createTypedEnum<T extends EnumDefinition>(enumMap: T): TypedEnum<T>` - Creates a typed enum definition from a map of enum entries
- `Enum<T>` - Type that extracts enum keys from either a TypedEnum instance or an EnumDefinition

#### Enum Types

- `EnumEntryProps` - Properties that can be defined for each enum entry
- `EnumEntryOutput` - Output properties for enum entries
- `EnumDefinition` - Map of enum keys to their properties
- `TypedEnum<T>` - Typed enum mapper that provides type-safe access to enum values, options, and utilities

### Utility Functions

- `ifDefined<Input, Output>(value: Input | undefined, callback: (value: Input) => Output): Output | undefined` - Type-safe conditional transformation: returns undefined if value is undefined, otherwise transforms the value using the callback function
- `coalesce<T>(...values: T[]): T | null` - Returns the first non-null, non-undefined value from the provided arguments
- `defer(fn: () => Promise<void> | void, delay?: number): ReturnType<typeof setTimeout>` - Defers execution of a function by a specified delay
- `debounce<TArgs, TResult>(func: (...args: TArgs) => Promise<TResult>, delay?: number): (...args: TArgs) => Promise<TResult>` - Debounces an async function, executing it only after the specified delay has passed since the last invocation
- `deepEquals(a: unknown, b: unknown, aStack?: unknown[], bStack?: unknown[]): boolean` - Performs a deep equality comparison between two values, handling circular references

### Type Exports

The library also exports useful TypeScript utility types:

#### Generic Types (from `generics.ts`)

- `Maybe<T>` - `T | null | undefined`
- `Primitive` - Union of all primitive types
- `Object<T>` - `Record<string, T>`
- `Nullable<T>` - `T | null`
- `Optional<T>` - `T | undefined`
- `Required<T>` - Makes T required (not undefined)
- `Readonly<T>` - Makes all properties readonly
- `Writable<T>` - Makes all properties writable
- `DeepReadonly<T>` - Makes all properties recursively readonly
- `DeepWritable<T>` - Makes all properties recursively writable
- `WithRequired<T, K>` - Make K in T required
- `RequireOnly<T, K>` - Make everything in T optional, except for the keys in K

#### Regex Types (from `regex.ts`)

- `Pattern` - `RegExp | string` - Type for regex patterns used in regex utility functions

#### Date Types (from `date/constants.ts`)

- `DateTimeFormatOptions` - Options for locale-specific date/time formatting
- `MonthFormatOptions` - Options for formatting months (format, locale)
- `DayOfWeekFormatOptions` - Options for formatting days of week (format, locale)
- `RelativeTimeOptions` - Options for relative time formatting (referenceDate, threshold, round, maxUnit, minUnit)

#### Number Types (from `number.ts`)

- `NumberFormatOptions` - Options for number formatting

#### Currency Types (from `currency.ts`)

- `CurrencyFormatOptions` - Options for currency formatting

#### Password Types (from `password.ts`)

- `GeneratePasswordOptions` - Options for password generation
- `PasswordRules` - Rules for password validation

## Naming Conventions

This library follows consistent naming patterns to make the API predictable and easy to use:

### `is*` - Type Guards and Validators

Functions that check if a value matches a certain condition. Return `boolean` and use TypeScript type predicates when appropriate.

**Pattern:** `is[Condition](value, ...args): boolean`

### `to*` - Type Converters

Functions that transform or convert a value from one type/format to another. Return the converted value or a default value if conversion fails.

**Pattern:** `to[TargetType](value, defaultValue?, ...opts?): TargetType | DefaultType`

### `get*` - Getters and Computed Values

Functions that retrieve or compute a value from input(s). These don't convert types but rather extract or calculate values.

**Pattern:** `get[ComputedValue](value?, ...args?): ReturnType`

### `generate*` - Generators

Functions that generate or create new values, often random or unique.

**Pattern:** `generate[Type](...args?): ReturnType`

### `pick*` - Random Selection

Functions that randomly select or pick values from collections.

**Pattern:** `pick[Type](collection, count?): ReturnType`

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

## License

MIT © Jason Byrne
