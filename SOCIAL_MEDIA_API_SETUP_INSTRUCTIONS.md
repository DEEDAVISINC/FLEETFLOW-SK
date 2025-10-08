# 🔑 Social Media API Setup Instructions

Complete step-by-step guide to get API credentials for YouTube, LinkedIn, Facebook, Instagram,
Twitter/X, and TikTok.

---

## 🎥 YouTube API Setup

### Step 1: Access Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Sign in with your Google account (use the same account as your YouTube channel)

### Step 2: Create or Select Project

1. Click the project dropdown at the top
2. Click **"NEW PROJECT"**
3. Name it: `FleetFlow Social Media`
4. Click **"CREATE"**
5. Wait for project creation, then select it

### Step 3: Enable YouTube Data API v3

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for: `YouTube Data API v3`
3. Click on it
4. Click **"ENABLE"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `FleetFlow`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"SAVE AND CONTINUE"**
   - Scopes: Click **"ADD OR REMOVE SCOPES"**
     - Add: `https://www.googleapis.com/auth/youtube.upload`
     - Add: `https://www.googleapis.com/auth/youtube.readonly`
     - Add: `https://www.googleapis.com/auth/youtube.force-ssl`
   - Click **"SAVE AND CONTINUE"**
   - Test users: Add your email
   - Click **"SAVE AND CONTINUE"**

4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `FleetFlow YouTube Integration`
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/youtube/callback`
     - Production: `https://fleetflowapp.com/api/auth/youtube/callback`
   - Click **"CREATE"**

### Step 5: Copy Your Credentials

You'll see a popup with:

- ✅ **Client ID**: `453663897148-1mhu5d47g8ca3ors4ovj5s26u3i2hfpd.apps.googleusercontent.com` (you
  already have this!)
- 🔑 **Client Secret**: Copy this now!

### Step 6: Create API Key (Optional, for some features)

1. Click **"+ CREATE CREDENTIALS"** → **"API key"**
2. Copy the API key
3. Click **"RESTRICT KEY"**
4. API restrictions: Select **"Restrict key"** → Choose **"YouTube Data API v3"**
5. Click **"SAVE"**

### Step 7: Add to Environment Variables

```bash
YOUTUBE_CLIENT_ID=453663897148-1mhu5d47g8ca3ors4ovj5s26u3i2hfpd.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
YOUTUBE_REDIRECT_URI=https://fleetflowapp.com/api/auth/youtube/callback
YOUTUBE_API_KEY=YOUR_API_KEY_HERE
```

**Cost**: FREE - 10,000 quota units per day (enough for ~100 video uploads/day)

---

## 💼 LinkedIn API Setup

### Step 1: Access LinkedIn Developers

1. Go to: https://www.linkedin.com/developers/
2. Sign in with your LinkedIn account
3. Click **"Create app"** button

### Step 2: Create Your App

1. **App name**: `FleetFlow`
2. **LinkedIn Page**: Select your company page (or create one first at
   linkedin.com/company/setup/new/)
3. **Privacy policy URL**: `https://fleetflowapp.com/privacy`
4. **App logo**: Upload your FleetFlow logo (400x400px minimum)
5. **Legal agreement**: Check the box
6. Click **"Create app"**

### Step 3: Get Your Credentials

1. Go to **"Auth"** tab
2. You'll see:
   - ✅ **Client ID**: Copy this
   - 🔑 **Client Secret**: Copy this (click "Show" first)

### Step 4: Configure OAuth 2.0 Settings

1. Still in **"Auth"** tab
2. **Redirect URLs**: Add these:
   - Development: `http://localhost:3000/api/auth/linkedin/callback`
   - Production: `https://fleetflowapp.com/api/auth/linkedin/callback`
3. Click **"Update"**

### Step 5: Request API Access

1. Go to **"Products"** tab
2. Find **"Share on LinkedIn"** → Click **"Request access"**
3. Find **"Marketing Developer Platform"** → Click **"Request access"**
4. Fill out the form explaining your use case:
   ```
   FleetFlow is a logistics and transportation management platform.
   We need LinkedIn API access to help our users share industry insights,
   company updates, and professional content to their LinkedIn networks
   and company pages automatically.
   ```
5. Wait for approval (usually 1-3 business days)

### Step 6: Add to Environment Variables

```bash
LINKEDIN_CLIENT_ID=YOUR_CLIENT_ID_HERE
LINKEDIN_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
LINKEDIN_REDIRECT_URI=https://fleetflowapp.com/api/auth/linkedin/callback
```

**Cost**: FREE

---

## 📘 Facebook & Instagram API Setup (Meta Graph API)

### Step 1: Access Meta for Developers

1. Go to: https://developers.facebook.com
2. Sign in with your Facebook account
3. Click **"My Apps"** → **"Create App"**

### Step 2: Create Your App

1. **Use case**: Select **"Other"** → Click **"Next"**
2. **App type**: Select **"Business"** → Click **"Next"**
3. **App details**:
   - Display name: `FleetFlow`
   - App contact email: Your email
   - Business account: Select or create one
4. Click **"Create app"**
5. Complete security check

### Step 3: Add Products

1. In the dashboard, find **"Add products to your app"**
2. Find **"Facebook Login"** → Click **"Set up"**
3. Choose platform: **"Web"**
4. Site URL: `https://fleetflowapp.com`
5. Click **"Save"** → **"Continue"**

6. Go back to dashboard
7. Find **"Instagram Graph API"** → Click **"Set up"**

### Step 4: Get Your Credentials

1. In left sidebar, click **"Settings"** → **"Basic"**
2. You'll see:
   - ✅ **App ID**: Copy this
   - 🔑 **App Secret**: Click **"Show"**, complete security check, copy this

### Step 5: Configure OAuth Settings

1. In left sidebar, click **"Facebook Login"** → **"Settings"**
2. **Valid OAuth Redirect URIs**: Add these:
   - Development: `http://localhost:3000/api/auth/facebook/callback`
   - Production: `https://fleetflowapp.com/api/auth/facebook/callback`
3. Click **"Save Changes"**

### Step 6: Get Facebook Page ID

1. Go to your Facebook Page
2. Click **"About"** in left menu
3. Scroll down to find **"Page ID"** or **"Page transparency"**
4. Copy the Page ID

### Step 7: Connect Instagram Business Account

1. Make sure you have an Instagram Business or Creator account
2. Connect it to your Facebook Page:
   - Go to Instagram app → Settings → Account → Switch to Professional Account
   - Choose Business → Connect to Facebook Page
3. In Meta for Developers:
   - Go to **"Instagram Graph API"** → **"Tools"**
   - Click **"Add or Remove Instagram Accounts"**
   - Select your Instagram Business Account
4. Copy your Instagram Account ID (shown in the tools section)

### Step 8: Request Permissions

1. Go to **"App Review"** → **"Permissions and Features"**
2. Request these permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
   - `business_management`
3. For each, click **"Request"** and explain your use case

### Step 9: Switch to Live Mode

1. In top navigation, toggle from **"Development"** to **"Live"**
2. You may need to complete App Review for certain features

### Step 10: Add to Environment Variables

```bash
FACEBOOK_APP_ID=YOUR_APP_ID_HERE
FACEBOOK_APP_SECRET=YOUR_APP_SECRET_HERE
FACEBOOK_REDIRECT_URI=https://fleetflowapp.com/api/auth/facebook/callback
FACEBOOK_PAGE_ID=YOUR_PAGE_ID_HERE
INSTAGRAM_ACCOUNT_ID=YOUR_INSTAGRAM_ACCOUNT_ID_HERE
```

**Cost**: FREE

---

## 🐦 Twitter/X API Setup

### Step 1: Apply for Developer Account

1. Go to: https://developer.twitter.com
2. Sign in with your Twitter/X account
3. Click **"Sign up"** for developer account
4. Fill out the application:
   - **Account details**: Verify your information
   - **Use case**: Select **"Making a bot"** or **"Building tools for Twitter users"**
   - **Description**:
     ```
     FleetFlow is a logistics and transportation management platform.
     We're building automated social media marketing tools to help
     logistics companies share industry insights, company updates,
     and engage with their audience on Twitter/X. Our platform will
     post scheduled content, respond to mentions, and track engagement
     metrics for our business users.
     ```
   - **Will you make Twitter content available to government entities?**: No
5. Review and accept terms
6. Verify your email
7. Wait for approval (can take 1-3 days)

### Step 2: Create a Project and App

1. Once approved, go to: https://developer.twitter.com/en/portal/dashboard
2. Click **"+ Create Project"**
3. **Project details**:
   - Name: `FleetFlow Social Media`
   - Use case: **"Making a bot"**
   - Description: Same as above
4. Click **"Next"**

5. **Create App**:
   - App name: `FleetFlow` (must be unique across Twitter)
   - Click **"Complete"**

### Step 3: Get Your API Keys

You'll immediately see:

- ✅ **API Key**: Copy this
- 🔑 **API Secret**: Copy this
- 🔐 **Bearer Token**: Copy this

**IMPORTANT**: Save these now! You can't see the API Secret again.

### Step 4: Configure App Settings

1. In your app dashboard, click **"Settings"**
2. Scroll to **"User authentication settings"** → Click **"Set up"**
3. **App permissions**: Select **"Read and write"**
4. **Type of App**: Select **"Web App, Automated App or Bot"**
5. **App info**:
   - Callback URI: `https://fleetflowapp.com/api/auth/twitter/callback`
   - Website URL: `https://fleetflowapp.com`
6. Click **"Save"**

### Step 5: Generate Access Token (Optional)

1. Go to **"Keys and tokens"** tab
2. Under **"Access Token and Secret"** → Click **"Generate"**
3. Copy:
   - Access Token
   - Access Token Secret
4. Save these securely

### Step 6: Choose Your Plan

- **Free**: 1,500 tweets/month, read-only access
- **Basic** ($100/month): 3,000 tweets/month, 10,000 reads/month
- **Pro** ($5,000/month): 300,000 tweets/month, 1M reads/month

For FleetFlow, start with **Basic** plan for real business use.

### Step 7: Add to Environment Variables

```bash
TWITTER_API_KEY=YOUR_API_KEY_HERE
TWITTER_API_SECRET=YOUR_API_SECRET_HERE
TWITTER_REDIRECT_URI=https://fleetflowapp.com/api/auth/twitter/callback
TWITTER_BEARER_TOKEN=YOUR_BEARER_TOKEN_HERE
TWITTER_ACCESS_TOKEN=YOUR_ACCESS_TOKEN_HERE  # Optional
TWITTER_ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET_HERE  # Optional
```

**Cost**: FREE (limited) or $100/month (Basic) or $5,000/month (Pro)

---

## 🎵 TikTok API Setup

### Step 1: Register as TikTok Developer

1. Go to: https://developers.tiktok.com
2. Click **"Register"** or **"Login"**
3. Sign in with your TikTok account
4. Complete developer registration:
   - **Account type**: Select **"Individual"** or **"Company"**
   - **Email**: Your business email
   - **Phone**: Your phone number
   - Verify email and phone

### Step 2: Create an App

1. Go to: https://developers.tiktok.com/apps
2. Click **"+ Create new app"**
3. **App details**:
   - App name: `FleetFlow`
   - Category: **"Business & Productivity"**
   - Description:
     ```
     FleetFlow is a logistics and transportation management platform
     that helps businesses create and schedule TikTok content to
     showcase their services, share industry insights, and engage
     with their audience.
     ```
4. Click **"Submit"**

### Step 3: Configure Your App

1. In your app dashboard, go to **"Basic information"**
2. Add:
   - **App icon**: Upload FleetFlow logo (1024x1024px)
   - **Privacy Policy URL**: `https://fleetflowapp.com/privacy`
   - **Terms of Service URL**: `https://fleetflowapp.com/terms`

### Step 4: Get Your Credentials

1. Go to **"Manage apps"** → Select your app
2. In **"Basic information"** tab:
   - ✅ **Client Key**: Copy this
   - 🔑 **Client Secret**: Copy this

### Step 5: Configure OAuth Settings

1. Go to **"Login Kit"** section
2. **Redirect URI**: Add:
   - Development: `http://localhost:3000/api/auth/tiktok/callback`
   - Production: `https://fleetflowapp.com/api/auth/tiktok/callback`
3. Click **"Save"**

### Step 6: Request API Permissions

1. Go to **"Add products"**
2. Find **"Login Kit"** → Click **"Apply"**
3. Request these scopes:
   - `user.info.basic` - Basic user information
   - `video.upload` - Upload videos
   - `video.list` - List user's videos
4. Fill out use case form
5. Wait for approval (usually 3-5 business days)

### Step 7: Submit for Review

1. Once you've configured everything, go to **"Submit for review"**
2. Provide:
   - **App demo video**: Show how FleetFlow will use TikTok API
   - **Test credentials**: Provide a test TikTok account
   - **Use case explanation**: Detailed description
3. Submit and wait for approval

### Step 8: Add to Environment Variables

```bash
TIKTOK_CLIENT_KEY=YOUR_CLIENT_KEY_HERE
TIKTOK_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
TIKTOK_REDIRECT_URI=https://fleetflowapp.com/api/auth/tiktok/callback
```

**Cost**: FREE

---

## 📋 Quick Reference Summary

| Platform               | Developer Portal         | Approval Time                       | Cost               |
| ---------------------- | ------------------------ | ----------------------------------- | ------------------ |
| **YouTube**            | console.cloud.google.com | Instant                             | FREE               |
| **LinkedIn**           | linkedin.com/developers  | 1-3 days                            | FREE               |
| **Facebook/Instagram** | developers.facebook.com  | Instant (some features need review) | FREE               |
| **Twitter/X**          | developer.twitter.com    | 1-3 days                            | $100/month (Basic) |
| **TikTok**             | developers.tiktok.com    | 3-5 days                            | FREE               |

---

## ✅ After Getting All Credentials

### 1. Create `.env.local` File

Create a file in your project root with all credentials:

```bash
# YouTube
YOUTUBE_CLIENT_ID=453663897148-1mhu5d47g8ca3ors4ovj5s26u3i2hfpd.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=YOUR_SECRET
YOUTUBE_REDIRECT_URI=https://fleetflowapp.com/api/auth/youtube/callback
YOUTUBE_API_KEY=YOUR_API_KEY

# LinkedIn
LINKEDIN_CLIENT_ID=YOUR_CLIENT_ID
LINKEDIN_CLIENT_SECRET=YOUR_SECRET
LINKEDIN_REDIRECT_URI=https://fleetflowapp.com/api/auth/linkedin/callback

# Facebook/Instagram
FACEBOOK_APP_ID=YOUR_APP_ID
FACEBOOK_APP_SECRET=YOUR_SECRET
FACEBOOK_REDIRECT_URI=https://fleetflowapp.com/api/auth/facebook/callback
FACEBOOK_PAGE_ID=YOUR_PAGE_ID
INSTAGRAM_ACCOUNT_ID=YOUR_INSTAGRAM_ID

# Twitter/X
TWITTER_API_KEY=YOUR_API_KEY
TWITTER_API_SECRET=YOUR_SECRET
TWITTER_REDIRECT_URI=https://fleetflowapp.com/api/auth/twitter/callback
TWITTER_BEARER_TOKEN=YOUR_BEARER_TOKEN

# TikTok
TIKTOK_CLIENT_KEY=YOUR_CLIENT_KEY
TIKTOK_CLIENT_SECRET=YOUR_SECRET
TIKTOK_REDIRECT_URI=https://fleetflowapp.com/api/auth/tiktok/callback
```

### 2. For Digital Ocean Deployment

Add these as environment variables in your Digital Ocean app settings.

### 3. Test Each Integration

Use the OAuth flows to test authentication for each platform.

---

## 🚨 Important Security Notes

1. **Never commit API keys to Git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables only

2. **Restrict API Keys**
   - Add domain restrictions where possible
   - Use IP allowlists for production

3. **Rotate Keys Regularly**
   - Change keys every 90 days
   - Immediately rotate if compromised

4. **Monitor Usage**
   - Set up billing alerts
   - Track API quota usage
   - Watch for unusual activity

5. **Use Different Keys for Dev/Production**
   - Separate credentials for testing
   - Production keys only on production servers

---

## 💡 Pro Tips

1. **Start with YouTube and LinkedIn** - Easiest to set up, most relevant for B2B
2. **Twitter/X requires budget** - Plan for $100/month Basic plan
3. **Facebook/Instagram are connected** - One setup gets you both
4. **TikTok takes longest** - Apply early if you want to use it
5. **Test in development first** - Use localhost redirect URIs for testing

---

## 🆘 Need Help?

- **YouTube**: https://developers.google.com/youtube/v3/support
- **LinkedIn**: https://www.linkedin.com/help/linkedin/answer/a549047
- **Facebook/Instagram**: https://developers.facebook.com/support/
- **Twitter/X**: https://developer.twitter.com/en/support
- **TikTok**: https://developers.tiktok.com/support

---

**Ready to start?** Begin with YouTube (you already have the Client ID!) and LinkedIn - they're the
easiest and most valuable for logistics/freight marketing! 🚀
