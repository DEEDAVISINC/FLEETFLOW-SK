/**
 * Internal Learning Triggers
 * Functions to automatically record learning interactions from various parts of the app
 */

import { DEPOINTEAdaptiveLearningService } from '../services/DEPOINTEAdaptiveLearningService';

// Global learning service instance
let learningService: DEPOINTEAdaptiveLearningService | null = null;

const getLearningService = () => {
  if (!learningService) {
    learningService = new DEPOINTEAdaptiveLearningService();
  }
  return learningService;
};

/**
 * Record a learning interaction from email communication
 */
export const recordEmailInteraction = async (
  staffId: string,
  emailContent: string,
  userContext: any,
  outcome: any
) => {
  try {
    const service = getLearningService();
    await service.recordInteraction({
      staffId,
      interactionType: 'email',
      userContext,
      content: {
        input: emailContent,
        response: '',
        tone: 'professional',
        approach: 'direct',
      },
      outcome,
    });
  } catch (error) {
    console.log('Learning recording failed (non-critical):', error);
  }
};

/**
 * Record a learning interaction from phone call
 */
export const recordCallInteraction = async (
  staffId: string,
  callNotes: string,
  userContext: any,
  outcome: any
) => {
  try {
    const service = getLearningService();
    await service.recordInteraction({
      staffId,
      interactionType: 'call',
      userContext,
      content: {
        input: callNotes,
        response: '',
        tone: 'conversational',
        approach: 'personal',
      },
      outcome,
    });
  } catch (error) {
    console.log('Learning recording failed (non-critical):', error);
  }
};

/**
 * Record a learning interaction from task completion
 */
export const recordTaskInteraction = async (
  staffId: string,
  taskDescription: string,
  userContext: any,
  outcome: any
) => {
  try {
    const service = getLearningService();
    await service.recordInteraction({
      staffId,
      interactionType: 'task',
      userContext,
      content: {
        input: taskDescription,
        response: '',
        tone: 'efficient',
        approach: 'focused',
      },
      outcome,
    });
  } catch (error) {
    console.log('Learning recording failed (non-critical):', error);
  }
};

/**
 * Get adaptive suggestions for staff member
 */
export const getAdaptiveSuggestions = (staffId: string) => {
  try {
    const service = getLearningService();
    return service.getImprovementSuggestions(staffId);
  } catch (error) {
    return [];
  }
};

/**
 * Get learning analytics for staff member
 */
export const getStaffLearningAnalytics = (staffId: string) => {
  try {
    const service = getLearningService();
    return service.getStaffLearningAnalytics(staffId);
  } catch (error) {
    return null;
  }
};

/**
 * Get lead nurturing strategies for a specific scenario
 */
export const getLeadNurturingGuidance = (
  staffId: string,
  scenario?: {
    leadSource?: string;
    fleetSize?: string;
    urgency?: string;
    serviceInterest?: string;
  }
) => {
  try {
    const service = getLearningService();
    return service.getLeadNurturingStrategies(staffId, scenario);
  } catch (error) {
    console.log('Lead nurturing guidance unavailable:', error);
    return {
      strategies: [],
      talkingPoints: [],
      expectedOutcome: '',
    };
  }
};

/**
 * Get database engagement strategies for contact management
 */
export const getDatabaseEngagementGuidance = (
  staffId: string,
  contactContext?: {
    lastActivityDays?: number;
    engagementScore?: number;
    fleetSize?: number;
    recentActions?: string[];
  }
) => {
  try {
    const service = getLearningService();
    return service.getDatabaseEngagementStrategies(staffId, contactContext);
  } catch (error) {
    console.log('Database engagement guidance unavailable:', error);
    return {
      segment: null,
      strategies: [],
      behavioralSignals: [],
      recommendations: [],
    };
  }
};

/**
 * Get pipeline management and forecasting guidance for deal reviews
 */
export const getPipelineManagementGuidance = (
  staffId: string,
  dealContext?: {
    account?: string;
    arr?: number;
    stage?: string;
    closeDate?: Date;
    exitCriteriaMet?: number;
    totalExitCriteria?: number;
    hasTimeline?: boolean;
    hasBusinessInitiative?: boolean;
  }
) => {
  try {
    const service = getLearningService();
    return service.getPipelineManagementGuidance(staffId, dealContext);
  } catch (error) {
    console.log('Pipeline management guidance unavailable:', error);
    return {
      stageDetails: null,
      riskAssessment: null,
      dealReviewScript: [],
      nextSteps: null,
    };
  }
};

/**
 * Get acquisition guidance for converting prospects (Shipper & Carrier)
 * Includes industry-specific strategies, role-based approaches, objection handling, and nurture sequences
 */
export const getAcquisitionGuidance = (
  staffId: string,
  context?: {
    acquisitionType?: 'shipper' | 'carrier';
    industry?: string;
    decisionMakerRole?: string;
    leadStage?: string;
    painPoint?: string;
    objectionType?: string;
    priority?: string;
    qualificationData?: {
      industry?: string;
      volume?: number;
      budget?: boolean;
      authority?: boolean;
      need?: boolean;
      timeline?: boolean;
      freightType?: string;
      technology?: boolean;
      growth?: boolean;
    };
  }
) => {
  try {
    const service = getLearningService();
    return service.getAcquisitionGuidance(staffId, context);
  } catch (error) {
    console.log('Acquisition guidance unavailable:', error);
    return {
      industryGuidance: null,
      roleInsights: null,
      objectionHandling: null,
      valueProposition: null,
      nurtureSequence: null,
      qualificationScore: null,
      recommendedActions: [],
      trainingInsights: undefined,
    };
  }
};

/**
 * Get fundraising preparation and investor relations guidance
 */
export const getFundraisingPreparationGuidance = async (
  staffId: string,
  fundraisingContext?: {
    stage?: 'preparation' | 'execution' | 'followup';
    roundType?: 'seed' | 'series-a' | 'growth';
    timeline?: '6-months' | '3-months' | '1-month' | 'immediate';
    focusArea?:
      | 'investor-relations'
      | 'financial-planning'
      | 'data-room'
      | 'weak-spots'
      | 'investor-selection'
      | 'metrics-optimization'
      | 'capital-allocation';
  }
): Promise<{
  strategies: string[];
  preparationSteps: string[];
  investorTargeting: string[];
  riskMitigation: string[];
  successMetrics: string[];
  recommendedActions: string[];
}> => {
  try {
    const context = fundraisingContext || {};

    // Get relevant prompts from adaptive learning service
    const adaptiveLearning = await import(
      '../services/DEPOINTEAdaptiveLearningService'
    );
    const fundraisingPrompts =
      adaptiveLearning.depointeAdaptiveLearningService.acquisitionTrainingPrompts.filter(
        (prompt) => prompt.category === 'Fundraising & Investor Relations'
      );

    const strategies = fundraisingPrompts.map((p) => p.title);
    const preparationSteps = [
      'Cultivate investor relationships 6-12 months early',
      'Build financial plan with compelling growth story',
      'Create comprehensive data room 1-2 months ahead',
      'Identify and prepare for potential weak spots',
      'Select investors based on stage and mandate',
      'Optimize win rate and retention metrics',
      'Strategically allocate capital for growth leverage',
    ];

    const investorTargeting = [
      'Early stage: Focus on board quality and partnership fit',
      'Late stage: Prioritize long-term mandate and follow-on capital',
      'Target sovereign wealth funds, mutual funds, crossover hedge funds',
      'Avoid investors needing near-term liquidity',
      'Seek strategic alignment and value-add capabilities',
      'Build relationships through mutual value exchange',
    ];

    const riskMitigation = [
      'Conduct thorough competitive analysis and differentiation',
      'Validate product-market fit with extensive customer data',
      'Ground financial projections in historical performance',
      'Address team gaps through hiring or advisory board',
      'Obtain necessary regulatory certifications early',
      'Prepare contingency plans for major assumptions',
    ];

    const successMetrics = [
      'Win rate as indicator of product-market fit',
      'Retention rate to avoid leaky bucket problem',
      'Sales velocity for early-stage validation',
      'Capital efficiency and unit economics',
      'Investor relationship quality and engagement',
      'Data room completeness and responsiveness',
    ];

    return {
      strategies,
      preparationSteps,
      investorTargeting,
      riskMitigation,
      successMetrics,
      recommendedActions: [
        'Start investor outreach 6-12 months before capital need',
        'Create compelling financial narrative backed by execution',
        'Position as transportation category leader with metrics',
        'Prepare comprehensive data room early',
        'Identify and address all potential weak spots proactively',
        'Focus on win rate and retention optimization',
        'Allocate capital strategically for maximum growth leverage',
      ],
    };
  } catch (error) {
    console.error('Error getting fundraising guidance:', error);
    return {
      strategies: [],
      preparationSteps: [],
      investorTargeting: [],
      riskMitigation: [],
      successMetrics: [],
      recommendedActions: [],
    };
  }
};

/**
 * Get financial technology and AI implementation guidance
 */
export const getFinancialTechnologyGuidance = async (
  staffId: string,
  financialContext?: {
    systemType?:
      | 'accounting'
      | 'fp&a'
      | 'close-management'
      | 'ap-automation'
      | 'ar-management'
      | 'expense-management'
      | 'roi-analysis'
      | 'implementation';
    businessSize?: 'small' | 'mid-market' | 'enterprise';
    timeline?: 'immediate' | '3-months' | '6-months' | '12-months';
    priorityArea?:
      | 'cost-reduction'
      | 'efficiency'
      | 'compliance'
      | 'insights'
      | 'automation';
  }
): Promise<{
  platformRecommendations: string[];
  implementationStrategy: string[];
  roiProjections: string[];
  riskConsiderations: string[];
  successMetrics: string[];
  recommendedActions: string[];
}> => {
  try {
    const context = financialContext || {};

    // Get relevant prompts from adaptive learning service
    const adaptiveLearning = await import(
      '../services/DEPOINTEAdaptiveLearningService'
    );
    const financialPrompts =
      adaptiveLearning.depointeAdaptiveLearningService.acquisitionTrainingPrompts.filter(
        (prompt) =>
          prompt.category === 'Financial Technology & AI Implementation'
      );

    const platformRecommendations = [
      'Sage Intacct with AI for transportation financial excellence',
      'Workday Adaptive Planning for seasonal freight forecasting',
      'BlackLine for transportation close automation',
      'Stampli for carrier settlement collaboration',
      'HighRadius for transportation AR optimization',
      'Ramp for fuel card and driver expense management',
      'QuickBooks Advanced for small carrier payment tracking',
    ];

    const implementationStrategy = [
      '90-day sprint: Foundation (Days 1-30) → Activation (31-60) → Optimization (61-90)',
      'Start with data cleanup and requirements finalization',
      'Activate AI features early in implementation',
      'Focus on change management and user adoption',
      'Measure ROI from day one with baseline metrics',
      'Avoid big bang approach - phase implementation strategically',
    ];

    const roiProjections = [
      'Small Business: 280-670% ROI over 3 years',
      'Mid-Market: 200-400% ROI over 3 years',
      'Enterprise: 180-300% ROI over 3 years',
      'Payback Period: 2-24 months depending on size',
      'Processing Time Reduction: 75-90% across all systems',
      'Manual Effort Reduction: 80-95% in repetitive tasks',
    ];

    const riskConsiderations = [
      'Insufficient data cleanup leading to poor AI accuracy',
      'Inadequate training causing user resistance',
      'Big bang implementation overwhelming teams',
      'Ignoring change management and communication',
      'Customization overload complicating maintenance',
      'Post-implementation neglect reducing long-term value',
    ];

    const successMetrics = [
      'Financial close time reduction (target: 15 days → 3 days)',
      'Manual data entry reduction (target: 75%+)',
      'Transaction processing accuracy (target: 95%+)',
      'Cash flow visibility (real-time vs. monthly)',
      'User adoption rate (target: 80%+ within 90 days)',
      'ROI achievement (target: 25% in Q1, 150%+ by year end)',
    ];

    return {
      platformRecommendations,
      implementationStrategy,
      roiProjections,
      riskConsiderations,
      successMetrics,
      recommendedActions: [
        'Evaluate current financial processes and identify automation opportunities',
        'Select 2-3 priority systems based on business impact and ROI',
        'Start with data cleanup and establish implementation team',
        'Plan 90-day sprint with clear milestones and success metrics',
        'Invest heavily in change management and user training',
        'Measure and communicate ROI throughout implementation',
        'Scale AI adoption gradually while optimizing existing features',
      ],
    };
  } catch (error) {
    console.error('Error getting financial technology guidance:', error);
    return {
      platformRecommendations: [],
      implementationStrategy: [],
      roiProjections: [],
      riskConsiderations: [],
      successMetrics: [],
      recommendedActions: [],
    };
  }
};

/**
 * Legacy alias for backward compatibility
 */
export const getShipperAcquisitionGuidance = getAcquisitionGuidance;
