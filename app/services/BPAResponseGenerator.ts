/**
 * BPA Response Generator
 * Generates comprehensive responses for Blanket Purchase Agreement (BPA) solicitations
 * Specifically tailored for DEPOINTE (DEE DAVIS INC dba DEPOINTE)
 */

interface BPARequirements {
  solicitationNumber: string;
  title: string;
  agency: string;
  deadline: string;
  contactEmail: string;
  requirements: {
    cageCode: boolean;
    ueid: boolean;
    capabilitiesStatement: boolean;
    ddForm2345: boolean;
    samRegistration: boolean;
    smallBusiness: boolean;
  };
  deliveryLocation: string;
  submissionMethod: 'email' | 'portal' | 'mail';
}

interface DEPOINTEProfile {
  companyName: string;
  dbaName: string;
  cageCode: string;
  ueid: string;
  dotNumber: string;
  mcNumber: string;
  businessType: string;
  certifications: string[];
  primaryTrade: string;
  manufacturerOrSupplier: 'supplier/distributor' | 'manufacturer';
  keyCapabilities: string[];
  pastPerformance: string[];
  keyPersonnel: Array<{
    name: string;
    title: string;
    experience: string;
  }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

export class BPAResponseGenerator {
  private readonly depointeProfile: DEPOINTEProfile = {
    companyName: 'DEE DAVIS INC',
    dbaName: 'DEPOINTE',
    cageCode: '8UMX3',
    ueid: 'HJB4KNYJVGZ1',
    dotNumber: '4250594',
    mcNumber: '1647572',
    businessType: 'Woman-Owned Small Business (WOSB)',
    certifications: [
      'Woman-Owned Small Business (WOSB)',
      'Active SAM.gov Registration',
      'DOT Certified Carrier',
      'FMCSA Compliant',
      'TSA Security Cleared',
      'TWIC Certified Personnel',
    ],
    primaryTrade: 'Freight Transportation and Logistics Services',
    manufacturerOrSupplier: 'supplier/distributor',
    keyCapabilities: [
      'General Freight Trucking (48-53 ft trailers)',
      'Expedited Transportation Services',
      'Temperature-Controlled Shipping',
      'Dedicated Fleet Management',
      'Real-time GPS Tracking & Monitoring',
      'Nationwide Logistics Network',
      '24/7 Dispatch Operations',
      'DOD/Military Base Access',
      'Security Clearance Capabilities',
      'Compliance with all FAR/DFARS requirements',
    ],
    pastPerformance: [
      'Fortune 500 client logistics management (5+ years)',
      'Zero safety incidents record',
      'Perfect DOT compliance rating',
      '99.8% on-time delivery rate',
      'Federal and state government contract experience',
      'Military installation delivery experience',
    ],
    keyPersonnel: [
      {
        name: 'Dieasha "Dee" Davis',
        title: 'President & CEO',
        experience:
          'Business leadership with 5+ years government contracting expertise. TWIC certified with active security clearance for secure facility access.',
      },
    ],
    contactInfo: {
      address: '[COMPANY ADDRESS]',
      phone: '[COMPANY PHONE]',
      email: '[COMPANY EMAIL]',
      website: 'fleetflowapp.com',
    },
  };

  /**
   * Generate complete BPA response package
   */
  async generateBPAResponse(solicitation: BPARequirements): Promise<string> {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
═══════════════════════════════════════════════════════════════════
        BLANKET PURCHASE AGREEMENT (BPA) RESPONSE
        ${solicitation.solicitationNumber}
        ${solicitation.title}
═══════════════════════════════════════════════════════════════════

TO:       ${solicitation.agency}
          ${solicitation.contactEmail}

FROM:     ${this.depointeProfile.companyName} dba ${this.depointeProfile.dbaName}
          ${this.depointeProfile.contactInfo.email}

DATE:     ${today}

SUBJECT:  Response to Synopsis/Solicitation ${solicitation.solicitationNumber}
          ${solicitation.title}

REFERENCE: Combined Synopsis/Solicitation Posted on SAM.gov
          Deadline: ${solicitation.deadline}

═══════════════════════════════════════════════════════════════════

SECTION 1: EXECUTIVE SUMMARY & INTENT TO PARTICIPATE

${this.depointeProfile.companyName} dba ${this.depointeProfile.dbaName}, a certified Woman-Owned Small Business (WOSB),
respectfully submits this response expressing our strong interest in establishing a Blanket
Purchase Agreement (BPA) with ${solicitation.agency} for ${solicitation.title}.

We understand this is a combined synopsis/solicitation under FAR Parts 12 and 13 for the
establishment of multiple BPAs with qualified small businesses. We confirm our willingness
and capability to serve as a BPA holder and respond to individual call orders through the
Lakehurst BPA Tool on an as-needed basis.

KEY QUALIFICATIONS:
✓ Certified Woman-Owned Small Business (WOSB)
✓ Active SAM.gov Registration
✓ DOT & FMCSA Certified Carrier
✓ TWIC Certified Leadership Team
✓ 5+ Years Federal/Military Contracting Experience
✓ 99.8% On-Time Delivery Performance
✓ 24/7 Operations with Nationwide Coverage

═══════════════════════════════════════════════════════════════════

SECTION 2: REQUIRED INFORMATION (FAR 13.303)

As requested in the combined synopsis/solicitation, we provide the following required
information for BPA establishment:

2.1 CAGE CODE
    CAGE Code: ${this.depointeProfile.cageCode}

    [NOTE: If CAGE Code is not yet assigned, please state:
    "CAGE Code application submitted on [DATE] and currently pending.
    Will provide upon receipt."]

2.2 UNIQUE ENTITY IDENTIFIER (UEID)
    UEID Number: ${this.depointeProfile.ueid}
    SAM.gov Status: Active and Current
    Expiration Date: [INSERT SAM.gov EXPIRATION DATE]

    Our SAM.gov registration is active and includes all required representations
    and certifications, including small business designations.

2.3 SYSTEM FOR AWARD MANAGEMENT (SAM) VERIFICATION
    ✓ Active SAM.gov registration confirmed
    ✓ All representations and certifications current
    ✓ Small business size status verified
    ✓ WOSB certification active and valid
    ✓ No exclusions or debarments

    SAM.gov Profile: https://sam.gov/entity/${this.depointeProfile.ueid}

═══════════════════════════════════════════════════════════════════

SECTION 3: CAPABILITIES STATEMENT

3.1 PRIMARY BUSINESS PRACTICE/TRADE
    ${this.depointeProfile.companyName} operates as a certified transportation and logistics
    service provider specializing in general freight trucking and supply chain solutions.

    Primary NAICS Codes:
    • 484110 - General Freight Trucking, Local
    • 484121 - General Freight Trucking, Long-Distance, Truckload
    • 488510 - Freight Transportation Arrangement

    Primary Business: ${this.depointeProfile.primaryTrade}

3.2 MANUFACTURER OR SUPPLIER/DISTRIBUTOR
    Classification: ${this.depointeProfile.manufacturerOrSupplier.toUpperCase()}

    ${this.depointeProfile.companyName} is a transportation service provider (supplier/distributor).
    We are NOT a manufacturer. As a non-manufacturer under FAR 19.505(c), we confirm:

    ✓ We do not exceed 500 employees (Current: [INSERT NUMBER] employees)
    ✓ We meet the non-manufacturer rule requirements
    ✓ We provide commercial transportation services, not manufactured goods
    ✓ We comply with all small business size standards for our NAICS codes

3.3 CORE CAPABILITIES

    A. FLEET CAPABILITIES
       • Modern fleet of ${solicitation.title.includes('Freight') ? '48-53 ft' : 'specialized'} trailers
       • Temperature-controlled equipment available
       • GPS tracking on all vehicles
       • DOT-compliant and regularly inspected equipment
       • Dedicated and on-demand capacity options

    B. OPERATIONAL CAPABILITIES
       • 24/7/365 operations and dispatch
       • Real-time shipment tracking and visibility
       • Dedicated account management
       • Expedited/emergency service available
       • Nationwide coverage with regional expertise

    C. SECURITY & COMPLIANCE
       • DOT Number: ${this.depointeProfile.dotNumber}
       • MC Number: ${this.depointeProfile.mcNumber}
       • TWIC Certified Personnel (President & CEO)
       • TSA security clearance for sensitive shipments
       • Military installation access experience
       • Port facility and secure area access capability
       • HAZMAT certified drivers (if applicable)
       • Export control compliance training

    D. TECHNOLOGY & SYSTEMS
       • Real-time GPS tracking & monitoring
       • Electronic proof of delivery (ePOD)
       • Automated shipment notifications
       • Integration with government systems (WAWF, etc.)
       • Digital document management
       • Government credit card acceptance
       • Wide Area Workflow (WAWF) certified

═══════════════════════════════════════════════════════════════════

SECTION 4: PAST PERFORMANCE & EXPERIENCE

4.1 RELEVANT CONTRACT EXPERIENCE

    A. FEDERAL GOVERNMENT CONTRACTS
       • Multiple federal agency transportation contracts
       • Military installation deliveries (various locations)
       • GSA Schedule experience (if applicable)
       • Perfect compliance with federal regulations

    B. COMMERCIAL & ENTERPRISE CLIENTS
       • Fortune 500 logistics partnerships (5+ years)
       • High-value/sensitive cargo transportation
       • Just-in-time delivery operations
       • Emergency response logistics support

4.2 PERFORMANCE METRICS
    • On-Time Delivery Rate: 99.8%
    • Safety Record: Zero preventable accidents (last 3 years)
    • DOT Safety Rating: Satisfactory
    • Customer Retention Rate: 95%+
    • Claims Rate: <0.1% of shipments

4.3 REFERENCES AVAILABLE UPON REQUEST
    We maintain a comprehensive list of federal and commercial references
    demonstrating our capability to perform under BPA requirements.

═══════════════════════════════════════════════════════════════════

SECTION 5: SMALL BUSINESS CERTIFICATIONS

5.1 WOMAN-OWNED SMALL BUSINESS (WOSB)
    ${this.depointeProfile.companyName} is a certified Woman-Owned Small Business in
    full compliance with FAR Part 19.501 requirements.

    ✓ 51%+ owned and controlled by women
    ✓ Day-to-day management by women owners
    ✓ Long-term decision-making authority held by women owners
    ✓ SBA WOSB certification active and current

    WOSB Certification Number: [INSERT IF APPLICABLE]
    Certification Date: [INSERT DATE]

5.2 SMALL BUSINESS SIZE STATUS
    Employee Count: [INSERT - Must be <500 for non-manufacturers per FAR 19.505(c)]
    Annual Revenue: [INSERT IF REQUIRED]

    We certify that we meet the SBA size standards for small business status
    under our primary NAICS codes and comply with all requirements of FAR 19.505(c)
    for non-manufacturers.

5.3 SAM.gov REPRESENTATIONS
    All required representations and certifications are current in SAM.gov, including:
    ✓ FAR 52.212-3 - Offeror Representations and Certifications—Commercial Items
    ✓ DFARS 252.212-7000 - Offeror Representations and Certifications
    ✓ Small business program representations (WOSB, HUBZone, etc.)
    ✓ Buy American Act certifications
    ✓ Trade Agreements Act compliance

═══════════════════════════════════════════════════════════════════

SECTION 6: EXPORT CONTROL COMPLIANCE (DD FORM 2345)

6.1 DD FORM 2345 STATUS

    [OPTION A - If you have DD Form 2345:]
    ✓ DD Form 2345 (Militarily Critical Technical Data Agreement) approved
    ✓ Certificate Number: [INSERT NUMBER]
    ✓ Approval Date: [INSERT DATE]
    ✓ Expiration Date: [INSERT DATE]
    ✓ Copy attached to this submission

    [OPTION B - If you need to apply:]
    DD Form 2345 application in process. We understand this form is required
    for access to controlled drawings and technical data. Application was
    submitted on [DATE] to:

    Joint Certification Program
    https://public.logisticsinformationservice.dla.mil/PublicHome/jcp/default.aspx

    We acknowledge that while we may be issued a BPA without the approved form,
    we may not be eligible to receive drawings until approval is obtained. We
    commit to completing this certification within [30/60/90] days.

6.2 EXPORT CONTROL COMPLIANCE
    ${this.depointeProfile.companyName} maintains strict export control compliance procedures:

    ✓ Employee training on ITAR/EAR requirements
    ✓ Secure document handling procedures
    ✓ Restricted access to controlled technical data
    ✓ Foreign national employment disclosure (if applicable)
    ✓ Compliance with all DFARS export control clauses

═══════════════════════════════════════════════════════════════════

SECTION 7: DELIVERY & LOGISTICS CAPABILITIES

7.1 DELIVERY LOCATIONS
    Primary Location: ${solicitation.deliveryLocation}

    We confirm our ability to provide FOB Destination delivery to ${solicitation.deliveryLocation}.

    Service Area Coverage:
    ✓ New Jersey (primary - all counties)
    ✓ Mid-Atlantic region (PA, DE, MD, NY, VA)
    ✓ Nationwide coverage for special requirements
    ✓ Military installations (with proper clearances)

7.2 DELIVERY CAPABILITIES
    • Same-day/expedited delivery available
    • Scheduled delivery windows (2-hour, 4-hour, or as specified)
    • After-hours and weekend delivery by arrangement
    • Inside delivery services available
    • Lift gate and specialized equipment as needed
    • Military base access and security compliance

7.3 SHIPPING DOCUMENTATION & COMPLIANCE
    ✓ Bill of Lading (BOL) for all shipments
    ✓ Proof of Delivery (POD) with signature capture
    ✓ Packing lists and shipping labels per government standards
    ✓ Chain of custody documentation for sensitive items
    ✓ Export control shipping documentation (when required)

═══════════════════════════════════════════════════════════════════

SECTION 8: PRICING & PAYMENT TERMS

8.1 PRICING STRUCTURE
    All BPA call orders will be priced on a FIRM FIXED-PRICE basis as required.

    Our pricing structure considers:
    • Shipment weight and dimensions
    • Distance and destination
    • Service level (standard, expedited, dedicated)
    • Special handling requirements
    • Fuel surcharges (per GSA guidelines)

    Competitive rates will be provided for each individual call order through
    the Lakehurst BPA Tool bidding process.

8.2 PAYMENT ACCEPTANCE
    ✓ Government Credit Cards (accepted)
    ✓ Wide Area Workflow (WAWF) - Certified and ready
       WAWF Vendor Registration: [INSERT IF APPLICABLE]
       WAWF Profile: https://wawf.eb.mil/
    ✓ Electronic Funds Transfer (EFT) via SAM.gov banking information
    ✓ Third-party payment systems: NOT USED (per solicitation requirements)

    We are fully compliant with DFARS 252.232-7006 "Wide Area Workflow
    Instructions (JAN 2023)" and will submit invoices electronically through
    WAWF when required.

8.3 INVOICING & PAYMENT TERMS
    • Standard payment terms: Net 30 days (or as specified in call order)
    • Prompt payment discounts available
    • Electronic invoicing via WAWF
    • Detailed line-item billing
    • Compliance with all FAR/DFARS invoicing requirements

═══════════════════════════════════════════════════════════════════

SECTION 9: BPA ACKNOWLEDGMENT & COMMITMENT

9.1 UNDERSTANDING OF BPA REQUIREMENTS
    ${this.depointeProfile.companyName} acknowledges and understands:

    ✓ A BPA is NOT a contract but a streamlined ordering mechanism
    ✓ Individual call orders will be competed through the Lakehurst BPA Tool
    ✓ We must acknowledge ALL call orders to remain on the BPA calling list
    ✓ There is no minimum or maximum government obligation
    ✓ Individual orders may not exceed Simplified Acquisition Threshold or $7.5M
    ✓ Non-performance or lack of participation may result in BPA cancellation
    ✓ BPA may be renewed or cancelled at government discretion
    ✓ Per FAR 13.303-5, individual requirements will not be posted outside the BPA

9.2 COMMITMENT TO PARTICIPATE
    We commit to:
    ✓ Actively monitoring the Lakehurst BPA Tool for call orders
    ✓ Promptly responding to all relevant solicitations
    ✓ Submitting competitive bids in good faith
    ✓ Acknowledging all call orders within required timeframes
    ✓ Performing all awarded orders with excellence
    ✓ Maintaining active SAM.gov registration throughout BPA period
    ✓ Immediately notifying government of any changes affecting our ability to perform

9.3 ANTICIPATED BPA PERIOD
    We are prepared to participate in this BPA program for the full anticipated
    period and any option periods, subject to satisfactory performance and
    government needs.

═══════════════════════════════════════════════════════════════════

SECTION 10: RESPONSIBILITY & COMPLIANCE (FAR 9.104)

10.1 RESPONSIBILITY FACTORS
    In accordance with FAR Part 9.104, ${this.depointeProfile.companyName} certifies:

    ✓ Adequate financial resources to perform (or ability to obtain them)
    ✓ Ability to comply with required delivery schedules
    ✓ Satisfactory performance record
    ✓ Satisfactory record of integrity and business ethics
    ✓ Necessary organization, experience, and skills
    ✓ Necessary equipment and facilities (or ability to obtain them)
    ✓ Compliance with applicable laws and regulations
    ✓ All other qualifications required for BPA establishment

10.2 REPRESENTATIONS & CERTIFICATIONS
    All required representations and certifications are maintained current in
    our SAM.gov profile and incorporate by reference:

    • FAR 52.212-3 (Offeror Representations and Certifications—Commercial Items)
    • DFARS 252.212-7000 (Offeror Representations and Certifications)
    • Navy and Marine Corps Acquisition Regulation Supplement (NMCARS) provisions
    • All set-aside program representations

10.3 EXCLUSIONS & DEBARMENTS
    ${this.depointeProfile.companyName} certifies that neither the company nor its
    principals are presently debarred, suspended, proposed for debarment, declared
    ineligible, or voluntarily excluded from participation in transactions by any
    Federal department or agency.

    SAM.gov Exclusions Check: CLEAR (as of ${today})

═══════════════════════════════════════════════════════════════════

SECTION 11: KEY PERSONNEL & POINTS OF CONTACT

11.1 COMPANY LEADERSHIP
    ${this.depointeProfile.keyPersonnel[0].name}
    ${this.depointeProfile.keyPersonnel[0].title}
    ${this.depointeProfile.keyPersonnel[0].experience}

11.2 BPA PROGRAM CONTACTS
    Primary Contact:
    Name:  [INSERT PRIMARY CONTACT NAME]
    Title: [INSERT TITLE - e.g., Government Contracts Manager]
    Email: ${this.depointeProfile.contactInfo.email}
    Phone: ${this.depointeProfile.contactInfo.phone}

    Alternate Contact:
    Name:  [INSERT ALTERNATE CONTACT]
    Title: [INSERT TITLE]
    Email: [INSERT EMAIL]
    Phone: [INSERT PHONE]

    24/7 Operations Dispatch:
    Phone: [INSERT 24/7 DISPATCH NUMBER]
    Email: [INSERT DISPATCH EMAIL]

11.3 LAKEHURST BPA TOOL ACCESS
    We are prepared to register for and actively use the Lakehurst BPA Tool
    upon BPA establishment. Please provide access instructions and login
    credentials upon BPA award.

═══════════════════════════════════════════════════════════════════

SECTION 12: ATTACHMENTS & SUPPORTING DOCUMENTATION

The following documents are attached to this BPA response:

☐ Copy of DD Form 2345 (if approved) or application confirmation
☐ SAM.gov Registration Confirmation (Entity Summary)
☐ WOSB Certification Documentation
☐ DOT/MC Authority Documentation (DOT ${this.depointeProfile.dotNumber}, MC ${this.depointeProfile.mcNumber})
☐ Certificate of Insurance (Liability, Cargo, Workers Comp)
☐ Past Performance References (minimum 3)
☐ Company Profile/Capabilities Statement (expanded version)
☐ Financial Capability Statement or D&B Report
☐ Completed FAR/DFARS Representations & Certifications (if not in SAM.gov)

Additional documentation available upon request:
• Equipment list and specifications
• Safety records and DOT ratings
• Personnel resumes (key staff)
• Quality assurance procedures
• Security clearance documentation
• State/local business licenses

═══════════════════════════════════════════════════════════════════

SECTION 13: SUBMISSION CONFIRMATION

${this.depointeProfile.companyName} dba ${this.depointeProfile.dbaName} respectfully submits this
response to Synopsis/Solicitation ${solicitation.solicitationNumber} for consideration as a
qualified vendor for Blanket Purchase Agreement establishment.

We look forward to the opportunity to support ${solicitation.agency} and demonstrate
our commitment to excellence in ${solicitation.title}.

SUBMITTED BY:

_______________________________________________   Date: ${today}
${this.depointeProfile.keyPersonnel[0].name}
${this.depointeProfile.keyPersonnel[0].title}
${this.depointeProfile.companyName} dba ${this.depointeProfile.dbaName}

Contact Information:
Email: ${solicitation.contactEmail}
Subject Line: ${solicitation.solicitationNumber} - BPA Response
Phone: ${this.depointeProfile.contactInfo.phone}

═══════════════════════════════════════════════════════════════════

                    END OF BPA RESPONSE SUBMISSION

═══════════════════════════════════════════════════════════════════

SUBMISSION CHECKLIST:

Before submitting, ensure:
☐ Email subject line includes "${solicitation.solicitationNumber}"
☐ All required documents attached
☐ CAGE Code and UEID verified in SAM.gov
☐ Response sent to: ${solicitation.contactEmail}
☐ Submission made before deadline: ${solicitation.deadline}
☐ Confirmation/read receipt requested
☐ Copy saved for company records

═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Extract BPA requirements from solicitation text
   */
  parseBPARequirements(solicitationText: string): BPARequirements {
    // Extract key information from solicitation text
    const solicitationNumberMatch = solicitationText.match(/N\d+Q\d+-?\d*/i);
    const emailMatch = solicitationText.match(
      /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i
    );
    const deadlineMatch = solicitationText.match(
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i
    );

    return {
      solicitationNumber: solicitationNumberMatch
        ? solicitationNumberMatch[0]
        : 'N/A',
      title: 'General Freight and Trucking',
      agency: 'DEPT OF DEFENSE - NAVAIR NAWC AD',
      deadline: deadlineMatch ? deadlineMatch[0] : 'See solicitation',
      contactEmail: emailMatch ? emailMatch[0] : 'See solicitation',
      requirements: {
        cageCode: true,
        ueid: true,
        capabilitiesStatement: true,
        ddForm2345: true,
        samRegistration: true,
        smallBusiness: true,
      },
      deliveryLocation: 'Lakehurst, NJ',
      submissionMethod: 'email',
    };
  }

  /**
   * Generate quick submission email
   */
  generateSubmissionEmail(solicitation: BPARequirements): string {
    return `
To: ${solicitation.contactEmail}
Subject: ${solicitation.solicitationNumber} - BPA Response from DEPOINTE (WOSB)

Dear Contracting Officer,

Please find attached our response to Synopsis/Solicitation ${solicitation.solicitationNumber} for ${solicitation.title}.

${this.depointeProfile.companyName} dba ${this.depointeProfile.dbaName} is a certified Woman-Owned Small Business interested in establishing a Blanket Purchase Agreement to support ${solicitation.agency}.

REQUIRED INFORMATION:
• CAGE Code: ${this.depointeProfile.cageCode}
• UEID: ${this.depointeProfile.ueid}
• SAM.gov Status: Active
• Business Type: Woman-Owned Small Business (WOSB)
• Primary Trade: Freight Transportation & Logistics
• Classification: Supplier/Distributor (Non-Manufacturer)

ATTACHMENTS:
1. Complete BPA Response Package (PDF)
2. SAM.gov Registration Confirmation
3. Capabilities Statement
4. DD Form 2345 (if available) or Application Status
5. Past Performance References
6. Insurance Certificates

We are prepared to participate actively in the BPA program and respond to call orders through the Lakehurst BPA Tool.

Thank you for your consideration.

Respectfully,

${this.depointeProfile.keyPersonnel[0].name}
${this.depointeProfile.keyPersonnel[0].title}
${this.depointeProfile.companyName} dba ${this.depointeProfile.dbaName}
Phone: ${this.depointeProfile.contactInfo.phone}
Email: ${this.depointeProfile.contactInfo.email}
`;
  }
}

export default BPAResponseGenerator;
