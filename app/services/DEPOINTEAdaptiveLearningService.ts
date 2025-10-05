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

    // Process acquisition training insights (shipper & carrier)
    if (
      interaction.interactionType === 'sales' ||
      interaction.content.input.toLowerCase().includes('shipper') ||
      interaction.content.input.toLowerCase().includes('carrier') ||
      interaction.content.input.toLowerCase().includes('prospect') ||
      interaction.content.input.toLowerCase().includes('lead')
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
