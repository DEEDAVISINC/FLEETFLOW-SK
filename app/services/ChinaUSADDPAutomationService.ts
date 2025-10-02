/**
 * China-USA DDP Automation Service
 *
 * This service automates the entire DDP workflow with AI staff actively managing:
 * - Automatic Big 5 data collection
 * - Quote generation
 * - Payment tracking
 * - Shipment monitoring
 */

'use client';

import { depointeStaff } from '../depointe-dashboard/page';

export interface DDPInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productCategory?: 'steel' | 'metal' | 'aluminum' | 'other';
  estimatedContainers?: number;
  source: 'website' | 'referral' | 'cold_outreach' | 'inbound_call';
  createdAt: Date;
  status:
    | 'new'
    | 'assigned'
    | 'collecting_big5'
    | 'ready_for_quote'
    | 'quoted'
    | 'payment_pending'
    | 'confirmed';
}

export interface Big5CollectionStatus {
  chinaAddress: boolean;
  usaAddress: boolean;
  productDetails: boolean;
  timing: boolean;
  containerInfo: boolean;
  lastUpdate: Date;
  nextFollowUp: Date;
}

export interface AIStaffAction {
  id: string;
  staffId: string;
  staffName: string;
  actionType:
    | 'email_sent'
    | 'follow_up'
    | 'quote_generated'
    | 'payment_reminder'
    | 'status_update';
  description: string;
  timestamp: Date;
  automated: boolean;
}

class ChinaUSADDPAutomationService {
  private activeInquiries: Map<string, DDPInquiry> = new Map();
  private big5Status: Map<string, Big5CollectionStatus> = new Map();
  private aiActions: Map<string, AIStaffAction[]> = new Map();
  private automationIntervals: NodeJS.Timeout[] = [];
  private isStarted: boolean = false;

  constructor() {
    console.log('🚢 China-USA DDP Automation Service initialized');
  }

  /**
   * Start all automation loops (called once on first use)
   */
  private startAutomation(): void {
    if (this.isStarted) return;
    this.isStarted = true;

    // Process Big 5 collection every minute
    const big5Check = setInterval(() => this.processBig5Collection(), 60000);

    // Check for quote generation every 2 minutes
    const quoteCheck = setInterval(
      () => this.checkForQuoteGeneration(),
      120000
    );

    // Monitor payments every 5 minutes
    const paymentCheck = setInterval(() => this.monitorPayments(), 300000);

    this.automationIntervals.push(big5Check, quoteCheck, paymentCheck);

    console.log('✅ DDP Automation loops started');
  }

  /**
   * Automatically assign freight specialist to new inquiry
   */
  async handleNewInquiry(inquiry: DDPInquiry): Promise<void> {
    // Start automation if not already started
    this.startAutomation();

    // Find Marcus Chen (freight specialist)
    const specialist = depointeStaff.find(
      (s) => s.id === 'freight-specialist-028'
    );

    if (!specialist) {
      console.error('❌ Freight specialist not found');
      return;
    }

    // Add to active inquiries
    this.activeInquiries.set(inquiry.id, {
      ...inquiry,
      status: 'assigned',
    });

    // Initialize Big 5 status
    this.big5Status.set(inquiry.id, {
      chinaAddress: false,
      usaAddress: false,
      productDetails: false,
      timing: false,
      containerInfo: false,
      lastUpdate: new Date(),
      nextFollowUp: new Date(Date.now() + 3600000), // 1 hour from now
    });

    // Log AI action
    this.logAIAction(inquiry.id, {
      staffId: specialist.id,
      staffName: specialist.name,
      actionType: 'email_sent',
      description: `${specialist.name} auto-assigned to inquiry. Sent initial email to collect Big 5 data.`,
      automated: true,
    });

    // Simulate sending initial email
    await this.sendInitialCollectionEmail(inquiry, specialist.name);

    console.log(`✅ ${specialist.name} auto-assigned to inquiry ${inquiry.id}`);
  }

  /**
   * Send automated email to collect Big 5 data
   */
  private async sendInitialCollectionEmail(
    inquiry: DDPInquiry,
    staffName: string
  ): Promise<void> {
    const emailContent = {
      to: inquiry.customerEmail,
      subject: 'China → USA DDP Service - Information Needed',
      body: `
        Hi ${inquiry.customerName},

        Thank you for your interest in our China → USA DDP (Delivered Duty Paid) service!

        I'm ${staffName}, your dedicated freight specialist. I'll be managing your shipment from pickup in China through customs clearance and final delivery in the USA.

        To provide you with an accurate quote, I need the following 5 pieces of information:

        1. **China Pickup Address**
           - Full street address, city, province, postal code
           - Contact person name and phone number

        2. **USA Delivery Address**
           - Full street address, city, state, ZIP code
           - Contact person name and phone number

        3. **Product Details**
           - HTS code (if known)
           - Product description
           - Product photos (at least 3)
           - ${
             inquiry.productCategory === 'steel' ||
             inquiry.productCategory === 'metal' ||
             inquiry.productCategory === 'aluminum'
               ? '⚠️ Important: As a ' +
                 inquiry.productCategory +
                 ' importer, you face 95% tariff. Our DDP service gives you total cost certainty!'
               : ''
           }

        4. **Shipment Timing**
           - When do you need pickup from China?
           - Any delivery deadlines?

        5. **Container Information**
           - How many containers?
           - Preferred: 40HQ (High Cube) - best for heavy products
           - Also available: 40ft Standard, 20ft Standard

        Once I have these details, I can generate your quote within 2 hours.

        **Why Our DDP Service?**
        ✅ One invoice - all costs included
        ✅ One point of contact - me!
        ✅ No surprises - total cost upfront

        Please reply with the above information or let me know if you have any questions!

        Best regards,
        ${staffName}
        International Freight & Customs Specialist
        FleetFlow - China-USA DDP Service
      `,
      priority: 'high',
    };

    console.log(
      `📧 Initial Big 5 collection email sent to ${inquiry.customerEmail}`
    );

    // In a real system, this would integrate with your email service
    // await emailService.send(emailContent);
  }

  /**
   * Process Big 5 collection for all active inquiries
   */
  private async processBig5Collection(): Promise<void> {
    for (const [inquiryId, inquiry] of this.activeInquiries) {
      if (inquiry.status !== 'collecting_big5' && inquiry.status !== 'assigned')
        continue;

      const big5 = this.big5Status.get(inquiryId);
      if (!big5) continue;

      // Check if follow-up is needed
      if (new Date() >= big5.nextFollowUp) {
        await this.sendFollowUpEmail(inquiry, big5);

        // Schedule next follow-up
        big5.nextFollowUp = new Date(Date.now() + 86400000); // 24 hours
        big5.lastUpdate = new Date();
        this.big5Status.set(inquiryId, big5);
      }
    }
  }

  /**
   * Send automated follow-up email
   */
  private async sendFollowUpEmail(
    inquiry: DDPInquiry,
    big5: Big5CollectionStatus
  ): Promise<void> {
    const missing = this.getMissingBig5Items(big5);

    if (missing.length === 0) return;

    const specialist = depointeStaff.find(
      (s) => s.id === 'freight-specialist-028'
    );
    if (!specialist) return;

    const emailContent = {
      to: inquiry.customerEmail,
      subject: 'Follow-up: Information Needed for Your DDP Quote',
      body: `
        Hi ${inquiry.customerName},

        Just following up on your China → USA DDP shipment quote request.

        I'm still waiting for the following information:

        ${missing.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

        Once I have these details, I can get your quote to you within 2 hours!

        ${
          inquiry.productCategory === 'steel' ||
          inquiry.productCategory === 'metal' ||
          inquiry.productCategory === 'aluminum'
            ? '\n⚠️ Reminder: With 95% tariff on ' +
              inquiry.productCategory +
              ', having an accurate DDP quote is crucial for your budgeting!\n'
            : ''
        }

        Reply to this email or call me if you have any questions.

        Best regards,
        ${specialist.name}
        ${specialist.role}
      `,
    };

    this.logAIAction(inquiry.id, {
      staffId: specialist.id,
      staffName: specialist.name,
      actionType: 'follow_up',
      description: `Automated follow-up sent. Missing: ${missing.join(', ')}`,
      automated: true,
    });

    console.log(`📧 Follow-up email sent to ${inquiry.customerEmail}`);
  }

  /**
   * Check if Big 5 is complete and generate quote
   */
  private async checkForQuoteGeneration(): Promise<void> {
    for (const [inquiryId, inquiry] of this.activeInquiries) {
      const big5 = this.big5Status.get(inquiryId);
      if (!big5) continue;

      // Check if all Big 5 items are collected
      if (
        this.isBig5Complete(big5) &&
        inquiry.status !== 'quoted' &&
        inquiry.status !== 'payment_pending'
      ) {
        await this.generateAutomatedQuote(inquiry, big5);
      }
    }
  }

  /**
   * Generate automated DDP quote
   */
  private async generateAutomatedQuote(
    inquiry: DDPInquiry,
    big5: Big5CollectionStatus
  ): Promise<void> {
    const specialist = depointeStaff.find(
      (s) => s.id === 'freight-specialist-028'
    );
    if (!specialist) return;

    // Calculate quote (simplified - would be more complex in production)
    const baseRate = 3500; // 40HQ base rate
    const containers = inquiry.estimatedContainers || 1;
    const tariffMultiplier =
      inquiry.productCategory === 'steel' ||
      inquiry.productCategory === 'metal' ||
      inquiry.productCategory === 'aluminum'
        ? 1.95
        : 1.15;

    const subtotal = baseRate * containers * tariffMultiplier;
    const total = Math.round(subtotal);

    const quote = {
      subtotal,
      tariff: (tariffMultiplier - 1) * 100 + '%',
      total,
      paymentTerms: 'Prepay required (new customer)',
      validUntil: new Date(Date.now() + 604800000), // 7 days
    };

    // Update status
    const updatedInquiry = { ...inquiry, status: 'quoted' as const };
    this.activeInquiries.set(inquiry.id, updatedInquiry);

    // Log action
    this.logAIAction(inquiry.id, {
      staffId: specialist.id,
      staffName: specialist.name,
      actionType: 'quote_generated',
      description: `Automated quote generated: $${total.toLocaleString()} for ${containers} containers`,
      automated: true,
    });

    // Send quote email
    console.log(
      `✅ Quote auto-generated for ${inquiry.customerName}: $${total.toLocaleString()}`
    );
  }

  /**
   * Monitor payment status and send reminders
   */
  private async monitorPayments(): Promise<void> {
    for (const [inquiryId, inquiry] of this.activeInquiries) {
      if (inquiry.status === 'payment_pending') {
        await this.sendPaymentReminder(inquiry);
      }
    }
  }

  /**
   * Send payment reminder
   */
  private async sendPaymentReminder(inquiry: DDPInquiry): Promise<void> {
    const specialist = depointeStaff.find(
      (s) => s.id === 'freight-specialist-028'
    );
    if (!specialist) return;

    this.logAIAction(inquiry.id, {
      staffId: specialist.id,
      staffName: specialist.name,
      actionType: 'payment_reminder',
      description: 'Automated payment reminder sent',
      automated: true,
    });

    console.log(`💰 Payment reminder sent to ${inquiry.customerEmail}`);
  }

  /**
   * Helper methods
   */
  private isBig5Complete(big5: Big5CollectionStatus): boolean {
    return (
      big5.chinaAddress &&
      big5.usaAddress &&
      big5.productDetails &&
      big5.timing &&
      big5.containerInfo
    );
  }

  private getMissingBig5Items(big5: Big5CollectionStatus): string[] {
    const missing: string[] = [];
    if (!big5.chinaAddress) missing.push('China pickup address');
    if (!big5.usaAddress) missing.push('USA delivery address');
    if (!big5.productDetails)
      missing.push('Product details (HTS code, description, photos)');
    if (!big5.timing) missing.push('Shipment timing');
    if (!big5.containerInfo) missing.push('Container quantity and type');
    return missing;
  }

  private logAIAction(
    inquiryId: string,
    action: Omit<AIStaffAction, 'id' | 'timestamp'>
  ): void {
    const fullAction: AIStaffAction = {
      id: `action-${Date.now()}`,
      ...action,
      timestamp: new Date(),
    };

    const actions = this.aiActions.get(inquiryId) || [];
    actions.push(fullAction);
    this.aiActions.set(inquiryId, actions);
  }

  /**
   * Public methods for UI interaction
   */
  public getActiveInquiries(): DDPInquiry[] {
    this.startAutomation(); // Ensure automation is running
    return Array.from(this.activeInquiries.values());
  }

  public getBig5Status(inquiryId: string): Big5CollectionStatus | undefined {
    return this.big5Status.get(inquiryId);
  }

  public getAIActions(inquiryId: string): AIStaffAction[] {
    return this.aiActions.get(inquiryId) || [];
  }

  public async updateBig5Status(
    inquiryId: string,
    updates: Partial<Big5CollectionStatus>
  ): Promise<void> {
    const current = this.big5Status.get(inquiryId);
    if (!current) return;

    const updated = {
      ...current,
      ...updates,
      lastUpdate: new Date(),
    };

    this.big5Status.set(inquiryId, updated);

    // Check if complete
    if (this.isBig5Complete(updated)) {
      const inquiry = this.activeInquiries.get(inquiryId);
      if (inquiry) {
        inquiry.status = 'ready_for_quote';
        this.activeInquiries.set(inquiryId, inquiry);
        console.log(
          `✅ Big 5 complete for ${inquiry.customerName}! Quote generation triggered.`
        );
      }
    }
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.automationIntervals.forEach((interval) => clearInterval(interval));
    console.log('🛑 DDP Automation Service stopped');
  }
}

// Export singleton
export const ddpAutomationService = new ChinaUSADDPAutomationService();
export default ddpAutomationService;
