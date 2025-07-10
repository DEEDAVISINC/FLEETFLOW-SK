#!/bin/bash

# 🧪 Cloudinary Configuration Test Script
echo "🔧 Testing Cloudinary Configuration..."
echo "=================================="

# Check environment file exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

echo "✅ .env.local file found"

# Check for required environment variables
echo ""
echo "🔍 Checking environment variables..."

check_env_var() {
    local var_name=$1
    local display_name=$2
    
    if grep -q "^${var_name}=" .env.local && ! grep -q "^${var_name}=your_" .env.local; then
        echo "✅ $display_name configured"
        return 0
    else
        echo "❌ $display_name missing or not configured"
        return 1
    fi
}

all_configured=true

check_env_var "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" "Cloudinary Cloud Name" || all_configured=false
check_env_var "CLOUDINARY_API_KEY" "Cloudinary API Key" || all_configured=false
check_env_var "CLOUDINARY_API_SECRET" "Cloudinary API Secret" || all_configured=false
check_env_var "CLOUDINARY_UPLOAD_PRESET" "Cloudinary Upload Preset" || all_configured=false

echo ""
if [ "$all_configured" = true ]; then
    echo "🎉 All Cloudinary variables configured!"
    echo ""
    echo "🧪 Testing API connection..."
    
    # Extract cloud name for test
    cloud_name=$(grep "^NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=" .env.local | cut -d'=' -f2)
    
    if [ -n "$cloud_name" ] && [ "$cloud_name" != "your_cloud_name_here" ]; then
        # Test if cloud name is accessible
        response=$(curl -s -o /dev/null -w "%{http_code}" "https://res.cloudinary.com/$cloud_name/image/upload")
        
        if [ "$response" = "400" ] || [ "$response" = "401" ]; then
            echo "✅ Cloudinary cloud '$cloud_name' is accessible"
            echo ""
            echo "🚀 Ready to test uploads!"
            echo "1. Restart your dev server: npm run dev"
            echo "2. Go to: http://localhost:3000/driver-portal"
            echo "3. Try uploading photos in load confirmation"
            echo "4. Check your Cloudinary media library"
        else
            echo "⚠️  Could not verify cloud accessibility (this is normal)"
            echo "   Try uploading a test photo to verify everything works"
        fi
    else
        echo "⚠️  Cloud name still shows placeholder value"
    fi
else
    echo "⚠️  Some Cloudinary variables need configuration"
    echo ""
    echo "📋 Quick setup checklist:"
    echo "1. Go to: https://cloudinary.com/users/register/free"
    echo "2. Get your credentials from the dashboard"
    echo "3. Update these in .env.local:"
    echo "   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
    echo "   - CLOUDINARY_API_KEY"
    echo "   - CLOUDINARY_API_SECRET"
    echo "4. Create upload preset 'fleetflow_photos'"
    echo "5. Run this test again: ./test-cloudinary.sh"
fi

echo ""
echo "🔗 Need help? Check CLOUDINARY_SETUP_GUIDE.md"
