'use client';

import React, { useState, useEffect } from 'react';

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
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost';
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

export default function BrokerShipperAcquisition({ brokerId }: BrokerShipperAcquisitionProps) {
  const [activeTab, setActiveTab] = useState<'prospects' | 'discovery' | 'campaigns' | 'analytics'>('prospects');
  const [prospects, setProspects] = useState<ShipperProspect[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all',
    leadScore: 'all'
  });
  const [selectedProspect, setSelectedProspect] = useState<ShipperProspect | null>(null);

  // Mock shipper prospect data
  useEffect(() => {
    const mockProspects: ShipperProspect[] = [
      {
        id: 'SP001',
        companyName: 'Pacific Manufacturing Corp',
        industry: 'Manufacturing',
        location: { city: 'Los Angeles', state: 'CA', zip: '90210' },
        annualFreightSpend: 2500000,
        shippingVolume: 850,
        primaryLanes: ['CA-TX', 'CA-IL', 'CA-FL'],
        equipmentNeeds: ['Dry Van', 'Flatbed'],
        decisionMaker: {
          name: 'Sarah Johnson',
          title: 'VP of Logistics',
          email: 'sjohnson@pacificmfg.com',
          phone: '(555) 123-4567'
        },
        leadScore: 92,
        leadSource: 'LinkedIn Outreach',
        status: 'qualified',
        lastContact: '2024-12-15',
        notes: [
          'Looking to reduce freight costs by 15%',
          'Current provider has poor communication',
          'Decision timeline: Q1 2025'
        ],
        competitorInfo: {
          currentProvider: 'MegaFreight Solutions',
          contractExpiry: '2025-03-31',
          painPoints: ['High rates', 'Poor service', 'Limited technology']
        }
      },
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
          phone: '(555) 987-6543'
        },
        leadScore: 88,
        leadSource: 'Referral',
        status: 'proposal_sent',
        lastContact: '2024-12-18',
        notes: [
          'Sustainability focus - carbon footprint reduction',
          'Interested in technology integration',
          'Budget approval needed from CFO'
        ]
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
          phone: '(555) 456-7890'
        },
        leadScore: 75,
        leadSource: 'Cold Email',
        status: 'contacted',
        lastContact: '2024-12-10',
        notes: [
          'Rapid growth company',
          'Need scalable solutions',
          'Price sensitive due to startup status'
        ]
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
          phone: '(555) 234-5678'
        },
        leadScore: 96,
        leadSource: 'Trade Show',
        status: 'negotiating',
        lastContact: '2024-12-19',
        notes: [
          'Seasonal volume fluctuations',
          'Temperature-controlled requirements',
          'Long-term partnership interest',
          'Contract negotiation in progress'
        ],
        competitorInfo: {
          currentProvider: 'AgriLogistics Pro',
          contractExpiry: '2025-06-30',
          painPoints: ['Seasonal capacity issues', 'Limited coverage', 'High reefer rates']
        }
      }
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
        roi: 340
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
        roi: 280
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
        roi: 520
      }
    ];

    setProspects(mockProspects);
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#6b7280';
      case 'contacted': return '#3b82f6';
      case 'qualified': return '#f59e0b';
      case 'proposal_sent': return '#8b5cf6';
      case 'negotiating': return '#f97316';
      case 'won': return '#22c55e';
      case 'lost': return '#ef4444';
      default: return '#6b7280';
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
      case 'linkedin': return '💼';
      case 'cold_email': return '📧';
      case 'direct_mail': return '📮';
      case 'phone': return '📞';
      case 'referral': return '👥';
      default: return '📈';
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    if (filters.status !== 'all' && prospect.status !== filters.status) return false;
    if (filters.industry !== 'all' && prospect.industry !== filters.industry) return false;
    if (filters.leadScore !== 'all') {
      const score = filters.leadScore;
      if (score === 'hot' && prospect.leadScore < 85) return false;
      if (score === 'warm' && (prospect.leadScore < 70 || prospect.leadScore >= 85)) return false;
      if (score === 'cold' && prospect.leadScore >= 70) return false;
    }
    return true;
  });

  return (
    <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '20px', padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          🏢 Shipper Acquisition & Business Development
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Discover, qualify, and convert high-value shippers into long-term partnerships
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[
          { id: 'prospects', label: 'Prospect Pipeline', icon: '👥', count: prospects.length },
          { id: 'discovery', label: 'Lead Discovery', icon: '🔍', count: null },
          { id: 'campaigns', label: 'Sales Campaigns', icon: '📊', count: campaigns.filter(c => c.status === 'active').length },
          { id: 'analytics', label: 'Performance Analytics', icon: '📈', count: null }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                : 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: activeTab === tab.id 
                ? 'none' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: activeTab === tab.id ? '0 8px 25px rgba(0, 0, 0, 0.3)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span style={{
                marginLeft: '8px',
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Prospect Pipeline Tab */}
      {activeTab === 'prospects' && (
        <div>
          {/* Pipeline Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { status: 'new', label: 'New Leads', count: prospects.filter(p => p.status === 'new').length, color: '#6b7280' },
              { status: 'contacted', label: 'Contacted', count: prospects.filter(p => p.status === 'contacted').length, color: '#3b82f6' },
              { status: 'qualified', label: 'Qualified', count: prospects.filter(p => p.status === 'qualified').length, color: '#f59e0b' },
              { status: 'proposal_sent', label: 'Proposals', count: prospects.filter(p => p.status === 'proposal_sent').length, color: '#8b5cf6' },
              { status: 'negotiating', label: 'Negotiating', count: prospects.filter(p => p.status === 'negotiating').length, color: '#f97316' },
              { status: 'won', label: 'Won', count: prospects.filter(p => p.status === 'won').length, color: '#22c55e' }
            ].map(item => (
              <div
                key={item.status}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer'
                }}
                onClick={() => setFilters({...filters, status: item.status})}
              >
                <div style={{ color: item.color, fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {item.count}
                </div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div>
              <label style={{ color: 'white', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Status Filter
              </label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiating">Negotiating</option>
                <option value="won">Won</option>
              </select>
            </div>

            <div>
              <label style={{ color: 'white', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Industry
              </label>
              <select 
                value={filters.industry}
                onChange={(e) => setFilters({...filters, industry: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Industries</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Technology">Technology</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>

            <div>
              <label style={{ color: 'white', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Lead Score
              </label>
              <select 
                value={filters.leadScore}
                onChange={(e) => setFilters({...filters, leadScore: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Scores</option>
                <option value="hot">Hot Leads (85+)</option>
                <option value="warm">Warm Leads (70-84)</option>
                <option value="cold">Cold Leads (&lt;70)</option>
              </select>
            </div>
          </div>

          {/* Prospects List */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {filteredProspects.map(prospect => (
              <div
                key={prospect.id}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedProspect(prospect)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {prospect.companyName}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                      {prospect.industry} • {prospect.location.city}, {prospect.location.state}
                    </p>
                  </div>
                  <div style={{
                    background: getStatusColor(prospect.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {prospect.status.replace('_', ' ')}
                  </div>
                </div>

                {/* Lead Score & Value */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '4px' }}>
                      Lead Score
                    </div>
                    <div style={{ 
                      color: getLeadScoreColor(prospect.leadScore), 
                      fontSize: '20px', 
                      fontWeight: 'bold' 
                    }}>
                      {prospect.leadScore}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '4px' }}>
                      Annual Spend
                    </div>
                    <div style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold' }}>
                      ${(prospect.annualFreightSpend / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>

                {/* Volume & Equipment */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '8px' }}>
                    Shipping Details
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: 'white', fontSize: '14px' }}>
                      {prospect.shippingVolume} loads/month
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {prospect.equipmentNeeds.map(equipment => (
                      <span
                        key={equipment}
                        style={{
                          background: 'rgba(249,115,22,0.2)',
                          color: '#f97316',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {equipment}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decision Maker */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '4px' }}>
                    Decision Maker
                  </div>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                    {prospect.decisionMaker.name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                    {prospect.decisionMaker.title}
                  </div>
                </div>

                {/* Primary Lanes */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '8px' }}>
                    Primary Lanes
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                    {prospect.primaryLanes.join(' • ')}
                  </div>
                </div>

                {/* Last Contact & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                      Last Contact: {new Date(prospect.lastContact).toLocaleDateString()}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                      Source: {prospect.leadSource}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      background: 'rgba(59,130,246,0.2)',
                      border: '1px solid #3b82f6',
                      color: '#3b82f6',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      📞 Call
                    </button>
                    <button style={{
                      background: 'rgba(34,197,94,0.2)',
                      border: '1px solid #22c55e',
                      color: '#22c55e',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      ✉️ Email
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Discovery Tab */}
      {activeTab === 'discovery' && (
        <div>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              🔍 Lead Discovery & Prospecting
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Discover and research potential shippers using advanced search tools
            </p>
          </div>

          {/* Discovery Tools */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {[
              {
                title: 'Industry Database Search',
                description: 'Search by industry, location, and company size',
                icon: '🏭',
                color: '#3b82f6'
              },
              {
                title: 'Government Contracts',
                description: 'Find companies with active federal contracts',
                icon: '🏛️',
                color: '#22c55e'
              },
              {
                title: 'Social Media Intelligence',
                description: 'LinkedIn and social platform prospecting',
                icon: '💼',
                color: '#8b5cf6'
              },
              {
                title: 'Trade Show Analytics',
                description: 'Exhibitor and attendee data mining',
                icon: '📊',
                color: '#f59e0b'
              }
            ].map((tool, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  background: `${tool.color}20`,
                  color: tool.color,
                  padding: '16px',
                  borderRadius: '50%',
                  fontSize: '32px',
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {tool.icon}
                </div>
                <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {tool.title}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px' }}>
                  {tool.description}
                </p>
                <button style={{
                  background: `${tool.color}20`,
                  color: tool.color,
                  border: `1px solid ${tool.color}`,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Start Discovery
                </button>
              </div>
            ))}
          </div>

          {/* Recent Discoveries */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}>
              🆕 Recent Discoveries
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                {
                  company: 'NextGen Electronics',
                  industry: 'Electronics',
                  location: 'San Jose, CA',
                  potential: '$1.2M annual',
                  source: 'Government contracts database'
                },
                {
                  company: 'Midwest Food Distribution',
                  industry: 'Food & Beverage',
                  location: 'Chicago, IL',
                  potential: '$850K annual',
                  source: 'LinkedIn intelligence'
                },
                {
                  company: 'Solar Solutions Inc',
                  industry: 'Renewable Energy',
                  location: 'Phoenix, AZ',
                  potential: '$2.1M annual',
                  source: 'Trade show data'
                }
              ].map((discovery, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr auto',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {discovery.company}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                      {discovery.industry} • {discovery.location}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
                      Source: {discovery.source}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#22c55e', fontSize: '16px', fontWeight: 'bold' }}>
                      {discovery.potential}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                      Potential Value
                    </div>
                  </div>
                  <div>
                    <button style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Add to Pipeline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sales Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                  📊 Sales Campaigns & Outreach
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
                  Manage and track your sales campaigns and outreach efforts
                </p>
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                + Create Campaign
              </button>
            </div>
          </div>

          {/* Campaign Performance Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {[
              { title: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length.toString(), color: '#22c55e' },
              { title: 'Total Prospects', value: campaigns.reduce((sum, c) => sum + c.prospects, 0).toString(), color: '#3b82f6' },
              { title: 'Response Rate', value: `${Math.round((campaigns.reduce((sum, c) => sum + c.responses, 0) / campaigns.reduce((sum, c) => sum + c.prospects, 0)) * 100)}%`, color: '#f59e0b' },
              { title: 'Average ROI', value: `${Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length)}%`, color: '#8b5cf6' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{ color: stat.color, fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                  {stat.title}
                </div>
              </div>
            ))}
          </div>

          {/* Campaigns List */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '24px', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>
                        {getCampaignTypeIcon(campaign.type)}
                      </span>
                      <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                        {campaign.name}
                      </h4>
                      <div style={{
                        background: campaign.status === 'active' ? '#22c55e' : 
                                   campaign.status === 'paused' ? '#f59e0b' : '#6b7280',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {campaign.status}
                      </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textTransform: 'capitalize' }}>
                      {campaign.type.replace('_', ' ')} Campaign
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                        {campaign.prospects}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                        Prospects
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold' }}>
                        {campaign.responses}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                        Responses
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold' }}>
                        {campaign.qualified}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                        Qualified
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#22c55e', fontSize: '20px', fontWeight: 'bold' }}>
                        {campaign.won}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                        Won
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {campaign.roi}%
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                      ROI
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              📈 Acquisition Performance Analytics
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
              Track and analyze your shipper acquisition performance metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {[
              {
                title: 'Pipeline Value',
                value: `$${(prospects.reduce((sum, p) => sum + p.annualFreightSpend, 0) / 1000000).toFixed(1)}M`,
                change: '+18.5%',
                icon: '💰',
                color: '#22c55e'
              },
              {
                title: 'Conversion Rate',
                value: `${Math.round((prospects.filter(p => p.status === 'won').length / prospects.length) * 100)}%`,
                change: '+2.3%',
                icon: '🎯',
                color: '#3b82f6'
              },
              {
                title: 'Average Deal Size',
                value: `$${Math.round(prospects.reduce((sum, p) => sum + p.annualFreightSpend, 0) / prospects.length / 1000)}K`,
                change: '+5.7%',
                icon: '📊',
                color: '#f59e0b'
              },
              {
                title: 'Sales Cycle',
                value: '45 days',
                change: '-8 days',
                icon: '⏱️',
                color: '#8b5cf6'
              }
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    background: `${metric.color}20`,
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '24px'
                  }}>
                    {metric.icon}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                      {metric.title}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                      vs last quarter
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: metric.color, fontSize: '32px', fontWeight: 'bold' }}>
                    {metric.value}
                  </div>
                </div>
                
                <div style={{ 
                  color: metric.change.startsWith('+') ? '#22c55e' : '#ef4444', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  {metric.change} vs last quarter
                </div>
              </div>
            ))}
          </div>

          {/* Performance by Source */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}>
              📊 Performance by Lead Source
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>
                Source
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>
                Leads
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>
                Qualified
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>
                Won
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>
                Rate
              </div>
            </div>

            {[
              { source: 'LinkedIn Outreach', leads: 45, qualified: 12, won: 3, rate: 6.7 },
              { source: 'Cold Email', leads: 120, qualified: 18, won: 4, rate: 3.3 },
              { source: 'Trade Shows', leads: 35, qualified: 15, won: 6, rate: 17.1 },
              { source: 'Referrals', leads: 25, qualified: 18, won: 8, rate: 32.0 }
            ].map((source, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}
              >
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                  {source.source}
                </div>
                <div style={{ color: 'white', fontSize: '14px' }}>
                  {source.leads}
                </div>
                <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600' }}>
                  {source.qualified}
                </div>
                <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                  {source.won}
                </div>
                <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>
                  {source.rate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

