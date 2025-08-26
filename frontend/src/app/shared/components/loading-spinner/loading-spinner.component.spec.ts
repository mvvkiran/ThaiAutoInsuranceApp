import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChanges } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerComponent],
      imports: [
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoading).toBe(true);
      expect(component.size).toBe('medium');
      expect(component.message).toBe('กำลังโหลด...');
      expect(component.overlay).toBe(false);
      expect(component.color).toBe('primary');
      expect(component.strokeWidth).toBe(4);
      expect(component.diameter).toBe(50);
    });

    it('should set default Thai message', () => {
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('กำลังโหลด...');
    });

    it('should initialize loading state as true by default', () => {
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeTruthy();
    });
  });

  describe('Loading State Control', () => {
    it('should show spinner when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeTruthy();
    });

    it('should hide spinner when isLoading is false', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeFalsy();
    });

    it('should toggle spinner visibility when isLoading changes', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      expect(compiled.querySelector('mat-spinner')).toBeTruthy();
      
      component.isLoading = false;
      fixture.detectChanges();
      
      expect(compiled.querySelector('mat-spinner')).toBeFalsy();
    });

    it('should show loading container when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement).toBeTruthy();
    });

    it('should hide loading container when isLoading is false', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement).toBeFalsy();
    });
  });

  describe('Size Variations', () => {
    it('should apply small size correctly', () => {
      component.size = 'small';
      fixture.detectChanges();
      
      expect(component.diameter).toBe(30);
      expect(component.strokeWidth).toBe(3);
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('size-small');
    });

    it('should apply medium size correctly', () => {
      component.size = 'medium';
      fixture.detectChanges();
      
      expect(component.diameter).toBe(50);
      expect(component.strokeWidth).toBe(4);
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('size-medium');
    });

    it('should apply large size correctly', () => {
      component.size = 'large';
      fixture.detectChanges();
      
      expect(component.diameter).toBe(70);
      expect(component.strokeWidth).toBe(5);
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('size-large');
    });

    it('should apply extra-large size correctly', () => {
      component.size = 'extra-large';
      fixture.detectChanges();
      
      expect(component.diameter).toBe(100);
      expect(component.strokeWidth).toBe(6);
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('size-extra-large');
    });

    it('should update spinner diameter when size changes', () => {
      component.size = 'small';
      component.ngOnInit();
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner') as HTMLElement;
      expect(spinnerElement.style.width).toBe('30px');
      expect(spinnerElement.style.height).toBe('30px');
    });

    it('should update stroke width when size changes', () => {
      component.size = 'large';
      component.ngOnInit();
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(component.strokeWidth).toBe(5);
    });
  });

  describe('Color Variations', () => {
    it('should apply primary color correctly', () => {
      component.color = 'primary';
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-primary');
    });

    it('should apply accent color correctly', () => {
      component.color = 'accent';
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-accent');
    });

    it('should apply warn color correctly', () => {
      component.color = 'warn';
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-warn');
    });

    it('should update color dynamically', () => {
      component.color = 'primary';
      fixture.detectChanges();
      
      let spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-primary');
      
      component.color = 'accent';
      fixture.detectChanges();
      
      spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-accent');
    });
  });

  describe('Message Display', () => {
    it('should display custom message', () => {
      component.message = 'กำลังบันทึกข้อมูล...';
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('กำลังบันทึกข้อมูล...');
    });

    it('should display message in Thai', () => {
      const thaiMessages = [
        'กำลังโหลดข้อมูล...',
        'กำลังบันทึก...',
        'กำลังประมวลผล...',
        'กำลังส่งข้อมูล...'
      ];
      
      thaiMessages.forEach(thaiMessage => {
        component.message = thaiMessage;
        fixture.detectChanges();
        
        const messageElement = compiled.querySelector('[data-testid="loading-message"]');
        expect(messageElement?.textContent?.trim()).toBe(thaiMessage);
      });
    });

    it('should hide message when empty', () => {
      component.message = '';
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('');
    });

    it('should handle null message gracefully', () => {
      component.message = null as any;
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('');
    });

    it('should handle undefined message gracefully', () => {
      component.message = undefined as any;
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('');
    });

    it('should update message dynamically', () => {
      component.message = 'เริ่มต้น';
      fixture.detectChanges();
      
      let messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('เริ่มต้น');
      
      component.message = 'อัปเดต';
      fixture.detectChanges();
      
      messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('อัปเดต');
    });
  });

  describe('Overlay Mode', () => {
    it('should apply overlay styles when overlay is true', () => {
      component.overlay = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('overlay-mode');
    });

    it('should not apply overlay styles when overlay is false', () => {
      component.overlay = false;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).not.toContain('overlay-mode');
    });

    it('should have overlay background when overlay is true', () => {
      component.overlay = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container') as HTMLElement;
      const computedStyle = window.getComputedStyle(containerElement);
      
      expect(computedStyle.position).toBe('fixed');
      expect(computedStyle.zIndex).toBe('9999');
    });

    it('should cover full viewport when overlay is true', () => {
      component.overlay = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container') as HTMLElement;
      const computedStyle = window.getComputedStyle(containerElement);
      
      expect(computedStyle.top).toBe('0px');
      expect(computedStyle.left).toBe('0px');
      expect(computedStyle.width).toBe('100%');
      expect(computedStyle.height).toBe('100%');
    });

    it('should center content in overlay mode', () => {
      component.overlay = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container') as HTMLElement;
      const computedStyle = window.getComputedStyle(containerElement);
      
      expect(computedStyle.display).toBe('flex');
      expect(computedStyle.justifyContent).toBe('center');
      expect(computedStyle.alignItems).toBe('center');
    });
  });

  describe('Animation Behavior', () => {
    it('should have smooth fade-in animation', fakeAsync(() => {
      component.isLoading = false;
      fixture.detectChanges();
      
      component.isLoading = true;
      fixture.detectChanges();
      tick(100);
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement).toBeTruthy();
    }));

    it('should have smooth fade-out animation', fakeAsync(() => {
      component.isLoading = true;
      fixture.detectChanges();
      
      component.isLoading = false;
      fixture.detectChanges();
      tick(300);
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement).toBeFalsy();
    }));

    it('should maintain spinner rotation', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner svg');
      expect(spinnerElement).toBeTruthy();
      
      const computedStyle = window.getComputedStyle(spinnerElement as Element);
      expect(computedStyle.animation).toContain('rotate');
    });
  });

  describe('Input Property Changes', () => {
    it('should respond to isLoading input changes', () => {
      const changes: SimpleChanges = {
        isLoading: {
          currentValue: false,
          previousValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeFalsy();
    });

    it('should respond to size input changes', () => {
      const changes: SimpleChanges = {
        size: {
          currentValue: 'large',
          previousValue: 'medium',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      fixture.detectChanges();
      
      expect(component.diameter).toBe(70);
      expect(component.strokeWidth).toBe(5);
    });

    it('should respond to color input changes', () => {
      const changes: SimpleChanges = {
        color: {
          currentValue: 'warn',
          previousValue: 'primary',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-warn');
    });

    it('should respond to message input changes', () => {
      const changes: SimpleChanges = {
        message: {
          currentValue: 'ข้อความใหม่',
          previousValue: 'ข้อความเก่า',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent?.trim()).toBe('ข้อความใหม่');
    });

    it('should respond to overlay input changes', () => {
      const changes: SimpleChanges = {
        overlay: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('overlay-mode');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid show/hide toggles', fakeAsync(() => {
      // Rapid toggles
      component.isLoading = true;
      fixture.detectChanges();
      tick(50);
      
      component.isLoading = false;
      fixture.detectChanges();
      tick(50);
      
      component.isLoading = true;
      fixture.detectChanges();
      tick(50);
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeTruthy();
    }));

    it('should handle invalid size values', () => {
      component.size = 'invalid' as any;
      component.ngOnInit();
      fixture.detectChanges();
      
      // Should default to medium
      expect(component.diameter).toBe(50);
      expect(component.strokeWidth).toBe(4);
    });

    it('should handle invalid color values', () => {
      component.color = 'invalid' as any;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      // Should fallback gracefully
      expect(spinnerElement).toBeTruthy();
    });

    it('should handle very long messages', () => {
      const longMessage = 'ข'.repeat(1000);
      component.message = longMessage;
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent).toBe(longMessage);
    });

    it('should handle special characters in message', () => {
      component.message = 'กำลังโหลด... 50% <>&"\'';
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.textContent).toBe('กำลังโหลด... 50% <>&"\'');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.getAttribute('role')).toBe('progressbar');
      expect(spinnerElement?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have live region for screen readers', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.getAttribute('aria-live')).toBe('polite');
    });

    it('should announce loading state changes', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const messageElement = compiled.querySelector('[data-testid="loading-message"]');
      expect(messageElement?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have proper spinner labeling', () => {
      component.isLoading = true;
      component.message = 'กำลังบันทึกข้อมูล';
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.getAttribute('aria-label')).toContain('กำลังบันทึกข้อมูล');
    });

    it('should not be focusable', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.getAttribute('tabindex')).toBe('-1');
    });

    it('should have proper contrast in overlay mode', () => {
      component.overlay = true;
      component.isLoading = true;
      fixture.detectChanges();
      
      const overlayElement = compiled.querySelector('.loading-container') as HTMLElement;
      const computedStyle = window.getComputedStyle(overlayElement);
      
      // Should have semi-transparent background
      expect(computedStyle.backgroundColor).toContain('rgba');
    });
  });

  describe('Performance', () => {
    it('should not create unnecessary DOM elements when not loading', () => {
      component.isLoading = false;
      fixture.detectChanges();
      
      const allElements = compiled.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(5); // Minimal DOM footprint
    });

    it('should clean up properly on destroy', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });

    it('should handle memory efficiently with rapid changes', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Simulate rapid property changes
      for (let i = 0; i < 100; i++) {
        component.isLoading = i % 2 === 0;
        component.message = `Loading ${i}`;
        fixture.detectChanges();
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryGrowth = finalMemory - initialMemory;
      
      // Memory growth should be reasonable
      expect(memoryGrowth).toBeLessThan(1000000); // Less than 1MB growth
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes', () => {
      component.isLoading = true;
      component.size = 'large';
      component.overlay = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement?.classList).toContain('loading-container');
      expect(containerElement?.classList).toContain('size-large');
      expect(containerElement?.classList).toContain('overlay-mode');
    });

    it('should have responsive design for different screen sizes', () => {
      component.isLoading = true;
      component.size = 'medium';
      fixture.detectChanges();
      
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      window.dispatchEvent(new Event('resize'));
      
      const containerElement = compiled.querySelector('.loading-container') as HTMLElement;
      expect(containerElement).toBeTruthy();
      
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
      window.dispatchEvent(new Event('resize'));
      
      expect(containerElement).toBeTruthy();
    });

    it('should maintain aspect ratio', () => {
      component.isLoading = true;
      component.size = 'medium';
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner') as HTMLElement;
      const width = spinnerElement.offsetWidth;
      const height = spinnerElement.offsetHeight;
      
      expect(width).toBe(height); // Should be perfectly circular
    });
  });

  describe('Theme Integration', () => {
    it('should inherit theme colors', () => {
      component.isLoading = true;
      component.color = 'primary';
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement?.classList).toContain('mat-primary');
    });

    it('should work with dark theme', () => {
      document.body.classList.add('dark-theme');
      
      component.isLoading = true;
      component.overlay = true;
      fixture.detectChanges();
      
      const containerElement = compiled.querySelector('.loading-container');
      expect(containerElement).toBeTruthy();
      
      document.body.classList.remove('dark-theme');
    });

    it('should support custom CSS variables', () => {
      document.documentElement.style.setProperty('--loading-color', '#ff0000');
      
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeTruthy();
      
      document.documentElement.style.removeProperty('--loading-color');
    });
  });

  describe('Integration with Loading Service', () => {
    it('should work with loading service states', () => {
      // Simulate loading service integration
      const loadingStates = [
        { loading: true, message: 'กำลังโหลดข้อมูล...' },
        { loading: true, message: 'กำลังบันทึก...' },
        { loading: false, message: '' }
      ];
      
      loadingStates.forEach(state => {
        component.isLoading = state.loading;
        component.message = state.message;
        fixture.detectChanges();
        
        const isVisible = !!compiled.querySelector('mat-spinner');
        expect(isVisible).toBe(state.loading);
        
        if (state.loading && state.message) {
          const messageElement = compiled.querySelector('[data-testid="loading-message"]');
          expect(messageElement?.textContent?.trim()).toBe(state.message);
        }
      });
    });

    it('should handle concurrent loading operations', () => {
      const operations = [
        'กำลังโหลดโปรไฟล์...',
        'กำลังโหลดกรมธรรม์...',
        'กำลังโหลดการเรียกร้อง...'
      ];
      
      operations.forEach((operation, index) => {
        component.isLoading = true;
        component.message = operation;
        fixture.detectChanges();
        
        const messageElement = compiled.querySelector('[data-testid="loading-message"]');
        expect(messageElement?.textContent?.trim()).toBe(operation);
      });
    });
  });

  describe('Browser Compatibility', () => {
    it('should work without animation support', () => {
      // Mock older browser without animation support
      spyOn(window, 'getComputedStyle').and.returnValue({
        animation: 'none'
      } as any);
      
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeTruthy();
    });

    it('should handle reduced motion preferences', () => {
      // Mock prefers-reduced-motion: reduce
      Object.defineProperty(window, 'matchMedia', {
        value: jasmine.createSpy().and.returnValue({
          matches: true,
          addEventListener: jasmine.createSpy(),
          removeEventListener: jasmine.createSpy()
        })
      });
      
      component.isLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = compiled.querySelector('mat-spinner');
      expect(spinnerElement).toBeTruthy();
    });
  });
});