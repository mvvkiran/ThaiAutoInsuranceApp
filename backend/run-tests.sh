#!/bin/bash

# Thai Auto Insurance Backend - Test Execution Script
# This script runs all test categories and generates comprehensive reports

set -e

echo "🚀 Starting Thai Auto Insurance Backend Test Suite"
echo "================================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if Docker is running (for TestContainers)
if ! docker info &> /dev/null; then
    echo "⚠️  Warning: Docker is not running. Integration tests may fail."
    echo "   Please start Docker for TestContainers support."
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | grep version | cut -d'"' -f2 | cut -d'.' -f1-2)
echo "☕ Java Version: $JAVA_VERSION"

if [[ "$JAVA_VERSION" < "17" ]]; then
    echo "❌ Java 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Clean and compile
echo "🧹 Cleaning and compiling..."
mvn clean compile test-compile -q

echo "✅ Compilation successful"
echo ""

# Function to run tests with timing
run_test_category() {
    local category=$1
    local description=$2
    local test_pattern=$3
    
    echo "🧪 Running $description..."
    start_time=$(date +%s)
    
    if mvn test -Dtest="$test_pattern" -q; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "✅ $description completed in ${duration}s"
    else
        echo "❌ $description failed!"
        return 1
    fi
    echo ""
}

# Run test categories
echo "🎯 Executing Test Categories"
echo "========================="

# 1. Utility Tests (Thai Validation)
run_test_category "utility" "Thai Validation Utility Tests" "ThaiValidationUtilTest"

# 2. Unit Tests - Service Layer
run_test_category "service" "Service Layer Unit Tests" "**/*ServiceTest"

# 3. Unit Tests - Repository Layer  
run_test_category "repository" "Repository Layer Tests" "**/*RepositoryTest"

# 4. Unit Tests - Controller Layer
run_test_category "controller" "Controller Layer Tests" "**/*ControllerTest"

# 5. Integration Tests - API
run_test_category "api" "API Integration Tests" "**/*APIIntegrationTest"

# 6. Integration Tests - Database
run_test_category "database" "Database Integration Tests" "**/*DatabaseIntegrationTest"

# 7. Security Tests
run_test_category "security" "Security Integration Tests" "SecurityIntegrationTest"

# 8. Complete Test Suite
echo "🎯 Running Complete Test Suite..."
start_time=$(date +%s)

if mvn test -Dtest="TestSuiteRunner" -q; then
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    echo "✅ Complete test suite passed in ${duration}s"
else
    echo "❌ Complete test suite failed!"
    exit 1
fi
echo ""

# Generate test reports
echo "📊 Generating Test Reports..."
echo "============================"

# JaCoCo Coverage Report
echo "📈 Generating code coverage report..."
if mvn jacoco:report -q; then
    echo "✅ Coverage report generated: target/site/jacoco/index.html"
else
    echo "⚠️  Coverage report generation failed"
fi

# Surefire Test Report
if [ -d "target/surefire-reports" ]; then
    test_count=$(find target/surefire-reports -name "TEST-*.xml" | wc -l)
    echo "📋 Test reports generated: $test_count test files in target/surefire-reports/"
else
    echo "⚠️  No Surefire reports found"
fi

echo ""

# Test Summary
echo "📋 Test Execution Summary"
echo "========================="

# Count test results from Surefire reports
if [ -d "target/surefire-reports" ]; then
    total_tests=0
    failed_tests=0
    skipped_tests=0
    
    for file in target/surefire-reports/TEST-*.xml; do
        if [ -f "$file" ]; then
            tests=$(grep -o 'tests="[0-9]*"' "$file" | cut -d'"' -f2)
            failures=$(grep -o 'failures="[0-9]*"' "$file" | cut -d'"' -f2)
            errors=$(grep -o 'errors="[0-9]*"' "$file" | cut -d'"' -f2)
            skipped=$(grep -o 'skipped="[0-9]*"' "$file" | cut -d'"' -f2)
            
            total_tests=$((total_tests + tests))
            failed_tests=$((failed_tests + failures + errors))
            skipped_tests=$((skipped_tests + skipped))
        fi
    done
    
    passed_tests=$((total_tests - failed_tests - skipped_tests))
    
    echo "📊 Total Tests: $total_tests"
    echo "✅ Passed: $passed_tests"
    echo "❌ Failed: $failed_tests" 
    echo "⏭️  Skipped: $skipped_tests"
    
    if [ $failed_tests -eq 0 ]; then
        echo ""
        echo "🎉 All tests passed! Great job!"
        echo ""
        echo "📊 View detailed reports:"
        echo "   Coverage: target/site/jacoco/index.html"
        echo "   Tests: target/surefire-reports/"
    else
        echo ""
        echo "❌ Some tests failed. Please check the reports for details."
        exit 1
    fi
else
    echo "⚠️  Could not generate test summary - no reports found"
fi

# Coverage summary (if available)
if [ -f "target/site/jacoco/index.html" ]; then
    echo ""
    echo "📈 Coverage Report Available"
    echo "   Open: target/site/jacoco/index.html"
    
    # Try to extract coverage percentage from HTML (basic parsing)
    if command -v grep &> /dev/null && command -v sed &> /dev/null; then
        coverage=$(grep -o "Total.*[0-9]*%" target/site/jacoco/index.html | tail -1 | grep -o "[0-9]*%" | tail -1 2>/dev/null || echo "N/A")
        if [ "$coverage" != "N/A" ]; then
            echo "   Overall Coverage: $coverage"
        fi
    fi
fi

echo ""
echo "🎯 Thai Auto Insurance Backend - All Tests Completed Successfully!"
echo "================================================================="

# Optional: Open reports in browser (macOS/Linux)
if [ "$1" = "--open-reports" ]; then
    echo "🌐 Opening reports in browser..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        [ -f "target/site/jacoco/index.html" ] && open target/site/jacoco/index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        [ -f "target/site/jacoco/index.html" ] && xdg-open target/site/jacoco/index.html
    fi
fi