/**
 * FleetFlow Integrated System Orchestrator
 * Connects route generation with optimization, planning, tracking, and notifications
 * 
 * System Flow Integration:
 * 1. Route Generation → Schedule Management → Live Tracking → SMS Notifications
 * 2. Route Optimization → Load Distribution → Driver Assignment → Real-time Updates
 * 3. AI Dispatch → Route Planning → Document Flow → Customer Notifications
 */

import { AIAutomationEngine } from './automation';
import { RouteOptimizationService } from './route-optimization';
import { AIDispatcher } from './ai-dispatcher';
import { LoadDistributionService } from './load-distribution';
import { SchedulingService } from '../scheduling/service';
import { DocumentFlowService } from './document-flow-service';
import { smsService } from './sms';
import { sendInvoiceEmail } from './email';
import { EnhancedCarrierService } from './enhanced-carrier-service';

// Heavy Haul Permit Service interfaces (avoiding import conflicts)
export interface HeavyHaulLoadDataData {
  id: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  route: {
    origin: { city: string; state: string; coordinates: [number, number] };
    destination: { city: string; state: string; coordinates: [number, number] };
    waypoints?: Array<{ city: string; state: string; coordinates: [number, number] }>;
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

export interface HeavyHaulPermitApp {
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
import { 
  generateUniversalPickupDocument, 
  generateClaudeStyleRouteDocument,
  generateSamsClubDeliveryDocument,
  generateManufacturingRouteDocument,
  generateAgriculturalRouteDocument
} from '../../src/route-generator/templates/route-generators.js';

export interface SystemIntegrationConfig {
  enableRealTimeTracking: boolean;
  enableSmartRouting: boolean;
  enableAutoNotifications: boolean;
  enableScheduleOptimization: boolean;
  enablePredictiveAnalytics: boolean;
  enableCarrierValidation: boolean;
  enableCarrierMonitoring: boolean;
}

export interface CarrierValidationResult {
  mcNumber: string;
  dotNumber?: string;
  companyName: string;
  status: 'valid' | 'invalid' | 'out_of_service' | 'suspended';
  validationScore: number;
  isValid: boolean;
  validationErrors: string[];
  fmcsaData: {
    operatingStatus: string;
    legalName: string;
    dbaName?: string;
    physicalAddress: string;
    phoneNumber: string;
    safetyRating?: string;
    insuranceRequired: string;
    insuranceOnFile: string;
    insuranceStatus: string;
    lastUpdated: string;
  };
  brokerSnapshotData?: {
    creditScore?: number;
    paymentHistory: string;
    riskLevel: 'low' | 'medium' | 'high';
    alerts: string[];
    lastMonitored: string;
  };
  validatedAt: string;
  monitoringActive: boolean;
  monitoringEnabled: boolean;
}

export interface IntegratedWorkflow {
  id: string;
  loadId: string;
  status: 'pending' | 'route_generated' | 'optimized' | 'scheduled' | 'dispatched' | 'in_transit' | 'delivered';
  routeDocument?: any;
  optimizedRoute?: any;
  schedule?: any;
  trackingData?: any;
  notifications: any[];
  created: Date;
  updated: Date;
}

export class FleetFlowSystemOrchestrator {
  private automation: AIAutomationEngine;
  private routeOptimizer: RouteOptimizationService;
  private aiDispatcher: AIDispatcher;
  private loadDistribution: LoadDistributionService;
  private scheduling: SchedulingService;
  private documentFlow: DocumentFlowService;
  private carrierService: EnhancedCarrierService;
  private heavyHaulPermitService: HeavyHaulPermitService;
  private workflows: Map<string, IntegratedWorkflow> = new Map();
  private validatedCarriers: Map<string, CarrierValidationResult> = new Map();
  private config: SystemIntegrationConfig;

  // Carrier validation and monitoring tracking
  private carrierValidationCache = new Map<string, CarrierValidationResult>();
  private carrierMonitoringInterval: NodeJS.Timeout | null = null;

  constructor(config: SystemIntegrationConfig = {
    enableRealTimeTracking: true,
    enableSmartRouting: true,
    enableAutoNotifications: true,
    enableScheduleOptimization: true,
    enablePredictiveAnalytics: true,
    enableCarrierValidation: true,
    enableCarrierMonitoring: true
  }) {
    this.automation = new AIAutomationEngine();
    this.routeOptimizer = new RouteOptimizationService();
    this.aiDispatcher = new AIDispatcher();
    this.loadDistribution = new LoadDistributionService({
      autoSendEnabled: true,
      maxDriversPerLoad: 5,
      radiusMiles: 250,
      equipmentMatching: true,
      priorityDriversFirst: true
    });
    this.scheduling = new SchedulingService();
    this.documentFlow = new DocumentFlowService();
    this.carrierService = new EnhancedCarrierService();
    this.heavyHaulPermitService = new HeavyHaulPermitService();
    this.config = config;

    console.log('🔗 FleetFlow System Orchestrator initialized');
  }

  /**
   * CORE INTEGRATION WORKFLOW
   * This is the main system flow that connects all components
   */
  async processLoad(loadData: any): Promise<IntegratedWorkflow> {
    const workflowId = `WF-${Date.now()}`;
    console.log(`🚀 Starting integrated workflow for load ${loadData.id}`);

    // Initialize workflow
    const workflow: IntegratedWorkflow = {
      id: workflowId,
      loadId: loadData.id,
      status: 'pending',
      notifications: [],
      created: new Date(),
      updated: new Date()
    };

    try {
      // STEP 1: Generate Route Document with Smart Template Selection
      workflow.routeDocument = await this.generateRouteDocument(loadData);
      workflow.status = 'route_generated';
      await this.updateWorkflow(workflow);

      // STEP 2: Optimize Route with AI
      if (this.config.enableSmartRouting) {
        workflow.optimizedRoute = await this.optimizeRoute(loadData, workflow.routeDocument);
        workflow.status = 'optimized';
        await this.updateWorkflow(workflow);
      }

      // STEP 3: Schedule with Driver/Vehicle Management
      if (this.config.enableScheduleOptimization) {
        workflow.schedule = await this.createOptimalSchedule(loadData, workflow.optimizedRoute);
        workflow.status = 'scheduled';
        await this.updateWorkflow(workflow);
      }

      // STEP 4: AI Dispatch and Load Distribution
      const dispatchResult = await this.executeAIDispatch(loadData, workflow);
      workflow.status = 'dispatched';
      await this.updateWorkflow(workflow);

      // STEP 5: Initialize Live Tracking
      if (this.config.enableRealTimeTracking) {
        workflow.trackingData = await this.initializeLiveTracking(loadData, workflow);
        workflow.status = 'in_transit';
        await this.updateWorkflow(workflow);
      }

      // STEP 6: Multi-Channel Notifications
      if (this.config.enableAutoNotifications) {
        await this.sendIntegratedNotifications(workflow);
      }

      console.log(`✅ Integrated workflow completed for load ${loadData.id}`);
      return workflow;

    } catch (error) {
      console.error(`❌ Workflow failed for load ${loadData.id}:`, error);
      workflow.status = 'pending';
      throw error;
    }
  }

  /**
   * STEP 1: Smart Route Document Generation
   * Uses AI to detect pickup location type and generate appropriate document
   */
  private async generateRouteDocument(loadData: any): Promise<any> {
    console.log('📋 Generating route document with smart template selection...');

    // Detect pickup location type using AI
    const locationType = await this.detectPickupLocationType(loadData.origin);
    
    let routeDocument;
    
    // Smart template selection based on location type
    switch (locationType) {
      case 'manufacturing':
        routeDocument = generateManufacturingRouteDocument({
          companyName: loadData.carrierName || 'FleetFlow Logistics',
          mcNumber: loadData.mcNumber || 'MC-123456',
          routeNumber: loadData.id,
          routeName: `${loadData.origin} → ${loadData.destination}`,
          totalMiles: loadData.distance || 0,
          totalAmount: loadData.rate || 0,
          pickupLocation: loadData.origin,
          pickupContact: loadData.pickupContact || 'Site Supervisor',
          pickupPhone: loadData.pickupPhone || '(555) 123-4567',
          specialInstructions: loadData.specialInstructions || 'Report to security first',
          deliveryStops: [{
            name: loadData.destination,
            address: loadData.destination,
            time: loadData.deliveryTime || '10:00 AM',
            items: loadData.commodity || 'General freight',
            contact: loadData.deliveryContact || 'Receiving Manager',
            phone: loadData.deliveryPhone || '(555) 987-6543'
          }],
          driverName: loadData.driverName || 'TBD',
          vehicleNumber: loadData.vehicleNumber || 'TBD'
        });
        break;

      case 'retail':
        routeDocument = generateSamsClubDeliveryDocument({
          companyName: loadData.carrierName || 'FleetFlow Logistics',
          mcNumber: loadData.mcNumber || 'MC-123456',
          routeNumber: loadData.id,
          routeName: `${loadData.origin} → ${loadData.destination}`,
          totalMiles: loadData.distance || 0,
          totalAmount: loadData.rate || 0,
          pickupLocation: loadData.origin,
          pickupContact: loadData.pickupContact || 'Store Manager',
          pickupPhone: loadData.pickupPhone || '(555) 123-4567',
          confirmationNumber: loadData.confirmationNumber || `SC-${loadData.id}`,
          deliveryStops: [{
            name: loadData.destination,
            address: loadData.destination,
            time: loadData.deliveryTime || '10:00 AM',
            items: loadData.commodity || 'Retail merchandise',
            contact: loadData.deliveryContact || 'Receiving Manager',
            phone: loadData.deliveryPhone || '(555) 987-6543'
          }],
          driverName: loadData.driverName || 'TBD',
          vehicleNumber: loadData.vehicleNumber || 'TBD'
        });
        break;

      case 'agricultural':
        routeDocument = generateAgriculturalRouteDocument({
          companyName: loadData.carrierName || 'FleetFlow Logistics',
          mcNumber: loadData.mcNumber || 'MC-123456',
          routeNumber: loadData.id,
          routeName: `${loadData.origin} → ${loadData.destination}`,
          totalMiles: loadData.distance || 0,
          totalAmount: loadData.rate || 0,
          pickupLocation: loadData.origin,
          pickupContact: loadData.pickupContact || 'Farm Manager',
          pickupPhone: loadData.pickupPhone || '(555) 123-4567',
          specialInstructions: loadData.specialInstructions || 'Use farm gate entrance',
          deliveryStops: [{
            name: loadData.destination,
            address: loadData.destination,
            time: loadData.deliveryTime || '10:00 AM',
            items: loadData.commodity || 'Agricultural products',
            contact: loadData.deliveryContact || 'Receiving Manager',
            phone: loadData.deliveryPhone || '(555) 987-6543'
          }],
          driverName: loadData.driverName || 'TBD',
          vehicleNumber: loadData.vehicleNumber || 'TBD'
        });
        break;

      default:
        // Universal template for unknown location types
        routeDocument = generateUniversalPickupDocument({
          companyName: loadData.carrierName || 'FleetFlow Logistics',
          mcNumber: loadData.mcNumber || 'MC-123456',
          routeNumber: loadData.id,
          routeName: `${loadData.origin} → ${loadData.destination}`,
          totalMiles: loadData.distance || 0,
          totalAmount: loadData.rate || 0,
          pickupLocation: loadData.origin,
          pickupContact: loadData.pickupContact || 'Site Contact',
          pickupPhone: loadData.pickupPhone || '(555) 123-4567',
          deliveryStops: [{
            name: loadData.destination,
            address: loadData.destination,
            time: loadData.deliveryTime || '10:00 AM',
            items: loadData.commodity || 'General freight',
            contact: loadData.deliveryContact || 'Receiving Manager',
            phone: loadData.deliveryPhone || '(555) 987-6543'
          }],
          driverName: loadData.driverName || 'TBD',
          vehicleNumber: loadData.vehicleNumber || 'TBD'
        });
    }

    console.log(`✅ Route document generated using ${locationType} template`);
    return {
      document: routeDocument,
      locationType,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * STEP 2: AI Route Optimization
   * Integrates with route optimization service for efficient routing
   */
  private async optimizeRoute(loadData: any, routeDocument: any): Promise<any> {
    console.log('🗺️ Optimizing route with AI...');

    const optimizationRequest = {
      vehicles: [{
        id: loadData.vehicleId || 'V001',
        type: 'truck' as const,
        capacity: loadData.capacity || 80000,
        location: loadData.origin,
        driver: loadData.driverName || 'TBD',
        fuelType: 'diesel' as const,
        mpg: 6.5,
        maxDrivingHours: 11
      }],
      stops: [
        {
          id: 'pickup',
          address: loadData.origin,
          type: 'pickup' as const,
          timeWindow: {
            start: loadData.pickupTimeStart || '08:00',
            end: loadData.pickupTimeEnd || '10:00'
          },
          serviceTime: 30,
          weight: loadData.weight || 0,
          priority: 'high' as const
        },
        {
          id: 'delivery',
          address: loadData.destination,
          type: 'delivery' as const,
          timeWindow: {
            start: loadData.deliveryTimeStart || '14:00',
            end: loadData.deliveryTimeEnd || '16:00'
          },
          serviceTime: 30,
          weight: loadData.weight || 0,
          priority: 'high' as const
        }
      ],
      constraints: {
        maxRouteTime: 14,
        maxRouteDistance: 1000,
        allowOvertimeDrivers: false
      }
    };

    const optimizedRoutes = await this.routeOptimizer.optimizeRoutes(optimizationRequest);
    
    console.log('✅ Route optimization completed');
    return {
      optimizedRoute: optimizedRoutes[0],
      optimizationScore: optimizedRoutes[0]?.efficiency || 85,
      estimatedSavings: '$125',
      optimizedAt: new Date().toISOString()
    };
  }

  /**
   * STEP 3: Intelligent Schedule Management
   * Creates optimal schedules considering driver availability and HOS
   */
  private async createOptimalSchedule(loadData: any, optimizedRoute: any): Promise<any> {
    console.log('📅 Creating optimal schedule...');

    const scheduleData = {
      title: `Load ${loadData.id} - ${loadData.origin} → ${loadData.destination}`,
      startDate: loadData.pickupDate || new Date().toISOString().split('T')[0],
      endDate: loadData.deliveryDate || new Date().toISOString().split('T')[0],
      startTime: loadData.pickupTime || '08:00',
      endTime: loadData.deliveryTime || '16:00',
      scheduleType: 'Delivery' as const,
      priority: (loadData.priority as 'Low' | 'Medium' | 'High' | 'Urgent') || 'Medium',
      driverId: loadData.driverId,
      vehicleId: loadData.vehicleId,
      origin: loadData.origin,
      destination: loadData.destination,
      estimatedDistance: optimizedRoute?.optimizedRoute?.totalDistance || loadData.distance,
      estimatedDuration: optimizedRoute?.optimizedRoute?.totalDuration || 480,
      specialRequirements: loadData.specialRequirements || []
    };

    const scheduleResult = await this.scheduling.createSchedule(scheduleData);
    
    console.log('✅ Schedule created with conflict detection');
    return {
      schedule: scheduleResult.schedule,
      conflicts: scheduleResult.conflicts || [],
      scheduledAt: new Date().toISOString()
    };
  }

  /**
   * STEP 4: AI Dispatch and Load Distribution
   * Uses AI to match loads with optimal carriers/drivers
   */
  private async executeAIDispatch(loadData: any, workflow: IntegratedWorkflow): Promise<any> {
    console.log('🤖 Executing AI dispatch...');

    // Mock carrier data for dispatch matching
    const availableCarriers = [
      {
        id: 'C001',
        name: loadData.carrierName || 'Elite Transport',
        currentLocation: loadData.origin,
        capacity: 80000,
        specializations: ['general_freight'],
        performanceScore: 95,
        rateHistory: [2.50, 2.45, 2.55],
        availability: {
          earliestPickup: new Date().toISOString(),
          preferredLanes: [loadData.origin]
        },
        equipmentType: 'dry_van',
        safetyRating: 95,
        onTimePercentage: 94,
        customerSatisfaction: 4.8,
        experienceScore: 92,
        reliability: 96
      }
    ];

    const dispatchRecommendation = await this.aiDispatcher.matchLoadToCarrier(loadData, availableCarriers);
    
    // Distribute to available drivers
    const distributionResult = await this.loadDistribution.distributeLoad({
      id: loadData.id,
      origin: loadData.origin,
      destination: loadData.destination,
      rate: loadData.rate,
      weight: loadData.weight,
      equipment: loadData.equipment || 'Dry Van',
      pickupDate: loadData.pickupDate,
      deliveryDate: loadData.deliveryDate,
      commodity: loadData.commodity,
      specialInstructions: loadData.specialInstructions
    });

    console.log('✅ AI dispatch completed');
    return {
      recommendation: dispatchRecommendation,
      distribution: distributionResult,
      dispatchedAt: new Date().toISOString()
    };
  }

  /**
   * STEP 5: Live Tracking Initialization
   * Sets up real-time GPS tracking for the load
   */
  private async initializeLiveTracking(loadData: any, workflow: IntegratedWorkflow): Promise<any> {
    console.log('🛰️ Initializing live tracking...');

    const trackingData = {
      loadId: loadData.id,
      vehicleId: loadData.vehicleId || 'V001',
      driverId: loadData.driverId || 'D001',
      currentLocation: {
        lat: 39.7392,
        lng: -104.9903,
        address: loadData.origin,
        timestamp: new Date().toISOString()
      },
      status: 'en_route_to_pickup',
      estimatedArrival: {
        pickup: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        delivery: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      },
      route: {
        planned: workflow.optimizedRoute?.optimizedRoute?.stops || [],
        traveled: []
      },
      notifications: {
        geofencing: true,
        delays: true,
        arrivals: true,
        departures: true
      }
    };

    // In production, this would connect to actual GPS/ELD systems
    console.log('✅ Live tracking initialized');
    return {
      tracking: trackingData,
      trackingUrl: `https://track.fleetflow.com/load/${loadData.id}`,
      initializedAt: new Date().toISOString()
    };
  }

  /**
   * STEP 6: Multi-Channel Integrated Notifications
   * Sends comprehensive notifications to all stakeholders
   */
  private async sendIntegratedNotifications(workflow: IntegratedWorkflow): Promise<void> {
    console.log('📧 Sending integrated notifications...');

    const loadId = workflow.loadId;
    const routeDoc = workflow.routeDocument?.document || 'Route document generated';
    const trackingUrl = workflow.trackingData?.trackingUrl || '#';

    // 1. Driver Notifications (SMS + Email)
    const driverNotification = {
      sms: `📋 New load assigned: ${loadId}. Route document ready! Track at: ${trackingUrl}`,
      email: {
        subject: `Route Document: Load ${loadId}`,
        body: `Your route document is ready!\n\n${routeDoc}\n\nLive tracking: ${trackingUrl}`
      }
    };

    // 2. Carrier Notifications
    const carrierNotification = {
      sms: `✅ Load ${loadId} dispatched successfully. Driver assigned. Tracking active.`,
      email: {
        subject: `Load Confirmation: ${loadId}`,
        body: `Load has been successfully dispatched with optimized routing and live tracking enabled.`
      }
    };

    // 3. Customer Notifications
    const customerNotification = {
      sms: `📦 Your shipment ${loadId} is in transit. Track progress at: ${trackingUrl}`,
      email: {
        subject: `Shipment Update: ${loadId} In Transit`,
        body: `Your shipment is now in transit with real-time tracking available.`
      }
    };

    // 4. Dispatch Team Notifications
    const dispatchNotification = {
      email: {
        subject: `Workflow Complete: Load ${loadId}`,
        body: `Integrated workflow completed:\n✅ Route optimized\n✅ Schedule created\n✅ Driver assigned\n✅ Tracking active\n\nOptimization Score: ${workflow.optimizedRoute?.optimizationScore || 'N/A'}%`
      }
    };

    // Send notifications
    try {
      // Mock notification sending (in production, these would use actual SMS/email services)
      console.log('📱 Driver SMS:', driverNotification.sms);
      console.log('📧 Driver Email:', driverNotification.email.subject);
      console.log('📱 Carrier SMS:', carrierNotification.sms);
      console.log('📧 Customer Email:', customerNotification.email.subject);
      console.log('📧 Dispatch Email:', dispatchNotification.email.subject);

      workflow.notifications.push(
        { type: 'driver_sms', sent: new Date(), status: 'delivered' },
        { type: 'driver_email', sent: new Date(), status: 'delivered' },
        { type: 'carrier_sms', sent: new Date(), status: 'delivered' },
        { type: 'customer_email', sent: new Date(), status: 'delivered' },
        { type: 'dispatch_email', sent: new Date(), status: 'delivered' }
      );

      console.log('✅ All notifications sent successfully');
    } catch (error) {
      console.error('❌ Notification sending failed:', error);
    }
  }

  /**
   * AI-powered pickup location type detection
   */
  private async detectPickupLocationType(location: string): Promise<string> {
    // Simple keyword detection - in production would use ML/AI
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('steel') || locationLower.includes('manufacturing') || 
        locationLower.includes('plant') || locationLower.includes('factory')) {
      return 'manufacturing';
    }
    
    if (locationLower.includes('sam\'s club') || locationLower.includes('walmart') || 
        locationLower.includes('costco') || locationLower.includes('store')) {
      return 'retail';
    }
    
    if (locationLower.includes('farm') || locationLower.includes('agricultural') || 
        locationLower.includes('grain') || locationLower.includes('ranch')) {
      return 'agricultural';
    }
    
    if (locationLower.includes('port') || locationLower.includes('terminal') || 
        locationLower.includes('dock')) {
      return 'port';
    }

    return 'general';
  }

  /**
   * Update workflow status and trigger real-time updates
   */
  private async updateWorkflow(workflow: IntegratedWorkflow): Promise<void> {
    workflow.updated = new Date();
    this.workflows.set(workflow.id, workflow);
    
    // In production, this would trigger WebSocket updates to the UI
    console.log(`🔄 Workflow ${workflow.id} updated - Status: ${workflow.status}`);
  }

  /**
   * Get workflow status and details
   */
  public getWorkflow(workflowId: string): IntegratedWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all active workflows
   */
  public getAllWorkflows(): IntegratedWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Start the system orchestrator (activates all automation)
   */
  public start(): void {
    console.log('🚀 Starting FleetFlow System Orchestrator...');
    this.automation.start();
    console.log('✅ System orchestrator active - All integrations online');
  }

  /**
   * Stop the system orchestrator
   */
  public stop(): void {
    console.log('🛑 Stopping FleetFlow System Orchestrator...');
    this.automation.stop();
    console.log('⏹️ System orchestrator stopped');
  }

  /**
   * System health check
   */
  public async getSystemHealth(): Promise<any> {
    return {
      orchestrator: 'online',
      automation: this.automation ? 'active' : 'inactive',
      routeOptimization: 'online',
      aiDispatch: 'online',
      loadDistribution: 'online',
      scheduling: 'online',
      documentFlow: 'online',
      carrierValidation: this.config.enableCarrierValidation ? 'enabled' : 'disabled',
      carrierMonitoring: this.config.enableCarrierMonitoring ? 'enabled' : 'disabled',
      tracking: this.config.enableRealTimeTracking ? 'enabled' : 'disabled',
      notifications: this.config.enableAutoNotifications ? 'enabled' : 'disabled',
      activeWorkflows: this.workflows.size,
      validatedCarriers: this.validatedCarriers.size,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * CARRIER VALIDATION & MONITORING INTEGRATION
   * Validates carriers when uploaded to system and enables ongoing monitoring
   */

  /**
   * Validate and add new carrier to the system
   * Called when carriers are uploaded/registered
   */
  async validateAndAddCarrier(mcNumber: string, carrierData?: any): Promise<CarrierValidationResult> {
    console.log(`🛡️ Validating new carrier: ${mcNumber}`);

    const validationResult: CarrierValidationResult = {
      mcNumber,
      dotNumber: carrierData?.dotNumber,
      companyName: carrierData?.companyName || 'Unknown',
      status: 'invalid',
      validationScore: 0,
      isValid: false,
      validationErrors: [],
      fmcsaData: {
        operatingStatus: 'Unknown',
        legalName: 'Unknown',
        physicalAddress: 'Unknown',
        phoneNumber: 'Unknown',
        insuranceRequired: 'Unknown',
        insuranceOnFile: 'Unknown',
        insuranceStatus: 'Unknown',
        lastUpdated: new Date().toISOString()
      },
      validatedAt: new Date().toISOString(),
      monitoringActive: false,
      monitoringEnabled: false
    };

    try {
      // STEP 1: FMCSA Validation (Primary validation when carrier is uploaded)
      if (this.config.enableCarrierValidation) {
        console.log('📋 Running FMCSA validation...');
        
        const fmcsaData = await this.carrierService.verifyCarrierFMCSA(mcNumber);
        
        if (!fmcsaData) {
          validationResult.validationErrors.push('FMCSA validation failed - carrier not found');
          console.log('❌ FMCSA validation failed');
          return validationResult;
        }

        // Validate carrier status
        if (fmcsaData.operatingStatus === 'OUT_OF_SERVICE') {
          validationResult.validationErrors.push('Carrier is OUT OF SERVICE');
        }

        if (fmcsaData.safetyRating === 'UNSATISFACTORY') {
          validationResult.validationErrors.push('Carrier has UNSATISFACTORY safety rating');
        }

        if (fmcsaData.insuranceStatus === 'INACTIVE') {
          validationResult.validationErrors.push('Carrier insurance is INACTIVE');
        }

        // Store FMCSA data with proper mapping
        validationResult.fmcsaData = {
          operatingStatus: fmcsaData.operatingStatus || 'UNKNOWN',
          legalName: fmcsaData.companyName || 'Unknown',
          dbaName: fmcsaData.dbaName,
          physicalAddress: fmcsaData.physicalAddress || 'Unknown',
          phoneNumber: (fmcsaData as any).phoneNumber || 'Unknown',
          safetyRating: fmcsaData.safetyRating,
          insuranceRequired: 'YES',
          insuranceOnFile: (fmcsaData as any).insuranceOnFile || 'NO',
          insuranceStatus: (fmcsaData as any).insuranceOnFile === 'YES' ? 'ACTIVE' : 'INACTIVE',
          lastUpdated: new Date().toISOString()
        };
        
        if (validationResult.validationErrors.length === 0) {
          validationResult.isValid = true;
          console.log('✅ FMCSA validation passed');
        }
      }

      // STEP 2: Enable BrokerSnapshot Monitoring (For ongoing monitoring)
      if (this.config.enableCarrierMonitoring && validationResult.isValid) {
        console.log('📊 Enabling BrokerSnapshot monitoring...');
        
        const monitoringResult = await this.carrierService.enableCarrierTracking(mcNumber);
        
        if (monitoringResult.success) {
          validationResult.monitoringEnabled = true;
          console.log('✅ BrokerSnapshot monitoring enabled');
        } else {
          console.log('⚠️ BrokerSnapshot monitoring setup failed:', monitoringResult.message);
        }
      }

      // Store validated carrier
      this.validatedCarriers.set(mcNumber, validationResult);

      // Send validation notification
      await this.sendCarrierValidationNotification(validationResult);

      console.log(`✅ Carrier validation completed for ${mcNumber}: ${validationResult.isValid ? 'VALID' : 'INVALID'}`);
      return validationResult;

    } catch (error) {
      console.error(`❌ Carrier validation error for ${mcNumber}:`, error);
      validationResult.validationErrors.push(`Validation system error: ${error}`);
      return validationResult;
    }
  }

  /**
   * Monitor existing carriers using BrokerSnapshot
   * Called periodically for ongoing carrier monitoring
   */
  async monitorCarriers(): Promise<void> {
    console.log('📊 Running carrier monitoring checks...');

    const validatedCarriers = Array.from(this.validatedCarriers.values())
      .filter(carrier => carrier.isValid && carrier.monitoringEnabled);

    for (const carrier of validatedCarriers) {
      try {
        // Get updated carrier data from BrokerSnapshot
        const updatedData = await this.carrierService.getCarrierBrokerSnapshot(carrier.mcNumber);
        
        if (updatedData) {
          // Check for significant changes
          const alerts = this.analyzeCarrierChanges(carrier, updatedData);
          
          if (alerts.length > 0) {
            await this.sendCarrierAlerts(carrier, alerts);
          }
        }

        // Get real-time location if tracking enabled
        const locationData = await this.carrierService.getCarrierLocation(carrier.mcNumber);
        if (locationData.success) {
          console.log(`📍 Carrier ${carrier.mcNumber} location updated`);
        }

      } catch (error) {
        console.error(`❌ Monitoring error for carrier ${carrier.mcNumber}:`, error);
      }
    }

    console.log(`✅ Carrier monitoring completed for ${validatedCarriers.length} carriers`);
  }

  /**
   * Analyze carrier data changes for monitoring alerts
   */
  private analyzeCarrierChanges(carrier: CarrierValidationResult, newData: any): string[] {
    const alerts: string[] = [];

    // Check for safety rating changes
    if (carrier.fmcsaData?.safetyRating !== newData.safetyRating) {
      alerts.push(`Safety rating changed from ${carrier.fmcsaData?.safetyRating} to ${newData.safetyRating}`);
    }

    // Check for insurance status changes
    if (carrier.fmcsaData?.insuranceStatus !== newData.insuranceStatus) {
      alerts.push(`Insurance status changed from ${carrier.fmcsaData?.insuranceStatus} to ${newData.insuranceStatus}`);
    }

    // Check for operating status changes
    if (carrier.fmcsaData?.operatingStatus !== newData.operatingStatus) {
      alerts.push(`Operating status changed from ${carrier.fmcsaData?.operatingStatus} to ${newData.operatingStatus}`);
    }

    // Check credit score changes (BrokerSnapshot data)
    if (newData.creditScore && newData.creditScore < 70) {
      alerts.push(`Credit score alert: ${newData.creditScore} (below threshold)`);
    }

    return alerts;
  }

  /**
   * Carrier Validation and Monitoring Methods
   */
  async validateCarrier(mcNumber: string, dotNumber?: string): Promise<CarrierValidationResult> {
    console.log(`🔍 Starting FMCSA carrier validation for MC-${mcNumber}...`);
    
    try {
      const validationResult: CarrierValidationResult = {
        mcNumber,
        dotNumber,
        companyName: '',
        status: 'invalid',
        validationScore: 0,
        isValid: false,
        validationErrors: [],
        fmcsaData: {
          operatingStatus: '',
          legalName: '',
          physicalAddress: '',
          phoneNumber: '',
          insuranceRequired: '',
          insuranceOnFile: '',
          insuranceStatus: '',
          lastUpdated: new Date().toISOString()
        },
        validatedAt: new Date().toISOString(),
        monitoringActive: false,
        monitoringEnabled: false
      };

      // FMCSA API validation (simulated for demo)
      const fmcsaData = await this.fetchFMCSAData(mcNumber, dotNumber);
      
      if (!fmcsaData) {
        validationResult.validationErrors.push('FMCSA validation failed - carrier not found');
        validationResult.status = 'invalid';
      } else {
        // Check operating status
        if (fmcsaData.operatingStatus === 'OUT OF SERVICE') {
          validationResult.status = 'out_of_service';
          validationResult.validationErrors.push('Carrier is OUT OF SERVICE');
        }
        
        if (fmcsaData.safetyRating === 'UNSATISFACTORY') {
          validationResult.validationErrors.push('Carrier has UNSATISFACTORY safety rating');
        }
        
        if (fmcsaData.insuranceOnFile !== 'YES') {
          validationResult.validationErrors.push('Carrier insurance is INACTIVE');
        }

        validationResult.fmcsaData = {
          operatingStatus: fmcsaData.operatingStatus,
          legalName: fmcsaData.legalName || fmcsaData.companyName,
          dbaName: fmcsaData.dbaName,
          physicalAddress: fmcsaData.physicalAddress || fmcsaData.address,
          phoneNumber: fmcsaData.phoneNumber || fmcsaData.phone,
          safetyRating: fmcsaData.safetyRating,
          insuranceRequired: fmcsaData.insuranceRequired || 'YES',
          insuranceOnFile: fmcsaData.insuranceOnFile || 'NO',
          insuranceStatus: fmcsaData.insuranceOnFile === 'YES' ? 'ACTIVE' : 'INACTIVE',
          lastUpdated: new Date().toISOString()
        };
        
        if (validationResult.validationErrors.length === 0) {
          validationResult.isValid = true;
          validationResult.status = 'valid';
          validationResult.validationScore = 85;
        }

        validationResult.companyName = fmcsaData.legalName || fmcsaData.companyName;
      }

      // Start BrokerSnapshot monitoring if carrier is valid
      if (this.config.enableCarrierMonitoring && validationResult.isValid) {
        const brokerData = await this.fetchBrokerSnapshotData(mcNumber);
        if (brokerData) {
          validationResult.brokerSnapshotData = brokerData;
          validationResult.monitoringEnabled = true;
          validationResult.monitoringActive = true;
        }
      }

      // Cache the validation result
      this.carrierValidationCache.set(mcNumber, validationResult);

      // Send validation notification
      await this.sendCarrierValidationNotification(validationResult);

      console.log(`✅ Carrier validation completed for ${mcNumber}: ${validationResult.isValid ? 'VALID' : 'INVALID'}`);
      
      return validationResult;
    } catch (error) {
      console.error('❌ Carrier validation error:', error);
      const errorResult: CarrierValidationResult = this.carrierValidationCache.get(mcNumber) || {
        mcNumber, 
        companyName: 'Unknown', 
        status: 'invalid' as const, 
        validationScore: 0,
        isValid: false, 
        validationErrors: [], 
        fmcsaData: {
          operatingStatus: 'UNKNOWN',
          legalName: 'Unknown',
          physicalAddress: 'Unknown',
          phoneNumber: 'Unknown',
          insuranceRequired: 'UNKNOWN',
          insuranceOnFile: 'UNKNOWN',
          insuranceStatus: 'UNKNOWN',
          lastUpdated: new Date().toISOString()
        },
        validatedAt: new Date().toISOString(), 
        monitoringActive: false, 
        monitoringEnabled: false
      };
      errorResult.validationErrors.push(`Validation system error: ${error}`);
      return errorResult;
    }
  }

  async startCarrierMonitoring(): Promise<void> {
    if (!this.config.enableCarrierMonitoring) return;

    console.log('🔄 Starting carrier monitoring service...');
    
    const monitorCarriers = async () => {
      const carriersToMonitor = Array.from(this.carrierValidationCache.values())
        .filter(carrier => carrier.isValid && carrier.monitoringEnabled);

      for (const carrier of carriersToMonitor) {
        try {
          await this.monitorCarrier(carrier.mcNumber);
        } catch (error) {
          console.error(`❌ Error monitoring carrier ${carrier.mcNumber}:`, error);
        }
      }
    };

    // Monitor every 30 minutes
    this.carrierMonitoringInterval = setInterval(monitorCarriers, 30 * 60 * 1000);
    
    // Initial monitoring run
    await monitorCarriers();
  }

  async monitorCarrier(mcNumber: string): Promise<void> {
    const carrier = this.carrierValidationCache.get(mcNumber);
    if (!carrier || !carrier.monitoringEnabled) return;

    console.log(`🔍 Monitoring carrier MC-${mcNumber}...`);

    try {
      // Check for FMCSA status changes
      const newFMCSAData = await this.fetchFMCSAData(mcNumber, carrier.dotNumber);
      const newBrokerData = await this.fetchBrokerSnapshotData(mcNumber);

      const alerts: string[] = [];

      // Check for status changes
      if (newFMCSAData && carrier.fmcsaData.operatingStatus !== newFMCSAData.operatingStatus) {
        alerts.push(`Operating status changed from ${carrier.fmcsaData.operatingStatus} to ${newFMCSAData.operatingStatus}`);
      }

      if (carrier.fmcsaData?.insuranceStatus !== newFMCSAData?.insuranceOnFile) {
        alerts.push(`Insurance status changed from ${carrier.fmcsaData?.insuranceStatus} to ${newFMCSAData?.insuranceOnFile}`);
      }

      // Update broker snapshot data
      if (newBrokerData) {
        carrier.brokerSnapshotData = {
          ...newBrokerData,
          lastMonitored: new Date().toISOString()
        };
        
        if (newBrokerData.alerts && newBrokerData.alerts.length > 0) {
          alerts.push(...newBrokerData.alerts);
        }
      }

      // Send alerts if any issues found
      if (alerts.length > 0) {
        await this.sendCarrierAlerts(carrier, alerts);
      }

    } catch (error) {
      console.error(`❌ Error monitoring carrier ${mcNumber}:`, error);
    }
  }

  async sendCarrierValidationNotification(validation: CarrierValidationResult): Promise<void> {
    const subject = validation.isValid
      ? `✅ Carrier Validated: MC-${validation.mcNumber}`
      : `❌ Carrier Validation Failed: MC-${validation.mcNumber}`;

    const message = validation.isValid
      ? `Carrier MC-${validation.mcNumber} (${validation.companyName}) has been successfully validated.\n\n` +
        `Status: ${validation.fmcsaData?.operatingStatus}\n` +
        `Safety Rating: ${validation.fmcsaData?.safetyRating || 'N/A'}\n` +
        `Insurance: ${validation.fmcsaData?.insuranceStatus}\n` +
        `Monitoring: ${validation.monitoringEnabled ? 'Enabled' : 'Disabled'}`
      : `Carrier MC-${validation.mcNumber} validation failed.\n\n` +
        `Errors: ${validation.validationErrors.join(', ')}\n\n` +
        `This carrier cannot be assigned loads until validation issues are resolved.`;

    // Send email notification
    console.log(`📧 Sending carrier validation notification: ${subject}`);
    
    // Send SMS alert for failed validations
    if (!validation.isValid) {
      const smsMessage = `CARRIER ALERT: MC-${validation.mcNumber} validation failed. Check dispatch system for details.`;
      console.log(`📱 SMS Alert: ${smsMessage}`);
    }
  }

  async sendCarrierAlerts(carrier: CarrierValidationResult, alerts: string[]): Promise<void> {
    const subject = `🚨 Carrier Alert: MC-${carrier.mcNumber}`;
    const message = `Carrier MC-${carrier.mcNumber} (${carrier.companyName}) has status changes:\n\n` +
      alerts.join('\n') + '\n\n' +
      'Please review carrier status and take appropriate action.';

    console.log(`📧 Sending carrier alert: ${subject}`);
    console.log(`📱 SMS Alert: Carrier MC-${carrier.mcNumber} status changed. Check alerts.`);
  }

  private async fetchFMCSAData(mcNumber: string, dotNumber?: string): Promise<any> {
    // Simulated FMCSA API call - replace with actual FMCSA API integration
    console.log(`🔍 Fetching FMCSA data for MC-${mcNumber}...`);
    
    // Demo data for different scenarios
    const demoData: Record<string, any> = {
      '123456': {
        companyName: 'Reliable Transport LLC',
        legalName: 'Reliable Transport LLC',
        operatingStatus: 'AUTHORIZED',
        safetyRating: 'SATISFACTORY',
        insuranceOnFile: 'YES',
        physicalAddress: '123 Main St, Dallas, TX 75201',
        phoneNumber: '(555) 123-4567'
      },
      '789012': {
        companyName: 'Problem Carrier Inc',
        legalName: 'Problem Carrier Inc',
        operatingStatus: 'OUT OF SERVICE',
        safetyRating: 'UNSATISFACTORY',
        insuranceOnFile: 'NO',
        physicalAddress: '456 Bad St, Houston, TX 77001',
        phoneNumber: '(555) 789-0123'
      },
      '345678': {
        companyName: 'Good Logistics Co',
        legalName: 'Good Logistics Co',
        operatingStatus: 'AUTHORIZED',
        safetyRating: 'SATISFACTORY',
        insuranceOnFile: 'YES',
        physicalAddress: '789 Good Ave, Austin, TX 78701',
        phoneNumber: '(555) 345-6789'
      }
    };

    return demoData[mcNumber] || null;
  }

  private async fetchBrokerSnapshotData(mcNumber: string): Promise<any> {
    // Simulated BrokerSnapshot API call
    console.log(`🔍 Fetching BrokerSnapshot data for MC-${mcNumber}...`);
    
    const demoData: Record<string, any> = {
      '123456': {
        creditScore: 750,
        paymentHistory: 'EXCELLENT',
        riskLevel: 'low',
        alerts: [],
        lastMonitored: new Date().toISOString()
      },
      '789012': {
        creditScore: 450,
        paymentHistory: 'POOR',
        riskLevel: 'high',
        alerts: ['Late payments reported', 'Insurance lapse detected'],
        lastMonitored: new Date().toISOString()
      },
      '345678': {
        creditScore: 680,
        paymentHistory: 'GOOD',
        riskLevel: 'medium',
        alerts: [],
        lastMonitored: new Date().toISOString()
      }
    };

    return demoData[mcNumber] || null;
  }

  async getCarrierValidationStatus(mcNumber: string): Promise<CarrierValidationResult | null> {
    return this.carrierValidationCache.get(mcNumber) || null;
  }

  async isCarrierValidForLoadAssignment(mcNumber: string): Promise<boolean> {
    const validation = await this.getCarrierValidationStatus(mcNumber);
    return validation?.isValid === true && validation.status === 'valid';
  }

  /**
   * Heavy Haul Permit Management
   */
  async analyzeHeavyHaulRequirements(loadData: any): Promise<{
    requiresPermits: boolean;
    permitType: 'oversize' | 'overweight' | 'both' | 'none';
    affectedStates: string[];
    estimatedCost: number;
    timeline: string;
    applications?: HeavyHaulPermitApp[];
  }> {
    console.log(`🚛 Analyzing heavy haul requirements for load ${loadData.id}...`);

    // Convert load data to HeavyHaulLoadData format
    const heavyHaulLoad: HeavyHaulLoadDataData = {
      id: loadData.id,
      dimensions: {
        length: loadData.dimensions?.length || 0,
        width: loadData.dimensions?.width || 0,
        height: loadData.dimensions?.height || 0,
        weight: loadData.dimensions?.weight || 0
      },
      route: {
        origin: {
          city: loadData.pickup?.city || '',
          state: loadData.pickup?.state || '',
          coordinates: loadData.pickup?.coordinates || [0, 0]
        },
        destination: {
          city: loadData.delivery?.city || '',
          state: loadData.delivery?.state || '',
          coordinates: loadData.delivery?.coordinates || [0, 0]
        },
        waypoints: loadData.waypoints || []
      },
      equipment: {
        tractor: loadData.equipment?.tractor || 'Standard',
        trailer: loadData.equipment?.trailer || 'Standard',
        axleConfiguration: loadData.equipment?.axleConfiguration || 'Standard'
      },
      cargo: {
        description: loadData.cargo?.description || 'General freight',
        type: loadData.cargo?.type || 'other'
      },
      timeline: {
        pickupDate: new Date(loadData.pickupDate || Date.now()),
        deliveryDate: new Date(loadData.deliveryDate || Date.now() + 86400000),
        travelDays: loadData.travelDays || 1
      }
    };

    // Analyze permit requirements
    const analysis = this.heavyHaulPermitService.analyzeLoad(heavyHaulLoad);
    
    let applications: HeavyHaulPermitApp[] = [];
    
    if (analysis.requiresPermits) {
      console.log(`📋 Permits required: ${analysis.permitType} for states: ${analysis.affectedStates.join(', ')}`);
      
      // Get permit requirements
      const requirements = this.heavyHaulPermitService.getPermitRequirements(
        analysis.affectedStates,
        analysis.permitType
      );
      
      // Create permit applications
      applications = await this.heavyHaulPermitService.createHeavyHaulPermitApps(
        heavyHaulLoad,
        requirements
      );
      
      console.log(`✅ Created ${applications.length} permit applications`);
    } else {
      console.log(`✅ No permits required for load ${loadData.id}`);
    }

    return {
      ...analysis,
      applications
    };
  }

  async processHeavyHaulPermits(loadId: string, applications: HeavyHaulPermitApp[]): Promise<{
    submitted: number;
    pending: number;
    approved: number;
    totalCost: number;
    readyToTravel: boolean;
  }> {
    console.log(`🚀 Processing ${applications.length} heavy haul permits for load ${loadId}...`);

    let submitted = 0;
    let pending = 0;
    let approved = 0;
    let totalCost = 0;

    // Submit all applications
    for (const application of applications) {
      try {
        const result = await this.heavyHaulPermitService.submitHeavyHaulPermitApp(application);
        
        if (result.success) {
          submitted++;
          console.log(`✅ Submitted permit for ${application.state}: ${result.confirmationNumber}`);
        } else {
          console.log(`❌ Failed to submit permit for ${application.state}: ${result.message}`);
        }

        totalCost += application.cost;
      } catch (error) {
        console.error(`Error submitting permit for ${application.state}:`, error);
      }
    }

    // Track status of all applications
    for (const application of applications) {
      try {
        const status = await this.heavyHaulPermitService.trackPermitStatus(application);
        
        if (status.status === 'approved') {
          approved++;
        } else if (['submitted', 'pending'].includes(status.status)) {
          pending++;
        }
      } catch (error) {
        console.error(`Error tracking permit status for ${application.state}:`, error);
      }
    }

    const readyToTravel = approved === applications.length;

    console.log(`📊 Permit Status Summary:`);
    console.log(`   Submitted: ${submitted}/${applications.length}`);
    console.log(`   Pending: ${pending}`);
    console.log(`   Approved: ${approved}`);
    console.log(`   Total Cost: $${totalCost}`);
    console.log(`   Ready to Travel: ${readyToTravel ? 'YES' : 'NO'}`);

    return {
      submitted,
      pending,
      approved,
      totalCost,
      readyToTravel
    };
  }

  async getHeavyHaulPermitStatus(applications: HeavyHaulPermitApp[]): Promise<{
    applications: HeavyHaulPermitApp[];
    summary: any;
    renewals: HeavyHaulPermitApp[];
  }> {
    // Get updated status for all applications
    const updatedApplications = await Promise.all(
      applications.map(async (app) => {
        const status = await this.heavyHaulPermitService.trackPermitStatus(app);
        return {
          ...app,
          status: status.status,
          lastUpdate: status.lastUpdate,
          estimatedApproval: status.estimatedApproval
        };
      })
    );

    // Get summary using first application's load data (simplified)
    const mockLoad: HeavyHaulLoadData = {
      id: applications[0]?.loadId || 'unknown',
      dimensions: { length: 0, width: 0, height: 0, weight: 0 },
      route: {
        origin: { city: '', state: '', coordinates: [0, 0] },
        destination: { city: '', state: '', coordinates: [0, 0] }
      },
      equipment: { tractor: '', trailer: '', axleConfiguration: '' },
      cargo: { description: '', type: 'other' },
      timeline: {
        pickupDate: new Date(),
        deliveryDate: new Date(),
        travelDays: 1
      }
    };

    const summary = this.heavyHaulPermitService.getPermitSummary(mockLoad, updatedApplications);
    
    // Check for permit renewals
    const renewals = this.heavyHaulPermitService.getPermitRenewals(updatedApplications);

    return {
      applications: updatedApplications,
      summary,
      renewals
    };
  }

  async integrateHeavyHaulWithWorkflow(workflowId: string): Promise<{
    success: boolean;
    permitAnalysis?: any;
    permitStatus?: any;
    message: string;
  }> {
    const workflow = this.workflows.get(workflowId);
    
    if (!workflow) {
      return {
        success: false,
        message: 'Workflow not found'
      };
    }

    try {
      console.log(`🔗 Integrating heavy haul permits with workflow ${workflowId}...`);

      // Analyze heavy haul requirements from workflow load data
      const permitAnalysis = await this.analyzeHeavyHaulRequirements(workflow);

      if (permitAnalysis.requiresPermits && permitAnalysis.applications) {
        // Process permits
        const permitStatus = await this.processHeavyHaulPermits(
          workflow.loadId,
          permitAnalysis.applications
        );

        // Update workflow with permit information
        workflow.routeDocument = {
          ...workflow.routeDocument,
          heavyHaulPermits: {
            required: true,
            permitType: permitAnalysis.permitType,
            affectedStates: permitAnalysis.affectedStates,
            totalCost: permitStatus.totalCost,
            readyToTravel: permitStatus.readyToTravel,
            applications: permitAnalysis.applications
          }
        };

        // Add permit notifications
        workflow.notifications.push({
          type: 'heavy_haul_permits',
          message: `Heavy haul permits ${permitStatus.readyToTravel ? 'approved' : 'pending'} for ${permitAnalysis.permitType} load`,
          timestamp: new Date(),
          data: {
            permitType: permitAnalysis.permitType,
            states: permitAnalysis.affectedStates,
            cost: permitStatus.totalCost,
            status: permitStatus.readyToTravel ? 'ready' : 'pending'
          }
        });

        console.log(`✅ Heavy haul permits integrated with workflow ${workflowId}`);

        return {
          success: true,
          permitAnalysis,
          permitStatus,
          message: `Heavy haul permits ${permitStatus.readyToTravel ? 'ready' : 'processing'} - ${permitAnalysis.permitType} permits for ${permitAnalysis.affectedStates.length} states`
        };
      } else {
        // No permits required
        workflow.routeDocument = {
          ...workflow.routeDocument,
          heavyHaulPermits: {
            required: false,
            message: 'Load is within legal limits - no permits required'
          }
        };

        return {
          success: true,
          permitAnalysis,
          message: 'No heavy haul permits required for this load'
        };
      }
    } catch (error) {
      console.error('Heavy haul permit integration error:', error);
      
      return {
        success: false,
        message: `Heavy haul permit integration failed: ${error}`
      };
    }
  }

  // ...existing methods...
}

/**
 * Heavy Haul Permit Service
 * Manages heavy haul permit requirements, applications, and integrations
 */
export class HeavyHaulPermitService {
  /**
   * Analyze load for heavy haul permit requirements
   */
  analyzeLoad(load: HeavyHaulLoadData): {
    requiresPermits: boolean;
    permitType: 'oversize' | 'overweight' | 'both' | 'none';
    affectedStates: string[];
    estimatedCost: number;
    timeline: string;
  } {
    // Simplified analysis logic
    const requiresPermits = load.dimensions.weight > 80000 || load.dimensions.length > 53;
    const permitType = load.dimensions.weight > 80000 && load.dimensions.length > 53 ? 'both' : 'oversize';
    const affectedStates = ['TX', 'OK', 'KS']; // Simplified - would be based on route
    const estimatedCost = requiresPermits ? 500 : 0;
    const timeline = requiresPermits ? '7-10 business days' : 'N/A';

    return {
      requiresPermits,
      permitType,
      affectedStates,
      estimatedCost,
      timeline
    };
  }

  /**
   * Get permit requirements for states
   */
  getPermitRequirements(states: string[], permitType: 'oversize' | 'overweight' | 'both'): any[] {
    // Simplified requirements
    return states.map(state => ({
      state,
      permitType,
      maxWidth: permitType === 'oversize' ? 8.5 : undefined,
      maxWeight: permitType === 'overweight' ? 80000 : undefined,
      routeRestrictions: [],
      notes: 'Check specific route restrictions'
    }));
  }

  /**
   * Create permit applications for a load
   */
  async createHeavyHaulPermitApps(load: HeavyHaulLoadData, requirements: any[]): Promise<HeavyHaulPermitApp[]> {
    // Mock application creation
    return requirements.map(req => ({
      id: `APP-${load.id}-${req.state}`,
      loadId: load.id,
      state: req.state,
      permitType: req.permitType,
      status: 'pending',
      cost: 100, // Mock cost
      confirmationNumber: '',
      applicationDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Pending approval'
    }));
  }

  /**
   * Submit a permit application
   */
  async submitHeavyHaulPermitApp(application: HeavyHaulPermitApp): Promise<{ success: boolean; message?: string; confirmationNumber?: string }> {
    // Mock submission logic
    console.log(`📄 Submitting permit application for ${application.state}...`);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          confirmationNumber: `CONF-${application.id}`
        });
      }, 1000);
    });
  }

  /**
   * Track the status of a permit application
   */
  async trackPermitStatus(application: HeavyHaulPermitApp): Promise<{ status: 'pending' | 'approved' | 'rejected'; lastUpdate?: string; estimatedApproval?: string }> {
    // Mock tracking logic
    console.log(`📦 Tracking permit application ${application.id}...`);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          status: 'approved',
          lastUpdate: new Date().toISOString(),
          estimatedApproval: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        });
      }, 1000);
    });
  }

  /**
   * Get a summary of permit statuses for a load
   */
  getPermitSummary(load: HeavyHaulLoadData, applications: HeavyHaulPermitApp[]): any {
    const totalCost = applications.reduce((sum, app) => sum + app.cost, 0);
    const approved = applications.filter(app => app.status === 'approved').length;
    const pending = applications.filter(app => app.status === 'pending').length;

    return {
      loadId: load.id,
      totalCost,
      approved,
      pending,
      requiresPermits: approved > 0
    };
  }

  /**
   * Get permits that are due for renewal
   */
  getPermitRenewals(applications: HeavyHaulPermitApp[]): HeavyHaulPermitApp[] {
    const now = new Date();
    return applications.filter(app => {
      const expirationDate = new Date(app.expirationDate);
      const diffDays = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 30; // Renewals due within 30 days
    });
  }
}

// Export singleton instance
export const fleetFlowOrchestrator = new FleetFlowSystemOrchestrator();

// Integration helper functions
export class IntegrationHelpers {
  /**
   * Quick load processing with full integration and carrier validation
   */
  static async processLoadWithFullIntegration(loadData: any): Promise<IntegratedWorkflow> {
    return await fleetFlowOrchestrator.processLoad(loadData);
  }

  /**
   * Validate carrier when uploaded to system
   */
  static async validateCarrier(mcNumber: string, carrierData?: any): Promise<CarrierValidationResult> {
    return await fleetFlowOrchestrator.validateAndAddCarrier(mcNumber, carrierData);
  }

  /**
   * Get carrier validation status
   */
  static async getCarrierStatus(mcNumber: string): Promise<CarrierValidationResult | null> {
    return await fleetFlowOrchestrator.getCarrierValidationStatus(mcNumber);
  }

  /**
   * Run carrier monitoring checks
   */
  static async runCarrierMonitoring(): Promise<void> {
    return await fleetFlowOrchestrator.monitorCarriers();
  }

  /**
   * Real-time status updates for tracking
   */
  static async updateLoadStatus(loadId: string, status: string, location?: any): Promise<void> {
    console.log(`📍 Load ${loadId} status update: ${status}`, location);
    // In production, this would update the tracking system and notify stakeholders
  }

  /**
   * Emergency notification system
   */
  static async sendEmergencyAlert(loadId: string, message: string): Promise<void> {
    console.log(`🚨 EMERGENCY ALERT for Load ${loadId}: ${message}`);
    // In production, this would send urgent notifications to all stakeholders
  }

  /**
   * Carrier validation workflow for new carrier uploads
   */
  static async onCarrierUpload(carrierData: {
    mcNumber: string;
    companyName: string;
    contactInfo?: any;
  }): Promise<{
    success: boolean;
    validation: CarrierValidationResult;
    message: string;
  }> {
    try {
      const validation = await fleetFlowOrchestrator.validateAndAddCarrier(
        carrierData.mcNumber,
        carrierData
      );

      return {
        success: validation.isValid,
        validation,
        message: validation.isValid 
          ? `Carrier ${carrierData.mcNumber} validated successfully and monitoring enabled`
          : `Carrier validation failed: ${validation.validationErrors.join(', ')}`
      };
    } catch (error) {
      return {
        success: false,
        validation: {
          mcNumber: carrierData.mcNumber,
          dotNumber: carrierData.contactInfo?.dotNumber,
          companyName: carrierData.companyName || 'Unknown',
          status: 'invalid',
          validationScore: 0,
          isValid: false,
          validationErrors: [`System error: ${error}`],
          fmcsaData: {
            operatingStatus: 'Unknown',
            legalName: 'Unknown',
            physicalAddress: 'Unknown',
            phoneNumber: 'Unknown',
            insuranceRequired: 'Unknown',
            insuranceOnFile: 'Unknown',
            insuranceStatus: 'Unknown',
            lastUpdated: new Date().toISOString()
          },
          validatedAt: new Date().toISOString(),
          monitoringActive: false,
          monitoringEnabled: false
        },
        message: `Carrier validation system error: ${error}`
      };
    }
  }
}

console.log('🔗 FleetFlow System Integration loaded successfully');
