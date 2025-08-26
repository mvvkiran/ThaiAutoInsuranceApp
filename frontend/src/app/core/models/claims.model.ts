import { DocumentStatus } from './common.model';

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  customerId: string;
  vehicleId: string;
  incidentDate: Date;
  reportedDate: Date;
  claimType: ClaimType;
  status: ClaimStatus;
  description: string;
  descriptionThai?: string;
  incidentLocation: Location;
  damages: Damage[];
  totalClaimAmount: number;
  approvedAmount?: number;
  deductibleAmount: number;
  policeReportNumber?: string;
  isPoliceReportRequired: boolean;
  assignedAdjusterId?: string;
  createdAt: Date;
  updatedAt: Date;
  settledAt?: Date;
  closedAt?: Date;
  notes: ClaimNote[];
}

export interface CreateClaimRequest {
  policyId: string;
  incidentDate: Date;
  claimType: ClaimType;
  description: string;
  descriptionThai?: string;
  incidentLocation: Location;
  damages: CreateDamageRequest[];
  policeReportNumber?: string;
  witnesses: Witness[];
  thirdPartyInfo?: ThirdPartyInfo;
}

export interface Damage {
  id: string;
  claimId: string;
  type: DamageType;
  category: DamageCategory;
  description: string;
  estimatedCost: number;
  approvedCost?: number;
  repairShopId?: string;
  repairShopName?: string;
  isThirdParty: boolean;
  photos: ClaimPhoto[];
  receipts: ClaimDocument[];
  status: DamageStatus;
}

export interface CreateDamageRequest {
  type: DamageType;
  category: DamageCategory;
  description: string;
  estimatedCost: number;
  isThirdParty: boolean;
  photos: File[];
}

export interface Location {
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  landmarks?: string;
}

export interface Witness {
  name: string;
  phoneNumber: string;
  nationalId?: string;
  relationship: string; // เพื่อน, ครอบครัว, คนแปลกหน้า, etc.
  statement: string;
}

export interface ThirdPartyInfo {
  driverName: string;
  phoneNumber: string;
  nationalId?: string;
  vehicleRegistration: string;
  insuranceCompany?: string;
  policyNumber?: string;
  damages: ThirdPartyDamage[];
}

export interface ThirdPartyDamage {
  type: 'VEHICLE' | 'PROPERTY' | 'INJURY';
  description: string;
  estimatedCost: number;
  photos: File[];
}

export interface ClaimPhoto {
  id: string;
  claimId?: string;
  damageId?: string;
  fileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
  isEvidence: boolean;
  category: PhotoCategory;
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  type: ClaimDocumentType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  isRequired: boolean;
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface ClaimNote {
  id: string;
  claimId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  isInternal: boolean;
  isSystemGenerated: boolean;
  createdAt: Date;
  attachments: ClaimDocument[];
}

export interface ClaimTimeline {
  id: string;
  claimId: string;
  action: TimelineAction;
  description: string;
  performedBy: string;
  performedByRole: string;
  timestamp: Date;
  oldStatus?: ClaimStatus;
  newStatus?: ClaimStatus;
  metadata?: any;
}

export interface ClaimPayment {
  id: string;
  claimId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  recipientType: RecipientType;
  recipientName: string;
  recipientAccount?: string;
  reference: string;
  status: PaymentStatus;
  approvedBy: string;
  paidBy?: string;
  createdAt: Date;
}

export interface RepairShop {
  id: string;
  name: string;
  nameEnglish: string;
  address: string;
  phoneNumber: string;
  email?: string;
  licenseNumber: string;
  specializations: string[];
  rating: number;
  isPreferred: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export enum ClaimType {
  COLLISION = 'COLLISION', // ชนกัน
  COMPREHENSIVE = 'COMPREHENSIVE', // เสียหายจากภัยอื่นๆ
  THEFT = 'THEFT', // รถหาย
  FIRE = 'FIRE', // ไฟไหม้
  FLOOD = 'FLOOD', // น้ำท่วม
  GLASS = 'GLASS', // กระจกแตก
  PERSONAL_INJURY = 'PERSONAL_INJURY', // การบาดเจ็บส่วนบุคคล
  THIRD_PARTY_LIABILITY = 'THIRD_PARTY_LIABILITY', // ความรับผิดชอบต่อบุคคลที่สาม
  WINDSHIELD = 'WINDSHIELD', // กระจกหน้ารถ
  VANDALISM = 'VANDALISM' // การทำลายทรัพย์สิน
}

export enum ClaimStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INVESTIGATING = 'INVESTIGATING',
  PENDING_DOCUMENTS = 'PENDING_DOCUMENTS',
  APPROVED = 'APPROVED',
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',
  REJECTED = 'REJECTED',
  SETTLED = 'SETTLED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum DamageType {
  VEHICLE_DAMAGE = 'VEHICLE_DAMAGE',
  THIRD_PARTY_PROPERTY = 'THIRD_PARTY_PROPERTY',
  BODILY_INJURY = 'BODILY_INJURY',
  MEDICAL_EXPENSES = 'MEDICAL_EXPENSES',
  LOST_INCOME = 'LOST_INCOME',
  RENTAL_CAR = 'RENTAL_CAR',
  TOWING = 'TOWING'
}

export enum DamageCategory {
  BODY = 'BODY',
  ENGINE = 'ENGINE',
  INTERIOR = 'INTERIOR',
  ELECTRICAL = 'ELECTRICAL',
  SUSPENSION = 'SUSPENSION',
  WHEELS_TIRES = 'WHEELS_TIRES',
  GLASS = 'GLASS',
  LIGHTS = 'LIGHTS',
  OTHER = 'OTHER'
}

export enum DamageStatus {
  REPORTED = 'REPORTED',
  ASSESSED = 'ASSESSED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REPAIRED = 'REPAIRED'
}

export enum PhotoCategory {
  OVERALL_DAMAGE = 'OVERALL_DAMAGE',
  SPECIFIC_DAMAGE = 'SPECIFIC_DAMAGE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  SCENE = 'SCENE',
  THIRD_PARTY = 'THIRD_PARTY',
  POLICE_REPORT = 'POLICE_REPORT',
  RECEIPT = 'RECEIPT'
}

export enum ClaimDocumentType {
  POLICE_REPORT = 'POLICE_REPORT',
  MEDICAL_REPORT = 'MEDICAL_REPORT',
  REPAIR_ESTIMATE = 'REPAIR_ESTIMATE',
  REPAIR_INVOICE = 'REPAIR_INVOICE',
  MEDICAL_RECEIPT = 'MEDICAL_RECEIPT',
  TOWING_RECEIPT = 'TOWING_RECEIPT',
  RENTAL_RECEIPT = 'RENTAL_RECEIPT',
  WITNESS_STATEMENT = 'WITNESS_STATEMENT',
  ADJUSTER_REPORT = 'ADJUSTER_REPORT',
  THIRD_PARTY_INSURANCE = 'THIRD_PARTY_INSURANCE'
}


export enum TimelineAction {
  CLAIM_CREATED = 'CLAIM_CREATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_APPROVED = 'DOCUMENT_APPROVED',
  DOCUMENT_REJECTED = 'DOCUMENT_REJECTED',
  ADJUSTER_ASSIGNED = 'ADJUSTER_ASSIGNED',
  ESTIMATE_RECEIVED = 'ESTIMATE_RECEIVED',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  PAYMENT_MADE = 'PAYMENT_MADE',
  NOTE_ADDED = 'NOTE_ADDED'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CASH = 'CASH',
  DIRECT_PAY = 'DIRECT_PAY' // จ่ายตรงให้อู่ซ่อม
}

export enum RecipientType {
  CUSTOMER = 'CUSTOMER',
  REPAIR_SHOP = 'REPAIR_SHOP',
  MEDICAL_PROVIDER = 'MEDICAL_PROVIDER',
  THIRD_PARTY = 'THIRD_PARTY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}