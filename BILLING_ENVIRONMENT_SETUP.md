# Billing Environment Setup Guide

## Overview
This guide covers how to securely configure the FleetFlow billing system environment variables for Stripe and Bill.com integration.

## Required Environment Variables

### Stripe Configuration
These variables are required for subscription management, usage tracking, and payment processing:

```bash
# Stripe Test Keys (for development/testing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Production Keys (for production deployment)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Bill.com Configuration
These variables are required for invoice management, recurring billing, and payment processing:

```bash
# Bill.com API Configuration
BILLCOM_API_KEY=your_billcom_api_key
BILLCOM_USERNAME=your_billcom_username
BILLCOM_PASSWORD=your_billcom_password
BILLCOM_ENVIRONMENT=sandbox  # Use 'production' for live environment
BILLCOM_ORG_ID=your_org_id
```

## Setup Instructions

### 1. Stripe Setup

1. **Create Stripe Account**: Sign up at [https://stripe.com](https://stripe.com)
2. **Get API Keys**: 
   - Go to Developers > API Keys
   - Copy your Publishable key and Secret key
3. **Setup Webhooks**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the webhook secret

### 2. Bill.com Setup

1. **Create Bill.com Account**: Sign up at [https://www.bill.com](https://www.bill.com)
2. **Get API Access**:
   - Contact Bill.com support to enable API access
   - Request sandbox access for testing
3. **Generate API Key**:
   - Go to Settings > API
   - Generate your API key
4. **Get Organization ID**:
   - Found in your Bill.com account settings

### 3. Environment File Configuration

#### For Development (.env.local)
```bash
# Copy .env.local.example to .env.local
cp .env.local.example .env.local

# Add your actual keys to .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
BILLCOM_API_KEY=your_actual_api_key
BILLCOM_USERNAME=your_billcom_username
BILLCOM_PASSWORD=your_billcom_password
BILLCOM_ENVIRONMENT=sandbox
BILLCOM_ORG_ID=your_org_id
```

#### For Backend (.env)
```bash
# Copy backend-env-example.txt to .env in your backend directory
cp backend-env-example.txt .env

# Add your actual keys to .env
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
BILLCOM_API_KEY=your_actual_api_key
BILLCOM_USERNAME=your_billcom_username
BILLCOM_PASSWORD=your_billcom_password
BILLCOM_ENVIRONMENT=sandbox
BILLCOM_ORG_ID=your_org_id
```

## Production Deployment

### Security Best Practices

1. **Use Environment Variables**: Never commit actual keys to version control
2. **Rotate Keys Regularly**: Change API keys periodically
3. **Monitor Usage**: Track API usage and set up alerts
4. **Use HTTPS**: Ensure all communication is encrypted

### Platform-Specific Setup

#### Vercel Deployment
```bash
# Set environment variables in Vercel dashboard
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add BILLCOM_API_KEY
vercel env add BILLCOM_USERNAME
vercel env add BILLCOM_PASSWORD
vercel env add BILLCOM_ENVIRONMENT
vercel env add BILLCOM_ORG_ID
```

#### AWS/Docker Deployment
```bash
# Use AWS Secrets Manager or environment variables
export STRIPE_SECRET_KEY="sk_live_..."
export BILLCOM_API_KEY="your_key"
# etc.
```

#### Heroku Deployment
```bash
# Set config vars
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set BILLCOM_API_KEY=your_key
# etc.
```

## Testing Configuration

### Verify Stripe Integration
```bash
# Test Stripe connection
npm run test:stripe
```

### Verify Bill.com Integration
```bash
# Test Bill.com connection
npm run test:billcom
```

### Environment Validation
The system includes built-in environment validation that will check for required variables on startup:

```javascript
// Environment validation runs automatically
// Missing variables will be logged with clear error messages
```

## Billing Features Enabled

With proper environment configuration, the following features will be available:

### Stripe Features
- ✅ Customer management
- ✅ Subscription billing
- ✅ Usage-based billing
- ✅ Payment processing
- ✅ Webhook handling
- ✅ Analytics and reporting

### Bill.com Features
- ✅ Invoice generation
- ✅ Recurring billing
- ✅ Payment tracking
- ✅ Vendor management
- ✅ Expense tracking
- ✅ Financial reporting

### Integrated Features
- ✅ Automated billing workflows
- ✅ Multi-tenant billing
- ✅ Usage analytics
- ✅ Revenue reporting
- ✅ Dunning management
- ✅ Customer portal

## Troubleshooting

### Common Issues

1. **Invalid API Key**: Ensure keys are correctly copied without extra spaces
2. **Webhook Failures**: Verify webhook endpoint URL and selected events
3. **Environment Conflicts**: Ensure test/production keys don't mix
4. **CORS Issues**: Configure proper origins for your domain

### Support Contacts

- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Bill.com Support**: [https://www.bill.com/support](https://www.bill.com/support)
- **FleetFlow Support**: Check the main documentation for internal support

## Next Steps

1. Configure your environment variables
2. Test the billing integration
3. Set up your pricing tiers in Stripe
4. Configure your Bill.com organization
5. Test end-to-end billing workflows
6. Deploy to production with live keys

For detailed implementation guides, see:
- `STRIPE_BILLCOM_IMPLEMENTATION_PLAN.md`
- `USER_GUIDE.md` (Billing & Subscriptions section)
