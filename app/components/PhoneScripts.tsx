'use client';

interface PhoneScript {
  id: string;
  name: string;
  timing: string;
  purpose: string;
  category: string;
  script: {
    introduction: string;
    problemIdentification: string;
    solutionPresentation: string;
    objectionHandling: string;
    callToAction: string;
    closing: string;
  };
  keyPoints: string[];
  expectedMetrics: {
    connectionRate: string;
    engagementRate: string;
    meetingRate: string;
  };
}

export const desperateShipperPhoneScripts: PhoneScript[] = [
  // PHONE SCRIPT 1: Crisis Alert Call (Day 1 - Immediate Response)
  {
    id: 'crisis_alert_call_1',
    name: 'Crisis Alert Phone Script #1',
    timing: 'Day 1 - Immediate Response',
    purpose:
      'Alert shippers to carrier crisis and establish immediate credibility',
    category: 'crisis_alert',
    script: {
      introduction: `Hi [Decision Maker Name], this is Desiree from DEPOINTE/Freight 1st Direct. I'm calling because our FMCSA monitoring system has detected a critical situation with your carrier that requires immediate attention. Do you have a moment to discuss?`,

      problemIdentification: `We noticed that [Specific Carrier Name]'s insurance is expiring on [Date], which puts [X]% of your shipments at immediate risk. This could mean:

• Carrier loses operating authority
• Deliveries delayed by 3-5 days
• $50K+ in expedited shipping costs
• Compliance violations and fines
• Customer satisfaction issues

Are you aware of this situation?`,

      solutionPresentation: `We're a licensed freight broker specializing in crisis situations like yours. We have immediate capacity available from fully-insured carriers and can seamlessly replace your at-risk carrier:

✅ **Immediate capacity**: Available within 24 hours
✅ **Rate protection**: No price increases during transition
✅ **Compliance guarantee**: Full DOT/SAFETY certification
✅ **Dedicated support**: Single point of contact
✅ **Service continuity**: Zero disruption to your operations`,

      objectionHandling: `I understand you may be hesitant to make changes during a crisis. The beauty of our approach is we handle everything - you maintain the same service levels while we manage the transition. We've helped 150+ companies in similar situations avoid any service disruptions.

[If they mention timing]: "This is exactly why we're calling now - we can prevent the crisis before it affects your operations."

[If they mention cost]: "Our rates are competitive and we offer rate-lock protection during the transition period."

[If they mention current carrier]: "We respect your existing relationships. Our goal is to ensure continuity while you address this insurance issue."`,

      callToAction: `To prevent any disruption, I'd like to schedule a brief 15-minute call with our crisis response team tomorrow. We can review your specific carrier situation and present immediate capacity options.

What time works best for you tomorrow - morning or afternoon?`,

      closing: `Thank you for your time. Carrier insurance issues don't wait, and neither should your solution. I'll follow up with an email confirming our conversation and including some resources about carrier insurance requirements.

Best regards,
Desiree - Crisis Response Specialist
DEPOINTE/Freight 1st Direct
📞 555-0103 | 📧 desiree@depointe.com`,
    },
    keyPoints: [
      'Personal introduction with credibility',
      'Specific crisis details from FMCSA data',
      'Clear problem statement with quantified risks',
      'Solution benefits with immediate value',
      'Handle common objections proactively',
      'Clear next step with specific timing',
    ],
    expectedMetrics: {
      connectionRate: '35%+ (crisis urgency drives answers)',
      engagementRate: '70%+ (problem relevance)',
      meetingRate: '25%+ (immediate need + credibility)',
    },
  },

  // PHONE SCRIPT 2: Relationship Building Call (Day 3-7 - Follow-up)
  {
    id: 'relationship_building_call_2',
    name: 'Relationship Building Phone Script #2',
    timing: 'Day 3-7 - Follow-up',
    purpose: 'Build trust and provide detailed solution positioning',
    category: 'relationship',
    script: {
      introduction: `Hello [Decision Maker Name], this is Desiree from DEPOINTE/Freight 1st Direct. I sent you an email about [Specific Carrier Name]'s insurance situation and wanted to follow up personally. Have you had a chance to review it?`,

      problemIdentification: `I wanted to make sure you fully understand the risks. When [Carrier]'s insurance expires on [Date], they could:

• Lose their operating authority overnight
• Have shipments rejected at state lines
• Face immediate fines from FMCSA
• Leave you without transportation capacity

This happened to [Similar Company] last quarter - they lost $75K in one week due to expedited shipping costs alone.`,

      solutionPresentation: `We specialize in these exact situations and have helped prevent 150+ carrier crises this year. Our crisis response program includes:

🎯 **Immediate Assessment**: Free analysis of your carrier dependencies
🎯 **Backup Capacity**: Pre-qualified carriers ready to deploy
🎯 **Rate Protection**: Locked-in rates during transition
🎯 **Compliance Assurance**: Full regulatory protection
🎯 **Dedicated Support**: 24/7 crisis management team

We're not just another broker - we're crisis prevention specialists.`,

      objectionHandling: `I completely understand your concerns. Let me address that directly:

[If they say "We're happy with our current carrier"]: "That's great to hear. We're not here to replace a good carrier, but to protect you from the insurance risk. Think of us as insurance for your transportation."

[If they say "We don't have time for this"]: "I completely understand - that's why we handle everything. You focus on your business while we manage the transition."

[If they say "This sounds expensive"]: "Actually, most of our clients save money because we eliminate expedited shipping costs and provide better long-term rates."`,

      callToAction: `I'd love to show you how we've helped companies just like yours. Would you be open to a quick 10-minute call with one of our clients who went through a similar situation? Or would you prefer I send you their case study first?

What works better for your schedule?`,

      closing: `Thank you for taking my call. I'll send you that case study within the next hour. Please don't hesitate to reach out if you have any questions about [Carrier]'s situation.

Looking forward to speaking with you soon.

Best regards,
Desiree - Relationship Specialist
DEPOINTE/Freight 1st Direct
📞 555-0103 | 📧 desiree@depointe.com`,
    },
    keyPoints: [
      'Reference previous email communication',
      'Use social proof with specific examples',
      'Position as specialists, not just brokers',
      'Handle objections with empathy and solutions',
      'Offer multiple engagement options',
      'Follow up immediately with promised materials',
    ],
    expectedMetrics: {
      connectionRate: '25%+ (follow-up timing)',
      engagementRate: '60%+ (relationship building)',
      meetingRate: '15%+ (trust development)',
    },
  },

  // PHONE SCRIPT 3: Closing Call (Day 15-25 - High-Value Prospects)
  {
    id: 'closing_call_3',
    name: 'Closing Phone Script #3',
    timing: 'Day 15-25 - High-Value Prospects',
    purpose: 'Close deals with urgency and specific value propositions',
    category: 'closing',
    script: {
      introduction: `Hi [Decision Maker Name], Desiree from DEPOINTE/Freight 1st Direct. I know you've been considering our proposal to protect your shipping operations from [Carrier]'s insurance crisis. How are you feeling about the situation?`,

      problemIdentification: `We're now [X] days from [Carrier]'s insurance expiration, and I wanted to make sure you have a solid plan in place. Without action, you could face:

• **Service disruption**: 40% of your shipments affected
• **Cost explosion**: $50K+ in emergency shipping
• **Customer impact**: Delivery delays and complaints
• **Compliance risk**: FMCSA fines and penalties
• **Competitive disadvantage**: While others are protected

Time is running out to avoid this becoming a crisis.`,

      solutionPresentation: `Based on our analysis of your shipping patterns, we can provide:

💰 **Immediate Protection**: Capacity guarantee starting [Date]
💰 **Cost Savings**: $[Amount] vs. emergency expedited costs
💰 **Service Guarantee**: 99.5% on-time delivery
💰 **Compliance Coverage**: Full regulatory protection
💰 **Dedicated Support**: Your personal crisis management team

This isn't just insurance - it's proactive protection that pays for itself.`,

      objectionHandling: `Let me address your main concern:

[If budget is the issue]: "Our protection program actually saves most clients money within the first 30 days by eliminating expedited shipping costs."

[If they're still evaluating]: "I understand the decision process. Let me ask - what's the one thing holding you back from moving forward today?"

[If they mention timing]: "Perfect timing actually works in your favor. We can implement this before [Carrier]'s expiration becomes critical."

[If they want more information]: "I'd be happy to provide that. What specific information would give you the confidence to move forward?"`,

      callToAction: `To get you protected before it's too late, I recommend we move forward with our Crisis Protection Program today. We can have capacity confirmed within 24 hours and your first shipment protected by [Date].

Shall we get the paperwork started, or would you like to speak with [Client Reference] first about their experience?`,

      closing: `Thank you for your time and consideration. The clock is ticking on [Carrier]'s insurance, and prevention is always better than crisis management.

I'll follow up with you [tomorrow/next week] to see if you have any final questions before the deadline.

Best regards,
Desiree - Closing Specialist
DEPOINTE/Freight 1st Direct
📞 555-0103 | 📧 desiree@depointe.com`,
    },
    keyPoints: [
      'Open with relationship-building question',
      'Create urgency with specific timeline',
      'Present quantified value proposition',
      'Handle objections with specific responses',
      'Offer clear next steps with options',
      'Follow up with specific timeline',
    ],
    expectedMetrics: {
      connectionRate: '20%+ (high-value targeting)',
      engagementRate: '80%+ (decision-making focus)',
      meetingRate: '30%+ (closing urgency + value)',
    },
  },

  // PHONE SCRIPT 4: Re-engagement Call (Day 26-30 - Final Push)
  {
    id: 'reengagement_call_4',
    name: 'Re-engagement Phone Script #4',
    timing: 'Day 26-30 - Final Push',
    purpose: 'Re-engage prospects with final urgency and special offers',
    category: 'reengagement',
    script: {
      introduction: `Hello [Decision Maker Name], Desiree from DEPOINTE/Freight 1st Direct. I hope this is a good time. We've been working to help companies prepare for carrier insurance situations like the one with [Carrier], and I wanted to touch base with you personally.`,

      problemIdentification: `We're now just days away from [Carrier]'s insurance expiration, and I wanted to make sure you're fully protected. Many companies in your position are taking proactive steps right now to avoid what could become a very expensive situation.

Have you had a chance to review our crisis protection proposal?`,

      solutionPresentation: `To make this as easy as possible for you, we're offering our Premium Crisis Package at a special rate for the next 48 hours:

🎯 **Immediate Implementation**: Start protection today
🎯 **Extended Rate Lock**: 6-month rate protection guarantee
🎯 **Priority Support**: Dedicated crisis response team
🎯 **Free Assessment**: Complimentary carrier dependency analysis
🎯 **Success Guarantee**: 100% satisfaction or we pay the difference

This limited-time offer expires [Date/Time].`,

      objectionHandling: `I understand completely. Let me address that:

[If they're still deciding]: "The best time to protect your business was yesterday. The second best time is right now, before the crisis hits."

[If budget concerns]: "This protection program typically saves clients $25K-$50K in the first 60 days by preventing emergency shipping costs."

[If they need more time]: "I respect that. However, [Carrier]'s insurance clock doesn't stop. What specific information would help you decide today?"

[If they're not interested]: "I completely understand. May I ask what specifically is making you hesitant about protecting your transportation?"`,

      callToAction: `To take advantage of this limited-time offer, we need to get your approval today. The paperwork takes 10 minutes, and we can have capacity confirmed by end of day.

Shall we move forward with the Premium Crisis Package, or would you prefer to start with our basic protection plan?`,

      closing: `Thank you for your time. This situation with [Carrier] is time-sensitive, and we're here to help you avoid what could be a very costly disruption.

I'll follow up one final time [tomorrow] with the details of our special offer.

Best regards,
Desiree - Final Opportunity Specialist
DEPOINTE/Freight 1st Direct
📞 555-0103 | 📧 desiree@depointe.com`,
    },
    keyPoints: [
      'Soft, non-pressure opening',
      'Create urgency with limited-time offer',
      'Present clear value with specific benefits',
      'Handle final objections with empathy',
      'Offer clear decision options',
      'Schedule specific final follow-up',
    ],
    expectedMetrics: {
      connectionRate: '15%+ (final attempt timing)',
      engagementRate: '50%+ (limited-time urgency)',
      meetingRate: '20%+ (scarcity and final push)',
    },
  },
];

// PHONE SCRIPTS FOR NEW BUSINESSES CAMPAIGN
export const newBusinessPhoneScripts: PhoneScript[] = [
  // PHONE SCRIPT 1: Quick Start Call (Day 2 - Immediate Response)
  {
    id: 'quick_start_call_1',
    name: 'Quick Start Call #1',
    timing: 'Day 2 - Immediate Response',
    purpose: 'Offer immediate freight setup for new businesses',
    category: 'quick_start',
    script: {
      introduction: `Hi [Founder Name], this is Logan from DEPOINTE/Freight 1st Direct. I sent you an email about getting your freight operations running this week. Did you get a chance to look at it?`,

      problemIdentification: `I completely understand - as a fellow entrepreneur who started [Company Name] recently, I know how overwhelming it can be getting all the pieces in place. Freight logistics is one of those critical pieces that can make or break your early success.

Are you currently handling shipping yourself, or do you have someone helping you with that?`,

      solutionPresentation: `That's exactly why I wanted to reach out personally. We specialize in helping NEW businesses like yours get freight solutions FAST - often same-week setup. Here's what we can do:

🎯 **Immediate Setup** - Get you shipping within 3 business days
🎯 **30-Day Free Trial** - Test our service completely risk-free
🎯 **Founder-to-Founder Support** - I started my own business, so I get the challenges
🎯 **Flexible Terms** - No long-term contracts if you're not ready
🎯 **Startup Pricing** - Rates designed for growing businesses
🎯 **Growth Partnership** - We scale with you as your business grows

We're not just another carrier - we're growth partners for entrepreneurs.`,

      objectionHandling: `I get that completely. Many of our new business clients start exactly like you - focused on product and customers, with shipping as an afterthought.

[If they say "We're handling it ourselves"]: "That's impressive! Many founders start that way. The challenge comes when volume picks up and shipping becomes a bottleneck. We've helped businesses avoid that by having a reliable partner in place from day one."

[If they say "We're too new"]: "That's actually perfect timing! Getting reliable logistics established early prevents the headaches that come with rapid growth."

[If they say "Budget concerns"]: "I understand cash flow challenges. That's why we offer flexible terms and can often get you better rates than going direct with carriers."

[If they say "We're not ready yet"]: "No pressure at all. When would be a good time to revisit this? We can put you on our priority list for when you're ready to scale."`,

      callToAction: `To get you started immediately, we could schedule a quick 15-minute call to understand your current shipping needs and show you exactly how we can help. What time works best for you this week?

Or if you'd prefer, I can send you a customized quick-start plan based on what you've shared about [Company Name].`,

      closing: `Thank you for taking my call. I know your time is valuable as you're building [Company Name]. I'll follow up with that quick-start plan and a couple of time options for our call.

Looking forward to potentially being part of your growth story.

Best regards,
Logan - New Business Growth Partner
DEPOINTE/Freight 1st Direct
📞 555-0105 | 📧 logan@depointe.com`,
    },
    keyPoints: [
      'Founder-to-founder connection',
      'Immediate value and quick setup focus',
      'Flexible terms and low commitment',
      'Growth partnership positioning',
      'Multiple engagement options',
    ],
    expectedMetrics: {
      connectionRate: '35%+ (entrepreneurial accessibility)',
      engagementRate: '75%+ (shared founder experience)',
      meetingRate: '28%+ (immediate need + quick solution)',
    },
  },

  // PHONE SCRIPT 2: Growth Partnership Call (Day 5 - Relationship Building)
  {
    id: 'growth_partnership_call_2',
    name: 'Growth Partnership Call #2',
    timing: 'Day 5 - Relationship Building',
    purpose: 'Build long-term growth partnership relationship',
    category: 'partnership',
    script: {
      introduction: `Hi [Founder Name], Logan from DEPOINTE/Freight 1st Direct. How's the business building going? I wanted to follow up on our conversation about getting your freight operations set up for growth.`,

      problemIdentification: `As you're building [Company Name], I imagine you're thinking about:

• How to keep shipping costs predictable as volume grows
• Ensuring customers get reliable delivery every time
• Having logistics that can scale with your business
• Avoiding the freight nightmares that slow down growth

Am I hitting on some of the challenges you're thinking about?`,

      solutionPresentation: `That's exactly what we help new businesses avoid. We create GROWTH PARTNERSHIPS, not just service agreements:

🌱 **Your First 6 Months**: Basic coverage + free strategic consultation
🌱 **Months 7-12**: Volume discounts + dedicated account management
🌱 **Months 13-24**: Technology integration + optimization services
🌱 **Long-term**: Preferred partner status + co-marketing opportunities

We literally grow our business as you grow yours. Your success = our success.`,

      objectionHandling: `I hear you. Let me address that specifically:

[If they mention being too early]: "Actually, this is the perfect time. Having reliable logistics from day one prevents the bottlenecks that come with rapid growth."

[If budget is a concern]: "Our partnerships are designed to be cash-flow friendly. You only pay for what you ship, and rates often decrease as volume increases."

[If they're handling it themselves]: "That's smart! Many successful founders start that way. We can be your backup plan - ready when you need to scale."

[If they want to wait]: "No problem at all. When do you anticipate needing more shipping capacity? We can plan accordingly."`,

      callToAction: `Would you like to see a customized growth roadmap for [Company Name]? I can create one that shows exactly how freight logistics fits into your expansion plans.

I can either walk you through it on a quick call, or send it over for you to review first. What works better for you?`,

      closing: `Thanks for the conversation. I enjoy talking with fellow entrepreneurs building something new. I'll send you that growth roadmap and follow up in a few days to see if it resonates with your plans.

Keep crushing it with [Company Name]!

Best regards,
Logan - Growth Partnership Specialist
DEPOINTE/Freight 1st Direct
📞 555-0105 | 📧 logan@depointe.com`,
    },
    keyPoints: [
      'Entrepreneurial language and shared experience',
      'Long-term partnership focus',
      'Growth-oriented solutions',
      'Flexible timing and low pressure',
      'Multiple follow-up options',
    ],
    expectedMetrics: {
      connectionRate: '28%+ (relationship building timing)',
      engagementRate: '65%+ (growth conversation)',
      meetingRate: '22%+ (partnership interest)',
    },
  },

  // PHONE SCRIPT 3: Success Story Call (Day 10 - Proof & Urgency)
  {
    id: 'success_story_call_3',
    name: 'Success Story Call #3',
    timing: 'Day 10 - Proof & Urgency',
    purpose: 'Share success stories and create urgency for partnership',
    category: 'proof_urgency',
    script: {
      introduction: `Hello [Founder Name], this is Logan from DEPOINTE/Freight 1st Direct. I hope this is a good time. I wanted to share a quick success story that might interest you as you're building [Company Name].`,

      problemIdentification: `I know you're focused on growing [Company Name], and I wanted to share how one of our new business clients avoided some common freight pitfalls. They started very similar to you - [X] months ago, in the same industry, with the same growth ambitions.

Their biggest challenge was shipping becoming a bottleneck as they scaled. Sound familiar?`,

      solutionPresentation: `They partnered with us early, and here's what happened:

📈 **Month 1-3**: 35% cost savings + reliable delivery
📈 **Month 4-6**: 200% shipping volume growth without issues
📈 **Month 7-12**: Expanded to 3 new markets seamlessly
📈 **Month 13-18**: 300% business growth with 40% higher margins
📈 **Now**: Preferred partner with co-marketing benefits

**Total ROI: 450% on their logistics investment**

The key was having a growth partner in place BEFORE they needed to scale.`,

      objectionHandling: `That's a great question. Let me clarify:

[If they ask about the time commitment]: "We start with flexible month-to-month arrangements. As you grow, we can adjust to annual contracts with better rates."

[If they ask about the cost]: "Their shipping costs actually decreased by 35% because we secured better carrier relationships and optimized their routes."

[If they ask about the business type]: "They were in [similar industry] and started with similar challenges to what you described."

[If they're not ready]: "I understand completely. The offer for our exclusive new business partnership package is available through [date]. We can revisit then."`,

      callToAction: `This exclusive partnership package is only available to the first 50 new businesses this quarter, and we've already helped 35. Would you like to claim one of the remaining spots?

I can either get you set up right now, or schedule a call to walk through the details. What works best for you?`,

      closing: `Thank you for your time. Success stories like this show why timing matters in business partnerships. I'll follow up with the partnership details and see if it makes sense for [Company Name].

Keep building something amazing!

Best regards,
Logan - Success Story Specialist
DEPOINTE/Freight 1st Direct
📞 555-0105 | 📧 logan@depointe.com`,
    },
    keyPoints: [
      'Specific success metrics and timelines',
      'Comparable business examples',
      'Quantified ROI and results',
      'Limited-time urgency',
      'Clear next steps and options',
    ],
    expectedMetrics: {
      connectionRate: '25%+ (value-driven timing)',
      engagementRate: '70%+ (results-focused conversation)',
      meetingRate: '30%+ (proof + urgency combination)',
    },
  },

  // PHONE SCRIPT 4: Partnership Close Call (Day 15 - Final Push)
  {
    id: 'partnership_close_call_4',
    name: 'Partnership Close Call #4',
    timing: 'Day 15 - Final Push',
    purpose: 'Close partnership deal with final urgency and benefits',
    category: 'closing',
    script: {
      introduction: `Hi [Founder Name], Logan from DEPOINTE/Freight 1st Direct. I hope you're having a great week building [Company Name]. I wanted to follow up on our partnership discussion.`,

      problemIdentification: `As you're getting [Company Name] off the ground, I know you're thinking about all the pieces that need to come together for success. Freight logistics is one of those foundational pieces that can either support your growth or hold you back.

Have you given any more thought to getting a reliable logistics partner in place?`,

      solutionPresentation: `I'm glad you asked. Our exclusive new business partnership package includes:

🎯 **6 Months Free Consulting** - Strategic logistics planning
🎯 **25% Preferred Partner Rates** - Below standard pricing
🎯 **Priority Fast-Track Service** - Expedited shipping when needed
🎯 **Monthly Growth Strategy Sessions** - Logistics expertise for your business
🎯 **Free Technology Setup** - Shipping software and tracking
🎯 **Co-Marketing Opportunities** - Joint content and promotions

**Total Value: $12,000+ in savings and services**
**Your Investment: Just getting started with us**

This package is designed specifically for entrepreneurs like you who are building something new.`,

      objectionHandling: `I completely understand. Let me address that:

[If budget is the main concern]: "The partnership actually saves money through better rates and no expedited shipping costs. Plus, the free consulting alone is worth $3,000."

[If they're still evaluating]: "That's smart. What specific information would help you decide? I can provide references from similar businesses or a detailed ROI projection."

[If timing is the issue]: "The beauty of starting now is we can set everything up before you need it. No rush, no pressure - just preparation for growth."

[If they want to wait]: "The exclusive pricing is available through [date]. After that, it goes back to standard rates. We can start small and scale with you."`,

      callToAction: `To lock in this partnership package before it expires, we just need to get your information and set up the initial consultation. I can do that right now if you're ready, or schedule it for a time that works better for you.

What would you prefer - handle it now or schedule for later this week?`,

      closing: `Thank you for considering us as a partner in your entrepreneurial journey. I truly believe we can help [Company Name] avoid the freight headaches that slow down so many growing businesses.

I'll follow up with the partnership details and look forward to potentially being part of your success story.

Keep building!

Best regards,
Logan - Partnership Director
DEPOINTE/Freight 1st Direct
📞 555-0105 | 📧 logan@depointe.com`,
    },
    keyPoints: [
      'Entrepreneurial journey language',
      'Specific package benefits and value',
      'Objection-specific responses',
      'Clear urgency with expiration',
      'Flexible commitment options',
    ],
    expectedMetrics: {
      connectionRate: '22%+ (relationship-based timing)',
      engagementRate: '75%+ (partnership-focused conversation)',
      meetingRate: '32%+ (value + urgency combination)',
    },
  },
];

export default desperateShipperPhoneScripts;
