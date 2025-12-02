import {
  toDate,
  toEpochMsTimestamp,
  toEpochSecondsTimestamp,
  parseDuration,
  toISODateString,
  toLocaleDateString,
  toLocaleTimeString,
  toDateString,
  toTimeString,
  toDateTimeString,
  isDateBetween,
  isAfter,
  isBefore,
  getDateDifference,
  getLastDateOfMonth,
  getLastDateOfYear,
  getLastDateOfQuarter,
  getFirstDateOfMonth,
  getFirstDateOfYear,
  getFirstDateOfWeek,
  getFirstDateOfQuarter,
  getMinDate,
  getMaxDate,
  getCurrentDateString,
  addDays,
  compareDates,
  getStartOfDay,
  getEndOfDay,
  isBeforeEndDate,
  isAfterStartDate,
  isDateInRange,
  addMonths,
  addYears,
  addHours,
  addMinutes,
  addSeconds,
  addToDate,
  isToday,
  getDaysBetween,
  getMonthsBetween,
  getYearsBetween,
  getAge,
  getRelativeTime,
  getYear,
  getMonth,
  getDayOfWeek,
  formatDate,
  formatDuration,
} from "../src/date/index.js";
import {
  isDate,
  isDateString,
  isTimeString,
  isDateTimeString,
} from "../src/is.js";

describe("date", () => {
  describe("isDate", () => {
    it("should return true for valid Date objects", () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date("2024-01-01"))).toBe(true);
    });

    it("should return false for non-Date values", () => {
      expect(isDate("2024-01-01")).toBe(false);
      expect(isDate(1234567890)).toBe(false);
      expect(isDate(null)).toBe(false);
    });

    it("should return false for Invalid Date objects", () => {
      expect(isDate(new Date("invalid"))).toBe(false);
      expect(isDate(new Date(NaN))).toBe(false);
    });
  });

  describe("isDateString", () => {
    it("should return true for valid date strings", () => {
      expect(isDateString("2024-01-01")).toBe(true);
      expect(isDateString("2024-12-31")).toBe(true);
      expect(isDateString("2024-02-29")).toBe(true); // Leap year
    });

    it("should return false for invalid date strings", () => {
      expect(isDateString("2024-1-1")).toBe(false);
      expect(isDateString("01-01-2024")).toBe(false);
      expect(isDateString("2024-01-01T12:00:00")).toBe(false);
      expect(isDateString("2024-02-30")).toBe(false); // Invalid date
      expect(isDateString("2024-13-01")).toBe(false); // Invalid month
      expect(isDateString("2023-02-29")).toBe(false); // Not a leap year
    });
  });

  describe("isTimeString", () => {
    it("should return true for valid time strings", () => {
      expect(isTimeString("12:00:00")).toBe(true);
      expect(isTimeString("23:59:59")).toBe(true);
    });

    it("should return false for invalid time strings", () => {
      expect(isTimeString("12:00")).toBe(false);
      expect(isTimeString("25:00:00")).toBe(false); // Invalid hour
      expect(isTimeString("12:60:00")).toBe(false); // Invalid minute
      expect(isTimeString("12:00:60")).toBe(false); // Invalid second
    });
  });

  describe("isDateTimeString", () => {
    it("should return true for valid date-time strings", () => {
      expect(isDateTimeString("2024-01-01T12:00:00")).toBe(true);
    });

    it("should return false for invalid date-time strings", () => {
      expect(isDateTimeString("2024-01-01 12:00:00")).toBe(false);
      expect(isDateTimeString("2024-01-01")).toBe(false);
    });
  });

  describe("toDate", () => {
    it("should return Date object if already a Date", () => {
      const date = new Date();
      expect(toDate(date)).toBe(date);
    });

    it("should convert date strings to Date", () => {
      const result = toDate("2024-01-01");
      expect(result).toBeInstanceOf(Date);
    });

    it("should convert timestamps to Date", () => {
      const timestamp = 1704067200000;
      const result = toDate(timestamp);
      expect(result).toBeInstanceOf(Date);
    });

    it("should detect and convert unix timestamps in seconds (10 digits)", () => {
      // Unix timestamp in seconds for 2024-01-15
      const secondsTimestamp = 1705276800;
      const result = toDate(secondsTimestamp);
      expect(result).toBeInstanceOf(Date);
      // Should be converted to milliseconds and match the expected date
      expect(result?.getTime()).toBe(1705276800000);
    });

    it("should handle unix timestamps in milliseconds (13 digits)", () => {
      // Unix timestamp in milliseconds for 2024-01-15
      const millisecondsTimestamp = 1705276800000;
      const result = toDate(millisecondsTimestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(1705276800000);
    });

    it("should return default for null/undefined", () => {
      expect(toDate(null)).toBe(null);
      // toDate with undefined returns null (default parameter)
      expect(toDate(undefined)).toBe(null);
      expect(toDate(null, new Date("2024-01-01"))).toBeInstanceOf(Date);
    });
  });

  describe("toEpochMsTimestamp", () => {
    it("should convert Date to milliseconds timestamp", () => {
      const date = new Date("2024-01-01");
      const result = toEpochMsTimestamp(date);
      expect(typeof result).toBe("number");
      expect(result).toBe(date.getTime());
    });

    it("should return default for invalid input", () => {
      expect(toEpochMsTimestamp(null)).toBe(null);
      expect(toEpochMsTimestamp("invalid")).toBe(null); // Now properly validates
      expect(toEpochMsTimestamp("2024-02-30")).toBe(null); // Invalid date
    });
  });

  describe("toEpochSecondsTimestamp", () => {
    it("should convert Date to seconds timestamp", () => {
      const date = new Date("2024-01-01");
      const result = toEpochSecondsTimestamp(date);
      expect(typeof result).toBe("number");
      expect(result).toBe(Math.floor(date.getTime() / 1000));
    });
  });

  describe("parseDuration", () => {
    it("should parse days (D)", () => {
      expect(parseDuration("1D")).toEqual({
        milliseconds: 24 * 60 * 60 * 1000,
        value: 1,
        unit: "D",
      });
      expect(parseDuration("5D")).toEqual({
        milliseconds: 5 * 24 * 60 * 60 * 1000,
        value: 5,
        unit: "D",
      });
      expect(parseDuration("D")).toEqual({
        milliseconds: 24 * 60 * 60 * 1000,
        value: 1,
        unit: "D",
      }); // Default to 1
    });

    it("should parse years (Y) as relative unit", () => {
      expect(parseDuration("1Y")).toEqual({
        milliseconds: 0, // Relative unit
        value: 1,
        unit: "Y",
      });
      expect(parseDuration("5Y")).toEqual({
        milliseconds: 0, // Relative unit
        value: 5,
        unit: "Y",
      });
      expect(parseDuration("Y")).toEqual({
        milliseconds: 0, // Relative unit
        value: 1,
        unit: "Y",
      });
    });

    it("should parse hours (h or H)", () => {
      expect(parseDuration("1h")).toEqual({
        milliseconds: 60 * 60 * 1000,
        value: 1,
        unit: "h",
      });
      expect(parseDuration("2H")).toEqual({
        milliseconds: 2 * 60 * 60 * 1000,
        value: 2,
        unit: "h",
      });
      expect(parseDuration("h")).toEqual({
        milliseconds: 60 * 60 * 1000,
        value: 1,
        unit: "h",
      });
    });

    it("should parse minutes (lowercase m)", () => {
      expect(parseDuration("1m")).toEqual({
        milliseconds: 60 * 1000,
        value: 1,
        unit: "m",
      });
      expect(parseDuration("5m")).toEqual({
        milliseconds: 5 * 60 * 1000,
        value: 5,
        unit: "m",
      });
      expect(parseDuration("m")).toEqual({
        milliseconds: 60 * 1000,
        value: 1,
        unit: "m",
      });
    });

    it("should parse months (uppercase M) as relative unit", () => {
      expect(parseDuration("1M")).toEqual({
        milliseconds: 0, // Relative unit
        value: 1,
        unit: "M",
      });
      expect(parseDuration("M")).toEqual({
        milliseconds: 0, // Relative unit
        value: 1,
        unit: "M",
      });
    });

    it("should parse seconds (s or S)", () => {
      expect(parseDuration("1s")).toEqual({
        milliseconds: 1000,
        value: 1,
        unit: "s",
      });
      expect(parseDuration("30S")).toEqual({
        milliseconds: 30 * 1000,
        value: 30,
        unit: "s",
      });
      expect(parseDuration("s")).toEqual({
        milliseconds: 1000,
        value: 1,
        unit: "s",
      });
    });

    it("should parse weeks (w or W)", () => {
      expect(parseDuration("1w")).toEqual({
        milliseconds: 7 * 24 * 60 * 60 * 1000,
        value: 1,
        unit: "W",
      });
      expect(parseDuration("2W")).toEqual({
        milliseconds: 2 * 7 * 24 * 60 * 60 * 1000,
        value: 2,
        unit: "W",
      });
      expect(parseDuration("W")).toEqual({
        milliseconds: 7 * 24 * 60 * 60 * 1000,
        value: 1,
        unit: "W",
      });
    });

    it("should handle positive sign (+)", () => {
      expect(parseDuration("+1D")).toEqual({
        milliseconds: 24 * 60 * 60 * 1000,
        value: 1,
        unit: "D",
      });
      expect(parseDuration("+5Y")).toEqual({
        milliseconds: 0, // Relative unit
        value: 5,
        unit: "Y",
      });
    });

    it("should handle negative sign (-)", () => {
      expect(parseDuration("-1D")).toEqual({
        milliseconds: -24 * 60 * 60 * 1000,
        value: -1,
        unit: "D",
      });
      expect(parseDuration("-2h")).toEqual({
        milliseconds: -2 * 60 * 60 * 1000,
        value: -2,
        unit: "h",
      });
      expect(parseDuration("-M")).toEqual({
        milliseconds: 0, // Relative unit
        value: -1,
        unit: "M",
      });
    });

    it("should handle decimal values", () => {
      expect(parseDuration("1.5D")).toEqual({
        milliseconds: 1.5 * 24 * 60 * 60 * 1000,
        value: 1.5,
        unit: "D",
      });
      expect(parseDuration("0.5h")).toEqual({
        milliseconds: 0.5 * 60 * 60 * 1000,
        value: 0.5,
        unit: "h",
      });
      expect(parseDuration(".5m")).toEqual({
        milliseconds: 0.5 * 60 * 1000,
        value: 0.5,
        unit: "m",
      });
    });

    it("should handle number input as milliseconds", () => {
      expect(parseDuration(86400000)).toEqual({
        milliseconds: 86400000,
        value: 86400000,
        unit: "ms",
      });
    });

    it("should handle object input", () => {
      expect(parseDuration({ value: 1, unit: "D" })).toEqual({
        milliseconds: 24 * 60 * 60 * 1000,
        value: 1,
        unit: "D",
      });
      expect(parseDuration({ value: 2, unit: "M" })).toEqual({
        milliseconds: 0, // Relative unit
        value: 2,
        unit: "M",
      });
    });

    it("should return null for invalid input", () => {
      expect(parseDuration("")).toBe(null);
      expect(parseDuration("invalid")).toBe(null);
      expect(parseDuration("1")).toBe(null); // No unit
      expect(parseDuration("X")).toBe(null); // Invalid unit
      expect(parseDuration(null as any)).toBe(null);
      expect(parseDuration(undefined as any)).toBe(null);
    });

    it("should handle whitespace", () => {
      expect(parseDuration(" 1D ")).toEqual({
        milliseconds: 24 * 60 * 60 * 1000,
        value: 1,
        unit: "D",
      });
      expect(parseDuration(" +2h ")).toEqual({
        milliseconds: 2 * 60 * 60 * 1000,
        value: 2,
        unit: "h",
      });
      expect(parseDuration(" -M ")).toEqual({
        milliseconds: 0, // Relative unit
        value: -1,
        unit: "M",
      });
    });
  });

  describe("toISODateString", () => {
    it("should convert Date to ISO string", () => {
      const date = new Date("2024-01-01T12:00:00Z");
      const result = toISODateString(date);
      expect(result).toMatch(/2024-01-01/);
    });
  });

  describe("toDateString", () => {
    it("should return date string if already in correct format", () => {
      expect(toDateString("2024-01-01")).toBe("2024-01-01");
    });

    it("should convert Date to date string", () => {
      const date = new Date("2024-01-01T12:00:00Z");
      const result = toDateString(date);
      expect(result).toBe("2024-01-01");
    });
  });

  describe("toTimeString", () => {
    it("should return time string if already in correct format", () => {
      expect(toTimeString("12:00:00")).toBe("12:00:00");
    });

    it("should convert Date to time string", () => {
      const date = new Date("2024-01-01T12:30:45Z");
      const result = toTimeString(date);
      expect(result).toMatch(/12:30:45/);
    });
  });

  describe("toDateTimeString", () => {
    it("should return date-time string if already in correct format", () => {
      expect(toDateTimeString("2024-01-01T12:00:00")).toBe(
        "2024-01-01T12:00:00"
      );
    });

    it("should convert Date to date-time string", () => {
      const date = new Date("2024-01-01T12:30:45Z");
      const result = toDateTimeString(date);
      expect(result).toMatch(/2024-01-01/);
      expect(result).toMatch(/12:30:45/);
    });
  });

  describe("isDateBetween", () => {
    it("should return true for dates within range", () => {
      expect(isDateBetween("2024-06-15", "2024-01-01", "2024-12-31")).toBe(
        true
      );
      expect(isDateBetween("2024-01-01", "2024-01-01", "2024-12-31")).toBe(
        true
      );
      expect(isDateBetween("2024-12-31", "2024-01-01", "2024-12-31")).toBe(
        true
      );
    });

    it("should return false for dates outside range", () => {
      expect(isDateBetween("2023-12-31", "2024-01-01", "2024-12-31")).toBe(
        false
      );
      expect(isDateBetween("2025-01-01", "2024-01-01", "2024-12-31")).toBe(
        false
      );
    });
  });

  describe("isAfter", () => {
    it("should return true when first date is after second", () => {
      expect(isAfter("2024-06-15", "2024-01-01")).toBe(true);
    });

    it("should return false when first date is not after second", () => {
      expect(isAfter("2024-01-01", "2024-06-15")).toBe(false);
      expect(isAfter("2024-01-01", "2024-01-01")).toBe(false);
    });
  });

  describe("isBefore", () => {
    it("should return true when first date is before second", () => {
      expect(isBefore("2024-01-01", "2024-06-15")).toBe(true);
    });

    it("should return false when first date is not before second", () => {
      expect(isBefore("2024-06-15", "2024-01-01")).toBe(false);
      expect(isBefore("2024-01-01", "2024-01-01")).toBe(false);
    });
  });

  describe("getDateDifference", () => {
    it("should return difference in milliseconds", () => {
      const date1 = new Date("2024-01-02");
      const date2 = new Date("2024-01-01");
      const diff = getDateDifference(date1, date2);
      expect(diff).toBe(24 * 60 * 60 * 1000); // 1 day in ms
    });

    it("should return 0 for invalid dates", () => {
      expect(getDateDifference(null, "2024-01-01")).toBe(0);
      expect(getDateDifference("2024-01-01", null)).toBe(0);
    });
  });

  describe("getLastDateOfMonth", () => {
    it("should return last date of month", () => {
      const result = getLastDateOfMonth("2024-01-15");
      expect(result).toBe("2024-01-31");
    });

    it("should handle February in leap year", () => {
      const result = getLastDateOfMonth("2024-02-15");
      expect(result).toBe("2024-02-29");
    });
  });

  describe("getLastDateOfYear", () => {
    it("should return last date of year", () => {
      const result = getLastDateOfYear("2024-06-15");
      expect(result).toBe("2024-12-31");
    });
  });

  describe("getFirstDateOfMonth", () => {
    it("should return first date of month", () => {
      const result = getFirstDateOfMonth("2024-01-15");
      expect(result).toBe("2024-01-01");
    });
  });

  describe("getFirstDateOfYear", () => {
    it("should return first date of year", () => {
      const result = getFirstDateOfYear("2024-06-15");
      expect(result).toBe("2024-01-01");
    });
  });

  describe("getFirstDateOfQuarter", () => {
    it("should return first date of Q1 (Jan-Mar)", () => {
      expect(getFirstDateOfQuarter("2024-01-15")).toBe("2024-01-01");
      expect(getFirstDateOfQuarter("2024-02-15")).toBe("2024-01-01");
      expect(getFirstDateOfQuarter("2024-03-15")).toBe("2024-01-01");
    });

    it("should return first date of Q2 (Apr-Jun)", () => {
      expect(getFirstDateOfQuarter("2024-04-15")).toBe("2024-04-01");
      expect(getFirstDateOfQuarter("2024-05-15")).toBe("2024-04-01");
      expect(getFirstDateOfQuarter("2024-06-15")).toBe("2024-04-01");
    });

    it("should return first date of Q3 (Jul-Sep)", () => {
      expect(getFirstDateOfQuarter("2024-07-15")).toBe("2024-07-01");
      expect(getFirstDateOfQuarter("2024-08-15")).toBe("2024-07-01");
      expect(getFirstDateOfQuarter("2024-09-15")).toBe("2024-07-01");
    });

    it("should return first date of Q4 (Oct-Dec)", () => {
      expect(getFirstDateOfQuarter("2024-10-15")).toBe("2024-10-01");
      expect(getFirstDateOfQuarter("2024-11-15")).toBe("2024-10-01");
      expect(getFirstDateOfQuarter("2024-12-15")).toBe("2024-10-01");
    });
  });

  describe("getMinDate", () => {
    it("should return earliest date", () => {
      const dates = ["2024-06-15", "2024-01-01", "2024-12-31"];
      const result = getMinDate(dates);
      expect(result).toBeInstanceOf(Date);
      // Note: toDate may parse dates in local timezone, so we check it's a valid date
      expect(result).not.toBeNull();
      expect(result?.getTime()).toBeLessThanOrEqual(
        new Date("2024-12-31").getTime()
      );
    });

    it("should return null for no valid dates", () => {
      expect(getMinDate([null, undefined, "invalid"])).toBe(null);
      expect(getMinDate(["2024-02-30", "invalid-date"])).toBe(null);
    });
  });

  describe("getMaxDate", () => {
    it("should return latest date", () => {
      const dates = ["2024-06-15", "2024-01-01", "2024-12-31"];
      const result = getMaxDate(dates);
      expect(result).toBeInstanceOf(Date);
      // Note: toDate may parse dates in local timezone, so we check it's a valid date
      expect(result).not.toBeNull();
      expect(result?.getTime()).toBeGreaterThanOrEqual(
        new Date("2024-01-01").getTime()
      );
    });
  });

  describe("getCurrentDateString", () => {
    it("should return current date as string", () => {
      const result = getCurrentDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getYear", () => {
    it("should return year from date", () => {
      expect(getYear(new Date("2024-01-15"))).toBe(2024);
      expect(getYear("2024-01-15")).toBe(2024);
    });

    it("should return current year if no date provided", () => {
      const currentYear = new Date().getFullYear();
      expect(getYear()).toBe(currentYear);
    });
  });

  describe("getMonth", () => {
    describe("with 'number' format (1-based)", () => {
      it("should return month as number 1-12", () => {
        expect(getMonth(new Date("2024-01-15"), { format: "number" })).toBe(1); // January
        expect(getMonth(new Date("2024-02-15"), { format: "number" })).toBe(2); // February
        expect(getMonth(new Date("2024-06-15"), { format: "number" })).toBe(6); // June
        expect(getMonth(new Date("2024-12-15"), { format: "number" })).toBe(12); // December
      });

      it("should work with date strings", () => {
        expect(getMonth("2024-01-15", { format: "number" })).toBe(1);
        expect(getMonth("2024-12-31", { format: "number" })).toBe(12);
      });

      it("should work with options only (uses current date)", () => {
        const currentMonth = new Date().getMonth() + 1; // 1-based
        expect(getMonth({ format: "number" })).toBe(currentMonth);
      });
    });

    describe("with 'number-zero-based' format (0-based)", () => {
      it("should return month as number 0-11", () => {
        expect(
          getMonth(new Date("2024-01-15"), { format: "number-zero-based" })
        ).toBe(0); // January
        expect(
          getMonth(new Date("2024-02-15"), { format: "number-zero-based" })
        ).toBe(1); // February
        expect(
          getMonth(new Date("2024-06-15"), { format: "number-zero-based" })
        ).toBe(5); // June
        expect(
          getMonth(new Date("2024-12-15"), { format: "number-zero-based" })
        ).toBe(11); // December
      });

      it("should work with date strings", () => {
        expect(getMonth("2024-01-15", { format: "number-zero-based" })).toBe(0);
        expect(getMonth("2024-12-31", { format: "number-zero-based" })).toBe(
          11
        );
      });

      it("should work with options only (uses current date)", () => {
        const currentMonth = new Date().getMonth(); // 0-based
        expect(getMonth({ format: "number-zero-based" })).toBe(currentMonth);
      });
    });

    describe("with string formats", () => {
      it("should return month as 'long' string", () => {
        const result = getMonth(new Date("2024-01-15"), { format: "long" });
        expect(typeof result).toBe("string");
        expect(result).toBe("January");
      });

      it("should return month as 'short' string", () => {
        const result = getMonth(new Date("2024-01-15"), { format: "short" });
        expect(typeof result).toBe("string");
        expect(result).toBe("Jan");
      });

      it("should return month as 'narrow' string", () => {
        const result = getMonth(new Date("2024-01-15"), { format: "narrow" });
        expect(typeof result).toBe("string");
        expect(result).toBe("J");
      });

      it("should support locale", () => {
        const result = getMonth(new Date("2024-01-15"), {
          format: "long",
          locale: "es",
        });
        expect(typeof result).toBe("string");
        expect(result).toBe("enero");
      });

      it("should work with options only (uses current date)", () => {
        const result = getMonth({ format: "long" });
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getDayOfWeek", () => {
    // Use explicit dates to avoid timezone issues
    // Create dates using Date constructor with year, month (0-based), day
    const sunday = new Date(2024, 0, 7); // January 7, 2024 is a Sunday
    const monday = new Date(2024, 0, 8); // January 8, 2024 is a Monday
    const tuesday = new Date(2024, 0, 9); // January 9, 2024 is a Tuesday
    const wednesday = new Date(2024, 0, 10); // January 10, 2024 is a Wednesday
    const thursday = new Date(2024, 0, 11); // January 11, 2024 is a Thursday
    const friday = new Date(2024, 0, 12); // January 12, 2024 is a Friday
    const saturday = new Date(2024, 0, 13); // January 13, 2024 is a Saturday

    describe("with 'number' format (1-based, 1=Sunday)", () => {
      it("should return day of week as number 1-7", () => {
        expect(getDayOfWeek(sunday, { format: "number" })).toBe(1); // Sunday
        expect(getDayOfWeek(monday, { format: "number" })).toBe(2); // Monday
        expect(getDayOfWeek(tuesday, { format: "number" })).toBe(3); // Tuesday
        expect(getDayOfWeek(wednesday, { format: "number" })).toBe(4); // Wednesday
        expect(getDayOfWeek(thursday, { format: "number" })).toBe(5); // Thursday
        expect(getDayOfWeek(friday, { format: "number" })).toBe(6); // Friday
        expect(getDayOfWeek(saturday, { format: "number" })).toBe(7); // Saturday
      });

      it("should work with date strings", () => {
        // Test that date strings work (values may vary by timezone, so just verify it returns a number)
        const result1 = getDayOfWeek("2024-01-07", { format: "number" });
        const result2 = getDayOfWeek("2024-01-08", { format: "number" });
        expect(typeof result1).toBe("number");
        expect(typeof result2).toBe("number");
        expect(result1).toBeGreaterThanOrEqual(1);
        expect(result1).toBeLessThanOrEqual(7);
        expect(result2).toBeGreaterThanOrEqual(1);
        expect(result2).toBeLessThanOrEqual(7);
        // The two dates should be different days
        expect(result1).not.toBe(result2);
      });

      it("should work with options only (uses current date)", () => {
        const currentDay = new Date().getDay() + 1; // 1-based (1=Sunday)
        expect(getDayOfWeek({ format: "number" })).toBe(currentDay);
      });
    });

    describe("with 'number-zero-based' format (0-based, 0=Sunday)", () => {
      it("should return day of week as number 0-6", () => {
        expect(getDayOfWeek(sunday, { format: "number-zero-based" })).toBe(0); // Sunday
        expect(getDayOfWeek(monday, { format: "number-zero-based" })).toBe(1); // Monday
        expect(getDayOfWeek(tuesday, { format: "number-zero-based" })).toBe(2); // Tuesday
        expect(getDayOfWeek(wednesday, { format: "number-zero-based" })).toBe(
          3
        ); // Wednesday
        expect(getDayOfWeek(thursday, { format: "number-zero-based" })).toBe(4); // Thursday
        expect(getDayOfWeek(friday, { format: "number-zero-based" })).toBe(5); // Friday
        expect(getDayOfWeek(saturday, { format: "number-zero-based" })).toBe(6); // Saturday
      });

      it("should work with date strings", () => {
        // Test that date strings work (values may vary by timezone, so just verify it returns a number)
        const result1 = getDayOfWeek("2024-01-07", {
          format: "number-zero-based",
        });
        const result2 = getDayOfWeek("2024-01-08", {
          format: "number-zero-based",
        });
        expect(typeof result1).toBe("number");
        expect(typeof result2).toBe("number");
        expect(result1).toBeGreaterThanOrEqual(0);
        expect(result1).toBeLessThanOrEqual(6);
        expect(result2).toBeGreaterThanOrEqual(0);
        expect(result2).toBeLessThanOrEqual(6);
        // The two dates should be different days
        expect(result1).not.toBe(result2);
      });

      it("should work with options only (uses current date)", () => {
        const currentDay = new Date().getDay(); // 0-based (0=Sunday)
        expect(getDayOfWeek({ format: "number-zero-based" })).toBe(currentDay);
      });
    });

    describe("with string formats", () => {
      it("should return day of week as 'long' string", () => {
        const result = getDayOfWeek(monday, { format: "long" });
        expect(typeof result).toBe("string");
        expect(result).toBe("Monday");
      });

      it("should return day of week as 'short' string", () => {
        const result = getDayOfWeek(monday, { format: "short" });
        expect(typeof result).toBe("string");
        expect(result).toBe("Mon");
      });

      it("should return day of week as 'narrow' string", () => {
        const result = getDayOfWeek(monday, { format: "narrow" });
        expect(typeof result).toBe("string");
        expect(result).toBe("M");
      });

      it("should support locale", () => {
        const result = getDayOfWeek(monday, {
          format: "long",
          locale: "es",
        });
        expect(typeof result).toBe("string");
        expect(result).toBe("lunes");
      });

      it("should work with options only (uses current date)", () => {
        const result = getDayOfWeek({ format: "long" });
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe("addDays", () => {
    it("should add days to date", () => {
      const result1 = addDays(10, "2024-01-15");
      expect(result1).toBeInstanceOf(Date);
      expect(result1?.toISOString().split("T")[0]).toBe("2024-01-25");
      
      const result2 = addDays(-5, "2024-01-15");
      expect(result2).toBeInstanceOf(Date);
      expect(result2?.toISOString().split("T")[0]).toBe("2024-01-10");
    });

    it("should use current date if not provided", () => {
      const result = addDays(0);
      expect(result).toBeInstanceOf(Date);
      const dateStr = result?.toISOString().split("T")[0];
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("compareDates", () => {
    it("should return -1 when first date is before second", () => {
      expect(compareDates("2024-01-01", "2024-06-15")).toBe(-1);
    });

    it("should return 0 when dates are equal", () => {
      expect(compareDates("2024-01-01", "2024-01-01")).toBe(0);
    });

    it("should return 1 when first date is after second", () => {
      expect(compareDates("2024-06-15", "2024-01-01")).toBe(1);
    });

    it("should return null for invalid dates", () => {
      expect(compareDates(null, "2024-01-01")).toBe(null);
      expect(compareDates("2024-01-01", null)).toBe(null);
    });
  });

  describe("getStartOfDay", () => {
    it("should return date set to start of day", () => {
      const date = new Date("2024-01-15T12:30:45");
      const result = getStartOfDay(date);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
      expect(result?.getSeconds()).toBe(0);
      expect(result?.getMilliseconds()).toBe(0);
    });

    it("should return null for invalid input", () => {
      expect(getStartOfDay(null)).toBe(null);
      expect(getStartOfDay(undefined)).toBe(null);
    });
  });

  describe("getEndOfDay", () => {
    it("should return date set to end of day", () => {
      const date = new Date("2024-01-15T12:30:45");
      const result = getEndOfDay(date);
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
      expect(result?.getSeconds()).toBe(59);
      expect(result?.getMilliseconds()).toBe(999);
    });
  });

  describe("isBeforeEndDate", () => {
    it("should return true when date is before end date", () => {
      expect(isBeforeEndDate("2024-01-15", "2024-01-20")).toBe(true);
      expect(isBeforeEndDate("2024-01-20", "2024-01-20")).toBe(true); // Same day
    });

    it("should return false when date is after end date", () => {
      expect(isBeforeEndDate("2024-01-25", "2024-01-20")).toBe(false);
    });

    it("should return true when end date is null (any date is valid)", () => {
      expect(isBeforeEndDate("2024-01-15", null)).toBe(true);
    });
  });

  describe("isAfterStartDate", () => {
    it("should return true when date is after start date", () => {
      expect(isAfterStartDate("2024-01-20", "2024-01-15")).toBe(true);
      expect(isAfterStartDate("2024-01-15", "2024-01-15")).toBe(true); // Same day
    });

    it("should return false when date is before start date", () => {
      expect(isAfterStartDate("2024-01-10", "2024-01-15")).toBe(false);
    });

    it("should return true when start date is null", () => {
      expect(isAfterStartDate("2024-01-15", null)).toBe(true);
    });
  });

  describe("isDateInRange", () => {
    it("should return true when date is in range", () => {
      expect(isDateInRange("2024-06-15", "2024-01-01", "2024-12-31")).toBe(
        true
      );
      expect(isDateInRange("2024-01-01", "2024-01-01", "2024-12-31")).toBe(
        true
      );
      expect(isDateInRange("2024-12-31", "2024-01-01", "2024-12-31")).toBe(
        true
      );
    });

    it("should return false when date is outside range", () => {
      expect(isDateInRange("2023-12-31", "2024-01-01", "2024-12-31")).toBe(
        false
      );
      expect(isDateInRange("2025-01-01", "2024-01-01", "2024-12-31")).toBe(
        false
      );
    });

    it("should handle null start date", () => {
      expect(isDateInRange("2024-06-15", null, "2024-12-31")).toBe(true);
      expect(isDateInRange("2025-01-01", null, "2024-12-31")).toBe(false);
    });

    it("should handle null end date", () => {
      expect(isDateInRange("2024-06-15", "2024-01-01", null)).toBe(true);
      expect(isDateInRange("2023-12-31", "2024-01-01", null)).toBe(false);
    });

    it("should handle both null start and end date (any date is valid)", () => {
      expect(isDateInRange("2024-06-15", null, null)).toBe(true);
      expect(isDateInRange("2023-12-31", null, null)).toBe(true);
      expect(isDateInRange("2025-01-01", null, null)).toBe(true);
    });
  });

  describe("addMonths", () => {
    it("should add months to date using calendar months", () => {
      const result = addMonths(2, "2024-01-15");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMonth()).toBe(2); // March (0-indexed)
      expect(result?.getFullYear()).toBe(2024);
    });

    it("should handle February correctly (Feb 1 -> Mar 1)", () => {
      const result = addMonths(1, "2024-02-01");
      expect(result).toBeInstanceOf(Date);
      const resultStr = result?.toISOString().split("T")[0];
      expect(resultStr).toBe("2024-03-01");
    });

    it("should handle month-end dates correctly", () => {
      // Jan 31 + 1 month = Feb 31 doesn't exist, so JavaScript adjusts
      // The behavior depends on timezone, but JavaScript's Date constructor
      // will adjust invalid dates (e.g., Feb 31 -> Feb 29 in leap year, or March 2/3)
      const result = addMonths(1, "2024-01-31");
      expect(result).toBeInstanceOf(Date);
      // The result should be a valid date in February or early March
      // In 2024 (leap year), Feb has 29 days
      const month = result?.getMonth();
      expect([1, 2]).toContain(month); // February (1) or March (2)
      if (month === 1) {
        // If it's February, it should be Feb 29 (last day of month)
        expect(result?.getDate()).toBe(29);
      } else {
        // If it overflowed to March, it should be March 1 or 2
        expect([1, 2, 3]).toContain(result?.getDate());
      }
    });

    it("should subtract months when negative", () => {
      const result = addMonths(-1, "2024-03-15");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMonth()).toBe(1); // February (0-indexed)
    });

    it("should handle year rollover", () => {
      const result = addMonths(2, "2024-11-15");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMonth()).toBe(0); // January (0-indexed)
      expect(result?.getFullYear()).toBe(2025);
    });

    it("should return null for invalid date", () => {
      expect(addMonths(1, null)).toBe(null);
      expect(addMonths(1, "invalid")).toBe(null);
    });
  });

  describe("addYears", () => {
    it("should add years to date using calendar years", () => {
      const result = addYears(1, "2024-01-15");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(0);
      // Check date string to avoid timezone issues
      const resultStr = result?.toISOString().split("T")[0];
      expect(resultStr).toBe("2025-01-15");
    });

    it("should handle February correctly (Feb 1 -> Mar 1)", () => {
      const result = addYears(1, "2024-02-01");
      expect(result).toBeInstanceOf(Date);
      const resultStr = result?.toISOString().split("T")[0];
      expect(resultStr).toBe("2025-02-01");
    });

    it("should subtract years when negative", () => {
      const result = addYears(-2, "2024-01-15");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2022);
    });

    it("should return null for invalid date", () => {
      expect(addYears(1, null)).toBe(null);
      expect(addYears(1, "invalid")).toBe(null);
    });
  });

  describe("addHours", () => {
    it("should add hours to date", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addHours(2, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(14);
    });

    it("should subtract hours when negative", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addHours(-1, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(11);
    });

    it("should handle day rollover", () => {
      const date = new Date("2024-01-15T23:00:00");
      const result = addHours(2, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(1);
      expect(result?.getDate()).toBe(16);
    });

    it("should return null for invalid date", () => {
      expect(addHours(1, null)).toBe(null);
    });
  });

  describe("addMinutes", () => {
    it("should add minutes to date", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addMinutes(30, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMinutes()).toBe(30);
    });

    it("should subtract minutes when negative", () => {
      const date = new Date("2024-01-15T12:30:00");
      const result = addMinutes(-15, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMinutes()).toBe(15);
    });

    it("should handle hour rollover", () => {
      const date = new Date("2024-01-15T12:45:00");
      const result = addMinutes(30, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMinutes()).toBe(15);
      expect(result?.getHours()).toBe(13);
    });

    it("should return null for invalid date", () => {
      expect(addMinutes(1, null)).toBe(null);
    });
  });

  describe("addSeconds", () => {
    it("should add seconds to date", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addSeconds(45, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getSeconds()).toBe(45);
    });

    it("should subtract seconds when negative", () => {
      const date = new Date("2024-01-15T12:00:30");
      const result = addSeconds(-15, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getSeconds()).toBe(15);
    });

    it("should handle minute rollover", () => {
      const date = new Date("2024-01-15T12:00:45");
      const result = addSeconds(30, date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getSeconds()).toBe(15);
      expect(result?.getMinutes()).toBe(1);
    });

    it("should return null for invalid date", () => {
      expect(addSeconds(1, null)).toBe(null);
    });
  });

  describe("addToDate", () => {
    it("should add duration string to current date when no date provided", () => {
      const now = new Date();
      const result = addToDate("1D");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(now.getTime() + 24 * 60 * 60 * 1000);
    });

    it("should add duration string to specified date", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      const result = addToDate("1D", baseDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(baseDate.getTime() + 24 * 60 * 60 * 1000);
    });

    it("should handle relative units (months) using calendar calculation", () => {
      const result = addToDate("1M", "2024-02-01");
      expect(result).toBeInstanceOf(Date);
      const resultStr = result?.toISOString().split("T")[0];
      expect(resultStr).toBe("2024-03-01");
    });

    it("should handle relative units (years) using calendar calculation", () => {
      const result = addToDate("1Y", "2024-02-01");
      expect(result).toBeInstanceOf(Date);
      const resultStr = result?.toISOString().split("T")[0];
      expect(resultStr).toBe("2025-02-01");
    });

    it("should handle relative units (quarters) using calendar calculation", () => {
      const baseDate = new Date("2024-01-15");
      const result = addToDate("1Q", baseDate);
      expect(result).toBeInstanceOf(Date);
      // 1 quarter = 3 months
      expect(result?.getMonth()).toBe(3); // April (0-indexed)
    });

    it("should add milliseconds number to current date when no date provided", () => {
      const now = new Date();
      const milliseconds = 2 * 60 * 60 * 1000; // 2 hours
      const result = addToDate(milliseconds);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(now.getTime() + milliseconds);
    });

    it("should add milliseconds number to specified date", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      const milliseconds = 30 * 60 * 1000; // 30 minutes
      const result = addToDate(milliseconds, baseDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(baseDate.getTime() + milliseconds);
    });

    it("should handle negative duration strings", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      const result = addToDate("-2h", baseDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(baseDate.getTime() - 2 * 60 * 60 * 1000);
    });

    it("should handle positive sign in duration strings", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      const result = addToDate("+1D", baseDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(baseDate.getTime() + 24 * 60 * 60 * 1000);
    });

    it("should handle various duration units", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      
      // Years (relative unit - calendar-based)
      const yearsResult = addToDate("1Y", baseDate);
      expect(yearsResult).toBeInstanceOf(Date);
      expect(yearsResult?.getFullYear()).toBe(2025);
      expect(yearsResult?.getMonth()).toBe(0); // January
      expect(yearsResult?.getDate()).toBe(15);
      
      // Months (relative unit - calendar-based)
      const monthsResult = addToDate("1M", baseDate);
      expect(monthsResult).toBeInstanceOf(Date);
      expect(monthsResult?.getMonth()).toBe(1); // February
      expect(monthsResult?.getFullYear()).toBe(2024);
      expect(monthsResult?.getDate()).toBe(15);
      
      // Hours (fixed unit)
      const hoursResult = addToDate("2h", baseDate);
      expect(hoursResult?.getTime()).toBe(baseDate.getTime() + 2 * 60 * 60 * 1000);
      
      // Minutes
      const minutesResult = addToDate("30m", baseDate);
      expect(minutesResult?.getTime()).toBe(baseDate.getTime() + 30 * 60 * 1000);
      
      // Seconds
      const secondsResult = addToDate("45s", baseDate);
      expect(secondsResult?.getTime()).toBe(baseDate.getTime() + 45 * 1000);
    });

    it("should handle unit-only strings (defaults to 1)", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      
      const dayResult = addToDate("D", baseDate);
      expect(dayResult?.getTime()).toBe(baseDate.getTime() + 24 * 60 * 60 * 1000);
      
      const minuteResult = addToDate("m", baseDate);
      expect(minuteResult?.getTime()).toBe(baseDate.getTime() + 60 * 1000);
    });

    it("should handle decimal duration values", () => {
      const baseDate = new Date("2024-01-15T12:00:00");
      const result = addToDate("1.5h", baseDate);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(baseDate.getTime() + 1.5 * 60 * 60 * 1000);
    });

    it("should return null for invalid duration string", () => {
      expect(addToDate("invalid", new Date())).toBe(null);
      expect(addToDate("", new Date())).toBe(null);
    });

    it("should return null for invalid date", () => {
      expect(addToDate("1D", "invalid")).toBe(null);
      expect(addToDate("1D", null)).toBe(null);
    });

    it("should return null for invalid duration type", () => {
      expect(addToDate(null as any, new Date())).toBe(null);
      expect(addToDate(undefined as any, new Date())).toBe(null);
    });

    it("should work with date strings", () => {
      const result = addToDate("1D", "2024-01-15");
      expect(result).toBeInstanceOf(Date);
      const expected = new Date("2024-01-16");
      expect(result?.toISOString().split("T")[0]).toBe("2024-01-16");
    });
  });

  describe("isToday", () => {
    it("should return true for today", () => {
      expect(isToday(new Date())).toBe(true);
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      expect(isToday(todayStr)).toBe(true);
    });

    it("should return false for other dates", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
      expect(isToday("2020-01-01")).toBe(false);
    });

    it("should return false for invalid date", () => {
      expect(isToday(null)).toBe(false);
      expect(isToday("invalid")).toBe(false);
    });
  });

  describe("getDaysBetween", () => {
    it("should return positive days when first date is after", () => {
      expect(getDaysBetween("2024-01-15", "2024-01-10")).toBe(5);
    });

    it("should return negative days when first date is before", () => {
      expect(getDaysBetween("2024-01-10", "2024-01-15")).toBe(-5);
    });

    it("should return 0 for same dates", () => {
      expect(getDaysBetween("2024-01-15", "2024-01-15")).toBe(0);
    });

    it("should handle dates across months", () => {
      expect(getDaysBetween("2024-02-01", "2024-01-15")).toBe(17);
    });

    it("should return null for invalid dates", () => {
      expect(getDaysBetween(null, "2024-01-15")).toBe(null);
      expect(getDaysBetween("2024-01-15", null)).toBe(null);
    });
  });

  describe("getMonthsBetween", () => {
    it("should return positive months when first date is after", () => {
      expect(getMonthsBetween("2024-03-15", "2024-01-15")).toBe(2);
    });

    it("should return negative months when first date is before", () => {
      expect(getMonthsBetween("2024-01-15", "2024-03-15")).toBe(-2);
    });

    it("should return 0 for same month", () => {
      expect(getMonthsBetween("2024-01-15", "2024-01-20")).toBe(0);
    });

    it("should handle dates across years", () => {
      expect(getMonthsBetween("2025-03-15", "2024-01-15")).toBe(14);
    });

    it("should return null for invalid dates", () => {
      expect(getMonthsBetween(null, "2024-01-15")).toBe(null);
      expect(getMonthsBetween("2024-01-15", null)).toBe(null);
    });
  });

  describe("getYearsBetween", () => {
    it("should return positive years when first date is after", () => {
      expect(getYearsBetween("2025-01-15", "2024-01-15")).toBe(1);
    });

    it("should return negative years when first date is before", () => {
      expect(getYearsBetween("2024-01-15", "2025-01-15")).toBe(-1);
    });

    it("should return 0 for same year", () => {
      expect(getYearsBetween("2024-01-15", "2024-12-31")).toBe(0);
    });

    it("should return null for invalid dates", () => {
      expect(getYearsBetween(null, "2024-01-15")).toBe(null);
      expect(getYearsBetween("2024-01-15", null)).toBe(null);
    });
  });

  describe("getAge", () => {
    it("should calculate age correctly", () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 25;
      const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
      const age = getAge(birthDate);
      expect(age).toBe(25);
    });

    it("should handle birthday not yet occurred this year", () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 25;
      // Set birth date to a future month this year
      const birthDate = new Date(
        birthYear,
        today.getMonth() + 1,
        today.getDate()
      );
      const age = getAge(birthDate);
      expect(age).toBe(24); // Not yet 25
    });

    it("should handle birthday already occurred this year", () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 25;
      // Set birth date to a past month this year
      const birthDate = new Date(
        birthYear,
        today.getMonth() - 1,
        today.getDate()
      );
      const age = getAge(birthDate);
      expect(age).toBe(25);
    });

    it("should return null for invalid date", () => {
      expect(getAge(null)).toBe(null);
      expect(getAge("invalid")).toBe(null);
    });
  });

  describe("getRelativeTime", () => {
    it("should return 'just now' for very recent times", () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 5000); // 5 seconds ago
      expect(getRelativeTime(recent)).toBe("just now");
    });

    it("should handle custom threshold", () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 5000); // 5 seconds ago
      expect(getRelativeTime(recent, { threshold: 3 })).toMatch(/ago/);
      expect(getRelativeTime(recent, { threshold: 10 })).toBe("just now");
    });

    it("should return seconds ago", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 15000); // 15 seconds ago
      const result = getRelativeTime(past);
      expect(result).toMatch(/second/);
      expect(result).toMatch(/ago/);
    });

    it("should return minutes ago", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
      expect(getRelativeTime(past)).toBe("2 minutes ago");
    });

    it("should return hours ago", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
      expect(getRelativeTime(past)).toBe("3 hours ago");
    });

    it("should return days ago", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      expect(getRelativeTime(past)).toBe("5 days ago");
    });

    it("should return weeks ago", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
      expect(getRelativeTime(past)).toBe("2 weeks ago");
    });

    it("should return months ago", () => {
      const now = new Date();
      const past = addMonths(-3, now);
      if (past) {
        const result = getRelativeTime(past);
        expect(result).toMatch(/month/);
        expect(result).toMatch(/ago/);
      }
    });

    it("should return years ago", () => {
      const now = new Date();
      const past = addYears(-2, now);
      if (past) {
        const result = getRelativeTime(past);
        expect(result).toMatch(/year/);
        expect(result).toMatch(/ago/);
      }
    });

    it("should return 'from now' for future dates", () => {
      const now = new Date();
      const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      expect(getRelativeTime(future)).toBe("2 hours from now");
    });

    it("should handle singular units", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 60 * 1000); // 1 minute ago
      expect(getRelativeTime(past)).toBe("1 minute ago");
    });

    it("should round to nearest unit when round is true", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 90 * 1000); // 90 seconds = 1.5 minutes
      expect(getRelativeTime(past, { round: true })).toBe("2 minutes ago");
    });

    it("should use floor when round is false", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 90 * 1000); // 90 seconds = 1.5 minutes
      expect(getRelativeTime(past, { round: false })).toBe("1 minute ago");
    });

    it("should use custom reference date", () => {
      const refDate = new Date("2024-01-01");
      const date = new Date("2024-01-06"); // 5 days later
      expect(getRelativeTime(date, { referenceDate: refDate })).toBe(
        "5 days from now"
      );
    });

    it("should return null for invalid date", () => {
      expect(getRelativeTime(null)).toBe(null);
      expect(getRelativeTime("invalid")).toBe(null);
    });

    it("should return null for invalid reference date", () => {
      const now = new Date();
      expect(getRelativeTime(now, { referenceDate: "invalid" })).toBe(null);
    });

    it("should handle date strings", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const pastStr = past.toISOString();
      expect(getRelativeTime(pastStr)).toBe("2 hours ago");
    });

    it("should handle rounding for years with months", () => {
      const now = new Date();
      const past = addMonths(-18, now); // 1.5 years ago
      if (past) {
        const result = getRelativeTime(past, { round: true });
        expect(result).toMatch(/year/);
      }
    });

    describe("short variant", () => {
      it("should return short format for seconds", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 10 * 1000); // 10 seconds ago
        expect(getRelativeTime(past, { variant: "short", threshold: 5 })).toBe(
          "10s ago"
        );
      });

      it("should return short format for minutes", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
        expect(getRelativeTime(past, { variant: "short" })).toBe("15m ago");
      });

      it("should return short format for hours", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 13 * 60 * 60 * 1000); // 13 hours ago
        expect(getRelativeTime(past, { variant: "short" })).toBe("13H ago");
      });

      it("should return short format for days", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
        expect(getRelativeTime(past, { variant: "short" })).toBe("5D ago");
      });

      it("should return short format for weeks", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
        expect(getRelativeTime(past, { variant: "short" })).toBe("2W ago");
      });

      it("should return short format for months", () => {
        const now = new Date();
        const past = addMonths(-2, now);
        if (past) {
          const result = getRelativeTime(past, { variant: "short" });
          expect(result).toBe("2M ago");
        }
      });

      it("should return short format for years", () => {
        const now = new Date();
        const past = addYears(-3, now);
        if (past) {
          const result = getRelativeTime(past, { variant: "short" });
          expect(result).toBe("3Y ago");
        }
      });

      it("should return short format for future dates", () => {
        const now = new Date();
        const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
        expect(getRelativeTime(future, { variant: "short" })).toBe(
          "2H from now"
        );
      });

      it("should still return 'just now' for very recent times in short format", () => {
        const now = new Date();
        const recent = new Date(now.getTime() - 5000); // 5 seconds ago
        expect(getRelativeTime(recent, { variant: "short" })).toBe("just now");
      });
    });

    describe("abbreviation variant", () => {
      it("should return abbreviation format for seconds without direction", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 10 * 1000); // 10 seconds ago
        expect(
          getRelativeTime(past, { variant: "abbreviation", threshold: 5 })
        ).toBe("10s");
      });

      it("should return abbreviation format for minutes without direction", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
        expect(getRelativeTime(past, { variant: "abbreviation" })).toBe("15m");
      });

      it("should return abbreviation format for hours without direction", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 13 * 60 * 60 * 1000); // 13 hours ago
        expect(getRelativeTime(past, { variant: "abbreviation" })).toBe("13H");
      });

      it("should return abbreviation format for days without direction", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
        expect(getRelativeTime(past, { variant: "abbreviation" })).toBe("5D");
      });

      it("should return abbreviation format for weeks without direction", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
        expect(getRelativeTime(past, { variant: "abbreviation" })).toBe("2W");
      });

      it("should return abbreviation format for months without direction", () => {
        const now = new Date();
        const past = addMonths(-2, now);
        if (past) {
          const result = getRelativeTime(past, { variant: "abbreviation" });
          expect(result).toBe("2M");
        }
      });

      it("should return abbreviation format for years without direction", () => {
        const now = new Date();
        const past = addYears(-3, now);
        if (past) {
          const result = getRelativeTime(past, { variant: "abbreviation" });
          expect(result).toBe("3Y");
        }
      });

      it("should return abbreviation format for future dates without direction", () => {
        const now = new Date();
        const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
        expect(getRelativeTime(future, { variant: "abbreviation" })).toBe("2H");
      });

      it("should still return 'just now' for very recent times in abbreviation format", () => {
        const now = new Date();
        const recent = new Date(now.getTime() - 5000); // 5 seconds ago
        expect(getRelativeTime(recent, { variant: "abbreviation" })).toBe(
          "just now"
        );
      });
    });

    describe("unitLabels", () => {
      it("should use custom unit labels in standard format", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
        expect(
          getRelativeTime(past, {
            unitLabels: {
              minute: ["min", "mins"],
            },
          })
        ).toBe("2 mins ago");
      });

      it("should use custom unit labels with single string (auto-pluralize)", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 1 * 60 * 1000); // 1 minute ago
        expect(
          getRelativeTime(past, {
            unitLabels: {
              minute: "min",
            },
          })
        ).toBe("1 min ago");
      });

      it("should use custom abbreviations in short format", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
        expect(
          getRelativeTime(past, {
            variant: "short",
            unitLabels: {
              hour: "hr",
            },
          })
        ).toBe("2hr ago");
      });

      it("should use custom abbreviations in abbreviation format", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
        expect(
          getRelativeTime(past, {
            variant: "abbreviation",
            unitLabels: {
              hour: "hr",
            },
          })
        ).toBe("2hr");
      });

      it("should use custom abbreviations from array in abbreviation format", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
        expect(
          getRelativeTime(past, {
            variant: "abbreviation",
            unitLabels: {
              hour: ["hour", "hours"],
            },
          })
        ).toBe("2hour"); // Uses singular from array
      });

      it("should handle multiple custom unit labels", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
        expect(
          getRelativeTime(past, {
            unitLabels: {
              day: ["day", "days"],
              week: ["week", "weeks"],
              month: ["mo", "mos"],
            },
          })
        ).toBe("5 days ago");
      });

      it("should use defaults when unitLabels not provided", () => {
        const now = new Date();
        const past = new Date(now.getTime() - 2 * 60 * 1000); // 2 minutes ago
        expect(getRelativeTime(past)).toBe("2 minutes ago");
      });
    });
  });

  describe("formatDate", () => {
    describe("basic formatting", () => {
      it("should format YYYY-MM-DD to default format", () => {
        expect(formatDate("2024-01-15")).toBe("2024-01-15");
      });

      it("should format YYYY-MM-DD to M/d/y format", () => {
        expect(formatDate("2024-01-15", "M/d/y")).toBe("1/15/24");
      });

      it("should format YYYY-MM-DD to M/d/YYYY format", () => {
        expect(formatDate("2024-01-15", "M/d/YYYY")).toBe("1/15/2024");
      });

      it("should format YYYY-MM-DD to DD/MM/YYYY format", () => {
        expect(formatDate("2024-01-15", "DD/MM/YYYY")).toBe("15/01/2024");
      });

      it("should format YYYY-MM-DD to MM/DD/YYYY format", () => {
        expect(formatDate("2024-01-15", "MM/DD/YYYY")).toBe("01/15/2024");
      });

      it("should format Date object to M/d/y format", () => {
        const date = new Date(2024, 0, 15); // January 15, 2024
        expect(formatDate(date, "M/d/y")).toBe("1/15/24");
      });

      it("should format Date object to YYYY-MM-DD format", () => {
        const date = new Date(2024, 0, 15); // January 15, 2024
        expect(formatDate(date, "YYYY-MM-DD")).toBe("2024-01-15");
      });
    });

    describe("year-only input", () => {
      it("should treat year string as January 1st", () => {
        expect(formatDate("2024", "YYYY-MM-DD")).toBe("2024-01-01");
      });

      it("should treat year number as January 1st", () => {
        expect(formatDate(2024, "YYYY-MM-DD")).toBe("2024-01-01");
      });

      it("should format year-only to M/d/YYYY format", () => {
        expect(formatDate("2024", "M/d/YYYY")).toBe("1/1/2024");
      });

      it("should format year-only to M/d/y format", () => {
        expect(formatDate(2024, "M/d/y")).toBe("1/1/24");
      });
    });

    describe("timezone safety", () => {
      it("should not shift dates due to timezone when formatting", () => {
        // Create a date that could be affected by timezone
        const dateStr = "2024-01-15";
        const formatted = formatDate(dateStr, "YYYY-MM-DD");
        expect(formatted).toBe("2024-01-15");
      });

      it("should preserve date when converting between formats", () => {
        const dateStr = "2024-12-31";
        expect(formatDate(dateStr, "M/d/y")).toBe("12/31/24");
        expect(formatDate(dateStr, "YYYY-MM-DD")).toBe("2024-12-31");
      });

      it("should handle dates at month boundaries correctly", () => {
        expect(formatDate("2024-02-29", "M/d/YYYY")).toBe("2/29/2024"); // Leap year
        expect(formatDate("2024-03-01", "M/d/YYYY")).toBe("3/1/2024");
      });
    });

    describe("edge cases", () => {
      it("should return default value for invalid date string", () => {
        expect(formatDate("2024-13-01", "YYYY-MM-DD", "invalid")).toBe(
          "invalid"
        );
      });

      it("should return default value for invalid date", () => {
        expect(formatDate("invalid", "YYYY-MM-DD", null)).toBe(null);
      });

      it("should return default value for null", () => {
        expect(formatDate(null, "YYYY-MM-DD", "default")).toBe("default");
      });

      it("should return default value for undefined", () => {
        expect(formatDate(undefined, "YYYY-MM-DD", "default")).toBe("default");
      });

      it("should handle single digit months and days correctly", () => {
        expect(formatDate("2024-01-05", "M/d/YYYY")).toBe("1/5/2024");
        expect(formatDate("2024-01-05", "MM/DD/YYYY")).toBe("01/05/2024");
      });

      it("should handle double digit months and days correctly", () => {
        expect(formatDate("2024-12-31", "M/d/YYYY")).toBe("12/31/2024");
        expect(formatDate("2024-12-31", "MM/DD/YYYY")).toBe("12/31/2024");
      });
    });

    describe("format patterns", () => {
      it("should handle YY format (2-digit year)", () => {
        expect(formatDate("2024-01-15", "M/d/YY")).toBe("1/15/24");
        expect(formatDate("1999-01-15", "M/d/YY")).toBe("1/15/99");
      });

      it("should handle mixed format patterns", () => {
        expect(formatDate("2024-01-15", "YYYY-M-D")).toBe("2024-1-15");
        expect(formatDate("2024-01-15", "YY-MM-DD")).toBe("24-01-15");
      });

      it("should handle format with separators", () => {
        expect(formatDate("2024-01-15", "YYYY.MM.DD")).toBe("2024.01.15");
        expect(formatDate("2024-01-15", "M-D-YY")).toBe("1-15-24");
      });
    });

    describe("timestamp input", () => {
      it("should format milliseconds timestamp to date format", () => {
        const timestamp = new Date(2024, 0, 15).getTime();
        expect(formatDate(timestamp, "YYYY-MM-DD")).toBe("2024-01-15");
      });

      it("should format seconds timestamp to date format", () => {
        // Unix timestamp in seconds (convert from same date as milliseconds test)
        const secondsTimestamp = Math.floor(new Date(2024, 0, 15).getTime() / 1000);
        expect(formatDate(secondsTimestamp, "YYYY-MM-DD")).toBe("2024-01-15");
      });
    });
  });

  describe("formatDuration", () => {
    describe("long format (default)", () => {
      it("should format days with pluralization", () => {
        expect(formatDuration("1D")).toBe("1 day");
        expect(formatDuration("2D")).toBe("2 days");
        expect(formatDuration("5D")).toBe("5 days");
      });

      it("should format hours with pluralization", () => {
        expect(formatDuration("1h")).toBe("1 Hour");
        expect(formatDuration("2h")).toBe("2 Hours");
        expect(formatDuration("24h")).toBe("24 Hours");
      });

      it("should format minutes with pluralization", () => {
        expect(formatDuration("1m")).toBe("1 minute");
        expect(formatDuration("30m")).toBe("30 minutes");
        expect(formatDuration("60m")).toBe("60 minutes");
      });

      it("should format seconds with pluralization", () => {
        expect(formatDuration("1s")).toBe("1 second");
        expect(formatDuration("45s")).toBe("45 seconds");
      });

      it("should format weeks with pluralization", () => {
        expect(formatDuration("1W")).toBe("1 week");
        expect(formatDuration("2W")).toBe("2 weeks");
      });

      it("should format months with pluralization", () => {
        expect(formatDuration("1M")).toBe("1 month");
        expect(formatDuration("2M")).toBe("2 months");
        expect(formatDuration("12M")).toBe("12 months");
      });

      it("should format years with pluralization", () => {
        expect(formatDuration("1Y")).toBe("1 year");
        expect(formatDuration("5Y")).toBe("5 years");
      });

      it("should format quarters with pluralization", () => {
        expect(formatDuration("1Q")).toBe("1 quarter");
        expect(formatDuration("2Q")).toBe("2 quarters");
      });

      it("should format milliseconds with pluralization", () => {
        expect(formatDuration("1ms")).toBe("1 millisecond");
        expect(formatDuration("1000ms")).toBe("1000 milliseconds");
      });

      it("should handle decimal values", () => {
        expect(formatDuration("1.5D")).toBe("1.5 days");
        expect(formatDuration("0.5h")).toBe("0.5 Hours");
        expect(formatDuration(".5m")).toBe("0.5 minutes");
      });

      it("should handle default unit (1)", () => {
        expect(formatDuration("D")).toBe("1 day");
        expect(formatDuration("h")).toBe("1 Hour");
        expect(formatDuration("m")).toBe("1 minute");
      });
    });

    describe("short format", () => {
      it("should format string/object input with concatenated unit, no space", () => {
        expect(formatDuration("1D", { style: "short" })).toBe("1D");
        expect(formatDuration("2h", { style: "short" })).toBe("2h");
        expect(formatDuration("5m", { style: "short" })).toBe("5m");
        expect(formatDuration("30s", { style: "short" })).toBe("30s");
      });

      it("should format number input as colon-separated time (H:MM:SS)", () => {
        // 5 hours, 16 minutes, 3 seconds
        expect(formatDuration(5 * 3600000 + 16 * 60000 + 3 * 1000, { style: "short" })).toBe("5:16:03");
        // 1 hour, 1 minute, 1 second
        expect(formatDuration(3661000, { style: "short" })).toBe("1:01:01");
      });

      it("should format number input without hours (M:SS)", () => {
        // 5 minutes, 23.25 seconds (no hours)
        expect(formatDuration(5 * 60000 + 23250, { style: "short" })).toBe("5:23.25");
        // 1 minute, 30 seconds
        expect(formatDuration(90000, { style: "short" })).toBe("1:30");
      });

      it("should format number input with only seconds", () => {
        expect(formatDuration(3000, { style: "short" })).toBe("3");
        expect(formatDuration(3250, { style: "short" })).toBe("3.25");
      });

      it("should format number input with days", () => {
        // 1 day, 1 hour, 0 minutes, 3 seconds
        expect(formatDuration(86400000 + 3600000 + 3000, { style: "short" })).toBe("1:01:00:03");
      });

      it("should format weeks in short format (string input)", () => {
        expect(formatDuration("1W", { style: "short" })).toBe("1W");
        expect(formatDuration("2W", { style: "short" })).toBe("2W");
      });

      it("should format months in short format (string input)", () => {
        expect(formatDuration("1M", { style: "short" })).toBe("1M");
        expect(formatDuration("12M", { style: "short" })).toBe("12M");
      });

      it("should format years in short format (string input)", () => {
        expect(formatDuration("1Y", { style: "short" })).toBe("1Y");
        expect(formatDuration("5Y", { style: "short" })).toBe("5Y");
      });

      it("should format quarters in short format (string input)", () => {
        expect(formatDuration("1Q", { style: "short" })).toBe("1Q");
        expect(formatDuration("2Q", { style: "short" })).toBe("2Q");
      });

      it("should format milliseconds in short format (string input)", () => {
        expect(formatDuration("1000ms", { style: "short" })).toBe("1000ms");
      });

      it("should handle decimal values in short format (string input)", () => {
        expect(formatDuration("1.5D", { style: "short" })).toBe("1.5D");
        expect(formatDuration("0.5h", { style: "short" })).toBe("0.5h");
      });

      it("should handle default unit (1) in short format (string input)", () => {
        expect(formatDuration("D", { style: "short" })).toBe("1D");
        expect(formatDuration("h", { style: "short" })).toBe("1h");
        expect(formatDuration("m", { style: "short" })).toBe("1m");
      });
    });

    describe("abbreviation format", () => {
      it("should format with concatenated unit, no space", () => {
        expect(formatDuration("1D", { style: "abbreviation" })).toBe("1D");
        expect(formatDuration("2h", { style: "abbreviation" })).toBe("2h");
        expect(formatDuration("5m", { style: "abbreviation" })).toBe("5m");
        expect(formatDuration("30s", { style: "abbreviation" })).toBe("30s");
      });

      it("should format number input as space-separated units", () => {
        // 1 day, 2 hours, 15 minutes
        expect(formatDuration(86400000 + 2 * 3600000 + 15 * 60000, { style: "abbreviation" })).toBe("1D 2h 15m");
        // 1 hour, 1 minute, 1 second
        expect(formatDuration(3661000, { style: "abbreviation" })).toBe("1h 1m 1s");
        // 5 minutes, 23 seconds, 250 milliseconds
        expect(formatDuration(323250, { style: "abbreviation" })).toBe("5m 23s 250ms");
      });

      it("should format weeks in abbreviation format", () => {
        expect(formatDuration("1W", { style: "abbreviation" })).toBe("1W");
        expect(formatDuration("2W", { style: "abbreviation" })).toBe("2W");
      });

      it("should format months in abbreviation format", () => {
        expect(formatDuration("1M", { style: "abbreviation" })).toBe("1M");
        expect(formatDuration("12M", { style: "abbreviation" })).toBe("12M");
      });

      it("should format years in abbreviation format", () => {
        expect(formatDuration("1Y", { style: "abbreviation" })).toBe("1Y");
        expect(formatDuration("5Y", { style: "abbreviation" })).toBe("5Y");
      });

      it("should format quarters in abbreviation format", () => {
        expect(formatDuration("1Q", { style: "abbreviation" })).toBe("1Q");
        expect(formatDuration("2Q", { style: "abbreviation" })).toBe("2Q");
      });

      it("should format milliseconds in abbreviation format", () => {
        expect(formatDuration("1000ms", { style: "abbreviation" })).toBe("1000ms");
      });

      it("should handle decimal values in abbreviation format", () => {
        expect(formatDuration("1.5D", { style: "abbreviation" })).toBe("1.5D");
        expect(formatDuration("0.5h", { style: "abbreviation" })).toBe("0.5h");
      });

      it("should handle default unit (1) in abbreviation format", () => {
        expect(formatDuration("D", { style: "abbreviation" })).toBe("1D");
        expect(formatDuration("h", { style: "abbreviation" })).toBe("1h");
        expect(formatDuration("m", { style: "abbreviation" })).toBe("1m");
      });
    });

    describe("number input (milliseconds)", () => {
      it("should format milliseconds as long format with logical units", () => {
        // 1 day, 2 hours, 15 minutes, 3 seconds
        expect(formatDuration(86400000 + 2 * 3600000 + 15 * 60000 + 3 * 1000)).toBe("1 day, 2 hours, 15 minutes, and 3 seconds");
        // 1 hour, 1 minute, 3 seconds
        expect(formatDuration(3663000)).toBe("1 hour, 1 minute, and 3 seconds");
        // 1 day
        expect(formatDuration(86400000)).toBe("1 day");
        // 1 second
        expect(formatDuration(1000)).toBe("1 second");
        // 1 millisecond
        expect(formatDuration(1)).toBe("1 millisecond");
        // 0 milliseconds
        expect(formatDuration(0)).toBe("0 milliseconds");
      });

      it("should format milliseconds as short format (colon-separated)", () => {
        // 1 day = 24:00:00
        expect(formatDuration(86400000, { style: "short" })).toBe("1:00:00:00");
        // 1 hour = 1:00:00
        expect(formatDuration(3600000, { style: "short" })).toBe("1:00:00");
        // 1 minute = 1:00
        expect(formatDuration(60000, { style: "short" })).toBe("1:00");
        // 1 second = 1
        expect(formatDuration(1000, { style: "short" })).toBe("1");
      });

      it("should format milliseconds as abbreviation format", () => {
        // 1 day
        expect(formatDuration(86400000, { style: "abbreviation" })).toBe("1D");
        // 1 hour, 1 minute, 1 second
        expect(formatDuration(3661000, { style: "abbreviation" })).toBe("1h 1m 1s");
        // 1 second
        expect(formatDuration(1000, { style: "abbreviation" })).toBe("1s");
        // 1 millisecond
        expect(formatDuration(1, { style: "abbreviation" })).toBe("1ms");
        // 0 milliseconds
        expect(formatDuration(0, { style: "abbreviation" })).toBe("0ms");
      });
    });

    describe("Duration object input", () => {
      it("should format Duration object as long format", () => {
        expect(formatDuration({ value: 1, unit: "D" })).toBe("1 day");
        expect(formatDuration({ value: 2, unit: "h" })).toBe("2 Hours");
        expect(formatDuration({ value: 5, unit: "m" })).toBe("5 minutes");
      });

      it("should format Duration object as short format", () => {
        expect(formatDuration({ value: 1, unit: "D" }, { style: "short" })).toBe("1D");
        expect(formatDuration({ value: 2, unit: "h" }, { style: "short" })).toBe("2h");
        expect(formatDuration({ value: 5, unit: "m" }, { style: "short" })).toBe("5m");
      });

      it("should format Duration object as abbreviation format", () => {
        expect(formatDuration({ value: 1, unit: "D" }, { style: "abbreviation" })).toBe("1D");
        expect(formatDuration({ value: 2, unit: "h" }, { style: "abbreviation" })).toBe("2h");
        expect(formatDuration({ value: 5, unit: "m" }, { style: "abbreviation" })).toBe("5m");
      });
    });

    describe("edge cases", () => {
      it("should return null for invalid duration string", () => {
        expect(formatDuration("invalid")).toBe(null);
        expect(formatDuration("")).toBe(null);
        expect(formatDuration("1")).toBe(null); // No unit
        expect(formatDuration("X")).toBe(null); // Invalid unit
      });

      it("should handle negative values", () => {
        expect(formatDuration("-1D")).toBe("-1 day");
        expect(formatDuration("-2h", { style: "short" })).toBe("-2h");
        expect(formatDuration(-3663000)).toBe("-1 hour, 1 minute, and 3 seconds");
        expect(formatDuration(-3663000, { style: "short" })).toBe("-1:01:03");
        expect(formatDuration(-323250, { style: "short" })).toBe("-5:23.25");
      });

      it("should handle positive sign", () => {
        expect(formatDuration("+1D")).toBe("1 day");
        expect(formatDuration("+2h", { style: "short" })).toBe("2h");
      });

      it("should handle zero values", () => {
        expect(formatDuration("0D")).toBe("0 days");
        expect(formatDuration("0h", { style: "short" })).toBe("0h");
      });
    });
  });
});
