-- Initial schema for Thai Auto Insurance application

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    phone_verified BOOLEAN NOT NULL DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_token_expiry TIMESTAMP,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    account_locked BOOLEAN NOT NULL DEFAULT false,
    account_locked_at TIMESTAMP,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    password_change_required BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);


-- Customers table
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(13) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_thai VARCHAR(100),
    last_name_thai VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    phone_number VARCHAR(10) NOT NULL,
    email VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    district VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(5),
    occupation_category VARCHAR(50),
    occupation_detail VARCHAR(100),
    monthly_income DECIMAL(12,2),
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    kyc_verified_at DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Vehicles table
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(10) UNIQUE NOT NULL,
    chassis_number VARCHAR(50) UNIQUE NOT NULL,
    engine_number VARCHAR(50) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacture_year INTEGER NOT NULL,
    color VARCHAR(30),
    vehicle_type VARCHAR(20) NOT NULL,
    fuel_type VARCHAR(20),
    engine_size DECIMAL(5,2),
    seating_capacity INTEGER,
    weight DECIMAL(8,2),
    market_value DECIMAL(12,2),
    registration_date DATE,
    registration_province VARCHAR(100),
    usage_type VARCHAR(20) NOT NULL,
    annual_mileage INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Policies table
CREATE TABLE policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    policy_type VARCHAR(20) NOT NULL,
    coverage_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    premium_amount DECIMAL(12,2) NOT NULL,
    sum_insured DECIMAL(12,2),
    deductible DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    discount_percentage DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    agent_commission DECIMAL(10,2),
    remarks VARCHAR(1000),
    issued_date DATE,
    cancelled_date DATE,
    cancellation_reason VARCHAR(500),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id),
    agent_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Claims table
CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TIMESTAMP,
    incident_location VARCHAR(500) NOT NULL,
    incident_description TEXT NOT NULL,
    incident_type VARCHAR(30) NOT NULL,
    police_report_number VARCHAR(50),
    third_party_involved BOOLEAN NOT NULL DEFAULT false,
    third_party_details VARCHAR(1000),
    estimated_damage_amount DECIMAL(12,2),
    claimed_amount DECIMAL(12,2),
    approved_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    priority_level VARCHAR(10) DEFAULT 'NORMAL',
    reported_date DATE NOT NULL,
    investigated_date DATE,
    approved_date DATE,
    rejected_date DATE,
    closed_date DATE,
    rejection_reason VARCHAR(1000),
    adjuster_notes VARCHAR(2000),
    settlement_notes VARCHAR(2000),
    policy_id BIGINT NOT NULL REFERENCES policies(id),
    adjuster_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Claim documents table
CREATE TABLE claim_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT,
    document_type VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    is_required BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    claim_id BIGINT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Payments table
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_reference VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    due_date DATE,
    confirmed_date TIMESTAMP,
    transaction_id VARCHAR(100),
    gateway_response VARCHAR(1000),
    failure_reason VARCHAR(500),
    notes VARCHAR(1000),
    bank_code VARCHAR(10),
    bank_name VARCHAR(100),
    account_number VARCHAR(20),
    promptpay_ref VARCHAR(50),
    slip_image_path VARCHAR(500),
    policy_id BIGINT NOT NULL REFERENCES policies(id),
    processed_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE INDEX idx_customers_national_id ON customers(national_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone_number);

CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_chassis_number ON vehicles(chassis_number);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);

CREATE INDEX idx_policies_number ON policies(policy_number);
CREATE INDEX idx_policies_customer ON policies(customer_id);
CREATE INDEX idx_policies_vehicle ON policies(vehicle_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_expiry ON policies(end_date);

CREATE INDEX idx_claims_number ON claims(claim_number);
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_incident_date ON claims(incident_date);

CREATE INDEX idx_claim_documents_claim ON claim_documents(claim_id);
CREATE INDEX idx_claim_documents_type ON claim_documents(document_type);

CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_policy ON payments(policy_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);