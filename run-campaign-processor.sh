#!/bin/bash

# DEPOINTE Campaign Processor - Keep Running 24/7
# This script calls the campaign processor every 10 seconds

echo "🚀 Starting DEPOINTE Campaign Processor..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
  echo "⏰ [$(date '+%H:%M:%S')] Triggering campaign processor..."

  curl -s -X POST http://localhost:3001/api/depointe/process-campaigns \
    | jq -r 'if .tasksProcessed then "✅ Processed \(.tasksProcessed) campaigns | Generated \(.leadsGenerated) leads | Revenue: $\(.revenueGenerated)" else "⚠️ No active campaigns" end'

  echo ""
  sleep 10
done


