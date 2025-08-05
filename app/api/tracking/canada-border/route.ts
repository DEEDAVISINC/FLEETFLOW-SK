import { NextRequest, NextResponse } from 'next/server';

interface CanadaBorderCrossing {
  name: string;
  code: string;
  waitTime: number; // hours
  throughput: number; // shipments per day
  congestionLevel: 'low' | 'medium' | 'high' | 'critical';
  operatingHours: string;
  coordinates: [number, number];
  usPort: string;
  canadianPort: string;
  specialRequirements: string[];
}

interface PARSManifest {
  manifestId: string;
  shipmentId: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected';
  submissionDate: string;
  processingTime: number; // minutes
  customsBroker: string;
  businessNumber: string;
  customsValue: number;
  releaseType: 'RMD' | 'Examination' | 'AMPS';
  errors?: string[];
}

interface ACIManifest {
  manifestId: string;
  shipmentId: string;
  status: 'submitted' | 'accepted' | 'rejected';
  submissionDate: string;
  carrierCode: string;
  portOfEntry: string;
  estimatedArrival: string;
  fastCard: boolean;
  inspectionFlag: boolean;
}

// Mock data for major US-Canada border crossings
const MAJOR_BORDER_CROSSINGS: CanadaBorderCrossing[] = [
  {
    name: 'Ambassador Bridge/Windsor',
    code: 'AMB',
    waitTime: 1.2,
    throughput: 8500,
    congestionLevel: 'medium',
    operatingHours: '24/7',
    coordinates: [42.3117, -83.0754],
    usPort: 'Detroit, MI',
    canadianPort: 'Windsor, ON',
    specialRequirements: [
      'FAST Lane Available',
      'Commercial Vehicle Processing',
      'High Volume Crossing',
    ],
  },
  {
    name: 'Peace Bridge/Fort Erie',
    code: 'PEA',
    waitTime: 2.1,
    throughput: 4200,
    congestionLevel: 'high',
    operatingHours: '24/7',
    coordinates: [42.9069, -78.9056],
    usPort: 'Buffalo, NY',
    canadianPort: 'Fort Erie, ON',
    specialRequirements: [
      'Enhanced Security',
      'Agricultural Inspection',
      'NEXUS Available',
    ],
  },
  {
    name: 'Rainbow Bridge/Niagara Falls',
    code: 'RBW',
    waitTime: 1.7,
    throughput: 2800,
    congestionLevel: 'medium',
    operatingHours: '6:00 AM - 2:00 AM',
    coordinates: [43.0896, -79.0647],
    usPort: 'Niagara Falls, NY',
    canadianPort: 'Niagara Falls, ON',
    specialRequirements: [
      'Tourist Heavy',
      'Limited Commercial Hours',
      'Seasonal Delays',
    ],
  },
  {
    name: 'Thousand Islands Bridge',
    code: 'TIB',
    waitTime: 1.3,
    throughput: 1500,
    congestionLevel: 'low',
    operatingHours: '6:00 AM - 10:00 PM',
    coordinates: [44.3469, -75.9294],
    usPort: 'Alexandria Bay, NY',
    canadianPort: 'Lansdowne, ON',
    specialRequirements: [
      'Scenic Route',
      'Limited Hours',
      'Toll Bridge',
    ],
  },
  {
    name: 'Pacific Highway/Surrey',
    code: 'PAC',
    waitTime: 2.8,
    throughput: 3200,
    congestionLevel: 'high',
    operatingHours: '24/7',
    coordinates: [49.0021, -122.7939],
    usPort: 'Blaine, WA',
    canadianPort: 'Surrey, BC',
    specialRequirements: [
      'West Coast Gateway',
      'Agricultural Inspection',
      'High Volume Delays',
    ],
  },
];

// Generate mock PARS manifest data
function generatePARSManifests(count: number = 50): PARSManifest[] {
  const manifests: PARSManifest[] = [];
  const brokers = [
    'Pacific Customs Brokers',
    'Livingston International',
    'Customs House Brokerage',
    'Cole International',
  ];
  const releaseTypes = ['RMD', 'Examination', 'AMPS'] as const;
  const statuses = ['submitted', 'processing', 'approved', 'rejected'] as const;

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const manifest: PARSManifest = {
      manifestId: `PARS-${Date.now()}-${i.toString().padStart(3, '0')}`,
      shipmentId: `CA-${(25000 + i).toString()}`,
      status,
      submissionDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processingTime: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
      customsBroker: brokers[Math.floor(Math.random() * brokers.length)],
      businessNumber: `${(123456789 + i).toString()}RT0001`,
      customsValue: Math.floor(Math.random() * 300000) + 5000,
      releaseType: releaseTypes[Math.floor(Math.random() * releaseTypes.length)],
    };

    if (status === 'rejected') {
      manifest.errors = [
        'Invalid business number format',
        'Missing customs documentation',
        'Incorrect commodity classification',
      ].slice(0, Math.floor(Math.random() * 3) + 1);
    }

    manifests.push(manifest);
  }

  return manifests;
}

// Generate mock ACI manifest data
function generateACIManifests(count: number = 50): ACIManifest[] {
  const manifests: ACIManifest[] = [];
  const carrierCodes = ['ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRST'];
  const ports = ['0001', '0004', '0007', '0009', '0014']; // Port codes
  const statuses = ['submitted', 'accepted', 'rejected'] as const;

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const carrierCode = carrierCodes[Math.floor(Math.random() * carrierCodes.length)];
    const manifest: ACIManifest = {
      manifestId: `ACI-${Date.now()}-${i.toString().padStart(3, '0')}`,
      shipmentId: `CA-${(25000 + i).toString()}`,
      status,
      submissionDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      carrierCode: carrierCode,
      portOfEntry: ports[Math.floor(Math.random() * ports.length)],
      estimatedArrival: new Date(
        Date.now() + Math.random() * 48 * 60 * 60 * 1000
      ).toISOString(),
      fastCard: Math.random() > 0.6, // 40% have FAST cards
      inspectionFlag: Math.random() > 0.92, // 8% flagged for inspection
    };

    manifests.push(manifest);
  }

  return manifests;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const crossing = searchParams.get('crossing');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (type) {
      case 'crossings':
        let crossings = MAJOR_BORDER_CROSSINGS;
        if (crossing) {
          crossings = crossings.filter(
            (c) => c.code === crossing.toUpperCase()
          );
        }
        return NextResponse.json({
          success: true,
          data: {
            crossings,
            totalCrossings: MAJOR_BORDER_CROSSINGS.length,
            averageWaitTime:
              crossings.reduce((sum, c) => sum + c.waitTime, 0) /
              crossings.length,
            totalThroughput: crossings.reduce(
              (sum, c) => sum + c.throughput,
              0
            ),
            lastUpdated: new Date().toISOString(),
          },
        });

      case 'pars-manifests':
        const parsManifests = generatePARSManifests(limit);
        return NextResponse.json({
          success: true,
          data: {
            manifests: parsManifests,
            summary: {
              total: parsManifests.length,
              approved: parsManifests.filter((m) => m.status === 'approved')
                .length,
              processing: parsManifests.filter((m) => m.status === 'processing')
                .length,
              rejected: parsManifests.filter((m) => m.status === 'rejected')
                .length,
              averageProcessingTime:
                parsManifests.reduce((sum, m) => sum + m.processingTime, 0) /
                parsManifests.length,
            },
          },
        });

      case 'aci-manifests':
        const aciManifests = generateACIManifests(limit);
        return NextResponse.json({
          success: true,
          data: {
            manifests: aciManifests,
            summary: {
              total: aciManifests.length,
              accepted: aciManifests.filter((m) => m.status === 'accepted')
                .length,
              pending: aciManifests.filter((m) => m.status === 'submitted')
                .length,
              rejected: aciManifests.filter((m) => m.status === 'rejected')
                .length,
              fastCardHolders: aciManifests.filter((m) => m.fastCard).length,
              inspectionFlagged: aciManifests.filter((m) => m.inspectionFlag)
                .length,
            },
          },
        });

      case 'compliance':
        return NextResponse.json({
          success: true,
          data: {
            aciCompliance: {
              rate: 96.8,
              totalSubmissions: 1456,
              successful: 1409,
              errors: 47,
              commonErrors: [
                'Missing carrier code',
                'Invalid port of entry',
                'Late submission (< 1 hour)',
                'Incorrect shipment details',
              ],
            },
            parsCompliance: {
              rate: 94.3,
              totalSubmissions: 1278,
              successful: 1205,
              errors: 73,
              commonErrors: [
                'Invalid business number',
                'Missing customs broker info',
                'Incorrect commodity classification',
                'Missing release documentation',
              ],
            },
            crossBorderTrends: {
              weeklyVolume: [1400, 1520, 1380, 1610, 1590, 1450, 1480],
              delayReasons: {
                'Documentation Issues': 28,
                'Random Inspection': 22,
                'Agricultural Inspection': 18,
                'System Maintenance': 12,
                'Weather Delays': 20,
              },
            },
          },
        });

      case 'alerts':
        return NextResponse.json({
          success: true,
          data: {
            activeAlerts: [
              {
                id: 'CA-ALERT-001',
                type: 'system',
                severity: 'medium',
                title: 'ACI eManifest System Maintenance',
                message:
                  'Scheduled maintenance for ACI eManifest system this weekend from 2:00 AM - 6:00 AM EST',
                timestamp: new Date(
                  Date.now() - 1 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['ALL'],
              },
              {
                id: 'CA-ALERT-002',
                type: 'operational',
                severity: 'high',
                title: 'Peace Bridge Enhanced Inspections',
                message:
                  'Enhanced inspection protocols implemented due to security alert - expect additional delays',
                timestamp: new Date(
                  Date.now() - 3 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['PEA'],
              },
              {
                id: 'CA-ALERT-003',
                type: 'system',
                severity: 'medium',
                title: 'FAST Lane System Upgrades',
                message:
                  'FAST lane processing delays at Ambassador Bridge due to system upgrades',
                timestamp: new Date(
                  Date.now() - 2 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['AMB'],
              },
              {
                id: 'CA-ALERT-004',
                type: 'regulatory',
                severity: 'low',
                title: 'New CBSA Documentation Requirements',
                message:
                  'Updated CBSA documentation requirements effective February 2025',
                timestamp: new Date(
                  Date.now() - 8 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['ALL'],
              },
              {
                id: 'CA-ALERT-005',
                type: 'weather',
                severity: 'medium',
                title: 'Weather Advisory - Pacific Highway',
                message:
                  'Snow and ice conditions expected at Pacific Highway crossing - reduced speeds and delays anticipated',
                timestamp: new Date(
                  Date.now() - 30 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['PAC'],
              },
            ],
            alertStats: {
              total: 5,
              critical: 0,
              high: 1,
              medium: 3,
              low: 1,
            },
          },
        });

      default: // overview
        return NextResponse.json({
          success: true,
          data: {
            summary: {
              totalCrossBorderShipments: 1456,
              pendingClearance: 67,
              averageCrossingTime: 1.8,
              delayedShipments: 18,
              dailyThroughput: 20200,
            },
            crossings: MAJOR_BORDER_CROSSINGS,
            compliance: {
              aciCompliance: 96.8,
              parsCompliance: 94.3,
              documentationErrors: 89,
              inspectionRate: 8.2,
            },
            recentActivity: {
              manifestsSubmitted: 189,
              shipmentsCleared: 167,
              inspectionsCompleted: 14,
              averageWaitTime: 1.8,
            },
            topCommodities: [
              { name: 'Automotive Parts', volume: 412, value: 28900000 },
              { name: 'Lumber & Wood Products', volume: 298, value: 15600000 },
              { name: 'Agricultural Products', volume: 234, value: 12400000 },
              { name: 'Machinery', volume: 189, value: 31200000 },
              { name: 'Energy Products', volume: 156, value: 45600000 },
            ],
            lastUpdated: new Date().toISOString(),
          },
        });
    }
  } catch (error) {
    console.error('Canada border API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Canada border crossing data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, manifestData } = body;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    switch (action) {
      case 'submit-aci':
        return NextResponse.json({
          success: true,
          data: {
            manifestId: `ACI-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            status: 'submitted',
            estimatedProcessingTime: '30-45 minutes',
            fastCardRequired: manifestData.portOfEntry === '0001', // Ambassador Bridge
            submissionTime: new Date().toISOString(),
          },
        });

      case 'submit-pars':
        return NextResponse.json({
          success: true,
          data: {
            manifestId: `PARS-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            status: 'processing',
            estimatedProcessingTime: '15-30 minutes',
            customsBrokerRequired: true,
            submissionTime: new Date().toISOString(),
          },
        });

      case 'check-status':
        const { manifestId } = manifestData;
        const isACI = manifestId.startsWith('ACI-');
        const statuses = isACI
          ? ['submitted', 'accepted', 'rejected']
          : ['submitted', 'processing', 'approved', 'rejected'];

        return NextResponse.json({
          success: true,
          data: {
            manifestId,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastUpdated: new Date().toISOString(),
            processingTime: Math.floor(Math.random() * 90) + 15, // 15-105 minutes
            notes: isACI
              ? 'ACI eManifest processed by CBSA'
              : 'PARS processed by customs broker',
          },
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Canada border POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process Canada border request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}