export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  firstNameThai?: string;
  lastNameThai?: string;
  fullName: string;
  nationalId?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: Address;
  role: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  profileImageUrl?: string;
  preferredLanguage?: 'th' | 'en';
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  firstNameThai?: string;
  lastNameThai?: string;
  nationalId: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  address: Address;
  preferredLanguage: 'th' | 'en';
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  firstNameThai?: string;
  lastNameThai?: string;
  phoneNumber?: string;
  address?: Address;
  profileImageUrl?: string;
  preferredLanguage?: 'th' | 'en';
}

export interface Address {
  id?: string;
  houseNumber: string;
  moo?: string; // หมู่ - Thai village/subdivision number
  soi?: string; // ซอย - Thai soi (sub-street)
  street: string;
  subdistrict: string; // ตำบล/แขวง
  district: string; // อำเภอ/เขต
  province: string; // จังหวัด
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface UserProfile extends User {
  statistics: {
    totalPolicies: number;
    activePolicies: number;
    totalClaims: number;
    pendingClaims: number;
  };
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // Duration in milliseconds
}

export interface RegisterRequest extends CreateUserRequest {
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}