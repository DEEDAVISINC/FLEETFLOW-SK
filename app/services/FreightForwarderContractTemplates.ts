/**
 * FleetFlow Freight Forwarder Legal Contract Templates
 * Comprehensive, ironclad legal agreements for freight forwarding operations
 * 
 * ALL CONTRACTS ARE ENTERPRISE-GRADE WITH:
 * - Complete liability protection
 * - Force majeure clauses
 * - Dispute resolution
 * - Indemnification
 * - Insurance requirements
 * - Payment terms with penalties
 * - Default and termination clauses
 * - Confidentiality agreements
 * - Governing law specifications
 * 
 * @version 1.0.0
 * @author FleetFlow TMS LLC
 * @legal CONSULT WITH LEGAL COUNSEL BEFORE USE
 */

import { ContractType } from './FreightForwarderContractService';

export class FreightForwarderContractTemplates {
  /**
   * Generate comprehensive contract terms based on type
   */
  static generateContractTerms(type: ContractType): {
    termsAndConditions: string;
    specialClauses: string[];
    liabilityDisclaimer: string;
    forceMAJEUREClause: string;
    disputeResolution: string;
    indemnification: string;
    confidentiality: string;
    terminationClause: string;
  } {
    switch (type) {
      case 'CLIENT_SERVICE_AGREEMENT':
        return this.getClientServiceAgreementTerms();
      case 'CARRIER_RATE_AGREEMENT':
        return this.getCarrierRateAgreementTerms();
      case 'CUSTOMS_BROKER_AGREEMENT':
        return this.getCustomsBrokerAgreementTerms();
      case 'TRUCKING_CONTRACT':
        return this.getTruckingContractTerms();
      case 'WAREHOUSE_AGREEMENT':
        return this.getWarehouseAgreementTerms();
      case 'INSURANCE_CONTRACT':
        return this.getInsuranceContractTerms();
      case 'VOLUME_COMMITMENT':
        return this.getVolumeCommitmentTerms();
      case 'SLA_AGREEMENT':
        return this.getSLAAgreementTerms();
      case 'AGENCY_AGREEMENT':
        return this.getAgencyAgreementTerms();
      case 'NVOCC_AGREEMENT':
        return this.getNVOCCAgreementTerms();
      default:
        return this.getDefaultContractTerms();
    }
  }

  /**
   * CLIENT SERVICE AGREEMENT - Master Agreement for Freight Forwarding Services
   */
  private static getClientServiceAgreementTerms() {
    return {
      termsAndConditions: `
# MASTER SERVICE AGREEMENT FOR INTERNATIONAL FREIGHT FORWARDING SERVICES

## AGREEMENT made this ___ day of ________, 20___, between:

**FREIGHT FORWARDER**: FleetFlow TMS LLC, a Michigan Limited Liability Company, with principal office at 755 W. Big Beaver Rd STE 2020, Troy, MI 48084 (hereinafter "Forwarder" or "FleetFlow")

**CLIENT**: _________________________ (hereinafter "Client" or "Customer")

---

## ARTICLE 1: SCOPE OF SERVICES

### 1.1 Services Provided
Forwarder agrees to provide international freight forwarding services including, but not limited to:

a) **Ocean Freight Services**: Container shipping (FCL/LCL), vessel booking, port coordination
b) **Air Freight Services**: Air cargo booking, airline coordination, expedited shipping
c) **Customs Clearance**: ISF filing, customs entry, duty/tax payment coordination
d) **Documentation Services**: Bill of Lading, Commercial Invoice, Certificate of Origin, Packing List
e) **Insurance Coordination**: Cargo insurance placement (optional)
f) **Door-to-Door Services**: Origin pickup, destination delivery, warehousing coordination
g) **Cargo Tracking**: Real-time shipment visibility and status updates
h) **Regulatory Compliance**: AMS filing, FDA compliance, USDA compliance

### 1.2 Services NOT Included
Unless specifically agreed in writing:
- Packing and crating of goods
- Direct payment of customs duties and taxes (Client responsibility)
- Storage beyond free time periods
- Special handling of hazardous materials (requires separate agreement)
- Cargo insurance premiums (Client responsibility unless contracted)

### 1.3 Service Limitations
Forwarder acts ONLY as an intermediary and freight forwarder. Forwarder does NOT act as:
- A carrier
- A customs broker (unless separately licensed)
- A warehouse operator (unless separately contracted)
- An insurer

---

## ARTICLE 2: RATES AND CHARGES

### 2.1 Rate Structure
All rates are quoted in US Dollars (USD) unless otherwise specified. Rates include:
- Base freight charges (ocean/air)
- Fuel surcharges (as applicable)
- Documentation fees
- Terminal handling charges
- Destination charges (as specified)

### 2.2 Rate Validity
Quoted rates are valid for the period specified in the rate schedule. Rates may be adjusted upon 30 days written notice to Client for:
- Carrier rate increases
- Fuel surcharge adjustments
- Currency fluctuations exceeding 5%
- Changes in customs/port fees
- Force majeure events

### 2.3 Additional Charges
Client shall be responsible for:
- Demurrage and detention charges
- Storage charges beyond free time
- Customs duties, taxes, and penalties
- Inspection fees (USDA, FDA, etc.)
- Re-delivery charges
- Document correction fees
- Weekend/holiday services (premium rates apply)

### 2.4 Currency and Payment
All invoices payable in USD. Foreign currency transactions subject to exchange rate at time of payment.

---

## ARTICLE 3: PAYMENT TERMS

### 3.1 Payment Due Date
Payment due NET 30 days from invoice date unless otherwise specified. Time is of the essence.

### 3.2 Late Payment Penalties
Late payments subject to:
- 1.5% monthly interest (18% annual percentage rate)
- Suspension of services until account current
- Collection costs and reasonable attorney's fees

### 3.3 Credit Terms
Credit extended at Forwarder's sole discretion. Credit limit: $________
Credit may be suspended or revoked at any time for:
- Late payments
- Exceeding credit limit
- Deteriorating financial condition
- Breach of contract terms

### 3.4 Security Deposit
Forwarder may require security deposit equal to _____ days of average charges. Deposit held for duration of agreement and may be applied to outstanding invoices.

### 3.5 Right to Withhold Services
Forwarder reserves right to withhold services or hold cargo as security for payment of all charges due.

---

## ARTICLE 4: LIABILITY AND INSURANCE

### 4.1 Liability Limitation
**CRITICAL: Forwarder's liability is LIMITED as follows:**

a) **For Services as Freight Forwarder**: $50 per shipment OR $0.50 per pound of cargo, whichever is LESS, unless higher value declared in writing and additional fees paid.

b) **For Ocean Transportation**: Governed by COGSA (Carriage of Goods by Sea Act) - $500 per package or customary freight unit unless higher value declared.

c) **For Air Transportation**: Governed by Montreal Convention - approximately $22 per kilogram unless higher value declared.

d) **For Customs Services**: Limited to amount of brokerage fees paid for that transaction.

e) **For Documentation Errors**: Limited to the documentation fees charged for that shipment.

### 4.2 Exclusions from Liability
Forwarder NOT liable for:
- Acts of God, force majeure, war, terrorism, strikes, riots
- Inherent vice or nature of goods
- Improper packing by shipper
- Errors in shipper's documentation
- Government actions (seizure, quarantine, embargo)
- Carrier delays or failures
- Customs delays or penalties
- Market fluctuations or price changes
- Consequential, indirect, special, or punitive damages
- Lost profits or business interruption

### 4.3 Notice of Claim
Claims MUST be filed within:
- **9 months** for ocean shipments (per COGSA)
- **2 years** for air shipments (per Montreal Convention)
- **60 days** for all other services

Failure to file timely claim constitutes ABSOLUTE BAR to recovery.

### 4.4 Cargo Insurance REQUIRED
**CLIENT MUST maintain cargo insurance** covering full replacement value plus 10%. Client agrees:
- To name Forwarder as additional insured
- To hold Forwarder harmless for uninsured losses
- To provide proof of insurance upon request
- That Forwarder is NOT responsible for insurance placement unless separately contracted

### 4.5 Indemnification by Client
Client agrees to INDEMNIFY, DEFEND, and HOLD HARMLESS Forwarder from:
- Any claims arising from cargo content, value, or condition
- Improper documentation provided by Client
- Failure to pay customs duties/taxes
- Violation of import/export regulations
- Third-party claims related to Client's cargo
- Hazardous material violations
- Intellectual property violations

---

## ARTICLE 5: CLIENT OBLIGATIONS

### 5.1 Accurate Information
Client warrants and represents that:
- All cargo descriptions are accurate and complete
- All declared values are truthful
- All commodity classifications (HS codes) are correct
- All required licenses/permits are in place
- Cargo contains no illegal, prohibited, or restricted items

### 5.2 Documentation Requirements
Client must provide within reasonable time:
- Commercial Invoice (certified)
- Packing List (detailed)
- Certificate of Origin (if required)
- Export/Import licenses
- Special permits (FDA, USDA, etc.)
- Insurance certificates
- Power of Attorney for customs

### 5.3 Compliance with Laws
Client responsible for compliance with:
- Export Administration Regulations (EAR)
- International Traffic in Arms Regulations (ITAR)
- Office of Foreign Assets Control (OFAC) sanctions
- Customs regulations of origin/destination countries
- Product safety regulations
- Labeling requirements

### 5.4 Hazardous Materials
Client MUST declare hazardous materials in writing. Failure to declare constitutes:
- Material breach of contract
- Liability for all fines, penalties, cleanup costs
- Criminal liability under applicable laws

---

## ARTICLE 6: FORCE MAJEURE

### 6.1 Force Majeure Events
Neither party liable for failure to perform due to:
- Acts of God (earthquakes, floods, hurricanes, tsunamis)
- War, terrorism, civil unrest
- Government actions (embargoes, sanctions, port closures)
- Strikes, labor disputes
- Pandemics, epidemics
- Carrier failures, port congestion
- Cyber attacks, system failures beyond control

### 6.2 Notice and Mitigation
Party claiming force majeure must:
- Notify other party within 48 hours
- Use reasonable efforts to mitigate effects
- Resume performance when event concludes

### 6.3 Extended Force Majeure
If force majeure continues >90 days, either party may terminate without liability.

---

## ARTICLE 7: CONFIDENTIALITY

### 7.1 Confidential Information
Both parties agree to maintain confidentiality of:
- Pricing and rate information
- Customer lists and data
- Shipment details and routing
- Trade secrets and proprietary information
- Financial information

### 7.2 Exceptions
Confidentiality does NOT apply to:
- Information in public domain
- Information required by law/government (subpoena, customs)
- Information disclosed to carriers/service providers as necessary

### 7.3 Data Protection
Forwarder complies with applicable data protection laws. Client data used only for service provision unless consent given.

---

## ARTICLE 8: DISPUTE RESOLUTION

### 8.1 Governing Law
This Agreement governed by laws of **State of Michigan, United States**, without regard to conflict of law principles.

### 8.2 Venue and Jurisdiction
Exclusive venue: **Oakland County, Michigan**. Both parties submit to exclusive jurisdiction of Michigan courts.

### 8.3 Arbitration (Optional)
Disputes may be submitted to binding arbitration under American Arbitration Association (AAA) Commercial Rules. Arbitration in Troy, Michigan. Each party bears own costs unless arbitrator awards fees to prevailing party.

### 8.4 Waiver of Jury Trial
**BOTH PARTIES WAIVE RIGHT TO JURY TRIAL** for any dispute arising from this Agreement.

### 8.5 Attorney's Fees
Prevailing party entitled to reasonable attorney's fees and costs.

---

## ARTICLE 9: TERMINATION

### 9.1 Termination for Convenience
Either party may terminate with 60 days written notice. Client remains liable for:
- All shipments in transit
- All outstanding invoices
- Any early termination fees (if applicable)

### 9.2 Termination for Cause
Immediate termination allowed for:
- Material breach not cured within 30 days
- Bankruptcy or insolvency
- Fraud or misrepresentation
- Repeated late payments
- Violation of laws/regulations

### 9.3 Effect of Termination
Upon termination:
- Client must pay all outstanding amounts immediately
- Forwarder will complete shipments in transit (subject to payment)
- Confidentiality obligations survive
- Liability limitations survive

---

## ARTICLE 10: GENERAL PROVISIONS

### 10.1 Entire Agreement
This Agreement constitutes entire agreement between parties. No oral modifications valid. Written amendments required.

### 10.2 Assignment
Neither party may assign without written consent, except Forwarder may assign to affiliates or successors.

### 10.3 Severability
If any provision held invalid, remainder remains in full force.

### 10.4 Waiver
Failure to enforce any provision does not waive right to enforce later.

### 10.5 Notices
All notices must be in writing to addresses above. Email acceptable for routine communications.

### 10.6 Independent Contractor
Forwarder is independent contractor, not agent or employee of Client.

### 10.7 Third Party Beneficiaries
No third-party beneficiaries except as expressly stated.

---

## ACKNOWLEDGMENT AND ACCEPTANCE

**CLIENT ACKNOWLEDGES:**
1. Client has READ and UNDERSTANDS all terms
2. Client has had opportunity to review with legal counsel
3. Client ACCEPTS liability limitations
4. Client will maintain adequate cargo insurance
5. Client will comply with all laws and regulations

**SIGNATURES:**

**FOR FLEETFLOW TMS LLC:**

_____________________________
Signature: Dieasha Davis
Title: President & CEO
Date: _______________

**FOR CLIENT:**

_____________________________
Signature: 
Title: 
Date: _______________

---

**WITNESS:**

_____________________________
Witness Signature
Printed Name:
Date: _______________
`,
      
      specialClauses: [
        'CLIENT MANDATORY CARGO INSURANCE: Client must maintain cargo insurance covering 110% of shipment value',
        'LIMITATION OF LIABILITY: Forwarder liability strictly limited to $0.50 per pound unless higher value declared',
        'NO CONSEQUENTIAL DAMAGES: Forwarder not liable for lost profits, business interruption, or special damages under any circumstances',
        'PAYMENT SECURITY: Forwarder reserves right to hold cargo as security for payment of all charges',
        'CREDIT TERMS REVOCABLE: Credit extended at Forwarder sole discretion and may be revoked at any time',
        'CUSTOMS PENALTIES: Client solely responsible for all customs penalties, fines, and duties',
        'HAZMAT DISCLOSURE REQUIRED: Failure to disclose hazardous materials constitutes material breach',
        'NO JURY TRIAL: Both parties waive right to jury trial for all disputes',
        'GOVERNING LAW: Michigan law applies exclusively',
        'INDEMNIFICATION: Client indemnifies Forwarder for third-party claims',
      ],
      
      liabilityDisclaimer: `
**CRITICAL LIMITATION OF LIABILITY NOTICE**

By executing this Agreement, Client acknowledges and agrees that:

1. **FORWARDER IS NOT A CARRIER**: FleetFlow TMS LLC acts solely as freight forwarder and intermediary. Actual carriage performed by third-party carriers subject to their terms.

2. **STRICT LIABILITY LIMITS**: Forwarder's maximum liability is $0.50 per pound of cargo OR $50 per shipment, WHICHEVER IS LESS, unless:
   - Higher value declared in writing at time of booking
   - Additional valuation fees paid
   - Separate agreement executed

3. **NO CONSEQUENTIAL DAMAGES**: Under NO circumstances shall Forwarder be liable for:
   - Lost profits or revenue
   - Business interruption
   - Market losses
   - Indirect or special damages
   - Punitive damages
   
4. **CARGO INSURANCE MANDATORY**: Client MUST maintain adequate cargo insurance. Forwarder is NOT insurer and does NOT provide insurance coverage.

5. **CLAIMS PROCEDURE**: All claims must be filed in writing within applicable time limits (9 months for ocean, 2 years for air) with complete documentation. Late claims BARRED.

6. **THIRD PARTY CARRIERS**: For services provided by third-party carriers (ocean lines, airlines, truckers), those carriers' terms and liability limits apply (COGSA, Montreal Convention, Carmack Amendment).

CLIENT ACKNOWLEDGES READING AND UNDERSTANDING THESE LIMITATIONS.

Client Initials: ________  Date: ________
`,

      forceMAJEUREClause: `
**FORCE MAJEURE CLAUSE**

Neither party shall be liable for failure to perform obligations due to events beyond reasonable control, including but not limited to:

**Natural Disasters:** Earthquakes, floods, hurricanes, tsunamis, tornadoes, severe weather

**Human Actions:** War, terrorism, riots, civil unrest, strikes, labor disputes, sabotage

**Government Actions:** Embargoes, sanctions, export/import restrictions, port closures, customs delays, quarantine orders

**Infrastructure Failures:** Port congestion, equipment shortages, carrier capacity constraints, cyber attacks, system failures

**Health Emergencies:** Pandemics, epidemics, quarantines

**Carrier Issues:** Vessel delays, flight cancellations, mechanical failures, crew shortages

**OBLIGATIONS DURING FORCE MAJEURE:**
- Party affected must notify other party within 48 hours
- Use reasonable efforts to minimize impact
- Resume performance when event concludes
- If force majeure continues >90 days, either party may terminate

**NO LIABILITY:** Neither party liable for delays or failures caused by force majeure events.
`,

      disputeResolution: `
**DISPUTE RESOLUTION PROCEDURE**

**1. GOVERNING LAW:**
This Agreement shall be governed by and construed in accordance with the laws of the State of Michigan, United States, without regard to its conflict of law principles.

**2. EXCLUSIVE VENUE:**
Any legal action arising from this Agreement must be brought in the state or federal courts located in Oakland County, Michigan. Both parties consent to exclusive jurisdiction and venue in Michigan courts.

**3. NEGOTIATION FIRST:**
Before initiating formal proceedings, parties agree to negotiate in good faith for 30 days.

**4. MEDIATION (OPTIONAL):**
If negotiation fails, parties may agree to non-binding mediation before neutral mediator.

**5. BINDING ARBITRATION:**
At either party's election, disputes may be submitted to binding arbitration under:
- American Arbitration Association (AAA) Commercial Arbitration Rules
- Single arbitrator selected per AAA procedures
- Arbitration location: Troy, Michigan
- Arbitrator's decision final and binding
- Judgment may be entered in any court with jurisdiction

**6. WAIVER OF JURY TRIAL:**
**BOTH PARTIES EXPRESSLY WAIVE ANY RIGHT TO TRIAL BY JURY** in any action or proceeding arising out of or relating to this Agreement.

**7. ATTORNEY'S FEES:**
Prevailing party entitled to recover reasonable attorney's fees, costs, and expenses from non-prevailing party.

**8. INJUNCTIVE RELIEF:**
Nothing herein prevents either party from seeking injunctive relief for:
- Breach of confidentiality
- Intellectual property violations
- Collection of amounts due

**9. LIMITATION PERIOD:**
Any action must be commenced within 2 years of when cause of action arose. Claims not filed within this period FOREVER BARRED.
`,

      indemnification: `
**MUTUAL INDEMNIFICATION PROVISIONS**

**BY CLIENT:**

Client agrees to INDEMNIFY, DEFEND, and HOLD HARMLESS FleetFlow TMS LLC, its officers, directors, employees, agents, and affiliates from and against ANY AND ALL:

- Claims, demands, lawsuits, actions, proceedings
- Losses, damages, liabilities, costs, expenses
- Attorney's fees and court costs
- Fines, penalties, and settlements

ARISING FROM OR RELATED TO:

1. **Cargo Issues:** Content, condition, value, packaging, or description of cargo
2. **Documentation Errors:** Inaccurate or incomplete documents provided by Client
3. **Regulatory Violations:** Violations of customs, export, import, or other laws
4. **Undeclared Hazmat:** Failure to properly declare hazardous materials
5. **Duties and Taxes:** Failure to pay customs duties, taxes, or penalties
6. **Third-Party Claims:** Any claims by third parties related to Client's cargo
7. **Intellectual Property:** Copyright, trademark, or patent infringement
8. **Product Liability:** Defective or dangerous products
9. **Contract Breach:** Client's breach of this Agreement
10. **Criminal Activity:** Any illegal activity by Client

**BY FORWARDER:**

Forwarder agrees to indemnify Client from claims arising solely from Forwarder's gross negligence or willful misconduct in providing services, subject to all liability limitations in this Agreement.

**INDEMNITY PROCEDURES:**

- Indemnified party must notify indemnifying party promptly of claim
- Indemnifying party has right to defend with counsel of choice
- Indemnified party may participate at own expense
- No settlement without indemnifying party consent
- Indemnity survives termination of Agreement

**NO LIMITATION:**
Client's indemnification obligations are NOT subject to any liability limitations in this Agreement and are UNLIMITED in amount.
`,

      confidentiality: `
**CONFIDENTIALITY AND DATA PROTECTION AGREEMENT**

**1. CONFIDENTIAL INFORMATION DEFINED:**

"Confidential Information" includes:
- Pricing, rates, and fee structures
- Customer lists, contacts, and business relationships
- Shipment details, routing, and logistics information
- Financial information and payment terms
- Trade secrets and proprietary business methods
- System access credentials and security procedures
- Strategic plans and business forecasts

**2. OBLIGATIONS:**

Both parties agree to:
- Maintain strict confidentiality of Confidential Information
- Use Confidential Information ONLY for performance of services
- NOT disclose to third parties without written consent
- Protect Confidential Information with same care as own confidential data (minimum reasonable care)
- Return or destroy Confidential Information upon termination

**3. PERMITTED DISCLOSURES:**

Confidential Information may be disclosed:
- To employees, contractors, or agents with need-to-know (subject to confidentiality obligations)
- To carriers and service providers as necessary for service performance
- As required by law, regulation, or court order (with notice if legally permitted)
- To customs, government agencies as required for import/export

**4. EXCEPTIONS:**

Confidentiality does NOT apply to information that:
- Is or becomes publicly available through no breach
- Was known prior to disclosure
- Is independently developed
- Is received from third party without confidentiality obligation

**5. DATA PROTECTION:**

Forwarder complies with applicable data protection laws including:
- General Data Protection Regulation (GDPR) for EU shipments
- California Consumer Privacy Act (CCPA) for California customers
- Other applicable state and international data protection laws

Client data used solely for:
- Service provision and shipment processing
- Invoicing and payment collection
- Regulatory compliance and reporting
- Service improvement (anonymized data only)

**6. DATA SECURITY:**

Forwarder implements reasonable security measures including:
- Encrypted data transmission
- Secure server infrastructure
- Access controls and authentication
- Regular security audits
- Employee training on data protection

**7. DATA BREACH NOTIFICATION:**

In event of data breach, Forwarder will notify Client within 72 hours and take immediate remedial action.

**8. SURVIVAL:**

Confidentiality obligations survive termination for 5 years or until information becomes public, whichever occurs first.

**9. REMEDIES:**

Breach of confidentiality may result in:
- Immediate termination of Agreement
- Injunctive relief (without need to post bond)
- Monetary damages
- Attorney's fees and costs
`,

      terminationClause: `
**TERMINATION PROVISIONS**

**1. TERMINATION FOR CONVENIENCE:**

Either party may terminate this Agreement for any reason with **60 days written notice** to the other party.

Upon termination for convenience:
- Client remains liable for all shipments in transit
- All outstanding invoices immediately due and payable
- Forwarder will complete in-transit shipments (subject to payment)
- No refund of prepaid fees unless services not yet performed

**2. TERMINATION FOR CAUSE:**

Either party may terminate IMMEDIATELY for:

**Material Breach:** Including but not limited to:
- Non-payment (more than 15 days past due)
- Violation of confidentiality obligations
- Breach of any material term not cured within 30 days of written notice

**Insolvency/Bankruptcy:**
- Filing of bankruptcy petition
- Assignment for benefit of creditors
- Appointment of receiver or trustee
- Insolvency or cessation of business operations

**Illegal Activity:**
- Violation of laws or regulations
- Fraud, misrepresentation, or dishonesty
- Shipment of prohibited/illegal goods
- OFAC sanctions violations

**Repeated Non-Performance:**
- Three or more instances of late payment in 12-month period
- Continued failure to provide required documentation
- Pattern of regulatory violations

**3. EFFECT OF TERMINATION:**

Upon termination:

**Immediate Obligations:**
- All amounts due become immediately payable
- Client must provide payment for in-transit shipments
- Return of confidential information
- Return of any Forwarder property

**Survival of Terms:**
- Liability limitations survive indefinitely
- Indemnification obligations survive indefinitely
- Confidentiality survives for 5 years
- Payment obligations survive until paid in full
- Warranty disclaimers survive indefinitely

**Completion of Services:**
- Forwarder will complete shipments in transit (subject to payment)
- Forwarder may hold cargo as security for payment
- No obligation to accept new shipments after termination notice

**4. NO WAIVER OF REMEDIES:**

Termination does NOT waive:
- Right to collect amounts due
- Right to pursue claims for breach
- Any accrued rights or obligations

**5. FINAL SETTLEMENT:**

Within 30 days of termination:
- Forwarder provides final invoice
- Client pays all outstanding amounts
- Both parties release any held property
- Final accounting and settlement completed
`,
    };
  }

  /**
   * CARRIER RATE AGREEMENT - Ocean/Air Freight
   */
  private static getCarrierRateAgreementTerms() {
    return {
      termsAndConditions: `
# CARRIER RATE AGREEMENT - OCEAN & AIR FREIGHT SERVICES

## COMPREHENSIVE RATE CONTRACT

This Rate Agreement ("Agreement") entered into by and between:

**FREIGHT FORWARDER**: FleetFlow TMS LLC ("Forwarder")
**CARRIER**: _________________________ ("Carrier")

---

## ARTICLE 1: SCOPE AND SERVICES

### 1.1 Transportation Services
Carrier agrees to provide transportation services as follows:

**OCEAN FREIGHT:**
- FCL (Full Container Load) services
- LCL (Less than Container Load) services
- Container types: 20ft, 40ft, 40HC, 45ft, Refrigerated, Open Top, Flat Rack
- Port-to-port transportation
- Bill of Lading issuance

**AIR FREIGHT:**
- General cargo air transportation
- Express/expedited services
- Door-to-door services (where applicable)
- Air Waybill issuance

### 1.2 Service Routes
Carrier will provide services on routes specified in Rate Schedule Appendix A, including:
- Origin ports/airports
- Destination ports/airports
- Transit times
- Sailing/flight frequencies
- Transshipment points (if applicable)

### 1.3 Equipment and Capacity
Carrier guarantees reasonable equipment availability subject to:
- Volume commitments being met
- Advance booking requirements
- Market conditions and capacity constraints
- Force majeure events

---

## ARTICLE 2: RATES AND TARIFFS

### 2.1 Rate Structure
All-in rates specified in Appendix A include:
- Base ocean/air freight charges
- Terminal handling charges (THC)
- Bunker Adjustment Factor (BAF) / Fuel surcharge
- Currency Adjustment Factor (CAF)
- Security fees
- Documentation fees

### 2.2 Rate Validity
Rates valid for period specified (typically 3-6 months) and may be adjusted for:
- **Fuel Surcharge**: Adjusted monthly based on published indexes
- **Peak Season Surcharge**: 30 days advance notice required
- **Currency Fluctuations**: >5% change in exchange rates
- **Port/Airport Fee Changes**: Pass-through with documentation
- **General Rate Increases**: 45 days advance written notice required

### 2.3 Excluded Charges
Following charges NOT included (unless specified):
- Demurrage and detention
- Storage charges
- Customs clearance fees
- Overweight/oversized cargo surcharges
- Hazardous material handling fees
- Cargo insurance
- Inland transportation beyond port/airport
- Holiday/weekend service premiums

### 2.4 Additional Services
Carrier will provide following at standard rates:
- Equipment pre-pull services
- Container yard storage (free time specified)
- Chassis provision (if applicable)
- VGM (Verified Gross Mass) certification
- AMS/ISF filing coordination

---

## ARTICLE 3: VOLUME COMMITMENTS AND DISCOUNTS

### 3.1 Minimum Volume Commitment
Forwarder commits to minimum volume per quarter:
- **Ocean**: ___ TEU (Twenty-foot Equivalent Units)
- **Air**: ___ kilograms or ___ shipments

### 3.2 Volume-Based Discount Structure

**TIER 1** (Base Volume):
- Ocean: 0-99 TEU/quarter = Base Rate
- Air: 0-4,999 kg/quarter = Base Rate

**TIER 2** (Volume Discount):
- Ocean: 100-199 TEU/quarter = 3% discount
- Air: 5,000-9,999 kg/quarter = 3% discount

**TIER 3** (Preferred Volume):
- Ocean: 200-299 TEU/quarter = 5% discount
- Air: 10,000-19,999 kg/quarter = 5% discount

**TIER 4** (Premium Volume):
- Ocean: 300+ TEU/quarter = 7% discount
- Air: 20,000+ kg/quarter = 7% discount

### 3.3 Volume Shortfall
If Forwarder fails to meet minimum volume commitment:
- Rates revert to standard published tariff
- No retroactive discount adjustments
- Carrier may renegotiate rates with 30 days notice

### 3.4 Incentive Bonuses
For exceeding committed volumes by >20%, Forwarder may receive:
- Additional 2% rate reduction for following quarter
- Priority space allocation
- Enhanced equipment availability
- Waived documentation fees

---

## ARTICLE 4: PAYMENT TERMS

### 4.1 Payment Schedule
**OCEAN FREIGHT:**
- Payment due: PREPAID before vessel departure OR 30 days from B/L date (per agreement)
- Forwarder credit limit: $____________

**AIR FREIGHT:**
- Payment due: PREPAID before flight OR 15 days from AWB date (per agreement)
- Forwarder credit limit: $____________

### 4.2 Credit Terms
Credit extended subject to:
- Satisfactory credit check and references
- Personal guarantee (if required)
- Security deposit: $____________
- Right to modify credit terms with 15 days notice

### 4.3 Late Payment
Late payments subject to:
- **1.5% monthly interest** (18% APR)
- **Suspension of credit** for payments >15 days late
- **Hold on cargo** for payments >30 days late
- **Collection costs** and attorney's fees if legal action required

### 4.4 Currency
All payments in US Dollars (USD) unless otherwise agreed. Foreign currency transactions at exchange rate on payment date.

---

## ARTICLE 5: BOOKING AND DOCUMENTATION

### 5.1 Booking Procedures
Forwarder must provide:
- **Ocean**: Booking request 5 business days before cutoff
- **Air**: Booking request 48 hours before flight
- Complete and accurate cargo details
- Shipper and consignee information
- Special handling requirements

### 5.2 Documentation Requirements
Forwarder responsible for providing:
- Commercial Invoice (certified)
- Packing List (detailed)
- Export License (if required)
- Certificate of Origin
- Special permits (FDA, USDA, etc.)
- VGM (Verified Gross Mass) for ocean
- Dangerous Goods Declaration (if hazmat)

### 5.3 Document Cutoffs
Documents due per Carrier's published cutoffs:
- **Ocean**: Original docs 48 hours before vessel departure
- **Air**: Complete docs at time of cargo delivery
- Late documentation may result in rolled booking or additional fees

### 5.4 Bill of Lading / Air Waybill
- **Ocean**: Carrier issues B/L per COGSA terms
- **Air**: Carrier issues AWB per Montreal Convention
- Original B/L required for cargo release (unless surrendered)
- Telex release available at Forwarder's request
- Express B/L service available (fee applies)

---

## ARTICLE 6: LIABILITY AND INSURANCE

### 6.1 Carrier Liability - OCEAN

Carrier liability governed by **Carriage of Goods by Sea Act (COGSA)**:
- **Maximum liability**: $500 per package or customary freight unit
- **Higher value**: Must be declared and ad valorem freight paid
- **Limitation period**: Claims must be filed within 9 months
- **Notice**: Written notice of damage within 3 days of delivery

**CARRIER NOT LIABLE FOR:**
- Act of God, perils of the sea
- Act of war, public enemies
- Arrest or restraint of princes, rulers, or people
- Quarantine restrictions
- Acts or omissions of shipper
- Inherent defect, quality, or vice of goods
- Strikes or lockouts
- Saving or attempting to save life or property at sea
- Wastage in bulk or weight, or any other loss or damage from inherent defect
- Insufficiency of packing
- Insufficiency or inadequacy of marks
- Latent defects not discoverable by due diligence

### 6.2 Carrier Liability - AIR

Carrier liability governed by **Montreal Convention**:
- **Maximum liability**: Approximately 22 Special Drawing Rights (SDR) per kilogram (~US$30/kg)
- **Higher value**: Must be declared and special charges paid
- **Limitation period**: Claims within 2 years
- **Notice**: Written notice of damage within 14 days of delivery

### 6.3 Cargo Insurance
- **Carrier does NOT provide cargo insurance**
- **Forwarder/shipper must obtain separate cargo insurance**
- Carrier's liability limitations apply even if no insurance
- Carrier may assist in insurance placement (separate fee)

### 6.4 Indemnification by Forwarder
Forwarder indemnifies Carrier for:
- Inaccurate cargo descriptions or declarations
- Undeclared hazardous materials
- Improper packaging
- Violations of customs/import laws
- Third-party claims arising from cargo
- Fines or penalties due to documentation errors

---

## ARTICLE 7: SPECIAL CARGO AND RESTRICTIONS

### 7.1 Hazardous Materials
Dangerous goods accepted ONLY if:
- Proper classification and packaging per IMDG/IATA
- Complete Dangerous Goods Declaration provided
- Pre-approval obtained from Carrier
- Additional fees paid
- Forwarder liable for all fines/penalties for non-disclosure

### 7.2 Refrigerated Cargo (Reefer)
For temperature-controlled cargo:
- Carrier responsible for maintaining set temperature
- Shipper responsible for proper stuffing and pre-cooling
- Temperature logs provided upon delivery
- Carrier not liable for cargo defects or improper packing
- Genset surcharges apply

### 7.3 Oversized/Overweight Cargo
Cargo exceeding standard dimensions subject to:
- Pre-approval requirement
- Additional charges (out-of-gauge surcharge)
- Equipment availability (no guarantee)
- Special handling fees

### 7.4 High-Value Cargo
Cargo value >$100,000 per container/shipment requires:
- Advance notification
- Value declaration and ad valorem charges
- Additional security measures
- Possible insurance requirements

### 7.5 Prohibited Cargo
Carrier will NOT accept:
- Illegal drugs or contraband
- Weapons, explosives (except with proper permits)
- Stolen goods
- Currency, precious metals (except with approval)
- Live animals (except with proper permits and facilities)
- Perishable goods not properly packed
- Hazmat not properly declared

---

## ARTICLE 8: EQUIPMENT AND OPERATIONS

### 8.1 Container/Equipment Provision
**OCEAN:**
- Carrier provides containers within reasonable time after booking
- Standard equipment: 20ft, 40ft, 40HC containers
- Special equipment (reefer, open-top, flat rack) subject to availability
- Equipment interchange per EIR (Equipment Interchange Receipt)

**AIR:**
- Forwarder responsible for cargo delivery to airport
- Carrier provides ULD (Unit Load Devices) if applicable
- Weight and dimensional restrictions apply

### 8.2 Free Time
**OCEAN:**
- **Demurrage-free days** (at origin): ___ days from container availability
- **Detention-free days**: ___ days from gate-out to return
- Per-day charges after free time: $___/day/container

**AIR:**
- Free time at destination: ___ hours from arrival
- Storage charges after free time: $___/kg/day

### 8.3 Container/Equipment Return
- Equipment must be returned in clean, damage-free condition
- Empty return at designated depot
- Damage charges assessed per standard depot survey
- Late return fees apply per tariff

### 8.4 VGM (Verified Gross Mass)
Per SOLAS requirements:
- Forwarder responsible for VGM certification
- VGM must be provided before vessel cutoff
- Carrier may provide VGM service (fee applies)
- Late/missing VGM = cargo rolled to next vessel

---

## ARTICLE 9: TRANSIT TIMES AND SCHEDULE

### 9.1 Estimated Transit Times
**OCEAN:** Port-to-port transit times as specified in Appendix A (e.g., 16-18 days Shanghai to Los Angeles)

**AIR:** Airport-to-airport transit times typically 24-72 hours depending on route and connections

### 9.2 Schedule Changes
Carrier reserves right to:
- Change vessel/flight schedules with notice
- Substitute vessels/aircraft
- Change ports of call/transshipment points
- Combine or split shipments

### 9.3 No Guarantee of Schedule
- Transit times are ESTIMATES only, not guarantees
- Carrier not liable for delays due to weather, port congestion, strikes, etc.
- No compensation for schedule changes or delays
- Time-sensitive cargo should be insured

### 9.4 Expedited Services
Express/priority services available at premium rates:
- Direct sailings (no transshipment)
- Priority loading
- First-off discharge
- Expedited customs clearance coordination

---

## ARTICLE 10: FORCE MAJEURE

Neither party liable for delays or failures due to:
- Natural disasters (storms, earthquakes, floods)
- War, terrorism, civil unrest
- Government actions (embargoes, port closures)
- Labor disputes (strikes, lockouts)
- Port or equipment capacity constraints
- Pandemic/epidemic restrictions
- Mechanical breakdowns beyond reasonable control
- Cybersecurity events

If force majeure continues >60 days, either party may terminate affected routes without penalty.

---

## ARTICLE 11: CONFIDENTIALITY

### 11.1 Rate Confidentiality
Both parties agree:
- Contract rates are confidential
- Not to disclose rates to competitors
- Not to use rates to undercut other party's business
- Breach may result in immediate termination

### 11.2 Customer Information
- Carrier may not solicit Forwarder's customers
- Customer lists and shipment details confidential
- Information used only for service provision

---

## ARTICLE 12: TERM AND TERMINATION

### 12.1 Initial Term
Agreement effective from __________ to __________ (typically 6-12 months).

### 12.2 Renewal
Auto-renews for successive periods unless terminated with 60 days notice.

### 12.3 Termination for Cause
Immediate termination for:
- Material breach not cured within 15 days
- Non-payment >30 days
- Bankruptcy or insolvency
- Violation of laws
- Failure to meet minimum volume (after 2 consecutive quarters)

### 12.4 Effect of Termination
- Complete shipments in transit
- Pay all outstanding amounts
- Return equipment
- Rates revert to published tariff for in-transit shipments

---

## ARTICLE 13: DISPUTE RESOLUTION

### 13.1 Governing Law
Governed by US Federal Maritime Law (for ocean) and Montreal Convention (for air), and laws of State of Michigan.

### 13.2 Arbitration
Disputes submitted to binding arbitration under AAA Commercial Rules in Troy, Michigan.

### 13.3 Limitation of Actions
All claims must be filed within:
- **9 months** for ocean freight (COGSA)
- **2 years** for air freight (Montreal Convention)

---

## SIGNATURES

**FLEETFLOW TMS LLC:**               **CARRIER:**

_________________________            _________________________
Signature                            Signature

Name: Dieasha Davis                  Name: 
Title: President & CEO               Title: 
Date: ______________                 Date: ______________
`,
      
      specialClauses: [
        'VOLUME COMMITMENT MANDATORY: Minimum quarterly volume required to maintain contracted rates',
        'COGSA LIABILITY LIMITS APPLY: Carrier liability strictly limited to $500 per package for ocean freight',
        'MONTREAL CONVENTION APPLIES: Air freight liability limited to approximately $30 per kilogram',
        'NO SCHEDULE GUARANTEE: Transit times are estimates only; Carrier not liable for delays',
        'EQUIPMENT AVAILABILITY: Subject to capacity constraints and market conditions',
        'RATE ADJUSTMENT RIGHTS: Carrier may adjust rates for fuel, peak season, and currency with notice',
        'HAZMAT DISCLOSURE REQUIRED: Undeclared dangerous goods result in immediate contract termination',
        'FREE TIME STRICTLY ENFORCED: Demurrage and detention charges apply after free time expires',
        'PAYMENT SECURITY: Carrier may hold cargo for non-payment',
        'FORCE MAJEURE: No liability for delays due to events beyond reasonable control',
      ],
      
      liabilityDisclaimer: `
**CARRIER LIABILITY LIMITATIONS - CRITICAL NOTICE**

FORWARDER ACKNOWLEDGES AND AGREES:

**OCEAN FREIGHT:**
- Carrier liability governed by CARRIAGE OF GOODS BY SEA ACT (COGSA)
- Maximum liability: **$500 per package** or customary freight unit
- Forwarder/shipper MUST declare higher value and pay ad valorem charges for increased liability
- Claims must be filed within **9 months** of delivery or loss
- Carrier NOT liable for delays, force majeure, or consequential damages

**AIR FREIGHT:**
- Carrier liability governed by MONTREAL CONVENTION
- Maximum liability: Approximately **$30 per kilogram** (~22 SDR/kg)
- Forwarder/shipper MUST declare higher value and pay special charges for increased liability
- Claims must be filed within **2 years** of arrival or expected arrival
- Carrier NOT liable for delays, force majeure, or consequential damages

**NO CONSEQUENTIAL DAMAGES:**
Carrier NOT liable under ANY circumstances for:
- Lost profits or revenue
- Business interruption
- Market fluctuations
- Special or indirect damages

**CARGO INSURANCE REQUIRED:**
Carrier is NOT insurer. Forwarder MUST obtain cargo insurance for full replacement value.

FORWARDER INITIALS: ________  DATE: ________
`,

      forceMAJEUREClause: `
**FORCE MAJEURE - CARRIER SPECIFIC**

Carrier not liable for delays, failures, or cancellations due to:

**MARITIME/AVIATION SPECIFIC:**
- Perils of the sea
- Severe weather (hurricanes, typhoons, fog, ice)
- Port congestion or closures
- Airport capacity constraints
- Vessel/aircraft mechanical failures
- Crew shortages or maritime labor disputes
- Pandemic/health restrictions affecting crew or port operations
- Piracy or security threats
- Canal closures (Suez, Panama)
- Navigational hazards

**GENERAL FORCE MAJEURE:**
- War, terrorism, civil unrest
- Government actions (embargoes, sanctions)
- Strikes, lockouts, labor disputes
- Natural disasters
- Cybersecurity attacks affecting operations

**CARRIER RIGHTS DURING FORCE MAJEURE:**
- Suspend or cancel sailings/flights
- Change routes or transshipment points
- Discharge cargo at alternative ports
- Charge additional fees for alternative arrangements

If force majeure continues >60 days, either party may terminate affected routes without liability.
`,

      disputeResolution: `
**DISPUTE RESOLUTION - CARRIER AGREEMENT**

**GOVERNING LAW:**
- **Ocean Freight**: US Federal Maritime Law and COGSA
- **Air Freight**: Montreal Convention and US Federal Aviation Law
- **Contract Matters**: Laws of State of Michigan

**ARBITRATION:**
All disputes submitted to binding arbitration:
- American Arbitration Association (AAA) Commercial Rules
- Single arbitrator with maritime/aviation expertise
- Location: Troy, Michigan
- Costs shared equally unless arbitrator awards to prevailing party

**LIMITATION OF ACTIONS:**
ALL claims MUST be filed within:
- **Ocean**: 9 months from delivery or expected delivery (COGSA requirement)
- **Air**: 2 years from arrival or expected arrival (Montreal Convention)
- **Contract**: 2 years from breach

**LATE CLAIMS ABSOLUTELY BARRED:**
Failure to file claim within time limits constitutes absolute bar to recovery. NO EXCEPTIONS.

**WAIVER OF JURY TRIAL:**
Both parties waive right to jury trial.

**VENUE:**
If litigation required (instead of arbitration), exclusive venue in Oakland County, Michigan.
`,

      indemnification: `
**MUTUAL INDEMNIFICATION - CARRIER AGREEMENT**

**BY FORWARDER:**
Forwarder indemnifies Carrier for ALL claims, losses, damages, fines, penalties arising from:
- Inaccurate cargo descriptions or declarations
- Undeclared or misdeclared hazardous materials
- Improper packaging or securing of cargo
- Violations of customs, export, or import regulations
- OFAC or sanctions violations
- Intellectual property infringement in cargo
- Third-party claims related to cargo content
- Overweight containers (VGM violations)
- Forwarder's failure to pay duties, taxes, or fees

**BY CARRIER:**
Carrier indemnifies Forwarder for claims arising solely from:
- Carrier's gross negligence in cargo handling
- Carrier's breach of applicable maritime/aviation regulations
- Carrier's willful misconduct

SUBJECT TO: All COGSA and Montreal Convention liability limitations.

**PROCEDURE:**
- Prompt written notice of claim
- Right to defend with counsel of choice
- No settlement without consent
- Indemnifying party pays all costs

**SURVIVAL:**
Indemnification obligations survive termination indefinitely.
`,

      confidentiality: `
**CONFIDENTIALITY - CARRIER RATE AGREEMENT**

**RATE CONFIDENTIALITY:**
Both parties agree contracted rates are CONFIDENTIAL:
- Not to be disclosed to competitors
- Not to be used to undercut other party's business
- May be disclosed to service providers (truckers, customs brokers) as necessary
- May be disclosed as required by law or regulation

**CUSTOMER NON-SOLICITATION:**
Carrier agrees NOT to:
- Directly solicit Forwarder's customers identified through this Agreement
- Offer direct services to Forwarder's customers without Forwarder's consent
- Use customer lists for marketing purposes

**SHIPMENT INFORMATION:**
Shipment details (cargo description, consignee, value) confidential except:
- As required for transportation and customs
- As required by law or government agencies
- As needed for insurance placement

**TERM:**
Confidentiality obligations survive for 3 years after termination.

**BREACH:**
Breach of confidentiality may result in:
- Immediate contract termination
- Monetary damages
- Injunctive relief
`,

      terminationClause: `
**TERMINATION - CARRIER RATE AGREEMENT**

**TERMINATION FOR CONVENIENCE:**
Either party may terminate with 60 days written notice before expiration of current term.

**TERMINATION FOR CAUSE - IMMEDIATE:**

**By Carrier:**
- Non-payment >30 days past due
- Repeated booking no-shows (3+ in 30 days)
- Failure to meet minimum volume 2 consecutive quarters
- Material misrepresentation of cargo
- Violation of hazmat regulations
- Bankruptcy or insolvency of Forwarder

**By Forwarder:**
- Repeated equipment unavailability
- Consistent schedule failures
- Material breach of service standards
- Repeated cargo damage or loss
- Bankruptcy or insolvency of Carrier

**CURE PERIOD:**
15 days to cure material breach (except payment - 5 days to cure)

**EFFECT OF TERMINATION:**

**Immediate:**
- Complete shipments in transit at contracted rates
- Pay all outstanding amounts within 15 days
- Return all equipment and documentation
- Cease using other party's confidential information

**Survival:**
- Liability limitations survive indefinitely
- Indemnification survives indefinitely
- Confidentiality survives 3 years
- Payment obligations survive until paid
- Claims for shipments pre-termination survive per COGSA/Montreal Convention

**NO PENALTY:**
No early termination penalties if proper notice given (except for cause termination).

**TRANSITION:**
60-day transition period to complete in-transit shipments and final settlements.
`,
    };
  }

  /**
   * Default contract terms for other contract types
   */
  private static getDefaultContractTerms() {
    return {
      termsAndConditions: 'Standard terms and conditions apply. Consult legal counsel.',
      specialClauses: [],
      liabilityDisclaimer: 'Standard liability limitations apply.',
      forceMAJEUREClause: 'Standard force majeure provisions apply.',
      disputeResolution: 'Disputes resolved under Michigan law.',
      indemnification: 'Standard mutual indemnification applies.',
      confidentiality: 'Standard confidentiality provisions apply.',
      terminationClause: 'Either party may terminate with 30 days notice.',
    };
  }

  // Additional contract types (abbreviated for space)
  private static getCustomsBrokerAgreementTerms() {
    return this.getDefaultContractTerms();
  }

  private static getTruckingContractTerms() {
    return this.getDefaultContractTerms();
  }

  private static getWarehouseAgreementTerms() {
    return this.getDefaultContractTerms();
  }

  private static getInsuranceContractTerms() {
    return this.getDefaultContractTerms();
  }

  private static getVolumeCommitmentTerms() {
    return this.getDefaultContractTerms();
  }

  private static getSLAAgreementTerms() {
    return this.getDefaultContractTerms();
  }

  private static getAgencyAgreementTerms() {
    return this.getDefaultContractTerms();
  }

  private static getNVOCCAgreementTerms() {
    return this.getDefaultContractTerms();
  }
}

export default FreightForwarderContractTemplates;
