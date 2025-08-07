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
    commissionType?: string; // 'one_time' | 'recurring_revenue_share'
    paymentSchedule: string;
    reportingRequirements: string;
    recurringCommissionTerms?: string;
    revenueTrackingRequirement?: string;
    auditRights: string;
    penaltyClauses: string[];
    terminationClauses: string[];
  };
  revenueTracking: {
    totalRevenue: number;
    commissionEarned: number;
    recurringRevenue?: number;
    lastPaymentDate?: string;
    nextPaymentDate: string;
    paymentHistory: Array<{
      date: string;
      amount: number;
      transactionId: string;
      customerId?: string;
      customerName?: string;
      isRecurring?: boolean;
      revenueAmount?: number;
      commissionRate?: number;
    }>;
    aiGeneratedCustomers?: Array<{
      customerId: string;
      customerName: string;
      firstPaymentDate: string;
      lastPaymentDate: string;
      totalRevenue: number;
      totalCommission: number;
      paymentCount: number;
      isActive: boolean;
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
   * UPDATED: 50% recurring revenue share for brokers - ongoing commission for lifetime of AI-generated customer relationships
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
        commissionRate: 50, // UPDATED: 50% recurring revenue share for broker contracts
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
          commissionRate: 50.0, // UPDATED: 50% recurring revenue share for brokers
          commissionType: 'recurring_revenue_share', // NEW: Ongoing revenue sharing model
          paymentSchedule:
            'Net 15 days from invoice date for all ongoing revenue',
          reportingRequirements:
            'Monthly revenue reports due by 5th of each month for all AI-generated leads',
          recurringCommissionTerms:
            'FleetFlow receives 50% of ALL revenue generated from AI-provided leads on an ongoing basis for the duration of customer relationships',
          revenueTrackingRequirement:
            'Broker must report all revenue from AI-generated customers monthly',
          auditRights:
            'FleetFlow reserves the right to audit broker records at any time to verify recurring revenue reporting',
          penaltyClauses: this.generateRecurringPenaltyClauses(),
          terminationClauses: this.generateRecurringTerminationClauses(),
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
   * Generate recurring revenue share penalty clauses for 50% commission model
   */
  private generateRecurringPenaltyClauses(): string[] {
    return [
      'FAILURE TO PAY RECURRING COMMISSION: If Broker fails to pay the 50% recurring revenue share within 15 days of invoice date, a late fee of 2% per month (24% annually) will be assessed on all outstanding amounts. After 30 days of non-payment, FleetFlow will immediately LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including but not limited to: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, and all API access. SHIPPER INFORMATION ACCESS WILL BE COMPLETELY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will remain suspended until all outstanding payments, penalties, and interest are paid in full. FleetFlow reserves the right to terminate this agreement and pursue legal action for collection of all outstanding commissions plus legal fees.',

      'UNDERREPORTING ONGOING REVENUE PENALTY: If FleetFlow discovers that Broker has underreported ongoing revenue from AI-generated customers by more than 3%, Broker will be assessed a penalty equal to 300% of the underreported commission amount, plus interest at 2% per month from the date the revenue should have been reported. Additionally, FleetFlow will immediately SUSPEND BROKER ACCESS to all FleetFlow systems for a minimum of 30 days or until the underreported revenue is fully disclosed and all penalties are paid. During suspension, Broker will lose access to: AI Lead Generation, FreightFlow RFx Platform, Broker Dashboard, CRM System, Analytics, all API integrations, and SHIPPER INFORMATION ACCESS including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, and shipper relationship management.',

      'REVENUE CONCEALMENT PENALTY: Any attempt to conceal ongoing revenue from AI-generated customers, redirect customers to avoid revenue sharing, or engage in any form of revenue diversion will result in immediate contract termination and a penalty equal to 1000% of all concealed revenue, plus legal fees and court costs. FleetFlow will IMMEDIATELY PERMANENTLY LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, API Access, Mobile Applications, and all FleetFlow services. SHIPPER INFORMATION ACCESS WILL BE PERMANENTLY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will be permanently revoked and all data will be frozen until legal resolution is complete.',

      'MONTHLY REPORTING FAILURE: Failure to provide monthly ongoing revenue reports by the 5th of each month will result in a $1,000 penalty per occurrence. Two consecutive late reports will trigger contract review and potential termination. After three consecutive late reports, FleetFlow will SUSPEND BROKER ACCESS to all FleetFlow systems for 14 days or until all overdue reports are submitted. During suspension, Broker will lose access to: AI Lead Generation, FreightFlow RFx Platform, Broker Dashboard, CRM System, Analytics, all API integrations, and SHIPPER INFORMATION ACCESS including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, and shipper relationship management.',

      'CUSTOMER REDIRECT PENALTY: Any attempt to redirect AI-generated customers to avoid ongoing revenue sharing will result in immediate termination and a penalty equal to 500% of all revenue diverted, plus $50,000 liquidated damages per customer. FleetFlow will IMMEDIATELY PERMANENTLY LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, API Access, Mobile Applications, and all FleetFlow services. SHIPPER INFORMATION ACCESS WILL BE PERMANENTLY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will be permanently revoked and all data will be frozen until legal resolution is complete.',

      "AUDIT RESISTANCE PENALTY: If Broker refuses to cooperate with FleetFlow's ongoing revenue audit rights or provides false information during audit, Broker will be assessed a penalty of $25,000 plus 200% of all recurring commissions owed for the audit period. FleetFlow will immediately SUSPEND BROKER ACCESS to all FleetFlow systems for 60 days or until full audit cooperation is provided. During suspension, Broker will lose access to: AI Lead Generation, FreightFlow RFx Platform, Broker Dashboard, CRM System, Analytics, all API integrations, and SHIPPER INFORMATION ACCESS including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, and shipper relationship management.",

      'CONTINUING RELATIONSHIP VIOLATION: Any violation of the ongoing revenue sharing requirements for AI-generated customer relationships will result in immediate termination and a penalty equal to 12 months of projected revenue share based on historical averages. FleetFlow will immediately SUSPEND BROKER ACCESS to all FleetFlow systems for 90 days or until all violations are corrected and penalties are paid. During suspension, Broker will lose access to: AI Lead Generation, FreightFlow RFx Platform, Broker Dashboard, CRM System, Analytics, all API integrations, and SHIPPER INFORMATION ACCESS including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, and shipper relationship management.',

      "DEFAULT ON RECURRING PAYMENTS: In the event of default on recurring revenue sharing, Broker agrees to pay all outstanding commissions, penalties, legal fees, and court costs. FleetFlow will IMMEDIATELY PERMANENTLY LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, API Access, Mobile Applications, and all FleetFlow services. SHIPPER INFORMATION ACCESS WILL BE COMPLETELY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will remain permanently suspended until all outstanding payments, penalties, and legal fees are paid in full. FleetFlow reserves the right to place liens on Broker's assets and pursue all available legal remedies including attachment of future receivables.",

      'FRAUD ON ONGOING REVENUE: Any fraudulent activity related to ongoing revenue reporting, including but not limited to falsifying customer invoices, creating phantom revenue, or misrepresenting customer relationships will result in immediate termination, forfeiture of all commissions, and legal action for damages including punitive damages up to $500,000. FleetFlow will IMMEDIATELY PERMANENTLY LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, API Access, Mobile Applications, and all FleetFlow services. SHIPPER INFORMATION ACCESS WILL BE PERMANENTLY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will be permanently revoked and all data will be frozen until legal resolution is complete.',
    ];
  }

  /**
   * Generate recurring revenue share termination clauses for 50% commission model
   */
  private generateRecurringTerminationClauses(): string[] {
    return [
      'IMMEDIATE TERMINATION FOR RECURRING VIOLATIONS: This agreement may be terminated immediately by FleetFlow for: (a) failure to pay recurring revenue share within 30 days of due date, (b) underreporting ongoing revenue by more than 5%, (c) any fraudulent activity related to ongoing revenue, (d) violation of customer relationship continuity requirements, (e) failure to provide required ongoing documentation within 10 days of request. Upon immediate termination, FleetFlow will IMMEDIATELY PERMANENTLY LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, API Access, Mobile Applications, and all FleetFlow services. SHIPPER INFORMATION ACCESS WILL BE PERMANENTLY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will be permanently revoked and all data will be frozen until legal resolution is complete.',

      'TERMINATION FOR CONVENIENCE: Either party may terminate this agreement with 60 days written notice. Upon termination, all outstanding recurring revenue share obligations continue for existing AI-generated customer relationships for the full duration of those relationships.',

      'POST-TERMINATION ONGOING OBLIGATIONS: Upon termination, Broker remains obligated to: (a) pay 50% revenue share for ALL existing AI-generated customer relationships for the lifetime of those relationships, (b) provide monthly revenue reports for all ongoing customer relationships indefinitely, (c) cooperate with any audit requests for ongoing revenue for 60 months following termination, (d) maintain all customer relationship records for 10 years following termination.',

      'SURVIVAL OF RECURRING OBLIGATIONS: All ongoing revenue sharing obligations, audit rights for recurring revenue, penalty provisions for ongoing payments, and customer relationship obligations survive termination of this agreement indefinitely for all AI-generated customer relationships established during the agreement term.',

      'LIQUIDATED DAMAGES FOR EARLY TERMINATION: In the event of early termination by Broker without cause, Broker agrees to pay liquidated damages equal to 24 months of average monthly recurring commission payments, calculated based on the previous 24 months of ongoing revenue from AI-generated customers.',

      'PERPETUAL NON-INTERFERENCE: Following termination, Broker may not attempt to restructure, redirect, or modify existing AI-generated customer relationships to avoid ongoing revenue sharing obligations. Any such interference will result in liquidated damages of $100,000 per customer plus restoration of full revenue sharing obligations. FleetFlow will IMMEDIATELY PERMANENTLY LOCK BROKER OUT OF ALL FLEETFLOW SYSTEMS including: AI Flow Platform, FreightFlow RFx System, Broker Operations Hub, Lead Generation Services, CRM System, Analytics Dashboard, API Access, Mobile Applications, and all FleetFlow services. SHIPPER INFORMATION ACCESS WILL BE PERMANENTLY BLOCKED including: shipper contact databases, shipper profiles, shipper load boards, shipper communication tools, shipper relationship management, and all shipper data exports. System access will be permanently revoked and all data will be frozen until legal resolution is complete.',

      'ASSIGNMENT OF ONGOING RIGHTS: Upon termination, FleetFlow retains perpetual rights to 50% revenue share from all AI-generated customer relationships. These rights may be assigned, sold, or transferred by FleetFlow without Broker consent.',
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
# COMPREHENSIVE DISPATCHER AI FLOW LEAD GENERATION AND REVENUE SHARING AGREEMENT

**Contract Number:** ${contract.contractNumber}
**Effective Date:** ${new Date(contract.metadata.effectiveDate).toLocaleDateString()}
**Expiration Date:** ${new Date(contract.metadata.expirationDate).toLocaleDateString()}
**Agreement Type:** AI-Powered Dispatch Lead Generation Revenue Sharing Contract

---

## ARTICLE I: PARTIES AND DEFINITIONS

### Section 1.1: Contracting Parties

**FLEETFLOW TECHNOLOGIES, INC.** ("FleetFlow" or "Lead Generator")
A Delaware Corporation
Principal Place of Business: 1234 Technology Drive, Suite 100, Atlanta, GA 30309
Federal Tax ID: 88-1234567
FMCSA MC Number: MC-123456
Contact: Chief Revenue Officer
Email: contracts@fleetflow.com
Phone: (555) 123-4567

**${contract.parties.dispatcher!.company}** ("Dispatcher" or "Service Provider")
Represented by: ${contract.parties.dispatcher!.name}
Title: Operations Manager
Address: [Dispatcher Address]
Phone: [Dispatcher Phone]
Email: [Dispatcher Email]
FMCSA Authority: [If Applicable]

**${contract.parties.carrier!.company}** ("Carrier" or "Client")
Represented by: ${contract.parties.carrier!.name}
Title: Fleet Manager
Address: [Carrier Address]
DOT Number: [DOT Number]
MC Number: [MC Number]

### Section 1.2: Definitions

**"AI Flow Platform"** means FleetFlow's proprietary artificial intelligence-powered lead generation, matching, and business development system.

**"Qualified Lead"** means a carrier prospect that meets predetermined criteria established by Dispatcher and has been verified by FleetFlow's AI system.

**"Conversion"** means the successful establishment of a business relationship between Dispatcher and Carrier resulting in revenue generation.

**"Gross Revenue"** means the total amount invoiced by Dispatcher to Carrier before any deductions, credits, or adjustments.

## ARTICLE II: RECITALS AND PURPOSE

### Section 2.1: Background
WHEREAS, FleetFlow has developed and operates a sophisticated AI-powered lead generation platform specifically designed for the transportation and logistics industry;

WHEREAS, FleetFlow generated a qualified carrier lead for Dispatcher through its AI Flow platform (Source: ${data.source});

WHEREAS, Dispatcher has successfully converted this AI-generated lead into an active business relationship with Carrier;

WHEREAS, the parties wish to establish a comprehensive revenue-sharing arrangement for all current and future business generated from this AI Flow lead;

WHEREAS, this agreement establishes the terms for ongoing commission payments, performance tracking, and business relationship management;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

## ARTICLE III: COMMISSION STRUCTURE AND REVENUE SHARING

### Section 3.1: Commission Rate
Dispatcher agrees to pay FleetFlow a commission of **25% (twenty-five percent)** of the gross revenue generated from all business transactions with Carrier, including but not limited to:
- Freight transportation services
- Warehousing services
- 3PL services
- Logistics coordination services
- Load planning and optimization
- Driver management services
- Any additional services provided to Carrier
- Renewals, extensions, or modifications of existing contracts
- Spot market transactions
- Dedicated contract services

### Section 3.2: Revenue Definition and Calculation
**"Gross Revenue"** means the total amount invoiced by Dispatcher to Carrier before any deductions, credits, or adjustments, regardless of payment status, including:
- Base transportation rates
- Fuel surcharges
- Accessorial charges (detention, layover, etc.)
- Equipment rental fees
- Administrative fees
- Insurance premiums charged to Carrier
- Any other charges or fees

### Section 3.3: Commission Calculation Examples
- **Scenario A:** Monthly gross revenue of $100,000 = FleetFlow commission of $25,000
- **Scenario B:** Quarterly gross revenue of $300,000 = FleetFlow commission of $75,000
- **Scenario C:** Annual gross revenue of $1,200,000 = FleetFlow commission of $300,000

### Section 3.4: Performance Tiers and Incentives
**Standard Tier (25%):** Default commission rate for all dispatchers
**Volume Tier (20%):** Available when monthly gross revenue exceeds $500,000
**Elite Tier (15%):** Available when monthly gross revenue exceeds $1,000,000

## ARTICLE IV: PAYMENT TERMS AND PROCEDURES

### Section 4.1: Payment Schedule
- Commission payments are due within **15 days** of invoice date
- Late payments will incur interest at **2% per month (24% annually)**
- All payments must be made via:
  - Wire transfer (preferred)
  - Certified check
  - ACH transfer
  - Electronic funds transfer

### Section 4.2: Invoicing Procedures
FleetFlow will provide detailed monthly invoices including:
- Invoice number and date
- Reporting period covered
- Detailed revenue breakdown by carrier and load
- Commission calculation
- Payment due date
- Wire transfer instructions

### Section 4.3: Reporting Requirements
Dispatcher must provide comprehensive monthly reports by the **5th of each month** including:
- Detailed revenue reports with invoice numbers, dates, and amounts
- Load-by-load breakdown for the Carrier relationship
- Payment status and collection information
- Carrier performance metrics
- Any disputes or adjustments
- Future revenue projections

## ARTICLE V: AUDIT RIGHTS AND FINANCIAL OVERSIGHT

### Section 5.1: Comprehensive Audit Authority
FleetFlow reserves extensive audit rights including:
- **Unlimited Access:** Full access to Dispatcher's books, records, and financial systems
- **Real-Time Monitoring:** Integration with Dispatcher's billing and dispatch systems
- **Surprise Audits:** Unscheduled audits with 24-hour notice
- **Third-Party Auditors:** Professional accounting firms at Dispatcher's expense if discrepancies exceed 3%
- **Electronic Records:** Access to all digital communications, load confirmations, and rate sheets
- **Carrier Verification:** Direct contact with Carrier to verify revenue and services

### Section 5.2: Dispatcher Cooperation Requirements
Dispatcher must maintain complete cooperation including:
- **Immediate Access:** Provide full access to all relevant records within 24 hours
- **Digital Integration:** Allow FleetFlow API access to dispatch and billing systems
- **Document Retention:** Maintain all records for 7 years following contract termination
- **Witness Cooperation:** Make personnel available for audit interviews
- **Translation Services:** Provide English translations of any foreign language documents

### Section 5.3: Audit Frequency and Scope
- **Monthly Reviews:** Automated system audits of reported revenue
- **Quarterly Audits:** Comprehensive review of all Carrier transactions
- **Annual Audits:** Full financial audit including tax returns and bank statements
- **Triggered Audits:** Immediate audit if revenue patterns suggest underreporting

## ARTICLE VI: PENALTY PROVISIONS AND ENFORCEMENT

### Section 6.1: Late Payment Penalty Structure
**Tier 1 (1-15 days late):**
- 2% per month interest (24% annually)
- $250 administrative fee

**Tier 2 (16-30 days late):**
- 3% per month interest (36% annually)
- $1,000 penalty fee
- Suspension of new lead generation

**Tier 3 (31+ days late):**
- Immediate contract termination
- Legal action for collection
- 5% per month interest (60% annually)
- All legal fees and collection costs

### Section 6.2: Underreporting Penalty Matrix
**Minor Underreporting (1-5%):**
- 200% penalty on underreported amount
- Mandatory monthly audits for 12 months
- $2,500 administrative penalty

**Moderate Underreporting (6-15%):**
- 400% penalty on underreported amount
- Bi-weekly reporting requirement
- $10,000 administrative penalty
- 6-month probationary period

**Major Underreporting (16%+):**
- 1000% penalty on underreported amount
- Immediate contract termination
- Legal action for fraud
- Industry blacklist reporting

### Section 6.3: Concealment and Fraud Penalties
Any attempt to conceal revenue, create false documentation, or defraud FleetFlow will result in:
- **Immediate Termination:** Contract void with no cure period
- **Maximum Penalties:** 2000% penalty on all concealed revenue
- **Legal Action:** Civil and criminal fraud prosecution
- **Industry Reporting:** Notification to FMCSA, DOT, and industry associations
- **Asset Recovery:** Seizure of assets to satisfy penalties
- **Professional Consequences:** Reporting to professional licensing boards

### Section 6.4: Compliance Violation Penalties
**Administrative Violations:**
- Late reports: $1,000 per occurrence
- Missing documentation: $500 per missing document
- System access denial: $5,000 per occurrence

**Operational Violations:**
- Audit resistance: $25,000 + 200% of commissions for audit period
- Carrier interference: $50,000 + immediate termination
- Contract violations: 500% penalty on all commissions during violation period

## ARTICLE VII: TERMINATION AND POST-TERMINATION OBLIGATIONS

### Section 7.1: Immediate Termination Events
FleetFlow may terminate this agreement immediately without notice for:
- Non-payment exceeding 30 days
- Underreporting exceeding 15%
- Any fraudulent activity or concealment
- Violation of confidentiality or non-disclosure provisions
- Failure to provide required documentation after 10-day cure period
- Interference with Carrier relationships
- Criminal activity related to transportation operations
- Loss of operating authority or business license

### Section 7.2: Termination with Notice
Either party may terminate this agreement with 90 days written notice for:
- Material breach of contract terms (with 30-day cure period)
- Change in business structure or ownership
- Regulatory changes affecting operations
- Mutual agreement of parties

### Section 7.3: Post-Termination Obligations
Upon termination, Dispatcher must fulfill the following obligations:
- **Commission Payments:** Pay all outstanding commissions for 36 months
- **Reporting Requirements:** Provide detailed monthly reports for 18 months
- **Audit Cooperation:** Cooperate with audits for 60 months
- **Record Maintenance:** Maintain all records for 10 years
- **Carrier Relationship:** Transfer Carrier relationship management to FleetFlow
- **Non-Compete:** 24-month non-compete period for similar AI lead generation services

### Section 7.4: Survival Provisions
The following provisions survive termination indefinitely:
- Confidentiality and non-disclosure obligations
- Audit rights and record retention requirements
- Penalty and collection provisions
- Governing law and dispute resolution
- Indemnification obligations

## ARTICLE VIII: CONFIDENTIALITY AND NON-DISCLOSURE

### Section 8.1: Confidential Information Definition
Confidential information includes but is not limited to:
- All terms and conditions of this agreement
- Revenue data and financial information
- AI Flow platform algorithms and methodologies
- Lead generation techniques and sources
- Carrier and shipper contact information
- Pricing strategies and rate structures
- Business processes and operational procedures
- Performance metrics and analytics

### Section 8.2: Non-Disclosure Obligations
Dispatcher agrees to:
- Maintain strict confidentiality of all FleetFlow proprietary information
- Not disclose lead generation methods, pricing, or business practices to competitors
- Implement appropriate security measures to protect confidential data
- Limit access to confidential information to essential personnel only
- Execute separate NDAs for all personnel with access to confidential information

### Section 8.3: Permitted Disclosures
Confidential information may be disclosed only:
- As required by law or court order (with advance notice to FleetFlow)
- To professional advisors bound by confidentiality obligations
- With prior written consent from FleetFlow
- To the extent information becomes publicly available through no breach of this agreement

## ARTICLE IX: INDEMNIFICATION AND LIABILITY

### Section 9.1: Dispatcher Indemnification
Dispatcher agrees to indemnify and hold harmless FleetFlow from:
- All claims arising from Dispatcher's operations with Carrier
- DOT, FMCSA, or other regulatory violations
- Cargo damage, loss, or delay claims
- Driver-related accidents or incidents
- Insurance coverage gaps or lapses
- Third-party claims related to Dispatcher's services

### Section 9.2: FleetFlow Indemnification
FleetFlow agrees to indemnify Dispatcher from claims arising from:
- Defects in AI Flow platform technology
- Errors in lead generation or qualification
- Breach of FleetFlow's confidentiality obligations
- Misrepresentation of Carrier information

### Section 9.3: Limitation of Liability
Neither party shall be liable for consequential, indirect, or punitive damages, except in cases of fraud, willful misconduct, or breach of confidentiality obligations.

## ARTICLE X: GOVERNING LAW AND DISPUTE RESOLUTION

### Section 10.1: Governing Law
This agreement is governed by the laws of the State of Georgia, without regard to conflict of law principles.

### Section 10.2: Dispute Resolution Process
**Step 1:** Direct negotiation between parties (30 days)
**Step 2:** Mediation through American Arbitration Association (60 days)
**Step 3:** Binding arbitration in Atlanta, Georgia
**Step 4:** Final resort to courts of Fulton County, Georgia

### Section 10.3: Legal Fees and Costs
The prevailing party in any legal proceeding shall be entitled to recovery of reasonable attorney's fees, court costs, and expenses.

## ARTICLE XI: MISCELLANEOUS PROVISIONS

### Section 11.1: Entire Agreement
This document constitutes the entire agreement between the parties and supersedes all prior agreements, understandings, or representations.

### Section 11.2: Amendment and Modification
This agreement may only be amended by written agreement signed by all parties.

### Section 11.3: Severability
If any provision is deemed invalid or unenforceable, the remainder of the agreement shall remain in full force and effect.

### Section 11.4: Force Majeure
Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.

## ARTICLE XII: SIGNATURES AND EXECUTION

**FleetFlow Technologies, Inc.**

By: _________________________________
Name: [Name]
Title: Chief Revenue Officer
Date: _______________________________

**${contract.parties.dispatcher!.company}**

By: _________________________________
Name: ${contract.parties.dispatcher!.name}
Title: Operations Manager
Date: _______________________________

**${contract.parties.carrier!.company}** (Acknowledgment)

By: _________________________________
Name: ${contract.parties.carrier!.name}
Title: Fleet Manager
Date: _______________________________

---

## IMPORTANT LEGAL NOTICES

**BINDING AGREEMENT:** This contract contains legally binding obligations with significant financial consequences. All parties should review carefully and consult with legal counsel before signing.

**AI LEAD GENERATION NOTICE:** This agreement specifically governs revenue generated from carriers introduced through FleetFlow's proprietary AI Flow lead generation system. Unauthorized contact or solicitation of these carriers outside this agreement will result in substantial penalties and legal action.

**REGULATORY COMPLIANCE:** All parties must maintain appropriate operating authority, insurance coverage, and regulatory compliance throughout the term of this agreement.

**CONTRACT NUMBER:** ${contract.contractNumber}
**EFFECTIVE DATE:** ${new Date(contract.metadata.effectiveDate).toLocaleDateString()}
**FLEETFLOW AI FLOW PLATFORM VERSION:** 2025.1
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

  /**
   * Track recurring revenue from AI-generated customers (50% ongoing commission)
   */
  async trackRecurringRevenue(
    contractId: string,
    revenue: number,
    customerId: string,
    customerName: string,
    transactionId: string,
    isRecurringPayment: boolean = true
  ): Promise<void> {
    try {
      // Get current contract
      const { data: contract, error } = await this.supabase
        .from('contracts')
        .select('*')
        .eq('contract_id', contractId)
        .single();

      if (error) throw error;

      // Validate this is a recurring revenue contract
      if (contract.terms.commissionType !== 'recurring_revenue_share') {
        throw new Error(
          'Contract is not configured for recurring revenue sharing'
        );
      }

      const commission = revenue * (contract.terms.commissionRate / 100);
      const paymentDate = new Date().toISOString();

      // Update revenue tracking with recurring revenue metadata
      const updatedTracking = {
        ...contract.revenue_tracking,
        totalRevenue: contract.revenue_tracking.totalRevenue + revenue,
        commissionEarned:
          contract.revenue_tracking.commissionEarned + commission,
        recurringRevenue:
          (contract.revenue_tracking.recurringRevenue || 0) +
          (isRecurringPayment ? revenue : 0),
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
            customerId,
            customerName,
            isRecurring: isRecurringPayment,
            revenueAmount: revenue,
            commissionRate: contract.terms.commissionRate,
          },
        ],
        // Track AI-generated customers for ongoing revenue monitoring
        aiGeneratedCustomers: [
          ...(contract.revenue_tracking.aiGeneratedCustomers || []).filter(
            (c: any) => c.customerId !== customerId
          ),
          {
            customerId,
            customerName,
            firstPaymentDate:
              contract.revenue_tracking.aiGeneratedCustomers?.find(
                (c: any) => c.customerId === customerId
              )?.firstPaymentDate || paymentDate,
            lastPaymentDate: paymentDate,
            totalRevenue:
              (contract.revenue_tracking.aiGeneratedCustomers?.find(
                (c: any) => c.customerId === customerId
              )?.totalRevenue || 0) + revenue,
            totalCommission:
              (contract.revenue_tracking.aiGeneratedCustomers?.find(
                (c: any) => c.customerId === customerId
              )?.totalCommission || 0) + commission,
            paymentCount:
              (contract.revenue_tracking.aiGeneratedCustomers?.find(
                (c: any) => c.customerId === customerId
              )?.paymentCount || 0) + 1,
            isActive: true,
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
        `✅ Recurring revenue tracked: Customer ${customerName} - $${revenue} -> 50% Commission: $${commission} (Recurring: ${isRecurringPayment})`
      );

      // Log recurring revenue alert for high-value customers
      if (revenue > 10000) {
        console.log(
          `🚨 HIGH-VALUE RECURRING CUSTOMER: ${customerName} - $${revenue} revenue = $${commission} commission`
        );
      }
    } catch (error: any) {
      console.error('Failed to track recurring revenue:', error);
      throw error;
    }
  }

  /**
   * Get recurring revenue report for a broker contract
   */
  async getRecurringRevenueReport(contractId: string): Promise<{
    totalRecurringRevenue: number;
    totalRecurringCommission: number;
    activeCustomers: number;
    monthlyRecurringRevenue: number;
    aiGeneratedCustomers: any[];
  }> {
    try {
      const { data: contract, error } = await this.supabase
        .from('contracts')
        .select('*')
        .eq('contract_id', contractId)
        .single();

      if (error) throw error;

      const tracking = contract.revenue_tracking;
      const aiCustomers = tracking.aiGeneratedCustomers || [];
      const activeCustomers = aiCustomers.filter((c: any) => c.isActive);

      // Calculate monthly recurring revenue (approximate based on recent activity)
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      const recentPayments =
        tracking.paymentHistory?.filter(
          (p: any) => p.date > thirtyDaysAgo && p.isRecurring
        ) || [];

      const monthlyRecurringRevenue = recentPayments.reduce(
        (sum: number, payment: any) => sum + (payment.revenueAmount || 0),
        0
      );

      return {
        totalRecurringRevenue: tracking.recurringRevenue || 0,
        totalRecurringCommission: activeCustomers.reduce(
          (sum: number, customer: any) => sum + customer.totalCommission,
          0
        ),
        activeCustomers: activeCustomers.length,
        monthlyRecurringRevenue,
        aiGeneratedCustomers: activeCustomers,
      };
    } catch (error: any) {
      console.error('Failed to get recurring revenue report:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const contractGenerationService =
  ContractGenerationService.getInstance();
