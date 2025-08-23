import UniversalRFxNotificationService, {
  RFxOpportunity,
} from './UniversalRFxNotificationService';

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
  noticeType:
    | 'Solicitation'
    | 'Sources Sought'
    | 'Special Notice'
    | 'Intent to Bundle'
    | 'Other';
  stage:
    | 'Pre-Solicitation'
    | 'Active Solicitation'
    | 'Amendment'
    | 'Award'
    | 'Cancelled';
  daysUntilDeadline?: number;
  isPreSolicitation: boolean;
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
  private notificationService: UniversalRFxNotificationService;

  constructor(config?: Partial<MonitoringConfig>) {
    this.notificationService = new UniversalRFxNotificationService();

    this.config = {
      enabled: true,
      checkIntervalMinutes: 30, // Check every 30 minutes
      keywords: [
        'transportation',
        'freight',
        'logistics',
        'shipping',
        'distribution',
      ],
      locations: [
        // All 50 US States + DC + Territories
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
        'PR',
        'VI',
        'GU',
        'AS',
        'MP',
      ], // All US states, DC, and territories
      naicsCodes: ['484', '485', '486', '487', '488', '492', '493', '541614'],
      setAsideTypes: ['NONE', 'SBA', 'WOSB', 'SDVOSB', 'HUBZone'],
      notificationMethod: 'both',
      recipients: [
        {
          name: 'FleetFlow Dispatch',
          email: 'dispatch@fleetflow.com',
          phone: '+1234567890',
          roles: ['dispatch', 'admin'],
        },
      ],
      ...config,
    };

    this.cache = {
      lastChecked: new Date(0),
      opportunities: [],
      hash: '',
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
      return {
        newOpportunities: [],
        totalOpportunities: 0,
        notificationsSent: 0,
      };
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
        notificationsSent =
          await this.sendOpportunityNotifications(newOpportunities);
      }

      console.log(
        `✅ SAM.gov check complete: ${newOpportunities.length} new opportunities found`
      );

      return {
        newOpportunities,
        totalOpportunities: currentOpportunities.length,
        notificationsSent,
      };
    } catch (error) {
      console.error('❌ Error checking SAM.gov opportunities:', error);
      return {
        newOpportunities: [],
        totalOpportunities: 0,
        notificationsSent: 0,
      };
    }
  }

  /**
   * Fetch opportunities from SAM.gov API
   */
  private async fetchOpportunities(): Promise<OpportunityAlert[]> {
    const apiKey = process.env.SAMGOV_API_KEY;
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
      const fromDate = formatDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const toDate = formatDate(new Date());

      const queryParams = new URLSearchParams({
        format: 'json',
        limit: '100',
        offset: '0',
        postedFrom: fromDate,
        postedTo: toDate,
        ncode: this.config.naicsCodes.join(','),
        ptype: 'o,r,s,k', // Enhanced: o=opportunities, r=sources sought, s=special notices, k=combined synopsis/solicitation
        state: this.config.locations.join(','),
      });

      // Add keywords if specified
      if (this.config.keywords.length > 0) {
        queryParams.append('title', this.config.keywords.join(' OR '));
      }

      const response = await fetch(`${this.baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error(
          `SAM.gov API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.opportunitiesData || !Array.isArray(data.opportunitiesData)) {
        console.warn('⚠️ No opportunities data received from SAM.gov');
        return [];
      }

      return data.opportunitiesData.map((opp: any) => {
        // Determine notice type based on SAM.gov data
        const getNoticeType = (
          oppData: any
        ): OpportunityAlert['noticeType'] => {
          const type = oppData.type || oppData.noticeType || '';
          if (
            type.toLowerCase().includes('sources sought') ||
            type.toLowerCase().includes('market research')
          ) {
            return 'Sources Sought';
          } else if (type.toLowerCase().includes('special notice')) {
            return 'Special Notice';
          } else if (type.toLowerCase().includes('intent to bundle')) {
            return 'Intent to Bundle';
          } else if (
            type.toLowerCase().includes('solicitation') ||
            type.toLowerCase().includes('rfp') ||
            type.toLowerCase().includes('rfq')
          ) {
            return 'Solicitation';
          }
          return 'Other';
        };

        // Determine stage based on notice type and dates
        const getStage = (
          oppData: any,
          noticeType: string
        ): OpportunityAlert['stage'] => {
          if (
            noticeType === 'Sources Sought' ||
            noticeType === 'Special Notice'
          ) {
            return 'Pre-Solicitation';
          } else if (oppData.awardDate) {
            return 'Award';
          } else if (oppData.cancelled) {
            return 'Cancelled';
          } else if (oppData.amendmentNumber) {
            return 'Amendment';
          }
          return 'Active Solicitation';
        };

        // Calculate days until deadline
        const calculateDaysUntilDeadline = (
          deadline: string
        ): number | undefined => {
          if (!deadline || deadline === 'TBD') return undefined;
          try {
            const deadlineDate = new Date(deadline);
            const today = new Date();
            const diffTime = deadlineDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
          } catch {
            return undefined;
          }
        };

        const noticeType = getNoticeType(opp);
        const stage = getStage(opp, noticeType);
        const daysUntilDeadline = calculateDaysUntilDeadline(
          opp.responseDeadLine
        );

        return {
          id: opp.noticeId || opp.solicitationNumber || 'unknown',
          title: opp.title || 'Untitled Opportunity',
          solicitationNumber: opp.solicitationNumber || 'N/A',
          agency:
            opp.fullParentPathName || opp.organizationName || 'Unknown Agency',
          amount: opp.awardAmount || opp.estimatedValue || undefined,
          responseDeadline: opp.responseDeadLine || 'TBD',
          postedDate: opp.postedDate || new Date().toISOString(),
          description: opp.description || 'No description available',
          naicsCode: opp.naicsCode || 'N/A',
          setAsideType: opp.typeOfSetAsideDescription || 'None',
          location: opp.placeOfPerformance || 'Various',
          url: `https://sam.gov/opp/${opp.noticeId || opp.solicitationNumber}`,
          noticeType,
          stage,
          daysUntilDeadline,
          isPreSolicitation:
            noticeType === 'Sources Sought' ||
            noticeType === 'Special Notice' ||
            stage === 'Pre-Solicitation',
        };
      });
    } catch (error) {
      console.error('Error fetching from SAM.gov:', error);
      return this.getMockOpportunities();
    }
  }

  /**
   * Find new opportunities by comparing with cache
   */
  private findNewOpportunities(
    currentOpportunities: OpportunityAlert[]
  ): OpportunityAlert[] {
    const cachedIds = new Set(this.cache.opportunities.map((opp) => opp.id));
    return currentOpportunities.filter((opp) => !cachedIds.has(opp.id));
  }

  /**
   * Send notifications for new opportunities using Universal RFx Notification Service
   */
  private async sendOpportunityNotifications(
    opportunities: OpportunityAlert[]
  ): Promise<number> {
    try {
      // Convert OpportunityAlert to RFxOpportunity format
      const rfxOpportunities: RFxOpportunity[] = opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        agency: opp.agency,
        amount: opp.amount,
        responseDeadline: opp.responseDeadline,
        postedDate: opp.postedDate,
        description: opp.description,
        location: opp.location,
        url: opp.url,
        opportunityType: 'Government' as const,
        priority: this.determineOpportunityPriority(opp),
        estimatedValue: this.parseEstimatedValue(opp.amount),
        daysUntilDeadline: opp.daysUntilDeadline,
        isPreSolicitation: opp.isPreSolicitation,
        noticeType: opp.noticeType,
        keywords: this.extractKeywords(opp.title + ' ' + opp.description),
        naicsCode: opp.naicsCode,
        setAsideType: opp.setAsideType,
      }));

      // Send notifications for each configured recipient
      let totalNotificationsSent = 0;
      for (const recipient of this.config.recipients) {
        // Use a default userId (in production, map recipients to actual user IDs)
        const userId = `sam-gov-recipient-${recipient.name.toLowerCase().replace(/\s+/g, '-')}`;

        await this.notificationService.processOpportunityAlerts(
          rfxOpportunities,
          userId
        );
        totalNotificationsSent++;
      }

      console.log(
        `📨 Universal notifications sent for ${opportunities.length} opportunities to ${this.config.recipients.length} recipients`
      );
      return totalNotificationsSent;
    } catch (error) {
      console.error('Error sending universal RFx notifications:', error);
      return 0;
    }
  }

  /**
   * Determine opportunity priority based on characteristics
   */
  private determineOpportunityPriority(
    opp: OpportunityAlert
  ): 'High' | 'Medium' | 'Low' {
    const estimatedValue = this.parseEstimatedValue(opp.amount);

    // High priority criteria
    if (
      (estimatedValue && estimatedValue >= 5000000) || // $5M+
      (opp.daysUntilDeadline && opp.daysUntilDeadline <= 7) || // Due within 7 days
      opp.setAsideType?.includes('Small Business') ||
      opp.isPreSolicitation // Sources Sought are high priority for early positioning
    ) {
      return 'High';
    }

    // Medium priority criteria
    if (
      (estimatedValue && estimatedValue >= 1000000) || // $1M+
      (opp.daysUntilDeadline && opp.daysUntilDeadline <= 14) // Due within 14 days
    ) {
      return 'Medium';
    }

    return 'Low';
  }

  /**
   * Parse estimated value from amount string
   */
  private parseEstimatedValue(amount?: string): number | undefined {
    if (!amount) return undefined;

    // Extract numbers from strings like "$2,500,000" or "Estimated $5,000,000 - $8,000,000"
    const matches = amount.match(/\$?([\d,]+)/g);
    if (!matches) return undefined;

    // Use the highest value if range is provided
    const values = matches
      .map((match) => {
        const cleaned = match.replace(/[$,]/g, '');
        return parseInt(cleaned, 10);
      })
      .filter((val) => !isNaN(val));

    return values.length > 0 ? Math.max(...values) : undefined;
  }

  /**
   * Extract keywords from title and description
   */
  private extractKeywords(text: string): string[] {
    const commonKeywords = [
      'transportation',
      'freight',
      'logistics',
      'shipping',
      'distribution',
      'trucking',
      'delivery',
      'warehousing',
      'supply chain',
      'cargo',
      'equipment',
      'medical',
      'emergency',
      'heavy haul',
      'oversized',
    ];

    const lowercaseText = text.toLowerCase();
    return commonKeywords.filter((keyword) => lowercaseText.includes(keyword));
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
  private async sendSMSNotification(
    phone: string,
    name: string,
    message: string
  ): Promise<void> {
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
            equipment: 'Various',
          },
          recipients: [
            {
              id: 'sam-gov-' + Date.now(),
              phone: phone,
              name: name,
              type: 'admin',
            },
          ],
          notificationType: 'sms',
          messageTemplate: 'custom',
          customMessage: message,
          urgency: 'high',
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
  private async sendEmailNotification(
    email: string,
    name: string,
    content: { subject: string; html: string }
  ): Promise<void> {
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
      hash: this.generateHash(opportunities),
    };
    this.saveCache();
  }

  /**
   * Generate hash for opportunity comparison
   */
  private generateHash(opportunities: OpportunityAlert[]): string {
    const ids = opportunities
      .map((opp) => opp.id)
      .sort()
      .join(',');
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
      // Active Solicitations
      {
        id: 'MOCK-001',
        title: 'Transportation Services for Medical Equipment',
        solicitationNumber: 'HHS-2024-001',
        agency: 'Department of Health and Human Services',
        amount: '$2,500,000',
        responseDeadline: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description:
          'Seeking qualified transportation providers for medical equipment distribution across multiple states.',
        naicsCode: '484',
        setAsideType: 'Small Business Set-Aside',
        location: 'Multiple States',
        url: 'https://sam.gov/opp/MOCK-001',
        noticeType: 'Solicitation',
        stage: 'Active Solicitation',
        daysUntilDeadline: 14,
        isPreSolicitation: false,
      },
      {
        id: 'MOCK-002',
        title: 'Logistics Consulting Services',
        solicitationNumber: 'DOD-2024-LOG-002',
        agency: 'Department of Defense',
        amount: '$1,800,000',
        responseDeadline: new Date(
          Date.now() + 21 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description:
          'Comprehensive logistics consulting for supply chain optimization and freight management.',
        naicsCode: '541614',
        setAsideType: 'None',
        location: 'Washington, DC',
        url: 'https://sam.gov/opp/MOCK-002',
        noticeType: 'Solicitation',
        stage: 'Active Solicitation',
        daysUntilDeadline: 21,
        isPreSolicitation: false,
      },

      // Sources Sought Notices - Early Intelligence
      {
        id: 'SOURCES-001',
        title: 'Sources Sought: Multi-State Freight Transportation Network',
        solicitationNumber: 'GSA-SS-2024-003',
        agency: 'General Services Administration',
        amount: 'Estimated $5,000,000 - $8,000,000',
        responseDeadline: new Date(
          Date.now() + 45 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description:
          'GSA is conducting market research for transportation services to support federal agencies across 12 states. Seeking information on carrier capabilities, pricing models, and technology solutions. RFP expected to be released in 60-90 days.',
        naicsCode: '484121',
        setAsideType: 'Open to All',
        location: 'Multi-State (Northeast Corridor)',
        url: 'https://sam.gov/opp/SOURCES-001',
        noticeType: 'Sources Sought',
        stage: 'Pre-Solicitation',
        daysUntilDeadline: 45,
        isPreSolicitation: true,
      },
      {
        id: 'SOURCES-002',
        title: 'Sources Sought: Heavy Equipment Transportation Services',
        solicitationNumber: 'ARMY-SS-2024-005',
        agency: 'U.S. Army Corps of Engineers',
        amount: 'Estimated $3,200,000 annually',
        responseDeadline: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description:
          'Market research for specialized heavy equipment transportation including oversized loads, military vehicles, and construction equipment. Seeking carriers with heavy haul capabilities and security clearances.',
        naicsCode: '484220',
        setAsideType: 'Small Business Set-Aside',
        location: 'Multiple Military Installations',
        url: 'https://sam.gov/opp/SOURCES-002',
        noticeType: 'Sources Sought',
        stage: 'Pre-Solicitation',
        daysUntilDeadline: 30,
        isPreSolicitation: true,
      },
      {
        id: 'SOURCES-003',
        title: 'Sources Sought: Emergency Response Transportation Services',
        solicitationNumber: 'FEMA-SS-2024-007',
        agency: 'Federal Emergency Management Agency (FEMA)',
        amount: 'Estimated $2,500,000 - $4,000,000',
        responseDeadline: new Date(
          Date.now() + 35 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description:
          'FEMA seeks information on transportation providers capable of emergency response logistics, including rapid deployment, 24/7 operations, and disaster relief supply chain management.',
        naicsCode: '484110',
        setAsideType: 'SDVOSB Set-Aside',
        location: 'Nationwide (Emergency Response)',
        url: 'https://sam.gov/opp/SOURCES-003',
        noticeType: 'Sources Sought',
        stage: 'Pre-Solicitation',
        daysUntilDeadline: 35,
        isPreSolicitation: true,
      },

      // Special Notices - Industry Intelligence
      {
        id: 'SPECIAL-001',
        title: 'Special Notice: Upcoming Transportation Infrastructure Program',
        solicitationNumber: 'DOT-SN-2024-001',
        agency: 'Department of Transportation',
        amount: 'Program Value: $15,000,000+',
        responseDeadline:
          'Industry Day: ' +
          new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        postedDate: new Date().toISOString(),
        description:
          'Announcement of upcoming multi-year transportation infrastructure support program. Industry Day scheduled to discuss requirements, capabilities, and contracting approach. Multiple contract awards anticipated.',
        naicsCode: '484',
        setAsideType: 'Mixed Set-Asides',
        location: 'Washington, DC (Industry Day)',
        url: 'https://sam.gov/opp/SPECIAL-001',
        noticeType: 'Special Notice',
        stage: 'Pre-Solicitation',
        daysUntilDeadline: 25,
        isPreSolicitation: true,
      },
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
    const nextCheck = new Date(
      this.cache.lastChecked.getTime() +
        this.config.checkIntervalMinutes * 60 * 1000
    );

    return {
      enabled: this.config.enabled,
      lastChecked: this.cache.lastChecked,
      totalOpportunities: this.cache.opportunities.length,
      nextCheck,
      config: this.config,
    };
  }

  /**
   * Generate comprehensive opportunity analytics and insights
   */
  async generateOpportunityAnalytics(): Promise<{
    analytics: {
      totalValue: number;
      averageContractSize: number;
      opportunitiesByAgency: Record<string, number>;
      opportunitiesByNAICS: Record<string, number>;
      trendAnalysis: {
        weekOverWeek: number;
        monthOverMonth: number;
        seasonal: string;
      };
      competitiveIntelligence: {
        setAsideDistribution: Record<string, number>;
        urgencyLevels: Record<string, number>;
        successProbability: Record<string, number>;
      };
    };
    recommendations: string[];
    marketIntelligence: string[];
  }> {
    const opportunities = this.cache.opportunities;

    if (opportunities.length === 0) {
      return {
        analytics: {
          totalValue: 0,
          averageContractSize: 0,
          opportunitiesByAgency: {},
          opportunitiesByNAICS: {},
          trendAnalysis: {
            weekOverWeek: 0,
            monthOverMonth: 0,
            seasonal: 'No data',
          },
          competitiveIntelligence: {
            setAsideDistribution: {},
            urgencyLevels: {},
            successProbability: {},
          },
        },
        recommendations: ['Enable SAM.gov monitoring to access analytics'],
        marketIntelligence: ['No market data available'],
      };
    }

    // Calculate total estimated value
    const totalValue = opportunities.reduce((sum, opp) => {
      const value = this.parseEstimatedValue(opp.amount);
      return sum + (value || 0);
    }, 0);

    const averageContractSize =
      opportunities.length > 0 ? totalValue / opportunities.length : 0;

    // Opportunities by agency
    const opportunitiesByAgency = opportunities.reduce(
      (acc, opp) => {
        const agency = opp.agency.split(' - ')[0]; // Get main agency name
        acc[agency] = (acc[agency] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Opportunities by NAICS code
    const opportunitiesByNAICS = opportunities.reduce(
      (acc, opp) => {
        acc[opp.naicsCode] = (acc[opp.naicsCode] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Set-aside distribution
    const setAsideDistribution = opportunities.reduce(
      (acc, opp) => {
        const setAside = opp.setAsideType || 'None';
        acc[setAside] = (acc[setAside] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Urgency levels based on days until deadline
    const urgencyLevels = opportunities.reduce(
      (acc, opp) => {
        let urgency = 'Unknown';
        if (opp.daysUntilDeadline !== undefined) {
          if (opp.daysUntilDeadline <= 7) urgency = 'Critical (≤7 days)';
          else if (opp.daysUntilDeadline <= 14) urgency = 'High (8-14 days)';
          else if (opp.daysUntilDeadline <= 30) urgency = 'Medium (15-30 days)';
          else urgency = 'Low (>30 days)';
        }
        acc[urgency] = (acc[urgency] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Success probability based on opportunity characteristics
    const successProbability = opportunities.reduce(
      (acc, opp) => {
        let probability = 'Unknown';
        const estimatedValue = this.parseEstimatedValue(opp.amount);

        if (opp.isPreSolicitation) {
          probability = 'High (Pre-Solicitation)';
        } else if (opp.setAsideType?.includes('Small Business')) {
          probability = 'High (Set-Aside)';
        } else if (estimatedValue && estimatedValue < 1000000) {
          probability = 'Medium (Small Contract)';
        } else if (estimatedValue && estimatedValue > 10000000) {
          probability = 'Low (Large Contract)';
        } else {
          probability = 'Medium (Standard)';
        }

        acc[probability] = (acc[probability] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Generate strategic recommendations
    const recommendations = [];

    // High-value opportunities
    const highValueOpps = opportunities.filter((opp) => {
      const value = this.parseEstimatedValue(opp.amount);
      return value && value > 5000000;
    });
    if (highValueOpps.length > 0) {
      recommendations.push(
        `🎯 ${highValueOpps.length} high-value opportunities (>$5M) require strategic focus`
      );
    }

    // Pre-solicitation opportunities
    const preSolicitation = opportunities.filter(
      (opp) => opp.isPreSolicitation
    );
    if (preSolicitation.length > 0) {
      recommendations.push(
        `🔍 ${preSolicitation.length} pre-solicitation opportunities offer early positioning advantage`
      );
    }

    // Urgent opportunities
    const urgentOpps = opportunities.filter(
      (opp) => opp.daysUntilDeadline && opp.daysUntilDeadline <= 7
    );
    if (urgentOpps.length > 0) {
      recommendations.push(
        `⚡ ${urgentOpps.length} critical opportunities require immediate action (≤7 days)`
      );
    }

    // Set-aside opportunities
    const setAsideOpps = opportunities.filter(
      (opp) =>
        opp.setAsideType &&
        !opp.setAsideType.includes('None') &&
        !opp.setAsideType.includes('Open')
    );
    if (setAsideOpps.length > 0) {
      recommendations.push(
        `🏆 ${setAsideOpps.length} set-aside opportunities provide competitive advantage`
      );
    }

    // Market intelligence insights
    const marketIntelligence = [];

    // Top agencies
    const topAgencies = Object.entries(opportunitiesByAgency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([agency, count]) => `${agency} (${count} opportunities)`);
    marketIntelligence.push(`🏛️ Top agencies: ${topAgencies.join(', ')}`);

    // Average contract size insight
    if (averageContractSize > 0) {
      marketIntelligence.push(
        `💰 Average contract value: $${(averageContractSize / 1000000).toFixed(1)}M`
      );
    }

    // Trend analysis (mock for now - in production, compare with historical data)
    const trendAnalysis = {
      weekOverWeek: Math.floor(Math.random() * 20) - 10, // Mock: -10% to +10%
      monthOverMonth: Math.floor(Math.random() * 30) - 15, // Mock: -15% to +15%
      seasonal: this.getSeasonalTrend(),
    };

    return {
      analytics: {
        totalValue,
        averageContractSize,
        opportunitiesByAgency,
        opportunitiesByNAICS,
        trendAnalysis,
        competitiveIntelligence: {
          setAsideDistribution,
          urgencyLevels,
          successProbability,
        },
      },
      recommendations,
      marketIntelligence,
    };
  }

  /**
   * Get seasonal trend information
   */
  private getSeasonalTrend(): string {
    const month = new Date().getMonth();
    if (month >= 8 && month <= 10) {
      // Sep-Nov
      return 'Q4 Spending Push - High Activity Period';
    } else if (month >= 0 && month <= 2) {
      // Jan-Mar
      return 'New Fiscal Year - Opportunity Ramp-Up';
    } else if (month >= 5 && month <= 7) {
      // Jun-Aug
      return 'Mid-Year Budget Review - Moderate Activity';
    } else {
      return 'Standard Activity Period';
    }
  }

  /**
   * Export opportunities data for external analysis
   */
  exportOpportunities(format: 'json' | 'csv' = 'json'): string {
    const opportunities = this.cache.opportunities;

    if (format === 'csv') {
      const headers = [
        'ID',
        'Title',
        'Agency',
        'Amount',
        'Deadline',
        'Posted Date',
        'NAICS Code',
        'Set-Aside Type',
        'Notice Type',
        'Stage',
        'Days Until Deadline',
        'URL',
      ];

      const rows = opportunities.map((opp) => [
        opp.id,
        `"${opp.title.replace(/"/g, '""')}"`,
        `"${opp.agency.replace(/"/g, '""')}"`,
        opp.amount || 'N/A',
        opp.responseDeadline,
        new Date(opp.postedDate).toLocaleDateString(),
        opp.naicsCode,
        opp.setAsideType || 'None',
        opp.noticeType,
        opp.stage,
        opp.daysUntilDeadline || 'N/A',
        opp.url,
      ]);

      return [headers.join(','), ...rows.map((row) => row.join(','))].join(
        '\n'
      );
    }

    return JSON.stringify(opportunities, null, 2);
  }

  /**
   * Generate executive summary report
   */
  generateExecutiveSummary(): {
    summary: string;
    keyMetrics: Record<string, string | number>;
    actionItems: string[];
    nextSteps: string[];
  } {
    const opportunities = this.cache.opportunities;
    const totalValue = opportunities.reduce((sum, opp) => {
      const value = this.parseEstimatedValue(opp.amount);
      return sum + (value || 0);
    }, 0);

    const highPriorityCount = opportunities.filter(
      (opp) => this.determineOpportunityPriority(opp) === 'High'
    ).length;

    const preSolicitationCount = opportunities.filter(
      (opp) => opp.isPreSolicitation
    ).length;
    const urgentCount = opportunities.filter(
      (opp) => opp.daysUntilDeadline && opp.daysUntilDeadline <= 7
    ).length;

    const summary = `
SAM.gov monitoring system has identified ${opportunities.length} active government contract opportunities
with a combined estimated value of $${(totalValue / 1000000).toFixed(1)}M.
${highPriorityCount} opportunities are classified as high priority,
${preSolicitationCount} are in pre-solicitation phase offering early positioning advantages,
and ${urgentCount} require immediate action within 7 days.
    `.trim();

    const keyMetrics = {
      'Total Opportunities': opportunities.length,
      'Total Estimated Value': `$${(totalValue / 1000000).toFixed(1)}M`,
      'High Priority': highPriorityCount,
      'Pre-Solicitation': preSolicitationCount,
      'Critical (≤7 days)': urgentCount,
      'Average Contract Size':
        totalValue > 0
          ? `$${(totalValue / opportunities.length / 1000000).toFixed(1)}M`
          : '$0M',
      'Last Updated': this.cache.lastChecked.toLocaleString(),
    };

    const actionItems = [];
    if (urgentCount > 0) {
      actionItems.push(
        `Review ${urgentCount} critical opportunities requiring immediate response`
      );
    }
    if (preSolicitationCount > 0) {
      actionItems.push(
        `Engage with ${preSolicitationCount} pre-solicitation opportunities for early positioning`
      );
    }
    if (highPriorityCount > 0) {
      actionItems.push(
        `Prioritize bid preparation for ${highPriorityCount} high-value opportunities`
      );
    }

    const nextSteps = [
      'Configure automated bidding rules in FleetFlow RFx system',
      'Schedule team review of high-priority opportunities',
      'Update capability statements for relevant NAICS codes',
      'Establish partnerships for larger contract opportunities',
    ];

    return { summary, keyMetrics, actionItems, nextSteps };
  }
}

// Export singleton instance
export const samGovMonitor = new SAMGovOpportunityMonitor();
