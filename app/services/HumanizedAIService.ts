// Humanized AI Service - Makes AI sound natural and conversational
// SOLUTION: Replace robotic AI with human-like conversation patterns

interface ConversationContext {
  leadName: string;
  company: string;
  industry: string;
  previousInteractions: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  urgency: 'low' | 'medium' | 'high';
}

interface HumanizedResponse {
  script: string;
  toneMarkers: string[];
  pausePoints: number[];
  variationOptions: string[];
  fallbackResponses: string[];
}

export class HumanizedAIService {
  // SOLUTION 1: Add natural speech patterns and hesitations
  private getNaturalSpeechPatterns(): string[] {
    return [
      'Um, let me think about that for a second...',
      "You know what, that's a great question.",
      'Actually, that reminds me of something...',
      'Oh, and another thing I should mention...',
      "I'm curious about something...",
      "That's interesting, let me ask you this...",
      "Well, here's the thing...",
      "I'll be honest with you...",
      'Between you and me...',
      'I was just talking to another customer about this...',
    ];
  }

  // SOLUTION 2: Use industry-specific language and references
  private getIndustryContext(industry: string): {
    terminology: string[];
    references: string[];
  } {
    const contexts = {
      transportation: {
        terminology: [
          'loads',
          'dispatch',
          'DOT compliance',
          'fuel costs',
          'delivery windows',
        ],
        references: [
          'I work with a lot of trucking companies',
          'Your drivers probably deal with...',
          'Like most fleet managers I talk to...',
        ],
      },
      construction: {
        terminology: [
          'job sites',
          'project timelines',
          'material delivery',
          'heavy equipment',
        ],
        references: [
          'Construction schedules are always tight',
          'Most contractors tell me...',
        ],
      },
      manufacturing: {
        terminology: [
          'supply chain',
          'production schedules',
          'raw materials',
          'just-in-time',
        ],
        references: [
          'Manufacturing is all about timing',
          'Your production team must...',
        ],
      },
      retail: {
        terminology: [
          'inventory',
          'seasonal demand',
          'distribution centers',
          'SKUs',
        ],
        references: [
          'Retail is so competitive these days',
          'Customer expectations are higher than ever...',
        ],
      },
    };

    return contexts[industry] || contexts.transportation;
  }

  // SOLUTION 3: Create conversational, not sales-y scripts
  generateHumanizedSalesScript(
    context: ConversationContext
  ): HumanizedResponse {
    const industryContext = this.getIndustryContext(context.industry);
    const naturalPatterns = this.getNaturalSpeechPatterns();

    // Pick random natural opener
    const opener =
      naturalPatterns[Math.floor(Math.random() * naturalPatterns.length)];

    const timeGreeting = this.getTimeAppropriateGreeting(context.timeOfDay);

    // HUMAN-LIKE SCRIPT (not robotic)
    const mainScript = `
${timeGreeting}, ${context.leadName}! This is Sarah from FleetFlow.
${opener} I hope I'm not catching you at a bad time?

I was actually just reviewing some data about ${context.industry} companies, and
${context.company} came up as someone who might benefit from what we're doing.

${industryContext.references[0]}, they're usually dealing with the same challenges -
you know, ${industryContext.terminology.slice(0, 2).join(' and ')},
that kind of thing.

I'm curious - what's your biggest headache when it comes to logistics right now?
Is it more on the ${industryContext.terminology[0]} side, or are you dealing with
${industryContext.terminology[1]} issues?
    `.trim();

    // Multiple response variations to sound different each time
    const variations = [
      mainScript,
      mainScript.replace(
        "I hope I'm not catching you at a bad time?",
        'Are you free to chat for just a couple minutes?'
      ),
      mainScript.replace(
        'This is Sarah from FleetFlow',
        'Sarah here from FleetFlow'
      ),
      mainScript.replace(
        'I was actually just reviewing',
        'I was looking at some industry data and'
      ),
    ];

    // Fallback responses for common objections
    const fallbackResponses = [
      "I totally get that - everyone's slammed these days. What if I just sent you something quick to look at when you have a minute?",
      'Fair enough! You know what, let me ask you this - if you could wave a magic wand and fix one thing about your logistics, what would it be?',
      "I hear you. Most people tell me that. But here's what's interesting - the companies saving the most money are the ones who thought they didn't need help.",
      "That's exactly what the CEO at [similar company] told me last month. Now they're saving $15K a month. But I understand if the timing isn't right.",
    ];

    return {
      script: variations[Math.floor(Math.random() * variations.length)],
      toneMarkers: ['conversational', 'curious', 'helpful', 'not_pushy'],
      pausePoints: [3, 7, 12, 18, 25], // Seconds where natural pauses should occur
      variationOptions: variations,
      fallbackResponses: fallbackResponses,
    };
  }

  // SOLUTION 4: Time-appropriate greetings
  private getTimeAppropriateGreeting(timeOfDay: string): string {
    const greetings = {
      morning: [
        'Good morning',
        'Morning',
        'Hope your day is off to a great start',
      ],
      afternoon: [
        'Good afternoon',
        "Hope you're having a good day",
        'Afternoon',
      ],
      evening: [
        'Good evening',
        "Hope you're wrapping up a good day",
        'Evening',
      ],
    };

    const options = greetings[timeOfDay];
    return options[Math.floor(Math.random() * options.length)];
  }

  // SOLUTION 5: Handle objections naturally
  handleObjection(objection: string): string {
    const objectionHandlers = {
      not_interested: [
        'I totally understand - you get calls like this all the time. Let me ask you this though - if I could show you how to cut your logistics costs by 20% in the next 30 days, would that be worth 5 minutes of your time?',
        "I get it, I really do. But here's the thing - I'm not trying to sell you anything today. I just want to show you something that might help your business. What's the worst that could happen?",
      ],
      too_busy: [
        "I completely get that - everyone's crazy busy these days. What if I just sent you a quick video that explains everything? Takes 3 minutes to watch, and if it's not relevant, you can delete it.",
        "Fair enough! When would be a better time? I'm pretty flexible - I can call you back whenever works for you.",
      ],
      happy_with_current: [
        "That's great to hear! It sounds like you've got good systems in place. I'm curious though - are you saving as much as you could be? Most companies leave money on the table without realizing it.",
        'I love hearing that! You know what though? Even companies with great systems usually find at least one area they can improve. What if I could show you something that takes your good system and makes it even better?',
      ],
      need_to_think: [
        "Absolutely - big decisions shouldn't be rushed. What specific questions do you have? Maybe I can help you think through it.",
        "Smart approach - I'd do the same thing. What information would help you make the best decision?",
      ],
    };

    // Simple keyword matching to categorize objection
    const lowerObjection = objection.toLowerCase();

    if (
      lowerObjection.includes('not interested') ||
      lowerObjection.includes('not need')
    ) {
      return this.getRandomResponse(objectionHandlers.not_interested);
    } else if (
      lowerObjection.includes('busy') ||
      lowerObjection.includes('time')
    ) {
      return this.getRandomResponse(objectionHandlers.too_busy);
    } else if (
      lowerObjection.includes('happy') ||
      lowerObjection.includes('current') ||
      lowerObjection.includes('already have')
    ) {
      return this.getRandomResponse(objectionHandlers.happy_with_current);
    } else if (
      lowerObjection.includes('think') ||
      lowerObjection.includes('consider')
    ) {
      return this.getRandomResponse(objectionHandlers.need_to_think);
    }

    // Default response
    return 'I understand. What would help you feel more comfortable moving forward?';
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // SOLUTION 6: Quality scoring system
  scoreCallQuality(callTranscript: string): {
    humanlikeScore: number;
    issues: string[];
    improvements: string[];
  } {
    const issues = [];
    const improvements = [];
    let score = 100;

    // Check for robotic patterns
    const roboticPatterns = [
      'Hello, this is a representative from',
      'I am calling today to inform you about',
      'Our products and services',
      'Please hold while I transfer',
      'According to our records',
      'This call may be recorded for quality purposes',
    ];

    roboticPatterns.forEach((pattern) => {
      if (callTranscript.toLowerCase().includes(pattern.toLowerCase())) {
        score -= 15;
        issues.push(`Too robotic: "${pattern}"`);
      }
    });

    // Check for natural speech patterns
    const naturalPatterns = [
      'you know what',
      'between you and me',
      "here's the thing",
      'i was just talking to',
      'curious about',
      'let me ask you this',
    ];

    let naturalCount = 0;
    naturalPatterns.forEach((pattern) => {
      if (callTranscript.toLowerCase().includes(pattern)) {
        naturalCount++;
      }
    });

    if (naturalCount === 0) {
      score -= 10;
      improvements.push('Add more conversational phrases');
    }

    // Check for questions (good)
    const questionCount = (callTranscript.match(/\?/g) || []).length;
    if (questionCount < 2) {
      score -= 10;
      improvements.push('Ask more questions to engage the prospect');
    }

    // Check for industry terminology
    if (
      !callTranscript.toLowerCase().includes('logistics') &&
      !callTranscript.toLowerCase().includes('freight') &&
      !callTranscript.toLowerCase().includes('shipping')
    ) {
      score -= 5;
      improvements.push('Use more industry-specific language');
    }

    return {
      humanlikeScore: Math.max(0, score),
      issues,
      improvements,
    };
  }

  // SOLUTION 7: A/B test different approaches
  async testCallApproaches(leadData: ConversationContext): Promise<{
    recommendedApproach: string;
    confidence: number;
    reasoning: string;
  }> {
    // Generate 3 different approaches
    const approaches = {
      consultative: this.generateConsultativeScript(leadData),
      problem_focused: this.generateProblemFocusedScript(leadData),
      social_proof: this.generateSocialProofScript(leadData),
    };

    // Score each approach based on lead profile
    let bestApproach = 'consultative';
    let confidence = 75;
    let reasoning = 'Default consultative approach for new leads';

    // Adjust based on context
    if (leadData.previousInteractions > 0) {
      bestApproach = 'problem_focused';
      confidence = 85;
      reasoning = 'Lead has been contacted before - focus on specific problems';
    }

    if (leadData.urgency === 'high') {
      bestApproach = 'social_proof';
      confidence = 90;
      reasoning =
        'High urgency lead - use social proof to create trust quickly';
    }

    return { recommendedApproach: bestApproach, confidence, reasoning };
  }

  private generateConsultativeScript(context: ConversationContext): string {
    return `Hi ${context.leadName}, this is Sarah from FleetFlow. I specialize in helping ${context.industry} companies optimize their logistics operations. I'm curious - what's your biggest challenge when it comes to managing freight and deliveries right now?`;
  }

  private generateProblemFocusedScript(context: ConversationContext): string {
    return `Hi ${context.leadName}, Sarah from FleetFlow again. I know we talked briefly before, and you mentioned some concerns about logistics costs. I actually have some specific ideas that might help with that. Do you have 5 minutes to explore this?`;
  }

  private generateSocialProofScript(context: ConversationContext): string {
    return `Hi ${context.leadName}, this is Sarah from FleetFlow. I was just helping another ${context.industry} company save $12,000 a month on their logistics costs, and they suggested I reach out to you. What's your experience been with freight management lately?`;
  }
}

export const humanizedAIService = new HumanizedAIService();

