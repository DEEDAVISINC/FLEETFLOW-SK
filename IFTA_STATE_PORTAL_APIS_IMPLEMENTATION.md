# 🗺️ IFTA State Portal APIs Integration - Implementation Plan

## 📋 Overview

IFTA (International Fuel Tax Agreement) State Portal APIs integration provides automated fuel tax
reporting across multiple states. This is critical for interstate trucking operations to maintain
compliance with fuel tax requirements in all jurisdictions where they operate.

## 🎯 Business Requirements

### IFTA Purpose

- **Interstate Fuel Tax**: Simplified fuel tax reporting across participating states
- **Quarterly Filing**: Required quarterly returns for all IFTA jurisdictions
- **Fuel Purchase Records**: Detailed tracking of fuel purchases by state
- **Mileage Reporting**: Distance traveled in each IFTA jurisdiction
- **Tax Calculations**: Automatic calculation of fuel tax owed/refunded per state

### FleetFlow Integration Benefits

- **Automated Reporting**: Eliminate manual quarterly IFTA returns
- **Multi-state Compliance**: Handle all 48 IFTA states + DC automatically
- **Real-time Tracking**: Continuous fuel and mileage data collection
- **Cost Optimization**: Identify fuel tax savings opportunities
- **Audit Support**: Maintain detailed records for IFTA audits

## 🔧 Implementation Components

### 1. IFTA State Portal Service

**File**: `app/services/tax/IFTAStatePortalService.ts`

```typescript
interface IFTAJurisdiction {
  state: string;
  stateCode: string;
  taxRate: number; // per gallon
  apiEndpoint?: string;
  requiresRegistration: boolean;
  filingFrequency: 'quarterly' | 'monthly';
}

interface FuelPurchase {
  date: string;
  state: string;
  gallons: number;
  pricePerGallon: number;
  totalAmount: number;
  vendorName: string;
  receiptNumber: string;
  fuelType: 'diesel' | 'gasoline';
}

interface MileageRecord {
  date: string;
  state: string;
  miles: number;
  vehicleId: string;
  routeDetails?: string;
}

interface IFTAReturn {
  quarter: string; // "2024-Q1"
  year: number;
  jurisdictions: Array<{
    state: string;
    totalMiles: number;
    taxableMiles: number;
    fuelPurchased: number;
    taxRate: number;
    taxOwed: number;
    taxPaid: number;
    netTaxDue: number;
  }>;
  totalTaxDue: number;
  totalRefundDue: number;
}
```

### 2. IFTA Management API

**File**: `app/api/tax/ifta/route.ts`

Endpoints:

- `POST /api/tax/ifta/fuel-purchase` - Record fuel purchase
- `POST /api/tax/ifta/mileage` - Record mileage by state
- `GET /api/tax/ifta/return/{quarter}` - Generate quarterly return
- `POST /api/tax/ifta/file-return` - File return with state portals
- `GET /api/tax/ifta/jurisdictions` - Get IFTA state information
- `GET /api/tax/ifta/compliance-status` - Check compliance status

### 3. Database Schema Extensions

**File**: `supabase-schema.sql`

```sql
-- IFTA Fuel Purchases Table
CREATE TABLE ifta_fuel_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID,
    purchase_date DATE NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    gallons DECIMAL(8,3) NOT NULL,
    price_per_gallon DECIMAL(6,3) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    vendor_name VARCHAR(255),
    receipt_number VARCHAR(100),
    fuel_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IFTA Mileage Records Table
CREATE TABLE ifta_mileage_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    travel_date DATE NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    miles DECIMAL(8,1) NOT NULL,
    route_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IFTA Returns Table
CREATE TABLE ifta_returns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL,
    quarter VARCHAR(10) NOT NULL, -- "2024-Q1"
    year INTEGER NOT NULL,
    filing_status VARCHAR(20) DEFAULT 'draft',
    total_tax_due DECIMAL(10,2) DEFAULT 0,
    total_refund_due DECIMAL(10,2) DEFAULT 0,
    filed_date TIMESTAMP WITH TIME ZONE,
    due_date DATE NOT NULL,
    return_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Enhanced IFTA Service

**File**: `app/services/tax/EnhancedIFTAService.ts`

Features:

- Multi-state API integration
- Automated fuel tax calculations
- Quarterly return generation
- Compliance monitoring
- Audit trail maintenance
- Real-time mileage tracking

## 🗺️ IFTA Jurisdictions

### Participating States (48 + DC)

All US states except Alaska and Hawaii, plus District of Columbia:

```typescript
const IFTA_JURISDICTIONS = [
  { state: 'Alabama', code: 'AL', taxRate: 0.19 },
  { state: 'Arizona', code: 'AZ', taxRate: 0.18 },
  { state: 'Arkansas', code: 'AR', taxRate: 0.225 },
  { state: 'California', code: 'CA', taxRate: 0.40 },
  { state: 'Colorado', code: 'CO', taxRate: 0.2225 },
  // ... all 48 states + DC
];
```

### Tax Rate Management

- **Dynamic Rates**: Tax rates change periodically
- **Effective Dates**: Track rate changes by date
- **Multi-fuel Types**: Different rates for diesel vs gasoline
- **Special Jurisdictions**: Handle unique state requirements

## 🔐 Environment Configuration

### Required Environment Variables

```env
# IFTA Configuration
IFTA_BASE_FLEET_MPG=6.5  # Average fleet fuel efficiency
IFTA_DEFAULT_FUEL_TYPE=diesel
IFTA_FILING_DEADLINE_BUFFER_DAYS=7

# State Portal APIs (examples)
CALIFORNIA_IFTA_API_KEY=your_ca_api_key
TEXAS_IFTA_API_KEY=your_tx_api_key
FLORIDA_IFTA_API_KEY=your_fl_api_key
# ... additional state API keys as available

# Business IFTA Registration
IFTA_ACCOUNT_NUMBER=your_ifta_account_number
IFTA_BASE_JURISDICTION=GA  # Base state for IFTA registration
```

## 📊 Integration Features

### Automated Data Collection

1. **Fuel Purchase Tracking**: Integrate with fuel card APIs
2. **GPS Mileage Calculation**: Real-time state-by-state mileage
3. **Route Optimization**: Plan routes for fuel tax efficiency
4. **Receipt Management**: Digital receipt storage and OCR
5. **Vehicle Assignment**: Track fuel and mileage per vehicle

### Quarterly Return Generation

1. **Data Aggregation**: Compile fuel and mileage by state
2. **Tax Calculations**: Apply current tax rates per jurisdiction
3. **Net Tax Determination**: Calculate owed vs. refund amounts
4. **Form Generation**: Create IFTA quarterly return forms
5. **Electronic Filing**: Submit to state portals where available

### Compliance Monitoring

- **Filing Deadlines**: Track quarterly due dates (last day of month following quarter)
- **Registration Status**: Monitor IFTA registration in all jurisdictions
- **Audit Preparation**: Maintain detailed supporting documentation
- **Penalty Avoidance**: Automated reminders and filing

## 🚨 Compliance Features

### IFTA Requirements

- **Quarterly Filing**: Returns due by last day of month following quarter
- **Detailed Records**: Fuel receipts and mileage logs required
- **Multi-jurisdiction**: File in all states where vehicle operated
- **Audit Support**: Maintain 4+ years of detailed records

### Penalty Prevention

- **Late Filing**: Avoid $50+ penalties per jurisdiction
- **Incomplete Records**: Prevent audit assessment penalties
- **Underpayment**: Accurate calculations prevent interest charges
- **Registration Lapses**: Monitor and renew IFTA registrations

## 🔧 Implementation Steps

### Phase 1: Core IFTA Service

1. Create IFTA State Portal service
2. Set up jurisdiction data and tax rates
3. Implement fuel purchase and mileage tracking
4. Add database schema extensions

### Phase 2: Calculation Engine

1. Build quarterly return calculation logic
2. Implement multi-state tax calculations
3. Create compliance monitoring system
4. Add audit trail functionality

### Phase 3: State Portal Integration

1. Integrate with available state APIs
2. Implement electronic filing where supported
3. Create manual filing support for remaining states
4. Add status monitoring and confirmations

### Phase 4: UI and Automation

1. Create IFTA management dashboard
2. Add automated fuel/mileage data import
3. Implement filing reminders and alerts
4. Create reporting and analytics

## 📈 Business Value

### Cost Savings

- **Automated Processing**: Reduce manual quarterly filing work
- **Penalty Avoidance**: Prevent late filing and underpayment penalties
- **Fuel Tax Optimization**: Identify states with lower fuel costs
- **Administrative Efficiency**: Eliminate paper-based record keeping

### Operational Benefits

- **Real-time Compliance**: Continuous monitoring of IFTA obligations
- **Audit Readiness**: Maintain detailed, organized records
- **Multi-state Management**: Handle all jurisdictions from single platform
- **Integration**: Seamless with existing fleet management workflows

### Competitive Advantage

- **Complete Solution**: End-to-end IFTA compliance management
- **Automation**: Reduce customer administrative burden
- **Accuracy**: Eliminate human calculation errors
- **Scalability**: Handle fleets of any size across all states

## 🧪 Testing Strategy

### Mock Data Testing

- Use sample fuel purchases and mileage data
- Test quarterly return calculations
- Validate tax rate applications
- Verify compliance monitoring

### State API Integration

- Test with sandbox environments where available
- Validate electronic filing workflows
- Test error handling and retry logic
- Monitor API rate limits and quotas

## 📋 Success Metrics

### Technical Metrics

- Return calculation accuracy: 100%
- Filing success rate: >95%
- API response time: <3 seconds
- Data integrity: 100%

### Business Metrics

- Customer compliance rate: >98%
- Penalty reduction: >90%
- Administrative time savings: >80%
- Customer satisfaction: >4.5/5

## 🚀 Production Readiness Checklist

- [ ] IFTA State Portal service implementation
- [ ] Database schema extensions
- [ ] Jurisdiction data and tax rates
- [ ] Fuel purchase tracking system
- [ ] Mileage recording system
- [ ] Quarterly return calculation engine
- [ ] State API integrations (where available)
- [ ] Compliance monitoring system
- [ ] UI dashboard implementation
- [ ] Testing and validation
- [ ] Documentation and training

---

**Next Steps**: Begin implementation with IFTA State Portal service and jurisdiction data setup.

