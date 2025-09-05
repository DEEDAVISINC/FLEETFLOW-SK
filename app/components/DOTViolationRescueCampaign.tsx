'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface CampaignMetrics {
  leadsGenerated: number;
  responseRate: number;
  conversionRate: number;
  avgDealValue: number;
  campaignROI: number;
}

export default function DOTViolationRescueCampaign() {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState<CampaignMetrics>({
    leadsGenerated: 0,
    responseRate: 0,
    conversionRate: 0,
    avgDealValue: 0,
    campaignROI: 0,
  });

  const campaignPhases = [
    {
      title: 'Phase 1: Lead Generation',
      description:
        'Identify manufacturing companies with recent DOT violations',
      duration: 'Week 1-2',
      activities: [
        'Query TruckingPlanet database for manufacturing companies',
        'Cross-reference with FMCSA API for recent violations',
        'Apply freight-specific scoring algorithm',
        'Filter for high-intent buying signals',
      ],
      aiStaff: ['Gary'],
      target: '500 qualified leads',
    },
    {
      title: 'Phase 2: Qualification & Outreach',
      description: 'Verify contacts and initiate first-touch communications',
      duration: 'Week 2-4',
      activities: [
        'Triple verification process (email, domain, activity)',
        'Decision maker identification and enrichment',
        'Personalized outreach sequence development',
        'Multi-channel engagement (email, phone, LinkedIn)',
      ],
      aiStaff: ['Gary', 'Cliff'],
      target: '35% response rate',
    },
    {
      title: 'Phase 3: Nurture & Convert',
      description:
        'Build relationships and close deals using specialized scripts',
      duration: 'Week 4-12',
      activities: [
        'Execute radical transparency freight sales methodology',
        'Apply consultative discovery questions',
        'Position DEPOINTE as violation solution partner',
        'Secure trial shipments and long-term contracts',
      ],
      aiStaff: ['Desiree', 'Will', 'Dee'],
      target: '12% conversion rate',
    },
  ];

  const campaignScripts = [
    {
      type: 'Initial Outreach Email',
      content: `Subject: [Company Name] - Strategic Freight Solutions for Compliance Recovery

Dear [Contact Name],

I'm reaching out specifically regarding [Company Name]'s recent DOT violation - a situation I've helped 47 manufacturers navigate successfully over the past 24 months.

As a freight broker who specializes exclusively in working with companies recovering from compliance challenges, I wanted to share a strategic insight that might be valuable for your current situation.

The most common mistake manufacturers make after receiving a DOT violation is attempting to "fix" their freight program with the same carriers and brokers who contributed to the original compliance issues. This typically results in continued violations, escalating insurance costs, and lost business opportunities.

Instead, companies who recover successfully focus on three critical areas:

1. **Carrier Network Transformation** - Moving to carriers with proven compliance records and safety ratings above 95%
2. **Real-Time Risk Monitoring** - Proactive identification of potential violations before they impact your operations
3. **Executive-Level Accountability** - Direct access to carrier decision-makers when issues arise

Our clients in similar situations have reduced violation-related costs by an average of 67% within the first 90 days by implementing these strategies. More importantly, they've eliminated recurring violations that were costing them $15,000-$50,000 annually in fines and insurance surcharges.

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
    },
    {
      type: 'Strategic Follow-up Call Script',
      content: `[Contact Name], [Your Name] with DEPOINTE Freight Solutions. How are you today?

[Pause for response]

Great, thanks for taking my call. I sent you an email last week about [Company Name]'s DOT violation situation - I wanted to follow up because I've helped 47 manufacturers in similar positions recover successfully.

Before we dive in, I want to make sure I'm not interrupting anything important. Do you have a couple of minutes to discuss your freight operations?

[Wait for confirmation - if no, schedule for later]

Perfect. I know you're dealing with the aftermath of a DOT violation, which puts significant pressure on operations, insurance costs, and customer relationships.

Most manufacturers in your situation make one critical mistake: they try to "fix" their freight program with the same carriers and brokers who contributed to the original compliance issues. This usually results in continued violations and escalating costs.

Instead, companies who recover successfully focus on three key strategies:
1. Moving to carriers with 95%+ safety ratings
2. Implementing real-time compliance monitoring
3. Establishing direct executive-level accountability

Our clients typically see a 67% reduction in violation-related costs within 90 days using this approach.

Would you be open to exploring how we've helped manufacturers in [Industry] recover from similar situations? I can share specific examples of how we've eliminated recurring violations while reducing freight costs by 25-40%.

What would be the best time for us to discuss this in more detail?`,
    },
    {
      type: 'Value Proposition Email',
      content: `Subject: [Company Name] - Compliance Recovery Strategy & Cost Reduction Analysis

Dear [Contact Name],

Following up on my previous message about your DOT violation situation. I wanted to share some specific insights from working with manufacturers in [Industry] who were in similar positions 90 days ago.

**Current Situation Analysis:**
Based on your recent violation, you're likely experiencing:
• Increased insurance premiums (typically 15-25% higher)
• Additional compliance monitoring costs ($2,500-$5,000/month)
• Potential customer contract penalties for late deliveries
• Executive time spent managing freight compliance issues

**Strategic Recovery Framework:**
Our compliance recovery program focuses on three pillars:

1. **Carrier Network Transformation**
   - 95%+ safety-rated carriers with proven compliance records
   - Pre-qualified fleet with current DOT certifications
   - Performance guarantees backed by carrier financial strength
   - Real-time carrier performance monitoring

2. **Risk Prevention System**
   - Predictive compliance monitoring using FMCSA data
   - Automated violation alerts before they impact operations
   - Route optimization to minimize high-risk corridors
   - 24/7 carrier performance oversight

3. **Executive Accountability Structure**
   - Direct access to carrier CEOs for critical situations
   - Dedicated compliance officer assigned to your account
   - Monthly executive reviews of carrier performance
   - Immediate escalation protocols for any issues

**Quantified Results from Similar Manufacturers:**
• 67% reduction in violation-related costs within 90 days
• 94% on-time delivery improvement (from industry average of 87%)
• 25-40% freight cost reduction through optimized carrier selection
• Complete elimination of recurring violations
• Improved customer satisfaction scores

**Implementation Timeline:**
Week 1-2: Carrier network audit and new carrier onboarding
Week 3-4: Risk monitoring system implementation
Week 5-12: Performance optimization and cost reduction

Would you be interested in seeing a customized compliance recovery plan for [Company Name]? I can prepare a detailed analysis showing potential cost savings and risk reduction specific to your freight patterns and violation history.

This typically takes 24 hours to prepare and involves no commitment on your part.

Best regards,

[Your Name]
Vice President, Compliance Recovery
DEPOINTE Freight Solutions
Direct: [Your Phone Number]
Email: [Your Email]

P.S. Three manufacturers in [Prospect's State/City] implemented this exact strategy 90 days ago. Their combined savings exceeded $180,000 in the first quarter alone.`,
    },
    {
      type: 'LinkedIn Connection Request',
      content: `Connection Request: DOT Compliance Recovery Expert

Hi [Contact Name],

I noticed [Company Name] recently experienced a DOT violation - a challenge I've helped 47 manufacturers overcome successfully in the past 24 months.

I specialize in freight compliance recovery strategies that typically reduce violation-related costs by 67% within 90 days while improving on-time delivery from 87% to 94%.

Would be happy to share some insights from similar manufacturers in [Industry] who've successfully recovered from DOT violations.

Best,
[Your Name]
Vice President, Compliance Recovery
DEPOINTE Freight Solutions`,
    },
  ];

  const campaignMetrics = [
    { label: 'Leads Generated', value: '500+', trend: '+25%' },
    { label: 'Response Rate', value: '35%', trend: '+12%' },
    { label: 'Conversion Rate', value: '12%', trend: '+8%' },
    { label: 'Avg Deal Value', value: '$2.4M', trend: '+15%' },
    { label: 'Campaign ROI', value: '340%', trend: '+45%' },
  ];

  return (
    <div className='space-y-6'>
      {/* Campaign Header */}
      <div className='rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6'>
        <div className='flex items-start gap-4'>
          <div className='rounded-full bg-red-100 p-3'>
            <AlertTriangle className='h-6 w-6 text-red-600' />
          </div>
          <div className='flex-1'>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>
              🚨 DOT Violation Rescue Campaign
            </h2>
            <p className='mb-4 text-gray-700'>
              Target manufacturing companies with recent DOT violations who
              desperately need reliable freight solutions. This campaign
              leverages high-intent buying signals and positions DEPOINTE as the
              immediate solution to compliance challenges.
            </p>

            <div className='flex items-center gap-4'>
              <div
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isActive ? '🟢 Campaign Active' : '⚪ Campaign Inactive'}
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isActive ? 'Pause Campaign' : 'Launch Campaign'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        {campaignMetrics.map((metric, index) => (
          <div
            key={index}
            className='rounded-lg border border-gray-200 bg-white p-4'
          >
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='text-sm font-medium text-gray-600'>
                {metric.label}
              </h3>
              <TrendingUp className='h-4 w-4 text-green-500' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold text-gray-900'>
                {metric.value}
              </span>
              <span className='text-sm text-green-600'>{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Phases */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>
          Campaign Execution Phases
        </h3>

        {campaignPhases.map((phase, index) => (
          <div
            key={index}
            className='rounded-lg border border-gray-200 bg-white p-6'
          >
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white'>
                  {index + 1}
                </div>
              </div>

              <div className='flex-1'>
                <div className='mb-2 flex items-center justify-between'>
                  <h4 className='text-lg font-medium text-gray-900'>
                    {phase.title}
                  </h4>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500'>
                    {phase.duration}
                  </span>
                </div>

                <p className='mb-4 text-gray-600'>{phase.description}</p>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div>
                    <h5 className='mb-2 font-medium text-gray-900'>
                      Activities
                    </h5>
                    <ul className='space-y-1 text-sm text-gray-600'>
                      {phase.activities.map((activity, i) => (
                        <li key={i} className='flex items-center gap-2'>
                          <CheckCircle className='h-3 w-3 text-green-500' />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className='mb-2 font-medium text-gray-900'>AI Staff</h5>
                    <div className='flex flex-wrap gap-2'>
                      {phase.aiStaff.map((staff, i) => (
                        <span
                          key={i}
                          className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                        >
                          {staff}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className='mb-2 font-medium text-gray-900'>Target</h5>
                    <div className='rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-gray-600'>
                      🎯 {phase.target}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Scripts */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>
          Campaign Communication Scripts
        </h3>

        {campaignScripts.map((script, index) => (
          <div
            key={index}
            className='rounded-lg border border-gray-200 bg-white p-6'
          >
            <div className='mb-4 flex items-center gap-3'>
              {script.type === 'Initial Outreach Email' && (
                <Mail className='h-5 w-5 text-blue-600' />
              )}
              {script.type === 'Follow-up Phone Script' && (
                <Phone className='h-5 w-5 text-green-600' />
              )}
              {script.type === 'Value Proposition Email' && (
                <MessageSquare className='h-5 w-5 text-purple-600' />
              )}
              <h4 className='text-lg font-medium text-gray-900'>
                {script.type}
              </h4>
            </div>

            <div className='rounded-lg bg-gray-50 p-4'>
              <pre className='font-mono text-sm whitespace-pre-wrap text-gray-800'>
                {script.content}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Template Usage Guide */}
      <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
        <h3 className='mb-4 text-xl font-semibold text-gray-900'>
          📋 Professional Template Usage Guide
        </h3>

        <div className='space-y-4'>
          <div className='rounded-lg border border-gray-200 bg-white p-4'>
            <h4 className='mb-2 font-medium text-gray-900'>
              🎯 Initial Outreach Email
            </h4>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>
                • <strong>Personalization:</strong> Replace [Industry] with
                specific sector (automotive, manufacturing, etc.)
              </li>
              <li>
                • <strong>Local Credibility:</strong> Include 3 local
                manufacturers you've helped in their area
              </li>
              <li>
                • <strong>Specific Numbers:</strong> Use exact statistics from
                similar companies
              </li>
              <li>
                • <strong>Timeframes:</strong> Be specific about your
                availability (not "next week")
              </li>
            </ul>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-4'>
            <h4 className='mb-2 font-medium text-gray-900'>
              📞 Strategic Follow-up Call
            </h4>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>
                • <strong>Permission First:</strong> Always ask if they have
                time before diving in
              </li>
              <li>
                • <strong>Reference Email:</strong> Mention specific details
                from your initial outreach
              </li>
              <li>
                • <strong>Industry Relevance:</strong> Use their specific
                industry examples
              </li>
              <li>
                • <strong>Soft Close:</strong> End by asking for best time to
                discuss in detail
              </li>
            </ul>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-4'>
            <h4 className='mb-2 font-medium text-gray-900'>
              📧 Executive Value Proposition
            </h4>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>
                • <strong>Data-Driven:</strong> Include specific numbers and
                timelines
              </li>
              <li>
                • <strong>Cost Analysis:</strong> Calculate their potential
                savings based on violation type
              </li>
              <li>
                • <strong>Social Proof:</strong> Reference specific local
                success stories
              </li>
              <li>
                • <strong>Low Commitment:</strong> Emphasize "no commitment" for
                the analysis
              </li>
            </ul>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-4'>
            <h4 className='mb-2 font-medium text-gray-900'>
              💼 LinkedIn Strategy
            </h4>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>
                • <strong>Profile Research:</strong> Check their recent posts
                and activity
              </li>
              <li>
                • <strong>Industry Context:</strong> Reference current industry
                challenges
              </li>
              <li>
                • <strong>Credibility Building:</strong> Include specific
                metrics and timeframes
              </li>
              <li>
                • <strong>Value Promise:</strong> Offer insights, not just
                connection
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Campaign Controls */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h3 className='mb-4 text-xl font-semibold text-gray-900'>
          Campaign Controls
        </h3>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <button className='flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700'>
            <Zap className='h-4 w-4' />
            Start Lead Generation
          </button>

          <button className='flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700'>
            <Users className='h-4 w-4' />
            Assign AI Staff
          </button>

          <button className='flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-white transition-colors hover:bg-purple-700'>
            <BarChart3 className='h-4 w-4' />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
