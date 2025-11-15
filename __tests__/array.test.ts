import {
  toArray,
  toUniqueArray,
  toStringArray,
  toNumberArray,
  getFirst,
  getLast,
  getSum,
  getAverage,
  getMax,
  getMin,
  toFlattenedArray,
} from "../src/array.js";
import {
  isArray,
  isEmptyArray,
  isNonEmptyArray,
} from "../src/is.js";

describe("array", () => {
  describe("isArray", () => {
    it("should return true for arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(["a", "b"])).toBe(true);
    });

    it("should return false for non-arrays", () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray("string")).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray({})).toBe(false);
    });
  });

  describe("toArray", () => {
    it("should return the value if it is already an array", () => {
      const arr = [1, 2, 3];
      expect(toArray(arr)).toBe(arr);
      expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("should wrap non-array values in an array", () => {
      expect(toArray(1)).toEqual([1]);
      expect(toArray("string")).toEqual(["string"]);
      expect(toArray({})).toEqual([{}]);
      expect(toArray(null)).toEqual([null]);
    });

    it("should return default value for undefined", () => {
      expect(toArray(undefined)).toEqual([]);
      expect(toArray(undefined, [1, 2, 3])).toEqual([1, 2, 3]);
      expect(toArray(undefined, null)).toBe(null);
    });
  });

  describe("toUniqueArray", () => {
    it("should return the value if it is already an array with unique values", () => {
      const arr = [1, 2, 3];
      const result = toUniqueArray(arr);
      expect(result).toEqual([1, 2, 3]);
      expect(result).not.toBe(arr); // Should be a new array
    });

    it("should remove duplicates from arrays", () => {
      expect(toUniqueArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(toUniqueArray(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
    });

    it("should wrap non-array values in an array", () => {
      expect(toUniqueArray(1)).toEqual([1]);
      expect(toUniqueArray("string")).toEqual(["string"]);
    });

    it("should return default value for undefined", () => {
      expect(toUniqueArray(undefined)).toEqual([]);
      expect(toUniqueArray(undefined, [1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe("toStringArray", () => {
    it("should convert array items to strings", () => {
      expect(toStringArray([1, 2, 3])).toEqual(["1", "2", "3"]);
      expect(toStringArray([true, false])).toEqual(["true", "false"]);
      expect(toStringArray([null, undefined])).toEqual(["", ""]);
    });

    it("should convert non-array values to strings and wrap in an array", () => {
      expect(toStringArray(123)).toEqual(["123"]);
      expect(toStringArray(true)).toEqual(["true"]);
      expect(toStringArray(false)).toEqual(["false"]);
      expect(toStringArray(null)).toEqual([""]);
    });

    it("should return default value for undefined", () => {
      expect(toStringArray(undefined)).toEqual([]);
      expect(toStringArray(undefined, ["a", "b"])).toEqual(["a", "b"]);
    });
  });

  describe("toNumberArray", () => {
    it("should convert array items to numbers", () => {
      expect(toNumberArray(["1", "2", "3"])).toEqual([1, 2, 3]);
      expect(toNumberArray(["1.5", "2.7", "3.9"])).toEqual([1.5, 2.7, 3.9]);
      expect(toNumberArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("should convert non-array values to numbers and wrap in an array", () => {
      expect(toNumberArray("123")).toEqual([123]);
      expect(toNumberArray("45.67")).toEqual([45.67]);
      expect(toNumberArray(123)).toEqual([123]);
      expect(toNumberArray(45.67)).toEqual([45.67]);
    });

    it("should return default value for undefined", () => {
      expect(toNumberArray(undefined)).toEqual([]);
      expect(toNumberArray(undefined, [1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe("isEmptyArray", () => {
    it("should return true for empty arrays", () => {
      expect(isEmptyArray([])).toBe(true);
    });

    it("should return false for non-empty arrays", () => {
      expect(isEmptyArray([1, 2, 3])).toBe(false);
      expect(isEmptyArray(["a"])).toBe(false);
    });

    it("should return false for non-arrays", () => {
      expect(isEmptyArray(null)).toBe(false);
      expect(isEmptyArray(undefined)).toBe(false);
      expect(isEmptyArray("string")).toBe(false);
      expect(isEmptyArray(123)).toBe(false);
      expect(isEmptyArray({})).toBe(false);
    });
  });

  describe("isNonEmptyArray", () => {
    it("should return true for non-empty arrays", () => {
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
      expect(isNonEmptyArray(["a"])).toBe(true);
      expect(isNonEmptyArray([null])).toBe(true);
    });

    it("should return false for empty arrays", () => {
      expect(isNonEmptyArray([])).toBe(false);
    });

    it("should return false for non-arrays", () => {
      expect(isNonEmptyArray(null)).toBe(false);
      expect(isNonEmptyArray(undefined)).toBe(false);
      expect(isNonEmptyArray("string")).toBe(false);
      expect(isNonEmptyArray(123)).toBe(false);
      expect(isNonEmptyArray({})).toBe(false);
    });
  });

  describe("getFirst", () => {
    it("should return the first element of an array", () => {
      expect(getFirst([1, 2, 3])).toBe(1);
      expect(getFirst(["a", "b", "c"])).toBe("a");
      expect(getFirst([null, 2, 3])).toBe(null);
    });

    it("should return default value for empty arrays", () => {
      expect(getFirst([], "default")).toBe("default");
      expect(getFirst([], 0)).toBe(0);
      expect(getFirst([])).toBeUndefined();
    });

    it("should return default value for null/undefined", () => {
      expect(getFirst(null, "default")).toBe("default");
      expect(getFirst(undefined, "default")).toBe("default");
      expect(getFirst(null)).toBeUndefined();
    });
  });

  describe("getLast", () => {
    it("should return the last element of an array", () => {
      expect(getLast([1, 2, 3])).toBe(3);
      expect(getLast(["a", "b", "c"])).toBe("c");
      expect(getLast([1, 2, null])).toBe(null);
    });

    it("should return default value for empty arrays", () => {
      expect(getLast([], "default")).toBe("default");
      expect(getLast([], 0)).toBe(0);
      expect(getLast([])).toBeUndefined();
    });

    it("should return default value for null/undefined", () => {
      expect(getLast(null, "default")).toBe("default");
      expect(getLast(undefined, "default")).toBe("default");
      expect(getLast(null)).toBeUndefined();
    });
  });

  describe("getSum", () => {
    it("should sum array of numbers", () => {
      expect(getSum([1, 2, 3])).toBe(6);
      expect(getSum([1.5, 2.5, 3.5])).toBe(7.5);
      expect(getSum([-1, 0, 1])).toBe(0);
    });

    it("should convert string numbers to numbers and sum", () => {
      expect(getSum(["1", "2", "3"])).toBe(6);
      expect(getSum(["1.5", "2.5"])).toBe(4);
    });

    it("should return 0 for empty arrays", () => {
      expect(getSum([])).toBe(0);
    });

    it("should return 0 for null/undefined", () => {
      expect(getSum(null)).toBe(0);
      expect(getSum(undefined)).toBe(0);
    });

    it("should ignore non-numeric values", () => {
      expect(getSum([1, "abc", 2, null, 3])).toBe(6);
    });
  });

  describe("getAverage", () => {
    it("should calculate average of array of numbers", () => {
      expect(getAverage([1, 2, 3])).toBe(2);
      expect(getAverage([2, 4, 6])).toBe(4);
      expect(getAverage([1, 2, 3, 4])).toBe(2.5);
    });

    it("should convert string numbers to numbers and average", () => {
      expect(getAverage(["1", "2", "3"])).toBe(2);
      expect(getAverage(["10", "20"])).toBe(15);
    });

    it("should return 0 for empty arrays", () => {
      expect(getAverage([])).toBe(0);
    });

    it("should return 0 for null/undefined", () => {
      expect(getAverage(null)).toBe(0);
      expect(getAverage(undefined)).toBe(0);
    });

    it("should ignore non-numeric values in calculation", () => {
      expect(getAverage([1, "abc", 2, null, 3])).toBe(2); // (1+2+3)/3 = 2, only valid numbers counted
    });
  });

  describe("getMax", () => {
    it("should return maximum value from array", () => {
      expect(getMax([1, 2, 3])).toBe(3);
      expect(getMax([10, 5, 20, 15])).toBe(20);
      expect(getMax([-1, -5, -3])).toBe(-1);
    });

    it("should convert string numbers to numbers", () => {
      expect(getMax(["1", "2", "3"])).toBe(3);
      expect(getMax(["10", "5", "20"])).toBe(20);
    });

    it("should return undefined for empty arrays", () => {
      expect(getMax([])).toBeUndefined();
    });

    it("should return undefined for null/undefined", () => {
      expect(getMax(null)).toBeUndefined();
      expect(getMax(undefined)).toBeUndefined();
    });

    it("should ignore non-numeric values", () => {
      expect(getMax([1, "abc", 3, null, 2])).toBe(3);
    });
  });

  describe("getMin", () => {
    it("should return minimum value from array", () => {
      expect(getMin([1, 2, 3])).toBe(1);
      expect(getMin([10, 5, 20, 15])).toBe(5);
      expect(getMin([-1, -5, -3])).toBe(-5);
    });

    it("should convert string numbers to numbers", () => {
      expect(getMin(["1", "2", "3"])).toBe(1);
      expect(getMin(["10", "5", "20"])).toBe(5);
    });

    it("should return undefined for empty arrays", () => {
      expect(getMin([])).toBeUndefined();
    });

    it("should return undefined for null/undefined", () => {
      expect(getMin(null)).toBeUndefined();
      expect(getMin(undefined)).toBeUndefined();
    });

    it("should ignore non-numeric values", () => {
      expect(getMin([1, "abc", 3, null, 2])).toBe(1);
    });
  });

  describe("toFlattenedArray", () => {
    it("should flatten nested arrays to default depth", () => {
      expect(toFlattenedArray([1, [2, 3], [4, [5, 6]]])).toEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });

    it("should flatten to specified depth", () => {
      expect(toFlattenedArray([1, [2, [3, [4]]]], 1)).toEqual([1, 2, [3, [4]]]);
      expect(toFlattenedArray([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
      expect(toFlattenedArray([1, [2, [3, [4]]]], 3)).toEqual([1, 2, 3, 4]);
    });

    it("should not flatten when depth is 0", () => {
      expect(toFlattenedArray([1, [2, 3]], 0)).toEqual([1, [2, 3]]);
    });

    it("should return empty array for null/undefined", () => {
      expect(toFlattenedArray(null)).toEqual([]);
      expect(toFlattenedArray(undefined)).toEqual([]);
    });

    it("should return array as-is for non-nested arrays", () => {
      expect(toFlattenedArray([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });
});

