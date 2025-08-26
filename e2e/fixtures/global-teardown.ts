import { FullConfig } from '@playwright/test';

/**
 * Global Teardown for Thai Auto Insurance E2E Tests
 * 
 * Cleans up after all tests complete:
 * - Removes test data from database
 * - Cleans up temporary files
 * - Generates final test report
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Global Teardown...');
  
  try {
    // Clean up test data from database
    await cleanupTestData();
    
    // Clean up temporary files (optional - keep for debugging)
    // await cleanupTempFiles();
    
    // Generate summary report
    await generateSummaryReport();
    
    console.log('✅ Global Teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global Teardown failed:', error);
    // Don't throw error to avoid masking test failures
  }
}

async function cleanupTestData() {
  console.log('🗑️ Cleaning up test data...');
  
  try {
    // Note: In a real scenario, you might want to preserve test data
    // for debugging failed tests, so this cleanup is optional
    
    // Example cleanup (commented out to preserve data)
    /*
    const response = await fetch('http://localhost:8080/api/test/cleanup', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn('⚠️ Failed to cleanup test data via API');
    }
    */
    
    console.log('✅ Test data cleanup completed (or skipped for debugging)');
    
  } catch (error) {
    console.warn('⚠️ Test data cleanup failed:', error);
  }
}

async function cleanupTempFiles() {
  console.log('🗑️ Cleaning up temporary files...');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Clean up screenshots from failed tests older than 7 days
    const testResultsDir = path.join(__dirname, '..', 'test-results');
    if (fs.existsSync(testResultsDir)) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      const files = fs.readdirSync(testResultsDir);
      files.forEach((file: string) => {
        const filePath = path.join(testResultsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted old file: ${file}`);
        }
      });
    }
    
    console.log('✅ Temporary files cleanup completed');
    
  } catch (error) {
    console.warn('⚠️ Temporary files cleanup failed:', error);
  }
}

async function generateSummaryReport() {
  console.log('📊 Generating test execution summary...');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const summaryData = {
      executionTime: new Date().toISOString(),
      timeZone: 'Asia/Bangkok',
      testEnvironment: {
        frontend: 'http://localhost:4200',
        backend: 'http://localhost:8080',
        locale: 'th-TH'
      },
      notes: [
        'Thai Auto Insurance Application E2E Test Execution Completed',
        'Authentication states preserved for next test run',
        'Test data available for debugging (not cleaned up)',
        'Check test-results/ directory for detailed reports'
      ]
    };
    
    const summaryPath = path.join(__dirname, '..', 'test-results', 'execution-summary.json');
    
    // Ensure directory exists
    const dir = path.dirname(summaryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2));
    
    console.log('✅ Test execution summary generated');
    console.log(`📁 Summary saved to: ${summaryPath}`);
    
  } catch (error) {
    console.warn('⚠️ Failed to generate summary report:', error);
  }
}

export default globalTeardown;