import { NextRequest, NextResponse } from 'next/server';

// Production-ready load data for FleetFlow dashboard
const productionLoads = [
  {
    id: 'FLT-2024-001',
    status: 'active',
    origin: 'Los Angeles, CA',
    destination: 'Chicago, IL',
    driver: 'Mike Johnson',
    truck: 'Peterbilt 579',
    revenue: '$3,250',
    distance: '2,150 miles',
    eta: '3:45 PM',
    progress: 65,
    commodity: 'Electronics',
    weight: '22,000 lbs',
    priority: 'high',
    broker: {
      company: 'TechTrans Logistics',
      contact: 'Sarah Martinez',
      phone: '(555) 123-4567',
      email: 'sarah@techtrans.com',
      mcNumber: 'MC-123456',
      rating: 4.8,
      paymentTerms: 'Net 15',
      creditRating: 'A+',
    },
  },
  {
    id: 'FLT-2024-002',
    status: 'active',
    origin: 'Dallas, TX',
    destination: 'Atlanta, GA',
    driver: 'James Wilson',
    truck: 'Kenworth T680',
    revenue: '$1,850',
    distance: '780 miles',
    eta: '8:30 AM',
    progress: 30,
    commodity: 'Food Products',
    weight: '18,500 lbs',
    priority: 'medium',
    broker: {
      company: 'Southern Foods Inc',
      contact: 'David Chen',
      phone: '(555) 987-6543',
      email: 'david@southernfoods.com',
      mcNumber: 'MC-789012',
      rating: 4.6,
      paymentTerms: 'Net 10',
      creditRating: 'A',
    },
  },
  {
    id: 'FLT-2024-003',
    status: 'pending',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    driver: 'Unassigned',
    truck: 'Available',
    revenue: '$2,750',
    distance: '1,350 miles',
    eta: 'TBD',
    progress: 0,
    commodity: 'Industrial Parts',
    weight: '15,000 lbs',
    priority: 'medium',
    broker: {
      company: 'Mountain Industrial',
      contact: 'Lisa Rodriguez',
      phone: '(555) 555-0123',
      email: 'lisa@mountainindustrial.com',
      mcNumber: 'MC-345678',
      rating: 4.9,
      paymentTerms: 'Net 20',
      creditRating: 'AA',
    },
  },
  {
    id: 'FLT-2024-004',
    status: 'active',
    origin: 'Phoenix, AZ',
    destination: 'Portland, OR',
    driver: 'Carlos Mendoza',
    truck: 'Freightliner Cascadia',
    revenue: '$2,200',
    distance: '1,050 miles',
    eta: '5:15 PM',
    progress: 85,
    commodity: 'Medical Supplies',
    weight: '12,000 lbs',
    priority: 'high',
    broker: {
      company: 'HealthFirst Distribution',
      contact: 'Maria Garcia',
      phone: '(555) 777-8888',
      email: 'maria@healthfirst.com',
      mcNumber: 'MC-901234',
      rating: 4.7,
      paymentTerms: 'Net 7',
      creditRating: 'AA-',
    },
  },
  {
    id: 'FLT-2024-005',
    status: 'delivered',
    origin: 'Miami, FL',
    destination: 'Nashville, TN',
    driver: 'Robert Davis',
    truck: 'Volvo VNL',
    revenue: '$1,650',
    distance: '950 miles',
    eta: 'Delivered',
    progress: 100,
    commodity: 'Consumer Goods',
    weight: '20,000 lbs',
    priority: 'low',
    broker: {
      company: 'Sunshine Retail',
      contact: 'Jennifer Taylor',
      phone: '(555) 222-3333',
      email: 'jennifer@sunshine.com',
      mcNumber: 'MC-567890',
      rating: 4.5,
      paymentTerms: 'Net 30',
      creditRating: 'BBB+',
    },
  },
  {
    id: 'FLT-2024-006',
    status: 'active',
    origin: 'Houston, TX',
    destination: 'New Orleans, LA',
    driver: 'Antonio Silva',
    truck: 'International LT',
    revenue: '$950',
    distance: '340 miles',
    eta: '12:45 PM',
    progress: 45,
    commodity: 'Chemicals',
    weight: '25,000 lbs',
    priority: 'high',
    broker: {
      company: 'Chemical Solutions',
      contact: 'Dr. Michael Brown',
      phone: '(555) 444-5555',
      email: 'michael@chemicalsolutions.com',
      mcNumber: 'MC-112233',
      rating: 4.4,
      paymentTerms: 'Net 14',
      creditRating: 'A-',
    },
  },
  {
    id: 'FLT-2024-007',
    status: 'pending',
    origin: 'Salt Lake City, UT',
    destination: 'Las Vegas, NV',
    driver: 'Unassigned',
    truck: 'Available',
    revenue: '$1,100',
    distance: '420 miles',
    eta: 'TBD',
    progress: 0,
    commodity: 'Construction Materials',
    weight: '28,000 lbs',
    priority: 'medium',
    broker: {
      company: 'Desert Builders Supply',
      contact: 'Tom Anderson',
      phone: '(555) 666-7777',
      email: 'tom@desertbuilders.com',
      mcNumber: 'MC-445566',
      rating: 4.3,
      paymentTerms: 'Net 21',
      creditRating: 'BBB',
    },
  },
  {
    id: 'FLT-2024-008',
    status: 'active',
    origin: 'Detroit, MI',
    destination: 'Cleveland, OH',
    driver: 'Kevin Murphy',
    truck: 'Mack Anthem',
    revenue: '$650',
    distance: '170 miles',
    eta: '2:30 PM',
    progress: 75,
    commodity: 'Automotive Parts',
    weight: '16,000 lbs',
    priority: 'medium',
    broker: {
      company: 'MotorCity Auto',
      contact: 'Susan Williams',
      phone: '(555) 888-9999',
      email: 'susan@motorcity.com',
      mcNumber: 'MC-778899',
      rating: 4.8,
      paymentTerms: 'Net 12',
      creditRating: 'A',
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, this would connect to your database
    // For now, return production-ready sample data
    return NextResponse.json({
      loads: productionLoads,
      total: productionLoads.length,
      lastUpdated: new Date().toISOString(),
      source: 'FleetFlow TMS Database',
    });
  } catch (error) {
    console.error('Error fetching loads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loads data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In production, this would create a new load in the database
    const newLoad = {
      id: `FLT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      load: newLoad,
      message: 'Load created successfully',
    });
  } catch (error) {
    console.error('Error creating load:', error);
    return NextResponse.json(
      { error: 'Failed to create load' },
      { status: 500 }
    );
  }
}
