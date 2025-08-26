# Thai Auto Insurance Backend

A comprehensive Spring Boot backend application for managing auto insurance operations in Thailand. Built with modern Java technologies and designed specifically for the Thai insurance market.

## Features

### Core Functionality
- **Customer Management**: Complete customer lifecycle with Thai-specific validation
- **Vehicle Management**: Thai vehicle registration and DLT integration ready
- **Policy Management**: Support for CMI and voluntary insurance types
- **Claims Processing**: End-to-end claim workflow with document management
- **Payment Processing**: Multiple Thai payment methods including PromptPay
- **User Authentication**: JWT-based authentication with role-based access control

### Thai-Specific Features
- Thai National ID validation with checksum algorithm
- Thai phone number format validation
- Thai postal code validation
- Thai license plate format support
- THB currency handling
- Thai localization support (Thai names, addresses)
- Integration-ready for DLT (Department of Land Transport)

### Technical Features
- RESTful API design with OpenAPI documentation
- Spring Security with JWT authentication
- PostgreSQL database with Flyway migrations
- Comprehensive input validation and sanitization
- Audit trails and versioning
- Docker containerization
- Health checks and monitoring endpoints

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Java Version**: 17
- **Database**: PostgreSQL 17+
- **Security**: Spring Security with JWT
- **Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven
- **Containerization**: Docker

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 17+
- Docker (optional)

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auto-insurance-app/backend
```

### 2. Database Setup
```bash
# Create database
createdb thai_auto_insurance_dev

# Update database credentials in application-dev.yml
```

### 3. Build and Run
```bash
# Build the application
mvn clean install

# Run the application
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 4. Using Docker
```bash
# Build Docker image
docker build -t thai-auto-insurance-backend .

# Run with Docker Compose (recommended)
docker-compose up -d
```

## Configuration

### Environment Variables
```bash
# Database
DB_USERNAME=postgres
DB_PASSWORD=your_password
DATABASE_URL=jdbc:postgresql://localhost:5432/thai_auto_insurance_dev

# JWT Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS (for production)
ALLOWED_ORIGINS=https://yourdomain.com
```

### Application Profiles
- **dev**: Development configuration with debug logging
- **prod**: Production configuration with security hardening

## API Documentation

Once the application is running, access the API documentation at:
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- API Docs: `http://localhost:8080/api/api-docs`

## Default Users

The application comes with pre-configured test users:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | password123 | ADMIN | System administrator |
| agent1 | password123 | AGENT | Insurance agent |
| adjuster1 | password123 | CLAIMS_ADJUSTER | Claims adjuster |
| customer1 | password123 | CUSTOMER | Sample customer |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Customer Management
- `GET /api/customers` - List all customers
- `GET /api/customers/search` - Search customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/{id}` - Get customer by ID
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Vehicle Management
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Register new vehicle
- `GET /api/vehicles/{id}` - Get vehicle details
- `PUT /api/vehicles/{id}` - Update vehicle

### Policy Management
- `GET /api/policies` - List policies
- `POST /api/policies` - Create new policy
- `GET /api/policies/{id}` - Get policy details
- `POST /api/quotes` - Generate insurance quote

### Claims Management
- `GET /api/claims` - List claims
- `POST /api/claims` - Submit new claim
- `GET /api/claims/{id}` - Get claim details
- `PUT /api/claims/{id}/status` - Update claim status

### Payment Processing
- `GET /api/payments` - List payments
- `POST /api/payments` - Process payment
- `GET /api/payments/{id}` - Get payment details

## Database Schema

The application uses PostgreSQL with the following main entities:
- `users` - User accounts and authentication
- `customers` - Customer information with Thai-specific fields
- `vehicles` - Vehicle registration and details
- `policies` - Insurance policies and coverage
- `claims` - Claims and processing workflow
- `payments` - Payment transactions and methods

## Security Features

- JWT-based stateless authentication
- Role-based access control (RBAC)
- Password encryption using BCrypt
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Request rate limiting (configurable)
- Audit logging for sensitive operations

## Thai Validation Features

The application includes comprehensive Thai-specific validation:

```java
// Thai National ID validation with checksum
ThaiValidationUtil.isValidThaiNationalId("1234567890123");

// Thai phone number validation
ThaiValidationUtil.isValidThaiPhoneNumber("0812345678");

// Thai postal code validation
ThaiValidationUtil.isValidThaiPostalCode("10110");

// Thai license plate validation
ThaiValidationUtil.isValidThaiLicensePlate("กก1234");
```

## Testing

### Run Unit Tests
```bash
mvn test
```

### Run Integration Tests
```bash
mvn integration-test
```

### API Testing
Use the provided Postman collection or test via Swagger UI.

## Monitoring and Health Checks

- Health check endpoint: `GET /api/actuator/health`
- Application metrics: `GET /api/actuator/metrics`
- Application info: `GET /api/actuator/info`

## Deployment

### Docker Deployment
```bash
# Build and run with docker-compose
docker-compose up -d

# Scale the application
docker-compose up --scale backend=3
```

### Production Considerations
- Use environment-specific configuration files
- Configure SSL/TLS certificates
- Set up database connection pooling
- Configure logging aggregation
- Set up monitoring and alerting
- Configure backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation for usage examples

## Changelog

### Version 1.0.0
- Initial release with core functionality
- Thai-specific validation and localization
- Complete CRUD operations for all entities
- JWT authentication and authorization
- Docker containerization
- Comprehensive API documentation