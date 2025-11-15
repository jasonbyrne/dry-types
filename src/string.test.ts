import { isString, toString, formatString } from './string';

describe('String utilities', () => {
  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('toString', () => {
    it('should convert strings to strings', () => {
      expect(toString('hello')).toBe('hello');
    });

    it('should convert numbers to strings', () => {
      expect(toString(123)).toBe('123');
      expect(toString(3.14)).toBe('3.14');
    });

    it('should convert null/undefined to empty string', () => {
      expect(toString(null)).toBe('');
      expect(toString(undefined)).toBe('');
    });

    it('should convert booleans to strings', () => {
      expect(toString(true)).toBe('true');
      expect(toString(false)).toBe('false');
    });

    it('should convert objects to JSON strings', () => {
      expect(toString({ a: 1 })).toBe('{"a":1}');
    });

    it('should convert dates to ISO strings', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      expect(toString(date)).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('formatString', () => {
    it('should format with uppercase', () => {
      expect(formatString('hello', { uppercase: true })).toBe('HELLO');
    });

    it('should format with lowercase', () => {
      expect(formatString('HELLO', { lowercase: true })).toBe('hello');
    });

    it('should trim whitespace', () => {
      expect(formatString('  hello  ', { trim: true })).toBe('hello');
    });

    it('should truncate to maxLength', () => {
      expect(formatString('hello world', { maxLength: 5 })).toBe('hello');
    });

    it('should apply multiple transformations', () => {
      expect(formatString('  HELLO  ', { trim: true, lowercase: true })).toBe('hello');
    });
  });
});
