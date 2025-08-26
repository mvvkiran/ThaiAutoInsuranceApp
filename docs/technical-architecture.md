# Auto Insurance App - Technical Architecture

## 1. Architecture Overview

### 1.1 System Architecture Pattern
The application follows a **microservices architecture** with **domain-driven design (DDD)** principles, implemented as a **multi-tier web application** with clear separation of concerns.

### 1.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Load Balancer (NGINX)                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────────────┐
│                   API Gateway (Spring Cloud Gateway)            │
└─────────────┬───────────────┬───────────────┬───────────────────┘
              │               │               │
    ┌─────────▼─────────┐ ┌───▼────────┐ ┌───▼─────────────┐
    │   Frontend App    │ │  Admin     │ │   Mobile API    │
    │  (Angular SPA)    │ │  Panel     │ │   (REST/JSON)   │
    └─────────┬─────────┘ └───┬────────┘ └───┬─────────────┘
              │               │               │
    ┌─────────▼───────────────▼───────────────▼─────────────────┐
    │               Backend Services Layer                      │
    │ ┌─────────────┐ ┌──────────────┐ ┌─────────────────────┐ │
    │ │   User      │ │   Policy     │ │      Claims         │ │
    │ │  Service    │ │   Service    │ │     Service         │ │
    │ └─────────────┘ └──────────────┘ └─────────────────────┘ │
    │ ┌─────────────┐ ┌──────────────┐ ┌─────────────────────┐ │
    │ │  Payment    │ │  Notification│ │      Reporting      │ │
    │ │  Service    │ │   Service    │ │      Service        │ │
    │ └─────────────┘ └──────────────┘ └─────────────────────┘ │
    └─────────────────────┬───────────────────────────────────────┘
                          │
    ┌─────────────────────▼───────────────────────────────────────┐
    │                 Data Layer                                  │
    │ ┌─────────────┐ ┌──────────────┐ ┌─────────────────────┐   │
    │ │ PostgreSQL  │ │    Redis     │ │   File Storage      │   │
    │ │ (Primary)   │ │   (Cache)    │ │   (AWS S3/GCS)     │   │
    │ └─────────────┘ └──────────────┘ └─────────────────────┘   │
    └─────────────────────────────────────────────────────────────┘
```

## 2. Frontend Architecture (Angular)

### 2.1 Technology Stack
- **Framework**: Angular 16+ with TypeScript
- **UI Library**: Angular Material + Custom Thai Design System
- **State Management**: NgRx for complex state, RxJS for reactive programming
- **Routing**: Angular Router with lazy loading
- **Forms**: Reactive Forms with custom validators
- **HTTP Client**: Angular HTTP Client with interceptors
- **Testing**: Jasmine + Karma for unit tests, Cypress for E2E
- **Build Tool**: Angular CLI with Webpack
- **PWA**: Angular Service Worker for offline capabilities

### 2.2 Project Structure
```
src/
├── app/
│   ├── core/                 # Singleton services, guards
│   │   ├── auth/            # Authentication services
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   └── services/        # Core business services
│   ├── shared/              # Shared components, pipes, directives
│   │   ├── components/      # Reusable UI components
│   │   ├── pipes/           # Custom pipes (currency, date)
│   │   ├── validators/      # Custom form validators
│   │   └── models/          # TypeScript interfaces
│   ├── features/            # Feature modules (lazy-loaded)
│   │   ├── auth/           # Login, registration
│   │   ├── dashboard/      # Customer dashboard
│   │   ├── policies/       # Policy management
│   │   ├── claims/         # Claims management
│   │   ├── payments/       # Payment processing
│   │   └── profile/        # User profile
│   └── layout/             # Shell components
├── assets/                 # Static assets
│   ├── i18n/              # Thai/English translations
│   ├── images/            # Icons, logos
│   └── styles/            # SCSS themes
└── environments/          # Environment configurations
```

### 2.3 Key Angular Features Implementation

#### 2.3.1 Internationalization (i18n)
```typescript
// app.module.ts
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeTh from '@angular/common/locales/th';

registerLocaleData(localeEn);
registerLocaleData(localeTh);

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
```

#### 2.3.2 State Management with NgRx
```typescript
// State structure
interface AppState {
  auth: AuthState;
  policies: PolicyState;
  claims: ClaimState;
  payments: PaymentState;
  ui: UIState;
}

// Feature store example
@Injectable()
export class PolicyEffects {
  loadPolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PolicyActions.loadPolicies),
      switchMap(() =>
        this.policyService.getPolicies().pipe(
          map(policies => PolicyActions.loadPoliciesSuccess({ policies })),
          catchError(error => of(PolicyActions.loadPoliciesFailure({ error })))
        )
      )
    )
  );
}
```

#### 2.3.3 Progressive Web App Configuration
```json
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html"],
        "versionedFiles": ["/*.bundle.css", "/*.bundle.js"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-performance",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 100,
        "maxAge": "3d"
      }
    }
  ]
}
```

## 3. Backend Architecture (Spring Boot)

### 3.1 Technology Stack
- **Framework**: Spring Boot 3.0+ with Java 17+
- **Security**: Spring Security with JWT authentication
- **Data**: Spring Data JPA with Hibernate
- **Web**: Spring WebMVC with REST endpoints
- **Validation**: Bean Validation (JSR-303)
- **Documentation**: OpenAPI 3 (Swagger)
- **Testing**: JUnit 5, Mockito, TestContainers
- **Build**: Maven with multi-module structure
- **Monitoring**: Spring Boot Actuator + Micrometer

### 3.2 Project Structure (Multi-Module Maven)
```
auto-insurance-backend/
├── pom.xml                          # Parent POM
├── insurance-api/                   # REST API Layer
├── insurance-core/                  # Domain Models & Services
├── insurance-data/                  # Data Access Layer
├── insurance-integration/           # External Integrations
├── insurance-common/                # Shared Utilities
└── insurance-config/                # Configuration Classes
```

### 3.3 Domain-Driven Design Architecture

#### 3.3.1 Domain Model Structure
```java
// Domain Entities
@Entity
@Table(name = "policies")
public class Policy {
    @Id
    private UUID id;
    
    @Embedded
    private PolicyNumber policyNumber;
    
    @Embedded
    private CustomerId customerId;
    
    @Enumerated(EnumType.STRING)
    private PolicyType policyType;
    
    @Embedded
    private CoverageDetails coverage;
    
    @Embedded
    private PolicyPeriod period;
    
    // Domain methods
    public void renew(PolicyPeriod newPeriod) {
        // Business logic for policy renewal
    }
}

// Value Objects
@Embeddable
public class PolicyNumber {
    private String value;
    
    // Validation and business rules
    public PolicyNumber(String value) {
        if (!isValidFormat(value)) {
            throw new InvalidPolicyNumberException(value);
        }
        this.value = value;
    }
}
```

#### 3.3.2 Service Layer Architecture
```java
// Application Service
@Service
@Transactional
public class PolicyApplicationService {
    
    private final PolicyRepository policyRepository;
    private final PremiumCalculationService calculationService;
    private final PaymentService paymentService;
    
    public PolicyDto createPolicy(CreatePolicyCommand command) {
        // 1. Validate command
        validator.validate(command);
        
        // 2. Calculate premium
        Premium premium = calculationService.calculate(command);
        
        // 3. Create policy entity
        Policy policy = Policy.create(command, premium);
        
        // 4. Save policy
        policy = policyRepository.save(policy);
        
        // 5. Process initial payment
        paymentService.processInitialPayment(policy.getId(), premium);
        
        // 6. Return DTO
        return policyMapper.toDto(policy);
    }
}

// Domain Service
@Service
public class PremiumCalculationService {
    
    public Premium calculatePremium(Vehicle vehicle, Driver driver, 
                                  CoverageType coverageType) {
        PremiumCalculationContext context = PremiumCalculationContext.builder()
            .vehicle(vehicle)
            .driver(driver)
            .coverageType(coverageType)
            .build();
            
        return premiumCalculationEngine.calculate(context);
    }
}
```

### 3.4 REST API Design

#### 3.4.1 API Versioning and Structure
```java
@RestController
@RequestMapping("/api/v1/policies")
@Validated
public class PolicyController {
    
    @PostMapping
    public ResponseEntity<PolicyResponse> createPolicy(
            @Valid @RequestBody CreatePolicyRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        
        CreatePolicyCommand command = mapper.toCommand(request, user.getId());
        PolicyDto policy = policyService.createPolicy(command);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(mapper.toResponse(policy));
    }
    
    @GetMapping("/{policyId}")
    public ResponseEntity<PolicyResponse> getPolicy(
            @PathVariable UUID policyId,
            @AuthenticationPrincipal UserPrincipal user) {
        
        PolicyDto policy = policyService.getPolicy(policyId, user.getId());
        return ResponseEntity.ok(mapper.toResponse(policy));
    }
}
```

#### 3.4.2 OpenAPI Documentation
```java
@Operation(
    summary = "Create new insurance policy",
    description = "Creates a new motor insurance policy for the authenticated customer"
)
@ApiResponses({
    @ApiResponse(responseCode = "201", description = "Policy created successfully",
                content = @Content(schema = @Schema(implementation = PolicyResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid request data"),
    @ApiResponse(responseCode = "401", description = "User not authenticated"),
    @ApiResponse(responseCode = "409", description = "Policy already exists for this vehicle")
})
```

### 3.5 Security Architecture

#### 3.5.1 JWT Authentication
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .build();
    }
}
```

#### 3.5.2 Method-Level Security
```java
@PreAuthorize("hasRole('CUSTOMER') and #customerId == authentication.principal.id")
@GetMapping("/customers/{customerId}/policies")
public List<PolicyResponse> getCustomerPolicies(@PathVariable UUID customerId) {
    return policyService.getCustomerPolicies(customerId);
}
```

## 4. Database Design

### 4.1 Database Technology
- **Primary Database**: PostgreSQL 14+
- **Connection Pooling**: HikariCP
- **Migration**: Flyway for database versioning
- **Caching**: Redis for session and application cache

### 4.2 Database Schema Design

#### 4.2.1 Core Tables Structure
```sql
-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    national_id VARCHAR(13) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 0
);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year_of_manufacture INTEGER NOT NULL,
    engine_size DECIMAL(4,1),
    vehicle_type VARCHAR(50) NOT NULL,
    color VARCHAR(30),
    chassis_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies table
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id),
    vehicle_id UUID REFERENCES vehicles(id),
    policy_type VARCHAR(20) NOT NULL, -- CMI, CLASS1, CLASS2, CLASS3
    coverage_details JSONB NOT NULL,
    premium_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED
    no_claim_discount DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 0
);

-- Claims table
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    policy_id UUID REFERENCES policies(id),
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    claim_type VARCHAR(30) NOT NULL, -- ACCIDENT, THEFT, NATURAL_DISASTER
    status VARCHAR(20) DEFAULT 'REPORTED', -- REPORTED, INVESTIGATING, APPROVED, SETTLED, REJECTED
    incident_description TEXT,
    incident_location JSONB,
    estimated_amount DECIMAL(12,2),
    approved_amount DECIMAL(12,2),
    settled_amount DECIMAL(12,2),
    settlement_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 0
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES policies(id),
    claim_id UUID REFERENCES claims(id), -- for claim settlements
    payment_type VARCHAR(20) NOT NULL, -- PREMIUM, SETTLEMENT, REFUND
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'THB',
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    transaction_reference VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.2.2 Indexing Strategy
```sql
-- Performance indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_national_id ON customers(national_id);
CREATE INDEX idx_policies_customer_id ON policies(customer_id);
CREATE INDEX idx_policies_status_end_date ON policies(status, end_date);
CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_payments_policy_id ON payments(policy_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Composite indexes for complex queries
CREATE INDEX idx_policies_renewal_lookup ON policies(customer_id, end_date, status) 
WHERE status = 'ACTIVE';
```

### 4.3 Data Archiving Strategy
```sql
-- Archived tables for historical data
CREATE TABLE policies_archive (LIKE policies INCLUDING ALL);
CREATE TABLE claims_archive (LIKE claims INCLUDING ALL);
CREATE TABLE payments_archive (LIKE payments INCLUDING ALL);

-- Partitioning for large tables
CREATE TABLE audit_logs (
    id BIGSERIAL,
    table_name VARCHAR(50),
    operation VARCHAR(10),
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (timestamp);
```

## 5. Integration Architecture

### 5.1 External System Integrations

#### 5.1.1 Payment Gateway Integration
```java
// Payment service abstraction
public interface PaymentGateway {
    PaymentResult processPayment(PaymentRequest request);
    PaymentStatus checkPaymentStatus(String transactionId);
    RefundResult processRefund(RefundRequest request);
}

// Implementation for Thai payment gateways
@Service
@Profile("production")
public class ThaiPaymentGatewayService implements PaymentGateway {
    
    private final Map<PaymentMethod, PaymentProcessor> processors;
    
    @PostConstruct
    public void initializeProcessors() {
        processors.put(CREDIT_CARD, new CreditCardProcessor(twoCTwoPConfig));
        processors.put(PROMPTPAY, new PromptPayProcessor(promptPayConfig));
        processors.put(BANK_TRANSFER, new BankTransferProcessor(bankConfig));
    }
}
```

#### 5.1.2 Government API Integration (DLT)
```java
@Component
public class DLTIntegrationService {
    
    @Retryable(value = {DLTServiceException.class}, maxAttempts = 3)
    public VehicleInfo getVehicleInfo(String registrationNumber) {
        try {
            DLTRequest request = DLTRequest.builder()
                .registrationNumber(registrationNumber)
                .apiKey(dltConfig.getApiKey())
                .build();
                
            DLTResponse response = dltClient.getVehicleInfo(request);
            return mapToVehicleInfo(response);
            
        } catch (DLTApiException e) {
            throw new VehicleVerificationException(
                "Failed to verify vehicle: " + registrationNumber, e);
        }
    }
}
```

### 5.2 Message Queue Architecture
```java
// Asynchronous processing with RabbitMQ
@RabbitListener(queues = "policy.created")
public void handlePolicyCreated(PolicyCreatedEvent event) {
    // Send welcome email
    emailService.sendWelcomeEmail(event.getCustomerId());
    
    // Generate policy documents
    documentService.generatePolicyDocuments(event.getPolicyId());
    
    // Update customer statistics
    customerStatsService.updateStats(event.getCustomerId());
}

@EventListener
@Async
public void handleClaimReported(ClaimReportedEvent event) {
    // Assign claim to available adjuster
    claimAssignmentService.assignClaim(event.getClaimId());
    
    // Send notification to customer
    notificationService.sendClaimConfirmation(event.getCustomerId());
}
```

## 6. Deployment Architecture

### 6.1 Containerization with Docker

#### 6.1.1 Frontend Dockerfile
```dockerfile
# Angular Multi-stage build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/auto-insurance-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 6.1.2 Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jre-slim
COPY --from=build /app/target/auto-insurance-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 6.2 Kubernetes Deployment

#### 6.2.1 Application Deployment
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auto-insurance-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auto-insurance-backend
  template:
    metadata:
      labels:
        app: auto-insurance-backend
    spec:
      containers:
      - name: backend
        image: auto-insurance-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "kubernetes"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 5
```

#### 6.2.2 Service and Ingress
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: auto-insurance-service
spec:
  selector:
    app: auto-insurance-backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: auto-insurance-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.autoinsurance.co.th
    secretName: tls-secret
  rules:
  - host: api.autoinsurance.co.th
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: auto-insurance-service
            port:
              number: 80
```

## 7. Security Architecture

### 7.1 Security Layers

#### 7.1.1 Network Security
- **TLS 1.3** for all external communications
- **WAF (Web Application Firewall)** for DDoS protection
- **VPN** for admin access to production systems
- **Network segmentation** between tiers

#### 7.1.2 Application Security
```java
// Security configuration
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
    
    @Bean 
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("https://*.autoinsurance.co.th"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

#### 7.1.3 Data Protection
```java
// Field-level encryption for sensitive data
@Entity
public class Customer {
    
    @Convert(converter = EncryptedStringConverter.class)
    private String nationalId;
    
    @Convert(converter = EncryptedStringConverter.class) 
    private String phoneNumber;
    
    // Regular fields
    private String firstName;
    private String lastName;
}

// Audit logging
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity {
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    private String createdBy;
    
    @LastModifiedBy
    private String lastModifiedBy;
}
```

## 8. Monitoring and Observability

### 8.1 Application Monitoring
```java
// Custom metrics with Micrometer
@Component
public class BusinessMetrics {
    
    private final Counter policyCounter;
    private final Timer claimProcessingTimer;
    private final Gauge activeCustomersGauge;
    
    public BusinessMetrics(MeterRegistry meterRegistry) {
        this.policyCounter = Counter.builder("policies.created")
            .tag("type", "total")
            .register(meterRegistry);
            
        this.claimProcessingTimer = Timer.builder("claims.processing.time")
            .register(meterRegistry);
    }
    
    public void recordPolicyCreated(PolicyType type) {
        policyCounter.increment(Tags.of("policy.type", type.name()));
    }
}
```

### 8.2 Logging Strategy
```yaml
# logback-spring.xml
<configuration>
    <springProfile name="production">
        <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <pattern>
                        <pattern>{"service":"auto-insurance-backend"}</pattern>
                    </pattern>
                </providers>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="JSON"/>
        </root>
    </springProfile>
</configuration>
```

## 9. Performance Optimization

### 9.1 Caching Strategy
```java
// Multi-level caching
@Cacheable(value = "policies", key = "#policyId")
public PolicyDto getPolicy(UUID policyId) {
    return policyRepository.findById(policyId)
        .map(policyMapper::toDto)
        .orElseThrow(() -> new PolicyNotFoundException(policyId));
}

// Cache configuration
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
            .RedisCacheManagerBuilder
            .fromConnectionFactory(redisConnectionFactory())
            .cacheDefaults(cacheConfiguration());
        return builder.build();
    }
    
    private RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}
```

### 9.2 Database Optimization
```java
// Query optimization with JPA
@Query("""
    SELECT new com.autoinsurance.dto.PolicySummaryDto(
        p.id, p.policyNumber, p.policyType, p.status, p.endDate
    )
    FROM Policy p 
    WHERE p.customerId = :customerId 
    AND p.status = 'ACTIVE'
    ORDER BY p.endDate DESC
    """)
List<PolicySummaryDto> findActivePoliciesByCustomer(@Param("customerId") UUID customerId);

// Pagination for large datasets
@Query(value = "SELECT * FROM claims WHERE status = :status ORDER BY created_at DESC",
       countQuery = "SELECT count(*) FROM claims WHERE status = :status",
       nativeQuery = true)
Page<Claim> findByStatus(@Param("status") String status, Pageable pageable);
```

## 10. Disaster Recovery and Backup

### 10.1 Backup Strategy
```bash
#!/bin/bash
# Database backup script
pg_dump -h $DB_HOST -U $DB_USER -d auto_insurance \
    --format=custom \
    --no-owner \
    --no-privileges \
    --file=/backups/auto_insurance_$(date +%Y%m%d_%H%M%S).dump

# Upload to cloud storage
aws s3 cp /backups/auto_insurance_*.dump s3://auto-insurance-backups/database/
```

### 10.2 High Availability Setup
```yaml
# PostgreSQL HA with replication
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres-cluster
spec:
  instances: 3
  primaryUpdateStrategy: unsupervised
  
  postgresql:
    parameters:
      max_connections: "200"
      shared_buffers: "256MB"
      effective_cache_size: "1GB"
      
  bootstrap:
    initdb:
      database: auto_insurance
      owner: app_user
      encoding: UTF8
      
  storage:
    size: 100Gi
    storageClass: fast-ssd
```

## 11. Development Workflow

### 11.1 CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-java@v3
      with:
        java-version: '17'
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    # Backend tests
    - name: Run backend tests
      run: ./mvnw test
      
    # Frontend tests  
    - name: Run frontend tests
      run: |
        cd frontend
        npm ci
        npm run test:ci
        npm run e2e:ci
        
    # Security scan
    - name: Security scan
      run: |
        ./mvnw org.owasp:dependency-check-maven:check
        npm audit --audit-level moderate
        
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to production
      run: |
        kubectl apply -f k8s/
        kubectl rollout status deployment/auto-insurance-backend
```

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Architecture Review**: Quarterly  
**Technology Stack**: Angular 16+ / Spring Boot 3.0+ / PostgreSQL 14+