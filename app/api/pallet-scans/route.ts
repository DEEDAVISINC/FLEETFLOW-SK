import { NextRequest, NextResponse } from 'next/server';

interface PalletScan {
  id: string;
  palletId: string;
  loadId: string;
  location: string;
  timestamp: Date;
  scanType:
    | 'crossdock_inbound'
    | 'crossdock_outbound'
    | 'delivery_inbound'
    | 'delivery_outbound';
  driverId: string;
  status: 'scanned' | 'verified' | 'error';
  notes?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

// In-memory storage for demo purposes - replace with database in production
let palletScans: PalletScan[] = [];
let loadPallets: { [loadId: string]: string[] } = {};

// Mock data for demonstration
const initializeMockData = () => {
  if (palletScans.length === 0) {
    palletScans = [
      {
        id: 'scan-001',
        palletId: 'PLT-DAL-001',
        loadId: 'MKT-001',
        location: 'crossdock',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        scanType: 'crossdock_inbound',
        driverId: 'DRV-12345',
        status: 'verified',
        notes: 'Scanned at Dallas crossdock',
        latitude: 32.7767,
        longitude: -96.797,
        accuracy: 5.2,
      },
      {
        id: 'scan-002',
        palletId: 'PLT-DAL-002',
        loadId: 'MKT-001',
        location: 'crossdock',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        scanType: 'crossdock_inbound',
        driverId: 'DRV-12345',
        status: 'verified',
        notes: 'Scanned at Dallas crossdock',
        latitude: 32.7767,
        longitude: -96.797,
        accuracy: 4.8,
      },
      {
        id: 'scan-003',
        palletId: 'PLT-DAL-001',
        loadId: 'MKT-001',
        location: 'delivery',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        scanType: 'delivery_outbound',
        driverId: 'DRV-12345',
        status: 'scanned',
        notes: 'Delivered to Houston warehouse',
        latitude: 29.7604,
        longitude: -95.3698,
        accuracy: 3.1,
      },
    ];

    loadPallets = {
      'MKT-001': ['PLT-DAL-001', 'PLT-DAL-002', 'PLT-DAL-003'],
      'MKT-002': ['PLT-AUS-001', 'PLT-AUS-002'],
      'MKT-003': ['PLT-FWT-001', 'PLT-FWT-002', 'PLT-FWT-003', 'PLT-FWT-004'],
    };
  }
};

// Initialize mock data
initializeMockData();

// GET /api/pallet-scans - Get pallet scans with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');
    const driverId = searchParams.get('driverId');
    const palletId = searchParams.get('palletId');
    const location = searchParams.get('location');
    const scanType = searchParams.get('scanType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredScans = [...palletScans];

    // Apply filters
    if (loadId) {
      filteredScans = filteredScans.filter((scan) => scan.loadId === loadId);
    }
    if (driverId) {
      filteredScans = filteredScans.filter(
        (scan) => scan.driverId === driverId
      );
    }
    if (palletId) {
      filteredScans = filteredScans.filter(
        (scan) => scan.palletId === palletId
      );
    }
    if (location) {
      filteredScans = filteredScans.filter(
        (scan) => scan.location === location
      );
    }
    if (scanType) {
      filteredScans = filteredScans.filter(
        (scan) => scan.scanType === scanType
      );
    }
    if (status) {
      filteredScans = filteredScans.filter((scan) => scan.status === status);
    }

    // Sort by timestamp (most recent first)
    filteredScans.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    const limitedScans = filteredScans.slice(0, limit);

    // Get pallet tracking summary
    const trackingSummary = loadId ? getLoadTrackingSummary(loadId) : null;

    return NextResponse.json({
      success: true,
      scans: limitedScans,
      total: filteredScans.length,
      summary: trackingSummary,
      message: `Found ${limitedScans.length} pallet scan${limitedScans.length !== 1 ? 's' : ''}`,
    });
  } catch (error) {
    console.error('Error fetching pallet scans:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pallet scans',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/pallet-scans - Create a new pallet scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'palletId',
      'loadId',
      'location',
      'scanType',
      'driverId',
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields,
          message: `Required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate scan type
    const validScanTypes = [
      'crossdock_inbound',
      'crossdock_outbound',
      'delivery_inbound',
      'delivery_outbound',
    ];
    if (!validScanTypes.includes(body.scanType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid scan type',
          validTypes: validScanTypes,
          message: `Scan type must be one of: ${validScanTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate location
    const validLocations = ['crossdock', 'delivery'];
    if (!validLocations.includes(body.location)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid location',
          validLocations,
          message: `Location must be one of: ${validLocations.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Check for duplicate recent scans (prevent accidental duplicates)
    const recentScans = palletScans.filter(
      (scan) =>
        scan.palletId === body.palletId &&
        scan.loadId === body.loadId &&
        scan.scanType === body.scanType &&
        new Date(scan.timestamp).getTime() > Date.now() - 5 * 60 * 1000 // Within last 5 minutes
    );

    if (recentScans.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate scan detected',
          message:
            'This pallet has already been scanned recently for this load and scan type',
          lastScan: recentScans[0],
        },
        { status: 409 }
      );
    }

    // Create new scan
    const newScan: PalletScan = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      palletId: body.palletId,
      loadId: body.loadId,
      location: body.location,
      timestamp: new Date(),
      scanType: body.scanType,
      driverId: body.driverId,
      status: body.status || 'scanned',
      notes: body.notes,
      latitude: body.latitude,
      longitude: body.longitude,
      accuracy: body.accuracy,
    };

    // Add to storage
    palletScans.push(newScan);

    // Validate scan against expected pallets for the load
    const validation = validateScan(newScan);

    // Update scan status based on validation
    if (validation.isValid) {
      newScan.status = 'verified';
    } else {
      newScan.status = 'error';
      newScan.notes = validation.message;
    }

    // Send notifications if needed
    if (newScan.status === 'error') {
      await sendValidationNotification(newScan, validation);
    }

    // Send real-time updates to dispatch
    await notifyDispatchOfScan(newScan);

    return NextResponse.json({
      success: true,
      scan: newScan,
      validation,
      message: validation.isValid
        ? 'Pallet scan recorded and verified successfully'
        : 'Pallet scan recorded with validation warning',
    });
  } catch (error) {
    console.error('Error creating pallet scan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create pallet scan',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/pallet-scans/[id] - Update a pallet scan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing scan ID',
          message: 'Scan ID is required for updates',
        },
        { status: 400 }
      );
    }

    const scanIndex = palletScans.findIndex((scan) => scan.id === id);

    if (scanIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Scan not found',
          message: `No scan found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Update scan
    palletScans[scanIndex] = {
      ...palletScans[scanIndex],
      ...updates,
      id, // Ensure ID doesn't change
      timestamp: updates.timestamp
        ? new Date(updates.timestamp)
        : palletScans[scanIndex].timestamp,
    };

    return NextResponse.json({
      success: true,
      scan: palletScans[scanIndex],
      message: 'Pallet scan updated successfully',
    });
  } catch (error) {
    console.error('Error updating pallet scan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update pallet scan',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pallet-scans/[id] - Delete a pallet scan (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing scan ID',
          message: 'Scan ID is required for deletion',
        },
        { status: 400 }
      );
    }

    const scanIndex = palletScans.findIndex((scan) => scan.id === id);

    if (scanIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Scan not found',
          message: `No scan found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    const deletedScan = palletScans.splice(scanIndex, 1)[0];

    return NextResponse.json({
      success: true,
      scan: deletedScan,
      message: 'Pallet scan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pallet scan:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete pallet scan',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions

function getLoadTrackingSummary(loadId: string) {
  const loadScans = palletScans.filter((scan) => scan.loadId === loadId);
  const expectedPallets = loadPallets[loadId] || [];

  const crossdockInbound = loadScans.filter(
    (scan) => scan.scanType === 'crossdock_inbound'
  );
  const crossdockOutbound = loadScans.filter(
    (scan) => scan.scanType === 'crossdock_outbound'
  );
  const deliveryInbound = loadScans.filter(
    (scan) => scan.scanType === 'delivery_inbound'
  );
  const deliveryOutbound = loadScans.filter(
    (scan) => scan.scanType === 'delivery_outbound'
  );

  const scannedPallets = new Set(loadScans.map((scan) => scan.palletId));
  const unscannedPallets = expectedPallets.filter(
    (pallet) => !scannedPallets.has(pallet)
  );

  return {
    totalExpectedPallets: expectedPallets.length,
    totalScans: loadScans.length,
    uniquePalletsScanned: scannedPallets.size,
    unscannedPallets,
    crossdockInboundCount: crossdockInbound.length,
    crossdockOutboundCount: crossdockOutbound.length,
    deliveryInboundCount: deliveryInbound.length,
    deliveryOutboundCount: deliveryOutbound.length,
    completionPercentage:
      expectedPallets.length > 0
        ? Math.round((scannedPallets.size / expectedPallets.length) * 100)
        : 0,
    lastScan: loadScans.length > 0 ? loadScans[0] : null,
  };
}

function validateScan(scan: PalletScan) {
  const expectedPallets = loadPallets[scan.loadId] || [];

  // Check if pallet belongs to this load
  if (!expectedPallets.includes(scan.palletId)) {
    return {
      isValid: false,
      message: `Pallet ${scan.palletId} is not expected for load ${scan.loadId}`,
      severity: 'error',
    };
  }

  // Check for duplicate scans of the same type
  const duplicateScans = palletScans.filter(
    (s) =>
      s.palletId === scan.palletId &&
      s.loadId === scan.loadId &&
      s.scanType === scan.scanType &&
      s.id !== scan.id
  );

  if (duplicateScans.length > 0) {
    return {
      isValid: false,
      message: `Pallet ${scan.palletId} has already been scanned for ${scan.scanType.replace('_', ' ')}`,
      severity: 'warning',
    };
  }

  // Check scan sequence (crossdock before delivery)
  if (scan.scanType.startsWith('delivery_')) {
    const crossdockScans = palletScans.filter(
      (s) =>
        s.palletId === scan.palletId &&
        s.loadId === scan.loadId &&
        s.scanType.startsWith('crossdock_')
    );

    if (crossdockScans.length === 0) {
      return {
        isValid: false,
        message: `Pallet ${scan.palletId} must be scanned at crossdock before delivery`,
        severity: 'error',
      };
    }
  }

  return {
    isValid: true,
    message: 'Scan validated successfully',
    severity: 'info',
  };
}

async function sendValidationNotification(scan: PalletScan, validation: any) {
  // In production, this would send notifications to dispatch, driver, etc.
  console.log('Validation notification:', {
    scan,
    validation,
    timestamp: new Date().toISOString(),
  });

  // Mock notification sending
  if (validation.severity === 'error') {
    // Send urgent notification to dispatch
    console.log(`🚨 URGENT: Scan validation error for pallet ${scan.palletId}`);
  }
}

async function notifyDispatchOfScan(scan: PalletScan) {
  // In production, this would send real-time updates to dispatch dashboard
  console.log('Dispatch notification:', {
    scan,
    timestamp: new Date().toISOString(),
    type: 'pallet_scan_update',
  });

  // Mock real-time update
  console.log(
    `📡 Real-time update: Pallet ${scan.palletId} scanned at ${scan.location}`
  );
}
