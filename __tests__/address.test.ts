import {
  formatPostalCode,
  formatCityStateCountry,
  formatAddress,
  AddressComponents,
  FormatAddressOptions,
} from "../src/address.js";

describe("address", () => {
  describe("formatPostalCode", () => {
    it("should format 5-digit US zip codes", () => {
      expect(formatPostalCode("12345")).toBe("12345");
      expect(formatPostalCode(12345)).toBe("12345");
      expect(formatPostalCode("90210")).toBe("90210");
    });

    it("should format 9-digit US zip codes with hyphen", () => {
      expect(formatPostalCode("123456789")).toBe("12345-6789");
      expect(formatPostalCode("12345-6789")).toBe("12345-6789");
      expect(formatPostalCode("90210-1234")).toBe("90210-1234");
    });

    it("should handle international postal codes", () => {
      expect(formatPostalCode("SW1A 1AA")).toBe("SW1A 1AA"); // UK
      expect(formatPostalCode("75001")).toBe("75001"); // France
      expect(formatPostalCode("10115")).toBe("10115"); // Germany
    });

    it("should return digits-only format when specified", () => {
      expect(formatPostalCode("12345-6789", { format: "digits-only" })).toBe(
        "123456789"
      );
      expect(formatPostalCode("SW1A 1AA", { format: "digits-only" })).toBe(
        "SW1A1AA"
      );
      expect(formatPostalCode("12345", { format: "digits-only" })).toBe("12345");
    });

    it("should handle hyphenated format option", () => {
      expect(formatPostalCode("123456789", { format: "hyphenated" })).toBe(
        "12345-6789"
      );
      expect(formatPostalCode("12345-6789", { format: "hyphenated" })).toBe(
        "12345-6789"
      );
    });

    it("should return default value for null/undefined", () => {
      expect(formatPostalCode(null)).toBeNull();
      expect(formatPostalCode(undefined)).toBeNull();
      expect(formatPostalCode(null, { defaultValue: "" })).toBe("");
      expect(formatPostalCode(undefined, { defaultValue: "N/A" })).toBe("N/A");
    });

    it("should return default value for empty strings", () => {
      expect(formatPostalCode("")).toBeNull();
      expect(formatPostalCode("   ")).toBeNull();
      expect(formatPostalCode("", { defaultValue: "" })).toBe("");
    });

    it("should handle edge cases", () => {
      expect(formatPostalCode("123")).toBe("123"); // Less than 5 digits
      expect(formatPostalCode("1234567890")).toBe("1234567890"); // More than 9 digits
    });
  });

  describe("formatCityStateCountry", () => {
    it("should format city and region", () => {
      expect(
        formatCityStateCountry({ city: "New York", region: "NY" })
      ).toBe("New York, NY");
    });

    it("should format city and country", () => {
      expect(
        formatCityStateCountry({ city: "London", country: "UK" })
      ).toBe("London, UK");
    });

    it("should format city, region, and country", () => {
      expect(
        formatCityStateCountry({
          city: "New York",
          region: "NY",
          country: "USA",
        })
      ).toBe("New York, NY, USA");
    });

    it("should format with custom separator", () => {
      expect(
        formatCityStateCountry(
          { city: "New York", region: "NY", country: "USA" },
          { separator: " | " }
        )
      ).toBe("New York | NY | USA");
    });

    it("should handle international addresses", () => {
      expect(
        formatCityStateCountry({
          city: "Paris",
          region: "Île-de-France",
          country: "France",
        })
      ).toBe("Paris, Île-de-France, France");
    });

    it("should exclude empty components", () => {
      expect(
        formatCityStateCountry({ city: "New York", region: null, country: "USA" })
      ).toBe("New York, USA");
      expect(
        formatCityStateCountry({ city: null, region: "NY", country: "USA" })
      ).toBe("NY, USA");
    });

    it("should return default value when all components are empty", () => {
      expect(formatCityStateCountry({})).toBeNull();
      expect(
        formatCityStateCountry({ city: null, region: null, country: null })
      ).toBeNull();
      expect(
        formatCityStateCountry({}, { defaultValue: "" })
      ).toBe("");
    });

    it("should trim whitespace", () => {
      expect(
        formatCityStateCountry({
          city: "  New York  ",
          region: "  NY  ",
          country: "  USA  ",
        })
      ).toBe("New York, NY, USA");
    });

    it("should handle single component", () => {
      expect(formatCityStateCountry({ city: "New York" })).toBe("New York");
      expect(formatCityStateCountry({ region: "NY" })).toBe("NY");
      expect(formatCityStateCountry({ country: "USA" })).toBe("USA");
    });
  });

  describe("formatAddress", () => {
    const fullAddress: AddressComponents = {
      street: ["123 Main St", "Apt 4B"],
      city: "New York",
      region: "NY",
      postalCode: "10001",
      country: "USA",
    };

    describe("single-line format (default)", () => {
      it("should format full address in single line", () => {
        expect(formatAddress(fullAddress)).toBe(
          "123 Main St, Apt 4B, New York, NY 10001, USA"
        );
      });

      it("should format address with single street line", () => {
        const address: AddressComponents = {
          ...fullAddress,
          street: "123 Main St",
        };
        expect(formatAddress(address)).toBe(
          "123 Main St, New York, NY 10001, USA"
        );
      });

      it("should format address without country", () => {
        const address: AddressComponents = {
          ...fullAddress,
          country: undefined,
        };
        expect(formatAddress(address)).toBe(
          "123 Main St, Apt 4B, New York, NY 10001"
        );
      });

      it("should format address with custom separator", () => {
        expect(
          formatAddress(fullAddress, { separator: " | " })
        ).toBe("123 Main St | Apt 4B | New York, NY 10001 | USA");
      });

      it("should handle address with only city and region", () => {
        expect(
          formatAddress({ city: "New York", region: "NY" })
        ).toBe("New York, NY");
      });

      it("should handle address with city and postal code only", () => {
        expect(
          formatAddress({ city: "New York", postalCode: "10001" })
        ).toBe("New York 10001");
      });

      it("should handle address with region and postal code only", () => {
        expect(
          formatAddress({ region: "NY", postalCode: "10001" })
        ).toBe("NY 10001");
      });

      it("should exclude empty components", () => {
        expect(
          formatAddress({
            street: "123 Main St",
            city: "New York",
            region: "NY",
          })
        ).toBe("123 Main St, New York, NY");
      });

      it("should return empty string when all components are empty", () => {
        expect(formatAddress({})).toBe("");
        expect(
          formatAddress({
            street: null,
            city: null,
            region: null,
            postalCode: null,
            country: null,
          })
        ).toBe("");
      });

      it("should trim whitespace", () => {
        expect(
          formatAddress({
            street: "  123 Main St  ",
            city: "  New York  ",
            region: "  NY  ",
          })
        ).toBe("123 Main St, New York, NY");
      });
    });

    describe("multi-line format", () => {
      it("should format full address in multi-line format", () => {
        const result = formatAddress(fullAddress, { style: "multi-line" });
        expect(result).toBe(
          "123 Main St\nApt 4B\nNew York\nNY\n10001\nUSA"
        );
      });

      it("should format address with HTML line breaks", () => {
        const result = formatAddress(fullAddress, {
          style: "multi-line",
          html: true,
        });
        expect(result).toBe(
          "123 Main St<br />Apt 4B<br />New York<br />NY<br />10001<br />USA"
        );
      });

      it("should format address with single street line in multi-line", () => {
        const address: AddressComponents = {
          ...fullAddress,
          street: "123 Main St",
        };
        const result = formatAddress(address, { style: "multi-line" });
        expect(result).toBe("123 Main St\nNew York\nNY\n10001\nUSA");
      });

      it("should format address without country in multi-line", () => {
        const address: AddressComponents = {
          ...fullAddress,
          country: undefined,
        };
        const result = formatAddress(address, { style: "multi-line" });
        expect(result).toBe("123 Main St\nApt 4B\nNew York\nNY\n10001");
      });

      it("should handle minimal address in multi-line", () => {
        const result = formatAddress(
          { city: "New York", region: "NY" },
          { style: "multi-line" }
        );
        expect(result).toBe("New York\nNY");
      });
    });

    describe("url-query format", () => {
      it("should format full address for URL query string", () => {
        const result = formatAddress(fullAddress, { style: "url-query" });
        expect(result).toBe(
          "123+Main+St%2C+Apt+4B%2C+New+York%2C+NY+10001%2C+USA"
        );
      });

      it("should format address with single street line for URL", () => {
        const address: AddressComponents = {
          ...fullAddress,
          street: "123 Main St",
        };
        const result = formatAddress(address, { style: "url-query" });
        expect(result).toBe("123+Main+St%2C+New+York%2C+NY+10001%2C+USA");
      });

      it("should format address without country for URL", () => {
        const address: AddressComponents = {
          ...fullAddress,
          country: undefined,
        };
        const result = formatAddress(address, { style: "url-query" });
        expect(result).toBe("123+Main+St%2C+Apt+4B%2C+New+York%2C+NY+10001");
      });

      it("should handle minimal address for URL", () => {
        const result = formatAddress(
          { city: "New York", region: "NY" },
          { style: "url-query" }
        );
        expect(result).toBe("New+York%2C+NY");
      });

      it("should properly encode special characters for URL", () => {
        const address: AddressComponents = {
          street: "123 Main St #5",
          city: "San Francisco",
          region: "CA",
          postalCode: "94102",
        };
        const result = formatAddress(address, { style: "url-query" });
        expect(result).toContain("123+Main+St");
        expect(result).toContain("San+Francisco");
      });
    });

    describe("edge cases", () => {
      it("should handle address with only street", () => {
        expect(formatAddress({ street: "123 Main St" })).toBe("123 Main St");
      });

      it("should handle address with only city", () => {
        expect(formatAddress({ city: "New York" })).toBe("New York");
      });

      it("should handle address with only country", () => {
        expect(formatAddress({ country: "USA" })).toBe("USA");
      });

      it("should handle address with ZIP+4 format", () => {
        const address: AddressComponents = {
          street: "123 Main St",
          city: "New York",
          region: "NY",
          postalCode: "10001-1234",
          country: "USA",
        };
        expect(formatAddress(address)).toBe(
          "123 Main St, New York, NY 10001-1234, USA"
        );
      });

      it("should handle international addresses", () => {
        const address: AddressComponents = {
          street: "10 Downing Street",
          city: "London",
          postalCode: "SW1A 2AA",
          country: "UK",
        };
        expect(formatAddress(address)).toBe(
          "10 Downing Street, London SW1A 2AA, UK"
        );
      });

      it("should handle address with region but no city", () => {
        expect(
          formatAddress({ region: "NY", postalCode: "10001" })
        ).toBe("NY 10001");
      });

      it("should handle address with postal code but no city or region", () => {
        expect(formatAddress({ postalCode: "10001" })).toBe("10001");
      });

      it("should handle address with multiple street lines", () => {
        const address: AddressComponents = {
          street: ["123 Main St", "Suite 200", "Building A"],
          city: "New York",
          region: "NY",
          postalCode: "10001",
        };
        expect(formatAddress(address)).toBe(
          "123 Main St, Suite 200, Building A, New York, NY 10001"
        );
      });

      it("should filter out empty strings from street array", () => {
        const address: AddressComponents = {
          street: ["123 Main St", "", "Apt 4B", null as any, "Floor 2"],
          city: "New York",
          region: "NY",
        };
        expect(formatAddress(address)).toBe(
          "123 Main St, Apt 4B, Floor 2, New York, NY"
        );
      });

      it("should handle street as single string", () => {
        const address: AddressComponents = {
          street: "123 Main St",
          city: "New York",
          region: "NY",
        };
        expect(formatAddress(address)).toBe("123 Main St, New York, NY");
      });
    });
  });
});

