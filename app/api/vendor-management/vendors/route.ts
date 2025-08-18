import { NextResponse } from 'next/server';

// Mock vendor storage (in production, this would be a database)
let vendors: any[] = [
  {
    id: 1,
    name: 'Premium Logistics Solutions',
    category: 'Transportation',
    performance: 97.2,
    spend: 485000,
    status: 'excellent',
    contract_expires: '2025-08-15',
  },
  {
    id: 2,
    name: 'TechFlow Integration Services',
    category: 'Technology',
    performance: 94.8,
    spend: 325000,
    status: 'good',
    contract_expires: '2025-12-01',
  },
  {
    id: 3,
    name: 'Global Fuel Card Solutions',
    category: 'Fuel Management',
    performance: 89.5,
    spend: 892000,
    status: 'good',
    contract_expires: '2025-03-20',
  },
];

export async function GET() {
  try {
    return NextResponse.json({ vendors });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const vendorData = await request.json();

    // Generate unique ID
    const newVendor = {
      ...vendorData,
      id: vendors.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to vendors array
    vendors.push(newVendor);

    console.log('✅ New vendor created:', newVendor);

    return NextResponse.json(
      {
        message: 'Vendor created successfully',
        vendor: newVendor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating vendor:', error);
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();

    const vendorIndex = vendors.findIndex((v) => v.id === id);
    if (vendorIndex === -1) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    vendors[vendorIndex] = {
      ...vendors[vendorIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Vendor updated successfully',
      vendor: vendors[vendorIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const vendorIndex = vendors.findIndex((v) => v.id === id);
    if (vendorIndex === -1) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const deletedVendor = vendors.splice(vendorIndex, 1)[0];

    return NextResponse.json({
      message: 'Vendor deleted successfully',
      vendor: deletedVendor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}




