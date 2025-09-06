#!/bin/bash

# FleetFlow Environment Setup Script
# Creates .env.local with your Neo.space email credentials

echo "🔧 Setting up FleetFlow environment variables..."

# Create .env.local file
cat > .env.local << 'EOF'
# FleetFlow Environment Variables - Local Development

# Neo.space Email Configuration (for Alexis Best - AI Executive Assistant)
NEO_EMAIL_USER=ddavis@freight1stdirect.com
NEO_EMAIL_PASSWORD=D13@sha1$$

# Twilio Phone Configuration (for Charin - AI Receptionist)
# Get these from https://console.twilio.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Claude AI Configuration (for intelligent AI responses)
# Get this from https://console.anthropic.com
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google Maps API (for routing and location services)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Other API Keys (optional)
SENDGRID_API_KEY=your_sendgrid_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
SQUARE_APPLICATION_ID=your_square_application_id_here
SQUARE_ACCESS_TOKEN=your_square_access_token_here
EOF

echo "✅ Created .env.local with your Neo.space email credentials"
echo "📧 Email configured: ddavis@freight1stdirect.com"
echo ""
echo "🚀 Next steps:"
echo "1. Restart your server: npm run dev"
echo "2. Test email connection: curl -X POST http://localhost:3001/api/ai-communication/config"
echo "3. Activate Alexis Best: curl -X POST http://localhost:3001/api/ai-communication/setup -H 'Content-Type: application/json' -d '{\"action\": \"setup_alexis\"}'"
echo ""
echo "📋 Optional: Add Twilio and Anthropic API keys to enable full functionality"





