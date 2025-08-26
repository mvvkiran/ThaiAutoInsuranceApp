-- Add missing columns to vehicles table
-- Based on Vehicle entity fields that are missing from database schema

-- Add current_mileage column
ALTER TABLE vehicles ADD COLUMN current_mileage INTEGER;

-- Add modifications column
ALTER TABLE vehicles ADD COLUMN modifications TEXT;

-- Add inactive_reason column  
ALTER TABLE vehicles ADD COLUMN inactive_reason VARCHAR(255);

-- Add inactive_date column
ALTER TABLE vehicles ADD COLUMN inactive_date DATE;

-- Add last_transfer_date column
ALTER TABLE vehicles ADD COLUMN last_transfer_date DATE;

-- Add owner_id column (foreign key to customers table)
ALTER TABLE vehicles ADD COLUMN owner_id BIGINT;

-- Add status column with default value
ALTER TABLE vehicles ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE';

-- Add foreign key constraint for owner_id
ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_owner FOREIGN KEY (owner_id) REFERENCES customers(id);

-- Add index on owner_id for better performance  
CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);