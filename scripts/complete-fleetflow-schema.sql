-- FleetFlow Complete Database Schema for Supabase
-- This is a clean, complete schema that includes all necessary tables

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

-- RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for loads
DROP POLICY IF EXISTS "Authenticated users can view loads" ON loads;
DROP POLICY IF EXISTS "Authenticated users can insert loads" ON loads;
DROP POLICY IF EXISTS "Authenticated users can update loads" ON loads;

CREATE POLICY "Authenticated users can view loads" ON loads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert loads" ON loads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update loads" ON loads FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for shippers
DROP POLICY IF EXISTS "Authenticated users can view shippers" ON shippers;
DROP POLICY IF EXISTS "Authenticated users can insert shippers" ON shippers;
DROP POLICY IF EXISTS "Authenticated users can update shippers" ON shippers;

CREATE POLICY "Authenticated users can view shippers" ON shippers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert shippers" ON shippers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update shippers" ON shippers FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for carriers
DROP POLICY IF EXISTS "Authenticated users can view carriers" ON carriers;
DROP POLICY IF EXISTS "Authenticated users can insert carriers" ON carriers;
DROP POLICY IF EXISTS "Authenticated users can update carriers" ON carriers;

CREATE POLICY "Authenticated users can view carriers" ON carriers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert carriers" ON carriers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update carriers" ON carriers FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for drivers
DROP POLICY IF EXISTS "Authenticated users can view drivers" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can insert drivers" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can update drivers" ON drivers;

CREATE POLICY "Authenticated users can view drivers" ON drivers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert drivers" ON drivers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update drivers" ON drivers FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for vehicles
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON vehicles;
DROP POLICY IF EXISTS "Authenticated users can insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON vehicles;

CREATE POLICY "Authenticated users can view vehicles" ON vehicles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert vehicles" ON vehicles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update vehicles" ON vehicles FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for sticky_notes
DROP POLICY IF EXISTS "Users can view their own sticky notes" ON sticky_notes;
DROP POLICY IF EXISTS "Users can insert their own sticky notes" ON sticky_notes;
DROP POLICY IF EXISTS "Users can update their own sticky notes" ON sticky_notes;
DROP POLICY IF EXISTS "Users can delete their own sticky notes" ON sticky_notes;

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
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Fleet User'), NEW.email, 'Viewer')
    ON CONFLICT (id) DO NOTHING;
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