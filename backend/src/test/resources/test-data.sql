-- Test data for Thai Auto Insurance Backend
-- This file contains realistic test data for Thailand context

-- Test Users
INSERT INTO users (id, username, email, password, is_enabled, created_at, updated_at) VALUES
(1, 'admin_test', 'admin@test.thai-insurance.com', '$2a$10$dXJ3SW6G7P6.E92wLJOCU.GbQY3JQ7TG5iNJP9Zr2jXb8Y5fQ8Z9W', true, NOW(), NOW()),
(2, 'customer_test', 'customer@test.thai-insurance.com', '$2a$10$dXJ3SW6G7P6.E92wLJOCU.GbQY3JQ7TG5iNJP9Zr2jXb8Y5fQ8Z9W', true, NOW(), NOW()),
(3, 'agent_test', 'agent@test.thai-insurance.com', '$2a$10$dXJ3SW6G7P6.E92wLJOCU.GbQY3JQ7TG5iNJP9Zr2jXb8Y5fQ8Z9W', true, NOW(), NOW());

-- Test Roles
INSERT INTO roles (id, name, description, created_at, updated_at) VALUES
(1, 'ADMIN', 'System Administrator', NOW(), NOW()),
(2, 'CUSTOMER', 'Insurance Customer', NOW(), NOW()),
(3, 'AGENT', 'Insurance Agent', NOW(), NOW());

-- Test User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin user has ADMIN role
(2, 2), -- customer user has CUSTOMER role
(3, 3); -- agent user has AGENT role

-- Test Customers with valid Thai National IDs
INSERT INTO customers (id, national_id, first_name, last_name, first_name_thai, last_name_thai, 
                      date_of_birth, gender, phone_number, email, address_line1, district, 
                      province, postal_code, occupation_category, kyc_status, is_active, 
                      user_id, created_at, updated_at) VALUES
(1, '1234567890123', 'Somchai', 'Jaidee', 'สมชาย', 'ใจดี', 
 '1985-05-15', 'MALE', '0812345678', 'somchai@email.com', '123 Sukhumvit Road', 
 'Watthana', 'Bangkok', '10110', 'PRIVATE_EMPLOYEE', 'VERIFIED', true, 2, NOW(), NOW()),
 
(2, '9876543210987', 'Malee', 'Sunthorn', 'มาลี', 'สุนทร', 
 '1990-08-20', 'FEMALE', '0898765432', 'malee@email.com', '456 Phahonyothin Road', 
 'Chatuchak', 'Bangkok', '10900', 'GOVERNMENT_OFFICER', 'VERIFIED', true, NULL, NOW(), NOW()),
 
(3, '1357924680135', 'Niran', 'Thepwong', 'นิรัน', 'เทพวงศ์', 
 '1982-12-10', 'MALE', '0651234567', 'niran@email.com', '789 Ladprao Road', 
 'Wang Thonglang', 'Bangkok', '10310', 'BUSINESS_OWNER', 'PENDING', true, NULL, NOW(), NOW());

-- Test Vehicles with Thai license plates
INSERT INTO vehicles (id, customer_id, license_plate, vehicle_type, make, model, year, 
                     engine_size, fuel_type, color, chassis_number, engine_number, 
                     purchase_date, purchase_price, current_value, usage_type, 
                     is_financed, created_at, updated_at) VALUES
(1, 1, 'กก 1234', 'CAR', 'Toyota', 'Vios', 2020, 1500.0, 'GASOLINE', 'White', 
 'JTDBR32E500123456', 'NZ12345678', '2020-01-15', 550000.0, 480000.0, 'PERSONAL', false, NOW(), NOW()),
 
(2, 2, 'ขข 5678', 'CAR', 'Honda', 'City', 2019, 1498.0, 'GASOLINE', 'Silver', 
 'SHGFY15015H123456', 'L15B7123456', '2019-06-20', 620000.0, 520000.0, 'PERSONAL', true, NOW(), NOW()),
 
(3, 1, 'คค 9012', 'MOTORCYCLE', 'Honda', 'PCX 150', 2021, 149.3, 'GASOLINE', 'Black', 
 'MLHJC52A0L5123456', 'JC52E5123456', '2021-03-10', 89900.0, 75000.0, 'PERSONAL', false, NOW(), NOW());

-- Test Policies
INSERT INTO policies (id, policy_number, customer_id, vehicle_id, policy_type, coverage_type, 
                     start_date, end_date, premium_amount, sum_insured, deductible, 
                     policy_status, payment_frequency, created_at, updated_at) VALUES
(1, 'POL-2024-001', 1, 1, 'COMPREHENSIVE', 'FIRST_CLASS', 
 '2024-01-01', '2024-12-31', 15000.0, 550000.0, 5000.0, 'ACTIVE', 'ANNUAL', NOW(), NOW()),
 
(2, 'POL-2024-002', 2, 2, 'COMPREHENSIVE', 'FIRST_CLASS', 
 '2024-02-01', '2025-01-31', 18000.0, 620000.0, 10000.0, 'ACTIVE', 'MONTHLY', NOW(), NOW()),
 
(3, 'POL-2024-003', 1, 3, 'THIRD_PARTY', 'COMPULSORY', 
 '2024-03-01', '2025-02-28', 645.0, 200000.0, 0.0, 'ACTIVE', 'ANNUAL', NOW(), NOW());

-- Test Claims
INSERT INTO claims (id, claim_number, policy_id, claim_type, incident_date, reported_date, 
                   incident_location, description, estimated_amount, approved_amount, 
                   claim_status, created_at, updated_at) VALUES
(1, 'CLM-2024-001', 1, 'ACCIDENT', '2024-06-15', '2024-06-16', 
 'Sukhumvit Road, Bangkok', 'Minor collision with another vehicle', 25000.0, 22000.0, 
 'APPROVED', NOW(), NOW()),
 
(2, 'CLM-2024-002', 2, 'THEFT', '2024-07-10', '2024-07-10', 
 'Shopping mall parking, Bangkok', 'Vehicle stolen from parking lot', 620000.0, NULL, 
 'UNDER_INVESTIGATION', NOW(), NOW());

-- Test Payments
INSERT INTO payments (id, policy_id, payment_reference, amount, payment_date, 
                     due_date, payment_method, payment_status, description, 
                     created_at, updated_at) VALUES
(1, 1, 'PAY-2024-001', 15000.0, '2024-01-01', '2024-01-15', 
 'BANK_TRANSFER', 'COMPLETED', 'Annual premium payment', NOW(), NOW()),
 
(2, 2, 'PAY-2024-002', 1500.0, '2024-02-01', '2024-02-15', 
 'CREDIT_CARD', 'COMPLETED', 'Monthly premium payment - February', NOW(), NOW()),
 
(3, 2, 'PAY-2024-003', 1500.0, '2024-03-01', '2024-03-15', 
 'CREDIT_CARD', 'PENDING', 'Monthly premium payment - March', NOW(), NOW());

-- Test Claim Documents
INSERT INTO claim_documents (id, claim_id, document_type, file_name, file_path, 
                           file_size, mime_type, uploaded_at, created_at, updated_at) VALUES
(1, 1, 'ACCIDENT_REPORT', 'accident_report_001.pdf', '/uploads/claims/1/accident_report_001.pdf', 
 156789, 'application/pdf', NOW(), NOW(), NOW()),
 
(2, 1, 'REPAIR_ESTIMATE', 'repair_estimate_001.pdf', '/uploads/claims/1/repair_estimate_001.pdf', 
 89456, 'application/pdf', NOW(), NOW(), NOW()),
 
(3, 2, 'POLICE_REPORT', 'police_report_002.pdf', '/uploads/claims/2/police_report_002.pdf', 
 234567, 'application/pdf', NOW(), NOW(), NOW());