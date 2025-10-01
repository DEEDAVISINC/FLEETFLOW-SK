/**
 * DEPOINTE AI Adaptive Learning Service
 * Implements advanced learning capabilities similar to Marblism.ai
 *
 * Features:
 * - Continuous learning from interactions
 * - Performance-based adaptation
 * - User preference personalization
 * - Success/failure pattern recognition
 * - Communication style evolution
 */

export interface LearningInteraction {
  id: string;
  staffId: string;
  staffName: string;
  interactionType:
    | 'email'
    | 'call'
    | 'task'
    | 'support'
    | 'sales'
    | 'follow_up';
  userContext: {
    userId?: string;
    companyType: string;
    communicationStyle: 'formal' | 'casual' | 'technical' | 'emotional';
    industryKnowledge: 'beginner' | 'intermediate' | 'expert';
    urgencyLevel: 'low' | 'normal' | 'high' | 'critical';
  };
  content: {
    input: string;
    response: string;
    tone: string;
    approach: string;
  };
  outcome: {
    success: boolean;
    userSatisfaction: number; // 1-10 scale
    goalAchieved: boolean;
    followUpRequired: boolean;
    userFeedback?: string;
  };
  metrics: {
    responseTime: number; // milliseconds
    accuracy: number; // 0-100
    appropriateness: number; // 0-100
    effectiveness: number; // 0-100
  };
  timestamp: Date;
}

export interface LearningPattern {
  id: string;
  staffId: string;
  patternType:
    | 'communication'
    | 'problem_solving'
    | 'user_preference'
    | 'task_optimization';
  pattern: {
    trigger: string;
    context: Record<string, any>;
    successfulApproach: string;
    failurePoints: string[];
    adaptationRules: string[];
  };
  confidence: number; // 0-100
  usageCount: number;
  successRate: number; // 0-100
  lastUpdated: Date;
}

export interface StaffLearningProfile {
  staffId: string;
  staffName: string;
  department: string;
  learningMetrics: {
    totalInteractions: number;
    successRate: number;
    averageUserSatisfaction: number;
    improvementTrend: number; // positive/negative growth rate
    specialtyAreas: string[];
    weaknessAreas: string[];
  };
  adaptations: {
    communicationStyle: Record<string, number>; // style preferences by context
    problemSolvingApproaches: Record<string, number>;
    userTypeHandling: Record<string, number>;
    responsePatterns: Record<string, number>;
  };
  personalizedCapabilities: {
    preferredTone: string;
    expertiseLevel: Record<string, number>;
    handlingStrategies: Record<string, string>;
    learnedPreferences: Record<string, any>;
  };
  lastLearningUpdate: Date;
}

export interface UserPreferenceProfile {
  userId: string;
  companyId?: string;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'technical' | 'supportive';
    responseSpeed: 'immediate' | 'thoughtful' | 'detailed';
    detailLevel: 'brief' | 'standard' | 'comprehensive';
    followUpPreference: 'proactive' | 'reactive' | 'minimal';
    channelPreference: 'email' | 'phone' | 'chat' | 'any';
  };
  interactions: {
    totalCount: number;
    positiveOutcomes: number;
    preferredStaffMembers: string[];
    problematicAreas: string[];
    successfulApproaches: string[];
  };
  learningInsights: {
    behaviorPatterns: string[];
    motivationFactors: string[];
    communicationTriggers: string[];
    satisfaction_drivers: string[];
  };
  lastUpdated: Date;
}

export class DEPOINTEAdaptiveLearningService {
  private learningInteractions: LearningInteraction[] = [];
  private learningPatterns: LearningPattern[] = [];
  private staffProfiles: Map<string, StaffLearningProfile> = new Map();
  private userProfiles: Map<string, UserPreferenceProfile> = new Map();

  constructor() {
    this.initializeLearningSystem();
    console.info('🧠 DEPOINTE AI Adaptive Learning System initialized');
  }

  // ============================================================================
  // INTERACTION LEARNING
  // ============================================================================

  /**
   * Record and learn from a new interaction
   */
  async recordInteraction(
    interaction: Omit<LearningInteraction, 'id' | 'timestamp'>
  ): Promise<void> {
    const learningInteraction: LearningInteraction = {
      ...interaction,
      id: `learning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // Store interaction
    this.learningInteractions.push(learningInteraction);

    // Update staff learning profile
    await this.updateStaffLearningProfile(learningInteraction);

    // Update user preference profile
    await this.updateUserPreferenceProfile(learningInteraction);

    // Identify new patterns
    await this.identifyNewPatterns(learningInteraction);

    // Adapt based on outcomes
    await this.adaptFromOutcome(learningInteraction);

    // Persist learning data
    await this.persistLearningData();

    console.info(
      `🧠 Learning recorded for ${interaction.staffName}: Success=${interaction.outcome.success}, Satisfaction=${interaction.outcome.userSatisfaction}/10`
    );
  }

  /**
   * Get adaptive response for a given context
   */
  async getAdaptiveResponse(
    staffId: string,
    context: LearningInteraction['userContext'],
    inputMessage: string
  ): Promise<{
    suggestedTone: string;
    suggestedApproach: string;
    personalizations: Record<string, any>;
    confidenceLevel: number;
  }> {
    const staffProfile = this.staffProfiles.get(staffId);
    const userProfile = context.userId
      ? this.userProfiles.get(context.userId)
      : null;

    if (!staffProfile) {
      return this.getDefaultResponse();
    }

    // Find relevant patterns
    const relevantPatterns = this.findRelevantPatterns(
      staffId,
      context,
      inputMessage
    );

    // Calculate adaptive response
    const adaptiveResponse = this.calculateAdaptiveResponse(
      staffProfile,
      userProfile,
      relevantPatterns,
      context
    );

    return adaptiveResponse;
  }

  // ============================================================================
  // PATTERN RECOGNITION
  // ============================================================================

  private async identifyNewPatterns(
    interaction: LearningInteraction
  ): Promise<void> {
    // Analyze communication patterns
    if (
      interaction.outcome.success &&
      interaction.outcome.userSatisfaction >= 8
    ) {
      await this.identifySuccessPattern(interaction);
    } else if (
      !interaction.outcome.success ||
      interaction.outcome.userSatisfaction <= 4
    ) {
      await this.identifyFailurePattern(interaction);
    }

    // Analyze user preference patterns
    await this.identifyUserPreferencePattern(interaction);

    // Analyze task optimization patterns
    await this.identifyTaskOptimizationPattern(interaction);
  }

  private async identifySuccessPattern(
    interaction: LearningInteraction
  ): Promise<void> {
    const pattern: LearningPattern = {
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      staffId: interaction.staffId,
      patternType: 'communication',
      pattern: {
        trigger: `${interaction.interactionType}_${interaction.userContext.communicationStyle}_${interaction.userContext.urgencyLevel}`,
        context: {
          userType: interaction.userContext.companyType,
          urgency: interaction.userContext.urgencyLevel,
          knowledge: interaction.userContext.industryKnowledge,
        },
        successfulApproach: interaction.content.approach,
        failurePoints: [],
        adaptationRules: [
          `Use ${interaction.content.tone} tone for ${interaction.userContext.communicationStyle} users`,
          `Apply ${interaction.content.approach} approach for ${interaction.userContext.urgencyLevel} priority`,
        ],
      },
      confidence: 75, // Start with moderate confidence
      usageCount: 1,
      successRate: 100,
      lastUpdated: new Date(),
    };

    this.learningPatterns.push(pattern);
  }

  private async identifyFailurePattern(
    interaction: LearningInteraction
  ): Promise<void> {
    // Find existing patterns that might have led to failure
    const relevantPatterns = this.findRelevantPatterns(
      interaction.staffId,
      interaction.userContext,
      interaction.content.input
    );

    // Update existing patterns or create failure avoidance patterns
    for (const pattern of relevantPatterns) {
      pattern.pattern.failurePoints.push(interaction.content.approach);
      pattern.confidence = Math.max(pattern.confidence - 10, 0);
      pattern.successRate = this.recalculateSuccessRate(pattern.id);
    }
  }

  private findRelevantPatterns(
    staffId: string,
    context: LearningInteraction['userContext'],
    input: string
  ): LearningPattern[] {
    return this.learningPatterns.filter(
      (pattern) =>
        pattern.staffId === staffId &&
        this.isPatternRelevant(pattern, context, input)
    );
  }

  private isPatternRelevant(
    pattern: LearningPattern,
    context: LearningInteraction['userContext'],
    input: string
  ): boolean {
    // Check if pattern context matches current context
    const contextMatch =
      pattern.pattern.context.userType === context.companyType ||
      pattern.pattern.context.urgency === context.urgencyLevel ||
      pattern.pattern.context.knowledge === context.industryKnowledge;

    // Check if trigger words are present
    const triggerMatch =
      pattern.pattern.trigger.includes(context.communicationStyle) ||
      pattern.pattern.trigger.includes(context.urgencyLevel);

    return contextMatch && triggerMatch;
  }

  // ============================================================================
  // STAFF PROFILE MANAGEMENT
  // ============================================================================

  private async updateStaffLearningProfile(
    interaction: LearningInteraction
  ): Promise<void> {
    let profile = this.staffProfiles.get(interaction.staffId);

    if (!profile) {
      profile = this.createInitialStaffProfile(
        interaction.staffId,
        interaction.staffName
      );
    }

    // Update metrics
    profile.learningMetrics.totalInteractions++;
    profile.learningMetrics.averageUserSatisfaction =
      this.calculateRunningAverage(
        profile.learningMetrics.averageUserSatisfaction,
        interaction.outcome.userSatisfaction,
        profile.learningMetrics.totalInteractions
      );

    // Update success rate
    const successCount = this.learningInteractions.filter(
      (i) => i.staffId === interaction.staffId && i.outcome.success
    ).length;
    profile.learningMetrics.successRate =
      (successCount / profile.learningMetrics.totalInteractions) * 100;

    // Update adaptations based on successful interactions
    if (
      interaction.outcome.success &&
      interaction.outcome.userSatisfaction >= 7
    ) {
      this.updateStaffAdaptations(profile, interaction);
    }

    // Identify specialty and weakness areas
    this.updateSpecialtyAreas(profile, interaction);

    profile.lastLearningUpdate = new Date();
    this.staffProfiles.set(interaction.staffId, profile);
  }

  private createInitialStaffProfile(
    staffId: string,
    staffName: string
  ): StaffLearningProfile {
    // Get department from staff roster
    const department = this.getStaffDepartment(staffId);

    return {
      staffId,
      staffName,
      department,
      learningMetrics: {
        totalInteractions: 0,
        successRate: 0,
        averageUserSatisfaction: 0,
        improvementTrend: 0,
        specialtyAreas: [],
        weaknessAreas: [],
      },
      adaptations: {
        communicationStyle: {},
        problemSolvingApproaches: {},
        userTypeHandling: {},
        responsePatterns: {},
      },
      personalizedCapabilities: {
        preferredTone: 'professional',
        expertiseLevel: {},
        handlingStrategies: {},
        learnedPreferences: {},
      },
      lastLearningUpdate: new Date(),
    };
  }

  private updateStaffAdaptations(
    profile: StaffLearningProfile,
    interaction: LearningInteraction
  ): void {
    // Update communication style preferences
    const styleKey = `${interaction.userContext.communicationStyle}_${interaction.userContext.urgencyLevel}`;
    profile.adaptations.communicationStyle[styleKey] =
      (profile.adaptations.communicationStyle[styleKey] || 0) + 1;

    // Update problem-solving approaches
    profile.adaptations.problemSolvingApproaches[interaction.content.approach] =
      (profile.adaptations.problemSolvingApproaches[
        interaction.content.approach
      ] || 0) + 1;

    // Update user type handling
    profile.adaptations.userTypeHandling[interaction.userContext.companyType] =
      (profile.adaptations.userTypeHandling[
        interaction.userContext.companyType
      ] || 0) + 1;

    // Update preferred tone based on success
    if (interaction.outcome.userSatisfaction >= 8) {
      profile.personalizedCapabilities.preferredTone = interaction.content.tone;
    }
  }

  // ============================================================================
  // USER PREFERENCE LEARNING
  // ============================================================================

  private async updateUserPreferenceProfile(
    interaction: LearningInteraction
  ): Promise<void> {
    if (!interaction.userContext.userId) return;

    let userProfile = this.userProfiles.get(interaction.userContext.userId);

    if (!userProfile) {
      userProfile = this.createInitialUserProfile(
        interaction.userContext.userId
      );
    }

    // Update interaction counts
    userProfile.interactions.totalCount++;
    if (interaction.outcome.success) {
      userProfile.interactions.positiveOutcomes++;
    }

    // Update preferred staff members
    if (
      interaction.outcome.success &&
      interaction.outcome.userSatisfaction >= 8
    ) {
      if (
        !userProfile.interactions.preferredStaffMembers.includes(
          interaction.staffId
        )
      ) {
        userProfile.interactions.preferredStaffMembers.push(
          interaction.staffId
        );
      }
    }

    // Learn communication preferences
    if (interaction.outcome.userSatisfaction >= 7) {
      userProfile.preferences.communicationStyle =
        interaction.userContext.communicationStyle;
      userProfile.interactions.successfulApproaches.push(
        interaction.content.approach
      );
    }

    // Identify behavior patterns
    this.updateUserBehaviorPatterns(userProfile, interaction);

    userProfile.lastUpdated = new Date();
    this.userProfiles.set(interaction.userContext.userId, userProfile);
  }

  private createInitialUserProfile(userId: string): UserPreferenceProfile {
    return {
      userId,
      preferences: {
        communicationStyle: 'professional' as any,
        responseSpeed: 'standard' as any,
        detailLevel: 'standard',
        followUpPreference: 'proactive',
        channelPreference: 'email',
      },
      interactions: {
        totalCount: 0,
        positiveOutcomes: 0,
        preferredStaffMembers: [],
        problematicAreas: [],
        successfulApproaches: [],
      },
      learningInsights: {
        behaviorPatterns: [],
        motivationFactors: [],
        communicationTriggers: [],
        satisfaction_drivers: [],
      },
      lastUpdated: new Date(),
    };
  }

  // ============================================================================
  // ADAPTIVE RESPONSE GENERATION
  // ============================================================================

  private calculateAdaptiveResponse(
    staffProfile: StaffLearningProfile,
    userProfile: UserPreferenceProfile | null,
    patterns: LearningPattern[],
    context: LearningInteraction['userContext']
  ): {
    suggestedTone: string;
    suggestedApproach: string;
    personalizations: Record<string, any>;
    confidenceLevel: number;
  } {
    let confidenceLevel = 50; // Base confidence

    // Get tone suggestion from staff adaptations
    const toneScores = this.scoreAdaptationOptions(
      staffProfile.adaptations.communicationStyle,
      context
    );
    const suggestedTone =
      staffProfile.personalizedCapabilities.preferredTone || 'professional';

    // Get approach suggestion from patterns
    const bestPattern = patterns.find(
      (p) => p.confidence > 70 && p.successRate > 75
    );
    const suggestedApproach =
      bestPattern?.pattern.successfulApproach || 'collaborative';

    // Calculate confidence based on learning data
    if (staffProfile.learningMetrics.totalInteractions > 10) {
      confidenceLevel += 20;
    }
    if (staffProfile.learningMetrics.successRate > 80) {
      confidenceLevel += 15;
    }
    if (userProfile && userProfile.interactions.totalCount > 3) {
      confidenceLevel += 15;
    }

    // Personalizations based on user profile
    const personalizations: Record<string, any> = {};
    if (userProfile) {
      personalizations.detailLevel = userProfile.preferences.detailLevel;
      personalizations.followUpStyle =
        userProfile.preferences.followUpPreference;
      personalizations.channelPreference =
        userProfile.preferences.channelPreference;
    }

    return {
      suggestedTone,
      suggestedApproach,
      personalizations,
      confidenceLevel: Math.min(confidenceLevel, 100),
    };
  }

  private getDefaultResponse() {
    return {
      suggestedTone: 'professional',
      suggestedApproach: 'collaborative',
      personalizations: {},
      confidenceLevel: 30,
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private async persistLearningData(): Promise<void> {
    // In production, this would save to database
    // For now, use localStorage for client-side, skip for server-side
    if (typeof window !== 'undefined') {
      try {
        const learningData = {
          interactions: this.learningInteractions.slice(-1000), // Keep last 1000
          patterns: this.learningPatterns,
          staffProfiles: Array.from(this.staffProfiles.entries()),
          userProfiles: Array.from(this.userProfiles.entries()),
        };

        localStorage.setItem(
          'depointe-adaptive-learning',
          JSON.stringify(learningData)
        );
        console.info('🧠 Adaptive learning data persisted');
      } catch (error) {
        console.warn('⚠️ Failed to persist learning data:', error);
      }
    }
  }

  private async initializeLearningSystem(): Promise<void> {
    // Load existing learning data (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('depointe-adaptive-learning');
        if (stored) {
          const data = JSON.parse(stored);
          this.learningInteractions = data.interactions || [];
          this.learningPatterns = data.patterns || [];
          this.staffProfiles = new Map(data.staffProfiles || []);
          this.userProfiles = new Map(data.userProfiles || []);
          console.info('🧠 Existing learning data loaded');
        }
      } catch (error) {
        console.warn('⚠️ Failed to load existing learning data:', error);
      }
    }
  }

  private calculateRunningAverage(
    currentAvg: number,
    newValue: number,
    count: number
  ): number {
    return (currentAvg * (count - 1) + newValue) / count;
  }

  private recalculateSuccessRate(patternId: string): number {
    const interactions = this.learningInteractions.filter(
      (i) =>
        this.learningPatterns.find((p) => p.id === patternId)?.staffId ===
        i.staffId
    );
    const successCount = interactions.filter((i) => i.outcome.success).length;
    return interactions.length > 0
      ? (successCount / interactions.length) * 100
      : 0;
  }

  private scoreAdaptationOptions(
    adaptations: Record<string, number>,
    context: LearningInteraction['userContext']
  ): Record<string, number> {
    const scores: Record<string, number> = {};
    const contextKey = `${context.communicationStyle}_${context.urgencyLevel}`;

    Object.entries(adaptations).forEach(([key, count]) => {
      if (
        key.includes(context.communicationStyle) ||
        key.includes(context.urgencyLevel)
      ) {
        scores[key] = count;
      }
    });

    return scores;
  }

  private getStaffDepartment(staffId: string): string {
    // This would integrate with the actual staff roster
    const departments: Record<string, string> = {
      'desiree-001': 'Business Development',
      'cliff-002': 'Business Development',
      gary: 'Business Development',
      logan: 'Freight Operations',
      miles: 'Freight Operations',
      // Add more mappings as needed
    };
    return departments[staffId] || 'General';
  }

  private updateSpecialtyAreas(
    profile: StaffLearningProfile,
    interaction: LearningInteraction
  ): void {
    if (
      interaction.outcome.success &&
      interaction.outcome.userSatisfaction >= 8
    ) {
      const specialtyKey = `${interaction.interactionType}_${interaction.userContext.companyType}`;
      if (!profile.learningMetrics.specialtyAreas.includes(specialtyKey)) {
        profile.learningMetrics.specialtyAreas.push(specialtyKey);
      }
    } else if (interaction.outcome.userSatisfaction <= 4) {
      const weaknessKey = `${interaction.interactionType}_${interaction.userContext.companyType}`;
      if (!profile.learningMetrics.weaknessAreas.includes(weaknessKey)) {
        profile.learningMetrics.weaknessAreas.push(weaknessKey);
      }
    }
  }

  private updateUserBehaviorPatterns(
    profile: UserPreferenceProfile,
    interaction: LearningInteraction
  ): void {
    // Analyze timing patterns
    const hour = new Date().getHours();
    if (interaction.outcome.success) {
      profile.learningInsights.behaviorPatterns.push(
        `successful_contact_hour_${hour}`
      );
    }

    // Analyze communication triggers
    if (interaction.outcome.userSatisfaction >= 8) {
      profile.learningInsights.communicationTriggers.push(
        interaction.content.tone
      );
      profile.learningInsights.satisfaction_drivers.push(
        interaction.content.approach
      );
    }

    // Keep only recent patterns (last 50)
    [
      'behaviorPatterns',
      'communicationTriggers',
      'satisfaction_drivers',
    ].forEach((key) => {
      const arr = profile.learningInsights[
        key as keyof typeof profile.learningInsights
      ] as string[];
      if (arr.length > 50) {
        profile.learningInsights[key as keyof typeof profile.learningInsights] =
          arr.slice(-50) as any;
      }
    });
  }

  private async identifyUserPreferencePattern(
    interaction: LearningInteraction
  ): Promise<void> {
    // Implementation for user preference pattern identification
    // This would analyze user behavior across interactions
  }

  private async identifyTaskOptimizationPattern(
    interaction: LearningInteraction
  ): Promise<void> {
    // Implementation for task optimization pattern identification
    // This would analyze task completion efficiency and effectiveness
  }

  private async adaptFromOutcome(
    interaction: LearningInteraction
  ): Promise<void> {
    // Implementation for adapting based on interaction outcomes
    // This would adjust AI behavior based on success/failure patterns
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Get learning analytics for a staff member
   */
  getStaffLearningAnalytics(staffId: string): StaffLearningProfile | null {
    return this.staffProfiles.get(staffId) || null;
  }

  /**
   * Get user preference insights
   */
  getUserPreferenceProfile(userId: string): UserPreferenceProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  /**
   * Get adaptive learning suggestions for improving a staff member
   */
  getImprovementSuggestions(staffId: string): string[] {
    const profile = this.staffProfiles.get(staffId);
    if (!profile) return [];

    const suggestions: string[] = [];

    // Success rate suggestions
    if (profile.learningMetrics.successRate < 70) {
      suggestions.push('Focus on understanding user context before responding');
      suggestions.push(
        'Review successful interaction patterns from high-performing colleagues'
      );
    }

    // User satisfaction suggestions
    if (profile.learningMetrics.averageUserSatisfaction < 7) {
      suggestions.push('Adapt communication tone to match user preferences');
      suggestions.push(
        'Increase follow-up proactivity for better user experience'
      );
    }

    // Weakness area improvements
    profile.learningMetrics.weaknessAreas.forEach((area) => {
      suggestions.push(
        `Improve ${area.replace('_', ' ')} handling capabilities`
      );
    });

    return suggestions;
  }

  /**
   * Export learning data for analysis
   */
  exportLearningData(): {
    totalInteractions: number;
    staffProfiles: number;
    userProfiles: number;
    patterns: number;
    averageSuccessRate: number;
  } {
    const staffSuccessRates = Array.from(this.staffProfiles.values()).map(
      (p) => p.learningMetrics.successRate
    );

    return {
      totalInteractions: this.learningInteractions.length,
      staffProfiles: this.staffProfiles.size,
      userProfiles: this.userProfiles.size,
      patterns: this.learningPatterns.length,
      averageSuccessRate:
        staffSuccessRates.reduce((a, b) => a + b, 0) /
          staffSuccessRates.length || 0,
    };
  }
}
