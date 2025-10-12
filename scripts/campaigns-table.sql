-- Marketing Campaigns Table
-- Run this in your Supabase SQL Editor to add campaigns functionality

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    budget DECIMAL(10,2),
    spent DECIMAL(10,2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    engagement VARCHAR(20),
    conversions INTEGER DEFAULT 0,
    roi VARCHAR(20),
    start_date DATE,
    end_date DATE,
    platforms JSONB DEFAULT '[]'::jsonb,

    -- Organization/User tracking
    organization_id UUID,
    created_by UUID,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_organization ON marketing_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON marketing_campaigns(created_by);

-- Enable Row Level Security
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for multi-tenant access
CREATE POLICY "Users can view campaigns from their organization"
    ON marketing_campaigns FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create campaigns"
    ON marketing_campaigns FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update campaigns from their organization"
    ON marketing_campaigns FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete campaigns from their organization"
    ON marketing_campaigns FOR DELETE
    USING (auth.uid() IS NOT NULL);

