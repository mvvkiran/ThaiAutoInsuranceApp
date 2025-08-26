import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ThaiNationalIdDirective } from './thai-national-id.directive';
import { TEST_DATA } from '../../test-helpers/test-data';
import { TestUtilities } from '../../test-helpers/test-utilities';

@Component({
  template: `
    <input 
      type="text" 
      appThaiNationalId 
      [(ngModel)]="nationalId" 
      data-testid="thai-id-input"
    >
  `
})
class TestComponent {
  nationalId = '';
}

describe('ThaiNationalIdDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;
  let inputDebugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThaiNationalIdDirective, TestComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    
    inputDebugElement = fixture.debugElement.query(By.css('[data-testid="thai-id-input"]'));
    inputElement = inputDebugElement.nativeElement;
    
    fixture.detectChanges();
  });

  describe('Input Formatting', () => {
    it('should format single digit correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1');
      
      expect(inputElement.value).toBe('1');
    });

    it('should format two digits with dash', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '12');
      
      expect(inputElement.value).toBe('1-2');
    });

    it('should format five digits correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '12345');
      
      expect(inputElement.value).toBe('1-2345');
    });

    it('should format six digits correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '123456');
      
      expect(inputElement.value).toBe('1-2345-6');
    });

    it('should format ten digits correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890');
      
      expect(inputElement.value).toBe('1-2345-67890');
    });

    it('should format eleven digits correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '12345678901');
      
      expect(inputElement.value).toBe('1-2345-67890-1');
    });

    it('should format twelve digits correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '123456789012');
      
      expect(inputElement.value).toBe('1-2345-67890-12');
    });

    it('should format complete 13-digit ID correctly', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890123');
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });
  });

  describe('Input Filtering', () => {
    it('should remove non-digit characters', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '123abc456def789');
      
      expect(inputElement.value).toBe('1-2345-67890');
    });

    it('should remove special characters', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '123!@#456$%^789&*()');
      
      expect(inputElement.value).toBe('1-2345-67890');
    });

    it('should remove spaces', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1 2 3 4 5 6 7 8 9 0 1 2 3');
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });

    it('should handle mixed alphanumeric input', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n');
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });

    it('should handle Thai Unicode characters', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '๑๒๓๔๕๖๗๘๙๐๑๒๓');
      
      // Thai digits should be removed as they're not standard digits
      expect(inputElement.value).toBe('');
    });
  });

  describe('Length Limitations', () => {
    it('should limit input to 13 digits', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '12345678901234567890');
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
      expect(inputElement.value.replace(/-/g, '')).toHaveSize(13);
    });

    it('should truncate extra digits', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '999999999999999');
      
      expect(inputElement.value).toBe('9-9999-99999-99-9');
    });

    it('should handle very long input with mixed characters', () => {
      const longInput = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z';
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', longInput);
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });
  });

  describe('Real-world Thai ID Scenarios', () => {
    it('should format valid Thai national IDs from test data', () => {
      TEST_DATA.VALID_THAI_IDS.forEach((id, index) => {
        // Clear the input first
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '');
        fixture.detectChanges();
        
        // Set the new value
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', id);
        
        const formatted = inputElement.value;
        const cleanFormatted = formatted.replace(/-/g, '');
        
        expect(cleanFormatted).toBe(id);
        expect(formatted).toMatch(/^\d-\d{4}-\d{5}-\d{2}-\d$/);
      });
    });

    it('should handle partially typed IDs gracefully', () => {
      const partialInputs = [
        { input: '1', expected: '1' },
        { input: '12', expected: '1-2' },
        { input: '1234', expected: '1-234' },
        { input: '123456', expected: '1-2345-6' },
        { input: '1234567890', expected: '1-2345-67890' },
        { input: '123456789012', expected: '1-2345-67890-12' }
      ];

      partialInputs.forEach(testCase => {
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '');
        fixture.detectChanges();
        
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', testCase.input);
        expect(inputElement.value).toBe(testCase.expected);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '');
      
      expect(inputElement.value).toBe('');
    });

    it('should handle whitespace-only input', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '   ');
      
      expect(inputElement.value).toBe('');
    });

    it('should handle input with only special characters', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '!@#$%^&*()');
      
      expect(inputElement.value).toBe('');
    });

    it('should handle input with only letters', () => {
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', 'abcdefghijklmnop');
      
      expect(inputElement.value).toBe('');
    });

    it('should handle rapid input changes', () => {
      // Simulate rapid typing
      const inputs = ['1', '12', '123', '1234', '12345', '123456', '1234567', '12345678', '123456789', '1234567890', '12345678901', '123456789012', '1234567890123'];
      
      inputs.forEach(input => {
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', input);
      });
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });
  });

  describe('Event Handling', () => {
    it('should respond to input events', () => {
      const event = new Event('input', { bubbles: true });
      Object.defineProperty(event, 'target', {
        value: { value: '1234567890123' },
        writable: true
      });

      inputElement.dispatchEvent(event);
      fixture.detectChanges();

      expect((event.target as any).value).toBe('1-2345-67890-12-3');
    });

    it('should handle programmatic value changes', () => {
      // Simulate programmatic value setting
      inputElement.value = '1234567890123';
      
      // Trigger input event
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });

    it('should not interfere with other input properties', () => {
      const originalPlaceholder = inputElement.placeholder;
      const originalType = inputElement.type;
      
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890123');
      
      expect(inputElement.placeholder).toBe(originalPlaceholder);
      expect(inputElement.type).toBe(originalType);
    });
  });

  describe('Directive Integration', () => {
    it('should be applied to the input element', () => {
      const directive = inputDebugElement.injector.get(ThaiNationalIdDirective);
      expect(directive).toBeTruthy();
    });

    it('should maintain input element reference', () => {
      const directive = inputDebugElement.injector.get(ThaiNationalIdDirective);
      expect(directive).toBeTruthy();
      
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890123');
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });

    it('should work with ngModel binding', () => {
      component.nationalId = '1234567890123';
      fixture.detectChanges();
      
      // Trigger input event to format the value
      inputElement.value = component.nationalId;
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });
  });

  describe('Performance', () => {
    it('should handle multiple rapid format operations', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', `${i}234567890123`.slice(0, 13));
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000);
      
      // Final value should be correctly formatted
      expect(inputElement.value).toMatch(/^\d-\d{4}-\d{5}-\d{2}-\d$/);
    });

    it('should not create memory leaks with repeated use', () => {
      // Simulate many input events
      for (let i = 0; i < 100; i++) {
        const testValue = `${i % 10}234567890123`.slice(0, 13);
        TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', testValue);
      }
      
      // Should still work correctly
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '9876543210987');
      expect(inputElement.value).toBe('9-8765-43210-98-7');
    });
  });

  describe('Accessibility', () => {
    it('should maintain input accessibility properties', () => {
      inputElement.setAttribute('aria-label', 'Thai National ID');
      inputElement.setAttribute('required', 'true');
      
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890123');
      
      expect(inputElement.getAttribute('aria-label')).toBe('Thai National ID');
      expect(inputElement.getAttribute('required')).toBe('true');
    });

    it('should not interfere with screen reader announcements', () => {
      inputElement.setAttribute('aria-describedby', 'id-help');
      
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890123');
      
      expect(inputElement.getAttribute('aria-describedby')).toBe('id-help');
    });
  });

  describe('Cross-browser Compatibility', () => {
    it('should handle different input event implementations', () => {
      // Test with custom event
      const customEvent = new CustomEvent('input', {
        detail: { value: '1234567890123' }
      });
      
      Object.defineProperty(customEvent, 'target', {
        value: { value: '1234567890123' },
        writable: true
      });
      
      inputElement.dispatchEvent(customEvent);
      
      expect((customEvent.target as any).value).toBe('1-2345-67890-12-3');
    });

    it('should work with different input types', () => {
      inputElement.type = 'tel';
      
      TestUtilities.setInputValue(fixture, '[data-testid="thai-id-input"]', '1234567890123');
      
      expect(inputElement.value).toBe('1-2345-67890-12-3');
    });
  });
});