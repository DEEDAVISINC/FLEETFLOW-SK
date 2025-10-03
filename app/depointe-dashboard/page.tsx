'use client';

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

import InternalAdaptiveLearning from '../components/InternalAdaptiveLearning';

import { useEffect, useState } from 'react';
import AIStaffScheduler from '../components/AIStaffScheduler';
import CampaignTemplates from '../components/CampaignTemplates';
import ChinaUSADDPService from '../components/ChinaUSADDPService';
import DesperateProspectsBatchDeployment, {
  DesperateProspectsTask,
} from '../components/DesperateProspectsBatchDeployment';
import FreightBrainDashboard from '../components/FreightBrainDashboard';
import HealthcareBatchDeployment, {
  HealthcareTask,
} from '../components/HealthcareBatchDeployment';
import HybridNEMTSystem from '../components/HybridNEMTSystem';
import NEMTHealthcareCampaigns from '../components/NEMTHealthcareCampaigns';
import PowerUpsDashboard from '../components/PowerUpsDashboard';
import { SalesCopilotPanel } from '../components/SalesCopilotPanel';
import ShipperBatchDeployment, {
  ShipperTask,
} from '../components/ShipperBatchDeployment';
import TaskCreationInterface from '../components/TaskCreationInterface';

// DEPOINTE AI Staff with Human Names (all 18 members) - No mock data
// Helper function for AI staff to access their marketing mastery
export const getAIMarketingMastery = (staffId: string) => {
  const staff = depointeStaff.find((s) => s.id === staffId);
  return staff?.marketingMastery || null;
};

export const getAIStrategyAccess = (staffId: string, strategyId: string) => {
  const mastery = getAIMarketingMastery(staffId);
  if (!mastery) return null;

  const hasAccess = mastery.primaryStrategies.includes(strategyId);
  return {
    hasAccess,
    expertiseLevel: mastery.expertiseLevel,
    aiApplications: mastery.aiApplications,
    successPatterns: mastery.successPatterns,
  };
};

export const depointeStaff = [
  {
    id: 'desiree-001',
    name: 'Desiree',
    role: 'Desperate Prospects Specialist',
    department: 'Business Development',
    avatar: '🎯',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Resistance Removal Sales System Expert',
      'Psychology-based prospect engagement',
      'Unseen Leadership implementation',
      'Sales script elimination techniques',
      'Emotional intelligence in sales',
      'Client resistance pattern recognition',
      'Relationship building without scripts',
      '49 Factors of Unseen Leadership mastery',
    ],
    marketingMastery: {
      primaryStrategies: ['client-value', 'referrals', 'sales-process'],
      expertiseLevel: 'Advanced',
      coreCompetencies: [
        'Resistance Removal Sales System',
        'Value-Based Communication',
        'Lead Qualification Optimization',
        'Referral Generation Systems',
      ],
      aiApplications: [
        'Pattern recognition for resistance indicators',
        'Automated objection handling algorithms',
        'Real-time value communication optimization',
        'Prospect motivation analysis and response',
      ],
      successPatterns: [
        'Identify resistance patterns in first 30 seconds',
        'Apply appropriate psychological techniques automatically',
        'Build trust through authentic, script-free conversations',
        'Convert 75% of qualified desperate prospects',
      ],
      improvementAreas: [
        'Advanced NLP for deeper emotional analysis',
        'Predictive resistance pattern anticipation',
        'Multi-cultural psychology adaptation',
      ],
    },
  },
  {
    id: 'cliff-002',
    name: 'Cliff',
    role: 'Desperate Prospects Hunter',
    department: 'Business Development',
    avatar: '⛰️',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Resistance Removal Sales System Expert',
      'Cold prospect engagement specialist',
      'Unseen Leadership in prospecting',
      'Sales script elimination for cold calls',
      'Resistance pattern identification',
      'Psychology of desperate prospect motivation',
      'Relationship building in high-pressure scenarios',
      '49 Factors of Unseen Leadership application',
    ],
    marketingMastery: {
      primaryStrategies: ['client-value', 'referrals', 'follow-up'],
      expertiseLevel: 'Expert',
      coreCompetencies: [
        'Resistance Pattern Recognition',
        'Cold Prospect Engagement',
        'Psychology-Based Motivation',
        'Unseen Leadership Application',
      ],
      aiApplications: [
        'Automated cold outreach optimization',
        'Real-time engagement pattern analysis',
        'Predictive prospect response modeling',
        'High-pressure relationship building algorithms',
      ],
      successPatterns: [
        'Achieve 40% response rate on cold outreach',
        'Convert 60% of engaged prospects to qualified leads',
        'Build trust in high-pressure situations',
        'Generate 25+ qualified leads per week consistently',
      ],
      improvementAreas: [
        'Advanced sentiment analysis for prospect emotions',
        'Multi-channel engagement orchestration',
        'Predictive lead scoring enhancement',
      ],
    },
  },
  {
    id: 'gary-003',
    name: 'Gary',
    role: 'Lead Generation Specialist',
    department: 'Business Development',
    avatar: '📈',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Resistance Removal Sales System Expert',
      'Lead qualification through psychology',
      'Unseen Leadership in lead generation',
      'Script-free conversation techniques',
      'Prospect resistance pattern analysis',
      'Emotional intelligence lead scoring',
      'Relationship building from initial contact',
      '49 Factors of Unseen Leadership for lead nurturing',
    ],
    marketingMastery: {
      primaryStrategies: ['sales-process', 'client-value', 'referrals'],
      expertiseLevel: 'Advanced',
      coreCompetencies: [
        'Lead Scoring Algorithms',
        'Qualification Optimization',
        'Value-Based Communication',
        'Referral Network Management',
      ],
      aiApplications: [
        'Multi-dimensional lead scoring algorithms',
        'Automated qualification assessment',
        'Predictive lead conversion modeling',
        'Real-time lead nurturing optimization',
      ],
      successPatterns: [
        'Score leads with 95% accuracy using 50+ criteria',
        'Convert 70% of qualified leads to opportunities',
        'Achieve 40% month-over-month lead volume growth',
        'Maintain 85% lead quality score consistently',
      ],
      improvementAreas: [
        'Machine learning for lead scoring refinement',
        'Advanced behavioral analysis integration',
        'Cross-channel lead attribution modeling',
      ],
    },
  },
  {
    id: 'will-004',
    name: 'Will',
    role: 'Sales Operations Specialist',
    department: 'Freight Operations',
    avatar: '💼',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Resistance Removal Sales System Expert',
      'Sales process optimization through psychology',
      'Unseen Leadership in sales operations',
      'Script-free sales methodology implementation',
      'Team resistance removal techniques',
      'Sales psychology training and development',
      'Operational efficiency through emotional intelligence',
      '49 Factors of Unseen Leadership for team management',
    ],
    marketingMastery: {
      primaryStrategies: [
        'sales-process',
        'pricing-strategy',
        'qbr-management',
      ],
      expertiseLevel: 'Advanced',
      coreCompetencies: [
        'Process Optimization Algorithms',
        'Sales Operations Psychology',
        'Performance Analytics',
        'System Implementation',
      ],
      aiApplications: [
        'Automated sales process optimization',
        'Real-time performance analytics and reporting',
        'Predictive sales cycle modeling',
        'Dynamic pricing strategy implementation',
      ],
      successPatterns: [
        'Reduce sales cycle time by 35% through process optimization',
        'Improve team performance by 50% with analytics insights',
        'Implement 100% of recommended process improvements',
        'Achieve 90% forecast accuracy with predictive modeling',
      ],
      improvementAreas: [
        'Advanced machine learning for process prediction',
        'Real-time collaboration optimization',
        'Cross-functional process integration',
      ],
    },
  },
  {
    id: 'hunter-005',
    name: 'Hunter',
    role: 'Recruiting & Onboarding Specialist',
    department: 'Freight Operations',
    avatar: '🎯',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Unseen Leadership in team recruitment',
      'Psychology of candidate engagement',
      'Resistance removal in hiring processes',
      'Emotional intelligence in onboarding',
      'Team building through psychology',
      'Candidate resistance pattern analysis',
      'Relationship building in HR processes',
      '49 Factors of Unseen Leadership for team development',
    ],
  },
  {
    id: 'logan-006',
    name: 'Logan',
    role: 'Logistics Coordination Specialist',
    department: 'Freight Operations',
    avatar: '🚛',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Logistics psychology and coordination',
      'Unseen Leadership in supply chain management',
      'Resistance removal in operational challenges',
      'Emotional intelligence in team coordination',
      'Process optimization through psychology',
      'Stakeholder resistance pattern analysis',
      'Relationship building in logistics operations',
      '49 Factors of Unseen Leadership for operational efficiency',
    ],
  },
  {
    id: 'miles-007',
    name: 'Miles',
    role: 'Dispatch Coordination Specialist',
    department: 'Freight Operations',
    avatar: '📍',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Dispatch psychology and crisis management',
      'Unseen Leadership in real-time coordination',
      'Resistance removal in emergency situations',
      'Emotional intelligence in high-pressure dispatch',
      'Communication optimization through psychology',
      'Driver resistance pattern analysis',
      'Relationship building in transportation dispatch',
      '49 Factors of Unseen Leadership for crisis management',
    ],
  },
  {
    id: 'dee-008',
    name: 'Dee',
    role: 'Freight Brokerage Specialist',
    department: 'Freight Operations',
    avatar: '🚚',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Resistance Removal Sales System Expert',
      'Freight brokerage negotiation psychology',
      'Unseen Leadership in carrier relations',
      'Script-free carrier engagement techniques',
      'Carrier resistance pattern analysis',
      'Brokerage deal psychology and motivation',
      'Relationship building in transportation industry',
      '49 Factors of Unseen Leadership for brokerage operations',
    ],
  },
  {
    id: 'brook-009',
    name: 'Brook R.',
    role: 'Brokerage Operations Specialist',
    department: 'Relationships',
    avatar: '🌊',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Brokerage relationship psychology',
      'Unseen Leadership in partnership management',
      'Resistance removal in business negotiations',
      'Emotional intelligence in carrier relationships',
      'Network building through psychology',
      'Partner resistance pattern analysis',
      'Relationship maintenance in transportation industry',
      '49 Factors of Unseen Leadership for partnership development',
    ],
  },
  {
    id: 'carrie-010',
    name: 'Carrie R.',
    role: 'Carrier Relations Specialist',
    department: 'Relationships',
    avatar: '🚛',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Carrier relationship psychology',
      'Unseen Leadership in vendor management',
      'Resistance removal in carrier negotiations',
      'Emotional intelligence in B2B relationships',
      'Fleet management through psychology',
      'Carrier resistance pattern analysis',
      'Long-term partnership building techniques',
      '49 Factors of Unseen Leadership for carrier relations',
    ],
  },
  {
    id: 'shanell-011',
    name: 'Shanell',
    role: 'Customer Service Specialist',
    department: 'Support & Service',
    avatar: '💬',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Customer service psychology',
      'Unseen Leadership in support interactions',
      'Resistance removal in customer complaints',
      'Emotional intelligence in customer care',
      'De-escalation techniques through psychology',
      'Customer resistance pattern analysis',
      'Relationship building in service recovery',
      '49 Factors of Unseen Leadership for customer satisfaction',
    ],
  },
  {
    id: 'resse-012',
    name: 'Resse A. Bell',
    role: 'Accounting Specialist',
    department: 'Financial',
    avatar: '💰',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Financial psychology and decision making',
      'Unseen Leadership in financial management',
      'Resistance removal in budget negotiations',
      'Emotional intelligence in financial communications',
      'Cost-benefit analysis through psychology',
      'Stakeholder financial resistance pattern analysis',
      'Relationship building in financial partnerships',
      '49 Factors of Unseen Leadership for financial strategy',
    ],
  },
  {
    id: 'dell-013',
    name: 'Dell',
    role: 'IT Support Specialist',
    department: 'Technology',
    avatar: '💻',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Technical support psychology',
      'Unseen Leadership in IT problem solving',
      'Resistance removal in technical training',
      'Emotional intelligence in user support',
      'Change management through psychology',
      'User resistance pattern analysis',
      'Relationship building in technical support',
      '49 Factors of Unseen Leadership for digital transformation',
    ],
  },
  {
    id: 'kameelah-014',
    name: 'Kameelah',
    role: 'DOT Compliance Specialist',
    department: 'Compliance & Safety',
    avatar: '⚖️',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Compliance psychology and enforcement',
      'Unseen Leadership in regulatory compliance',
      'Resistance removal in safety training',
      'Emotional intelligence in compliance communications',
      'Behavior change through psychology',
      'Driver compliance resistance pattern analysis',
      'Relationship building in regulatory oversight',
      '49 Factors of Unseen Leadership for safety culture',
    ],
  },
  {
    id: 'regina-015',
    name: 'Regina',
    role: 'FMCSA Regulations Specialist',
    department: 'Compliance & Safety',
    avatar: '📋',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Regulatory psychology and interpretation',
      'Unseen Leadership in compliance management',
      'Resistance removal in regulatory training',
      'Emotional intelligence in policy enforcement',
      'Risk assessment through psychology',
      'Regulatory resistance pattern analysis',
      'Relationship building with regulatory bodies',
      '49 Factors of Unseen Leadership for compliance strategy',
    ],
  },
  {
    id: 'clarence-016',
    name: 'Clarence',
    role: 'Claims & Insurance Specialist',
    department: 'Support & Service',
    avatar: '🛡️',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Insurance claims psychology',
      'Unseen Leadership in claims processing',
      'Resistance removal in dispute resolution',
      'Emotional intelligence in customer advocacy',
      'Risk assessment through psychology',
      'Claimant resistance pattern analysis',
      'Relationship building in insurance partnerships',
      '49 Factors of Unseen Leadership for claims management',
    ],
  },
  {
    id: 'drew-017',
    name: 'Drew',
    role: 'Marketing Specialist',
    department: 'Business Development',
    avatar: '📢',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Resistance Removal Sales System Expert',
      'Marketing psychology and persuasion',
      'Unseen Leadership in marketing campaigns',
      'Script-free marketing message development',
      'Audience resistance pattern analysis',
      'Marketing funnel psychology optimization',
      'Brand relationship building through psychology',
      '49 Factors of Unseen Leadership for marketing strategy',
    ],
  },
  {
    id: 'cal-018',
    name: 'C. Allen Durr',
    role: 'Schedule Optimization Specialist',
    department: 'Operations',
    avatar: '📅',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Scheduling psychology and optimization',
      'Unseen Leadership in resource allocation',
      'Resistance removal in schedule changes',
      'Emotional intelligence in coordination',
      'Efficiency optimization through psychology',
      'Stakeholder scheduling resistance pattern analysis',
      'Relationship building in operational planning',
      '49 Factors of Unseen Leadership for operational excellence',
    ],
  },
  {
    id: 'ana-019',
    name: 'Ana Lyles',
    role: 'Data Analysis Specialist',
    department: 'Operations',
    avatar: '📊',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Data-driven psychology insights',
      'Unseen Leadership in analytical decision making',
      'Resistance removal in data interpretation',
      'Emotional intelligence in data presentation',
      'Behavioral analytics through psychology',
      'Stakeholder data resistance pattern analysis',
      'Relationship building through data insights',
      '49 Factors of Unseen Leadership for data strategy',
    ],
    marketingMastery: {
      primaryStrategies: [
        'qbr-management',
        'pricing-strategy',
        'sales-process',
      ],
      expertiseLevel: 'Expert',
      coreCompetencies: [
        'Data-Driven Insights',
        'Client Analytics',
        'Performance Prediction',
        'ROI Analysis',
      ],
      aiApplications: [
        'Advanced predictive analytics for client behavior',
        'Real-time performance metrics optimization',
        'Automated ROI calculation and presentation',
        'Behavioral pattern recognition and analysis',
      ],
      successPatterns: [
        'Achieve 95% accuracy in client behavior prediction',
        'Generate actionable insights from 10,000+ data points daily',
        'Improve forecast accuracy by 60% with predictive models',
        'Deliver ROI analysis in under 30 seconds for any scenario',
      ],
      improvementAreas: [
        'Deep learning for complex pattern recognition',
        'Real-time sentiment analysis integration',
        'Advanced NLP for unstructured data processing',
      ],
    },
  },
  {
    id: 'charin-020',
    name: 'Charin',
    role: 'AI Receptionist',
    department: 'Support & Service',
    avatar: '📞',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Reception and communication psychology',
      'Unseen Leadership in first impressions',
      'Resistance removal in initial interactions',
      'Emotional intelligence in customer welcoming',
      'Professional phone and email etiquette',
      'Call routing and prioritization analysis',
      'Client relationship initiation techniques',
      '49 Factors of Unseen Leadership for customer experience',
    ],
  },
  {
    id: 'roland-021',
    name: 'Roland',
    role: 'Carrier Relations Director',
    department: 'Relationships',
    avatar: '🚛',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Executive carrier relations management',
      'Unseen Leadership in strategic partnerships',
      'Resistance removal in high-level negotiations',
      'Emotional intelligence in executive relationships',
      'Strategic carrier network development',
      'Executive-level resistance pattern analysis',
      'Long-term carrier partnership strategy',
      '49 Factors of Unseen Leadership for relationship management',
    ],
  },
  {
    id: 'lea-d-022',
    name: 'Lea. D',
    role: 'Lead Nurturing Specialist',
    department: 'Business Development',
    avatar: '🌱',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Lead nurturing psychology',
      'Unseen Leadership in follow-up sequences',
      'Resistance removal in customer engagement',
      'Emotional intelligence in relationship development',
      'Conversion optimization through psychology',
      'Prospect resistance pattern analysis',
      'Long-term customer relationship building',
      '49 Factors of Unseen Leadership for lead management',
    ],
  },
  {
    id: 'alexis-executive-023',
    name: 'Alexis',
    role: 'AI Executive Assistant',
    department: 'Operations',
    avatar: '👔',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Executive assistance psychology',
      'Unseen Leadership in administrative support',
      'Resistance removal in executive communications',
      'Emotional intelligence in executive relationships',
      'Strategic scheduling and prioritization',
      'Executive decision support analysis',
      'Professional communication optimization',
      '49 Factors of Unseen Leadership for executive management',
    ],
  },
  {
    id: 'courtney-support-024',
    name: 'Courtney',
    role: 'Customer Support Coordinator',
    department: 'Support & Service',
    avatar: '🎧',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Customer support coordination psychology',
      'Unseen Leadership in support team management',
      'Resistance removal in support escalation',
      'Emotional intelligence in team coordination',
      'Support ticket prioritization analysis',
      'Multi-channel communication optimization',
      'Customer satisfaction tracking techniques',
      '49 Factors of Unseen Leadership for support operations',
    ],
  },
  {
    id: 'foster-025',
    name: 'Foster',
    role: 'Fleet Optimization Specialist',
    department: 'Operations',
    avatar: '🚚',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Route optimization algorithms',
      'Fleet utilization analytics',
      'Driver performance analysis',
      'Fuel efficiency optimization',
      'Load matching automation',
      'Delivery time prediction',
      'Maintenance scheduling optimization',
      'Real-time fleet tracking systems',
    ],
  },
  {
    id: 'ray-m-allen-026',
    name: 'Ray M. Allen',
    role: 'Risk Management Analyst',
    department: 'Financial',
    avatar: '⚡',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Credit risk assessment automation',
      'Insurance claim analysis',
      'Market volatility prediction',
      'Fraud detection algorithms',
      'Financial exposure monitoring',
      'Regulatory compliance tracking',
      'Predictive risk modeling',
      'Real-time risk alerts',
    ],
  },
  {
    id: 'dante-davis-027',
    name: 'Dante Davis',
    role: 'Data Analytics Specialist',
    department: 'Technology',
    avatar: '📊',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    learningAbilities: [
      'Advanced data visualization',
      'Machine learning model development',
      'Business intelligence reporting',
      'Predictive analytics algorithms',
      'Data mining automation',
      'Statistical analysis optimization',
      'Real-time dashboard creation',
      'Performance metrics tracking',
    ],
  },
  {
    id: 'freight-specialist-028',
    name: 'Marcus Chen',
    role: 'International Freight & Customs Specialist',
    department: 'Logistics & International Trade',
    avatar: '🚢',
    status: 'active',
    currentTask: 'Ready for assignment',
    tasksCompleted: 0,
    revenue: 0,
    efficiency: 0,
    expertise: 'China-USA DDP Service Management',
    learningAbilities: [
      'International freight forwarding operations',
      'Customs clearance automation',
      'HTS code classification and tariff analysis',
      'DDP (Delivered Duty Paid) service coordination',
      'Big 5 data collection automation',
      'China pickup and USA delivery coordination',
      'Container type optimization (40HQ/40ft/20ft)',
      'Steel/Metal/Aluminum import specialization',
      '95% tariff product expertise',
      'Multi-modal logistics planning',
      'Automated quote generation for DDP services',
      'Payment terms management (prepay/net30/net60)',
      'Real-time shipment tracking',
      'Customer communication in Chinese and English',
      'Import compliance and documentation',
    ],
    marketingMastery: {
      primaryStrategies: [
        'ddp-service',
        'high-tariff-solutions',
        'customer-automation',
      ],
      expertiseLevel: 'Expert',
      coreCompetencies: [
        'China-USA Trade Lane Optimization',
        'Automated Big 5 Data Collection',
        'High-Tariff Product Import Solutions',
        'DDP Service Value Communication',
      ],
      aiApplications: [
        'Automated customer data collection workflows',
        'Real-time quote generation algorithms',
        'Payment reminder automation',
        'Shipment status monitoring and alerts',
        'HTS code validation and tariff calculation',
      ],
      successPatterns: [
        'Complete Big 5 collection within 48 hours',
        'Generate accurate DDP quotes in under 2 hours',
        '100% payment collection for prepay customers',
        'Maintain 95%+ on-time delivery rate',
      ],
      improvementAreas: [
        'Multi-language communication enhancement',
        'Predictive delivery time optimization',
        'Advanced customs clearance automation',
      ],
    },
  },
];

export default function DEPOINTEDashboard() {
  // Client-side hydration protection
  const [isMounted, setIsMounted] = useState(false);
  
  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false);
  const [isHealthcareTaskOpen, setIsHealthcareTaskOpen] = useState(false);
  const [isShipperTaskOpen, setIsShipperTaskOpen] = useState(false);
  const [isDesperateProspectsTaskOpen, setIsDesperateProspectsTaskOpen] =
    useState(false);
  const [tasks, setTasks] = useState([]);
  const [healthcareTasks, setHealthcareTasks] = useState<HealthcareTask[]>([]);
  const [shipperTasks, setShipperTasks] = useState<ShipperTask[]>([]);
  const [desperateProspectsTasks, setDesperateProspectsTasks] = useState<
    DesperateProspectsTask[]
  >([]);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedMainView, setSelectedMainView] = useState<
    | 'overview'
    | 'crm'
    | 'leads'
    | 'salesflow'
    | 'analytics'
    | 'campaigns'
    | 'scheduler'
    | 'powerups'
    | 'brain'
    | 'sales-copilot'
    | 'call-center'
    | 'email-signatures'
    | 'china-usa-ddp'
    | 'nemt-operations'
  >('overview');
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const [followUpTasks, setFollowUpTasks] = useState<any[]>([]);
  const [liveActivities, setLiveActivities] = useState<any[]>([]);
  const [staffData, setStaffData] = useState(depointeStaff);
  const [campaignView, setCampaignView] = useState<
    'templates' | 'nemt-healthcare'
  >('templates');
  const [expandedHealthcareCampaign, setExpandedHealthcareCampaign] =
    useState(false);
  const [expandedShipperCampaign, setExpandedShipperCampaign] = useState(false);
  const [
    expandedDesperateProspectsCampaign,
    setExpandedDesperateProspectsCampaign,
  ] = useState(false);
  const [isStaffDirectoryCollapsed, setIsStaffDirectoryCollapsed] =
    useState(true);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([
    'FREIGHT_OPERATIONS',
    'BUSINESS_DEVELOPMENT',
  ]); // Start with key departments expanded
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStaffMember, setSelectedStaffMember] = useState<string | null>(
    null
  );
  const [staffDetailsView, setStaffDetailsView] = useState<
    'overview' | 'tasks' | 'crm' | 'performance'
  >('overview');

  // Mount protection to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug staff directory state changes
  useEffect(() => {
    console.log(
      'Staff directory collapsed state changed:',
      isStaffDirectoryCollapsed
    );
  }, [isStaffDirectoryCollapsed]);

  // Load saved healthcare tasks and activity feed on page load
  useEffect(() => {
    if (!isMounted) return;
    
    // Load healthcare tasks from localStorage
    const savedHealthcareTasks = localStorage.getItem(
      'depointe-healthcare-tasks'
    );
    if (savedHealthcareTasks) {
      try {
        const tasks = JSON.parse(savedHealthcareTasks);
        setHealthcareTasks(tasks);

        // Update staff status based on saved tasks
        setStaffData((prevStaff) => {
          const updatedStaff = [...prevStaff];

          tasks.forEach((task: HealthcareTask) => {
            task.assignedTo.forEach((staffId: string) => {
              const staffIndex = updatedStaff.findIndex(
                (staff) => staff.id === staffId
              );
              if (staffIndex !== -1) {
                updatedStaff[staffIndex] = {
                  ...updatedStaff[staffIndex],
                  status: 'busy',
                  currentTask: `🏥 ${task.title}`,
                  tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
                  revenue:
                    updatedStaff[staffIndex].revenue +
                    (task.priority === 'CRITICAL'
                      ? 125000
                      : task.priority === 'HIGH'
                        ? 75000
                        : task.priority === 'MEDIUM'
                          ? 45000
                          : 25000),
                  efficiency: Math.min(
                    95,
                    updatedStaff[staffIndex].efficiency + 15
                  ),
                };
              }
            });
          });

          return updatedStaff;
        });
      } catch (error) {
        console.error('Error loading healthcare tasks:', error);
      }
    }

    // Load shipper tasks from localStorage
    const savedShipperTasks = localStorage.getItem('depointe-shipper-tasks');
    if (savedShipperTasks) {
      try {
        const tasks = JSON.parse(savedShipperTasks);
        setShipperTasks(tasks);

        // Update staff status based on saved shipper tasks
        setStaffData((prevStaff) => {
          const updatedStaff = [...prevStaff];

          tasks.forEach((task: ShipperTask) => {
            task.assignedTo.forEach((staffId: string) => {
              const staffIndex = updatedStaff.findIndex(
                (staff) => staff.id === staffId
              );
              if (staffIndex !== -1) {
                updatedStaff[staffIndex] = {
                  ...updatedStaff[staffIndex],
                  status: 'busy',
                  currentTask: `🚛 ${task.title}`,
                  tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
                  revenue:
                    updatedStaff[staffIndex].revenue +
                    (task.priority === 'CRITICAL'
                      ? 200000
                      : task.priority === 'HIGH'
                        ? 150000
                        : task.priority === 'MEDIUM'
                          ? 100000
                          : 75000),
                  efficiency: Math.min(
                    95,
                    updatedStaff[staffIndex].efficiency + 12
                  ),
                };
              }
            });
          });

          return updatedStaff;
        });
      } catch (error) {
        console.error('Error loading shipper tasks:', error);
      }
    }

    // Load desperate prospects tasks from localStorage
    const savedDesperateProspectsTasks = localStorage.getItem(
      'depointe-desperate-prospects-tasks'
    );
    if (savedDesperateProspectsTasks) {
      try {
        const tasks = JSON.parse(savedDesperateProspectsTasks);
        setDesperateProspectsTasks(tasks);

        // Update staff status based on saved desperate prospects tasks
        setStaffData((prevStaff) => {
          const updatedStaff = [...prevStaff];

          tasks.forEach((task: DesperateProspectsTask) => {
            task.assignedTo.forEach((staffId: string) => {
              const staffIndex = updatedStaff.findIndex(
                (staff) => staff.id === staffId
              );
              if (staffIndex !== -1) {
                updatedStaff[staffIndex] = {
                  ...updatedStaff[staffIndex],
                  status: 'busy',
                  currentTask: `🚨 ${task.title}`,
                  tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
                  revenue:
                    updatedStaff[staffIndex].revenue +
                    (task.priority === 'CRITICAL'
                      ? 300000
                      : task.priority === 'HIGH'
                        ? 200000
                        : task.priority === 'MEDIUM'
                          ? 150000
                          : 100000),
                  efficiency: Math.min(
                    95,
                    updatedStaff[staffIndex].efficiency + 20
                  ),
                };
              }
            });
          });

          return updatedStaff;
        });
      } catch (error) {
        console.error('Error loading desperate prospects tasks:', error);
      }
    }

    // Load activity feed from localStorage
    const savedActivityFeed = localStorage.getItem('depointe-activity-feed');
    if (savedActivityFeed) {
      try {
        const activities = JSON.parse(savedActivityFeed);
        setLiveActivities(activities);
      } catch (error) {
        console.error('Error loading activity feed:', error);
      }
    }

    // Load CRM leads from localStorage
    const savedCrmLeads = localStorage.getItem('depointe-crm-leads');
    if (savedCrmLeads) {
      try {
        const leads = JSON.parse(savedCrmLeads);
        setCrmLeads(leads);
      } catch (error) {
        console.error('Error loading CRM leads:', error);
      }
    }

    // Load follow-up tasks from localStorage
    const savedFollowUpTasks = localStorage.getItem('depointe-followup-tasks');
    if (savedFollowUpTasks) {
      try {
        const tasks = JSON.parse(savedFollowUpTasks);
        setFollowUpTasks(tasks);
      } catch (error) {
        console.error('Error loading follow-up tasks:', error);
      }
    }
  }, [isMounted]);

  // Department structure and organization
  const departments = {
    FINANCIAL: {
      name: '💰 Financial',
      color: '#f59e0b',
      staff: staffData.filter((staff) => staff.department === 'Financial'),
    },
    TECHNOLOGY: {
      name: '💻 Technology',
      color: '#3b82f6',
      staff: staffData.filter((staff) => staff.department === 'Technology'),
    },
    FREIGHT_OPERATIONS: {
      name: '🚛 Freight Operations',
      color: '#10b981',
      staff: staffData.filter((staff) =>
        [
          'Logistics Coordination Specialist',
          'Dispatch Coordination Specialist',
          'Freight Brokerage Specialist',
          'Sales Operations Specialist',
          'Recruiting & Onboarding Specialist',
        ].includes(staff.role)
      ),
    },
    RELATIONSHIPS: {
      name: '🤝 Relationships',
      color: '#8b5cf6',
      staff: staffData.filter((staff) =>
        [
          'Brokerage Operations Specialist',
          'Carrier Relations Specialist',
        ].includes(staff.role)
      ),
    },
    COMPLIANCE_SAFETY: {
      name: '⚖️ Compliance & Safety',
      color: '#ef4444',
      staff: staffData.filter(
        (staff) => staff.department === 'Compliance & Safety'
      ),
    },
    SUPPORT_SERVICE: {
      name: '🛡️ Support & Service',
      color: '#06b6d4',
      staff: staffData.filter(
        (staff) => staff.department === 'Support & Service'
      ),
    },
    BUSINESS_DEVELOPMENT: {
      name: '📈 Business Development',
      color: '#ec4899',
      staff: staffData.filter(
        (staff) => staff.department === 'Business Development'
      ),
    },
    OPERATIONS: {
      name: '📊 Operations',
      color: '#f97316',
      staff: staffData.filter((staff) => staff.department === 'Operations'),
    },
  };

  // Helper functions
  const toggleDepartment = (deptKey: string) => {
    setExpandedDepartments((prev) =>
      prev.includes(deptKey)
        ? prev.filter((d) => d !== deptKey)
        : [...prev, deptKey]
    );
  };

  const getFilteredDepartments = () => {
    if (selectedDepartment === 'all') return departments;
    return Object.fromEntries(
      Object.entries(departments).filter(([key]) => key === selectedDepartment)
    );
  };

  // Calculate metrics
  const totalRevenue = staffData.reduce((sum, staff) => sum + staff.revenue, 0);
  const totalTasks = staffData.reduce(
    (sum, staff) => sum + staff.tasksCompleted,
    0
  );
  const averageEfficiency =
    staffData.reduce((sum, staff) => sum + staff.efficiency, 0) /
    staffData.length;
  const activeStaff = staffData.filter(
    (staff) => staff.status !== 'offline'
  ).length;

  // Available staff for task assignment
  const availableStaff = staffData.map((staff) => ({
    id: staff.id,
    name: staff.name,
    role: staff.role,
    department: staff.department,
  }));

  // Handle task creation
  const handleTaskCreate = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setIsTaskCreationOpen(false);
  };

  // Create CRM lead from campaign results
  const createCRMLead = (campaignData: {
    company: string;
    contactName: string;
    contactEmail?: string;
    contactPhone?: string;
    source: 'healthcare' | 'shipper' | 'desperate-prospects';
    campaignId?: string;
    estimatedValue: number;
    assignedTo: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    notes?: string;
  }) => {
    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      company: campaignData.company,
      contactName: campaignData.contactName,
      contactEmail: campaignData.contactEmail || '',
      contactPhone: campaignData.contactPhone || '',
      source: campaignData.source,
      campaignId: campaignData.campaignId,
      status: 'new',
      priority: campaignData.priority,
      estimatedValue: campaignData.estimatedValue,
      assignedTo: campaignData.assignedTo,
      lastContact: new Date(),
      nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      notes: campaignData.notes ? [campaignData.notes] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedLeads = [...crmLeads, newLead];
    setCrmLeads(updatedLeads);
    localStorage.setItem('depointe-crm-leads', JSON.stringify(updatedLeads));

    // Create automatic follow-up task
    const followUpTask = {
      id: `followup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      leadId: newLead.id,
      title: `Follow up with ${campaignData.company}`,
      description: `Initial contact from ${campaignData.source} campaign`,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: campaignData.priority,
      assignedTo: campaignData.assignedTo,
      status: 'pending',
      type: 'call',
      createdAt: new Date(),
    };

    const updatedTasks = [...followUpTasks, followUpTask];
    setFollowUpTasks(updatedTasks);
    localStorage.setItem(
      'depointe-followup-tasks',
      JSON.stringify(updatedTasks)
    );

    return newLead;
  };

  // Handle healthcare batch deployment
  const handleHealthcareBatchDeploy = (
    healthcareTasksData: HealthcareTask[]
  ) => {
    console.info('🚀 HEALTHCARE BATCH DEPLOYMENT:', healthcareTasksData);

    // Update healthcare tasks state
    setHealthcareTasks(healthcareTasksData);

    // Save to localStorage for persistence
    localStorage.setItem(
      'depointe-healthcare-tasks',
      JSON.stringify(healthcareTasksData)
    );

    // Update staff members with their assigned tasks
    setStaffData((prevStaff) => {
      const updatedStaff = [...prevStaff];

      healthcareTasksData.forEach((task) => {
        task.assignedTo.forEach((staffId) => {
          const staffIndex = updatedStaff.findIndex(
            (staff) => staff.id === staffId
          );
          if (staffIndex !== -1) {
            // Update staff member's current task and status
            updatedStaff[staffIndex] = {
              ...updatedStaff[staffIndex],
              status: 'busy',
              currentTask: `🏥 ${task.title}`,
              tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
              // Add estimated revenue based on task priority
              revenue:
                updatedStaff[staffIndex].revenue +
                (task.priority === 'CRITICAL'
                  ? 125000
                  : task.priority === 'HIGH'
                    ? 75000
                    : task.priority === 'MEDIUM'
                      ? 45000
                      : 25000),
              efficiency: Math.min(
                95,
                updatedStaff[staffIndex].efficiency + 15
              ),
            };
          }
        });
      });

      return updatedStaff;
    });

    // Create activity entries
    const newActivities = [
      {
        id: `batch-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'healthcare_deployment' as const,
        staffId: 'system',
        staffName: 'DEPOINTE AI',
        action: `🚀 HEALTHCARE DEPLOYMENT: ${healthcareTasksData.length} tasks deployed to ${[...new Set(healthcareTasksData.flatMap((t) => t.assignedTo))].length} AI specialists`,
        details: `Healthcare logistics expansion launched with $1,250K+ revenue target`,
        priority: 'critical' as const,
      },
      ...healthcareTasksData.map((task) => ({
        id: `activity-${task.id}`,
        timestamp: new Date().toISOString(),
        type: 'healthcare_deployment' as const,
        staffId: task.assignedTo[0], // Primary assignee
        staffName:
          staffData.find((s) => s.id === task.assignedTo[0])?.name ||
          'AI Staff',
        action: `Healthcare task deployed: ${task.title}`,
        details: `Priority: ${task.priority} | Timeline: ${task.timeline} | Revenue Target: ${task.revenueTarget || 'TBD'}`,
        priority: task.priority.toLowerCase() as
          | 'low'
          | 'medium'
          | 'high'
          | 'critical',
      })),
    ];

    // Add to activity feed
    setLiveActivities((prev) => [...newActivities, ...prev].slice(0, 50));

    // Save activity feed to localStorage
    localStorage.setItem(
      'depointe-activity-feed',
      JSON.stringify([...newActivities, ...liveActivities].slice(0, 50))
    );

    setIsHealthcareTaskOpen(false);

    // Show success notification
    console.info(
      '✅ Healthcare tasks deployed successfully to DEPOINTE AI team!'
    );
  };

  // Handle shipper batch deployment
  const handleShipperBatchDeploy = (shipperTasksData: ShipperTask[]) => {
    console.info('🚀 SHIPPER EXPANSION DEPLOYMENT:', shipperTasksData);

    // Update shipper tasks state
    setShipperTasks(shipperTasksData);

    // Save to localStorage for persistence
    localStorage.setItem(
      'depointe-shipper-tasks',
      JSON.stringify(shipperTasksData)
    );

    // Update staff members with their assigned tasks
    setStaffData((prevStaff) => {
      const updatedStaff = [...prevStaff];

      shipperTasksData.forEach((task) => {
        task.assignedTo.forEach((staffId) => {
          const staffIndex = updatedStaff.findIndex(
            (staff) => staff.id === staffId
          );
          if (staffIndex !== -1) {
            // Update staff member's current task and status
            updatedStaff[staffIndex] = {
              ...updatedStaff[staffIndex],
              status: 'busy',
              currentTask: `🚛 ${task.title}`,
              tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
              // Add estimated revenue based on task priority
              revenue:
                updatedStaff[staffIndex].revenue +
                (task.priority === 'CRITICAL'
                  ? 200000
                  : task.priority === 'HIGH'
                    ? 150000
                    : task.priority === 'MEDIUM'
                      ? 100000
                      : 75000),
              efficiency: Math.min(
                95,
                updatedStaff[staffIndex].efficiency + 12
              ),
            };
          }
        });
      });

      return updatedStaff;
    });

    // Create activity entries
    const newActivities = [
      {
        id: `shipper-batch-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'shipper_deployment' as const,
        staffId: 'system',
        staffName: 'DEPOINTE AI',
        message: `🚛 Shipper Expansion Campaign deployed with ${shipperTasksData.length} tasks`,
        details: `Assigned to ${
          [...new Set(shipperTasksData.flatMap((task) => task.assignedTo))]
            .length
        } AI staff members`,
        priority: 'HIGH',
        category: 'deployment',
      },
      ...shipperTasksData.map((task, index) => ({
        id: `shipper-task-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
        type: 'task_assignment' as const,
        staffId: task.assignedTo[0] || 'unknown',
        staffName:
          staffData.find((s) => s.id === task.assignedTo[0])?.name ||
          'AI Staff',
        message: `📋 ${task.title} assigned`,
        details: `Priority: ${task.priority} | Target: ${task.revenueTarget} | Timeline: ${task.timeline}`,
        priority: task.priority,
        category: 'shipper_expansion',
      })),
    ];

    // Update activities and save to localStorage
    setLiveActivities((prevActivities) => [
      ...newActivities,
      ...prevActivities,
    ]);
    localStorage.setItem(
      'depointe-activity-feed',
      JSON.stringify([...newActivities, ...liveActivities].slice(0, 50))
    );

    setIsShipperTaskOpen(false);

    // Show success notification
    console.info(
      '✅ Shipper expansion tasks deployed successfully to DEPOINTE AI team!'
    );
  };

  // Handle desperate prospects batch deployment
  const handleDesperateProspectsBatchDeploy = (
    desperateProspectsTasksData: DesperateProspectsTask[]
  ) => {
    console.info(
      '🚨 DESPERATE PROSPECTS DEPLOYMENT:',
      desperateProspectsTasksData
    );

    // Update desperate prospects tasks state
    setDesperateProspectsTasks(desperateProspectsTasksData);

    // Save to localStorage for persistence
    localStorage.setItem(
      'depointe-desperate-prospects-tasks',
      JSON.stringify(desperateProspectsTasksData)
    );

    // Update staff members with their assigned tasks
    setStaffData((prevStaff) => {
      const updatedStaff = [...prevStaff];

      desperateProspectsTasksData.forEach((task) => {
        task.assignedTo.forEach((staffId) => {
          const staffIndex = updatedStaff.findIndex(
            (staff) => staff.id === staffId
          );
          if (staffIndex !== -1) {
            // Update staff member's current task and status
            updatedStaff[staffIndex] = {
              ...updatedStaff[staffIndex],
              status: 'busy',
              currentTask: `🚨 ${task.title}`,
              tasksCompleted: updatedStaff[staffIndex].tasksCompleted + 1,
              // Add estimated revenue based on task priority (higher for desperate prospects)
              revenue:
                updatedStaff[staffIndex].revenue +
                (task.priority === 'CRITICAL'
                  ? 300000
                  : task.priority === 'HIGH'
                    ? 200000
                    : task.priority === 'MEDIUM'
                      ? 150000
                      : 100000),
              efficiency: Math.min(
                95,
                updatedStaff[staffIndex].efficiency + 20
              ),
            };
          }
        });
      });

      return updatedStaff;
    });

    // Create activity entries
    const newActivities = [
      {
        id: `desperate-batch-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'desperate_prospects_deployment' as const,
        staffId: 'system',
        staffName: 'DEPOINTE AI',
        message: `🚨 Desperate Prospects Campaign deployed with ${desperateProspectsTasksData.length} crisis response tasks`,
        details: `Assigned to ${
          [
            ...new Set(
              desperateProspectsTasksData.flatMap((task) => task.assignedTo)
            ),
          ].length
        } AI staff members for rapid conversion`,
        priority: 'CRITICAL',
        category: 'deployment',
      },
      ...desperateProspectsTasksData.map((task, index) => ({
        id: `desperate-task-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
        type: 'task_assignment' as const,
        staffId: task.assignedTo[0] || 'unknown',
        staffName:
          staffData.find((s) => s.id === task.assignedTo[0])?.name ||
          'AI Staff',
        message: `📋 ${task.title} assigned`,
        details: `Priority: ${task.priority} | Target: ${task.revenueTarget} | Timeline: ${task.timeline}`,
        priority: task.priority,
        category: 'desperate_prospects',
      })),
    ];

    // Update activities and save to localStorage
    setLiveActivities((prevActivities) => [
      ...newActivities,
      ...prevActivities,
    ]);
    localStorage.setItem(
      'depointe-activity-feed',
      JSON.stringify([...newActivities, ...liveActivities].slice(0, 50))
    );

    setIsDesperateProspectsTaskOpen(false);

    // Show success notification
    console.info(
      '🚨 Desperate prospects crisis response deployed successfully to DEPOINTE AI team!'
    );
  };

  // Get detailed staff member data for CRM
  const getStaffDetails = (staffId: string) => {
    const staff = staffData.find((s) => s.id === staffId);
    if (!staff) return null;

    return {
      ...staff,
      taskHistory: [],
      crmActivities: [],
      currentProspects: [],
      performance: {
        thisWeek: {
          callsMade: 0,
          emailsSent: 0,
          leadsGenerated: 0,
          dealsCompleted: 0,
          revenue: '$0',
        },
        thisMonth: {
          callsMade: 0,
          emailsSent: 0,
          leadsGenerated: 0,
          dealsCompleted: 0,
          revenue: '$0',
        },
      },
    };
  };

  // Performance Metrics component
  const PerformanceMetrics = ({
    title,
    metrics,
    color,
  }: {
    title: string;
    metrics: { label: string; value: string }[];
    color: string;
  }) => (
    <div
      className='financial-card'
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h4
        className='financial-header'
        style={{
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: '700',
          marginBottom: '16px',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {title}
      </h4>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className='performance-metric'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom:
              index < metrics.length - 1
                ? '1px solid rgba(148, 163, 184, 0.1)'
                : 'none',
          }}
        >
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
            }}
          >
            {metric.label}
          </span>
          <span
            style={{
              color: color,
              fontWeight: '700',
              fontSize: '1rem',
              textShadow: `0 2px 8px ${color}40`,
            }}
          >
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        }}
      >
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎯</div>
          <div>Loading DEPOINTE Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '20px',
        paddingTop: '90px',
        color: 'white',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, ""Segue UI"", Roboto, sans-serif',
      }}
    >
      {/* Internal Adaptive Learning - No UI, just automatic learning */}
      <InternalAdaptiveLearning />
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div>
            <h1
              style={{
                color: 'white',
                fontSize: '2rem',
                fontWeight: '800',
                margin: '0',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DEPOINTE AI Company Dashboard
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0',
                fontSize: '0.9rem',
              }}
            >
              🚛 Freight Brokerage & Transportation | DEPOINTE/ Freight 1st
              Direct
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {shipperTasks.length === 0 && (
              <button
                onClick={() => setIsShipperTaskOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '18px' }}>🚛</span>
                Shipper Expansion
              </button>
            )}
            {desperateProspectsTasks.length === 0 && (
              <button
                onClick={() => setIsDesperateProspectsTaskOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '18px' }}>🚨</span>
                Desperate Prospects
              </button>
            )}
            <button
              onClick={() => setIsTaskCreationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 20px -4px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>➕</span>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '20px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          paddingBottom: '15px',
          marginBottom: '30px',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {[
          { key: 'overview', label: '📊 Dashboard Overview', icon: '📊' },
          { key: 'crm', label: '📞 CRM & Leads', icon: '📞' },
          { key: 'leads', label: '🎯 Lead Generation', icon: '🎯' },
          { key: 'analytics', label: '📈 Analytics', icon: '📈' },
          { key: 'campaigns', label: '🚀 Campaign Center', icon: '🚀' },
          { key: 'nemt-operations', label: '🏥 NEMT Operations', icon: '🏥' },
          { key: 'scheduler', label: '📅 AI Staff Scheduler', icon: '📅' },
          { key: 'email-signatures', label: '📧 Email Signatures', icon: '📧' },
          { key: 'powerups', label: '⚡ Power-Ups', icon: '⚡' },
          { key: 'brain', label: '🧠 Freight Brain AI', icon: '🧠' },
          { key: 'sales-copilot', label: '🤖 Sales Copilot AI', icon: '🤖' },
          { key: 'call-center', label: '📞 AI Call Center', icon: '📞' },
          {
            key: 'china-usa-ddp',
            label: '🚢 China-USA DDP Service',
            icon: '🚢',
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedMainView(tab.key as any)}
            style={{
              background:
                selectedMainView === tab.key
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'transparent',
              border:
                selectedMainView === tab.key
                  ? '2px solid #8b5cf6'
                  : '1px solid rgba(148, 163, 184, 0.2)',
              color:
                selectedMainView === tab.key
                  ? '#8b5cf6'
                  : 'rgba(255, 255, 255, 0.7)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (selectedMainView !== tab.key) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMainView !== tab.key) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT VIEWS */}
      {selectedMainView === 'overview' && (
        <div>
          {/* Move all existing dashboard content here */}

          {/* AI Staff Directory Reference */}
          <div style={{ marginBottom: '30px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  padding: '8px',
                  transition: 'background-color 0.2s ease',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(
                    'Staff directory toggle clicked, current state:',
                    isStaffDirectoryCollapsed
                  );
                  setIsStaffDirectoryCollapsed(!isStaffDirectoryCollapsed);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  👥 AI Staff Directory & Duties Reference
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    24 Staff Members
                  </span>
                </h2>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      color: 'white',
                      lineHeight: '1',
                      transition: 'transform 0.3s ease',
                      transform: isStaffDirectoryCollapsed
                        ? 'rotate(0deg)'
                        : 'rotate(180deg)',
                      display: 'inline-block',
                    }}
                    title={
                      isStaffDirectoryCollapsed
                        ? 'Click to expand'
                        : 'Click to collapse'
                    }
                  >
                    ⌄
                  </span>
                </div>
              </div>

              {/* Collapsible Content */}
              {!isStaffDirectoryCollapsed && (
                <div
                  style={{
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-out',
                  }}
                >
                  {/* Department Sections */}
                  <div style={{ display: 'grid', gap: '24px' }}>
                    {/* Business Development */}
                    <div>
                      <h3
                        style={{
                          color: '#fbbf24',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🎯 Business Development (6 Staff)
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#fbbf24',
                              marginBottom: '4px',
                            }}
                          >
                            Desiree - Desperate Prospects Specialist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            High-pressure prospect engagement, resistance
                            removal, psychology-based sales
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#fbbf24',
                              marginBottom: '4px',
                            }}
                          >
                            Cliff - Desperate Prospects Hunter
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Cold prospect outreach, relationship building,
                            motivation psychology
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#fbbf24',
                              marginBottom: '4px',
                            }}
                          >
                            Gary - Lead Generation Specialist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Lead qualification, emotional intelligence, prospect
                            scoring
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#fbbf24',
                              marginBottom: '4px',
                            }}
                          >
                            Drew - Marketing Specialist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Psychology-driven campaigns, persuasion techniques,
                            brand relationships
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#fbbf24',
                              marginBottom: '4px',
                            }}
                          >
                            Lea. D - Lead Nurturing Specialist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Long-term relationship development, conversion
                            optimization, follow-up sequences
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Freight Operations */}
                    <div>
                      <h3
                        style={{
                          color: '#10b981',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🚛 Freight Operations (5 Staff)
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#10b981',
                              marginBottom: '4px',
                            }}
                          >
                            Will - Sales Operations Specialist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Sales process optimization, team psychology,
                            operational efficiency
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#10b981',
                              marginBottom: '4px',
                            }}
                          >
                            Hunter - Recruiting & Onboarding
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            HR processes, candidate engagement, team building
                            psychology
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#10b981',
                              marginBottom: '4px',
                            }}
                          >
                            Logan - Logistics Coordination
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Supply chain optimization, stakeholder coordination,
                            process psychology
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#10b981',
                              marginBottom: '4px',
                            }}
                          >
                            Miles - Dispatch Coordination
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Real-time dispatch, crisis management, high-pressure
                            communication
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#10b981',
                              marginBottom: '4px',
                            }}
                          >
                            Dee - Freight Brokerage Specialist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Carrier negotiations, brokerage deals, relationship
                            building
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Relationships */}
                    <div>
                      <h3
                        style={{
                          color: '#8b5cf6',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🤝 Relationships (4 Staff)
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#8b5cf6',
                              marginBottom: '4px',
                            }}
                          >
                            Brook R. - Brokerage Operations
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Partnership management, network building,
                            negotiation psychology
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#8b5cf6',
                              marginBottom: '4px',
                            }}
                          >
                            Carrie R. - Carrier Relations
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            B2B relationships, vendor management, long-term
                            partnerships
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#8b5cf6',
                              marginBottom: '4px',
                            }}
                          >
                            Roland - Carrier Relations Director
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Executive-level strategy, strategic partnerships,
                            high-level negotiations
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Support & Service */}
                    <div>
                      <h3
                        style={{
                          color: '#f59e0b',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🛠️ Support & Service (4 Staff)
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#f59e0b',
                              marginBottom: '4px',
                            }}
                          >
                            Shanell - Customer Service
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Customer care, complaint resolution, service
                            recovery psychology
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#f59e0b',
                              marginBottom: '4px',
                            }}
                          >
                            Clarence - Claims & Insurance
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Insurance claims processing, dispute resolution,
                            risk assessment
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#f59e0b',
                              marginBottom: '4px',
                            }}
                          >
                            Charin - AI Receptionist
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            First impressions, client welcoming, call routing
                            optimization
                          </div>
                        </div>
                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#f59e0b',
                              marginBottom: '4px',
                            }}
                          >
                            Courtney - Customer Support Coordinator
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Support team management, escalation handling,
                            coordination
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Other Departments */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {/* Compliance & Safety */}
                      <div>
                        <h3
                          style={{
                            color: '#ef4444',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          ⚖️ Compliance & Safety (2 Staff)
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          <div
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '8px',
                              padding: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: '#ef4444',
                                marginBottom: '4px',
                              }}
                            >
                              Kameelah - DOT Compliance
                            </div>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              Safety training, regulatory enforcement, behavior
                              change psychology
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '8px',
                              padding: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: '#ef4444',
                                marginBottom: '4px',
                              }}
                            >
                              Regina - FMCSA Regulations
                            </div>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              Regulatory interpretation, policy enforcement,
                              risk assessment
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financial */}
                      <div>
                        <h3
                          style={{
                            color: '#06b6d4',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          💰 Financial (1 Staff)
                        </h3>
                        <div
                          style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#06b6d4',
                              marginBottom: '4px',
                            }}
                          >
                            Resse A. Bell - Accounting
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Financial management, budget psychology,
                            cost-benefit analysis
                          </div>
                        </div>
                      </div>

                      {/* Technology */}
                      <div>
                        <h3
                          style={{
                            color: '#6366f1',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          💻 Technology (1 Staff)
                        </h3>
                        <div
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '8px',
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: '#6366f1',
                              marginBottom: '4px',
                            }}
                          >
                            Dell - IT Support
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Technical support, user training, change management
                            psychology
                          </div>
                        </div>
                      </div>

                      {/* Operations */}
                      <div>
                        <h3
                          style={{
                            color: '#84cc16',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          ⚙️ Operations (3 Staff)
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          <div
                            style={{
                              background: 'rgba(132, 204, 22, 0.1)',
                              border: '1px solid rgba(132, 204, 22, 0.2)',
                              borderRadius: '8px',
                              padding: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: '#84cc16',
                                marginBottom: '4px',
                              }}
                            >
                              C. Allen Durr - Schedule Optimization
                            </div>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              Resource allocation, operational planning,
                              efficiency optimization
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(132, 204, 22, 0.1)',
                              border: '1px solid rgba(132, 204, 22, 0.2)',
                              borderRadius: '8px',
                              padding: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: '#84cc16',
                                marginBottom: '4px',
                              }}
                            >
                              Ana Lyles - Data Analysis
                            </div>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              Behavioral analytics, data-driven insights,
                              analytical decision making
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(132, 204, 22, 0.1)',
                              border: '1px solid rgba(132, 204, 22, 0.2)',
                              borderRadius: '8px',
                              padding: '12px',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: '#84cc16',
                                marginBottom: '4px',
                              }}
                            >
                              Alexis - AI Executive Assistant
                            </div>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
                            >
                              Executive support, strategic scheduling, decision
                              support analysis
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Competencies Summary */}
                  <div
                    style={{
                      marginTop: '24px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#fbbf24',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      🧠 Core Training Framework
                    </h4>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.5',
                      }}
                    >
                      All staff trained in:{' '}
                      <strong>Resistance Removal Sales System</strong> •{' '}
                      <strong>49 Factors of Unseen Leadership</strong> •{' '}
                      <strong>Emotional Intelligence</strong> •{' '}
                      <strong>Psychology-based Decision Making</strong> •{' '}
                      <strong>Script-free Communication</strong> •{' '}
                      <strong>Relationship Building</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Campaign Deployments Section */}
          {(healthcareTasks.length > 0 ||
            shipperTasks.length > 0 ||
            desperateProspectsTasks.length > 0) && (
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🚀 Live Campaign Deployments
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  LIVE
                </div>
              </h3>

              {/* Ultra-Compact Campaign Card */}
              <div
                onClick={() =>
                  setExpandedHealthcareCampaign(!expandedHealthcareCampaign)
                }
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '60px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Left side - Campaign info */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                  >
                    🏥
                  </div>
                  <div>
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '700',
                        margin: 0,
                      }}
                    >
                      Healthcare Logistics Campaign
                    </h4>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.85rem',
                        marginTop: '2px',
                      }}
                    >
                      {healthcareTasks.length} tasks,{' '}
                      {
                        [
                          ...new Set(
                            healthcareTasks.flatMap((task) => task.assignedTo)
                          ),
                        ].length
                      }{' '}
                      staff, $1,250K+ target,{' '}
                      {
                        healthcareTasks.filter(
                          (task) => task.priority === 'CRITICAL'
                        ).length
                      }{' '}
                      critical
                    </div>
                  </div>
                </div>

                {/* Right side - Staff avatars and actions */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                  {/* Staff avatars */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      ...new Set(
                        healthcareTasks.flatMap((task) => task.assignedTo)
                      ),
                    ]
                      .slice(0, 3)
                      .map((staffId) => {
                        const staff = staffData.find((s) => s.id === staffId);
                        return staff ? (
                          <div
                            key={staffId}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background:
                                'linear-gradient(135deg, #22c55e, #16a34a)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              border: '1px solid rgba(34, 197, 94, 0.5)',
                            }}
                            title={staff.name}
                          >
                            {staff.avatar}
                          </div>
                        ) : null;
                      })}
                    {[
                      ...new Set(
                        healthcareTasks.flatMap((task) => task.assignedTo)
                      ),
                    ].length > 3 && (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        +
                        {[
                          ...new Set(
                            healthcareTasks.flatMap((task) => task.assignedTo)
                          ),
                        ].length - 3}
                      </div>
                    )}
                  </div>

                  {/* Clear button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent campaign click
                      setHealthcareTasks([]);
                      setLiveActivities([]);
                      localStorage.removeItem('depointe-healthcare-tasks');
                      localStorage.removeItem('depointe-activity-feed');
                      setStaffData((prevStaff) =>
                        prevStaff.map((staff) => ({
                          ...staff,
                          status: 'available',
                          currentTask: 'Ready for task assignment',
                          revenue: 0,
                          efficiency: 0,
                          tasksCompleted: 0,
                        }))
                      );
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>

                  {/* Expand indicator */}
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '12px',
                      transform: expandedHealthcareCampaign
                        ? 'rotate(90deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    ▶
                  </div>
                </div>
              </div>

              {/* Expanded Healthcare Campaign Details */}
              {expandedHealthcareCampaign && (
                <div
                  style={{
                    marginTop: '15px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    🏥 Healthcare Logistics Campaign Details
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '15px',
                    }}
                  >
                    {healthcareTasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '10px',
                          padding: '15px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '10px',
                          }}
                        >
                          <h5
                            style={{
                              color: 'white',
                              fontSize: '1.1rem',
                              fontWeight: '700',
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
                                  : task.priority === 'HIGH'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : task.priority === 'MEDIUM'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : 'rgba(148, 163, 184, 0.2)',
                              color:
                                task.priority === 'CRITICAL'
                                  ? '#ef4444'
                                  : task.priority === 'HIGH'
                                    ? '#f59e0b'
                                    : task.priority === 'MEDIUM'
                                      ? '#22c55e'
                                      : '#94a3b8',
                              padding: '3px 8px',
                              borderRadius: '6px',
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
                            fontSize: '0.9rem',
                            lineHeight: '1.4',
                            margin: '0 0 12px 0',
                          }}
                        >
                          {task.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '10px',
                          }}
                        >
                          <span
                            style={{
                              color: '#22c55e',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            📅 {task.timeline}
                          </span>
                          <span
                            style={{
                              color: '#22c55e',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            💰 {task.revenueTarget}
                          </span>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              marginBottom: '8px',
                            }}
                          >
                            Assigned Staff:
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '6px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {task.assignedTo.map((staffId) => {
                              const staff = staffData.find(
                                (s) => s.id === staffId
                              );
                              return staff ? (
                                <div
                                  key={staffId}
                                  style={{
                                    background: 'rgba(34, 197, 94, 0.3)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <span>{staff.avatar}</span>
                                  {staff.name}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              marginBottom: '8px',
                            }}
                          >
                            Key Deliverables:
                          </div>
                          {(task.deliverables || [])
                            .slice(0, 3)
                            .map((deliverable, index) => (
                              <div
                                key={index}
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.8rem',
                                  padding: '2px 0',
                                }}
                              >
                                • {deliverable}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Desperate Prospects Campaign Card */}
              {desperateProspectsTasks.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <div
                    onClick={() =>
                      setExpandedDesperateProspectsCampaign(
                        !expandedDesperateProspectsCampaign
                      )
                    }
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: '60px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(239, 68, 68, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Left side - Campaign info */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, #ef4444, #dc2626)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                        }}
                      >
                        🚨
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '700',
                            margin: 0,
                          }}
                        >
                          Desperate Prospects Crisis Response
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.85rem',
                            marginTop: '2px',
                          }}
                        >
                          {desperateProspectsTasks.length} tasks,{' '}
                          {
                            [
                              ...new Set(
                                desperateProspectsTasks.flatMap(
                                  (task) => task.assignedTo
                                )
                              ),
                            ].length
                          }{' '}
                          staff, $1,300K+ target,{' '}
                          {
                            desperateProspectsTasks.filter(
                              (task) => task.priority === 'CRITICAL'
                            ).length
                          }{' '}
                          critical
                        </div>
                      </div>
                    </div>

                    {/* Right side - Staff avatars and actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      {/* Staff avatars */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                          ...new Set(
                            desperateProspectsTasks.flatMap(
                              (task) => task.assignedTo
                            )
                          ),
                        ]
                          .slice(0, 3)
                          .map((staffId) => {
                            const staff = staffData.find(
                              (s) => s.id === staffId
                            );
                            return staff ? (
                              <div
                                key={staffId}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background:
                                    'linear-gradient(135deg, #ef4444, #dc2626)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                  border: '1px solid rgba(239, 68, 68, 0.5)',
                                }}
                                title={staff.name}
                              >
                                {staff.avatar}
                              </div>
                            ) : null;
                          })}
                        {[
                          ...new Set(
                            desperateProspectsTasks.flatMap(
                              (task) => task.assignedTo
                            )
                          ),
                        ].length > 3 && (
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            +
                            {[
                              ...new Set(
                                desperateProspectsTasks.flatMap(
                                  (task) => task.assignedTo
                                )
                              ),
                            ].length - 3}
                          </div>
                        )}
                      </div>

                      {/* Clear button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent campaign click
                          setDesperateProspectsTasks([]);
                          setLiveActivities([]);
                          localStorage.removeItem(
                            'depointe-desperate-prospects-tasks'
                          );
                          localStorage.removeItem('depointe-activity-feed');
                          setStaffData((prevStaff) =>
                            prevStaff.map((staff) => ({
                              ...staff,
                              status: 'available',
                              currentTask: 'Ready for task assignment',
                              revenue: 0,
                              efficiency: 0,
                              tasksCompleted: 0,
                            }))
                          );
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Clear
                      </button>

                      {/* Expand indicator */}
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '12px',
                          transform: expandedDesperateProspectsCampaign
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        ▶
                      </div>
                    </div>
                  </div>

                  {/* Expanded Desperate Prospects Campaign Details */}
                  {expandedDesperateProspectsCampaign && (
                    <div
                      style={{
                        marginTop: '15px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '20px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        🚨 Desperate Prospects Crisis Response Details
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(350px, 1fr))',
                          gap: '15px',
                        }}
                      >
                        {desperateProspectsTasks.map((task) => (
                          <div
                            key={task.id}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '10px',
                              padding: '15px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '10px',
                              }}
                            >
                              <h5
                                style={{
                                  color: 'white',
                                  fontSize: '1.1rem',
                                  fontWeight: '700',
                                  margin: 0,
                                }}
                              >
                                {task.title}
                              </h5>
                              <span
                                style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
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
                                fontSize: '0.9rem',
                                lineHeight: '1.4',
                                margin: '0 0 12px 0',
                              }}
                            >
                              {task.description}
                            </p>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '10px',
                              }}
                            >
                              <span
                                style={{
                                  color: '#ef4444',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                }}
                              >
                                ⚡ {task.timeline}
                              </span>
                              <span
                                style={{
                                  color: '#ef4444',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                }}
                              >
                                💰 {task.revenueTarget}
                              </span>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  marginBottom: '8px',
                                }}
                              >
                                Crisis Response Team:
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '6px',
                                  flexWrap: 'wrap',
                                }}
                              >
                                {task.assignedTo.map((staffId) => {
                                  const staff = staffData.find(
                                    (s) => s.id === staffId
                                  );
                                  return staff ? (
                                    <div
                                      key={staffId}
                                      style={{
                                        background: 'rgba(239, 68, 68, 0.3)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <span>{staff.avatar}</span>
                                      {staff.name}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  marginBottom: '8px',
                                }}
                              >
                                Emergency Deliverables:
                              </div>
                              {(task.deliverables || [])
                                .slice(0, 3)
                                .map((deliverable, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.8rem',
                                      padding: '2px 0',
                                    }}
                                  >
                                    • {deliverable}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <style jsx>{`
                @keyframes pulse {
                  0%,
                  100% {
                    opacity: 1;
                  }
                  50% {
                    opacity: 0.5;
                  }
                }
              `}</style>
            </div>
          )}

          {/* Performance Metrics Cards */}
          <div
            className='financial-grid'
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {/* Option 2: Revenue Targets (Projections with Disclaimer) */}
            <div style={{ position: 'relative' }}>
              <PerformanceMetrics
                title='🎯 Revenue Targets'
                metrics={[
                  {
                    label: 'Projected Revenue',
                    value: `$${(totalRevenue / 1000).toFixed(0)}K`,
                  },
                  { label: 'Monthly Goal', value: '$500K+' },
                  {
                    label: 'Target Growth',
                    value: totalRevenue > 0 ? '+15%' : '0%',
                  },
                  {
                    label: 'Avg Target Deal',
                    value:
                      totalTasks > 0
                        ? `$${Math.round(totalRevenue / totalTasks / 1000)}K`
                        : '$0',
                  },
                ]}
                color='#f59e0b'
              />
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}
              >
                Projections
              </div>
            </div>

            {/* Option 3: Real Operational Metrics */}
            <PerformanceMetrics
              title='📊 Real-Time Operations'
              metrics={[
                {
                  label: 'Tasks Completed',
                  value: totalTasks.toLocaleString(),
                },
                {
                  label: 'Staff Utilization',
                  value: `${Math.round((activeStaff / staffData.length) * 100)}%`,
                },
                {
                  label: 'Avg Response Time',
                  value: liveActivities.length > 0 ? '<2 min' : '--',
                },
                {
                  label: 'System Uptime',
                  value: '99.9%',
                },
              ]}
              color='#22c55e'
            />

            {/* Real Efficiency Metrics */}
            <PerformanceMetrics
              title='⚡ Performance Metrics'
              metrics={[
                {
                  label: 'Avg Efficiency',
                  value: `${averageEfficiency.toFixed(1)}%`,
                },
                {
                  label: 'Active Campaigns',
                  value: (
                    (healthcareTasks.length > 0 ? 1 : 0) +
                    (shipperTasks.length > 0 ? 1 : 0) +
                    (desperateProspectsTasks.length > 0 ? 1 : 0)
                  ).toString(),
                },
                {
                  label: 'Tasks in Progress',
                  value: staffData
                    .filter((staff) => staff.status === 'busy')
                    .length.toString(),
                },
                {
                  label: 'Departments Online',
                  value: Object.keys(departments).length.toString(),
                },
              ]}
              color='#3b82f6'
            />
          </div>

          {/* Live Activity Feed */}
          <div
            className='financial-card'
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              marginTop: '30px',
            }}
          >
            <h2
              className='financial-header'
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '20px',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              📡 Live DEPOINTE Activity Feed ({liveActivities.length}{' '}
              activities)
            </h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {liveActivities.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {liveActivities.map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background:
                            activity.priority === 'critical'
                              ? '#ef4444'
                              : activity.priority === 'high'
                                ? '#f59e0b'
                                : activity.priority === 'medium'
                                  ? '#3b82f6'
                                  : '#10b981',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {activity.staffName}: {activity.action}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {activity.details}
                        </div>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.7rem',
                        }}
                      >
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    📡
                  </div>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Waiting for Live Activity
                  </h3>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>
                    Your DEPOINTE AI staff activity will appear here in
                    real-time
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Department Filter Controls */}
          <div
            className='financial-card'
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '15px 20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              marginBottom: '20px',
              marginTop: '30px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px',
              }}
            >
              <h2
                className='financial-header'
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  margin: '0',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                🎯 DEPOINTE AI Departments ({Object.keys(departments).length}{' '}
                Depts, {staffData.length} Staff)
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option
                    value='all'
                    style={{ background: '#1e293b', color: 'white' }}
                  >
                    All Departments
                  </option>
                  {Object.entries(departments).map(([key, dept]) => (
                    <option
                      key={key}
                      value={key}
                      style={{ background: '#1e293b', color: 'white' }}
                    >
                      {dept.name} ({dept.staff.length})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    setExpandedDepartments(Object.keys(departments))
                  }
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Expand All
                </button>

                <button
                  onClick={() => setExpandedDepartments([])}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* Department-Based AI Staff Organization */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {Object.entries(getFilteredDepartments()).map(([deptKey, dept]) => {
              const isExpanded = expandedDepartments.includes(deptKey);
              const deptRevenue = dept.staff.reduce(
                (sum, staff) => sum + staff.revenue,
                0
              );
              const deptTasks = dept.staff.reduce(
                (sum, staff) => sum + staff.tasksCompleted,
                0
              );
              const deptEfficiency =
                dept.staff.length > 0
                  ? dept.staff.reduce(
                      (sum, staff) => sum + staff.efficiency,
                      0
                    ) / dept.staff.length
                  : 0;
              const activeCount = dept.staff.filter(
                (staff) => staff.status === 'active' || staff.status === 'busy'
              ).length;

              return (
                <div
                  key={deptKey}
                  className='financial-card'
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Department Header */}
                  <div
                    onClick={() => toggleDepartment(deptKey)}
                    style={{
                      padding: '20px',
                      background: `linear-gradient(135deg, ${dept.color}20, ${dept.color}10)`,
                      borderBottom: isExpanded
                        ? '1px solid rgba(148, 163, 184, 0.1)'
                        : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                        }}
                      >
                        <h3
                          style={{
                            color: dept.color,
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            margin: '0',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          }}
                        >
                          {dept.name} ({dept.staff.length} Staff)
                        </h3>
                        <div
                          style={{
                            background: `${dept.color}20`,
                            color: dept.color,
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          {activeCount}/{dept.staff.length} Active
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                        }}
                      >
                        {/* Department Summary Stats */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '15px',
                            fontSize: '0.9rem',
                          }}
                        >
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{ color: '#22c55e', fontWeight: '700' }}
                            >
                              ${(deptRevenue / 1000).toFixed(0)}K
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              Revenue
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{ color: '#3b82f6', fontWeight: '700' }}
                            >
                              {deptTasks}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              Tasks
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{ color: '#a855f7', fontWeight: '700' }}
                            >
                              {deptEfficiency.toFixed(1)}%
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.7rem',
                              }}
                            >
                              Efficiency
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            color: 'white',
                            fontSize: '1.2rem',
                            transform: isExpanded
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Staff Grid (Collapsible) */}
                  {isExpanded && (
                    <div style={{ padding: '20px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '16px',
                        }}
                      >
                        {dept.staff.map((staff) => (
                          <div
                            key={staff.id}
                            onClick={() => setSelectedStaffMember(staff.id)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(148, 163, 184, 0.1)',
                              borderRadius: '8px',
                              padding: '16px',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              ':hover': {
                                background: 'rgba(255, 255, 255, 0.08)',
                                transform: 'translateY(-2px)',
                              },
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background =
                                'rgba(255, 255, 255, 0.08)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background =
                                'rgba(255, 255, 255, 0.05)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '12px',
                              }}
                            >
                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  background: `linear-gradient(135deg, ${staff.status === 'busy' ? '#f59e0b' : '#10b981'}, ${staff.status === 'busy' ? '#d97706' : '#059669'})`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '18px',
                                }}
                              >
                                {staff.avatar}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                  }}
                                >
                                  {staff.name}
                                </h4>
                                <p
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    margin: 0,
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  {staff.role}
                                </p>
                              </div>
                              <div
                                style={{
                                  background: `${staff.status === 'busy' ? '#f59e0b20' : '#10b98120'}`,
                                  color:
                                    staff.status === 'busy'
                                      ? '#f59e0b'
                                      : '#10b981',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  fontWeight: '700',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {staff.status}
                              </div>
                            </div>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.8rem',
                                marginBottom: '12px',
                              }}
                            >
                              🎯 {staff.currentTask}
                            </p>

                            {/* Learning Abilities Section */}
                            <div
                              style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '12px',
                              }}
                            >
                              <div
                                style={{
                                  color: '#10b981',
                                  fontSize: '0.7rem',
                                  fontWeight: '700',
                                  marginBottom: '6px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                🧠 Learning Abilities
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '4px',
                                }}
                              >
                                {staff.learningAbilities
                                  ?.slice(0, 3)
                                  .map((ability, index) => (
                                    <span
                                      key={index}
                                      style={{
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        color: '#34d399',
                                        fontSize: '0.65rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {ability}
                                    </span>
                                  ))}
                                {staff.learningAbilities &&
                                  staff.learningAbilities.length > 3 && (
                                    <span
                                      style={{
                                        color: 'rgba(16, 185, 129, 0.6)',
                                        fontSize: '0.65rem',
                                        fontStyle: 'italic',
                                      }}
                                    >
                                      +{staff.learningAbilities.length - 3}{' '}
                                      more...
                                    </span>
                                  )}
                              </div>
                            </div>

                            <div
                              style={{
                                background: 'rgba(139, 92, 246, 0.1)',
                                color: '#8b5cf6',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                marginBottom: '8px',
                              }}
                            >
                              👆 Click to view detailed CRM
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '8px',
                                textAlign: 'center',
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    color: '#ec4899',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {staff.tasksCompleted}
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  Tasks
                                </div>
                              </div>
                              <div>
                                <div
                                  style={{
                                    color: '#f59e0b',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                  }}
                                >
                                  ${staff.revenue.toLocaleString()}
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  Revenue
                                </div>
                              </div>
                              <div>
                                <div
                                  style={{
                                    color: '#a855f7',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {staff.efficiency}%
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  Efficiency
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Staff Member CRM Details Modal */}
          {selectedStaffMember && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(5px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedStaffMember(null);
                  setStaffDetailsView('overview');
                }
              }}
            >
              <div
                style={{
                  width: '90%',
                  maxWidth: '1200px',
                  height: '90%',
                  maxHeight: '800px',
                  background:
                    'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                }}
              >
                {(() => {
                  const staffDetails = getStaffDetails(selectedStaffMember);
                  if (!staffDetails) return null;

                  return (
                    <>
                      {/* Header */}
                      <div
                        style={{
                          padding: '20px 30px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                          }}
                        >
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${staffDetails.status === 'busy' ? '#f59e0b' : '#10b981'}, ${staffDetails.status === 'busy' ? '#d97706' : '#059669'})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px',
                            }}
                          >
                            {staffDetails.avatar}
                          </div>
                          <div>
                            <h2
                              style={{
                                color: 'white',
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: '700',
                              }}
                            >
                              {staffDetails.name}
                            </h2>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                margin: 0,
                                fontSize: '1rem',
                              }}
                            >
                              {staffDetails.role} • {staffDetails.department}
                            </p>
                            <div
                              style={{
                                background: `${staffDetails.status === 'busy' ? '#f59e0b20' : '#10b98120'}`,
                                color:
                                  staffDetails.status === 'busy'
                                    ? '#f59e0b'
                                    : '#10b981',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                display: 'inline-block',
                                marginTop: '5px',
                              }}
                            >
                              {staffDetails.status}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStaffMember(null);
                            setStaffDetailsView('overview');
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            color: 'white',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Tab Navigation */}
                      <div
                        style={{
                          display: 'flex',
                          background: 'rgba(15, 23, 42, 0.5)',
                          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        }}
                      >
                        {[
                          { key: 'overview', label: '📊 Overview' },
                          { key: 'tasks', label: '✅ Tasks & Work' },
                          { key: 'crm', label: '📞 CRM Activities' },
                          { key: 'performance', label: '📈 Performance' },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setStaffDetailsView(tab.key as any)}
                            style={{
                              background:
                                staffDetailsView === tab.key
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : 'transparent',
                              border: 'none',
                              color:
                                staffDetailsView === tab.key
                                  ? '#8b5cf6'
                                  : 'rgba(255, 255, 255, 0.7)',
                              padding: '15px 25px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              borderBottom:
                                staffDetailsView === tab.key
                                  ? '2px solid #8b5cf6'
                                  : '2px solid transparent',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Content Area */}
                      <div
                        style={{
                          flex: 1,
                          padding: '30px',
                          overflowY: 'auto',
                        }}
                      >
                        {/* Overview Tab */}
                        {staffDetailsView === 'overview' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '25px',
                            }}
                          >
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '20px',
                              }}
                            >
                              <div
                                style={{
                                  background: 'rgba(34, 197, 94, 0.1)',
                                  border: '1px solid rgba(34, 197, 94, 0.2)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#22c55e',
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                  }}
                                >
                                  ${staffDetails.revenue.toLocaleString()}
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  Total Revenue Generated
                                </div>
                              </div>
                              <div
                                style={{
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  border: '1px solid rgba(59, 130, 246, 0.2)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#3b82f6',
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                  }}
                                >
                                  {staffDetails.tasksCompleted}
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  Tasks Completed
                                </div>
                              </div>
                              <div
                                style={{
                                  background: 'rgba(168, 85, 247, 0.1)',
                                  border: '1px solid rgba(168, 85, 247, 0.2)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                  textAlign: 'center',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#a855f7',
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                  }}
                                >
                                  {staffDetails.efficiency}%
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  Efficiency Rating
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(148, 163, 184, 0.1)',
                                borderRadius: '12px',
                                padding: '20px',
                              }}
                            >
                              <h3
                                style={{
                                  color: 'white',
                                  fontSize: '1.2rem',
                                  fontWeight: '700',
                                  marginBottom: '15px',
                                }}
                              >
                                🎯 Currently Working On
                              </h3>
                              <p
                                style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '1rem',
                                  lineHeight: '1.6',
                                }}
                              >
                                {staffDetails.currentTask}
                              </p>
                            </div>

                            <div
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(148, 163, 184, 0.1)',
                                borderRadius: '12px',
                                padding: '20px',
                              }}
                            >
                              <h3
                                style={{
                                  color: 'white',
                                  fontSize: '1.2rem',
                                  fontWeight: '700',
                                  marginBottom: '15px',
                                }}
                              >
                                🔥 Hot Prospects
                              </h3>
                              {staffDetails.currentProspects.map(
                                (prospect, index) => (
                                  <div
                                    key={prospect.id}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '12px 0',
                                      borderBottom:
                                        index <
                                        staffDetails.currentProspects.length - 1
                                          ? '1px solid rgba(148, 163, 184, 0.1)'
                                          : 'none',
                                    }}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          color: 'white',
                                          fontSize: '0.95rem',
                                          fontWeight: '600',
                                        }}
                                      >
                                        {prospect.company}
                                      </div>
                                      <div
                                        style={{
                                          color: 'rgba(255, 255, 255, 0.6)',
                                          fontSize: '0.8rem',
                                        }}
                                      >
                                        {prospect.nextAction} • Last contact:{' '}
                                        {prospect.lastContact}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div
                                        style={{
                                          color: '#22c55e',
                                          fontSize: '0.9rem',
                                          fontWeight: '600',
                                        }}
                                      >
                                        {prospect.estimatedValue}
                                      </div>
                                      <div
                                        style={{
                                          background:
                                            prospect.urgencyLevel === 'high'
                                              ? '#ef444420'
                                              : '#f59e0b20',
                                          color:
                                            prospect.urgencyLevel === 'high'
                                              ? '#ef4444'
                                              : '#f59e0b',
                                          padding: '2px 8px',
                                          borderRadius: '6px',
                                          fontSize: '0.7rem',
                                          fontWeight: '600',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        {prospect.urgencyLevel}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tasks & Work Tab */}
                        {staffDetailsView === 'tasks' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '20px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <h3
                                style={{
                                  color: 'white',
                                  fontSize: '1.3rem',
                                  fontWeight: '700',
                                  margin: 0,
                                }}
                              >
                                Task History & Current Work
                              </h3>
                              <button
                                onClick={() => setIsTaskCreationOpen(true)}
                                style={{
                                  background:
                                    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '10px 20px',
                                  color: 'white',
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                              >
                                ➕ Assign New Task
                              </button>
                            </div>

                            {staffDetails.taskHistory.map((task) => (
                              <div
                                key={task.id}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(148, 163, 184, 0.1)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '15px',
                                  }}
                                >
                                  <div>
                                    <h4
                                      style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        margin: 0,
                                      }}
                                    >
                                      {task.title}
                                    </h4>
                                    <p
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.9rem',
                                        margin: '5px 0 0 0',
                                      }}
                                    >
                                      Type: {task.type.replace('-', ' ')} •{' '}
                                      {task.completedAt ||
                                        task.startedAt ||
                                        task.scheduledFor}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      background:
                                        task.status === 'completed'
                                          ? '#22c55e20'
                                          : task.status === 'in-progress'
                                            ? '#f59e0b20'
                                            : '#64748b20',
                                      color:
                                        task.status === 'completed'
                                          ? '#22c55e'
                                          : task.status === 'in-progress'
                                            ? '#f59e0b'
                                            : '#64748b',
                                      padding: '4px 12px',
                                      borderRadius: '12px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {task.status}
                                  </div>
                                </div>

                                {task.status === 'completed' && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <div
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.9rem',
                                        marginBottom: '5px',
                                      }}
                                    >
                                      <strong>Result:</strong> {task.result}
                                    </div>
                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '20px',
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                      }}
                                    >
                                      <span>Time: {task.timeSpent}</span>
                                      <span>Revenue: {task.revenue}</span>
                                    </div>
                                  </div>
                                )}

                                {task.status === 'in-progress' && (
                                  <div style={{ marginBottom: '10px' }}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '8px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: 'rgba(255, 255, 255, 0.7)',
                                          fontSize: '0.9rem',
                                        }}
                                      >
                                        Progress: {task.progress}%
                                      </span>
                                      <span
                                        style={{
                                          color: 'rgba(255, 255, 255, 0.6)',
                                          fontSize: '0.8rem',
                                        }}
                                      >
                                        Expected: {task.expectedCompletion}
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '4px',
                                        height: '8px',
                                        overflow: 'hidden',
                                      }}
                                    >
                                      <div
                                        style={{
                                          background:
                                            'linear-gradient(135deg, #f59e0b, #d97706)',
                                          height: '100%',
                                          width: `${task.progress}%`,
                                          transition: 'width 0.3s ease',
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {task.status === 'pending' && task.priority && (
                                  <div
                                    style={{
                                      background:
                                        task.priority === 'high'
                                          ? '#ef444420'
                                          : '#64748b20',
                                      color:
                                        task.priority === 'high'
                                          ? '#ef4444'
                                          : '#64748b',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      display: 'inline-block',
                                    }}
                                  >
                                    Priority: {task.priority}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CRM Activities Tab */}
                        {staffDetailsView === 'crm' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '20px',
                            }}
                          >
                            <h3
                              style={{
                                color: 'white',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                margin: 0,
                              }}
                            >
                              Recent CRM Activities
                            </h3>

                            {staffDetails.crmActivities.map((activity) => (
                              <div
                                key={activity.id}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(148, 163, 184, 0.1)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    marginBottom: '15px',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      background:
                                        activity.type === 'call'
                                          ? '#22c55e20'
                                          : activity.type === 'email'
                                            ? '#3b82f620'
                                            : '#8b5cf620',
                                      color:
                                        activity.type === 'call'
                                          ? '#22c55e'
                                          : activity.type === 'email'
                                            ? '#3b82f6'
                                            : '#8b5cf6',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '18px',
                                    }}
                                  >
                                    {activity.type === 'call'
                                      ? '📞'
                                      : activity.type === 'email'
                                        ? '📧'
                                        : '🎯'}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <h4
                                      style={{
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        margin: 0,
                                      }}
                                    >
                                      {activity.contact}
                                    </h4>
                                    <p
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.9rem',
                                        margin: '2px 0',
                                      }}
                                    >
                                      {activity.type === 'email'
                                        ? activity.subject
                                        : activity.type.toUpperCase()}{' '}
                                      • {activity.timestamp}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      background:
                                        activity.result.includes(
                                          'Interested'
                                        ) ||
                                        activity.result.includes('Qualified')
                                          ? '#22c55e20'
                                          : '#f59e0b20',
                                      color:
                                        activity.result.includes(
                                          'Interested'
                                        ) ||
                                        activity.result.includes('Qualified')
                                          ? '#22c55e'
                                          : '#f59e0b',
                                      padding: '4px 12px',
                                      borderRadius: '12px',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {activity.result}
                                  </div>
                                </div>

                                {activity.notes && (
                                  <div
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.8)',
                                      fontSize: '0.9rem',
                                      background: 'rgba(255, 255, 255, 0.02)',
                                      padding: '10px',
                                      borderRadius: '6px',
                                      borderLeft: '3px solid #8b5cf6',
                                    }}
                                  >
                                    <strong>Notes:</strong> {activity.notes}
                                  </div>
                                )}

                                {activity.leadScore && (
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      display: 'flex',
                                      gap: '15px',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.9rem',
                                      }}
                                    >
                                      Lead Score:{' '}
                                      <strong style={{ color: '#8b5cf6' }}>
                                        {activity.leadScore}/100
                                      </strong>
                                    </span>
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.9rem',
                                      }}
                                    >
                                      Estimated Value:{' '}
                                      <strong style={{ color: '#22c55e' }}>
                                        {activity.estimatedValue}
                                      </strong>
                                    </span>
                                  </div>
                                )}

                                {activity.duration && (
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    Duration: {activity.duration}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Performance Tab */}
                        {staffDetailsView === 'performance' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '25px',
                            }}
                          >
                            <h3
                              style={{
                                color: 'white',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                margin: 0,
                              }}
                            >
                              Performance Analytics
                            </h3>

                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '20px',
                              }}
                            >
                              <div
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(148, 163, 184, 0.1)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                }}
                              >
                                <h4
                                  style={{
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    marginBottom: '15px',
                                  }}
                                >
                                  📅 This Week
                                </h4>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Calls Made:
                                    </span>
                                    <span
                                      style={{
                                        color: '#22c55e',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisWeek
                                          .callsMade
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Emails Sent:
                                    </span>
                                    <span
                                      style={{
                                        color: '#3b82f6',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisWeek
                                          .emailsSent
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Leads Generated:
                                    </span>
                                    <span
                                      style={{
                                        color: '#8b5cf6',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisWeek
                                          .leadsGenerated
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Deals Completed:
                                    </span>
                                    <span
                                      style={{
                                        color: '#f59e0b',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisWeek
                                          .dealsCompleted
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      paddingTop: '10px',
                                      borderTop:
                                        '1px solid rgba(148, 163, 184, 0.1)',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Revenue:
                                    </span>
                                    <span
                                      style={{
                                        color: '#22c55e',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisWeek
                                          .revenue
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(148, 163, 184, 0.1)',
                                  borderRadius: '12px',
                                  padding: '20px',
                                }}
                              >
                                <h4
                                  style={{
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    marginBottom: '15px',
                                  }}
                                >
                                  📊 This Month
                                </h4>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Calls Made:
                                    </span>
                                    <span
                                      style={{
                                        color: '#22c55e',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisMonth
                                          .callsMade
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Emails Sent:
                                    </span>
                                    <span
                                      style={{
                                        color: '#3b82f6',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisMonth
                                          .emailsSent
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Leads Generated:
                                    </span>
                                    <span
                                      style={{
                                        color: '#8b5cf6',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisMonth
                                          .leadsGenerated
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Deals Completed:
                                    </span>
                                    <span
                                      style={{
                                        color: '#f59e0b',
                                        fontWeight: '700',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisMonth
                                          .dealsCompleted
                                      }
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      paddingTop: '10px',
                                      borderTop:
                                        '1px solid rgba(148, 163, 184, 0.1)',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                      }}
                                    >
                                      Revenue:
                                    </span>
                                    <span
                                      style={{
                                        color: '#22c55e',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                      }}
                                    >
                                      {
                                        staffDetails.performance.thisMonth
                                          .revenue
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(148, 163, 184, 0.1)',
                                borderRadius: '12px',
                                padding: '20px',
                              }}
                            >
                              <h4
                                style={{
                                  color: 'white',
                                  fontSize: '1.1rem',
                                  fontWeight: '700',
                                  marginBottom: '15px',
                                }}
                              >
                                🏆 Performance Insights
                              </h4>
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns:
                                    'repeat(auto-fit, minmax(200px, 1fr))',
                                  gap: '15px',
                                }}
                              >
                                <div style={{ textAlign: 'center' }}>
                                  <div
                                    style={{
                                      color: '#22c55e',
                                      fontSize: '1.5rem',
                                      fontWeight: '700',
                                    }}
                                  >
                                    {Math.round(
                                      (staffDetails.performance.thisMonth
                                        .dealsCompleted /
                                        staffDetails.performance.thisMonth
                                          .leadsGenerated) *
                                        100
                                    )}
                                    %
                                  </div>
                                  <div
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    Conversion Rate
                                  </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                  <div
                                    style={{
                                      color: '#3b82f6',
                                      fontSize: '1.5rem',
                                      fontWeight: '700',
                                    }}
                                  >
                                    $
                                    {Math.round(
                                      parseInt(
                                        staffDetails.performance.thisMonth.revenue.replace(
                                          /[$,]/g,
                                          ''
                                        )
                                      ) /
                                        staffDetails.performance.thisMonth
                                          .dealsCompleted
                                    ).toLocaleString()}
                                  </div>
                                  <div
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    Avg Deal Value
                                  </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                  <div
                                    style={{
                                      color: '#8b5cf6',
                                      fontSize: '1.5rem',
                                      fontWeight: '700',
                                    }}
                                  >
                                    {Math.round(
                                      staffDetails.performance.thisMonth
                                        .callsMade / 4.3
                                    )}{' '}
                                    {/* Assuming ~30 days / 7 days per week */}
                                  </div>
                                  <div
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    Calls per Week
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CRM & LEADS VIEW */}
      {selectedMainView === 'crm' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '700',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                📞 DEPOINTE AI CRM & Lead Management
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.1rem',
                  margin: '8px 0 0 0',
                }}
              >
                Campaign connections, follow-ups, and deal pipeline for Dee's
                freight brokerage
              </p>
            </div>
          </div>

          {/* CRM Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
              <div
                style={{
                  color: '#8b5cf6',
                  fontSize: '2rem',
                  fontWeight: '700',
                }}
              >
                {crmLeads.length}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Total Leads
              </div>
            </div>

            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📞</div>
              <div
                style={{
                  color: '#22c55e',
                  fontSize: '2rem',
                  fontWeight: '700',
                }}
              >
                {
                  crmLeads.filter(
                    (lead) =>
                      lead.status === 'contacted' || lead.status === 'qualified'
                  ).length
                }
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Active Prospects
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
              <div
                style={{
                  color: '#f59e0b',
                  fontSize: '2rem',
                  fontWeight: '700',
                }}
              >
                {
                  followUpTasks.filter((task) => task.status === 'pending')
                    .length
                }
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Pending Follow-ups
              </div>
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                $
                {(
                  crmLeads.reduce(
                    (sum, lead) => sum + (lead.estimatedValue || 0),
                    0
                  ) / 1000
                ).toFixed(0)}
                K
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                }}
              >
                Pipeline Value
              </div>
            </div>
          </div>

          {/* CRM Leads Grid */}
          <div style={{ marginBottom: '30px' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🎯 Campaign Leads Database
            </h3>

            {crmLeads.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px',
                }}
              >
                {crmLeads.map((lead) => {
                  const staff = staffData.find((s) => s.id === lead.assignedTo);
                  const statusColors = {
                    new: '#3b82f6',
                    contacted: '#f59e0b',
                    qualified: '#22c55e',
                    'proposal-sent': '#8b5cf6',
                    negotiating: '#ef4444',
                    won: '#22c55e',
                    lost: '#6b7280',
                  };
                  const statusColor =
                    statusColors[lead.status as keyof typeof statusColors] ||
                    '#6b7280';

                  return (
                    <div
                      key={lead.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 10px 25px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {lead.company}
                          </h4>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.9rem',
                              margin: '0 0 8px 0',
                            }}
                          >
                            👤 {lead.contactName}
                          </p>
                          {lead.contactPhone && (
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.85rem',
                                margin: 0,
                              }}
                            >
                              📞 {lead.contactPhone}
                            </p>
                          )}
                        </div>
                        <span
                          style={{
                            background: `${statusColor}20`,
                            color: statusColor,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {lead.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              color: '#22c55e',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                            }}
                          >
                            💰 ${(lead.estimatedValue / 1000).toFixed(0)}K
                          </span>
                          <span
                            style={{
                              color: '#3b82f6',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                            }}
                          >
                            📋 {lead.source.replace('-', ' ')}
                          </span>
                          <span
                            style={{
                              color:
                                lead.priority === 'CRITICAL'
                                  ? '#ef4444'
                                  : lead.priority === 'HIGH'
                                    ? '#f59e0b'
                                    : '#22c55e',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                            }}
                          >
                            🔥 {lead.priority}
                          </span>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                            marginBottom: '4px',
                          }}
                        >
                          Assigned to:{' '}
                          <strong>
                            {staff
                              ? `${staff.avatar} ${staff.name}`
                              : 'Unknown'}
                          </strong>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem',
                          }}
                        >
                          Added: {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            // Update lead status
                            const updatedLeads = crmLeads.map((l) =>
                              l.id === lead.id
                                ? {
                                    ...l,
                                    status: 'contacted',
                                    lastContact: new Date(),
                                    updatedAt: new Date(),
                                  }
                                : l
                            );
                            setCrmLeads(updatedLeads);
                            localStorage.setItem(
                              'depointe-crm-leads',
                              JSON.stringify(updatedLeads)
                            );
                          }}
                          style={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: '#22c55e',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📞 Contact
                        </button>
                        <button
                          onClick={() => {
                            // Create follow-up task
                            const followUpTask = {
                              id: `followup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                              leadId: lead.id,
                              title: `Follow up with ${lead.company}`,
                              description: `Schedule next contact with ${lead.contactName}`,
                              dueDate: new Date(
                                Date.now() + 7 * 24 * 60 * 60 * 1000
                              ),
                              priority: lead.priority,
                              assignedTo: lead.assignedTo,
                              status: 'pending',
                              type: 'call',
                              createdAt: new Date(),
                            };

                            const updatedTasks = [
                              ...followUpTasks,
                              followUpTask,
                            ];
                            setFollowUpTasks(updatedTasks);
                            localStorage.setItem(
                              'depointe-followup-tasks',
                              JSON.stringify(updatedTasks)
                            );

                            alert('Follow-up task created!');
                          }}
                          style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: '#8b5cf6',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📅 Follow-up
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm('Move this lead to qualified status?')
                            ) {
                              const updatedLeads = crmLeads.map((l) =>
                                l.id === lead.id
                                  ? {
                                      ...l,
                                      status: 'qualified',
                                      updatedAt: new Date(),
                                    }
                                  : l
                              );
                              setCrmLeads(updatedLeads);
                              localStorage.setItem(
                                'depointe-crm-leads',
                                JSON.stringify(updatedLeads)
                              );
                            }
                          }}
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: '#f59e0b',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          ✅ Qualify
                        </button>
                      </div>

                      {lead.notes && lead.notes.length > 0 && (
                        <div
                          style={{
                            marginTop: '12px',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px',
                          }}
                        >
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            📝 Notes:
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            {lead.notes[lead.notes.length - 1]}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(148, 163, 184, 0.3)',
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                <h3
                  style={{
                    color: 'white',
                    marginBottom: '10px',
                    fontSize: '1.5rem',
                  }}
                >
                  No Leads Yet
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '1.1rem',
                    marginBottom: '20px',
                  }}
                >
                  Campaign connections will automatically appear here as your AI
                  teams make contact
                </p>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.9rem',
                  }}
                >
                  Deploy healthcare, shipper, or desperate prospects campaigns
                  to start generating leads
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEAD GENERATION VIEW */}
      {selectedMainView === 'leads' && (
        <div>
          <div
            style={{
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: 'white',
                marginBottom: '10px',
                fontSize: '2.2rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              🎯 DEPOINTE AI Lead Generation Hub
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Advanced lead generation from TruckingPlanet, ThomasNet, and
              combined sources with AI-powered scoring and freight potential
              analysis
            </p>
          </div>

          {/* Lead Generation Dashboard Content */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {/* Lead Sources */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                📊 Lead Sources
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    🚛 TruckingPlanet
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Carrier and shipper leads from trucking network
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    🏭 ThomasNet
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    B2B manufacturing and industrial leads
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#a855f7',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    🔄 Combined Sources
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Cross-platform lead matching and validation
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      color: '#ef4444',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    🏛️ FMCSA Database
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Reverse shipper lookup and carrier verification
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Statistics */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                📈 Lead Performance
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 8px #22c55e40',
                    }}
                  >
                    0
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    New Leads Today
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 8px #3b82f640',
                    }}
                  >
                    0
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Qualified Leads
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 8px #f59e0b40',
                    }}
                  >
                    0%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Conversion Rate
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#a855f7',
                      fontSize: '2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 8px #a855f740',
                    }}
                  >
                    $0K
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Est. Revenue
                  </div>
                </div>
              </div>
            </div>

            {/* AI Lead Scoring */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                🤖 AI Lead Scoring
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#22c55e',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        High Priority Leads
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        90-100% match score
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      0
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        Medium Priority Leads
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        70-89% match score
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      0
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#ef4444',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        Low Priority Leads
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Under 70% match score
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      0
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Freight Potential Analysis */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                🚛 Freight Potential Analysis
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#a855f7',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        High-Value Corridors
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Premium shipping routes
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#a855f7',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      $5K-15K
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#3b82f6',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        Standard Routes
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Regular freight opportunities
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      $1K-5K
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#10b981',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        Specialized Freight
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                        }}
                      >
                        Oversized, hazmat, refrigerated
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}
                    >
                      $2K-8K
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '30px',
            }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(34, 197, 94, 0.3)';
              }}
            >
              🚀 Start Lead Generation
            </button>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📊 View Lead Analytics
            </button>
          </div>

          {/* Unified AI Lead Pipeline */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '16px',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              🔄 Unified AI Lead Pipeline: Lead Generation → SALESFLOW.AI →
              LIVEFLOW.AI
            </h4>

            {/* Pipeline Flow Visualization */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
              }}
            >
              {/* Lead Generation */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(45deg, #3b82f6, #10b981, #ef4444)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '16px',
                  }}
                >
                  🎯
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  Lead Generation
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.7rem',
                  }}
                >
                  FMCSA, TruckingPlanet, ThomasNet
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  color: '#22c55e',
                  fontSize: '1.5rem',
                  margin: '0 10px',
                }}
              >
                →
              </div>

              {/* SALESFLOW.AI */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #9333ea, #c084fc)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                  }}
                >
                  S
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  SALESFLOW.AI
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.7rem',
                  }}
                >
                  Automated Email Campaigns
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  color: '#22c55e',
                  fontSize: '1.5rem',
                  margin: '0 10px',
                }}
              >
                →
              </div>

              {/* LIVEFLOW.AI */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #ea580c, #fed7aa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
                  }}
                >
                  L
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  LIVEFLOW.AI
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.7rem',
                  }}
                >
                  Real-Time Call Intelligence
                </div>
              </div>
            </div>

            {/* Pipeline Controls */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              {/* Start Pipeline */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 16px rgba(34, 197, 94, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={async () => {
                  try {
                    alert(
                      `🚀 Starting Unified AI Pipeline!\n\n1. Lead Generation → Scanning FMCSA, TruckingPlanet, ThomasNet\n2. SALESFLOW.AI → Automated email sequences initiated\n3. LIVEFLOW.AI → Real-time call assistance activated\n\nAll systems working together for maximum conversion rates!`
                    );

                    // Import and use the unified pipeline service
                    const { unifiedLeadPipeline } = await import(
                      '../services/UnifiedLeadPipelineService'
                    );
                    const leads = await unifiedLeadPipeline.generateLeads();

                    alert(
                      `✅ Pipeline Started Successfully!\n\n🎯 Generated ${leads.length} leads\n📧 SALESFLOW.AI sequences initiated\n📞 LIVEFLOW.AI call assistance ready\n\nCheck the lead analytics for detailed metrics!`
                    );
                  } catch (error) {
                    console.error('Pipeline start failed:', error);
                    alert(
                      `❌ Pipeline start failed. Please check the console for details.`
                    );
                  }
                }}
              >
                <div
                  style={{
                    color: '#22c55e',
                    fontWeight: '600',
                    marginBottom: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  ▶️ Start Pipeline
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.7rem',
                    lineHeight: '1.3',
                  }}
                >
                  Generate leads → Email campaigns → Call follow-up
                </div>
              </div>

              {/* Pipeline Status */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#3b82f6',
                    fontWeight: '600',
                    marginBottom: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  📊 Pipeline Status
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.7rem',
                    lineHeight: '1.3',
                  }}
                >
                  All systems active and synchronized
                </div>
              </div>

              {/* Performance Metrics */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#a855f7',
                    fontWeight: '600',
                    marginBottom: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  📈 Performance
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.7rem',
                    lineHeight: '1.3',
                  }}
                >
                  85% conversion rate with AI pipeline
                </div>
              </div>
            </div>

            {/* FMCSA Integration */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                🏛️ FMCSA Integration
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.7rem',
                }}
              >
                Reverse shipper lookups automatically feed into SALESFLOW.AI
                campaigns. Carrier verification data enhances LIVEFLOW.AI call
                intelligence.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS VIEW */}
      {selectedMainView === 'analytics' && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📈</div>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>
            DEPOINTE AI Analytics
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Advanced analytics and reporting coming soon
          </p>
        </div>
      )}

      {/* CAMPAIGNS VIEW - CAMPAIGN TEMPLATES */}
      {selectedMainView === 'campaigns' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                color: 'white',
                marginBottom: '10px',
                fontSize: '1.8rem',
                fontWeight: '700',
              }}
            >
              🚀 Campaign Templates & Management Center
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '20px',
                fontSize: '1.1rem',
              }}
            >
              Launch and manage your 17+ specialized campaign templates with AI
              staff assignments including Charin, Roland, and Lea D.
            </p>
          </div>

          {/* Campaign Sub-Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setCampaignView('templates')}
              style={{
                background:
                  campaignView === 'templates'
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  campaignView === 'templates'
                    ? 'none'
                    : '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              🚀 Campaign Templates
            </button>
            <button
              onClick={() => setCampaignView('nemt-healthcare')}
              style={{
                background:
                  campaignView === 'nemt-healthcare'
                    ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  campaignView === 'nemt-healthcare'
                    ? 'none'
                    : '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              🏥 NEMT Healthcare
            </button>
          </div>

          {/* Campaign Templates Container */}
          {campaignView === 'templates' && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <CampaignTemplates />
            </div>
          )}

          {/* NEMT Healthcare Campaigns */}
          {campaignView === 'nemt-healthcare' && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <NEMTHealthcareCampaigns />
            </div>
          )}
        </div>
      )}

      {/* NEMT OPERATIONS VIEW */}
      {selectedMainView === 'nemt-operations' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <HybridNEMTSystem />
        </div>
      )}

      {selectedMainView === 'scheduler' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <div
            style={{
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: 'white',
                marginBottom: '10px',
                fontSize: '1.8rem',
                fontWeight: '700',
              }}
            >
              📅 AI Staff Scheduler & Workforce Management
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '20px',
                fontSize: '1.1rem',
              }}
            >
              Monitor your DEPOINTE AI team schedules, real-time activities, and
              workforce optimization
            </p>
          </div>

          {/* AI Staff Scheduler Container */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <AIStaffScheduler />
          </div>
        </div>
      )}

      {/* Email Signatures Dashboard */}
      {selectedMainView === 'email-signatures' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              📧 Email Signatures Management
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '20px',
              }}
            >
              Professional email signature creation and management for FleetFlow
              TMS communications
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#3b82f6',
                marginBottom: '15px',
                fontSize: '18px',
              }}
            >
              Quick Access Links
            </h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <a
                href='/email-signatures'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 16px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                🎨 Open Signature Builder
              </a>

              <a
                href='/email-signatures'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                📋 Manage Signatures
              </a>

              <a
                href='/email-signatures'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 16px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
              >
                📊 View Analytics
              </a>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#8b5cf6',
                marginBottom: '15px',
                fontSize: '18px',
              }}
            >
              📧 Features Available
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <h4
                  style={{
                    color: '#3b82f6',
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                  }}
                >
                  🎨 Visual Designer
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  Drag-and-drop interface for creating professional email
                  signatures
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <h4
                  style={{
                    color: '#10b981',
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                  }}
                >
                  📱 Templates
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  Pre-designed templates for Executive, Operations, Sales &
                  Marketing
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}
              >
                <h4
                  style={{
                    color: '#f59e0b',
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                  }}
                >
                  🔗 Integration
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  Automatic injection into SendGrid emails and AI communications
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <h4
                  style={{
                    color: '#8b5cf6',
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                  }}
                >
                  📊 Analytics
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  Track signature usage and performance metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Power-Ups Dashboard */}
      {selectedMainView === 'powerups' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <PowerUpsDashboard selectedStaff={selectedStaffMember} />
        </div>
      )}

      {/* Freight Brain AI Dashboard */}
      {selectedMainView === 'brain' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <FreightBrainDashboard selectedStaff={selectedStaffMember} />
        </div>
      )}

      {/* Sales Copilot AI Dashboard */}
      {selectedMainView === 'sales-copilot' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginBottom: '10px',
              }}
            >
              🤖 Sales Copilot AI
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
              Real-time sales guidance for human agents during live calls.
              Provides undetectable, psychology-based sales assistance that
              rivals yurp.ai.
            </p>
          </div>

          {/* Import and use SalesCopilotPanel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Main Sales Copilot Panel */}
            <div>
              <SalesCopilotPanel
                agentId='depointe_agent'
                currentCallId={null} // Will be set when call starts
              />
            </div>

            {/* Feature Overview */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                height: 'fit-content',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#f8fafc',
                  marginBottom: '12px',
                }}
              >
                🎯 Core Capabilities
              </h3>
              <div style={{ spaceY: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    🔍
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    Discovery Question Generation
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    🛡️
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    Objection Handling
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    💡
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    Instant FAQ Answers
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    🎯
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    Deal Closing Scripts
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '6px',
                }}
              >
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#8b5cf6',
                    marginBottom: '4px',
                  }}
                >
                  🤖 AI Staff Integration
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '12px' }}>
                  Powered by Desiree, Cliff, and Gary - your specialized sales
                  AI staff with expertise in resistance removal,
                  psychology-based engagement, and lead generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Call Center */}
      {selectedMainView === 'call-center' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            margin: '20px',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              📞 Enhanced AI Call Center
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '20px',
              }}
            >
              Automated carrier conversation handling with intelligent voice AI.
              Parade.ai CoDriver-level capabilities for 24/7 freight operations.
            </p>
          </div>

          {/* Call Center Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ color: '#22c55e', marginBottom: '8px' }}>
                Active Sessions
              </h4>
              <p
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                --
              </p>
            </div>

            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>
                Calls Handled Today
              </h4>
              <p
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                --
              </p>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>
                AI Confidence
              </h4>
              <p
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                --%
              </p>
            </div>

            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>
                Loads Booked
              </h4>
              <p
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                --
              </p>
            </div>
          </div>

          {/* Call Center Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Configuration Panel */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h4 style={{ color: 'white', marginBottom: '16px' }}>
                ⚙️ Call Center Configuration
              </h4>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  FreeSWITCH Host:
                </label>
                <input
                  type='text'
                  defaultValue='localhost'
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Port:
                </label>
                <input
                  type='number'
                  defaultValue='8021'
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                  }}
                />
              </div>

              <button
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                🚀 Start Call Center
              </button>
            </div>

            {/* Active Sessions */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h4 style={{ color: 'white', marginBottom: '16px' }}>
                📞 Active Call Sessions
              </h4>

              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                  padding: '40px',
                }}
              >
                No active sessions
                <br />
                <span style={{ fontSize: '0.8rem' }}>
                  Sessions will appear here when carriers call in
                </span>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '20px',
            }}
          >
            <h4 style={{ color: 'white', marginBottom: '16px' }}>
              🎯 AI Call Center Features
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                }}
              >
                • 🤖 Automated carrier conversations
                <br />
                • 📝 Full call transcription
                <br />
                • 🎯 Intelligent load matching
                <br />
                • 💰 Automated quoting system
                <br />• 📊 Real-time performance analytics
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                }}
              >
                • 🚛 Capacity availability checking
                <br />
                • 📞 Seamless human handoff
                <br />
                • 🎪 Multi-carrier conversation handling
                <br />
                • 📈 Conversion rate optimization
                <br />• 🔄 CRM integration
              </div>
            </div>
          </div>
        </div>
      )}

      {/* China-USA DDP Customer Acquisition Service */}
      {selectedMainView === 'china-usa-ddp' && (
        <div>
          <ChinaUSADDPService />
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskCreationInterface
        isOpen={isTaskCreationOpen}
        onClose={() => setIsTaskCreationOpen(false)}
        onTaskCreate={handleTaskCreate}
        availableStaff={availableStaff}
      />

      {/* Healthcare Batch Deployment Modal */}
      {isHealthcareTaskOpen && (
        <HealthcareBatchDeployment
          onClose={() => setIsHealthcareTaskOpen(false)}
          onBatchDeploy={handleHealthcareBatchDeploy}
        />
      )}

      {/* Shipper Batch Deployment Modal */}
      {isShipperTaskOpen && (
        <ShipperBatchDeployment
          onClose={() => setIsShipperTaskOpen(false)}
          onBatchDeploy={handleShipperBatchDeploy}
        />
      )}

      {/* Desperate Prospects Batch Deployment Modal */}
      {isDesperateProspectsTaskOpen && (
        <DesperateProspectsBatchDeployment
          onClose={() => setIsDesperateProspectsTaskOpen(false)}
          onBatchDeploy={handleDesperateProspectsBatchDeploy}
        />
      )}
    </div>
  );
}
