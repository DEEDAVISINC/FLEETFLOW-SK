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

-- Set up Row Level Security (RLS)
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - you can customize these)
CREATE POLICY "Allow all operations for authenticated users" ON loads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON drivers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON load_confirmations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON deliveries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON file_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON notifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
