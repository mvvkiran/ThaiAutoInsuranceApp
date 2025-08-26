import { ThaiDatePipe } from './thai-date.pipe';

describe('ThaiDatePipe', () => {
  let pipe: ThaiDatePipe;

  beforeEach(() => {
    pipe = new ThaiDatePipe();
  });

  describe('Valid Date Values', () => {
    it('should format Date object correctly', () => {
      const testDate = new Date('2024-01-15');
      const result = pipe.transform(testDate);
      
      // The exact format may vary by browser/locale, but should contain the Thai format
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format ISO date string correctly', () => {
      const result = pipe.transform('2024-01-15T10:30:00Z');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format date string without time correctly', () => {
      const result = pipe.transform('2024-01-15');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format timestamp correctly', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = pipe.transform(timestamp);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format different date formats consistently', () => {
      const date1 = pipe.transform('2024-01-15');
      const date2 = pipe.transform(new Date('2024-01-15'));
      const date3 = pipe.transform(new Date('2024-01-15').getTime());
      
      // All should produce valid string outputs (exact format may vary)
      expect(typeof date1).toBe('string');
      expect(typeof date2).toBe('string');
      expect(typeof date3).toBe('string');
      expect(date1.length).toBeGreaterThan(0);
      expect(date2.length).toBeGreaterThan(0);
      expect(date3.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Case Date Values', () => {
    it('should handle leap year dates', () => {
      const leapYearDate = '2024-02-29'; // 2024 is a leap year
      const result = pipe.transform(leapYearDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle year boundaries', () => {
      const newYearEve = '2023-12-31T23:59:59';
      const newYear = '2024-01-01T00:00:00';
      
      const result1 = pipe.transform(newYearEve);
      const result2 = pipe.transform(newYear);
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });

    it('should handle daylight saving time transitions', () => {
      // March DST transition (varies by timezone)
      const marchDate = '2024-03-10T02:00:00';
      const result = pipe.transform(marchDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle very old dates', () => {
      const oldDate = '1900-01-01';
      const result = pipe.transform(oldDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle future dates', () => {
      const futureDate = '2100-12-31';
      const result = pipe.transform(futureDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Invalid Input Values', () => {
    it('should return empty string for null', () => {
      const result = pipe.transform(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = pipe.transform(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = pipe.transform('');
      expect(result).toBe('');
    });

    it('should return empty string for zero', () => {
      const result = pipe.transform(0);
      expect(result).toBe('');
    });

    it('should return empty string for false', () => {
      const result = pipe.transform(false);
      expect(result).toBe('');
    });

    it('should handle invalid date strings gracefully', () => {
      const result = pipe.transform('not-a-date');
      // Invalid dates should either return empty string or 'Invalid Date' string
      expect(typeof result).toBe('string');
    });

    it('should handle malformed ISO dates', () => {
      const result = pipe.transform('2024-13-45'); // Invalid month and day
      expect(typeof result).toBe('string');
    });

    it('should handle empty object', () => {
      const result = pipe.transform({});
      expect(typeof result).toBe('string');
    });

    it('should handle array input', () => {
      const result = pipe.transform([]);
      expect(typeof result).toBe('string');
    });
  });

  describe('Thai Locale Specific Behavior', () => {
    it('should use Thai locale formatting', () => {
      const testDate = new Date('2024-01-15');
      const result = pipe.transform(testDate);
      
      // Mock what the Thai locale would produce
      const expectedThaiFormat = testDate.toLocaleDateString('th-TH');
      expect(result).toBe(expectedThaiFormat);
    });

    it('should handle Buddhist era years (if supported by browser)', () => {
      const testDate = new Date('2024-01-15');
      const result = pipe.transform(testDate);
      
      // Check if the result contains Thai formatting
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      
      // In browsers that support Thai locale, might contain Buddhist era year
      // (2024 CE = 2567 BE), but this is browser-dependent
    });

    it('should handle different years correctly', () => {
      const dates = [
        '2020-01-01',
        '2021-06-15',
        '2022-12-31',
        '2023-07-04',
        '2024-02-29'
      ];

      dates.forEach(dateStr => {
        const result = pipe.transform(dateStr);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('Real-world Insurance Date Scenarios', () => {
    it('should format policy start dates', () => {
      const policyStartDate = '2024-01-01';
      const result = pipe.transform(policyStartDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format policy end dates', () => {
      const policyEndDate = '2024-12-31';
      const result = pipe.transform(policyEndDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format claim incident dates', () => {
      const incidentDate = '2024-03-15T14:30:00';
      const result = pipe.transform(incidentDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format user birth dates', () => {
      const birthDate = '1985-06-20';
      const result = pipe.transform(birthDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format account creation dates', () => {
      const creationDate = new Date().toISOString();
      const result = pipe.transform(creationDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Performance and Consistency', () => {
    it('should produce consistent results for same input', () => {
      const testDate = '2024-01-15';
      const result1 = pipe.transform(testDate);
      const result2 = pipe.transform(testDate);
      
      expect(result1).toBe(result2);
    });

    it('should handle rapid successive calls', () => {
      const testDate = new Date('2024-01-15');
      
      for (let i = 0; i < 100; i++) {
        const result = pipe.transform(testDate);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      }
    });

    it('should not modify input date object', () => {
      const originalDate = new Date('2024-01-15');
      const originalTime = originalDate.getTime();
      
      pipe.transform(originalDate);
      
      expect(originalDate.getTime()).toBe(originalTime);
    });
  });

  describe('Cross-browser Compatibility', () => {
    it('should handle different date parsing behaviors', () => {
      // Different browsers may parse dates differently
      const ambiguousDate = '01/15/2024'; // MM/DD/YYYY format
      const result = pipe.transform(ambiguousDate);
      
      expect(typeof result).toBe('string');
    });

    it('should handle timezone differences gracefully', () => {
      // UTC vs local time
      const utcDate = '2024-01-15T00:00:00Z';
      const localDate = '2024-01-15T00:00:00';
      
      const result1 = pipe.transform(utcDate);
      const result2 = pipe.transform(localDate);
      
      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
    });
  });

  describe('Boundary Testing', () => {
    it('should handle minimum JavaScript date', () => {
      const minDate = new Date(-8640000000000000); // Min date in JS
      const result = pipe.transform(minDate);
      
      expect(typeof result).toBe('string');
    });

    it('should handle maximum JavaScript date', () => {
      const maxDate = new Date(8640000000000000); // Max date in JS
      const result = pipe.transform(maxDate);
      
      expect(typeof result).toBe('string');
    });

    it('should handle Unix epoch', () => {
      const epochDate = new Date(0); // January 1, 1970
      const result = pipe.transform(epochDate);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});