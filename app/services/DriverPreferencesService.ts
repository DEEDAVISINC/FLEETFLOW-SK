/**
 * Driver Preferences Service
 * Manages driver load matching preferences and settings
 */

export interface DriverPreferences {
  driverId: string;
  driverName: string;
  equipmentTypes: string[];
  maxDistance: number; // miles
  minRate: number; // per mile
  preferredStates: string[];
  hazmatCertified: boolean;
  specialtyEndorsements: string[];
  workSchedule: {
    availableDays: string[];
    preferredStartTime: string;
    maxHoursPerDay: number;
  };
  notifications: {
    loadAlerts: boolean;
    urgentLoads: boolean;
    rateUpdates: boolean;
    weatherAlerts: boolean;
  };
  routePreferences: {
    avoidTollRoads: boolean;
    avoidUrbanAreas: boolean;
    preferInterstates: boolean;
  };
  lastUpdated: string;
}

export interface UrgentLoadRequest {
  driverId: string;
  driverName: string;
  currentLocation: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  requestType: 'urgent' | 'immediate' | 'asap';
  preferences: DriverPreferences;
  requestTime: string;
  status: 'pending' | 'matched' | 'expired';
}

export interface DriverPerformanceData {
  driverId: string;
  driverName: string;
  period: 'week' | 'month' | 'quarter' | 'year' | 'all-time';
  metrics: {
    loadsCompleted: number;
    totalEarnings: number;
    milesDriven: number;
    averageRating: number;
    onTimeDeliveryRate: number;
    fuelEfficiency: number;
    safetyScore: number;
    customerSatisfaction: number;
  };
  trends: {
    earningsGrowth: number;
    performanceImprovement: number;
    efficiencyGain: number;
  };
  achievements: string[];
  lastUpdated: string;
}

class DriverPreferencesService {
  private readonly STORAGE_KEY = 'fleetflow-driver-preferences';
  private readonly URGENT_REQUESTS_KEY = 'fleetflow-urgent-requests';
  private readonly PERFORMANCE_KEY = 'fleetflow-driver-performance';

  // Default preferences for new drivers
  private getDefaultPreferences(
    driverId: string,
    driverName: string
  ): DriverPreferences {
    return {
      driverId,
      driverName,
      equipmentTypes: ['Dry Van', 'Reefer'],
      maxDistance: 500,
      minRate: 2.5,
      preferredStates: ['TX', 'OK', 'AR', 'LA'],
      hazmatCertified: false,
      specialtyEndorsements: [],
      workSchedule: {
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredStartTime: '06:00',
        maxHoursPerDay: 11,
      },
      notifications: {
        loadAlerts: true,
        urgentLoads: true,
        rateUpdates: true,
        weatherAlerts: true,
      },
      routePreferences: {
        avoidTollRoads: false,
        avoidUrbanAreas: false,
        preferInterstates: true,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  // Get driver preferences
  getDriverPreferences(
    driverId: string,
    driverName: string
  ): DriverPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const allPreferences = stored ? JSON.parse(stored) : {};

      if (allPreferences[driverId]) {
        return allPreferences[driverId];
      }

      // Return default preferences for new drivers
      return this.getDefaultPreferences(driverId, driverName);
    } catch (error) {
      console.error('Error loading driver preferences:', error);
      return this.getDefaultPreferences(driverId, driverName);
    }
  }

  // Save driver preferences
  saveDriverPreferences(preferences: DriverPreferences): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const allPreferences = stored ? JSON.parse(stored) : {};

      allPreferences[preferences.driverId] = {
        ...preferences,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPreferences));
      return true;
    } catch (error) {
      console.error('Error saving driver preferences:', error);
      return false;
    }
  }

  // Request urgent load assignment
  requestUrgentLoad(request: UrgentLoadRequest): boolean {
    try {
      const stored = localStorage.getItem(this.URGENT_REQUESTS_KEY);
      const requests = stored ? JSON.parse(stored) : [];

      const newRequest = {
        ...request,
        id: `urgent-${Date.now()}`,
        requestTime: new Date().toISOString(),
        status: 'pending',
      };

      requests.push(newRequest);
      localStorage.setItem(this.URGENT_REQUESTS_KEY, JSON.stringify(requests));

      // Simulate dispatch notification
      this.notifyDispatch(newRequest);

      return true;
    } catch (error) {
      console.error('Error requesting urgent load:', error);
      return false;
    }
  }

  // Get driver performance data
  getDriverPerformance(
    driverId: string,
    driverName: string,
    period: 'week' | 'month' | 'quarter' | 'year' | 'all-time' = 'month'
  ): DriverPerformanceData {
    try {
      const stored = localStorage.getItem(this.PERFORMANCE_KEY);
      const allPerformance = stored ? JSON.parse(stored) : {};

      if (allPerformance[driverId]) {
        return { ...allPerformance[driverId], period };
      }

      // Generate realistic mock performance data
      return this.generateMockPerformanceData(driverId, driverName, period);
    } catch (error) {
      console.error('Error loading driver performance:', error);
      return this.generateMockPerformanceData(driverId, driverName, period);
    }
  }

  // Generate realistic performance data
  private generateMockPerformanceData(
    driverId: string,
    driverName: string,
    period: string
  ): DriverPerformanceData {
    const multiplier =
      period === 'week'
        ? 0.25
        : period === 'month'
          ? 1
          : period === 'quarter'
            ? 3
            : period === 'year'
              ? 12
              : 24;

    return {
      driverId,
      driverName,
      period: period as any,
      metrics: {
        loadsCompleted: Math.floor(12 * multiplier),
        totalEarnings: Math.floor(4200 * multiplier),
        milesDriven: Math.floor(3200 * multiplier),
        averageRating: 4.7 + Math.random() * 0.3,
        onTimeDeliveryRate: 94 + Math.random() * 5,
        fuelEfficiency: 6.8 + Math.random() * 0.8,
        safetyScore: 96 + Math.random() * 3,
        customerSatisfaction: 4.6 + Math.random() * 0.4,
      },
      trends: {
        earningsGrowth: -2 + Math.random() * 15,
        performanceImprovement: Math.random() * 8,
        efficiencyGain: Math.random() * 5,
      },
      achievements: [
        'Safe Driver Award',
        'On-Time Delivery Champion',
        'Fuel Efficiency Leader',
        'Customer Favorite',
      ],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Notify dispatch of urgent load request
  private notifyDispatch(request: any): void {
    // In a real app, this would send a notification to dispatch
    console.log('🚨 Urgent load request submitted:', {
      driver: request.driverName,
      location: `${request.currentLocation.city}, ${request.currentLocation.state}`,
      requestType: request.requestType,
      timestamp: request.requestTime,
    });
  }

  // Activate emergency override (management only)
  activateEmergencyOverride(userId: string, userRole: string): boolean {
    if (userRole !== 'fleet_manager' && userRole !== 'dispatcher') {
      throw new Error(
        'Unauthorized: Emergency override requires management access'
      );
    }

    try {
      // Log the emergency override activation
      const override = {
        activatedBy: userId,
        activatedAt: new Date().toISOString(),
        reason: 'Manual emergency override activation',
        status: 'active',
      };

      localStorage.setItem(
        'fleetflow-emergency-override',
        JSON.stringify(override)
      );

      // In a real app, this would:
      // 1. Disable automated load assignments
      // 2. Notify all dispatchers
      // 3. Switch to manual dispatch mode
      // 4. Log the event for audit purposes

      console.log('🚨 Emergency override activated by:', userId);
      return true;
    } catch (error) {
      console.error('Error activating emergency override:', error);
      return false;
    }
  }

  // Generate detailed performance report
  generateDetailedReport(driverId: string, driverName: string): string {
    const performance = this.getDriverPerformance(driverId, driverName);
    const preferences = this.getDriverPreferences(driverId, driverName);

    return `
📊 DETAILED DRIVER PERFORMANCE REPORT
Driver: ${performance.driverName}
Period: ${performance.period.toUpperCase()}
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════

📈 PERFORMANCE METRICS
🚛 Loads Completed: ${performance.metrics.loadsCompleted}
💰 Total Earnings: $${performance.metrics.totalEarnings.toLocaleString()}
📍 Miles Driven: ${performance.metrics.milesDriven.toLocaleString()}
⭐ Average Rating: ${performance.metrics.averageRating.toFixed(1)}/5.0
🎯 On-Time Delivery: ${performance.metrics.onTimeDeliveryRate.toFixed(1)}%
⛽ Fuel Efficiency: ${performance.metrics.fuelEfficiency.toFixed(1)} MPG
🛡️ Safety Score: ${performance.metrics.safetyScore.toFixed(1)}/100
😊 Customer Satisfaction: ${performance.metrics.customerSatisfaction.toFixed(1)}/5.0

📊 PERFORMANCE TRENDS
💹 Earnings Growth: ${performance.trends.earningsGrowth > 0 ? '+' : ''}${performance.trends.earningsGrowth.toFixed(1)}%
📈 Performance Improvement: +${performance.trends.performanceImprovement.toFixed(1)}%
⚡ Efficiency Gain: +${performance.trends.efficiencyGain.toFixed(1)}%

🏆 ACHIEVEMENTS
${performance.achievements.map((achievement) => `• ${achievement}`).join('\n')}

⚙️ CURRENT PREFERENCES
Equipment: ${preferences.equipmentTypes.join(', ')}
Max Distance: ${preferences.maxDistance} miles
Min Rate: $${preferences.minRate}/mile
Preferred States: ${preferences.preferredStates.join(', ')}
Hazmat Certified: ${preferences.hazmatCertified ? 'Yes' : 'No'}

═══════════════════════════════════════
Report ID: RPT-${Date.now()}
`;
  }
}

export const driverPreferencesService = new DriverPreferencesService();
