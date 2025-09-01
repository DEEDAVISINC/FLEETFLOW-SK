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
    purpose: 'Alert shippers to carrier crisis and establish immediate credibility',
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
📞 555-0103 | 📧 desiree@depointe.com`
    },
    keyPoints: [
      'Personal introduction with credibility',
      'Specific crisis details from FMCSA data',
      'Clear problem statement with quantified risks',
      'Solution benefits with immediate value',
      'Handle common objections proactively',
      'Clear next step with specific timing'
    ],
    expectedMetrics: {
      connectionRate: '35%+ (crisis urgency drives answers)',
      engagementRate: '70%+ (problem relevance)',
      meetingRate: '25%+ (immediate need + credibility)'
    }
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
📞 555-0103 | 📧 desiree@depointe.com`
    },
    keyPoints: [
      'Reference previous email communication',
      'Use social proof with specific examples',
      'Position as specialists, not just brokers',
      'Handle objections with empathy and solutions',
      'Offer multiple engagement options',
      'Follow up immediately with promised materials'
    ],
    expectedMetrics: {
      connectionRate: '25%+ (follow-up timing)',
      engagementRate: '60%+ (relationship building)',
      meetingRate: '15%+ (trust development)'
    }
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
📞 555-0103 | 📧 desiree@depointe.com`
    },
    keyPoints: [
      'Open with relationship-building question',
      'Create urgency with specific timeline',
      'Present quantified value proposition',
      'Handle objections with specific responses',
      'Offer clear next steps with options',
      'Follow up with specific timeline'
    ],
    expectedMetrics: {
      connectionRate: '20%+ (high-value targeting)',
      engagementRate: '80%+ (decision-making focus)',
      meetingRate: '30%+ (closing urgency + value)'
    }
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
📞 555-0103 | 📧 desiree@depointe.com`
    },
    keyPoints: [
      'Soft, non-pressure opening',
      'Create urgency with limited-time offer',
      'Present clear value with specific benefits',
      'Handle final objections with empathy',
      'Offer clear decision options',
      'Schedule specific final follow-up'
    ],
    expectedMetrics: {
      connectionRate: '15%+ (final attempt timing)',
      engagementRate: '50%+ (limited-time urgency)',
      meetingRate: '20%+ (scarcity and final push)'
    }
  }
];

export default desperateShipperPhoneScripts;
