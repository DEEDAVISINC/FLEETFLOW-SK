'use client';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  timing: string;
  purpose: string;
  content: {
    greeting: string;
    opening: string;
    problem: string;
    solution: string;
    proof: string;
    callToAction: string;
    closing: string;
  };
  personalization: string[];
  expectedMetrics: {
    openRate: string;
    clickRate: string;
    replyRate: string;
  };
}

export const desperateShipperEmailTemplates: EmailTemplate[] = [
  // EMAIL 1: Crisis Alert (Day 1 - Immediate Blast)
  {
    id: 'crisis_alert_email_1',
    name: 'Crisis Alert Email #1',
    subject:
      '🚨 URGENT: We Detected Your Carrier Insurance Crisis - Immediate Solutions Available',
    category: 'crisis_alert',
    timing: 'Day 1 - Immediate',
    purpose:
      'Alert shippers to carrier crisis and position as immediate solution',
    content: {
      greeting: 'Dear [Company Name] Leadership Team,',
      opening: `We noticed a critical situation with your transportation partner that requires immediate attention.`,
      problem: `Our FMCSA monitoring system has detected that one of your key carriers has insurance expiring within the next 30 days. This puts your entire shipping operation at risk:

• **Carrier could lose operating authority**
• **Deliveries may be delayed or cancelled**
• **Compliance violations could trigger fines**
• **Customer satisfaction could plummet**
• **Your supply chain could be disrupted**`,
      solution: `We have immediate capacity available and can seamlessly replace your at-risk carrier:

✅ **Fully insured, DOT-compliant carriers**
✅ **Same-day capacity availability**
✅ **Competitive rates (potentially lower than current)**
✅ **Guaranteed on-time delivery**
✅ **24/7 dedicated support team**`,
      proof: `We've helped 150+ companies just like yours navigate similar carrier crises in the past 90 days, with 94% successfully avoiding any service disruptions.`,
      callToAction: `Let's schedule a brief 15-minute call this week to discuss your specific situation and how we can ensure uninterrupted service.

[Book Meeting Button] - Available slots: Today, Tomorrow, or Wednesday`,
      closing: `Best regards,
Cliff - Crisis Response Specialist
DEPOINTE/Freight 1st Direct
📞 555-0101 | 📧 cliff@depointe.com
P.S. Carrier insurance crises don't wait - let's address this before it becomes an emergency.`,
    },
    personalization: [
      'Company name and specific carrier details',
      'Industry-specific pain points',
      'Local market conditions',
      'Specific compliance risks',
    ],
    expectedMetrics: {
      openRate: '65%+ (crisis relevance)',
      clickRate: '25%+ (immediate need)',
      replyRate: '15%+ (urgency drives response)',
    },
  },

  // EMAIL 2: Problem Deep Dive (Day 2 - Sequence #1)
  {
    id: 'problem_deep_dive_email_2',
    name: 'Problem Deep Dive Email #2',
    subject:
      'The Hidden Dangers of Carrier Insurance Lapses - Your Risk Assessment',
    category: 'education',
    timing: 'Day 2 - Sequence #1',
    purpose: 'Educate on specific risks and build credibility',
    content: {
      greeting: 'Hello [Decision Maker Name],',
      opening: `Following up on our alert about your carrier's expiring insurance - I wanted to provide more detail about the specific risks you're facing.`,
      problem: `Based on our analysis of [Specific Carrier Name]'s FMCSA record, here are the immediate risks:

🔴 **Insurance Lapse Risk**: Expires [Specific Date] - carrier loses authority
🔴 **Service Disruption**: Could affect [X]% of your shipments
🔴 **Financial Impact**: Potential $50K+ in delays and expedited shipping costs
🔴 **Compliance Fines**: DOT violations could cost $10K-$25K per incident
🔴 **Customer Impact**: [Y] customers could experience delivery delays

This isn't just a paperwork issue - it's a business continuity crisis.`,
      solution: `Our crisis response team specializes in these exact situations:

🎯 **Immediate Assessment**: Free analysis of your carrier dependencies
🎯 **Capacity Backup**: Pre-qualified carriers ready to deploy
🎯 **Rate Protection**: Locked-in rates during transition period
🎯 **Compliance Assurance**: Full DOT/SAFETY certification guarantee
🎯 **Dedicated Support**: Single point of contact throughout transition`,
      proof: `Last month, we helped [Similar Company] in [Industry] avoid a complete shipping shutdown when their primary carrier lost insurance. They saved $75K in potential costs and maintained 100% service levels.`,
      callToAction: `I'd like to provide you with a personalized risk assessment for your operation.

[Download Risk Assessment PDF] - Includes your specific carrier analysis
[Schedule Free Consultation] - 15 minutes, no obligation`,
      closing: `Thank you for your attention to this critical matter.

Best regards,
Cliff - Compliance & Crisis Specialist
DEPOINTE/Freight 1st Direct
📞 555-0101 | 📧 cliff@depointe.com`,
    },
    personalization: [
      'Specific carrier name and expiration date',
      'Percentage of shipments affected',
      'Industry-specific examples',
      'Local market conditions',
    ],
    expectedMetrics: {
      openRate: '55%+ (follow-up relevance)',
      clickRate: '18%+ (valuable content)',
      replyRate: '12%+ (building relationship)',
    },
  },

  // EMAIL 3: Solution Positioning (Day 4 - Sequence #2)
  {
    id: 'solution_positioning_email_3',
    name: 'Solution Positioning Email #3',
    subject: 'How We Saved [Similar Company] $85K During Their Carrier Crisis',
    category: 'case_study',
    timing: 'Day 4 - Sequence #2',
    purpose: 'Position solution with relevant case study',
    content: {
      greeting: 'Dear [Decision Maker Name],',
      opening: `I wanted to share a success story that closely mirrors your current situation with [Specific Carrier Name].`,
      problem: `[Similar Company] was in the exact same position 60 days ago:
• Primary carrier's insurance expiring in 21 days
• 40% of their freight moved by that carrier
• Peak season approaching with no backup plan
• Regulatory compliance concerns mounting

Sound familiar?`,
      solution: `Here's exactly how we solved their crisis in just 7 days:

📅 **Day 1**: Emergency assessment call (2 hours)
📅 **Day 2**: Capacity audit and backup carrier identification (4 hours)
📅 **Day 3**: Contract negotiation and rate locking (6 hours)
📅 **Day 4**: Test shipments and quality assurance (3 hours)
📅 **Day 5**: Full transition completed with zero service disruption
📅 **Day 7**: Ongoing monitoring and optimization implemented

**Result**: $85K savings vs. emergency expedited shipping costs`,
      proof: `The numbers don't lie:
• **0 service disruptions** during 90-day transition
• **$85K cost savings** vs. market alternatives
• **12% improved delivery times** with new carriers
• **100% compliance maintained** throughout process
• **Client satisfaction increased** by 25%`,
      callToAction: `Would you like to see their full case study and learn how this exact process could work for [Your Company]?

[View Full Case Study] - Includes before/after metrics
[Schedule Solution Demo] - See our crisis response system in action`,
      closing: `We're here to prevent crises, not just respond to them.

Best regards,
Gary - Solution Specialist
DEPOINTE/Freight 1st Direct
📞 555-0102 | 📧 gary@depointe.com`,
    },
    personalization: [
      'Similar company in same industry',
      'Specific carrier details',
      'Comparable crisis situation',
      'Industry-specific metrics',
    ],
    expectedMetrics: {
      openRate: '52%+ (case study appeal)',
      clickRate: '22%+ (proof of results)',
      replyRate: '14%+ (social proof works)',
    },
  },

  // EMAIL 4: ROI Calculator (Day 6 - Sequence #3)
  {
    id: 'roi_calculator_email_4',
    name: 'ROI Calculator Email #4',
    subject: 'Your Carrier Crisis ROI: $[Amount] Savings Available',
    category: 'roi_focused',
    timing: 'Day 6 - Sequence #3',
    purpose: 'Quantify financial impact and ROI',
    content: {
      greeting: 'Hello [Decision Maker Name],',
      opening: `Based on your shipping volume and [Specific Carrier Name]'s situation, I calculated the potential impact of their insurance crisis.`,
      problem: `Current Risk Assessment:
• **Insurance expires**: [Specific Date]
• **Your exposure**: [X]% of total shipments
• **Estimated disruption cost**: $[Amount] in delays alone
• **Regulatory fines potential**: $10K-$25K
• **Customer loss risk**: [Y]% of accounts`,
      solution: `Our Crisis Prevention Program includes:

💰 **Immediate Savings**:
• Avoid expedited shipping costs: $[Amount]
• Eliminate regulatory fines: $0 (our guarantee)
• Reduce customer complaints: 80% decrease

💰 **Long-term Benefits**:
• Rate optimization: 12-18% savings annually
• Improved service levels: 15% faster deliveries
• Capacity security: Never worry about carrier issues again
• Compliance assurance: Full regulatory protection

**Total Projected ROI**: $[Amount] first year savings`,
      proof: `Our clients typically see:
• **300%+ ROI** in first 12 months
• **85% reduction** in carrier-related issues
• **$50K+ average savings** per client annually
• **99.5% on-time delivery** guarantee`,
      callToAction: `Ready to see your personalized ROI calculator?

[View My ROI Calculator] - Custom analysis for [Your Company]
[Book ROI Review Call] - 20 minutes to review your specific numbers`,
      closing: `Numbers don't lie - let's make sure you're on the profitable side of this equation.

Best regards,
Gary - ROI Specialist
DEPOINTE/Freight 1st Direct
📞 555-0102 | 📧 gary@depointe.com`,
    },
    personalization: [
      'Specific shipping volume data',
      'Exact carrier expiration date',
      'Industry-specific cost estimates',
      'Comparable ROI examples',
    ],
    expectedMetrics: {
      openRate: '58%+ (financial interest)',
      clickRate: '28%+ (ROI curiosity)',
      replyRate: '16%+ (money motivates action)',
    },
  },

  // EMAIL 5: Final Urgency (Day 8 - Sequence #4)
  {
    id: 'final_urgency_email_5',
    name: 'Final Urgency Email #5',
    subject:
      '⏰ FINAL NOTICE: [X] Days Until [Carrier] Loses Insurance - Act Now',
    category: 'urgency',
    timing: 'Day 8 - Sequence #4',
    purpose: 'Create final urgency and drive immediate action',
    content: {
      greeting: '[Decision Maker Name],',
      opening: `This is your final notice about [Specific Carrier Name]'s insurance crisis.`,
      problem: `⏰ **ONLY [X] DAYS REMAINING** until [Specific Carrier Name] loses their operating authority.

What happens then?
❌ Your shipments could be rejected at borders
❌ Deliveries delayed by 3-5 days minimum
❌ $50K+ in expedited shipping costs
❌ Customer contracts at risk
❌ Regulatory compliance violations

The clock is ticking...`,
      solution: `We can solve this TODAY with our Crisis Response Guarantee:

✅ **Immediate capacity activation** (within 24 hours)
✅ **Rate lock protection** (no price increases during transition)
✅ **Service level guarantee** (100% on-time or we pay the difference)
✅ **Compliance assurance** (full regulatory protection)
✅ **Dedicated transition team** (single point of contact)

**Limited Time**: First 10 clients get our Premium Crisis Package at no additional cost.`,
      proof: `In the last 30 days alone:
• **27 companies** avoided carrier shutdowns
• **$2.1M saved** in potential disruption costs
• **Zero service interruptions** for our crisis response clients
• **100% compliance maintained** throughout transitions`,
      callToAction: `Don't wait until it's too late.

[EMERGENCY CONSULTATION] - Available slots today
[SECURE CAPACITY NOW] - Lock in your crisis protection
[CALL NOW] - 555-0101 (immediate response guaranteed)`,
      closing: `This situation won't resolve itself. Let's get you protected today.

URGENTLY,
Cliff - Crisis Response Team Lead
DEPOINTE/Freight 1st Direct
📞 555-0101 | 📧 cliff@depointe.com

P.S. We've successfully prevented 150+ carrier crises this year. Don't become another statistic.`,
    },
    personalization: [
      'Exact days remaining until expiration',
      'Specific carrier name and details',
      'Industry-specific risk examples',
      'Time-sensitive urgency language',
    ],
    expectedMetrics: {
      openRate: '62%+ (urgency drives opens)',
      clickRate: '32%+ (fear motivates action)',
      replyRate: '18%+ (crisis creates responsiveness)',
    },
  },

  // EMAIL 6: Follow-up Nurture (Day 15 - Re-engagement)
  {
    id: 'follow_up_nurture_email_6',
    name: 'Follow-up Nurture Email #6',
    subject:
      'Following Up: Still Protecting Your Supply Chain from Carrier Risks?',
    category: 'nurture',
    timing: 'Day 15 - Re-engagement',
    purpose: 'Gentle re-engagement for non-responders',
    content: {
      greeting: 'Hello [Decision Maker Name],',
      opening: `I wanted to follow up on my previous emails about [Specific Carrier Name]'s insurance situation.`,
      problem: `I understand you may be busy, but carrier insurance issues don't wait for convenient times. The situation with [Specific Carrier Name] is still developing, and I'd hate for it to impact your operations unexpectedly.`,
      solution: `We're still here to help ensure your supply chain remains uninterrupted:

🌟 **Current Availability**: Immediate capacity for [Your Industry] shipments
🌟 **Risk-Free Assessment**: Free analysis of your carrier dependencies
🌟 **Flexible Options**: Multiple carriers to choose from
🌟 **Ongoing Support**: 24/7 monitoring and rapid response capability`,
      proof: `Since my last email, we've helped 12 more companies in similar situations, preventing an estimated $680K in potential disruption costs.`,
      callToAction: `Have questions about your current carrier situation? I'm here to help.

[Quick 5-Minute Check] - Assess your carrier risk
[Schedule Call] - Discuss your options
[View Resources] - Carrier crisis prevention guide`,
      closing: `Prevention is always better than crisis response.

Best regards,
Cliff - Supply Chain Protection Specialist
DEPOINTE/Freight 1st Direct
📞 555-0101 | 📧 cliff@depointe.com`,
    },
    personalization: [
      'Reference to previous communications',
      'Updated carrier status if available',
      'Industry-specific context',
      'Time-sensitive but non-urgent tone',
    ],
    expectedMetrics: {
      openRate: '45%+ (relationship building)',
      clickRate: '15%+ (resource interest)',
      replyRate: '8%+ (follow-up timing)',
    },
  },
];

export const newBusinessEmailTemplates: EmailTemplate[] = [
  // EMAIL 1: Immediate Value Proposition (Day 1 - Quick Start Offer)
  {
    id: 'quick_start_offer_email_1',
    name: 'Quick Start Offer Email #1',
    subject: '🚀 [Company Name] - Same-Week Freight Setup + 30-Day Free Trial',
    category: 'quick_start',
    timing: 'Day 1 - Immediate',
    purpose: 'Offer immediate freight setup for new businesses',
    content: {
      greeting: 'Hi [Founder/Owner Name],',
      opening: `Congratulations on launching [Company Name]! As a fellow entrepreneur, I know how critical reliable freight partners are to your success.`,
      problem: `Many new businesses struggle with freight logistics because:
• **Established carriers want long-term commitments** you might not be ready for
• **Complex contracts** that don't fit startup flexibility
• **High minimums** that strain your cash flow
• **Slow onboarding** that delays your growth

But you need freight solutions NOW to serve your customers and grow your business.`,
      solution: `We specialize in helping NEW businesses like yours get freight solutions FAST:

✅ **Same-week setup** - Get shipping within 3 business days
✅ **30-day free trial** - Test our service risk-free
✅ **Flexible terms** - No long-term commitments required
✅ **Startup pricing** - Competitive rates designed for growing businesses
✅ **Dedicated support** - Personal account manager for your growth phase
✅ **Scalable solutions** - Grow with you as your business expands`,
      proof: `We've helped 200+ new manufacturers, wholesalers, and warehouses get their freight operations running smoothly within the first 90 days of business.`,
      callToAction: `Ready to get your freight logistics handled immediately?

[Claim Your Free 30-Day Trial] - Same-week implementation
[Schedule 15-Minute Quick Start Call] - Available today/tomorrow`,
      closing: `Let's get your freight operations running so you can focus on growing your business.

Best regards,
Gary - New Business Growth Specialist
DEPOINTE/Freight 1st Direct
📞 555-0104 | 📧 gary@depointe.com
P.S. Most new businesses see 40% faster growth with reliable freight partners in place from day one.`
    },
    personalization: [
      'Business age and industry',
      'Specific growth challenges',
      'Competitor freight solutions',
      'Local market conditions'
    ],
    expectedMetrics: {
      openRate: '78%+ (congratulatory + urgent subject)',
      clickRate: '35%+ (immediate value proposition)',
      replyRate: '22%+ (entrepreneurial responsiveness)'
    }
  },

  // EMAIL 2: Growth-Focused Partnership (Day 3 - Partnership Building)
  {
    id: 'growth_partnership_email_2',
    name: 'Growth Partnership Email #2',
    subject: 'How [Company Name] Can Scale 3x Faster with Strategic Freight Partners',
    category: 'growth_focused',
    timing: 'Day 3 - Partnership Building',
    purpose: 'Position as long-term growth partner',
    content: {
      greeting: 'Hello [Founder/Owner Name],',
      opening: `Following up on our quick-start offer - I wanted to share how strategic freight partnerships accelerate new business growth.`,
      problem: `Most new businesses focus on product development and customer acquisition, but neglect logistics until it's a crisis. This creates:

• **Cash flow bottlenecks** from delayed payments
• **Customer dissatisfaction** from shipping delays
• **Missed growth opportunities** due to logistics constraints
• **Competitive disadvantages** against established players
• **Operational stress** that distracts from core business`,
      solution: `We provide NEW BUSINESS freight solutions that GROW WITH YOU:

🌱 **Phase 1 (Months 1-6)**: Basic freight coverage + free consultation
🌱 **Phase 2 (Months 7-12)**: Volume discounts + dedicated account management
🌱 **Phase 3 (Months 13-24)**: Strategic logistics optimization + technology integration
🌱 **Phase 4 (Ongoing)**: Preferred partner status + co-marketing opportunities

**Your Success = Our Success** - We earn more as you grow`,
      proof: `Our new business clients typically experience:
• **3x faster shipping volume growth** in year 1
• **40% lower logistics costs** through strategic partnerships
• **95% on-time delivery** building customer loyalty
• **Zero freight-related business disruptions**`,
      callToAction: `Would you like to see a customized growth roadmap for [Company Name]?

[View Growth Roadmap] - Personalized for your business stage
[Book Growth Strategy Call] - 30 minutes, completely free`,
      closing: `Let's build a freight partnership that supports your entrepreneurial vision.

Best regards,
Gary - Growth Partnership Specialist
DEPOINTE/Freight 1st Direct
📞 555-0104 | 📧 gary@depointe.com`
    },
    personalization: [
      'Business growth stage and goals',
      'Industry-specific challenges',
      'Competitive landscape',
      'Local market opportunities'
    ],
    expectedMetrics: {
      openRate: '65%+ (growth-focused subject)',
      clickRate: '28%+ (valuable roadmap offer)',
      replyRate: '18%+ (partnership interest)'
    }
  },

  // EMAIL 3: Success Stories & ROI (Day 7 - Proof of Results)
  {
    id: 'success_stories_email_3',
    name: 'Success Stories Email #3',
    subject: '[Company Name] - Real Results: How [Similar Business] Grew 300% with Freight Partners',
    category: 'case_study',
    timing: 'Day 7 - Proof of Results',
    purpose: 'Provide social proof and ROI data',
    content: {
      greeting: '[Founder/Owner Name],',
      opening: `I wanted to share a success story from a business very similar to [Company Name] that launched around the same time you did.`,
      problem: `[Similar Business] faced the same challenges you likely encounter:
• **Limited capital** for logistics investments
• **Unpredictable shipping costs** eating into margins
• **Customer complaints** about delivery times
• **Difficulty scaling** operations during growth spurts
• **Lack of industry connections** for better rates`,
      solution: `They partnered with us 18 months ago and here's what happened:

📈 **Month 1-3**: Immediate cost savings of 35% on shipping
📈 **Month 4-6**: 200% increase in on-time deliveries
📈 **Month 7-12**: Expanded to 3 new markets with reliable logistics
📈 **Month 13-18**: 300% overall business growth with 40% higher margins
📈 **Current**: Preferred partner status with co-marketing benefits

**Total ROI**: 450% return on their logistics investment`,
      proof: `The numbers speak for themselves:
• **35% immediate cost reduction**
• **300% business growth acceleration**
• **95% customer satisfaction improvement**
• **40% margin improvement**
• **Zero service disruptions during peak seasons**`,
      callToAction: `Ready to replicate these results for [Company Name]?

[Get Your ROI Calculator] - Custom analysis for your business
[Schedule Success Story Call] - Learn exactly how they did it`,
      closing: `Success leaves clues. Let's apply these proven strategies to your business.

Best regards,
Gary - Results Specialist
DEPOINTE/Freight 1st Direct
📞 555-0104 | 📧 gary@depointe.com`
    },
    personalization: [
      'Similar business in same industry/location',
      'Comparable business age and size',
      'Specific growth metrics',
      'Industry-specific challenges solved'
    ],
    expectedMetrics: {
      openRate: '62%+ (results-focused subject)',
      clickRate: '32%+ (ROI curiosity)',
      replyRate: '20%+ (success story appeal)'
    }
  },

  // EMAIL 4: Limited-Time Partnership Offer (Day 10 - Urgency Creation)
  {
    id: 'partnership_offer_email_4',
    name: 'Partnership Offer Email #4',
    subject: '⏰ LIMITED TIME: Exclusive New Business Partnership - Ends [Date]',
    category: 'urgency_offer',
    timing: 'Day 10 - Urgency Creation',
    purpose: 'Create urgency with exclusive new business offer',
    content: {
      greeting: 'Hi [Founder/Owner Name],',
      opening: `As a token of appreciation for being an entrepreneur building something new, I'd like to offer you an exclusive partnership opportunity.`,
      problem: `Most logistics companies treat new businesses as an afterthought, but we believe the most important partnerships are formed at the beginning of the journey.`,
      solution: `**EXCLUSIVE NEW BUSINESS PARTNERSHIP PACKAGE:**

🎯 **6 Months Free Freight Consulting** - Strategic logistics planning
🎯 **Preferred Partner Rates** - 25% below standard pricing
🎯 **Priority Service** - Fast-track all your shipments
🎯 **Growth Mentorship** - Monthly strategy sessions with logistics experts
🎯 **Technology Integration** - Free shipping software setup
🎯 **Marketing Support** - Co-branded content for your customers

**Total Value: $12,000+ in savings and services**
**Your Investment: Just getting started with us**`,
      proof: `This exclusive package is only available to the first 50 new businesses we partner with this quarter. 35 have already been claimed by smart entrepreneurs like you.`,
      callToAction: `This offer expires [Date] - don't miss this opportunity to give your business the logistics foundation it needs.

[Claim Your Partnership Package] - Exclusive new business offer
[Call to Discuss] - 555-0104 (immediate priority booking)`,
      closing: `Let's build something great together. Your success story starts with the right partners.

URGENTLY,
Gary - New Business Partnership Director
DEPOINTE/Freight 1st Direct
📞 555-0104 | 📧 gary@depointe.com

P.S. Only 15 packages remaining. First come, first served for qualified new businesses.`
    },
    personalization: [
      'Specific offer expiration date',
      'Remaining package count',
      'Business stage and needs',
      'Industry-specific value propositions'
    ],
    expectedMetrics: {
      openRate: '70%+ (limited-time urgency)',
      clickRate: '38%+ (exclusive offer appeal)',
      replyRate: '25%+ (scarcity creates action)'
    }
  }
];

export default desperateShipperEmailTemplates;
