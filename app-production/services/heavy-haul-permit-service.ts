// Heavy Haul Permit Service for FleetFlow
// Designed for cost-effective permit management with direct state integrations

export interface HeavyHaulLoad {
  id: string;
  dimensions: {
    length: number; // feet
    width: number; // feet
    height: number; // feet
    weight: number; // pounds
  };
  route: {
    origin: {
      city: string;
      state: string;
      coordinates: [number, number];
    };
    destination: {
      city: string;
      state: string;
      coordinates: [number, number];
    };
    waypoints?: Array<{
      city: string;
      state: string;
      coordinates: [number, number];
    }>;
  };
  equipment: {
    tractor: string;
    trailer: string;
    axleConfiguration: string;
  };
  cargo: {
    description: string;
    type: 'construction' | 'machinery' | 'prefab' | 'steel' | 'other';
  };
  timeline: {
    pickupDate: Date;
    deliveryDate: Date;
    travelDays: number;
  };
}

export interface PermitRequirement {
  state: string;
  permitType: 'oversize' | 'overweight' | 'both';
  cost: number;
  processingTime: string; // "2-3 business days"
  validityPeriod: string; // "30 days"
  restrictions: string[];
  requirements: {
    escort: boolean;
    pilotCar: boolean;
    timeRestrictions: string[];
    routeRestrictions: string[];
  };
  applicationUrl: string;
  contactInfo: {
    phone: string;
    email: string;
    office: string;
  };
}

export interface PermitApplication {
  id: string;
  loadId: string;
  state: string;
  permitType: string;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'denied' | 'expired';
  applicationDate: Date;
  approvalDate?: Date;
  expirationDate?: Date;
  permitNumber?: string;
  cost: number;
  documents: {
    application: string;
    approval?: string;
    route?: string;
    insurance?: string;
  };
  notes: string[];
}

export class HeavyHaulPermitService {
  private readonly stateThresholds = {
    // Standard legal limits - anything above requires permits
    maxWidth: 8.5, // feet
    maxHeight: 13.5, // feet (varies by state)
    maxLength: 75, // feet (varies by state and trailer type)
    maxWeight: 80000, // pounds (80,000 lbs gross vehicle weight)
  };

  private readonly stateLimits: Record<string, {
    width: number;
    height: number;
    length: number;
    weight: number;
    office: string;
    phone: string;
  }> = {
    // State-specific legal limits and permit requirements
    'AL': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Alabama DOT', phone: '334-242-6311' },
    'AZ': { width: 8.5, height: 14.0, length: 75, weight: 80000, office: 'Arizona DOT', phone: '602-712-7355' },
    'CA': { width: 8.5, height: 14.0, length: 75, weight: 80000, office: 'Caltrans', phone: '916-654-2852' },
    'FL': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Florida DOT', phone: '850-414-4100' },
    'GA': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Georgia DOT', phone: '404-635-8000' },
    'IL': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Illinois DOT', phone: '217-782-7820' },
    'IN': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Indiana DOT', phone: '317-232-5533' },
    'MI': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Michigan DOT', phone: '517-373-2090' },
    'NC': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'NC DOT', phone: '919-707-2600' },
    'OH': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Ohio DOT', phone: '614-466-2335' },
    'PA': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'PennDOT', phone: '717-787-6853' },
    'TN': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Tennessee DOT', phone: '615-741-2848' },
    'TX': { width: 8.5, height: 14.0, length: 75, weight: 80000, office: 'TxDOT', phone: '512-416-2000' },
    'VA': { width: 8.5, height: 13.5, length: 75, weight: 80000, office: 'Virginia DOT', phone: '804-786-2701' },
    // Add more states as needed
  };

  private readonly permitCosts: Record<string, {
    oversize: number;
    overweight: number;
    both: number;
  }> = {
    // Estimated permit costs by state (subject to change)
    'AL': { oversize: 25, overweight: 30, both: 45 },
    'AZ': { oversize: 30, overweight: 35, both: 55 },
    'CA': { oversize: 45, overweight: 60, both: 85 },
    'FL': { oversize: 35, overweight: 40, both: 65 },
    'GA': { oversize: 20, overweight: 25, both: 40 },
    'IL': { oversize: 25, overweight: 30, both: 50 },
    'IN': { oversize: 20, overweight: 25, both: 40 },
    'MI': { oversize: 30, overweight: 35, both: 55 },
    'NC': { oversize: 25, overweight: 30, both: 50 },
    'OH': { oversize: 20, overweight: 25, both: 40 },
    'PA': { oversize: 35, overweight: 45, both: 70 },
    'TN': { oversize: 25, overweight: 30, both: 50 },
    'TX': { oversize: 40, overweight: 50, both: 75 },
    'VA': { oversize: 30, overweight: 35, both: 55 },
  };

  /**
   * Analyze load to determine if heavy haul permits are required
   */
  public analyzeLoad(load: HeavyHaulLoad): {
    requiresPermits: boolean;
    permitType: 'oversize' | 'overweight' | 'both' | 'none';
    affectedStates: string[];
    estimatedCost: number;
    timeline: string;
  } {
    const { dimensions } = load;
    const isOversize = dimensions.width > this.stateThresholds.maxWidth ||
                      dimensions.height > this.stateThresholds.maxHeight ||
                      dimensions.length > this.stateThresholds.maxLength;
    
    const isOverweight = dimensions.weight > this.stateThresholds.maxWeight;

    if (!isOversize && !isOverweight) {
      return {
        requiresPermits: false,
        permitType: 'none',
        affectedStates: [],
        estimatedCost: 0,
        timeline: 'No permits required'
      };
    }

    const permitType = isOversize && isOverweight ? 'both' : 
                      isOversize ? 'oversize' : 'overweight';

    const affectedStates = this.getAffectedStates(load.route);
    const estimatedCost = this.calculatePermitCosts(affectedStates, permitType);
    const timeline = this.estimateTimeline(affectedStates);

    return {
      requiresPermits: true,
      permitType,
      affectedStates,
      estimatedCost,
      timeline
    };
  }

  /**
   * Get detailed permit requirements for each state
   */
  public getPermitRequirements(states: string[], permitType: string): PermitRequirement[] {
    return states.map(state => {
      const limits = this.stateLimits[state];
      const costs = this.permitCosts[state];
      
      return {
        state,
        permitType: permitType as any,
        cost: costs?.[permitType as keyof typeof costs] || 50, // Default cost if not specified
        processingTime: '2-5 business days',
        validityPeriod: '30 days',
        restrictions: this.getStateRestrictions(state),
        requirements: {
          escort: permitType === 'both' || permitType === 'oversize',
          pilotCar: permitType === 'both',
          timeRestrictions: ['No travel during rush hours', 'No weekend travel'],
          routeRestrictions: ['No city centers', 'Designated truck routes only']
        },
        applicationUrl: `https://permits.${state.toLowerCase()}.gov/heavyhaul`,
        contactInfo: {
          phone: limits?.phone || '000-000-0000',
          email: `permits@${state.toLowerCase()}dot.gov`,
          office: limits?.office || `${state} Department of Transportation`
        }
      };
    });
  }

  /**
   * Create permit applications for all required states
   */
  public async createPermitApplications(
    load: HeavyHaulLoad, 
    requirements: PermitRequirement[]
  ): Promise<PermitApplication[]> {
    const applications: PermitApplication[] = [];

    for (const requirement of requirements) {
      const application: PermitApplication = {
        id: `permit-${load.id}-${requirement.state}-${Date.now()}`,
        loadId: load.id,
        state: requirement.state,
        permitType: requirement.permitType,
        status: 'draft',
        applicationDate: new Date(),
        cost: requirement.cost,
        documents: {
          application: await this.generateApplicationDocument(load, requirement),
        },
        notes: []
      };

      applications.push(application);
    }

    return applications;
  }

  /**
   * Submit permit application to state
   */
  public async submitPermitApplication(application: PermitApplication): Promise<{
    success: boolean;
    confirmationNumber?: string;
    estimatedApproval?: Date;
    message: string;
  }> {
    // This would integrate with actual state APIs where available
    // For now, simulate the submission process
    
    try {
      // Check if state has online portal integration
      const hasOnlinePortal = this.hasOnlinePortalIntegration(application.state);
      
      if (hasOnlinePortal) {
        // Submit via API integration
        const result = await this.submitViaStateAPI(application);
        
        application.status = 'submitted';
        application.notes.push(`Submitted via online portal at ${new Date().toISOString()}`);
        
        return {
          success: true,
          confirmationNumber: result.confirmationNumber,
          estimatedApproval: result.estimatedApproval,
          message: 'Application submitted successfully via online portal'
        };
      } else {
        // Manual submission required
        application.status = 'pending';
        application.notes.push(`Manual submission required - documents prepared at ${new Date().toISOString()}`);
        
        return {
          success: true,
          message: `Application documents prepared. Manual submission required to ${application.state} DOT.`
        };
      }
    } catch (error: any) {
      application.status = 'draft';
      application.notes.push(`Submission failed: ${error?.message || 'Unknown error'}`);
      
      return {
        success: false,
        message: `Failed to submit application: ${error?.message || 'Unknown error'}`
      };
    }
  }

  /**
   * Track permit application status
   */
  public async trackPermitStatus(application: PermitApplication): Promise<{
    status: string;
    lastUpdate: Date;
    estimatedApproval?: Date;
    notes: string[];
  }> {
    // This would check actual state systems for status updates
    // For now, simulate status tracking
    
    const daysSinceSubmission = Math.floor(
      (Date.now() - application.applicationDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Simulate permit processing
    if (daysSinceSubmission >= 3 && application.status === 'submitted') {
      application.status = 'approved';
      application.approvalDate = new Date();
      application.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      application.permitNumber = `${application.state}-${Date.now().toString().slice(-6)}`;
      application.notes.push(`Permit approved on ${new Date().toISOString()}`);
    }

    return {
      status: application.status,
      lastUpdate: new Date(),
      estimatedApproval: daysSinceSubmission < 3 ? 
        new Date(Date.now() + (3 - daysSinceSubmission) * 24 * 60 * 60 * 1000) : 
        application.approvalDate,
      notes: application.notes
    };
  }

  /**
   * Calculate total permit costs for all states
   */
  private calculatePermitCosts(states: string[], permitType: string): number {
    return states.reduce((total, state) => {
      const costs = this.permitCosts[state];
      return total + (costs?.[permitType as keyof typeof costs] || 50);
    }, 0);
  }

  /**
   * Get all states affected by the route
   */
  private getAffectedStates(route: HeavyHaulLoad['route']): string[] {
    // This would use actual routing service to determine states crossed
    // For now, return origin and destination states
    const states = new Set<string>();
    states.add(route.origin.state);
    states.add(route.destination.state);
    
    // Add waypoint states
    route.waypoints?.forEach(waypoint => {
      states.add(waypoint.state);
    });

    return Array.from(states);
  }

  /**
   * Estimate permit processing timeline
   */
  private estimateTimeline(states: string[]): string {
    const maxDays = Math.max(...states.map(state => 5)); // 5 days max per state
    return `${maxDays} business days`;
  }

  /**
   * Get state-specific restrictions
   */
  private getStateRestrictions(state: string): string[] {
    const commonRestrictions = [
      'No travel during peak hours (7-9 AM, 4-6 PM)',
      'Escort vehicle required for loads over 12\' wide',
      'Must follow designated truck routes'
    ];

    const stateSpecific: Record<string, string[]> = {
      'CA': ['No travel on weekends', 'Environmental restrictions apply'],
      'TX': ['Pilot car required for loads over 14\' wide'],
      'FL': ['Hurricane season restrictions (June-November)'],
    };

    return [...commonRestrictions, ...(stateSpecific[state] || [])];
  }

  /**
   * Check if state has online portal integration
   */
  private hasOnlinePortalIntegration(state: string): boolean {
    // States with known API integrations (expand as available)
    const integratedStates = ['TX', 'CA', 'FL', 'IL', 'OH'];
    return integratedStates.includes(state);
  }

  /**
   * Submit application via state API
   */
  private async submitViaStateAPI(application: PermitApplication): Promise<{
    confirmationNumber: string;
    estimatedApproval: Date;
  }> {
    // Simulate API call to state system
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      confirmationNumber: `${application.state}-${Date.now().toString().slice(-8)}`,
      estimatedApproval: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    };
  }

  /**
   * Generate permit application document
   */
  private async generateApplicationDocument(
    load: HeavyHaulLoad, 
    requirement: PermitRequirement
  ): Promise<string> {
    // This would generate actual permit application forms
    // For now, return a reference to the generated document
    return `permit-application-${load.id}-${requirement.state}.pdf`;
  }

  /**
   * Get permit renewal notifications
   */
  public getPermitRenewals(applications: PermitApplication[]): PermitApplication[] {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    return applications.filter(app => 
      app.status === 'approved' && 
      app.expirationDate && 
      app.expirationDate <= thirtyDaysFromNow
    );
  }

  /**
   * Get comprehensive permit summary for load
   */
  public getPermitSummary(load: HeavyHaulLoad, applications: PermitApplication[]): {
    totalCost: number;
    readyStates: string[];
    pendingStates: string[];
    timeToTravel: Date | null;
  } {
    const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);
    const approvedApps = applications.filter(app => app.status === 'approved');
    const pendingApps = applications.filter(app => ['draft', 'submitted', 'pending'].includes(app.status));
    
    const readyStates = approvedApps.map(app => app.state);
    const pendingStates = pendingApps.map(app => app.state);
    
    // Calculate earliest travel date (when all permits are approved)
    const timeToTravel = pendingApps.length === 0 ? new Date() : null;

    return {
      totalCost,
      readyStates,
      pendingStates,
      timeToTravel
    };
  }
}