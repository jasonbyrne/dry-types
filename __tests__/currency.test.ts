import { toCurrency } from "../src/currency.js";

describe("currency", () => {
  describe("toCurrency", () => {
    describe("basic formatting", () => {
      it("should format numbers as USD currency by default", () => {
        expect(toCurrency(1234.56)).toBe("$1,234.56");
      });

      it("should format with custom currency", () => {
        expect(toCurrency(1234.56, { currency: "EUR" })).toBe("€1,234.56");
        expect(toCurrency(1234.56, { currency: "GBP" })).toBe("£1,234.56");
        expect(toCurrency(1234.56, { currency: "JPY" })).toBe("¥1,234.56");
      });

      it("should default to $ for unknown currency codes", () => {
        expect(toCurrency(1234.56, { currency: "XYZ" })).toBe("$1,234.56");
      });
    });

    describe("grain: cents (default)", () => {
      it("should always show cents with 2 decimals", () => {
        expect(toCurrency(1234.56)).toBe("$1,234.56");
        expect(toCurrency(1234.0)).toBe("$1,234.00");
        expect(toCurrency(1234)).toBe("$1,234.00");
      });

      it("should respect maxDecimalPlaces", () => {
        expect(toCurrency(1234.567, { maxDecimalPlaces: 3 })).toBe(
          "$1,234.567"
        );
        expect(toCurrency(1234.5678, { maxDecimalPlaces: 4 })).toBe(
          "$1,234.5678"
        );
      });

      it("should round to maxDecimalPlaces", () => {
        expect(toCurrency(1234.567, { maxDecimalPlaces: 2 })).toBe("$1,234.57");
      });
    });

    describe("grain: cents-optional", () => {
      it("should show cents only if non-zero", () => {
        expect(toCurrency(1234.56, { grain: "cents-optional" })).toBe(
          "$1,234.56"
        );
        expect(toCurrency(1234.0, { grain: "cents-optional" })).toBe("$1,234");
        expect(toCurrency(1234, { grain: "cents-optional" })).toBe("$1,234");
      });

      it("should always show at least 2 decimals when cents are shown", () => {
        expect(toCurrency(1234.5, { grain: "cents-optional" })).toBe(
          "$1,234.50"
        );
        expect(toCurrency(1234.1, { grain: "cents-optional" })).toBe(
          "$1,234.10"
        );
      });

      it("should respect maxDecimalPlaces when showing cents", () => {
        expect(
          toCurrency(1234.567, { grain: "cents-optional", maxDecimalPlaces: 3 })
        ).toBe("$1,234.567");
      });
    });

    describe("grain: whole", () => {
      it("should round to nearest whole unit", () => {
        expect(toCurrency(1234.4, { grain: "whole" })).toBe("$1,234");
        expect(toCurrency(1234.5, { grain: "whole" })).toBe("$1,235");
        expect(toCurrency(1234.6, { grain: "whole" })).toBe("$1,235");
      });

      it("should not show cents", () => {
        expect(toCurrency(1234.56, { grain: "whole" })).toBe("$1,235");
        expect(toCurrency(1234.99, { grain: "whole" })).toBe("$1,235");
      });
    });

    describe("grain: compact", () => {
      it("should format thousands with K suffix using Intl's compact notation", () => {
        expect(toCurrency(5000, { grain: "compact" })).toBe("$5K"); // Intl doesn't show decimals for round numbers
        expect(toCurrency(12345, { grain: "compact" })).toBe("$12.35K"); // Intl shows decimals when needed
        expect(toCurrency(999999, { grain: "compact" })).toBe("$1M"); // Intl rounds to next unit
      });

      it("should format millions with M suffix", () => {
        expect(toCurrency(1000000, { grain: "compact" })).toBe("$1M");
        expect(toCurrency(1234567, { grain: "compact" })).toBe("$1.23M");
        expect(toCurrency(999999999, { grain: "compact" })).toBe("$1B"); // Intl rounds to next unit
      });

      it("should format billions with B suffix", () => {
        expect(toCurrency(1000000000, { grain: "compact" })).toBe("$1B");
        expect(toCurrency(1234567890, { grain: "compact" })).toBe("$1.23B");
      });

      it("should use Intl's decimal logic (shows decimals when needed)", () => {
        expect(toCurrency(5000, { grain: "compact" })).toBe("$5K"); // Round number, no decimals
        expect(toCurrency(12345, { grain: "compact" })).toBe("$12.35K"); // Needs decimals
        expect(toCurrency(50000, { grain: "compact" })).toBe("$50K"); // Round number, no decimals
      });

      it("should not add suffix for values < 1000", () => {
        expect(toCurrency(999, { grain: "compact" })).toBe("$999");
        expect(toCurrency(500, { grain: "compact" })).toBe("$500");
        expect(toCurrency(1, { grain: "compact" })).toBe("$1");
      });
    });

    describe("negative numbers", () => {
      it("should use dash by default", () => {
        expect(toCurrency(-100)).toBe("-$100.00");
        expect(toCurrency(-1234.56)).toBe("-$1,234.56");
      });

      it("should use parentheses when specified", () => {
        expect(toCurrency(-100, { signDisplay: "parentheses" })).toBe(
          "($100.00)"
        );
        expect(toCurrency(-1234.56, { signDisplay: "parentheses" })).toBe(
          "($1,234.56)"
        );
      });

      it("should handle negative with whole grain", () => {
        expect(toCurrency(-1234.5, { grain: "whole" })).toBe("-$1,234"); // Math.round(-1234.5) = -1234
        expect(
          toCurrency(-1234.5, { grain: "whole", signDisplay: "parentheses" })
        ).toBe("($1,234)");
      });

      it("should handle negative with compact grain", () => {
        expect(toCurrency(-5000, { grain: "compact" })).toBe("-$5K"); // Intl's compact notation
        expect(
          toCurrency(-5000, { grain: "compact", signDisplay: "parentheses" })
        ).toBe("($5K)");
      });

      it("should handle negative with cents-optional", () => {
        expect(toCurrency(-1234.0, { grain: "cents-optional" })).toBe(
          "-$1,234"
        );
        expect(toCurrency(-1234.56, { grain: "cents-optional" })).toBe(
          "-$1,234.56"
        );
      });
    });

    describe("null/undefined handling", () => {
      it("should return default nullValue for null", () => {
        expect(toCurrency(null)).toBe("--");
      });

      it("should return default nullValue for undefined", () => {
        expect(toCurrency(undefined)).toBe("--");
      });

      it("should return custom nullValue when specified", () => {
        expect(toCurrency(null, { nullValue: "N/A" })).toBe("N/A");
        expect(toCurrency(undefined, { nullValue: "" })).toBe("");
      });

      it("should return nullValue for invalid input", () => {
        expect(toCurrency("invalid")).toBe("--");
        expect(toCurrency(NaN)).toBe("--");
        expect(toCurrency(Infinity)).toBe("--");
        expect(toCurrency(-Infinity)).toBe("--");
      });
    });

    describe("comma separation", () => {
      it("should add commas for thousands", () => {
        expect(toCurrency(1000)).toBe("$1,000.00");
        expect(toCurrency(10000)).toBe("$10,000.00");
        expect(toCurrency(100000)).toBe("$100,000.00");
        expect(toCurrency(1000000)).toBe("$1,000,000.00");
      });

      it("should add commas in compact format", () => {
        expect(toCurrency(1000000, { grain: "compact" })).toBe("$1M"); // Intl's compact notation
        expect(toCurrency(10000000, { grain: "compact" })).toBe("$10M"); // Intl's compact notation
      });
    });

    describe("edge cases", () => {
      it("should handle very small values", () => {
        expect(toCurrency(0.01)).toBe("$0.01");
        expect(toCurrency(0.1)).toBe("$0.10");
        expect(toCurrency(0.99)).toBe("$0.99");
      });

      it("should handle very large values", () => {
        expect(toCurrency(999999999999, { grain: "compact" })).toBe("$1T"); // Intl rounds to 1T
        expect(toCurrency(1000000000000, { grain: "compact" })).toBe("$1T"); // Exactly 1T
      });

      it("should handle floating point precision issues", () => {
        expect(toCurrency(1234.1, { grain: "cents-optional" })).toBe(
          "$1,234.10"
        );
        expect(toCurrency(1234.1000001, { grain: "cents-optional" })).toBe(
          "$1,234.10"
        );
      });

      it("should handle string numbers", () => {
        expect(toCurrency("1234.56")).toBe("$1,234.56");
        expect(toCurrency("0")).toBe("$0.00"); // Default grain "cents" shows 2 decimals
      });
    });
  });
});
