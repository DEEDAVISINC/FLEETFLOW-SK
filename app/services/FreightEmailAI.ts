/**
 * FleetFlow Freight Email AI
 * Automated email response system for freight inquiries
 * Better than Salesape.ai - freight-specific with voice integration
 */

import { ElevenLabsVoiceService } from '../../lib/claude-ai-service';
import { FreightNetworkService } from './FreightNetworkService';
import { FleetFlowAI } from './ai';
import { FMCSAService } from './fmcsa';
import {
  UniversalQuote,
  universalQuoteService,
} from './universal-quote-service';
// ✅ ADD: Platform AI integration for enhanced email processing
import { platformAIManager, processAITask } from './PlatformAIManager';

export interface EmailContext {
  emailId: string;
  from: string;
  to: string;
  subject: string;
  originalMessage: string;
  timestamp: string;
  leadType:
    | 'carrier_inquiry'
    | 'shipper_request'
    | 'rate_quote'
    | 'load_inquiry'
    | 'load_confirmation'
    | 'load_status'
    | 'document_request'
    | 'capacity_inquiry'
    | 'carrier_onboarding'
    | 'compliance_notification'
    | 'delivery_confirmation'
    | 'exception_management'
    | 'rfx_response'
    | 'financial_inquiry'
    | 'general';
  priority: 'high' | 'medium' | 'low';
  requiresVoiceFollowup: boolean;
  tenantId: string; // Multi-tenant support
  carrierInfo?: {
    mcNumber?: string;
    dotNumber?: string;
    companyName?: string;
    verified?: boolean;
  };
}

export interface TenantEmailConfig {
  tenantId: string;
  companyName: string;
  fromEmail: string;
  replyToEmail: string;
  phoneNumber: string;
  brandingColors: {
    primary: string;
    secondary: string;
  };
  customTemplates?: Record<string, string>;
  autoResponseEnabled: boolean;
  voiceFollowupEnabled: boolean;
  fmcsaVerificationEnabled: boolean;
  emailSignature: string;
}

export interface EmailResponse {
  subject: string;
  message: string;
  nextAction:
    | 'send_email'
    | 'schedule_call'
    | 'escalate_human'
    | 'auto_quote'
    | 'generate_document'
    | 'update_load_status'
    | 'create_load'
    | 'assign_carrier'
    | 'process_payment'
    | 'schedule_pickup'
    | 'send_tracking'
    | 'file_claim';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  followUpIn?: string; // "2 hours", "1 day", etc.
  voiceCallRecommended: boolean;
  confidence: number;
  quoteData?: {
    baseRate: number;
    allInRate: number;
    miles: number;
    ratePerMile: number;
    fuelSurcharge: number;
    marketPosition: string;
    breakdown: {
      lineHaul: number;
      fuelSurcharge: number;
      accessorials: number;
    };
    quoteNumber: string;
    quoteId: string;
  };
}

export class FreightEmailAI {
  private ai: FleetFlowAI;
  private fmcsaService: FMCSAService;
  private voiceService: ElevenLabsVoiceService;
  private tenantConfigs: Map<string, TenantEmailConfig> = new Map();
  private freightNetworkService: FreightNetworkService;

  constructor() {
    this.ai = new FleetFlowAI();
    this.fmcsaService = new FMCSAService();
    this.voiceService = new ElevenLabsVoiceService();
    this.freightNetworkService = new FreightNetworkService();
    this.initializeTenantConfigs();

    // ✅ Register with Platform AI Manager
    platformAIManager.registerService('FreightEmailAI', this);
    console.info('📧 FreightEmailAI registered with Platform AI Manager');
  }

  /**
   * Initialize default tenant configurations
   */
  private initializeTenantConfigs() {
    // Default FleetFlow configuration
    this.tenantConfigs.set('fleetflow-default', {
      tenantId: 'fleetflow-default',
      companyName: 'FleetFlow',
      fromEmail: 'loads@fleetflowapp.com',
      replyToEmail: 'loads@fleetflowapp.com',
      phoneNumber: '+1-833-386-3509',
      brandingColors: {
        primary: '#14b8a6',
        secondary: '#3b82f6',
      },
      autoResponseEnabled: true,
      voiceFollowupEnabled: true,
      fmcsaVerificationEnabled: true,
      emailSignature: `
Best regards,
FleetFlow AI Assistant
📞 Direct: +1-833-386-3509
📧 loads@fleetflowapp.com

P.S. Our AI system can book loads 24/7 - even after hours!
      `,
    });

    // Sample tenant configuration
    this.tenantConfigs.set('tenant-demo-123', {
      tenantId: 'tenant-demo-123',
      companyName: 'Demo Freight Solutions',
      fromEmail: 'dispatch@demofreight.com',
      replyToEmail: 'dispatch@demofreight.com',
      phoneNumber: '+1-555-FREIGHT',
      brandingColors: {
        primary: '#f97316',
        secondary: '#dc2626',
      },
      autoResponseEnabled: true,
      voiceFollowupEnabled: true,
      fmcsaVerificationEnabled: true,
      emailSignature: `
Best regards,
Demo Freight Solutions
📞 Direct: +1-555-FREIGHT
📧 dispatch@demofreight.com

Your trusted freight partner since 2023!
      `,
    });
  }

  /**
   * Get tenant configuration
   */
  getTenantConfig(tenantId: string): TenantEmailConfig {
    return (
      this.tenantConfigs.get(tenantId) ||
      this.tenantConfigs.get('fleetflow-default')!
    );
  }

  /**
   * Update tenant email configuration
   */
  updateTenantConfig(config: TenantEmailConfig): void {
    this.tenantConfigs.set(config.tenantId, config);
  }

  /**
   * ✅ Enhanced email processing with Platform AI integration
   */
  async processFreightEmailEnhanced(
    emailContext: EmailContext
  ): Promise<EmailResponse> {
    console.info('📧 Processing freight email with Platform AI enhancements');

    try {
      // Use Platform AI for initial email analysis
      const emailAnalysisContent = `
        Freight Email Analysis:
        From: ${emailContext.from}
        Subject: ${emailContext.subject}
        Message: ${emailContext.originalMessage}
        Lead Type: ${emailContext.leadType}
        Priority: ${emailContext.priority}
        Tenant: ${emailContext.tenantId}
      `;

      const aiAnalysis = await processAITask(
        'email_analysis',
        emailAnalysisContent,
        {
          serviceType: 'customer_facing',
          industry: 'transportation',
          urgency: emailContext.priority,
          tenantId: emailContext.tenantId,
          customerTier: this.inferCustomerTier(emailContext),
        }
      );

      console.info(
        `✅ Email analyzed: Quality=${aiAnalysis.quality}, Human-like=${aiAnalysis.humanLike}, Cost=$${aiAnalysis.cost}`
      );

      // If Platform AI escalated, fall back to original processing
      if (aiAnalysis.escalated) {
        console.info(
          '🔄 Complex email escalated - using comprehensive processing'
        );
        return await this.processFreightEmail(emailContext);
      }

      // Use AI analysis result to enhance response
      const enhancedResponse = await this.generateEnhancedResponse(
        emailContext,
        aiAnalysis
      );

      return enhancedResponse;
    } catch (error) {
      console.error('❌ Platform AI email processing failed:', error);
      console.info('🔄 Falling back to original email processing');
      return await this.processFreightEmail(emailContext);
    }
  }

  /**
   * Process incoming freight email and generate AI response (Original method)
   */
  async processFreightEmail(
    emailContext: EmailContext
  ): Promise<EmailResponse> {
    // Analyze email content and classify
    const classification = await this.classifyFreightEmail(emailContext);

    // Extract carrier information if present
    const carrierInfo = await this.extractCarrierInfo(
      emailContext.originalMessage
    );

    // Verify carrier with FMCSA if MC/DOT provided
    if (carrierInfo.mcNumber || carrierInfo.dotNumber) {
      carrierInfo.verified = await this.verifyCarrier(carrierInfo);
    }

    // Generate appropriate response based on email type
    switch (classification.type) {
      case 'load_confirmation':
        return this.handleLoadConfirmation(emailContext, carrierInfo);
      case 'load_status':
        return this.handleLoadStatus(emailContext, carrierInfo);
      case 'document_request':
        return this.handleDocumentRequest(emailContext, carrierInfo);
      case 'capacity_inquiry':
        return this.handleCapacityInquiry(emailContext, carrierInfo);
      case 'carrier_onboarding':
        return this.handleCarrierOnboarding(emailContext, carrierInfo);
      case 'delivery_confirmation':
        return this.handleDeliveryConfirmation(emailContext, carrierInfo);
      case 'exception_management':
        return this.handleExceptionManagement(emailContext, carrierInfo);
      case 'rfx_response':
        return this.handleRFxResponse(emailContext, carrierInfo);
      case 'financial_inquiry':
        return this.handleFinancialInquiry(emailContext, carrierInfo);
      case 'compliance_notification':
        return this.handleComplianceNotification(emailContext, carrierInfo);
      case 'carrier_inquiry':
        return this.handleCarrierInquiry(emailContext, carrierInfo);
      case 'shipper_request':
        return this.handleShipperRequest(emailContext);
      case 'rate_quote':
        return this.handleRateQuote(emailContext, carrierInfo);
      case 'load_inquiry':
        return this.handleLoadInquiry(emailContext, carrierInfo);
      default:
        return this.handleGeneralInquiry(emailContext);
    }
  }

  // ========================================
  // COMPREHENSIVE EMAIL HANDLERS
  // ========================================

  /**
   * Handle load confirmations and bookings
   */
  private async handleLoadConfirmation(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract load details from email
    const loadInfo = await this.extractLoadInfo(emailContext.originalMessage);

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant processing a load confirmation.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    CARRIER INFO:
    ${carrierInfo.verified ? 'FMCSA Status: VERIFIED ✅' : 'FMCSA Status: Needs verification'}
    ${carrierInfo.mcNumber ? `MC: ${carrierInfo.mcNumber}` : ''}
    ${carrierInfo.dotNumber ? `DOT: ${carrierInfo.dotNumber}` : ''}

    RESPONSE GUIDELINES:
    1. Confirm load acceptance professionally
    2. Provide load confirmation number
    3. Include pickup/delivery details
    4. Mention rate confirmation will follow
    5. Request insurance certificates if needed
    6. Provide dispatch contact information
    7. Set expectations for next steps

    Generate a professional load confirmation response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Load Confirmation - ${loadInfo.loadNumber || 'PENDING'} - ${tenantConfig.companyName}`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'generate_document',
      priority: 'urgent',
      followUpIn: '30 minutes',
      voiceCallRecommended: true,
      confidence: 0.95,
    };
  }

  /**
   * Handle load status updates and tracking
   */
  private async handleLoadStatus(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract load and status info
    const loadInfo = await this.extractLoadInfo(emailContext.originalMessage);
    const statusInfo = await this.extractStatusInfo(
      emailContext.originalMessage
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant processing a load status update.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    RESPONSE GUIDELINES:
    1. Acknowledge status update receipt
    2. Update customer if needed
    3. Provide next milestone expectations
    4. Request ETA if in transit
    5. Offer assistance for any issues
    6. Professional freight operations tone

    Generate a professional status acknowledgment response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${emailContext.subject} - Status Updated`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'update_load_status',
      priority: 'high',
      followUpIn: '2 hours',
      voiceCallRecommended: false,
      confidence: 0.9,
    };
  }

  /**
   * Handle document requests (BOL, POD, Invoice, etc.)
   */
  private async handleDocumentRequest(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract document type and load info
    const docInfo = await this.extractDocumentInfo(
      emailContext.originalMessage
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant processing a document request.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    DOCUMENT REQUEST: ${docInfo.documentType || 'Multiple documents'}
    LOAD REFERENCE: ${docInfo.loadReference || 'TBD'}

    RESPONSE GUIDELINES:
    1. Acknowledge document request
    2. Confirm load/shipment details
    3. Provide timeline for document delivery
    4. Request any missing information
    5. Offer alternative delivery methods
    6. Professional document management tone

    Generate a professional document request response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Document Request - ${docInfo.documentType || 'Processing'} - ${docInfo.loadReference || 'TBD'}`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'generate_document',
      priority: 'high',
      followUpIn: '1 hour',
      voiceCallRecommended: false,
      confidence: 0.88,
    };
  }

  /**
   * Handle capacity inquiries and truck availability
   */
  private async handleCapacityInquiry(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract capacity requirements
    const capacityInfo = await this.extractCapacityInfo(
      emailContext.originalMessage
    );

    // Check available capacity in network
    const availableCapacity = await this.freightNetworkService.searchCapacity({
      origin: capacityInfo.origin,
      equipment: capacityInfo.equipment,
      date: capacityInfo.date,
    });

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant responding to a capacity inquiry.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    CAPACITY REQUIREMENTS:
    Equipment: ${capacityInfo.equipment || 'Any'}
    Origin: ${capacityInfo.origin || 'Flexible'}
    Date: ${capacityInfo.date || 'ASAP'}

    AVAILABLE CAPACITY: ${availableCapacity.length} trucks found

    RESPONSE GUIDELINES:
    1. Acknowledge capacity request
    2. Provide available equipment options
    3. Include estimated rates if possible
    4. Offer immediate scheduling
    5. Mention network partnerships
    6. Create urgency for booking

    Generate a professional capacity response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Capacity Available - ${capacityInfo.equipment || 'Equipment'} - ${tenantConfig.companyName}`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'assign_carrier',
      priority: 'urgent',
      followUpIn: '15 minutes',
      voiceCallRecommended: true,
      confidence: 0.92,
    };
  }

  /**
   * Handle carrier onboarding and setup
   */
  private async handleCarrierOnboarding(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant handling carrier onboarding.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    CARRIER INFO:
    ${carrierInfo.verified ? 'FMCSA Status: VERIFIED ✅' : 'FMCSA Status: Needs verification'}
    ${carrierInfo.mcNumber ? `MC: ${carrierInfo.mcNumber}` : 'MC Number: Required'}

    RESPONSE GUIDELINES:
    1. Welcome new carrier professionally
    2. Outline onboarding process steps
    3. Request required documents (insurance, W9, carrier agreement)
    4. Provide portal access information
    5. Set expectations for approval timeline
    6. Offer onboarding assistance

    Generate a professional carrier onboarding response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Welcome to ${tenantConfig.companyName} - Carrier Onboarding`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'generate_document',
      priority: 'high',
      followUpIn: '4 hours',
      voiceCallRecommended: true,
      confidence: 0.9,
    };
  }

  /**
   * Handle delivery confirmations and POD
   */
  private async handleDeliveryConfirmation(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract delivery details
    const deliveryInfo = await this.extractDeliveryInfo(
      emailContext.originalMessage
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant processing a delivery confirmation.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    DELIVERY INFO:
    Load: ${deliveryInfo.loadNumber || 'TBD'}
    Delivery Time: ${deliveryInfo.deliveryTime || 'TBD'}
    POD Status: ${deliveryInfo.podReceived ? 'Received' : 'Pending'}

    RESPONSE GUIDELINES:
    1. Acknowledge delivery completion
    2. Confirm POD receipt
    3. Thank carrier for service
    4. Mention invoice processing timeline
    5. Rate the delivery performance
    6. Offer future load opportunities

    Generate a professional delivery acknowledgment.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Delivery Confirmed - ${deliveryInfo.loadNumber || 'Load'} - Thank You!`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'process_payment',
      priority: 'normal',
      followUpIn: '24 hours',
      voiceCallRecommended: false,
      confidence: 0.85,
    };
  }

  /**
   * Handle exceptions, delays, and issues
   */
  private async handleExceptionManagement(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract exception details
    const exceptionInfo = await this.extractExceptionInfo(
      emailContext.originalMessage
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant handling a freight exception.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    EXCEPTION TYPE: ${exceptionInfo.type || 'General Issue'}
    SEVERITY: ${exceptionInfo.severity || 'Medium'}
    LOAD AFFECTED: ${exceptionInfo.loadNumber || 'TBD'}

    RESPONSE GUIDELINES:
    1. Acknowledge issue immediately
    2. Express concern and urgency
    3. Request detailed information
    4. Offer immediate assistance
    5. Provide escalation contacts
    6. Set follow-up timeline
    7. Professional crisis management tone

    Generate an urgent exception management response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `URGENT: ${exceptionInfo.type || 'Issue'} - ${exceptionInfo.loadNumber || 'Load'} - Immediate Action`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'escalate_human',
      priority: 'urgent',
      followUpIn: '15 minutes',
      voiceCallRecommended: true,
      confidence: 0.95,
    };
  }

  /**
   * Handle RFx responses and bidding
   */
  private async handleRFxResponse(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract RFx details
    const rfxInfo = await this.extractRFxInfo(emailContext.originalMessage);

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant handling an RFx opportunity.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    RFX TYPE: ${rfxInfo.type || 'RFQ'}
    OPPORTUNITY: ${rfxInfo.title || 'Freight Services'}
    DEADLINE: ${rfxInfo.deadline || 'TBD'}

    RESPONSE GUIDELINES:
    1. Express interest in opportunity
    2. Confirm capability to handle requirements
    3. Request additional details if needed
    4. Mention competitive advantages
    5. Provide preliminary timeline
    6. Professional business development tone

    Generate a professional RFx response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${rfxInfo.type || 'RFx'} - ${tenantConfig.companyName} Response`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'generate_document',
      priority: 'high',
      followUpIn: '2 hours',
      voiceCallRecommended: true,
      confidence: 0.88,
    };
  }

  /**
   * Handle financial inquiries and billing
   */
  private async handleFinancialInquiry(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract financial details
    const financialInfo = await this.extractFinancialInfo(
      emailContext.originalMessage
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant handling a financial inquiry.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    FINANCIAL TYPE: ${financialInfo.type || 'General Billing'}
    AMOUNT: ${financialInfo.amount || 'TBD'}
    REFERENCE: ${financialInfo.reference || 'TBD'}

    RESPONSE GUIDELINES:
    1. Acknowledge financial inquiry professionally
    2. Provide payment status if applicable
    3. Explain billing process clearly
    4. Offer payment assistance
    5. Include accounting contact information
    6. Professional financial services tone

    Generate a professional financial inquiry response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${financialInfo.type || 'Financial Inquiry'} - ${tenantConfig.companyName}`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'process_payment',
      priority: 'high',
      followUpIn: '4 hours',
      voiceCallRecommended: false,
      confidence: 0.85,
    };
  }

  /**
   * Handle compliance notifications and regulatory matters
   */
  private async handleComplianceNotification(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract compliance details
    const complianceInfo = await this.extractComplianceInfo(
      emailContext.originalMessage
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI assistant handling a compliance notification.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    COMPLIANCE TYPE: ${complianceInfo.type || 'General Compliance'}
    URGENCY: ${complianceInfo.urgent ? 'URGENT' : 'Standard'}
    CARRIER: ${carrierInfo.companyName || 'TBD'}

    RESPONSE GUIDELINES:
    1. Acknowledge compliance matter seriously
    2. Provide guidance on requirements
    3. Set clear deadlines
    4. Offer compliance assistance
    5. Mention consequences of non-compliance
    6. Professional regulatory tone

    Generate a professional compliance response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `COMPLIANCE: ${complianceInfo.type || 'Regulatory Matter'} - Action Required`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'escalate_human',
      priority: complianceInfo.urgent ? 'urgent' : 'high',
      followUpIn: complianceInfo.urgent ? '1 hour' : '24 hours',
      voiceCallRecommended: complianceInfo.urgent,
      confidence: 0.9,
    };
  }

  /**
   * Handle carrier capacity inquiries
   */
  private async handleCarrierInquiry(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    const prompt = `
    You are ${tenantConfig.companyName}'s AI email assistant responding to a carrier inquiry.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    COMPANY INFO:
    Company: ${tenantConfig.companyName}
    Phone: ${tenantConfig.phoneNumber}
    Email: ${tenantConfig.fromEmail}

    CARRIER INFO:
    ${carrierInfo.mcNumber ? `MC Number: ${carrierInfo.mcNumber}` : ''}
    ${carrierInfo.dotNumber ? `DOT Number: ${carrierInfo.dotNumber}` : ''}
    ${carrierInfo.companyName ? `Company: ${carrierInfo.companyName}` : ''}
    ${carrierInfo.verified && tenantConfig.fmcsaVerificationEnabled ? 'FMCSA Status: VERIFIED ✅' : 'FMCSA Status: Needs verification'}

    RESPONSE GUIDELINES:
    1. Professional, friendly freight broker tone representing ${tenantConfig.companyName}
    2. Reference their MC/DOT if provided
    3. Mention specific loads available
    4. Include competitive rates
    5. Suggest phone call to ${tenantConfig.phoneNumber} for immediate booking
    6. Keep concise but informative
    7. Use company branding and signature

    Generate a professional email response that converts this inquiry into a load booking.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${emailContext.subject} - Loads Available Now!`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'schedule_call',
      priority: 'high',
      followUpIn: '2 hours',
      voiceCallRecommended: tenantConfig.voiceFollowupEnabled,
      confidence: 0.85,
    };
  }

  /**
   * Handle shipper freight requests
   */
  private async handleShipperRequest(
    emailContext: EmailContext
  ): Promise<EmailResponse> {
    const prompt = `
    You are FleetFlow's AI email assistant responding to a shipper's freight request.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    RESPONSE GUIDELINES:
    1. Professional freight brokerage tone
    2. Acknowledge their shipping needs
    3. Mention FleetFlow's carrier network
    4. Offer competitive rates and service
    5. Request specific details (pickup/delivery, commodity, weight)
    6. Suggest phone call for immediate quote

    Generate a professional response that positions FleetFlow as their freight solution.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${emailContext.subject} - FleetFlow Freight Solutions`,
      message: response,
      nextAction: 'auto_quote',
      priority: 'high',
      followUpIn: '1 hour',
      voiceCallRecommended: true,
      confidence: 0.9,
    };
  }

  /**
   * Handle rate quote requests with automatic quote generation
   */
  private async handleRateQuote(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Extract route information from email
    const routeInfo = await this.extractRouteInfo(emailContext.originalMessage);

    // Generate competitive quote using AI
    const quoteData = await this.generateAutomaticQuote(
      routeInfo,
      carrierInfo,
      tenantConfig
    );

    const prompt = `
    You are ${tenantConfig.companyName}'s AI email assistant responding to a rate quote request.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    EXTRACTED ROUTE INFO:
    ${routeInfo.origin ? `Origin: ${routeInfo.origin}` : ''}
    ${routeInfo.destination ? `Destination: ${routeInfo.destination}` : ''}
    ${routeInfo.weight ? `Weight: ${routeInfo.weight}` : ''}
    ${routeInfo.equipment ? `Equipment: ${routeInfo.equipment}` : ''}
    ${routeInfo.commodity ? `Commodity: ${routeInfo.commodity}` : ''}

    GENERATED QUOTE:
    Base Rate: $${quoteData.baseRate}
    All-In Rate: $${quoteData.allInRate}
    Miles: ${quoteData.miles}
    Rate Per Mile: $${quoteData.ratePerMile}
    Fuel Surcharge: $${quoteData.fuelSurcharge}
    Market Position: ${quoteData.marketPosition}

    CARRIER INFO:
    ${carrierInfo.verified && tenantConfig.fmcsaVerificationEnabled ? 'FMCSA Status: VERIFIED ✅' : 'FMCSA Status: Needs verification'}

    RESPONSE GUIDELINES:
    1. Acknowledge their quote request professionally
    2. Present the competitive quote with breakdown
    3. Mention fuel surcharge and any additional fees
    4. Highlight ${tenantConfig.companyName}'s competitive advantages
    5. Create urgency (market rates changing, other carriers bidding)
    6. Strong call-to-action for immediate booking
    7. Use ${tenantConfig.companyName} branding

    Generate a professional quote response with specific pricing and immediate booking urgency.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${emailContext.subject} - Competitive Quote: $${quoteData.allInRate} All-In`,
      message: `${response}\n\n${tenantConfig.emailSignature}`,
      nextAction: 'auto_quote',
      priority: 'urgent',
      followUpIn: '15 minutes',
      voiceCallRecommended: true,
      confidence: 0.95,
      quoteData: quoteData,
    };
  }

  /**
   * Handle load availability inquiries
   */
  private async handleLoadInquiry(
    emailContext: EmailContext,
    carrierInfo: any
  ): Promise<EmailResponse> {
    const prompt = `
    You are FleetFlow's AI email assistant responding to a load inquiry.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    RESPONSE GUIDELINES:
    1. Confirm load availability
    2. Provide specific load details (origin, destination, commodity)
    3. Include competitive rate
    4. Mention equipment requirements
    5. Create urgency (other carriers interested)
    6. Strong call-to-action for immediate booking

    Generate a response with specific load information and booking urgency.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${emailContext.subject} - Load Available - Book Now!`,
      message: response,
      nextAction: 'schedule_call',
      priority: 'urgent',
      followUpIn: '15 minutes',
      voiceCallRecommended: true,
      confidence: 0.88,
    };
  }

  /**
   * Handle general inquiries
   */
  private async handleGeneralInquiry(
    emailContext: EmailContext
  ): Promise<EmailResponse> {
    const prompt = `
    You are FleetFlow's AI email assistant responding to a general freight inquiry.

    EMAIL RECEIVED:
    From: ${emailContext.from}
    Subject: ${emailContext.subject}
    Message: ${emailContext.originalMessage}

    RESPONSE GUIDELINES:
    1. Professional freight industry tone
    2. Introduce FleetFlow's services
    3. Mention AI-powered efficiency
    4. Offer to discuss their specific needs
    5. Suggest phone call for personalized service
    6. Include contact information

    Generate a professional introduction and service overview response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      subject: `Re: ${emailContext.subject} - FleetFlow Freight Services`,
      message: response,
      nextAction: 'schedule_call',
      priority: 'normal',
      followUpIn: '4 hours',
      voiceCallRecommended: false,
      confidence: 0.75,
    };
  }

  /**
   * Classify incoming freight email with comprehensive detection
   */
  private async classifyFreightEmail(emailContext: EmailContext): Promise<{
    type: EmailContext['leadType'];
    confidence: number;
  }> {
    const subject = emailContext.subject.toLowerCase();
    const message = emailContext.originalMessage.toLowerCase();
    const combined = `${subject} ${message}`;

    // Load Confirmation keywords (highest priority)
    if (
      combined.includes('confirm load') ||
      combined.includes('book load') ||
      combined.includes('accept load') ||
      combined.includes('load confirmation') ||
      combined.includes('rate confirmation')
    ) {
      return { type: 'load_confirmation', confidence: 0.95 };
    }

    // Load Status Updates
    if (
      combined.includes('load status') ||
      combined.includes('in transit') ||
      combined.includes('delivered') ||
      combined.includes('pickup complete') ||
      combined.includes('eta update') ||
      combined.includes('delay notification')
    ) {
      return { type: 'load_status', confidence: 0.93 };
    }

    // Document Requests
    if (
      combined.includes('bol') ||
      combined.includes('bill of lading') ||
      combined.includes('pod') ||
      combined.includes('proof of delivery') ||
      combined.includes('invoice') ||
      combined.includes('rate confirmation') ||
      combined.includes('need documents')
    ) {
      return { type: 'document_request', confidence: 0.92 };
    }

    // Capacity Inquiries
    if (
      combined.includes('need trucks') ||
      combined.includes('available capacity') ||
      combined.includes('truck availability') ||
      combined.includes('equipment needed') ||
      combined.includes('urgent capacity')
    ) {
      return { type: 'capacity_inquiry', confidence: 0.9 };
    }

    // Carrier Onboarding
    if (
      combined.includes('carrier setup') ||
      combined.includes('new carrier') ||
      combined.includes('carrier application') ||
      combined.includes('insurance certificate') ||
      combined.includes('carrier agreement')
    ) {
      return { type: 'carrier_onboarding', confidence: 0.9 };
    }

    // Delivery Confirmations
    if (
      combined.includes('delivered') ||
      combined.includes('delivery complete') ||
      combined.includes('shipment received') ||
      combined.includes('pod attached') ||
      combined.includes('delivery confirmation')
    ) {
      return { type: 'delivery_confirmation', confidence: 0.88 };
    }

    // Exception Management
    if (
      combined.includes('delay') ||
      combined.includes('problem') ||
      combined.includes('issue') ||
      combined.includes('claim') ||
      combined.includes('damage') ||
      combined.includes('accident') ||
      combined.includes('breakdown')
    ) {
      return { type: 'exception_management', confidence: 0.87 };
    }

    // RFx Responses
    if (
      combined.includes('rfp') ||
      combined.includes('rfq') ||
      combined.includes('rfb') ||
      combined.includes('bid') ||
      combined.includes('proposal') ||
      combined.includes('tender')
    ) {
      return { type: 'rfx_response', confidence: 0.85 };
    }

    // Financial Inquiries
    if (
      combined.includes('payment') ||
      combined.includes('invoice') ||
      combined.includes('factoring') ||
      combined.includes('billing') ||
      combined.includes('detention') ||
      combined.includes('accessorial')
    ) {
      return { type: 'financial_inquiry', confidence: 0.83 };
    }

    // Compliance Notifications
    if (
      combined.includes('insurance expiring') ||
      combined.includes('dot audit') ||
      combined.includes('compliance') ||
      combined.includes('safety rating') ||
      combined.includes('permit')
    ) {
      return { type: 'compliance_notification', confidence: 0.8 };
    }

    // Carrier inquiry keywords
    if (
      combined.includes('capacity') ||
      combined.includes('looking for loads') ||
      combined.includes('available truck') ||
      combined.includes('mc number')
    ) {
      return { type: 'carrier_inquiry', confidence: 0.8 };
    }

    // Shipper request keywords
    if (
      combined.includes('need shipping') ||
      combined.includes('freight quote') ||
      combined.includes('shipment')
    ) {
      return { type: 'shipper_request', confidence: 0.75 };
    }

    // Rate quote keywords
    if (
      combined.includes('rate') ||
      combined.includes('price') ||
      combined.includes('quote') ||
      combined.includes('cost')
    ) {
      return { type: 'rate_quote', confidence: 0.7 };
    }

    // Load inquiry keywords
    if (
      combined.includes('load') ||
      combined.includes('haul') ||
      combined.includes('pickup') ||
      combined.includes('delivery')
    ) {
      return { type: 'load_inquiry', confidence: 0.65 };
    }

    return { type: 'general', confidence: 0.6 };
  }

  /**
   * Extract carrier information from email
   */
  private async extractCarrierInfo(message: string): Promise<any> {
    // Extract MC number
    const mcMatch = message.match(/MC[:\-\s]*(\d{4,7})/i);
    const mcNumber = mcMatch ? mcMatch[1] : null;

    // Extract DOT number
    const dotMatch = message.match(/DOT[:\-\s]*(\d{4,8})/i);
    const dotNumber = dotMatch ? dotMatch[1] : null;

    // Extract company name (basic pattern)
    const companyMatch = message.match(
      /from\s+([A-Z][a-zA-Z\s&]+(?:trucking|transport|logistics|freight|inc|llc|corp))/i
    );
    const companyName = companyMatch ? companyMatch[1].trim() : null;

    return {
      mcNumber,
      dotNumber,
      companyName,
      verified: false,
    };
  }

  /**
   * Extract route and shipment information from email
   */
  private async extractRouteInfo(message: string): Promise<{
    origin?: string;
    destination?: string;
    weight?: string;
    equipment?: string;
    commodity?: string;
    pickupDate?: string;
    deliveryDate?: string;
  }> {
    const lowerMessage = message.toLowerCase();

    // Extract origin (from/pickup locations)
    const originPatterns = [
      /(?:from|pickup|origin|ship from)\s+([a-z\s,]+(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))/i,
      /([a-z\s,]+(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))\s+(?:to|→)/i,
    ];

    let origin = null;
    for (const pattern of originPatterns) {
      const match = message.match(pattern);
      if (match) {
        origin = match[1].trim();
        break;
      }
    }

    // Extract destination (to/delivery locations)
    const destPatterns = [
      /(?:to|delivery|destination|deliver to)\s+([a-z\s,]+(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))/i,
      /(?:→|to)\s+([a-z\s,]+(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))/i,
    ];

    let destination = null;
    for (const pattern of destPatterns) {
      const match = message.match(pattern);
      if (match) {
        destination = match[1].trim();
        break;
      }
    }

    // Extract weight
    const weightMatch = message.match(
      /(\d+(?:,\d+)?)\s*(?:lbs?|pounds?|tons?)/i
    );
    const weight = weightMatch ? weightMatch[1] : null;

    // Extract equipment type
    const equipmentPatterns = [
      /(?:dry\s*van|dryvan)/i,
      /(?:reefer|refrigerated)/i,
      /(?:flatbed|flat\s*bed)/i,
      /(?:step\s*deck|stepdeck)/i,
      /(?:lowboy|low\s*boy)/i,
      /(?:container|conex)/i,
    ];

    let equipment = null;
    for (const pattern of equipmentPatterns) {
      if (pattern.test(message)) {
        equipment = pattern.source.replace(/[()\\|?*+]/g, '').split('|')[0];
        break;
      }
    }

    // Extract commodity
    const commodityMatch = message.match(
      /(?:shipping|hauling|moving|transporting)\s+([a-z\s]+?)(?:\s+from|\s+to|$)/i
    );
    const commodity = commodityMatch ? commodityMatch[1].trim() : null;

    return {
      origin,
      destination,
      weight,
      equipment,
      commodity,
    };
  }

  /**
   * Generate competitive quote using tenant's actual quote system
   */
  private async generateAutomaticQuote(
    routeInfo: any,
    carrierInfo: any,
    tenantConfig: TenantEmailConfig
  ): Promise<{
    baseRate: number;
    allInRate: number;
    miles: number;
    ratePerMile: number;
    fuelSurcharge: number;
    marketPosition: string;
    breakdown: {
      lineHaul: number;
      fuelSurcharge: number;
      accessorials: number;
    };
    quoteNumber: string;
    quoteId: string;
  }> {
    try {
      // Create quote request using tenant's actual quote system
      const quoteRequest: Omit<
        UniversalQuote,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        quoteNumber: '', // Will be generated by service
        type: this.determineQuoteType(routeInfo),
        status: 'draft',
        customer: {
          id: `EMAIL-${Date.now()}`,
          name: carrierInfo.companyName || 'Email Inquiry',
          email: carrierInfo.email || 'unknown@email.com',
          phone: carrierInfo.phone || 'N/A',
        },
        origin: {
          address: routeInfo.origin || 'TBD',
          city: this.extractCity(routeInfo.origin) || 'Unknown',
          state: this.extractState(routeInfo.origin) || 'Unknown',
          zipCode: 'TBD',
        },
        destination: {
          address: routeInfo.destination || 'TBD',
          city: this.extractCity(routeInfo.destination) || 'Unknown',
          state: this.extractState(routeInfo.destination) || 'Unknown',
          zipCode: 'TBD',
        },
        cargo: {
          weight: routeInfo.weight
            ? parseInt(routeInfo.weight.replace(/,/g, ''))
            : 40000,
          pieces: 1,
          description: routeInfo.commodity || 'General freight',
          hazmat:
            routeInfo.commodity?.toLowerCase().includes('hazmat') || false,
          specialRequirements: this.extractSpecialRequirements(routeInfo),
        },
        pricing: {
          baseRate: 0, // Will be calculated
          fuelSurcharge: 0,
          accessorials: 0,
          taxes: 0,
          total: 0,
          currency: 'USD',
        },
        timeline: {
          pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          deliveryDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          transitTime: 48,
          urgency: 'standard',
        },
        equipment: {
          type: routeInfo.equipment || 'Dry Van 53ft',
          specifications: [],
        },
        createdBy: `${tenantConfig.companyName}-AI-Email`,
        notes: `Auto-generated from email inquiry - ${carrierInfo.mcNumber ? `MC: ${carrierInfo.mcNumber}` : 'Unverified carrier'}`,
      };

      // Generate official quote using tenant's quote system
      const officialQuote = universalQuoteService.createQuote(quoteRequest);

      // Calculate route distance using existing logic
      const estimatedMiles =
        officialQuote.routeData?.distance ||
        this.calculateEstimatedMiles(routeInfo.origin, routeInfo.destination);

      // Use the official quote pricing
      const breakdown = {
        lineHaul: officialQuote.pricing.baseRate,
        fuelSurcharge: officialQuote.pricing.fuelSurcharge,
        accessorials: officialQuote.pricing.accessorials,
      };

      const ratePerMile = Number(
        (officialQuote.pricing.total / estimatedMiles).toFixed(2)
      );
      const marketPosition = this.analyzeMarketPosition(
        officialQuote.pricing.total,
        estimatedMiles,
        routeInfo.equipment
      );

      return {
        baseRate: officialQuote.pricing.baseRate,
        allInRate: officialQuote.pricing.total,
        miles: estimatedMiles,
        ratePerMile,
        fuelSurcharge: officialQuote.pricing.fuelSurcharge,
        marketPosition,
        breakdown,
        quoteNumber: officialQuote.quoteNumber,
        quoteId: officialQuote.id,
      };
    } catch (error) {
      console.error('Error generating quote via universalQuoteService:', error);
      // Fallback to basic calculation if quote service fails
      return this.generateFallbackQuote(routeInfo, carrierInfo, tenantConfig);
    }
  }

  /**
   * Determine quote type based on route info
   */
  private determineQuoteType(
    routeInfo: any
  ): 'LTL' | 'FTL' | 'Specialized' | 'Warehousing' | 'Multi-State' {
    const weight = routeInfo.weight
      ? parseInt(routeInfo.weight.replace(/,/g, ''))
      : 40000;

    if (
      routeInfo.commodity?.toLowerCase().includes('hazmat') ||
      routeInfo.equipment?.toLowerCase().includes('tanker') ||
      routeInfo.equipment?.toLowerCase().includes('flatbed')
    ) {
      return 'Specialized';
    }

    if (weight < 10000) {
      return 'LTL';
    }

    return 'FTL';
  }

  /**
   * Extract city from location string
   */
  private extractCity(location?: string): string | null {
    if (!location) return null;

    // Try to extract city before state abbreviation
    const match = location.match(
      /([a-z\s]+?),?\s*(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)/i
    );
    return match ? match[1].trim() : location;
  }

  /**
   * Extract state from location string
   */
  private extractState(location?: string): string | null {
    if (!location) return null;

    const match = location.match(
      /(al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)/i
    );
    return match ? match[1].toUpperCase() : null;
  }

  /**
   * Extract special requirements from route info
   */
  private extractSpecialRequirements(routeInfo: any): string[] {
    const requirements: string[] = [];

    if (routeInfo.commodity?.toLowerCase().includes('hazmat')) {
      requirements.push('Hazmat certified driver', 'Placarding required');
    }

    if (
      routeInfo.commodity?.toLowerCase().includes('temperature') ||
      routeInfo.equipment?.toLowerCase().includes('reefer')
    ) {
      requirements.push('Temperature controlled');
    }

    if (routeInfo.equipment?.toLowerCase().includes('liftgate')) {
      requirements.push('Liftgate delivery');
    }

    return requirements;
  }

  /**
   * Fallback quote generation if main system fails
   */
  private async generateFallbackQuote(
    routeInfo: any,
    carrierInfo: any,
    tenantConfig: TenantEmailConfig
  ): Promise<{
    baseRate: number;
    allInRate: number;
    miles: number;
    ratePerMile: number;
    fuelSurcharge: number;
    marketPosition: string;
    breakdown: {
      lineHaul: number;
      fuelSurcharge: number;
      accessorials: number;
    };
    quoteNumber: string;
    quoteId: string;
  }> {
    // Use original calculation logic as fallback
    const estimatedMiles = this.calculateEstimatedMiles(
      routeInfo.origin,
      routeInfo.destination
    );

    const baseRatePerMile = this.getMarketRatePerMile(
      routeInfo.equipment,
      routeInfo.commodity
    );
    const lineHaul = Math.round(estimatedMiles * baseRatePerMile);
    const fuelSurcharge = Math.round(estimatedMiles * 0.45);
    const accessorials = this.calculateAccessorials(routeInfo);
    const allInRate = lineHaul + fuelSurcharge + accessorials;
    const ratePerMile = Number((allInRate / estimatedMiles).toFixed(2));
    const marketPosition = this.analyzeMarketPosition(
      allInRate,
      estimatedMiles,
      routeInfo.equipment
    );

    return {
      baseRate: lineHaul,
      allInRate,
      miles: estimatedMiles,
      ratePerMile,
      fuelSurcharge,
      marketPosition,
      breakdown: {
        lineHaul,
        fuelSurcharge,
        accessorials,
      },
      quoteNumber: `${tenantConfig.companyName.substring(0, 2).toUpperCase()}-EMAIL-${Date.now().toString().slice(-6)}`,
      quoteId: `email-${Date.now()}`,
    };
  }

  /**
   * Calculate estimated miles between cities
   */
  private calculateEstimatedMiles(
    origin?: string,
    destination?: string
  ): number {
    if (!origin || !destination) return 500; // Default estimate

    // Mock calculation - in production, use Google Maps Distance Matrix API
    const cityDistances: Record<string, Record<string, number>> = {
      chicago: { 'los angeles': 2015, miami: 1377, atlanta: 717, dallas: 925 },
      atlanta: { miami: 662, chicago: 717, 'los angeles': 2175, dallas: 781 },
      dallas: { 'los angeles': 1435, chicago: 925, miami: 1300, atlanta: 781 },
      miami: { atlanta: 662, chicago: 1377, dallas: 1300, 'los angeles': 2757 },
    };

    const originKey = origin.toLowerCase().split(',')[0].trim();
    const destKey = destination.toLowerCase().split(',')[0].trim();

    return cityDistances[originKey]?.[destKey] || 800; // Default 800 miles
  }

  /**
   * Get market rate per mile based on equipment and commodity
   */
  private getMarketRatePerMile(equipment?: string, commodity?: string): number {
    const baseRates: Record<string, number> = {
      'dry van': 2.15,
      reefer: 2.65,
      flatbed: 2.45,
      'step deck': 2.85,
      lowboy: 3.25,
      container: 2.35,
    };

    // Premium for specialized commodities
    const commodityMultipliers: Record<string, number> = {
      electronics: 1.15,
      pharmaceuticals: 1.25,
      automotive: 1.1,
      hazmat: 1.35,
      oversized: 1.45,
    };

    const baseRate = baseRates[equipment?.toLowerCase() || 'dry van'] || 2.15;
    const multiplier = commodity
      ? commodityMultipliers[commodity.toLowerCase()] || 1.0
      : 1.0;

    return Number((baseRate * multiplier).toFixed(2));
  }

  /**
   * Calculate accessorial charges
   */
  private calculateAccessorials(routeInfo: any): number {
    let accessorials = 150; // Base accessorials

    // Add charges based on commodity
    if (routeInfo.commodity?.toLowerCase().includes('hazmat'))
      accessorials += 200;
    if (routeInfo.commodity?.toLowerCase().includes('oversized'))
      accessorials += 300;
    if (
      routeInfo.weight &&
      parseInt(routeInfo.weight.replace(/,/g, '')) > 45000
    )
      accessorials += 100;

    return accessorials;
  }

  /**
   * Analyze market position of quote
   */
  private analyzeMarketPosition(
    rate: number,
    miles: number,
    equipment?: string
  ): string {
    const ratePerMile = rate / miles;

    if (ratePerMile >= 2.8) return 'Premium Market Rate';
    if (ratePerMile >= 2.4) return 'Above Market Average';
    if (ratePerMile >= 2.0) return 'Competitive Market Rate';
    return 'Below Market Average';
  }

  /**
   * Verify carrier with FMCSA
   */
  private async verifyCarrier(carrierInfo: any): Promise<boolean> {
    try {
      if (carrierInfo.mcNumber) {
        const result = await this.fmcsaService.getCarrierByMC(
          carrierInfo.mcNumber
        );
        return result && result.carrierOperation === 'A'; // Active authority
      }

      if (carrierInfo.dotNumber) {
        const result = await this.fmcsaService.getCarrierByDOT(
          carrierInfo.dotNumber
        );
        return result && result.carrierOperation === 'A';
      }

      return false;
    } catch (error) {
      console.error('FMCSA verification error:', error);
      return false;
    }
  }

  /**
   * Schedule voice follow-up call
   */
  async scheduleVoiceFollowup(
    emailContext: EmailContext,
    delay: string = '1 hour'
  ): Promise<{
    scheduled: boolean;
    callId?: string;
    scheduledTime?: string;
  }> {
    // In production, this would integrate with your scheduling system
    const callId = `VOICE-${Date.now()}`;
    const scheduledTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    console.info(
      `Voice follow-up scheduled for ${emailContext.from} at ${scheduledTime}`
    );

    return {
      scheduled: true,
      callId,
      scheduledTime,
    };
  }

  /**
   * Generate email templates for different scenarios
   */
  getEmailTemplates(): Record<string, string> {
    return {
      carrier_inquiry: `
Hello {carrierName},

Thank you for your interest in FleetFlow's freight opportunities!

{fmcsaStatus}

I have several loads that match your equipment and service area:

🚛 **Available Loads:**
• Chicago, IL → Los Angeles, CA | Electronics | $2,850 | Dry Van
• Atlanta, GA → Miami, FL | Consumer Goods | $1,200 | Reefer
• Dallas, TX → Phoenix, AZ | Industrial Parts | $1,950 | Flatbed

These loads are moving fast - I'd love to discuss rates and get you booked today.

**Can I call you in the next hour to secure one of these loads?**

Best regards,
Sarah - FleetFlow AI Assistant
📞 Direct: +1-833-386-3509
📧 loads@fleetflowapp.com

P.S. Our AI system can book loads 24/7 - even after hours!
      `,

      shipper_request: `
Hello {shipperName},

Thank you for considering FleetFlow for your freight needs!

I understand you need shipping from {origin} to {destination}. Our AI-powered platform connects you with verified carriers in our network of 50,000+ trucks.

**FleetFlow Advantages:**
✅ Real-time rate quotes in under 60 seconds
✅ FMCSA-verified carriers only
✅ Live GPS tracking on every shipment
✅ 24/7 AI customer service

**Next Steps:**
I'd love to provide you with an instant quote. Can I call you in the next 30 minutes to discuss your specific requirements?

Best regards,
FleetFlow Freight Solutions
📞 +1-833-386-3509
📧 quotes@fleetflowapp.com

**Get instant quote:** fleetflowapp.com/quote
      `,

      rate_quote: `
Hello {carrierName},

Great news! I have the perfect load for your equipment.

**Load Details:**
📍 Origin: {origin}
📍 Destination: {destination}
📦 Commodity: {commodity}
⚖️ Weight: {weight}
🚛 Equipment: {equipment}

**Rate Offer: ${rate} ALL-IN**
• Competitive market rate
• Quick pay available
• Fuel advance if needed

⏰ **This load books fast** - 3 other carriers are interested.

**Can I call you RIGHT NOW to lock this in?**

Best regards,
Sarah - FleetFlow Load Desk
📞 Direct: +1-833-386-3509

*Reply "BOOK IT" to secure this load immediately!*
      `,
    };
  }

  /**
   * Send automated email response
   */
  async sendEmailResponse(
    emailContext: EmailContext,
    response: EmailResponse
  ): Promise<{
    sent: boolean;
    messageId?: string;
    error?: string;
  }> {
    // In production, integrate with your email service (SendGrid, etc.)
    console.info('Sending AI email response:', {
      to: emailContext.from,
      subject: response.subject,
      message: response.message,
      nextAction: response.nextAction,
    });

    // Mock successful send
    return {
      sent: true,
      messageId: `MSG-${Date.now()}`,
    };
  }

  /**
   * Create email-to-voice pipeline
   */
  async createEmailToVoicePipeline(emailContext: EmailContext): Promise<{
    voiceCallScheduled: boolean;
    callId?: string;
    estimatedCallTime?: string;
  }> {
    // Schedule voice follow-up based on email priority
    const delay = emailContext.priority === 'high' ? '15 minutes' : '1 hour';

    const voiceSchedule = await this.scheduleVoiceFollowup(emailContext, delay);

    if (voiceSchedule.scheduled) {
      console.info(`Email-to-Voice pipeline activated for ${emailContext.from}`);

      return {
        voiceCallScheduled: true,
        callId: voiceSchedule.callId,
        estimatedCallTime: voiceSchedule.scheduledTime,
      };
    }

    return { voiceCallScheduled: false };
  }

  /**
   * Get email automation metrics (tenant-specific)
   */
  async getEmailMetrics(tenantId?: string): Promise<{
    totalEmailsProcessed: number;
    responseRate: number;
    conversionToVoice: number;
    averageResponseTime: string;
    topEmailTypes: Array<{ type: string; count: number }>;
    tenantSpecific: boolean;
  }> {
    // Mock metrics - in production, pull from database with tenant filtering
    const baseMetrics = {
      totalEmailsProcessed: 1247,
      responseRate: 94.2,
      conversionToVoice: 67.8,
      averageResponseTime: '1.3 minutes',
      topEmailTypes: [
        { type: 'Carrier Inquiry', count: 456 },
        { type: 'Rate Quote', count: 389 },
        { type: 'Load Inquiry', count: 234 },
        { type: 'Shipper Request', count: 168 },
      ],
    };

    if (tenantId && tenantId !== 'fleetflow-default') {
      // Return tenant-specific metrics (scaled down for demo)
      return {
        ...baseMetrics,
        totalEmailsProcessed: Math.floor(
          baseMetrics.totalEmailsProcessed * 0.3
        ),
        topEmailTypes: baseMetrics.topEmailTypes.map((type) => ({
          ...type,
          count: Math.floor(type.count * 0.3),
        })),
        tenantSpecific: true,
      };
    }

    return {
      ...baseMetrics,
      tenantSpecific: false,
    };
  }

  /**
   * Get all tenant configurations (admin only)
   */
  getAllTenantConfigs(): TenantEmailConfig[] {
    return Array.from(this.tenantConfigs.values());
  }

  /**
   * Create new tenant email configuration
   */
  createTenantConfig(
    config: Omit<TenantEmailConfig, 'tenantId'> & { tenantId: string }
  ): void {
    this.tenantConfigs.set(config.tenantId, config as TenantEmailConfig);
  }

  // ========================================
  // EXTRACTION HELPER METHODS
  // ========================================

  /**
   * Extract load information from email
   */
  private async extractLoadInfo(message: string): Promise<any> {
    const loadNumberMatch = message.match(/load[:\s#]*([a-z0-9\-]+)/i);
    const pickupMatch = message.match(/pickup[:\s]*([^\n,]+)/i);
    const deliveryMatch = message.match(/deliver[y]?[:\s]*([^\n,]+)/i);

    return {
      loadNumber: loadNumberMatch ? loadNumberMatch[1] : null,
      pickup: pickupMatch ? pickupMatch[1].trim() : null,
      delivery: deliveryMatch ? deliveryMatch[1].trim() : null,
    };
  }

  /**
   * Extract status information from email
   */
  private async extractStatusInfo(message: string): Promise<any> {
    const statusMatch = message.match(/status[:\s]*([^\n,]+)/i);
    const etaMatch = message.match(/eta[:\s]*([^\n,]+)/i);
    const locationMatch = message.match(/location[:\s]*([^\n,]+)/i);

    return {
      status: statusMatch ? statusMatch[1].trim() : null,
      eta: etaMatch ? etaMatch[1].trim() : null,
      location: locationMatch ? locationMatch[1].trim() : null,
    };
  }

  /**
   * Extract document information from email
   */
  private async extractDocumentInfo(message: string): Promise<any> {
    const docTypes = [
      'bol',
      'bill of lading',
      'pod',
      'proof of delivery',
      'invoice',
      'rate confirmation',
    ];
    let documentType = null;

    for (const type of docTypes) {
      if (message.toLowerCase().includes(type)) {
        documentType = type.toUpperCase();
        break;
      }
    }

    const loadRefMatch = message.match(
      /(?:load|reference)[:\s#]*([a-z0-9\-]+)/i
    );

    return {
      documentType,
      loadReference: loadRefMatch ? loadRefMatch[1] : null,
    };
  }

  /**
   * Extract capacity requirements from email
   */
  private async extractCapacityInfo(message: string): Promise<any> {
    const equipmentMatch = message.match(
      /(?:need|require)[s]?\s+([a-z\s]+?)(?:\s+truck|s\s+from|s\s+in)/i
    );
    const originMatch = message.match(
      /(?:from|origin|pickup)[:\s]*([a-z\s,]+?)(?:\s+to|\s+on|$)/i
    );
    const dateMatch = message.match(/(?:on|by|date)[:\s]*([^\n,]+)/i);

    return {
      equipment: equipmentMatch ? equipmentMatch[1].trim() : null,
      origin: originMatch ? originMatch[1].trim() : null,
      date: dateMatch ? dateMatch[1].trim() : null,
    };
  }

  /**
   * Extract delivery information from email
   */
  private async extractDeliveryInfo(message: string): Promise<any> {
    const loadNumberMatch = message.match(/load[:\s#]*([a-z0-9\-]+)/i);
    const timeMatch = message.match(/(?:delivered|completed)[:\s]*([^\n,]+)/i);
    const podMatch =
      message.toLowerCase().includes('pod') ||
      message.toLowerCase().includes('proof');

    return {
      loadNumber: loadNumberMatch ? loadNumberMatch[1] : null,
      deliveryTime: timeMatch ? timeMatch[1].trim() : null,
      podReceived: podMatch,
    };
  }

  /**
   * Extract exception information from email
   */
  private async extractExceptionInfo(message: string): Promise<any> {
    const exceptionTypes = [
      'delay',
      'breakdown',
      'accident',
      'damage',
      'claim',
      'problem',
    ];
    let type = null;

    for (const exType of exceptionTypes) {
      if (message.toLowerCase().includes(exType)) {
        type = exType.charAt(0).toUpperCase() + exType.slice(1);
        break;
      }
    }

    const urgentKeywords = ['urgent', 'emergency', 'immediate', 'asap'];
    const severity = urgentKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    )
      ? 'High'
      : 'Medium';

    const loadNumberMatch = message.match(/load[:\s#]*([a-z0-9\-]+)/i);

    return {
      type,
      severity,
      loadNumber: loadNumberMatch ? loadNumberMatch[1] : null,
    };
  }

  /**
   * Extract RFx information from email
   */
  private async extractRFxInfo(message: string): Promise<any> {
    const rfxTypes = ['rfp', 'rfq', 'rfb', 'rfi'];
    let type = null;

    for (const rfxType of rfxTypes) {
      if (message.toLowerCase().includes(rfxType)) {
        type = rfxType.toUpperCase();
        break;
      }
    }

    const titleMatch = message.match(
      /(?:title|subject|opportunity)[:\s]*([^\n,]+)/i
    );
    const deadlineMatch = message.match(
      /(?:deadline|due|submit by)[:\s]*([^\n,]+)/i
    );

    return {
      type,
      title: titleMatch ? titleMatch[1].trim() : null,
      deadline: deadlineMatch ? deadlineMatch[1].trim() : null,
    };
  }

  /**
   * Extract financial information from email
   */
  private async extractFinancialInfo(message: string): Promise<any> {
    const financialTypes = [
      'payment',
      'invoice',
      'billing',
      'factoring',
      'detention',
      'accessorial',
    ];
    let type = null;

    for (const finType of financialTypes) {
      if (message.toLowerCase().includes(finType)) {
        type = finType.charAt(0).toUpperCase() + finType.slice(1);
        break;
      }
    }

    const amountMatch = message.match(/\$([0-9,]+\.?\d*)/);
    const referenceMatch = message.match(
      /(?:reference|ref|invoice)[:\s#]*([a-z0-9\-]+)/i
    );

    return {
      type,
      amount: amountMatch ? amountMatch[1] : null,
      reference: referenceMatch ? referenceMatch[1] : null,
    };
  }

  /**
   * Extract compliance information from email
   */
  private async extractComplianceInfo(message: string): Promise<any> {
    const complianceTypes = [
      'insurance',
      'dot audit',
      'safety rating',
      'permit',
      'compliance',
    ];
    let type = null;

    for (const compType of complianceTypes) {
      if (message.toLowerCase().includes(compType)) {
        type = compType.charAt(0).toUpperCase() + compType.slice(1);
        break;
      }
    }

    const urgentKeywords = [
      'expiring',
      'expired',
      'urgent',
      'immediate',
      'violation',
    ];
    const urgent = urgentKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );

    return {
      type,
      urgent,
    };
  }

  // ✅ Platform AI helper methods

  private inferCustomerTier(
    emailContext: EmailContext
  ): 'bronze' | 'silver' | 'gold' | 'platinum' {
    // Infer customer tier based on email characteristics
    if (emailContext.carrierInfo?.verified) return 'gold';
    if (emailContext.priority === 'high') return 'silver';
    return 'bronze';
  }

  private async generateEnhancedResponse(
    emailContext: EmailContext,
    aiAnalysis: any
  ): Promise<EmailResponse> {
    const tenantConfig = this.getTenantConfig(emailContext.tenantId);

    // Generate human-like response using Platform AI analysis
    const response: EmailResponse = {
      subject: `Re: ${emailContext.subject}`,
      message:
        typeof aiAnalysis.response === 'string'
          ? aiAnalysis.response
          : `Thank you for your email regarding ${emailContext.leadType.replace('_', ' ')}. We'll process this and get back to you promptly.`,
      nextAction: this.determineNextAction(emailContext, aiAnalysis),
      priority: emailContext.priority,
      requiresHumanReview: aiAnalysis.escalated,
      tenantId: emailContext.tenantId,
      metadata: {
        aiProcessed: true,
        aiQuality: aiAnalysis.quality,
        aiCost: aiAnalysis.cost,
        processingTime: Date.now(),
      },
    };

    return response;
  }

  private determineNextAction(
    emailContext: EmailContext,
    aiAnalysis: any
  ): EmailResponse['nextAction'] {
    // Determine next action based on email type and AI analysis
    switch (emailContext.leadType) {
      case 'load_inquiry':
        return 'auto_quote';
      case 'carrier_inquiry':
        return 'send_email';
      case 'rate_quote':
        return 'auto_quote';
      case 'load_confirmation':
        return 'create_load';
      case 'document_request':
        return 'generate_document';
      default:
        return aiAnalysis.escalated ? 'escalate_human' : 'send_email';
    }
  }

  // ✅ Get Platform AI metrics for this service
  async getAIMetrics(): Promise<any> {
    const costSummary = await platformAIManager.getCostSummary();
    const qualityStatus = await platformAIManager.getQualityStatus();

    return {
      serviceName: 'FreightEmailAI',
      emailsProcessed: 'Real-time data would be here',
      costsOptimized: true,
      qualitySupervised: true,
      humanLikeResponses: true,
      dailySpend: costSummary.dailySpend,
      qualityGrade: qualityStatus.overallGrade,
      escalations: qualityStatus.humanEscalations,
    };
  }
}

// Export singleton instance
export const freightEmailAI = new FreightEmailAI();
export default FreightEmailAI;
