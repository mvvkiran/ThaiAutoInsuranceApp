// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Configure Jasmine for comprehensive testing
        random: false, // Disable random execution for predictable test runs
        failFast: false, // Run all tests even if some fail
        oneFailurePerSpec: false, // Show all failures per spec
        timeoutInterval: 10000, // 10 second timeout for async tests
        // Configure spec reporter for better output
        spec: {
          displayPending: true,
          displaySuccessful: true,
          displayFailures: true
        }
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: true // Capture console output in tests
    },
    jasmineHtmlReporter: {
      suppressAll: false, // Show all test details for debugging
      suppressFailed: false // Show failed test details
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/thai-auto-insurance-frontend'),
      subdir: '.',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' }
      ],
      // Enhanced coverage thresholds for comprehensive testing
      check: {
        global: {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85
        },
        each: {
          statements: 75,
          branches: 70,
          functions: 75,
          lines: 75,
          excludes: [
            // Exclude test files from coverage
            '**/*.spec.ts',
            '**/*.mock.ts',
            '**/test-*.ts',
            // Exclude environment files
            '**/environments/**',
            // Exclude main.ts and polyfills
            '**/main.ts',
            '**/polyfills.ts'
          ]
        }
      },
      // Include all source files for accurate coverage reporting
      includeAllSources: true,
      // Source map support for better debugging
      sourceMap: true,
      // Instrument code for coverage
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },
    // Enhanced reporting for comprehensive test results
    reporters: ['progress', 'kjhtml', 'coverage'],
    
    // Network configuration
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    
    // Watch configuration for development
    autoWatch: true,
    restartOnFileChange: true,
    
    // Browser configuration
    browsers: ['Chrome'],
    
    // Timeouts for comprehensive test suites
    browserNoActivityTimeout: 60000, // 60 seconds
    browserDisconnectTimeout: 10000, // 10 seconds
    browserDisconnectTolerance: 3, // Retry 3 times
    captureTimeout: 60000, // 60 seconds to capture browser
    
    // Single run for CI/CD
    singleRun: false,
    
    // Custom launchers for different environments
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--remote-debugging-port=9222',
          '--window-size=1920,1080'
        ]
      },
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333'],
        debug: true
      },
      FirefoxHeadless: {
        base: 'FirefoxHeadless',
        prefs: {
          'network.proxy.type': 0
        }
      }
    },
    
    // File patterns for test discovery
    files: [
      // Test setup files
      { pattern: 'src/test-setup.ts', watched: false },
      // Polyfills for older browsers
      { pattern: 'src/polyfills.ts', watched: false }
    ],
    
    // Preprocessing
    preprocessors: {
      // Add coverage instrumentation
      'src/**/*.ts': ['coverage']
    },
    
    // Mime type configuration
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    
    // Performance optimization
    webpack: {
      // Optimize webpack for testing
      mode: 'development',
      devtool: 'inline-source-map'
    }
  });
};