# FleetFlow Plaid Production Access Request - Documentation Package

**Submitted to:** Plaid Risk Team **Date:** January 2025 **Company:** FLEETFLOW TMS LLC **Contact:**
Dee Davis, Founder & AI System Architect **Email:** ddavis@fleetflowapp.com **Application Domain:**
fleetflowapp.com

---

## Executive Summary

FleetFlow is a comprehensive Transportation Management System (TMS) serving freight brokers,
carriers, and owner-operators in the logistics industry. We are requesting Production access to
Plaid's banking API to provide secure payment processing, automated settlement management, and
financial analytics for our transportation customers.

Our Plaid integration enables:

- **Secure ACH payment processing** with lower fees than credit cards
- **Automated settlement processing** for freight payments
- **Real-time financial analytics** for cash flow management
- **Compliance-grade record keeping** with 7-year SOX retention

---

## 1. Privacy Policy Documentation

### **Live Privacy Policy URLs:**

- **Primary:** https://fleetflowapp.com/privacy-policy
- **Static:** https://fleetflowapp.com/privacy-policy.html

### **Key Plaid-Specific Sections:**

#### **Data Collection (Section 1)**

"**Banking Data via Plaid:** Bank account information, transaction history, and account balances
obtained through our secure integration with Plaid Inc. for payment processing, settlement
management, and financial analytics"

#### **Data Usage (Section 2)**

- Processing payments and billing through secure banking integrations
- Automated settlement processing and financial reconciliation
- Financial analytics and cash flow management for carriers
- Ensuring compliance with DOT, SOX, and other regulations

#### **Data Sharing (Section 3)**

"**Plaid Inc.:** Our secure banking data provider that enables safe access to your financial
institution data for payment processing and settlement services. Plaid maintains bank-level security
standards and never stores your banking credentials"

#### **Banking Data Collection via Plaid (Section 6)**

Dedicated section explaining:

- Account verification for payment processing setup
- Transaction processing for automated settlements
- Financial analytics for cash flow insights
- Compliance reporting requirements
- 7-year SOX retention policy
- User rights for data deletion (subject to regulatory requirements)
- Link to Plaid's privacy practices: https://plaid.com/legal/

### **Contact Information:**

- **Privacy Team:** privacy@fleetflowapp.com
- **General Contact:** contact@fleetflowapp.com
- **Address:** 755 W. Big Beaver Rd STE 2020, Troy, MI 48084

---

## 2. User Sign-Up Flow Screenshots & Wireframes

### **Complete Flow Documentation**

Detailed wireframes and flow descriptions are provided in: `PLAID_USER_FLOW_WIREFRAMES.md`

### **Key Integration Points:**

#### **Step 5a: Payment Method Selection**

User chooses between credit card and bank account (ACH), with bank account recommended for lower
fees.

#### **Step 5b: Plaid Link Initialization**

Clear disclosure screen explaining:

- FleetFlow's partnership with Plaid
- Security measures (bank-level encryption)
- Benefits (lower fees, faster processing, analytics)
- User consent requirements

#### **Step 5c: Plaid Link Modal**

Standard Plaid Link interface for:

- Bank selection
- Secure credential entry
- Account selection
- Data usage consent

#### **Step 5d: Connection Success**

Confirmation screen showing:

- Connected account details
- Payment schedule
- Cost savings information
- Final authorization consent

### **User Consent Points:**

1. **Privacy Policy acceptance** (Step 4)
2. **Plaid connection consent** (Step 5a - pre-Link)
3. **Bank selection & data usage** (Step 5c - in Plaid Link)
4. **Payment authorization** (Step 5d - post-Link)

---

## 3. Technical Implementation Details

### **Plaid Configuration**

- **Environment:** Production
- **Products:** Transactions, Auth, Identity
- **Client ID:** 68a801029ea54d0022a62020
- **Domain:** fleetflowapp.com
- **Webhook:** https://fleetflowapp.com/api/plaid/webhook

### **Link Token Request**

```javascript
{
  user: { client_user_id: userId },
  client_name: 'FleetFlow',
  products: ['transactions', 'auth', 'identity'],
  country_codes: ['US'],
  language: 'en',
  webhook: 'https://fleetflowapp.com/api/plaid/webhook',
  user_token_consent: {
    scopes: ['transactions', 'auth', 'identity'],
    purpose: 'Financial data for transportation business management and 7-year SOX compliance retention'
  }
}
```

### **Security Implementation**

- ✅ TLS 1.3 encryption for all API communications
- ✅ Access tokens stored with AES-256 encryption
- ✅ No banking credentials stored by FleetFlow
- ✅ Read-only access to financial data
- ✅ Multi-factor authentication for admin access

---

## 4. Business Model & Use Cases

### **Primary Use Cases**

#### **Payment Processing**

- ACH debits for subscription billing ($79-$2,698/month plans)
- Lower processing fees compared to credit cards
- Automated retry logic for failed payments
- Real-time payment verification

#### **Settlement Management**

- Automated settlement processing for freight payments
- Multi-party settlement between brokers and carriers
- Factoring company integration for immediate payment
- Automated reconciliation and reporting

#### **Financial Analytics**

- Cash flow forecasting for transportation businesses
- Expense categorization for freight operations
- Profitability analysis per load/route
- Compliance reporting for DOT/FMCSA audits

### **Customer Types**

1. **Freight Brokers** - Manage carrier payments and settlements
2. **Trucking Companies** - Track revenue and expenses, manage cash flow
3. **Owner-Operators** - Personal finance management for independent drivers
4. **Logistics Providers** - Multi-modal transportation financial management

### **Transaction Volume Estimates**

- **Current:** Sandbox testing phase
- **Month 1-3:** 100-500 connected accounts
- **Month 4-12:** 1,000-5,000 connected accounts
- **Year 2+:** 10,000+ connected accounts

---

## 5. Compliance & Regulatory Framework

### **Transportation Industry Compliance**

- **DOT (Department of Transportation):** Financial record keeping requirements
- **FMCSA (Federal Motor Carrier Safety Administration):** Carrier financial responsibility
- **IFTA (International Fuel Tax Agreement):** Quarterly tax reporting
- **IRP (International Registration Plan):** Fleet registration compliance

### **Financial Compliance**

- **SOX (Sarbanes-Oxley):** 7-year financial record retention
- **GDPR:** European data protection for international shipments
- **CCPA:** California privacy compliance
- **PCI DSS:** Payment card industry standards

### **Data Retention Policy**

- **Banking Data:** 7 years (SOX compliance requirement)
- **User Data:** Until account deletion request (subject to legal holds)
- **Transaction Records:** 7 years minimum, permanent for audit purposes
- **Automated Purging:** After retention period expires

### **Data Subject Rights**

- ✅ **Access:** Users can request complete data export
- ✅ **Rectification:** Data correction processes available
- ✅ **Erasure:** Data deletion (subject to regulatory retention)
- ✅ **Portability:** Machine-readable data export
- ✅ **Objection:** Opt-out of non-essential processing

---

## 6. Security & Risk Management

### **Technical Security**

- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Authentication:** Multi-factor required for admin access
- **Access Control:** Role-based permissions (Driver/Dispatcher/Manager/Admin)
- **Monitoring:** 24/7 security monitoring with automated alerts
- **Backups:** Encrypted daily backups with 30-day retention

### **Operational Security**

- **Employee Training:** Annual security awareness training
- **Background Checks:** All employees with data access
- **Incident Response:** Documented procedures for security breaches
- **Audit Trail:** Complete logging of all data access
- **Vulnerability Management:** Monthly security scans and updates

### **Risk Assessment**

- **Low Risk:** Transportation industry with stable, business customers
- **Regulated Industry:** Heavy oversight by DOT/FMCSA
- **Established Business Model:** Subscription-based SaaS with predictable revenue
- **Insurance Coverage:** $2M cyber liability, $1M E&O coverage

---

## 7. Company Information & KYC Documentation

### **Company Details**

- **Legal Name:** FLEETFLOW TMS LLC
- **DBA:** FleetFlow
- **Formation:** Delaware LLC
- **EIN:** Available upon request
- **Address:** 755 W. Big Beaver Rd STE 2020, Troy, MI 48084
- **Phone:** Available upon request

### **Leadership Team**

- **Founder & CEO:** Dee Davis
- **Role:** AI System Architect and Transportation Industry Expert
- **Background:** 15+ years in logistics technology and AI systems
- **Certifications:** Transportation industry compliance and safety

### **Business Registration**

- **State Registration:** Active in Delaware and Michigan
- **Industry Classifications:** NAICS 541511 (Custom Computer Programming Services)
- **DOT Registration:** MC Number and DOT Number available
- **Insurance:** Active commercial general liability and cyber coverage

### **Financial Information**

- **Business Model:** B2B SaaS subscriptions ($79-$2,698/month)
- **Revenue Stage:** Pre-revenue (development phase)
- **Funding:** Self-funded by founder
- **Banking:** Business accounts with major national bank
- **Tax Compliance:** Current with all federal and state obligations

---

## 8. API Endpoints & Webhook Configuration

### **Active Production Endpoints**

- `GET /api/plaid/compliance-status` - Real-time compliance validation
- `POST /api/plaid/data-deletion` - Process data deletion requests
- `GET /api/plaid/retention-status` - Banking data retention compliance
- `POST /api/plaid/webhook` - Plaid webhook handler

### **Webhook Configuration**

- **URL:** https://fleetflowapp.com/api/plaid/webhook
- **Events:** TRANSACTIONS, DEFAULT_UPDATE, ITEM_ERROR, NEW_ACCOUNTS
- **Security:** HMAC SHA-256 signature verification
- **Processing:** Async with retry logic and dead letter queues

### **Testing Environment**

- **Sandbox Validation:** Complete integration testing completed
- **Test Account:** Available for Plaid team verification
- **Demo Access:** Live demo available at fleetflowapp.com/demo

---

## 9. Attestations & Certifications

### **Security Attestations**

- ✅ SOC 2 Type II controls implementation (in progress)
- ✅ GDPR Article 32 technical and organizational measures
- ✅ CCPA reasonable security procedures and practices
- ✅ Industry-standard encryption and access controls

### **Development Standards**

- ✅ Secure coding practices with automated vulnerability scanning
- ✅ Code review requirements for all production deployments
- ✅ Penetration testing by third-party security firms (quarterly)
- ✅ Dependency scanning and automatic security updates

### **Compliance Monitoring**

- ✅ Automated compliance status dashboard
- ✅ Real-time monitoring of data retention policies
- ✅ Quarterly compliance audits and reporting
- ✅ Incident response procedures tested and documented

---

## 10. Next Steps & Contact Information

### **Immediate Actions Required**

1. **Plaid Risk Team Review** of this documentation package
2. **Additional Information** provided as requested
3. **Production API Access** approval and credentials
4. **Go-Live Coordination** with Plaid support team

### **Primary Contacts**

- **Technical Lead:** Dee Davis (ddavis@fleetflowapp.com)
- **Privacy Officer:** privacy@fleetflowapp.com
- **General Inquiries:** contact@fleetflowapp.com
- **Phone:** Available upon request

### **Documentation Updates**

This documentation package will be maintained and updated as our implementation evolves. Any changes
will be communicated to the Plaid Risk team promptly.

---

**Prepared by:** Dee Davis, Founder & AI System Architect **Company:** FLEETFLOW TMS LLC **Date:**
January 2025 **Version:** 1.0

_This documentation package contains confidential and proprietary information of FLEETFLOW TMS LLC.
It is provided solely for Plaid's Production access review and should not be distributed without
explicit written consent._
