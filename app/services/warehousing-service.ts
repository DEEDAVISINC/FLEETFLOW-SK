/**
 * FleetFlow Warehousing & 3PL Service
 * Comprehensive warehousing, storage, and third-party logistics management
 */

export interface WarehouseLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: [number, number];
  capacity: {
    totalSqFt: number;
    availableSqFt: number;
    palletPositions: number;
    availablePallets: number;
  };
  features: string[];
  certifications: string[];
  operatingHours: string;
  contactInfo: {
    manager: string;
    phone: string;
    email: string;
  };
}

export interface WarehousingService {
  id: string;
  type:
    | 'storage'
    | 'crossdock'
    | 'pickpack'
    | 'inventory'
    | 'distribution'
    | 'fulfillment'
    | '3pl';
  name: string;
  description: string;
  pricing: {
    unit: 'per_sqft' | 'per_pallet' | 'per_item' | 'per_order' | 'monthly';
    baseRate: number;
    minimumCharge: number;
    setupFee?: number;
  };
  requirements: string[];
  capabilities: string[];
  slaMetrics: {
    accuracy: number;
    processingTime: string;
    uptime: number;
  };
}

export interface WarehouseQuoteRequest {
  serviceType: string;
  duration: 'short_term' | 'long_term' | 'seasonal' | 'permanent';
  volume: {
    pallets?: number;
    sqft?: number;
    items?: number;
    weight?: number;
  };
  specialRequirements: string[];
  location: {
    preferred: string;
    alternatives: string[];
  };
  timeline: {
    startDate: string;
    endDate?: string;
  };
  contactInfo: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
  };
}

export interface WarehouseQuote {
  id: string;
  warehouseId: string;
  warehouseName: string;
  serviceType: string;
  pricing: {
    monthlyRate: number;
    setupFee: number;
    additionalServices: Array<{
      service: string;
      rate: number;
      unit: string;
    }>;
    totalEstimate: number;
  };
  timeline: {
    setupTime: string;
    availability: string;
  };
  features: string[];
  compliance: string[];
  confidence: number;
}

class WarehousingService {
  private warehouses: Map<string, WarehouseLocation> = new Map();
  private services: Map<string, WarehousingService> = new Map();

  constructor() {
    this.initializeWarehouses();
    this.initializeServices();
  }

  private initializeWarehouses(): void {
    const demoWarehouses: WarehouseLocation[] = [
      {
        id: 'wh-atlanta-001',
        name: 'FleetFlow Atlanta Distribution Center',
        address: '2500 Commerce Dr',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30318',
        coordinates: [33.749, -84.388],
        capacity: {
          totalSqFt: 500000,
          availableSqFt: 125000,
          palletPositions: 15000,
          availablePallets: 3750,
        },
        features: [
          'Climate-controlled zones',
          'Rail and truck access',
          'Cross-docking capabilities',
          '24/7 security and monitoring',
          'Advanced WMS system',
        ],
        certifications: ['FDA', 'USDA', 'ISO 9001', 'SQF'],
        operatingHours: '24/7',
        contactInfo: {
          manager: 'Sarah Johnson',
          phone: '+1-404-555-0123',
          email: 'atlanta@fleetflowapp.com',
        },
      },
      {
        id: 'wh-dallas-001',
        name: 'FleetFlow Dallas Fulfillment Hub',
        address: '8900 Industrial Blvd',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75247',
        coordinates: [32.7767, -96.797],
        capacity: {
          totalSqFt: 750000,
          availableSqFt: 200000,
          palletPositions: 22000,
          availablePallets: 5500,
        },
        features: [
          'Multi-temperature zones',
          'Automated picking systems',
          'E-commerce fulfillment',
          'Returns processing',
          'Value-added services',
        ],
        certifications: ['FDA', 'USDA', 'ISO 9001', 'CTPAT'],
        operatingHours: '24/7',
        contactInfo: {
          manager: 'Michael Rodriguez',
          phone: '+1-214-555-0456',
          email: 'dallas@fleetflowapp.com',
        },
      },
      {
        id: 'wh-chicago-001',
        name: 'FleetFlow Chicago Cold Storage',
        address: '4200 Logistics Way',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60609',
        coordinates: [41.8781, -87.6298],
        capacity: {
          totalSqFt: 300000,
          availableSqFt: 75000,
          palletPositions: 8000,
          availablePallets: 2000,
        },
        features: [
          'Temperature-controlled (-20°F to 70°F)',
          'Pharmaceutical-grade storage',
          'HACCP compliance',
          'Blast freezing capabilities',
          'Real-time temperature monitoring',
        ],
        certifications: ['FDA', 'USDA', 'AIB', 'SQF', 'BRC'],
        operatingHours: '24/7',
        contactInfo: {
          manager: 'Jennifer Chen',
          phone: '+1-312-555-0789',
          email: 'chicago@fleetflowapp.com',
        },
      },
    ];

    demoWarehouses.forEach((warehouse) => {
      this.warehouses.set(warehouse.id, warehouse);
    });
  }

  private initializeServices(): void {
    const warehousingServices: WarehousingService[] = [
      {
        id: 'storage-standard',
        type: 'storage',
        name: 'Warehouse Storage',
        description: 'Standard warehouse storage with inventory management',
        pricing: {
          unit: 'per_sqft',
          baseRate: 6.25,
          minimumCharge: 500,
          setupFee: 250,
        },
        requirements: ['Proper packaging', 'Clear labeling', 'Inventory list'],
        capabilities: [
          'Climate control',
          'Security monitoring',
          'Inventory tracking',
        ],
        slaMetrics: {
          accuracy: 99.5,
          processingTime: '24 hours',
          uptime: 99.9,
        },
      },
      {
        id: 'crossdock-standard',
        type: 'crossdock',
        name: 'Cross Docking',
        description:
          'Rapid transfer between inbound and outbound transportation',
        pricing: {
          unit: 'per_pallet',
          baseRate: 35.0,
          minimumCharge: 1000,
          setupFee: 500,
        },
        requirements: [
          'Advance scheduling',
          'Proper documentation',
          'Compatible equipment',
        ],
        capabilities: [
          'Same-day processing',
          'Quality inspection',
          'Consolidation',
        ],
        slaMetrics: {
          accuracy: 99.8,
          processingTime: '4-8 hours',
          uptime: 99.9,
        },
      },
      {
        id: 'pickpack-ecommerce',
        type: 'pickpack',
        name: 'Pick & Pack Services',
        description: 'Order fulfillment with picking, packing, and shipping',
        pricing: {
          unit: 'per_order',
          baseRate: 2.75,
          minimumCharge: 750,
          setupFee: 1000,
        },
        requirements: [
          'SKU management',
          'Order integration',
          'Packaging materials',
        ],
        capabilities: [
          'Multi-channel fulfillment',
          'Custom packaging',
          'Returns processing',
        ],
        slaMetrics: {
          accuracy: 99.7,
          processingTime: '24-48 hours',
          uptime: 99.8,
        },
      },
      {
        id: 'inventory-management',
        type: 'inventory',
        name: 'Inventory Management',
        description: 'Complete inventory control with WMS integration',
        pricing: {
          unit: 'monthly',
          baseRate: 95.0,
          minimumCharge: 2000,
          setupFee: 2500,
        },
        requirements: ['WMS integration', 'Barcode system', 'Cycle counting'],
        capabilities: [
          'Real-time tracking',
          'Automated reordering',
          'Reporting',
        ],
        slaMetrics: {
          accuracy: 99.9,
          processingTime: 'Real-time',
          uptime: 99.95,
        },
      },
      {
        id: 'distribution-center',
        type: 'distribution',
        name: 'Distribution Center',
        description:
          'Full distribution services with transportation coordination',
        pricing: {
          unit: 'per_sqft',
          baseRate: 12.25,
          minimumCharge: 5000,
          setupFee: 5000,
        },
        requirements: [
          'Volume commitments',
          'Transportation coordination',
          'Technology integration',
        ],
        capabilities: [
          'Multi-modal transportation',
          'Route optimization',
          'Load consolidation',
        ],
        slaMetrics: {
          accuracy: 99.6,
          processingTime: '24-72 hours',
          uptime: 99.9,
        },
      },
      {
        id: 'fulfillment-ecommerce',
        type: 'fulfillment',
        name: 'Fulfillment Services',
        description: 'Complete e-commerce fulfillment with returns management',
        pricing: {
          unit: 'per_order',
          baseRate: 3.95,
          minimumCharge: 1500,
          setupFee: 2000,
        },
        requirements: [
          'E-commerce integration',
          'Returns policy',
          'Packaging standards',
        ],
        capabilities: [
          'Same-day shipping',
          'Gift wrapping',
          'Branded packaging',
        ],
        slaMetrics: {
          accuracy: 99.8,
          processingTime: '12-24 hours',
          uptime: 99.9,
        },
      },
      {
        id: '3pl-full-service',
        type: '3pl',
        name: '3PL Full Service',
        description:
          'Complete supply chain management and logistics outsourcing',
        pricing: {
          unit: 'monthly',
          baseRate: 145.0,
          minimumCharge: 10000,
          setupFee: 15000,
        },
        requirements: [
          'Long-term contract',
          'Volume commitments',
          'System integration',
        ],
        capabilities: [
          'End-to-end logistics',
          'Supply chain optimization',
          'Performance analytics',
        ],
        slaMetrics: {
          accuracy: 99.9,
          processingTime: 'Variable by service',
          uptime: 99.95,
        },
      },
    ];

    warehousingServices.forEach((service) => {
      this.services.set(service.id, service);
    });
  }

  // Quote Generation Methods
  generateWarehouseQuote(request: WarehouseQuoteRequest): WarehouseQuote[] {
    const availableWarehouses = this.findNearbyWarehouses(
      request.location.preferred
    );
    const service = this.getServiceByType(request.serviceType);

    if (!service) {
      throw new Error(`Service type ${request.serviceType} not found`);
    }

    return availableWarehouses.slice(0, 3).map((warehouse, index) => {
      const tier =
        index === 0 ? 'premium' : index === 1 ? 'standard' : 'budget';
      const baseRate = service.pricing.baseRate;
      const tierMultiplier =
        tier === 'premium' ? 1.2 : tier === 'standard' ? 1.0 : 0.8;

      let monthlyRate = 0;
      if (service.pricing.unit === 'per_sqft' && request.volume.sqft) {
        monthlyRate = baseRate * request.volume.sqft * tierMultiplier;
      } else if (
        service.pricing.unit === 'per_pallet' &&
        request.volume.pallets
      ) {
        monthlyRate = baseRate * request.volume.pallets * tierMultiplier;
      } else if (service.pricing.unit === 'per_order' && request.volume.items) {
        monthlyRate = baseRate * request.volume.items * tierMultiplier;
      } else if (service.pricing.unit === 'monthly') {
        monthlyRate = baseRate * tierMultiplier;
      }

      const setupFee = (service.pricing.setupFee || 0) * tierMultiplier;
      const additionalServices = this.getAdditionalServices(
        request.serviceType,
        tier
      );
      const additionalCost = additionalServices.reduce(
        (sum, svc) => sum + svc.rate,
        0
      );

      return {
        id: `wh-quote-${Date.now()}-${index}`,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        serviceType: request.serviceType,
        pricing: {
          monthlyRate: Math.round(monthlyRate),
          setupFee: Math.round(setupFee),
          additionalServices,
          totalEstimate: Math.round(monthlyRate + setupFee + additionalCost),
        },
        timeline: {
          setupTime: this.calculateSetupTime(request.serviceType, tier),
          availability: this.calculateAvailability(warehouse, request),
        },
        features: this.getServiceFeatures(request.serviceType, tier),
        compliance: warehouse.certifications,
        confidence: tier === 'premium' ? 96 : tier === 'standard' ? 89 : 78,
      };
    });
  }

  private findNearbyWarehouses(location: string): WarehouseLocation[] {
    // In production, this would use geolocation and distance calculation
    return Array.from(this.warehouses.values()).sort(() => Math.random() - 0.5);
  }

  private getServiceByType(
    serviceType: string
  ): WarehousingService | undefined {
    const serviceMap = {
      'Warehouse Storage': 'storage-standard',
      'Cross Docking': 'crossdock-standard',
      'Pick & Pack': 'pickpack-ecommerce',
      'Inventory Management': 'inventory-management',
      'Distribution Center': 'distribution-center',
      'Fulfillment Services': 'fulfillment-ecommerce',
      '3PL Full Service': '3pl-full-service',
    };

    const serviceId = serviceMap[serviceType];
    return serviceId ? this.services.get(serviceId) : undefined;
  }

  private calculateSetupTime(serviceType: string, tier: string): string {
    const setupTimes = {
      'Warehouse Storage': {
        premium: '1-2 days',
        standard: '3-5 days',
        budget: '1-2 weeks',
      },
      'Cross Docking': {
        premium: '2-3 days',
        standard: '5-7 days',
        budget: '2-3 weeks',
      },
      'Pick & Pack': {
        premium: '3-5 days',
        standard: '1-2 weeks',
        budget: '2-4 weeks',
      },
      'Inventory Management': {
        premium: '1-2 weeks',
        standard: '2-4 weeks',
        budget: '4-6 weeks',
      },
      'Distribution Center': {
        premium: '2-3 weeks',
        standard: '4-6 weeks',
        budget: '6-8 weeks',
      },
      'Fulfillment Services': {
        premium: '1-2 weeks',
        standard: '3-4 weeks',
        budget: '4-6 weeks',
      },
      '3PL Full Service': {
        premium: '4-6 weeks',
        standard: '6-8 weeks',
        budget: '8-12 weeks',
      },
    };

    return setupTimes[serviceType]?.[tier] || '2-4 weeks';
  }

  private calculateAvailability(
    warehouse: WarehouseLocation,
    request: WarehouseQuoteRequest
  ): string {
    const utilizationRate =
      1 - warehouse.capacity.availableSqFt / warehouse.capacity.totalSqFt;

    if (utilizationRate < 0.7) {
      return 'Immediate availability';
    } else if (utilizationRate < 0.85) {
      return 'Available within 1 week';
    } else {
      return 'Available within 2-3 weeks';
    }
  }

  private getServiceFeatures(serviceType: string, tier: string): string[] {
    const baseFeatures = {
      'Warehouse Storage': [
        'Secure storage',
        'Inventory tracking',
        'Climate control',
      ],
      'Cross Docking': [
        'Rapid processing',
        'Quality inspection',
        'Load consolidation',
      ],
      'Pick & Pack': [
        'Order fulfillment',
        'Custom packaging',
        'Shipping coordination',
      ],
      'Inventory Management': [
        'Real-time tracking',
        'Cycle counting',
        'Reporting',
      ],
      'Distribution Center': [
        'Multi-modal shipping',
        'Route optimization',
        'Load planning',
      ],
      'Fulfillment Services': [
        'E-commerce integration',
        'Returns processing',
        'Same-day shipping',
      ],
      '3PL Full Service': [
        'Complete logistics',
        'Supply chain optimization',
        'Performance analytics',
      ],
    };

    const premiumFeatures = {
      'Warehouse Storage': [
        'Advanced WMS',
        'Automated systems',
        'Dedicated account manager',
      ],
      'Cross Docking': [
        'Express processing',
        'Quality assurance',
        'Priority handling',
      ],
      'Pick & Pack': [
        'Same-day fulfillment',
        'Branded packaging',
        'Gift services',
      ],
      'Inventory Management': [
        'Predictive analytics',
        'Automated reordering',
        'Custom reporting',
      ],
      'Distribution Center': [
        'AI route optimization',
        'Dedicated fleet',
        'Express delivery',
      ],
      'Fulfillment Services': [
        '2-hour fulfillment',
        'Premium packaging',
        'White-glove service',
      ],
      '3PL Full Service': [
        'Strategic consulting',
        'Custom solutions',
        'Executive reporting',
      ],
    };

    const features = baseFeatures[serviceType] || [];
    if (tier === 'premium') {
      features.push(...(premiumFeatures[serviceType] || []));
    }

    return features;
  }

  private getAdditionalServices(
    serviceType: string,
    tier: string
  ): Array<{ service: string; rate: number; unit: string }> {
    const additionalServices = {
      'Warehouse Storage': [
        { service: 'Kitting & Assembly', rate: 2.5, unit: 'per item' },
        { service: 'Quality Inspection', rate: 1.25, unit: 'per pallet' },
        { service: 'Labeling Services', rate: 0.75, unit: 'per item' },
      ],
      'Cross Docking': [
        { service: 'Quality Control', rate: 5.0, unit: 'per pallet' },
        { service: 'Consolidation', rate: 15.0, unit: 'per shipment' },
        { service: 'Express Processing', rate: 25.0, unit: 'per pallet' },
      ],
      'Pick & Pack': [
        { service: 'Gift Wrapping', rate: 3.5, unit: 'per item' },
        { service: 'Kitting', rate: 2.25, unit: 'per kit' },
        { service: 'Custom Packaging', rate: 4.75, unit: 'per order' },
      ],
      '3PL Full Service': [
        { service: 'Strategic Consulting', rate: 250.0, unit: 'per hour' },
        { service: 'Custom Reporting', rate: 500.0, unit: 'monthly' },
        { service: 'Dedicated Account Manager', rate: 2500.0, unit: 'monthly' },
      ],
    };

    const services = additionalServices[serviceType] || [];
    const tierMultiplier =
      tier === 'premium' ? 1.3 : tier === 'standard' ? 1.0 : 0.7;

    return services.map((service) => ({
      ...service,
      rate: Math.round(service.rate * tierMultiplier),
    }));
  }

  // Public Methods
  getAllWarehouses(): WarehouseLocation[] {
    return Array.from(this.warehouses.values());
  }

  getWarehouse(id: string): WarehouseLocation | null {
    return this.warehouses.get(id) || null;
  }

  getAllServices(): WarehousingService[] {
    return Array.from(this.services.values());
  }

  getServicesByType(type: string): WarehousingService[] {
    return Array.from(this.services.values()).filter(
      (service) => service.type === type
    );
  }

  searchWarehouses(criteria: {
    location?: string;
    minCapacity?: number;
    requiredFeatures?: string[];
    certifications?: string[];
  }): WarehouseLocation[] {
    return Array.from(this.warehouses.values()).filter((warehouse) => {
      if (
        criteria.minCapacity &&
        warehouse.capacity.availableSqFt < criteria.minCapacity
      ) {
        return false;
      }

      if (criteria.requiredFeatures) {
        const hasAllFeatures = criteria.requiredFeatures.every((feature) =>
          warehouse.features.some((wf) =>
            wf.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) return false;
      }

      if (criteria.certifications) {
        const hasAllCerts = criteria.certifications.every((cert) =>
          warehouse.certifications.includes(cert)
        );
        if (!hasAllCerts) return false;
      }

      return true;
    });
  }

  // Analytics and Reporting
  getWarehouseUtilization(): Array<{
    warehouseId: string;
    name: string;
    utilization: number;
  }> {
    return Array.from(this.warehouses.values()).map((warehouse) => ({
      warehouseId: warehouse.id,
      name: warehouse.name,
      utilization: Math.round(
        ((warehouse.capacity.totalSqFt - warehouse.capacity.availableSqFt) /
          warehouse.capacity.totalSqFt) *
          100
      ),
    }));
  }

  getServicePricing(): Array<{ serviceType: string; pricing: any }> {
    return Array.from(this.services.values()).map((service) => ({
      serviceType: service.name,
      pricing: service.pricing,
    }));
  }
}

// Create singleton instance
export const warehousingService = new WarehousingService();
export default WarehousingService;
