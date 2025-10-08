/**
 * LEAD NURTURE MASTERY KNOWLEDGE BASE
 *
 * Comprehensive sales velocity and lead nurturing strategies for DEPOINTE AI staff
 * Based on industry best practices for compressing sales cycles and accelerating deal velocity
 *
 * This knowledge base enhances Business Development AI staff with:
 * - Deal velocity optimization techniques
 * - CRM momentum maintenance strategies
 * - Speed-to-lead best practices
 * - Qualification frameworks
 * - Deal design and procurement acceleration
 * - Strategic automation patterns
 */

export interface DealVelocityMetrics {
  timeToFirstTouch: number; // minutes
  timeToMeeting: number; // hours
  timeInStage: number; // days
  proposalToClose: number; // days
  overallCycleLength: number; // days
}

export interface LeadNurturingStrategy {
  id: string;
  category:
    | 'velocity'
    | 'crm'
    | 'speed-to-lead'
    | 'qualification'
    | 'deal-design'
    | 'automation';
  title: string;
  description: string;
  implementation: string[];
  expectedImpact: string;
  targetMetric: string;
  applicableTo: string[]; // roles or scenarios
}

export interface ProcurementKit {
  standardMSA: boolean;
  securityFAQ: boolean;
  dataProtectionAddendum: boolean;
  pricingGuardrails: boolean;
  executiveRationale: boolean;
}

export interface MutualActionPlan {
  businessObjective: string;
  successMetrics: string[];
  stakeholders: Array<{ name: string; role: string }>;
  milestones: Array<{ task: string; owner: string; dueDate: Date }>;
  pilotCriteria?: string;
  tentativeKickoff?: Date;
}

export class LeadNurtureMasteryKnowledgeBase {
  // ============================================================================
  // CORE VELOCITY FRAMEWORK
  // ============================================================================

  /**
   * Deal Velocity Formula: (Opportunities × Win Rate × Deal Size) / Sales Cycle Length
   * Goal: Compress the denominator (time) while protecting numerators
   */
  public static readonly VELOCITY_FORMULA = {
    description:
      'Deal velocity calculation for transportation & logistics sales',
    formula:
      '(Number of Opportunities × Win Rate × Average Deal Size) / Sales Cycle Length',
    targetCycleLength: 7, // days for fast-track deals
    industryBenchmark: 30, // days typical for logistics
    fleetflowTarget: 14, // days realistic goal
  };

  /**
   * Stage-by-Stage Velocity Targets
   */
  public static readonly STAGE_VELOCITY_TARGETS: Record<
    string,
    DealVelocityMetrics
  > = {
    'fast-track': {
      timeToFirstTouch: 5, // 5 minutes
      timeToMeeting: 24, // 24 hours
      timeInStage: 2, // 2 days average per stage
      proposalToClose: 7, // 7 days
      overallCycleLength: 7,
    },
    standard: {
      timeToFirstTouch: 10, // 10 minutes
      timeToMeeting: 48, // 48 hours
      timeInStage: 5, // 5 days per stage
      proposalToClose: 14, // 14 days
      overallCycleLength: 21,
    },
    enterprise: {
      timeToFirstTouch: 15, // 15 minutes
      timeToMeeting: 72, // 3 days
      timeInStage: 7, // 1 week per stage
      proposalToClose: 21, // 3 weeks
      overallCycleLength: 45,
    },
  };

  // ============================================================================
  // CRM MOMENTUM STRATEGIES
  // ============================================================================

  public static readonly CRM_BEST_PRACTICES: LeadNurturingStrategy[] = [
    {
      id: 'crm-001',
      category: 'crm',
      title: 'Minimum Viable Fields for Routing',
      description:
        'Strip forms to essential fields only; everything else uses progressive profiling',
      implementation: [
        'Require only: Company, Contact Name, Email, Phone, Service Interest',
        'Use enrichment APIs for: Industry, Company Size, Location, Tech Stack',
        'Progressive profiling: Capture additional details during discovery calls',
        'Enforce picklists for: Country, Industry, Fleet Size, Service Type',
      ],
      expectedImpact:
        'Reduce form abandonment by 40%, increase completion speed by 60%',
      targetMetric: 'Form completion rate',
      applicableTo: ['Business Development', 'Sales', 'Marketing'],
    },
    {
      id: 'crm-002',
      category: 'crm',
      title: 'Duplicate Detection & Lead-to-Account Matching',
      description:
        'Prevent momentum loss from duplicate records and split ownership',
      implementation: [
        'Enable automatic duplicate detection on company name and domain',
        'Match leads to existing accounts before routing',
        'Consolidate multiple contacts under single account ownership',
        'Alert reps when contacting an account with existing relationship',
      ],
      expectedImpact:
        'Eliminate 90% of duplicate record conflicts, improve rep efficiency',
      targetMetric: 'Duplicate record rate',
      applicableTo: ['Business Development', 'Sales Operations'],
    },
    {
      id: 'crm-003',
      category: 'crm',
      title: 'No Silent Failures Policy',
      description:
        'Every lead must land in a visible queue with owner and timer',
      implementation: [
        'Log all routing decisions to timeline field',
        'Create triage queue for unroutable leads with visible SLA',
        'Alert manager when workflow skips or fails',
        'Provide manual override path for edge cases',
        'Daily audit report: leads without owner or stuck in limbo',
      ],
      expectedImpact:
        'Zero leads fall through cracks, 100% visibility on routing',
      targetMetric: 'Unassigned lead count',
      applicableTo: ['Sales Operations', 'Business Development Manager'],
    },
  ];

  // ============================================================================
  // SPEED-TO-LEAD STRATEGIES
  // ============================================================================

  public static readonly SPEED_TO_LEAD_STRATEGIES: LeadNurturingStrategy[] = [
    {
      id: 'stl-001',
      category: 'speed-to-lead',
      title: 'Instant Scheduling on Thank-You Pages',
      description:
        'Embed booking widget that respects territory and availability',
      implementation: [
        'Add Calendly/Chili Piper to all form thank-you pages',
        'Route to correct rep based on territory, service type, fleet size',
        'Failover to backup rep if primary unavailable',
        'Include context in meeting invite (service interest, fleet size, urgency)',
        'Offer same-day or next-day slots for high-intent leads',
      ],
      expectedImpact: 'Compress time-to-meeting from 3 days to 4 hours',
      targetMetric: 'Time to first meeting scheduled',
      applicableTo: ['Business Development', 'Sales'],
    },
    {
      id: 'stl-002',
      category: 'speed-to-lead',
      title: '5-Minute SLA for High-Intent Leads',
      description: 'Treat speed-to-lead as operational sport with strict SLAs',
      implementation: [
        'Define high-intent: demo request, pricing inquiry, contact sales',
        'Set 5-minute response SLA during business hours',
        'Alert rep and manager at 3 minutes if no response',
        'Track and display SLA adherence on team dashboard',
        'Weekly coaching on missed SLAs with action plans',
      ],
      expectedImpact:
        'Increase contact rate by 390% (per Harvard Business Review study)',
      targetMetric: 'Time to first contact attempt',
      applicableTo: ['Business Development', 'Inside Sales'],
    },
    {
      id: 'stl-003',
      category: 'speed-to-lead',
      title: 'Behavioral Routing & Context Transfer',
      description:
        'Adapt first touch based on buyer behavior and transfer full context',
      implementation: [
        'If on pricing page: immediate call with pricing-focused script',
        'If completed webinar: short email referencing session + debrief offer',
        'If downloaded case study: call with relevant success story',
        'Include one-screen console for rep: pages visited, intent score, suggested opener',
        'Never ask questions buyer already answered on form',
      ],
      expectedImpact:
        'Higher connection rate, warmer conversations, shorter discovery',
      targetMetric: 'First call connection rate',
      applicableTo: ['Business Development', 'Sales Development'],
    },
  ];

  // ============================================================================
  // QUALIFICATION FRAMEWORKS
  // ============================================================================

  public static readonly QUALIFICATION_STRATEGIES: LeadNurturingStrategy[] = [
    {
      id: 'qual-001',
      category: 'qualification',
      title: 'Three-Pillar Scoring: FIT + BEHAVIOR + CONTEXT',
      description:
        'Score leads on firmographics, intent actions, and timing signals',
      implementation: [
        'FIT (0-40 pts): Industry match, fleet size, geographic coverage, budget signals',
        'BEHAVIOR (0-40 pts): High-intent actions (pricing, demo, case studies) weighted by recency',
        'CONTEXT (0-20 pts): Timing triggers (expansion, new route, compliance deadline, RFP)',
        'Threshold: 70+ = Fast-Track, 50-69 = Standard, <50 = Nurture',
        'Weight recent actions higher: today × 1.0, last week × 0.7, last month × 0.3',
      ],
      expectedImpact:
        'Improve MQL-to-SQL conversion by 48%, reduce wasted discovery time',
      targetMetric: 'MQL to SQL conversion rate',
      applicableTo: ['Business Development', 'Marketing Operations'],
    },
    {
      id: 'qual-002',
      category: 'qualification',
      title: 'Fast-Track Lane for ICP + High Intent',
      description:
        'Auto-route qualified buyers to senior reps with short-form path',
      implementation: [
        'Criteria: ICP validated + high intent in last 24-48h + decision maker',
        'Auto-route to senior AE, not junior SDR',
        'Auto-book earliest available qualified slot',
        'Skip generic discovery; jump to tailored value review',
        'Provide warm context package: pages, assets, campaign, suggested question',
      ],
      expectedImpact:
        'Close Fast-Track deals in 7-14 days vs 30-45 days standard',
      targetMetric: 'Fast-Track cycle time',
      applicableTo: ['Business Development Manager', 'Senior Sales'],
    },
    {
      id: 'qual-003',
      category: 'qualification',
      title: 'Sales-Accepted Lead (SAL) Feedback Loop',
      description:
        'Reps accept or reject with reason codes that improve the model',
      implementation: [
        'MQL → SAL review with accept/reject decision required',
        'Reject reasons: consultant not buyer, student, wrong geo, no budget, no timeline',
        'Marketing reviews rejection patterns weekly',
        'Adjust scoring weights based on what actually converts',
        'Track SAL-to-SQL rate by rep to identify coaching opportunities',
      ],
      expectedImpact:
        'Continuously improve scoring model, reduce time wasted on bad leads',
      targetMetric: 'SAL acceptance rate, SAL-to-SQL conversion',
      applicableTo: ['Business Development', 'Marketing', 'Sales Operations'],
    },
  ];

  // ============================================================================
  // DEAL DESIGN & PROCUREMENT ACCELERATION
  // ============================================================================

  public static readonly DEAL_DESIGN_STRATEGIES: LeadNurturingStrategy[] = [
    {
      id: 'deal-001',
      category: 'deal-design',
      title: 'Procurement-Ready Kit',
      description:
        'Pre-solve legal, security, and procurement steps before they become blockers',
      implementation: [
        'Standard MSA with pre-approved fallback clauses',
        'Security & privacy FAQ addressing common concerns',
        'Data protection addendum (GDPR, CCPA compliant)',
        'Pricing guardrails and discount approval matrix',
        'One-page executive rationale (ROI, risk mitigation, time-to-value)',
        'Send kit BEFORE proposal so legal sees known baseline',
      ],
      expectedImpact: 'Reduce legal review time from 2-3 weeks to 3-5 days',
      targetMetric: 'Time in legal review',
      applicableTo: ['Sales', 'Business Development Manager'],
    },
    {
      id: 'deal-002',
      category: 'deal-design',
      title: 'Mutual Action Plan (MAP)',
      description:
        'Buyer-visible checklist with dates, owners, and dependencies',
      implementation: [
        'Business objective and success metrics defined upfront',
        'Stakeholder list with roles and responsibilities',
        'Milestones with dates: confirm stakeholders, pilot/test, success review, commercial path',
        'Lock kickoff date BEFORE proposal goes out',
        'Visible to buyer and internal team; review weekly',
        'MAP prevents "we\'ll see next week" syndrome',
      ],
      expectedImpact:
        "Deals don't slip; calendars reserved, commitments visible",
      targetMetric: 'On-time close rate',
      applicableTo: ['Sales', 'Account Management'],
    },
    {
      id: 'deal-003',
      category: 'deal-design',
      title: 'Tiered Packaging (Eliminate Bespoke Line Items)',
      description:
        'Clear bundles reduce committee approvals and accelerate decisions',
      implementation: [
        'Three tiers: Starter (small fleets), Professional (mid-market), Enterprise (custom)',
        'Transparent upgrade paths between tiers',
        'Minimize custom line items unless essential to value',
        'More customization = more committees = longer cycle',
        'For complex needs: paid pilot with scope and exit criteria',
      ],
      expectedImpact: 'Reduce approval layers, compress procurement cycle',
      targetMetric: 'Deal complexity score, time to approval',
      applicableTo: ['Sales', 'Product Marketing'],
    },
    {
      id: 'deal-004',
      category: 'deal-design',
      title: 'Objection Micro-Assets Library',
      description:
        'One-click access to proof points prevents "I\'ll get back to you" delays',
      implementation: [
        'Link assets directly from CRM opportunity records',
        'One-pagers: ROI calculator, security compliance, integration guide',
        'Short videos: product walkthrough, customer testimonial, implementation timeline',
        'Case studies by industry: trucking, freight forwarding, 3PL',
        'Reps use assets in the moment, not two days later',
      ],
      expectedImpact: 'Eliminate 2-day "getting materials" delays',
      targetMetric: 'Time to respond to objections',
      applicableTo: ['Sales', 'Business Development', 'Sales Enablement'],
    },
  ];

  // ============================================================================
  // SMART AUTOMATION PATTERNS
  // ============================================================================

  public static readonly AUTOMATION_STRATEGIES: LeadNurturingStrategy[] = [
    {
      id: 'auto-001',
      category: 'automation',
      title: 'Behavior-Based Nudges (Replace Manual Follow-Ups)',
      description:
        'Automate tasks when buyer signals intent; power steering, not autopilot',
      implementation: [
        'Proposal opened 2× + shared internally → create same-day call task with script',
        'Meeting booked → auto-send agenda + no-friction reschedule link',
        'Opportunity idle 48h → notify owner + manager with context',
        'Pricing page visit 3× → alert rep with "high-intent pricing signal"',
        'Demo no-show → auto-send recording + re-book link within 1 hour',
      ],
      expectedImpact: 'Respond to buyer signals in minutes, not days',
      targetMetric: 'Response time to buyer engagement',
      applicableTo: ['Sales Operations', 'Marketing Automation'],
    },
    {
      id: 'auto-002',
      category: 'automation',
      title: 'Idempotent & Observable Automations',
      description:
        "Workflows that don't double-fire and log every action for visibility",
      implementation: [
        'Design automations to be safe if run multiple times (no duplicate tasks)',
        'Log every action to timeline field: "Auto-routed to West AE • 10:32"',
        'If workflow fails, alert owner with error details',
        'Hub-and-spoke architecture: master router, SLA engine, notifications engine',
        'When you can name the engine, you can own the outcome',
      ],
      expectedImpact: 'Zero mystery bugs, full audit trail, faster debugging',
      targetMetric: 'Automation error rate',
      applicableTo: ['Sales Operations', 'RevOps', 'Systems Admin'],
    },
    {
      id: 'auto-003',
      category: 'automation',
      title: 'Short, High-Signal Cadences',
      description: 'First week should be crisp and relevant, not generic spam',
      implementation: [
        'Week 1 cadence: 2 calls, 1 voicemail, 2 emails, 1 LinkedIn touch',
        'Every message ties directly to buyer trigger (not "checking in")',
        'Personalize by: industry, service interest, recent behavior',
        'Longer sequences are fine AFTER establishing relevance',
        'Complex outreach ≠ fast relevance',
      ],
      expectedImpact: 'Higher response rate, shorter time to engagement',
      targetMetric: 'Cadence response rate',
      applicableTo: ['Business Development', 'Sales Development'],
    },
  ];

  // ============================================================================
  // FORECASTING & VELOCITY LOOPS
  // ============================================================================

  public static readonly FORECASTING_STRATEGIES: LeadNurturingStrategy[] = [
    {
      id: 'forecast-001',
      category: 'velocity',
      title: 'Daily 15-Minute Stand-Up on Movement',
      description: 'Inspect velocity daily; coach on time, not just totals',
      implementation: [
        'Review what moved yesterday and what closes in next 7 days',
        'Triage stuck deals: >25-50% over median time = stuck by definition',
        'Decide the unblock: message exec sponsor, add SE, send procurement kit',
        'Don\'t let "we\'ll see next week" become the plan',
        'Celebrate days removed, not just dollars closed',
      ],
      expectedImpact:
        'Cultural shift to "hunt for time"; weekly velocity improvement',
      targetMetric: 'Average deal velocity (days)',
      applicableTo: ['Sales Management', 'Business Development Manager'],
    },
    {
      id: 'forecast-002',
      category: 'velocity',
      title: 'Cohort Analysis for Process Changes',
      description: 'Track deals created same week; measure time to milestones',
      implementation: [
        'Group deals by week created; track median time to each stage',
        'Compare cohorts before/after process change',
        "If cohorts don't accelerate, the change didn't work",
        'Iterate weekly: pick one bottleneck, ship fix, measure next cohort',
        'Example: "Week 12 cohort closed 30% faster after new MAP template"',
      ],
      expectedImpact: 'Data-driven velocity improvements every sprint',
      targetMetric: 'Cohort cycle time trend',
      applicableTo: ['Sales Operations', 'RevOps'],
    },
    {
      id: 'forecast-003',
      category: 'velocity',
      title: 'Actionable Loss Reason Taxonomy',
      description:
        'Code losses with granularity; feed insights to marketing and product',
      implementation: [
        'No "other" category; require specific reason',
        'Categories: pricing, security concerns, feature gap, timing, competitor, legal',
        'Feed patterns monthly: "Security stalled 3 of last 10 opps → improve FAQ"',
        'Pre-record common objection responses (security walkthrough video)',
        'Teach reps to spot red flags before they become losses',
      ],
      expectedImpact:
        'Continuous improvement loop; fewer losses on same issues',
      targetMetric: 'Win rate by loss reason category',
      applicableTo: ['Sales', 'Product', 'Marketing'],
    },
  ];

  // ============================================================================
  // TRANSPORTATION & LOGISTICS SPECIFIC ADAPTATIONS
  // ============================================================================

  public static readonly TRANSPORTATION_SPECIFIC_STRATEGIES: LeadNurturingStrategy[] =
    [
      {
        id: 'trans-001',
        category: 'qualification',
        title: 'Fleet Size & Service Type Fast Qualification',
        description:
          'Quickly segment by fleet size and service needs for proper routing',
        implementation: [
          'Ask upfront: Fleet size (<10, 10-50, 50-200, 200+)',
          'Service interest: TMS, Dispatch, Compliance, Freight Brokerage, All-in-One',
          'Current pain: Route optimization, driver management, compliance, billing',
          'Timeline: Immediate need, 30 days, 90 days, exploring',
          'Route to specialist: Small fleet rep, mid-market, enterprise, freight forwarding',
        ],
        expectedImpact: 'Right conversation with right rep on first call',
        targetMetric: 'First call qualification accuracy',
        applicableTo: ['Business Development', 'Sales'],
      },
      {
        id: 'trans-002',
        category: 'deal-design',
        title: 'Compliance & Integration Pre-Solves',
        description:
          'Address common transportation compliance and ELD integration concerns upfront',
        implementation: [
          'Include in Procurement Kit: DOT compliance FAQ, FMCSA data security',
          'ELD integration one-pager: supported devices, API docs, migration timeline',
          'Insurance certificate automation: how we streamline COI management',
          'IFTA/IRP reporting: automated fuel tax and registration compliance',
          'Pre-schedule integration call with tech team if ELD/TMS integration needed',
        ],
        expectedImpact:
          'Eliminate "waiting on IT" delays, reduce integration concerns',
        targetMetric: 'Integration objection rate',
        applicableTo: ['Sales', 'Solutions Engineering'],
      },
      {
        id: 'trans-003',
        category: 'speed-to-lead',
        title: 'Urgent Compliance Deadline Fast-Track',
        description:
          'Identify and prioritize leads with immediate compliance or operational deadlines',
        implementation: [
          'Ask: "Do you have upcoming DOT audit, insurance renewal, or compliance deadline?"',
          'Urgent timeline (< 30 days) = Fast-Track with expedited onboarding',
          'Offer paid pilot with quick-start implementation (operational in 7 days)',
          'Provide compliance kit immediately: templates, checklists, training resources',
          'Assign dedicated implementation manager for urgent deals',
        ],
        expectedImpact: "Win urgent deals competitors can't accommodate",
        targetMetric: 'Urgent deal close rate',
        applicableTo: ['Business Development', 'Implementation'],
      },
    ];

  // ============================================================================
  // 7-DAY SPRINT IMPLEMENTATION PLAN
  // ============================================================================

  public static readonly SEVEN_DAY_SPRINT = {
    title: 'Your 7-Day Sprint to a 7-Day Close',
    description: 'Practical one-week sprint to unlock immediate velocity gains',
    days: [
      {
        day: 1,
        focus: 'Instrumentation',
        tasks: [
          'Add stage timers to CRM for every opportunity stage',
          'Define entry/exit criteria for each stage',
          'Build velocity board: time-to-first-touch, time-to-meeting, time-in-stage, proposal-to-close',
          'Start measuring cohorts from today for future comparison',
          'Set baseline metrics for current cycle times',
        ],
      },
      {
        day: 2,
        focus: 'CRM Friction Purge',
        tasks: [
          'Remove non-essential required fields from lead forms',
          'Enforce picklists for: industry, fleet size, service type, location',
          'Turn on duplicate detection and lead-to-account matching',
          'Create triage queue for unroutable records with visible SLA',
          'Set up alerts for routing failures',
        ],
      },
      {
        day: 3,
        focus: 'Speed-to-Lead Overhaul',
        tasks: [
          'Implement instant scheduling on thank-you pages',
          'Add call-me-now option during business hours',
          'Set up failover routing if first owner unavailable',
          'Implement 10-minute SLA for inbound demo requests',
          'Make SLA clock visible to reps and managers',
        ],
      },
      {
        day: 4,
        focus: 'MQL → SQL Fast-Track',
        tasks: [
          'Implement three-pillar scoring: FIT + BEHAVIOR + CONTEXT',
          'Launch Fast-Track lane auto-routing to senior reps',
          'Create short-form discovery path for qualified leads',
          'Add SAL accept/reject with reason codes',
          'Commit to weekly review of rejection patterns',
        ],
      },
      {
        day: 5,
        focus: 'Deal Design Kit',
        tasks: [
          'Assemble Procurement-Ready Kit: MSA, DPA, security FAQ, pricing guardrails',
          'Create Mutual Action Plan template',
          'Build objection micro-assets library with CRM links',
          'Train reps to share kit BEFORE proposal',
          'Set expectations: calendars and milestones locked early',
        ],
      },
      {
        day: 6,
        focus: 'Automation Tune-Up',
        tasks: [
          'Build behavior-based nudges: proposal opens, idle stages, no-shows',
          'Auto-send meeting agendas and reschedule links',
          'Log all workflow actions to timeline field for visibility',
          'Keep week-1 sequences short and context-rich',
          'Test all automations for idempotency (safe to run multiple times)',
        ],
      },
      {
        day: 7,
        focus: 'Cadence & Coaching',
        tasks: [
          'Start daily 15-minute stand-ups on deal movement',
          'Triage stuck deals by time thresholds (>25-50% over median)',
          'Choose one bottleneck to fix this week',
          'Measure and share velocity metrics with team',
          'Celebrate time removed, not just revenue',
        ],
      },
    ],
    expectedOutcome:
      'Feel the difference in 1 week. See it in metrics in 1 month. "Week to close" becomes your norm in 1 quarter.',
  };

  // ============================================================================
  // KEY STATISTICS & BENCHMARKS
  // ============================================================================

  public static readonly KEY_STATISTICS = {
    crmDataQuality: {
      stat: '85% of companies suffer from fragmented or low-quality CRM data',
      source: 'Gartner',
      impact: 'Leads to delays, miscommunication, and missed opportunities',
    },
    marketingSalesAlignment: {
      stat: '20% revenue boost from integrating marketing and sales data',
      source: 'McKinsey',
      impact:
        'Aligned teams close deals 48% faster and improve revenue efficiency by 32%',
    },
    salesAutomation: {
      stat: 'Up to 28% reduction in sales cycle time',
      source: 'Industry research',
      impact: 'When automation is applied correctly to eliminate wait times',
    },
    speedToLead: {
      stat: 'Responding within 5 minutes increases contact rate by 390%',
      source: 'Harvard Business Review',
      impact:
        'First minutes are when intent is hottest and calendar momentum easiest',
    },
    automationFailure: {
      stat: "Most automation fails because it doesn't reflect how teams actually work",
      source: 'Forbes',
      impact:
        'Causes reps to revert to manual methods, slowing process further',
    },
  };

  // ============================================================================
  // ADAPTIVE LEARNING INTEGRATION
  // ============================================================================

  /**
   * Get strategies applicable to specific AI staff role
   */
  public static getStrategiesForRole(role: string): LeadNurturingStrategy[] {
    const allStrategies = [
      ...this.CRM_BEST_PRACTICES,
      ...this.SPEED_TO_LEAD_STRATEGIES,
      ...this.QUALIFICATION_STRATEGIES,
      ...this.DEAL_DESIGN_STRATEGIES,
      ...this.AUTOMATION_STRATEGIES,
      ...this.FORECASTING_STRATEGIES,
      ...this.TRANSPORTATION_SPECIFIC_STRATEGIES,
    ];

    return allStrategies.filter((strategy) =>
      strategy.applicableTo.some((applicable) =>
        role.toLowerCase().includes(applicable.toLowerCase())
      )
    );
  }

  /**
   * Get strategy by category for focused learning
   */
  public static getStrategiesByCategory(
    category: LeadNurturingStrategy['category']
  ): LeadNurturingStrategy[] {
    const allStrategies = [
      ...this.CRM_BEST_PRACTICES,
      ...this.SPEED_TO_LEAD_STRATEGIES,
      ...this.QUALIFICATION_STRATEGIES,
      ...this.DEAL_DESIGN_STRATEGIES,
      ...this.AUTOMATION_STRATEGIES,
      ...this.FORECASTING_STRATEGIES,
      ...this.TRANSPORTATION_SPECIFIC_STRATEGIES,
    ];

    return allStrategies.filter((strategy) => strategy.category === category);
  }

  /**
   * Get velocity improvement recommendations based on current metrics
   */
  public static getVelocityRecommendations(
    currentMetrics: Partial<DealVelocityMetrics>
  ): LeadNurturingStrategy[] {
    const recommendations: LeadNurturingStrategy[] = [];

    // Time to first touch is slow
    if (
      currentMetrics.timeToFirstTouch &&
      currentMetrics.timeToFirstTouch > 10
    ) {
      recommendations.push(
        ...this.SPEED_TO_LEAD_STRATEGIES.filter(
          (s) => s.id === 'stl-001' || s.id === 'stl-002'
        )
      );
    }

    // Time to meeting is slow
    if (currentMetrics.timeToMeeting && currentMetrics.timeToMeeting > 48) {
      recommendations.push(
        ...this.SPEED_TO_LEAD_STRATEGIES.filter(
          (s) => s.id === 'stl-001' || s.id === 'stl-003'
        )
      );
    }

    // Long time in stage
    if (currentMetrics.timeInStage && currentMetrics.timeInStage > 7) {
      recommendations.push(
        ...this.FORECASTING_STRATEGIES,
        ...this.AUTOMATION_STRATEGIES
      );
    }

    // Long proposal to close
    if (currentMetrics.proposalToClose && currentMetrics.proposalToClose > 14) {
      recommendations.push(
        ...this.DEAL_DESIGN_STRATEGIES.filter(
          (s) => s.id === 'deal-001' || s.id === 'deal-002'
        )
      );
    }

    // Overall cycle too long
    if (
      currentMetrics.overallCycleLength &&
      currentMetrics.overallCycleLength > 30
    ) {
      recommendations.push(
        ...this.getStrategiesByCategory('velocity'),
        ...this.QUALIFICATION_STRATEGIES.filter((s) => s.id === 'qual-002')
      );
    }

    return recommendations;
  }

  /**
   * Generate learning context for AI staff based on interaction scenario
   */
  public static getContextualGuidance(scenario: {
    leadSource?: string;
    fleetSize?: string;
    urgency?: string;
    serviceInterest?: string;
  }): {
    suggestedStrategies: LeadNurturingStrategy[];
    talkingPoints: string[];
    expectedOutcome: string;
  } {
    const suggestedStrategies: LeadNurturingStrategy[] = [];
    const talkingPoints: string[] = [];
    let expectedOutcome = '';

    // High urgency leads
    if (scenario.urgency === 'high' || scenario.urgency === 'immediate') {
      suggestedStrategies.push(
        ...this.TRANSPORTATION_SPECIFIC_STRATEGIES.filter(
          (s) => s.id === 'trans-003'
        )
      );
      talkingPoints.push(
        'Ask about upcoming deadlines: DOT audit, insurance renewal, compliance requirements',
        'Offer expedited onboarding and quick-start implementation',
        'Mention 7-day operational readiness for urgent situations'
      );
      expectedOutcome = 'Fast-track deal with compressed cycle (7-14 days)';
    }

    // Pricing page visitors
    if (scenario.leadSource === 'pricing_page') {
      suggestedStrategies.push(
        ...this.SPEED_TO_LEAD_STRATEGIES.filter((s) => s.id === 'stl-003')
      );
      talkingPoints.push(
        'Lead is price-conscious; start with ROI and value conversation',
        'Reference their pricing page visit naturally',
        'Share relevant case study with ROI metrics'
      );
      expectedOutcome = 'Price-focused conversation leading to value alignment';
    }

    // Large fleet sizes (enterprise)
    if (scenario.fleetSize && parseInt(scenario.fleetSize) > 50) {
      suggestedStrategies.push(
        ...this.QUALIFICATION_STRATEGIES.filter((s) => s.id === 'qual-002'),
        ...this.DEAL_DESIGN_STRATEGIES.filter((s) => s.id === 'deal-001')
      );
      talkingPoints.push(
        'Identify multiple stakeholders early',
        'Propose Mutual Action Plan to navigate enterprise process',
        'Offer procurement-ready kit to accelerate legal/security review'
      );
      expectedOutcome =
        'Enterprise deal with MAP and procurement kit (21-45 day cycle)';
    }

    // Small fleets (fast-track potential)
    if (scenario.fleetSize && parseInt(scenario.fleetSize) < 10) {
      suggestedStrategies.push(
        ...this.QUALIFICATION_STRATEGIES.filter((s) => s.id === 'qual-002')
      );
      talkingPoints.push(
        'Small fleet = faster decision cycle; emphasize quick implementation',
        'Offer Starter tier with transparent pricing',
        'Share relevant small fleet success story'
      );
      expectedOutcome = 'Fast-track deal with simplified process (7-14 days)';
    }

    return {
      suggestedStrategies,
      talkingPoints,
      expectedOutcome,
    };
  }
}

// Export singleton instance
export const leadNurtureMastery = LeadNurtureMasteryKnowledgeBase;
export default leadNurtureMastery;


