# FleetFlow Vercel Deployment Guide

## 🚀 Complete Vercel Configuration for FleetFlow

### 1. Initial Vercel Setup

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (run from project root)
vercel link
```

### 2. Environment Variables Configuration

#### Production Environment Variables

Set these in your Vercel dashboard under **Settings > Environment Variables**:

```env
# Database Configuration (Supabase Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# AI Services (Critical for FleetFlow AI features)
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key-if-needed

# Authentication
NEXTAUTH_URL=https://fleetflow.vercel.app
NEXTAUTH_SECRET=your-production-nextauth-secret

# FleetFlow API Integrations
FMCSA_API_KEY=your-fmcsa-api-key
FRED_API_KEY=your-fred-api-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
SAM_GOV_API_KEY=your-sam-gov-api-key

# FreeSWITCH Call Center (if using)
FREESWITCH_HOST=your-freeswitch-server
FREESWITCH_PORT=8021
FREESWITCH_PASSWORD=your-freeswitch-password

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your-stripe-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-public

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# System
NODE_ENV=production
LOG_LEVEL=error
```

#### Preview Environment Variables

Set these for **Preview** deployments (branches/PRs):

```env
# Use Supabase staging/dev project for previews
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key

# Use test API keys for previews
ANTHROPIC_API_KEY=your-test-claude-key
STRIPE_SECRET_KEY=sk_test_your-stripe-test-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-test-public

NODE_ENV=development
LOG_LEVEL=debug
```

### 3. Automatic Git Deployment Setup

#### Connect GitHub/GitLab Repository

1. Go to Vercel Dashboard > **Import Project**
2. Connect your Git provider (GitHub recommended)
3. Select your FleetFlow repository
4. Configure deployment settings:

```json
{
  "framework": "Next.js",
  "rootDirectory": "./",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

#### Branch Configuration

```bash
# Production Branch (auto-deploys to main domain)
Production Branch: main

# Preview Branches (auto-deploy PRs and feature branches)
Preview Branches: All branches except main
```

#### Git Integration Features

- ✅ **Automatic deployments** on every push
- ✅ **Preview deployments** for every PR
- ✅ **Deployment status checks** in PRs
- ✅ **Comment with preview URL** in PRs

### 4. Vercel Analytics Setup

#### Enable Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Install Web Vitals for performance tracking
npm install @vercel/speed-insights
```

#### Add to your app layout:

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 5. Domain Configuration

#### Custom Domain Setup

1. **Add Domain** in Vercel Dashboard:

   ```
   Primary: fleetflowapp.com
   Redirect: www.fleetflowapp.com → fleetflowapp.com
   ```

2. **DNS Configuration** (at your domain registrar):

   ```
   A Record: @ → 76.76.19.61
   CNAME: www → cname.vercel-dns.com
   ```

3. **SSL Certificate** (automatic via Vercel)

#### Domain Redirects

```json
// Already configured in vercel.json
{
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    },
    {
      "source": "/login",
      "destination": "/auth/signin",
      "permanent": false
    }
  ]
}
```

### 6. Advanced Configuration

#### Performance Optimization

```json
// next.config.js additions for Vercel
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    domains: ['your-domain.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif']
  },

  // Enable compression
  compress: true,

  // Optimize builds
  swcMinify: true,

  // Edge runtime for API routes
  experimental: {
    runtime: 'edge'
  }
}
```

#### Function Configuration

```json
// vercel.json - API function limits
{
  "functions": {
    "app/api/ai/**/*.ts": {
      "maxDuration": 30
    },
    "app/api/freeswitch/**/*.ts": {
      "maxDuration": 60
    },
    "app/api/reports/**/*.ts": {
      "maxDuration": 45
    }
  }
}
```

### 7. Deployment Commands

#### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific environment
vercel --prod --env NODE_ENV=production
```

#### Build Optimization

```bash
# Analyze bundle size before deploying
npm run build
npx @next/bundle-analyzer

# Check for build errors
npm run lint
npm run type-check
```

### 8. Monitoring & Debugging

#### Vercel Logs

```bash
# View function logs
vercel logs

# View specific deployment logs
vercel logs [deployment-url]

# Real-time logs
vercel logs --follow
```

#### Performance Monitoring

- **Core Web Vitals** tracking
- **Runtime metrics** for serverless functions
- **Error boundaries** with Sentry integration
- **Database performance** via Supabase metrics

### 9. Security Configuration

#### Environment Security

- ✅ **Never commit** `.env` files
- ✅ **Use Preview environments** for testing
- ✅ **Rotate API keys** regularly
- ✅ **Enable 2FA** on Vercel account

#### Headers Security

```json
// Already configured in vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### 10. Deployment Checklist

#### Pre-Deployment

- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)

#### Post-Deployment

- [ ] Production site loads correctly
- [ ] Database connections work
- [ ] API endpoints respond
- [ ] Authentication flows work
- [ ] File uploads work (if using Cloudinary)
- [ ] Email notifications work
- [ ] Analytics tracking enabled

### 11. Troubleshooting

#### Common Issues

**Build Failures:**

```bash
# Clear cache and rebuild
vercel env rm NODE_ENV
vercel env add NODE_ENV production
```

**Function Timeouts:**

```json
// Increase timeout in vercel.json
"functions": {
  "app/api/slow-endpoint/*.ts": {
    "maxDuration": 60
  }
}
```

**Environment Variable Issues:**

```bash
# List all env vars
vercel env ls

# Add missing variable
vercel env add VARIABLE_NAME
```

#### Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **FleetFlow Issues**: Use GitHub Issues for project-specific problems

---

## 🎯 Quick Start Commands

```bash
# 1. Initial setup
vercel login && vercel link

# 2. Set environment variables (use Vercel dashboard)

# 3. Deploy preview
vercel

# 4. Deploy production
vercel --prod

# 5. Check deployment
vercel ls
```

Your FleetFlow application will be live at:

- **Production**: https://fleetflow.vercel.app
- **Previews**: https://fleetflow-git-[branch]-[team].vercel.app
