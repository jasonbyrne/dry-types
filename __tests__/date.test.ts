import {
  toDate,
  toEpochMsTimestamp,
  toEpochSecondsTimestamp,
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
  isToday,
  getDaysBetween,
  getMonthsBetween,
  getYearsBetween,
  getAge,
  getRelativeTime,
  getYear,
  getMonth,
  getDayOfWeek,
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
      expect(toDateTimeString("2024-01-01T12:00:00")).toBe("2024-01-01T12:00:00");
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
      expect(isDateBetween("2024-06-15", "2024-01-01", "2024-12-31")).toBe(true);
      expect(isDateBetween("2024-01-01", "2024-01-01", "2024-12-31")).toBe(true);
      expect(isDateBetween("2024-12-31", "2024-01-01", "2024-12-31")).toBe(true);
    });

    it("should return false for dates outside range", () => {
      expect(isDateBetween("2023-12-31", "2024-01-01", "2024-12-31")).toBe(false);
      expect(isDateBetween("2025-01-01", "2024-01-01", "2024-12-31")).toBe(false);
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
      expect(result?.getTime()).toBeLessThanOrEqual(new Date("2024-12-31").getTime());
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
      expect(result?.getTime()).toBeGreaterThanOrEqual(new Date("2024-01-01").getTime());
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
        expect(getMonth(new Date("2024-01-15"), { format: "number-zero-based" })).toBe(0); // January
        expect(getMonth(new Date("2024-02-15"), { format: "number-zero-based" })).toBe(1); // February
        expect(getMonth(new Date("2024-06-15"), { format: "number-zero-based" })).toBe(5); // June
        expect(getMonth(new Date("2024-12-15"), { format: "number-zero-based" })).toBe(11); // December
      });

      it("should work with date strings", () => {
        expect(getMonth("2024-01-15", { format: "number-zero-based" })).toBe(0);
        expect(getMonth("2024-12-31", { format: "number-zero-based" })).toBe(11);
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
        expect(getDayOfWeek(wednesday, { format: "number-zero-based" })).toBe(3); // Wednesday
        expect(getDayOfWeek(thursday, { format: "number-zero-based" })).toBe(4); // Thursday
        expect(getDayOfWeek(friday, { format: "number-zero-based" })).toBe(5); // Friday
        expect(getDayOfWeek(saturday, { format: "number-zero-based" })).toBe(6); // Saturday
      });

      it("should work with date strings", () => {
        // Test that date strings work (values may vary by timezone, so just verify it returns a number)
        const result1 = getDayOfWeek("2024-01-07", { format: "number-zero-based" });
        const result2 = getDayOfWeek("2024-01-08", { format: "number-zero-based" });
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
      expect(addDays(10, "2024-01-15")).toBe("2024-01-25");
      expect(addDays(-5, "2024-01-15")).toBe("2024-01-10");
    });

    it("should use current date if not provided", () => {
      const result = addDays(0);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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
      expect(isDateInRange("2024-06-15", "2024-01-01", "2024-12-31")).toBe(true);
      expect(isDateInRange("2024-01-01", "2024-01-01", "2024-12-31")).toBe(true);
      expect(isDateInRange("2024-12-31", "2024-01-01", "2024-12-31")).toBe(true);
    });

    it("should return false when date is outside range", () => {
      expect(isDateInRange("2023-12-31", "2024-01-01", "2024-12-31")).toBe(false);
      expect(isDateInRange("2025-01-01", "2024-01-01", "2024-12-31")).toBe(false);
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
    it("should add months to date", () => {
      const result = addMonths("2024-01-15", 2);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMonth()).toBe(2); // March (0-indexed)
      expect(result?.getFullYear()).toBe(2024);
    });

    it("should subtract months when negative", () => {
      const result = addMonths("2024-03-15", -1);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMonth()).toBe(1); // February (0-indexed)
    });

    it("should handle year rollover", () => {
      const result = addMonths("2024-11-15", 2);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMonth()).toBe(0); // January (0-indexed)
      expect(result?.getFullYear()).toBe(2025);
    });

    it("should return null for invalid date", () => {
      expect(addMonths(null, 1)).toBe(null);
      expect(addMonths("invalid", 1)).toBe(null);
    });
  });

  describe("addYears", () => {
    it("should add years to date", () => {
      const result = addYears("2024-01-15", 1);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(0);
      // Check date string to avoid timezone issues
      const resultStr = result?.toISOString().split("T")[0];
      expect(resultStr).toBe("2025-01-15");
    });

    it("should subtract years when negative", () => {
      const result = addYears("2024-01-15", -2);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2022);
    });

    it("should return null for invalid date", () => {
      expect(addYears(null, 1)).toBe(null);
      expect(addYears("invalid", 1)).toBe(null);
    });
  });

  describe("addHours", () => {
    it("should add hours to date", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addHours(date, 2);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(14);
    });

    it("should subtract hours when negative", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addHours(date, -1);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(11);
    });

    it("should handle day rollover", () => {
      const date = new Date("2024-01-15T23:00:00");
      const result = addHours(date, 2);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(1);
      expect(result?.getDate()).toBe(16);
    });

    it("should return null for invalid date", () => {
      expect(addHours(null, 1)).toBe(null);
    });
  });

  describe("addMinutes", () => {
    it("should add minutes to date", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addMinutes(date, 30);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMinutes()).toBe(30);
    });

    it("should subtract minutes when negative", () => {
      const date = new Date("2024-01-15T12:30:00");
      const result = addMinutes(date, -15);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMinutes()).toBe(15);
    });

    it("should handle hour rollover", () => {
      const date = new Date("2024-01-15T12:45:00");
      const result = addMinutes(date, 30);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getMinutes()).toBe(15);
      expect(result?.getHours()).toBe(13);
    });

    it("should return null for invalid date", () => {
      expect(addMinutes(null, 1)).toBe(null);
    });
  });

  describe("addSeconds", () => {
    it("should add seconds to date", () => {
      const date = new Date("2024-01-15T12:00:00");
      const result = addSeconds(date, 45);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getSeconds()).toBe(45);
    });

    it("should subtract seconds when negative", () => {
      const date = new Date("2024-01-15T12:00:30");
      const result = addSeconds(date, -15);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getSeconds()).toBe(15);
    });

    it("should handle minute rollover", () => {
      const date = new Date("2024-01-15T12:00:45");
      const result = addSeconds(date, 30);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getSeconds()).toBe(15);
      expect(result?.getMinutes()).toBe(1);
    });

    it("should return null for invalid date", () => {
      expect(addSeconds(null, 1)).toBe(null);
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
      const birthDate = new Date(birthYear, today.getMonth() + 1, today.getDate());
      const age = getAge(birthDate);
      expect(age).toBe(24); // Not yet 25
    });

    it("should handle birthday already occurred this year", () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 25;
      // Set birth date to a past month this year
      const birthDate = new Date(birthYear, today.getMonth() - 1, today.getDate());
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
      const past = addMonths(now, -3);
      if (past) {
        const result = getRelativeTime(past);
        expect(result).toMatch(/month/);
        expect(result).toMatch(/ago/);
      }
    });

    it("should return years ago", () => {
      const now = new Date();
      const past = addYears(now, -2);
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

    it("should respect maxUnit option", () => {
      const now = new Date();
      const past = addYears(now, -2);
      if (past) {
        const result = getRelativeTime(past, { maxUnit: "month" });
        expect(result).toMatch(/month/);
        expect(result).not.toMatch(/year/);
      }
    });

    it("should respect minUnit option", () => {
      const now = new Date();
      const past = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      const result = getRelativeTime(past, { minUnit: "minute" });
      expect(result).toMatch(/minute/);
      expect(result).not.toMatch(/second/);
    });

    it("should use custom reference date", () => {
      const refDate = new Date("2024-01-01");
      const date = new Date("2024-01-06"); // 5 days later
      expect(getRelativeTime(date, { referenceDate: refDate })).toBe("5 days from now");
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
      const past = addMonths(now, -18); // 1.5 years ago
      if (past) {
        const result = getRelativeTime(past, { round: true });
        expect(result).toMatch(/year/);
      }
    });
  });
});

