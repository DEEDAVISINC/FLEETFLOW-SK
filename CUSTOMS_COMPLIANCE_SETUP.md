# Customs Compliance Setup Guide

## Phase 1: Denied Party Screening + HS Code Database

### 1. Trade.gov API Registration (REQUIRED - 2 minutes)

**What it is:** Free API access to U.S. government trade data **Cost:** $0 (completely free)
**Time:** 2 minutes **URL:** https://developer.trade.gov/

#### Registration Steps:

1. Go to https://developer.trade.gov/
2. Click "Get API Key"
3. Fill out form:
   - Name: Dieasha Davis
   - Email: your@email.com
   - Organization: FleetFlow TMS LLC
   - Website: fleetflowapp.com
4. Check email for instant API key
5. Done! 🎉

#### API Key Setup:

Add to your `.env` file:

```env
TRADE_GOV_API_KEY=your-api-key-here
```

#### What you get:

- ✅ Denied Party Screening API
- ✅ Tariff Rates API
- ✅ Unlimited requests
- ✅ No ongoing costs

### 2. USITC HTS Database (NO REGISTRATION)

**What it is:** Complete Harmonized Tariff Schedule database **Cost:** $0 (public domain) **URL:**
https://hts.usitc.gov/current

#### Setup Steps:

1. Download Excel files from https://hts.usitc.gov/current
2. Import into your PostgreSQL database
3. Create table structure for HS codes
4. Done! No API key needed

### 3. Testing Your Setup

#### Test Denied Party Screening:

```typescript
import { deniedPartyScreeningService } from './services/DeniedPartyScreeningService';

// Test screening
const result = await deniedPartyScreeningService.screenParty({
  name: 'Test Company Inc',
  country: 'China'
});

console.log('Screening result:', result);
```

#### Test HS Code Search:

```typescript
import { hsCodeService } from './services/HSCodeService';

// Test HS code search
const codes = await hsCodeService.searchByDescription('smartphone');
console.log('HS codes found:', codes);

// Test duty calculation
const duty = await hsCodeService.calculateDuty({
  hsCode: '8517.62.00',
  country: 'China',
  value: 1000
});
console.log('Duty calculation:', duty);
```

### 4. Integration Points

#### Freight Forwarder CRM (Automatic Screening):

```typescript
// When creating a new shipper
const screening = await deniedPartyScreeningService.screenShipper({
  companyName: shipperData.companyName,
  country: shipperData.country
});

if (!screening.passed) {
  throw new Error(`Shipper failed compliance screening: ${screening.riskLevel}`);
}
```

#### Quote Creation (HS Code Assignment):

```typescript
// When creating a quote
const hsCodes = await hsCodeService.searchByDescription(commodity.description);
const selectedHSCode = hsCodes[0]; // Let user choose

const duty = await hsCodeService.calculateDuty({
  hsCode: selectedHSCode.hsCode,
  country: destinationCountry,
  value: commodityValue
});

// Include in quote
quote.hsCode = selectedHSCode.hsCode;
quote.estimatedDuty = duty.dutyAmount;
```

#### Shipment Creation (Compliance Check):

```typescript
// Before booking shipment
const compliance = await deniedPartyScreeningService.screenForShipment({
  shipperName: shipment.shipperName,
  consigneeName: shipment.consigneeName,
  shipperCountry: shipment.originCountry,
  consigneeCountry: shipment.destinationCountry
});

if (!compliance.canProceed) {
  // Block shipment and alert compliance team
  await sendComplianceAlert(compliance.blockingMatches);
  throw new Error('Shipment blocked due to compliance issues');
}
```

### 5. Database Schema (PostgreSQL)

#### HS Codes Table:

```sql
CREATE TABLE hs_codes (
  hs_code VARCHAR(20) PRIMARY KEY,
  description TEXT NOT NULL,
  general_duty VARCHAR(20),
  special_duty VARCHAR(20),
  units VARCHAR(10),
  keywords TEXT[],
  category VARCHAR(50),
  subcategory VARCHAR(50),
  last_updated DATE DEFAULT CURRENT_DATE
);

-- Index for fast searching
CREATE INDEX idx_hs_keywords ON hs_codes USING GIN(keywords);
CREATE INDEX idx_hs_description ON hs_codes USING GIN(to_tsvector('english', description));
```

#### Screening Audit Table:

```sql
CREATE TABLE compliance_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(20) NOT NULL, -- 'SHIPPER', 'CONSIGNEE', 'CARRIER'
  entity_name VARCHAR(255) NOT NULL,
  entity_country VARCHAR(100),
  passed BOOLEAN NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  match_count INTEGER DEFAULT 0,
  matches JSONB,
  screened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  screened_by VARCHAR(100),
  source VARCHAR(100)
);

-- Index for reporting
CREATE INDEX idx_screening_date ON compliance_screenings(screened_at);
CREATE INDEX idx_screening_risk ON compliance_screenings(risk_level);
```

### 6. Monitoring & Alerts

#### Automatic Alerts:

- **CRITICAL**: OFAC SDN matches (immediate blocking + legal alert)
- **HIGH**: Entity List matches (review required)
- **MEDIUM**: Multiple low-risk matches (flag for review)
- **LOW**: Single matches (log only)

#### Email Alerts:

```typescript
// Compliance alert function
async function sendComplianceAlert(matches: ScreeningMatch[], shipmentId?: string) {
  const subject = `🚨 COMPLIANCE ALERT: Denied Party Match Detected`;

  const body = `
    Denied party screening has detected potential compliance issues:

    ${matches.map(match => `
    Name: ${match.name}
    Programs: ${match.programs.join(', ')}
    Risk Level: ${match.programs.includes('OFAC SDN List') ? 'CRITICAL' : 'HIGH'}
    `).join('\n')}

    ${shipmentId ? `Shipment ID: ${shipmentId}` : ''}

    Please review immediately and take appropriate action.
  `;

  // Send to compliance team
  await emailService.send({
    to: process.env.COMPLIANCE_ALERT_EMAIL || 'compliance@fleetflowapp.com',
    subject,
    body
  });
}
```

### 7. Next Steps (Phase 2)

Once Phase 1 is working:

1. **AES Filing Integration** - Automated export declarations
2. **ISF Filing** - Importer security filings
3. **ACE eManifest** - Complete customs integration

### 8. Cost Summary

| Component               | Setup Cost    | Monthly Cost | Status                       |
| ----------------------- | ------------- | ------------ | ---------------------------- |
| Trade.gov API           | $0            | $0           | ✅ Ready                     |
| USITC HTS Database      | $0            | $0           | ✅ Ready                     |
| Development (screening) | $15K-$25K     | $0           | 🚧 In Progress               |
| Development (HS codes)  | $10K-$20K     | $0           | 🚧 In Progress               |
| **Total**               | **$25K-$45K** | **$0**       | **Ready for implementation** |

### 9. Success Metrics

- ✅ 100% of shippers screened before onboarding
- ✅ 100% of shipments compliance-checked
- ✅ HS codes assigned to all quotes
- ✅ Duty calculations automated
- ✅ Zero compliance violations
- ✅ Audit trail for all screenings

---

## 🚀 Ready to Implement?

1. **Register for Trade.gov API** (2 minutes)
2. **Download HTS database** (10 minutes)
3. **Set up environment variables**
4. **Test the services**
5. **Integrate into your CRM and quoting**

This gives you **enterprise-grade customs compliance** at **zero ongoing cost**! 🎯
