import { NextRequest, NextResponse } from 'next/server';

interface StrategicBuyer {
  id: string;
  companyName: string;
  type: 'Primary' | 'Secondary' | 'Opportunistic';
  acquisitionBudget: string;
  recentAcquisitions: string[];
  keyDecisionMakers: {
    name: string;
    title: string;
    email: string;
    linkedIn: string;
    lastContact?: string;
  }[];
  strategicFit: number; // 1-100 score
  acquisitionLikelihood: number; // 1-100 score
  status:
    | 'prospecting'
    | 'contacted'
    | 'engaged'
    | 'demo_scheduled'
    | 'evaluating'
    | 'negotiating'
    | 'closed';
  lastActivity: string;
  nextAction: string;
  notes: string;
}

interface OutreachCampaign {
  id: string;
  name: string;
  targetCompany: string;
  type: 'email' | 'linkedin' | 'direct_mail' | 'phone';
  status: 'draft' | 'active' | 'paused' | 'completed';
  sentCount: number;
  responseRate: number;
  meetingsScheduled: number;
  lastSent: string;
  nextScheduled?: string;
}

interface DemoEnvironment {
  id: string;
  companyName: string;
  environmentType:
    | 'Strategic Buyer Sandbox'
    | 'Executive Demo'
    | 'Technical Evaluation';
  accessUrl: string;
  createdDate: string;
  expiryDate: string;
  usageStats: {
    logins: number;
    timeSpent: number;
    featuresExplored: string[];
    lastAccess: string;
  };
  status: 'active' | 'expired' | 'suspended';
}

interface AcquisitionMetrics {
  totalTargets: number;
  activeOutreach: number;
  responseRate: number;
  meetingsScheduled: number;
  demosDeployed: number;
  pipelineValue: string;
  avgDealSize: string;
  timeToClose: number;
}

// In-memory storage for demo purposes - Developer Only System
const strategicBuyers: StrategicBuyer[] = [
  {
    id: 'SB-001',
    companyName: 'Microsoft Corporation',
    type: 'Primary',
    acquisitionBudget: '$50-75B annually',
    recentAcquisitions: [
      'Activision Blizzard ($68.7B)',
      'Nuance Communications ($19.7B)',
      'LinkedIn ($26.2B)',
    ],
    keyDecisionMakers: [
      {
        name: 'Satya Nadella',
        title: 'CEO',
        email: 'satya.nadella@microsoft.com',
        linkedIn: 'https://linkedin.com/in/satyanadella',
        lastContact: '2024-12-15',
      },
      {
        name: 'Amy Hood',
        title: 'CFO',
        email: 'amy.hood@microsoft.com',
        linkedIn: 'https://linkedin.com/in/amyhood',
      },
      {
        name: 'Scott Guthrie',
        title: 'EVP Cloud & AI',
        email: 'scott.guthrie@microsoft.com',
        linkedIn: 'https://linkedin.com/in/scottgu',
      },
    ],
    strategicFit: 95,
    acquisitionLikelihood: 85,
    status: 'contacted',
    lastActivity: '2024-12-15T10:30:00Z',
    nextAction: 'Follow up on Azure integration discussion',
    notes:
      'Strong interest in transportation AI. Mentioned Azure integration potential during initial call.',
  },
  {
    id: 'SB-002',
    companyName: 'Salesforce Inc.',
    type: 'Primary',
    acquisitionBudget: '$25-40B annually',
    recentAcquisitions: [
      'Slack ($27.7B)',
      'Tableau ($15.7B)',
      'MuleSoft ($6.5B)',
    ],
    keyDecisionMakers: [
      {
        name: 'Marc Benioff',
        title: 'Chair & CEO',
        email: 'marc.benioff@salesforce.com',
        linkedIn: 'https://linkedin.com/in/marcbenioff',
      },
      {
        name: 'Amy Weaver',
        title: 'CFO',
        email: 'amy.weaver@salesforce.com',
        linkedIn: 'https://linkedin.com/in/amyweaver',
      },
      {
        name: 'Parker Harris',
        title: 'Co-Founder & CTO',
        email: 'parker.harris@salesforce.com',
        linkedIn: 'https://linkedin.com/in/parkerharris',
      },
    ],
    strategicFit: 92,
    acquisitionLikelihood: 78,
    status: 'prospecting',
    lastActivity: '2024-12-10T14:15:00Z',
    nextAction: 'Schedule demo of "Salesforce of Transportation" positioning',
    notes:
      'Perfect fit for "Salesforce of Transportation" narrative. Focus on CRM integration and industry cloud potential.',
  },
  {
    id: 'SB-003',
    companyName: 'Oracle Corporation',
    type: 'Primary',
    acquisitionBudget: '$15-25B annually',
    recentAcquisitions: [
      'Cerner ($28.3B)',
      'TikTok (attempted)',
      'NetSuite ($9.3B)',
    ],
    keyDecisionMakers: [
      {
        name: 'Safra Catz',
        title: 'CEO',
        email: 'safra.catz@oracle.com',
        linkedIn: 'https://linkedin.com/in/safracatz',
      },
      {
        name: 'Larry Ellison',
        title: 'Executive Chairman & CTO',
        email: 'larry.ellison@oracle.com',
        linkedIn: 'https://linkedin.com/in/larryellison',
      },
      {
        name: 'Dorian Daley',
        title: 'General Counsel',
        email: 'dorian.daley@oracle.com',
        linkedIn: 'https://linkedin.com/in/dorialdaley',
      },
    ],
    strategicFit: 88,
    acquisitionLikelihood: 72,
    status: 'engaged',
    lastActivity: '2024-12-12T16:45:00Z',
    nextAction: 'Prepare ERP integration demonstration',
    notes:
      'Strong interest in ERP integration for transportation industry. Emphasized database and enterprise software synergies.',
  },
  {
    id: 'SB-004',
    companyName: 'ServiceNow Inc.',
    type: 'Secondary',
    acquisitionBudget: '$5-10B annually',
    recentAcquisitions: ['Element AI ($230M)', 'Loom Systems ($65M)'],
    keyDecisionMakers: [
      {
        name: 'Bill McDermott',
        title: 'CEO',
        email: 'bill.mcdermott@servicenow.com',
        linkedIn: 'https://linkedin.com/in/billmcdermott',
      },
    ],
    strategicFit: 75,
    acquisitionLikelihood: 65,
    status: 'demo_scheduled',
    lastActivity: '2024-12-14T09:20:00Z',
    nextAction:
      'Demo scheduled for Dec 20th - prepare workflow automation showcase',
    notes:
      'Interested in workflow automation capabilities. Demo scheduled for next week.',
  },
];

const outreachCampaigns: OutreachCampaign[] = [
  {
    id: 'OC-001',
    name: 'Microsoft Azure Integration Pitch',
    targetCompany: 'Microsoft Corporation',
    type: 'email',
    status: 'active',
    sentCount: 3,
    responseRate: 66.7,
    meetingsScheduled: 1,
    lastSent: '2024-12-15T08:00:00Z',
    nextScheduled: '2024-12-22T10:00:00Z',
  },
  {
    id: 'OC-002',
    name: 'Salesforce of Transportation Campaign',
    targetCompany: 'Salesforce Inc.',
    type: 'linkedin',
    status: 'active',
    sentCount: 5,
    responseRate: 40.0,
    meetingsScheduled: 0,
    lastSent: '2024-12-10T12:00:00Z',
    nextScheduled: '2024-12-17T14:00:00Z',
  },
  {
    id: 'OC-003',
    name: 'Oracle ERP Synergy Outreach',
    targetCompany: 'Oracle Corporation',
    type: 'email',
    status: 'active',
    sentCount: 2,
    responseRate: 50.0,
    meetingsScheduled: 1,
    lastSent: '2024-12-12T15:30:00Z',
  },
];

const demoEnvironments: DemoEnvironment[] = [
  {
    id: 'DE-001',
    companyName: 'Microsoft Corporation',
    environmentType: 'Strategic Buyer Sandbox',
    accessUrl: 'https://demo-microsoft.fleetflowapp.com',
    createdDate: '2024-12-15T10:30:00Z',
    expiryDate: '2025-03-15T10:30:00Z',
    usageStats: {
      logins: 12,
      timeSpent: 4.5,
      featuresExplored: [
        'AI Flow',
        'Route Optimization',
        'Compliance Dashboard',
        'Live Tracking',
      ],
      lastAccess: '2024-12-16T14:20:00Z',
    },
    status: 'active',
  },
  {
    id: 'DE-002',
    companyName: 'ServiceNow Inc.',
    environmentType: 'Executive Demo',
    accessUrl: 'https://demo-servicenow.fleetflowapp.com',
    createdDate: '2024-12-14T16:45:00Z',
    expiryDate: '2025-01-14T16:45:00Z',
    usageStats: {
      logins: 3,
      timeSpent: 1.2,
      featuresExplored: ['Workflow Automation', 'Task Prioritization'],
      lastAccess: '2024-12-15T11:10:00Z',
    },
    status: 'active',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    // Calculate metrics
    const metrics: AcquisitionMetrics = {
      totalTargets: strategicBuyers.length,
      activeOutreach: outreachCampaigns.filter((c) => c.status === 'active')
        .length,
      responseRate:
        outreachCampaigns.reduce((acc, c) => acc + c.responseRate, 0) /
        outreachCampaigns.length,
      meetingsScheduled: outreachCampaigns.reduce(
        (acc, c) => acc + c.meetingsScheduled,
        0
      ),
      demosDeployed: demoEnvironments.filter((d) => d.status === 'active')
        .length,
      pipelineValue: '$150-225B',
      avgDealSize: '$25B',
      timeToClose: 12, // months
    };

    switch (type) {
      case 'buyers':
        return NextResponse.json({ buyers: strategicBuyers });
      case 'campaigns':
        return NextResponse.json({ campaigns: outreachCampaigns });
      case 'demos':
        return NextResponse.json({ demos: demoEnvironments });
      case 'metrics':
        return NextResponse.json({ metrics });
      default:
        return NextResponse.json({
          buyers: strategicBuyers,
          campaigns: outreachCampaigns,
          demos: demoEnvironments,
          metrics,
        });
    }
  } catch (error) {
    console.error('Strategic Acquisition API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategic acquisition data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action, data } = body;

    switch (type) {
      case 'buyer':
        if (action === 'create') {
          const newBuyer: StrategicBuyer = {
            id: `SB-${String(strategicBuyers.length + 1).padStart(3, '0')}`,
            ...data,
            lastActivity: new Date().toISOString(),
          };
          strategicBuyers.push(newBuyer);
          return NextResponse.json({ success: true, buyer: newBuyer });
        } else if (action === 'update') {
          const index = strategicBuyers.findIndex((b) => b.id === data.id);
          if (index !== -1) {
            strategicBuyers[index] = {
              ...strategicBuyers[index],
              ...data,
              lastActivity: new Date().toISOString(),
            };
            return NextResponse.json({
              success: true,
              buyer: strategicBuyers[index],
            });
          }
        }
        break;

      case 'campaign':
        if (action === 'create') {
          const newCampaign: OutreachCampaign = {
            id: `OC-${String(outreachCampaigns.length + 1).padStart(3, '0')}`,
            ...data,
            lastSent: new Date().toISOString(),
          };
          outreachCampaigns.push(newCampaign);
          return NextResponse.json({ success: true, campaign: newCampaign });
        } else if (action === 'update') {
          const index = outreachCampaigns.findIndex((c) => c.id === data.id);
          if (index !== -1) {
            outreachCampaigns[index] = { ...outreachCampaigns[index], ...data };
            return NextResponse.json({
              success: true,
              campaign: outreachCampaigns[index],
            });
          }
        }
        break;

      case 'demo':
        if (action === 'create') {
          const newDemo: DemoEnvironment = {
            id: `DE-${String(demoEnvironments.length + 1).padStart(3, '0')}`,
            ...data,
            createdDate: new Date().toISOString(),
            expiryDate: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000
            ).toISOString(), // 90 days
            usageStats: {
              logins: 0,
              timeSpent: 0,
              featuresExplored: [],
              lastAccess: '',
            },
            status: 'active',
          };
          demoEnvironments.push(newDemo);
          return NextResponse.json({ success: true, demo: newDemo });
        }
        break;

      case 'ai_action':
        // AI-powered actions
        if (action === 'generate_outreach') {
          const { buyerId, template } = data;
          const buyer = strategicBuyers.find((b) => b.id === buyerId);
          if (buyer) {
            // Simulate AI-generated personalized outreach
            const aiOutreach = {
              subject: `Strategic Partnership Opportunity: FleetFlow x ${buyer.companyName}`,
              content: `Dear ${buyer.keyDecisionMakers[0]?.name},\n\nI hope this message finds you well. Given ${buyer.companyName}'s recent focus on ${buyer.recentAcquisitions[0]?.split('(')[0]} and your strategic vision for industry transformation, I believe FleetFlow presents a compelling acquisition opportunity...\n\n[AI-generated personalized content based on company research and strategic fit analysis]`,
              personalizations: [
                `References recent acquisition: ${buyer.recentAcquisitions[0]}`,
                `Strategic fit score: ${buyer.strategicFit}%`,
                `Tailored for ${buyer.keyDecisionMakers[0]?.title} level`,
              ],
            };
            return NextResponse.json({ success: true, outreach: aiOutreach });
          }
        } else if (action === 'analyze_buyer') {
          const { buyerId } = data;
          const buyer = strategicBuyers.find((b) => b.id === buyerId);
          if (buyer) {
            // Simulate AI analysis
            const analysis = {
              strategicRecommendations: [
                'Focus on Azure integration capabilities for Microsoft positioning',
                'Emphasize multi-tenant SaaS architecture and enterprise scalability',
                'Highlight AI-powered automation as competitive differentiator',
              ],
              bestContactTime: 'Tuesday-Thursday, 9-11 AM PST',
              keyMessagePoints: [
                `${buyer.companyName} values: Innovation, Scale, Market Leadership`,
                'FleetFlow positioning: "The Salesforce of Transportation"',
                'Strategic value: $150-225B life-of-asset potential',
              ],
              riskFactors: [
                'Competition from internal development teams',
                'Economic conditions affecting M&A activity',
                'Regulatory approval requirements for large acquisitions',
              ],
            };
            return NextResponse.json({ success: true, analysis });
          }
        }
        break;
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Strategic Acquisition POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to process strategic acquisition request' },
      { status: 500 }
    );
  }
}
