import { createClient } from '@supabase/supabase-js';
import {
  ContractIdentificationData,
  ContractIdentificationService,
} from './ContractIdentificationService';

export interface LeadContractData {
  leadId: string;
  brokerId: string;
  brokerName: string;
  brokerCompany: string;
  shipperId: string;
  shipperName: string;
  shipperCompany: string;
  source: string;
  potentialValue: number;
  conversionType: string;
  tenantId: string;
  contractTerms?: {
    commissionRate: number;
    paymentTerms: string;
    contractDuration: string;
    exclusivity: boolean;
    territory: string;
  };
}

// NEW: Dispatcher AI Lead Generation Contract Interface
export interface DispatcherLeadContractData {
  leadId: string;
  dispatcherId: string;
  dispatcherName: string;
  dispatcherCompany: string;
  carrierId: string;
  carrierName: string;
  carrierCompany: string;
  source: string; // AI source (FMCSA, Weather, Economic, etc.)
  potentialValue: number;
  conversionType: string;
  tenantId: string;
  contractTerms?: {
    commissionRate: number; // Default 5% for dispatchers
    paymentTerms: string;
    contractDuration: string;
    exclusivity: boolean;
    territory: string;
  };
}

export interface GeneratedContract {
  contractId: string;
  contractNumber: string;
  contractType:
    | 'lead_generation'
    | 'dispatcher_lead_generation'
    | 'revenue_sharing'
    | 'exclusive_partnership';
  status: 'draft' | 'pending_signature' | 'active' | 'terminated' | 'expired';
  // Enhanced parties structure to support both broker and dispatcher contracts
  parties: {
    fleetflow: {
      name: 'FleetFlow Technologies, Inc.';
      address: string;
      taxId: string;
    };
    // For broker contracts
    broker?: {
      name: string;
      company: string;
      address: string;
      taxId: string;
    };
    shipper?: {
      name: string;
      company: string;
      address: string;
      taxId: string;
    };
    // For dispatcher contracts
    dispatcher?: {
      name: string;
      company: string;
      address: string;
      taxId: string;
    };
    carrier?: {
      name: string;
      company: string;
      address: string;
      taxId: string;
    };
  };
  terms: {
    commissionRate: number;
    paymentSchedule: string;
    reportingRequirements: string;
    auditRights: string;
    penaltyClauses: string[];
    terminationClauses: string[];
  };
  revenueTracking: {
    totalRevenue: number;
    commissionEarned: number;
    lastPaymentDate?: string;
    nextPaymentDate: string;
    paymentHistory: Array<{
      date: string;
      amount: number;
      transactionId: string;
    }>;
  };
  metadata: {
    leadSource: string;
    conversionDate: string;
    contractGeneratedDate: string;
    effectiveDate: string;
    expirationDate: string;
    autoRenewal: boolean;
  };
}

export class ContractGenerationService {
  private static instance: ContractGenerationService;
  private supabase: any;

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  public static getInstance(): ContractGenerationService {
    if (!ContractGenerationService.instance) {
      ContractGenerationService.instance = new ContractGenerationService();
    }
    return ContractGenerationService.instance;
  }

  /**
   * Generate comprehensive ironclad contract for broker lead conversion
   * UPDATED: 10% commission rate for brokers
   */
  async generateLeadContract(
    data: LeadContractData
  ): Promise<GeneratedContract> {
    try {
      console.log(`📄 Generating broker contract for lead: ${data.leadId}`);

      // Generate professional contract identifier using EP format
      const idData: ContractIdentificationData = {
        brokerInitials: data.brokerId?.slice(0, 2).toUpperCase() || 'XX',
        brokerCompany: data.brokerCompany,
        shipperCode: (data.shipperCompany || 'XXX').slice(0, 3).toUpperCase(),
        commissionRate: 10, // UPDATED: 10% for broker contracts
        statusCode: 'P', // Pending signature by default
      };
      const generatedId =
        ContractIdentificationService.generateContractIdentifier(idData);
      const contractId = generatedId.contractIdentifier;
      const contractNumber = generatedId.contractNumber;

      // Generate comprehensive contract terms
      const contract: GeneratedContract = {
        contractId,
        contractNumber,
        contractType: 'lead_generation',
        status: 'pending_signature',
        parties: {
          fleetflow: {
            name: 'FleetFlow Technologies, Inc.',
            address: '1234 Technology Drive, Suite 100, Atlanta, GA 30301',
            taxId: 'XX-XXXXXXX',
          },
          broker: {
            name: data.brokerName,
            company: data.brokerCompany,
            address: 'To be provided by broker',
            taxId: 'To be provided by broker',
          },
          shipper: {
            name: data.shipperName,
            company: data.shipperCompany,
            address: 'To be provided by shipper',
            taxId: 'To be provided by shipper',
          },
        },
        terms: {
          commissionRate: 10.0, // UPDATED: 10% commission rate for brokers
          paymentSchedule: 'Net 15 days from invoice date',
          reportingRequirements:
            'Monthly revenue reports due by 5th of each month',
          auditRights:
            'FleetFlow reserves the right to audit broker records at any time',
          penaltyClauses: this.generatePenaltyClauses(),
          terminationClauses: this.generateTerminationClauses(),
        },
        revenueTracking: {
          totalRevenue: 0,
          commissionEarned: 0,
          nextPaymentDate: new Date(
            Date.now() + 15 * 24 * 60 * 60 * 1000
          ).toISOString(),
          paymentHistory: [],
        },
        metadata: {
          leadSource: data.source,
          conversionDate: new Date().toISOString(),
          contractGeneratedDate: new Date().toISOString(),
          effectiveDate: new Date().toISOString(),
          expirationDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          autoRenewal: true,
        },
      };

      // Save contract to database
      await this.saveContract(contract, data.tenantId);

      // Generate contract document
      const contractDocument = this.generateContractDocument(contract, data);

      // Send contract for signature
      await this.sendForSignature(contract, contractDocument);

      console.log(`✅ Broker contract generated successfully: ${contractId}`);
      return contract;
    } catch (error: any) {
      console.error('❌ Broker contract generation failed:', error);
      throw new Error(`Broker contract generation failed: ${error.message}`);
    }
  }

  /**
   * NEW: Generate comprehensive ironclad contract for dispatcher lead conversion
   * 5% commission rate for dispatchers
   */
  async generateDispatcherLeadContract(
    data: DispatcherLeadContractData
  ): Promise<GeneratedContract> {
    try {
      console.log(`📄 Generating dispatcher contract for lead: ${data.leadId}`);

      // Generate professional contract identifier using DP format (Dispatcher Partnership)
      const idData: ContractIdentificationData = {
        brokerInitials: data.dispatcherId?.slice(0, 2).toUpperCase() || 'XX',
        brokerCompany: data.dispatcherCompany,
        shipperCode: (data.carrierCompany || 'XXX').slice(0, 3).toUpperCase(),
        commissionRate: 5, // 5% for dispatcher contracts
        statusCode: 'P', // Pending signature by default
      };
      const generatedId =
        ContractIdentificationService.generateContractIdentifier(idData);
      const contractId = `DP-${generatedId.contractIdentifier}`; // DP prefix for Dispatcher Partnership
      const contractNumber = `DP-${generatedId.contractNumber}`;

      // Generate comprehensive dispatcher contract terms
      const contract: GeneratedContract = {
        contractId,
        contractNumber,
        contractType: 'dispatcher_lead_generation',
        status: 'pending_signature',
        parties: {
          fleetflow: {
            name: 'FleetFlow Technologies, Inc.',
            address: '1234 Technology Drive, Suite 100, Atlanta, GA 30301',
            taxId: 'XX-XXXXXXX',
          },
          dispatcher: {
            name: data.dispatcherName,
            company: data.dispatcherCompany,
            address: 'To be provided by dispatcher',
            taxId: 'To be provided by dispatcher',
          },
          carrier: {
            name: data.carrierName,
            company: data.carrierCompany,
            address: 'To be provided by carrier',
            taxId: 'To be provided by carrier',
          },
        },
        terms: {
          commissionRate: 5.0, // 5% commission rate for dispatchers
          paymentSchedule: 'Net 10 days from invoice date',
          reportingRequirements:
            'Bi-weekly dispatch reports due by 15th and last day of each month',
          auditRights:
            'FleetFlow reserves the right to audit dispatcher records with 48-hour notice',
          penaltyClauses: this.generateDispatcherPenaltyClauses(),
          terminationClauses: this.generateDispatcherTerminationClauses(),
        },
        revenueTracking: {
          totalRevenue: 0,
          commissionEarned: 0,
          nextPaymentDate: new Date(
            Date.now() + 10 * 24 * 60 * 60 * 1000
          ).toISOString(),
          paymentHistory: [],
        },
        metadata: {
          leadSource: data.source,
          conversionDate: new Date().toISOString(),
          contractGeneratedDate: new Date().toISOString(),
          effectiveDate: new Date().toISOString(),
          expirationDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          autoRenewal: true,
        },
      };

      // Save contract to database
      await this.saveContract(contract, data.tenantId);

      // Generate contract document
      const contractDocument = this.generateDispatcherContractDocument(
        contract,
        data
      );

      // Send contract for signature
      await this.sendForSignature(contract, contractDocument);

      console.log(
        `✅ Dispatcher contract generated successfully: ${contractId}`
      );
      return contract;
    } catch (error: any) {
      console.error('❌ Dispatcher contract generation failed:', error);
      throw new Error(
        `Dispatcher contract generation failed: ${error.message}`
      );
    }
  }

  /**
   * Generate comprehensive penalty clauses
   */
  private generatePenaltyClauses(): string[] {
    return [
      'FAILURE TO PAY COMMISSION: If Broker fails to pay the 10% commission within 15 days of invoice date, a late fee of 1.5% per month (18% annually) will be assessed on all outstanding amounts. After 30 days of non-payment, FleetFlow reserves the right to terminate this agreement and pursue legal action for collection of all outstanding commissions plus legal fees.',

      'UNDERREPORTING PENALTY: If FleetFlow discovers that Broker has underreported revenue by more than 5%, Broker will be assessed a penalty equal to 200% of the underreported commission amount, plus interest at 1.5% per month from the date the revenue should have been reported.',

      'CONCEALMENT PENALTY: Any attempt to conceal revenue, create false invoices, or engage in any form of revenue diversion will result in immediate contract termination and a penalty equal to 500% of all commissions owed, plus legal fees and court costs.',

      'NON-COMPLIANCE PENALTY: Failure to provide monthly revenue reports by the 5th of each month will result in a $500 penalty per occurrence. Three consecutive late reports will trigger contract review and potential termination.',

      "AUDIT RESISTANCE PENALTY: If Broker refuses to cooperate with FleetFlow's audit rights or provides false information during audit, Broker will be assessed a penalty of $10,000 plus 100% of all commissions owed for the audit period.",

      'CONTRACT VIOLATION PENALTY: Any violation of the exclusivity clause or territory restrictions will result in immediate termination and a penalty equal to 300% of all commissions earned during the violation period.',

      "DEFAULT PENALTY: In the event of contract default, Broker agrees to pay all outstanding commissions, penalties, legal fees, and court costs. FleetFlow reserves the right to place liens on Broker's assets and pursue all available legal remedies.",

      'FRAUD PENALTY: Any fraudulent activity, including but not limited to falsifying documents, creating phantom shipments, or misrepresenting revenue will result in immediate termination, forfeiture of all commissions, and legal action for damages including punitive damages.',
    ];
  }

  /**
   * Generate dispatcher-specific penalty clauses
   */
  private generateDispatcherPenaltyClauses(): string[] {
    return [
      'FAILURE TO PAY COMMISSION: If Dispatcher fails to pay the 5% commission within 10 days of invoice date, a late fee of 2% per month (24% annually) will be assessed on all outstanding amounts. After 20 days of non-payment, FleetFlow reserves the right to terminate this agreement and pursue legal action for collection of all outstanding commissions plus legal fees.',

      'UNDERREPORTING PENALTY: If FleetFlow discovers that Dispatcher has underreported revenue by more than 3%, Dispatcher will be assessed a penalty equal to 300% of the underreported commission amount, plus interest at 2% per month from the date the revenue should have been reported.',

      'CONCEALMENT PENALTY: Any attempt to conceal dispatch fees, create false load confirmations, or engage in any form of revenue diversion will result in immediate contract termination and a penalty equal to 750% of all commissions owed, plus legal fees and court costs.',

      'NON-COMPLIANCE PENALTY: Failure to provide bi-weekly dispatch reports by the 15th and last day of each month will result in a $750 penalty per occurrence. Two consecutive late reports will trigger contract review and potential termination.',

      "AUDIT RESISTANCE PENALTY: If Dispatcher refuses to cooperate with FleetFlow's audit rights or provides false information during audit, Dispatcher will be assessed a penalty of $15,000 plus 150% of all commissions owed for the audit period.",

      'CARRIER POACHING PENALTY: Any attempt to directly contact or solicit carriers introduced through AI-generated leads will result in immediate termination and a penalty equal to 500% of all commissions earned during the violation period, plus $25,000 liquidated damages.',

      "DEFAULT PENALTY: In the event of contract default, Dispatcher agrees to pay all outstanding commissions, penalties, legal fees, and court costs. FleetFlow reserves the right to place liens on Dispatcher's assets and pursue all available legal remedies.",

      'FRAUD PENALTY: Any fraudulent activity, including but not limited to falsifying dispatch records, creating phantom loads, or misrepresenting revenue will result in immediate termination, forfeiture of all commissions, and legal action for damages including punitive damages up to $100,000.',
    ];
  }

  /**
   * Generate comprehensive termination clauses
   */
  private generateTerminationClauses(): string[] {
    return [
      'IMMEDIATE TERMINATION: This agreement may be terminated immediately by FleetFlow for: (a) failure to pay commissions within 30 days of due date, (b) underreporting revenue by more than 10%, (c) any fraudulent activity, (d) violation of exclusivity or territory restrictions, (e) failure to provide required documentation within 10 days of request.',

      'TERMINATION FOR CONVENIENCE: Either party may terminate this agreement with 30 days written notice. Upon termination, all outstanding commissions must be paid within 15 days, and Broker must provide final revenue report within 10 days of termination.',

      'POST-TERMINATION OBLIGATIONS: Upon termination, Broker remains obligated to: (a) pay all outstanding commissions for 24 months following termination, (b) provide monthly revenue reports for 12 months following termination, (c) cooperate with any audit requests for 36 months following termination, (d) maintain all records for 7 years following termination.',

      'SURVIVAL CLAUSE: All payment obligations, audit rights, penalty provisions, and confidentiality requirements survive termination of this agreement for the full duration specified in each clause.',

      'LIQUIDATED DAMAGES: In the event of early termination by Broker without cause, Broker agrees to pay liquidated damages equal to 12 months of average monthly commission payments, calculated based on the previous 12 months of revenue.',
    ];
  }

  /**
   * Generate dispatcher-specific termination clauses
   */
  private generateDispatcherTerminationClauses(): string[] {
    return [
      'IMMEDIATE TERMINATION: This agreement may be terminated immediately by FleetFlow for: (a) failure to pay commissions within 20 days of due date, (b) underreporting revenue by more than 5%, (c) any fraudulent activity, (d) violation of carrier contact restrictions, (e) failure to provide required documentation within 5 days of request.',

      'TERMINATION FOR CONVENIENCE: Either party may terminate this agreement with 15 days written notice. Upon termination, all outstanding commissions must be paid within 10 days, and Dispatcher must provide final dispatch report within 5 days of termination.',

      'POST-TERMINATION OBLIGATIONS: Upon termination, Dispatcher remains obligated to: (a) pay all outstanding commissions for 18 months following termination, (b) provide bi-weekly dispatch reports for 6 months following termination, (c) cooperate with any audit requests for 24 months following termination, (d) maintain all dispatch records for 5 years following termination.',

      'SURVIVAL CLAUSE: All payment obligations, audit rights, penalty provisions, and confidentiality requirements survive termination of this agreement for the full duration specified in each clause.',

      'LIQUIDATED DAMAGES: In the event of early termination by Dispatcher without cause, Dispatcher agrees to pay liquidated damages equal to 6 months of average monthly commission payments, calculated based on the previous 6 months of revenue.',

      'NON-COMPETE: For 12 months following termination, Dispatcher may not directly dispatch for any carriers introduced through FleetFlow AI-generated leads without paying a $50,000 interference fee plus ongoing 5% commission to FleetFlow.',
    ];
  }

  /**
   * Generate comprehensive contract document
   */
  private generateContractDocument(
    contract: GeneratedContract,
    data: LeadContractData
  ): string {
    const contractText = `
# LEAD GENERATION AND REVENUE SHARING AGREEMENT

**Contract Number:** ${contract.contractNumber}
**Effective Date:** ${new Date(contract.metadata.effectiveDate).toLocaleDateString()}
**Expiration Date:** ${new Date(contract.metadata.expirationDate).toLocaleDateString()}

## PARTIES

**FleetFlow Technologies, Inc.** ("FleetFlow")
${contract.parties.fleetflow.address}

**${contract.parties.broker!.company}** ("Broker")
Represented by: ${contract.parties.broker!.name}

**${contract.parties.shipper!.company}** ("Shipper")
Represented by: ${contract.parties.shipper!.name}

## RECITALS

WHEREAS, FleetFlow generated a qualified lead for Broker through its AI-powered lead generation platform (Source: ${data.source});

WHEREAS, Broker has accepted this lead and converted it into a business relationship with Shipper;

WHEREAS, the parties wish to establish a revenue-sharing arrangement for all business generated from this lead;

NOW, THEREFORE, the parties agree as follows:

## 1. COMMISSION STRUCTURE

### 1.1 Commission Rate
Broker agrees to pay FleetFlow a commission of **10% (ten percent)** of the gross revenue generated from all business transactions with Shipper, including but not limited to:
- Freight transportation services
- Warehousing services
- 3PL services
- Any additional services provided to Shipper
- Renewals, extensions, or modifications of existing contracts

### 1.2 Revenue Definition
"Gross Revenue" means the total amount invoiced to Shipper before any deductions, credits, or adjustments, regardless of payment status.

## 2. PAYMENT TERMS

### 2.1 Payment Schedule
- Commission payments are due within **15 days** of invoice date
- Late payments will incur interest at **1.5% per month (18% annually)**
- All payments must be made via wire transfer or certified check

### 2.2 Reporting Requirements
- Monthly revenue reports due by the **5th of each month**
- Reports must include: invoice numbers, dates, amounts, and payment status
- Failure to report will result in penalties as outlined in Section 4

## 3. AUDIT RIGHTS

### 3.1 FleetFlow Audit Rights
FleetFlow reserves the right to:
- Audit Broker's books and records at any time
- Request supporting documentation for all revenue reported
- Conduct surprise audits with 24-hour notice
- Engage third-party auditors at Broker's expense if discrepancies exceed 5%

### 3.2 Broker Cooperation
Broker must:
- Provide full access to all relevant records
- Respond to audit requests within 10 business days
- Maintain all records for 7 years following contract termination

## 4. PENALTY PROVISIONS

### 4.1 Late Payment Penalties
- 1-15 days late: 1.5% per month interest
- 16-30 days late: 2% per month interest + $500 penalty
- 31+ days late: Contract termination + legal action

### 4.2 Underreporting Penalties
- 1-5% underreporting: 100% penalty on underreported amount
- 6-10% underreporting: 200% penalty on underreported amount
- 11%+ underreporting: 500% penalty + immediate termination

### 4.3 Concealment Penalties
Any attempt to conceal revenue or create false documentation will result in:
- Immediate contract termination
- 500% penalty on all commissions owed
- Legal action for fraud and damages
- Reporting to relevant authorities

### 4.4 Non-Compliance Penalties
- Late reports: $500 per occurrence
- Audit resistance: $10,000 + 100% of commissions for audit period
- Contract violations: 300% penalty on all commissions during violation

## 5. TERMINATION

### 5.1 Immediate Termination
FleetFlow may terminate immediately for:
- Non-payment exceeding 30 days
- Underreporting exceeding 10%
- Any fraudulent activity
- Violation of exclusivity or territory restrictions
- Failure to provide required documentation

### 5.2 Post-Termination Obligations
Upon termination, Broker must:
- Pay all outstanding commissions for 24 months
- Provide monthly reports for 12 months
- Cooperate with audits for 36 months
- Maintain records for 7 years

## 6. CONFIDENTIALITY

### 6.1 Confidential Information
All terms of this agreement, revenue data, and business information are confidential and may not be disclosed to third parties without written consent.

### 6.2 Non-Disclosure
Broker agrees not to disclose FleetFlow's lead generation methods, pricing, or business practices to competitors.

## 7. GOVERNING LAW

This agreement is governed by the laws of the State of Georgia. Any disputes will be resolved in the courts of Fulton County, Georgia.

## 8. ENTIRE AGREEMENT

This document constitutes the entire agreement between the parties and supersedes all prior agreements or understandings.

## 9. SIGNATURES

**FleetFlow Technologies, Inc.**

By: ___________________________
Title: _________________________
Date: _________________________

**${contract.parties.broker!.company}**

By: ___________________________
Title: _________________________
Date: _________________________

**${contract.parties.shipper!.company}**

By: ___________________________
Title: _________________________
Date: _________________________

---

**IMPORTANT NOTICE:** This contract contains legally binding obligations. Please review carefully before signing. Consult with legal counsel if you have any questions.
    `;

    return contractText;
  }

  /**
   * NEW: Generate comprehensive contract document for dispatcher
   */
  private generateDispatcherContractDocument(
    contract: GeneratedContract,
    data: DispatcherLeadContractData
  ): string {
    const contractText = `
# DISPATCHER LEAD GENERATION AND REVENUE SHARING AGREEMENT

**Contract Number:** ${contract.contractNumber}
**Effective Date:** ${new Date(contract.metadata.effectiveDate).toLocaleDateString()}
**Expiration Date:** ${new Date(contract.metadata.expirationDate).toLocaleDateString()}

## PARTIES

**FleetFlow Technologies, Inc.** ("FleetFlow")
${contract.parties.fleetflow.address}

**${contract.parties.dispatcher!.company}** ("Dispatcher")
Represented by: ${contract.parties.dispatcher!.name}

**${contract.parties.carrier!.company}** ("Carrier")
Represented by: ${contract.parties.carrier!.name}

## RECITALS

WHEREAS, FleetFlow generated a qualified lead for Dispatcher through its AI-powered lead generation platform (Source: ${data.source});

WHEREAS, Dispatcher has accepted this lead and converted it into a business relationship with Carrier;

WHEREAS, the parties wish to establish a revenue-sharing arrangement for all business generated from this lead;

NOW, THEREFORE, the parties agree as follows:

## 1. COMMISSION STRUCTURE

### 1.1 Commission Rate
Dispatcher agrees to pay FleetFlow a commission of **5% (five percent)** of the gross revenue generated from all business transactions with Carrier, including but not limited to:
- Freight transportation services
- Warehousing services
- 3PL services
- Any additional services provided to Carrier
- Renewals, extensions, or modifications of existing contracts

### 1.2 Revenue Definition
"Gross Revenue" means the total amount invoiced to Carrier before any deductions, credits, or adjustments, regardless of payment status.

## 2. PAYMENT TERMS

### 2.1 Payment Schedule
- Commission payments are due within **10 days** of invoice date
- Late payments will incur interest at **1.5% per month (18% annually)**
- All payments must be made via wire transfer or certified check

### 2.2 Reporting Requirements
- Bi-weekly dispatch reports due by the **15th and last day of each month**
- Reports must include: invoice numbers, dates, amounts, and payment status
- Failure to report will result in penalties as outlined in Section 4

## 3. AUDIT RIGHTS

### 3.1 FleetFlow Audit Rights
FleetFlow reserves the right to:
- Audit Dispatcher's books and records at any time
- Request supporting documentation for all revenue reported
- Conduct surprise audits with 48-hour notice
- Engage third-party auditors at Dispatcher's expense if discrepancies exceed 5%

### 3.2 Dispatcher Cooperation
Dispatcher must:
- Provide full access to all relevant records
- Respond to audit requests within 10 business days
- Maintain all records for 7 years following contract termination

## 4. PENALTY PROVISIONS

### 4.1 Late Payment Penalties
- 1-15 days late: 1.5% per month interest
- 16-30 days late: 2% per month interest + $500 penalty
- 31+ days late: Contract termination + legal action

### 4.2 Underreporting Penalties
- 1-5% underreporting: 100% penalty on underreported amount
- 6-10% underreporting: 200% penalty on underreported amount
- 11%+ underreporting: 500% penalty + immediate termination

### 4.3 Concealment Penalties
Any attempt to conceal revenue or create false documentation will result in:
- Immediate contract termination
- 500% penalty on all commissions owed
- Legal action for fraud and damages
- Reporting to relevant authorities

### 4.4 Non-Compliance Penalties
- Late reports: $500 per occurrence
- Audit resistance: $10,000 + 100% of commissions for audit period
- Contract violations: 300% penalty on all commissions during violation

## 5. TERMINATION

### 5.1 Immediate Termination
FleetFlow may terminate immediately for:
- Non-payment exceeding 30 days
- Underreporting exceeding 10%
- Any fraudulent activity
- Violation of exclusivity or territory restrictions
- Failure to provide required documentation

### 5.2 Post-Termination Obligations
Upon termination, Dispatcher must:
- Pay all outstanding commissions for 24 months
- Provide monthly reports for 12 months
- Cooperate with audits for 36 months
- Maintain records for 7 years

## 6. CONFIDENTIALITY

### 6.1 Confidential Information
All terms of this agreement, revenue data, and business information are confidential and may not be disclosed to third parties without written consent.

### 6.2 Non-Disclosure
Dispatcher agrees not to disclose FleetFlow's lead generation methods, pricing, or business practices to competitors.

## 7. GOVERNING LAW

This agreement is governed by the laws of the State of Georgia. Any disputes will be resolved in the courts of Fulton County, Georgia.

## 8. ENTIRE AGREEMENT

This document constitutes the entire agreement between the parties and supersedes all prior agreements or understandings.

## 9. SIGNATURES

**FleetFlow Technologies, Inc.**

By: ___________________________
Title: _________________________
Date: _________________________

**${contract.parties.dispatcher!.company}**

By: ___________________________
Title: _________________________
Date: _________________________

**${contract.parties.carrier!.company}**

By: ___________________________
Title: _________________________
Date: _________________________

---

**IMPORTANT NOTICE:** This contract contains legally binding obligations. Please review carefully before signing. Consult with legal counsel if you have any questions.

**AI LEAD GENERATION NOTICE:** This contract specifically covers revenue generated from carriers introduced through FleetFlow's proprietary AI lead generation system. Violations of carrier contact restrictions will result in substantial penalties and legal action.
    `;

    return contractText;
  }

  /**
   * Save contract to database
   */
  private async saveContract(
    contract: GeneratedContract,
    tenantId: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from('contracts').insert({
        contract_id: contract.contractId,
        contract_number: contract.contractNumber,
        contract_type: contract.contractType,
        status: contract.status,
        parties: contract.parties,
        terms: contract.terms,
        revenue_tracking: contract.revenueTracking,
        metadata: contract.metadata,
        tenant_id: tenantId,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      console.log(`✅ Contract saved to database: ${contract.contractId}`);
    } catch (error: any) {
      console.error('Failed to save contract:', error);
      throw error;
    }
  }

  /**
   * Send contract for signature
   */
  private async sendForSignature(
    contract: GeneratedContract,
    contractDocument: string
  ): Promise<void> {
    try {
      // In a real implementation, this would integrate with DocuSign, HelloSign, or similar
      console.log(
        `📧 Sending contract ${contract.contractNumber} for signature`
      );
      console.log(
        `📄 Contract document generated for ${contract.parties.broker?.company || contract.parties.dispatcher?.company || 'Unknown'}`
      );

      // For now, we'll simulate the signature process
      setTimeout(() => {
        this.updateContractStatus(contract.contractId, 'active');
      }, 5000);
    } catch (error: any) {
      console.error('Failed to send contract for signature:', error);
      throw error;
    }
  }

  /**
   * Update contract status
   */
  async updateContractStatus(
    contractId: string,
    status: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('contracts')
        .update({ status })
        .eq('contract_id', contractId);

      if (error) throw error;
      console.log(`✅ Contract status updated: ${contractId} -> ${status}`);
    } catch (error: any) {
      console.error('Failed to update contract status:', error);
      throw error;
    }
  }

  /**
   * Track revenue and calculate commissions
   */
  async trackRevenue(
    contractId: string,
    revenue: number,
    transactionId: string
  ): Promise<void> {
    try {
      // Get current contract
      const { data: contract, error } = await this.supabase
        .from('contracts')
        .select('*')
        .eq('contract_id', contractId)
        .single();

      if (error) throw error;

      const commission = revenue * (contract.terms.commissionRate / 100);
      const paymentDate = new Date().toISOString();

      // Update revenue tracking
      const updatedTracking = {
        ...contract.revenue_tracking,
        totalRevenue: contract.revenue_tracking.totalRevenue + revenue,
        commissionEarned:
          contract.revenue_tracking.commissionEarned + commission,
        lastPaymentDate: paymentDate,
        nextPaymentDate: new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentHistory: [
          ...contract.revenue_tracking.paymentHistory,
          {
            date: paymentDate,
            amount: commission,
            transactionId,
          },
        ],
      };

      // Update contract
      const { error: updateError } = await this.supabase
        .from('contracts')
        .update({ revenue_tracking: updatedTracking })
        .eq('contract_id', contractId);

      if (updateError) throw updateError;

      console.log(
        `✅ Revenue tracked: $${revenue} -> Commission: $${commission}`
      );
    } catch (error: any) {
      console.error('Failed to track revenue:', error);
      throw error;
    }
  }

  /**
   * Get contract by ID
   */
  async getContract(contractId: string): Promise<GeneratedContract | null> {
    try {
      const { data, error } = await this.supabase
        .from('contracts')
        .select('*')
        .eq('contract_id', contractId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Failed to get contract:', error);
      return null;
    }
  }

  /**
   * Get all contracts for a tenant
   */
  async getContractsByTenant(tenantId: string): Promise<GeneratedContract[]> {
    try {
      const { data, error } = await this.supabase
        .from('contracts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Failed to get contracts:', error);
      return [];
    }
  }
}

// Export singleton instance
export const contractGenerationService =
  ContractGenerationService.getInstance();
