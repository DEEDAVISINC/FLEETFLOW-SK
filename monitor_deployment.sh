#!/bin/bash
echo "🔍 Monitoring Digital Ocean deployment..."
OLD_BUILD=$(curl -s "https://www.fleetflowapp.com" | grep -o "fleetflow_[0-9]*" | head -1)
echo "Current build: $OLD_BUILD"

for i in {1..20}; do
  sleep 15
  NEW_BUILD=$(curl -s "https://www.fleetflowapp.com" | grep -o "fleetflow_[0-9]*" | head -1)
  if [ "$NEW_BUILD" != "$OLD_BUILD" ]; then
    echo "✅ DEPLOYMENT COMPLETE!"
    echo "New build: $NEW_BUILD"
    echo "Old build: $OLD_BUILD"
    echo "🎉 Component error fixes are now live!"
    exit 0
  fi
  echo "⏳ Still deploying... ($((i*15))s elapsed)"
done

echo "⚠️  Deployment taking longer than expected. Check Digital Ocean dashboard."
echo "Repository: https://github.com/DEEDAVISINC/FLEETFLOW-SK.git"

