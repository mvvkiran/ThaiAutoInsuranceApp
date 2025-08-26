// Common API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  messageThai?: string;
  errors?: ValidationError[];
  timestamp: Date;
  path: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  messageThai?: string;
  code: string;
  rejectedValue?: any;
}

// Pagination and Sorting
export interface PageRequest {
  page: number;
  size: number;
  sort?: SortRequest[];
}

export interface SortRequest {
  property: string;
  direction: 'ASC' | 'DESC';
}

// Filter interfaces
export interface FilterCriteria {
  field: string;
  operator: FilterOperator;
  value: any;
  values?: any[]; // For IN, NOT_IN operators
}

export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT_LIKE',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  IS_NULL = 'IS_NULL',
  IS_NOT_NULL = 'IS_NOT_NULL',
  BETWEEN = 'BETWEEN',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  CONTAINS = 'CONTAINS'
}

// Search and filter request
export interface SearchRequest {
  query?: string;
  filters?: FilterCriteria[];
  pagination: PageRequest;
}

// File upload interfaces
export interface FileUploadResponse {
  id: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface FileUploadRequest {
  file: File;
  category?: string;
  description?: string;
  isPublic?: boolean;
}

// Document Status enum - shared between models
export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

// Notification interfaces
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  titleThai?: string;
  message: string;
  messageThai?: string;
  isRead: boolean;
  priority: NotificationPriority;
  relatedEntityId?: string;
  relatedEntityType?: string;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

export enum NotificationType {
  POLICY_REMINDER = 'POLICY_REMINDER',
  POLICY_RENEWAL = 'POLICY_RENEWAL',
  POLICY_EXPIRY = 'POLICY_EXPIRY',
  CLAIM_UPDATE = 'CLAIM_UPDATE',
  CLAIM_APPROVED = 'CLAIM_APPROVED',
  CLAIM_REJECTED = 'CLAIM_REJECTED',
  PAYMENT_DUE = 'PAYMENT_DUE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  PROMOTIONAL = 'PROMOTIONAL',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Geographic data for Thailand
export interface Province {
  id: string;
  name: string;
  nameEnglish: string;
  code: string;
  region: ThaiRegion;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  nameEnglish: string;
  code: string;
  provinceId: string;
  subdistricts: Subdistrict[];
}

export interface Subdistrict {
  id: string;
  name: string;
  nameEnglish: string;
  code: string;
  districtId: string;
  postalCodes: string[];
}

export enum ThaiRegion {
  NORTHERN = 'NORTHERN',
  NORTHEASTERN = 'NORTHEASTERN', 
  CENTRAL = 'CENTRAL',
  EASTERN = 'EASTERN',
  WESTERN = 'WESTERN',
  SOUTHERN = 'SOUTHERN'
}

// Audit trail
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  username: string;
  userRole: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}

// System configuration
export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
  category: string;
  isPublic: boolean;
  isEditable: boolean;
  dataType: ConfigDataType;
  validationRules?: ValidationRule[];
  updatedAt: Date;
  updatedBy: string;
}

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
}

export enum ConfigDataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  JSON = 'JSON'
}

export enum ValidationType {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  PATTERN = 'PATTERN',
  EMAIL = 'EMAIL',
  URL = 'URL'
}

// Dashboard and analytics
export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  expiringSoon: number; // Next 30 days
  totalClaims: number;
  pendingClaims: number;
  settledClaims: number;
  totalPremiumCollected: number;
  totalClaimsPaid: number;
  customerCount: number;
  newCustomersThisMonth: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Thai specific utilities
export interface ThaiNationalIdInfo {
  isValid: boolean;
  province?: string;
  district?: string;
  birthYear?: number;
  gender?: 'MALE' | 'FEMALE';
}

export interface ThaiPhoneNumber {
  number: string;
  isValid: boolean;
  operator?: string;
  type: 'MOBILE' | 'LANDLINE';
}

// Error handling
export interface AppError {
  code: string;
  message: string;
  messageThai?: string;
  details?: any;
  timestamp: Date;
  path?: string;
  method?: string;
  statusCode?: number;
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION'
}

// Application state
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: AppError | null;
}

// Language support
export interface TranslationKey {
  en: string;
  th: string;
}

export interface LanguageOption {
  code: 'th' | 'en';
  name: string;
  nativeName: string;
  flag: string;
}