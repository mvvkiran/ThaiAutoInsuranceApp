import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { StatusChipComponent } from './status-chip.component';

describe('StatusChipComponent', () => {
  let component: StatusChipComponent;
  let fixture: ComponentFixture<StatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusChipComponent],
      imports: [
        MatChipsModule,
        MatIconModule,
        MatTooltipModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.status).toBe('');
      expect(component.label).toBe('');
      expect(component.showIcon).toBe(true);
      expect(component.size).toBe('medium');
      expect(component.variant).toBe('filled');
      expect(component.customColor).toBe('');
    });

    it('should display status chip element', () => {
      component.status = 'active';
      component.label = 'ใช้งานอยู่';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement).toBeTruthy();
    });
  });

  describe('Status Display', () => {
    it('should display Thai status label', () => {
      component.status = 'active';
      component.label = 'ใช้งานอยู่';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.textContent.trim()).toBe('ใช้งานอยู่');
    });

    it('should auto-generate Thai labels for common statuses', () => {
      const statusMappings = [
        { status: 'active', expectedLabel: 'ใช้งานอยู่' },
        { status: 'inactive', expectedLabel: 'ไม่ใช้งาน' },
        { status: 'pending', expectedLabel: 'รอดำเนินการ' },
        { status: 'approved', expectedLabel: 'อนุมัติ' },
        { status: 'rejected', expectedLabel: 'ปฏิเสธ' },
        { status: 'expired', expectedLabel: 'หมดอายุ' },
        { status: 'cancelled', expectedLabel: 'ยกเลิก' },
        { status: 'processing', expectedLabel: 'กำลังดำเนินการ' }
      ];
      
      statusMappings.forEach(mapping => {
        component.status = mapping.status;
        component.label = ''; // Let it auto-generate
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(mapping.expectedLabel);
      });
    });

    it('should use custom label when provided', () => {
      component.status = 'active';
      component.label = 'กำหนดเอง';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.textContent.trim()).toBe('กำหนดเอง');
    });

    it('should handle empty status gracefully', () => {
      component.status = '';
      component.label = 'ไม่ระบุสถานะ';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.textContent.trim()).toBe('ไม่ระบุสถานะ');
    });
  });

  describe('Icon Display', () => {
    it('should show appropriate icons for different statuses', () => {
      const statusIcons = [
        { status: 'active', expectedIcon: 'check_circle' },
        { status: 'inactive', expectedIcon: 'cancel' },
        { status: 'pending', expectedIcon: 'schedule' },
        { status: 'approved', expectedIcon: 'verified' },
        { status: 'rejected', expectedIcon: 'block' },
        { status: 'expired', expectedIcon: 'access_time' },
        { status: 'cancelled', expectedIcon: 'close' },
        { status: 'processing', expectedIcon: 'sync' }
      ];
      
      statusIcons.forEach(mapping => {
        component.status = mapping.status;
        component.showIcon = true;
        fixture.detectChanges();
        
        const iconElement = fixture.debugElement.query(By.css('[data-testid="status-icon"]'));
        expect(iconElement.nativeElement.textContent.trim()).toBe(mapping.expectedIcon);
      });
    });

    it('should hide icon when showIcon is false', () => {
      component.status = 'active';
      component.showIcon = false;
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="status-icon"]'));
      expect(iconElement).toBeFalsy();
    });

    it('should use custom icon when provided', () => {
      component.status = 'active';
      component.customIcon = 'star';
      component.showIcon = true;
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="status-icon"]'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('star');
    });
  });

  describe('Color Themes', () => {
    it('should apply correct color for active status', () => {
      component.status = 'active';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('status-active');
    });

    it('should apply correct color for inactive status', () => {
      component.status = 'inactive';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('status-inactive');
    });

    it('should apply correct color for pending status', () => {
      component.status = 'pending';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('status-pending');
    });

    it('should apply correct color for approved status', () => {
      component.status = 'approved';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('status-approved');
    });

    it('should apply correct color for rejected status', () => {
      component.status = 'rejected';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('status-rejected');
    });

    it('should apply correct color for expired status', () => {
      component.status = 'expired';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('status-expired');
    });

    it('should use custom color when provided', () => {
      component.status = 'custom';
      component.customColor = '#ff5722';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.style.backgroundColor).toBe('rgb(255, 87, 34)');
    });

    it('should support CSS custom properties for theming', () => {
      component.status = 'active';
      component.useCustomProperties = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('custom-theme');
    });
  });

  describe('Size Variations', () => {
    it('should apply small size class', () => {
      component.size = 'small';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('size-small');
    });

    it('should apply medium size class (default)', () => {
      component.size = 'medium';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('size-medium');
    });

    it('should apply large size class', () => {
      component.size = 'large';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('size-large');
    });

    it('should adjust icon size based on chip size', () => {
      component.size = 'small';
      component.status = 'active';
      component.showIcon = true;
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('[data-testid="status-icon"]'));
      expect(iconElement.nativeElement.classList).toContain('small-icon');
    });
  });

  describe('Variant Styles', () => {
    it('should apply filled variant (default)', () => {
      component.variant = 'filled';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('variant-filled');
    });

    it('should apply outlined variant', () => {
      component.variant = 'outlined';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('variant-outlined');
    });

    it('should apply text variant', () => {
      component.variant = 'text';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('variant-text');
    });

    it('should apply rounded variant', () => {
      component.variant = 'rounded';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('variant-rounded');
    });
  });

  describe('Thai Insurance Status Context', () => {
    it('should display policy status correctly', () => {
      const policyStatuses = [
        { status: 'active', label: 'มีผลบังคับ' },
        { status: 'expired', label: 'หมดอายุ' },
        { status: 'cancelled', label: 'ยกเลิกแล้ว' },
        { status: 'pending', label: 'รอการอนุมัติ' }
      ];
      
      policyStatuses.forEach(policyStatus => {
        component.status = policyStatus.status;
        component.label = policyStatus.label;
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(policyStatus.label);
      });
    });

    it('should display claim status correctly', () => {
      const claimStatuses = [
        { status: 'submitted', label: 'ยื่นเคลมแล้ว' },
        { status: 'under-review', label: 'กำลังตรวจสอบ' },
        { status: 'approved', label: 'อนุมัติแล้ว' },
        { status: 'rejected', label: 'ปฏิเสธ' },
        { status: 'paid', label: 'จ่ายแล้ว' }
      ];
      
      claimStatuses.forEach(claimStatus => {
        component.status = claimStatus.status;
        component.label = claimStatus.label;
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(claimStatus.label);
      });
    });

    it('should display payment status correctly', () => {
      const paymentStatuses = [
        { status: 'paid', label: 'ชำระแล้ว' },
        { status: 'overdue', label: 'เลยกำหนด' },
        { status: 'pending', label: 'รอชำระ' },
        { status: 'processing', label: 'กำลังดำเนินการ' },
        { status: 'failed', label: 'ชำระไม่สำเร็จ' }
      ];
      
      paymentStatuses.forEach(paymentStatus => {
        component.status = paymentStatus.status;
        component.label = paymentStatus.label;
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(paymentStatus.label);
      });
    });

    it('should display vehicle status correctly', () => {
      const vehicleStatuses = [
        { status: 'registered', label: 'ลงทะเบียนแล้ว' },
        { status: 'unregistered', label: 'ยังไม่ลงทะเบียน' },
        { status: 'suspended', label: 'ระงับการใช้งาน' },
        { status: 'transferred', label: 'โอนแล้ว' }
      ];
      
      vehicleStatuses.forEach(vehicleStatus => {
        component.status = vehicleStatus.status;
        component.label = vehicleStatus.label;
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(vehicleStatus.label);
      });
    });

    it('should display inspection status correctly', () => {
      const inspectionStatuses = [
        { status: 'valid', label: 'ผ่านการตรวจ' },
        { status: 'invalid', label: 'ไม่ผ่านการตรวจ' },
        { status: 'pending-inspection', label: 'รอตรวจสอบ' },
        { status: 'inspection-due', label: 'ครบกำหนดตรวจ' }
      ];
      
      inspectionStatuses.forEach(inspectionStatus => {
        component.status = inspectionStatus.status;
        component.label = inspectionStatus.label;
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(inspectionStatus.label);
      });
    });

    it('should display customer verification status', () => {
      const verificationStatuses = [
        { status: 'verified', label: 'ยืนยันแล้ว' },
        { status: 'unverified', label: 'ยังไม่ยืนยัน' },
        { status: 'pending-verification', label: 'รอการยืนยัน' },
        { status: 'verification-failed', label: 'ยืนยันไม่สำเร็จ' }
      ];
      
      verificationStatuses.forEach(verificationStatus => {
        component.status = verificationStatus.status;
        component.label = verificationStatus.label;
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement.nativeElement.textContent.trim()).toBe(verificationStatus.label);
      });
    });
  });

  describe('Tooltip Functionality', () => {
    it('should show tooltip when provided', () => {
      component.status = 'active';
      component.tooltip = 'กรมธรรม์นี้มีสถานะใช้งานอยู่และมีผลบังคับใช้';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.getAttribute('matTooltip')).toBe('กรมธรรม์นี้มีสถานะใช้งานอยู่และมีผลบังคับใช้');
    });

    it('should not show tooltip when not provided', () => {
      component.status = 'active';
      component.tooltip = '';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.getAttribute('matTooltip')).toBeFalsy();
    });

    it('should show tooltip with detailed information', () => {
      component.status = 'expired';
      component.tooltip = 'กรมธรรม์หมดอายุเมื่อ 15 มิถุนายน 2567 กรุณาต่ออายุเพื่อความคุ้มครองต่อเนื่อง';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.getAttribute('matTooltip')).toContain('15 มิถุนายน 2567');
    });

    it('should position tooltip correctly', () => {
      component.status = 'pending';
      component.tooltip = 'รอการอนุมัติจากเจ้าหน้าที่';
      component.tooltipPosition = 'above';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.getAttribute('matTooltipPosition')).toBe('above');
    });
  });

  describe('Click Events', () => {
    it('should emit click event when clickable', () => {
      spyOn(component.statusClicked, 'emit');
      
      component.status = 'active';
      component.clickable = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      chipElement.nativeElement.click();
      
      expect(component.statusClicked.emit).toHaveBeenCalledWith('active');
    });

    it('should not emit click event when not clickable', () => {
      spyOn(component.statusClicked, 'emit');
      
      component.status = 'active';
      component.clickable = false;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      chipElement.nativeElement.click();
      
      expect(component.statusClicked.emit).not.toHaveBeenCalled();
    });

    it('should apply clickable styling when clickable', () => {
      component.status = 'active';
      component.clickable = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('clickable');
    });

    it('should have proper cursor style when clickable', () => {
      component.status = 'active';
      component.clickable = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      const computedStyle = window.getComputedStyle(chipElement.nativeElement);
      expect(computedStyle.cursor).toBe('pointer');
    });
  });

  describe('Animation and Visual Effects', () => {
    it('should have pulse animation for processing status', () => {
      component.status = 'processing';
      component.animated = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('pulse-animation');
    });

    it('should have breathing animation for pending status', () => {
      component.status = 'pending';
      component.animated = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('breathing-animation');
    });

    it('should disable animations when not specified', () => {
      component.status = 'processing';
      component.animated = false;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).not.toContain('pulse-animation');
    });

    it('should have hover effects', () => {
      component.status = 'active';
      component.clickable = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      chipElement.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      
      expect(chipElement.nativeElement.classList).toContain('hovered');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      component.status = 'active';
      component.label = 'ใช้งานอยู่';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.getAttribute('role')).toBe('status');
      expect(chipElement.nativeElement.getAttribute('aria-label')).toContain('ใช้งานอยู่');
    });

    it('should support keyboard navigation when clickable', () => {
      component.status = 'active';
      component.clickable = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.tabIndex).toBe(0);
    });

    it('should not be focusable when not clickable', () => {
      component.status = 'active';
      component.clickable = false;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.tabIndex).toBe(-1);
    });

    it('should handle keyboard activation', () => {
      spyOn(component.statusClicked, 'emit');
      
      component.status = 'active';
      component.clickable = true;
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      
      chipElement.nativeElement.dispatchEvent(enterEvent);
      chipElement.nativeElement.dispatchEvent(spaceEvent);
      
      expect(component.statusClicked.emit).toHaveBeenCalledTimes(2);
    });

    it('should have proper contrast ratios', () => {
      component.status = 'active';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      const computedStyle = window.getComputedStyle(chipElement.nativeElement);
      
      // Should have sufficient contrast (this is a basic check)
      expect(computedStyle.backgroundColor).toBeTruthy();
      expect(computedStyle.color).toBeTruthy();
    });

    it('should announce status changes to screen readers', () => {
      component.status = 'pending';
      fixture.detectChanges();
      
      component.status = 'approved';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 480, writable: true });
      component.responsive = true;
      component.status = 'active';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('mobile');
    });

    it('should use smaller text on mobile', () => {
      component.responsive = true;
      component.mobileSize = 'small';
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('size-small');
    });

    it('should maintain readability on all screen sizes', () => {
      component.status = 'active';
      component.label = 'สถานะยาวมาก';
      
      [320, 768, 1024, 1920].forEach(width => {
        Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        expect(chipElement).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined status', () => {
      component.status = undefined as any;
      component.label = '';
      
      expect(() => fixture.detectChanges()).not.toThrow();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement?.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle null label', () => {
      component.status = 'active';
      component.label = null as any;
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle very long labels', () => {
      component.status = 'active';
      component.label = 'สถานะที่มีความยาวมากเกินไปและควรจะถูกตัดทอน'.repeat(3);
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement).toBeTruthy();
    });

    it('should handle special characters in labels', () => {
      component.status = 'active';
      component.label = 'สถานะ!@#$%^&*()<>&"\'';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.textContent).toContain('!@#$%^&*()');
    });

    it('should handle rapid status changes', () => {
      const statuses = ['active', 'inactive', 'pending', 'approved', 'rejected'];
      
      for (let i = 0; i < 10; i++) {
        component.status = statuses[i % statuses.length];
        fixture.detectChanges();
      }
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Create and destroy multiple instances
      for (let i = 0; i < 50; i++) {
        component.status = `status-${i}`;
        component.label = `Label ${i}`;
        fixture.detectChanges();
        
        if (component.clickable) {
          component.statusClicked.emit(component.status);
        }
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryGrowth = finalMemory - initialMemory;
      
      expect(memoryGrowth).toBeLessThan(50000); // Less than 50KB growth
    });

    it('should handle frequent updates efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        component.status = 'active';
        component.label = `Status ${i}`;
        fixture.detectChanges();
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(500); // Should complete in less than 500ms
    });

    it('should clean up resources on destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });
  });

  describe('Integration with Data Tables', () => {
    it('should work correctly in table cells', () => {
      component.status = 'active';
      component.label = 'ใช้งานอยู่';
      component.size = 'small';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      
      // Should have appropriate styling for table cells
      expect(chipElement.nativeElement.classList).toContain('size-small');
    });

    it('should maintain consistent heights in tables', () => {
      const sizes = ['small', 'medium', 'large'];
      const heights: number[] = [];
      
      sizes.forEach(size => {
        component.size = size as any;
        component.status = 'active';
        fixture.detectChanges();
        
        const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
        heights.push(chipElement.nativeElement.offsetHeight);
      });
      
      // Heights should be different for different sizes
      expect(new Set(heights).size).toBe(3);
    });
  });

  describe('Theme Integration', () => {
    it('should work with light theme', () => {
      document.body.classList.add('light-theme');
      
      component.status = 'active';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement).toBeTruthy();
      
      document.body.classList.remove('light-theme');
    });

    it('should work with dark theme', () => {
      document.body.classList.add('dark-theme');
      
      component.status = 'active';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement).toBeTruthy();
      
      document.body.classList.remove('dark-theme');
    });

    it('should support custom theme colors', () => {
      component.status = 'active';
      component.themeColor = 'success';
      fixture.detectChanges();
      
      const chipElement = fixture.debugElement.query(By.css('[data-testid="status-chip"]'));
      expect(chipElement.nativeElement.classList).toContain('theme-success');
    });
  });
});