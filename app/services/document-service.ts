// Document Service for Agreement Management
// Handles generation, signing, and distribution of carrier agreements

export interface AgreementDocument {
  id: string;
  type:
    | 'broker_carrier'
    | 'dispatcher_carrier'
    | 'broker_ai_flow'
    | 'dispatcher_ai_flow';
  title: string;
  content: string;
  signedBy: string;
  signedDate: string;
  signerTitle?: string;
  distributionList: string[];
  metadata: {
    carrierInfo: any;
    brokerInfo: any;
    ipAddress: string;
    userAgent: string;
  };
}

export interface DocumentDistribution {
  recipient: string;
  recipientType: 'carrier' | 'driver' | 'broker' | 'dispatcher';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  emailAddress: string;
}

class DocumentService {
  private static instance: DocumentService;

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  /**
   * Generate comprehensive broker-carrier agreement
   */
  public generateBrokerCarrierAgreement(
    carrierData: any,
    signerData: any
  ): AgreementDocument {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const content = `
COMPREHENSIVE BROKER/DISPATCH/CARRIER AGREEMENT

AGREEMENT PREPARATION INFORMATION

This Comprehensive Broker/Dispatch/Carrier Agreement has been prepared for:

Company/Organization: ${carrierData.legalName || '[Carrier Company Name]'}
Prepared By: FleetFlow Logistics Digital Onboarding System
Date of Preparation: ${currentDate}
Document Version: 2025.1 - Digital Signature Edition
Preparation Location: FleetFlow Operations Center

ABOUT THIS AGREEMENT:

This transportation agreement has been designed to establish a clear, professional working
relationship between freight brokers/dispatch companies and motor carriers. The document
incorporates current industry standards and federal transportation regulations to ensure
both parties understand their rights, responsibilities, and expectations.

Agreement Date: ${currentDate}
Effective Date: ${currentDate}

PARTY INFORMATION

BROKER/DISPATCH COMPANY:
Company Name: FleetFlow Logistics LLC
Business Address: [FleetFlow Business Address]
City, State, ZIP: [City, State ZIP]
USDOT Number: [FleetFlow USDOT]
MC Number: MC-123456
Federal Tax ID: [Tax ID]
Phone: (555) 123-4567
Email: contracts@fleetflow.com
Emergency Contact: Operations Manager - (555) 123-4567

CARRIER:
Company Name: ${carrierData.legalName || '[Carrier Name]'}
Business Address: ${carrierData.address || '[Carrier Address]'}
USDOT Number: ${carrierData.dotNumber || '[DOT Number]'}
MC Number: ${carrierData.mcNumber || '[MC Number]'}
Federal Tax ID: [Carrier Tax ID]
Phone: ${carrierData.phone || '[Phone]'}
Email: ${carrierData.email || '[Email]'}
Safety Rating: ${carrierData.safetyRating || 'Satisfactory'}

ARTICLE 1: DEFINITIONS AND INTERPRETATIONS

1.1 Primary Entity Definitions

1.1.1 Broker/Dispatch Company means FleetFlow Logistics LLC, the entity licensed and
authorized by the Federal Motor Carrier Safety Administration (FMCSA) under 49 USC 13904
to arrange for the transportation of property by motor carriers for compensation.

1.1.2 Brokerage refers to the business operations, services, and activities conducted by
FleetFlow Logistics in arranging transportation services.

1.1.3 Carrier means ${carrierData.legalName || '[Carrier Name]'}, the motor carrier entity
authorized by FMCSA under 49 USC 13902 to provide for-hire transportation services under
its own operating authority.

1.1.4 Services means all transportation and transportation-related services to be provided
by Carrier pursuant to this Agreement.

1.1.5 Shipment means any individual load, cargo, freight, or consignment to be transported
under this Agreement.

1.1.6 Equipment means all tractors, trailers, trucks, vehicles, and other transportation
equipment owned, leased, or operated by Carrier.

1.2 Financial and Insurance Definitions

1.2.1 Gross Transportation Revenue means the total amount charged for transportation
services before deduction of any fees, taxes, or expenses.

1.2.2 Dispatch Fee means the service fee charged by Brokerage for arranging transportation
services, load coordination, and related administrative services.

1.2.3 Primary Insurance means insurance coverage that pays first in case of loss, before
any other applicable insurance coverage.

1.3 Regulatory Definitions

1.3.1 FMCSA means the Federal Motor Carrier Safety Administration within the U.S.
Department of Transportation.

1.3.2 Applicable Law means all federal, state, provincial, territorial, and local laws,
statutes, regulations, rules, and ordinances applicable to the performance of Services
under this Agreement.

ARTICLE 2: SCOPE OF SERVICES

2.1 Transportation Services
Carrier agrees to provide transportation services for shipments arranged by Brokerage, including:
- Full truckload (FTL) transportation services
- Less-than-truckload (LTL) transportation when specifically agreed
- Specialized transportation services as agreed upon
- Loading and unloading services when specified
- Proper cargo securement and handling

2.2 Geographic Coverage
Services shall be provided within the continental United States and Canada, unless
otherwise specified in writing.

2.3 Equipment Requirements
Carrier represents that all equipment used will be:
- Properly maintained and in good working condition
- Compliant with all applicable DOT and FMCSA regulations
- Properly licensed and registered
- Equipped with necessary safety equipment

ARTICLE 3: OPERATING AUTHORITY AND COMPLIANCE

3.1 FMCSA Compliance
Carrier represents and warrants that it:
- Holds valid operating authority from FMCSA under 49 USC Chapter 135
- Maintains current USDOT and MC numbers in good standing
- Does not have an "Unsatisfactory" or "Conditional" safety rating
- Complies with all applicable federal, state, and local regulations
- Maintains compliance with Hours of Service regulations (49 CFR Part 395)
- Complies with Commercial Driver's License requirements (49 CFR Part 383)
- Maintains current drug and alcohol testing programs (49 CFR Part 382)

3.2 Immediate Notification
Carrier shall immediately notify Brokerage if:
- Its safety rating changes to "Unsatisfactory" or "Conditional"
- Its operating authority is suspended, revoked, or becomes inactive
- Any required insurance coverage lapses or is cancelled
- It becomes subject to any regulatory enforcement action

3.3 Updated FMCSA Requirements (2025)
Carrier acknowledges and agrees to comply with:
- Enhanced identity verification requirements
- Updated financial responsibility regulations effective January 16, 2025
- Transition to unified USDOT numbering system (elimination of separate MC numbers by October 2025)
- New broker transparency and record-keeping requirements

ARTICLE 4: INSURANCE REQUIREMENTS

4.1 Required Coverage
Carrier shall maintain, at its own expense, the following minimum insurance coverage:

Public Liability Insurance:
- Minimum $1,000,000 combined single limit for bodily injury and property damage
- General commodities: $750,000 minimum
- Hazardous materials: $5,000,000 minimum (if applicable)

Cargo Insurance:
- Minimum $100,000 per occurrence
- Higher limits may be required based on cargo value

4.2 Insurance Requirements
- All policies must name FleetFlow Logistics as additional insured
- Primary and non-contributory coverage
- 30-day written notice of cancellation to Brokerage
- Insurance companies must have AM Best rating of A- or better
- Current certificates of insurance must be on file with Brokerage

4.3 Workers' Compensation
Carrier shall maintain workers' compensation insurance as required by applicable state law.

ARTICLE 5: PAYMENT TERMS AND DISPATCH FEES

5.1 Payment Schedule
- Payment terms: Net 30 days from receipt of proper invoice
- Invoice must include signed proof of delivery (POD)
- All invoices must reference load confirmation number
- Electronic invoicing preferred

5.2 Dispatch Fee Structure

5.2.1 Standard Dispatch Fee
- Carrier agrees to pay Brokerage a dispatch fee of ten percent (10%) of the gross
  transportation revenue for each load
- Dispatch fee applies to all loads arranged by Brokerage under this Agreement
- Dispatch fees will be automatically deducted from gross transportation charges
  before payment to Carrier

5.2.2 Management Override Authority
- Brokerage's authorized management personnel may modify the standard 10% dispatch
  fee on a case-by-case basis
- Fee modifications must be approved in writing by management with title of
  Operations Manager or higher
- All fee modifications must be documented and communicated to Carrier in writing
  before load execution

5.2.3 Volume Incentive Program
- Carriers completing more than 50 loads per calendar month may qualify for reduced dispatch fees:
  - 51-100 loads: 9% dispatch fee
  - 101-150 loads: 8% dispatch fee
  - 151+ loads: 7% dispatch fee

5.3 Dispatch Fee Billing and Payment

5.3.1 Weekly Billing Cycle
- Dispatch fee invoices will be generated and sent every Monday by 5:00 PM EST
- Invoices will cover all loads completed in the previous Monday through Sunday period
- All dispatch fee invoices are due and payable by Wednesday at 11:59 PM EST of the same week

5.3.2 Overdue Payment Consequences
If dispatch fee payment is not received by Thursday 12:01 AM EST, Dispatch Department
will immediately cease:
- Route optimization and planning
- Load scheduling coordination
- Backhaul and return load sourcing
- Priority lane assignments

5.3.3 Service Restoration
To restore full dispatch services, Carrier must:
- Pay all outstanding dispatch fees in full
- Pay a $50 administrative restoration fee per overdue invoice
- Services will be restored within 4 business hours of confirmed payment receipt

5.4 Factoring
- Carrier may assign or factor receivables to third-party factoring companies
- Written notice required with factoring company details
- Upon notice, Brokerage will remit payment directly to the designated factoring company
- Carrier remains fully liable for all obligations under this Agreement

ARTICLE 6: LIABILITY AND CLAIMS

6.1 Carrier Liability
Carrier assumes full liability for cargo from time of pickup until delivery, including:
- Full replacement value for loss or damage
- Consequential damages as provided by law
- All costs associated with cargo securement, cleanup, and disposal

6.2 Claims Procedures
Carrier shall comply with 49 CFR Part 370 for processing loss and damage claims:
- Acknowledge claims in writing within 30 days
- Pay, decline, or make settlement offer within 120 days
- Maintain claims records as required by regulation

6.3 Third-Party Beneficiary
Shipper customers are third-party beneficiaries and may enforce carrier obligations directly.

ARTICLE 7: PROHIBITED ACTIVITIES

7.1 No Re-Brokering
Carrier is strictly prohibited from:
- Re-brokering, co-brokering, or subletting any shipment
- Using independent contractors not under Carrier's authority
- Transferring shipments to any other party without written consent
- Any violation constitutes material breach with minimum penalty of $5,000 per occurrence

7.2 Confidentiality
Carrier shall not disclose:
- Shipper customer information
- Rate information
- Brokerage's business operations or customers

ARTICLE 8: INDEMNIFICATION

8.1 Carrier Indemnification
Carrier shall defend, indemnify, and hold harmless Brokerage and its customers from all
claims, damages, losses, and expenses arising from:
- Carrier's performance or breach of this Agreement
- Acts or omissions of Carrier's employees, agents, or contractors
- Use of Carrier's equipment
- Violation of any law or regulation

ARTICLE 9: INDEPENDENT CONTRACTOR RELATIONSHIP

9.1 Relationship
The parties are independent contractors. This Agreement does not create:
- Employment relationship
- Partnership or joint venture
- Principal-agent relationship
- Any right to control the other party's operations

ARTICLE 10: TECHNOLOGY AND COMMUNICATION

10.1 Communication Requirements
Carrier shall:
- Provide status updates as requested
- Maintain reliable communication equipment
- Respond to Brokerage communications within 4 hours during business hours
- Notify Brokerage immediately of any delays or issues

10.2 Electronic Data Interchange
Carrier agrees to use Brokerage's preferred EDI, TMS, or load tracking systems as applicable.

ARTICLE 11: FORCE MAJEURE

Neither party shall be liable for delays or failures in performance due to causes beyond
reasonable control, including acts of God, government actions, natural disasters, or other
unforeseeable events.

ARTICLE 12: TERMINATION

12.1 Term
This Agreement shall remain in effect for one (1) year from the Effective Date and
automatically renew for successive one-year terms unless terminated.

12.2 Termination Rights
Either party may terminate this Agreement:
- With 30 days written notice with or without cause
- Immediately for material breach
- Immediately if Carrier's authority is suspended or revoked

12.3 Surviving Obligations
Termination shall not relieve either party of obligations incurred prior to termination.
Carrier must complete in-transit shipments.

ARTICLE 13: DISPUTE RESOLUTION

13.1 Governing Law
This Agreement shall be governed by the laws of [State to be specified].

13.2 Dispute Resolution
Disputes shall be resolved through:
1. Good faith negotiation
2. Binding arbitration if negotiation fails
3. Venue in [City, State to be specified]

ARTICLE 14: GENERAL PROVISIONS

14.1 Entire Agreement
This Agreement constitutes the entire agreement between the parties and supersedes all
prior agreements.

14.2 Amendments
Amendments must be in writing and signed by both parties.

14.3 Severability
If any provision is deemed invalid, the remainder of the Agreement shall remain in effect.

14.4 Assignment
Neither party may assign this Agreement without written consent of the other party.

ELECTRONIC SIGNATURE ACKNOWLEDGMENT

BROKER/DISPATCH COMPANY:
Company Name: FleetFlow Logistics LLC
USDOT Number: [FleetFlow USDOT]
MC Number: MC-123456

CARRIER:
Company Name: ${carrierData.legalName || '[Carrier Name]'}
USDOT Number: ${carrierData.dotNumber || '[DOT Number]'}
MC Number: ${carrierData.mcNumber || '[MC Number]'}

CARRIER ELECTRONIC SIGNATURE:
Authorized Signature: ${signerData.signerName}
Print Name: ${signerData.signerName}
Title: ${signerData.signerTitle || 'Authorized Representative'}
Date: ${currentDate}
Time: ${currentTime}
IP Address: ${signerData.ipAddress || 'N/A'}

This electronic signature has the same legal effect as a handwritten signature.

By signing above, Carrier acknowledges that it has read, understood, and agrees to be
bound by all terms and conditions of this Agreement, including the 10% dispatch fee
structure and all payment terms specified herein.

This agreement has been prepared in compliance with current FMCSA regulations and
industry best practices as of 2025. This document was generated through FleetFlow's
digital onboarding system and constitutes a legally binding agreement between the parties.
    `.trim();

    return {
      id: `comprehensive_broker_carrier_${Date.now()}`,
      type: 'broker_carrier',
      title: 'Comprehensive Broker/Dispatch/Carrier Agreement',
      content,
      signedBy: signerData.signerName,
      signedDate: new Date().toISOString(),
      signerTitle: signerData.signerTitle,
      distributionList: [],
      metadata: {
        carrierInfo: carrierData,
        brokerInfo: { name: 'FleetFlow Logistics LLC', mc: 'MC-123456' },
        ipAddress: signerData.ipAddress || '192.168.1.100',
        userAgent: navigator.userAgent || 'Unknown',
      },
    };
  }

  /**
   * Generate comprehensive dispatcher-carrier agreement with 10% fee
   */
  public generateDispatcherCarrierAgreement(
    carrierData: any,
    signerData: any
  ): AgreementDocument {
    const content = `
DISPATCHER-CARRIER SERVICE AGREEMENT

This Service Agreement is entered into on ${new Date().toLocaleDateString()} between:

DISPATCHER: FleetFlow Logistics LLC (Dispatch Services Division)
MC Number: MC-123456
Address: [Dispatcher Address]
Phone: (555) 123-4567
Email: dispatch@fleetflow.com

CARRIER: ${carrierData.legalName || '[Carrier Name]'}
MC Number: ${carrierData.mcNumber || '[MC Number]'}
DOT Number: ${carrierData.dotNumber || '[DOT Number]'}
Address: ${carrierData.address || '[Carrier Address]'}

SERVICE TERMS:

1. DISPATCH SERVICES SCOPE
   Dispatcher will provide load sourcing, rate negotiation, documentation
   management, and carrier support services.

2. COMMISSION STRUCTURE
   Carrier agrees to pay Dispatcher a service fee of ten percent (10%) of
   the gross revenue for each completed load dispatched under this agreement.

3. PAYMENT TERMS
   Dispatch fees are due within thirty (30) days of load completion and
   carrier receipt of payment from shipper or factoring company.

4. LOAD BOARD ACCESS
   Dispatcher will provide access to premium load boards and direct shipper
   relationships for enhanced load opportunities.

5. PERFORMANCE METRICS
   Carrier agrees to maintain minimum standards:
   - On-time pickup: 95%
   - On-time delivery: 95%
   - Communication response: Within 2 hours

6. TERRITORY AND EQUIPMENT
   Service will focus on [Territory] with [Equipment Type] equipment.
   Carrier may request territory or equipment type modifications.

7. TECHNOLOGY REQUIREMENTS
   Carrier must use Dispatcher's approved tracking and communication systems
   including ELD integration and mobile applications.

8. TRAINING AND SUPPORT
   Dispatcher will provide initial training and ongoing support for
   technology systems and compliance requirements.

9. CARRIER RESPONSIBILITIES
   Carrier remains responsible for all DOT compliance, insurance requirements,
   and proper licensing as an independent motor carrier.

10. TERMINATION
    Either party may terminate this agreement with thirty (30) days written
    notice. Outstanding fees remain due upon termination.

ELECTRONIC SIGNATURE ACKNOWLEDGMENT:
By signing below, Carrier acknowledges understanding of the 10% dispatch fee
structure and agrees to all terms and conditions.

CARRIER SIGNATURE:
Name: ${signerData.signerName}
Title: ${signerData.signerTitle || 'Authorized Representative'}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
IP Address: ${signerData.ipAddress || 'N/A'}

This electronic signature has the same legal effect as a handwritten signature.
    `.trim();

    return {
      id: `dispatcher_carrier_${Date.now()}`,
      type: 'dispatcher_carrier',
      title: 'Dispatcher-Carrier Service Agreement',
      content,
      signedBy: signerData.signerName,
      signedDate: new Date().toISOString(),
      signerTitle: signerData.signerTitle,
      distributionList: [],
      metadata: {
        carrierInfo: carrierData,
        brokerInfo: { name: 'FleetFlow Logistics', mc: 'MC-123456' },
        ipAddress: signerData.ipAddress || '192.168.1.100',
        userAgent: navigator.userAgent || 'Unknown',
      },
    };
  }

  /**
   * Distribute signed agreement to all parties
   */
  public async distributeSignedAgreement(
    document: AgreementDocument,
    carrierEmail: string,
    requesterEmail: string
  ): Promise<DocumentDistribution[]> {
    const distributions: DocumentDistribution[] = [];

    // Send to carrier/driver
    distributions.push(await this.sendToCarrier(document, carrierEmail));

    // Send to requester (broker/dispatcher)
    distributions.push(await this.sendToRequester(document, requesterEmail));

    return distributions;
  }

  private async sendToCarrier(
    document: AgreementDocument,
    email: string
  ): Promise<DocumentDistribution> {
    try {
      // In production, this would integrate with email service
      console.log(`📧 Sending signed ${document.title} to carrier: ${email}`);

      const emailSubject = `Signed Agreement: ${document.title}`;
      const emailBody = `
        Dear ${document.signedBy},

        Thank you for completing the digital signature process. Please find your signed copy of the
        ${document.title} attached to this email.

        Agreement Details:
        - Document ID: ${document.id}
        - Signed Date: ${new Date(document.signedDate).toLocaleDateString()}
        - Effective Date: ${new Date().toLocaleDateString()}

        This agreement is now in effect. Please retain this copy for your records.

        If you have any questions, please contact our operations team.

        Best regards,
        FleetFlow Logistics Operations Team
      `;

      // Mock email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        recipient: document.signedBy,
        recipientType: 'carrier',
        status: 'sent',
        sentAt: new Date().toISOString(),
        emailAddress: email,
      };
    } catch (error) {
      console.error('Failed to send to carrier:', error);
      return {
        recipient: document.signedBy,
        recipientType: 'carrier',
        status: 'failed',
        emailAddress: email,
      };
    }
  }

  private async sendToRequester(
    document: AgreementDocument,
    email: string
  ): Promise<DocumentDistribution> {
    try {
      console.log(
        `📧 Sending signed ${document.title} copy to requester: ${email}`
      );

      const emailSubject = `New Signed Agreement: ${document.title}`;
      const emailBody = `
        New Agreement Signed - Action Required

        A new ${document.title} has been digitally signed and executed.

        Carrier Information:
        - Carrier: ${document.metadata.carrierInfo.legalName || 'Unknown'}
        - MC Number: ${document.metadata.carrierInfo.mcNumber || 'Unknown'}
        - Signed By: ${document.signedBy}

        Agreement Details:
        - Document ID: ${document.id}
        - Signed Date: ${new Date(document.signedDate).toLocaleDateString()}
        - IP Address: ${document.metadata.ipAddress}

        Please file this agreement in the carrier records and update the carrier status
        to "Agreement Signed" in the system.

        Operations Team
      `;

      // Mock email sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        recipient: 'Operations Team',
        recipientType: 'broker',
        status: 'sent',
        sentAt: new Date().toISOString(),
        emailAddress: email,
      };
    } catch (error) {
      console.error('Failed to send to requester:', error);
      return {
        recipient: 'Operations Team',
        recipientType: 'broker',
        status: 'failed',
        emailAddress: email,
      };
    }
  }

  /**
   * Generate broker AI Flow lead generation agreement
   */
  public generateBrokerAIFlowAgreement(
    carrierData: any,
    signerData: any
  ): AgreementDocument {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const content = `
COMPREHENSIVE BROKER AI FLOW LEAD GENERATION AND REVENUE SHARING AGREEMENT

AGREEMENT PREPARATION INFORMATION
═══════════════════════════════════════════════════════════════════════════════════

Document Type: AI Flow Lead Generation Agreement (Broker)
Preparation Date: ${currentDate}
Preparation Time: ${currentTime}
Agreement Status: ELECTRONICALLY SIGNED
Digital Signature Platform: FleetFlow DocuSign Integration

CONTRACTING PARTIES
═══════════════════════════════════════════════════════════════════════════════════

FLEETFLOW TECHNOLOGIES, INC. (Lead Generator)
Principal Place of Business: 1234 Technology Drive, Suite 100, Atlanta, GA 30309
Federal Tax ID: 88-1234567
FMCSA MC Number: MC-123456

BROKER INFORMATION
Company Name: ${carrierData.legalName}
MC Number: ${carrierData.mcNumber}
DOT Number: ${carrierData.dotNumber}
Primary Contact: ${signerData.signerName}
Title: ${signerData.signerTitle}

AI FLOW LEAD GENERATION TERMS
═══════════════════════════════════════════════════════════════════════════════════

COMMISSION STRUCTURE: 50% revenue sharing on all AI-generated leads
PAYMENT TERMS: Monthly invoicing with 15-day payment schedule
REPORTING: Detailed monthly reports due by 5th of each month
AUDIT RIGHTS: Comprehensive audit authority with surprise audits
PENALTIES: 100% to 500% penalties for underreporting
CONFIDENTIALITY: Complete non-disclosure of AI methods required
POST-TERMINATION: 24-month commission payments required

ELECTRONIC SIGNATURE ACKNOWLEDGMENT
═══════════════════════════════════════════════════════════════════════════════════

By signing below, the broker acknowledges:
✓ Full understanding of 50% revenue sharing structure
✓ Agreement to comprehensive audit and reporting requirements
✓ Acceptance of penalty provisions for non-compliance
✓ Commitment to confidentiality of AI Flow methods
✓ Understanding of post-termination obligations

DIGITAL SIGNATURE BLOCK
═══════════════════════════════════════════════════════════════════════════════════

Broker Representative: ${signerData.signerName}
Title: ${signerData.signerTitle}
Digital Signature Date: ${currentDate}
Digital Signature Time: ${currentTime}
IP Address: ${signerData.ipAddress}
Agreement Accepted: YES

This document constitutes a legally binding agreement for AI Flow lead generation services.
All terms and conditions are governed by Georgia state law.

Document ID: AIFLOW-BROKER-${Date.now()}
FleetFlow Technologies, Inc. - AI Flow Platform Division
    `;

    return {
      id: `aiflow-broker-${Date.now()}`,
      type: 'broker_ai_flow',
      title: 'Broker AI Flow Lead Generation Agreement',
      content: content.trim(),
      signedBy: signerData.signerName,
      signedDate: currentDate,
      signerTitle: signerData.signerTitle,
      distributionList: [carrierData.email, 'contracts@fleetflow.com'],
      metadata: {
        carrierInfo: carrierData,
        brokerInfo: signerData,
        ipAddress: signerData.ipAddress,
        userAgent: navigator?.userAgent || 'Unknown',
      },
    };
  }

  /**
   * Generate dispatcher AI Flow lead generation agreement
   */
  public generateDispatcherAIFlowAgreement(
    carrierData: any,
    signerData: any
  ): AgreementDocument {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const content = `
COMPREHENSIVE DISPATCHER AI FLOW LEAD GENERATION AND REVENUE SHARING AGREEMENT

AGREEMENT PREPARATION INFORMATION
═══════════════════════════════════════════════════════════════════════════════════

Document Type: AI Flow Lead Generation Agreement (Dispatcher)
Preparation Date: ${currentDate}
Preparation Time: ${currentTime}
Agreement Status: ELECTRONICALLY SIGNED
Digital Signature Platform: FleetFlow DocuSign Integration

CONTRACTING PARTIES
═══════════════════════════════════════════════════════════════════════════════════

FLEETFLOW TECHNOLOGIES, INC. (Lead Generator)
Principal Place of Business: 1234 Technology Drive, Suite 100, Atlanta, GA 30309
Federal Tax ID: 88-1234567
FMCSA MC Number: MC-123456

DISPATCHER INFORMATION
Company Name: ${carrierData.legalName}
Operations Manager: ${signerData.signerName}
Title: ${signerData.signerTitle}
FMCSA Authority: ${carrierData.mcNumber || 'As Applicable'}

AI FLOW LEAD GENERATION TERMS
═══════════════════════════════════════════════════════════════════════════════════

COMMISSION STRUCTURE: 25% revenue sharing on all AI-generated leads
PERFORMANCE TIERS: Standard (25%), Volume (20% at $500K+), Elite (15% at $1M+)
PAYMENT TERMS: Monthly invoicing with 15-day payment schedule
REPORTING: Comprehensive monthly reports due by 5th of each month
AUDIT RIGHTS: Extensive audit authority with 24-hour notice
PENALTIES: 200% to 1000% penalties for underreporting
CONFIDENTIALITY: Strict non-disclosure of AI algorithms required
POST-TERMINATION: 36-month commission payments required

ELECTRONIC SIGNATURE ACKNOWLEDGMENT
═══════════════════════════════════════════════════════════════════════════════════

By signing below, the dispatcher acknowledges:
✓ Full understanding of 25% revenue sharing structure
✓ Awareness of performance tier opportunities
✓ Agreement to extensive audit and reporting requirements
✓ Acceptance of penalty provisions for non-compliance
✓ Commitment to confidentiality of AI Flow methods
✓ Understanding of post-termination obligations

DIGITAL SIGNATURE BLOCK
═══════════════════════════════════════════════════════════════════════════════════

Dispatcher Representative: ${signerData.signerName}
Title: ${signerData.signerTitle}
Digital Signature Date: ${currentDate}
Digital Signature Time: ${currentTime}
IP Address: ${signerData.ipAddress}
Agreement Accepted: YES

This document constitutes a legally binding agreement for AI Flow lead generation services.
All terms and conditions are governed by Georgia state law.

Document ID: AIFLOW-DISPATCHER-${Date.now()}
FleetFlow Technologies, Inc. - AI Flow Platform Division
    `;

    return {
      id: `aiflow-dispatcher-${Date.now()}`,
      type: 'dispatcher_ai_flow',
      title: 'Dispatcher AI Flow Lead Generation Agreement',
      content: content.trim(),
      signedBy: signerData.signerName,
      signedDate: currentDate,
      signerTitle: signerData.signerTitle,
      distributionList: [carrierData.email, 'contracts@fleetflow.com'],
      metadata: {
        carrierInfo: carrierData,
        brokerInfo: signerData,
        ipAddress: signerData.ipAddress,
        userAgent: navigator?.userAgent || 'Unknown',
      },
    };
  }

  /**
   * Generate PDF version of agreement
   */
  public generateAgreementPDF(document: AgreementDocument): Blob {
    // In production, this would use a PDF generation library
    const pdfContent = document.content;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  /**
   * Generate comprehensive Independent Contractor Agreement with NDA
   * 🚨 FOR FLEETFLOW EMPLOYEES/CONTRACTORS ONLY (dispatchers, brokers, office staff)
   * 🚨 NOT FOR CARRIERS - Carriers use broker/carrier agreements
   * Uses existing HTML template structure from app/templates/contractor_agreement.html
   */
  public generateIndependentContractorAgreement(
    employeeData: any,
    signerData: any
  ): AgreementDocument {
    const agreementId = `ICA-${Date.now()}`;
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleString();

    const content = `
INDEPENDENT CONTRACTOR AGREEMENT WITH NON-DISCLOSURE

═══════════════════════════════════════════════════════════════════════════════════
🚛 FLEETFLOW TRANSPORTATION LLC
INDEPENDENT CONTRACTOR AGREEMENT
═══════════════════════════════════════════════════════════════════════════════════

AGREEMENT DATE: ${currentDate}
AGREEMENT TIME: ${currentTime}
AGREEMENT ID: ${agreementId}

PARTIES TO THIS AGREEMENT:
════════════════════════════════════════════════════════════════════════════════

COMPANY: FleetFlow Transportation LLC
Business Address: [FleetFlow Business Address]
MC Number: MC-123456
Contact: contracts@fleetflow.com

CONTRACTOR: ${signerData.signerName}
Title: ${signerData.signerTitle || 'Independent Contractor'}
Department: ${employeeData.department || '[Department]'}
Employee ID: ${employeeData.employeeId || '[Employee ID]'}
Start Date: ${employeeData.startDate || currentDate}

1. INDEPENDENT CONTRACTOR RELATIONSHIP
════════════════════════════════════════════════════════════════════════════════

This Agreement establishes ${signerData.signerName} as an INDEPENDENT CONTRACTOR for FleetFlow Transportation LLC. The Contractor will provide transportation dispatch and freight broker agent services.

🚨 CRITICAL: This is an independent contractor relationship, NOT an employment agreement.
The Contractor is responsible for:
✓ All taxes and tax reporting obligations
✓ Business insurance and liability coverage
✓ Business licensing and regulatory compliance
✓ All business expenses and operational costs

2. SERVICES TO BE PROVIDED
════════════════════════════════════════════════════════════════════════════════

The Contractor agrees to provide the following services:
✓ Freight dispatch services for motor carriers
✓ Load sourcing and carrier matching services
✓ Rate negotiation and load confirmation
✓ Customer relationship management and support
✓ Transportation documentation and compliance support
✓ FMCSA regulatory compliance assistance
✓ Route optimization and planning support

3. COMPENSATION STRUCTURE
════════════════════════════════════════════════════════════════════════════════

💰 COMMISSION STRUCTURE:
- Base Commission: 25% of gross profit from dispatched loads
- Performance Bonuses: Available for exceptional service metrics
- Volume Incentives: Additional compensation for high-volume performance

💳 PAYMENT TERMS:
- Payment Schedule: Net 15 days after load completion and payment receipt
- Payment Method: Electronic transfer to designated account
- Commission Statements: Detailed monthly statements provided

4. PERFORMANCE STANDARDS AND EXPECTATIONS
════════════════════════════════════════════════════════════════════════════════

The Contractor must maintain the following performance standards:

📞 COMMUNICATION REQUIREMENTS:
✓ Professional communication with all carriers and customers
✓ Response time: Within 2 hours during business hours (8 AM - 8 PM EST)
✓ 24/7 availability for emergency situations
✓ Weekly status reports on active loads and carrier relationships

📊 PERFORMANCE METRICS:
✓ On-time pickup rate: Minimum 95%
✓ On-time delivery rate: Minimum 95%
✓ Customer satisfaction rating: Minimum 4.5/5.0
✓ Documentation accuracy: 99% error-free rate

5. CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT
════════════════════════════════════════════════════════════════════════════════

🔒 CRITICAL LEGAL REQUIREMENT: This section is LEGALLY BINDING and essential for protecting business operations.

CONFIDENTIAL INFORMATION INCLUDES:
✓ Customer information, contacts, and shipping patterns
✓ Carrier networks, performance data, and contractual terms
✓ Pricing strategies, profit margins, and rate negotiations
✓ Software systems, algorithms, and proprietary technology
✓ Business strategies, market analysis, and competitive intelligence
✓ Financial information, revenue data, and cost structures
✓ Employee information and organizational structure
✓ Trade secrets, methods, processes, and operational procedures

CONTRACTOR CONFIDENTIALITY OBLIGATIONS:
✓ Maintain STRICT confidentiality of ALL business information
✓ NOT disclose proprietary information, trade secrets, or strategies
✓ Return ALL company materials and delete confidential information upon termination
✓ NOT use confidential information for personal gain or competitive advantage
✓ Report security breaches or unauthorized access IMMEDIATELY
✓ Implement appropriate security measures to protect confidential data
✓ Execute separate NDAs for any personnel with access to confidential information

AUTHORIZED DISCLOSURE EXCEPTIONS:
- Information already in the public domain
- Information required to be disclosed by law (with prior notice to FleetFlow)
- Information disclosed to professional advisors bound by confidentiality

6. NON-COMPETE AND NON-SOLICITATION
════════════════════════════════════════════════════════════════════════════════

During the term of this agreement and for TWELVE (12) MONTHS after termination:

🚫 NON-COMPETE RESTRICTIONS:
✓ NOT directly compete with FleetFlow Transportation in same geographic markets
✓ NOT provide similar services to FleetFlow competitors
✓ NOT establish competing freight brokerage or dispatch services

🚫 NON-SOLICITATION RESTRICTIONS:
✓ NOT solicit FleetFlow customers or carriers for competing services
✓ NOT recruit or solicit FleetFlow employees or contractors
✓ NOT interfere with FleetFlow business relationships
✓ NOT use customer lists or carrier networks for competing purposes

7. INTELLECTUAL PROPERTY AND TRADE SECRETS
════════════════════════════════════════════════════════════════════════════════

All intellectual property, trade secrets, and proprietary methods developed or used during this agreement remain the exclusive property of FleetFlow Transportation LLC.

8. COMPLIANCE AND REGULATORY REQUIREMENTS
════════════════════════════════════════════════════════════════════════════════

The Contractor agrees to:
✓ Comply with all FMCSA regulations and requirements
✓ Maintain current knowledge of transportation industry regulations
✓ Ensure all dispatched loads comply with federal and state regulations
✓ Assist carriers with DOT compliance and safety requirements

9. TERMINATION PROVISIONS
════════════════════════════════════════════════════════════════════════════════

TERMINATION METHODS:
✓ Either party may terminate with THIRTY (30) days written notice
✓ Immediate termination for cause (breach of contract, misconduct, etc.)
✓ Automatic termination for regulatory violations or legal issues

POST-TERMINATION OBLIGATIONS:
✓ ALL confidentiality and non-disclosure obligations SURVIVE termination
✓ Non-compete restrictions remain in effect for 12 months
✓ Return of all company property and materials required within 5 business days
✓ Final commission payments due within 30 days of termination

10. LEGAL PROVISIONS AND DISPUTE RESOLUTION
════════════════════════════════════════════════════════════════════════════════

GOVERNING LAW: This agreement is governed by the laws of [State to be specified]
JURISDICTION: All disputes subject to binding arbitration
SEVERABILITY: Invalid provisions do not void the entire agreement
ENTIRE AGREEMENT: This document represents the complete agreement between parties

DIGITAL SIGNATURE AND LEGAL ACKNOWLEDGMENT
════════════════════════════════════════════════════════════════════════════════

CONTRACTOR DIGITAL SIGNATURE RECORD:
Contractor Name: ${signerData.signerName}
Title/Position: ${signerData.signerTitle || 'Independent Contractor'}
Digital Signature Date: ${currentDate}
Digital Signature Time: ${currentTime}
IP Address: ${signerData.ipAddress}
Agreement Accepted: YES - I agree to ALL terms and conditions

FLEETFLOW TRANSPORTATION LLC:
Authorized Representative: Operations Manager
Company Authorization Date: ${currentDate}
Agreement ID: ${agreementId}

🔒 LEGAL ACKNOWLEDGMENT CONFIRMATION:
✓ I have read and understand all terms of this Independent Contractor Agreement
✓ I agree to maintain strict confidentiality of all FleetFlow business information
✓ I understand and accept all non-compete and non-solicitation restrictions
✓ I acknowledge this creates a legally binding independent contractor relationship
✓ I understand all post-termination obligations remain in effect

This document constitutes a legally binding Independent Contractor Agreement with comprehensive Non-Disclosure provisions.

Document Generation: FleetFlow Digital Agreement System
Legal Compliance: 2025 Independent Contractor Regulations
Security Level: CONFIDENTIAL - Authorized Personnel Only
    `;

    return {
      id: agreementId,
      type: 'independent_contractor',
      title: 'Independent Contractor Agreement with NDA',
      content: content.trim(),
      signerName: signerData.signerName,
      signerTitle: signerData.signerTitle,
      signedAt: currentTime,
      ipAddress: signerData.ipAddress,
      legallyBinding: true,
    };
  }

  /**
   * Store agreement in document management system
   */
  public async storeAgreement(document: AgreementDocument): Promise<string> {
    // In production, this would upload to cloud storage
    const storageUrl = `https://documents.fleetflow.com/agreements/${document.id}.pdf`;
    console.log(`💾 Storing agreement: ${storageUrl}`);
    return storageUrl;
  }
}

export const documentService = DocumentService.getInstance();
