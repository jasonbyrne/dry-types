import {
  toNumber,
  toInteger,
  toPositiveNumber,
  toNonNegativeNumber,
  toNonPositiveNumber,
  toNegativeNumber,
  toClampedNumber,
  round,
  roundDown,
  roundUp,
  getNumbersBetween,
} from "../src/number.js";
import {
  isInteger,
  isNumber,
  isPositiveNumber,
  isNegativeNumber,
  isNonNegativeNumber,
  isNonPositiveNumber,
  isNumberBetween,
  isGreaterThan,
  isGreaterThanOrEqualTo,
  isLessThan,
  isLessThanOrEqualTo,
} from "../src/is.js";

describe("number", () => {
  describe("isNumber", () => {
    it("should return true for valid numbers", () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-45)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });

    it("should return false for NaN", () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it("should return false for Infinity", () => {
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
    });

    it("should return false for non-numbers", () => {
      expect(isNumber("123")).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe("isInteger", () => {
    it("should return true for integers", () => {
      expect(isInteger(0)).toBe(true);
      expect(isInteger(123)).toBe(true);
      expect(isInteger(-45)).toBe(true);
    });

    it("should return false for non-integers", () => {
      expect(isInteger(3.14)).toBe(false);
      expect(isInteger(1.5)).toBe(false);
    });

    it("should return false for non-numbers", () => {
      expect(isInteger("123")).toBe(false);
      expect(isInteger(NaN)).toBe(false);
    });
  });

  describe("isPositiveNumber", () => {
    it("should return true for positive numbers", () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100)).toBe(true);
      expect(isPositiveNumber(0.5)).toBe(true);
    });

    it("should return false for zero or negative", () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
    });
  });

  describe("isNegativeNumber", () => {
    it("should return true for negative numbers", () => {
      expect(isNegativeNumber(-1)).toBe(true);
      expect(isNegativeNumber(-100)).toBe(true);
      expect(isNegativeNumber(-0.5)).toBe(true);
    });

    it("should return false for zero or positive", () => {
      expect(isNegativeNumber(0)).toBe(false);
      expect(isNegativeNumber(1)).toBe(false);
    });
  });

  describe("isNonNegativeNumber", () => {
    it("should return true for zero and positive numbers", () => {
      expect(isNonNegativeNumber(0)).toBe(true);
      expect(isNonNegativeNumber(1)).toBe(true);
      expect(isNonNegativeNumber(100)).toBe(true);
    });

    it("should return false for negative numbers", () => {
      expect(isNonNegativeNumber(-1)).toBe(false);
    });
  });

  describe("isNonPositiveNumber", () => {
    it("should return true for zero and negative numbers", () => {
      expect(isNonPositiveNumber(0)).toBe(true);
      expect(isNonPositiveNumber(-1)).toBe(true);
      expect(isNonPositiveNumber(-100)).toBe(true);
    });

    it("should return false for positive numbers", () => {
      expect(isNonPositiveNumber(1)).toBe(false);
    });
  });

  describe("toNumber", () => {
    it("should return the value if it is already a number", () => {
      expect(toNumber(123)).toBe(123);
      expect(toNumber(0)).toBe(0);
      expect(toNumber(-45)).toBe(-45);
    });

    it("should convert strings to numbers", () => {
      expect(toNumber("123")).toBe(123);
      expect(toNumber("45.67")).toBe(45.67);
      expect(toNumber("-10")).toBe(-10);
    });

    it("should return default value for null/undefined", () => {
      expect(toNumber(null)).toBe(0);
      expect(toNumber(undefined)).toBe(0);
      expect(toNumber(null, 100)).toBe(100);
      expect(toNumber(undefined, -1)).toBe(-1);
    });

    it("should return default value for invalid string conversions (NaN)", () => {
      expect(toNumber("invalid")).toBe(0);
      expect(toNumber("invalid", 100)).toBe(100);
      expect(toNumber("not a number", -1)).toBe(-1);
    });

    it("should return default value for Infinity", () => {
      expect(toNumber(Infinity)).toBe(0);
      expect(toNumber(Infinity, 100)).toBe(100);
      expect(toNumber(-Infinity)).toBe(0);
      expect(toNumber(-Infinity, -1)).toBe(-1);
    });

    it("should return default value for strings that parse to NaN", () => {
      expect(toNumber("abc")).toBe(0);
      expect(toNumber("")).toBe(0);
      expect(toNumber("   ")).toBe(0);
    });
  });

  describe("toInteger", () => {
    it("should convert to integer", () => {
      expect(toInteger(123)).toBe(123);
      // toInteger only accepts values that are already integers, not floats
      expect(toInteger(45.67)).toBe(0); // Returns default because 45.67 is not an integer
      expect(toInteger("123")).toBe(123);
    });

    it("should return default for non-integer results", () => {
      expect(toInteger(45.67, 0)).toBe(0);
      expect(toInteger("45.67", 100)).toBe(100);
    });
  });

  describe("toPositiveNumber", () => {
    it("should return positive numbers", () => {
      expect(toPositiveNumber(5)).toBe(5);
      expect(toPositiveNumber(100)).toBe(100);
    });

    it("should return default for zero or negative", () => {
      expect(toPositiveNumber(0)).toBe(0);
      expect(toPositiveNumber(-5)).toBe(0);
      expect(toPositiveNumber(-5, 10)).toBe(10);
    });
  });

  describe("toNonNegativeNumber", () => {
    it("should return zero and positive numbers", () => {
      expect(toNonNegativeNumber(0)).toBe(0);
      expect(toNonNegativeNumber(5)).toBe(5);
    });

    it("should return default for negative", () => {
      expect(toNonNegativeNumber(-5)).toBe(0);
      expect(toNonNegativeNumber(-5, 10)).toBe(10);
    });
  });

  describe("toNonPositiveNumber", () => {
    it("should return zero and negative numbers", () => {
      expect(toNonPositiveNumber(0)).toBe(0);
      expect(toNonPositiveNumber(-5)).toBe(-5);
    });

    it("should return default for positive", () => {
      expect(toNonPositiveNumber(5)).toBe(0);
      expect(toNonPositiveNumber(5, -10)).toBe(-10);
    });
  });

  describe("toNegativeNumber", () => {
    it("should return negative numbers", () => {
      expect(toNegativeNumber(-5)).toBe(-5);
      expect(toNegativeNumber(-100)).toBe(-100);
    });

    it("should return default for zero or positive", () => {
      expect(toNegativeNumber(0)).toBe(0);
      expect(toNegativeNumber(5)).toBe(0);
      expect(toNegativeNumber(5, -10)).toBe(-10);
    });
  });

  describe("toClampedNumber", () => {
    it("should clamp values within range", () => {
      expect(toClampedNumber(5, 0, 10)).toBe(5);
      expect(toClampedNumber(15, 0, 10)).toBe(10);
      expect(toClampedNumber(-5, 0, 10)).toBe(0);
    });

    it("should handle string inputs", () => {
      expect(toClampedNumber("5", 0, 10)).toBe(5);
      expect(toClampedNumber("15", 0, 10)).toBe(10);
    });
  });

  describe("isNumberBetween", () => {
    it("should return true for values within range", () => {
      expect(isNumberBetween(5, 0, 10)).toBe(true);
      expect(isNumberBetween(0, 0, 10)).toBe(true);
      expect(isNumberBetween(10, 0, 10)).toBe(true);
    });

    it("should return false for values outside range", () => {
      expect(isNumberBetween(-1, 0, 10)).toBe(false);
      expect(isNumberBetween(11, 0, 10)).toBe(false);
    });

    it("should return false for invalid inputs", () => {
      expect(isNumberBetween(null, 0, 10)).toBe(false);
      expect(isNumberBetween("invalid", 0, 10)).toBe(false);
    });
  });

  describe("isGreaterThan", () => {
    it("should return true when value is greater", () => {
      expect(isGreaterThan(5, 3)).toBe(true);
    });

    it("should return false when value is not greater", () => {
      expect(isGreaterThan(3, 5)).toBe(false);
      expect(isGreaterThan(5, 5)).toBe(false);
    });
  });

  describe("isGreaterThanOrEqualTo", () => {
    it("should return true when value is greater or equal", () => {
      expect(isGreaterThanOrEqualTo(5, 3)).toBe(true);
      expect(isGreaterThanOrEqualTo(5, 5)).toBe(true);
    });

    it("should return false when value is less", () => {
      expect(isGreaterThanOrEqualTo(3, 5)).toBe(false);
    });
  });

  describe("isLessThan", () => {
    it("should return true when value is less", () => {
      expect(isLessThan(3, 5)).toBe(true);
    });

    it("should return false when value is not less", () => {
      expect(isLessThan(5, 3)).toBe(false);
      expect(isLessThan(5, 5)).toBe(false);
    });
  });

  describe("isLessThanOrEqualTo", () => {
    it("should return true when value is less or equal", () => {
      expect(isLessThanOrEqualTo(3, 5)).toBe(true);
      expect(isLessThanOrEqualTo(5, 5)).toBe(true);
    });

    it("should return false when value is greater", () => {
      expect(isLessThanOrEqualTo(5, 3)).toBe(false);
    });
  });

  describe("round", () => {
    it("should round to nearest integer by default", () => {
      expect(round(3.4)).toBe(3);
      expect(round(3.5)).toBe(4);
      expect(round(3.6)).toBe(4);
    });

    it("should round to specified precision", () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.14159, 3)).toBe(3.142);
    });

    it("should handle negative precision", () => {
      expect(round(1234, -2)).toBe(1200);
    });
  });

  describe("roundDown", () => {
    it("should round down to nearest integer by default", () => {
      expect(roundDown(3.4)).toBe(3);
      expect(roundDown(3.5)).toBe(3);
      expect(roundDown(3.9)).toBe(3);
    });

    it("should round down to specified precision", () => {
      expect(roundDown(3.14159, 2)).toBe(3.14);
      expect(roundDown(3.149, 2)).toBe(3.14);
    });
  });

  describe("roundUp", () => {
    it("should round up to nearest integer by default", () => {
      expect(roundUp(3.1)).toBe(4);
      expect(roundUp(3.5)).toBe(4);
      expect(roundUp(3.9)).toBe(4);
    });

    it("should round up to specified precision", () => {
      expect(roundUp(3.14159, 2)).toBe(3.15);
      expect(roundUp(3.141, 2)).toBe(3.15);
    });
  });

  describe("getNumbersBetween", () => {
    it("should generate numbers between min and max with default step", () => {
      expect(getNumbersBetween(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(getNumbersBetween(0, 3)).toEqual([0, 1, 2, 3]);
    });

    it("should generate numbers with custom step", () => {
      expect(getNumbersBetween(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
      expect(getNumbersBetween(1, 10, 3)).toEqual([1, 4, 7, 10]);
    });

    it("should handle single number range", () => {
      expect(getNumbersBetween(5, 5)).toEqual([5]);
    });

    it("should handle negative numbers", () => {
      expect(getNumbersBetween(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    });
  });
});

