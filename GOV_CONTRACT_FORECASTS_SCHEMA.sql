-- ============================================================================
-- GOVERNMENT CONTRACT FORECASTING SYSTEM - DATABASE SCHEMA
-- ============================================================================
--
-- This table stores FORECASTED opportunities (3-24 months in future)
-- NOT current opportunities - this is TRUE predictive forecasting
--
-- Data Sources:
-- 1. Federal Agency Long Range Acquisition Forecasts (LRAFs)
-- 2. Contract expiration analysis from USASpending.gov
-- 3. Sources Sought / RFI early indicators
-- 4. AI-predicted opportunities based on historical patterns
-- ============================================================================

-- Drop existing table if recreating
-- DROP TABLE IF EXISTS public.gov_contract_forecasts CASCADE;

CREATE TABLE IF NOT EXISTS public.gov_contract_forecasts (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Unique identifier for the forecasted opportunity
  opportunity_id VARCHAR(255) UNIQUE NOT NULL,

  -- Source Information
  source VARCHAR(100) NOT NULL, -- 'lraf', 'contract_expiration', 'sources_sought', 'ai_predicted'
  agency VARCHAR(255) NOT NULL,
  agency_code VARCHAR(50),

  -- Opportunity Details
  title TEXT NOT NULL,
  description TEXT,
  naics_code VARCHAR(20),
  estimated_value NUMERIC(15, 2),

  -- Forecasting Data (KEY DIFFERENCE FROM CURRENT OPPORTUNITIES)
  fiscal_year VARCHAR(10) NOT NULL, -- FY 2025, FY 2026, etc.
  fiscal_quarter VARCHAR(10), -- Q1, Q2, Q3, Q4
  predicted_post_date DATE, -- When we predict RFP will be posted
  predicted_award_date DATE, -- When we predict contract will be awarded

  -- Forecast Quality Metrics
  forecast_confidence VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
  recompete_probability NUMERIC(5, 2), -- For contract expirations: % chance of re-compete

  -- Contract Expiration Specific Fields
  current_contractor VARCHAR(255), -- Who currently holds the contract (if re-compete)
  contract_end_date DATE, -- When current contract expires

  -- Small Business / WOSB Information
  wosb_eligible BOOLEAN DEFAULT false,
  set_aside_type VARCHAR(100), -- 'WOSB', 'EDWOSB', '8(a)', 'HUBZone', etc.

  -- Contact Intelligence
  contact_name VARCHAR(255),
  contact_title VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_office VARCHAR(255),

  -- Acquisition Details
  acquisition_type VARCHAR(100), -- 'New', 'Re-compete', 'IDIQ', etc.
  place_of_performance TEXT,
  url TEXT, -- Link to LRAF page or contract details

  -- Multi-Tenant Support
  tenant_id VARCHAR(100) NOT NULL DEFAULT 'depointe',

  -- Metadata
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_forecasts_opportunity_id ON public.gov_contract_forecasts(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_tenant_id ON public.gov_contract_forecasts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_agency ON public.gov_contract_forecasts(agency);
CREATE INDEX IF NOT EXISTS idx_forecasts_source ON public.gov_contract_forecasts(source);
CREATE INDEX IF NOT EXISTS idx_forecasts_fiscal_year ON public.gov_contract_forecasts(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_forecasts_predicted_post_date ON public.gov_contract_forecasts(predicted_post_date);
CREATE INDEX IF NOT EXISTS idx_forecasts_wosb_eligible ON public.gov_contract_forecasts(wosb_eligible);
CREATE INDEX IF NOT EXISTS idx_forecasts_forecast_confidence ON public.gov_contract_forecasts(forecast_confidence);
CREATE INDEX IF NOT EXISTS idx_forecasts_naics_code ON public.gov_contract_forecasts(naics_code);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_forecasts_tenant_wosb_date
  ON public.gov_contract_forecasts(tenant_id, wosb_eligible, predicted_post_date);

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_gov_forecasts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gov_forecasts_updated_at ON public.gov_contract_forecasts;

CREATE TRIGGER trg_gov_forecasts_updated_at
  BEFORE UPDATE ON public.gov_contract_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION update_gov_forecasts_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.gov_contract_forecasts ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if recreating
DROP POLICY IF EXISTS gov_forecasts_allow_all_authenticated ON public.gov_contract_forecasts;

-- Allow authenticated users to read/write their tenant's data
CREATE POLICY gov_forecasts_allow_all_authenticated
  ON public.gov_contract_forecasts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: High-Priority WOSB Forecasts
CREATE OR REPLACE VIEW vw_high_priority_wosb_forecasts AS
SELECT
  opportunity_id,
  agency,
  title,
  estimated_value,
  fiscal_year,
  fiscal_quarter,
  predicted_post_date,
  forecast_confidence,
  source,
  contact_name,
  contact_email,
  url
FROM public.gov_contract_forecasts
WHERE wosb_eligible = true
  AND forecast_confidence IN ('high', 'medium')
  AND predicted_post_date >= CURRENT_DATE
ORDER BY predicted_post_date ASC, estimated_value DESC;

-- View: Upcoming Re-compete Opportunities
CREATE OR REPLACE VIEW vw_recompete_opportunities AS
SELECT
  opportunity_id,
  agency,
  title,
  estimated_value,
  current_contractor,
  contract_end_date,
  predicted_post_date,
  recompete_probability,
  wosb_eligible,
  contact_name,
  contact_email
FROM public.gov_contract_forecasts
WHERE source = 'contract_expiration'
  AND contract_end_date >= CURRENT_DATE
  AND recompete_probability > 50
ORDER BY contract_end_date ASC;

-- View: Forecast Summary by Agency
CREATE OR REPLACE VIEW vw_forecast_summary_by_agency AS
SELECT
  agency,
  COUNT(*) as total_forecasts,
  SUM(CASE WHEN wosb_eligible THEN 1 ELSE 0 END) as wosb_forecasts,
  SUM(estimated_value) as total_value,
  MIN(predicted_post_date) as earliest_forecast,
  MAX(predicted_post_date) as latest_forecast
FROM public.gov_contract_forecasts
WHERE predicted_post_date >= CURRENT_DATE
GROUP BY agency
ORDER BY total_value DESC;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant access to authenticated users
GRANT ALL ON public.gov_contract_forecasts TO authenticated;
GRANT ALL ON public.gov_contract_forecasts TO service_role;

-- Grant access to views
GRANT SELECT ON vw_high_priority_wosb_forecasts TO authenticated;
GRANT SELECT ON vw_recompete_opportunities TO authenticated;
GRANT SELECT ON vw_forecast_summary_by_agency TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.gov_contract_forecasts IS
'Stores FORECASTED government contract opportunities (3-24 months in future).
Sources: LRAFs, contract expirations, Sources Sought, AI predictions.
NOT for current opportunities - this is TRUE predictive forecasting.';

COMMENT ON COLUMN public.gov_contract_forecasts.source IS
'Data source: lraf (agency forecasts), contract_expiration (USASpending.gov), sources_sought (SAM.gov RFI), ai_predicted';

COMMENT ON COLUMN public.gov_contract_forecasts.predicted_post_date IS
'AI-predicted date when RFP will be posted on SAM.gov (3-24 months future)';

COMMENT ON COLUMN public.gov_contract_forecasts.forecast_confidence IS
'Confidence level in forecast accuracy: high (>80%), medium (50-80%), low (<50%)';

COMMENT ON VIEW vw_high_priority_wosb_forecasts IS
'High-confidence WOSB-eligible forecasts for DEE DAVIS INC/DEPOINTE tenant';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Government Contract Forecasting schema created successfully!';
  RAISE NOTICE 'Table: gov_contract_forecasts';
  RAISE NOTICE 'Views: vw_high_priority_wosb_forecasts, vw_recompete_opportunities, vw_forecast_summary_by_agency';
  RAISE NOTICE 'Ready for LRAF scanning and contract expiration analysis';
END $$;


