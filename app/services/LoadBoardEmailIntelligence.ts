import { FleetFlowAI } from './ai';
import { sendGridService } from './sendgrid-service';
import { tenantEmailTemplateService } from './TenantEmailTemplateService';

// 🧠 INTELLIGENT EMAIL PROCESSING FOR LOAD BOARD INQUIRIES
export class LoadBoardEmailIntelligenceService {
  private ai: FleetFlowAI;

  constructor() {
    this.ai = new FleetFlowAI();
  }

  // 📧 PROCESS INCOMING LOAD INQUIRY EMAIL
  async processLoadInquiryEmail(
    inboundEmail: InboundEmail,
    tenantId: string
  ): Promise<EmailResponse> {
    try {
      console.info(
        '🔍 Processing load inquiry email from:',
        inboundEmail.fromEmail,
        'for tenant:',
        tenantId
      );

      // Step 1: Parse email content to extract load inquiry details
      const inquiryDetails = await this.parseLoadInquiry(inboundEmail);

      // Step 2: Verify if carrier exists in system
      const carrierStatus = await this.verifyCarrierStatus(
        inboundEmail.fromEmail,
        inquiryDetails.companyName,
        tenantId
      );

      // Step 3: Look up requested load information
      const loadInfo = await this.lookupLoadInformation(
        inquiryDetails.loadId,
        tenantId
      );

      // Step 4: Generate appropriate response
      if (carrierStatus.exists) {
        // Existing carrier - send load information using tenant template
        return await this.sendLoadInformationResponse(
          inboundEmail,
          loadInfo,
          carrierStatus.carrier,
          tenantId
        );
      } else {
        // New carrier - send invitation using tenant template
        return await this.sendCarrierInvitationWithLoadInfo(
          inboundEmail,
          inquiryDetails,
          loadInfo,
          tenantId
        );
      }
    } catch (error) {
      console.error('Load inquiry processing error:', error);
      return {
        success: false,
        action: 'error',
        error: error instanceof Error ? error.message : 'Processing failed',
      };
    }
  }

  // 🔍 AI-POWERED EMAIL PARSING
  private async parseLoadInquiry(
    email: InboundEmail
  ): Promise<LoadInquiryDetails> {
    const prompt = `Parse this email for load inquiry details:

    FROM: ${email.fromEmail}
    SUBJECT: ${email.subject}
    CONTENT: ${email.body}

    Extract and return JSON:
    {
      "loadId": "load ID mentioned (FL-001, TX-002, etc.) or null",
      "companyName": "sender's company name or null",
      "contactName": "sender's name or null",
      "phoneNumber": "phone number mentioned or null",
      "equipmentType": "truck/trailer type mentioned or null",
      "route": {
        "origin": "pickup location or null",
        "destination": "delivery location or null"
      },
      "inquiryType": "load_request|rate_inquiry|availability_check|general",
      "urgency": "high|medium|low",
      "keyQuestions": ["array of specific questions asked"],
      "confidence": "0-100 confidence in parsing accuracy"
    }`;

    const aiResponse = await this.ai.generateContent(prompt);
    return JSON.parse(aiResponse);
  }

  // ✅ VERIFY CARRIER STATUS IN SYSTEM
  private async verifyCarrierStatus(
    email: string,
    companyName?: string,
    tenantId?: string
  ): Promise<CarrierVerificationResult> {
    try {
      // Check database for existing carrier by email
      const carrierByEmail = await this.findCarrierByEmail(email);

      if (carrierByEmail) {
        return {
          exists: true,
          carrier: carrierByEmail,
          matchType: 'email',
        };
      }

      // Check by company name if provided
      if (companyName) {
        const carrierByCompany =
          await this.findCarrierByCompanyName(companyName);
        if (carrierByCompany) {
          return {
            exists: true,
            carrier: carrierByCompany,
            matchType: 'company',
          };
        }
      }

      return {
        exists: false,
        matchType: 'none',
      };
    } catch (error) {
      console.error('Carrier verification error:', error);
      return { exists: false, matchType: 'error' };
    }
  }

  // 🔎 LOOKUP LOAD INFORMATION
  private async lookupLoadInformation(
    loadId?: string,
    tenantId?: string
  ): Promise<LoadInformation | null> {
    if (!loadId) return null;

    try {
      // Mock load lookup - replace with actual database query filtered by tenant
      const mockLoads = this.getMockLoadDatabase(tenantId);
      const load = mockLoads.find(
        (l) =>
          l.id.toLowerCase() === loadId.toLowerCase() ||
          l.loadBoardNumber === loadId
      );

      return load || null;
    } catch (error) {
      console.error('Load lookup error:', error);
      return null;
    }
  }

  // 📨 SEND LOAD INFORMATION TO EXISTING CARRIER
  private async sendLoadInformationResponse(
    originalEmail: InboundEmail,
    loadInfo: LoadInformation | null,
    carrier: CarrierProfile,
    tenantId: string
  ): Promise<EmailResponse> {
    // Use tenant template instead of AI generation
    const renderedEmail = await tenantEmailTemplateService.renderTenantEmail(
      tenantId,
      'load_information_existing_carrier',
      {
        load: loadInfo,
        carrier: carrier,
        inquiry: {
          fromEmail: originalEmail.fromEmail,
          subject: originalEmail.subject,
        },
      }
    );

    const result = await sendGridService.sendEmail({
      recipient: { email: originalEmail.fromEmail, name: carrier.contactName },
      subject: renderedEmail.subject,
      htmlContent: renderedEmail.htmlContent,
      textContent: renderedEmail.textContent,
      fromEmail: renderedEmail.fromEmail,
      fromName: renderedEmail.fromName,
      templateId: 'load-information-response',
      metadata: {
        tenantId,
        originalEmailId: originalEmail.id,
        loadId: loadInfo?.id || 'not_found',
        carrierId: carrier.id,
        responseType: 'load_information',
      },
    });

    return {
      success: result.success,
      action: 'load_information_sent',
      carrierId: carrier.id,
      loadId: loadInfo?.id,
      result,
    };
  }

  // 🎯 SEND CARRIER INVITATION WITH LOAD INFO
  private async sendCarrierInvitationWithLoadInfo(
    originalEmail: InboundEmail,
    inquiryDetails: LoadInquiryDetails,
    loadInfo: LoadInformation | null,
    tenantId: string
  ): Promise<EmailResponse> {
    // Use tenant template instead of AI generation
    const renderedEmail = await tenantEmailTemplateService.renderTenantEmail(
      tenantId,
      'carrier_invitation_new',
      {
        load: loadInfo,
        inquiry: {
          fromEmail: originalEmail.fromEmail,
          subject: originalEmail.subject,
          contactName: inquiryDetails.contactName,
          company: inquiryDetails.companyName,
        },
      }
    );

    const result = await sendGridService.sendEmail({
      recipient: {
        email: originalEmail.fromEmail,
        name: inquiryDetails.contactName || 'Carrier Representative',
      },
      subject: renderedEmail.subject,
      htmlContent: renderedEmail.htmlContent,
      textContent: renderedEmail.textContent,
      fromEmail: renderedEmail.fromEmail,
      fromName: renderedEmail.fromName,
      templateId: 'carrier-invitation-with-load',
      metadata: {
        tenantId,
        originalEmailId: originalEmail.id,
        loadId: loadInfo?.id || 'not_found',
        responseType: 'carrier_invitation',
        leadSource: 'load_inquiry_email',
      },
    });

    // Create lead record for follow-up
    await this.createCarrierLead(originalEmail, inquiryDetails, tenantId);

    return {
      success: result.success,
      action: 'carrier_invitation_sent',
      loadId: loadInfo?.id,
      leadCreated: true,
      result,
    };
  }

  // 🎨 GENERATE LOAD INFORMATION EMAIL
  private async generateLoadInfoEmail(
    originalEmail: InboundEmail,
    loadInfo: LoadInformation | null,
    carrier: CarrierProfile
  ): Promise<EmailContent> {
    const prompt = `Generate a professional response email for load inquiry:

    ORIGINAL EMAIL:
    From: ${originalEmail.fromEmail}
    Subject: ${originalEmail.subject}

    CARRIER INFO:
    Company: ${carrier.company}
    Contact: ${carrier.contactName}
    Status: Verified FleetFlow Partner

    LOAD INFORMATION:
    ${
      loadInfo
        ? `
    Load ID: ${loadInfo.id}
    Route: ${loadInfo.origin.city}, ${loadInfo.origin.state} → ${loadInfo.destination.city}, ${loadInfo.destination.state}
    Distance: ${loadInfo.distance} miles
    Rate: $${loadInfo.rate.toLocaleString()}
    Pickup: ${loadInfo.pickupDate}
    Delivery: ${loadInfo.deliveryDate}
    Equipment: ${loadInfo.equipment}
    Weight: ${loadInfo.weight}
    Status: ${loadInfo.status}
    `
        : 'Load not found or no longer available'
    }

    Email should:
    - Thank them for their inquiry
    - ${loadInfo ? 'Provide complete load details clearly' : 'Explain load is no longer available'}
    - Include next steps (acceptance process, contact info)
    - Professional and prompt tone
    - Include FleetFlow branding/signature

    Format as JSON: { "subject": "...", "html": "...", "text": "..." }`;

    const aiResponse = await this.ai.generateContent(prompt);
    return JSON.parse(aiResponse);
  }

  // 💌 GENERATE CARRIER INVITATION EMAIL
  private async generateCarrierInvitationEmail(
    originalEmail: InboundEmail,
    inquiryDetails: LoadInquiryDetails,
    loadInfo: LoadInformation | null
  ): Promise<EmailContent> {
    const prompt = `Generate a simple carrier invitation email:

    INQUIRY DETAILS:
    From: ${originalEmail.fromEmail}
    Company: ${inquiryDetails.companyName || 'Unknown'}
    Contact: ${inquiryDetails.contactName || 'Unknown'}
    Subject: ${originalEmail.subject}

    REQUESTED LOAD:
    ${
      loadInfo
        ? `
    Load: ${loadInfo.id} - ${loadInfo.origin.city} to ${loadInfo.destination.city}
    Rate: $${loadInfo.rate.toLocaleString()}
    Status: ${loadInfo.status}
    `
        : 'Load information not available'
    }

    Email should:
    - Thank them for their load inquiry
    - ${loadInfo && loadInfo.status === 'Available' ? 'Confirm the load is currently available' : 'Explain load may no longer be available (first-come, first-served basis)'}
    - Explain they need to join FleetFlow network to access loads
    - Direct them to existing carrier invitation: https://fleetflow.app/carrier-landing
    - Keep it simple and professional
    - NO mention of load reservations or holding
    - Clear next steps for joining the network

    Format as JSON: { "subject": "...", "html": "...", "text": "..." }`;

    const aiResponse = await this.ai.generateContent(prompt);
    return JSON.parse(aiResponse);
  }

  // 🏢 CREATE CARRIER LEAD RECORD
  private async createCarrierLead(
    email: InboundEmail,
    details: LoadInquiryDetails,
    tenantId?: string
  ): Promise<void> {
    try {
      // Create lead record for sales follow-up
      const leadData = {
        id: `lead-${Date.now()}`,
        tenantId: tenantId || 'default',
        email: email.fromEmail,
        company: details.companyName || 'Unknown',
        contactName: details.contactName || 'Unknown',
        phone: details.phoneNumber,
        source: 'load_inquiry_email',
        inquiryDate: new Date(),
        loadInterest: details.loadId,
        equipmentType: details.equipmentType,
        status: 'new',
        priority: details.urgency === 'high' ? 'high' : 'medium',
      };

      console.info('📋 Created carrier lead:', leadData.id);
      // Save to database here
    } catch (error) {
      console.error('Lead creation error:', error);
    }
  }

  // 🗄️ DATABASE HELPER METHODS
  private async findCarrierByEmail(
    email: string
  ): Promise<CarrierProfile | null> {
    // Mock implementation - replace with actual database query
    const mockCarriers = this.getMockCarrierDatabase();
    return (
      mockCarriers.find((c) => c.email.toLowerCase() === email.toLowerCase()) ||
      null
    );
  }

  private async findCarrierByCompanyName(
    companyName: string
  ): Promise<CarrierProfile | null> {
    // Mock implementation - replace with actual database query
    const mockCarriers = this.getMockCarrierDatabase();
    return (
      mockCarriers.find((c) =>
        c.company.toLowerCase().includes(companyName.toLowerCase())
      ) || null
    );
  }

  private getMockLoadDatabase(tenantId?: string): LoadInformation[] {
    return [
      {
        id: 'FL-001',
        loadBoardNumber: '100001',
        origin: { city: 'Miami', state: 'FL' },
        destination: { city: 'Atlanta', state: 'GA' },
        distance: 662,
        rate: 2800,
        pickupDate: '2024-01-20',
        deliveryDate: '2024-01-21',
        equipment: 'Dry Van',
        weight: '45,000 lbs',
        status: 'Available',
      },
      {
        id: 'TX-002',
        loadBoardNumber: '100002',
        origin: { city: 'Houston', state: 'TX' },
        destination: { city: 'Phoenix', state: 'AZ' },
        distance: 1187,
        rate: 4200,
        pickupDate: '2024-01-22',
        deliveryDate: '2024-01-24',
        equipment: 'Refrigerated',
        weight: '48,500 lbs',
        status: 'Assigned',
      },
    ];
  }

  private getMockCarrierDatabase(): CarrierProfile[] {
    return [
      {
        id: 'carrier-001',
        company: 'ABC Trucking LLC',
        contactName: 'John Smith',
        email: 'john@abctrucking.com',
        phone: '(555) 123-4567',
        mcNumber: 'MC-123456',
        verified: true,
        rating: 4.8,
      },
    ];
  }
}

// 📬 EMAIL WEBHOOK HANDLER
export class EmailWebhookHandler {
  private intelligence: LoadBoardEmailIntelligenceService;

  constructor() {
    this.intelligence = new LoadBoardEmailIntelligenceService();
  }

  // Process incoming emails from SendGrid Inbound Parse
  async handleInboundEmail(webhookData: any): Promise<void> {
    try {
      const inboundEmail: InboundEmail = {
        id: `email-${Date.now()}`,
        fromEmail: webhookData.from,
        toEmail: webhookData.to,
        subject: webhookData.subject,
        body: webhookData.text || webhookData.html,
        receivedAt: new Date(),
        headers: webhookData.headers,
      };

      // Check if this is a load inquiry
      if (this.isLoadInquiry(inboundEmail)) {
        console.info('🎯 Load inquiry detected, processing...');
        // Extract tenantId from email headers or domain
        const tenantId = this.extractTenantId(inboundEmail);
        await this.intelligence.processLoadInquiryEmail(inboundEmail, tenantId);
      }
    } catch (error) {
      console.error('Email webhook processing error:', error);
    }
  }

  private isLoadInquiry(email: InboundEmail): boolean {
    const inquiryKeywords = [
      'load',
      'freight',
      'shipment',
      'haul',
      'transport',
      'pickup',
      'delivery',
      'FL-',
      'TX-',
      'CA-',
      'available',
      'quote',
      'rate',
      'truck',
      'trailer',
    ];

    const content = (email.subject + ' ' + email.body).toLowerCase();
    return inquiryKeywords.some((keyword) => content.includes(keyword));
  }

  private extractTenantId(email: InboundEmail): string {
    // Extract tenant ID from email address or headers
    // For now, use a simple domain-based mapping
    const toDomain = email.toEmail.split('@')[1];

    // Mock tenant mapping - replace with actual tenant lookup
    const tenantMapping: { [key: string]: string } = {
      'loads@abclogistics.com': 'tenant-001',
      'dispatch@xyzfreight.com': 'tenant-002',
      'fleetflowapp.com': 'default',
    };

    return tenantMapping[toDomain] || tenantMapping[email.toEmail] || 'default';
  }
}

// Type Definitions
interface InboundEmail {
  id: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
  receivedAt: Date;
  headers?: any;
}

interface LoadInquiryDetails {
  loadId?: string;
  companyName?: string;
  contactName?: string;
  phoneNumber?: string;
  equipmentType?: string;
  route: {
    origin?: string;
    destination?: string;
  };
  inquiryType:
    | 'load_request'
    | 'rate_inquiry'
    | 'availability_check'
    | 'general';
  urgency: 'high' | 'medium' | 'low';
  keyQuestions: string[];
  confidence: number;
}

interface CarrierVerificationResult {
  exists: boolean;
  carrier?: CarrierProfile;
  matchType: 'email' | 'company' | 'none' | 'error';
}

interface CarrierProfile {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  mcNumber?: string;
  verified: boolean;
  rating?: number;
}

interface LoadInformation {
  id: string;
  loadBoardNumber: string;
  origin: { city: string; state: string };
  destination: { city: string; state: string };
  distance: number;
  rate: number;
  pickupDate: string;
  deliveryDate: string;
  equipment: string;
  weight: string;
  status: string;
}

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

interface EmailResponse {
  success: boolean;
  action: 'load_information_sent' | 'carrier_invitation_sent' | 'error';
  carrierId?: string;
  loadId?: string;
  leadCreated?: boolean;
  result?: any;
  error?: string;
}

// Export instances for use across the application
export const loadBoardEmailIntelligence =
  new LoadBoardEmailIntelligenceService();
export const emailWebhookHandler = new EmailWebhookHandler();
