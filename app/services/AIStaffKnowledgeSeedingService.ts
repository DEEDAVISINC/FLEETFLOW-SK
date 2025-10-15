/**
 * AI Staff Knowledge Seeding Service
 * Seeds the Cross-Training Network with initial knowledge patterns and examples
 */

import { aiStaffKnowledgeSharingService } from './AIStaffKnowledgeSharingService';

export class AIStaffKnowledgeSeedingService {
  /**
   * Seed the knowledge sharing service with initial data
   */
  static async seedInitialKnowledge(): Promise<void> {
    console.info('🌱 Seeding AI Staff Knowledge Sharing Network...');

    // Check if already seeded
    const existingPatterns =
      aiStaffKnowledgeSharingService.getKnowledgePatterns();
    if (existingPatterns.length > 0) {
      console.info('📚 Knowledge network already seeded, skipping...');
      return;
    }

    // Seed knowledge patterns
    await this.seedCommunicationPatterns();
    await this.seedProblemSolvingPatterns();
    await this.seedCustomerHandlingPatterns();
    await this.seedCompliancePatterns();
    await this.seedSalesPatterns();
    await this.seedOperationsPatterns();

    // Seed knowledge requests
    await this.seedKnowledgeRequests();

    // Seed training sessions
    await this.seedTrainingSessions();

    console.info('✅ AI Staff Knowledge Sharing Network seeded successfully!');
  }

  private static async seedCommunicationPatterns(): Promise<void> {
    const patterns = [
      {
        title: 'Desperate Shipper Qualification Script',
        description:
          'Proven script for identifying and qualifying desperate shippers with immediate capacity needs',
        category: 'communication' as const,
        originalStaffId: 'desiree',
        originalStaffName: 'Desiree',
        originalDepartment: 'Lead Generation',
        successRate: 89,
        usageCount: 156,
        difficulty: 'easy' as const,
        tags: ['qualification', 'script', 'desperate-shippers', 'phone'],
        content: {
          trigger: 'Shipper mentions capacity issues, delays, or urgent needs',
          approach:
            "Use the 'Desperation Discovery' framework - Ask about pain points first, then solutions",
          execution: [
            "Start with: 'I understand capacity issues are causing real problems. How long have you been experiencing these delays?'",
            "Follow with: 'What's the biggest impact this is having on your business right now?'",
            "Transition: 'Most shippers in your situation find that dedicated capacity solves this. Would you be open to exploring that?'",
          ],
          outcomes: [
            'Higher qualification rates (89% vs 65% industry average)',
            'Better lead quality for sales team',
            'Reduced time spent on unqualified prospects',
          ],
          lessonsLearned: [
            'Always acknowledge pain before offering solutions',
            'Use specific timeframes to create urgency',
            'Mirror their language to build rapport',
          ],
        },
      },
      {
        title: 'Email Follow-Up Sequence for Government Contracts',
        description:
          '4-email sequence for following up on government contract submissions without being pushy',
        category: 'communication' as const,
        originalStaffId: 'alexis',
        originalStaffName: 'Alexis Best',
        originalDepartment: 'Executive Operations',
        successRate: 94,
        usageCount: 78,
        difficulty: 'medium' as const,
        tags: ['email', 'government', 'follow-up', 'sequence'],
        content: {
          trigger:
            'Government contract submitted, no response within 10 business days',
          approach:
            'Gentle, value-adding follow-up sequence that demonstrates continued interest',
          execution: [
            'Email 1 (Day 10): Reference submission, ask if received, offer additional information',
            'Email 2 (Day 20): Share relevant industry update or regulation change',
            'Email 3 (Day 30): Provide case study of similar successful contract',
            'Email 4 (Day 45): Schedule brief call to discuss any questions',
          ],
          outcomes: [
            '94% response rate vs 23% single follow-up',
            '47% of responses lead to contract awards',
            'Improved relationship with contracting officers',
          ],
          lessonsLearned: [
            "Always provide value in follow-ups, never just 'checking in'",
            'Reference specific details from original submission',
            'Use multiple channels (email, call, LinkedIn) for important contracts',
          ],
        },
      },
    ];

    for (const pattern of patterns) {
      await aiStaffKnowledgeSharingService.shareKnowledgePattern(pattern);
    }
  }

  private static async seedProblemSolvingPatterns(): Promise<void> {
    const patterns = [
      {
        title: 'Emergency Load Re-Routing Protocol',
        description:
          'Step-by-step process for re-routing loads when carriers cancel at the last minute',
        category: 'problem_solving' as const,
        originalStaffId: 'logan',
        originalStaffName: 'Logan',
        originalDepartment: 'Operations',
        successRate: 96,
        usageCount: 89,
        difficulty: 'hard' as const,
        tags: ['emergency', 're-routing', 'carrier-cancellation', 'logistics'],
        content: {
          trigger: 'Carrier cancels load with <4 hours notice',
          approach:
            'Rapid assessment, alternative carrier identification, customer communication',
          execution: [
            'Immediate assessment: Load details, timeline requirements, alternative carrier availability',
            'Activate backup carriers from approved network (maintain 3x capacity)',
            'Customer communication: Be honest about issue, provide ETA for resolution',
            'Rate negotiation: Use emergency pricing protocol (+15-25% premium)',
            'Documentation: Full incident report for insurance and compliance',
          ],
          outcomes: [
            '96% successful re-routing within 2 hours',
            'Zero lost loads in past 12 months',
            'Maintained 98% on-time delivery despite emergencies',
          ],
          lessonsLearned: [
            'Always maintain excess capacity in network',
            'Have emergency pricing guidelines ready',
            'Communicate proactively with customers',
            'Document everything for insurance claims',
          ],
        },
      },
    ];

    for (const pattern of patterns) {
      await aiStaffKnowledgeSharingService.shareKnowledgePattern(pattern);
    }
  }

  private static async seedCustomerHandlingPatterns(): Promise<void> {
    const patterns = [
      {
        title: 'Handling Angry Carrier Complaints',
        description:
          'De-escalation techniques for carriers upset about rates, delays, or documentation issues',
        category: 'customer_handling' as const,
        originalStaffId: 'carrie-r',
        originalStaffName: 'Carrie R.',
        originalDepartment: 'Relationships',
        successRate: 91,
        usageCount: 134,
        difficulty: 'medium' as const,
        tags: [
          'de-escalation',
          'complaints',
          'carrier-relations',
          'communication',
        ],
        content: {
          trigger:
            'Carrier calls/email expressing anger about rates, delays, or documentation',
          approach:
            'Listen first, acknowledge feelings, focus on solutions, maintain relationship',
          execution: [
            'Listen completely without interrupting - let them vent',
            "Acknowledge: 'I understand why you're frustrated, and I apologize for the inconvenience'",
            "Clarify: 'Let me make sure I understand the issue correctly...'",
            'Solve: Focus on immediate resolution, then discuss prevention',
            'Follow-up: Call/email within 24 hours to confirm satisfaction',
          ],
          outcomes: [
            '91% of angry situations resolved positively',
            'Carrier retention improved from 78% to 92%',
            'Reduced escalation to management by 67%',
          ],
          lessonsLearned: [
            'Never argue or defend - focus on understanding and solving',
            "Use 'I' statements when apologizing ('I apologize this happened')",
            'Always follow up to ensure complete resolution',
            'Document patterns to prevent future issues',
          ],
        },
      },
    ];

    for (const pattern of patterns) {
      await aiStaffKnowledgeSharingService.shareKnowledgePattern(pattern);
    }
  }

  private static async seedCompliancePatterns(): Promise<void> {
    const patterns = [
      {
        title: 'DOT Audit Preparation Checklist',
        description:
          'Comprehensive checklist for preparing carriers for DOT audits and inspections',
        category: 'compliance' as const,
        originalStaffId: 'kameelah',
        originalStaffName: 'Kameelah',
        originalDepartment: 'Compliance & Safety',
        successRate: 98,
        usageCount: 67,
        difficulty: 'medium' as const,
        tags: ['dot', 'audit', 'preparation', 'compliance', 'checklist'],
        content: {
          trigger:
            'Carrier scheduled for DOT audit or receiving violation notices',
          approach:
            'Comprehensive documentation review, corrective action planning, audit preparation',
          execution: [
            'Documentation Review: Verify all required records current (last 12 months)',
            'Equipment Inspection: Schedule maintenance for any issues found',
            'Driver Qualification: Confirm CDL status, medical cards, training records',
            'Safety Program: Review and update written safety program if needed',
            'Mock Audit: Conduct internal review using DOT checklist',
            'Corrective Actions: Address any deficiencies found during preparation',
          ],
          outcomes: [
            '98% successful audit pass rate for prepared carriers',
            'Average violation reduction of 73% after preparation',
            'Improved carrier compliance scores across network',
          ],
          lessonsLearned: [
            'Start preparation 30-60 days before audit',
            'Document everything - photos, maintenance records, training certificates',
            'Have backup documentation ready',
            'Conduct mock audits regularly, not just before real ones',
          ],
        },
      },
    ];

    for (const pattern of patterns) {
      await aiStaffKnowledgeSharingService.shareKnowledgePattern(pattern);
    }
  }

  private static async seedSalesPatterns(): Promise<void> {
    const patterns = [
      {
        title: 'Freight One-Meeting Close System',
        description:
          'Complete sales methodology for closing freight contracts in single meetings',
        category: 'sales' as const,
        originalStaffId: 'will',
        originalStaffName: 'Will',
        originalDepartment: 'Sales',
        successRate: 87,
        usageCount: 112,
        difficulty: 'hard' as const,
        tags: ['sales', 'closing', 'one-meeting', 'contract', 'methodology'],
        content: {
          trigger:
            'High-value freight opportunity identified, decision-maker available',
          approach:
            'Problem-focused selling, solution demonstration, immediate commitment',
          execution: [
            'Pre-meeting: Research company, identify pain points, prepare custom solution',
            'Opening (5 min): Build rapport, confirm understanding of their challenges',
            'Discovery (10 min): Deep dive into specific freight pain points and costs',
            'Solution (15 min): Present tailored solution with ROI calculations',
            'Objection Handling (10 min): Address concerns with data and references',
            'Close (5 min): Create urgency, get commitment or next steps',
          ],
          outcomes: [
            '87% close rate in first meeting vs 23% industry average',
            'Average contract value increased 34%',
            'Sales cycle reduced from 47 to 12 days',
          ],
          lessonsLearned: [
            'Focus on problems, not features - customers buy solutions to pain',
            'Use specific numbers and ROI calculations',
            'Create urgency without pressure',
            "Always ask for commitment, not just 'thinking about it'",
          ],
        },
      },
    ];

    for (const pattern of patterns) {
      await aiStaffKnowledgeSharingService.shareKnowledgePattern(pattern);
    }
  }

  private static async seedOperationsPatterns(): Promise<void> {
    const patterns = [
      {
        title: 'Load Optimization Algorithm',
        description:
          'Advanced algorithm for optimizing load assignments across carrier network',
        category: 'operations' as const,
        originalStaffId: 'miles',
        originalStaffName: 'Miles Rhodes',
        originalDepartment: 'Operations',
        successRate: 93,
        usageCount: 245,
        difficulty: 'hard' as const,
        tags: ['optimization', 'load-assignment', 'algorithm', 'efficiency'],
        content: {
          trigger: 'New load booking requiring carrier assignment',
          approach:
            'Multi-factor optimization considering rate, capacity, location, performance history',
          execution: [
            'Factor Analysis: Rate competitiveness, carrier capacity, geographic alignment',
            'Performance Scoring: On-time delivery, customer satisfaction, safety record',
            'Load Characteristics: Weight, dimensions, special requirements (hazmat, temp)',
            'Availability Check: Current location, next available pickup time',
            'Rate Optimization: Balance carrier margin with competitive pricing',
            'Assignment: Top 3 carriers presented with recommendation',
          ],
          outcomes: [
            '93% on-time delivery rate vs 78% industry average',
            '23% improvement in load-to-carrier match efficiency',
            'Reduced empty miles by 31%',
          ],
          lessonsLearned: [
            'Balance cost optimization with service quality',
            'Consider long-term carrier relationships over short-term gains',
            'Factor in carrier capacity fluctuations',
            'Regular algorithm updates based on performance data',
          ],
        },
      },
    ];

    for (const pattern of patterns) {
      await aiStaffKnowledgeSharingService.shareKnowledgePattern(pattern);
    }
  }

  private static async seedKnowledgeRequests(): Promise<void> {
    const requests = [
      {
        requestingStaffId: 'regina',
        requestingStaffName: 'Regina',
        category: 'compliance',
        specificTopic: 'CSA Score Improvement Strategies',
        context:
          'Working with carrier who received conditional rating. Need proven strategies for improving CSA scores within 90 days.',
        urgency: 'high' as const,
        responses: [
          {
            respondingStaffId: 'kameelah',
            respondingStaffName: 'Kameelah',
            response:
              "Based on my experience with DOT compliance, focus on three areas: 1) Driver training programs, 2) Equipment maintenance schedules, and 3) Hours of service compliance. I have a detailed checklist that improved one carrier's score from 85 to 95 in 60 days.",
            providedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            helpfulness: 5,
          },
        ],
        resolved: false,
      },
      {
        requestingStaffId: 'hunter',
        requestingStaffId: 'Hunter',
        requestingStaffName: 'Hunter',
        category: 'sales',
        specificTopic: 'Cold Outreach to Owner-Operators',
        context:
          "Need effective scripts and strategies for reaching out to independent owner-operators who aren't currently working with brokers.",
        urgency: 'medium' as const,
        responses: [],
        resolved: false,
      },
    ];

    for (const request of requests) {
      await aiStaffKnowledgeSharingService.submitKnowledgeRequest(request);
    }
  }

  private static async seedTrainingSessions(): Promise<void> {
    const sessions = [
      {
        title: 'Advanced Government Contracting Workshop',
        description:
          'Deep dive into SAM.gov navigation, BPA processes, and winning government contract strategies',
        participants: [
          {
            staffId: 'alexis',
            staffName: 'Alexis Best',
            department: 'Executive Operations',
            role: 'host' as const,
          },
          {
            staffId: 'regina',
            staffName: 'Regina',
            department: 'Compliance & Safety',
            role: 'participant' as const,
          },
          {
            staffId: 'kameelah',
            staffName: 'Kameelah',
            department: 'Compliance & Safety',
            role: 'participant' as const,
          },
          {
            staffId: 'will',
            staffName: 'Will',
            department: 'Sales',
            role: 'participant' as const,
          },
        ],
        topic: 'Government Contract Acquisition',
        category: 'government_contracting',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 90,
        status: 'scheduled' as const,
        outcomes: [],
        learnings: [],
      },
      {
        title: 'Emergency Response Coordination Training',
        description:
          'Cross-training on emergency load re-routing, carrier crisis management, and customer communication during disruptions',
        participants: [
          {
            staffId: 'logan',
            staffName: 'Logan',
            department: 'Operations',
            role: 'host' as const,
          },
          {
            staffId: 'miles',
            staffName: 'Miles Rhodes',
            department: 'Operations',
            role: 'participant' as const,
          },
          {
            staffId: 'shanell',
            staffName: 'Shanell',
            department: 'Support & Service',
            role: 'participant' as const,
          },
          {
            staffId: 'carrie-r',
            staffName: 'Carrie R.',
            department: 'Relationships',
            role: 'participant' as const,
          },
        ],
        topic: 'Emergency Logistics Management',
        category: 'operations',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 120,
        status: 'scheduled' as const,
        outcomes: [],
        learnings: [],
      },
    ];

    for (const session of sessions) {
      await aiStaffKnowledgeSharingService.scheduleCrossTrainingSession(
        session
      );
    }
  }
}

// Auto-seed when module is loaded in browser
if (typeof window !== 'undefined') {
  // Delay seeding to ensure service is initialized
  setTimeout(() => {
    AIStaffKnowledgeSeedingService.seedInitialKnowledge();
  }, 2000);
}

