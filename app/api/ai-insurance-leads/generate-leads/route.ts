import { NextRequest, NextResponse } from 'next/server';

// AI Insurance Lead Generation API
// Integrates with FleetFlow's AI Flow platform and FMCSA data

interface LeadGenerationRequest {
  strategy: string;
  count: number;
  useAI: boolean;
  integrateFMCSA: boolean;
  includeContactEnrichment: boolean;
}

// Mock AI-generated leads based on FMCSA data and market intelligence
const generateMockLeads = (strategy: string, count: number) => {
  const mockCompanies = [
    {
      name: 'Sunrise Logistics LLC',
      contact: 'Michael Rodriguez',
      phone: '555-0123',
      email: 'mike@sunriselogistics.com',
      mc: 'MC123456',
      dot: 'DOT789012',
      fleet: 8,
      revenue: '$850K',
      renewal: '2025-03-15',
    },
    {
      name: 'Mountain View Transport',
      contact: 'Sarah Johnson',
      phone: '555-0234',
      email: 's.johnson@mvtransport.com',
      mc: 'MC234567',
      dot: 'DOT890123',
      fleet: 15,
      revenue: '$1.2M',
      renewal: '2025-04-20',
    },
    {
      name: 'Coastal Freight Solutions',
      contact: 'David Chen',
      phone: '555-0345',
      email: 'david.chen@coastalfreight.com',
      mc: 'MC345678',
      dot: 'DOT901234',
      fleet: 25,
      revenue: '$2.1M',
      renewal: '2025-05-10',
    },
    {
      name: 'Prairie Wind Trucking',
      contact: 'Lisa Martinez',
      phone: '555-0456',
      email: 'lisa@prairiewind.com',
      mc: 'MC456789',
      dot: 'DOT012345',
      fleet: 12,
      revenue: '$950K',
      renewal: '2025-06-01',
    },
    {
      name: 'Metro Delivery Services',
      contact: 'James Wilson',
      phone: '555-0567',
      email: 'jwilson@metrodelivery.com',
      mc: 'MC567890',
      dot: 'DOT123456',
      fleet: 6,
      revenue: '$650K',
      renewal: '2025-02-28',
    },
    {
      name: 'Apex Transportation Group',
      contact: 'Maria Garcia',
      phone: '555-0678',
      email: 'maria@apextransgroup.com',
      mc: 'MC678901',
      dot: 'DOT234567',
      fleet: 35,
      revenue: '$3.2M',
      renewal: '2025-07-15',
    },
    {
      name: 'Thunder Bay Logistics',
      contact: 'Robert Taylor',
      phone: '555-0789',
      email: 'rtaylor@thunderbaylogistics.com',
      mc: 'MC789012',
      dot: 'DOT345678',
      fleet: 18,
      revenue: '$1.5M',
      renewal: '2025-03-30',
    },
    {
      name: 'Desert Eagle Express',
      contact: 'Jennifer Adams',
      phone: '555-0890',
      email: 'jadams@deserteagle.com',
      mc: 'MC890123',
      dot: 'DOT456789',
      fleet: 9,
      revenue: '$780K',
      renewal: '2025-04-12',
    },
    {
      name: 'Northstar Freight Co',
      contact: 'Kevin Brown',
      phone: '555-0901',
      email: 'kbrown@northstarfreight.com',
      mc: 'MC901234',
      dot: 'DOT567890',
      fleet: 22,
      revenue: '$1.8M',
      renewal: '2025-05-25',
    },
    {
      name: 'Golden Gate Hauling',
      contact: 'Amanda Davis',
      phone: '555-0012',
      email: 'adavis@goldengatehauling.com',
      mc: 'MC012345',
      dot: 'DOT678901',
      fleet: 14,
      revenue: '$1.1M',
      renewal: '2025-06-08',
    },
  ];

  const painPointsMap = {
    'FMCSA New Entrant Discovery': [
      'High insurance costs for new carriers',
      'Difficulty finding competitive rates',
      'Limited coverage options',
      'Complex application processes',
    ],
    'Renewal Date Intelligence': [
      'Rising premium costs',
      'Poor claims handling experience',
      'Limited coverage flexibility',
      'Inadequate customer service',
    ],
    'Competitive Intelligence Mining': [
      'Overpaying for current coverage',
      'Missing coverage gaps',
      'Poor risk management support',
      'Inflexible policy terms',
    ],
    'Market Expansion Opportunities': [
      'Limited local insurance options',
      'Specialized hauling coverage needs',
      'Growth-related coverage adjustments',
      'Multi-state operation challenges',
    ],
  };

  const leadSources = {
    'FMCSA New Entrant Discovery': 'fmcsa_discovery',
    'Renewal Date Intelligence': 'market_research',
    'Competitive Intelligence Mining': 'competitor_analysis',
    'Market Expansion Opportunities': 'market_research',
  } as const;

  return Array.from(
    { length: Math.min(count, mockCompanies.length) },
    (_, i) => {
      const company = mockCompanies[i];
      const leadScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const aiConfidence = Math.floor(Math.random() * 30) + 70; // 70-100

      return {
        companyName: company.name,
        contactName: company.contact,
        email: company.email,
        phone: company.phone,
        mcNumber: company.mc,
        dotNumber: company.dot,
        fleetSize: company.fleet,
        businessType:
          company.fleet > 20
            ? '3pl'
            : company.fleet > 10
              ? 'trucking'
              : 'owner_operator',
        operatingRadius:
          company.fleet > 25
            ? 'national'
            : company.fleet > 10
              ? 'regional'
              : 'local',
        annualRevenue: company.revenue,
        currentInsurer: [
          'Progressive',
          'Geico',
          'State Farm',
          'Allstate',
          'Nationwide',
        ][Math.floor(Math.random() * 5)],
        renewalDate: company.renewal,
        painPoints:
          painPointsMap[strategy as keyof typeof painPointsMap] ||
          painPointsMap['FMCSA New Entrant Discovery'],
        leadScore,
        leadSource:
          leadSources[strategy as keyof typeof leadSources] ||
          'fmcsa_discovery',
        aiConfidence,
        priority:
          leadScore > 85
            ? 'urgent'
            : leadScore > 75
              ? 'high'
              : leadScore > 65
                ? 'medium'
                : 'low',
        generatedAt: new Date(),
        status: 'new' as const,
      };
    }
  );
};

export async function POST(request: NextRequest) {
  try {
    const requestData: LeadGenerationRequest = await request.json();

    // Validate request
    if (!requestData.strategy || !requestData.count) {
      return NextResponse.json(
        {
          success: false,
          error: 'Strategy and count are required',
        },
        { status: 400 }
      );
    }

    if (requestData.count > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 50 leads per request',
        },
        { status: 400 }
      );
    }

    // AI-powered lead generation simulation
    console.info('🤖 AI Lead Generation Started:', {
      strategy: requestData.strategy,
      count: requestData.count,
      timestamp: new Date().toISOString(),
    });

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate leads using AI and FMCSA data
    const leads = generateMockLeads(requestData.strategy, requestData.count);

    // AI Enhancement: Score and prioritize leads
    if (requestData.useAI) {
      leads.forEach((lead) => {
        // AI scoring factors
        const fleetSizeFactor = Math.min(lead.fleetSize / 50, 1) * 20;
        const renewalUrgencyFactor =
          new Date(lead.renewalDate || '2025-12-31') <
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            ? 15
            : 5;
        const painPointsFactor = lead.painPoints.length * 3;
        const businessTypeFactor =
          lead.businessType === '3pl'
            ? 10
            : lead.businessType === 'trucking'
              ? 8
              : 5;

        lead.leadScore = Math.min(
          Math.floor(
            fleetSizeFactor +
              renewalUrgencyFactor +
              painPointsFactor +
              businessTypeFactor +
              Math.random() * 20
          ),
          100
        );

        lead.aiConfidence = Math.min(
          Math.floor(lead.leadScore * 0.8 + Math.random() * 20),
          100
        );

        // Update priority based on AI score
        lead.priority =
          lead.leadScore > 85
            ? 'urgent'
            : lead.leadScore > 75
              ? 'high'
              : lead.leadScore > 65
                ? 'medium'
                : 'low';
      });

      // Sort by AI score
      leads.sort((a, b) => b.leadScore - a.leadScore);
    }

    // FMCSA Integration: Verify DOT numbers
    if (requestData.integrateFMCSA) {
      const fmcsaApiKey =
        process.env.FMCSA_API_KEY || '7de24c4a0eade12f34685829289e0446daf7880e';

      for (const lead of leads) {
        if (lead.dotNumber) {
          try {
            const fmcsaResponse = await fetch(
              `https://mobile.fmcsa.dot.gov/qc/id/${lead.dotNumber.replace('DOT', '')}?webKey=${fmcsaApiKey}`
            );

            if (fmcsaResponse.ok) {
              const fmcsaData = await fmcsaResponse.json();
              if (fmcsaData.content && fmcsaData.content.length > 0) {
                const carrier = fmcsaData.content[0];

                // Enhance lead with FMCSA data
                lead.companyName = carrier.legalName || lead.companyName;
                lead.aiConfidence = Math.min(lead.aiConfidence + 10, 100); // Boost confidence for verified carriers

                // Add FMCSA insights to pain points
                if (
                  carrier.safetyRating &&
                  carrier.safetyRating !== 'SATISFACTORY'
                ) {
                  lead.painPoints.push(
                    'Safety rating concerns - needs better coverage'
                  );
                  lead.leadScore = Math.min(lead.leadScore + 5, 100);
                }
              }
            }
          } catch (error) {
            console.warn(
              `FMCSA verification failed for ${lead.dotNumber}:`,
              error
            );
          }
        }
      }
    }

    // Contact Enrichment: Add additional contact data
    if (requestData.includeContactEnrichment) {
      leads.forEach((lead) => {
        // Simulate contact enrichment
        lead.email =
          lead.email ||
          `info@${lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        lead.phone =
          lead.phone ||
          `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

        // Add LinkedIn and website data (simulated)
        const enrichedData = {
          linkedin: `https://linkedin.com/company/${lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          website: `https://${lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          employees: lead.fleetSize * 1.5, // Estimate total employees
          yearFounded:
            new Date().getFullYear() - Math.floor(Math.random() * 15) - 5,
        };

        (lead as any).enrichedData = enrichedData;
        lead.aiConfidence = Math.min(lead.aiConfidence + 5, 100); // Boost for enriched data
      });
    }

    // Calculate strategy performance metrics
    const strategyMetrics = {
      totalLeads: leads.length,
      highPriorityLeads: leads.filter(
        (l) => l.priority === 'urgent' || l.priority === 'high'
      ).length,
      avgLeadScore: Math.round(
        leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length
      ),
      avgAIConfidence: Math.round(
        leads.reduce((sum, l) => sum + l.aiConfidence, 0) / leads.length
      ),
      estimatedConversionRate:
        requestData.strategy === 'Renewal Date Intelligence'
          ? 0.25
          : requestData.strategy === 'Competitive Intelligence Mining'
            ? 0.18
            : requestData.strategy === 'Market Expansion Opportunities'
              ? 0.15
              : 0.12,
      projectedRevenue:
        leads.length *
        (requestData.strategy === 'Renewal Date Intelligence'
          ? 1650
          : requestData.strategy === 'Competitive Intelligence Mining'
            ? 2400
            : requestData.strategy === 'Market Expansion Opportunities'
              ? 1200
              : 850) *
        (requestData.strategy === 'Renewal Date Intelligence'
          ? 0.25
          : requestData.strategy === 'Competitive Intelligence Mining'
            ? 0.18
            : requestData.strategy === 'Market Expansion Opportunities'
              ? 0.15
              : 0.12),
    };

    console.info('✅ AI Lead Generation Completed:', {
      strategy: requestData.strategy,
      leadsGenerated: leads.length,
      avgScore: strategyMetrics.avgLeadScore,
      highPriorityCount: strategyMetrics.highPriorityLeads,
      projectedRevenue: strategyMetrics.projectedRevenue,
    });

    return NextResponse.json({
      success: true,
      leads,
      strategyMetrics,
      aiInsights: {
        processingTime: '2.3 seconds',
        dataSourcesUsed: [
          'FMCSA SAFER Database',
          'Market Intelligence',
          'Contact Enrichment APIs',
        ],
        confidenceLevel: strategyMetrics.avgAIConfidence,
        recommendedActions: [
          'Prioritize urgent and high-priority leads first',
          'Customize outreach messages based on identified pain points',
          'Follow up on renewal dates within 60-90 days',
          'Verify contact information before outreach campaigns',
        ],
      },
      nextSteps: [
        'Review and approve generated leads',
        'Launch targeted outreach campaigns',
        'Set up automated follow-up sequences',
        'Track conversion metrics and optimize',
      ],
    });
  } catch (error) {
    console.error('AI Lead Generation Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate leads',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
