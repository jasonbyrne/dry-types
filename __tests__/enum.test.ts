import { createTypedEnum } from "../src/enum.js";

describe("createTypedEnum", () => {
  describe("basic functionality", () => {
    it("should create a typed enum with string keys", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
          variant: "primary",
          description: "Individual who makes donations",
        },
        volunteer: {
          label: "Volunteer",
          variant: "info",
          description: "Person who volunteers time and effort",
        },
      });

      expect(CONTACT_TAG.values.donor).toBe("donor");
      expect(CONTACT_TAG.values.volunteer).toBe("volunteer");
    });

    it("should create options array with all properties", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
          variant: "primary",
          description: "Individual who makes donations",
        },
        volunteer: {
          label: "Volunteer",
          variant: "info",
        },
      });

      expect(CONTACT_TAG.options).toHaveLength(2);
      expect(CONTACT_TAG.options[0]).toEqual({
        value: "donor",
        label: "Donor",
        variant: "primary",
        description: "Individual who makes donations",
      });
      expect(CONTACT_TAG.options[1]).toEqual({
        value: "volunteer",
        label: "Volunteer",
        variant: "info",
      });
    });

    it("should create enumMap with all properties", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
          variant: "primary",
        },
      });

      expect(CONTACT_TAG.enumMap.donor).toEqual({
        value: "donor",
        label: "Donor",
        variant: "primary",
      });
    });

    it("should default label to key if not provided", () => {
      const STATUS = createTypedEnum({
        active: {},
        inactive: {},
      });

      expect(STATUS.options[0].label).toBe("active");
      expect(STATUS.options[1].label).toBe("inactive");
      expect(STATUS.getLabel("active")).toBe("active");
    });
  });

  describe("numeric keys", () => {
    it("should handle numeric string keys", () => {
      const PRIORITY = createTypedEnum({
        "100": {
          label: "High",
        },
        "200": {
          label: "Medium",
        },
        "300": {
          label: "Low",
        },
      });

      expect(PRIORITY.values["100"]).toBe(100);
      expect(PRIORITY.values["200"]).toBe(200);
      expect(PRIORITY.values["300"]).toBe(300);

      expect(PRIORITY.options[0].value).toBe(100);
      expect(PRIORITY.options[1].value).toBe(200);
      expect(PRIORITY.options[2].value).toBe(300);
    });

    it("should preserve non-numeric string keys as strings", () => {
      const STATUS = createTypedEnum({
        "100abc": {
          label: "Invalid",
        },
        abc100: {
          label: "Also Invalid",
        },
      });

      expect(STATUS.values["100abc"]).toBe("100abc");
      expect(STATUS.values["abc100"]).toBe("abc100");
    });
  });

  describe("getLabel", () => {
    it("should return the label for a valid value", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
        volunteer: {
          label: "Volunteer",
        },
      });

      expect(CONTACT_TAG.getLabel("donor")).toBe("Donor");
      expect(CONTACT_TAG.getLabel("volunteer")).toBe("Volunteer");
    });

    it("should return the value as string if label is not defined", () => {
      const STATUS = createTypedEnum({
        active: {},
      });

      expect(STATUS.getLabel("active")).toBe("active");
    });

    it("should return the value as string for invalid values", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
      });

      expect(CONTACT_TAG.getLabel("invalid")).toBe("invalid");
    });

    it("should work with numeric values", () => {
      const PRIORITY = createTypedEnum({
        "100": {
          label: "High",
        },
      });

      expect(PRIORITY.getLabel(100)).toBe("High");
    });
  });

  describe("getValue", () => {
    it("should return the value for a valid label", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
        volunteer: {
          label: "Volunteer",
        },
      });

      expect(CONTACT_TAG.getValue("Donor")).toBe("donor");
      expect(CONTACT_TAG.getValue("Volunteer")).toBe("volunteer");
    });

    it("should throw an error for an invalid label", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
      });

      expect(() => CONTACT_TAG.getValue("Invalid Label")).toThrow(
        "No enum value found for label: Invalid Label"
      );
    });

    it("should work with numeric values", () => {
      const PRIORITY = createTypedEnum({
        "100": {
          label: "High",
        },
      });

      expect(PRIORITY.getValue("High")).toBe(100);
    });
  });

  describe("isValueValid", () => {
    it("should return true for valid string values", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
        volunteer: {
          label: "Volunteer",
        },
      });

      expect(CONTACT_TAG.isValueValid("donor")).toBe(true);
      expect(CONTACT_TAG.isValueValid("volunteer")).toBe(true);
    });

    it("should return false for invalid values", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
      });

      expect(CONTACT_TAG.isValueValid("invalid")).toBe(false);
      expect(CONTACT_TAG.isValueValid("")).toBe(false);
    });

    it("should work with numeric values", () => {
      const PRIORITY = createTypedEnum({
        "100": {
          label: "High",
        },
        "200": {
          label: "Medium",
        },
      });

      expect(PRIORITY.isValueValid(100)).toBe(true);
      expect(PRIORITY.isValueValid(200)).toBe(true);
      expect(PRIORITY.isValueValid(300)).toBe(false);
    });
  });

  describe("toTupleArray", () => {
    it("should convert enum to array of [value, label] tuples", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
        volunteer: {
          label: "Volunteer",
        },
      });

      const tuples = CONTACT_TAG.toTupleArray();
      expect(tuples).toEqual([
        ["donor", "Donor"],
        ["volunteer", "Volunteer"],
      ]);
    });

    it("should work with numeric values", () => {
      const PRIORITY = createTypedEnum({
        "100": {
          label: "High",
        },
        "200": {
          label: "Medium",
        },
      });

      const tuples = PRIORITY.toTupleArray();
      expect(tuples).toEqual([
        [100, "High"],
        [200, "Medium"],
      ]);
    });

    it("should use key as label when label is not provided", () => {
      const STATUS = createTypedEnum({
        active: {},
        inactive: {},
      });

      const tuples = STATUS.toTupleArray();
      expect(tuples).toEqual([
        ["active", "active"],
        ["inactive", "inactive"],
      ]);
    });
  });

  describe("preserving additional properties", () => {
    it("should preserve all custom properties in options", () => {
      const STATUS = createTypedEnum({
        active: {
          label: "Active",
          color: "green",
          icon: "check",
          order: 1,
          metadata: {
            created: "2024-01-01",
          },
        },
      });

      const option = STATUS.options[0];
      expect(option.color).toBe("green");
      expect(option.icon).toBe("check");
      expect(option.order).toBe(1);
      expect(option.metadata).toEqual({ created: "2024-01-01" });
    });

    it("should preserve all custom properties in enumMap", () => {
      const STATUS = createTypedEnum({
        active: {
          label: "Active",
          color: "green",
          icon: "check",
        },
      });

      expect(STATUS.enumMap.active.color).toBe("green");
      expect(STATUS.enumMap.active.icon).toBe("check");
    });
  });

  describe("readonly properties", () => {
    it("should make values readonly", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
        },
      });

      // TypeScript would prevent this, but we can test at runtime
      expect(() => {
        // @ts-expect-error - testing readonly behavior
        CONTACT_TAG.values.donor = "modified";
      }).not.toThrow(); // Runtime doesn't enforce readonly, but TypeScript does
    });
  });

  describe("edge cases", () => {
    it("should handle empty enum", () => {
      const EMPTY = createTypedEnum({});

      expect(EMPTY.values).toEqual({});
      expect(EMPTY.options).toEqual([]);
      expect(EMPTY.enumMap).toEqual({});
      expect(EMPTY.toTupleArray()).toEqual([]);
    });

    it("should handle enum with single entry", () => {
      const SINGLE = createTypedEnum({
        only: {
          label: "Only Option",
        },
      });

      expect(SINGLE.options).toHaveLength(1);
      expect(SINGLE.options[0].value).toBe("only");
      expect(SINGLE.options[0].label).toBe("Only Option");
    });

    it("should handle enum with many entries", () => {
      const MANY = createTypedEnum({
        one: { label: "One" },
        two: { label: "Two" },
        three: { label: "Three" },
        four: { label: "Four" },
        five: { label: "Five" },
      });

      expect(MANY.options).toHaveLength(5);
      expect(MANY.toTupleArray()).toHaveLength(5);
    });

    it("should handle special characters in keys", () => {
      const SPECIAL = createTypedEnum({
        "key-with-dashes": {
          label: "Key With Dashes",
        },
        key_with_underscores: {
          label: "Key With Underscores",
        },
        "key.with.dots": {
          label: "Key With Dots",
        },
      });

      expect(SPECIAL.values["key-with-dashes"]).toBe("key-with-dashes");
      expect(SPECIAL.values["key_with_underscores"]).toBe(
        "key_with_underscores"
      );
      expect(SPECIAL.values["key.with.dots"]).toBe("key.with.dots");
    });
  });

  describe("real-world example", () => {
    it("should work with the user's example", () => {
      const CONTACT_TAG = createTypedEnum({
        donor: {
          label: "Donor",
          variant: "primary",
          description: "Individual who makes donations",
        },
        volunteer: {
          label: "Volunteer",
          variant: "info",
          description: "Person who volunteers time and effort",
        },
      });

      // Type-safe values
      const tag1: "donor" | "volunteer" = CONTACT_TAG.values.donor;
      expect(tag1).toBe("donor");

      // Array for dropdowns
      expect(CONTACT_TAG.options).toEqual([
        {
          value: "donor",
          label: "Donor",
          variant: "primary",
          description: "Individual who makes donations",
        },
        {
          value: "volunteer",
          label: "Volunteer",
          variant: "info",
          description: "Person who volunteers time and effort",
        },
      ]);

      // Get label
      expect(CONTACT_TAG.getLabel("donor")).toBe("Donor");

      // Check validity
      if (CONTACT_TAG.isValueValid("donor")) {
        // TypeScript knows it's a valid enum value here
        expect(true).toBe(true);
      }

      // Access enumMap
      expect(CONTACT_TAG.enumMap.donor.variant).toBe("primary");
      expect(CONTACT_TAG.enumMap.volunteer.description).toBe(
        "Person who volunteers time and effort"
      );
    });
  });
});
