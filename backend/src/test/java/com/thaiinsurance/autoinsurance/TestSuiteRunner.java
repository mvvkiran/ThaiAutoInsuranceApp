package com.thaiinsurance.autoinsurance;

import org.junit.platform.suite.api.IncludePackages;
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

/**
 * Comprehensive Test Suite Runner for Thai Auto Insurance Application
 * 
 * This suite runs all test categories:
 * - Unit Tests (util, service, repository, controller layers)
 * - Integration Tests (API, database, security)
 * - Thai-specific validation tests
 * - Security and authentication tests
 */
@Suite
@SuiteDisplayName("Thai Auto Insurance Backend - Complete Test Suite")
@SelectPackages({
    "com.thaiinsurance.autoinsurance.unit",
    "com.thaiinsurance.autoinsurance.integration"
})
@IncludePackages({
    "com.thaiinsurance.autoinsurance.unit.util",
    "com.thaiinsurance.autoinsurance.unit.service", 
    "com.thaiinsurance.autoinsurance.unit.repository",
    "com.thaiinsurance.autoinsurance.unit.controller",
    "com.thaiinsurance.autoinsurance.integration.api",
    "com.thaiinsurance.autoinsurance.integration.security",
    "com.thaiinsurance.autoinsurance.integration.database"
})
public class TestSuiteRunner {
    
    // This class serves as an entry point for running all tests
    // Use: mvn test -Dtest=TestSuiteRunner
    
}