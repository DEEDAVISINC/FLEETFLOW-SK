-- FleetFlow Missing Tables Only
-- Run this in your Supabase SQL Editor to create only the missing tables

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
CREATE INDEX idx_load_confirmations_load_id ON load_confirmations(load_id);
CREATE INDEX idx_deliveries_load_id ON deliveries(load_id);
CREATE INDEX idx_file_records_load_id ON file_records(load_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to new tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS) for new tables
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Allow all operations for authenticated users" ON load_confirmations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON deliveries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON file_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated'); 