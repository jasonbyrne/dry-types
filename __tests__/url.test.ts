import { formatUrl, FormatUrlOptions } from "../src/url.js";

describe("url", () => {
  describe("formatUrl", () => {
    describe("database format", () => {
      it("should normalize full URLs with protocol", () => {
        expect(
          formatUrl("https://example.com/path", { style: "database" })
        ).toBe("https://example.com/path");
        expect(
          formatUrl("http://example.com/path", { style: "database" })
        ).toBe("http://example.com/path");
        expect(
          formatUrl("HTTPS://EXAMPLE.COM/PATH", { style: "database" })
        ).toBe("https://example.com/path");
      });

      it("should preserve query strings", () => {
        expect(
          formatUrl("https://example.com/path?key=value", { style: "database" })
        ).toBe("https://example.com/path?key=value");
        expect(
          formatUrl("https://example.com/path?a=1&b=2", { style: "database" })
        ).toBe("https://example.com/path?a=1&b=2");
      });

      it("should preserve hash fragments", () => {
        expect(
          formatUrl("https://example.com/path#section", { style: "database" })
        ).toBe("https://example.com/path#section");
        expect(
          formatUrl("https://example.com/path#section1", { style: "database" })
        ).toBe("https://example.com/path#section1");
      });

      it("should preserve query strings and hash fragments together", () => {
        expect(
          formatUrl("https://example.com/path?key=value#section", {
            style: "database",
          })
        ).toBe("https://example.com/path?key=value#section");
      });

      it("should preserve absolute paths", () => {
        expect(formatUrl("/relative/path", { style: "database" })).toBe(
          "/relative/path"
        );
        expect(
          formatUrl("/relative/path?query=value", { style: "database" })
        ).toBe("/relative/path?query=value");
        expect(
          formatUrl("/relative/path#hash", { style: "database" })
        ).toBe("/relative/path#hash");
      });

      it("should preserve relative paths", () => {
        expect(formatUrl("relative/path", { style: "database" })).toBe(
          "relative/path"
        );
        expect(
          formatUrl("relative/path?query=value", { style: "database" })
        ).toBe("relative/path?query=value");
        expect(formatUrl("relative/path#hash", { style: "database" })).toBe(
          "relative/path#hash"
        );
      });
    });

    describe("human display format", () => {
      it("should remove protocol from full URLs", () => {
        expect(formatUrl("https://example.com/path", { style: "human" })).toBe(
          "example.com/path"
        );
        expect(formatUrl("http://example.com/path", { style: "human" })).toBe(
          "example.com/path"
        );
        expect(formatUrl("https://example.com", { style: "human" })).toBe(
          "example.com"
        );
      });

      it("should preserve absolute paths", () => {
        expect(formatUrl("/relative/path", { style: "human" })).toBe(
          "/relative/path"
        );
        expect(formatUrl("/", { style: "human" })).toBe("/");
      });

      it("should preserve relative paths", () => {
        expect(formatUrl("relative/path", { style: "human" })).toBe(
          "relative/path"
        );
        expect(formatUrl("path", { style: "human" })).toBe("path");
      });

      it("should truncate long query strings by default", () => {
        const longQuery = "a=" + "x".repeat(100);
        const result = formatUrl(
          `https://example.com/path?${longQuery}`,
          { style: "human" }
        ) as string;
        expect(result).toContain("example.com/path");
        expect(result).toContain("?");
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(70); // Should be truncated (17 chars base + 1 for ? + 50 for truncated query)
      });

      it("should truncate long hash fragments by default", () => {
        const longHash = "x".repeat(100);
        const result = formatUrl(
          `https://example.com/path#${longHash}`,
          { style: "human" }
        ) as string;
        expect(result).toContain("example.com/path");
        expect(result).toContain("#");
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(50); // Should be truncated
      });

      it("should respect custom maxQueryLength", () => {
        const longQuery = "a=" + "x".repeat(100);
        const result = formatUrl(
          `https://example.com/path?${longQuery}`,
          { style: "human", maxQueryLength: 20 }
        ) as string;
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(45);
      });

      it("should respect custom maxHashLength", () => {
        const longHash = "x".repeat(100);
        const result = formatUrl(
          `https://example.com/path#${longHash}`,
          { style: "human", maxHashLength: 10 }
        ) as string;
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(30);
      });

      it("should not truncate when truncateQuery is false", () => {
        const longQuery = "a=" + "x".repeat(100);
        const result = formatUrl(
          `https://example.com/path?${longQuery}`,
          { style: "human", truncateQuery: false }
        ) as string;
        expect(result).toContain(longQuery);
        expect(result.length).toBeGreaterThan(100);
      });

      it("should not truncate when truncateHash is false", () => {
        const longHash = "x".repeat(100);
        const result = formatUrl(
          `https://example.com/path#${longHash}`,
          { style: "human", truncateHash: false }
        ) as string;
        expect(result).toContain(longHash);
        expect(result.length).toBeGreaterThan(100);
      });

      it("should handle query and hash together", () => {
        const result = formatUrl(
          "https://example.com/path?key=value#section",
          { style: "human" }
        );
        expect(result).toBe("example.com/path?key=value#section");
      });

      it("should truncate both query and hash when long", () => {
        const longQuery = "a=" + "x".repeat(100);
        const longHash = "y".repeat(100);
        const result = formatUrl(
          `https://example.com/path?${longQuery}#${longHash}`,
          { style: "human" }
        ) as string;
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(100);
      });
    });

    describe("link format", () => {
      it("should preserve full URLs with protocol", () => {
        expect(formatUrl("https://example.com/path", { style: "link" })).toBe(
          "https://example.com/path"
        );
        expect(formatUrl("http://example.com/path", { style: "link" })).toBe(
          "http://example.com/path"
        );
      });

      it("should add https protocol to protocol-relative URLs", () => {
        expect(formatUrl("//example.com/path", { style: "link" })).toBe(
          "https://example.com/path"
        );
        expect(formatUrl("//example.com", { style: "link" })).toBe(
          "https://example.com"
        );
      });

      it("should add default protocol to domain-only URLs", () => {
        expect(formatUrl("example.com", { style: "link" })).toBe(
          "https://example.com"
        );
        expect(formatUrl("example.com/path", { style: "link" })).toBe(
          "https://example.com/path"
        );
      });

      it("should use custom defaultProtocol", () => {
        expect(
          formatUrl("example.com", { style: "link", defaultProtocol: "http" })
        ).toBe("http://example.com");
        expect(
          formatUrl("//example.com", {
            style: "link",
            defaultProtocol: "http",
          })
        ).toBe("http://example.com");
      });

      it("should preserve absolute paths", () => {
        expect(formatUrl("/relative/path", { style: "link" })).toBe(
          "/relative/path"
        );
        expect(
          formatUrl("/relative/path?query=value", { style: "link" })
        ).toBe("/relative/path?query=value");
        expect(formatUrl("/relative/path#hash", { style: "link" })).toBe(
          "/relative/path#hash"
        );
      });

      it("should preserve relative paths", () => {
        expect(formatUrl("relative/path", { style: "link" })).toBe(
          "relative/path"
        );
        expect(
          formatUrl("relative/path?query=value", { style: "link" })
        ).toBe("relative/path?query=value");
        expect(formatUrl("relative/path#hash", { style: "link" })).toBe(
          "relative/path#hash"
        );
      });

      it("should preserve query strings and hash fragments", () => {
        expect(
          formatUrl("https://example.com/path?key=value#section", {
            style: "link",
          })
        ).toBe("https://example.com/path?key=value#section");
        expect(
          formatUrl("example.com/path?key=value#section", { style: "link" })
        ).toBe("https://example.com/path?key=value#section");
      });
    });

    describe("default format (human)", () => {
      it("should default to human format when style is not specified", () => {
        expect(formatUrl("https://example.com/path")).toBe("example.com/path");
        expect(formatUrl("https://example.com/path", {})).toBe(
          "example.com/path"
        );
      });

      it("should support truncateQuery option without style", () => {
        const longQuery = "a=" + "x".repeat(100);
        const result = formatUrl(`https://example.com/path?${longQuery}`, {
          truncateQuery: false,
        });
        expect(result).toContain(longQuery);
      });

      it("should support truncateHash option without style", () => {
        const longHash = "x".repeat(100);
        const result = formatUrl(`https://example.com/path#${longHash}`, {
          truncateHash: false,
        });
        expect(result).toContain(longHash);
      });
    });

    describe("edge cases", () => {
      it("should return default value for null/undefined", () => {
        expect(formatUrl(null)).toBeNull();
        expect(formatUrl(undefined)).toBeNull();
        expect(formatUrl(null, { defaultValue: "" })).toBe("");
        expect(formatUrl(undefined, { defaultValue: "N/A" })).toBe("N/A");
      });

      it("should return default value for empty strings", () => {
        expect(formatUrl("")).toBeNull();
        expect(formatUrl("   ")).toBeNull();
        expect(formatUrl("", { defaultValue: "" })).toBe("");
      });

      it("should handle URLs with ports", () => {
        expect(
          formatUrl("https://example.com:8080/path", { style: "database" })
        ).toBe("https://example.com:8080/path");
        expect(
          formatUrl("https://example.com:8080/path", { style: "human" })
        ).toBe("example.com:8080/path");
      });

      it("should handle URLs with authentication", () => {
        expect(
          formatUrl("https://user:pass@example.com/path", { style: "database" })
        ).toBe("https://user:pass@example.com/path");
        expect(
          formatUrl("https://user:pass@example.com/path", { style: "human" })
        ).toBe("user:pass@example.com/path");
      });

      it("should handle complex query strings", () => {
        const complexQuery = "a=1&b=2&c=3&d=4";
        expect(
          formatUrl(`https://example.com/path?${complexQuery}`, {
            style: "database",
          })
        ).toBe(`https://example.com/path?${complexQuery}`);
      });

      it("should handle URLs with multiple hash characters", () => {
        // Edge case: hash in query string
        expect(
          formatUrl("https://example.com/path?query=value#hash", {
            style: "database",
          })
        ).toBe("https://example.com/path?query=value#hash");
      });

      it("should handle root path", () => {
        expect(formatUrl("https://example.com/", { style: "human" })).toBe(
          "example.com/"
        );
        expect(formatUrl("https://example.com", { style: "human" })).toBe(
          "example.com"
        );
      });

      it("should handle just a hash", () => {
        expect(formatUrl("#section", { style: "database" })).toBe("#section");
        expect(formatUrl("#section", { style: "human" })).toBe("#section");
        expect(formatUrl("#section", { style: "link" })).toBe("#section");
      });

      it("should handle just a query", () => {
        expect(formatUrl("?query=value", { style: "database" })).toBe(
          "?query=value"
        );
        expect(formatUrl("?query=value", { style: "human" })).toBe(
          "?query=value"
        );
        expect(formatUrl("?query=value", { style: "link" })).toBe(
          "?query=value"
        );
      });
    });

    describe("real-world examples", () => {
      it("should handle various URL formats", () => {
        const urls = [
          "https://example.com",
          "http://example.com",
          "https://example.com/path",
          "https://example.com/path/to/page",
          "https://example.com/path?query=value",
          "https://example.com/path#section",
          "https://example.com/path?query=value#section",
        ];

        urls.forEach((url) => {
          const result = formatUrl(url, { style: "human" });
          expect(result).not.toContain("https://");
          expect(result).not.toContain("http://");
        });
      });

      it("should handle social media URLs", () => {
        expect(
          formatUrl("https://twitter.com/user/status/123456", {
            style: "human",
          })
        ).toBe("twitter.com/user/status/123456");
        expect(
          formatUrl("https://www.facebook.com/page", { style: "human" })
        ).toBe("www.facebook.com/page");
      });

      it("should handle e-commerce URLs with long query strings", () => {
        const longQuery =
          "category=electronics&sort=price&filter=brand:apple&page=1&limit=50";
        const result = formatUrl(
          `https://shop.example.com/products?${longQuery}`,
          { style: "human" }
        ) as string;
        expect(result).toContain("shop.example.com/products");
        expect(result).toContain("?");
        // Should be truncated
        expect(result.length).toBeLessThan(100);
      });

      it("should handle URLs with hash fragments for single-page apps", () => {
        const longHash = "section/subsection/item/details/123456789";
        const result = formatUrl(
          `https://app.example.com/#${longHash}`,
          { style: "human" }
        ) as string;
        expect(result).toContain("app.example.com/");
        expect(result).toContain("#");
        // Should be truncated
        expect(result.length).toBeLessThan(70);
      });
    });
  });
});

