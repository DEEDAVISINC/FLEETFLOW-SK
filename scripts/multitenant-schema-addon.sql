-- Multi-Tenant Support for FleetFlow
-- Add this to your existing Supabase schema to enable multi-tenancy

-- Create organizations/tenants table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
    domain TEXT, -- Custom domain if applicable
    plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant integrations table for storing per-tenant API configurations
CREATE TABLE IF NOT EXISTS tenant_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL, -- 'square', 'stripe', 'quickbooks', etc.
    config JSONB NOT NULL DEFAULT '{}', -- Store encrypted credentials and settings
    enabled BOOLEAN DEFAULT FALSE,
    connected BOOLEAN DEFAULT FALSE,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint to prevent duplicate integrations per tenant
    UNIQUE(organization_id, integration_type)
);

-- Add organization_id to existing tables for tenant isolation
-- Note: This is a breaking change that requires data migration

-- Add organization_id to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add organization_id to loads
ALTER TABLE loads ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add organization_id to notifications (if it doesn't exist)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Create invoices table with multi-tenant support
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_company TEXT,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date DATE,

    -- Square-specific fields
    square_invoice_id TEXT,
    square_customer_id TEXT,
    square_public_url TEXT,

    -- Stripe-specific fields
    stripe_invoice_id TEXT,
    stripe_customer_id TEXT,

    -- Common fields
    external_invoice_url TEXT,
    payment_processor TEXT, -- 'square', 'stripe', 'manual', etc.
    line_items JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',

    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint for invoice numbers per organization
    UNIQUE(organization_id, invoice_number)
);

-- Create customers table with multi-tenant support
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    address JSONB,

    -- External service IDs
    square_customer_id TEXT,
    stripe_customer_id TEXT,

    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint for email per organization (allow same email across tenants)
    UNIQUE(organization_id, email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_loads_organization_id ON loads(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_org_type ON tenant_integrations(organization_id, integration_type);

-- Enable Row Level Security (RLS) for all multi-tenant tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Tenant integrations: Users can only manage their organization's integrations
CREATE POLICY "Users can manage their organization's integrations" ON tenant_integrations
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Invoices: Users can only see their organization's invoices
CREATE POLICY "Users can manage their organization's invoices" ON invoices
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Customers: Users can only see their organization's customers
CREATE POLICY "Users can manage their organization's customers" ON customers
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Update existing tables' RLS policies to include organization_id
-- Note: This assumes existing RLS policies need to be updated

-- Update user_profiles RLS policy
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view profiles in their organization" ON user_profiles
    FOR SELECT USING (
        auth.uid() = id OR
        organization_id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Update loads RLS policy
DROP POLICY IF EXISTS "Users can manage loads" ON loads;
CREATE POLICY "Users can manage their organization's loads" ON loads
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Update notifications RLS policy
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their organization's notifications" ON notifications
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        ) OR
        user_id = auth.uid()
    );

-- Create functions for common tenant operations

-- Function to get current user's organization ID
CREATE OR REPLACE FUNCTION get_current_user_organization_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id
        FROM user_profiles
        WHERE id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user belongs to organization
CREATE OR REPLACE FUNCTION user_belongs_to_organization(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_profiles
        WHERE id = auth.uid()
        AND organization_id = org_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tenant integration config
CREATE OR REPLACE FUNCTION get_tenant_integration_config(integration_name TEXT)
RETURNS JSONB AS $$
DECLARE
    org_id UUID;
    config JSONB;
BEGIN
    org_id := get_current_user_organization_id();

    IF org_id IS NULL THEN
        RETURN '{}'::JSONB;
    END IF;

    SELECT ti.config INTO config
    FROM tenant_integrations ti
    WHERE ti.organization_id = org_id
    AND ti.integration_type = integration_name
    AND ti.enabled = true
    AND ti.connected = true;

    RETURN COALESCE(config, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update tenant integration config
CREATE OR REPLACE FUNCTION update_tenant_integration_config(
    integration_name TEXT,
    new_config JSONB,
    is_enabled BOOLEAN DEFAULT true,
    is_connected BOOLEAN DEFAULT true
)
RETURNS BOOLEAN AS $$
DECLARE
    org_id UUID;
BEGIN
    org_id := get_current_user_organization_id();

    IF org_id IS NULL THEN
        RETURN false;
    END IF;

    INSERT INTO tenant_integrations (
        organization_id,
        integration_type,
        config,
        enabled,
        connected,
        last_sync
    ) VALUES (
        org_id,
        integration_name,
        new_config,
        is_enabled,
        is_connected,
        CASE WHEN is_connected THEN NOW() ELSE NULL END
    )
    ON CONFLICT (organization_id, integration_type)
    DO UPDATE SET
        config = EXCLUDED.config,
        enabled = EXCLUDED.enabled,
        connected = EXCLUDED.connected,
        last_sync = EXCLUDED.last_sync,
        updated_at = NOW();

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample organizations for testing
INSERT INTO organizations (id, name, slug, plan, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Acme Logistics', 'acme-logistics', 'professional', 'active'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Beta Transport', 'beta-transport', 'enterprise', 'active'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Gamma Freight', 'gamma-freight', 'basic', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tenant integrations
INSERT INTO tenant_integrations (organization_id, integration_type, config, enabled, connected) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'square',
     '{"applicationId": "sandbox-sq0idb-example1", "environment": "sandbox", "locationId": "location-1"}'::jsonb,
     true, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'square',
     '{"applicationId": "sandbox-sq0idb-example2", "environment": "sandbox", "locationId": "location-2"}'::jsonb,
     true, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'stripe',
     '{"publishableKey": "pk_test_example", "environment": "test"}'::jsonb,
     true, true)
ON CONFLICT (organization_id, integration_type) DO NOTHING;







































