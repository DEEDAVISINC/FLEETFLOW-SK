-- FleetFlow RFx Requests and Bids Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- RFX REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS rfx_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfx_number VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  rfx_type VARCHAR(50) CHECK (rfx_type IN ('RFP', 'RFQ', 'RFI', 'RFB', 'Sources Sought', 'Special Notice')),
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Draft', 'Active', 'Closed', 'Awarded', 'Cancelled')),
  issuing_organization VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  submission_deadline TIMESTAMP WITH TIME ZONE,
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  naics_codes VARCHAR[],
  set_aside_type VARCHAR(100),
  place_of_performance TEXT,
  requirements JSONB,
  documents JSONB,
  current_bids INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for rfx_requests
CREATE INDEX IF NOT EXISTS idx_rfx_requests_status ON rfx_requests(status);
CREATE INDEX IF NOT EXISTS idx_rfx_requests_type ON rfx_requests(rfx_type);
CREATE INDEX IF NOT EXISTS idx_rfx_requests_deadline ON rfx_requests(submission_deadline);
CREATE INDEX IF NOT EXISTS idx_rfx_requests_created ON rfx_requests(created_at DESC);

-- ============================================================================
-- BIDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfx_request_id UUID REFERENCES rfx_requests(id) ON DELETE CASCADE,
  user_id UUID,
  bid_number VARCHAR(100) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  bid_amount DECIMAL(15,2),
  proposal_summary TEXT,
  technical_approach TEXT,
  timeline VARCHAR(255),
  certifications VARCHAR[],
  past_performance TEXT,
  status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Awarded', 'Rejected', 'Withdrawn')),
  documents JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bids
CREATE INDEX IF NOT EXISTS idx_bids_rfx_request ON bids(rfx_request_id);
CREATE INDEX IF NOT EXISTS idx_bids_user ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_submitted ON bids(submitted_at DESC);

-- ============================================================================
-- SAM.GOV OPPORTUNITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sam_gov_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notice_id VARCHAR(100) UNIQUE NOT NULL,
  solicitation_number VARCHAR(100),
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50),
  base_type VARCHAR(50),
  archive_type VARCHAR(50),
  archive_date DATE,
  posted_date TIMESTAMP WITH TIME ZONE,
  response_deadline TIMESTAMP WITH TIME ZONE,
  naics_code VARCHAR(10),
  classification_code VARCHAR(50),
  active BOOLEAN DEFAULT true,
  award VARCHAR(255),
  point_of_contact JSONB,
  description TEXT,
  organization_type VARCHAR(100),
  office_address JSONB,
  primary_contact VARCHAR(255),
  links JSONB,
  uiLink VARCHAR(500),
  full_data JSONB,
  monitoring_status VARCHAR(50) DEFAULT 'active' CHECK (monitoring_status IN ('active', 'ignored', 'responded', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sam_gov_opportunities
CREATE INDEX IF NOT EXISTS idx_sam_gov_notice_id ON sam_gov_opportunities(notice_id);
CREATE INDEX IF NOT EXISTS idx_sam_gov_active ON sam_gov_opportunities(active);
CREATE INDEX IF NOT EXISTS idx_sam_gov_deadline ON sam_gov_opportunities(response_deadline);
CREATE INDEX IF NOT EXISTS idx_sam_gov_type ON sam_gov_opportunities(type);
CREATE INDEX IF NOT EXISTS idx_sam_gov_posted ON sam_gov_opportunities(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_sam_gov_monitoring ON sam_gov_opportunities(monitoring_status);

-- ============================================================================
-- PALLET SCANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS pallet_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id VARCHAR(100) UNIQUE NOT NULL,
  shipment_id VARCHAR(100),
  load_id UUID,
  pallet_count INTEGER NOT NULL,
  total_weight DECIMAL(10,2),
  dimensions JSONB,
  scan_location VARCHAR(255),
  scanned_by UUID,
  scan_type VARCHAR(50) CHECK (scan_type IN ('pickup', 'delivery', 'warehouse', 'inspection')),
  images JSONB,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'flagged', 'disputed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for pallet_scans
CREATE INDEX IF NOT EXISTS idx_pallet_scans_shipment ON pallet_scans(shipment_id);
CREATE INDEX IF NOT EXISTS idx_pallet_scans_load ON pallet_scans(load_id);
CREATE INDEX IF NOT EXISTS idx_pallet_scans_type ON pallet_scans(scan_type);
CREATE INDEX IF NOT EXISTS idx_pallet_scans_status ON pallet_scans(status);
CREATE INDEX IF NOT EXISTS idx_pallet_scans_created ON pallet_scans(created_at DESC);

-- ============================================================================
-- LOAD PALLETS TABLE (Junction table for loads and pallets)
-- ============================================================================
CREATE TABLE IF NOT EXISTS load_pallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  load_id UUID NOT NULL,
  pallet_scan_id UUID REFERENCES pallet_scans(id) ON DELETE CASCADE,
  pallet_number INTEGER NOT NULL,
  weight DECIMAL(10,2),
  length DECIMAL(8,2),
  width DECIMAL(8,2),
  height DECIMAL(8,2),
  stackable BOOLEAN DEFAULT true,
  hazmat BOOLEAN DEFAULT false,
  temperature_controlled BOOLEAN DEFAULT false,
  special_handling TEXT,
  status VARCHAR(50) DEFAULT 'loaded' CHECK (status IN ('loaded', 'in_transit', 'delivered', 'damaged', 'missing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for load_pallets
CREATE INDEX IF NOT EXISTS idx_load_pallets_load ON load_pallets(load_id);
CREATE INDEX IF NOT EXISTS idx_load_pallets_scan ON load_pallets(pallet_scan_id);
CREATE INDEX IF NOT EXISTS idx_load_pallets_status ON load_pallets(status);

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
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_rfx_requests_updated_at ON rfx_requests;
CREATE TRIGGER update_rfx_requests_updated_at
  BEFORE UPDATE ON rfx_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bids_updated_at ON bids;
CREATE TRIGGER update_bids_updated_at
  BEFORE UPDATE ON bids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sam_gov_opportunities_updated_at ON sam_gov_opportunities;
CREATE TRIGGER update_sam_gov_opportunities_updated_at
  BEFORE UPDATE ON sam_gov_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pallet_scans_updated_at ON pallet_scans;
CREATE TRIGGER update_pallet_scans_updated_at
  BEFORE UPDATE ON pallet_scans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_load_pallets_updated_at ON load_pallets;
CREATE TRIGGER update_load_pallets_updated_at
  BEFORE UPDATE ON load_pallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update bid count on rfx_requests
CREATE OR REPLACE FUNCTION update_rfx_bid_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE rfx_requests 
    SET current_bids = current_bids + 1 
    WHERE id = NEW.rfx_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE rfx_requests 
    SET current_bids = GREATEST(current_bids - 1, 0) 
    WHERE id = OLD.rfx_request_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain bid count
DROP TRIGGER IF EXISTS maintain_rfx_bid_count ON bids;
CREATE TRIGGER maintain_rfx_bid_count
  AFTER INSERT OR DELETE ON bids
  FOR EACH ROW
  EXECUTE FUNCTION update_rfx_bid_count();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active RFx opportunities view
CREATE OR REPLACE VIEW active_rfx_opportunities AS
SELECT 
  r.id,
  r.rfx_number,
  r.title,
  r.rfx_type,
  r.submission_deadline,
  r.current_bids,
  r.budget_min,
  r.budget_max,
  r.issuing_organization,
  r.created_at
FROM rfx_requests r
WHERE r.status = 'Active' 
  AND (r.submission_deadline IS NULL OR r.submission_deadline > NOW())
ORDER BY r.submission_deadline ASC;

-- My bids view (requires user_id parameter)
CREATE OR REPLACE VIEW my_bids_summary AS
SELECT 
  b.id,
  b.bid_number,
  b.company_name,
  b.bid_amount,
  b.status,
  b.submitted_at,
  r.rfx_number,
  r.title as rfx_title,
  r.rfx_type,
  r.submission_deadline
FROM bids b
JOIN rfx_requests r ON b.rfx_request_id = r.id
ORDER BY b.submitted_at DESC;

-- SAM.gov active opportunities view
CREATE OR REPLACE VIEW active_sam_gov_opportunities AS
SELECT 
  id,
  notice_id,
  solicitation_number,
  title,
  type,
  posted_date,
  response_deadline,
  naics_code,
  monitoring_status,
  uiLink
FROM sam_gov_opportunities
WHERE active = true 
  AND monitoring_status = 'active'
  AND (response_deadline IS NULL OR response_deadline > NOW())
ORDER BY response_deadline ASC;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE rfx_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE sam_gov_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pallet_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_pallets ENABLE ROW LEVEL SECURITY;

-- Policies for public access (adjust based on your security requirements)
CREATE POLICY "Anyone can view active RFx requests" ON rfx_requests
  FOR SELECT USING (status = 'Active');

CREATE POLICY "Users can view their own bids" ON bids
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create their own bids" ON bids
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify all tables were created successfully:
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('rfx_requests', 'bids', 'sam_gov_opportunities', 'pallet_scans', 'load_pallets')
ORDER BY table_name;




