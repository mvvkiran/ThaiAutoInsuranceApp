import { DocumentStatus } from './common.model';

export interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  vehicleId: string;
  coverageType: CoverageType;
  coverageDetails: CoverageDetails;
  premium: Premium;
  status: PolicyStatus;
  effectiveDate: Date;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  agentId?: string;
  notes?: string;
  renewalQuoteId?: string;
  isRenewable: boolean;
}

export interface CreatePolicyRequest {
  customerId: string;
  vehicleId: string;
  coverageType: CoverageType;
  coverageOptions: CoverageOptions;
  effectiveDate: Date;
  agentId?: string;
  discountCodes?: string[];
}

export interface PolicyQuote {
  id: string;
  customerId: string;
  vehicleId: string;
  coverageType: CoverageType;
  coverageOptions: CoverageOptions;
  calculatedPremium: Premium;
  factors: PremiumFactors;
  validUntil: Date;
  createdAt: Date;
  status: QuoteStatus;
  agentId?: string;
  discounts: Discount[];
}

export interface CoverageDetails {
  bodilyInjuryPerPerson: number;
  bodilyInjuryPerAccident: number;
  propertyDamage: number;
  medicalExpenses: number;
  personalAccident: number;
  bailBond?: number;
  vehicleDamage?: {
    sumInsured: number;
    deductible: number;
  };
  theft?: {
    sumInsured: number;
    deductible: number;
  };
  flood?: {
    sumInsured: number;
    deductible: number;
  };
  fire?: {
    sumInsured: number;
    deductible: number;
  };
}

export interface CoverageOptions {
  bodilyInjuryPerPerson: number;
  bodilyInjuryPerAccident: number;
  propertyDamage: number;
  medicalExpenses: number;
  personalAccident: number;
  includeBailBond: boolean;
  includeVehicleDamage: boolean;
  includeTheft: boolean;
  includeFlood: boolean;
  includeFire: boolean;
  vehicleSumInsured?: number;
  deductibleAmount?: number;
}

export interface Premium {
  basePremium: number;
  taxes: number;
  fees: number;
  discountAmount: number;
  totalPremium: number;
  paymentFrequency: PaymentFrequency;
  installmentAmount?: number;
}

export interface PremiumFactors {
  basePremium: number;
  vehicleFactors: {
    ageMultiplier: number;
    makeModelMultiplier: number;
    engineSizeMultiplier: number;
    usageMultiplier: number;
  };
  driverFactors: {
    ageMultiplier: number;
    experienceMultiplier: number;
    claimsHistoryMultiplier: number;
  };
  locationFactors: {
    provinceMultiplier: number;
    riskZoneMultiplier: number;
  };
  coverageFactors: {
    coverageTypeMultiplier: number;
    deductibleMultiplier: number;
  };
}

export interface Discount {
  id: string;
  code: string;
  description: string;
  descriptionThai: string;
  type: DiscountType;
  value: number;
  isPercentage: boolean;
  validFrom: Date;
  validTo: Date;
  conditions: DiscountCondition[];
}

export interface DiscountCondition {
  field: string;
  operator: string;
  value: any;
  description: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  registrationNumber: string;
  province: string;
  make: string;
  model: string;
  year: number;
  engineSize: number;
  fuelType: FuelType;
  bodyType: BodyType;
  color: string;
  chassisNumber: string;
  engineNumber: string;
  usage: VehicleUsage;
  isFinanced: boolean;
  financierName?: string;
  modifications: VehicleModification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleModification {
  type: string;
  description: string;
  value: number;
  installedDate: Date;
}

export enum CoverageType {
  COMPULSORY = 'COMPULSORY', // ประกันภัยภาคบังคับ (พ.ร.บ.)
  VOLUNTARY_TYPE_1 = 'VOLUNTARY_TYPE_1', // ประกันภัยชั้น 1
  VOLUNTARY_TYPE_2_PLUS = 'VOLUNTARY_TYPE_2_PLUS', // ประกันภัยชั้น 2+
  VOLUNTARY_TYPE_2 = 'VOLUNTARY_TYPE_2', // ประกันภัยชั้น 2
  VOLUNTARY_TYPE_3_PLUS = 'VOLUNTARY_TYPE_3_PLUS', // ประกันภัยชั้น 3+
  VOLUNTARY_TYPE_3 = 'VOLUNTARY_TYPE_3' // ประกันภัยชั้น 3
}

export enum PolicyStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED'
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED'
}

export enum PaymentFrequency {
  ANNUALLY = 'ANNUALLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY'
}

export enum DiscountType {
  NO_CLAIMS_BONUS = 'NO_CLAIMS_BONUS',
  MULTI_POLICY = 'MULTI_POLICY',
  GOOD_DRIVER = 'GOOD_DRIVER',
  SAFETY_FEATURES = 'SAFETY_FEATURES',
  PROMOTIONAL = 'PROMOTIONAL',
  LOYALTY = 'LOYALTY'
}

export enum FuelType {
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL',
  HYBRID = 'HYBRID',
  ELECTRIC = 'ELECTRIC',
  LPG = 'LPG',
  NGV = 'NGV'
}

export enum BodyType {
  SEDAN = 'SEDAN',
  HATCHBACK = 'HATCHBACK',
  SUV = 'SUV',
  PICKUP = 'PICKUP',
  VAN = 'VAN',
  COUPE = 'COUPE',
  CONVERTIBLE = 'CONVERTIBLE',
  MOTORCYCLE = 'MOTORCYCLE'
}

export enum VehicleUsage {
  PERSONAL = 'PERSONAL',
  COMMERCIAL = 'COMMERCIAL',
  TAXI = 'TAXI',
  RENTAL = 'RENTAL',
  DELIVERY = 'DELIVERY'
}

export interface PolicyDocument {
  id: string;
  policyId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  isRequired: boolean;
  status: DocumentStatus;
}

export enum DocumentType {
  POLICY_CERTIFICATE = 'POLICY_CERTIFICATE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  NATIONAL_ID = 'NATIONAL_ID',
  VEHICLE_INSPECTION = 'VEHICLE_INSPECTION',
  MODIFICATION_CERTIFICATE = 'MODIFICATION_CERTIFICATE'
}


export interface RenewalNotification {
  id: string;
  policyId: string;
  customerId: string;
  expirationDate: Date;
  reminderType: ReminderType;
  sentAt: Date;
  isRead: boolean;
  renewalQuoteId?: string;
}

export enum ReminderType {
  SIXTY_DAYS = 'SIXTY_DAYS',
  THIRTY_DAYS = 'THIRTY_DAYS',
  SEVEN_DAYS = 'SEVEN_DAYS',
  ONE_DAY = 'ONE_DAY',
  EXPIRED = 'EXPIRED'
}