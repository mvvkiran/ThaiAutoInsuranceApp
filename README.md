# Thai Auto Insurance Application

A comprehensive auto insurance management system designed specifically for the Thai market, built with Angular frontend and Spring Boot backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Thai Auto Insurance Application is a full-stack web application that provides comprehensive auto insurance management capabilities tailored for the Thai market. It enables customers to get quotes, purchase policies, file claims, and manage their insurance needs digitally. Insurance agents can manage policies, process claims, and generate reports through an intuitive interface.

### Key Objectives

- **Digital Transformation**: Modernize the auto insurance process in Thailand
- **Customer Convenience**: 24/7 access to insurance services
- **Operational Efficiency**: Streamline insurance operations and reduce processing time
- **Regulatory Compliance**: Meet Thai insurance regulatory requirements
- **Multi-language Support**: Thai and English language interfaces

## ✨ Features

### Customer Features

- **Instant Quote Generation**: Get insurance quotes in real-time based on vehicle and driver information
- **Online Policy Purchase**: Complete policy purchase process digitally with secure payment
- **Policy Management**: View, download, and manage active policies
- **Claims Filing**: Submit claims online with photo upload capability
- **Claims Tracking**: Real-time status updates on claim processing
- **Premium Calculator**: Calculate premiums based on coverage options
- **Document Management**: Access policy documents, receipts, and claim history
- **Multi-language Support**: Switch between Thai and English

### Agent Features

- **Policy Administration**: Create, modify, and manage customer policies
- **Claims Processing**: Review and process customer claims
- **Customer Management**: Maintain customer profiles and history
- **Commission Tracking**: View commission reports and earnings
- **Document Generation**: Generate policy documents and reports
- **Quote Management**: Create and manage insurance quotes

### Admin Features

- **User Management**: Manage customers, agents, and admin accounts
- **Rate Configuration**: Configure insurance rates and coverage options
- **Report Generation**: Comprehensive business and operational reports
- **System Configuration**: Manage system settings and parameters
- **Audit Logs**: Track system activities and changes

## 🛠 Technology Stack

### Frontend
- **Framework**: Angular 17.3.17
- **UI Components**: Angular Material
- **Styling**: CSS3 with responsive design
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms with validation
- **Internationalization**: Angular i18n (Thai/English)

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Database**: H2 (Development) / PostgreSQL (Production)
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven

### Testing
- **Unit Testing**: 
  - Frontend: Karma & Jasmine
  - Backend: JUnit 5, Mockito
- **E2E Testing**: Playwright
- **API Testing**: REST Assured
- **Code Coverage**: Istanbul (Frontend), JaCoCo (Backend)

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         Angular Frontend Application                 │  │
│  │  - Components  - Services  - Guards  - Interceptors  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                        │
│                    RESTful API (HTTP/HTTPS)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Spring Boot Application                 │  │
│  │  - Controllers  - Services  - Repositories          │  │
│  │  - Security     - Validators  - Mappers            │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │          Database (H2/PostgreSQL)                    │  │
│  │   - Users  - Policies  - Claims  - Vehicles         │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Java**: JDK 21
- **Maven**: 3.9.x or higher
- **Git**: Latest version

## 💿 Installation

### Clone the Repository

```bash
git clone https://github.com/mvvkiran/ThaiAutoInsuranceApp.git
cd ThaiAutoInsuranceApp
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Backend Setup

```bash
cd backend
mvn clean install
```

## ⚙️ Configuration

### Frontend Configuration

Edit `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
mvn spring-boot:run
```

The backend server will start at: http://localhost:8080

### Start Frontend Development Server

```bash
cd frontend
ng serve
```

The frontend application will be available at: http://localhost:4200

### Access the Application

- **Application**: http://localhost:4200
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

### Default Credentials

- **Admin**: admin@insurance.com / Admin@123
- **Agent**: agent@insurance.com / Agent@123
- **Customer**: customer@insurance.com / Customer@123

## 🧪 Testing

### Run Frontend Tests

```bash
cd frontend

# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run e2e
```

### Run Backend Tests

```bash
cd backend

# Unit tests
mvn test

# Integration tests
mvn integration-test

# Generate test report
mvn surefire-report:report
```

### Run All Tests

```bash
# From project root
npm run test:all
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | User logout |

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/{id}` | Get customer by ID |
| PUT | `/api/customers/{id}` | Update customer |
| DELETE | `/api/customers/{id}` | Delete customer |

### Policy Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/policies` | Get all policies |
| POST | `/api/policies` | Create policy |
| GET | `/api/policies/{id}` | Get policy by ID |
| PUT | `/api/policies/{id}` | Update policy |
| DELETE | `/api/policies/{id}` | Delete policy |

### Claim Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/claims` | Get all claims |
| POST | `/api/claims` | File new claim |
| GET | `/api/claims/{id}` | Get claim by ID |
| PUT | `/api/claims/{id}` | Update claim |
| PUT | `/api/claims/{id}/status` | Update claim status |

### Quote Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quotes/calculate` | Calculate premium |
| POST | `/api/quotes` | Save quote |
| GET | `/api/quotes/{id}` | Get quote by ID |

## 📁 Project Structure

```
auto-insurance-app/
├── frontend/                    # Angular frontend application
│   ├── src/
│   │   ├── app/                # Application components and modules
│   │   │   ├── components/     # Reusable components
│   │   │   ├── services/       # Angular services
│   │   │   ├── models/         # TypeScript interfaces
│   │   │   ├── guards/         # Route guards
│   │   │   └── interceptors/   # HTTP interceptors
│   │   ├── assets/             # Static assets
│   │   └── environments/       # Environment configurations
│   ├── tests/                  # Test files
│   └── package.json
│
├── backend/                     # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/insurance/
│   │   │   │   ├── controller/ # REST controllers
│   │   │   │   ├── service/    # Business logic
│   │   │   │   ├── repository/ # Data access layer
│   │   │   │   ├── model/      # Entity classes
│   │   │   │   ├── dto/        # Data transfer objects
│   │   │   │   ├── security/   # Security configuration
│   │   │   │   └── exception/  # Exception handlers
│   │   │   └── resources/      # Configuration files
│   │   └── test/               # Test files
│   └── pom.xml
│
├── documentation/               # Project documentation
│   ├── requirements.md         # Requirements specification
│   ├── architecture.md         # System architecture
│   ├── design.md              # Design documentation
│   ├── api-specs.md           # API specifications
│   ├── test-plan.md           # Test plan and cases
│   └── deployment.md          # Deployment guide
│
├── tests/                      # E2E test files
│   ├── e2e/                   # Playwright tests
│   └── test-reports/          # Test execution reports
│
└── README.md                  # This file
```

## 📖 Documentation

Comprehensive documentation is available in the `/documentation` directory:

- **Requirements Specification**: Detailed functional and non-functional requirements
- **System Architecture**: Technical architecture and design patterns
- **API Documentation**: Complete API specifications with examples
- **Test Documentation**: Test plans, test cases, and execution reports
- **Deployment Guide**: Production deployment instructions

## 🤝 Contributing

We welcome contributions to the Thai Auto Insurance Application! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Angular style guide for frontend code
- Follow Java/Spring Boot best practices for backend code
- Write unit tests for all new features
- Maintain code coverage above 80%
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Product Owner**: Insurance Domain Expert
- **Tech Lead**: Full Stack Architect
- **Developers**: Angular & Spring Boot Developers
- **QA Team**: Test Automation Engineers
- **DevOps**: Infrastructure Team

## 📞 Support

For support and queries:
- Email: support@thaiinsurance.com
- Documentation: [Wiki](https://github.com/mvvkiran/ThaiAutoInsuranceApp/wiki)
- Issues: [GitHub Issues](https://github.com/mvvkiran/ThaiAutoInsuranceApp/issues)

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Cloud Deployment

The application is cloud-ready and can be deployed on:
- AWS (EC2, RDS, S3)
- Google Cloud Platform
- Azure
- Heroku

## 📈 Monitoring

- Application metrics available at `/actuator/metrics`
- Health check endpoint: `/actuator/health`
- Logging configured with SLF4J and Logback

---

**Version**: 1.0.0  
**Last Updated**: August 2024  
**Status**: Production Ready

Made with ❤️ for the Thai Insurance Market