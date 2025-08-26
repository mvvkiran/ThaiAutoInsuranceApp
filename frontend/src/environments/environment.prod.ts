export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.thaiinsurance.com/api',
  version: '1.0.0',
  appName: 'Thai Auto Insurance',
  supportedLanguages: ['th', 'en'],
  defaultLanguage: 'th',
  features: {
    enablePWA: true,
    enableAnalytics: true,
    enableServiceWorker: true,
    enableDebugMode: false,
    enableMockData: false
  },
  external: {
    googleMapsApiKey: process.env['GOOGLE_MAPS_API_KEY'] || '',
    firebaseConfig: process.env['FIREBASE_CONFIG'] ? JSON.parse(process.env['FIREBASE_CONFIG']) : null,
    sentryDsn: process.env['SENTRY_DSN'] || ''
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