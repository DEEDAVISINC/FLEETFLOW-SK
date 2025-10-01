# 🏗️ FleetFlow Multi-Tenant Architecture
## Complete Three-Party System Structure

**FleetFlow TMS LLC - Enterprise Multi-Tenant SaaS Platform**

---

## 🎯 CRITICAL UNDERSTANDING

### **FleetFlow is a PLATFORM, not a service provider**

```
┌─────────────────────────────────────────────────────────────┐
│                    FLEETFLOW TMS LLC                         │
│              (Software Platform Provider)                    │
│                                                              │
│  Provides: Software, Infrastructure, Support                │
│  Does NOT: Handle freight, book shipments, provide services │
│  Liability: Limited to platform functionality               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Platform License
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    TENANT (Your Company)                     │
│            ABC Freight Forwarding LLC                        │
│                                                              │
│  Uses: FleetFlow platform to manage business                │
│  Provides: Freight forwarding services to clients           │
│  Liability: Full liability for freight services             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Freight Service Contract
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                TENANT'S CLIENT (Your Customer)               │
│                  XYZ Manufacturing Corp                      │
│                                                              │
│  Receives: Freight services from Tenant (not FleetFlow)     │
│  Contracts: With Tenant (using Tenant's legal contracts)    │
│  Payments: To Tenant (FleetFlow only charges platform fees) │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 TWO TYPES OF CONTRACTS

### **1. Platform Contract** (FleetFlow ↔ Tenant)

**Contract Between**: FleetFlow TMS LLC and Tenant  
**Purpose**: Software subscription and platform usage  
**Covers**: SaaS fees, platform SLA, data ownership, support  
**Liability**: Limited to platform fees and service availability  

**Example**:
```
PARTIES:
- FleetFlow TMS LLC (Platform Provider)
- ABC Freight Forwarding LLC (Tenant/Subscriber)

TERMS:
- Monthly Fee: $799 (Professional Plan)
- Transaction Fee: $3 per shipment
- Platform Uptime: 99.9% guaranteed
- Data Ownership: Tenant owns their data
- Support: 24-hour response for critical issues
- Liability: Limited to 12 months of fees
```

### **2. Freight Service Contract** (Tenant ↔ Client)

**Contract Between**: Tenant and Tenant's Client  
**Purpose**: Freight forwarding/brokerage services  
**Covers**: Freight services, rates, liability, payment terms  
**Liability**: Tenant assumes full liability for freight services  

**Example**:
```
PARTIES:
- ABC Freight Forwarding LLC (Tenant - using FleetFlow)
- XYZ Manufacturing Corp (Tenant's Client)

TERMS:
- Service: Ocean freight from China to USA
- Rates: $2,800 per 40ft container
- Payment: NET 30 days
- Liability: COGSA limits ($500/package)
- Forwarder: ABC Freight (powered by FleetFlow)
```

---

## 🏢 MULTI-TENANT DATA ISOLATION

### **Each Tenant Has Separate:**

| Data Type | Isolation Method | Example |
|-----------|------------------|---------|
| **CRM Contacts** | `tenant_id` field | ABC Forwarding can't see XYZ Forwarding's contacts |
| **Contracts** | `tenant_id` field | Each tenant's contracts isolated |
| **Shipments** | `tenant_id` field | Tenant A's shipments separate from Tenant B |
| **Documents** | Tenant folders | `/tenants/ABC123/documents/` |
| **Users** | Tenant association | Users belong to one tenant only |
| **Settings** | Tenant-specific | Each tenant has own branding/settings |
| **Reports** | Tenant-filtered | Only see your own data |

### **Database Schema Example:**

```sql
-- All tables include tenant_id for isolation
CREATE TABLE ff_contacts (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) NOT NULL,  -- CRITICAL: Isolates data by tenant
  contact_code VARCHAR(15),
  company_name VARCHAR(255),
  -- ... other fields
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_code (tenant_id, contact_code)
);

CREATE TABLE ff_contracts (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) NOT NULL,  -- CRITICAL: Isolates data by tenant
  contract_number VARCHAR(30),
  client_contact_id VARCHAR(50),   -- Reference to tenant's CRM
  -- ... other fields
  INDEX idx_tenant (tenant_id)
);

CREATE TABLE ff_shipments (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) NOT NULL,  -- CRITICAL: Isolates data by tenant
  shipment_number VARCHAR(30),
  shipper_contact_id VARCHAR(50),  -- Tenant's CRM contact
  consignee_contact_id VARCHAR(50),-- Tenant's CRM contact
  -- ... other fields
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_shipment (tenant_id, shipment_number)
);

-- Platform contracts (FleetFlow ↔ Tenant)
CREATE TABLE platform_contracts (
  id UUID PRIMARY KEY,
  tenant_id VARCHAR(50) NOT NULL,
  subscription_plan VARCHAR(30),
  monthly_fee DECIMAL(10,2),
  status VARCHAR(20),
  -- ... FleetFlow subscription terms
  INDEX idx_tenant (tenant_id)
);
```

---

## 💰 REVENUE MODEL

### **FleetFlow Revenue:**

1. **Monthly Subscription Fees**
   - STARTER: $299/month
   - PROFESSIONAL: $799/month
   - ENTERPRISE: $1,999/month

2. **Transaction Fees**
   - STARTER: $5 per shipment
   - PROFESSIONAL: $3 per shipment
   - ENTERPRISE: $1 per shipment

3. **Setup Fees** (one-time)
   - PROFESSIONAL: $500
   - ENTERPRISE: $1,500

4. **Add-On Services**
   - Custom development
   - Additional user licenses
   - API access
   - White-label premium features
   - Priority support

### **Tenant Revenue:**

Tenants charge THEIR clients for freight services:
- Ocean freight rates
- Air freight rates
- Customs clearance fees
- Documentation fees
- Warehouse fees
- Markup/commission

**Example Tenant Revenue Model:**
```
Tenant (ABC Forwarding) provides services to XYZ Manufacturing:
- 40ft container China → USA: $2,800
- Customs clearance: $300
- Documentation: $150
- TOTAL CLIENT PAYS: $3,250

Tenant costs:
- Carrier cost: $2,400
- Customs broker: $200
- FleetFlow platform: $799/month + $3/shipment
- TENANT PROFIT: ~$647 per shipment

FleetFlow earns: $799/month + $3/shipment
Tenant earns: ~$647 per shipment (or more)
```

---

## 🔐 SECURITY & COMPLIANCE

### **Platform-Level Security (FleetFlow's Responsibility):**

✅ Infrastructure security (AWS/Azure)
✅ Encryption (256-bit SSL)
✅ Multi-factor authentication
✅ Daily backups
✅ Intrusion detection
✅ SOC 2 Type II certification
✅ GDPR/CCPA compliance
✅ Data isolation between tenants
✅ Role-based access control

### **Tenant-Level Security (Tenant's Responsibility):**

✅ User password management
✅ Access control for their team
✅ Client data confidentiality
✅ Document security
✅ Compliance with industry regulations
✅ Insurance requirements

---

## 📊 COMPLETE DATA FLOW EXAMPLE

### **Scenario: Tenant Creates Shipment for Client**

```
1. TENANT SETUP (One-time)
   ├─ ABC Forwarding signs up for FleetFlow
   ├─ Signs Platform Contract with FleetFlow
   ├─ Pays $799/month (Professional Plan)
   ├─ Gets tenant_id: "ABC123"
   └─ Platform access granted

2. TENANT ADDS CLIENT TO CRM
   ├─ ABC adds XYZ Manufacturing to THEIR CRM
   ├─ Record saved with tenant_id: "ABC123"
   ├─ Creates contract: ABC ↔ XYZ (freight services)
   └─ Uses FleetFlow contract templates (customized for ABC)

3. TENANT CREATES SHIPMENT
   ├─ ABC creates shipment in FleetFlow platform
   ├─ Shipment data includes:
   │  ├─ tenant_id: "ABC123" (automatic)
   │  ├─ shipper_id: "SHP001" (from ABC's CRM)
   │  ├─ consignee_id: "CNE002" (XYZ - from ABC's CRM)
   │  ├─ bill_of_lading: "BL20250130..."
   │  └─ cargo_value: $50,000
   └─ Shipment isolated to ABC's tenant

4. AUTOMATED NOTIFICATIONS
   ├─ FleetFlow sends emails (on ABC's behalf)
   ├─ From: notifications@abcforwarding.com (white-label)
   ├─ To: XYZ Manufacturing (ABC's client)
   ├─ Content: "Your shipment BL20250130... has departed"
   └─ Branded with ABC's logo and colors

5. BILLING
   ├─ FleetFlow bills ABC:
   │  ├─ Monthly fee: $799
   │  └─ Transaction fee: $3 (for this shipment)
   ├─ ABC bills XYZ Manufacturing:
   │  └─ Freight services: $3,250
   └─ FleetFlow NEVER bills XYZ (they're not FleetFlow's customer)

6. LIABILITY
   ├─ If cargo damaged: ABC liable to XYZ (per their contract)
   ├─ If platform down: FleetFlow liable to ABC (per platform SLA)
   └─ FleetFlow NOT liable for cargo issues
```

---

## 🎯 CONTRACT TEMPLATE USAGE

### **For Platform Contracts** (FleetFlow ↔ Tenant)

Use: `FLEETFLOW_PLATFORM_TERMS_OF_SERVICE.md`

**Parties:**
- FleetFlow TMS LLC (Platform Provider)
- Tenant Company (Your freight forwarding company)

**Purpose:** SaaS subscription, platform usage, data ownership

### **For Freight Service Contracts** (Tenant ↔ Client)

Use: `FreightForwarderContractTemplates.ts`

**Parties:**
- **Forwarder**: Tenant Company (e.g., ABC Forwarding)
- **Client**: Tenant's Customer (e.g., XYZ Manufacturing)

**Purpose:** Freight forwarding services, rates, liability

**Template Usage:**
```typescript
import FreightForwarderContractTemplates from '@/services/FreightForwarderContractTemplates';

// This generates contract between TENANT and TENANT'S CLIENT
// NOT between FleetFlow and anyone
const terms = FreightForwarderContractTemplates.generateContractTerms(
  'CLIENT_SERVICE_AGREEMENT'
);

// Customize forwarder info with TENANT's information
const contract = {
  forwarder: {
    companyName: 'ABC Freight Forwarding LLC',  // ← TENANT (not FleetFlow)
    legalName: 'ABC Freight Forwarding LLC',
    address: 'ABC\'s address',
    taxId: 'ABC\'s tax ID',
    // ... ABC's information
  },
  client: {
    companyName: 'XYZ Manufacturing Corp',      // ← TENANT'S CLIENT
    // ... client information
  },
  // Contract terms apply between ABC and XYZ
  termsAndConditions: terms.termsAndConditions,
  // ... rest of contract
};
```

---

## 📱 WHITE LABEL FEATURES

### **Professional & Enterprise Plans Include:**

✅ **Custom Branding**
- Your company logo
- Your color scheme
- Your brand identity

✅ **Custom Domain**
- platform.yourcompany.com
- No "FleetFlow" in URL

✅ **Custom Emails**
- notifications@yourcompany.com
- support@yourcompany.com
- From: "Your Company Name"

✅ **Custom Client Portal**
- Clients log in to YOUR branded portal
- See YOUR company name (not FleetFlow)
- YOUR contact information displayed

✅ **Powered By Hidden**
- No "Powered by FleetFlow" (Enterprise plan)
- Complete white-label experience

---

## 🔄 MIGRATION & ONBOARDING

### **New Tenant Onboarding Process:**

```
1. SIGN UP
   ├─ Choose subscription plan
   ├─ Provide company information
   ├─ Accept Platform Terms of Service
   └─ Pay setup fee + first month

2. ACCOUNT SETUP
   ├─ Tenant account created (unique tenant_id)
   ├─ Admin user created
   ├─ Welcome email sent
   └─ Training materials provided

3. CONFIGURATION
   ├─ Upload company logo
   ├─ Configure branding colors
   ├─ Set up custom domain (optional)
   ├─ Configure email settings
   └─ Set timezone and currency

4. DATA IMPORT
   ├─ Import existing contacts (CSV)
   ├─ Import existing contracts (if any)
   ├─ Configure rate tables
   └─ Set up integrations

5. TEAM SETUP
   ├─ Add team members
   ├─ Assign roles and permissions
   ├─ Send invitations
   └─ Conduct training session

6. GO LIVE
   ├─ Create first shipment
   ├─ Test notifications
   ├─ Generate first invoice
   └─ Officially operational
```

---

## 💡 EXAMPLES BY TENANT TYPE

### **Example 1: Freight Forwarder Tenant**

**Tenant**: Global Logistics Solutions LLC  
**Tenant ID**: GLS789456  
**Plan**: Enterprise ($1,999/month)

**Their Clients:**
- Walmart (imports from China)
- Apple (imports electronics)
- Tesla (imports car parts)

**Platform Usage:**
- Manage 500+ shipments/month
- 25 employees using platform
- White-label branding
- Custom domain: portal.globallogistics.com
- Revenue: $5M/year from freight services

**FleetFlow Revenue from this Tenant:**
- Monthly: $1,999 + (500 × $1) = $2,499
- Annual: ~$30,000

### **Example 2: Freight Broker Tenant**

**Tenant**: Midwest Freight Brokers Inc  
**Tenant ID**: MFB123789  
**Plan**: Professional ($799/month)

**Their Clients:**
- Local manufacturers
- Regional shippers
- SMB importers

**Platform Usage:**
- Manage 150 shipments/month
- 8 employees using platform
- Custom logo and colors
- Revenue: $800K/year from brokerage

**FleetFlow Revenue from this Tenant:**
- Monthly: $799 + (150 × $3) = $1,249
- Annual: ~$15,000

### **Example 3: Small 3PL Tenant**

**Tenant**: QuickShip Express  
**Tenant ID**: QSE456123  
**Plan**: Starter ($299/month)

**Their Clients:**
- E-commerce businesses
- Amazon sellers
- Small importers

**Platform Usage:**
- Manage 50 shipments/month
- 3 employees using platform
- Basic features
- Revenue: $200K/year

**FleetFlow Revenue from this Tenant:**
- Monthly: $299 + (50 × $5) = $549
- Annual: ~$6,600

---

## 📞 SUPPORT STRUCTURE

### **FleetFlow Provides Support To:**

✅ **TENANTS** (freight forwarders using the platform)
- Technical support
- Platform training
- Feature requests
- Bug reports

### **Tenants Provide Support To:**

✅ **THEIR CLIENTS** (shippers/consignees)
- Shipment status updates
- Quote requests
- Documentation questions
- Freight service issues

### **Support Flow:**

```
CLIENT (XYZ Manufacturing)
     │
     │ Question about shipment status
     ▼
TENANT (ABC Forwarding) ← Tenant handles client questions
     │
     │ If platform issue
     ▼
FLEETFLOW SUPPORT ← FleetFlow helps with platform issues
```

---

## 🎯 KEY TAKEAWAYS

### **1. FleetFlow Role**
- ✅ Provides SOFTWARE PLATFORM
- ✅ Charges subscription fees
- ✅ Supports TENANTS (not end clients)
- ❌ Does NOT provide freight services
- ❌ Does NOT contract with tenants' clients
- ❌ Has NO liability for cargo/freight

### **2. Tenant Role**
- ✅ Uses FleetFlow platform for their business
- ✅ Provides freight services to THEIR clients
- ✅ Has contracts with THEIR clients
- ✅ Has FULL liability for freight services
- ✅ Charges freight rates to their clients
- ✅ Pays FleetFlow subscription fees

### **3. Client Role**
- ✅ Receives freight services from TENANT
- ✅ Contracts with TENANT (not FleetFlow)
- ✅ Pays TENANT for freight services
- ✅ May not even know FleetFlow exists (white-label)

---

## 📊 SUMMARY DIAGRAM

```
┌──────────────────────────────────────────────────────┐
│           FLEETFLOW TMS LLC (Platform)               │
│                                                      │
│  • Provides: Software infrastructure                │
│  • Charges: $299-$1,999/month + per-shipment       │
│  • Liability: Platform SLA only                     │
│  • NOT involved in freight operations               │
└──────────────────────────────────────────────────────┘
                    │
                    │ Platform License Agreement
                    │ (Platform Terms of Service)
                    ▼
┌──────────────────────────────────────────────────────┐
│       TENANT: ABC Freight Forwarding LLC             │
│             (Using FleetFlow Platform)               │
│                                                      │
│  • Uses: FleetFlow to manage business               │
│  • Provides: Freight forwarding services            │
│  • Charges: Freight rates to clients                │
│  • Liability: Full freight liability                │
└──────────────────────────────────────────────────────┘
                    │
                    │ Freight Service Agreement
                    │ (Tenant's Contract with Client)
                    ▼
┌──────────────────────────────────────────────────────┐
│      CLIENT: XYZ Manufacturing Corp                  │
│         (ABC Forwarding's Customer)                  │
│                                                      │
│  • Receives: Freight services from ABC              │
│  • Pays: ABC for freight services                   │
│  • Has NO relationship with FleetFlow               │
└──────────────────────────────────────────────────────┘
```

---

**FleetFlow TMS LLC**  
Multi-Tenant SaaS Platform for Freight Industry  
**WOSB Certified** • **SOC 2 Certified**

*We provide the platform. You provide the freight services.*
