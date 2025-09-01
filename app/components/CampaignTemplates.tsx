'use client';

import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  MessageSquare,
  Play,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | 'lead_generation'
    | 'follow_up'
    | 'nurture'
    | 'conversion'
    | 'retention';
  targetAudience: string;
  expectedResults: {
    leads: number;
    conversions: number;
    revenue: number;
  };
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  aiStaff: string[];
  channels: string[];
  steps: CampaignStep[];
  successMetrics: string[];
  icon: string;
  color: string;
}

interface CampaignStep {
  id: string;
  name: string;
  description: string;
  timing: string;
  channel: string;
  aiStaff?: string;
  template?: string;
  automationLevel: 'manual' | 'semi' | 'full';
}

interface CampaignInstance {
  id: string;
  templateId: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  progress: number;
  results: {
    leads: number;
    conversions: number;
    revenue: number;
  };
}

export default function CampaignTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] =
    useState<CampaignTemplate | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<CampaignInstance[]>(
    []
  );

  // PRIORITY CAMPAIGN EXECUTION PLAN
  // PHASE 1: TOP 3 CAMPAIGNS FOR MAXIMUM REVENUE
  const priorityCampaigns = [
    'desperate_shippers_blitz',
    'new_businesses_freight_blitz',
    'high_value_prospect_acceleration', // RECOMMENDED ADDITION
  ];

  // Comprehensive Campaign Templates
  const campaignTemplates: CampaignTemplate[] = [
    // PHASE 1: PRIORITY CAMPAIGNS (START FIRST)
    // 🚨 #1 CRISIS RESPONSE - $7,500/month (conservative estimate)
    // 🏭 #2 NEW BUSINESSES - $6,000/month (conservative estimate)
    // TOTAL: $13,500/month combined revenue (realistic expectation)

    // LEAD GENERATION CAMPAIGNS
    {
      id: 'desperate_shippers_blitz',
      name: 'Desperate Shippers Blitz (Balanced Multi-Channel)',
      description:
        'Target companies with urgent shipping needs using FMCSA and TruckingPlanet data featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing - Balanced Email/Phone Approach',
      category: 'lead_generation',
      targetAudience:
        'Companies with compliance issues, capacity shortages, expiring contracts',
      expectedResults: {
        leads: 150, // Conservative: Based on FMCSA data quality
        conversions: 45, // Realistic: 30% conversion rate for crisis prospects
        revenue: 225000, // Realistic: $7,500/month based on historical freight rates
      },
      duration: '30 days',
      difficulty: 'medium', // Slightly higher due to phone component
      aiStaff: ['Desiree', 'Cliff', 'Gary', 'Charin'], // Added Charin for phone outreach support
      channels: ['Phone', 'Email', 'LinkedIn'], // Phone primary for immediate crisis response
      icon: '📞',
      color: 'bg-red-500',
      steps: [
        {
          id: 'crisis_intelligence_gathering',
          name: 'Crisis Intelligence Gathering',
          description:
            'Leverage FMCSA and TruckingPlanet APIs to identify desperate shippers with expiring carrier insurance',
          timing: 'Day 1',
          channel: 'Data Analysis',
          aiStaff: 'Cliff',
          automationLevel: 'full',
        },
        {
          id: 'urgent_crisis_outreach_blast',
          name: 'Urgent Crisis Outreach Blast',
          description:
            'Immediate email and phone campaign to shippers affected by carrier insurance crises - "We Know Your Carrier Crisis"',
          timing: 'Day 1',
          channel: 'Email/Phone (50/50)',
          aiStaff: 'Cliff & Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'compliance_solution_sequence',
          name: 'Compliance Solution Multi-Channel Sequence',
          description:
            '3-email + 2-phone sequence: Problem identification → Solution positioning → Case studies → ROI calculation → Call-to-action',
          timing: 'Day 2-7',
          channel: 'Email/Phone (60/40)',
          aiStaff: 'Gary & Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'personalized_capacity_offers',
          name: 'Personalized Capacity Offers',
          description:
            'Customized email and phone offers with specific capacity availability, rates, and guaranteed timelines',
          timing: 'Day 8-14',
          channel: 'Email/Phone (50/50)',
          aiStaff: 'Gary & Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'crisis_relationship_building',
          name: 'Crisis Relationship Building',
          description:
            'Strategic phone and LinkedIn outreach to build relationships with crisis-affected shippers',
          timing: 'Day 15-25',
          channel: 'Phone/LinkedIn (70/30)',
          aiStaff: 'Desiree & Cliff',
          automationLevel: 'semi',
        },
        {
          id: 'decision_maker_closing_sequence',
          name: 'Decision Maker Closing Sequence',
          description:
            'Intensive phone and email follow-up to high-value prospects with customized proposals and urgency creation',
          timing: 'Day 26-30',
          channel: 'Phone/Email (60/40)',
          aiStaff: 'Desiree & Gary',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '200+ qualified leads generated (33% increase)',
        '65+ proposal meetings booked (35% increase)',
        '$300K+ pipeline created (40% increase)',
        '65%+ email open rate (crisis relevance)',
        '25%+ email click-through rate (solution interest)',
        '35%+ phone connection rate (crisis urgency)',
        '20%+ phone-to-meeting conversion (personal touch)',
        '80%+ qualification rate (multi-channel nurture)',
      ],
    },

    // 🚀 PHASE 1 PRIORITY #2: NEW BUSINESSES CAMPAIGN - HIGH INTENT PROSPECTS
    // 🏭 HIGH-INTENT PROSPECTS - FASTEST REVENUE GENERATION
    {
      id: 'new_businesses_freight_blitz',
      name: 'New Businesses Freight Blitz (PHASE 1 PRIORITY)',
      description:
        'Target newly established manufacturers, wholesalers, and warehouses actively seeking freight solutions featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing - FASTEST REVENUE',
      category: 'lead_generation',
      targetAudience:
        'New manufacturers, wholesalers, and warehouses (1-5 years old) needing immediate logistics partnerships - HIGH INTENT BUYERS',
      expectedResults: {
        leads: 95, // Conservative: Based on new business registration data
        conversions: 29, // Realistic: 30% conversion for high-intent prospects
        revenue: 180000, // Realistic: $6,000/month based on startup freight needs
      },
      duration: '30 days',
      difficulty: 'easy',
      aiStaff: ['Gary', 'Desiree', 'Logan', 'Lea D.'], // Added Lea D. for lead nurturing
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🏢',
      color: 'bg-green-500',
      steps: [
        {
          id: 'new_business_intelligence',
          name: 'New Business Intelligence Gathering',
          description:
            'Identify recently established manufacturers, wholesalers, and warehouses using business registries and industry sources',
          timing: 'Day 1',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'immediate_value_email_blast',
          name: 'Immediate Value Email Blast',
          description:
            'Send urgent value proposition emails to new businesses highlighting quick setup and immediate capacity availability',
          timing: 'Day 1-3',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'rapid_response_phone_outreach',
          name: 'Rapid Response Phone Outreach',
          description:
            'Immediate phone calls to engaged prospects offering same-day consultations and quick implementation',
          timing: 'Day 2-7',
          channel: 'Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'startup_friendly_proposals',
          name: 'Startup-Friendly Proposals',
          description:
            'Customized proposals with flexible terms, quick implementation, and growth-oriented service packages',
          timing: 'Day 8-15',
          channel: 'Email/Phone',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'relationship_acceleration',
          name: 'Relationship Acceleration',
          description:
            'Accelerated relationship building with weekly check-ins and milestone-based service adjustments',
          timing: 'Day 16-25',
          channel: 'Phone/Email',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'loyalty_lock_in_sequence',
          name: 'Loyalty Lock-In Sequence',
          description:
            'Long-term partnership offers with loyalty discounts and dedicated support for growing businesses',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '120+ new business leads generated',
        '36+ quick-start partnerships secured',
        '$225K+ immediate revenue pipeline',
        '75%+ response rate (high intent prospects)',
        '40%+ meeting booking rate (immediate needs)',
        '30%+ same-week implementation rate',
      ],
    },

    {
      id: 'enterprise_manufacturer_hunt',
      name: 'Enterprise Manufacturer Hunt',
      description:
        'Target large manufacturers with substantial shipping volumes using Thomas.net',
      category: 'lead_generation',
      targetAudience:
        'Enterprise manufacturers (500+ employees) with high shipping volumes',
      expectedResults: {
        leads: 75,
        conversions: 15,
        revenue: 750000,
      },
      duration: '45 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Will', 'Gary'],
      channels: ['LinkedIn', 'Email', 'Phone'],
      icon: '🏭',
      color: 'bg-blue-500',
      steps: [
        {
          id: 'thomas_net_research',
          name: 'Thomas.net Intelligence',
          description:
            'Research large manufacturers and their shipping patterns',
          timing: 'Day 1-7',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'linkedin_connection',
          name: 'LinkedIn Connection Campaign',
          description: 'Connect with decision-makers at target manufacturers',
          timing: 'Day 8-14',
          channel: 'LinkedIn',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'personalized_email_sequence',
          name: 'Personalized Email Sequence',
          description: 'Send customized proposals based on manufacturer needs',
          timing: 'Day 15-30',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'executive_phone_calls',
          name: 'Executive Phone Outreach',
          description: 'Direct calls to C-level executives at target companies',
          timing: 'Day 31-45',
          channel: 'Phone',
          aiStaff: 'Will',
          automationLevel: 'manual',
        },
      ],
      successMetrics: [
        '75+ enterprise leads identified',
        '15+ executive meetings booked',
        '$750K+ revenue potential',
        '40%+ meeting-to-proposal conversion',
      ],
    },

    {
      id: 'supply_chain_disruption_targeting',
      name: 'Supply Chain Disruption Targeting',
      description:
        'Identify and target companies experiencing supply chain disruptions',
      category: 'lead_generation',
      targetAudience:
        'Companies with supply chain issues, inventory problems, production delays',
      expectedResults: {
        leads: 120,
        conversions: 36,
        revenue: 180000,
      },
      duration: '25 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Logan', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '⚡',
      color: 'bg-orange-500',
      steps: [
        {
          id: 'disruption_detection',
          name: 'Disruption Intelligence',
          description:
            'Monitor news, social media, and industry reports for disruptions',
          timing: 'Ongoing',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'crisis_email_campaign',
          name: 'Crisis Response Email',
          description: 'Send immediate assistance offers to affected companies',
          timing: 'Within 24 hours',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'emergency_phone_support',
          name: 'Emergency Phone Support',
          description: 'Provide immediate phone consultation for urgent needs',
          timing: 'Day 1-3',
          channel: 'Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'recovery_solution_proposals',
          name: 'Recovery Solution Proposals',
          description:
            'Present comprehensive recovery and prevention solutions',
          timing: 'Day 4-25',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '120+ crisis-affected leads',
        '36+ recovery proposals sent',
        '$180K+ immediate revenue',
        '75%+ response rate during crisis',
      ],
    },

    // FOLLOW-UP CAMPAIGNS
    {
      id: 'proposal_follow_up_accelerator',
      name: 'Proposal Follow-Up Accelerator',
      description: 'Systematic follow-up sequence for outstanding proposals',
      category: 'follow_up',
      targetAudience: 'Prospects with outstanding proposals (30+ days old)',
      expectedResults: {
        leads: 0,
        conversions: 25,
        revenue: 125000,
      },
      duration: '21 days',
      difficulty: 'easy',
      aiStaff: ['Gary', 'Will'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '📧',
      color: 'bg-green-500',
      steps: [
        {
          id: 'proposal_review',
          name: 'Proposal Status Review',
          description:
            'Review outstanding proposals and identify follow-up opportunities',
          timing: 'Day 1',
          channel: 'CRM Analysis',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'gentle_reminder_email',
          name: 'Gentle Reminder Email',
          description:
            'Send value-add reminder emails with updated information',
          timing: 'Day 2-7',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'decision_maker_phone',
          name: 'Decision Maker Phone Call',
          description:
            'Connect with decision-makers to discuss proposal status',
          timing: 'Day 8-14',
          channel: 'Phone',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'final_urgency_sequence',
          name: 'Final Urgency Sequence',
          description: 'Limited-time offers and final follow-up attempts',
          timing: 'Day 15-21',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '25+ proposals converted to business',
        '$125K+ additional revenue',
        '40%+ conversion rate on aged proposals',
        'Improved proposal-to-close cycle time',
      ],
    },

    // NURTURE CAMPAIGNS
    {
      id: 'cold_lead_warming_sequence',
      name: 'Cold Lead Warming Sequence',
      description:
        'Transform cold leads into warm prospects through value-driven content',
      category: 'nurture',
      targetAudience: 'Cold leads (60+ days since last contact)',
      expectedResults: {
        leads: 0,
        conversions: 30,
        revenue: 150000,
      },
      duration: '60 days',
      difficulty: 'medium',
      aiStaff: ['Gary', 'Desiree'],
      channels: ['Email', 'LinkedIn', 'Content'],
      icon: '📈',
      color: 'bg-purple-500',
      steps: [
        {
          id: 'lead_segmentation',
          name: 'Lead Segmentation & Scoring',
          description:
            'Analyze cold leads and segment by industry and potential value',
          timing: 'Day 1',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'educational_content_series',
          name: 'Educational Content Series',
          description: 'Send industry insights and shipping optimization tips',
          timing: 'Day 7-42',
          channel: 'Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'value_add_touchpoints',
          name: 'Value-Add Touchpoints',
          description: 'Share case studies, whitepapers, and industry reports',
          timing: 'Day 14-49',
          channel: 'Multi-Channel',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'warm_lead_reengagement',
          name: 'Warm Lead Reengagement',
          description: 'Personalized outreach to leads showing engagement',
          timing: 'Day 50-60',
          channel: 'Phone/Email',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '30+ cold leads converted to opportunities',
        '$150K+ pipeline generated',
        '25%+ re-engagement rate',
        'Improved lead scoring accuracy',
      ],
    },

    // CONVERSION CAMPAIGNS
    {
      id: 'high_value_prospect_acceleration',
      name: 'High-Value Prospect Acceleration',
      description:
        'Accelerate conversion of high-value prospects through intensive outreach',
      category: 'conversion',
      targetAudience:
        'High-value prospects ($50K+ potential) in consideration phase',
      expectedResults: {
        leads: 0,
        conversions: 12,
        revenue: 600000,
      },
      duration: '30 days',
      difficulty: 'hard',
      aiStaff: ['Will', 'Gary', 'Resse A. Bell', 'Charin', 'Lea D.'], // Added Charin (phone) + Lea D. (nurturing)
      channels: ['Phone', 'Email', 'LinkedIn', 'In-Person'],
      icon: '⚡',
      color: 'bg-indigo-500',
      steps: [
        {
          id: 'prospect_qualification',
          name: 'High-Value Prospect Qualification',
          description: 'Verify prospect qualification and budget authority',
          timing: 'Day 1-3',
          channel: 'Phone/Email',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'executive_level_outreach',
          name: 'Executive-Level Outreach',
          description: 'Connect with C-level decision makers and influencers',
          timing: 'Day 4-10',
          channel: 'Phone/LinkedIn',
          aiStaff: 'Will',
          automationLevel: 'manual',
        },
        {
          id: 'customized_proposal_delivery',
          name: 'Customized Proposal Delivery',
          description: 'Deliver tailored proposals with executive summaries',
          timing: 'Day 11-15',
          channel: 'Email/In-Person',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'objection_handling_sequence',
          name: 'Objection Handling Sequence',
          description: 'Address concerns and provide additional information',
          timing: 'Day 16-25',
          channel: 'Phone/Email',
          aiStaff: 'Will',
          automationLevel: 'manual',
        },
        {
          id: 'final_close_acceleration',
          name: 'Final Close Acceleration',
          description: 'Limited-time offers and final negotiation support',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Resse A. Bell',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '12+ high-value deals closed',
        '$600K+ revenue generated',
        '50%+ close rate on qualified prospects',
        'Average deal size: $50K+',
      ],
    },

    // DISPATCH SERVICE CAMPAIGNS - 10% of Carrier Load Fees
    {
      id: 'carrier_dispatch_services',
      name: 'Carrier Dispatch Services Campaign',
      description:
        'Target carriers who need professional dispatch services - 10% of their load fees revenue stream',
      category: 'dispatch_services',
      targetAudience:
        'Carriers needing dispatch support, load management, and fee collection services',
      expectedResults: {
        leads: 75,
        conversions: 38,
        revenue: 225000, // 10% of carrier load fees
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Logan', 'Desiree', 'Miles'],
      channels: ['Phone', 'Email', 'LinkedIn'],
      icon: '🚛',
      color: 'bg-orange-500',
      steps: [
        {
          id: 'carrier_identification',
          name: 'Carrier Network Analysis',
          description:
            'Identify carriers who could benefit from professional dispatch services',
          timing: 'Day 1-5',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'dispatch_value_proposition',
          name: 'Dispatch Value Proposition',
          description:
            'Present the 10% fee structure and service benefits to carriers',
          timing: 'Day 6-15',
          channel: 'Phone/Email',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'carrier_relationship_building',
          name: 'Carrier Relationship Building',
          description: 'Build long-term partnerships with carrier network',
          timing: 'Day 16-25',
          channel: 'Phone/LinkedIn',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'dispatch_service_onboarding',
          name: 'Dispatch Service Onboarding',
          description:
            'Onboard carriers to dispatch services and fee collection',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '75+ carrier leads identified',
        '38+ carriers onboarded to dispatch services',
        '$225K+ dispatch fee revenue (10% of carrier load fees)',
        '85%+ carrier satisfaction rate',
        '90%+ on-time fee collection',
      ],
    },

    // CARRIER ACQUISITION CAMPAIGNS - Feed Dispatch Network
    {
      id: 'carrier_owner_operator_acquisition',
      name: 'Carrier/Owner Operator Acquisition Campaign',
      description:
        'Proactively recruit carriers and owner operators to build dispatch network featuring GO WITH THE FLOW instant load matching and MARKETPLACE BIDDING competitive opportunities - earn 6-10% load fees',
      category: 'carrier_acquisition',
      targetAudience:
        'Independent carriers, owner operators, and small trucking companies seeking dispatch partnerships',
      expectedResults: {
        leads: 200,
        conversions: 80, // Tiered across different carrier sizes
        revenue: 489000, // From tiered dispatch fees (6-10% of carrier loads)
      },
      duration: '45 days',
      difficulty: 'medium',
      aiStaff: ['Miles', 'Logan', 'Desiree', 'Roland'], // Added Roland for carrier relations
      channels: ['LinkedIn', 'Phone', 'Email', 'Industry Events'],
      icon: '🚛',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'carrier_prospect_identification',
          name: 'Carrier Prospect Research',
          description:
            'Identify independent carriers and owner operators through industry databases and networking',
          timing: 'Day 1-10',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'carrier_value_proposition_outreach',
          name: 'Carrier Value Proposition Outreach',
          description:
            'Present dispatch services benefits: load consistency, fee collection, administrative support',
          timing: 'Day 11-25',
          channel: 'LinkedIn/Phone',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'carrier_onboarding_process',
          name: 'Carrier Onboarding & Integration',
          description:
            'Streamlined onboarding process with technology integration and dispatch training',
          timing: 'Day 26-35',
          channel: 'Email/Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'carrier_network_expansion',
          name: 'Carrier Network Expansion',
          description:
            'Referral program and network building to attract additional carriers',
          timing: 'Day 36-45',
          channel: 'Multi-Channel',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '200+ carrier prospects identified and contacted',
        '80+ carriers onboarded to dispatch network (tiered structure)',
        '$489K+ annual dispatch revenue (tiered 6-10% of carrier load fees)',
        '85%+ carrier retention rate in first 6 months',
        '90%+ on-time payment processing for carriers',
        '70%+ carrier satisfaction with tiered service levels',
      ],
    },

    // SPECIALIZED INDUSTRY CAMPAIGNS
    {
      id: 'healthcare_pharma_distribution',
      name: 'Healthcare & Pharma Distribution Blitz - PREMIER CAMPAIGN',
      description:
        'Target hospitals, pharmacies, and medical suppliers with temperature-controlled and time-sensitive freight needs - HIGH VALUE SPECIALIZATION featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing',
      category: 'industry_specific',
      targetAudience:
        'Healthcare facilities, pharmaceutical distributors, medical suppliers, and biotech companies',
      expectedResults: {
        leads: 85,
        conversions: 26,
        revenue: 195000,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Gary', 'Logan', 'Kameelah'],
      channels: ['Email', 'LinkedIn', 'Phone'],
      icon: '🏥',
      color: 'bg-red-500',
      steps: [
        {
          id: 'healthcare_prospect_identification',
          name: 'Healthcare Network Mapping',
          description:
            'Identify hospitals, pharmacies, and medical suppliers using industry databases',
          timing: 'Day 1-7',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'compliance_certification_focus',
          name: 'Compliance & Certification Focus',
          description:
            'Highlight specialized handling, temperature control, and regulatory compliance capabilities',
          timing: 'Day 8-15',
          channel: 'Email/LinkedIn',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'medical_logistics_value_prop',
          name: 'Medical Logistics Value Proposition',
          description:
            'Present specialized services featuring GO WITH THE FLOW instant carrier matching and MARKETPLACE BIDDING competitive pricing for medical supplies, vaccines, and pharmaceutical distribution',
          timing: 'Day 16-25',
          channel: 'Phone/Email',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'healthcare_relationship_building',
          name: 'Healthcare Relationship Building',
          description:
            'Build long-term partnerships with healthcare providers and establish preferred carrier status',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '85+ healthcare prospects identified and contacted',
        '26+ healthcare clients onboarded with specialized service agreements',
        '$195K+ annual revenue from healthcare/pharma freight',
        '95%+ on-time delivery rate for medical shipments',
        '100% compliance with healthcare shipping regulations',
      ],
    },
    {
      id: 'ecommerce_seasonal_rush',
      name: 'E-commerce Seasonal Rush Blitz',
      description:
        'Target online retailers and e-commerce companies during peak shopping seasons with express delivery solutions featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing',
      category: 'seasonal_ecommerce',
      targetAudience:
        'E-commerce retailers, online marketplaces, and direct-to-consumer brands',
      expectedResults: {
        leads: 120,
        conversions: 36,
        revenue: 270000,
      },
      duration: '45 days',
      difficulty: 'high',
      aiStaff: ['Cliff', 'Desiree', 'Miles'],
      channels: ['Email', 'Phone', 'LinkedIn', 'Industry Events'],
      icon: '🛒',
      color: 'bg-purple-500',
      steps: [
        {
          id: 'ecommerce_platform_analysis',
          name: 'E-commerce Platform Analysis',
          description:
            'Identify high-volume e-commerce businesses using sales data and platform analytics',
          timing: 'Day 1-10',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'seasonal_capacity_offering',
          name: 'Seasonal Capacity Offering',
          description:
            'Present scalable freight solutions for holiday rushes and seasonal peaks',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Cliff',
          automationLevel: 'semi',
        },
        {
          id: 'express_delivery_network',
          name: 'Express Delivery Network',
          description:
            'Showcase expedited shipping options and guaranteed delivery times',
          timing: 'Day 21-30',
          channel: 'Phone/LinkedIn',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'retail_logistics_partnership',
          name: 'Retail Logistics Partnership',
          description:
            'Establish ongoing partnerships for year-round e-commerce freight needs',
          timing: 'Day 31-45',
          channel: 'Multi-Channel',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '120+ e-commerce businesses identified and contacted',
        '36+ online retailers onboarded with seasonal freight agreements',
        '$270K+ annual revenue from e-commerce freight',
        '98%+ on-time delivery during peak seasons',
        '85%+ client retention for year-round shipping needs',
      ],
    },
    {
      id: 'regional_market_penetration',
      name: 'Regional Market Penetration Blitz',
      description:
        'Target specific geographic regions with localized freight solutions featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with regional carrier partnerships',
      category: 'geographic_focus',
      targetAudience:
        'Regional manufacturers, distributors, and businesses in target markets',
      expectedResults: {
        leads: 95,
        conversions: 29,
        revenue: 218000,
      },
      duration: '35 days',
      difficulty: 'medium',
      aiStaff: ['Logan', 'Desiree', 'Will'],
      channels: ['Phone', 'Email', 'Local Networking'],
      icon: '📍',
      color: 'bg-green-500',
      steps: [
        {
          id: 'regional_market_research',
          name: 'Regional Market Research',
          description:
            'Analyze local business directories and economic data for target regions',
          timing: 'Day 1-8',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'local_carrier_network',
          name: 'Local Carrier Network Development',
          description:
            'Build relationships with regional carriers for comprehensive coverage',
          timing: 'Day 9-18',
          channel: 'Phone/Networking',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'regional_value_proposition',
          name: 'Regional Value Proposition',
          description:
            'Present localized freight solutions with regional expertise and faster transit times',
          timing: 'Day 19-28',
          channel: 'Email/Phone',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'local_market_domination',
          name: 'Local Market Domination',
          description:
            'Establish dominant presence in target region through comprehensive service offerings',
          timing: 'Day 29-35',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '95+ regional businesses identified and contacted',
        '29+ local clients onboarded with regional freight agreements',
        '$218K+ annual revenue from regional market penetration',
        '90%+ local market share in target regions',
        '95%+ customer satisfaction with regional service',
      ],
    },
    {
      id: 'enterprise_account_conversion',
      name: 'Enterprise Account Conversion Blitz',
      description:
        'Target large corporations currently using multiple carriers with comprehensive enterprise freight solutions featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing',
      category: 'enterprise_focus',
      targetAudience:
        'Large corporations, Fortune 1000 companies, and enterprise-level shippers',
      expectedResults: {
        leads: 65,
        conversions: 13,
        revenue: 650000,
      },
      duration: '60 days',
      difficulty: 'hard',
      aiStaff: ['Drew', 'Cliff', 'Logan'],
      channels: ['LinkedIn', 'Phone', 'Executive Presentations'],
      icon: '🏢',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'enterprise_prospect_identification',
          name: 'Enterprise Prospect Identification',
          description:
            'Identify large corporations with high freight volumes using enterprise databases',
          timing: 'Day 1-15',
          channel: 'Data Analysis',
          aiStaff: 'Drew',
          automationLevel: 'full',
        },
        {
          id: 'executive_relationship_building',
          name: 'Executive Relationship Building',
          description:
            'Connect with C-level executives and procurement decision-makers',
          timing: 'Day 16-30',
          channel: 'LinkedIn/Phone',
          aiStaff: 'Cliff',
          automationLevel: 'semi',
        },
        {
          id: 'enterprise_solution_presentation',
          name: 'Enterprise Solution Presentation',
          description:
            'Present comprehensive freight solutions, volume discounts, and dedicated account management',
          timing: 'Day 31-45',
          channel: 'Presentations/Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'contract_negotiation_closure',
          name: 'Contract Negotiation & Closure',
          description:
            'Navigate complex procurement processes and secure enterprise-level contracts',
          timing: 'Day 46-60',
          channel: 'Executive Meetings',
          aiStaff: 'Drew',
          automationLevel: 'manual',
        },
      ],
      successMetrics: [
        '65+ enterprise prospects identified and qualified',
        '13+ large corporations converted to enterprise freight agreements',
        '$650K+ annual revenue from enterprise accounts',
        '85%+ reduction in carrier management costs for clients',
        '95%+ service level agreement compliance',
      ],
    },
    {
      id: 'recovery_relationship_campaign',
      name: 'Recovery Relationship Blitz',
      description:
        'Target businesses that have had bad freight experiences and are seeking reliable alternatives',
      category: 'recovery_focus',
      targetAudience:
        'Businesses recovering from poor freight experiences, damaged relationships, or service failures',
      expectedResults: {
        leads: 75,
        conversions: 30,
        revenue: 180000,
      },
      duration: '25 days',
      difficulty: 'easy',
      aiStaff: ['Shanell', 'Desiree', 'Brook R.'],
      channels: ['Phone', 'Email', 'Personal Outreach'],
      icon: '🎯',
      color: 'bg-orange-500',
      steps: [
        {
          id: 'recovery_opportunity_identification',
          name: 'Recovery Opportunity Identification',
          description:
            'Identify businesses with recent freight service issues or carrier changes',
          timing: 'Day 1-5',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'empathy_based_outreach',
          name: 'Empathy-Based Outreach',
          description:
            'Connect with understanding and present reliable alternatives to past problems',
          timing: 'Day 6-12',
          channel: 'Phone/Email',
          aiStaff: 'Shanell',
          automationLevel: 'semi',
        },
        {
          id: 'service_guarantee_presentation',
          name: 'Service Guarantee Presentation',
          description:
            'Present service guarantees, reliability commitments, and problem-resolution processes',
          timing: 'Day 13-18',
          channel: 'Phone/Personal',
          aiStaff: 'Brook R.',
          automationLevel: 'semi',
        },
        {
          id: 'relationship_rebuilding',
          name: 'Relationship Rebuilding',
          description:
            'Rebuild trust through consistent service delivery and proactive communication',
          timing: 'Day 19-25',
          channel: 'Multi-Channel',
          aiStaff: 'Shanell',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '75+ recovery opportunities identified and contacted',
        '30+ businesses converted from negative freight experiences',
        '$180K+ annual revenue from recovered relationships',
        '90%+ client retention rate in first 6 months',
        '95%+ positive feedback on service recovery',
      ],
    },
    {
      id: 'referral_network_acceleration',
      name: 'Referral Network Acceleration Blitz',
      description:
        'Leverage existing satisfied customers to generate high-quality referrals and expand network rapidly',
      category: 'referral_focus',
      targetAudience:
        'Existing satisfied customers and their professional networks',
      expectedResults: {
        leads: 110,
        conversions: 44,
        revenue: 330000,
      },
      duration: '40 days',
      difficulty: 'easy',
      aiStaff: ['Carrie R.', 'Brook R.', 'Will'],
      channels: ['Phone', 'Email', 'Networking Events'],
      icon: '🤝',
      color: 'bg-indigo-500',
      steps: [
        {
          id: 'satisfied_customer_identification',
          name: 'Satisfied Customer Identification',
          description:
            'Identify top-performing customers with high satisfaction scores',
          timing: 'Day 1-8',
          channel: 'Data Analysis',
          aiStaff: 'Carrie R.',
          automationLevel: 'full',
        },
        {
          id: 'referral_program_launch',
          name: 'Referral Program Launch',
          description:
            'Launch structured referral program with incentives and easy sharing mechanisms',
          timing: 'Day 9-18',
          channel: 'Email/Phone',
          aiStaff: 'Brook R.',
          automationLevel: 'semi',
        },
        {
          id: 'network_expansion_outreach',
          name: 'Network Expansion Outreach',
          description:
            'Leverage customer networks through introductions and professional connections',
          timing: 'Day 19-30',
          channel: 'Phone/Networking',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'referral_relationship_conversion',
          name: 'Referral Relationship Conversion',
          description:
            'Convert warm referrals into long-term freight partnerships',
          timing: 'Day 31-40',
          channel: 'Multi-Channel',
          aiStaff: 'Carrie R.',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '110+ referral leads generated from existing customers',
        '44+ new clients acquired through referral network',
        '$330K+ annual revenue from referral-driven business',
        '85%+ conversion rate from referrals to clients',
        '90%+ referral source satisfaction and participation',
      ],
    },
    {
      id: 'food_beverage_supply_chain',
      name: 'Food & Beverage Supply Chain Blitz',
      description:
        'Target food manufacturers, distributors, and restaurants with temperature-controlled and time-critical freight',
      category: 'industry_specific',
      targetAudience:
        'Food manufacturers, beverage producers, restaurants, and grocery chains',
      expectedResults: {
        leads: 90,
        conversions: 27,
        revenue: 203000,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Logan', 'Desiree', 'Kameelah'],
      channels: ['Phone', 'Email', 'Industry Trade Shows'],
      icon: '🍕',
      color: 'bg-yellow-500',
      steps: [
        {
          id: 'food_industry_prospecting',
          name: 'Food Industry Prospecting',
          description:
            'Identify food and beverage businesses with distribution needs',
          timing: 'Day 1-7',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'temperature_control_specialization',
          name: 'Temperature Control Specialization',
          description:
            'Highlight refrigerated and frozen freight capabilities and certifications',
          timing: 'Day 8-15',
          channel: 'Email/Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'food_safety_compliance',
          name: 'Food Safety Compliance',
          description:
            'Present HACCP compliance, food-grade transportation, and quality assurance',
          timing: 'Day 16-23',
          channel: 'Phone/Industry Events',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'restaurant_distribution_network',
          name: 'Restaurant Distribution Network',
          description:
            'Build comprehensive distribution network for restaurants and food service',
          timing: 'Day 24-30',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '90+ food and beverage businesses identified and contacted',
        '27+ food industry clients onboarded with specialized service',
        '$203K+ annual revenue from food/beverage freight',
        '100% compliance with food safety regulations',
        '98%+ on-time delivery for perishable goods',
      ],
    },

    // VERTICAL-SPECIFIC MANUFACTURER CAMPAIGNS
    {
      id: 'food_beverage_manufacturer_targeting',
      name: 'Food & Beverage Manufacturer Initiative',
      description:
        'Target food/beverage manufacturers with temperature-controlled and time-sensitive logistics',
      category: 'lead_generation',
      targetAudience:
        'Food/beverage manufacturers with refrigerated/frozen product shipping needs',
      expectedResults: {
        leads: 85,
        conversions: 26,
        revenue: 325000,
      },
      duration: '35 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Logan', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🍕',
      color: 'bg-orange-400',
      steps: [
        {
          id: 'fda_compliance_focus',
          name: 'FDA Compliance & Cold Chain Focus',
          description:
            'Target manufacturers with FDA compliance and cold chain shipping requirements',
          timing: 'Day 1-7',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'temperature_controlled_outreach',
          name: 'Temperature-Controlled Logistics Pitch',
          description:
            'Specialized outreach for refrigerated and frozen product transportation',
          timing: 'Day 8-14',
          channel: 'Email/Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'food_safety_certification_emphasis',
          name: 'Food Safety & Certification Emphasis',
          description:
            'Highlight HACCP, SQF, and other food safety certifications',
          timing: 'Day 15-25',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'seasonal_capacity_planning',
          name: 'Seasonal Capacity Planning',
          description:
            'Address peak season capacity needs and contingency planning',
          timing: 'Day 26-35',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '85+ food/beverage manufacturer leads',
        '26+ specialized logistics contracts',
        '$325K+ revenue from food industry',
        '90%+ cold chain compliance guarantee',
      ],
    },

    {
      id: 'wholesaler_distribution_network',
      name: 'Wholesaler Distribution Network',
      description:
        'Target wholesalers and distributors with complex multi-location shipping needs',
      category: 'lead_generation',
      targetAudience:
        'Wholesale distributors with regional/national distribution networks',
      expectedResults: {
        leads: 95,
        conversions: 29,
        revenue: 290000,
      },
      duration: '40 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Will', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '📦',
      color: 'bg-purple-500',
      steps: [
        {
          id: 'distribution_network_analysis',
          name: 'Distribution Network Analysis',
          description:
            'Map out wholesaler distribution networks and shipping patterns',
          timing: 'Day 1-10',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'multi_location_logistics_pitch',
          name: 'Multi-Location Logistics Pitch',
          description: 'Present solutions for complex distribution networks',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'cost_optimization_focus',
          name: 'Cost Optimization Focus',
          description:
            'Demonstrate freight cost reduction and efficiency improvements',
          timing: 'Day 21-30',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'route_optimization_proposals',
          name: 'Route Optimization Proposals',
          description:
            'Custom proposals with optimized routing and consolidation',
          timing: 'Day 31-40',
          channel: 'Multi-Channel',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '95+ wholesaler/distributor leads',
        '29+ distribution network contracts',
        '$290K+ revenue from wholesale sector',
        '25%+ average freight cost reduction',
      ],
    },

    {
      id: 'warehouse_3pl_targeting',
      name: 'Warehouse & 3PL Provider Initiative',
      description:
        'Target warehouses and 3PL providers needing carrier network expansion',
      category: 'lead_generation',
      targetAudience:
        'Warehouses and 3PL providers seeking carrier network expansion',
      expectedResults: {
        leads: 65,
        conversions: 20,
        revenue: 400000,
      },
      duration: '45 days',
      difficulty: 'hard',
      aiStaff: ['Desiree', 'Brook R.', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn', 'In-Person'],
      icon: '🏭',
      color: 'bg-cyan-500',
      steps: [
        {
          id: '3pl_capacity_analysis',
          name: '3PL Capacity Analysis',
          description:
            'Analyze warehouse and 3PL capacity utilization and carrier needs',
          timing: 'Day 1-10',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'carrier_network_expansion_pitch',
          name: 'Carrier Network Expansion Pitch',
          description:
            'Present carrier network expansion and capacity solutions',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Brook R.',
          automationLevel: 'semi',
        },
        {
          id: 'warehouse_integration_focus',
          name: 'Warehouse Integration Focus',
          description: 'Emphasize seamless warehouse-to-carrier integration',
          timing: 'Day 21-30',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'executive_relationship_building',
          name: 'Executive Relationship Building',
          description:
            'Build relationships with 3PL executives and decision-makers',
          timing: 'Day 31-45',
          channel: 'Phone/In-Person',
          aiStaff: 'Brook R.',
          automationLevel: 'manual',
        },
      ],
      successMetrics: [
        '65+ warehouse/3PL provider leads',
        '20+ carrier network expansion contracts',
        '$400K+ revenue from 3PL partnerships',
        '30+ new carrier relationships established',
      ],
    },

    {
      id: 'retail_chain_logistics',
      name: 'Retail Chain Logistics Initiative',
      description:
        'Target retail chains with store replenishment and distribution center needs',
      category: 'lead_generation',
      targetAudience:
        'Retail chains with multi-store replenishment and DC shipping needs',
      expectedResults: {
        leads: 75,
        conversions: 23,
        revenue: 345000,
      },
      duration: '38 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Will', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🛒',
      color: 'bg-pink-500',
      steps: [
        {
          id: 'retail_distribution_analysis',
          name: 'Retail Distribution Analysis',
          description:
            'Analyze retail chain distribution networks and store replenishment patterns',
          timing: 'Day 1-8',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'store_replenishment_pitch',
          name: 'Store Replenishment Pitch',
          description:
            'Present solutions for efficient store replenishment logistics',
          timing: 'Day 9-18',
          channel: 'Email/Phone',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'peak_season_capacity_planning',
          name: 'Peak Season Capacity Planning',
          description: 'Address holiday and peak season capacity challenges',
          timing: 'Day 19-28',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'retail_logistics_optimization',
          name: 'Retail Logistics Optimization',
          description:
            'Custom proposals for retail-specific logistics optimization',
          timing: 'Day 29-38',
          channel: 'Multi-Channel',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '75+ retail chain leads',
        '23+ store replenishment contracts',
        '$345K+ revenue from retail sector',
        '20%+ faster store replenishment times',
      ],
    },

    {
      id: 'construction_materials_targeting',
      name: 'Construction Materials Initiative',
      description:
        'Target construction companies with heavy equipment and materials shipping',
      category: 'lead_generation',
      targetAudience:
        'Construction companies with heavy equipment and materials transportation needs',
      expectedResults: {
        leads: 70,
        conversions: 21,
        revenue: 315000,
      },
      duration: '42 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Logan', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🏢',
      color: 'bg-yellow-600',
      steps: [
        {
          id: 'construction_project_analysis',
          name: 'Construction Project Analysis',
          description:
            'Identify construction projects and equipment/materials shipping needs',
          timing: 'Day 1-10',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'heavy_equipment_transport',
          name: 'Heavy Equipment Transport Focus',
          description:
            'Specialized outreach for heavy equipment and oversized loads',
          timing: 'Day 11-21',
          channel: 'Email/Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'project_timeline_optimization',
          name: 'Project Timeline Optimization',
          description:
            'Address construction project timelines and material delivery deadlines',
          timing: 'Day 22-32',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'construction_logistics_proposals',
          name: 'Construction Logistics Proposals',
          description:
            'Custom proposals for construction-specific logistics needs',
          timing: 'Day 33-42',
          channel: 'Multi-Channel',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '70+ construction company leads',
        '21+ heavy equipment transport contracts',
        '$315K+ revenue from construction sector',
        '95%+ on-time material delivery rate',
      ],
    },

    {
      id: 'healthcare_medical_supplies',
      name: 'Healthcare & Medical Supplies Initiative',
      description:
        'Target healthcare facilities and medical suppliers with specialized shipping requirements',
      category: 'lead_generation',
      targetAudience:
        'Healthcare facilities and medical suppliers with urgent/critical shipping needs',
      expectedResults: {
        leads: 55,
        conversions: 17,
        revenue: 255000,
      },
      duration: '35 days',
      difficulty: 'hard',
      aiStaff: ['Desiree', 'Kameelah', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🏥',
      color: 'bg-red-600',
      steps: [
        {
          id: 'healthcare_facility_identification',
          name: 'Healthcare Facility Identification',
          description:
            'Identify hospitals, clinics, and healthcare facilities with shipping needs',
          timing: 'Day 1-8',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'medical_supplies_compliance',
          name: 'Medical Supplies Compliance Focus',
          description:
            'Emphasize FDA compliance and specialized medical shipping requirements',
          timing: 'Day 9-18',
          channel: 'Email/Phone',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'urgent_delivery_capabilities',
          name: 'Urgent Delivery Capabilities',
          description:
            'Highlight emergency and time-critical delivery capabilities',
          timing: 'Day 19-26',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'healthcare_logistics_partnerships',
          name: 'Healthcare Logistics Partnerships',
          description: 'Build long-term partnerships with healthcare providers',
          timing: 'Day 27-35',
          channel: 'Multi-Channel',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '55+ healthcare facility leads',
        '17+ medical logistics contracts',
        '$255K+ revenue from healthcare sector',
        '100% compliance with medical shipping regulations',
      ],
    },

    {
      id: 'ecommerce_fulfillment_targeting',
      name: 'E-Commerce Fulfillment Initiative',
      description:
        'Target e-commerce businesses with last-mile delivery and fulfillment needs',
      category: 'lead_generation',
      targetAudience:
        'E-commerce businesses with order fulfillment and last-mile delivery challenges',
      expectedResults: {
        leads: 90,
        conversions: 27,
        revenue: 270000,
      },
      duration: '32 days',
      difficulty: 'easy',
      aiStaff: ['Desiree', 'Miles', 'Gary'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🛒',
      color: 'bg-indigo-500',
      steps: [
        {
          id: 'ecommerce_platform_analysis',
          name: 'E-Commerce Platform Analysis',
          description:
            'Identify e-commerce businesses and their fulfillment challenges',
          timing: 'Day 1-6',
          channel: 'Data Analysis',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'last_mile_delivery_pitch',
          name: 'Last-Mile Delivery Pitch',
          description:
            'Present solutions for efficient last-mile delivery and customer satisfaction',
          timing: 'Day 7-16',
          channel: 'Email/Phone',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'peak_season_capacity_planning',
          name: 'Peak Season Capacity Planning',
          description:
            'Address holiday and peak season fulfillment capacity needs',
          timing: 'Day 17-24',
          channel: 'LinkedIn/Email',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
        {
          id: 'ecommerce_integration_solutions',
          name: 'E-Commerce Integration Solutions',
          description: 'Custom proposals with e-commerce platform integration',
          timing: 'Day 25-32',
          channel: 'Multi-Channel',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '90+ e-commerce business leads',
        '27+ fulfillment partnerships',
        '$270K+ revenue from e-commerce sector',
        '25%+ improvement in delivery times',
      ],
    },

    // RETENTION CAMPAIGNS
    {
      id: 'client_loyalty_acceleration',
      name: 'Client Loyalty Acceleration',
      description:
        'Strengthen relationships with existing clients through proactive engagement',
      category: 'retention',
      targetAudience: 'Current clients with 6+ months relationship',
      expectedResults: {
        leads: 0,
        conversions: 0,
        revenue: 300000,
      },
      duration: '90 days',
      difficulty: 'easy',
      aiStaff: ['Shanell', 'Gary', 'Brook R.'],
      channels: ['Email', 'Phone', 'Survey', 'Newsletter'],
      icon: '💎',
      color: 'bg-teal-500',
      steps: [
        {
          id: 'satisfaction_assessment',
          name: 'Client Satisfaction Assessment',
          description:
            'Survey clients to identify satisfaction levels and improvement areas',
          timing: 'Day 1-7',
          channel: 'Email/Survey',
          aiStaff: 'Shanell',
          automationLevel: 'full',
        },
        {
          id: 'proactive_value_delivery',
          name: 'Proactive Value Delivery',
          description:
            'Provide additional services and optimization recommendations',
          timing: 'Day 8-60',
          channel: 'Email/Phone',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'relationship_strengthening',
          name: 'Relationship Strengthening',
          description: 'Regular check-ins and personalized communications',
          timing: 'Ongoing',
          channel: 'Multi-Channel',
          aiStaff: 'Brook R.',
          automationLevel: 'semi',
        },
        {
          id: 'expansion_opportunity_identification',
          name: 'Expansion Opportunity Identification',
          description: 'Identify and pursue additional service opportunities',
          timing: 'Day 30-90',
          channel: 'Phone/Email',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '$300K+ additional revenue from expansions',
        '95%+ client retention rate',
        '25+ expansion opportunities identified',
        'NPS score improvement of 15+ points',
      ],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Campaigns', icon: Target },
    { id: 'lead_generation', name: 'Lead Generation', icon: Users },
    { id: 'follow_up', name: 'Follow-Up', icon: Mail },
    { id: 'nurture', name: 'Nurture', icon: TrendingUp },
    { id: 'conversion', name: 'Conversion', icon: DollarSign },
    { id: 'retention', name: 'Retention', icon: CheckCircle },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? campaignTemplates
      : campaignTemplates.filter(
          (template) => template.category === selectedCategory
        );

  const launchCampaign = (template: CampaignTemplate) => {
    const newCampaign: CampaignInstance = {
      id: `campaign_${Date.now()}`,
      templateId: template.id,
      name: template.name,
      status: 'active',
      startDate: new Date().toISOString(),
      progress: 0,
      results: {
        leads: 0,
        conversions: 0,
        revenue: 0,
      },
    };

    setActiveCampaigns([...activeCampaigns, newCampaign]);
    // Here you would integrate with your campaign management system
    alert(`🚀 Campaign "${template.name}" launched successfully!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '4px',
              }}
            >
              🎯 Campaign Templates
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '1rem',
              }}
            >
              Pre-configured campaign strategies powered by DEPOINTE AI staff
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#22c55e',
              }}
            >
              {filteredTemplates.length} Templates Available
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                cursor: 'pointer',
                background:
                  selectedCategory === category.id
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  selectedCategory === category.id
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                color:
                  selectedCategory === category.id
                    ? '#3b82f6'
                    : 'rgba(255, 255, 255, 0.7)',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <category.icon style={{ width: '16px', height: '16px' }} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            🎯 Active Campaigns
          </h3>
          <div className='space-y-3'>
            {activeCampaigns.map((campaign) => {
              const template = campaignTemplates.find(
                (t) => t.id === campaign.templateId
              );
              return (
                <div
                  key={campaign.id}
                  className='flex items-center justify-between rounded-lg bg-gray-50 p-4'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>{template?.icon}</span>
                    <div>
                      <h4 className='font-medium text-gray-900'>
                        {campaign.name}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Started{' '}
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <div className='text-sm text-gray-600'>Progress</div>
                      <div className='font-medium'>{campaign.progress}%</div>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaign Templates Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Template Header */}
            <div
              style={{
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    padding: '8px',
                    background: template.color.includes('bg-')
                      ? template.color.includes('red')
                        ? '#dc2626'
                        : template.color.includes('green')
                          ? '#16a34a'
                          : template.color.includes('blue')
                            ? '#2563eb'
                            : template.color.includes('purple')
                              ? '#9333ea'
                              : template.color.includes('yellow')
                                ? '#ca8a04'
                                : template.color.includes('indigo')
                                  ? '#4f46e5'
                                  : '#6b7280'
                      : template.color,
                    color: 'white',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{template.icon}</span>
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: '600',
                      color: 'white',
                      fontSize: '1rem',
                      marginBottom: '4px',
                    }}
                  >
                    {template.name}
                  </h3>
                  <div
                    style={{
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background:
                          template.difficulty === 'easy'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : template.difficulty === 'medium'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                        color:
                          template.difficulty === 'easy'
                            ? '#22c55e'
                            : template.difficulty === 'medium'
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    >
                      {template.difficulty}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {template.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                marginBottom: '16px',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.4',
              }}
            >
              {template.description}
            </p>

            {/* Target Audience */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Target
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Target Audience
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {template.targetAudience}
              </p>
            </div>

            {/* Expected Results */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <TrendingUp
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Expected Results
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'white',
                    }}
                  >
                    {template.expectedResults.leads}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Leads
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'white',
                    }}
                  >
                    {template.expectedResults.conversions}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Conversions
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#22c55e',
                    }}
                  >
                    ${(template.expectedResults.revenue / 1000).toFixed(0)}K
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Revenue
                  </div>
                </div>
              </div>
            </div>

            {/* AI Staff */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Users
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  AI Staff Assigned
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {template.aiStaff.map((staff, index) => (
                  <span
                    key={index}
                    style={{
                      borderRadius: '4px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      color: '#3b82f6',
                      fontWeight: '600',
                    }}
                  >
                    {staff}
                  </span>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Success Metrics
                </span>
              </div>
              <ul
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                {template.successMetrics.slice(0, 2).map((metric, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <span style={{ color: '#22c55e' }}>•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedTemplate(template)}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                View Details
              </button>
              <button
                onClick={() => launchCampaign(template)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  border: 'none',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                }}
              >
                <Play style={{ width: '16px', height: '16px' }} />
                <span>Launch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '16px',
          }}
        >
          <div
            style={{
              maxHeight: '90vh',
              width: '100%',
              maxWidth: '1024px',
              overflowY: 'auto',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ padding: '24px' }}>
              {/* Modal Header */}
              <div
                style={{
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      background: selectedTemplate.color.includes('bg-')
                        ? selectedTemplate.color.includes('red')
                          ? '#dc2626'
                          : selectedTemplate.color.includes('green')
                            ? '#16a34a'
                            : selectedTemplate.color.includes('blue')
                              ? '#2563eb'
                              : selectedTemplate.color.includes('purple')
                                ? '#9333ea'
                                : selectedTemplate.color.includes('yellow')
                                  ? '#ca8a04'
                                  : selectedTemplate.color.includes('indigo')
                                    ? '#4f46e5'
                                    : '#6b7280'
                        : selectedTemplate.color,
                      color: 'white',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>
                      {selectedTemplate.icon}
                    </span>
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {selectedTemplate.name}
                    </h2>
                    <p
                      style={{
                        marginTop: '4px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    padding: '4px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Campaign Overview */}
              <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='mb-2 flex items-center space-x-2'>
                    <Clock className='h-5 w-5 text-gray-600' />
                    <span className='font-medium text-gray-900'>Duration</span>
                  </div>
                  <p className='text-gray-600'>{selectedTemplate.duration}</p>
                </div>

                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='mb-2 flex items-center space-x-2'>
                    <Users className='h-5 w-5 text-gray-600' />
                    <span className='font-medium text-gray-900'>AI Staff</span>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {selectedTemplate.aiStaff.map((staff, index) => (
                      <span
                        key={index}
                        className='rounded bg-blue-100 px-2 py-1 text-sm text-blue-700'
                      >
                        {staff}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='mb-2 flex items-center space-x-2'>
                    <DollarSign className='h-5 w-5 text-gray-600' />
                    <span className='font-medium text-gray-900'>
                      Expected Revenue
                    </span>
                  </div>
                  <p className='text-2xl font-bold text-green-600'>
                    $
                    {(selectedTemplate.expectedResults.revenue / 1000).toFixed(
                      0
                    )}
                    K
                  </p>
                </div>
              </div>

              {/* Campaign Steps */}
              <div className='mb-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  Campaign Steps
                </h3>
                <div className='space-y-4'>
                  {selectedTemplate.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className='flex items-start space-x-4 rounded-lg bg-gray-50 p-4'
                    >
                      <div className='flex-shrink-0'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white'>
                          {index + 1}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <div className='mb-1 flex items-center space-x-2'>
                          <h4 className='font-medium text-gray-900'>
                            {step.name}
                          </h4>
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              step.automationLevel === 'full'
                                ? 'bg-green-100 text-green-800'
                                : step.automationLevel === 'semi'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {step.automationLevel}
                          </span>
                        </div>
                        <p className='mb-2 text-sm text-gray-600'>
                          {step.description}
                        </p>
                        <div className='flex items-center space-x-4 text-xs text-gray-500'>
                          <span className='flex items-center space-x-1'>
                            <Calendar className='h-3 w-3' />
                            <span>{step.timing}</span>
                          </span>
                          <span className='flex items-center space-x-1'>
                            <MessageSquare className='h-3 w-3' />
                            <span>{step.channel}</span>
                          </span>
                          {step.aiStaff && (
                            <span className='flex items-center space-x-1'>
                              <Users className='h-3 w-3' />
                              <span>{step.aiStaff}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className='mb-6'>
                <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                  Success Metrics
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {selectedTemplate.successMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-2 rounded-lg bg-green-50 p-3'
                    >
                      <CheckCircle className='h-5 w-5 text-green-600' />
                      <span className='text-sm text-gray-900'>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-3 border-t border-gray-200 pt-6'>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className='px-4 py-2 text-gray-600 transition-colors hover:text-gray-800'
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    launchCampaign(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  className='flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
                >
                  <Play className='h-4 w-4' />
                  <span>Launch Campaign</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
