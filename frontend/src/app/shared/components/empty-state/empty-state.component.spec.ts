import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptyStateComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.icon).toBe('inbox');
      expect(component.title).toBe('ไม่มีข้อมูล');
      expect(component.description).toBe('');
      expect(component.actionText).toBe('');
      expect(component.showAction).toBe(false);
    });

    it('should display default icon', () => {
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('inbox');
    });

    it('should display default title', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่มีข้อมูล');
    });
  });

  describe('Content Display', () => {
    it('should display custom icon', () => {
      component.icon = 'folder_open';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('folder_open');
    });

    it('should display custom title', () => {
      component.title = 'ไม่พบกรมธรรม์';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่พบกรมธรรม์');
    });

    it('should display description when provided', () => {
      component.description = 'คุณยังไม่มีกรมธรรม์ในระบบ เริ่มสร้างกรมธรรม์แรกของคุณ';
      fixture.detectChanges();
      
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      expect(descElement.nativeElement.textContent.trim()).toBe('คุณยังไม่มีกรมธรรม์ในระบบ เริ่มสร้างกรมธรรม์แรกของคุณ');
    });

    it('should hide description when empty', () => {
      component.description = '';
      fixture.detectChanges();
      
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      expect(descElement).toBeFalsy();
    });

    it('should display multi-line descriptions properly', () => {
      component.description = 'บรรทัดแรก\nบรรทัดสอง\nบรรทัดสาม';
      fixture.detectChanges();
      
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      expect(descElement.nativeElement.textContent).toContain('บรรทัดแรก');
      expect(descElement.nativeElement.textContent).toContain('บรรทัดสอง');
      expect(descElement.nativeElement.textContent).toContain('บรรทัดสาม');
    });
  });

  describe('Action Button', () => {
    it('should show action button when enabled', () => {
      component.showAction = true;
      component.actionText = 'สร้างกรมธรรม์ใหม่';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton).toBeTruthy();
      expect(actionButton.nativeElement.textContent.trim()).toBe('สร้างกรมธรรม์ใหม่');
    });

    it('should hide action button when disabled', () => {
      component.showAction = false;
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton).toBeFalsy();
    });

    it('should emit action click event', () => {
      spyOn(component.actionClicked, 'emit');
      
      component.showAction = true;
      component.actionText = 'เพิ่มข้อมูล';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      actionButton.nativeElement.click();
      
      expect(component.actionClicked.emit).toHaveBeenCalled();
    });

    it('should apply custom action button color', () => {
      component.showAction = true;
      component.actionText = 'สร้าง';
      component.actionColor = 'warn';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton.nativeElement.classList).toContain('mat-warn');
    });

    it('should use primary color by default', () => {
      component.showAction = true;
      component.actionText = 'สร้าง';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton.nativeElement.classList).toContain('mat-raised-button');
    });

    it('should handle empty action text gracefully', () => {
      component.showAction = true;
      component.actionText = '';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton?.nativeElement.textContent.trim()).toBe('');
    });
  });

  describe('Thai Insurance Context', () => {
    it('should display no policies state', () => {
      component.icon = 'description';
      component.title = 'ไม่มีกรมธรรม์';
      component.description = 'คุณยังไม่มีกรมธรรม์ประกันภัยในระบบ เริ่มต้นสร้างกรมธรรม์แรกของคุณ';
      component.showAction = true;
      component.actionText = 'สร้างกรมธรรม์ใหม่';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      
      expect(iconElement.nativeElement.textContent.trim()).toBe('description');
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่มีกรมธรรม์');
      expect(descElement.nativeElement.textContent).toContain('ประกันภัย');
      expect(actionButton.nativeElement.textContent.trim()).toBe('สร้างกรมธรรม์ใหม่');
    });

    it('should display no claims state', () => {
      component.icon = 'assignment';
      component.title = 'ไม่มีเคลม';
      component.description = 'ไม่พบการเรียกร้องค่าสินไหทดแทนในระบบ';
      component.showAction = true;
      component.actionText = 'ยื่นเคลมใหม่';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่มีเคลม');
      expect(actionButton.nativeElement.textContent.trim()).toBe('ยื่นเคลมใหม่');
    });

    it('should display no customers state', () => {
      component.icon = 'people';
      component.title = 'ไม่มีลูกค้า';
      component.description = 'ยังไม่มีลูกค้าในระบบ เริ่มเพิ่มลูกค้าแรกของคุณ';
      component.showAction = true;
      component.actionText = 'เพิ่มลูกค้าใหม่';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      
      expect(iconElement.nativeElement.textContent.trim()).toBe('people');
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่มีลูกค้า');
    });

    it('should display no vehicles state', () => {
      component.icon = 'directions_car';
      component.title = 'ไม่มียานพาหนะ';
      component.description = 'ยังไม่มีรถยนต์หรือรถจักรยานยนต์ที่ลงทะเบียน';
      component.showAction = true;
      component.actionText = 'ลงทะเบียนรถ';
      fixture.detectChanges();
      
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      
      expect(descElement.nativeElement.textContent).toContain('รถยนต์หรือรถจักรยานยนต์');
      expect(actionButton.nativeElement.textContent.trim()).toBe('ลงทะเบียนรถ');
    });

    it('should display no payments state', () => {
      component.icon = 'payment';
      component.title = 'ไม่มีการชำระเงิน';
      component.description = 'ยังไม่มีประวัติการชำระเบี้ยประกันภัย';
      component.showAction = true;
      component.actionText = 'ชำระเบี้ยประกัน';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่มีการชำระเงิน');
      expect(descElement.nativeElement.textContent).toContain('เบี้ยประกันภัย');
    });

    it('should display search results empty state', () => {
      component.icon = 'search_off';
      component.title = 'ไม่พบผลลัพธ์';
      component.description = 'ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา ลองปรับเปลี่ยนคำค้นหา';
      component.showAction = true;
      component.actionText = 'ล้างการค้นหา';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      
      expect(iconElement.nativeElement.textContent.trim()).toBe('search_off');
      expect(titleElement.nativeElement.textContent.trim()).toBe('ไม่พบผลลัพธ์');
    });

    it('should display network error state', () => {
      component.icon = 'cloud_off';
      component.title = 'เกิดข้อผิดพลาด';
      component.description = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      component.showAction = true;
      component.actionText = 'ลองใหม่อีกครั้ง';
      component.actionColor = 'accent';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton.nativeElement.classList).toContain('mat-accent');
    });
  });

  describe('Styling and Appearance', () => {
    it('should apply size classes correctly', () => {
      component.size = 'small';
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('size-small');
      
      component.size = 'large';
      fixture.detectChanges();
      
      expect(container.nativeElement.classList).toContain('size-large');
    });

    it('should apply custom CSS classes', () => {
      component.customClass = 'custom-empty-state';
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('custom-empty-state');
    });

    it('should display icon with correct size', () => {
      component.iconSize = '48px';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      expect(iconElement.nativeElement.style.fontSize).toBe('48px');
    });

    it('should apply theme colors correctly', () => {
      component.theme = 'primary';
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('theme-primary');
    });

    it('should center content by default', () => {
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      const computedStyle = window.getComputedStyle(container.nativeElement);
      
      expect(computedStyle.textAlign).toBe('center');
      expect(computedStyle.display).toBe('flex');
      expect(computedStyle.flexDirection).toBe('column');
      expect(computedStyle.alignItems).toBe('center');
    });

    it('should handle different icon colors', () => {
      component.iconColor = '#ff5722';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      expect(iconElement.nativeElement.style.color).toBe('rgb(255, 87, 34)');
    });
  });

  describe('Animation and Transitions', () => {
    it('should have fade-in animation', () => {
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('fade-in');
    });

    it('should animate icon on hover', () => {
      component.animateIcon = true;
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      expect(iconElement.nativeElement.classList).toContain('animate-hover');
    });

    it('should have smooth button hover transitions', () => {
      component.showAction = true;
      component.actionText = 'Action';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      const computedStyle = window.getComputedStyle(actionButton.nativeElement);
      
      expect(computedStyle.transition).toContain('all');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.getAttribute('role')).toBe('status');
      expect(container.nativeElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should have accessible icon', () => {
      component.icon = 'inbox';
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="empty-icon"]'));
      expect(iconElement.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have proper heading hierarchy', () => {
      component.title = 'ไม่มีข้อมูล';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      expect(titleElement.nativeElement.tagName).toBe('H2');
      expect(titleElement.nativeElement.getAttribute('role')).toBe('heading');
    });

    it('should have accessible action button', () => {
      component.showAction = true;
      component.actionText = 'เพิ่มข้อมูล';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      component.showAction = true;
      component.actionText = 'Action';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      expect(actionButton.nativeElement.tabIndex).not.toBe(-1);
    });

    it('should have proper focus indicators', () => {
      component.showAction = true;
      component.actionText = 'Focus Test';
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      actionButton.nativeElement.focus();
      
      const computedStyle = window.getComputedStyle(actionButton.nativeElement);
      expect(computedStyle.outline).not.toBe('none');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 480, writable: true });
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('mobile');
    });

    it('should adjust spacing on small screens', () => {
      component.responsive = true;
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      const computedStyle = window.getComputedStyle(titleElement.nativeElement);
      
      expect(parseInt(computedStyle.fontSize)).toBeLessThan(24);
    });

    it('should stack content vertically on all screen sizes', () => {
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      const computedStyle = window.getComputedStyle(container.nativeElement);
      
      expect(computedStyle.flexDirection).toBe('column');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title gracefully', () => {
      component.title = '';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      expect(titleElement?.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle null values gracefully', () => {
      component.title = null as any;
      component.description = null as any;
      component.actionText = null as any;
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle very long text content', () => {
      component.title = 'ไม่มีข้อมูล'.repeat(20);
      component.description = 'รายละเอียดยาวมาก'.repeat(50);
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      
      expect(titleElement).toBeTruthy();
      expect(descElement).toBeTruthy();
    });

    it('should handle special characters in content', () => {
      component.title = 'ไม่มีข้อมูล!@#$%^&*()';
      component.description = 'รายละเอียด<>&"\'';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="empty-title"]'));
      const descElement = fixture.debugElement.query(By.css('[data-testid="empty-description"]'));
      
      expect(titleElement.nativeElement.textContent).toContain('!@#$%^&*()');
      expect(descElement.nativeElement.textContent).toContain('<>&"\'');
    });

    it('should handle rapid property changes', () => {
      for (let i = 0; i < 10; i++) {
        component.title = `Title ${i}`;
        component.icon = i % 2 === 0 ? 'inbox' : 'folder';
        component.showAction = i % 2 === 0;
        fixture.detectChanges();
      }
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Create and destroy multiple instances
      for (let i = 0; i < 10; i++) {
        component.title = `Test ${i}`;
        component.showAction = true;
        component.actionText = `Action ${i}`;
        fixture.detectChanges();
        
        component.actionClicked.emit();
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryGrowth = finalMemory - initialMemory;
      
      expect(memoryGrowth).toBeLessThan(100000); // Less than 100KB growth
    });

    it('should handle frequent updates efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        component.title = `Dynamic Title ${i}`;
        fixture.detectChanges();
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should clean up resources on destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    it('should work with Angular Router', () => {
      component.showAction = true;
      component.actionText = 'Navigate';
      
      const routerSpy = jasmine.createSpy('navigate');
      component.actionClicked.subscribe(() => {
        routerSpy('/policies/new');
      });
      
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="empty-action"]'));
      actionButton.nativeElement.click();
      
      expect(routerSpy).toHaveBeenCalledWith('/policies/new');
    });

    it('should integrate with loading states', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('loading');
    });

    it('should work with error boundaries', () => {
      component.error = true;
      component.icon = 'error';
      component.title = 'เกิดข้อผิดพลาด';
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.empty-state-container'));
      expect(container.nativeElement.classList).toContain('error-state');
    });
  });
});