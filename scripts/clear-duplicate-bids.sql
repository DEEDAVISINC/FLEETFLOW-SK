-- Clear duplicate RFx bid drafts
-- This will delete ALL bid responses from the database
-- Run this in your Supabase SQL Editor to start fresh

DELETE FROM rfx_bid_responses;

-- If you only want to keep the most recent one and delete duplicates, use this instead:
-- DELETE FROM rfx_bid_responses
-- WHERE id NOT IN (
--   SELECT DISTINCT ON (document_name) id
--   FROM rfx_bid_responses
--   ORDER BY document_name, created_at DESC
-- );
