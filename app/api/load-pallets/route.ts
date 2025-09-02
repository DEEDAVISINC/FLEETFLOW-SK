import { NextRequest, NextResponse } from 'next/server';

interface LoadPallets {
  loadId: string;
  palletIds: string[];
  expectedCount: number;
  scannedCount: number;
  lastUpdated: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

// In-memory storage for demo purposes - replace with database in production
let loadPalletAssignments: LoadPallets[] = [];

// Initialize with mock data
const initializeMockData = () => {
  if (loadPalletAssignments.length === 0) {
    loadPalletAssignments = [
      {
        loadId: 'MKT-001',
        palletIds: ['PLT-DAL-001', 'PLT-DAL-002', 'PLT-DAL-003'],
        expectedCount: 3,
        scannedCount: 2,
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: 'in_progress',
      },
      {
        loadId: 'MKT-002',
        palletIds: ['PLT-AUS-001', 'PLT-AUS-002'],
        expectedCount: 2,
        scannedCount: 0,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'pending',
      },
      {
        loadId: 'MKT-003',
        palletIds: ['PLT-FWT-001', 'PLT-FWT-002', 'PLT-FWT-003', 'PLT-FWT-004'],
        expectedCount: 4,
        scannedCount: 1,
        lastUpdated: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        status: 'in_progress',
      },
    ];
  }
};

initializeMockData();

// GET /api/load-pallets - Get load pallet assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');
    const status = searchParams.get('status');

    let filteredAssignments = [...loadPalletAssignments];

    if (loadId) {
      filteredAssignments = filteredAssignments.filter(
        (assignment) => assignment.loadId === loadId
      );
    }

    if (status) {
      filteredAssignments = filteredAssignments.filter(
        (assignment) => assignment.status === status
      );
    }

    // Sort by last updated (most recent first)
    filteredAssignments.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );

    return NextResponse.json({
      success: true,
      assignments: filteredAssignments,
      total: filteredAssignments.length,
      summary: {
        totalLoads: loadPalletAssignments.length,
        pendingLoads: loadPalletAssignments.filter(
          (a) => a.status === 'pending'
        ).length,
        inProgressLoads: loadPalletAssignments.filter(
          (a) => a.status === 'in_progress'
        ).length,
        completedLoads: loadPalletAssignments.filter(
          (a) => a.status === 'completed'
        ).length,
        totalExpectedPallets: loadPalletAssignments.reduce(
          (sum, a) => sum + a.expectedCount,
          0
        ),
        totalScannedPallets: loadPalletAssignments.reduce(
          (sum, a) => sum + a.scannedCount,
          0
        ),
      },
    });
  } catch (error) {
    console.error('Error fetching load pallet assignments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch load pallet assignments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/load-pallets - Create or update load pallet assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { loadId, palletIds } = body;

    if (!loadId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing load ID',
          message: 'Load ID is required',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(palletIds) || palletIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pallet IDs',
          message: 'Pallet IDs must be a non-empty array',
        },
        { status: 400 }
      );
    }

    // Validate pallet ID format
    const invalidPallets = palletIds.filter(
      (id) => !id || typeof id !== 'string' || !id.startsWith('PLT-')
    );
    if (invalidPallets.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pallet ID format',
          invalidPallets,
          message: 'All pallet IDs must start with "PLT-"',
        },
        { status: 400 }
      );
    }

    // Check if assignment already exists
    const existingIndex = loadPalletAssignments.findIndex(
      (assignment) => assignment.loadId === loadId
    );

    if (existingIndex >= 0) {
      // Update existing assignment
      loadPalletAssignments[existingIndex] = {
        ...loadPalletAssignments[existingIndex],
        palletIds,
        expectedCount: palletIds.length,
        lastUpdated: new Date(),
      };

      return NextResponse.json({
        success: true,
        assignment: loadPalletAssignments[existingIndex],
        message: `Updated pallet assignment for load ${loadId}`,
      });
    } else {
      // Create new assignment
      const newAssignment: LoadPallets = {
        loadId,
        palletIds,
        expectedCount: palletIds.length,
        scannedCount: 0,
        lastUpdated: new Date(),
        status: 'pending',
      };

      loadPalletAssignments.push(newAssignment);

      return NextResponse.json({
        success: true,
        assignment: newAssignment,
        message: `Created pallet assignment for load ${loadId}`,
      });
    }
  } catch (error) {
    console.error('Error creating/updating load pallet assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create/update load pallet assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/load-pallets/[loadId] - Update scanned count for a load
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { loadId, scannedCount, status } = body;

    if (!loadId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing load ID',
          message: 'Load ID is required',
        },
        { status: 400 }
      );
    }

    const assignmentIndex = loadPalletAssignments.findIndex(
      (assignment) => assignment.loadId === loadId
    );

    if (assignmentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Load not found',
          message: `No pallet assignment found for load: ${loadId}`,
        },
        { status: 404 }
      );
    }

    // Update the assignment
    const updatedAssignment = {
      ...loadPalletAssignments[assignmentIndex],
      scannedCount:
        scannedCount !== undefined
          ? scannedCount
          : loadPalletAssignments[assignmentIndex].scannedCount,
      status: status || loadPalletAssignments[assignmentIndex].status,
      lastUpdated: new Date(),
    };

    // Auto-update status based on completion
    if (scannedCount !== undefined && updatedAssignment.expectedCount > 0) {
      const completionRate = scannedCount / updatedAssignment.expectedCount;
      if (completionRate >= 1.0) {
        updatedAssignment.status = 'completed';
      } else if (completionRate > 0) {
        updatedAssignment.status = 'in_progress';
      }
    }

    loadPalletAssignments[assignmentIndex] = updatedAssignment;

    // Send completion notification if load is completed
    if (updatedAssignment.status === 'completed') {
      await sendCompletionNotification(updatedAssignment);
    }

    return NextResponse.json({
      success: true,
      assignment: updatedAssignment,
      message: `Updated pallet tracking for load ${loadId}`,
    });
  } catch (error) {
    console.error('Error updating load pallet assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update load pallet assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/load-pallets/[loadId] - Delete load pallet assignment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');

    if (!loadId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing load ID',
          message: 'Load ID is required for deletion',
        },
        { status: 400 }
      );
    }

    const assignmentIndex = loadPalletAssignments.findIndex(
      (assignment) => assignment.loadId === loadId
    );

    if (assignmentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Load not found',
          message: `No pallet assignment found for load: ${loadId}`,
        },
        { status: 404 }
      );
    }

    const deletedAssignment = loadPalletAssignments.splice(
      assignmentIndex,
      1
    )[0];

    return NextResponse.json({
      success: true,
      assignment: deletedAssignment,
      message: `Deleted pallet assignment for load ${loadId}`,
    });
  } catch (error) {
    console.error('Error deleting load pallet assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete load pallet assignment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions

async function sendCompletionNotification(assignment: LoadPallets) {
  // In production, this would send notifications to relevant parties
  console.log('Load completion notification:', {
    loadId: assignment.loadId,
    completionTime: new Date().toISOString(),
    scannedPallets: assignment.scannedCount,
    expectedPallets: assignment.expectedCount,
    type: 'load_pallet_tracking_complete',
  });

  // Mock notification
  console.log(
    `✅ LOAD COMPLETE: ${assignment.loadId} - ${assignment.scannedCount}/${assignment.expectedCount} pallets scanned`
  );
}

// GET /api/load-pallets/[loadId]/pallets - Get pallets for a specific load
export async function GET_PALLET_DETAILS(
  request: NextRequest,
  { params }: { params: { loadId: string } }
) {
  try {
    const loadId = params.loadId;

    const assignment = loadPalletAssignments.find((a) => a.loadId === loadId);

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Load not found',
          message: `No pallet assignment found for load: ${loadId}`,
        },
        { status: 404 }
      );
    }

    // Get scan data for each pallet (this would typically come from the pallet-scans API)
    const palletDetails = assignment.palletIds.map((palletId) => ({
      palletId,
      loadId: assignment.loadId,
      expected: true,
      scanned: false, // This would be determined by checking scan history
      lastScan: null, // This would be populated from scan data
      status: 'pending', // pending, scanned, verified, error
    }));

    return NextResponse.json({
      success: true,
      loadId: assignment.loadId,
      pallets: palletDetails,
      summary: {
        total: assignment.expectedCount,
        scanned: assignment.scannedCount,
        remaining: assignment.expectedCount - assignment.scannedCount,
        completionPercentage:
          assignment.expectedCount > 0
            ? Math.round(
                (assignment.scannedCount / assignment.expectedCount) * 100
              )
            : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching pallet details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pallet details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
