import { isArray, toArray, sort, sortBy } from './array';

describe('Array utilities', () => {
  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b'])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray('array')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
    });
  });

  describe('toArray', () => {
    it('should return arrays as-is', () => {
      const arr = [1, 2, 3];
      expect(toArray(arr)).toEqual(arr);
    });

    it('should wrap non-arrays in an array', () => {
      expect(toArray('hello')).toEqual(['hello']);
      expect(toArray(123)).toEqual([123]);
    });

    it('should return empty array for null/undefined', () => {
      expect(toArray(null)).toEqual([]);
      expect(toArray(undefined)).toEqual([]);
    });
  });

  describe('sort', () => {
    it('should sort numbers in ascending order', () => {
      expect(sort([3, 1, 2])).toEqual([1, 2, 3]);
    });

    it('should sort strings alphabetically', () => {
      expect(sort(['c', 'a', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('should not modify original array', () => {
      const original = [3, 1, 2];
      sort(original);
      expect(original).toEqual([3, 1, 2]);
    });

    it('should accept custom comparator', () => {
      const result = sort([1, 2, 3], (a, b) => b - a);
      expect(result).toEqual([3, 2, 1]);
    });
  });

  describe('sortBy', () => {
    const items = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ];

    it('should sort by property in ascending order', () => {
      const result = sortBy(items, 'name');
      expect(result[0]?.name).toBe('Alice');
      expect(result[2]?.name).toBe('Charlie');
    });

    it('should sort by property in descending order', () => {
      const result = sortBy(items, 'age', 'desc');
      expect(result[0]?.age).toBe(35);
      expect(result[2]?.age).toBe(25);
    });

    it('should not modify original array', () => {
      sortBy(items, 'name');
      expect(items[0]?.name).toBe('Charlie');
    });
  });
});
