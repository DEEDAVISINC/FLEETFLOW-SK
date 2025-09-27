-- FleetFlow TMS Production Database Schema
-- Run this in your Supabase SQL Editor after creating the project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users and Organizations
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'driver',
  organization_id UUID,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'carrier',
  mc_number VARCHAR(50),
  dot_number VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loads Management
CREATE TABLE IF NOT EXISTS loads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  load_number VARCHAR(100) UNIQUE NOT NULL,
  shipper_info JSONB,
  consignee_info JSONB,
  pickup_location JSONB,
  delivery_location JSONB,
  pickup_date DATE,
  delivery_date DATE,
  rate DECIMAL(10,2),
  miles INTEGER,
  weight INTEGER,
  status VARCHAR(50) DEFAULT 'available',
  assigned_to UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers and Vehicles
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  license_number VARCHAR(100),
  license_expiry DATE,
  cdl_class VARCHAR(10),
  endorsements TEXT[],
  status VARCHAR(50) DEFAULT 'available',
  current_location JSONB,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin VARCHAR(17) UNIQUE,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  license_plate VARCHAR(50),
  dot_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  assigned_driver UUID REFERENCES drivers(id),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM System
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  type VARCHAR(50) DEFAULT 'prospect',
  status VARCHAR(50) DEFAULT 'active',
  lead_source VARCHAR(100),
  lead_score INTEGER DEFAULT 0,
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES crm_contacts(id),
  title VARCHAR(255) NOT NULL,
  value DECIMAL(12,2),
  stage VARCHAR(50) DEFAULT 'qualification',
  probability INTEGER DEFAULT 0,
  close_date DATE,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications and Messages
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_loads_organization ON loads(organization_id);
CREATE INDEX IF NOT EXISTS idx_loads_assigned_to ON loads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_loads_pickup_date ON loads(pickup_date);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_organization ON crm_contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_type ON crm_contacts(type);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_lead_score ON crm_contacts(lead_score);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Insert demo data for testing
INSERT INTO organizations (id, name, type, mc_number, dot_number, email, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'FleetFlow TMS LLC', 'broker', 'MC1647572', 'DOT4250594', 'ddavis@fleetflowapp.com', '(833) 386-3509')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, role, organization_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@fleetflowapp.com', 'FleetFlow Admin', 'admin', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440002', 'dispatch@fleetflowapp.com', 'Dispatch Manager', 'dispatcher', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440003', 'driver@fleetflowapp.com', 'John Smith', 'driver', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440004', 'broker@fleetflowapp.com', 'Sarah Johnson', 'broker', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;
