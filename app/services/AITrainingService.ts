// AI Training Service - Learn from successful human examples
// SOLUTION: Train AI on what actually works, not generic responses

interface TrainingExample {
  id: string;
  scenario: string;
  humanResponse: string;
  outcome: 'success' | 'partial' | 'failure';
  customerFeedback?: number; // 1-5 rating
  conversionResult?: boolean;
  tags: string[];
  industry: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timestamp: string;
}

interface TrainingMetrics {
  totalExamples: number;
  successRate: number;
  averageRating: number;
  topPerformingTags: string[];
  improvementAreas: string[];
}

interface LearningPattern {
  pattern: string;
  successRate: number;
  examples: number;
  recommendation: string;
}

export class AITrainingService {
  private trainingDatabase: TrainingExample[] = [];
  private learningPatterns: Map<string, LearningPattern> = new Map();

  // SOLUTION 1: Capture successful human interactions
  async captureSuccessfulInteraction(interaction: {
    customerRequest: string;
    humanResponse: string;
    outcome: 'success' | 'partial' | 'failure';
    customerRating?: number;
    converted?: boolean;
    context: any;
  }): Promise<void> {
    const trainingExample: TrainingExample = {
      id: `training_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      scenario: interaction.customerRequest,
      humanResponse: interaction.humanResponse,
      outcome: interaction.outcome,
      customerFeedback: interaction.customerRating,
      conversionResult: interaction.converted,
      tags: this.extractTags(interaction.humanResponse),
      industry: interaction.context.industry || 'transportation',
      difficulty: this.assessDifficulty(
        interaction.customerRequest,
        interaction.context
      ),
      timestamp: new Date().toISOString(),
    };

    this.trainingDatabase.push(trainingExample);

    // Only learn from successful interactions
    if (interaction.outcome === 'success') {
      await this.updateLearningPatterns(trainingExample);
    }

    console.info(
      `📚 Captured training example: ${trainingExample.id} (${interaction.outcome})`
    );
  }

  // SOLUTION 2: Extract successful patterns from human responses
  private extractTags(response: string): string[] {
    const tags = [];
    const lowerResponse = response.toLowerCase();

    // Conversation starters
    if (
      lowerResponse.includes('i understand') ||
      lowerResponse.includes('i get it')
    ) {
      tags.push('empathy_opener');
    }
    if (
      lowerResponse.includes('let me ask you this') ||
      lowerResponse.includes('curious about')
    ) {
      tags.push('question_redirect');
    }
    if (
      lowerResponse.includes('other companies') ||
      lowerResponse.includes('customers like you')
    ) {
      tags.push('social_proof');
    }

    // Problem solving approaches
    if (
      lowerResponse.includes("here's what we can do") ||
      lowerResponse.includes('solution')
    ) {
      tags.push('solution_focused');
    }
    if (
      lowerResponse.includes('save') ||
      lowerResponse.includes('reduce costs')
    ) {
      tags.push('cost_benefits');
    }
    if (
      lowerResponse.includes('time') ||
      lowerResponse.includes('faster') ||
      lowerResponse.includes('efficient')
    ) {
      tags.push('time_benefits');
    }

    // Objection handling
    if (
      lowerResponse.includes('i totally get that') ||
      lowerResponse.includes('fair enough')
    ) {
      tags.push('objection_acknowledgment');
    }
    if (
      lowerResponse.includes('what if') ||
      lowerResponse.includes('consider this')
    ) {
      tags.push('alternative_proposal');
    }

    // Relationship building
    if (
      lowerResponse.includes('between you and me') ||
      lowerResponse.includes('honestly')
    ) {
      tags.push('personal_connection');
    }
    if (
      lowerResponse.includes('partnership') ||
      lowerResponse.includes('work together')
    ) {
      tags.push('collaborative_approach');
    }

    return tags;
  }

  // SOLUTION 3: Assess interaction difficulty
  private assessDifficulty(
    customerRequest: string,
    context: any
  ): 'easy' | 'medium' | 'hard' {
    let difficultyScore = 0;

    const request = customerRequest.toLowerCase();

    // Difficulty indicators
    if (request.includes('not interested') || request.includes('no thanks'))
      difficultyScore += 2;
    if (request.includes('too expensive') || request.includes('price'))
      difficultyScore += 1;
    if (
      request.includes('already have') ||
      request.includes('current provider')
    )
      difficultyScore += 2;
    if (request.includes('contract') || request.includes('legal'))
      difficultyScore += 2;
    if (request.includes('manager') || request.includes('decision maker'))
      difficultyScore += 1;

    // Context difficulty
    if (context.dealValue > 50000) difficultyScore += 1;
    if (context.timeline === 'immediate') difficultyScore += 1;
    if (context.stakeholders > 2) difficultyScore += 2;

    if (difficultyScore >= 4) return 'hard';
    if (difficultyScore >= 2) return 'medium';
    return 'easy';
  }

  // SOLUTION 4: Update learning patterns
  private async updateLearningPatterns(
    example: TrainingExample
  ): Promise<void> {
    for (const tag of example.tags) {
      const existing = this.learningPatterns.get(tag);

      if (existing) {
        existing.examples += 1;
        if (example.outcome === 'success') {
          existing.successRate =
            (existing.successRate * (existing.examples - 1) + 1) /
            existing.examples;
        }
      } else {
        this.learningPatterns.set(tag, {
          pattern: tag,
          successRate: example.outcome === 'success' ? 1 : 0,
          examples: 1,
          recommendation: this.generatePatternRecommendation(tag),
        });
      }
    }
  }

  // SOLUTION 5: Generate pattern recommendations
  private generatePatternRecommendation(pattern: string): string {
    const recommendations = {
      empathy_opener:
        'Use empathetic language to build rapport before presenting solutions',
      question_redirect:
        'Ask questions to understand customer needs and redirect conversation',
      social_proof: "Reference other customers' success to build credibility",
      solution_focused:
        'Present specific solutions rather than generic benefits',
      cost_benefits:
        'Quantify cost savings with specific numbers when possible',
      time_benefits: 'Emphasize time-saving aspects for busy decision makers',
      objection_acknowledgment:
        'Acknowledge objections before providing counter-arguments',
      alternative_proposal:
        'Offer alternatives when initial proposal meets resistance',
      personal_connection:
        'Build personal rapport through conversational language',
      collaborative_approach:
        'Frame relationship as partnership rather than vendor-client',
    };

    return (
      recommendations[pattern] ||
      'Use this pattern when appropriate for the context'
    );
  }

  // SOLUTION 6: Generate AI training prompts from successful examples
  async generateTrainingPrompt(
    scenario: string,
    context: any
  ): Promise<string> {
    const similarExamples = await this.findSimilarSuccessfulExamples(
      scenario,
      context
    );
    const topPatterns = await this.getTopPerformingPatterns();

    let trainingPrompt = `
You are a professional sales representative. Here are examples of how successful humans handled similar situations:

SUCCESSFUL EXAMPLES:
`;

    similarExamples.slice(0, 3).forEach((example, index) => {
      trainingPrompt += `
Example ${index + 1}:
Customer: "${example.scenario}"
Successful Response: "${example.humanResponse}"
Result: ${example.outcome} (${example.customerFeedback ? `${example.customerFeedback}/5 stars` : 'positive outcome'})
`;
    });

    trainingPrompt += `

TOP PERFORMING PATTERNS TO USE:
`;

    topPatterns.slice(0, 5).forEach((pattern) => {
      trainingPrompt += `
- ${pattern.pattern}: ${pattern.recommendation} (${(pattern.successRate * 100).toFixed(0)}% success rate)
`;
    });

    trainingPrompt += `

CURRENT SCENARIO:
Customer: "${scenario}"

INSTRUCTIONS:
1. Use the successful patterns shown above
2. Adapt the language to match the successful examples
3. Be conversational and empathetic like the human examples
4. Focus on understanding the customer's specific needs
5. Use industry-appropriate language for ${context.industry}

Respond in a natural, human-like way that follows the successful patterns:
    `;

    return trainingPrompt.trim();
  }

  // SOLUTION 7: Find similar successful examples
  private async findSimilarSuccessfulExamples(
    scenario: string,
    context: any
  ): Promise<TrainingExample[]> {
    const successfulExamples = this.trainingDatabase.filter(
      (example) =>
        example.outcome === 'success' && (example.customerFeedback || 0) >= 4
    );

    // Simple similarity scoring based on keywords
    const scoredExamples = successfulExamples.map((example) => ({
      example,
      score: this.calculateSimilarityScore(scenario, example.scenario),
    }));

    // Sort by similarity score and return top matches
    return scoredExamples
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.example);
  }

  private calculateSimilarityScore(
    scenario1: string,
    scenario2: string
  ): number {
    const words1 = scenario1.toLowerCase().split(/\s+/);
    const words2 = scenario2.toLowerCase().split(/\s+/);

    const commonWords = words1.filter((word) => words2.includes(word));

    // Simple Jaccard similarity
    const union = new Set([...words1, ...words2]);
    return commonWords.length / union.size;
  }

  // SOLUTION 8: Get top performing patterns
  private async getTopPerformingPatterns(): Promise<LearningPattern[]> {
    return Array.from(this.learningPatterns.values())
      .filter((pattern) => pattern.examples >= 3) // Need at least 3 examples
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 10);
  }

  // SOLUTION 9: Training metrics
  async getTrainingMetrics(): Promise<TrainingMetrics> {
    const totalExamples = this.trainingDatabase.length;
    const successfulExamples = this.trainingDatabase.filter(
      (ex) => ex.outcome === 'success'
    );
    const successRate =
      totalExamples > 0 ? successfulExamples.length / totalExamples : 0;

    const ratedExamples = this.trainingDatabase.filter(
      (ex) => ex.customerFeedback
    );
    const averageRating =
      ratedExamples.length > 0
        ? ratedExamples.reduce((sum, ex) => sum + ex.customerFeedback!, 0) /
          ratedExamples.length
        : 0;

    const topPatterns = await this.getTopPerformingPatterns();
    const topPerformingTags = topPatterns.slice(0, 5).map((p) => p.pattern);

    const improvementAreas = this.identifyImprovementAreas();

    return {
      totalExamples,
      successRate,
      averageRating,
      topPerformingTags,
      improvementAreas,
    };
  }

  private identifyImprovementAreas(): string[] {
    const areas = [];

    const failedExamples = this.trainingDatabase.filter(
      (ex) => ex.outcome === 'failure'
    );
    const failureRate = failedExamples.length / this.trainingDatabase.length;

    if (failureRate > 0.3) areas.push('Overall success rate needs improvement');

    const hardExamples = this.trainingDatabase.filter(
      (ex) => ex.difficulty === 'hard'
    );
    const hardSuccessRate =
      hardExamples.filter((ex) => ex.outcome === 'success').length /
      hardExamples.length;

    if (hardSuccessRate < 0.5)
      areas.push('Handling difficult objections and complex scenarios');

    const averageRating =
      this.trainingDatabase
        .filter((ex) => ex.customerFeedback)
        .reduce((sum, ex) => sum + ex.customerFeedback!, 0) /
      this.trainingDatabase.filter((ex) => ex.customerFeedback).length;

    if (averageRating < 4)
      areas.push('Customer satisfaction and rapport building');

    return areas;
  }

  // SOLUTION 10: Create training dataset for AI
  async exportTrainingDataset(format: 'json' | 'csv'): Promise<any> {
    const dataset = this.trainingDatabase
      .filter((example) => example.outcome === 'success')
      .map((example) => ({
        input: example.scenario,
        output: example.humanResponse,
        rating: example.customerFeedback,
        tags: example.tags.join(','),
        industry: example.industry,
        difficulty: example.difficulty,
      }));

    if (format === 'csv') {
      const csvHeader = 'input,output,rating,tags,industry,difficulty\n';
      const csvRows = dataset
        .map(
          (row) =>
            `"${row.input}","${row.output}",${row.rating},"${row.tags}","${row.industry}","${row.difficulty}"`
        )
        .join('\n');

      return csvHeader + csvRows;
    }

    return dataset;
  }

  // SOLUTION 11: Load pre-trained successful examples
  async loadSuccessfulExamples(): Promise<void> {
    // Pre-populate with known successful patterns from transportation industry
    const preTrainedExamples: TrainingExample[] = [
      {
        id: 'pretrained_1',
        scenario:
          "I'm not interested in changing our current logistics provider",
        humanResponse:
          "I totally understand that - if you're happy with your current provider, that's great. I'm curious though, are you saving as much as you could be? Most companies leave money on the table without realizing it. What if I could show you a quick comparison that takes 2 minutes?",
        outcome: 'success',
        customerFeedback: 5,
        conversionResult: true,
        tags: [
          'objection_acknowledgment',
          'question_redirect',
          'cost_benefits',
        ],
        industry: 'transportation',
        difficulty: 'medium',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'pretrained_2',
        scenario: 'Your prices are too expensive compared to what we pay now',
        humanResponse:
          'I hear you on price - nobody wants to pay more than they have to. Let me ask you this though: what\'s your current provider NOT doing that costs you time or headaches? Because our customers usually find that our "higher" price actually saves them money when you factor in reliability, service, and peace of mind.',
        outcome: 'success',
        customerFeedback: 4,
        conversionResult: true,
        tags: [
          'objection_acknowledgment',
          'question_redirect',
          'solution_focused',
        ],
        industry: 'transportation',
        difficulty: 'medium',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'pretrained_3',
        scenario: 'We need to think about it and discuss with our team',
        humanResponse:
          "Absolutely - big decisions shouldn't be rushed, and getting team buy-in is smart. What specific questions do you think your team will have? Maybe I can help you think through the key points so you're prepared for those conversations.",
        outcome: 'success',
        customerFeedback: 5,
        conversionResult: true,
        tags: [
          'objection_acknowledgment',
          'collaborative_approach',
          'solution_focused',
        ],
        industry: 'transportation',
        difficulty: 'easy',
        timestamp: new Date().toISOString(),
      },
    ];

    for (const example of preTrainedExamples) {
      this.trainingDatabase.push(example);
      await this.updateLearningPatterns(example);
    }

    console.info(
      `📚 Loaded ${preTrainedExamples.length} pre-trained successful examples`
    );
  }

  // SOLUTION 12: Real-time learning from AI performance
  async learnFromAIInteraction(
    aiResponse: string,
    customerFeedback: number,
    outcome: 'success' | 'partial' | 'failure',
    originalScenario: string
  ): Promise<void> {
    if (outcome === 'success' && customerFeedback >= 4) {
      // AI did well - reinforce this pattern
      await this.captureSuccessfulInteraction({
        customerRequest: originalScenario,
        humanResponse: aiResponse,
        outcome,
        customerRating: customerFeedback,
        converted: outcome === 'success',
        context: { industry: 'transportation' },
      });
    } else if (outcome === 'failure') {
      // AI failed - flag this for human review and training
      console.info(
        `❌ AI failure logged for training improvement: ${originalScenario}`
      );
    }
  }
}

export const aiTrainingService = new AITrainingService();

