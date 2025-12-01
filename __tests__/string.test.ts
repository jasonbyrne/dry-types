import {
  toString,
  toTrimmedString,
  toLowerCase,
  toUpperCase,
  toCapitalized,
  truncate,
  toCamelCase,
  toSnakeCase,
  toTitleCase,
  toKebabCase,
  toPascalCase,
  toSentenceCase,
  stripSpecialCharacters,
  stripExtraWhitespace,
  getClampedString,
  padCenter,
  stripNonAlphanumeric,
  stripNonNumeric,
  stripNonAlphabetic,
  reverse,
  countOccurrences,
  slugify,
  mask,
  escapeHtml,
  unescapeHtml,
  escapeRegex,
  pluralize,
} from "../src/string.js";
import {
  isString,
  isNonEmptyString,
  isEmail,
  isUrl,
  isUuid,
  isNumericString,
} from "../src/is.js";

describe("string", () => {
  describe("isString", () => {
    it("should return true for strings", () => {
      expect(isString("")).toBe(true);
      expect(isString("hello")).toBe(true);
      expect(isString("123")).toBe(true);
    });

    it("should return false for non-strings", () => {
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(123)).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe("isNonEmptyString", () => {
    it("should return true for non-empty strings", () => {
      expect(isNonEmptyString("hello")).toBe(true);
      expect(isNonEmptyString("123")).toBe(true);
      expect(isNonEmptyString("  hello  ")).toBe(true);
    });

    it("should return false for empty strings", () => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString("   ")).toBe(false);
      expect(isNonEmptyString("\t\n")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return the value if it is already a string", () => {
      expect(toString("hello")).toBe("hello");
      expect(toString("")).toBe("");
    });

    it("should convert numbers to strings", () => {
      expect(toString(123)).toBe("123");
      expect(toString(45.67)).toBe("45.67");
      expect(toString(0)).toBe("0");
    });

    it("should convert booleans to strings", () => {
      expect(toString(true)).toBe("true");
      expect(toString(false)).toBe("false");
    });

    it("should convert objects to strings", () => {
      expect(toString({})).toBe("[object Object]");
      expect(toString([])).toBe("");
    });

    it("should return default value for null", () => {
      expect(toString(null)).toBe("");
      expect(toString(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toString(undefined)).toBe("");
      expect(toString(undefined, "default")).toBe("default");
    });
  });

  describe("toTrimmedString", () => {
    it("should trim whitespace from strings", () => {
      expect(toTrimmedString("  hello  ")).toBe("hello");
      expect(toTrimmedString("\t\nworld\n\t")).toBe("world");
      expect(toTrimmedString("  ")).toBe("");
    });

    it("should convert and trim non-string values", () => {
      expect(toTrimmedString(123)).toBe("123");
      expect(toTrimmedString(true)).toBe("true");
    });

    it("should return default value for null", () => {
      expect(toTrimmedString(null)).toBe("");
      expect(toTrimmedString(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toTrimmedString(undefined)).toBe("");
      expect(toTrimmedString(undefined, "default")).toBe("default");
    });
  });

  describe("isEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(isEmail("test@example.com")).toBe(true);
      expect(isEmail("user.name@example.co.uk")).toBe(true);
      expect(isEmail("user+tag@example.com")).toBe(true);
      expect(isEmail("user_name@example.com")).toBe(true);
      expect(isEmail("123@example.com")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(isEmail("invalid")).toBe(false);
      expect(isEmail("@example.com")).toBe(false);
      expect(isEmail("user@")).toBe(false);
      expect(isEmail("user @example.com")).toBe(false);
      expect(isEmail("user@example")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isEmail(null)).toBe(false);
      expect(isEmail(undefined)).toBe(false);
      expect(isEmail(123)).toBe(false);
      expect(isEmail({})).toBe(false);
    });
  });

  describe("isUrl", () => {
    it("should return true for valid URLs", () => {
      expect(isUrl("https://example.com")).toBe(true);
      expect(isUrl("http://example.com")).toBe(true);
      expect(isUrl("https://example.com/path")).toBe(true);
      expect(isUrl("https://example.com:8080/path?query=value")).toBe(true);
      expect(isUrl("ftp://example.com")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isUrl("not a url")).toBe(false);
      expect(isUrl("example.com")).toBe(false);
      expect(isUrl("://example.com")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isUrl(null)).toBe(false);
      expect(isUrl(undefined)).toBe(false);
      expect(isUrl(123)).toBe(false);
    });
  });

  describe("isUuid", () => {
    it("should return true for valid UUIDs", () => {
      expect(isUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isUuid("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
      expect(isUuid("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
    });

    it("should return false for invalid UUIDs", () => {
      expect(isUuid("not-a-uuid")).toBe(false);
      expect(isUuid("550e8400-e29b-41d4-a716")).toBe(false);
      expect(isUuid("550e8400e29b41d4a716446655440000")).toBe(false);
      expect(isUuid("")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isUuid(null)).toBe(false);
      expect(isUuid(undefined)).toBe(false);
      expect(isUuid(123)).toBe(false);
    });
  });

  describe("isNumericString", () => {
    it("should return true for strings containing only numbers", () => {
      expect(isNumericString("123")).toBe(true);
      expect(isNumericString("0")).toBe(true);
      expect(isNumericString("999999")).toBe(true);
    });

    it("should return false for strings containing non-numeric characters", () => {
      expect(isNumericString("123abc")).toBe(false);
      expect(isNumericString("12.34")).toBe(false);
      expect(isNumericString("-123")).toBe(false);
      expect(isNumericString("+123")).toBe(false);
      expect(isNumericString("12 34")).toBe(false);
      expect(isNumericString("")).toBe(false);
    });

    it("should return false for non-strings", () => {
      expect(isNumericString(null)).toBe(false);
      expect(isNumericString(undefined)).toBe(false);
      expect(isNumericString(123)).toBe(false);
    });
  });

  describe("toLowerCase", () => {
    it("should convert strings to lowercase", () => {
      expect(toLowerCase("HELLO")).toBe("hello");
      expect(toLowerCase("Hello World")).toBe("hello world");
      expect(toLowerCase("MiXeD cAsE")).toBe("mixed case");
    });

    it("should handle empty strings", () => {
      expect(toLowerCase("")).toBe("");
    });

    it("should convert non-string values", () => {
      expect(toLowerCase(123)).toBe("123");
      expect(toLowerCase(true)).toBe("true");
    });

    it("should return default value for null", () => {
      expect(toLowerCase(null)).toBe("");
      expect(toLowerCase(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toLowerCase(undefined)).toBe("");
      expect(toLowerCase(undefined, "default")).toBe("default");
    });
  });

  describe("toUpperCase", () => {
    it("should convert strings to uppercase", () => {
      expect(toUpperCase("hello")).toBe("HELLO");
      expect(toUpperCase("Hello World")).toBe("HELLO WORLD");
      expect(toUpperCase("MiXeD cAsE")).toBe("MIXED CASE");
    });

    it("should handle empty strings", () => {
      expect(toUpperCase("")).toBe("");
    });

    it("should convert non-string values", () => {
      expect(toUpperCase(123)).toBe("123");
      expect(toUpperCase(true)).toBe("TRUE");
    });

    it("should return default value for null", () => {
      expect(toUpperCase(null)).toBe("");
      expect(toUpperCase(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toUpperCase(undefined)).toBe("");
      expect(toUpperCase(undefined, "default")).toBe("default");
    });
  });

  describe("toCapitalized", () => {
    it("should capitalize first letter and lowercase the rest", () => {
      expect(toCapitalized("hello")).toBe("Hello");
      expect(toCapitalized("HELLO")).toBe("Hello");
      expect(toCapitalized("hELLO")).toBe("Hello");
      expect(toCapitalized("hello world")).toBe("Hello world");
    });

    it("should handle empty strings", () => {
      expect(toCapitalized("")).toBe("");
    });

    it("should handle single character strings", () => {
      expect(toCapitalized("a")).toBe("A");
      expect(toCapitalized("A")).toBe("A");
    });

    it("should convert non-string values", () => {
      expect(toCapitalized(123)).toBe("123");
      expect(toCapitalized(true)).toBe("True");
    });

    it("should return default value for null", () => {
      expect(toCapitalized(null)).toBe("");
      expect(toCapitalized(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toCapitalized(undefined)).toBe("");
      expect(toCapitalized(undefined, "default")).toBe("default");
    });
  });

  describe("truncate", () => {
    it("should truncate strings longer than maxLength", () => {
      expect(truncate("hello world", 5)).toBe("he...");
      expect(truncate("hello world", 8)).toBe("hello...");
    });

    it("should not truncate strings shorter than maxLength", () => {
      expect(truncate("hello", 10)).toBe("hello");
      expect(truncate("hi", 5)).toBe("hi");
    });

    it("should use custom suffix", () => {
      expect(truncate("hello world", 8, "…")).toBe("hello w…");
      expect(truncate("hello world", 5, "…")).toBe("hell…");
    });

    it("should handle edge cases", () => {
      expect(truncate("hello", 3)).toBe("...");
      expect(truncate("hello", 2)).toBe("..");
      expect(truncate("", 5)).toBe("");
    });

    it("should convert non-string values", () => {
      expect(truncate(12345, 3)).toBe("...");
      expect(truncate(null, 5)).toBe("");
      expect(truncate(undefined, 5)).toBe("");
    });
  });

  describe("toCamelCase", () => {
    it("should convert space-separated words to camelCase", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
      expect(toCamelCase("hello world test")).toBe("helloWorldTest");
    });

    it("should convert snake_case to camelCase", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
      expect(toCamelCase("hello_world_test")).toBe("helloWorldTest");
    });

    it("should convert kebab-case to camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
      expect(toCamelCase("hello-world-test")).toBe("helloWorldTest");
    });

    it("should convert PascalCase to camelCase", () => {
      expect(toCamelCase("HelloWorld")).toBe("helloWorld");
      expect(toCamelCase("HelloWorldTest")).toBe("helloWorldTest");
    });

    it("should handle mixed separators", () => {
      expect(toCamelCase("hello_world-test")).toBe("helloWorldTest");
      expect(toCamelCase("hello world_test")).toBe("helloWorldTest");
    });

    it("should handle single words", () => {
      expect(toCamelCase("hello")).toBe("hello");
      expect(toCamelCase("HELLO")).toBe("hello");
    });

    it("should handle empty strings", () => {
      expect(toCamelCase("")).toBe("");
    });

    it("should convert non-string values", () => {
      expect(toCamelCase(123)).toBe("123");
      expect(toCamelCase(true)).toBe("true");
    });

    it("should return default value for null", () => {
      expect(toCamelCase(null)).toBe("");
      expect(toCamelCase(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toCamelCase(undefined)).toBe("");
      expect(toCamelCase(undefined, "default")).toBe("default");
    });
  });

  describe("toSnakeCase", () => {
    it("should convert space-separated words to snake_case", () => {
      expect(toSnakeCase("hello world")).toBe("hello_world");
      expect(toSnakeCase("hello world test")).toBe("hello_world_test");
    });

    it("should convert camelCase to snake_case", () => {
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
      expect(toSnakeCase("helloWorldTest")).toBe("hello_world_test");
    });

    it("should convert PascalCase to snake_case", () => {
      expect(toSnakeCase("HelloWorld")).toBe("hello_world");
      expect(toSnakeCase("HelloWorldTest")).toBe("hello_world_test");
    });

    it("should convert kebab-case to snake_case", () => {
      expect(toSnakeCase("hello-world")).toBe("hello_world");
      expect(toSnakeCase("hello-world-test")).toBe("hello_world_test");
    });

    it("should handle mixed separators", () => {
      expect(toSnakeCase("helloWorld-test")).toBe("hello_world_test");
      expect(toSnakeCase("hello world-test")).toBe("hello_world_test");
    });

    it("should handle single words", () => {
      expect(toSnakeCase("hello")).toBe("hello");
      expect(toSnakeCase("HELLO")).toBe("hello");
    });

    it("should handle empty strings", () => {
      expect(toSnakeCase("")).toBe("");
    });

    it("should convert non-string values", () => {
      expect(toSnakeCase(123)).toBe("123");
      expect(toSnakeCase(true)).toBe("true");
    });

    it("should return default value for null", () => {
      expect(toSnakeCase(null)).toBe("");
      expect(toSnakeCase(null, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toSnakeCase(undefined)).toBe("");
      expect(toSnakeCase(undefined, "default")).toBe("default");
    });
  });

  describe("toTitleCase", () => {
    it("should convert strings to title case", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
      expect(toTitleCase("the quick brown fox")).toBe("the quick brown fox");
      expect(toTitleCase("a tale of two cities")).toBe("a tale of two cities");
    });

    it("should handle empty strings", () => {
      expect(toTitleCase("")).toBe("");
    });

    it("should handle single words", () => {
      expect(toTitleCase("hello")).toBe("Hello");
    });
  });

  describe("toKebabCase", () => {
    it("should convert strings to kebab-case", () => {
      expect(toKebabCase("hello world")).toBe("hello-world");
      expect(toKebabCase("Hello World")).toBe("hello-world");
      expect(toKebabCase("helloWorld")).toBe("helloworld");
    });

    it("should handle empty strings", () => {
      expect(toKebabCase("")).toBe("");
    });
  });

  describe("toPascalCase", () => {
    it("should convert strings to PascalCase", () => {
      expect(toPascalCase("hello world")).toBe("Hello World");
      expect(toPascalCase("hello world test")).toBe("Hello World Test");
    });

    it("should handle empty strings", () => {
      expect(toPascalCase("")).toBe("");
    });
  });

  describe("toSentenceCase", () => {
    it("should convert strings to sentence case", () => {
      expect(toSentenceCase("HELLO WORLD")).toBe("Hello World");
      expect(toSentenceCase("hello world")).toBe("Hello World");
    });

    it("should handle empty strings", () => {
      expect(toSentenceCase("")).toBe("");
    });
  });

  describe("stripSpecialCharacters", () => {
    it("should remove special characters", () => {
      expect(stripSpecialCharacters("hello@world!")).toBe("helloworld");
      expect(stripSpecialCharacters("hello-world")).toBe("hello-world");
      expect(stripSpecialCharacters("hello world")).toBe("hello world");
      expect(stripSpecialCharacters("hello123")).toBe("hello123");
    });

    it("should handle empty strings", () => {
      expect(stripSpecialCharacters("")).toBe("");
    });
  });

  describe("stripExtraWhitespace", () => {
    it("should normalize whitespace", () => {
      expect(stripExtraWhitespace("hello    world")).toBe("hello world");
      expect(stripExtraWhitespace("hello\t\nworld")).toBe("hello world");
      expect(stripExtraWhitespace("  hello  world  ")).toBe(" hello world ");
    });

    it("should handle empty strings", () => {
      expect(stripExtraWhitespace("")).toBe("");
    });
  });

  describe("getClampedString", () => {
    it("should return the value if it's in the enum array", () => {
      expect(getClampedString("apple", ["apple", "banana", "cherry"])).toBe("apple");
      expect(getClampedString("banana", ["apple", "banana", "cherry"])).toBe("banana");
    });

    it("should return the first enum value if value is not in the array", () => {
      expect(getClampedString("orange", ["apple", "banana", "cherry"])).toBe("apple");
      expect(getClampedString("invalid", ["apple", "banana"])).toBe("apple");
    });

    it("should handle empty enum array", () => {
      expect(getClampedString("test", [])).toBeUndefined();
    });
  });

  describe("padCenter", () => {
    it("should center a string by padding on both sides", () => {
      expect(padCenter("hello", 10)).toBe("  hello   ");
      expect(padCenter("hi", 5)).toBe(" hi  ");
    });

    it("should handle strings longer than target length", () => {
      expect(padCenter("hello world", 5)).toBe("hello world");
    });

    it("should use custom padding character", () => {
      expect(padCenter("hello", 10, "*")).toBe("**hello***");
      expect(padCenter("hi", 5, "-")).toBe("-hi--");
    });

    it("should handle empty strings", () => {
      expect(padCenter("", 5)).toBe("     ");
      expect(padCenter("", 5, "*")).toBe("*****");
    });

    it("should convert non-string values", () => {
      expect(padCenter(123, 5)).toBe(" 123 ");
      expect(padCenter(null, 5)).toBe("     ");
      expect(padCenter(undefined, 5)).toBe("     ");
    });

    it("should handle odd padding lengths", () => {
      expect(padCenter("hi", 7)).toBe("  hi   "); // 2 left, 3 right
    });
  });

  describe("stripNonAlphanumeric", () => {
    it("should remove all non-alphanumeric characters", () => {
      expect(stripNonAlphanumeric("hello123!@#world")).toBe("hello123world");
      expect(stripNonAlphanumeric("test-123_abc")).toBe("test123abc");
    });

    it("should keep only letters and numbers", () => {
      expect(stripNonAlphanumeric("Hello World 123")).toBe("HelloWorld123");
      expect(stripNonAlphanumeric("a1b2c3")).toBe("a1b2c3");
    });

    it("should handle empty strings", () => {
      expect(stripNonAlphanumeric("")).toBe("");
    });
  });

  describe("stripNonNumeric", () => {
    it("should remove all non-numeric characters", () => {
      expect(stripNonNumeric("hello123world")).toBe("123");
      expect(stripNonNumeric("abc-123-def")).toBe("123");
    });

    it("should keep only digits", () => {
      expect(stripNonNumeric("Phone: 555-1234")).toBe("5551234");
      expect(stripNonNumeric("123")).toBe("123");
    });

    it("should handle empty strings", () => {
      expect(stripNonNumeric("")).toBe("");
    });
  });

  describe("stripNonAlphabetic", () => {
    it("should remove all non-alphabetic characters", () => {
      expect(stripNonAlphabetic("hello123world")).toBe("helloworld");
      expect(stripNonAlphabetic("test-123_abc")).toBe("testabc");
    });

    it("should keep only letters", () => {
      expect(stripNonAlphabetic("Hello World 123")).toBe("HelloWorld");
      expect(stripNonAlphabetic("abc")).toBe("abc");
    });

    it("should handle empty strings", () => {
      expect(stripNonAlphabetic("")).toBe("");
    });
  });

  describe("reverse", () => {
    it("should reverse a string", () => {
      expect(reverse("hello")).toBe("olleh");
      expect(reverse("world")).toBe("dlrow");
    });

    it("should handle empty strings", () => {
      expect(reverse("")).toBe("");
    });

    it("should handle single character", () => {
      expect(reverse("a")).toBe("a");
    });

    it("should handle palindromes", () => {
      expect(reverse("racecar")).toBe("racecar");
    });
  });

  describe("countOccurrences", () => {
    it("should count occurrences of a substring", () => {
      expect(countOccurrences("hello hello world", "hello")).toBe(2);
      expect(countOccurrences("banana", "na")).toBe(2);
    });

    it("should return 0 when substring not found", () => {
      expect(countOccurrences("hello world", "xyz")).toBe(0);
    });

    it("should return 0 for empty substring", () => {
      expect(countOccurrences("hello", "")).toBe(0);
    });

    it("should handle overlapping matches", () => {
      expect(countOccurrences("aaa", "aa")).toBe(2);
    });

    it("should escape special regex characters", () => {
      expect(countOccurrences("test.test", ".")).toBe(1);
      expect(countOccurrences("a*b*c", "*")).toBe(2);
    });
  });

  describe("slugify", () => {
    it("should convert string to URL-friendly slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Test String 123")).toBe("test-string-123");
    });

    it("should handle special characters", () => {
      expect(slugify("Hello@World#Test")).toBe("helloworldtest");
      expect(slugify("test_string-123")).toBe("test-string-123");
    });

    it("should trim and normalize", () => {
      expect(slugify("  Hello World  ")).toBe("hello-world");
      expect(slugify("hello---world")).toBe("hello-world");
    });

    it("should handle empty strings", () => {
      expect(slugify("")).toBe("");
    });
  });

  describe("mask", () => {
    it("should mask a portion of a string", () => {
      expect(mask("1234567890", 3, 7)).toBe("123****890");
      expect(mask("hello world", 2, 7)).toBe("he*****orld");
    });

    it("should use custom mask character", () => {
      expect(mask("1234567890", 3, 7, "X")).toBe("123XXXX890");
    });

    it("should handle edge cases", () => {
      expect(mask("hello", 0, 5)).toBe("*****");
      expect(mask("hello", 0, 0)).toBe("hello");
      expect(mask("hello", 5, 10)).toBe("hello");
    });

    it("should handle invalid ranges", () => {
      expect(mask("hello", 3, 2)).toBe("hello");
      expect(mask("hello", -1, 3)).toBe("***lo");
      expect(mask("hello", 2, 10)).toBe("he***");
    });
  });

  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<div>Hello</div>")).toBe("&lt;div&gt;Hello&lt;/div&gt;");
      expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
    });

    it("should escape ampersands", () => {
      expect(escapeHtml("A & B")).toBe("A &amp; B");
    });

    it("should handle empty strings", () => {
      expect(escapeHtml("")).toBe("");
    });
  });

  describe("unescapeHtml", () => {
    it("should unescape HTML entities", () => {
      expect(unescapeHtml("&lt;div&gt;Hello&lt;/div&gt;")).toBe("<div>Hello</div>");
      expect(unescapeHtml("He said &quot;hello&quot;")).toBe('He said "hello"');
    });

    it("should unescape ampersands", () => {
      expect(unescapeHtml("A &amp; B")).toBe("A & B");
    });

    it("should handle empty strings", () => {
      expect(unescapeHtml("")).toBe("");
    });
  });

  describe("escapeRegex", () => {
    it("should escape special regex characters", () => {
      expect(escapeRegex("test.string")).toBe("test\\.string");
      expect(escapeRegex("a*b+c?")).toBe("a\\*b\\+c\\?");
    });

    it("should escape brackets and parentheses", () => {
      expect(escapeRegex("test[123]")).toBe("test\\[123\\]");
      expect(escapeRegex("test(123)")).toBe("test\\(123\\)");
    });

    it("should handle empty strings", () => {
      expect(escapeRegex("")).toBe("");
    });
  });

  describe("pluralize", () => {
    it("should return singular form for count of 1", () => {
      expect(pluralize(1, "cat")).toBe("1 cat");
      expect(pluralize(1, "dog")).toBe("1 dog");
      expect(pluralize(1, "item")).toBe("1 item");
    });

    it("should return plural form for count not equal to 1", () => {
      expect(pluralize(0, "cat")).toBe("0 cats");
      expect(pluralize(2, "cat")).toBe("2 cats");
      expect(pluralize(5, "dog")).toBe("5 dogs");
      expect(pluralize(10, "item")).toBe("10 items");
    });

    it("should handle negative numbers", () => {
      expect(pluralize(-1, "cat")).toBe("-1 cat");
      expect(pluralize(-2, "cat")).toBe("-2 cats");
    });

    it("should use custom plural form when provided", () => {
      expect(pluralize(1, "mouse", "mice")).toBe("1 mouse");
      expect(pluralize(2, "mouse", "mice")).toBe("2 mice");
      expect(pluralize(0, "mouse", "mice")).toBe("0 mice");
      expect(pluralize(1, "child", "children")).toBe("1 child");
      expect(pluralize(3, "child", "children")).toBe("3 children");
    });

    it("should automatically pluralize words ending in s, x, z", () => {
      expect(pluralize(2, "box")).toBe("2 boxes");
      expect(pluralize(2, "bus")).toBe("2 buses");
      expect(pluralize(2, "buzz")).toBe("2 buzzes");
    });

    it("should automatically pluralize words ending in ch, sh", () => {
      expect(pluralize(2, "church")).toBe("2 churches");
      expect(pluralize(2, "dish")).toBe("2 dishes");
      expect(pluralize(2, "brush")).toBe("2 brushes");
    });

    it("should automatically pluralize words ending in y preceded by consonant", () => {
      expect(pluralize(2, "city")).toBe("2 cities");
      expect(pluralize(2, "baby")).toBe("2 babies");
      expect(pluralize(2, "country")).toBe("2 countries");
    });

    it("should automatically pluralize words ending in y preceded by vowel", () => {
      expect(pluralize(2, "day")).toBe("2 days");
      expect(pluralize(2, "toy")).toBe("2 toys");
      expect(pluralize(2, "key")).toBe("2 keys");
    });

    it("should automatically pluralize words ending in f", () => {
      expect(pluralize(2, "leaf")).toBe("2 leaves");
      expect(pluralize(2, "wolf")).toBe("2 wolves");
    });

    it("should automatically pluralize words ending in fe", () => {
      expect(pluralize(2, "knife")).toBe("2 knives");
      expect(pluralize(2, "life")).toBe("2 lives");
    });

    it("should default to adding 's' for regular nouns", () => {
      expect(pluralize(2, "cat")).toBe("2 cats");
      expect(pluralize(2, "dog")).toBe("2 dogs");
      expect(pluralize(2, "book")).toBe("2 books");
    });

    it("should handle edge cases", () => {
      expect(pluralize(1, "")).toBe("1 ");
      expect(pluralize(2, "")).toBe("2 ");
      expect(pluralize(1, "a")).toBe("1 a");
      expect(pluralize(2, "a")).toBe("2 as");
    });
  });

});

