import { formatPhone, FormatPhoneOptions } from "../src/phone.js";

describe("phone", () => {
  describe("formatPhone", () => {
    describe("database format", () => {
      it("should normalize phone numbers to digits only", () => {
        expect(formatPhone("(123) 456-7890", { style: "database" })).toBe(
          "1234567890"
        );
        expect(formatPhone("123-456-7890", { style: "database" })).toBe(
          "1234567890"
        );
        expect(formatPhone("123.456.7890", { style: "database" })).toBe(
          "1234567890"
        );
        expect(formatPhone("1234567890", { style: "database" })).toBe(
          "1234567890"
        );
      });

      it("should strip leading 1 by default", () => {
        expect(formatPhone("1-123-456-7890", { style: "database" })).toBe(
          "1234567890"
        );
        expect(formatPhone("11234567890", { style: "database" })).toBe(
          "1234567890"
        );
        expect(formatPhone("+1 123-456-7890", { style: "database" })).toBe(
          "1234567890"
        );
      });

      it("should preserve leading 1 when stripLeadingOne is false", () => {
        expect(
          formatPhone("1-123-456-7890", {
            style: "database",
            stripLeadingOne: false,
          })
        ).toBe("11234567890");
        expect(
          formatPhone("11234567890", {
            style: "database",
            stripLeadingOne: false,
          })
        ).toBe("11234567890");
      });

      it("should handle extensions with 'x' separator", () => {
        expect(
          formatPhone("(123) 456-7890 ext 123", { style: "database" })
        ).toBe("1234567890x123");
        expect(
          formatPhone("123-456-7890 x 456", { style: "database" })
        ).toBe("1234567890x456");
        expect(
          formatPhone("123-456-7890 extension 789", { style: "database" })
        ).toBe("1234567890x789");
        expect(
          formatPhone("123-456-7890 ext. 321", { style: "database" })
        ).toBe("1234567890x321");
      });

      it("should handle phone numbers with country code", () => {
        expect(formatPhone("+1 123-456-7890", { style: "database" })).toBe(
          "1234567890"
        );
        expect(
          formatPhone("+1 (123) 456-7890", { style: "database" })
        ).toBe("1234567890");
      });

      it("should handle edge cases", () => {
        expect(formatPhone("123", { style: "database" })).toBe("123");
        expect(formatPhone("12345", { style: "database" })).toBe("12345");
        expect(formatPhone("1234567890123", { style: "database" })).toBe(
          "1234567890123"
        );
      });
    });

    describe("dash format", () => {
      it("should format 10-digit numbers with dashes", () => {
        expect(formatPhone("1234567890", { style: "dash" })).toBe(
          "123-456-7890"
        );
        expect(formatPhone("(123) 456-7890", { style: "dash" })).toBe(
          "123-456-7890"
        );
        expect(formatPhone("123.456.7890", { style: "dash" })).toBe(
          "123-456-7890"
        );
      });

      it("should handle 11-digit numbers (with country code)", () => {
        expect(formatPhone("11234567890", { style: "dash" })).toBe(
          "123-456-7890"
        );
        expect(formatPhone("1-123-456-7890", { style: "dash" })).toBe(
          "123-456-7890"
        );
        expect(formatPhone("+1 123-456-7890", { style: "dash" })).toBe(
          "123-456-7890"
        );
      });

      it("should handle extensions", () => {
        expect(
          formatPhone("1234567890 ext 123", { style: "dash" })
        ).toBe("123-456-7890 x123");
        expect(formatPhone("1234567890x456", { style: "dash" })).toBe(
          "123-456-7890 x456"
        );
      });
    });

    describe("parentheses format (default)", () => {
      it("should format with parentheses around area code", () => {
        expect(formatPhone("1234567890")).toBe("(123) 456-7890");
        expect(formatPhone("(123) 456-7890")).toBe("(123) 456-7890");
        expect(formatPhone("123-456-7890")).toBe("(123) 456-7890");
        expect(formatPhone("123.456.7890")).toBe("(123) 456-7890");
      });

      it("should handle 11-digit numbers", () => {
        expect(formatPhone("11234567890")).toBe("(123) 456-7890");
        expect(formatPhone("1-123-456-7890")).toBe("(123) 456-7890");
        expect(formatPhone("+1 123-456-7890")).toBe("(123) 456-7890");
      });

      it("should handle extensions", () => {
        expect(formatPhone("1234567890 ext 123")).toBe(
          "(123) 456-7890 x123"
        );
        expect(formatPhone("1234567890x456")).toBe("(123) 456-7890 x456");
        expect(formatPhone("1234567890 extension 789")).toBe(
          "(123) 456-7890 x789"
        );
      });
    });

    describe("international format", () => {
      it("should format with country code prefix", () => {
        expect(formatPhone("1234567890", { style: "international" })).toBe(
          "+1 123-456-7890"
        );
        expect(
          formatPhone("(123) 456-7890", { style: "international" })
        ).toBe("+1 123-456-7890");
      });

      it("should handle numbers already with country code", () => {
        expect(formatPhone("11234567890", { style: "international" })).toBe(
          "+1 123-456-7890"
        );
        expect(formatPhone("+1 123-456-7890", { style: "international" })).toBe(
          "+1 123-456-7890"
        );
      });

      it("should handle extensions", () => {
        expect(
          formatPhone("1234567890 ext 123", { style: "international" })
        ).toBe("+1 123-456-7890 x123");
      });
    });

    describe("link format", () => {
      it("should format with +1 prefix (always included)", () => {
        expect(formatPhone("1234567890", { style: "link" })).toBe(
          "+11234567890"
        );
        expect(formatPhone("(123) 456-7890", { style: "link" })).toBe(
          "+11234567890"
        );
      });

      it("should handle numbers already with country code", () => {
        expect(formatPhone("11234567890", { style: "link" })).toBe(
          "+11234567890"
        );
        expect(formatPhone("+1 123-456-7890", { style: "link" })).toBe(
          "+11234567890"
        );
      });

      it("should handle extensions with comma separator for auto-dial", () => {
        expect(
          formatPhone("1234567890 ext 123", { style: "link" })
        ).toBe("+11234567890,123");
        expect(formatPhone("1234567890x456", { style: "link" })).toBe(
          "+11234567890,456"
        );
      });
    });

    describe("conference format (automatic detection)", () => {
      it("should preserve conference call format with space separator for display", () => {
        const conference = "8662345689,223345099#,*324569";
        expect(formatPhone(conference)).toBe(
          "8662345689 223345099# *324569"
        );
        expect(formatPhone(conference, { style: "parentheses" })).toBe(
          "8662345689 223345099# *324569"
        );
        expect(formatPhone(conference, { style: "dash" })).toBe(
          "8662345689 223345099# *324569"
        );
        expect(formatPhone(conference, { style: "international" })).toBe(
          "8662345689 223345099# *324569"
        );
      });

      it("should preserve conference format with comma separator for database", () => {
        const conference = "8662345689,223345099#,*324569";
        expect(formatPhone(conference, { style: "database" })).toBe(
          "8662345689,223345099#,*324569"
        );
      });

      it("should preserve conference format with comma separator for link", () => {
        const conference = "8662345689,223345099#,*324569";
        expect(formatPhone(conference, { style: "link" })).toBe(
          "8662345689,223345099#,*324569"
        );
      });

      it("should preserve format with commas", () => {
        expect(formatPhone("8662345689,223345099")).toBe(
          "8662345689 223345099"
        );
        expect(formatPhone("8662345689,223345099", { style: "database" })).toBe(
          "8662345689,223345099"
        );
      });

      it("should preserve format with hash and asterisk", () => {
        expect(formatPhone("8662345689#,*324569")).toBe(
          "8662345689# *324569"
        );
        expect(formatPhone("8662345689#,*324569", { style: "link" })).toBe(
          "8662345689#,*324569"
        );
      });
    });

    describe("edge cases", () => {
      it("should return default value for null/undefined", () => {
        expect(formatPhone(null)).toBeNull();
        expect(formatPhone(undefined)).toBeNull();
        expect(formatPhone(null, { defaultValue: "" })).toBe("");
        expect(formatPhone(undefined, { defaultValue: "N/A" })).toBe("N/A");
      });

      it("should return default value for empty strings", () => {
        expect(formatPhone("")).toBeNull();
        expect(formatPhone("   ")).toBeNull();
        expect(formatPhone("", { defaultValue: "" })).toBe("");
      });

      it("should handle numbers as input", () => {
        expect(formatPhone(1234567890)).toBe("(123) 456-7890");
        expect(formatPhone(11234567890)).toBe("(123) 456-7890");
      });

      it("should handle very short numbers", () => {
        expect(formatPhone("123", { style: "database" })).toBe("123");
        expect(formatPhone("12345", { style: "database" })).toBe("12345");
      });

      it("should handle numbers without proper formatting", () => {
        // If we can't parse it properly, database format should still extract digits
        expect(formatPhone("abc123def456", { style: "database" })).toBe(
          "123456"
        );
      });

      it("should handle extension-only input gracefully", () => {
        // If input is just extension markers, should return default or handle gracefully
        expect(formatPhone("ext 123", { style: "database", defaultValue: "" })).toBe("");
        expect(formatPhone("x123", { style: "database", defaultValue: "" })).toBe("");
      });
    });

    describe("real-world examples", () => {
      it("should handle various input formats", () => {
        const inputs = [
          "(123) 456-7890",
          "123-456-7890",
          "123.456.7890",
          "1234567890",
          "1-123-456-7890",
          "+1 123-456-7890",
          "1 (123) 456-7890",
        ];

        inputs.forEach((input) => {
          const result = formatPhone(input, { style: "parentheses" });
          expect(result).toBe("(123) 456-7890");
        });
      });

      it("should handle phone numbers with various extension formats", () => {
        expect(
          formatPhone("(123) 456-7890 ext 123", { style: "database" })
        ).toBe("1234567890x123");
        expect(
          formatPhone("123-456-7890 x 456", { style: "database" })
        ).toBe("1234567890x456");
        expect(
          formatPhone("123-456-7890 extension 789", { style: "database" })
        ).toBe("1234567890x789");
        expect(
          formatPhone("123-456-7890 ext. 321", { style: "database" })
        ).toBe("1234567890x321");
      });

      it("should round-trip database format", () => {
        const original = "(123) 456-7890 ext 123";
        const normalized = formatPhone(original, { style: "database" });
        expect(normalized).toBe("1234567890x123");

        // Can't perfectly round-trip, but should be able to format back
        const formatted = formatPhone(normalized, { style: "parentheses" });
        expect(formatted).toBe("(123) 456-7890 x123");
      });
    });
  });
});

