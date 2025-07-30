import { NextRequest, NextResponse } from 'next/server';

interface LeadConversion {
  id: string;
  leadId: string;
  customerName: string;
  customerType: 'SMB' | 'Enterprise' | 'Government';
  conversionType:
    | 'quote_requested'
    | 'service_booked'
    | 'contract_signed'
    | 'meeting_scheduled';
  source:
    | 'FMCSA Discovery'
    | 'Weather Intelligence'
    | 'Economic Intelligence'
    | 'Trade Intelligence'
    | 'ThomasNet Directory';
  potentialValue: number;
  actualValue?: number;
  priority: 'standard' | 'high' | 'urgent';
  timestamp: string;
  tenantId: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  serviceType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

// In-memory storage for demo purposes
let leadConversions: LeadConversion[] = [
  {
    id: 'LC-001',
    leadId: 'LEAD-1735663200001',
    customerName: 'Acme Transportation Co.',
    customerType: 'SMB',
    conversionType: 'quote_requested',
    source: 'FMCSA Discovery',
    potentialValue: 25000,
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    tenantId: 'tenant-demo-123',
    contactInfo: {
      name: 'John Smith',
      email: 'john@acmetrans.com',
      phone: '(555) 123-4567',
      company: 'Acme Transportation Co.',
    },
    serviceType: 'Full Truckload Services',
    status: 'pending',
  },
  {
    id: 'LC-002',
    leadId: 'LEAD-1735663200002',
    customerName: 'Global Logistics Ltd.',
    customerType: 'Enterprise',
    conversionType: 'service_booked',
    source: 'Economic Intelligence',
    potentialValue: 75000,
    actualValue: 68000,
    priority: 'urgent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    tenantId: 'tenant-demo-123',
    contactInfo: {
      name: 'Sarah Wilson',
      email: 'sarah@globallogistics.com',
      phone: '(555) 987-6543',
      company: 'Global Logistics Ltd.',
    },
    serviceType: 'LTL & Freight Brokerage',
    status: 'completed',
  },
  {
    id: 'LC-003',
    leadId: 'LEAD-1735663200003',
    customerName: 'City of Springfield',
    customerType: 'Government',
    conversionType: 'contract_signed',
    source: 'Trade Intelligence',
    potentialValue: 150000,
    actualValue: 142000,
    priority: 'urgent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    tenantId: 'tenant-demo-123',
    contactInfo: {
      name: 'Michael Brown',
      email: 'mbrown@springfield.gov',
      phone: '(555) 246-8135',
      company: 'City of Springfield',
    },
    serviceType: 'Government Transportation Contract',
    status: 'in_progress',
  },
];

// GET - Fetch lead conversions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          error: 'tenantId is required',
        },
        { status: 400 }
      );
    }

    // Filter by tenant and apply limit
    const filteredConversions = leadConversions
      .filter((conversion) => conversion.tenantId === tenantId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, limit);

    const summary = {
      totalConversions: filteredConversions.length,
      totalValue: filteredConversions.reduce(
        (sum, conv) => sum + (conv.actualValue || conv.potentialValue),
        0
      ),
      urgentCount: filteredConversions.filter(
        (conv) => conv.priority === 'urgent'
      ).length,
      recentActivity: filteredConversions.slice(0, 3),
    };

    return NextResponse.json({
      success: true,
      data: {
        recentConversions: filteredConversions,
        summary,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ AI Flow Lead Conversion GET failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch lead conversions',
      },
      { status: 500 }
    );
  }
}

// PUT - Process/Update lead conversion
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'action and data are required',
        },
        { status: 400 }
      );
    }

    // Create new lead conversion
    const newConversion: LeadConversion = {
      id: `LC-${Date.now()}`,
      leadId: data.leadId,
      customerName: data.customerName,
      customerType: determineCustomerType(data.customerName, data.serviceType),
      conversionType: mapActionToConversionType(action),
      source: data.source || 'FMCSA Discovery',
      potentialValue:
        data.serviceValue || data.contractValue || data.quoteValue || 0,
      actualValue:
        action === 'contract_signed'
          ? data.contractValue || data.serviceValue
          : undefined,
      priority: determinePriority(
        data.serviceValue || data.contractValue || data.quoteValue || 0
      ),
      timestamp: new Date().toISOString(),
      tenantId: data.tenantId,
      contactInfo: data.contactInfo,
      serviceType: data.serviceType,
      status: mapActionToStatus(action),
    };

    // Add to storage
    leadConversions.unshift(newConversion);

    // Keep only last 100 conversions to prevent memory issues
    if (leadConversions.length > 100) {
      leadConversions = leadConversions.slice(0, 100);
    }

    console.log(
      `✅ AI Flow Lead Conversion processed: ${action} for ${data.customerName}`
    );

    return NextResponse.json({
      success: true,
      data: {
        conversion: newConversion,
        message: `Lead conversion ${action} processed successfully`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ AI Flow Lead Conversion PUT failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process lead conversion',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function determineCustomerType(
  customerName: string,
  serviceType: string
): 'SMB' | 'Enterprise' | 'Government' {
  if (
    customerName.includes('City of') ||
    customerName.includes('County of') ||
    serviceType.includes('Government')
  ) {
    return 'Government';
  }
  if (
    customerName.includes('Global') ||
    customerName.includes('International') ||
    customerName.includes('Corp')
  ) {
    return 'Enterprise';
  }
  return 'SMB';
}

function mapActionToConversionType(
  action: string
): LeadConversion['conversionType'] {
  switch (action) {
    case 'quote_generated':
      return 'quote_requested';
    case 'service_scheduled':
      return 'service_booked';
    case 'contract_generated':
      return 'contract_signed';
    case 'meeting_scheduled':
      return 'meeting_scheduled';
    default:
      return 'quote_requested';
  }
}

function mapActionToStatus(action: string): LeadConversion['status'] {
  switch (action) {
    case 'quote_generated':
      return 'pending';
    case 'service_scheduled':
      return 'in_progress';
    case 'contract_generated':
      return 'completed';
    case 'meeting_scheduled':
      return 'pending';
    default:
      return 'pending';
  }
}

function determinePriority(value: number): 'standard' | 'high' | 'urgent' {
  if (value >= 100000) return 'urgent';
  if (value >= 50000) return 'high';
  return 'standard';
}
