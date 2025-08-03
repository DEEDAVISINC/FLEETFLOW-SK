// Live Permit Ordering Service
// Handles real-time permit ordering, payment processing, and state API integrations

export interface PermitOrder {
  id: string;
  loadId: string;
  tenantId: string;
  state: string;
  permitType: 'oversize' | 'overweight' | 'both';

  // Load details
  loadDetails: {
    dimensions: {
      length: number;
      width: number;
      height: number;
      weight: number;
    };
    route: {
      origin: string;
      destination: string;
      waypoints: string[];
    };
    equipmentType: string;
    cargoType: string;
  };

  // Order status
  status:
    | 'draft'
    | 'payment_pending'
    | 'submitted'
    | 'processing'
    | 'approved'
    | 'denied'
    | 'expired';

  // Financial details
  cost: number;
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  // State-specific details
  statePermitId?: string;
  confirmationNumber?: string;
  permitNumber?: string;

  // Documents
  documents: {
    application?: string;
    insurance?: string;
    route_survey?: string;
    permit_document?: string;
  };

  // Timeline
  submittedAt?: Date;
  approvedAt?: Date;
  expirationDate?: Date;

  // Processing details
  processingTime: number; // hours
  validityPeriod: number; // days

  // Notifications
  notifications: {
    email: string[];
    phone: string[];
  };

  // Notes and updates
  notes: string[];
  statusUpdates: {
    timestamp: Date;
    status: string;
    message: string;
    source: 'system' | 'state_api' | 'manual';
  }[];
}

export interface StateAPIConfig {
  state: string;
  baseUrl: string;
  apiKey?: string;
  authMethod: 'api_key' | 'oauth' | 'basic' | 'manual';
  endpoints: {
    submit: string;
    status: string;
    payment: string;
  };
  supportedPermitTypes: string[];
  processingTime: number; // hours
  onlineOrderingAvailable: boolean;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'ach' | 'wire';
  description: string;
  metadata: {
    permitOrderId: string;
    state: string;
    permitType: string;
  };
}

export class PermitOrderingService {
  private static instance: PermitOrderingService;
  private orders: Map<string, PermitOrder> = new Map();
  private stateConfigs: Map<string, StateAPIConfig> = new Map();

  constructor() {
    this.initializeStateConfigurations();
  }

  public static getInstance(): PermitOrderingService {
    if (!PermitOrderingService.instance) {
      PermitOrderingService.instance = new PermitOrderingService();
    }
    return PermitOrderingService.instance;
  }

  /**
   * Initialize state DOT API configurations
   */
  private initializeStateConfigurations(): void {
    // California CDTFA
    this.stateConfigs.set('CA', {
      state: 'CA',
      baseUrl: 'https://permits.cdtfa.ca.gov/api/v1',
      authMethod: 'api_key',
      endpoints: {
        submit: '/permits/submit',
        status: '/permits/status',
        payment: '/permits/payment',
      },
      supportedPermitTypes: ['oversize', 'overweight', 'both'],
      processingTime: 24,
      onlineOrderingAvailable: true,
    });

    // Texas DOT
    this.stateConfigs.set('TX', {
      state: 'TX',
      baseUrl: 'https://permits.txdot.gov/api/v2',
      authMethod: 'oauth',
      endpoints: {
        submit: '/oversize-permits',
        status: '/permit-status',
        payment: '/payment-processing',
      },
      supportedPermitTypes: ['oversize', 'overweight', 'both'],
      processingTime: 48,
      onlineOrderingAvailable: true,
    });

    // Florida DOT
    this.stateConfigs.set('FL', {
      state: 'FL',
      baseUrl: 'https://www.fdot.gov/permits/api',
      authMethod: 'api_key',
      endpoints: {
        submit: '/oversized/submit',
        status: '/oversized/status',
        payment: '/payment',
      },
      supportedPermitTypes: ['oversize', 'overweight'],
      processingTime: 72,
      onlineOrderingAvailable: true,
    });

    // Georgia DOT
    this.stateConfigs.set('GA', {
      state: 'GA',
      baseUrl: 'https://permits.dot.ga.gov/api',
      authMethod: 'basic',
      endpoints: {
        submit: '/permits',
        status: '/permits/status',
        payment: '/payments',
      },
      supportedPermitTypes: ['oversize', 'overweight', 'both'],
      processingTime: 48,
      onlineOrderingAvailable: true,
    });

    // Add more states with manual processing
    const manualStates = ['AZ', 'NY', 'OH', 'PA', 'IL', 'NC', 'MI', 'IN'];
    manualStates.forEach((state) => {
      this.stateConfigs.set(state, {
        state,
        baseUrl: '',
        authMethod: 'manual',
        endpoints: { submit: '', status: '', payment: '' },
        supportedPermitTypes: ['oversize', 'overweight', 'both'],
        processingTime: 120, // 5 days for manual processing
        onlineOrderingAvailable: false,
      });
    });
  }

  /**
   * Create a new permit order
   */
  public async createPermitOrder(
    loadId: string,
    tenantId: string,
    state: string,
    permitType: 'oversize' | 'overweight' | 'both',
    loadDetails: any,
    notifications: { email: string[]; phone: string[] }
  ): Promise<PermitOrder> {
    const orderId = `PO-${Date.now()}-${state}`;
    const stateConfig = this.stateConfigs.get(state);

    if (!stateConfig) {
      throw new Error(`State ${state} is not supported for permit ordering`);
    }

    const order: PermitOrder = {
      id: orderId,
      loadId,
      tenantId,
      state,
      permitType,
      loadDetails,
      status: 'draft',
      cost: this.calculatePermitCost(state, permitType, loadDetails),
      paymentStatus: 'pending',
      processingTime: stateConfig.processingTime,
      validityPeriod: 30, // Standard 30 days
      notifications,
      documents: {},
      notes: [`Permit order created for ${state} ${permitType} permit`],
      statusUpdates: [
        {
          timestamp: new Date(),
          status: 'draft',
          message: 'Permit order created and ready for submission',
          source: 'system',
        },
      ],
    };

    this.orders.set(orderId, order);

    console.info(
      `✅ Created permit order ${orderId} for ${state} (${permitType})`
    );
    return order;
  }

  /**
   * Submit permit order with payment processing
   */
  public async submitPermitOrder(
    orderId: string,
    paymentMethod: 'card' | 'ach' = 'card'
  ): Promise<{
    success: boolean;
    message: string;
    paymentUrl?: string;
    confirmationNumber?: string;
    estimatedApproval?: Date;
  }> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Permit order ${orderId} not found`);
    }

    const stateConfig = this.stateConfigs.get(order.state);
    if (!stateConfig) {
      throw new Error(`State configuration not found for ${order.state}`);
    }

    try {
      // Step 1: Process payment
      console.info(`💰 Processing payment for permit order ${orderId}...`);
      const paymentResult = await this.processPayment(order, paymentMethod);

      if (!paymentResult.success) {
        order.status = 'draft';
        order.paymentStatus = 'failed';
        order.statusUpdates.push({
          timestamp: new Date(),
          status: 'payment_failed',
          message: `Payment failed: ${paymentResult.message}`,
          source: 'system',
        });
        return {
          success: false,
          message: `Payment failed: ${paymentResult.message}`,
        };
      }

      order.paymentId = paymentResult.paymentId;
      order.paymentStatus = 'paid';

      // Step 2: Submit to state API or prepare for manual submission
      if (stateConfig.onlineOrderingAvailable) {
        const submissionResult = await this.submitToStateAPI(
          order,
          stateConfig
        );

        if (submissionResult.success) {
          order.status = 'submitted';
          order.submittedAt = new Date();
          order.confirmationNumber = submissionResult.confirmationNumber;
          order.statePermitId = submissionResult.statePermitId;

          const estimatedApproval = new Date();
          estimatedApproval.setHours(
            estimatedApproval.getHours() + stateConfig.processingTime
          );

          order.statusUpdates.push({
            timestamp: new Date(),
            status: 'submitted',
            message: `Successfully submitted to ${order.state} DOT via API`,
            source: 'state_api',
          });

          return {
            success: true,
            message: 'Permit order submitted successfully',
            confirmationNumber: order.confirmationNumber,
            estimatedApproval,
          };
        } else {
          throw new Error(submissionResult.message);
        }
      } else {
        // Manual submission required
        order.status = 'payment_pending';
        order.statusUpdates.push({
          timestamp: new Date(),
          status: 'manual_submission_required',
          message: `Payment processed. Manual submission required for ${order.state}`,
          source: 'system',
        });

        return {
          success: true,
          message: `Payment processed. Manual submission required for ${order.state} DOT.`,
          confirmationNumber: order.id,
        };
      }
    } catch (error: any) {
      console.error(`❌ Failed to submit permit order ${orderId}:`, error);

      order.status = 'draft';
      order.statusUpdates.push({
        timestamp: new Date(),
        status: 'submission_failed',
        message: `Submission failed: ${error.message}`,
        source: 'system',
      });

      return {
        success: false,
        message: `Failed to submit permit order: ${error.message}`,
      };
    }
  }

  /**
   * Process payment for permit order
   */
  private async processPayment(
    order: PermitOrder,
    paymentMethod: 'card' | 'ach'
  ): Promise<{
    success: boolean;
    message: string;
    paymentId?: string;
  }> {
    // Simulate payment processing with Stripe
    // In production, this would integrate with actual Stripe API

    const paymentDetails: PaymentDetails = {
      amount: order.cost * 100, // Convert to cents
      currency: 'usd',
      paymentMethod,
      description: `${order.state} ${order.permitType} permit for load ${order.loadId}`,
      metadata: {
        permitOrderId: order.id,
        state: order.state,
        permitType: order.permitType,
      },
    };

    console.info(
      `💳 Processing ${paymentMethod} payment of $${order.cost} for permit ${order.id}`
    );

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 95% success rate
    if (Math.random() > 0.05) {
      const paymentId = `pi_${Date.now()}_${order.state}`;

      console.info(`✅ Payment successful: ${paymentId}`);
      return {
        success: true,
        message: 'Payment processed successfully',
        paymentId,
      };
    } else {
      return {
        success: false,
        message: 'Payment declined - insufficient funds',
      };
    }
  }

  /**
   * Submit order to state DOT API
   */
  private async submitToStateAPI(
    order: PermitOrder,
    stateConfig: StateAPIConfig
  ): Promise<{
    success: boolean;
    message: string;
    confirmationNumber?: string;
    statePermitId?: string;
  }> {
    console.info(`📡 Submitting permit order to ${order.state} DOT API...`);

    // Simulate API submission
    const submissionData = {
      permitType: order.permitType,
      dimensions: order.loadDetails.dimensions,
      route: order.loadDetails.route,
      equipmentType: order.loadDetails.equipmentType,
      cargoType: order.loadDetails.cargoType,
      paymentConfirmation: order.paymentId,
    };

    console.info(
      `📤 Sending data to ${stateConfig.baseUrl}${stateConfig.endpoints.submit}`
    );

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      const confirmationNumber = `${order.state}-${Date.now().toString().slice(-6)}`;
      const statePermitId = `SP-${order.state}-${Date.now()}`;

      console.info(`✅ State API submission successful: ${confirmationNumber}`);
      return {
        success: true,
        message: 'Successfully submitted to state API',
        confirmationNumber,
        statePermitId,
      };
    } else {
      return {
        success: false,
        message: 'State API submission failed - system temporarily unavailable',
      };
    }
  }

  /**
   * Track permit order status
   */
  public async trackPermitOrder(orderId: string): Promise<{
    order: PermitOrder;
    latestUpdate: string;
    nextAction?: string;
  }> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Permit order ${orderId} not found`);
    }

    // Check for status updates from state API
    if (order.status === 'submitted' || order.status === 'processing') {
      await this.checkStateAPIStatus(order);
    }

    const latestUpdate = order.statusUpdates[order.statusUpdates.length - 1];

    let nextAction: string | undefined;
    switch (order.status) {
      case 'draft':
        nextAction = 'Submit order with payment';
        break;
      case 'payment_pending':
        nextAction = 'Complete manual submission to state DOT';
        break;
      case 'submitted':
        nextAction = 'Wait for state DOT processing';
        break;
      case 'processing':
        nextAction = 'Monitor for approval notification';
        break;
      case 'approved':
        nextAction = 'Download permit document';
        break;
    }

    return {
      order,
      latestUpdate: latestUpdate.message,
      nextAction,
    };
  }

  /**
   * Check status from state API
   */
  private async checkStateAPIStatus(order: PermitOrder): Promise<void> {
    if (!order.statePermitId) return;

    const stateConfig = this.stateConfigs.get(order.state);
    if (!stateConfig?.onlineOrderingAvailable) return;

    console.info(`🔍 Checking permit status for ${order.id} with state API...`);

    // Simulate API status check
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate permit approval timeline
    const hoursSubmitted = order.submittedAt
      ? (Date.now() - order.submittedAt.getTime()) / (1000 * 60 * 60)
      : 0;

    if (hoursSubmitted > stateConfig.processingTime) {
      // Simulate permit approval
      if (order.status !== 'approved' && Math.random() > 0.1) {
        order.status = 'approved';
        order.approvedAt = new Date();
        order.permitNumber = `${order.state}-PERMIT-${Date.now().toString().slice(-6)}`;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + order.validityPeriod);
        order.expirationDate = expirationDate;

        order.statusUpdates.push({
          timestamp: new Date(),
          status: 'approved',
          message: `Permit approved! Permit number: ${order.permitNumber}`,
          source: 'state_api',
        });

        console.info(
          `🎉 Permit ${order.id} approved with number ${order.permitNumber}`
        );
      }
    } else if (hoursSubmitted > stateConfig.processingTime * 0.5) {
      // Update to processing if not already
      if (order.status === 'submitted') {
        order.status = 'processing';
        order.statusUpdates.push({
          timestamp: new Date(),
          status: 'processing',
          message: 'Permit application is being reviewed by state DOT',
          source: 'state_api',
        });
      }
    }
  }

  /**
   * Calculate permit cost based on state and permit type
   */
  private calculatePermitCost(
    state: string,
    permitType: string,
    loadDetails: any
  ): number {
    const baseCosts: Record<string, Record<string, number>> = {
      CA: { oversize: 15, overweight: 20, both: 30 },
      TX: { oversize: 12, overweight: 18, both: 25 },
      FL: { oversize: 10, overweight: 15, both: 22 },
      GA: { oversize: 8, overweight: 12, both: 18 },
      AZ: { oversize: 10, overweight: 15, both: 22 },
      NY: { oversize: 20, overweight: 25, both: 40 },
      OH: { oversize: 8, overweight: 12, both: 18 },
      PA: { oversize: 12, overweight: 18, both: 25 },
    };

    const stateCosts = baseCosts[state] || {
      oversize: 15,
      overweight: 20,
      both: 30,
    };
    let baseCost = stateCosts[permitType] || 25;

    // Add complexity factors
    const dimensions = loadDetails.dimensions;
    if (
      dimensions.length > 100 ||
      dimensions.width > 12 ||
      dimensions.height > 13.5
    ) {
      baseCost *= 1.5; // 50% surcharge for extremely large loads
    }

    if (dimensions.weight > 150000) {
      baseCost *= 1.3; // 30% surcharge for very heavy loads
    }

    return Math.round(baseCost);
  }

  /**
   * Get all permit orders for a tenant
   */
  public getPermitOrdersByTenant(tenantId: string): PermitOrder[] {
    return Array.from(this.orders.values()).filter(
      (order) => order.tenantId === tenantId
    );
  }

  /**
   * Get permit order by ID
   */
  public getPermitOrder(orderId: string): PermitOrder | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get supported states for permit ordering
   */
  public getSupportedStates(): {
    state: string;
    onlineOrdering: boolean;
    processingTime: number;
  }[] {
    return Array.from(this.stateConfigs.values()).map((config) => ({
      state: config.state,
      onlineOrdering: config.onlineOrderingAvailable,
      processingTime: config.processingTime,
    }));
  }

  /**
   * Cancel permit order (before submission)
   */
  public async cancelPermitOrder(
    orderId: string,
    reason: string
  ): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Permit order ${orderId} not found`);
    }

    if (order.status !== 'draft' && order.status !== 'payment_pending') {
      throw new Error(`Cannot cancel permit order in ${order.status} status`);
    }

    // Process refund if payment was made
    if (order.paymentStatus === 'paid') {
      // Simulate refund processing
      order.paymentStatus = 'refunded';
    }

    order.status = 'draft';
    order.statusUpdates.push({
      timestamp: new Date(),
      status: 'cancelled',
      message: `Order cancelled: ${reason}`,
      source: 'system',
    });

    console.info(`❌ Cancelled permit order ${orderId}: ${reason}`);
    return true;
  }
}

export default PermitOrderingService;
