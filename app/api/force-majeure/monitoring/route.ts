import { NextRequest, NextResponse } from 'next/server';

interface DisasterEvent {
  id: string;
  type:
    | 'hurricane'
    | 'earthquake'
    | 'flood'
    | 'wildfire'
    | 'tornado'
    | 'blizzard'
    | 'pandemic'
    | 'cyberattack'
    | 'strike'
    | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number;
  status: 'monitoring' | 'active' | 'resolved';
  startTime: string;
  estimatedEndTime?: string;
  description: string;
  affectedRoutes: string[];
  affectedDrivers: string[];
  affectedCustomers: string[];
  emergencyActions: string[];
}

interface ContingencyPlan {
  id: string;
  name: string;
  triggerConditions: string[];
  automatedActions: string[];
  manualActions: string[];
  resourceRequirements: string[];
  communicationPlan: string[];
  recoverySteps: string[];
  lastUpdated: string;
  isActive: boolean;
}

interface EmergencyResource {
  id: string;
  type:
    | 'backup_facility'
    | 'emergency_vehicle'
    | 'communication_system'
    | 'medical_kit'
    | 'fuel_reserve'
    | 'cash_reserve';
  name: string;
  location: string;
  capacity: string;
  availability: 'available' | 'in_use' | 'unavailable';
  contact: string;
  notes: string;
}

interface BusinessImpactAssessment {
  eventId: string;
  estimatedRevenueLoss: number;
  operationalDisruption: number;
  customerImpact: number;
  driverImpact: number;
  recoveryTimeEstimate: number;
  priorityActions: string[];
  insuranceClaims: string[];
}

interface ForceMajeureResponse {
  events: DisasterEvent[];
  plans: ContingencyPlan[];
  resources: EmergencyResource[];
  businessImpact: BusinessImpactAssessment[];
  summary: {
    totalActiveEvents: number;
    totalMonitoringEvents: number;
    totalAffectedDrivers: number;
    totalEstimatedLoss: number;
    averageRecoveryTime: number;
    criticalResourcesNeeded: number;
  };
}

// Mock data for comprehensive disaster response scenarios
const mockEvents: DisasterEvent[] = [
  {
    id: 'event-001',
    type: 'hurricane',
    severity: 'critical',
    location: 'Gulf Coast, Florida',
    coordinates: { lat: 27.7663, lng: -82.6404 },
    radius: 200,
    status: 'active',
    startTime: '2024-01-15T06:00:00Z',
    estimatedEndTime: '2024-01-17T20:00:00Z',
    description:
      'Category 4 Hurricane Milton approaching Florida Gulf Coast with sustained winds of 145 mph',
    affectedRoutes: ['I-75', 'I-95', 'I-4', 'US-41', 'FL-60'],
    affectedDrivers: ['D001', 'D002', 'D003', 'D004', 'D005', 'D006'],
    affectedCustomers: ['CUST-001', 'CUST-002', 'CUST-003'],
    emergencyActions: [
      'Immediate evacuation of all drivers from danger zone',
      'Reroute all shipments through alternate corridors',
      'Activate Atlanta backup operations center',
      'Deploy mobile command units',
      'Coordinate with FEMA and state emergency services',
    ],
  },
  {
    id: 'event-002',
    type: 'wildfire',
    severity: 'high',
    location: 'Northern California',
    coordinates: { lat: 38.5816, lng: -121.4944 },
    radius: 100,
    status: 'active',
    startTime: '2024-01-14T10:00:00Z',
    description:
      'Fast-moving wildfire consuming 15,000 acres near major shipping corridors',
    affectedRoutes: ['I-5', 'CA-99', 'I-80'],
    affectedDrivers: ['D007', 'D008', 'D009'],
    affectedCustomers: ['CUST-004', 'CUST-005'],
    emergencyActions: [
      'Monitor air quality levels continuously',
      'Prepare N95 masks for drivers',
      'Establish alternate routes through Nevada',
      'Coordinate with CAL FIRE',
    ],
  },
  {
    id: 'event-003',
    type: 'blizzard',
    severity: 'medium',
    location: 'Colorado Rockies',
    coordinates: { lat: 39.7392, lng: -104.9903 },
    radius: 150,
    status: 'monitoring',
    startTime: '2024-01-16T00:00:00Z',
    estimatedEndTime: '2024-01-18T12:00:00Z',
    description:
      'Major winter storm expected to dump 2-3 feet of snow across I-70 corridor',
    affectedRoutes: ['I-70', 'I-25', 'US-285'],
    affectedDrivers: ['D010', 'D011'],
    affectedCustomers: ['CUST-006'],
    emergencyActions: [
      'Pre-position snow chains and emergency supplies',
      'Monitor road closures and weather conditions',
      'Prepare southern route alternatives',
    ],
  },
  {
    id: 'event-004',
    type: 'cyberattack',
    severity: 'high',
    location: 'Corporate Network',
    coordinates: { lat: 33.749, lng: -84.388 },
    radius: 0,
    status: 'active',
    startTime: '2024-01-15T14:30:00Z',
    description:
      'Ransomware attack targeting fleet management systems and customer databases',
    affectedRoutes: ['All digital systems'],
    affectedDrivers: ['All drivers using mobile apps'],
    affectedCustomers: ['All customers with digital access'],
    emergencyActions: [
      'Isolate affected systems immediately',
      'Activate manual backup procedures',
      'Contact cybersecurity incident response team',
      'Notify customers of potential data breach',
      'Coordinate with FBI Cyber Division',
    ],
  },
];

const mockPlans: ContingencyPlan[] = [
  {
    id: 'plan-001',
    name: 'Hurricane & Severe Weather Response Plan',
    triggerConditions: [
      'Category 2+ hurricane within 300 miles of operations',
      'Sustained winds exceeding 74 mph',
      'Storm surge warnings issued',
      'Mandatory evacuation orders in operational areas',
    ],
    automatedActions: [
      'Send emergency alerts to all drivers in affected zones',
      'Automatically reroute active shipments through safe corridors',
      'Activate GPS tracking for all vehicles every 15 minutes',
      'Deploy emergency communication protocols',
      'Initiate fuel reserve distribution',
    ],
    manualActions: [
      'Contact all drivers in affected areas personally',
      'Coordinate with emergency services and FEMA',
      'Implement customer communication strategy',
      'Deploy mobile command units to strategic locations',
      'Activate backup operations centers',
      'Coordinate media relations and public communications',
    ],
    resourceRequirements: [
      'Atlanta backup facility (50 vehicles, 100 staff)',
      'Mobile command units (3 units)',
      'Emergency communication systems',
      'Fuel reserves (10,000 gallons)',
      'Emergency cash reserves ($100,000)',
      'Medical kits and first aid supplies',
    ],
    communicationPlan: [
      'SMS alerts to all drivers every 2 hours',
      'Email notifications to customers within 1 hour',
      'Social media updates every 4 hours',
      'Press releases to local media',
      'Direct calls to high-priority customers',
      'Website banner with real-time updates',
    ],
    recoverySteps: [
      'Conduct damage assessment of all facilities',
      'Resume operations gradually starting with safe zones',
      'File insurance claims within 48 hours',
      'Debrief with all stakeholders',
      'Update emergency procedures based on lessons learned',
      'Restore full operations within 72 hours',
    ],
    lastUpdated: '2024-01-10T08:00:00Z',
    isActive: true,
  },
  {
    id: 'plan-002',
    name: 'Wildfire Response & Air Quality Plan',
    triggerConditions: [
      'Wildfire within 75 miles of major routes',
      'Air Quality Index exceeding 150',
      'Visibility reduced below 1/4 mile',
      'Red flag warnings issued',
    ],
    automatedActions: [
      'Issue air quality alerts to drivers',
      'Suggest alternate routes avoiding smoke zones',
      'Monitor real-time air quality data',
      'Distribute N95 masks from emergency supplies',
    ],
    manualActions: [
      'Monitor fire progression with CAL FIRE',
      'Coordinate with fire departments along routes',
      'Assess driver health and safety',
      'Implement reduced speed protocols',
    ],
    resourceRequirements: [
      'Air quality monitoring equipment',
      'N95 masks (500 units)',
      'Alternate route mapping systems',
      'Emergency vehicle maintenance kits',
    ],
    communicationPlan: [
      'Real-time driver health check-ins',
      'Customer notifications about potential delays',
      'Coordination with environmental agencies',
    ],
    recoverySteps: [
      'Wait for air quality improvement',
      'Inspect vehicles for smoke damage',
      'Resume normal operations gradually',
    ],
    lastUpdated: '2024-01-08T12:00:00Z',
    isActive: true,
  },
  {
    id: 'plan-003',
    name: 'Cybersecurity Incident Response Plan',
    triggerConditions: [
      'Unauthorized access to systems detected',
      'Ransomware or malware identified',
      'Data breach suspected or confirmed',
      'System performance degradation beyond normal parameters',
    ],
    automatedActions: [
      'Isolate affected systems immediately',
      'Activate backup systems and manual procedures',
      'Log all system activities for forensic analysis',
      'Notify cybersecurity monitoring service',
    ],
    manualActions: [
      'Contact cybersecurity incident response team',
      'Notify law enforcement (FBI Cyber Division)',
      'Implement manual dispatch and tracking procedures',
      'Assess scope of data compromise',
      'Coordinate with legal team for compliance requirements',
      'Prepare customer and stakeholder communications',
    ],
    resourceRequirements: [
      'Backup paper-based dispatch systems',
      'Secure communication channels',
      'Forensic analysis tools',
      'Legal and cybersecurity consultants',
      'Emergency cash reserves for operations',
    ],
    communicationPlan: [
      'Internal crisis communication to all staff',
      'Customer notification within 72 hours if data affected',
      'Regulatory notifications as required',
      'Media relations strategy',
      'Stakeholder updates every 24 hours',
    ],
    recoverySteps: [
      'Complete forensic analysis of incident',
      'Rebuild systems from clean backups',
      'Implement additional security measures',
      'Conduct staff training on new procedures',
      'Review and update all cybersecurity policies',
    ],
    lastUpdated: '2024-01-12T16:00:00Z',
    isActive: true,
  },
];

const mockResources: EmergencyResource[] = [
  {
    id: 'res-001',
    type: 'backup_facility',
    name: 'Atlanta Emergency Operations Center',
    location: 'Atlanta, GA',
    capacity: '50 vehicles, 100 staff, 72-hour fuel supply',
    availability: 'available',
    contact: '+1-404-555-0123',
    notes:
      'Fully equipped backup facility with generators, satellite communications, and emergency supplies',
  },
  {
    id: 'res-002',
    type: 'emergency_vehicle',
    name: 'Mobile Command Unit Alpha',
    location: 'Jacksonville, FL',
    capacity: '6 personnel, satellite communications, mobile office',
    availability: 'in_use',
    contact: '+1-904-555-0456',
    notes: 'Currently deployed for hurricane response operations',
  },
  {
    id: 'res-003',
    type: 'emergency_vehicle',
    name: 'Mobile Command Unit Beta',
    location: 'Dallas, TX',
    capacity: '6 personnel, satellite communications, mobile office',
    availability: 'available',
    contact: '+1-214-555-0789',
    notes: 'Ready for immediate deployment',
  },
  {
    id: 'res-004',
    type: 'communication_system',
    name: 'Satellite Communication Network',
    location: 'Multiple locations',
    capacity: '500 simultaneous connections',
    availability: 'available',
    contact: '+1-800-555-0321',
    notes: 'Redundant satellite communication system for emergency operations',
  },
  {
    id: 'res-005',
    type: 'fuel_reserve',
    name: 'Emergency Fuel Reserve - Southeast',
    location: 'Multiple fuel depots',
    capacity: '25,000 gallons diesel',
    availability: 'available',
    contact: '+1-800-555-0654',
    notes:
      'Strategic fuel reserves positioned across southeastern United States',
  },
  {
    id: 'res-006',
    type: 'cash_reserve',
    name: 'Emergency Operations Fund',
    location: 'Corporate treasury',
    capacity: '$500,000 immediate access',
    availability: 'available',
    contact: '+1-404-555-0987',
    notes: 'Emergency fund for immediate operational needs during disasters',
  },
  {
    id: 'res-007',
    type: 'medical_kit',
    name: 'Emergency Medical Supplies',
    location: 'All facilities and vehicles',
    capacity: 'First aid for 100+ people',
    availability: 'available',
    contact: '+1-800-555-0111',
    notes:
      'Comprehensive medical supplies including trauma kits, medications, and AEDs',
  },
];

const mockBusinessImpact: BusinessImpactAssessment[] = [
  {
    eventId: 'event-001',
    estimatedRevenueLoss: 750000,
    operationalDisruption: 85,
    customerImpact: 15,
    driverImpact: 25,
    recoveryTimeEstimate: 96,
    priorityActions: [
      'Ensure driver and personnel safety above all else',
      'Maintain critical customer relationships and communications',
      'Minimize cargo damage and loss',
      'Preserve company reputation and public trust',
      'Document all damages for insurance claims',
    ],
    insuranceClaims: [
      'Property damage to facilities and equipment',
      'Business interruption insurance',
      'Cargo insurance for damaged shipments',
      'Vehicle damage and replacement',
      'Additional expense coverage for emergency operations',
    ],
  },
  {
    eventId: 'event-002',
    estimatedRevenueLoss: 180000,
    operationalDisruption: 45,
    customerImpact: 8,
    driverImpact: 12,
    recoveryTimeEstimate: 48,
    priorityActions: [
      'Monitor driver health and air quality exposure',
      'Maintain alternate route efficiency',
      'Communicate delays to affected customers',
      'Coordinate with environmental agencies',
    ],
    insuranceClaims: [
      'Vehicle damage from smoke and ash',
      'Additional fuel costs for alternate routes',
      'Health monitoring for affected personnel',
    ],
  },
  {
    eventId: 'event-004',
    estimatedRevenueLoss: 425000,
    operationalDisruption: 70,
    customerImpact: 50,
    driverImpact: 35,
    recoveryTimeEstimate: 120,
    priorityActions: [
      'Contain and assess cybersecurity breach',
      'Implement manual backup procedures',
      'Notify affected customers and stakeholders',
      'Coordinate with law enforcement and cybersecurity experts',
      'Restore systems with enhanced security measures',
    ],
    insuranceClaims: [
      'Cyber liability insurance',
      'Business interruption from system downtime',
      'Legal and forensic investigation costs',
      'Customer notification and credit monitoring services',
      'System restoration and security enhancement costs',
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    // Calculate summary statistics
    const totalActiveEvents = mockEvents.filter(
      (e) => e.status === 'active'
    ).length;
    const totalMonitoringEvents = mockEvents.filter(
      (e) => e.status === 'monitoring'
    ).length;
    const totalAffectedDrivers = mockEvents.reduce(
      (total, event) => total + event.affectedDrivers.length,
      0
    );
    const totalEstimatedLoss = mockBusinessImpact.reduce(
      (total, impact) => total + impact.estimatedRevenueLoss,
      0
    );
    const averageRecoveryTime =
      mockBusinessImpact.length > 0
        ? mockBusinessImpact.reduce(
            (total, impact) => total + impact.recoveryTimeEstimate,
            0
          ) / mockBusinessImpact.length
        : 0;
    const criticalResourcesNeeded = mockResources.filter(
      (r) => r.availability === 'in_use' || r.availability === 'unavailable'
    ).length;

    const response: ForceMajeureResponse = {
      events: mockEvents,
      plans: mockPlans,
      resources: mockResources,
      businessImpact: mockBusinessImpact,
      summary: {
        totalActiveEvents,
        totalMonitoringEvents,
        totalAffectedDrivers,
        totalEstimatedLoss,
        averageRecoveryTime: Math.round(averageRecoveryTime),
        criticalResourcesNeeded,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in force majeure monitoring API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch force majeure data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, eventId, planId } = body;

    switch (action) {
      case 'activate_plan':
        // Activate emergency contingency plan
        console.info(`Activating emergency plan: ${planId}`);
        return NextResponse.json({
          success: true,
          message: `Emergency plan ${planId} activated successfully`,
          timestamp: new Date().toISOString(),
        });

      case 'update_event_status':
        // Update disaster event status
        console.info(`Updating event ${eventId} status`);
        return NextResponse.json({
          success: true,
          message: `Event ${eventId} status updated`,
          timestamp: new Date().toISOString(),
        });

      case 'deploy_resources':
        // Deploy emergency resources
        console.info(`Deploying emergency resources for event: ${eventId}`);
        return NextResponse.json({
          success: true,
          message: 'Emergency resources deployed successfully',
          timestamp: new Date().toISOString(),
        });

      case 'send_alert':
        // Send emergency alert to drivers/customers
        console.info(`Sending emergency alert for event: ${eventId}`);
        return NextResponse.json({
          success: true,
          message: 'Emergency alerts sent successfully',
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in force majeure action API:', error);
    return NextResponse.json(
      { error: 'Failed to process force majeure action' },
      { status: 500 }
    );
  }
}
