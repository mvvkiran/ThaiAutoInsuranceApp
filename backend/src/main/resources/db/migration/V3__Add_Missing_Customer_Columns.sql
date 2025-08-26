-- Add missing columns to customers table for schema compatibility

ALTER TABLE customers ADD COLUMN address VARCHAR(500);
ALTER TABLE customers ADD COLUMN tambon VARCHAR(100);
ALTER TABLE customers ADD COLUMN amphoe VARCHAR(100);
ALTER TABLE customers ADD COLUMN country VARCHAR(100) DEFAULT 'Thailand';
ALTER TABLE customers ADD COLUMN preferred_language VARCHAR(20) DEFAULT 'THAI';
ALTER TABLE customers ADD COLUMN first_name_en VARCHAR(100);
ALTER TABLE customers ADD COLUMN last_name_en VARCHAR(100);