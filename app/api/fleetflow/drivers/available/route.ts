import { NextRequest, NextResponse } from 'next/server';

// Production driver data for FleetFlow dashboard
const availableDrivers = [
  {
    id: 'DRV-001',
    name: 'Mike Johnson',
    location: 'Los Angeles, CA',
    distance: '0 miles',
    status: 'available',
    equipment: "53' Dry Van",
    experience: '12 years',
    rating: 4.9,
    lastLoad: '2 hours ago',
    nextAvailable: 'Now',
    specialties: ['Electronics', 'High-Value Cargo'],
    certifications: ['Hazmat', 'TWIC'],
    phone: '(555) 123-4567',
    email: 'mike.johnson@fleetflow.com',
  },
  {
    id: 'DRV-002',
    name: 'James Wilson',
    location: 'Dallas, TX',
    distance: '15 miles',
    status: 'available',
    equipment: "48' Reefer",
    experience: '8 years',
    rating: 4.7,
    lastLoad: '4 hours ago',
    nextAvailable: 'Now',
    specialties: ['Food Products', 'Perishables'],
    certifications: ['Food Safety', 'Refrigerated'],
    phone: '(555) 234-5678',
    email: 'james.wilson@fleetflow.com',
  },
  {
    id: 'DRV-003',
    name: 'Carlos Mendoza',
    location: 'Phoenix, AZ',
    distance: '8 miles',
    status: 'available',
    equipment: "53' Dry Van",
    experience: '15 years',
    rating: 4.8,
    lastLoad: '1 hour ago',
    nextAvailable: 'Now',
    specialties: ['Medical Supplies', 'Pharmaceuticals'],
    certifications: ['Hazmat', 'Medical Transport'],
    phone: '(555) 345-6789',
    email: 'carlos.mendoza@fleetflow.com',
  },
  {
    id: 'DRV-004',
    name: 'Robert Davis',
    location: 'Miami, FL',
    distance: '0 miles',
    status: 'available',
    equipment: "26' Box Truck",
    experience: '6 years',
    rating: 4.6,
    lastLoad: '6 hours ago',
    nextAvailable: 'Now',
    specialties: ['Local Delivery', 'Consumer Goods'],
    certifications: ['CDL Class B'],
    phone: '(555) 456-7890',
    email: 'robert.davis@fleetflow.com',
  },
  {
    id: 'DRV-005',
    name: 'Antonio Silva',
    location: 'Houston, TX',
    distance: '12 miles',
    status: 'available',
    equipment: "53' Tanker",
    experience: '10 years',
    rating: 4.5,
    lastLoad: '3 hours ago',
    nextAvailable: 'Now',
    specialties: ['Chemicals', 'Hazardous Materials'],
    certifications: ['Hazmat', 'Tanker'],
    phone: '(555) 567-8901',
    email: 'antonio.silva@fleetflow.com',
  },
  {
    id: 'DRV-006',
    name: 'Kevin Murphy',
    location: 'Detroit, MI',
    distance: '5 miles',
    status: 'available',
    equipment: "48' Flatbed",
    experience: '14 years',
    rating: 4.9,
    lastLoad: '5 hours ago',
    nextAvailable: 'Now',
    specialties: ['Automotive Parts', 'Machinery'],
    certifications: ['Heavy Haul', 'Oversize'],
    phone: '(555) 678-9012',
    email: 'kevin.murphy@fleetflow.com',
  },
  {
    id: 'DRV-007',
    name: 'Lisa Chen',
    location: 'Seattle, WA',
    distance: '18 miles',
    status: 'available',
    equipment: "53' Dry Van",
    experience: '9 years',
    rating: 4.8,
    lastLoad: '2 hours ago',
    nextAvailable: 'Now',
    specialties: ['Technology', 'High-Value Cargo'],
    certifications: ['Security', 'High-Value'],
    phone: '(555) 789-0123',
    email: 'lisa.chen@fleetflow.com',
  },
  {
    id: 'DRV-008',
    name: 'David Rodriguez',
    location: 'Denver, CO',
    distance: '22 miles',
    status: 'available',
    equipment: "48' Reefer",
    experience: '11 years',
    rating: 4.7,
    lastLoad: '7 hours ago',
    nextAvailable: 'Now',
    specialties: ['Food Products', 'Dairy'],
    certifications: ['Food Safety', 'Refrigerated'],
    phone: '(555) 890-1234',
    email: 'david.rodriguez@fleetflow.com',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Filter drivers by location, equipment type, or availability if requested
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const equipment = searchParams.get('equipment');
    const specialty = searchParams.get('specialty');

    let filteredDrivers = availableDrivers;

    if (location) {
      filteredDrivers = filteredDrivers.filter((driver) =>
        driver.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (equipment) {
      filteredDrivers = filteredDrivers.filter((driver) =>
        driver.equipment.toLowerCase().includes(equipment.toLowerCase())
      );
    }

    if (specialty) {
      filteredDrivers = filteredDrivers.filter((driver) =>
        driver.specialties.some((spec) =>
          spec.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    // Sort by distance (closest first)
    filteredDrivers.sort((a, b) => {
      const aDistance = parseInt(a.distance.split(' ')[0]);
      const bDistance = parseInt(b.distance.split(' ')[0]);
      return aDistance - bDistance;
    });

    return NextResponse.json({
      drivers: filteredDrivers,
      total: filteredDrivers.length,
      lastUpdated: new Date().toISOString(),
      source: 'FleetFlow Driver Network',
      averageRating:
        filteredDrivers.reduce((sum, driver) => sum + driver.rating, 0) /
        filteredDrivers.length,
    });
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver data' },
      { status: 500 }
    );
  }
}
