# 🚢 FleetFlow Freight Forwarder Identification System

## Overview

Complete tracking number generation system for ocean and air freight forwarding operations
supporting **7 container types** and **40+ shipping documents**.

---

## 🎯 Features

### **Supported Container Types**

1. **STANDARD_DRY** - 20ft/40ft - Most common, for general cargo
2. **HIGH_CUBE** - 40ft/45ft HC - Extra height for larger/bulky items
3. **OPEN_TOP** - 20ft/40ft OT - Removable tarpaulin roof for oversized cargo
4. **FLAT_RACK** - 20ft/40ft FR - Flat bed with collapsible walls for heavy loads
5. **REFRIGERATED** - 20ft/40ft RF - Temperature-controlled for perishable goods (Reefer)
6. **OPEN_SIDE** - 20ft/40ft OS - Side doors for easier cargo access
7. **TANK** - 20ft/40ft TK - For transporting liquids and gases

### **Freight Modes**

- **OCEAN** - Sea freight (containers)
- **AIR** - Air cargo
- **OCEAN_AIR** - Combined ocean and air
- **GROUND** - Trucking/rail

### **Incoterms Support**

- EXW, FCA, FAS, FOB, CFR, CIF, CPT, CIP, DAP, DPU, DDP

### **Generated Identifiers**

#### Primary Identifiers

- **Shipment ID**: `FF-OCN-2025-0001`
- **Quote Number**: `FF-QT-250115-SHALOS-892`
- **Booking Number**: `BKDD25015CNUS-4A3B`

#### Ocean Freight Identifiers

- **Bill of Lading**: `BL20250115A3B2C1`
- **Container Numbers**: `MSCU4567890`, `MAEU1234567` (ISO 6346 format)
- **Seal Numbers**: `SEL25123456`
- **Voyage Number**: `V2501234`

#### Air Freight Identifiers

- **Air Waybill (AWB)**: `180-12345678` (IATA format)

#### Cross-Border Identifiers

- **Customs Entry**: `CE2025A3B21234`
- **PARS Number** (Canada): `PARSA3B225123456`
- **PAPS Number** (Canada): `PAPS25123456`
- **Pedimento Number** (Mexico): `2515123451`

#### Document References

- **Commercial Invoice**: `CI20250115A3B2`
- **Packing List**: `PL20250115C1D2`
- **Certificate of Origin**: `CO20250115E3F4`

---

## 📦 Usage Examples

### Example 1: Ocean Freight - Shanghai to Los Angeles (40ft HC DDP)

```typescript
import FreightForwarderIdentificationService, {
  FreightForwarderShipment
} from './services/FreightForwarderIdentificationService';

const shipment: FreightForwarderShipment = {
  mode: 'OCEAN',
  serviceType: 'DDP',
  incoterms: 'DDP',

  originPort: 'Shanghai (CNSHA)',
  destinationPort: 'Los Angeles (USLAX)',
  originCountry: 'China',
  destinationCountry: 'USA',

  containerType: 'HIGH_CUBE',
  containerSize: '40HC',
  containerQuantity: 2,

  shipperName: 'Shanghai Steel Manufacturing Co.',
  shipperCode: 'SSM',
  consigneeName: 'ABC Import Corp',
  consigneeCode: 'ABC',

  commodity: 'Steel Products',
  hsCode: '7210.49',
  commodityValue: 45000,
  currency: 'USD',

  bookingDate: '2025-01-15',
  etd: '2025-01-20',
  eta: '2025-02-15',

  isHazmat: false,
  isDDP: true,
  isTemperatureControlled: false,

  forwarderInitials: 'DD',
  forwarderBranch: 'LA'
};

const identifiers = FreightForwarderIdentificationService.generateIdentifiers(shipment);

console.log('Shipment ID:', identifiers.shipmentId);
// Output: FF-OCN-2025-0001

console.log('Quote Number:', identifiers.quoteNumber);
// Output: FF-QT-250115-SHALAX-892

console.log('Bill of Lading:', identifiers.billOfLadingNumber);
// Output: BL20250115A3B2C1

console.log('Container Numbers:', identifiers.containerNumbers);
// Output: ['MSCU4567890', 'MAEU1234567']

console.log('Seal Numbers:', identifiers.sealNumbers);
// Output: ['SEL25123456', 'SEL25123457']

console.log('Route Code:', identifiers.routeCode);
// Output: CNSHA-USLAX
```

### Example 2: Air Freight - Hong Kong to New York (Express)

```typescript
const airShipment: FreightForwarderShipment = {
  mode: 'AIR',
  serviceType: 'DDP',
  incoterms: 'DDP',

  originPort: 'Hong Kong (HKG)',
  destinationPort: 'New York (JFK)',
  originCountry: 'Hong Kong',
  destinationCountry: 'USA',

  airWeight: 850,
  volumetricWeight: 920,

  shipperName: 'HK Electronics Ltd',
  consigneeName: 'NYC Tech Distribution',

  commodity: 'Consumer Electronics',
  hsCode: '8517.12',
  commodityValue: 125000,
  currency: 'USD',

  bookingDate: '2025-01-15',
  etd: '2025-01-16',
  eta: '2025-01-17',

  specialInstructions: 'Handle with care - fragile electronics',

  forwarderInitials: 'DD'
};

const airIdentifiers = FreightForwarderIdentificationService.generateIdentifiers(airShipment);

console.log('Shipment ID:', airIdentifiers.shipmentId);
// Output: FF-AIR-2025-0002

console.log('Air Waybill:', airIdentifiers.airWaybillNumber);
// Output: 180-12345678

console.log('Customs Entry:', airIdentifiers.customsEntryNumber);
// Output: CE2025A3B21234
```

### Example 3: Refrigerated Container (Reefer) - Perishable Goods

```typescript
const reeferShipment: FreightForwarderShipment = {
  mode: 'OCEAN',
  serviceType: 'DDP',
  incoterms: 'CIF',

  originPort: 'Singapore (SGSIN)',
  destinationPort: 'Los Angeles (USLAX)',
  originCountry: 'Singapore',
  destinationCountry: 'USA',

  containerType: 'REFRIGERATED',
  containerSize: '40ft',
  containerQuantity: 1,

  shipperName: 'Fresh Produce Exports',
  consigneeName: 'West Coast Fresh Markets',

  commodity: 'Fresh Fruit',
  hsCode: '0805.10',
  commodityValue: 28000,
  currency: 'USD',

  bookingDate: '2025-01-15',
  etd: '2025-01-18',
  eta: '2025-02-05',

  isTemperatureControlled: true,
  specialInstructions: 'Maintain temperature at 2-4°C',

  forwarderInitials: 'DD'
};

const reeferIdentifiers = FreightForwarderIdentificationService.generateIdentifiers(reeferShipment);

console.log('Container Type in Tracking:', reeferIdentifiers.shipmentId);
// Container type tracked internally for proper handling
```

### Example 4: Canada Cross-Border Shipment

```typescript
const canadaShipment: FreightForwarderShipment = {
  mode: 'OCEAN',
  serviceType: 'DDP',
  incoterms: 'DDP',

  originPort: 'Shanghai (CNSHA)',
  destinationPort: 'Vancouver (CAVAN)',
  originCountry: 'China',
  destinationCountry: 'Canada',

  containerType: 'STANDARD_DRY',
  containerSize: '40ft',
  containerQuantity: 1,

  shipperName: 'China Manufacturing Co',
  consigneeName: 'Canadian Distribution Center',

  commodity: 'Furniture',
  commodityValue: 35000,
  currency: 'CAD',

  bookingDate: '2025-01-15',
  etd: '2025-01-20',
  eta: '2025-02-18',

  forwarderInitials: 'DD'
};

const canadaIdentifiers = FreightForwarderIdentificationService.generateIdentifiers(canadaShipment);

console.log('PARS Number:', canadaIdentifiers.parsNumber);
// Output: PARSA3B225123456

console.log('PAPS Number:', canadaIdentifiers.papsNumber);
// Output: PAPS25123456
```

---

## 🔧 Integration with Freight Forwarder Page

### Step 1: Import the Service

```typescript
// In app/freight-forwarders/page.tsx
import FreightForwarderIdentificationService, {
  FreightForwarderShipment,
  GeneratedFreightIdentifiers
} from '../services/FreightForwarderIdentificationService';
```

### Step 2: Generate Tracking Numbers on Quote Creation

```typescript
const handleGenerateQuote = () => {
  const shipmentData: FreightForwarderShipment = {
    mode: selectedMode, // 'OCEAN' or 'AIR'
    serviceType: quoteForm.serviceType,
    incoterms: quoteForm.serviceType as any,

    originPort: quoteForm.origin,
    destinationPort: quoteForm.destination,
    originCountry: extractCountry(quoteForm.origin),
    destinationCountry: extractCountry(quoteForm.destination),

    containerType: quoteForm.containerType as any,
    containerSize: quoteForm.containerType as any,
    containerQuantity: quoteForm.quantity,

    airWeight: quoteForm.weight,

    shipperName: quoteForm.customerName,
    consigneeName: quoteForm.customerName,

    commodity: quoteForm.commodity,
    commodityValue: calculatedRate,
    currency: 'USD',

    bookingDate: new Date().toISOString(),
    etd: calculateETD(),
    eta: calculateETA(),

    forwarderInitials: getUserInitials()
  };

  const trackingNumbers = FreightForwarderIdentificationService.generateIdentifiers(shipmentData);

  // Save to database or state
  setGeneratedQuote({
    ...calculatedQuote,
    trackingNumbers
  });
};
```

### Step 3: Display Tracking Numbers

```typescript
{generatedQuote && (
  <div style={{ marginTop: '20px' }}>
    <h4>Tracking Information</h4>
    <div style={{ display: 'grid', gap: '10px' }}>
      <div>
        <strong>Shipment ID:</strong> {trackingNumbers.shipmentId}
      </div>
      <div>
        <strong>Quote Number:</strong> {trackingNumbers.quoteNumber}
      </div>
      {trackingNumbers.billOfLadingNumber && (
        <div>
          <strong>Bill of Lading:</strong> {trackingNumbers.billOfLadingNumber}
        </div>
      )}
      {trackingNumbers.containerNumbers && (
        <div>
          <strong>Container Numbers:</strong> {trackingNumbers.containerNumbers.join(', ')}
        </div>
      )}
      {trackingNumbers.airWaybillNumber && (
        <div>
          <strong>Air Waybill:</strong> {trackingNumbers.airWaybillNumber}
        </div>
      )}
    </div>
  </div>
)}
```

---

## 📋 40 Shipping Documents Framework

The service tracks the following document categories:

### Export Documents (5)

- Commercial Invoice
- Packing List
- Bill of Lading
- Certificate of Origin
- Export License

### Import Documents (4)

- Import License
- Customs Declaration
- Delivery Order
- Proof of Delivery

### Financial Documents (4)

- Letter of Credit
- Bill of Exchange
- Insurance Certificate
- Inspection Certificate

### Specialized Documents (4)

- Dangerous Goods Declaration (Hazmat)
- Fumigation Certificate (Agricultural)
- Health Certificate (Food/Medical)
- Phytosanitary Certificate (Plants)

### Additional Documents (6)

- Cargo Manifest
- Dock Receipt
- Arrival Notice
- Customs Bond
- Certificate of Analysis
- Weight Certificate

_And 20+ more document types tracked by the system_

---

## 🚀 Production Deployment

### Environment Variables

```env
# Freight Forwarding Configuration
FF_SEQUENCE_START=1
FF_CARRIER_SCAC_CODE=FFTM
FF_DEFAULT_CURRENCY=USD
```

### Database Schema Recommendations

```sql
CREATE TABLE freight_shipments (
  id UUID PRIMARY KEY,
  shipment_id VARCHAR(20) UNIQUE NOT NULL,
  quote_number VARCHAR(30),
  booking_number VARCHAR(30),

  -- Mode and service
  freight_mode VARCHAR(20),
  service_type VARCHAR(10),
  incoterms VARCHAR(10),

  -- Locations
  origin_port VARCHAR(100),
  destination_port VARCHAR(100),
  origin_country VARCHAR(100),
  destination_country VARCHAR(100),

  -- Container info (for ocean)
  container_type VARCHAR(20),
  container_size VARCHAR(10),
  container_quantity INT,
  container_numbers JSONB,
  seal_numbers JSONB,

  -- Air info
  air_weight DECIMAL,
  awb_number VARCHAR(20),

  -- Cross-border
  customs_entry_number VARCHAR(30),
  pars_number VARCHAR(30),
  paps_number VARCHAR(30),
  pedimento_number VARCHAR(20),

  -- Documents
  bill_of_lading_number VARCHAR(30),
  commercial_invoice_number VARCHAR(30),
  packing_list_number VARCHAR(30),
  certificate_of_origin_number VARCHAR(30),

  -- References
  forwarder_reference VARCHAR(50),
  shipper_reference VARCHAR(50),
  consignee_reference VARCHAR(50),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shipment_id ON freight_shipments(shipment_id);
CREATE INDEX idx_booking_number ON freight_shipments(booking_number);
CREATE INDEX idx_container_numbers ON freight_shipments USING GIN(container_numbers);
```

---

## ✅ Validation & Verification

### Validate Shipment ID

```typescript
const isValid = FreightForwarderIdentificationService.validateShipmentId('FF-OCN-2025-0001');
// Returns: true

const parsed = FreightForwarderIdentificationService.parseShipmentId('FF-OCN-2025-0001');
console.log(parsed);
// Output: { mode: 'OCN', year: 2025, sequence: 1 }
```

---

## 🔐 Security & Compliance

- ✅ ISO 6346 compliant container numbers
- ✅ IATA compliant air waybill numbers
- ✅ Canada PARS/PAPS integration ready
- ✅ Mexico Pedimento format compliant
- ✅ Check digit validation for all critical numbers
- ✅ Audit trail with generated timestamps
- ✅ Version tracking for identifier format changes

---

## 📊 Analytics & Reporting

Track key metrics:

- Shipments by mode (Ocean/Air)
- Container type utilization
- Route popularity (port pairs)
- Cross-border processing times
- Document completion rates
- Average transit times by lane

---

## 🆘 Support

For questions or issues:

- Email: support@fleetflowapp.com
- Phone: (833) 386-3509
- Documentation: https://fleetflowapp.com/docs

---

**FleetFlow TMS LLC** - Enterprise Transportation Intelligence _WOSB Certified • Troy, Michigan_
