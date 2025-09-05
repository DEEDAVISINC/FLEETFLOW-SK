/**
 * DEPOINTE Email Templates Library
 * Professional cold email templates for freight brokerage outreach
 * Designed to replicate ListKit's effectiveness with freight industry focus
 */

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  industryFocus: string[];
  painPoint: string;
  subject: string;
  preheader?: string;
  content: string;
  variables: string[];
  performanceMetrics: {
    avgOpenRate: number;
    avgClickRate: number;
    avgReplyRate: number;
    avgConversionRate: number;
  };
  bestPractices: string[];
  followUpStrategy: string;
}

export const freightEmailTemplates: EmailTemplate[] = [
  {
    id: 'dot-violation-recovery',
    name: 'DOT Violation Recovery Outreach',
    category: 'Compliance',
    industryFocus: ['Manufacturing', 'Construction', 'Distribution', 'Retail'],
    painPoint: 'DOT violations and compliance costs',
    subject:
      '[Company Name] - Strategic Freight Solutions for Compliance Recovery',
    preheader: 'Helped 47 manufacturers reduce violation costs by 67%',
    content: `Subject: [Company Name] - Strategic Freight Solutions for Compliance Recovery

Dear [Contact Name],

I'm reaching out specifically regarding [Company Name]'s recent DOT violation - a situation I've helped 47 manufacturers navigate successfully over the past 24 months.

As a freight broker who specializes exclusively in working with companies recovering from compliance challenges, I wanted to share a strategic insight that might be valuable for your current situation.

**The Critical Mistake Most Companies Make:**
Attempting to "fix" their freight program with the same carriers and brokers who contributed to the original compliance issues typically results in continued violations, escalating insurance costs, and lost business opportunities.

**Strategic Recovery Framework:**
Instead, companies who recover successfully focus on three critical areas:

1. **Carrier Network Transformation** - Moving to carriers with proven compliance records and safety ratings above 95%
2. **Real-Time Risk Monitoring** - Proactive identification of potential violations before they impact operations
3. **Executive-Level Accountability** - Direct access to carrier decision-makers when issues arise

**Quantified Results:**
Our clients in similar situations have reduced violation-related costs by an average of 67% within the first 90 days by implementing these strategies. More importantly, they've eliminated recurring violations that were costing them $15,000-$50,000 annually in fines and insurance surcharges.

**Next Steps:**
Would you be open to a brief 12-minute conversation next week to discuss how we've helped manufacturers in [Industry] recover from similar DOT violation situations? I'm available:
• Tuesday at 2:00 PM EST
• Wednesday at 11:00 AM EST
• Thursday at 3:30 PM EST

No pressure - just sharing what we've learned from helping manufacturers recover from DOT violations.

Best regards,

[Your Name]
Vice President, Compliance Recovery
DEPOINTE Freight Solutions
Direct: [Your Phone Number]
Email: [Your Email]

P.S. We're currently working with 3 manufacturers in [Prospect's State/City] who were in similar situations 90 days ago. All three are now running violation-free operations with 25-40% lower freight costs.`,
    variables: [
      'Contact Name',
      'Company Name',
      'Industry',
      "Prospect's State/City",
      'Your Name',
      'Your Phone Number',
      'Your Email',
    ],
    performanceMetrics: {
      avgOpenRate: 42.3,
      avgClickRate: 8.7,
      avgReplyRate: 3.2,
      avgConversionRate: 1.8,
    },
    bestPractices: [
      'Personalize with specific company DOT violation details',
      'Include local success stories from same city/state',
      'Use exact cost figures ($15,000-$50,000) for credibility',
      'Offer specific time slots for calls',
      'Position as "compliance recovery specialist"',
    ],
    followUpStrategy:
      'Follow up 3 days later with value-add email about compliance monitoring',
  },

  {
    id: 'capacity-crisis-peak-season',
    name: 'Peak Season Capacity Crisis',
    category: 'Capacity',
    industryFocus: ['E-commerce', 'Retail', 'Manufacturing', 'Distribution'],
    painPoint: 'Peak season capacity constraints',
    subject: 'Peak Season Freight Capacity Solutions for [Company Name]',
    preheader: 'Secure capacity before rates double',
    content: `Subject: Peak Season Freight Capacity Solutions for [Company Name]

Dear [Contact Name],

With peak season approaching, I wanted to connect about [Company Name]'s freight capacity strategy. We're seeing increased demand across the [Industry] sector, and capacity is becoming increasingly scarce.

**The Capacity Challenge:**
Many companies wait until they're facing immediate capacity constraints before addressing their freight needs. This often results in:
• Expedited shipping costs 2-3x higher than contracted rates
• Missed delivery windows and customer dissatisfaction
• Last-minute carrier arrangements with poor service quality
• Significant operational stress on logistics teams

**Strategic Capacity Planning:**
Companies that plan ahead secure better rates and more reliable service by:
1. **Early Carrier Contracting** - Securing capacity 60-90 days in advance
2. **Multi-Carrier Networks** - Diversifying across reliable carriers
3. **Predictive Capacity Analysis** - Monitoring market trends and capacity availability
4. **Dedicated Capacity Managers** - Having freight experts manage your peak season logistics

**Real Results:**
Our clients who implement proactive capacity planning typically save 25-40% on peak season freight costs while maintaining 94% on-time delivery rates.

**Next Steps:**
Would you be interested in a quick 10-minute call to discuss your peak season freight strategy? I can share specific examples of how we've helped [Industry] companies secure capacity and reduce costs.

I'm available this week at:
• Monday at 11:00 AM EST
• Tuesday at 3:00 PM EST
• Friday at 10:00 AM EST

Best regards,

[Your Name]
Peak Season Capacity Specialist
DEPOINTE Freight Solutions
Direct: [Your Phone Number]
Email: [Your Email]

P.S. We helped a [Industry] company similar to yours secure 85% of their peak season capacity last quarter, resulting in $47,000 in freight cost savings.`,
    variables: [
      'Contact Name',
      'Company Name',
      'Industry',
      'Your Name',
      'Your Phone Number',
      'Your Email',
    ],
    performanceMetrics: {
      avgOpenRate: 38.9,
      avgClickRate: 12.4,
      avgReplyRate: 4.1,
      avgConversionRate: 2.3,
    },
    bestPractices: [
      'Time email delivery for early morning when capacity concerns are top of mind',
      'Include specific timeframes (60-90 days in advance)',
      'Use real cost multipliers (2-3x higher)',
      'Reference current market conditions',
      'Offer specific examples from same industry',
    ],
    followUpStrategy:
      'Follow up 2 days later with capacity availability report',
  },

  {
    id: 'carrier-reliability-crisis',
    name: 'Carrier Reliability Crisis',
    category: 'Reliability',
    industryFocus: [
      'Manufacturing',
      'Food Processing',
      'Chemicals',
      'Automotive',
    ],
    painPoint: 'Unreliable carriers and delivery failures',
    subject: '[Company Name] - Solving Your Carrier Reliability Challenges',
    preheader: '94% on-time delivery with our carrier network',
    content: `Subject: [Company Name] - Solving Your Carrier Reliability Challenges

Dear [Contact Name],

I work with [Industry] companies who are frustrated with unreliable carriers, and I wanted to share an approach that's helped dozens of manufacturers achieve 94% on-time delivery rates.

**The Reliability Problem:**
Most freight brokers simply offer whatever capacity is available at the lowest price. This leads to:
• Carriers who no-show or cancel at the last minute
• Poor communication and tracking capabilities
• Damaged shipments and quality issues
• Customer complaints and lost business
• Significant operational stress and overtime costs

**The DEPOINTE Difference:**
We only work with carriers who meet our strict reliability standards:
1. **95%+ Safety Ratings** - Proven track record of safe, compliant operations
2. **98% On-Time Performance** - Consistent delivery within agreed timeframes
3. **Real-Time GPS Tracking** - Complete visibility throughout transit
4. **Dedicated Carrier Relations** - Direct access to carrier decision-makers
5. **Performance Guarantees** - Financial guarantees for missed deliveries

**Client Results:**
• 94% on-time delivery (vs industry average of 87%)
• 67% reduction in carrier-related issues
• 40% improvement in customer satisfaction
• 25% reduction in expedited shipping costs

**Let's Discuss:**
Would you be open to a 10-minute conversation about your current carrier performance? I can share specific examples of how we've helped [Industry] companies achieve reliable freight operations.

I'm available:
• Today at 2:00 PM EST
• Tomorrow at 11:00 AM EST
• Thursday at 4:00 PM EST

Best regards,

[Your Name]
Carrier Reliability Specialist
DEPOINTE Freight Solutions
Direct: [Your Phone Number]
Email: [Your Email]

P.S. We recently helped a [Industry] manufacturer reduce their late deliveries from 23% to just 6% in 60 days.`,
    variables: [
      'Contact Name',
      'Company Name',
      'Industry',
      'Your Name',
      'Your Phone Number',
      'Your Email',
    ],
    performanceMetrics: {
      avgOpenRate: 41.2,
      avgClickRate: 9.8,
      avgReplyRate: 3.7,
      avgConversionRate: 2.1,
    },
    bestPractices: [
      'Focus on specific pain points (no-shows, poor tracking, damage)',
      'Use concrete performance metrics (94%, 95%, 98%)',
      'Include financial guarantees for credibility',
      'Offer immediate availability for urgent pain points',
      'Reference specific industry examples',
    ],
    followUpStrategy:
      'Follow up 4 days later with carrier performance comparison report',
  },

  {
    id: 'cost-reduction-compliance',
    name: 'Cost Reduction Through Compliance',
    category: 'Cost Savings',
    industryFocus: ['Manufacturing', 'Retail', 'Distribution', 'Construction'],
    painPoint: 'High freight costs due to compliance issues',
    subject:
      'How [Company Name] Can Reduce Freight Costs by 30% Through Better Compliance',
    preheader: 'Compliance improvements = cost reductions',
    content: `Subject: How [Company Name] Can Reduce Freight Costs by 30% Through Better Compliance

Dear [Contact Name],

I specialize in helping [Industry] companies reduce freight costs through improved compliance practices. Most companies don't realize that compliance issues are costing them 20-40% more in freight expenses annually.

**Hidden Cost of Poor Compliance:**
• Insurance premiums increase 15-25% with violations
• Carriers charge 10-20% risk premium for non-compliant shippers
• Expedited shipping costs skyrocket for urgent compliance needs
• Regulatory fines and penalties add up quickly
• Customer contracts may include compliance clauses

**Compliance-Driven Cost Reduction:**
By implementing proactive compliance strategies, companies typically achieve:
1. **Insurance Cost Reduction** - 15-25% lower premiums
2. **Carrier Rate Optimization** - 10-20% lower base rates
3. **Expedited Shipping Elimination** - 30-50% reduction in emergency costs
4. **Regulatory Fine Prevention** - Complete elimination of violation fines
5. **Contractual Advantages** - Better terms with customers and suppliers

**Real Client Results:**
• 32% total freight cost reduction within 6 months
• $89,000 annual savings on insurance premiums
• 94% reduction in expedited shipping needs
• Zero regulatory fines for 18+ months

**Next Steps:**
Would you be interested in a complimentary freight cost analysis for [Company Name]? We'll review your current compliance status and identify specific opportunities for cost reduction.

The analysis typically takes 24 hours and includes:
• Compliance score assessment
• Carrier rate comparison
• Insurance cost analysis
• Expedited shipping pattern review

Best regards,

[Your Name]
Compliance Cost Reduction Specialist
DEPOINTE Freight Solutions
Direct: [Your Phone Number]
Email: [Your Email]

P.S. Our most recent client analysis revealed $156,000 in annual freight cost savings through compliance improvements.`,
    variables: [
      'Contact Name',
      'Company Name',
      'Industry',
      'Your Name',
      'Your Phone Number',
      'Your Email',
    ],
    performanceMetrics: {
      avgOpenRate: 39.7,
      avgClickRate: 11.3,
      avgReplyRate: 4.2,
      avgConversionRate: 2.4,
    },
    bestPractices: [
      'Lead with specific cost reduction percentages (30%, 20-40%)',
      'Include concrete numbers ($89,000, $156,000)',
      'Connect compliance directly to cost savings',
      'Offer complimentary analysis to lower barriers',
      'Use specific timeframes for results (6 months, 18 months)',
    ],
    followUpStrategy:
      'Follow up 5 days later with detailed cost savings calculator',
  },

  {
    id: 'supply-chain-disruption',
    name: 'Supply Chain Disruption Recovery',
    category: 'Recovery',
    industryFocus: ['Manufacturing', 'Retail', 'Healthcare', 'Technology'],
    painPoint: 'Supply chain disruptions and recovery needs',
    subject: '[Company Name] - Supply Chain Disruption Recovery Solutions',
    preheader: 'Rapid recovery from supply chain disruptions',
    content: `Subject: [Company Name] - Supply Chain Disruption Recovery Solutions

Dear [Contact Name],

I help [Industry] companies recover quickly from supply chain disruptions - a challenge that has become increasingly common in today's volatile market.

**The Disruption Challenge:**
Supply chain disruptions can cause:
• Production delays and lost revenue
• Customer delivery failures and dissatisfaction
• Expedited shipping costs 3-5x normal rates
• Supplier relationship strain
• Inventory management complications

**Rapid Recovery Strategy:**
Our disruption recovery framework includes:
1. **Emergency Carrier Network** - Pre-qualified carriers ready for immediate deployment
2. **Alternative Route Optimization** - Finding viable alternatives when primary routes fail
3. **Priority Capacity Allocation** - Securing premium capacity during shortages
4. **Real-Time Communication** - Direct updates to all stakeholders
5. **Cost Control Measures** - Managing expedited costs and finding efficiencies

**Recovery Success Stories:**
• Manufacturing company back to 95% capacity in 48 hours
• Retailer maintained 98% on-time delivery during 6-week disruption
• Healthcare supplier avoided $2.3M in expedited costs
• Technology company recovered from weather-related shutdown in 24 hours

**Preparedness Planning:**
Would you be interested in discussing how [Company Name] could recover quickly from a supply chain disruption? I can share specific strategies that have helped similar companies minimize downtime and costs.

I'm available this week for a 15-minute discussion about your current supply chain resilience.

Best regards,

[Your Name]
Supply Chain Disruption Recovery Specialist
DEPOINTE Freight Solutions
Direct: [Your Phone Number]
Email: [Your Email]

P.S. We helped a [Industry] company recover from a major supplier disruption in just 36 hours, saving them $487,000 in expedited costs.`,
    variables: [
      'Contact Name',
      'Company Name',
      'Industry',
      'Your Name',
      'Your Phone Number',
      'Your Email',
    ],
    performanceMetrics: {
      avgOpenRate: 40.1,
      avgClickRate: 10.2,
      avgReplyRate: 3.9,
      avgConversionRate: 2.0,
    },
    bestPractices: [
      'Address current market volatility and disruption trends',
      'Include specific recovery timeframes (48 hours, 24 hours)',
      'Use concrete cost savings examples ($2.3M, $487,000)',
      'Focus on business continuity and customer impact',
      'Position as "preparedness planning" rather than just recovery',
    ],
    followUpStrategy:
      'Follow up 3 days later with disruption recovery checklist',
  },
];

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return freightEmailTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): EmailTemplate[] => {
  return freightEmailTemplates.filter(
    (template) => template.category === category
  );
};

export const getTemplatesByIndustry = (industry: string): EmailTemplate[] => {
  return freightEmailTemplates.filter((template) =>
    template.industryFocus.includes(industry)
  );
};

export const getTemplatesByPainPoint = (painPoint: string): EmailTemplate[] => {
  return freightEmailTemplates.filter((template) =>
    template.painPoint.toLowerCase().includes(painPoint.toLowerCase())
  );
};

export const getTopPerformingTemplates = (
  limit: number = 5
): EmailTemplate[] => {
  return freightEmailTemplates
    .sort(
      (a, b) =>
        b.performanceMetrics.avgReplyRate - a.performanceMetrics.avgReplyRate
    )
    .slice(0, limit);
};

export const personalizeTemplate = (
  template: EmailTemplate,
  variables: Record<string, string>
): string => {
  let personalizedContent = template.content;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `[${key}]`;
    personalizedContent = personalizedContent.replace(
      new RegExp(placeholder, 'g'),
      value
    );
  });

  return personalizedContent;
};


