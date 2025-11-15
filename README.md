# dry-types

A reusable TypeScript library for conversions, checks, and comparisons for types.

I am tired of writing the same type conversions and checks over and over.

## Features

- **Type Checking**: `is*` functions to check types (isString, isNumber, isArray, isDate, etc.)
- **Type Conversion**: `to*` functions to convert types (toString, toNumber, toArray, toDate, etc.)
- **Formatting**: `format*` functions to convert to strings with formatting options
- **Utilities**: Helper functions like coalesce, sort, isAfter, isBefore, minDate, maxDate, and more

## Installation

```bash
npm install dry-types
```

## Usage

### String Utilities

```typescript
import { isString, toString, formatString } from 'dry-types';

// Check if value is a string
isString('hello'); // true
isString(123); // false

// Convert to string
toString(123); // '123'
toString(null); // ''
toString(new Date('2024-01-01')); // '2024-01-01T00:00:00.000Z'

// Format strings
formatString('  HELLO  ', { trim: true, lowercase: true }); // 'hello'
formatString('hello world', { maxLength: 5 }); // 'hello'
```

### Number Utilities

```typescript
import { isNumber, toNumber, formatNumber } from 'dry-types';

// Check if value is a number
isNumber(123); // true
isNumber(NaN); // false

// Convert to number
toNumber('123'); // 123
toNumber('abc'); // 0
toNumber('abc', 42); // 42 (default value)
toNumber(true); // 1

// Format numbers
formatNumber(1234.5678); // '1,234.57'
formatNumber(1234.5678, { decimals: 0 }); // '1,235'
formatNumber(1234.56, { thousandsSeparator: ' ', decimalSeparator: ',' }); // '1 234,56'
```

### Array Utilities

```typescript
import { isArray, toArray, sort, sortBy } from 'dry-types';

// Check if value is an array
isArray([1, 2, 3]); // true
isArray('array'); // false

// Convert to array
toArray([1, 2, 3]); // [1, 2, 3]
toArray('hello'); // ['hello']
toArray(null); // []

// Sort arrays
sort([3, 1, 2]); // [1, 2, 3]
sort(['c', 'a', 'b']); // ['a', 'b', 'c']

// Sort by property
const items = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 },
];
sortBy(items, 'name'); // Sorted by name ascending
sortBy(items, 'age', 'desc'); // Sorted by age descending
```

### Date Utilities

```typescript
import { isDate, toDate, formatDate, isAfter, isBefore, minDate, maxDate } from 'dry-types';

// Check if value is a date
isDate(new Date()); // true
isDate('2024-01-01'); // false

// Convert to date
toDate('2024-01-01'); // Date object
toDate(1234567890000); // Date from timestamp

// Format dates
formatDate(new Date('2024-01-01T12:00:00.000Z'), 'ISO'); // '2024-01-01T12:00:00.000Z'
formatDate(new Date(), 'date'); // Local date string
formatDate(new Date(), 'time'); // Local time string

// Compare dates
isAfter(new Date('2024-01-02'), new Date('2024-01-01')); // true
isBefore(new Date('2024-01-01'), new Date('2024-01-02')); // true

// Find min/max dates
minDate(new Date('2024-01-02'), new Date('2024-01-01'), new Date('2024-01-03')); // 2024-01-01
maxDate(new Date('2024-01-01'), new Date('2024-01-02'), new Date('2024-01-03')); // 2024-01-03
```

### General Utilities

```typescript
import { coalesce, isDefined, isNullOrUndefined, isBoolean, toBoolean, isObject, clone } from 'dry-types';

// Return first non-null/undefined value
coalesce(null, undefined, 'hello', 'world'); // 'hello'
coalesce(null, 0, 1); // 0

// Check for null/undefined
isNullOrUndefined(null); // true
isDefined('hello'); // true

// Boolean utilities
isBoolean(true); // true
toBoolean('true'); // true
toBoolean('yes'); // true
toBoolean(1); // true

// Object utilities
isObject({}); // true
isObject([]); // false

// Deep clone
const obj = { a: 1, b: { c: 2 } };
const cloned = clone(obj); // Deep copy
```

## API Reference

### String Functions
- `isString(value)` - Check if value is a string
- `toString(value)` - Convert value to string
- `formatString(value, options)` - Format string with options (uppercase, lowercase, trim, maxLength)

### Number Functions
- `isNumber(value)` - Check if value is a number
- `toNumber(value, defaultValue?)` - Convert value to number
- `formatNumber(value, options)` - Format number with options (decimals, separators)

### Array Functions
- `isArray(value)` - Check if value is an array
- `toArray(value)` - Convert value to array
- `sort(array, compareFn?)` - Sort array
- `sortBy(array, key, order?)` - Sort array by property

### Date Functions
- `isDate(value)` - Check if value is a Date
- `toDate(value, defaultValue?)` - Convert value to Date
- `formatDate(value, format)` - Format date (ISO, locale, date, time, datetime)
- `isAfter(date, compareDate)` - Check if date is after another
- `isBefore(date, compareDate)` - Check if date is before another
- `minDate(...dates)` - Get minimum date
- `maxDate(...dates)` - Get maximum date

### General Functions
- `coalesce(...values)` - Return first non-null/undefined value
- `isNullOrUndefined(value)` - Check if value is null or undefined
- `isDefined(value)` - Check if value is defined
- `isBoolean(value)` - Check if value is a boolean
- `toBoolean(value)` - Convert value to boolean
- `isObject(value)` - Check if value is an object
- `clone(value)` - Deep clone a value

## License

ISC
