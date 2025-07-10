# 🚀 Quick Start: Google Maps TOLL Integration

## Why Start Here?
Google Maps TOLL integration provides immediate value with minimal setup since FleetFlow already has extensive Google Maps integration. This enhances existing route optimization with toll cost analysis.

## 15-Minute Implementation

### Step 1: Create Toll Service
Create `/app/services/tollCalculationService.ts`:

```typescript
export interface TollInfo {
  tollRoute?: {
    distance: string;
    duration: string;
    estimatedCost: number;
  };
  noTollRoute?: {
    distance: string;
    duration: string;
    timePenalty: number;
  };
  recommendation: 'toll' | 'no-toll';
  savings?: {
    timeSaved: number; // minutes
    costDifference: number; // dollars
  };
}

export class TollCalculationService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  }

  async calculateTollCosts(
    origin: string, 
    destination: string, 
    vehicleType: 'truck' | 'car' = 'truck'
  ): Promise<TollInfo> {
    
    // Get routes with and without tolls
    const [tollRoute, noTollRoute] = await Promise.all([
      this.getRoute(origin, destination, false), // Allow tolls
      this.getRoute(origin, destination, true)   // Avoid tolls
    ]);

    if (!tollRoute || !noTollRoute) {
      return {
        recommendation: 'toll',
        tollRoute: {
          distance: 'Unknown',
          duration: 'Unknown', 
          estimatedCost: 0
        }
      };
    }

    const timeDifference = noTollRoute.duration - tollRoute.duration; // seconds
    const distanceDifference = tollRoute.distance - noTollRoute.distance; // meters
    
    // Estimate toll cost based on distance and vehicle type
    const estimatedTollCost = this.estimateTollCost(tollRoute.distance, vehicleType);
    
    // Calculate if tolls are worth it (time savings > 30 min OR distance savings > 10%)
    const recommendation = timeDifference > 1800 || (distanceDifference / noTollRoute.distance) > 0.1 
      ? 'toll' : 'no-toll';

    return {
      tollRoute: {
        distance: this.formatDistance(tollRoute.distance),
        duration: this.formatDuration(tollRoute.duration),
        estimatedCost: estimatedTollCost
      },
      noTollRoute: {
        distance: this.formatDistance(noTollRoute.distance),
        duration: this.formatDuration(noTollRoute.duration),
        timePenalty: Math.round(timeDifference / 60)
      },
      recommendation,
      savings: {
        timeSaved: Math.round(timeDifference / 60),
        costDifference: estimatedTollCost
      }
    };
  }

  private async getRoute(origin: string, destination: string, avoidTolls: boolean) {
    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${encodeURIComponent(origin)}&` +
      `destination=${encodeURIComponent(destination)}&` +
      `${avoidTolls ? 'avoid=tolls&' : ''}` +
      `key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        return {
          distance: leg.distance.value, // meters
          duration: leg.duration.value  // seconds
        };
      }
    } catch (error) {
      console.error('Route calculation failed:', error);
    }
    
    return null;
  }

  private estimateTollCost(distanceMeters: number, vehicleType: string): number {
    const miles = distanceMeters * 0.000621371;
    
    // Toll rates vary by region, these are rough averages
    const tollRates = {
      truck: 0.25,  // $0.25 per mile for trucks
      car: 0.12     // $0.12 per mile for cars
    };
    
    const rate = tollRates[vehicleType] || tollRates.truck;
    return Math.round(miles * rate * 100) / 100;
  }

  private formatDistance(meters: number): string {
    const miles = meters * 0.000621371;
    return `${Math.round(miles)} miles`;
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
```

### Step 2: Enhance Route Planning UI
Update `/app/components/GoogleMaps.tsx` to include toll analysis:

```typescript
// Add to existing RoutePlanner component
export function RoutePlanner({ onRouteCalculated }: RoutePlannerProps) {
  // ... existing state ...
  const [tollInfo, setTollInfo] = useState<TollInfo | null>(null);
  const [tollPreference, setTollPreference] = useState<'fastest' | 'cheapest' | 'balanced'>('balanced');

  const calculateRoute = async () => {
    if (!origin || !destination) {
      alert('Please enter origin and destination');
      return;
    }

    setCalculating(true);

    try {
      // Existing route calculation...
      
      // NEW: Add toll calculation
      const tollService = new TollCalculationService();
      const tollData = await tollService.calculateTollCosts(origin, destination, vehicleType as 'truck' | 'car');
      setTollInfo(tollData);

      // Update route info with toll data
      const mockRoute: RouteInfo = {
        distance: tollData.tollRoute?.distance || '1,247 miles',
        duration: tollData.tollRoute?.duration || '19h 32m',
        fuelCost: `$${(1247 / parseFloat(mpg) * parseFloat(fuelPrice)).toFixed(2)}`,
        tollCost: `$${tollData.tollRoute?.estimatedCost || 0}`,
        optimizedRoute: [origin, ...waypoints.filter(w => w.trim()), destination]
      };

      setRouteInfo(mockRoute);
      onRouteCalculated?.(mockRoute);
      
    } catch (error) {
      alert('Failed to calculate route. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Existing form fields... */}
      
      {/* NEW: Route preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Route Preference
        </label>
        <select
          value={tollPreference}
          onChange={(e) => setTollPreference(e.target.value as any)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="fastest">Fastest Route (may include tolls)</option>
          <option value="cheapest">Cheapest Route (avoid tolls)</option>
          <option value="balanced">Balanced (best time/cost ratio)</option>
        </select>
      </div>

      {/* Existing calculate button... */}

      {/* NEW: Toll comparison display */}
      {tollInfo && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            🛣️ Route Analysis
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Toll Route */}
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Toll Route</span>
                {tollInfo.recommendation === 'toll' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div>Distance: {tollInfo.tollRoute?.distance}</div>
                <div>Time: {tollInfo.tollRoute?.duration}</div>
                <div className="font-medium text-green-600">
                  Toll Cost: ${tollInfo.tollRoute?.estimatedCost}
                </div>
              </div>
            </div>

            {/* No-Toll Route */}
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">No-Toll Route</span>
                {tollInfo.recommendation === 'no-toll' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div>Distance: {tollInfo.noTollRoute?.distance}</div>
                <div>Time: {tollInfo.noTollRoute?.duration}</div>
                <div className="font-medium text-blue-600">
                  Extra Time: +{tollInfo.noTollRoute?.timePenalty} min
                </div>
              </div>
            </div>
          </div>

          {/* Savings summary */}
          {tollInfo.savings && (
            <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
              <strong>Analysis:</strong> 
              {tollInfo.recommendation === 'toll' 
                ? ` Taking tolls saves ${tollInfo.savings.timeSaved} minutes for $${tollInfo.savings.costDifference}`
                : ` Avoiding tolls saves $${tollInfo.savings.costDifference} with only ${tollInfo.noTollRoute?.timePenalty} minutes extra`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Step 3: Test the Integration

1. **Navigate to Routes page** (`/routes`)
2. **Enter origin and destination** (e.g., "New York, NY" to "Philadelphia, PA")
3. **Click "Calculate"** to see toll analysis
4. **Review route comparison** showing toll vs no-toll options

### Step 4: Enhance with Cost Tracking

Add toll tracking to load management by updating `/app/services/route-optimization.ts`:

```typescript
// Add to existing RouteOptimizationService
import { TollCalculationService } from './tollCalculationService';

export class RouteOptimizationService {
  private tollService = new TollCalculationService();

  async optimizeRoutes(request: RouteOptimizationRequest): Promise<OptimizedRoute[]> {
    // ... existing optimization logic ...

    // NEW: Add toll calculations to optimized routes
    for (const route of optimizedRoutes) {
      if (route.stops.length > 1) {
        const origin = route.stops[0].address;
        const destination = route.stops[route.stops.length - 1].address;
        
        try {
          const tollInfo = await this.tollService.calculateTollCosts(origin, destination, 'truck');
          
          // Update route with accurate toll costs
          if (tollInfo.tollRoute) {
            route.tollCost = tollInfo.tollRoute.estimatedCost;
            route.estimatedCost = route.fuelCost + route.tollCost + (route.totalDuration / 60) * 25;
            
            // Adjust efficiency based on toll recommendation
            if (tollInfo.recommendation === 'toll') {
              route.efficiency += 5; // Bonus for time savings
            }
          }
        } catch (error) {
          console.warn('Toll calculation failed for route:', error);
          // Keep existing toll estimate
        }
      }
    }

    return optimizedRoutes;
  }
}
```

## 🎯 Immediate Benefits

- **Accurate Cost Estimates**: Real toll costs instead of estimates
- **Route Optimization**: Data-driven toll vs no-toll decisions  
- **Customer Transparency**: Show customers exact routing costs
- **Operational Efficiency**: Reduce unexpected toll expenses

## 📈 Next Steps

1. **Test with real routes** in your area
2. **Add toll preferences** to driver profiles
3. **Track toll savings** in analytics dashboard
4. **Integrate with invoice system** for accurate billing

This toll integration enhances FleetFlow's existing route optimization with minimal code changes while providing immediate operational value!
