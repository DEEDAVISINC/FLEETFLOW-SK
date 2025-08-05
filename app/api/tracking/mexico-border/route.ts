import { NextRequest, NextResponse } from 'next/server';

interface MexicoBorderCrossing {
  name: string;
  code: string;
  waitTime: number; // hours
  throughput: number; // shipments per day
  congestionLevel: 'low' | 'medium' | 'high' | 'critical';
  operatingHours: string;
  coordinates: [number, number];
  cbpPort: string;
  mexicanPort: string;
  specialRequirements: string[];
}

interface SAAIManifest {
  manifestId: string;
  shipmentId: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected';
  submissionDate: string;
  processingTime: number; // minutes
  customsBroker: string;
  rfcNumber: string;
  customsValue: number;
  regime: 'definitive' | 'temporary' | 'maquiladora';
  errors?: string[];
}

interface ACEManifest {
  manifestId: string;
  shipmentId: string;
  status: 'submitted' | 'accepted' | 'rejected';
  submissionDate: string;
  papsNumber: string;
  scacCode: string;
  portOfEntry: string;
  estimatedArrival: string;
  qrCodeRequired: boolean;
  inspectionFlag: boolean;
}

// Mock data for major US-Mexico border crossings
const MAJOR_BORDER_CROSSINGS: MexicoBorderCrossing[] = [
  {
    name: 'Laredo/Nuevo Laredo',
    code: 'LRD',
    waitTime: 1.8,
    throughput: 4500,
    congestionLevel: 'medium',
    operatingHours: '24/7',
    coordinates: [27.5306, -99.4803],
    cbpPort: 'Laredo, TX',
    mexicanPort: 'Nuevo Laredo, Tamaulipas',
    specialRequirements: [
      'QR Code Mandatory',
      'C-TPAT Preferred',
      'FAST Lane Available',
    ],
  },
  {
    name: 'El Paso/Ciudad Juárez',
    code: 'ELP',
    waitTime: 2.1,
    throughput: 2800,
    congestionLevel: 'high',
    operatingHours: '6:00 AM - 10:00 PM',
    coordinates: [31.7619, -106.485],
    cbpPort: 'El Paso, TX',
    mexicanPort: 'Ciudad Juárez, Chihuahua',
    specialRequirements: [
      'Enhanced Security',
      'Drug Screening',
      'X-Ray Required',
    ],
  },
  {
    name: 'Otay Mesa/Tijuana',
    code: 'OTM',
    waitTime: 3.2,
    throughput: 1900,
    congestionLevel: 'critical',
    operatingHours: '6:00 AM - 2:00 AM',
    coordinates: [32.555, -117.031],
    cbpPort: 'Otay Mesa, CA',
    mexicanPort: 'Tijuana, Baja California',
    specialRequirements: [
      'Produce Inspection',
      'Phytosanitary Cert',
      'High Volume Delays',
    ],
  },
  {
    name: 'Brownsville/Matamoros',
    code: 'BRO',
    waitTime: 1.5,
    throughput: 1200,
    congestionLevel: 'low',
    operatingHours: '24/7',
    coordinates: [25.8968, -97.4974],
    cbpPort: 'Brownsville, TX',
    mexicanPort: 'Matamoros, Tamaulipas',
    specialRequirements: [
      'Standard Processing',
      'Energy Cargo Hub',
      'IMMEX Friendly',
    ],
  },
  {
    name: 'Nogales/Nogales',
    code: 'NOG',
    waitTime: 2.7,
    throughput: 950,
    congestionLevel: 'medium',
    operatingHours: '6:00 AM - 8:00 PM',
    coordinates: [31.3404, -110.9342],
    cbpPort: 'Nogales, AZ',
    mexicanPort: 'Nogales, Sonora',
    specialRequirements: [
      'Produce Inspection',
      'Seasonal Delays',
      'Limited Hours',
    ],
  },
];

// Generate mock SAAI-M manifest data
function generateSAAIManifests(count: number = 50): SAAIManifest[] {
  const manifests: SAAIManifest[] = [];
  const brokers = [
    'Agencia Aduanal López',
    'Customs Broker Hernández',
    'SAT Solutions',
    'Mexico Trade Partners',
  ];
  const regimes = ['definitive', 'temporary', 'maquiladora'] as const;
  const statuses = ['submitted', 'processing', 'approved', 'rejected'] as const;

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const manifest: SAAIManifest = {
      manifestId: `SAAI-${Date.now()}-${i.toString().padStart(3, '0')}`,
      shipmentId: `MX-${(25000 + i).toString()}`,
      status,
      submissionDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      processingTime: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
      customsBroker: brokers[Math.floor(Math.random() * brokers.length)],
      rfcNumber: `ABC${(123456789 + i).toString()}`,
      customsValue: Math.floor(Math.random() * 500000) + 10000,
      regime: regimes[Math.floor(Math.random() * regimes.length)],
    };

    if (status === 'rejected') {
      manifest.errors = [
        'Invalid RFC number format',
        'Missing phytosanitary certificate',
        'Incorrect customs classification',
      ].slice(0, Math.floor(Math.random() * 3) + 1);
    }

    manifests.push(manifest);
  }

  return manifests;
}

// Generate mock ACE manifest data
function generateACEManifests(count: number = 50): ACEManifest[] {
  const manifests: ACEManifest[] = [];
  const scacCodes = ['ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRST'];
  const ports = ['2704', '2403', '2506', '2303', '2602']; // Port codes
  const statuses = ['submitted', 'accepted', 'rejected'] as const;

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const scac = scacCodes[Math.floor(Math.random() * scacCodes.length)];
    const manifest: ACEManifest = {
      manifestId: `ACE-${Date.now()}-${i.toString().padStart(3, '0')}`,
      shipmentId: `US-${(25000 + i).toString()}`,
      status,
      submissionDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      papsNumber: `${scac}${(100000 + i).toString()}`,
      scacCode: scac,
      portOfEntry: ports[Math.floor(Math.random() * ports.length)],
      estimatedArrival: new Date(
        Date.now() + Math.random() * 48 * 60 * 60 * 1000
      ).toISOString(),
      qrCodeRequired: Math.random() > 0.3, // 70% require QR codes
      inspectionFlag: Math.random() > 0.85, // 15% flagged for inspection
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

      case 'saai-manifests':
        const saaiManifests = generateSAAIManifests(limit);
        return NextResponse.json({
          success: true,
          data: {
            manifests: saaiManifests,
            summary: {
              total: saaiManifests.length,
              approved: saaiManifests.filter((m) => m.status === 'approved')
                .length,
              processing: saaiManifests.filter((m) => m.status === 'processing')
                .length,
              rejected: saaiManifests.filter((m) => m.status === 'rejected')
                .length,
              averageProcessingTime:
                saaiManifests.reduce((sum, m) => sum + m.processingTime, 0) /
                saaiManifests.length,
            },
          },
        });

      case 'ace-manifests':
        const aceManifests = generateACEManifests(limit);
        return NextResponse.json({
          success: true,
          data: {
            manifests: aceManifests,
            summary: {
              total: aceManifests.length,
              accepted: aceManifests.filter((m) => m.status === 'accepted')
                .length,
              pending: aceManifests.filter((m) => m.status === 'submitted')
                .length,
              rejected: aceManifests.filter((m) => m.status === 'rejected')
                .length,
              qrCodeRequired: aceManifests.filter((m) => m.qrCodeRequired)
                .length,
              inspectionFlagged: aceManifests.filter((m) => m.inspectionFlag)
                .length,
            },
          },
        });

      case 'compliance':
        return NextResponse.json({
          success: true,
          data: {
            aceCompliance: {
              rate: 94.2,
              totalSubmissions: 1247,
              successful: 1175,
              errors: 72,
              commonErrors: [
                'Missing QR code at Laredo',
                'Invalid SCAC code format',
                'Late submission (< 1 hour)',
                'Incorrect port of entry',
              ],
            },
            saaiCompliance: {
              rate: 87.6,
              totalSubmissions: 1089,
              successful: 954,
              errors: 135,
              commonErrors: [
                'Invalid RFC number',
                'Missing customs broker signature',
                'Incorrect commodity classification',
                'Missing IMMEX documentation',
              ],
            },
            crossBorderTrends: {
              weeklyVolume: [1200, 1350, 1180, 1420, 1380, 1290, 1340],
              delayReasons: {
                'Documentation Issues': 35,
                'Random Inspection': 28,
                'System Maintenance': 15,
                'Weather Delays': 12,
                'Security Screening': 10,
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
                id: 'MX-ALERT-001',
                type: 'system',
                severity: 'high',
                title: 'QR Code Requirements at Laredo',
                message:
                  'QR Code ACE Manifest lead sheets are now mandatory at Port of Laredo effective August 2024',
                timestamp: new Date(
                  Date.now() - 2 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['LRD'],
              },
              {
                id: 'MX-ALERT-002',
                type: 'operational',
                severity: 'critical',
                title: 'Otay Mesa Delays',
                message:
                  'Experiencing 4+ hour delays due to system maintenance and increased cargo volume',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                affectedCrossings: ['OTM'],
              },
              {
                id: 'MX-ALERT-003',
                type: 'regulatory',
                severity: 'medium',
                title: 'New IMMEX Requirements',
                message:
                  'Updated IMMEX documentation requirements effective January 2025',
                timestamp: new Date(
                  Date.now() - 6 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['ALL'],
              },
              {
                id: 'MX-ALERT-004',
                type: 'security',
                severity: 'high',
                title: 'Enhanced Screening at El Paso',
                message:
                  'Enhanced security screening implemented for high-risk cargo categories',
                timestamp: new Date(
                  Date.now() - 4 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['ELP'],
              },
              {
                id: 'MX-ALERT-005',
                type: 'weather',
                severity: 'low',
                title: 'Weather Advisory - Nogales',
                message:
                  'Potential weather delays expected this weekend due to winter storm system',
                timestamp: new Date(
                  Date.now() - 1 * 60 * 60 * 1000
                ).toISOString(),
                affectedCrossings: ['NOG'],
              },
            ],
            alertStats: {
              total: 5,
              critical: 1,
              high: 2,
              medium: 1,
              low: 1,
            },
          },
        });

      default: // overview
        return NextResponse.json({
          success: true,
          data: {
            summary: {
              totalCrossBorderShipments: 1247,
              pendingClearance: 89,
              averageCrossingTime: 2.3,
              delayedShipments: 23,
              dailyThroughput: 11350,
            },
            crossings: MAJOR_BORDER_CROSSINGS,
            compliance: {
              aceCompliance: 94.2,
              saaiCompliance: 87.6,
              documentationErrors: 156,
              inspectionRate: 12.8,
            },
            recentActivity: {
              manifestsSubmitted: 156,
              shipmentsCleared: 134,
              inspectionsCompleted: 18,
              averageWaitTime: 2.1,
            },
            topCommodities: [
              { name: 'Automotive Parts', volume: 285, value: 15600000 },
              { name: 'Electronics', volume: 198, value: 12300000 },
              { name: 'Textiles', volume: 167, value: 8900000 },
              { name: 'Food Products', volume: 143, value: 6700000 },
              { name: 'Machinery', volume: 121, value: 18500000 },
            ],
            lastUpdated: new Date().toISOString(),
          },
        });
    }
  } catch (error) {
    console.error('Mexico border API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Mexico border crossing data',
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
      case 'submit-ace':
        return NextResponse.json({
          success: true,
          data: {
            manifestId: `ACE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'submitted',
            estimatedProcessingTime: '15-30 minutes',
            qrCodeRequired: manifestData.portOfEntry === '2704', // Laredo
            submissionTime: new Date().toISOString(),
          },
        });

      case 'submit-saai':
        return NextResponse.json({
          success: true,
          data: {
            manifestId: `SAAI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'processing',
            estimatedProcessingTime: '30-60 minutes',
            customsBrokerRequired: true,
            submissionTime: new Date().toISOString(),
          },
        });

      case 'generate-qr':
        return NextResponse.json({
          success: true,
          data: {
            qrCodes: [
              {
                type: 'ACE Manifest',
                code: `ACE-${manifestData.shipmentId}-${Date.now()}`,
                barcodeData: `*ACE${manifestData.shipmentId}${Date.now()}*`,
                downloadUrl: '/api/documents/qr-code-ace.pdf',
                validUntil: new Date(
                  Date.now() + 24 * 60 * 60 * 1000
                ).toISOString(), // 24 hours
                instructions: 'Print and attach to lead vehicle windshield',
              },
              {
                type: 'PAPS Number',
                code: `PAPS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                barcodeData: `*PAPS${Math.random().toString(36).substr(2, 8).toUpperCase()}*`,
                downloadUrl: '/api/documents/qr-code-paps.pdf',
                validUntil: new Date(
                  Date.now() + 72 * 60 * 60 * 1000
                ).toISOString(), // 72 hours
                instructions:
                  'Required for Laredo crossing - mandatory QR code',
              },
            ],
            generatedAt: new Date().toISOString(),
            crossingRequirements: {
              laredo: 'QR code mandatory for all commercial vehicles',
              elPaso: 'QR code recommended for faster processing',
              otayMesa: 'Standard ACE manifest sufficient',
              calexico: 'FAST lane available with QR code',
              nogales: 'Enhanced inspection protocols - QR code recommended',
            },
          },
        });

      case 'check-status':
        const { manifestId } = manifestData;
        const isACE = manifestId.startsWith('ACE-');
        const statuses = isACE
          ? ['submitted', 'accepted', 'rejected']
          : ['submitted', 'processing', 'approved', 'rejected'];

        return NextResponse.json({
          success: true,
          data: {
            manifestId,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastUpdated: new Date().toISOString(),
            processingTime: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
            notes: isACE
              ? 'ACE manifest processed by CBP'
              : 'SAAI-M manifest processed by Mexican customs',
          },
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Mexico border POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process Mexico border request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
