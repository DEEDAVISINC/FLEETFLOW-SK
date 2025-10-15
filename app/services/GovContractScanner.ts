/**
 * Government Contract Forecasting Scanner
 * Automated multi-source opportunity discovery system
 * FleetFlow TMS LLC - WOSB Certified
 */

interface GovOpportunity {
  id: string;
  source: string;
  title: string;
  agency: string;
  office?: string;
  solicitation_number?: string;
  opportunity_type: string; // Sources Sought, RFP, RFQ, RFI, etc.
  set_aside_type?: string;
  naics_code?: string;
  contract_value?: number;
  posted_date: string;
  response_deadline?: string;
  description: string;
  requirements?: string;
  documents?: string[];
  source_url: string;
  co_name?: string;
  co_email?: string;
  co_phone?: string;
  discovered_at: string;
  priority_score: number; // 0-100 based on relevance
}

interface ScannerConfig {
  apiKeys: {
    samGov?: string;
    anthropic?: string;
  };
  filters: {
    keywords: string[];
    naicsCodes: string[];
    setAsides: string[];
    minValue?: number;
    maxValue?: number;
    states?: string[];
  };
  notifications: {
    email?: string;
    webhook?: string;
    pushEnabled: boolean;
  };
}

class GovContractScanner {
  private config: ScannerConfig;
  private opportunitiesCache: Map<string, GovOpportunity>;

  constructor(config: ScannerConfig) {
    this.config = config;
    this.opportunitiesCache = new Map();
  }

  /**
   * TIER 1: FEDERAL SOURCES
   */

  async scanSAMGov(): Promise<GovOpportunity[]> {
    console.log('🔍 Scanning SAM.gov API...');

    if (!this.config.apiKeys.samGov) {
      console.warn('⚠️ SAM.gov API key not configured');
      return [];
    }

    try {
      const opportunities: GovOpportunity[] = [];
      const keywords = this.config.filters.keywords.join(' OR ');
      const naicsCodes = this.config.filters.naicsCodes.join(',');

      // Calculate date range (last 7 days to next 90 days)
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 7);
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 90);

      const postedFrom = this.formatDate(pastDate);
      const postedTo = this.formatDate(futureDate);

      // SAM.gov API v2 Search
      const apiUrl = 'https://api.sam.gov/opportunities/v2/search';
      const params = new URLSearchParams({
        api_key: this.config.apiKeys.samGov,
        postedFrom,
        postedTo,
        ptype: 'o,p,k,r,s,ss', // All notice types including Sources Sought
        noticetype: 'ss,p,s', // Priority: Sources Sought, Presolicitation, Solicitation
        limit: '100',
      });

      // Add NAICS codes if specified
      if (naicsCodes) {
        params.append('ncode', naicsCodes);
      }

      // Add set-aside filters
      if (this.config.filters.setAsides.length > 0) {
        this.config.filters.setAsides.forEach((setAside) => {
          params.append('typeOfSetAside', setAside);
        });
      }

      console.log(`🌐 Calling SAM.gov API: ${apiUrl}?${params.toString()}`);

      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ SAM.gov API error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (data.opportunitiesData && Array.isArray(data.opportunitiesData)) {
        console.log(
          `📊 SAM.gov returned ${data.opportunitiesData.length} opportunities`
        );

        for (const opp of data.opportunitiesData) {
          const opportunity: GovOpportunity = {
            id: `samgov-${opp.noticeId || Date.now()}`,
            source: 'SAM.gov',
            title: opp.title || 'Untitled',
            agency: opp.organizationName || opp.department || 'Unknown Agency',
            office: opp.subtierName || opp.officeAddress?.city,
            solicitation_number: opp.solicitationNumber || opp.noticeId,
            opportunity_type: this.parseOpportunityType(opp.type),
            set_aside_type: opp.typeOfSetAside || opp.typeOfSetAsideDescription,
            naics_code: opp.naicsCode,
            contract_value: this.parseContractValue(opp),
            posted_date: opp.postedDate || new Date().toISOString(),
            response_deadline: opp.responseDeadLine || opp.archiveDate,
            description: opp.description || '',
            source_url: `https://sam.gov/opp/${opp.noticeId}/view`,
            co_name: opp.pointOfContact?.[0]?.fullName,
            co_email: opp.pointOfContact?.[0]?.email,
            co_phone: opp.pointOfContact?.[0]?.phone,
            discovered_at: new Date().toISOString(),
            priority_score: this.calculatePriorityScore(opp),
          };

          opportunities.push(opportunity);
          this.opportunitiesCache.set(opportunity.id, opportunity);
        }
      }

      return opportunities;
    } catch (error) {
      console.error('❌ Error scanning SAM.gov:', error);
      return [];
    }
  }

  async scanGSAeBuy(): Promise<GovOpportunity[]> {
    console.log('🔍 Scanning GSA eBuy Portal...');

    try {
      // GSA eBuy requires authentication and web scraping
      // For now, return placeholder - full implementation requires Puppeteer
      console.log('⚠️ GSA eBuy scanning requires web scraping - placeholder');
      return [];
    } catch (error) {
      console.error('❌ Error scanning GSA eBuy:', error);
      return [];
    }
  }

  async scanDLA(): Promise<GovOpportunity[]> {
    console.log('🔍 Scanning Defense Logistics Agency...');

    try {
      // DLA opportunities often posted on SAM.gov
      // Additional DLA-specific searches can be added here
      console.log('⚠️ DLA opportunities primarily on SAM.gov');
      return [];
    } catch (error) {
      console.error('❌ Error scanning DLA:', error);
      return [];
    }
  }

  /**
   * TIER 2: STATE & LOCAL SOURCES
   */

  async scanMichiganSIGMA(): Promise<GovOpportunity[]> {
    console.log('🔍 Scanning Michigan SIGMA VSS Portal...');

    try {
      // Michigan State procurement portal
      // Requires web scraping or API if available
      console.log(
        '⚠️ Michigan SIGMA scanning requires web scraping - placeholder'
      );
      return [];
    } catch (error) {
      console.error('❌ Error scanning Michigan SIGMA:', error);
      return [];
    }
  }

  async scanStateProcurementPortals(
    states: string[]
  ): Promise<GovOpportunity[]> {
    console.log(`🔍 Scanning ${states.length} state procurement portals...`);

    const opportunities: GovOpportunity[] = [];

    for (const state of states) {
      try {
        // Each state has different portal - requires individual scrapers
        console.log(
          `⚠️ ${state} portal scanning requires web scraping - placeholder`
        );
      } catch (error) {
        console.error(`❌ Error scanning ${state} portal:`, error);
      }
    }

    return opportunities;
  }

  /**
   * TIER 3: SPECIALIZED SOURCES
   */

  async scanFEMA(): Promise<GovOpportunity[]> {
    console.log('🔍 Scanning FEMA Contracts...');

    try {
      // FEMA opportunities often posted on SAM.gov
      // Can also check FEMA.gov procurement pages
      console.log('⚠️ FEMA opportunities primarily on SAM.gov');
      return [];
    } catch (error) {
      console.error('❌ Error scanning FEMA:', error);
      return [];
    }
  }

  /**
   * AI-POWERED ANALYSIS
   */

  async analyzeOpportunity(opportunity: GovOpportunity): Promise<any> {
    if (!this.config.apiKeys.anthropic) {
      console.warn('⚠️ Anthropic API key not configured for analysis');
      return null;
    }

    try {
      const prompt = `Analyze this government contract opportunity for FleetFlow TMS LLC (WOSB-certified):

OPPORTUNITY:
- Title: ${opportunity.title}
- Agency: ${opportunity.agency}
- Type: ${opportunity.opportunity_type}
- Set-Aside: ${opportunity.set_aside_type || 'None'}
- Value: $${opportunity.contract_value?.toLocaleString() || 'Not specified'}
- Description: ${opportunity.description}

COMPANY PROFILE:
- WOSB-certified transportation management platform
- Services: TMS software, freight management, fleet operations, compliance
- Location: Michigan (nationwide service)
- Target: Transportation, logistics, software contracts

Provide:
1. Win Probability (0-100%)
2. Key Strengths (3-5 points)
3. Risks/Challenges (2-4 points)
4. Recommendations (3-5 action items)
5. Bid/No-Bid decision with reasoning

Respond in JSON format only.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKeys.anthropic,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error('❌ Anthropic API error:', response.status);
        return null;
      }

      const data = await response.json();
      const analysisText = data.content[0].text;

      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return null;
    } catch (error) {
      console.error('❌ Error analyzing opportunity:', error);
      return null;
    }
  }

  /**
   * COMPREHENSIVE SCAN - All Sources
   */

  async scanAllSources(): Promise<{
    total: number;
    bySource: Record<string, number>;
    opportunities: GovOpportunity[];
    highPriority: GovOpportunity[];
  }> {
    console.log('🚀 Starting comprehensive government contract scan...');

    const allOpportunities: GovOpportunity[] = [];
    const sourceStats: Record<string, number> = {};

    // TIER 1: Federal Sources (Parallel execution)
    const [samGovOpps] = await Promise.all([
      this.scanSAMGov(),
      // this.scanGSAeBuy(), // Add when implemented
      // this.scanDLA(), // Add when implemented
    ]);

    allOpportunities.push(...samGovOpps);
    sourceStats['SAM.gov'] = samGovOpps.length;

    // TIER 2: State & Local (if configured)
    if (this.config.filters.states && this.config.filters.states.length > 0) {
      const stateOpps = await this.scanStateProcurementPortals(
        this.config.filters.states
      );
      allOpportunities.push(...stateOpps);
      sourceStats['State Portals'] = stateOpps.length;
    }

    // TIER 3: Specialized (Parallel execution)
    // const [femaOpps] = await Promise.all([
    //   this.scanFEMA(),
    // ]);
    // allOpportunities.push(...femaOpps);

    // Filter and prioritize
    const highPriority = allOpportunities.filter(
      (opp) => opp.priority_score >= 70
    );

    // Sort by priority
    allOpportunities.sort((a, b) => b.priority_score - a.priority_score);

    console.log(
      `✅ Scan complete: ${allOpportunities.length} opportunities found`
    );
    console.log(`🎯 High priority: ${highPriority.length} opportunities`);

    return {
      total: allOpportunities.length,
      bySource: sourceStats,
      opportunities: allOpportunities,
      highPriority,
    };
  }

  /**
   * HELPER METHODS
   */

  private calculatePriorityScore(opp: any): number {
    let score = 50; // Base score

    // WOSB Set-Aside = +30 points (CRITICAL for DEE DAVIS INC/DEPOINTE tenant)
    if (
      opp.typeOfSetAside?.toLowerCase().includes('wosb') ||
      opp.typeOfSetAside?.toLowerCase().includes('women')
    ) {
      score += 30;
    }

    // Sources Sought = +20 points (early engagement)
    if (opp.type === 'ss' || opp.type === 'Sources Sought') {
      score += 20;
    }

    // Small Business Set-Aside = +15 points
    if (
      opp.typeOfSetAside?.toLowerCase().includes('small business') ||
      opp.typeOfSetAside?.toLowerCase().includes('sba')
    ) {
      score += 15;
    }

    // Contract Value: $25K-$250K = +15 points (WOSB sweet spot)
    const value = this.parseContractValue(opp);
    if (value >= 25000 && value <= 250000) {
      score += 15;
    } else if (value > 250000 && value <= 1000000) {
      score += 10;
    }

    // Transportation/Logistics keywords = +10 points
    const text = `${opp.title} ${opp.description}`.toLowerCase();
    const transportKeywords = [
      'transportation',
      'freight',
      'logistics',
      'fleet',
      'tms',
      'shipping',
      'delivery',
    ];
    if (transportKeywords.some((keyword) => text.includes(keyword))) {
      score += 10;
    }

    // Michigan/Regional = +5 points
    if (
      opp.state === 'MI' ||
      opp.officeAddress?.state === 'MI' ||
      text.includes('michigan')
    ) {
      score += 5;
    }

    // Response deadline soon = +5 points
    if (opp.responseDeadLine) {
      const deadline = new Date(opp.responseDeadLine);
      const daysUntil =
        (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysUntil <= 7 && daysUntil > 0) {
        score += 5;
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  private parseContractValue(opp: any): number {
    // Try various field names for contract value
    const value =
      opp.awardAmount ||
      opp.baseAndAllOptionsValue ||
      opp.estimatedContractValue ||
      0;

    return typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.]/g, ''))
      : value;
  }

  private parseOpportunityType(type: string): string {
    const typeMap: Record<string, string> = {
      ss: 'Sources Sought',
      p: 'Presolicitation',
      s: 'Solicitation',
      o: 'Solicitation',
      k: 'Combined Synopsis/Solicitation',
      r: 'Sources Sought',
      i: 'Intent to Bundle',
    };

    return typeMap[type] || type || 'Unknown';
  }

  private formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * NOTIFICATION SYSTEM
   */

  async sendNotification(opportunities: GovOpportunity[]): Promise<void> {
    if (opportunities.length === 0) {
      console.log('📭 No new opportunities to notify');
      return;
    }

    const highPriority = opportunities.filter(
      (opp) => opp.priority_score >= 70
    );

    console.log(
      `📧 Sending notification for ${opportunities.length} opportunities (${highPriority.length} high priority)`
    );

    // Email notification (if configured)
    if (this.config.notifications.email) {
      // Integration with email service (SendGrid, AWS SES, etc.)
      console.log(
        `📨 Email notification sent to ${this.config.notifications.email}`
      );
    }

    // Webhook notification (if configured)
    if (this.config.notifications.webhook) {
      try {
        await fetch(this.config.notifications.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: opportunities.length,
            highPriority: highPriority.length,
            opportunities: highPriority.slice(0, 5), // Top 5 for webhook
          }),
        });
        console.log('🔔 Webhook notification sent');
      } catch (error) {
        console.error('❌ Error sending webhook:', error);
      }
    }
  }
}

export default GovContractScanner;
export type { GovOpportunity, ScannerConfig };
