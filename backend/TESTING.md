# Thai Auto Insurance Backend - Testing Documentation

## Overview

This document provides comprehensive information about the testing strategy, test structure, and execution procedures for the Thai Auto Insurance Backend application.

## Test Structure

### Directory Structure

```
src/test/java/com/thaiinsurance/autoinsurance/
├── unit/                           # Unit tests
│   ├── controller/                 # Controller layer tests with MockMvc
│   │   ├── AuthControllerTest.java
│   │   ├── CustomerControllerTest.java
│   │   ├── PolicyControllerTest.java
│   │   └── ClaimsControllerTest.java
│   ├── service/                    # Service layer tests with mocked dependencies
│   │   ├── CustomerServiceTest.java
│   │   ├── PolicyServiceTest.java
│   │   ├── ClaimsServiceTest.java
│   │   └── AuthServiceTest.java
│   ├── repository/                 # Repository tests with @DataJpaTest
│   │   ├── CustomerRepositoryTest.java
│   │   ├── PolicyRepositoryTest.java
│   │   └── ClaimsRepositoryTest.java
│   └── util/                       # Utility class tests
│       ├── ThaiValidationUtilTest.java
│       └── DateUtilTest.java
├── integration/                    # Integration tests
│   ├── api/                        # End-to-end API tests
│   │   ├── CustomerAPIIntegrationTest.java
│   │   ├── PolicyAPIIntegrationTest.java
│   │   └── AuthenticationFlowTest.java
│   ├── database/                   # Database integration tests
│   │   ├── DatabaseMigrationTest.java
│   │   └── TransactionTest.java
│   └── security/                   # Security integration tests
│       └── SecurityIntegrationTest.java
├── resources/                      # Test resources
│   ├── application-test.yml        # Test configuration
│   ├── test-data.sql              # Test data fixtures
│   └── test-containers/           # TestContainers configuration
├── BaseIntegrationTest.java       # Base class for integration tests
├── TestDataHelper.java            # Test data creation utilities
└── TestSuiteRunner.java          # Complete test suite runner
```

## Test Categories

### 1. Unit Tests

#### Controller Tests (`@WebMvcTest`)
- **Purpose**: Test REST endpoints with MockMvc
- **Focus**: Request/response handling, validation, security
- **Mock**: Service layer dependencies
- **Coverage**: All HTTP methods, error handling, authorization

**Example Test Structure:**
```java
@WebMvcTest(CustomerController.class)
class CustomerControllerTest {
    @Test
    @WithMockUser(roles = "AGENT")
    void shouldCreateCustomerWithValidData() {
        // Test implementation
    }
}
```

#### Service Tests (`@ExtendWith(MockitoExtension.class)`)
- **Purpose**: Test business logic with mocked dependencies
- **Focus**: Business rules, Thai validations, error handling
- **Mock**: Repository and external service dependencies
- **Coverage**: All business scenarios, edge cases, exceptions

#### Repository Tests (`@DataJpaTest`)
- **Purpose**: Test data access with real database
- **Focus**: CRUD operations, queries, constraints
- **Database**: H2 in-memory for fast execution
- **Coverage**: Custom queries, relationships, indexes

#### Utility Tests (`@ExtendWith(MockitoExtension.class)`)
- **Purpose**: Test utility functions and Thai-specific validations
- **Focus**: Thai National ID checksum, phone formats, postal codes
- **Coverage**: Valid/invalid inputs, edge cases, formatting

### 2. Integration Tests

#### API Integration Tests (`@SpringBootTest`)
- **Purpose**: End-to-end API testing with real database
- **Focus**: Complete request-response cycle
- **Database**: TestContainers PostgreSQL
- **Coverage**: Authentication flows, business workflows

#### Security Integration Tests
- **Purpose**: Security configuration and authentication
- **Focus**: JWT tokens, role-based access, input sanitization
- **Coverage**: Authentication, authorization, security headers

#### Database Integration Tests
- **Purpose**: Database schema and transaction testing
- **Focus**: Migrations, constraints, referential integrity
- **Database**: TestContainers PostgreSQL

## Thai-Specific Test Cases

### National ID Validation
```java
// Valid checksums (calculated using Thai algorithm)
"1101700207364", "1101700207372", "1101700207380"

// Invalid checksums
"1101700207365", "1101700207373"

// Format validation
"110170020736" (too short), "11017002073644" (too long)
```

### Phone Number Validation
```java
// Valid Thai mobile numbers
"0812345678" (AIS), "0898765432" (True), "0651234567" (DTAC)

// Invalid formats
"081234567" (too short), "0412345678" (invalid prefix)
```

### Postal Code Validation
```java
// Valid postal codes
"10110" (Bangkok), "50000" (Chiang Mai), "30000" (Nakhon Ratchasima)

// Invalid codes
"00000", "99999" (out of range), "1011" (too short)
```

### License Plate Validation
```java
// Valid Thai license plates
"กก 1234", "ABC 123", "1กข 234", "มท 4567"

// Format validation with Thai characters
```

## Test Data Management

### TestDataHelper.java
Provides realistic Thai context test data:
- Valid/invalid Thai National IDs with proper checksums
- Thai phone numbers with correct prefixes
- Thai addresses with valid postal codes
- Business entities with proper relationships

### Test Database Setup
```sql
-- Valid Thai customer data
INSERT INTO customers (national_id, first_name, last_name, phone_number) 
VALUES ('1234567890123', 'Somchai', 'Jaidee', '0812345678');

-- Thai vehicle data with license plates
INSERT INTO vehicles (license_plate, make, model) 
VALUES ('กก 1234', 'Toyota', 'Vios');
```

## Running Tests

### Prerequisites
```bash
# Ensure Docker is running for TestContainers
docker --version

# Install dependencies
mvn clean install
```

### Execute All Tests
```bash
# Run complete test suite
mvn test

# Run with coverage report
mvn test jacoco:report

# Run specific test suite
mvn test -Dtest=TestSuiteRunner
```

### Execute Specific Test Categories
```bash
# Unit tests only
mvn test -Dtest="com.thaiinsurance.autoinsurance.unit.**"

# Integration tests only  
mvn test -Dtest="com.thaiinsurance.autoinsurance.integration.**"

# Thai validation tests
mvn test -Dtest="ThaiValidationUtilTest"

# Security tests
mvn test -Dtest="SecurityIntegrationTest"

# Specific controller tests
mvn test -Dtest="CustomerControllerTest"
```

### Execute Tests by Tag
```bash
# Run tests with specific display names
mvn test -Dtest="**/*Test" -Dgroups="thai-validation"

# Run database tests
mvn test -Dtest="**/*Test" -Dgroups="database"
```

## Test Configuration

### Application Test Properties (`application-test.yml`)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;MODE=PostgreSQL
  jpa:
    hibernate:
      ddl-auto: create-drop
  
jwt:
  secret: test-secret-key
  expiration: 3600000

thai:
  validation:
    strict-mode: true
```

### TestContainers Configuration
```java
@Container
static PostgreSQLContainer<?> postgreSQLContainer = 
    new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("thai_insurance_test")
        .withUsername("test_user")
        .withPassword("test_password");
```

## Coverage Requirements

### Minimum Coverage Targets
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Coverage by Layer
- **Controllers**: 85% (high user-facing impact)
- **Services**: 90% (critical business logic)
- **Repositories**: 70% (simpler CRUD operations)
- **Utils**: 95% (pure functions, easy to test)

### Generate Coverage Report
```bash
# Generate JaCoCo coverage report
mvn clean test jacoco:report

# View report
open target/site/jacoco/index.html
```

## Performance Testing

### Test Performance Targets
- **Unit tests**: <100ms each
- **Integration tests**: <5s each
- **Full test suite**: <10 minutes

### Database Performance
- Repository tests use H2 in-memory for speed
- Integration tests use TestContainers for accuracy
- Connection pooling configured for parallel execution

## Best Practices

### 1. Test Naming
```java
@DisplayName("Should validate correct Thai National ID with valid checksum")
void shouldValidateCorrectThaiNationalId() {
    // Test implementation
}
```

### 2. Test Structure (Arrange-Act-Assert)
```java
@Test
void shouldCreateCustomerWithValidData() {
    // Arrange
    Customer customer = TestDataHelper.createValidCustomer();
    when(customerRepository.save(any())).thenReturn(customer);
    
    // Act
    Customer result = customerService.createCustomer(customer);
    
    // Assert
    assertNotNull(result);
    verify(customerRepository).save(customer);
}
```

### 3. Mock Management
```java
@MockBean
private CustomerService customerService;

@BeforeEach
void setUp() {
    reset(customerService); // Clear previous interactions
}
```

### 4. Exception Testing
```java
@Test
void shouldThrowExceptionForInvalidNationalId() {
    Customer customer = TestDataHelper.createInvalidCustomer();
    
    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> customerService.createCustomer(customer)
    );
    
    assertEquals("Invalid Thai National ID", exception.getMessage());
}
```

### 5. Parametrized Tests
```java
@ParameterizedTest
@ValueSource(strings = {"0812345678", "0898765432", "0651234567"})
void shouldValidateValidThaiPhoneNumbers(String phoneNumber) {
    assertTrue(ThaiValidationUtil.isValidThaiPhoneNumber(phoneNumber));
}
```

## Continuous Integration

### GitHub Actions Configuration
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '17'
      - run: mvn test
      - uses: codecov/codecov-action@v1
```

### Pre-commit Hooks
```bash
#!/bin/sh
# Run tests before commit
mvn test -q
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

## Troubleshooting

### Common Issues

#### TestContainers Issues
```bash
# Ensure Docker is running
docker ps

# Check Docker resources
docker system df
```

#### H2 Database Issues
```bash
# Check H2 compatibility mode
spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL
```

#### JWT Token Issues
```bash
# Verify test JWT configuration
jwt.secret: test-secret-key-minimum-32-characters
```

#### Thai Character Encoding
```bash
# Ensure UTF-8 encoding
-Dfile.encoding=UTF-8
```

### Performance Issues
```bash
# Increase memory for tests
export MAVEN_OPTS="-Xmx2048m -XX:MaxPermSize=512m"

# Parallel test execution
mvn test -T 4
```

## Test Reports

### Surefire Reports
- Location: `target/surefire-reports/`
- Format: XML, TXT, HTML
- Integration: CI/CD pipelines

### JaCoCo Coverage Reports
- Location: `target/site/jacoco/`
- Format: HTML, XML, CSV
- Integration: Code coverage services

### Custom Test Reports
```java
// Generate custom Thai validation report
@TestReporter
public class ThaiValidationReporter {
    public void generateReport(TestResults results) {
        // Custom reporting logic
    }
}
```

## Security Testing

### Input Validation Tests
- SQL injection prevention
- XSS attack prevention  
- Input length limitations
- Thai character handling

### Authentication Tests
- JWT token validation
- Password hashing verification
- Session management
- Role-based access control

### Authorization Tests
- Endpoint access controls
- Resource ownership validation
- Cross-tenant data isolation
- Admin privilege escalation

## Conclusion

This comprehensive testing strategy ensures:
- **High Code Quality**: 80%+ coverage across all layers
- **Thai Context Accuracy**: Proper validation of Thai-specific data
- **Security Assurance**: Comprehensive security testing
- **Performance**: Fast test execution for development feedback
- **Reliability**: Consistent test results across environments

The test suite serves as both quality assurance and documentation of the system's behavior, with special attention to Thai insurance business requirements and regulations.