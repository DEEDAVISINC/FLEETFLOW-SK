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
    subject: '🚨 URGENT: We Detected Your Carrier Insurance Crisis - Immediate Solutions Available',
    category: 'crisis_alert',
    timing: 'Day 1 - Immediate',
    purpose: 'Alert shippers to carrier crisis and position as immediate solution',
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
P.S. Carrier insurance crises don't wait - let's address this before it becomes an emergency.`
    },
    personalization: [
      'Company name and specific carrier details',
      'Industry-specific pain points',
      'Local market conditions',
      'Specific compliance risks'
    ],
    expectedMetrics: {
      openRate: '65%+ (crisis relevance)',
      clickRate: '25%+ (immediate need)',
      replyRate: '15%+ (urgency drives response)'
    }
  },

  // EMAIL 2: Problem Deep Dive (Day 2 - Sequence #1)
  {
    id: 'problem_deep_dive_email_2',
    name: 'Problem Deep Dive Email #2',
    subject: 'The Hidden Dangers of Carrier Insurance Lapses - Your Risk Assessment',
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
📞 555-0101 | 📧 cliff@depointe.com`
    },
    personalization: [
      'Specific carrier name and expiration date',
      'Percentage of shipments affected',
      'Industry-specific examples',
      'Local market conditions'
    ],
    expectedMetrics: {
      openRate: '55%+ (follow-up relevance)',
      clickRate: '18%+ (valuable content)',
      replyRate: '12%+ (building relationship)'
    }
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
📞 555-0102 | 📧 gary@depointe.com`
    },
    personalization: [
      'Similar company in same industry',
      'Specific carrier details',
      'Comparable crisis situation',
      'Industry-specific metrics'
    ],
    expectedMetrics: {
      openRate: '52%+ (case study appeal)',
      clickRate: '22%+ (proof of results)',
      replyRate: '14%+ (social proof works)'
    }
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
📞 555-0102 | 📧 gary@depointe.com`
    },
    personalization: [
      'Specific shipping volume data',
      'Exact carrier expiration date',
      'Industry-specific cost estimates',
      'Comparable ROI examples'
    ],
    expectedMetrics: {
      openRate: '58%+ (financial interest)',
      clickRate: '28%+ (ROI curiosity)',
      replyRate: '16%+ (money motivates action)'
    }
  },

  // EMAIL 5: Final Urgency (Day 8 - Sequence #4)
  {
    id: 'final_urgency_email_5',
    name: 'Final Urgency Email #5',
    subject: '⏰ FINAL NOTICE: [X] Days Until [Carrier] Loses Insurance - Act Now',
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

P.S. We've successfully prevented 150+ carrier crises this year. Don't become another statistic.`
    },
    personalization: [
      'Exact days remaining until expiration',
      'Specific carrier name and details',
      'Industry-specific risk examples',
      'Time-sensitive urgency language'
    ],
    expectedMetrics: {
      openRate: '62%+ (urgency drives opens)',
      clickRate: '32%+ (fear motivates action)',
      replyRate: '18%+ (crisis creates responsiveness)'
    }
  },

  // EMAIL 6: Follow-up Nurture (Day 15 - Re-engagement)
  {
    id: 'follow_up_nurture_email_6',
    name: 'Follow-up Nurture Email #6',
    subject: 'Following Up: Still Protecting Your Supply Chain from Carrier Risks?',
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
📞 555-0101 | 📧 cliff@depointe.com`
    },
    personalization: [
      'Reference to previous communications',
      'Updated carrier status if available',
      'Industry-specific context',
      'Time-sensitive but non-urgent tone'
    ],
    expectedMetrics: {
      openRate: '45%+ (relationship building)',
      clickRate: '15%+ (resource interest)',
      replyRate: '8%+ (follow-up timing)'
    }
  }
];

export default desperateShipperEmailTemplates;
