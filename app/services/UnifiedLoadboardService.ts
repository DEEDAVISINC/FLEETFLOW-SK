import {
  Load,
  getBrokerLoads,
  getDispatcherLoads,
  getLoadStats,
  getMainDashboardLoads,
} from './loadService';

// Real-time loadboard synchronization service
export class UnifiedLoadboardService {
  private static instance: UnifiedLoadboardService;
  private loadSubscribers: Map<string, (loads: Load[]) => void> = new Map();
  private realTimeUpdates: Map<string, NodeJS.Timeout> = new Map();
  private currentLoads: Load[] = [];
  private lastUpdate: number = Date.now();

  private constructor() {
    this.initializeRealTimeSync();
  }

  public static getInstance(): UnifiedLoadboardService {
    if (!UnifiedLoadboardService.instance) {
      UnifiedLoadboardService.instance = new UnifiedLoadboardService();
    }
    return UnifiedLoadboardService.instance;
  }

  // Initialize real-time synchronization across all loadboards
  private initializeRealTimeSync(): void {
    // Set up real-time updates every 5 seconds
    setInterval(() => {
      this.synchronizeAllLoadboards();
    }, 5000);

    // Set up WebSocket-like real-time updates for immediate changes
    this.setupRealTimeUpdates();
  }

  // Subscribe to loadboard updates
  public subscribeToLoadboard(
    portalId: string,
    callback: (loads: Load[]) => void
  ): string {
    const subscriptionId = `sub_${portalId}_${Date.now()}`;
    this.loadSubscribers.set(subscriptionId, callback);

    // Immediately send current loads to new subscriber
    callback(this.currentLoads);

    return subscriptionId;
  }

  // Unsubscribe from loadboard updates
  public unsubscribeFromLoadboard(subscriptionId: string): void {
    this.loadSubscribers.delete(subscriptionId);
  }

  // Get loads for specific portal with real-time filtering
  public getLoadsForPortal(
    portalId: string,
    filters: LoadboardFilters = {}
  ): Load[] {
    let filteredLoads = [...this.currentLoads];

    // Apply portal-specific filtering
    switch (portalId) {
      case 'vendor-portal':
        filteredLoads = this.filterLoadsForVendorPortal(filteredLoads, filters);
        break;
      case 'broker-portal':
        filteredLoads = this.filterLoadsForBrokerPortal(filteredLoads, filters);
        break;
      case 'dispatch-central':
        filteredLoads = this.filterLoadsForDispatchCentral(
          filteredLoads,
          filters
        );
        break;
      case 'carrier-portal':
        filteredLoads = this.filterLoadsForCarrierPortal(
          filteredLoads,
          filters
        );
        break;
      case 'driver-portal':
        filteredLoads = this.filterLoadsForDriverPortal(filteredLoads, filters);
        break;
      default:
        filteredLoads = this.filterLoadsForGeneralPortal(
          filteredLoads,
          filters
        );
    }

    return filteredLoads;
  }

  // Filter loads for vendor portal (warehouse/shipper perspective)
  private filterLoadsForVendorPortal(
    loads: Load[],
    filters: LoadboardFilters
  ): Load[] {
    return loads.filter((load) => {
      // Vendor portal sees loads related to their shipments
      const isVendorRelated = load.shipperId && load.status !== 'Cancelled';

      if (!isVendorRelated) return false;

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        return load.status === filters.status;
      }

      if (filters.equipment && filters.equipment !== 'all') {
        return load.equipment === filters.equipment;
      }

      return true;
    });
  }

  // Filter loads for broker portal (broker agent perspective)
  private filterLoadsForBrokerPortal(
    loads: Load[],
    filters: LoadboardFilters
  ): Load[] {
    return loads.filter((load) => {
      // Brokers see their own loads
      const isBrokerLoad = load.brokerId && load.status !== 'Cancelled';

      if (!isBrokerLoad) return false;

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        return load.status === filters.status;
      }

      if (filters.equipment && filters.equipment !== 'all') {
        return load.equipment === filters.equipment;
      }

      return true;
    });
  }

  // Filter loads for dispatch central (dispatcher perspective)
  private filterLoadsForDispatchCentral(
    loads: Load[],
    filters: LoadboardFilters
  ): Load[] {
    return loads.filter((load) => {
      // Dispatch central sees assigned loads and available loads
      const isDispatchLoad =
        (load.dispatcherId || load.status === 'Available') &&
        load.status !== 'Cancelled';

      if (!isDispatchLoad) return false;

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        return load.status === filters.status;
      }

      if (filters.equipment && filters.equipment !== 'all') {
        return load.equipment === filters.equipment;
      }

      return true;
    });
  }

  // Filter loads for carrier portal (carrier company perspective)
  private filterLoadsForCarrierPortal(
    loads: Load[],
    filters: LoadboardFilters
  ): Load[] {
    return loads.filter((load) => {
      // Carrier portal sees loads available for bidding
      const isCarrierLoad =
        load.status === 'Available' || load.status === 'Broadcasted';

      if (!isCarrierLoad) return false;

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        return load.status === filters.status;
      }

      if (filters.equipment && filters.equipment !== 'all') {
        return load.equipment === filters.equipment;
      }

      return true;
    });
  }

  // Filter loads for driver portal (individual driver perspective)
  private filterLoadsForDriverPortal(
    loads: Load[],
    filters: LoadboardFilters
  ): Load[] {
    return loads.filter((load) => {
      // Driver portal sees loads assigned to them or available for selection
      const isDriverLoad =
        load.driverId ||
        load.status === 'Available' ||
        load.status === 'Broadcasted';

      if (!isDriverLoad) return false;

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        return load.status === filters.status;
      }

      if (filters.equipment && filters.equipment !== 'all') {
        return load.equipment === filters.equipment;
      }

      return true;
    });
  }

  // Filter loads for general portal
  private filterLoadsForGeneralPortal(
    loads: Load[],
    filters: LoadboardFilters
  ): Load[] {
    return loads.filter((load) => {
      if (filters.status && filters.status !== 'all') {
        return load.status === filters.status;
      }

      if (filters.equipment && filters.equipment !== 'all') {
        return load.equipment === filters.equipment;
      }

      return true;
    });
  }

  // Update load status across all loadboards in real-time
  public updateLoadStatus(
    loadId: string,
    newStatus: string,
    updates: Partial<Load> = {}
  ): void {
    const loadIndex = this.currentLoads.findIndex((load) => load.id === loadId);

    if (loadIndex !== -1) {
      // Update the load
      this.currentLoads[loadIndex] = {
        ...this.currentLoads[loadIndex],
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...updates,
      };

      // Notify all subscribers immediately
      this.notifyAllSubscribers();

      // Update last update timestamp
      this.lastUpdate = Date.now();

      console.info(
        `🚛 Load ${loadId} status updated to ${newStatus} - All loadboards synchronized`
      );
    }
  }

  // Add new load to all loadboards
  public addNewLoad(load: Load): void {
    this.currentLoads.push(load);
    this.notifyAllSubscribers();
    console.info(`🚛 New load ${load.id} added - All loadboards synchronized`);
  }

  // Remove load from all loadboards
  public removeLoad(loadId: string): void {
    this.currentLoads = this.currentLoads.filter((load) => load.id !== loadId);
    this.notifyAllSubscribers();
    console.info(`🚛 Load ${loadId} removed - All loadboards synchronized`);
  }

  // Synchronize all loadboards with latest data
  private synchronizeAllLoadboards(): void {
    // Get latest loads from all sources
    const allLoads = [
      ...getMainDashboardLoads(),
      ...getBrokerLoads('all'),
      ...getDispatcherLoads('all'),
    ];

    // Remove duplicates and merge
    const uniqueLoads = this.mergeAndDeduplicateLoads(allLoads);

    // Update current loads if there are changes
    if (JSON.stringify(this.currentLoads) !== JSON.stringify(uniqueLoads)) {
      this.currentLoads = uniqueLoads;
      this.notifyAllSubscribers();
      console.info(
        `🔄 Loadboards synchronized - ${this.currentLoads.length} loads updated`
      );
    }
  }

  // Merge and deduplicate loads from multiple sources
  private mergeAndDeduplicateLoads(loads: Load[]): Load[] {
    const loadMap = new Map<string, Load>();

    loads.forEach((load) => {
      if (load.id && !loadMap.has(load.id)) {
        loadMap.set(load.id, load);
      }
    });

    return Array.from(loadMap.values());
  }

  // Notify all subscribers of load updates
  private notifyAllSubscribers(): void {
    this.loadSubscribers.forEach((callback, subscriptionId) => {
      try {
        callback(this.currentLoads);
      } catch (error) {
        console.error(`Error notifying subscriber ${subscriptionId}:`, error);
      }
    });
  }

  // Set up real-time updates for immediate changes
  private setupRealTimeUpdates(): void {
    // Simulate WebSocket-like real-time updates
    // In production, this would use actual WebSockets or Server-Sent Events

    // Monitor for load status changes
    setInterval(() => {
      this.checkForStatusChanges();
    }, 2000);
  }

  // Check for load status changes and notify subscribers
  private checkForStatusChanges(): void {
    // This would typically check for changes in the database or external systems
    // For now, we'll use the existing synchronization
    this.synchronizeAllLoadboards();
  }

  // Get real-time load statistics for any portal
  public getRealTimeStats(portalId: string): any {
    const portalLoads = this.getLoadsForPortal(portalId);
    return getLoadStats(portalLoads);
  }

  // Get load activity timeline across all portals
  public getLoadActivityTimeline(loadId: string): LoadActivity[] {
    const load = this.currentLoads.find((l) => l.id === loadId);
    if (!load) return [];

    return [
      {
        timestamp: load.createdAt,
        action: 'Load Created',
        portal: 'Broker Portal',
        user: load.brokerName || 'Unknown',
        details: `Load ${load.id} created in broker portal`,
      },
      {
        timestamp: load.assignedAt || load.createdAt,
        action: load.dispatcherId
          ? 'Assigned to Dispatcher'
          : 'Available for Assignment',
        portal: 'Dispatch Central',
        user: load.dispatcherName || 'System',
        details: load.dispatcherId
          ? `Assigned to ${load.dispatcherName}`
          : 'Waiting for dispatcher assignment',
      },
      {
        timestamp: load.updatedAt || load.createdAt,
        action: 'Status Updated',
        portal: 'All Portals',
        user: 'System',
        details: `Status changed to ${load.status}`,
      },
    ].filter((activity) => activity.timestamp);
  }

  // Search loads across all portals
  public searchLoadsAcrossPortals(
    searchTerm: string,
    portalId?: string
  ): Load[] {
    const searchLower = searchTerm.toLowerCase();
    const searchableLoads = portalId
      ? this.getLoadsForPortal(portalId)
      : this.currentLoads;

    return searchableLoads.filter((load) => {
      return (
        load.id.toLowerCase().includes(searchLower) ||
        load.origin.toLowerCase().includes(searchLower) ||
        load.destination.toLowerCase().includes(searchLower) ||
        load.status.toLowerCase().includes(searchLower) ||
        (load.brokerName &&
          load.brokerName.toLowerCase().includes(searchLower)) ||
        (load.dispatcherName &&
          load.dispatcherName.toLowerCase().includes(searchLower)) ||
        (load.driverName &&
          load.driverName.toLowerCase().includes(searchLower)) ||
        (load.shipperName &&
          load.shipperName.toLowerCase().includes(searchLower))
      );
    });
  }

  // Get cross-portal load relationships
  public getCrossPortalLoadRelationships(
    loadId: string
  ): CrossPortalRelationships {
    const load = this.currentLoads.find((l) => l.id === loadId);
    if (!load) return {};

    return {
      brokerPortal: {
        loadId: load.id,
        brokerId: load.brokerId,
        brokerName: load.brokerName,
        shipperId: load.shipperId,
        shipperName: load.shipperName,
        status: load.status,
        lastUpdated: load.updatedAt || load.createdAt,
      },
      dispatchCentral: {
        loadId: load.id,
        dispatcherId: load.dispatcherId,
        dispatcherName: load.dispatcherName,
        assignmentDate: load.assignedAt,
        status: load.status,
        lastUpdated: load.updatedAt || load.createdAt,
      },
      vendorPortal: {
        loadId: load.id,
        shipperId: load.shipperId,
        shipperName: load.shipperName,
        shipmentStatus: this.mapLoadStatusToShipmentStatus(load.status),
        lastUpdated: load.updatedAt || load.createdAt,
      },
      carrierPortal: {
        loadId: load.id,
        driverId: load.driverId,
        driverName: load.driverName,
        vehicleInfo: load.vehicleInfo,
        status: load.status,
        lastUpdated: load.updatedAt || load.createdAt,
      },
    };
  }

  // Map load status to shipment status for vendor portal
  private mapLoadStatusToShipmentStatus(loadStatus: string): string {
    const statusMap: Record<string, string> = {
      Available: 'pending',
      Assigned: 'assigned',
      'In Transit': 'in-transit',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
    };

    return statusMap[loadStatus] || 'pending';
  }

  // Get real-time load count by status across all portals
  public getRealTimeLoadCounts(): Record<string, number> {
    const counts: Record<string, number> = {};

    this.currentLoads.forEach((load) => {
      counts[load.status] = (counts[load.status] || 0) + 1;
    });

    return counts;
  }

  // Force immediate synchronization across all loadboards
  public forceSynchronization(): void {
    this.synchronizeAllLoadboards();
    this.notifyAllSubscribers();
    console.info('🔄 Force synchronization completed across all loadboards');
  }
}

// Interfaces for the unified loadboard system
export interface LoadboardFilters {
  status?: string;
  equipment?: string;
  brokerId?: string;
  dispatcherId?: string;
  driverId?: string;
  shipperId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface LoadActivity {
  timestamp: string;
  action: string;
  portal: string;
  user: string;
  details: string;
}

export interface CrossPortalRelationships {
  brokerPortal?: {
    loadId: string;
    brokerId?: string;
    brokerName?: string;
    shipperId?: string;
    shipperName?: string;
    status: string;
    lastUpdated: string;
  };
  dispatchCentral?: {
    loadId: string;
    dispatcherId?: string;
    dispatcherName?: string;
    assignmentDate?: string;
    status: string;
    lastUpdated: string;
  };
  vendorPortal?: {
    loadId: string;
    shipperId?: string;
    shipperName?: string;
    shipmentStatus: string;
    lastUpdated: string;
  };
  carrierPortal?: {
    loadId: string;
    driverId?: string;
    driverName?: string;
    vehicleInfo?: any;
    status: string;
    lastUpdated: string;
  };
}

// Export singleton instance
export const unifiedLoadboardService = UnifiedLoadboardService.getInstance();
