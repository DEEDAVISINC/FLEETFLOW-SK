import { NextResponse } from 'next/server';

// No mock data - production ready for database integration

export async function GET() {
  try {
    // Production database query - uncomment when database is connected
    // const rfxRequests = await db.rfxRequests.findMany({
    //   where: { status: 'Active' },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Return empty array - no mock data
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching RFX requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RFX requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Production database insertion - uncomment when database is connected
    // const newRfxRequest = await db.rfxRequests.create({
    //   data: {
    //     ...body,
    //     status: 'Active',
    //     currentBids: 0,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   }
    // });

    // Return error - database not connected
    return NextResponse.json(
      { error: 'Database not connected - RFX creation not available' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Error creating RFX request:', error);
    return NextResponse.json(
      { error: 'Failed to create RFX request' },
      { status: 500 }
    );
  }
}
