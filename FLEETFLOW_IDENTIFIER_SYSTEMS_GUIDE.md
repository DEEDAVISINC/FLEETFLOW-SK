# 🔍 FleetFlow Identifier Systems - Complete Guide

**FleetFlow's comprehensive identifier reference guide covering all numbering systems, formats, and
use cases across the platform.**

---

## 📋 **TABLE OF CONTENTS**

1. [Load Identification Systems](#1-load-identification-systems)
2. [User Identification Systems](#2-user-identification-systems)
3. [Invoice Identification Systems](#3-invoice-identification-systems)
4. [EDI Identification Systems](#4-edi-identification-systems)
5. [Document Identification Systems](#5-document-identification-systems)
6. [Shipper Identification Systems](#6-shipper-identification-systems)
7. [System-to-System Mapping](#7-system-to-system-mapping)
8. [Phone Reference Guide](#8-phone-reference-guide)

---

## 1. **LOAD IDENTIFICATION SYSTEMS**

### **1.1 Load Board Number (Phone Reference)**

- **Format**: `100001` (6-digit number)
- **System**: `EDIService.generateLoadBoardId()`
- **Use**: Phone communication between carriers and dispatchers
- **Example**: `100001`, `200002`, `300003`
- **Display**: "📞 Board #100001"
- **Purpose**: Simple reference for phone calls - "Hi, I'm calling about load board number 100001"

### **1.2 Load Identifier (Comprehensive)**

- **Format**: `MJ-25015-LAXPHX-SMP-DVF-001`
- **System**: `LoadIdentificationService.generateLoadIdentifiers()`
- **Breakdown**:
  - `MJ` = Broker initials
  - `25015` = Date code (day 150 of 2025)
  - `LAXPHX` = Route code (LAX to PHX)
  - `SMP` = Shipper code
  - `DVF` = Load type code
  - `001` = Sequence number
- **Use**: Internal tracking, EDI transactions, comprehensive load management
- **Purpose**: Full load traceability with encoded business intelligence

### **1.3 Internal Load ID**

- **Format**: `L-001`, `L-002`, etc.
- **System**: Internal database reference
- **Use**: Simple database keys and form references
- **Purpose**: Basic load identification for system operations

### **1.4 BOL Number (Bill of Lading)**

- **Format**: `BOL-MJ25015-001`
- **System**: Generated from Load Identifier
- **Breakdown**:
  - `BOL` = Bill of Lading prefix
  - `MJ25015` = Broker + date code
  - `001` = Sequence number
- **Use**: Legal shipping document identification
- **Purpose**: Official freight documentation and tracking

---

## 2. **USER IDENTIFICATION SYSTEMS**

### **2.1 User ID System**

- **Format**: `{Initials}-{DeptCode}-{HireDateCode}`
- **System**: Settings page user creation
- **Examples**:
  - `SJ-DC-2023005` (Sarah Johnson, Dispatcher, hired day 5 of 2023)
  - `ED-BB-2024061` (Edward Davis, Broker, hired day 61 of 2024)
  - `FM-MGR-2023005` (Frank Miller, Manager, hired day 5 of 2023)

### **2.2 Department Codes**

- **DC**: Dispatcher (blue color scheme)
- **BB**: Broker Agent (orange color scheme)
- **DM**: Driver (yellow color scheme)
- **MGR**: Management (purple color scheme)

### **2.3 User Initials Extraction**

- **System**: `getUserInitials(userName)`
- **Logic**: First letter of first + last name
- **Examples**:
  - "Sarah Johnson" → "SJ"
  - "Edward Davis" → "ED"
  - "SingleName" → "SI" (first 2 letters)

---

## 3. **INVOICE IDENTIFICATION SYSTEMS**

### **3.1 Invoice Number Format**

- **Current Format**: `INV-{DeptCode}-{UserInitials}-{CoreID}`
- **System**: `generateInvoiceNumber()` in `invoiceService.ts`
- **Examples**:
  - `INV-DC-SJ-MJ25015-001` (Dispatcher Sarah Johnson)
  - `INV-BB-ED-MJ25015-001` (Broker Edward Davis)

### **3.2 Invoice Components**

- **INV**: Invoice prefix
- **DC/BB**: Department code (Dispatcher/Broker)
- **SJ/ED**: User initials (accountability)
- **MJ25015-001**: Core identifier from BOL number

### **3.3 Invoice Data Structure**

```typescript
interface InvoiceData {
  id: string;                    // Full invoice number
  loadId: string;               // Load identifier
  loadBoardNumber?: string;     // Board # for phone reference
  bolNumber?: string;           // BOL number
  departmentCode?: string;      // DC/BB
  userInitials?: string;        // User accountability
  loadIdentifier?: string;      // Full load identifier
  // ... financial and carrier data
}
```

---

## 4. **EDI IDENTIFICATION SYSTEMS**

### **4.1 EDI Identifier Types**

- **SCAC**: Standard Carrier Alpha Code
- **PRO**: Progressive Number
- **BOL**: Bill of Lading Number
- **GLN**: Global Location Number
- **DUNS**: Data Universal Numbering System
- **LoadNumber**: Load tracking number
- **TrailerNumber**: Trailer identification
- **SealNumber**: Seal identification
- **ContainerNumber**: Container ID
- **PONumber**: Purchase Order number
- **CustomerReference**: Customer reference
- **DeliveryNumber**: Delivery confirmation
- **HazmatID**: Hazardous materials ID
- **NMFC**: National Motor Freight Classification
- **AppointmentNumber**: Scheduling reference
- **ShipperID**: Shipper identification

### **4.2 EDI Service Functions**

- **System**: `EDIService` class
- **Functions**:
  - `generateIdentifiers()`: Creates EDI-compliant IDs
  - `validateIdentifier()`: Validates EDI format compliance
  - `generateLoadIdFromData()`: Creates load identifiers
  - `generateLoadBoardNumber()`: Creates board numbers

---

## 5. **DOCUMENT IDENTIFICATION SYSTEMS**

### **5.1 BOL Workflow System**

- **Submission ID**: `BOL-{timestamp}-{random}`
- **System**: `BOLWorkflowService`
- **Example**: `BOL-1640995200000-abc123def`
- **Use**: BOL submission tracking and workflow management

### **5.2 Document Management**

- **Format**: Various document-specific formats
- **System**: `document-management.ts`
- **Types**: Rate confirmations, BOLs, invoices, contracts
- **URL Structure**: `/documents/{type}-{id}.pdf`

---

## 6. **SHIPPER IDENTIFICATION SYSTEMS**

### **6.1 Permanent Shipper ID**

- **Format**: `{CompanyInitials}-204-{CommodityCode}`
- **System**: `generatePermanentShipperId()`
- **Example**: `WAL-204-53000` (Walmart, general freight)
- **Use**: Permanent shipper identification across all transactions

### **6.2 EDI Shipper Identifier**

- **Format**: Complex EDI-compliant structure
- **System**: `EDIService.generateShipperIdentifier()`
- **Components**: Company initials, transaction codes, commodity codes
- **Use**: EDI transaction compliance and shipper traceability

---

## 7. **SYSTEM-TO-SYSTEM MAPPING**

### **7.1 Load → Invoice Flow**

```
Load Identifier: MJ-25015-LAXPHX-SMP-DVF-001
       ↓
BOL Number: BOL-MJ25015-001
       ↓
Invoice Number: INV-DC-SJ-MJ25015-001
       ↓
Board Number: 100001 (for phone reference)
```

### **7.2 User → Invoice Accountability**

```
User: Sarah Johnson (Dispatcher)
       ↓
Department: DC (Dispatcher Code)
       ↓
Initials: SJ (Sarah Johnson)
       ↓
Invoice: INV-DC-SJ-{LoadCore}
```

### **7.3 Phone → System Lookup**

```
Customer calls: "Load board number 100001"
       ↓
System lookup: Board #100001
       ↓
Find: Load L-001, Identifier MJ-25015-LAXPHX-SMP-DVF-001
       ↓
Related: BOL-MJ25015-001, INV-DC-SJ-MJ25015-001
```

---

## 8. **PHONE REFERENCE GUIDE**

### **8.1 Customer Service Scripts**

**Incoming Call Example:**

- **Customer**: "Hi, I'm calling about load board number 100001"
- **Dispatcher**: "Yes, that's board number 100001 for load MJ-25015-LAXPHX-SMP-DVF-001, Los Angeles
  to Phoenix"
- **Reference**: BOL-MJ25015-001, Invoice INV-DC-SJ-MJ25015-001

### **8.2 Internal Communication**

- **Load Management**: Use Load Identifier (MJ-25015-LAXPHX-SMP-DVF-001)
- **Phone Communication**: Use Board Number (100001)
- **Documentation**: Use BOL Number (BOL-MJ25015-001)
- **Billing**: Use Invoice Number (INV-DC-SJ-MJ25015-001)

---

## 9. **IMPLEMENTATION LOCATIONS**

### **9.1 Service Files**

- `app/services/loadService.ts` - Load ID generation
- `app/services/EDIService.ts` - EDI identifier management
- `app/services/LoadIdentificationService.ts` - Comprehensive load IDs
- `app/services/invoiceService.ts` - Invoice numbering
- `app/services/bol-workflow/BOLWorkflowService.ts` - BOL management

### **9.2 UI Display Locations**

- `app/dispatch/page.tsx` - Load management and invoice display
- `app/components/InvoiceCreationModal.tsx` - Invoice creation
- Load boards throughout the application
- Phone reference displays

---

## 10. **BEST PRACTICES**

### **10.1 Phone Communications**

- Always use Board Numbers (100001) for phone references
- Keep Board Numbers visible in all load displays
- Train staff on Board Number → Load Identifier lookup

### **10.2 Documentation**

- Use BOL Numbers for all legal shipping documents
- Include Load Identifiers in internal documentation
- Reference Invoice Numbers for billing disputes

### **10.3 System Integration**

- Maintain mapping between all identifier systems
- Ensure unique generation across all systems
- Implement validation for all identifier formats

---

**Last Updated**: January 2025 **System Version**: FleetFlow Enterprise Platform **Maintained by**:
FleetFlow Development Team

---

_This guide covers all identifier systems across the FleetFlow platform. For system updates or
additions, contact the development team._
