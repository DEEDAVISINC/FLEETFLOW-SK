# 📦 Logistics & Shipping Reference Guide

## Overview

This comprehensive reference guide covers essential logistics, shipping, and freight forwarding
terminology, acronyms, and industry standards. This information is used throughout FleetFlow to
ensure accurate communication, documentation, and operations.

---

## 🚢 Container Specifications

### **Standard Container Markings**

Every shipping container displays critical information:

1. **Container Number** (e.g., BICU 1234567-4)
   - Prefix: Owner's code (4 letters)
   - Number: Unique identifier (6-7 digits)
   - Check digit: Validation number

2. **Maximum Gross Weight** (e.g., 32,500 KG / 71,650 LBS)
   - Maximum total weight including container and cargo

3. **Tare Weight** (e.g., 3,660 KG / 8,070 LBS)
   - Weight of empty container

4. **Maximum Payload/Net Weight** (e.g., 28,840 KG / 63,680 LBS)
   - Maximum cargo weight allowed

5. **Capacity** (e.g., 67.6 CU. M. / 2,386 CU. FT.)
   - Internal volume capacity

6. **Container Prefixes by Carrier:**

### **MSC - Mediterranean Shipping Company** 🇮🇹🇨🇭

- **Prefixes:** MSCU / GLDU / MEDU / MSDU
- **Example:** MSCU 1234567
- **Note:** World's largest container fleet since 2022
- **Headquarters:** Italy/Switzerland

### **Maersk** 🇩🇰

- **Prefixes:** MAEU
- **Example:** MAEU 123456-7
- **Note:** First to operate vessels using green methanol
- **Headquarters:** Denmark

### **CMA CGM** 🇫🇷

- **Prefixes:** CMAU / CGMU / CGHU / CGTU
- **Example:** CMAU 123456-7
- **Note:** Owns CEVA Logistics, strengthening end-to-end logistics integration
- **Headquarters:** France

### **Hapag-Lloyd** 🇩🇪

- **Prefixes:** HLXU / HLCU / HLBU
- **Example:** HLXU 123456-7
- **Note:** Recognized leader in IMO/DG (dangerous goods) transportation
- **Headquarters:** Germany

### **Evergreen Marine** 🇹🇼

- **Prefixes:** EISU / EGHU / EITU / EGSU
- **Example:** EISU 123456-7
- **Note:** Widely known for the Ever Given incident (Suez Canal, 2021)
- **Headquarters:** Taiwan

### **Ocean Network Express (ONE)** 🇯🇵

- **Prefixes:** ONEU / MOSU / NYKU
- **Example:** ONEU 123456-7
- **Note:** Established in 2018 through merger of K Line, MOL, and NYK
- **Headquarters:** Japan

### **COSCO Shipping Lines** 🇨🇳

- **Prefixes:** CCLU / CSLU / CSNU
- **Example:** CCLU 123456-7
- **Note:** Owner of OOCL and operator of multiple global terminals
- **Headquarters:** China

### **Yang Ming Marine Transport** 🇹🇼

- **Prefixes:** YMLU / YMMU
- **Example:** YMLU 123456-7
- **Note:** Strong expertise in refrigerated container operations with remote monitoring
- **Headquarters:** Taiwan

### **ZIM Integrated Shipping Services** 🇮🇱

- **Prefixes:** ZIMU / ZMOU / GSLU
- **Example:** ZIMU 123456-7
- **Note:** Pioneer in digital and blockchain-based shipping solutions
- **Headquarters:** Israel

### **Other Markings:**

- **Classification Mark** - Safety/hazard classification
- **Owner's Logo** - Shipping line branding
- **Repair Recommendation** - Maintenance status
- **Combined Data Plate** - CSC safety approval
- **Height Warning** - For high-cube containers
- **Manufacturer's Logo** - Container builder

---

## 📋 Container Number Structure (ISO 6346 - BIC)

### **Standard Format:**

All container prefixes follow **ISO 6346** and are registered with the **BIC (Bureau International
des Containers)**. This guarantees unique global identification and standardized recognition across
all shipping systems.

### **Container Number Breakdown:**

```
Example: MSCU 1234567
         ^^^^  ^^^^^^ ^
         |     |      |
         |     |      └─ Check digit (verification)
         |     └──────── Serial number (6 digits)
         └────────────── Owner's prefix (3 letters) + Equipment type (1 letter)
```

### **Components:**

1. **First 3 letters:** Owner's prefix (e.g., MSC, MAE, CMA)
2. **4th letter:** Equipment type
   - **"U"** = Cargo container (most common)
   - **"J"** = Tank container
   - **"Z"** = Platform/flat rack
3. **Next 6 digits:** Serial number (unique identifier)
4. **Final digit:** Check digit (mathematical verification for accuracy)

### **Examples:**

- **MSCU 1234567** - MSC cargo container
- **MAEU 9876543** - Maersk cargo container
- **CMAU 5555555** - CMA CGM cargo container

---

## ⚠️ Why Container Prefix Knowledge is Essential

### **1. Accurate Identification**

Quickly determine the carrier and container type from the prefix.

**Impact:** Speeds up documentation, tracking, and communication.

### **2. Error Prevention**

Minimize Bill of Lading (BL) and Manifest discrepancies that can delay shipments.

**Critical Error:** Using an incorrect prefix when preparing the Bill of Lading often results in
**EDI/Manifest/BL rejection** at ports.

**Cost Impact:**

- **Demurrage charges** - Container detention fees while errors are corrected
- **Detention charges** - Equipment rental fees during delays
- **Port delays** - Lost vessel connections and rescheduling costs

### **3. Operational Alignment**

Improve coordination with terminals, freight forwarders, and trucking partners.

**Benefits:**

- Faster container pickup/delivery
- Accurate terminal gate passes
- Proper equipment interchange receipts
- Streamlined customs documentation

### **4. Compliance and Standards**

All prefixes are ISO 6346 compliant and BIC-registered, ensuring:

- Global standardization
- Legal documentation accuracy
- International shipping compliance
- Seamless system integration

---

## 🎯 Common Errors to Avoid

### **⚠️ Incorrect Prefix in Documentation**

**Problem:** Writing "MSKU" instead of "MSCU" on Bill of Lading

**Result:**

- EDI transmission rejection
- Customs hold
- Port terminal refuses container
- Delay in vessel loading
- Demurrage and detention charges

**Solution:** Always verify container prefix against physical container markings and carrier
documentation.

### **⚠️ Mixing Up Similar Prefixes**

**Problem:** Confusing CMAU (CMA CGM) with CGMU (also CMA CGM)

**Result:**

- Tracking system errors
- Incorrect carrier billing
- Documentation mismatches

**Solution:** Use FleetFlow's carrier prefix validation system to auto-verify prefixes.

### **⚠️ Incorrect Check Digit**

**Problem:** Transposing numbers in container number

**Result:**

- Failed system validation
- Documentation rejection
- Manual correction delays

**Solution:** FleetFlow automatically calculates and validates check digits using ISO 6346
algorithm.

---

## 🌍 Types of Logistics

### **1. Inbound Logistics**

Transporting, receiving, and storing materials or products from suppliers to the business.

**Use Cases:**

- Raw material delivery
- Component sourcing
- Supplier coordination
- Warehouse receiving

### **2. Outbound Logistics**

Delivering finished products from the business to customers or stores, including packing and
shipping.

**Use Cases:**

- Order fulfillment
- Customer delivery
- Distribution to retailers
- Last-mile delivery

### **3. Reverse Logistics**

Handling the return of goods from customers for refunds, repairs, or recycling.

**Use Cases:**

- Product returns
- Warranty repairs
- Recycling programs
- Defective goods handling

### **4. Third-Party Logistics (3PL)**

Outsourcing logistics tasks like storage, transportation, or delivery to another company.

**Services:**

- Warehousing
- Transportation
- Order fulfillment
- Inventory management

### **5. Fourth-Party Logistics (4PL)**

Outsourcing the entire supply chain to a single company that manages all logistics activities.

**Services:**

- Complete supply chain management
- 3PL coordination
- Strategic planning
- Technology integration

### **6. Distribution Logistics**

Moving goods from factories to customers or retailers, including warehousing and delivery.

**Components:**

- Transportation management
- Warehouse operations
- Order processing
- Inventory control

---

## 📋 Logistics Acronyms

### **Transport & Freight**

| Acronym | Full Name                   | Description                                     |
| ------- | --------------------------- | ----------------------------------------------- |
| **FTL** | Full Truckload              | Complete truck dedicated to one shipment        |
| **LTL** | Less Than Truckload         | Partial truck space shared with other shipments |
| **FCL** | Full Container Load         | One shipper uses entire container               |
| **LCL** | Less than Container Load    | Multiple shippers share one container           |
| **ETA** | Estimated Time of Arrival   | When shipment is expected to arrive             |
| **ETD** | Estimated Time of Departure | When shipment is expected to leave              |

### **Logistics & Operations**

| Acronym     | Full Name                        | Description                               |
| ----------- | -------------------------------- | ----------------------------------------- |
| **3PL**     | Third-Party Logistics            | Outsourced logistics provider             |
| **4PL**     | Fourth-Party Logistics           | Complete supply chain manager             |
| **WMS**     | Warehouse Management System      | Software for warehouse operations         |
| **TMS**     | Transportation Management System | Software for transportation planning      |
| **OMS**     | Order Management System          | Software for order processing             |
| **BOL/B/L** | Bill of Lading                   | Legal shipping document issued by carrier |

### **Shipping & Trade**

| Acronym     | Full Name                   | Description                               |
| ----------- | --------------------------- | ----------------------------------------- |
| **AWB**     | Air Waybill                 | Air cargo shipping document               |
| **POD**     | Proof of Delivery           | Confirmation of delivery receipt          |
| **EDI**     | Electronic Data Interchange | Automated business document exchange      |
| **HS Code** | Harmonized System Code      | International customs classification code |

### **Customs & Compliance**

| Acronym  | Full Name                                          | Description                                       |
| -------- | -------------------------------------------------- | ------------------------------------------------- |
| **CBM**  | Cubic Meter                                        | Measurement of cargo volume                       |
| **CFS**  | Container Freight Station                          | Consolidation/deconsolidation facility            |
| **FCA**  | Free Carrier                                       | Incoterm - seller responsibility ends at carrier  |
| **EORI** | Economic Operators Registration and Identification | EU customs registration number                    |
| **HSSE** | Health, Safety, Security, Environment              | Safety compliance standards                       |
| **EPW**  | Ex Works                                           | Buyer takes responsibility from seller's location |

---

## 🌐 International Trade Terms (INCOTERMS)

### **FOB - Free On Board**

- **Responsibility:** Seller delivers goods onto vessel
- **Buyer Pays:** Ocean freight & insurance
- **Risk Transfer:** At ship's rail
- **Best For:** Ocean freight shipments

### **CIF - Cost, Insurance & Freight**

- **Responsibility:** Seller covers cost + freight + insurance
- **Coverage:** Up to destination port
- **Risk Transfer:** At origin port
- **Best For:** International ocean shipments

### **DDP - Delivered Duty Paid**

- **Responsibility:** Seller handles ALL costs including customs
- **Coverage:** Including duties and delivery to buyer's door
- **Risk Transfer:** At final destination
- **Best For:** Door-to-door service

### **EXW - Ex Works**

- **Responsibility:** Buyer takes full responsibility from seller's warehouse
- **Coverage:** Buyer arranges everything
- **Risk Transfer:** Immediately at pickup
- **Best For:** Buyers with logistics expertise

---

## 📄 Customs & Documentation

### **Essential Documents**

**HS Code** - Harmonized System Code

- International code for customs classification
- Determines duties and taxes
- Required for all international shipments

**COO** - Certificate of Origin

- Document proving origin country of goods
- Required for customs clearance
- Determines duty rates (trade agreements)

**CI** - Commercial Invoice

- Seller's invoice with product, value, and buyer info
- Required for customs declaration
- Includes HS codes and descriptions

**PL** - Packing List

- Detailed list of packed items in shipment
- Includes weights and dimensions
- Used for customs inspection

**ISF** - Importer Security Filing

- U.S. customs filing before cargo arrives
- Required 24 hours before vessel loading
- Also known as "10+2" filing

---

## 📦 Procurement Acronyms

### **Procurement & Sourcing**

| Acronym | Full Name               | Description                           |
| ------- | ----------------------- | ------------------------------------- |
| **RFQ** | Request for Quotation   | Ask suppliers for price offers        |
| **RFP** | Request for Proposal    | Ask suppliers for solutions + pricing |
| **RFI** | Request for Information | Collect info before tendering         |
| **RFx** | Generic Request Term    | Covers RFL, RFQ, RFP                  |
| **PO**  | Purchase Order          | Formal buyer order to supplier        |
| **PR**  | Purchase Requisition    | Internal request for a purchase       |
| **SOW** | Statement of Work       | Details what supplier must deliver    |
| **LOI** | Letter of Intent        | Early commitment before contract      |

### **Contracting & Compliance**

| Acronym | Full Name                 | Description                     |
| ------- | ------------------------- | ------------------------------- |
| **MSA** | Master Service Agreement  | Broad contract framework        |
| **NDA** | Non-Disclosure Agreement  | Confidentiality contract        |
| **SLA** | Service Level Agreement   | Performance commitments         |
| **KPI** | Key Performance Indicator | Supplier performance metrics    |
| **TCO** | Total Cost of Ownership   | All costs beyond purchase price |

### **Supplier Management**

| Acronym | Full Name                        | Description                     |
| ------- | -------------------------------- | ------------------------------- |
| **SRM** | Supplier Relationship Management | Managing supplier relationships |
| **VMI** | Vendor Managed Inventory         | Supplier manages buyer's stock  |
| **SLA** | Supplier License Agreement       | Software/service licensing      |
| **MOQ** | Minimum Order Quantity           | Smallest order supplier accepts |

---

## 🚢 Top Container Shipping Lines

### **Global Shipping Leaders**

1. **Mediterranean Shipping Company (MSC)** 🇨🇭
   - Capacity: 6.1M TEU
   - Fleet: 850+ vessels
   - HQ: Switzerland
   - Prefix: MSCU

2. **Maersk** 🇩🇰
   - Capacity: 4.2M TEU
   - Fleet: 700+ vessels
   - HQ: Denmark
   - Prefix: MAEU

3. **CMA CGM** 🇫🇷
   - Capacity: 3.8M TEU
   - Fleet: 600+ vessels
   - HQ: France
   - Prefix: CMAU

4. **COSCO Shipping Lines** 🇨🇳
   - Capacity: 3.3M TEU
   - Fleet: 500+ vessels
   - HQ: China
   - Prefix: CCLU

5. **Hapag-Lloyd** 🇩🇪
   - Capacity: 2.1M TEU
   - Fleet: 250+ vessels
   - HQ: Germany
   - Prefix: HLXU

6. **Ocean Network Express (ONE)** 🇯🇵
   - Capacity: 1.8M TEU
   - Fleet: 230+ vessels
   - HQ: Japan
   - Prefix: ONEU

7. **Evergreen Marine** 🇹🇼
   - Capacity: 0.7M TEU
   - Fleet: 90+ vessels
   - HQ: Taiwan
   - Prefix: EISU

8. **Yang Ming Marine Transport** 🇹🇼
   - Capacity: 0.7M TEU
   - Fleet: 150+ vessels
   - HQ: Taiwan
   - Prefix: YMLU

9. **ZIM Integrated Shipping Services** 🇮🇱
   - Regional carrier
   - Focus: Trans-Pacific & Atlantic routes
   - Prefix: ZIMU

---

## 💡 FleetFlow Implementation

### **How This Information is Used:**

1. **Document Generation**
   - Auto-populate HS codes
   - Generate commercial invoices
   - Create packing lists
   - Prepare ISF filings

2. **Container Tracking**
   - Recognize carrier by prefix
   - Calculate weight/volume compliance
   - Track by container number
   - Validate container specifications

3. **Incoterms Calculation**
   - Determine cost responsibility
   - Calculate duties and taxes
   - Assign shipping costs
   - Define risk transfer points

4. **Carrier Integration**
   - API connections with major carriers
   - Real-time tracking updates
   - Rate comparison
   - Schedule management

5. **Compliance Automation**
   - HS code validation
   - Document checklist generation
   - Customs filing preparation
   - Certificate of origin creation

6. **Client Communication**
   - Use industry-standard terminology
   - Generate professional documentation
   - Provide accurate ETAs/ETDs
   - Clear cost breakdowns

---

## 📊 Best Practices

### **Documentation:**

✅ Always use correct acronyms and terminology ✅ Include all required customs documents ✅ Verify
HS codes for accuracy ✅ Maintain digital copies of all documents ✅ Track document expiration dates

### **Container Management:**

✅ Verify container specifications before booking ✅ Calculate payload to avoid overweight ✅ Check
container condition on arrival ✅ Document any damage with photos ✅ Return containers on time to
avoid demurrage

### **Carrier Selection:**

✅ Compare rates across multiple carriers ✅ Consider transit time vs. cost ✅ Check carrier
reliability ratings ✅ Verify service to destination port ✅ Review carrier's claims process

### **Customs Compliance:**

✅ File ISF 24 hours before loading ✅ Ensure accurate HS code classification ✅ Maintain proper
documentation ✅ Declare all goods accurately ✅ Pay duties and taxes on time

---

## 🎯 Quick Reference

### **Most Common Terms in FleetFlow:**

- **FCL/LCL** - Container load type
- **ETA/ETD** - Timing estimates
- **BOL** - Primary shipping document
- **HS Code** - Customs classification
- **Incoterms** - Cost/risk responsibility
- **3PL/4PL** - Service provider types
- **TEU** - Container capacity measurement
- **CBM** - Volume measurement
- **POD** - Delivery confirmation
- **ISF** - U.S. customs filing

---

## Summary

This reference guide provides the foundation for accurate, professional freight forwarding
operations within FleetFlow. All terminology, acronyms, and standards are internationally recognized
and ensure seamless communication with carriers, customs, clients, and partners worldwide.

**📚 Source:** Industry-standard logistics and shipping references, INCOTERMS 2020, International
Chamber of Commerce guidelines, and major carrier specifications.
