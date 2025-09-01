// Real GPS Tracking Service with browser geolocation API
interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  timestamp: string;
  city?: string;
  state?: string;
  address?: string;
}

interface LocationHistory {
  driverId: string;
  locations: GPSLocation[];
  lastUpdate: string;
}

interface TrackingOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

class GPSTrackingServiceClass {
  private locations: { [driverId: string]: GPSLocation } = {};
  private locationHistory: { [driverId: string]: LocationHistory } = {};
  private watchIds: { [driverId: string]: number } = {};
  private isTracking: { [driverId: string]: boolean } = {};

  private defaultOptions: TrackingOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  };

  async getCurrentLocation(driverId: string): Promise<GPSLocation | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser');
        resolve(this.getFallbackLocation(driverId));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = await this.processPosition(position, driverId);
          resolve(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
          resolve(this.getFallbackLocation(driverId));
        },
        this.defaultOptions
      );
    });
  }

  async startTracking(driverId: string): Promise<boolean> {
    try {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser');
        return false;
      }

      if (this.isTracking[driverId]) {
        console.info(`Already tracking driver ${driverId}`);
        return true;
      }

      // Request permission first
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      if (permission.state === 'denied') {
        console.error('Geolocation permission denied');
        return false;
      }

      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const location = await this.processPosition(position, driverId);
          this.locations[driverId] = location;
          this.addToHistory(driverId, location);

          // Notify any listeners about location update
          this.notifyLocationUpdate(driverId, location);
        },
        (error) => {
          console.error('Error watching position:', error);
          this.handleLocationError(driverId, error);
        },
        this.defaultOptions
      );

      this.watchIds[driverId] = watchId;
      this.isTracking[driverId] = true;

      console.info(`Started GPS tracking for driver ${driverId}`);
      return true;
    } catch (error) {
      console.error('Error starting tracking:', error);
      return false;
    }
  }

  async stopTracking(driverId: string): Promise<boolean> {
    try {
      const watchId = this.watchIds[driverId];
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        delete this.watchIds[driverId];
      }

      this.isTracking[driverId] = false;
      console.info(`Stopped GPS tracking for driver ${driverId}`);
      return true;
    } catch (error) {
      console.error('Error stopping tracking:', error);
      return false;
    }
  }

  async updateLocation(
    driverId: string,
    location: Partial<GPSLocation>
  ): Promise<boolean> {
    try {
      const currentLocation = this.locations[driverId];
      if (!currentLocation) {
        return false;
      }

      const updatedLocation: GPSLocation = {
        ...currentLocation,
        ...location,
        timestamp: new Date().toISOString(),
      };

      this.locations[driverId] = updatedLocation;
      this.addToHistory(driverId, updatedLocation);
      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      return false;
    }
  }

  async getLocationHistory(
    driverId: string,
    hours: number = 24
  ): Promise<GPSLocation[]> {
    try {
      const history = this.locationHistory[driverId];
      if (!history) {
        return [];
      }

      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      return history.locations.filter(
        (loc) => new Date(loc.timestamp) >= cutoffTime
      );
    } catch (error) {
      console.error('Error getting location history:', error);
      return [];
    }
  }

  async calculateDistance(from: GPSLocation, to: GPSLocation): Promise<number> {
    try {
      const R = 3959; // Earth's radius in miles
      const dLat = this.toRadians(to.latitude - from.latitude);
      const dLon = this.toRadians(to.longitude - from.longitude);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(from.latitude)) *
          Math.cos(this.toRadians(to.latitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return Math.round(distance * 100) / 100;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }

  async getETA(
    driverId: string,
    destinationLat: number,
    destinationLon: number
  ): Promise<{ eta: string; distance: number }> {
    try {
      const currentLocation = this.locations[driverId];
      if (!currentLocation) {
        return { eta: 'Unknown', distance: 0 };
      }

      const destination: GPSLocation = {
        ...currentLocation,
        latitude: destinationLat,
        longitude: destinationLon,
      };

      const distance = await this.calculateDistance(
        currentLocation,
        destination
      );
      const averageSpeed = currentLocation.speed || 55; // Use actual speed or default
      const etaHours = distance / averageSpeed;
      const etaMinutes = Math.round(etaHours * 60);

      const eta = new Date(Date.now() + etaMinutes * 60 * 1000);

      return {
        eta: eta.toLocaleString(),
        distance,
      };
    } catch (error) {
      console.error('Error calculating ETA:', error);
      return { eta: 'Unknown', distance: 0 };
    }
  }

  isDriverTracking(driverId: string): boolean {
    return this.isTracking[driverId] || false;
  }

  getLastKnownLocation(driverId: string): GPSLocation | null {
    return this.locations[driverId] || null;
  }

  private async processPosition(
    position: GeolocationPosition,
    driverId: string
  ): Promise<GPSLocation> {
    const location: GPSLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
      altitude: position.coords.altitude,
      timestamp: new Date().toISOString(),
    };

    // Try to get address information
    try {
      const addressInfo = await this.reverseGeocode(
        location.latitude,
        location.longitude
      );
      location.city = addressInfo.city;
      location.state = addressInfo.state;
      location.address = addressInfo.address;
    } catch (error) {
      console.warn('Could not get address information:', error);
    }

    return location;
  }

  private async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<{ city?: string; state?: string; address?: string }> {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free alternative to Google)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding API error');
      }

      const data = await response.json();

      return {
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        address: data.display_name,
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {};
    }
  }

  private getFallbackLocation(driverId: string): GPSLocation {
    // Return last known location or default location
    const lastKnown = this.locations[driverId];
    if (lastKnown) {
      return lastKnown;
    }

    // Default to a central US location if no GPS available
    return {
      latitude: 39.8283,
      longitude: -98.5795,
      accuracy: 0,
      speed: null,
      heading: null,
      altitude: null,
      timestamp: new Date().toISOString(),
      city: 'Unknown',
      state: 'Unknown',
      address: 'Location unavailable',
    };
  }

  private addToHistory(driverId: string, location: GPSLocation): void {
    if (!this.locationHistory[driverId]) {
      this.locationHistory[driverId] = {
        driverId,
        locations: [],
        lastUpdate: new Date().toISOString(),
      };
    }

    const history = this.locationHistory[driverId];
    history.locations.push(location);
    history.lastUpdate = new Date().toISOString();

    // Keep only last 1000 locations to prevent memory issues
    if (history.locations.length > 1000) {
      history.locations = history.locations.slice(-1000);
    }
  }

  private notifyLocationUpdate(driverId: string, location: GPSLocation): void {
    // Dispatch custom event for location updates
    const event = new CustomEvent('locationUpdate', {
      detail: { driverId, location },
    });
    window.dispatchEvent(event);
  }

  private handleLocationError(
    driverId: string,
    error: GeolocationPositionError
  ): void {
    let errorMessage = 'Unknown GPS error';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'GPS permission denied by user';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'GPS position unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'GPS request timed out';
        break;
    }

    console.error(`GPS Error for driver ${driverId}:`, errorMessage);

    // Dispatch error event
    const event = new CustomEvent('locationError', {
      detail: { driverId, error: errorMessage },
    });
    window.dispatchEvent(event);
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const GPSTrackingService = new GPSTrackingServiceClass();
