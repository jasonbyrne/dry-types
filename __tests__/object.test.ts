import {
  toObject,
  hasProperty,
  getProperty,
  toKeysArray,
  toValuesArray,
  stripUndefined,
} from "../src/object.js";
import {
  isObject,
  isPlainObject,
  isEmptyObject,
} from "../src/is.js";

describe("object", () => {
  describe("isObject", () => {
    it("should return true for plain objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject({ a: 1, b: 2 })).toBe(true);
    });

    it("should return false for null", () => {
      expect(isObject(null)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(isObject(undefined)).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject("string")).toBe(false);
      expect(isObject(true)).toBe(false);
    });

    it("should return true for Date objects", () => {
      expect(isObject(new Date())).toBe(true);
    });

    it("should return true for RegExp objects", () => {
      expect(isObject(/test/)).toBe(true);
    });
  });

  describe("isPlainObject", () => {
    it("should return true for plain objects", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it("should return false for null", () => {
      expect(isPlainObject(null)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it("should return false for Date objects", () => {
      expect(isPlainObject(new Date())).toBe(false);
    });

    it("should return false for RegExp objects", () => {
      expect(isPlainObject(/test/)).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject("string")).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    it("should return false for class instances", () => {
      class TestClass {}
      expect(isPlainObject(new TestClass())).toBe(false);
    });
  });

  describe("isEmptyObject", () => {
    it("should return true for empty objects", () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it("should return false for objects with keys", () => {
      expect(isEmptyObject({ a: 1 })).toBe(false);
      expect(isEmptyObject({ a: 1, b: 2 })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isEmptyObject(null)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isEmptyObject([])).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(isEmptyObject(undefined)).toBe(false);
      expect(isEmptyObject(123)).toBe(false);
      expect(isEmptyObject("string")).toBe(false);
    });
  });

  describe("toObject", () => {
    it("should return the value if it is already an object", () => {
      const obj = { a: 1 };
      expect(toObject(obj)).toBe(obj);
      expect(toObject({})).toEqual({});
    });

    it("should return default value for null", () => {
      expect(toObject(null)).toEqual({});
      expect(toObject(null, { default: true })).toEqual({ default: true });
    });

    it("should return default value for undefined", () => {
      expect(toObject(undefined)).toEqual({});
      expect(toObject(undefined, { default: true })).toEqual({ default: true });
    });

    it("should wrap primitives in an object", () => {
      expect(toObject(123)).toEqual({ value: 123 });
      expect(toObject("string")).toEqual({ value: "string" });
      expect(toObject(true)).toEqual({ value: true });
    });

    it("should wrap arrays in an object", () => {
      expect(toObject([1, 2, 3])).toEqual({ value: [1, 2, 3] });
    });
  });

  describe("hasProperty", () => {
    it("should return true if object has the property", () => {
      expect(hasProperty({ a: 1 }, "a")).toBe(true);
      expect(hasProperty({ a: 1, b: 2 }, "b")).toBe(true);
    });

    it("should return false if object does not have the property", () => {
      expect(hasProperty({ a: 1 }, "b")).toBe(false);
      expect(hasProperty({}, "a")).toBe(false);
    });

    it("should return false for null", () => {
      expect(hasProperty(null, "a")).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(hasProperty([1, 2, 3], "0")).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(hasProperty(123, "a")).toBe(false);
      expect(hasProperty("string", "a")).toBe(false);
    });

    it("should work with numeric keys", () => {
      expect(hasProperty({ 0: "zero" }, 0)).toBe(true);
      expect(hasProperty({ 0: "zero" }, "0")).toBe(true);
    });

    it("should work with symbol keys", () => {
      const sym = Symbol("test");
      expect(hasProperty({ [sym]: "value" }, sym)).toBe(true);
    });

    it("should not check inherited properties", () => {
      const obj = Object.create({ inherited: "value" });
      expect(hasProperty(obj, "inherited")).toBe(false);
    });
  });

  describe("getProperty", () => {
    it("should return the property value if it exists", () => {
      expect(getProperty({ a: 1 }, "a")).toBe(1);
      expect(getProperty({ a: 1, b: 2 }, "b")).toBe(2);
    });

    it("should return default value if property does not exist", () => {
      expect(getProperty({ a: 1 }, "b", "default")).toBe("default");
      expect(getProperty({}, "a", 123)).toBe(123);
    });

    it("should return undefined if property does not exist and no default", () => {
      expect(getProperty({ a: 1 }, "b")).toBeUndefined();
    });

    it("should return default value for null", () => {
      expect(getProperty(null, "a", "default")).toBe("default");
    });

    it("should return default value for arrays", () => {
      expect(getProperty([1, 2, 3], "a", "default")).toBe("default");
    });

    it("should return default value for primitives", () => {
      expect(getProperty(123, "a", "default")).toBe("default");
    });

    it("should work with numeric keys", () => {
      expect(getProperty({ 0: "zero" }, 0)).toBe("zero");
      expect(getProperty({ 0: "zero" }, "0")).toBe("zero");
    });

    it("should work with symbol keys", () => {
      const sym = Symbol("test");
      expect(getProperty({ [sym]: "value" }, sym)).toBe("value");
    });
  });

  describe("toKeysArray", () => {
    it("should return array of keys for objects", () => {
      expect(toKeysArray({ a: 1, b: 2 })).toEqual(["a", "b"]);
      expect(toKeysArray({})).toEqual([]);
    });

    it("should return empty array for null", () => {
      expect(toKeysArray(null)).toEqual([]);
    });

    it("should return empty array for arrays", () => {
      expect(toKeysArray([1, 2, 3])).toEqual([]);
    });

    it("should return empty array for primitives", () => {
      expect(toKeysArray(123)).toEqual([]);
      expect(toKeysArray("string")).toEqual([]);
    });

    it("should only return own keys", () => {
      const obj = Object.create({ inherited: "value" });
      obj.own = "value";
      expect(toKeysArray(obj)).toEqual(["own"]);
    });
  });

  describe("toValuesArray", () => {
    it("should return array of values for objects", () => {
      expect(toValuesArray({ a: 1, b: 2 })).toEqual([1, 2]);
      expect(toValuesArray({})).toEqual([]);
    });

    it("should return empty array for null", () => {
      expect(toValuesArray(null)).toEqual([]);
    });

    it("should return empty array for arrays", () => {
      expect(toValuesArray([1, 2, 3])).toEqual([]);
    });

    it("should return empty array for primitives", () => {
      expect(toValuesArray(123)).toEqual([]);
      expect(toValuesArray("string")).toEqual([]);
    });

    it("should only return own values", () => {
      const obj = Object.create({ inherited: "value" });
      obj.own = "value";
      expect(toValuesArray(obj)).toEqual(["value"]);
    });
  });

  describe("stripUndefined", () => {
    it("should remove undefined values from a plain object", () => {
      const obj = { a: 1, b: undefined, c: 2 };
      const result = stripUndefined(obj);
      expect(result).toEqual({ a: 1, c: 2 });
      expect(result).not.toHaveProperty("b");
    });

    it("should handle empty objects", () => {
      expect(stripUndefined({})).toEqual({});
    });

    it("should handle objects with all undefined values", () => {
      const obj = { a: undefined, b: undefined };
      const result = stripUndefined(obj);
      expect(result).toEqual({});
    });

    it("should recursively strip undefined from nested objects", () => {
      const obj = {
        a: 1,
        b: undefined,
        c: {
          d: 2,
          e: undefined,
          f: {
            g: 3,
            h: undefined,
          },
        },
      };
      const result = stripUndefined(obj);
      expect(result).toEqual({
        a: 1,
        c: {
          d: 2,
          f: {
            g: 3,
          },
        },
      });
    });

    it("should handle arrays by filtering out undefined values", () => {
      const arr = [1, undefined, 2, undefined, 3];
      const result = stripUndefined(arr);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should recursively process nested arrays", () => {
      const arr = [1, undefined, [2, undefined, 3], undefined, 4];
      const result = stripUndefined(arr);
      expect(result).toEqual([1, [2, 3], 4]);
    });

    it("should handle arrays with nested objects", () => {
      const arr = [
        { a: 1, b: undefined },
        { c: 2, d: undefined, e: { f: 3, g: undefined } },
        undefined,
      ];
      const result = stripUndefined(arr);
      expect(result).toEqual([
        { a: 1 },
        { c: 2, e: { f: 3 } },
      ]);
    });

    it("should handle objects containing arrays", () => {
      const obj = {
        a: [1, undefined, 2],
        b: undefined,
        c: {
          d: [3, undefined, { e: 4, f: undefined }],
        },
      };
      const result = stripUndefined(obj);
      expect(result).toEqual({
        a: [1, 2],
        c: {
          d: [3, { e: 4 }],
        },
      });
    });

    it("should handle mixed nested structures", () => {
      const obj = {
        a: 1,
        b: [2, undefined, { c: 3, d: undefined }],
        e: {
          f: [4, undefined, 5],
          g: undefined,
          h: { i: 6, j: undefined },
        },
      };
      const result = stripUndefined(obj);
      expect(result).toEqual({
        a: 1,
        b: [2, { c: 3 }],
        e: {
          f: [4, 5],
          h: { i: 6 },
        },
      });
    });

    it("should preserve null values", () => {
      const obj = { a: 1, b: null, c: undefined };
      const result = stripUndefined(obj);
      expect(result).toEqual({ a: 1, b: null });
    });

    it("should preserve other falsy values", () => {
      const obj = {
        a: 0,
        b: false,
        c: "",
        d: undefined,
      };
      const result = stripUndefined(obj);
      expect(result).toEqual({
        a: 0,
        b: false,
        c: "",
      });
    });

    it("should handle primitives", () => {
      expect(stripUndefined(123)).toBe(123);
      expect(stripUndefined("string")).toBe("string");
      expect(stripUndefined(true)).toBe(true);
      expect(stripUndefined(null)).toBe(null);
    });

    it("should handle Date objects", () => {
      const date = new Date();
      expect(stripUndefined(date)).toBe(date);
    });

    it("should handle empty arrays", () => {
      expect(stripUndefined([])).toEqual([]);
    });

    it("should handle arrays with all undefined values", () => {
      const arr = [undefined, undefined, undefined];
      const result = stripUndefined(arr);
      expect(result).toEqual([]);
    });
  });
});

