-- ============================================================================
-- CREATE Government Contract Forecasts Table
-- Run this in Supabase SQL Editor to create the LRAF forecasts table
-- ============================================================================

-- Create the forecasts table
CREATE TABLE IF NOT EXISTS public.gov_contract_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,

  -- Source Information
  source TEXT NOT NULL, -- 'LRAF' or 'CONTRACT_EXPIRATION'
  agency TEXT NOT NULL,
  agency_code TEXT,
  office TEXT,

  -- Opportunity Details
  title TEXT NOT NULL,
  description TEXT,
  naics_code TEXT,
  place_of_performance TEXT,

  -- Financial & Timing
  estimated_value NUMERIC,
  predicted_post_date DATE,
  predicted_award_date DATE,
  fiscal_year TEXT,
  fiscal_quarter TEXT,

  -- Set-Aside & Eligibility
  small_business_set_aside TEXT,
  wosb_eligible BOOLEAN DEFAULT FALSE,
  forecast_confidence TEXT, -- 'high', 'medium', 'low'

  -- Contact Information
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,

  -- Metadata
  acquisition_type TEXT, -- 'RFP', 'RFQ', 'IDIQ', etc.
  url TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  -- Indexes for common queries
  CONSTRAINT gov_contract_forecasts_source_check CHECK (source IN ('LRAF', 'CONTRACT_EXPIRATION'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gov_forecasts_agency ON public.gov_contract_forecasts(agency);
CREATE INDEX IF NOT EXISTS idx_gov_forecasts_post_date ON public.gov_contract_forecasts(predicted_post_date);
CREATE INDEX IF NOT EXISTS idx_gov_forecasts_wosb ON public.gov_contract_forecasts(wosb_eligible) WHERE wosb_eligible = TRUE;
CREATE INDEX IF NOT EXISTS idx_gov_forecasts_value ON public.gov_contract_forecasts(estimated_value);
CREATE INDEX IF NOT EXISTS idx_gov_forecasts_created_at ON public.gov_contract_forecasts(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_gov_forecasts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_gov_forecasts_updated_at
  BEFORE UPDATE ON public.gov_contract_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION update_gov_forecasts_updated_at();

-- Enable Row Level Security
ALTER TABLE public.gov_contract_forecasts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users full access
CREATE POLICY "gov_forecasts_allow_all_authenticated"
  ON public.gov_contract_forecasts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create view for high-value WOSB opportunities
CREATE OR REPLACE VIEW public.high_value_wosb_forecasts AS
SELECT
  id,
  title,
  agency,
  agency_code,
  estimated_value,
  predicted_post_date,
  fiscal_quarter,
  naics_code,
  place_of_performance,
  contact_name,
  contact_email,
  forecast_confidence,
  url
FROM public.gov_contract_forecasts
WHERE wosb_eligible = TRUE
  AND estimated_value >= 100000
  AND predicted_post_date >= CURRENT_DATE
ORDER BY estimated_value DESC, predicted_post_date ASC;

-- Verification query
SELECT 'Table created successfully!' as status;
