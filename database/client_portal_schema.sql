-- FLEETFLOW CLIENT PORTAL DATABASE SCHEMA
-- Multi-tenant client portal for freight forwarder clients

-- Enable Row Level Security for multi-tenancy
-- ALTER DATABASE fleetflow SET row_security = on;

-- ============================================================================
-- CLIENT ORGANIZATIONS
-- ============================================================================

CREATE TABLE ff_client_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL, -- Freight forwarder tenant ID
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    address JSONB, -- {street, city, state, zip, country}
    branding JSONB DEFAULT '{
        "primaryColor": "#667eea",
        "secondaryColor": "#764ba2",
        "logo": null,
        "customDomain": null,
        "portalName": null
    }',
    settings JSONB DEFAULT '{
        "allowedFileTypes": ["pdf", "jpg", "png", "doc", "docx", "xls", "xlsx"],
        "maxFileSize": 10,
        "autoNotifications": true,
        "requireApprovalWorkflow": false,
        "customFields": {}
    }',
    subscription_tier VARCHAR(20) DEFAULT 'PROFESSIONAL' CHECK (subscription_tier IN ('STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CLIENT USERS
-- ============================================================================

CREATE TABLE ff_client_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES ff_client_organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- Freight forwarder tenant ID
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- For portal authentication
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'MANAGER', 'USER', 'VIEWER')),
    permissions JSONB, -- Array of permission objects
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CLIENT SHIPMENTS
-- ============================================================================

CREATE TABLE ff_client_shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES ff_client_organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL, -- Freight forwarder tenant ID
    shipment_id UUID NOT NULL, -- Reference to main freight forwarder shipment
    shipment_number VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'QUOTE_REQUESTED' CHECK (status IN (
        'QUOTE_REQUESTED', 'QUOTE_PROVIDED', 'BOOKED', 'IN_TRANSIT',
        'ARRIVED', 'CLEARED', 'DELIVERED', 'COMPLETED', 'CANCELLED'
    )),
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    etd DATE,
    eta DATE,
    cargo_description TEXT,
    cargo_value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    assigned_users UUID[] DEFAULT '{}', -- Client user IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SHIPMENT MILESTONES
-- ============================================================================

CREATE TABLE ff_shipment_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_shipment_id UUID NOT NULL REFERENCES ff_client_shipments(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    milestone VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CLIENT DOCUMENTS
-- ============================================================================

CREATE TABLE ff_client_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_shipment_id UUID NOT NULL REFERENCES ff_client_shipments(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN (
        'COMMERCIAL_INVOICE', 'PACKING_LIST', 'CERTIFICATE_OF_ORIGIN',
        'INSURANCE', 'CUSTOMS_DOCS', 'OTHER'
    )),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    uploaded_by UUID NOT NULL REFERENCES ff_client_users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID, -- Freight forwarder user ID
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    file_url VARCHAR(500),
    file_size INTEGER, -- bytes
    mime_type VARCHAR(100),
    checksum VARCHAR(128), -- For file integrity
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COMMUNICATION MESSAGES
-- ============================================================================

CREATE TABLE ff_client_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES ff_client_organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    from_user_id UUID NOT NULL REFERENCES ff_client_users(id),
    shipment_id UUID REFERENCES ff_client_shipments(id),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(20) DEFAULT 'SENT' CHECK (status IN ('SENT', 'READ', 'REPLIED', 'ARCHIVED')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE ff_client_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES ff_client_organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    user_ids UUID[], -- Specific users, or all if empty
    type VARCHAR(30) CHECK (type IN (
        'SHIPMENT_UPDATE', 'DOCUMENT_REQUEST', 'PAYMENT_DUE',
        'CUSTOMS_ISSUE', 'MILESTONE_REACHED', 'GENERAL'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    shipment_id UUID REFERENCES ff_client_shipments(id),
    action_url VARCHAR(500),
    read_by UUID[] DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CLIENT SESSIONS
-- ============================================================================

CREATE TABLE ff_client_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_user_id UUID NOT NULL REFERENCES ff_client_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE ff_client_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES ff_client_organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    user_id UUID REFERENCES ff_client_users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Client organizations
CREATE INDEX idx_client_org_tenant ON ff_client_organizations(tenant_id);
CREATE INDEX idx_client_org_active ON ff_client_organizations(is_active);

-- Client users
CREATE INDEX idx_client_users_client ON ff_client_users(client_id);
CREATE INDEX idx_client_users_email ON ff_client_users(email);
CREATE INDEX idx_client_users_tenant ON ff_client_users(tenant_id);
CREATE INDEX idx_client_users_active ON ff_client_users(is_active);

-- Client shipments
CREATE INDEX idx_client_shipments_client ON ff_client_shipments(client_id);
CREATE INDEX idx_client_shipments_tenant ON ff_client_shipments(tenant_id);
CREATE INDEX idx_client_shipments_status ON ff_client_shipments(status);
CREATE INDEX idx_client_shipments_eta ON ff_client_shipments(eta);

-- Shipment milestones
CREATE INDEX idx_shipment_milestones_shipment ON ff_shipment_milestones(client_shipment_id);
CREATE INDEX idx_shipment_milestones_status ON ff_shipment_milestones(status);

-- Client documents
CREATE INDEX idx_client_documents_shipment ON ff_client_documents(client_shipment_id);
CREATE INDEX idx_client_documents_status ON ff_client_documents(status);
CREATE INDEX idx_client_documents_uploaded_by ON ff_client_documents(uploaded_by);

-- Messages
CREATE INDEX idx_client_messages_client ON ff_client_messages(client_id);
CREATE INDEX idx_client_messages_shipment ON ff_client_messages(shipment_id);
CREATE INDEX idx_client_messages_timestamp ON ff_client_messages(timestamp);

-- Notifications
CREATE INDEX idx_client_notifications_client ON ff_client_notifications(client_id);
CREATE INDEX idx_client_notifications_type ON ff_client_notifications(type);
CREATE INDEX idx_client_notifications_timestamp ON ff_client_notifications(timestamp);

-- Sessions
CREATE INDEX idx_client_sessions_user ON ff_client_sessions(client_user_id);
CREATE INDEX idx_client_sessions_token ON ff_client_sessions(session_token);
CREATE INDEX idx_client_sessions_expires ON ff_client_sessions(expires_at);

-- Audit
CREATE INDEX idx_client_audit_client ON ff_client_audit_log(client_id);
CREATE INDEX idx_client_audit_timestamp ON ff_client_audit_log(timestamp);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE ff_client_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_shipment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_client_audit_log ENABLE ROW LEVEL SECURITY;

-- Policies for client organizations
CREATE POLICY "tenant_access_client_orgs" ON ff_client_organizations
    FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Policies for client users
CREATE POLICY "tenant_access_client_users" ON ff_client_users
    FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Policies for client shipments
CREATE POLICY "tenant_access_client_shipments" ON ff_client_shipments
    FOR ALL USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Additional policies for client users to access their own organization's data
CREATE POLICY "client_users_access_own_org" ON ff_client_organizations
    FOR SELECT USING (
        id IN (
            SELECT client_id FROM ff_client_users
            WHERE id = current_setting('app.user_id')::uuid
        )
    );

CREATE POLICY "client_users_access_own_shipments" ON ff_client_shipments
    FOR SELECT USING (
        client_id IN (
            SELECT client_id FROM ff_client_users
            WHERE id = current_setting('app.user_id')::uuid
        )
    );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_client_org_updated_at BEFORE UPDATE ON ff_client_organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_user_updated_at BEFORE UPDATE ON ff_client_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_shipment_updated_at BEFORE UPDATE ON ff_client_shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_client_audit_event(
    p_client_id UUID,
    p_tenant_id UUID,
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(50),
    p_resource_id UUID,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO ff_client_audit_log (
        client_id, tenant_id, user_id, action, resource_type,
        resource_id, details, ip_address
    ) VALUES (
        p_client_id, p_tenant_id, p_user_id, p_action, p_resource_type,
        p_resource_id, p_details, p_ip_address
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for client dashboard stats
CREATE VIEW ff_client_dashboard_stats AS
SELECT
    co.id as client_id,
    co.tenant_id,
    COUNT(DISTINCT cs.id) as total_shipments,
    COUNT(DISTINCT CASE WHEN cs.status IN ('DELIVERED', 'COMPLETED') THEN cs.id END) as completed_shipments,
    COUNT(DISTINCT CASE WHEN cs.status IN ('IN_TRANSIT', 'ARRIVED') THEN cs.id END) as active_shipments,
    COUNT(DISTINCT cd.id) as total_documents,
    COUNT(DISTINCT CASE WHEN cd.status = 'PENDING' THEN cd.id END) as pending_documents,
    COUNT(DISTINCT CASE WHEN cd.status = 'APPROVED' THEN cd.id END) as approved_documents,
    SUM(cs.cargo_value) as total_value,
    AVG(EXTRACT(EPOCH FROM (sm.timestamp - cs.created_at))/86400) as avg_transit_days
FROM ff_client_organizations co
LEFT JOIN ff_client_shipments cs ON cs.client_id = co.id
LEFT JOIN ff_client_documents cd ON cd.client_shipment_id = cs.id
LEFT JOIN ff_shipment_milestones sm ON sm.client_shipment_id = cs.id AND sm.milestone = 'DELIVERED'
WHERE co.is_active = true
GROUP BY co.id, co.tenant_id;

-- View for recent client activity
CREATE VIEW ff_client_recent_activity AS
SELECT
    'shipment' as activity_type,
    cs.client_id,
    cs.id as resource_id,
    cs.shipment_number as title,
    cs.status as status,
    cs.created_at as timestamp
FROM ff_client_shipments cs
UNION ALL
SELECT
    'document' as activity_type,
    cs.client_id,
    cd.id as resource_id,
    cd.name as title,
    cd.status::text as status,
    cd.uploaded_at as timestamp
FROM ff_client_documents cd
JOIN ff_client_shipments cs ON cd.client_shipment_id = cs.id
UNION ALL
SELECT
    'message' as activity_type,
    cm.client_id,
    cm.id as resource_id,
    cm.subject as title,
    cm.priority as status,
    cm.timestamp
FROM ff_client_messages cm
ORDER BY timestamp DESC;

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert sample client organization
INSERT INTO ff_client_organizations (
    id, tenant_id, company_name, legal_name, address, branding, settings
) VALUES (
    'client-demo-001',
    'tenant-demo-123',
    'ABC Shipping Corporation',
    'ABC Shipping Corp LLC',
    '{"street": "123 Business Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    '{"primaryColor": "#667eea", "secondaryColor": "#764ba2", "portalName": "ABC Shipping Portal"}',
    '{"allowedFileTypes": ["pdf", "jpg", "png", "doc", "docx"], "maxFileSize": 10, "autoNotifications": true}'
);

-- Insert sample client user
INSERT INTO ff_client_users (
    id, client_id, tenant_id, email, first_name, last_name, role, permissions
) VALUES (
    'user-demo-001',
    'client-demo-001',
    'tenant-demo-123',
    'john.smith@abcshipping.com',
    'John',
    'Smith',
    'MANAGER',
    '[{"resource": "shipments", "action": "read", "scope": "all"}, {"resource": "documents", "action": "write", "scope": "assigned"}]'
);
