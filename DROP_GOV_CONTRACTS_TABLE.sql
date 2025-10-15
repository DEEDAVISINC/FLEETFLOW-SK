-- ============================================================================
-- DROP Government Contract Opportunities Table and Related Objects
-- Run this in Supabase SQL Editor to completely remove the table
-- ============================================================================

-- Drop the view first (depends on table)
DROP VIEW IF EXISTS public.high_priority_gov_opportunities CASCADE;

-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_update_gov_opps_updated_at ON public.gov_contract_opportunities;

-- Drop the function
DROP FUNCTION IF EXISTS update_gov_opps_updated_at();

-- Drop the policy
DROP POLICY IF EXISTS "gov_contracts_allow_all_authenticated" ON public.gov_contract_opportunities;

-- Drop the table (this will also drop all indexes automatically)
DROP TABLE IF EXISTS public.gov_contract_opportunities CASCADE;

-- Verification query (should return empty/error if successfully dropped)
-- SELECT * FROM public.gov_contract_opportunities LIMIT 1;


