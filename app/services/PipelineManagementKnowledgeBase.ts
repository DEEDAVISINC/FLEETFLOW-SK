/**
 * PIPELINE MANAGEMENT & FORECASTING KNOWLEDGE BASE
 *
 * Based on Mark Kosoglow's legendary framework that scaled Outreach from $0-250M+
 * Adapted for FleetFlow's transportation & logistics sales operations
 *
 * This knowledge base teaches AI staff:
 * - 5-stage sales process with clear exit criteria
 * - Deal review methodology that saves at-risk opportunities
 * - 3-step forecasting process that prevents missed quotas
 * - Risk assessment frameworks for accurate pipeline health
 * - Gap-closing strategies to make up forecast shortfalls
 *
 * Source: Mark Kosoglow's Sales Management Operating System
 * https://docs.google.com/document/d/1tGfQu8v1-7P--TOU2BRKuOWvUZ5B1IAbQnPwQaa-RPY
 */

export interface SalesStage {
  id: string;
  stageNumber: 1 | 2 | 3 | 4 | 5;
  stageName: string;
  seminalQuestion: string;
  exitCriteria: string[];
  peopleInvolved: string[];
  tools: string[];
  riskCriteria: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
  };
}

export interface DealReviewItem {
  account: string;
  expectedARR: number;
  closeDate: Date;
  stage: string;
  stageExitCriteriaMet: boolean;
  forecastCategory:
    | 'Commit (Lock)'
    | 'Best Case (Win)'
    | 'Best Case (Push)'
    | 'Best Case (Lose)';
  risk: '🟢' | '🟡' | '🟠' | '🛑';
  notesAndNextSteps: string;
}

export interface ForecastCalculation {
  commitLock: number;
  bestCaseWin: number;
  averageCreateAndClose: number;
  totalForecast: number;
  goal: number;
  gap: number;
  gapClosingStrategies: string[];
}

export interface RiskAssessment {
  riskLevel: '🛑' | '🟠' | '🟡' | '🟢';
  riskCategory:
    | 'Best Case (Lose)'
    | 'Best Case (Push)'
    | 'Best Case (Win)'
    | 'Commit (Lock)';
  inForecast: boolean;
  reasoning: string;
  mitigationStrategies: string[];
}

export class PipelineManagementKnowledgeBase {
  // ============================================================================
  // MARK KOSOGLOW'S 5-STAGE SALES PROCESS
  // ============================================================================

  /**
   * The exact 5-stage process used to scale Outreach from $0-250M+
   * Adapted for transportation & logistics context
   */
  public static readonly FIVE_STAGE_PROCESS: SalesStage[] = [
    {
      id: 'stage-1',
      stageNumber: 1,
      stageName: 'Problem Agreement',
      seminalQuestion: 'Do they have a problem we can solve?',
      exitCriteria: [
        '2-3 business initiatives identified (not just problems or projects)',
        'Understand the org structure (321: 3 peers, 2 managers, 1 executive)',
        'Confirmed pain points related to current operations',
        'Identified decision-making process',
      ],
      peopleInvolved: ['Director, Sales', 'Business Development Rep'],
      tools: [
        'Discovery Call with structured questions',
        'Problem Hypothesis (what we think their issues are)',
        'Audits / Comparisons (current state vs ideal state)',
        'Demo showing Before vs After scenarios',
      ],
      riskCriteria: {
        green:
          '🟢 Initiative - They have clear business initiatives tied to company goals',
        yellow:
          '🟡 Problem - They acknowledge problems but no formal initiatives',
        orange: '🟠 Pain - Some pain mentioned but not prioritized',
        red: '🛑 No Pain - No real problem identified or acknowledged',
      },
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      stageName: 'Priority Agreement',
      seminalQuestion: 'Are the problems big enough to prioritize solving?',
      exitCriteria: [
        'Quantified business initiatives with metrics ($, time, efficiency)',
        'Implementation date or timeline established',
        'Budget implications understood',
        'Project prioritization confirmed (top 3 initiatives)',
      ],
      peopleInvolved: [
        'Director, Sales',
        'VP Operations or higher (decision maker with budget)',
      ],
      tools: [
        'Value engineering session (ROI calculator)',
        'Super detailed demos showing before vs after workflows',
        'Workflow interviews / reverse demos (they show us their process)',
        'Case study from similar company/fleet size',
      ],
      riskCriteria: {
        green:
          '🟢 Massive Metrics - Clear, quantified impact with executive sponsorship',
        yellow:
          '🟡 Clear Metrics - Quantified but not tied to strategic initiatives',
        orange: '🟠 Not Meaningful - Metrics exist but impact is marginal',
        red: '🛑 No Metrics - Cannot quantify the value or impact',
      },
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      stageName: 'Evaluation Agreement',
      seminalQuestion: 'Will they agree on how to buy?',
      exitCriteria: [
        'Mutual Action Plan (MAP) in place with dates and owners',
        'Required capabilities documented and agreed upon',
        'Evaluation criteria defined (what constitutes success)',
        'Stakeholder alignment confirmed (all decision-makers identified)',
        'Competitive landscape understood',
      ],
      peopleInvolved: [
        'Director, Sales',
        'CRO / VP Sales',
        'Champion identified',
      ],
      tools: [
        'Champion 1:1 meetings (build internal advocate)',
        'Executive meetings (align with C-level on strategy)',
        'Case studies (proof points for decision committee)',
        'Mutual Action Plan template',
      ],
      riskCriteria: {
        green:
          '🟢 Influence Eval Criteria - We helped define how they evaluate solutions',
        yellow:
          "🟡 Clear Eval Criteria - They have criteria but we didn't influence it",
        orange: '🟠 Minimal Eval Criteria - Vague criteria or not formalized',
        red: "🛑 No Eval Criteria - No clear process for how they'll decide",
      },
    },
    {
      id: 'stage-4',
      stageNumber: 4,
      stageName: 'Value Agreement',
      seminalQuestion: 'Is this solution worth putting money into?',
      exitCriteria: [
        'Approved proposal above the line (recommended by champion/team)',
        'Passed procurement and security review',
        'Budget allocated or identified',
        'ROI/business case accepted by finance',
        'Technical validation complete',
      ],
      peopleInvolved: [
        'Director, Sales',
        'CRO / VP Sales',
        'IT / Technical Evaluators',
        'Finance / Procurement',
      ],
      tools: [
        'Super detailed demos (show exact workflows)',
        'Pilots & Trials (let them test before buying)',
        'Business cases / ROI studies (financial justification)',
        'Reference calls with similar customers',
      ],
      riskCriteria: {
        green:
          "🟢 Big ROI + Exclusive - Clear ROI and we're the only solution being considered",
        yellow:
          '🟡 Big ROI - Strong ROI but competitive evaluation in progress',
        orange: '🟠 Some ROI - Marginal ROI or unclear financial impact',
        red: '🛑 No ROI - Cannot demonstrate clear financial return',
      },
    },
    {
      id: 'stage-5',
      stageNumber: 5,
      stageName: 'Commercial Agreement',
      seminalQuestion: 'Are you gonna buy this thing?',
      exitCriteria: [
        'Executed contract (signed by all parties)',
        'Notes to post-sales team (handoff documentation)',
        'Payment terms agreed',
        'Implementation kickoff scheduled',
        'Success criteria defined for onboarding',
      ],
      peopleInvolved: [
        'Director, Sales',
        'CRO / VP Sales',
        'IT / Finance',
        'Legal (both sides)',
        'Implementation Team',
      ],
      tools: [
        'Proposal (formal quote/contract)',
        'Post-sales people (smooth handoff)',
        'Discounts & negotiation (close any gaps)',
        'DocuSign or contract management system',
      ],
      riskCriteria: {
        green: "🟢 They're Driving - Customer is pushing to get deal done",
        yellow: "🟡 We're Driving - We're managing timeline and follow-ups",
        orange: '🟠 Falling Behind - Timeline slipping, losing momentum',
        red: '🛑 Nothing Started - No movement toward contract execution',
      },
    },
  ];

  // ============================================================================
  // DEAL REVIEW METHODOLOGY (3 STEPS)
  // ============================================================================

  /**
   * Step 1: Verify Deal Data
   * Confirm the basics out loud to ensure accuracy
   */
  public static verifyDealData(deal: {
    account: string;
    arr: number;
    stage: string;
    priorStagesExitCriteriaMet: boolean;
  }): string {
    return `You've got a $${(deal.arr / 1000).toFixed(0)}k opportunity with ${deal.account} in ${deal.stage} (Stage ${this.getStageNumber(deal.stage)}), with ${deal.priorStagesExitCriteriaMet ? 'prior stages exit criteria met' : 'INCOMPLETE prior stage exit criteria'}. Is that correct?`;
  }

  /**
   * Step 2: Assess Forecast Risk
   * Poke holes in three critical areas
   */
  public static assessForecastRisk(deal: {
    account: string;
    arr: number;
    closeDate: Date;
    stage: string;
    exitCriteria: { met: boolean; description: string }[];
    currentRisk: string;
  }): {
    opportunityDetailsRisk: string[];
    exitCriteriaRisk: string[];
    riskAssessmentAccuracy: string[];
    overallRisk: '🟢' | '🟡' | '🟠' | '🛑';
  } {
    const risks = {
      opportunityDetailsRisk: [] as string[],
      exitCriteriaRisk: [] as string[],
      riskAssessmentAccuracy: [] as string[],
      overallRisk: '🟢' as '🟢' | '🟡' | '🟠' | '🛑',
    };

    // Check opportunity details
    const daysToClose = Math.ceil(
      (deal.closeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (deal.arr > 100000 && daysToClose < 30) {
      risks.opportunityDetailsRisk.push(
        'Large deal ($100k+) with unusually short timeline (<30 days) - verify urgency is real'
      );
      risks.overallRisk = '🟡';
    }

    // Check exit criteria
    const unmetCriteria = deal.exitCriteria.filter((c) => !c.met);
    if (unmetCriteria.length > 0) {
      risks.exitCriteriaRisk.push(
        `${unmetCriteria.length} exit criteria not met: ${unmetCriteria.map((c) => c.description).join(', ')}`
      );
      risks.overallRisk = '🟠';
    }

    // Check risk assessment accuracy
    if (deal.currentRisk === '🟢' && unmetCriteria.length > 1) {
      risks.riskAssessmentAccuracy.push(
        'Deal marked Green but multiple exit criteria unmet - risk underestimated'
      );
      risks.overallRisk = '🟠';
    }

    return risks;
  }

  /**
   * Step 3: Plan Next Steps
   * Define clear exit criteria needed and confirm meeting set
   */
  public static planNextSteps(deal: {
    stage: string;
    exitCriteria: { met: boolean; description: string }[];
  }): {
    nextExitCriteriaNeeded: string[];
    requiredMeetingType: string;
    stakeholdersNeeded: string[];
    timeframe: string;
  } {
    const stage = this.FIVE_STAGE_PROCESS.find(
      (s) => s.stageName === deal.stage
    );
    const unmetCriteria = deal.exitCriteria.filter((c) => !c.met);

    return {
      nextExitCriteriaNeeded:
        unmetCriteria.length > 0
          ? unmetCriteria.map((c) => c.description)
          : stage
            ? [
                `Advance to ${this.FIVE_STAGE_PROCESS[stage.stageNumber]?.stageName || 'next stage'}`,
              ]
            : ['Define next steps'],
      requiredMeetingType: stage?.tools[0] || 'Discovery Call',
      stakeholdersNeeded: stage?.peopleInvolved || ['Decision Maker'],
      timeframe: unmetCriteria.length > 2 ? '1-2 weeks' : '3-5 days',
    };
  }

  // ============================================================================
  // 3-STEP FORECASTING PROCESS
  // ============================================================================

  /**
   * Step 1: Categorize deals by risk
   * Determine which deals are "in play" for forecast
   */
  public static categorizeDealRisk(deal: {
    hasTimeline: boolean;
    hasBusinessInitiative: boolean;
    stage: string;
    exitCriteriaMet: number;
    totalExitCriteria: number;
    daysToClose: number;
  }): RiskAssessment {
    // Must have timeline + business initiative to be in play
    if (!deal.hasTimeline || !deal.hasBusinessInitiative) {
      return {
        riskLevel: '🛑',
        riskCategory: 'Best Case (Lose)',
        inForecast: false,
        reasoning:
          'No timeline or business initiative - not in play for forecast',
        mitigationStrategies: [
          'Uncover business initiative through discovery',
          'Establish timeline by identifying trigger events',
          'Build urgency through value engineering',
        ],
      };
    }

    // Calculate exit criteria completion rate
    const completionRate = deal.exitCriteriaMet / deal.totalExitCriteria;

    // Green: Commit (Lock) - Little to no risk remaining
    if (completionRate >= 0.9 && deal.daysToClose <= 14) {
      return {
        riskLevel: '🟢',
        riskCategory: 'Commit (Lock)',
        inForecast: true,
        reasoning:
          '90%+ exit criteria met, close date within 2 weeks - deal has minimal risk',
        mitigationStrategies: [
          'Confirm final signatures',
          'Schedule implementation kickoff',
        ],
      };
    }

    // Yellow: Best Case (Win) - Has risk you can overcome
    if (completionRate >= 0.7) {
      return {
        riskLevel: '🟡',
        riskCategory: 'Best Case (Win)',
        inForecast: true,
        reasoning: '70%+ criteria met - manageable risk that can be overcome',
        mitigationStrategies: [
          'Complete remaining exit criteria',
          'Build champion support',
          'Accelerate decision timeline',
        ],
      };
    }

    // Orange: Best Case (Push) - Deal likely to push if risk not mitigated
    if (completionRate >= 0.5) {
      return {
        riskLevel: '🟠',
        riskCategory: 'Best Case (Push)',
        inForecast: false,
        reasoning: '50-70% criteria met - high risk of timeline slippage',
        mitigationStrategies: [
          'Identify and remove blockers',
          'Engage executive sponsors',
          'Consider splitting into phased approach',
        ],
      };
    }

    // Red: Best Case (Lose) - Deal is lost if you can't overcome risk
    return {
      riskLevel: '🛑',
      riskCategory: 'Best Case (Lose)',
      inForecast: false,
      reasoning: '<50% criteria met - deal at risk of being lost',
      mitigationStrategies: [
        'Run creative plays (executive involvement)',
        'Reassess fit and timeline',
        'Consider pilot or smaller scope',
        'Disqualify if no path forward',
      ],
    };
  }

  /**
   * Step 2: Build forecast using the 3-component formula
   */
  public static calculateForecast(pipeline: {
    commitLockDeals: number[];
    bestCaseWinDeals: number[];
    historicalCreateAndCloseAverage: number;
  }): ForecastCalculation & { components: Record<string, number> } {
    const commitLock = pipeline.commitLockDeals.reduce(
      (sum, arr) => sum + arr,
      0
    );
    const bestCaseWin = pipeline.bestCaseWinDeals.reduce(
      (sum, arr) => sum + arr,
      0
    );
    const averageCreateAndClose = pipeline.historicalCreateAndCloseAverage;

    return {
      commitLock,
      bestCaseWin,
      averageCreateAndClose,
      totalForecast: commitLock + bestCaseWin + averageCreateAndClose,
      goal: 0, // Set externally
      gap: 0, // Calculated after goal is set
      gapClosingStrategies: [],
      components: {
        '🟢 Commit (Lock)': commitLock,
        '🟡 Best Case (Win)': bestCaseWin,
        '📊 Average Create & Close': averageCreateAndClose,
      },
    };
  }

  /**
   * Step 3: Build plan to close the gap
   * Gap = Goal - Forecast
   */
  public static buildGapClosingPlan(
    forecast: number,
    goal: number,
    pipeline: {
      bestCasePushDeals: { account: string; arr: number }[];
      bestCaseLoseDeals: { account: string; arr: number }[];
      earlyStageDeals: { account: string; arr: number }[];
      nextQuarterDeals: { account: string; arr: number }[];
    }
  ): {
    gap: number;
    gapPercentage: number;
    strategies: Array<{
      source: string;
      description: string;
      potentialValue: number;
      priority: number;
      tactics: string[];
    }>;
    totalRecoverablePipeline: number;
  } {
    const gap = goal - forecast;
    const gapPercentage = (gap / goal) * 100;

    const strategies = [
      {
        source: '🛑 Best Case (Lose) Deals',
        description: 'Run creative plays to turn these deals around',
        potentialValue: pipeline.bestCaseLoseDeals.reduce(
          (sum, d) => sum + d.arr,
          0
        ),
        priority: 1,
        tactics: [
          'Get executives involved (CEO/CRO call with prospect executive)',
          'Offer pilot or proof-of-concept to reduce risk',
          'Bring in customer reference for peer validation',
          'Address specific objections with subject matter experts',
        ],
      },
      {
        source: '🟠 Best Case (Push) Deals',
        description: 'Mitigate risks to prevent timeline slippage',
        potentialValue: pipeline.bestCasePushDeals.reduce(
          (sum, d) => sum + d.arr,
          0
        ),
        priority: 2,
        tactics: [
          'Remove blockers (legal, security, procurement)',
          'Build urgency through business value/cost of delay',
          'Engage champion to drive internal momentum',
          'Simplify scope if needed to accelerate',
        ],
      },
      {
        source: '📊 Pipeline from This Quarter',
        description: 'Accelerate early stage deals into forecast',
        potentialValue: pipeline.earlyStageDeals.reduce(
          (sum, d) => sum + d.arr,
          0
        ),
        priority: 3,
        tactics: [
          'Find business initiatives tied to strategic goals',
          'Identify timeline drivers (compliance deadlines, contract expirations)',
          'Quantify ROI to build urgency',
          'Fast-track through stages with condensed discovery',
        ],
      },
      {
        source: '➡️ Pull-in from Future Quarters',
        description: 'Accelerate deals slated for next quarter',
        potentialValue: pipeline.nextQuarterDeals.reduce(
          (sum, d) => sum + d.arr,
          0
        ),
        priority: 4,
        tactics: [
          'Offer incentive for earlier commitment (discount, priority implementation)',
          'Highlight cost of waiting (price increase, competitive risk)',
          'Connect earlier close to their business timeline',
          'Provide additional value for accelerated decision',
        ],
      },
      {
        source: '📞 More Create & Close',
        description: 'Generate new deals that close in-quarter',
        potentialValue: gap * 0.3, // Estimate 30% of gap from new create+close
        priority: 5,
        tactics: [
          'Target warm inbound leads with high intent signals',
          "Reach out to past opportunities that didn't close",
          'Leverage customer referrals for warm introductions',
          'Focus on fast-close segments (small fleets, urgent compliance)',
        ],
      },
    ];

    return {
      gap,
      gapPercentage,
      strategies,
      totalRecoverablePipeline: strategies.reduce(
        (sum, s) => sum + s.potentialValue,
        0
      ),
    };
  }

  // ============================================================================
  // TRANSPORTATION & LOGISTICS ADAPTATIONS
  // ============================================================================

  /**
   * Transportation-specific exit criteria additions
   */
  public static readonly TRANSPORTATION_EXIT_CRITERIA = {
    stage1_problemAgreement: [
      'Identified current dispatch/TMS pain points (manual processes, inefficiency)',
      'Understood fleet size and growth plans',
      'Confirmed compliance challenges (DOT, ELD, IFTA)',
      'Mapped current technology stack and gaps',
    ],
    stage2_priorityAgreement: [
      'Quantified cost of current inefficiencies ($/month lost to manual work)',
      'Calculated time savings from automation (hours/week)',
      'Established ROI timeline (payback period)',
      'Confirmed budget availability and fiscal calendar',
    ],
    stage3_evaluationAgreement: [
      'MAP includes: Operations Manager, CFO, IT contact',
      'Integration requirements documented (ELD, accounting system)',
      'Data migration plan agreed upon',
      'Training and onboarding timeline defined',
    ],
    stage4_valueAgreement: [
      'Pilot successful or ROI calculator approved',
      'IT security and compliance review complete',
      'Pricing approved by finance',
      'Implementation resources confirmed',
    ],
    stage5_commercialAgreement: [
      'Contract signed by authorized signatory',
      'Payment method and terms confirmed',
      'Implementation kickoff scheduled',
      'Success metrics defined (KPIs for first 90 days)',
    ],
  };

  /**
   * Transportation-specific risk indicators
   */
  public static readonly TRANSPORTATION_RISK_INDICATORS = {
    greenFlags: [
      'Active compliance deadline (DOT audit, insurance renewal)',
      'Recent growth (new drivers, routes, or equipment)',
      'Technology modernization budget allocated',
      'Executive sponsor identified and engaged',
      'Competitor using modern TMS (competitive pressure)',
    ],
    yellowFlags: [
      'Budget cycle timing unclear',
      'Multiple decision-makers not aligned',
      'IT integration concerns raised',
      'Evaluating multiple vendors',
      'Implementation timing concerns',
    ],
    redFlags: [
      'No clear decision maker or budget owner',
      'Recent technology investment (competing priority)',
      'Resistance to change from operations team',
      'Unrealistic implementation timeline expectations',
      'Unable to quantify ROI or business value',
    ],
  };

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private static getStageNumber(stageName: string): number {
    const stage = this.FIVE_STAGE_PROCESS.find(
      (s) => s.stageName.toLowerCase() === stageName.toLowerCase()
    );
    return stage?.stageNumber || 0;
  }

  /**
   * Get stage details by number or name
   */
  public static getStageDetails(
    identifier: number | string
  ): SalesStage | undefined {
    if (typeof identifier === 'number') {
      return this.FIVE_STAGE_PROCESS.find((s) => s.stageNumber === identifier);
    }
    return this.FIVE_STAGE_PROCESS.find(
      (s) => s.stageName.toLowerCase() === identifier.toLowerCase()
    );
  }

  /**
   * Check if deal is in play for forecast
   */
  public static isDealInPlay(deal: {
    hasTimeline: boolean;
    hasBusinessInitiative: boolean;
  }): boolean {
    return deal.hasTimeline && deal.hasBusinessInitiative;
  }

  /**
   * Calculate coverage ratio (pipeline value / quota)
   */
  public static calculateCoverageRatio(
    pipelineValue: number,
    quota: number
  ): {
    ratio: number;
    health: 'Critical' | 'Weak' | 'Adequate' | 'Strong' | 'Excellent';
    recommendation: string;
  } {
    const ratio = pipelineValue / quota;

    let health: 'Critical' | 'Weak' | 'Adequate' | 'Strong' | 'Excellent';
    let recommendation: string;

    if (ratio < 2) {
      health = 'Critical';
      recommendation =
        'Immediate pipeline generation needed - risk of missing quota';
    } else if (ratio < 3) {
      health = 'Weak';
      recommendation = 'Increase prospecting activity - below healthy coverage';
    } else if (ratio < 4) {
      health = 'Adequate';
      recommendation = 'Maintain current activity - acceptable coverage';
    } else if (ratio < 5) {
      health = 'Strong';
      recommendation = 'Good pipeline health - stay consistent';
    } else {
      health = 'Excellent';
      recommendation =
        'Excellent coverage - focus on deal quality and velocity';
    }

    return { ratio, health, recommendation };
  }

  /**
   * Generate deal review talking points
   */
  public static generateDealReviewScript(deal: DealReviewItem): string[] {
    const script = [];

    // Step 1: Verify data
    script.push(
      `**Verify Data:** "${deal.account} - $${(deal.expectedARR / 1000).toFixed(0)}k ARR, closing ${deal.closeDate.toLocaleDateString()}, currently in ${deal.stage}. Prior exit criteria ${deal.stageExitCriteriaMet ? 'MET' : 'NOT MET'}. Confirm?"`
    );

    // Step 2: Assess risk
    if (!deal.stageExitCriteriaMet) {
      script.push(
        `**Exit Criteria Gap:** This deal is in ${deal.stage} but hasn't completed prior stage exit criteria. What's missing and how do we get it?`
      );
    }

    if (deal.risk === '🛑' || deal.risk === '🟠') {
      script.push(
        `**Risk Assessment:** Deal is marked ${deal.risk}. Walk me through the specific risks and what we're doing to mitigate them.`
      );
    }

    if (
      deal.forecastCategory.includes('Push') ||
      deal.forecastCategory.includes('Lose')
    ) {
      script.push(
        `**Forecast Category:** Currently ${deal.forecastCategory}. What creative plays can we run to improve this?`
      );
    }

    // Step 3: Next steps
    script.push(
      `**Next Steps:** What's the next exit criteria we need, and do you have a meeting scheduled to achieve it?`
    );

    return script;
  }
}

// Export singleton
export const pipelineManagement = PipelineManagementKnowledgeBase;
export default pipelineManagement;

