-- ============================================================================
-- Government Contract Opportunities Table - FleetFlow Platform
-- Multi-tenant support for DEE DAVIS INC/DEPOINTE and other tenants
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gov_contract_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tenant Information
  tenant_id VARCHAR(100) NOT NULL DEFAULT 'depointe',

  -- Opportunity Identification
  notice_id VARCHAR(255),
  solicitation_number VARCHAR(255),

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT,
  agency VARCHAR(255),
  office VARCHAR(255),
  department VARCHAR(255),

  -- Contract Details
  contract_value DECIMAL(15, 2) DEFAULT 0,
  base_value DECIMAL(15, 2),
  options_value DECIMAL(15, 2),

  -- Classification
  naics_code VARCHAR(10),
  naics_codes TEXT[],
  psc_code VARCHAR(10),

  -- Set-Aside and Type
  set_aside_type VARCHAR(100),
  opportunity_type VARCHAR(50),

  -- Dates
  posted_date TIMESTAMP,
  response_deadline TIMESTAMP,
  archive_date TIMESTAMP,

  -- Location
  place_of_performance_state VARCHAR(2),
  place_of_performance_city VARCHAR(100),
  place_of_performance_zip VARCHAR(10),
  office_state VARCHAR(2),
  office_city VARCHAR(100),

  -- Contact Information
  co_name VARCHAR(255),
  co_email VARCHAR(255),
  co_phone VARCHAR(50),
  point_of_contact JSONB,

  -- Scoring and Analysis
  priority_score INTEGER DEFAULT 50,
  win_probability DECIMAL(5, 2) DEFAULT 0,

  -- Status Tracking
  status VARCHAR(50) DEFAULT 'new',

  -- AI Analysis
  ai_analysis JSONB,

  -- Source Tracking
  source VARCHAR(50) DEFAULT 'SAM.gov',
  source_url TEXT,

  -- Activity Tracking
  last_viewed_at TIMESTAMP,
  contacted_at TIMESTAMP,
  bid_submitted_at TIMESTAMP,
  awarded_at TIMESTAMP,

  -- Metadata
  tags TEXT[],
  notes TEXT,
  attachments JSONB,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_notice_per_tenant UNIQUE (tenant_id, notice_id)
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_gov_opps_tenant_id
  ON public.gov_contract_opportunities(tenant_id);

CREATE INDEX IF NOT EXISTS idx_gov_opps_status
  ON public.gov_contract_opportunities(status);

CREATE INDEX IF NOT EXISTS idx_gov_opps_deadline
  ON public.gov_contract_opportunities(response_deadline);

CREATE INDEX IF NOT EXISTS idx_gov_opps_priority
  ON public.gov_contract_opportunities(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_gov_opps_set_aside
  ON public.gov_contract_opportunities(set_aside_type);

CREATE INDEX IF NOT EXISTS idx_gov_opps_created
  ON public.gov_contract_opportunities(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gov_opps_notice_id
  ON public.gov_contract_opportunities(notice_id);

-- ============================================================================
-- Trigger for Updated At
-- ============================================================================

CREATE OR REPLACE FUNCTION update_gov_opps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_gov_opps_updated_at
  BEFORE UPDATE ON public.gov_contract_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_gov_opps_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE public.gov_contract_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gov_contracts_allow_all_authenticated"
  ON public.gov_contract_opportunities
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- View for High-Priority Opportunities
-- ============================================================================

CREATE OR REPLACE VIEW public.high_priority_gov_opportunities AS
SELECT
  id,
  tenant_id,
  notice_id,
  title,
  agency,
  contract_value,
  set_aside_type,
  response_deadline,
  priority_score,
  win_probability,
  status,
  created_at
FROM public.gov_contract_opportunities
WHERE
  priority_score >= 70
  AND status NOT IN ('lost', 'archived')
  AND (response_deadline IS NULL OR response_deadline > NOW())
ORDER BY priority_score DESC, response_deadline ASC;

-- ============================================================================
-- Table Comment
-- ============================================================================

COMMENT ON TABLE public.gov_contract_opportunities IS
  'Government contract opportunities from SAM.gov and other sources. Multi-tenant support for FleetFlow platform.';
