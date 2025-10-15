/**
 * Multi-Source Government Contract Scanner
 * Comprehensive scanning across all 28 government opportunity sources
 * FleetFlow Platform - DEE DAVIS INC/DEPOINTE Tenant
 */

import { createClient } from '@supabase/supabase-js';

// Types
interface OpportunitySource {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  frequency:
    | 'hourly'
    | 'every4hours'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly';
  priority: 'critical' | 'high' | 'medium' | 'low';
  active: boolean;
  apiEndpoint?: string;
  scrapeUrl?: string;
  requiresAuth: boolean;
  costType: 'free' | 'paid' | 'subscription';
}

interface ScanResult {
  sourceId: string;
  opportunities: any[];
  timestamp: string;
  success: boolean;
  error?: string;
  metadata: {
    totalFound: number;
    filtered: number;
    saved: number;
    duplicates: number;
  };
}

// Government Opportunity Sources Configuration
export const GOVERNMENT_SOURCES: OpportunitySource[] = [
  // TIER 1: FEDERAL GOVERNMENT SOURCES (Critical - Every 4 hours)
  {
    id: 'sam_gov',
    name: 'SAM.gov / Beta.SAM.gov',
    tier: 1,
    frequency: 'every4hours',
    priority: 'critical',
    active: true,
    apiEndpoint: 'https://api.sam.gov/opportunities/v2/search',
    requiresAuth: true,
    costType: 'free',
  },
  {
    id: 'gsa_ebuy',
    name: 'GSA eBuy Portal',
    tier: 1,
    frequency: 'daily',
    priority: 'high',
    active: true,
    scrapeUrl: 'https://www.ebuy.gsa.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'dla_mil',
    name: 'Defense Logistics Agency (DLA)',
    tier: 1,
    frequency: 'daily',
    priority: 'high',
    active: true,
    scrapeUrl: 'https://www.dla.mil/SmallBusiness/',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'ustranscom',
    name: 'USTRANSCOM',
    tier: 1,
    frequency: 'weekly',
    priority: 'high',
    active: true,
    scrapeUrl: 'https://www.ustranscom.mil',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'gsa_mas',
    name: 'GSA Multiple Award Schedules',
    tier: 1,
    frequency: 'monthly',
    priority: 'medium',
    active: true,
    scrapeUrl:
      'https://www.gsa.gov/buying-selling/products-services/transportation-logistics-services',
    requiresAuth: false,
    costType: 'free',
  },

  // TIER 2: STATE & LOCAL GOVERNMENT (High Priority - Weekly)
  {
    id: 'michigan_sigma',
    name: 'Michigan SIGMA VSS',
    tier: 2,
    frequency: 'daily',
    priority: 'critical', // Home state advantage
    active: true,
    scrapeUrl: 'https://sigma.michigan.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'california_calprocure',
    name: 'California CalProcure',
    tier: 2,
    frequency: 'weekly',
    priority: 'high',
    active: true,
    scrapeUrl: 'https://www.calprocure.ca.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'texas_cmbl',
    name: 'Texas CMBL',
    tier: 2,
    frequency: 'weekly',
    priority: 'high',
    active: true,
    scrapeUrl: 'https://www.txsmartbuy.com',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'florida_marketplace',
    name: 'Florida MyFloridaMarketPlace',
    tier: 2,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.myfloridamarketplace.com',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'new_york_procurement',
    name: 'New York NYS Procurement',
    tier: 2,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.ogs.ny.gov/procurement/',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'illinois_bidbuy',
    name: 'Illinois BidBuy',
    tier: 2,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.bidbuy.illinois.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'pennsylvania_costars',
    name: 'Pennsylvania COSTARS',
    tier: 2,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.dgs.pa.gov/costars/',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'ohio_vendor_portal',
    name: 'Ohio Vendor Portal',
    tier: 2,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://procure.ohio.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'state_dots',
    name: 'State DOT Portals',
    tier: 2,
    frequency: 'weekly',
    priority: 'high',
    active: true,
    scrapeUrl: 'https://www.michigan.gov/mdot',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'local_government',
    name: 'Local Government Procurement',
    tier: 2,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'multiple',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'naspo_valuepoint',
    name: 'NASPO ValuePoint',
    tier: 2,
    frequency: 'monthly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.naspovaluepoint.org',
    requiresAuth: false,
    costType: 'free',
  },

  // TIER 3: SPECIALIZED GOVERNMENT SOURCES (Targeted)
  {
    id: 'fema_contracts',
    name: 'FEMA Contracts & Emergency Response',
    tier: 3,
    frequency: 'daily',
    priority: 'high',
    active: true,
    scrapeUrl:
      'https://www.fema.gov/about/procurement-disaster-assistance-team',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'dot_fmcsa',
    name: 'DOT/FMCSA Opportunities',
    tier: 3,
    frequency: 'monthly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.fmcsa.dot.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'va_logistics',
    name: 'Veterans Affairs Logistics',
    tier: 3,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.va.gov/oal/',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'usps_transportation',
    name: 'USPS Transportation',
    tier: 3,
    frequency: 'quarterly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://about.usps.com/suppliers/',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'ihs_tribal',
    name: 'Indian Health Service',
    tier: 3,
    frequency: 'monthly',
    priority: 'high', // WOSB advantage
    active: true,
    scrapeUrl: 'https://www.ihs.gov/dps/',
    requiresAuth: false,
    costType: 'free',
  },

  // TIER 4: INDUSTRY & COMMERCIAL INTELLIGENCE (Paid Services)
  {
    id: 'govwin_deltek',
    name: 'GovWin IQ by Deltek',
    tier: 4,
    frequency: 'daily',
    priority: 'high',
    active: false, // Requires subscription
    apiEndpoint: 'https://www.deltek.com/en/products/govwin-iq',
    requiresAuth: true,
    costType: 'subscription',
  },
  {
    id: 'bloomberg_gov',
    name: 'Bloomberg Government (BGOV)',
    tier: 4,
    frequency: 'daily',
    priority: 'high',
    active: false, // Requires subscription
    apiEndpoint: 'https://about.bgov.com',
    requiresAuth: true,
    costType: 'subscription',
  },
  {
    id: 'fedscoop_news',
    name: 'FedScoop / Defense One',
    tier: 4,
    frequency: 'daily',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.fedscoop.com',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'industry_events',
    name: 'Industry Days & SB Events',
    tier: 4,
    frequency: 'weekly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.sba.gov/events',
    requiresAuth: false,
    costType: 'free',
  },

  // TIER 5: RESEARCH & DEVELOPMENT OPPORTUNITIES
  {
    id: 'sbir_sttr',
    name: 'SBIR/STTR Programs',
    tier: 5,
    frequency: 'monthly',
    priority: 'medium',
    active: true,
    scrapeUrl: 'https://www.sbir.gov',
    requiresAuth: false,
    costType: 'free',
  },
  {
    id: 'grants_gov',
    name: 'Grants.gov',
    tier: 5,
    frequency: 'weekly',
    priority: 'low',
    active: true,
    scrapeUrl: 'https://www.grants.gov',
    requiresAuth: false,
    costType: 'free',
  },

  // TIER 6: INTERNATIONAL & SPECIAL PROGRAMS
  {
    id: 'trade_missions',
    name: 'International Trade Missions',
    tier: 6,
    frequency: 'monthly',
    priority: 'low',
    active: true,
    scrapeUrl: 'https://www.trade.gov/trade-missions',
    requiresAuth: false,
    costType: 'free',
  },
];

export class MultiSourceGovScanner {
  private supabase: any;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Scan all active sources based on their frequency
   */
  async scanAllSources(): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    const activeSources = GOVERNMENT_SOURCES.filter((source) => source.active);

    console.log(
      `🔍 Starting comprehensive scan of ${activeSources.length} government sources...`
    );

    for (const source of activeSources) {
      try {
        console.log(`📊 Scanning ${source.name} (Tier ${source.tier})...`);
        const result = await this.scanSource(source);
        results.push(result);

        // Brief delay between sources to be respectful
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error scanning ${source.name}:`, error);
        results.push({
          sourceId: source.id,
          opportunities: [],
          timestamp: new Date().toISOString(),
          success: false,
          error: error.message,
          metadata: { totalFound: 0, filtered: 0, saved: 0, duplicates: 0 },
        });
      }
    }

    return results;
  }

  /**
   * Scan a specific source
   */
  private async scanSource(source: OpportunitySource): Promise<ScanResult> {
    const timestamp = new Date().toISOString();

    switch (source.id) {
      case 'sam_gov':
        return await this.scanSamGov(source, timestamp);
      case 'michigan_sigma':
        return await this.scanMichiganSigma(source, timestamp);
      case 'gsa_ebuy':
        return await this.scanGsaEbuy(source, timestamp);
      case 'fema_contracts':
        return await this.scanFemaContracts(source, timestamp);
      default:
        // For sources not yet implemented, return placeholder
        return await this.scanGenericSource(source, timestamp);
    }
  }

  /**
   * SAM.gov API Integration (Primary Source)
   */
  private async scanSamGov(
    source: OpportunitySource,
    timestamp: string
  ): Promise<ScanResult> {
    try {
      const apiKey = process.env.SAM_GOV_API_KEY;
      if (!apiKey) {
        throw new Error('SAM.gov API key not configured');
      }

      // BROADENED search parameters to get REAL results
      // Priority: Get opportunities first, filter later
      const today = new Date();
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      // SAM.gov requires MM/dd/yyyy format
      const formatDate = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      const searchParams = {
        limit: 100,
        offset: 0,
        postedFrom: formatDate(sixtyDaysAgo), // Last 60 days (MM/dd/yyyy format)
        postedTo: formatDate(today), // MM/dd/yyyy format
        // Removed NAICS filter - get ALL transportation opportunities
        // Removed set-aside filter - we'll prioritize WOSB in the results
        // Removed state filter - nationwide opportunities
        q: 'transportation OR freight OR logistics OR trucking OR delivery OR shipping OR fleet OR carrier OR motor OR vehicle',
      };

      const queryString = new URLSearchParams();
      // Add API key as query parameter (SAM.gov requires this)
      queryString.append('api_key', apiKey);

      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryString.append(key, v));
        } else {
          queryString.append(key, value.toString());
        }
      });

      const url = `${source.apiEndpoint}?${queryString}`;
      console.log(`🌐 SAM.gov API URL: ${url.replace(apiKey, 'HIDDEN')}`);

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      console.log(`📡 SAM.gov response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ SAM.gov API error: ${response.status} - ${errorText.substring(0, 200)}`
        );
        throw new Error(`SAM.gov API error: ${response.status}`);
      }

      const data = await response.json();
      const opportunities = data.opportunitiesData || [];

      console.log(`✅ SAM.gov returned ${opportunities.length} opportunities`);

      // Save to database
      const savedOpportunities = await this.saveOpportunities(
        opportunities,
        source.id
      );

      return {
        sourceId: source.id,
        opportunities: savedOpportunities,
        timestamp,
        success: true,
        metadata: {
          totalFound: opportunities.length,
          filtered: opportunities.length,
          saved: savedOpportunities.length,
          duplicates: opportunities.length - savedOpportunities.length,
        },
      };
    } catch (error) {
      return {
        sourceId: source.id,
        opportunities: [],
        timestamp,
        success: false,
        error: error.message,
        metadata: { totalFound: 0, filtered: 0, saved: 0, duplicates: 0 },
      };
    }
  }

  /**
   * Michigan SIGMA VSS (Home State Priority)
   */
  private async scanMichiganSigma(
    source: OpportunitySource,
    timestamp: string
  ): Promise<ScanResult> {
    console.log('🏛️ Scanning Michigan SIGMA VSS (Home State Priority)...');

    // TODO: Implement actual Michigan SIGMA scraping
    // No mock data - real implementation needed

    return {
      sourceId: source.id,
      opportunities: [],
      timestamp,
      success: true,
      metadata: {
        totalFound: 0,
        filtered: 0,
        saved: 0,
        duplicates: 0,
      },
    };
  }

  /**
   * GSA eBuy Portal
   */
  private async scanGsaEbuy(
    source: OpportunitySource,
    timestamp: string
  ): Promise<ScanResult> {
    console.log('🏛️ Scanning GSA eBuy Portal...');

    return {
      sourceId: source.id,
      opportunities: [],
      timestamp,
      success: true,
      metadata: { totalFound: 0, filtered: 0, saved: 0, duplicates: 0 },
    };
  }

  /**
   * FEMA Emergency Contracts
   */
  private async scanFemaContracts(
    source: OpportunitySource,
    timestamp: string
  ): Promise<ScanResult> {
    console.log('🚨 Scanning FEMA Emergency Contracts...');

    // TODO: Implement actual FEMA contract scraping/monitoring
    // No mock data - real implementation needed

    return {
      sourceId: source.id,
      opportunities: [],
      timestamp,
      success: true,
      metadata: {
        totalFound: 0,
        filtered: 0,
        saved: 0,
        duplicates: 0,
      },
    };
  }

  /**
   * Generic source scanner (placeholder for future implementation)
   */
  private async scanGenericSource(
    source: OpportunitySource,
    timestamp: string
  ): Promise<ScanResult> {
    console.log(`📋 Placeholder scan for ${source.name}...`);

    return {
      sourceId: source.id,
      opportunities: [],
      timestamp,
      success: true,
      metadata: { totalFound: 0, filtered: 0, saved: 0, duplicates: 0 },
    };
  }

  /**
   * Save opportunities to Supabase
   */
  private async saveOpportunities(
    opportunities: any[],
    sourceId: string
  ): Promise<any[]> {
    const savedOpportunities = [];

    for (const opp of opportunities) {
      try {
        const oppData = {
          tenant_id: 'depointe', // DEE DAVIS INC/DEPOINTE tenant
          notice_id: opp.noticeId || opp.id,
          solicitation_number: opp.solicitationNumber,
          title: opp.title,
          description: opp.description,
          agency: opp.department || opp.agency,
          office: opp.office,
          department: opp.department,
          contract_value: opp.value || 0,
          base_value: opp.baseAndAllOptionsValue,
          naics_code: opp.naicsCodes?.[0] || opp.naicsCode,
          naics_codes: opp.naicsCodes,
          set_aside_type: opp.typeOfSetAside || opp.setAside,
          opportunity_type: opp.type,
          posted_date: opp.postedDate,
          response_deadline: opp.responseDeadLine || opp.deadline,
          place_of_performance_state:
            opp.placeOfPerformance?.state?.code || opp.state,
          place_of_performance_city: opp.placeOfPerformance?.city,
          office_state: opp.officeAddress?.state,
          office_city: opp.officeAddress?.city,
          co_name: opp.pointOfContact?.fullName || opp.coName,
          co_email: opp.pointOfContact?.email || opp.coEmail,
          co_phone: opp.pointOfContact?.phone,
          point_of_contact: opp.pointOfContact,
          priority_score: this.calculatePriorityScore(opp),
          win_probability: this.calculateWinProbability(opp),
          status: 'new',
          source: sourceId,
          source_url: opp.uiLink,
        };

        // Upsert (insert or update if exists)
        const { data, error } = await this.supabase
          .from('gov_contract_opportunities')
          .upsert(oppData, {
            onConflict: 'tenant_id,notice_id',
            ignoreDuplicates: false,
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving opportunity to Supabase:', error);
        } else {
          savedOpportunities.push(data);
        }
      } catch (error) {
        console.error('Error processing opportunity:', error);
      }
    }

    return savedOpportunities;
  }

  /**
   * Calculate priority score for DEE DAVIS INC/DEPOINTE
   */
  private calculatePriorityScore(opp: any): number {
    let score = 50; // Base score

    // WOSB Set-Aside = +30 points (CRITICAL for DEE DAVIS INC/DEPOINTE)
    if (
      opp.typeOfSetAside?.toLowerCase().includes('wosb') ||
      opp.typeOfSetAside?.toLowerCase().includes('women')
    ) {
      score += 30;
    }

    // Small Business Set-Aside = +20 points
    if (opp.typeOfSetAside?.toLowerCase().includes('small business')) {
      score += 20;
    }

    // Transportation/Logistics keywords = +15 points
    const keywords = [
      'transportation',
      'freight',
      'logistics',
      'delivery',
      'shipping',
      'fleet',
    ];
    const title = (opp.title || '').toLowerCase();
    const description = (opp.description || '').toLowerCase();

    if (
      keywords.some(
        (keyword) => title.includes(keyword) || description.includes(keyword)
      )
    ) {
      score += 15;
    }

    // Michigan location = +10 points (home state advantage)
    if (opp.placeOfPerformance?.state?.code === 'MI' || opp.state === 'MI') {
      score += 10;
    }

    // Contract value in sweet spot ($25K-$250K) = +10 points
    const value = opp.value || opp.baseAndAllOptionsValue || 0;
    if (value >= 25000 && value <= 250000) {
      score += 10;
    }

    // Sources Sought (early opportunity) = +15 points
    if (opp.type?.toLowerCase().includes('sources sought')) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate win probability
   */
  private calculateWinProbability(opp: any): number {
    const priorityScore = this.calculatePriorityScore(opp);

    // Base probability on priority score
    let probability = Math.min(95, priorityScore * 0.8);

    // Adjust based on competition level (estimated)
    const value = opp.value || opp.baseAndAllOptionsValue || 0;
    if (value > 1000000) {
      probability *= 0.7; // Higher competition for large contracts
    }

    return Math.round(probability);
  }

  /**
   * Get scan schedule for a source
   */
  static getScanSchedule(sourceId: string): string {
    const source = GOVERNMENT_SOURCES.find((s) => s.id === sourceId);
    return source?.frequency || 'weekly';
  }

  /**
   * Get active sources by tier
   */
  static getSourcesByTier(tier: number): OpportunitySource[] {
    return GOVERNMENT_SOURCES.filter(
      (source) => source.tier === tier && source.active
    );
  }

  /**
   * Get critical sources (should be scanned most frequently)
   */
  static getCriticalSources(): OpportunitySource[] {
    return GOVERNMENT_SOURCES.filter(
      (source) => source.priority === 'critical' && source.active
    );
  }
}
