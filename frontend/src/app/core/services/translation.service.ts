import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type SupportedLanguage = 'th' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('th');
  private translations = new Map<SupportedLanguage, any>();
  private loadingTranslations = new Set<SupportedLanguage>();

  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  get currentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  /**
   * Set the current language and load translations if not already loaded
   */
  setLanguage(language: SupportedLanguage): Observable<any> {
    if (language === this.currentLanguage) {
      return of(this.translations.get(language) || {});
    }

    return this.loadTranslations(language).pipe(
      tap(() => {
        this.currentLanguageSubject.next(language);
        this.saveLanguagePreference(language);
        this.updateDocumentLanguage(language);
      })
    );
  }

  /**
   * Get translation for a key
   */
  translate(key: string, params?: { [key: string]: any }): string {
    const currentTranslations = this.translations.get(this.currentLanguage) || {};
    let translation = this.getNestedValue(currentTranslations, key);

    if (!translation) {
      // Fallback to English if Thai translation not found
      if (this.currentLanguage === 'th') {
        const englishTranslations = this.translations.get('en') || {};
        translation = this.getNestedValue(englishTranslations, key);
      }
      
      // If still not found, return the key itself
      if (!translation) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    // Replace parameters in translation
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        const placeholder = new RegExp(`{{\\s*${param}\\s*}}`, 'g');
        translation = translation.replace(placeholder, params[param]);
      });
    }

    return translation;
  }

  /**
   * Get translation as observable (useful for templates)
   */
  get(key: string, params?: { [key: string]: any }): Observable<string> {
    return this.currentLanguage$.pipe(
      map(() => this.translate(key, params))
    );
  }

  /**
   * Get instant translation (synchronous)
   */
  instant(key: string, params?: { [key: string]: any }): string {
    return this.translate(key, params);
  }

  /**
   * Load translations for a specific language
   */
  private loadTranslations(language: SupportedLanguage): Observable<any> {
    // Avoid duplicate loading
    if (this.loadingTranslations.has(language)) {
      return new BehaviorSubject(this.translations.get(language) || {}).asObservable();
    }

    // Return cached translations if available
    if (this.translations.has(language)) {
      return of(this.translations.get(language));
    }

    this.loadingTranslations.add(language);

    return this.http.get(`/assets/i18n/${language}.json`).pipe(
      tap(translations => {
        this.translations.set(language, translations);
        this.loadingTranslations.delete(language);
      }),
      catchError(error => {
        console.error(`Failed to load translations for ${language}:`, error);
        this.loadingTranslations.delete(language);
        
        // Return empty object as fallback
        const fallbackTranslations = {};
        this.translations.set(language, fallbackTranslations);
        return of(fallbackTranslations);
      })
    );
  }

  /**
   * Initialize language from localStorage or browser preference
   */
  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem(environment.storage.languageKey);
    const browserLanguage = this.getBrowserLanguage();
    const defaultLanguage = environment.defaultLanguage as SupportedLanguage;

    let targetLanguage: SupportedLanguage;

    if (savedLanguage && this.isSupportedLanguage(savedLanguage)) {
      targetLanguage = savedLanguage as SupportedLanguage;
    } else if (this.isSupportedLanguage(browserLanguage)) {
      targetLanguage = browserLanguage as SupportedLanguage;
    } else {
      targetLanguage = defaultLanguage;
    }

    // Load initial translations
    this.loadTranslations(targetLanguage).subscribe(() => {
      this.currentLanguageSubject.next(targetLanguage);
      this.updateDocumentLanguage(targetLanguage);
    });
  }

  /**
   * Get browser language
   */
  private getBrowserLanguage(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.language?.split('-')[0] || 'en';
    }
    return 'en';
  }

  /**
   * Check if language is supported
   */
  private isSupportedLanguage(language: string): boolean {
    return environment.supportedLanguages.includes(language);
  }

  /**
   * Save language preference to localStorage
   */
  private saveLanguagePreference(language: SupportedLanguage): void {
    localStorage.setItem(environment.storage.languageKey, language);
  }

  /**
   * Update document language attribute and direction
   */
  private updateDocumentLanguage(language: SupportedLanguage): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      // Thai is LTR, but in case we add RTL languages in the future
      document.documentElement.dir = 'ltr';
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((current, prop) => {
      return current?.[prop];
    }, obj);
  }

  /**
   * Toggle between Thai and English
   */
  toggleLanguage(): Observable<any> {
    const newLanguage: SupportedLanguage = this.currentLanguage === 'th' ? 'en' : 'th';
    return this.setLanguage(newLanguage);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): Array<{ code: SupportedLanguage; name: string; nativeName: string }> {
    return [
      { code: 'th', name: 'Thai', nativeName: 'ไทย' },
      { code: 'en', name: 'English', nativeName: 'English' }
    ];
  }

  /**
   * Check if current language is Thai
   */
  isThaiLanguage(): boolean {
    return this.currentLanguage === 'th';
  }

  /**
   * Check if current language is English
   */
  isEnglishLanguage(): boolean {
    return this.currentLanguage === 'en';
  }

  /**
   * Format number according to current locale
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(value);
  }

  /**
   * Format currency in Thai Baht
   */
  formatCurrency(value: number): string {
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Format date according to current locale
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
  }

  /**
   * Format date time according to current locale
   */
  formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.currentLanguage === 'th' ? 'th-TH' : 'en-US';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
  }
}