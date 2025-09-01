// 🔐 Driver Authentication Service
// Handles driver login, session management, and security

import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface DriverSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedTruck: string;
  dispatcherName: string;
  dispatcherPhone: string;
  dispatcherEmail: string;
  currentLocation: string;
  eldStatus: 'Connected' | 'Disconnected' | 'Error';
  hoursRemaining: number;
  currentCoords: [number, number];
  avatar?: string;
  carrierId: string;
  isActive: boolean;
  lastLogin: string;
  sessionToken: string;
  permissions: string[];
}

export interface LoginCredentials {
  driverId: string;
  password: string;
  deviceId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface LoginResponse {
  success: boolean;
  driver?: DriverSession;
  error?: string;
  requiresPasswordChange?: boolean;
  sessionDuration?: number;
}

class DriverAuthService {
  private currentDriver: DriverSession | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private locationUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Check for existing session on startup
    const savedSession = localStorage.getItem('driver_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const isValid = await this.validateSession(session.sessionToken);
        if (isValid) {
          this.currentDriver = session;
          this.startSessionManagement();
        } else {
          this.clearSession();
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        this.clearSession();
      }
    }
  }

  // Driver Authentication
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Simulate API call to backend authentication
      const response = await this.authenticateDriver(credentials);

      if (response.success && response.driver) {
        this.currentDriver = response.driver;
        this.saveSession(response.driver);
        this.startSessionManagement();
        this.startLocationTracking();

        // Log login activity
        await this.logActivity('login', {
          driverId: response.driver.id,
          deviceId: credentials.deviceId,
          location: credentials.location,
          timestamp: new Date().toISOString(),
        });
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  // Mock authentication - replace with real API call
  private async authenticateDriver(
    credentials: LoginCredentials
  ): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock driver data - in real app, this would come from backend
    const mockDrivers = {
      'DRV-001': {
        id: 'DRV-001',
        name: 'John Smith',
        email: 'john.smith@fleetflow.com',
        phone: '+1 (555) 123-4567',
        licenseNumber: 'CDL-TX-123456',
        assignedTruck: 'TRK-001 (Freightliner Cascadia)',
        dispatcherName: 'Sarah Johnson',
        dispatcherPhone: '+1 (555) 987-6543',
        dispatcherEmail: 'sarah.johnson@fleetflow.com',
        currentLocation: 'Dallas, TX',
        eldStatus: 'Connected' as const,
        hoursRemaining: 8.5,
        currentCoords: [32.7767, -96.797] as [number, number],
        avatar: '👨‍✈️',
        carrierId: 'CAR-001',
        isActive: true,
        lastLogin: new Date().toISOString(),
        sessionToken: this.generateSessionToken(),
        permissions: [
          'view_loads',
          'update_status',
          'upload_documents',
          'submit_pod',
        ],
      },
      'DRV-002': {
        id: 'DRV-002',
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@fleetflow.com',
        phone: '+1 (555) 234-5678',
        licenseNumber: 'CDL-CA-789012',
        assignedTruck: 'TRK-002 (Peterbilt 579)',
        dispatcherName: 'Mike Johnson',
        dispatcherPhone: '+1 (555) 876-5432',
        dispatcherEmail: 'mike.johnson@fleetflow.com',
        currentLocation: 'Los Angeles, CA',
        eldStatus: 'Connected' as const,
        hoursRemaining: 7.2,
        currentCoords: [34.0522, -118.2437] as [number, number],
        avatar: '👩‍✈️',
        carrierId: 'CAR-002',
        isActive: true,
        lastLogin: new Date().toISOString(),
        sessionToken: this.generateSessionToken(),
        permissions: [
          'view_loads',
          'update_status',
          'upload_documents',
          'submit_pod',
        ],
      },
    };

    // Check credentials
    const driver =
      mockDrivers[credentials.driverId as keyof typeof mockDrivers];
    if (!driver) {
      return {
        success: false,
        error: 'Invalid driver ID',
      };
    }

    // In real app, verify password hash
    if (
      credentials.password !== 'password123' &&
      credentials.password !== 'demo123'
    ) {
      return {
        success: false,
        error: 'Invalid password',
      };
    }

    return {
      success: true,
      driver,
      sessionDuration: 8 * 60 * 60 * 1000, // 8 hours
    };
  }

  // Session Management
  private generateSessionToken(): string {
    return (
      'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  private saveSession(driver: DriverSession) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('driver_session', JSON.stringify(driver));
    localStorage.setItem('session_timestamp', Date.now().toString());
  }

  private async validateSession(sessionToken: string): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      // In real app, validate with backend
      const sessionTimestamp = localStorage.getItem('session_timestamp');
      if (!sessionTimestamp) return false;

      const sessionAge = Date.now() - parseInt(sessionTimestamp);
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours

      return sessionAge < maxAge;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  private startSessionManagement() {
    // Check session validity every 5 minutes
    this.sessionCheckInterval = setInterval(
      async () => {
        if (this.currentDriver) {
          const isValid = await this.validateSession(
            this.currentDriver.sessionToken
          );
          if (!isValid) {
            this.logout();
          }
        }
      },
      5 * 60 * 1000
    );
  }

  private startLocationTracking() {
    // Update location every 2 minutes
    this.locationUpdateInterval = setInterval(
      async () => {
        if (this.currentDriver) {
          await this.updateLocation();
        }
      },
      2 * 60 * 1000
    );
  }

  // Location Management
  private async updateLocation() {
    if (!this.currentDriver) return;

    try {
      const position = await this.getCurrentPosition();
      if (position) {
        this.currentDriver.currentCoords = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        this.currentDriver.currentLocation = await this.reverseGeocode(
          position.coords.latitude,
          position.coords.longitude
        );
        this.saveSession(this.currentDriver);

        // Send location update to backend
        await this.sendLocationUpdate({
          driverId: this.currentDriver.id,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: position.coords.accuracy,
        });
      }
    } catch (error) {
      console.error('Location update error:', error);
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  private async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      // Mock reverse geocoding - in real app, use Google Maps API
      const locations = [
        'Dallas, TX',
        'Houston, TX',
        'Austin, TX',
        'San Antonio, TX',
        'Los Angeles, CA',
        'San Francisco, CA',
        'Phoenix, AZ',
        'Denver, CO',
      ];
      return locations[Math.floor(Math.random() * locations.length)];
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Location Unknown';
    }
  }

  private async sendLocationUpdate(locationData: any) {
    try {
      // In real app, send to backend API
      console.info('Location update:', locationData);
    } catch (error) {
      console.error('Failed to send location update:', error);
    }
  }

  // Logout
  async logout() {
    try {
      if (this.currentDriver) {
        await this.logActivity('logout', {
          driverId: this.currentDriver.id,
          timestamp: new Date().toISOString(),
        });
      }

      this.clearSession();
      this.stopSessionManagement();

      // Redirect to login page
      window.location.href = '/drivers/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private clearSession() {
    this.currentDriver = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('driver_session');
      localStorage.removeItem('session_timestamp');
    }
  }

  private stopSessionManagement() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  // Activity Logging
  private async logActivity(action: string, data: any) {
    try {
      const logEntry = {
        action,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: await this.getPublicIP(),
      };

      // In real app, send to backend for audit trail
      console.info('Activity log:', logEntry);
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  }

  private async getPublicIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // Getters
  getCurrentDriver(): DriverSession | null {
    return this.currentDriver;
  }

  isAuthenticated(): boolean {
    return this.currentDriver !== null;
  }

  hasPermission(permission: string): boolean {
    return this.currentDriver?.permissions.includes(permission) || false;
  }

  // Driver Profile Updates
  async updateProfile(updates: Partial<DriverSession>): Promise<boolean> {
    try {
      if (!this.currentDriver) return false;

      // Update current driver data
      this.currentDriver = { ...this.currentDriver, ...updates };
      this.saveSession(this.currentDriver);

      // Send updates to backend
      await this.sendProfileUpdate(updates);

      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  }

  private async sendProfileUpdate(updates: Partial<DriverSession>) {
    try {
      // In real app, send to backend API
      console.info('Profile update:', updates);
    } catch (error) {
      console.error('Failed to send profile update:', error);
    }
  }

  // ELD Status Updates
  async updateELDStatus(status: 'Connected' | 'Disconnected' | 'Error') {
    if (this.currentDriver) {
      this.currentDriver.eldStatus = status;
      this.saveSession(this.currentDriver);

      await this.logActivity('eld_status_change', {
        driverId: this.currentDriver.id,
        newStatus: status,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Hours of Service Updates
  async updateHoursRemaining(hours: number) {
    if (this.currentDriver) {
      this.currentDriver.hoursRemaining = hours;
      this.saveSession(this.currentDriver);

      if (hours < 1) {
        // Trigger alert for low hours
        await this.sendLowHoursAlert();
      }
    }
  }

  private async sendLowHoursAlert() {
    // In real app, send alert to dispatch
    console.info('Low hours alert sent');
  }
}

// Export singleton instance
export const driverAuthService = new DriverAuthService();
