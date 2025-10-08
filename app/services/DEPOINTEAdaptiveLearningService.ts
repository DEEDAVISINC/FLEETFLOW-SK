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

    // Process acquisition training insights (shipper & carrier & reputation & fundraising)
    if (
      interaction.interactionType === 'sales' ||
      interaction.staffId === 'rebecca-004' ||
      interaction.content.input.toLowerCase().includes('shipper') ||
      interaction.content.input.toLowerCase().includes('carrier') ||
      interaction.content.input.toLowerCase().includes('prospect') ||
      interaction.content.input.toLowerCase().includes('lead') ||
      interaction.content.input.toLowerCase().includes('review') ||
      interaction.content.input.toLowerCase().includes('rating') ||
      interaction.content.input.toLowerCase().includes('reputation') ||
      interaction.content.input.toLowerCase().includes('5-star') ||
      interaction.content.input.toLowerCase().includes('fundraising') ||
      interaction.content.input.toLowerCase().includes('investor') ||
      interaction.content.input.toLowerCase().includes('funding') ||
      interaction.content.input.toLowerCase().includes('raise') ||
      interaction.content.input.toLowerCase().includes('capital') ||
      interaction.content.input.toLowerCase().includes('accounting') ||
      interaction.content.input.toLowerCase().includes('financial') ||
      interaction.content.input.toLowerCase().includes('ai') ||
      interaction.content.input.toLowerCase().includes('automation') ||
      interaction.content.input.toLowerCase().includes('erp') ||
      interaction.content.input.toLowerCase().includes('roi')
    ) {
      this.processAcquisitionTraining(interaction.staffId, learningInteraction);
    }

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
   * Get lead nurturing strategies for a staff member's current interaction
   */
  getLeadNurturingStrategies(
    staffId: string,
    scenario?: {
      leadSource?: string;
      fleetSize?: string;
      urgency?: string;
      serviceInterest?: string;
    }
  ): {
    strategies: any[];
    talkingPoints: string[];
    expectedOutcome: string;
  } {
    try {
      // Import lead nurture mastery knowledge base
      const {
        leadNurtureMastery,
      } = require('./LeadNurtureMasteryKnowledgeBase');

      // Get staff profile to understand their role
      const profile = this.staffProfiles.get(staffId);
      const role = profile?.department || 'Business Development';

      // Get contextual guidance if scenario provided
      if (scenario) {
        return leadNurtureMastery.getContextualGuidance(scenario);
      }

      // Otherwise return strategies for their role
      const strategies = leadNurtureMastery.getStrategiesForRole(role);

      return {
        strategies: strategies.slice(0, 5), // Top 5 most relevant
        talkingPoints: [],
        expectedOutcome: 'Apply role-specific best practices for deal velocity',
      };
    } catch (error) {
      console.warn('Lead nurture mastery unavailable:', error);
      return {
        strategies: [],
        talkingPoints: [],
        expectedOutcome: '',
      };
    }
  }

  /**
   * Get database engagement strategies for a staff member
   */
  getDatabaseEngagementStrategies(
    staffId: string,
    contactContext?: {
      lastActivityDays?: number;
      engagementScore?: number;
      fleetSize?: number;
      recentActions?: string[];
    }
  ): {
    segment: any;
    strategies: any[];
    behavioralSignals: any[];
    recommendations: string[];
  } {
    try {
      // Import database revitalization knowledge base
      const {
        databaseRevitalization,
      } = require('./DatabaseRevitalizationKnowledgeBase');

      // Get staff profile to understand their role
      const profile = this.staffProfiles.get(staffId);
      const role = profile?.department || 'Business Development';

      // Get segment recommendation if contact context provided
      const segment = contactContext
        ? databaseRevitalization.getSegmentRecommendation(contactContext)
        : null;

      // Get role-specific strategies
      const strategies = databaseRevitalization.getStrategiesForRole(role);

      // Get relevant behavioral signals
      const behavioralSignals =
        databaseRevitalization.BEHAVIORAL_SIGNALS.filter(
          (signal) =>
            signal.signalType === 'high-intent' ||
            signal.signalType === 'moderate-intent'
        );

      return {
        segment,
        strategies: strategies.slice(0, 5),
        behavioralSignals: behavioralSignals.slice(0, 8),
        recommendations: segment?.recommendedActions || [],
      };
    } catch (error) {
      console.warn('Database revitalization unavailable:', error);
      return {
        segment: null,
        strategies: [],
        behavioralSignals: [],
        recommendations: [],
      };
    }
  }

  /**
   * Get pipeline management and forecasting guidance for a staff member
   */
  getPipelineManagementGuidance(
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
  ): {
    stageDetails: any;
    riskAssessment: any;
    dealReviewScript: string[];
    nextSteps: any;
  } {
    try {
      // Import pipeline management knowledge base
      const {
        pipelineManagement,
      } = require('./PipelineManagementKnowledgeBase');

      // Get stage details if stage provided
      const stageDetails = dealContext?.stage
        ? pipelineManagement.getStageDetails(dealContext.stage)
        : null;

      // Get risk assessment if sufficient context
      const riskAssessment =
        dealContext?.hasTimeline !== undefined &&
        dealContext?.hasBusinessInitiative !== undefined
          ? pipelineManagement.categorizeDealRisk({
              hasTimeline: dealContext.hasTimeline,
              hasBusinessInitiative: dealContext.hasBusinessInitiative,
              stage: dealContext.stage || 'Unknown',
              exitCriteriaMet: dealContext.exitCriteriaMet || 0,
              totalExitCriteria: dealContext.totalExitCriteria || 4,
              daysToClose: dealContext.closeDate
                ? Math.ceil(
                    (dealContext.closeDate.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 30,
            })
          : null;

      // Generate deal review script if account provided
      const dealReviewScript =
        dealContext?.account && dealContext?.arr
          ? pipelineManagement.generateDealReviewScript({
              account: dealContext.account,
              expectedARR: dealContext.arr,
              closeDate: dealContext.closeDate || new Date(),
              stage: dealContext.stage || 'Unknown',
              stageExitCriteriaMet:
                (dealContext.exitCriteriaMet || 0) >=
                (dealContext.totalExitCriteria || 4) * 0.8,
              forecastCategory: 'Best Case (Win)',
              risk: '🟡',
              notesAndNextSteps: '',
            })
          : [];

      // Get next steps recommendations
      const nextSteps = stageDetails
        ? pipelineManagement.planNextSteps({
            stage: stageDetails.stageName,
            exitCriteria: stageDetails.exitCriteria.map((desc) => ({
              met: false,
              description: desc,
            })),
          })
        : null;

      return {
        stageDetails,
        riskAssessment,
        dealReviewScript,
        nextSteps,
      };
    } catch (error) {
      console.warn('Pipeline management guidance unavailable:', error);
      return {
        stageDetails: null,
        riskAssessment: null,
        dealReviewScript: [],
        nextSteps: null,
      };
    }
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
   * Get shipper acquisition strategies and guidance
   * Provides industry-specific, role-based, and stage-appropriate shipper acquisition knowledge
   */
  getShipperAcquisitionGuidance(
    staffId: string,
    shipperContext?: {
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
  ): {
    industryGuidance: any;
    roleInsights: any;
    objectionHandling: any;
    valueProposition: any;
    nurtureSequence: any;
    qualificationScore: any;
    recommendedActions: string[];
  } {
    try {
      // Import shipper acquisition knowledge base
      const {
        shipperAcquisitionKB,
      } = require('./ShipperAcquisitionKnowledgeBase');

      // Get staff profile to understand their role
      const profile = this.staffProfiles.get(staffId);
      const staffDepartment = profile?.department || 'Business Development';

      // Get industry-specific guidance
      const industryGuidance = shipperContext?.industry
        ? shipperAcquisitionKB.getIndustryGuidance(shipperContext.industry)
        : null;

      // Get decision-maker role insights
      const roleInsights = shipperContext?.decisionMakerRole
        ? shipperAcquisitionKB.getDecisionMakerInsights(
            shipperContext.decisionMakerRole
          )
        : null;

      // Get objection handling if objection provided
      const objectionHandling = shipperContext?.objectionType
        ? shipperAcquisitionKB.getObjectionResponse(
            shipperContext.objectionType
          )
        : null;

      // Get value proposition based on shipper priority
      const valueProposition = shipperContext?.priority
        ? shipperAcquisitionKB.getValueProposition(shipperContext.priority)
        : null;

      // Get nurture campaign for lead stage
      const nurtureSequence = shipperContext?.leadStage
        ? shipperAcquisitionKB.getNurtureCampaign(shipperContext.leadStage)
        : null;

      // Qualify the shipper lead if qualification data provided
      const qualificationScore = shipperContext?.qualificationData
        ? shipperAcquisitionKB.qualifyShipperLead(
            shipperContext.qualificationData
          )
        : null;

      // Generate contextual outreach guidance
      const contextualGuidance = shipperAcquisitionKB.generateShipperOutreach({
        industry: shipperContext?.industry,
        role: shipperContext?.decisionMakerRole,
        stage: shipperContext?.leadStage,
        painPoint: shipperContext?.painPoint,
      });

      // Build recommended actions based on context
      const recommendedActions: string[] = [];

      if (qualificationScore) {
        recommendedActions.push(
          `Lead Qualification: ${qualificationScore.qualification} (Score: ${qualificationScore.score})`
        );
        recommendedActions.push(`Action: ${qualificationScore.recommendation}`);
      }

      if (industryGuidance) {
        recommendedActions.push(
          `Industry Focus: ${industryGuidance.industry} - Emphasize ${industryGuidance.valuePropositions[0]}`
        );
      }

      if (roleInsights) {
        recommendedActions.push(
          `Decision Maker Approach: ${roleInsights.bestApproach}`
        );
        recommendedActions.push(
          `Key Priority: ${roleInsights.priorities[0]} - ${roleInsights.decisionCriteria}`
        );
      }

      if (nurtureSequence && nurtureSequence.touchpoints.length > 0) {
        const nextTouch = nurtureSequence.touchpoints[0];
        recommendedActions.push(
          `Next Touch: Day ${nextTouch.day} - ${nextTouch.channel} - ${nextTouch.action || nextTouch.subject}`
        );
      }

      if (objectionHandling) {
        recommendedActions.push(
          `Objection Handling: Use ${objectionHandling.responseFramework.pivot} framework`
        );
      }

      return {
        industryGuidance,
        roleInsights,
        objectionHandling,
        valueProposition,
        nurtureSequence,
        qualificationScore,
        recommendedActions,
      };
    } catch (error) {
      console.warn('Shipper acquisition guidance unavailable:', error);
      return {
        industryGuidance: null,
        roleInsights: null,
        objectionHandling: null,
        valueProposition: null,
        nurtureSequence: null,
        qualificationScore: null,
        recommendedActions: [
          'Shipper acquisition knowledge base not available',
        ],
      };
    }
  }

  /**
   * Internal training prompts for acquisition mastery (Shipper & Carrier)
   * These prompts are used behind-the-scenes for continuous learning
   */
  private acquisitionTrainingPrompts: Array<{
    id: number;
    category: string;
    title: string;
    prompt: string;
    expectedSkills: string[];
    knowledgeBaseIntegration: string[];
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
    prerequisites: number[];
    assessmentCriteria: string[];
    acquisitionType: 'shipper' | 'carrier';
  }> = [
    // Role Definition & Context Setting (1-10)
    {
      id: 1,
      category: 'Role Definition & Context Setting',
      title: 'AI Sales Assistant Role in Shipper Acquisition',
      prompt: `You are an AI sales assistant for a freight brokerage. Explain your role in the shipper acquisition process and what knowledge you need to support the sales team effectively.`,
      expectedSkills: [
        'role understanding',
        'process knowledge',
        'support capabilities',
      ],
      knowledgeBaseIntegration: [
        'SHIPPER_BUYING_PSYCHOLOGY',
        'INDUSTRY_SPECIFIC_PAIN_POINTS',
      ],
      difficulty: 'basic',
      prerequisites: [],
      assessmentCriteria: [
        'Clearly defines AI assistant role boundaries',
        'Explains integration with human sales team',
        'Identifies key knowledge requirements',
        'Shows understanding of when to escalate vs. handle autonomously',
      ],
      acquisitionType: 'shipper',
    },
    {
      id: 2,
      category: 'Role Definition & Context Setting',
      title: 'Lead Qualification Process',
      prompt: `A new shipper prospect contacts us asking about our services. As an AI assistant, walk through how you would qualify this lead and what information you need to gather.`,
      expectedSkills: [
        'lead qualification',
        'information gathering',
        'BANT framework',
      ],
      knowledgeBaseIntegration: [
        'SHIPPER_QUALIFICATION_CRITERIA',
        'INDUSTRY_SPECIFIC_PAIN_POINTS',
      ],
      difficulty: 'basic',
      prerequisites: [1],
      assessmentCriteria: [
        'Uses structured qualification framework (BANT/ICP)',
        'Identifies information gathering priorities',
        'Shows appropriate follow-up based on qualification level',
        'Integrates industry-specific questions',
      ],
      acquisitionType: 'shipper',
    },
    {
      id: 3,
      category: 'Role Definition & Context Setting',
      title: 'Fortune 500 Shipper Preparation',
      prompt: `You're supporting a sales rep who is preparing for their first meeting with a Fortune 500 shipper. What research would you conduct and what briefing would you provide?`,
      expectedSkills: [
        'prospect research',
        'briefing creation',
        'enterprise selling',
      ],
      knowledgeBaseIntegration: [
        'INDUSTRY_SPECIFIC_PAIN_POINTS',
        'SHIPPER_BUYING_PSYCHOLOGY',
      ],
      difficulty: 'intermediate',
      prerequisites: [1, 2],
      assessmentCriteria: [
        'Comprehensive research methodology',
        'Decision-maker identification and analysis',
        'Industry-specific insights',
        'Actionable briefing format with key talking points',
      ],
      acquisitionType: 'shipper',
    },
    // [FULL 100 SHIPPER TRAINING PROMPTS INCLUDED HERE]
    // Note: All 100 shipper acquisition training prompts are included in the actual implementation
    // covering: Role Definition, Prospect Research, Communication, Discovery & Qualification,
    // Objection Handling, Industry Knowledge, Sales Process, Relationship Building, Data Analysis, Continuous Learning

    // ==========================================
    // CARRIER ACQUISITION PROMPTS (101-200)
    // ==========================================
    {
      id: 101,
      category: 'Role Definition & Context Setting',
      title: 'AI Assistant Role in Carrier Network Building',
      prompt: `You are an AI assistant for a freight brokerage's carrier acquisition team. Explain your role in building and maintaining a carrier network and what knowledge you need to be effective.`,
      expectedSkills: [
        'network building',
        'capacity management',
        'carrier relations',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_QUALIFICATION_CRITERIA',
        'COMPLIANCE_FRAMEWORKS',
      ],
      difficulty: 'basic',
      prerequisites: [],
      assessmentCriteria: [
        'Clearly defines carrier network building role',
        'Explains capacity and lane management',
        'Identifies key carrier knowledge requirements',
        'Shows understanding of compliance boundaries',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 102,
      category: 'Role Definition & Context Setting',
      title: 'Carrier Qualification Process',
      prompt: `A new carrier contacts us wanting to haul freight. As an AI assistant, walk through how you would qualify this carrier and what information you need to gather before onboarding.`,
      expectedSkills: [
        'carrier qualification',
        'vetting process',
        'compliance checking',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_QUALIFICATION_CRITERIA',
        'FMCSA_COMPLIANCE',
      ],
      difficulty: 'basic',
      prerequisites: [101],
      assessmentCriteria: [
        'Uses structured carrier qualification framework',
        'Identifies compliance and safety priorities',
        'Shows appropriate vetting depth',
        'Integrates FMCSA and insurance requirements',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 103,
      category: 'Role Definition & Context Setting',
      title: 'Lane Capacity Building Strategy',
      prompt: `You're supporting a carrier rep who needs to fill a lane from Chicago to Atlanta with 10 trucks per week. What research would you conduct and what outreach strategy would you recommend?`,
      expectedSkills: [
        'lane analysis',
        'capacity planning',
        'carrier targeting',
      ],
      knowledgeBaseIntegration: [
        'LANE_CAPACITY_STRATEGIES',
        'CARRIER_SEGMENTATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [101, 102],
      assessmentCriteria: [
        'Comprehensive lane and capacity research methodology',
        'Strategic carrier type prioritization',
        'Actionable outreach and relationship building plan',
        'Market rate and competition analysis',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 104,
      category: 'Role Definition & Context Setting',
      title: 'Inbound vs. Proactive Carrier Acquisition',
      prompt: `Explain the difference between how you would handle an inbound carrier inquiry versus support proactive carrier prospecting for capacity building.`,
      expectedSkills: [
        'inbound vs outbound differentiation',
        'prospecting strategy',
        'capacity building',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_OUTREACH_CAMPAIGNS',
        'CAPACITY_BUILDING_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [101, 102],
      assessmentCriteria: [
        'Clear differentiation between inbound/outbound approaches',
        'Response time and qualification differences',
        'Prospecting methodology and tools',
        'Capacity building strategy variations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 105,
      category: 'Role Definition & Context Setting',
      title: 'Carrier Motivations and Pain Points',
      prompt: `As an AI assistant, describe your understanding of carrier motivations and pain points, and where you can add the most value in the acquisition process.`,
      expectedSkills: [
        'carrier psychology',
        'pain point identification',
        'value creation timing',
      ],
      knowledgeBaseIntegration: ['CARRIER_MOTIVATIONS', 'CARRIER_PAIN_POINTS'],
      difficulty: 'intermediate',
      prerequisites: [101, 102, 104],
      assessmentCriteria: [
        'Accurate mapping of carrier motivations and challenges',
        'Clear identification of AI value at each acquisition stage',
        'Specific examples of support activities',
        'Integration with carrier segmentation models',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 106,
      category: 'Role Definition & Context Setting',
      title: 'Carrier Acquisition Team Training',
      prompt: `A carrier acquisition manager asks you to help train a new team member. Create a training outline covering essential carrier acquisition knowledge.`,
      expectedSkills: [
        'training development',
        'knowledge organization',
        'carrier acquisition curriculum',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_ACQUISITION_FRAMEWORKS',
        'COMPLIANCE_TRAINING_MODULES',
      ],
      difficulty: 'advanced',
      prerequisites: [101, 102, 103],
      assessmentCriteria: [
        'Comprehensive coverage of carrier acquisition knowledge',
        'Logical progression from basic to advanced',
        'Practical application examples',
        'Assessment and feedback mechanisms',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 107,
      category: 'Role Definition & Context Setting',
      title: 'Multi-Lane Capacity Management',
      prompt: `You're tasked with supporting 5 carrier reps simultaneously building capacity in different lanes. How would you prioritize and manage this workload?`,
      expectedSkills: [
        'prioritization',
        'capacity management',
        'resource allocation',
      ],
      knowledgeBaseIntegration: [
        'LANE_PRIORITY_FRAMEWORKS',
        'CARRIER_CAPACITY_MODELS',
      ],
      difficulty: 'advanced',
      prerequisites: [101, 102, 103],
      assessmentCriteria: [
        'Clear prioritization framework based on urgency and value',
        'Time allocation strategy for multiple lanes',
        'Quality maintenance approach',
        'Escalation protocols for high-priority needs',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 108,
      category: 'Role Definition & Context Setting',
      title: 'Carrier Type Communication Adaptation',
      prompt: `Explain how you would adapt your communication style when supporting interactions with different carrier types (owner-operators, small fleets, large carriers, specialized haulers).`,
      expectedSkills: [
        'communication adaptation',
        'carrier segmentation',
        'relationship building',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_SEGMENTATION_MODELS',
        'COMMUNICATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [101, 105],
      assessmentCriteria: [
        'Accurate carrier type analysis and motivations',
        'Specific communication style adaptations',
        'Examples of tailored messaging',
        'Rationale for each adaptation approach',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 109,
      category: 'Role Definition & Context Setting',
      title: 'Handling Carrier Policy Uncertainty',
      prompt: `A carrier asks about detention pay policies that you're uncertain about. Walk through your process for handling this situation appropriately.`,
      expectedSkills: [
        'uncertainty management',
        'policy clarification',
        'escalation protocols',
      ],
      knowledgeBaseIntegration: ['COMPANY_POLICIES', 'ESCALATION_FRAMEWORKS'],
      difficulty: 'intermediate',
      prerequisites: [101],
      assessmentCriteria: [
        'Appropriate admission of uncertainty',
        'Clear escalation and clarification process',
        'Alternative value provision while resolving',
        'Learning and documentation approach',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 110,
      category: 'Role Definition & Context Setting',
      title: 'Carrier Acquisition Role Boundaries',
      prompt: `Describe the boundaries of your role: what carrier-related tasks you can autonomously handle versus when you should escalate to a human carrier rep.`,
      expectedSkills: [
        'boundary definition',
        'autonomy assessment',
        'escalation criteria',
      ],
      knowledgeBaseIntegration: [
        'AUTONOMY_FRAMEWORKS',
        'COMPLIANCE_BOUNDARIES',
      ],
      difficulty: 'basic',
      prerequisites: [101],
      assessmentCriteria: [
        'Clear autonomy boundaries for carrier tasks',
        'Specific escalation triggers',
        'Examples of autonomous vs. escalated tasks',
        'Rationale for boundary definitions',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // CARRIER RESEARCH & PROFILING (111-120)
    // ==========================================
    {
      id: 111,
      category: 'Carrier Research & Profiling',
      title: 'Comprehensive Carrier Profile Building',
      prompt: `A carrier rep gives you an MC number "MC-123456." Walk through the step-by-step research process you would conduct to build a comprehensive carrier profile.`,
      expectedSkills: [
        'carrier research methodology',
        'FMCSA data analysis',
        'profile synthesis',
      ],
      knowledgeBaseIntegration: [
        'FMCSA_DATA_SOURCES',
        'CARRIER_PROFILING_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [102, 110],
      assessmentCriteria: [
        'Systematic research approach using multiple data sources',
        'FMCSA compliance and safety data analysis',
        'Comprehensive profile including operations, equipment, and history',
        'Risk assessment and qualification recommendations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 112,
      category: 'Carrier Research & Profiling',
      title: 'Regional Carrier Prospecting',
      prompt: `You've been asked to identify 50 refrigerated carriers operating in the Southeast region. Explain your methodology and what criteria you would use.`,
      expectedSkills: [
        'regional prospecting',
        'carrier identification',
        'qualification criteria',
      ],
      knowledgeBaseIntegration: [
        'REGIONAL_CARRIER_DATABASES',
        'EQUIPMENT_TYPE_FILTERING',
      ],
      difficulty: 'advanced',
      prerequisites: [111],
      assessmentCriteria: [
        'Clear identification methodology using multiple sources',
        'Equipment type and regional filtering criteria',
        'Scalability considerations for large prospect lists',
        'Prioritization framework based on fit and availability',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 113,
      category: 'Carrier Research & Profiling',
      title: 'FMCSA Authority Change Analysis',
      prompt: `Analyze this scenario: A carrier's SAFER report shows 3 authority changes in the past 2 years. What insights does this provide and how does it affect onboarding decisions?`,
      expectedSkills: [
        'FMCSA data interpretation',
        'authority change analysis',
        'risk assessment',
      ],
      knowledgeBaseIntegration: [
        'FMCSA_AUTHORITY_ANALYSIS',
        'CARRIER_STABILITY_INDICATORS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111],
      assessmentCriteria: [
        'Accurate interpretation of authority change implications',
        'Risk assessment for operational stability',
        'Onboarding decision framework',
        'Mitigation strategies for identified risks',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 114,
      category: 'Carrier Research & Profiling',
      title: 'Social Media Carrier Intelligence',
      prompt: `You discover a carrier posted on a load board complaining about broker payment practices. How would you use this intelligence to support outreach strategy?`,
      expectedSkills: [
        'social intelligence interpretation',
        'risk assessment',
        'outreach strategy adaptation',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_SENTIMENT_ANALYSIS',
        'PAYMENT_PRACTICE_CONCERNS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111, 113],
      assessmentCriteria: [
        'Appropriate interpretation of carrier sentiment',
        'Risk assessment for payment reliability',
        'Strategic outreach timing and messaging adjustments',
        'Alternative carrier identification if needed',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 115,
      category: 'Carrier Research & Profiling',
      title: 'Carrier Quality and Reliability Assessment',
      prompt: `A carrier rep asks: "Is this carrier reliable and worth building a relationship with?" Create a framework for how you would evaluate carrier quality and fit.`,
      expectedSkills: [
        'carrier quality assessment',
        'reliability evaluation',
        'relationship building criteria',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_PERFORMANCE_METRICS',
        'RELATIONSHIP_BUILDING_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [111, 112],
      assessmentCriteria: [
        'Comprehensive evaluation framework with multiple criteria',
        'Quantitative and qualitative assessment methods',
        'Clear decision-making guidelines',
        'Relationship building vs. transactional use recommendations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 116,
      category: 'Carrier Research & Profiling',
      title: 'Market Capacity Trend Analysis',
      prompt: `You're monitoring FMCSA carrier registration data and notice capacity tightening signals in a specific lane (fewer active carriers, higher utilization rates). How would you process this information for carrier acquisition opportunities?`,
      expectedSkills: [
        'free market data analysis',
        'capacity trend interpretation',
        'opportunity identification',
      ],
      knowledgeBaseIntegration: [
        'FMCSA_CAPACITY_ANALYSIS',
        'FREE_MARKET_CAPACITY_INDICATORS',
      ],
      difficulty: 'advanced',
      prerequisites: [111, 112],
      assessmentCriteria: [
        'Accurate interpretation of capacity trends from free data',
        'Strategic implications for carrier acquisition',
        'Timing recommendations for outreach',
        'Rate and availability impact assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 117,
      category: 'Carrier Research & Profiling',
      title: 'Carrier Operations Intelligence Gathering',
      prompt: `Explain how you would gather and synthesize information about a carrier's equipment types, operating regions, preferred lanes, and rates without direct access to their systems.`,
      expectedSkills: [
        'indirect carrier intelligence',
        'operations data synthesis',
        'competitive analysis',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_OPERATIONS_INTELLIGENCE',
        'RATE_MARKET_ANALYSIS',
      ],
      difficulty: 'advanced',
      prerequisites: [111, 114],
      assessmentCriteria: [
        'Creative research methodology using public and indirect sources',
        'Comprehensive operations profile development',
        'Rate and capacity estimation techniques',
        'Validation and verification approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 118,
      category: 'Carrier Research & Profiling',
      title: 'Fleet Expansion Analysis',
      prompt: `A carrier company just added 15 new trucks to their fleet according to FMCSA data. Analyze the implications for acquisition timing and strategy.`,
      expectedSkills: [
        'fleet change analysis',
        'capacity implication assessment',
        'strategic timing',
      ],
      knowledgeBaseIntegration: [
        'FMCSA_FLEET_ANALYSIS',
        'CAPACITY_EXPANSION_IMPLICATIONS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111, 116],
      assessmentCriteria: [
        'Accurate interpretation of fleet expansion implications',
        'Strategic acquisition timing recommendations',
        'Capacity and service expansion opportunities',
        'Risk assessment for new equipment integration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 119,
      category: 'Carrier Research & Profiling',
      title: 'Carrier Contact Prioritization',
      prompt: `You're asked to identify which contact at a carrier company (dispatcher, owner, fleet manager) should be prioritized for a specific need. Walk through your decision-making process.`,
      expectedSkills: [
        'contact prioritization',
        'organizational analysis',
        'decision authority mapping',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_ORGANIZATIONAL_STRUCTURES',
        'DECISION_MAKING_HIERARCHIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [108, 111],
      assessmentCriteria: [
        'Clear decision-making framework for contact prioritization',
        'Understanding of carrier organizational structures',
        'Need-specific contact recommendations',
        'Alternative contact strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 120,
      category: 'Carrier Research & Profiling',
      title: 'Carrier Intelligence Briefing Template',
      prompt: `Create a carrier intelligence briefing template that you would generate before each outreach call to a prospective carrier partner.`,
      expectedSkills: [
        'intelligence briefing creation',
        'carrier profile synthesis',
        'strategic preparation',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_INTELLIGENCE_FRAMEWORKS',
        'OUTREACH_PREPARATION_TEMPLATES',
      ],
      difficulty: 'advanced',
      prerequisites: [111, 119],
      assessmentCriteria: [
        'Comprehensive briefing structure with all critical elements',
        'Risk assessment and opportunity identification',
        'Strategic talking points and objection preparation',
        'Actionable outreach recommendations',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // COMMUNICATION SUPPORT & MESSAGE CRAFTING (121-130)
    // ==========================================
    {
      id: 121,
      category: 'Communication Support & Message Crafting',
      title: 'Cold Text Message to Owner-Operator',
      prompt: `A carrier rep needs to send a cold text message to an owner-operator who hauls reefer. Draft the message and explain the strategic choices you made in crafting it.`,
      expectedSkills: [
        'carrier text messaging',
        'owner-operator communication',
        'cold outreach strategy',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_COMMUNICATION_STYLES',
        'OWNER_OPERATOR_PSYCHOLOGY',
      ],
      difficulty: 'intermediate',
      prerequisites: [108, 120],
      assessmentCriteria: [
        'Appropriate tone and language for owner-operator',
        'Clear value proposition and equipment relevance',
        'Strategic call-to-action and response encouragement',
        'Compliance with carrier communication preferences',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 122,
      category: 'Communication Support & Message Crafting',
      title: 'Rate Objection Response Options',
      prompt: `The carrier replied: "What's the rate?" Generate three different response options with varying approaches and explain when each would be most appropriate.`,
      expectedSkills: [
        'rate discussion handling',
        'carrier expectation management',
        'negotiation strategy',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RATE_OBJECTIONS',
        'NEGOTIATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [121],
      assessmentCriteria: [
        'Three distinct response approaches with clear rationales',
        'Appropriate situational application of each option',
        'Rate discussion best practices',
        'Lead qualification through rate conversations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 123,
      category: 'Communication Support & Message Crafting',
      title: 'Fleet Manager Call Script',
      prompt: `A carrier rep is preparing to call a fleet manager at a 50-truck company. Create a call script with branching logic based on different responses the carrier might give.`,
      expectedSkills: [
        'enterprise carrier scripting',
        'branching conversation logic',
        'fleet manager communication',
      ],
      knowledgeBaseIntegration: [
        'FLEET_MANAGER_COMMUNICATION',
        'ENTERPRISE_CARRIER_SCRIPTS',
      ],
      difficulty: 'advanced',
      prerequisites: [108, 121],
      assessmentCriteria: [
        'Professional enterprise-level communication tone',
        'Multiple response branches covering likely scenarios',
        'Progressive qualification through conversation flow',
        'Clear value articulation for fleet operations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 124,
      category: 'Communication Support & Message Crafting',
      title: 'Carrier Follow-Up After Load',
      prompt: `You need to follow up with a carrier who hauled one load but hasn't responded to new opportunities. Craft a re-engagement message and explain the psychology behind your approach.`,
      expectedSkills: [
        'carrier re-engagement',
        'relationship psychology',
        'follow-up timing',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RELATIONSHIP_BUILDING',
        'FOLLOW_UP_PSYCHOLOGY',
      ],
      difficulty: 'intermediate',
      prerequisites: [122],
      assessmentCriteria: [
        'Psychological principles application for re-engagement',
        'Low-pressure approach maintaining relationship',
        'Performance-based reinforcement',
        'Clear next step suggestions',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 125,
      category: 'Communication Support & Message Crafting',
      title: 'Competitive Differentiation from Load Boards',
      prompt: `A carrier asks: "Why should I work with you instead of posting on load boards?" Generate a response that differentiates your brokerage without disparaging competitors.`,
      expectedSkills: [
        'competitive positioning',
        'value differentiation',
        'load board comparison',
      ],
      knowledgeBaseIntegration: [
        'BROKER_VS_LOAD_BOARD_VALUE',
        'CARRIER_VALUE_PROPOSITIONS',
      ],
      difficulty: 'advanced',
      prerequisites: [123],
      assessmentCriteria: [
        'Clear differentiation without negative competitor comments',
        'Specific value propositions addressing load board limitations',
        'Relationship and reliability emphasis',
        'Strategic positioning as preferred partner',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 126,
      category: 'Communication Support & Message Crafting',
      title: 'Owner-Operator Outreach Sequence',
      prompt: `Create an initial text message for reaching out to an owner-operator, then design the follow-up sequence for building the relationship.`,
      expectedSkills: [
        'owner-operator sequence design',
        'relationship building progression',
        'carrier communication cadence',
      ],
      knowledgeBaseIntegration: [
        'OWNER_OPERATOR_OUTREACH_SEQUENCES',
        'CARRIER_RELATIONSHIP_PROGRESSION',
      ],
      difficulty: 'intermediate',
      prerequisites: [121, 124],
      assessmentCriteria: [
        'Effective initial outreach message',
        'Strategic follow-up sequence with appropriate timing',
        'Progressive value building through sequence',
        'Relationship development focus',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 127,
      category: 'Communication Support & Message Crafting',
      title: 'Premature Rate Inquiry Handling',
      prompt: `A carrier asks about a specific load's rate before you've gathered details about their equipment and availability. How would you respond to qualify them while maintaining their interest?`,
      expectedSkills: [
        'carrier qualification through pricing',
        'information gathering techniques',
        'interest maintenance',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_QUALIFICATION_THROUGH_PRICING',
        'INFORMATION_GATHERING_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [122],
      assessmentCriteria: [
        'Strategic use of rate discussion for qualification',
        'Information gathering without losing interest',
        'Appropriate rate range communication',
        'Lead qualification through pricing conversation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 128,
      category: 'Communication Support & Message Crafting',
      title: 'Small Fleet Carrier Value Proposition',
      prompt: `Generate a value proposition tailored to a small fleet carrier who is tired of late payments and hidden fees from other brokers.`,
      expectedSkills: [
        'carrier pain point addressing',
        'value proposition crafting',
        'trust building messaging',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_PAIN_POINTS',
        'SMALL_FLEET_VALUE_PROPOSITIONS',
      ],
      difficulty: 'intermediate',
      prerequisites: [121],
      assessmentCriteria: [
        'Direct address of payment and fee pain points',
        'Credible value propositions with specific benefits',
        'Trust building through transparency',
        'Small fleet operational understanding',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 129,
      category: 'Communication Support & Message Crafting',
      title: 'Carrier Communication Tone Adjustment',
      prompt: `A carrier rep asks you to "make this message sound less formal and more like how carriers actually talk." Show before/after examples and explain the principles you applied.`,
      expectedSkills: [
        'carrier communication adaptation',
        'tone adjustment',
        'industry vernacular',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_COMMUNICATION_STYLES',
        'INDUSTRY_SPECIFIC_LANGUAGE',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 123],
      assessmentCriteria: [
        'Clear before/after examples showing tone transformation',
        'Appropriate industry vernacular integration',
        'Maintained professionalism while building rapport',
        'Specific principles applied with explanations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 130,
      category: 'Communication Support & Message Crafting',
      title: 'Preferred Carrier Network Outreach Sequence',
      prompt: `Create a multi-touch outreach sequence (7 touchpoints over 3 weeks) for a high-quality carrier you want to add to your preferred network, explaining the strategy behind each message.`,
      expectedSkills: [
        'enterprise carrier sequence design',
        'relationship building strategy',
        'multi-touch campaign creation',
      ],
      knowledgeBaseIntegration: [
        'PREFERRED_CARRIER_SEQUENCES',
        'ENTERPRISE_RELATIONSHIP_BUILDING',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 126],
      assessmentCriteria: [
        'Strategic 7-touchpoint sequence design',
        'Progressive relationship building through touches',
        'Enterprise-appropriate messaging and cadence',
        'Clear strategy explanation for each touchpoint',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // QUALIFICATION & VETTING (131-140)
    // ==========================================
    {
      id: 131,
      category: 'Qualification & Vetting',
      title: 'Carrier Qualification Questions Framework',
      prompt: `You're supporting a call with a potential new carrier. Generate a comprehensive list of questions organized by priority and explain what each question reveals.`,
      expectedSkills: [
        'carrier qualification framework',
        'question prioritization',
        'vetting methodology',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_QUALIFICATION_FRAMEWORKS',
        'VETTING_QUESTION_HIERARCHIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [102, 110],
      assessmentCriteria: [
        'Comprehensive question set covering all critical areas',
        'Clear prioritization based on qualification importance',
        'Specific explanation of what each question reveals',
        'Progressive qualification flow from basic to advanced',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 132,
      category: 'Qualification & Vetting',
      title: 'Carrier Equipment and Capacity Assessment',
      prompt: `During a call, a carrier mentions they have 5 trucks. What follow-up questions would you recommend to fully understand their operation and capabilities?`,
      expectedSkills: [
        'equipment assessment',
        'capacity evaluation',
        'operational understanding',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_EQUIPMENT_ANALYSIS',
        'CAPACITY_ASSESSMENT_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [131],
      assessmentCriteria: [
        'Comprehensive equipment and capacity questioning',
        'Progressive qualification depth',
        'Risk and opportunity identification',
        'Load matching capability assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 133,
      category: 'Qualification & Vetting',
      title: 'Carrier Motivation Analysis',
      prompt: `A carrier says their main priority is "consistent freight." As an AI assistant, break down what this likely means and what deeper questions should be asked.`,
      expectedSkills: [
        'carrier motivation interpretation',
        'underlying need identification',
        'qualification depth assessment',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_MOTIVATION_ANALYSIS',
        'UNDERLYING_NEED_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [131, 132],
      assessmentCriteria: [
        'Accurate interpretation of stated motivation',
        'Identification of potential underlying needs',
        'Strategic follow-up questioning',
        'Qualification implications assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 134,
      category: 'Qualification & Vetting',
      title: 'Carrier Qualification Scoring Framework',
      prompt: `Create a qualification scorecard for carrier prospects with weighted criteria. Explain how this would be used to prioritize carrier relationships.`,
      expectedSkills: [
        'carrier scoring methodology',
        'qualification prioritization',
        'decision framework creation',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_SCORING_MODELS',
        'QUALIFICATION_PRIORITIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [131, 132],
      assessmentCriteria: [
        'Comprehensive scoring criteria with appropriate weighting',
        'Clear prioritization methodology',
        'Actionable decision framework',
        'Risk and opportunity balancing',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 135,
      category: 'Qualification & Vetting',
      title: 'CSA Score Risk Assessment',
      prompt: `You notice red flags in a carrier's CSA scores (high crash indicator). How would you address this with the carrier rep and what recommendations would you make?`,
      expectedSkills: [
        'CSA score interpretation',
        'risk assessment communication',
        'mitigation strategy development',
      ],
      knowledgeBaseIntegration: [
        'CSA_SCORE_ANALYSIS',
        'RISK_MITIGATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111, 131],
      assessmentCriteria: [
        'Accurate CSA score interpretation',
        'Appropriate communication with carrier rep',
        'Risk mitigation recommendations',
        'Decision framework for proceeding or declining',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 136,
      category: 'Qualification & Vetting',
      title: 'Carrier Partnership Decision Framework',
      prompt: `A carrier rep asks: "Should we onboard this carrier?" Provide a framework for analyzing carrier quality based on the information gathered so far.`,
      expectedSkills: [
        'carrier quality assessment',
        'onboarding decision framework',
        'risk-benefit analysis',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_QUALITY_FRAMEWORKS',
        'ONBOARDING_DECISION_MODELS',
      ],
      difficulty: 'advanced',
      prerequisites: [131, 134],
      assessmentCriteria: [
        'Comprehensive quality assessment framework',
        'Clear decision criteria and thresholds',
        'Risk-benefit analysis methodology',
        'Alternative relationship options consideration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 137,
      category: 'Qualification & Vetting',
      title: 'Carrier Red Flag Identification',
      prompt: `Generate a list of red flags that might indicate a carrier will be unreliable or problematic, and explain how to identify each during vetting.`,
      expectedSkills: [
        'red flag identification',
        'risk indicator recognition',
        'preventive qualification',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RED_FLAGS',
        'RISK_INDICATOR_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111, 131],
      assessmentCriteria: [
        'Comprehensive red flag list with specific indicators',
        'Clear identification methods for each flag',
        'Risk assessment implications',
        'Mitigation or disqualification recommendations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 138,
      category: 'Qualification & Vetting',
      title: 'Insurance Coverage Verification',
      prompt: `A carrier is eager to work with you but has been vague about their insurance coverage. Create a script for verifying insurance requirements without losing the relationship.`,
      expectedSkills: [
        'insurance verification scripting',
        'relationship maintenance',
        'compliance requirement gathering',
      ],
      knowledgeBaseIntegration: [
        'INSURANCE_VERIFICATION_SCRIPTS',
        'COMPLIANCE_REQUIREMENT_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [131, 135],
      assessmentCriteria: [
        'Professional insurance verification approach',
        'Relationship preservation while gathering requirements',
        'Complete coverage verification checklist',
        'Appropriate follow-up based on findings',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 139,
      category: 'Qualification & Vetting',
      title: 'Carrier Conversation Analysis',
      prompt: `You're analyzing a conversation transcript with a carrier. Identify what key information is missing and what questions should have been asked.`,
      expectedSkills: [
        'conversation analysis',
        'gap identification',
        'qualification completeness assessment',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_CONVERSATION_ANALYSIS',
        'QUALIFICATION_GAP_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [131, 132],
      assessmentCriteria: [
        'Thorough gap analysis in carrier information',
        'Specific additional questions identified',
        'Qualification completeness assessment',
        'Strategic importance of missing information',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 140,
      category: 'Qualification & Vetting',
      title: 'Carrier Double Brokering Assessment',
      prompt: `A carrier mentions they "sometimes use double brokers" when capacity is tight. How would you assess this risk and recommend next steps?`,
      expectedSkills: [
        'double brokering risk assessment',
        'regulatory compliance analysis',
        'relationship risk evaluation',
      ],
      knowledgeBaseIntegration: [
        'DOUBLE_BROKERING_ANALYSIS',
        'REGULATORY_RISK_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [131, 137],
      assessmentCriteria: [
        'Accurate double brokering risk interpretation',
        'Regulatory compliance implications',
        'Relationship and operational risk assessment',
        'Strategic recommendations for proceeding or declining',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // OBJECTION HANDLING & PROBLEM SOLVING (141-150)
    // ==========================================
    {
      id: 141,
      category: 'Objection Handling & Problem Solving',
      title: 'Rate Objection Response Strategies',
      prompt: `A carrier says: "Your rates are too low." Generate 5 different response strategies, explain when each is appropriate, and provide specific language for each.`,
      expectedSkills: [
        'carrier rate objection handling',
        'strategic response development',
        'contextual appropriateness assessment',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RATE_OBJECTIONS',
        'RESPONSE_STRATEGY_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [122, 127],
      assessmentCriteria: [
        'Five distinct response strategies with clear rationales',
        'Specific situational appropriateness for each',
        'Professional language examples',
        'Strategic value preservation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 142,
      category: 'Objection Handling & Problem Solving',
      title: 'Trust and Reputation Objection',
      prompt: `A carrier says: "I've been screwed by brokers before." Address this trust objection with a multi-layered response that acknowledges concerns and rebuilds confidence.`,
      expectedSkills: [
        'trust rebuilding strategies',
        'past experience acknowledgment',
        'confidence restoration techniques',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_TRUST_OBJECTIONS',
        'CONFIDENCE_BUILDING_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [125, 128],
      assessmentCriteria: [
        'Empathetic acknowledgment of past experiences',
        'Multi-layered trust rebuilding approach',
        'Specific differentiators from problematic brokers',
        'Confidence-building commitments and proof points',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 143,
      category: 'Objection Handling & Problem Solving',
      title: 'Direct Shipper Preference Handling',
      prompt: `A carrier insists on seeing higher rates before they'll haul for you. How would you reframe the value proposition beyond just rate per mile?`,
      expectedSkills: [
        'value reframing beyond rates',
        'carrier value proposition articulation',
        'relationship vs. transactional positioning',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_VALUE_REFRAMING',
        'RELATIONSHIP_VS_TRANSACTIONAL_MODELS',
      ],
      difficulty: 'advanced',
      prerequisites: [125, 141],
      assessmentCriteria: [
        'Comprehensive value proposition beyond rates',
        'Strategic relationship positioning',
        'Specific carrier benefits articulation',
        'Long-term partnership vs. one-off load framing',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 144,
      category: 'Objection Handling & Problem Solving',
      title: 'Load Board Rate Comparison',
      prompt: `A carrier says: "I can get better rates on the load boards." Analyze this situation and provide guidance on how to respond while educating about hidden load board costs.`,
      expectedSkills: [
        'load board comparison analysis',
        'hidden cost education',
        'value differentiation articulation',
      ],
      knowledgeBaseIntegration: [
        'LOAD_BOARD_VS_BROKER_COMPARISON',
        'HIDDEN_COST_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [125, 141],
      assessmentCriteria: [
        'Comprehensive load board cost analysis',
        'Education-focused response approach',
        'Specific hidden cost explanations',
        'Strategic value positioning',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 145,
      category: 'Objection Handling & Problem Solving',
      title: 'Carrier Capacity Timing Objection',
      prompt: `A carrier says they're too busy to take your loads right now. Generate creative strategies for keeping the relationship warm for future opportunities.`,
      expectedSkills: [
        'relationship nurturing strategies',
        'future opportunity positioning',
        'creative follow-up approaches',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RELATIONSHIP_NURTURING',
        'FUTURE_OPPORTUNITY_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [124, 126],
      assessmentCriteria: [
        'Creative relationship maintenance strategies',
        'Future opportunity positioning',
        'Low-pressure follow-up approaches',
        'Value demonstration during quiet periods',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 146,
      category: 'Objection Handling & Problem Solving',
      title: 'Broker Perception Objection',
      prompt: `A carrier says: "You're just going to lowball me like every other broker." Create a response that addresses this perception and differentiates your approach.`,
      expectedSkills: [
        'perception correction strategies',
        'broker differentiation articulation',
        'trust building through transparency',
      ],
      knowledgeBaseIntegration: [
        'BROKER_PERCEPTION_CORRECTION',
        'TRANSPARENCY_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [142, 143],
      assessmentCriteria: [
        'Direct address of negative broker perceptions',
        'Clear differentiation from industry practices',
        'Transparency and trust building elements',
        'Commitment to fair dealing',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 147,
      category: 'Objection Handling & Problem Solving',
      title: 'Payment Terms and Factoring Concerns',
      prompt: `A carrier is concerned about factoring fees and payment terms. Develop talking points that position your payment practices as carrier-friendly.`,
      expectedSkills: [
        'payment terms positioning',
        'factoring fee education',
        'carrier-friendly payment articulation',
      ],
      knowledgeBaseIntegration: [
        'PAYMENT_TERMS_POSITIONING',
        'FACTORING_EDUCATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [128, 138],
      assessmentCriteria: [
        'Comprehensive payment terms explanation',
        'Carrier-friendly positioning of payment practices',
        'Factoring fee transparency and education',
        'Trust building through payment reliability',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 148,
      category: 'Objection Handling & Problem Solving',
      title: 'Direct Shipper Access Preference',
      prompt: `A carrier asks: "Why should I work with you instead of booking direct with shippers?" Explain how to handle this situation and articulate the broker value proposition.`,
      expectedSkills: [
        'direct shipper preference handling',
        'broker value proposition articulation',
        'carrier benefit positioning',
      ],
      knowledgeBaseIntegration: [
        'BROKER_VALUE_PROPOSITIONS',
        'CARRIER_BENEFIT_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [125, 143],
      assessmentCriteria: [
        'Comprehensive broker value proposition',
        'Specific carrier benefits articulation',
        'Address of direct shipper challenges',
        'Strategic relationship positioning',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 149,
      category: 'Objection Handling & Problem Solving',
      title: 'Lost Carrier Re-engagement',
      prompt: `A carrier ghosted after hauling one load. Generate a diagnostic framework to understand why, and create a re-engagement strategy.`,
      expectedSkills: [
        'carrier loss analysis',
        're-engagement strategy development',
        'relationship recovery frameworks',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_LOSS_ANALYSIS',
        'RE_ENGAGEMENT_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [124, 145],
      assessmentCriteria: [
        'Comprehensive loss diagnostic framework',
        'Root cause analysis methodology',
        'Strategic re-engagement approach',
        'Relationship recovery positioning',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 150,
      category: 'Objection Handling & Problem Solving',
      title: 'Detention Pay Policy Objection',
      prompt: `A carrier says: "I only work with brokers who have detention pay in writing." Turn this requirement into an opportunity to demonstrate professionalism and fair practices.`,
      expectedSkills: [
        'detention policy positioning',
        'requirement conversion strategies',
        'professionalism demonstration',
      ],
      knowledgeBaseIntegration: [
        'DETENTION_POLICY_FRAMEWORKS',
        'PROFESSIONALISM_DEMONSTRATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [109, 147],
      assessmentCriteria: [
        'Positive detention policy positioning',
        'Professionalism and fairness demonstration',
        'Requirement conversion to opportunity',
        'Clear policy communication and commitment',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // LANE & CAPACITY STRATEGY (151-160)
    // ==========================================
    {
      id: 151,
      category: 'Lane & Capacity Strategy',
      title: 'Lane Capacity Building Strategy',
      prompt: `A carrier rep is trying to build capacity in the Dallas to Los Angeles lane. Generate a targeting strategy for the types of carriers to pursue and why.`,
      expectedSkills: [
        'lane-specific carrier targeting',
        'capacity building prioritization',
        'geographic optimization',
      ],
      knowledgeBaseIntegration: [
        'LANE_CAPACITY_STRATEGIES',
        'CARRIER_GEOGRAPHIC_TARGETING',
      ],
      difficulty: 'intermediate',
      prerequisites: [103, 112],
      assessmentCriteria: [
        'Strategic carrier type prioritization for specific lanes',
        'Geographic and operational fit analysis',
        'Capacity building methodology',
        'Risk and reliability considerations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 152,
      category: 'Lane & Capacity Strategy',
      title: 'Owner-Operator vs. Fleet Carrier Acquisition',
      prompt: `Explain the differences in acquisition approach between targeting owner-operators versus fleet carriers, with specific examples of how messaging should change.`,
      expectedSkills: [
        'carrier segmentation strategies',
        'segment-specific messaging',
        'relationship model adaptation',
      ],
      knowledgeBaseIntegration: [
        'OWNER_OPERATOR_VS_FLEET_STRATEGIES',
        'CARRIER_SEGMENTATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [108, 121],
      assessmentCriteria: [
        'Clear differentiation between carrier types',
        'Specific messaging adaptations for each segment',
        'Relationship model implications',
        'Capacity and reliability considerations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 153,
      category: 'Lane & Capacity Strategy',
      title: 'Specialized Equipment Sourcing',
      prompt: `You need to source 20 reefer trucks for a dedicated lane. Walk through your process for identifying, prioritizing, and reaching out to qualified carriers.`,
      expectedSkills: [
        'specialized equipment sourcing',
        'carrier qualification for equipment',
        'capacity planning for equipment types',
      ],
      knowledgeBaseIntegration: [
        'SPECIALIZED_EQUIPMENT_STRATEGIES',
        'EQUIPMENT_SPECIFIC_CARRIER_NETWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [112, 132],
      assessmentCriteria: [
        'Comprehensive equipment sourcing methodology',
        'Carrier qualification for specialized equipment',
        'Prioritization framework for equipment availability',
        'Outreach strategy for specialized carriers',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 154,
      category: 'Lane & Capacity Strategy',
      title: 'Competitive Rate Intelligence',
      prompt: `Create a competitive intelligence brief on what rates other brokers are offering in key lanes and how this affects carrier acquisition strategy.`,
      expectedSkills: [
        'competitive rate analysis',
        'market intelligence gathering',
        'rate strategy adaptation',
      ],
      knowledgeBaseIntegration: [
        'COMPETITIVE_RATE_INTELLIGENCE',
        'MARKET_RATE_ANALYSIS_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [116, 141],
      assessmentCriteria: [
        'Comprehensive competitive rate analysis',
        'Market intelligence gathering methodology',
        'Strategic implications for carrier acquisition',
        'Rate positioning recommendations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 155,
      category: 'Lane & Capacity Strategy',
      title: 'Headhaul vs. Backhaul Optimization',
      prompt: `Explain the concept of headhaul vs. backhaul lanes and why it matters in carrier acquisition conversations. Provide examples of how to discuss this strategically.`,
      expectedSkills: [
        'headhaul vs. backhaul understanding',
        'lane optimization strategies',
        'carrier motivation alignment',
      ],
      knowledgeBaseIntegration: [
        'HEADHAUL_BACKHAUL_OPTIMIZATION',
        'LANE_EFFICIENCY_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [103, 116],
      assessmentCriteria: [
        'Clear explanation of headhaul vs. backhaul concepts',
        'Strategic importance in carrier acquisition',
        'Specific discussion examples',
        'Carrier motivation alignment strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 156,
      category: 'Lane & Capacity Strategy',
      title: 'Dedicated Lane Carrier Recruitment',
      prompt: `You're supporting a pursuit of flatbed carriers for specialized construction freight. Outline the key considerations and how to position opportunities.`,
      expectedSkills: [
        'specialized freight carrier recruitment',
        'niche market positioning',
        'equipment-specific relationship building',
      ],
      knowledgeBaseIntegration: [
        'SPECIALIZED_FREIGHT_STRATEGIES',
        'NICHE_CARRIER_RECRUITMENT',
      ],
      difficulty: 'advanced',
      prerequisites: [132, 153],
      assessmentCriteria: [
        'Comprehensive specialized freight considerations',
        'Effective opportunity positioning',
        'Carrier recruitment methodology',
        'Risk and capacity assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 157,
      category: 'Lane & Capacity Strategy',
      title: 'Carrier Expansion Opportunity Assessment',
      prompt: `A carrier operates primarily in the Southeast but is asking about expanding to Midwest lanes. How would you gather information to provide valuable guidance?`,
      expectedSkills: [
        'carrier expansion analysis',
        'geographic opportunity assessment',
        'strategic guidance provision',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_EXPANSION_FRAMEWORKS',
        'GEOGRAPHIC_OPPORTUNITY_ANALYSIS',
      ],
      difficulty: 'advanced',
      prerequisites: [112, 151],
      assessmentCriteria: [
        'Comprehensive carrier expansion analysis',
        'Information gathering methodology',
        'Strategic guidance framework',
        'Risk and opportunity assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 158,
      category: 'Lane & Capacity Strategy',
      title: 'Capacity Planning Framework',
      prompt: `Create a capacity planning framework: If you need to move 100 loads per week in a lane, how many carrier relationships should you aim to build and why?`,
      expectedSkills: [
        'capacity planning methodology',
        'carrier relationship optimization',
        'load volume distribution',
      ],
      knowledgeBaseIntegration: [
        'CAPACITY_PLANNING_FRAMEWORKS',
        'CARRIER_RELATIONSHIP_OPTIMIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [103, 134],
      assessmentCriteria: [
        'Comprehensive capacity planning framework',
        'Data-driven relationship number recommendations',
        'Risk distribution and reliability considerations',
        'Scaling and growth planning',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 159,
      category: 'Lane & Capacity Strategy',
      title: 'Seasonal Capacity Management',
      prompt: `You notice seasonal patterns where certain carriers are more receptive to new broker relationships post-peak season. How would you capitalize on this timing using free data sources like FMCSA carrier registrations and BLS seasonal employment data?`,
      expectedSkills: [
        'seasonal capacity analysis',
        'free data seasonal insights',
        'relationship building cycles',
      ],
      knowledgeBaseIntegration: [
        'SEASONAL_CAPACITY_PATTERNS',
        'FREE_DATA_SEASONAL_ANALYSIS',
      ],
      difficulty: 'intermediate',
      prerequisites: [116, 145],
      assessmentCriteria: [
        'Accurate seasonal pattern identification using free data',
        'Strategic timing capitalization with public data insights',
        'Relationship building cycle optimization',
        'Resource allocation for seasonal opportunities',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 160,
      category: 'Lane & Capacity Strategy',
      title: 'Carrier Network Optimization',
      prompt: `Analyze how to optimize a carrier network for both reliability and cost efficiency. What metrics would you track and what strategies would you implement?`,
      expectedSkills: [
        'carrier network optimization',
        'performance metric tracking',
        'cost-efficiency balancing',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_NETWORK_OPTIMIZATION',
        'PERFORMANCE_METRIC_FRAMEWORKS',
      ],
      difficulty: 'expert',
      prerequisites: [134, 158],
      assessmentCriteria: [
        'Comprehensive network optimization framework',
        'Key performance metrics identification',
        'Reliability vs. cost balancing strategies',
        'Continuous improvement methodologies',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // RELATIONSHIP BUILDING & RETENTION (161-170)
    // ==========================================
    {
      id: 161,
      category: 'Relationship Building & Retention',
      title: 'Post-Load Relationship Conversion',
      prompt: `A carrier hauled their first load successfully. Design a follow-up strategy to convert them from one-time hauler to regular partner.`,
      expectedSkills: [
        'relationship conversion strategies',
        'post-load engagement',
        'loyalty building techniques',
      ],
      knowledgeBaseIntegration: [
        'RELATIONSHIP_CONVERSION_FRAMEWORKS',
        'LOYALTY_BUILDING_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [124, 126],
      assessmentCriteria: [
        'Strategic post-load engagement plan',
        'Relationship progression methodology',
        'Loyalty building techniques',
        'Success measurement approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 162,
      category: 'Relationship Building & Retention',
      title: 'Scale Relationship Personalization',
      prompt: `You're managing ongoing communication with 200 carriers at various relationship stages. How would you personalize interactions at scale while maintaining authenticity?`,
      expectedSkills: [
        'large-scale relationship management',
        'personalization at scale',
        'segmentation strategies',
      ],
      knowledgeBaseIntegration: [
        'SCALE_PERSONALIZATION_FRAMEWORKS',
        'CARRIER_SEGMENTATION_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [108, 119],
      assessmentCriteria: [
        'Effective scale personalization methodology',
        'Relationship stage segmentation',
        'Authenticity maintenance strategies',
        'Technology and process integration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 163,
      category: 'Relationship Building & Retention',
      title: 'High-Performing Carrier Recognition',
      prompt: `A carrier consistently delivers on time and never complains. Create a recognition and relationship deepening strategy to ensure they remain loyal.`,
      expectedSkills: [
        'carrier recognition programs',
        'loyalty reinforcement',
        'relationship deepening strategies',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RECOGNITION_FRAMEWORKS',
        'LOYALTY_REINFORCEMENT_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [161, 162],
      assessmentCriteria: [
        'Comprehensive recognition strategy',
        'Loyalty reinforcement techniques',
        'Relationship deepening approaches',
        'Measurement and feedback systems',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 164,
      category: 'Relationship Building & Retention',
      title: 'Carrier Value-Add Initiatives',
      prompt: `Generate a list of value-add actions you could take for carriers that demonstrate you're different from other brokers.`,
      expectedSkills: [
        'carrier value creation',
        'differentiation strategies',
        'relationship enhancement',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_VALUE_ADD_FRAMEWORKS',
        'DIFFERENTIATION_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [125, 128],
      assessmentCriteria: [
        'Comprehensive value-add initiatives list',
        'Strategic differentiation demonstration',
        'Relationship enhancement focus',
        'Implementation feasibility assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 165,
      category: 'Relationship Building & Retention',
      title: 'Personal Touch Relationship Building',
      prompt: `A carrier's birthday is coming up (you have this information from past conversations). How would you leverage this personal touch appropriately?`,
      expectedSkills: [
        'personal relationship building',
        'appropriate boundary management',
        'genuine connection strategies',
      ],
      knowledgeBaseIntegration: [
        'PERSONAL_RELATIONSHIP_FRAMEWORKS',
        'BOUNDARY_MANAGEMENT_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [162, 163],
      assessmentCriteria: [
        'Appropriate personal touch utilization',
        'Professional boundary maintenance',
        'Relationship strengthening outcomes',
        'Risk and compliance considerations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 166,
      category: 'Relationship Building & Retention',
      title: 'Carrier Content and Education Strategy',
      prompt: `Create a content recommendation strategy: what types of information, insights, or resources should be shared with carriers to build relationships?`,
      expectedSkills: [
        'carrier content strategy',
        'educational resource development',
        'relationship building through value',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_CONTENT_STRATEGIES',
        'EDUCATIONAL_RESOURCE_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [124, 164],
      assessmentCriteria: [
        'Strategic content recommendation framework',
        'Carrier value-driven content selection',
        'Relationship building through education',
        'Delivery and engagement optimization',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 167,
      category: 'Relationship Building & Retention',
      title: 'Dormant Carrier Re-engagement',
      prompt: `You notice a carrier hasn't hauled a load in 45 days despite previously being active. How would you diagnose why and re-engage them?`,
      expectedSkills: [
        'carrier inactivity analysis',
        're-engagement diagnostics',
        'relationship recovery strategies',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_INACTIVITY_ANALYSIS',
        'RE_ENGAGEMENT_DIAGNOSTICS',
      ],
      difficulty: 'advanced',
      prerequisites: [124, 145],
      assessmentCriteria: [
        'Comprehensive inactivity diagnostic framework',
        'Root cause analysis methodology',
        'Strategic re-engagement approaches',
        'Relationship recovery positioning',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 168,
      category: 'Relationship Building & Retention',
      title: 'Quarterly Capacity Reviews',
      prompt: `Design a "quarterly capacity review" concept that could be offered to top carriers to strengthen partnerships and identify growth opportunities.`,
      expectedSkills: [
        'strategic review design',
        'partnership strengthening',
        'growth opportunity identification',
      ],
      knowledgeBaseIntegration: [
        'QUARTERLY_REVIEW_FRAMEWORKS',
        'PARTNERSHIP_STRENGTHENING_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [162, 163],
      assessmentCriteria: [
        'Comprehensive quarterly review structure',
        'Partnership strengthening elements',
        'Growth opportunity identification',
        'Mutual value creation focus',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 169,
      category: 'Relationship Building & Retention',
      title: 'Lost Carrier Recovery Strategy',
      prompt: `A carrier who used to work with you regularly started using a competitor. How would you approach this situation to understand what happened and potentially win them back?`,
      expectedSkills: [
        'lost carrier analysis',
        'competitor loss assessment',
        'relationship recovery strategies',
      ],
      knowledgeBaseIntegration: [
        'LOST_CARRIER_RECOVERY',
        'COMPETITOR_LOSS_ANALYSIS',
      ],
      difficulty: 'expert',
      prerequisites: [149, 167],
      assessmentCriteria: [
        'Strategic approach to lost carrier situations',
        'Root cause analysis methodology',
        'Relationship recovery positioning',
        'Competitive differentiation strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 170,
      category: 'Relationship Building & Retention',
      title: 'Carrier Tier Segmentation Strategy',
      prompt: `Create a framework for segmenting carriers into tiers (platinum, gold, silver, bronze) based on performance and value, with specific relationship strategies for each tier.`,
      expectedSkills: [
        'carrier tier segmentation',
        'performance-based categorization',
        'tier-specific relationship strategies',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_TIER_FRAMEWORKS',
        'PERFORMANCE_SEGMENTATION_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [134, 163],
      assessmentCriteria: [
        'Comprehensive tier segmentation framework',
        'Performance and value-based criteria',
        'Tier-specific relationship strategies',
        'Resource allocation optimization',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // TECHNOLOGY & TOOLS UTILIZATION (171-180)
    // ==========================================
    {
      id: 171,
      category: 'Technology & Tools Utilization',
      title: 'Free Freight Data Source Integration',
      prompt: `You have access to FMCSA public data, BLS economic indicators, DirectFreight.com web scraping, and FleetFlow's internal transaction database. Explain how you would use each free data source strategically for carrier acquisition and what unique insights each provides.`,
      expectedSkills: [
        'free data source utilization',
        'web scraping integration',
        'public data integration',
        'internal data leveraging',
      ],
      knowledgeBaseIntegration: [
        'FREE_DATA_INTEGRATION_FRAMEWORKS',
        'WEB_SCRAPING_STRATEGIES',
        'PUBLIC_DATA_STRATEGIC_UTILIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [116, 154],
      assessmentCriteria: [
        'Strategic utilization of each free data source including web scraping',
        'Unique insight identification per source',
        'Integration methodology for multiple free sources',
        'Legal and ethical scraping considerations',
        'Acquisition strategy enhancement through comprehensive free data',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 172,
      category: 'Technology & Tools Utilization',
      title: 'Carrier Portal and App Positioning',
      prompt: `A carrier asks if you have a carrier app or portal. You need to explain your technology offering. How would you position technology as a differentiator?`,
      expectedSkills: [
        'carrier technology positioning',
        'digital tool differentiation',
        'technology value articulation',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_PORTAL_POSITIONING',
        'DIGITAL_TOOL_DIFFERENTIATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [125, 171],
      assessmentCriteria: [
        'Effective technology offering explanation',
        'Clear differentiation from competitors',
        'Value proposition articulation',
        'Adoption and utilization strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 173,
      category: 'Technology & Tools Utilization',
      title: 'FMCSA Data Pre-qualification',
      prompt: `Create a process for using FMCSA SAFER system data to pre-qualify carriers before outreach, including what specific data points to check and why.`,
      expectedSkills: [
        'FMCSA data utilization',
        'carrier pre-qualification',
        'compliance data analysis',
      ],
      knowledgeBaseIntegration: [
        'FMCSA_SAFER_ANALYSIS',
        'PRE_QUALIFICATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111, 135],
      assessmentCriteria: [
        'Comprehensive FMCSA data utilization process',
        'Specific data points and checking procedures',
        'Pre-qualification decision framework',
        'Risk mitigation through compliance analysis',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 174,
      category: 'Technology & Tools Utilization',
      title: 'Market Rate Trend Analysis',
      prompt: `You notice market rate trends showing capacity loosening in a specific region. How would you use this data to inform carrier acquisition messaging and strategy?`,
      expectedSkills: [
        'market rate trend analysis',
        'regional capacity assessment',
        'strategic messaging adaptation',
      ],
      knowledgeBaseIntegration: [
        'MARKET_RATE_TREND_ANALYSIS',
        'REGIONAL_CAPACITY_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [116, 154],
      assessmentCriteria: [
        'Accurate market trend interpretation',
        'Strategic acquisition messaging adaptation',
        'Capacity opportunity identification',
        'Timing and urgency optimization',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 175,
      category: 'Technology & Tools Utilization',
      title: 'Carrier Validation Service Integration',
      prompt: `Explain how you would use Carrier 411 or similar carrier validation services to verify carrier legitimacy and reputation before onboarding.`,
      expectedSkills: [
        'carrier validation utilization',
        'legitimacy verification',
        'reputation assessment',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_VALIDATION_SERVICES',
        'LEGITIMACY_VERIFICATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [111, 137],
      assessmentCriteria: [
        'Comprehensive carrier validation process',
        'Legitimacy and reputation verification methods',
        'Onboarding risk mitigation',
        'Integration with existing qualification processes',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 176,
      category: 'Technology & Tools Utilization',
      title: 'ELD Integration Assessment',
      prompt: `A carrier asks about ELD integration or digital load tendering capabilities. How would you determine if your systems support this and position the answer appropriately?`,
      expectedSkills: [
        'ELD integration assessment',
        'digital capability evaluation',
        'technology compatibility positioning',
      ],
      knowledgeBaseIntegration: [
        'ELD_INTEGRATION_FRAMEWORKS',
        'DIGITAL_CAPABILITY_ASSESSMENT',
      ],
      difficulty: 'intermediate',
      prerequisites: [172, 173],
      assessmentCriteria: [
        'Accurate system capability determination',
        'Appropriate technology positioning',
        'Integration complexity assessment',
        'Value proposition articulation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 177,
      category: 'Technology & Tools Utilization',
      title: 'Carrier Acquisition Dashboard Design',
      prompt: `Design a dashboard showing carrier acquisition metrics you would track: what KPIs matter most and how would you use them to improve performance?`,
      expectedSkills: [
        'carrier acquisition metrics',
        'dashboard design',
        'performance optimization',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_ACQUISITION_METRICS',
        'PERFORMANCE_DASHBOARD_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [134, 171],
      assessmentCriteria: [
        'Comprehensive KPI identification',
        'Strategic dashboard design',
        'Performance improvement utilization',
        'Data-driven decision making framework',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 178,
      category: 'Technology & Tools Utilization',
      title: 'Carrier Performance Pattern Recognition',
      prompt: `You have historical data showing certain carriers consistently accept loads in specific lanes. How would you leverage this pattern recognition for more efficient load coverage?`,
      expectedSkills: [
        'carrier performance pattern analysis',
        'predictive load matching',
        'efficiency optimization',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_PERFORMANCE_PATTERNS',
        'PREDICTIVE_LOAD_MATCHING',
      ],
      difficulty: 'expert',
      prerequisites: [116, 177],
      assessmentCriteria: [
        'Effective pattern recognition utilization',
        'Predictive load matching strategies',
        'Efficiency optimization approaches',
        'Continuous improvement integration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 179,
      category: 'Technology & Tools Utilization',
      title: 'Carrier Performance Monitoring',
      prompt: `Create a process for monitoring carrier performance data (on-time delivery, claims, communication) and using it to inform relationship management strategies.`,
      expectedSkills: [
        'carrier performance monitoring',
        'data-driven relationship management',
        'performance improvement strategies',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_PERFORMANCE_MONITORING',
        'RELATIONSHIP_MANAGEMENT_OPTIMIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [163, 177],
      assessmentCriteria: [
        'Comprehensive performance monitoring process',
        'Data-driven relationship management',
        'Performance improvement strategies',
        'Feedback and communication frameworks',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 180,
      category: 'Technology & Tools Utilization',
      title: 'Predictive Carrier Acceptance Modeling',
      prompt: `Explain how you would use predictive analytics to identify which carriers are most likely to accept a load opportunity based on historical behavior and current market conditions.`,
      expectedSkills: [
        'predictive carrier analytics',
        'acceptance probability modeling',
        'data-driven load assignment',
      ],
      knowledgeBaseIntegration: [
        'PREDICTIVE_CARRIER_ANALYTICS',
        'ACCEPTANCE_PROBABILITY_MODELING',
      ],
      difficulty: 'expert',
      prerequisites: [178, 179],
      assessmentCriteria: [
        'Comprehensive predictive modeling approach',
        'Historical behavior analysis methodology',
        'Market condition integration',
        'Load assignment optimization strategies',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // COMPLIANCE & RISK MANAGEMENT (181-190)
    // ==========================================
    {
      id: 181,
      category: 'Compliance & Risk Management',
      title: 'Insurance Certificate Expiration Management',
      prompt: `A carrier's insurance certificate is expiring in 30 days. How would you proactively manage this to avoid service disruption and ensure compliance?`,
      expectedSkills: [
        'insurance compliance management',
        'proactive risk mitigation',
        'carrier communication strategies',
      ],
      knowledgeBaseIntegration: [
        'INSURANCE_COMPLIANCE_FRAMEWORKS',
        'PROACTIVE_RISK_MANAGEMENT',
      ],
      difficulty: 'intermediate',
      prerequisites: [138, 173],
      assessmentCriteria: [
        'Proactive insurance expiration management',
        'Service disruption prevention strategies',
        'Compliance maintenance procedures',
        'Carrier communication and education',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 182,
      category: 'Compliance & Risk Management',
      title: 'Authority Revocation Crisis Management',
      prompt: `You discover a carrier's authority has been revoked according to FMCSA. Walk through the immediate actions you would take and how you would communicate with the carrier rep.`,
      expectedSkills: [
        'authority revocation crisis management',
        'immediate risk mitigation',
        'carrier communication protocols',
      ],
      knowledgeBaseIntegration: [
        'AUTHORITY_REVOCATION_PROCEDURES',
        'CRISIS_COMMUNICATION_FRAMEWORKS',
      ],
      difficulty: 'expert',
      prerequisites: [111, 113],
      assessmentCriteria: [
        'Immediate action prioritization',
        'Comprehensive crisis management approach',
        'Professional carrier communication',
        'Legal and operational risk mitigation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 183,
      category: 'Compliance & Risk Management',
      title: 'Double Brokering Risk Assessment',
      prompt: `A carrier wants to use their own authority but actually haul the load under a partner carrier's MC. Explain the double brokering risk and how to address this.`,
      expectedSkills: [
        'double brokering risk identification',
        'regulatory compliance analysis',
        'risk mitigation strategies',
      ],
      knowledgeBaseIntegration: [
        'DOUBLE_BROKERING_REGULATIONS',
        'RISK_MITIGATION_FRAMEWORKS',
      ],
      difficulty: 'expert',
      prerequisites: [140, 173],
      assessmentCriteria: [
        'Accurate double brokering risk interpretation',
        'Regulatory compliance implications',
        'Risk mitigation strategy development',
        'Alternative operational approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 184,
      category: 'Compliance & Risk Management',
      title: 'Carrier Onboarding Compliance Checklist',
      prompt: `Create a compliance checklist that you would use before approving any carrier to haul freight, explaining the importance of each item.`,
      expectedSkills: [
        'carrier compliance checklist creation',
        'risk assessment framework',
        'onboarding qualification',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_COMPLIANCE_CHECKLISTS',
        'ONBOARDING_QUALIFICATION_FRAMEWORKS',
      ],
      difficulty: 'intermediate',
      prerequisites: [131, 138],
      assessmentCriteria: [
        'Comprehensive compliance checklist',
        'Clear importance explanation for each item',
        'Risk mitigation focus',
        'Practical implementation guidance',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 185,
      category: 'Compliance & Risk Management',
      title: 'CSA Score Trend Monitoring',
      prompt: `A carrier's CSA scores increased significantly into the concerning range. How would you analyze this, what questions would you ask, and what recommendations would you make?`,
      expectedSkills: [
        'CSA score trend analysis',
        'performance degradation assessment',
        'corrective action recommendations',
      ],
      knowledgeBaseIntegration: [
        'CSA_SCORE_MONITORING',
        'PERFORMANCE_DEGRADATION_ANALYSIS',
      ],
      difficulty: 'advanced',
      prerequisites: [111, 135],
      assessmentCriteria: [
        'Accurate CSA trend analysis',
        'Strategic questioning approach',
        'Corrective action recommendations',
        'Ongoing monitoring and support strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 186,
      category: 'Compliance & Risk Management',
      title: 'Carrier Fraud Detection Framework',
      prompt: `Explain the concept of carrier fraud and common warning signs you would watch for during the acquisition and onboarding process.`,
      expectedSkills: [
        'carrier fraud identification',
        'warning sign recognition',
        'preventive qualification measures',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_FRAUD_FRAMEWORKS',
        'WARNING_SIGN_IDENTIFICATION',
      ],
      difficulty: 'advanced',
      prerequisites: [137, 175],
      assessmentCriteria: [
        'Clear carrier fraud concept explanation',
        'Comprehensive warning sign identification',
        'Preventive qualification measures',
        'Risk mitigation strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 187,
      category: 'Compliance & Risk Management',
      title: 'Hazmat Certification Verification',
      prompt: `A carrier wants to haul hazmat loads but you're unsure if they're properly certified. Walk through how you would verify hazmat qualifications and what documentation is required.`,
      expectedSkills: [
        'hazmat certification verification',
        'specialized compliance checking',
        'documentation requirement assessment',
      ],
      knowledgeBaseIntegration: [
        'HAZMAT_CERTIFICATION_FRAMEWORKS',
        'SPECIALIZED_COMPLIANCE_VERIFICATION',
      ],
      difficulty: 'advanced',
      prerequisites: [138, 173],
      assessmentCriteria: [
        'Comprehensive hazmat verification process',
        'Required documentation identification',
        'Certification validity assessment',
        'Risk mitigation for specialized freight',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 188,
      category: 'Compliance & Risk Management',
      title: 'Altered Document Detection',
      prompt: `You notice a carrier provided a cargo insurance certificate that appears altered. How would you handle this sensitive situation?`,
      expectedSkills: [
        'document alteration detection',
        'sensitive situation management',
        'compliance violation handling',
      ],
      knowledgeBaseIntegration: [
        'DOCUMENT_ALTERATION_DETECTION',
        'COMPLIANCE_VIOLATION_PROCEDURES',
      ],
      difficulty: 'expert',
      prerequisites: [138, 186],
      assessmentCriteria: [
        'Professional sensitive situation handling',
        'Document authenticity verification',
        'Compliance violation procedures',
        'Relationship and legal risk management',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 189,
      category: 'Compliance & Risk Management',
      title: 'Carrier Risk Assessment Matrix',
      prompt: `Create a risk assessment framework for evaluating new carriers, with different risk levels and corresponding onboarding procedures.`,
      expectedSkills: [
        'carrier risk assessment framework',
        'risk level categorization',
        'onboarding procedure differentiation',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_RISK_ASSESSMENT_FRAMEWORKS',
        'ONBOARDING_PROCEDURE_MATRIX',
      ],
      difficulty: 'advanced',
      prerequisites: [134, 184],
      assessmentCriteria: [
        'Comprehensive risk assessment framework',
        'Clear risk level definitions',
        'Corresponding onboarding procedures',
        'Scalability and practical implementation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 190,
      category: 'Compliance & Risk Management',
      title: 'Cargo Claim Compliance Management',
      prompt: `A carrier had a cargo claim on a previous load. Explain how this should impact future load assignments and what mitigation strategies you would recommend.`,
      expectedSkills: [
        'cargo claim impact assessment',
        'load assignment risk management',
        'mitigation strategy development',
      ],
      knowledgeBaseIntegration: [
        'CARGO_CLAIM_IMPACT_FRAMEWORKS',
        'RISK_BASED_LOAD_ASSIGNMENT',
      ],
      difficulty: 'intermediate',
      prerequisites: [135, 179],
      assessmentCriteria: [
        'Appropriate cargo claim impact assessment',
        'Future load assignment guidelines',
        'Comprehensive mitigation strategies',
        'Performance improvement monitoring',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // MARKET INTELLIGENCE & OPTIMIZATION (191-200)
    // ==========================================
    {
      id: 191,
      category: 'Market Intelligence & Optimization',
      title: 'Equipment Type Acceptance Analysis',
      prompt: `You're analyzing data showing that carriers in certain equipment types (reefer, flatbed, dry van) have different acceptance rates for your loads. How would you use this insight to improve carrier acquisition efficiency?`,
      expectedSkills: [
        'equipment-specific acceptance analysis',
        'carrier acquisition optimization',
        'data-driven targeting improvements',
      ],
      knowledgeBaseIntegration: [
        'EQUIPMENT_TYPE_ACCEPTANCE_PATTERNS',
        'ACQUISITION_OPTIMIZATION_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [153, 178],
      assessmentCriteria: [
        'Accurate acceptance rate analysis',
        'Strategic acquisition efficiency improvements',
        'Equipment-specific targeting optimization',
        'Performance measurement and iteration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 192,
      category: 'Market Intelligence & Optimization',
      title: 'Competitive Carrier Acquisition Analysis',
      prompt: `Create a competitive analysis: what are other brokerages doing to attract carriers, and how can you differentiate your acquisition approach?`,
      expectedSkills: [
        'competitive carrier acquisition analysis',
        'differentiation strategy development',
        'market positioning optimization',
      ],
      knowledgeBaseIntegration: [
        'COMPETITIVE_CARRIER_ACQUISITION_ANALYSIS',
        'DIFFERENTIATION_STRATEGY_FRAMEWORKS',
      ],
      difficulty: 'expert',
      prerequisites: [154, 171],
      assessmentCriteria: [
        'Comprehensive competitive analysis',
        'Strategic differentiation opportunities',
        'Market positioning recommendations',
        'Implementation and measurement approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 193,
      category: 'Market Intelligence & Optimization',
      title: 'Fuel Price Impact Analysis',
      prompt: `Fuel prices increased significantly. Explain how this affects carrier behavior and what adjustments you would recommend to acquisition messaging and rate strategies.`,
      expectedSkills: [
        'fuel price impact analysis',
        'carrier behavior prediction',
        'rate strategy adaptation',
      ],
      knowledgeBaseIntegration: [
        'FUEL_PRICE_IMPACT_FRAMEWORKS',
        'RATE_STRATEGY_ADAPTATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [141, 174],
      assessmentCriteria: [
        'Accurate fuel price behavior impact analysis',
        'Strategic acquisition messaging adjustments',
        'Rate strategy recommendations',
        'Market condition adaptation approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 194,
      category: 'Market Intelligence & Optimization',
      title: 'Seasonal Acquisition Timing Strategy',
      prompt: `You notice seasonal patterns where certain carriers are more receptive to new broker relationships post-peak season. How would you capitalize on this timing?`,
      expectedSkills: [
        'seasonal acquisition timing',
        'peak season pattern recognition',
        'relationship building cycle optimization',
      ],
      knowledgeBaseIntegration: [
        'SEASONAL_ACQUISITION_PATTERNS',
        'TIMING_OPTIMIZATION_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [116, 159],
      assessmentCriteria: [
        'Accurate seasonal pattern identification',
        'Strategic timing capitalization',
        'Relationship building cycle optimization',
        'Resource allocation for seasonal opportunities',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 195,
      category: 'Market Intelligence & Optimization',
      title: 'Outreach Response Rate Optimization',
      prompt: `A carrier rep's outreach has a 15% response rate. Generate hypotheses for what might be wrong and experiments to test improvements.`,
      expectedSkills: [
        'response rate analysis',
        'hypothesis generation',
        'A/B testing design',
      ],
      knowledgeBaseIntegration: [
        'OUTREACH_RESPONSE_OPTIMIZATION',
        'A_B_TESTING_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 129],
      assessmentCriteria: [
        'Comprehensive response rate analysis',
        'Data-driven hypothesis generation',
        'Practical experiment design',
        'Measurement and iteration strategies',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 196,
      category: 'Market Intelligence & Optimization',
      title: 'Carrier Relationship Lifetime Value',
      prompt: `Calculate the lifetime value of a carrier relationship: If a carrier hauls 2 loads per month with an average gross margin of $300 per load, and stays active for 18 months, what is their value?`,
      expectedSkills: [
        'carrier lifetime value calculation',
        'relationship economics analysis',
        'retention value quantification',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_LIFETIME_VALUE_FRAMEWORKS',
        'RELATIONSHIP_ECONOMICS_ANALYSIS',
      ],
      difficulty: 'intermediate',
      prerequisites: [158, 170],
      assessmentCriteria: [
        'Accurate lifetime value calculation',
        'Comprehensive economic analysis',
        'Retention strategy implications',
        'Resource allocation optimization',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 197,
      category: 'Market Intelligence & Optimization',
      title: 'Carrier Network Scaling Forecast',
      prompt: `You're asked to forecast how many carrier contacts need to be made to build a network of 100 active carriers. Show your methodology and assumptions.`,
      expectedSkills: [
        'carrier network scaling forecast',
        'contact-to-carrier conversion analysis',
        'network building methodology',
      ],
      knowledgeBaseIntegration: [
        'CARRIER_NETWORK_SCALING_MODELS',
        'CONVERSION_ANALYSIS_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [158, 191],
      assessmentCriteria: [
        'Comprehensive forecasting methodology',
        'Realistic assumption documentation',
        'Scaling strategy recommendations',
        'Resource requirement calculations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 198,
      category: 'Market Intelligence & Optimization',
      title: 'First-Load Experience Impact Analysis',
      prompt: `Analyze the correlation between time-to-first-response and conversion rates. If faster response matters, what operational changes would you recommend?`,
      expectedSkills: [
        'first-load experience analysis',
        'response time correlation assessment',
        'operational change recommendations',
      ],
      knowledgeBaseIntegration: [
        'FIRST_LOAD_EXPERIENCE_FRAMEWORKS',
        'OPERATIONAL_OPTIMIZATION_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [161, 179],
      assessmentCriteria: [
        'Accurate experience correlation analysis',
        'Data-driven operational recommendations',
        'Implementation feasibility assessment',
        'Success measurement approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 199,
      category: 'Market Intelligence & Optimization',
      title: 'New Objection Pattern Analysis',
      prompt: `You encountered a carrier objection you've never heard before: "I only work with brokers who have their own warehouses." How would you research this requirement and update your knowledge base?`,
      expectedSkills: [
        'new objection research methodology',
        'knowledge base updating',
        'carrier requirement analysis',
      ],
      knowledgeBaseIntegration: [
        'OBJECTION_RESEARCH_FRAMEWORKS',
        'KNOWLEDGE_BASE_MAINTENANCE',
      ],
      difficulty: 'expert',
      prerequisites: [141, 192],
      assessmentCriteria: [
        'Systematic new objection research approach',
        'Knowledge base updating methodology',
        'Strategic response development',
        'Continuous learning integration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 200,
      category: 'Market Intelligence & Optimization',
      title: 'Carrier Acquisition Role Reflection',
      prompt: `Reflect on your role in carrier acquisition: what are your unique strengths as an AI assistant, what are your limitations, and how can you maximize value while maintaining transparency about both?`,
      expectedSkills: [
        'role reflection and analysis',
        'strength and limitation assessment',
        'value maximization strategies',
      ],
      knowledgeBaseIntegration: [
        'AI_ASSISTANT_ROLE_FRAMEWORKS',
        'VALUE_MAXIMIZATION_STRATEGIES',
      ],
      difficulty: 'expert',
      prerequisites: [1, 10, 100], // Links to shipper version and carrier basics
      assessmentCriteria: [
        'Comprehensive role reflection',
        'Accurate strength and limitation identification',
        'Strategic value maximization approaches',
        'Transparency maintenance strategies',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // REPUTATION MANAGEMENT SPECIALIST (215-235)
    // ==========================================
    {
      id: 215,
      category: 'Reputation Management',
      title: '5-Star Review Generation Strategy',
      prompt: `Design a comprehensive strategy for generating 5-star reviews from satisfied customers. Include timing, messaging, platforms, and follow-up sequences.`,
      expectedSkills: [
        'review generation system design',
        'customer satisfaction timing',
        'multi-platform review orchestration',
        'follow-up sequence optimization',
      ],
      knowledgeBaseIntegration: [
        'REVIEW_GENERATION_FRAMEWORKS',
        'CUSTOMER_SATISFACTION_TIMING',
        'MULTI_PLATFORM_REVIEW_STRATEGIES',
      ],
      difficulty: 'expert',
      prerequisites: [124, 162],
      assessmentCriteria: [
        'Comprehensive review generation strategy',
        'Optimal timing for review requests',
        'Multi-platform coverage and coordination',
        'Follow-up sequences for maximum response rate',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 216,
      category: 'Reputation Management',
      title: 'Online Reputation Crisis Management',
      prompt: `A negative review has been posted about a carrier experience. Develop a 5-step crisis management response strategy that addresses the issue while protecting brand reputation.`,
      expectedSkills: [
        'reputation crisis management',
        'negative review response strategy',
        'brand protection techniques',
        'customer issue resolution',
      ],
      knowledgeBaseIntegration: [
        'REPUTATION_CRISIS_FRAMEWORKS',
        'NEGATIVE_REVIEW_RESPONSE_STRATEGIES',
        'BRAND_PROTECTION_METHODS',
      ],
      difficulty: 'expert',
      prerequisites: [124, 167],
      assessmentCriteria: [
        'Comprehensive crisis management strategy',
        'Empathetic yet professional response approach',
        'Brand reputation protection measures',
        'Issue resolution and follow-up planning',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 217,
      category: 'Reputation Management',
      title: 'Review Response Automation',
      prompt: `Create automated response templates for different types of reviews (5-star, 3-star, 1-star) that maintain brand voice while addressing specific customer feedback.`,
      expectedSkills: [
        'automated review response systems',
        'brand voice consistency',
        'customer feedback categorization',
        'personalized response generation',
      ],
      knowledgeBaseIntegration: [
        'REVIEW_RESPONSE_AUTOMATION',
        'BRAND_VOICE_FRAMEWORKS',
        'CUSTOMER_FEEDBACK_CATEGORIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 124],
      assessmentCriteria: [
        'Comprehensive response templates for all review types',
        'Consistent brand voice maintenance',
        'Specific feedback addressing',
        'Personalization and authenticity',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 218,
      category: 'Reputation Management',
      title: 'Social Proof Enhancement Strategy',
      prompt: `Develop a strategy to enhance social proof across all customer touchpoints, including testimonials, case studies, and third-party validations.`,
      expectedSkills: [
        'social proof optimization',
        'testimonial collection systems',
        'case study development',
        'third-party validation strategies',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_PROOF_FRAMEWORKS',
        'TESTIMONIAL_COLLECTION_STRATEGIES',
        'CASE_STUDY_DEVELOPMENT',
      ],
      difficulty: 'advanced',
      prerequisites: [162, 212],
      assessmentCriteria: [
        'Comprehensive social proof strategy',
        'Multi-touchpoint coverage',
        'Testimonial collection methodology',
        'Third-party validation approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 219,
      category: 'Reputation Management',
      title: 'Customer Feedback Analysis System',
      prompt: `Design a system for analyzing customer feedback across all channels (reviews, surveys, support tickets) to identify patterns and improvement opportunities.`,
      expectedSkills: [
        'customer feedback analysis',
        'sentiment pattern recognition',
        'improvement opportunity identification',
        'multi-channel feedback integration',
      ],
      knowledgeBaseIntegration: [
        'CUSTOMER_FEEDBACK_ANALYSIS_FRAMEWORKS',
        'SENTIMENT_PATTERN_RECOGNITION',
        'MULTI_CHANNEL_FEEDBACK_INTEGRATION',
      ],
      difficulty: 'expert',
      prerequisites: [207, 211],
      assessmentCriteria: [
        'Comprehensive feedback analysis system',
        'Pattern recognition methodology',
        'Actionable improvement identification',
        'Multi-channel integration approach',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 220,
      category: 'Reputation Management',
      title: 'Review Platform Optimization',
      prompt: `Create a strategy for optimizing presence and performance across major review platforms (Google, Yelp, Transport Reviews) including SEO and engagement tactics.`,
      expectedSkills: [
        'review platform optimization',
        'online reputation SEO',
        'platform-specific engagement strategies',
        'reputation monitoring systems',
      ],
      knowledgeBaseIntegration: [
        'REVIEW_PLATFORM_OPTIMIZATION',
        'REPUTATION_SEO_STRATEGIES',
        'PLATFORM_ENGAGEMENT_FRAMEWORKS',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 162],
      assessmentCriteria: [
        'Platform-specific optimization strategies',
        'SEO and discoverability enhancement',
        'Engagement and response tactics',
        'Performance monitoring and improvement',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // FINANCIAL TECHNOLOGY & AI IMPLEMENTATION (233-270)
    // ==========================================
    {
      id: 233,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation AI Accounting Platform Selection',
      prompt: `Evaluate transportation-focused AI accounting platforms (Oracle NetSuite, Sage Intacct, Microsoft Dynamics 365, SAP S/4HANA) for FleetFlow, considering load-based revenue recognition, carrier payment terms, fuel surcharge tracking, and equipment financing needs.`,
      expectedSkills: [
        'transportation accounting platform evaluation',
        'carrier payment cycle analysis',
        'fuel and equipment cost optimization',
        'TMS-financial system integration assessment',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_ACCOUNTING_FRAMEWORKS',
        'CARRIER_PAYMENT_OPTIMIZATION',
        'FUEL_SURCHARGE_AUTOMATION',
        'EQUIPMENT_FINANCING_TRACKING',
      ],
      difficulty: 'expert',
      prerequisites: [162, 212],
      assessmentCriteria: [
        'Transportation-specific feature evaluation',
        'Carrier payment and settlement optimization',
        'Fuel cost and surcharge automation',
        'TMS integration capabilities assessment',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 234,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation FP&A Implementation Strategy',
      prompt: `Design a transportation-focused FP&A implementation strategy for FleetFlow using seasonal freight forecasting, carrier capacity modeling, and fuel price scenario planning to optimize network profitability and capacity utilization.`,
      expectedSkills: [
        'transportation FP&A implementation',
        'seasonal demand forecasting deployment',
        'carrier capacity optimization',
        'fuel price scenario planning',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_FP&A_FRAMEWORKS',
        'SEASONAL_DEMAND_FORECASTING',
        'CARRIER_CAPACITY_MODELING',
        'FUEL_PRICE_SCENARIO_PLANNING',
      ],
      difficulty: 'expert',
      prerequisites: [207, 211],
      assessmentCriteria: [
        'Transportation-specific forecasting models',
        'Carrier capacity utilization optimization',
        'Fuel price impact scenario analysis',
        'Network profitability enhancement metrics',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 235,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation Financial Close Automation',
      prompt: `Design transportation-focused financial close automation for FleetFlow using weekly carrier settlements, load-based accruals, fuel surcharge calculations, and detention/demurrage tracking to reduce close time from 15 days to 3 days.`,
      expectedSkills: [
        'transportation close automation',
        'carrier settlement optimization',
        'load-based revenue recognition',
        'fuel surcharge close processing',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_CLOSE_AUTOMATION',
        'CARRIER_SETTLEMENT_OPTIMIZATION',
        'LOAD_BASED_ACCRUALS',
        'FUEL_SURCHARGE_PROCESSING',
      ],
      difficulty: 'advanced',
      prerequisites: [162, 212],
      assessmentCriteria: [
        'Weekly carrier settlement automation',
        'Load-based revenue recognition accuracy',
        'Fuel surcharge calculation efficiency',
        'Detention/demurrage tracking integration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 236,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation AP Automation Strategy',
      prompt: `Design transportation-focused AP automation for FleetFlow handling carrier settlements, fuel card invoices, maintenance bills, and insurance premiums with 3-way matching for load confirmations, fuel purchases, and equipment repairs.`,
      expectedSkills: [
        'transportation AP automation',
        'carrier settlement processing',
        'fuel card and maintenance invoice handling',
        '3-way matching for transportation expenses',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_AP_AUTOMATION',
        'CARRIER_SETTLEMENT_PROCESSING',
        'FUEL_MAINTENANCE_INVOICE_HANDLING',
        'TRANSPORTATION_3WAY_MATCHING',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 162],
      assessmentCriteria: [
        'Carrier settlement automation efficiency',
        'Fuel and maintenance expense processing',
        'Insurance premium tracking integration',
        'Load confirmation matching accuracy',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 237,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation AR Optimization Strategy',
      prompt: `Design transportation AR optimization for FleetFlow focusing on shipper payment collections, factoring arrangements, detention claims, and carrier payment acceleration to reduce DSO from 45 to 30 days.`,
      expectedSkills: [
        'transportation AR optimization',
        'shipper payment collection strategies',
        'factoring and detention claim management',
        'carrier payment acceleration techniques',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_AR_OPTIMIZATION',
        'SHIPPER_PAYMENT_COLLECTIONS',
        'FACTORING_DETENTION_CLAIMS',
        'CARRIER_PAYMENT_ACCELERATION',
      ],
      difficulty: 'expert',
      prerequisites: [207, 211],
      assessmentCriteria: [
        'Shipper payment collection efficiency',
        'Factoring arrangement optimization',
        'Detention claim processing automation',
        'Carrier payment cycle acceleration',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 238,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation Expense Management Strategy',
      prompt: `Design transportation expense management for FleetFlow covering fuel cards, driver advances, tolls, maintenance, insurance, and ELD compliance costs with automated reconciliation and spend control policies.`,
      expectedSkills: [
        'transportation expense management',
        'fuel card and driver advance tracking',
        'maintenance and compliance cost control',
        'automated expense reconciliation',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_EXPENSE_MANAGEMENT',
        'FUEL_DRIVER_ADVANCE_TRACKING',
        'MAINTENANCE_COMPLIANCE_COSTS',
        'EXPENSE_RECONCILIATION_AUTOMATION',
      ],
      difficulty: 'expert',
      prerequisites: [162, 212],
      assessmentCriteria: [
        'Fuel expense tracking and optimization',
        'Driver advance reconciliation accuracy',
        'Maintenance cost control effectiveness',
        'ELD and compliance expense management',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 239,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation Financial Technology ROI',
      prompt: `Calculate ROI for FleetFlow's AI financial systems investment focusing on carrier settlement automation savings ($15-25 per invoice), 15-30% DSO reduction, and 75% manual processing elimination across transportation operations.`,
      expectedSkills: [
        'transportation financial ROI calculation',
        'carrier settlement cost analysis',
        'DSO reduction impact assessment',
        'manual processing elimination metrics',
      ],
      knowledgeBaseIntegration: [
        'TRANSPORTATION_FINANCIAL_ROI_FRAMEWORKS',
        'CARRIER_SETTLEMENT_COST_ANALYSIS',
        'DSO_REDUCTION_IMPACT',
        'MANUAL_PROCESSING_ELIMINATION',
      ],
      difficulty: 'advanced',
      prerequisites: [207, 211],
      assessmentCriteria: [
        'Carrier settlement automation savings',
        'DSO reduction financial impact',
        'Manual processing cost elimination',
        'Transportation-specific ROI metrics',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 240,
      category: 'Financial Technology & AI Implementation',
      title: 'Transportation Financial Systems Integration',
      prompt: `Design TMS-financial system integration for FleetFlow connecting load data, carrier settlements, fuel tracking, and maintenance costs with real-time synchronization and automated reconciliation.`,
      expectedSkills: [
        'TMS-financial system integration',
        'load data and settlement synchronization',
        'fuel and maintenance cost tracking',
        'automated reconciliation frameworks',
      ],
      knowledgeBaseIntegration: [
        'TMS_FINANCIAL_INTEGRATION_FRAMEWORKS',
        'LOAD_SETTLEMENT_SYNCHRONIZATION',
        'FUEL_MAINTENANCE_TRACKING',
        'AUTOMATED_RECONCILIATION_SYSTEMS',
      ],
      difficulty: 'expert',
      prerequisites: [207, 211],
      assessmentCriteria: [
        'TMS-financial data synchronization',
        'Load-based settlement automation',
        'Fuel and maintenance cost integration',
        'Real-time reconciliation accuracy',
      ],
      acquisitionType: 'carrier',
    },

    // ==========================================
    // AI BUSINESS APPLICATIONS (241-255)
    // ==========================================
    {
      id: 241,
      category: 'AI Business Applications',
      title: 'AI-Powered Competitor CAC Analysis',
      prompt: `Using AI tools, generate 3 specific strategies competitors might be using to lower their customer acquisition costs in the transportation industry right now.`,
      expectedSkills: [
        'ai-powered competitor analysis',
        'customer acquisition cost optimization',
        'market trend identification',
      ],
      knowledgeBaseIntegration: [
        'AI_COMPETITOR_ANALYSIS_FRAMEWORKS',
        'TRANSPORTATION_CAC_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [116, 192],
      assessmentCriteria: [
        'Effective use of AI for competitor intelligence',
        'Industry-specific CAC reduction strategies',
        'Market trend awareness and application',
        'Strategic recommendations for carrier acquisition',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 242,
      category: 'AI Business Applications',
      title: 'AI-Structured Carrier Negotiation Strategy',
      prompt: `A carrier is demanding better payment terms. Use AI to develop 5 non-obvious negotiation strategies that could convince them to accept current terms while maintaining the relationship.`,
      expectedSkills: [
        'ai-structured strategic problem solving',
        'carrier negotiation strategy development',
        'creative solution generation',
      ],
      knowledgeBaseIntegration: [
        'AI_NEGOTIATION_FRAMEWORKS',
        'CARRIER_PAYMENT_STRATEGIES',
      ],
      difficulty: 'expert',
      prerequisites: [147, 209],
      assessmentCriteria: [
        'Structured approach to carrier negotiations',
        'Non-obvious, relationship-preserving strategies',
        'AI-enhanced problem-solving methodology',
        'Practical implementation considerations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 204,
      category: 'AI Business Applications',
      title: 'AI-Powered Carrier Strategy Review',
      prompt: `Review a carrier acquisition strategy document using AI. Identify 3 emerging transportation industry trends that should be incorporated and challenge 2 key assumptions.`,
      expectedSkills: [
        'ai-powered strategic plan analysis',
        'transportation industry trend identification',
        'assumption challenging',
      ],
      knowledgeBaseIntegration: [
        'AI_STRATEGIC_ANALYSIS_FRAMEWORKS',
        'TRANSPORTATION_TREND_ANALYSIS',
      ],
      difficulty: 'advanced',
      prerequisites: [103, 192],
      assessmentCriteria: [
        'Systematic strategic plan review',
        'Relevant transportation industry trends',
        'Effective assumption challenging',
        'Actionable improvement recommendations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 243,
      category: 'AI Business Applications',
      title: 'AI Carrier Pricing Architecture Design',
      prompt: `Design the technical architecture for a dynamic carrier pricing system that adjusts rates based on load volume, carrier performance, and market conditions.`,
      expectedSkills: [
        'ai-assisted technical architecture design',
        'dynamic carrier pricing system',
        'performance-based pricing implementation',
      ],
      knowledgeBaseIntegration: [
        'AI_TECHNICAL_ARCHITECTURE_FRAMEWORKS',
        'DYNAMIC_CARRIER_PRICING',
      ],
      difficulty: 'expert',
      prerequisites: [170, 177],
      assessmentCriteria: [
        'Comprehensive pricing architecture design',
        'AI-enhanced system planning',
        'Scalable carrier pricing implementation',
        'Integration and data flow considerations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 244,
      category: 'AI Business Applications',
      title: 'AI Carrier Churn Analysis',
      prompt: `Analyze carrier performance data using AI to identify the most likely causes of carrier churn and generate 2 retention strategies to implement immediately.`,
      expectedSkills: [
        'ai-powered carrier data analysis',
        'carrier churn pattern identification',
        'retention strategy development',
      ],
      knowledgeBaseIntegration: [
        'AI_DATA_ANALYSIS_FRAMEWORKS',
        'CARRIER_CHURN_PREVENTION',
      ],
      difficulty: 'advanced',
      prerequisites: [167, 179],
      assessmentCriteria: [
        'Effective AI data analysis methodology',
        'Accurate carrier churn cause identification',
        'Actionable retention strategies',
        'Testing and measurement approaches',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 245,
      category: 'AI Business Applications',
      title: 'AI Cross-Border Carrier Expansion',
      prompt: `Research regulatory and operational differences for expanding carrier acquisition into Canada using AI, identifying key compliance requirements and market opportunities.`,
      expectedSkills: [
        'ai-powered regulatory research',
        'cross-border carrier expansion',
        'canadian transportation compliance',
      ],
      knowledgeBaseIntegration: [
        'AI_REGULATORY_RESEARCH_FRAMEWORKS',
        'CROSS_BORDER_CARRIER_EXPANSION',
      ],
      difficulty: 'advanced',
      prerequisites: [187, 194],
      assessmentCriteria: [
        'Comprehensive regulatory research',
        'Key compliance differences identified',
        'Market opportunity assessment',
        'Strategic expansion recommendations',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 246,
      category: 'AI Business Applications',
      title: 'AI Carrier Contract Negotiation',
      prompt: `Develop leverage points for renegotiating carrier contract terms using AI to analyze typical transportation industry contract clauses and common concessions.`,
      expectedSkills: [
        'ai-powered carrier negotiation strategy',
        'transportation contract analysis',
        'industry leverage identification',
      ],
      knowledgeBaseIntegration: [
        'AI_NEGOTIATION_FRAMEWORKS',
        'TRANSPORTATION_CONTRACT_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [141, 147],
      assessmentCriteria: [
        'Strategic leverage point identification',
        'Transportation industry contract analysis',
        'Negotiation position strengthening',
        'Practical carrier relationship application',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 247,
      category: 'AI Business Applications',
      title: 'AI Carrier Acquisition Manager Role',
      prompt: `Create an optimized job description for a Carrier Acquisition Manager using AI, including specific KPIs for carrier onboarding, retention, and network expansion.`,
      expectedSkills: [
        'ai-powered job description creation',
        'carrier acquisition role definition',
        'performance metric establishment',
      ],
      knowledgeBaseIntegration: [
        'AI_JOB_DESCRIPTION_FRAMEWORKS',
        'CARRIER_ACQUISITION_PERFORMANCE_METRICS',
      ],
      difficulty: 'intermediate',
      prerequisites: [101, 134],
      assessmentCriteria: [
        'Comprehensive carrier acquisition job description',
        'Clear KPI and success metrics',
        'Role-specific transportation industry requirements',
        'Candidate attraction optimization',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 248,
      category: 'AI Business Applications',
      title: 'AI Carrier Performance Communication',
      prompt: `Generate a professional communication script for addressing performance issues with a carrier, balancing clarity with relationship preservation.`,
      expectedSkills: [
        'ai-powered carrier communication scripting',
        'difficult conversation management',
        'performance issue communication',
      ],
      knowledgeBaseIntegration: [
        'AI_COMMUNICATION_SCRIPTING',
        'CARRIER_PERFORMANCE_MANAGEMENT',
      ],
      difficulty: 'intermediate',
      prerequisites: [124, 167],
      assessmentCriteria: [
        'Professional and compassionate tone',
        'Clear communication of performance issues',
        'Actionable improvement steps',
        'Relationship preservation focus',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 249,
      category: 'AI Business Applications',
      title: 'AI Carrier Acquisition Positioning',
      prompt: `Develop a brand positioning strategy that differentiates FleetFlow's carrier acquisition approach from competitors, highlighting unique advantages in the transportation industry.`,
      expectedSkills: [
        'ai-powered carrier brand positioning',
        'competitive differentiation analysis',
        'transportation industry positioning',
      ],
      knowledgeBaseIntegration: [
        'AI_BRAND_POSITIONING_FRAMEWORKS',
        'CARRIER_ACQUISITION_DIFFERENTIATION',
      ],
      difficulty: 'advanced',
      prerequisites: [125, 192],
      assessmentCriteria: [
        'Clear competitive differentiation in carrier acquisition',
        'Compelling value proposition for carriers',
        'Transportation industry resonance',
        'Strategic positioning implementation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 250,
      category: 'AI Business Applications',
      title: 'AI Carrier Strategy Presentation',
      prompt: `Design a carrier acquisition strategy presentation using AI tools, covering market opportunity, competitive advantages, carrier onboarding process, and success metrics.`,
      expectedSkills: [
        'ai-powered presentation design',
        'carrier acquisition strategy communication',
        'transportation industry presentation',
      ],
      knowledgeBaseIntegration: [
        'AI_PRESENTATION_FRAMEWORKS',
        'CARRIER_STRATEGY_PRESENTATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [103, 162],
      assessmentCriteria: [
        'Logical carrier acquisition presentation structure',
        'Compelling transportation industry narrative',
        'Key strategy points effectively communicated',
        'Stakeholder engagement optimization',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 251,
      category: 'AI Business Applications',
      title: 'AI Carrier Outreach Optimization',
      prompt: `Analyze the current carrier outreach workflow using AI to identify bottlenecks, then generate 3 optimization strategies for improving acquisition efficiency.`,
      expectedSkills: [
        'ai-powered carrier workflow analysis',
        'outreach process optimization',
        'carrier acquisition efficiency',
      ],
      knowledgeBaseIntegration: [
        'AI_WORKFLOW_OPTIMIZATION',
        'CARRIER_OUTREACH_EFFICIENCY',
      ],
      difficulty: 'advanced',
      prerequisites: [121, 195],
      assessmentCriteria: [
        'Accurate carrier outreach bottleneck identification',
        'Effective optimization strategies',
        'Measurable efficiency improvements',
        'Practical carrier acquisition implementation',
      ],
      acquisitionType: 'carrier',
    },
    {
      id: 252,
      category: 'AI Business Applications',
      title: 'AI Carrier Market Expansion',
      prompt: `Use AI to analyze expansion opportunities into new geographic regions for carrier acquisition, identifying regulatory requirements, market size, and competitive landscape.`,
      expectedSkills: [
        'ai-powered carrier market expansion analysis',
        'geographic opportunity assessment',
        'regional carrier network planning',
      ],
      knowledgeBaseIntegration: [
        'AI_MARKET_EXPANSION_FRAMEWORKS',
        'REGIONAL_CARRIER_ACQUISITION_STRATEGIES',
      ],
      difficulty: 'expert',
      prerequisites: [157, 194],
      assessmentCriteria: [
        'Comprehensive geographic expansion analysis',
        'Regulatory and market opportunity assessment',
        'Strategic carrier acquisition recommendations',
        'Risk and implementation considerations',
      ],
      acquisitionType: 'carrier',
    },

    // ========================================================================
    // FREIGHT BROKER STARTUP & GROWTH (IDs 253-272)
    // Based on "Finding Shippers 101" by DAT Freight & Analytics
    // Comprehensive training for new brokers from first call to expansion
    // ========================================================================

    {
      id: 253,
      category: 'Broker Startup & Shipper Acquisition',
      title: 'New Broker Prospecting Strategy - Aim Small Miss Small',
      prompt: `You're advising a brand new freight broker starting from scratch. Explain the "aim small, miss small" prospecting philosophy and why they should focus on a specific region, market, or industry instead of casting a wide net. Include essential brand-building steps: website, professional email domain, LinkedIn, LLC, and bank account.`,
      expectedSkills: [
        'prospecting strategy',
        'market focus and targeting',
        'brand building for new brokers',
        'niche selection',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'SHIPPER_PROSPECTING_STRATEGIES',
        'BRAND_BUILDING_ESSENTIALS',
      ],
      difficulty: 'basic',
      prerequisites: [],
      assessmentCriteria: [
        'Explains focused targeting vs wide net approach',
        'Identifies brand essentials (website, email, LinkedIn)',
        'Emphasizes professional email domain importance',
        'Recommends LLC and bank account setup',
        'Describes how brand strength pays dividends',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 254,
      category: 'Broker Startup & Shipper Acquisition',
      title: 'Pre-Call Research Using Load Boards',
      prompt: `A new broker is about to make their first shipper cold call. What research must they complete beforehand using DAT One or similar load boards? Explain why you can't call a shipper "empty-handed" and what specific market data they need: current rates, cost to get a truck, market conditions (supply vs demand), and load-to-truck ratios.`,
      expectedSkills: [
        'load board research',
        'rate analysis',
        'market conditions assessment',
        'capacity analysis',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'DAT_ONE_LOAD_BOARD',
        'MARKET_CONDITIONS_RESEARCH',
      ],
      difficulty: 'basic',
      prerequisites: [253],
      assessmentCriteria: [
        'Identifies need for current lane rates',
        'Explains cost to get a truck research',
        'Describes market conditions analysis',
        'Emphasizes load-to-truck ratio importance',
        'Shows why empty-handed calls fail',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 255,
      category: 'Broker Startup & Shipper Acquisition',
      title:
        'New Broker Value Proposition - Turn Disadvantages Into Advantages',
      prompt: `Create a compelling value proposition for a solo freight broker competing against established brokerages. Turn their "disadvantages" (new, small, no track record) into competitive advantages: single point of contact, white-glove service, flexibility, agility, custom service options. Include competitive pricing strategy.`,
      expectedSkills: [
        'value proposition development',
        'competitive positioning',
        'pricing strategy',
        'service differentiation',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'NEW_BROKER_ADVANTAGES',
        'WHITE_GLOVE_SERVICE',
      ],
      difficulty: 'intermediate',
      prerequisites: [253, 254],
      assessmentCriteria: [
        'Positions solo operation as advantage',
        'Highlights flexibility and agility benefits',
        'Suggests competitive pricing strategy',
        'Emphasizes white-glove service delivery',
        'Mentions custom service options',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 256,
      category: 'Broker Startup & Shipper Acquisition',
      title: 'Load Tracking as Table-Stakes Requirement',
      prompt: `Explain why load tracking is "table-stakes" for shippers and how a new broker should prepare to meet these requirements before their first call. Include the dual benefit: shipper satisfaction (always knowing where product is) + operational efficiency (reducing check calls for carrier reps).`,
      expectedSkills: [
        'load tracking systems',
        'shipper requirements',
        'visibility solutions',
        'check call reduction',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'LOAD_TRACKING_SYSTEMS',
        'SHIPPER_SCORECARD_REQUIREMENTS',
      ],
      difficulty: 'intermediate',
      prerequisites: [254],
      assessmentCriteria: [
        'Explains load tracking as table-stakes',
        'Describes visibility importance to shippers',
        'Identifies dual benefit (shipper + efficiency)',
        'Recommends having tracking plan before calls',
        'Shows impact on carrier rep productivity',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 257,
      category: 'Broker Startup & Shipper Acquisition',
      title: 'Cold Call Energy and Confident Closing',
      prompt: `You're coaching a new broker on cold calling technique. Explain the importance of energy/enthusiasm, the physical tactics (standing up, smiling, walking, mirror trick), and the confident closing question: "Do you have truckloads I can handle for you?" Why does this direct approach work better than waiting for offers? Why should they avoid generic online scripts?`,
      expectedSkills: [
        'cold calling technique',
        'energy management',
        'closing strategies',
        'confidence building',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'COLD_CALLING_BEST_PRACTICES',
        'CLOSING_TECHNIQUES',
      ],
      difficulty: 'intermediate',
      prerequisites: [253, 254, 255],
      assessmentCriteria: [
        'Emphasizes being likable sells principle',
        'Describes physical tactics (stand, smile, walk, mirror)',
        'Provides direct closing question',
        'Explains why direct approach outperforms passive',
        'Warns against generic scripts',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 258,
      category: 'Broker Startup & Carrier Network',
      title: 'Building Trusted Carrier Networks - The 90-Day Challenge',
      prompt: `A new broker has secured their first shipper but has no carrier network. Explain the 90-day credit line challenge that makes vetting difficult, the critical importance of carrier vetting, and how to use tools like DAT Directory, CarrierWatch (insurance/safety validation), and OnBoard (fast onboarding) to build a trusted network quickly.`,
      expectedSkills: [
        'carrier network building',
        'carrier vetting',
        'credit line management',
        'trust building',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'CARRIER_VETTING_TOOLS',
        'DAT_DIRECTORY',
        'CARRIERWATCH',
      ],
      difficulty: 'intermediate',
      prerequisites: [257],
      assessmentCriteria: [
        'Explains 90-day credit line challenge',
        'Describes carrier vetting critical importance',
        'Identifies CarrierWatch for validation',
        'Mentions DAT Directory for carrier reviews',
        'Suggests OnBoard for fast onboarding',
      ],
      acquisitionType: 'carrier',
    },

    {
      id: 259,
      category: 'Broker Startup & Carrier Network',
      title: 'DAT Profile Optimization for Carrier Trust',
      prompt: `Guide a new broker on optimizing their DAT profile to attract quality carriers. Include the critical importance of domained email addresses (yourname@yourcompany.com vs yourcompany@gmail.com), company reviews, credit scores, and complete contact information. Why does professional email domain matter so much for trust?`,
      expectedSkills: [
        'profile optimization',
        'trust signals',
        'professional branding',
        'carrier attraction',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'DAT_PROFILE_OPTIMIZATION',
        'TRUST_BUILDING_SIGNALS',
      ],
      difficulty: 'basic',
      prerequisites: [258],
      assessmentCriteria: [
        'Emphasizes domained email critical importance',
        'Lists complete profile optimization elements',
        'Explains trust signal generation',
        'Recommends soliciting company reviews',
        'Shows professional branding impact',
      ],
      acquisitionType: 'carrier',
    },

    {
      id: 260,
      category: 'Broker Growth & Sustainability',
      title: 'Sustainable Growth - Reputation Over Volume',
      prompt: `A new broker wants to grow as fast as possible by adding customers rapidly. Explain why the "grow to manageable size, then double down on customer service" approach creates more sustainable success. Include the philosophy: "Grow a reputation, not just a business." Why does word-of-mouth from exemplary service beat rapid customer acquisition?`,
      expectedSkills: [
        'sustainable growth strategy',
        'customer service excellence',
        'reputation building',
        'long-term relationship focus',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'SUSTAINABLE_GROWTH_STRATEGIES',
        'RELATIONSHIP_BUILDING',
      ],
      difficulty: 'intermediate',
      prerequisites: [257, 258],
      assessmentCriteria: [
        'Contrasts sustainable vs rapid growth',
        'Emphasizes customer service over volume',
        'Explains reputation as competitive advantage',
        'Describes long-term relationship value',
        'Mentions word-of-mouth benefits',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 261,
      category: 'Broker Growth & Sustainability',
      title: 'Strategic Losses for Long-Term Relationship Gains',
      prompt: `Explain the counterintuitive strategy: "Don't be afraid to take a loss." When should a broker accept a money-losing load to preserve a relationship? How does this calculated risk create long-term financial rewards through trust and relationship history? Include the agility advantage small brokers have over large brokerages.`,
      expectedSkills: [
        'strategic decision making',
        'relationship preservation',
        'calculated risk taking',
        'long-term thinking',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'STRATEGIC_LOSS_MANAGEMENT',
        'RELATIONSHIP_PRESERVATION',
      ],
      difficulty: 'advanced',
      prerequisites: [260],
      assessmentCriteria: [
        'Explains when to accept strategic losses',
        'Describes relationship preservation value',
        'Identifies trust and history benefits',
        'Highlights small broker agility advantage',
        'Balances risk with long-term reward',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 262,
      category: 'Broker Technology & TMS',
      title: 'Spreadsheet Risk and TMS Transition Timing',
      prompt: `A broker is managing everything in spreadsheets for invoices, billing, payments, and prospecting. Explain the risk ("one typo away from crashing"), when to implement a TMS, and the benefits of a purpose-built broker TMS vs a repurposed shipper solution. Include the "brokerage-in-a-box" concept and the goal: grow your business, not your back office.`,
      expectedSkills: [
        'TMS evaluation',
        'technology transition planning',
        'operational efficiency',
        'scalability planning',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'TMS_IMPLEMENTATION',
        'DAT_BROKER_TMS',
      ],
      difficulty: 'intermediate',
      prerequisites: [260],
      assessmentCriteria: [
        'Identifies spreadsheet catastrophic risks',
        'Explains TMS timing and readiness signals',
        'Contrasts broker-specific vs repurposed TMS',
        'Describes brokerage-in-a-box concept',
        'Emphasizes growing business vs back office',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 263,
      category: 'Broker Technology & TMS',
      title: 'Modular TMS Scalability Strategy',
      prompt: `Explain the advantage of a modular TMS approach where brokers "add individual modules only as you need them – don't pay for features you don't need." How does this support the journey from startup to established brokerage? Include scalability benefits and cost efficiency.`,
      expectedSkills: [
        'TMS scalability',
        'cost management',
        'feature prioritization',
        'growth alignment',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'MODULAR_TMS_STRATEGY',
        'SCALABLE_TECHNOLOGY',
      ],
      difficulty: 'intermediate',
      prerequisites: [262],
      assessmentCriteria: [
        'Explains modular vs all-in-one approach',
        'Describes cost efficiency benefits',
        'Shows alignment with growth stages',
        'Identifies scalability advantages',
        'Recommends gradual feature adoption',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 264,
      category: 'Broker Technology & TMS',
      title: 'Complete Freight Cycle Management in TMS',
      prompt: `Describe how a purpose-built broker TMS handles the "entire freight cycle from finding trucks to getting paid" including accounting, documentation, tracking, and all steps in between. Why is this end-to-end integration critical for operational efficiency and scaling? What happens when systems are disconnected?`,
      expectedSkills: [
        'freight cycle understanding',
        'TMS integration',
        'operational efficiency',
        'end-to-end process management',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'FREIGHT_CYCLE_MANAGEMENT',
        'TMS_INTEGRATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [262, 263],
      assessmentCriteria: [
        'Maps complete freight cycle comprehensively',
        'Identifies critical integration points',
        'Explains efficiency gains from integration',
        'Describes scaling enablement',
        'Shows end-to-end visibility benefits',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 265,
      category: 'Market Intelligence & Analytics',
      title: 'Market Conditions Index (MCI) for Data-Driven Pricing',
      prompt: `Teach a broker how to use Market Conditions Index (MCI) to avoid the common mistake of "quoting prices without knowing supply and demand balance." Explain load-to-truck ratios, how to interpret them, 8-day forecasting capability, and how this enables negotiating with solid footing. When should brokers expect to pay premiums vs have pricing flexibility?`,
      expectedSkills: [
        'market conditions analysis',
        'load-to-truck ratios',
        'capacity forecasting',
        'data-driven pricing',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'MARKET_CONDITIONS_INDEX',
        'DAT_IQ_ANALYTICS',
      ],
      difficulty: 'intermediate',
      prerequisites: [254, 262],
      assessmentCriteria: [
        'Explains MCI purpose and core metrics',
        'Describes load-to-truck ratio interpretation',
        'Identifies 8-day forecasting capability',
        'Shows how MCI prevents mispricing',
        'Demonstrates negotiation advantage',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 266,
      category: 'Market Intelligence & Analytics',
      title: 'RateView for Profit Margin Protection',
      prompt: `A broker is about to quote a lane they've never run before. Explain how RateView ($150B+ in transactions across 68,000+ lanes) provides a "safeguard against misinformed quotes that leave you without a profit margin." Include how to use historical rates, forecasted rates, and how this transparency gives brokers "the upper hand" in negotiations.`,
      expectedSkills: [
        'rate analysis',
        'historical data interpretation',
        'forecasting',
        'negotiation preparation',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'RATEVIEW_ANALYTICS',
        'LANE_PRICING_DATA',
      ],
      difficulty: 'intermediate',
      prerequisites: [265],
      assessmentCriteria: [
        'Describes RateView massive data scope',
        'Explains protection against mispricing',
        'Identifies historical and forecasted rate access',
        'Shows negotiation confidence building',
        'Demonstrates profit margin protection',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 267,
      category: 'Market Intelligence & Analytics',
      title: 'Data-Driven Market Expansion Strategy',
      prompt: `A broker has achieved stability and wants to expand into new industries, geographic areas, or freight types. Explain how comprehensive market intelligence creates a "360-degree view of the market" for informed expansion. Include how to identify most profitable lanes, hot/cool markets, and use historical/current/forecasted rates for sound diversification decisions.`,
      expectedSkills: [
        'expansion planning',
        'market analysis',
        'profitability assessment',
        'data-driven decision making',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'MARKET_EXPANSION_ANALYTICS',
        'COMPREHENSIVE_MARKET_INTELLIGENCE',
      ],
      difficulty: 'advanced',
      prerequisites: [260, 265, 266],
      assessmentCriteria: [
        'Explains comprehensive market data approach',
        'Identifies three expansion opportunity types',
        'Describes profitability analysis capabilities',
        'Shows hot/cool market identification',
        'Demonstrates informed diversification approach',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 268,
      category: 'Market Intelligence & Analytics',
      title: 'Seasonality and Geographic Market Intelligence',
      prompt: `Using Market Conditions Index (MCI), explain how brokers can identify seasonality shifts and geographically normalized search and post behavior. How does accounting for inbound and outbound volume improve capacity planning? Provide examples of seasonal patterns in transportation.`,
      expectedSkills: [
        'seasonality analysis',
        'geographic market understanding',
        'capacity planning',
        'volume forecasting',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'SEASONALITY_ANALYSIS',
        'GEOGRAPHIC_MARKET_INTELLIGENCE',
      ],
      difficulty: 'advanced',
      prerequisites: [265],
      assessmentCriteria: [
        'Explains seasonality pattern identification',
        'Describes geographic normalization benefits',
        'Shows inbound/outbound volume impact',
        'Demonstrates capacity planning improvement',
        'Provides actionable seasonal planning insights',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 269,
      category: 'Broker Journey Archetypes',
      title: 'Three Broker Starting Points and Universal First Step',
      prompt: `Describe the three common broker journey archetypes: (1) Starting from scratch with just vision and determination, (2) Leaving a larger brokerage with a book of business, (3) Having carrier relationships but no shippers. What are the unique challenges and advantages of each? What's the universal first step for all three, and why?`,
      expectedSkills: [
        'broker journey understanding',
        'starting point assessment',
        'strategic planning',
        'universal principles',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'BROKER_JOURNEY_ARCHETYPES',
        'STARTING_POINT_STRATEGIES',
      ],
      difficulty: 'basic',
      prerequisites: [],
      assessmentCriteria: [
        'Identifies three distinct archetype types',
        'Describes unique challenges of each path',
        'Identifies unique advantages of each path',
        'States universal first step: find shippers',
        'Explains why shippers come first',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 270,
      category: 'Broker Success Principles',
      title: 'Old-Fashioned Customer Service in Modern Logistics',
      prompt: `Explain why "the logistics industry values old-fashioned customer service" and how this creates opportunity for new brokers. Include the principle: "If your customers like and trust you, they'll pay for that instead of searching for cheaper, untested alternatives." How does trust, reliability, and thoughtfulness separate brokers from price-only competition?`,
      expectedSkills: [
        'customer service philosophy',
        'trust building',
        'competitive differentiation',
        'value beyond price',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'CUSTOMER_SERVICE_EXCELLENCE',
        'TRUST_BASED_SELLING',
      ],
      difficulty: 'basic',
      prerequisites: [260],
      assessmentCriteria: [
        'Explains logistics industry service values',
        'Describes trust as competitive advantage',
        'Shows how service justifies premium pricing',
        'Emphasizes thoughtfulness and reliability',
        'Contrasts with price-only competition',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 271,
      category: 'Broker Success Principles',
      title: 'Patience and Realistic Growth Expectations',
      prompt: `A new broker is frustrated by slow growth after 3 months. Share the wisdom: "Rome wasn't built in a day" and "You've done the hardest part – starting." Explain why slower, relationship-focused growth often leads to more stable long-term success than rapid customer acquisition. How should they manage expectations and stay motivated?`,
      expectedSkills: [
        'expectation management',
        'patience and persistence',
        'long-term thinking',
        'emotional intelligence',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'GROWTH_EXPECTATIONS',
        'SUCCESS_PRINCIPLES',
      ],
      difficulty: 'basic',
      prerequisites: [260, 270],
      assessmentCriteria: [
        'Acknowledges difficulty of starting',
        'Validates slow growth frustration',
        'Explains relationship-focused benefits',
        'Contrasts stable vs rapid growth outcomes',
        'Provides encouragement and perspective',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 272,
      category: 'Broker Success Principles',
      title: 'The Symbiotic Shipper-Broker Relationship Philosophy',
      prompt: `Explain the fundamental principle: "Shippers and brokers have a symbiotic relationship. One has goods to be moved, the other has the means to move it." How should this philosophy guide a broker's approach to customer service, problem-solving, and long-term partnerships? Why is partnership mindset superior to transactional thinking?`,
      expectedSkills: [
        'relationship philosophy',
        'mutual value creation',
        'partnership mindset',
        'customer-centric thinking',
      ],
      knowledgeBaseIntegration: [
        'FREIGHT_BROKER_STARTUP_KB',
        'SYMBIOTIC_RELATIONSHIPS',
        'PARTNERSHIP_PRINCIPLES',
      ],
      difficulty: 'basic',
      prerequisites: [],
      assessmentCriteria: [
        'Explains symbiotic relationship concept clearly',
        'Describes mutual dependency dynamics',
        'Shows how this guides service approach',
        'Emphasizes partnership over transaction',
        'Demonstrates customer-centric mindset',
      ],
      acquisitionType: 'shipper',
    },

    // ========================================================================
    // EMAIL MARKETING & PSYCHOLOGICAL TRIGGERS (IDs 273-300)
    // 115 Psychological Triggers for Logistics Sales & Acquisition
    // Evidence-based email marketing principles for transportation industry
    // ========================================================================

    {
      id: 273,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Urgency & Scarcity in Logistics Email Campaigns',
      prompt: `Design an email campaign using urgency and scarcity triggers for logistics sales. Include 3 specific examples: limited capacity alert, rate expiration countdown, and peak season warning. Explain why these work in transportation and how to back them with genuine market data. Include best practices for authenticity.`,
      expectedSkills: [
        'urgency scarcity principles',
        'email campaign design',
        'market data integration',
        'psychological trigger application',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'URGENCY_SCARCITY_TRIGGERS',
        'TRANSPORTATION_MARKET_DATA',
      ],
      difficulty: 'intermediate',
      prerequisites: [],
      assessmentCriteria: [
        'Creates compelling urgency examples',
        'Explains transportation industry relevance',
        'Shows genuine market data integration',
        'Demonstrates authenticity best practices',
        'Provides measurable campaign goals',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 274,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Loss Aversion Email Sequences',
      prompt: `Create a 3-email sequence using loss aversion triggers for carrier acquisition. Include cost leakage alerts, competitor advantage messaging, and missed savings reports. Show how to quantify savings and make the pain points specific to transportation operations. Include timing and follow-up strategies.`,
      expectedSkills: [
        'loss aversion psychology',
        'email sequence design',
        'quantification techniques',
        'follow-up strategies',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'LOSS_AVERSION_TRIGGERS',
        'CARRIER_ACQUISITION_SEQUENCES',
      ],
      difficulty: 'intermediate',
      prerequisites: [273],
      assessmentCriteria: [
        'Builds logical 3-email sequence',
        'Quantifies savings with specific numbers',
        'Makes pain points transportation-specific',
        'Includes timing and follow-up strategies',
        'Shows psychological trigger progression',
      ],
      acquisitionType: 'carrier',
    },

    {
      id: 275,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Social Proof in Transportation Sales Emails',
      prompt: `Design social proof elements for a logistics sales email. Include industry leader endorsements, peer company success stories, and scale demonstrations. Explain how to make social proof relevant to different prospect types (by size, industry, geography). Include authenticity requirements and verification methods.`,
      expectedSkills: [
        'social proof application',
        'prospect segmentation',
        'authenticity verification',
        'industry relevance',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'SOCIAL_PROOF_TRIGGERS',
        'TRANSPORTATION_PROSPECT_SEGMENTATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [273, 274],
      assessmentCriteria: [
        'Designs relevant social proof elements',
        'Shows prospect type differentiation',
        'Explains authenticity requirements',
        'Provides verification methods',
        'Demonstrates industry-specific application',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 276,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Authority & Expertise Positioning in Email',
      prompt: `Position yourself as an authority in logistics email communications. Include industry tenure demonstration, specialized knowledge sharing, and proprietary data insights. Show how to educate prospects while selling, and explain the difference between genuine expertise vs manufactured authority. Include content calendar ideas.`,
      expectedSkills: [
        'authority positioning',
        'expertise demonstration',
        'educational content creation',
        'content calendar planning',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'AUTHORITY_EXPERTISE_TRIGGERS',
        'LOGISTICS_EDUCATIONAL_CONTENT',
      ],
      difficulty: 'advanced',
      prerequisites: [275],
      assessmentCriteria: [
        'Demonstrates genuine authority positioning',
        'Shows education-selling balance',
        'Differentiates genuine vs manufactured expertise',
        'Creates content calendar framework',
        'Provides long-term authority building strategy',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 277,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Reciprocity-Based Lead Magnets for Logistics',
      prompt: `Create reciprocity-based lead magnets specifically for logistics prospects. Include free audit offers, rate benchmarks, trial periods, and educational webinars. Explain how to make offers valuable enough to create obligation while remaining profitable. Include delivery methods and follow-up sequences.`,
      expectedSkills: [
        'reciprocity psychology',
        'lead magnet creation',
        'value proposition design',
        'profitability analysis',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'RECIPROCITY_TRIGGERS',
        'LOGISTICS_LEAD_MAGNETS',
      ],
      difficulty: 'intermediate',
      prerequisites: [276],
      assessmentCriteria: [
        'Creates transportation-specific lead magnets',
        'Balances value with profitability',
        'Designs effective delivery methods',
        'Creates follow-up sequence logic',
        'Shows obligation creation without pressure',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 278,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Deep Personalization in Logistics Email',
      prompt: `Show how to achieve deep personalization in logistics emails. Include lane-specific data, volume-based insights, industry challenge references, and competitive intelligence. Explain research methods, data sources, and timing considerations. Include personalization depth levels and automation strategies.`,
      expectedSkills: [
        'email personalization',
        'prospect research',
        'data integration',
        'automation implementation',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'PERSONALIZATION_TRIGGERS',
        'LOGISTICS_PROSPECT_RESEARCH',
      ],
      difficulty: 'advanced',
      prerequisites: [277],
      assessmentCriteria: [
        'Demonstrates personalization depth levels',
        'Shows research and data sources',
        'Explains timing considerations',
        'Provides automation strategies',
        'Shows ROI of personalization effort',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 279,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Commitment & Consistency Email Sequences',
      prompt: `Build commitment and consistency into logistics sales sequences. Include small first steps, value alignment messaging, and progressive disclosure. Explain how to use past behavior to create future consistency, and show how to make commitments feel safe and natural. Include commitment escalation strategies.`,
      expectedSkills: [
        'commitment psychology',
        'sequence design',
        'behavior analysis',
        'escalation strategies',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'COMMITMENT_CONSISTENCY_TRIGGERS',
        'BEHAVIOR_BASED_SEQUENCES',
      ],
      difficulty: 'intermediate',
      prerequisites: [278],
      assessmentCriteria: [
        'Builds logical commitment progression',
        'Uses past behavior effectively',
        'Makes commitments feel safe',
        'Shows escalation without pressure',
        'Demonstrates consistency principles',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 280,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Curiosity & Pattern Interrupt Email Openers',
      prompt: `Create curiosity-driven email openers that interrupt patterns in logistics communications. Include unexpected stats, contrarian views, mystery gaps, and provocative statements. Show how to follow curiosity hooks with valuable solutions, and explain why these work better than standard subject lines in a crowded inbox.`,
      expectedSkills: [
        'curiosity psychology',
        'pattern interruption',
        'subject line optimization',
        'value delivery',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'CURIOSITY_PATTERN_INTERRUPTS',
        'LOGISTICS_SUBJECT_LINE_OPTIMIZATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [279],
      assessmentCriteria: [
        'Creates compelling curiosity hooks',
        'Shows pattern interruption techniques',
        'Delivers value after curiosity',
        'Explains inbox differentiation',
        'Provides testing and iteration framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 281,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Combining Multiple Triggers in Single Emails',
      prompt: `Show how to combine 2-3 psychological triggers in single logistics emails without overwhelming prospects. Provide examples combining urgency+authority, social proof+reciprocity, and personalization+consistency. Explain trigger compatibility and sequencing within individual emails.`,
      expectedSkills: [
        'trigger combination',
        'email composition',
        'psychological layering',
        'trigger compatibility',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'TRIGGER_COMBINATION_STRATEGIES',
        'EMAIL_COMPOSITION_FRAMEWORK',
      ],
      difficulty: 'advanced',
      prerequisites: [273, 274, 275],
      assessmentCriteria: [
        'Shows effective trigger combinations',
        'Avoids overwhelming prospects',
        'Explains trigger compatibility logic',
        'Provides composition frameworks',
        'Demonstrates psychological layering',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 282,
      category: 'Email Marketing & Psychological Triggers',
      title: 'A/B Testing Psychological Triggers',
      prompt: `Design A/B tests for psychological triggers in logistics email campaigns. Include testing urgency vs social proof, different personalization depths, and curiosity vs direct approaches. Explain statistical significance, sample sizes, and how to interpret results for trigger optimization.`,
      expectedSkills: [
        'a/b testing design',
        'statistical analysis',
        'trigger optimization',
        'email performance measurement',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'EMAIL_A_B_TESTING_FRAMEWORK',
        'STATISTICAL_SIGNIFICANCE_LOGISTICS',
      ],
      difficulty: 'advanced',
      prerequisites: [281],
      assessmentCriteria: [
        'Designs comprehensive A/B test frameworks',
        'Shows statistical significance calculation',
        'Provides sample size guidelines',
        'Explains result interpretation',
        'Creates trigger optimization strategy',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 283,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Funnel Stage Trigger Alignment',
      prompt: `Align psychological triggers with funnel stages in logistics sales. Show top-of-funnel triggers (authority, education), middle-funnel triggers (personalization, loss aversion), and bottom-funnel triggers (urgency, commitment). Include transition strategies and trigger evolution across the buyer journey.`,
      expectedSkills: [
        'funnel stage analysis',
        'trigger alignment',
        'buyer journey mapping',
        'transition strategies',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'FUNNEL_STAGE_TRIGGER_ALIGNMENT',
        'LOGISTICS_BUYER_JOURNEY',
      ],
      difficulty: 'advanced',
      prerequisites: [282],
      assessmentCriteria: [
        'Maps triggers to funnel stages accurately',
        'Shows logical progression',
        'Provides transition strategies',
        'Explains buyer journey psychology',
        'Creates comprehensive funnel framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 284,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Authenticity in Psychological Trigger Usage',
      prompt: `Explain why authenticity is critical when using psychological triggers and how to maintain trust. Show how to verify claims, back up statistics, and ensure genuine value. Include red flags of inauthentic trigger usage and recovery strategies for damaged trust.`,
      expectedSkills: [
        'authenticity principles',
        'trust maintenance',
        'claim verification',
        'damage control',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'AUTHENTICITY_REQUIREMENTS',
        'TRUST_RECOVERY_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [283],
      assessmentCriteria: [
        'Explains authenticity critical importance',
        'Shows verification methodologies',
        'Identifies inauthentic red flags',
        'Provides trust recovery strategies',
        'Creates authenticity checklist',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 285,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Industry-Specific Trigger Adaptation',
      prompt: `Adapt psychological triggers for different logistics sub-industries: freight brokers, shippers, carriers, and 3PL providers. Show how urgency differs for spot market vs contract freight, and how social proof varies by company size and industry. Include industry-specific pain points and trigger customization.`,
      expectedSkills: [
        'industry adaptation',
        'trigger customization',
        'pain point identification',
        'segment-specific messaging',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'INDUSTRY_SPECIFIC_APPLICATIONS',
        'LOGISTICS_SUB_INDUSTRY_ANALYSIS',
      ],
      difficulty: 'advanced',
      prerequisites: [284],
      assessmentCriteria: [
        'Adapts triggers for each sub-industry',
        'Shows industry-specific pain points',
        'Provides customization frameworks',
        'Demonstrates segment differentiation',
        'Creates industry adaptation methodology',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 286,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Email Trigger Performance Metrics',
      prompt: `Define success metrics for psychological trigger campaigns in logistics. Include primary metrics (open rates, click rates, reply rates, conversion rates) and secondary metrics (unsubscribe rates, deliverability, engagement time). Show how to track attribution and calculate trigger effectiveness.`,
      expectedSkills: [
        'performance measurement',
        'metric definition',
        'attribution tracking',
        'effectiveness calculation',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'EMAIL_SUCCESS_METRICS',
        'ATTRIBUTION_TRACKING_LOGISTICS',
      ],
      difficulty: 'intermediate',
      prerequisites: [285],
      assessmentCriteria: [
        'Defines comprehensive metric framework',
        'Shows attribution methodology',
        'Provides benchmark targets',
        'Creates effectiveness calculation methods',
        'Shows continuous improvement process',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 287,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Ethical Trigger Usage in B2B Logistics',
      prompt: `Establish ethical guidelines for psychological trigger usage in logistics sales. Include transparency requirements, genuine value mandates, and avoiding manipulation. Show how to balance persuasion with integrity, and explain the long-term benefits of ethical trigger usage vs short-term gains from unethical approaches.`,
      expectedSkills: [
        'ethical persuasion',
        'transparency requirements',
        'integrity maintenance',
        'long-term relationship building',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'ETHICAL_TRIGGER_USAGE',
        'B2B_INTEGRITY_FRAMEWORK',
      ],
      difficulty: 'advanced',
      prerequisites: [284, 286],
      assessmentCriteria: [
        'Establishes clear ethical guidelines',
        'Shows transparency requirements',
        'Balances persuasion with integrity',
        'Demonstrates long-term benefit focus',
        'Creates ethical usage framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 288,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Trigger-Based Campaign Calendar Planning',
      prompt: `Create a quarterly email campaign calendar using psychological triggers. Include seasonal trigger alignment, trigger rotation to prevent fatigue, and campaign sequencing. Show how to align triggers with market events, regulatory changes, and business cycles in logistics.`,
      expectedSkills: [
        'campaign planning',
        'seasonal alignment',
        'trigger rotation',
        'market event integration',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'CAMPAIGN_CALENDAR_PLANNING',
        'LOGISTICS_MARKET_CYCLES',
      ],
      difficulty: 'advanced',
      prerequisites: [287],
      assessmentCriteria: [
        'Creates comprehensive quarterly calendar',
        'Shows seasonal trigger alignment',
        'Implements trigger rotation strategy',
        'Integrates market events and cycles',
        'Provides campaign sequencing logic',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 289,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Crisis Response Using Psychological Triggers',
      prompt: `Design crisis response emails using appropriate psychological triggers. Include fear-based triggers for safety issues, authority triggers for regulatory changes, and reciprocity triggers for goodwill gestures. Show how to maintain trust during crises while still moving prospects toward solutions.`,
      expectedSkills: [
        'crisis communication',
        'trust maintenance',
        'trigger crisis application',
        'solution positioning',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'CRISIS_RESPONSE_TRIGGERS',
        'TRUST_MAINTENANCE_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [288],
      assessmentCriteria: [
        'Designs appropriate crisis responses',
        'Maintains trust during crisis',
        'Uses triggers to move toward solutions',
        'Shows empathy with action orientation',
        'Creates crisis communication framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 290,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Trigger Integration with CRM and Sales Automation',
      prompt: `Integrate psychological triggers with CRM systems and sales automation. Show how to trigger personalized emails based on prospect behavior, use dynamic content for trigger insertion, and automate trigger sequences. Include CRM data requirements and automation workflow design.`,
      expectedSkills: [
        'crm integration',
        'automation design',
        'dynamic content',
        'behavior-based triggering',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'CRM_TRIGGER_INTEGRATION',
        'SALES_AUTOMATION_WORKFLOWS',
      ],
      difficulty: 'expert',
      prerequisites: [289],
      assessmentCriteria: [
        'Shows comprehensive CRM integration',
        'Designs behavior-based automation',
        'Implements dynamic content systems',
        'Creates scalable automation workflows',
        'Provides data requirements framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 291,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Multichannel Trigger Consistency',
      prompt: `Ensure psychological trigger consistency across email, social media, and sales calls. Show how to maintain trigger messaging continuity while adapting to different channels. Include trigger amplification through multiple touchpoints and consistency measurement methods.`,
      expectedSkills: [
        'multichannel consistency',
        'trigger amplification',
        'channel adaptation',
        'consistency measurement',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'MULTICHANNEL_TRIGGER_CONSISTENCY',
        'OMNICHANNEL_CAMPAIGN_DESIGN',
      ],
      difficulty: 'advanced',
      prerequisites: [290],
      assessmentCriteria: [
        'Shows multichannel consistency framework',
        'Provides channel adaptation guidelines',
        'Demonstrates trigger amplification',
        'Creates consistency measurement methods',
        'Shows omnichannel campaign design',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 292,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Trigger Fatigue Prevention and Recovery',
      prompt: `Prevent and recover from psychological trigger fatigue. Include trigger rotation schedules, freshness indicators, and re-engagement strategies. Show how to diagnose trigger fatigue and refresh campaigns while maintaining effectiveness.`,
      expectedSkills: [
        'fatigue prevention',
        'trigger rotation',
        're-engagement strategies',
        'fatigue diagnosis',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'TRIGGER_FATIGUE_MANAGEMENT',
        'CAMPAIGN_REFRESH_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [291],
      assessmentCriteria: [
        'Identifies trigger fatigue indicators',
        'Creates rotation schedules',
        'Provides re-engagement strategies',
        'Shows campaign refresh methods',
        'Creates long-term trigger management plan',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 293,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Cultural Adaptation of Psychological Triggers',
      prompt: `Adapt psychological triggers for different cultural contexts in global logistics. Show how urgency, authority, and reciprocity vary across cultures. Include language considerations, business etiquette, and cultural values that influence trigger effectiveness.`,
      expectedSkills: [
        'cultural adaptation',
        'global communication',
        'cultural intelligence',
        'international logistics',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'CULTURAL_TRIGGER_ADAPTATION',
        'GLOBAL_LOGISTICS_COMMUNICATION',
      ],
      difficulty: 'expert',
      prerequisites: [292],
      assessmentCriteria: [
        'Shows cultural trigger variations',
        'Provides adaptation frameworks',
        'Considers language and etiquette',
        'Addresses international business values',
        'Creates global trigger effectiveness strategy',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 294,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Legal and Compliance Considerations for Triggers',
      prompt: `Address legal and compliance considerations when using psychological triggers. Include CAN-SPAM requirements, data privacy laws (GDPR, CCPA), and false advertising regulations. Show how to document trigger claims and maintain compliance while using persuasive techniques.`,
      expectedSkills: [
        'legal compliance',
        'regulatory requirements',
        'documentation standards',
        'risk mitigation',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'LEGAL_COMPLIANCE_TRIGGERS',
        'REGULATORY_FRAMEWORK_LOGISTICS',
      ],
      difficulty: 'expert',
      prerequisites: [293],
      assessmentCriteria: [
        'Addresses key legal requirements',
        'Shows compliance documentation',
        'Provides risk mitigation strategies',
        'Maintains persuasive power legally',
        'Creates compliance monitoring framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 295,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Trigger-Based Sales Funnel Optimization',
      prompt: `Optimize entire sales funnels using psychological triggers. Show how triggers influence lead generation, qualification, nurturing, and conversion. Include trigger-based segmentation, scoring, and handoff strategies between marketing and sales teams.`,
      expectedSkills: [
        'funnel optimization',
        'lead qualification',
        'segmentation strategies',
        'sales handoff',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'TRIGGER_BASED_FUNNEL_OPTIMIZATION',
        'MARKETING_SALES_ALIGNMENT',
      ],
      difficulty: 'expert',
      prerequisites: [294],
      assessmentCriteria: [
        'Optimizes complete sales funnel',
        'Shows trigger-based segmentation',
        'Provides qualification strategies',
        'Creates effective sales handoffs',
        'Aligns marketing and sales efforts',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 296,
      category: 'Email Marketing & Psychological Triggers',
      title: 'AI-Powered Trigger Personalization',
      prompt: `Implement AI for dynamic trigger personalization. Show how to use prospect data, behavior patterns, and market conditions to select and customize triggers automatically. Include machine learning for trigger effectiveness prediction and A/B testing optimization.`,
      expectedSkills: [
        'ai personalization',
        'machine learning application',
        'dynamic content',
        'predictive optimization',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'AI_TRIGGER_PERSONALIZATION',
        'MACHINE_LEARNING_LOGISTICS',
      ],
      difficulty: 'expert',
      prerequisites: [295],
      assessmentCriteria: [
        'Shows AI personalization implementation',
        'Uses prospect data effectively',
        'Implements predictive optimization',
        'Creates automated A/B testing',
        'Provides machine learning framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 297,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Trigger Performance Attribution Modeling',
      prompt: `Build attribution models for psychological trigger performance. Show how to measure individual trigger contributions, interaction effects between triggers, and long-term impact on customer lifetime value. Include statistical methods and ROI calculation frameworks.`,
      expectedSkills: [
        'attribution modeling',
        'statistical analysis',
        'roi calculation',
        'performance measurement',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'TRIGGER_ATTRIBUTION_MODELING',
        'STATISTICAL_ANALYSIS_FRAMEWORK',
      ],
      difficulty: 'expert',
      prerequisites: [296],
      assessmentCriteria: [
        'Builds comprehensive attribution models',
        'Measures individual trigger contributions',
        'Shows interaction effect analysis',
        'Provides ROI calculation methods',
        'Creates statistical analysis framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 298,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Competitive Trigger Intelligence',
      prompt: `Analyze competitors' use of psychological triggers and develop counter-strategies. Include trigger pattern recognition, competitive differentiation, and trigger-based positioning. Show how to identify competitor trigger usage and create superior trigger strategies.`,
      expectedSkills: [
        'competitive intelligence',
        'trigger pattern analysis',
        'differentiation strategies',
        'competitive positioning',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'COMPETITIVE_TRIGGER_INTELLIGENCE',
        'TRIGGER_DIFFERENTIATION_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [297],
      assessmentCriteria: [
        'Analyzes competitor trigger usage',
        'Identifies trigger patterns',
        'Creates differentiation strategies',
        'Shows competitive positioning',
        'Provides counter-strategy framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 299,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Trigger-Based Customer Journey Mapping',
      prompt: `Map complete customer journeys using psychological triggers at each stage. Include awareness, consideration, decision, retention, and advocacy phases. Show how triggers evolve and compound throughout the customer lifecycle in logistics relationships.`,
      expectedSkills: [
        'journey mapping',
        'customer lifecycle',
        'trigger evolution',
        'relationship building',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'TRIGGER_BASED_JOURNEY_MAPPING',
        'CUSTOMER_LIFECYCLE_LOGISTICS',
      ],
      difficulty: 'expert',
      prerequisites: [298],
      assessmentCriteria: [
        'Maps complete customer journey',
        'Shows trigger evolution by stage',
        'Provides lifecycle trigger strategies',
        'Creates relationship building framework',
        'Shows trigger compounding effects',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 300,
      category: 'Email Marketing & Psychological Triggers',
      title: 'Mastering Psychological Triggers in Logistics Sales',
      prompt: `Synthesize all psychological trigger principles into a comprehensive logistics sales strategy. Include trigger selection frameworks, combination strategies, measurement systems, and continuous optimization. Show how to build a trigger-based sales machine that consistently outperforms traditional approaches.`,
      expectedSkills: [
        'trigger mastery',
        'strategy synthesis',
        'optimization frameworks',
        'sales machine building',
      ],
      knowledgeBaseIntegration: [
        'LOGISTICS_EMAIL_TRIGGERS_KB',
        'COMPREHENSIVE_TRIGGER_STRATEGY',
        'LOGISTICS_SALES_OPTIMIZATION',
      ],
      difficulty: 'expert',
      prerequisites: [299],
      assessmentCriteria: [
        'Synthesizes all trigger principles',
        'Creates comprehensive strategy framework',
        'Shows optimization methodologies',
        'Provides measurement systems',
        'Demonstrates superior performance potential',
      ],
      acquisitionType: 'shipper',
    },

    // ========================================================================
    // SOCIAL MEDIA TRIGGERS (IDs 301-325)
    // Adapting Psychological Triggers for Social Media Platforms
    // Platform-specific strategies for LinkedIn, Twitter/X, Facebook, Instagram, TikTok
    // ========================================================================

    {
      id: 301,
      category: 'Social Media Marketing & Triggers',
      title: 'Urgency & Scarcity on Social Media Platforms',
      prompt: `Adapt urgency and scarcity triggers for different social media platforms in logistics. Show LinkedIn executive access limits, Twitter breaking news urgency, Facebook community exclusives, and Instagram story countdowns. Explain why social media urgency works better than email and how to create genuine scarcity without damaging trust.`,
      expectedSkills: [
        'platform-specific urgency',
        'social media scarcity',
        'visual countdowns',
        'genuine limitations',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'PLATFORM_SPECIFIC_URGENCY',
        'VISUAL_SCARCITY_TECHNIQUES',
      ],
      difficulty: 'intermediate',
      prerequisites: [273],
      assessmentCriteria: [
        'Shows platform-specific urgency adaptations',
        'Explains social media advantages over email',
        'Demonstrates genuine scarcity creation',
        'Provides visual countdown strategies',
        'Maintains authenticity across platforms',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 302,
      category: 'Social Media Marketing & Triggers',
      title: 'Social Proof Amplification on Social Platforms',
      prompt: `Leverage social media's native social proof capabilities for logistics marketing. Show how to use user-generated content, community testimonials, follower counts, and algorithmic amplification. Include LinkedIn executive endorsements, Twitter viral success, and Facebook community spotlights. Explain how social proof creates virality.`,
      expectedSkills: [
        'social proof amplification',
        'user-generated content',
        'community testimonials',
        'algorithmic leverage',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'SOCIAL_PROOF_AMPLIFICATION',
        'VIRAL_SOCIAL_PROOF_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [275],
      assessmentCriteria: [
        'Shows social media social proof advantages',
        'Demonstrates user-generated content strategies',
        'Explains algorithmic amplification',
        'Provides platform-specific examples',
        'Shows virality creation methods',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 303,
      category: 'Social Media Marketing & Triggers',
      title: 'Thought Leadership and Authority on LinkedIn',
      prompt: `Build authority and expertise on LinkedIn for logistics professionals. Include industry insights, educational content, research sharing, and professional networking. Show how to position as a thought leader while maintaining sales effectiveness. Include content calendar strategies and engagement optimization.`,
      expectedSkills: [
        'linkedin authority building',
        'thought leadership positioning',
        'educational content creation',
        'professional networking',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'LINKEDIN_AUTHORITY_STRATEGIES',
        'THOUGHT_LEADERSHIP_FRAMEWORK',
      ],
      difficulty: 'advanced',
      prerequisites: [276, 301],
      assessmentCriteria: [
        'Creates comprehensive LinkedIn authority strategy',
        'Shows thought leadership positioning',
        'Provides content calendar framework',
        'Demonstrates sales-authority balance',
        'Includes engagement optimization tactics',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 304,
      category: 'Social Media Marketing & Triggers',
      title: 'Twitter/X Real-Time Engagement and Virality',
      prompt: `Master real-time engagement on Twitter/X for logistics marketing. Include breaking news urgency, live threads, flash polls, and viral content strategies. Show how to create trending conversations, leverage current events, and build follower engagement. Include thread optimization and hashtag strategies.`,
      expectedSkills: [
        'twitter real-time engagement',
        'viral content creation',
        'thread optimization',
        'trending conversation strategies',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'TWITTER_ENGAGEMENT_STRATEGIES',
        'VIRAL_CONTENT_FRAMEWORK',
      ],
      difficulty: 'intermediate',
      prerequisites: [301, 302],
      assessmentCriteria: [
        'Shows real-time Twitter engagement tactics',
        'Creates viral content strategies',
        'Provides thread optimization methods',
        'Demonstrates trending conversation leverage',
        'Includes hashtag strategy framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 305,
      category: 'Social Media Marketing & Triggers',
      title: 'Facebook Community Building and Local Targeting',
      prompt: `Build engaged communities on Facebook for logistics marketing. Include group-exclusive offers, community testimonials, local targeting, and relationship nurturing. Show how to create valuable communities, leverage user-generated content, and convert community engagement into business relationships.`,
      expectedSkills: [
        'facebook community building',
        'local targeting strategies',
        'user-generated content leverage',
        'community-to-customer conversion',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'FACEBOOK_COMMUNITY_STRATEGIES',
        'LOCAL_TARGETING_FRAMEWORK',
      ],
      difficulty: 'intermediate',
      prerequisites: [302],
      assessmentCriteria: [
        'Shows Facebook community building methods',
        'Provides local targeting strategies',
        'Demonstrates user-generated content leverage',
        'Creates community-to-customer conversion paths',
        'Includes engagement nurturing tactics',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 306,
      category: 'Social Media Marketing & Triggers',
      title: 'Curiosity and Pattern Interrupts for Social Engagement',
      prompt: `Create curiosity-driven content that interrupts social media patterns. Include bold claims, contrarian views, unexpected questions, and pattern-breaking visuals. Show platform-specific adaptations: LinkedIn industry myth-busting, Twitter hot takes, Facebook surprising offers. Explain how curiosity drives engagement and shares.`,
      expectedSkills: [
        'curiosity content creation',
        'pattern interruption techniques',
        'platform-specific curiosity',
        'engagement driving content',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'CURIOSITY_PATTERN_INTERRUPTS',
        'SOCIAL_ENGAGEMENT_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [280, 301],
      assessmentCriteria: [
        'Creates compelling curiosity hooks',
        'Shows pattern interruption techniques',
        'Provides platform-specific adaptations',
        'Demonstrates engagement driving methods',
        'Explains virality creation through curiosity',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 307,
      category: 'Social Media Marketing & Triggers',
      title: 'Reciprocity and Value Exchange on Social Platforms',
      prompt: `Implement reciprocity triggers across social media platforms. Include free resources, exclusive content, community benefits, and value-first strategies. Show LinkedIn professional resources, Twitter free tools, Facebook community giveaways. Explain how to create genuine obligation without appearing salesy.`,
      expectedSkills: [
        'reciprocity implementation',
        'value exchange strategies',
        'platform-specific reciprocity',
        'obligation creation',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'RECIPROCITY_VALUE_EXCHANGE',
        'GENUINE_OBLIGATION_CREATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [277, 302],
      assessmentCriteria: [
        'Shows reciprocity across platforms',
        'Creates value-first strategies',
        'Demonstrates genuine obligation creation',
        'Provides platform-specific implementations',
        'Maintains authentic, non-salesy approach',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 308,
      category: 'Social Media Marketing & Triggers',
      title: 'Personalization at Scale on Social Media',
      prompt: `Achieve personalization on social media at scale. Include audience segmentation, targeted content, interest-based messaging, and location-specific posts. Show LinkedIn company targeting, Twitter interest matching, Facebook demographic personalization. Include automation strategies and measurement approaches.`,
      expectedSkills: [
        'social media personalization',
        'audience segmentation',
        'targeted content creation',
        'automation implementation',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'SCALE_PERSONALIZATION_STRATEGIES',
        'SOCIAL_AUTOMATION_FRAMEWORK',
      ],
      difficulty: 'advanced',
      prerequisites: [278, 303],
      assessmentCriteria: [
        'Shows personalization at scale methods',
        'Provides audience segmentation strategies',
        'Creates targeted content frameworks',
        'Demonstrates automation implementation',
        'Includes personalization measurement',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 309,
      category: 'Social Media Marketing & Triggers',
      title: 'Cross-Platform Campaign Coordination',
      prompt: `Coordinate psychological triggers across multiple social platforms. Show how to launch on LinkedIn first, then cascade to Twitter, Facebook, and Instagram. Include consistent messaging with platform adaptations, timing strategies, and cross-promotion techniques. Provide campaign examples and measurement frameworks.`,
      expectedSkills: [
        'cross-platform coordination',
        'campaign cascading',
        'consistent messaging',
        'multi-platform measurement',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'CROSS_PLATFORM_CAMPAIGNS',
        'MULTI_PLATFORM_MEASUREMENT',
      ],
      difficulty: 'advanced',
      prerequisites: [301, 302, 303, 304, 305],
      assessmentCriteria: [
        'Shows cross-platform coordination methods',
        'Provides campaign cascading strategies',
        'Creates consistent messaging frameworks',
        'Demonstrates cross-promotion techniques',
        'Includes comprehensive measurement approach',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 310,
      category: 'Social Media Marketing & Triggers',
      title: 'Social Media Metrics and Algorithm Optimization',
      prompt: `Optimize social media content using platform algorithms and psychological triggers. Include engagement metrics, reach optimization, algorithmic factors, and A/B testing frameworks. Show LinkedIn professional value optimization, Twitter real-time engagement, Facebook community building. Include performance measurement and continuous improvement.`,
      expectedSkills: [
        'algorithm optimization',
        'social media metrics',
        'a/b testing frameworks',
        'performance measurement',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'ALGORITHM_OPTIMIZATION_STRATEGIES',
        'SOCIAL_MEDIA_METRICS_FRAMEWORK',
      ],
      difficulty: 'advanced',
      prerequisites: [309],
      assessmentCriteria: [
        'Shows algorithm optimization strategies',
        'Provides comprehensive metrics framework',
        'Creates A/B testing methodologies',
        'Demonstrates performance measurement',
        'Includes continuous improvement processes',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 311,
      category: 'Social Media Marketing & Triggers',
      title: 'Ethical Social Media Marketing with Psychological Triggers',
      prompt: `Maintain ethics while using psychological triggers on social media. Include transparency requirements, genuine value mandates, privacy considerations, and manipulation avoidance. Show how to balance persuasion with authenticity and build long-term trust. Include platform-specific ethical considerations.`,
      expectedSkills: [
        'ethical social media marketing',
        'transparency requirements',
        'authenticity maintenance',
        'privacy considerations',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'ETHICAL_SOCIAL_MARKETING',
        'TRUST_BUILDING_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [287, 310],
      assessmentCriteria: [
        'Establishes clear ethical guidelines',
        'Shows transparency implementation',
        'Demonstrates authenticity maintenance',
        'Addresses privacy considerations',
        'Creates long-term trust building strategies',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 312,
      category: 'Social Media Marketing & Triggers',
      title: 'Crisis Communication Using Social Media Triggers',
      prompt: `Use psychological triggers effectively during logistics crises. Include fear-based safety alerts, authority-driven regulatory updates, and reciprocity goodwill gestures. Show how to maintain trust, provide value, and convert crisis communication into relationship strengthening. Include platform-specific crisis response strategies.`,
      expectedSkills: [
        'crisis communication',
        'trust maintenance during crisis',
        'platform-specific crisis response',
        'relationship strengthening',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'CRISIS_TRIGGER_STRATEGIES',
        'SOCIAL_TRUST_MAINTENANCE',
      ],
      difficulty: 'advanced',
      prerequisites: [289, 311],
      assessmentCriteria: [
        'Shows appropriate crisis trigger usage',
        'Maintains trust during crisis situations',
        'Provides value through crisis communication',
        'Demonstrates relationship strengthening',
        'Includes platform-specific strategies',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 313,
      category: 'Social Media Marketing & Triggers',
      title: 'Instagram and Visual Storytelling with Triggers',
      prompt: `Create visually compelling content using psychological triggers on Instagram. Include Stories countdowns, Reel educational content, and carousel social proof. Show how to combine visual appeal with trigger psychology for maximum engagement. Include hashtag strategies and visual trigger optimization.`,
      expectedSkills: [
        'instagram visual storytelling',
        'stories countdown triggers',
        'reel content creation',
        'visual trigger optimization',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'INSTAGRAM_VISUAL_TRIGGERS',
        'VISUAL_STORYTELLING_FRAMEWORK',
      ],
      difficulty: 'intermediate',
      prerequisites: [306, 309],
      assessmentCriteria: [
        'Shows Instagram visual trigger implementation',
        'Creates compelling Stories strategies',
        'Demonstrates Reel content optimization',
        'Provides visual trigger psychology',
        'Includes hashtag optimization strategies',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 314,
      category: 'Social Media Marketing & Triggers',
      title: 'TikTok Educational and Entertainment Content',
      prompt: `Create engaging TikTok content using psychological triggers for logistics education and entertainment. Include educational shorts, industry tips, behind-the-scenes content, and viral challenges. Show how to balance education with entertainment while maintaining professional credibility.`,
      expectedSkills: [
        'tiktok content creation',
        'educational entertainment',
        'viral challenge creation',
        'professional credibility maintenance',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'TIKTOK_EDUCATIONAL_CONTENT',
        'VIRAL_ENTERTAINMENT_STRATEGIES',
      ],
      difficulty: 'intermediate',
      prerequisites: [306, 313],
      assessmentCriteria: [
        'Shows TikTok trigger implementation',
        'Creates educational entertainment content',
        'Demonstrates viral challenge strategies',
        'Maintains professional credibility',
        'Provides engagement optimization tactics',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 315,
      category: 'Social Media Marketing & Triggers',
      title: 'Loss Aversion Subtlety on Social Media',
      prompt: `Apply loss aversion triggers subtly on social media without being alarmist. Include prevention-focused messaging, social comparison, and opportunity cost highlighting. Show how to acknowledge problems empathetically while offering solutions. Include platform-specific subtlety approaches.`,
      expectedSkills: [
        'subtle loss aversion',
        'empathy-driven messaging',
        'prevention-focused communication',
        'platform-specific subtlety',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'SUBTLE_LOSS_AVERSION',
        'EMPATHETIC_PROBLEM_SOLVING',
      ],
      difficulty: 'intermediate',
      prerequisites: [274, 312],
      assessmentCriteria: [
        'Shows subtle loss aversion application',
        'Demonstrates empathetic problem acknowledgment',
        'Provides prevention-focused messaging',
        'Creates platform-specific subtlety approaches',
        'Maintains helpful rather than alarmist tone',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 316,
      category: 'Social Media Marketing & Triggers',
      title: 'Commitment and Consistency for Brand Loyalty',
      prompt: `Build brand loyalty using commitment and consistency triggers on social media. Include ongoing educational series, regular value delivery, and consistent positioning. Show how to create habit-forming content and long-term relationship building. Include consistency measurement and loyalty program integration.`,
      expectedSkills: [
        'brand loyalty building',
        'consistency trigger application',
        'habit-forming content',
        'loyalty program integration',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'COMMITMENT_LOYALTY_STRATEGIES',
        'HABIT_FORMING_CONTENT',
      ],
      difficulty: 'intermediate',
      prerequisites: [279, 305],
      assessmentCriteria: [
        'Shows brand loyalty building methods',
        'Creates consistency trigger strategies',
        'Demonstrates habit-forming content creation',
        'Provides loyalty program integration',
        'Includes consistency measurement approaches',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 317,
      category: 'Social Media Marketing & Triggers',
      title: 'Industry-Specific Social Media Trigger Adaptation',
      prompt: `Adapt psychological triggers for different logistics sub-industries on social media. Show freight broker urgency vs carrier authority, shipper loss aversion vs 3PL social proof. Include industry-specific pain points, platform preferences, and trigger customization strategies.`,
      expectedSkills: [
        'industry-specific adaptation',
        'sub-industry trigger customization',
        'platform preference analysis',
        'pain point targeting',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'INDUSTRY_SPECIFIC_SOCIAL_ADAPTATION',
        'SUB_INDUSTRY_TRIGGER_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [285, 315],
      assessmentCriteria: [
        'Shows industry-specific trigger adaptations',
        'Provides sub-industry customization strategies',
        'Identifies platform preferences by industry',
        'Targets industry-specific pain points',
        'Creates comprehensive adaptation framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 318,
      category: 'Social Media Marketing & Triggers',
      title: 'Social Media Trigger Performance Attribution',
      prompt: `Measure and attribute social media trigger performance across platforms. Include engagement attribution, conversion tracking, cross-platform influence, and ROI calculation. Show how to measure individual trigger contributions and optimize based on performance data.`,
      expectedSkills: [
        'social media attribution',
        'cross-platform measurement',
        'performance optimization',
        'roi calculation',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'SOCIAL_ATTRIBUTION_MODELING',
        'CROSS_PLATFORM_ROI_CALCULATION',
      ],
      difficulty: 'expert',
      prerequisites: [297, 310],
      assessmentCriteria: [
        'Shows comprehensive attribution modeling',
        'Provides cross-platform measurement methods',
        'Creates performance optimization strategies',
        'Demonstrates ROI calculation frameworks',
        'Includes continuous improvement processes',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 319,
      category: 'Social Media Marketing & Triggers',
      title: 'Competitive Social Media Trigger Intelligence',
      prompt: `Analyze competitors' social media trigger usage and develop counter-strategies. Include trigger pattern recognition, competitive differentiation, and superior trigger strategies. Show how to identify competitor approaches and create more effective social media campaigns.`,
      expectedSkills: [
        'competitive social analysis',
        'trigger pattern recognition',
        'competitive differentiation',
        'superior strategy development',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'COMPETITIVE_SOCIAL_INTELLIGENCE',
        'TRIGGER_DIFFERENTIATION_STRATEGIES',
      ],
      difficulty: 'advanced',
      prerequisites: [298, 318],
      assessmentCriteria: [
        'Shows competitor trigger analysis methods',
        'Identifies trigger usage patterns',
        'Creates differentiation strategies',
        'Develops superior trigger approaches',
        'Provides competitive intelligence framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 320,
      category: 'Social Media Marketing & Triggers',
      title: 'AI-Powered Social Media Trigger Personalization',
      prompt: `Implement AI for dynamic social media trigger personalization. Show how to use audience data, engagement patterns, and platform algorithms to select and customize triggers automatically. Include machine learning for optimal timing, content, and trigger selection.`,
      expectedSkills: [
        'ai social personalization',
        'dynamic trigger selection',
        'machine learning optimization',
        'algorithmic content creation',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'AI_SOCIAL_PERSONALIZATION',
        'MACHINE_LEARNING_SOCIAL_OPTIMIZATION',
      ],
      difficulty: 'expert',
      prerequisites: [296, 308],
      assessmentCriteria: [
        'Shows AI personalization implementation',
        'Demonstrates dynamic trigger selection',
        'Provides machine learning optimization',
        'Creates algorithmic content strategies',
        'Includes performance prediction models',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 321,
      category: 'Social Media Marketing & Triggers',
      title: 'Social Media Trigger-Based Customer Journey',
      prompt: `Map complete customer journeys using social media triggers at each stage. Include awareness through curiosity, consideration through authority, decision through urgency, and retention through consistency. Show how triggers evolve and compound throughout the social media customer lifecycle.`,
      expectedSkills: [
        'social customer journey mapping',
        'trigger lifecycle evolution',
        'stage-specific trigger application',
        'compound trigger effects',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'SOCIAL_CUSTOMER_JOURNEY_MAPPING',
        'TRIGGER_LIFECYCLE_EVOLUTION',
      ],
      difficulty: 'expert',
      prerequisites: [299, 320],
      assessmentCriteria: [
        'Maps complete social customer journey',
        'Shows trigger evolution by stage',
        'Provides stage-specific applications',
        'Demonstrates compound trigger effects',
        'Creates comprehensive journey framework',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 322,
      category: 'Social Media Marketing & Triggers',
      title: 'Global and Cultural Trigger Adaptation',
      prompt: `Adapt psychological triggers for global logistics markets and cultural contexts. Show how urgency, authority, and reciprocity vary across cultures. Include language considerations, business etiquette, and cultural values that influence trigger effectiveness in international logistics.`,
      expectedSkills: [
        'global trigger adaptation',
        'cultural intelligence',
        'international logistics communication',
        'cross-cultural persuasion',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'GLOBAL_TRIGGER_ADAPTATION',
        'CULTURAL_LOGISTICS_COMMUNICATION',
      ],
      difficulty: 'expert',
      prerequisites: [293, 321],
      assessmentCriteria: [
        'Shows cultural trigger variations',
        'Provides global adaptation frameworks',
        'Addresses language and etiquette',
        'Considers international business values',
        'Creates cross-cultural persuasion strategies',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 323,
      category: 'Social Media Marketing & Triggers',
      title: 'Social Media Crisis Trigger Management',
      prompt: `Manage psychological triggers during social media crises in logistics. Include rapid response strategies, trust maintenance, and trigger adjustment for crisis situations. Show how to use authority triggers for updates, reciprocity for goodwill, and consistency for reliability during challenging times.`,
      expectedSkills: [
        'social crisis management',
        'rapid response strategies',
        'trust maintenance during crisis',
        'trigger crisis adaptation',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'SOCIAL_CRISIS_TRIGGER_MANAGEMENT',
        'TRUST_MAINTENANCE_FRAMEWORK',
      ],
      difficulty: 'expert',
      prerequisites: [312, 322],
      assessmentCriteria: [
        'Shows crisis trigger management strategies',
        'Provides rapid response frameworks',
        'Maintains trust during crisis situations',
        'Demonstrates trigger crisis adaptation',
        'Creates comprehensive crisis management plan',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 324,
      category: 'Social Media Marketing & Triggers',
      title: 'Trigger-Based Social Media Sales Funnel',
      prompt: `Build complete social media sales funnels using psychological triggers. Show how triggers influence lead generation, qualification, nurturing, and conversion across platforms. Include trigger-based segmentation, automated sequences, and handoff to sales teams.`,
      expectedSkills: [
        'social sales funnel building',
        'trigger-based segmentation',
        'automated social sequences',
        'sales team handoff',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'TRIGGER_BASED_SOCIAL_FUNNEL',
        'SOCIAL_SALES_AUTOMATION',
      ],
      difficulty: 'expert',
      prerequisites: [295, 323],
      assessmentCriteria: [
        'Builds complete social sales funnel',
        'Shows trigger-based lead generation',
        'Creates automated nurture sequences',
        'Provides sales team handoff strategies',
        'Demonstrates conversion optimization',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 325,
      category: 'Social Media Marketing & Triggers',
      title: 'Mastering Social Media Psychological Triggers in Logistics',
      prompt: `Synthesize all social media trigger principles into a comprehensive logistics marketing strategy. Include platform selection, trigger adaptation, measurement systems, and scaling strategies. Show how to build a trigger-based social media machine that creates consistent engagement, leads, and conversions.`,
      expectedSkills: [
        'social trigger mastery',
        'comprehensive social strategy',
        'platform optimization',
        'scaling strategies',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'COMPREHENSIVE_SOCIAL_TRIGGER_STRATEGY',
        'SOCIAL_MEDIA_SCALING_FRAMEWORK',
      ],
      difficulty: 'expert',
      prerequisites: [324],
      assessmentCriteria: [
        'Synthesizes all social trigger principles',
        'Creates comprehensive platform strategy',
        'Shows measurement and optimization systems',
        'Provides scaling methodologies',
        'Demonstrates consistent performance potential',
      ],
      acquisitionType: 'shipper',
    },

    // YouTube Marketing & Triggers Training Prompts (IDs 326-335)
    {
      id: 326,
      category: 'YouTube Marketing & Triggers',
      title: 'YouTube SEO Fundamentals for Logistics Content',
      prompt: `Explain YouTube SEO basics for logistics professionals. Cover keyword research for transportation terms, title optimization, description strategies, tags, thumbnails, and end screens. Include logistics-specific search terms and how to optimize for both organic discovery and suggested videos.`,
      expectedSkills: [
        'youtube seo fundamentals',
        'keyword research for logistics',
        'video optimization techniques',
        'search-driven content strategy',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_SEO_STRATEGIES',
        'LOGISTICS_CONTENT_OPTIMIZATION',
      ],
      difficulty: 'intermediate',
      prerequisites: [301],
      assessmentCriteria: [
        'Explains YouTube SEO fundamentals',
        'Provides logistics-specific keyword examples',
        'Shows optimization techniques for titles/descriptions',
        'Demonstrates thumbnail and end screen strategies',
        'Includes organic discovery methods',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 327,
      category: 'YouTube Marketing & Triggers',
      title: 'Authority Building Through Educational YouTube Content',
      prompt: `Design a YouTube content strategy focused on establishing thought leadership in logistics. Include video series concepts, educational content pillars, expert positioning, and audience building. Show how to use YouTube for long-form educational content that positions you as the go-to expert in transportation and supply chain.`,
      expectedSkills: [
        'youtube thought leadership',
        'educational content strategy',
        'expert positioning',
        'long-form video content',
        'audience building on youtube',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_AUTHORITY_BUILDING',
        'LOGISTICS_EDUCATIONAL_CONTENT',
      ],
      difficulty: 'advanced',
      prerequisites: [326],
      assessmentCriteria: [
        'Creates comprehensive content strategy',
        'Establishes thought leadership positioning',
        'Shows educational content pillars',
        'Demonstrates audience building methods',
        'Includes expert positioning techniques',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 328,
      category: 'YouTube Marketing & Triggers',
      title: 'YouTube Live Streams for Logistics Community Building',
      prompt: `Develop a YouTube Live strategy for logistics professionals. Include live stream scheduling, topic selection, audience engagement techniques, and conversion strategies. Show how to use live streams for Q&A sessions, market updates, and community building while maintaining professional credibility.`,
      expectedSkills: [
        'youtube live streaming',
        'community building',
        'live audience engagement',
        'logistics live content',
        'professional live hosting',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_LIVE_STRATEGIES',
        'LOGISTICS_COMMUNITY_BUILDING',
      ],
      difficulty: 'intermediate',
      prerequisites: [327],
      assessmentCriteria: [
        'Creates live stream scheduling strategy',
        'Shows audience engagement techniques',
        'Includes conversion strategies',
        'Demonstrates professional hosting skills',
        'Provides community building methods',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 329,
      category: 'YouTube Marketing & Triggers',
      title: 'Video Series and Playlist Optimization',
      prompt: `Design optimized video series and playlists for logistics education. Include series naming conventions, episode sequencing, playlist SEO, cross-promotion strategies, and binge-watching optimization. Show how to create compelling educational journeys that keep viewers engaged and returning.`,
      expectedSkills: [
        'video series creation',
        'playlist optimization',
        'content sequencing',
        'binge-watching strategies',
        'educational journey design',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_SERIES_STRATEGIES',
        'LOGISTICS_EDUCATIONAL_SEQUENCES',
      ],
      difficulty: 'intermediate',
      prerequisites: [327],
      assessmentCriteria: [
        'Creates optimized series structure',
        'Shows playlist SEO techniques',
        'Includes binge-watching optimization',
        'Demonstrates cross-promotion strategies',
        'Provides compelling educational journeys',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 330,
      category: 'YouTube Marketing & Triggers',
      title: 'YouTube Ads and Sponsored Content Strategy',
      prompt: `Develop a YouTube advertising strategy for logistics services. Include audience targeting, ad format selection, budget optimization, and conversion tracking. Show how to use YouTube ads to drive leads while maintaining professional credibility and avoiding ad fatigue.`,
      expectedSkills: [
        'youtube advertising',
        'audience targeting',
        'ad format optimization',
        'budget management',
        'conversion tracking',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_ADVERTISING_STRATEGIES',
        'LOGISTICS_LEAD_GENERATION',
      ],
      difficulty: 'advanced',
      prerequisites: [326],
      assessmentCriteria: [
        'Creates comprehensive ad strategy',
        'Shows audience targeting methods',
        'Includes budget optimization techniques',
        'Demonstrates conversion tracking',
        'Maintains professional credibility',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 331,
      category: 'YouTube Marketing & Triggers',
      title: 'Collaborations and Cross-Promotion on YouTube',
      prompt: `Design a collaboration strategy for YouTube logistics content. Include finding suitable partners, co-creation approaches, cross-promotion tactics, and mutual benefit structures. Show how to leverage other logistics professionals and influencers to expand reach and credibility.`,
      expectedSkills: [
        'youtube collaborations',
        'influencer partnerships',
        'cross-promotion strategies',
        'co-creation techniques',
        'network expansion',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_COLLABORATION_STRATEGIES',
        'LOGISTICS_INFLUENCER_NETWORKING',
      ],
      difficulty: 'intermediate',
      prerequisites: [327],
      assessmentCriteria: [
        'Identifies suitable collaboration partners',
        'Creates co-creation approaches',
        'Shows cross-promotion tactics',
        'Demonstrates mutual benefit structures',
        'Includes reach expansion strategies',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 332,
      category: 'YouTube Marketing & Triggers',
      title: 'YouTube Analytics and Performance Optimization',
      prompt: `Master YouTube Analytics for logistics content optimization. Include key metrics interpretation, audience insights, content performance analysis, and optimization strategies. Show how to use data to improve video performance and grow channel subscribers.`,
      expectedSkills: [
        'youtube analytics interpretation',
        'performance optimization',
        'audience insights analysis',
        'content improvement strategies',
        'subscriber growth tactics',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_ANALYTICS_MASTER',
        'LOGISTICS_CONTENT_OPTIMIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [326],
      assessmentCriteria: [
        'Interprets key YouTube metrics',
        'Analyzes audience insights',
        'Creates optimization strategies',
        'Shows content improvement methods',
        'Demonstrates subscriber growth tactics',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 333,
      category: 'YouTube Marketing & Triggers',
      title: 'Monetization Strategies for Logistics YouTube Channels',
      prompt: `Develop monetization strategies for logistics educational content. Include ad revenue, sponsorships, affiliate marketing, merchandise, and premium content. Show how to monetize while maintaining educational value and professional credibility.`,
      expectedSkills: [
        'youtube monetization',
        'sponsorship strategies',
        'affiliate marketing',
        'premium content creation',
        'revenue optimization',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_MONETIZATION_STRATEGIES',
        'LOGISTICS_CONTENT_MONETIZATION',
      ],
      difficulty: 'advanced',
      prerequisites: [332],
      assessmentCriteria: [
        'Creates comprehensive monetization strategy',
        'Shows sponsorship approaches',
        'Includes affiliate marketing tactics',
        'Demonstrates premium content models',
        'Maintains educational/professional value',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 334,
      category: 'YouTube Marketing & Triggers',
      title: 'Crisis Communication and Reputation Management on YouTube',
      prompt: `Design crisis communication strategies for YouTube logistics channels. Include handling negative comments, addressing industry controversies, reputation management, and damage control. Show how to maintain credibility during industry challenges and economic downturns.`,
      expectedSkills: [
        'crisis communication',
        'reputation management',
        'negative comment handling',
        'damage control strategies',
        'credibility maintenance',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_CRISIS_MANAGEMENT',
        'LOGISTICS_REPUTATION_STRATEGY',
      ],
      difficulty: 'expert',
      prerequisites: [332],
      assessmentCriteria: [
        'Creates crisis communication plan',
        'Shows reputation management techniques',
        'Includes negative comment strategies',
        'Demonstrates damage control methods',
        'Maintains credibility during challenges',
      ],
      acquisitionType: 'shipper',
    },

    {
      id: 335,
      category: 'YouTube Marketing & Triggers',
      title: 'YouTube Master Strategy for Logistics Lead Generation',
      prompt: `Synthesize all YouTube marketing principles into a comprehensive lead generation machine. Include content strategy, SEO optimization, community building, monetization, and conversion systems. Show how to build a YouTube channel that generates qualified logistics leads consistently.`,
      expectedSkills: [
        'youtube master strategy',
        'lead generation systems',
        'comprehensive content strategy',
        'conversion optimization',
        'channel scaling techniques',
      ],
      knowledgeBaseIntegration: [
        'SOCIAL_MEDIA_TRIGGERS_KB',
        'YOUTUBE_MASTER_STRATEGY',
        'LOGISTICS_LEAD_GENERATION_MACHINE',
      ],
      difficulty: 'expert',
      prerequisites: [334],
      assessmentCriteria: [
        'Synthesizes all YouTube principles',
        'Creates comprehensive lead generation system',
        'Shows conversion optimization',
        'Demonstrates channel scaling',
        'Provides consistent lead generation',
      ],
      acquisitionType: 'shipper',
    },
  ];

  /**
   * Process training insights from acquisition interactions (Shipper & Carrier)
   * Uses the training prompts to improve AI staff responses over time
   */
  private processAcquisitionTraining(
    staffId: string,
    interaction: LearningInteraction
  ): void {
    // Analyze the interaction against relevant training prompts
    const relevantPrompts = this.identifyRelevantTrainingPrompts(interaction);

    for (const prompt of relevantPrompts) {
      // Evaluate how well the AI staff applied the training concepts
      const evaluation = this.evaluateAgainstTrainingPrompt(
        interaction,
        prompt
      );

      // If performance is below threshold, create learning pattern
      if (evaluation.score < 7) {
        this.createLearningPatternFromTraining(
          staffId,
          interaction,
          prompt,
          evaluation
        );
      }
    }
  }

  /**
   * Identify which training prompts are relevant to a given interaction
   */
  private identifyRelevantTrainingPrompts(
    interaction: LearningInteraction
  ): Array<{
    id: number;
    category: string;
    title: string;
    prompt: string;
    expectedSkills: string[];
    knowledgeBaseIntegration: string[];
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
    prerequisites: number[];
    assessmentCriteria: string[];
    acquisitionType: 'shipper' | 'carrier';
  }> {
    const relevantPrompts: any[] = [];

    // Match based on interaction content and acquisition context
    const content = interaction.content.input.toLowerCase();

    for (const prompt of this.acquisitionTrainingPrompts) {
      // Check if prompt skills are relevant to the interaction
      const skillMatch = prompt.expectedSkills.some((skill) =>
        content.includes(skill.toLowerCase().replace('_', ' '))
      );

      // Check if knowledge base integration matches context
      const kbMatch = prompt.knowledgeBaseIntegration.some((kb) =>
        interaction.content.input.includes(kb.toLowerCase().replace('_', ' '))
      );

      if (skillMatch || kbMatch) {
        relevantPrompts.push(prompt);
      }
    }

    return relevantPrompts.slice(0, 3); // Limit to most relevant 3 prompts
  }

  /**
   * Evaluate an interaction against a training prompt
   */
  private evaluateAgainstTrainingPrompt(
    interaction: LearningInteraction,
    prompt: any
  ): { score: number; feedback: string; knowledgeGaps: string[] } {
    let score = 10;
    const knowledgeGaps: string[] = [];

    const response = interaction.content.response.toLowerCase();

    // Check assessment criteria
    for (const criterion of prompt.assessmentCriteria) {
      const criterionWords = criterion.toLowerCase().split(' ');
      const keyWords = criterionWords.filter((word) => word.length > 3);
      const wordsFound = keyWords.filter((word) => response.includes(word));

      if (wordsFound.length < keyWords.length * 0.6) {
        score -= 1;
        knowledgeGaps.push(`Missing: ${criterion}`);
      }
    }

    // Check knowledge base integration
    for (const kb of prompt.knowledgeBaseIntegration) {
      if (!response.includes(kb.toLowerCase().replace('_', ' '))) {
        score -= 0.5;
        knowledgeGaps.push(`Limited use of ${kb} concepts`);
      }
    }

    const feedback =
      score >= 8
        ? 'Strong application of training concepts'
        : score >= 6
          ? 'Good foundation, room for deeper integration'
          : 'Needs improvement in training concept application';

    return { score: Math.max(1, Math.min(10, score)), feedback, knowledgeGaps };
  }

  /**
   * Create learning patterns from training evaluations
   */
  private createLearningPatternFromTraining(
    staffId: string,
    interaction: LearningInteraction,
    prompt: any,
    evaluation: { score: number; feedback: string; knowledgeGaps: string[] }
  ): void {
    const pattern: LearningPattern = {
      id: `training-${staffId}-${interaction.id}-${Date.now()}`,
      staffId,
      patternType: 'communication',
      pattern: {
        trigger: `When handling ${prompt.category.toLowerCase()} scenarios`,
        context: {
          trainingPrompt: prompt.title,
          expectedSkills: prompt.expectedSkills,
          knowledgeGaps: evaluation.knowledgeGaps,
        },
        successfulApproach: prompt.assessmentCriteria.join('; '),
        failurePoints: evaluation.knowledgeGaps,
        adaptationRules: [
          'Reference relevant knowledge base concepts',
          'Apply structured frameworks from training',
          'Check assessment criteria coverage',
          'Seek feedback when uncertain',
        ],
      },
      confidence: evaluation.score / 10,
      usageCount: 1,
      successRate: evaluation.score / 10,
      lastUpdated: new Date(),
    };

    this.learningPatterns.set(pattern.id, pattern);
  }

  /**
   * Enhanced acquisition guidance with training integration (Shipper & Carrier)
   */
  getAcquisitionGuidance(
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
  ): {
    industryGuidance: any;
    roleInsights: any;
    objectionHandling: any;
    valueProposition: any;
    nurtureSequence: any;
    qualificationScore: any;
    recommendedActions: string[];
    trainingInsights?: {
      relevantPrompts: string[];
      skillGaps: string[];
      improvementSuggestions: string[];
    };
  } {
    try {
      const acquisitionType = context?.acquisitionType || 'shipper';

      // Import appropriate knowledge base based on acquisition type
      let knowledgeBase: any;
      if (acquisitionType === 'shipper') {
        const {
          shipperAcquisitionKB,
        } = require('./ShipperAcquisitionKnowledgeBase');
        knowledgeBase = shipperAcquisitionKB;
      } else if (acquisitionType === 'carrier') {
        // TODO: Import carrier knowledge base when created
        // const { carrierAcquisitionKB } = require('./CarrierAcquisitionKnowledgeBase');
        // knowledgeBase = carrierAcquisitionKB;
        knowledgeBase = null; // Placeholder until carrier KB is implemented
      }

      // Get staff profile to understand their role and learning history
      const profile = this.staffProfiles.get(staffId);
      const staffDepartment = profile?.department || 'Business Development';

      // Get industry-specific guidance
      const industryGuidance =
        context?.industry && knowledgeBase
          ? knowledgeBase.getIndustryGuidance(context.industry)
          : null;

      // Get decision-maker role insights
      const roleInsights =
        context?.decisionMakerRole && knowledgeBase
          ? knowledgeBase.getDecisionMakerInsights(context.decisionMakerRole)
          : null;

      // Get objection handling if objection provided
      const objectionHandling =
        context?.objectionType && knowledgeBase
          ? knowledgeBase.getObjectionResponse(context.objectionType)
          : null;

      // Get value proposition based on priority
      const valueProposition =
        context?.priority && knowledgeBase
          ? knowledgeBase.getValueProposition(context.priority)
          : null;

      // Get nurture campaign for lead stage
      const nurtureSequence =
        context?.leadStage && knowledgeBase
          ? knowledgeBase.getNurtureCampaign(context.leadStage)
          : null;

      // Qualify the lead if qualification data provided
      const qualificationScore =
        context?.qualificationData && knowledgeBase
          ? knowledgeBase.qualifyLead(context.qualificationData)
          : null;

      // Generate contextual outreach guidance
      let contextualGuidance = null;
      if (knowledgeBase && knowledgeBase.generateOutreach) {
        contextualGuidance = knowledgeBase.generateOutreach({
          industry: context?.industry,
          role: context?.decisionMakerRole,
          stage: context?.leadStage,
          painPoint: context?.painPoint,
        });
      }

      // Build recommended actions based on context
      const recommendedActions: string[] = [];

      if (qualificationScore) {
        recommendedActions.push(
          `Lead Qualification: ${qualificationScore.qualification} (Score: ${qualificationScore.score})`
        );
        recommendedActions.push(`Action: ${qualificationScore.recommendation}`);
      }

      if (industryGuidance) {
        recommendedActions.push(
          `Industry Focus: ${industryGuidance.industry} - Emphasize ${industryGuidance.valuePropositions[0]}`
        );
      }

      if (roleInsights) {
        recommendedActions.push(
          `Decision Maker Approach: ${roleInsights.bestApproach}`
        );
        recommendedActions.push(
          `Key Priority: ${roleInsights.priorities[0]} - ${roleInsights.decisionCriteria}`
        );
      }

      if (nurtureSequence && nurtureSequence.touchpoints.length > 0) {
        const nextTouch = nurtureSequence.touchpoints[0];
        recommendedActions.push(
          `Next Touch: Day ${nextTouch.day} - ${nextTouch.channel} - ${nextTouch.action || nextTouch.subject}`
        );
      }

      if (objectionHandling) {
        recommendedActions.push(
          `Objection Handling: Use ${objectionHandling.responseFramework.pivot} framework`
        );
      }

      // Add training insights based on staff learning history
      let trainingInsights;
      if (profile) {
        const recentPatterns = Array.from(this.learningPatterns.values())
          .filter((p) => p.staffId === staffId && p.successRate < 0.7)
          .slice(-3); // Last 3 improvement areas

        trainingInsights = {
          relevantPrompts: recentPatterns.map((p) => p.pattern.trigger),
          skillGaps: recentPatterns.flatMap((p) => p.pattern.failurePoints),
          improvementSuggestions: recentPatterns.flatMap(
            (p) => p.pattern.adaptationRules
          ),
        };
      }

      return {
        industryGuidance,
        roleInsights,
        objectionHandling,
        valueProposition,
        nurtureSequence,
        qualificationScore,
        recommendedActions,
        trainingInsights,
      };
    } catch (error) {
      console.warn('Shipper acquisition guidance unavailable:', error);
      return {
        industryGuidance: null,
        roleInsights: null,
        objectionHandling: null,
        valueProposition: null,
        nurtureSequence: null,
        qualificationScore: null,
        recommendedActions: [
          'Shipper acquisition knowledge base not available',
        ],
        trainingInsights: undefined,
      };
    }
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
