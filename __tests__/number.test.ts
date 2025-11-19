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
  roundToNearest,
  getNumbersBetween,
  toNumberString,
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
      expect(toInteger("123")).toBe(123);
    });

    it("should round to nearest integer", () => {
      expect(toInteger(3.14)).toBe(3);
      expect(toInteger(3.5)).toBe(4);
      expect(toInteger(3.6)).toBe(4);
      expect(toInteger(45.67)).toBe(46);
      expect(toInteger("45.67")).toBe(46);
      expect(toInteger("3.14")).toBe(3);
      expect(toInteger(-3.14)).toBe(-3);
      expect(toInteger(-3.5)).toBe(-3);
      expect(toInteger(-3.6)).toBe(-4);
    });

    it("should return default for invalid conversions", () => {
      expect(toInteger("invalid", 100)).toBe(100);
      expect(toInteger(null, 0)).toBe(0);
      expect(toInteger(undefined, 0)).toBe(0);
      expect(toInteger(Infinity, 0)).toBe(0);
      expect(toInteger(-Infinity, 0)).toBe(0);
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

  describe("roundToNearest", () => {
    it("should round to nearest 10", () => {
      expect(roundToNearest(1234.56, 10)).toBe(1230);
      expect(roundToNearest(1235, 10)).toBe(1240);
      expect(roundToNearest(1232, 10)).toBe(1230);
      expect(roundToNearest(1237, 10)).toBe(1240);
    });

    it("should round to nearest 100", () => {
      expect(roundToNearest(1234.56, 100)).toBe(1200);
      expect(roundToNearest(1250, 100)).toBe(1300);
      expect(roundToNearest(1249, 100)).toBe(1200);
      expect(roundToNearest(1251, 100)).toBe(1300);
    });

    it("should round to nearest 1000", () => {
      expect(roundToNearest(1234.56, 1000)).toBe(1000);
      expect(roundToNearest(1500, 1000)).toBe(2000);
      expect(roundToNearest(1499, 1000)).toBe(1000);
      expect(roundToNearest(1501, 1000)).toBe(2000);
    });

    it("should round to nearest 5", () => {
      expect(roundToNearest(1237, 5)).toBe(1235);
      expect(roundToNearest(1238, 5)).toBe(1240);
      expect(roundToNearest(1236, 5)).toBe(1235);
      expect(roundToNearest(1239, 5)).toBe(1240);
    });

    it("should round to nearest 0.5", () => {
      expect(roundToNearest(1234.56, 0.5)).toBeCloseTo(1234.5, 10);
      expect(roundToNearest(1234.21, 0.5)).toBeCloseTo(1234.0, 10);
      expect(roundToNearest(1234.26, 0.5)).toBeCloseTo(1234.5, 10);
      expect(roundToNearest(1234.74, 0.5)).toBeCloseTo(1234.5, 10);
      expect(roundToNearest(1234.76, 0.5)).toBeCloseTo(1235.0, 10);
    });

    it("should round to nearest 0.25", () => {
      expect(roundToNearest(1234.21, 0.25)).toBeCloseTo(1234.25, 10);
      expect(roundToNearest(1234.12, 0.25)).toBeCloseTo(1234.0, 10);
      expect(roundToNearest(1234.13, 0.25)).toBeCloseTo(1234.25, 10);
      expect(roundToNearest(1234.37, 0.25)).toBeCloseTo(1234.25, 10);
      expect(roundToNearest(1234.38, 0.25)).toBeCloseTo(1234.5, 10);
    });

    it("should round to nearest 0.1", () => {
      expect(roundToNearest(1234.56, 0.1)).toBeCloseTo(1234.6, 10);
      expect(roundToNearest(1234.54, 0.1)).toBeCloseTo(1234.5, 10);
      // Note: 1234.55 has floating point precision issues, so we test with 1234.551 instead
      expect(roundToNearest(1234.551, 0.1)).toBeCloseTo(1234.6, 10);
      expect(roundToNearest(1234.549, 0.1)).toBeCloseTo(1234.5, 10);
    });

    it("should handle negative numbers", () => {
      expect(roundToNearest(-1234.56, 10)).toBe(-1230);
      expect(roundToNearest(-1237, 5)).toBe(-1235);
      expect(roundToNearest(-1234.21, 0.5)).toBe(-1234.0);
      expect(roundToNearest(-1234.26, 0.5)).toBe(-1234.5);
    });

    it("should handle zero", () => {
      expect(roundToNearest(0, 10)).toBe(0);
      expect(roundToNearest(0, 0.5)).toBe(0);
      expect(roundToNearest(0, 100)).toBe(0);
    });

    it("should handle exact multiples", () => {
      expect(roundToNearest(1230, 10)).toBe(1230);
      expect(roundToNearest(1234.5, 0.5)).toBe(1234.5);
      expect(roundToNearest(1200, 100)).toBe(1200);
    });

    it("should handle string inputs", () => {
      expect(roundToNearest("1234.56", 10)).toBe(1230);
      expect(roundToNearest("1237", 5)).toBe(1235);
      expect(roundToNearest("1234.21", 0.25)).toBe(1234.25);
    });

    it("should return 0 for invalid value inputs", () => {
      expect(roundToNearest(null, 10)).toBe(0);
      expect(roundToNearest(undefined, 10)).toBe(0);
      expect(roundToNearest("invalid", 10)).toBe(0);
      expect(roundToNearest(Infinity, 10)).toBe(0);
      expect(roundToNearest(-Infinity, 10)).toBe(0);
    });

    it("should return 0 for invalid divisor", () => {
      expect(roundToNearest(1234, 0)).toBe(0);
      expect(roundToNearest(1234, -10)).toBe(0);
      expect(roundToNearest(1234, NaN)).toBe(0);
      expect(roundToNearest(1234, Infinity)).toBe(0);
      expect(roundToNearest(1234, -Infinity)).toBe(0);
    });

    it("should handle edge cases with small divisors", () => {
      expect(roundToNearest(1234.567, 0.01)).toBeCloseTo(1234.57, 10);
      expect(roundToNearest(1234.561, 0.01)).toBeCloseTo(1234.56, 10);
      expect(roundToNearest(1234.565, 0.01)).toBeCloseTo(1234.57, 10);
    });

    it("should handle large divisors", () => {
      expect(roundToNearest(1234567, 10000)).toBe(1230000);
      expect(roundToNearest(1234567, 100000)).toBe(1200000);
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

  describe("toNumberString", () => {
    it("should format basic numbers with thousands separators", () => {
      expect(toNumberString(1234.56)).toBe("1,234.56");
      expect(toNumberString(1234567.89)).toBe("1,234,567.89");
      expect(toNumberString(1000)).toBe("1,000");
    });

    it("should handle decimal places", () => {
      expect(toNumberString(1234.5, { minDecimalPlaces: 2 })).toBe("1,234.50");
      expect(toNumberString(1234.567, { maxDecimalPlaces: 2 })).toBe(
        "1,234.57"
      );
      expect(
        toNumberString(1234.567, { maxDecimalPlaces: 2, minDecimalPlaces: 2 })
      ).toBe("1,234.57");
      expect(toNumberString(1234, { maxDecimalPlaces: 0 })).toBe("1,234");
    });

    it("should handle locale formatting", () => {
      const result = toNumberString(1234.56, { locale: "en-US" });
      expect(result).toMatch(/1,234/);

      const resultDE = toNumberString(1234.56, { locale: "de-DE" });
      expect(resultDE).toMatch(/1[.,]234/);
    });

    it("should handle negative numbers", () => {
      expect(toNumberString(-1234.56)).toBe("-1,234.56");
      expect(toNumberString(-1000)).toBe("-1,000");
    });

    it("should respect constraint: non-negative", () => {
      expect(toNumberString(-100, { constraint: "non-negative" })).toBe("");
      expect(toNumberString(100, { constraint: "non-negative" })).toBe("100");
      expect(toNumberString(0, { constraint: "non-negative" })).toBe("0");
    });

    it("should respect constraint: non-positive", () => {
      expect(toNumberString(100, { constraint: "non-positive" })).toBe("");
      expect(toNumberString(-100, { constraint: "non-positive" })).toBe("-100");
      expect(toNumberString(0, { constraint: "non-positive" })).toBe("0");
    });

    it("should respect constraint: non-zero", () => {
      expect(toNumberString(0, { constraint: "non-zero" })).toBe("");
      expect(toNumberString(100, { constraint: "non-zero" })).toBe("100");
      expect(toNumberString(-100, { constraint: "non-zero" })).toBe("-100");
    });

    it("should respect constraint: positive-only", () => {
      expect(toNumberString(-100, { constraint: "positive-only" })).toBe("");
      expect(toNumberString(0, { constraint: "positive-only" })).toBe("");
      expect(toNumberString(100, { constraint: "positive-only" })).toBe("100");
    });

    it("should respect constraint: negative-only", () => {
      expect(toNumberString(100, { constraint: "negative-only" })).toBe("");
      expect(toNumberString(0, { constraint: "negative-only" })).toBe("");
      expect(toNumberString(-100, { constraint: "negative-only" })).toBe(
        "-100"
      );
    });

    it("should respect constraint: zero-only", () => {
      expect(toNumberString(100, { constraint: "zero-only" })).toBe("");
      expect(toNumberString(-100, { constraint: "zero-only" })).toBe("");
      expect(toNumberString(0, { constraint: "zero-only" })).toBe("0");
    });

    it("should handle zero", () => {
      expect(toNumberString(0)).toBe("0");
      expect(toNumberString(0, { minDecimalPlaces: 2 })).toBe("0.00");
    });

    it("should return nullValue for invalid values", () => {
      expect(toNumberString(null)).toBe("");
      expect(toNumberString(undefined)).toBe("");
      expect(toNumberString("invalid")).toBe("");
      expect(toNumberString(NaN)).toBe("");
      expect(toNumberString(Infinity)).toBe("");
      expect(toNumberString(-Infinity)).toBe("");
    });

    it("should return custom nullValue when specified", () => {
      expect(toNumberString(null, { nullValue: "N/A" })).toBe("N/A");
      expect(toNumberString(undefined, { nullValue: "--" })).toBe("--");
      expect(toNumberString("invalid", { nullValue: "?" })).toBe("?");
    });

    it("should handle string inputs", () => {
      expect(toNumberString("1234.56")).toBe("1,234.56");
      expect(toNumberString("1000")).toBe("1,000");
    });

    it("should handle small numbers", () => {
      expect(toNumberString(0.123)).toBe("0.123");
      expect(toNumberString(0.123456, { maxDecimalPlaces: 3 })).toBe("0.123");
      expect(toNumberString(0.1, { minDecimalPlaces: 2 })).toBe("0.10");
    });

    it("should handle large numbers", () => {
      expect(toNumberString(1234567890.12)).toBe("1,234,567,890.12");
      expect(toNumberString(999999999)).toBe("999,999,999");
    });

    it("should handle signDisplay: always", () => {
      expect(toNumberString(100, { signDisplay: "always" })).toBe("+100");
      expect(toNumberString(-100, { signDisplay: "always" })).toBe("-100");
      expect(toNumberString(0, { signDisplay: "always" })).toBe("+0");
    });

    it("should handle signDisplay: exceptZero", () => {
      expect(toNumberString(100, { signDisplay: "exceptZero" })).toBe("+100");
      expect(toNumberString(-100, { signDisplay: "exceptZero" })).toBe("-100");
      expect(toNumberString(0, { signDisplay: "exceptZero" })).toBe("0");
    });

    it("should handle signDisplay: never", () => {
      expect(toNumberString(100, { signDisplay: "never" })).toBe("100");
      expect(toNumberString(-100, { signDisplay: "never" })).toBe("100");
      expect(toNumberString(0, { signDisplay: "never" })).toBe("0");
    });

    it("should handle signDisplay: parentheses", () => {
      expect(toNumberString(-100, { signDisplay: "parentheses" })).toBe(
        "(100)"
      );
      expect(toNumberString(-1234.56, { signDisplay: "parentheses" })).toBe(
        "(1,234.56)"
      );
      expect(toNumberString(100, { signDisplay: "parentheses" })).toBe("100");
      expect(toNumberString(0, { signDisplay: "parentheses" })).toBe("0");
    });
  });
});
