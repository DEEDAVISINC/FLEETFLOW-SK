/**
 * Utility to enhance DEPOINTE staff with adaptive learning capabilities
 * Provides default learning configurations for different staff roles
 */

import { DEPOINTEStaffMember } from '../components/DEPOINTEStaffRoster';

// Default adaptive learning configurations by department
const LEARNING_CONFIGS = {
  Accounting: {
    enabled: true,
    learningLevel: 'advanced' as const,
    adaptationStrengths: [
      'Financial pattern recognition',
      'Client payment behavior analysis',
      'Expense categorization optimization',
      'Invoice accuracy improvement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  'IT Support': {
    enabled: true,
    learningLevel: 'expert' as const,
    adaptationStrengths: [
      'Technical problem diagnosis',
      'User communication adaptation',
      'Solution effectiveness tracking',
      'System performance optimization',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  'Freight Operations': {
    enabled: true,
    learningLevel: 'expert' as const,
    adaptationStrengths: [
      'Route optimization learning',
      'Carrier performance pattern recognition',
      'Load matching efficiency improvement',
      'Market trend adaptation',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  'Business Development': {
    enabled: true,
    learningLevel: 'expert' as const,
    adaptationStrengths: [
      'Lead qualification accuracy',
      'Conversion rate optimization',
      'Prospect behavior analysis',
      'Communication style adaptation',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Logistics: {
    enabled: true,
    learningLevel: 'advanced' as const,
    adaptationStrengths: [
      'Supply chain optimization',
      'Demand forecasting',
      'Resource allocation efficiency',
      'Customer satisfaction improvement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Sales: {
    enabled: true,
    learningLevel: 'expert' as const,
    adaptationStrengths: [
      'Sales process optimization',
      'Customer objection handling',
      'Closing technique adaptation',
      'Relationship building enhancement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Brokerage: {
    enabled: true,
    learningLevel: 'expert' as const,
    adaptationStrengths: [
      'Market rate prediction',
      'Carrier-shipper matching',
      'Negotiation strategy optimization',
      'Risk assessment improvement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Compliance: {
    enabled: true,
    learningLevel: 'advanced' as const,
    adaptationStrengths: [
      'Regulatory change adaptation',
      'Documentation accuracy improvement',
      'Audit preparation optimization',
      'Risk mitigation enhancement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  'Customer Support': {
    enabled: true,
    learningLevel: 'advanced' as const,
    adaptationStrengths: [
      'Issue resolution efficiency',
      'Customer satisfaction optimization',
      'Communication tone adaptation',
      'Escalation prevention',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Recruiting: {
    enabled: true,
    learningLevel: 'advanced' as const,
    adaptationStrengths: [
      'Candidate screening optimization',
      'Interview process improvement',
      'Onboarding efficiency',
      'Retention rate enhancement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Scheduling: {
    enabled: true,
    learningLevel: 'intermediate' as const,
    adaptationStrengths: [
      'Resource allocation optimization',
      'Time management efficiency',
      'Conflict resolution',
      'Productivity enhancement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Analytics: {
    enabled: true,
    learningLevel: 'expert' as const,
    adaptationStrengths: [
      'Data pattern recognition',
      'Predictive modeling improvement',
      'Insight generation enhancement',
      'Report customization',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
  Marketing: {
    enabled: true,
    learningLevel: 'advanced' as const,
    adaptationStrengths: [
      'Campaign effectiveness optimization',
      'Audience targeting improvement',
      'Message personalization',
      'ROI enhancement',
    ],
    continuousImprovement: true,
    personalizedResponses: true,
    contextAwareness: true,
  },
};

// Default configuration for departments not listed above
const DEFAULT_LEARNING_CONFIG = {
  enabled: true,
  learningLevel: 'intermediate' as const,
  adaptationStrengths: [
    'Task completion optimization',
    'Communication effectiveness',
    'User satisfaction improvement',
    'Performance enhancement',
  ],
  continuousImprovement: true,
  personalizedResponses: true,
  contextAwareness: true,
};

/**
 * Enhance a staff member with adaptive learning capabilities
 */
export function enhanceStaffWithAdaptiveLearning(
  staffMember: Omit<DEPOINTEStaffMember, 'adaptiveLearning'>
): DEPOINTEStaffMember {
  const config =
    LEARNING_CONFIGS[staffMember.department as keyof typeof LEARNING_CONFIGS] ||
    DEFAULT_LEARNING_CONFIG;

  return {
    ...staffMember,
    adaptiveLearning: config,
  };
}

/**
 * Get adaptive learning configuration by department
 */
export function getLearningConfigByDepartment(department: string) {
  return (
    LEARNING_CONFIGS[department as keyof typeof LEARNING_CONFIGS] ||
    DEFAULT_LEARNING_CONFIG
  );
}

/**
 * Get all available learning levels
 */
export const LEARNING_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const;

/**
 * Get learning level description
 */
export function getLearningLevelDescription(
  level: (typeof LEARNING_LEVELS)[number]
): string {
  const descriptions = {
    beginner: 'Learning basic patterns and establishing baseline performance',
    intermediate: 'Adapting to common scenarios and building specializations',
    advanced: 'Sophisticated pattern recognition and proactive adaptations',
    expert: 'Advanced predictive capabilities and autonomous optimization',
  };

  return descriptions[level];
}

/**
 * Calculate learning maturity score based on profile
 */
export function calculateLearningMaturity(
  totalInteractions: number,
  successRate: number,
  userSatisfaction: number
): number {
  // Weight factors
  const interactionWeight = 0.3;
  const successWeight = 0.4;
  const satisfactionWeight = 0.3;

  // Normalize interaction count (logarithmic scale, capped at 1000)
  const normalizedInteractions = Math.min(
    Math.log10(totalInteractions + 1) / 3,
    1
  );

  // Normalize success rate (0-100 to 0-1)
  const normalizedSuccess = successRate / 100;

  // Normalize satisfaction (0-10 to 0-1)
  const normalizedSatisfaction = userSatisfaction / 10;

  // Calculate weighted score
  const maturityScore =
    (normalizedInteractions * interactionWeight +
      normalizedSuccess * successWeight +
      normalizedSatisfaction * satisfactionWeight) *
    100;

  return Math.round(maturityScore);
}

/**
 * Get recommended learning level based on maturity score
 */
export function getRecommendedLearningLevel(
  maturityScore: number
): (typeof LEARNING_LEVELS)[number] {
  if (maturityScore >= 85) return 'expert';
  if (maturityScore >= 70) return 'advanced';
  if (maturityScore >= 50) return 'intermediate';
  return 'beginner';
}

/**
 * Validate adaptive learning configuration
 */
export function validateLearningConfig(config: any): boolean {
  return (
    typeof config.enabled === 'boolean' &&
    LEARNING_LEVELS.includes(config.learningLevel) &&
    Array.isArray(config.adaptationStrengths) &&
    typeof config.continuousImprovement === 'boolean' &&
    typeof config.personalizedResponses === 'boolean' &&
    typeof config.contextAwareness === 'boolean'
  );
}
