import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Utility functions for Angular testing
 */
export class TestUtilities {
  
  /**
   * Creates a basic test component with common imports and providers
   */
  static async createComponent<T>(
    component: any,
    imports: any[] = [],
    providers: any[] = []
  ): Promise<ComponentFixture<T>> {
    await TestBed.configureTestingModule({
      declarations: [component],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ...imports
      ],
      providers: [...providers]
    }).compileComponents();

    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    return fixture;
  }

  /**
   * Gets an element by CSS selector
   */
  static getElement<T extends Element>(
    fixture: ComponentFixture<any>,
    selector: string
  ): T | null {
    return fixture.nativeElement.querySelector(selector);
  }

  /**
   * Gets all elements by CSS selector
   */
  static getElements<T extends Element>(
    fixture: ComponentFixture<any>,
    selector: string
  ): NodeListOf<T> {
    return fixture.nativeElement.querySelectorAll(selector);
  }

  /**
   * Gets a debug element by CSS selector
   */
  static getDebugElement(
    fixture: ComponentFixture<any>,
    selector: string
  ): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }

  /**
   * Gets all debug elements by CSS selector
   */
  static getDebugElements(
    fixture: ComponentFixture<any>,
    selector: string
  ): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }

  /**
   * Simulates a click event on an element
   */
  static clickElement(
    fixture: ComponentFixture<any>,
    selector: string
  ): void {
    const element = this.getDebugElement(fixture, selector);
    if (element) {
      element.triggerEventHandler('click', null);
      fixture.detectChanges();
    }
  }

  /**
   * Sets the value of an input element and triggers change event
   */
  static setInputValue(
    fixture: ComponentFixture<any>,
    selector: string,
    value: string
  ): void {
    const input = this.getElement<HTMLInputElement>(fixture, selector);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    }
  }

  /**
   * Sets the value of a select element and triggers change event
   */
  static setSelectValue(
    fixture: ComponentFixture<any>,
    selector: string,
    value: string
  ): void {
    const select = this.getElement<HTMLSelectElement>(fixture, selector);
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    }
  }

  /**
   * Checks or unchecks a checkbox
   */
  static setCheckboxValue(
    fixture: ComponentFixture<any>,
    selector: string,
    checked: boolean
  ): void {
    const checkbox = this.getElement<HTMLInputElement>(fixture, selector);
    if (checkbox) {
      checkbox.checked = checked;
      checkbox.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    }
  }

  /**
   * Gets text content from an element
   */
  static getTextContent(
    fixture: ComponentFixture<any>,
    selector: string
  ): string {
    const element = this.getElement(fixture, selector);
    return element ? element.textContent?.trim() || '' : '';
  }

  /**
   * Checks if an element exists
   */
  static elementExists(
    fixture: ComponentFixture<any>,
    selector: string
  ): boolean {
    return !!this.getElement(fixture, selector);
  }

  /**
   * Waits for a condition to be true
   */
  static async waitForCondition(
    condition: () => boolean,
    timeout = 5000,
    interval = 50
  ): Promise<void> {
    const startTime = Date.now();
    
    while (!condition() && (Date.now() - startTime) < timeout) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    if (!condition()) {
      throw new Error(`Condition not met within ${timeout}ms`);
    }
  }

  /**
   * Waits for async operations to complete
   */
  static async waitForAsync(fixture: ComponentFixture<any>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  /**
   * Creates a mock FormControl with validation errors
   */
  static createMockFormControl(value: any = '', errors: any = null): FormControl {
    const control = new FormControl(value);
    if (errors) {
      control.setErrors(errors);
    }
    return control;
  }

  /**
   * Creates a mock FormGroup with controls
   */
  static createMockFormGroup(controls: { [key: string]: any }): FormGroup {
    const formControls: { [key: string]: FormControl } = {};
    
    Object.keys(controls).forEach(key => {
      formControls[key] = this.createMockFormControl(controls[key]);
    });
    
    return new FormGroup(formControls);
  }

  /**
   * Simulates form submission
   */
  static submitForm(
    fixture: ComponentFixture<any>,
    formSelector = 'form'
  ): void {
    const form = this.getDebugElement(fixture, formSelector);
    if (form) {
      form.triggerEventHandler('submit', new Event('submit'));
      fixture.detectChanges();
    }
  }

  /**
   * Sets multiple form field values
   */
  static setFormValues(
    fixture: ComponentFixture<any>,
    values: { [selector: string]: string }
  ): void {
    Object.keys(values).forEach(selector => {
      this.setInputValue(fixture, selector, values[selector]);
    });
  }

  /**
   * Gets form validation errors
   */
  static getFormErrors(
    fixture: ComponentFixture<any>,
    errorSelector = '.error, .invalid-feedback'
  ): string[] {
    const errorElements = this.getElements(fixture, errorSelector);
    return Array.from(errorElements).map(el => el.textContent?.trim() || '');
  }

  /**
   * Simulates keyboard events
   */
  static dispatchKeyboardEvent(
    element: Element,
    type: string,
    keyCode: number,
    key?: string
  ): void {
    const event = new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      keyCode: keyCode,
      key: key
    } as any);

    element.dispatchEvent(event);
  }

  /**
   * Simulates mouse events
   */
  static dispatchMouseEvent(
    element: Element,
    type: string,
    x = 0,
    y = 0
  ): void {
    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    });

    element.dispatchEvent(event);
  }

  /**
   * Creates a spy object with multiple methods
   */
  static createSpyObj(baseName: string, methods: string[]): jasmine.SpyObj<any> {
    const obj: any = {};
    
    methods.forEach(method => {
      obj[method] = jasmine.createSpy(`${baseName}.${method}`);
    });
    
    return obj;
  }

  /**
   * Validates Thai National ID format
   */
  static isValidThaiNationalId(id: string): boolean {
    if (!/^\d{13}$/.test(id)) return false;
    
    const digits = id.split('').map(Number);
    const sum = digits.slice(0, 12).reduce((acc, digit, index) => {
      return acc + (digit * (13 - index));
    }, 0);
    
    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === digits[12];
  }

  /**
   * Validates Thai phone number format
   */
  static isValidThaiPhoneNumber(phone: string): boolean {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Handle country code
    if (cleanPhone.startsWith('66')) {
      return /^66[689]\d{8}$/.test(cleanPhone);
    }
    
    // Handle local formats
    return /^0[689]\d{8}$/.test(cleanPhone) || /^0[23457]\d{7}$/.test(cleanPhone);
  }

  /**
   * Formats Thai currency
   */
  static formatThaiCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  }

  /**
   * Formats Thai date
   */
  static formatThaiDate(date: Date): string {
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Buddhist Era
    
    return `${day} ${month} ${year}`;
  }
}

/**
 * Mock component for routing tests
 */
@Component({
  template: '<div>Mock Component</div>'
})
export class MockComponent { }

/**
 * Page Object Model base class for component testing
 */
export class PageObject<T> {
  constructor(protected fixture: ComponentFixture<T>) {}

  get component(): T {
    return this.fixture.componentInstance;
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  async waitForStable(): Promise<void> {
    await this.fixture.whenStable();
  }

  getElement<E extends Element>(selector: string): E | null {
    return TestUtilities.getElement<E>(this.fixture, selector);
  }

  getElements<E extends Element>(selector: string): NodeListOf<E> {
    return TestUtilities.getElements<E>(this.fixture, selector);
  }

  clickElement(selector: string): void {
    TestUtilities.clickElement(this.fixture, selector);
  }

  setInputValue(selector: string, value: string): void {
    TestUtilities.setInputValue(this.fixture, selector, value);
  }

  getText(selector: string): string {
    return TestUtilities.getTextContent(this.fixture, selector);
  }

  elementExists(selector: string): boolean {
    return TestUtilities.elementExists(this.fixture, selector);
  }
}

/**
 * Thai-specific validation utilities for testing
 */
export class ThaiValidationUtils {
  static readonly THAI_PROVINCES = [
    'กรุงเทพมหานคร', 'เชียงใหม่', 'เชียงราย', 'น่าน', 'พะเยา', 'แพร่', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน',
    'อุตรดิตถ์', 'สุโขทัย', 'ตาก', 'กำแพงเพชร', 'พิจิตร', 'พิษณุโลก', 'เพชรบูรณ์', 'นครสวรรค์', 'อุทัยธานี',
    // ... (truncated for brevity, would include all 77 provinces)
  ];

  static validatePostalCode(code: string, province: string): boolean {
    // Simplified validation - in real implementation would check against postal code ranges
    return /^\d{5}$/.test(code) && parseInt(code) >= 10000 && parseInt(code) <= 96220;
  }

  static validateThaiText(text: string): boolean {
    // Check if text contains Thai characters
    return /[\u0E00-\u0E7F]/.test(text);
  }

  static validateVehicleLicensePlate(plate: string): boolean {
    // Thai license plate formats
    const patterns = [
      /^[ก-ฮ]{1,2}\s?\d{1,4}$/,           // Standard format
      /^\d[ก-ฮ]{1,2}\s?\d{1,4}$/,          // New format
      /^[ก-ฮ]{2}\s?\d{3,4}$/              // Bangkok format
    ];
    
    return patterns.some(pattern => pattern.test(plate));
  }
}