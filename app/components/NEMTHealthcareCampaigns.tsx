'use client';

import { useState } from 'react';

export interface NEMTCampaign {
  id: string;
  name: string;
  phase: number;
  status: 'not-started' | 'in-progress' | 'complete' | 'blocked';
  timeline: string;
  dependencies: string[];
  assignedStaff: string[];
  tasks: NEMTTask[];
  completionCriteria: string[];
  deliverables: string[];
}

export interface NEMTTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timeline: string;
  status: 'pending' | 'in-progress' | 'complete';
  category: string;
  deliverables: string[];
}

interface NEMTHealthcareCampaignsProps {
  onCampaignDeploy?: (campaign: NEMTCampaign) => void;
}

const NEMT_CAMPAIGNS: NEMTCampaign[] = [
  {
    id: 'campaign-1',
    name: 'Campaign 1: NEMT Foundation - Business & Document Verification',
    phase: 1,
    status: 'not-started',
    timeline: '3-5 days',
    dependencies: [],
    assignedStaff: ['kameelah-014', 'regina-015'],
    completionCriteria: [
      '✅ All business documents verified and current',
      '✅ Insurance coverage confirmed for both states',
      '✅ Banking ready for Medicaid reimbursements',
      '✅ Document package organized and ready',
    ],
    deliverables: [
      'Complete document verification report',
      'Organized document vault',
      'Insurance compliance certificates',
      'Banking authorization forms',
    ],
    tasks: [
      {
        id: 'task-1-1',
        title: 'Business Registration Verification',
        description:
          'Verify DEE DAVIS INC Michigan registration status, obtain Michigan Certificate of Good Standing, verify Federal EIN and NPI 1538939111',
        assignedTo: ['kameelah-014', 'regina-015'],
        priority: 'CRITICAL',
        timeline: '2 days',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'Michigan Certificate of Good Standing verified',
          'Federal EIN current',
          'NPI 1538939111 active in NPPES',
        ],
      },
      {
        id: 'task-1-2',
        title: 'Insurance Multi-State Verification',
        description:
          'Review Hartford Insurance for NEMT coverage, verify Michigan and Maryland coverage, request multi-state certificates',
        assignedTo: ['kameelah-014'],
        priority: 'CRITICAL',
        timeline: '2 days',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'Hartford policy reviewed for NEMT operations',
          'Multi-state coverage confirmed',
          'Certificate of Insurance obtained',
        ],
      },
      {
        id: 'task-1-3',
        title: 'Banking & Financial Setup',
        description:
          'Verify AmEx Business Account for ACH/direct deposit, confirm can receive government payments',
        assignedTo: ['kameelah-014'],
        priority: 'CRITICAL',
        timeline: '1 day',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'Banking verification complete',
          'Direct deposit authorization ready',
          'State payment setup confirmed',
        ],
      },
    ],
  },
  {
    id: 'campaign-2a',
    name: 'Campaign 2A: Michigan Medicaid Provider Enrollment',
    phase: 2,
    status: 'blocked',
    timeline: '14-21 days (prep) + 30-45 days (processing)',
    dependencies: ['campaign-1'],
    assignedStaff: ['kameelah-014', 'regina-015'],
    completionCriteria: [
      '✅ Michigan Medicaid provider approval received',
      '✅ Michigan NEMT license approved',
      '✅ ModivCare provider status active',
      '✅ Provider ID numbers assigned',
    ],
    deliverables: [
      'Active Michigan Medicaid provider status for NPI 1538939111',
      'Michigan NEMT provider license',
      'ModivCare transportation provider approval',
    ],
    tasks: [
      {
        id: 'task-2a-1',
        title: 'Michigan Requirements Research',
        description:
          'Download all Michigan MDHHS forms, research NEMT requirements, document MCO landscape',
        assignedTo: ['kameelah-014', 'regina-015'],
        priority: 'CRITICAL',
        timeline: '3 days',
        status: 'pending',
        category: 'research',
        deliverables: [
          'Michigan MDHHS forms collected',
          'NEMT requirements documented',
          'MCO landscape analysis',
        ],
      },
      {
        id: 'task-2a-2',
        title: 'Michigan Application Package Preparation',
        description:
          'Complete Michigan Medicaid provider enrollment, NEMT license application, ModivCare application, draft operations manual',
        assignedTo: ['kameelah-014', 'regina-015'],
        priority: 'CRITICAL',
        timeline: '7 days',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'Michigan Medicaid application complete',
          'NEMT provider license application ready',
          'Service operations manual drafted',
          'Quality assurance plan created',
        ],
      },
      {
        id: 'task-2a-3',
        title: 'Michigan Application Submission & Tracking',
        description:
          'Submit MDHHS enrollment, NEMT license, ModivCare application, track confirmation numbers',
        assignedTo: ['kameelah-014'],
        priority: 'CRITICAL',
        timeline: '2 days',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'All applications submitted',
          'Confirmation numbers tracked',
          'Status monitoring dashboard active',
        ],
      },
    ],
  },
  {
    id: 'campaign-2b',
    name: 'Campaign 2B: Maryland Medicaid Provider Enrollment',
    phase: 2,
    status: 'blocked',
    timeline: '14-21 days (prep) + 30-45 days (processing)',
    dependencies: ['campaign-1'],
    assignedStaff: ['regina-015'],
    completionCriteria: [
      '✅ Maryland Medicaid provider approval received',
      '✅ Maryland NEMT license approved',
      '✅ Maryland RFQ response evaluated',
      '✅ Provider ID numbers assigned',
    ],
    deliverables: [
      'Active Maryland Medicaid provider status',
      'Maryland RFQ contract (if awarded)',
      'Foreign corporation status (if needed)',
    ],
    tasks: [
      {
        id: 'task-2b-1',
        title: 'Maryland Requirements Research',
        description:
          'Download Maryland DHMH forms, research foreign corporation requirements, analyze Maryland RFQ',
        assignedTo: ['regina-015'],
        priority: 'CRITICAL',
        timeline: '3 days',
        status: 'pending',
        category: 'research',
        deliverables: [
          'Maryland forms collected',
          'Foreign corporation requirements documented',
          'RFQ requirements analyzed',
        ],
      },
      {
        id: 'task-2b-2',
        title: 'Maryland Application Package Preparation',
        description:
          'Complete Maryland Medicaid enrollment, NEMT application, RFQ response, operations manual',
        assignedTo: ['regina-015'],
        priority: 'CRITICAL',
        timeline: '7 days',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'Maryland Medicaid application complete',
          'Maryland RFQ response ready',
          'Operations manual (Maryland-specific)',
        ],
      },
      {
        id: 'task-2b-3',
        title: 'Maryland Application Submission',
        description:
          'Submit Maryland Medicaid enrollment, NEMT application, RFQ response',
        assignedTo: ['regina-015'],
        priority: 'CRITICAL',
        timeline: '2 days',
        status: 'pending',
        category: 'compliance',
        deliverables: [
          'All Maryland applications submitted',
          'RFQ response delivered',
          'Tracking dashboard configured',
        ],
      },
    ],
  },
  {
    id: 'campaign-3',
    name: 'Campaign 3: MCO Contracting - Michigan',
    phase: 3,
    status: 'blocked',
    timeline: '21-45 days',
    dependencies: ['campaign-2a'],
    assignedStaff: ['will-004', 'kameelah-014'],
    completionCriteria: [
      '✅ At least 2 Michigan MCO contracts signed and active',
      '✅ Provider portal access for each MCO',
      '✅ Billing setup complete for each MCO',
    ],
    deliverables: [
      'Active contracts with Meridian Health Plan',
      'Active contracts with Molina Healthcare Michigan',
      'MCO billing integration complete',
    ],
    tasks: [
      {
        id: 'task-3-1',
        title: 'Michigan MCO Application Preparation',
        description:
          'Complete provider applications for 5 Michigan MCOs: Meridian, Molina, UnitedHealthcare, HAP, Total Health Care',
        assignedTo: ['will-004', 'kameelah-014'],
        priority: 'HIGH',
        timeline: '7 days',
        status: 'pending',
        category: 'partnerships',
        deliverables: [
          '5 MCO applications complete',
          'Rate negotiation strategy prepared',
          'Credentialing packages ready',
        ],
      },
      {
        id: 'task-3-2',
        title: 'MCO Credentialing & Contract Negotiation',
        description:
          'Monitor credentialing status, negotiate rates, finalize contracts with Michigan MCOs',
        assignedTo: ['will-004'],
        priority: 'HIGH',
        timeline: 'Ongoing',
        status: 'pending',
        category: 'partnerships',
        deliverables: [
          'Credentialing completed',
          'Rate agreements finalized',
          'Contracts signed with 2+ MCOs',
        ],
      },
    ],
  },
  {
    id: 'campaign-4',
    name: 'Campaign 4: MCO Contracting - Maryland',
    phase: 3,
    status: 'blocked',
    timeline: '21-45 days',
    dependencies: ['campaign-2b'],
    assignedStaff: ['will-004'],
    completionCriteria: [
      '✅ At least 2 Maryland MCO contracts signed and active',
      '✅ Provider portal access for each MCO',
      '✅ Billing setup complete for each MCO',
    ],
    deliverables: [
      'Active contracts with UnitedHealthcare Maryland',
      'Active contracts with Amerigroup Maryland',
      'MCO billing integration complete',
    ],
    tasks: [
      {
        id: 'task-4-1',
        title: 'Maryland MCO Application Preparation',
        description:
          'Complete provider applications for 5 Maryland MCOs: UnitedHealthcare, Amerigroup, Cigna, Kaiser, Molina',
        assignedTo: ['will-004'],
        priority: 'HIGH',
        timeline: '7 days',
        status: 'pending',
        category: 'partnerships',
        deliverables: [
          '5 MCO applications complete',
          'Rate negotiation strategy',
          'Credentialing packages',
        ],
      },
      {
        id: 'task-4-2',
        title: 'Maryland MCO Credentialing & Negotiation',
        description:
          'Monitor credentialing, negotiate rates, finalize contracts',
        assignedTo: ['will-004'],
        priority: 'HIGH',
        timeline: 'Ongoing',
        status: 'pending',
        category: 'partnerships',
        deliverables: [
          'Credentialing completed',
          'Contracts signed with 2+ MCOs',
        ],
      },
    ],
  },
  {
    id: 'campaign-5',
    name: 'Campaign 5: Uber Health Partnership',
    phase: 4,
    status: 'blocked',
    timeline: '10-14 days',
    dependencies: ['campaign-2a'],
    assignedStaff: ['will-004', 'brook-009'],
    completionCriteria: [
      '✅ Uber Health partnership agreement signed',
      '✅ API credentials received',
      '✅ Service areas configured (Michigan + Maryland)',
      '✅ Billing relationship established',
    ],
    deliverables: [
      'Active Uber Health partnership with API access',
      'Integration documentation received',
      'Service area configuration complete',
    ],
    tasks: [
      {
        id: 'task-5-1',
        title: 'Uber Health Partnership Application',
        description:
          'Complete Uber Health enterprise application, register DEPOINTE as NEMT coordination partner',
        assignedTo: ['will-004', 'brook-009'],
        priority: 'CRITICAL',
        timeline: '5 days',
        status: 'pending',
        category: 'partnerships',
        deliverables: [
          'Uber Health application submitted',
          'DEPOINTE registered as partner',
          'Michigan Medicaid proof provided',
        ],
      },
      {
        id: 'task-5-2',
        title: 'Uber Health Contract Negotiation',
        description:
          'Negotiate volume pricing, establish billing terms, define service areas',
        assignedTo: ['will-004'],
        priority: 'CRITICAL',
        timeline: '3 days',
        status: 'pending',
        category: 'partnerships',
        deliverables: [
          'Volume pricing negotiated',
          'Billing terms established',
          'Service areas defined',
        ],
      },
      {
        id: 'task-5-3',
        title: 'Uber Health API Setup',
        description:
          'Receive API credentials and integration documentation for system build',
        assignedTo: ['brook-009'],
        priority: 'CRITICAL',
        timeline: '2 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'API credentials received',
          'Integration docs obtained',
          'Test environment configured',
        ],
      },
    ],
  },
  {
    id: 'campaign-6',
    name: 'Campaign 6: DEPOINTE NEMT System Build',
    phase: 5,
    status: 'blocked',
    timeline: '21-30 days',
    dependencies: ['campaign-2a', 'campaign-3', 'campaign-5'],
    assignedStaff: ['brook-009', 'kameelah-014'],
    completionCriteria: [
      '✅ Successfully book and complete test ride via system',
      '✅ Successfully generate and submit test claim',
      '✅ Patient data stored and retrieved securely',
      '✅ All workflows tested and validated',
      '✅ HIPAA compliance audit passed',
      '✅ Team trained on system',
    ],
    deliverables: [
      'Fully operational DEPOINTE NEMT system for Michigan',
      'HIPAA-compliant patient database',
      'Uber Health API integration',
      'Michigan MMIS billing system',
    ],
    tasks: [
      {
        id: 'task-6-1',
        title: 'Patient Management System',
        description:
          'Build HIPAA-compliant patient database with intake, eligibility verification, medical accommodation tracking',
        assignedTo: ['brook-009'],
        priority: 'CRITICAL',
        timeline: '7 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'Patient database operational',
          'Intake forms functional',
          'Eligibility verification system',
        ],
      },
      {
        id: 'task-6-2',
        title: 'Uber Health API Integration',
        description:
          'Connect Uber Health API for one-click ride booking, real-time tracking, automated notifications',
        assignedTo: ['brook-009'],
        priority: 'CRITICAL',
        timeline: '7 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'Uber API connected',
          'Ride booking interface live',
          'Real-time tracking functional',
        ],
      },
      {
        id: 'task-6-3',
        title: 'Michigan Medicaid Billing System',
        description:
          'Build Michigan MMIS integration, MCO-specific claim formats, automated claim generation',
        assignedTo: ['brook-009', 'kameelah-014'],
        priority: 'CRITICAL',
        timeline: '7 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'MMIS integration complete',
          'MCO claim formats configured',
          'Automated claim generation working',
        ],
      },
      {
        id: 'task-6-4',
        title: 'Trip Coordination Dashboard',
        description:
          'Build real-time coordination interface, healthcare provider portal, automated reminders',
        assignedTo: ['brook-009'],
        priority: 'HIGH',
        timeline: '5 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'Coordination dashboard operational',
          'Provider request portal live',
          'Automated reminders working',
        ],
      },
      {
        id: 'task-6-5',
        title: 'System Testing & Go-Live Prep',
        description:
          'End-to-end workflow testing, HIPAA compliance audit, team training',
        assignedTo: ['brook-009'],
        priority: 'CRITICAL',
        timeline: '5 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'All workflows tested',
          'HIPAA audit passed',
          'Team training complete',
        ],
      },
    ],
  },
  {
    id: 'campaign-7',
    name: 'Campaign 7: Michigan Operations Launch',
    phase: 6,
    status: 'blocked',
    timeline: '30-90 days (ramp-up)',
    dependencies: ['campaign-6'],
    assignedStaff: ['will-004', 'kameelah-014', 'brook-009'],
    completionCriteria: [
      '✅ Minimum 100 trips/week consistently',
      '✅ 95%+ claim approval rate',
      '✅ 90%+ on-time performance',
      '✅ Positive patient satisfaction scores',
      '✅ Break-even or profitable operations',
      '✅ Stable, repeatable processes',
    ],
    deliverables: [
      'Profitable Michigan NEMT operations with proven model',
      'Operational playbook documented',
      'Revenue stream established',
    ],
    tasks: [
      {
        id: 'task-7-1',
        title: 'Michigan Soft Launch',
        description:
          'Accept first 5-10 patients, schedule first trips, monitor closely for issues',
        assignedTo: ['will-004', 'brook-009'],
        priority: 'CRITICAL',
        timeline: '14 days',
        status: 'pending',
        category: 'operations',
        deliverables: [
          'First patients onboarded',
          'First trips completed successfully',
          'Issues identified and resolved',
        ],
      },
      {
        id: 'task-7-2',
        title: 'Michigan Volume Ramp-Up',
        description:
          'Increase to 25-50 trips/week, add healthcare facility relationships, market to MCO case managers',
        assignedTo: ['will-004'],
        priority: 'HIGH',
        timeline: '45 days',
        status: 'pending',
        category: 'operations',
        deliverables: [
          '50+ trips/week achieved',
          'Facility partnerships established',
          'Recurring appointment base built',
        ],
      },
      {
        id: 'task-7-3',
        title: 'Financial Validation & Scale',
        description:
          'Submit claims, track approval rates, monitor cash flow, scale to 100-200 trips/week',
        assignedTo: ['kameelah-014'],
        priority: 'HIGH',
        timeline: '30 days',
        status: 'pending',
        category: 'operations',
        deliverables: [
          '100+ trips/week consistent',
          '95%+ claim approval',
          'Break-even achieved',
        ],
      },
    ],
  },
  {
    id: 'campaign-8',
    name: 'Campaign 8: Maryland System Build & Launch',
    phase: 7,
    status: 'blocked',
    timeline: '30-45 days',
    dependencies: ['campaign-4', 'campaign-7'],
    assignedStaff: ['brook-009', 'will-004'],
    completionCriteria: [
      '✅ Maryland operations profitable',
      '✅ Both states running smoothly',
      '✅ Dual-state model validated',
    ],
    deliverables: [
      'Successful two-state NEMT operations',
      'Maryland revenue stream established',
      'Proven expansion playbook',
    ],
    tasks: [
      {
        id: 'task-8-1',
        title: 'Maryland System Configuration',
        description:
          'Clone Michigan system architecture, configure Maryland-specific billing, add Maryland service area',
        assignedTo: ['brook-009'],
        priority: 'HIGH',
        timeline: '7 days',
        status: 'pending',
        category: 'api-integration',
        deliverables: [
          'Maryland system configured',
          'Billing formats set up',
          'Uber Health Maryland area added',
        ],
      },
      {
        id: 'task-8-2',
        title: 'Maryland Launch & Ramp-Up',
        description:
          'First 5-10 Maryland patients, process RFQ trips, scale to target volume',
        assignedTo: ['will-004'],
        priority: 'HIGH',
        timeline: '38 days',
        status: 'pending',
        category: 'operations',
        deliverables: [
          'Maryland operations launched',
          'RFQ contract trips delivered',
          'Target volume achieved',
        ],
      },
    ],
  },
  {
    id: 'campaign-9',
    name: 'Campaign 9: Systematic Multi-State Expansion',
    phase: 8,
    status: 'blocked',
    timeline: 'Ongoing (repeat per state)',
    dependencies: ['campaign-8'],
    assignedStaff: ['kameelah-014', 'regina-015', 'will-004', 'brook-009'],
    completionCriteria: [
      'Proven, profitable model replicated',
      'Each state follows systematic process',
      'Revenue scaling as planned',
    ],
    deliverables: [
      'State expansion playbook',
      'Multi-state operations success',
      'National NEMT coverage',
    ],
    tasks: [
      {
        id: 'task-9-1',
        title:
          'Wave 1: Adjacent States (Ohio, Indiana, Illinois, Pennsylvania)',
        description:
          'Replicate proven model in 4 adjacent states using systematic expansion template',
        assignedTo: ['kameelah-014', 'regina-015', 'will-004', 'brook-009'],
        priority: 'MEDIUM',
        timeline: '120 days per state',
        status: 'pending',
        category: 'operations',
        deliverables: [
          '4 additional states operational',
          'Regional hub established',
          'Revenue targets met',
        ],
      },
    ],
  },
];

export default function NEMTHealthcareCampaigns({
  onCampaignDeploy,
}: NEMTHealthcareCampaignsProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<NEMTCampaign | null>(
    null
  );
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);

  const toggleCampaign = (campaignId: string) => {
    setExpandedCampaigns((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return '#22c55e';
      case 'in-progress':
        return '#3b82f6';
      case 'blocked':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'blocked':
        return '🔒';
      default:
        return '⏸️';
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: '30px',
          padding: '24px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: '12px',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: '700',
            margin: '0 0 8px 0',
          }}
        >
          🏥 NEMT Healthcare System - Sequential Campaign Execution
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
          DEE DAVIS INC dba DEPOINTE | NPI: 1538939111 | Michigan + Maryland
          Launch
        </p>
        <div
          style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
            }}
          >
            <div style={{ color: 'white', fontSize: '0.85rem', opacity: 0.9 }}>
              Total Campaigns
            </div>
            <div
              style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}
            >
              9
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
            }}
          >
            <div style={{ color: 'white', fontSize: '0.85rem', opacity: 0.9 }}>
              Timeline
            </div>
            <div
              style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}
            >
              9 months
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
            }}
          >
            <div style={{ color: 'white', fontSize: '0.85rem', opacity: 0.9 }}>
              Target States
            </div>
            <div
              style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}
            >
              MI + MD
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Flow Diagram */}
      <div
        style={{
          marginBottom: '30px',
          padding: '20px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
        }}
      >
        <h3
          style={{
            color: 'white',
            marginBottom: '16px',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}
        >
          📊 Sequential Campaign Dependencies
        </h3>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            lineHeight: '1.8',
          }}
        >
          <div>Campaign 1 (Foundation)</div>
          <div style={{ paddingLeft: '20px' }}>↓</div>
          <div>Campaign 2A (Michigan) ──┬─→ Campaign 3 (MI MCOs) ──┐</div>
          <div style={{ paddingLeft: '20px' }}>
            ↓
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓
          </div>
          <div style={{ paddingLeft: '20px' }}>
            ↓
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─→
            Campaign 5 (Uber) ──────┼─→ Campaign 6 (System) → Campaign 7 (MI
            Launch)
          </div>
          <div style={{ paddingLeft: '20px' }}>
            ↓
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↑
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓
          </div>
          <div>
            Campaign 2B (Maryland) ──→ Campaign 4 (MD MCOs) ─────┘
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓
          </div>
          <div style={{ paddingLeft: '150px' }}>Campaign 8 (MD Launch)</div>
          <div style={{ paddingLeft: '170px' }}>↓</div>
          <div style={{ paddingLeft: '150px' }}>Campaign 9 (Multi-State)</div>
        </div>
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
          }}
        >
          <p style={{ color: '#f59e0b', fontSize: '0.9rem', margin: 0 }}>
            <strong>⚠️ Sequential Execution:</strong> Each campaign must be
            completed before the next begins. No steps can be skipped.
          </p>
        </div>
      </div>

      {/* Campaign Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {NEMT_CAMPAIGNS.map((campaign) => (
          <div
            key={campaign.id}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: `2px solid ${getStatusColor(campaign.status)}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Campaign Header */}
            <div
              onClick={() => toggleCampaign(campaign.id)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${getStatusColor(campaign.status)}20 0%, transparent 100%)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>
                    {getStatusIcon(campaign.status)}
                  </span>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      margin: 0,
                    }}
                  >
                    {campaign.name}
                  </h3>
                </div>
                <div
                  style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                >
                  <span
                    style={{
                      background: getStatusColor(campaign.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {campaign.status.replace('-', ' ')}
                  </span>
                  <span style={{ color: 'white', fontSize: '1.2rem' }}>
                    {expandedCampaigns.includes(campaign.id) ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  marginTop: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.75rem',
                      marginBottom: '4px',
                    }}
                  >
                    Timeline
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    📅 {campaign.timeline}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.75rem',
                      marginBottom: '4px',
                    }}
                  >
                    Tasks
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    ✓ {campaign.tasks.length} tasks
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.75rem',
                      marginBottom: '4px',
                    }}
                  >
                    Staff
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    👥 {campaign.assignedStaff.length} assigned
                  </div>
                </div>
                {campaign.dependencies.length > 0 && (
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.75rem',
                        marginBottom: '4px',
                      }}
                    >
                      Dependencies
                    </div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      🔒 {campaign.dependencies.length} required
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Campaign Details */}
            {expandedCampaigns.includes(campaign.id) && (
              <div
                style={{
                  padding: '20px',
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                }}
              >
                {/* Completion Criteria */}
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    🎯 Completion Criteria
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {campaign.completionCriteria.map((criteria, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px',
                          color: '#22c55e',
                          fontSize: '0.85rem',
                        }}
                      >
                        {criteria}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    📋 Tasks ({campaign.tasks.length})
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {campaign.tasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <h5
                            style={{
                              color: 'white',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              margin: 0,
                            }}
                          >
                            {task.title}
                          </h5>
                          <span
                            style={{
                              background:
                                task.priority === 'CRITICAL'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : 'rgba(245, 158, 11, 0.2)',
                              color:
                                task.priority === 'CRITICAL'
                                  ? '#ef4444'
                                  : '#f59e0b',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                            }}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.85rem',
                            marginBottom: '12px',
                          }}
                        >
                          {task.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            gap: '16px',
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          <span>📅 {task.timeline}</span>
                          <span>👥 {task.assignedTo.length} staff</span>
                          <span>✓ {task.deliverables.length} deliverables</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    📦 Key Deliverables
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    {campaign.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          color: '#3b82f6',
                          fontSize: '0.85rem',
                        }}
                      >
                        {deliverable}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deploy Button */}
                {campaign.status === 'not-started' &&
                  campaign.dependencies.length === 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                      <button
                        onClick={() => onCampaignDeploy?.(campaign)}
                        style={{
                          background:
                            'linear-gradient(135deg, #22c55e, #16a34a)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        🚀 Deploy Campaign
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
        }}
      >
        <h4
          style={{
            color: '#3b82f6',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '12px',
          }}
        >
          ℹ️ How Sequential Campaigns Work
        </h4>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
          }}
        >
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Step 1:</strong> Complete Campaign 1 (Foundation) - All
            documents verified
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Step 2:</strong> Deploy Campaigns 2A & 2B (State
            Applications) in parallel
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Step 3:</strong> After state approvals, deploy MCO and Uber
            Health campaigns
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Step 4:</strong> Build DEPOINTE system once all partnerships
            secured
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Step 5:</strong> Launch operations state by state
          </p>
          <p style={{ margin: '12px 0 0 0', color: '#f59e0b' }}>
            <strong>⚠️ Important:</strong> No campaign can start until its
            dependencies are complete. This ensures systematic, controlled
            execution.
          </p>
        </div>
      </div>
    </div>
  );
}
