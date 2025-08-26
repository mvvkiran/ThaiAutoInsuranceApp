# Thai Auto Insurance API Specification

## 1. API Overview

### 1.1 API Information
- **Version**: v1.0
- **Base URL**: `https://api.autoinsurance.co.th/api/v1`
- **Protocol**: HTTPS only
- **Data Format**: JSON
- **Authentication**: JWT Bearer Token
- **Rate Limiting**: 1000 requests per hour per API key

### 1.2 API Design Principles
- RESTful architecture following OpenAPI 3.0 specification
- Consistent error handling and response formats
- Comprehensive request/response validation
- Idempotent operations where applicable
- Backward compatibility maintenance
- Thai language and culture-specific data handling

### 1.3 Versioning Strategy
- URL versioning: `/api/v1/`, `/api/v2/`
- Backward compatibility for at least 2 major versions
- Deprecation notices 6 months before removal
- Header-based version negotiation for minor versions

## 2. Authentication and Security

### 2.1 Authentication Flow

#### JWT Token-based Authentication
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "securePassword123",
  "deviceInfo": {
    "deviceId": "uuid-device-id",
    "deviceType": "mobile|desktop|tablet",
    "appVersion": "1.0.0"
  }
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER",
      "permissions": ["VIEW_POLICIES", "CREATE_CLAIMS"]
    }
  },
  "timestamp": "2024-12-27T10:30:00Z"
}
```

#### Token Refresh
```http
POST /api/v1/auth/refresh
Content-Type: application/json
Authorization: Bearer <refreshToken>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### Multi-Factor Authentication
```http
POST /api/v1/auth/mfa/verify
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "method": "SMS",
  "code": "123456",
  "phoneNumber": "+66812345678"
}
```

### 2.2 API Security Headers
All requests must include:
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
X-Request-ID: unique-request-identifier
X-API-Version: 1.0
```

### 2.3 Rate Limiting
- **Standard Users**: 1000 requests/hour
- **Premium Users**: 5000 requests/hour  
- **Agent Users**: 10000 requests/hour
- **Admin Users**: No limit

Rate limit headers in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-RetryAfter: 3600
```

## 3. Customer Management APIs

### 3.1 Customer Registration

#### Create Customer Account
```http
POST /api/v1/customers/register
Content-Type: application/json

{
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
}

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "verificationRequired": true,
    "verificationMethods": ["EMAIL", "SMS"],
    "message": "Registration successful. Please verify your email and phone number."
  },
  "timestamp": "2024-12-27T10:30:00Z"
}
```

#### Verify Customer Account
```http
POST /api/v1/customers/verify
Content-Type: application/json

{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "verificationType": "EMAIL",
  "verificationCode": "ABC123"
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "verified": true,
    "message": "Email verification successful"
  }
}
```

### 3.2 Customer Profile Management

#### Get Customer Profile
```http
GET /api/v1/customers/{customerId}/profile
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "personalInfo": {
      "firstName": "สมชาย",
      "lastName": "ใจดี",
      "firstNameEn": "Somchai", 
      "lastNameEn": "Jaidee",
      "nationalId": "****67890123", // Masked for security
      "dateOfBirth": "1990-01-15",
      "gender": "MALE"
    },
    "contactInfo": {
      "email": "som****@example.com", // Masked
      "phoneNumber": "+6681****678", // Masked
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
    "accountStatus": "ACTIVE",
    "kycStatus": "VERIFIED",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-12-27T09:15:00Z"
  }
}
```

#### Update Customer Profile
```http
PUT /api/v1/customers/{customerId}/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "contactInfo": {
    "phoneNumber": "+66812345679",
    "address": {
      "addressLine1": "456/78 หมู่ 3",
      "addressLine2": "ถนนพหลโยธิน",
      "tambon": "ลาดยาว",
      "amphoe": "จตุจักร", 
      "province": "กรุงเทพมหานคร",
      "postalCode": "10900",
      "country": "TH"
    }
  }
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "message": "Profile updated successfully",
    "updatedFields": ["phoneNumber", "address"]
  }
}
```

### 3.3 Vehicle Management

#### Add Vehicle
```http
POST /api/v1/customers/{customerId}/vehicles
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
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
}

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "vehicleId": "vehicle-uuid-12345",
    "registrationNumber": "กข1234",
    "dltVerification": {
      "status": "VERIFIED",
      "verifiedAt": "2024-12-27T10:30:00Z",
      "expiryDate": "2025-12-27",
      "taxStatus": "PAID"
    },
    "message": "Vehicle added and verified successfully"
  }
}
```

#### Get Customer Vehicles
```http
GET /api/v1/customers/{customerId}/vehicles
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "vehicle-uuid-12345",
        "registrationNumber": "กข1234",
        "province": "กรุงเทพมหานคร",
        "vehicleInfo": {
          "make": "Toyota",
          "model": "Camry",
          "year": 2020,
          "engineSize": 2.0,
          "vehicleType": "SEDAN",
          "color": "WHITE"
        },
        "currentPolicy": {
          "policyId": "policy-uuid-67890",
          "policyNumber": "POL-2024-001234",
          "status": "ACTIVE",
          "expiryDate": "2025-06-15"
        },
        "dltStatus": {
          "registrationValid": true,
          "taxPaid": true,
          "expiryDate": "2025-12-27"
        },
        "isActive": true
      }
    ],
    "totalCount": 1
  }
}
```

## 4. Policy Management APIs

### 4.1 Quote Generation

#### Generate Insurance Quote
```http
POST /api/v1/quotes/generate
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "vehicleId": "vehicle-uuid-12345",
  "quoteRequest": {
    "policyType": "CLASS_1", // CMI, CLASS_1, CLASS_2, CLASS_3
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
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "quoteId": "quote-uuid-abc123",
    "quoteNumber": "QT-2024-123456",
    "validUntil": "2024-12-30T23:59:59Z",
    "premium": {
      "basePremium": 15000.00,
      "discounts": {
        "noClaimDiscount": -1500.00,
        "loyaltyDiscount": -500.00,
        "totalDiscounts": -2000.00
      },
      "fees": {
        "oicFund": 50.00,
        "stamp": 1.00,
        "vat": 910.00,
        "totalFees": 961.00
      },
      "netPremium": 13000.00,
      "totalPremium": 13961.00
    },
    "coverage": {
      "policyType": "CLASS_1",
      "deductible": 5000,
      "coverageDetails": {
        "thirdPartyLiability": {
          "bodilyInjuryPerPerson": 100000,
          "bodilyInjuryPerAccident": 1000000,
          "propertyDamage": 1000000
        },
        "ownDamage": {
          "vehicleValue": 800000,
          "deductible": 5000
        },
        "medicalExpenses": 100000,
        "personalAccident": 200000
      }
    },
    "paymentOptions": [
      {
        "type": "FULL_PAYMENT",
        "amount": 13961.00,
        "discount": 2.0,
        "finalAmount": 13682.00
      },
      {
        "type": "INSTALLMENT_6",
        "monthlyAmount": 2440.00,
        "totalAmount": 14640.00,
        "interestRate": 4.86
      },
      {
        "type": "INSTALLMENT_12", 
        "monthlyAmount": 1247.00,
        "totalAmount": 14964.00,
        "interestRate": 7.19
      }
    ]
  }
}
```

#### Compare Multiple Quotes
```http
POST /api/v1/quotes/compare
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "vehicleId": "vehicle-uuid-12345",
  "quoteRequests": [
    {
      "policyType": "CMI",
      "coverageOptions": {
        "bodilyInjuryPerPerson": 100000,
        "bodilyInjuryPerAccident": 1000000,
        "propertyDamage": 1000000
      }
    },
    {
      "policyType": "CLASS_1",
      "coverageOptions": {
        "deductible": 5000,
        "ownDamage": true
      }
    },
    {
      "policyType": "CLASS_2",
      "coverageOptions": {
        "fireAndTheft": true,
        "flood": true
      }
    }
  ]
}

# Response - Comparison table format
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "comparison": {
      "CMI": {
        "quoteId": "quote-cmi-123",
        "premium": 1200.00,
        "coverage": "Compulsory only",
        "features": ["Third party liability", "Legal requirement"]
      },
      "CLASS_1": {
        "quoteId": "quote-c1-456",
        "premium": 13961.00,
        "coverage": "Comprehensive",
        "features": ["Full coverage", "Own damage", "Theft protection"]
      },
      "CLASS_2": {
        "quoteId": "quote-c2-789", 
        "premium": 8500.00,
        "coverage": "Partial comprehensive",
        "features": ["Fire and theft", "Flood protection", "No collision"]
      }
    },
    "recommendation": {
      "recommended": "CLASS_1",
      "reason": "Best value for comprehensive protection"
    }
  }
}
```

### 4.2 Policy Purchase

#### Purchase Policy
```http
POST /api/v1/policies/purchase
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "quoteId": "quote-uuid-abc123",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "paymentInfo": {
    "paymentOption": "FULL_PAYMENT",
    "paymentMethod": "CREDIT_CARD",
    "paymentDetails": {
      "cardToken": "encrypted-card-token",
      "cardLast4": "1234",
      "cardType": "VISA"
    }
  },
  "beneficiary": {
    "type": "SELF", // SELF, SPOUSE, PARENT, CHILD, OTHER
    "relationship": null,
    "personalInfo": null
  },
  "additionalOptions": {
    "autoRenewal": true,
    "digitalDocuments": true,
    "smsNotifications": true
  }
}

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "policyId": "policy-uuid-def456",
    "policyNumber": "POL-2024-567890",
    "status": "ACTIVE",
    "effectiveDate": "2024-06-15T00:00:00Z",
    "expiryDate": "2025-06-15T23:59:59Z",
    "premium": {
      "totalPremium": 13682.00,
      "paymentStatus": "PAID",
      "paymentMethod": "CREDIT_CARD",
      "transactionId": "txn-uuid-payment-123"
    },
    "documents": {
      "policyDocument": "https://docs.autoinsurance.co.th/policies/POL-2024-567890.pdf",
      "certificate": "https://docs.autoinsurance.co.th/certificates/POL-2024-567890-cert.pdf",
      "taxInvoice": "https://docs.autoinsurance.co.th/invoices/POL-2024-567890-invoice.pdf"
    },
    "nextPaymentDue": null, // For installments only
    "message": "Policy purchased successfully. Documents sent via email."
  }
}
```

#### Get Policy Details
```http
GET /api/v1/policies/{policyId}
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "id": "policy-uuid-def456",
    "policyNumber": "POL-2024-567890",
    "customer": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "สมชาย ใจดี"
    },
    "vehicle": {
      "id": "vehicle-uuid-12345",
      "registrationNumber": "กข1234",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020
    },
    "coverage": {
      "policyType": "CLASS_1",
      "effectiveDate": "2024-06-15T00:00:00Z",
      "expiryDate": "2025-06-15T23:59:59Z",
      "coverageDetails": {
        "thirdPartyLiability": {
          "bodilyInjuryPerPerson": 100000,
          "bodilyInjuryPerAccident": 1000000,
          "propertyDamage": 1000000
        },
        "ownDamage": {
          "vehicleValue": 800000,
          "deductible": 5000
        },
        "medicalExpenses": 100000,
        "personalAccident": 200000,
        "additionalCoverages": [
          "FLOOD_PROTECTION",
          "THEFT_PROTECTION",
          "WINDSHIELD_PROTECTION"
        ]
      }
    },
    "premium": {
      "basePremium": 15000.00,
      "discounts": -2000.00,
      "fees": 961.00,
      "totalPremium": 13961.00,
      "paymentPlan": "FULL_PAYMENT"
    },
    "status": "ACTIVE",
    "renewalInfo": {
      "autoRenewal": true,
      "renewalDate": "2025-05-15",
      "noClaimDiscount": 10.0
    },
    "documents": [
      {
        "type": "POLICY_DOCUMENT",
        "url": "https://docs.autoinsurance.co.th/policies/POL-2024-567890.pdf",
        "generatedAt": "2024-06-15T10:30:00Z"
      },
      {
        "type": "CERTIFICATE",
        "url": "https://docs.autoinsurance.co.th/certificates/POL-2024-567890-cert.pdf", 
        "generatedAt": "2024-06-15T10:30:00Z"
      }
    ]
  }
}
```

### 4.3 Policy Management

#### Renew Policy
```http
POST /api/v1/policies/{policyId}/renew
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "renewalOptions": {
    "coverageChanges": {
      "deductible": 3000, // Changed from 5000
      "medicalExpenses": 150000 // Increased from 100000
    },
    "paymentPlan": "INSTALLMENT_6"
  },
  "paymentMethod": {
    "method": "CREDIT_CARD", 
    "cardToken": "encrypted-new-card-token"
  }
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "renewedPolicyId": "policy-uuid-renewed-789",
    "renewedPolicyNumber": "POL-2025-567891",
    "effectiveDate": "2025-06-15T00:00:00Z",
    "expiryDate": "2026-06-15T23:59:59Z",
    "premium": {
      "newTotalPremium": 14500.00,
      "noClaimDiscount": 15.0,
      "finalPremium": 12325.00
    },
    "message": "Policy renewed successfully with updated coverage"
  }
}
```

#### Cancel Policy
```http
POST /api/v1/policies/{policyId}/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "cancellationReason": "VEHICLE_SOLD",
  "effectiveDate": "2024-12-31",
  "documents": {
    "proofOfSale": "document-uuid-sale-proof"
  }
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "cancellationId": "cancel-uuid-123",
    "effectiveDate": "2024-12-31T23:59:59Z",
    "refund": {
      "refundAmount": 3500.00,
      "refundMethod": "ORIGINAL_PAYMENT_METHOD",
      "processingTime": "5-7 business days"
    },
    "message": "Policy cancellation processed. Refund will be processed within 5-7 business days."
  }
}
```

## 5. Claims Management APIs

### 5.1 Claims Reporting

#### Report New Claim
```http
POST /api/v1/claims/report
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

# Form data fields:
policyId: policy-uuid-def456
claimType: ACCIDENT
incidentDate: 2024-12-25T14:30:00Z
incidentLocation: {
  "latitude": 13.7563,
  "longitude": 100.5018,
  "address": "ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพมหานคร",
  "landmark": "หน้าห universal center"
}
description: "Rear-end collision at traffic light intersection"
policeReportNumber: "PR-2024-BKK-12345"
otherPartyInfo: {
  "driverName": "นางสมหญิง รักดี",
  "licenseNumber": "DL-12345678",
  "vehicleRegistration": "กง5678",
  "insuranceCompany": "ABC Insurance"
}
damageDescription: "Front bumper damage, headlight broken"
injuryDescription: "Minor neck pain, no serious injuries"
# Files:
photos[]: [damage1.jpg, damage2.jpg, scene1.jpg]
videos[]: [incident_video.mp4]
documents[]: [police_report.pdf]

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "claimId": "claim-uuid-xyz789",
    "claimNumber": "CLM-2024-123456",
    "status": "REPORTED",
    "reportedAt": "2024-12-27T10:30:00Z",
    "estimatedProcessingTime": "7-10 business days",
    "assignedAdjuster": {
      "name": "คุณสุภาพ จริงใจ",
      "phone": "+66812345678",
      "email": "adjuster@autoinsurance.co.th"
    },
    "nextSteps": [
      "Document review by adjuster",
      "Damage assessment scheduling",
      "Initial investigation"
    ],
    "trackingUrl": "https://claims.autoinsurance.co.th/track/CLM-2024-123456",
    "message": "Claim reported successfully. You will receive updates via SMS and email."
  }
}
```

#### Upload Additional Documents
```http
POST /api/v1/claims/{claimId}/documents
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

# Form data:
documentType: MEDICAL_REPORT
description: "Hospital report for neck injury"
# Files:
document: medical_report.pdf

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "documentId": "doc-uuid-abc123",
    "documentType": "MEDICAL_REPORT",
    "fileName": "medical_report.pdf",
    "uploadedAt": "2024-12-27T10:30:00Z",
    "status": "RECEIVED",
    "message": "Document uploaded successfully"
  }
}
```

### 5.2 Claims Tracking

#### Get Claim Status
```http
GET /api/v1/claims/{claimId}/status
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "claimId": "claim-uuid-xyz789",
    "claimNumber": "CLM-2024-123456",
    "currentStatus": "UNDER_INVESTIGATION",
    "timeline": [
      {
        "status": "REPORTED",
        "timestamp": "2024-12-25T14:30:00Z",
        "description": "Claim reported by customer",
        "actor": "CUSTOMER"
      },
      {
        "status": "ASSIGNED",
        "timestamp": "2024-12-25T15:00:00Z",
        "description": "Assigned to adjuster สุภาพ จริงใจ",
        "actor": "SYSTEM"
      },
      {
        "status": "UNDER_INVESTIGATION",
        "timestamp": "2024-12-26T09:00:00Z",
        "description": "Investigation started - Document review completed",
        "actor": "ADJUSTER"
      }
    ],
    "estimatedCompletionDate": "2025-01-03",
    "nextAction": {
      "action": "DAMAGE_ASSESSMENT",
      "description": "Schedule damage assessment appointment",
      "dueDate": "2024-12-28",
      "assignedTo": "SURVEYOR"
    },
    "communication": {
      "lastUpdate": "2024-12-26T16:30:00Z",
      "message": "Damage assessment scheduled for tomorrow at 10:00 AM"
    }
  }
}
```

#### Get Claim Details
```http
GET /api/v1/claims/{claimId}
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "id": "claim-uuid-xyz789",
    "claimNumber": "CLM-2024-123456",
    "policy": {
      "policyNumber": "POL-2024-567890",
      "coverageType": "CLASS_1"
    },
    "incident": {
      "type": "ACCIDENT",
      "date": "2024-12-25T14:30:00Z",
      "location": {
        "address": "ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพมหานคร",
        "coordinates": {
          "latitude": 13.7563,
          "longitude": 100.5018
        }
      },
      "description": "Rear-end collision at traffic light intersection",
      "policeReportNumber": "PR-2024-BKK-12345"
    },
    "damages": {
      "vehicleDamage": {
        "estimatedCost": 45000.00,
        "description": "Front bumper replacement, headlight repair",
        "photos": [
          "https://docs.autoinsurance.co.th/claims/CLM-2024-123456/damage1.jpg",
          "https://docs.autoinsurance.co.th/claims/CLM-2024-123456/damage2.jpg"
        ]
      },
      "medicalExpenses": {
        "estimatedCost": 5000.00,
        "description": "Neck injury treatment",
        "hospitalReports": [
          "https://docs.autoinsurance.co.th/claims/CLM-2024-123456/medical_report.pdf"
        ]
      }
    },
    "assessment": {
      "surveyor": {
        "name": "คุณวิชาญ ชำนาญ",
        "licenseNumber": "SUR-12345",
        "phone": "+66812345679"
      },
      "assessmentDate": "2024-12-27T10:00:00Z",
      "estimatedRepairCost": 43500.00,
      "deductible": 5000.00,
      "approvedAmount": 38500.00
    },
    "repairShop": {
      "name": "Toyota Authorized Service Center",
      "address": "123 ถนนรามคำแหง กรุงเทพมหานคร",
      "phone": "+66812345680",
      "estimatedCompletionDate": "2025-01-05"
    },
    "status": "APPROVED",
    "settlement": {
      "approvedAmount": 38500.00,
      "paymentMethod": "DIRECT_REPAIR",
      "paymentDate": null
    }
  }
}
```

### 5.3 Claims Processing

#### Schedule Damage Assessment
```http
POST /api/v1/claims/{claimId}/schedule-assessment
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "preferredDates": [
    "2024-12-28T10:00:00Z",
    "2024-12-28T14:00:00Z",
    "2024-12-29T09:00:00Z"
  ],
  "location": {
    "type": "CUSTOMER_LOCATION", // CUSTOMER_LOCATION, REPAIR_SHOP, INSURANCE_OFFICE
    "address": "123/45 หมู่ 2 ถนนสุขุมวิท คลองตัน วัฒนา กรุงเทพมหานคร 10110"
  },
  "contactPerson": {
    "name": "สมชาย ใจดี",
    "phone": "+66812345678"
  }
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "assessmentId": "assess-uuid-456",
    "scheduledDate": "2024-12-28T10:00:00Z",
    "surveyor": {
      "name": "คุณวิชาญ ชำนาญ",
      "phone": "+66812345679",
      "licenseNumber": "SUR-12345"
    },
    "location": {
      "address": "123/45 หมู่ 2 ถนนสุขุมวิท คลองตัน วัฒนา กรุงเทพมหานคร 10110",
      "mapUrl": "https://maps.google.com/?q=13.7563,100.5018"
    },
    "instructions": [
      "Please have vehicle ready for inspection",
      "Prepare all relevant documents",
      "Assessment typically takes 30-45 minutes"
    ],
    "message": "Assessment scheduled successfully. You will receive confirmation SMS."
  }
}
```

#### Submit Settlement Approval
```http
POST /api/v1/claims/{claimId}/settlement-approval
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "approval": "APPROVED", // APPROVED, REJECTED, NEGOTIATION_REQUESTED
  "repairOption": "AUTHORIZED_SHOP", // AUTHORIZED_SHOP, CASH_SETTLEMENT
  "selectedRepairShop": {
    "shopId": "shop-uuid-789",
    "name": "Toyota Authorized Service Center"
  },
  "comments": "Agree with the assessment amount"
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "settlementId": "settle-uuid-123",
    "approvedAmount": 38500.00,
    "repairShop": {
      "name": "Toyota Authorized Service Center",
      "contact": "+66812345680",
      "estimatedRepairTime": "7-10 days"
    },
    "paymentMethod": "DIRECT_REPAIR",
    "nextSteps": [
      "Contact repair shop to schedule repair",
      "Provide claim reference number to shop",
      "Track repair progress through app"
    ],
    "message": "Settlement approved. You can now proceed with repairs."
  }
}
```

## 6. Payment Processing APIs

### 6.1 Payment Methods Management

#### Get Available Payment Methods
```http
GET /api/v1/payments/methods
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "creditCards": [
      {
        "type": "VISA",
        "supported": true,
        "fees": {
          "percentage": 2.5,
          "fixedFee": 0
        }
      },
      {
        "type": "MASTERCARD",
        "supported": true,
        "fees": {
          "percentage": 2.5,
          "fixedFee": 0
        }
      },
      {
        "type": "JCB",
        "supported": true,
        "fees": {
          "percentage": 3.0,
          "fixedFee": 0
        }
      }
    ],
    "digitalWallets": [
      {
        "type": "TRUEMONEY",
        "supported": true,
        "maxAmount": 50000.00,
        "fees": {
          "percentage": 1.5,
          "fixedFee": 10
        }
      },
      {
        "type": "RABBIT_LINE_PAY",
        "supported": true,
        "maxAmount": 100000.00,
        "fees": {
          "percentage": 2.0,
          "fixedFee": 0
        }
      },
      {
        "type": "K_PLUS",
        "supported": true,
        "maxAmount": 200000.00,
        "fees": {
          "percentage": 1.0,
          "fixedFee": 15
        }
      }
    ],
    "bankTransfers": [
      {
        "type": "PROMPTPAY",
        "supported": true,
        "maxAmount": 2000000.00,
        "fees": {
          "percentage": 0,
          "fixedFee": 0
        },
        "processingTime": "Real-time"
      },
      {
        "type": "INTERNET_BANKING",
        "supported": true,
        "maxAmount": 5000000.00,
        "supportedBanks": ["SCB", "KTB", "BBL", "KBANK", "TMB", "BAY"],
        "fees": {
          "percentage": 0,
          "fixedFee": 25
        },
        "processingTime": "1-2 hours"
      }
    ],
    "installments": [
      {
        "period": 6,
        "interestRate": 4.86,
        "minimumAmount": 5000.00
      },
      {
        "period": 12,
        "interestRate": 7.19,
        "minimumAmount": 10000.00
      }
    ]
  }
}
```

### 6.2 Payment Processing

#### Process Payment
```http
POST /api/v1/payments/process
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "policyId": "policy-uuid-def456",
  "paymentType": "PREMIUM", // PREMIUM, INSTALLMENT, CLAIM_SETTLEMENT, REFUND
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
  },
  "customerInfo": {
    "email": "somchai@example.com",
    "phone": "+66812345678"
  }
}

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "paymentId": "payment-uuid-789abc",
    "transactionId": "txn-202412271030-789",
    "status": "PROCESSING", // PROCESSING, SUCCESS, FAILED, PENDING_3DS
    "amount": 13961.00,
    "currency": "THB",
    "paymentMethod": {
      "type": "CREDIT_CARD",
      "maskedCardNumber": "****-****-****-1234",
      "cardType": "VISA"
    },
    "fees": {
      "processingFee": 348.78,
      "totalAmount": 14309.78
    },
    "threeDSecure": {
      "required": true,
      "redirectUrl": "https://3ds.payment-gateway.com/verify?token=3ds-token-xyz"
    },
    "receipt": {
      "receiptNumber": "RCP-2024-567890",
      "issuedAt": "2024-12-27T10:30:00Z"
    },
    "message": "3D Secure authentication required. Please complete verification."
  }
}
```

#### Verify 3D Secure Payment
```http
POST /api/v1/payments/{paymentId}/verify-3ds
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "threeDSecureResponse": "encrypted-3ds-response-token",
  "browserInfo": {
    "userAgent": "Mozilla/5.0...",
    "acceptHeader": "text/html,application/xhtml+xml",
    "language": "th-TH",
    "colorDepth": 24,
    "screenHeight": 1080,
    "screenWidth": 1920,
    "timeZoneOffset": -420
  }
}

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "paymentId": "payment-uuid-789abc",
    "status": "SUCCESS",
    "authorizationCode": "AUTH-123456",
    "capturedAmount": 14309.78,
    "capturedAt": "2024-12-27T10:32:00Z",
    "receipt": {
      "receiptNumber": "RCP-2024-567890",
      "receiptUrl": "https://receipts.autoinsurance.co.th/RCP-2024-567890.pdf"
    },
    "taxInvoice": {
      "invoiceNumber": "INV-2024-567890",
      "invoiceUrl": "https://invoices.autoinsurance.co.th/INV-2024-567890.pdf"
    },
    "message": "Payment completed successfully"
  }
}
```

#### Process PromptPay Payment
```http
POST /api/v1/payments/promptpay
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "policyId": "policy-uuid-def456",
  "amount": 13961.00,
  "customerPhone": "+66812345678",
  "description": "Premium payment for policy POL-2024-567890"
}

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "paymentId": "payment-promptpay-abc123",
    "promptPayQR": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "promptPayCode": "0201021129370016A000000677010111010213+66812345678530376405496200000054140065.00630427B",
    "amount": 13961.00,
    "expiryTime": "2024-12-27T10:45:00Z",
    "bankAccountNumber": "1234567890",
    "bankName": "ธนาคารกรุงเทพ",
    "reference1": "POL2024567890",
    "reference2": "PREMIUM",
    "instructions": [
      "Scan QR code with any banking app",
      "Or use PromptPay ID: +66812345678",
      "Payment will be auto-verified within 2 minutes"
    ],
    "statusCheckUrl": "https://api.autoinsurance.co.th/api/v1/payments/payment-promptpay-abc123/status",
    "message": "QR code generated. Please complete payment within 15 minutes."
  }
}
```

### 6.3 Payment History and Receipts

#### Get Payment History
```http
GET /api/v1/customers/{customerId}/payments?page=0&size=20&sort=createdAt,desc&status=SUCCESS
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment-uuid-789abc",
        "transactionId": "txn-202412271030-789",
        "policyNumber": "POL-2024-567890",
        "paymentType": "PREMIUM",
        "amount": 13961.00,
        "fees": 348.78,
        "totalAmount": 14309.78,
        "currency": "THB",
        "paymentMethod": {
          "type": "CREDIT_CARD",
          "last4": "1234"
        },
        "status": "SUCCESS",
        "createdAt": "2024-12-27T10:30:00Z",
        "completedAt": "2024-12-27T10:32:00Z",
        "receipt": {
          "receiptNumber": "RCP-2024-567890",
          "receiptUrl": "https://receipts.autoinsurance.co.th/RCP-2024-567890.pdf"
        },
        "taxInvoice": {
          "invoiceNumber": "INV-2024-567890",
          "invoiceUrl": "https://invoices.autoinsurance.co.th/INV-2024-567890.pdf"
        }
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 15,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    },
    "summary": {
      "totalPaid": 67805.00,
      "totalTransactions": 15,
      "averageAmount": 4520.33
    }
  }
}
```

#### Generate Tax Invoice
```http
POST /api/v1/payments/{paymentId}/tax-invoice
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "taxInfo": {
    "companyName": "บริษัท ตัวอย่าง จำกัด",
    "taxId": "0123456789012",
    "address": {
      "addressLine1": "999/1 อาคารสำนักงาน",
      "district": "คลองตัน",
      "province": "กรุงเทพมหานคร",
      "postalCode": "10110"
    }
  },
  "language": "th" // th, en
}

# Response
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "taxInvoiceId": "tax-invoice-uuid-def456",
    "invoiceNumber": "TAX-2024-567890",
    "issuedDate": "2024-12-27",
    "dueDate": "2025-01-26",
    "taxInvoiceUrl": "https://invoices.autoinsurance.co.th/TAX-2024-567890.pdf",
    "breakdown": {
      "subtotal": 12520.00,
      "vat": 876.40,
      "total": 13396.40
    },
    "message": "Tax invoice generated successfully"
  }
}
```

## 7. Reporting and Analytics APIs

### 7.1 Customer Dashboard APIs

#### Get Customer Dashboard
```http
GET /api/v1/customers/{customerId}/dashboard
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "overview": {
      "totalPolicies": 2,
      "activePolicies": 2,
      "expiringPolicies": 1,
      "totalClaims": 3,
      "activeClaims": 1,
      "totalPaid": 28450.00
    },
    "recentActivity": [
      {
        "type": "POLICY_RENEWED",
        "message": "Policy POL-2024-567890 renewed successfully",
        "date": "2024-12-20T10:30:00Z",
        "actionRequired": false
      },
      {
        "type": "CLAIM_APPROVED",
        "message": "Claim CLM-2024-123456 approved for repair",
        "date": "2024-12-18T14:15:00Z",
        "actionRequired": true,
        "actionUrl": "/claims/CLM-2024-123456"
      }
    ],
    "upcomingActions": [
      {
        "type": "POLICY_RENEWAL",
        "title": "Policy renewal due soon",
        "description": "Policy POL-2023-445566 expires on Jan 15, 2025",
        "dueDate": "2025-01-15",
        "actionUrl": "/policies/POL-2023-445566/renew",
        "priority": "HIGH"
      }
    ],
    "quickStats": {
      "noClaimYears": 3,
      "currentDiscount": 15.0,
      "nextDiscountLevel": 20.0,
      "totalSaved": 4500.00
    }
  }
}
```

### 7.2 Policy Analytics

#### Get Policy Portfolio Analysis
```http
GET /api/v1/customers/{customerId}/policies/analytics
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "portfolioValue": {
      "totalCoverageValue": 3500000.00,
      "totalPremiumsPaid": 42850.00,
      "averagePremium": 14283.33,
      "portfolioRisk": "MEDIUM"
    },
    "coverageAnalysis": {
      "underInsured": [
        {
          "vehicleId": "vehicle-uuid-older",
          "reason": "Vehicle value increased, coverage not updated",
          "recommendedAction": "Increase coverage by 200,000 THB"
        }
      ],
      "overInsured": [],
      "gapsInCoverage": [
        {
          "type": "FLOOD_PROTECTION",
          "risk": "HIGH",
          "reason": "Vehicle parked in flood-prone area"
        }
      ]
    },
    "claimsPerformance": {
      "claimFrequency": 0.15, // claims per policy per year
      "averageClaimAmount": 28500.00,
      "noClaimStreak": 24, // months
      "impactOnPremium": -15.0 // discount percentage
    },
    "renewalForecast": {
      "nextRenewalDate": "2025-06-15",
      "estimatedPremium": 13200.00,
      "estimatedDiscount": 20.0,
      "renewalRecommendation": "RECOMMEND_EARLY_RENEWAL"
    }
  }
}
```

### 7.3 Claims Analytics

#### Get Claims History Analysis
```http
GET /api/v1/customers/{customerId}/claims/analytics
Authorization: Bearer <jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "claimsOverview": {
      "totalClaims": 5,
      "successfulClaims": 4,
      "rejectedClaims": 1,
      "totalPaid": 145000.00,
      "averageClaimAmount": 36250.00,
      "averageProcessingTime": 12 // days
    },
    "claimsByType": [
      {
        "type": "ACCIDENT",
        "count": 3,
        "totalAmount": 125000.00,
        "averageAmount": 41666.67
      },
      {
        "type": "THEFT",
        "count": 1,
        "totalAmount": 20000.00,
        "averageAmount": 20000.00
      },
      {
        "type": "NATURAL_DISASTER",
        "count": 1,
        "totalAmount": 0.00, // rejected claim
        "averageAmount": 0.00
      }
    ],
    "trends": {
      "claimFrequencyTrend": "DECREASING",
      "averageAmountTrend": "STABLE",
      "processingTimeTrend": "IMPROVING"
    },
    "riskProfile": {
      "riskLevel": "MEDIUM",
      "factors": [
        "Frequent highway driving",
        "Parking in high-theft area",
        "Good driving record"
      ],
      "recommendations": [
        "Consider dash cam installation for evidence",
        "Use secure parking when available"
      ]
    }
  }
}
```

## 8. Admin and Reporting APIs

### 8.1 Administrative Reports

#### Generate Regulatory Report (OIC)
```http
POST /api/v1/admin/reports/regulatory/oic
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "reportType": "MONTHLY_STATISTICS",
  "period": {
    "startDate": "2024-12-01",
    "endDate": "2024-12-31"
  },
  "includeDetails": true,
  "format": "PDF" // PDF, EXCEL, JSON
}

# Response
HTTP/1.1 202 Accepted
{
  "success": true,
  "data": {
    "reportId": "report-oic-202412-uuid",
    "status": "GENERATING",
    "estimatedCompletion": "2024-12-27T10:35:00Z",
    "statusCheckUrl": "/api/v1/admin/reports/report-oic-202412-uuid/status",
    "message": "Report generation started. You will receive email notification when ready."
  }
}
```

#### Get Business Analytics Dashboard
```http
GET /api/v1/admin/analytics/dashboard?period=30d
Authorization: Bearer <admin_jwt_token>

# Response
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "kpiMetrics": {
      "totalPolicies": {
        "current": 15420,
        "previousPeriod": 14850,
        "growth": 3.84
      },
      "totalPremium": {
        "current": 285400000.00,
        "previousPeriod": 268900000.00,
        "growth": 6.14
      },
      "claimsRatio": {
        "current": 0.68,
        "previousPeriod": 0.72,
        "change": -5.56
      },
      "customerSatisfaction": {
        "current": 4.6,
        "previousPeriod": 4.4,
        "change": 4.55
      }
    },
    "salesMetrics": {
      "newPolicies": 850,
      "renewals": 1240,
      "cancellations": 125,
      "netGrowth": 1965,
      "conversionRate": 12.5,
      "averagePremium": 18500.00
    },
    "claimsMetrics": {
      "totalClaims": 456,
      "claimsApproved": 398,
      "claimsRejected": 58,
      "averageSettlementTime": 8.5, // days
      "totalPayout": 18750000.00,
      "fraudDetectionRate": 2.1
    },
    "customerMetrics": {
      "newCustomers": 720,
      "activeCustomers": 12850,
      "churnRate": 0.8,
      "averageCustomerValue": 22200.00,
      "netPromoterScore": 72
    },
    "revenueBreakdown": {
      "byPolicyType": [
        {"type": "CMI", "revenue": 45600000.00, "percentage": 16.0},
        {"type": "CLASS_1", "revenue": 171240000.00, "percentage": 60.0},
        {"type": "CLASS_2", "revenue": 51372000.00, "percentage": 18.0},
        {"type": "CLASS_3", "revenue": 17124000.00, "percentage": 6.0}
      ],
      "byRegion": [
        {"region": "Bangkok", "revenue": 142700000.00, "percentage": 50.0},
        {"region": "Central", "revenue": 57080000.00, "percentage": 20.0},
        {"region": "North", "revenue": 42810000.00, "percentage": 15.0},
        {"region": "Northeast", "revenue": 28540000.00, "percentage": 10.0},
        {"region": "South", "revenue": 14270000.00, "percentage": 5.0}
      ]
    }
  }
}
```

## 9. Error Handling

### 9.1 Standard Error Response Format

All API errors follow a consistent format:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email format is invalid"
      },
      {
        "field": "phoneNumber",
        "code": "REQUIRED",
        "message": "Phone number is required"
      }
    ],
    "timestamp": "2024-12-27T10:30:00Z",
    "requestId": "req-uuid-12345",
    "path": "/api/v1/customers/register"
  }
}
```

### 9.2 Error Codes

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

### 9.3 Thai-Specific Error Messages

```http
# Thai language error response
HTTP/1.1 400 Bad Request
Content-Type: application/json
Accept-Language: th

{
  "success": false,
  "error": {
    "code": "INVALID_NATIONAL_ID",
    "message": "เลขบัตรประจำตัวประชาชนไม่ถูกต้อง",
    "messageEn": "Invalid national ID number",
    "details": [
      {
        "field": "nationalId",
        "code": "INVALID_FORMAT",
        "message": "เลขบัตรประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก",
        "messageEn": "National ID must be 13 digits"
      }
    ],
    "timestamp": "2024-12-27T10:30:00Z",
    "requestId": "req-uuid-12345"
  }
}
```

## 10. API Testing and Documentation

### 10.1 OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:
- **Swagger UI**: `https://api.autoinsurance.co.th/swagger-ui.html`
- **OpenAPI JSON**: `https://api.autoinsurance.co.th/v3/api-docs`
- **Postman Collection**: Available for download from developer portal

### 10.2 Testing Environments

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| Development | `https://api-dev.autoinsurance.co.th/api/v1` | Development testing |
| Staging | `https://api-staging.autoinsurance.co.th/api/v1` | Pre-production testing |
| Production | `https://api.autoinsurance.co.th/api/v1` | Production environment |

### 10.3 SDK and Libraries

Official SDKs are available for:
- **JavaScript/TypeScript**: `npm install @autoinsurance-th/api-client`
- **Java**: Maven dependency available
- **PHP**: Composer package available
- **Python**: PyPI package available

### 10.4 Webhooks

The API supports webhooks for real-time event notifications:

```http
# Webhook payload example
POST https://your-app.com/webhooks/autoinsurance
Content-Type: application/json
X-Auto-Insurance-Signature: sha256=...

{
  "event": "policy.created",
  "timestamp": "2024-12-27T10:30:00Z",
  "data": {
    "policyId": "policy-uuid-def456",
    "policyNumber": "POL-2024-567890",
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "ACTIVE"
  }
}
```

Available webhook events:
- `policy.created`
- `policy.renewed`
- `policy.cancelled`
- `claim.reported`
- `claim.approved`
- `claim.settled`
- `payment.completed`
- `payment.failed`

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-27  
**API Version**: v1.0  
**Contact**: api-support@autoinsurance.co.th