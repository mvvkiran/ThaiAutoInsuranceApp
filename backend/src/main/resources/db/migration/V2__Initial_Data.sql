-- Initial data for Thai Auto Insurance application

-- Insert default admin user with role
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_active, password_changed_at, role, email_verified, phone_verified, account_locked, failed_login_attempts, password_change_required, created_at, updated_at)
VALUES ('admin', 'admin@thaiinsurance.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'System', 'Administrator', '0812345678', true, CURRENT_TIMESTAMP, 'ADMIN', true, true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample agent user with role
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_active, password_changed_at, role, email_verified, phone_verified, account_locked, failed_login_attempts, password_change_required, created_at, updated_at)
VALUES ('agent1', 'agent1@thaiinsurance.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Somchai', 'Jaidee', '0887654321', true, CURRENT_TIMESTAMP, 'AGENT', true, true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample claims adjuster user with role
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_active, password_changed_at, role, email_verified, phone_verified, account_locked, failed_login_attempts, password_change_required, created_at, updated_at)
VALUES ('adjuster1', 'adjuster1@thaiinsurance.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Siriporn', 'Kasemsri', '0891234567', true, CURRENT_TIMESTAMP, 'CLAIMS_ADJUSTER', true, true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample customer user with role
INSERT INTO users (username, email, password, first_name, last_name, phone_number, is_active, password_changed_at, role, email_verified, phone_verified, account_locked, failed_login_attempts, password_change_required, created_at, updated_at)
VALUES ('customer1', 'customer1@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Niran', 'Thanakit', '0823456789', true, CURRENT_TIMESTAMP, 'CUSTOMER', true, true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample customer data
INSERT INTO customers (national_id, first_name, last_name, first_name_thai, last_name_thai, date_of_birth, gender, phone_number, email, address_line1, district, province, postal_code, occupation_category, monthly_income, kyc_status, user_id, is_active, created_at, updated_at)
SELECT '1234567890123', 'Niran', 'Thanakit', 'นิรันดร์', 'ธนกิจ', '1985-05-15', 'MALE', '0823456789', 'customer1@email.com', '123/45 Sukhumvit Road', 'Khlong Toei', 'Bangkok', '10110', 'PRIVATE_EMPLOYEE', 50000.00, 'VERIFIED', id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE username = 'customer1';

-- Insert sample vehicle  
INSERT INTO vehicles (license_plate, chassis_number, engine_number, make, model, manufacture_year, color, vehicle_type, fuel_type, engine_size, seating_capacity, weight, market_value, registration_date, registration_province, usage_type, customer_id, is_active, created_at, updated_at)
SELECT 'กก1234', 'TH1234567890123456', 'EN1234567890', 'Toyota', 'Camry', 2020, 'Silver', 'SEDAN', 'GASOLINE', 2.5, 5, 1500.00, 800000.00, '2020-03-15', 'Bangkok', 'PRIVATE', id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM customers WHERE national_id = '1234567890123';

-- Insert sample policy
INSERT INTO policies (policy_number, policy_type, coverage_type, start_date, end_date, premium_amount, sum_insured, deductible, status, tax_amount, total_amount, issued_date, customer_id, vehicle_id, agent_id, created_at, updated_at)
SELECT 'POL-20240101-000001', 'VOLUNTARY', 'COMPREHENSIVE', '2024-01-01', '2024-12-31', 15000.00, 800000.00, 5000.00, 'ACTIVE', 1050.00, 16050.00, '2023-12-28', c.id, v.id, u.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM customers c, vehicles v, users u
WHERE c.national_id = '1234567890123' 
AND v.license_plate = 'กก1234'
AND u.username = 'agent1';

-- Note: Password for all sample users is 'password123' (BCrypt encoded: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.)