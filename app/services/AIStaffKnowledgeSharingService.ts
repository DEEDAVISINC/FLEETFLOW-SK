/**
 * AI Staff Knowledge Sharing Service
 * Enables collaborative learning and knowledge exchange between AI staff members
 * Part of the Cross-Training Network for DEPOINTE AI Company
 */

export interface KnowledgePattern {
  id: string;
  title: string;
  description: string;
  category:
    | 'communication'
    | 'problem_solving'
    | 'customer_handling'
    | 'compliance'
    | 'sales'
    | 'operations';
  originalStaffId: string;
  originalStaffName: string;
  originalDepartment: string;
  successRate: number;
  usageCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: {
    trigger: string;
    approach: string;
    execution: string[];
    outcomes: string[];
    lessonsLearned: string[];
  };
  sharedAt: Date;
  adoptedBy: Array<{
    staffId: string;
    staffName: string;
    adoptedAt: Date;
    successRating: number;
  }>;
  votes: {
    helpful: number;
    notHelpful: number;
  };
}

export interface KnowledgeRequest {
  id: string;
  requestingStaffId: string;
  requestingStaffName: string;
  category: string;
  specificTopic: string;
  context: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestedAt: Date;
  responses: Array<{
    respondingStaffId: string;
    respondingStaffName: string;
    response: string;
    providedAt: Date;
    helpfulness: number;
  }>;
  resolved: boolean;
}

export interface CrossTrainingSession {
  id: string;
  title: string;
  description: string;
  participants: Array<{
    staffId: string;
    staffName: string;
    department: string;
    role: 'host' | 'participant';
  }>;
  topic: string;
  category: string;
  scheduledAt: Date;
  duration: number; // minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  outcomes: string[];
  learnings: Array<{
    patternId?: string;
    description: string;
    sharedBy: string;
  }>;
}

export class AIStaffKnowledgeSharingService {
  private knowledgePatterns: Map<string, KnowledgePattern> = new Map();
  private knowledgeRequests: Map<string, KnowledgeRequest> = new Map();
  private crossTrainingSessions: Map<string, CrossTrainingSession> = new Map();
  private staffActivity: Map<
    string,
    { lastShared: Date; patternsShared: number; patternsAdopted: number }
  > = new Map();

  constructor() {
    this.initializeService();
    console.info('🧠 AI Staff Knowledge Sharing Service initialized');
  }

  /**
   * Initialize the knowledge sharing service
   */
  private initializeService() {
    // Load from localStorage if available
    this.loadFromStorage();

    // Initialize activity tracking for all staff
    this.initializeStaffActivity();
  }

  /**
   * Share a successful knowledge pattern
   */
  async shareKnowledgePattern(
    pattern: Omit<KnowledgePattern, 'id' | 'sharedAt' | 'adoptedBy' | 'votes'>
  ): Promise<KnowledgePattern> {
    const newPattern: KnowledgePattern = {
      ...pattern,
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sharedAt: new Date(),
      adoptedBy: [],
      votes: { helpful: 0, notHelpful: 0 },
    };

    this.knowledgePatterns.set(newPattern.id, newPattern);

    // Update staff activity
    this.updateStaffActivity(newPattern.originalStaffId, 'shared');

    this.saveToStorage();

    console.info(
      `📤 Knowledge pattern shared: "${newPattern.title}" by ${newPattern.originalStaffName}`
    );

    return newPattern;
  }

  /**
   * Adopt a knowledge pattern for use by another staff member
   */
  async adoptKnowledgePattern(
    patternId: string,
    adoptingStaffId: string,
    adoptingStaffName: string
  ): Promise<boolean> {
    const pattern = this.knowledgePatterns.get(patternId);
    if (!pattern) return false;

    // Check if already adopted
    const alreadyAdopted = pattern.adoptedBy.some(
      (adoption) => adoption.staffId === adoptingStaffId
    );
    if (alreadyAdopted) return true;

    pattern.adoptedBy.push({
      staffId: adoptingStaffId,
      staffName: adoptingStaffName,
      adoptedAt: new Date(),
      successRating: 0, // Will be updated after use
    });

    // Update staff activity
    this.updateStaffActivity(adoptingStaffId, 'adopted');

    this.saveToStorage();

    console.info(
      `✅ Knowledge pattern adopted: "${pattern.title}" by ${adoptingStaffName}`
    );

    return true;
  }

  /**
   * Rate a knowledge pattern's success after adoption
   */
  async rateAdoptedPattern(
    patternId: string,
    adoptingStaffId: string,
    successRating: number
  ): Promise<boolean> {
    const pattern = this.knowledgePatterns.get(patternId);
    if (!pattern) return false;

    const adoption = pattern.adoptedBy.find(
      (adoption) => adoption.staffId === adoptingStaffId
    );
    if (!adoption) return false;

    adoption.successRating = successRating;
    this.saveToStorage();

    return true;
  }

  /**
   * Submit a knowledge request for help from other staff
   */
  async submitKnowledgeRequest(
    request: Omit<
      KnowledgeRequest,
      'id' | 'requestedAt' | 'responses' | 'resolved'
    >
  ): Promise<KnowledgeRequest> {
    const newRequest: KnowledgeRequest = {
      ...request,
      id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestedAt: new Date(),
      responses: [],
      resolved: false,
    };

    this.knowledgeRequests.set(newRequest.id, newRequest);
    this.saveToStorage();

    console.info(
      `❓ Knowledge request submitted: "${request.specificTopic}" by ${request.requestingStaffName}`
    );

    return newRequest;
  }

  /**
   * Respond to a knowledge request
   */
  async respondToKnowledgeRequest(
    requestId: string,
    response: Omit<KnowledgeRequest['responses'][0], 'providedAt'>
  ): Promise<boolean> {
    const request = this.knowledgeRequests.get(requestId);
    if (!request) return false;

    request.responses.push({
      ...response,
      providedAt: new Date(),
      helpfulness: 0, // Will be rated later
    });

    this.saveToStorage();

    console.info(
      `💡 Response provided to knowledge request: ${request.specificTopic}`
    );

    return true;
  }

  /**
   * Rate a response's helpfulness
   */
  async rateResponseHelpfulness(
    requestId: string,
    responseIndex: number,
    helpfulness: number
  ): Promise<boolean> {
    const request = this.knowledgeRequests.get(requestId);
    if (!request || !request.responses[responseIndex]) return false;

    request.responses[responseIndex].helpfulness = helpfulness;

    // Auto-resolve if helpfulness is high
    if (helpfulness >= 4) {
      request.resolved = true;
    }

    this.saveToStorage();

    return true;
  }

  /**
   * Schedule a cross-training session
   */
  async scheduleCrossTrainingSession(
    session: Omit<
      CrossTrainingSession,
      'id' | 'status' | 'outcomes' | 'learnings'
    >
  ): Promise<CrossTrainingSession> {
    const newSession: CrossTrainingSession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      outcomes: [],
      learnings: [],
    };

    this.crossTrainingSessions.set(newSession.id, newSession);
    this.saveToStorage();

    console.info(
      `📅 Cross-training session scheduled: "${newSession.title}" for ${newSession.scheduledAt.toLocaleDateString()}`
    );

    return newSession;
  }

  /**
   * Get knowledge patterns by category or staff
   */
  getKnowledgePatterns(filters?: {
    category?: string;
    staffId?: string;
    minSuccessRate?: number;
    tags?: string[];
  }): KnowledgePattern[] {
    let patterns = Array.from(this.knowledgePatterns.values());

    if (filters?.category) {
      patterns = patterns.filter((p) => p.category === filters.category);
    }

    if (filters?.staffId) {
      patterns = patterns.filter((p) => p.originalStaffId === filters.staffId);
    }

    if (filters?.minSuccessRate) {
      patterns = patterns.filter(
        (p) => p.successRate >= filters.minSuccessRate
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      patterns = patterns.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }

    return patterns.sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Get knowledge requests
   */
  getKnowledgeRequests(filters?: {
    requestingStaffId?: string;
    category?: string;
    resolved?: boolean;
    urgency?: string;
  }): KnowledgeRequest[] {
    let requests = Array.from(this.knowledgeRequests.values());

    if (filters?.requestingStaffId) {
      requests = requests.filter(
        (r) => r.requestingStaffId === filters.requestingStaffId
      );
    }

    if (filters?.category) {
      requests = requests.filter((r) => r.category === filters.category);
    }

    if (filters?.resolved !== undefined) {
      requests = requests.filter((r) => r.resolved === filters.resolved);
    }

    if (filters?.urgency) {
      requests = requests.filter((r) => r.urgency === filters.urgency);
    }

    return requests.sort(
      (a, b) => b.requestedAt.getTime() - a.requestedAt.getTime()
    );
  }

  /**
   * Get upcoming cross-training sessions
   */
  getUpcomingSessions(hoursAhead: number = 168): CrossTrainingSession[] {
    const now = new Date();
    const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    return Array.from(this.crossTrainingSessions.values())
      .filter(
        (session) =>
          session.scheduledAt >= now &&
          session.scheduledAt <= futureTime &&
          session.status === 'scheduled'
      )
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  }

  /**
   * Get staff activity and engagement metrics
   */
  getStaffActivity(): Array<{
    staffId: string;
    staffName: string;
    department: string;
    patternsShared: number;
    patternsAdopted: number;
    lastActivity: Date | null;
    knowledgeScore: number;
  }> {
    const activity = [];

    for (const [staffId, stats] of this.staffActivity.entries()) {
      // Get staff info (would come from staff roster in real implementation)
      const staffName = this.getStaffNameById(staffId);
      const department = this.getStaffDepartmentById(staffId);

      const knowledgeScore = this.calculateKnowledgeScore(staffId);

      activity.push({
        staffId,
        staffName,
        department,
        patternsShared: stats.patternsShared,
        patternsAdopted: stats.patternsAdopted,
        lastActivity: stats.lastShared,
        knowledgeScore,
      });
    }

    return activity.sort((a, b) => b.knowledgeScore - a.knowledgeScore);
  }

  /**
   * Get knowledge sharing analytics
   */
  getKnowledgeSharingAnalytics(): {
    totalPatterns: number;
    totalAdoptions: number;
    totalRequests: number;
    resolvedRequests: number;
    upcomingSessions: number;
    topCategories: Array<{ category: string; count: number }>;
    mostActiveStaff: Array<{
      staffId: string;
      staffName: string;
      activity: number;
    }>;
  } {
    const patterns = Array.from(this.knowledgePatterns.values());
    const requests = Array.from(this.knowledgeRequests.values());
    const sessions = Array.from(this.crossTrainingSessions.values());

    // Category distribution
    const categoryCount: Record<string, number> = {};
    patterns.forEach((pattern) => {
      categoryCount[pattern.category] =
        (categoryCount[pattern.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Most active staff
    const staffActivity = this.getStaffActivity()
      .map((staff) => ({
        staffId: staff.staffId,
        staffName: staff.staffName,
        activity: staff.patternsShared + staff.patternsAdopted,
      }))
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 5);

    return {
      totalPatterns: patterns.length,
      totalAdoptions: patterns.reduce((sum, p) => sum + p.adoptedBy.length, 0),
      totalRequests: requests.length,
      resolvedRequests: requests.filter((r) => r.resolved).length,
      upcomingSessions: sessions.filter((s) => s.status === 'scheduled').length,
      topCategories,
      mostActiveStaff: staffActivity,
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private initializeStaffActivity() {
    // Initialize activity tracking for key staff members
    const staffIds = [
      'desiree',
      'cliff',
      'gary',
      'will',
      'hunter',
      'resse-a-bell',
      'dell',
      'logan',
      'miles',
      'brook-r',
      'carrie-r',
      'kameelah',
      'regina',
      'shanell',
      'clarence',
      'drew',
      'c-allen-durr',
      'deanna',
      'charin',
      'roland',
      'lea-d',
      'alexis',
      'riley-front',
      'deeva-deveraux',
    ];

    staffIds.forEach((staffId) => {
      if (!this.staffActivity.has(staffId)) {
        this.staffActivity.set(staffId, {
          lastShared: new Date(),
          patternsShared: 0,
          patternsAdopted: 0,
        });
      }
    });
  }

  private updateStaffActivity(staffId: string, action: 'shared' | 'adopted') {
    const activity = this.staffActivity.get(staffId);
    if (!activity) return;

    if (action === 'shared') {
      activity.patternsShared++;
      activity.lastShared = new Date();
    } else if (action === 'adopted') {
      activity.patternsAdopted++;
    }
  }

  private calculateKnowledgeScore(staffId: string): number {
    const activity = this.staffActivity.get(staffId);
    if (!activity) return 0;

    const sharedWeight = 2;
    const adoptedWeight = 1;
    const recencyBonus = this.getRecencyBonus(activity.lastShared);

    return (
      (activity.patternsShared * sharedWeight +
        activity.patternsAdopted * adoptedWeight) *
      recencyBonus
    );
  }

  private getRecencyBonus(lastActivity: Date): number {
    const daysSince =
      (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince <= 1) return 1.5; // Very recent
    if (daysSince <= 7) return 1.2; // This week
    if (daysSince <= 30) return 1.0; // This month
    return 0.8; // Older
  }

  private getStaffNameById(staffId: string): string {
    const staffNames: Record<string, string> = {
      desiree: 'Desiree',
      cliff: 'Cliff',
      gary: 'Gary',
      will: 'Will',
      hunter: 'Hunter',
      'resse-a-bell': 'Resse A. Bell',
      dell: 'Dell',
      logan: 'Logan',
      miles: 'Miles Rhodes',
      'brook-r': 'Brook R.',
      'carrie-r': 'Carrie R.',
      kameelah: 'Kameelah',
      regina: 'Regina',
      shanell: 'Shanell',
      clarence: 'Clarence',
      drew: 'Drew',
      'c-allen-durr': 'C. Allen',
      deanna: 'Deanna',
      charin: 'Charin',
      roland: 'Roland',
      'lea-d': 'Lea D.',
      alexis: 'Alexis Best',
      'riley-front': 'Riley',
      'deeva-deveraux': 'Deeva Deveraux',
    };

    return staffNames[staffId] || staffId;
  }

  private getStaffDepartmentById(staffId: string): string {
    const staffDepartments: Record<string, string> = {
      desiree: 'Lead Generation',
      cliff: 'Lead Generation',
      gary: 'Lead Generation',
      will: 'Sales',
      hunter: 'Sales',
      'resse-a-bell': 'Financial',
      dell: 'Technology',
      logan: 'Operations',
      miles: 'Operations',
      'brook-r': 'Relationships',
      'carrie-r': 'Relationships',
      kameelah: 'Compliance & Safety',
      regina: 'Compliance & Safety',
      shanell: 'Support & Service',
      clarence: 'Support & Service',
      drew: 'Business Development',
      'c-allen-durr': 'Operations',
      deanna: 'Operations',
      charin: 'Business Development',
      roland: 'Relationships',
      'lea-d': 'Business Development',
      alexis: 'Executive Operations',
      'riley-front': 'Front Office',
      'deeva-deveraux': 'Executive Leadership',
    };

    return staffDepartments[staffId] || 'Operations';
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        patterns: Array.from(this.knowledgePatterns.entries()),
        requests: Array.from(this.knowledgeRequests.entries()),
        sessions: Array.from(this.crossTrainingSessions.entries()),
        activity: Array.from(this.staffActivity.entries()),
      };

      localStorage.setItem('ai-staff-knowledge-sharing', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save knowledge sharing data:', error);
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('ai-staff-knowledge-sharing');
      if (!data) return;

      const parsed = JSON.parse(data);

      // Restore patterns
      this.knowledgePatterns = new Map(
        parsed.patterns.map(([id, pattern]: [string, any]) => [
          id,
          {
            ...pattern,
            sharedAt: new Date(pattern.sharedAt),
            adoptedBy: pattern.adoptedBy.map((adoption: any) => ({
              ...adoption,
              adoptedAt: new Date(adoption.adoptedAt),
            })),
          },
        ])
      );

      // Restore requests
      this.knowledgeRequests = new Map(
        parsed.requests.map(([id, request]: [string, any]) => [
          id,
          {
            ...request,
            requestedAt: new Date(request.requestedAt),
            responses: request.responses.map((response: any) => ({
              ...response,
              providedAt: new Date(response.providedAt),
            })),
          },
        ])
      );

      // Restore sessions
      this.crossTrainingSessions = new Map(
        parsed.sessions.map(([id, session]: [string, any]) => [
          id,
          {
            ...session,
            scheduledAt: new Date(session.scheduledAt),
          },
        ])
      );

      // Restore activity
      this.staffActivity = new Map(
        parsed.activity.map(([id, activity]: [string, any]) => [
          id,
          {
            ...activity,
            lastShared: new Date(activity.lastShared),
          },
        ])
      );

      console.info(
        `📚 Loaded ${this.knowledgePatterns.size} knowledge patterns, ${this.knowledgeRequests.size} requests, and ${this.crossTrainingSessions.size} sessions from storage`
      );
    } catch (error) {
      console.error('Failed to load knowledge sharing data:', error);
    }
  }
}

// Export singleton instance
export const aiStaffKnowledgeSharingService =
  new AIStaffKnowledgeSharingService();

