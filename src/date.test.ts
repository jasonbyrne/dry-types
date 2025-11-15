import {
  isDate,
  toDate,
  formatDate,
  isAfter,
  isBefore,
  minDate,
  maxDate,
} from './date';

describe('Date utilities', () => {
  describe('isDate', () => {
    it('should return true for valid dates', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-01'))).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-dates', () => {
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(123456789)).toBe(false);
      expect(isDate(null)).toBe(false);
    });
  });

  describe('toDate', () => {
    it('should return dates as-is', () => {
      const date = new Date('2024-01-01');
      expect(toDate(date)).toBe(date);
    });

    it('should convert string to date', () => {
      const result = toDate('2024-01-01');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
    });

    it('should convert timestamp to date', () => {
      const timestamp = new Date('2024-01-01').getTime();
      const result = toDate(timestamp);
      expect(result.getFullYear()).toBe(2024);
    });

    it('should use default value for invalid input', () => {
      const defaultDate = new Date('2020-01-01');
      const result = toDate('invalid', defaultDate);
      expect(result).toBe(defaultDate);
    });
  });

  describe('formatDate', () => {
    const date = new Date('2024-01-01T12:00:00.000Z');

    it('should format as ISO by default', () => {
      const result = formatDate(date);
      expect(result).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should format as ISO explicitly', () => {
      const result = formatDate(date, 'ISO');
      expect(result).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should format as locale string', () => {
      const result = formatDate(date, 'locale');
      expect(typeof result).toBe('string');
    });

    it('should format as date only', () => {
      const result = formatDate(date, 'date');
      expect(typeof result).toBe('string');
    });

    it('should format as time only', () => {
      const result = formatDate(date, 'time');
      expect(typeof result).toBe('string');
    });
  });

  describe('isAfter', () => {
    const date1 = new Date('2024-01-02');
    const date2 = new Date('2024-01-01');

    it('should return true when first date is after second', () => {
      expect(isAfter(date1, date2)).toBe(true);
    });

    it('should return false when first date is before second', () => {
      expect(isAfter(date2, date1)).toBe(false);
    });

    it('should work with string dates', () => {
      expect(isAfter('2024-01-02', '2024-01-01')).toBe(true);
    });
  });

  describe('isBefore', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-02');

    it('should return true when first date is before second', () => {
      expect(isBefore(date1, date2)).toBe(true);
    });

    it('should return false when first date is after second', () => {
      expect(isBefore(date2, date1)).toBe(false);
    });

    it('should work with string dates', () => {
      expect(isBefore('2024-01-01', '2024-01-02')).toBe(true);
    });
  });

  describe('minDate', () => {
    it('should return the earliest date', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      const date3 = new Date('2024-01-03');
      
      const result = minDate(date2, date1, date3);
      expect(result.getTime()).toBe(date1.getTime());
    });

    it('should work with string dates', () => {
      const result = minDate('2024-01-02', '2024-01-01', '2024-01-03');
      expect(result.toISOString()).toBe(new Date('2024-01-01').toISOString());
    });
  });

  describe('maxDate', () => {
    it('should return the latest date', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      const date3 = new Date('2024-01-03');
      
      const result = maxDate(date1, date2, date3);
      expect(result.getTime()).toBe(date3.getTime());
    });

    it('should work with string dates', () => {
      const result = maxDate('2024-01-01', '2024-01-02', '2024-01-03');
      expect(result.toISOString()).toBe(new Date('2024-01-03').toISOString());
    });
  });
});
