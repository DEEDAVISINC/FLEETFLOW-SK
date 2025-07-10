-- FleetFlow Database Schema
-- Run this to set up your PostgreSQL database

-- Create database (run as superuser)
-- CREATE DATABASE fleetflow;
-- \c fleetflow;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Authentication
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'DRV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('driver_seq')::text, 3, '0'),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    license_number VARCHAR(50) NOT NULL,
    license_expiry DATE,
    assigned_truck_id VARCHAR(50),
    dispatcher_id VARCHAR(50),
    current_location VARCHAR(255),
    eld_status VARCHAR(20) DEFAULT 'Disconnected',
    hours_remaining DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive, Suspended
    hire_date DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS driver_seq START 1;

CREATE TABLE IF NOT EXISTS dispatchers (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'DSP-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('dispatcher_seq')::text, 3, '0'),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS dispatcher_seq START 1;

-- Brokers and Customers
CREATE TABLE IF NOT EXISTS brokers (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'BRK-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('broker_seq')::text, 3, '0'),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    mc_number VARCHAR(50),
    dot_number VARCHAR(50),
    payment_terms VARCHAR(100),
    credit_rating VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS broker_seq START 1;

-- Load Management
CREATE TABLE IF NOT EXISTS loads (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'LD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('load_seq')::text, 3, '0'),
    broker_id VARCHAR(50) NOT NULL REFERENCES brokers(id),
    dispatcher_id VARCHAR(50) REFERENCES dispatchers(id),
    assigned_driver_id VARCHAR(50) REFERENCES drivers(id),
    
    -- Load Details
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    distance VARCHAR(50),
    weight VARCHAR(50),
    equipment VARCHAR(100) NOT NULL,
    commodity VARCHAR(255),
    
    -- Dates and Times
    pickup_date TIMESTAMP NOT NULL,
    delivery_date TIMESTAMP NOT NULL,
    pickup_time VARCHAR(20),
    delivery_time VARCHAR(20),
    
    -- Status and Tracking
    status VARCHAR(20) DEFAULT 'Draft', -- Draft, Available, Assigned, In Transit, Delivered, Cancelled
    tracking_enabled BOOLEAN DEFAULT FALSE,
    current_location JSONB, -- {lat, lng, timestamp, address}
    
    -- Additional Information
    special_instructions TEXT,
    reference_number VARCHAR(100),
    po_number VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS load_seq START 1;

-- Load Confirmations
CREATE TABLE IF NOT EXISTS load_confirmations (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'CONF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('confirmation_seq')::text, 3, '0'),
    load_id VARCHAR(50) NOT NULL REFERENCES loads(id),
    driver_id VARCHAR(50) NOT NULL REFERENCES drivers(id),
    confirmed_at TIMESTAMP NOT NULL,
    driver_signature TEXT, -- Base64 encoded signature
    notes TEXT,
    location JSONB, -- {lat, lng, address}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS confirmation_seq START 1;

-- Deliveries
CREATE TABLE IF NOT EXISTS deliveries (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'DEL-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('delivery_seq')::text, 3, '0'),
    load_id VARCHAR(50) NOT NULL REFERENCES loads(id),
    driver_id VARCHAR(50) NOT NULL REFERENCES drivers(id),
    
    -- Receiver Information
    receiver_name VARCHAR(255),
    receiver_signature TEXT, -- Base64 encoded signature
    receiver_title VARCHAR(100),
    receiver_company VARCHAR(255),
    
    -- Delivery Details
    delivery_time TIMESTAMP,
    delivery_location JSONB, -- {lat, lng, address}
    delivery_condition VARCHAR(50), -- Good, Damaged, Partial, etc.
    notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, issue
    confirmation_number VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS delivery_seq START 1;

-- File Storage
CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'FILE-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('file_seq')::text, 6, '0'),
    load_id VARCHAR(50) REFERENCES loads(id),
    driver_id VARCHAR(50) REFERENCES drivers(id),
    delivery_id VARCHAR(50) REFERENCES deliveries(id),
    confirmation_id VARCHAR(50) REFERENCES load_confirmations(id),
    
    -- File Details
    file_type VARCHAR(50) NOT NULL, -- confirmation_photo, pickup_photo, delivery_photo, driver_signature, receiver_signature, document
    file_name VARCHAR(255),
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Metadata
    metadata JSONB, -- Additional file information
    description TEXT,
    
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS file_seq START 1;

-- Notifications and Messages
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'NOTIF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('notification_seq')::text, 6, '0'),
    driver_id VARCHAR(50) REFERENCES drivers(id),
    dispatcher_id VARCHAR(50) REFERENCES dispatchers(id),
    load_id VARCHAR(50) REFERENCES loads(id),
    
    -- Message Details
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- load_assignment, dispatch_update, system_alert, delivery_reminder
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Status
    read_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS notification_seq START 1;

-- SMS Messages
CREATE TABLE IF NOT EXISTS sms_messages (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'SMS-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('sms_seq')::text, 6, '0'),
    to_phone VARCHAR(20) NOT NULL,
    from_phone VARCHAR(20),
    message TEXT NOT NULL,
    type VARCHAR(50),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    external_message_id VARCHAR(100), -- Twilio SID, etc.
    error_message TEXT,
    
    -- Related Records
    driver_id VARCHAR(50) REFERENCES drivers(id),
    load_id VARCHAR(50) REFERENCES loads(id),
    notification_id VARCHAR(50) REFERENCES notifications(id),
    
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS sms_seq START 1;

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'DOC-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('document_seq')::text, 6, '0'),
    load_id VARCHAR(50) REFERENCES loads(id),
    driver_id VARCHAR(50) REFERENCES drivers(id),
    
    -- Document Details
    type VARCHAR(50) NOT NULL, -- rate_confirmation, bill_of_lading, load_confirmation, invoice
    title VARCHAR(255),
    file_url VARCHAR(500),
    file_size INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- draft, generated, sent, signed
    generated_at TIMESTAMP,
    sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS document_seq START 1;

-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(50), -- user ID who made the change
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_loads_driver ON loads(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_loads_pickup_date ON loads(pickup_date);
CREATE INDEX IF NOT EXISTS idx_notifications_driver ON notifications(driver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_files_load ON files(load_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_sms_status ON sms_messages(status);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_logs(table_name, record_id);

-- Sample Data Inserts
INSERT INTO dispatchers (id, name, email, phone) VALUES 
('DSP-001', 'Sarah Johnson', 'sarah.johnson@fleetflow.com', '+1-555-987-6543')
ON CONFLICT (id) DO NOTHING;

INSERT INTO drivers (id, name, email, phone, license_number, dispatcher_id, current_location, eld_status, hours_remaining) VALUES 
('DRV-001', 'John Smith', 'john.smith@fleetflow.com', '+1-555-123-4567', 'CDL-TX-123456', 'DSP-001', 'Dallas, TX', 'Connected', 8.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO brokers (id, company_name, contact_name, email, phone, city, state) VALUES 
('BRK-001', 'ABC Logistics', 'Mike Wilson', 'mike@abclogistics.com', '+1-555-111-2222', 'Atlanta', 'GA'),
('BRK-002', 'XYZ Freight', 'Lisa Davis', 'lisa@xyzfreight.com', '+1-555-333-4444', 'Miami', 'FL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO loads (id, broker_id, dispatcher_id, origin, destination, rate, distance, weight, equipment, status, pickup_date, delivery_date) VALUES 
('LD-2025-001', 'BRK-001', 'DSP-001', 'Dallas, TX', 'Atlanta, GA', 2500.00, '925 miles', '45,000 lbs', 'Dry Van', 'Assigned', '2025-07-03 08:00:00', '2025-07-05 17:00:00'),
('LD-2025-002', 'BRK-002', NULL, 'Houston, TX', 'Miami, FL', 3200.00, '1200 miles', '40,000 lbs', 'Refrigerated', 'Available', '2025-07-04 06:00:00', '2025-07-06 18:00:00')
ON CONFLICT (id) DO NOTHING;

-- Update assigned driver for the first load
UPDATE loads SET assigned_driver_id = 'DRV-001' WHERE id = 'LD-2025-001';

PRINT 'FleetFlow database schema created successfully!';
