// ============================================================================
// FLEETFLOW CRM DASHBOARD - MODERN UPGRADED VERSION
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import {
  UserIdentifier,
  centralCRMService,
} from '../services/CentralCRMService';
import CRMTransferCenter from './CRMTransferCenter';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  contact_type: 'driver' | 'shipper' | 'carrier' | 'broker' | 'customer';
  company_name?: string;
  status: 'active' | 'inactive' | 'prospect' | 'blacklisted';
  lead_score: number;
  created_at: string;
}

interface Opportunity {
  id: string;
  opportunity_name: string;
  stage: string;
  value: number;
  probability: number;
  expected_close_date: string;
  contact_name: string;
  company_name: string;
  status: 'open' | 'won' | 'lost' | 'cancelled';
  origin_city?: string;
  destination_city?: string;
}

interface Activity {
  id: string;
  activity_type:
    | 'call'
    | 'email'
    | 'meeting'
    | 'task'
    | 'note'
    | 'sms'
    | 'quote'
    | 'follow_up';
  subject: string;
  activity_date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  contact_name: string;
  company_name: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface DashboardMetrics {
  total_contacts: number;
  total_opportunities: number;
  total_activities: number;
  pipeline_value: number;
  won_opportunities: number;
  conversion_rate: number;
  recent_activities: Activity[];
  top_opportunities: Opportunity[];
  lead_sources: Array<{ source: string; count: number }>;
  contact_types: Array<{ type: string; count: number }>;
  monthly_revenue: Array<{ month: string; revenue: number }>;
}

interface AIInsights {
  contact_health: string;
  engagement_level: string;
  next_best_action: string;
  risk_factors: string[];
  opportunities: string[];
  predicted_value: number;
}

// ============================================================================
// MAIN CRM DASHBOARD COMPONENT
// ============================================================================

export default function CRMDashboard() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'contacts'
    | 'transfers'
    | 'opportunities'
    | 'activities'
    | 'pipeline'
    | 'ai'
    | 'reports'
  >('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [currentUser, setCurrentUser] = useState<UserIdentifier | null>(null);

  // Mock data for development (in production, this would come from API)
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    total_contacts: 1247,
    total_opportunities: 89,
    total_activities: 2456,
    pipeline_value: 2850000,
    won_opportunities: 34,
    conversion_rate: 38.2,
    recent_activities: [
      {
        id: '1',
        activity_type: 'call',
        subject: 'Follow-up call with Walmart Logistics',
        activity_date: new Date().toISOString(),
        status: 'completed',
        contact_name: 'Sarah Johnson',
        company_name: 'Walmart Distribution',
        priority: 'high',
      },
      {
        id: '2',
        activity_type: 'quote',
        subject: 'Generated quote for Atlanta-Miami route',
        activity_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        contact_name: 'Mike Rodriguez',
        company_name: 'Home Depot Supply Chain',
        priority: 'urgent',
      },
      {
        id: '3',
        activity_type: 'email',
        subject: 'Contract renewal discussion',
        activity_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        contact_name: 'Jennifer Lee',
        company_name: 'Amazon Freight',
        priority: 'normal',
      },
    ],
    top_opportunities: [
      {
        id: '1',
        opportunity_name: 'Q1 2025 Contract Renewal - Walmart',
        stage: 'negotiation',
        value: 850000,
        probability: 85,
        expected_close_date: new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        contact_name: 'Sarah Johnson',
        company_name: 'Walmart Distribution',
        status: 'open',
        origin_city: 'Atlanta',
        destination_city: 'Multiple',
      },
      {
        id: '2',
        opportunity_name: 'Home Depot Southeast Expansion',
        stage: 'proposal',
        value: 450000,
        probability: 65,
        expected_close_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        contact_name: 'Mike Rodriguez',
        company_name: 'Home Depot Supply Chain',
        status: 'open',
        origin_city: 'Jacksonville',
        destination_city: 'Miami',
      },
    ],
    lead_sources: [
      { source: 'referrals', count: 45 },
      { source: 'website', count: 38 },
      { source: 'cold_outreach', count: 29 },
      { source: 'trade_shows', count: 22 },
    ],
    contact_types: [
      { type: 'shipper', count: 89 },
      { type: 'carrier', count: 76 },
      { type: 'driver', count: 234 },
      { type: 'broker', count: 45 },
    ],
    monthly_revenue: [
      { month: '2024-08', revenue: 185000 },
      { month: '2024-09', revenue: 225000 },
      { month: '2024-10', revenue: 198000 },
      { month: '2024-11', revenue: 267000 },
      { month: '2024-12', revenue: 312000 },
    ],
  });

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@walmart.com',
      phone: '(555) 123-4567',
      contact_type: 'shipper',
      company_name: 'Walmart Distribution',
      status: 'active',
      lead_score: 92,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      first_name: 'Mike',
      last_name: 'Rodriguez',
      email: 'mike.r@homedepot.com',
      phone: '(555) 234-5678',
      contact_type: 'shipper',
      company_name: 'Home Depot Supply Chain',
      status: 'active',
      lead_score: 78,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      first_name: 'Jennifer',
      last_name: 'Lee',
      email: 'jennifer.lee@amazon.com',
      phone: '(555) 345-6789',
      contact_type: 'shipper',
      company_name: 'Amazon Freight',
      status: 'prospect',
      lead_score: 85,
      created_at: new Date().toISOString(),
    },
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      opportunity_name: 'Q1 2025 Contract Renewal - Walmart',
      stage: 'negotiation',
      value: 850000,
      probability: 85,
      expected_close_date: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contact_name: 'Sarah Johnson',
      company_name: 'Walmart Distribution',
      status: 'open',
      origin_city: 'Atlanta',
      destination_city: 'Multiple',
    },
    {
      id: '2',
      opportunity_name: 'Home Depot Southeast Expansion',
      stage: 'proposal',
      value: 450000,
      probability: 65,
      expected_close_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contact_name: 'Mike Rodriguez',
      company_name: 'Home Depot Supply Chain',
      status: 'open',
      origin_city: 'Jacksonville',
      destination_city: 'Miami',
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>(
    dashboardMetrics.recent_activities
  );

  // Filters state
  const [contactFilters, setContactFilters] = useState({
    contact_type: '',
    status: '',
    search: '',
    limit: 10,
  });

  const [opportunityFilters, setOpportunityFilters] = useState({
    status: 'open',
    stage: '',
    search: '',
    limit: 10,
  });

  const [activityFilters, setActivityFilters] = useState({
    activity_type: '',
    status: '',
    priority: '',
    limit: 10,
  });

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      // In production, this would be a real API call
      // For now, we'll simulate loading with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard metrics');
      console.error('Dashboard metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeContact = async (contactId: string) => {
    setLoading(true);
    try {
      // Mock AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // In production, this would call the real AI analysis API
      console.log('AI analysis completed for contact:', contactId);
    } catch (err) {
      console.error('Contact analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchDashboardMetrics();
    loadCurrentUser();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadCurrentUser = async () => {
    try {
      // In production, get current user from auth context
      // For demo, we'll use the first broker user
      const users = await centralCRMService.getAllUsers();
      const demoUser = users.find((u) => u.department === 'BB') || users[0];
      setCurrentUser(demoUser);
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getTabColor = (tabId: string) => {
    const colors = {
      overview: '#3b82f6', // Blue - Overview/Dashboard
      contacts: '#22c55e', // Green - Call Log/Contacts
      transfers: '#f97316', // Orange - Transfers
      opportunities: '#8b5cf6', // Purple - Pipeline/Opportunities
      activities: '#eab308', // Yellow - Activities
      pipeline: '#ef4444', // Red - Sales Board
      ai: '#06b6d4', // Cyan - AI Insights
      reports: '#6b7280', // Gray - Reports
    };
    return colors[tabId as keyof typeof colors] || '#6b7280';
  };

  const getKPIColor = (kpiType: string) => {
    const colors = {
      contacts: '#22c55e', // Green - Total Contacts
      opportunities: '#8b5cf6', // Purple - Opportunities
      activities: '#eab308', // Yellow - Activities
      revenue: '#ef4444', // Red - Revenue
      conversion: '#06b6d4', // Cyan - Conversion Rate
      performance: '#f97316', // Orange - Performance
    };
    return colors[kpiType as keyof typeof colors] || '#3b82f6';
  };

  const getContactTypeColor = (type: string) => {
    const colors = {
      driver: 'bg-yellow-100 text-yellow-800',
      shipper: 'bg-blue-100 text-blue-800',
      carrier: 'bg-green-100 text-green-800',
      broker: 'bg-purple-100 text-purple-800',
      customer: 'bg-pink-100 text-pink-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getLeadScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cold';
    return 'Inactive';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return (
      colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderOverview = () => (
    <div style={{ padding: '0' }}>
      {/* Real-time KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${getKPIColor('contacts')}20, ${getKPIColor('contacts')}10)`,
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${getKPIColor('contacts')}40`,
            textAlign: 'center' as const,
            boxShadow: `0 4px 12px ${getKPIColor('contacts')}20`,
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: getKPIColor('contacts'),
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            👥 Total Contacts
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px',
            }}
          >
            {dashboardMetrics.total_contacts.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            +{Math.floor(dashboardMetrics.total_contacts * 0.08)} this month
          </div>
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, ${getKPIColor('opportunities')}20, ${getKPIColor('opportunities')}10)`,
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${getKPIColor('opportunities')}40`,
            textAlign: 'center' as const,
            boxShadow: `0 4px 12px ${getKPIColor('opportunities')}20`,
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: getKPIColor('opportunities'),
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            💰 Pipeline Value
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px',
            }}
          >
            {formatCurrency(dashboardMetrics.pipeline_value)}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {dashboardMetrics.total_opportunities} active opportunities
          </div>
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, ${getKPIColor('conversion')}20, ${getKPIColor('conversion')}10)`,
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${getKPIColor('conversion')}40`,
            textAlign: 'center' as const,
            boxShadow: `0 4px 12px ${getKPIColor('conversion')}20`,
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: getKPIColor('conversion'),
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            📈 Conversion Rate
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px',
            }}
          >
            {dashboardMetrics.conversion_rate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {dashboardMetrics.won_opportunities} won opportunities
          </div>
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, ${getKPIColor('activities')}20, ${getKPIColor('activities')}10)`,
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${getKPIColor('activities')}40`,
            textAlign: 'center' as const,
            boxShadow: `0 4px 12px ${getKPIColor('activities')}20`,
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: getKPIColor('activities'),
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            📅 Recent Activities
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px',
            }}
          >
            {dashboardMetrics.total_activities.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Last updated: {formatTime(lastRefresh.toISOString())}
          </div>
        </div>
      </div>

      {/* Recent Activities & Top Opportunities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🕒 Recent Activities
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {dashboardMetrics.recent_activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '500',
                      marginBottom: '4px',
                    }}
                  >
                    {activity.subject}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    {activity.contact_name} • {activity.company_name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color:
                        activity.priority === 'urgent'
                          ? '#dc2626'
                          : activity.priority === 'high'
                            ? '#f59e0b'
                            : '#3b82f6',
                      background:
                        activity.priority === 'urgent'
                          ? 'rgba(220, 38, 38, 0.1)'
                          : activity.priority === 'high'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(59, 130, 246, 0.1)',
                      marginBottom: '4px',
                    }}
                  >
                    {activity.activity_type.toUpperCase()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    {formatTime(activity.activity_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🎯 Top Opportunities
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {dashboardMetrics.top_opportunities
              .slice(0, 5)
              .map((opportunity) => (
                <div
                  key={opportunity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        marginBottom: '4px',
                      }}
                    >
                      {opportunity.opportunity_name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      {opportunity.contact_name} • {opportunity.company_name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div
                      style={{
                        color: '#10b981',
                        fontWeight: '600',
                        fontSize: '16px',
                        marginBottom: '2px',
                      }}
                    >
                      {formatCurrency(opportunity.value)}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      {opportunity.probability}% • {opportunity.stage}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* AI Customer Intelligence */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          🤖 AI Customer Intelligence
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(236, 72, 153, 0.3)',
            }}
          >
            <span style={{ fontSize: '24px' }}>❤️</span>
            <div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Relationship Intelligence
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}
              >
                Real-time analysis
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <span style={{ fontSize: '24px' }}>🎯</span>
            <div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Upselling Opportunities
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}
              >
                AI-powered insights
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <span style={{ fontSize: '24px' }}>📈</span>
            <div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Churn Prevention
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}
              >
                Predictive analytics
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <span style={{ fontSize: '24px' }}>📊</span>
            <div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Customer Analytics
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}
              >
                Advanced metrics
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          ⚡ Quick Actions
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }}
          >
            <span style={{ fontSize: '20px' }}>👥</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                View Contacts
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Manage customer relationships
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
            }}
          >
            <span style={{ fontSize: '20px' }}>🎯</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                View Pipeline
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Track sales opportunities
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
            }}
          >
            <span style={{ fontSize: '20px' }}>🤖</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                AI Insights
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Customer intelligence
              </div>
            </div>
          </button>

          <button
            onClick={fetchDashboardMetrics}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: loading
                ? 'rgba(107, 114, 128, 0.2)'
                : 'rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              border: `1px solid ${loading ? 'rgba(107, 114, 128, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>{loading ? '⏳' : '🔄'}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Update dashboard metrics
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div style={{ padding: '0' }}>
      {/* Modern Contact Management Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          📞 Call Log & Contact Management
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <select
            value={contactFilters.contact_type}
            onChange={(e) =>
              setContactFilters({
                ...contactFilters,
                contact_type: e.target.value,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Types
            </option>
            <option
              value='driver'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Driver
            </option>
            <option
              value='shipper'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Shipper
            </option>
            <option
              value='carrier'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Carrier
            </option>
            <option
              value='broker'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Broker
            </option>
            <option
              value='customer'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Customer
            </option>
          </select>

          <select
            value={contactFilters.status}
            onChange={(e) =>
              setContactFilters({ ...contactFilters, status: e.target.value })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Status
            </option>
            <option
              value='active'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Active
            </option>
            <option
              value='inactive'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Inactive
            </option>
            <option
              value='prospect'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Prospect
            </option>
            <option
              value='blacklisted'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Blacklisted
            </option>
          </select>

          <input
            type='text'
            placeholder='Search contacts...'
            value={contactFilters.search}
            onChange={(e) =>
              setContactFilters({ ...contactFilters, search: e.target.value })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          />

          <button
            onClick={() =>
              setContactFilters({
                contact_type: '',
                status: '',
                search: '',
                limit: 10,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              background: 'rgba(107, 114, 128, 0.2)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.2)';
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Enhanced Contact Cards */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Call Log Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📞 Recent Call Activity
            <button
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              Make New Call
            </button>
          </h3>

          {/* Call Log Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                }}
              >
                12
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Completed
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                3
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Missed
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                8
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Inbound
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                }}
              >
                7
              </div>
              <div
                style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Outbound
              </div>
            </div>
          </div>

          {/* Recent Calls List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                name: 'John Smith',
                company: 'ABC Logistics',
                phone: '+1 (555) 123-4567',
                time: '2:30 PM',
                type: 'outbound',
                status: 'completed',
                duration: '5:23',
              },
              {
                name: 'Sarah Johnson',
                company: 'Quick Transport',
                phone: '+1 (555) 987-6543',
                time: '1:15 PM',
                type: 'inbound',
                status: 'completed',
                duration: '12:45',
              },
              {
                name: 'Mike Davis',
                company: 'Metro Shipping',
                phone: '+1 (555) 456-7890',
                time: '12:00 PM',
                type: 'outbound',
                status: 'missed',
                duration: '0:00',
              },
            ].map((call, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background:
                        call.type === 'inbound'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(139, 92, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}
                  >
                    {call.type === 'inbound' ? '📞' : '📱'}
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      {call.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '11px',
                      }}
                    >
                      {call.company}
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '11px',
                      }}
                    >
                      {call.time}
                    </div>
                    <div
                      style={{
                        color:
                          call.status === 'completed' ? '#22c55e' : '#f59e0b',
                        fontSize: '10px',
                      }}
                    >
                      {call.status === 'completed'
                        ? `✅ ${call.duration}`
                        : '⚠️ Missed'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      📞
                    </button>
                    <button
                      style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#8b5cf6',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      📝
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Contacts ({contacts.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {contact.first_name[0]}
                  {contact.last_name[0]}
                </div>
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '500',
                      fontSize: '16px',
                      marginBottom: '4px',
                    }}
                  >
                    {contact.first_name} {contact.last_name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      marginBottom: '2px',
                    }}
                  >
                    {contact.email} • {contact.phone}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '13px',
                    }}
                  >
                    {contact.company_name}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color:
                      contact.contact_type === 'shipper'
                        ? '#3b82f6'
                        : contact.contact_type === 'carrier'
                          ? '#10b981'
                          : '#f59e0b',
                    background:
                      contact.contact_type === 'shipper'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : contact.contact_type === 'carrier'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${contact.contact_type === 'shipper' ? 'rgba(59, 130, 246, 0.3)' : contact.contact_type === 'carrier' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  }}
                >
                  {contact.contact_type.toUpperCase()}
                </div>
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color:
                      contact.lead_score >= 80
                        ? '#10b981'
                        : contact.lead_score >= 60
                          ? '#f59e0b'
                          : '#ef4444',
                    background:
                      contact.lead_score >= 80
                        ? 'rgba(16, 185, 129, 0.1)'
                        : contact.lead_score >= 60
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${contact.lead_score >= 80 ? 'rgba(16, 185, 129, 0.3)' : contact.lead_score >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  {contact.lead_score} - {getLeadScoreLabel(contact.lead_score)}
                </div>
                <button
                  onClick={() => analyzeContact(contact.id)}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    background: loading
                      ? 'rgba(107, 114, 128, 0.2)'
                      : 'rgba(139, 92, 246, 0.2)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background =
                        'rgba(139, 92, 246, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background =
                        'rgba(139, 92, 246, 0.2)';
                    }
                  }}
                >
                  {loading ? '🔄 Analyzing...' : '🤖 AI Analysis'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransfers = () => {
    const handleTransferComplete = (transferId: string) => {
      console.log(`✅ Transfer completed: ${transferId}`);
      // Refresh dashboard metrics or show success message
      setLastRefresh(new Date());
    };

    return (
      <CRMTransferCenter
        currentUser={currentUser || undefined}
        onTransferComplete={handleTransferComplete}
      />
    );
  };

  const renderOpportunities = () => (
    <div style={{ padding: '0' }}>
      {/* Modern Opportunity Management Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          🎯 Sales Pipeline
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <select
            value={opportunityFilters.status}
            onChange={(e) =>
              setOpportunityFilters({
                ...opportunityFilters,
                status: e.target.value,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Status
            </option>
            <option
              value='open'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Open
            </option>
            <option
              value='won'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Won
            </option>
            <option
              value='lost'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Lost
            </option>
            <option
              value='cancelled'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Cancelled
            </option>
          </select>

          <select
            value={opportunityFilters.stage}
            onChange={(e) =>
              setOpportunityFilters({
                ...opportunityFilters,
                stage: e.target.value,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Stages
            </option>
            <option
              value='lead'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Lead
            </option>
            <option
              value='qualified'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Qualified
            </option>
            <option
              value='proposal'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Proposal
            </option>
            <option
              value='negotiation'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Negotiation
            </option>
            <option
              value='closed won'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Closed Won
            </option>
          </select>

          <input
            type='text'
            placeholder='Search opportunities...'
            value={opportunityFilters.search}
            onChange={(e) =>
              setOpportunityFilters({
                ...opportunityFilters,
                search: e.target.value,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          />

          <button
            onClick={() =>
              setOpportunityFilters({
                status: 'open',
                stage: '',
                search: '',
                limit: 10,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              background: 'rgba(107, 114, 128, 0.2)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.2)';
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Enhanced Opportunity Cards */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Active Opportunities ({opportunities.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '16px',
                    marginBottom: '6px',
                  }}
                >
                  {opportunity.opportunity_name}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    marginBottom: '4px',
                  }}
                >
                  {opportunity.contact_name} • {opportunity.company_name}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                  }}
                >
                  {opportunity.origin_city} → {opportunity.destination_city}
                </div>
              </div>
              <div
                style={{
                  textAlign: 'right' as const,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    color: '#10b981',
                    fontWeight: '600',
                    fontSize: '18px',
                  }}
                >
                  {formatCurrency(opportunity.value)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color:
                        opportunity.probability >= 70
                          ? '#10b981'
                          : opportunity.probability >= 40
                            ? '#f59e0b'
                            : '#ef4444',
                      background:
                        opportunity.probability >= 70
                          ? 'rgba(16, 185, 129, 0.1)'
                          : opportunity.probability >= 40
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${opportunity.probability >= 70 ? 'rgba(16, 185, 129, 0.3)' : opportunity.probability >= 40 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    }}
                  >
                    {opportunity.probability}%
                  </div>
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#3b82f6',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    {opportunity.stage.toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px',
                  }}
                >
                  Close: {formatDate(opportunity.expected_close_date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div style={{ padding: '0' }}>
      {/* Modern Activity Management Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          📅 Activity Timeline
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          <select
            value={activityFilters.activity_type}
            onChange={(e) =>
              setActivityFilters({
                ...activityFilters,
                activity_type: e.target.value,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Types
            </option>
            <option
              value='call'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Call
            </option>
            <option
              value='email'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Email
            </option>
            <option
              value='meeting'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Meeting
            </option>
            <option
              value='task'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Task
            </option>
            <option
              value='note'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Note
            </option>
            <option
              value='quote'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Quote
            </option>
          </select>

          <select
            value={activityFilters.status}
            onChange={(e) =>
              setActivityFilters({ ...activityFilters, status: e.target.value })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Status
            </option>
            <option
              value='planned'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Planned
            </option>
            <option
              value='in_progress'
              style={{ background: '#1f2937', color: 'white' }}
            >
              In Progress
            </option>
            <option
              value='completed'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Completed
            </option>
            <option
              value='cancelled'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Cancelled
            </option>
          </select>

          <select
            value={activityFilters.priority}
            onChange={(e) =>
              setActivityFilters({
                ...activityFilters,
                priority: e.target.value,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value='' style={{ background: '#1f2937', color: 'white' }}>
              All Priority
            </option>
            <option
              value='low'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Low
            </option>
            <option
              value='normal'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Normal
            </option>
            <option
              value='high'
              style={{ background: '#1f2937', color: 'white' }}
            >
              High
            </option>
            <option
              value='urgent'
              style={{ background: '#1f2937', color: 'white' }}
            >
              Urgent
            </option>
          </select>

          <button
            onClick={() =>
              setActivityFilters({
                activity_type: '',
                status: '',
                priority: '',
                limit: 10,
              })
            }
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              background: 'rgba(107, 114, 128, 0.2)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.2)';
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Enhanced Activity Timeline */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Recent Activities ({activities.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    background:
                      activity.activity_type === 'call'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : activity.activity_type === 'email'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : activity.activity_type === 'quote'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(139, 92, 246, 0.2)',
                    border: `1px solid ${
                      activity.activity_type === 'call'
                        ? 'rgba(34, 197, 94, 0.3)'
                        : activity.activity_type === 'email'
                          ? 'rgba(59, 130, 246, 0.3)'
                          : activity.activity_type === 'quote'
                            ? 'rgba(245, 158, 11, 0.3)'
                            : 'rgba(139, 92, 246, 0.3)'
                    }`,
                  }}
                >
                  {activity.activity_type === 'call'
                    ? '📞'
                    : activity.activity_type === 'email'
                      ? '📧'
                      : activity.activity_type === 'quote'
                        ? '💰'
                        : activity.activity_type === 'meeting'
                          ? '🤝'
                          : '📝'}
                </div>
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '500',
                      fontSize: '16px',
                      marginBottom: '4px',
                    }}
                  >
                    {activity.subject}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      marginBottom: '2px',
                    }}
                  >
                    {activity.contact_name} • {activity.company_name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    {formatDate(activity.activity_date)} at{' '}
                    {formatTime(activity.activity_date)}
                  </div>
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color:
                      activity.priority === 'urgent'
                        ? '#dc2626'
                        : activity.priority === 'high'
                          ? '#f59e0b'
                          : '#3b82f6',
                    background:
                      activity.priority === 'urgent'
                        ? 'rgba(220, 38, 38, 0.1)'
                        : activity.priority === 'high'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(59, 130, 246, 0.1)',
                    border: `1px solid ${activity.priority === 'urgent' ? 'rgba(220, 38, 38, 0.3)' : activity.priority === 'high' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  }}
                >
                  {activity.priority.toUpperCase()}
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color:
                      activity.status === 'completed'
                        ? '#10b981'
                        : activity.status === 'in_progress'
                          ? '#f59e0b'
                          : '#6b7280',
                    background:
                      activity.status === 'completed'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : activity.status === 'in_progress'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                    border: `1px solid ${activity.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : activity.status === 'in_progress' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                  }}
                >
                  {activity.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div style={{ padding: '0' }}>
      {/* AI-Powered Customer Intelligence */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          🤖 AI Customer Intelligence Dashboard
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Predictive Analytics */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              📊 Predictive Analytics
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Churn Risk Score
                </span>
                <span style={{ color: '#ef4444', fontWeight: '600' }}>12%</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Upsell Probability
                </span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>78%</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Next Purchase Window
                </span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                  14 days
                </span>
              </div>
            </div>
          </div>

          {/* Engagement Insights */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              💬 Engagement Insights
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Response Time
                </span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>
                  2.3 hours
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Email Open Rate
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>84%</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Preferred Contact
                </span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                  Email
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Intelligence */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              💰 Revenue Intelligence
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Customer LTV
                </span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>
                  $485K
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Deal Size Prediction
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                  $125K
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Win Probability
                </span>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>72%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h3
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          🎯 AI-Powered Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div
              style={{
                color: '#10b981',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              🚀 High Priority Action
            </div>
            <div style={{ color: 'white', marginBottom: '6px' }}>
              Follow up with Walmart Distribution on Q1 2025 renewal
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
            >
              85% win probability • Expected value: $850K • Best contact time:
              2-4 PM EST
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div
              style={{
                color: '#f59e0b',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              💡 Upselling Opportunity
            </div>
            <div style={{ color: 'white', marginBottom: '6px' }}>
              Propose temperature-controlled service to Home Depot Supply Chain
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
            >
              Based on their recent pharmaceutical shipments • Potential
              additional revenue: $180K/year
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div
              style={{
                color: '#3b82f6',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              🤝 Relationship Building
            </div>
            <div style={{ color: 'white', marginBottom: '6px' }}>
              Schedule quarterly business review with Jennifer Lee at Amazon
              Freight
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
            >
              Last meaningful interaction: 45 days ago • High engagement score:
              85/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div style={{ padding: '0' }}>
      {/* Modern Pipeline Visualization */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          📈 Sales Pipeline Visualization
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'].map(
            (stage, index) => {
              const stageOpportunities = opportunities.filter(
                (opp) => opp.stage.toLowerCase() === stage.toLowerCase()
              );
              const stageValue = stageOpportunities.reduce(
                (sum, opp) => sum + opp.value,
                0
              );
              const stageColors = [
                '#6b7280',
                '#3b82f6',
                '#f59e0b',
                '#f97316',
                '#10b981',
              ];
              const stageColor = stageColors[index];

              return (
                <div
                  key={stage}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center' as const,
                  }}
                >
                  <div
                    style={{
                      color: stageColor,
                      fontWeight: '600',
                      marginBottom: '12px',
                      fontSize: '16px',
                    }}
                  >
                    {stage}
                  </div>
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {formatCurrency(stageValue)}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      marginBottom: '16px',
                    }}
                  >
                    {stageOpportunities.length} opportunities
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {stageOpportunities.slice(0, 2).map((opp) => (
                      <div
                        key={opp.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '8px',
                          borderRadius: '8px',
                          textAlign: 'left' as const,
                        }}
                      >
                        <div
                          style={{
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '2px',
                          }}
                        >
                          {opp.opportunity_name.length > 25
                            ? opp.opportunity_name.substring(0, 25) + '...'
                            : opp.opportunity_name}
                        </div>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {formatCurrency(opp.value)}
                        </div>
                      </div>
                    ))}
                    {stageOpportunities.length > 2 && (
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                          textAlign: 'center' as const,
                        }}
                      >
                        +{stageOpportunities.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div style={{ padding: '0' }}>
      {/* Modern Reports Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Monthly Revenue Trend */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            📊 Monthly Revenue Trend
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {dashboardMetrics.monthly_revenue.map((month) => (
              <div
                key={month.month}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: '500',
                  }}
                >
                  {new Date(month.month + '-01').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
                <div
                  style={{
                    color: '#10b981',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {formatCurrency(month.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            🎯 Performance Summary
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
            }}
          >
            <div style={{ textAlign: 'center' as const }}>
              <div
                style={{
                  color: '#3b82f6',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                {dashboardMetrics.total_contacts.toLocaleString()}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Total Contacts
              </div>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <div
                style={{
                  color: '#10b981',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                {dashboardMetrics.conversion_rate.toFixed(1)}%
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Conversion Rate
              </div>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <div
                style={{
                  color: '#8b5cf6',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
              >
                {formatCurrency(dashboardMetrics.pipeline_value)}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Pipeline Value
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // LOADING AND ERROR STATES - MODERNIZED
  // ============================================================================

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
          backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
          backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center' as const,
            maxWidth: '500px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
          <div
            style={{
              color: '#ef4444',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            CRM Error
          </div>
          <div
            style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}
          >
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.2)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            }}
          >
            🔄 Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER - MODERNIZED WITH FLEETFLOW DESIGN
  // ============================================================================

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingTop: '0px',
      }}
    >
      {/* Header - Matching Live Tracking Style */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>🏢</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Customer Relationship Center
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Comprehensive customer management & sales intelligence
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                    ></div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Live Sync Active
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Organization:{' '}
                <span style={{ color: 'white', fontWeight: '500' }}>
                  FleetFlow Demo
                </span>
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Last Update:{' '}
                <span style={{ color: 'white', fontWeight: '500' }}>
                  {formatTime(lastRefresh.toISOString())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '32px',
        }}
      >
        <div
          style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}
        >
          <nav
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'contacts', label: 'Call Log', icon: '📞' },
              { id: 'transfers', label: 'Transfers', icon: '🔄' },
              { id: 'opportunities', label: 'Pipeline', icon: '🎯' },
              { id: 'activities', label: 'Activities', icon: '📅' },
              { id: 'pipeline', label: 'Sales Board', icon: '📈' },
              { id: 'ai', label: 'AI Insights', icon: '🤖' },
              { id: 'reports', label: 'Reports', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border:
                    activeTab === tab.id
                      ? `2px solid ${getTabColor(tab.id)}`
                      : '2px solid transparent',
                  background:
                    activeTab === tab.id
                      ? `linear-gradient(135deg, ${getTabColor(tab.id)}20, ${getTabColor(tab.id)}10)`
                      : 'transparent',
                  color:
                    activeTab === tab.id
                      ? getTabColor(tab.id)
                      : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap' as const,
                  boxShadow:
                    activeTab === tab.id
                      ? `0 4px 12px ${getTabColor(tab.id)}30`
                      : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${getTabColor(tab.id)}15, ${getTabColor(tab.id)}05)`;
                    e.currentTarget.style.color = getTabColor(tab.id);
                    e.currentTarget.style.border = `2px solid ${getTabColor(tab.id)}40`;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.border = '2px solid transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 32px' }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'transfers' && renderTransfers()}
        {activeTab === 'opportunities' && renderOpportunities()}
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'ai' && renderAIInsights()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* CSS Animation for pulse effect */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </div>
  );
}
