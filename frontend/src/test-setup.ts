import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Configure global test settings
beforeEach(() => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jasmine.createSpy('getItem').and.returnValue(null),
    setItem: jasmine.createSpy('setItem'),
    removeItem: jasmine.createSpy('removeItem'),
    clear: jasmine.createSpy('clear')
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jasmine.createSpy('getItem').and.returnValue(null),
    setItem: jasmine.createSpy('setItem'),
    removeItem: jasmine.createSpy('removeItem'),
    clear: jasmine.createSpy('clear')
  };
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

  // Mock window.alert, confirm, prompt
  spyOn(window, 'alert').and.stub();
  spyOn(window, 'confirm').and.returnValue(true);
  spyOn(window, 'prompt').and.returnValue('mocked input');

  // Mock console methods to reduce test noise
  spyOn(console, 'warn').and.stub();
  spyOn(console, 'error').and.stub();
});

afterEach(() => {
  // Clean up after each test
  localStorage.clear();
  sessionStorage.clear();
});

// Configure Jasmine
jasmine.getEnv().configure({
  random: false
});

// Global test utilities
(window as any).TestUtils = {
  // Utility to create mock event objects
  createMockEvent: (type: string, target?: any) => ({
    type,
    target: target || {},
    preventDefault: jasmine.createSpy('preventDefault'),
    stopPropagation: jasmine.createSpy('stopPropagation'),
    stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
  }),
  
  // Utility to wait for async operations
  waitFor: (conditionFn: () => boolean, timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkCondition = () => {
        if (conditionFn()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(checkCondition, 10);
        }
      };
      checkCondition();
    });
  }
};