-- FleetFlow AI Agent Platform - Multi-Tenant Database Schema
-- PostgreSQL Schema for AI Agent Intelligence Platform
-- Supports complete data isolation between tenants

-- ============================================
-- TENANT MANAGEMENT TABLES
-- ============================================

-- AI Agent Configurations (One per contractor/tenant)
CREATE TABLE ai_agent_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    contractor_id VARCHAR(50) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    agent_type VARCHAR(50) NOT NULL DEFAULT 'communication', -- communication, lead_intelligence, sales

    -- Agent Personality & Voice
    personality_type VARCHAR(50) DEFAULT 'professional', -- professional, friendly, aggressive, consultative
    voice_tone VARCHAR(50) DEFAULT 'neutral', -- neutral, enthusiastic, authoritative, empathetic
    communication_style TEXT,

    -- Multi-Channel Configuration
    email_enabled BOOLEAN DEFAULT false,
    social_media_enabled BOOLEAN DEFAULT false,
    sms_enabled BOOLEAN DEFAULT false,
    voice_calling_enabled BOOLEAN DEFAULT false,

    -- API Configurations (Encrypted)
    gmail_config JSONB, -- Gmail API credentials and settings
    twilio_config JSONB, -- Twilio API credentials and settings
    social_apis_config JSONB, -- Facebook, LinkedIn, Twitter API configs

    -- Automation Rules
    auto_response_enabled BOOLEAN DEFAULT false,
    auto_follow_up_enabled BOOLEAN DEFAULT false,
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '17:00:00',
    working_days VARCHAR(20) DEFAULT 'monday,tuesday,wednesday,thursday,friday',
    timezone VARCHAR(50) DEFAULT 'America/New_York',

    -- Status and Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(50) NOT NULL,

    -- Constraints
    UNIQUE(tenant_id, contractor_id),
    INDEX idx_ai_agent_tenant (tenant_id),
    INDEX idx_ai_agent_contractor (contractor_id),
    INDEX idx_ai_agent_active (is_active, tenant_id)
);

-- AI Agent Templates (Multi-tenant with complete isolation)
CREATE TABLE ai_agent_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    template_id VARCHAR(100) NOT NULL, -- Human-readable ID like "cold_email_v1"

    -- Template Metadata
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- email, social_post, sms, voice_script, follow_up
    subcategory VARCHAR(50), -- cold_outreach, warm_follow_up, appointment_setting, etc.

    -- Template Content
    subject_line VARCHAR(500), -- For email templates
    content TEXT NOT NULL,
    variables JSONB, -- Array of template variables with metadata

    -- Usage and Performance
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_response_time INTEGER, -- Average response time in hours

    -- Template Configuration
    is_active BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false, -- System templates vs custom templates
    version INTEGER DEFAULT 1,
    tags TEXT[], -- Array of tags for organization

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(50) NOT NULL,

    -- Constraints
    UNIQUE(tenant_id, template_id),
    INDEX idx_template_tenant (tenant_id),
    INDEX idx_template_category (category, tenant_id),
    INDEX idx_template_active (is_active, tenant_id),
    INDEX idx_template_tags USING GIN (tags)
);

-- ============================================
-- LEAD INTELLIGENCE AND PROCESSING
-- ============================================

-- Lead Intelligence Data (Cross-tenant insights with proper isolation)
CREATE TABLE lead_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    agent_id UUID REFERENCES ai_agent_configs(id) ON DELETE CASCADE,

    -- Lead Identification
    lead_source VARCHAR(100) NOT NULL, -- jotform, website, referral, cold_outreach
    lead_type VARCHAR(50) NOT NULL, -- shipper, carrier, broker, 3pl
    external_id VARCHAR(100), -- JotForm submission ID, etc.

    -- Company Information
    company_name VARCHAR(200),
    contact_name VARCHAR(100),
    contact_email VARCHAR(200),
    contact_phone VARCHAR(50),
    website VARCHAR(300),

    -- Business Details
    business_type VARCHAR(100),
    annual_revenue BIGINT,
    employee_count INTEGER,
    equipment_types TEXT[],
    service_areas TEXT[],

    -- FMCSA Data Integration
    mc_number VARCHAR(20),
    dot_number VARCHAR(20),
    safety_rating VARCHAR(50),
    insurance_status VARCHAR(50),
    fmcsa_data JSONB, -- Full FMCSA API response

    -- Lead Scoring and Qualification
    lead_score INTEGER DEFAULT 0, -- 0-100 scoring system
    qualification_status VARCHAR(50) DEFAULT 'new', -- new, qualified, unqualified, contacted, converted
    priority_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent

    -- AI Analysis
    ai_analysis JSONB, -- AI-generated insights about the lead
    conversation_history JSONB, -- Summary of all interactions
    next_action TEXT, -- AI-recommended next action

    -- Status Tracking
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, converted, lost
    assigned_to VARCHAR(50), -- Contractor/agent assigned to this lead
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    INDEX idx_lead_tenant (tenant_id),
    INDEX idx_lead_agent (agent_id),
    INDEX idx_lead_score (lead_score DESC, tenant_id),
    INDEX idx_lead_status (qualification_status, tenant_id),
    INDEX idx_lead_source (lead_source, tenant_id),
    INDEX idx_lead_company (company_name, tenant_id)
);

-- ============================================
-- COMMUNICATION AND CONVERSATION TRACKING
-- ============================================

-- Conversation Logs (Complete interaction history)
CREATE TABLE conversation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    agent_id UUID REFERENCES ai_agent_configs(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES lead_intelligence(id) ON DELETE CASCADE,

    -- Communication Details
    channel VARCHAR(50) NOT NULL, -- email, sms, social_media, voice, website_chat
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    template_id UUID REFERENCES ai_agent_templates(id),

    -- Message Content
    subject VARCHAR(500), -- For email/social media
    message_content TEXT,
    ai_generated BOOLEAN DEFAULT false,

    -- Recipient/Sender Information
    from_address VARCHAR(300),
    to_address VARCHAR(300),
    cc_addresses TEXT[],
    bcc_addresses TEXT[],

    -- Voice Call Specific
    call_duration INTEGER, -- Duration in seconds
    call_recording_url VARCHAR(500),
    call_outcome VARCHAR(100), -- answered, voicemail, busy, no_answer

    -- Response Tracking
    opened BOOLEAN DEFAULT false,
    clicked BOOLEAN DEFAULT false,
    replied BOOLEAN DEFAULT false,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,

    -- AI Analysis
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    engagement_score INTEGER, -- 0-100
    ai_confidence DECIMAL(3,2), -- 0.00 to 1.00

    -- External System Integration
    external_message_id VARCHAR(200), -- Gmail message ID, Twilio SID, etc.
    webhook_data JSONB, -- Raw webhook/API response data

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    INDEX idx_conversation_tenant (tenant_id),
    INDEX idx_conversation_agent (agent_id),
    INDEX idx_conversation_lead (lead_id),
    INDEX idx_conversation_channel (channel, tenant_id),
    INDEX idx_conversation_date (created_at DESC, tenant_id),
    INDEX idx_conversation_sentiment (sentiment_score, tenant_id)
);

-- ============================================
-- ANALYTICS AND PERFORMANCE TRACKING
-- ============================================

-- AI Agent Metrics (Real-time performance tracking)
CREATE TABLE ai_agent_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    agent_id UUID REFERENCES ai_agent_configs(id) ON DELETE CASCADE,

    -- Time Period
    date_recorded DATE NOT NULL,
    hour_recorded INTEGER, -- 0-23 for hourly metrics

    -- Communication Metrics
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_replied INTEGER DEFAULT 0,

    sms_sent INTEGER DEFAULT 0,
    sms_replied INTEGER DEFAULT 0,

    calls_made INTEGER DEFAULT 0,
    calls_answered INTEGER DEFAULT 0,
    calls_duration_total INTEGER DEFAULT 0, -- Total seconds

    social_posts INTEGER DEFAULT 0,
    social_engagements INTEGER DEFAULT 0,

    -- Lead Metrics
    leads_generated INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,

    -- Performance Metrics
    response_rate DECIMAL(5,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_response_time INTEGER, -- Average response time in hours

    -- Revenue Tracking
    revenue_attributed DECIMAL(12,2) DEFAULT 0.00,
    cost_per_lead DECIMAL(8,2) DEFAULT 0.00,
    roi_percentage DECIMAL(5,2) DEFAULT 0.00,

    -- AI Performance
    ai_accuracy_score DECIMAL(3,2) DEFAULT 0.00,
    template_effectiveness DECIMAL(3,2) DEFAULT 0.00,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, agent_id, date_recorded, hour_recorded),
    INDEX idx_metrics_tenant (tenant_id),
    INDEX idx_metrics_agent (agent_id),
    INDEX idx_metrics_date (date_recorded DESC, tenant_id),
    INDEX idx_metrics_performance (response_rate DESC, tenant_id)
);

-- ============================================
-- SUBSCRIPTION AND BILLING
-- ============================================

-- AI Agent Subscriptions
CREATE TABLE ai_agent_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL UNIQUE,

    -- Subscription Details
    pricing_tier VARCHAR(50) NOT NULL, -- starter, professional, enterprise, white_label
    monthly_price DECIMAL(8,2) NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly

    -- Usage Limits
    email_limit INTEGER,
    sms_limit INTEGER,
    call_limit INTEGER,
    social_post_limit INTEGER,
    template_limit INTEGER,

    -- Subscription Status
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, cancelled, suspended, trial
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,

    -- Billing Information
    last_invoice_date TIMESTAMP WITH TIME ZONE,
    next_invoice_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id VARCHAR(100),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    INDEX idx_subscription_tenant (tenant_id),
    INDEX idx_subscription_status (status),
    INDEX idx_subscription_next_billing (next_invoice_date)
);

-- Usage Tracking (For billing and limit enforcement)
CREATE TABLE ai_agent_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    agent_id UUID REFERENCES ai_agent_configs(id) ON DELETE CASCADE,

    -- Usage Period
    usage_month INTEGER NOT NULL, -- 1-12
    usage_year INTEGER NOT NULL,

    -- Usage Counts
    emails_sent INTEGER DEFAULT 0,
    sms_sent INTEGER DEFAULT 0,
    calls_made INTEGER DEFAULT 0,
    social_posts INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    template_uses INTEGER DEFAULT 0,

    -- Overage Tracking
    email_overage INTEGER DEFAULT 0,
    sms_overage INTEGER DEFAULT 0,
    call_overage INTEGER DEFAULT 0,
    social_overage INTEGER DEFAULT 0,
    total_overage_cost DECIMAL(8,2) DEFAULT 0.00,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, agent_id, usage_month, usage_year),
    INDEX idx_usage_tenant (tenant_id),
    INDEX idx_usage_period (usage_year, usage_month, tenant_id)
);

-- ============================================
-- WEBHOOK AND INTEGRATION MANAGEMENT
-- ============================================

-- JotForm Integration Tracking
CREATE TABLE jotform_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    agent_id UUID REFERENCES ai_agent_configs(id) ON DELETE CASCADE,

    -- JotForm Configuration
    form_id VARCHAR(100) NOT NULL,
    webhook_url VARCHAR(500) NOT NULL,
    api_key_hash VARCHAR(200), -- Encrypted API key

    -- Processing Configuration
    auto_process BOOLEAN DEFAULT true,
    lead_type VARCHAR(50) DEFAULT 'prospect',
    priority_level VARCHAR(20) DEFAULT 'medium',

    -- Field Mapping (JotForm fields to lead_intelligence columns)
    field_mapping JSONB NOT NULL,

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_submission_at TIMESTAMP WITH TIME ZONE,
    total_submissions INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, form_id),
    INDEX idx_jotform_tenant (tenant_id),
    INDEX idx_jotform_active (is_active, tenant_id)
);

-- Webhook Event Logs
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,

    -- Event Details
    source VARCHAR(100) NOT NULL, -- jotform, twilio, gmail, facebook, etc.
    event_type VARCHAR(100) NOT NULL,
    webhook_data JSONB NOT NULL,

    -- Processing Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, processed, failed, skipped
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Associated Records
    lead_id UUID REFERENCES lead_intelligence(id),
    conversation_id UUID REFERENCES conversation_logs(id),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    INDEX idx_webhook_tenant (tenant_id),
    INDEX idx_webhook_status (status, created_at),
    INDEX idx_webhook_source (source, tenant_id),
    INDEX idx_webhook_retry (retry_count, status)
);

-- ============================================
-- SYSTEM CONFIGURATION AND SECURITY
-- ============================================

-- API Rate Limiting
CREATE TABLE api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL,
    api_endpoint VARCHAR(200) NOT NULL,

    -- Rate Limit Configuration
    requests_per_minute INTEGER DEFAULT 60,
    requests_per_hour INTEGER DEFAULT 1000,
    requests_per_day INTEGER DEFAULT 10000,

    -- Current Usage
    current_minute_count INTEGER DEFAULT 0,
    current_hour_count INTEGER DEFAULT 0,
    current_day_count INTEGER DEFAULT 0,

    -- Reset Timestamps
    minute_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    hour_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    day_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(tenant_id, api_endpoint),
    INDEX idx_rate_limit_tenant (tenant_id),
    INDEX idx_rate_limit_endpoint (api_endpoint)
);

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_ai_agent_configs_updated_at BEFORE UPDATE ON ai_agent_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agent_templates_updated_at BEFORE UPDATE ON ai_agent_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_intelligence_updated_at BEFORE UPDATE ON lead_intelligence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversation_logs_updated_at BEFORE UPDATE ON conversation_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON ai_agent_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usage_updated_at BEFORE UPDATE ON ai_agent_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jotform_updated_at BEFORE UPDATE ON jotform_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_limits_updated_at BEFORE UPDATE ON api_rate_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Agent Performance Summary View
CREATE VIEW agent_performance_summary AS
SELECT
    ac.tenant_id,
    ac.id as agent_id,
    ac.agent_name,
    ac.contractor_id,

    -- Current Month Metrics
    COALESCE(am.emails_sent, 0) as emails_sent_this_month,
    COALESCE(am.calls_made, 0) as calls_made_this_month,
    COALESCE(am.leads_generated, 0) as leads_generated_this_month,
    COALESCE(am.response_rate, 0) as response_rate,
    COALESCE(am.conversion_rate, 0) as conversion_rate,
    COALESCE(am.revenue_attributed, 0) as revenue_this_month,

    -- Subscription Info
    s.pricing_tier,
    s.status as subscription_status,

    -- Usage vs Limits
    COALESCE(u.emails_sent, 0) as emails_used_this_month,
    s.email_limit,
    CASE
        WHEN s.email_limit IS NULL THEN 'unlimited'
        WHEN COALESCE(u.emails_sent, 0) >= s.email_limit THEN 'over_limit'
        WHEN COALESCE(u.emails_sent, 0) >= (s.email_limit * 0.8) THEN 'near_limit'
        ELSE 'under_limit'
    END as email_usage_status,

    ac.is_active,
    ac.created_at
FROM ai_agent_configs ac
LEFT JOIN ai_agent_subscriptions s ON ac.tenant_id = s.tenant_id
LEFT JOIN ai_agent_metrics am ON ac.id = am.agent_id
    AND am.date_recorded = CURRENT_DATE
LEFT JOIN ai_agent_usage u ON ac.id = u.agent_id
    AND u.usage_month = EXTRACT(MONTH FROM CURRENT_DATE)
    AND u.usage_year = EXTRACT(YEAR FROM CURRENT_DATE);

-- Lead Intelligence Summary View
CREATE VIEW lead_intelligence_summary AS
SELECT
    tenant_id,
    agent_id,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN qualification_status = 'qualified' THEN 1 END) as qualified_leads,
    COUNT(CASE WHEN qualification_status = 'converted' THEN 1 END) as converted_leads,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as leads_last_30_days,
    AVG(lead_score) as avg_lead_score,
    COUNT(CASE WHEN priority_level = 'high' THEN 1 END) as high_priority_leads,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_leads
FROM lead_intelligence
GROUP BY tenant_id, agent_id;

-- Template Performance View
CREATE VIEW template_performance AS
SELECT
    t.tenant_id,
    t.id as template_id,
    t.name as template_name,
    t.category,
    t.usage_count,
    t.success_rate,
    COUNT(cl.id) as total_uses,
    COUNT(CASE WHEN cl.replied THEN 1 END) as replies,
    COUNT(CASE WHEN cl.opened THEN 1 END) as opens,
    COUNT(CASE WHEN cl.clicked THEN 1 END) as clicks,
    CASE
        WHEN COUNT(cl.id) > 0 THEN
            ROUND((COUNT(CASE WHEN cl.replied THEN 1 END)::decimal / COUNT(cl.id) * 100), 2)
        ELSE 0
    END as actual_response_rate,
    AVG(cl.sentiment_score) as avg_sentiment
FROM ai_agent_templates t
LEFT JOIN conversation_logs cl ON t.id = cl.template_id
WHERE t.is_active = true
GROUP BY t.tenant_id, t.id, t.name, t.category, t.usage_count, t.success_rate;

-- ============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================

-- Insert sample pricing tiers for reference
INSERT INTO ai_agent_subscriptions (tenant_id, pricing_tier, monthly_price, email_limit, sms_limit, call_limit, social_post_limit, template_limit, status, current_period_start, current_period_end, next_invoice_date) VALUES
('sample_tenant_1', 'starter', 297.00, 1000, 200, 50, 100, 10, 'trial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP + INTERVAL '30 days'),
('sample_tenant_2', 'professional', 897.00, 5000, 1000, 200, 500, 50, 'active', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '15 days'),
('sample_tenant_3', 'enterprise', 2197.00, NULL, NULL, NULL, NULL, 200, 'active', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '20 days', CURRENT_TIMESTAMP + INTERVAL '20 days');

-- ============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================

-- Additional composite indexes for common query patterns
CREATE INDEX idx_conversation_tenant_date ON conversation_logs(tenant_id, created_at DESC);
CREATE INDEX idx_lead_tenant_score ON lead_intelligence(tenant_id, lead_score DESC, qualification_status);
CREATE INDEX idx_metrics_tenant_date ON ai_agent_metrics(tenant_id, date_recorded DESC);
CREATE INDEX idx_agent_tenant_active ON ai_agent_configs(tenant_id, is_active, created_at DESC);
CREATE INDEX idx_template_tenant_category_active ON ai_agent_templates(tenant_id, category, is_active);

-- GIN indexes for JSONB columns
CREATE INDEX idx_agent_config_gmail_config ON ai_agent_configs USING GIN (gmail_config);
CREATE INDEX idx_agent_config_social_apis ON ai_agent_configs USING GIN (social_apis_config);
CREATE INDEX idx_lead_fmcsa_data ON lead_intelligence USING GIN (fmcsa_data);
CREATE INDEX idx_lead_ai_analysis ON lead_intelligence USING GIN (ai_analysis);
CREATE INDEX idx_conversation_webhook_data ON conversation_logs USING GIN (webhook_data);
CREATE INDEX idx_webhook_data ON webhook_events USING GIN (webhook_data);

-- ============================================
-- SECURITY AND COMPLIANCE
-- ============================================

-- Row Level Security (RLS) for tenant isolation
ALTER TABLE ai_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE jotform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (to be customized based on application authentication)
-- Example policy for tenant isolation:
-- CREATE POLICY tenant_isolation_policy ON ai_agent_configs
--     FOR ALL TO authenticated_users
--     USING (tenant_id = current_setting('app.current_tenant_id'));

-- Comment out RLS policies for development - uncomment for production
-- These would need to be implemented with your authentication system

COMMENT ON SCHEMA public IS 'FleetFlow AI Agent Platform - Multi-Tenant Database Schema with complete tenant isolation, analytics, and billing support';
