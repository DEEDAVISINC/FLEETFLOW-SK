import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../utils/logger';

// Configure this route for dynamic rendering
export const dynamic = 'force-dynamic';

// Mock database for development
const mockDatabase: {
  loads: Array<{
    id: string;
    posterId: string;
    posterCompany: string;
    posterRating: number;
    title: string;
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    weight: number;
    loadType: string;
    rate: number;
    distance: number;
    specialRequirements: string[];
    isUrgent: boolean;
    networkStatus: string;
    bids: any[];
    assignedCarrierId?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  capacity: any[];
  partners: any[];
  transactions: any[];
  metrics: any;
} = {
  loads: [
    {
      id: 'NL001',
      posterId: 'USER001',
      posterCompany: 'Acme Logistics',
      posterRating: 4.8,
      title: 'Electronics Shipment - Chicago to Atlanta',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      pickupDate: '2025-07-15T08:00:00Z',
      deliveryDate: '2025-07-17T17:00:00Z',
      weight: 15000,
      loadType: 'dry_van',
      rate: 2400,
      distance: 715,
      specialRequirements: ['temperature_controlled', 'security_required'],
      isUrgent: false,
      networkStatus: 'available',
      bids: [],
      createdAt: '2025-07-09T10:00:00Z',
      updatedAt: '2025-07-09T10:00:00Z',
    },
    {
      id: 'NL002',
      posterId: 'USER002',
      posterCompany: 'Fresh Foods Inc',
      posterRating: 4.6,
      title: 'Refrigerated Produce - LA to Denver',
      origin: 'Los Angeles, CA',
      destination: 'Denver, CO',
      pickupDate: '2025-07-12T06:00:00Z',
      deliveryDate: '2025-07-13T18:00:00Z',
      weight: 25000,
      loadType: 'refrigerated',
      rate: 3200,
      distance: 1015,
      specialRequirements: ['temperature_controlled', 'food_grade'],
      isUrgent: true,
      networkStatus: 'bidding',
      bids: [
        {
          id: 'BID001',
          carrierId: 'CARRIER001',
          carrierCompany: 'CoolTrans LLC',
          carrierRating: 4.9,
          bidAmount: 3100,
          proposedPickupTime: '2025-07-12T05:30:00Z',
          proposedDeliveryTime: '2025-07-13T16:00:00Z',
          equipment: 'Refrigerated Trailer',
          message: 'Specialized in fresh produce transport',
          status: 'pending',
          submittedAt: '2025-07-09T14:30:00Z',
        },
      ],
      createdAt: '2025-07-09T09:15:00Z',
      updatedAt: '2025-07-09T14:30:00Z',
    },
    {
      id: 'NL003',
      posterId: 'USER003',
      posterCompany: 'Steel Works Corp',
      posterRating: 4.7,
      title: 'Steel Coils - Pittsburgh to Detroit',
      origin: 'Pittsburgh, PA',
      destination: 'Detroit, MI',
      pickupDate: '2025-07-16T07:00:00Z',
      deliveryDate: '2025-07-17T15:00:00Z',
      weight: 45000,
      loadType: 'flatbed',
      rate: 1850,
      distance: 288,
      specialRequirements: ['flatbed', 'tarps', 'straps'],
      isUrgent: false,
      networkStatus: 'available',
      bids: [],
      createdAt: '2025-07-09T11:30:00Z',
      updatedAt: '2025-07-09T11:30:00Z',
    },
  ],
  capacity: [
    {
      id: 'NC001',
      carrierId: 'CARRIER002',
      carrierCompany: 'Highway Heroes',
      carrierRating: 4.7,
      vehicleId: 'TRK-101',
      vehicleType: 'truck',
      currentLocation: 'Dallas, TX',
      availableDate: '2025-07-14T00:00:00Z',
      destination: 'Miami, FL',
      capacity: 40000,
      specializations: ['dry_van', 'electronics'],
      ratePerMile: 2.2,
      isAvailable: true,
      createdAt: '2025-07-09T11:00:00Z',
    },
    {
      id: 'NC002',
      carrierId: 'CARRIER003',
      carrierCompany: 'Express Freight',
      carrierRating: 4.5,
      vehicleId: 'VAN-205',
      vehicleType: 'van',
      currentLocation: 'Phoenix, AZ',
      availableDate: '2025-07-13T00:00:00Z',
      capacity: 12000,
      specializations: ['expedited', 'small_packages'],
      ratePerMile: 2.8,
      isAvailable: true,
      createdAt: '2025-07-09T13:45:00Z',
    },
  ],
  partners: [
    {
      id: 'PARTNER001',
      companyName: 'Reliable Routes Inc',
      contactPerson: 'Mike Johnson',
      email: 'mike@reliableroutes.com',
      phone: '(555) 123-4567',
      rating: 4.8,
      totalLoads: 245,
      onTimePercentage: 96.5,
      damageRate: 0.2,
      fleetSize: 25,
      serviceAreas: ['Texas', 'Oklahoma', 'Arkansas', 'Louisiana'],
      specializations: ['oil_field', 'heavy_haul', 'oversized'],
      verificationStatus: 'verified',
      joinedAt: '2024-03-15T00:00:00Z',
      lastActive: '2025-07-09T08:30:00Z',
    },
  ],
  transactions: [],
  metrics: {
    totalLoads: 1247,
    activeCarriers: 89,
    totalRevenue: 485000,
    averageRate: 2850,
    onTimePercentage: 96.5,
    networkUtilization: 78.3,
    revenueGrowth: 23.7,
    carrierSatisfaction: 4.6,
  },
};

// GET - Fetch network loads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'loads';

    logger.info(
      'Freight network fetch request',
      {
        type,
        action: 'fetch',
      },
      'FreightNetworkAPI'
    );

    switch (type) {
      case 'loads':
        return NextResponse.json({
          success: true,
          data: mockDatabase.loads,
          total: mockDatabase.loads.length,
        });

      case 'capacity':
        return NextResponse.json({
          success: true,
          data: mockDatabase.capacity,
          total: mockDatabase.capacity.length,
        });

      case 'partners':
        return NextResponse.json({
          success: true,
          data: mockDatabase.partners,
          total: mockDatabase.partners.length,
        });

      case 'metrics':
        return NextResponse.json({
          success: true,
          data: mockDatabase.metrics,
        });

      case 'analytics':
        const analyticsData = {
          totalRevenue: 485000,
          platformFees: 19400, // 4% of total revenue
          transactionCount: 1247,
          averageTransactionValue: 2850,
          revenueByDay: [
            { date: '2025-07-03', revenue: 15400 },
            { date: '2025-07-04', revenue: 18200 },
            { date: '2025-07-05', revenue: 16800 },
            { date: '2025-07-06', revenue: 19500 },
            { date: '2025-07-07', revenue: 17300 },
            { date: '2025-07-08', revenue: 21600 },
            { date: '2025-07-09', revenue: 14200 },
          ],
          topPerformingRoutes: [
            {
              route: 'Los Angeles, CA → Phoenix, AZ',
              revenue: 45600,
              count: 24,
            },
            { route: 'Chicago, IL → Detroit, MI', revenue: 38900, count: 18 },
            { route: 'Dallas, TX → Houston, TX', revenue: 32400, count: 21 },
          ],
        };
        return NextResponse.json({
          success: true,
          data: analyticsData,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Failed to fetch freight network data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new network items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    logger.info(
      'Freight network creation request',
      {
        type,
        action: 'create',
      },
      'FreightNetworkAPI'
    );

    switch (type) {
      case 'load':
        const newLoad = {
          id: `NL${String(mockDatabase.loads.length + 1).padStart(3, '0')}`,
          ...data,
          bids: [],
          networkStatus: 'available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockDatabase.loads.push(newLoad);

        return NextResponse.json({
          success: true,
          data: newLoad,
          message: 'Load posted to network successfully',
        });

      case 'capacity':
        const newCapacity = {
          id: `NC${String(mockDatabase.capacity.length + 1).padStart(3, '0')}`,
          ...data,
          isAvailable: true,
          createdAt: new Date().toISOString(),
        };
        mockDatabase.capacity.push(newCapacity);

        return NextResponse.json({
          success: true,
          data: newCapacity,
          message: 'Capacity shared to network successfully',
        });

      case 'bid':
        const { loadId, bid } = data;
        const load = mockDatabase.loads.find((l) => l.id === loadId);

        if (!load) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load not found',
            },
            { status: 404 }
          );
        }

        const newBid = {
          id: `BID${String(Date.now()).slice(-3)}`,
          ...bid,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };

        load.bids.push(newBid);
        load.networkStatus = 'bidding';
        load.updatedAt = new Date().toISOString();

        return NextResponse.json({
          success: true,
          data: newBid,
          message: 'Bid submitted successfully',
        });

      case 'partner_invite':
        const inviteId = `INV${Date.now()}`;

        // In real implementation, send email here
        logger.info(
          'Partner invitation sent',
          {
            email: data.email,
            action: 'invite',
          },
          'FreightNetworkAPI'
        );

        return NextResponse.json({
          success: true,
          data: { inviteId },
          message: 'Partner invitation sent successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Failed to create freight network item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT - Update network items
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    logger.info(
      'Freight network update request',
      {
        type,
        id,
        action: 'update',
      },
      'FreightNetworkAPI'
    );

    switch (type) {
      case 'load_status':
        const load = mockDatabase.loads.find((l) => l.id === id);
        if (!load) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load not found',
            },
            { status: 404 }
          );
        }

        load.networkStatus = data.status;
        load.updatedAt = new Date().toISOString();

        if (data.assignedCarrierId) {
          load.assignedCarrierId = data.assignedCarrierId;
        }

        return NextResponse.json({
          success: true,
          data: load,
          message: 'Load status updated successfully',
        });

      case 'bid_status':
        const { loadId, bidId, status } = data;
        const targetLoad = mockDatabase.loads.find((l) => l.id === loadId);

        if (!targetLoad) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load not found',
            },
            { status: 404 }
          );
        }

        const bid = targetLoad.bids.find((b) => b.id === bidId);
        if (!bid) {
          return NextResponse.json(
            {
              success: false,
              error: 'Bid not found',
            },
            { status: 404 }
          );
        }

        bid.status = status;

        if (status === 'accepted') {
          // Create transaction
          const transaction = {
            id: `TXN${Date.now()}`,
            loadId: targetLoad.id,
            shipperId: targetLoad.posterId,
            carrierId: bid.carrierId,
            originalRate: targetLoad.rate,
            finalRate: bid.bidAmount,
            platformFee: Math.round(bid.bidAmount * 0.04), // 4% commission
            platformFeePercentage: 4,
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
          };

          mockDatabase.transactions.push(transaction);
          targetLoad.networkStatus = 'assigned';
          targetLoad.assignedCarrierId = bid.carrierId;

          return NextResponse.json({
            success: true,
            data: { bid, transaction },
            message: 'Bid accepted and transaction created',
          });
        }

        return NextResponse.json({
          success: true,
          data: bid,
          message: 'Bid status updated successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Failed to update freight network item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
