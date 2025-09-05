/**
 * Universal Quote Service
 * Manages ALL quote types and their integration with route planning
 * Supports: LTL, FTL, Specialized, Warehousing, Multi-State quotes
 */

import { MultiStateConsolidatedQuote } from './MultiStateQuoteService';

// Universal Quote Interface
export interface UniversalQuote {
  id: string;
  quoteNumber: string;
  type: 'LTL' | 'FTL' | 'Specialized' | 'Warehousing' | 'Multi-State';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  origin: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  destination: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  // Multi-destination support for complex quotes
  additionalStops?: Array<{
    address: string;
    city: string;
    state: string;
    zipCode: string;
    type: 'pickup' | 'delivery' | 'stop';
    coordinates?: { lat: number; lng: number };
  }>;
  cargo: {
    weight: number;
    dimensions?: { length: number; width: number; height: number };
    pieces: number;
    description: string;
    hazmat?: boolean;
    specialRequirements?: string[];
  };
  pricing: {
    baseRate: number;
    fuelSurcharge: number;
    accessorials: number;
    taxes: number;
    total: number;
    currency: string;
  };
  timeline: {
    pickupDate: string;
    deliveryDate: string;
    transitTime: number; // hours
    urgency: 'standard' | 'expedited' | 'emergency';
  };
  equipment: {
    type: string;
    specifications?: string[];
  };
  // Route planning integration
  routeData?: {
    distance: number;
    estimatedDuration: number;
    optimizedRoute?: any;
    routePlanningStatus:
      | 'not_planned'
      | 'planning'
      | 'optimized'
      | 'in_transit'
      | 'completed';
    lastRouteUpdate?: string;
  };
  // Special data for different quote types
  specialData?: {
    // Multi-State specific
    multiStateData?: Partial<MultiStateConsolidatedQuote>;
    // Warehousing specific
    warehousingData?: {
      storageType: string;
      duration: number;
      specialServices: string[];
    };
    // Specialized specific
    specializedData?: {
      permits: string[];
      escorts: boolean;
      specialEquipment: string[];
    };
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
}

// Route Planning Request Interface
export interface RouteRequest {
  quoteId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  optimizationGoals: ('time' | 'cost' | 'fuel' | 'safety')[];
  constraints?: {
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    maxDrivingHours?: number;
    requiredStops?: string[];
  };
  requestedBy: string;
  requestedAt: string;
}

class UniversalQuoteService {
  private quotes: Map<string, UniversalQuote> = new Map();
  private routeRequests: Map<string, RouteRequest> = new Map();

  constructor() {
    this.initializeSampleQuotes();
  }

  // Quote Management
  createQuote(
    quoteData: Omit<UniversalQuote, 'id' | 'createdAt' | 'updatedAt'>
  ): UniversalQuote {
    const quote: UniversalQuote = {
      ...quoteData,
      id: this.generateQuoteId(quoteData.type),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.quotes.set(quote.id, quote);
    return quote;
  }

  updateQuote(
    quoteId: string,
    updates: Partial<UniversalQuote>
  ): UniversalQuote | null {
    const quote = this.quotes.get(quoteId);
    if (!quote) return null;

    const updatedQuote = {
      ...quote,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.quotes.set(quoteId, updatedQuote);
    return updatedQuote;
  }

  getQuote(quoteId: string): UniversalQuote | null {
    return this.quotes.get(quoteId) || null;
  }

  getAllQuotes(): UniversalQuote[] {
    return Array.from(this.quotes.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getQuotesByType(type: UniversalQuote['type']): UniversalQuote[] {
    return this.getAllQuotes().filter((quote) => quote.type === type);
  }

  getQuotesByStatus(status: UniversalQuote['status']): UniversalQuote[] {
    return this.getAllQuotes().filter((quote) => quote.status === status);
  }

  // Route Planning Integration
  requestRouteOptimization(
    quoteId: string,
    routeRequest: Omit<RouteRequest, 'quoteId'>
  ): RouteRequest | null {
    const quote = this.quotes.get(quoteId);
    if (!quote) return null;

    const request: RouteRequest = {
      ...routeRequest,
      quoteId,
    };

    this.routeRequests.set(quoteId, request);

    // Update quote with route planning status
    this.updateQuote(quoteId, {
      routeData: {
        ...quote.routeData,
        routePlanningStatus: 'planning',
        lastRouteUpdate: new Date().toISOString(),
      },
    });

    return request;
  }

  updateRouteOptimization(
    quoteId: string,
    routeData: Partial<UniversalQuote['routeData']>
  ): boolean {
    const quote = this.quotes.get(quoteId);
    if (!quote) return false;

    this.updateQuote(quoteId, {
      routeData: {
        ...quote.routeData,
        ...routeData,
        lastRouteUpdate: new Date().toISOString(),
      },
    });

    return true;
  }

  getRoutePlanningCandidates(): UniversalQuote[] {
    return this.getAllQuotes().filter(
      (quote) =>
        quote.status === 'approved' &&
        (!quote.routeData ||
          quote.routeData.routePlanningStatus === 'not_planned')
    );
  }

  getActiveRouteOptimizations(): UniversalQuote[] {
    return this.getAllQuotes().filter(
      (quote) =>
        quote.routeData?.routePlanningStatus === 'planning' ||
        quote.routeData?.routePlanningStatus === 'optimized'
    );
  }

  // Utility Methods
  private generateQuoteId(type: string): string {
    const prefix = type.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Search and Filter
  searchQuotes(searchTerm: string): UniversalQuote[] {
    const term = searchTerm.toLowerCase();
    return this.getAllQuotes().filter(
      (quote) =>
        quote.quoteNumber.toLowerCase().includes(term) ||
        quote.customer.name.toLowerCase().includes(term) ||
        quote.origin.city.toLowerCase().includes(term) ||
        quote.destination.city.toLowerCase().includes(term) ||
        quote.cargo.description.toLowerCase().includes(term)
    );
  }

  getQuotesByCustomer(customerId: string): UniversalQuote[] {
    return this.getAllQuotes().filter(
      (quote) => quote.customer.id === customerId
    );
  }

  getQuotesByDateRange(startDate: string, endDate: string): UniversalQuote[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.getAllQuotes().filter((quote) => {
      const created = new Date(quote.createdAt);
      return created >= start && created <= end;
    });
  }

  // Analytics
  getQuoteAnalytics() {
    const quotes = this.getAllQuotes();
    const totalQuotes = quotes.length;
    const quotesByType = quotes.reduce(
      (acc, quote) => {
        acc[quote.type] = (acc[quote.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const quotesByStatus = quotes.reduce(
      (acc, quote) => {
        acc[quote.status] = (acc[quote.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalValue = quotes.reduce(
      (sum, quote) => sum + quote.pricing.total,
      0
    );
    const avgQuoteValue = totalQuotes > 0 ? totalValue / totalQuotes : 0;

    const routePlanningStats = {
      notPlanned: quotes.filter(
        (q) => !q.routeData || q.routeData.routePlanningStatus === 'not_planned'
      ).length,
      planning: quotes.filter(
        (q) => q.routeData?.routePlanningStatus === 'planning'
      ).length,
      optimized: quotes.filter(
        (q) => q.routeData?.routePlanningStatus === 'optimized'
      ).length,
      inTransit: quotes.filter(
        (q) => q.routeData?.routePlanningStatus === 'in_transit'
      ).length,
      completed: quotes.filter(
        (q) => q.routeData?.routePlanningStatus === 'completed'
      ).length,
    };

    return {
      totalQuotes,
      quotesByType,
      quotesByStatus,
      totalValue,
      avgQuoteValue,
      routePlanningStats,
    };
  }

  // Initialize with sample data
  private initializeSampleQuotes() {
    const sampleQuotes: Omit<
      UniversalQuote,
      'id' | 'createdAt' | 'updatedAt'
    >[] = [
      {
        quoteNumber: 'Q-2024-001',
        type: 'FTL',
        status: 'approved',
        customer: {
          id: 'CUST-001',
          name: 'Walmart Distribution',
          email: 'logistics@walmart.com',
          phone: '+1-555-0101',
        },
        origin: {
          address: '1234 Industrial Blvd',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30309',
          coordinates: { lat: 33.749, lng: -84.388 },
        },
        destination: {
          address: '5678 Commerce Dr',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          coordinates: { lat: 25.7617, lng: -80.1918 },
        },
        cargo: {
          weight: 42000,
          dimensions: { length: 48, width: 8, height: 9 },
          pieces: 26,
          description: 'Consumer electronics and appliances',
          hazmat: false,
          specialRequirements: ['Temperature controlled'],
        },
        pricing: {
          baseRate: 2400,
          fuelSurcharge: 320,
          accessorials: 150,
          taxes: 187,
          total: 3057,
          currency: 'USD',
        },
        timeline: {
          pickupDate: '2024-01-20T08:00:00Z',
          deliveryDate: '2024-01-22T17:00:00Z',
          transitTime: 32,
          urgency: 'standard',
        },
        equipment: {
          type: 'Dry Van 53ft',
          specifications: ['Air ride suspension', 'Load bars'],
        },
        routeData: {
          distance: 663,
          estimatedDuration: 11.5,
          routePlanningStatus: 'not_planned',
        },
        createdBy: 'dispatcher@fleetflow.com',
        notes: 'Regular customer, priority delivery',
      },
      {
        quoteNumber: 'Q-2024-002',
        type: 'LTL',
        status: 'approved',
        customer: {
          id: 'CUST-002',
          name: 'Home Depot Supply Chain',
          email: 'freight@homedepot.com',
          phone: '+1-555-0102',
        },
        origin: {
          address: '9876 Manufacturing Way',
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201',
          coordinates: { lat: 32.7767, lng: -96.797 },
        },
        destination: {
          address: '4321 Retail Plaza',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          coordinates: { lat: 33.4484, lng: -112.074 },
        },
        cargo: {
          weight: 8500,
          dimensions: { length: 12, width: 8, height: 6 },
          pieces: 15,
          description: 'Building materials and hardware',
          hazmat: false,
          specialRequirements: ['Liftgate delivery'],
        },
        pricing: {
          baseRate: 850,
          fuelSurcharge: 127,
          accessorials: 75,
          taxes: 68,
          total: 1120,
          currency: 'USD',
        },
        timeline: {
          pickupDate: '2024-01-18T10:00:00Z',
          deliveryDate: '2024-01-21T15:00:00Z',
          transitTime: 28,
          urgency: 'standard',
        },
        equipment: {
          type: 'LTL Standard',
          specifications: ['Liftgate equipped'],
        },
        routeData: {
          distance: 887,
          estimatedDuration: 14.2,
          routePlanningStatus: 'optimized',
          lastRouteUpdate: '2024-01-17T14:30:00Z',
        },
        createdBy: 'sales@fleetflow.com',
        notes: 'Multiple delivery windows available',
      },
      {
        quoteNumber: 'Q-2024-003',
        type: 'Specialized',
        status: 'pending',
        customer: {
          id: 'CUST-003',
          name: 'Chemical Solutions Inc',
          email: 'shipping@chemsol.com',
          phone: '+1-555-0103',
        },
        origin: {
          address: '1111 Chemical Plant Rd',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          coordinates: { lat: 29.7604, lng: -95.3698 },
        },
        destination: {
          address: '2222 Industrial Complex',
          city: 'New Orleans',
          state: 'LA',
          zipCode: '70112',
          coordinates: { lat: 29.9511, lng: -90.0715 },
        },
        cargo: {
          weight: 35000,
          dimensions: { length: 40, width: 8, height: 8 },
          pieces: 8,
          description: 'Hazardous chemicals - Class 8 Corrosive',
          hazmat: true,
          specialRequirements: [
            'Hazmat certified driver',
            'Placarding required',
          ],
        },
        pricing: {
          baseRate: 3200,
          fuelSurcharge: 425,
          accessorials: 650,
          taxes: 273,
          total: 4548,
          currency: 'USD',
        },
        timeline: {
          pickupDate: '2024-01-25T06:00:00Z',
          deliveryDate: '2024-01-26T18:00:00Z',
          transitTime: 8,
          urgency: 'expedited',
        },
        equipment: {
          type: 'Hazmat Tanker',
          specifications: ['DOT certified', 'Emergency response kit'],
        },
        routeData: {
          distance: 351,
          estimatedDuration: 6.5,
          routePlanningStatus: 'not_planned',
        },
        specialData: {
          specializedData: {
            permits: ['TX-HAZMAT-001', 'LA-HAZMAT-002'],
            escorts: false,
            specialEquipment: ['Spill kit', 'Emergency contact system'],
          },
        },
        createdBy: 'hazmat@fleetflow.com',
        notes: 'Requires certified hazmat driver and special routing',
      },
    ];

    sampleQuotes.forEach((quoteData) => {
      this.createQuote(quoteData);
    });
  }
}

// Singleton instance
export const universalQuoteService = new UniversalQuoteService();
export default universalQuoteService;
































































































