/**
 * DATABASE REVITALIZATION KNOWLEDGE BASE
 *
 * Advanced CRM engagement and database nurturing strategies for DEPOINTE AI staff
 * Adapted from high-performance team best practices for transportation & logistics
 *
 * This knowledge base teaches AI staff how to:
 * - Transform "dead databases" into active opportunity pipelines
 * - Create behavioral segmentation for targeted nurturing
 * - Implement automated engagement that feels personal
 * - Build systematic follow-up without overwhelming teams
 * - Extract maximum value from existing contact databases
 */

export interface DatabaseSegment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  engagementLevel: 'hot' | 'warm' | 'cold' | 'dormant';
  recommendedActions: string[];
  expectedConversionRate: number;
  nurtureCadence: string;
}

export interface BehavioralSignal {
  id: string;
  signalType: 'high-intent' | 'moderate-intent' | 'passive' | 'dormant';
  action: string;
  description: string;
  recommendedResponse: string;
  responseTimeframe: string;
  automationTrigger?: string;
}

export interface EngagementStrategy {
  id: string;
  category:
    | 'database-revival'
    | 'behavioral-segmentation'
    | 'auto-nurture'
    | 'team-workflow'
    | 'tracking';
  title: string;
  description: string;
  implementation: string[];
  expectedImpact: string;
  targetMetric: string;
  applicableTo: string[];
}

export class DatabaseRevitalizationKnowledgeBase {
  // ============================================================================
  // CORE PROBLEM: THE "DEAD-A-BASE" EPIDEMIC
  // ============================================================================

  public static readonly DATABASE_CRISIS = {
    problem:
      'Most companies sit on untapped opportunities worth hundreds of thousands in revenue',
    cause:
      'Potential transactions slip through due to inconsistent follow-up and lack of systematic engagement',
    traditionalApproach:
      'Throwing more leads into a leaky funnel instead of fixing conversion',
    solution:
      'Systematic database engagement that transforms dormant contacts into active opportunities',
  };

  /**
   * Key Statistics for Database Engagement
   */
  public static readonly ENGAGEMENT_BENCHMARKS = {
    traditionalEmailEngagement: {
      rate: '10-15%',
      description: 'Industry average for generic email platforms',
    },
    systematicEngagement: {
      rate: '70%',
      description: 'Median engagement rate with behavioral segmentation',
    },
    emailClickthrough: {
      multiplier: '16x',
      description: 'Higher than industry average with personalized alerts',
    },
    costOfInaction:
      'Average business loses hundreds of thousands in opportunities annually from dormant contacts',
  };

  // ============================================================================
  // BEHAVIORAL SEGMENTATION FRAMEWORK
  // ============================================================================

  /**
   * Transportation & Logistics Behavioral Segments
   * Tailored specifically for fleet operators, freight forwarders, and logistics companies
   */
  public static readonly BEHAVIORAL_SEGMENTS: DatabaseSegment[] = [
    {
      id: 'seg-001',
      name: 'Service Engagement (High Intent)',
      description:
        'Active prospects showing intent through platform browsing and service exploration',
      criteria: [
        'Multiple pricing page views (3+ indicates high interest)',
        'Service comparison activity (evaluating TMS vs Dispatch vs Brokerage)',
        'Feature exploration (actively researching capabilities)',
        'Demo video views (consuming educational content)',
        'ROI calculator usage (quantifying value)',
      ],
      engagementLevel: 'hot',
      recommendedActions: [
        'Immediate call within 5 minutes during business hours',
        'Send relevant case study matching their service interest',
        'Offer personalized demo focusing on explored features',
        'Provide pricing breakdown tailored to their fleet size',
      ],
      expectedConversionRate: 35,
      nurtureCadence: 'Daily touchpoints for first week, then 3x/week',
    },
    {
      id: 'seg-002',
      name: 'Active Research (Warm Intent)',
      description:
        'Leads moving toward decision readiness through information gathering',
      criteria: [
        'Webinar attendance (planning to learn more)',
        'Resource downloads (consuming educational content)',
        'Integration documentation views (technical evaluation)',
        'Compliance guide access (researching requirements)',
        'Blog/article engagement (staying informed)',
      ],
      engagementLevel: 'warm',
      recommendedActions: [
        'Follow up within 24 hours with relevant resources',
        'Send targeted educational content based on downloads',
        'Invite to upcoming webinar or Q&A session',
        'Offer 15-minute consultation call',
      ],
      expectedConversionRate: 20,
      nurtureCadence: '2x/week with educational content + monthly check-ins',
    },
    {
      id: 'seg-003',
      name: 'Expansion Signals (Existing Customers)',
      description:
        'Current customers showing signs of growth or additional needs',
      criteria: [
        'Fleet size increase indicators',
        'New route exploration',
        'Additional service interest (TMS customer viewing Brokerage)',
        'Team member additions',
        'Usage pattern changes',
      ],
      engagementLevel: 'hot',
      recommendedActions: [
        'Proactive account review call',
        'Present expansion opportunities',
        'Offer pilot for additional services',
        'Share success stories of similar expansions',
      ],
      expectedConversionRate: 45,
      nurtureCadence: 'Quarterly business reviews + trigger-based outreach',
    },
    {
      id: 'seg-004',
      name: 'Compliance Triggers (Urgent Needs)',
      description:
        'Prospects with immediate compliance or operational deadlines',
      criteria: [
        'DOT audit timeline inquiries',
        'Insurance renewal deadlines',
        'ELD mandate compliance needs',
        'IFTA/IRP reporting urgency',
        'Safety rating improvement requirements',
      ],
      engagementLevel: 'hot',
      recommendedActions: [
        'Immediate response with compliance solutions',
        'Offer expedited implementation (7-14 days)',
        'Provide compliance checklist and resources',
        'Assign dedicated implementation manager',
      ],
      expectedConversionRate: 50,
      nurtureCadence: 'Daily until resolved, then standard nurture',
    },
    {
      id: 'seg-005',
      name: 'Direct Communication (Active Engagement)',
      description: 'Leads actively seeking interaction and information',
      criteria: [
        'Chat messages initiated',
        'Email responses to nurture campaigns',
        'Phone calls returned',
        'Form submissions',
        'Direct questions submitted',
      ],
      engagementLevel: 'hot',
      recommendedActions: [
        'Respond within 5-10 minutes',
        'Transfer to appropriate specialist',
        'Schedule meeting within 24 hours',
        'Provide requested information immediately',
      ],
      expectedConversionRate: 40,
      nurtureCadence: 'Real-time response + scheduled follow-ups',
    },
    {
      id: 'seg-006',
      name: 'Dormant But Qualified (Cold Revival)',
      description:
        'Previously engaged leads who have gone quiet but meet ICP criteria',
      criteria: [
        'No activity in 90+ days',
        'Previously showed high intent',
        'Still meets ICP (fleet size, industry, geography)',
        'Email deliverability good',
        'No explicit opt-out',
      ],
      engagementLevel: 'cold',
      recommendedActions: [
        'Re-engagement campaign with new value proposition',
        'Share relevant industry updates or regulatory changes',
        'Offer free audit or assessment',
        'Reference previous interest naturally',
      ],
      expectedConversionRate: 8,
      nurtureCadence: 'Weekly for 4 weeks, then monthly if no response',
    },
  ];

  // ============================================================================
  // BEHAVIORAL SIGNALS & RESPONSE FRAMEWORK
  // ============================================================================

  public static readonly BEHAVIORAL_SIGNALS: BehavioralSignal[] = [
    {
      id: 'sig-001',
      signalType: 'high-intent',
      action: 'Pricing Page Visit (3+ times)',
      description:
        'Lead is actively evaluating cost and building business case',
      recommendedResponse:
        'Immediate call with pricing discussion + ROI case study',
      responseTimeframe: '5 minutes during business hours',
      automationTrigger: 'Create FUB task + send pricing one-pager',
    },
    {
      id: 'sig-002',
      signalType: 'high-intent',
      action: 'Demo Request Submission',
      description: 'Lead ready to see product in action',
      recommendedResponse: 'Schedule demo within 24 hours + send confirmation',
      responseTimeframe: '10 minutes',
      automationTrigger: 'Auto-route to demo specialist + calendar invite',
    },
    {
      id: 'sig-003',
      signalType: 'high-intent',
      action: 'Compliance Audit Request',
      description: 'Urgent need for compliance support',
      recommendedResponse:
        'Immediate call + send compliance checklist + offer expedited onboarding',
      responseTimeframe: '5 minutes',
      automationTrigger: 'Alert compliance specialist + priority tag',
    },
    {
      id: 'sig-004',
      signalType: 'moderate-intent',
      action: 'Case Study Download',
      description: 'Researching proof points and success stories',
      recommendedResponse:
        'Follow up within 24h with related case study + offer to discuss',
      responseTimeframe: '4-24 hours',
      automationTrigger: 'Send related content series + 48h follow-up task',
    },
    {
      id: 'sig-005',
      signalType: 'moderate-intent',
      action: 'Webinar Attendance',
      description: 'Investing time to learn about solutions',
      recommendedResponse:
        'Same-day follow-up email + offer 15-min debrief call',
      responseTimeframe: '2-4 hours post-webinar',
      automationTrigger: 'Send webinar replay + schedule follow-up task',
    },
    {
      id: 'sig-006',
      signalType: 'passive',
      action: 'Blog Post Read',
      description: 'General interest in industry topics',
      recommendedResponse: 'Add to relevant nurture sequence',
      responseTimeframe: 'Next business day',
      automationTrigger: 'Tag with topic interest + add to content series',
    },
    {
      id: 'sig-007',
      signalType: 'high-intent',
      action: 'Integration Documentation View',
      description: 'Technical evaluation in progress',
      recommendedResponse:
        'Offer technical consultation call with solutions engineer',
      responseTimeframe: '24 hours',
      automationTrigger: 'Alert SE team + send integration guides',
    },
    {
      id: 'sig-008',
      signalType: 'high-intent',
      action: 'Multiple Page Session (5+ pages)',
      description: 'Deep exploration of platform capabilities',
      recommendedResponse: 'Call to answer questions + offer guided tour',
      responseTimeframe: '15 minutes during session if possible',
      automationTrigger: 'Real-time alert to on-duty rep',
    },
  ];

  // ============================================================================
  // DATABASE REVITALIZATION STRATEGIES
  // ============================================================================

  public static readonly REVIVAL_STRATEGIES: EngagementStrategy[] = [
    {
      id: 'rev-001',
      category: 'database-revival',
      title: 'The First 500 Strategy',
      description:
        'Optimize initial engagement by starting with highest-quality contacts',
      implementation: [
        'Select 500 highest-quality contacts from database',
        'Prioritize: Recent leads (90 days) + accurate contact info + past clients',
        'Create "AutoNurture_Active" tag in CRM',
        'Apply tag only to contacts with verified data and established relationships',
        'Configure automation to only nurture tagged contacts',
        'Establish positive engagement patterns before scaling',
      ],
      expectedImpact:
        'Build strong sender reputation, maximize deliverability, establish baseline engagement metrics',
      targetMetric:
        'Email deliverability rate, engagement rate, spam complaints',
      applicableTo: ['Business Development', 'Marketing Operations'],
    },
    {
      id: 'rev-002',
      category: 'database-revival',
      title: 'Dormant Database Re-Engagement Campaign',
      description:
        'Systematic approach to reviving cold contacts without overwhelming them',
      implementation: [
        'Identify dormant contacts: No activity in 90+ days, still meets ICP',
        'Week 1: Value-first email with industry insight or regulatory update',
        'Week 2: Case study email showing results for similar companies',
        'Week 3: Offer free audit or assessment (low-commitment, high-value)',
        'Week 4: Personal video message from rep with specific question',
        'Tag responders for immediate follow-up, non-responders to quarterly check-ins',
      ],
      expectedImpact:
        'Revive 8-12% of dormant database, identify who to keep nurturing',
      targetMetric: 'Re-engagement rate, meetings booked from dormant contacts',
      applicableTo: ['Business Development', 'Sales'],
    },
    {
      id: 'rev-003',
      category: 'database-revival',
      title: 'Tag Hierarchy for Smart Automation',
      description:
        'Create intelligent tagging system that distinguishes intent levels',
      implementation: [
        'High-Intent Tags: Demo_Request, Pricing_View_3x, Compliance_Urgent, Direct_Message',
        'Moderate-Intent Tags: Webinar_Attended, Case_Study_Downloaded, Content_Engaged',
        'Passive Tags: Blog_Reader, Email_Opened, Link_Clicked',
        'Implement 14-day tag removal system for re-triggering automations',
        'Create Smart Lists for each intent level with appropriate follow-up cadences',
        'Prevent automation fatigue while allowing renewed interest to trigger sequences',
      ],
      expectedImpact:
        'Appropriate response to actual intent, no missed opportunities, no over-nurturing',
      targetMetric: 'Automation effectiveness, lead fatigue rate',
      applicableTo: ['Marketing Operations', 'Sales Operations'],
    },
    {
      id: 'rev-004',
      category: 'behavioral-segmentation',
      title: 'Behavioral Cohort Analysis',
      description:
        'Group contacts by behavior patterns to optimize messaging and timing',
      implementation: [
        'Create cohorts: Active Researchers, Price Shoppers, Compliance Seekers, Tire Kickers',
        'Analyze: What content resonates? When do they engage? What converts them?',
        "Optimize messaging: Tailor content to each cohort's demonstrated interests",
        'Adjust timing: Send to each cohort during their peak engagement windows',
        'Track conversion paths: Which behaviors lead to closed deals?',
      ],
      expectedImpact:
        'Higher relevance, better engagement, improved conversion rates',
      targetMetric: 'Cohort conversion rate, time to conversion by cohort',
      applicableTo: ['Marketing', 'Business Development Manager'],
    },
    {
      id: 'rev-005',
      category: 'auto-nurture',
      title: 'Adaptive Content Sequencing',
      description:
        'Nurture sequences that adapt based on individual engagement patterns',
      implementation: [
        'Track: What content has each contact consumed?',
        'Adapt: Send next-best content based on previous engagement',
        'Example: Pricing viewer → ROI case study → CFO-focused comparison',
        'Example: Compliance researcher → Audit checklist → Implementation timeline',
        'Stop: Remove from sequence if engagement drops (3 non-opens)',
        'Resume: Re-trigger when new engagement signal detected',
      ],
      expectedImpact:
        'Relevant nurture that feels personal, higher engagement rates, less unsubscribes',
      targetMetric: 'Sequence completion rate, unsubscribe rate',
      applicableTo: ['Marketing Automation', 'Content Strategy'],
    },
  ];

  // ============================================================================
  // TEAM WORKFLOW STRATEGIES
  // ============================================================================

  public static readonly TEAM_WORKFLOWS: EngagementStrategy[] = [
    {
      id: 'team-001',
      category: 'team-workflow',
      title: 'ISA/SDR Daily Engagement Routine',
      description:
        'Structured daily workflow for inside sales/development reps',
      implementation: [
        'Morning (8-10am): Check high-intent signals from overnight (demo requests, urgent inquiries)',
        'Mid-day (11am-1pm): Execute follow-up sequences for moderate-intent signals',
        'Afternoon (2-5pm): Process new leads, set up nurture sequences, update CRM',
        "End of day: Review tomorrow's follow-up queue, prepare personalized touches",
        'Weekly: Analyze which signals lead to best conversations, adjust prioritization',
      ],
      expectedImpact:
        'Consistent lead coverage, no missed opportunities, predictable pipeline',
      targetMetric: 'Response time by signal type, meetings booked per day',
      applicableTo: ['Business Development', 'Inside Sales'],
    },
    {
      id: 'team-002',
      category: 'team-workflow',
      title: 'AE/Closer Daily Engagement Routine',
      description: 'Structured workflow for account executives and closers',
      implementation: [
        'Morning (8-10am): Respond to high-priority leads showing immediate intent',
        'Mid-day (11am-2pm): Follow up on demo requests and technical questions',
        'Afternoon (3-5pm): Review nurture sequences, personalize automated follow-up',
        'Weekly: Review won/lost deals, identify patterns, share with team',
        'Monthly: Analyze conversion rates by lead source and behavior',
      ],
      expectedImpact:
        'Focus on highest-value opportunities, efficient use of closing time',
      targetMetric: 'Conversion rate, average deal size, time to close',
      applicableTo: ['Sales', 'Account Executives'],
    },
    {
      id: 'team-003',
      category: 'team-workflow',
      title: 'Train-the-Trainer Implementation',
      description:
        'Sustainable adoption through internal champions rather than vendor-dependent training',
      implementation: [
        'Identify 2-3 early adopters as internal champions',
        'Champions receive deep training from vendor/ops team',
        'Champions create simple, visual guides for each process',
        'Champions train team members in small groups',
        'Champions become go-to resources for questions',
        'Schedule weekly office hours with champions for Q&A',
      ],
      expectedImpact:
        'Sustainable adoption, faster onboarding, continuity as team grows',
      targetMetric: 'Team adoption rate, time to productivity for new hires',
      applicableTo: ['Sales Leadership', 'Operations'],
    },
  ];

  // ============================================================================
  // PERFORMANCE TRACKING STRATEGIES
  // ============================================================================

  public static readonly TRACKING_STRATEGIES: EngagementStrategy[] = [
    {
      id: 'track-001',
      category: 'tracking',
      title: 'Engagement Health Dashboard',
      description:
        'Single-pane view of database health and engagement effectiveness',
      implementation: [
        'Track: Total database size, engaged % (30 days), dormant % (90+ days)',
        'Monitor: Email deliverability, open rate, click rate, unsubscribe rate',
        'Measure: Meetings booked from nurture, pipeline generated, deals closed',
        'Alert: When engagement drops below threshold or deliverability issues',
        'Weekly review: Which segments are engaging? Which need attention?',
      ],
      expectedImpact:
        'Early warning system, data-driven optimization, ROI visibility',
      targetMetric: 'Database engagement %, pipeline from database',
      applicableTo: ['Marketing Operations', 'Sales Leadership'],
    },
    {
      id: 'track-002',
      category: 'tracking',
      title: 'Signal-to-Meeting Conversion Tracking',
      description:
        'Measure effectiveness of each behavioral signal in generating opportunities',
      implementation: [
        'Track conversion rate: Signal → Response → Meeting → Opportunity → Close',
        'Identify: Which signals have highest conversion rates?',
        'Optimize: Focus team energy on highest-converting signals',
        'Test: New response approaches for lower-converting signals',
        'Report: Share signal performance with team weekly',
      ],
      expectedImpact:
        'Focus on highest-ROI activities, continuous improvement of response tactics',
      targetMetric:
        'Conversion rate by signal type, meetings per signal category',
      applicableTo: ['Sales Operations', 'Business Development Manager'],
    },
    {
      id: 'track-003',
      category: 'tracking',
      title: 'Cohort Velocity Analysis',
      description: 'Track how quickly different segments move through pipeline',
      implementation: [
        'Group leads by entry date and segment',
        'Measure: Time to first meeting, time to opportunity, time to close',
        'Compare: Which segments move fastest? Which get stuck?',
        'Identify: What behaviors predict fast movement?',
        'Optimize: Refine segmentation and nurture based on patterns',
      ],
      expectedImpact:
        'Predictable pipeline, better forecasting, optimized resource allocation',
      targetMetric: 'Time to close by segment, pipeline velocity',
      applicableTo: ['Sales Operations', 'RevOps'],
    },
  ];

  // ============================================================================
  // TRANSPORTATION-SPECIFIC ADAPTATIONS
  // ============================================================================

  public static readonly TRANSPORTATION_SEGMENTS: DatabaseSegment[] = [
    {
      id: 'trans-seg-001',
      name: 'Fleet Expansion Signals',
      description: 'Existing operators showing signs of growth',
      criteria: [
        'Job postings for additional drivers',
        'New route exploration',
        'Equipment purchase announcements',
        'News of contract wins',
        'Geographic expansion indicators',
      ],
      engagementLevel: 'hot',
      recommendedActions: [
        'Congratulate on growth, reference specific indicator',
        'Share how FleetFlow scales with fleet size',
        'Offer expansion planning consultation',
        'Connect with similar-sized success story',
      ],
      expectedConversionRate: 35,
      nurtureCadence: 'Weekly during growth phase, then monthly',
    },
    {
      id: 'trans-seg-002',
      name: 'Compliance Event Horizon',
      description: 'Approaching regulatory deadlines or audit periods',
      criteria: [
        'DOT audit season (company anniversary month)',
        'Insurance renewal timeline (annual)',
        'New driver hiring (immediate need for training/compliance)',
        'Safety rating at risk',
        'Recent violation or citation',
      ],
      engagementLevel: 'hot',
      recommendedActions: [
        'Lead with compliance support offer',
        'Send relevant checklist or preparation guide',
        'Highlight compliance features prominently',
        'Offer expedited implementation timeline',
      ],
      expectedConversionRate: 45,
      nurtureCadence: 'Daily until deadline, then standard nurture',
    },
    {
      id: 'trans-seg-003',
      name: 'Technology Modernization Signals',
      description: 'Operators researching digital transformation',
      criteria: [
        'Paper logbook mentions (ready to modernize)',
        'Manual dispatch frustrations',
        'Spreadsheet-based rate management',
        'Competitor technology adoption',
        'Industry technology content consumption',
      ],
      engagementLevel: 'warm',
      recommendedActions: [
        'Share modernization ROI case studies',
        'Highlight ease of transition from manual processes',
        'Offer migration support and training',
        'Provide technology adoption roadmap',
      ],
      expectedConversionRate: 25,
      nurtureCadence: '2x/week educational content + monthly check-in',
    },
  ];

  // ============================================================================
  // INTEGRATION & IMPLEMENTATION
  // ============================================================================

  /**
   * Get strategies applicable to specific role
   */
  public static getStrategiesForRole(role: string): EngagementStrategy[] {
    const allStrategies = [
      ...this.REVIVAL_STRATEGIES,
      ...this.TEAM_WORKFLOWS,
      ...this.TRACKING_STRATEGIES,
    ];

    return allStrategies.filter((strategy) =>
      strategy.applicableTo.some((applicable) =>
        role.toLowerCase().includes(applicable.toLowerCase())
      )
    );
  }

  /**
   * Get recommended actions for behavioral signal
   */
  public static getSignalResponse(
    signalAction: string
  ): BehavioralSignal | null {
    return (
      this.BEHAVIORAL_SIGNALS.find((signal) =>
        signal.action.toLowerCase().includes(signalAction.toLowerCase())
      ) || null
    );
  }

  /**
   * Get segment recommendation based on contact characteristics
   */
  public static getSegmentRecommendation(contact: {
    lastActivityDays?: number;
    engagementScore?: number;
    fleetSize?: number;
    recentActions?: string[];
  }): DatabaseSegment | null {
    // High engagement score
    if (contact.engagementScore && contact.engagementScore > 70) {
      return this.BEHAVIORAL_SEGMENTS.find((s) => s.id === 'seg-001') || null;
    }

    // Moderate engagement
    if (
      contact.engagementScore &&
      contact.engagementScore > 40 &&
      contact.engagementScore <= 70
    ) {
      return this.BEHAVIORAL_SEGMENTS.find((s) => s.id === 'seg-002') || null;
    }

    // Dormant but qualified
    if (contact.lastActivityDays && contact.lastActivityDays > 90) {
      return this.BEHAVIORAL_SEGMENTS.find((s) => s.id === 'seg-006') || null;
    }

    // Check for compliance signals
    if (
      contact.recentActions?.some((action) =>
        action.toLowerCase().includes('compliance')
      )
    ) {
      return this.BEHAVIORAL_SEGMENTS.find((s) => s.id === 'seg-004') || null;
    }

    return null;
  }

  /**
   * Calculate database health score
   */
  public static calculateDatabaseHealth(metrics: {
    totalContacts: number;
    activeLastMonth: number;
    activeLastQuarter: number;
    dormant90Plus: number;
    emailDeliverability: number;
    averageEngagementScore: number;
  }): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendations: string[];
  } {
    const engagementRate =
      (metrics.activeLastMonth / metrics.totalContacts) * 100;
    const dormantRate = (metrics.dormant90Plus / metrics.totalContacts) * 100;

    let score = 0;

    // Engagement rate (40 points)
    if (engagementRate >= 60) score += 40;
    else if (engagementRate >= 40) score += 30;
    else if (engagementRate >= 20) score += 20;
    else score += 10;

    // Dormant rate (30 points) - lower is better
    if (dormantRate <= 20) score += 30;
    else if (dormantRate <= 40) score += 20;
    else if (dormantRate <= 60) score += 10;
    else score += 5;

    // Email deliverability (20 points)
    score += (metrics.emailDeliverability / 100) * 20;

    // Average engagement score (10 points)
    score += (metrics.averageEngagementScore / 100) * 10;

    const grade =
      score >= 90
        ? 'A'
        : score >= 80
          ? 'B'
          : score >= 70
            ? 'C'
            : score >= 60
              ? 'D'
              : 'F';

    const recommendations: string[] = [];
    if (engagementRate < 40)
      recommendations.push('Launch dormant database re-engagement campaign');
    if (dormantRate > 40)
      recommendations.push('Implement aggressive database cleaning/revival');
    if (metrics.emailDeliverability < 95)
      recommendations.push(
        'Improve email deliverability (verify contacts, warm domain)'
      );
    if (metrics.averageEngagementScore < 50)
      recommendations.push('Refine content and messaging for better relevance');

    return { score: Math.round(score), grade, recommendations };
  }
}

// Export singleton
export const databaseRevitalization = DatabaseRevitalizationKnowledgeBase;
export default databaseRevitalization;
