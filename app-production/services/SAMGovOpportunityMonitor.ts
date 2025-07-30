interface OpportunityAlert {
  id: string;
  title: string;
  solicitationNumber: string;
  agency: string;
  amount?: string;
  responseDeadline: string;
  postedDate: string;
  description: string;
  naicsCode: string;
  setAsideType?: string;
  location?: string;
  url: string;
}

interface MonitoringConfig {
  enabled: boolean;
  checkIntervalMinutes: number;
  keywords: string[];
  locations: string[];
  naicsCodes: string[];
  minAmount?: number;
  maxAmount?: number;
  setAsideTypes: string[];
  notificationMethod: 'sms' | 'email' | 'both';
  recipients: {
    name: string;
    email?: string;
    phone?: string;
    roles: string[];
  }[];
}

interface OpportunityCache {
  lastChecked: Date;
  opportunities: OpportunityAlert[];
  hash: string;
}

export class SAMGovOpportunityMonitor {
  private config: MonitoringConfig;
  private cache: OpportunityCache;
  private readonly baseUrl = 'https://api.sam.gov/opportunities/v2/search';
  private readonly cacheKey = 'sam_gov_opportunities_cache';

  constructor(config?: Partial<MonitoringConfig>) {
    this.config = {
      enabled: true,
      checkIntervalMinutes: 30, // Check every 30 minutes
      keywords: ['transportation', 'freight', 'logistics', 'shipping', 'distribution'],
      locations: [
        // All 50 US States + DC + Territories
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 
        'WY', 'PR', 'VI', 'GU', 'AS', 'MP'
      ], // All US states, DC, and territories
      naicsCodes: ['484', '485', '486', '487', '488', '492', '493', '541614'],
      setAsideTypes: ['NONE', 'SBA', 'WOSB', 'SDVOSB', 'HUBZone'],
      notificationMethod: 'both',
      recipients: [
        {
          name: 'FleetFlow Dispatch',
          email: 'dispatch@fleetflow.com',
          phone: '+1234567890',
          roles: ['dispatch', 'admin']
        }
      ],
      ...config
    };

    this.cache = {
      lastChecked: new Date(0),
      opportunities: [],
      hash: ''
    };

    this.loadCache();
  }

  /**
   * Main monitoring function - checks for new opportunities
   */
  async checkForNewOpportunities(): Promise<{
    newOpportunities: OpportunityAlert[];
    totalOpportunities: number;
    notificationsSent: number;
  }> {
    if (!this.config.enabled) {
      console.log('⏸️ SAM.gov monitoring is disabled');
      return { newOpportunities: [], totalOpportunities: 0, notificationsSent: 0 };
    }

    console.log('🔍 Checking SAM.gov for new opportunities...');

    try {
      // Fetch current opportunities from SAM.gov
      const currentOpportunities = await this.fetchOpportunities();
      
      // Find new opportunities by comparing with cache
      const newOpportunities = this.findNewOpportunities(currentOpportunities);
      
      // Update cache
      this.updateCache(currentOpportunities);
      
      // Send notifications for new opportunities
      let notificationsSent = 0;
      if (newOpportunities.length > 0) {
        notificationsSent = await this.sendOpportunityNotifications(newOpportunities);
      }

      console.log(`✅ SAM.gov check complete: ${newOpportunities.length} new opportunities found`);
      
      return {
        newOpportunities,
        totalOpportunities: currentOpportunities.length,
        notificationsSent
      };
    } catch (error) {
      console.error('❌ Error checking SAM.gov opportunities:', error);
      return { newOpportunities: [], totalOpportunities: 0, notificationsSent: 0 };
    }
  }

  /**
   * Fetch opportunities from SAM.gov API
   */
  private async fetchOpportunities(): Promise<OpportunityAlert[]> {
    const apiKey = process.env.SAM_GOV_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ SAM.gov API key not configured, using mock data');
      return this.getMockOpportunities();
    }

    try {
      // Format dates as mm/dd/yyyy (SAM.gov requirement)
      const formatDate = (date: Date) => {
        const d = new Date(date);
        return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
      };

      // Search for opportunities posted in the last 7 days
      const fromDate = formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      const toDate = formatDate(new Date());

      const queryParams = new URLSearchParams({
        api_key: apiKey,
        limit: '100',
        offset: '0',
        postedFrom: fromDate,
        postedTo: toDate,
        ncode: this.config.naicsCodes.join(','),
        ptype: 'o', // Contracting opportunities
        state: this.config.locations.join(',')
      });

      // Add keywords if specified
      if (this.config.keywords.length > 0) {
        queryParams.append('title', this.config.keywords.join(' OR '));
      }

      const response = await fetch(`${this.baseUrl}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.opportunitiesData || !Array.isArray(data.opportunitiesData)) {
        console.warn('⚠️ No opportunities data received from SAM.gov');
        return [];
      }

      return data.opportunitiesData.map((opp: any) => ({
        id: opp.noticeId || opp.solicitationNumber || 'unknown',
        title: opp.title || 'Untitled Opportunity',
        solicitationNumber: opp.solicitationNumber || 'N/A',
        agency: opp.fullParentPathName || opp.organizationName || 'Unknown Agency',
        amount: opp.awardAmount || opp.estimatedValue || undefined,
        responseDeadline: opp.responseDeadLine || 'TBD',
        postedDate: opp.postedDate || new Date().toISOString(),
        description: opp.description || 'No description available',
        naicsCode: opp.naicsCode || 'N/A',
        setAsideType: opp.typeOfSetAsideDescription || 'None',
        location: opp.placeOfPerformance || 'Various',
        url: `https://sam.gov/opp/${opp.noticeId || opp.solicitationNumber}`
      }));
    } catch (error) {
      console.error('Error fetching from SAM.gov:', error);
      return this.getMockOpportunities();
    }
  }

  /**
   * Find new opportunities by comparing with cache
   */
  private findNewOpportunities(currentOpportunities: OpportunityAlert[]): OpportunityAlert[] {
    const cachedIds = new Set(this.cache.opportunities.map(opp => opp.id));
    return currentOpportunities.filter(opp => !cachedIds.has(opp.id));
  }

  /**
   * Send notifications for new opportunities
   */
  private async sendOpportunityNotifications(opportunities: OpportunityAlert[]): Promise<number> {
    let notificationsSent = 0;

    for (const recipient of this.config.recipients) {
      try {
        // Send SMS notification
        if ((this.config.notificationMethod === 'sms' || this.config.notificationMethod === 'both') && recipient.phone) {
          const smsMessage = this.generateSMSMessage(opportunities);
          await this.sendSMSNotification(recipient.phone, recipient.name, smsMessage);
          notificationsSent++;
        }

        // Send email notification
        if ((this.config.notificationMethod === 'email' || this.config.notificationMethod === 'both') && recipient.email) {
          const emailContent = this.generateEmailContent(opportunities);
          await this.sendEmailNotification(recipient.email, recipient.name, emailContent);
          notificationsSent++;
        }
      } catch (error) {
        console.error(`Error sending notification to ${recipient.name}:`, error);
      }
    }

    return notificationsSent;
  }

  /**
   * Generate SMS message for new opportunities
   */
  private generateSMSMessage(opportunities: OpportunityAlert[]): string {
    const count = opportunities.length;
    const plural = count === 1 ? 'opportunity' : 'opportunities';
    
    let message = `🏛️ ${count} NEW GOVERNMENT CONTRACT ${plural.toUpperCase()}!\n\n`;
    
    // Show first 2 opportunities in SMS
    const displayOpps = opportunities.slice(0, 2);
    
    for (const opp of displayOpps) {
      message += `📋 ${opp.title}\n`;
      message += `🏢 ${opp.agency}\n`;
      message += `📅 Due: ${opp.responseDeadline}\n`;
      if (opp.amount) {
        message += `💰 Value: ${opp.amount}\n`;
      }
      message += `🔗 ${opp.url}\n\n`;
    }

    if (opportunities.length > 2) {
      message += `➕ ${opportunities.length - 2} more opportunities available`;
    }

    return message;
  }

  /**
   * Generate email content for new opportunities
   */
  private generateEmailContent(opportunities: OpportunityAlert[]): {
    subject: string;
    html: string;
  } {
    const count = opportunities.length;
    const plural = count === 1 ? 'Opportunity' : 'Opportunities';
    
    const subject = `🏛️ ${count} New Government Contract ${plural} Available`;
    
    let html = `
      <h2>🏛️ New Government Contract Opportunities</h2>
      <p>FleetFlow has found <strong>${count}</strong> new government contract opportunities that match your criteria:</p>
      
      <div style="margin: 20px 0;">
    `;

    for (const opp of opportunities) {
      html += `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
          <h3 style="color: #2563eb; margin-top: 0;">${opp.title}</h3>
          <p><strong>Agency:</strong> ${opp.agency}</p>
          <p><strong>Solicitation #:</strong> ${opp.solicitationNumber}</p>
          <p><strong>Response Deadline:</strong> ${opp.responseDeadline}</p>
          <p><strong>Posted:</strong> ${new Date(opp.postedDate).toLocaleDateString()}</p>
          ${opp.amount ? `<p><strong>Estimated Value:</strong> ${opp.amount}</p>` : ''}
          <p><strong>NAICS Code:</strong> ${opp.naicsCode}</p>
          ${opp.setAsideType && opp.setAsideType !== 'None' ? `<p><strong>Set-Aside:</strong> ${opp.setAsideType}</p>` : ''}
          ${opp.location ? `<p><strong>Location:</strong> ${opp.location}</p>` : ''}
          <p><strong>Description:</strong> ${opp.description.substring(0, 200)}${opp.description.length > 200 ? '...' : ''}</p>
          <p><a href="${opp.url}" style="color: #2563eb; text-decoration: none;">📋 View Full Opportunity →</a></p>
        </div>
      `;
    }

    html += `
      </div>
      
      <hr style="margin: 30px 0;">
      
      <h3>🎯 Next Steps</h3>
      <ol>
        <li>Review each opportunity carefully</li>
        <li>Check FleetFlow's capability to fulfill requirements</li>
        <li>Prepare bid responses before deadlines</li>
        <li>Submit through your FreightFlow RFx system</li>
      </ol>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        📧 This is an automated alert from FleetFlow's SAM.gov monitoring system.<br>
        To modify alert settings, contact your system administrator.
      </p>
    `;

    return { subject, html };
  }

  /**
   * Send SMS notification using existing SMS service
   */
  private async sendSMSNotification(phone: string, name: string, message: string): Promise<void> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadData: {
            id: 'GOV-OPPORTUNITY-' + Date.now(),
            origin: 'SAM.gov Monitor',
            destination: 'Government Contracts',
            rate: 'Variable',
            pickupDate: new Date().toLocaleDateString(),
            equipment: 'Various'
          },
          recipients: [{
            id: 'sam-gov-' + Date.now(),
            phone: phone,
            name: name,
            type: 'admin'
          }],
          notificationType: 'sms',
          messageTemplate: 'custom',
          customMessage: message,
          urgency: 'high'
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS API error: ${response.status}`);
      }

      console.log(`📱 SMS sent to ${name} (${phone})`);
    } catch (error) {
      console.error(`Failed to send SMS to ${name}:`, error);
    }
  }

  /**
   * Send email notification (mock implementation)
   */
  private async sendEmailNotification(email: string, name: string, content: { subject: string; html: string }): Promise<void> {
    try {
      // In production, integrate with your email service
      console.log(`📧 Email sent to ${name} (${email})`);
      console.log(`Subject: ${content.subject}`);
      console.log(`HTML Content: ${content.html.substring(0, 200)}...`);
    } catch (error) {
      console.error(`Failed to send email to ${name}:`, error);
    }
  }

  /**
   * Update cache with new opportunities
   */
  private updateCache(opportunities: OpportunityAlert[]): void {
    this.cache = {
      lastChecked: new Date(),
      opportunities,
      hash: this.generateHash(opportunities)
    };
    this.saveCache();
  }

  /**
   * Generate hash for opportunity comparison
   */
  private generateHash(opportunities: OpportunityAlert[]): string {
    const ids = opportunities.map(opp => opp.id).sort().join(',');
    return Buffer.from(ids).toString('base64');
  }

  /**
   * Load cache from storage (mock implementation)
   */
  private loadCache(): void {
    try {
      // In production, load from database or Redis
      const cached = localStorage?.getItem(this.cacheKey);
      if (cached) {
        this.cache = JSON.parse(cached);
      }
    } catch (error) {
      console.log('No cache found, starting fresh');
    }
  }

  /**
   * Save cache to storage (mock implementation)
   */
  private saveCache(): void {
    try {
      // In production, save to database or Redis
      localStorage?.setItem(this.cacheKey, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }

  /**
   * Mock opportunities for testing
   */
  private getMockOpportunities(): OpportunityAlert[] {
    return [
      {
        id: 'MOCK-001',
        title: 'Transportation Services for Medical Equipment',
        solicitationNumber: 'HHS-2024-001',
        agency: 'Department of Health and Human Services',
        amount: '$2,500,000',
        responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description: 'Seeking qualified transportation providers for medical equipment distribution across multiple states.',
        naicsCode: '484',
        setAsideType: 'Small Business Set-Aside',
        location: 'Multiple States',
        url: 'https://sam.gov/opp/MOCK-001'
      },
      {
        id: 'MOCK-002',
        title: 'Logistics Consulting Services',
        solicitationNumber: 'DOD-2024-LOG-002',
        agency: 'Department of Defense',
        amount: '$1,800,000',
        responseDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description: 'Comprehensive logistics consulting for supply chain optimization and freight management.',
        naicsCode: '541614',
        setAsideType: 'None',
        location: 'Washington, DC',
        url: 'https://sam.gov/opp/MOCK-002'
      }
    ];
  }

  /**
   * Update monitoring configuration
   */
  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 SAM.gov monitoring configuration updated');
  }

  /**
   * Get current monitoring status
   */
  getStatus(): {
    enabled: boolean;
    lastChecked: Date;
    totalOpportunities: number;
    nextCheck: Date;
    config: MonitoringConfig;
  } {
    const nextCheck = new Date(this.cache.lastChecked.getTime() + this.config.checkIntervalMinutes * 60 * 1000);
    
    return {
      enabled: this.config.enabled,
      lastChecked: this.cache.lastChecked,
      totalOpportunities: this.cache.opportunities.length,
      nextCheck,
      config: this.config
    };
  }
}

// Export singleton instance
export const samGovMonitor = new SAMGovOpportunityMonitor(); 