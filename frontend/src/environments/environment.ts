export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  version: '1.0.0',
  appName: 'Thai Auto Insurance',
  supportedLanguages: ['th', 'en'],
  defaultLanguage: 'th',
  features: {
    enablePWA: false,
    enableAnalytics: false,
    enableServiceWorker: false,
    enableDebugMode: true,
    enableMockData: true
  },
  external: {
    googleMapsApiKey: '', // Set via environment variable
    firebaseConfig: null, // Optional: for push notifications
    sentryDsn: '' // Optional: for error tracking
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  storage: {
    tokenKey: 'thai_auto_insurance_token',
    userKey: 'thai_auto_insurance_user',
    languageKey: 'thai_auto_insurance_lang'
  }
};