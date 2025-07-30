import { NextRequest, NextResponse } from 'next/server';
import BrokerSnapshotService from '../../../lib/brokersnapshot-service';

// Store credentials securely (in production, use environment variables)
const BROKER_SNAPSHOT_CREDENTIALS = {
  username: process.env.BROKERSNAPSHOT_USERNAME || '',
  password: process.env.BROKERSNAPSHOT_PASSWORD || ''
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, mcNumber, licenseNumber, state, mcNumbers, companyName } = body;

    if (!BROKER_SNAPSHOT_CREDENTIALS.username || !BROKER_SNAPSHOT_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'BrokerSnapshot credentials not configured' },
        { status: 500 }
      );
    }

    const service = new BrokerSnapshotService(BROKER_SNAPSHOT_CREDENTIALS);
    await service.initialize();

    let result;

    switch (action) {
      case 'searchCarrier':
        if (!mcNumber) {
          return NextResponse.json(
            { error: 'MC number is required' },
            { status: 400 }
          );
        }
        result = await service.searchCarrier(mcNumber);
        break;

      case 'searchDriver':
        if (!licenseNumber || !state) {
          return NextResponse.json(
            { error: 'License number and state are required' },
            { status: 400 }
          );
        }
        result = await service.searchDriver(licenseNumber, state);
        break;

      case 'searchShipper':
        if (!companyName) {
          return NextResponse.json(
            { error: 'Company name is required' },
            { status: 400 }
          );
        }
        result = await service.searchShipper(companyName, state);
        break;

      case 'monitorCarriers':
        if (!mcNumbers || !Array.isArray(mcNumbers)) {
          return NextResponse.json(
            { error: 'MC numbers array is required' },
            { status: 400 }
          );
        }
        result = await service.monitorCarriers(mcNumbers);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use searchCarrier, searchDriver, searchShipper, or monitorCarriers' },
          { status: 400 }
        );
    }

    await service.close();

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('BrokerSnapshot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const mcNumber = searchParams.get('mcNumber');

  if (action === 'searchCarrier' && mcNumber) {
    try {
      const service = new BrokerSnapshotService(BROKER_SNAPSHOT_CREDENTIALS);
      await service.initialize();
      
      const result = await service.searchCarrier(mcNumber);
      await service.close();

      return NextResponse.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('BrokerSnapshot API error:', error);
      return NextResponse.json(
        { error: 'Failed to search carrier' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Invalid parameters' },
    { status: 400 }
  );
}
