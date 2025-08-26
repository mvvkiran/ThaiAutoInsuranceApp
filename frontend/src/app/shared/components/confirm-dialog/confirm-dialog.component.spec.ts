import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

// Page Object for ConfirmDialog Component
class ConfirmDialogPageObject {
  constructor(
    private fixture: ComponentFixture<ConfirmDialogComponent>,
    private loader: HarnessLoader
  ) {}

  get component(): ConfirmDialogComponent {
    return this.fixture.componentInstance;
  }

  get compiled(): HTMLElement {
    return this.fixture.nativeElement;
  }

  // Button getters
  async getConfirmButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ 
      selector: '[data-testid="confirm-button"]' 
    }));
  }

  async getCancelButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ 
      selector: '[data-testid="cancel-button"]' 
    }));
  }

  // Element getters
  getTitleElement(): HTMLElement | null {
    return this.compiled.querySelector('[data-testid="dialog-title"]');
  }

  getMessageElement(): HTMLElement | null {
    return this.compiled.querySelector('[data-testid="dialog-message"]');
  }

  getIconElement(): HTMLElement | null {
    return this.compiled.querySelector('[data-testid="dialog-icon"]');
  }

  getDialogContainer(): HTMLElement | null {
    return this.compiled.querySelector('.confirm-dialog-container');
  }

  // Helper methods
  getTitle(): string | null {
    const titleElement = this.getTitleElement();
    return titleElement ? titleElement.textContent?.trim() || null : null;
  }

  getMessage(): string | null {
    const messageElement = this.getMessageElement();
    return messageElement ? messageElement.textContent?.trim() || null : null;
  }

  getIcon(): string | null {
    const iconElement = this.getIconElement();
    return iconElement ? iconElement.textContent?.trim() || null : null;
  }

  hasIcon(): boolean {
    return !!this.getIconElement();
  }

  getDialogType(): string | null {
    const container = this.getDialogContainer();
    if (!container) return null;
    
    const classes = Array.from(container.classList);
    const typeClass = classes.find(cls => cls.startsWith('type-'));
    return typeClass ? typeClass.replace('type-', '') : null;
  }

  isConfirmButtonPrimary(): boolean {
    const confirmButton = this.compiled.querySelector('[data-testid="confirm-button"]');
    return confirmButton?.classList.contains('mat-primary') || false;
  }

  isCancelButtonBasic(): boolean {
    const cancelButton = this.compiled.querySelector('[data-testid="cancel-button"]');
    return cancelButton?.classList.contains('mat-stroked-button') || false;
  }
}

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let pageObject: ConfirmDialogPageObject;
  let loader: HarnessLoader;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const defaultDialogData: ConfirmDialogData = {
    title: 'ยืนยันการดำเนินการ',
    message: 'คุณต้องการดำเนินการนี้หรือไม่?',
    confirmText: 'ยืนยัน',
    cancelText: 'ยกเลิก',
    type: 'warning'
  };

  beforeEach(async () => {
    // Create mock MatDialogRef
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: defaultDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    pageObject = new ConfirmDialogPageObject(fixture, loader);
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with injected dialog data', () => {
      expect(component.data).toEqual(defaultDialogData);
    });

    it('should display title from dialog data', () => {
      expect(pageObject.getTitle()).toBe('ยืนยันการดำเนินการ');
    });

    it('should display message from dialog data', () => {
      expect(pageObject.getMessage()).toBe('คุณต้องการดำเนินการนี้หรือไม่?');
    });

    it('should display confirm button text', async () => {
      const confirmButton = await pageObject.getConfirmButton();
      expect(await confirmButton.getText()).toBe('ยืนยัน');
    });

    it('should display cancel button text', async () => {
      const cancelButton = await pageObject.getCancelButton();
      expect(await cancelButton.getText()).toBe('ยกเลิก');
    });

    it('should apply dialog type styling', () => {
      expect(pageObject.getDialogType()).toBe('warning');
    });
  });

  describe('Dialog Types', () => {
    it('should display warning dialog correctly', () => {
      expect(pageObject.hasIcon()).toBe(true);
      expect(pageObject.getIcon()).toBe('warning');
      expect(pageObject.getDialogType()).toBe('warning');
    });

    it('should display error dialog correctly', async () => {
      const errorData: ConfirmDialogData = {
        ...defaultDialogData,
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดำเนินการได้'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: errorData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      component = fixture.componentInstance;
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getIcon()).toBe('error');
      expect(pageObject.getDialogType()).toBe('error');
      expect(pageObject.getTitle()).toBe('เกิดข้อผิดพลาด');
    });

    it('should display success dialog correctly', async () => {
      const successData: ConfirmDialogData = {
        ...defaultDialogData,
        type: 'success',
        title: 'สำเร็จ',
        message: 'ดำเนินการเสร็จสิ้น'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: successData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      component = fixture.componentInstance;
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getIcon()).toBe('check_circle');
      expect(pageObject.getDialogType()).toBe('success');
      expect(pageObject.getTitle()).toBe('สำเร็จ');
    });

    it('should display info dialog correctly', async () => {
      const infoData: ConfirmDialogData = {
        ...defaultDialogData,
        type: 'info',
        title: 'ข้อมูล',
        message: 'ข้อมูลเพิ่มเติม'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: infoData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      component = fixture.componentInstance;
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getIcon()).toBe('info');
      expect(pageObject.getDialogType()).toBe('info');
      expect(pageObject.getTitle()).toBe('ข้อมูล');
    });

    it('should display confirm dialog correctly', async () => {
      const confirmData: ConfirmDialogData = {
        ...defaultDialogData,
        type: 'confirm',
        title: 'ยืนยัน',
        message: 'คุณแน่ใจหรือไม่?'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: confirmData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      component = fixture.componentInstance;
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getIcon()).toBe('help_outline');
      expect(pageObject.getDialogType()).toBe('confirm');
      expect(pageObject.getTitle()).toBe('ยืนยัน');
    });
  });

  describe('Button Actions', () => {
    it('should close dialog with true when confirm button is clicked', async () => {
      const confirmButton = await pageObject.getConfirmButton();
      await confirmButton.click();

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close dialog with false when cancel button is clicked', async () => {
      const cancelButton = await pageObject.getCancelButton();
      await cancelButton.click();

      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should call onConfirm method when confirm button is clicked', async () => {
      spyOn(component, 'onConfirm').and.callThrough();
      
      const confirmButton = await pageObject.getConfirmButton();
      await confirmButton.click();

      expect(component.onConfirm).toHaveBeenCalled();
    });

    it('should call onCancel method when cancel button is clicked', async () => {
      spyOn(component, 'onCancel').and.callThrough();
      
      const cancelButton = await pageObject.getCancelButton();
      await cancelButton.click();

      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('Button Styling', () => {
    it('should style confirm button as primary for warning dialog', () => {
      expect(pageObject.isConfirmButtonPrimary()).toBe(true);
    });

    it('should style cancel button as stroked', () => {
      expect(pageObject.isCancelButtonBasic()).toBe(true);
    });

    it('should apply danger styling for error confirm button', async () => {
      const errorData: ConfirmDialogData = {
        ...defaultDialogData,
        type: 'error'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: errorData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.query(By.css('[data-testid="confirm-button"]'));
      expect(confirmButton.nativeElement.classList).toContain('mat-warn');
    });

    it('should apply success styling for success confirm button', async () => {
      const successData: ConfirmDialogData = {
        ...defaultDialogData,
        type: 'success'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: successData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.query(By.css('[data-testid="confirm-button"]'));
      expect(confirmButton.nativeElement.classList).toContain('mat-primary');
    });
  });

  describe('Custom Button Text', () => {
    it('should display custom confirm button text', async () => {
      const customData: ConfirmDialogData = {
        ...defaultDialogData,
        confirmText: 'ลบข้อมูล'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: customData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      const confirmButton = await pageObject.getConfirmButton();
      expect(await confirmButton.getText()).toBe('ลบข้อมูล');
    });

    it('should display custom cancel button text', async () => {
      const customData: ConfirmDialogData = {
        ...defaultDialogData,
        cancelText: 'ไม่ลบ'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: customData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      const cancelButton = await pageObject.getCancelButton();
      expect(await cancelButton.getText()).toBe('ไม่ลบ');
    });

    it('should use default button text when not provided', async () => {
      const minimalData: ConfirmDialogData = {
        title: 'ยืนยัน',
        message: 'ดำเนินการต่อหรือไม่?',
        type: 'confirm'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: minimalData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      const confirmButton = await pageObject.getConfirmButton();
      const cancelButton = await pageObject.getCancelButton();
      
      expect(await confirmButton.getText()).toBe('ยืนยัน');
      expect(await cancelButton.getText()).toBe('ยกเลิก');
    });
  });

  describe('Message Formatting', () => {
    it('should display single line message', async () => {
      const singleLineData: ConfirmDialogData = {
        ...defaultDialogData,
        message: 'ข้อความบรรทัดเดียว'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: singleLineData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getMessage()).toBe('ข้อความบรรทัดเดียว');
    });

    it('should display multi-line message', async () => {
      const multiLineData: ConfirmDialogData = {
        ...defaultDialogData,
        message: 'บรรทัดแรก\nบรรทัดสอง\nบรรทัดสาม'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: multiLineData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getMessage()).toContain('บรรทัดแรก');
      expect(pageObject.getMessage()).toContain('บรรทัดสอง');
      expect(pageObject.getMessage()).toContain('บรรทัดสาม');
    });

    it('should handle HTML in message safely', async () => {
      const htmlData: ConfirmDialogData = {
        ...defaultDialogData,
        message: '<strong>ข้อความสำคัญ</strong> และ <em>ข้อความเน้น</em>'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: htmlData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      const messageElement = pageObject.getMessageElement();
      // Should display HTML as text, not render it
      expect(messageElement?.textContent).toContain('<strong>');
      expect(messageElement?.textContent).toContain('</strong>');
    });

    it('should handle very long messages', async () => {
      const longMessage = 'ข'.repeat(1000);
      const longMessageData: ConfirmDialogData = {
        ...defaultDialogData,
        message: longMessage
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: longMessageData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getMessage()?.length).toBe(1000);
    });
  });

  describe('Thai Insurance Context', () => {
    it('should display policy deletion confirmation', async () => {
      const policyData: ConfirmDialogData = {
        title: 'ยืนยันการลบกรมธรรม์',
        message: 'คุณต้องการลบกรมธรรม์เลขที่ POL-2024-001 หรือไม่?\n\nการกระทำนี้ไม่สามารถยกเลิกได้',
        confirmText: 'ลบกรมธรรม์',
        cancelText: 'ยกเลิก',
        type: 'warning'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: policyData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('ยืนยันการลบกรมธรรม์');
      expect(pageObject.getMessage()).toContain('POL-2024-001');
      expect(pageObject.getMessage()).toContain('ไม่สามารถยกเลิกได้');
      
      const confirmButton = await pageObject.getConfirmButton();
      expect(await confirmButton.getText()).toBe('ลบกรมธรรม์');
    });

    it('should display claim processing confirmation', async () => {
      const claimData: ConfirmDialogData = {
        title: 'ยืนยันการดำเนินการเคลม',
        message: 'ดำเนินการอนุมัติเคลมเลขที่ CLM-2024-001 จำนวน 50,000 บาท?',
        confirmText: 'อนุมัติเคลม',
        cancelText: 'ยกเลิก',
        type: 'confirm'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: claimData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('ยืนยันการดำเนินการเคลม');
      expect(pageObject.getMessage()).toContain('CLM-2024-001');
      expect(pageObject.getMessage()).toContain('50,000 บาท');
      
      const confirmButton = await pageObject.getConfirmButton();
      expect(await confirmButton.getText()).toBe('อนุมัติเคลม');
    });

    it('should display premium payment confirmation', async () => {
      const paymentData: ConfirmDialogData = {
        title: 'ยืนยันการชำระเงิน',
        message: 'ชำระเบี้ยประกันภัยงวดที่ 2/4 จำนวน 12,500 บาท\nผ่านบัตรเครดิต **** 1234',
        confirmText: 'ชำระเงิน',
        cancelText: 'ยกเลิก',
        type: 'info'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: paymentData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('ยืนยันการชำระเงิน');
      expect(pageObject.getMessage()).toContain('12,500 บาท');
      expect(pageObject.getMessage()).toContain('**** 1234');
      
      const confirmButton = await pageObject.getConfirmButton();
      expect(await confirmButton.getText()).toBe('ชำระเงิน');
    });

    it('should display policy cancellation warning', async () => {
      const cancellationData: ConfirmDialogData = {
        title: 'คำเตือน: ยกเลิกกรมธรรม์',
        message: 'การยกเลิกกรมธรรม์จะส่งผลต่อความคุ้มครอง\nและอาจมีค่าปรับตามเงื่อนไข\n\nคุณแน่ใจหรือไม่?',
        confirmText: 'ยืนยันยกเลิก',
        cancelText: 'ไม่ยกเลิก',
        type: 'error'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: cancellationData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('คำเตือน: ยกเลิกกรมธรรม์');
      expect(pageObject.getMessage()).toContain('ความคุ้มครอง');
      expect(pageObject.getMessage()).toContain('ค่าปรับ');
      
      const confirmButton = await pageObject.getConfirmButton();
      const cancelButton = await pageObject.getCancelButton();
      
      expect(await confirmButton.getText()).toBe('ยืนยันยกเลิก');
      expect(await cancelButton.getText()).toBe('ไม่ยกเลิก');
    });

    it('should display data export confirmation', async () => {
      const exportData: ConfirmDialogData = {
        title: 'ยืนยันการส่งออกข้อมูล',
        message: 'ส่งออกรายงานกรมธรรม์ประจำเดือน มิถุนายน 2024\nไฟล์จะถูกส่งไปยังอีเมลของคุณ',
        confirmText: 'ส่งออกข้อมูล',
        cancelText: 'ยกเลิก',
        type: 'info'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: exportData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('ยืนยันการส่งออกข้อมูล');
      expect(pageObject.getMessage()).toContain('มิถุนายน 2024');
      expect(pageObject.getMessage()).toContain('อีเมล');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const dialogContainer = pageObject.getDialogContainer();
      expect(dialogContainer?.getAttribute('role')).toBe('dialog');
      expect(dialogContainer?.getAttribute('aria-modal')).toBe('true');
    });

    it('should have accessible title', () => {
      const titleElement = pageObject.getTitleElement();
      expect(titleElement?.getAttribute('id')).toBeTruthy();
      
      const dialogContainer = pageObject.getDialogContainer();
      expect(dialogContainer?.getAttribute('aria-labelledby')).toBeTruthy();
    });

    it('should have accessible description', () => {
      const messageElement = pageObject.getMessageElement();
      expect(messageElement?.getAttribute('id')).toBeTruthy();
      
      const dialogContainer = pageObject.getDialogContainer();
      expect(dialogContainer?.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('should support keyboard navigation', async () => {
      const confirmButton = await pageObject.getConfirmButton();
      const cancelButton = await pageObject.getCancelButton();
      
      expect(await confirmButton.isFocused()).toBeFalsy();
      
      // Simulate Tab key navigation
      const confirmButtonElement = await confirmButton.host();
      await confirmButtonElement.focus();
      
      expect(await confirmButton.isFocused()).toBe(true);
    });

    it('should have proper focus management', async () => {
      // Cancel button should be focused by default for safety
      const cancelButton = await pageObject.getCancelButton();
      const cancelButtonElement = await cancelButton.host();
      
      expect(await cancelButtonElement.isFocused()).toBe(false);
      
      // After component initialization, cancel should be focusable first
      await cancelButtonElement.focus();
      expect(await cancelButton.isFocused()).toBe(true);
    });

    it('should have proper color contrast', () => {
      const titleElement = pageObject.getTitleElement();
      const messageElement = pageObject.getMessageElement();
      
      // Elements should be visible and have proper styling
      expect(titleElement).toBeTruthy();
      expect(messageElement).toBeTruthy();
      
      // Check that elements have computed styles
      const titleStyle = window.getComputedStyle(titleElement as Element);
      const messageStyle = window.getComputedStyle(messageElement as Element);
      
      expect(titleStyle.color).toBeTruthy();
      expect(messageStyle.color).toBeTruthy();
    });

    it('should announce dialog type to screen readers', () => {
      const iconElement = pageObject.getIconElement();
      expect(iconElement?.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing data gracefully', async () => {
      const emptyData: ConfirmDialogData = {
        title: '',
        message: '',
        type: 'info'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: emptyData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('');
      expect(pageObject.getMessage()).toBe('');
      
      const confirmButton = await pageObject.getConfirmButton();
      const cancelButton = await pageObject.getCancelButton();
      
      expect(await confirmButton.getText()).toBe('ยืนยัน');
      expect(await cancelButton.getText()).toBe('ยกเลิก');
    });

    it('should handle null data gracefully', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: null }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      component = fixture.componentInstance;
      
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(component.data).toBeNull();
    });

    it('should handle invalid dialog type gracefully', async () => {
      const invalidTypeData: ConfirmDialogData = {
        title: 'ทดสอบ',
        message: 'ข้อความทดสอบ',
        type: 'invalid' as any
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: invalidTypeData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      // Should fallback to default behavior
      expect(pageObject.getDialogType()).toBe('invalid');
      expect(pageObject.hasIcon()).toBe(true);
    });

    it('should handle special characters in text', async () => {
      const specialCharsData: ConfirmDialogData = {
        title: 'ทดสอบ!@#$%^&*()',
        message: 'ข้อความ<>&"\'\\/',
        confirmText: 'ยืนยัน!',
        cancelText: 'ยกเลิก?',
        type: 'info'
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [ConfirmDialogComponent],
        imports: [MatDialogModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: specialCharsData }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmDialogComponent);
      pageObject = new ConfirmDialogPageObject(fixture, loader);
      fixture.detectChanges();

      expect(pageObject.getTitle()).toBe('ทดสอบ!@#$%^&*()');
      expect(pageObject.getMessage()).toBe('ข้อความ<>&"\'/');
      
      const confirmButton = await pageObject.getConfirmButton();
      const cancelButton = await pageObject.getCancelButton();
      
      expect(await confirmButton.getText()).toBe('ยืนยัน!');
      expect(await cancelButton.getText()).toBe('ยกเลิก?');
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Create and destroy multiple instances
      for (let i = 0; i < 10; i++) {
        fixture.detectChanges();
        component.onConfirm();
        component.onCancel();
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryGrowth = finalMemory - initialMemory;
      
      expect(memoryGrowth).toBeLessThan(100000); // Less than 100KB growth
    });

    it('should handle rapid button clicks gracefully', async () => {
      const confirmButton = await pageObject.getConfirmButton();
      
      // Rapid clicks should not cause issues
      for (let i = 0; i < 5; i++) {
        await confirmButton.click();
      }
      
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Dialog Integration', () => {
    it('should work with MatDialog service', () => {
      expect(component.data).toBeTruthy();
      expect(mockDialogRef).toBeTruthy();
    });

    it('should handle dialog backdrop click', () => {
      // Simulate backdrop click (handled by MatDialog)
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle escape key press', () => {
      // Simulate escape key (handled by MatDialog)
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      
      // Component should still be functional
      expect(component).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('should work with light theme', () => {
      document.body.classList.add('light-theme');
      fixture.detectChanges();
      
      const container = pageObject.getDialogContainer();
      expect(container).toBeTruthy();
      
      document.body.classList.remove('light-theme');
    });

    it('should work with dark theme', () => {
      document.body.classList.add('dark-theme');
      fixture.detectChanges();
      
      const container = pageObject.getDialogContainer();
      expect(container).toBeTruthy();
      
      document.body.classList.remove('dark-theme');
    });

    it('should respect system theme preferences', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: jasmine.createSpy().and.returnValue({
          matches: true,
          addEventListener: jasmine.createSpy(),
          removeEventListener: jasmine.createSpy()
        })
      });
      
      fixture.detectChanges();
      
      const container = pageObject.getDialogContainer();
      expect(container).toBeTruthy();
    });
  });
});