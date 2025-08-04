/**
 * TWIC Escort Service
 *
 * Provides TWIC escort services for drivers/companies without TWIC cards
 * at port facilities requiring security clearance
 */

export interface TWICEscortRequest {
  id: string;
  tenantId: string;
  driverName: string;
  driverLicense: string;
  phoneNumber: string;
  portCode: string;
  terminalId: string;
  appointmentTime: string;
  containerNumber?: string;
  chassisNumber?: string;
  operationType: 'pickup' | 'delivery' | 'empty_return';
  estimatedDuration: number; // minutes
  specialInstructions?: string;
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  escortId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TWICEscort {
  id: string;
  name: string;
  twicCardNumber: string;
  twicExpiration: string;
  phoneNumber: string;
  email: string;
  portClearances: string[]; // Array of port codes they're cleared for
  currentStatus: 'available' | 'busy' | 'off_duty';
  currentLocation?: string;
  rating: number;
  completedEscorts: number;
  hourlyRate: number;
  languages: string[];
  specializations: string[]; // hazmat, oversized, etc.
}

export interface EscortAvailability {
  escortId: string;
  escortName: string;
  availableSlots: {
    startTime: string;
    endTime: string;
    rate: number;
  }[];
  estimatedArrival: number; // minutes
  rating: number;
}

export interface EscortPricing {
  baseRate: number; // per hour
  minimumCharge: number; // minimum hours
  rushSurcharge: number; // percentage for same-day requests
  hazmatSurcharge: number; // additional for hazmat loads
  oversizeSurcharge: number; // additional for oversized loads
  waitingTimeRate: number; // per hour for delays
  mileageRate: number; // per mile for escort travel
}

class TWICEscortService {
  private escortRequests: Map<string, TWICEscortRequest> = new Map();
  private escorts: Map<string, TWICEscort> = new Map();
  private pricing: Map<string, EscortPricing> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock TWIC Escorts
    const mockEscorts: TWICEscort[] = [
      {
        id: 'escort_001',
        name: 'Michael Rodriguez',
        twicCardNumber: 'TWC1234567890',
        twicExpiration: '2026-12-15',
        phoneNumber: '(310) 555-0101',
        email: 'mrodriguez@twicescort.com',
        portClearances: ['USLAX', 'USLGB', 'USOAK'],
        currentStatus: 'available',
        currentLocation: 'Port of Los Angeles - Gate 1',
        rating: 4.8,
        completedEscorts: 247,
        hourlyRate: 75,
        languages: ['English', 'Spanish'],
        specializations: ['hazmat', 'oversized'],
      },
      {
        id: 'escort_002',
        name: 'Sarah Chen',
        twicCardNumber: 'TWC2345678901',
        twicExpiration: '2027-03-22',
        phoneNumber: '(213) 555-0202',
        email: 'schen@portescort.com',
        portClearances: ['USLAX', 'USLGB'],
        currentStatus: 'busy',
        currentLocation: 'Port of Long Beach - Terminal Island',
        rating: 4.9,
        completedEscorts: 189,
        hourlyRate: 80,
        languages: ['English', 'Mandarin'],
        specializations: ['container', 'breakbulk'],
      },
      {
        id: 'escort_003',
        name: 'David Thompson',
        twicCardNumber: 'TWC3456789012',
        twicExpiration: '2025-08-10',
        phoneNumber: '(562) 555-0303',
        email: 'dthompson@secureescort.com',
        portClearances: ['USNYK', 'USBOS', 'USBAL'],
        currentStatus: 'available',
        currentLocation: 'Port of NY/NJ - Newark',
        rating: 4.7,
        completedEscorts: 312,
        hourlyRate: 85,
        languages: ['English'],
        specializations: ['hazmat', 'refrigerated', 'oversized'],
      },
      {
        id: 'escort_004',
        name: 'Maria Santos',
        twicCardNumber: 'TWC4567890123',
        twicExpiration: '2026-11-05',
        phoneNumber: '(912) 555-0404',
        email: 'msantos@georgiaescorts.com',
        portClearances: ['USSAV', 'USJAX', 'USCHA'],
        currentStatus: 'available',
        currentLocation: 'Port of Savannah - Garden City Terminal',
        rating: 4.6,
        completedEscorts: 156,
        hourlyRate: 70,
        languages: ['English', 'Spanish'],
        specializations: ['container', 'automotive'],
      },
    ];

    mockEscorts.forEach((escort) => {
      this.escorts.set(escort.id, escort);
    });

    // Mock Pricing by Port
    const mockPricing: { [portCode: string]: EscortPricing } = {
      USLAX: {
        // Port of Los Angeles
        baseRate: 75,
        minimumCharge: 2, // 2 hours minimum
        rushSurcharge: 25, // 25% surcharge for same-day
        hazmatSurcharge: 20, // $20/hour additional
        oversizeSurcharge: 15, // $15/hour additional
        waitingTimeRate: 50, // $50/hour for waiting
        mileageRate: 0.75, // $0.75 per mile
      },
      USLGB: {
        // Port of Long Beach
        baseRate: 80,
        minimumCharge: 2,
        rushSurcharge: 30,
        hazmatSurcharge: 25,
        oversizeSurcharge: 20,
        waitingTimeRate: 55,
        mileageRate: 0.8,
      },
      USNYK: {
        // Port of NY/NJ
        baseRate: 85,
        minimumCharge: 3, // Higher minimum in NYC
        rushSurcharge: 35,
        hazmatSurcharge: 30,
        oversizeSurcharge: 25,
        waitingTimeRate: 65,
        mileageRate: 1.0,
      },
      USSAV: {
        // Port of Savannah
        baseRate: 70,
        minimumCharge: 2,
        rushSurcharge: 20,
        hazmatSurcharge: 15,
        oversizeSurcharge: 10,
        waitingTimeRate: 45,
        mileageRate: 0.65,
      },
    };

    Object.entries(mockPricing).forEach(([portCode, pricing]) => {
      this.pricing.set(portCode, pricing);
    });
  }

  /**
   * Request TWIC escort service
   */
  async requestEscort(
    request: Omit<
      TWICEscortRequest,
      'id' | 'status' | 'createdAt' | 'updatedAt'
    >
  ): Promise<{
    success: boolean;
    requestId?: string;
    availableEscorts?: EscortAvailability[];
    estimatedCost?: number;
    error?: string;
  }> {
    try {
      const requestId = `escort_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const escortRequest: TWICEscortRequest = {
        ...request,
        id: requestId,
        status: 'requested',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.escortRequests.set(requestId, escortRequest);

      // Find available escorts for this port
      const availableEscorts = await this.findAvailableEscorts(
        request.portCode,
        request.appointmentTime,
        request.estimatedDuration
      );

      // Calculate estimated cost
      const estimatedCost = this.calculateEscortCost(
        request.portCode,
        request.estimatedDuration,
        request.operationType
      );

      return {
        success: true,
        requestId,
        availableEscorts,
        estimatedCost,
      };
    } catch (error) {
      console.error('Error requesting escort:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Find available escorts for specific port and time
   */
  async findAvailableEscorts(
    portCode: string,
    appointmentTime: string,
    duration: number
  ): Promise<EscortAvailability[]> {
    const availableEscorts: EscortAvailability[] = [];

    for (const escort of this.escorts.values()) {
      // Check if escort is cleared for this port
      if (!escort.portClearances.includes(portCode)) {
        continue;
      }

      // Check if escort is available (simplified logic)
      if (escort.currentStatus === 'available') {
        const availability: EscortAvailability = {
          escortId: escort.id,
          escortName: escort.name,
          availableSlots: [
            {
              startTime: appointmentTime,
              endTime: new Date(
                new Date(appointmentTime).getTime() + duration * 60000
              ).toISOString(),
              rate: escort.hourlyRate,
            },
          ],
          estimatedArrival: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
          rating: escort.rating,
        };

        availableEscorts.push(availability);
      }
    }

    // Sort by rating (highest first)
    return availableEscorts.sort((a, b) => b.rating - a.rating);
  }

  /**
   * Assign escort to request
   */
  async assignEscort(
    requestId: string,
    escortId: string
  ): Promise<{
    success: boolean;
    assignment?: {
      escortName: string;
      escortPhone: string;
      estimatedArrival: string;
      totalCost: number;
    };
    error?: string;
  }> {
    try {
      const request = this.escortRequests.get(requestId);
      const escort = this.escorts.get(escortId);

      if (!request) {
        return { success: false, error: 'Request not found' };
      }

      if (!escort) {
        return { success: false, error: 'Escort not found' };
      }

      // Update request
      request.escortId = escortId;
      request.status = 'assigned';
      request.updatedAt = new Date().toISOString();
      this.escortRequests.set(requestId, request);

      // Update escort status
      escort.currentStatus = 'busy';
      this.escorts.set(escortId, escort);

      // Calculate total cost
      const totalCost = this.calculateEscortCost(
        request.portCode,
        request.estimatedDuration,
        request.operationType
      );

      // Calculate estimated arrival
      const estimatedArrival = new Date(
        new Date(request.appointmentTime).getTime() - 30 * 60000 // 30 minutes before appointment
      ).toISOString();

      return {
        success: true,
        assignment: {
          escortName: escort.name,
          escortPhone: escort.phoneNumber,
          estimatedArrival,
          totalCost,
        },
      };
    } catch (error) {
      console.error('Error assigning escort:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Calculate escort service cost
   */
  private calculateEscortCost(
    portCode: string,
    duration: number, // minutes
    operationType: string,
    isRush: boolean = false
  ): number {
    const pricing = this.pricing.get(portCode);
    if (!pricing) {
      return 0;
    }

    const hours = Math.max(duration / 60, pricing.minimumCharge);
    let baseCost = hours * pricing.baseRate;

    // Add surcharges
    if (isRush) {
      baseCost += baseCost * (pricing.rushSurcharge / 100);
    }

    // Add operational surcharges (simplified)
    if (operationType.includes('hazmat')) {
      baseCost += hours * pricing.hazmatSurcharge;
    }

    if (operationType.includes('oversized')) {
      baseCost += hours * pricing.oversizeSurcharge;
    }

    return Math.round(baseCost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get escort request status
   */
  async getRequestStatus(requestId: string): Promise<{
    success: boolean;
    request?: TWICEscortRequest;
    escort?: TWICEscort;
    error?: string;
  }> {
    try {
      const request = this.escortRequests.get(requestId);

      if (!request) {
        return { success: false, error: 'Request not found' };
      }

      let escort: TWICEscort | undefined;
      if (request.escortId) {
        escort = this.escorts.get(request.escortId);
      }

      return {
        success: true,
        request,
        escort,
      };
    } catch (error) {
      console.error('Error getting request status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all escorts for a port
   */
  async getPortEscorts(portCode: string): Promise<TWICEscort[]> {
    return Array.from(this.escorts.values()).filter((escort) =>
      escort.portClearances.includes(portCode)
    );
  }

  /**
   * Get escort pricing for a port
   */
  getPortPricing(portCode: string): EscortPricing | null {
    return this.pricing.get(portCode) || null;
  }

  /**
   * Update escort status
   */
  async updateEscortStatus(
    escortId: string,
    status: 'available' | 'busy' | 'off_duty'
  ): Promise<boolean> {
    const escort = this.escorts.get(escortId);
    if (escort) {
      escort.currentStatus = status;
      this.escorts.set(escortId, escort);
      return true;
    }
    return false;
  }

  /**
   * Complete escort request
   */
  async completeEscortRequest(
    requestId: string,
    rating?: number
  ): Promise<{
    success: boolean;
    summary?: {
      duration: number;
      finalCost: number;
      escortRating: number;
    };
    error?: string;
  }> {
    try {
      const request = this.escortRequests.get(requestId);

      if (!request || !request.escortId) {
        return { success: false, error: 'Request or escort not found' };
      }

      const escort = this.escorts.get(request.escortId);
      if (!escort) {
        return { success: false, error: 'Escort not found' };
      }

      // Update request status
      request.status = 'completed';
      request.updatedAt = new Date().toISOString();
      this.escortRequests.set(requestId, request);

      // Update escort status and stats
      escort.currentStatus = 'available';
      escort.completedEscorts += 1;

      if (rating && rating >= 1 && rating <= 5) {
        // Update escort rating (simplified average)
        escort.rating =
          (escort.rating * (escort.completedEscorts - 1) + rating) /
          escort.completedEscorts;
        escort.rating = Math.round(escort.rating * 10) / 10; // Round to 1 decimal
      }

      this.escorts.set(request.escortId, escort);

      // Calculate final cost
      const finalCost = this.calculateEscortCost(
        request.portCode,
        request.estimatedDuration,
        request.operationType
      );

      return {
        success: true,
        summary: {
          duration: request.estimatedDuration,
          finalCost,
          escortRating: escort.rating,
        },
      };
    } catch (error) {
      console.error('Error completing escort request:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get escort service analytics
   */
  async getEscortAnalytics(portCode?: string): Promise<{
    totalRequests: number;
    completedRequests: number;
    averageRating: number;
    totalRevenue: number;
    activeEscorts: number;
    averageResponseTime: number;
  }> {
    const requests = Array.from(this.escortRequests.values());
    const filteredRequests = portCode
      ? requests.filter((req) => req.portCode === portCode)
      : requests;

    const completedRequests = filteredRequests.filter(
      (req) => req.status === 'completed'
    );
    const escorts = portCode
      ? Array.from(this.escorts.values()).filter((escort) =>
          escort.portClearances.includes(portCode)
        )
      : Array.from(this.escorts.values());

    const totalRevenue = completedRequests.reduce((sum, req) => {
      return (
        sum +
        this.calculateEscortCost(
          req.portCode,
          req.estimatedDuration,
          req.operationType
        )
      );
    }, 0);

    const averageRating =
      escorts.length > 0
        ? escorts.reduce((sum, escort) => sum + escort.rating, 0) /
          escorts.length
        : 0;

    return {
      totalRequests: filteredRequests.length,
      completedRequests: completedRequests.length,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeEscorts: escorts.filter((e) => e.currentStatus !== 'off_duty')
        .length,
      averageResponseTime: 25, // Mock average response time in minutes
    };
  }
}

export default new TWICEscortService();
