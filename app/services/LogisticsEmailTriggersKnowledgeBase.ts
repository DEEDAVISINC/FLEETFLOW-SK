/**
 * Logistics Email Triggers Knowledge Base
 * 115 Psychological Email Triggers for Freight, Logistics & Transportation Sales
 *
 * Based on Cialdini's principles of persuasion applied to logistics industry:
 * - Urgency & Scarcity
 * - Loss Aversion
 * - Social Proof
 * - Authority & Expertise
 * - Reciprocity
 * - Personalization
 * - Commitment & Consistency
 * - Curiosity & Pattern Interrupts
 *
 * Designed for DEPOINTE AI email marketing and sales automation
 */

export const logisticsEmailTriggersKnowledgeBase = {
  /**
   * URGENCY & SCARCITY (1-15)
   * Creates time pressure and fear of missing out
   */
  urgencyScarcity: {
    principles: {
      timePressure: 'Limited availability creates immediate action',
      fomo: 'Fear of missing out drives decision making',
      opportunityCost: 'Emphasize what will be lost if action is delayed',
    },

    keyTriggers: [
      'Limited Capacity Alert',
      'Rate Expiration Countdown',
      'Peak Season Warning',
      'Carrier Shortage Alert',
      'Port Congestion Notice',
      'Fuel Surcharge Increase',
      'Regulation Deadline',
      'Weather-Related Capacity',
      'Contract Renewal Window',
      'Spot Market Volatility',
      'Holiday Shipping Cutoff',
      'Warehouse Space Scarcity',
      'Equipment Availability',
      'Cross-Border Quota',
      'Last-Minute Capacity',
    ],

    bestPractices: {
      timing: 'Use when you have genuine scarcity (not manufactured)',
      proof: 'Back up claims with real data and current market conditions',
      personalization: 'Make scarcity specific to their situation/lanes',
      followUp: 'Have a plan for when scarcity period ends',
    },
  },

  /**
   * LOSS AVERSION (16-30)
   * Fear of losing money, customers, or competitive advantage
   */
  lossAversion: {
    principles: {
      painOverGain:
        'People are more motivated to avoid losses than achieve gains',
      statusQuo: 'Highlight current problems and future risks',
      opportunityCost: "Show what they're losing by not acting",
    },

    keyTriggers: [
      'Cost Leakage Alert',
      'Competitor Advantage',
      'Missed Savings Report',
      'Hidden Fee Exposure',
      'Service Level Erosion',
      'Market Share Risk',
      'Compliance Penalty Risk',
      'Insurance Gap Warning',
      'Technology Obsolescence',
      'Detention Cost Bleeding',
      'Loyalty Program Expiration',
      'Reputation Damage Alert',
      'Opportunity Cost',
      'Vendor Consolidation',
      'Damage Rate Warning',
    ],

    bestPractices: {
      quantify: 'Always include specific dollar amounts and percentages',
      evidence: 'Back claims with data, audits, or industry benchmarks',
      solutions: 'Present the trigger as an opportunity to fix a problem',
      timing: "Use when they're likely experiencing pain points",
    },
  },

  /**
   * SOCIAL PROOF (31-45)
   * People follow what others are doing
   */
  socialProof: {
    principles: {
      consensus: 'If others are doing it, it must be right',
      similarity: 'People trust those like themselves',
      authority: 'Credibility comes from association with respected entities',
    },

    keyTriggers: [
      'Industry Leader Endorsement',
      'Peer Company Success',
      'Volume Milestone',
      'Award Recognition',
      'Client Testimonial',
      'Geographic Dominance',
      'Certification Authority',
      'Partnership Prestige',
      'Case Study Results',
      'Network Effect',
      'Analyst Recognition',
      'Retention Rate',
      'Industry Adoption',
      'Media Mention',
      'Scale Demonstration',
    ],

    bestPractices: {
      specificity: 'Use real company names, numbers, and verifiable claims',
      relevance: "Match proof to prospect's industry, size, and situation",
      freshness: 'Update testimonials and awards regularly',
      authenticity: 'Only use genuine testimonials and recognition',
    },
  },

  /**
   * AUTHORITY & EXPERTISE (46-60)
   * People defer to experts and credible sources
   */
  authorityExpertise: {
    principles: {
      expertise: 'Demonstrate deep knowledge and specialized skills',
      credentials: 'Show certifications, experience, and recognition',
      education: 'Provide valuable insights and industry knowledge',
    },

    keyTriggers: [
      'Industry Tenure',
      'Specialized Knowledge',
      'Proprietary Data',
      'Regulatory Expertise',
      'Educational Content',
      'Technology Innovation',
      'Consulting Approach',
      'Speaking Engagement',
      'Research Insights',
      'Training Credentials',
      'Problem Complexity',
      'Safety Record',
      'Custom Solutions',
      'Audit Capability',
      'Strategic Advisory',
    ],

    bestPractices: {
      demonstrate: 'Show specific expertise through data and examples',
      educate: 'Provide value through insights and content',
      position: 'Frame yourself as the expert who understands their challenges',
      consistency: 'Maintain expert positioning across all communications',
    },
  },

  /**
   * RECIPROCITY (61-70)
   * People feel obligated to return favors
   */
  reciprocity: {
    principles: {
      obligation: 'When someone gives you something, you want to give back',
      valueFirst: 'Provide value before asking for anything',
      generosity: 'Demonstrate willingness to help without strings attached',
    },

    keyTriggers: [
      'Free Audit Offer',
      'Rate Benchmark',
      'Trial Period',
      'Educational Webinar',
      'Technology Access',
      'Market Intelligence',
      'Consultation Gift',
      'Network Introduction',
      'Resource Library',
      'First Shipment Bonus',
    ],

    bestPractices: {
      genuine: 'Offer real value that costs you something to provide',
      relevant: 'Make offers specific to their needs and situation',
      clearValue: "Quantify the value of what you're giving away",
      easyToAccept: 'Make it simple for them to take advantage of the offer',
    },
  },

  /**
   * PERSONALIZATION (71-80)
   * Messages tailored to individual circumstances
   */
  personalization: {
    principles: {
      relevance: 'Information that matters to their specific situation',
      connection: 'Show you understand their unique challenges',
      relationship: 'Build rapport through specific knowledge',
    },

    keyTriggers: [
      'Lane-Specific Data',
      'Volume-Based Insight',
      'Industry Challenge',
      'Seasonal Pattern',
      'Pain Point Reference',
      'Connection Point',
      'Competitive Intelligence',
      'Growth Alignment',
      'Technology Match',
      'Milestone Recognition',
    ],

    bestPractices: {
      research: 'Use CRM data, LinkedIn, news, and company research',
      specificity: 'Reference exact names, numbers, and situations',
      timing: 'Connect to current events or their recent activities',
      authenticity: 'Only reference information you legitimately know',
    },
  },

  /**
   * COMMITMENT & CONSISTENCY (81-90)
   * People want to be consistent with their prior actions and statements
   */
  commitmentConsistency: {
    principles: {
      consistency:
        'People want to appear consistent in their beliefs and actions',
      smallSteps: 'Start with small commitments that lead to larger ones',
      alignment: 'Show how action aligns with their stated goals or values',
    },

    keyTriggers: [
      'Small First Step',
      'Value Alignment',
      'Previous Interest',
      'Pilot Program',
      'Progressive Disclosure',
      'Past Behavior',
      'Goal Reminder',
      'Identity Reinforcement',
      'Public Commitment',
      'Easy Exit',
    ],

    bestPractices: {
      sequence: 'Build from small commitments to larger ones',
      alignment: 'Connect to their stated goals and values',
      credibility: 'Reference past actions or stated intentions',
      trust: 'Make it safe and easy to take the next step',
    },
  },

  /**
   * CURIOSITY & PATTERN INTERRUPTS (91-100)
   * Break expected patterns to grab attention
   */
  curiosityPatternInterrupts: {
    principles: {
      intrigue: 'Spark interest with unexpected information',
      questions: 'Pose questions that demand answers',
      disruption: 'Break routine thinking patterns',
    },

    keyTriggers: [
      'Unexpected Stat',
      'Contrarian View',
      'Mystery Gap',
      'Question Hook',
      'Incomplete Story',
      'Industry Secret',
      'Prediction',
      'Myth Busting',
      'Unexpected Benefit',
      'Provocative Statement',
    ],

    bestPractices: {
      tease: 'Provide just enough information to create curiosity',
      deliver: 'Follow up with valuable insights or solutions',
      authenticity: 'Base claims on real data and insights',
      relevance: 'Ensure the curiosity relates to their business challenges',
    },
  },

  /**
   * BONUS TRIGGERS (101-115)
   * Additional psychological principles
   */
  bonusTriggers: {
    exclusivity: {
      triggers: ['VIP Access', 'Capacity Reserved', 'Beta Program'],
      principle: 'People value what is exclusive and limited',
    },

    fear: {
      triggers: ['Regulatory Change', 'Security Threat'],
      principle: 'Fear of negative consequences motivates action',
    },

    trust: {
      triggers: ['Transparency', 'Guarantee'],
      principle: 'Building trust through openness and promises',
    },

    achievement: {
      triggers: ['Milestone Unlock', 'Recognition'],
      principle: 'Desire for accomplishment and recognition',
    },

    convenience: {
      triggers: ['Simplification', 'Time-Saving'],
      principle: 'People prefer easy solutions',
    },

    innovation: {
      triggers: ['Future-Forward', 'Technology Edge'],
      principle: 'Appeal to desire for cutting-edge solutions',
    },

    partnership: {
      triggers: ['Strategic Alliance', 'Long-term Vision'],
      principle: 'Focus on collaborative, long-term relationships',
    },
  },

  /**
   * IMPLEMENTATION FRAMEWORK
   */
  implementationFramework: {
    combinationStrategy: {
      rule: 'Use 2-3 complementary triggers per email',
      reasoning: 'Multiple triggers reinforce each other without overwhelming',
      example: 'Urgency + Social Proof + Authority',
    },

    abTesting: {
      importance: 'Test different triggers with similar audiences',
      metrics: 'Track open rates, click rates, reply rates, conversion rates',
      iteration: 'Refine based on what performs best',
    },

    personalizationDepth: {
      level1: 'Basic: Company name, industry',
      level2: 'Intermediate: Specific lanes, volumes, pain points',
      level3: 'Advanced: Recent news, LinkedIn activity, competitor moves',
    },

    funnelAlignment: {
      topOfFunnel: 'Authority, Education, Social Proof',
      middleOfFunnel: 'Personalization, Loss Aversion, Reciprocity',
      bottomOfFunnel: 'Urgency, Commitment, Scarcity',
    },

    authenticityRequirement: {
      principle: 'Only use triggers backed by real data and genuine value',
      risk: 'False urgency or manufactured scarcity damages trust',
      test: 'Would you be comfortable if the recipient verified your claims?',
    },

    timingConsiderations: {
      frequency: "Don't overuse triggers - they lose effectiveness",
      context: 'Match triggers to market conditions and prospect readiness',
      followUp: 'Use different triggers in follow-up sequences',
    },
  },

  /**
   * SUCCESS METRICS
   */
  successMetrics: {
    primary: {
      openRate: 'Target: 25-35% with psychological triggers',
      clickRate: 'Target: 3-8% with compelling value propositions',
      replyRate: 'Target: 2-5% in B2B logistics sales',
      conversionRate: 'Target: 0.5-2% depending on funnel stage',
    },

    secondary: {
      unsubscribeRate: 'Should stay under 0.1%',
      spamComplaints: 'Should stay under 0.05%',
      deliverability: 'Maintain 95%+ inbox placement',
      engagementTime: 'Average 2-3 minutes per email',
    },

    tracking: {
      tools: 'Use UTM parameters, email analytics, CRM integration',
      attribution: 'Track full customer journey from email to conversion',
      reporting: 'Weekly trigger performance reports',
    },
  },

  /**
   * INDUSTRY-SPECIFIC APPLICATIONS
   */
  logisticsApplications: {
    freightBrokers: {
      triggers: ['Capacity Shortage', 'Rate Volatility', 'Carrier Network'],
      challenges: 'Finding shippers, carrier vetting, market fluctuations',
    },

    shippers: {
      triggers: ['Cost Savings', 'Service Reliability', 'Risk Mitigation'],
      challenges:
        'Reducing logistics costs, improving OTIF, supply chain visibility',
    },

    carriers: {
      triggers: ['Load Availability', 'Rate Optimization', 'Network Expansion'],
      challenges: 'Finding loads, maximizing margins, driver retention',
    },

    logisticsProviders: {
      triggers: [
        'Technology Advantage',
        'Service Differentiation',
        'Scale Benefits',
      ],
      challenges:
        'Standing out from competition, technology adoption, customer retention',
    },
  },
};

export default logisticsEmailTriggersKnowledgeBase;
