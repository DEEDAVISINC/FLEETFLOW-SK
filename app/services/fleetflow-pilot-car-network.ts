// FleetFlow Pilot Car Network - AI-Powered Service Platform
// Our own network of certified pilot car operators with seamless integration

export interface FleetFlowPilotOperator {
  id: string;
  operatorInfo: {
    name: string;
    companyName: string;
    phone: string;
    email: string;
    licenseNumber: string;
    insuranceCertificate: string;
    yearsExperience: number;
  };
  coverage: {
    primaryStates: string[];
    homeBase: { city: string; state: string; coordinates: [number, number] };
    maxRadius: number; // miles from home base
    availableRoutes: string[];
  };
  equipment: {
    vehicleType: 'pickup' | 'suv' | 'van' | 'specialized';
    heightPole: boolean;
    emergencyLights: boolean;
    radioEquipment: string[];
    signage: string[];
    specialEquipment: string[];
  };
  certifications: {
    dotCertified: boolean;
    hazmatEndorsement: boolean;
    oversizePermitExperience: boolean;
    lawEnforcementTrained: boolean;
    specializedTraining: string[];
  };
  availability: {
    schedule: Record<string, { available: boolean; hours: string }>;
    emergencyService: boolean;
    advanceNotice: string;
    blackoutDates: Date[];
  };
  performance: {
    rating: number; // 1-5 stars
    completedJobs: number;
    onTimePercentage: number;
    customerFeedback: number;
    safetyRecord: 'excellent' | 'good' | 'fair';
  };
  pricing: {
    baseRate: number; // per mile
    minimumCharge: number;
    emergencyMultiplier: number;
    specialServices: Record<string, number>;
  };
  status: 'active' | 'busy' | 'unavailable' | 'offline';
  currentLocation?: [number, number];
}

export interface PilotCarLead {
  id: string;
  customerName: string;
  customerType: 'Owner_Operator' | 'Fleet' | 'Broker' | '3PL' | 'Shipper';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    location: string;
  };
  leadSource:
    | 'Heavy_Haul_Analysis'
    | 'Route_Planning'
    | 'Load_Board'
    | 'AI_Discovery';
  loadRequirements: {
    dimensions: {
      length: number;
      width: number;
      height: number;
      weight: number;
    };
    route: {
      origin: string;
      destination: string;
      miles: number;
      states: string[];
    };
    timeline: {
      pickupDate: Date;
      urgency: 'standard' | 'urgent' | 'emergency';
    };
    frequency: 'one_time' | 'weekly' | 'monthly' | 'ongoing';
  };
  pilotCarNeeds: {
    frontPilot: boolean;
    rearPilot: boolean;
    heightPole: boolean;
    lawEnforcement: boolean;
    specialEquipment: string[];
  };
  potentialValue: number;
  priority: 'standard' | 'high' | 'urgent';
  status: 'new' | 'quoted' | 'negotiating' | 'booked' | 'completed';
  tenantId: string;
  timestamp: string;
}

export interface PilotCarConversion {
  id: string;
  leadId: string;
  customerName: string;
  customerType: 'Owner_Operator' | 'Fleet' | 'Broker' | '3PL' | 'Shipper';
  conversionType:
    | 'quote_requested'
    | 'service_booked'
    | 'contract_signed'
    | 'recurring_setup';
  source: 'FleetFlow_Pilot_Network';
  potentialValue: number;
  actualValue?: number;
  priority: 'standard' | 'high' | 'urgent';
  timestamp: string;
  tenantId: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  serviceType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  pilotCarDetails: {
    operatorAssigned?: string;
    estimatedCost: number;
    fleetFlowMargin: number;
    serviceDate: Date;
    routeCovered: string;
  };
}

class FleetFlowPilotCarNetwork {
  private operators: FleetFlowPilotOperator[] = [
    {
      id: 'ff-pilot-001',
      operatorInfo: {
        name: 'Jake Thompson',
        companyName: 'Lone Star Escorts',
        phone: '214-555-0101',
        email: 'jake@lonestarescorts.com',
        licenseNumber: 'TX-PILOT-2024-001',
        insuranceCertificate: 'CERT-2024-LSE-001',
        yearsExperience: 8,
      },
      coverage: {
        primaryStates: ['TX', 'OK', 'LA', 'AR', 'NM'],
        homeBase: {
          city: 'Dallas',
          state: 'TX',
          coordinates: [-96.797, 32.7767],
        },
        maxRadius: 500,
        availableRoutes: ['I-35', 'I-20', 'I-10', 'US-287'],
      },
      equipment: {
        vehicleType: 'pickup',
        heightPole: true,
        emergencyLights: true,
        radioEquipment: ['CB', 'VHF', 'Cell'],
        signage: ['OVERSIZE LOAD', 'WIDE LOAD', 'PILOT CAR'],
        specialEquipment: ['Height Pole', 'Emergency Kit', 'Flares'],
      },
      certifications: {
        dotCertified: true,
        hazmatEndorsement: false,
        oversizePermitExperience: true,
        lawEnforcementTrained: true,
        specializedTraining: ['Heavy Haul', 'Construction Equipment'],
      },
      availability: {
        schedule: {
          monday: { available: true, hours: '6:00 AM - 10:00 PM' },
          tuesday: { available: true, hours: '6:00 AM - 10:00 PM' },
          wednesday: { available: true, hours: '6:00 AM - 10:00 PM' },
          thursday: { available: true, hours: '6:00 AM - 10:00 PM' },
          friday: { available: true, hours: '6:00 AM - 10:00 PM' },
          saturday: { available: true, hours: '8:00 AM - 8:00 PM' },
          sunday: { available: false, hours: 'Emergency Only' },
        },
        emergencyService: true,
        advanceNotice: '12 hours',
        blackoutDates: [],
      },
      performance: {
        rating: 4.8,
        completedJobs: 247,
        onTimePercentage: 98.5,
        customerFeedback: 4.9,
        safetyRecord: 'excellent',
      },
      pricing: {
        baseRate: 2.75,
        minimumCharge: 275,
        emergencyMultiplier: 1.5,
        specialServices: {
          height_pole: 100,
          emergency_response: 150,
          law_enforcement_coordination: 200,
        },
      },
      status: 'active',
      currentLocation: [-96.797, 32.7767],
    },
    {
      id: 'ff-pilot-002',
      operatorInfo: {
        name: 'Maria Rodriguez',
        companyName: 'West Coast Pilot Services',
        phone: '559-555-0202',
        email: 'maria@westcoastpilot.com',
        licenseNumber: 'CA-PILOT-2024-002',
        insuranceCertificate: 'CERT-2024-WCP-002',
        yearsExperience: 12,
      },
      coverage: {
        primaryStates: ['CA', 'NV', 'AZ', 'OR'],
        homeBase: {
          city: 'Fresno',
          state: 'CA',
          coordinates: [-119.7871, 36.7378],
        },
        maxRadius: 600,
        availableRoutes: ['I-5', 'I-10', 'US-101', 'I-15'],
      },
      equipment: {
        vehicleType: 'suv',
        heightPole: true,
        emergencyLights: true,
        radioEquipment: ['CB', 'VHF', 'Satellite'],
        signage: ['OVERSIZE LOAD', 'PILOT CAR', 'CONSTRUCTION'],
        specialEquipment: ['Height Pole', 'GPS Tracking', 'Emergency Kit'],
      },
      certifications: {
        dotCertified: true,
        hazmatEndorsement: true,
        oversizePermitExperience: true,
        lawEnforcementTrained: true,
        specializedTraining: ['Heavy Haul', 'Wind Energy', 'Oil & Gas'],
      },
      availability: {
        schedule: {
          monday: { available: true, hours: '5:00 AM - 11:00 PM' },
          tuesday: { available: true, hours: '5:00 AM - 11:00 PM' },
          wednesday: { available: true, hours: '5:00 AM - 11:00 PM' },
          thursday: { available: true, hours: '5:00 AM - 11:00 PM' },
          friday: { available: true, hours: '5:00 AM - 11:00 PM' },
          saturday: { available: true, hours: '6:00 AM - 10:00 PM' },
          sunday: { available: true, hours: '8:00 AM - 6:00 PM' },
        },
        emergencyService: true,
        advanceNotice: '8 hours',
        blackoutDates: [],
      },
      performance: {
        rating: 4.9,
        completedJobs: 389,
        onTimePercentage: 99.2,
        customerFeedback: 4.8,
        safetyRecord: 'excellent',
      },
      pricing: {
        baseRate: 3.0,
        minimumCharge: 300,
        emergencyMultiplier: 2.0,
        specialServices: {
          height_pole: 125,
          hazmat_escort: 200,
          wind_energy_specialist: 250,
        },
      },
      status: 'active',
      currentLocation: [-119.7871, 36.7378],
    },
    {
      id: 'ff-pilot-003',
      operatorInfo: {
        name: 'David Chen',
        companyName: 'Midwest Heavy Haul Escorts',
        phone: '312-555-0303',
        email: 'david@midwestheavyhaul.com',
        licenseNumber: 'IL-PILOT-2024-003',
        insuranceCertificate: 'CERT-2024-MHH-003',
        yearsExperience: 15,
      },
      coverage: {
        primaryStates: ['IL', 'IN', 'OH', 'MI', 'WI', 'IA'],
        homeBase: {
          city: 'Chicago',
          state: 'IL',
          coordinates: [-87.6298, 41.8781],
        },
        maxRadius: 400,
        availableRoutes: ['I-80', 'I-90', 'I-94', 'I-65'],
      },
      equipment: {
        vehicleType: 'specialized',
        heightPole: true,
        emergencyLights: true,
        radioEquipment: ['CB', 'VHF', 'Digital'],
        signage: ['OVERSIZE LOAD', 'WIDE LOAD', 'PILOT CAR', 'CONSTRUCTION'],
        specialEquipment: [
          'Height Pole',
          'Measuring Equipment',
          'Route Survey Tools',
        ],
      },
      certifications: {
        dotCertified: true,
        hazmatEndorsement: true,
        oversizePermitExperience: true,
        lawEnforcementTrained: true,
        specializedTraining: [
          'Heavy Haul',
          'Industrial Equipment',
          'Government Contracts',
        ],
      },
      availability: {
        schedule: {
          monday: { available: true, hours: '6:00 AM - 9:00 PM' },
          tuesday: { available: true, hours: '6:00 AM - 9:00 PM' },
          wednesday: { available: true, hours: '6:00 AM - 9:00 PM' },
          thursday: { available: true, hours: '6:00 AM - 9:00 PM' },
          friday: { available: true, hours: '6:00 AM - 9:00 PM' },
          saturday: { available: true, hours: '7:00 AM - 7:00 PM' },
          sunday: { available: false, hours: 'Emergency Only' },
        },
        emergencyService: true,
        advanceNotice: '24 hours',
        blackoutDates: [],
      },
      performance: {
        rating: 4.7,
        completedJobs: 156,
        onTimePercentage: 97.8,
        customerFeedback: 4.6,
        safetyRecord: 'excellent',
      },
      pricing: {
        baseRate: 2.9,
        minimumCharge: 290,
        emergencyMultiplier: 1.8,
        specialServices: {
          height_pole: 110,
          route_survey: 175,
          government_escort: 300,
        },
      },
      status: 'active',
      currentLocation: [-87.6298, 41.8781],
    },
  ];

  // Generate pilot car leads from heavy haul analysis
  public async generatePilotCarLeads(
    tenantId: string
  ): Promise<PilotCarLead[]> {
    const leads: PilotCarLead[] = [
      {
        id: 'PILOT-LEAD-001',
        customerName: 'Texas Wind Energy LLC',
        customerType: 'Shipper',
        contactInfo: {
          name: 'Robert Martinez',
          email: 'rmartinez@texaswindenergy.com',
          phone: '(512) 555-0147',
          company: 'Texas Wind Energy LLC',
          location: 'Austin, TX',
        },
        leadSource: 'Heavy_Haul_Analysis',
        loadRequirements: {
          dimensions: { length: 180, width: 14.5, height: 16.2, weight: 95000 },
          route: {
            origin: 'Port of Houston, TX',
            destination: 'Sweetwater, TX',
            miles: 385,
            states: ['TX'],
          },
          timeline: {
            pickupDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            urgency: 'urgent',
          },
          frequency: 'monthly',
        },
        pilotCarNeeds: {
          frontPilot: true,
          rearPilot: true,
          heightPole: true,
          lawEnforcement: false,
          specialEquipment: ['Height Pole', 'Wide Load Signs'],
        },
        potentialValue: 8500,
        priority: 'urgent',
        status: 'new',
        tenantId,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'PILOT-LEAD-002',
        customerName: 'Heavy Haul Specialists Inc',
        customerType: 'Fleet',
        contactInfo: {
          name: 'Jennifer Walsh',
          email: 'jwalsh@heavyhaulspec.com',
          phone: '(713) 555-0289',
          company: 'Heavy Haul Specialists Inc',
          location: 'Houston, TX',
        },
        leadSource: 'Route_Planning',
        loadRequirements: {
          dimensions: {
            length: 125,
            width: 16.8,
            height: 14.2,
            weight: 145000,
          },
          route: {
            origin: 'Houston, TX',
            destination: 'New Orleans, LA',
            miles: 450,
            states: ['TX', 'LA'],
          },
          timeline: {
            pickupDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            urgency: 'standard',
          },
          frequency: 'weekly',
        },
        pilotCarNeeds: {
          frontPilot: true,
          rearPilot: true,
          heightPole: false,
          lawEnforcement: true,
          specialEquipment: ['Wide Load Signs', 'Emergency Equipment'],
        },
        potentialValue: 12000,
        priority: 'high',
        status: 'quoted',
        tenantId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'PILOT-LEAD-003',
        customerName: 'Midwest Logistics Corp',
        customerType: 'Broker',
        contactInfo: {
          name: 'Michael Johnson',
          email: 'mjohnson@midwestlogistics.com',
          phone: '(312) 555-0456',
          company: 'Midwest Logistics Corp',
          location: 'Chicago, IL',
        },
        leadSource: 'AI_Discovery',
        loadRequirements: {
          dimensions: { length: 95, width: 13.2, height: 15.8, weight: 88000 },
          route: {
            origin: 'Chicago, IL',
            destination: 'Detroit, MI',
            miles: 280,
            states: ['IL', 'IN', 'MI'],
          },
          timeline: {
            pickupDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            urgency: 'standard',
          },
          frequency: 'one_time',
        },
        pilotCarNeeds: {
          frontPilot: true,
          rearPilot: false,
          heightPole: true,
          lawEnforcement: false,
          specialEquipment: ['Height Pole'],
        },
        potentialValue: 6500,
        priority: 'high',
        status: 'negotiating',
        tenantId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ];

    return leads;
  }

  // Generate successful conversions
  public async getPilotCarConversions(
    tenantId: string
  ): Promise<PilotCarConversion[]> {
    const conversions: PilotCarConversion[] = [
      {
        id: 'PC-CONV-001',
        leadId: 'PILOT-LEAD-004',
        customerName: 'California Solar Projects',
        customerType: 'Shipper',
        conversionType: 'service_booked',
        source: 'FleetFlow_Pilot_Network',
        potentialValue: 15000,
        actualValue: 14200,
        priority: 'urgent',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        tenantId,
        contactInfo: {
          name: 'Lisa Chen',
          email: 'lchen@casolarprojects.com',
          phone: '(559) 555-0789',
          company: 'California Solar Projects',
        },
        serviceType: 'Solar Panel Transport - Front + Rear Pilot',
        status: 'in_progress',
        pilotCarDetails: {
          operatorAssigned: 'Maria Rodriguez - West Coast Pilot Services',
          estimatedCost: 9467,
          fleetFlowMargin: 4733,
          serviceDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
          routeCovered: 'Fresno, CA → Bakersfield, CA (280 miles)',
        },
      },
      {
        id: 'PC-CONV-002',
        leadId: 'PILOT-LEAD-005',
        customerName: 'Gulf Coast Heavy Haul',
        customerType: 'Fleet',
        conversionType: 'contract_signed',
        source: 'FleetFlow_Pilot_Network',
        potentialValue: 25000,
        actualValue: 23500,
        priority: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        tenantId,
        contactInfo: {
          name: 'Carlos Rodriguez',
          email: 'crodriguez@gulfcoastheavy.com',
          phone: '(713) 555-0234',
          company: 'Gulf Coast Heavy Haul',
        },
        serviceType: 'Oil Rig Equipment - Multi-State Escort',
        status: 'completed',
        pilotCarDetails: {
          operatorAssigned: 'Jake Thompson - Lone Star Escorts',
          estimatedCost: 15667,
          fleetFlowMargin: 7833,
          serviceDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          routeCovered: 'Houston, TX → Midland, TX (450 miles)',
        },
      },
    ];

    return conversions;
  }

  // AI-powered market insights
  public async generateMarketInsights(tenantId: string): Promise<{
    marketTrends: any[];
    opportunities: any[];
    recommendations: string[];
    networkStats: any;
  }> {
    const networkStats = this.getNetworkStats();

    return {
      marketTrends: [
        {
          trend: 'Wind Energy Boom',
          description:
            'Wind turbine transport increasing 25% annually in TX, OK, KS',
          impact: 'High demand for specialized height pole escorts',
          timeframe: 'Next 18 months',
          opportunity: '$2.8M potential',
        },
        {
          trend: 'Infrastructure Investment',
          description:
            'Federal infrastructure bill driving bridge/road construction',
          impact: 'Increased oversized equipment transport',
          timeframe: 'Next 24 months',
          opportunity: '$1.9M potential',
        },
        {
          trend: 'Oil & Gas Recovery',
          description: 'Drilling equipment transport recovering post-pandemic',
          impact: 'Heavy haul + pilot car service bundles',
          timeframe: 'Current growth',
          opportunity: '$3.4M potential',
        },
      ],
      opportunities: [
        {
          opportunity: 'Texas Wind Corridor',
          description:
            'Major wind farms under construction: Sweetwater, Lubbock, Amarillo',
          potential: '$2.5M annually',
          requirements: 'Height pole specialists, multi-turbine routes',
          actionItems: [
            'Recruit 3 more TX operators',
            'Develop wind energy partnerships',
          ],
        },
        {
          opportunity: 'California Solar Projects',
          description: 'Large-scale solar installations increasing 40%',
          potential: '$1.8M annually',
          requirements: 'Solar panel transport expertise',
          actionItems: ['Partner with solar installers', 'Expand CA coverage'],
        },
        {
          opportunity: 'Government Contracts',
          description:
            'DOT infrastructure projects requiring certified escorts',
          potential: '$3.2M annually',
          requirements: 'Government contract experience, security clearances',
          actionItems: [
            'Obtain government certifications',
            'Build DOT relationships',
          ],
        },
      ],
      recommendations: [
        'Recruit 5 additional operators in high-growth wind energy corridors',
        'Develop specialized training program for wind turbine transport',
        'Create government contract division with security-cleared operators',
        'Implement real-time GPS tracking for all network operators',
        'Build partnerships with heavy haul carriers for bundled services',
        'Expand emergency service coverage to 24/7 in all major markets',
      ],
      networkStats,
    };
  }

  // Get network performance statistics
  public getNetworkStats(): {
    totalOperators: number;
    activeOperators: number;
    statesCovered: number;
    averageRating: number;
    completedJobs: number;
    totalRevenue: number;
    fleetFlowMargin: number;
  } {
    const activeOperators = this.operators.filter(
      (op) => op.status === 'active'
    );
    const allStates = new Set(
      this.operators.flatMap((op) => op.coverage.primaryStates)
    );
    const totalJobs = this.operators.reduce(
      (sum, op) => sum + op.performance.completedJobs,
      0
    );
    const avgRating =
      this.operators.reduce((sum, op) => sum + op.performance.rating, 0) /
      this.operators.length;

    // Estimate revenue based on completed jobs
    const avgJobValue = 4500; // Average pilot car job value
    const totalRevenue = totalJobs * avgJobValue;
    const fleetFlowMargin = totalRevenue * 0.5; // 50% margin

    return {
      totalOperators: this.operators.length,
      activeOperators: activeOperators.length,
      statesCovered: allStates.size,
      averageRating: Math.round(avgRating * 10) / 10,
      completedJobs: totalJobs,
      totalRevenue,
      fleetFlowMargin,
    };
  }

  // Analyze pilot car requirements
  public analyzePilotCarRequirements(dimensions: any): {
    required: boolean;
    frontPilot: boolean;
    rearPilot: boolean;
    heightPole: boolean;
    lawEnforcement: boolean;
    reasoning: string[];
    estimatedCost: number;
  } {
    const { length, width, height, weight } = dimensions;
    const reasoning: string[] = [];

    let frontPilot = false;
    let rearPilot = false;
    let heightPole = false;
    let lawEnforcement = false;

    // Width analysis
    if (width > 12 && width <= 14) {
      frontPilot = true;
      reasoning.push(`Width ${width}ft requires front pilot car`);
    } else if (width > 14 && width <= 16) {
      frontPilot = true;
      rearPilot = true;
      reasoning.push(`Width ${width}ft requires front and rear pilot cars`);
    } else if (width > 16) {
      frontPilot = true;
      rearPilot = true;
      lawEnforcement = true;
      reasoning.push(
        `Width ${width}ft requires multiple escorts + law enforcement`
      );
    }

    // Height analysis
    if (height > 15) {
      heightPole = true;
      if (!frontPilot) frontPilot = true;
      reasoning.push(`Height ${height}ft requires height pole vehicle`);
    }

    // Length analysis
    if (length > 100) {
      if (!rearPilot) rearPilot = true;
      reasoning.push(`Length ${length}ft requires rear pilot car`);
    }

    // Weight analysis
    if (weight > 120000) {
      lawEnforcement = true;
      reasoning.push(`Weight ${weight}lbs requires law enforcement escort`);
    }

    const required = frontPilot || rearPilot || heightPole || lawEnforcement;

    // Estimate cost
    let estimatedCost = 0;
    if (required) {
      const avgMiles = 350; // Average route distance
      const baseRate = 2.85; // Average operator rate
      estimatedCost = avgMiles * baseRate;

      if (heightPole) estimatedCost += 115;
      if (lawEnforcement) estimatedCost += 250;
      if (frontPilot && rearPilot) estimatedCost *= 1.8; // Multiple vehicles

      estimatedCost = Math.max(estimatedCost, 285); // Minimum charge
      estimatedCost *= 1.5; // FleetFlow customer price (50% margin)
    }

    return {
      required,
      frontPilot,
      rearPilot,
      heightPole,
      lawEnforcement,
      reasoning,
      estimatedCost: Math.round(estimatedCost),
    };
  }

  // Find available operators for a route
  public async findAvailableOperators(
    route: { statesTraversed: string[] },
    timeline: { pickupDate: Date },
    requirements: any
  ): Promise<FleetFlowPilotOperator[]> {
    return this.operators.filter((operator) => {
      // Check state coverage
      const coverageMatch = route.statesTraversed.some((state) =>
        operator.coverage.primaryStates.includes(state)
      );

      // Check availability
      const dayOfWeek = timeline.pickupDate.toLocaleDateString('en-US', {
        weekday: 'lowercase',
      });
      const availableOnDay =
        operator.availability.schedule[dayOfWeek]?.available;

      // Check equipment requirements
      const equipmentMatch =
        !requirements.heightPole || operator.equipment.heightPole;

      // Check status
      const statusOk = operator.status === 'active';

      return coverageMatch && availableOnDay && equipmentMatch && statusOk;
    });
  }
}

export const fleetFlowPilotNetwork = new FleetFlowPilotCarNetwork();

