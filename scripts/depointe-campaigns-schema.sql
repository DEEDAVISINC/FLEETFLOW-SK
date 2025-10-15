-- =====================================================
-- DEPOINTE CAMPAIGNS - SERVER-SIDE STORAGE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Campaigns Table
CREATE TABLE IF NOT EXISTS depointe_campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  assigned_to TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  target_quantity INTEGER NOT NULL DEFAULT 0,
  progress INTEGER NOT NULL DEFAULT 0,
  estimated_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('healthcare', 'shipper', 'desperate_prospects', 'government')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Leads Table
CREATE TABLE IF NOT EXISTS depointe_leads (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES depointe_campaigns(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  potential_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  priority TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_to TEXT NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Activities Table
CREATE TABLE IF NOT EXISTS depointe_activities (
  id SERIAL PRIMARY KEY,
  task_id TEXT REFERENCES depointe_campaigns(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  activity_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON depointe_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON depointe_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_priority ON depointe_campaigns(priority);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON depointe_campaigns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_task ON depointe_leads(task_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON depointe_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON depointe_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON depointe_leads(assigned_to);

CREATE INDEX IF NOT EXISTS idx_activities_task ON depointe_activities(task_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON depointe_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_staff ON depointe_activities(staff_id);

-- Enable Row Level Security
ALTER TABLE depointe_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE depointe_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE depointe_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON depointe_campaigns
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON depointe_leads
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON depointe_activities
  FOR ALL USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on leads
CREATE TRIGGER update_depointe_leads_updated_at BEFORE UPDATE ON depointe_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON depointe_campaigns TO anon, authenticated, service_role;
GRANT ALL ON depointe_leads TO anon, authenticated, service_role;
GRANT ALL ON depointe_activities TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE depointe_activities_id_seq TO anon, authenticated, service_role;

-- Success message
SELECT 'DEPOINTE Campaign Tables Created Successfully!' as message;


