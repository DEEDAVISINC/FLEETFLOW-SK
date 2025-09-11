# 🟨 FleetFlow Square Credentials Setup

## 🎯 **IMMEDIATE ACTION REQUIRED**

You need to manually create a `.env.local` file in your project root with these exact credentials:

---

## 📋 **CREATE .env.local FILE**

**File Location**: `/Users/deedavis/FLEETFLOW/.env.local`

**Copy and paste this content:**

```bash
# =============================================================================
# SQUARE PAYMENT PROCESSING - DUAL ACCOUNT SETUP
# =============================================================================

# PRIMARY SQUARE ACCOUNT (FleetFlow App - Sandbox)
SQUARE_APPLICATION_ID=sq0idp-5GklzNdvq_BqP1gSCYAudA
SQUARE_ACCESS_TOKEN=EAAAlwP5R9qoFiXV1dNd-4oNmMLVEb5Zw0-OPFd0fvMdAzOVbDL3LSe1aQq2Rmqb
SQUARE_ENVIRONMENT=sandbox

# SECONDARY SQUARE ACCOUNT (Production Ready)
SQUARE_APPLICATION_ID_PROD=sq0idp-5GklzNdvq_BqP1gSCYAudA
SQUARE_ACCESS_TOKEN_PROD=EAAAlwP5R9qoFiXV1dNd-4oNmMLVEb5Zw0-OPFd0fvMdAzOVbDL3LSe1aQq2Rmqb
SQUARE_ENVIRONMENT_PROD=production

# CLIENT-SIDE SQUARE CONFIGURATION (For Payment Forms)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-5GklzNdvq_BqP1gSCYAudA
NEXT_PUBLIC_SQUARE_ACCESS_TOKEN=EAAAlwP5R9qoFiXV1dNd-4oNmMLVEb5Zw0-OPFd0fvMdAzOVbDL3LSe1aQq2Rmqb

# =============================================================================
# OTHER REQUIRED VARIABLES
# =============================================================================

# NextAuth Configuration
NEXTAUTH_SECRET=fleetflow_dev_secret_key_2024_change_in_prod
NEXTAUTH_URL=http://localhost:3001

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# Bill.com Configuration
BILLCOM_API_KEY=01ICBWLWIERUAFTN2157
BILLCOM_USERNAME=notary@deedavis.biz
BILLCOM_PASSWORD=D13@sha1$
BILLCOM_ORG_ID=0297208089826008
BILLCOM_ENVIRONMENT=sandbox

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC2e547d7c5d39dc8735c7bdb5546ded25
TWILIO_AUTH_TOKEN=4cda06498e86cc8f150d81e4e48b2aed
TWILIO_PHONE_NUMBER=+18333863509

# FMCSA API
FMCSA_API_KEY=7de24c4a0eade12f34685829289e0446daf7880e
```

---

## ✅ **ACCOUNT STATUS**

### **Account #1 (Sandbox)**

- **Application ID**: `sq0idp-5GklzNdvq_BqP1gSCYAudA`
- **Status**: ✅ Active Sandbox
- **Use For**: Development & Testing

### **Account #2 (Production)**

- **Application ID**: `sq0idp-5GklzNdvq_BqP1gSCYAudA`
- **Status**: ⏳ Production Ready
- **Use For**: Live Payments (when approved)

---

## 🚀 **NEXT STEPS**

1. **Create the .env.local file** with the content above
2. **Restart your development server**: `npm run dev`
3. **Test payment processing** on your local environment
4. **Switch to production account** when Square fully approves

---

## 🔒 **SECURITY NOTES**

- ✅ Credentials already configured in MultiTenantPaymentService
- ✅ Both sandbox and production accounts ready
- ✅ Automatic fallback to Bill.com if Square fails
- ⚠️ Never commit .env.local to version control

---

## 📞 **SQUARE ACCOUNT DETAILS**

### **FleetFlow App Account (Sandbox)**

- Email: payments@fleetflowapp.com
- Environment: Sandbox → Production upgrade path
- Integration: Already configured in your system

### **New Square Account (Production)**

- Application ID: `sq0idp-...` (production format)
- Status: Ready for live transactions
- Positioning: Technology/SaaS company
