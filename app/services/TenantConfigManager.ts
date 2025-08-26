/**
 * Tenant Configuration Manager
 * Manages tenant-specific AI configurations, business rules, and contexts
 * Demonstrates how each tenant operates with completely different data and business logic
 */

import {
  aiTenantContextService,
  TenantSpecificAIConfig,
} from './AITenantContextService';

export class TenantConfigManager {
  /**
   * Initialize sample tenant configurations to demonstrate multi-tenant AI awareness
   */
  static initializeSampleTenants(): void {
    // ==============================
    // SAMPLE TENANT 1: ABC FREIGHT BROKERS
    // Large established freight brokerage
    // ==============================
    const abcFreightConfig: TenantSpecificAIConfig = {
      tenantId: 'tenant_abc_freight_001',
      organizationName: 'ABC Freight Brokers',
      businessType: 'freight_broker',

      aiFeatures: {
        enabled: [
          'customer_support',
          'rate_analysis',
          'load_matching',
          'carrier_negotiation',
          'business_analytics',
          'route_optimization',
        ],
        models: ['gpt-4', 'claude-3-sonnet'],
        maxTokens: 8000,
        customPrompts: {
          customer_service:
            'You are representing ABC Freight Brokers, a premium logistics provider focusing on reliable, on-time delivery with 25+ years of experience.',
          pricing:
            "Maintain ABC Freight's standard 18-22% margin while remaining competitive. Prioritize long-term customer relationships over short-term gains.",
          dispatch:
            'ABC Freight prioritizes our top-tier carrier partners. Focus on reliability and service quality over lowest cost.',
          negotiation:
            'Negotiate professionally but firmly. ABC Freight has established relationships that allow for premium positioning.',
        },
        businessRules: [
          'minimum_18_percent_margin',
          'preferred_carrier_priority',
          'no_spot_market_below_cost',
          'customer_tier_pricing',
        ],
      },

      dataContext: {
        customerBase: {
          types: ['manufacturers', 'retailers', 'distributors'],
          regions: ['midwest', 'southeast', 'southwest'],
          industries: [
            'automotive',
            'consumer_goods',
            'electronics',
            'food_beverage',
          ],
        },
        carrierNetwork: {
          preferredCarriers: [
            'PREMIUM_CARRIER_001',
            'RELIABLE_TRANSPORT_002',
            'ELITE_LOGISTICS_003',
            'TRUSTED_FREIGHT_004',
          ],
          blacklistedCarriers: ['PROBLEM_CARRIER_999', 'UNRELIABLE_HAUL_888'],
          rateRanges: {
            dry_van: { min: 2.1, max: 3.5 },
            refrigerated: { min: 2.8, max: 4.2 },
            flatbed: { min: 2.5, max: 4.0 },
          },
        },
        operations: {
          primaryLanes: [
            'Chicago-Atlanta',
            'Detroit-Dallas',
            'Cleveland-Memphis',
            'Milwaukee-Nashville',
            'Indianapolis-Birmingham',
          ],
          equipmentTypes: ['dry_van', 'refrigerated', 'flatbed'],
          commodities: [
            'automotive_parts',
            'consumer_electronics',
            'packaged_foods',
          ],
          averageLoadSize: 'full_truckload',
        },
      },

      businessContext: {
        marketPosition: 'established',
        competitiveStrategy: 'premium_service_provider',
        riskTolerance: 'conservative',
        profitTargets: {
          minMargin: 18,
          targetMargin: 22,
          premiumMargin: 28,
        },
      },

      securityProfile: {
        dataClassification: 'confidential',
        complianceRequirements: ['DOT', 'FMCSA', 'SOX', 'GDPR'],
        auditLevel: 'comprehensive',
        retentionPeriod: 2555, // 7 years
      },

      aiPersonality: {
        communicationStyle: 'professional',
        riskPreference: 'conservative',
        decisionSpeed: 'deliberate',
        expertiseLevel: 'expert',
      },
    };

    // ==============================
    // SAMPLE TENANT 2: RAPID LOGISTICS STARTUP
    // Fast-growing tech-enabled freight broker
    // ==============================
    const rapidLogisticsConfig: TenantSpecificAIConfig = {
      tenantId: 'tenant_rapid_logistics_002',
      organizationName: 'Rapid Logistics',
      businessType: 'freight_broker',

      aiFeatures: {
        enabled: [
          'customer_support',
          'rate_analysis',
          'load_matching',
          'business_analytics',
          'route_optimization',
          'market_intelligence',
        ],
        models: ['gpt-4', 'claude-3-haiku'], // Using faster models for quick decisions
        maxTokens: 6000,
        customPrompts: {
          customer_service:
            'You represent Rapid Logistics - a modern, tech-driven freight solution. Emphasize speed, technology, and competitive pricing.',
          pricing:
            'Rapid Logistics competes on speed and efficiency. Target 12-16% margins with volume-based pricing strategies.',
          dispatch:
            'Focus on fastest transit times and real-time tracking. Utilize spot market opportunities.',
          negotiation:
            'Be competitive and agile. Quick decisions and market-responsive pricing.',
        },
        businessRules: [
          'minimum_12_percent_margin',
          'volume_discount_tiers',
          'spot_market_optimization',
          'tech_integration_priority',
        ],
      },

      dataContext: {
        customerBase: {
          types: ['e_commerce', 'startups', 'mid_market'],
          regions: ['west_coast', 'texas', 'florida'],
          industries: [
            'technology',
            'e_commerce',
            'consumer_direct',
            'fashion',
          ],
        },
        carrierNetwork: {
          preferredCarriers: [
            'TECH_CARRIER_101',
            'DIGITAL_DISPATCH_102',
            'MODERN_HAUL_103',
          ],
          blacklistedCarriers: ['SLOW_TRADITIONAL_777'],
          rateRanges: {
            dry_van: { min: 1.95, max: 3.2 },
            refrigerated: { min: 2.6, max: 3.9 },
            box_truck: { min: 2.2, max: 3.8 },
          },
        },
        operations: {
          primaryLanes: [
            'Los_Angeles-Phoenix',
            'Seattle-Portland',
            'Austin-Houston',
            'Miami-Orlando',
            'San_Francisco-Las_Vegas',
          ],
          equipmentTypes: ['dry_van', 'box_truck', 'sprinter_van'],
          commodities: [
            'electronics',
            'fashion',
            'consumer_direct',
            'tech_products',
          ],
          averageLoadSize: 'mixed_ltl_ftl',
        },
      },

      businessContext: {
        marketPosition: 'growing',
        competitiveStrategy: 'technology_disruption',
        riskTolerance: 'aggressive',
        profitTargets: {
          minMargin: 12,
          targetMargin: 16,
          premiumMargin: 22,
        },
      },

      securityProfile: {
        dataClassification: 'internal',
        complianceRequirements: ['DOT', 'FMCSA', 'CCPA'],
        auditLevel: 'detailed',
        retentionPeriod: 1825, // 5 years
      },

      aiPersonality: {
        communicationStyle: 'friendly',
        riskPreference: 'aggressive',
        decisionSpeed: 'fast',
        expertiseLevel: 'intermediate',
      },
    };

    // ==============================
    // SAMPLE TENANT 3: SPECIALIZED HEAVY HAUL CARRIER
    // Niche carrier specializing in oversized loads
    // ==============================
    const specializedHaulConfig: TenantSpecificAIConfig = {
      tenantId: 'tenant_specialized_haul_003',
      organizationName: 'Titan Heavy Haul',
      businessType: 'carrier',

      aiFeatures: {
        enabled: [
          'customer_support',
          'route_optimization',
          'load_matching',
          'permit_assistance',
        ],
        models: ['claude-3-opus'], // Premium model for complex calculations
        maxTokens: 10000,
        customPrompts: {
          customer_service:
            'You represent Titan Heavy Haul, specialists in oversized and overweight freight. Emphasize expertise, safety, and specialized equipment.',
          pricing:
            'Titan Heavy Haul commands premium rates for specialized services. Factor in permits, escorts, and route restrictions.',
          dispatch:
            'Focus on permit requirements, bridge restrictions, and specialized routing for oversized loads.',
          negotiation:
            'Position as the expert solution for complex heavy haul requirements.',
        },
        businessRules: [
          'permit_cost_inclusion',
          'specialized_equipment_premium',
          'safety_first_priority',
          'regulatory_compliance_strict',
        ],
      },

      dataContext: {
        customerBase: {
          types: ['construction', 'manufacturing', 'energy', 'infrastructure'],
          regions: ['texas', 'alberta', 'louisiana', 'pennsylvania'],
          industries: [
            'oil_gas',
            'construction_equipment',
            'wind_energy',
            'mining',
          ],
        },
        carrierNetwork: {
          preferredCarriers: [], // Direct carrier, no sub-contracting
          blacklistedCarriers: [],
          rateRanges: {
            heavy_haul: { min: 4.5, max: 12.0 },
            oversized: { min: 5.2, max: 15.0 },
            machinery: { min: 6.0, max: 18.0 },
          },
        },
        operations: {
          primaryLanes: [
            'Houston-Denver',
            'Calgary-Fort_McMurray',
            'Baton_Rouge-Dallas',
            'Pittsburgh-Chicago',
          ],
          equipmentTypes: ['heavy_haul_trailer', 'lowboy', 'rgn', 'multi_axle'],
          commodities: [
            'construction_equipment',
            'oil_field_equipment',
            'wind_turbines',
            'industrial_machinery',
          ],
          averageLoadSize: 'specialized_heavy',
        },
      },

      businessContext: {
        marketPosition: 'established',
        competitiveStrategy: 'niche_expertise',
        riskTolerance: 'conservative',
        profitTargets: {
          minMargin: 25,
          targetMargin: 35,
          premiumMargin: 50,
        },
      },

      securityProfile: {
        dataClassification: 'confidential',
        complianceRequirements: ['DOT', 'FMCSA', 'OSHA', 'DOE'],
        auditLevel: 'comprehensive',
        retentionPeriod: 3650, // 10 years for specialized equipment records
      },

      aiPersonality: {
        communicationStyle: 'professional',
        riskPreference: 'conservative',
        decisionSpeed: 'deliberate',
        expertiseLevel: 'expert',
      },
    };

    // ==============================
    // SAMPLE TENANT 4: REGIONAL LTL CARRIER
    // Less-than-truckload focused carrier
    // ==============================
    const regionalLTLConfig: TenantSpecificAIConfig = {
      tenantId: 'tenant_regional_ltl_004',
      organizationName: 'Midwest Express LTL',
      businessType: 'carrier',

      aiFeatures: {
        enabled: [
          'customer_support',
          'route_optimization',
          'consolidation_optimization',
          'delivery_scheduling',
        ],
        models: ['gpt-4'],
        maxTokens: 5000,
        customPrompts: {
          customer_service:
            'You represent Midwest Express LTL, focused on reliable regional less-than-truckload service with next-day delivery in our coverage area.',
          pricing:
            'Compete on service reliability and regional expertise. Price competitively against national LTL carriers.',
          dispatch:
            'Optimize consolidation and hub efficiency. Focus on on-time delivery performance.',
          negotiation:
            'Emphasize regional advantages: better service, local knowledge, faster transit times.',
        },
        businessRules: [
          'ltl_consolidation_optimization',
          'regional_service_advantage',
          'next_day_delivery_commitment',
          'hub_efficiency_priority',
        ],
      },

      dataContext: {
        customerBase: {
          types: ['small_business', 'regional_manufacturers', 'distributors'],
          regions: ['midwest'],
          industries: [
            'manufacturing',
            'distribution',
            'retail',
            'agriculture',
          ],
        },
        carrierNetwork: {
          preferredCarriers: ['PARTNER_LTL_001', 'REGIONAL_ALLIANCE_002'],
          blacklistedCarriers: [],
          rateRanges: {
            ltl: { min: 0.85, max: 2.2 },
            volume_ltl: { min: 1.2, max: 1.8 },
          },
        },
        operations: {
          primaryLanes: [
            'Chicago-Milwaukee',
            'Detroit-Grand_Rapids',
            'Indianapolis-Columbus',
            'St_Louis-Kansas_City',
          ],
          equipmentTypes: ['ltl_truck', 'straight_truck', 'box_truck'],
          commodities: [
            'general_freight',
            'manufactured_goods',
            'food_products',
          ],
          averageLoadSize: 'ltl',
        },
      },

      businessContext: {
        marketPosition: 'established',
        competitiveStrategy: 'regional_service_excellence',
        riskTolerance: 'moderate',
        profitTargets: {
          minMargin: 8,
          targetMargin: 12,
          premiumMargin: 18,
        },
      },

      securityProfile: {
        dataClassification: 'internal',
        complianceRequirements: ['DOT', 'FMCSA'],
        auditLevel: 'detailed',
        retentionPeriod: 2190, // 6 years
      },

      aiPersonality: {
        communicationStyle: 'friendly',
        riskPreference: 'balanced',
        decisionSpeed: 'standard',
        expertiseLevel: 'intermediate',
      },
    };

    // Register all sample tenants
    aiTenantContextService.registerTenant(abcFreightConfig);
    aiTenantContextService.registerTenant(rapidLogisticsConfig);
    aiTenantContextService.registerTenant(specializedHaulConfig);
    aiTenantContextService.registerTenant(regionalLTLConfig);

    console.log('✅ Initialized sample tenant configurations:');
    console.log('   🏢 ABC Freight Brokers - Established Premium Broker');
    console.log('   🚀 Rapid Logistics - Tech-Enabled Growth Broker');
    console.log('   🏗️ Titan Heavy Haul - Specialized Carrier');
    console.log('   🚛 Midwest Express LTL - Regional LTL Carrier');
  }

  /**
   * Demonstrate how AI responses differ by tenant context
   */
  static async demonstrateTenantDifferences(): Promise<void> {
    const sampleQuery =
      'What should I charge for a dry van load from Chicago to Atlanta, 45,000 lbs?';

    const tenants = [
      'tenant_abc_freight_001',
      'tenant_rapid_logistics_002',
      'tenant_specialized_haul_003',
      'tenant_regional_ltl_004',
    ];

    console.log('\n🔍 DEMONSTRATING TENANT-SPECIFIC AI RESPONSES:');
    console.log(`Query: "${sampleQuery}"\n`);

    for (const tenantId of tenants) {
      const config = aiTenantContextService.getTenantAIConfig(tenantId);

      console.log(`🏢 ${config.organizationName} (${config.businessType}):`);
      console.log(
        `   Business Strategy: ${config.businessContext.competitiveStrategy}`
      );
      console.log(
        `   Target Margin: ${config.businessContext.profitTargets.targetMargin}%`
      );
      console.log(`   Risk Tolerance: ${config.businessContext.riskTolerance}`);

      // This would generate different responses based on tenant context
      const contextualResponse = await this.generateSampleResponse(
        tenantId,
        sampleQuery
      );
      console.log(`   AI Response: ${contextualResponse}\n`);
    }
  }

  /**
   * Generate sample responses showing tenant-specific context
   */
  private static async generateSampleResponse(
    tenantId: string,
    query: string
  ): Promise<string> {
    const config = aiTenantContextService.getTenantAIConfig(tenantId);

    // Sample responses that would differ based on tenant configuration
    const responses: Record<string, string> = {
      tenant_abc_freight_001: `Based on ABC Freight's premium positioning and Chicago-Atlanta being one of our primary lanes, I recommend $3,200-$3,600 (18-22% margin). Our preferred carrier network can handle this reliably.`,

      tenant_rapid_logistics_002: `For Rapid Logistics' competitive strategy, I suggest $2,800-$3,200 (12-16% margin). We can leverage spot market pricing and our tech platform for quick carrier matching.`,

      tenant_specialized_haul_003: `This standard dry van load falls outside Titan Heavy Haul's specialized equipment focus. I recommend referring to a partner broker or pricing at $4,000+ if using our equipment (not cost-effective).`,

      tenant_regional_ltl_004: `At 45,000 lbs, this exceeds typical LTL weight. Midwest Express would need to treat as volume LTL or refer to FTL partners. If handling: $2,600-$3,000 with partner carrier.`,
    };

    return (
      responses[tenantId] ||
      'Response would be customized based on tenant context.'
    );
  }

  /**
   * Show tenant data boundary enforcement
   */
  static demonstrateDataBoundaries(): void {
    console.log('\n🔒 TENANT DATA BOUNDARY DEMONSTRATION:');

    const tenants = [
      { id: 'tenant_abc_freight_001', name: 'ABC Freight Brokers' },
      { id: 'tenant_rapid_logistics_002', name: 'Rapid Logistics' },
    ];

    tenants.forEach((tenant) => {
      const summary = aiTenantContextService.getTenantContextSummary(tenant.id);
      console.log(`\n🏢 ${tenant.name}:`);
      console.log(`   ✅ Can access: ${summary.activeFeatures.join(', ')}`);
      console.log(`   🔒 Data classification: ${summary.dataClassification}`);
      console.log(
        `   🚫 Cannot access: Other tenants' customer data, rates, or business intelligence`
      );
      console.log(
        `   🛡️ AI responses filtered for: ${tenant.name}'s business context only`
      );
    });

    console.log(
      `\n⚠️  CRITICAL: Each tenant's AI operates in complete isolation.`
    );
    console.log(`   • ABC Freight's AI never sees Rapid Logistics' data`);
    console.log(`   • Rate recommendations based on tenant's specific margins`);
    console.log(`   • Carrier suggestions limited to tenant's network`);
    console.log(`   • Business advice tailored to tenant's strategy`);
  }
}

// Auto-initialize sample configurations for demonstration
TenantConfigManager.initializeSampleTenants();
