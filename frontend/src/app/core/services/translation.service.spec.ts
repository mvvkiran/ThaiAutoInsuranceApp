import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService, SupportedLanguage } from './translation.service';
import { environment } from '../../../environments/environment';
import { MOCK_TRANSLATION_DATA } from '../../test-helpers/test-data';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const localStorageSpyObj = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService]
    });

    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorageSpy = localStorageSpyObj;
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    // Mock environment for testing
    spyOnProperty(environment, 'storage', 'get').and.returnValue({
      tokenKey: 'auth_token',
      userKey: 'user',
      languageKey: 'language'
    });
    spyOnProperty(environment, 'defaultLanguage', 'get').and.returnValue('th');
    spyOnProperty(environment, 'supportedLanguages', 'get').and.returnValue(['th', 'en']);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with Thai as default language', () => {
      localStorageSpy.getItem.and.returnValue(null);
      
      // Expect HTTP request for Thai translations during initialization
      const req = httpMock.expectOne('/assets/i18n/th.json');
      req.flush(MOCK_TRANSLATION_DATA.th);

      expect(service.currentLanguage).toBe('th');
    });

    it('should initialize with saved language from localStorage', () => {
      localStorageSpy.getItem.and.returnValue('en');
      
      // Expect HTTP request for English translations
      const req = httpMock.expectOne('/assets/i18n/en.json');
      req.flush(MOCK_TRANSLATION_DATA.en);

      expect(service.currentLanguage).toBe('en');
    });

    it('should fallback to browser language if supported', () => {
      localStorageSpy.getItem.and.returnValue(null);
      spyOnProperty(navigator, 'language', 'get').and.returnValue('en-US');

      // Create new service to test browser language detection
      const newService = TestBed.inject(TranslationService);
      
      const req = httpMock.expectOne('/assets/i18n/en.json');
      req.flush(MOCK_TRANSLATION_DATA.en);

      expect(newService.currentLanguage).toBe('en');
    });

    it('should use default language when browser language is not supported', () => {
      localStorageSpy.getItem.and.returnValue(null);
      spyOnProperty(navigator, 'language', 'get').and.returnValue('fr-FR');

      const newService = TestBed.inject(TranslationService);
      
      const req = httpMock.expectOne('/assets/i18n/th.json');
      req.flush(MOCK_TRANSLATION_DATA.th);

      expect(newService.currentLanguage).toBe('th');
    });
  });

  describe('Language Setting', () => {
    beforeEach(() => {
      // Mock initial translation load
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
    });

    it('should set language and load translations', () => {
      service.setLanguage('en').subscribe(() => {
        expect(service.currentLanguage).toBe('en');
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          environment.storage.languageKey,
          'en'
        );
      });

      const req = httpMock.expectOne('/assets/i18n/en.json');
      req.flush(MOCK_TRANSLATION_DATA.en);
    });

    it('should return cached translations when setting same language', () => {
      service.setLanguage('th').subscribe(translations => {
        expect(translations).toEqual(MOCK_TRANSLATION_DATA.th);
      });

      // Should not make HTTP request since it's the same language
      httpMock.expectNone('/assets/i18n/th.json');
    });

    it('should update document language attributes', () => {
      spyOnProperty(document, 'documentElement', 'get').and.returnValue({
        lang: '',
        dir: ''
      } as any);

      service.setLanguage('en').subscribe(() => {
        expect(document.documentElement.lang).toBe('en');
        expect(document.documentElement.dir).toBe('ltr');
      });

      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);
    });

    it('should handle failed translation loading', () => {
      spyOn(console, 'error');

      service.setLanguage('en').subscribe(translations => {
        expect(translations).toEqual({});
        expect(console.error).toHaveBeenCalled();
      });

      const req = httpMock.expectOne('/assets/i18n/en.json');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('Translation', () => {
    beforeEach(() => {
      // Set up service with both languages loaded
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
      
      service.setLanguage('en').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);
    });

    it('should translate simple keys', () => {
      expect(service.translate('common.save')).toBe('Save');
      
      service.setLanguage('th').subscribe();
      expect(service.translate('common.save')).toBe('บันทึก');
    });

    it('should translate nested keys', () => {
      expect(service.translate('auth.login')).toBe('Login');
      
      service.setLanguage('th').subscribe();
      expect(service.translate('auth.login')).toBe('เข้าสู่ระบบ');
    });

    it('should return key when translation not found', () => {
      spyOn(console, 'warn');
      
      const result = service.translate('non.existing.key');
      
      expect(result).toBe('non.existing.key');
      expect(console.warn).toHaveBeenCalledWith('Translation not found for key: non.existing.key');
    });

    it('should fallback to English when Thai translation not found', () => {
      service.setLanguage('th').subscribe();
      
      // Simulate missing Thai translation
      (service as any).translations.set('th', {});
      
      const result = service.translate('common.save');
      expect(result).toBe('Save'); // Should fallback to English
    });

    it('should replace parameters in translations', () => {
      // Add parameterized translation to mock data
      const mockTranslations = { ...MOCK_TRANSLATION_DATA.en };
      mockTranslations['welcome.message'] = 'Welcome, {{name}}!';
      (service as any).translations.set('en', mockTranslations);

      const result = service.translate('welcome.message', { name: 'John' });
      expect(result).toBe('Welcome, John!');
    });

    it('should handle multiple parameters', () => {
      const mockTranslations = { ...MOCK_TRANSLATION_DATA.en };
      mockTranslations['notification.message'] = 'Hello {{name}}, you have {{count}} messages';
      (service as any).translations.set('en', mockTranslations);

      const result = service.translate('notification.message', { name: 'John', count: '5' });
      expect(result).toBe('Hello John, you have 5 messages');
    });
  });

  describe('Translation Observables', () => {
    beforeEach(() => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
    });

    it('should return translation as observable', () => {
      service.get('common.save').subscribe(translation => {
        expect(translation).toBe('บันทึก');
      });
    });

    it('should update observable when language changes', () => {
      let translationValue = '';
      
      service.get('common.save').subscribe(translation => {
        translationValue = translation;
      });

      expect(translationValue).toBe('บันทึก');

      service.setLanguage('en').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);

      expect(translationValue).toBe('Save');
    });

    it('should return instant translation', () => {
      const result = service.instant('common.save');
      expect(result).toBe('บันทึก');
    });
  });

  describe('Language Toggle', () => {
    beforeEach(() => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
    });

    it('should toggle from Thai to English', () => {
      service.toggleLanguage().subscribe(() => {
        expect(service.currentLanguage).toBe('en');
      });

      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);
    });

    it('should toggle from English to Thai', () => {
      service.setLanguage('en').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);

      service.toggleLanguage().subscribe(() => {
        expect(service.currentLanguage).toBe('th');
      });

      // Should use cached Thai translations, no HTTP request expected
    });
  });

  describe('Supported Languages', () => {
    it('should return correct supported languages', () => {
      const languages = service.getSupportedLanguages();
      
      expect(languages).toEqual([
        { code: 'th', name: 'Thai', nativeName: 'ไทย' },
        { code: 'en', name: 'English', nativeName: 'English' }
      ]);
    });

    it('should correctly identify Thai language', () => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
      
      expect(service.isThaiLanguage()).toBeTrue();
      expect(service.isEnglishLanguage()).toBeFalse();
    });

    it('should correctly identify English language', () => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
      
      service.setLanguage('en').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);

      expect(service.isThaiLanguage()).toBeFalse();
      expect(service.isEnglishLanguage()).toBeTrue();
    });
  });

  describe('Formatting Methods', () => {
    beforeEach(() => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
    });

    it('should format number according to current locale', () => {
      const number = 1234567.89;
      
      // Thai locale
      let formatted = service.formatNumber(number);
      expect(formatted).toContain('1,234,567.89'); // Thai uses same number format as English

      // English locale
      service.setLanguage('en').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);
      
      formatted = service.formatNumber(number);
      expect(formatted).toContain('1,234,567.89');
    });

    it('should format currency in Thai Baht', () => {
      const amount = 1000;
      
      const formatted = service.formatCurrency(amount);
      expect(formatted).toContain('1,000');
      expect(formatted).toContain('฿');
    });

    it('should format date according to current locale', () => {
      const date = new Date('2024-01-15');
      
      const formatted = service.formatDate(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format datetime according to current locale', () => {
      const date = new Date('2024-01-15T10:30:00');
      
      const formatted = service.formatDateTime(date);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle string dates in formatting', () => {
      const dateString = '2024-01-15';
      
      expect(() => service.formatDate(dateString)).not.toThrow();
      expect(() => service.formatDateTime(dateString)).not.toThrow();
    });

    it('should use custom formatting options', () => {
      const date = new Date('2024-01-15');
      const options: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      };
      
      const formatted = service.formatDate(date, options);
      expect(formatted).toBeTruthy();
    });
  });

  describe('Current Language Observable', () => {
    beforeEach(() => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
    });

    it('should emit current language changes', () => {
      let currentLang: SupportedLanguage | null = null;
      
      service.currentLanguage$.subscribe(lang => {
        currentLang = lang;
      });

      expect(currentLang).toBe('th');

      service.setLanguage('en').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);

      expect(currentLang).toBe('en');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
    });

    it('should handle empty translation keys', () => {
      const result = service.translate('');
      expect(result).toBe('');
    });

    it('should handle null/undefined parameters', () => {
      expect(() => service.translate('common.save', undefined)).not.toThrow();
      expect(() => service.translate('common.save', null as any)).not.toThrow();
    });

    it('should handle nested translation keys with missing intermediate objects', () => {
      const result = service.translate('missing.nested.key');
      expect(result).toBe('missing.nested.key');
    });

    it('should prevent duplicate loading of same language', () => {
      // Trigger multiple loads of the same language
      service.setLanguage('en').subscribe();
      service.setLanguage('en').subscribe();
      service.setLanguage('en').subscribe();

      // Only one HTTP request should be made
      httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);
    });

    it('should handle missing document object', () => {
      const originalDocument = (global as any).document;
      (global as any).document = undefined;

      expect(() => {
        service.setLanguage('en').subscribe();
        httpMock.expectOne('/assets/i18n/en.json').flush(MOCK_TRANSLATION_DATA.en);
      }).not.toThrow();

      (global as any).document = originalDocument;
    });

    it('should handle missing navigator object', () => {
      const originalNavigator = (global as any).navigator;
      (global as any).navigator = undefined;

      expect(() => {
        TestBed.inject(TranslationService);
        httpMock.expectOne('/assets/i18n/th.json').flush(MOCK_TRANSLATION_DATA.th);
      }).not.toThrow();

      (global as any).navigator = originalNavigator;
    });
  });
});