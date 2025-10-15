-- Add Soft Delete (Trash/Recovery) Feature to RFx Bid Responses
-- This allows users to recover accidentally deleted bids

-- Add deleted_at column for soft deletes
ALTER TABLE rfx_bid_responses
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add deleted_by column to track who deleted it
ALTER TABLE rfx_bid_responses
ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) DEFAULT NULL;

-- Create index for efficient querying of non-deleted bids
CREATE INDEX IF NOT EXISTS idx_rfx_bid_responses_deleted_at
ON rfx_bid_responses(deleted_at)
WHERE deleted_at IS NULL;

-- Create index for trash view (deleted bids within last 30 days)
CREATE INDEX IF NOT EXISTS idx_rfx_bid_responses_trash
ON rfx_bid_responses(deleted_at DESC)
WHERE deleted_at IS NOT NULL;

-- View for active (non-deleted) bids
CREATE OR REPLACE VIEW active_rfx_bid_responses AS
SELECT * FROM rfx_bid_responses
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- View for trash (deleted bids within last 30 days)
CREATE OR REPLACE VIEW rfx_bid_responses_trash AS
SELECT
  *,
  EXTRACT(days FROM (NOW() - deleted_at)) as days_in_trash
FROM rfx_bid_responses
WHERE deleted_at IS NOT NULL
  AND deleted_at > NOW() - INTERVAL '30 days'
ORDER BY deleted_at DESC;

-- Function to permanently delete bids older than 30 days
CREATE OR REPLACE FUNCTION cleanup_old_deleted_bids()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM rfx_bid_responses
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comment: To run cleanup manually, execute: SELECT cleanup_old_deleted_bids();
-- To schedule automatic cleanup, you can use pg_cron extension (if available)

-- Verification query
SELECT
  COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_bids,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL AND deleted_at > NOW() - INTERVAL '30 days') as trash_bids,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days') as expired_trash
FROM rfx_bid_responses;



