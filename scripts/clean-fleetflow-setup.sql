-- FleetFlow Complete Clean Setup Script
-- This script creates the entire database schema and adds sample data
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Security settings
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Manager', 'Dispatcher', 'Driver', 'Viewer')),
    permissions TEXT[] DEFAULT ARRAY['dashboard.view', 'loads.view'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    link TEXT
);

-- Create loads table
CREATE TABLE IF NOT EXISTS loads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    load_number TEXT UNIQUE NOT NULL,
    shipper_id UUID,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_date DATE,
    delivery_date DATE,
    weight DECIMAL,
    rate DECIMAL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    driver_id UUID,
    carrier_id UUID,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shippers table
CREATE TABLE IF NOT EXISTS shippers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    performance_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carriers table
CREATE TABLE IF NOT EXISTS carriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    mc_number TEXT,
    dot_number TEXT,
    insurance_expiry DATE,
    performance_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    license_number TEXT,
    license_expiry DATE,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_number TEXT NOT NULL,
    make TEXT,
    model TEXT,
    year INTEGER,
    vin TEXT,
    license_plate TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'offline')),
    driver_id UUID REFERENCES drivers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sticky_notes table
CREATE TABLE IF NOT EXISTS sticky_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    color TEXT DEFAULT '#fbbf24',
    position_x INTEGER DEFAULT 100,
    position_y INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create load_confirmations table
CREATE TABLE IF NOT EXISTS load_confirmations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    driver_signature TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id),
    receiver_name VARCHAR(255),
    receiver_signature TEXT,
    delivery_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file_records table (for photos and documents)
CREATE TABLE IF NOT EXISTS file_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticky_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_records ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

DROP POLICY IF EXISTS "Authenticated users can view loads" ON loads;
DROP POLICY IF EXISTS "Authenticated users can insert loads" ON loads;
DROP POLICY IF EXISTS "Authenticated users can update loads" ON loads;

DROP POLICY IF EXISTS "Authenticated users can view shippers" ON shippers;
DROP POLICY IF EXISTS "Authenticated users can insert shippers" ON shippers;
DROP POLICY IF EXISTS "Authenticated users can update shippers" ON shippers;

DROP POLICY IF EXISTS "Authenticated users can view carriers" ON carriers;
DROP POLICY IF EXISTS "Authenticated users can insert carriers" ON carriers;
DROP POLICY IF EXISTS "Authenticated users can update carriers" ON carriers;

DROP POLICY IF EXISTS "Authenticated users can view drivers" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can insert drivers" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can update drivers" ON drivers;

DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON vehicles;
DROP POLICY IF EXISTS "Authenticated users can insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON vehicles;

DROP POLICY IF EXISTS "Users can view their own sticky notes" ON sticky_notes;
DROP POLICY IF EXISTS "Users can insert their own sticky notes" ON sticky_notes;
DROP POLICY IF EXISTS "Users can update their own sticky notes" ON sticky_notes;
DROP POLICY IF EXISTS "Users can delete their own sticky notes" ON sticky_notes;

DROP POLICY IF EXISTS "Authenticated users can view load_confirmations" ON load_confirmations;
DROP POLICY IF EXISTS "Authenticated users can insert load_confirmations" ON load_confirmations;
DROP POLICY IF EXISTS "Authenticated users can update load_confirmations" ON load_confirmations;

DROP POLICY IF EXISTS "Authenticated users can view deliveries" ON deliveries;
DROP POLICY IF EXISTS "Authenticated users can insert deliveries" ON deliveries;
DROP POLICY IF EXISTS "Authenticated users can update deliveries" ON deliveries;

DROP POLICY IF EXISTS "Authenticated users can view file_records" ON file_records;
DROP POLICY IF EXISTS "Authenticated users can insert file_records" ON file_records;
DROP POLICY IF EXISTS "Authenticated users can update file_records" ON file_records;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for loads
CREATE POLICY "Authenticated users can view loads" ON loads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert loads" ON loads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update loads" ON loads FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for shippers
CREATE POLICY "Authenticated users can view shippers" ON shippers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert shippers" ON shippers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update shippers" ON shippers FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for carriers
CREATE POLICY "Authenticated users can view carriers" ON carriers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert carriers" ON carriers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update carriers" ON carriers FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for drivers
CREATE POLICY "Authenticated users can view drivers" ON drivers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert drivers" ON drivers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update drivers" ON drivers FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for vehicles
CREATE POLICY "Authenticated users can view vehicles" ON vehicles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert vehicles" ON vehicles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update vehicles" ON vehicles FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for sticky_notes
CREATE POLICY "Users can view their own sticky notes" ON sticky_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sticky notes" ON sticky_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sticky notes" ON sticky_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sticky notes" ON sticky_notes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for additional tables
CREATE POLICY "Authenticated users can view load_confirmations" ON load_confirmations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert load_confirmations" ON load_confirmations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update load_confirmations" ON load_confirmations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view deliveries" ON deliveries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert deliveries" ON deliveries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update deliveries" ON deliveries FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view file_records" ON file_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert file_records" ON file_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update file_records" ON file_records FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_loads_pickup_date ON loads(pickup_date);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_load_confirmations_load_id ON load_confirmations(load_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_load_id ON deliveries(load_id);
CREATE INDEX IF NOT EXISTS idx_file_records_load_id ON file_records(load_id);

-- Function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, email, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Fleet User'), NEW.email, 'Viewer');
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Timestamp triggers
DROP TRIGGER IF EXISTS update_user_profiles_timestamp ON user_profiles;
DROP TRIGGER IF EXISTS update_loads_timestamp ON loads;
DROP TRIGGER IF EXISTS update_shippers_timestamp ON shippers;
DROP TRIGGER IF EXISTS update_carriers_timestamp ON carriers;
DROP TRIGGER IF EXISTS update_drivers_timestamp ON drivers;
DROP TRIGGER IF EXISTS update_vehicles_timestamp ON vehicles;
DROP TRIGGER IF EXISTS update_sticky_notes_timestamp ON sticky_notes;

CREATE TRIGGER update_user_profiles_timestamp BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_loads_timestamp BEFORE UPDATE ON loads FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_shippers_timestamp BEFORE UPDATE ON shippers FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_carriers_timestamp BEFORE UPDATE ON carriers FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_drivers_timestamp BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_vehicles_timestamp BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_sticky_notes_timestamp BEFORE UPDATE ON sticky_notes FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Clear existing data (optional - remove if you want to keep existing data)
TRUNCATE TABLE file_records CASCADE;
TRUNCATE TABLE deliveries CASCADE;
TRUNCATE TABLE load_confirmations CASCADE;
TRUNCATE TABLE sticky_notes CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE loads CASCADE;
TRUNCATE TABLE vehicles CASCADE;
TRUNCATE TABLE drivers CASCADE;
TRUNCATE TABLE carriers CASCADE;
TRUNCATE TABLE shippers CASCADE;

-- Insert sample shippers
INSERT INTO shippers (company_name, contact_name, email, phone, address, city, state, zip_code) VALUES
    ('ABC Manufacturing', 'John Smith', 'john@abcmfg.com', '555-0101', '123 Industrial Way', 'Detroit', 'MI', '48201'),
    ('XYZ Logistics', 'Sarah Johnson', 'sarah@xyzlogistics.com', '555-0102', '456 Commerce St', 'Chicago', 'IL', '60601'),
    ('Global Shipping Co', 'Mike Wilson', 'mike@globalship.com', '555-0103', '789 Harbor Blvd', 'Los Angeles', 'CA', '90001'),
    ('Premium Freight Solutions', 'Lisa Davis', 'lisa@premiumfreight.com', '555-0104', '321 Transport Ave', 'Dallas', 'TX', '75201'),
    ('Express Delivery Inc', 'Tom Anderson', 'tom@expressdelivery.com', '555-0105', '654 Speedway Blvd', 'Atlanta', 'GA', '30301');

-- Insert sample carriers
INSERT INTO carriers (company_name, contact_name, email, phone, mc_number, dot_number) VALUES
    ('FastTrack Transport', 'David Brown', 'david@fasttrack.com', '555-0201', 'MC-123456', 'DOT-7890123'),
    ('Reliable Freight', 'Lisa Davis', 'lisa@reliable.com', '555-0202', 'MC-234567', 'DOT-8901234'),
    ('Express Delivery', 'Tom Anderson', 'tom@express.com', '555-0203', 'MC-345678', 'DOT-9012345'),
    ('Swift Logistics', 'Jennifer Wilson', 'jennifer@swift.com', '555-0204', 'MC-456789', 'DOT-0123456'),
    ('Prime Carriers', 'Robert Johnson', 'robert@prime.com', '555-0205', 'MC-567890', 'DOT-1234567');

-- Insert sample drivers
INSERT INTO drivers (first_name, last_name, phone, license_number, status) VALUES
    ('Mike', 'Johnson', '(555) 123-4567', 'DL123456789', 'available'),
    ('Sarah', 'Williams', '(555) 234-5678', 'DL234567890', 'available'),
    ('David', 'Chen', '(555) 345-6789', 'DL345678901', 'busy'),
    ('Lisa', 'Rodriguez', '(555) 456-7890', 'DL456789012', 'available'),
    ('Robert', 'Wilson', '(555) 567-8901', 'DL567890123', 'available'),
    ('Maria', 'Garcia', '(555) 678-9012', 'DL678901234', 'offline'),
    ('James', 'Taylor', '(555) 789-0123', 'DL789012345', 'available'),
    ('Emily', 'Brown', '(555) 890-1234', 'DL890123456', 'busy');

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_number, make, model, year, vin, license_plate, status) VALUES
    ('TRK001', 'Freightliner', 'Cascadia', 2023, '1FUJA6CV83L123456', 'ABC123', 'available'),
    ('TRK002', 'Peterbilt', '579', 2022, '1XPBD49X7MD123456', 'XYZ789', 'available'),
    ('TRK003', 'Kenworth', 'T680', 2023, '1XKWD49X7JD123456', 'DEF456', 'in_use'),
    ('TRK004', 'Volvo', 'VNL', 2022, '4V4NC9TJ7XN123456', 'GHI789', 'available'),
    ('TRK005', 'International', 'LT', 2023, '1HTMMAAL0XN123456', 'JKL012', 'maintenance'),
    ('TRK006', 'Mack', 'Anthem', 2022, '1M2AA18Y5WM123456', 'MNO345', 'available'),
    ('TRK007', 'Western Star', '5700XE', 2023, '1XKWD49X7KD123456', 'PQR678', 'available'),
    ('TRK008', 'Freightliner', 'Coronado', 2022, '1FUJA6CV83L789012', 'STU901', 'in_use');

-- Insert sample loads
INSERT INTO loads (load_number, origin, destination, pickup_date, delivery_date, weight, rate, status) VALUES
    ('LD001', 'Los Angeles, CA', 'Phoenix, AZ', '2025-01-15', '2025-01-16', 42000, 2850.00, 'in_transit'),
    ('LD002', 'Dallas, TX', 'Atlanta, GA', '2025-01-13', '2025-01-15', 38500, 3200.00, 'picked_up'),
    ('LD003', 'Chicago, IL', 'Denver, CO', '2025-01-10', '2025-01-12', 45000, 2950.00, 'pending'),
    ('LD004', 'Miami, FL', 'New York, NY', '2025-01-08', '2025-01-10', 35000, 4100.00, 'delivered'),
    ('LD005', 'Detroit, MI', 'Jacksonville, FL', '2025-01-12', '2025-01-14', 40000, 3500.00, 'pending'),
    ('LD006', 'Portland, OR', 'Phoenix, AZ', '2025-01-11', '2025-01-13', 36000, 3800.00, 'in_transit'),
    ('LD007', 'Seattle, WA', 'San Francisco, CA', '2025-01-14', '2025-01-15', 32000, 2800.00, 'assigned'),
    ('LD008', 'Houston, TX', 'New Orleans, LA', '2025-01-16', '2025-01-17', 38000, 2200.00, 'pending');

-- Insert sample notifications
INSERT INTO notifications (message, type, link) VALUES
    ('Load LD001 has been assigned to you', 'load_assignment', '/loads/LD001'),
    ('Please confirm pickup for load LD002', 'pickup_reminder', '/loads/LD002'),
    ('Delivery completed for load LD004', 'delivery_complete', '/loads/LD004'),
    ('New route available for load LD006', 'route_update', '/loads/LD006'),
    ('Vehicle TRK005 requires maintenance', 'maintenance_alert', '/vehicles/TRK005'),
    ('Weekly performance report is ready', 'report', '/reports/weekly'),
    ('New driver application received', 'application', '/drivers/applications'),
    ('Insurance renewal reminder', 'reminder', '/settings/insurance');

-- Insert sample sticky notes
INSERT INTO sticky_notes (title, content, color, position_x, position_y) VALUES
    ('Important Meeting', 'Call with ABC Manufacturing at 2 PM', '#fbbf24', 100, 100),
    ('Load Priority', 'LD003 needs to be assigned ASAP', '#ef4444', 300, 150),
    ('Maintenance', 'Schedule TRK005 for brake inspection', '#10b981', 500, 200),
    ('Driver Notes', 'Mike Johnson prefers West Coast routes', '#3b82f6', 200, 300),
    ('Quick Reminder', 'Submit weekly report by Friday', '#8b5cf6', 400, 250);

-- Insert sample load confirmations
INSERT INTO load_confirmations (load_id, driver_id, notes) VALUES
    ((SELECT id FROM loads WHERE load_number = 'LD001' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL123456789' LIMIT 1), 
     'Load confirmed, ready for pickup'),
    ((SELECT id FROM loads WHERE load_number = 'LD002' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL234567890' LIMIT 1), 
     'Confirmed pickup time'),
    ((SELECT id FROM loads WHERE load_number = 'LD004' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL345678901' LIMIT 1), 
     'Delivery completed successfully');

-- Insert sample deliveries
INSERT INTO deliveries (load_id, driver_id, receiver_name, status) VALUES
    ((SELECT id FROM loads WHERE load_number = 'LD004' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL345678901' LIMIT 1), 
     'John Smith - CVS Health', 'completed'),
    ((SELECT id FROM loads WHERE load_number = 'LD001' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL123456789' LIMIT 1), 
     'Sarah Johnson - Walmart Distribution', 'in_progress');

-- Insert sample file records
INSERT INTO file_records (load_id, file_type, file_url, file_size) VALUES
    ((SELECT id FROM loads WHERE load_number = 'LD001' LIMIT 1), 'bol', 'https://example.com/bol_ld001.pdf', 1024000),
    ((SELECT id FROM loads WHERE load_number = 'LD002' LIMIT 1), 'photo', 'https://example.com/pickup_ld002.jpg', 2048000),
    ((SELECT id FROM loads WHERE load_number = 'LD004' LIMIT 1), 'signature', 'https://example.com/signature_ld004.png', 512000); 