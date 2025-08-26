/**
 * AI Call Analysis Service
 * Advanced call analysis using Claude AI for sentiment, intent, and performance optimization
 */

export interface CallTranscript {
  id: string;
  callId: string;
  timestamp: string;
  speaker: 'agent' | 'customer';
  text: string;
  confidence: number;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  confidence: number;
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
    trust: number;
  };
  keywords: string[];
}

export interface CallIntent {
  primary: string;
  secondary?: string;
  confidence: number;
  category:
    | 'sales'
    | 'support'
    | 'complaint'
    | 'inquiry'
    | 'booking'
    | 'emergency';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface CallPerformanceMetrics {
  agentPerformance: {
    professionalism: number; // 1-10
    responsiveness: number; // 1-10
    knowledgeLevel: number; // 1-10
    problemResolution: number; // 1-10
    customerSatisfaction: number; // 1-10
  };
  callQuality: {
    clarity: number; // 1-10
    completeness: number; // 1-10
    efficiency: number; // 1-10
    followUpNeeded: boolean;
  };
  businessOutcome: {
    leadGenerated: boolean;
    saleCompleted: boolean;
    issueResolved: boolean;
    followUpScheduled: boolean;
    customerRetained: boolean;
  };
}

export interface CallAnalysisResult {
  callId: string;
  timestamp: string;
  duration: number;
  transcript: CallTranscript[];
  sentiment: SentimentAnalysis;
  intent: CallIntent;
  performance: CallPerformanceMetrics;
  recommendations: string[];
  actionItems: string[];
  riskScore: number; // 0-100, higher = more risk
  opportunityScore: number; // 0-100, higher = more opportunity
}

export interface CallScript {
  id: string;
  name: string;
  category: 'sales' | 'support' | 'booking' | 'follow_up' | 'complaint';
  trigger: string;
  script: {
    opening: string;
    keyPoints: string[];
    objectionHandling: { objection: string; response: string }[];
    closing: string;
  };
  successMetrics: {
    conversionRate: number;
    averageCallTime: number;
    customerSatisfaction: number;
  };
}

class AICallAnalysisService {
  private readonly STORAGE_KEY = 'fleetflow-call-analysis';
  private readonly SCRIPTS_KEY = 'fleetflow-call-scripts';
  private readonly CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY || 'demo-key';

  // Analyze call transcript with Claude AI
  async analyzeCall(
    transcript: CallTranscript[],
    callMetadata: any
  ): Promise<CallAnalysisResult> {
    try {
      const fullTranscript = transcript
        .map((t) => `${t.speaker}: ${t.text}`)
        .join('\n');

      // In a real implementation, this would call Claude AI API
      const analysis = await this.performClaudeAnalysis(
        fullTranscript,
        callMetadata
      ).catch((error) => {
        console.warn('Claude AI analysis failed, using fallback:', error);
        return this.generateMockAnalysis(fullTranscript, callMetadata);
      });

      const result: CallAnalysisResult = {
        callId: callMetadata.callId || `call-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration: callMetadata.duration || 0,
        transcript,
        sentiment: analysis.sentiment,
        intent: analysis.intent,
        performance: analysis.performance,
        recommendations: analysis.recommendations,
        actionItems: analysis.actionItems,
        riskScore: analysis.riskScore,
        opportunityScore: analysis.opportunityScore,
      };

      // Store analysis result
      try {
        this.storeAnalysisResult(result);
      } catch (storageError) {
        console.warn('Failed to store analysis result:', storageError);
      }

      return result;
    } catch (error) {
      console.error('Error analyzing call:', error);
      return this.generateFallbackAnalysis(transcript, callMetadata);
    }
  }

  // Generate mock analysis for fallback
  private generateMockAnalysis(transcript: string, metadata: any): any {
    return this.performClaudeAnalysisSync(transcript, metadata);
  }

  // Simulate Claude AI analysis (replace with actual API call)
  private async performClaudeAnalysis(
    transcript: string,
    metadata: any
  ): Promise<any> {
    return this.performClaudeAnalysisSync(transcript, metadata);
  }

  // Synchronous version of Claude analysis for fallback
  private performClaudeAnalysisSync(transcript: string, metadata: any): any {
    // Mock Claude AI analysis - replace with actual API call
    const words = transcript.toLowerCase();

    // Sentiment analysis
    const positiveWords = [
      'great',
      'excellent',
      'satisfied',
      'happy',
      'good',
      'perfect',
      'thank you',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'angry',
      'frustrated',
      'problem',
      'issue',
      'complaint',
    ];

    const positiveCount = positiveWords.reduce(
      (count, word) => count + (words.includes(word) ? 1 : 0),
      0
    );
    const negativeCount = negativeWords.reduce(
      (count, word) => count + (words.includes(word) ? 1 : 0),
      0
    );

    const sentimentScore =
      (positiveCount - negativeCount) /
      Math.max(positiveCount + negativeCount, 1);
    const sentiment =
      sentimentScore > 0.2
        ? 'positive'
        : sentimentScore < -0.2
          ? 'negative'
          : 'neutral';

    // Intent detection
    let intent = 'inquiry';
    let category: any = 'inquiry';
    if (words.includes('book') || words.includes('schedule')) {
      intent = 'booking';
      category = 'booking';
    } else if (words.includes('problem') || words.includes('issue')) {
      intent = 'support';
      category = 'support';
    } else if (words.includes('price') || words.includes('quote')) {
      intent = 'sales';
      category = 'sales';
    } else if (words.includes('complaint') || words.includes('angry')) {
      intent = 'complaint';
      category = 'complaint';
    }

    // Performance metrics (simulated)
    const baseScore = 7 + Math.random() * 2; // 7-9 base score
    const sentimentBonus =
      sentiment === 'positive' ? 1 : sentiment === 'negative' ? -1 : 0;

    return {
      sentiment: {
        overall: sentiment,
        score: sentimentScore,
        confidence: 0.85 + Math.random() * 0.1,
        emotions: {
          joy:
            sentiment === 'positive'
              ? 0.7 + Math.random() * 0.3
              : Math.random() * 0.3,
          anger:
            sentiment === 'negative'
              ? 0.6 + Math.random() * 0.4
              : Math.random() * 0.2,
          fear: Math.random() * 0.3,
          sadness:
            sentiment === 'negative'
              ? Math.random() * 0.4
              : Math.random() * 0.2,
          surprise: Math.random() * 0.3,
          trust:
            sentiment === 'positive'
              ? 0.6 + Math.random() * 0.4
              : 0.3 + Math.random() * 0.4,
        },
        keywords: this.extractKeywords(transcript),
      },
      intent: {
        primary: intent,
        confidence: 0.8 + Math.random() * 0.15,
        category,
        urgency:
          category === 'complaint'
            ? 'high'
            : category === 'booking'
              ? 'medium'
              : 'low',
      },
      performance: {
        agentPerformance: {
          professionalism: Math.min(
            10,
            baseScore + sentimentBonus + Math.random()
          ),
          responsiveness: Math.min(10, baseScore + Math.random()),
          knowledgeLevel: Math.min(10, baseScore + Math.random()),
          problemResolution: Math.min(
            10,
            baseScore + sentimentBonus + Math.random()
          ),
          customerSatisfaction: Math.min(
            10,
            baseScore + sentimentBonus * 2 + Math.random()
          ),
        },
        callQuality: {
          clarity: 8 + Math.random() * 2,
          completeness:
            intent === 'booking'
              ? 8 + Math.random() * 2
              : 6 + Math.random() * 3,
          efficiency: 7 + Math.random() * 2,
          followUpNeeded: category === 'complaint' || Math.random() > 0.7,
        },
        businessOutcome: {
          leadGenerated: category === 'inquiry' && Math.random() > 0.6,
          saleCompleted: category === 'booking' && sentiment === 'positive',
          issueResolved: category === 'support' && sentiment !== 'negative',
          followUpScheduled: Math.random() > 0.7,
          customerRetained: sentiment !== 'negative',
        },
      },
      recommendations: this.generateRecommendations(
        intent,
        sentiment,
        category
      ),
      actionItems: this.generateActionItems(intent, sentiment, category),
      riskScore:
        sentiment === 'negative' ? 60 + Math.random() * 30 : Math.random() * 40,
      opportunityScore:
        sentiment === 'positive' && category === 'inquiry'
          ? 70 + Math.random() * 30
          : 20 + Math.random() * 50,
    };
  }

  // Extract keywords from transcript
  private extractKeywords(transcript: string): string[] {
    const commonWords = [
      'the',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'a',
      'an',
      'is',
      'are',
      'was',
      'were',
    ];
    const words = transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !commonWords.includes(word));

    const wordCount = words.reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Generate recommendations based on analysis
  private generateRecommendations(
    intent: string,
    sentiment: string,
    category: string
  ): string[] {
    const recommendations = [];

    if (sentiment === 'negative') {
      recommendations.push(
        'Schedule immediate follow-up call to address concerns'
      );
      recommendations.push('Escalate to senior agent or manager');
      recommendations.push(
        'Offer compensation or service credit if appropriate'
      );
    }

    if (intent === 'booking') {
      recommendations.push('Send booking confirmation and details immediately');
      recommendations.push('Add customer to follow-up sequence for feedback');
    }

    if (category === 'inquiry') {
      recommendations.push('Add to lead nurturing campaign');
      recommendations.push('Send relevant service information and pricing');
    }

    if (sentiment === 'positive') {
      recommendations.push('Request customer testimonial or review');
      recommendations.push('Identify upselling opportunities');
    }

    return recommendations;
  }

  // Generate action items
  private generateActionItems(
    intent: string,
    sentiment: string,
    category: string
  ): string[] {
    const actions = [];

    if (category === 'booking') {
      actions.push('Create service order in system');
      actions.push('Assign driver and equipment');
      actions.push('Send confirmation email/SMS');
    }

    if (category === 'complaint') {
      actions.push('Log complaint in customer service system');
      actions.push('Investigate root cause');
      actions.push('Follow up within 24 hours');
    }

    if (sentiment === 'positive' && category === 'inquiry') {
      actions.push('Send detailed quote within 2 hours');
      actions.push('Schedule follow-up call in 3 days');
    }

    return actions;
  }

  // Generate fallback analysis if AI fails
  private generateFallbackAnalysis(
    transcript: CallTranscript[],
    metadata: any
  ): CallAnalysisResult {
    return {
      callId: metadata.callId || `call-${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration: metadata.duration || 0,
      transcript,
      sentiment: {
        overall: 'neutral',
        score: 0,
        confidence: 0.5,
        emotions: {
          joy: 0.3,
          anger: 0.2,
          fear: 0.1,
          sadness: 0.1,
          surprise: 0.2,
          trust: 0.4,
        },
        keywords: ['call', 'service', 'freight'],
      },
      intent: {
        primary: 'inquiry',
        confidence: 0.6,
        category: 'inquiry',
        urgency: 'medium',
      },
      performance: {
        agentPerformance: {
          professionalism: 7,
          responsiveness: 7,
          knowledgeLevel: 7,
          problemResolution: 7,
          customerSatisfaction: 7,
        },
        callQuality: {
          clarity: 8,
          completeness: 7,
          efficiency: 7,
          followUpNeeded: false,
        },
        businessOutcome: {
          leadGenerated: false,
          saleCompleted: false,
          issueResolved: true,
          followUpScheduled: false,
          customerRetained: true,
        },
      },
      recommendations: ['Review call for improvement opportunities'],
      actionItems: ['Update customer record'],
      riskScore: 25,
      opportunityScore: 40,
    };
  }

  // Store analysis result
  private storeAnalysisResult(result: CallAnalysisResult): void {
    try {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const analyses = stored ? JSON.parse(stored) : [];
      analyses.unshift(result);

      // Keep only last 100 analyses
      if (analyses.length > 100) {
        analyses.splice(100);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analyses));
    } catch (error) {
      console.error('Error storing analysis result:', error);
    }
  }

  // Get stored analysis results
  getAnalysisHistory(limit: number = 20): CallAnalysisResult[] {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const analyses = stored ? JSON.parse(stored) : [];
      return analyses.slice(0, limit);
    } catch (error) {
      console.error('Error retrieving analysis history:', error);
      return [];
    }
  }

  // Get call scripts
  getCallScripts(): CallScript[] {
    try {
      if (typeof window === 'undefined') return [];
      const stored = localStorage.getItem(this.SCRIPTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Return default scripts
      return this.getDefaultCallScripts();
    } catch (error) {
      console.error('Error retrieving call scripts:', error);
      return this.getDefaultCallScripts();
    }
  }

  // Default call scripts
  private getDefaultCallScripts(): CallScript[] {
    return [
      {
        id: 'sales-intro',
        name: 'Sales Introduction',
        category: 'sales',
        trigger: 'new_lead_call',
        script: {
          opening:
            "Hello, this is [Name] from FleetFlow. I understand you're looking for freight transportation services. How can I help you today?",
          keyPoints: [
            'We specialize in reliable, on-time freight delivery',
            'Our network covers all 48 states with real-time tracking',
            'We offer competitive rates and flexible scheduling',
            'All our carriers are fully vetted and insured',
          ],
          objectionHandling: [
            {
              objection: 'We already have a freight provider',
              response:
                'I understand. Many of our best customers started with other providers. What if I could show you how we could save you 15-20% while improving delivery times?',
            },
            {
              objection: 'Your rates are too high',
              response:
                'I appreciate your concern about pricing. Let me understand your specific needs better so I can find the most cost-effective solution for you.',
            },
          ],
          closing:
            "Based on what you've told me, I believe we can provide excellent value. Can I prepare a detailed quote for your review?",
        },
        successMetrics: {
          conversionRate: 0.25,
          averageCallTime: 8.5,
          customerSatisfaction: 8.2,
        },
      },
      {
        id: 'booking-confirmation',
        name: 'Booking Confirmation',
        category: 'booking',
        trigger: 'booking_request',
        script: {
          opening:
            "Thank you for choosing FleetFlow. I'll be happy to help you book your shipment today.",
          keyPoints: [
            'Confirm pickup and delivery locations',
            'Verify shipment details and special requirements',
            'Provide accurate pricing and timeline',
            'Explain tracking and communication process',
          ],
          objectionHandling: [
            {
              objection: 'The timeline seems too long',
              response:
                'I understand time is critical. Let me check if we have any expedited options available that might work better for your schedule.',
            },
          ],
          closing:
            "Perfect! I've booked your shipment. You'll receive confirmation within 30 minutes, and tracking information will be available immediately.",
        },
        successMetrics: {
          conversionRate: 0.85,
          averageCallTime: 12.3,
          customerSatisfaction: 9.1,
        },
      },
      {
        id: 'support-issue',
        name: 'Customer Support',
        category: 'support',
        trigger: 'support_call',
        script: {
          opening:
            "I'm sorry to hear you're experiencing an issue. I'm here to help resolve this as quickly as possible.",
          keyPoints: [
            'Listen actively and empathize with the customer',
            'Gather all relevant details about the issue',
            'Explain the resolution process clearly',
            'Set proper expectations for timeline',
          ],
          objectionHandling: [
            {
              objection: 'This has happened before',
              response:
                'I sincerely apologize for the recurring issue. Let me escalate this to ensure we implement a permanent solution.',
            },
          ],
          closing:
            "I've documented everything and initiated the resolution process. I'll personally follow up with you within [timeframe] to ensure this is resolved.",
        },
        successMetrics: {
          conversionRate: 0.78,
          averageCallTime: 15.2,
          customerSatisfaction: 7.8,
        },
      },
    ];
  }

  // Save call scripts
  saveCallScripts(scripts: CallScript[]): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(this.SCRIPTS_KEY, JSON.stringify(scripts));
      return true;
    } catch (error) {
      console.error('Error saving call scripts:', error);
      return false;
    }
  }

  // Get script by category
  getScriptByCategory(category: string): CallScript | null {
    const scripts = this.getCallScripts();
    return scripts.find((script) => script.category === category) || null;
  }

  // Real-time call coaching suggestions
  getRealTimeCoaching(transcript: string, callDuration: number): string[] {
    const suggestions = [];
    const words = transcript.toLowerCase();

    if (callDuration > 600) {
      // 10+ minutes
      suggestions.push(
        '💡 Consider summarizing key points to keep the call focused'
      );
    }

    if (words.includes('um') || words.includes('uh')) {
      suggestions.push('🎯 Reduce filler words to sound more professional');
    }

    if (!words.includes('thank you') && callDuration > 60) {
      suggestions.push('🙏 Remember to thank the customer for their time');
    }

    if (words.includes('problem') || words.includes('issue')) {
      suggestions.push(
        "🤝 Use positive language: 'challenge' or 'opportunity to improve'"
      );
    }

    if (!words.includes('next step') && callDuration > 300) {
      suggestions.push('📋 Clarify next steps before ending the call');
    }

    return suggestions;
  }
}

export const aiCallAnalysisService = new AICallAnalysisService();
