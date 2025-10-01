# 🚀 Multi-Tenant Implementation Guide
## Step-by-Step Integration for FleetFlow Platform

---

## 🎯 IMPLEMENTATION CHECKLIST

### ✅ **Phase 1: Core Multi-Tenant Services** (COMPLETED)
- [x] MultiTenantFreightForwarderService.ts
- [x] Platform Terms of Service
- [x] Multi-Tenant Architecture Documentation
- [x] Contract Templates (with proper party structure)

### 🔧 **Phase 2: Update Existing Services** (NEXT STEPS)
- [ ] Update FreightForwarderCRMService (add tenant_id)
- [ ] Update FreightForwarderContractService (add tenant_id)
- [ ] Update FreightForwarderAutomationService (add tenant_id)
- [ ] Update FreightForwarderIdentificationService (add tenant_id)

### 🎨 **Phase 3: UI/UX Integration** (FUTURE)
- [ ] Tenant onboarding wizard
- [ ] White-label branding controls
- [ ] Tenant switching (for admins)
- [ ] Subscription management
- [ ] Billing dashboard

---

## 📝 CODE UPDATES REQUIRED

### **1. Update CRM Service for Multi-Tenancy**

```typescript
// app/services/FreightForwarderCRMService.ts

export interface FreightForwarderContact {
  id: string;
  tenantId: string;  // ← ADD THIS
  contactCode: string;
  // ... rest of fields
}

export class FreightForwarderCRMService {
  /**
   * Create new contact (tenant-specific)
   */
  static createContact(
    tenantId: string,  // ← ADD THIS PARAMETER
    contactData: Omit<FreightForwarderContact, 'id' | 'contactCode' | 'tenantId' | ...>
  ): FreightForwarderContact {
    const contact: FreightForwarderContact = {
      ...contactData,
      id: this.generateId(),
      tenantId,  // ← ADD THIS
      contactCode: this.generateContactCode(contactData.type),
      // ... rest of initialization
    };
    
    this.saveContact(contact);
    return contact;
  }
  
  /**
   * Get all contacts for tenant
   */
  static getAllContacts(tenantId: string): FreightForwarderContact[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const allContacts = stored ? JSON.parse(stored) : [];
    
    // Filter by tenant
    return allContacts.filter((c: FreightForwarderContact) => c.tenantId === tenantId);
  }
  
  /**
   * Get contacts by type (tenant-specific)
   */
  static getContactsByType(tenantId: string, type: ContactType): FreightForwarderContact[] {
    return this.getAllContacts(tenantId).filter((c) => c.type === type);
  }
  
  /**
   * Search contacts (tenant-specific)
   */
  static searchContacts(tenantId: string, searchTerm: string): FreightForwarderContact[] {
    const term = searchTerm.toLowerCase();
    return this.getAllContacts(tenantId).filter(
      (c) =>
        c.companyName.toLowerCase().includes(term) ||
        c.contactCode.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }
}
```

### **2. Update Contract Service for Multi-Tenancy**

```typescript
// app/services/FreightForwarderContractService.ts

export interface FreightForwarderContract {
  id: string;
  tenantId: string;  // ← ADD THIS
  contractNumber: string;
  type: ContractType;
  
  // NOTE: forwarder = TENANT (not FleetFlow)
  forwarder: ContractParty;  // This is the tenant's info
  client: ContractParty;     // This is tenant's client
  
  // ... rest of fields
}

export class FreightForwarderContractService {
  /**
   * Create new contract (between tenant and tenant's client)
   */
  static createContract(
    tenantId: string,  // ← ADD THIS PARAMETER
    contractData: Omit<FreightForwarderContract, 'id' | 'contractNumber' | 'tenantId' | ...>
  ): FreightForwarderContract {
    const contract: FreightForwarderContract = {
      ...contractData,
      id: this.generateId(),
      tenantId,  // ← ADD THIS
      contractNumber: this.generateContractNumber(contractData.type),
      // ... rest of initialization
    };
    
    this.saveContract(contract);
    return contract;
  }
  
  /**
   * Get all contracts for tenant
   */
  static getAllContracts(tenantId: string): FreightForwarderContract[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const allContracts = stored ? JSON.parse(stored) : [];
    
    // Filter by tenant
    return allContracts.filter((c: FreightForwarderContract) => c.tenantId === tenantId);
  }
  
  /**
   * Get contracts by client (tenant-specific)
   */
  static getContractsByClient(tenantId: string, contactId: string): FreightForwarderContract[] {
    return this.getAllContracts(tenantId).filter((c) => c.client.contactId === contactId);
  }
}
```

### **3. Update Automation Service for Multi-Tenancy**

```typescript
// app/services/FreightForwarderAutomationService.ts

export interface FreightShipment {
  id: string;
  tenantId: string;  // ← ADD THIS
  shipmentNumber: string;
  mode: 'OCEAN' | 'AIR';
  
  // These are all tenant's CRM contacts
  shipperId: string;
  consigneeId: string;
  notifyPartyIds: string[];
  
  // ... rest of fields
}

export class FreightForwarderAutomationService {
  /**
   * Update milestone (tenant-specific)
   */
  static async updateMilestone(
    tenantId: string,  // ← ADD THIS PARAMETER
    shipmentId: string,
    newMilestone: ShipmentMilestone,
    notes?: string
  ): Promise<void> {
    const shipment = this.getShipmentById(tenantId, shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found for tenant ${tenantId}`);
    }
    
    // Verify shipment belongs to tenant
    if (shipment.tenantId !== tenantId) {
      throw new Error('Unauthorized access to shipment');
    }
    
    // ... rest of milestone update logic
  }
  
  /**
   * Get shipment (tenant-specific)
   */
  static getShipmentById(tenantId: string, shipmentId: string): FreightShipment | null {
    const shipments = this.getAllShipments(tenantId);
    return shipments.find((s) => s.id === shipmentId) || null;
  }
  
  /**
   * Get all shipments for tenant
   */
  static getAllShipments(tenantId: string): FreightShipment[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const allShipments = stored ? JSON.parse(stored) : [];
    
    // Filter by tenant
    return allShipments.filter((s: FreightShipment) => s.tenantId === tenantId);
  }
}
```

### **4. Update Identification Service for Multi-Tenancy**

```typescript
// app/services/FreightForwarderIdentificationService.ts

export interface FreightForwarderShipment {
  // Add tenant context
  tenantId: string;  // ← ADD THIS
  tenantCode: string;  // e.g., "ABC" from ABC Forwarding
  
  mode: Mode;
  // ... rest of fields
}

export interface GeneratedFreightIdentifiers {
  shipmentId: string;  // Now includes tenant code: ABC-OCN-2025-0001
  quoteNumber: string;
  // ... rest of identifiers
  
  tenantId: string;  // ← ADD THIS
}

export class FreightForwarderIdentificationService {
  /**
   * Generate identifiers with tenant context
   */
  static generateIdentifiers(
    tenantId: string,  // ← ADD THIS PARAMETER
    tenantCode: string,  // ← ADD THIS (e.g., "ABC")
    shipment: FreightForwarderShipment
  ): GeneratedFreightIdentifiers {
    const timestamp = new Date();
    const sequence = this.getNextSequence(tenantId);  // ← Tenant-specific sequence
    
    // Generate shipment ID with tenant code
    const modeCode = this.getModeCode(shipment.mode);
    const year = new Date(shipment.bookingDate).getFullYear();
    const shipmentId = `${tenantCode}-${modeCode}-${year}-${sequence.toString().padStart(4, '0')}`;
    
    // ... rest of generation logic
    
    return {
      shipmentId,
      quoteNumber,
      bookingNumber,
      // ... rest of identifiers
      tenantId,  // ← ADD THIS
      generatedAt: timestamp.toISOString(),
    };
  }
  
  /**
   * Get next sequence number (tenant-specific)
   */
  private static getNextSequence(tenantId: string): number {
    if (typeof window === 'undefined') {
      return Math.floor(1 + Math.random() * 9999);
    }
    
    const key = `${tenantId}_${this.SHIPMENT_SEQUENCE_KEY}`;
    const stored = localStorage.getItem(key);
    const current = stored ? parseInt(stored, 10) : 0;
    const next = current + 1;
    
    localStorage.setItem(key, next.toString());
    return next;
  }
}
```

---

## 🗄️ DATABASE SCHEMA (PostgreSQL)

### **Complete Multi-Tenant Schema:**

```sql
-- ===================================================================
-- TENANTS TABLE (Core multi-tenancy)
-- ===================================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_code VARCHAR(15) UNIQUE NOT NULL,
  
  -- Company Information
  company_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  dba_name VARCHAR(255),
  business_type VARCHAR(50) NOT NULL,
  
  -- Contact Information
  primary_contact JSONB NOT NULL,
  
  -- Address
  address JSONB NOT NULL,
  
  -- Legal & Compliance
  tax_id VARCHAR(50),
  ein VARCHAR(50),
  duns VARCHAR(50),
  mc_number VARCHAR(50),
  dot_number VARCHAR(50),
  fmc_number VARCHAR(50),
  customs_broker_license VARCHAR(50),
  
  -- Certifications
  certifications JSONB,
  
  -- Subscription
  subscription JSONB NOT NULL,
  
  -- Branding (White Label)
  branding JSONB,
  
  -- Platform Agreement
  platform_agreement JSONB NOT NULL,
  
  -- Settings
  settings JSONB NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tenant_code (tenant_code),
  INDEX idx_status (status),
  INDEX idx_company_name (company_name)
);

-- ===================================================================
-- PLATFORM CONTRACTS TABLE (FleetFlow ↔ Tenant)
-- ===================================================================
CREATE TABLE platform_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(30) UNIQUE NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- Subscription Details
  subscription_plan VARCHAR(30) NOT NULL,
  monthly_fee DECIMAL(10,2) NOT NULL,
  setup_fee DECIMAL(10,2),
  transaction_fees JSONB,
  
  -- Dates
  effective_date DATE NOT NULL,
  renewal_date DATE NOT NULL,
  auto_renewal BOOLEAN DEFAULT TRUE,
  
  -- SLA
  platform_sla JSONB NOT NULL,
  data_retention JSONB NOT NULL,
  data_privacy JSONB NOT NULL,
  platform_liability JSONB NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_status (status)
);

-- ===================================================================
-- CONTACTS TABLE (Tenant's CRM - Multi-tenant isolated)
-- ===================================================================
CREATE TABLE ff_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),  -- ISOLATION
  contact_code VARCHAR(15) NOT NULL,
  type VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL,
  
  -- Company Information
  company_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  website VARCHAR(255),
  
  -- Contact Information
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  
  -- Complex Data (JSONB)
  addresses JSONB,
  contact_persons JSONB,
  shipper_info JSONB,
  consignee_info JSONB,
  carrier_info JSONB,
  customs_broker_info JSONB,
  
  -- Financial
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_terms VARCHAR(20),
  credit_limit DECIMAL(15,2),
  credit_used DECIMAL(15,2),
  
  -- Compliance
  tax_id VARCHAR(50),
  ein VARCHAR(50),
  certifications JSONB,
  
  -- Tags & Metadata
  tags JSONB,
  documents JSONB,
  
  -- Metrics
  total_shipments INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  average_shipment_value DECIMAL(15,2) DEFAULT 0,
  
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100),
  last_contacted_date TIMESTAMP,
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_code (tenant_id, contact_code),
  INDEX idx_tenant_type (tenant_id, type),
  INDEX idx_tenant_status (tenant_id, status),
  INDEX idx_company_name (company_name),
  
  -- Unique constraint (per tenant)
  UNIQUE (tenant_id, contact_code)
);

-- ===================================================================
-- CONTRACTS TABLE (Tenant ↔ Client - Multi-tenant isolated)
-- ===================================================================
CREATE TABLE ff_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),  -- ISOLATION
  contract_number VARCHAR(30) NOT NULL,
  type VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL,
  
  -- Parties (stored as JSONB)
  forwarder JSONB NOT NULL,  -- Tenant's info
  client JSONB NOT NULL,     -- Tenant's client info
  
  -- Contract Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  effective_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  auto_renewal BOOLEAN DEFAULT FALSE,
  renewal_notice_days INTEGER DEFAULT 30,
  
  -- Financial Terms
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_terms VARCHAR(20),
  credit_limit DECIMAL(15,2),
  
  -- Complex Terms (JSONB)
  rate_structures JSONB,
  sla JSONB,
  volume_commitment JSONB,
  liability_terms JSONB NOT NULL,
  services_covered JSONB NOT NULL,
  
  -- Geographic Scope
  origin_countries JSONB,
  destination_countries JSONB,
  specific_lanes JSONB,
  
  -- Compliance
  compliance_requirements JSONB,
  certifications_required JSONB,
  
  -- Documents
  documents JSONB,
  
  -- Terms
  terms_and_conditions TEXT NOT NULL,
  special_clauses JSONB,
  
  -- History
  previous_contract_id UUID,
  renewal_history JSONB,
  amendments JSONB,
  
  -- Performance
  performance JSONB,
  
  -- Notifications
  notifications JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100),
  last_reviewed_date TIMESTAMP,
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_number (tenant_id, contract_number),
  INDEX idx_tenant_client (tenant_id, (client->>'contactId')),
  INDEX idx_tenant_status (tenant_id, status),
  INDEX idx_expiry (expiry_date),
  
  -- Unique constraint (per tenant)
  UNIQUE (tenant_id, contract_number)
);

-- ===================================================================
-- SHIPMENTS TABLE (Tenant's shipments - Multi-tenant isolated)
-- ===================================================================
CREATE TABLE ff_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),  -- ISOLATION
  shipment_number VARCHAR(30) NOT NULL,
  mode VARCHAR(10) NOT NULL,
  
  -- Parties (references to tenant's CRM)
  shipper_id UUID REFERENCES ff_contacts(id),
  consignee_id UUID REFERENCES ff_contacts(id),
  carrier_id UUID REFERENCES ff_contacts(id),
  customs_broker_id UUID REFERENCES ff_contacts(id),
  trucker_id UUID REFERENCES ff_contacts(id),
  notify_party_ids JSONB,
  
  -- Milestone Tracking
  current_milestone VARCHAR(50) NOT NULL,
  milestone_history JSONB,
  
  -- Route
  origin_port VARCHAR(100),
  destination_port VARCHAR(100),
  etd DATE,
  eta DATE,
  
  -- Identifiers
  bill_of_lading_number VARCHAR(30),
  container_numbers JSONB,
  air_waybill_number VARCHAR(20),
  
  -- Cargo
  cargo_value DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Documents
  documents JSONB,
  
  -- Notifications
  notifications JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_number (tenant_id, shipment_number),
  INDEX idx_tenant_milestone (tenant_id, current_milestone),
  INDEX idx_tenant_shipper (tenant_id, shipper_id),
  INDEX idx_tenant_consignee (tenant_id, consignee_id),
  INDEX idx_etd (etd),
  INDEX idx_eta (eta),
  
  -- Unique constraint (per tenant)
  UNIQUE (tenant_id, shipment_number)
);

-- ===================================================================
-- CONTRACT ALERTS TABLE
-- ===================================================================
CREATE TABLE ff_contract_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),  -- ISOLATION
  contract_id UUID NOT NULL REFERENCES ff_contracts(id),
  type VARCHAR(30) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_contract (tenant_id, contract_id),
  INDEX idx_acknowledged (acknowledged)
);

-- ===================================================================
-- ACTIVITIES TABLE (Contact activity log)
-- ===================================================================
CREATE TABLE ff_contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),  -- ISOLATION
  contact_id UUID NOT NULL REFERENCES ff_contacts(id),
  type VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2),
  currency VARCHAR(3),
  date TIMESTAMP NOT NULL,
  created_by VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_contact (tenant_id, contact_id),
  INDEX idx_date (date)
);

-- ===================================================================
-- NOTIFICATIONS TABLE
-- ===================================================================
CREATE TABLE ff_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),  -- ISOLATION
  shipment_id UUID REFERENCES ff_shipments(id),
  milestone VARCHAR(50) NOT NULL,
  recipient_contact_ids JSONB,
  recipient_emails TEXT[],
  recipient_phones TEXT[],
  methods TEXT[],
  priority VARCHAR(20) NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_tenant (tenant_id),
  INDEX idx_tenant_shipment (tenant_id, shipment_id),
  INDEX idx_status (status),
  INDEX idx_milestone (milestone)
);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) - PostgreSQL Security Feature
-- ===================================================================

-- Enable RLS on all tenant tables
ALTER TABLE ff_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_contract_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_contact_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only see their tenant's data)
CREATE POLICY tenant_isolation_contacts ON ff_contacts
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_contracts ON ff_contracts
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_shipments ON ff_shipments
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_alerts ON ff_contract_alerts
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_activities ON ff_contact_activities
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_notifications ON ff_notifications
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- ===================================================================
-- HELPER FUNCTIONS
-- ===================================================================

-- Set current tenant for session (call at start of each request)
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_uuid UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_uuid::TEXT, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Get current tenant
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', TRUE)::UUID;
END;
$$ LANGUAGE plpgsql;
```

---

## 🎯 USAGE IN APPLICATION

### **Setting Tenant Context:**

```typescript
// middleware.ts or API route
import { getServerSession } from 'next-auth';

export async function middleware(req: Request) {
  const session = await getServerSession();
  
  if (session?.user) {
    // Get user's tenant
    const tenantId = session.user.tenantId;
    
    // Set tenant context for database queries
    await db.query('SELECT set_current_tenant($1)', [tenantId]);
    
    // All subsequent queries automatically filtered by tenant
  }
}
```

### **Creating Data with Tenant Context:**

```typescript
// In your Next.js API route or server action
import { getServerSession } from 'next-auth';
import FreightForwarderCRMService from '@/services/FreightForwarderCRMService';

export async function POST(req: Request) {
  const session = await getServerSession();
  const tenantId = session?.user?.tenantId;
  
  if (!tenantId) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const contactData = await req.json();
  
  // Create contact for THIS tenant only
  const contact = FreightForwarderCRMService.createContact(
    tenantId,  // ← Tenant isolation
    contactData
  );
  
  return Response.json(contact);
}
```

---

## ✅ VERIFICATION CHECKLIST

After implementing, verify:

- [ ] Each tenant can ONLY see their own contacts
- [ ] Each tenant can ONLY see their own contracts
- [ ] Each tenant can ONLY see their own shipments
- [ ] Tenant A cannot access Tenant B's data
- [ ] White-label branding works per tenant
- [ ] Custom domains work per tenant
- [ ] Notifications branded with tenant info
- [ ] Billing calculated per tenant
- [ ] Database queries filtered by tenant_id
- [ ] Row Level Security (RLS) enforced

---

**FleetFlow TMS LLC**  
Multi-Tenant SaaS Platform  
**WOSB Certified** • **SOC 2 Certified**

*Complete multi-tenant implementation guide*
