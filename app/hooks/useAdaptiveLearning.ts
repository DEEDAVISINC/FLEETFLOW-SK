/**
 * React Hook for DEPOINTE AI Adaptive Learning Integration
 * Provides easy access to adaptive learning capabilities across components
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEPOINTEAdaptiveLearningService,
  LearningInteraction,
  StaffLearningProfile,
  UserPreferenceProfile,
} from '../services/DEPOINTEAdaptiveLearningService';

// Global instance
let learningService: DEPOINTEAdaptiveLearningService | null = null;

const getLearningService = () => {
  if (!learningService) {
    learningService = new DEPOINTEAdaptiveLearningService();
  }
  return learningService;
};

export interface UseAdaptiveLearningReturn {
  // Learning recording
  recordInteraction: (
    interaction: Omit<LearningInteraction, 'id' | 'timestamp'>
  ) => Promise<void>;

  // Adaptive responses
  getAdaptiveResponse: (
    staffId: string,
    context: LearningInteraction['userContext'],
    inputMessage: string
  ) => Promise<{
    suggestedTone: string;
    suggestedApproach: string;
    personalizations: Record<string, any>;
    confidenceLevel: number;
  }>;

  // Analytics
  getStaffAnalytics: (staffId: string) => StaffLearningProfile | null;
  getUserProfile: (userId: string) => UserPreferenceProfile | null;
  getImprovementSuggestions: (staffId: string) => string[];

  // System stats
  systemStats: {
    totalInteractions: number;
    staffProfiles: number;
    userProfiles: number;
    patterns: number;
    averageSuccessRate: number;
  };

  // Loading states
  isLearning: boolean;
  isRecording: boolean;
}

export function useAdaptiveLearning(): UseAdaptiveLearningReturn {
  const [isLearning, setIsLearning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalInteractions: 0,
    staffProfiles: 0,
    userProfiles: 0,
    patterns: 0,
    averageSuccessRate: 0,
  });

  const service = getLearningService();

  // Update system stats periodically
  useEffect(() => {
    const updateStats = () => {
      const stats = service.exportLearningData();
      setSystemStats(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [service]);

  const recordInteraction = useCallback(
    async (interaction: Omit<LearningInteraction, 'id' | 'timestamp'>) => {
      setIsRecording(true);
      try {
        await service.recordInteraction(interaction);

        // Update stats after recording
        const stats = service.exportLearningData();
        setSystemStats(stats);

        console.info('🧠 Interaction recorded and learning updated');
      } catch (error) {
        console.error('❌ Failed to record learning interaction:', error);
        throw error;
      } finally {
        setIsRecording(false);
      }
    },
    [service]
  );

  const getAdaptiveResponse = useCallback(
    async (
      staffId: string,
      context: LearningInteraction['userContext'],
      inputMessage: string
    ) => {
      setIsLearning(true);
      try {
        const response = await service.getAdaptiveResponse(
          staffId,
          context,
          inputMessage
        );
        return response;
      } catch (error) {
        console.error('❌ Failed to get adaptive response:', error);
        throw error;
      } finally {
        setIsLearning(false);
      }
    },
    [service]
  );

  const getStaffAnalytics = useCallback(
    (staffId: string) => {
      return service.getStaffLearningAnalytics(staffId);
    },
    [service]
  );

  const getUserProfile = useCallback(
    (userId: string) => {
      return service.getUserPreferenceProfile(userId);
    },
    [service]
  );

  const getImprovementSuggestions = useCallback(
    (staffId: string) => {
      return service.getImprovementSuggestions(staffId);
    },
    [service]
  );

  return {
    recordInteraction,
    getAdaptiveResponse,
    getStaffAnalytics,
    getUserProfile,
    getImprovementSuggestions,
    systemStats,
    isLearning,
    isRecording,
  };
}

// ============================================================================
// UTILITY HOOKS FOR SPECIFIC USE CASES
// ============================================================================

/**
 * Hook for email interactions learning
 */
export function useEmailLearning() {
  const { recordInteraction, getAdaptiveResponse } = useAdaptiveLearning();

  const recordEmailInteraction = useCallback(
    async (
      staffId: string,
      staffName: string,
      emailSubject: string,
      emailContent: string,
      userContext: LearningInteraction['userContext'],
      outcome: {
        success: boolean;
        userSatisfaction: number;
        userFeedback?: string;
      }
    ) => {
      await recordInteraction({
        staffId,
        staffName,
        interactionType: 'email',
        userContext,
        content: {
          input: emailSubject,
          response: emailContent,
          tone: 'professional', // This could be detected from content
          approach: 'responsive',
        },
        outcome: {
          ...outcome,
          goalAchieved: outcome.success,
          followUpRequired: outcome.userSatisfaction < 8,
        },
        metrics: {
          responseTime: 1000, // This could be actual response time
          accuracy: outcome.success ? 90 : 60,
          appropriateness: outcome.userSatisfaction * 10,
          effectiveness: outcome.success ? 85 : 45,
        },
      });
    },
    [recordInteraction]
  );

  const getEmailSuggestions = useCallback(
    async (
      staffId: string,
      context: LearningInteraction['userContext'],
      emailSubject: string
    ) => {
      return await getAdaptiveResponse(staffId, context, emailSubject);
    },
    [getAdaptiveResponse]
  );

  return {
    recordEmailInteraction,
    getEmailSuggestions,
  };
}

/**
 * Hook for task assignment learning
 */
export function useTaskLearning() {
  const { recordInteraction, getStaffAnalytics } = useAdaptiveLearning();

  const recordTaskOutcome = useCallback(
    async (
      staffId: string,
      staffName: string,
      taskDescription: string,
      userContext: LearningInteraction['userContext'],
      outcome: {
        completed: boolean;
        quality: number; // 1-10
        timeliness: number; // 1-10
        userFeedback?: string;
      }
    ) => {
      await recordInteraction({
        staffId,
        staffName,
        interactionType: 'task',
        userContext,
        content: {
          input: taskDescription,
          response: 'Task execution',
          tone: 'professional',
          approach: 'systematic',
        },
        outcome: {
          success: outcome.completed,
          userSatisfaction: (outcome.quality + outcome.timeliness) / 2,
          goalAchieved: outcome.completed,
          followUpRequired: outcome.quality < 7,
          userFeedback: outcome.userFeedback,
        },
        metrics: {
          responseTime: 5000, // Task completion time would be tracked
          accuracy: outcome.quality * 10,
          appropriateness: outcome.timeliness * 10,
          effectiveness: outcome.completed ? 90 : 30,
        },
      });
    },
    [recordInteraction]
  );

  const getTaskRecommendations = useCallback(
    (staffId: string) => {
      const analytics = getStaffAnalytics(staffId);
      if (!analytics) return [];

      const recommendations = [];

      if (analytics.learningMetrics.successRate < 80) {
        recommendations.push('Focus on task completion accuracy');
      }

      if (analytics.learningMetrics.averageUserSatisfaction < 7) {
        recommendations.push('Improve communication during task execution');
      }

      return recommendations;
    },
    [getStaffAnalytics]
  );

  return {
    recordTaskOutcome,
    getTaskRecommendations,
  };
}

/**
 * Hook for communication learning across channels
 */
export function useCommunicationLearning() {
  const { recordInteraction, getAdaptiveResponse } = useAdaptiveLearning();

  const recordCommunication = useCallback(
    async (
      staffId: string,
      staffName: string,
      channel: 'email' | 'call' | 'chat',
      message: string,
      response: string,
      userContext: LearningInteraction['userContext'],
      outcome: {
        resolved: boolean;
        satisfaction: number;
        followUpNeeded: boolean;
      }
    ) => {
      const interactionType =
        channel === 'call' ? 'call' : channel === 'chat' ? 'support' : 'email';

      await recordInteraction({
        staffId,
        staffName,
        interactionType,
        userContext,
        content: {
          input: message,
          response,
          tone: 'helpful',
          approach: 'solution-focused',
        },
        outcome: {
          success: outcome.resolved,
          userSatisfaction: outcome.satisfaction,
          goalAchieved: outcome.resolved,
          followUpRequired: outcome.followUpNeeded,
        },
        metrics: {
          responseTime: 2000,
          accuracy: outcome.resolved ? 85 : 50,
          appropriateness: outcome.satisfaction * 10,
          effectiveness: outcome.resolved ? 80 : 40,
        },
      });
    },
    [recordInteraction]
  );

  const getCommunicationSuggestions = useCallback(
    async (
      staffId: string,
      context: LearningInteraction['userContext'],
      message: string
    ) => {
      return await getAdaptiveResponse(staffId, context, message);
    },
    [getAdaptiveResponse]
  );

  return {
    recordCommunication,
    getCommunicationSuggestions,
  };
}
