import {
  ifDefined,
  coalesce,
  toLength,
  toBoolean,
  toJSON,
  fromJSON,
  defer,
  debounce,
  generatePassword,
  generateUniqueId,
  deepEquals,
} from "../src/util.js";
import {
  isNullOrUndefined,
  isUndefined,
  isNull,
  isEmpty,
  isFalsy,
  isTruthy,
  isTrue,
  isFalse,
  isBoolean,
  isFunction,
  isPrimitive,
  isSymbol,
} from "../src/is.js";

describe("util", () => {
  describe("isNullOrUndefined", () => {
    it("should return true for null", () => {
      expect(isNullOrUndefined(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    it("should return false for other values", () => {
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined("")).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
      expect(isNullOrUndefined([])).toBe(false);
      expect(isNullOrUndefined({})).toBe(false);
    });
  });

  describe("isUndefined", () => {
    it("should return true for undefined", () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it("should return false for other values", () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined("")).toBe(false);
    });
  });

  describe("isNull", () => {
    it("should return true for null", () => {
      expect(isNull(null)).toBe(true);
    });

    it("should return false for other values", () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull("")).toBe(false);
    });
  });

  describe("ifDefined", () => {
    it("should return undefined if value is undefined", () => {
      expect(ifDefined(undefined, (x: number) => x * 2)).toBeUndefined();
    });

    it("should apply callback if value is defined", () => {
      expect(ifDefined(5, (x) => x * 2)).toBe(10);
      expect(ifDefined("hello", (x) => x.toUpperCase())).toBe("HELLO");
    });
  });

  describe("coalesce", () => {
    it("should return first non-null, non-undefined value", () => {
      expect(coalesce<string | number | null | undefined>(null, undefined, "hello")).toBe("hello");
      expect(coalesce<number | string | null | undefined>(undefined, 123)).toBe(123);
      expect(coalesce("first", "second")).toBe("first");
    });

    it("should return null if all values are null/undefined", () => {
      expect(coalesce(null, undefined, null)).toBe(null);
      expect(coalesce(undefined, undefined)).toBe(null);
    });
  });

  describe("toLength", () => {
    it("should return length for strings", () => {
      expect(toLength("hello")).toBe(5);
      expect(toLength("")).toBe(0);
    });

    it("should return length for arrays", () => {
      expect(toLength([1, 2, 3])).toBe(3);
      expect(toLength([])).toBe(0);
    });

    it("should return number of keys for objects", () => {
      expect(toLength({ a: 1, b: 2 })).toBe(2);
      expect(toLength({})).toBe(0);
    });

    it("should return string length for numbers", () => {
      expect(toLength(123)).toBe(3);
      expect(toLength(0)).toBe(1);
    });

    it("should return 0 for null/undefined", () => {
      expect(toLength(null)).toBe(0);
      expect(toLength(undefined)).toBe(0);
    });
  });

  describe("toBoolean", () => {
    it("should return false for null/undefined", () => {
      expect(toBoolean(null)).toBe(false);
      expect(toBoolean(undefined)).toBe(false);
    });

    it("should return boolean values as-is", () => {
      expect(toBoolean(true)).toBe(true);
      expect(toBoolean(false)).toBe(false);
    });

    it("should return true for string 'true'", () => {
      expect(toBoolean("true")).toBe(true);
      expect(toBoolean("TRUE")).toBe(true);
      expect(toBoolean("True")).toBe(true);
    });

    it("should return false for other strings", () => {
      expect(toBoolean("false")).toBe(false);
      expect(toBoolean("hello")).toBe(false);
      expect(toBoolean("")).toBe(false);
    });

    it("should return true for positive numbers", () => {
      expect(toBoolean(1)).toBe(true);
      expect(toBoolean(100)).toBe(true);
    });

    it("should return false for zero and negative numbers", () => {
      expect(toBoolean(0)).toBe(false);
      expect(toBoolean(-1)).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("should return true for null/undefined", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should return true for empty strings", () => {
      expect(isEmpty("")).toBe(true);
    });

    it("should return false for non-empty strings", () => {
      expect(isEmpty("hello")).toBe(false);
    });

    it("should return true for empty arrays", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("should return false for non-empty arrays", () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it("should return true for empty objects", () => {
      expect(isEmpty({})).toBe(true);
    });

    it("should return false for non-empty objects", () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe("isFalsy", () => {
    it("should return true for falsy values", () => {
      expect(isFalsy(false)).toBe(true);
      expect(isFalsy(0)).toBe(true);
      expect(isFalsy("")).toBe(true);
      expect(isFalsy(null)).toBe(true);
      expect(isFalsy(undefined)).toBe(true);
      expect(isFalsy(NaN)).toBe(true);
    });

    it("should return false for truthy values", () => {
      expect(isFalsy(true)).toBe(false);
      expect(isFalsy(1)).toBe(false);
      expect(isFalsy("hello")).toBe(false);
      expect(isFalsy([])).toBe(false);
      expect(isFalsy({})).toBe(false);
    });
  });

  describe("isTruthy", () => {
    it("should return true for truthy values", () => {
      expect(isTruthy(true)).toBe(true);
      expect(isTruthy(1)).toBe(true);
      expect(isTruthy("hello")).toBe(true);
      expect(isTruthy([])).toBe(true);
      expect(isTruthy({})).toBe(true);
    });

    it("should return false for falsy values", () => {
      expect(isTruthy(false)).toBe(false);
      expect(isTruthy(0)).toBe(false);
      expect(isTruthy("")).toBe(false);
      expect(isTruthy(null)).toBe(false);
      expect(isTruthy(undefined)).toBe(false);
      expect(isTruthy(NaN)).toBe(false);
    });
  });

  describe("isTrue", () => {
    it("should return true only for boolean true", () => {
      expect(isTrue(true)).toBe(true);
    });

    it("should return false for other values", () => {
      expect(isTrue(false)).toBe(false);
      expect(isTrue(1)).toBe(false);
      expect(isTrue("true")).toBe(false);
    });
  });

  describe("isFalse", () => {
    it("should return true only for boolean false", () => {
      expect(isFalse(false)).toBe(true);
    });

    it("should return false for other values", () => {
      expect(isFalse(true)).toBe(false);
      expect(isFalse(0)).toBe(false);
      expect(isFalse("false")).toBe(false);
    });
  });

  describe("isBoolean", () => {
    it("should return true for boolean values", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it("should return false for non-boolean values", () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean("true")).toBe(false);
      expect(isBoolean("false")).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean([])).toBe(false);
      expect(isBoolean({})).toBe(false);
    });

    it("should narrow TypeScript types correctly", () => {
      const value: unknown = true;
      if (isBoolean(value)) {
        // TypeScript should know value is boolean here
        expect(typeof value).toBe("boolean");
        expect(value).toBe(true);
      }
    });
  });

  describe("isFunction", () => {
    it("should return true for functions", () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction(function* () {})).toBe(true);
      expect(isFunction(class {})).toBe(true);
    });

    it("should return false for non-functions", () => {
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(0)).toBe(false);
      expect(isFunction("")).toBe(false);
      expect(isFunction(true)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
    });

    it("should narrow TypeScript types correctly", () => {
      const value: unknown = () => {};
      if (isFunction(value)) {
        // TypeScript should know value is Function here
        expect(typeof value).toBe("function");
      }
    });
  });

  describe("isPrimitive", () => {
    it("should return true for primitive types", () => {
      expect(isPrimitive(null)).toBe(true);
      expect(isPrimitive(undefined)).toBe(true);
      expect(isPrimitive("string")).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(false)).toBe(true);
      expect(isPrimitive(Symbol("test"))).toBe(true);
      expect(isPrimitive(BigInt(123))).toBe(true);
    });

    it("should return false for non-primitive types", () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
      expect(isPrimitive(() => {})).toBe(false);
      expect(isPrimitive(new Date())).toBe(false);
      expect(isPrimitive(/regex/)).toBe(false);
    });
  });

  describe("isSymbol", () => {
    it("should return true for Symbol values", () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol("test"))).toBe(true);
      expect(isSymbol(Symbol.for("key"))).toBe(true);
    });

    it("should return false for non-Symbol values", () => {
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
      expect(isSymbol("string")).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol(true)).toBe(false);
      expect(isSymbol({})).toBe(false);
      expect(isSymbol([])).toBe(false);
    });

    it("should narrow TypeScript types correctly", () => {
      const value: unknown = Symbol("test");
      if (isSymbol(value)) {
        // TypeScript should know value is symbol here
        expect(typeof value).toBe("symbol");
      }
    });
  });

  describe("toJSON", () => {
    it("should stringify valid values", () => {
      expect(toJSON({ a: 1, b: 2 }, "default")).toBe('{"a":1,"b":2}');
      expect(toJSON([1, 2, 3], "default")).toBe("[1,2,3]");
      expect(toJSON("string", "default")).toBe('"string"');
      expect(toJSON(123, "default")).toBe("123");
      expect(toJSON(true, "default")).toBe("true");
      expect(toJSON(null, "default")).toBe("null");
    });

    it("should return default value for circular references", () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      expect(toJSON(circular, "default")).toBe("default");
    });

    it("should return default value for functions", () => {
      expect(toJSON(() => {}, "default")).toBe("default");
      expect(toJSON(function () {}, "default")).toBe("default");
    });

    it("should return default value for undefined", () => {
      expect(toJSON(undefined, "default")).toBe("default");
    });

    it("should handle BigInt by returning default", () => {
      expect(toJSON(BigInt(123), "default")).toBe("default");
    });
  });

  describe("fromJSON", () => {
    it("should parse valid JSON strings", () => {
      expect(fromJSON('{"a":1,"b":2}', {})).toEqual({ a: 1, b: 2 });
      expect(fromJSON("[1,2,3]", [])).toEqual([1, 2, 3]);
      expect(fromJSON('"string"', "")).toBe("string");
      expect(fromJSON("123", 0)).toBe(123);
      expect(fromJSON("true", false)).toBe(true);
      expect(fromJSON("null", {})).toBe(null);
    });

    it("should return default value for invalid JSON", () => {
      expect(fromJSON("{ invalid json }", {})).toEqual({});
      expect(fromJSON("not json", "default")).toBe("default");
      expect(fromJSON("", "default")).toBe("default");
    });

    it("should return default value for non-string values", () => {
      expect(fromJSON(null, "default")).toBe("default");
      expect(fromJSON(123, "default")).toBe("default");
      expect(fromJSON({}, "default")).toBe("default");
      expect(fromJSON([], "default")).toBe("default");
      expect(fromJSON(undefined, "default")).toBe("default");
    });

    it("should return default value for empty string", () => {
      expect(fromJSON("", "default")).toBe("default");
    });
  });

  describe("defer", () => {
    it("should defer function execution", (done) => {
      let called = false;
      defer(() => {
        called = true;
        expect(called).toBe(true);
        done();
      }, 10);
      expect(called).toBe(false);
    });

    it("should return timeout ID", () => {
      const timeoutId = defer(() => {}, 100);
      expect(typeof timeoutId).toBe("object");
      clearTimeout(timeoutId);
    });
  });

  describe("debounce", () => {
    it("should debounce async function calls", async () => {
      let callCount = 0;
      const debouncedFn = debounce(async () => {
        callCount++;
        return callCount;
      }, 50);

      // Call multiple times quickly
      const promise1 = debouncedFn();
      const promise2 = debouncedFn();
      const promise3 = debouncedFn();

      // All should resolve to the same value (last call)
      const results = await Promise.all([promise1, promise2, promise3]);
      expect(results[0]).toBe(results[1]);
      expect(results[1]).toBe(results[2]);
      expect(callCount).toBe(1);
    });

    it("should handle errors", async () => {
      const debouncedFn = debounce(async () => {
        throw new Error("test error");
      }, 50);

      await expect(debouncedFn()).rejects.toThrow("test error");
    });
  });

  describe("generatePassword", () => {
    it("should generate password of specified length", () => {
      const password = generatePassword(12);
      expect(password.length).toBe(12);
    });

    it("should generate different passwords", () => {
      const password1 = generatePassword(12);
      const password2 = generatePassword(12);
      // Very unlikely to be the same
      expect(password1).not.toBe(password2);
    });

    it("should use default length if not specified", () => {
      const password = generatePassword();
      expect(password.length).toBe(12);
    });

    it("should contain alphanumeric and special characters", () => {
      const password = generatePassword(100);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[!@#$%^&*]/.test(password)).toBe(true);
    });
  });

  describe("generateUniqueId", () => {
    it("should generate unique ID", () => {
      const id = generateUniqueId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should generate different IDs", () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      expect(id1).not.toBe(id2);
    });

    it("should include prefix if provided", () => {
      const id = generateUniqueId("test");
      expect(id.startsWith("test-")).toBe(true);
    });

    it("should work without prefix", () => {
      const id = generateUniqueId();
      expect(id).not.toContain("-");
    });
  });

  describe("deepEquals", () => {
    it("should return true for equal primitives", () => {
      expect(deepEquals(1, 1)).toBe(true);
      expect(deepEquals("hello", "hello")).toBe(true);
      expect(deepEquals(true, true)).toBe(true);
      expect(deepEquals(null, null)).toBe(true);
    });

    it("should return false for different primitives", () => {
      expect(deepEquals(1, 2)).toBe(false);
      expect(deepEquals("hello", "world")).toBe(false);
      expect(deepEquals(true, false)).toBe(false);
    });

    it("should return true for equal objects", () => {
      expect(deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    });

    it("should return false for different objects", () => {
      expect(deepEquals({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(deepEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should return true for equal arrays", () => {
      expect(deepEquals([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false for different arrays", () => {
      expect(deepEquals([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEquals([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should handle nested objects", () => {
      expect(deepEquals({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(deepEquals({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it("should handle Date objects", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-01");
      const date3 = new Date("2024-01-02");
      expect(deepEquals(date1, date2)).toBe(true);
      expect(deepEquals(date1, date3)).toBe(false);
    });

    it("should handle circular references", () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;
      const obj2: any = { a: 1 };
      obj2.self = obj2;
      expect(deepEquals(obj1, obj2)).toBe(true);
    });

    it("should return false for different types", () => {
      expect(deepEquals(1, "1")).toBe(false);
      expect(deepEquals([], {})).toBe(false);
    });
  });
});

