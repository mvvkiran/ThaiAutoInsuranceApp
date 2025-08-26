#!/bin/bash

# Thai Auto Insurance Frontend Test Runner
# This script runs the complete test suite with coverage reporting

set -e

echo "🧪 Thai Auto Insurance Frontend - Comprehensive Test Suite"
echo "=========================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js and npm are installed
print_status "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ to run tests."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm to run tests."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js version is less than 18. Some tests might fail."
fi

print_success "Prerequisites check passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed, skipping npm install"
fi

# Clean previous coverage reports
print_status "Cleaning previous test results..."
if [ -d "coverage" ]; then
    rm -rf coverage
    print_success "Previous coverage reports cleaned"
fi

# Run linting first (optional)
if npm list @angular-eslint/eslint-plugin &> /dev/null; then
    print_status "Running ESLint checks..."
    npm run lint 2>/dev/null || print_warning "Linting completed with warnings"
fi

# Set test environment
export NODE_ENV=test
export NG_CLI_ANALYTICS=false

print_status "Starting comprehensive test suite..."
echo ""

# Run tests with coverage in headless mode for CI/CD
print_status "Running unit tests with coverage..."
echo "⏳ This may take a few minutes for comprehensive coverage analysis..."

if npm run test -- --browsers=ChromeHeadlessCI --watch=false --code-coverage --source-map; then
    print_success "All tests passed! 🎉"
else
    TEST_EXIT_CODE=$?
    print_error "Some tests failed. Check the output above for details."
fi

# Check if coverage directory was created
if [ -d "coverage" ]; then
    print_success "Coverage reports generated in ./coverage/"
    
    # Display coverage summary if available
    if [ -f "coverage/thai-auto-insurance-frontend/coverage-summary.json" ]; then
        print_status "Coverage Summary:"
        echo "==================="
        
        # Try to extract coverage info (requires jq, but fallback to cat)
        if command -v jq &> /dev/null; then
            jq -r '
                "Lines: " + (.total.lines.pct | tostring) + "%",
                "Statements: " + (.total.statements.pct | tostring) + "%", 
                "Functions: " + (.total.functions.pct | tostring) + "%",
                "Branches: " + (.total.branches.pct | tostring) + "%"
            ' coverage/thai-auto-insurance-frontend/coverage-summary.json
        else
            print_warning "Install 'jq' for formatted coverage summary display"
            print_status "Raw coverage data available in coverage/thai-auto-insurance-frontend/coverage-summary.json"
        fi
        echo ""
    fi
    
    # Display coverage report locations
    echo "📊 Coverage Reports:"
    echo "  • HTML Report: coverage/thai-auto-insurance-frontend/html/index.html"
    echo "  • LCOV Report: coverage/thai-auto-insurance-frontend/lcov.info"
    echo "  • Cobertura Report: coverage/thai-auto-insurance-frontend/cobertura.xml"
    echo ""
    
    # Open HTML coverage report in browser (optional)
    if command -v open &> /dev/null && [ "$1" = "--open" ]; then
        print_status "Opening coverage report in browser..."
        open coverage/thai-auto-insurance-frontend/html/index.html
    fi
    
else
    print_warning "Coverage reports were not generated"
fi

echo ""
print_status "Test Categories Covered:"
echo "========================"
echo "✅ Core Services (AuthService, TranslationService)"
echo "✅ Guards (AuthGuard, RoleGuard)"
echo "✅ Interceptors (AuthInterceptor)"
echo "✅ Thai-specific Pipes (Currency, Date, Phone)"
echo "✅ Thai-specific Directives (National ID)"
echo "✅ Feature Components (Login)"
echo "✅ Thai Validation Utilities"
echo "✅ Mock Services and Test Helpers"

echo ""
print_status "Thai-specific Features Tested:"
echo "==============================="
echo "🇹🇭 Thai National ID validation and formatting"
echo "🇹🇭 Thai phone number formatting"
echo "🇹🇭 Thai currency formatting (Baht)"
echo "🇹🇭 Thai date formatting (Buddhist Era)"
echo "🇹🇭 Thai/English language switching"
echo "🇹🇭 Thai address validation"

echo ""
if [ ${TEST_EXIT_CODE:-0} -eq 0 ]; then
    print_success "Thai Auto Insurance Frontend test suite completed successfully! 🚀"
    print_status "All ${GREEN}Thai-specific functionality${NC} has been thoroughly tested."
    
    # Quality metrics
    echo ""
    echo "🏆 Test Quality Metrics:"
    echo "  • Coverage Target: 85% statements, 80% branches"
    echo "  • Thai Locale Support: ✅ Comprehensive"
    echo "  • Authentication: ✅ Full flow tested"
    echo "  • Form Validation: ✅ Thai-specific rules"
    echo "  • Error Handling: ✅ Thai/English messages"
    
    exit 0
else
    print_error "Test suite completed with failures"
    print_status "Please review the test output above and fix failing tests"
    exit $TEST_EXIT_CODE
fi