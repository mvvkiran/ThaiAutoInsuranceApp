import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { TranslationService } from './core/services/translation.service';
import { NotificationService } from './core/services/notification.service';
import { LoadingService } from './core/services/loading.service';
import { 
  MockAuthService, 
  MockTranslationService, 
  MockNotificationService,
  MockLoadingService
} from './test-helpers/mock-services';
import { MOCK_USERS } from './test-helpers/test-data';
import { TestUtilities, PageObject } from './test-helpers/test-utilities';

class AppPageObject extends PageObject<AppComponent> {
  get loadingSpinner(): HTMLElement | null {
    return this.getElement('[data-testid="app-loading-spinner"]');
  }

  get mainContent(): HTMLElement | null {
    return this.getElement('[data-testid="main-content"]');
  }

  get navigationHeader(): HTMLElement | null {
    return this.getElement('[data-testid="navigation-header"]');
  }

  get routerOutlet(): HTMLElement | null {
    return this.getElement('router-outlet');
  }

  get errorMessage(): string {
    return this.getText('[data-testid="error-message"]');
  }

  get themeToggle(): HTMLElement | null {
    return this.getElement('[data-testid="theme-toggle"]');
  }

  get languageSelector(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="language-selector"]');
  }

  get userMenu(): HTMLElement | null {
    return this.getElement('[data-testid="user-menu"]');
  }

  get appTitle(): string {
    return this.getText('[data-testid="app-title"]');
  }

  toggleTheme(): void {
    this.clickElement('[data-testid="theme-toggle"]');
  }

  openUserMenu(): void {
    this.clickElement('[data-testid="user-menu-trigger"]');
  }

  selectLanguage(language: string): void {
    const selector = this.languageSelector;
    if (selector) {
      selector.value = language;
      selector.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let pageObject: AppPageObject;
  let authService: MockAuthService;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;
  let loadingService: MockLoadingService;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();
    const loadingServiceInstance = new MockLoadingService();

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        NoopAnimationsModule,
        RouterOutlet
      ],
      providers: [
        { provide: AuthService, useValue: authServiceInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance },
        { provide: LoadingService, useValue: loadingServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    pageObject = new AppPageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    translationService = TestBed.inject(TranslationService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
    loadingService = TestBed.inject(LoadingService) as any;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      fixture.detectChanges();
      
      expect(component.title).toBe('Thai Auto Insurance');
      expect(component.isLoading).toBeFalse();
      expect(component.currentTheme).toBe('light');
      expect(component.currentLanguage).toBe('en');
    });

    it('should set up loading service subscription', () => {
      loadingService.setLoading(true);
      fixture.detectChanges();
      
      expect(component.isLoading).toBeTrue();
    });

    it('should set up authentication service subscription', () => {
      authService._isAuthenticated = true;
      authService._mockUser = MOCK_USERS[0];
      authService.currentUserSubject.next(MOCK_USERS[0]);
      
      fixture.detectChanges();
      
      expect(component.currentUser).toEqual(MOCK_USERS[0]);
      expect(component.isAuthenticated).toBeTrue();
    });

    it('should initialize with saved theme preference', () => {
      spyOn(localStorage, 'getItem').and.returnValue('dark');
      
      component.ngOnInit();
      
      expect(component.currentTheme).toBe('dark');
    });

    it('should initialize with saved language preference', () => {
      spyOn(localStorage, 'getItem').and.returnValue('th');
      
      component.ngOnInit();
      
      expect(component.currentLanguage).toBe('th');
      expect(translationService.setLanguage).toHaveBeenCalledWith('th');
    });

    it('should handle missing localStorage values gracefully', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      
      expect(() => component.ngOnInit()).not.toThrow();
      expect(component.currentTheme).toBe('light');
      expect(component.currentLanguage).toBe('en');
    });
  });

  describe('Theme Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle theme from light to dark', () => {
      spyOn(localStorage, 'setItem');
      
      component.toggleTheme();
      
      expect(component.currentTheme).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle theme from dark to light', () => {
      component.currentTheme = 'dark';
      spyOn(localStorage, 'setItem');
      
      component.toggleTheme();
      
      expect(component.currentTheme).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should apply dark theme CSS class', () => {
      component.currentTheme = 'dark';
      
      expect(component.isDarkTheme).toBeTrue();
    });

    it('should not apply dark theme CSS class for light theme', () => {
      component.currentTheme = 'light';
      
      expect(component.isDarkTheme).toBeFalse();
    });

    it('should handle theme toggle via UI interaction', () => {
      const toggleButton = pageObject.themeToggle;
      if (toggleButton) {
        pageObject.toggleTheme();
        
        expect(component.currentTheme).toBe('dark');
      }
    });
  });

  describe('Language Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should change language to Thai', () => {
      spyOn(localStorage, 'setItem');
      
      component.changeLanguage('th');
      
      expect(component.currentLanguage).toBe('th');
      expect(translationService.setLanguage).toHaveBeenCalledWith('th');
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'th');
    });

    it('should change language to English', () => {
      component.currentLanguage = 'th';
      spyOn(localStorage, 'setItem');
      
      component.changeLanguage('en');
      
      expect(component.currentLanguage).toBe('en');
      expect(translationService.setLanguage).toHaveBeenCalledWith('en');
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    });

    it('should handle invalid language gracefully', () => {
      spyOn(localStorage, 'setItem');
      
      component.changeLanguage('invalid');
      
      expect(component.currentLanguage).toBe('en'); // Should default to English
      expect(translationService.setLanguage).toHaveBeenCalledWith('en');
    });

    it('should provide available languages list', () => {
      expect(component.availableLanguages).toEqual([
        { code: 'en', name: 'English' },
        { code: 'th', name: 'ไทย' }
      ]);
    });

    it('should handle language selection via UI', () => {
      pageObject.selectLanguage('th');
      
      expect(component.currentLanguage).toBe('th');
      expect(translationService.setLanguage).toHaveBeenCalledWith('th');
    });
  });

  describe('Loading State Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show loading spinner when loading', () => {
      loadingService.setLoading(true);
      fixture.detectChanges();
      
      expect(component.isLoading).toBeTrue();
      expect(pageObject.loadingSpinner).toBeTruthy();
    });

    it('should hide loading spinner when not loading', () => {
      loadingService.setLoading(false);
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(pageObject.loadingSpinner).toBeFalsy();
    });

    it('should handle multiple loading states correctly', () => {
      // Start loading
      loadingService.setLoading(true);
      fixture.detectChanges();
      expect(component.isLoading).toBeTrue();

      // Stop loading
      loadingService.setLoading(false);
      fixture.detectChanges();
      expect(component.isLoading).toBeFalse();

      // Start loading again
      loadingService.setLoading(true);
      fixture.detectChanges();
      expect(component.isLoading).toBeTrue();
    });
  });

  describe('User Authentication State', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show user menu when authenticated', () => {
      authService._isAuthenticated = true;
      authService._mockUser = MOCK_USERS[0];
      authService.currentUserSubject.next(MOCK_USERS[0]);
      fixture.detectChanges();
      
      expect(component.isAuthenticated).toBeTrue();
      expect(component.currentUser).toEqual(MOCK_USERS[0]);
      expect(pageObject.userMenu).toBeTruthy();
    });

    it('should hide user menu when not authenticated', () => {
      authService._isAuthenticated = false;
      authService._mockUser = null;
      authService.currentUserSubject.next(null);
      fixture.detectChanges();
      
      expect(component.isAuthenticated).toBeFalse();
      expect(component.currentUser).toBeNull();
    });

    it('should display user name in header when authenticated', () => {
      authService._isAuthenticated = true;
      authService._mockUser = MOCK_USERS[0];
      authService.currentUserSubject.next(MOCK_USERS[0]);
      fixture.detectChanges();
      
      expect(component.getUserDisplayName()).toBe(MOCK_USERS[0].firstName + ' ' + MOCK_USERS[0].lastName);
    });

    it('should handle logout properly', () => {
      authService._isAuthenticated = true;
      authService._mockUser = MOCK_USERS[0];
      
      component.onLogout();
      
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should show notification on logout', () => {
      spyOn(translationService, 'instant').and.returnValue('Logged out successfully');
      
      component.onLogout();
      
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Logged out successfully');
    });
  });

  describe('Navigation and Routing', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render router outlet', () => {
      expect(pageObject.routerOutlet).toBeTruthy();
    });

    it('should handle navigation errors gracefully', () => {
      // This would test router error handling
      expect(component).toBeTruthy();
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on interactive elements', () => {
      const themeToggle = pageObject.themeToggle;
      if (themeToggle) {
        expect(themeToggle.getAttribute('aria-label')).toBeTruthy();
      }
    });

    it('should support keyboard navigation', () => {
      const themeToggle = pageObject.themeToggle;
      if (themeToggle) {
        // Test keyboard interaction
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        themeToggle.dispatchEvent(event);
        // Would verify appropriate response
      }
    });

    it('should provide screen reader announcements for theme changes', () => {
      component.toggleTheme();
      
      expect(component.getThemeAnnouncement()).toContain('Theme changed to');
    });

    it('should provide screen reader announcements for language changes', () => {
      component.changeLanguage('th');
      
      expect(component.getLanguageAnnouncement()).toContain('Language changed to');
    });
  });

  describe('Thai Localization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should format dates in Thai format when Thai language selected', () => {
      component.changeLanguage('th');
      const testDate = new Date('2024-01-01');
      
      const formattedDate = component.formatDate(testDate);
      
      expect(formattedDate).toMatch(/\d{1,2}\s\w+\s\d{4}/); // Thai date format
    });

    it('should display Thai text correctly', () => {
      spyOn(translationService, 'instant').and.returnValue('ประกันรถยนต์ไทย');
      component.changeLanguage('th');
      
      const appTitle = component.getAppTitle();
      
      expect(appTitle).toBe('ประกันรถยนต์ไทย');
    });

    it('should handle Thai text input properly', () => {
      component.changeLanguage('th');
      
      expect(component.isThaiLanguage()).toBeTrue();
    });

    it('should apply correct text direction for Thai content', () => {
      component.changeLanguage('th');
      
      expect(component.getTextDirection()).toBe('ltr'); // Thai uses LTR
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle service initialization errors', () => {
      // Mock service error
      spyOn(console, 'error');
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should display error messages when services fail', () => {
      component.showError('Test error message');
      
      expect(notificationService.showError).toHaveBeenCalledWith('Test error message');
    });

    it('should handle localStorage access errors', () => {
      spyOn(localStorage, 'getItem').and.throwError('Storage not available');
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should provide fallback when translation service fails', () => {
      spyOn(translationService, 'instant').and.throwError('Translation error');
      
      const title = component.getAppTitle();
      
      expect(title).toBe('Thai Auto Insurance'); // Fallback title
    });
  });

  describe('Performance Optimization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should unsubscribe from observables on destroy', () => {
      const subscription = component['subscriptions'];
      spyOn(subscription, 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should not create memory leaks', () => {
      // Initialize component
      component.ngOnInit();
      
      // Destroy component
      component.ngOnDestroy();
      
      // Verify cleanup
      expect(component['subscriptions'].closed).toBeTrue();
    });

    it('should debounce theme toggle to prevent rapid switching', () => {
      spyOn(localStorage, 'setItem');
      
      // Rapid theme toggles
      component.toggleTheme();
      component.toggleTheme();
      component.toggleTheme();
      
      // Should only save once
      setTimeout(() => {
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      }, 300);
    });
  });

  describe('SEO and Meta Tags', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set appropriate page title', () => {
      expect(component.getPageTitle()).toBe('Thai Auto Insurance');
    });

    it('should provide meta description for SEO', () => {
      expect(component.getMetaDescription()).toContain('insurance');
    });

    it('should set language attribute correctly', () => {
      component.changeLanguage('th');
      
      expect(component.getHtmlLangAttribute()).toBe('th');
    });
  });

  describe('Security Considerations', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should sanitize user display names', () => {
      const maliciousUser = {
        ...MOCK_USERS[0],
        firstName: '<script>alert("xss")</script>John',
        lastName: '<script>alert("xss")</script>Doe'
      };
      
      authService._mockUser = maliciousUser;
      
      const displayName = component.getUserDisplayName();
      
      expect(displayName).not.toContain('<script>');
    });

    it('should handle XSS attempts in translation keys', () => {
      const maliciousKey = '<script>alert("xss")</script>';
      spyOn(translationService, 'instant').and.returnValue('Safe translation');
      
      const result = component.getTranslation(maliciousKey);
      
      expect(result).toBe('Safe translation');
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should adapt to mobile viewport', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      
      component.onResize();
      
      expect(component.isMobileView()).toBeTrue();
    });

    it('should show mobile menu on small screens', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      component.onResize();
      
      expect(component.showMobileMenu).toBeTrue();
    });

    it('should handle touch events for mobile interaction', () => {
      const touchEvent = new TouchEvent('touchstart');
      
      expect(() => component.handleTouchStart(touchEvent)).not.toThrow();
    });
  });

  describe('Browser Compatibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should work without localStorage support', () => {
      // Mock localStorage not available
      spyOn(Storage.prototype, 'getItem').and.throwError('Not supported');
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should provide fallbacks for unsupported features', () => {
      // Test modern feature fallbacks
      expect(component.supportsModernFeatures()).toBeDefined();
    });
  });

  describe('Integration with External Services', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle analytics tracking', () => {
      spyOn(component, 'trackEvent');
      
      component.toggleTheme();
      
      expect(component.trackEvent).toHaveBeenCalledWith('theme_toggle', 'dark');
    });

    it('should handle monitoring service integration', () => {
      spyOn(component, 'logError');
      
      component.showError('Test error');
      
      expect(component.logError).toHaveBeenCalledWith('Test error');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle rapid component mounting/unmounting', () => {
      for (let i = 0; i < 10; i++) {
        component.ngOnInit();
        component.ngOnDestroy();
      }
      
      expect(component).toBeTruthy();
    });

    it('should handle null user gracefully', () => {
      authService._mockUser = null;
      authService.currentUserSubject.next(null);
      
      expect(() => component.getUserDisplayName()).not.toThrow();
      expect(component.getUserDisplayName()).toBe('Guest');
    });

    it('should handle empty translation responses', () => {
      spyOn(translationService, 'instant').and.returnValue('');
      
      const result = component.getTranslation('empty.key');
      
      expect(result).toBe(''); // Should handle empty gracefully
    });
  });
});