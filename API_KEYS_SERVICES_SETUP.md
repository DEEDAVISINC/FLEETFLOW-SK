# 🔑 API Keys & Services Setup Guide

## Production Deployment - External Integrations Configuration

---

## 🎯 **API SERVICES STATUS:**

### **✅ PRODUCTION ACTIVE (Already Configured):**

#### **1. FMCSA SAFER API**

```
✅ Status: PRODUCTION ACTIVE
✅ API Key: 7de24c4a0eade12f34685829289e0446daf7880e
✅ Purpose: Carrier verification and safety ratings
✅ Integration: Enhanced Carrier Service, FMCSA verification
✅ Usage: Real-time carrier lookup and validation
```

#### **2. Twilio SMS API**

```
✅ Status: PRODUCTION ACTIVE
✅ Account SID: AC2e547d7c5d39dc8735c7bdb5546ded25
✅ Auth Token: 4cda06498e86cc8f150d81e4e48b2aed
✅ Phone Number: +18333863509
✅ Purpose: SMS notifications, driver communication
✅ Integration: SMS workflow, automated notifications
```

#### **3. Bill.com API**

```
✅ Status: PRODUCTION READY
✅ API Key: 01ICBWLWIERUAFTN2157
✅ Username: notary@deedavis.biz
✅ Org ID: 0297208089826008
✅ Environment: Sandbox (ready for production)
✅ Purpose: Invoice generation, financial automation
```

#### **4. Weather.gov API**

```
✅ Status: PRODUCTION ACTIVE
✅ API Key: Not required (free government API)
✅ Purpose: Weather intelligence, route optimization
✅ Integration: Weather service, route planning
```

#### **5. ExchangeRate-API**

```
✅ Status: PRODUCTION ACTIVE
✅ API Key: Not required (free tier)
✅ Purpose: Currency conversion, international rates
✅ Integration: Financial calculations, international shipping
```

### **🔄 NEED SETUP (Required for Production):**

#### **6. Claude AI (Anthropic)**

```
🔄 Status: NEED API KEY
🎯 Required: ANTHROPIC_API_KEY
🌐 Get Key: https://console.anthropic.com
💰 Cost: Pay-per-use (primary AI service)
🎯 Purpose: Main AI engine for FleetFlow operations
📋 Integration: Platform AI Manager, all AI services
```

#### **7. Google Maps API**

```
🔄 Status: NEED SETUP
🎯 Required: GOOGLE_MAPS_API_KEY
🌐 Setup: Google Cloud Console
💰 Cost: Pay-per-use with free tier
🎯 Purpose: Route optimization, location services
📋 Integration: Route planning, tracking, mapping
```

#### **8. Google OAuth**

```
🔄 Status: NEED SETUP
🎯 Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
🌐 Setup: Google Cloud Console
💰 Cost: Free
🎯 Purpose: User authentication via Google
📋 Integration: NextAuth.js authentication
```

#### **9. Square Payment Processing**

```
🔄 Status: NEED SETUP
🎯 Required: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID
🌐 Setup: Square Developer Dashboard
💰 Cost: Transaction fees (2.9% + $0.30)
🎯 Purpose: Payment processing for dispatch fees
📋 Integration: Financial transactions, billing
```

#### **10. SAM.gov API**

```
🔄 Status: INFRASTRUCTURE READY
🎯 Required: SAMGOV_API_KEY
🌐 Setup: SAM.gov API portal
💰 Cost: Free government API
🎯 Purpose: Government contract opportunities
📋 Integration: FreightFlow RFx system
```

---

## 🚀 **STEP-BY-STEP SETUP GUIDE:**

### **🎯 PRIORITY 1: CLAUDE AI (ESSENTIAL)**

```bash
# 1. Go to https://console.anthropic.com
# 2. Create account or sign in
# 3. Generate API key
# 4. Add to .env.local:
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Why Critical**: Primary AI engine for all FleetFlow AI operations

### **🗺️ PRIORITY 2: GOOGLE MAPS API**

```bash
# 1. Go to Google Cloud Console (https://console.cloud.google.com)
# 2. Create new project or select existing
# 3. Enable APIs:
#    - Maps JavaScript API
#    - Geocoding API
#    - Directions API
#    - Places API
# 4. Create API key with restrictions
# 5. Add to .env.local:
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Why Critical**: Route optimization, location services, mapping

### **🔐 PRIORITY 3: GOOGLE OAUTH**

```bash
# In same Google Cloud Console project:
# 1. Go to "Credentials"
# 2. Create OAuth 2.0 Client ID
# 3. Add authorized origins:
#    - http://localhost:3000 (development)
#    - https://your-domain.com (production)
# 4. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google
#    - https://your-domain.com/api/auth/callback/google
# 5. Add to .env.local:
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Why Important**: User authentication system

### **💰 PRIORITY 4: SQUARE PAYMENTS**

```bash
# 1. Go to Square Developer Dashboard (https://developer.squareup.com)
# 2. Create application
# 3. Get sandbox credentials for testing
# 4. Add to .env.local:
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=sandbox
```

**Why Important**: Payment processing for dispatch fees

### **🏛️ PRIORITY 5: SAM.GOV API**

```bash
# 1. Go to SAM.gov API portal
# 2. Register for API access
# 3. Generate API key
# 4. Add to .env.local:
SAMGOV_API_KEY=your_samgov_api_key_here
```

**Why Useful**: Government contract opportunities via FreightFlow RFx

---

## 🧪 **TESTING API INTEGRATIONS:**

### **✅ API HEALTH CHECK:**

```bash
# Start development server
npm run dev

# Check console for API status messages:
# ✅ "FMCSA API: Production active"
# ✅ "Twilio SMS: Production active"
# ✅ "Bill.com: Production ready"
# ✅ "Claude AI: API key configured"
# ✅ "Google Maps: API loaded successfully"
# ⚠️ "Weather.gov: API active (no key needed)"
```

### **🔧 API TESTING ENDPOINTS:**

```bash
# Test FMCSA API
curl http://localhost:3000/api/fmcsa/test

# Test Twilio SMS (if configured)
curl http://localhost:3000/api/sms/test

# Test Claude AI (if configured)
curl http://localhost:3000/api/ai/test

# Test Bill.com (if configured)
curl http://localhost:3000/api/billing/test
```

---

## 📱 **SOCIAL MEDIA API SETUP:**

### **YouTube (Google OAuth)**

```
✅ Status: PRODUCTION CONFIGURED
🎯 Credentials: PRIMARY + BACKUP configured
🌐 Setup: Google Cloud Console (https://console.cloud.google.com)
💰 Cost: Free tier (10,000 quota units/day)
🎯 Purpose: Video uploads, analytics, channel management
📋 Integration: Strategic Sales Campaigns, Content Marketing

Primary Credentials:
- Client ID: your-youtube-client-id
- Client Secret: your-youtube-client-secret
- Redirect URI: https://fleetflowapp.com/api/auth/youtube/callback

Backup Credentials (Failover):
- Client ID: your-youtube-backup-client-id
- Client Secret: your-youtube-backup-client-secret
- Redirect URI: https://fleetflowapp.com/api/auth/youtube/callback/backup
```

### **LinkedIn**

```
✅ Status: PRODUCTION CONFIGURED
🎯 Credentials: COMPLETE (Lead Sync + Social Media)
🌐 Setup: LinkedIn Developers (https://www.linkedin.com/developers/)
💰 Cost: Free
🎯 Purpose: B2B networking, professional content, company pages
📋 Integration: Strategic Sales Campaigns, Lead Generation, Lead Sync

Credentials:
- Client ID: 86p6kq8n0j9ydq
- Client Secret: your-linkedin-client-secret
- Redirect URI: https://fleetflowapp.com/api/auth/linkedin/callback
```

### **Facebook/Instagram/Threads (Meta Graph API)**

```
✅ Status: PRODUCTION CONFIGURED
🎯 Credentials: COMPLETE (Facebook + Instagram + Threads)
🌐 Setup: Meta for Developers (https://developers.facebook.com)
💰 Cost: Free
🎯 Purpose: Facebook posts, Instagram content (@fleetflow_official), Threads engagement
📋 Integration: Strategic Sales Campaigns, Social Media Marketing

Facebook/Instagram Credentials:
- App ID: 1248526630620464
- App Secret: 252adb13cdaea9a8ed0b6613a65e3c0c
- Redirect URI: https://fleetflowapp.com/api/auth/facebook/callback
- Facebook Page ID: 829755813550482 (FleetFlow - Software Company)
- Instagram Account ID: 1141502797929986 (@fleetflow_official)

Threads Credentials:
- App ID: 1899999933902995
- App Secret: 880b2f188333377527204c9735127668
- Note: Threads uses Instagram connection for posting
```

### **Twitter/X**

```
⚠️ Status: RESTRICTED (App Violation)
🎯 Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_BEARER_TOKEN
🌐 Setup: Twitter Developer Portal (https://developer.twitter.com)
💰 Cost: Free tier (1,500 tweets/month), Basic ($100/month), Pro ($5,000/month)
🎯 Purpose: Real-time updates, engagement, trending topics
📋 Integration: Strategic Sales Campaigns, Real-time Marketing

Current Status:
- FleetFlow app is currently restricted for app violation
- Options:
  1. Appeal the restriction through Twitter Developer Portal
  2. Create new developer account with established Twitter account
  3. Skip Twitter/X and focus on higher-value B2B platforms (LinkedIn, YouTube)
- Recommendation: Skip Twitter for now due to cost ($100+/month) and restrictions
```

### **TikTok**

```
🔄 Status: NEED SETUP
🎯 Required: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET
🌐 Setup: TikTok for Developers (https://developers.tiktok.com)
💰 Cost: Free
🎯 Purpose: Short-form video content, viral marketing
📋 Integration: Video Marketing, Brand Awareness

Setup Steps:
1. Go to TikTok for Developers
2. Register developer account
3. Create new app
4. Request permissions: user.info.basic, video.upload, video.list
5. Configure redirect URIs
6. Copy Client Key and Client Secret
```

---

## 📊 **DEPLOYMENT READINESS CHECKLIST:**

```
✅ ESSENTIAL APIS (Must Have):
☐ Claude AI (ANTHROPIC_API_KEY) - AI operations
☐ Google Maps (GOOGLE_MAPS_API_KEY) - Route optimization
☐ Google OAuth (CLIENT_ID/SECRET) - Authentication

✅ BUSINESS APIS (Important):
☐ Square Payments (ACCESS_TOKEN) - Payment processing
☐ SAM.gov API (SAMGOV_API_KEY) - Government contracts

✅ SOCIAL MEDIA APIS (Marketing & Campaigns):
☑️ YouTube (YOUTUBE_CLIENT_ID/SECRET) - Video marketing (PRIMARY + BACKUP)
☑️ LinkedIn (LINKEDIN_CLIENT_ID/SECRET) - B2B networking
☑️ Facebook/Instagram (FACEBOOK_APP_ID/SECRET) - Social campaigns
☑️ Instagram (@fleetflow_official) - Visual content
☑️ Threads (THREADS_APP_ID/SECRET) - Text-based engagement
⚠️ Twitter/X (RESTRICTED) - Skip for now
☐ TikTok (TIKTOK_CLIENT_KEY/SECRET) - Optional (can add later)

✅ ALREADY CONFIGURED (Production Active):
☑️ FMCSA SAFER API - Carrier verification
☑️ Twilio SMS API - Communications
☑️ Bill.com API - Financial automation
☑️ Weather.gov API - Weather intelligence
☑️ ExchangeRate-API - Currency conversion
```

---

## 🚨 **CRITICAL NOTES:**

### **🔐 Security:**

- Never commit API keys to version control
- Use environment variables only
- Restrict API keys to specific domains/IPs
- Monitor API usage and costs

### **💰 Cost Management:**

- Most APIs have free tiers for development
- Monitor usage in production
- Set up billing alerts
- Consider usage-based scaling

### **🔧 Fallback Strategies:**

- APIs gracefully degrade if keys missing
- Mock responses in development
- Error handling for API failures
- Alternative API sources when possible

**Next Step**: Continue with Platform AI System deployment and testing!
