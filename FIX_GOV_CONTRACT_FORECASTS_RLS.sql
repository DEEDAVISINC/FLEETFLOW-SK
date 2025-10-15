-- ============================================================================
-- FIX Row Level Security for gov_contract_forecasts table
-- Run this in Supabase SQL Editor to allow API inserts
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access for all authenticated users" ON public.gov_contract_forecasts;
DROP POLICY IF EXISTS "Allow insert for service role" ON public.gov_contract_forecasts;
DROP POLICY IF EXISTS "gov_forecasts_allow_all_authenticated" ON public.gov_contract_forecasts;

-- Create a permissive policy that allows all operations for authenticated users
CREATE POLICY "gov_forecasts_full_access_authenticated"
  ON public.gov_contract_forecasts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon access for the API route (if not using authenticated requests)
CREATE POLICY "gov_forecasts_full_access_anon"
  ON public.gov_contract_forecasts
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Verification
SELECT 'RLS policies updated successfully!' as status;

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'gov_contract_forecasts';

