-- ============================================================================
-- RFX Bid Response Tracking System
-- Automatic tracking of all RFP, RFQ, RFI, and Sources Sought responses
-- ============================================================================

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABLE: rfx_bid_responses - Auto-saved RFP/RFQ bid response drafts
-- ============================================================================
CREATE TABLE IF NOT EXISTS rfx_bid_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Solicitation Information
    solicitation_id VARCHAR(100),              -- e.g., "Pre-701-26-001"
    solicitation_type VARCHAR(20) NOT NULL,    -- RFP, RFQ, RFI, SS, Sources_Sought
    document_name VARCHAR(255) NOT NULL,       -- Original filename

    -- Contact Information (from parsed document)
    contact_name VARCHAR(100),                 -- e.g., "Kem David"
    contact_email VARCHAR(255),                -- e.g., "Kem.David@tea.texas.gov"
    contact_phone VARCHAR(50),
    organization_name VARCHAR(255),            -- e.g., "Texas Education Agency"

    -- Key Dates
    submission_deadline TIMESTAMP WITH TIME ZONE,
    document_upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Generated Response Content
    response_subject VARCHAR(500),
    response_html TEXT NOT NULL,               -- Full HTML response
    response_text TEXT NOT NULL,               -- Plain text version
    signature_type VARCHAR(50) DEFAULT 'dee_davis', -- 'dee_davis' or 'fleetflow'

    -- Parsed Requirements (for reference)
    extracted_requirements JSONB,              -- Array of requirements from document
    submission_instructions JSONB,             -- Email, portal, deadline, etc.

    -- Status Tracking
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'won', 'lost', 'expired', 'cancelled')),
    draft_version INTEGER DEFAULT 1,           -- Track versions if edited

    -- Email Tracking (if sent)
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_message_id VARCHAR(255),             -- SendGrid message ID
    email_delivered_at TIMESTAMP WITH TIME ZONE,
    email_opened_at TIMESTAMP WITH TIME ZONE,

    -- Business Outcome
    bid_amount DECIMAL(15,2),                  -- If pricing was included
    outcome VARCHAR(50),                       -- won, lost, no_response, cancelled
    outcome_notes TEXT,
    contract_value DECIMAL(15,2),              -- If won

    -- User Attribution
    created_by VARCHAR(100) DEFAULT 'info@deedavis.biz',
    tenant_id UUID,                            -- For multi-tenant support

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Attachments
    attachments JSONB                          -- Array of attached files
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rfx_status ON rfx_bid_responses(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rfx_solicitation ON rfx_bid_responses(solicitation_id);
CREATE INDEX IF NOT EXISTS idx_rfx_deadline ON rfx_bid_responses(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_rfx_email ON rfx_bid_responses(contact_email);
CREATE INDEX IF NOT EXISTS idx_rfx_created ON rfx_bid_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rfx_tenant ON rfx_bid_responses(tenant_id);

-- Auto-update timestamp trigger
DROP TRIGGER IF EXISTS update_rfx_bid_responses_updated_at ON rfx_bid_responses;
CREATE TRIGGER update_rfx_bid_responses_updated_at
    BEFORE UPDATE ON rfx_bid_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: rfx_email_events - Track email delivery events from SendGrid
-- ============================================================================
CREATE TABLE IF NOT EXISTS rfx_email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_response_id UUID NOT NULL REFERENCES rfx_bid_responses(id) ON DELETE CASCADE,

    -- Event details
    event_type VARCHAR(50) NOT NULL,           -- sent, delivered, opened, clicked, bounced, etc.
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- SendGrid data
    message_id VARCHAR(255),

    -- Additional event data
    event_data JSONB,                          -- Full event payload from SendGrid

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfx_email_events_bid ON rfx_email_events(bid_response_id, event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rfx_email_events_type ON rfx_email_events(event_type, event_timestamp DESC);

-- ============================================================================
-- Views for easy querying
-- ============================================================================

-- Active drafts view
CREATE OR REPLACE VIEW rfx_active_drafts AS
SELECT
    id,
    solicitation_id,
    solicitation_type,
    document_name,
    organization_name,
    contact_name,
    contact_email,
    submission_deadline,
    created_at,
    EXTRACT(DAY FROM (submission_deadline - NOW())) as days_until_deadline
FROM rfx_bid_responses
WHERE status = 'draft'
  AND (submission_deadline IS NULL OR submission_deadline > NOW())
ORDER BY submission_deadline ASC NULLS LAST, created_at DESC;

-- Sent bids awaiting response
CREATE OR REPLACE VIEW rfx_pending_responses AS
SELECT
    id,
    solicitation_id,
    solicitation_type,
    document_name,
    organization_name,
    email_sent_at,
    submission_deadline,
    EXTRACT(DAY FROM (NOW() - email_sent_at)) as days_since_sent
FROM rfx_bid_responses
WHERE status = 'sent'
  AND outcome IS NULL
ORDER BY email_sent_at DESC;

-- Win/Loss summary
CREATE OR REPLACE VIEW rfx_outcome_summary AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_bids,
    COUNT(*) FILTER (WHERE status = 'sent') as sent_bids,
    COUNT(*) FILTER (WHERE outcome = 'won') as won_bids,
    COUNT(*) FILTER (WHERE outcome = 'lost') as lost_bids,
    ROUND(COUNT(*) FILTER (WHERE outcome = 'won')::numeric /
          NULLIF(COUNT(*) FILTER (WHERE outcome IS NOT NULL), 0) * 100, 2) as win_rate_percent,
    SUM(contract_value) FILTER (WHERE outcome = 'won') as total_won_value
FROM rfx_bid_responses
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON rfx_bid_responses TO your_app_user;
-- GRANT ALL PRIVILEGES ON rfx_email_events TO your_app_user;
-- GRANT SELECT ON rfx_active_drafts TO your_app_user;
-- GRANT SELECT ON rfx_pending_responses TO your_app_user;
-- GRANT SELECT ON rfx_outcome_summary TO your_app_user;

-- Insert sample notification preferences (optional)
-- This could be extended to notify about upcoming deadlines, etc.

COMMENT ON TABLE rfx_bid_responses IS 'Automated tracking of all RFP/RFQ bid responses generated by FleetFlow';
COMMENT ON TABLE rfx_email_events IS 'Email delivery tracking events from SendGrid webhook';
COMMENT ON VIEW rfx_active_drafts IS 'All draft responses that have not been sent yet';
COMMENT ON VIEW rfx_pending_responses IS 'Sent bids awaiting outcome decision';
COMMENT ON VIEW rfx_outcome_summary IS 'Monthly win/loss summary for business intelligence';
