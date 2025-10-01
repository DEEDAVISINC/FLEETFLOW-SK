-- FLEETFLOW SHIPMENT CONSOLIDATION DATABASE SCHEMA
-- Supports automatic LCL to FCL consolidation with cost optimization

-- =============================================================================
-- CONSOLIDATION OPPORTUNITIES TABLE
-- Tracks potential consolidation opportunities before execution
-- =============================================================================

CREATE TABLE consolidation_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id VARCHAR(50) UNIQUE NOT NULL,

  -- Route Information
  origin_port VARCHAR(10) NOT NULL,
  destination_port VARCHAR(10) NOT NULL,
  etd DATE NOT NULL,

  -- Shipment Details
  total_shipments INTEGER NOT NULL DEFAULT 0,
  total_weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_volume DECIMAL(8,3) NOT NULL DEFAULT 0,

  -- Container Optimization
  recommended_container VARCHAR(10),
  weight_utilization DECIMAL(5,2),
  volume_utilization DECIMAL(5,2),

  -- Financial Impact
  estimated_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Shipment IDs (JSON array for easy querying)
  shipment_ids JSONB NOT NULL DEFAULT '[]',

  -- Status and Metadata
  status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, EXECUTED, EXPIRED, CANCELLED
  priority VARCHAR(10) DEFAULT 'MEDIUM', -- HIGH, MEDIUM, LOW
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Indexes for performance
  INDEX idx_route_ports (origin_port, destination_port),
  INDEX idx_etd (etd),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at),
  INDEX idx_expires_at (expires_at)
);

-- =============================================================================
-- CONSOLIDATED SHIPMENTS TABLE
-- Tracks executed consolidations and their details
-- =============================================================================

CREATE TABLE consolidated_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consolidation_id VARCHAR(50) UNIQUE NOT NULL,

  -- Master Bill of Lading
  master_bl_number VARCHAR(30) UNIQUE NOT NULL,
  carrier VARCHAR(100) NOT NULL,
  vessel_name VARCHAR(100),
  voyage_number VARCHAR(20),

  -- Route Information
  origin_port VARCHAR(10) NOT NULL,
  destination_port VARCHAR(10) NOT NULL,
  etd TIMESTAMP WITH TIME ZONE,
  eta TIMESTAMP WITH TIME ZONE,

  -- Container Details
  container_type VARCHAR(10) NOT NULL,
  container_numbers JSONB NOT NULL DEFAULT '[]', -- Array of ISO container numbers

  -- Shipment Summary
  total_shipments INTEGER NOT NULL DEFAULT 0,
  total_weight DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_volume DECIMAL(8,3) NOT NULL DEFAULT 0,

  -- House Bills of Lading
  house_bl_numbers JSONB NOT NULL DEFAULT '[]', -- Array of house BL numbers

  -- Financial Details
  freight_cost DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  savings_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  savings_percentage DECIMAL(5,2),

  -- Status and Tracking
  status VARCHAR(20) DEFAULT 'CREATED', -- CREATED, BOOKED, DEPARTED, ARRIVED, COMPLETED
  booking_date TIMESTAMP WITH TIME ZONE,
  departure_date TIMESTAMP WITH TIME ZONE,
  arrival_date TIMESTAMP WITH TIME ZONE,

  -- Audit Trail
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_master_bl (master_bl_number),
  INDEX idx_consolidation_id (consolidation_id),
  INDEX idx_carrier (carrier),
  INDEX idx_route (origin_port, destination_port),
  INDEX idx_status (status),
  INDEX idx_etd (etd),
  INDEX idx_eta (eta),
  INDEX idx_created_at (created_at)
);

-- =============================================================================
-- CONSOLIDATION SHIPMENT LINKS TABLE
-- Links individual shipments to their consolidations
-- =============================================================================

CREATE TABLE consolidation_shipment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consolidation_id VARCHAR(50) NOT NULL,
  shipment_id VARCHAR(50) NOT NULL,

  -- House BL Assignment
  house_bl_number VARCHAR(30),
  container_number VARCHAR(11), -- ISO container number

  -- Position in Container (for tracking)
  container_position VARCHAR(20), -- e.g., "BOTTOM_LEFT", "TOP_RIGHT"

  -- Financial Allocation (prorated costs)
  allocated_cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Status
  status VARCHAR(20) DEFAULT 'LINKED', -- LINKED, DETACHED, COMPLETED
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  detached_at TIMESTAMP WITH TIME ZONE,

  -- Foreign Keys (with cascade delete)
  FOREIGN KEY (consolidation_id) REFERENCES consolidated_shipments(consolidation_id) ON DELETE CASCADE,

  -- Indexes
  INDEX idx_consolidation (consolidation_id),
  INDEX idx_shipment (shipment_id),
  INDEX idx_house_bl (house_bl_number),
  INDEX idx_status (status),
  UNIQUE KEY unique_shipment_link (shipment_id, consolidation_id)
);

-- =============================================================================
-- CONSOLIDATION ANALYTICS TABLE
-- Stores historical analytics for reporting
-- =============================================================================

CREATE TABLE consolidation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Volume Metrics
  total_opportunities INTEGER NOT NULL DEFAULT 0,
  executed_consolidations INTEGER NOT NULL DEFAULT 0,
  total_shipments_consolidated INTEGER NOT NULL DEFAULT 0,
  total_weight_consolidated DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_volume_consolidated DECIMAL(10,3) NOT NULL DEFAULT 0,

  -- Financial Metrics
  total_savings DECIMAL(12,2) NOT NULL DEFAULT 0,
  average_savings_per_shipment DECIMAL(8,2),
  average_savings_percentage DECIMAL(5,2),

  -- Efficiency Metrics
  average_container_utilization DECIMAL(5,2),
  average_shipments_per_consolidation DECIMAL(5,2),
  consolidation_success_rate DECIMAL(5,2), -- Executed / Opportunities

  -- Route Performance
  top_routes JSONB, -- Top performing routes by savings

  -- Created timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  INDEX idx_period (period_start, period_end),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_period (period_start, period_end)
);

-- =============================================================================
-- CONSOLIDATION SETTINGS TABLE
-- Configurable settings for consolidation algorithms
-- =============================================================================

CREATE TABLE consolidation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,

  -- Metadata
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  INDEX idx_setting_key (setting_key),
  INDEX idx_created_at (created_at)
);

-- Insert default consolidation settings
INSERT INTO consolidation_settings (setting_key, setting_value, description) VALUES
('DEFAULT_CRITERIA', '{
  "departureWindowDays": 7,
  "minShipments": 2,
  "maxShipments": 20,
  "minWeightUtilization": 70,
  "minVolumeUtilization": 70,
  "maxWeightUtilization": 95,
  "maxVolumeUtilization": 95
}', 'Default criteria for finding consolidation opportunities'),

('CONTAINER_SPECS', '{
  "20FT": {"weight": 28000, "volume": 33.2},
  "40FT": {"weight": 28000, "volume": 67.7},
  "40HC": {"weight": 28000, "volume": 76.4},
  "45HC": {"weight": 28000, "volume": 86.0}
}', 'Container specifications for optimization'),

('COST_CALCULATIONS', '{
  "baseRates": {
    "20FT": 2000,
    "40FT": 3500,
    "40HC": 3800,
    "45HC": 4200
  },
  "fuelSurchargePercent": 5,
  "documentationFee": 150,
  "insurancePercent": 1
}', 'Cost calculation parameters'),

('AUTOMATION_SETTINGS', '{
  "autoFindOpportunities": true,
  "autoNotifyCustomers": true,
  "opportunityExpirationHours": 48,
  "minSavingsThreshold": 500,
  "maxOpportunitiesPerRoute": 10
}', 'Automation settings for consolidation');

-- =============================================================================
-- TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_consolidated_shipments_updated_at
    BEFORE UPDATE ON consolidated_shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consolidation_settings_updated_at
    BEFORE UPDATE ON consolidation_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire old opportunities
CREATE OR REPLACE FUNCTION expire_old_opportunities()
RETURNS void AS $$
BEGIN
    UPDATE consolidation_opportunities
    SET status = 'EXPIRED'
    WHERE status = 'ACTIVE'
      AND expires_at < NOW();
END;
$$ language 'plpgsql';

-- Create a scheduled job to run expiration function (would be handled by application scheduler)

-- =============================================================================
-- VIEWS FOR EASY QUERYING
-- =============================================================================

-- View for active consolidation opportunities
CREATE VIEW active_consolidation_opportunities AS
SELECT
  co.*,
  jsonb_array_length(co.shipment_ids) as shipment_count
FROM consolidation_opportunities co
WHERE co.status = 'ACTIVE'
  AND co.expires_at > NOW()
ORDER BY co.estimated_savings DESC;

-- View for consolidation performance summary
CREATE VIEW consolidation_performance_summary AS
SELECT
  DATE_TRUNC('month', ca.period_start) as month,
  SUM(ca.total_shipments_consolidated) as monthly_shipments,
  SUM(ca.total_savings) as monthly_savings,
  AVG(ca.average_savings_per_shipment) as avg_savings_per_shipment,
  AVG(ca.average_container_utilization) as avg_utilization
FROM consolidation_analytics ca
GROUP BY DATE_TRUNC('month', ca.period_start)
ORDER BY month DESC;

-- View for detailed consolidation shipment info
CREATE VIEW detailed_consolidation_info AS
SELECT
  cs.*,
  jsonb_array_length(cs.house_bl_numbers) as house_bl_count,
  jsonb_array_length(cs.container_numbers) as container_count,
  (cs.savings_amount / NULLIF(cs.total_shipments, 0)) as avg_savings_per_shipment
FROM consolidated_shipments cs
ORDER BY cs.created_at DESC;

-- =============================================================================
-- PERMISSIONS AND SECURITY
-- =============================================================================

-- Grant permissions (adjust based on your user roles)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON consolidation_opportunities TO fleetflow_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON consolidated_shipments TO fleetflow_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON consolidation_shipment_links TO fleetflow_user;
-- GRANT SELECT, INSERT, UPDATE ON consolidation_analytics TO fleetflow_user;
-- GRANT SELECT ON active_consolidation_opportunities TO fleetflow_user;
-- GRANT SELECT ON consolidation_performance_summary TO fleetflow_user;
-- GRANT SELECT ON detailed_consolidation_info TO fleetflow_user;

-- =============================================================================
-- INDEX OPTIMIZATION
-- =============================================================================

-- Additional performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cons_opp_route_etd
    ON consolidation_opportunities (origin_port, destination_port, etd)
    WHERE status = 'ACTIVE';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cons_ship_etd_status
    ON consolidated_shipments (etd, status)
    WHERE status IN ('CREATED', 'BOOKED', 'DEPARTED');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cons_links_shipment_status
    ON consolidation_shipment_links (shipment_id, status)
    WHERE status = 'LINKED';

-- =============================================================================
-- DATA VALIDATION CONSTRAINTS
-- =============================================================================

-- Ensure positive values
ALTER TABLE consolidation_opportunities
  ADD CONSTRAINT chk_positive_savings
  CHECK (estimated_savings >= 0);

ALTER TABLE consolidated_shipments
  ADD CONSTRAINT chk_positive_cost
  CHECK (freight_cost >= 0);

-- Ensure valid utilization percentages
ALTER TABLE consolidation_opportunities
  ADD CONSTRAINT chk_valid_utilization
  CHECK (
    weight_utilization BETWEEN 0 AND 100
    AND volume_utilization BETWEEN 0 AND 100
  );

-- Ensure valid container types
ALTER TABLE consolidated_shipments
  ADD CONSTRAINT chk_valid_container
  CHECK (container_type IN ('20FT', '40FT', '40HC', '45HC'));

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE consolidation_opportunities IS 'Tracks potential consolidation opportunities before execution';
COMMENT ON TABLE consolidated_shipments IS 'Tracks executed consolidations with master and house BL details';
COMMENT ON TABLE consolidation_shipment_links IS 'Links individual shipments to their consolidations';
COMMENT ON TABLE consolidation_analytics IS 'Historical analytics for consolidation performance reporting';
COMMENT ON TABLE consolidation_settings IS 'Configurable settings for consolidation algorithms';

COMMENT ON VIEW active_consolidation_opportunities IS 'Active consolidation opportunities with shipment counts';
COMMENT ON VIEW consolidation_performance_summary IS 'Monthly consolidation performance summary';
COMMENT ON VIEW detailed_consolidation_info IS 'Detailed view of consolidated shipments with metrics';

-- =============================================================================
-- MIGRATION NOTES
-- =============================================================================
/*
This schema supports:
- Automatic opportunity detection
- Container optimization algorithms
- Cost savings tracking
- House/Master BL management
- Performance analytics
- Configurable consolidation criteria

To migrate existing data:
1. Run this schema creation script
2. Populate consolidation_settings with appropriate values
3. Import any existing consolidation data if available
4. Update application code to use new table structure
5. Test consolidation algorithms with real data
*/


