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
 * Legacy alias for backward compatibility
 */
export const getShipperAcquisitionGuidance = getAcquisitionGuidance;
