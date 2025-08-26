import { ThaiCurrencyPipe } from './thai-currency.pipe';
import { TranslationService } from '../../core/services/translation.service';
import { TEST_DATA } from '../../test-helpers/test-data';

describe('ThaiCurrencyPipe', () => {
  let pipe: ThaiCurrencyPipe;
  let translationService: jasmine.SpyObj<TranslationService>;

  beforeEach(() => {
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['formatCurrency']);
    
    pipe = new ThaiCurrencyPipe(translationServiceSpy);
    translationService = translationServiceSpy;
  });

  describe('Valid Currency Values', () => {
    it('should format positive numbers correctly', () => {
      translationService.formatCurrency.and.returnValue('1,000.00 ฿');
      
      const result = pipe.transform(1000);
      
      expect(result).toBe('1,000.00 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(1000);
    });

    it('should format decimal numbers correctly', () => {
      translationService.formatCurrency.and.returnValue('1,234.56 ฿');
      
      const result = pipe.transform(1234.56);
      
      expect(result).toBe('1,234.56 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(1234.56);
    });

    it('should format zero correctly', () => {
      translationService.formatCurrency.and.returnValue('0.00 ฿');
      
      const result = pipe.transform(0);
      
      expect(result).toBe('0.00 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(0);
    });

    it('should format negative numbers correctly', () => {
      translationService.formatCurrency.and.returnValue('-500.00 ฿');
      
      const result = pipe.transform(-500);
      
      expect(result).toBe('-500.00 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(-500);
    });

    it('should format large numbers correctly', () => {
      translationService.formatCurrency.and.returnValue('1,234,567.89 ฿');
      
      const result = pipe.transform(1234567.89);
      
      expect(result).toBe('1,234,567.89 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(1234567.89);
    });
  });

  describe('String Input Values', () => {
    it('should format valid numeric string', () => {
      translationService.formatCurrency.and.returnValue('2,500.75 ฿');
      
      const result = pipe.transform('2500.75');
      
      expect(result).toBe('2,500.75 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(2500.75);
    });

    it('should format integer string', () => {
      translationService.formatCurrency.and.returnValue('1,000.00 ฿');
      
      const result = pipe.transform('1000');
      
      expect(result).toBe('1,000.00 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(1000);
    });

    it('should format string with leading zeros', () => {
      translationService.formatCurrency.and.returnValue('123.45 ฿');
      
      const result = pipe.transform('00123.45');
      
      expect(result).toBe('123.45 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(123.45);
    });

    it('should format negative string', () => {
      translationService.formatCurrency.and.returnValue('-750.25 ฿');
      
      const result = pipe.transform('-750.25');
      
      expect(result).toBe('-750.25 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(-750.25);
    });
  });

  describe('Invalid Input Values', () => {
    it('should return empty string for null', () => {
      const result = pipe.transform(null);
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should return empty string for undefined', () => {
      const result = pipe.transform(undefined);
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should return empty string for empty string', () => {
      const result = pipe.transform('');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should return empty string for non-numeric string', () => {
      const result = pipe.transform('not-a-number');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should return empty string for string with mixed characters', () => {
      const result = pipe.transform('123abc');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should return empty string for special characters', () => {
      const result = pipe.transform('$%^&*');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small decimal numbers', () => {
      translationService.formatCurrency.and.returnValue('0.01 ฿');
      
      const result = pipe.transform(0.01);
      
      expect(result).toBe('0.01 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(0.01);
    });

    it('should handle scientific notation string', () => {
      translationService.formatCurrency.and.returnValue('1,000.00 ฿');
      
      const result = pipe.transform('1e3');
      
      expect(result).toBe('1,000.00 ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(1000);
    });

    it('should handle infinity', () => {
      translationService.formatCurrency.and.returnValue('∞ ฿');
      
      const result = pipe.transform(Infinity);
      
      expect(result).toBe('∞ ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(Infinity);
    });

    it('should handle negative infinity', () => {
      translationService.formatCurrency.and.returnValue('-∞ ฿');
      
      const result = pipe.transform(-Infinity);
      
      expect(result).toBe('-∞ ฿');
      expect(translationService.formatCurrency).toHaveBeenCalledWith(-Infinity);
    });

    it('should handle NaN input', () => {
      const result = pipe.transform(NaN);
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only string', () => {
      const result = pipe.transform('   ');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should handle string with only decimal point', () => {
      const result = pipe.transform('.');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });

    it('should handle string with multiple decimal points', () => {
      const result = pipe.transform('12.34.56');
      
      expect(result).toBe('');
      expect(translationService.formatCurrency).not.toHaveBeenCalled();
    });
  });

  describe('Real-world Test Cases', () => {
    it('should format typical insurance premium amounts', () => {
      const testCases = [
        { input: 15000, expected: '15,000.00 ฿' },
        { input: 8500.50, expected: '8,500.50 ฿' },
        { input: 25000, expected: '25,000.00 ฿' },
        { input: 50000.75, expected: '50,000.75 ฿' }
      ];

      testCases.forEach(testCase => {
        translationService.formatCurrency.and.returnValue(testCase.expected);
        
        const result = pipe.transform(testCase.input);
        
        expect(result).toBe(testCase.expected);
        expect(translationService.formatCurrency).toHaveBeenCalledWith(testCase.input);
      });
    });

    it('should handle claim amounts', () => {
      const testCases = [
        { input: 3000, expected: '3,000.00 ฿' },
        { input: 25000.25, expected: '25,000.25 ฿' },
        { input: 100000, expected: '100,000.00 ฿' }
      ];

      testCases.forEach(testCase => {
        translationService.formatCurrency.and.returnValue(testCase.expected);
        
        const result = pipe.transform(testCase.input);
        
        expect(result).toBe(testCase.expected);
        expect(translationService.formatCurrency).toHaveBeenCalledWith(testCase.input);
      });
    });
  });

  describe('Performance and Consistency', () => {
    it('should call translation service only once per transform', () => {
      translationService.formatCurrency.and.returnValue('1,000.00 ฿');
      
      pipe.transform(1000);
      
      expect(translationService.formatCurrency).toHaveBeenCalledTimes(1);
    });

    it('should produce consistent results for same input', () => {
      translationService.formatCurrency.and.returnValue('1,500.00 ฿');
      
      const result1 = pipe.transform(1500);
      const result2 = pipe.transform(1500);
      
      expect(result1).toBe(result2);
      expect(translationService.formatCurrency).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid successive calls', () => {
      translationService.formatCurrency.and.returnValue('100.00 ฿');
      
      for (let i = 0; i < 100; i++) {
        const result = pipe.transform(100);
        expect(result).toBe('100.00 ฿');
      }
      
      expect(translationService.formatCurrency).toHaveBeenCalledTimes(100);
    });
  });
});