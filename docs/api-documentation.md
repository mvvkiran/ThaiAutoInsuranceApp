# Thai Auto Insurance API Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Request/Response Format](#requestresponse-format)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Thai-Specific Features](#thai-specific-features)
8. [Code Examples](#code-examples)
9. [Testing](#testing)
10. [Support](#support)

## Getting Started

The Thai Auto Insurance API is a RESTful web service that provides comprehensive insurance management capabilities specifically designed for the Thai market.

### Base URLs
- **Production**: `https://api.autoinsurance.co.th/api/v1`
- **Staging**: `https://api-staging.autoinsurance.co.th/api/v1`
- **Development**: `https://api-dev.autoinsurance.co.th/api/v1`

### API Version
Current API version: **v1.0**

### Content Type
All requests should use `application/json` content type unless specified otherwise (e.g., file uploads).

### Required Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {jwt_token}
X-Request-ID: {unique-request-id}
Accept-Language: th|en (optional, defaults to th)
```

## Authentication

The API uses JWT (JSON Web Token) based authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Login Process

#### 1. User Login
```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "somchai@example.com",
    "password": "SecurePass123!",
    "deviceInfo": {
      "deviceId": "unique-device-identifier",
      "deviceType": "mobile",
      "appVersion": "1.0.0"
    }
  }'
```

#### Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "somchai@example.com",
      "firstName": "สมชาย",
      "lastName": "ใจดี",
      "role": "CUSTOMER"
    }
  },
  "timestamp": "2024-12-27T10:30:00Z"
}
```

#### 2. Using the Access Token
Include the access token in all subsequent requests:

```bash
curl -X GET https://api.autoinsurance.co.th/api/v1/customers/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 3. Token Refresh
When your access token expires, use the refresh token to get a new one:

```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Registration Process

#### New User Registration
```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "firstName": "สมชาย",
      "lastName": "ใจดี",
      "firstNameEn": "Somchai",
      "lastNameEn": "Jaidee",
      "nationalId": "1234567890123",
      "dateOfBirth": "1990-01-15",
      "gender": "MALE"
    },
    "contactInfo": {
      "email": "somchai@example.com",
      "phoneNumber": "+66812345678",
      "preferredLanguage": "th",
      "address": {
        "addressLine1": "123/45 หมู่ 2",
        "addressLine2": "ถนนสุขุมวิท",
        "tambon": "คลองตัน",
        "amphoe": "วัฒนา",
        "province": "กรุงเทพมหานคร",
        "postalCode": "10110",
        "country": "TH"
      }
    },
    "credentials": {
      "email": "somchai@example.com",
      "password": "SecurePass123!",
      "confirmPassword": "SecurePass123!"
    },
    "consent": {
      "termsAndConditions": true,
      "privacyPolicy": true,
      "marketingConsent": false,
      "dataProcessingConsent": true
    }
  }'
```

## Request/Response Format

### Standard Response Structure
All API responses follow this consistent format:

```json
{
  "success": true|false,
  "data": {
    // Response data object
  },
  "timestamp": "2024-12-27T10:30:00Z"
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message in selected language",
    "messageEn": "Error message in English",
    "details": [
      {
        "field": "fieldName",
        "code": "FIELD_ERROR_CODE",
        "message": "Field-specific error message"
      }
    ],
    "timestamp": "2024-12-27T10:30:00Z",
    "requestId": "req-uuid-12345",
    "path": "/api/v1/endpoint"
  }
}
```

### Pagination
List endpoints support pagination with these parameters:

- `page`: Page number (0-based, default: 0)
- `size`: Items per page (default: 20, max: 100)
- `sort`: Sort criteria (e.g., "createdAt,desc")

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "deviceInfo": {
    "deviceId": "device-uuid",
    "deviceType": "mobile|desktop|tablet",
    "appVersion": "1.0.0"
  }
}
```

#### POST /auth/register
Register a new user account.

#### POST /auth/refresh
Refresh expired access token.

#### POST /auth/logout
Invalidate user session.

#### POST /auth/forgot-password
Request password reset email.

#### POST /auth/reset-password
Reset password using reset token.

### Customer Management Endpoints

#### GET /customers/profile
Retrieve current customer's profile information.

```bash
curl -X GET https://api.autoinsurance.co.th/api/v1/customers/profile \
  -H "Authorization: Bearer {token}"
```

#### PUT /customers/profile
Update customer profile information.

```bash
curl -X PUT https://api.autoinsurance.co.th/api/v1/customers/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "contactInfo": {
      "phoneNumber": "+66812345679",
      "address": {
        "addressLine1": "456/78 หมู่ 3",
        "tambon": "ลาดยาว",
        "amphoe": "จตุจักร",
        "province": "กรุงเทพมหานคร",
        "postalCode": "10900",
        "country": "TH"
      }
    }
  }'
```

#### POST /customers/kyc-verification
Submit KYC documents for verification.

```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/customers/kyc-verification \
  -H "Authorization: Bearer {token}" \
  -F "idCardFront=@id_card_front.jpg" \
  -F "idCardBack=@id_card_back.jpg" \
  -F "selfie=@customer_selfie.jpg"
```

### Vehicle Management Endpoints

#### GET /customers/vehicles
Get all vehicles owned by the customer.

#### POST /customers/vehicles
Add a new vehicle to customer account.

```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/customers/vehicles \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber": "กข1234",
    "province": "กรุงเทพมหานคร",
    "vehicleInfo": {
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "engineSize": 2.0,
      "fuelType": "GASOLINE",
      "vehicleType": "SEDAN",
      "color": "WHITE",
      "chassisNumber": "JTDBE30E500123456"
    },
    "usage": {
      "usageType": "PERSONAL",
      "annualMileage": 15000,
      "parkingLocation": "GARAGE"
    }
  }'
```

### Policy Management Endpoints

#### POST /policies/quote
Generate insurance quote for a vehicle.

```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/policies/quote \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "vehicle-uuid-12345",
    "quoteRequest": {
      "policyType": "CLASS_1",
      "coverageOptions": {
        "deductible": 5000,
        "medicalExpenses": 100000,
        "personalAccident": 200000,
        "bailBond": 50000,
        "propertyDamage": 1000000
      },
      "discounts": {
        "noClaimDiscount": true,
        "multiVehicleDiscount": false,
        "loyaltyDiscount": true
      },
      "policyPeriod": {
        "startDate": "2024-06-15",
        "endDate": "2025-06-15",
        "periodMonths": 12
      }
    }
  }'
```

#### GET /policies
Get customer's insurance policies.

#### POST /policies
Purchase insurance policy from quote.

#### GET /policies/{policyId}
Get detailed policy information.

#### PUT /policies/{policyId}/renew
Renew existing policy.

#### DELETE /policies/{policyId}
Cancel policy.

### Claims Management Endpoints

#### POST /claims
Report a new insurance claim.

```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/claims \
  -H "Authorization: Bearer {token}" \
  -F "policyId=policy-uuid-def456" \
  -F "claimType=ACCIDENT" \
  -F "incidentDate=2024-12-25T14:30:00Z" \
  -F "description=Rear-end collision at traffic light intersection" \
  -F "policeReportNumber=PR-2024-BKK-12345" \
  -F "photos=@damage1.jpg" \
  -F "photos=@damage2.jpg" \
  -F "documents=@police_report.pdf"
```

#### GET /claims
Get customer's claims history.

#### GET /claims/{claimId}
Get detailed claim information.

#### PUT /claims/{claimId}/status
Update claim status (Admin only).

#### POST /claims/{claimId}/documents
Upload additional claim documents.

### Payment Processing Endpoints

#### POST /payments/premium
Process premium payment.

```bash
curl -X POST https://api.autoinsurance.co.th/api/v1/payments/premium \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "policyId": "policy-uuid-def456",
    "paymentType": "PREMIUM",
    "amount": 13961.00,
    "currency": "THB",
    "paymentMethod": {
      "type": "CREDIT_CARD",
      "cardInfo": {
        "cardToken": "encrypted-card-token-abc123",
        "cardHolderName": "SOMCHAI JAIDEE",
        "expiryMonth": 12,
        "expiryYear": 2026,
        "cvv": "encrypted-cvv-456"
      }
    },
    "billingAddress": {
      "name": "สมชาย ใจดี",
      "addressLine1": "123/45 หมู่ 2",
      "city": "กรุงเทพมหานคร",
      "postalCode": "10110",
      "country": "TH"
    }
  }'
```

#### GET /payments/history
Get payment history.

#### POST /payments/refund
Process payment refund.

#### GET /payments/methods
Get available payment methods.

### Admin Endpoints

#### GET /admin/customers
Get all customers (Admin only).

#### GET /admin/policies
Get all policies (Admin only).

#### GET /admin/claims
Get all claims (Admin only).

#### GET /admin/reports
Generate business reports (Admin only).

## Error Handling

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Request validation failed |
| 400 | `INVALID_REQUEST` | Malformed request data |
| 401 | `UNAUTHORIZED` | Authentication required |
| 401 | `INVALID_TOKEN` | JWT token is invalid or expired |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 403 | `ACCOUNT_LOCKED` | Account is locked or suspended |
| 404 | `RESOURCE_NOT_FOUND` | Requested resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 409 | `BUSINESS_RULE_VIOLATION` | Business logic constraint violated |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |
| 502 | `EXTERNAL_SERVICE_ERROR` | External service unavailable |
| 503 | `SERVICE_UNAVAILABLE` | Temporary service unavailability |

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
    "messageEn": "Request validation failed",
    "details": [
      {
        "field": "nationalId",
        "code": "INVALID_FORMAT",
        "message": "เลขบัตรประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก",
        "messageEn": "National ID must be 13 digits"
      }
    ],
    "timestamp": "2024-12-27T10:30:00Z",
    "requestId": "req-uuid-12345",
    "path": "/api/v1/auth/register"
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

### Rate Limits by User Type
- **Standard Users**: 1000 requests/hour
- **Premium Users**: 5000 requests/hour
- **Agent Users**: 10000 requests/hour
- **Admin Users**: No limit

### Rate Limit Headers
Every response includes rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-RetryAfter: 3600
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "timestamp": "2024-12-27T10:30:00Z"
  }
}
```

## Thai-Specific Features

### National ID Validation
Thai National ID numbers are validated using the official algorithm:
- Must be exactly 13 digits
- Last digit must be a valid check digit
- Cannot be all the same digit

### Phone Number Format
Thai phone numbers must follow these formats:
- Mobile: `+66812345678` (starts with +668, +669)
- Landline: `+6622345678` (starts with +662)

### Address System
Thai addresses follow the official format:
```json
{
  "address": {
    "addressLine1": "123/45 หมู่ 2",
    "addressLine2": "ถนนสุขุมวิท",
    "tambon": "คลองตัน",
    "amphoe": "วัฒนา", 
    "province": "กรุงเทพมหานคร",
    "postalCode": "10110",
    "country": "TH"
  }
}
```

### Vehicle Registration
Thai vehicle registration numbers are validated:
- Format: `{Thai letters}{numbers}` (e.g., "กข1234")
- Must match DLT (Department of Land Transport) database
- Automatically verifies tax payment status

### Currency and Payments
- All amounts in Thai Baht (THB)
- Supports Thai payment methods:
  - PromptPay QR codes
  - Thai bank transfers
  - Popular e-wallets (TrueMoney, Rabbit LINE Pay, K PLUS)
  - Credit cards (Visa, MasterCard, JCB)

### Language Support
- Default language: Thai (th)
- Supported languages: Thai (th), English (en)
- Use `Accept-Language` header to specify language preference
- Error messages provided in both languages

## Code Examples

### JavaScript/TypeScript

#### Authentication
```typescript
class AutoInsuranceAPI {
  private baseUrl = 'https://api.autoinsurance.co.th/api/v1';
  private accessToken: string | null = null;

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        deviceInfo: {
          deviceId: this.getDeviceId(),
          deviceType: 'desktop',
          appVersion: '1.0.0'
        }
      })
    });

    const data = await response.json();
    if (data.success) {
      this.accessToken = data.data.accessToken;
      localStorage.setItem('refreshToken', data.data.refreshToken);
    }
    return data;
  }

  async getCustomerProfile(): Promise<CustomerProfile> {
    const response = await fetch(`${this.baseUrl}/customers/profile`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }
}
```

#### Generate Insurance Quote
```typescript
async generateQuote(vehicleId: string, coverageOptions: CoverageOptions): Promise<QuoteResponse> {
  const response = await fetch(`${this.baseUrl}/policies/quote`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vehicleId,
      quoteRequest: {
        policyType: 'CLASS_1',
        coverageOptions,
        policyPeriod: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
          periodMonths: 12
        }
      }
    })
  });
  return await response.json();
}
```

### Python

#### API Client
```python
import requests
import json
from typing import Dict, Any, Optional

class AutoInsuranceAPI:
    def __init__(self, base_url: str = "https://api.autoinsurance.co.th/api/v1"):
        self.base_url = base_url
        self.access_token: Optional[str] = None
        self.session = requests.Session()
    
    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user and store access token"""
        payload = {
            "email": email,
            "password": password,
            "deviceInfo": {
                "deviceId": self._get_device_id(),
                "deviceType": "desktop",
                "appVersion": "1.0.0"
            }
        }
        
        response = self.session.post(
            f"{self.base_url}/auth/login",
            json=payload
        )
        
        data = response.json()
        if data.get("success"):
            self.access_token = data["data"]["accessToken"]
            self.session.headers.update({
                "Authorization": f"Bearer {self.access_token}"
            })
        
        return data
    
    def get_customer_profile(self) -> Dict[str, Any]:
        """Get current customer profile"""
        response = self.session.get(f"{self.base_url}/customers/profile")
        return response.json()
    
    def report_claim(self, policy_id: str, claim_data: Dict[str, Any], 
                    files: Dict[str, Any] = None) -> Dict[str, Any]:
        """Report insurance claim with files"""
        data = {
            "policyId": policy_id,
            **claim_data
        }
        
        response = self.session.post(
            f"{self.base_url}/claims",
            data=data,
            files=files or {}
        )
        return response.json()
```

### Java

#### Spring Boot Client
```java
@Service
public class AutoInsuranceApiClient {
    
    @Value("${autoinsurance.api.baseUrl}")
    private String baseUrl;
    
    private final RestTemplate restTemplate;
    private String accessToken;
    
    public AutoInsuranceApiClient() {
        this.restTemplate = new RestTemplate();
    }
    
    public LoginResponse login(LoginRequest loginRequest) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<LoginRequest> request = new HttpEntity<>(loginRequest, headers);
        
        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
            baseUrl + "/auth/login", 
            request, 
            LoginResponse.class
        );
        
        if (response.getBody() != null && response.getBody().isSuccess()) {
            this.accessToken = response.getBody().getData().getAccessToken();
        }
        
        return response.getBody();
    }
    
    public CustomerProfileResponse getCustomerProfile() {
        HttpHeaders headers = createAuthHeaders();
        HttpEntity<?> entity = new HttpEntity<>(headers);
        
        ResponseEntity<CustomerProfileResponse> response = restTemplate.exchange(
            baseUrl + "/customers/profile",
            HttpMethod.GET,
            entity,
            CustomerProfileResponse.class
        );
        
        return response.getBody();
    }
    
    private HttpHeaders createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        return headers;
    }
}
```

### PHP

#### API Client
```php
class AutoInsuranceAPI {
    private $baseUrl;
    private $accessToken;
    
    public function __construct($baseUrl = 'https://api.autoinsurance.co.th/api/v1') {
        $this->baseUrl = $baseUrl;
    }
    
    public function login($email, $password) {
        $data = [
            'email' => $email,
            'password' => $password,
            'deviceInfo' => [
                'deviceId' => $this->getDeviceId(),
                'deviceType' => 'web',
                'appVersion' => '1.0.0'
            ]
        ];
        
        $response = $this->makeRequest('POST', '/auth/login', $data);
        
        if ($response['success']) {
            $this->accessToken = $response['data']['accessToken'];
        }
        
        return $response;
    }
    
    public function getCustomerProfile() {
        return $this->makeRequest('GET', '/customers/profile');
    }
    
    public function generateQuote($vehicleId, $quoteRequest) {
        $data = [
            'vehicleId' => $vehicleId,
            'quoteRequest' => $quoteRequest
        ];
        
        return $this->makeRequest('POST', '/policies/quote', $data);
    }
    
    private function makeRequest($method, $endpoint, $data = null) {
        $url = $this->baseUrl . $endpoint;
        
        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];
        
        if ($this->accessToken) {
            $headers[] = 'Authorization: Bearer ' . $this->accessToken;
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    private function getDeviceId() {
        if (!isset($_SESSION['device_id'])) {
            $_SESSION['device_id'] = uniqid('device_', true);
        }
        return $_SESSION['device_id'];
    }
}
```

## Testing

### Test Environments
- **Development**: For initial development and testing
- **Staging**: For pre-production testing with production-like data
- **Production**: Live environment

### Test Credentials
For development environment only:

```json
{
  "customer": {
    "email": "test.customer@example.com",
    "password": "TestPassword123!"
  },
  "agent": {
    "email": "test.agent@example.com", 
    "password": "TestPassword123!"
  },
  "admin": {
    "email": "test.admin@example.com",
    "password": "TestPassword123!"
  }
}
```

### Testing Tools

#### Postman Collection
Download the complete Postman collection with pre-configured requests:
- [Production Collection](https://docs.autoinsurance.co.th/postman/production.json)
- [Development Collection](https://docs.autoinsurance.co.th/postman/development.json)

#### Swagger UI
Interactive API documentation available at:
- Production: https://api.autoinsurance.co.th/swagger-ui.html
- Staging: https://api-staging.autoinsurance.co.th/swagger-ui.html

#### cURL Examples
Complete cURL examples for all endpoints are provided in each endpoint section above.

### Testing Guidelines

1. **Authentication Testing**
   - Test login with valid/invalid credentials
   - Test token expiration and refresh
   - Test unauthorized access attempts

2. **Data Validation Testing**
   - Test with invalid Thai National ID numbers
   - Test with invalid phone numbers
   - Test with missing required fields
   - Test with exceeding field length limits

3. **Business Logic Testing**
   - Test policy eligibility rules
   - Test claim validation rules
   - Test payment processing flows

4. **Error Handling Testing**
   - Test all error scenarios
   - Verify error message localization
   - Test rate limiting

## Support

### Documentation
- **API Reference**: https://docs.autoinsurance.co.th/api
- **Developer Portal**: https://developers.autoinsurance.co.th
- **OpenAPI Specification**: https://api.autoinsurance.co.th/v3/api-docs

### Support Channels
- **Email**: api-support@autoinsurance.co.th
- **Developer Forum**: https://developers.autoinsurance.co.th/forum
- **Issue Tracker**: https://github.com/autoinsurance-th/api-issues

### SLA
- **Response Time**: Within 24 hours for technical issues
- **Bug Fixes**: Critical bugs within 4 hours, non-critical within 72 hours
- **API Uptime**: 99.9% availability guarantee

### Versioning Policy
- **Major versions**: Breaking changes, 6-month deprecation notice
- **Minor versions**: New features, backward compatible
- **Patch versions**: Bug fixes, security updates

### Changelog
Stay updated with API changes:
- **Changelog**: https://docs.autoinsurance.co.th/changelog
- **Breaking Changes**: https://docs.autoinsurance.co.th/breaking-changes
- **Migration Guides**: https://docs.autoinsurance.co.th/migration

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-27  
**API Version**: v1.0  
**Contact**: api-support@autoinsurance.co.th