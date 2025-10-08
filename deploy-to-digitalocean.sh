#!/bin/bash

# FleetFlow Digital Ocean Deployment Script
# This script prepares and deploys your app to Digital Ocean

echo "🚀 FleetFlow Digital Ocean Deployment"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the FLEETFLOW directory?${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found package.json${NC}"
echo ""

# Check git status
echo "📋 Checking git status..."
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed${NC}"
    else
        echo -e "${YELLOW}⚠️  Continuing with uncommitted changes...${NC}"
    fi
fi

echo ""
echo "🔍 Current branch: $(git branch --show-current)"
echo ""

# Show environment variables that will be needed
echo "📝 Required Environment Variables for Digital Ocean:"
echo "=================================================="
echo ""
echo "You need to set these in Digital Ocean App Platform:"
echo "https://cloud.digitalocean.com/apps → Your App → Settings → Environment Variables"
echo ""
echo "Required variables:"
echo "  • NODE_ENV=production"
echo "  • NEXTAUTH_SECRET=<your_secret>"
echo "  • NEXTAUTH_URL=https://fleetflowapp.com"
echo "  • NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>"
echo "  • NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>"
echo "  • SQUARE_ACCESS_TOKEN=EAAAlwP5R9qoFiXV1dNd-4oNmMLVEb5Zw0-OPFd0fvMdAzOVbDL3LSe1aQq2Rmqb"
echo "  • NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-5GklzNdvq_BqP1gSCYAudA"
echo "  • TWILIO_ACCOUNT_SID=AC2e547d7c5d39dc8735c7bdb5546ded25"
echo "  • TWILIO_AUTH_TOKEN=4cda06498e86cc8f150d81e4e48b2aed"
echo "  • TWILIO_PHONE_NUMBER=+18333863509"
echo "  • FMCSA_API_KEY=7de24c4a0eade12f34685829289e0446daf7880e"
echo ""
echo "Optional but recommended:"
echo "  • ANTHROPIC_API_KEY=<your_claude_api_key>"
echo "  • NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your_google_maps_key>"
echo ""

read -p "Have you set these environment variables in Digital Ocean? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please set environment variables first:${NC}"
    echo "   1. Go to https://cloud.digitalocean.com/apps"
    echo "   2. Select your FleetFlow app"
    echo "   3. Go to Settings → App-Level Environment Variables"
    echo "   4. Add all the variables listed above"
    echo "   5. Run this script again"
    exit 1
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
read -p "Push to main branch and deploy? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📤 Pushing to main branch..."

    if git push origin main; then
        echo ""
        echo -e "${GREEN}✅ Successfully pushed to main!${NC}"
        echo ""
        echo "🎉 Deployment initiated!"
        echo ""
        echo "📊 Monitor your deployment:"
        echo "   https://cloud.digitalocean.com/apps"
        echo ""
        echo "🌐 Your app will be live at:"
        echo "   https://fleetflowapp.com"
        echo ""
        echo "📝 Next steps:"
        echo "   1. Watch the build logs in Digital Ocean"
        echo "   2. Wait for deployment to complete (5-10 minutes)"
        echo "   3. Test your app at fleetflowapp.com"
        echo "   4. Check for any errors in the logs"
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Failed to push to main${NC}"
        echo "Please check your git configuration and try again"
        exit 1
    fi
else
    echo ""
    echo "❌ Deployment cancelled"
    exit 0
fi

