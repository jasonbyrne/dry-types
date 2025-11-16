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
  shuffleArray,
  chunkArray,
  groupBy,
  partition,
  compact,
  intersection,
  difference,
  union,
  sample,
  sampleOne,
  sortArray,
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

  describe("shuffleArray", () => {
    it("should shuffle an array", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled).toHaveLength(5);
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("should not mutate the original array", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(shuffled).not.toBe(original);
    });

    it("should return empty array for empty input", () => {
      expect(shuffleArray([])).toEqual([]);
      expect(shuffleArray(null)).toEqual([]);
      expect(shuffleArray(undefined)).toEqual([]);
    });

    it("should return different order on multiple shuffles (probabilistic)", () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled1 = shuffleArray(original);
      const shuffled2 = shuffleArray(original);
      // Very unlikely to be the same order
      expect(shuffled1).not.toEqual(shuffled2);
    });

    it("should contain all original elements", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(new Set(shuffled)).toEqual(new Set(original));
    });
  });

  describe("chunkArray", () => {
    it("should split array into chunks of specified size", () => {
      expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunkArray([1, 2, 3, 4, 5, 6], 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it("should handle chunk size larger than array", () => {
      expect(chunkArray([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it("should return empty array for invalid inputs", () => {
      expect(chunkArray([1, 2, 3], 0)).toEqual([]);
      expect(chunkArray([1, 2, 3], -1)).toEqual([]);
      expect(chunkArray(null, 2)).toEqual([]);
      expect(chunkArray(undefined, 2)).toEqual([]);
      expect(chunkArray([], 2)).toEqual([]);
    });

    it("should handle single element chunks", () => {
      expect(chunkArray([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });

  describe("groupBy", () => {
    it("should group array elements by key function", () => {
      const users = [
        { name: "Alice", age: 20 },
        { name: "Bob", age: 20 },
        { name: "Charlie", age: 30 },
      ];
      const grouped = groupBy(users, (user) => user.age);
      expect(grouped[20]).toHaveLength(2);
      expect(grouped[30]).toHaveLength(1);
    });

    it("should group by string keys", () => {
      const items = [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
        { type: "vegetable", name: "carrot" },
      ];
      const grouped = groupBy(items, (item) => item.type);
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });

    it("should return empty object for invalid inputs", () => {
      expect(groupBy(null, (x: any) => x)).toEqual({});
      expect(groupBy(undefined, (x: any) => x)).toEqual({});
      expect(groupBy([], (x: any) => x)).toEqual({});
    });
  });

  describe("partition", () => {
    it("should partition array based on predicate", () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const [even, odd] = partition(numbers, (n) => n % 2 === 0);
      expect(even).toEqual([2, 4, 6]);
      expect(odd).toEqual([1, 3, 5]);
    });

    it("should return empty arrays for invalid inputs", () => {
      const [truthy, falsy] = partition(null, (x) => Boolean(x));
      expect(truthy).toEqual([]);
      expect(falsy).toEqual([]);
    });

    it("should handle all truthy partition", () => {
      const [truthy, falsy] = partition([1, 2, 3], (x) => x > 0);
      expect(truthy).toEqual([1, 2, 3]);
      expect(falsy).toEqual([]);
    });

    it("should handle all falsy partition", () => {
      const [truthy, falsy] = partition([1, 2, 3], (x) => x > 10);
      expect(truthy).toEqual([]);
      expect(falsy).toEqual([1, 2, 3]);
    });
  });

  describe("compact", () => {
    it("should remove falsy values from array", () => {
      expect(compact([0, 1, false, 2, "", 3, null, undefined, NaN])).toEqual([
        1, 2, 3,
      ]);
    });

    it("should return empty array for invalid inputs", () => {
      expect(compact(null)).toEqual([]);
      expect(compact(undefined)).toEqual([]);
    });

    it("should preserve truthy values", () => {
      expect(compact([1, "hello", true, {}, []])).toEqual([
        1,
        "hello",
        true,
        {},
        [],
      ]);
    });
  });

  describe("intersection", () => {
    it("should return common elements between arrays", () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it("should return empty array when no common elements", () => {
      expect(intersection([1, 2, 3], [4, 5, 6])).toEqual([]);
    });

    it("should handle duplicates", () => {
      expect(intersection([1, 2, 2, 3], [2, 2, 3, 4])).toEqual([2, 2, 3]);
    });

    it("should return empty array for invalid inputs", () => {
      expect(intersection(null, [1, 2])).toEqual([]);
      expect(intersection([1, 2], null)).toEqual([]);
      expect(intersection(null, null)).toEqual([]);
    });
  });

  describe("difference", () => {
    it("should return elements in first array but not in second", () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });

    it("should return all elements when second array is empty", () => {
      expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    it("should return empty array when all elements are in second", () => {
      expect(difference([1, 2, 3], [1, 2, 3, 4])).toEqual([]);
    });

    it("should handle invalid inputs", () => {
      expect(difference(null, [1, 2])).toEqual([]);
      expect(difference([1, 2], null)).toEqual([1, 2]);
      expect(difference(null, null)).toEqual([]);
    });
  });

  describe("union", () => {
    it("should combine arrays and remove duplicates", () => {
      expect(union([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("should handle arrays with duplicates", () => {
      expect(union([1, 2, 2, 3], [2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it("should return first array when second is empty", () => {
      expect(union([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    it("should handle invalid inputs", () => {
      expect(union(null, [1, 2])).toEqual([1, 2]);
      expect(union([1, 2], null)).toEqual([1, 2]);
      expect(union(null, null)).toEqual([]);
    });
  });

  describe("sample", () => {
    it("should return random sample of specified count", () => {
      const array = [1, 2, 3, 4, 5];
      const sampled = sample(array, 3);
      expect(sampled).toHaveLength(3);
      sampled.forEach((item) => {
        expect(array).toContain(item);
      });
    });

    it("should return all elements when count >= array length", () => {
      const array = [1, 2, 3];
      const sampled = sample(array, 5);
      expect(sampled).toHaveLength(3);
      expect(new Set(sampled)).toEqual(new Set(array));
    });

    it("should return empty array for invalid inputs", () => {
      expect(sample(null, 2)).toEqual([]);
      expect(sample(undefined, 2)).toEqual([]);
      expect(sample([], 2)).toEqual([]);
      expect(sample([1, 2, 3], 0)).toEqual([]);
      expect(sample([1, 2, 3], -1)).toEqual([]);
    });

    it("should return different samples on multiple calls (probabilistic)", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const sample1 = sample(array, 3);
      const sample2 = sample(array, 3);
      // Very unlikely to be the same
      expect(sample1).not.toEqual(sample2);
    });
  });

  describe("sampleOne", () => {
    it("should return a random element from array", () => {
      const array = [1, 2, 3, 4, 5];
      const sampled = sampleOne(array);
      expect(array).toContain(sampled);
    });

    it("should return default value for empty array", () => {
      expect(sampleOne([], "default")).toBe("default");
      expect(sampleOne([], 0)).toBe(0);
      expect(sampleOne([])).toBeUndefined();
    });

    it("should return default value for invalid inputs", () => {
      expect(sampleOne(null, "default")).toBe("default");
      expect(sampleOne(undefined, "default")).toBe("default");
    });
  });

  describe("sortArray", () => {
    it("should sort numbers in ascending order", () => {
      const array = [3, 1, 4, 1, 5, 9, 2, 6];
      const sorted = sortArray(array, { method: "asc", format: "number" });
      expect(sorted).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it("should sort numbers in descending order", () => {
      const array = [3, 1, 4, 1, 5, 9, 2, 6];
      const sorted = sortArray(array, { method: "desc", format: "number" });
      expect(sorted).toEqual([9, 6, 5, 4, 3, 2, 1, 1]);
    });

    it("should sort strings in ascending order", () => {
      const array = ["banana", "apple", "cherry", "date"];
      const sorted = sortArray(array, { method: "asc", format: "string" });
      expect(sorted).toEqual(["apple", "banana", "cherry", "date"]);
    });

    it("should sort strings in descending order", () => {
      const array = ["banana", "apple", "cherry", "date"];
      const sorted = sortArray(array, { method: "desc", format: "string" });
      expect(sorted).toEqual(["date", "cherry", "banana", "apple"]);
    });

    it("should sort dates in ascending order", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-03-01");
      const date3 = new Date("2023-02-01");
      const array = [date2, date1, date3];
      const sorted = sortArray(array, { method: "asc", format: "date" });
      expect(sorted).toEqual([date1, date3, date2]);
    });

    it("should sort dates in descending order", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-03-01");
      const date3 = new Date("2023-02-01");
      const array = [date2, date1, date3];
      const sorted = sortArray(array, { method: "desc", format: "date" });
      expect(sorted).toEqual([date2, date3, date1]);
    });

    it("should sort by key function", () => {
      const array = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
      ];
      const sorted = sortArray(array, {
        method: "asc",
        format: "string",
        key: (item) => item.name,
      });
      expect(sorted[0].name).toBe("Alice");
      expect(sorted[1].name).toBe("Bob");
      expect(sorted[2].name).toBe("Charlie");
    });

    it("should sort by numeric key", () => {
      const array = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
      ];
      const sorted = sortArray(array, {
        method: "asc",
        format: "number",
        key: (item) => item.age,
      });
      expect(sorted[0].age).toBe(25);
      expect(sorted[1].age).toBe(30);
      expect(sorted[2].age).toBe(30);
    });

    it("should not mutate the original array", () => {
      const array = [3, 1, 4, 1, 5];
      const original = [...array];
      sortArray(array, { method: "asc", format: "number" });
      expect(array).toEqual(original);
    });

    it("should handle empty arrays", () => {
      expect(sortArray([], { method: "asc", format: "number" })).toEqual([]);
    });

    it("should handle null/undefined arrays", () => {
      expect(sortArray(null, { method: "asc", format: "number" })).toEqual([]);
      expect(sortArray(undefined, { method: "asc", format: "number" })).toEqual([]);
    });

    it("should handle null/undefined values in array", () => {
      const array = [3, null, 1, undefined, 5];
      const sorted = sortArray(array, { method: "asc", format: "number" });
      expect(sorted).toEqual([1, 3, 5, null, undefined]);
    });

    it("should handle string dates", () => {
      const array = ["2023-03-01", "2023-01-01", "2023-02-01"];
      const sorted = sortArray(array, { method: "asc", format: "date" });
      expect(sorted).toEqual(["2023-01-01", "2023-02-01", "2023-03-01"]);
    });

    it("should convert Date objects to strings when sorting", () => {
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-03-01");
      const date3 = new Date("2023-02-01");
      const array = [date2, date1, date3];
      const sorted = sortArray(array, { method: "asc", format: "date" });
      // Dates are converted to ISO strings for sorting
      expect(sorted[0]).toBe(date1);
      expect(sorted[1]).toBe(date3);
      expect(sorted[2]).toBe(date2);
    });

    it("should handle invalid dates by converting to string", () => {
      const date1 = new Date("2023-01-01");
      const invalidDate = new Date("invalid");
      const date2 = new Date("2023-02-01");
      const array = [date1, invalidDate, date2];
      const sorted = sortArray(array, { method: "asc", format: "date" });
      // Invalid dates are converted to their string representation
      expect(sorted.length).toBe(3);
      // Valid dates should be sorted correctly
      expect(sorted[0]).toBe(date1);
      expect(sorted[1]).toBe(date2);
    });
  });
});

