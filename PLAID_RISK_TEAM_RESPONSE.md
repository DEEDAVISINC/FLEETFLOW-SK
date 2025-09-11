# FleetFlow - Plaid Risk Team KYC Response

**Date:** December 2024 **Subject:** Production Access Request - Additional Information **Prepared
For:** Plaid Risk Team **Company:** FleetFlow Technologies, Inc.

---

## 📋 **Requested Information Summary**

Thank you for your request for additional KYC diligence information. Please find the comprehensive
details below:

---

## 1. **Privacy Policy**

**FleetFlow Privacy Policy:** https://fleetflowapp.com/privacy

### Key Compliance Highlights:

- ✅ **GDPR Compliant**: Articles 15, 17, 20, 28, 35 implemented
- ✅ **CCPA Compliant**: Sections 1798.105, 1798.110, 1798.115 implemented
- ✅ **SOX Compliant**: 7-year financial record retention
- ✅ **Banking Regulations**: ACH and financial data protection controls
- ✅ **Automated Data Subject Rights**: 30-day response time compliance

---

## 2. **Product Screenshots & User Flow Documentation**

### **FleetFlow Platform Overview**

FleetFlow is a comprehensive transportation management system (TMS) serving the logistics and
trucking industry with enterprise-grade fleet management, DOT compliance, and financial integration
solutions.

### **Plaid Link Integration Points**

#### **Primary Integration: Carrier Onboarding Process**

**Location in Application:** `/onboarding/carrier-onboarding/new`

**Step 1: User Registration Flow**

```
Carrier Registration → FMCSA Verification → Financial Setup (PLAID INTEGRATION)
```

**Step 2: Financial Setup - Plaid Link Initialization**

**User Interface Flow:**

1. **Banking Setup Options Screen**

   ```
   ┌─────────────────────────────────────────────────────┐
   │ FleetFlow Carrier Onboarding - Step 2 of 5         │
   │ Financial Setup                                     │
   │                                                     │
   │ Banking Information Required                        │
   │ We need your business banking details for ACH       │
   │                                                     │
   │ Choose your setup method:                           │
   │                                                     │
   │ ┌─────────────────────────────────────────────────┐ │
   │ │ 🏦 INSTANT SETUP (Recommended)                  │ │
   │ │ Connect your bank account securely with Plaid   │ │
   │ │ ✓ Instant verification                          │ │
   │ │ ✓ No voided check needed                        │ │
   │ │ ✓ Bank-level security                           │ │
   │ │                                                 │ │
   │ │ [🔗 Connect Bank Account with Plaid]            │ │
   │ └─────────────────────────────────────────────────┘ │
   │                                                     │
   │ ┌─────────────────────────────────────────────────┐ │
   │ │ 📄 TRADITIONAL SETUP                            │ │
   │ │ Upload voided check (3-5 days processing)       │ │
   │ │ [📁 Upload Voided Check]                        │ │
   │ └─────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────┘
   ```

2. **Plaid Link Modal Launch**

   ```
   ┌─────────────────────────────────────────────────────┐
   │ Connect your account                                │
   │                                                     │
   │ 🔍 Search for your bank                            │
   │ [Search for your bank or credit union...]          │
   │                                                     │
   │ Popular Banks:                                      │
   │ 🏦 Chase                                           │
   │ 🏦 Bank of America                                 │
   │ 🏦 Wells Fargo                                     │
   │ 🏦 Citibank                                        │
   │                                                     │
   │ 🔒 Your credentials are encrypted                  │
   │ FleetFlow cannot see your login info               │
   └─────────────────────────────────────────────────────┘
   ```

3. **Bank Authentication Screen**

   ```
   ┌─────────────────────────────────────────────────────┐
   │ Chase Online Banking                                │
   │                                                     │
   │ Username or Email                                   │
   │ [________________________________]                 │
   │                                                     │
   │ Password                                            │
   │ [________________________________]                 │
   │                                                     │
   │ [Sign In]  [Cancel]                                │
   │                                                     │
   │ 🛡️ This connection is secured by Plaid            │
   │ FleetFlow cannot access your login credentials      │
   └─────────────────────────────────────────────────────┘
   ```

4. **Account Selection Screen**

   ```
   ┌─────────────────────────────────────────────────────┐
   │ Select Account                                      │
   │                                                     │
   │ Choose which account to connect:                    │
   │                                                     │
   │ ○ Chase Business Complete Banking                   │
   │   Account ending in 1234                           │
   │   Available balance: $15,234.56                    │
   │                                                     │
   │ ○ Chase Business Savings                           │
   │   Account ending in 5678                           │
   │   Available balance: $45,123.89                    │
   │                                                     │
   │ [Continue]  [Back]                                 │
   └─────────────────────────────────────────────────────┘
   ```

5. **Successful Connection Confirmation**
   ```
   ┌─────────────────────────────────────────────────────┐
   │ ✅ Success!                                        │
   │                                                     │
   │ Your Chase Business Complete Banking                │
   │ account has been connected successfully.            │
   │                                                     │
   │ Account: ****1234                                  │
   │ Routing: 021000021                                 │
   │                                                     │
   │ You can now receive ACH payments                    │
   │ instantly with no processing delays.                │
   │                                                     │
   │ [Continue to Next Step]                            │
   └─────────────────────────────────────────────────────┘
   ```

### **Complete User Journey Flow**

```
START: Carrier Registration
│
├── Step 1: FMCSA Verification (DOT/MC Numbers)
│
├── Step 2: Document Upload Phase
│
├── Step 3: Financial Setup *** PLAID INTEGRATION POINT ***
│   │
│   ├── Option A: Plaid Link Integration
│   │   ├── Bank Search & Selection
│   │   ├── Secure Bank Authentication
│   │   ├── Account Selection
│   │   └── Instant ACH Verification ✅
│   │
│   └── Option B: Traditional Voided Check Upload
│       └── Manual Processing (3-5 days)
│
├── Step 4: Factoring Setup (Optional)
│
├── Step 5: Agreement Signing (Digital)
│
├── Step 6: Portal Access Setup
│
└── END: Onboarding Complete → Operations Ready
```

---

## 3. **Technical Implementation Details**

### **Plaid Configuration**

- **Client ID**: `68a801029ea54d0022a62020`
- **Environment**: Sandbox (ready for production)
- **Products**: Transactions, Auth, Identity
- **Webhook URL**: Configured for compliance monitoring

### **Security & Compliance Controls**

- **Encryption**: AES-256 (data at rest), TLS 1.3+ (data in transit)
- **Data Retention**: 7 years (SOX compliance)
- **User Consent**: Explicit consent with data usage explanation
- **Data Subject Rights**: Automated deletion and export capabilities

### **Integration Service Location**

- **Backend Service**: `app/services/PlaidService.ts`
- **Frontend Integration**: `app/onboarding/carrier-onboarding/components/`
- **API Endpoints**: `/api/plaid/compliance-status`, `/api/plaid/data-deletion`

---

## 4. **Business Context & Use Case**

### **Primary Use Case**

FleetFlow integrates Plaid to streamline the carrier onboarding process by:

- Eliminating 3-5 day manual ACH setup delays
- Providing instant bank account verification
- Reducing onboarding friction for transportation companies
- Maintaining enterprise-grade security and compliance

### **Target Users**

- **Transportation Companies**: Trucking fleets, owner-operators
- **Freight Brokers**: Companies managing carrier networks
- **Logistics Providers**: Multi-modal transportation services

### **Data Usage Purpose**

Financial data is used exclusively for:

- ACH payment processing for transportation services
- 7-year SOX-compliant financial record retention
- Transportation business management and operations

---

## 5. **Compliance Documentation**

### **Comprehensive Compliance Framework**

FleetFlow maintains enterprise-grade compliance with:

- **GDPR (European Union)**: Articles 15, 17, 20, 28, 35 ✅
- **CCPA (California)**: Sections 1798.105, 1798.110, 1798.115 ✅
- **SOX (Sarbanes-Oxley)**: 7-year financial record retention ✅
- **Banking Regulations**: ACH and financial data protection ✅
- **DOT Regulations**: Transportation industry compliance ✅

### **Data Subject Rights Implementation**

- **Right to Access**: 30-day response with complete data inventory
- **Right to Deletion**: Automated processing within 30 days
- **Right to Portability**: Machine-readable data exports
- **Right to Rectification**: Real-time data correction capabilities

---

## 6. **Production Readiness Certification**

FleetFlow Technologies, Inc. hereby certifies full compliance with all Plaid requirements:

✅ **Comprehensive Data Governance Framework** ✅ **Automated Technical Controls** ✅ **Complete
Regulatory Compliance** ✅ **Plaid-Specific Requirements Met** ✅ **Operational Excellence
Standards**

### **Compliance Status**: 100% Ready for Production Deployment

---

## 7. **Contact Information**

### **Primary Contacts**

- **Chief Privacy Officer**: privacy@fleetflowapp.com
- **Data Protection Officer**: dpo@fleetflowapp.com
- **Legal Compliance Team**: legal@fleetflowapp.com

### **Company Information**

- **Organization Website**: https://fleetflowapp.com
- **Privacy Policy**: https://fleetflowapp.com/privacy
- **Technical Documentation**: Complete implementation guides available

---

## 8. **Next Steps**

FleetFlow is fully prepared for Plaid production access with:

- Complete compliance documentation package
- Comprehensive user flow wireframes and technical specifications
- Enterprise-grade security controls operational
- Automated compliance monitoring systems active

We appreciate Plaid's thorough risk assessment process and look forward to enabling seamless
financial services for the transportation industry.

---

**Document Status**: FINAL - Ready for Plaid Risk Team Review **Prepared By**: FleetFlow
Technologies, Inc. **Date**: December 2024

---

_This document provides comprehensive information for Plaid's KYC diligence process. All systems are
operational and ready to support secure financial integration in production environment._
