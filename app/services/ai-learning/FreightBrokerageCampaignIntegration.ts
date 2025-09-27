/**
 * DEPOINTE AI - Freight Brokerage Sales Campaign Integration
 * Integrates 100+ comprehensive sales prompts into active campaigns
 * Connects to existing campaign performance tracking and AI staff learning
 */

import { CAMPAIGN_PERFORMANCE_DATA } from '../../components/CampaignPerformanceTracker';
import { platformAIManager } from '../PlatformAIManager';

// ====================================================================
// FREIGHT BROKERAGE SALES MASTERY INTEGRATION
// ====================================================================

export interface FreightCampaignEnhancement {
  campaignId: string;
  campaignName: string;
  currentPerformance: {
    conversionRate: number;
    leadsGenerated: number;
    revenueGenerated: number;
  };
  appliedTechniques: string[];
  expectedImprovements: {
    conversionRateIncrease: number;
    revenueIncrease: number;
    efficiencyGains: number;
  };
  specificPrompts: FreightSalesPrompt[];
}

export interface FreightSalesPrompt {
  id: string;
  category:
    | 'prospecting'
    | 'negotiation'
    | 'closing'
    | 'objection_handling'
    | 'relationship_building';
  title: string;
  prompt: string;
  industry: string[];
  expectedOutcome: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  aiStaffAssignment: string[];
}

// ====================================================================
// ADVANCED FREIGHT BROKERAGE SALES PROMPTS (Key Samples)
// ====================================================================

export const FREIGHT_BROKERAGE_SALES_PROMPTS: FreightSalesPrompt[] = [
  // STRATEGIC MARKET INTELLIGENCE & PROSPECTING (Healthcare Focus)
  {
    id: 'healthcare-prospect-001',
    category: 'prospecting',
    title: 'Healthcare Supply Chain Vulnerability Analysis',
    prompt: `Analyze the supply chain vulnerabilities of companies in the [healthcare/pharmaceutical] sector that manufacture products in [region A] and sell to customers in [region B]. Create a detailed prospecting strategy that identifies decision-makers, their likely pain points around freight capacity, seasonal fluctuations, and carrier dependency. Include specific talking points about how recent supply chain disruptions (port congestion, driver shortages, fuel costs) create opportunities for our brokerage services. Provide email templates, LinkedIn approaches, and phone scripts with industry-specific language and pain points.`,
    industry: ['healthcare', 'pharmaceutical', 'medical_devices'],
    expectedOutcome:
      'Identify high-value healthcare prospects with immediate freight needs, targeting $50K+ annual shipping volumes',
    difficulty: 'expert',
    aiStaffAssignment: ['desiree', 'gary', 'logan'],
  },

  {
    id: 'healthcare-negotiation-001',
    category: 'negotiation',
    title: 'Healthcare Freight Rate Negotiation with Compliance Focus',
    prompt: `You're negotiating freight rates for a pharmaceutical company that requires FDA-compliant transportation. They currently pay $4.50/mile but want $3.80/mile. Their shipments include temperature-sensitive medications requiring specialized equipment and real-time monitoring. Create a negotiation strategy that: 1) Explains the value of compliance and risk mitigation, 2) Offers tiered pricing based on volume commitments, 3) Includes emergency/STAT delivery premiums, 4) Demonstrates ROI through reduced spoilage and regulatory risk. Frame the conversation around patient safety and supply chain reliability rather than just cost.`,
    industry: ['pharmaceutical', 'healthcare', 'medical_devices'],
    expectedOutcome:
      'Secure $4.20/mile rate with volume commitments, maintain 35%+ margins on healthcare freight',
    difficulty: 'expert',
    aiStaffAssignment: ['gary', 'logan', 'kameelah'],
  },

  {
    id: 'healthcare-objection-001',
    category: 'objection_handling',
    title:
      'Healthcare Freight Objection: "We Already Have a Logistics Provider"',
    prompt: `A hospital system director says: "We've been with MedSpeed for 3 years and they handle all our medical courier needs. Why would we switch?" Create a sophisticated response strategy that: 1) Acknowledges their existing relationship respectfully, 2) Positions yourself as a backup/overflow solution initially, 3) Highlights specific gaps in single-provider dependency (capacity constraints during flu season, emergency coverage, specialized equipment needs), 4) Offers a "risk-free pilot program" for non-critical shipments, 5) Demonstrates superior technology/tracking capabilities, 6) Shows cost savings opportunities without criticizing current provider.`,
    industry: ['healthcare', 'medical_courier', 'hospital_systems'],
    expectedOutcome:
      'Convert 30% of "already have provider" objections into pilot opportunities, leading to full service adoption',
    difficulty: 'advanced',
    aiStaffAssignment: ['desiree', 'gary', 'shanell'],
  },

  {
    id: 'manufacturing-prospect-001',
    category: 'prospecting',
    title: 'Manufacturing Expansion Trigger Event Strategy',
    prompt: `Create a trigger event monitoring system for identifying companies that have recently: announced facility expansions, launched new product lines, acquired other businesses, received significant funding, or changed logistics leadership. For each trigger event type, develop customized outreach sequences that tie our freight solutions directly to their likely new challenges. Include timing strategies (when to reach out post-announcement), stakeholder mapping, and value propositions specific to each situation. Focus on automotive, electronics, and consumer goods manufacturers with $10M+ annual revenue.`,
    industry: ['manufacturing', 'automotive', 'electronics', 'consumer_goods'],
    expectedOutcome:
      'Generate 40+ qualified leads monthly from trigger events, with 25% higher conversion rates',
    difficulty: 'intermediate',
    aiStaffAssignment: ['gary', 'desiree', 'brook'],
  },

  {
    id: 'carrier-recruitment-001',
    category: 'relationship_building',
    title: 'Owner-Operator Recruitment Psychology',
    prompt: `Develop a carrier recruitment strategy that addresses the psychological motivations of owner-operators beyond just rate per mile. Create messaging that speaks to: 1) Independence and business ownership pride, 2) Consistent freight flow and business stability, 3) Technology that makes them more efficient, 4) Respect and professional treatment, 5) Growth opportunities (adding trucks, building their fleet). Include scripts for different carrier personas: the veteran driver, the new owner-operator, the small fleet owner, and the lease-purchase driver. Address common pain points: detention time, fuel advances, quick pay, and equipment matching.`,
    industry: ['carrier_relations', 'owner_operators', 'small_fleets'],
    expectedOutcome:
      'Recruit 50+ quality owner-operators monthly, reduce carrier turnover by 40%',
    difficulty: 'advanced',
    aiStaffAssignment: ['roland', 'carrie', 'logan'],
  },
];

// ====================================================================
// CAMPAIGN ENHANCEMENT SERVICE
// ====================================================================

export class FreightBrokerageCampaignIntegration {
  private static instance: FreightBrokerageCampaignIntegration;
  private campaignEnhancements: Map<string, FreightCampaignEnhancement> =
    new Map();

  static getInstance(): FreightBrokerageCampaignIntegration {
    if (!this.instance) {
      this.instance = new FreightBrokerageCampaignIntegration();
    }
    return this.instance;
  }

  /**
   * Enhance active campaigns with freight brokerage sales mastery
   */
  async enhanceActiveCampaigns(): Promise<FreightCampaignEnhancement[]> {
    console.info(
      '🚀 Enhancing active campaigns with freight brokerage sales mastery...'
    );

    const enhancedCampaigns: FreightCampaignEnhancement[] = [];

    // Get current campaign performance data - will be empty until real campaigns are launched
    if (CAMPAIGN_PERFORMANCE_DATA.length === 0) {
      console.info(
        '📋 No active campaigns found - freight brokerage sales techniques ready for when campaigns are launched'
      );
      return [];
    }

    for (const campaign of CAMPAIGN_PERFORMANCE_DATA) {
      if (campaign.status === 'active') {
        const enhancement = await this.createCampaignEnhancement(campaign);
        this.campaignEnhancements.set(campaign.campaignId, enhancement);
        enhancedCampaigns.push(enhancement);
      }
    }

    await this.integrateWithPlatformAI(enhancedCampaigns);
    console.info(
      `✅ Enhanced ${enhancedCampaigns.length} active campaigns with advanced sales techniques`
    );

    return enhancedCampaigns;
  }

  /**
   * Create campaign-specific enhancement based on performance data
   */
  private async createCampaignEnhancement(
    campaign: any
  ): Promise<FreightCampaignEnhancement> {
    const isHealthcareCampaign =
      campaign.campaignId === 'healthcare_pharma_blitz';

    // Select relevant prompts based on campaign type
    const relevantPrompts = FREIGHT_BROKERAGE_SALES_PROMPTS.filter((prompt) => {
      if (isHealthcareCampaign) {
        return (
          prompt.industry.includes('healthcare') ||
          prompt.industry.includes('pharmaceutical')
        );
      }
      return true; // For now, apply all prompts to other campaigns
    });

    // Calculate expected improvements based on current performance
    const currentConversionRate = campaign.kpis.conversionRate;
    const expectedConversionIncrease = this.calculateExpectedImprovement(
      currentConversionRate
    );

    return {
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      currentPerformance: {
        conversionRate: currentConversionRate,
        leadsGenerated: campaign.kpis.leadsGenerated,
        revenueGenerated: campaign.kpis.revenueGenerated,
      },
      appliedTechniques: [
        'Advanced prospecting with trigger event monitoring',
        'Industry-specific objection handling',
        'Value-based negotiation strategies',
        'Relationship-building psychology',
        'Compliance-focused healthcare messaging',
      ],
      expectedImprovements: {
        conversionRateIncrease: expectedConversionIncrease,
        revenueIncrease:
          campaign.kpis.revenueGenerated * (expectedConversionIncrease / 100),
        efficiencyGains: 25, // Expected 25% efficiency improvement
      },
      specificPrompts: relevantPrompts,
    };
  }

  /**
   * Calculate expected improvement based on current performance
   */
  private calculateExpectedImprovement(currentRate: number): number {
    // Higher current rates see smaller percentage improvements but larger absolute gains
    if (currentRate > 25) return 15; // 15% relative improvement for already high-performing campaigns
    if (currentRate > 15) return 25; // 25% relative improvement for good campaigns
    if (currentRate > 10) return 40; // 40% relative improvement for average campaigns
    return 60; // 60% relative improvement for underperforming campaigns
  }

  /**
   * Integrate enhanced campaigns with Platform AI Manager
   */
  private async integrateWithPlatformAI(
    enhancements: FreightCampaignEnhancement[]
  ): Promise<void> {
    for (const enhancement of enhancements) {
      // Update AI staff with campaign-specific prompts
      await this.updateAIStaffTraining(enhancement);

      // Register campaign enhancement with platform AI
      await platformAIManager.registerCampaignEnhancement(
        enhancement.campaignId,
        enhancement.appliedTechniques,
        enhancement.specificPrompts
      );
    }
  }

  /**
   * Update AI staff training with campaign-specific techniques
   */
  private async updateAIStaffTraining(
    enhancement: FreightCampaignEnhancement
  ): Promise<void> {
    const aiStaffUpdates = new Map<string, string[]>();

    // Group prompts by assigned AI staff
    enhancement.specificPrompts.forEach((prompt) => {
      prompt.aiStaffAssignment.forEach((staffId) => {
        if (!aiStaffUpdates.has(staffId)) {
          aiStaffUpdates.set(staffId, []);
        }
        aiStaffUpdates.get(staffId)!.push(prompt.title);
      });
    });

    // Apply updates through platform AI
    for (const [staffId, techniques] of aiStaffUpdates) {
      await platformAIManager.updateAIStaffCapabilities(staffId, {
        campaignId: enhancement.campaignId,
        newTechniques: techniques,
        expectedImprovements: enhancement.expectedImprovements,
      });
    }

    console.info(
      `📚 Updated AI staff training for ${enhancement.campaignName}`
    );
  }

  /**
   * Get campaign enhancement status
   */
  getCampaignEnhancement(
    campaignId: string
  ): FreightCampaignEnhancement | null {
    return this.campaignEnhancements.get(campaignId) || null;
  }

  /**
   * Get all active campaign enhancements
   */
  getAllCampaignEnhancements(): FreightCampaignEnhancement[] {
    return Array.from(this.campaignEnhancements.values());
  }

  /**
   * Apply specific sales technique to campaign
   */
  async applySalesTechnique(
    campaignId: string,
    techniqueId: string,
    context: any
  ): Promise<string> {
    const prompt = FREIGHT_BROKERAGE_SALES_PROMPTS.find(
      (p) => p.id === techniqueId
    );
    if (!prompt) {
      throw new Error(`Sales technique ${techniqueId} not found`);
    }

    // Process through Platform AI for enhanced, supervised response
    const result = await platformAIManager.processAIRequest(
      'sales_call',
      prompt.prompt,
      {
        serviceName: 'FreightBrokerageSales',
        campaignId,
        industry: context.industry || 'freight',
        customerType: context.customerType || 'shipper',
      }
    );

    return result.response;
  }
}

// ====================================================================
// CAMPAIGN ENHANCEMENT INITIALIZATION
// ====================================================================

export const initializeFreightBrokerageCampaignEnhancements =
  async (): Promise<void> => {
    try {
      console.info(
        '🚀 Initializing freight brokerage campaign enhancements...'
      );

      const integrationService =
        FreightBrokerageCampaignIntegration.getInstance();
      const enhancements = await integrationService.enhanceActiveCampaigns();

      console.info(
        `✅ Successfully enhanced ${enhancements.length} campaigns with advanced sales techniques`
      );
      console.info('📊 Campaign Enhancement Summary:');

      enhancements.forEach((enhancement) => {
        console.info(`  • ${enhancement.campaignName}:`);
        console.info(
          `    - Current conversion: ${enhancement.currentPerformance.conversionRate}%`
        );
        console.info(
          `    - Expected increase: +${enhancement.expectedImprovements.conversionRateIncrease}%`
        );
        console.info(
          `    - Projected revenue boost: +$${enhancement.expectedImprovements.revenueIncrease.toLocaleString()}`
        );
        console.info(
          `    - Applied techniques: ${enhancement.appliedTechniques.length}`
        );
      });
    } catch (error) {
      console.error(
        '❌ Error initializing freight brokerage campaign enhancements:',
        error
      );
    }
  };

export default FreightBrokerageCampaignIntegration;
