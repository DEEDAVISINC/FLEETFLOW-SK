#!/bin/bash

# 🧪 FleetFlow System Test
echo "🚀 Testing FleetFlow System..."
echo "=================================="

# Check if dev server is running
echo "📡 Checking development server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server not running - run 'npm run dev'"
    exit 1
fi

# Test main pages
echo ""
echo "🌐 Testing main pages..."

pages=(
    "http://localhost:3000/"
    "http://localhost:3000/dispatch"
    "http://localhost:3000/drivers"
    "http://localhost:3000/carriers" 
    "http://localhost:3000/routes"
    "http://localhost:3000/driver-portal"
)

for page in "${pages[@]}"; do
    if curl -s "$page" > /dev/null; then
        echo "✅ $page"
    else
        echo "❌ $page"
    fi
done

# Check environment variables
echo ""
echo "🔧 Checking environment setup..."

if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check for key variables (without showing values)
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ Supabase config found"
    else
        echo "⚠️  Supabase config missing (optional for demo)"
    fi
    
    if grep -q "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" .env.local; then
        echo "✅ Cloudinary config found"
    else
        echo "⚠️  Cloudinary config missing (optional for demo)"
    fi
    
    if grep -q "TWILIO_ACCOUNT_SID" .env.local; then
        echo "✅ Twilio config found"
    else
        echo "⚠️  Twilio config missing (optional for demo)"
    fi
else
    echo "❌ .env.local file missing"
fi

# Check package.json dependencies
echo ""
echo "📦 Checking dependencies..."

required_deps=(
    "@supabase/supabase-js"
    "cloudinary" 
    "twilio"
    "next"
    "react"
)

for dep in "${required_deps[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        echo "✅ $dep installed"
    else
        echo "❌ $dep missing"
    fi
done

echo ""
echo "🎉 Test Complete!"
echo "=================================="
echo ""
echo "🌟 Next Steps:"
echo "1. Open http://localhost:3000/driver-portal"
echo "2. Test the driver interface"
echo "3. Try photo upload and signature features"
echo "4. Check SMS functionality (if Twilio configured)"
echo ""
echo "📋 Ready to go live? Check GETTING_STARTED.md"
