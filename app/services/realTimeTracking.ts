// 🌐 Real-Time Tracking Service
// Handles GPS tracking, Google Maps integration, and live location updates

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number;
  speed: number;
  timestamp: string;
  altitude?: number;
  driverId: string;
  loadId?: string;
}

export interface TrackingSettings {
  updateInterval: number; // milliseconds
  highAccuracy: boolean;
  enableBackground: boolean;
  geofencing: boolean;
  autoReporting: boolean;
}

export interface Geofence {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  type: 'pickup' | 'delivery' | 'rest_area' | 'custom';
  loadId?: string;
}

export interface RouteData {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints: Array<{ lat: number; lng: number }>;
  distance: number;
  duration: number;
  trafficDelay: number;
  eta: string;
}

class RealTimeTrackingService {
  private watchId: number | null = null;
  private trackingInterval: NodeJS.Timeout | null = null;
  private currentLocation: LocationData | null = null;
  private routeData: RouteData | null = null;
  private geofences: Geofence[] = [];
  private isTracking = false;
  private settings: TrackingSettings = {
    updateInterval: 30000, // 30 seconds
    highAccuracy: true,
    enableBackground: true,
    geofencing: true,
    autoReporting: true,
  };

  private listeners: Array<(location: LocationData) => void> = [];
  private geofenceListeners: Array<
    (geofence: Geofence, entering: boolean) => void
  > = [];

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('tracking_settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }

    // Load geofences
    await this.loadGeofences();

    // Check if we should resume tracking
    const wasTracking = localStorage.getItem('was_tracking');
    if (wasTracking === 'true') {
      this.startTracking();
    }
  }

  // Start real-time tracking
  async startTracking(driverId?: string): Promise<boolean> {
    if (this.isTracking) return true;

    try {
      // Check geolocation permissions
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      // Start watching position
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleLocationUpdate(position, driverId),
        (error) => this.handleLocationError(error),
        {
          enableHighAccuracy: this.settings.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
        }
      );

      // Start periodic updates
      this.trackingInterval = setInterval(
        () => this.sendLocationUpdate(),
        this.settings.updateInterval
      );

      this.isTracking = true;
      localStorage.setItem('was_tracking', 'true');

      console.info('Real-time tracking started');
      return true;
    } catch (error) {
      console.error('Failed to start tracking:', error);
      return false;
    }
  }

  // Stop tracking
  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    this.isTracking = false;
    localStorage.setItem('was_tracking', 'false');

    console.info('Real-time tracking stopped');
  }

  // Request location permission
  private async requestLocationPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      return false;
    }

    try {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      return permission.state === 'granted';
    } catch (error) {
      // Fallback: Try to get location once
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { timeout: 5000 }
        );
      });
    }
  }

  // Handle location updates
  private handleLocationUpdate(
    position: GeolocationPosition,
    driverId?: string
  ) {
    const locationData: LocationData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || 0,
      speed: position.coords.speed || 0,
      timestamp: new Date().toISOString(),
      altitude: position.coords.altitude || undefined,
      driverId: driverId || 'unknown',
    };

    this.currentLocation = locationData;

    // Notify listeners
    this.listeners.forEach((listener) => listener(locationData));

    // Check geofences
    if (this.settings.geofencing) {
      this.checkGeofences(locationData);
    }

    // Auto-report if enabled
    if (this.settings.autoReporting) {
      this.reportLocationUpdate(locationData);
    }
  }

  // Handle location errors
  private handleLocationError(error: GeolocationPositionError) {
    console.error('Location error:', error);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('Location permission denied');
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location unavailable');
        break;
      case error.TIMEOUT:
        console.error('Location timeout');
        break;
    }
  }

  // Send location update to backend
  private async sendLocationUpdate() {
    if (!this.currentLocation) return;

    try {
      // In real app, send to backend API
      const response = await fetch('/api/tracking/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.currentLocation),
      });

      if (!response.ok) {
        throw new Error('Failed to send location update');
      }
    } catch (error) {
      console.error('Failed to send location update:', error);
      // Queue for retry
      this.queueLocationUpdate(this.currentLocation);
    }
  }

  // Queue location update for retry
  private queueLocationUpdate(location: LocationData) {
    const queue = JSON.parse(localStorage.getItem('location_queue') || '[]');
    queue.push(location);
    localStorage.setItem('location_queue', JSON.stringify(queue));
  }

  // Process queued location updates
  private async processLocationQueue() {
    const queue = JSON.parse(localStorage.getItem('location_queue') || '[]');

    if (queue.length === 0) return;

    try {
      const response = await fetch('/api/tracking/location/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queue),
      });

      if (response.ok) {
        localStorage.setItem('location_queue', '[]');
      }
    } catch (error) {
      console.error('Failed to process location queue:', error);
    }
  }

  // Google Maps Integration
  async calculateRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<RouteData | null> {
    try {
      // In real app, use Google Maps Directions API
      const mockRoute: RouteData = {
        origin,
        destination,
        waypoints: [],
        distance: this.calculateDistance(origin, destination),
        duration: 3600, // 1 hour
        trafficDelay: 300, // 5 minutes
        eta: new Date(Date.now() + 3900000).toISOString(), // 1 hour 5 minutes
      };

      this.routeData = mockRoute;
      return mockRoute;
    } catch (error) {
      console.error('Failed to calculate route:', error);
      return null;
    }
  }

  // Calculate distance between two points
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Geofencing
  async loadGeofences(): Promise<void> {
    try {
      // In real app, load from backend API
      const mockGeofences: Geofence[] = [
        {
          id: 'pickup-1',
          name: 'Pickup Location',
          lat: 32.7767,
          lng: -96.797,
          radius: 500,
          type: 'pickup',
          loadId: 'LD-2025-001',
        },
        {
          id: 'delivery-1',
          name: 'Delivery Location',
          lat: 29.7604,
          lng: -95.3698,
          radius: 500,
          type: 'delivery',
          loadId: 'LD-2025-001',
        },
      ];

      this.geofences = mockGeofences;
    } catch (error) {
      console.error('Failed to load geofences:', error);
    }
  }

  // Check if current location is within geofences
  private checkGeofences(location: LocationData) {
    this.geofences.forEach((geofence) => {
      const distance = this.calculateDistance(
        { lat: location.lat, lng: location.lng },
        { lat: geofence.lat, lng: geofence.lng }
      );

      const isInside = distance <= geofence.radius;
      const wasInside = this.isLocationInGeofence(location, geofence);

      if (isInside && !wasInside) {
        // Entering geofence
        this.handleGeofenceEvent(geofence, true);
      } else if (!isInside && wasInside) {
        // Exiting geofence
        this.handleGeofenceEvent(geofence, false);
      }
    });
  }

  // Check if location is in geofence
  private isLocationInGeofence(
    location: LocationData,
    geofence: Geofence
  ): boolean {
    // This would typically use a more sophisticated method
    // For now, simple distance check
    return false;
  }

  // Handle geofence events
  private handleGeofenceEvent(geofence: Geofence, entering: boolean) {
    console.info(
      `${entering ? 'Entering' : 'Exiting'} geofence: ${geofence.name}`
    );

    // Notify listeners
    this.geofenceListeners.forEach((listener) => listener(geofence, entering));

    // Send geofence event to backend
    this.reportGeofenceEvent(geofence, entering);
  }

  // Report geofence event
  private async reportGeofenceEvent(geofence: Geofence, entering: boolean) {
    try {
      const eventData = {
        geofenceId: geofence.id,
        loadId: geofence.loadId,
        entering,
        timestamp: new Date().toISOString(),
        location: this.currentLocation,
      };

      // In real app, send to backend API
      await fetch('/api/tracking/geofence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Failed to report geofence event:', error);
    }
  }

  // Location reporting
  private async reportLocationUpdate(location: LocationData) {
    try {
      // In real app, send to dispatch system
      console.info('Location update:', location);
    } catch (error) {
      console.error('Failed to report location update:', error);
    }
  }

  // Event listeners
  addLocationListener(listener: (location: LocationData) => void) {
    this.listeners.push(listener);
  }

  removeLocationListener(listener: (location: LocationData) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  addGeofenceListener(
    listener: (geofence: Geofence, entering: boolean) => void
  ) {
    this.geofenceListeners.push(listener);
  }

  removeGeofenceListener(
    listener: (geofence: Geofence, entering: boolean) => void
  ) {
    this.geofenceListeners = this.geofenceListeners.filter(
      (l) => l !== listener
    );
  }

  // Getters
  getCurrentLocation(): LocationData | null {
    return this.currentLocation;
  }

  getRouteData(): RouteData | null {
    return this.routeData;
  }

  getGeofences(): Geofence[] {
    return this.geofences;
  }

  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  getSettings(): TrackingSettings {
    return this.settings;
  }

  // Settings management
  updateSettings(newSettings: Partial<TrackingSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('tracking_settings', JSON.stringify(this.settings));

    // Restart tracking if needed
    if (this.isTracking) {
      this.stopTracking();
      this.startTracking();
    }
  }

  // Background tracking (for when app is minimized)
  enableBackgroundTracking() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.info('Service Worker registered for background tracking');
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  // Analytics and reporting
  getTrackingStats(): {
    totalDistance: number;
    totalTime: number;
    averageSpeed: number;
    lastUpdate: string | null;
  } {
    return {
      totalDistance: 0,
      totalTime: 0,
      averageSpeed: 0,
      lastUpdate: this.currentLocation?.timestamp || null,
    };
  }

  // Emergency features
  async sendEmergencyAlert(message: string) {
    if (!this.currentLocation) return;

    try {
      const alertData = {
        type: 'emergency',
        message,
        location: this.currentLocation,
        timestamp: new Date().toISOString(),
      };

      // In real app, send to emergency services and dispatch
      await fetch('/api/tracking/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    }
  }

  // Cleanup
  destroy() {
    this.stopTracking();
    this.listeners = [];
    this.geofenceListeners = [];
    this.currentLocation = null;
    this.routeData = null;
    this.geofences = [];
  }
}

// Export singleton instance
export const realTimeTrackingService = new RealTimeTrackingService();
