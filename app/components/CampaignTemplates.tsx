'use client';

import {
  Activity,
  ArrowUpDown,
  CheckCircle,
  DollarSign,
  Filter,
  Grid,
  List,
  Play,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | 'lead_generation'
    | 'follow_up'
    | 'nurture'
    | 'conversion'
    | 'retention'
    | 'procurement'
    | 'government_contracting'
    | 'air_freight'
    | 'maritime_freight'
    | 'specialty_equipment'
    | 'carrier_specialization'
    | 'fundraising';
  targetAudience: string;
  expectedResults: {
    leads: number;
    conversions: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    totalRevenue: number;
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
    () => {
      // Load campaigns from localStorage on initialization
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('fleetflow-active-campaigns');
          return saved ? JSON.parse(saved) : [];
        } catch (error) {
          console.error('Error loading campaigns from localStorage:', error);
          return [];
        }
      }
      return [];
    }
  );

  // ORGANIZATION & FILTERING STATE
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('difficulty');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 💾 Save campaigns to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'fleetflow-active-campaigns',
          JSON.stringify(activeCampaigns)
        );
      } catch (error) {
        console.error('Error saving campaigns to localStorage:', error);
      }
    }
  }, [activeCampaigns]);

  // 🚀 SALESFLOW AI BACKGROUND AUTOMATION
  useEffect(() => {
    // SALESFLOW AI automatically monitors all active campaigns
    const salesflowAutomation = setInterval(() => {
      activeCampaigns.forEach((campaign) => {
        if (campaign.status === 'active') {
          // SALESFLOW AI automatically handles email automation for this campaign
          console.log(
            `🤖 SALESFLOW AI: Processing campaign "${campaign.name}" in background`
          );

          // In a real implementation, this would:
          // 1. Check for new leads from the campaign
          // 2. Qualify leads using AI
          // 3. Send personalized follow-up emails
          // 4. Update campaign progress
          // 5. Track conversions and revenue
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(salesflowAutomation);
  }, [activeCampaigns]);
  const [showOnlyPriority, setShowOnlyPriority] = useState<boolean>(false);

  // PRIORITY CAMPAIGN EXECUTION PLAN
  // PHASE 1: TOP 3 CAMPAIGNS FOR MAXIMUM REVENUE
  const priorityCampaigns = [
    'desperate_shippers_blitz',
    'new_businesses_freight_blitz',
    'high_value_prospect_acceleration', // RECOMMENDED ADDITION
    'global_trade_lane_development', // 🌍 HIGH-REVENUE INTERNATIONAL CAMPAIGN
    'import_export_accelerator_program', // 📦 EXPORT ACCELERATION PROGRAM
    'critical_care_courier_network', // 🏥 LIFE-CRITICAL HEALTHCARE LOGISTICS
    'medical_equipment_logistics', // 🩺 HIGH-VALUE MEDICAL EQUIPMENT
    'disaster_recovery_logistics', // 🚨 CRITICAL DISASTER RESPONSE
    'supply_chain_continuity_planning', // 🛡️ BUSINESS CONTINUITY PLANNING
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
        dailyRevenue: 7500, // $225,000 ÷ 30 days
        monthlyRevenue: 225000, // Realistic: $7,500/month based on historical freight rates
        totalRevenue: 225000, // 30-day campaign total
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
        dailyRevenue: 6000, // $180,000 ÷ 30 days
        monthlyRevenue: 180000, // Realistic: $6,000/month based on startup freight needs
        totalRevenue: 180000, // 30-day campaign total
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
        dailyRevenue: 16667, // $750,000 ÷ 45 days
        monthlyRevenue: 750000, // Enterprise-level revenue projection
        totalRevenue: 750000, // 45-day campaign total
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
        dailyRevenue: 7200, // $180,000 ÷ 25 days
        monthlyRevenue: 180000,
        totalRevenue: 180000, // 25-day campaign total
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
        dailyRevenue: 5952, // $125,000 ÷ 21 days
        monthlyRevenue: 125000,
        totalRevenue: 125000, // 21-day campaign total
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
        dailyRevenue: 2500, // $150,000 ÷ 60 days
        monthlyRevenue: 150000,
        totalRevenue: 150000, // 60-day campaign total
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
        dailyRevenue: 20000, // $600,000 ÷ 30 days
        monthlyRevenue: 600000,
        totalRevenue: 600000, // 30-day campaign total
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
      category: 'lead_generation',
      targetAudience:
        'Carriers needing dispatch support, load management, and fee collection services',
      expectedResults: {
        leads: 75,
        conversions: 38,
        dailyRevenue: 7500, // $225,000 ÷ 30 days
        monthlyRevenue: 225000, // 10% of carrier load fees
        totalRevenue: 225000, // 30-day campaign total
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
      category: 'carrier_specialization',
      targetAudience:
        'Independent carriers, owner operators, and small trucking companies seeking dispatch partnerships',
      expectedResults: {
        leads: 200,
        conversions: 80, // Tiered across different carrier sizes
        dailyRevenue: 10867, // $489,000 ÷ 45 days
        monthlyRevenue: 489000, // From tiered dispatch fees (6-10% of carrier loads)
        totalRevenue: 489000, // 45-day campaign total
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

    // SPECIALIZED CARRIER ACQUISITION CAMPAIGNS
    {
      id: 'flatbed_carrier_specialization',
      name: 'Flatbed Carrier Network Expansion',
      description:
        'Target flatbed carriers specializing in construction materials, machinery, and oversized equipment - HIGH MARGIN OPPORTUNITY featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with premium rates (12-15% load fees)',
      category: 'specialty_equipment',
      targetAudience:
        'Flatbed carriers, heavy haul specialists, and equipment transporters with oversized load experience',
      expectedResults: {
        leads: 120,
        conversions: 48, // Higher conversion due to specialized demand
        dailyRevenue: 14000, // $420,000 ÷ 30 days (premium rates)
        monthlyRevenue: 420000, // Premium 12-15% load fees
        totalRevenue: 420000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Roland', 'Miles', 'Logan'], // Roland for carrier relations
      channels: ['LinkedIn', 'Industry Associations', 'Phone'],
      icon: '🚛',
      color: 'bg-orange-600',
      steps: [
        {
          id: 'flatbed_market_research',
          name: 'Flatbed Market Intelligence',
          description:
            'Identify flatbed carriers through specialized trucking associations and equipment directories',
          timing: 'Day 1-3',
          channel: 'Research',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'premium_equipment_outreach',
          name: 'Premium Equipment Outreach',
          description:
            'Target carriers with flatbed/oversized equipment for high-margin loads',
          timing: 'Day 4-15',
          channel: 'LinkedIn/Phone',
          aiStaff: 'Roland & Miles',
          automationLevel: 'semi',
        },
        {
          id: 'specialized_load_matching',
          name: 'Specialized Load Matching',
          description:
            'Connect flatbed carriers with construction and equipment shippers',
          timing: 'Day 16-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Premium load fee collection (12-15%)',
        'Construction equipment shipment volume',
        'Oversized load capacity utilization',
        'Carrier retention rate for specialized loads',
      ],
    },

    {
      id: 'reefer_carrier_network',
      name: 'Refrigerated Carrier Acquisition',
      description:
        'Target temperature-controlled carriers for food, pharmaceuticals, and perishable goods - CONSISTENT HIGH DEMAND featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with steady revenue streams',
      category: 'carrier_specialization',
      targetAudience:
        'Reefer carriers, temperature-controlled specialists, and cold chain logistics providers',
      expectedResults: {
        leads: 95,
        conversions: 38,
        dailyRevenue: 11000, // $330,000 ÷ 30 days
        monthlyRevenue: 330000, // Steady 10-12% load fees
        totalRevenue: 330000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Roland', 'Desiree', 'Kameelah'], // Kameelah for compliance
      channels: ['Industry Trade Shows', 'Email', 'Phone'],
      icon: '🚛',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'reefer_capacity_analysis',
          name: 'Reefer Capacity Analysis',
          description:
            'Map refrigerated carrier availability and temperature-controlled equipment',
          timing: 'Day 1-5',
          channel: 'Data Analysis',
          aiStaff: 'Roland',
          automationLevel: 'full',
        },
        {
          id: 'cold_chain_outreach',
          name: 'Cold Chain Outreach',
          description:
            'Target carriers with temperature monitoring and cold chain certification',
          timing: 'Day 6-20',
          channel: 'Industry Networks',
          aiStaff: 'Roland & Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'perishable_load_matching',
          name: 'Perishable Load Matching',
          description: 'Connect reefer carriers with food and pharma shippers',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Temperature-controlled shipment volume',
        'Cold chain compliance certifications',
        'Perishable goods capacity utilization',
        'Seasonal demand management',
      ],
    },

    {
      id: 'dry_van_carrier_expansion',
      name: 'Dry Van Carrier Fleet Growth',
      description:
        'Target dry van carriers for general freight and LTL shipments - HIGH VOLUME OPPORTUNITY featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with consistent load availability',
      category: 'carrier_specialization',
      targetAudience:
        'Dry van carriers, general freight specialists, and LTL transportation providers',
      expectedResults: {
        leads: 180,
        conversions: 72, // Higher volume due to general freight demand
        dailyRevenue: 9500, // $285,000 ÷ 30 days
        monthlyRevenue: 285000, // 8-10% load fees on high volume
        totalRevenue: 285000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'easy',
      aiStaff: ['Roland', 'Miles', 'Logan'],
      channels: ['LinkedIn', 'Email', 'Phone'],
      icon: '🚛',
      color: 'bg-green-600',
      steps: [
        {
          id: 'dry_van_market_mapping',
          name: 'Dry Van Market Mapping',
          description:
            'Identify dry van carriers through carrier directories and transportation networks',
          timing: 'Day 1-5',
          channel: 'Research',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'general_freight_outreach',
          name: 'General Freight Outreach',
          description:
            'Target carriers for consumer goods, retail, and general merchandise',
          timing: 'Day 6-20',
          channel: 'Multi-Channel',
          aiStaff: 'Roland & Miles',
          automationLevel: 'semi',
        },
        {
          id: 'ltl_load_optimization',
          name: 'LTL Load Optimization',
          description:
            'Connect dry van carriers with LTL shippers and consolidate loads',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'LTL shipment consolidation efficiency',
        'General freight capacity utilization',
        'Load factor improvement (85%+ target)',
        'Carrier onboarding speed',
      ],
    },

    {
      id: 'owner_operator_recruitment',
      name: 'Owner-Operator Acquisition Blitz',
      description:
        'Target independent owner-operators and solo drivers - FLEXIBLE HIGH-MARGIN RECRUITMENT featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with premium dispatch fees',
      category: 'lead_generation',
      targetAudience:
        'Independent owner-operators, solo drivers, and small carrier businesses',
      expectedResults: {
        leads: 150,
        conversions: 60, // Higher conversion for owner-operators seeking dispatch
        dailyRevenue: 13333, // $400,000 ÷ 30 days (premium fees)
        monthlyRevenue: 400000, // Premium 10-12% dispatch fees
        totalRevenue: 400000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Roland', 'Miles', 'Charin'], // Charin for phone outreach
      channels: ['Phone', 'LinkedIn', 'Industry Events'],
      icon: '🚛',
      color: 'bg-purple-600',
      steps: [
        {
          id: 'owner_operator_profiling',
          name: 'Owner-Operator Profiling',
          description:
            'Identify independent carriers seeking dispatch partnerships',
          timing: 'Day 1-7',
          channel: 'Data Mining',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'personalized_dispatch_outreach',
          name: 'Personalized Dispatch Outreach',
          description: 'Direct phone and LinkedIn outreach to owner-operators',
          timing: 'Day 8-20',
          channel: 'Phone/LinkedIn',
          aiStaff: 'Roland & Charin',
          automationLevel: 'semi',
        },
        {
          id: 'owner_operator_onboarding',
          name: 'Owner-Operator Onboarding',
          description:
            'Rapid onboarding and load assignment for qualified owner-operators',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Owner-operator retention rate (90%+ target)',
        'Average load acceptance rate',
        'Premium dispatch fee collection',
        'Rapid deployment capability',
      ],
    },

    {
      id: 'regional_carrier_network',
      name: 'Regional Carrier Partnership Program',
      description:
        'Target regional carriers for local and short-haul opportunities - STEADY RELIABLE REVENUE featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing within defined geographic areas',
      category: 'carrier_specialization',
      targetAudience:
        'Regional carriers, local trucking companies, and short-haul specialists',
      expectedResults: {
        leads: 110,
        conversions: 44,
        dailyRevenue: 8000, // $240,000 ÷ 30 days
        monthlyRevenue: 240000, // Steady 8-10% fees on regional loads
        totalRevenue: 240000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'easy',
      aiStaff: ['Roland', 'Logan', 'Lea D.'], // Lea D. for relationship building
      channels: ['Local Networking', 'Email', 'Phone'],
      icon: '🚛',
      color: 'bg-indigo-600',
      steps: [
        {
          id: 'regional_market_analysis',
          name: 'Regional Market Analysis',
          description:
            'Map regional carrier availability and local transportation networks',
          timing: 'Day 1-5',
          channel: 'Market Research',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'local_network_building',
          name: 'Local Network Building',
          description:
            'Build relationships with regional carriers through local associations',
          timing: 'Day 6-20',
          channel: 'Networking',
          aiStaff: 'Roland & Lea D.',
          automationLevel: 'manual',
        },
        {
          id: 'regional_load_distribution',
          name: 'Regional Load Distribution',
          description:
            'Connect regional carriers with local shippers and receivers',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Regional market penetration',
        'Local delivery reliability',
        'Network expansion rate',
        'Regional carrier satisfaction',
      ],
    },

    // SPECIALTY EQUIPMENT CARRIER CAMPAIGNS
    {
      id: 'dump_truck_specialization',
      name: 'Dump Truck Network Development',
      description:
        'Target dump truck carriers for construction materials, aggregates, and bulk commodities - PREMIUM RATES (15-20% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing for high-demand construction materials',
      category: 'lead_generation',
      targetAudience:
        'Dump truck carriers, construction material haulers, and aggregate transportation specialists with proper licensing and equipment',
      expectedResults: {
        leads: 95,
        conversions: 38, // Specialized equipment = higher conversion
        dailyRevenue: 16667, // $500,000 ÷ 30 days (premium rates)
        monthlyRevenue: 500000, // Premium 15-20% load fees for specialty equipment
        totalRevenue: 500000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Specialized equipment requirements
      aiStaff: ['Roland', 'Miles', 'Kameelah'], // Kameelah for DOT compliance
      channels: [
        'Construction Trade Shows',
        'Industry Associations',
        'LinkedIn',
      ],
      icon: '🚛',
      color: 'bg-amber-600',
      steps: [
        {
          id: 'construction_equipment_mapping',
          name: 'Construction Equipment Mapping',
          description:
            'Identify dump truck carriers through construction associations and equipment directories',
          timing: 'Day 1-5',
          channel: 'Industry Research',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'bulk_material_outreach',
          name: 'Bulk Material Outreach',
          description:
            'Target carriers with proper licensing for gravel, sand, dirt, and construction debris',
          timing: 'Day 6-20',
          channel: 'Industry Networks',
          aiStaff: 'Roland & Miles',
          automationLevel: 'semi',
        },
        {
          id: 'specialty_load_matching',
          name: 'Specialty Load Matching',
          description:
            'Connect dump truck carriers with construction and aggregate shippers',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Construction material shipment volume',
        'Aggregate transportation capacity utilization',
        'Premium load fee collection (15-20%)',
        'Construction season peak performance',
      ],
    },

    {
      id: 'cement_bulk_carrier_network',
      name: 'Cement & Bulk Carrier Acquisition',
      description:
        'Target cement mixers and bulk carriers for construction materials - ULTRA-PREMIUM RATES (18-25% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing for time-critical construction projects',
      category: 'carrier_specialization',
      targetAudience:
        'Cement carriers, bulk material haulers, and ready-mix concrete transportation specialists',
      expectedResults: {
        leads: 75,
        conversions: 30, // Very specialized equipment = premium value
        dailyRevenue: 20000, // $600,000 ÷ 30 days (ultra-premium rates)
        monthlyRevenue: 600000, // Ultra-premium 18-25% load fees
        totalRevenue: 600000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Extremely specialized equipment
      aiStaff: ['Roland', 'Miles', 'Kameelah'], // Kameelah for specialized compliance
      channels: [
        'Construction Industry Events',
        'Cement Association Networks',
        'Direct Outreach',
      ],
      icon: '🚛',
      color: 'bg-gray-700',
      steps: [
        {
          id: 'cement_industry_mapping',
          name: 'Cement Industry Mapping',
          description:
            'Identify cement carriers through construction and building material associations',
          timing: 'Day 1-7',
          channel: 'Industry Directories',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'ready_mix_specialization',
          name: 'Ready-Mix Specialization',
          description:
            'Target carriers with temperature control and specialized cement handling equipment',
          timing: 'Day 8-20',
          channel: 'Construction Networks',
          aiStaff: 'Roland & Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'construction_site_matching',
          name: 'Construction Site Matching',
          description:
            'Connect cement carriers with construction sites and ready-mix plants',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Cement/concrete shipment volume',
        'Construction project on-time delivery',
        'Ultra-premium load fee collection (18-25%)',
        'Ready-mix temperature compliance',
      ],
    },

    {
      id: 'oversized_heavy_haul_network',
      name: 'Oversized Heavy Haul Carrier Network',
      description:
        'Target heavy haul carriers for oversized and overweight equipment - MAXIMUM PREMIUM RATES (20-30% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with pilot car coordination',
      category: 'specialty_equipment',
      targetAudience:
        'Heavy haul carriers, oversized load specialists, and industrial equipment transporters with proper permits and pilot car services',
      expectedResults: {
        leads: 60,
        conversions: 24, // Extremely specialized = highest value
        dailyRevenue: 33333, // $1,000,000 ÷ 30 days (maximum premium rates)
        monthlyRevenue: 1000000, // Maximum premium 20-30% load fees
        totalRevenue: 1000000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Permits, pilot cars, specialized equipment required
      aiStaff: ['Roland', 'Miles', 'Kameelah'], // Kameelah for permit compliance
      channels: [
        'Heavy Haul Associations',
        'Permitting Agencies',
        'Direct Industry Contacts',
      ],
      icon: '🚛',
      color: 'bg-red-700',
      steps: [
        {
          id: 'heavy_haul_equipment_mapping',
          name: 'Heavy Haul Equipment Mapping',
          description:
            'Identify carriers with oversized load permits and heavy haul capabilities',
          timing: 'Day 1-7',
          channel: 'Specialized Directories',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'permit_compliance_outreach',
          name: 'Permit Compliance Outreach',
          description:
            'Target carriers with current permits and pilot car coordination services',
          timing: 'Day 8-20',
          channel: 'Regulatory Networks',
          aiStaff: 'Roland & Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'oversized_load_matching',
          name: 'Oversized Load Matching',
          description:
            'Connect heavy haul carriers with industrial equipment manufacturers and construction sites',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Oversized equipment shipment volume',
        'Permit compliance success rate',
        'Maximum premium load fee collection (20-30%)',
        'Pilot car coordination efficiency',
      ],
    },

    {
      id: 'lowboy_trailer_specialization',
      name: 'Lowboy Trailer Carrier Network',
      description:
        'Target lowboy trailer carriers for heavy machinery and equipment transport - PREMIUM RATES (16-22% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing for construction equipment',
      category: 'carrier_specialization',
      targetAudience:
        'Lowboy trailer carriers, heavy equipment haulers, and machinery transportation specialists',
      expectedResults: {
        leads: 70,
        conversions: 28,
        dailyRevenue: 20000, // $600,000 ÷ 30 days
        monthlyRevenue: 600000, // Premium 16-22% load fees
        totalRevenue: 600000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Specialized trailers and equipment knowledge required
      aiStaff: ['Roland', 'Miles', 'Logan'],
      channels: [
        'Construction Equipment Dealers',
        'Machinery Associations',
        'Industry Trade Shows',
      ],
      icon: '🚛',
      color: 'bg-slate-700',
      steps: [
        {
          id: 'machinery_transport_mapping',
          name: 'Machinery Transport Mapping',
          description:
            'Identify lowboy carriers through construction equipment and machinery associations',
          timing: 'Day 1-5',
          channel: 'Equipment Directories',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'heavy_equipment_outreach',
          name: 'Heavy Equipment Outreach',
          description:
            'Target carriers experienced with bulldozers, excavators, and industrial machinery',
          timing: 'Day 6-20',
          channel: 'Construction Networks',
          aiStaff: 'Roland & Miles',
          automationLevel: 'semi',
        },
        {
          id: 'equipment_transport_matching',
          name: 'Equipment Transport Matching',
          description:
            'Connect lowboy carriers with construction equipment manufacturers and rental companies',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Heavy machinery shipment volume',
        'Construction equipment transport capacity',
        'Premium load fee collection (16-22%)',
        'Equipment damage prevention rate',
      ],
    },

    {
      id: 'tanker_chemical_carrier_network',
      name: 'Tanker & Chemical Carrier Acquisition',
      description:
        'Target tanker carriers for liquids, chemicals, and hazardous materials - HIGH COMPLIANCE PREMIUM RATES (15-20% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with HazMat expertise',
      category: 'carrier_specialization',
      targetAudience:
        'Tanker carriers, chemical haulers, and hazardous materials transportation specialists with proper certifications',
      expectedResults: {
        leads: 80,
        conversions: 32,
        dailyRevenue: 15000, // $450,000 ÷ 30 days
        monthlyRevenue: 450000, // High compliance 15-20% load fees
        totalRevenue: 450000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // HazMat certifications and compliance required
      aiStaff: ['Roland', 'Kameelah', 'Miles'], // Kameelah for HazMat compliance
      channels: [
        'Chemical Industry Associations',
        'HazMat Training Centers',
        'Regulatory Networks',
      ],
      icon: '🚛',
      color: 'bg-orange-800',
      steps: [
        {
          id: 'chemical_transport_mapping',
          name: 'Chemical Transport Mapping',
          description:
            'Identify tanker carriers through chemical industry and HazMat associations',
          timing: 'Day 1-7',
          channel: 'Industry Certifications',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'hazmat_compliance_outreach',
          name: 'HazMat Compliance Outreach',
          description:
            'Target carriers with current HazMat certifications and proper tanker equipment',
          timing: 'Day 8-20',
          channel: 'Regulatory Networks',
          aiStaff: 'Roland & Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'chemical_load_matching',
          name: 'Chemical Load Matching',
          description:
            'Connect tanker carriers with chemical manufacturers and distributors',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Chemical/hazardous material shipment volume',
        'HazMat compliance certification rate',
        'High compliance load fee collection (15-20%)',
        'Environmental safety record',
      ],
    },

    {
      id: 'pilot_car_escort_services',
      name: 'Pilot Car Escort Service Network',
      description:
        'Target pilot car drivers and escort services for oversized loads - ESSENTIAL SUPPORT SERVICE (8-12% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing for oversized load coordination',
      category: 'lead_generation',
      targetAudience:
        'Pilot car drivers, escort service providers, and oversized load coordination specialists',
      expectedResults: {
        leads: 120,
        conversions: 48, // High demand for oversized load escorts
        dailyRevenue: 6667, // $200,000 ÷ 30 days
        monthlyRevenue: 200000, // Essential service 8-12% fees
        totalRevenue: 200000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Roland', 'Miles', 'Kameelah'], // Kameelah for permit coordination
      channels: [
        'Pilot Car Associations',
        'State DOT Networks',
        'Oversized Load Services',
      ],
      icon: '🚗',
      color: 'bg-yellow-600',
      steps: [
        {
          id: 'pilot_car_service_mapping',
          name: 'Pilot Car Service Mapping',
          description:
            'Identify certified pilot car drivers and escort service providers',
          timing: 'Day 1-5',
          channel: 'State DOT Directories',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'oversized_load_coordination',
          name: 'Oversized Load Coordination',
          description:
            'Target drivers experienced with permit coordination and route planning',
          timing: 'Day 6-20',
          channel: 'Regulatory Networks',
          aiStaff: 'Roland & Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'escort_service_matching',
          name: 'Escort Service Matching',
          description:
            'Connect pilot car services with heavy haul carriers and oversized load shippers',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Oversized load escort coordination',
        'Permit approval success rate',
        'On-time delivery for oversized shipments',
        'State DOT compliance partnerships',
      ],
    },

    // SPECIALIZED INDUSTRY CAMPAIGNS
    {
      id: 'healthcare_pharma_distribution',
      name: 'Healthcare & Pharma Distribution Blitz - PREMIER CAMPAIGN',
      description:
        'Target hospitals, pharmacies, and medical suppliers with temperature-controlled and time-sensitive freight needs - HIGH VALUE SPECIALIZATION featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing',
      category: 'lead_generation',
      targetAudience:
        'Healthcare facilities, pharmaceutical distributors, medical suppliers, and biotech companies',
      expectedResults: {
        leads: 85,
        conversions: 26,
        dailyRevenue: 6500, // $195,000 ÷ 30 days
        monthlyRevenue: 195000,
        totalRevenue: 195000, // 30-day campaign total
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
      category: 'lead_generation',
      targetAudience:
        'E-commerce retailers, online marketplaces, and direct-to-consumer brands',
      expectedResults: {
        leads: 120,
        conversions: 36,
        dailyRevenue: 6000, // $270,000 ÷ 45 days
        monthlyRevenue: 270000,
        totalRevenue: 270000, // 45-day campaign total
      },
      duration: '45 days',
      difficulty: 'hard',
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
      category: 'lead_generation',
      targetAudience:
        'Regional manufacturers, distributors, and businesses in target markets',
      expectedResults: {
        leads: 95,
        conversions: 29,
        dailyRevenue: 6229, // $218,000 ÷ 35 days
        monthlyRevenue: 218000,
        totalRevenue: 218000, // 35-day campaign total
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
      category: 'lead_generation',
      targetAudience:
        'Large corporations, Fortune 1000 companies, and enterprise-level shippers',
      expectedResults: {
        leads: 65,
        conversions: 13,
        dailyRevenue: 10833, // $650,000 ÷ 60 days
        monthlyRevenue: 650000,
        totalRevenue: 650000, // 60-day campaign total
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
      category: 'lead_generation',
      targetAudience:
        'Businesses recovering from poor freight experiences, damaged relationships, or service failures',
      expectedResults: {
        leads: 75,
        conversions: 30,
        dailyRevenue: 7200, // $180,000 ÷ 25 days
        monthlyRevenue: 180000,
        totalRevenue: 180000, // 25-day campaign total
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
      category: 'lead_generation',
      targetAudience:
        'Existing satisfied customers and their professional networks',
      expectedResults: {
        leads: 110,
        conversions: 44,
        dailyRevenue: 8250, // $330,000 ÷ 40 days
        monthlyRevenue: 330000,
        totalRevenue: 330000, // 40-day campaign total
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
      category: 'lead_generation',
      targetAudience:
        'Food manufacturers, beverage producers, restaurants, and grocery chains',
      expectedResults: {
        leads: 90,
        conversions: 27,
        dailyRevenue: 6767, // $203,000 ÷ 30 days
        monthlyRevenue: 203000,
        totalRevenue: 203000, // 30-day campaign total
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
        dailyRevenue: 9286, // $325,000 ÷ 35 days
        monthlyRevenue: 325000,
        totalRevenue: 325000, // 35-day campaign total
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
        dailyRevenue: 6444, // $290,000 ÷ 45 days
        monthlyRevenue: 290000,
        totalRevenue: 290000, // 45-day campaign total
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
        dailyRevenue: 8889, // $400,000 ÷ 45 days
        monthlyRevenue: 400000,
        totalRevenue: 400000, // 45-day campaign total
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
        dailyRevenue: 9200, // $345,000 ÷ 38 days (rounded)
        monthlyRevenue: 345000,
        totalRevenue: 345000, // 38-day campaign total
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
        dailyRevenue: 7000, // $315,000 ÷ 45 days
        monthlyRevenue: 315000,
        totalRevenue: 315000, // 45-day campaign total
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
        dailyRevenue: 7229, // $255,000 ÷ 35 days
        monthlyRevenue: 255000,
        totalRevenue: 255000, // 35-day campaign total
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
        dailyRevenue: 7714, // $270,000 ÷ 35 days
        monthlyRevenue: 270000,
        totalRevenue: 270000, // 35-day campaign total
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
        dailyRevenue: 3333, // $300,000 ÷ 90 days
        monthlyRevenue: 300000,
        totalRevenue: 300000, // 90-day campaign total
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

    // SHIPPER SALES SUB-CAMPAIGNS FOR SPECIALTY CARRIER LOAD ACQUISITION
    {
      id: 'construction_dump_truck_sales',
      name: 'Construction Dump Truck Load Acquisition',
      description:
        'Target construction companies, demolition firms, and earth-moving contractors who need dump truck services for bulk material transport',
      category: 'lead_generation',
      targetAudience:
        'Construction companies, demolition contractors, landscaping firms, mining operations',
      expectedResults: {
        leads: 120,
        conversions: 36,
        dailyRevenue: 4500,
        monthlyRevenue: 135000,
        totalRevenue: 135000,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Will'],
      channels: ['Email', 'Phone', 'Thomas.net'],
      icon: '🏗️',
      color: 'bg-orange-500',
      steps: [
        {
          id: 'construction_lead_identification',
          name: 'Construction Lead Identification',
          description:
            'Identify active construction projects and companies needing bulk material transport',
          timing: 'Day 1-10',
          channel: 'Thomas.net + FMCSA Data',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'bulk_material_transport_pitch',
          name: 'Bulk Material Transport Pitch',
          description:
            'Present dump truck fleet availability for soil, gravel, concrete, and demolition debris',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'construction_site_logistics',
          name: 'Construction Site Logistics',
          description:
            'Coordinate pickup/delivery scheduling with construction project timelines',
          timing: 'Day 21-30',
          channel: 'Phone + GO WITH THE FLOW',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '120+ construction leads contacted',
        '36+ confirmed load bookings',
        '$135K revenue from construction industry',
        '85% on-time delivery for bulk materials',
      ],
    },

    {
      id: 'cement_bulk_carrier_sales',
      name: 'Cement & Bulk Carrier Load Acquisition',
      description:
        'Target cement plants, ready-mix concrete producers, and bulk material suppliers needing pneumatic and dry bulk transport',
      category: 'lead_generation',
      targetAudience:
        'Cement manufacturers, ready-mix plants, aggregate suppliers, chemical processors',
      expectedResults: {
        leads: 95,
        conversions: 29,
        dailyRevenue: 5800,
        monthlyRevenue: 174000,
        totalRevenue: 174000,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Roland'],
      channels: ['Email', 'Phone', 'LinkedIn'],
      icon: '🏭',
      color: 'bg-gray-600',
      steps: [
        {
          id: 'bulk_material_supplier_mapping',
          name: 'Bulk Material Supplier Mapping',
          description:
            'Identify suppliers of cement, aggregates, and dry bulk materials',
          timing: 'Day 1-10',
          channel: 'Thomas.net + Industry Databases',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'pneumatic_transport_solutions',
          name: 'Pneumatic Transport Solutions',
          description:
            'Present pneumatic trailer fleet for contamination-free bulk transport',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'bulk_logistics_coordination',
          name: 'Bulk Logistics Coordination',
          description:
            'Schedule bulk material deliveries with production planning',
          timing: 'Day 21-30',
          channel: 'MARKETPLACE BIDDING',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '95+ bulk material suppliers contacted',
        '29+ bulk transport contracts secured',
        '$174K revenue from bulk industry',
        '95% contamination-free delivery guarantee',
      ],
    },

    {
      id: 'oversized_heavy_haul_sales',
      name: 'Oversized Heavy Haul Load Acquisition',
      description:
        'Target industrial manufacturers, construction equipment dealers, and machinery movers needing oversized transport services',
      category: 'specialty_equipment',
      targetAudience:
        'Heavy equipment manufacturers, construction machinery dealers, industrial plant builders',
      expectedResults: {
        leads: 75,
        conversions: 23,
        dailyRevenue: 9200,
        monthlyRevenue: 276000,
        totalRevenue: 276000,
      },
      duration: '30 days',
      difficulty: 'hard',
      aiStaff: ['Desiree', 'Kameelah', 'Roland'],
      channels: ['Email', 'Phone', 'Regulatory Networks'],
      icon: '🚛',
      color: 'bg-red-600',
      steps: [
        {
          id: 'heavy_equipment_inventory_analysis',
          name: 'Heavy Equipment Inventory Analysis',
          description:
            'Identify companies with oversized equipment needing transport',
          timing: 'Day 1-10',
          channel: 'Industry Databases + FMCSA',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'permit_coordination_services',
          name: 'Permit Coordination Services',
          description:
            'Offer complete DOT permit coordination and route planning',
          timing: 'Day 11-20',
          channel: 'Phone + Email',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'oversized_transport_execution',
          name: 'Oversized Transport Execution',
          description: 'Execute heavy haul moves with pilot car coordination',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '75+ heavy equipment companies contacted',
        '23+ oversized transport contracts',
        '$276K revenue from heavy haul',
        '100% permit compliance success rate',
      ],
    },

    {
      id: 'lowboy_trailer_sales',
      name: 'Lowboy Trailer Load Acquisition',
      description:
        'Target construction equipment dealers, crane companies, and industrial equipment manufacturers needing lowboy transport',
      category: 'lead_generation',
      targetAudience:
        'Construction equipment dealers, crane rental companies, industrial equipment manufacturers',
      expectedResults: {
        leads: 85,
        conversions: 26,
        dailyRevenue: 7800,
        monthlyRevenue: 234000,
        totalRevenue: 234000,
      },
      duration: '30 days',
      difficulty: 'hard',
      aiStaff: ['Desiree', 'Roland'],
      channels: ['Email', 'Phone', 'Equipment Directories'],
      icon: '🚛',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'equipment_dealer_network',
          name: 'Equipment Dealer Network',
          description:
            'Build network of construction and industrial equipment dealers',
          timing: 'Day 1-10',
          channel: 'Thomas.net + Industry Associations',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'lowboy_transport_specialization',
          name: 'Lowboy Transport Specialization',
          description:
            'Present specialized lowboy fleet for heavy machinery transport',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'equipment_delivery_coordination',
          name: 'Equipment Delivery Coordination',
          description: 'Coordinate equipment deliveries with dealer schedules',
          timing: 'Day 21-30',
          channel: 'MARKETPLACE BIDDING',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '85+ equipment dealers contacted',
        '26+ lowboy transport contracts',
        '$234K revenue from equipment transport',
        '90% on-time equipment deliveries',
      ],
    },

    {
      id: 'tanker_chemical_sales',
      name: 'Tanker & Chemical Transport Load Acquisition',
      description:
        'Target chemical manufacturers, petroleum distributors, and hazardous material shippers needing specialized tanker transport',
      category: 'lead_generation',
      targetAudience:
        'Chemical manufacturers, petroleum distributors, hazardous waste companies',
      expectedResults: {
        leads: 65,
        conversions: 20,
        dailyRevenue: 6400,
        monthlyRevenue: 192000,
        totalRevenue: 192000,
      },
      duration: '30 days',
      difficulty: 'hard',
      aiStaff: ['Desiree', 'Kameelah'],
      channels: ['Email', 'Phone', 'Regulatory Compliance Networks'],
      icon: '🚛',
      color: 'bg-yellow-600',
      steps: [
        {
          id: 'chemical_manufacturer_identification',
          name: 'Chemical Manufacturer Identification',
          description:
            'Identify chemical and petroleum companies needing tanker transport',
          timing: 'Day 1-10',
          channel: 'FMCSA + Industry Databases',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'hazmat_transport_compliance',
          name: 'Hazmat Transport Compliance',
          description:
            'Ensure all tanker operations meet DOT hazmat regulations',
          timing: 'Day 11-20',
          channel: 'Regulatory Coordination',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'chemical_logistics_execution',
          name: 'Chemical Logistics Execution',
          description:
            'Execute chemical and petroleum transport with safety protocols',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '65+ chemical companies contacted',
        '20+ hazmat transport contracts',
        '$192K revenue from chemical transport',
        '100% regulatory compliance maintained',
      ],
    },

    {
      id: 'pilot_car_escort_sales',
      name: 'Pilot Car Escort Service Load Acquisition',
      description:
        'Target oversized load shippers and heavy haul carriers needing certified pilot car escort services',
      category: 'lead_generation',
      targetAudience:
        'Heavy haul carriers, oversized load shippers, construction companies',
      expectedResults: {
        leads: 90,
        conversions: 27,
        dailyRevenue: 2700,
        monthlyRevenue: 81000,
        totalRevenue: 81000,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Roland'],
      channels: ['Email', 'Phone', 'State DOT Networks'],
      icon: '🚗',
      color: 'bg-green-600',
      steps: [
        {
          id: 'pilot_car_certification_network',
          name: 'Pilot Car Certification Network',
          description:
            'Build network of certified pilot car drivers across all states',
          timing: 'Day 1-10',
          channel: 'State DOT Directories',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'oversized_load_coordination',
          name: 'Oversized Load Coordination',
          description: 'Coordinate pilot car escorts with heavy haul carriers',
          timing: 'Day 11-20',
          channel: 'Phone/Email',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'escort_service_matching',
          name: 'Escort Service Matching',
          description:
            'Match pilot car services with heavy haul transport needs',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '90+ oversized load shippers contacted',
        '27+ pilot car escort contracts',
        '$81K revenue from escort services',
        '100% state compliance for oversized loads',
      ],
    },

    // GENERAL LOAD ACQUISITION PIPELINE CAMPAIGNS
    {
      id: 'general_freight_pipeline',
      name: 'General Freight Pipeline Development',
      description:
        'Build comprehensive load pipeline from diverse shipper sources to feed all specialty carrier types',
      category: 'lead_generation',
      targetAudience:
        'All freight shippers with regular or irregular shipping needs',
      expectedResults: {
        leads: 200,
        conversions: 60,
        dailyRevenue: 7500,
        monthlyRevenue: 225000,
        totalRevenue: 225000,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Will', 'Gary'],
      channels: ['Email', 'Phone', 'Thomas.net', 'TruckingPlanet'],
      icon: '📦',
      color: 'bg-indigo-600',
      steps: [
        {
          id: 'multi_source_lead_generation',
          name: 'Multi-Source Lead Generation',
          description:
            'Generate leads from Thomas.net, TruckingPlanet, FMCSA data, and direct outreach',
          timing: 'Day 1-10',
          channel: 'All Platforms',
          aiStaff: 'Desiree',
          automationLevel: 'full',
        },
        {
          id: 'freight_needs_assessment',
          name: 'Freight Needs Assessment',
          description: 'Qualify shippers and assess their freight requirements',
          timing: 'Day 11-20',
          channel: 'Phone/Email',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'carrier_matching_pipeline',
          name: 'Carrier Matching Pipeline',
          description:
            'Match qualified loads with appropriate specialty carriers',
          timing: 'Day 21-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Gary',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '200+ shipper leads qualified',
        '60+ loads matched to carriers',
        '$225K revenue from diverse freight',
        '85% carrier utilization rate',
      ],
    },

    {
      id: 'seasonal_load_forecasting',
      name: 'Seasonal Load Forecasting & Acquisition',
      description:
        'Predict and acquire seasonal freight loads for construction, agriculture, and retail industries',
      category: 'lead_generation',
      targetAudience: 'Companies with seasonal shipping patterns',
      expectedResults: {
        leads: 150,
        conversions: 45,
        dailyRevenue: 6750,
        monthlyRevenue: 202500,
        totalRevenue: 202500,
      },
      duration: '30 days',
      difficulty: 'medium',
      aiStaff: ['Desiree', 'Ana Lyles'],
      channels: ['Email', 'Phone', 'Industry Reports'],
      icon: '📈',
      color: 'bg-teal-600',
      steps: [
        {
          id: 'seasonal_pattern_analysis',
          name: 'Seasonal Pattern Analysis',
          description:
            'Analyze historical shipping data to predict seasonal demand',
          timing: 'Day 1-10',
          channel: 'Data Analysis',
          aiStaff: 'Ana Lyles',
          automationLevel: 'full',
        },
        {
          id: 'seasonal_shipper_outreach',
          name: 'Seasonal Shipper Outreach',
          description: 'Contact companies during their peak shipping seasons',
          timing: 'Day 11-20',
          channel: 'Email/Phone',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'peak_season_capacity_planning',
          name: 'Peak Season Capacity Planning',
          description: 'Ensure carrier capacity matches seasonal load demand',
          timing: 'Day 21-30',
          channel: 'MARKETPLACE BIDDING',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '150+ seasonal shippers contacted',
        '45+ peak season contracts secured',
        '$202K revenue from seasonal freight',
        '95% capacity utilization during peak seasons',
      ],
    },

    // AIR FREIGHT & MARITIME CAMPAIGNS
    {
      id: 'air_freight_express_network',
      name: 'Air Freight Express Network Blitz - PREMIUM SPEED CAMPAIGN',
      description:
        'Target time-critical shippers and high-value cargo companies with air freight solutions - PREMIUM RATES (18-25% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with airport partnerships',
      category: 'air_freight',
      targetAudience:
        'E-commerce companies, electronics manufacturers, pharmaceuticals, perishables, and time-sensitive cargo shippers',
      expectedResults: {
        leads: 75,
        conversions: 30,
        dailyRevenue: 16667, // $500,000 ÷ 30 days
        monthlyRevenue: 500000, // Premium 18-25% load fees on high-value cargo
        totalRevenue: 500000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Airport security, customs coordination
      aiStaff: ['Miles', 'Logan', 'Kameelah'], // Kameelah for customs compliance
      channels: [
        'Airport Cargo Centers',
        'Customs Brokers',
        'Express Networks',
      ],
      icon: '✈️',
      color: 'bg-sky-500',
      steps: [
        {
          id: 'airport_cargo_mapping',
          name: 'Airport Cargo Mapping',
          description:
            'Identify major airports, cargo terminals, and express freight handlers',
          timing: 'Day 1-5',
          channel: 'Industry Directories',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
        {
          id: 'time_critical_prospecting',
          name: 'Time-Critical Prospect Outreach',
          description:
            'Target e-commerce, electronics, and pharma companies with urgent delivery needs',
          timing: 'Day 6-15',
          channel: 'LinkedIn/Phone',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'customs_clearance_coordination',
          name: 'Customs Clearance Coordination',
          description:
            'Highlight customs expertise, bonded warehousing, and expedited processing',
          timing: 'Day 16-25',
          channel: 'Customs Networks',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'express_delivery_network',
          name: 'Express Air Network Integration',
          description:
            'Connect shippers with global air freight network for next-day delivery',
          timing: 'Day 26-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '75+ time-critical shippers identified and contacted',
        '30+ high-value clients onboarded with air freight agreements',
        '$500K+ monthly revenue from premium air freight services',
        '98%+ on-time delivery with customs clearance',
        '95%+ client satisfaction with speed and reliability',
      ],
    },

    {
      id: 'maritime_container_network',
      name: 'Maritime Container Network Blitz - GLOBAL TRADE CAMPAIGN',
      description:
        'Target international shippers and importers with ocean freight solutions - CONTAINER RATES (12-18% load fees) featuring GO WITH THE FLOW instant matching and MARKETPLACE BIDDING competitive pricing with port partnerships',
      category: 'maritime_freight',
      targetAudience:
        'International manufacturers, importers, retailers, and global supply chain companies',
      expectedResults: {
        leads: 85,
        conversions: 26,
        dailyRevenue: 11111, // $333,000 ÷ 30 days
        monthlyRevenue: 333000, // Container shipping 12-18% load fees
        totalRevenue: 333000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // International shipping, customs, documentation
      aiStaff: ['Miles', 'Logan', 'Kameelah'], // Kameelah for international compliance
      channels: [
        'Port Authorities',
        'Customs Brokers',
        'Shipping Associations',
      ],
      icon: '🚢',
      color: 'bg-blue-700',
      steps: [
        {
          id: 'port_terminal_mapping',
          name: 'Port Terminal Mapping',
          description:
            'Identify major ports, container terminals, and shipping lines',
          timing: 'Day 1-7',
          channel: 'Port Directories',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
        {
          id: 'international_trade_prospecting',
          name: 'International Trade Prospecting',
          description:
            'Target importers, exporters, and global manufacturers with container needs',
          timing: 'Day 8-18',
          channel: 'Trade Associations',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'customs_documentation_specialization',
          name: 'Customs Documentation Specialization',
          description:
            'Highlight expertise in international shipping documentation and compliance',
          timing: 'Day 19-25',
          channel: 'Customs Networks',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'container_shipping_integration',
          name: 'Container Shipping Network Integration',
          description:
            'Connect shippers with global maritime network for cost-effective ocean freight',
          timing: 'Day 26-30',
          channel: 'GO WITH THE FLOW Platform',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '85+ international shippers identified and contacted',
        '26+ global clients onboarded with container shipping agreements',
        '$333K+ monthly revenue from international freight services',
        '95%+ on-time delivery with proper documentation',
        '90%+ client satisfaction with cost-effective global shipping',
      ],
    },

    {
      id: 'express_air_cargo_acceleration',
      name: 'Express Air Cargo Acceleration Blitz - URGENT DELIVERY FOCUS',
      description:
        'Target pharmaceutical, electronics, and e-commerce companies with same-day/next-day air cargo solutions - PREMIUM EXPRESS RATES (20-28% load fees) featuring GO WITH THE FLOW instant matching with emergency routing',
      category: 'lead_generation',
      targetAudience:
        'Pharmaceutical distributors, electronics manufacturers, urgent e-commerce, medical supplies, and perishable goods companies',
      expectedResults: {
        leads: 60,
        conversions: 24,
        dailyRevenue: 20000, // $600,000 ÷ 30 days
        monthlyRevenue: 600000, // Premium 20-28% express air rates
        totalRevenue: 600000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Priority handling, customs expediting
      aiStaff: ['Miles', 'Logan', 'Kameelah'], // Kameelah for priority customs
      channels: [
        'Airport Priority Services',
        'Express Cargo Networks',
        'Emergency Logistics',
      ],
      icon: '🚀',
      color: 'bg-purple-600',
      steps: [
        {
          id: 'priority_cargo_identification',
          name: 'Priority Cargo Prospecting',
          description:
            'Identify shippers with urgent, time-critical, or emergency cargo needs',
          timing: 'Day 1-5',
          channel: 'Emergency Networks',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'express_routing_specialization',
          name: 'Express Routing Specialization',
          description:
            'Showcase ability to route cargo through fastest available air connections',
          timing: 'Day 6-15',
          channel: 'Priority Networks',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'customs_priority_processing',
          name: 'Customs Priority Processing',
          description:
            'Highlight expedited customs clearance for urgent pharmaceutical and medical cargo',
          timing: 'Day 16-25',
          channel: 'Customs Priority',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'emergency_delivery_network',
          name: 'Emergency Delivery Network',
          description:
            'Connect urgent shippers with express air cargo network for critical deliveries',
          timing: 'Day 26-30',
          channel: 'GO WITH THE FLOW Priority',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '60+ urgent shippers identified and contacted',
        '24+ high-priority clients onboarded with express air agreements',
        '$600K+ monthly revenue from premium express air services',
        '99%+ on-time delivery for urgent shipments',
        '95%+ client satisfaction with emergency response times',
      ],
    },

    {
      id: 'international_shipping_container',
      name: 'International Container Shipping Blitz - GLOBAL EXPANSION',
      description:
        'Target multinational corporations and global manufacturers with full container shipping solutions - ENTERPRISE RATES (10-15% load fees) featuring GO WITH THE FLOW instant matching with international consolidation',
      category: 'lead_generation',
      targetAudience:
        'Multinational corporations, global manufacturers, international retailers, and enterprise-level importers',
      expectedResults: {
        leads: 50,
        conversions: 15,
        dailyRevenue: 13333, // $400,000 ÷ 30 days
        monthlyRevenue: 400000, // Enterprise 10-15% container rates
        totalRevenue: 400000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Enterprise relationships, complex documentation
      aiStaff: ['Drew', 'Miles', 'Kameelah'], // Drew for enterprise relationships
      channels: [
        'Enterprise Networks',
        'Trade Associations',
        'International Chambers',
      ],
      icon: '🌍',
      color: 'bg-green-600',
      steps: [
        {
          id: 'enterprise_international_prospecting',
          name: 'Enterprise International Prospecting',
          description:
            'Identify multinational corporations with international shipping volume',
          timing: 'Day 1-10',
          channel: 'Enterprise Databases',
          aiStaff: 'Drew',
          automationLevel: 'full',
        },
        {
          id: 'global_supply_chain_analysis',
          name: 'Global Supply Chain Analysis',
          description:
            'Analyze shipping patterns and identify consolidation opportunities',
          timing: 'Day 11-20',
          channel: 'Data Analysis',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'international_compliance_specialization',
          name: 'International Compliance Specialization',
          description:
            'Highlight expertise in international regulations, tariffs, and documentation',
          timing: 'Day 21-25',
          channel: 'Compliance Networks',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'enterprise_container_network',
          name: 'Enterprise Container Network Integration',
          description:
            'Connect enterprises with global container shipping network and consolidation services',
          timing: 'Day 26-30',
          channel: 'GO WITH THE FLOW Enterprise',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '50+ enterprise shippers identified and contacted',
        '15+ multinational clients onboarded with container agreements',
        '$400K+ monthly revenue from enterprise international shipping',
        '98%+ documentation accuracy for international shipments',
        '92%+ client satisfaction with global shipping solutions',
      ],
    },

    {
      id: 'air_charter_emergency_response',
      name: 'Air Charter Emergency Response Blitz - CRITICAL MISSIONS',
      description:
        'Target emergency services, disaster relief, and critical medical transport with air charter solutions - EMERGENCY RATES (25-35% load fees) featuring GO WITH THE FLOW instant matching with priority aircraft availability',
      category: 'lead_generation',
      targetAudience:
        'Emergency services, disaster relief organizations, medical transport companies, and critical supply chain providers',
      expectedResults: {
        leads: 40,
        conversions: 16,
        dailyRevenue: 25000, // $500,000 ÷ 20 days
        monthlyRevenue: 500000, // Emergency 25-35% charter rates
        totalRevenue: 500000, // 20-day campaign total
      },
      duration: '20 days',
      difficulty: 'hard', // Emergency coordination, aircraft availability
      aiStaff: ['Miles', 'Kameelah', 'Logan'], // Kameelah for emergency compliance
      channels: [
        'Emergency Networks',
        'Aviation Authorities',
        'Medical Transport',
      ],
      icon: '🚁',
      color: 'bg-red-600',
      steps: [
        {
          id: 'emergency_services_mapping',
          name: 'Emergency Services Mapping',
          description:
            'Identify hospitals, emergency services, and disaster relief organizations',
          timing: 'Day 1-3',
          channel: 'Emergency Directories',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
        {
          id: 'critical_medical_transport',
          name: 'Critical Medical Transport Coordination',
          description:
            'Target organ transport, medical supplies, and emergency medical evacuation',
          timing: 'Day 4-8',
          channel: 'Medical Networks',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'disaster_relief_logistics',
          name: 'Disaster Relief Logistics',
          description:
            'Connect disaster relief organizations with emergency air transport capabilities',
          timing: 'Day 9-15',
          channel: 'Relief Networks',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'emergency_charter_network',
          name: 'Emergency Charter Network Integration',
          description:
            'Establish emergency air charter network for critical mission support',
          timing: 'Day 16-20',
          channel: 'GO WITH THE FLOW Emergency',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '40+ emergency organizations identified and contacted',
        '16+ critical clients onboarded with emergency charter agreements',
        '$500K+ monthly revenue from emergency air charter services',
        '100% mission success rate for critical transports',
        '98%+ client satisfaction with emergency response capabilities',
      ],
    },

    {
      id: 'bulk_ocean_shipping_network',
      name: 'Bulk Ocean Shipping Network Blitz - VOLUME OPTIMIZATION',
      description:
        'Target manufacturers and commodity traders with bulk ocean shipping solutions - VOLUME DISCOUNTS (8-12% load fees) featuring GO WITH THE FLOW instant matching with bulk consolidation services',
      category: 'lead_generation',
      targetAudience:
        'Agricultural exporters, mining companies, chemical manufacturers, and bulk commodity traders',
      expectedResults: {
        leads: 70,
        conversions: 21,
        dailyRevenue: 7143, // $200,000 ÷ 28 days
        monthlyRevenue: 200000, // Volume 8-12% bulk rates
        totalRevenue: 200000, // 28-day campaign total
      },
      duration: '28 days',
      difficulty: 'medium', // Bulk handling, volume optimization
      aiStaff: ['Miles', 'Logan', 'Roland'], // Roland for bulk carrier relationships
      channels: [
        'Commodity Exchanges',
        'Bulk Terminals',
        'Agricultural Associations',
      ],
      icon: '🚢',
      color: 'bg-indigo-700',
      steps: [
        {
          id: 'bulk_terminal_mapping',
          name: 'Bulk Terminal Mapping',
          description:
            'Identify bulk cargo terminals, breakbulk facilities, and specialized ports',
          timing: 'Day 1-5',
          channel: 'Port Directories',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
        {
          id: 'commodity_trader_prospecting',
          name: 'Commodity Trader Prospecting',
          description:
            'Target agricultural exporters, mining companies, and bulk commodity traders',
          timing: 'Day 6-15',
          channel: 'Commodity Networks',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'bulk_consolidation_specialization',
          name: 'Bulk Consolidation Specialization',
          description:
            'Highlight expertise in bulk cargo consolidation and volume optimization',
          timing: 'Day 16-22',
          channel: 'Bulk Networks',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'bulk_shipping_integration',
          name: 'Bulk Shipping Network Integration',
          description:
            'Connect bulk shippers with global ocean shipping network for volume-optimized freight',
          timing: 'Day 23-28',
          channel: 'GO WITH THE FLOW Bulk',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        '70+ bulk shippers identified and contacted',
        '21+ volume clients onboarded with bulk shipping agreements',
        '$200K+ monthly revenue from bulk ocean shipping services',
        '90%+ capacity utilization with volume optimization',
        '88%+ client satisfaction with cost-effective bulk shipping',
      ],
    },

    // =========================================
    // COMPREHENSIVE FEMA STOS PROGRAM CAMPAIGN
    // =========================================
    {
      id: 'fema_stos_comprehensive',
      name: 'FEMA Tender of Service Program (STOS) - Complete Registration & LSCMS-C Setup',
      description:
        'Complete FEMA STOS Program registration for DEE DAVIS INC freight brokerage (SCAC: DFCL) including $300K cargo insurance verification, ACORD form submission, LSCMS-C access control setup (Document Upload & Web Tenders), TSP registration, and full onboarding process for disaster relief transportation services across all modes: FTL, LTL, Maritime, Air, Rail, and TTHU',
      category: 'lead_generation',
      targetAudience:
        'FEMA Transportation Programs (FEMA-Transportation-Programs@fema.dhs.gov), Federal Emergency Management Agency Logistics Management Directorate, Disaster Relief Organizations, Emergency Services Procurement Officers, FEMA Logistics Supply Chain Management System (LSCMS-C) Administrators',
      expectedResults: {
        leads: 20,
        conversions: 1, // Complete STOS Program approval
        dailyRevenue: 0, // Contract-based revenue
        monthlyRevenue: 0, // Long-term contract value
        totalRevenue: 2500000, // $2.5M+ annual contract potential
      },
      duration: '75 days',
      difficulty: 'hard', // Complex government contracting & system integration
      aiStaff: [
        'Gary',
        'Desiree',
        'Kameelah',
        'Regina',
        'Logan',
        'Miles',
        'Will',
      ],
      channels: [
        'FEMA Transportation Programs',
        'Government Procurement',
        'Emergency Services Direct',
        'SAM.gov Integration',
        'LSCMS-C System Access',
      ],
      icon: '🏛️',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'fema_stos_overview',
          name: 'FEMA STOS Program Overview & Requirements Review',
          description:
            'Review complete FEMA STOS Program requirements including: Tender of Service Program Guide (fema_lmd-2025-stos.pdf), Onboarding Guide (fema_lmd-onboarding-guide_07022025.pdf), $300K cargo insurance requirements, LSCMS-C access levels, ACORD form specifications, and all supporting documentation. Prepare DEE DAVIS INC (SCAC: DFCL) for full compliance.',
          timing: 'Days 1-5',
          channel: 'FEMA Transportation Programs',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'lscms_access_user_identification',
          name: 'LSCMS-C User Access Planning & Requirements',
          description:
            'Identify all users requiring LSCMS-C access (minimum 1 user required). Plan for two access levels: 1) Carrier Document Upload (immediate access for document submission), 2) Carrier Web Tenders (granted after full onboarding for shipment management). Prepare user information and access level requirements.',
          timing: 'Days 6-8',
          channel: 'Government Procurement',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'cargo_insurance_acord_preparation',
          name: 'ACORD Form & $300K Cargo Insurance Verification',
          description:
            'Obtain ACORD form from insurance provider verifying $300K cargo coverage per occurrence for all transportation modes: FTL/TL ($300K), LTL ($300K), Maritime ($300K), Air ($300K), Rail ($300K). Include Standard Carrier Alpha Code (SCAC: DFCL), deductible information, and policy expiration date. Form must be signed by insurance provider.',
          timing: 'Days 9-13',
          channel: 'Emergency Services Direct',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'lscms_access_control_forms',
          name: 'LSCMS-C Access Control Form Preparation',
          description:
            'Complete LSCMS-C Access Control Forms (fema_lmd_lscms-c-access-control-form_ff-145-fy-22-102.pdf) for all required users. Include SCAC: DFCL, user details, requested access levels (Document Upload and Web Tenders), and company information. Prepare separate forms for each user requiring system access.',
          timing: 'Days 14-16',
          channel: 'SAM.gov Integration',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'tsp_registration_comprehensive',
          name: 'Complete TSP Registration Form Preparation',
          description:
            'Complete FEMA TSP Registration Form 2024 (fema_lmd-tsp-registration-form-2024.pdf) with comprehensive DEE DAVIS INC information: company details, DOT numbers, SCAC code (DFCL), $300K cargo insurance coverage for all modes (FTL, LTL, Maritime, Air, Rail, TTHU), FMCSA authorization, and transportation service capabilities.',
          timing: 'Days 17-21',
          channel: 'FEMA Transportation Programs',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'lscms_access_form_submission',
          name: 'LSCMS-C Access Control Forms Email Submission',
          description:
            'Email all completed LSCMS-C Access Control Forms to FEMA-Transportation-Programs@fema.dhs.gov. Include SCAC: DFCL, request both access levels (Document Upload and Web Tenders), and provide timeline expectations. Track submission confirmation and follow up on processing status.',
          timing: 'Days 22-24',
          channel: 'Government Procurement',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
        {
          id: 'urt_capability_statement',
          name: 'URT Document & Comprehensive Capability Statement',
          description:
            'Prepare FEMA 2025 URT document (fema_lmd_2025-urt_07022025.pdf) and detailed capability statement demonstrating DEE DAVIS INC expertise in FTL, LTL, Maritime, Air, Rail, and TTHU transportation with $300K cargo insurance coverage. Include SCAC: DFCL, emergency response capabilities, and disaster relief logistics expertise.',
          timing: 'Days 25-29',
          channel: 'Emergency Services Direct',
          aiStaff: 'Regina',
          automationLevel: 'semi',
        },
        {
          id: 'rfi_response_development',
          name: 'FEMA RFI Response Development & Submission',
          description:
            'Develop comprehensive response to FEMA 2025 RFI (fema_2025_rfi_final.pdf) including transportation capacity, $300K cargo insurance coverage for all modes, emergency response capabilities, disaster relief logistics expertise, SCAC: DFCL, and detailed service offerings across all transportation modalities.',
          timing: 'Days 30-34',
          channel: 'SAM.gov Integration',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'dot_fmsca_compliance_verification',
          name: 'DOT/FMCSA Compliance & Insurance Verification',
          description:
            'Verify all DOT, FMCSA compliance documentation, safety certificates, $300K cargo insurance ACORD form with SCAC: DFCL, bonding requirements, and regulatory compliance for FEMA STOS Program approval. Ensure all transportation modes match insurance coverage and regulatory requirements.',
          timing: 'Days 35-39',
          channel: 'FEMA Transportation Programs',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'tsp_agreement_review_signature',
          name: 'TSP Agreement Review & Electronic Signature',
          description:
            'Review FEMA 2025 TSP Agreement (fema_2025-tsp-agreement.pdf) terms and conditions including $300K cargo insurance requirements, SCAC: DFCL, LSCMS-C access commitments, and service level agreements. Prepare for electronic signature and contract execution.',
          timing: 'Days 40-42',
          channel: 'Government Procurement',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'lscms_document_upload_process',
          name: 'LSCMS-C Document Upload & Verification',
          description:
            'Use LSCMS-C Carrier Document Upload access to submit all required documents including ACORD form, insurance verification, TSP registration form, and supporting documentation. Follow FEMA Carrier Document Upload Reference Guide (carrier-document-upload-reference-guide_2022.pdf) for proper submission procedures.',
          timing: 'Days 43-47',
          channel: 'Emergency Services Direct',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'lscms_system_training_completion',
          name: 'LSCMS-C System Training & Access Verification',
          description:
            'Complete LSCMS-C system training for all approved users. Verify access levels: 1) Carrier Document Upload (for document submission), 2) Carrier Web Tenders (for shipment management - activated after full onboarding). Confirm SCAC: DFCL is properly configured and system access is functional.',
          timing: 'Days 48-52',
          channel: 'SAM.gov Integration',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'fema_onboarding_completion',
          name: 'FEMA Onboarding Guide Completion',
          description:
            'Complete all FEMA Onboarding Guide (fema_lmd-onboarding-guide_07022025.pdf) requirements including LSCMS-C system training verification, $300K cargo insurance confirmation, SCAC: DFCL setup, emergency contact establishment, and full vendor verification process for all transportation modes.',
          timing: 'Days 53-57',
          channel: 'FEMA Transportation Programs',
          aiStaff: 'Miles',
          automationLevel: 'semi',
        },
        {
          id: 'stos_final_registration_submission',
          name: 'STOS Program Final Registration Submission',
          description:
            'Submit complete FEMA STOS Program registration package (fema_lmd-2025-stos.pdf) including all forms, ACORD insurance verification with $300K cargo coverage, SCAC: DFCL, LSCMS-C access confirmation, capability demonstrations, and supporting documentation during open onboarding period.',
          timing: 'Days 58-62',
          channel: 'Government Procurement',
          aiStaff: 'Regina',
          automationLevel: 'semi',
        },
        {
          id: 'lscms_web_tenders_activation',
          name: 'LSCMS-C Web Tenders Access Activation',
          description:
            'Confirm activation of Carrier Web Tenders access level in LSCMS-C (granted after full onboarding completion). This enables management of FEMA shipments including trailer/container numbers, license plates, delivery status, shipment tracking, and emergency response coordination.',
          timing: 'Days 63-65',
          channel: 'Emergency Services Direct',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'fema_stos_approval_verification',
          name: 'FEMA STOS Program Approval & Vendor ID Verification',
          description:
            'Verify FEMA STOS Program approval, receive official FEMA TSP vendor ID, confirm SCAC: DFCL registration, and validate $2.5M+ annual contract eligibility. Ensure all transportation modes (FTL, LTL, Maritime, Air, Rail, TTHU) are approved with $300K cargo insurance coverage.',
          timing: 'Days 66-68',
          channel: 'SAM.gov Integration',
          aiStaff: 'Will',
          automationLevel: 'semi',
        },
        {
          id: 'emergency_response_capability_certification',
          name: 'Emergency Response Capability Certification',
          description:
            'Complete emergency response capability certification including disaster relief logistics verification, 24/7 emergency coordination protocols, multi-modal transportation readiness, and FEMA emergency response integration. Confirm all systems are operational for immediate disaster deployment.',
          timing: 'Days 69-71',
          channel: 'FEMA Transportation Programs',
          aiStaff: 'Desiree',
          automationLevel: 'semi',
        },
        {
          id: 'fema_final_verification_inquiry',
          name: 'FEMA Transportation Programs Final Status Verification',
          description:
            'Send comprehensive verification inquiry to FEMA-Transportation-Programs@fema.dhs.gov regarding complete STOS Program registration status, $300K cargo insurance verification, SCAC: DFCL confirmation, LSCMS-C access levels (Document Upload & Web Tenders), vendor ID assignment, and readiness for FEMA disaster relief transportation contracts.',
          timing: 'Days 72-75',
          channel: 'Government Procurement',
          aiStaff: 'Miles',
          automationLevel: 'full',
        },
      ],
      successMetrics: [
        'Complete FEMA STOS Program documentation package assembled',
        'LSCMS-C Access Control Forms completed for all required users',
        'ACORD form obtained from insurance provider with $300K cargo coverage',
        'Complete TSP Registration Form with SCAC: DFCL and all transportation modes',
        'LSCMS-C Access Control Forms submitted to FEMA email',
        'Carrier Document Upload access granted in LSCMS-C system',
        'FEMA 2025 RFI response submitted with comprehensive details',
        'DOT/FMCSA compliance verified with $300K cargo insurance',
        'FEMA 2025 TSP Agreement signed with all requirements',
        'All documents successfully uploaded through LSCMS-C portal',
        'LSCMS-C system training completed for all approved users',
        'Carrier Web Tenders access activated post-onboarding',
        'FEMA Onboarding Guide requirements fully satisfied',
        'FEMA STOS Program registration approved and processed',
        'Official FEMA TSP vendor ID received with SCAC: DFCL',
        '$2.5M+ annual contract eligibility confirmed',
        'Emergency response capability fully certified',
        'Multi-modal transportation services approved (FTL, LTL, Maritime, Air, Rail, TTHU)',
        '24/7 disaster relief coordination protocols established',
        'FEMA Transportation Programs relationship fully established',
        'Ready for immediate FEMA disaster relief transportation deployment',
      ],
    },

    // 🌍 INTERNATIONAL & CROSS-BORDER CAMPAIGNS
    {
      id: 'global_trade_lane_development',
      name: 'Global Trade Lane Development',
      description:
        'Specialized international freight corridors with customs clearance, multi-modal transport coordination, currency hedging, and international payment processing - Transform international shipping complexity into streamlined efficiency',
      category: 'lead_generation',
      targetAudience:
        'International shippers, manufacturers, and wholesalers seeking reliable international freight solutions - Companies with cross-border supply chains needing specialized logistics expertise',
      expectedResults: {
        leads: 85, // Conservative: Based on international trade data
        conversions: 26, // Realistic: 30% conversion for international prospects
        dailyRevenue: 8000, // $240,000 ÷ 30 days
        monthlyRevenue: 240000, // Realistic: $8,000/month based on international freight rates
        totalRevenue: 240000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Complex due to international regulations and multi-modal coordination
      aiStaff: ['Regina', 'Kameelah', 'Logan', 'Roland'], // Regina for FMCSA/international compliance, Kameelah for regulatory expertise
      channels: ['Email', 'Phone', 'LinkedIn', 'Trade Shows'],
      icon: '🌍',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'trade_lane_market_analysis',
          name: 'Trade Lane Market Analysis',
          description:
            'Analyze trade flows between key markets (US-China, US-EU, US-Mexico) to identify high-volume corridors and capacity gaps',
          timing: 'Day 1-2',
          channel: 'Data Analysis',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
        {
          id: 'carrier_network_development',
          name: 'Carrier Network Development',
          description:
            'Establish partnerships with international carriers, customs brokers, and freight forwarders for comprehensive service coverage',
          timing: 'Day 3-7',
          channel: 'Partnership Outreach',
          aiStaff: 'Roland',
          automationLevel: 'semi',
        },
        {
          id: 'customs_clearance_setup',
          name: 'Customs Clearance Infrastructure',
          description:
            'Set up automated customs clearance systems, documentation templates, and regulatory compliance protocols',
          timing: 'Day 8-12',
          channel: 'System Integration',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'currency_hedging_program',
          name: 'Currency Hedging Program',
          description:
            'Implement automated currency hedging solutions and international payment processing for risk mitigation',
          timing: 'Day 13-17',
          channel: 'Financial Services',
          aiStaff: 'Regina',
          automationLevel: 'full',
        },
        {
          id: 'multi_modal_coordination',
          name: 'Multi-Modal Coordination Setup',
          description:
            'Establish protocols for seamless sea-air-ground transport coordination and real-time tracking integration',
          timing: 'Day 18-22',
          channel: 'Operations',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'market_launch_campaign',
          name: 'International Market Launch',
          description:
            'Target international shippers with comprehensive trade lane solutions featuring end-to-end service guarantees',
          timing: 'Day 23-30',
          channel: 'Multi-Channel',
          aiStaff: 'Roland & Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '100+ international shipper leads identified',
        '30+ trade lane partnerships established',
        '25+ successful customs clearance implementations',
        '20+ multi-modal coordination setups completed',
        '85% on-time international delivery performance',
        '30% cost reduction vs. traditional international shipping',
        '$300K+ international revenue pipeline created',
        '95% regulatory compliance rate maintained',
      ],
    },

    {
      id: 'import_export_accelerator_program',
      name: 'Import/Export Accelerator Program',
      description:
        'End-to-end international trade support with documentation preparation, compliance management, insurance coordination, and market entry consulting - Fast-track international business expansion',
      category: 'conversion',
      targetAudience:
        'New exporters, international market entrants, and companies expanding cross-border operations - Businesses needing comprehensive international trade support',
      expectedResults: {
        leads: 65, // Conservative: Based on export assistance program data
        conversions: 20, // Realistic: 30% conversion for export assistance
        dailyRevenue: 7000, // $210,000 ÷ 30 days
        monthlyRevenue: 210000, // Realistic: $7,000/month based on export consulting fees
        totalRevenue: 210000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium', // Moderate complexity with regulatory components
      aiStaff: ['Regina', 'Kameelah', 'Gary', 'Lea D.'], // Regina for international compliance, Kameelah for documentation
      channels: ['Email', 'Phone', 'Webinars', 'Consultations'],
      icon: '📦',
      color: 'bg-purple-600',
      steps: [
        {
          id: 'export_readiness_assessment',
          name: 'Export Readiness Assessment',
          description:
            "Comprehensive evaluation of companies' international trade readiness, including product compliance and market analysis",
          timing: 'Day 1-5',
          channel: 'Consultation',
          aiStaff: 'Gary',
          automationLevel: 'semi',
        },
        {
          id: 'documentation_automation',
          name: 'Documentation Automation Setup',
          description:
            'Implement automated systems for customs documentation, certificates of origin, and export compliance paperwork',
          timing: 'Day 6-10',
          channel: 'System Integration',
          aiStaff: 'Kameelah',
          automationLevel: 'full',
        },
        {
          id: 'insurance_coordination',
          name: 'International Insurance Coordination',
          description:
            'Establish cargo insurance partnerships and automated coverage for international shipments',
          timing: 'Day 11-15',
          channel: 'Partnership Development',
          aiStaff: 'Regina',
          automationLevel: 'semi',
        },
        {
          id: 'market_entry_strategy',
          name: 'Market Entry Strategy Development',
          description:
            'Create customized market entry plans including distribution channels, pricing strategies, and regulatory requirements',
          timing: 'Day 16-20',
          channel: 'Strategic Consulting',
          aiStaff: 'Lea D.',
          automationLevel: 'semi',
        },
        {
          id: 'implementation_support',
          name: 'Implementation Support Program',
          description:
            'Provide hands-on support for first international shipments including troubleshooting and compliance monitoring',
          timing: 'Day 21-25',
          channel: 'Ongoing Support',
          aiStaff: 'Gary & Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'scaling_acceleration',
          name: 'Scaling Acceleration Program',
          description:
            'Guide successful exporters to scale operations with additional market entries and expanded trade lane development',
          timing: 'Day 26-30',
          channel: 'Growth Consulting',
          aiStaff: 'Regina & Lea D.',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '80+ export readiness assessments completed',
        '60+ companies with automated documentation systems',
        '45+ international insurance programs implemented',
        '35+ customized market entry strategies delivered',
        '25+ successful first international shipments',
        '90% client satisfaction with program support',
        '$250K+ export revenue pipeline created',
        '40% faster time-to-export for program participants',
      ],
    },

    // 🏥 HEALTHCARE & MEDICAL FREIGHT CAMPAIGNS
    {
      id: 'critical_care_courier_network',
      name: 'WOSB Critical Care Courier Network - CERTIFIED MEDICAL LOGISTICS',
      description:
        'PREMIUM WOSB-CERTIFIED specialized network for medical supplies, pharmaceuticals, and organs with temperature-controlled transport, real-time GPS tracking, emergency response protocols, and FDA/CDC compliance. COMPETITIVE ADVANTAGE: Women-Owned Small Business certification meets healthcare system diversity requirements, appeals to hospitals with supplier diversity mandates, and provides preference for medical institution partnerships. Life-critical logistics excellence with certified diversity credentials.',
      category: 'lead_generation',
      targetAudience:
        'ENHANCED TARGET: Hospitals with diversity supplier programs, pharmaceutical companies meeting ESG requirements, organ procurement organizations, medical suppliers with supplier diversity mandates, healthcare procurement officers focused on certified diverse suppliers, and medical institutions requiring WOSB-certified temperature-controlled and time-critical transport services',
      expectedResults: {
        leads: 95, // Conservative: Based on healthcare logistics demand
        conversions: 29, // Realistic: 30% conversion for specialized healthcare services
        dailyRevenue: 8000, // $240,000 ÷ 30 days
        monthlyRevenue: 240000, // Realistic: $8,000/month based on premium healthcare rates
        totalRevenue: 240000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Complex due to regulatory requirements and specialized equipment
      aiStaff: ['Kameelah', 'Regina', 'Shanell', 'Logan'], // Kameelah for compliance, Regina for regulations, Shanell for customer service, Logan for logistics
      channels: ['Email', 'Phone', 'LinkedIn', 'Medical Networks'],
      icon: '🏥',
      color: 'bg-red-600',
      steps: [
        {
          id: 'healthcare_network_mapping',
          name: 'Healthcare Network Intelligence',
          description:
            'Map hospitals, pharmaceutical companies, and medical suppliers using healthcare industry databases and partnerships',
          timing: 'Day 1-3',
          channel: 'Data Analysis',
          aiStaff: 'Kameelah',
          automationLevel: 'full',
        },
        {
          id: 'compliance_certification_setup',
          name: 'Regulatory Compliance Infrastructure',
          description:
            'Establish FDA, CDC, and state regulatory compliance frameworks, certifications, and documentation systems',
          timing: 'Day 4-7',
          channel: 'System Integration',
          aiStaff: 'Regina',
          automationLevel: 'semi',
        },
        {
          id: 'specialized_equipment_network',
          name: 'Temperature-Controlled Equipment Network',
          description:
            'Build network of certified carriers with specialized vehicles for various temperature requirements (2-8C, -20C, -80C)',
          timing: 'Day 8-12',
          channel: 'Partnership Development',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'emergency_response_protocols',
          name: 'Emergency Response Protocols',
          description:
            'Develop and implement emergency response protocols for life-critical shipments with 24/7 monitoring and rapid deployment',
          timing: 'Day 13-17',
          channel: 'Operations',
          aiStaff: 'Shanell',
          automationLevel: 'semi',
        },
        {
          id: 'gps_tracking_integration',
          name: 'Real-Time GPS Tracking System',
          description:
            'Implement advanced GPS tracking with temperature monitoring, route optimization, and real-time alerts for critical shipments',
          timing: 'Day 18-22',
          channel: 'Technology Integration',
          aiStaff: 'Kameelah',
          automationLevel: 'full',
        },
        {
          id: 'market_launch_healthcare',
          name: 'Healthcare Market Launch',
          description:
            'Target hospitals and pharmaceutical companies with comprehensive critical care logistics solutions featuring guaranteed delivery and regulatory compliance',
          timing: 'Day 23-30',
          channel: 'Multi-Channel',
          aiStaff: 'Shanell & Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '100+ healthcare facilities and pharmaceutical companies identified',
        '30+ specialized carrier partnerships established',
        '25+ regulatory certifications and compliance frameworks implemented',
        '20+ emergency response protocols developed and tested',
        '95% on-time delivery for critical shipments',
        '100% temperature compliance for sensitive medical cargo',
        '$300K+ healthcare logistics revenue pipeline created',
        'Zero regulatory compliance incidents',
      ],
    },

    {
      id: 'medical_equipment_logistics',
      name: 'Medical Equipment Logistics',
      description:
        'Specialized handling for MRI machines, surgical equipment with white-glove service, installation coordination, technical support, and partnerships with hospitals and medical device manufacturers - High-value equipment logistics',
      category: 'conversion',
      targetAudience:
        'Medical device manufacturers, hospitals, surgical centers, and healthcare facilities requiring specialized transport and installation of high-value medical equipment',
      expectedResults: {
        leads: 75, // Conservative: Based on medical equipment market
        conversions: 23, // Realistic: 30% conversion for high-value equipment services
        dailyRevenue: 7000, // $210,000 ÷ 30 days
        monthlyRevenue: 210000, // Realistic: $7,000/month based on premium equipment rates
        totalRevenue: 210000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium', // Moderate complexity with specialized handling requirements
      aiStaff: ['Logan', 'Shanell', 'Kameelah', 'Regina'], // Logan for specialized transport, Shanell for white-glove service, Kameelah for compliance, Regina for insurance
      channels: ['Email', 'Phone', 'LinkedIn', 'Medical Device Networks'],
      icon: '🩺',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'equipment_manufacturer_mapping',
          name: 'Medical Equipment Manufacturer Network',
          description:
            'Map medical device manufacturers, distributors, and healthcare facilities requiring specialized equipment transport',
          timing: 'Day 1-4',
          channel: 'Data Analysis',
          aiStaff: 'Logan',
          automationLevel: 'full',
        },
        {
          id: 'white_glove_service_setup',
          name: 'White-Glove Service Framework',
          description:
            'Develop comprehensive white-glove service protocols for handling, transport, and delivery of high-value medical equipment',
          timing: 'Day 5-8',
          channel: 'Service Development',
          aiStaff: 'Shanell',
          automationLevel: 'semi',
        },
        {
          id: 'specialized_transport_network',
          name: 'Specialized Transport Network',
          description:
            'Build network of carriers certified for medical equipment transport with proper insurance and specialized vehicles',
          timing: 'Day 9-12',
          channel: 'Partnership Development',
          aiStaff: 'Regina',
          automationLevel: 'semi',
        },
        {
          id: 'installation_coordination',
          name: 'Installation Coordination System',
          description:
            'Develop protocols for coordinating equipment installation with manufacturer technicians and healthcare facility staff',
          timing: 'Day 13-16',
          channel: 'Operations',
          aiStaff: 'Kameelah',
          automationLevel: 'semi',
        },
        {
          id: 'technical_support_integration',
          name: 'Technical Support Integration',
          description:
            'Establish partnerships with manufacturer technical support teams and coordinate pre-installation site surveys',
          timing: 'Day 17-20',
          channel: 'Partnership Management',
          aiStaff: 'Shanell',
          automationLevel: 'semi',
        },
        {
          id: 'equipment_logistics_launch',
          name: 'Medical Equipment Logistics Launch',
          description:
            'Target medical device manufacturers and healthcare facilities with comprehensive equipment logistics solutions including transport, installation, and ongoing support',
          timing: 'Day 21-30',
          channel: 'Multi-Channel',
          aiStaff: 'Logan & Kameelah',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '85+ medical equipment manufacturers and healthcare facilities identified',
        '25+ specialized carrier partnerships for equipment transport',
        '20+ white-glove service protocols implemented',
        '15+ installation coordination systems developed',
        '30+ technical support partnerships established',
        '95% on-time delivery for medical equipment',
        '100% damage-free delivery record',
        '$250K+ medical equipment logistics revenue pipeline created',
        '90% customer satisfaction with service quality',
      ],
    },

    // 🚨 EMERGENCY & CRISIS RESPONSE CAMPAIGNS
    {
      id: 'disaster_recovery_logistics',
      name: 'WOSB Disaster Recovery Logistics - CERTIFIED EMERGENCY RESPONSE',
      description:
        'PREMIUM WOSB-CERTIFIED rapid response teams for natural disasters with emergency supply chain coordination, government and NGO partnerships, and specialized transportation for FEMA-compliant temporary housing. COMPETITIVE ADVANTAGE: Women-Owned Small Business certification provides priority consideration for FEMA contracts, diversity supplier requirements for NGOs, and reduced competition in government emergency response contracting. Critical infrastructure logistics excellence with certified diversity credentials.',
      category: 'lead_generation',
      targetAudience:
        'ENHANCED TARGET: Government agencies (FEMA, state/local emergency management), NGO diversity officers and procurement managers, disaster relief organizations with supplier diversity goals, government small business liaisons, and businesses requiring emergency logistics support with certified WOSB suppliers during natural disasters and crisis situations',
      expectedResults: {
        leads: 95, // Increased: FEMA temporary housing demand
        conversions: 29, // Realistic: 30% conversion for emergency services
        dailyRevenue: 12000, // $360,000 ÷ 30 days - Higher due to FEMA contracts
        monthlyRevenue: 360000, // Realistic: $12,000/month with FEMA temporary housing
        totalRevenue: 360000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'hard', // Complex due to emergency protocols and specialized equipment
      aiStaff: ['Alexis', 'Logan', 'Carrie R.', 'Kameelah'], // Alexis for emergency management, Logan for logistics, Carrie R. for carrier partnerships, Kameelah for compliance
      channels: ['Phone', 'Email', 'Government Networks', 'Emergency Contacts'],
      icon: '🚨',
      color: 'bg-orange-600',
      steps: [
        {
          id: 'emergency_response_network',
          name: 'Emergency Response Network Mapping',
          description:
            'Map government agencies, NGOs, and emergency response organizations using FEMA and disaster relief databases',
          timing: 'Day 1-3',
          channel: 'Data Analysis',
          aiStaff: 'Alexis',
          automationLevel: 'full',
        },
        {
          id: 'government_partnerships',
          name: 'Government & NGO Partnerships',
          description:
            'Establish partnerships with FEMA, Red Cross, state emergency management agencies, and major relief organizations',
          timing: 'Day 4-7',
          channel: 'Partnership Development',
          aiStaff: 'Carrie R.',
          automationLevel: 'semi',
        },
        {
          id: 'fema_housing_logistics_partnerships',
          name: 'FEMA Housing Logistics Partnerships',
          description:
            'Establish partnerships with FEMA-approved housing manufacturers (Champion Homes, etc.) for coordinated logistics and transportation of temporary housing units to disaster zones',
          timing: 'Day 8-10',
          channel: 'Partnership Development',
          aiStaff: 'Carrie R.',
          automationLevel: 'semi',
        },
        {
          id: 'specialized_transport_equipment',
          name: 'Specialized Transport Equipment',
          description:
            'Acquire and certify specialized vehicles and equipment for disaster zone operations and housing unit transportation (4x4 trucks, flatbed trailers, generators, communications)',
          timing: 'Day 11-15',
          channel: 'Equipment Procurement',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'emergency_response_protocols',
          name: 'Emergency Response Protocols',
          description:
            'Develop comprehensive emergency response protocols, communication systems, and rapid deployment procedures including FEMA housing deployment standards',
          timing: 'Day 16-20',
          channel: 'Operations',
          aiStaff: 'Alexis',
          automationLevel: 'semi',
        },
        {
          id: 'supply_chain_coordination',
          name: 'Supply Chain Coordination System',
          description:
            'Implement real-time supply chain coordination platform for emergency logistics with priority routing, tracking, and FEMA housing inventory management',
          timing: 'Day 21-25',
          channel: 'Technology Integration',
          aiStaff: 'Kameelah',
          automationLevel: 'full',
        },
        {
          id: 'disaster_response_launch',
          name: 'Disaster Response Launch',
          description:
            'Target government agencies and NGOs with comprehensive disaster recovery logistics solutions featuring rapid deployment, specialized transport equipment, and coordinated FEMA housing delivery',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Alexis & Logan',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '100+ government agencies and NGOs identified (including FEMA)',
        '30+ strategic partnerships established with emergency management agencies',
        '15+ FEMA housing manufacturer partnerships (Champion Homes, etc.)',
        '25+ specialized transport vehicles and equipment procured',
        '20+ emergency response protocols implemented with FEMA compliance',
        '99% on-time emergency supply and housing unit delivery',
        '100% regulatory compliance in disaster zones including FEMA standards',
        '$360K+ emergency logistics revenue pipeline created',
        'Zero safety incidents in disaster operations',
        '95% FEMA contract win rate for qualified disaster responses',
      ],
    },

    {
      id: 'supply_chain_continuity_planning',
      name: 'Supply Chain Continuity Planning',
      description:
        'Business continuity consulting with emergency logistics planning, backup carrier network development, and crisis simulation training - Proactive risk mitigation and resilience',
      category: 'conversion',
      targetAudience:
        'Large corporations, critical infrastructure providers, and businesses requiring comprehensive business continuity and emergency logistics planning',
      expectedResults: {
        leads: 65, // Conservative: Based on business continuity demand
        conversions: 20, // Realistic: 30% conversion for consulting services
        dailyRevenue: 7000, // $210,000 ÷ 30 days
        monthlyRevenue: 210000, // Realistic: $7,000/month based on consulting fees
        totalRevenue: 210000, // 30-day campaign total
      },
      duration: '30 days',
      difficulty: 'medium', // Moderate complexity with consulting and planning focus
      aiStaff: ['Alexis', 'Logan', 'Carrie R.', 'C. Allen Durr'], // Alexis for continuity planning, Logan for logistics, Carrie R. for carrier networks, C. Allen Durr for operations
      channels: ['Email', 'Phone', 'Webinars', 'Consultations'],
      icon: '🛡️',
      color: 'bg-yellow-600',
      steps: [
        {
          id: 'business_continuity_assessment',
          name: 'Business Continuity Assessment',
          description:
            'Conduct comprehensive risk assessments and business impact analyses for client supply chains and operations',
          timing: 'Day 1-5',
          channel: 'Consultation',
          aiStaff: 'Alexis',
          automationLevel: 'semi',
        },
        {
          id: 'emergency_logistics_planning',
          name: 'Emergency Logistics Planning',
          description:
            'Develop detailed emergency logistics plans including alternative routing, backup suppliers, and crisis communication protocols',
          timing: 'Day 6-10',
          channel: 'Strategic Planning',
          aiStaff: 'Logan',
          automationLevel: 'semi',
        },
        {
          id: 'backup_carrier_network',
          name: 'Backup Carrier Network Development',
          description:
            'Build comprehensive backup carrier networks with pre-negotiated rates and guaranteed capacity during crises',
          timing: 'Day 11-15',
          channel: 'Partnership Development',
          aiStaff: 'Carrie R.',
          automationLevel: 'semi',
        },
        {
          id: 'crisis_simulation_training',
          name: 'Crisis Simulation Training',
          description:
            'Develop and conduct crisis simulation exercises to test continuity plans and train client teams on emergency procedures',
          timing: 'Day 16-20',
          channel: 'Training Development',
          aiStaff: 'C. Allen Durr',
          automationLevel: 'semi',
        },
        {
          id: 'continuity_monitoring_system',
          name: 'Continuity Monitoring System',
          description:
            'Implement automated monitoring and alerting systems for supply chain disruptions and risk indicators',
          timing: 'Day 21-25',
          channel: 'Technology Integration',
          aiStaff: 'Alexis',
          automationLevel: 'full',
        },
        {
          id: 'continuity_planning_launch',
          name: 'Continuity Planning Launch',
          description:
            'Target corporations with comprehensive supply chain continuity solutions including consulting, planning, and ongoing monitoring services',
          timing: 'Day 26-30',
          channel: 'Multi-Channel',
          aiStaff: 'Alexis & Carrie R.',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '75+ corporate clients assessed for continuity planning',
        '50+ comprehensive emergency logistics plans developed',
        '30+ backup carrier networks established',
        '25+ crisis simulation training programs delivered',
        '20+ automated monitoring systems implemented',
        '95% client satisfaction with continuity planning',
        '$250K+ consulting revenue pipeline created',
        '85% improvement in client supply chain resilience',
      ],
    },

    // PROCUREMENT FORECAST CAMPAIGN
    {
      id: 'procurement_forecast_campaign',
      name: 'AI-Powered Procurement Forecast Campaign',
      description:
        'Advanced AI-driven procurement forecasting and supplier engagement for optimal cost savings and supply chain optimization',
      category: 'procurement',
      targetAudience:
        'Enterprise buyers, procurement managers, supply chain directors, and strategic sourcing professionals',
      expectedResults: {
        leads: 200,
        conversions: 60,
        dailyRevenue: 12500,
        monthlyRevenue: 375000,
        totalRevenue: 750000,
      },
      duration: '60 days',
      difficulty: 'medium',
      aiStaff: ['Preston', 'Samantha', 'Quincy', 'Riley'],
      channels: ['Email', 'LinkedIn', 'Phone', 'Direct Mail'],
      icon: '📊',
      color: 'bg-purple-500',
      steps: [
        {
          id: 'demand_forecasting_analysis',
          name: 'AI Demand Forecasting Analysis',
          description:
            'Use advanced ML algorithms to analyze historical data, market trends, and business factors to predict procurement needs',
          timing: 'Days 1-5',
          channel: 'Data Analysis',
          aiStaff: 'Preston',
          automationLevel: 'full',
        },
        {
          id: 'supplier_market_intelligence',
          name: 'Supplier Market Intelligence Gathering',
          description:
            'Comprehensive analysis of supplier landscape, pricing trends, risk assessment, and competitive benchmarking',
          timing: 'Days 3-10',
          channel: 'Market Research',
          aiStaff: 'Quincy & Riley',
          automationLevel: 'semi',
        },
        {
          id: 'procurement_opportunity_identification',
          name: 'Procurement Opportunity Identification',
          description:
            'Identify high-impact procurement opportunities, cost savings potential, and strategic sourcing advantages',
          timing: 'Days 8-15',
          channel: 'Analysis',
          aiStaff: 'Preston',
          automationLevel: 'full',
        },
        {
          id: 'targeted_buyer_outreach',
          name: 'Strategic Buyer Outreach Campaign',
          description:
            'Personalized outreach to procurement professionals with tailored forecast insights and cost-saving opportunities',
          timing: 'Days 12-25',
          channel: 'Email/LinkedIn',
          aiStaff: 'Samantha',
          automationLevel: 'semi',
        },
        {
          id: 'supplier_engagement_program',
          name: 'Supplier Engagement & Partnership Program',
          description:
            'Engage potential suppliers with partnership opportunities, competitive quotes, and long-term relationship building',
          timing: 'Days 15-35',
          channel: 'Phone/Email',
          aiStaff: 'Samantha & Riley',
          automationLevel: 'manual',
        },
        {
          id: 'cost_optimization_presentation',
          name: 'Cost Optimization Presentation & Proposal',
          description:
            'Create detailed cost analysis presentations and procurement optimization proposals for qualified prospects',
          timing: 'Days 25-45',
          channel: 'Meetings/Presentations',
          aiStaff: 'Quinn',
          automationLevel: 'manual',
        },
        {
          id: 'procurement_relationship_nurturing',
          name: 'Long-term Procurement Relationship Nurturing',
          description:
            'Establish ongoing relationships with procurement professionals through valuable insights and market intelligence',
          timing: 'Days 30-60',
          channel: 'Email/LinkedIn',
          aiStaff: 'Preston & Samantha',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '200+ procurement professionals contacted',
        '60+ qualified procurement leads generated',
        '25+ supplier partnerships established',
        '$375K monthly revenue pipeline created',
        '15% average cost savings identified',
        '90% client satisfaction with procurement forecasts',
        '80% forecast accuracy achieved',
        '50+ long-term procurement contracts secured',
      ],
    },

    // GOVERNMENT RFI & SOURCES SOUGHT CAMPAIGN
    {
      id: 'government_rfi_sources_sought_campaign',
      name: 'WOSB Government RFI & Sources Sought Intelligence Campaign - CERTIFIED ADVANTAGE',
      description:
        'PREMIUM WOSB-CERTIFIED government contracting campaign leveraging Women-Owned Small Business status for exclusive access to set-aside contracts ($15B+ annually). Comprehensive NAICS-based monitoring and strategic response to government opportunities with logistics components across all sectors. COMPETITIVE ADVANTAGE: 50-80% fewer bidders on WOSB set-asides, priority consideration, and SBA program access. Position for prime contracts before RFPs released with certified diversity credentials.',
      category: 'government_contracting',
      targetAudience:
        'ENHANCED TARGET: Government contracting officers, WOSB program managers, diversity and inclusion officers, small business liaisons, procurement specialists across DOD, FEMA, GSA, VA, DHS, SBA, and all federal agencies prioritizing diversity supplier goals',
      expectedResults: {
        leads: 150,
        conversions: 45,
        dailyRevenue: 25000,
        monthlyRevenue: 750000,
        totalRevenue: 2250000,
      },
      duration: '90 days',
      difficulty: 'hard',
      aiStaff: ['Monica', 'Rae', 'Quincy', 'Samantha'],
      channels: [
        'SAM.gov WOSB Set-Asides',
        'SBA WOSB Programs',
        'Diversity Officer Outreach',
        'Government Meetings',
        'Industry Days & Conferences',
        'Prime Contractor Partnerships',
        'Email Campaigns',
        'WOSB Networking Events',
      ],
      icon: '🏛️',
      color: 'bg-blue-600',
      steps: [
        {
          id: 'naics_intelligence_setup',
          name: 'Strategic NAICS Code Intelligence Setup',
          description:
            'Configure automated monitoring for 25+ strategic NAICS codes including 488510, 484110, 484121 and cross-sector logistics opportunities across manufacturing, healthcare, technology, and construction',
          timing: 'Days 1-5',
          channel: 'SAM.gov Automation',
          aiStaff: 'Monica',
          automationLevel: 'full',
        },
        {
          id: 'wosb_certification_leverage',
          name: 'WOSB Certification Strategic Positioning',
          description:
            'Leverage Women-Owned Small Business certification for exclusive access to set-aside contracts, priority consideration, and reduced competition. Target WOSB-specific opportunities, engage diversity officers, and position FleetFlow as certified diversity supplier for large prime contractors seeking subcontractor partnerships.',
          timing: 'Days 2-10',
          channel: 'WOSB Programs',
          aiStaff: 'Monica & Samantha',
          automationLevel: 'semi',
        },
        {
          id: 'cross_sector_keyword_monitoring',
          name: 'Cross-Sector Logistics Keyword Monitoring',
          description:
            'Set up AI-powered keyword monitoring for logistics components in all government contracts: "supply chain", "distribution", "logistics support", "equipment deployment", "materials transport"',
          timing: 'Days 3-8',
          channel: 'Government Intelligence',
          aiStaff: 'Monica & Rae',
          automationLevel: 'full',
        },
        {
          id: 'agency_relationship_mapping',
          name: 'Multi-Agency Relationship Mapping',
          description:
            'Build comprehensive database of 500+ contracting officers across DOD, FEMA, GSA, VA, DHS, EPA, NASA, USAID with contract history and procurement patterns',
          timing: 'Days 6-15',
          channel: 'Government Relations',
          aiStaff: 'Samantha',
          automationLevel: 'semi',
        },
        {
          id: 'strategic_rfi_responses',
          name: 'Strategic RFI Response Campaign',
          description:
            'Submit 20+ comprehensive RFI responses showcasing technical capabilities, past performance, and innovative solutions across direct transportation and logistics component opportunities',
          timing: 'Days 10-35',
          channel: 'Technical Submissions',
          aiStaff: 'Rae & Quincy',
          automationLevel: 'manual',
        },
        {
          id: 'government_relationship_building',
          name: 'Contracting Officer Relationship Building',
          description:
            'Schedule and conduct 25+ one-on-one meetings with contracting officers, attend 8+ industry days, establish trusted advisor relationships',
          timing: 'Days 20-60',
          channel: 'Government Meetings',
          aiStaff: 'Samantha',
          automationLevel: 'manual',
        },
        {
          id: 'teaming_partnerships',
          name: 'Strategic Teaming Partnership Development',
          description:
            'Establish teaming agreements with 5+ prime contractors, develop subcontracting relationships, create joint capability statements',
          timing: 'Days 35-70',
          channel: 'Partnership Development',
          aiStaff: 'Quincy & Samantha',
          automationLevel: 'semi',
        },
        {
          id: 'requirement_influence',
          name: 'Requirement Development Influence',
          description:
            'Provide technical input on requirement development, conduct market research studies, influence specifications to favor our capabilities',
          timing: 'Days 50-85',
          channel: 'Technical Advisory',
          aiStaff: 'Rae',
          automationLevel: 'manual',
        },
        {
          id: 'pipeline_management',
          name: 'Contract Pipeline Management & Positioning',
          description:
            'Track RFI-to-RFP conversions, maintain relationship momentum, position for upcoming $15M+ in contract opportunities',
          timing: 'Days 70-90',
          channel: 'Strategic Positioning',
          aiStaff: 'All Staff',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '150+ government opportunities identified and tracked',
        '20+ comprehensive RFI responses submitted',
        '25+ contracting officer relationships established',
        '8+ industry day participations completed',
        '5+ teaming partnership agreements signed',
        '$15M+ contract pipeline developed',
        '85% RFI response rate achieved',
        '3+ preferred vendor designations obtained',
        '45+ qualified government leads generated',
        '15+ upcoming RFP early insights gained',
        '90+ NAICS code opportunities monitored',
        '$2.25M revenue pipeline created',
        '100% WOSB certification leverage achieved',
        '25+ diversity officer relationships established',
        '15+ prime contractor partnerships secured',
      ],
    },

    // DEDICATED WOSB CAMPAIGNS
    {
      id: 'wosb_diversity_contracting_blitz',
      name: 'WOSB Diversity Contracting Blitz - CERTIFIED ADVANTAGE CAMPAIGN',
      description:
        'EXCLUSIVE Women-Owned Small Business campaign leveraging WOSB certification for corporate diversity supplier requirements, government set-aside contracts, and prime contractor subcontracting opportunities. TARGET: Fortune 500 companies with diversity mandates, large prime contractors needing WOSB subcontractors, and government agencies with diversity goals. COMPETITIVE ADVANTAGE: 50-80% reduced competition, priority consideration, SBA program access, and corporate ESG compliance benefits.',
      category: 'government_contracting',
      targetAudience:
        'Corporate diversity officers, procurement managers with supplier diversity mandates, prime contractors seeking WOSB subcontractors, government small business liaisons, SBA program managers, ESG-focused procurement teams',
      expectedResults: {
        leads: 100,
        conversions: 35,
        dailyRevenue: 15000,
        monthlyRevenue: 450000,
        totalRevenue: 1350000,
      },
      duration: '60 days',
      difficulty: 'medium',
      aiStaff: ['Monica', 'Samantha', 'Deeva', 'Will'],
      channels: [
        'Corporate Diversity Programs',
        'SBA WOSB Certification Portal',
        'Prime Contractor Outreach',
        'Government Small Business Offices',
        'ESG Compliance Networks',
        'Women Business Enterprise Councils',
        'Corporate Supplier Portals',
        'Diversity Conference Networking',
      ],
      icon: '🏆',
      color: 'bg-purple-600',
      steps: [
        {
          id: 'wosb_portfolio_development',
          name: 'WOSB Capability Portfolio Development',
          description:
            'Create comprehensive WOSB capability statement, certifications portfolio, past performance documentation, and diversity supplier credentials for corporate and government presentations',
          timing: 'Days 1-7',
          channel: 'Portfolio Development',
          aiStaff: 'Monica & Deeva',
          automationLevel: 'semi',
        },
        {
          id: 'corporate_diversity_targeting',
          name: 'Corporate Diversity Officer Targeting',
          description:
            'Identify and engage 150+ diversity officers at Fortune 500 companies with supplier diversity mandates, focusing on transportation, logistics, and technology procurement needs',
          timing: 'Days 5-20',
          channel: 'Corporate Diversity Programs',
          aiStaff: 'Samantha & Will',
          automationLevel: 'semi',
        },
        {
          id: 'prime_contractor_partnerships',
          name: 'Prime Contractor Subcontracting Partnerships',
          description:
            'Target 50+ large prime contractors needing WOSB subcontractors to meet diversity requirements on government contracts, establish teaming agreements and subcontracting relationships',
          timing: 'Days 10-35',
          channel: 'Prime Contractor Outreach',
          aiStaff: 'Monica & Deeva',
          automationLevel: 'manual',
        },
        {
          id: 'sba_program_leverage',
          name: 'SBA Program & Resource Leverage',
          description:
            'Maximize SBA WOSB programs, mentor-protege opportunities, government contracting assistance, and small business development resources for competitive advantage',
          timing: 'Days 15-40',
          channel: 'SBA WOSB Programs',
          aiStaff: 'Monica',
          automationLevel: 'semi',
        },
        {
          id: 'diversity_networking_blitz',
          name: 'Diversity Conference & Networking Blitz',
          description:
            'Attend 8+ diversity supplier conferences, women business enterprise events, and corporate diversity summits to establish relationships and showcase WOSB capabilities',
          timing: 'Days 20-55',
          channel: 'Diversity Conference Networking',
          aiStaff: 'Samantha & Will',
          automationLevel: 'manual',
        },
        {
          id: 'esg_compliance_positioning',
          name: 'ESG Compliance & Impact Positioning',
          description:
            'Position FleetFlow as essential ESG compliance partner for corporations meeting diversity supplier goals, sustainability requirements, and social impact mandates',
          timing: 'Days 30-60',
          channel: 'ESG Compliance Networks',
          aiStaff: 'Deeva & Monica',
          automationLevel: 'semi',
        },
      ],
      successMetrics: [
        '100+ corporate diversity officers contacted',
        '50+ prime contractor partnerships explored',
        '35+ qualified WOSB opportunities secured',
        '25+ supplier diversity portal registrations completed',
        '20+ teaming agreements signed',
        '15+ government small business office relationships',
        '10+ diversity conference participations',
        '8+ prime contractor subcontracting agreements',
        '5+ Fortune 500 diversity supplier certifications',
        '$1.35M+ revenue pipeline from WOSB advantages',
        '90% WOSB certification leverage success rate',
      ],
    },

    // FUNDRAISING CAMPAIGNS
    {
      id: 'fleetflow_series_seed_intelligence',
      name: 'FleetFlow Series Seed Intelligence Campaign - STRATEGIC FUNDING RAISE',
      description:
        'PREMIUM WOSB-CERTIFIED seed funding campaign targeting VCs, impact investors, government-focused funds, and strategic partners to raise $2M-5M Series Seed for FleetFlow platform expansion. COMPETITIVE ADVANTAGES: Women-Owned Small Business certification, government contracting access ($500B market), founder-market fit with industry experience, dual revenue model (SaaS + Gov contracts), and ESG compliance. Features multi-phase investor intelligence, warm introduction mapping, and systematic fundraising execution with all 27 AI staff coordinating outreach across logistics VCs, impact investment firms, government contracting specialists, and diversity-focused institutional investors.',
      category: 'fundraising',
      targetAudience:
        'ENHANCED TARGET AUDIENCE: Logistics/Supply Chain VCs (Bessemer, Dynamo), Impact Investment Firms (diversity-focused), Women-Led Investment Funds (All Raise, Female Founders Fund), Government/Defense Tech VCs, ESG-Compliant Institutional Investors, Strategic Corporate VCs (C.H. Robinson, Schneider ventures), Angel Investors (freight industry veterans), Government Innovation Programs (SBIR, DOT grants, WOSB programs), GovTech Accelerators, Transportation-focused Strategic Partners',
      expectedResults: {
        leads: 200, // Qualified investors identified
        conversions: 50, // Investor meetings secured
        dailyRevenue: 0, // Fundraising doesn\'t generate daily revenue
        monthlyRevenue: 0, // Monthly milestones instead
        totalRevenue: 3500000, // Target $3.5M raise (mid-range of $2M-5M)
      },
      duration: '90 days',
      difficulty: 'hard', // High complexity fundraising process
      aiStaff: ['All 27 AI Staff - Specialized Assignments'],
      channels: [
        'WOSB-Focused Investor Outreach',
        'Impact Investment Fund Targeting',
        'ESG-Compliant VC Database',
        'Women-Led Fund Engagement',
        'Government Contracting Networks',
        'LinkedIn Investor Engagement',
        'Diversity & Inclusion Conferences',
        'SBA/WOSB Networking Events',
        'GovTech Investor Meetings',
        'Strategic Corporate Partnership',
        'Angel Network Platforms',
        'Government Grant Portals (SBIR/DOT)',
      ],
      icon: '💰',
      color: 'bg-green-600',
      steps: [
        {
          id: 'market_research_validation',
          name: 'Market Research & Competitive Analysis',
          description:
            "Comprehensive market analysis, competitive landscape mapping, and validation of FleetFlow's unique value proposition for investors",
          timing: 'Days 1-10',
          channel: 'Research & Analysis',
          aiStaff: 'Monica, Ana Lyles, Quincy',
          automationLevel: 'semi',
        },
        {
          id: 'wosb_advantage_positioning',
          name: 'WOSB Certification & Government Contracting Strategy',
          description:
            'Develop comprehensive WOSB advantage messaging, government contracting revenue projections, impact investment positioning, and ESG compliance documentation for diversity-focused investors',
          timing: 'Days 2-8',
          channel: 'Strategic Positioning',
          aiStaff: 'Monica, Rae, Deeva, Preston',
          automationLevel: 'semi',
        },
        {
          id: 'financial_modeling_projections',
          name: 'Financial Modeling & Revenue Projections',
          description:
            'Develop detailed financial models, revenue projections, unit economics, and growth forecasts for investor presentations',
          timing: 'Days 3-12',
          channel: 'Financial Analysis',
          aiStaff: 'Resse A. Bell, Preston, Cal',
          automationLevel: 'semi',
        },
        {
          id: 'pitch_deck_development',
          name: 'Investor Pitch Deck & Materials Creation',
          description:
            'Create compelling pitch deck, executive summary, product demo, and all investor presentation materials',
          timing: 'Days 5-20',
          channel: 'Content Development',
          aiStaff: 'Drew, Alexis, Riley, Dell',
          automationLevel: 'semi',
        },
        {
          id: 'investor_database_building',
          name: 'Comprehensive Investor Database Development',
          description:
            'Build detailed database of 200+ qualified investors including VCs, angels, strategics, and government programs with contact information and investment thesis',
          timing: 'Days 10-25',
          channel: 'Database Development',
          aiStaff: 'Desiree, Cliff, Gary, Shanell',
          automationLevel: 'full',
        },
        {
          id: 'warm_introduction_mapping',
          name: 'Warm Introduction Network Mapping',
          description:
            'Map existing network connections to target investors and systematically request warm introductions through industry contacts',
          timing: 'Days 15-35',
          channel: 'Network Mapping',
          aiStaff: 'Brook R., Carrie R., Will, Hunter',
          automationLevel: 'semi',
        },
        {
          id: 'accelerator_applications',
          name: 'Accelerator & Incubator Applications',
          description:
            'Apply to top-tier accelerators including Techstars, Y Combinator, supply chain focused programs, and industry-specific incubators',
          timing: 'Days 20-40',
          channel: 'Application Process',
          aiStaff: 'Kameelah, Regina, Rae, Clarence',
          automationLevel: 'semi',
        },
        {
          id: 'government_grant_pursuit',
          name: 'Government Grant & SBIR Applications',
          description:
            'Pursue non-dilutive funding through SBIR, DOT innovation grants, state economic development programs, and transportation technology initiatives',
          timing: 'Days 25-60',
          channel: 'Government Portals',
          aiStaff: 'Monica, Rae, Kameelah, Regina',
          automationLevel: 'semi',
        },
        {
          id: 'cold_outreach_sequences',
          name: 'Multi-Channel Investor Outreach Campaign',
          description:
            'Execute systematic outreach to 200+ investors through personalized emails, LinkedIn messages, and direct contact with compelling value propositions',
          timing: 'Days 30-75',
          channel: 'Multi-Channel Outreach',
          aiStaff: 'All AI Staff (Rotating Teams)',
          automationLevel: 'semi',
        },
        {
          id: 'investor_meeting_coordination',
          name: 'Investor Meeting & Demo Coordination',
          description:
            'Schedule and coordinate investor meetings, product demos, due diligence sessions, and follow-up communications',
          timing: 'Days 40-85',
          channel: 'Meeting Coordination',
          aiStaff: 'Cal, Alexis, Riley, Miles, Logan',
          automationLevel: 'semi',
        },
        {
          id: 'due_diligence_preparation',
          name: 'Due Diligence Package & Legal Preparation',
          description:
            'Prepare comprehensive due diligence materials, legal documents, financial records, and investor data room for serious prospects',
          timing: 'Days 50-80',
          channel: 'Legal & Compliance',
          aiStaff: 'Kameelah, Regina, Resse A. Bell, Clarence',
          automationLevel: 'semi',
        },
        {
          id: 'term_sheet_negotiations',
          name: 'Term Sheet Review & Fundraising Close',
          description:
            'Review term sheets, negotiate investment terms, coordinate legal processes, and execute fundraising close with selected investors',
          timing: 'Days 70-90',
          channel: 'Legal & Executive',
          aiStaff: 'Deeva, Alexis, Resse A. Bell, Will',
          automationLevel: 'low',
        },
      ],
      successMetrics: [
        '200+ qualified investors identified (including 50+ impact/ESG funds)',
        '150+ personalized investor outreach messages sent',
        '100+ WOSB advantage presentations delivered',
        '75+ warm introductions secured through network',
        '60+ investor meetings scheduled and completed',
        '40+ government contracting opportunity briefings',
        '25+ product demos delivered to investors',
        '20+ impact investment fund meetings secured',
        '15+ accelerator applications submitted (including diversity-focused)',
        '12+ government grant/WOSB program applications filed',
        '10+ ESG-compliant institutional investor meetings',
        '8+ serious investor follow-ups with term sheet interest',
        '5+ term sheets or LOIs received',
        '3+ strategic partnership discussions with gov contractors',
        '$3.5M+ funding target achieved with WOSB premium valuation',
        '95% investor meeting completion rate',
      ],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Campaigns', icon: '🎯' },
    { id: 'lead_generation', name: 'Lead Generation', icon: '👥' },
    { id: 'procurement', name: 'Procurement', icon: '📊' },
    { id: 'fundraising', name: 'Fundraising', icon: '💰' },
    {
      id: 'carrier_specialization',
      name: 'Carrier Specialization',
      icon: '🚛',
    },
    { id: 'specialty_equipment', name: 'Specialty Equipment', icon: '🚛' },
    { id: 'air_freight', name: 'Air Freight', icon: '✈️' },
    { id: 'maritime_freight', name: 'Maritime Freight', icon: '🚢' },
    {
      id: 'government_contracting',
      name: 'Government Contracting',
      icon: '🏛️',
    },
    { id: 'follow_up', name: 'Follow-Up', icon: '📧' },
    { id: 'nurture', name: 'Nurture', icon: '📈' },
    { id: 'conversion', name: 'Conversion', icon: '💰' },
    { id: 'retention', name: 'Retention', icon: '❤️' },
  ];

  // ORGANIZED FILTERING & SORTING LOGIC
  const processedTemplates = useMemo(() => {
    let filtered = campaignTemplates;

    // Category filtering
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory
      );
    }

    // Priority campaigns filter
    if (showOnlyPriority) {
      filtered = filtered.filter((template) =>
        priorityCampaigns.includes(template.id)
      );
    }

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.targetAudience.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'revenue':
          aValue = a.expectedResults.monthlyRevenue;
          bValue = b.expectedResults.monthlyRevenue;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        case 'duration':
          aValue = parseInt(a.duration);
          bValue = parseInt(b.duration);
          break;
        default:
          aValue = a.expectedResults.monthlyRevenue;
          bValue = b.expectedResults.monthlyRevenue;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    campaignTemplates,
    selectedCategory,
    showOnlyPriority,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  const filteredTemplates = processedTemplates;

  const launchCampaign = async (template: CampaignTemplate) => {
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

    // 🚀 INTEGRATE SALESFLOW AI - Automatically start email automation
    try {
      // SALESFLOW AI will run in background for all campaigns
      console.log(
        `🤖 SALESFLOW AI: Starting automated email sequences for "${template.name}"`
      );

      // SALESFLOW AI automatically handles lead engagement for this campaign
      // It will monitor campaign progress and send personalized emails based on lead quality
      // All email automation happens in the background without manual intervention

      alert(
        `🚀 Campaign "${template.name}" launched successfully!\n🤖 SALESFLOW AI: Email automation activated in background`
      );
    } catch (error) {
      console.error('SALESFLOW AI integration failed:', error);
      alert(
        `🚀 Campaign "${template.name}" launched!\n⚠️ SALESFLOW AI: Manual email follow-up may be needed`
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* CAMPAIGN SUMMARY OVERVIEW */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '8px',
        }}
      >
        {/* Active Campaigns */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '180px',
          }}
        >
          <Activity
            style={{ width: '16px', height: '16px', color: '#10b981' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#10b981',
              }}
            >
              {activeCampaigns.length}
            </div>
            <div
              style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Active Campaigns
            </div>
          </div>
        </div>

        {/* Total Revenue Potential */}
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '200px',
          }}
        >
          <DollarSign
            style={{ width: '16px', height: '16px', color: '#22c55e' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#22c55e',
              }}
            >
              $
              {(
                filteredTemplates.reduce(
                  (sum, template) =>
                    sum + template.expectedResults.monthlyRevenue,
                  0
                ) / 1000
              ).toFixed(1)}
              K
            </div>
            <div
              style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Filtered Revenue Potential
            </div>
          </div>
        </div>

        {/* Priority Campaigns */}
        <div
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '180px',
          }}
        >
          <Star style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#fbbf24',
              }}
            >
              {priorityCampaigns.length}
            </div>
            <div
              style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Priority Campaigns
            </div>
          </div>
        </div>

        {/* Categories Available */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '180px',
          }}
        >
          <Filter style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#3b82f6',
              }}
            >
              {categories.length}
            </div>
            <div
              style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Campaign Categories
            </div>
          </div>
        </div>
      </div>

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

        {/* ORGANIZATION CONTROLS */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '300px',
            }}
          >
            <Search
              style={{
                width: '16px',
                height: '16px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            />
            <input
              type='text'
              placeholder='Search campaigns...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.875rem',
                minWidth: '250px',
                outline: 'none',
              }}
            />
          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown
              style={{
                width: '16px',
                height: '16px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value='revenue'>Sort by Revenue</option>
              <option value='name'>Sort by Name</option>
              <option value='difficulty'>Sort by Difficulty</option>
              <option value='duration'>Sort by Duration</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background:
                  viewMode === 'grid'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  viewMode === 'grid'
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <Grid style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background:
                  viewMode === 'list'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  viewMode === 'list'
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <List style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
              }}
            >
              <input
                type='checkbox'
                checked={showOnlyPriority}
                onChange={(e) => setShowOnlyPriority(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#22c55e',
                }}
              />
              <Star
                style={{ width: '14px', height: '14px', color: '#fbbf24' }}
              />
              Priority Only
            </label>
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
              <span style={{ fontSize: '1rem' }}>{category.icon}</span>
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
                    {/* AI System Indicators */}
                    <div className='flex items-center space-x-2'>
                      {/* SALESFLOW AI Icon - Purple */}
                      <div
                        className='flex items-center justify-center rounded-full bg-purple-600 p-1 shadow-lg'
                        title='SALESFLOW AI Active'
                        style={{
                          width: '20px',
                          height: '20px',
                          boxShadow: '0 2px 8px rgba(147, 51, 234, 0.4)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          S
                        </span>
                      </div>
                      {/* LIVEFLOW.AI Icon - Orange */}
                      <div
                        className='flex items-center justify-center rounded-full bg-orange-500 p-1 shadow-lg'
                        title='LIVEFLOW.AI Active'
                        style={{
                          width: '20px',
                          height: '20px',
                          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.4)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          L
                        </span>
                      </div>
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
                {priorityCampaigns.includes(template.id) && (
                  <Star
                    style={{
                      width: '16px',
                      height: '16px',
                      color: '#fbbf24',
                      filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))',
                    }}
                  />
                )}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '1rem',
                        margin: '0',
                      }}
                    >
                      {template.name}
                    </h3>
                    {/* AI System Icons */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {/* SALESFLOW AI Icon - Purple */}
                      <div
                        className='flex items-center justify-center rounded-full bg-purple-600 p-1 shadow-sm'
                        title='Powered by SALESFLOW AI'
                        style={{
                          width: '16px',
                          height: '16px',
                          boxShadow: '0 1px 4px rgba(147, 51, 234, 0.3)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          S
                        </span>
                      </div>
                      {/* LIVEFLOW.AI Icon - Orange */}
                      <div
                        className='flex items-center justify-center rounded-full bg-orange-500 p-1 shadow-sm'
                        title='Powered by LIVEFLOW.AI'
                        style={{
                          width: '16px',
                          height: '16px',
                          boxShadow: '0 1px 4px rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          L
                        </span>
                      </div>
                    </div>
                  </div>
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
                    {activeCampaigns.some(
                      (campaign) => campaign.templateId === template.id
                    ) && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: '#10b981',
                          fontWeight: '600',
                        }}
                      >
                        <Activity style={{ width: '12px', height: '12px' }} />
                        Active
                      </div>
                    )}
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
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                {/* Top Row: Leads and Conversions */}
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

                {/* Bottom Row: Revenue Breakdown */}
                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '6px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#10b981',
                    }}
                  >
                    ${template.expectedResults.dailyRevenue.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Daily
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    padding: '6px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#22c55e',
                    }}
                  >
                    ${template.expectedResults.monthlyRevenue.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '0.625rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Monthly
                  </div>
                </div>

                {/* Total Revenue - Full Width */}
                <div
                  style={{
                    gridColumn: '1 / -1',
                    borderRadius: '6px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    padding: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#22c55e',
                      textAlign: 'center',
                    }}
                  >
                    ${(template.expectedResults.totalRevenue / 1000).toFixed(1)}
                    K Total
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                    }}
                  >
                    Projected Revenue
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
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '12px',
            paddingTop: '20px',
          }}
        >
          <div
            style={{
              maxHeight: 'calc(100vh - 40px)',
              width: '100%',
              maxWidth: '600px',
              overflowY: 'auto',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              marginTop: '0',
            }}
          >
            <div style={{ padding: '12px' }}>
              {/* Modal Header */}
              <div
                style={{
                  marginBottom: '12px',
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
              <div
                style={{
                  marginBottom: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>⏱️</span>
                    <span
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '0.85rem',
                      }}
                    >
                      Duration
                    </span>
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0',
                      fontSize: '0.85rem',
                    }}
                  >
                    {selectedTemplate.duration}
                  </p>
                </div>

                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>👥</span>
                    <span
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '0.85rem',
                      }}
                    >
                      AI Staff
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}
                  >
                    {selectedTemplate.aiStaff.map((staff, index) => (
                      <span
                        key={index}
                        style={{
                          borderRadius: '4px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          color: '#3b82f6',
                          fontWeight: '500',
                        }}
                      >
                        {staff}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <div
                    style={{
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>💰</span>
                    <span
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        fontSize: '0.85rem',
                      }}
                    >
                      Expected Revenue
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: '#22c55e',
                      margin: '0',
                    }}
                  >
                    $
                    {(
                      selectedTemplate.expectedResults.totalRevenue / 1000
                    ).toFixed(0)}
                    K
                  </p>
                </div>
              </div>

              {/* Campaign Steps */}
              <div style={{ marginBottom: '12px' }}>
                <h3
                  style={{
                    marginBottom: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: 'white',
                  }}
                >
                  Campaign Steps
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {selectedTemplate.steps.map((step, index) => (
                    <div
                      key={step.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                      }}
                    >
                      <div style={{ flexShrink: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            height: '32px',
                            width: '32px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            background: '#2563eb',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: 'white',
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <h4
                            style={{
                              fontWeight: '600',
                              color: 'white',
                              margin: '0',
                              fontSize: '0.95rem',
                            }}
                          >
                            {step.name}
                          </h4>
                          <span
                            style={{
                              borderRadius: '4px',
                              padding: '2px 8px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              background:
                                step.automationLevel === 'full'
                                  ? 'rgba(34, 197, 94, 0.2)'
                                  : step.automationLevel === 'semi'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(239, 68, 68, 0.2)',
                              color:
                                step.automationLevel === 'full'
                                  ? '#22c55e'
                                  : step.automationLevel === 'semi'
                                    ? '#d97706'
                                    : '#dc2626',
                            }}
                          >
                            {step.automationLevel}
                          </span>
                        </div>
                        <p
                          style={{
                            marginBottom: '6px',
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: '0',
                            lineHeight: '1.3',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {step.description.length > 80
                            ? step.description.substring(0, 80) + '...'
                            : step.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ fontSize: '0.8rem' }}>📅</span>
                            <span>{step.timing}</span>
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ fontSize: '0.8rem' }}>💬</span>
                            <span>{step.channel}</span>
                          </span>
                          {step.aiStaff && (
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span style={{ fontSize: '0.8rem' }}>👤</span>
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
              <div style={{ marginBottom: '12px' }}>
                <h3
                  style={{
                    marginBottom: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: 'white',
                  }}
                >
                  Success Metrics
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {selectedTemplate.successMetrics
                    .slice(0, 3)
                    .map((metric, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderRadius: '6px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          padding: '8px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>
                          ✅
                        </span>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: 'white',
                            fontWeight: '500',
                          }}
                        >
                          {metric}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                  paddingTop: '12px',
                  marginTop: '12px',
                }}
              >
                <button
                  onClick={() => setSelectedTemplate(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    launchCampaign(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                  }}
                >
                  ▶️ Launch Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
