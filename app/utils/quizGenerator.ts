// Dynamic Quiz Generator - Updates automatically when training content changes

import {
  brokerQuizQuestions,
  complianceQuizQuestions,
  dispatchQuizQuestions,
} from '../data/quizQuestions';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface QuizConfig {
  moduleId: string;
  totalQuestions: number;
  passingScore: number;
  timeLimit?: number; // in minutes
  allowRetakes: boolean;
  questionTypes: string[];
}

class DynamicQuizGenerator {
  private quizConfigs: { [moduleId: string]: QuizConfig } = {
    dispatch: {
      moduleId: 'dispatch',
      totalQuestions: 10,
      passingScore: 80,
      timeLimit: 30,
      allowRetakes: true,
      questionTypes: [
        'workflow',
        'communication',
        'compliance',
        'customer-service',
      ],
    },
    broker: {
      moduleId: 'broker',
      totalQuestions: 10,
      passingScore: 85,
      timeLimit: 35,
      allowRetakes: true,
      questionTypes: [
        'carrier-management',
        'negotiation',
        'documentation',
        'risk-management',
      ],
    },
    compliance: {
      moduleId: 'compliance',
      totalQuestions: 8,
      passingScore: 90,
      timeLimit: 25,
      allowRetakes: true,
      questionTypes: ['regulations', 'safety', 'documentation', 'violations'],
    },
    safety: {
      moduleId: 'safety',
      totalQuestions: 8,
      passingScore: 85,
      timeLimit: 25,
      allowRetakes: true,
      questionTypes: [
        'protocols',
        'incident-management',
        'prevention',
        'training',
      ],
    },
    technology: {
      moduleId: 'technology',
      totalQuestions: 6,
      passingScore: 80,
      timeLimit: 20,
      allowRetakes: true,
      questionTypes: [
        'system-navigation',
        'features',
        'troubleshooting',
        'integration',
      ],
    },
    customer: {
      moduleId: 'customer',
      totalQuestions: 6,
      passingScore: 80,
      timeLimit: 20,
      allowRetakes: true,
      questionTypes: [
        'communication',
        'problem-solving',
        'relationship-management',
        'service-excellence',
      ],
    },
  };

  // Get all available questions for a module
  private getModuleQuestions(moduleId: string): QuizQuestion[] {
    switch (moduleId) {
      case 'dispatch':
        return dispatchQuizQuestions.map((q) => ({
          ...q,
          difficulty: 'medium' as const,
          topic: 'dispatch',
        }));
      case 'broker':
        return brokerQuizQuestions.map((q) => ({
          ...q,
          difficulty: 'hard' as const,
          topic: 'brokerage',
        }));
      case 'compliance':
        return complianceQuizQuestions.map((q) => ({
          ...q,
          difficulty: 'medium' as const,
          topic: 'compliance',
        }));
      case 'safety':
        return this.generateSafetyQuestions();
      case 'technology':
        return this.generateTechnologyQuestions();
      case 'customer':
        return this.generateCustomerServiceQuestions();
      default:
        return [];
    }
  }

  // Generate safety-specific questions
  private generateSafetyQuestions(): QuizQuestion[] {
    return [
      {
        id: 'safety_1',
        question:
          'What is the first priority in any transportation safety incident?',
        options: [
          'Document the incident',
          'Ensure personal safety and call emergency services',
          'Notify the dispatcher',
          'Move the vehicle',
        ],
        correctAnswer: 1,
        explanation:
          'Personal safety and emergency response always take precedence over documentation or operational concerns.',
        difficulty: 'easy',
        topic: 'emergency-response',
      },
      {
        id: 'safety_2',
        question: 'How often should safety training be conducted for drivers?',
        options: [
          'Once per year',
          'Every six months',
          'Quarterly with ongoing reinforcement',
          'Only when incidents occur',
        ],
        correctAnswer: 2,
        explanation:
          'Regular quarterly safety training with ongoing reinforcement ensures continuous awareness and skill development.',
        difficulty: 'medium',
        topic: 'training-frequency',
      },
      {
        id: 'safety_3',
        question: 'What constitutes a reportable safety incident?',
        options: [
          'Only accidents with injuries',
          'Any incident that could have resulted in injury or damage',
          'Only incidents with vehicle damage',
          'Only incidents involving other vehicles',
        ],
        correctAnswer: 1,
        explanation:
          'Near-misses and potential incidents should be reported to improve safety protocols and prevent future accidents.',
        difficulty: 'medium',
        topic: 'incident-reporting',
      },
    ];
  }

  // Generate technology-specific questions
  private generateTechnologyQuestions(): QuizQuestion[] {
    return [
      {
        id: 'tech_1',
        question:
          'What should you do if the FleetFlow system is not responding?',
        options: [
          'Restart your computer immediately',
          'Check internet connection, refresh browser, then contact IT support',
          'Wait and hope it fixes itself',
          'Use a different system',
        ],
        correctAnswer: 1,
        explanation:
          'Systematic troubleshooting ensures quick resolution and proper documentation of technical issues.',
        difficulty: 'easy',
        topic: 'troubleshooting',
      },
      {
        id: 'tech_2',
        question: 'How often should you save your work in FleetFlow?',
        options: [
          'Once at the end of the day',
          'Every hour',
          'After each significant entry or change',
          'Only when prompted',
        ],
        correctAnswer: 2,
        explanation:
          'Regular saving prevents data loss and ensures real-time updates for other team members.',
        difficulty: 'easy',
        topic: 'best-practices',
      },
    ];
  }

  // Generate customer service questions
  private generateCustomerServiceQuestions(): QuizQuestion[] {
    return [
      {
        id: 'customer_1',
        question: 'How should you handle an angry customer complaint?',
        options: [
          'Argue back to defend the company',
          'Listen actively, acknowledge concerns, and work toward a solution',
          'Transfer them to someone else immediately',
          'Hang up if they become too difficult',
        ],
        correctAnswer: 1,
        explanation:
          'Active listening and solution-focused responses de-escalate situations and maintain customer relationships.',
        difficulty: 'medium',
        topic: 'conflict-resolution',
      },
      {
        id: 'customer_2',
        question:
          'What information should you always have ready when speaking with customers?',
        options: [
          "Only the customer's name",
          'Load details, driver information, current status, and estimated delivery times',
          'Just the tracking number',
          'Only pricing information',
        ],
        correctAnswer: 1,
        explanation:
          'Comprehensive information allows for efficient communication and demonstrates professionalism.',
        difficulty: 'easy',
        topic: 'preparation',
      },
    ];
  }

  // Generate a quiz for a specific module
  generateQuiz(moduleId: string): {
    questions: QuizQuestion[];
    config: QuizConfig;
  } {
    const config = this.quizConfigs[moduleId];
    if (!config) {
      throw new Error(`No quiz configuration found for module: ${moduleId}`);
    }

    const allQuestions = this.getModuleQuestions(moduleId);

    // Shuffle and select the required number of questions
    const shuffled = this.shuffleArray([...allQuestions]);
    const selectedQuestions = shuffled.slice(0, config.totalQuestions);

    return {
      questions: selectedQuestions,
      config,
    };
  }

  // Get quiz configuration for a module
  getQuizConfig(moduleId: string): QuizConfig | null {
    return this.quizConfigs[moduleId] || null;
  }

  // Add new questions to a module (for when training content expands)
  addQuestionsToModule(moduleId: string, newQuestions: QuizQuestion[]): void {
    // In a real implementation, this would save to a database
    console.info(
      `Adding ${newQuestions.length} questions to ${moduleId} module`
    );

    // For now, we'll just log that questions would be added
    // In production, you'd want to:
    // 1. Validate the questions
    // 2. Save to database
    // 3. Update the quiz pool
    // 4. Notify administrators of content updates
  }

  // Update quiz configuration
  updateQuizConfig(moduleId: string, updates: Partial<QuizConfig>): void {
    if (this.quizConfigs[moduleId]) {
      this.quizConfigs[moduleId] = {
        ...this.quizConfigs[moduleId],
        ...updates,
      };
    }
  }

  // Utility function to shuffle array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get all available modules with quizzes
  getAvailableModules(): string[] {
    return Object.keys(this.quizConfigs);
  }

  // Validate if a module has enough questions for certification
  validateModuleQuestions(moduleId: string): {
    isValid: boolean;
    availableQuestions: number;
    requiredQuestions: number;
  } {
    const config = this.quizConfigs[moduleId];
    const questions = this.getModuleQuestions(moduleId);

    return {
      isValid: questions.length >= (config?.totalQuestions || 0),
      availableQuestions: questions.length,
      requiredQuestions: config?.totalQuestions || 0,
    };
  }
}

export const quizGenerator = new DynamicQuizGenerator();
