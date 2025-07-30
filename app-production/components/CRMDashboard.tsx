// ============================================================================
// FLEETFLOW CRM DASHBOARD - COMPREHENSIVE PRODUCTION READY
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
  activity_type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'sms' | 'quote' | 'follow_up';
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

  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'opportunities' | 'activities' | 'pipeline' | 'ai' | 'reports'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);

  // Filters state
  const [contactFilters, setContactFilters] = useState({
    contact_type: '',
    status: '',
    search: '',
    limit: 10
  });

  const [opportunityFilters, setOpportunityFilters] = useState({
    status: 'open',
    stage: '',
    search: '',
    limit: 10
  });

  const [activityFilters, setActivityFilters] = useState({
    activity_type: '',
    status: '',
    priority: '',
    limit: 10
  });

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchDashboardMetrics = async () => {
    try {
      const response = await fetch('/api/crm/dashboard', {
        headers: { 'x-organization-id': 'default-org' }
      });
      const data = await response.json();
      if (data.success) {
        setDashboardMetrics(data.data);
      }
    } catch (err) {
      setError('Failed to fetch dashboard metrics');
      console.error('Dashboard metrics error:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({
        ...contactFilters,
        limit: contactFilters.limit.toString()
      });
      
      const response = await fetch(`/api/crm/contacts?${params}`, {
        headers: { 'x-organization-id': 'default-org' }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Contacts error:', err);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const params = new URLSearchParams({
        ...opportunityFilters,
        limit: opportunityFilters.limit.toString()
      });
      
      const response = await fetch(`/api/crm/opportunities?${params}`, {
        headers: { 'x-organization-id': 'default-org' }
      });
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (err) {
      setError('Failed to fetch opportunities');
      console.error('Opportunities error:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams({
        ...activityFilters,
        limit: activityFilters.limit.toString()
      });
      
      const response = await fetch(`/api/crm/activities?${params}`, {
        headers: { 'x-organization-id': 'default-org' }
      });
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (err) {
      setError('Failed to fetch activities');
      console.error('Activities error:', err);
    }
  };

  const calculateLeadScore = async (contactId: string) => {
    try {
      const response = await fetch(`/api/crm/ai?action=lead-score&contact_id=${contactId}`, {
        headers: { 'x-organization-id': 'default-org' }
      });
      const data = await response.json();
      if (data.success) {
        // Update contact in state with new lead score
        setContacts(prev => prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, lead_score: data.data.lead_score }
            : contact
        ));
      }
    } catch (err) {
      console.error('Lead score calculation error:', err);
    }
  };

  const analyzeContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/crm/ai?action=analyze-contact&contact_id=${contactId}`, {
        headers: { 'x-organization-id': 'default-org' }
      });
      const data = await response.json();
      if (data.success) {
        setAiInsights(data.data);
      }
    } catch (err) {
      console.error('Contact analysis error:', err);
    }
  };

  const createContact = async (contactData: Partial<Contact>) => {
    try {
      const response = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organization-id': 'default-org'
        },
        body: JSON.stringify(contactData)
      });
      const data = await response.json();
      if (data.success) {
        await fetchContacts();
        await fetchDashboardMetrics();
      }
    } catch (err) {
      setError('Failed to create contact');
      console.error('Create contact error:', err);
    }
  };

  const createOpportunity = async (opportunityData: Partial<Opportunity>) => {
    try {
      const response = await fetch('/api/crm/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organization-id': 'default-org'
        },
        body: JSON.stringify(opportunityData)
      });
      const data = await response.json();
      if (data.success) {
        await fetchOpportunities();
        await fetchDashboardMetrics();
      }
    } catch (err) {
      setError('Failed to create opportunity');
      console.error('Create opportunity error:', err);
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardMetrics(),
        fetchContacts(),
        fetchOpportunities(),
        fetchActivities()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [contactFilters]);

  useEffect(() => {
    fetchOpportunities();
  }, [opportunityFilters]);

  useEffect(() => {
    fetchActivities();
  }, [activityFilters]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getContactTypeColor = (type: string) => {
    const colors = {
      driver: 'bg-yellow-100 text-yellow-800',
      shipper: 'bg-blue-100 text-blue-800',
      carrier: 'bg-green-100 text-green-800',
      broker: 'bg-purple-100 text-purple-800',
      customer: 'bg-pink-100 text-pink-800'
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
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardMetrics?.total_contacts || 0}</div>
            <p className="text-xs text-blue-100 mt-1">Active leads in pipeline</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(dashboardMetrics?.pipeline_value || 0)}</div>
            <p className="text-xs text-green-100 mt-1">Total opportunity value</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardMetrics?.conversion_rate.toFixed(1) || 0}%</div>
            <p className="text-xs text-purple-100 mt-1">Won opportunities</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardMetrics?.total_activities || 0}</div>
            <p className="text-xs text-orange-100 mt-1">Total interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Top Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardMetrics?.recent_activities.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{activity.subject}</div>
                    <div className="text-sm text-gray-600">{activity.contact_name} • {activity.company_name}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getPriorityColor(activity.priority)} text-xs`}>
                      {activity.activity_type}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(activity.activity_date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardMetrics?.top_opportunities.slice(0, 5).map(opportunity => (
                <div key={opportunity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{opportunity.opportunity_name}</div>
                    <div className="text-sm text-gray-600">{opportunity.contact_name} • {opportunity.company_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{formatCurrency(opportunity.value)}</div>
                    <div className="text-xs text-gray-500">{opportunity.probability}% • {opportunity.stage}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources & Contact Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardMetrics?.lead_sources.map(source => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="capitalize">{source.source}</div>
                  <div className="font-semibold">{source.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardMetrics?.contact_types.map(type => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="capitalize">{type.type}</div>
                  <div className="font-semibold">{type.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              value={contactFilters.contact_type}
              onChange={(e) => setContactFilters({...contactFilters, contact_type: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="driver">Driver</option>
              <option value="shipper">Shipper</option>
              <option value="carrier">Carrier</option>
              <option value="broker">Broker</option>
              <option value="customer">Customer</option>
            </select>
            
            <select 
              value={contactFilters.status}
              onChange={(e) => setContactFilters({...contactFilters, status: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
            
            <input
              type="text"
              placeholder="Search contacts..."
              value={contactFilters.search}
              onChange={(e) => setContactFilters({...contactFilters, search: e.target.value})}
              className="border rounded-md px-3 py-2"
            />
            
            <Button 
              onClick={() => setContactFilters({contact_type: '', status: '', search: '', limit: 10})}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contacts ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.first_name[0]}{contact.last_name[0]}
                  </div>
                  <div>
                    <div className="font-medium">{contact.first_name} {contact.last_name}</div>
                    <div className="text-sm text-gray-600">{contact.email} • {contact.phone}</div>
                    <div className="text-sm text-gray-600">{contact.company_name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getContactTypeColor(contact.contact_type)}>
                    {contact.contact_type}
                  </Badge>
                  <Badge className={getLeadScoreColor(contact.lead_score)}>
                    {contact.lead_score} - {getLeadScoreLabel(contact.lead_score)}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => calculateLeadScore(contact.id)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Update Score
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => analyzeContact(contact.id)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    AI Analysis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Opportunity Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              value={opportunityFilters.status}
              onChange={(e) => setOpportunityFilters({...opportunityFilters, status: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select 
              value={opportunityFilters.stage}
              onChange={(e) => setOpportunityFilters({...opportunityFilters, stage: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Stages</option>
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed won">Closed Won</option>
            </select>
            
            <input
              type="text"
              placeholder="Search opportunities..."
              value={opportunityFilters.search}
              onChange={(e) => setOpportunityFilters({...opportunityFilters, search: e.target.value})}
              className="border rounded-md px-3 py-2"
            />
            
            <Button 
              onClick={() => setOpportunityFilters({status: 'open', stage: '', search: '', limit: 10})}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Opportunities ({opportunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map(opportunity => (
              <div key={opportunity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{opportunity.opportunity_name}</div>
                  <div className="text-sm text-gray-600">{opportunity.contact_name} • {opportunity.company_name}</div>
                  <div className="text-sm text-gray-600">
                    {opportunity.origin_city} → {opportunity.destination_city}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{formatCurrency(opportunity.value)}</div>
                  <div className="text-sm text-gray-600">{opportunity.probability}% • {opportunity.stage}</div>
                  <div className="text-xs text-gray-500">{formatDate(opportunity.expected_close_date)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              value={activityFilters.activity_type}
              onChange={(e) => setActivityFilters({...activityFilters, activity_type: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
              <option value="note">Note</option>
            </select>
            
            <select 
              value={activityFilters.status}
              onChange={(e) => setActivityFilters({...activityFilters, status: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select 
              value={activityFilters.priority}
              onChange={(e) => setActivityFilters({...activityFilters, priority: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            
            <Button 
              onClick={() => setActivityFilters({activity_type: '', status: '', priority: '', limit: 10})}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activities ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{activity.subject}</div>
                  <div className="text-sm text-gray-600">{activity.contact_name} • {activity.company_name}</div>
                  <div className="text-xs text-gray-500">{formatDate(activity.activity_date)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(activity.priority)}>
                    {activity.priority}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {activity.activity_type}
                  </Badge>
                  <Badge className={activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      {aiInsights ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Contact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Health & Engagement</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Contact Health:</span>
                    <Badge className={aiInsights.contact_health === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {aiInsights.contact_health}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement Level:</span>
                    <Badge className={aiInsights.engagement_level === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {aiInsights.engagement_level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Predicted Value:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(aiInsights.predicted_value)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Recommendations</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Next Best Action:</span>
                    <div className="font-medium">{aiInsights.next_best_action}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {aiInsights.risk_factors.map((risk, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Opportunities</h3>
                <div className="space-y-2">
                  {aiInsights.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">Select a contact from the Contacts tab and click "AI Analysis" to see insights here.</div>
              <Button 
                onClick={() => setActiveTab('contacts')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Go to Contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPipeline = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales Pipeline Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, index) => {
              const stageOpportunities = opportunities.filter(opp => opp.stage.toLowerCase() === stage.toLowerCase());
              const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);
              
              return (
                <div key={stage} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">{stage}</div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(stageValue)}</div>
                  <div className="text-sm text-gray-600 mb-3">{stageOpportunities.length} opportunities</div>
                  <div className="space-y-2">
                    {stageOpportunities.slice(0, 3).map(opp => (
                      <div key={opp.id} className="text-xs bg-white p-2 rounded">
                        <div className="font-medium">{opp.opportunity_name}</div>
                        <div className="text-gray-600">{formatCurrency(opp.value)}</div>
                      </div>
                    ))}
                    {stageOpportunities.length > 3 && (
                      <div className="text-xs text-gray-500">+{stageOpportunities.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardMetrics?.monthly_revenue.map(month => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{month.month}</div>
                <div className="font-semibold text-green-600">{formatCurrency(month.revenue)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{dashboardMetrics?.total_contacts}</div>
              <div className="text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{dashboardMetrics?.conversion_rate.toFixed(1)}%</div>
              <div className="text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{formatCurrency(dashboardMetrics?.pipeline_value || 0)}</div>
              <div className="text-gray-600">Pipeline Value</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading CRM Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
            Reload Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FleetFlow CRM</h1>
              <p className="text-gray-600">Comprehensive customer relationship management for freight operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Organization: <span className="font-medium">FleetFlow Demo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'contacts', label: 'Contacts', icon: '👥' },
              { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
              { id: 'activities', label: 'Activities', icon: '📅' },
              { id: 'pipeline', label: 'Pipeline', icon: '📈' },
              { id: 'ai', label: 'AI Insights', icon: '🤖' },
              { id: 'reports', label: 'Reports', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'opportunities' && renderOpportunities()}
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'pipeline' && renderPipeline()}
        {activeTab === 'ai' && renderAIInsights()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
} 