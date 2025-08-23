-- FleetFlow TMS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Loads table
CREATE TABLE loads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    load_id VARCHAR(50) UNIQUE NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    weight VARCHAR(50) NOT NULL,
    rate VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    driver VARCHAR(255) DEFAULT 'Unassigned',
    pickup_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    customer VARCHAR(255) NOT NULL,
    miles VARCHAR(50) NOT NULL,
    profit VARCHAR(50) NOT NULL,
    broker_name VARCHAR(255),
    dispatcher_id VARCHAR(255),
    equipment VARCHAR(100),
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    assigned_truck_id VARCHAR(255),
    dispatcher_id VARCHAR(255),
    dispatcher_name VARCHAR(255),
    dispatcher_phone VARCHAR(50),
    dispatcher_email VARCHAR(255),
    current_location VARCHAR(255),
    eld_status VARCHAR(50),
    hours_remaining INTEGER,
    auth_uid UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id VARCHAR(50) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year VARCHAR(4) NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    driver_id UUID REFERENCES drivers(id),
    maintenance_due_date DATE,
    fuel_card_number VARCHAR(50),
    insurance_expiry DATE,
    registration_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Load confirmations table
CREATE TABLE load_confirmations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    driver_signature TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id),
    receiver_name VARCHAR(255),
    receiver_signature TEXT,
    delivery_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File records table (for photos and documents)
CREATE TABLE file_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id),
    confirmation_id UUID REFERENCES load_confirmations(id) ON DELETE CASCADE,
    delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    cloudinary_id VARCHAR(255),
    file_size INTEGER,
    metadata JSONB,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES drivers(id),
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for authentication)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'driver',
    auth_uid UUID UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_loads_status ON loads(status);
CREATE INDEX idx_loads_driver ON loads(driver);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX idx_file_records_load_id ON file_records(load_id);
CREATE INDEX idx_notifications_driver_id ON notifications(driver_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_loads_updated_at BEFORE UPDATE ON loads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO loads (load_id, origin, destination, weight, rate, status, driver, pickup_date, delivery_date, customer, miles, profit, broker_name, equipment) VALUES
('LD001', 'Los Angeles, CA', 'Phoenix, AZ', '42,000 lbs', '$2,850', 'In Transit', 'Mike Johnson', '2025-07-15', '2025-07-16', 'Walmart Distribution', '372', '$1,420', 'ABC Logistics', 'Dry Van'),
('LD002', 'Dallas, TX', 'Atlanta, GA', '38,500 lbs', '$3,200', 'At Pickup', 'Sarah Williams', '2025-07-13', '2025-07-15', 'Home Depot Supply', '781', '$1,850', 'XYZ Transport', 'Reefer'),
('LD003', 'Chicago, IL', 'Denver, CO', '45,000 lbs', '$2,950', 'Available', 'Unassigned', '2025-07-10', '2025-07-12', 'Amazon Logistics', '920', '$1,680', 'Fast Freight', 'Flatbed'),
('LD004', 'Miami, FL', 'New York, NY', '35,000 lbs', '$4,100', 'At Delivery', 'David Chen', '2025-07-08', '2025-07-10', 'CVS Health', '1,380', '$2,200', 'Premium Carriers', 'Dry Van'),
('LD005', 'Detroit, MI', 'Jacksonville, FL', '40,000 lbs', '$3,500', 'Available', 'Unassigned', '2025-07-12', '2025-07-14', 'Ford Motor Co', '1,100', '$1,900', 'Motor City Logistics', 'Power Only'),
('LD006', 'Portland, OR', 'Phoenix, AZ', '36,000 lbs', '$3,800', 'In Transit', 'Lisa Rodriguez', '2025-07-11', '2025-07-13', 'Nike Distribution', '1,450', '$2,100', 'Pacific Transport', 'Dry Van');

INSERT INTO drivers (name, email, phone, license_number, status, dispatcher_name, dispatcher_phone, current_location) VALUES
('Mike Johnson', 'mike.johnson@fleetflow.com', '(555) 123-4567', 'DL123456789', 'Active', 'John Smith', '(555) 987-6543', 'Phoenix, AZ'),
('Sarah Williams', 'sarah.williams@fleetflow.com', '(555) 234-5678', 'DL234567890', 'Active', 'John Smith', '(555) 987-6543', 'Dallas, TX'),
('David Chen', 'david.chen@fleetflow.com', '(555) 345-6789', 'DL345678901', 'Active', 'Jane Doe', '(555) 876-5432', 'New York, NY'),
('Lisa Rodriguez', 'lisa.rodriguez@fleetflow.com', '(555) 456-7890', 'DL456789012', 'Active', 'Jane Doe', '(555) 876-5432', 'Portland, OR'),
('Robert Wilson', 'robert.wilson@fleetflow.com', '(555) 567-8901', 'DL567890123', 'Active', 'John Smith', '(555) 987-6543', 'Chicago, IL'),
('Maria Garcia', 'maria.garcia@fleetflow.com', '(555) 678-9012', 'DL678901234', 'Active', 'Jane Doe', '(555) 876-5432', 'Miami, FL');

INSERT INTO vehicles (vehicle_id, make, model, year, vin, license_plate, status) VALUES
('TRK001', 'Freightliner', 'Cascadia', '2023', '1FUJA6CV83L123456', 'ABC123', 'Active'),
('TRK002', 'Peterbilt', '579', '2022', '1XPBD49X7MD123456', 'XYZ789', 'Active'),
('TRK003', 'Kenworth', 'T680', '2023', '1XKWD49X7JD123456', 'DEF456', 'Active'),
('TRK004', 'Volvo', 'VNL', '2022', '4V4NC9TJ7XN123456', 'GHI789', 'Active'),
('TRK005', 'International', 'LT', '2023', '1HTMMAAL0XN123456', 'JKL012', 'Active'),
('TRK006', 'Mack', 'Anthem', '2022', '1M2AA18Y5WM123456', 'MNO345', 'Active');

-- Call Records Table for Twilio Integration
CREATE TABLE call_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    call_sid VARCHAR(255) UNIQUE NOT NULL,
    from_number VARCHAR(20) NOT NULL,
    to_number VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    duration INTEGER DEFAULT 0,
    cost DECIMAL(10,4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voicemail Transcriptions Table
CREATE TABLE voicemail_transcriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    call_sid VARCHAR(255) NOT NULL,
    transcription_sid VARCHAR(255) UNIQUE NOT NULL,
    recording_sid VARCHAR(255),
    recording_url TEXT,
    transcription_text TEXT,
    transcription_status VARCHAR(50),
    urgency_score INTEGER DEFAULT 0,
    priority_level VARCHAR(20) DEFAULT 'normal',
    ai_analysis JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (call_sid) REFERENCES call_records(call_sid)
);

-- Indexes for performance
CREATE INDEX idx_call_records_tenant ON call_records(tenant_id);
CREATE INDEX idx_call_records_status ON call_records(status);
CREATE INDEX idx_call_records_created ON call_records(created_at DESC);
CREATE INDEX idx_voicemail_tenant ON voicemail_transcriptions(tenant_id);
CREATE INDEX idx_voicemail_urgency ON voicemail_transcriptions(urgency_score DESC);
CREATE INDEX idx_voicemail_priority ON voicemail_transcriptions(priority_level);
CREATE INDEX idx_voicemail_processed ON voicemail_transcriptions(processed);

-- Set up Row Level Security (RLS)
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE voicemail_transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - you can customize these)
CREATE POLICY "Allow all operations for authenticated users" ON loads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON drivers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON load_confirmations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON deliveries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON file_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON notifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON call_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON voicemail_transcriptions FOR ALL USING (auth.role() = 'authenticated');

-- Form 2290 Filings Table for TaxBandits Integration
CREATE TABLE form_2290_filings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    submission_id VARCHAR(255) UNIQUE NOT NULL,
    filing_type VARCHAR(20) NOT NULL CHECK (filing_type IN ('original', 'amended', 'suspended')),
    tax_period_start DATE NOT NULL,
    tax_period_end DATE NOT NULL,
    total_tax_due DECIMAL(10,2) NOT NULL DEFAULT 0,
    filing_status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    filed_date TIMESTAMP WITH TIME ZONE,
    due_date DATE NOT NULL,
    business_ein VARCHAR(20) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    vehicle_count INTEGER NOT NULL DEFAULT 0,
    receipt_url TEXT,
    stamped_2290_url TEXT,
    amendment_reason TEXT,
    original_submission_id VARCHAR(255),
    errors JSONB,
    warnings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form 2290 Vehicles Table
CREATE TABLE form_2290_vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filing_id UUID NOT NULL,
    vin VARCHAR(17) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    gross_weight INTEGER NOT NULL,
    taxable_gross_weight INTEGER,
    first_used_date DATE NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('logging', 'public_highway', 'agricultural')),
    tax_amount DECIMAL(8,2) NOT NULL DEFAULT 0,
    vehicle_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (filing_id) REFERENCES form_2290_filings(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_form_2290_filings_tenant_id ON form_2290_filings(tenant_id);
CREATE INDEX idx_form_2290_filings_submission_id ON form_2290_filings(submission_id);
CREATE INDEX idx_form_2290_filings_status ON form_2290_filings(filing_status);
CREATE INDEX idx_form_2290_filings_due_date ON form_2290_filings(due_date);
CREATE INDEX idx_form_2290_filings_business_ein ON form_2290_filings(business_ein);
CREATE INDEX idx_form_2290_vehicles_filing_id ON form_2290_vehicles(filing_id);
CREATE INDEX idx_form_2290_vehicles_vin ON form_2290_vehicles(vin);

-- Enable Row Level Security for Form 2290 tables
ALTER TABLE form_2290_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_2290_vehicles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for form_2290_filings
CREATE POLICY "Allow all operations for authenticated users" ON form_2290_filings FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for form_2290_vehicles
CREATE POLICY "Allow all operations for authenticated users" ON form_2290_vehicles FOR ALL USING (auth.role() = 'authenticated');

-- IFTA Fuel Purchases Table
CREATE TABLE ifta_fuel_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID,
    purchase_date DATE NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    gallons DECIMAL(8,3) NOT NULL,
    price_per_gallon DECIMAL(6,3) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    vendor_name VARCHAR(255),
    receipt_number VARCHAR(100),
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('diesel', 'gasoline')),
    receipt_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IFTA Mileage Records Table
CREATE TABLE ifta_mileage_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    travel_date DATE NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    miles DECIMAL(8,1) NOT NULL,
    route_details TEXT,
    trip_purpose VARCHAR(100),
    odometer_start INTEGER,
    odometer_end INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IFTA Quarterly Returns Table
CREATE TABLE ifta_returns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    quarter VARCHAR(10) NOT NULL, -- "2024-Q1"
    year INTEGER NOT NULL,
    quarter_number INTEGER NOT NULL CHECK (quarter_number BETWEEN 1 AND 4),
    filing_status VARCHAR(20) DEFAULT 'draft' CHECK (filing_status IN ('draft', 'filed', 'accepted', 'rejected')),
    total_tax_due DECIMAL(10,2) DEFAULT 0,
    total_refund_due DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) DEFAULT 0,
    filed_date TIMESTAMP WITH TIME ZONE,
    due_date DATE NOT NULL,
    return_data JSONB NOT NULL,
    filing_confirmation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, quarter)
);

-- IFTA Jurisdiction Returns Table (detailed breakdown per state)
CREATE TABLE ifta_jurisdiction_returns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    return_id UUID NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    state_name VARCHAR(50) NOT NULL,
    total_miles DECIMAL(10,1) DEFAULT 0,
    taxable_miles DECIMAL(10,1) DEFAULT 0,
    fuel_purchased DECIMAL(10,3) DEFAULT 0,
    tax_rate DECIMAL(6,4) NOT NULL,
    tax_owed DECIMAL(10,2) DEFAULT 0,
    tax_paid DECIMAL(10,2) DEFAULT 0,
    net_tax_due DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (return_id) REFERENCES ifta_returns(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_ifta_fuel_purchases_tenant_id ON ifta_fuel_purchases(tenant_id);
CREATE INDEX idx_ifta_fuel_purchases_date ON ifta_fuel_purchases(purchase_date);
CREATE INDEX idx_ifta_fuel_purchases_state ON ifta_fuel_purchases(state_code);
CREATE INDEX idx_ifta_fuel_purchases_vehicle ON ifta_fuel_purchases(vehicle_id);

CREATE INDEX idx_ifta_mileage_records_tenant_id ON ifta_mileage_records(tenant_id);
CREATE INDEX idx_ifta_mileage_records_date ON ifta_mileage_records(travel_date);
CREATE INDEX idx_ifta_mileage_records_state ON ifta_mileage_records(state_code);
CREATE INDEX idx_ifta_mileage_records_vehicle ON ifta_mileage_records(vehicle_id);

CREATE INDEX idx_ifta_returns_tenant_id ON ifta_returns(tenant_id);
CREATE INDEX idx_ifta_returns_quarter ON ifta_returns(quarter);
CREATE INDEX idx_ifta_returns_status ON ifta_returns(filing_status);
CREATE INDEX idx_ifta_returns_due_date ON ifta_returns(due_date);

CREATE INDEX idx_ifta_jurisdiction_returns_return_id ON ifta_jurisdiction_returns(return_id);
CREATE INDEX idx_ifta_jurisdiction_returns_state ON ifta_jurisdiction_returns(state_code);

-- Enable Row Level Security for IFTA tables
ALTER TABLE ifta_fuel_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ifta_mileage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ifta_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ifta_jurisdiction_returns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for IFTA tables
CREATE POLICY "Allow all operations for authenticated users" ON ifta_fuel_purchases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON ifta_mileage_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON ifta_returns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON ifta_jurisdiction_returns FOR ALL USING (auth.role() = 'authenticated');

-- ELD Provider Connections Table
CREATE TABLE eld_providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    provider_id VARCHAR(50) NOT NULL,
    api_endpoint TEXT NOT NULL,
    auth_type VARCHAR(20) NOT NULL CHECK (auth_type IN ('api_key', 'oauth', 'basic_auth')),
    credentials JSONB NOT NULL, -- encrypted credentials
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency_minutes INTEGER DEFAULT 15,
    webhook_url TEXT,
    webhook_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HOS (Hours of Service) Records Table
CREATE TABLE hos_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    driver_id UUID NOT NULL,
    vehicle_id UUID,
    eld_provider_id UUID NOT NULL,
    record_date DATE NOT NULL,
    duty_status VARCHAR(30) NOT NULL CHECK (duty_status IN ('off_duty', 'sleeper_berth', 'driving', 'on_duty_not_driving')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    start_location JSONB,
    end_location JSONB,
    odometer_start INTEGER,
    odometer_end INTEGER,
    engine_hours DECIMAL(8,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (eld_provider_id) REFERENCES eld_providers(id) ON DELETE CASCADE
);

-- HOS Violations Table
CREATE TABLE hos_violations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    driver_id UUID NOT NULL,
    vehicle_id UUID,
    violation_type VARCHAR(30) NOT NULL CHECK (violation_type IN ('driving_time', 'duty_time', 'rest_break', 'weekly_limit', 'cycle_limit')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('warning', 'violation', 'critical')),
    description TEXT NOT NULL,
    violation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    time_remaining INTEGER, -- minutes until violation
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Diagnostics Table
CREATE TABLE vehicle_diagnostics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    eld_provider_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location JSONB NOT NULL,
    speed INTEGER DEFAULT 0, -- mph
    engine_rpm INTEGER DEFAULT 0,
    fuel_level DECIMAL(5,2) DEFAULT 0, -- percentage
    engine_temp INTEGER DEFAULT 0, -- fahrenheit
    odometer INTEGER DEFAULT 0, -- miles
    diagnostic_codes JSONB, -- array of diagnostic trouble codes
    battery_voltage DECIMAL(4,2),
    coolant_temp INTEGER,
    oil_pressure INTEGER,
    raw_data JSONB, -- complete diagnostic data from ELD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (eld_provider_id) REFERENCES eld_providers(id) ON DELETE CASCADE
);

-- ELD Sync Logs Table
CREATE TABLE eld_sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    eld_provider_id UUID NOT NULL,
    sync_type VARCHAR(20) NOT NULL CHECK (sync_type IN ('hos', 'diagnostics', 'violations', 'manual', 'webhook')),
    sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN ('started', 'completed', 'failed', 'partial')),
    records_processed INTEGER DEFAULT 0,
    violations_detected INTEGER DEFAULT 0,
    errors JSONB,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (eld_provider_id) REFERENCES eld_providers(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_eld_providers_tenant_id ON eld_providers(tenant_id);
CREATE INDEX idx_eld_providers_provider_id ON eld_providers(provider_id);
CREATE INDEX idx_eld_providers_active ON eld_providers(is_active);

CREATE INDEX idx_hos_records_tenant_id ON hos_records(tenant_id);
CREATE INDEX idx_hos_records_driver_id ON hos_records(driver_id);
CREATE INDEX idx_hos_records_vehicle_id ON hos_records(vehicle_id);
CREATE INDEX idx_hos_records_date ON hos_records(record_date);
CREATE INDEX idx_hos_records_duty_status ON hos_records(duty_status);
CREATE INDEX idx_hos_records_start_time ON hos_records(start_time);

CREATE INDEX idx_hos_violations_tenant_id ON hos_violations(tenant_id);
CREATE INDEX idx_hos_violations_driver_id ON hos_violations(driver_id);
CREATE INDEX idx_hos_violations_resolved ON hos_violations(resolved);
CREATE INDEX idx_hos_violations_severity ON hos_violations(severity);
CREATE INDEX idx_hos_violations_violation_time ON hos_violations(violation_time);

CREATE INDEX idx_vehicle_diagnostics_tenant_id ON vehicle_diagnostics(tenant_id);
CREATE INDEX idx_vehicle_diagnostics_vehicle_id ON vehicle_diagnostics(vehicle_id);
CREATE INDEX idx_vehicle_diagnostics_timestamp ON vehicle_diagnostics(timestamp);
CREATE INDEX idx_vehicle_diagnostics_provider ON vehicle_diagnostics(eld_provider_id);

CREATE INDEX idx_eld_sync_logs_tenant_id ON eld_sync_logs(tenant_id);
CREATE INDEX idx_eld_sync_logs_provider ON eld_sync_logs(eld_provider_id);
CREATE INDEX idx_eld_sync_logs_status ON eld_sync_logs(sync_status);
CREATE INDEX idx_eld_sync_logs_start_time ON eld_sync_logs(start_time);

-- Enable Row Level Security for ELD tables
ALTER TABLE eld_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hos_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hos_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE eld_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ELD tables
CREATE POLICY "Allow all operations for authenticated users" ON eld_providers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON hos_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON hos_violations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON vehicle_diagnostics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON eld_sync_logs FOR ALL USING (auth.role() = 'authenticated');
