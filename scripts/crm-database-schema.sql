-- ============================================================================
-- FLEETFLOW CRM DATABASE SCHEMA - COMPREHENSIVE PRODUCTION READY
-- ============================================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: crm_contacts - ALL contacts (drivers, shippers, carriers)
-- ============================================================================
CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('driver', 'shipper', 'carrier', 'broker', 'customer')),
    
    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    title VARCHAR(100),
    
    -- Contact Information
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    mobile VARCHAR(20),
    fax VARCHAR(20),
    
    -- Address Information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    
    -- Company Association
    company_id UUID REFERENCES crm_companies(id),
    
    -- Driver Specific Fields
    cdl_number VARCHAR(50),
    cdl_class VARCHAR(10),
    cdl_expiry DATE,
    dot_number VARCHAR(20),
    
    -- Shipper/Carrier Specific Fields
    mc_number VARCHAR(20),
    duns_number VARCHAR(20),
    
    -- Status & Classification
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect', 'blacklisted')),
    lead_source VARCHAR(50),
    lead_score INTEGER DEFAULT 0,
    
    -- Preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'sms', 'mail')),
    time_zone VARCHAR(50) DEFAULT 'America/New_York',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Additional Data
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB
);

-- ============================================================================
-- TABLE: crm_companies - Company/account management
-- ============================================================================
CREATE TABLE crm_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Company Information
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    company_type VARCHAR(50) CHECK (company_type IN ('shipper', 'carrier', 'broker', 'customer', 'vendor')),
    
    -- Business Details
    industry VARCHAR(100),
    employee_count INTEGER,
    annual_revenue DECIMAL(15,2),
    
    -- Contact Information
    website VARCHAR(255),
    main_phone VARCHAR(20),
    main_email VARCHAR(255),
    
    -- Address Information
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100) DEFAULT 'USA',
    
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(50),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100) DEFAULT 'USA',
    
    -- Regulatory Information
    dot_number VARCHAR(20),
    mc_number VARCHAR(20),
    duns_number VARCHAR(20),
    ein_number VARCHAR(20),
    
    -- Insurance Information
    insurance_provider VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    insurance_expiry DATE,
    insurance_amount DECIMAL(15,2),
    
    -- Status & Classification
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect', 'blacklisted')),
    tier VARCHAR(20) DEFAULT 'standard' CHECK (tier IN ('premium', 'standard', 'basic')),
    
    -- Business Metrics
    credit_limit DECIMAL(15,2),
    payment_terms INTEGER DEFAULT 30,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Additional Data
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB
);

-- ============================================================================
-- TABLE: crm_opportunities - Sales pipeline tracking
-- ============================================================================
CREATE TABLE crm_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    opportunity_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Associated Records
    contact_id UUID REFERENCES crm_contacts(id),
    company_id UUID REFERENCES crm_companies(id),
    pipeline_id UUID REFERENCES crm_pipelines(id),
    
    -- Opportunity Details
    stage VARCHAR(50) NOT NULL,
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    value DECIMAL(15,2),
    expected_close_date DATE,
    actual_close_date DATE,
    
    -- Load/Freight Specific
    load_type VARCHAR(50),
    origin_city VARCHAR(100),
    origin_state VARCHAR(50),
    destination_city VARCHAR(100),
    destination_state VARCHAR(50),
    equipment_type VARCHAR(50),
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost', 'cancelled')),
    win_reason VARCHAR(255),
    loss_reason VARCHAR(255),
    
    -- Assignment
    assigned_to UUID,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Additional Data
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB
);

-- ============================================================================
-- TABLE: crm_activities - All interactions (calls, emails, meetings)
-- ============================================================================
CREATE TABLE crm_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Activity Type
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'task', 'note', 'sms', 'quote', 'follow_up')),
    
    -- Basic Information
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Associated Records
    contact_id UUID REFERENCES crm_contacts(id),
    company_id UUID REFERENCES crm_companies(id),
    opportunity_id UUID REFERENCES crm_opportunities(id),
    
    -- Activity Details
    activity_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    location VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Call Specific Fields
    call_direction VARCHAR(20) CHECK (call_direction IN ('inbound', 'outbound')),
    call_outcome VARCHAR(50),
    call_recording_url VARCHAR(500),
    
    -- Email Specific Fields
    email_subject VARCHAR(255),
    email_body TEXT,
    email_opened BOOLEAN DEFAULT FALSE,
    email_clicked BOOLEAN DEFAULT FALSE,
    
    -- Meeting Specific Fields
    meeting_type VARCHAR(50) CHECK (meeting_type IN ('phone', 'video', 'in_person')),
    meeting_url VARCHAR(500),
    attendees TEXT[],
    
    -- Assignment
    assigned_to UUID,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Additional Data
    tags TEXT[],
    custom_fields JSONB
);

-- ============================================================================
-- TABLE: crm_communications - Email/SMS/phone tracking
-- ============================================================================
CREATE TABLE crm_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Communication Type
    communication_type VARCHAR(20) NOT NULL CHECK (communication_type IN ('email', 'sms', 'phone', 'mail', 'fax')),
    
    -- Direction
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    
    -- Associated Records
    contact_id UUID REFERENCES crm_contacts(id),
    company_id UUID REFERENCES crm_companies(id),
    opportunity_id UUID REFERENCES crm_opportunities(id),
    activity_id UUID REFERENCES crm_activities(id),
    
    -- Communication Details
    subject VARCHAR(255),
    body TEXT,
    
    -- Sender/Recipient Information
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    cc_address TEXT[],
    bcc_address TEXT[],
    
    -- Phone Specific
    phone_number VARCHAR(20),
    call_duration INTEGER,
    call_recording_url VARCHAR(500),
    
    -- Status & Tracking
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'failed', 'bounced')),
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    
    -- Metadata
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    -- Additional Data
    attachments JSONB,
    custom_fields JSONB
);

-- ============================================================================
-- TABLE: crm_pipelines - Customizable sales processes
-- ============================================================================
CREATE TABLE crm_pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Pipeline Information
    pipeline_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Configuration
    stages JSONB NOT NULL, -- Array of stage objects with name, probability, order
    
    -- Pipeline Type
    pipeline_type VARCHAR(50) DEFAULT 'sales' CHECK (pipeline_type IN ('sales', 'recruiting', 'onboarding', 'service')),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Additional Data
    custom_fields JSONB
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- crm_contacts indexes
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_phone ON crm_contacts(phone);
CREATE INDEX idx_crm_contacts_company ON crm_contacts(company_id);
CREATE INDEX idx_crm_contacts_type ON crm_contacts(contact_type);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_contacts_created ON crm_contacts(created_at);

-- crm_companies indexes
CREATE INDEX idx_crm_companies_name ON crm_companies(company_name);
CREATE INDEX idx_crm_companies_type ON crm_companies(company_type);
CREATE INDEX idx_crm_companies_dot ON crm_companies(dot_number);
CREATE INDEX idx_crm_companies_mc ON crm_companies(mc_number);
CREATE INDEX idx_crm_companies_status ON crm_companies(status);

-- crm_opportunities indexes
CREATE INDEX idx_crm_opportunities_contact ON crm_opportunities(contact_id);
CREATE INDEX idx_crm_opportunities_company ON crm_opportunities(company_id);
CREATE INDEX idx_crm_opportunities_pipeline ON crm_opportunities(pipeline_id);
CREATE INDEX idx_crm_opportunities_stage ON crm_opportunities(stage);
CREATE INDEX idx_crm_opportunities_status ON crm_opportunities(status);
CREATE INDEX idx_crm_opportunities_close_date ON crm_opportunities(expected_close_date);
CREATE INDEX idx_crm_opportunities_assigned ON crm_opportunities(assigned_to);

-- crm_activities indexes
CREATE INDEX idx_crm_activities_contact ON crm_activities(contact_id);
CREATE INDEX idx_crm_activities_company ON crm_activities(company_id);
CREATE INDEX idx_crm_activities_opportunity ON crm_activities(opportunity_id);
CREATE INDEX idx_crm_activities_type ON crm_activities(activity_type);
CREATE INDEX idx_crm_activities_date ON crm_activities(activity_date);
CREATE INDEX idx_crm_activities_status ON crm_activities(status);
CREATE INDEX idx_crm_activities_assigned ON crm_activities(assigned_to);

-- crm_communications indexes
CREATE INDEX idx_crm_communications_contact ON crm_communications(contact_id);
CREATE INDEX idx_crm_communications_company ON crm_communications(company_id);
CREATE INDEX idx_crm_communications_opportunity ON crm_communications(opportunity_id);
CREATE INDEX idx_crm_communications_type ON crm_communications(communication_type);
CREATE INDEX idx_crm_communications_direction ON crm_communications(direction);
CREATE INDEX idx_crm_communications_sent ON crm_communications(sent_at);

-- crm_pipelines indexes
CREATE INDEX idx_crm_pipelines_active ON crm_pipelines(is_active);
CREATE INDEX idx_crm_pipelines_default ON crm_pipelines(is_default);
CREATE INDEX idx_crm_pipelines_type ON crm_pipelines(pipeline_type);

-- ============================================================================
-- SAMPLE DATA FOR PIPELINES
-- ============================================================================

-- Default Sales Pipeline
INSERT INTO crm_pipelines (pipeline_name, description, pipeline_type, is_active, is_default, stages) VALUES
(
    'Freight Sales Pipeline',
    'Standard sales process for freight brokerage opportunities',
    'sales',
    TRUE,
    TRUE,
    '[
        {"name": "Lead", "probability": 10, "order": 1},
        {"name": "Qualified", "probability": 25, "order": 2},
        {"name": "Proposal", "probability": 50, "order": 3},
        {"name": "Negotiation", "probability": 75, "order": 4},
        {"name": "Closed Won", "probability": 100, "order": 5}
    ]'
);

-- Driver Recruiting Pipeline
INSERT INTO crm_pipelines (pipeline_name, description, pipeline_type, is_active, is_default, stages) VALUES
(
    'Driver Recruiting Pipeline',
    'Process for recruiting and onboarding new drivers',
    'recruiting',
    TRUE,
    FALSE,
    '[
        {"name": "Application", "probability": 10, "order": 1},
        {"name": "Phone Screen", "probability": 25, "order": 2},
        {"name": "Background Check", "probability": 50, "order": 3},
        {"name": "Interview", "probability": 75, "order": 4},
        {"name": "Offer", "probability": 90, "order": 5},
        {"name": "Hired", "probability": 100, "order": 6}
    ]'
);

-- Carrier Onboarding Pipeline
INSERT INTO crm_pipelines (pipeline_name, description, pipeline_type, is_active, is_default, stages) VALUES
(
    'Carrier Onboarding Pipeline',
    'Process for onboarding new carrier partners',
    'onboarding',
    TRUE,
    FALSE,
    '[
        {"name": "Application", "probability": 10, "order": 1},
        {"name": "FMCSA Verification", "probability": 25, "order": 2},
        {"name": "Insurance Review", "probability": 50, "order": 3},
        {"name": "Document Collection", "probability": 75, "order": 4},
        {"name": "Approved", "probability": 100, "order": 5}
    ]'
);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_companies_updated_at BEFORE UPDATE ON crm_companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_opportunities_updated_at BEFORE UPDATE ON crm_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_activities_updated_at BEFORE UPDATE ON crm_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_communications_updated_at BEFORE UPDATE ON crm_communications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_pipelines_updated_at BEFORE UPDATE ON crm_pipelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Contact with Company Information
CREATE VIEW v_crm_contacts_with_company AS
SELECT 
    c.*,
    co.company_name,
    co.company_type,
    co.industry,
    co.main_phone AS company_phone,
    co.main_email AS company_email
FROM crm_contacts c
LEFT JOIN crm_companies co ON c.company_id = co.id;

-- Opportunity Pipeline Summary
CREATE VIEW v_crm_opportunity_pipeline AS
SELECT 
    o.*,
    c.full_name AS contact_name,
    co.company_name,
    p.pipeline_name,
    a.first_name || ' ' || a.last_name AS assigned_to_name
FROM crm_opportunities o
LEFT JOIN crm_contacts c ON o.contact_id = c.id
LEFT JOIN crm_companies co ON o.company_id = co.id
LEFT JOIN crm_pipelines p ON o.pipeline_id = p.id
LEFT JOIN crm_contacts a ON o.assigned_to = a.id;

-- Activity Summary
CREATE VIEW v_crm_activity_summary AS
SELECT 
    a.*,
    c.full_name AS contact_name,
    co.company_name,
    o.opportunity_name,
    u.first_name || ' ' || u.last_name AS assigned_to_name
FROM crm_activities a
LEFT JOIN crm_contacts c ON a.contact_id = c.id
LEFT JOIN crm_companies co ON a.company_id = co.id
LEFT JOIN crm_opportunities o ON a.opportunity_id = o.id
LEFT JOIN crm_contacts u ON a.assigned_to = u.id;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE crm_contacts IS 'All contacts including drivers, shippers, carriers, and brokers';
COMMENT ON TABLE crm_companies IS 'Company and account management for all business entities';
COMMENT ON TABLE crm_opportunities IS 'Sales pipeline tracking for freight opportunities';
COMMENT ON TABLE crm_activities IS 'All interactions including calls, emails, meetings, and tasks';
COMMENT ON TABLE crm_communications IS 'Detailed tracking of all communications';
COMMENT ON TABLE crm_pipelines IS 'Customizable sales processes and workflows';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- This completes the comprehensive CRM database schema for FleetFlow
-- All tables are production-ready with proper indexing, relationships, and sample data 