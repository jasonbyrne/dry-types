import { createObjectHash, quickHash } from "../src/hash.js";

describe("hash", () => {
  describe("createObjectHash", () => {
    it("should create hash from object", async () => {
      const obj = { a: 1, b: 2 };
      const hash = await createObjectHash(obj);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
    });

    it("should produce same hash for same object", async () => {
      const obj = { a: 1, b: 2 };
      const hash1 = await createObjectHash(obj);
      const hash2 = await createObjectHash(obj);
      expect(hash1).toBe(hash2);
    });

    it("should produce same hash regardless of property order", async () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };
      const hash1 = await createObjectHash(obj1);
      const hash2 = await createObjectHash(obj2);
      expect(hash1).toBe(hash2);
    });

    it("should produce different hash for different objects", async () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      const hash1 = await createObjectHash(obj1);
      const hash2 = await createObjectHash(obj2);
      expect(hash1).not.toBe(hash2);
    });

    it("should handle nested objects", async () => {
      const obj = { a: 1, b: { c: 2, d: 3 } };
      const hash = await createObjectHash(obj);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBe(64);
    });

    it("should handle arrays", async () => {
      const obj = { a: [1, 2, 3] };
      const hash = await createObjectHash(obj);
      expect(typeof hash).toBe("string");
    });
  });

  describe("quickHash", () => {
    it("should create hash from object", () => {
      const obj = { a: 1, b: 2 };
      const hash = quickHash(obj);
      expect(typeof hash).toBe("number");
    });

    it("should produce same hash for same object", () => {
      const obj = { a: 1, b: 2 };
      const hash1 = quickHash(obj);
      const hash2 = quickHash(obj);
      expect(hash1).toBe(hash2);
    });

    it("should produce same hash regardless of property order", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 2, a: 1 };
      const hash1 = quickHash(obj1);
      const hash2 = quickHash(obj2);
      expect(hash1).toBe(hash2);
    });

    it("should produce different hash for different objects", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      const hash1 = quickHash(obj1);
      const hash2 = quickHash(obj2);
      expect(hash1).not.toBe(hash2);
    });

    it("should handle nested objects", () => {
      const obj = { a: 1, b: { c: 2, d: 3 } };
      const hash = quickHash(obj);
      expect(typeof hash).toBe("number");
    });

    it("should handle arrays", () => {
      const obj = { a: [1, 2, 3] };
      const hash = quickHash(obj);
      expect(typeof hash).toBe("number");
    });

    it("should handle primitives", () => {
      expect(typeof quickHash("string")).toBe("number");
      expect(typeof quickHash(123)).toBe("number");
      expect(typeof quickHash(true)).toBe("number");
    });
  });
});

