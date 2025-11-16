import {
  matchesAnyPattern,
  matchesAllPatterns,
  extractFromAnyPattern,
  extractAllMatches,
  extractCaptureGroup,
  extractAllCaptureGroups,
  findFirstMatchingPattern,
  extractBetween,
  extractNumbersFromPattern,
  matchAndExtract,
  toRegex,
  containsAny,
  containsAll,
  findIndexOfFirstMatch,
} from "../src/regex.js";

describe("regex", () => {
  describe("matchesAnyPattern", () => {
    it("should return true if any pattern matches", () => {
      expect(matchesAnyPattern("hello world", [/hello/, /foo/])).toBe(true);
      expect(matchesAnyPattern("hello world", ["hello", "foo"])).toBe(true);
      expect(matchesAnyPattern("hello world", [/world/])).toBe(true);
    });

    it("should return false if no pattern matches", () => {
      expect(matchesAnyPattern("hello world", [/foo/, /bar/])).toBe(false);
      expect(matchesAnyPattern("hello world", ["foo", "bar"])).toBe(false);
    });

    it("should handle case-insensitive string matching", () => {
      expect(matchesAnyPattern("Hello World", ["hello"])).toBe(true);
      expect(matchesAnyPattern("HELLO", ["hello"])).toBe(true);
    });
  });

  describe("matchesAllPatterns", () => {
    it("should return true if all patterns match", () => {
      expect(matchesAllPatterns("hello world", [/hello/, /world/])).toBe(true);
      expect(matchesAllPatterns("hello world", ["hello", "world"])).toBe(true);
    });

    it("should return false if any pattern doesn't match", () => {
      expect(matchesAllPatterns("hello world", [/hello/, /foo/])).toBe(false);
      expect(matchesAllPatterns("hello world", ["hello", "foo"])).toBe(false);
    });
  });

  describe("extractFromAnyPattern", () => {
    it("should return first match from any pattern", () => {
      const match = extractFromAnyPattern("hello 123", [/\d+/, /world/]);
      expect(match).not.toBeNull();
      expect(match?.[0]).toBe("123");
    });

    it("should return null if no pattern matches", () => {
      expect(extractFromAnyPattern("hello world", [/\d+/, /foo/])).toBeNull();
    });

    it("should handle string patterns", () => {
      const match = extractFromAnyPattern("hello world", ["world", /\d+/]);
      expect(match).not.toBeNull();
      expect(match?.[0]).toBe("world");
    });
  });

  describe("extractAllMatches", () => {
    it("should return all matches from all patterns", () => {
      const matches = extractAllMatches("hello 123 world 456", [/\d+/g]);
      expect(matches.length).toBeGreaterThan(0);
    });

    it("should return empty array if no matches", () => {
      expect(extractAllMatches("hello world", [/\d+/g])).toEqual([]);
    });
  });

  describe("extractCaptureGroup", () => {
    it("should extract specific capture group", () => {
      expect(extractCaptureGroup("hello 123", [/(\d+)/], 1)).toBe("123");
      expect(extractCaptureGroup("2024-01-15", [/(\d{4})-(\d{2})-(\d{2})/], 1)).toBe("2024");
      expect(extractCaptureGroup("2024-01-15", [/(\d{4})-(\d{2})-(\d{2})/], 2)).toBe("01");
    });

    it("should return null if no match", () => {
      expect(extractCaptureGroup("hello world", [/(\d+)/], 1)).toBeNull();
    });
  });

  describe("extractAllCaptureGroups", () => {
    it("should extract all capture groups", () => {
      expect(extractAllCaptureGroups("2024-01-15", [/(\d{4})-(\d{2})-(\d{2})/])).toEqual([
        "2024",
        "01",
        "15",
      ]);
    });

    it("should return empty array if no match", () => {
      expect(extractAllCaptureGroups("hello world", [/(\d+)/])).toEqual([]);
    });
  });

  describe("findFirstMatchingPattern", () => {
    it("should return first matching pattern", () => {
      expect(findFirstMatchingPattern("hello world", [/world/, /foo/])).toEqual(/world/);
      expect(findFirstMatchingPattern("hello world", ["world", "foo"])).toBe("world");
    });

    it("should return null if no pattern matches", () => {
      expect(findFirstMatchingPattern("hello world", [/foo/, /bar/])).toBeNull();
    });
  });

  describe("extractBetween", () => {
    it("should extract text between patterns", () => {
      expect(extractBetween("start:hello:end", "start:", ":end")).toBe("hello");
      expect(extractBetween("before<content>after", "<", ">")).toBe("content");
    });

    it("should return null if patterns not found", () => {
      expect(extractBetween("hello world", "start:", ":end")).toBeNull();
    });
  });

  describe("extractNumbersFromPattern", () => {
    it("should extract numeric values from capture groups", () => {
      expect(extractNumbersFromPattern("price: $123.45", [/\$(\d+)\.(\d+)/])).toEqual([123, 45]);
      expect(extractNumbersFromPattern("age: 25", [/age: (\d+)/])).toEqual([25]);
    });

    it("should return empty array if no match", () => {
      expect(extractNumbersFromPattern("hello world", [/(\d+)/])).toEqual([]);
    });
  });

  describe("matchAndExtract", () => {
    it("should extract and transform match", () => {
      expect(
        matchAndExtract("age: 25", [/age: (\d+)/], (match) => parseInt(match[1]))
      ).toBe(25);
    });

    it("should return null if no match", () => {
      expect(matchAndExtract("hello world", [/age: (\d+)/], (match) => parseInt(match[1]))).toBeNull();
    });
  });

  describe("toRegex", () => {
    it("should convert string to regex", () => {
      const regex = toRegex("hello", true, false);
      expect(regex.test("Hello")).toBe(true);
      expect(regex.test("HELLO")).toBe(true);
    });

    it("should escape special characters when requested", () => {
      const regex = toRegex("hello.world", true, true);
      expect(regex.test("hello.world")).toBe(true);
      expect(regex.test("helloxworld")).toBe(false);
    });

    it("should handle case-sensitive regex", () => {
      const regex = toRegex("hello", false, false);
      expect(regex.test("hello")).toBe(true);
      expect(regex.test("Hello")).toBe(false);
    });
  });

  describe("containsAny", () => {
    it("should return true if any pattern matches", () => {
      expect(containsAny("hello world", ["hello", "foo"])).toBe(true);
      expect(containsAny("hello world", [/hello/, /foo/])).toBe(true);
    });

    it("should return false if no pattern matches", () => {
      expect(containsAny("hello world", ["foo", "bar"])).toBe(false);
    });
  });

  describe("containsAll", () => {
    it("should return true if all patterns match", () => {
      expect(containsAll("hello world", ["hello", "world"])).toBe(true);
    });

    it("should return false if any pattern doesn't match", () => {
      expect(containsAll("hello world", ["hello", "foo"])).toBe(false);
    });
  });

  describe("findIndexOfFirstMatch", () => {
    it("should return index of first matching pattern", () => {
      expect(findIndexOfFirstMatch("hello world", ["foo", "world", "bar"])).toBe(1);
      expect(findIndexOfFirstMatch("hello world", [/foo/, /world/])).toBe(1);
    });

    it("should return -1 if no pattern matches", () => {
      expect(findIndexOfFirstMatch("hello world", ["foo", "bar"])).toBe(-1);
    });
  });
});

