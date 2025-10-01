# 📋 FleetFlow Freight Forwarder CRM & Contract Management System

## Complete Business Intelligence Platform for Freight Forwarding Operations

---

## 🎯 System Overview

FleetFlow provides **enterprise-grade CRM and contract management** specifically designed for freight forwarders. Unlike generic CRMs, this system understands the unique relationships and workflows in international logistics.

### **What's Included**

1. **CRM Service** (`FreightForwarderCRMService`)
   - Shipper Management (Exporters)
   - Consignee Management (Importers/Clients)
   - Carrier Database (Shipping Lines, Airlines)
   - Customs Broker Network
   - Trucking Companies
   - Warehouse Providers
   - Port Agents
   - Insurance Providers

2. **Contract Management** (`FreightForwarderContractService`)
   - Client Service Agreements
   - Carrier Rate Agreements
   - Customs Broker Contracts
   - Trucking Contracts
   - Warehouse Agreements
   - Volume Commitment Tracking
   - SLA Management
   - Contract Alerts & Renewals

3. **Automation & Notifications** (FreightForwarderAutomationService)
   - Shipment Milestone Notifications
   - Document Status Updates
   - Contract Expiry Alerts
   - Volume Commitment Tracking
   - Payment Reminders
   - Customer Communications

---

## 📦 CRM Service - Contact Types

### 12 Specialized Contact Types

| Type | Prefix | Purpose | Key Data |
|------|--------|---------|----------|
| **SHIPPER** | SHP | Exporters/Sellers | Export licenses, VAT, product categories |
| **CONSIGNEE** | CNE | Importers/Buyers/Clients | Import licenses, credit limit, payment terms |
| **CARRIER** | CAR | Shipping lines, airlines | SCAC code, IATA code, vessel names, routes |
| **CUSTOMS_BROKER** | CUS | Customs clearance agents | License #, bond #, ports served |
| **TRUCKER** | TRK | Trucking companies | MC#, DOT#, service area |
| **WAREHOUSE** | WHS | Storage providers | Location, capacity, temperature control |
| **PORT_AGENT** | PRT | Port handling agents | Port codes, services offered |
| **FREIGHT_FORWARDER** | FFW | Partner forwarders | Service areas, specializations |
| **BANK** | BNK | Financial institutions | SWIFT code, LC services |
| **INSURANCE** | INS | Cargo insurance providers | Coverage types, premium rates |
| **NOTIFY_PARTY** | NTY | Notification contacts | Relationship to shipment |
| **VENDOR** | VND | General vendors | Service type |

---

## 🏢 CRM Usage Examples

### Example 1: Add New Shipper (Exporter)

```typescript
import FreightForwarderCRMService from '@/services/FreightForwarderCRMService';

const newShipper = FreightForwarderCRMService.createContact({
  type: 'SHIPPER',
  status: 'ACTIVE',
  companyName: 'Shanghai Steel Manufacturing Co., Ltd.',
  legalName: 'Shanghai Steel Manufacturing Co., Ltd.',
  email: 'export@shanghasteel.com',
  phone: '+86-21-6219-4567',
  website: 'www.shanghaisteel.com',
  
  addresses: [{
    addressLine1: '888 Huaihai Road',
    city: 'Shanghai',
    postalCode: '200031',
    country: 'China',
    countryCode: 'CN',
    type: 'OFFICE',
    isDefault: true,
  }],
  
  contactPersons: [{
    firstName: 'Wei',
    lastName: 'Zhang',
    title: 'Export Manager',
    email: 'wei.zhang@shanghaisteel.com',
    phone: '+86-21-6219-4568',
    mobile: '+86-138-1234-5678',
    department: 'Export Department',
    isPrimary: true,
  }],
  
  shipperInfo: {
    exportLicenseNumber: 'EXP-CN-2023-001234',
    exportLicenseExpiry: '2026-12-31',
    vatNumber: 'CN123456789',
    exportCategories: ['Steel Products', 'Metal Fabrication', 'Industrial Materials'],
    averageShipmentValue: 75000,
    preferredIncoterms: ['FOB', 'CIF', 'DDP'],
  },
  
  industry: 'Manufacturing - Steel',
  companySize: 'LARGE',
  yearEstablished: 1998,
  numberOfEmployees: 850,
  
  currency: 'USD',
  paymentTerms: 'NET_30',
  
  certifications: ['ISO 9001', 'ISO 14001', 'AEO Certified'],
  tags: ['High Volume', 'Priority Client', 'Regular Shipper'],
  
  documents: [],
  subsidiaries: [],
  
  notes: 'Major steel exporter. Ships 20-30 containers monthly to USA.',
  createdBy: 'user@fleetflow.com',
});

console.log(`New shipper created: ${newShipper.contactCode}`);
// Output: SHP1737554567892
```

### Example 2: Add New Consignee (Client)

```typescript
const newClient = FreightForwarderCRMService.createContact({
  type: 'CONSIGNEE',
  status: 'ACTIVE',
  companyName: 'ABC Import & Distribution Corp',
  legalName: 'ABC Import & Distribution Corporation',
  email: 'imports@abcimport.com',
  phone: '(310) 555-0123',
  website: 'www.abcimport.com',
  
  addresses: [{
    addressLine1: '1234 Harbor Blvd, Suite 500',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90021',
    country: 'United States',
    countryCode: 'US',
    type: 'OFFICE',
    isDefault: true,
  }, {
    addressLine1: '5678 Warehouse Drive',
    city: 'Carson',
    state: 'CA',
    postalCode: '90746',
    country: 'United States',
    countryCode: 'US',
    type: 'WAREHOUSE',
    isDefault: false,
  }],
  
  contactPersons: [{
    firstName: 'Michael',
    lastName: 'Johnson',
    title: 'Import Manager',
    email: 'mjohnson@abcimport.com',
    phone: '(310) 555-0124',
    mobile: '(310) 555-0125',
    isPrimary: true,
  }],
  
  consigneeInfo: {
    importLicenseNumber: 'IMP-US-2024-5678',
    taxId: '95-1234567',
    importCategories: ['Steel Products', 'Machinery', 'Electronics'],
    creditLimit: 500000,
    creditUsed: 125000,
    paymentTerms: 'NET_30',
    creditRating: 'EXCELLENT',
  },
  
  industry: 'Import/Distribution',
  companySize: 'MEDIUM',
  currency: 'USD',
  
  certifications: ['C-TPAT Certified', 'ISA Member'],
  tags: ['VIP Client', 'Monthly Volume 100k+', 'Net 30 Terms'],
  
  documents: [],
  subsidiaries: [],
  
  notes: 'Excellent payment history. Prefers DDP shipments. Regular monthly volume.',
  createdBy: 'user@fleetflow.com',
});
```

### Example 3: Add Ocean Carrier

```typescript
const carrier = FreightForwarderCRMService.createContact({
  type: 'CARRIER',
  status: 'ACTIVE',
  companyName: 'Mediterranean Shipping Company (MSC)',
  legalName: 'Mediterranean Shipping Company S.A.',
  email: 'customerservice@msc.com',
  phone: '+1-201-330-3000',
  website: 'www.msc.com',
  
  addresses: [{
    addressLine1: '420 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    postalCode: '10018',
    country: 'United States',
    countryCode: 'US',
    type: 'OFFICE',
    isDefault: true,
  }],
  
  contactPersons: [{
    firstName: 'Sarah',
    lastName: 'Williams',
    title: 'Account Executive',
    email: 'swilliams@msc.com',
    phone: '+1-201-330-3050',
    isPrimary: true,
  }],
  
  carrierInfo: {
    carrierType: 'OCEAN',
    scacCode: 'MSCU',
    carrierCode: 'MSC',
    vesselNames: [
      'MSC GULSUN',
      'MSC MAYA',
      'MSC ZOE',
      'MSC OSCAR',
    ],
    serviceRoutes: [
      'Asia-USA (Transpacific)',
      'Europe-USA (Transatlantic)',
      'Asia-Europe',
      'Mediterranean-USA',
    ],
    transitTimes: {
      'CNSHA-USLAX': 16, // Shanghai to LA: 16 days
      'CNSHA-USNYC': 28, // Shanghai to NYC: 28 days
      'NLRTM-USNYC': 12, // Rotterdam to NYC: 12 days
    },
    freeTimeDays: 5,
  },
  
  currency: 'USD',
  tags: ['Ocean Freight', 'Global Carrier', 'Container Shipping'],
  documents: [],
  subsidiaries: [],
  
  notes: 'Major ocean carrier. Competitive rates on Asia-USA lanes. Good equipment availability.',
  createdBy: 'user@fleetflow.com',
});
```

---

## 📜 Contract Management

### Contract Type Examples

#### 1. Client Service Agreement

```typescript
import FreightForwarderContractService from '@/services/FreightForwarderContractService';

const clientContract = FreightForwarderContractService.createContract({
  type: 'CLIENT_SERVICE_AGREEMENT',
  status: 'ACTIVE',
  
  forwarder: {
    contactId: 'forwarder-id',
    companyName: 'FleetFlow TMS LLC',
    legalName: 'FleetFlow TMS LLC',
    address: '755 W. Big Beaver Rd STE 2020, Troy, MI 48084',
    country: 'United States',
    taxId: '47-5678901',
    signatory: {
      name: 'Dieasha Davis',
      title: 'President & CEO',
      email: 'dee@fleetflowapp.com',
      signedDate: '2025-01-15',
    },
  },
  
  client: {
    contactId: 'cne-client-123',
    companyName: 'ABC Import & Distribution Corp',
    legalName: 'ABC Import & Distribution Corporation',
    address: '1234 Harbor Blvd, Los Angeles, CA 90021',
    country: 'United States',
    taxId: '95-1234567',
    signatory: {
      name: 'Michael Johnson',
      title: 'CEO',
      email: 'mjohnson@abcimport.com',
      signedDate: '2025-01-16',
    },
  },
  
  title: 'Master Service Agreement - Ocean & Air Freight Forwarding',
  description: 'Comprehensive freight forwarding services including ocean freight, air freight, customs clearance, and door-to-door delivery.',
  
  effectiveDate: '2025-02-01',
  expiryDate: '2026-01-31',
  autoRenewal: true,
  renewalNoticeDays: 60,
  
  currency: 'USD',
  paymentTerms: 'NET_30',
  creditLimit: 500000,
  depositRequired: false,
  
  rateStructures: [
    {
      mode: 'OCEAN',
      serviceLevel: 'STANDARD',
      origin: 'Shanghai, China (CNSHA)',
      destination: 'Los Angeles, USA (USLAX)',
      container20ft: 1800,
      container40ft: 2800,
      container40HC: 3200,
      lclRatePerCBM: 85,
      fuelSurchargePercent: 18,
      documentationFee: 150,
      customsClearanceFee: 300,
      deliveryFee: 450,
      validFrom: '2025-02-01',
      validUntil: '2025-07-31',
      currency: 'USD',
    },
    {
      mode: 'AIR',
      serviceLevel: 'STANDARD',
      origin: 'Hong Kong (HKG)',
      destination: 'Los Angeles (LAX)',
      ratePerKg: 4.50,
      minimumCharge: 150,
      fuelSurchargePercent: 22,
      securityFee: 75,
      documentationFee: 125,
      customsClearanceFee: 250,
      validFrom: '2025-02-01',
      validUntil: '2025-07-31',
      currency: 'USD',
    },
  ],
  
  sla: {
    transitTimeCommitment: 16, // days for ocean
    onTimeDeliveryTarget: 95, // percentage
    documentTurnaroundTime: 24, // hours
    quoteResponseTime: 4, // hours
    customerServiceHours: '24/7',
    dedicatedAccountManager: true,
    trackingUpdateFrequency: 'Real-time',
    penalties: {
      lateDeliveryPenalty: 500,
      documentDelayPenalty: 250,
    },
  },
  
  volumeCommitment: {
    minimumShipments: 50,
    minimumRevenue: 150000,
    period: 'QUARTERLY',
    volumeDiscountTiers: [
      { shipmentsFrom: 50, shipmentsTo: 99, discountPercent: 0 },
      { shipmentsFrom: 100, shipmentsTo: 199, discountPercent: 5 },
      { shipmentsFrom: 200, shipmentsTo: 999, discountPercent: 10 },
    ],
    incentiveBonus: 5000,
  },
  
  liabilityTerms: {
    liabilityLimitPerShipment: 100000,
    liabilityLimitPerContainer: 250000,
    liabilityLimitPerKg: 20,
    insuranceRequired: true,
    insuranceCoverage: 110, // 110% of cargo value
    forceMAJEURE: true,
    excludedCommodities: ['Explosives', 'Radioactive Materials', 'Illegal Goods'],
  },
  
  servicesCovered: {
    oceanFreight: true,
    airFreight: true,
    customsClearance: true,
    doorToDoorDelivery: true,
    warehousing: true,
    insurance: true,
    packingServices: false,
    cargoInspection: true,
    documentPreparation: true,
  },
  
  originCountries: ['China', 'Hong Kong', 'Singapore', 'Vietnam', 'Taiwan'],
  destinationCountries: ['United States'],
  specificLanes: [
    'China-USA West Coast',
    'China-USA East Coast',
    'Asia-USA',
  ],
  
  complianceRequirements: ['C-TPAT', 'ISF Filing', 'FDA Compliance'],
  certificationsRequired: ['AMS Filing', 'ISF', 'Entry Filing'],
  
  documents: [],
  
  termsAndConditions: `
## TERMS AND CONDITIONS

1. **Scope of Services**: FleetFlow TMS LLC agrees to provide international freight forwarding services including but not limited to ocean freight, air freight, customs clearance, and related logistics services.

2. **Rates**: All rates are subject to carrier tariffs and may be adjusted with 30 days notice.

3. **Payment Terms**: NET 30 days from invoice date. Late payments subject to 1.5% monthly interest.

4. **Liability**: FleetFlow's liability limited as specified in liability terms section.

5. **Force Majeure**: Neither party liable for delays caused by events beyond reasonable control.

6. **Governing Law**: This agreement governed by laws of State of Michigan, USA.
  `,
  
  specialClauses: [
    'Client commits to minimum 50 shipments per quarter',
    'Volume discounts apply automatically based on quarterly volume',
    'Dedicated account manager provided for duration of contract',
    'Real-time tracking and 24/7 customer support included',
  ],
  
  notifications: {
    expiryReminder: true,
    volumeAlerts: true,
    performanceReports: true,
    renewalReminder: true,
  },
  
  createdBy: 'dee@fleetflowapp.com',
});

console.log(`Contract created: ${clientContract.contractNumber}`);
// Output: CSA-2025-0001
```

#### 2. Carrier Rate Agreement

```typescript
const carrierContract = FreightForwarderContractService.createContract({
  type: 'CARRIER_RATE_AGREEMENT',
  status: 'ACTIVE',
  
  forwarder: {
    contactId: 'forwarder-id',
    companyName: 'FleetFlow TMS LLC',
    legalName: 'FleetFlow TMS LLC',
    address: '755 W. Big Beaver Rd STE 2020, Troy, MI 48084',
    country: 'United States',
    taxId: '47-5678901',
    signatory: {
      name: 'Dieasha Davis',
      title: 'President & CEO',
      email: 'dee@fleetflowapp.com',
      signedDate: '2025-01-10',
    },
  },
  
  client: {
    contactId: 'car-msc-456',
    companyName: 'Mediterranean Shipping Company (MSC)',
    legalName: 'Mediterranean Shipping Company S.A.',
    address: '420 Fifth Avenue, New York, NY 10018',
    country: 'United States',
    registrationNumber: 'CH-123456789',
    signatory: {
      name: 'Sarah Williams',
      title: 'Regional Sales Manager',
      email: 'swilliams@msc.com',
      signedDate: '2025-01-12',
    },
  },
  
  title: 'Ocean Freight Rate Agreement - Asia to USA Routes',
  description: 'Contracted rates for container shipping from Asian ports to US ports.',
  
  effectiveDate: '2025-02-01',
  expiryDate: '2025-07-31',
  autoRenewal: false,
  renewalNoticeDays: 45,
  
  currency: 'USD',
  paymentTerms: 'PREPAID',
  
  rateStructures: [
    {
      mode: 'OCEAN',
      serviceLevel: 'STANDARD',
      origin: 'Shanghai, China (CNSHA)',
      destination: 'Los Angeles, USA (USLAX)',
      container20ft: 1500,
      container40ft: 2400,
      container40HC: 2800,
      fuelSurchargePercent: 15,
      validFrom: '2025-02-01',
      validUntil: '2025-07-31',
      currency: 'USD',
    },
    {
      mode: 'OCEAN',
      serviceLevel: 'STANDARD',
      origin: 'Ningbo, China (CNNBO)',
      destination: 'Long Beach, USA (USLGB)',
      container20ft: 1550,
      container40ft: 2450,
      container40HC: 2850,
      fuelSurchargePercent: 15,
      validFrom: '2025-02-01',
      validUntil: '2025-07-31',
      currency: 'USD',
    },
  ],
  
  volumeCommitment: {
    minimumShipments: 100,
    minimumRevenue: 280000,
    period: 'QUARTERLY',
    volumeDiscountTiers: [
      { shipmentsFrom: 100, shipmentsTo: 199, discountPercent: 0 },
      { shipmentsFrom: 200, shipmentsTo: 299, discountPercent: 3 },
      { shipmentsFrom: 300, shipmentsTo: 999, discountPercent: 5 },
    ],
  },
  
  liabilityTerms: {
    liabilityLimitPerShipment: 500,
    liabilityLimitPerContainer: 500,
    liabilityLimitPerKg: 2,
    insuranceRequired: false,
    forceMAJEURE: true,
    excludedCommodities: [],
  },
  
  servicesCovered: {
    oceanFreight: true,
    airFreight: false,
    customsClearance: false,
    doorToDoorDelivery: false,
    warehousing: false,
    insurance: false,
    packingServices: false,
    cargoInspection: false,
    documentPreparation: false,
  },
  
  originCountries: ['China'],
  destinationCountries: ['United States'],
  specificLanes: ['China-USA West Coast'],
  
  complianceRequirements: [],
  certificationsRequired: [],
  documents: [],
  
  termsAndConditions: 'Standard MSC service contract terms apply.',
  specialClauses: [
    'Rates valid for 6 months',
    'Minimum volume commitment: 100 TEU per quarter',
    'Equipment guarantee subject to availability',
  ],
  
  notifications: {
    expiryReminder: true,
    volumeAlerts: true,
    performanceReports: false,
    renewalReminder: true,
  },
  
  createdBy: 'dee@fleetflowapp.com',
});
```

---

## 🔔 Automation & Notifications System

### Shipment Milestone Notifications

Based on your images, the system will automatically notify stakeholders at every milestone:

#### **Export Process (12 Steps)**

1. **Inspection & Quality Check** → Notify shipper, QC team
2. **Package, Label & Mark Goods** → Notify shipper, warehouse
3. **Get Delivery Order** → Notify shipper, freight forwarder
4. **Stuffing & Sealing Containers** → Notify all parties
5. **Arrange Inter-Modal Transfer** → Notify trucking, port agent
6. **Transfer to Point of Loading** → Notify port, shipping line
7. **Goods Arrive at Port** → Notify customs, all parties
8. **Customs Clearance & Physical Verification** → Notify customs broker, client
9. **Pay Port Dues** → Notify finance team
10. **Handover Documents to Shipping Line** → Notify carrier, client
11. **Send Original B/L to Buyer** → Notify consignee
12. **Goods Depart from Origin** → Notify all parties with vessel/flight details

#### **Bill of Lading Workflow**

- **B/L Issued** → Notify shipper, consignee, freight forwarder
- **B/L Signed by Master** → Notify all parties
- **Original B/L Sent** → Track document delivery
- **B/L Surrender** → Notify port, consignee

---

## 🚀 Quick Start Integration

### Step 1: Add to Freight Forwarder Page

```typescript
// In app/freight-forwarders/page.tsx

import FreightForwarderCRMService from '@/services/FreightForwarderCRMService';
import FreightForwarderContractService from '@/services/FreightForwarderContractService';

function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [selectedType, setSelectedType] = useState<'ALL' | 'SHIPPER' | 'CONSIGNEE'>('ALL');
  
  useEffect(() => {
    loadContacts();
  }, [selectedType]);
  
  const loadContacts = () => {
    if (selectedType === 'ALL') {
      setContacts(FreightForwarderCRMService.getAllContacts());
    } else {
      setContacts(FreightForwarderCRMService.getContactsByType(selectedType));
    }
  };
  
  const stats = FreightForwarderCRMService.getStatistics();
  
  return (
    <div>
      <h2>Client & Vendor Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard label="Total Contacts" value={stats.totalContacts} />
        <StatCard label="Shippers" value={stats.byType.SHIPPER || 0} />
        <StatCard label="Consignees" value={stats.byType.CONSIGNEE || 0} />
        <StatCard label="Carriers" value={stats.byType.CARRIER || 0} />
      </div>
      
      <button onClick={() => /* Open add contact modal */}>
        + Add Contact
      </button>
      
      {/* Contact list */}
    </div>
  );
}

function ContractsTab() {
  const contracts = FreightForwarderContractService.getActiveContracts();
  const expiringContracts = FreightForwarderContractService.getExpiringContracts(30);
  const alerts = FreightForwarderContractService.getAllAlerts();
  
  return (
    <div>
      <h2>Contract Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <StatCard label="Active Contracts" value={contracts.length} />
        <StatCard label="Expiring Soon" value={expiringContracts.length} />
        <StatCard label="Alerts" value={alerts.filter(a => !a.acknowledged).length} />
      </div>
      
      <button onClick={() => /* Open new contract modal */}>
        + New Contract
      </button>
      
      {/* Contract list and alerts */}
    </div>
  );
}
```

---

## 📊 Database Schema Recommendations

```sql
-- Contacts Table
CREATE TABLE ff_contacts (
  id UUID PRIMARY KEY,
  contact_code VARCHAR(15) UNIQUE NOT NULL,
  type VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  addresses JSONB,
  contact_persons JSONB,
  shipper_info JSONB,
  consignee_info JSONB,
  carrier_info JSONB,
  customs_broker_info JSONB,
  certifications JSONB,
  tags JSONB,
  documents JSONB,
  total_shipments INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contracts Table
CREATE TABLE ff_contracts (
  id UUID PRIMARY KEY,
  contract_number VARCHAR(30) UNIQUE NOT NULL,
  type VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL,
  forwarder_id VARCHAR(50),
  client_id VARCHAR(50),
  title VARCHAR(255),
  effective_date DATE,
  expiry_date DATE,
  auto_renewal BOOLEAN DEFAULT FALSE,
  currency VARCHAR(3),
  payment_terms VARCHAR(20),
  rate_structures JSONB,
  sla JSONB,
  volume_commitment JSONB,
  liability_terms JSONB,
  performance JSONB,
  amendments JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contract Alerts Table
CREATE TABLE ff_contract_alerts (
  id UUID PRIMARY KEY,
  contract_id UUID REFERENCES ff_contracts(id),
  type VARCHAR(30) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Premium Features

### 1. **Credit Management**
- Auto-calculate available credit
- Alert when approaching credit limit
- Track payment history

### 2. **Performance Analytics**
- On-time delivery rates by carrier
- Average transit times by lane
- Cost per container/kg analysis

### 3. **Volume Discount Automation**
- Auto-apply volume discounts
- Track towards discount tiers
- Alert when reaching new tier

### 4. **Contract Renewal Automation**
- Auto-send renewal notices
- Track renewal status
- Generate renewal documents

---

## 📞 Support

**FleetFlow TMS LLC**  
755 W. Big Beaver Rd STE 2020  
Troy, MI 48084  
Phone: (833) 386-3509  
Email: support@fleetflowapp.com  
Domain: fleetflowapp.com

**WOSB Certified** • **Enterprise Transportation Intelligence**

---

*Your complete business intelligence platform for freight forwarding operations.*
