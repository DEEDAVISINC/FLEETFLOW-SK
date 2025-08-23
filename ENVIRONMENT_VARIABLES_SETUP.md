# 🔑 FleetFlow Environment Variables Setup

## Production Deployment - Environment Configuration

---

## 🎯 **STEP 1: CREATE .env.local FILE**

**You need to manually create a `.env.local` file in your project root with these variables:**

```bash
# FleetFlow Production Environment Variables

# =============================================================================
# AI & CORE SERVICES
# =============================================================================

# Claude AI (Anthropic) - Primary AI Service
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI (Fallback AI Service)
OPENAI_API_KEY=your_openai_api_key_here

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================

# NextAuth Secret (Generate 32+ character string)
NEXTAUTH_SECRET=your_32_plus_character_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# =============================================================================
# COMMUNICATION SERVICES
# =============================================================================

# Twilio SMS Integration (PRODUCTION ACTIVE)
TWILIO_ACCOUNT_SID=AC2e547d7c5d39dc8735c7bdb5546ded25
TWILIO_AUTH_TOKEN=4cda06498e86cc8f150d81e4e48b2aed
TWILIO_PHONE_NUMBER=+18333863509

# =============================================================================
# FINANCIAL SERVICES
# =============================================================================

# Bill.com Integration (PRODUCTION READY)
BILLCOM_API_KEY=01ICBWLWIERUAFTN2157
BILLCOM_USERNAME=notary@deedavis.biz
BILLCOM_PASSWORD=D13@sha1$
BILLCOM_ORG_ID=0297208089826008
BILLCOM_ENVIRONMENT=sandbox

# Square Payment Processing
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=sandbox

# =============================================================================
# GOVERNMENT & REGULATORY APIS
# =============================================================================

# FMCSA SAFER API (PRODUCTION ACTIVE)
FMCSA_API_KEY=7de24c4a0eade12f34685829289e0446daf7880e

# SAM.gov API (Infrastructure Ready)
SAMGOV_API_KEY=your_samgov_api_key_here

# =============================================================================
# PLAID FINANCIAL INTEGRATION
# =============================================================================

# Plaid Integration
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
PLAID_PUBLIC_KEY=your_plaid_public_key_here
PLAID_ENVIRONMENT=sandbox
PLAID_WEBHOOK_URL=your_webhook_url_here

# =============================================================================
# GOOGLE SERVICES
# =============================================================================

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# =============================================================================
# BUSINESS CONFIGURATION
# =============================================================================

# DEPOINTE/FREIGHT 1ST DIRECT Configuration
BUSINESS_NAME=DEE DAVIS INC dba DEPOINTE
MC_NUMBER=MC1647572
DOT_NUMBER=DOT4250594
DISPATCH_EMAIL=dispatch@freight1stdirect.com
OWNER_EMAIL=ddavis@freight1stdirect.com
INVOICE_EMAIL=invoice@freight1stdirect.com

# =============================================================================
# FEATURE FLAGS
# =============================================================================

ENABLE_HAZMAT_ROUTE_COMPLIANCE=true
ENABLE_SEASONAL_LOAD_PLANNING=true
ENABLE_PLATFORM_AI=true
ENABLE_REAL_TIME_TRACKING=true

# =============================================================================
# DEVELOPMENT FLAGS
# =============================================================================

NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## 🔑 **API KEYS YOU NEED TO OBTAIN:**

### **✅ WORKING APIs (Already Have Keys):**

- **FMCSA SAFER API**: `7de24c4a0eade12f34685829289e0446daf7880e` ✅
- **Twilio SMS**: Account SID and Auth Token configured ✅
- **Bill.com**: API key and credentials configured ✅
- **Weather.gov**: No key needed ✅
- **ExchangeRate-API**: No key needed ✅

### **🔄 NEED TO OBTAIN:**

- **ANTHROPIC_API_KEY**: Get from https://console.anthropic.com
- **GOOGLE_MAPS_API_KEY**: Get from Google Cloud Console
- **SQUARE_ACCESS_TOKEN**: Get from Square Dashboard
- **SAMGOV_API_KEY**: Get from SAM.gov API portal
- **NEXTAUTH_SECRET**: Generate 32+ character random string

---

## 🎯 **STEP 2: GENERATE NEXTAUTH SECRET**

**Run this command to generate a secure NextAuth secret:**

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

---

## 🚀 **STEP 3: VALIDATE ENVIRONMENT SETUP**

**After creating .env.local, test the setup:**

```bash
# 1. Install dependencies
npm install

# 2. Check TypeScript compilation
npx tsc --noEmit

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
# 5. Check console for any missing environment variable warnings
```

---

## ✅ **DEPLOYMENT CHECKLIST - ENVIRONMENT VARIABLES:**

```
☐ .env.local file created in project root
☐ ANTHROPIC_API_KEY obtained and added
☐ NEXTAUTH_SECRET generated (32+ characters)
☐ Google Maps API key obtained and enabled
☐ Square payment credentials configured
☐ All API keys validated and working
☐ No environment variable warnings in console
☐ Development server starts successfully
```

---

## 🔧 **TROUBLESHOOTING:**

### **Common Issues:**

1. **"ANTHROPIC_API_KEY not found"**
   - Get API key from https://console.anthropic.com
   - Add to .env.local file
   - Restart development server

2. **NextAuth errors**
   - Generate secure NEXTAUTH_SECRET
   - Ensure NEXTAUTH_URL matches your domain

3. **Google Maps not loading**
   - Enable Google Maps JavaScript API
   - Add API key to GOOGLE_MAPS_API_KEY
   - Check API key restrictions

**Next Step**: Continue with Firestore database setup and security rules configuration!

