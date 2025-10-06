/**
 * SHIPPER CLIENT ACQUISITION KNOWLEDGE BASE
 *
 * Comprehensive shipper acquisition strategies tailored for transportation & logistics
 * Focuses on converting shipper prospects across all industries into FleetFlow clients
 *
 * Adapted for: Fleet operators, freight brokers, 3PLs, and logistics service providers
 */

// ==========================================
// SHIPPER BUYING PSYCHOLOGY
// ==========================================

export const SHIPPER_BUYING_PSYCHOLOGY = {
  decisionMakerTypes: [
    {
      role: 'Logistics/Transportation Manager',
      priorities: ['Reliability', 'On-time delivery', 'Communication', 'Problem-solving'],
      painPoints: [
        'Carrier capacity issues during peak',
        'Last-minute cancellations',
        'Poor communication from carriers',
        'Damaged freight and claims process',
        'No real-time visibility'
      ],
      motivators: ['Making their job easier', 'Avoiding escalations to executives', 'Personal reputation protection'],
      decisionCriteria: 'Operational excellence and responsiveness',
      bestApproach: 'Show them how you make them look good to their boss'
    },
    {
      role: 'Procurement/Sourcing Director',
      priorities: ['Cost reduction', 'Contract compliance', 'Risk mitigation', 'Vendor consolidation'],
      painPoints: [
        'Rate volatility and unpredictability',
        'Managing too many vendor relationships',
        'Lack of freight spend visibility',
        'Compliance and insurance verification',
        'Difficult contract negotiations'
      ],
      motivators: ['Documented cost savings', 'Simplified vendor management', 'Risk reduction'],
      decisionCriteria: 'Total cost of ownership and business case ROI',
      bestApproach: 'Lead with data, savings calculators, and risk reduction'
    },
    {
      role: 'Supply Chain Director/VP',
      priorities: ['Strategic partnerships', 'Network optimization', 'Scalability', 'Innovation'],
      painPoints: [
        'Fragmented carrier network',
        'Lack of strategic capacity',
        'Limited visibility across supply chain',
        'Technology integration challenges',
        'Inability to scale during growth'
      ],
      motivators: ['Competitive advantage', 'Board/C-suite presentations', 'Industry recognition'],
      decisionCriteria: 'Strategic value and competitive differentiation',
      bestApproach: 'Position as strategic partner, not just vendor'
    },
    {
      role: 'Operations Manager/Plant Manager',
      priorities: ['Minimal disruption', 'Fast pickup times', 'Flexible scheduling', 'Easy communication'],
      painPoints: [
        'Trucks arriving late or early',
        'Carriers not following dock procedures',
        'Detention and yard management issues',
        'Poor driver behavior',
        'Complicated booking process'
      ],
      motivators: ['Smooth operations', 'Happy warehouse staff', 'Meeting production schedules'],
      decisionCriteria: 'Ease of doing business and operational fit',
      bestApproach: 'Emphasize simplicity, reliability, and driver quality'
    },
    {
      role: 'CFO/Financial Decision Maker',
      priorities: ['Cash flow impact', 'Payment terms', 'Financial stability of vendor', 'Total cost'],
      painPoints: [
        'Unexpected freight cost increases',
        'Budget overruns',
        'Working capital tied up in inventory',
        'Vendor financial instability',
        'Hidden fees and surcharges'
      ],
      motivators: ['Predictable costs', 'Favorable payment terms', 'Financial risk mitigation'],
      decisionCriteria: 'Financial impact and vendor stability',
      bestApproach: 'Emphasize cost predictability, payment flexibility, and financial strength'
    }
  ],

  buyingProcess: {
    awareness: {
      stage: 'Problem Recognition',
      shipperMindset: 'We have a logistics challenge that needs solving',
      triggers: [
        'Current carrier failed or canceled',
        'Rapid business growth outpacing capacity',
        'New product launch requiring logistics',
        'Customer complaints about delivery',
        'Contract renewal approaching',
        'M&A activity creating new needs',
        'Seasonal peak approaching',
        'Compliance issue with current provider'
      ],
      bestActions: [
        'Educational content about their specific problem',
        'Industry benchmark data',
        'Quick response to inquiries',
        'Demonstrate understanding of their industry'
      ]
    },
    consideration: {
      stage: 'Solution Exploration',
      shipperMindset: 'We need to evaluate our options and gather information',
      activities: [
        'RFP/RFQ process initiation',
        'Researching potential carriers',
        'Asking for referrals',
        'Checking carrier safety ratings',
        'Evaluating technology capabilities',
        'Comparing pricing models'
      ],
      bestActions: [
        'Respond to RFPs with tailored solutions',
        'Provide industry-specific case studies',
        'Offer facility tours and meet-the-team sessions',
        'Share carrier safety data and certifications',
        'Demonstrate technology platform'
      ]
    },
    evaluation: {
      stage: 'Vendor Comparison',
      shipperMindset: 'We are comparing 3-5 providers and narrowing down',
      evaluationCriteria: [
        'Service capabilities and coverage',
        'Pricing and total cost of ownership',
        'Technology and visibility',
        'References and track record',
        'Financial stability and insurance',
        'Cultural fit and communication style',
        'Onboarding process and timeline'
      ],
      bestActions: [
        'Provide detailed capability presentations',
        'Arrange reference calls with similar customers',
        'Create custom pilot program proposals',
        'Demonstrate technology integration',
        'Share insurance certificates and financial statements',
        'Assign dedicated account manager for evaluation'
      ]
    },
    decision: {
      stage: 'Final Selection',
      shipperMindset: 'We are ready to choose but need final validation',
      finalHurdles: [
        'Legal contract review',
        'Insurance verification',
        'Technology integration scoping',
        'Pricing negotiation',
        'Service level agreement (SLA) definition',
        'Executive approval for spend',
        'Procurement system setup'
      ],
      bestActions: [
        'Pre-approve standard contract terms',
        'Provide expedited insurance documentation',
        'Assign technical implementation support',
        'Offer flexible pricing with volume commitments',
        'Define clear SLAs and performance metrics',
        'Create executive summary for approvals',
        'Streamline onboarding process'
      ]
    }
  },

  shipperSegmentationModel: {
    transactional: {
      type: 'Spot Market Shippers',
      characteristics: ['Price-sensitive', 'No long-term contracts', 'Irregular shipping needs'],
      approach: 'Quick quotes, competitive pricing, easy booking',
      conversionStrategy: 'Win with speed and simplicity, upsell to contract later'
    },
    relationship: {
      type: 'Preferred Carrier Programs',
      characteristics: ['Regular shipping needs', 'Volume commitments', 'Partnership mindset'],
      approach: 'Dedicated account management, SLAs, volume discounts',
      conversionStrategy: 'Emphasize reliability and relationship value'
    },
    strategic: {
      type: 'Strategic Logistics Partners',
      characteristics: ['Complex supply chains', 'Multiple services', 'Co-innovation opportunities'],
      approach: 'Executive relationships, technology integration, continuous improvement',
      conversionStrategy: 'Position as extension of their supply chain team'
    }
  }
};

// ==========================================
// SHIPPER PAIN POINTS BY INDUSTRY
// ==========================================

export const INDUSTRY_SPECIFIC_PAIN_POINTS = {
  automotive: {
    industry: 'Automotive Manufacturing & Parts',
    criticalPainPoints: [
      'Just-in-Time (JIT) delivery failures causing production line shutdowns',
      'Specialized equipment requirements (flatbeds, curtain-side, climate control)',
      'Strict appointment windows and detention penalties',
      'Quality requirements and damage prevention',
      'Complex EDI and technology integration needs',
      'High insurance requirements ($2M+ auto liability)',
      'Supplier portal compliance and certifications (IATF 16949, ISO 9001)'
    ],
    valuePropositions: [
      '99.8% on-time delivery for JIT operations',
      'Dedicated automotive equipment fleet',
      'EDI/API integration with OEM systems',
      'Specialized handling and damage prevention protocols',
      'ISO 9001 and IATF 16949 certified operations',
      '$5M insurance coverage with automotive-specific policies',
      'Dedicated account team familiar with automotive requirements'
    ],
    talkingPoints: [
      'We understand that one missed pickup can shut down an entire production line',
      'Our automotive-specific training ensures drivers understand dock protocols',
      'We have EDI integration with Ford, GM, Stellantis, and Toyota systems',
      'Our average detention time is 47 minutes vs. industry average of 2.3 hours'
    ]
  },

  manufacturing: {
    industry: 'Manufacturing & Industrial',
    criticalPainPoints: [
      'Inbound raw material timing coordination',
      'Finished goods distribution network complexity',
      'Specialized handling for industrial equipment',
      'Cross-docking and consolidation needs',
      'Seasonal demand fluctuations',
      'Heavy/oversized freight expertise',
      'Multi-stop routing optimization'
    ],
    valuePropositions: [
      'Integrated inbound and outbound logistics management',
      'Cross-dock and consolidation services',
      'Heavy haul and specialized equipment capabilities',
      'Flex capacity for seasonal peaks',
      'Route optimization reducing costs by 18-25%',
      'Real-time inventory visibility',
      'Dedicated equipment for regular lanes'
    ],
    talkingPoints: [
      'We manage both your inbound and outbound freight as a single network',
      'Our cross-dock operations reduce handling costs by up to 30%',
      'We have experience with heavy machinery up to 45,000 lbs',
      'Our AI routing saves manufacturers an average of $8,400 per month'
    ]
  },

  retail: {
    industry: 'Retail & E-commerce',
    criticalPainPoints: [
      'Store delivery time windows (early morning requirements)',
      'No appointment scheduling causing delays',
      'Lack of delivery visibility for customer service',
      'Damaged freight affecting sellable inventory',
      'Reverse logistics and returns handling',
      'Seasonal peak capacity crunch (Q4 holidays)',
      'Liftgate and residential delivery requirements'
    ],
    valuePropositions: [
      'Early morning delivery capabilities (4AM-7AM)',
      'No-appointment delivery to retail stores',
      'Real-time tracking with customer notification',
      'Claims rate under 0.5% (industry avg 2-3%)',
      'Full reverse logistics and returns management',
      'Guaranteed capacity during peak seasons',
      'Liftgate-equipped fleet for no-dock locations'
    ],
    talkingPoints: [
      'We deliver to 2,300+ retail locations with 98.7% on-time performance',
      'Our real-time tracking gives your customers Amazon-level visibility',
      'We have dedicated peak-season capacity reserved for retail clients',
      'Our damage rate is 68% lower than the industry average'
    ]
  },

  food_beverage: {
    industry: 'Food & Beverage',
    criticalPainPoints: [
      'Temperature-controlled requirements (frozen, refrigerated, ambient)',
      'FSMA compliance and traceability',
      'Strict sanitation and food safety standards',
      'Short shelf-life requiring fast transit',
      'HACCP certification requirements',
      'Pallet scanning and chain of custody documentation',
      'Rejected loads due to temperature excursions'
    ],
    valuePropositions: [
      'FDA-compliant temperature-controlled fleet',
      'FSMA-compliant tracking and documentation',
      'AIB and SQF certified facilities and operations',
      'Real-time temperature monitoring with alerts',
      'Chain of custody documentation for full traceability',
      'GPS-validated pallet scanning',
      'Zero rejected loads in past 18 months'
    ],
    talkingPoints: [
      'We maintain FSMA-compliant traceability from pickup to delivery',
      'Our reefer fleet has 99.2% temperature compliance',
      'We provide automated temperature monitoring with instant alerts',
      'Our food safety protocols meet the strictest retailer requirements (Walmart, Costco, Whole Foods)'
    ]
  },

  pharmaceutical: {
    industry: 'Pharmaceutical & Healthcare',
    criticalPainPoints: [
      'FDA compliance and validation requirements',
      'Controlled substance tracking (DEA regulations)',
      'Temperature mapping and qualification',
      'Chain of custody and security requirements',
      'Serialization and track-and-trace',
      'High-value cargo theft prevention',
      'Regulatory audit preparation'
    ],
    valuePropositions: [
      'FDA-validated temperature-controlled shipping',
      'DEA-compliant controlled substance transport',
      'Full chain of custody documentation',
      'Real-time temperature and location monitoring',
      'High-security protocols and theft prevention',
      'Audit-ready documentation and reporting',
      '$10M cargo insurance coverage'
    ],
    talkingPoints: [
      'We maintain FDA-validated shipping protocols for pharmaceutical products',
      'Our controlled substance tracking meets all DEA requirements',
      'We provide complete chain of custody documentation for regulatory audits',
      'Our high-security protocols have resulted in zero theft incidents'
    ]
  },

  chemicals: {
    industry: 'Chemicals & Hazmat',
    criticalPainPoints: [
      'Hazmat certifications and compliance (DOT, EPA, OSHA)',
      'Specialized equipment for bulk liquids or dangerous goods',
      'Emergency response planning and incident management',
      'SDS/MSDS documentation and handling',
      'Carrier safety ratings and violations',
      'Insurance requirements ($5M+ for hazmat)',
      'Limited carrier availability for hazmat'
    ],
    valuePropositions: [
      'Full hazmat certification (all classes)',
      'Specialized equipment for bulk and packaged chemicals',
      '24/7 emergency response team',
      'CHEMTREC partnership for incident management',
      'Safety rating of 95+ (top 5% of carriers)',
      '$5M hazmat insurance coverage',
      'Dedicated hazmat-certified drivers'
    ],
    talkingPoints: [
      'We are certified to haul all nine hazmat classes',
      'Our safety rating is in the top 5% of all hazmat carriers',
      'We have 24/7 emergency response with CHEMTREC partnership',
      'Our specialized training has resulted in zero hazmat incidents in 4+ years'
    ]
  },

  construction: {
    industry: 'Construction & Building Materials',
    criticalPainPoints: [
      'Job site access challenges (unpaved roads, tight spaces)',
      'Delivery timing coordination with construction schedules',
      'Heavy/oversized loads requiring specialized equipment',
      'Debris and return haul requirements',
      'Weather-related delivery delays',
      'Liftgate and offloading equipment needs',
      'Multiple stop deliveries to job sites'
    ],
    valuePropositions: [
      'Specialized construction delivery experience',
      'Flatbed and heavy haul equipment',
      'Liftgate and moffett-equipped trucks',
      'Flexible scheduling for job site coordination',
      'Debris removal and backhaul services',
      'GPS routing for difficult access locations',
      'Multi-stop route optimization'
    ],
    talkingPoints: [
      'We deliver to 500+ construction sites monthly with 96% on-time performance',
      'Our drivers are trained for challenging job site access',
      'We provide liftgate service for locations without loading docks',
      'Our flexible scheduling adapts to your construction timelines'
    ]
  },

  technology: {
    industry: 'Technology & Electronics',
    criticalPainPoints: [
      'High-value cargo requiring enhanced security',
      'Theft prevention and cargo tracking',
      'Fragile/sensitive electronics handling',
      'White glove delivery and installation',
      'Rapid delivery for critical equipment',
      'International coordination for global supply chains',
      'Asset recovery and return logistics'
    ],
    valuePropositions: [
      'High-security protocols with GPS tracking',
      'White glove delivery and installation services',
      'Climate-controlled equipment for sensitive electronics',
      'Expedited and hotshot services',
      'International freight forwarding',
      'Asset recovery and ITAD (IT Asset Disposition)',
      '$10M cargo insurance for high-value electronics'
    ],
    talkingPoints: [
      'We provide high-security transport for technology cargo valued at $1M+',
      'Our white glove service includes installation and packaging removal',
      'We have hotshot capabilities for critical equipment with 4-hour response',
      'Our theft prevention protocols include GPS monitoring and driver verification'
    ]
  }
};

// ==========================================
// SHIPPER OBJECTION HANDLING
// ==========================================

export const SHIPPER_OBJECTIONS = {
  pricing: {
    objection: "Your rates are higher than other carriers we've quoted",
    rootCause: 'Price shopping, budget constraints, or lack of value perception',
    responseFramework: {
      acknowledge: "I appreciate you being transparent about pricing. That's an important factor.",
      pivot: "Let me ask - what's your experience been with the lowest-priced carrier in the past?",
      educate: "Most shippers discover that total cost goes beyond the line-haul rate. When you factor in claims, on-time performance, and customer service, our total cost is typically 12-18% lower.",
      prove: "Would you be open to a side-by-side total cost analysis? I can show you exactly where the savings come from.",
      close: "Many of our best clients initially thought we were more expensive - until they saw the total cost difference."
    },
    proofPoints: [
      'Claims rate of 0.4% vs. industry average of 2.8% saves $47 per shipment',
      'On-time delivery of 98.4% reduces expedite costs by $1,200/month',
      'Proactive communication reduces customer service time by 6 hours/week',
      'Technology integration saves 2.5 hours per week in manual data entry'
    ]
  },

  existingRelationship: {
    objection: "We already have a carrier/broker we're happy with",
    rootCause: 'Incumbent relationship, risk aversion, or no perceived need to change',
    responseFramework: {
      acknowledge: "That's great that you have a good relationship. What do you like most about working with them?",
      validate: "Having a reliable carrier is critical. The best shippers actually use multiple carriers for different needs.",
      differentiate: "I'm not suggesting we replace them entirely. We specialize in [X specific capability] which might complement what they do.",
      explore: "Out of curiosity, do you ever have situations where they can't accommodate your needs? Peak seasons, specialized equipment, or certain lanes?",
      position: "Many of our clients use us for 20-30% of their freight - the loads that need specialized attention or backup capacity.",
      nextStep: "Would it make sense to keep us in mind for those situations? I'd love to at least establish a relationship for when you need a backup."
    },
    talkingPoints: [
      'Diversifying carrier base reduces risk',
      'Specialized capabilities for unique needs',
      'Backup capacity during peak seasons',
      'Competitive benchmarking for primary carrier'
    ]
  },

  capacity: {
    objection: "We don't have enough volume to make it worth your while",
    rootCause: 'Low shipping volume, self-perception as "too small", or fear of minimum requirements',
    responseFramework: {
      acknowledge: "I appreciate you bringing that up. Many of our best clients started small.",
      reframe: "We don't have volume minimums. In fact, smaller shippers often get better service because we can be more responsive.",
      value: "What matters more than volume is fit. If we can help you grow, we grow together.",
      future: "Where do you see your shipping needs in 12-24 months? We'd rather grow with you than start when you're already overwhelmed.",
      action: "How about we start with a trial shipment or two? If it works well, great. If not, no hard feelings."
    },
    proofPoints: [
      'We work with shippers from 10 loads/year to 10,000 loads/year',
      'Small to mid-size shippers often need more flexibility, which we excel at',
      'We have account managers dedicated to growing accounts'
    ]
  },

  technology: {
    objection: "We don't need all that technology / Our systems won't integrate",
    rootCause: 'Technology overwhelm, integration concerns, or satisfaction with manual processes',
    responseFramework: {
      acknowledge: "I understand technology can feel overwhelming. We keep it simple.",
      simplify: "You don't have to use everything. Many clients start with basic email updates and grow from there.",
      benefit: "The technology is really about making your life easier - less time on the phone asking 'where's my truck?'",
      integration: "As for integration, we work with [TMS systems]. But if you prefer email and phone, that works perfectly too.",
      trial: "Why don't we start with the basics and see what's useful for you? No pressure to use features you don't need."
    },
    talkingPoints: [
      'Technology should simplify, not complicate',
      'We work with your existing processes',
      'Integration options from API to email',
      'Most clients use 20% of features and love them'
    ]
  },

  rfp: {
    objection: "We're not looking to make changes right now / Send us your info for our RFP",
    rootCause: 'Not in buying mode, no urgency, or using as price check for incumbent',
    responseFramework: {
      acknowledge: "I completely understand. Switching carriers is a big decision and shouldn't be rushed.",
      qualify: "Just so I can send the most relevant information, what's driving the RFP? Contract renewal, service issues, or growth?",
      educate: "In my experience, the best carrier relationships start before there's an urgent need. That way we understand your business.",
      differentiate: "Rather than sending generic information, could I ask a few questions about your specific needs? That way I can customize what I send.",
      future: "Even if timing isn't right now, I'd love to learn about your operation. When challenges do come up, you'll know exactly who to call.",
      ask: "What would have to happen for you to consider adding a new carrier?"
    },
    talkingPoints: [
      'Build relationship before urgency',
      'Customized solutions vs. generic RFP responses',
      'Understanding specific needs takes time',
      'Best to evaluate carriers without pressure'
    ]
  },

  claims: {
    objection: "We've had bad experiences with freight claims in the past",
    rootCause: 'Previous damage/loss experiences, frustration with claims process, lack of trust',
    responseFramework: {
      empathize: "I'm sorry you've had that experience. Dealing with damaged freight is incredibly frustrating.",
      differentiate: "Claims handling is actually one of our biggest differentiators. Can I share how we're different?",
      explain: "First, our damage rate is 0.4% vs. industry average of 2.8%. Second, when claims do happen, we have a 48-hour resolution process with a dedicated claims specialist.",
      prove: "We document everything with photo verification at pickup and delivery. You'll never wonder what happened.",
      guarantee: "And we guarantee our insurance coverage. You're never waiting months for payment.",
      trial: "Would you be open to trying us with a few high-value loads? If we handle them well, you'll have confidence moving forward."
    },
    proofPoints: [
      '0.4% claims rate (6x better than average)',
      '48-hour claims resolution process',
      'Photo documentation at pickup and delivery',
      'Dedicated claims specialist assigned',
      '$1M cargo insurance standard ($10M available)'
    ]
  },

  insurance: {
    objection: "Your insurance requirements are too complicated / expensive",
    rootCause: 'Complex insurance requirements, high premiums, or confusion about coverage',
    responseFramework: {
      acknowledge: "Insurance requirements can definitely be confusing. Let me simplify.",
      explain: "We carry standard $1M cargo and $1M auto liability coverage included. If you need higher limits, we can do that too.",
      value: "The investment in proper insurance actually protects your freight and your business. Under-insured carriers cost you way more when something goes wrong.",
      compare: "Would you rather save $50 per load with an under-insured carrier, or have peace of mind that your $50,000 load is fully covered?",
      documentation: "I can have our insurance certificates to you within 2 hours. It's a simple process on our end."
    },
    talkingPoints: [
      '$1M cargo / $1M auto liability standard',
      'Up to $10M coverage available for high-value cargo',
      'Certificates provided within 2 hours',
      'Zero denied claims due to coverage gaps'
    ]
  },

  creditTerms: {
    objection: "We need Net 60/90 payment terms, not prepay or Net 30",
    rootCause: 'Cash flow management, budget cycles, or large company payment processes',
    responseFramework: {
      acknowledge: "I understand cash flow timing is important for your business.",
      explore: "Help me understand your payment cycle. Is this due to your internal processes or customer payment terms?",
      options: "We can typically accommodate Net 45 terms for qualified customers. For Net 60+, we'd need to review credit references.",
      credit: "If I sent over a simple credit application, could you complete it? That will help us get you the terms you need.",
      value: "Many clients find that our reliability actually improves their cash flow - fewer claims and faster inventory turns.",
      bridge: "In the meantime, would you be open to a few prepaid loads while we get credit approved? That way we can start the relationship."
    },
    talkingPoints: [
      'Net 30 standard, Net 45 for qualified accounts',
      'Net 60+ available with credit review',
      'Quick credit application (10 minutes)',
      'Flexible terms for strategic accounts'
    ]
  },

  documentation: {
    objection: "You require too much paperwork / documentation",
    rootCause: 'Onboarding overwhelm, limited staff time, or bureaucratic frustration',
    responseFramework: {
      empathize: "I get it - the last thing you need is more paperwork. We've streamlined it as much as possible.",
      explain: "Most of what we need is one-time setup: W-9, insurance requirements, and billing contact. Takes about 15 minutes.",
      automate: "After that, everything is automated. You won't fill out paperwork for each shipment.",
      help: "If it's easier, I can sit on a call with you and walk through it together. Makes it go much faster.",
      value: "The upfront documentation actually protects you - it ensures we have the right coverage, billing, and compliance in place."
    },
    talkingPoints: [
      '15-minute onboarding process',
      'Automated documentation after setup',
      'We assist with paperwork completion',
      'Documentation protects your business'
    ]
  }
};

// ==========================================
// SHIPPER ACQUISITION CAMPAIGNS
// ==========================================

export const SHIPPER_NURTURE_CAMPAIGNS = {
  newShipperProspect: {
    campaignName: 'New Shipper Prospect - Cold Outreach',
    objective: 'Build awareness and establish initial relationship',
    duration: '21 days (3 weeks)',
    touchpoints: [
      {
        day: 1,
        channel: 'Email',
        subject: 'Quick question about [Company] freight needs',
        message: `Hi [Name],

I came across [Company] and noticed you [specific observation - recent expansion, job posting, industry news].

I work with [similar companies in their industry] to help them solve [specific pain point]. I'm not sure if this is relevant for you, but I'd love to learn more about your logistics needs.

Would you be open to a quick 15-minute call? I promise it will be valuable even if we don't end up working together.

Best regards,
[Your Name]`,
        notes: 'Personalize with specific company research'
      },
      {
        day: 3,
        channel: 'LinkedIn',
        action: 'Connection request with personalized note',
        message: `Hi [Name], I sent you an email about [topic] but wanted to connect here too. Would love to learn more about [Company]'s logistics strategy.`,
        notes: 'Keep it brief and value-focused'
      },
      {
        day: 5,
        channel: 'Phone',
        action: 'First call attempt with voicemail',
        voicemail: `Hi [Name], this is [Your Name] with [Company]. I sent you an email earlier this week about [topic]. I work with [similar companies] in the [industry] space and would love to learn about your freight needs. My number is [phone]. Thanks!`,
        notes: 'Call between 10-11am or 2-3pm for best results'
      },
      {
        day: 7,
        channel: 'Email',
        subject: 'Resource: [Industry] logistics guide',
        message: `Hi [Name],

I know you're busy, so I wanted to share something valuable even if we don't connect.

I put together a guide on [specific topic relevant to their industry] that our clients have found helpful. You can download it here: [link]

If you're interested in chatting about your logistics challenges, I'm happy to help. If not, no worries - I hope the guide is useful!

Best,
[Your Name]`,
        notes: 'Provide genuine value without expectation'
      },
      {
        day: 10,
        channel: 'Phone',
        action: 'Second call attempt',
        notes: 'Reference previous email and resource shared'
      },
      {
        day: 14,
        channel: 'Email',
        subject: 'Last attempt - feedback welcome',
        message: `Hi [Name],

I've reached out a few times but haven't heard back. I don't want to be a pest, so this will be my last email unless you'd like to connect.

I'm genuinely curious - was my outreach off-base? Do you already have logistics covered? Or just bad timing?

Any feedback would be appreciated, even if it's "not interested."

Thanks for considering,
[Your Name]

P.S. If your situation changes, you know where to find me!`,
        notes: 'Break-up email often gets highest response rate'
      },
      {
        day: 21,
        channel: 'Direct Mail',
        action: 'Send dimensional mailer or handwritten note',
        message: `Hi [Name] - I know I've tried email and phone, but wanted to make one more attempt the old-fashioned way! If you ever need logistics support, we're here. [Include business card and simple capability overview]`,
        notes: 'Physical mail stands out in digital world'
      }
    ]
  },

  warmShipperLead: {
    campaignName: 'Warm Shipper Lead - Inbound Inquiry',
    objective: 'Convert inquiry into qualified opportunity and first shipment',
    duration: '7 days (1 week)',
    touchpoints: [
      {
        day: 1,
        hour: '0 (immediate)',
        channel: 'Email + Phone',
        action: 'Immediate response to inquiry',
        message: `Hi [Name],

Thank you for reaching out! I'd love to learn more about your freight needs and see how we can help.

I'll give you a call in the next 30 minutes to discuss. In the meantime, here are a few quick questions that will help me prepare:

1. What type of freight are you shipping? (product type, weight, dimensions)
2. Where are you shipping from and to? (origin and destination)
3. How often do you ship? (frequency)
4. What's your timeline? (when do you need coverage)

Looking forward to speaking with you!

Best regards,
[Your Name]
[Direct Phone]`,
        notes: 'Speed is critical - respond within 5 minutes if possible'
      },
      {
        day: 1,
        hour: '2',
        channel: 'Phone',
        action: 'Follow-up call if no response',
        notes: 'Reference email sent and offer to answer questions'
      },
      {
        day: 2,
        channel: 'Email',
        subject: 'Customized solutions for [Company]',
        message: `Hi [Name],

Based on our conversation yesterday, I put together some initial thoughts on how we can support [Company]:

[Customized bullet points based on their specific needs]

I've attached:
- Our capabilities overview
- Customer references in [their industry]
- Pricing proposal for the lanes you mentioned

When would be a good time to review this together? I have availability [specific times].

Best regards,
[Your Name]`,
        notes: 'Customize everything - avoid generic responses'
      },
      {
        day: 4,
        channel: 'Phone',
        action: 'Follow-up call to review proposal',
        notes: 'Ask about questions, concerns, and decision timeline'
      },
      {
        day: 5,
        channel: 'Email',
        subject: 'Next steps for getting started',
        message: `Hi [Name],

I wanted to follow up on the proposal I sent over. Do you have any questions or concerns I can address?

If you're ready to move forward, here's what happens next:

1. Quick onboarding (15 minutes) - W-9, insurance, billing contact
2. Set up your account in our system
3. Book your first shipment (we can do this same-day)

Would you like to schedule a time to get started? I can make it as easy as possible.

Let me know!
[Your Name]`,
        notes: 'Make next steps crystal clear'
      },
      {
        day: 7,
        channel: 'Phone + Email',
        action: 'Final follow-up or close',
        notes: 'Either close the deal or understand objections for future follow-up'
      }
    ]
  },

  lostDealReactivation: {
    campaignName: 'Lost Deal Reactivation - Win-Back Campaign',
    objective: 'Re-engage shippers who didn't convert initially',
    duration: '90 days (quarterly touchpoints)',
    touchpoints: [
      {
        day: 30,
        channel: 'Email',
        subject: 'Checking in - how are things going?',
        message: `Hi [Name],

I know we spoke [timeframe] about your logistics needs and the timing wasn't right. I wanted to check in and see how things are going.

Have your freight needs changed? Are you happy with your current carrier solution?

I'd love to catch up briefly if you're open to it. Even if we don't work together, I'm happy to be a resource.

Best,
[Your Name]`,
        notes: 'Low-pressure check-in'
      },
      {
        day: 60,
        channel: 'Email',
        subject: 'New capabilities: [Specific service]',
        message: `Hi [Name],

Quick update - we recently added [new capability that addresses their specific need].

I remembered you mentioned [their pain point] when we spoke before. This might be a good solution for you.

Would you be interested in learning more?

Best regards,
[Your Name]`,
        notes: 'Share relevant updates that match their needs'
      },
      {
        day: 90,
        channel: 'Email',
        subject: '[Industry] trends: What we're seeing in [Quarter]',
        message: `Hi [Name],

I wanted to share some trends we're seeing in the [industry] space this quarter:

- [Trend 1 with data]
- [Trend 2 with data]
- [Trend 3 with data]

Are you experiencing similar challenges? I'd be curious to hear your perspective.

Best,
[Your Name]`,
        notes: 'Position as industry expert and thought leader'
      }
    ]
  }
};

// ==========================================
// VALUE PROPOSITION FRAMEWORKS
// ==========================================

export const VALUE_PROPOSITION_FRAMEWORKS = {
  costReduction: {
    framework: 'Total Cost of Ownership',
    applicableWhen: 'Shipper is price-sensitive or focused on cost savings',
    calculatorComponents: [
      {
        component: 'Base Line-Haul Rate',
        typical: '$2.00/mile',
        yourRate: '$2.15/mile',
        difference: '+$0.15/mile'
      },
      {
        component: 'Fuel Surcharge Efficiency',
        typical: '23% FSC',
        yourRate: '19% FSC (better efficiency)',
        difference: '-$0.08/mile savings'
      },
      {
        component: 'Claims Rate',
        typical: '2.8% ($1,400 per claim avg)',
        yourRate: '0.4% ($560 per claim avg)',
        difference: '$840 per claim savings'
      },
      {
        component: 'On-Time Delivery',
        typical: '92% OTD (8% expedite needed @ $500)',
        yourRate: '98.4% OTD (1.6% expedite)',
        difference: '$32 per load savings'
      },
      {
        component: 'Administrative Time',
        typical: '45 min per load (tracking, communications)',
        yourRate: '12 min per load (automation)',
        difference: '$16.50 labor savings per load'
      }
    ],
    totalCostComparison: {
      scenario: '1000 loads per year, 500 miles average',
      competitorTotalCost: '$1,042,000',
      yourTotalCost: '$996,200',
      netSavings: '$45,800 annually',
      roi: '4.4% cost reduction'
    },
    talkTrack: "While our base rate is slightly higher, let me show you the total cost picture. When you factor in our lower claims rate, better on-time performance, and reduced administrative burden, we actually save you $45,800 per year. That's a 4.4% reduction in your total transportation spend."
  },

  reliability: {
    framework: 'Service Level Agreement (SLA) Value',
    applicableWhen: 'Shipper has experienced service failures or prioritizes reliability',
    performanceMetrics: [
      {
        metric: 'On-Time Pickup',
        industryAverage: '89%',
        yourPerformance: '98.7%',
        impactToShipper: 'Fewer production delays and schedule disruptions'
      },
      {
        metric: 'On-Time Delivery',
        industryAverage: '92%',
        yourPerformance: '98.4%',
        impactToShipper: 'Better customer satisfaction and fewer expedites'
      },
      {
        metric: 'Claims Rate',
        industryAverage: '2.8%',
        yourPerformance: '0.4%',
        impactToShipper: 'Less damaged freight and claims headaches'
      },
      {
        metric: 'Communication Response Time',
        industryAverage: '4+ hours',
        yourPerformance: '< 30 minutes',
        impactToShipper: 'Faster issue resolution and less time spent tracking'
      },
      {
        metric: 'Load Acceptance Rate',
        industryAverage: '78%',
        yourPerformance: '96%',
        impactToShipper: 'Don't scramble for last-minute carrier coverage'
      }
    ],
    guarantee: {
      onTimeDelivery: '98% OTD guarantee or credit future shipments',
      communication: 'Response within 30 minutes during business hours',
      claims: '48-hour claims resolution process',
      capacity: 'Guaranteed capacity for contracted lanes'
    },
    talkTrack: "Our clients choose us because we deliver on our promises. We guarantee 98% on-time delivery - and if we miss it, you get a credit. You'll never wait hours for a response, and claims are resolved in 48 hours. Reliability isn't just a promise - it's a guarantee."
  },

  technology: {
    framework: 'Technology-Enabled Service Differentiation',
    applicableWhen: 'Shipper values visibility, data, and modern capabilities',
    capabilityHighlights: [
      {
        capability: 'Real-Time GPS Tracking',
        benefit: 'See your freight location updated every 30 seconds',
        competitiveAdvantage: 'Most carriers update every 4-6 hours'
      },
      {
        capability: 'Automated Customer Notifications',
        benefit: 'Your customers get automated pickup, in-transit, and delivery alerts',
        competitiveAdvantage: 'Reduces "where\'s my order?" calls by 60%'
      },
      {
        capability: 'API/EDI Integration',
        benefit: 'Seamlessly integrate with your TMS, ERP, or WMS',
        competitiveAdvantage: 'No manual data entry or re-keying'
      },
      {
        capability: 'Photo Documentation',
        benefit: 'Photo proof at pickup and delivery for every shipment',
        competitiveAdvantage: 'Eliminates "he said, she said" claims disputes'
      },
      {
        capability: 'Predictive ETA',
        benefit: 'AI-powered ETA predictions accurate within 15 minutes',
        competitiveAdvantage: 'Plan better for receiving and warehouse scheduling'
      },
      {
        capability: 'Analytics Dashboard',
        benefit: 'See your transportation metrics: OTD%, cost per mile, lane analysis',
        competitiveAdvantage: 'Make data-driven decisions about your logistics'
      }
    ],
    talkTrack: "We've built technology that makes logistics easier for you. Real-time tracking, automated customer notifications, and seamless integration with your systems. You'll spend less time on the phone asking 'where's my truck?' and more time running your business."
  },

  partnership: {
    framework: 'Strategic Partner vs. Transactional Vendor',
    applicableWhen: 'Shipper seeks long-term relationship and collaborative approach',
    partnershipElements: [
      {
        element: 'Dedicated Account Manager',
        description: 'Single point of contact who knows your business',
        value: 'No explaining your needs to different people each time'
      },
      {
        element: 'Quarterly Business Reviews',
        description: 'Proactive meetings to review performance and optimize',
        value: 'Continuous improvement and cost reduction'
      },
      {
        element: 'Custom Reporting',
        description: 'Reports tailored to your specific KPIs and metrics',
        value: 'Track what matters to your business'
      },
      {
        element: 'Capacity Guarantee',
        description: 'Reserved capacity for your peak seasons and regular lanes',
        value: 'Never scramble for trucks during crunch time'
      },
      {
        element: 'Network Optimization',
        description: 'Regular analysis of your shipping network for efficiencies',
        value: 'Proactive cost reduction and service improvement'
      },
      {
        element: 'Innovation Access',
        description: 'Early access to new capabilities and services',
        value: 'Stay ahead of your competition with latest logistics tech'
      }
    ],
    talkTrack: "We don't just move freight - we become an extension of your supply chain team. You'll have a dedicated account manager, quarterly reviews, and proactive optimization. We succeed when you succeed, so we're invested in your growth."
  }
};

// ==========================================
// SHIPPER QUALIFICATION FRAMEWORK
// ==========================================

export const SHIPPER_QUALIFICATION_CRITERIA = {
  BANT: {
    framework: 'Budget, Authority, Need, Timeline',
    questions: {
      Budget: [
        'What are you currently spending on transportation per month/year?',
        'Do you have budget allocated for freight, or does it come from another cost center?',
        'Are you looking to reduce costs, or invest in better service?',
        'What would justify a rate increase if it came with better service?'
      ],
      Authority: [
        'Who else is involved in selecting carriers?',
        'What's your approval process for new vendors?',
        'Do you have authority to approve this, or do we need to involve others?',
        'Who typically signs off on transportation contracts?'
      ],
      Need: [
        'What's driving you to look at new carriers right now?',
        'What challenges are you experiencing with your current logistics?',
        'If you could improve one thing about your freight operations, what would it be?',
        'What would happen if you didn't make a change?'
      ],
      Timeline: [
        'When do you need this in place?',
        'What's driving your timeline?',
        'Do you have any contracts expiring soon?',
        'When would you ideally want to start shipping with a new carrier?'
      ]
    },
    scoringModel: {
      Budget_Yes: 25,
      Authority_Yes: 25,
      Need_Yes: 25,
      Timeline_Yes: 25,
      qualifiedThreshold: 75
    }
  },

  ICP_FIT: {
    framework: 'Ideal Customer Profile Fit',
    idealCharacteristics: [
      {
        factor: 'Industry',
        ideal: 'Automotive, Manufacturing, Retail, Food & Beverage, Pharmaceutical',
        weight: 15
      },
      {
        factor: 'Shipping Volume',
        ideal: '50+ loads per month (600+ annually)',
        weight: 20
      },
      {
        factor: 'Freight Type',
        ideal: 'Full truckload (FTL), temperature-controlled, or specialized equipment',
        weight: 15
      },
      {
        factor: 'Geographic Coverage',
        ideal: 'Regional or national lanes (not ultra-local)',
        weight: 10
      },
      {
        factor: 'Technology Adoption',
        ideal: 'Uses TMS or open to technology integration',
        weight: 10
      },
      {
        factor: 'Decision-Making Authority',
        ideal: 'Direct access to logistics, procurement, or supply chain leadership',
        weight: 15
      },
      {
        factor: 'Growth Stage',
        ideal: 'Growing companies with increasing freight needs',
        weight: 10
      },
      {
        factor: 'Pain Points',
        ideal: 'Experiencing service failures, capacity issues, or visibility challenges',
        weight: 5
      }
    ],
    scoringExample: {
      prospect: 'ABC Manufacturing',
      industry: 'Manufacturing (15 points)',
      volume: '200 loads/month (20 points)',
      freightType: 'FTL general freight (10 points)',
      geography: 'Midwest to Southeast lanes (10 points)',
      technology: 'Uses legacy TMS (5 points)',
      authority: 'VP of Logistics (15 points)',
      growth: 'Expanding to new markets (10 points)',
      painPoints: 'Capacity issues during peak (5 points)',
      totalScore: 90,
      assessment: 'Excellent fit - prioritize for outreach'
    }
  },

  GPCTBA_CI: {
    framework: 'Goals, Plans, Challenges, Timeline, Budget, Authority, Consequences, Implications',
    discoveryQuestions: {
      Goals: [
        'What are your logistics goals for this year?',
        'What does success look like for your supply chain?',
        'What KPIs do you measure for transportation?'
      ],
      Plans: [
        'What's your plan to achieve those goals?',
        'Have you evaluated other carriers or logistics providers?',
        'What have you tried so far?'
      ],
      Challenges: [
        'What's preventing you from hitting your goals?',
        'What are your biggest freight challenges right now?',
        'Where are you experiencing the most pain?'
      ],
      Timeline: [
        'When do you need to solve this?',
        'What's driving your timeline?',
        'Is there a deadline or event that's creating urgency?'
      ],
      Budget: [
        'Do you have budget allocated for this?',
        'How do you currently fund transportation?',
        'Is this a cost reduction initiative or service improvement investment?'
      ],
      Authority: [
        'Who else needs to be involved in this decision?',
        'What's your vendor selection process?',
        'Do you need legal or procurement approval?'
      ],
      Consequences: [
        'What happens if you don't solve this problem?',
        'What's at risk if things don't change?',
        'How is this affecting your customers or operations?'
      ],
      Implications: [
        'How would solving this impact your business?',
        'What would change if this problem went away?',
        'What opportunities would open up?'
      ]
    }
  },

  disqualificationCriteria: {
    hardDisqualifiers: [
      'Freight type we don't handle (international ocean, air freight, etc.)',
      'Volume too low (< 10 loads per month) unless high value per load',
      'Geographic coverage we don't serve',
      'No budget or unwilling to discuss pricing',
      'Not decision-maker and unwilling to intro us',
      'Unrealistic service expectations (same-day across country, impossible timelines)',
      'Credit concerns or unwillingness to provide credit references'
    ],
    softDisqualifiers: [
      'No urgency or defined timeline (put in long-term nurture)',
      'Just price shopping with no intention to switch',
      'Already locked in long-term contract (circle back near renewal)',
      'Only looking for backup carrier (lower priority but keep warm)',
      'Technology requirements we can't meet yet'
    ]
  }
};

// ==========================================
// INTEGRATION HELPERS
// ==========================================

export const shipperAcquisitionKB = {
  // Get buying psychology for specific decision-maker role
  getDecisionMakerInsights: (role: string) => {
    const normalizedRole = role.toLowerCase();
    return SHIPPER_BUYING_PSYCHOLOGY.decisionMakerTypes.find(
      dm => dm.role.toLowerCase().includes(normalizedRole) ||
            normalizedRole.includes(dm.role.toLowerCase().split(' ')[0])
    ) || SHIPPER_BUYING_PSYCHOLOGY.decisionMakerTypes[0];
  },

  // Get industry-specific pain points and value props
  getIndustryGuidance: (industry: string) => {
    const normalizedIndustry = industry.toLowerCase().replace(/[^a-z]/g, '');
    const industryKey = Object.keys(INDUSTRY_SPECIFIC_PAIN_POINTS).find(
      key => normalizedIndustry.includes(key) || key.includes(normalizedIndustry)
    );
    return industryKey ? INDUSTRY_SPECIFIC_PAIN_POINTS[industryKey] : null;
  },

  // Get objection handling for specific objection type
  getObjectionResponse: (objectionType: string) => {
    return SHIPPER_OBJECTIONS[objectionType] || null;
  },

  // Get appropriate nurture campaign based on lead stage
  getNurtureCampaign: (leadStage: string) => {
    const stageMap = {
      'cold': 'newShipperProspect',
      'new': 'newShipperProspect',
      'inquiry': 'warmShipperLead',
      'warm': 'warmShipperLead',
      'lost': 'lostDealReactivation',
      'inactive': 'lostDealReactivation'
    };
    const campaignKey = stageMap[leadStage.toLowerCase()];
    return campaignKey ? SHIPPER_NURTURE_CAMPAIGNS[campaignKey] : null;
  },

  // Get value proposition framework based on shipper priorities
  getValueProposition: (shipperPriority: string) => {
    const priorityMap = {
      'cost': 'costReduction',
      'price': 'costReduction',
      'savings': 'costReduction',
      'reliability': 'reliability',
      'service': 'reliability',
      'on-time': 'reliability',
      'technology': 'technology',
      'visibility': 'technology',
      'tracking': 'technology',
      'partnership': 'partnership',
      'relationship': 'partnership',
      'long-term': 'partnership'
    };
    const vpKey = Object.keys(priorityMap).find(key =>
      shipperPriority.toLowerCase().includes(key)
    );
    return vpKey ? VALUE_PROPOSITION_FRAMEWORKS[priorityMap[vpKey]] : null;
  },

  // Generate contextual guidance for shipper outreach
  generateShipperOutreach: (context: {
    industry?: string;
    role?: string;
    stage?: string;
    painPoint?: string;
  }) => {
    const industryGuidance = context.industry ?
      shipperAcquisitionKB.getIndustryGuidance(context.industry) : null;
    const roleInsights = context.role ?
      shipperAcquisitionKB.getDecisionMakerInsights(context.role) : null;
    const campaign = context.stage ?
      shipperAcquisitionKB.getNurtureCampaign(context.stage) : null;

    return {
      industryPainPoints: industryGuidance?.criticalPainPoints || [],
      industryValueProps: industryGuidance?.valuePropositions || [],
      industryTalkingPoints: industryGuidance?.talkingPoints || [],
      decisionMakerPriorities: roleInsights?.priorities || [],
      decisionMakerPainPoints: roleInsights?.painPoints || [],
      recommendedApproach: roleInsights?.bestApproach || '',
      nurtureSequence: campaign?.touchpoints || [],
      nextBestAction: campaign?.touchpoints?.[0] || null
    };
  },

  // Qualify shipper lead using BANT + ICP scoring
  qualifyShipperLead: (leadData: {
    industry?: string;
    volume?: number;
    budget?: boolean;
    authority?: boolean;
    need?: boolean;
    timeline?: boolean;
    freightType?: string;
    technology?: boolean;
    growth?: boolean;
  }) => {
    let score = 0;
    const qualificationDetails = [];

    // BANT scoring (0-100 points)
    if (leadData.budget) {
      score += 25;
      qualificationDetails.push('✅ Budget confirmed');
    }
    if (leadData.authority) {
      score += 25;
      qualificationDetails.push('✅ Decision authority confirmed');
    }
    if (leadData.need) {
      score += 25;
      qualificationDetails.push('✅ Clear need identified');
    }
    if (leadData.timeline) {
      score += 25;
      qualificationDetails.push('✅ Timeline established');
    }

    // ICP fit bonus (0-30 additional points)
    if (leadData.volume && leadData.volume >= 50) {
      score += 10;
      qualificationDetails.push('✅ Strong volume (50+ loads/month)');
    }
    if (leadData.industry && ['automotive', 'manufacturing', 'retail', 'food', 'pharmaceutical'].includes(leadData.industry.toLowerCase())) {
      score += 10;
      qualificationDetails.push('✅ Ideal industry fit');
    }
    if (leadData.growth) {
      score += 10;
      qualificationDetails.push('✅ Growing company');
    }

    const qualification = score >= 75 ? 'Highly Qualified' :
                          score >= 50 ? 'Qualified' :
                          score >= 25 ? 'Needs Development' :
                          'Disqualified';

    return {
      score,
      qualification,
      details: qualificationDetails,
      recommendation: score >= 75 ? 'Prioritize for immediate outreach and customized proposal' :
                      score >= 50 ? 'Qualify further and nurture with targeted content' :
                      score >= 25 ? 'Long-term nurture campaign' :
                      'Disqualify or very low-priority nurture'
    };
  }
};

