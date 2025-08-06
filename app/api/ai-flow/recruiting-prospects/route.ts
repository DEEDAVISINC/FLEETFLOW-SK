import { NextRequest, NextResponse } from 'next/server';

interface CarrierProspect {
  id: string;
  companyName: string;
  mcNumber?: string;
  dotNumber?: string;
  contactInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  businessInfo: {
    fleetSize: number;
    equipmentTypes: string[];
    operatingStates: string[];
    specializations: string[];
    yearsInBusiness: number;
  };
  aiScore: {
    overall: number;
    financial: number;
    safety: number;
    performance: number;
    compatibility: number;
  };
  source: 'FMCSA Discovery' | 'Industry Research' | 'Referral' | 'Cold Outreach';
  status: 'new_prospect' | 'contacted' | 'interested' | 'qualified' | 'ready_for_onboarding' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  lastContact?: string;
  nextAction: string;
  notes: string;
  estimatedRevenue: number;
  conversionProbability: number;
  onboardingApprovalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  tenantId: string;
}

interface OnboardingNotification {
  id: string;
  prospectId: string;
  prospectName: string;
  type: 'approval_request' | 'prospect_ready' | 'high_value_prospect';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'actioned';
  assignedTo: string[];
  metadata: {
    estimatedRevenue: number;
    aiScore: number;
    source: string;
  };
}

// In-memory storage for demo purposes
const carrierProspects: CarrierProspect[] = [
  {
    id: 'CP-001',
    companyName: 'Elite Freight Solutions LLC',
    mcNumber: 'MC-789456',
    dotNumber: 'DOT-1234567',
    contactInfo: {
      name: 'Michael Rodriguez',
      title: 'Fleet Manager',
      email: 'mrodriguez@elitefreight.com',
      phone: '(555) 987-6543'
    },
    businessInfo: {
      fleetSize: 15,
      equipmentTypes: ['Dry Van', 'Refrigerated', 'Flatbed'],
      operatingStates: ['TX', 'OK', 'NM', 'AR', 'LA'],
      specializations: ['Food Grade', 'Temperature Controlled'],
      yearsInBusiness: 8
    },
    aiScore: {
      overall: 92,
      financial: 88,
      safety: 95,
      performance: 90,
      compatibility: 94
    },
    source: 'FMCSA Discovery',
    status: 'ready_for_onboarding',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    lastContact: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    nextAction: 'Send onboarding approval request',
    notes: 'High-performing carrier with excellent safety record. Specializes in temperature-controlled freight. Strong financial standing.',
    estimatedRevenue: 180000,
    conversionProbability: 85,
    onboardingApprovalStatus: 'pending',
    tenantId: 'tenant-demo-123'
  },
  {
    id: 'CP-002',
    companyName: 'Southwest Transport Co.',
    mcNumber: 'MC-456789',
    dotNumber: 'DOT-2345678',
    contactInfo: {
      name: 'Sarah Johnson',
      title: 'Owner Operator',
      email: 'sarah@swtransport.com',
      phone: '(555) 456-7890'
    },
    businessInfo: {
      fleetSize: 3,
      equipmentTypes: ['Dry Van'],
      operatingStates: ['TX', 'NM', 'AZ'],
      specializations: ['Regional Delivery'],
      yearsInBusiness: 5
    },
    aiScore: {
      overall: 78,
      financial: 75,
      safety: 82,
      performance: 76,
      compatibility: 80
    },
    source: 'Industry Research',
    status: 'qualified',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lastContact: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    nextAction: 'Schedule qualification call',
    notes: 'Small but reliable carrier. Good for regional routes. Potential for growth.',
    estimatedRevenue: 75000,
    conversionProbability: 65,
    tenantId: 'tenant-demo-123'
  },
  {
    id: 'CP-003',
    companyName: 'Prime Logistics Network',
    mcNumber: 'MC-123987',
    dotNumber: 'DOT-3456789',
    contactInfo: {
      name: 'David Chen',
      title: 'Operations Director',
      email: 'dchen@primelogistics.com',
      phone: '(555) 321-9876'
    },
    businessInfo: {
      fleetSize: 45,
      equipmentTypes: ['Dry Van', 'Flatbed', 'Step Deck', 'Lowboy'],
      operatingStates: ['TX', 'CA', 'AZ', 'NV', 'CO', 'UT'],
      specializations: ['Heavy Haul', 'Oversized Loads', 'Construction Equipment'],
      yearsInBusiness: 12
    },
    aiScore: {
      overall: 96,
      financial: 94,
      safety: 97,
      performance: 95,
      compatibility: 98
    },
    source: 'Referral',
    status: 'ready_for_onboarding',
    priority: 'urgent',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastContact: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    nextAction: 'Immediate onboarding approval needed',
    notes: 'Premium carrier with specialized heavy haul capabilities. Excellent safety record and financial stability. High-value prospect.',
    estimatedRevenue: 450000,
    conversionProbability: 95,
    onboardingApprovalStatus: 'pending',
    tenantId: 'tenant-demo-123'
  },
  {
    id: 'CP-004',
    companyName: 'Midwest Express Lines',
    contactInfo: {
      name: 'Jennifer Williams',
      title: 'Fleet Coordinator',
      email: 'jwilliams@midwestexpress.com',
      phone: '(555) 654-3210'
    },
    businessInfo: {
      fleetSize: 8,
      equipmentTypes: ['Dry Van', 'Refrigerated'],
      operatingStates: ['IL', 'IN', 'OH', 'MI', 'WI'],
      specializations: ['Food Distribution', 'Retail Delivery'],
      yearsInBusiness: 6
    },
    aiScore: {
      overall: 84,
      financial: 80,
      safety: 88,
      performance: 82,
      compatibility: 86
    },
    source: 'Cold Outreach',
    status: 'interested',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    lastContact: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    nextAction: 'Send detailed proposal',
    notes: 'Responded positively to initial outreach. Interested in expanding operations. Good fit for food distribution network.',
    estimatedRevenue: 120000,
    conversionProbability: 70,
    tenantId: 'tenant-demo-123'
  }
];

const onboardingNotifications: OnboardingNotification[] = [
  {
    id: 'ON-001',
    prospectId: 'CP-001',
    prospectName: 'Elite Freight Solutions LLC',
    type: 'approval_request',
    priority: 'high',
    message: 'High-scoring carrier prospect ready for onboarding approval. AI Score: 92/100, Estimated Revenue: $180K',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'unread',
    assignedTo: ['management', 'onboarding'],
    metadata: {
      estimatedRevenue: 180000,
      aiScore: 92,
      source: 'FMCSA Discovery'
    }
  },
  {
    id: 'ON-002',
    prospectId: 'CP-003',
    prospectName: 'Prime Logistics Network',
    type: 'high_value_prospect',
    priority: 'urgent',
    message: 'URGENT: Premium carrier prospect with $450K revenue potential. Immediate approval recommended.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: 'unread',
    assignedTo: ['management', 'onboarding', 'executive'],
    metadata: {
      estimatedRevenue: 450000,
      aiScore: 96,
      source: 'Referral'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'get_prospects';
    const tenantId = searchParams.get('tenantId') || 'tenant-demo-123';
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    console.log(`🎯 AI Recruiting Prospects API - Action: ${action}`);

    switch (action) {
      case 'get_prospects':
        let filteredProspects = carrierProspects.filter(p => p.tenantId === tenantId);
        
        if (status) {
          filteredProspects = filteredProspects.filter(p => p.status === status);
        }
        
        if (priority) {
          filteredProspects = filteredProspects.filter(p => p.priority === priority);
        }

        const prospects = filteredProspects
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);

        return NextResponse.json({
          success: true,
          data: {
            prospects,
            total: filteredProspects.length,
            metrics: {
              totalProspects: filteredProspects.length,
              readyForOnboarding: filteredProspects.filter(p => p.status === 'ready_for_onboarding').length,
              averageAIScore: Math.round(filteredProspects.reduce((sum, p) => sum + p.aiScore.overall, 0) / filteredProspects.length),
              totalEstimatedRevenue: filteredProspects.reduce((sum, p) => sum + p.estimatedRevenue, 0),
              conversionRate: Math.round(filteredProspects.reduce((sum, p) => sum + p.conversionProbability, 0) / filteredProspects.length)
            }
          }
        });

      case 'get_notifications':
        const notifications = onboardingNotifications
          .filter(n => n.assignedTo.includes('management') || n.assignedTo.includes('onboarding'))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);

        return NextResponse.json({
          success: true,
          data: {
            notifications,
            unreadCount: notifications.filter(n => n.status === 'unread').length
          }
        });

      case 'get_prospect_details':
        const prospectId = searchParams.get('prospectId');
        if (!prospectId) {
          return NextResponse.json({ error: 'Prospect ID required' }, { status: 400 });
        }

        const prospect = carrierProspects.find(p => p.id === prospectId);
        if (!prospect) {
          return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: { prospect }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Recruiting Prospects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, prospectId, approvalData } = body;

    console.log(`🎯 AI Recruiting Prospects API - POST Action: ${action}`);

    switch (action) {
      case 'approve_onboarding':
        if (!prospectId || !approvalData) {
          return NextResponse.json({ error: 'Prospect ID and approval data required' }, { status: 400 });
        }

        const prospectIndex = carrierProspects.findIndex(p => p.id === prospectId);
        if (prospectIndex === -1) {
          return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
        }

        // Update prospect with approval
        carrierProspects[prospectIndex] = {
          ...carrierProspects[prospectIndex],
          onboardingApprovalStatus: 'approved',
          approvedBy: approvalData.approvedBy,
          approvedAt: new Date().toISOString(),
          status: 'ready_for_onboarding',
          notes: `${carrierProspects[prospectIndex].notes}\n\nAPPROVED FOR ONBOARDING: ${approvalData.notes || 'Management approval granted'}`
        };

        // Mark related notifications as actioned
        onboardingNotifications.forEach(notification => {
          if (notification.prospectId === prospectId) {
            notification.status = 'actioned';
          }
        });

        // Create success notification
        const approvalNotification: OnboardingNotification = {
          id: `ON-${Date.now()}`,
          prospectId,
          prospectName: carrierProspects[prospectIndex].companyName,
          type: 'prospect_ready',
          priority: 'high',
          message: `${carrierProspects[prospectIndex].companyName} has been approved for onboarding. Ready to begin 6-step process.`,
          createdAt: new Date().toISOString(),
          status: 'unread',
          assignedTo: ['onboarding'],
          metadata: {
            estimatedRevenue: carrierProspects[prospectIndex].estimatedRevenue,
            aiScore: carrierProspects[prospectIndex].aiScore.overall,
            source: carrierProspects[prospectIndex].source
          }
        };

        onboardingNotifications.unshift(approvalNotification);

        return NextResponse.json({
          success: true,
          data: {
            prospect: carrierProspects[prospectIndex],
            notification: approvalNotification
          }
        });

      case 'reject_onboarding':
        if (!prospectId || !approvalData) {
          return NextResponse.json({ error: 'Prospect ID and rejection data required' }, { status: 400 });
        }

        const rejectIndex = carrierProspects.findIndex(p => p.id === prospectId);
        if (rejectIndex === -1) {
          return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
        }

        // Update prospect with rejection
        carrierProspects[rejectIndex] = {
          ...carrierProspects[rejectIndex],
          onboardingApprovalStatus: 'rejected',
          approvedBy: approvalData.rejectedBy,
          approvedAt: new Date().toISOString(),
          status: 'rejected',
          notes: `${carrierProspects[rejectIndex].notes}\n\nREJECTED FOR ONBOARDING: ${approvalData.reason || 'Management rejection'}`
        };

        // Mark related notifications as actioned
        onboardingNotifications.forEach(notification => {
          if (notification.prospectId === prospectId) {
            notification.status = 'actioned';
          }
        });

        return NextResponse.json({
          success: true,
          data: { prospect: carrierProspects[rejectIndex] }
        });

      case 'update_prospect_status':
        if (!prospectId || !body.status) {
          return NextResponse.json({ error: 'Prospect ID and status required' }, { status: 400 });
        }

        const updateIndex = carrierProspects.findIndex(p => p.id === prospectId);
        if (updateIndex === -1) {
          return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
        }

        carrierProspects[updateIndex] = {
          ...carrierProspects[updateIndex],
          status: body.status,
          lastContact: new Date().toISOString(),
          notes: body.notes ? `${carrierProspects[updateIndex].notes}\n\n${body.notes}` : carrierProspects[updateIndex].notes
        };

        return NextResponse.json({
          success: true,
          data: { prospect: carrierProspects[updateIndex] }
        });

      case 'mark_notification_read':
        const notificationId = body.notificationId;
        if (!notificationId) {
          return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
        }

        const notification = onboardingNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.status = 'read';
        }

        return NextResponse.json({
          success: true,
          data: { notification }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Recruiting Prospects API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
