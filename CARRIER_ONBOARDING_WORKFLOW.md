# Carrier Onboarding Workflow - Implementation Guide

## 🚛 Comprehensive Carrier Onboarding System

### 📋 Overview
A complete carrier onboarding workflow that integrates FMCSA verification, documentation upload, factoring setup, and agreement management into the FleetFlow accounting system.

## 🔄 Onboarding Workflow Steps

### **Phase 1: Initial Verification**
1. **FMCSA Data Import** 📊
   - Automatic carrier information lookup
   - DOT number verification
   - MC number validation
   - Safety rating check
   - Operating authority verification

2. **Basic Information Collection** 📝
   - Company legal name
   - DBA (if applicable)
   - Physical address
   - Mailing address
   - Primary contact information
   - Equipment types and capacity

### **Phase 2: Documentation Upload**
3. **Required Documents** 📄
   - Operating Authority Letter
   - Notice of Assignment
   - Certificate of Insurance
   - Worker's Compensation Insurance
   - Cargo Insurance
   - Auto Liability Insurance
   - W-9 Tax Form
   - Voided Check (for ACH setup)

4. **Optional Documents** 📋
   - Additional Insurance Certificates
   - Equipment Photos
   - Driver Licenses
   - CDL Verification
   - Drug Testing Results

### **Phase 3: Financial Setup**
5. **Factoring Information** 🏦
   - Factor company details
   - Factor contact information
   - Factor agreement terms
   - Notice of Assignment setup
   - Factor verification

6. **Payment Preferences** 💳
   - ACH banking information
   - Check delivery preferences
   - Payment terms negotiation
   - Quick pay options

### **Phase 4: Agreement Execution**
7. **Broker-Carrier Agreement** 📜
   - Digital contract generation
   - Terms and conditions review
   - Electronic signature
   - Agreement archival

8. **Dispatcher-Carrier Agreement** 🤝
   - Service level agreements
   - Commission structure
   - Communication protocols
   - Performance metrics

### **Phase 5: Portal Access**
9. **Driver Portal Setup** 👤
   - Account creation
   - Password setup
   - Portal training
   - Document access permissions

## 🏗️ Technical Implementation

### **Database Schema**
```sql
-- Carriers Table
CREATE TABLE carriers (
    id UUID PRIMARY KEY,
    dot_number VARCHAR(20) UNIQUE NOT NULL,
    mc_number VARCHAR(20) UNIQUE,
    legal_name VARCHAR(255) NOT NULL,
    dba VARCHAR(255),
    operating_authority_type VARCHAR(50),
    safety_rating VARCHAR(20),
    onboarding_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Carrier Documents Table
CREATE TABLE carrier_documents (
    id UUID PRIMARY KEY,
    carrier_id UUID REFERENCES carriers(id),
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    upload_date TIMESTAMP DEFAULT NOW(),
    expiration_date DATE,
    status VARCHAR(50) DEFAULT 'pending_review',
    reviewed_by UUID,
    reviewed_at TIMESTAMP
);

-- Factoring Companies Table
CREATE TABLE factoring_companies (
    id UUID PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    verification_process TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Carrier Factoring Table
CREATE TABLE carrier_factoring (
    id UUID PRIMARY KEY,
    carrier_id UUID REFERENCES carriers(id),
    factoring_company_id UUID REFERENCES factoring_companies(id),
    factor_rate DECIMAL(5,2),
    advance_percentage DECIMAL(5,2),
    notice_of_assignment_url VARCHAR(500),
    effective_date DATE,
    expiration_date DATE,
    status VARCHAR(50) DEFAULT 'active'
);

-- Onboarding Tasks Table
CREATE TABLE onboarding_tasks (
    id UUID PRIMARY KEY,
    carrier_id UUID REFERENCES carriers(id),
    task_type VARCHAR(100) NOT NULL,
    task_description TEXT,
    required BOOLEAN DEFAULT true,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    due_date DATE,
    assigned_to UUID
);
```

### **React Components Structure**
```
/app/onboarding/
├── carrier-onboarding/
│   ├── page.tsx (Main onboarding dashboard)
│   ├── components/
│   │   ├── FMCSAVerification.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── FactoringSetup.tsx
│   │   ├── AgreementSigning.tsx
│   │   ├── PortalSetup.tsx
│   │   └── OnboardingProgress.tsx
│   └── [carrierId]/
│       ├── page.tsx (Individual carrier onboarding)
│       ├── documents/
│       ├── factoring/
│       ├── agreements/
│       └── portal/
```

## 📄 Document Management System

### **Document Categories**
1. **Legal/Regulatory**
   - Operating Authority Letter
   - DOT Registration
   - State Registration

2. **Insurance**
   - Certificate of Insurance (Primary)
   - Auto Liability
   - Cargo Insurance
   - Worker's Compensation
   - Additional Insured Certificates

3. **Financial**
   - W-9 Tax Form
   - Voided Check
   - Bank Letter
   - Factoring Agreement

4. **Safety**
   - Driver Licenses
   - CDL Verification
   - Drug Testing Results
   - Safety Training Certificates

### **Document Status Workflow**
- **Uploaded** → **Pending Review** → **Approved/Rejected** → **Expired/Renewed**

### **Automated Reminders**
- 30 days before insurance expiration
- 60 days before operating authority renewal
- Annual W-9 updates
- Quarterly safety record reviews

## 🏦 Factoring Integration

### **Factor Company Database**
```typescript
interface FactoringCompany {
    id: string;
    companyName: string;
    contactInfo: {
        primaryContact: string;
        phone: string;
        email: string;
        address: string;
    };
    services: {
        advancePercentage: number;
        factorRate: number;
        fuelCardAvailable: boolean;
        loadBoardAccess: boolean;
    };
    verificationProcess: {
        noticeOfAssignmentRequired: boolean;
        directVerificationContact: string;
        verificationPhone: string;
    };
    integrations: {
        apiAvailable: boolean;
        realTimeVerification: boolean;
        automatedFunding: boolean;
    };
}
```

### **Common Factoring Companies**
- TBS Factoring
- eCapital Commercial Finance
- Apex Capital Corp
- RTS Financial
- Triumph Business Capital
- Porter Freight Funding
- Express Freight Finance

## 📱 Driver Portal Features

### **Portal Sections**
1. **Dashboard**
   - Onboarding progress
   - Pending tasks
   - Document status
   - Important notifications

2. **Document Center**
   - Upload new documents
   - View current documents
   - Download agreements
   - Expiration tracking

3. **Insurance Management**
   - Current coverage details
   - Renewal reminders
   - Additional insured requests
   - Certificate downloads

4. **Factoring Information**
   - Current factor company
   - Factor contact info
   - NOA status
   - Payment tracking

5. **Agreements**
   - Broker-carrier agreement
   - Dispatcher agreement
   - Amendment history
   - Signature status

## 🤖 Automation Features

### **FMCSA Integration**
```typescript
interface FMCSAData {
    dotNumber: string;
    legalName: string;
    dbaName?: string;
    physicalAddress: Address;
    mailingAddress: Address;
    telephone: string;
    operatingStatus: string;
    safetyRating: string;
    totalDrivers: number;
    totalVehicles: number;
    operatingAuthority: OperatingAuthority[];
    insurance: InsuranceInfo[];
}

// Auto-populate from FMCSA
const fetchCarrierData = async (dotNumber: string): Promise<FMCSAData> => {
    // API call to FMCSA database
    // Validate and return carrier information
};
```

### **Document Processing**
- OCR for automatic data extraction
- Insurance certificate parsing
- Expiration date extraction
- Compliance checking

### **Communication Automation**
- Welcome email sequences
- Task reminders
- Document expiration alerts
- Onboarding completion notifications

## 📊 Integration with Accounting System

### **Accounting Workflow Connection**
1. **Carrier Setup** → Creates accounting profile
2. **Factoring Info** → Populates factoring records
3. **Banking Info** → Sets up payment methods
4. **Insurance** → Updates coverage tracking
5. **Agreements** → Establishes billing terms

### **Data Flow**
```
Onboarding System → Carrier Database → Accounting System
├── Basic carrier info
├── Factoring details
├── Banking information
├── Insurance coverage
└── Agreement terms
```

## 🎯 Success Metrics

### **Onboarding KPIs**
- Time to complete onboarding
- Document compliance rate
- First load booking time
- Carrier satisfaction score
- Dispute resolution time

### **Quality Metrics**
- Insurance compliance rate
- Document accuracy
- FMCSA rating improvements
- Safety incident reduction

## 🚀 Implementation Priority

### **Phase 1: Core Setup (Week 1-2)**
1. Create carrier onboarding page structure
2. Implement FMCSA verification
3. Basic document upload functionality
4. Factoring company database setup

### **Phase 2: Advanced Features (Week 3-4)**
1. Document processing automation
2. Agreement generation system
3. Driver portal creation
4. Integration with accounting system

### **Phase 3: Enhancement (Week 5-6)**
1. Mobile app for drivers
2. OCR document processing
3. Real-time notifications
4. Advanced reporting dashboard

### **Phase 4: Optimization (Week 7-8)**
1. Performance optimization
2. User experience improvements
3. Advanced integrations
4. Analytics and reporting

## 🔒 Security & Compliance

### **Data Protection**
- Encrypted document storage
- Secure file upload
- Access logging
- Regular security audits

### **Compliance Standards**
- DOT regulations
- FMCSA requirements
- Insurance industry standards
- Banking regulations (ACH compliance)

---

**Next Steps:**
1. Create the carrier onboarding page structure
2. Implement FMCSA verification component
3. Build document upload system
4. Integrate with existing accounting system
5. Set up factoring company management

This comprehensive system will streamline carrier onboarding while ensuring all necessary documentation and compliance requirements are met before carriers begin operations.
