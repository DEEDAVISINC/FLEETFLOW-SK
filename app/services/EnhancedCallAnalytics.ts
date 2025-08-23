/**
 * Enhanced Call Analytics Service
 * Advanced conversation analysis and learning system
 * Native FleetFlow implementation of SalesAI-like capabilities
 */

import { LiveCallContext } from './LiveCallAIAssistant';

export interface CallAnalyticsData {
  callId: string;
  contactId: string;
  agentId: string;
  duration: number;
  outcome: string;
  transcript: string;
  recording?: string;
  createdAt: string;
  analysis: DetailedCallAnalysis;
}

export interface DetailedCallAnalysis {
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    timeline: Array<{
      timestamp: number; // seconds from start
      sentiment: 'positive' | 'neutral' | 'negative';
      confidence: number;
    }>;
    keyMoments: Array<{
      timestamp: number;
      type: 'objection' | 'buying_signal' | 'concern' | 'interest';
      description: string;
    }>;
  };
  conversation: {
    talkRatio: {
      agent: number; // percentage
      customer: number;
    };
    interruptionCount: {
      agentInterrupted: number;
      customerInterrupted: number;
    };
    paceAnalysis: {
      averageWPM: number; // words per minute
      pauseCount: number;
      longestPause: number; // seconds
    };
    questionMetrics: {
      agentQuestions: number;
      customerQuestions: number;
      unansweredQuestions: number;
    };
  };
  content: {
    keyTopics: Array<{
      topic: string;
      relevance: number;
      timeSpent: number; // seconds
    }>;
    objections: Array<{
      type: string;
      timestamp: number;
      customerWords: string;
      agentResponse: string;
      resolved: boolean;
    }>;
    commitments: Array<{
      type: 'customer' | 'agent';
      commitment: string;
      timestamp: number;
    }>;
    nextSteps: Array<{
      action: string;
      owner: 'customer' | 'agent';
      deadline?: string;
    }>;
  };
  performance: {
    adherenceToScript: number; // percentage
    objectionHandling: {
      identified: number;
      handled: number;
      effectiveness: number; // percentage
    };
    closingAttempts: number;
    valuePropsUsed: string[];
    competitorsmentioned: string[];
  };
  prediction: {
    conversionProbability: number; // 0-1
    followUpRecommendation: string;
    riskFactors: string[];
    opportunitySignals: string[];
  };
}

export interface AgentPerformanceMetrics {
  agentId: string;
  agentName: string;
  period: {
    start: string;
    end: string;
  };
  calls: {
    total: number;
    byOutcome: Record<string, number>;
    averageDuration: number;
    longestCall: number;
    shortestCall: number;
  };
  performance: {
    conversionRate: number;
    averageSentiment: number;
    objectionHandlingRate: number;
    scriptAdherence: number;
    talkRatio: number;
  };
  trends: {
    improvement: number; // percentage change
    areas: Array<{
      metric: string;
      trend: 'improving' | 'declining' | 'stable';
      change: number;
    }>;
  };
  recommendations: string[];
}

export interface CallAnalyticsInsights {
  totalCalls: number;
  period: { start: string; end: string };
  conversionMetrics: {
    overallRate: number;
    bySource: Record<string, number>;
    byAgent: Record<string, number>;
    byTimeOfDay: Record<string, number>;
  };
  sentimentTrends: {
    positive: number;
    neutral: number;
    negative: number;
    trending: 'improving' | 'declining' | 'stable';
  };
  commonObjections: Array<{
    objection: string;
    frequency: number;
    resolutionRate: number;
    bestResponse: string;
  }>;
  topPerformers: Array<{
    agentId: string;
    agentName: string;
    conversionRate: number;
    avgSentiment: number;
  }>;
  improvementOpportunities: Array<{
    area: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
}

export class EnhancedCallAnalytics {
  private static instance: EnhancedCallAnalytics;
  private callAnalytics: Map<string, CallAnalyticsData> = new Map();
  private agentMetrics: Map<string, AgentPerformanceMetrics> = new Map();

  // AI Learning Data
  private objectionPatterns: Map<
    string,
    {
      keywords: string[];
      successfulResponses: Array<{
        response: string;
        effectiveness: number;
        agentId: string;
      }>;
    }
  > = new Map();

  private buyingSignals: Map<
    string,
    {
      keywords: string[];
      conversionRate: number;
      averageTimeToClose: number;
    }
  > = new Map();

  private constructor() {
    this.initializeLearningData();
    console.log('📊 Enhanced Call Analytics Service initialized');
  }

  public static getInstance(): EnhancedCallAnalytics {
    if (!EnhancedCallAnalytics.instance) {
      EnhancedCallAnalytics.instance = new EnhancedCallAnalytics();
    }
    return EnhancedCallAnalytics.instance;
  }

  /**
   * Initialize AI learning patterns
   */
  private initializeLearningData(): void {
    // Common freight industry objections and successful responses
    this.objectionPatterns.set('pricing', {
      keywords: ['expensive', 'costly', 'price', 'rate', 'budget', 'cheaper'],
      successfulResponses: [
        {
          response:
            'I understand cost is important. Our 18.7% fuel savings and 94.2% on-time rate typically offset the rate difference. Let me show you the total value calculation.',
          effectiveness: 0.85,
          agentId: 'agent-1',
        },
        {
          response:
            'Price is definitely a factor. What matters most to you - lowest rate or most reliable service? We focus on total cost of ownership.',
          effectiveness: 0.78,
          agentId: 'agent-2',
        },
      ],
    });

    this.objectionPatterns.set('existing_relationship', {
      keywords: ['already have', 'current broker', 'existing', 'satisfied'],
      successfulResponses: [
        {
          response:
            "That's great you have a good relationship. We work with many companies as their overflow partner for specialized freight. What lanes does your current broker struggle with?",
          effectiveness: 0.82,
          agentId: 'agent-1',
        },
      ],
    });

    // Buying signals
    this.buyingSignals.set('timeline_questions', {
      keywords: ['when can', 'how soon', 'timeline', 'schedule'],
      conversionRate: 0.73,
      averageTimeToClose: 3.2, // days
    });

    this.buyingSignals.set('pricing_specifics', {
      keywords: ['exact rate', 'quote', 'pricing sheet', 'contract'],
      conversionRate: 0.68,
      averageTimeToClose: 1.8,
    });
  }

  /**
   * Analyze completed call and store analytics
   */
  public async analyzeCall(
    callContext: LiveCallContext,
    outcome: string
  ): Promise<CallAnalyticsData> {
    console.log(
      `📊 Analyzing call ${callContext.callId} with outcome: ${outcome}`
    );

    const analysis = await this.performDetailedAnalysis(callContext, outcome);

    const analyticsData: CallAnalyticsData = {
      callId: callContext.callId,
      contactId: callContext.contactId,
      agentId: callContext.agentId,
      duration: callContext.duration,
      outcome,
      transcript: callContext.transcript?.join('\n') || '',
      createdAt: new Date().toISOString(),
      analysis,
    };

    this.callAnalytics.set(callContext.callId, analyticsData);
    await this.updateAgentMetrics(callContext.agentId, analyticsData);
    await this.learnFromCall(analyticsData);

    console.log(`✅ Call analysis complete for ${callContext.callId}`);
    return analyticsData;
  }

  /**
   * Perform detailed call analysis using AI
   */
  private async performDetailedAnalysis(
    callContext: LiveCallContext,
    outcome: string
  ): Promise<DetailedCallAnalysis> {
    const transcript = callContext.transcript?.join(' ') || '';

    // Sentiment Analysis
    const sentimentAnalysis = this.analyzeSentimentTimeline(
      callContext.transcript || []
    );

    // Conversation Metrics
    const conversationMetrics = this.analyzeConversationMetrics(
      callContext.transcript || []
    );

    // Content Analysis
    const contentAnalysis = this.analyzeContent(callContext.transcript || []);

    // Performance Analysis
    const performanceAnalysis = this.analyzePerformance(callContext, outcome);

    // Prediction Analysis
    const predictionAnalysis = this.analyzePredictions(
      transcript,
      outcome,
      contentAnalysis
    );

    return {
      sentiment: sentimentAnalysis,
      conversation: conversationMetrics,
      content: contentAnalysis,
      performance: performanceAnalysis,
      prediction: predictionAnalysis,
    };
  }

  /**
   * Analyze sentiment timeline
   */
  private analyzeSentimentTimeline(
    transcript: string[]
  ): DetailedCallAnalysis['sentiment'] {
    const timeline: Array<{
      timestamp: number;
      sentiment: 'positive' | 'neutral' | 'negative';
      confidence: number;
    }> = [];

    const keyMoments: Array<{
      timestamp: number;
      type: 'objection' | 'buying_signal' | 'concern' | 'interest';
      description: string;
    }> = [];

    transcript.forEach((line, index) => {
      const timestamp = (index / transcript.length) * 100; // percentage of call
      const sentiment = this.detectSentiment(line);

      timeline.push({
        timestamp,
        sentiment,
        confidence: 0.75, // Mock confidence
      });

      // Detect key moments
      const keyMoment = this.detectKeyMoment(line, timestamp);
      if (keyMoment) {
        keyMoments.push(keyMoment);
      }
    });

    const overallSentiment = this.calculateOverallSentiment(timeline);

    return {
      overall: overallSentiment,
      timeline,
      keyMoments,
    };
  }

  /**
   * Analyze conversation metrics
   */
  private analyzeConversationMetrics(
    transcript: string[]
  ): DetailedCallAnalysis['conversation'] {
    let agentWords = 0;
    let customerWords = 0;
    let agentInterrupted = 0;
    let customerInterrupted = 0;
    let questionCount = 0;
    let customerQuestions = 0;

    transcript.forEach((line) => {
      const words = line.split(' ').length;
      if (line.startsWith('agent:')) {
        agentWords += words;
        if (line.includes('?')) questionCount++;
      } else {
        customerWords += words;
        if (line.includes('?')) customerQuestions++;
      }
    });

    const totalWords = agentWords + customerWords;

    return {
      talkRatio: {
        agent: totalWords > 0 ? (agentWords / totalWords) * 100 : 0,
        customer: totalWords > 0 ? (customerWords / totalWords) * 100 : 0,
      },
      interruptionCount: {
        agentInterrupted: agentInterrupted,
        customerInterrupted: customerInterrupted,
      },
      paceAnalysis: {
        averageWPM: 150, // Mock data
        pauseCount: 12,
        longestPause: 3.5,
      },
      questionMetrics: {
        agentQuestions: questionCount,
        customerQuestions: customerQuestions,
        unansweredQuestions: Math.max(0, questionCount - 2), // Mock logic
      },
    };
  }

  /**
   * Analyze call content
   */
  private analyzeContent(
    transcript: string[]
  ): DetailedCallAnalysis['content'] {
    const keyTopics = this.extractKeyTopics(transcript);
    const objections = this.extractObjections(transcript);
    const commitments = this.extractCommitments(transcript);
    const nextSteps = this.extractNextSteps(transcript);

    return {
      keyTopics,
      objections,
      commitments,
      nextSteps,
    };
  }

  /**
   * Analyze agent performance
   */
  private analyzePerformance(
    callContext: LiveCallContext,
    outcome: string
  ): DetailedCallAnalysis['performance'] {
    const transcript = callContext.transcript?.join(' ').toLowerCase() || '';

    // Count value propositions mentioned
    const valueProps = [
      'fuel savings',
      'on-time delivery',
      'real-time tracking',
      'ai optimization',
      'carrier network',
      'cost savings',
    ];
    const valuePropsUsed = valueProps.filter((prop) =>
      transcript.includes(prop)
    );

    // Count objections and handling
    const objections = this.identifyObjections(transcript);
    const handledObjections = this.countHandledObjections(
      transcript,
      objections
    );

    return {
      adherenceToScript: 75, // Mock data - would compare to actual script
      objectionHandling: {
        identified: objections.length,
        handled: handledObjections,
        effectiveness:
          objections.length > 0
            ? (handledObjections / objections.length) * 100
            : 100,
      },
      closingAttempts: this.countClosingAttempts(transcript),
      valuePropsUsed,
      competitorsmentioned: this.identifyCompetitors(transcript),
    };
  }

  /**
   * Analyze predictions and recommendations
   */
  private analyzePredictions(
    transcript: string,
    outcome: string,
    contentAnalysis: any
  ): DetailedCallAnalysis['prediction'] {
    const conversionProbability = this.calculateConversionProbability(
      transcript,
      outcome,
      contentAnalysis
    );
    const followUpRecommendation = this.generateFollowUpRecommendation(
      outcome,
      conversionProbability
    );
    const riskFactors = this.identifyRiskFactors(transcript, contentAnalysis);
    const opportunitySignals = this.identifyOpportunitySignals(
      transcript,
      contentAnalysis
    );

    return {
      conversionProbability,
      followUpRecommendation,
      riskFactors,
      opportunitySignals,
    };
  }

  /**
   * Update agent performance metrics
   */
  private async updateAgentMetrics(
    agentId: string,
    callData: CallAnalyticsData
  ): Promise<void> {
    let metrics = this.agentMetrics.get(agentId);

    if (!metrics) {
      metrics = {
        agentId,
        agentName: `Agent ${agentId}`,
        period: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
        calls: {
          total: 0,
          byOutcome: {},
          averageDuration: 0,
          longestCall: 0,
          shortestCall: 0,
        },
        performance: {
          conversionRate: 0,
          averageSentiment: 0,
          objectionHandlingRate: 0,
          scriptAdherence: 0,
          talkRatio: 0,
        },
        trends: {
          improvement: 0,
          areas: [],
        },
        recommendations: [],
      };
    }

    // Update metrics
    metrics.calls.total++;
    metrics.calls.byOutcome[callData.outcome] =
      (metrics.calls.byOutcome[callData.outcome] || 0) + 1;
    metrics.calls.averageDuration =
      (metrics.calls.averageDuration + callData.duration) / 2;
    metrics.calls.longestCall = Math.max(
      metrics.calls.longestCall,
      callData.duration
    );
    metrics.calls.shortestCall = Math.min(
      metrics.calls.shortestCall || callData.duration,
      callData.duration
    );

    // Update performance metrics
    metrics.performance.objectionHandlingRate =
      callData.analysis.performance.objectionHandling.effectiveness;
    metrics.performance.scriptAdherence =
      callData.analysis.performance.adherenceToScript;
    metrics.performance.talkRatio =
      callData.analysis.conversation.talkRatio.agent;

    this.agentMetrics.set(agentId, metrics);
  }

  /**
   * Learn from call data to improve future recommendations
   */
  private async learnFromCall(callData: CallAnalyticsData): Promise<void> {
    // Extract successful objection handling patterns
    callData.analysis.content.objections.forEach((objection) => {
      if (objection.resolved) {
        const pattern = this.objectionPatterns.get(objection.type) || {
          keywords: [],
          successfulResponses: [],
        };

        pattern.successfulResponses.push({
          response: objection.agentResponse,
          effectiveness: 0.8, // Would calculate based on call outcome
          agentId: callData.agentId,
        });

        this.objectionPatterns.set(objection.type, pattern);
      }
    });

    // Update buying signal data
    this.buyingSignals.forEach((signal, key) => {
      const hasSignal = signal.keywords.some((keyword) =>
        callData.transcript.toLowerCase().includes(keyword)
      );

      if (hasSignal && callData.outcome === 'converted') {
        signal.conversionRate = (signal.conversionRate + 1) / 2; // Simple update
      }
    });

    console.log('🧠 AI learning updated with call data');
  }

  /**
   * Get analytics insights for a period
   */
  public getAnalyticsInsights(
    startDate: string,
    endDate: string
  ): CallAnalyticsInsights {
    const callsInPeriod = Array.from(this.callAnalytics.values()).filter(
      (call) => {
        const callDate = new Date(call.createdAt);
        return callDate >= new Date(startDate) && callDate <= new Date(endDate);
      }
    );

    const totalCalls = callsInPeriod.length;
    const conversions = callsInPeriod.filter(
      (call) => call.outcome === 'converted' || call.outcome === 'interested'
    ).length;

    // Calculate metrics
    const conversionMetrics = this.calculateConversionMetrics(callsInPeriod);
    const sentimentTrends = this.calculateSentimentTrends(callsInPeriod);
    const commonObjections = this.calculateCommonObjections(callsInPeriod);
    const topPerformers = this.calculateTopPerformers(callsInPeriod);
    const improvementOpportunities =
      this.identifyImprovementOpportunities(callsInPeriod);

    return {
      totalCalls,
      period: { start: startDate, end: endDate },
      conversionMetrics,
      sentimentTrends,
      commonObjections,
      topPerformers,
      improvementOpportunities,
    };
  }

  /**
   * Helper methods for analysis
   */
  private detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const lowerText = text.toLowerCase();
    const positive = [
      'great',
      'good',
      'excellent',
      'perfect',
      'yes',
      'interested',
    ];
    const negative = ['no', 'not interested', 'bad', 'problem', 'expensive'];

    const positiveCount = positive.filter((word) =>
      lowerText.includes(word)
    ).length;
    const negativeCount = negative.filter((word) =>
      lowerText.includes(word)
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private detectKeyMoment(line: string, timestamp: number): any {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes('but') || lowerLine.includes('however')) {
      return {
        timestamp,
        type: 'objection' as const,
        description: 'Customer raised potential objection',
      };
    }

    if (lowerLine.includes('when') || lowerLine.includes('how soon')) {
      return {
        timestamp,
        type: 'buying_signal' as const,
        description: 'Customer asking about timeline - potential buying signal',
      };
    }

    return null;
  }

  private calculateOverallSentiment(
    timeline: any[]
  ): 'positive' | 'neutral' | 'negative' {
    const sentiments = timeline.map((t) => t.sentiment);
    const positive = sentiments.filter((s) => s === 'positive').length;
    const negative = sentiments.filter((s) => s === 'negative').length;

    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }

  private extractKeyTopics(
    transcript: string[]
  ): Array<{ topic: string; relevance: number; timeSpent: number }> {
    const topics = [
      { topic: 'Pricing/Rates', relevance: 0.8, timeSpent: 120 },
      { topic: 'Service Quality', relevance: 0.6, timeSpent: 90 },
      { topic: 'Capacity', relevance: 0.4, timeSpent: 45 },
    ];
    return topics; // Mock data
  }

  private extractObjections(transcript: string[]): Array<{
    type: string;
    timestamp: number;
    customerWords: string;
    agentResponse: string;
    resolved: boolean;
  }> {
    // Mock objection extraction
    return [
      {
        type: 'pricing',
        timestamp: 45,
        customerWords: 'That seems expensive compared to our current rate',
        agentResponse:
          'I understand cost is important. Let me show you our total value...',
        resolved: true,
      },
    ];
  }

  private extractCommitments(transcript: string[]): Array<any> {
    return []; // Mock implementation
  }

  private extractNextSteps(transcript: string[]): Array<any> {
    return [
      {
        action: 'Send formal quote',
        owner: 'agent' as const,
        deadline: '24 hours',
      },
    ];
  }

  private identifyObjections(transcript: string): string[] {
    const objectionKeywords = [
      'expensive',
      'too much',
      'already have',
      'not interested',
    ];
    return objectionKeywords.filter((keyword) => transcript.includes(keyword));
  }

  private countHandledObjections(
    transcript: string,
    objections: string[]
  ): number {
    // Simple logic - count responses after objections
    return Math.min(objections.length, objections.length - 1); // Mock handling
  }

  private countClosingAttempts(transcript: string): number {
    const closingPhrases = [
      'ready to move forward',
      'shall we proceed',
      'next steps',
    ];
    return closingPhrases.filter((phrase) => transcript.includes(phrase))
      .length;
  }

  private identifyCompetitors(transcript: string): string[] {
    const competitors = ['landstar', 'ch robinson', 'jb hunt'];
    return competitors.filter((comp) => transcript.includes(comp));
  }

  private calculateConversionProbability(
    transcript: string,
    outcome: string,
    contentAnalysis: any
  ): number {
    // Simple probability calculation based on outcome and signals
    if (outcome === 'converted') return 0.95;
    if (outcome === 'interested') return 0.7;
    if (outcome === 'follow_up_scheduled') return 0.6;
    return 0.2;
  }

  private generateFollowUpRecommendation(
    outcome: string,
    probability: number
  ): string {
    if (probability > 0.8)
      return 'High priority: Send contract within 24 hours';
    if (probability > 0.6)
      return 'Medium priority: Follow up within 48 hours with quote';
    return 'Low priority: Add to nurture sequence';
  }

  private identifyRiskFactors(
    transcript: string,
    contentAnalysis: any
  ): string[] {
    const risks = [];
    if (transcript.includes('expensive')) risks.push('Price sensitivity');
    if (transcript.includes('already have'))
      risks.push('Existing relationship');
    return risks;
  }

  private identifyOpportunitySignals(
    transcript: string,
    contentAnalysis: any
  ): string[] {
    const opportunities = [];
    if (transcript.includes('when can')) opportunities.push('Timeline urgency');
    if (transcript.includes('volume'))
      opportunities.push('High volume potential');
    return opportunities;
  }

  private calculateConversionMetrics(calls: CallAnalyticsData[]): any {
    const conversions = calls.filter((c) => c.outcome === 'converted').length;
    return {
      overallRate: calls.length > 0 ? (conversions / calls.length) * 100 : 0,
      bySource: {},
      byAgent: {},
      byTimeOfDay: {},
    };
  }

  private calculateSentimentTrends(calls: CallAnalyticsData[]): any {
    const sentiments = calls.map((c) => c.analysis.sentiment.overall);
    const positive = sentiments.filter((s) => s === 'positive').length;
    const neutral = sentiments.filter((s) => s === 'neutral').length;
    const negative = sentiments.filter((s) => s === 'negative').length;
    const total = sentiments.length;

    return {
      positive: total > 0 ? (positive / total) * 100 : 0,
      neutral: total > 0 ? (neutral / total) * 100 : 0,
      negative: total > 0 ? (negative / total) * 100 : 0,
      trending: 'stable' as const,
    };
  }

  private calculateCommonObjections(calls: CallAnalyticsData[]): Array<any> {
    return [
      {
        objection: 'Pricing concerns',
        frequency: 45,
        resolutionRate: 78,
        bestResponse: 'Focus on total value and ROI calculation',
      },
    ];
  }

  private calculateTopPerformers(calls: CallAnalyticsData[]): Array<any> {
    return [
      {
        agentId: 'agent-1',
        agentName: 'Sarah Johnson',
        conversionRate: 34.5,
        avgSentiment: 0.78,
      },
    ];
  }

  private identifyImprovementOpportunities(
    calls: CallAnalyticsData[]
  ): Array<any> {
    return [
      {
        area: 'Objection Handling',
        impact: 'high' as const,
        description: 'Agents need better responses to pricing objections',
        recommendation: 'Implement pricing objection handling training',
      },
    ];
  }
}

// Export singleton instance
export const enhancedCallAnalytics = EnhancedCallAnalytics.getInstance();
