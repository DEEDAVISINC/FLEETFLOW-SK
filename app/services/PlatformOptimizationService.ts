// Platform-Specific Cost Optimization Service
// Reduces costs by optimizing queries and targeting for each platform

interface PlatformConfig {
  name: string;
  baseCostPerQuery: number;
  optimizationMultiplier: number;
  cacheEnabled: boolean;
  rateLimitPerHour: number;
}

interface OptimizationResult {
  originalQueries: number;
  optimizedQueries: number;
  costSavings: number;
  performanceImprovement: number;
  cacheHits: number;
}

class PlatformOptimizationService {
  private platformConfigs: Record<string, PlatformConfig> = {
    thomasnet: {
      name: 'Thomas.net',
      baseCostPerQuery: 0.05, // Estimated cost per search
      optimizationMultiplier: 0.3, // 70% reduction through optimization
      cacheEnabled: true,
      rateLimitPerHour: 100,
    },
    truckingplanet: {
      name: 'TruckingPlanet',
      baseCostPerQuery: 0.03, // Estimated cost per search
      optimizationMultiplier: 0.4, // 60% reduction through optimization
      cacheEnabled: true,
      rateLimitPerHour: 150,
    },
    fmcsa: {
      name: 'FMCSA',
      baseCostPerQuery: 0.02, // Estimated cost per lookup
      optimizationMultiplier: 0.2, // 80% reduction through optimization
      cacheEnabled: true,
      rateLimitPerHour: 200,
    },
  };

  private queryCache = new Map<string, any>();
  private usageStats = new Map<
    string,
    { queries: number; cost: number; timestamp: number }
  >();

  // ========================================
  // THOMAS.NET OPTIMIZATION
  // ========================================

  async optimizeThomasNetSearch(
    searchCriteria: any,
    existingResults: any[] = []
  ): Promise<{ results: any[]; optimization: OptimizationResult }> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey('thomasnet', searchCriteria);

    // Check cache first
    const cached = this.queryCache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.info(`💾 Thomas.net cache hit for: ${cacheKey}`);
      return {
        results: cached.results,
        optimization: {
          originalQueries: 1,
          optimizedQueries: 0,
          costSavings: this.platformConfigs.thomasnet.baseCostPerQuery,
          performanceImprovement: Date.now() - startTime,
          cacheHits: 1,
        },
      };
    }

    // Apply optimization filters
    const optimizedCriteria = this.optimizeThomasNetCriteria(searchCriteria);

    // Simulate API call with optimizations
    const results = await this.simulateOptimizedSearch(
      'thomasnet',
      optimizedCriteria
    );

    // Cache results
    this.queryCache.set(cacheKey, {
      results,
      timestamp: Date.now(),
      criteria: optimizedCriteria,
    });

    // Update usage stats
    this.updateUsageStats(
      'thomasnet',
      1,
      this.platformConfigs.thomasnet.baseCostPerQuery *
        this.platformConfigs.thomasnet.optimizationMultiplier
    );

    return {
      results,
      optimization: {
        originalQueries: 1,
        optimizedQueries: 1,
        costSavings:
          this.platformConfigs.thomasnet.baseCostPerQuery *
          (1 - this.platformConfigs.thomasnet.optimizationMultiplier),
        performanceImprovement: Date.now() - startTime,
        cacheHits: 0,
      },
    };
  }

  private optimizeThomasNetCriteria(criteria: any): any {
    // Focus on high-converting segments only
    const optimized = { ...criteria };

    // Remove low-value searches
    if (optimized.companySize === 'SMALL') {
      optimized.skip = true;
      return optimized;
    }

    // Prioritize enterprise manufacturers
    if (
      optimized.industry?.includes('manufacturing') &&
      optimized.employeeCount !== '500+'
    ) {
      optimized.employeeCount = '500+'; // Focus on large manufacturers
    }

    // Limit search scope for better performance
    optimized.maxResults = Math.min(optimized.maxResults || 50, 25);

    return optimized;
  }

  // ========================================
  // TRUCKINGPLANET OPTIMIZATION
  // ========================================

  async optimizeTruckingPlanetSearch(
    searchCriteria: any,
    existingResults: any[] = []
  ): Promise<{ results: any[]; optimization: OptimizationResult }> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey('truckingplanet', searchCriteria);

    // Check cache first
    const cached = this.queryCache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.info(`💾 TruckingPlanet cache hit for: ${cacheKey}`);
      return {
        results: cached.results,
        optimization: {
          originalQueries: 1,
          optimizedQueries: 0,
          costSavings: this.platformConfigs.truckingplanet.baseCostPerQuery,
          performanceImprovement: Date.now() - startTime,
          cacheHits: 1,
        },
      };
    }

    // Apply optimization filters
    const optimizedCriteria =
      this.optimizeTruckingPlanetCriteria(searchCriteria);

    // Simulate API call with optimizations
    const results = await this.simulateOptimizedSearch(
      'truckingplanet',
      optimizedCriteria
    );

    // Cache results
    this.queryCache.set(cacheKey, {
      results,
      timestamp: Date.now(),
      criteria: optimizedCriteria,
    });

    // Update usage stats
    this.updateUsageStats(
      'truckingplanet',
      1,
      this.platformConfigs.truckingplanet.baseCostPerQuery *
        this.platformConfigs.truckingplanet.optimizationMultiplier
    );

    return {
      results,
      optimization: {
        originalQueries: 1,
        optimizedQueries: 1,
        costSavings:
          this.platformConfigs.truckingplanet.baseCostPerQuery *
          (1 - this.platformConfigs.truckingplanet.optimizationMultiplier),
        performanceImprovement: Date.now() - startTime,
        cacheHits: 0,
      },
    };
  }

  private optimizeTruckingPlanetCriteria(criteria: any): any {
    // Focus on high-urgency signals only
    const optimized = { ...criteria };

    // Skip low-potential leads
    if (optimized.urgencyLevel === 'LOW' || !optimized.urgencyLevel) {
      optimized.skip = true;
      return optimized;
    }

    // Prioritize critical and high urgency
    if (!['CRITICAL', 'HIGH'].includes(optimized.urgencyLevel)) {
      optimized.skip = true;
      return optimized;
    }

    // Filter by capacity issues
    if (!optimized.capacityIssue && !optimized.contractExpiring) {
      optimized.skip = true;
      return optimized;
    }

    return optimized;
  }

  // ========================================
  // FMCSA OPTIMIZATION
  // ========================================

  async optimizeFMCSASearch(
    searchCriteria: any,
    existingResults: any[] = []
  ): Promise<{ results: any[]; optimization: OptimizationResult }> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey('fmcsa', searchCriteria);

    // Check cache first
    const cached = this.queryCache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.info(`💾 FMCSA cache hit for: ${cacheKey}`);
      return {
        results: cached.results,
        optimization: {
          originalQueries: 1,
          optimizedQueries: 0,
          costSavings: this.platformConfigs.fmcsa.baseCostPerQuery,
          performanceImprovement: Date.now() - startTime,
          cacheHits: 1,
        },
      };
    }

    // Apply optimization filters
    const optimizedCriteria = this.optimizeFMCSACriteria(searchCriteria);

    // Simulate API call with optimizations
    const results = await this.simulateOptimizedSearch(
      'fmcsa',
      optimizedCriteria
    );

    // Cache results
    this.queryCache.set(cacheKey, {
      results,
      timestamp: Date.now(),
      criteria: optimizedCriteria,
    });

    // Update usage stats
    this.updateUsageStats(
      'fmcsa',
      1,
      this.platformConfigs.fmcsa.baseCostPerQuery *
        this.platformConfigs.fmcsa.optimizationMultiplier
    );

    return {
      results,
      optimization: {
        originalQueries: 1,
        optimizedQueries: 1,
        costSavings:
          this.platformConfigs.fmcsa.baseCostPerQuery *
          (1 - this.platformConfigs.fmcsa.optimizationMultiplier),
        performanceImprovement: Date.now() - startTime,
        cacheHits: 0,
      },
    };
  }

  private optimizeFMCSACriteria(criteria: any): any {
    // Focus on actionable violations only
    const optimized = { ...criteria };

    // Skip minor infractions
    const minorViolations = ['paperwork', 'administrative', 'warning'];
    if (
      minorViolations.some((v) =>
        optimized.violationType?.toLowerCase().includes(v)
      )
    ) {
      optimized.skip = true;
      return optimized;
    }

    // Prioritize critical violations
    if (!optimized.safetyRating || optimized.safetyRating === 'Satisfactory') {
      optimized.skip = true;
      return optimized;
    }

    // Focus on recent violations (last 12 months)
    if (optimized.violationAge && optimized.violationAge > 12) {
      optimized.skip = true;
      return optimized;
    }

    return optimized;
  }

  // ========================================
  // SHARED OPTIMIZATION METHODS
  // ========================================

  private generateCacheKey(platform: string, criteria: any): string {
    const criteriaString = JSON.stringify(criteria);
    const hash = this.simpleHash(criteriaString);
    return `${platform}_${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private isCacheValid(timestamp: number): boolean {
    const cacheAge = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return cacheAge < maxAge;
  }

  private async simulateOptimizedSearch(
    platform: string,
    criteria: any
  ): Promise<any[]> {
    // Simulate API response delay
    await new Promise((resolve) =>
      setTimeout(resolve, 100 + Math.random() * 200)
    );

    if (criteria.skip) {
      return []; // Skip this search
    }

    // Simulate optimized results based on platform
    const baseResults = Math.floor(Math.random() * 20) + 5;
    const optimizedResults = Math.floor(
      baseResults * this.platformConfigs[platform].optimizationMultiplier
    );

    return Array.from({ length: optimizedResults }, (_, i) => ({
      id: `${platform}_${Date.now()}_${i}`,
      platform,
      optimized: true,
      score: Math.floor(Math.random() * 40) + 60,
      timestamp: new Date().toISOString(),
    }));
  }

  private updateUsageStats(
    platform: string,
    queries: number,
    cost: number
  ): void {
    const existing = this.usageStats.get(platform) || {
      queries: 0,
      cost: 0,
      timestamp: Date.now(),
    };

    this.usageStats.set(platform, {
      queries: existing.queries + queries,
      cost: existing.cost + cost,
      timestamp: Date.now(),
    });
  }

  // ========================================
  // REPORTING AND ANALYTICS
  // ========================================

  getOptimizationStats(): {
    platforms: Record<
      string,
      {
        queries: number;
        cost: number;
        savings: number;
        efficiency: number;
      }
    >;
    totalSavings: number;
    cacheHitRate: number;
  } {
    const platforms: Record<string, any> = {};
    let totalSavings = 0;
    let totalQueries = 0;
    let totalOptimizedQueries = 0;

    for (const [platform, config] of Object.entries(this.platformConfigs)) {
      const stats = this.usageStats.get(platform) || {
        queries: 0,
        cost: 0,
        timestamp: 0,
      };
      const originalCost = stats.queries * config.baseCostPerQuery;
      const savings = originalCost - stats.cost;
      const efficiency = originalCost > 0 ? (savings / originalCost) * 100 : 0;

      platforms[platform] = {
        queries: stats.queries,
        cost: Math.round(stats.cost * 100) / 100,
        savings: Math.round(savings * 100) / 100,
        efficiency: Math.round(efficiency * 100) / 100,
      };

      totalSavings += savings;
      totalQueries += stats.queries;
      totalOptimizedQueries += stats.queries;
    }

    // Calculate cache hit rate
    const cacheSize = this.queryCache.size;
    const totalRequests = totalQueries + cacheSize; // Approximate
    const cacheHitRate =
      totalRequests > 0 ? (cacheSize / totalRequests) * 100 : 0;

    return {
      platforms,
      totalSavings: Math.round(totalSavings * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
    };
  }

  // Cleanup old cache entries
  cleanup(): void {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.queryCache.delete(key);
      }
    }

    console.info(`🧹 Cleaned up old platform optimization cache entries`);
  }
}

// Export singleton instance
export const platformOptimizationService = new PlatformOptimizationService();

// Auto-cleanup every 24 hours
setInterval(
  () => {
    platformOptimizationService.cleanup();
  },
  24 * 60 * 60 * 1000
);
