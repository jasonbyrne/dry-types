import { toCurrency } from "../src/currency.js";

describe("currency", () => {
  describe("toCurrency", () => {
    it("should format numbers as USD currency by default", () => {
      const result = toCurrency(1234.56);
      expect(result).toMatch(/\$1,234\.56/);
    });

    it("should format with custom currency", () => {
      const result = toCurrency(1234.56, "", { currency: "EUR" });
      expect(result).toMatch(/1,234\.56/);
    });

    it("should format with custom locale", () => {
      const result = toCurrency(1234.56, "", {
        currency: "EUR",
        locale: "de-DE",
      });
      expect(result).toMatch(/1[.,]234[.,]56/);
    });

    it("should return default value for invalid input", () => {
      expect(toCurrency(null)).toBe("");
      expect(toCurrency(undefined)).toBe("");
      expect(toCurrency("invalid")).toBe(""); // Now properly validates NaN
      expect(toCurrency(NaN)).toBe("");
      expect(toCurrency(Infinity)).toBe("");
      expect(toCurrency(-Infinity)).toBe("");
      expect(toCurrency(null, "N/A")).toBe("N/A");
    });

    it("should allow negative values by default", () => {
      const result = toCurrency(-100);
      expect(result).toMatch(/-/);
    });

    it("should reject negative values when allowNegative is false", () => {
      expect(toCurrency(-100, "", { allowNegative: false })).toBe("");
      expect(toCurrency(-100, "N/A", { allowNegative: false })).toBe("N/A");
    });

    it("should allow positive values when allowNegative is false", () => {
      const result = toCurrency(100, "", { 
        allowNegative: false,
        currency: "USD"
      });
      expect(result).toMatch(/\$100/);
    });

    it("should handle zero", () => {
      const result = toCurrency(0);
      expect(result).toMatch(/\$0/);
    });
  });
});

