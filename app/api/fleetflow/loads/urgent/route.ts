import { NextRequest, NextResponse } from 'next/server';

// Production urgent loads data for FleetFlow dashboard
const urgentLoads = [
  {
    id: 'FLT-2024-009',
    route: 'Los Angeles, CA → New York, NY',
    equipment: "53' Dry Van",
    revenue: '$4,250',
    priority: 'CRITICAL',
    pickup: 'ASAP',
    delivery: 'Within 48 hours',
    commodity: 'Medical Equipment',
    weight: '18,000 lbs',
    specialRequirements: ['Temperature Controlled', 'Expedited Service'],
    broker: 'MediTrans Healthcare',
    contact: 'Dr. Sarah Johnson',
    phone: '(555) 111-2222',
    reason: 'Life-saving medical equipment for hospital emergency',
    value: '$150,000',
  },
  {
    id: 'FLT-2024-010',
    route: 'Chicago, IL → Miami, FL',
    equipment: "48' Reefer",
    revenue: '$3,800',
    priority: 'HIGH',
    pickup: 'Today',
    delivery: 'Within 36 hours',
    commodity: 'Perishable Vaccines',
    weight: '12,000 lbs',
    specialRequirements: ['Refrigerated', 'Time Critical'],
    broker: 'PharmaCorp Distribution',
    contact: 'Michael Chen',
    phone: '(555) 333-4444',
    reason: 'COVID-19 vaccine delivery for vaccination center',
    value: '$75,000',
  },
  {
    id: 'FLT-2024-011',
    route: 'Seattle, WA → Boston, MA',
    equipment: "26' Box Truck",
    revenue: '$2,100',
    priority: 'HIGH',
    pickup: 'ASAP',
    delivery: 'Within 24 hours',
    commodity: 'Urgent Parts',
    weight: '8,500 lbs',
    specialRequirements: ['Express Delivery', 'Track & Trace'],
    broker: 'TechParts Inc',
    contact: 'Jennifer Martinez',
    phone: '(555) 555-6666',
    reason: 'Critical server components for data center outage',
    value: '$45,000',
  },
  {
    id: 'FLT-2024-012',
    route: 'Dallas, TX → Denver, CO',
    equipment: "53' Flatbed",
    revenue: '$2,750',
    priority: 'CRITICAL',
    pickup: 'Immediate',
    delivery: 'Within 12 hours',
    commodity: 'Emergency Generator',
    weight: '15,000 lbs',
    specialRequirements: ['Heavy Haul', 'Oversize Permit'],
    broker: 'PowerGrid Solutions',
    contact: 'Robert Wilson',
    phone: '(555) 777-8888',
    reason: 'Hospital backup power system failure',
    value: '$200,000',
  },
  {
    id: 'FLT-2024-013',
    route: 'Atlanta, GA → Washington DC',
    equipment: "48' Dry Van",
    revenue: '$1,850',
    priority: 'HIGH',
    pickup: 'Today',
    delivery: 'Within 18 hours',
    commodity: 'Government Documents',
    weight: '6,000 lbs',
    specialRequirements: ['Secure Transport', 'Bonded'],
    broker: 'Federal Logistics',
    contact: 'Agent Thompson',
    phone: '(555) 999-0000',
    reason: 'Classified documents requiring immediate transport',
    value: '$50,000',
  },
  {
    id: 'FLT-2024-014',
    route: 'Phoenix, AZ → Las Vegas, NV',
    equipment: "48' Reefer",
    revenue: '$950',
    priority: 'HIGH',
    pickup: 'ASAP',
    delivery: 'Within 8 hours',
    commodity: 'Blood Products',
    weight: '2,500 lbs',
    specialRequirements: ['Medical Transport', 'Refrigerated'],
    broker: 'BloodBank Network',
    contact: 'Dr. Maria Rodriguez',
    phone: '(555) 222-3333',
    reason: 'Emergency blood supply shortage at medical center',
    value: '$25,000',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Filter urgent loads by priority if requested
    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority');
    const equipment = searchParams.get('equipment');

    let filteredLoads = urgentLoads;

    if (priority) {
      filteredLoads = filteredLoads.filter(
        (load) => load.priority.toLowerCase() === priority.toLowerCase()
      );
    }

    if (equipment) {
      filteredLoads = filteredLoads.filter((load) =>
        load.equipment.toLowerCase().includes(equipment.toLowerCase())
      );
    }

    // Sort by priority (CRITICAL first, then HIGH)
    filteredLoads.sort((a, b) => {
      const priorityOrder = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
      return (
        (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
        (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
      );
    });

    return NextResponse.json({
      loads: filteredLoads,
      total: filteredLoads.length,
      critical: filteredLoads.filter((l) => l.priority === 'CRITICAL').length,
      high: filteredLoads.filter((l) => l.priority === 'HIGH').length,
      lastUpdated: new Date().toISOString(),
      source: 'FleetFlow Urgent Load Board',
      totalValue: filteredLoads.reduce((sum, load) => {
        const value = parseInt(load.value.replace(/[$,]/g, ''));
        return sum + value;
      }, 0),
    });
  } catch (error) {
    console.error('Error fetching urgent loads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch urgent loads data' },
      { status: 500 }
    );
  }
}
