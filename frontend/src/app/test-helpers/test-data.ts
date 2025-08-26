import { User, Policy, Claim, LoginRequest, RegisterRequest } from '../core/models';

export const TEST_DATA = {
  // Thai National ID test data
  VALID_THAI_IDS: [
    '1234567890123',
    '3456789012345',
    '5678901234567'
  ],
  
  INVALID_THAI_IDS: [
    '1234567890124', // Wrong checksum
    '123456789012',  // Too short
    '12345678901234', // Too long
    'abcd567890123',  // Contains letters
    '0000000000000'   // All zeros
  ],

  // Thai phone number test data
  VALID_THAI_PHONES: [
    '0812345678',
    '0987654321',
    '02-123-4567',
    '037-123456',
    '+66812345678',
    '66812345678'
  ],

  INVALID_THAI_PHONES: [
    '123456789',     // Too short
    '08123456789',   // Too long
    '0712345678',    // Invalid prefix for mobile
    'abc1234567'     // Contains letters
  ],

  // Thai addresses
  THAI_ADDRESSES: {
    BANGKOK: {
      address: '123 ถนนสุขุมวิท',
      district: 'วัฒนา',
      subDistrict: 'ลุมพินี',
      province: 'กรุงเทพมหานคร',
      postalCode: '10330'
    },
    CHIANG_MAI: {
      address: '456 ถนนนิมมานเหมินท์',
      district: 'เมือง',
      subDistrict: 'สุเทพ',
      province: 'เชียงใหม่',
      postalCode: '50200'
    }
  },

  // Currency test data
  THAI_CURRENCIES: [
    { amount: 1000, expected: '1,000.00 ฿' },
    { amount: 50000.50, expected: '50,000.50 ฿' },
    { amount: 1234567.89, expected: '1,234,567.89 ฿' },
    { amount: 0, expected: '0.00 ฿' },
    { amount: -500, expected: '-500.00 ฿' }
  ],

  // Date test data
  THAI_DATES: [
    { date: new Date('2024-01-15'), expected: '15 มกราคม 2567' },
    { date: new Date('2023-12-31'), expected: '31 ธันวาคม 2566' },
    { date: new Date('2024-06-30'), expected: '30 มิถุนายน 2567' }
  ]
};

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '0812345678',
    nationalId: '1234567890123',
    role: 'CUSTOMER',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    address: TEST_DATA.THAI_ADDRESSES.BANGKOK
  },
  {
    id: '2',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '0987654321',
    nationalId: '3456789012345',
    role: 'ADMIN',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    address: TEST_DATA.THAI_ADDRESSES.CHIANG_MAI
  },
  {
    id: '3',
    email: 'super.admin@example.com',
    firstName: 'Super',
    lastName: 'Admin',
    phoneNumber: '0611111111',
    nationalId: '5678901234567',
    role: 'SUPER_ADMIN',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    address: TEST_DATA.THAI_ADDRESSES.BANGKOK
  }
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'POL-001',
    policyNumber: 'TH-2024-001234',
    customerId: '1',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      licensePlate: 'กก-1234',
      chassisNumber: 'ABC123456789',
      engineNumber: 'ENG123456'
    },
    coverageType: 'COMPREHENSIVE',
    premium: 15000,
    coverageAmount: 1000000,
    deductible: 5000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'ACTIVE',
    paymentStatus: 'PAID',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'POL-002',
    policyNumber: 'TH-2024-001235',
    customerId: '1',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      licensePlate: 'ขข-5678',
      chassisNumber: 'DEF987654321',
      engineNumber: 'ENG987654'
    },
    coverageType: 'THIRD_PARTY',
    premium: 8000,
    coverageAmount: 500000,
    deductible: 0,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-01-31'),
    status: 'PENDING',
    paymentStatus: 'PENDING',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'CLM-001',
    claimNumber: 'TH-CLM-2024-001',
    policyId: 'POL-001',
    customerId: '1',
    incidentDate: new Date('2024-03-15'),
    reportedDate: new Date('2024-03-16'),
    description: 'Minor collision with another vehicle',
    status: 'IN_PROGRESS',
    claimAmount: 25000,
    approvedAmount: 22000,
    documents: [
      { id: '1', filename: 'police_report.pdf', type: 'POLICE_REPORT' },
      { id: '2', filename: 'damage_photos.jpg', type: 'DAMAGE_PHOTO' }
    ],
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'CLM-002',
    claimNumber: 'TH-CLM-2024-002',
    policyId: 'POL-001',
    customerId: '1',
    incidentDate: new Date('2024-04-10'),
    reportedDate: new Date('2024-04-10'),
    description: 'Windshield crack from flying debris',
    status: 'APPROVED',
    claimAmount: 3000,
    approvedAmount: 3000,
    documents: [
      { id: '3', filename: 'windshield_photo.jpg', type: 'DAMAGE_PHOTO' }
    ],
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-12')
  }
];

export const MOCK_LOGIN_REQUESTS: LoginRequest[] = [
  {
    email: 'john.doe@example.com',
    password: 'ValidPassword123!'
  },
  {
    email: 'admin@example.com',
    password: 'AdminPassword123!'
  }
];

export const MOCK_REGISTER_REQUESTS: RegisterRequest[] = [
  {
    email: 'new.user@example.com',
    password: 'NewPassword123!',
    confirmPassword: 'NewPassword123!',
    firstName: 'New',
    lastName: 'User',
    phoneNumber: '0823456789',
    nationalId: '7890123456789',
    address: TEST_DATA.THAI_ADDRESSES.BANGKOK
  }
];

export const MOCK_API_RESPONSES = {
  LOGIN_SUCCESS: {
    success: true,
    message: 'Login successful',
    data: {
      user: MOCK_USERS[0],
      accessToken: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      tokenType: 'Bearer',
      expiresIn: 3600000 // 1 hour in milliseconds
    }
  },
  
  LOGIN_FAILURE: {
    success: false,
    message: 'Invalid credentials',
    data: null
  },
  
  REGISTER_SUCCESS: {
    success: true,
    message: 'Registration successful',
    data: MOCK_USERS[0]
  },
  
  POLICIES_LIST: {
    success: true,
    message: 'Policies retrieved successfully',
    data: MOCK_POLICIES
  },
  
  CLAIMS_LIST: {
    success: true,
    message: 'Claims retrieved successfully',
    data: MOCK_CLAIMS
  },
  
  ERROR_RESPONSE: {
    success: false,
    message: 'Internal server error',
    data: null
  }
};

export const MOCK_FORM_ERRORS = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid Thai phone number',
  INVALID_NATIONAL_ID: 'Please enter a valid Thai national ID',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_DATE: 'Please enter a valid date'
};

export const MOCK_TRANSLATION_DATA = {
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'dashboard.welcome': 'Welcome',
    'policy.title': 'Insurance Policies',
    'claim.title': 'Claims'
  },
  th: {
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.delete': 'ลบ',
    'auth.login': 'เข้าสู่ระบบ',
    'auth.register': 'สมัครสมาชิก',
    'auth.logout': 'ออกจากระบบ',
    'dashboard.welcome': 'ยินดีต้อนรับ',
    'policy.title': 'กรมธรรม์ประกันภัย',
    'claim.title': 'การเรียกร้อง'
  }
};