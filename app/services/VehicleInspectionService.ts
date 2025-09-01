/**
 * 🚗 Vehicle Inspection Service
 * Comprehensive vehicle inspection workflows for FleetFlow
 * Integrates with existing NHTSA VIN verification and photo upload systems
 */

export interface InspectionItem {
  id: string;
  category: 'exterior' | 'interior' | 'mechanical' | 'safety' | 'documentation';
  item: string;
  description: string;
  required: boolean;
  status: 'pass' | 'fail' | 'na' | 'pending';
  notes?: string;
  photos?: string[];
  severity?: 'minor' | 'major' | 'critical';
  requiresPhoto: boolean;
}

export interface VehicleInspection {
  id: string;
  vehicleId: string;
  vehicleVin: string;
  driverId: string;
  inspectionType:
    | 'pre_trip'
    | 'post_trip'
    | 'damage_assessment'
    | 'maintenance'
    | 'dot_inspection';
  inspectionDate: Date;
  location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  items: InspectionItem[];
  overallStatus: 'pass' | 'fail' | 'conditional' | 'pending';
  inspectorSignature: string;
  supervisorApproval?: {
    approved: boolean;
    approvedBy: string;
    approvedAt: Date;
    notes?: string;
  };
  deficienciesFound: boolean;
  safeToOperate: boolean;
  nextInspectionDue?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InspectionDeficiency {
  id: string;
  inspectionId: string;
  itemId: string;
  severity: 'minor' | 'major' | 'critical';
  description: string;
  correctiveAction: string;
  repairRequired: boolean;
  outOfServiceRequired: boolean;
  estimatedCost?: number;
  photos: string[];
  status: 'open' | 'in_repair' | 'resolved' | 'deferred';
  resolvedAt?: Date;
  resolvedBy?: string;
}

export class VehicleInspectionService {
  private static inspections: Map<string, VehicleInspection> = new Map();
  private static deficiencies: Map<string, InspectionDeficiency> = new Map();

  /**
   * Get inspection checklist templates by type
   */
  static getInspectionTemplate(
    type: VehicleInspection['inspectionType']
  ): InspectionItem[] {
    const baseItems: InspectionItem[] = [];

    // Common items for all inspection types
    const commonItems = [
      // EXTERIOR INSPECTION
      {
        id: 'ext_001',
        category: 'exterior' as const,
        item: 'Front End Damage',
        description: 'Check for damage to front bumper, grille, headlights',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },
      {
        id: 'ext_002',
        category: 'exterior' as const,
        item: 'Side Damage Assessment',
        description: 'Inspect both sides for dents, scratches, mirror damage',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },
      {
        id: 'ext_003',
        category: 'exterior' as const,
        item: 'Rear End Damage',
        description: 'Check rear bumper, taillights, loading area',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },
      {
        id: 'ext_004',
        category: 'exterior' as const,
        item: 'Tire Condition',
        description: 'Check tread depth, sidewall damage, proper inflation',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'critical' as const,
      },
      {
        id: 'ext_005',
        category: 'exterior' as const,
        item: 'Light Functionality',
        description: 'Test headlights, taillights, turn signals, hazards',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'ext_006',
        category: 'exterior' as const,
        item: 'Mirror Condition',
        description: 'Check all mirrors for cracks, proper adjustment',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },

      // INTERIOR INSPECTION
      {
        id: 'int_001',
        category: 'interior' as const,
        item: 'Driver Seat Condition',
        description: 'Check seat adjustment, wear, safety belt',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'minor' as const,
      },
      {
        id: 'int_002',
        category: 'interior' as const,
        item: 'Dashboard Warning Lights',
        description: 'Check for active warning lights, gauge functionality',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },
      {
        id: 'int_003',
        category: 'interior' as const,
        item: 'Steering and Controls',
        description: 'Test steering, brakes, horn, windshield wipers',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'critical' as const,
      },
      {
        id: 'int_004',
        category: 'interior' as const,
        item: 'Cleanliness',
        description: 'Interior cleanliness and organization',
        required: false,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'minor' as const,
      },

      // MECHANICAL INSPECTION
      {
        id: 'mech_001',
        category: 'mechanical' as const,
        item: 'Engine Oil Level',
        description: 'Check oil level and condition',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'mech_002',
        category: 'mechanical' as const,
        item: 'Coolant Level',
        description: 'Check coolant level and condition',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'mech_003',
        category: 'mechanical' as const,
        item: 'Brake System',
        description: 'Check brake fluid, brake function, air pressure',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'critical' as const,
      },
      {
        id: 'mech_004',
        category: 'mechanical' as const,
        item: 'Battery Condition',
        description: 'Check battery terminals, charge level, secure mounting',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'mech_005',
        category: 'mechanical' as const,
        item: 'Belts and Hoses',
        description: 'Inspect for cracks, fraying, proper tension',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },

      // SAFETY EQUIPMENT
      {
        id: 'safe_001',
        category: 'safety' as const,
        item: 'Emergency Triangles',
        description: 'Verify presence and condition of reflective triangles',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'safe_002',
        category: 'safety' as const,
        item: 'Fire Extinguisher',
        description: 'Check presence, charge level, expiration date',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'major' as const,
      },
      {
        id: 'safe_003',
        category: 'safety' as const,
        item: 'First Aid Kit',
        description: 'Verify presence and basic supplies',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'minor' as const,
      },
      {
        id: 'safe_004',
        category: 'safety' as const,
        item: 'Load Securement',
        description: 'Check straps, chains, binders, tarps',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'critical' as const,
      },

      // DOCUMENTATION
      {
        id: 'doc_001',
        category: 'documentation' as const,
        item: 'Registration',
        description: 'Current vehicle registration present',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'doc_002',
        category: 'documentation' as const,
        item: 'Insurance Card',
        description: 'Current insurance verification present',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'major' as const,
      },
      {
        id: 'doc_003',
        category: 'documentation' as const,
        item: 'Driver License',
        description: 'Valid CDL with proper endorsements',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'critical' as const,
      },
      {
        id: 'doc_004',
        category: 'documentation' as const,
        item: 'Medical Certificate',
        description: 'Current DOT medical certificate',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'critical' as const,
      },
    ];

    // Add type-specific items
    if (type === 'pre_trip') {
      baseItems.push(...commonItems);
      baseItems.push({
        id: 'pre_001',
        category: 'safety' as const,
        item: 'Route Planning',
        description: 'Route planned, weather checked, fuel calculated',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'minor' as const,
      });
    }

    if (type === 'post_trip') {
      baseItems.push(...commonItems);
      baseItems.push({
        id: 'post_001',
        category: 'mechanical' as const,
        item: 'Mileage Recording',
        description: 'Record ending mileage and fuel level',
        required: true,
        status: 'pending' as const,
        requiresPhoto: false,
        severity: 'minor' as const,
      });
    }

    if (type === 'damage_assessment') {
      // Focus on damage documentation
      baseItems.push(
        ...commonItems.filter(
          (item) => item.category === 'exterior' || item.requiresPhoto
        )
      );
      baseItems.push({
        id: 'dmg_001',
        category: 'exterior' as const,
        item: 'Incident Documentation',
        description: 'Document all visible damage with detailed photos',
        required: true,
        status: 'pending' as const,
        requiresPhoto: true,
        severity: 'critical' as const,
      });
    }

    return baseItems;
  }

  /**
   * Create a new vehicle inspection
   */
  static async createInspection(
    vehicleId: string,
    vehicleVin: string,
    driverId: string,
    type: VehicleInspection['inspectionType'],
    location: { address: string; coordinates?: { lat: number; lng: number } }
  ): Promise<VehicleInspection> {
    const inspectionId = `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const inspection: VehicleInspection = {
      id: inspectionId,
      vehicleId,
      vehicleVin,
      driverId,
      inspectionType: type,
      inspectionDate: new Date(),
      location,
      items: this.getInspectionTemplate(type),
      overallStatus: 'pending',
      inspectorSignature: '',
      deficienciesFound: false,
      safeToOperate: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inspections.set(inspectionId, inspection);

    console.info(
      `🔍 Created ${type} inspection ${inspectionId} for vehicle ${vehicleId}`
    );
    return inspection;
  }

  /**
   * Update inspection item
   */
  static async updateInspectionItem(
    inspectionId: string,
    itemId: string,
    updates: Partial<InspectionItem>
  ): Promise<VehicleInspection | null> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) return null;

    const itemIndex = inspection.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return null;

    // Update the item
    inspection.items[itemIndex] = {
      ...inspection.items[itemIndex],
      ...updates,
    };

    // If item failed, create deficiency
    if (updates.status === 'fail' && updates.severity) {
      await this.createDeficiency(
        inspectionId,
        itemId,
        updates.severity,
        updates.notes || ''
      );
    }

    // Recalculate overall status
    this.recalculateInspectionStatus(inspection);

    inspection.updatedAt = new Date();
    this.inspections.set(inspectionId, inspection);

    return inspection;
  }

  /**
   * Complete inspection with signature
   */
  static async completeInspection(
    inspectionId: string,
    inspectorSignature: string
  ): Promise<VehicleInspection | null> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) return null;

    // Validate all required items are completed
    const incompleteRequired = inspection.items.filter(
      (item) => item.required && item.status === 'pending'
    );

    if (incompleteRequired.length > 0) {
      throw new Error(
        `Cannot complete inspection: ${incompleteRequired.length} required items pending`
      );
    }

    // Validate photo requirements
    const photoRequiredItems = inspection.items.filter(
      (item) => item.requiresPhoto && (!item.photos || item.photos.length === 0)
    );

    if (photoRequiredItems.length > 0) {
      throw new Error(
        `Cannot complete inspection: ${photoRequiredItems.length} items require photos`
      );
    }

    inspection.inspectorSignature = inspectorSignature;
    inspection.completedAt = new Date();
    inspection.updatedAt = new Date();

    // Final status calculation
    this.recalculateInspectionStatus(inspection);

    this.inspections.set(inspectionId, inspection);

    console.info(
      `✅ Completed inspection ${inspectionId} with status: ${inspection.overallStatus}`
    );
    return inspection;
  }

  /**
   * Create deficiency record
   */
  private static async createDeficiency(
    inspectionId: string,
    itemId: string,
    severity: 'minor' | 'major' | 'critical',
    description: string
  ): Promise<InspectionDeficiency> {
    const deficiencyId = `DEF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const deficiency: InspectionDeficiency = {
      id: deficiencyId,
      inspectionId,
      itemId,
      severity,
      description,
      correctiveAction: this.getCorrectiveAction(itemId, severity),
      repairRequired: severity !== 'minor',
      outOfServiceRequired: severity === 'critical',
      photos: [],
      status: 'open',
    };

    this.deficiencies.set(deficiencyId, deficiency);

    // Update inspection deficiency flag
    const inspection = this.inspections.get(inspectionId);
    if (inspection) {
      inspection.deficienciesFound = true;
      if (severity === 'critical') {
        inspection.safeToOperate = false;
      }
    }

    return deficiency;
  }

  /**
   * Get corrective action recommendation
   */
  private static getCorrectiveAction(
    itemId: string,
    severity: 'minor' | 'major' | 'critical'
  ): string {
    const actions: Record<string, string> = {
      ext_001: 'Repair front end damage before operation',
      ext_004: 'Replace or repair tires immediately - CRITICAL SAFETY ISSUE',
      mech_003: 'Service brake system immediately - DO NOT OPERATE',
      safe_004: 'Secure load properly before departure',
      doc_003: 'Obtain valid CDL before operating commercial vehicle',
    };

    const defaultActions = {
      minor: 'Schedule maintenance at next service interval',
      major: 'Repair before next trip',
      critical: 'DO NOT OPERATE - Immediate repair required',
    };

    return actions[itemId] || defaultActions[severity];
  }

  /**
   * Recalculate inspection overall status
   */
  private static recalculateInspectionStatus(
    inspection: VehicleInspection
  ): void {
    const items = inspection.items;
    const failedItems = items.filter((item) => item.status === 'fail');
    const criticalFailures = failedItems.filter(
      (item) => item.severity === 'critical'
    );
    const majorFailures = failedItems.filter(
      (item) => item.severity === 'major'
    );

    if (criticalFailures.length > 0) {
      inspection.overallStatus = 'fail';
      inspection.safeToOperate = false;
    } else if (majorFailures.length > 0) {
      inspection.overallStatus = 'conditional';
      inspection.safeToOperate = true; // Can operate with conditions
    } else if (failedItems.length > 0) {
      inspection.overallStatus = 'conditional';
      inspection.safeToOperate = true;
    } else {
      const allCompleted = items.every(
        (item) => !item.required || item.status !== 'pending'
      );
      inspection.overallStatus = allCompleted ? 'pass' : 'pending';
      inspection.safeToOperate = true;
    }
  }

  /**
   * Get inspections for vehicle
   */
  static getVehicleInspections(vehicleId: string): VehicleInspection[] {
    return Array.from(this.inspections.values())
      .filter((inspection) => inspection.vehicleId === vehicleId)
      .sort((a, b) => b.inspectionDate.getTime() - a.inspectionDate.getTime());
  }

  /**
   * Get inspections for driver
   */
  static getDriverInspections(driverId: string): VehicleInspection[] {
    return Array.from(this.inspections.values())
      .filter((inspection) => inspection.driverId === driverId)
      .sort((a, b) => b.inspectionDate.getTime() - a.inspectionDate.getTime());
  }

  /**
   * Get inspection by ID
   */
  static getInspection(inspectionId: string): VehicleInspection | null {
    return this.inspections.get(inspectionId) || null;
  }

  /**
   * Get open deficiencies
   */
  static getOpenDeficiencies(): InspectionDeficiency[] {
    return Array.from(this.deficiencies.values())
      .filter((def) => def.status === 'open')
      .sort((a, b) => {
        // Sort by severity: critical, major, minor
        const severityOrder = { critical: 3, major: 2, minor: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
  }

  /**
   * Check if vehicle is safe to operate
   */
  static isVehicleSafeToOperate(vehicleId: string): boolean {
    const recentInspections = this.getVehicleInspections(vehicleId).filter(
      (inspection) => {
        const daysSince =
          (Date.now() - inspection.inspectionDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return daysSince <= 1; // Within last 24 hours
      }
    );

    if (recentInspections.length === 0) {
      return false; // No recent inspection
    }

    const latestInspection = recentInspections[0];
    return (
      latestInspection.safeToOperate &&
      latestInspection.overallStatus !== 'fail'
    );
  }

  /**
   * Get inspection statistics
   */
  static getInspectionStats(): {
    total: number;
    passed: number;
    failed: number;
    conditional: number;
    pending: number;
    deficiencies: number;
    outOfService: number;
  } {
    const inspections = Array.from(this.inspections.values());
    const deficiencies = Array.from(this.deficiencies.values());

    return {
      total: inspections.length,
      passed: inspections.filter((i) => i.overallStatus === 'pass').length,
      failed: inspections.filter((i) => i.overallStatus === 'fail').length,
      conditional: inspections.filter((i) => i.overallStatus === 'conditional')
        .length,
      pending: inspections.filter((i) => i.overallStatus === 'pending').length,
      deficiencies: deficiencies.filter((d) => d.status === 'open').length,
      outOfService: inspections.filter((i) => !i.safeToOperate).length,
    };
  }

  /**
   * Initialize with demo data
   */
  static initializeDemoData(): void {
    if (this.inspections.size > 0) {
      return; // Already initialized
    }
    // Create demo inspections for testing
    const demoInspections = [
      {
        vehicleId: 'VEH-001',
        vehicleVin: '1HGCM82633A123456',
        driverId: 'DRV-001',
        type: 'pre_trip' as const,
        location: { address: '123 Main St, Atlanta, GA' },
      },
      {
        vehicleId: 'VEH-002',
        vehicleVin: '1FTFW1ET5DFC12345',
        driverId: 'DRV-002',
        type: 'post_trip' as const,
        location: { address: '456 Oak Ave, Miami, FL' },
      },
    ];

    demoInspections.forEach(async (demo) => {
      const inspection = await this.createInspection(
        demo.vehicleId,
        demo.vehicleVin,
        demo.driverId,
        demo.type,
        demo.location
      );

      // Complete some items for demo
      const items = inspection.items.slice(0, 3);
      for (const item of items) {
        await this.updateInspectionItem(inspection.id, item.id, {
          status: Math.random() > 0.8 ? 'fail' : 'pass',
          notes: 'Demo inspection item completed',
        });
      }
    });

    console.info('✅ Vehicle inspection demo data initialized');
  }
}
