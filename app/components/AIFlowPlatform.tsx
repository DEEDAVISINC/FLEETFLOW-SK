'use client';

import { BarChart3, Heart, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import AIOperationsCenter from './AIOperationsCenter';
import CRMDashboard from './CRMDashboard';
import { FreeSWITCHCallCenterDashboard } from './FreeSWITCHCallCenterDashboard';
import FreightBrokerDashboard from './FreightBrokerDashboard';
import SalesAnalyticsDashboard from './SalesAnalyticsDashboard';
import SalesDivisionPlatform from './SalesDivisionPlatform';

export default function AIFlowPlatform() {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [loads, setLoads] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [dispatchQueue, setDispatchQueue] = useState<any[]>([]);
  const [activeDispatches, setActiveDispatches] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [recruitingCampaigns, setRecruitingCampaigns] = useState<any[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<any[]>([]);
  const [aiConversations, setAiConversations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [brokerAppointments, setBrokerAppointments] = useState<any[]>([]);
  const [dispatchAppointments, setDispatchAppointments] = useState<any[]>([]);
  const [schedulingQueue, setSchedulingQueue] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [negotiationResult, setNegotiationResult] = useState<any>(null);
  const [testingNegotiator, setTestingNegotiator] = useState(false);
  const [automationResults, setAutomationResults] = useState<any>({
    fmcsa: null,
    rfx: null,
    thomasnet: null,
  });

  // State for lead conversions
  const [conversionNotifications, setConversionNotifications] = useState<any[]>(
    []
  );
  const [processingConversion, setProcessingConversion] = useState<
    string | null
  >(null);

  // Helper function to process lead conversions via API
  const simulateLeadConversion = async (
    conversionType: string,
    sourceData: any
  ) => {
    const tenantId = 'tenant-demo-123'; // In production, get from auth context

    try {
      setProcessingConversion(conversionType);

      // Use the API endpoint for consistency
      const response = await fetch('/api/ai-flow/lead-conversion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: conversionType,
          data: {
            leadId: `LEAD-${Date.now()}`,
            customerName: sourceData.customerName,
            quoteValue: sourceData.value,
            serviceValue: sourceData.value,
            contractValue: sourceData.value,
            serviceType: sourceData.serviceType || 'Transportation Services',
            contactInfo: {
              name: sourceData.contactName,
              email: sourceData.email,
              phone: sourceData.phone,
              company: sourceData.customerName,
            },
            tenantId,
            source: sourceData.source,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add to local notifications for UI feedback
        const notification = {
          id: result.notificationId || `NOTIF-${Date.now()}`,
          type: 'success',
          title: '🚨 LEAD CONVERTED!',
          message: `${sourceData.customerName || 'Customer'} converted via ${sourceData.source || 'AI Flow'} → Management Notified`,
          timestamp: new Date().toISOString(),
        };

        setConversionNotifications((prev) => [
          notification,
          ...prev.slice(0, 4),
        ]); // Keep last 5

        // Auto-remove notification after 10 seconds
        setTimeout(() => {
          setConversionNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id)
          );
        }, 10000);
      } else {
        console.error('Conversion processing failed:', result.error);
        alert(`❌ Conversion failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Conversion processing failed:', error);
      alert('❌ Conversion processing failed. Check console for details.');
    } finally {
      setProcessingConversion(null);
    }
  };

  // Initialize sample data
  useEffect(() => {
    setActiveCalls([
      {
        id: 1,
        caller: 'Mark Thompson',
        phone: '(555) 123-4567',
        type: 'Driver Recruitment',
        status: 'active',
        duration: '02:34',
        sentiment: 'positive',
        leadScore: 82,
      },
      {
        id: 2,
        caller: 'Sarah Wilson',
        phone: '(555) 987-6543',
        type: 'Freight Inquiry',
        status: 'hold',
        duration: '01:45',
        sentiment: 'neutral',
        leadScore: 67,
      },
    ]);

    setLoads([
      {
        id: 'FL-001',
        origin: 'Chicago, IL',
        destination: 'Atlanta, GA',
        weight: '45,000 lbs',
        rate: '$2,850',
        status: 'In Transit',
        driver: 'Mike Rodriguez',
        revenue: 2850,
        margin: 15,
      },
      {
        id: 'FL-002',
        origin: 'Dallas, TX',
        destination: 'Phoenix, AZ',
        weight: '38,500 lbs',
        rate: '$1,950',
        status: 'Dispatched',
        driver: 'Lisa Chen',
        revenue: 1950,
        margin: 18,
      },
    ]);

    setDrivers([
      {
        id: 'DR-001',
        name: 'Mike Rodriguez',
        phone: '(555) 234-5678',
        location: 'Chicago, IL',
        status: 'In Transit',
        loadId: 'FL-001',
        rating: 4.8,
        availability: 'Available 12/28',
      },
      {
        id: 'DR-002',
        name: 'Lisa Chen',
        phone: '(555) 345-6789',
        location: 'Dallas, TX',
        status: 'Dispatched',
        loadId: 'FL-002',
        rating: 4.9,
        availability: 'Available 12/26',
      },
    ]);

    setCustomers([
      {
        id: 'CU-001',
        name: 'ABC Manufacturing',
        contact: 'John Smith',
        phone: '(555) 456-7890',
        loads: 23,
        revenue: 65000,
        status: 'Active',
      },
      {
        id: 'CU-002',
        name: 'XYZ Logistics',
        contact: 'Jane Doe',
        phone: '(555) 567-8901',
        loads: 18,
        revenue: 48000,
        status: 'Active',
      },
    ]);

    setNotifications([
      {
        id: 1,
        type: 'urgent',
        message: 'Driver Mike Rodriguez reports traffic delay - ETA updated',
        timestamp: '2 min ago',
      },
      {
        id: 2,
        type: 'success',
        message: 'Load FL-003 successfully delivered and signed',
        timestamp: '15 min ago',
      },
    ]);

    setMetrics({
      totalCalls: 1247,
      activeLoads: 42,
      availableDrivers: 18,
      dailyRevenue: 23750,
      callsHandled: 1685,
      automationRate: 91,
      leadAccuracy: 96,
      avgResponseTime: 18,
    });

    setAiInsights([
      {
        type: 'optimization',
        title: 'Route Optimization Opportunity',
        description: 'Combine FL-004 and FL-005 for 15% cost savings',
        impact: '$450 savings',
        priority: 'medium',
      },
      {
        type: 'alert',
        title: 'Driver Shortage Alert',
        description: 'Phoenix region showing 23% driver shortage',
        impact: 'Potential delays',
        priority: 'high',
      },
    ]);

    setDispatchQueue([
      {
        id: 'DQ-001',
        load: 'FL-010',
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        priority: 'high',
        requiredBy: '12/26 8:00 AM',
        matchingDrivers: 3,
      },
      {
        id: 'DQ-002',
        load: 'FL-011',
        origin: 'Denver, CO',
        destination: 'Salt Lake City, UT',
        priority: 'medium',
        requiredBy: '12/26 2:00 PM',
        matchingDrivers: 7,
      },
    ]);

    setActiveDispatches([
      {
        id: 'AD-001',
        load: 'FL-001',
        driver: 'Mike Rodriguez',
        status: 'En Route',
        eta: '12/25 6:00 PM',
        completion: 65,
      },
      {
        id: 'AD-002',
        load: 'FL-002',
        driver: 'Lisa Chen',
        status: 'Pickup Complete',
        eta: '12/26 10:00 AM',
        completion: 35,
      },
    ]);

    setLeads([
      {
        id: 'L-001',
        name: 'Robert Johnson',
        phone: '(555) 678-9012',
        experience: '5 years OTR',
        cdlClass: 'Class A',
        score: 89,
        status: 'Hot Lead',
        source: 'Indeed',
      },
      {
        id: 'L-002',
        name: 'Maria Garcia',
        phone: '(555) 789-0123',
        experience: '3 years Regional',
        cdlClass: 'Class A',
        score: 76,
        status: 'Qualified',
        source: 'Facebook',
      },
      {
        id: 'L-003',
        name: 'David Chen',
        phone: '(555) 890-1234',
        experience: '7 years Freight Brokerage',
        cdlClass: 'Broker License',
        score: 94,
        status: 'Hot Lead',
        source: 'LinkedIn',
      },
      {
        id: 'L-004',
        name: 'Sarah Mitchell',
        phone: '(555) 901-2345',
        experience: '4 years Dispatch Operations',
        cdlClass: 'TMS Certified',
        score: 82,
        status: 'Qualified',
        source: 'Indeed',
      },
      {
        id: 'L-005',
        name: 'Michael Torres',
        phone: '(555) 012-3456',
        experience: 'Owner Operator',
        cdlClass: 'Class A + Own Truck',
        score: 91,
        status: 'Hot Lead',
        source: 'DAT',
      },
    ]);

    setRecruitingCampaigns([
      {
        id: 'RC-001',
        name: 'OTR Driver Holiday Bonus',
        platform: 'Indeed',
        budget: '$2,500',
        leads: 47,
        qualified: 12,
        hired: 3,
        status: 'Active',
      },
      {
        id: 'RC-002',
        name: 'Regional Driver Referral',
        platform: 'Facebook',
        budget: '$1,800',
        leads: 23,
        qualified: 8,
        hired: 2,
        status: 'Active',
      },
      {
        id: 'RC-003',
        name: 'Broker Agent Book of Business',
        platform: 'LinkedIn',
        budget: '$4,200',
        leads: 18,
        qualified: 12,
        hired: 4,
        status: 'Active',
      },
      {
        id: 'RC-004',
        name: 'Dispatcher High Volume Ops',
        platform: 'Indeed',
        budget: '$1,500',
        leads: 31,
        qualified: 15,
        hired: 6,
        status: 'Active',
      },
      {
        id: 'RC-005',
        name: 'Owner Operator Southeast',
        platform: 'DAT',
        budget: '$3,100',
        leads: 38,
        qualified: 22,
        hired: 8,
        status: 'Active',
      },
    ]);

    setMessageTemplates([
      {
        id: 'MT-001',
        name: 'Driver Welcome Call',
        type: 'Voice',
        content:
          "Welcome to FleetFlow! We're excited to have you on our team...",
        usage: 156,
        effectiveness: 94,
      },
      {
        id: 'MT-002',
        name: 'Load Assignment SMS',
        type: 'SMS',
        content: 'New load assigned: {loadId}. Pickup: {origin} at {time}...',
        usage: 445,
        effectiveness: 87,
      },
    ]);

    setAiConversations([
      {
        id: 'AC-001',
        contact: 'Driver Mike Rodriguez',
        lastMessage: 'AI: Your next load is ready for pickup in Chicago...',
        sentiment: 'positive',
        resolved: true,
        timestamp: '10 min ago',
      },
      {
        id: 'AC-002',
        contact: 'Customer ABC Manufacturing',
        lastMessage: 'AI: Your shipment is on schedule for delivery...',
        sentiment: 'neutral',
        resolved: false,
        timestamp: '25 min ago',
      },
    ]);

    setAppointments([
      {
        id: 'AP-001',
        contact: 'Robert Johnson',
        type: 'Driver Interview',
        date: '12/26/2024',
        time: '10:00 AM',
        status: 'Confirmed',
        notes: 'OTR position discussion',
      },
      {
        id: 'AP-002',
        contact: 'ABC Manufacturing',
        type: 'Contract Review',
        date: '12/26/2024',
        time: '2:00 PM',
        status: 'Pending',
        notes: 'Q1 2025 rates',
      },
    ]);

    setBrokerAppointments([
      {
        id: 'BA-001',
        customer: 'XYZ Logistics',
        contact: 'Jane Doe',
        purpose: 'Rate Negotiation',
        date: '12/27/2024',
        time: '9:00 AM',
        value: '$25,000',
      },
      {
        id: 'BA-002',
        customer: 'Global Freight Co',
        contact: 'Tom Wilson',
        purpose: 'New Contract',
        date: '12/27/2024',
        time: '11:00 AM',
        value: '$45,000',
      },
    ]);

    setDispatchAppointments([
      {
        id: 'DA-001',
        driver: 'Mike Rodriguez',
        purpose: 'Route Planning',
        date: '12/26/2024',
        time: '8:00 AM',
        load: 'FL-015',
      },
      {
        id: 'DA-002',
        driver: 'Lisa Chen',
        purpose: 'Equipment Check',
        date: '12/26/2024',
        time: '1:00 PM',
        load: 'FL-016',
      },
    ]);

    setSchedulingQueue([
      {
        id: 'SQ-001',
        requestType: 'Driver Interview',
        contact: 'Jennifer Adams',
        priority: 'high',
        preferredTime: 'Morning',
        autoScheduled: false,
      },
      {
        id: 'SQ-002',
        requestType: 'Customer Meeting',
        contact: 'Delta Shipping',
        priority: 'medium',
        preferredTime: 'Afternoon',
        autoScheduled: true,
      },
    ]);
  }, []);

  // AI Action Handler for Automation Services
  const handleAIAction = async (action: string) => {
    console.log(`🤖 Executing AI action: ${action}`);

    switch (action) {
      case 'test-negotiator':
        setTestingNegotiator(true);
        try {
          const response = await fetch('/api/ai/negotiator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'demo_negotiation' }),
          });
          const result = await response.json();
          setNegotiationResult(result);
          console.log('🎯 Negotiation demo completed:', result);
        } catch (error) {
          console.error('❌ Negotiation test failed:', error);
        } finally {
          setTestingNegotiator(false);
        }
        break;

      case 'view-fmcsa':
        // Show FMCSA Intelligence results
        setAutomationResults((prev: any) => ({
          ...prev,
          fmcsa: {
            shippersFound: 47,
            highValueProspects: 12,
            lastScan: '2 hours ago',
            topResults: [
              {
                company: 'Global Manufacturing Corp',
                potential: '$85k/month',
                score: 94,
              },
              {
                company: 'Midwest Distribution LLC',
                potential: '$67k/month',
                score: 89,
              },
              {
                company: 'Atlantic Logistics Inc',
                potential: '$52k/month',
                score: 85,
              },
            ],
          },
        }));

        // Simulate a lead conversion from FMCSA discovery
        setTimeout(() => {
          simulateLeadConversion('quote_accepted', {
            customerName: 'Global Manufacturing Corp',
            value: 35000,
            source: 'fmcsa',
            contactName: 'Jennifer Martinez',
            email: 'logistics@global-mfg.com',
            phone: '(555) 234-5678',
          });
        }, 2000);

        alert(
          '✅ FMCSA Intelligence: 47 shippers discovered, 12 high-value prospects identified'
        );
        break;

      case 'view-rfx':
        // Show RFx Automation results
        setAutomationResults((prev: any) => ({
          ...prev,
          rfx: {
            opportunitiesFound: 23,
            autoBidsSubmitted: 5,
            winRate: '31%',
            lastScan: '30 minutes ago',
            recentOpportunities: [
              {
                title: 'Automotive Parts Transport',
                value: '$125k',
                status: 'Bid Submitted',
              },
              {
                title: 'Food Distribution Contract',
                value: '$95k',
                status: 'Under Review',
              },
              {
                title: 'Construction Materials',
                value: '$78k',
                status: 'Queued for Bid',
              },
            ],
          },
        }));

        // Simulate an RFP win conversion
        setTimeout(() => {
          simulateLeadConversion('rfp_won', {
            customerName: 'AutoTech Manufacturing',
            value: 125000,
            source: 'rfx_automation',
            contactName: 'Robert Kim',
            email: 'procurement@autotech.com',
            phone: '(555) 345-6789',
          });
        }, 3000);

        alert(
          '🤖 Smart RFx Auto-Bidding: 23 opportunities analyzed - 6 auto-submitted (trusted customers, low risk), 12 queued for review (medium risk), 5 manual review required (high risk or auto-bidding disabled by tenant)'
        );
        break;

      case 'generate-prospects':
        alert(
          '🎯 Generating new prospects using all 5 APIs... This process takes 2-3 minutes.'
        );
        break;

      case 'train-models':
        alert(
          '🤖 AI model training initiated. Improving pattern recognition across all data sources.'
        );
        break;

      case 'export-data':
        alert('📊 Exporting prospect data to CSV format for CRM integration.');
        break;

      case 'analyze-trends':
        alert(
          '📈 Analyzing market trends using economic and weather data correlation.'
        );
        break;

      case 'view-metrics':
        alert(
          '📋 AI Performance: 94% accuracy, 2.3s avg processing, 847 prospects generated this week.'
        );
        break;

      case 'health-check':
        alert(
          '🔍 API Health: FMCSA ✅ Weather.gov ✅ ExchangeRate ✅ FRED ✅ ThomasNet ✅'
        );
        break;

      case 'test-quote-conversion':
        simulateLeadConversion('quote_accepted', {
          customerName: 'Premium Logistics Inc',
          value: 45000,
          source: 'claude_ai',
          contactName: 'Lisa Anderson',
          email: 'operations@premium-logistics.com',
          phone: '(555) 678-9012',
          description: 'Multi-stop delivery route - Atlanta to Miami',
        });
        break;

      case 'test-service-booking':
        simulateLeadConversion('service_booked', {
          customerName: 'Pacific Distribution Group',
          value: 78000,
          source: 'twilio',
          serviceType: 'Dedicated Transportation Services',
          contactName: 'Michael Chen',
          email: 'procurement@pacific-dist.com',
          phone: '(555) 890-1234',
          description: 'Recurring weekly service contract',
        });
        break;

      case 'test-rfp-win':
        simulateLeadConversion('rfp_won', {
          customerName: 'Department of Transportation',
          value: 250000,
          source: 'sam_gov',
          contactName: 'Patricia Williams',
          email: 'contracts@dot.gov',
          phone: '(555) 012-3456',
          description: 'Annual transportation services contract',
        });
        break;

      default:
        alert(`Action "${action}" not yet implemented`);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      Dispatched: 'bg-purple-100 text-purple-800',
      Available: 'bg-green-100 text-green-800',
      Qualified: 'bg-green-100 text-green-800',
      'Hot Lead': 'bg-red-100 text-red-800',
      Confirmed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Lead Conversion Notifications */}
      {conversionNotifications.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {conversionNotifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'white',
                minWidth: '320px',
                animation: 'slideInRight 0.5s ease-out',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {notification.title}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    animation: 'pulse 2s infinite',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '14px',
                  opacity: 0.9,
                  marginBottom: '8px',
                }}
              >
                {notification.message}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  opacity: 0.7,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>→ Management Notified</span>
                <span>
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processing Conversion Indicator */}
      {processingConversion && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              marginBottom: '12px',
              animation: 'spin 1s linear infinite',
            }}
          >
            🔄
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            Processing Lead Conversion...
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
            Notifying management team
          </div>
        </div>
      )}

      {/* Enhanced Header with Real-Time Data */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>🤖</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#d946ef',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                AI FLOW PLATFORM
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: '#ec4899',
                  margin: '0 0 8px 0',
                }}
              >
                Complete Trucking Operations with AI-Powered Automation &
                Intelligence
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                  }}
                >
                  ✅ OPERATIONAL
                </span>
                <span>•</span>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                  }}
                >
                  🤖 AI ACTIVE
                </span>
                <span>•</span>
                <span>System Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard - Compliance Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {[
          {
            label: 'Active Calls',
            value: metrics.totalCalls,
            color: '#10b981',
            icon: '📞',
            status: 'OPERATIONAL',
          },
          {
            label: 'Active Loads',
            value: metrics.activeLoads,
            color: '#3b82f6',
            icon: '🚛',
            status: 'TRACKING',
          },
          {
            label: 'Available Drivers',
            value: metrics.availableDrivers,
            color: '#8b5cf6',
            icon: '👥',
            status: 'AVAILABLE',
          },
          {
            label: 'Daily Revenue',
            value: formatCurrency(metrics.dailyRevenue),
            color: '#f59e0b',
            icon: '💰',
            status: 'PROCESSING',
          },
          {
            label: 'Automation Rate',
            value: `${metrics.automationRate}%`,
            color: '#06b6d4',
            icon: '🤖',
            status: 'ACTIVE',
          },
          {
            label: 'Lead Accuracy',
            value: `${metrics.leadAccuracy}%`,
            color: '#ef4444',
            icon: '🎯',
            status: 'OPTIMAL',
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: `${stat.color}20`,
                  color: stat.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {stat.status}
              </div>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                color: '#ec4899',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Navigation - Compliance Style */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type='text'
            placeholder='Search across all AI operations...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(5px)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#d946ef';
              e.target.style.boxShadow = '0 0 0 3px rgba(217, 70, 239, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#d946ef',
              fontSize: '20px',
            }}
          >
            🔍
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: '📊',
              color: '#334155',
              borderColor: 'rgba(51, 65, 85, 0.3)',
            },
            {
              id: 'callcenter',
              label: 'Call Center',
              icon: '📞',
              color: '#10b981',
              borderColor: 'rgba(16, 185, 129, 0.3)',
            },
            {
              id: 'broker',
              label: 'Freight Broker',
              icon: '🚛',
              color: '#f59e0b',
              borderColor: 'rgba(245, 158, 11, 0.3)',
            },
            {
              id: 'lead-generation',
              label: 'Lead Generation Hub',
              icon: '🎯',
              color: '#f97316',
              borderColor: 'rgba(249, 115, 22, 0.3)',
            },
            {
              id: 'operations',
              label: 'Operations Center',
              icon: '🤖',
              color: '#d946ef',
              borderColor: 'rgba(217, 70, 239, 0.3)',
            },
            {
              id: 'customer-recruiting',
              label: 'Customer & Recruiting',
              icon: '👥',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
            },
            {
              id: 'analytics',
              label: 'Analytics & Sales',
              icon: '📈',
              color: '#8b5cf6',
              borderColor: 'rgba(139, 92, 246, 0.3)',
            },
          ].map((tab) => {
            const getGradient = (color: string) => {
              switch (color) {
                case '#f59e0b':
                  return 'linear-gradient(135deg, #f59e0b, #d97706)'; // Orange
                case '#f97316':
                  return 'linear-gradient(135deg, #f97316, #ea580c)'; // Orange (Lead Generation)
                case '#3b82f6':
                  return 'linear-gradient(135deg, #3b82f6, #2563eb)'; // Blue
                case '#8b5cf6':
                  return 'linear-gradient(135deg, #8b5cf6, #7c3aed)'; // Purple
                case '#10b981':
                  return 'linear-gradient(135deg, #10b981, #059669)'; // Green
                case '#ef4444':
                  return 'linear-gradient(135deg, #ef4444, #dc2626)'; // Red
                case '#ec4899':
                  return 'linear-gradient(135deg, #ec4899, #db2777)'; // Pink (Customer Success)
                case '#06b6d4':
                  return 'linear-gradient(135deg, #06b6d4, #0891b2)'; // Cyan
                case '#d946ef':
                  return 'linear-gradient(135deg, #d946ef, #c026d3)'; // Dark Pink (AI Operations)
                case '#334155':
                  return 'linear-gradient(135deg, #334155, #475569)'; // Slate (Dashboard)
                case '#22c55e':
                  return 'linear-gradient(135deg, #22c55e, #16a34a)'; // Green (Sales Division)
                case '#16a34a':
                  return 'linear-gradient(135deg, #16a34a, #15803d)'; // Dark Green (Sales Analytics)
                default:
                  return 'linear-gradient(135deg, #334155, #475569)'; // Slate (default)
              }
            };

            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  background:
                    activeView === tab.id
                      ? getGradient(tab.color)
                      : 'rgba(255, 255, 255, 0.2)',
                  color: activeView === tab.id ? 'white' : '#ffffff',
                  border:
                    activeView === tab.id
                      ? `1px solid ${tab.borderColor}`
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  boxShadow:
                    activeView === tab.id
                      ? `0 4px 12px ${tab.color}33`
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Compliance Style */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {activeView === 'dashboard' && (
          <div>
            <h2
              style={{
                color: '#d946ef',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              📊 Real-Time Operations Dashboard
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  textTransform: 'uppercase',
                }}
              >
                LIVE
              </div>
            </h2>
            {/* Recent Activity - Compliance Style */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#d946ef',
                    fontSize: '18px',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Recent Calls
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {activeCalls.slice(0, 3).map((call) => (
                    <div
                      key={call.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        borderLeft: '4px solid #10b981',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          {call.caller}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {call.type}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          {call.duration}
                        </div>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '2px 6px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '4px',
                          }}
                        >
                          Score: {call.leadScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#d946ef',
                    fontSize: '18px',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Active Loads
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {loads.slice(0, 3).map((load) => (
                    <div
                      key={load.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        borderLeft: '4px solid #3b82f6',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          {load.id}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {load.origin} → {load.destination}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          {load.rate}
                        </div>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            background:
                              load.status === 'In Transit'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(139, 92, 246, 0.2)',
                            color:
                              load.status === 'In Transit'
                                ? '#3b82f6'
                                : '#8b5cf6',
                            textTransform: 'uppercase',
                          }}
                        >
                          {load.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights - Alert Style */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  color: '#d946ef',
                  fontSize: '18px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                🤖 AI Insights & Recommendations
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      padding: '16px 20px',
                      background:
                        insight.priority === 'high'
                          ? 'rgba(239, 68, 68, 0.1)'
                          : insight.priority === 'medium'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      gap: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)',
                      borderLeft: `4px solid ${insight.priority === 'high' ? '#ef4444' : insight.priority === 'medium' ? '#f59e0b' : '#10b981'}`,
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background:
                          insight.priority === 'high'
                            ? '#ef4444'
                            : insight.priority === 'medium'
                              ? '#f59e0b'
                              : '#10b981',
                        marginTop: '4px',
                        boxShadow: `0 0 8px ${insight.priority === 'high' ? '#ef4444' : insight.priority === 'medium' ? '#f59e0b' : '#10b981'}40`,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: '700',
                          color: 'white',
                          marginBottom: '6px',
                          fontSize: '15px',
                        }}
                      >
                        {insight.title}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '13px',
                          marginBottom: '6px',
                          lineHeight: '1.4',
                        }}
                      >
                        {insight.description}
                      </div>
                      <div
                        style={{
                          color:
                            insight.priority === 'high'
                              ? '#ef4444'
                              : insight.priority === 'medium'
                                ? '#f59e0b'
                                : '#10b981',
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '4px 8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        {insight.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'callcenter' && (
          <div>
            <h2
              style={{
                color: '#d946ef',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              📞 FreeSWITCH Call Center & Lead Generation
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  textTransform: 'uppercase',
                }}
              >
                LIVE
              </div>
            </h2>
            <FreeSWITCHCallCenterDashboard />
          </div>
        )}

        {activeView === 'broker' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  color: '#d946ef',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                🚛 AI Freight Broker Operations
              </h2>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  textTransform: 'uppercase',
                }}
              >
                AI POWERED
              </div>
            </div>
            <FreightBrokerDashboard />
          </div>
        )}

        {activeView === 'lead-generation' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  color: '#f97316',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                🎯 Lead Generation Hub
              </h2>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: '#f97316',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                ALL VERTICALS
              </div>
            </div>

            {/* Strategic Acquisition Pipeline */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: '2px solid rgba(249, 115, 22, 0.3)',
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#f97316',
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                🏆 Strategic Acquisition Pipeline
              </h3>

              {/* High-Value Verticals */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
                {/* Pharmaceutical Vertical */}
                <div
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '2px solid rgba(220, 38, 38, 0.3)',
                    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      color: '#dc2626',
                      marginBottom: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}
                  >
                    💊 Pharmaceutical Logistics
                  </h4>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <strong>COLD CHAIN SPECIALISTS</strong>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      1,426 Total Leads
                    </div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      $7.4M Pipeline Value
                    </div>
                  </div>

                  {/* Pharmaceutical Categories */}
                  <div
                    style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      🏭 Manufacturers: 847 leads ($2.4M)
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      📦 Distributors: 423 leads ($1.8M)
                    </div>
                    <div>🧪 Biotech/Clinical: 156 leads ($3.2M)</div>
                  </div>
                </div>

                {/* Medical Courier Vertical */}
                <div
                  style={{
                    background: 'rgba(5, 150, 105, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '2px solid rgba(5, 150, 105, 0.3)',
                    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      color: '#059669',
                      marginBottom: '12px',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}
                  >
                    🏥 Medical Courier Services
                  </h4>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <strong>STAT DELIVERY SPECIALISTS</strong>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      1,190 Total Leads
                    </div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      $5.3M Pipeline Value
                    </div>
                  </div>

                  {/* Medical Categories */}
                  <div
                    style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      🏥 Hospitals: 234 leads ($1.8M)
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      🔬 Laboratories: 567 leads ($2.1M)
                    </div>
                    <div>🩺 Specialty Clinics: 389 leads ($1.4M)</div>
                  </div>
                </div>
              </div>

              {/* Strategic Acquisition Metrics */}
              <div
                style={{
                  background: 'rgba(249, 115, 22, 0.15)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <h4
                  style={{
                    color: '#f97316',
                    marginBottom: '12px',
                    textAlign: 'center',
                  }}
                >
                  📊 Strategic Acquisition Value Drivers
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '16px',
                        fontWeight: '700',
                      }}
                    >
                      $12.7M
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '10px',
                      }}
                    >
                      Total Pipeline
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: '#60a5fa',
                        fontSize: '16px',
                        fontWeight: '700',
                      }}
                    >
                      2,616
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '10px',
                      }}
                    >
                      Active Leads
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '16px',
                        fontWeight: '700',
                      }}
                    >
                      94%
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '10px',
                      }}
                    >
                      AI Accuracy
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        color: '#ef4444',
                        fontSize: '16px',
                        fontWeight: '700',
                      }}
                    >
                      $7-11B
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '10px',
                      }}
                    >
                      Acquisition Value
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Categories */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {[
                  {
                    title: '🏭 Pharmaceutical Manufacturers',
                    description:
                      'Small to mid-size manufacturers needing FDA-compliant transport',
                    leads: '847 Active Leads',
                    value: '$2.4M Pipeline',
                    color: '#dc2626',
                  },
                  {
                    title: '📦 Wholesalers & Distributors',
                    description:
                      'Regional distributors requiring temperature-controlled logistics',
                    leads: '423 Active Leads',
                    value: '$1.8M Pipeline',
                    color: '#ea580c',
                  },
                  {
                    title: '🧪 Specialty Pharmaceuticals',
                    description:
                      'Biotech companies with clinical trial logistics needs',
                    leads: '156 Active Leads',
                    value: '$3.2M Pipeline',
                    color: '#dc2626',
                  },
                ].map((category, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '16px',
                      border: `2px solid ${category.color}40`,
                      boxShadow: `0 4px 12px ${category.color}20`,
                    }}
                  >
                    <h4
                      style={{
                        color: category.color,
                        marginBottom: '8px',
                        fontSize: '14px',
                      }}
                    >
                      {category.title}
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      {category.description}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {category.leads}
                      </span>
                      <span
                        style={{
                          color: '#f59e0b',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {category.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Lead Scoring */}
              <div
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ color: '#dc2626', marginBottom: '12px' }}>
                  🤖 AI Lead Scoring Algorithm
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    { factor: 'Company Size', weight: '25%', score: '85/100' },
                    {
                      factor: 'Cold Chain Needs',
                      weight: '30%',
                      score: '92/100',
                    },
                    {
                      factor: 'Geographic Fit',
                      weight: '20%',
                      score: '78/100',
                    },
                    {
                      factor: 'Compliance Requirements',
                      weight: '25%',
                      score: '96/100',
                    },
                  ].map((factor, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {factor.factor}
                      </div>
                      <div
                        style={{
                          color: '#dc2626',
                          fontSize: '14px',
                          fontWeight: '700',
                        }}
                      >
                        {factor.score}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '10px',
                        }}
                      >
                        Weight: {factor.weight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Pharmaceutical Leads */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <h4 style={{ color: '#dc2626', marginBottom: '12px' }}>
                  🔥 Hot Pharmaceutical Leads
                </h4>
                {[
                  {
                    company: 'BioTech Solutions Inc.',
                    type: 'Manufacturer',
                    score: 94,
                    value: '$250K',
                    status: 'Contact Made',
                  },
                  {
                    company: 'Regional Pharma Dist.',
                    type: 'Distributor',
                    score: 89,
                    value: '$180K',
                    status: 'Proposal Sent',
                  },
                  {
                    company: 'Clinical Trials Co.',
                    type: 'Biotech',
                    score: 91,
                    value: '$320K',
                    status: 'Meeting Scheduled',
                  },
                ].map((lead, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom:
                        index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {lead.company}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '12px',
                        }}
                      >
                        {lead.type}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '12px' }}>
                        Score: {lead.score}/100
                      </div>
                      <div style={{ color: '#f59e0b', fontSize: '12px' }}>
                        {lead.value}
                      </div>
                      <div style={{ color: '#60a5fa', fontSize: '10px' }}>
                        {lead.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'operations' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  color: '#d946ef',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                🤖 Operations Center
              </h2>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(217, 70, 239, 0.2)',
                  color: '#d946ef',
                  textTransform: 'uppercase',
                }}
              >
                UNIFIED OPERATIONS
              </div>
            </div>
            <AIOperationsCenter />
          </div>
        )}

        {activeView === 'customer-recruiting' && (
          <div>
            <h2
              style={{
                color: '#d946ef',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              👥 Customer & Recruiting Hub
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(236, 72, 153, 0.2)',
                  color: '#ec4899',
                  textTransform: 'uppercase',
                }}
              >
                INTEGRATED
              </div>
            </h2>

            {/* Customer Success Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#ec4899',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  847
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Total Contacts
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  $2.4M
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Pipeline Value
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  15.8%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Conversion Rate
                </div>
              </div>
            </div>

            {/* AI Customer Intelligence */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  marginBottom: '15px',
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
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <Heart
                    style={{ width: '16px', height: '16px', color: '#ec4899' }}
                  />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    Relationship Intelligence
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <Target
                    style={{ width: '16px', height: '16px', color: '#8b5cf6' }}
                  />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    Upselling Opportunities
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <TrendingUp
                    style={{ width: '16px', height: '16px', color: '#10b981' }}
                  />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    Churn Prevention
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <BarChart3
                    style={{ width: '16px', height: '16px', color: '#3b82f6' }}
                  />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    Customer Analytics
                  </span>
                </div>
              </div>
            </div>

            {/* Integrated CRM Dashboard */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <CRMDashboard />
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div>
            <h2
              style={{
                color: '#d946ef',
                marginBottom: '20px',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              📈 Analytics & Performance
            </h2>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                    }}
                  >
                    96%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Platform Efficiency
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}
                  >
                    $52k
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Monthly Savings
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                    }}
                  >
                    91%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Automation Rate
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                    }}
                  >
                    1,247
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Daily Calls
                  </div>
                </div>
              </div>

              <div
                style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}
              >
                <h4
                  style={{
                    marginBottom: '12px',
                    color: '#d946ef',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Cost Savings Breakdown
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {[
                    { label: 'API Costs Eliminated', value: '$52,000/month' },
                    { label: 'Staff Automation', value: '$32,000/month' },
                    { label: 'Efficiency Gains', value: '$21,000/month' },
                    { label: 'Technology Licensing', value: '$15,000/month' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <div style={{ color: '#374151' }}>{item.label}</div>
                      <div style={{ fontWeight: '600', color: '#10b981' }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'recruiting' && (
          <div>
            <h2
              style={{
                color: '#d946ef',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              👥 AI-Powered Transportation Professional Recruitment
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  textTransform: 'uppercase',
                }}
              >
                LIVE RECRUITING
              </div>
            </h2>

            {/* Updated subtitle */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '32px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  margin: '0',
                  fontWeight: '500',
                }}
              >
                🚛 Drivers & Carriers • 🤝 Broker Agents • 📋 Dispatchers • 🏢
                Fleet Managers
              </p>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: '8px 0 0 0',
                }}
              >
                Comprehensive talent acquisition for all transportation industry
                roles
              </p>
            </div>

            {/* Recruitment KPIs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              {[
                {
                  label: 'Active Leads',
                  value: leads.length,
                  color: '#ef4444',
                  icon: '📋',
                  status: 'RECRUITING',
                },
                {
                  label: 'Qualified Professionals',
                  value: leads.filter((lead) => lead.status === 'Qualified')
                    .length,
                  color: '#10b981',
                  icon: '✅',
                  status: 'VERIFIED',
                },
                {
                  label: 'Hot Prospects',
                  value: leads.filter((lead) => lead.status === 'Hot Lead')
                    .length,
                  color: '#f59e0b',
                  icon: '🔥',
                  status: 'PRIORITY',
                },
                {
                  label: 'Active Campaigns',
                  value: recruitingCampaigns.filter(
                    (c) => c.status === 'Active'
                  ).length,
                  color: '#8b5cf6',
                  icon: '📢',
                  status: 'RUNNING',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '700',
                        background: `${stat.color}20`,
                        color: stat.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {stat.status}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '8px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      color: '#ec4899',
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recruitment Categories - Now 5 categories in responsive grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* Broker Agents */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#ec4899',
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  🤝 Broker Agents (Book of Business)
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      background: 'rgba(236, 72, 153, 0.2)',
                      color: '#ec4899',
                    }}
                  >
                    HIGH VALUE
                  </span>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      label: 'Book of Business',
                      value: '$500k+ Annual Revenue',
                      status: 'required',
                    },
                    {
                      label: 'Industry Experience',
                      value: '3+ Years Brokerage',
                      status: 'preferred',
                    },
                    {
                      label: 'Client Relationships',
                      value: '25+ Active Shippers',
                      status: 'competitive',
                    },
                    {
                      label: 'Commission Structure',
                      value: '65-75% + Benefits',
                      status: 'high',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color:
                            item.status === 'high' ||
                            item.status === 'competitive'
                              ? '#10b981'
                              : item.status === 'preferred'
                                ? '#3b82f6'
                                : '#f59e0b',
                          fontWeight: '600',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatchers */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#8b5cf6',
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  📋 Dispatchers
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                    }}
                  >
                    ESSENTIAL
                  </span>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      label: 'Dispatch Experience',
                      value: '2+ Years Required',
                      status: 'required',
                    },
                    {
                      label: 'Load Coordination',
                      value: '50+ Loads/Day',
                      status: 'active',
                    },
                    {
                      label: 'Software Proficiency',
                      value: 'TMS/ELD Systems',
                      status: 'checking',
                    },
                    {
                      label: 'Salary + Bonus',
                      value: '$45k-$65k/year',
                      status: 'competitive',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color:
                            item.status === 'competitive'
                              ? '#10b981'
                              : item.status === 'active'
                                ? '#3b82f6'
                                : '#f59e0b',
                          fontWeight: '600',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Operators */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#f59e0b',
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  🚛 Owner Operators
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                    }}
                  >
                    PRIORITY
                  </span>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      label: 'Equipment Verification',
                      value: '✅ Automated',
                      status: 'active',
                    },
                    {
                      label: 'Insurance Requirements',
                      value: '$1M+ Required',
                      status: 'checking',
                    },
                    {
                      label: 'DOT Compliance',
                      value: '94% Pass Rate',
                      status: 'active',
                    },
                    {
                      label: 'Revenue Potential',
                      value: '$180k-$250k/year',
                      status: 'high',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color:
                            item.status === 'high'
                              ? '#10b981'
                              : item.status === 'active'
                                ? '#3b82f6'
                                : '#f59e0b',
                          fontWeight: '600',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fleet Carriers */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#3b82f6',
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  🏢 Fleet Carriers
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                    }}
                  >
                    SCALING
                  </span>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      label: 'Fleet Size',
                      value: '5-50+ Trucks',
                      status: 'active',
                    },
                    {
                      label: 'Safety Rating',
                      value: 'Satisfactory+',
                      status: 'required',
                    },
                    {
                      label: 'Authority Status',
                      value: 'Active Required',
                      status: 'checking',
                    },
                    {
                      label: 'Capacity Potential',
                      value: '100-500 loads/month',
                      status: 'high',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color:
                            item.status === 'high'
                              ? '#10b981'
                              : item.status === 'active'
                                ? '#3b82f6'
                                : '#f59e0b',
                          fontWeight: '600',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Drivers */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#10b981',
                    marginBottom: '16px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  👨‍💼 Company Drivers
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                    }}
                  >
                    HIRING
                  </span>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      label: 'CDL Requirements',
                      value: 'Class A Required',
                      status: 'required',
                    },
                    {
                      label: 'Experience Level',
                      value: '2+ Years OTR',
                      status: 'preferred',
                    },
                    {
                      label: 'Clean MVR',
                      value: '3 Years Required',
                      status: 'checking',
                    },
                    {
                      label: 'Salary Range',
                      value: '$65k-$85k/year',
                      status: 'competitive',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          color:
                            item.status === 'competitive'
                              ? '#10b981'
                              : item.status === 'preferred'
                                ? '#3b82f6'
                                : '#f59e0b',
                          fontWeight: '600',
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Leads & Campaigns */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* Current Leads */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#d946ef',
                    fontSize: '18px',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  🎯 Current Prospects (All Roles)
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {leads.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        borderLeft: '4px solid #ef4444',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          {lead.name}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {lead.experience} • {lead.cdlClass}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '11px',
                          }}
                        >
                          Source: {lead.source}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          Score: {lead.score}
                        </div>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            background:
                              lead.status === 'Hot Lead'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)',
                            color:
                              lead.status === 'Hot Lead'
                                ? '#ef4444'
                                : '#10b981',
                            textTransform: 'uppercase',
                          }}
                        >
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Campaigns */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    marginBottom: '20px',
                    color: '#d946ef',
                    fontSize: '18px',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  📢 Active Campaigns
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {recruitingCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        borderLeft: '4px solid #8b5cf6',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>
                          {campaign.name}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {campaign.platform} • Budget: {campaign.budget}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '11px',
                          }}
                        >
                          {campaign.leads} leads • {campaign.qualified}{' '}
                          qualified • {campaign.hired} hired
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: '#10b981' }}>
                          {Math.round((campaign.hired / campaign.leads) * 100)}%
                          Conversion
                        </div>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            textTransform: 'uppercase',
                          }}
                        >
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recruitment Intelligence - Updated for all transportation professionals */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🤖 AI Recruitment Intelligence
                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    background: 'rgba(217, 70, 239, 0.2)',
                    color: '#d946ef',
                    textTransform: 'uppercase',
                  }}
                >
                  LIVE ANALYSIS
                </div>
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    title: 'Best Recruiting Hours',
                    value: '10 AM - 2 PM EST',
                    insight: '73% higher response rate',
                    icon: '⏰',
                    color: '#3b82f6',
                  },
                  {
                    title: 'Top Lead Sources',
                    value: 'LinkedIn → Indeed → DAT',
                    insight: 'Quality score: 94, 89, 84',
                    icon: '📊',
                    color: '#10b981',
                  },
                  {
                    title: 'Broker Commission Rates',
                    value: '65-75% + Benefits',
                    insight: 'Competitive market rates',
                    icon: '💰',
                    color: '#f59e0b',
                  },
                  {
                    title: 'Dispatcher Demand',
                    value: 'High Volume Operations',
                    insight: '50+ loads/day preferred',
                    icon: '📋',
                    color: '#8b5cf6',
                  },
                  {
                    title: 'Owner Operator Rates',
                    value: '$0.58-$0.65/mile',
                    insight: 'Southeast lanes preferred',
                    icon: '🚛',
                    color: '#ef4444',
                  },
                  {
                    title: 'Fleet Partnership',
                    value: '5-50 Truck Capacity',
                    insight: 'Satisfactory+ safety rating',
                    icon: '🏢',
                    color: '#06b6d4',
                  },
                  {
                    name: 'Smart RFx Auto-Bidding',
                    status: 'Rules-Based Automation',
                    lastRun: '15 minutes ago',
                    results:
                      '🤖 Smart RFx Auto-Bidding: 23 opportunities analyzed - 6 auto-submitted (trusted customers, low risk), 12 queued for review (medium risk), 5 manual review required (high risk or auto-bidding disabled by tenant)',
                    nextRun: 'Every 15 minutes',
                    color: '#10b981', // Green to indicate intelligent automation
                    icon: '🤖',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '20px',
                        padding: '8px',
                        background: `${item.color}20`,
                        borderRadius: '8px',
                        border: `1px solid ${item.color}40`,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: '700',
                          color: 'white',
                          marginBottom: '4px',
                          fontSize: '14px',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: item.color,
                          fontSize: '13px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        {item.value}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '11px',
                        }}
                      >
                        {item.insight}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lead Generation View - AI-Powered Prospect Discovery */}
        {activeView === 'lead-generation' && (
          <div>
            <h2
              style={{
                color: '#f97316',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              🎯 AI-Powered Lead Generation & Prospect Discovery
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(249, 115, 22, 0.2)',
                  color: '#f97316',
                  textTransform: 'uppercase',
                }}
              >
                LIVE APIs
              </div>
            </h2>

            {/* API Status Dashboard */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              {[
                {
                  name: 'FMCSA SAFER API',
                  status: 'ACTIVE',
                  key: '7de24c4a...',
                  prospects: '3.2M Carriers',
                  type: 'Government',
                  color: '#10b981',
                  icon: '🏛️',
                },
                {
                  name: 'Weather.gov API',
                  status: 'ACTIVE',
                  key: 'No Key Required',
                  prospects: 'Weather-Sensitive Industries',
                  type: 'Government',
                  color: '#3b82f6',
                  icon: '🌤️',
                },
                {
                  name: 'ExchangeRate API',
                  status: 'ACTIVE',
                  key: 'No Key Required',
                  prospects: 'Import/Export Companies',
                  type: 'Financial',
                  color: '#8b5cf6',
                  icon: '💱',
                },
                {
                  name: 'FRED Economic API',
                  status: 'ACTIVE',
                  key: 'Free Access',
                  prospects: 'Economic Data Analysis',
                  type: 'Economic',
                  color: '#f59e0b',
                  icon: '📊',
                },
                {
                  name: 'ThomasNet Integration',
                  status: 'ACTIVE',
                  key: 'CSV Processing',
                  prospects: '500K+ Manufacturers',
                  type: 'B2B Platform',
                  color: '#ef4444',
                  icon: '🏭',
                },
              ].map((api, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(10px)',
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
                        fontSize: '24px',
                        padding: '8px',
                        background: `${api.color}20`,
                        borderRadius: '8px',
                        border: `1px solid ${api.color}40`,
                      }}
                    >
                      {api.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: '700',
                          color: 'white',
                          fontSize: '16px',
                        }}
                      >
                        {api.name}
                      </div>
                      <div
                        style={{
                          color: api.color,
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {api.type} • {api.status}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      marginBottom: '12px',
                    }}
                  >
                    <strong>Access:</strong> {api.key}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '13px',
                    }}
                  >
                    <strong>Prospects:</strong> {api.prospects}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Automation Services Status */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                marginBottom: '32px',
              }}
            >
              <h3
                style={{
                  color: '#f97316',
                  marginBottom: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🤖 AI Automation Services
                <div
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '8px',
                    fontWeight: '700',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    textTransform: 'uppercase',
                  }}
                >
                  LIVE
                </div>
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    name: 'FMCSA Shipper Intelligence',
                    status: 'Running',
                    lastRun: '2 hours ago',
                    results: '47 shippers discovered',
                    nextRun: 'in 6 hours',
                    color: '#10b981',
                    icon: '🔍',
                  },
                  {
                    name: 'ThomasNet Processing',
                    status: 'Scheduled',
                    lastRun: '1 day ago',
                    results: '235 manufacturers processed',
                    nextRun: 'Weekly Monday 1AM',
                    color: '#ef4444',
                    icon: '🏭',
                  },
                  {
                    name: 'RFx Discovery Only',
                    status: 'Management Review Required',
                    lastRun: '30 minutes ago',
                    results:
                      '23 opportunities found, ALL queued for review (NO AUTO-BIDDING)',
                    nextRun: 'Every 30 minutes',
                    color: '#f59e0b', // Orange to indicate review required
                    icon: '📋',
                  },
                  {
                    name: 'AI Freight Negotiator',
                    status: 'Ready',
                    lastRun: 'On demand',
                    results: '87% success rate',
                    nextRun: 'Real-time',
                    color: '#8b5cf6',
                    icon: '🤝',
                  },
                ].map((service, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '20px',
                          padding: '6px',
                          background: `${service.color}20`,
                          borderRadius: '6px',
                          border: `1px solid ${service.color}40`,
                        }}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          {service.name}
                        </div>
                        <div
                          style={{
                            color: service.color,
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {service.status}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>Last:</strong> {service.lastRun}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '11px',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>Results:</strong> {service.results}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '10px',
                      }}
                    >
                      <strong>Next:</strong> {service.nextRun}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Negotiation Results Display */}
            {negotiationResult && (
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '32px',
                }}
              >
                <h3
                  style={{
                    color: '#8b5cf6',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🤝 AI Negotiation Results
                  <div
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '8px',
                      fontWeight: '700',
                      background: negotiationResult.result?.success
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)',
                      color: negotiationResult.result?.success
                        ? '#10b981'
                        : '#f59e0b',
                      textTransform: 'uppercase',
                    }}
                  >
                    {negotiationResult.result?.success ? 'SUCCESS' : 'PARTIAL'}
                  </div>
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div style={{ color: 'white' }}>
                    <strong>Final Rate:</strong> $
                    {negotiationResult.result?.finalRate?.toLocaleString()}
                  </div>
                  <div style={{ color: 'white' }}>
                    <strong>Duration:</strong>{' '}
                    {negotiationResult.result?.duration}
                  </div>
                  <div style={{ color: 'white' }}>
                    <strong>Variance:</strong>{' '}
                    {negotiationResult.result?.variance?.toFixed(1)}%
                  </div>
                  <div style={{ color: 'white' }}>
                    <strong>Relationship Impact:</strong>{' '}
                    {negotiationResult.result?.relationshipImpact}
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <strong style={{ color: 'white' }}>Tactics Used:</strong>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: '8px',
                    }}
                  >
                    {negotiationResult.result?.tacticsUsed?.join(', ')}
                  </div>
                </div>
                <button
                  onClick={() => setNegotiationResult(null)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#8b5cf6',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Results
                </button>
              </div>
            )}

            {/* AI Training & Analysis Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* AI Learning Patterns */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3
                  style={{
                    color: '#f97316',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🤖 AI Learning Patterns
                  <div
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '8px',
                      fontWeight: '700',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      textTransform: 'uppercase',
                    }}
                  >
                    ACTIVE
                  </div>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      pattern: 'Carrier-Shipper Analysis',
                      confidence: '94%',
                      usage: '247 times',
                      insight: 'Identifies high-value shipper relationships',
                    },
                    {
                      pattern: 'Weather Impact Correlation',
                      confidence: '89%',
                      usage: '156 times',
                      insight: 'Predicts weather-sensitive freight demand',
                    },
                    {
                      pattern: 'Economic Indicator Mapping',
                      confidence: '91%',
                      usage: '203 times',
                      insight: 'Correlates economic data with shipping needs',
                    },
                  ].map((pattern, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          {pattern.pattern}
                        </div>
                        <div
                          style={{
                            color: '#10b981',
                            fontWeight: '600',
                            fontSize: '12px',
                          }}
                        >
                          {pattern.confidence}
                        </div>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Used {pattern.usage} • {pattern.insight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Prospect Generation */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3
                  style={{
                    color: '#f97316',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📈 Live Prospect Generation
                  <div
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '8px',
                      fontWeight: '700',
                      background: 'rgba(217, 70, 239, 0.2)',
                      color: '#d946ef',
                      textTransform: 'uppercase',
                    }}
                  >
                    REAL-TIME
                  </div>
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      company: 'Atlantic Manufacturing Co.',
                      location: 'Atlanta, GA',
                      score: 92,
                      potential: '$45k/month',
                      source: 'FMCSA + Weather Analysis',
                      type: 'Manufacturer',
                    },
                    {
                      company: 'Midwest Logistics Partners',
                      location: 'Chicago, IL',
                      score: 87,
                      potential: '$32k/month',
                      source: 'Economic Indicators',
                      type: '3PL',
                    },
                    {
                      company: 'Southwest Construction LLC',
                      location: 'Dallas, TX',
                      score: 84,
                      potential: '$28k/month',
                      source: 'Weather + FMCSA Data',
                      type: 'Construction',
                    },
                  ].map((prospect, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderLeft: '4px solid #f97316',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          {prospect.company}
                        </div>
                        <div
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '700',
                            background:
                              prospect.score >= 90
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                            color: prospect.score >= 90 ? '#10b981' : '#f59e0b',
                          }}
                        >
                          Score: {prospect.score}
                        </div>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        📍 {prospect.location} • {prospect.type}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '11px',
                          marginBottom: '4px',
                        }}
                      >
                        💰 Potential: {prospect.potential} • Source:{' '}
                        {prospect.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Training Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🎓 AI Lead Generation Training & Actions
                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    background: 'rgba(249, 115, 22, 0.2)',
                    color: '#f97316',
                    textTransform: 'uppercase',
                  }}
                >
                  INTELLIGENT SYSTEM
                </div>
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    title: 'Generate New Prospects',
                    description: 'AI analyzes APIs to find new leads',
                    icon: '🎯',
                    color: '#10b981',
                    action: 'generate-prospects',
                  },
                  {
                    title: 'Train AI Models',
                    description: 'Improve pattern recognition accuracy',
                    icon: '🤖',
                    color: '#8b5cf6',
                    action: 'train-models',
                  },
                  {
                    title: 'Export Prospects',
                    description: 'Download leads for CRM integration',
                    icon: '📊',
                    color: '#f59e0b',
                    action: 'export-data',
                  },
                  {
                    title: 'Analyze Market Trends',
                    description: 'AI-powered market intelligence',
                    icon: '📈',
                    color: '#3b82f6',
                    action: 'analyze-trends',
                  },
                  {
                    title: 'Performance Metrics',
                    description: 'View AI learning progress',
                    icon: '📋',
                    color: '#ef4444',
                    action: 'view-metrics',
                  },
                  {
                    title: 'API Health Check',
                    description: 'Monitor all data source APIs',
                    icon: '🔍',
                    color: '#06b6d4',
                    action: 'health-check',
                  },
                  {
                    title: 'Test AI Negotiator',
                    description: 'Demo AI freight rate negotiation',
                    icon: '🤝',
                    color: '#8b5cf6',
                    action: 'test-negotiator',
                  },
                  {
                    title: 'FMCSA Intelligence',
                    description: 'View shipper discovery results',
                    icon: '🔍',
                    color: '#10b981',
                    action: 'view-fmcsa',
                  },
                  {
                    title: 'RFx Opportunities',
                    description: 'View automated RFx findings',
                    icon: '📋',
                    color: '#3b82f6',
                    action: 'view-rfx',
                  },
                  {
                    title: 'Test Quote Conversion',
                    description: 'Demo lead-to-management workflow',
                    icon: '💰',
                    color: '#10b981',
                    action: 'test-quote-conversion',
                  },
                  {
                    title: 'Test Service Booking',
                    description: 'Demo service booking conversion',
                    icon: '📞',
                    color: '#ef4444',
                    action: 'test-service-booking',
                  },
                  {
                    title: 'Test RFP Win',
                    description: 'Demo government contract win',
                    icon: '🏆',
                    color: '#dc2626',
                    action: 'test-rfp-win',
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: `1px solid ${action.color}40`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = `${action.color}20`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}30`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleAIAction(action.action)}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        padding: '12px',
                        background: `${action.color}20`,
                        borderRadius: '8px',
                        border: `1px solid ${action.color}40`,
                      }}
                    >
                      {action.icon}
                    </div>
                    <div
                      style={{
                        fontWeight: '700',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      {action.title}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      {action.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sales Division View */}
        {activeView === 'sales-division' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  color: '#22c55e',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                🎯 Sales Division Operations
              </h2>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  textTransform: 'uppercase',
                }}
              >
                HUMAN-POWERED
              </div>
            </div>
            <SalesDivisionPlatform />
          </div>
        )}

        {/* Sales Analytics View */}
        {activeView === 'sales-analytics' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  color: '#16a34a',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                📊 Sales Performance Analytics
              </h2>
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  background: 'rgba(22, 163, 74, 0.2)',
                  color: '#16a34a',
                  textTransform: 'uppercase',
                }}
              >
                AI-ENHANCED
              </div>
            </div>
            <SalesAnalyticsDashboard />
          </div>
        )}
      </div>
    </div>
  );
}
