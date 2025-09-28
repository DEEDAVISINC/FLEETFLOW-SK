'use client';

import { useEffect, useState } from 'react';

interface ShipperProspect {
  id: string;
  companyName: string;
  industry: string;
  location: {
    city: string;
    state: string;
    zip: string;
  };
  annualFreightSpend: number;
  shippingVolume: number;
  primaryLanes: string[];
  equipmentNeeds: string[];
  decisionMaker: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  leadScore: number;
  leadSource: string;
  status:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal_sent'
    | 'negotiating'
    | 'won'
    | 'lost';
  lastContact: string;
  notes: string[];
  competitorInfo?: {
    currentProvider: string;
    contractExpiry: string;
    painPoints: string[];
  };
}

interface CampaignData {
  id: string;
  name: string;
  type: 'cold_email' | 'linkedin' | 'direct_mail' | 'phone' | 'referral';
  status: 'active' | 'paused' | 'completed';
  prospects: number;
  responses: number;
  qualified: number;
  won: number;
  roi: number;
}

interface BrokerShipperAcquisitionProps {
  brokerId: string;
}

export default function BrokerShipperAcquisition({
  brokerId,
}: BrokerShipperAcquisitionProps) {
  const [activeTab, setActiveTab] = useState<
    'prospects' | 'discovery' | 'campaigns' | 'analytics'
  >('prospects');
  const [prospects, setProspects] = useState<ShipperProspect[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all',
    leadScore: 'all',
  });
  const [selectedProspect, setSelectedProspect] =
    useState<ShipperProspect | null>(null);

  // Mock data removed - real shipper prospects will populate from API
  useEffect(() => {
    const mockProspects: ShipperProspect[] = [];
    const mockCampaigns: CampaignData[] = [];

    setProspects(mockProspects);
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock prospect data structure (for reference)
  const mockProspectStructure = {
    phone: '(555) 123-4567',
    leadScore: 92,
    leadSource: 'LinkedIn Outreach',
    status: 'qualified',
    lastContact: '2024-12-15',
    notes: [
      'Looking to reduce freight costs by 15%',
      'Current provider has poor communication',
      'Decision timeline: Q1 2025',
    ],
    competitorInfo: {
      currentProvider: 'MegaFreight Solutions',
      contractExpiry: '2025-03-31',
      painPoints: ['High rates', 'Poor service', 'Limited technology'],
    },
  };

  // Additional prospect data would go here
  const additionalProspects = [
      {
        id: 'SP002',
        companyName: 'EcoRetail Distributors',
        industry: 'Retail',
        location: { city: 'Atlanta', state: 'GA', zip: '30309' },
        annualFreightSpend: 1800000,
        shippingVolume: 650,
        primaryLanes: ['GA-FL', 'GA-NC', 'GA-SC'],
        equipmentNeeds: ['Dry Van', 'Refrigerated'],
        decisionMaker: {
          name: 'Mike Chen',
          title: 'Supply Chain Director',
          email: 'mchen@ecoretail.com',
          phone: '(555) 987-6543',
        },
        leadScore: 88,
        leadSource: 'Referral',
        status: 'proposal_sent',
        lastContact: '2024-12-18',
        notes: [
          'Sustainability focus - carbon footprint reduction',
          'Interested in technology integration',
          'Budget approval needed from CFO',
        ],
      },
      {
        id: 'SP003',
        companyName: 'TechFlow Industries',
        industry: 'Technology',
        location: { city: 'Austin', state: 'TX', zip: '78701' },
        annualFreightSpend: 950000,
        shippingVolume: 320,
        primaryLanes: ['TX-CA', 'TX-WA', 'TX-NY'],
        equipmentNeeds: ['Dry Van'],
        decisionMaker: {
          name: 'Jennifer Davis',
          title: 'Operations Manager',
          email: 'jdavis@techflow.com',
          phone: '(555) 456-7890',
        },
        leadScore: 75,
        leadSource: 'Cold Email',
        status: 'contacted',
        lastContact: '2024-12-10',
        notes: [
          'Rapid growth company',
          'Need scalable solutions',
          'Price sensitive due to startup status',
        ],
      },
      {
        id: 'SP004',
        companyName: 'GreenField Agriculture',
        industry: 'Agriculture',
        location: { city: 'Des Moines', state: 'IA', zip: '50309' },
        annualFreightSpend: 3200000,
        shippingVolume: 1200,
        primaryLanes: ['IA-CA', 'IA-TX', 'IA-FL'],
        equipmentNeeds: ['Dry Van', 'Refrigerated', 'Specialized'],
        decisionMaker: {
          name: 'Robert Miller',
          title: 'Logistics Director',
          email: 'rmiller@greenfield-ag.com',
          phone: '(555) 234-5678',
        },
        leadScore: 96,
        leadSource: 'Trade Show',
        status: 'negotiating',
        lastContact: '2024-12-19',
        notes: [
          'Seasonal volume fluctuations',
          'Temperature-controlled requirements',
          'Long-term partnership interest',
          'Contract negotiation in progress',
        ],
        competitorInfo: {
          currentProvider: 'AgriLogistics Pro',
          contractExpiry: '2025-06-30',
          painPoints: [
            'Seasonal capacity issues',
            'Limited coverage',
            'High reefer rates',
          ],
        },
      },
    ];

    const mockCampaigns: CampaignData[] = [
      {
        id: 'C001',
        name: 'Manufacturing Outreach Q4',
        type: 'linkedin',
        status: 'active',
        prospects: 150,
        responses: 23,
        qualified: 8,
        won: 2,
        roi: 340,
      },
      {
        id: 'C002',
        name: 'Retail Cold Email Series',
        type: 'cold_email',
        status: 'active',
        prospects: 300,
        responses: 45,
        qualified: 12,
        won: 3,
        roi: 280,
      },
      {
        id: 'C003',
        name: 'Trade Show Follow-up',
        type: 'phone',
        status: 'completed',
        prospects: 75,
        responses: 52,
        qualified: 18,
        won: 5,
        roi: 520,
      },
    ];

    setProspects(mockProspects);
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#6b7280';
      case 'contacted':
        return '#3b82f6';
      case 'qualified':
        return '#f59e0b';
      case 'proposal_sent':
        return '#8b5cf6';
      case 'negotiating':
        return '#f97316';
      case 'won':
        return '#22c55e';
      case 'lost':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#84cc16';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'linkedin':
        return '💼';
      case 'cold_email':
        return '📧';
      case 'direct_mail':
        return '📮';
      case 'phone':
        return '📞';
      case 'referral':
        return '👥';
      default:
        return '📈';
    }
  };

  const filteredProspects = prospects.filter((prospect) => {
    if (filters.status !== 'all' && prospect.status !== filters.status)
      return false;
    if (filters.industry !== 'all' && prospect.industry !== filters.industry)
      return false;
    if (filters.leadScore !== 'all') {
      const score = filters.leadScore;
      if (score === 'hot' && prospect.leadScore < 85) return false;
      if (
        score === 'warm' &&
        (prospect.leadScore < 70 || prospect.leadScore >= 85)
      )
        return false;
      if (score === 'cold' && prospect.leadScore >= 70) return false;
    }
    return true;
  });

  return (
    <div>
      <h1>Broker Shipper Acquisition</h1>
    </div>
  );
}
