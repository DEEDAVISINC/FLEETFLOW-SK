-- Multi-Tenant Payment Provider Schema for FleetFlow
-- Supports Square, Bill.com, QuickBooks, and Stripe

-- Organizations/Tenants table (if not exists)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'basic', -- basic, professional, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced tenant integrations table for multiple payment providers
CREATE TABLE IF NOT EXISTS tenant_payment_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- square, billcom, quickbooks, stripe
  provider_config JSONB NOT NULL, -- Provider-specific configuration
  is_primary BOOLEAN DEFAULT FALSE, -- Primary payment provider for tenant
  is_enabled BOOLEAN DEFAULT TRUE,
  is_connected BOOLEAN DEFAULT FALSE,
  connection_status VARCHAR(50) DEFAULT 'disconnected', -- connected, disconnected, error, testing
  last_sync_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure only one primary provider per tenant
  CONSTRAINT unique_primary_per_tenant EXCLUDE (tenant_id WITH =) WHERE (is_primary = TRUE),
  -- Unique provider per tenant (one Square config, one Stripe config, etc.)
  CONSTRAINT unique_provider_per_tenant UNIQUE (tenant_id, provider)
);

-- Tenant payment preferences
CREATE TABLE IF NOT EXISTS tenant_payment_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  default_provider VARCHAR(50) NOT NULL, -- square, billcom, quickbooks, stripe
  fallback_provider VARCHAR(50), -- Optional fallback provider
  auto_switch_on_failure BOOLEAN DEFAULT FALSE,
  preferred_currency VARCHAR(3) DEFAULT 'USD',
  invoice_settings JSONB DEFAULT '{}', -- Invoice preferences (terms, footer, etc.)
  notification_settings JSONB DEFAULT '{}', -- Email/webhook preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One preference record per tenant
  CONSTRAINT unique_preferences_per_tenant UNIQUE (tenant_id)
);

-- Payment provider capabilities (reference table)
CREATE TABLE IF NOT EXISTS payment_provider_capabilities (
  provider VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  features JSONB NOT NULL, -- Array of supported features
  configuration_schema JSONB NOT NULL, -- JSON schema for provider config
  is_active BOOLEAN DEFAULT TRUE,
  documentation_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert provider capabilities
INSERT INTO payment_provider_capabilities (provider, display_name, features, configuration_schema) VALUES
('square', 'Square',
 '[{"type": "invoicing", "available": true}, {"type": "payments", "available": true}, {"type": "customers", "available": true}, {"type": "reporting", "available": true}, {"type": "subscriptions", "available": false}]',
 '{"type": "object", "properties": {"applicationId": {"type": "string"}, "accessToken": {"type": "string"}, "locationId": {"type": "string"}, "environment": {"type": "string", "enum": ["sandbox", "production"]}}}'
),
('billcom', 'Bill.com',
 '[{"type": "invoicing", "available": true}, {"type": "payments", "available": true}, {"type": "customers", "available": true}, {"type": "reporting", "available": true}, {"type": "subscriptions", "available": false}]',
 '{"type": "object", "properties": {"apiKey": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}, "orgId": {"type": "string"}, "environment": {"type": "string", "enum": ["sandbox", "production"]}}}'
),
('quickbooks', 'QuickBooks',
 '[{"type": "invoicing", "available": true}, {"type": "payments", "available": true}, {"type": "customers", "available": true}, {"type": "reporting", "available": true}, {"type": "subscriptions", "available": false}]',
 '{"type": "object", "properties": {"clientId": {"type": "string"}, "clientSecret": {"type": "string"}, "accessToken": {"type": "string"}, "refreshToken": {"type": "string"}, "companyId": {"type": "string"}, "environment": {"type": "string", "enum": ["sandbox", "production"]}}}'
),
('stripe', 'Stripe',
 '[{"type": "invoicing", "available": true}, {"type": "payments", "available": true}, {"type": "customers", "available": true}, {"type": "reporting", "available": true}, {"type": "subscriptions", "available": true}]',
 '{"type": "object", "properties": {"publishableKey": {"type": "string"}, "secretKey": {"type": "string"}, "webhookSecret": {"type": "string"}, "environment": {"type": "string", "enum": ["test", "live"]}}}'
)
ON CONFLICT (provider) DO UPDATE SET
  features = EXCLUDED.features,
  configuration_schema = EXCLUDED.configuration_schema,
  updated_at = NOW();

-- Invoices table with provider information
CREATE TABLE IF NOT EXISTS tenant_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  payment_provider VARCHAR(50) NOT NULL,
  provider_invoice_id VARCHAR(255), -- Provider-specific invoice ID
  provider_invoice_number VARCHAR(255),
  internal_invoice_number VARCHAR(255) NOT NULL,

  -- Customer information
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_company VARCHAR(255),
  customer_phone VARCHAR(50),

  -- Invoice details
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,

  -- Dates
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,

  -- Provider-specific data
  provider_data JSONB DEFAULT '{}',
  public_url TEXT,

  -- FleetFlow specific
  load_id VARCHAR(255), -- Reference to load if invoice is for transportation
  custom_fields JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes for performance
  CONSTRAINT unique_internal_invoice_per_tenant UNIQUE (tenant_id, internal_invoice_number)
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS tenant_invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES tenant_invoices(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  rate DECIMAL(12,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  taxable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_line_number_per_invoice UNIQUE (invoice_id, line_number)
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS tenant_payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES tenant_invoices(id) ON DELETE SET NULL,
  payment_provider VARCHAR(50) NOT NULL,
  provider_transaction_id VARCHAR(255),

  -- Transaction details
  type VARCHAR(50) NOT NULL, -- payment, refund, adjustment
  status VARCHAR(50) NOT NULL, -- pending, completed, failed, cancelled
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  fee_amount DECIMAL(12,2) DEFAULT 0,
  net_amount DECIMAL(12,2),

  -- Provider-specific data
  provider_data JSONB DEFAULT '{}',

  -- Metadata
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenant_payment_integrations_tenant_id ON tenant_payment_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_payment_integrations_provider ON tenant_payment_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_tenant_payment_integrations_primary ON tenant_payment_integrations(tenant_id, is_primary) WHERE is_primary = TRUE;

CREATE INDEX IF NOT EXISTS idx_tenant_invoices_tenant_id ON tenant_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_provider ON tenant_invoices(payment_provider);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_status ON tenant_invoices(status);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_load_id ON tenant_invoices(load_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invoices_due_date ON tenant_invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_tenant_payment_transactions_tenant_id ON tenant_payment_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_payment_transactions_invoice_id ON tenant_payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_tenant_payment_transactions_provider ON tenant_payment_transactions(payment_provider);

-- Row Level Security (RLS) policies
ALTER TABLE tenant_payment_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_payment_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY tenant_payment_integrations_policy ON tenant_payment_integrations
  USING (tenant_id = (current_setting('app.current_tenant_id'))::UUID);

CREATE POLICY tenant_payment_preferences_policy ON tenant_payment_preferences
  USING (tenant_id = (current_setting('app.current_tenant_id'))::UUID);

CREATE POLICY tenant_invoices_policy ON tenant_invoices
  USING (tenant_id = (current_setting('app.current_tenant_id'))::UUID);

CREATE POLICY tenant_invoice_line_items_policy ON tenant_invoice_line_items
  USING (EXISTS (
    SELECT 1 FROM tenant_invoices i
    WHERE i.id = invoice_id
    AND i.tenant_id = (current_setting('app.current_tenant_id'))::UUID
  ));

CREATE POLICY tenant_payment_transactions_policy ON tenant_payment_transactions
  USING (tenant_id = (current_setting('app.current_tenant_id'))::UUID);

-- Sample data for demonstration
INSERT INTO organizations (id, name, slug, plan, status) VALUES
('acme-logistics-uuid', 'Acme Logistics Inc', 'acme-logistics', 'professional', 'active'),
('beta-transport-uuid', 'Beta Transport LLC', 'beta-transport', 'enterprise', 'active'),
('gamma-freight-uuid', 'Gamma Freight Solutions', 'gamma-freight', 'basic', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Sample payment integrations
INSERT INTO tenant_payment_integrations (tenant_id, provider, provider_config, is_primary, is_enabled, is_connected) VALUES
((SELECT id FROM organizations WHERE slug = 'acme-logistics'), 'square',
 '{"applicationId": "sq0idb-acme123", "accessToken": "sandbox-token-acme", "locationId": "location-acme", "environment": "sandbox"}',
 true, true, true),
((SELECT id FROM organizations WHERE slug = 'acme-logistics'), 'billcom',
 '{"apiKey": "01ICBWLWIERUAFTN2157", "username": "acme@example.com", "password": "password123", "orgId": "0297208089826008", "environment": "sandbox"}',
 false, true, false),
((SELECT id FROM organizations WHERE slug = 'beta-transport'), 'quickbooks',
 '{"clientId": "qb_client_beta", "clientSecret": "qb_secret_beta", "accessToken": "qb_access_beta", "refreshToken": "qb_refresh_beta", "companyId": "qb_company_beta", "environment": "sandbox"}',
 true, true, true),
((SELECT id FROM organizations WHERE slug = 'beta-transport'), 'stripe',
 '{"publishableKey": "pk_test_beta", "secretKey": "sk_test_beta", "webhookSecret": "whsec_beta", "environment": "test"}',
 false, true, true),
((SELECT id FROM organizations WHERE slug = 'gamma-freight'), 'stripe',
 '{"publishableKey": "pk_test_gamma", "secretKey": "sk_test_gamma", "webhookSecret": "whsec_gamma", "environment": "test"}',
 true, true, true)
ON CONFLICT (tenant_id, provider) DO NOTHING;

-- Sample payment preferences
INSERT INTO tenant_payment_preferences (tenant_id, default_provider, fallback_provider, auto_switch_on_failure) VALUES
((SELECT id FROM organizations WHERE slug = 'acme-logistics'), 'square', 'billcom', false),
((SELECT id FROM organizations WHERE slug = 'beta-transport'), 'quickbooks', 'stripe', true),
((SELECT id FROM organizations WHERE slug = 'gamma-freight'), 'stripe', null, false)
ON CONFLICT (tenant_id) DO NOTHING;























