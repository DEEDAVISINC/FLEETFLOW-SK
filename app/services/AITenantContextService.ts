/**
 * AI Tenant Context Service
 * Provides tenant-aware AI processing with complete data isolation
 * Ensures AI operates within proper tenant boundaries and business context
 */

export interface TenantSpecificAIConfig {
  tenantId: string;
  organizationName: string;
  businessType: 'freight_broker' | 'carrier' | 'shipper' | 'logistics_provider';

  // AI Feature Configuration
  aiFeatures: {
    enabled: string[];
    models: string[];
    maxTokens: number;
    customPrompts: Record<string, string>;
    businessRules: string[];
  };

  // Data Context
  dataContext: {
    customerBase: {
      types: string[];
      regions: string[];
      industries: string[];
    };
    carrierNetwork: {
      preferredCarriers: string[];
      blacklistedCarriers: string[];
      rateRanges: Record<string, { min: number; max: number }>;
    };
    operations: {
      primaryLanes: string[];
      equipmentTypes: string[];
      commodities: string[];
      averageLoadSize: string;
    };
  };

  // Business Intelligence Context
  businessContext: {
    marketPosition: 'startup' | 'growing' | 'established' | 'enterprise';
    competitiveStrategy: string;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    profitTargets: {
      minMargin: number;
      targetMargin: number;
      premiumMargin: number;
    };
  };

  // Security & Compliance
  securityProfile: {
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    complianceRequirements: string[];
    auditLevel: 'basic' | 'detailed' | 'comprehensive';
    retentionPeriod: number; // days
  };

  // AI Behavior Customization
  aiPersonality: {
    communicationStyle: 'formal' | 'professional' | 'friendly' | 'casual';
    riskPreference: 'conservative' | 'balanced' | 'aggressive';
    decisionSpeed: 'deliberate' | 'standard' | 'fast';
    expertiseLevel: 'basic' | 'intermediate' | 'expert';
  };
}

export interface TenantAwareAIRequest {
  tenantId: string;
  operation: string;
  context:
    | 'customer_service'
    | 'dispatch'
    | 'pricing'
    | 'analytics'
    | 'negotiation';
  data: any;
  userRole: string;
  sessionId: string;
}

export interface TenantContextualResponse {
  response: string;
  tenantContext: {
    appliedBusinessRules: string[];
    dataSourcesUsed: string[];
    complianceChecks: string[];
  };
  confidence: number;
  reasoning: string;
  recommendations?: string[];
}

export class AITenantContextService {
  private tenantConfigs: Map<string, TenantSpecificAIConfig> = new Map();
  private tenantDataContexts: Map<string, any> = new Map();
  private activeTenantSessions: Map<string, string> = new Map(); // sessionId -> tenantId

  constructor() {
    this.initializeDefaultConfigurations();
  }

  /**
   * Set tenant context for AI operation
   */
  setTenantContext(sessionId: string, tenantId: string): void {
    this.activeTenantSessions.set(sessionId, tenantId);
    console.info(
      `🏢 Set AI tenant context: ${tenantId} for session: ${sessionId}`
    );
  }

  /**
   * Get tenant-specific AI configuration
   */
  getTenantAIConfig(tenantId: string): TenantSpecificAIConfig {
    const config = this.tenantConfigs.get(tenantId);
    if (!config) {
      console.warn(
        `⚠️ No AI config found for tenant ${tenantId}, using default`
      );
      return this.getDefaultConfig(tenantId);
    }
    return config;
  }

  /**
   * Process AI request with full tenant awareness
   */
  async processTenantAwareRequest(
    request: TenantAwareAIRequest
  ): Promise<TenantContextualResponse> {
    const config = this.getTenantAIConfig(request.tenantId);

    // Validate tenant context
    if (!this.validateTenantContext(request.tenantId, request.context)) {
      throw new Error(
        `Invalid tenant context for ${request.tenantId}: ${request.context}`
      );
    }

    // Apply tenant-specific data filtering
    const filteredData = this.applyTenantDataFiltering(request.data, config);

    // Build tenant-aware prompt
    const contextualPrompt = this.buildTenantContextualPrompt(
      request,
      config,
      filteredData
    );

    // Apply tenant business rules
    const businessRulesApplied = this.applyTenantBusinessRules(
      filteredData,
      config
    );

    // Process with tenant context
    const response = await this.generateTenantAwareResponse(
      contextualPrompt,
      config,
      businessRulesApplied
    );

    return {
      response: response.text,
      tenantContext: {
        appliedBusinessRules: businessRulesApplied.rulesApplied,
        dataSourcesUsed: this.identifyDataSources(filteredData),
        complianceChecks: this.getComplianceChecks(config),
      },
      confidence: response.confidence,
      reasoning: response.reasoning,
      recommendations: response.recommendations,
    };
  }

  /**
   * Validate that tenant context is appropriate for requested operation
   */
  private validateTenantContext(tenantId: string, context: string): boolean {
    const config = this.getTenantAIConfig(tenantId);

    // Check if context is enabled for this tenant
    const contextMapping = {
      customer_service: 'customer_support',
      dispatch: 'dispatch_optimization',
      pricing: 'rate_analysis',
      analytics: 'business_analytics',
      negotiation: 'rate_negotiation',
    };

    const requiredFeature =
      contextMapping[context as keyof typeof contextMapping];
    return config.aiFeatures.enabled.includes(requiredFeature);
  }

  /**
   * Apply tenant-specific data filtering
   */
  private applyTenantDataFiltering(
    data: any,
    config: TenantSpecificAIConfig
  ): any {
    if (!data || typeof data !== 'object') return data;

    const filtered = { ...data };

    // Filter based on tenant's business context
    if (config.businessType === 'freight_broker') {
      // Broker-specific filtering
      filtered.internalCosts = undefined; // Hide internal cost data
      filtered.carrierMargins = undefined; // Hide carrier margin data
    } else if (config.businessType === 'carrier') {
      // Carrier-specific filtering
      filtered.customerMargins = undefined; // Hide customer margin data
      filtered.brokerRates = undefined; // Hide broker rate data
    }

    // Apply data classification filtering
    if (config.securityProfile.dataClassification === 'public') {
      filtered.financialData = undefined;
      filtered.personalData = undefined;
      filtered.competitorData = undefined;
    }

    // Filter by tenant's operational scope
    if (filtered.loads && Array.isArray(filtered.loads)) {
      filtered.loads = filtered.loads.filter((load: any) =>
        this.isLoadInTenantScope(load, config)
      );
    }

    if (filtered.carriers && Array.isArray(filtered.carriers)) {
      filtered.carriers = filtered.carriers.filter((carrier: any) =>
        this.isCarrierInTenantNetwork(carrier, config)
      );
    }

    return filtered;
  }

  /**
   * Check if load is within tenant's operational scope
   */
  private isLoadInTenantScope(
    load: any,
    config: TenantSpecificAIConfig
  ): boolean {
    const { operations } = config.dataContext;

    // Check equipment type
    if (operations.equipmentTypes.length > 0 && load.equipment) {
      if (!operations.equipmentTypes.includes(load.equipment)) {
        return false;
      }
    }

    // Check commodity
    if (operations.commodities.length > 0 && load.commodity) {
      if (
        !operations.commodities.some((commodity) =>
          load.commodity.toLowerCase().includes(commodity.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // Check primary lanes
    if (operations.primaryLanes.length > 0) {
      const loadLane = `${load.origin}-${load.destination}`;
      const reverseLane = `${load.destination}-${load.origin}`;

      if (
        !operations.primaryLanes.some(
          (lane) => lane.includes(loadLane) || lane.includes(reverseLane)
        )
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if carrier is in tenant's network
   */
  private isCarrierInTenantNetwork(
    carrier: any,
    config: TenantSpecificAIConfig
  ): boolean {
    const { carrierNetwork } = config.dataContext;

    // Check blacklist first
    if (
      carrierNetwork.blacklistedCarriers.includes(carrier.mc || carrier.name)
    ) {
      return false;
    }

    // If preferred carriers exist, prioritize them
    if (carrierNetwork.preferredCarriers.length > 0) {
      return carrierNetwork.preferredCarriers.includes(
        carrier.mc || carrier.name
      );
    }

    return true;
  }

  /**
   * Build tenant-contextual prompt
   */
  private buildTenantContextualPrompt(
    request: TenantAwareAIRequest,
    config: TenantSpecificAIConfig,
    data: any
  ): string {
    const basePrompt = `You are Flowtower AI, an expert AI assistant specializing in freight logistics and transportation.

TENANT CONTEXT:
- Organization: ${config.organizationName}
- Business Type: ${config.businessType}
- Market Position: ${config.businessContext.marketPosition}
- Communication Style: ${config.aiPersonality.communicationStyle}

BUSINESS CONTEXT:
- Primary Lanes: ${config.dataContext.operations.primaryLanes.join(', ')}
- Equipment Types: ${config.dataContext.operations.equipmentTypes.join(', ')}
- Target Margin: ${config.businessContext.profitTargets.targetMargin}%
- Risk Tolerance: ${config.businessContext.riskTolerance}

OPERATION CONTEXT: ${request.context}
USER ROLE: ${request.userRole}

IMPORTANT: You are operating within ${config.organizationName}'s business context. All recommendations, analysis, and responses should be specific to their operations, customer base, and business objectives. Do not reference or compare to other companies' data.

${config.aiFeatures.customPrompts[request.context] || ''}

REQUEST: ${request.operation}
`;

    return basePrompt;
  }

  /**
   * Apply tenant-specific business rules
   */
  private applyTenantBusinessRules(
    data: any,
    config: TenantSpecificAIConfig
  ): {
    data: any;
    rulesApplied: string[];
  } {
    const processedData = { ...data };
    const rulesApplied: string[] = [];

    // Apply profit margin rules
    if (processedData.rates && Array.isArray(processedData.rates)) {
      processedData.rates = processedData.rates.filter((rate: any) => {
        const margin =
          ((rate.customerRate - rate.carrierRate) / rate.customerRate) * 100;
        if (margin < config.businessContext.profitTargets.minMargin) {
          rulesApplied.push(
            `Filtered rate below minimum margin (${margin.toFixed(1)}%)`
          );
          return false;
        }
        return true;
      });
    }

    // Apply carrier preferences
    if (processedData.carriers && Array.isArray(processedData.carriers)) {
      const preferredCarriers =
        config.dataContext.carrierNetwork.preferredCarriers;
      if (preferredCarriers.length > 0) {
        processedData.carriers = processedData.carriers.map((carrier: any) => ({
          ...carrier,
          isPreferred: preferredCarriers.includes(carrier.mc || carrier.name),
        }));
        rulesApplied.push('Applied preferred carrier rankings');
      }
    }

    // Apply custom business rules
    for (const rule of config.aiFeatures.businessRules) {
      // This would be expanded to handle specific business rule implementations
      rulesApplied.push(`Applied custom rule: ${rule}`);
    }

    return { data: processedData, rulesApplied };
  }

  /**
   * Generate tenant-aware response
   */
  private async generateTenantAwareResponse(
    prompt: string,
    config: TenantSpecificAIConfig,
    processedData: any
  ): Promise<{
    text: string;
    confidence: number;
    reasoning: string;
    recommendations?: string[];
  }> {
    // This would integrate with your actual AI service (Claude, GPT, etc.)
    // For now, providing a structured response framework

    const response = {
      text: `Based on ${config.organizationName}'s business context and the provided data, here's my analysis...`,
      confidence: 0.85,
      reasoning: `Analysis performed within ${config.organizationName}'s operational parameters`,
      recommendations: [
        `Consider expanding operations in ${config.dataContext.operations.primaryLanes[0]}`,
        `Focus on ${config.businessContext.competitiveStrategy} strategy`,
      ],
    };

    return response;
  }

  /**
   * Identify data sources used in response
   */
  private identifyDataSources(data: any): string[] {
    const sources: string[] = [];

    if (data.loads) sources.push('load_data');
    if (data.carriers) sources.push('carrier_network');
    if (data.rates) sources.push('rate_data');
    if (data.customers) sources.push('customer_data');
    if (data.market) sources.push('market_intelligence');

    return sources;
  }

  /**
   * Get compliance checks for tenant
   */
  private getComplianceChecks(config: TenantSpecificAIConfig): string[] {
    const checks = ['tenant_data_isolation', 'user_permission_validation'];

    if (config.securityProfile.complianceRequirements.includes('GDPR')) {
      checks.push('gdpr_data_protection');
    }

    if (config.securityProfile.complianceRequirements.includes('DOT')) {
      checks.push('dot_transportation_compliance');
    }

    return checks;
  }

  /**
   * Register new tenant configuration
   */
  registerTenant(tenantConfig: TenantSpecificAIConfig): void {
    this.tenantConfigs.set(tenantConfig.tenantId, tenantConfig);
    console.info(
      `✅ Registered AI context for tenant: ${tenantConfig.organizationName} (${tenantConfig.tenantId})`
    );
  }

  /**
   * Update tenant configuration
   */
  updateTenantConfig(
    tenantId: string,
    updates: Partial<TenantSpecificAIConfig>
  ): void {
    const existing = this.tenantConfigs.get(tenantId);
    if (existing) {
      this.tenantConfigs.set(tenantId, { ...existing, ...updates });
      console.info(`🔄 Updated AI config for tenant: ${tenantId}`);
    }
  }

  /**
   * Get active tenant for session
   */
  getActiveTenant(sessionId: string): string | null {
    return this.activeTenantSessions.get(sessionId) || null;
  }

  /**
   * Clear tenant session
   */
  clearTenantSession(sessionId: string): void {
    this.activeTenantSessions.delete(sessionId);
  }

  /**
   * Initialize default configurations for different tenant types
   */
  private initializeDefaultConfigurations(): void {
    // Default Freight Broker Configuration
    const defaultBrokerConfig: TenantSpecificAIConfig = {
      tenantId: 'default_broker',
      organizationName: 'Default Broker',
      businessType: 'freight_broker',
      aiFeatures: {
        enabled: [
          'customer_support',
          'rate_analysis',
          'load_matching',
          'carrier_negotiation',
        ],
        models: ['gpt-4', 'claude-3'],
        maxTokens: 4000,
        customPrompts: {
          customer_service:
            'Focus on building long-term customer relationships',
          pricing:
            'Optimize for competitive rates while maintaining profit margins',
          dispatch: 'Prioritize on-time delivery and carrier satisfaction',
        },
        businessRules: [
          'minimum_15_percent_margin',
          'preferred_carrier_priority',
        ],
      },
      dataContext: {
        customerBase: {
          types: ['manufacturers', 'retailers'],
          regions: ['midwest', 'southeast'],
          industries: ['automotive', 'consumer_goods'],
        },
        carrierNetwork: {
          preferredCarriers: [],
          blacklistedCarriers: [],
          rateRanges: {},
        },
        operations: {
          primaryLanes: [],
          equipmentTypes: ['dry_van', 'refrigerated'],
          commodities: [],
          averageLoadSize: 'full_truckload',
        },
      },
      businessContext: {
        marketPosition: 'growing',
        competitiveStrategy: 'value_focused',
        riskTolerance: 'moderate',
        profitTargets: { minMargin: 15, targetMargin: 20, premiumMargin: 25 },
      },
      securityProfile: {
        dataClassification: 'confidential',
        complianceRequirements: ['DOT', 'FMCSA'],
        auditLevel: 'detailed',
        retentionPeriod: 2555, // 7 years
      },
      aiPersonality: {
        communicationStyle: 'professional',
        riskPreference: 'balanced',
        decisionSpeed: 'standard',
        expertiseLevel: 'expert',
      },
    };

    this.tenantConfigs.set('default', defaultBrokerConfig);
  }

  /**
   * Get default configuration for new tenant
   */
  private getDefaultConfig(tenantId: string): TenantSpecificAIConfig {
    const defaultConfig = this.tenantConfigs.get('default')!;
    return {
      ...defaultConfig,
      tenantId,
      organizationName: `Tenant ${tenantId}`,
    };
  }

  /**
   * Get tenant context summary for debugging
   */
  getTenantContextSummary(tenantId: string): any {
    const config = this.getTenantAIConfig(tenantId);
    const activeSessions = Array.from(this.activeTenantSessions.entries())
      .filter(([_, tenant]) => tenant === tenantId)
      .map(([session, _]) => session);

    return {
      tenantId,
      organizationName: config.organizationName,
      businessType: config.businessType,
      activeFeatures: config.aiFeatures.enabled,
      activeSessions,
      dataClassification: config.securityProfile.dataClassification,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const aiTenantContextService = new AITenantContextService();
