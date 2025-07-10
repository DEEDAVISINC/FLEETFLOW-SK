# 🔗 FleetFlow Free API Integration Plan

## Executive Summary

FleetFlow is ready for strategic integration with four key free APIs that will significantly enhance operational efficiency, financial management, and load board capabilities. **All integrations are designed as optional, user-configurable features** that can be enabled/disabled based on individual business needs and preferences.

This document provides specific implementation points, code examples, and integration strategies for:

1. **QuickBooks API** - *Optional* financial integration and invoice management
2. **Google Maps Platform (TOLL)** - *Optional* toll calculation and route optimization  
3. **DAT API** - *Optional* load board integration and rate benchmarking
4. **Uber Freight API** - *Optional* load marketplace and automated load matching

### **🎛️ User Control Philosophy**
- **Modular Design**: Each API integration can be independently enabled/disabled
- **Granular Settings**: Users control specific features within each integration
- **Graceful Fallbacks**: System works perfectly without any external APIs
- **No Vendor Lock-in**: Users can choose which services to use based on their workflow

---

## 🧾 1. QuickBooks API Integration *(Optional)*

### **Current State Analysis**
FleetFlow already has a sophisticated invoice management system with:
- Professional invoice generation (`/app/components/DispatchInvoice.tsx`)
- Invoice status tracking (Pending/Sent/Paid/Overdue)
- Financial dashboard (`/app/financials/page.tsx`)
- Invoice service layer (`/app/services/invoiceService.ts`)

**Optional Integration**: Users can choose to enable QuickBooks sync to complement their existing accounting workflow, or continue using FleetFlow's built-in financial management.

### **Integration Points**

#### **A. Invoice Export to QuickBooks**
**File**: `/app/services/quickbooksService.ts` (NEW)
```typescript
export class QuickBooksService {
  private accessToken: string;
  private companyId: string;

  async exportInvoiceToQuickBooks(invoiceData: InvoiceData): Promise<{success: boolean, qbInvoiceId?: string}> {
    const qbInvoice = {
      Line: [{
        Amount: invoiceData.dispatchFee,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "1", // Dispatch Services item in QB
            name: "Dispatch Services"
          }
        }
      }],
      CustomerRef: {
        value: invoiceData.carrierName
      }
    };

    const response = await fetch(`https://sandbox-quickbooks.api.intuit.com/v3/company/${this.companyId}/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qbInvoice)
    });

    return response.json();
  }

  async syncPaymentStatus(invoiceId: string, status: 'paid' | 'overdue'): Promise<boolean> {
    // Update payment status in QuickBooks
    // Implementation for payment tracking
  }
}
```

**Integration Location**: `/app/components/InvoiceCreationModal.tsx`
```typescript
// Add to existing invoice creation workflow with optional QB sync
const createInvoice = async () => {
  const settingsService = new UserSettingsService();
  const settings = await settingsService.getSettings(userId);
  
  // Always create invoice in FleetFlow first
  const invoice = await createInvoiceInSystem(invoiceData);
  
  // Optional: Export to QuickBooks if enabled by user
  if (settings.quickbooks.enabled && settings.quickbooks.syncInvoices) {
    try {
      const qbService = new QuickBooksService();
      const qbResult = await qbService.exportInvoiceToQuickBooks(invoiceData, userId);
      
      if (qbResult.success) {
        invoice.quickbooksId = qbResult.qbInvoiceId;
        showNotification('Invoice created and synced to QuickBooks', 'success');
      }
    } catch (error) {
      // Graceful fallback - invoice still works without QB
      console.warn('QuickBooks sync failed:', error);
      showNotification('Invoice created (QuickBooks sync failed)', 'warning');
    }
  } else {
    showNotification('Invoice created successfully', 'success');
  }

  return invoice;
};
```

#### **B. Expense Management Integration**
**File**: `/app/financials/page.tsx` (ENHANCE EXISTING)
```typescript
// Add to existing expense interface
interface Expense {
  id: string;
  category: 'fuel' | 'maintenance' | 'tolls' | 'permits' | 'other';
  amount: number;
  description: string;
  date: string;
  vehicleId?: string;
  receipt?: string;
  quickbooksId?: string; // NEW: QB expense ID
  syncStatus?: 'pending' | 'synced' | 'failed'; // NEW: Sync tracking
}

const syncExpenseToQuickBooks = async (expense: Expense) => {
  const qbService = new QuickBooksService();
  const qbExpense = {
    AccountRef: {
      value: getCategoryAccountId(expense.category)
    },
    Amount: expense.amount,
    PaymentType: "Cash"
  };
  
  return await qbService.createExpense(qbExpense);
};
```

#### **C. Financial Dashboard Integration**
**Enhancement Location**: `/app/analytics/page.tsx`
```typescript
// Add QuickBooks financial sync dashboard
const QuickBooksSync = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">
      QuickBooks Integration
    </h3>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {syncedInvoices}
        </div>
        <div className="text-sm text-gray-500">Synced Invoices</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">
          {syncedExpenses}
        </div>
        <div className="text-sm text-gray-500">Synced Expenses</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">
          {pendingSync}
        </div>
        <div className="text-sm text-gray-500">Pending Sync</div>
      </div>
    </div>
  </div>
);
```

---

## 🛣️ 2. Google Maps TOLL Enhancement *(Build on Existing Integration)*

### **Current State Analysis**
FleetFlow already has extensive Google Maps integration:
- Route planning (`/app/components/GoogleMaps.tsx`) ✅ **Already Implemented**
- Route optimization (`/app/services/route-optimization.ts`) ✅ **Already Implemented**
- Distance/time calculation (`/app/api/routes/optimize/route.ts`) ✅ **Already Implemented**
- Live tracking maps (`/app/tracking/components/LiveTrackingMap.tsx`) ✅ **Already Implemented**
- Route generation utilities (`/src/route-generator/templates/utils/maps-integration.js`) ✅ **Already Implemented**

**Enhancement Opportunity**: Add TOLL calculation and cost analysis to the existing Google Maps integration without requiring new API subscriptions or major changes.

### **Implementation Strategy**
Since the Google Maps API is already integrated, we can enhance the existing services to include toll calculation by:
1. **Comparing toll vs. no-toll routes** using existing Directions API
2. **Adding toll cost estimation** based on distance and vehicle type
3. **Enhancing route optimization** to factor in toll costs
4. **Providing user preferences** for toll vs. time trade-offs

### **Key Enhancement Points**

#### **A. Toll Calculation Service Enhancement**
**File**: `/app/services/tollCalculationService.ts` (NEW - Builds on existing Google Maps API)
```typescript
export class TollCalculationService {
  private apiKey: string;

  constructor() {
    // Uses the same API key as existing Google Maps integration
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  }

  async calculateTollCosts(origin: string, destination: string, vehicleType: 'truck' | 'car' = 'truck'): Promise<TollInfo> {
    // Leverage existing Google Maps API to compare toll vs. no-toll routes
    const [tollRoute, noTollRoute] = await Promise.all([
      this.getDirectionsRoute(origin, destination, { avoidTolls: false }),
      this.getDirectionsRoute(origin, destination, { avoidTolls: true })
    ]);

    return this.analyzeTollOptions(tollRoute, noTollRoute, vehicleType);
  }

  private async getDirectionsRoute(origin: string, destination: string, options: {avoidTolls: boolean}) {
    const avoid = options.avoidTolls ? '&avoid=tolls' : '';
    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&alternatives=true&departure_time=now&traffic_model=best_guess` +
      `${avoid}&key=${this.apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.routes[0];
  }

  private analyzeTollOptions(tollRoute: any, noTollRoute: any, vehicleType: 'truck' | 'car'): TollInfo {
    const tollDistance = tollRoute.legs.reduce((sum: number, leg: any) => sum + leg.distance.value, 0);
    const tollDuration = tollRoute.legs.reduce((sum: number, leg: any) => sum + leg.duration.value, 0);
    
    const noTollDistance = noTollRoute.legs.reduce((sum: number, leg: any) => sum + leg.distance.value, 0);
    const noTollDuration = noTollRoute.legs.reduce((sum: number, leg: any) => sum + leg.duration.value, 0);

    const estimatedTollCost = this.estimateTollCost(tollDistance, vehicleType);
    const timeSavings = Math.round((noTollDuration - tollDuration) / 60); // minutes

    return {
      tollRoute: {
        distance: this.formatDistance(tollDistance),
        duration: this.formatDuration(tollDuration),
        estimatedCost: estimatedTollCost
      },
      noTollRoute: {
        distance: this.formatDistance(noTollDistance),
        duration: this.formatDuration(noTollDuration),
        timePenalty: Math.max(0, timeSavings)
      },
      recommendation: timeSavings > 30 && estimatedTollCost < 25 ? 'toll' : 'no-toll'
    };
  }

  private estimateTollCost(distanceMeters: number, vehicleType: string): number {
    const miles = distanceMeters * 0.000621371;
    const baseCostPerMile = vehicleType === 'truck' ? 0.18 : 0.10;
    return Math.round(miles * baseCostPerMile * 100) / 100;
  }
}
```

#### **B. Existing Route Planner Enhancement**
**Enhancement Location**: `/app/components/GoogleMaps.tsx` (ENHANCE EXISTING)
```typescript
// Enhance the existing RoutePlanner component with toll analysis
import { tollCalculator, TollInfo } from '@/services/tollCalculationService'

export function RoutePlanner({ onRouteCalculated }: RoutePlannerProps) {
  // ...existing state...
  const [tollInfo, setTollInfo] = useState<TollInfo | null>(null)
  const [tollPreference, setTollPreference] = useState<'fastest' | 'cheapest' | 'balanced'>('balanced')

  const calculateRoute = async () => {
    // Existing route calculation PLUS toll analysis
    const tollData = await tollCalculator.calculateTollCosts(origin, destination, vehicleType)
    setTollInfo(tollData)

    const mockRoute: RouteInfo = {
      distance: '1,247 miles',
      duration: '19h 32m',
      fuelCost: `$${(1247 / parseFloat(mpg) * parseFloat(fuelPrice)).toFixed(2)}`,
      tollCost: tollData.tollRoute?.estimatedCost ? `$${tollData.tollRoute.estimatedCost}` : '$87.50',
      optimizedRoute: [origin, ...waypoints.filter(w => w.trim()), destination],
      tollRecommendation: tollData.recommendation
    };

    setRouteInfo(mockRoute);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Existing form fields PLUS new toll preferences */}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Route Preference
        </label>
        <select
          value={tollPreference}
          onChange={(e) => setTollPreference(e.target.value as any)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="fastest">⚡ Fastest Route (including tolls)</option>
          <option value="cheapest">💰 Cheapest Route (avoid tolls)</option>
          <option value="balanced">⚖️ Balanced (best time/cost ratio)</option>
        </select>
      </div>

      {/* NEW: Toll comparison display */}
      {tollInfo && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">🛣️ Route Options</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border-l-4 border-green-500 pl-3">
              <div className="font-medium">Toll Route</div>
              <div>Distance: {tollInfo.tollRoute?.distance}</div>
              <div>Time: {tollInfo.tollRoute?.duration}</div>
              <div className="text-green-600 font-medium">
                Toll Cost: ${tollInfo.tollRoute?.estimatedCost}
              </div>
            </div>
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="font-medium">No-Toll Route</div>
              <div>Distance: {tollInfo.noTollRoute?.distance}</div>
              <div>Time: {tollInfo.noTollRoute?.duration}</div>
              <div className="text-blue-600 font-medium">
                Time Penalty: +{tollInfo.noTollRoute?.timePenalty} min
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### **C. Existing Route Optimization Enhancement**
**Enhancement Location**: `/app/services/route-optimization.ts` (ENHANCE EXISTING)
```typescript
import { tollCalculator } from './tollCalculationService'

export class RouteOptimizationService {
  // ...existing code remains the same...

  // ENHANCE existing optimizeRoutes method with toll analysis
  async optimizeRoutes(request: RouteOptimizationRequest): Promise<OptimizedRoute[]> {
    try {
      console.log('🚛 Starting route optimization with toll analysis...')
      
      // Existing optimization logic
      if (!this.isRealApiKey()) {
        return this.mockOptimization(request)
      }

      const matrix = await this.getDistanceMatrix(request.vehicles, request.stops)
      const optimizedRoutes = await this.runOptimizationAlgorithm(request, matrix)
      
      // NEW: Add toll analysis to existing routes
      const routesWithTollAnalysis = await this.addTollAnalysis(optimizedRoutes, request.constraints)
      
      return routesWithTollAnalysis
    } catch (error) {
      return this.mockOptimization(request)
    }
  }

  // NEW: Add toll analysis to optimized routes
  private async addTollAnalysis(routes: OptimizedRoute[], constraints: any): Promise<OptimizedRoute[]> {
    for (const route of routes) {
      if (route.stops.length > 1) {
        const tollInfo = await tollCalculator.calculateTollCosts(
          route.stops[0].address,
          route.stops[route.stops.length - 1].address,
          'truck'
        );

        // Update route costs with accurate toll data
        if (tollInfo.tollRoute) {
          route.tollCost = tollInfo.tollRoute.estimatedCost;
          route.estimatedCost = route.fuelCost + route.tollCost + (route.totalDuration / 60) * 25;
          
          // Add toll efficiency factor
          if (tollInfo.recommendation === 'toll') {
            route.efficiency += 5; // Bonus for time savings
          }
        }
      }
    }

    return routes;
  }

  // ENHANCE existing mockOptimization with toll data
  private mockOptimization(request: RouteOptimizationRequest): OptimizedRoute[] {
    // ...existing mock logic...
    
    // ENHANCED: More realistic toll costs based on avoid tolls setting
    routes.forEach(route => {
      if (request.constraints.avoidTolls) {
        route.tollCost = 0;
        route.warnings.push('Route avoiding tolls - may take longer');
      } else {
        route.tollCost = route.totalDistance * 0.12; // $0.12/mile realistic toll rate
        if (route.tollCost > 50) {
          route.warnings.push(`High toll cost: $${route.tollCost.toFixed(2)}`);
        }
      }
      
      // Recalculate total cost
      route.estimatedCost = route.fuelCost + route.tollCost + (route.totalDuration / 60) * 25;
    });

    return routes;
  }
}
```

---

## 📋 3. DAT API Integration *(Optional)*

### **Current State Analysis**
FleetFlow has load management infrastructure:
- Load posting (`/app/broker/page.tsx`)
- Load board display (`/app/dispatch/page.tsx`)
- Load API endpoints (`/app/api/loads/route.ts`)

**Optional Enhancement**: Users can enable DAT integration to access additional load opportunities and rate benchmarking, or continue using FleetFlow's built-in load management system.

### **Integration Points**

#### **A. DAT Load Board Service**
**File**: `/app/services/datLoadBoardService.ts` (NEW)
```typescript
export class DATLoadBoardService {
  private apiKey: string;
  private baseUrl = 'https://freight.api.dat.com/posting/v2';

  constructor() {
    this.apiKey = process.env.DAT_API_KEY!;
  }

  async postLoadToDAT(loadData: LoadData): Promise<{success: boolean, postingId?: string}> {
    const datLoad = {
      equipmentType: this.mapEquipmentType(loadData.equipment),
      origin: {
        city: loadData.origin.split(',')[0],
        state: loadData.origin.split(',')[1]?.trim().split(' ')[0]
      },
      destination: {
        city: loadData.destination.split(',')[0],
        state: loadData.destination.split(',')[1]?.trim().split(' ')[0]
      },
      pickup: {
        earliest: loadData.pickupDate,
        latest: loadData.pickupDate
      },
      delivery: {
        earliest: loadData.deliveryDate,
        latest: loadData.deliveryDate
      },
      weight: loadData.weight,
      length: loadData.length,
      rate: {
        lineHaulRate: loadData.rate,
        currency: 'USD'
      },
      comments: loadData.specialRequirements?.join(', ')
    };

    const response = await fetch(`${this.baseUrl}/loads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datLoad)
    });

    const result = await response.json();
    return {
      success: response.ok,
      postingId: result.id
    };
  }

  async searchLoads(criteria: LoadSearchCriteria): Promise<DATLoad[]> {
    const searchParams = new URLSearchParams({
      equipmentType: criteria.equipmentType,
      originRadius: criteria.originRadius?.toString() || '100',
      destinationRadius: criteria.destinationRadius?.toString() || '100',
      pickup: criteria.pickupDate
    });

    if (criteria.origin) {
      searchParams.append('originCity', criteria.origin.city);
      searchParams.append('originState', criteria.origin.state);
    }

    const response = await fetch(`${this.baseUrl}/loads/search?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    return response.json();
  }

  async getRateAnalytics(lane: {origin: string, destination: string}, equipmentType: string): Promise<RateAnalytics> {
    // DAT Rate Analytics API integration
    const response = await fetch(`${this.baseUrl}/rates/trends`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        origin: lane.origin,
        destination: lane.destination,
        equipmentType,
        period: '30days'
      })
    });

    return response.json();
  }

  private mapEquipmentType(fleetFlowType: string): string {
    const mapping = {
      'Dry Van': 'V',
      'Refrigerated': 'R',
      'Flatbed': 'F',
      'Stepdeck': 'SD',
      'Lowboy': 'LB'
    };
    return mapping[fleetFlowType] || 'V';
  }
}
```

#### **B. Broker Box Enhancement**
**Enhancement Location**: `/app/broker/page.tsx`
```typescript
// Add DAT integration to existing broker interface
const BrokerPage = () => {
  const [datIntegration, setDatIntegration] = useState({
    autoPost: false,
    searchEnabled: true,
    rateAnalytics: true
  });

  const handleLoadPost = async (loadData: LoadData) => {
    // Existing load posting logic...
    
    // NEW: Auto-post to DAT if enabled
    if (datIntegration.autoPost) {
      const datService = new DATLoadBoardService();
      const datResult = await datService.postLoadToDAT(loadData);
      
      if (datResult.success) {
        setNotification({
          type: 'success',
          message: `Load posted to DAT (ID: ${datResult.postingId})`
        });
        
        // Store DAT posting ID
        loadData.datPostingId = datResult.postingId;
      }
    }
  };

  const searchDATLoads = async () => {
    const datService = new DATLoadBoardService();
    const availableLoads = await datService.searchLoads({
      equipmentType: selectedEquipment,
      origin: { city: originCity, state: originState },
      destination: { city: destCity, state: destState },
      pickupDate: selectedDate,
      originRadius: 100,
      destinationRadius: 100
    });

    setExternalLoads(availableLoads);
  };

  return (
    <div className="space-y-6">
      {/* Existing broker interface... */}
      
      {/* NEW: DAT Integration Panel */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          DAT Load Board Integration
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Post to DAT</h4>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={datIntegration.autoPost}
                onChange={(e) => setDatIntegration({
                  ...datIntegration,
                  autoPost: e.target.checked
                })}
                className="mr-2"
              />
              Auto-post new loads to DAT
            </label>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Search DAT Loads</h4>
            <button
              onClick={searchDATLoads}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Search Available Loads
            </button>
          </div>
        </div>

        {/* Display external loads */}
        {externalLoads.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Available DAT Loads</h4>
            <div className="space-y-2">
              {externalLoads.map(load => (
                <div key={load.id} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">
                        {load.origin.city}, {load.origin.state} → {load.destination.city}, {load.destination.state}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {load.weight} lbs | {load.equipmentType}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        ${load.rate.lineHaulRate}
                      </div>
                      <button className="text-blue-600 text-sm hover:underline">
                        Import Load
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

#### **C. Rate Analytics Dashboard**
**File**: `/app/components/RateAnalyticsDashboard.tsx` (NEW)
```typescript
export const RateAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<RateAnalytics | null>(null);
  const [lane, setLane] = useState({ origin: '', destination: '' });

  const fetchRateAnalytics = async () => {
    const datService = new DATLoadBoardService();
    const data = await datService.getRateAnalytics(lane, 'Dry Van');
    setAnalytics(data);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        DAT Rate Analytics
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          placeholder="Origin (City, ST)"
          value={lane.origin}
          onChange={(e) => setLane({...lane, origin: e.target.value})}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          placeholder="Destination (City, ST)"
          value={lane.destination}
          onChange={(e) => setLane({...lane, destination: e.target.value})}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>
      
      <button
        onClick={fetchRateAnalytics}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Get Rate Analytics
      </button>

      {analytics && (
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              ${analytics.averageRate}
            </div>
            <div className="text-sm text-gray-600">Average Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              ${analytics.highRate}
            </div>
            <div className="text-sm text-gray-600">High Rate</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">
              ${analytics.lowRate}
            </div>
            <div className="text-sm text-gray-600">Low Rate</div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 🚛 4. Uber Freight API Integration *(Optional)*

### **Current State Analysis**
FleetFlow has AI dispatch capabilities:
- AI dispatch matching (`/app/api/ai/dispatch-match/route.ts`)
- Load assignment system (`/app/dispatch/page.tsx`)
- Carrier management infrastructure

**Optional Enhancement**: Users can enable Uber Freight integration to access additional load opportunities and carrier networks, or continue using FleetFlow's built-in AI dispatch system.

### **Integration Points**

#### **A. Uber Freight Marketplace Service**
**File**: `/app/services/uberFreightService.ts` (NEW)
```typescript
export class UberFreightService {
  private apiKey: string;
  private baseUrl = 'https://api.uberfreight.com/v1';

  constructor() {
    this.apiKey = process.env.UBER_FREIGHT_API_KEY!;
  }

  async searchLoads(criteria: UberFreightSearchCriteria): Promise<UberFreightLoad[]> {
    const searchParams = {
      pickup_location: {
        latitude: criteria.pickup.lat,
        longitude: criteria.pickup.lng,
        radius_miles: criteria.pickupRadius || 50
      },
      dropoff_location: {
        latitude: criteria.dropoff.lat,
        longitude: criteria.dropoff.lng,
        radius_miles: criteria.dropoffRadius || 50
      },
      pickup_window: {
        start: criteria.pickupStart,
        end: criteria.pickupEnd
      },
      equipment_type: criteria.equipmentType
    };

    const response = await fetch(`${this.baseUrl}/loads/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    });

    return response.json();
  }

  async bookLoad(loadId: string, carrierInfo: CarrierInfo): Promise<BookingResult> {
    const bookingData = {
      load_id: loadId,
      carrier: {
        name: carrierInfo.name,
        mc_number: carrierInfo.mcNumber,
        contact: carrierInfo.contact
      },
      driver: carrierInfo.driver
    };

    const response = await fetch(`${this.baseUrl}/loads/${loadId}/book`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    return response.json();
  }

  async getLoadStatus(loadId: string): Promise<UberFreightLoadStatus> {
    const response = await fetch(`${this.baseUrl}/loads/${loadId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    return response.json();
  }

  async postCapacity(capacity: CapacityPosting): Promise<{success: boolean, capacityId?: string}> {
    const capacityData = {
      equipment_type: capacity.equipmentType,
      origin_location: capacity.origin,
      destination_location: capacity.destination,
      available_date: capacity.availableDate,
      rate_per_mile: capacity.ratePerMile,
      contact_info: capacity.contact
    };

    const response = await fetch(`${this.baseUrl}/capacity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(capacityData)
    });

    const result = await response.json();
    return {
      success: response.ok,
      capacityId: result.id
    };
  }
}
```

#### **B. AI Dispatch Enhancement**
**Enhancement Location**: `/app/api/ai/dispatch-match/route.ts`
```typescript
export async function POST(request: NextRequest) {
  try {
    const { load, carriers } = await request.json();

    // Existing AI dispatch logic...

    // NEW: Include Uber Freight options
    const uberFreightService = new UberFreightService();
    
    // Search for available carriers on Uber Freight
    const uberCarriers = await uberFreightService.searchLoads({
      pickup: { lat: load.pickupCoords.lat, lng: load.pickupCoords.lng },
      dropoff: { lat: load.destCoords.lat, lng: load.destCoords.lng },
      pickupStart: load.pickupDate,
      pickupEnd: load.pickupDate,
      equipmentType: load.equipment.toLowerCase()
    });

    // Merge external carriers with internal fleet
    const allCarriers = [
      ...carriers.map(c => ({...c, source: 'internal'})),
      ...uberCarriers.map(uc => ({
        id: `uber_${uc.id}`,
        name: uc.carrier.name,
        source: 'uber_freight',
        rate: uc.rate,
        equipment: uc.equipment_type,
        rating: uc.carrier.rating
      }))
    ];

    // Enhanced AI matching with external options
    const matches = allCarriers.map(carrier => {
      const score = calculateMatchScore(load, carrier);
      const externalBonus = carrier.source === 'uber_freight' ? 5 : 0; // Slight preference for network expansion
      
      return {
        carrier,
        score: score + externalBonus,
        confidence: calculateConfidence(load, carrier),
        reasoning: generateReasoning(load, carrier),
        isExternal: carrier.source !== 'internal'
      };
    }).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      matches: matches.slice(0, 5), // Top 5 matches
      recommendations: {
        primary: matches[0],
        alternatives: matches.slice(1, 3),
        externalOptions: matches.filter(m => m.isExternal).slice(0, 2)
      }
    });

  } catch (error) {
    console.error('Enhanced AI dispatch matching failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to find carrier matches'
    }, { status: 500 });
  }
}
```

#### **C. Dispatch Dashboard Enhancement**
**Enhancement Location**: `/app/dispatch/page.tsx`
```typescript
// Add Uber Freight integration to dispatch interface
const DispatchPage = () => {
  const [externalOptions, setExternalOptions] = useState<ExternalLoadOption[]>([]);
  const [showExternalLoads, setShowExternalLoads] = useState(false);

  const searchExternalLoads = async () => {
    const uberFreightService = new UberFreightService();
    
    // Search for loads that match our capacity
    const availableLoads = await Promise.all(
      availableDrivers.map(async driver => {
        const loads = await uberFreightService.searchLoads({
          pickup: driver.currentLocation,
          dropoff: driver.homeBase,
          pickupStart: new Date().toISOString(),
          pickupEnd: new Date(Date.now() + 86400000).toISOString(), // 24 hours
          equipmentType: driver.equipmentType,
          pickupRadius: 100,
          dropoffRadius: 100
        });
        
        return loads.map(load => ({
          ...load,
          matchedDriver: driver.id,
          estimatedProfit: load.rate - (load.miles * driver.costPerMile)
        }));
      })
    );

    setExternalOptions(availableLoads.flat());
    setShowExternalLoads(true);
  };

  const bookExternalLoad = async (load: UberFreightLoad, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    const uberFreightService = new UberFreightService();
    const booking = await uberFreightService.bookLoad(load.id, {
      name: company.name,
      mcNumber: company.mcNumber,
      contact: company.dispatch.phone,
      driver: {
        name: driver.name,
        phone: driver.phone,
        license: driver.licenseNumber
      }
    });

    if (booking.success) {
      // Add to internal load management
      const internalLoad = {
        id: `UF_${load.id}`,
        origin: load.pickup.address,
        destination: load.dropoff.address,
        rate: load.rate,
        status: 'assigned',
        assignedDriver: driverId,
        externalSource: 'uber_freight',
        externalId: load.id
      };

      setLoads(prev => [...prev, internalLoad]);
      setNotification({
        type: 'success',
        message: `Successfully booked Uber Freight load ${load.id}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing dispatch interface... */}
      
      {/* NEW: External Load Options */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              External Load Opportunities
            </h3>
            <button
              onClick={searchExternalLoads}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              🔍 Search Uber Freight
            </button>
          </div>

          {showExternalLoads && (
            <div className="space-y-3">
              {externalOptions.map(load => (
                <div key={load.id} className="border border-purple-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {load.pickup.city}, {load.pickup.state} → 
                        {load.dropoff.city}, {load.dropoff.state}
                      </div>
                      <div className="text-sm text-gray-600">
                        {load.miles} miles | {load.equipment_type} | 
                        Pickup: {new Date(load.pickup_window.start).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-purple-600">
                        Matched Driver: {drivers.find(d => d.id === load.matchedDriver)?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${load.rate.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Est. Profit: ${load.estimatedProfit?.toLocaleString()}
                      </div>
                      <button
                        onClick={() => bookExternalLoad(load, load.matchedDriver)}
                        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Book Load
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 🛠️ User Settings & Configuration System

### **Overview**
All API integrations are **completely optional** and user-configurable. Users can enable/disable each integration independently based on their business needs, existing workflows, and preferences.

### **A. User Settings Service**
**File**: `/app/services/userSettingsService.ts` (NEW)
```typescript
export interface APIIntegrationSettings {
  quickbooks: {
    enabled: boolean;
    autoSync: boolean;
    syncInvoices: boolean;
    syncExpenses: boolean;
    accessToken?: string;
    companyId?: string;
  };
  googleMapsToll: {
    enabled: boolean;
    defaultRoutePreference: 'fastest' | 'cheapest' | 'balanced';
    showTollComparison: boolean;
    vehicleType: 'truck' | 'car';
  };
  datLoadBoard: {
    enabled: boolean;
    autoPost: boolean;
    searchEnabled: boolean;
    rateAnalytics: boolean;
    apiKey?: string;
  };
  uberFreight: {
    enabled: boolean;
    autoSearch: boolean;
    capacityPosting: boolean;
    apiKey?: string;
  };
}

export class UserSettingsService {
  private settings: APIIntegrationSettings | null = null;

  async getSettings(userId: string): Promise<APIIntegrationSettings> {
    if (!this.settings) {
      // Load from database or use defaults
      this.settings = await this.loadUserSettings(userId) || this.getDefaultSettings();
    }
    return this.settings;
  }

  async updateSettings(userId: string, updates: Partial<APIIntegrationSettings>): Promise<void> {
    const currentSettings = await this.getSettings(userId);
    this.settings = { ...currentSettings, ...updates };
    await this.saveUserSettings(userId, this.settings);
  }

  async isIntegrationEnabled(userId: string, integration: keyof APIIntegrationSettings): Promise<boolean> {
    const settings = await this.getSettings(userId);
    return settings[integration].enabled;
  }

  private getDefaultSettings(): APIIntegrationSettings {
    return {
      quickbooks: {
        enabled: false,
        autoSync: false,
        syncInvoices: false,
        syncExpenses: false
      },
      googleMapsToll: {
        enabled: false,
        defaultRoutePreference: 'balanced',
        showTollComparison: true,
        vehicleType: 'truck'
      },
      datLoadBoard: {
        enabled: false,
        autoPost: false,
        searchEnabled: false,
        rateAnalytics: false
      },
      uberFreight: {
        enabled: false,
        autoSearch: false,
        capacityPosting: false
      }
    };
  }

  private async loadUserSettings(userId: string): Promise<APIIntegrationSettings | null> {
    // Implementation for loading from database
    // Could use Supabase, localStorage, or other storage
    return null;
  }

  private async saveUserSettings(userId: string, settings: APIIntegrationSettings): Promise<void> {
    // Implementation for saving to database
  }
}
```

### **B. API Integrations Settings UI**
**File**: `/app/components/APIIntegrationsSettings.tsx` (NEW)
```typescript
import { useState, useEffect } from 'react';
import { UserSettingsService, APIIntegrationSettings } from '@/services/userSettingsService';

export const APIIntegrationsSettings = ({ userId }: { userId: string }) => {
  const [settings, setSettings] = useState<APIIntegrationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const settingsService = new UserSettingsService();

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getSettings(userId);
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (integration: keyof APIIntegrationSettings, updates: any) => {
    if (!settings) return;

    setSaving(true);
    try {
      const newSettings = {
        ...settings,
        [integration]: { ...settings[integration], ...updates }
      };
      
      await settingsService.updateSettings(userId, newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (!settings) return <div>Failed to load settings</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            API Integrations Settings
          </h3>
          
          {/* QuickBooks Integration */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">QuickBooks Integration</h4>
                <p className="text-sm text-gray-500">Sync invoices and expenses with QuickBooks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.quickbooks.enabled}
                  onChange={(e) => updateSetting('quickbooks', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.quickbooks.enabled && (
              <div className="ml-4 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.quickbooks.autoSync}
                    onChange={(e) => updateSetting('quickbooks', { autoSync: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Auto-sync new invoices and expenses</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.quickbooks.syncInvoices}
                    onChange={(e) => updateSetting('quickbooks', { syncInvoices: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sync invoices to QuickBooks</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.quickbooks.syncExpenses}
                    onChange={(e) => updateSetting('quickbooks', { syncExpenses: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sync expenses to QuickBooks</span>
                </label>
              </div>
            )}
          </div>

          {/* Google Maps TOLL Integration */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">Google Maps TOLL Calculation</h4>
                <p className="text-sm text-gray-500">Enhanced route planning with toll cost analysis</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.googleMapsToll.enabled}
                  onChange={(e) => updateSetting('googleMapsToll', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.googleMapsToll.enabled && (
              <div className="ml-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Route Preference
                  </label>
                  <select
                    value={settings.googleMapsToll.defaultRoutePreference}
                    onChange={(e) => updateSetting('googleMapsToll', { 
                      defaultRoutePreference: e.target.value as 'fastest' | 'cheapest' | 'balanced' 
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="fastest">Fastest Route (including tolls)</option>
                    <option value="cheapest">Cheapest Route (avoid tolls)</option>
                    <option value="balanced">Balanced (best time/cost ratio)</option>
                  </select>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.googleMapsToll.showTollComparison}
                    onChange={(e) => updateSetting('googleMapsToll', { showTollComparison: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show toll vs. no-toll route comparison</span>
                </label>
              </div>
            )}
          </div>

          {/* DAT Load Board Integration */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">DAT Load Board</h4>
                <p className="text-sm text-gray-500">Access to DAT load marketplace and rate analytics</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.datLoadBoard.enabled}
                  onChange={(e) => updateSetting('datLoadBoard', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.datLoadBoard.enabled && (
              <div className="ml-4 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.datLoadBoard.autoPost}
                    onChange={(e) => updateSetting('datLoadBoard', { autoPost: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Auto-post new loads to DAT</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.datLoadBoard.searchEnabled}
                    onChange={(e) => updateSetting('datLoadBoard', { searchEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enable DAT load search</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.datLoadBoard.rateAnalytics}
                    onChange={(e) => updateSetting('datLoadBoard', { rateAnalytics: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show DAT rate analytics</span>
                </label>
              </div>
            )}
          </div>

          {/* Uber Freight Integration */}
          <div className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">Uber Freight</h4>
                <p className="text-sm text-gray-500">Access to Uber Freight marketplace and capacity posting</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.uberFreight.enabled}
                  onChange={(e) => updateSetting('uberFreight', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {settings.uberFreight.enabled && (
              <div className="ml-4 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.uberFreight.autoSearch}
                    onChange={(e) => updateSetting('uberFreight', { autoSearch: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Auto-search for matching loads</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.uberFreight.capacityPosting}
                    onChange={(e) => updateSetting('uberFreight', { capacityPosting: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enable capacity posting</span>
                </label>
              </div>
            )}
          </div>

          {saving && (
            <div className="mt-4 text-sm text-blue-600">
              Saving settings...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### **C. Integration Guard Functions**
Each service will check user settings before executing:

```typescript
// Example: Enhanced QuickBooks Service with user settings check
export class QuickBooksService {
  private settingsService = new UserSettingsService();

  async exportInvoiceToQuickBooks(invoiceData: InvoiceData, userId: string): Promise<{success: boolean, qbInvoiceId?: string}> {
    // Check if integration is enabled
    const settings = await this.settingsService.getSettings(userId);
    if (!settings.quickbooks.enabled || !settings.quickbooks.syncInvoices) {
      return { success: false, error: 'QuickBooks integration disabled' };
    }

    // Proceed with integration...
    return this.processInvoiceExport(invoiceData);
  }
}

// Example: Enhanced Route Planning with optional toll calculation
export function RoutePlanner({ userId, onRouteCalculated }: RoutePlannerProps) {
  const [settings, setSettings] = useState<APIIntegrationSettings | null>(null);
  const settingsService = new UserSettingsService();

  useEffect(() => {
    settingsService.getSettings(userId).then(setSettings);
  }, [userId]);

  const calculateRoute = async () => {
    // Standard route calculation...
    const routeInfo = await calculateBasicRoute(origin, destination);

    // Optional toll calculation
    if (settings?.googleMapsToll.enabled) {
      const tollService = new TollCalculationService();
      const tollData = await tollService.calculateTollCosts(origin, destination);
      routeInfo.tollOptions = tollData;
    }

    onRouteCalculated(routeInfo);
  };

  return (
    <div>
      {/* Route planning form */}
      
      {/* Show toll options only if enabled */}
      {settings?.googleMapsToll.enabled && settings.googleMapsToll.showTollComparison && (
        <TollComparisonPanel />
      )}
    </div>
  );
}
```

### **D. Graceful Fallbacks**
When integrations are disabled, the app continues functioning normally:

```typescript
// Example: Enhanced invoice creation with optional QB sync
const createInvoice = async (invoiceData: InvoiceData) => {
  // Always create invoice in FleetFlow
  const invoice = await createInvoiceInSystem(invoiceData);

  // Optional QuickBooks sync
  const settings = await settingsService.getSettings(userId);
  if (settings.quickbooks.enabled && settings.quickbooks.syncInvoices) {
    try {
      const qbService = new QuickBooksService();
      const qbResult = await qbService.exportInvoiceToQuickBooks(invoiceData, userId);
      
      if (qbResult.success) {
        invoice.quickbooksId = qbResult.qbInvoiceId;
        showNotification('Invoice synced to QuickBooks', 'success');
      }
    } catch (error) {
      // Silent failure - invoice still created
      console.warn('QuickBooks sync failed:', error);
      showNotification('Invoice created (QuickBooks sync failed)', 'warning');
    }
  }

  return invoice;
};
```

---

## 🎯 Benefits of Optional Integration Approach

### **For New Users**
- **No Barriers**: Start using FleetFlow immediately without any API setup
- **Learn Gradually**: Master core features before adding external integrations
- **No Costs**: Use FleetFlow's full feature set without additional API expenses
- **Risk-Free Trial**: Evaluate FleetFlow's value before committing to external services

### **For Growing Businesses**
- **Scalable Growth**: Add integrations as operations expand and needs evolve
- **Budget Control**: Enable paid API features only when ROI is clear
- **Workflow Flexibility**: Choose integrations that fit existing business processes
- **Competitive Advantage**: Mix and match services for optimal efficiency

### **For Enterprise Users**
- **Security Control**: Enable only trusted, audited API connections
- **Compliance Management**: Disable integrations that conflict with regulations
- **Data Governance**: Control which external services access company data
- **Vendor Independence**: Avoid lock-in to specific service providers

### **For All Users**
- **Performance**: Disable unused integrations to optimize system speed
- **Simplicity**: Clean, uncluttered interface showing only enabled features
- **Reliability**: Core functionality never depends on external service availability
- **Privacy**: Share data only with chosen service providers
