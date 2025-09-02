/**
 * MSP Marketing Learning Service
 * Internal AI learning resource for DEPOINTE AI staff development
 * Contains the 6 proven strategies from Robin Robins' MSP Marketing Toolkit
 * This is NOT a UI component - it's for internal AI learning and development
 */

export interface MarketingStrategy {
  id: string;
  title: string;
  description: string;
  implementationSteps: string[];
  expectedResults: string[];
  commonMistakes: string[];
  successStories: string[];
  keyPrinciples: string[];
  aiApplication: string[];
  relevantRoles: string[];
}

export interface LearningProgress {
  strategyId: string;
  completed: boolean;
  appliedCount: number;
  successRate: number;
  lastApplied: Date;
}

/**
 * MSP Marketing Learning Service
 * Functions for AI staff to access and utilize marketing strategies
 */
export class MSPMarketingLearningService {
  /**
   * Get all available marketing strategies
   */
  static getAllStrategies(): MarketingStrategy[] {
    return mspMarketingStrategies;
  }

  /**
   * Get a specific strategy by ID
   */
  static getStrategyById(id: string): MarketingStrategy | undefined {
    return mspMarketingStrategies.find(strategy => strategy.id === id);
  }

  /**
   * Get strategies relevant to specific AI staff roles
   */
  static getStrategiesForRole(roleName: string): MarketingStrategy[] {
    return mspMarketingStrategies.filter(strategy =>
      strategy.relevantRoles.includes(roleName)
    );
  }

  /**
   * Get strategies by key principles
   */
  static getStrategiesByPrinciple(principle: string): MarketingStrategy[] {
    return mspMarketingStrategies.filter(strategy =>
      strategy.keyPrinciples.some(p =>
        p.toLowerCase().includes(principle.toLowerCase())
      )
    );
  }

  /**
   * Get AI-specific applications for strategies
   */
  static getAISpecificApplications(): string[] {
    const applications: string[] = [];
    mspMarketingStrategies.forEach(strategy => {
      applications.push(...strategy.aiApplication);
    });
    return [...new Set(applications)]; // Remove duplicates
  }

  /**
   * Get learning recommendations for AI staff
   */
  static getLearningRecommendations(roleName: string): {
    primaryStrategies: MarketingStrategy[];
    supportingStrategies: MarketingStrategy[];
    learningPath: string[];
  } {
    const primaryStrategies = this.getStrategiesForRole(roleName);
    const allStrategies = this.getAllStrategies();

    // Get supporting strategies (strategies that complement primary ones)
    const supportingStrategies = allStrategies.filter(strategy =>
      !primaryStrategies.some(primary => primary.id === strategy.id)
    );

    // Create learning path based on role
    const learningPath = this.generateLearningPath(roleName);

    return {
      primaryStrategies,
      supportingStrategies,
      learningPath,
    };
  }

  /**
   * Generate personalized learning path for AI staff
   */
  private static generateLearningPath(roleName: string): string[] {
    const paths: Record<string, string[]> = {
      'Desiree': [
        'Resistance Removal Sales System',
        'Value-Based Communication',
        'Lead Qualification Optimization',
        'Referral Generation Systems',
      ],
      'Cliff': [
        'Resistance Pattern Recognition',
        'Cold Prospect Engagement',
        'Psychology-Based Motivation',
        'Unseen Leadership Application',
      ],
      'Gary': [
        'Lead Scoring Algorithms',
        'Qualification Optimization',
        'Value-Based Communication',
        'Referral Network Management',
      ],
      'Will': [
        'Process Optimization Algorithms',
        'Sales Operations Psychology',
        'Performance Analytics',
        'System Implementation',
      ],
      'Ana Lytics': [
        'Data-Driven Insights',
        'Client Analytics',
        'Performance Prediction',
        'ROI Analysis',
      ],
    };

    return paths[roleName] || [
      'General Sales Psychology',
      'AI-Specific Applications',
      'Performance Optimization',
      'Continuous Learning',
    ];
  }

  /**
   * Get implementation guidance for specific strategies
   */
  static getImplementationGuidance(strategyId: string): {
    strategy: MarketingStrategy;
    implementationOrder: string[];
    successMetrics: string[];
    aiAutomationOpportunities: string[];
  } | null {
    const strategy = this.getStrategyById(strategyId);
    if (!strategy) return null;

    const implementationOrder = [
      'Assessment & Planning',
      'Foundation Setup',
      'Process Implementation',
      'Training & Optimization',
      'Measurement & Scaling',
    ];

    const successMetrics = strategy.expectedResults.map(result =>
      result.replace('%', 'percentage').replace('$', 'dollar')
    );

    const aiAutomationOpportunities = strategy.aiApplication;

    return {
      strategy,
      implementationOrder,
      successMetrics,
      aiAutomationOpportunities,
    };
  }

  /**
   * Get performance tracking recommendations
   */
  static getPerformanceTracking(roleName: string): {
    keyMetrics: string[];
    trackingFrequency: string;
    improvementAreas: string[];
  } {
    const metrics: Record<string, any> = {
      'Desiree': {
        keyMetrics: ['Conversion Rate', 'Lead Quality Score', 'Resistance Overcoming Rate'],
        trackingFrequency: 'Daily',
        improvementAreas: ['Objection Handling', 'Value Communication', 'Lead Qualification'],
      },
      'Cliff': {
        keyMetrics: ['Prospect Engagement Rate', 'Follow-up Compliance', 'Conversion Velocity'],
        trackingFrequency: 'Daily',
        improvementAreas: ['Cold Outreach Effectiveness', 'Relationship Building', 'Motivation Techniques'],
      },
    };

    return metrics[roleName] || {
      keyMetrics: ['Task Completion Rate', 'Quality Score', 'Efficiency Metrics'],
      trackingFrequency: 'Weekly',
      improvementAreas: ['Process Optimization', 'Skill Development', 'Performance Tracking'],
    };
  }
}

// Export convenience functions
export const getStrategiesForRole = MSPMarketingLearningService.getStrategiesForRole;
export const getAllStrategies = MSPMarketingLearningService.getAllStrategies;
export const getStrategyById = MSPMarketingLearningService.getStrategyById;
export const getLearningRecommendations = MSPMarketingLearningService.getLearningRecommendations;
export const getImplementationGuidance = MSPMarketingLearningService.getImplementationGuidance;
export const getPerformanceTracking = MSPMarketingLearningService.getPerformanceTracking;

// Import the strategies data
export { mspMarketingStrategies } from './MSPMarketingLearningData';
