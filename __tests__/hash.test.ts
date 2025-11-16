import { generateObjectHash, generateQuickHash } from "../src/hash.js";

describe("hash", () => {
  describe("generateObjectHash", () => {
    it("should create hash from object", async () => {
      const obj = { a: 1, b: 2 };
      const hash = await generateObjectHash(obj);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
    });

    it("should produce same hash for same object", async () => {
      const obj = { a: 1, b: 2 };
      const hash1 = await generateObjectHash(obj);
      const hash2 = await generateObjectHash(obj);
      expect(hash1).toBe(hash2);
    });

    it("should produce same hash regardless of property order", async () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };
      const hash1 = await generateObjectHash(obj1);
      const hash2 = await generateObjectHash(obj2);
      expect(hash1).toBe(hash2);
    });

    it("should produce different hash for different objects", async () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      const hash1 = await generateObjectHash(obj1);
      const hash2 = await generateObjectHash(obj2);
      expect(hash1).not.toBe(hash2);
    });

    it("should handle nested objects", async () => {
      const obj = { a: 1, b: { c: 2, d: 3 } };
      const hash = await generateObjectHash(obj);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBe(64);
    });

    it("should handle arrays", async () => {
      const obj = { a: [1, 2, 3] };
      const hash = await generateObjectHash(obj);
      expect(typeof hash).toBe("string");
    });
  });

  describe("generateQuickHash", () => {
    it("should create hash from object", () => {
      const obj = { a: 1, b: 2 };
      const hash = generateQuickHash(obj);
      expect(typeof hash).toBe("number");
    });

    it("should produce same hash for same object", () => {
      const obj = { a: 1, b: 2 };
      const hash1 = generateQuickHash(obj);
      const hash2 = generateQuickHash(obj);
      expect(hash1).toBe(hash2);
    });

    it("should produce same hash regardless of property order", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };
      const hash1 = generateQuickHash(obj1);
      const hash2 = generateQuickHash(obj2);
      expect(hash1).toBe(hash2);
    });

    it("should produce different hash for different objects", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      const hash1 = generateQuickHash(obj1);
      const hash2 = generateQuickHash(obj2);
      expect(hash1).not.toBe(hash2);
    });

    it("should handle nested objects", () => {
      const obj = { a: 1, b: { c: 2, d: 3 } };
      const hash = generateQuickHash(obj);
      expect(typeof hash).toBe("number");
    });

    it("should handle arrays", () => {
      const obj = { a: [1, 2, 3] };
      const hash = generateQuickHash(obj);
      expect(typeof hash).toBe("number");
    });

    it("should handle primitives", () => {
      expect(typeof generateQuickHash("string")).toBe("number");
      expect(typeof generateQuickHash(123)).toBe("number");
      expect(typeof generateQuickHash(true)).toBe("number");
    });
  });
});

