import { isNumber, toNumber, formatNumber } from './number';

describe('Number utilities', () => {
  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('toNumber', () => {
    it('should convert numbers to numbers', () => {
      expect(toNumber(123)).toBe(123);
      expect(toNumber(3.14)).toBe(3.14);
    });

    it('should convert string numbers to numbers', () => {
      expect(toNumber('123')).toBe(123);
      expect(toNumber('3.14')).toBe(3.14);
    });

    it('should return default value for invalid strings', () => {
      expect(toNumber('abc')).toBe(0);
      expect(toNumber('abc', 42)).toBe(42);
    });

    it('should convert booleans to numbers', () => {
      expect(toNumber(true)).toBe(1);
      expect(toNumber(false)).toBe(0);
    });

    it('should convert dates to timestamps', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      expect(toNumber(date)).toBe(date.getTime());
    });

    it('should return default value for null/undefined', () => {
      expect(toNumber(null)).toBe(0);
      expect(toNumber(undefined, 10)).toBe(10);
    });

    it('should return default value for NaN', () => {
      expect(toNumber(NaN)).toBe(0);
      expect(toNumber(NaN, 100)).toBe(100);
    });
  });

  describe('formatNumber', () => {
    it('should format with default decimals', () => {
      expect(formatNumber(1234.5678)).toBe('1,234.57');
    });

    it('should format with custom decimals', () => {
      expect(formatNumber(1234.5678, { decimals: 0 })).toBe('1,235');
      expect(formatNumber(1234.5678, { decimals: 3 })).toBe('1,234.568');
    });

    it('should format with custom separators', () => {
      expect(formatNumber(1234.56, {
        thousandsSeparator: ' ',
        decimalSeparator: ','
      })).toBe('1 234,56');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(12.34)).toBe('12.34');
    });
  });
});
