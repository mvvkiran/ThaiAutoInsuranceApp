import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatBadgeModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.title).toBe('');
      expect(component.subtitle).toBe('');
      expect(component.showBackButton).toBe(false);
      expect(component.actions).toEqual([]);
      expect(component.breadcrumbs).toEqual([]);
    });

    it('should display title when provided', () => {
      component.title = 'จัดการกรมธรรม์';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('จัดการกรมธรรม์');
    });

    it('should display subtitle when provided', () => {
      component.subtitle = 'รายการกรมธรรม์ทั้งหมด';
      fixture.detectChanges();
      
      const subtitleElement = fixture.debugElement.query(By.css('[data-testid="page-subtitle"]'));
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('รายการกรมธรรม์ทั้งหมด');
    });

    it('should hide subtitle when not provided', () => {
      component.subtitle = '';
      fixture.detectChanges();
      
      const subtitleElement = fixture.debugElement.query(By.css('[data-testid="page-subtitle"]'));
      expect(subtitleElement).toBeFalsy();
    });
  });

  describe('Back Button Functionality', () => {
    it('should show back button when enabled', () => {
      component.showBackButton = true;
      fixture.detectChanges();
      
      const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));
      expect(backButton).toBeTruthy();
    });

    it('should hide back button when disabled', () => {
      component.showBackButton = false;
      fixture.detectChanges();
      
      const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));
      expect(backButton).toBeFalsy();
    });

    it('should navigate back when back button is clicked', () => {
      component.showBackButton = true;
      fixture.detectChanges();
      
      const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));
      backButton.nativeElement.click();
      
      expect(mockLocation.back).toHaveBeenCalled();
    });

    it('should emit back event when back button is clicked', () => {
      spyOn(component.backClicked, 'emit');
      component.showBackButton = true;
      fixture.detectChanges();
      
      const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));
      backButton.nativeElement.click();
      
      expect(component.backClicked.emit).toHaveBeenCalled();
    });

    it('should show back button with Thai text', () => {
      component.showBackButton = true;
      fixture.detectChanges();
      
      const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));
      expect(backButton.nativeElement.getAttribute('aria-label')).toContain('กลับ');
    });
  });

  describe('Breadcrumbs Functionality', () => {
    const mockBreadcrumbs = [
      { label: 'หน้าแรก', route: '/' },
      { label: 'กรมธรรม์', route: '/policies' },
      { label: 'รายละเอียด', route: '/policies/detail' }
    ];

    it('should display breadcrumbs when provided', () => {
      component.breadcrumbs = mockBreadcrumbs;
      fixture.detectChanges();
      
      const breadcrumbsContainer = fixture.debugElement.query(By.css('[data-testid="breadcrumbs"]'));
      expect(breadcrumbsContainer).toBeTruthy();
      
      const breadcrumbItems = fixture.debugElement.queryAll(By.css('[data-testid^="breadcrumb-"]'));
      expect(breadcrumbItems.length).toBe(3);
    });

    it('should hide breadcrumbs when empty', () => {
      component.breadcrumbs = [];
      fixture.detectChanges();
      
      const breadcrumbsContainer = fixture.debugElement.query(By.css('[data-testid="breadcrumbs"]'));
      expect(breadcrumbsContainer).toBeFalsy();
    });

    it('should display breadcrumb labels correctly', () => {
      component.breadcrumbs = mockBreadcrumbs;
      fixture.detectChanges();
      
      const breadcrumbItems = fixture.debugElement.queryAll(By.css('[data-testid^="breadcrumb-"]'));
      
      expect(breadcrumbItems[0].nativeElement.textContent.trim()).toBe('หน้าแรก');
      expect(breadcrumbItems[1].nativeElement.textContent.trim()).toBe('กรมธรรม์');
      expect(breadcrumbItems[2].nativeElement.textContent.trim()).toBe('รายละเอียด');
    });

    it('should navigate when breadcrumb is clicked', () => {
      component.breadcrumbs = mockBreadcrumbs;
      fixture.detectChanges();
      
      const firstBreadcrumb = fixture.debugElement.query(By.css('[data-testid="breadcrumb-0"]'));
      firstBreadcrumb.nativeElement.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should emit breadcrumb click event', () => {
      spyOn(component.breadcrumbClicked, 'emit');
      component.breadcrumbs = mockBreadcrumbs;
      fixture.detectChanges();
      
      const firstBreadcrumb = fixture.debugElement.query(By.css('[data-testid="breadcrumb-0"]'));
      firstBreadcrumb.nativeElement.click();
      
      expect(component.breadcrumbClicked.emit).toHaveBeenCalledWith(mockBreadcrumbs[0]);
    });

    it('should show separator between breadcrumbs', () => {
      component.breadcrumbs = mockBreadcrumbs;
      fixture.detectChanges();
      
      const separators = fixture.debugElement.queryAll(By.css('[data-testid="breadcrumb-separator"]'));
      expect(separators.length).toBe(2); // One less than breadcrumb items
    });

    it('should disable last breadcrumb (current page)', () => {
      component.breadcrumbs = mockBreadcrumbs;
      fixture.detectChanges();
      
      const lastBreadcrumb = fixture.debugElement.query(By.css('[data-testid="breadcrumb-2"]'));
      expect(lastBreadcrumb.nativeElement.classList).toContain('current-page');
    });
  });

  describe('Action Buttons', () => {
    const mockActions = [
      { key: 'create', label: 'สร้างใหม่', icon: 'add', color: 'primary' },
      { key: 'export', label: 'ส่งออก', icon: 'download', color: 'accent' },
      { key: 'settings', label: 'ตั้งค่า', icon: 'settings' }
    ];

    it('should display action buttons when provided', () => {
      component.actions = mockActions;
      fixture.detectChanges();
      
      const actionButtons = fixture.debugElement.queryAll(By.css('[data-testid^="action-"]'));
      expect(actionButtons.length).toBe(3);
    });

    it('should hide actions when empty', () => {
      component.actions = [];
      fixture.detectChanges();
      
      const actionsContainer = fixture.debugElement.query(By.css('[data-testid="actions"]'));
      expect(actionsContainer).toBeFalsy();
    });

    it('should display action labels correctly', () => {
      component.actions = mockActions;
      fixture.detectChanges();
      
      const createButton = fixture.debugElement.query(By.css('[data-testid="action-create"]'));
      expect(createButton.nativeElement.textContent.trim()).toBe('สร้างใหม่');
      
      const exportButton = fixture.debugElement.query(By.css('[data-testid="action-export"]'));
      expect(exportButton.nativeElement.textContent.trim()).toBe('ส่งออก');
    });

    it('should display action icons correctly', () => {
      component.actions = mockActions;
      fixture.detectChanges();
      
      const createIcon = fixture.debugElement.query(By.css('[data-testid="action-create"] mat-icon'));
      expect(createIcon.nativeElement.textContent.trim()).toBe('add');
      
      const exportIcon = fixture.debugElement.query(By.css('[data-testid="action-export"] mat-icon'));
      expect(exportIcon.nativeElement.textContent.trim()).toBe('download');
    });

    it('should apply correct button colors', () => {
      component.actions = mockActions;
      fixture.detectChanges();
      
      const createButton = fixture.debugElement.query(By.css('[data-testid="action-create"]'));
      expect(createButton.nativeElement.classList).toContain('mat-primary');
      
      const exportButton = fixture.debugElement.query(By.css('[data-testid="action-export"]'));
      expect(exportButton.nativeElement.classList).toContain('mat-accent');
    });

    it('should emit action click events', () => {
      spyOn(component.actionClicked, 'emit');
      component.actions = mockActions;
      fixture.detectChanges();
      
      const createButton = fixture.debugElement.query(By.css('[data-testid="action-create"]'));
      createButton.nativeElement.click();
      
      expect(component.actionClicked.emit).toHaveBeenCalledWith(mockActions[0]);
    });

    it('should disable actions based on conditions', () => {
      const disabledActions = [
        { key: 'edit', label: 'แก้ไข', icon: 'edit', disabled: true },
        { key: 'delete', label: 'ลบ', icon: 'delete', disabled: false }
      ];
      
      component.actions = disabledActions;
      fixture.detectChanges();
      
      const editButton = fixture.debugElement.query(By.css('[data-testid="action-edit"]'));
      const deleteButton = fixture.debugElement.query(By.css('[data-testid="action-delete"]'));
      
      expect(editButton.nativeElement.disabled).toBe(true);
      expect(deleteButton.nativeElement.disabled).toBe(false);
    });

    it('should show action tooltips', () => {
      const actionsWithTooltips = [
        { key: 'help', label: 'ช่วยเหลือ', icon: 'help', tooltip: 'คลิกเพื่อดูคำแนะนำ' }
      ];
      
      component.actions = actionsWithTooltips;
      fixture.detectChanges();
      
      const helpButton = fixture.debugElement.query(By.css('[data-testid="action-help"]'));
      expect(helpButton.nativeElement.getAttribute('matTooltip')).toBe('คลิกเพื่อดูคำแนะนำ');
    });
  });

  describe('Thai Insurance Context', () => {
    it('should display insurance policy header', () => {
      component.title = 'จัดการกรมธรรม์ประกันภัยรถยนต์';
      component.subtitle = 'ระบบบริหารจัดการกรมธรรม์ประกันภัยออนไลน์';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      const subtitleElement = fixture.debugElement.query(By.css('[data-testid="page-subtitle"]'));
      
      expect(titleElement.nativeElement.textContent).toContain('กรมธรรม์ประกันภัย');
      expect(subtitleElement.nativeElement.textContent).toContain('ออนไลน์');
    });

    it('should display claim management header', () => {
      component.title = 'จัดการเคลมประกันภัย';
      component.subtitle = 'ตรวจสอบและอนุมัติการเรียกร้องค่าสินไหทดแทน';
      component.actions = [
        { key: 'new-claim', label: 'เคลมใหม่', icon: 'add_circle', color: 'primary' },
        { key: 'reports', label: 'รายงาน', icon: 'assessment', color: 'accent' }
      ];
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      expect(titleElement.nativeElement.textContent).toContain('เคลมประกันภัย');
      
      const newClaimButton = fixture.debugElement.query(By.css('[data-testid="action-new-claim"]'));
      expect(newClaimButton.nativeElement.textContent).toContain('เคลมใหม่');
    });

    it('should display customer management header', () => {
      component.title = 'ลูกค้า';
      component.subtitle = 'จัดการข้อมูลลูกค้าและผู้เอาประกันภัย';
      component.breadcrumbs = [
        { label: 'หน้าแรก', route: '/' },
        { label: 'ลูกค้า', route: '/customers' }
      ];
      fixture.detectChanges();
      
      const breadcrumbItems = fixture.debugElement.queryAll(By.css('[data-testid^="breadcrumb-"]'));
      expect(breadcrumbItems[1].nativeElement.textContent.trim()).toBe('ลูกค้า');
    });

    it('should handle premium payment header', () => {
      component.title = 'ชำระเบี้ยประกัน';
      component.subtitle = 'ระบบชำระเบี้ยประกันภัยออนไลน์';
      component.actions = [
        { key: 'payment-history', label: 'ประวัติการชำระ', icon: 'history' },
        { key: 'payment-methods', label: 'ช่องทางชำระ', icon: 'payment' }
      ];
      fixture.detectChanges();
      
      const paymentHistoryButton = fixture.debugElement.query(By.css('[data-testid="action-payment-history"]'));
      expect(paymentHistoryButton.nativeElement.textContent).toContain('ประวัติการชำระ');
    });

    it('should display vehicle registration header', () => {
      component.title = 'ลงทะเบียนยานพาหนะ';
      component.subtitle = 'เพิ่มข้อมูลรถยนต์และรถจักรยานยนต์';
      fixture.detectChanges();
      
      const subtitleElement = fixture.debugElement.query(By.css('[data-testid="page-subtitle"]'));
      expect(subtitleElement.nativeElement.textContent).toContain('รถยนต์และรถจักรยานยนต์');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      component.title = 'จัดการกรมธรรม์ประกันภัยรถยนต์';
      component.actions = [
        { key: 'create', label: 'สร้างใหม่', icon: 'add' },
        { key: 'export', label: 'ส่งออก', icon: 'download' },
        { key: 'settings', label: 'ตั้งค่า', icon: 'settings' }
      ];
      fixture.detectChanges();
      
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 480, writable: true });
      component.checkViewport();
      fixture.detectChanges();
      
      expect(component.isMobile).toBe(true);
      
      // Should show mobile menu for actions
      const mobileMenu = fixture.debugElement.query(By.css('[data-testid="mobile-menu"]'));
      expect(mobileMenu).toBeTruthy();
    });

    it('should show desktop layout on larger screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      component.checkViewport();
      fixture.detectChanges();
      
      expect(component.isMobile).toBe(false);
      
      const desktopActions = fixture.debugElement.query(By.css('[data-testid="desktop-actions"]'));
      expect(desktopActions).toBeTruthy();
    });

    it('should truncate long titles on mobile', () => {
      component.title = 'จัดการกรมธรรม์ประกันภัยรถยนต์และรถจักรยานยนต์สำหรับบุคคลทั่วไป';
      
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      component.checkViewport();
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      expect(titleElement.nativeElement.classList).toContain('mobile-title');
    });

    it('should hide breadcrumbs on very small screens', () => {
      component.breadcrumbs = [
        { label: 'หน้าแรก', route: '/' },
        { label: 'กรมธรรม์', route: '/policies' },
        { label: 'รายละเอียด', route: '/policies/detail' }
      ];
      
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      component.checkViewport();
      fixture.detectChanges();
      
      const breadcrumbsContainer = fixture.debugElement.query(By.css('[data-testid="breadcrumbs"]'));
      expect(breadcrumbsContainer?.nativeElement.classList).toContain('hidden-xs');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      component.title = 'หน้าหลัก';
      component.subtitle = 'รายละเอียดย่อย';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      const subtitleElement = fixture.debugElement.query(By.css('[data-testid="page-subtitle"]'));
      
      expect(titleElement.nativeElement.tagName).toBe('H1');
      expect(subtitleElement.nativeElement.tagName).toBe('H2');
    });

    it('should have proper ARIA labels for buttons', () => {
      component.showBackButton = true;
      component.actions = [
        { key: 'create', label: 'สร้างใหม่', icon: 'add' }
      ];
      fixture.detectChanges();
      
      const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));
      const createButton = fixture.debugElement.query(By.css('[data-testid="action-create"]'));
      
      expect(backButton.nativeElement.getAttribute('aria-label')).toBeTruthy();
      expect(createButton.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      component.actions = [
        { key: 'create', label: 'สร้างใหม่', icon: 'add' },
        { key: 'export', label: 'ส่งออก', icon: 'download' }
      ];
      fixture.detectChanges();
      
      const actionButtons = fixture.debugElement.queryAll(By.css('[data-testid^="action-"]'));
      
      actionButtons.forEach(button => {
        expect(button.nativeElement.tabIndex).not.toBe(-1);
      });
    });

    it('should have proper breadcrumb navigation roles', () => {
      component.breadcrumbs = [
        { label: 'หน้าแรก', route: '/' },
        { label: 'กรมธรรม์', route: '/policies' }
      ];
      fixture.detectChanges();
      
      const breadcrumbsNav = fixture.debugElement.query(By.css('[data-testid="breadcrumbs"]'));
      expect(breadcrumbsNav.nativeElement.getAttribute('role')).toBe('navigation');
      expect(breadcrumbsNav.nativeElement.getAttribute('aria-label')).toBe('เส้นทางการนำทาง');
    });

    it('should announce page changes to screen readers', () => {
      component.title = 'หน้าใหม่';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      expect(titleElement.nativeElement.getAttribute('role')).toBe('heading');
      expect(titleElement.nativeElement.getAttribute('aria-level')).toBe('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title gracefully', () => {
      component.title = '';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      expect(titleElement?.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle null actions array', () => {
      component.actions = null as any;
      fixture.detectChanges();
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle undefined breadcrumbs', () => {
      component.breadcrumbs = undefined as any;
      fixture.detectChanges();
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle very long titles', () => {
      component.title = 'ระบบจัดการกรมธรรม์ประกันภัยรถยนต์และรถจักรยานยนต์สำหรับบุคคลทั่วไปและนิติบุคคลในประเทศไทย'.repeat(3);
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      expect(titleElement).toBeTruthy();
    });

    it('should handle special characters in text', () => {
      component.title = 'จัดการ!@#$%^&*()กรมธรรม์';
      component.subtitle = 'รายละเอียด<>&"\'';
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('[data-testid="page-title"]'));
      const subtitleElement = fixture.debugElement.query(By.css('[data-testid="page-subtitle"]'));
      
      expect(titleElement.nativeElement.textContent).toContain('!@#$%^&*()');
      expect(subtitleElement.nativeElement.textContent).toContain('<>&"\'');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      spyOn(component, 'ngOnChanges').and.callThrough();
      
      component.title = 'หน้าแรก';
      fixture.detectChanges();
      
      // Setting same value shouldn't trigger change
      component.title = 'หน้าแรก';
      fixture.detectChanges();
      
      expect(component.ngOnChanges).toHaveBeenCalledTimes(1);
    });

    it('should handle large number of actions efficiently', () => {
      const manyActions = Array.from({ length: 20 }, (_, i) => ({
        key: `action${i}`,
        label: `การกระทำ ${i}`,
        icon: 'action'
      }));
      
      const startTime = performance.now();
      component.actions = manyActions;
      fixture.detectChanges();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should render quickly
    });

    it('should clean up subscriptions on destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('should handle window resize events', () => {
      spyOn(component, 'checkViewport').and.callThrough();
      
      window.dispatchEvent(new Event('resize'));
      
      expect(component.checkViewport).toHaveBeenCalled();
    });

    it('should debounce resize events', () => {
      spyOn(component, 'checkViewport').and.callThrough();
      
      // Rapid resize events
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event('resize'));
      }
      
      // Should be called only once after debounce
      setTimeout(() => {
        expect(component.checkViewport).toHaveBeenCalledTimes(1);
      }, 300);
    });

    it('should handle action click events properly', () => {
      const actionSpy = jasmine.createSpy('actionHandler');
      component.actionClicked.subscribe(actionSpy);
      
      component.actions = [
        { key: 'test', label: 'ทดสอบ', icon: 'test' }
      ];
      fixture.detectChanges();
      
      const actionButton = fixture.debugElement.query(By.css('[data-testid="action-test"]'));
      actionButton.nativeElement.click();
      
      expect(actionSpy).toHaveBeenCalledWith({ key: 'test', label: 'ทดสอบ', icon: 'test' });
    });
  });
});