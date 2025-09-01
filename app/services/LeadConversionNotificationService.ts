import { contractGenerationService, LeadContractData } from './ContractGenerationService';

export interface LeadSource {
  source:
    | 'fmcsa'
    | 'weather'
    | 'exchange_rate'
    | 'claude_ai'
    | 'twilio'
    | 'thomasnet'
    | 'rfx_automation'
    | 'sam_gov'
    | 'instant_markets';
  sourceLabel: string;
  color: string;
  icon: string;
}

export interface LeadConversion {
  id: string;
  leadId: string;
  source: LeadSource;
  conversionType:
    | 'quote_accepted'
    | 'service_booked'
    | 'contract_signed'
    | 'rfp_won'
    | 'call_converted'
    | 'shipment_requested'
    | 'partnership_formed';
  conversionLabel: string;
  customerName: string;
  customerType:
    | 'shipper'
    | 'broker'
    | 'carrier'
    | '3pl'
    | 'manufacturer'
    | 'retailer';
  potentialValue: number;
  contactInfo: {
    name: string;
    email?: string;
    phone?: string;
    company: string;
  };
  conversionDetails: {
    description: string;
    serviceRequested?: string;
    timeline?: string;
    volume?: string;
    specialRequirements?: string;
  };
  timestamp: string;
  tenantId: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  followUpRequired: boolean;
}

export interface ManagementNotificationPayload {
  type:
    | 'new_shipper'
    | 'new_customer'
    | 'new_broker'
    | 'new_contract'
    | 'new_partner'
    | 'urgent_lead';
  title: string;
  message: string;
  conversion: LeadConversion;
  actions: {
    primary: { label: string; action: string };
    secondary?: { label: string; action: string };
  };
  metadata: {
    revenue_potential: number;
    urgency_score: number;
    follow_up_deadline: string;
  };
}

export class LeadConversionNotificationService {
  private static instance: LeadConversionNotificationService;

  public static getInstance(): LeadConversionNotificationService {
    if (!LeadConversionNotificationService.instance) {
      LeadConversionNotificationService.instance =
        new LeadConversionNotificationService();
    }
    return LeadConversionNotificationService.instance;
  }

  // Lead source configurations
  private leadSources: { [key: string]: LeadSource } = {
    fmcsa: {
      source: 'fmcsa',
      sourceLabel: 'FMCSA Discovery',
      color: '#3b82f6',
      icon: '🚛',
    },
    weather: {
      source: 'weather',
      sourceLabel: 'Weather Intelligence',
      color: '#10b981',
      icon: '🌤️',
    },
    exchange_rate: {
      source: 'exchange_rate',
      sourceLabel: 'Currency Exchange',
      color: '#f59e0b',
      icon: '💱',
    },
    claude_ai: {
      source: 'claude_ai',
      sourceLabel: 'Claude AI Analysis',
      color: '#8b5cf6',
      icon: '🤖',
    },
    twilio: {
      source: 'twilio',
      sourceLabel: 'Call Center Lead',
      color: '#ef4444',
      icon: '📞',
    },
    thomasnet: {
      source: 'thomasnet',
      sourceLabel: 'ThomasNet Manufacturing',
      color: '#06b6d4',
      icon: '🏭',
    },
    rfx_automation: {
      source: 'rfx_automation',
      sourceLabel: 'RFx Automation',
      color: '#14b8a6',
      icon: '📋',
    },
    sam_gov: {
      source: 'sam_gov',
      sourceLabel: 'Government Contracts',
      color: '#dc2626',
      icon: '🏛️',
    },
    instant_markets: {
      source: 'instant_markets',
      sourceLabel: 'InstantMarkets',
      color: '#dc2626',
      icon: '⚡',
    },
  };

  /**
   * Process a lead conversion and trigger management notifications
   */
  async processLeadConversion(conversionData: {
    leadId: string;
    source: string;
    conversionType: string;
    customerName: string;
    customerType: string;
    potentialValue: number;
    contactInfo: any;
    conversionDetails: any;
    tenantId: string;
  }): Promise<{ success: boolean; notificationId?: string; error?: string }> {
    try {
      // Create conversion record
      const conversion = this.createConversionRecord(conversionData);

      // Generate management notification
      const notification = this.generateManagementNotification(conversion);

      // Send to notification hub
      const notificationResult = await this.sendToNotificationHub(notification);

      // Send to management team
      await this.notifyManagementTeam(notification);

          // Log conversion for analytics
    await this.logConversion(conversion);

    // Generate contract for lead conversion (if customer type is shipper)
    if (conversion.customerType === 'shipper') {
      try {
        await this.generateContractForLead(conversion);
      } catch (contractError) {
        console.error('Contract generation failed:', contractError);
        // Don't fail the entire conversion process if contract generation fails
      }
    }

    console.info(`✅ Lead conversion processed: ${conversion.id}`);
    return {
      success: true,
      notificationId: notificationResult.notificationId,
    };
    } catch (error: any) {
      console.error('❌ Lead conversion processing failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create structured conversion record
   */
  private createConversionRecord(data: any): LeadConversion {
    const source = this.leadSources[data.source] || this.leadSources.claude_ai;
    const conversionId = `CONV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Determine conversion label and priority
    const { conversionLabel, priority } = this.getConversionDetails(
      data.conversionType,
      data.potentialValue
    );

    return {
      id: conversionId,
      leadId: data.leadId,
      source,
      conversionType: data.conversionType,
      conversionLabel,
      customerName: data.customerName,
      customerType: data.customerType,
      potentialValue: data.potentialValue,
      contactInfo: data.contactInfo,
      conversionDetails: data.conversionDetails,
      timestamp: new Date().toISOString(),
      tenantId: data.tenantId,
      priority,
      followUpRequired:
        data.potentialValue > 5000 ||
        priority === 'high' ||
        priority === 'urgent',
    };
  }

  /**
   * Get conversion details based on type and value
   */
  private getConversionDetails(
    conversionType: string,
    value: number
  ): {
    conversionLabel: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  } {
    const conversionMap: {
      [key: string]: { label: string; basePriority: 'low' | 'medium' | 'high' };
    } = {
      quote_accepted: { label: 'Quote Accepted', basePriority: 'high' },
      service_booked: { label: 'Service Booked', basePriority: 'high' },
      contract_signed: { label: 'Contract Signed', basePriority: 'high' },
      rfp_won: { label: 'RFP Won', basePriority: 'high' },
      call_converted: { label: 'Call Converted', basePriority: 'medium' },
      shipment_requested: { label: 'Shipment Requested', basePriority: 'high' },
      partnership_formed: { label: 'Partnership Formed', basePriority: 'high' },
    };

    const conversion = conversionMap[conversionType] || {
      label: 'Lead Converted',
      basePriority: 'medium',
    };

    // Upgrade priority based on value
    let priority = conversion.basePriority;
    if (value > 50000) priority = 'urgent';
    else if (value > 20000) priority = 'high';
    else if (value > 5000) priority = 'medium';

    return {
      conversionLabel: conversion.label,
      priority,
    };
  }

  /**
   * Generate management notification payload
   */
  private generateManagementNotification(
    conversion: LeadConversion
  ): ManagementNotificationPayload {
    const notificationTypeMap: { [key: string]: string } = {
      shipper: 'new_shipper',
      broker: 'new_broker',
      carrier: 'new_customer',
      '3pl': 'new_partner',
      manufacturer: 'new_shipper',
      retailer: 'new_shipper',
    };

    const notificationType =
      notificationTypeMap[conversion.customerType] || 'new_customer';

    const title = this.generateNotificationTitle(conversion);
    const message = this.generateNotificationMessage(conversion);

    return {
      type: notificationType as any,
      title,
      message,
      conversion,
      actions: {
        primary: {
          label: 'Review Lead',
          action: `/management-review/leads/${conversion.id}`,
        },
        secondary: {
          label: 'Contact Customer',
          action: `/crm/contacts/new?leadId=${conversion.id}`,
        },
      },
      metadata: {
        revenue_potential: conversion.potentialValue,
        urgency_score: this.calculateUrgencyScore(conversion),
        follow_up_deadline: new Date(
          Date.now() +
            (conversion.priority === 'urgent'
              ? 2
              : conversion.priority === 'high'
                ? 24
                : 72) *
              60 *
              60 *
              1000
        ).toISOString(),
      },
    };
  }

  /**
   * Generate notification title
   */
  private generateNotificationTitle(conversion: LeadConversion): string {
    const customerTypeLabels: { [key: string]: string } = {
      shipper: 'NEW SHIPPER',
      broker: 'NEW BROKER',
      carrier: 'NEW CARRIER',
      '3pl': 'NEW 3PL PARTNER',
      manufacturer: 'NEW MANUFACTURER',
      retailer: 'NEW RETAIL CLIENT',
    };

    const label = customerTypeLabels[conversion.customerType] || 'NEW CUSTOMER';
    return `🚨 ${label} - ${conversion.conversionLabel}`;
  }

  /**
   * Generate notification message
   */
  private generateNotificationMessage(conversion: LeadConversion): string {
    const valueFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(conversion.potentialValue);

    return `${conversion.source.sourceLabel} generated lead converted! ${conversion.customerName} (${conversion.customerType}) ${conversion.conversionLabel.toLowerCase()} with potential value of ${valueFormatted}. ${conversion.followUpRequired ? 'Immediate follow-up required.' : 'Follow-up recommended within 48 hours.'}`;
  }

  /**
   * Calculate urgency score (0-100)
   */
  private calculateUrgencyScore(conversion: LeadConversion): number {
    let score = 50; // Base score

    // Value impact
    if (conversion.potentialValue > 100000) score += 30;
    else if (conversion.potentialValue > 50000) score += 20;
    else if (conversion.potentialValue > 20000) score += 15;
    else if (conversion.potentialValue > 10000) score += 10;

    // Priority impact
    if (conversion.priority === 'urgent') score += 20;
    else if (conversion.priority === 'high') score += 15;
    else if (conversion.priority === 'medium') score += 5;

    // Source impact (some sources are more valuable)
    const highValueSources = ['sam_gov', 'rfx_automation', 'thomasnet'];
    if (highValueSources.includes(conversion.source.source)) score += 10;

    // Customer type impact
    const highValueCustomers = ['shipper', 'manufacturer', '3pl'];
    if (highValueCustomers.includes(conversion.customerType)) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Send notification to the notification hub
   */
  private async sendToNotificationHub(
    notification: ManagementNotificationPayload
  ): Promise<{ success: boolean; notificationId: string }> {
    try {
      // Create notification for the hub
      const hubNotification = {
        id: `NOTIF-${Date.now()}`,
        type: 'system',
        category: 'lead_conversion',
        title: notification.title,
        message: notification.message,
        timestamp: new Date().toISOString(),
        priority: notification.conversion.priority,
        read: false,
        tenantId: notification.conversion.tenantId,
        metadata: {
          leadId: notification.conversion.id,
          source: notification.conversion.source.source,
          customerName: notification.conversion.customerName,
          potentialValue: notification.conversion.potentialValue,
          actions: notification.actions,
        },
      };

      // In a real implementation, this would save to database
      console.info('📨 Sending to notification hub:', hubNotification);

      return {
        success: true,
        notificationId: hubNotification.id,
      };
    } catch (error: any) {
      console.error('Failed to send to notification hub:', error);
      throw error;
    }
  }

  /**
   * Notify management team via multiple channels
   */
  private async notifyManagementTeam(
    notification: ManagementNotificationPayload
  ): Promise<void> {
    try {
      // 1. In-app notification (highest priority)
      await this.sendInAppNotification(notification);

      // 2. Email notification for high-value leads
      if (notification.conversion.potentialValue > 10000) {
        await this.sendEmailNotification(notification);
      }

      // 3. SMS for urgent leads
      if (notification.conversion.priority === 'urgent') {
        await this.sendSMSNotification(notification);
      }

      console.info(
        `✅ Management team notified for conversion: ${notification.conversion.id}`
      );
    } catch (error: any) {
      console.error('Failed to notify management team:', error);
      throw error;
    }
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(
    notification: ManagementNotificationPayload
  ): Promise<void> {
    // This would integrate with your existing notification system
    console.info('📱 In-app notification sent:', notification.title);
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    notification: ManagementNotificationPayload
  ): Promise<void> {
    // This would integrate with your email service
    console.info('📧 Email notification sent:', notification.title);
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(
    notification: ManagementNotificationPayload
  ): Promise<void> {
    // This would integrate with your SMS service
    console.info('📱 SMS notification sent:', notification.title);
  }

  /**
   * Log conversion for analytics
   */
  private async logConversion(conversion: LeadConversion): Promise<void> {
    try {
      // In a real implementation, this would save to analytics database
      console.info('📊 Conversion logged for analytics:', {
        conversionId: conversion.id,
        source: conversion.source.source,
        value: conversion.potentialValue,
        customerType: conversion.customerType,
        timestamp: conversion.timestamp,
      });
    } catch (error: any) {
      console.error('Failed to log conversion:', error);
      // Don't throw - analytics logging shouldn't break the main flow
    }
  }

  /**
   * Generate contract for lead conversion
   */
  private async generateContractForLead(conversion: LeadConversion): Promise<void> {
    try {
      console.info(`📄 Generating contract for lead conversion: ${conversion.id}`);

      // Prepare contract data
      const contractData: LeadContractData = {
        leadId: conversion.leadId,
        brokerId: conversion.assignedTo || 'broker-default',
        brokerName: conversion.contactInfo.name || 'Broker Name',
        brokerCompany: conversion.contactInfo.company || 'Broker Company',
        shipperId: `shipper-${conversion.leadId}`,
        shipperName: conversion.customerName,
        shipperCompany: conversion.contactInfo.company || conversion.customerName,
        source: conversion.source.source,
        potentialValue: conversion.potentialValue,
        conversionType: conversion.conversionType,
        tenantId: conversion.tenantId,
        contractTerms: {
          commissionRate: 5.0,
          paymentTerms: 'Net 15 days',
          contractDuration: '1 year with auto-renewal',
          exclusivity: false,
          territory: 'United States'
        }
      };

      // Generate contract
      const contract = await contractGenerationService.generateLeadContract(contractData);

      console.info(`✅ Contract generated for lead: ${contract.contractId}`);

      // Update conversion record with contract ID
      await this.updateConversionWithContract(conversion.id, contract.contractId);

    } catch (error: any) {
      console.error('❌ Contract generation failed:', error);
      throw error;
    }
  }

  /**
   * Update conversion record with contract ID
   */
  private async updateConversionWithContract(conversionId: string, contractId: string): Promise<void> {
    try {
      // In a real implementation, this would update the conversion record in the database
      console.info(`📝 Updated conversion ${conversionId} with contract ${contractId}`);
    } catch (error: any) {
      console.error('Failed to update conversion with contract ID:', error);
    }
  }

  /**
   * Quick helper methods for common conversion scenarios
   */

  async processQuoteAccepted(quoteData: {
    leadId: string;
    customerName: string;
    quoteValue: number;
    contactInfo: any;
    tenantId: string;
    source?: string;
  }) {
    return this.processLeadConversion({
      leadId: quoteData.leadId,
      source: quoteData.source || 'claude_ai',
      conversionType: 'quote_accepted',
      customerName: quoteData.customerName,
      customerType: 'shipper',
      potentialValue: quoteData.quoteValue,
      contactInfo: quoteData.contactInfo,
      conversionDetails: {
        description: `Quote accepted for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quoteData.quoteValue)}`,
        serviceRequested: 'Transportation Services',
        timeline: 'Immediate',
      },
      tenantId: quoteData.tenantId,
    });
  }

  async processServiceBooked(serviceData: {
    leadId: string;
    customerName: string;
    serviceValue: number;
    serviceType: string;
    contactInfo: any;
    tenantId: string;
    source?: string;
  }) {
    return this.processLeadConversion({
      leadId: serviceData.leadId,
      source: serviceData.source || 'twilio',
      conversionType: 'service_booked',
      customerName: serviceData.customerName,
      customerType: 'shipper',
      potentialValue: serviceData.serviceValue,
      contactInfo: serviceData.contactInfo,
      conversionDetails: {
        description: `${serviceData.serviceType} service booked`,
        serviceRequested: serviceData.serviceType,
        timeline: 'To be scheduled',
      },
      tenantId: serviceData.tenantId,
    });
  }

  async processRFPWon(rfpData: {
    leadId: string;
    customerName: string;
    contractValue: number;
    contactInfo: any;
    tenantId: string;
    source?: string;
  }) {
    return this.processLeadConversion({
      leadId: rfpData.leadId,
      source: rfpData.source || 'rfx_automation',
      conversionType: 'rfp_won',
      customerName: rfpData.customerName,
      customerType: 'shipper',
      potentialValue: rfpData.contractValue,
      contactInfo: rfpData.contactInfo,
      conversionDetails: {
        description: `RFP won with contract value of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rfpData.contractValue)}`,
        serviceRequested: 'Contract Transportation Services',
        timeline: 'Contract execution pending',
      },
      tenantId: rfpData.tenantId,
    });
  }
}

// Export singleton instance
export const leadConversionService =
  LeadConversionNotificationService.getInstance();
