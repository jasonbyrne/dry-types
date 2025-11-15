import {
  coalesce,
  isNullOrUndefined,
  isDefined,
  isBoolean,
  toBoolean,
  isObject,
  clone,
} from './utils';

describe('General utilities', () => {
  describe('coalesce', () => {
    it('should return first non-null/undefined value', () => {
      expect(coalesce(null, undefined, 'hello')).toBe('hello');
      expect(coalesce(undefined, 42, 100)).toBe(42);
    });

    it('should return undefined when all values are null/undefined', () => {
      expect(coalesce(null, undefined, null)).toBeUndefined();
    });

    it('should return falsy values that are not null/undefined', () => {
      expect(coalesce(null, 0, 1)).toBe(0);
      expect(coalesce(null, '', 'test')).toBe('');
      expect(coalesce(null, false, true)).toBe(false);
    });
  });

  describe('isNullOrUndefined', () => {
    it('should return true for null and undefined', () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined('')).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined('hello')).toBe(true);
      expect(isDefined(0)).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe('toBoolean', () => {
    it('should return booleans as-is', () => {
      expect(toBoolean(true)).toBe(true);
      expect(toBoolean(false)).toBe(false);
    });

    it('should convert strings to booleans', () => {
      expect(toBoolean('true')).toBe(true);
      expect(toBoolean('TRUE')).toBe(true);
      expect(toBoolean('1')).toBe(true);
      expect(toBoolean('yes')).toBe(true);
      expect(toBoolean('false')).toBe(false);
      expect(toBoolean('0')).toBe(false);
      expect(toBoolean('no')).toBe(false);
    });

    it('should convert numbers to booleans', () => {
      expect(toBoolean(1)).toBe(true);
      expect(toBoolean(0)).toBe(false);
      expect(toBoolean(42)).toBe(true);
    });

    it('should handle other values', () => {
      expect(toBoolean({})).toBe(true);
      expect(toBoolean([])).toBe(true);
      expect(toBoolean(null)).toBe(false);
      expect(toBoolean(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should clone primitives', () => {
      expect(clone(42)).toBe(42);
      expect(clone('hello')).toBe('hello');
      expect(clone(true)).toBe(true);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, 3];
      const cloned = clone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it('should deep clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = clone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone dates', () => {
      const date = new Date('2024-01-01');
      const cloned = clone(date);
      expect(cloned.getTime()).toBe(date.getTime());
      expect(cloned).not.toBe(date);
    });

    it('should clone nested arrays', () => {
      const arr = [1, [2, 3], 4];
      const cloned = clone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned[1]).not.toBe(arr[1]);
    });

    it('should handle null and undefined', () => {
      expect(clone(null)).toBe(null);
      expect(clone(undefined)).toBe(undefined);
    });
  });
});
