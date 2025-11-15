import {
  pickRandom,
  pickRandomIndex,
  randomInt,
  randomFloat,
  randomBoolean,
  randomString,
  randomDate,
  randomColor,
} from "../src/random.js";

describe("random", () => {
  describe("pickRandom", () => {
    it("should return a single random element from array", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = pickRandom(arr);
      expect(arr).toContain(result);
    });

    it("should return array of random elements when count is provided", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = pickRandom(arr, 3);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      result.forEach((item) => {
        expect(arr).toContain(item);
      });
    });

    it("should return empty array if count is 0 or negative", () => {
      expect(pickRandom([1, 2, 3], 0)).toEqual([]);
      expect(pickRandom([1, 2, 3], -1)).toEqual([]);
    });

    it("should limit count to array length", () => {
      const arr = [1, 2, 3];
      const result = pickRandom(arr, 10);
      expect(result.length).toBe(3);
    });
  });

  describe("pickRandomIndex", () => {
    it("should return a single random index", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = pickRandomIndex(arr);
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(arr.length);
    });

    it("should return array of random indices when count is provided", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = pickRandomIndex(arr, 3);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      result.forEach((index) => {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(arr.length);
      });
    });

    it("should return empty array if count is 0 or negative", () => {
      expect(pickRandomIndex([1, 2, 3], 0)).toEqual([]);
      expect(pickRandomIndex([1, 2, 3], -1)).toEqual([]);
    });
  });

  describe("randomInt", () => {
    it("should return integer within range", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it("should handle single number range", () => {
      expect(randomInt(5, 5)).toBe(5);
    });

    it("should handle negative numbers", () => {
      const result = randomInt(-10, -1);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(-1);
    });
  });

  describe("randomFloat", () => {
    it("should return float within range", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(0, 1);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
      }
    });

    it("should handle negative ranges", () => {
      const result = randomFloat(-1, 0);
      expect(result).toBeGreaterThanOrEqual(-1);
      expect(result).toBeLessThan(0);
    });
  });

  describe("randomBoolean", () => {
    it("should return boolean value", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBoolean();
        expect(typeof result).toBe("boolean");
      }
    });
  });

  describe("randomString", () => {
    it("should return string of specified length", () => {
      const result = randomString(8);
      expect(typeof result).toBe("string");
      expect(result.length).toBeLessThanOrEqual(8);
    });

    it("should return alphanumeric string", () => {
      const result = randomString(10);
      expect(/^[a-z0-9]+$/i.test(result)).toBe(true);
    });
  });

  describe("randomDate", () => {
    it("should return date within range", () => {
      const min = new Date("2024-01-01");
      const max = new Date("2024-12-31");
      const result = randomDate(min, max);
      expect(result.getTime()).toBeGreaterThanOrEqual(min.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(max.getTime());
    });

    it("should handle same min and max", () => {
      const date = new Date("2024-01-01");
      const result = randomDate(date, date);
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe("randomColor", () => {
    it("should return hex color string", () => {
      const result = randomColor();
      expect(/^#[0-9a-f]{6}$/i.test(result)).toBe(true);
    });

    it("should return different colors on multiple calls", () => {
      const colors = new Set();
      for (let i = 0; i < 100; i++) {
        colors.add(randomColor());
      }
      // Very unlikely all 100 are the same
      expect(colors.size).toBeGreaterThan(1);
    });
  });
});

