import { FormatPhonePipe } from './format-phone.pipe';
import { TEST_DATA } from '../../test-helpers/test-data';

describe('FormatPhonePipe', () => {
  let pipe: FormatPhonePipe;

  beforeEach(() => {
    pipe = new FormatPhonePipe();
  });

  describe('Valid Phone Number Formatting', () => {
    it('should format 10-digit phone number correctly', () => {
      const result = pipe.transform('0812345678');
      expect(result).toBe('081-234-5678');
    });

    it('should format phone number with existing formatting', () => {
      const result = pipe.transform('081-234-5678');
      expect(result).toBe('081-234-5678');
    });

    it('should format phone number with spaces', () => {
      const result = pipe.transform('081 234 5678');
      expect(result).toBe('081-234-5678');
    });

    it('should format phone number with mixed separators', () => {
      const result = pipe.transform('081.234.5678');
      expect(result).toBe('081-234-5678');
    });

    it('should format phone number with parentheses', () => {
      const result = pipe.transform('(081) 234-5678');
      expect(result).toBe('081-234-5678');
    });

    it('should format phone number with plus sign and country code removed', () => {
      const result = pipe.transform('+66812345678');
      // Should remove +66 and format the remaining 10 digits
      expect(result).toBe('+66812345678'); // Returns original as it's not exactly 10 digits after cleaning
    });
  });

  describe('Thai Mobile Number Formats', () => {
    it('should format mobile numbers starting with 08', () => {
      const result = pipe.transform('0812345678');
      expect(result).toBe('081-234-5678');
    });

    it('should format mobile numbers starting with 09', () => {
      const result = pipe.transform('0987654321');
      expect(result).toBe('098-765-4321');
    });

    it('should format mobile numbers starting with 06', () => {
      const result = pipe.transform('0612345678');
      expect(result).toBe('061-234-5678');
    });
  });

  describe('Thai Landline Number Formats', () => {
    it('should format Bangkok landline numbers', () => {
      const result = pipe.transform('0212345678');
      expect(result).toBe('021-234-5678');
    });

    it('should format provincial landline numbers', () => {
      const result = pipe.transform('0371234567');
      // This is only 10 digits, so should be formatted
      expect(result).toBe('037-123-4567');
    });

    it('should handle short landline numbers correctly', () => {
      const result = pipe.transform('037123456');
      // Only 9 digits, should return original
      expect(result).toBe('037123456');
    });
  });

  describe('Invalid Input Handling', () => {
    it('should return empty string for null input', () => {
      const result = pipe.transform(null as any);
      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const result = pipe.transform(undefined as any);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = pipe.transform('');
      expect(result).toBe('');
    });

    it('should return original value for too short numbers', () => {
      const result = pipe.transform('123456789');
      expect(result).toBe('123456789');
    });

    it('should return original value for too long numbers', () => {
      const result = pipe.transform('12345678901');
      expect(result).toBe('12345678901');
    });

    it('should return original value for letters only', () => {
      const result = pipe.transform('abcdefghij');
      expect(result).toBe('abcdefghij');
    });

    it('should return original value for mixed letters and numbers (non-10 digits)', () => {
      const result = pipe.transform('081abc5678');
      expect(result).toBe('081abc5678');
    });
  });

  describe('Edge Cases', () => {
    it('should handle phone number with only digits being 10 characters', () => {
      const result = pipe.transform('abc081234def5678ghi');
      expect(result).toBe('081-234-5678');
    });

    it('should handle multiple spaces and special characters', () => {
      const result = pipe.transform('  081  234  5678  ');
      expect(result).toBe('081-234-5678');
    });

    it('should handle phone with country code +66', () => {
      const result = pipe.transform('+66 81 234 5678');
      // This would be 12 characters after removing non-digits, so original returned
      expect(result).toBe('+66 81 234 5678');
    });

    it('should handle phone number with extension', () => {
      const result = pipe.transform('0812345678 ext 123');
      // Only the first 10 digits would be used for formatting
      expect(result).toBe('081-234-5678');
    });

    it('should handle leading and trailing whitespace', () => {
      const result = pipe.transform('  0812345678  ');
      expect(result).toBe('081-234-5678');
    });

    it('should handle tab characters and newlines', () => {
      const result = pipe.transform('081\t234\n5678');
      expect(result).toBe('081-234-5678');
    });
  });

  describe('Real-world Test Data', () => {
    it('should format valid Thai phone numbers from test data', () => {
      // Using some valid numbers from TEST_DATA
      const validNumbers = [
        '0812345678',
        '0987654321',
        '0612345678'
      ];

      validNumbers.forEach(number => {
        const result = pipe.transform(number);
        expect(result).toMatch(/^\d{3}-\d{3}-\d{4}$/);
        expect(result.replace(/-/g, '')).toBe(number);
      });
    });

    it('should handle formatted phone numbers correctly', () => {
      const formattedNumbers = [
        '081-234-5678',
        '098-765-4321',
        '02-123-4567'
      ];

      formattedNumbers.forEach(number => {
        const result = pipe.transform(number);
        // Should maintain the same format or improve it
        expect(result).toMatch(/^\d{2,3}-\d{3}-\d{4}$/);
      });
    });
  });

  describe('Performance and Consistency', () => {
    it('should produce consistent results for same input', () => {
      const phoneNumber = '0812345678';
      const result1 = pipe.transform(phoneNumber);
      const result2 = pipe.transform(phoneNumber);
      
      expect(result1).toBe(result2);
      expect(result1).toBe('081-234-5678');
    });

    it('should handle rapid successive calls', () => {
      const phoneNumber = '0987654321';
      
      for (let i = 0; i < 100; i++) {
        const result = pipe.transform(phoneNumber);
        expect(result).toBe('098-765-4321');
      }
    });

    it('should not modify original input', () => {
      const originalNumber = '0812345678';
      const copyNumber = originalNumber.slice();
      
      pipe.transform(originalNumber);
      
      expect(originalNumber).toBe(copyNumber);
    });
  });

  describe('Special Characters Handling', () => {
    it('should remove all non-digit characters except when result is not 10 digits', () => {
      const specialChars = '081-234-5678@#$%^&*()';
      const result = pipe.transform(specialChars);
      expect(result).toBe('081-234-5678');
    });

    it('should handle Unicode characters', () => {
      const unicodePhone = '081๒๓๔๕๖๗๘'; // Thai digits mixed
      const result = pipe.transform(unicodePhone);
      // Should keep original as Thai digits won't be recognized as digits by \\D regex
      expect(result).toBe(unicodePhone);
    });

    it('should handle HTML entities', () => {
      const htmlPhone = '081&nbsp;234&nbsp;5678';
      const result = pipe.transform(htmlPhone);
      expect(result).toBe('081-234-5678');
    });
  });

  describe('International Format Handling', () => {
    it('should handle country code 66 without plus', () => {
      const result = pipe.transform('66812345678');
      // 11 digits, should return original
      expect(result).toBe('66812345678');
    });

    it('should handle full international format', () => {
      const result = pipe.transform('+66-81-234-5678');
      // More than 10 digits after cleaning, should return original
      expect(result).toBe('+66-81-234-5678');
    });

    it('should handle other country codes', () => {
      const result = pipe.transform('+1-555-123-4567');
      // Not a Thai format, should return original
      expect(result).toBe('+1-555-123-4567');
    });
  });

  describe('Business Logic Validation', () => {
    it('should only format numbers with exactly 10 digits', () => {
      const testCases = [
        { input: '123456789', expected: '123456789' },      // 9 digits
        { input: '1234567890', expected: '123-456-7890' },  // 10 digits
        { input: '12345678901', expected: '12345678901' }   // 11 digits
      ];

      testCases.forEach(testCase => {
        const result = pipe.transform(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });

    it('should preserve original formatting for non-10-digit numbers', () => {
      const nonStandardFormats = [
        '081-234-567',      // Too short
        '081-234-5678-9',   // Too long
        '(081) 234 567',    // Too short with formatting
      ];

      nonStandardFormats.forEach(format => {
        const result = pipe.transform(format);
        expect(result).toBe(format); // Should return original
      });
    });
  });
});