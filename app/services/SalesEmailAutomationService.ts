import { FleetFlowAI } from './ai';
import { sendGridService } from './sendgrid-service';

// SalesApe AI-style Email Automation for FleetFlow Sales
export class SalesEmailAutomationService {
  private ai: FleetFlowAI;
  private isEnabled: boolean = true;

  constructor() {
    this.ai = new FleetFlowAI();
  }

  // 🎯 LEAD ENGAGEMENT AUTOMATION (SalesApe AI Style)
  async engageNewLead(lead: SalesLead): Promise<EmailResult> {
    try {
      // AI-powered lead qualification and email generation
      const leadQualification = await this.ai.qualifyLead({
        company: lead.company,
        industry: lead.industry,
        size: lead.fleetSize,
        location: lead.location,
        needs: lead.transportationNeeds,
      });

      // Generate personalized email content
      const emailContent = await this.generateLeadEngagementEmail(
        lead,
        leadQualification
      );

      // Send automated engagement email
      const result = await sendGridService.sendEmail({
        recipient: { email: lead.email, name: lead.contactName },
        subject: emailContent.subject,
        htmlContent: emailContent.html,
        textContent: emailContent.text,
        templateId: 'lead-engagement',
        metadata: {
          leadId: lead.id,
          automationType: 'lead_engagement',
          qualificationScore: leadQualification.score,
        },
      });

      // Schedule follow-up sequence
      await this.scheduleFollowUpSequence(lead, leadQualification);

      return result;
    } catch (error) {
      console.error('Lead engagement automation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // 📧 AI-POWERED EMAIL CONTENT GENERATION
  private async generateLeadEngagementEmail(
    lead: SalesLead,
    qualification: LeadQualification
  ): Promise<EmailContent> {
    const prompt = `Generate a professional, personalized email for a transportation/logistics lead:

    Company: ${lead.company}
    Contact: ${lead.contactName}
    Industry: ${lead.industry}
    Fleet Size: ${lead.fleetSize}
    Location: ${lead.location}
    Qualification Score: ${qualification.score}/100
    Key Needs: ${lead.transportationNeeds.join(', ')}

    Email should:
    - Be conversational and professional
    - Address their specific transportation challenges
    - Mention relevant FleetFlow solutions
    - Include a clear call-to-action for a discovery call
    - Be 200-300 words maximum
    - Include personalized subject line

    Format as JSON: { "subject": "...", "html": "...", "text": "..." }`;

    const aiResponse = await this.ai.generateContent(prompt);
    return JSON.parse(aiResponse);
  }

  // 🔄 AUTOMATED FOLLOW-UP SEQUENCES
  async scheduleFollowUpSequence(
    lead: SalesLead,
    qualification: LeadQualification
  ): Promise<void> {
    const sequence = this.getFollowUpSequence(qualification.score);

    for (let i = 0; i < sequence.length; i++) {
      const followUp = sequence[i];

      // Schedule email for future sending
      setTimeout(
        async () => {
          await this.sendFollowUpEmail(lead, followUp, i + 1);
        },
        followUp.delay * 24 * 60 * 60 * 1000
      ); // Convert days to milliseconds
    }
  }

  private getFollowUpSequence(qualificationScore: number): FollowUpSequence[] {
    if (qualificationScore >= 80) {
      // High-quality lead - aggressive sequence
      return [
        {
          delay: 3,
          type: 'value_proposition',
          subject: 'ROI Calculator: See Your Potential Savings',
        },
        {
          delay: 7,
          type: 'case_study',
          subject: 'How [Similar Company] Saved 30% on Transportation Costs',
        },
        {
          delay: 14,
          type: 'demo_offer',
          subject: 'Ready for a 15-minute demo?',
        },
      ];
    } else if (qualificationScore >= 50) {
      // Medium-quality lead - educational sequence
      return [
        {
          delay: 5,
          type: 'educational',
          subject: 'Transportation Management Best Practices',
        },
        {
          delay: 12,
          type: 'industry_insights',
          subject: 'Q4 Transportation Industry Report',
        },
        {
          delay: 21,
          type: 'soft_pitch',
          subject: 'Still evaluating transportation solutions?',
        },
      ];
    } else {
      // Low-quality lead - nurturing sequence
      return [
        {
          delay: 7,
          type: 'nurturing',
          subject: 'Transportation Technology Trends to Watch',
        },
        {
          delay: 30,
          type: 'check_in',
          subject: 'Any changes in your transportation needs?',
        },
      ];
    }
  }

  // 🎯 APPOINTMENT SCHEDULING AUTOMATION
  async scheduleAppointment(
    lead: SalesLead,
    preferredTimes: string[]
  ): Promise<EmailResult> {
    const emailContent = await this.generateAppointmentEmail(
      lead,
      preferredTimes
    );

    return await sendGridService.sendEmail({
      recipient: { email: lead.email, name: lead.contactName },
      subject: emailContent.subject,
      htmlContent: emailContent.html,
      textContent: emailContent.text,
      templateId: 'appointment-scheduling',
      metadata: {
        leadId: lead.id,
        automationType: 'appointment_scheduling',
      },
    });
  }

  // 📊 LEAD SCORING AND QUALIFICATION
  async qualifyLead(leadData: any): Promise<LeadQualification> {
    const prompt = `Qualify this transportation/logistics lead and provide a score 0-100:

    Company: ${leadData.company}
    Industry: ${leadData.industry}
    Fleet Size: ${leadData.fleetSize}
    Location: ${leadData.location}
    Annual Revenue: ${leadData.revenue || 'Unknown'}
    Current TMS: ${leadData.currentTMS || 'Unknown'}
    Pain Points: ${leadData.painPoints?.join(', ') || 'Unknown'}

    Provide JSON response: {
      "score": number (0-100),
      "reasoning": "explanation of score",
      "priority": "high|medium|low",
      "recommendedAction": "specific next step",
      "estimatedValue": "potential contract value",
      "timeline": "estimated sales cycle"
    }`;

    const aiResponse = await this.ai.generateContent(prompt);
    return JSON.parse(aiResponse);
  }

  // 📈 EMAIL PERFORMANCE TRACKING
  async trackEmailPerformance(leadId: string): Promise<EmailMetrics> {
    // Integration with SendGrid event tracking
    return {
      sent: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      openRate: 0,
      clickRate: 0,
      responseRate: 0,
    };
  }
}

// 🏢 DISPATCH CENTRAL EMAIL AUTOMATION
export class DispatchEmailAutomationService {
  private ai: FleetFlowAI;

  constructor() {
    this.ai = new FleetFlowAI();
  }

  // 🚛 AUTOMATED LOAD OPPORTUNITY EMAILS
  async sendLoadOpportunityEmail(
    load: LoadOpportunity,
    carriers: CarrierContact[]
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const carrier of carriers) {
      try {
        // Generate personalized load opportunity email
        const emailContent = await this.generateLoadOpportunityEmail(
          load,
          carrier
        );

        const result = await sendGridService.sendEmail({
          recipient: { email: carrier.email, name: carrier.contactName },
          subject: emailContent.subject,
          htmlContent: emailContent.html,
          textContent: emailContent.text,
          templateId: 'load-opportunity',
          metadata: {
            loadId: load.id,
            carrierId: carrier.id,
            automationType: 'load_opportunity',
          },
        });

        results.push(result);
      } catch (error) {
        console.error(
          `Failed to send load opportunity to ${carrier.email}:`,
          error
        );
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }

  // 📋 AI-GENERATED LOAD OPPORTUNITY CONTENT
  private async generateLoadOpportunityEmail(
    load: LoadOpportunity,
    carrier: CarrierContact
  ): Promise<EmailContent> {
    const prompt = `Generate a professional load opportunity email:

    LOAD DETAILS:
    - Route: ${load.origin.city}, ${load.origin.state} → ${load.destination.city}, ${load.destination.state}
    - Distance: ${load.distance} miles
    - Rate: $${load.rate.toLocaleString()}
    - Pickup: ${load.pickupDate}
    - Delivery: ${load.deliveryDate}
    - Equipment: ${load.equipment}
    - Weight: ${load.weight}

    CARRIER INFO:
    - Company: ${carrier.company}
    - Contact: ${carrier.contactName}
    - Specialization: ${carrier.specializations?.join(', ') || 'General freight'}

    Email should:
    - Professional and urgent tone
    - Highlight key load details clearly
    - Include competitive rate emphasis
    - Clear call-to-action for response
    - 150-200 words maximum

    Format as JSON: { "subject": "...", "html": "...", "text": "..." }`;

    const aiResponse = await this.ai.generateContent(prompt);
    return JSON.parse(aiResponse);
  }

  // 🎯 DRIVER ASSIGNMENT NOTIFICATIONS
  async sendDriverAssignmentEmail(
    load: LoadAssignment,
    driver: DriverContact
  ): Promise<EmailResult> {
    const emailContent = await this.generateDriverAssignmentEmail(load, driver);

    return await sendGridService.sendEmail({
      recipient: { email: driver.email, name: driver.name },
      subject: emailContent.subject,
      htmlContent: emailContent.html,
      textContent: emailContent.text,
      templateId: 'driver-assignment',
      metadata: {
        loadId: load.id,
        driverId: driver.id,
        automationType: 'driver_assignment',
      },
    });
  }

  // 📊 LOAD STATUS UPDATES
  async sendLoadStatusUpdate(
    load: LoadStatus,
    stakeholders: EmailContact[]
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const contact of stakeholders) {
      const emailContent = await this.generateStatusUpdateEmail(load, contact);

      const result = await sendGridService.sendEmail({
        recipient: { email: contact.email, name: contact.name },
        subject: emailContent.subject,
        htmlContent: emailContent.html,
        textContent: emailContent.text,
        templateId: 'status-update',
        metadata: {
          loadId: load.id,
          contactType: contact.type,
          automationType: 'status_update',
        },
      });

      results.push(result);
    }

    return results;
  }
}

// Type Definitions
interface SalesLead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  fleetSize: string;
  location: string;
  transportationNeeds: string[];
  source: string;
  createdAt: Date;
}

interface LeadQualification {
  score: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  recommendedAction: string;
  estimatedValue: string;
  timeline: string;
}

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface FollowUpSequence {
  delay: number; // days
  type: string;
  subject: string;
}

interface EmailMetrics {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
}

interface LoadOpportunity {
  id: string;
  origin: { city: string; state: string };
  destination: { city: string; state: string };
  distance: number;
  rate: number;
  pickupDate: string;
  deliveryDate: string;
  equipment: string;
  weight: string;
  specialRequirements?: string[];
}

interface CarrierContact {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  specializations?: string[];
  rating?: number;
}

interface LoadAssignment {
  id: string;
  loadId: string;
  origin: { city: string; state: string };
  destination: { city: string; state: string };
  pickupDate: string;
  deliveryDate: string;
  rate: number;
  instructions?: string;
}

interface DriverContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  truckNumber?: string;
}

interface LoadStatus {
  id: string;
  status: string;
  location?: string;
  eta?: string;
  notes?: string;
}

interface EmailContact {
  email: string;
  name: string;
  type: 'driver' | 'carrier' | 'customer' | 'dispatcher';
}

// Export instances for use across the application
export const salesEmailAutomation = new SalesEmailAutomationService();
export const dispatchEmailAutomation = new DispatchEmailAutomationService();








