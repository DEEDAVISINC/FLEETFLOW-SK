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
    return service.getStaffAnalytics(staffId);
  } catch (error) {
    return null;
  }
};
