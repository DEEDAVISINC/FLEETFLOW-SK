/**
 * Social Media Triggers Knowledge Base
 * Adapted from 115 Psychological Email Triggers for Social Media Platforms
 *
 * This adapts the email triggers for social media platforms (LinkedIn, Facebook,
 * Twitter/X, Instagram, TikTok) with platform-specific considerations:
 * - Shorter attention spans
 * - Visual elements and storytelling
 * - Algorithm optimization
 * - Community building
 * - Viral potential
 *
 * Each trigger includes social media adaptations, best practices, and examples.
 */

export const socialMediaTriggersKnowledgeBase = {
  /**
   * URGENCY & SCARCITY (Adapted for Social Media)
   * Works extremely well on social - creates FOMO and immediate action
   */
  urgencyScarcity: {
    principles: {
      socialFOMO: 'Social proof + urgency creates viral potential',
      visualCountdowns: 'Use graphics, stories, and live content for urgency',
      limitedTimeContent: 'Time-sensitive posts get more engagement',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Limited Executive Access',
          'Industry Event Deadline',
          'Network-Only Offer',
        ],
        formats: [
          'Stories with countdown',
          'Exclusive group posts',
          'Time-limited webinars',
        ],
        examples: [
          '🚨 Only 5 spots left for our executive roundtable on Q4 logistics trends',
          '⏰ 24 hours left to join our private carrier network preview',
          '🔒 Exclusive: Rate negotiation masterclass - doors close in 2 hours',
        ],
      },

      twitter: {
        triggers: [
          'Breaking News Urgency',
          'Thread Time Limit',
          'Poll Deadline',
        ],
        formats: ['Live threads', 'Flash polls', 'Real-time updates'],
        examples: [
          '🚨 BREAKING: Fuel surcharge changes effective tomorrow. Thread 👇',
          '⏰ 60 minutes left to vote: Which supply chain trend worries you most?',
          '⚡ FLASH: Port congestion easing - capacity available NOW',
        ],
      },

      facebook: {
        triggers: [
          'Community Exclusive',
          'Group Access Limited',
          'Local Market Alert',
        ],
        formats: ['Group posts', 'Event countdowns', 'Local targeting'],
        examples: [
          '👥 GROUP EXCLUSIVE: Free logistics audit for next 10 members only',
          '🏭 LOCAL ALERT: Warehouse space in your area filling up fast',
          '🎯 LIMITED: 3 free consultations for businesses in [City] - claim now',
        ],
      },

      youtube: {
        triggers: [
          'Limited Webinar Seats',
          'Time-Sensitive Tutorials',
          'Exclusive Content Access',
        ],
        formats: [
          'Live streams',
          'Video series countdowns',
          'Limited-time playlists',
        ],
        examples: [
          '🎥 LIVE TONIGHT: Logistics optimization masterclass - only 50 seats left',
          '⏰ 48 hours only: Free supply chain audit video series',
          '🔒 EXCLUSIVE: Premium logistics strategies video (limited access)',
        ],
      },
    },

    bestPractices: {
      visualUrgency: 'Use red colors, countdown graphics, and urgent emojis',
      socialProof: 'Combine with "X people claimed" or "Only Y left"',
      authenticity: 'Only use genuine scarcity - fake urgency damages trust',
      callsToAction:
        'Clear, immediate CTAs: "DM now", "Comment below", "Visit link"',
    },
  },

  /**
   * LOSS AVERSION (Adapted for Social Media)
   * More subtle on social - focus on prevention and missed opportunities
   */
  lossAversion: {
    principles: {
      subtlePain: 'Show problems without being alarmist',
      preventionFocus: 'Emphasize what they can avoid',
      socialComparison: 'Show what others are losing by not acting',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Competitive Disadvantage',
          'Missed Opportunity',
          'Industry Gap',
        ],
        formats: ['Comparison posts', 'Case studies', 'Thought leadership'],
        examples: [
          "📊 Your competitors are saving 23% on logistics. Here's their secret",
          "💡 40% of shippers don't track detention costs. Are you losing money?",
          '🚨 Warning: Your supply chain blind spots are costing you customers',
        ],
      },

      twitter: {
        triggers: [
          'Industry Trend Warning',
          'Market Shift Alert',
          'Cost Leakage',
        ],
        formats: ['Thread warnings', 'Data tweets', 'Question hooks'],
        examples: [
          '⚠️ Thread: 7 ways your carrier contract is bleeding money',
          "📉 If you're still paying retail rates, you're losing 15% margins",
          '🤔 Are hidden fees killing your logistics ROI? (Poll)',
        ],
      },

      facebook: {
        triggers: [
          'Community Problem Sharing',
          'Local Cost Issues',
          'Group Discussions',
        ],
        formats: ['Problem-solution posts', 'Community polls', 'User stories'],
        examples: [
          '😤 Fed up with carrier delays? 67% of our community feels your pain',
          '💰 Local businesses losing $2K/month on poor logistics. Sound familiar?',
          "📈 Don't be the last to discover these cost-saving strategies",
        ],
      },

      youtube: {
        triggers: [
          'Industry Problem Deep-Dive',
          'Cost Analysis Videos',
          'Solution Showcases',
        ],
        formats: [
          'Problem analysis videos',
          'Case study breakdowns',
          'Educational series',
        ],
        examples: [
          '📊 Why 73% of shippers are losing money on hidden logistics costs',
          '💸 Cost breakdown: How detention fees are killing your margins',
          '🔍 Case study: How one company saved $500K by fixing this one problem',
        ],
      },
    },

    bestPractices: {
      empathyFirst: 'Acknowledge the problem before offering solution',
      dataDriven: 'Back claims with specific numbers and percentages',
      valueFirst: 'Focus on helping rather than selling',
      communityBuilding: 'Create shared pain points for group discussion',
    },
  },

  /**
   * SOCIAL PROOF (Excellent for Social Media)
   * This is social media's strongest suit - built-in social validation
   */
  socialProof: {
    principles: {
      nativeSocial: 'Social media platforms are designed for social proof',
      userGenerated: 'Leverage community content and testimonials',
      scaleDemonstration: 'Show popularity and adoption',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Executive Endorsements',
          'Industry Recognition',
          'Network Success',
        ],
        formats: ['Tagged posts', 'Company mentions', 'Award showcases'],
        examples: [
          '🏆 Proud to be recognized as #1 Logistics Provider by [Industry Publication]',
          '👥 847 Fortune 1000 companies trust us. Join them?',
          '💼 "They transformed our supply chain" - COO, [Major Company]',
        ],
      },

      twitter: {
        triggers: ['Viral Success', 'Influencer Mentions', 'Hashtag Campaigns'],
        formats: ['Retweet campaigns', 'Influencer collabs', 'Trending topics'],
        examples: [
          '🚀 10K+ logistics pros follow us for market insights',
          '📈 When [Industry Influencer] recommends us... 💯',
          '🔥 #LogisticsLife: Our customers sharing their success stories',
        ],
      },

      facebook: {
        triggers: [
          'Community Testimonials',
          'Group Success Stories',
          'Local Endorsements',
        ],
        formats: [
          'User-generated content',
          'Group shoutouts',
          'Review highlights',
        ],
        examples: [
          '🌟 Community spotlight: How we saved [Local Business] $15K/year',
          "👏 200+ 5-star reviews. Here's what customers are saying...",
          '🏢 Local business owners: Why 78% switched to our services',
        ],
      },

      youtube: {
        triggers: [
          'Client Success Stories',
          'Industry Recognition',
          'Scale Demonstration',
        ],
        formats: [
          'Testimonial videos',
          'Award showcases',
          'Company milestone videos',
        ],
        examples: [
          '🎥 Client story: How we transformed their supply chain (full case study)',
          '🏆 Industry recognition: Named #1 Logistics Provider by [Publication]',
          '📈 From 50 to 500+ clients: Our 3-year growth journey',
        ],
      },
    },

    bestPractices: {
      authenticContent: 'Use real customer photos, videos, and stories',
      variety:
        'Mix different types of social proof (numbers, stories, endorsements)',
      timeliness: 'Share recent testimonials and current statistics',
      engagement: 'Ask customers to share their experiences publicly',
    },
  },

  /**
   * AUTHORITY & EXPERTISE (Perfect for Social Media)
   * Social media excels at thought leadership and expert positioning
   */
  authorityExpertise: {
    principles: {
      thoughtLeadership: 'Position as industry expert through valuable content',
      educationalContent: 'Teach while establishing credibility',
      problemSolving: 'Demonstrate expertise by solving real problems',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Industry Insights',
          'Expert Analysis',
          'Educational Content',
        ],
        formats: ['Articles', 'Video content', 'Industry reports'],
        examples: [
          '📊 Breaking down Q4 logistics trends: What every shipper needs to know',
          '🎓 FREE: Our 2025 Logistics Market Outlook report (47 pages)',
          '🔬 Research: How AI is reshaping transportation networks',
        ],
      },

      twitter: {
        triggers: [
          'Real-time Expertise',
          'Industry News Analysis',
          'Quick Insights',
        ],
        formats: ['Thread explanations', 'Live tweets', 'Expert Q&A'],
        examples: [
          '🧵 Thread: Why fuel surcharges are here to stay (5 key reasons)',
          '💡 Quick tip: Negotiate carrier contracts using this data point',
          '📈 Industry insight: E-commerce driving 340% increase in last-mile demand',
        ],
      },

      facebook: {
        triggers: ['Educational Posts', 'How-to Guides', 'Expert Tips'],
        formats: ['Infographics', 'Live videos', 'Tutorial series'],
        examples: [
          '📚 How to reduce logistics costs by 23% (Step-by-step guide)',
          '🎥 LIVE: Answering your toughest supply chain questions',
          '💡 Pro tip: 7 questions to ask your carrier before signing',
        ],
      },

      youtube: {
        triggers: [
          'Deep-Dive Tutorials',
          'Industry Analysis',
          'Expert Interviews',
        ],
        formats: [
          'Educational videos',
          'Webinar recordings',
          'Expert roundtables',
        ],
        examples: [
          '🎓 Complete guide: Building a logistics network from scratch (45 min)',
          '🔬 Market analysis: Q4 2025 logistics trends you need to know',
          '🎙️ Expert interview: Former CEO shares supply chain secrets',
        ],
      },
    },

    bestPractices: {
      valueFirst: 'Provide genuine value before any sales messaging',
      consistency: 'Post regularly to build recognition as an expert',
      interaction:
        'Engage with comments and questions to demonstrate expertise',
      dataSharing: 'Share industry data, research, and insights generously',
    },
  },

  /**
   * RECIPROCITY (Strong on Social Media)
   * Social media users expect value exchange and community benefits
   */
  reciprocity: {
    principles: {
      valueExchange: 'Give value to create obligation and build relationships',
      communityBenefit: 'Contribute to the community you want to serve',
      generositySignals:
        'Show willingness to help without immediate expectation',
    },

    platformAdaptations: {
      linkedin: {
        triggers: ['Free Resources', 'Exclusive Content', 'Professional Value'],
        formats: ['Downloadable guides', 'Webinars', 'Industry reports'],
        examples: [
          '📥 FREE: Carrier negotiation checklist (used by 12,000+ professionals)',
          '🎟️ Exclusive invite: Private roundtable on supply chain innovation',
          '📊 Free tool: Logistics ROI calculator (save 30 minutes of work)',
        ],
      },

      twitter: {
        triggers: ['Quick Value', 'Helpful Tips', 'Free Tools'],
        formats: ['Thread resources', 'Poll results', 'Useful lists'],
        examples: [
          '🆓 FREE resource: Top 10 carrier questions (DM for link)',
          '📋 Thread: 7 free tools every logistics manager needs',
          '🎁 Giving away: Free logistics audit to 3 lucky followers',
        ],
      },

      facebook: {
        triggers: ['Community Resources', 'Group Benefits', 'Local Help'],
        formats: ['Free downloads', 'Community events', 'Local resources'],
        examples: [
          '🎁 FREE for our community: Supply chain risk assessment template',
          '👥 Group exclusive: Free webinar recording + bonus materials',
          '🏠 Local business help: Free logistics consultation (first 5 callers)',
        ],
      },

      youtube: {
        triggers: [
          'Free Educational Content',
          'Value-Add Resources',
          'Exclusive Access',
        ],
        formats: [
          'Free video courses',
          'Resource playlists',
          'Premium content previews',
        ],
        examples: [
          '📚 FREE 5-video course: Logistics optimization masterclass',
          '📋 Download our logistics checklist + bonus video training',
          '🔓 Exclusive access: Premium analytics dashboard walkthrough',
        ],
      },
    },

    bestPractices: {
      genuineValue: 'Ensure free resources are actually valuable and useful',
      easyAccess: 'Make it simple to get the free resource (one-click)',
      followUp: 'Use reciprocity to start relationships, not just get sales',
      communityBuilding: 'Create value that benefits the entire community',
    },
  },

  /**
   * PERSONALIZATION (Highly Effective on Social Media)
   * Social platforms enable hyper-targeted, personal content
   */
  personalization: {
    principles: {
      targetedContent: 'Deliver content specific to audience segments',
      relevance: 'Show you understand their unique challenges',
      connection: 'Build personal relationships at scale',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Industry-Specific Insights',
          'Role-Based Content',
          'Company Targeting',
        ],
        formats: [
          'Tagged company posts',
          'Industry-specific content',
          'Personal outreach',
        ],
        examples: [
          '🏭 Manufacturers: How to reduce transportation costs by 18%',
          '🚛 Fleet managers: 5 tech upgrades that pay for themselves',
          '📍 [Company] leaders: Industry trends affecting your market',
        ],
      },

      twitter: {
        triggers: [
          'Tailored Insights',
          'Location-Based Content',
          'Interest Matching',
        ],
        formats: [
          'Targeted threads',
          'Local market updates',
          'Interest-based polls',
        ],
        examples: [
          '📍 Atlanta shippers: Port congestion affecting your routes',
          '🏗️ Construction logistics: Specialized equipment updates',
          '🌾 Agribusiness: Cold chain innovations you need to know',
        ],
      },

      facebook: {
        triggers: [
          'Demographic Targeting',
          'Interest-Based Content',
          'Local Personalization',
        ],
        formats: [
          'Targeted ads',
          'Local group content',
          'Interest-matched posts',
        ],
        examples: [
          '👨‍💼 Small business owners: Scale your logistics without breaking the bank',
          '🏙️ [City] businesses: Local carrier network now available',
          '📦 E-commerce sellers: Last-mile delivery solutions compared',
        ],
      },

      youtube: {
        triggers: [
          'Industry-Specific Deep Dives',
          'Role-Based Training',
          'Regional Market Focus',
        ],
        formats: [
          'Specialized playlists',
          'Targeted video series',
          'Regional content',
        ],
        examples: [
          '🚛 For fleet managers: Advanced route optimization techniques',
          '🏭 Manufacturers: Supply chain resilience in uncertain times',
          '📍 Midwest shippers: Navigating the Mississippi River bottlenecks',
        ],
      },
    },

    bestPractices: {
      audienceResearch: 'Use platform analytics to understand your audience',
      segmentation: 'Create content buckets for different audience segments',
      dynamicContent: 'Use platform features for personalized ad delivery',
      engagement: 'Ask personalized questions to spark conversations',
    },
  },

  /**
   * COMMITMENT & CONSISTENCY (Works Well on Social)
   * Build ongoing engagement and brand loyalty
   */
  commitmentConsistency: {
    principles: {
      habitBuilding: 'Create consistent touchpoints that build relationships',
      smallCommitments: 'Start with low-effort engagements',
      brandAlignment: 'Show consistent values and positioning',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Ongoing Education',
          'Regular Insights',
          'Professional Development',
        ],
        formats: [
          'Content series',
          'Weekly insights',
          'Professional challenges',
        ],
        examples: [
          '📅 Week 3 of our logistics optimization series: Inventory management',
          '🎯 Committed to excellence: Our 5-year customer retention rate',
          "🤝 We stand for reliability. Here's proof from our 7-year clients",
        ],
      },

      twitter: {
        triggers: ['Daily Tips', 'Consistent Branding', 'Thread Series'],
        formats: [
          'Daily threads',
          'Consistent hashtags',
          'Ongoing conversations',
        ],
        examples: [
          '📱 Daily logistics tip #47: Always verify carrier insurance',
          '🔄 Same reliable service, day after day, for 15+ years',
          '🧵 Weekly roundup: Logistics trends from the past 7 days',
        ],
      },

      facebook: {
        triggers: [
          'Community Building',
          'Regular Value',
          'Consistent Presence',
        ],
        formats: ['Daily posts', 'Community events', 'Regular live sessions'],
        examples: [
          '📆 Every Tuesday: Free logistics advice in our community group',
          "🤝 We've been here for you since 2008. Still committed to excellence",
          '🎯 Weekly challenge: Share your biggest logistics pain point for advice',
        ],
      },

      youtube: {
        triggers: [
          'Ongoing Education Series',
          'Regular Deep Dives',
          'Consistent Expertise',
        ],
        formats: [
          'Weekly video series',
          'Monthly webinars',
          'Educational playlists',
        ],
        examples: [
          '📅 Every Thursday: Logistics market update (Week 47 of our series)',
          '🎯 Committed to your success: 200+ free educational videos',
          '📚 Complete course: Advanced supply chain management (12 videos)',
        ],
      },
    },

    bestPractices: {
      consistency: 'Post regularly on a predictable schedule',
      valueDelivery: 'Each interaction should provide value',
      relationshipBuilding: 'Focus on long-term engagement over quick sales',
      authenticity: 'Be genuinely helpful and consistent in your approach',
    },
  },

  /**
   * CURIOSITY & PATTERN INTERRUPTS (Excellent for Social Media)
   * Social media thrives on attention-grabbing, unexpected content
   */
  curiosityPatternInterrupts: {
    principles: {
      attentionGrabbing: 'Break through the noise with unexpected content',
      engagementDriving: 'Spark curiosity to increase interaction',
      shareableContent: 'Create content people want to share',
    },

    platformAdaptations: {
      linkedin: {
        triggers: [
          'Industry Contrarians',
          'Unexpected Insights',
          'Challenge Assumptions',
        ],
        formats: [
          'Bold statements',
          'Counterintuitive advice',
          'Surprising data',
        ],
        examples: [
          "🤯 What if I told you the cheapest carrier isn't always the best choice?",
          '💥 Industry myth busted: Why "just-in-time" inventory is hurting margins',
          '🔍 The hidden cost in your supply chain that no one talks about',
        ],
      },

      twitter: {
        triggers: [
          'Bold Claims',
          'Controversial Takes',
          'Unexpected Questions',
        ],
        formats: ['Hook tweets', 'Thread starters', 'Poll surprises'],
        examples: [
          '🚨 Hot take: Most logistics software is making you less efficient',
          '❓ If you could change ONE thing about transportation, what would it be?',
          '🤯 Plot twist: The "fastest" route might be costing you the most',
        ],
      },

      facebook: {
        triggers: ['Community Surprises', 'Unexpected Value', 'Bold Promises'],
        formats: ['Challenge posts', 'Unexpected offers', 'Bold claims'],
        examples: [
          '🎁 FREE consultation for anyone who can stump our logistics expert',
          "🤯 We'll beat any competitor's quote by 10% or work for free",
          "💡 The counterintuitive logistics strategy that doubled our client's margins",
        ],
      },

      youtube: {
        triggers: [
          'Bold Industry Claims',
          'Unexpected Revelations',
          'Challenge Assumptions',
        ],
        formats: [
          'Controversial takes',
          'Myth-busting videos',
          'Surprising data reveals',
        ],
        examples: [
          '🚨 The logistics myth costing you $50K/year (everyone believes this)',
          '🤯 What if I told you most TMS systems are making you less efficient?',
          '💥 Industry secret: Why 80% of carriers overcharge (data-backed)',
        ],
      },
    },

    bestPractices: {
      hookStrong: 'First 3 words must grab attention',
      deliverValue: 'Always follow curiosity with genuine insight',
      authenticity: 'Only make claims you can back up',
      engagement: 'Design content to encourage comments and shares',
    },
  },

  /**
   * PLATFORM-SPECIFIC STRATEGIES
   */
  platformStrategies: {
    linkedin: {
      focus: 'Professional networking, thought leadership, B2B sales',
      bestTriggers: [
        'Authority',
        'Social Proof',
        'Personalization',
        'Reciprocity',
      ],
      contentTypes: ['Articles', 'Videos', 'Polls', 'Stories', 'Networking'],
      postingStrategy: 'Professional, value-first, relationship building',
    },

    twitter: {
      focus: 'Real-time updates, industry news, viral potential',
      bestTriggers: ['Urgency', 'Curiosity', 'Authority', 'Social Proof'],
      contentTypes: [
        'Threads',
        'Polls',
        'Live tweets',
        'Retweets',
        'DM campaigns',
      ],
      postingStrategy: 'Fast, conversational, news-driven',
    },

    facebook: {
      focus: 'Community building, local targeting, relationship nurturing',
      bestTriggers: [
        'Social Proof',
        'Reciprocity',
        'Commitment',
        'Loss Aversion',
      ],
      contentTypes: ['Group posts', 'Events', 'Live videos', 'Stories', 'Ads'],
      postingStrategy: 'Community-focused, local, engagement-driven',
    },

    instagram: {
      focus: 'Visual storytelling, brand personality, younger demographics',
      bestTriggers: [
        'Social Proof',
        'Curiosity',
        'Authority',
        'Personalization',
      ],
      contentTypes: ['Stories', 'Reels', 'Posts', 'Live', 'DM marketing'],
      postingStrategy: 'Visual, authentic, story-driven',
    },

    tiktok: {
      focus:
        'Entertainment, education, viral potential, younger logistics professionals',
      bestTriggers: ['Curiosity', 'Social Proof', 'Authority', 'Urgency'],
      contentTypes: [
        'Educational videos',
        'Industry tips',
        'Behind-the-scenes',
        'Challenges',
      ],
      postingStrategy: 'Entertaining, educational, short-form video',
    },

    youtube: {
      focus:
        'Educational content, thought leadership, long-form value, SEO-driven discovery',
      bestTriggers: [
        'Authority',
        'Reciprocity',
        'Personalization',
        'Commitment',
      ],
      contentTypes: [
        'Educational videos',
        'Webinars',
        'Interviews',
        'Tutorials',
        'Case studies',
      ],
      postingStrategy:
        'Value-first, SEO-optimized, consistent educational content',
    },
  },

  /**
   * CROSS-PLATFORM CAMPAIGNS
   */
  crossPlatformCampaigns: {
    examples: [
      {
        campaign: 'Industry Report Launch',
        linkedin: 'Authority trigger - Professional article announcement',
        twitter: 'Curiosity trigger - "What secret did we uncover?" thread',
        facebook: 'Reciprocity trigger - Free download in community group',
        instagram: 'Social proof - Graphic showing download numbers',
        youtube: 'Authority trigger - Full report breakdown video',
      },
      {
        campaign: 'Capacity Shortage Alert',
        linkedin: 'Urgency trigger - Executive network alert',
        twitter: 'Urgency trigger - Real-time capacity updates',
        facebook:
          'Loss aversion trigger - "Don\'t get left behind" community post',
        instagram: 'Urgency trigger - Story countdown to capacity exhaustion',
        youtube: 'Urgency trigger - Live stream capacity discussion',
      },
      {
        campaign: 'Customer Success Story',
        linkedin: 'Social proof - Detailed case study',
        twitter: 'Social proof - Thread with key results',
        facebook: 'Social proof - Community testimonial post',
        instagram: 'Social proof - Before/after transformation story',
        youtube: 'Social proof - Full client interview video',
      },
    ],

    bestPractices: {
      consistentMessaging: 'Same core message, adapted for each platform',
      platformTiming:
        'Launch on LinkedIn first, then cascade to other platforms',
      crossPromotion: 'Link platforms together for amplification',
      measurement: 'Track engagement across all platforms for optimization',
    },
  },

  /**
   * SOCIAL MEDIA METRICS & OPTIMIZATION
   */
  metricsOptimization: {
    keyMetrics: {
      engagement: 'Likes, comments, shares, saves per post',
      reach: 'How many people saw your content',
      impressions: 'How many times content was displayed',
      clickThrough: 'Clicks to website, link in bio, etc.',
      followerGrowth: 'New followers from content',
      conversion: 'Leads, sales, or desired actions from social',
    },

    algorithmOptimization: {
      linkedin: 'Professional value, networking, timely industry content',
      twitter: 'Real-time engagement, trending topics, conversations',
      facebook: 'Community building, emotional connection, local relevance',
      instagram: 'Visual appeal, storytelling, consistent posting',
      tiktok: 'Entertainment value, trending sounds, educational content',
      youtube: 'Long-form value, SEO keywords, watch time, thorough content',
    },

    abTesting: {
      variables: [
        'Trigger type',
        'Content format',
        'Posting time',
        'Call-to-action',
      ],
      sampleSize: 'Test with 10-20 posts per variation',
      measurement: 'Compare engagement rates, click-through rates, conversions',
      iteration: 'Implement winner, test new variations monthly',
    },
  },

  /**
   * ETHICAL CONSIDERATIONS
   */
  ethicalConsiderations: {
    transparency:
      'Clearly disclose sponsored content and affiliate relationships',
    authenticity: 'Only use genuine social proof and testimonials',
    valueFirst: 'Provide value before asking for engagement or sales',
    privacy: 'Respect user data and platform privacy policies',
    manipulation: 'Avoid dark patterns or coercive engagement tactics',
    communityRespect: 'Build genuine relationships, not just extract value',
  },
};

export default socialMediaTriggersKnowledgeBase;
