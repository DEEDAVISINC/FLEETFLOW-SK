// AuthService for driver authentication
interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleId?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
}

interface Session {
  driverId: string;
  token: string;
  expiresAt: string;
  isValid: boolean;
}

class AuthServiceClass {
  private drivers: Driver[] = [
    {
      id: 'DRV-001',
      name: 'John Smith',
      email: 'john.smith@fleetflow.com',
      phone: '555-0123',
      licenseNumber: 'CDL-123456',
      vehicleId: 'TRK-001',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'DRV-002',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@fleetflow.com',
      phone: '555-0124',
      licenseNumber: 'CDL-789012',
      vehicleId: 'TRK-002',
      status: 'active',
      lastLogin: new Date().toISOString()
    }
  ];

  private sessions: Session[] = [];

  // Check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  async login(driverId: string, password: string): Promise<{ success: boolean; driver?: Driver; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const driver = this.drivers.find(d => d.id === driverId);
      if (!driver) {
        return { success: false, error: 'Driver not found' };
      }

      // Check password (in real implementation, this would be hashed)
      if (password !== 'password123' && password !== 'demo123') {
        return { success: false, error: 'Invalid password' };
      }

      // Create session
      const session: Session = {
        driverId: driver.id,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        isValid: true
      };

      this.sessions.push(session);

      // Store session in localStorage if available
      if (this.isBrowser()) {
        localStorage.setItem('driverSession', JSON.stringify(session));
        localStorage.setItem('currentDriver', JSON.stringify(driver));
      }

      // Update last login
      driver.lastLogin = new Date().toISOString();

      return { success: true, driver };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  async getCurrentDriver(): Promise<Driver | null> {
    try {
      if (!this.isBrowser()) {
        return null;
      }

      const sessionStr = localStorage.getItem('driverSession');
      const driverStr = localStorage.getItem('currentDriver');

      if (!sessionStr || !driverStr) {
        return null;
      }

      const session: Session = JSON.parse(sessionStr);
      const driver: Driver = JSON.parse(driverStr);

      // Check if session is valid
      if (!session.isValid || new Date(session.expiresAt) < new Date()) {
        await this.logout();
        return null;
      }

      return driver;
    } catch (error) {
      console.error('Get current driver error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.isBrowser()) {
        localStorage.removeItem('driverSession');
        localStorage.removeItem('currentDriver');
      }

      // Remove session from memory
      this.sessions = this.sessions.filter(s => s.isValid);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async validateSession(): Promise<boolean> {
    try {
      if (!this.isBrowser()) {
        return false;
      }

      const sessionStr = localStorage.getItem('driverSession');
      if (!sessionStr) {
        return false;
      }

      const session: Session = JSON.parse(sessionStr);
      return session.isValid && new Date(session.expiresAt) > new Date();
    } catch (error) {
      console.error('Validate session error:', error);
      return false;
    }
  }

  async refreshSession(): Promise<boolean> {
    try {
      const driver = await this.getCurrentDriver();
      if (!driver) {
        return false;
      }

      // Extend session by 24 hours
      const session: Session = {
        driverId: driver.id,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isValid: true
      };

      if (this.isBrowser()) {
        localStorage.setItem('driverSession', JSON.stringify(session));
      }

      return true;
    } catch (error) {
      console.error('Refresh session error:', error);
      return false;
    }
  }

  // Get all drivers (for admin purposes)
  async getAllDrivers(): Promise<Driver[]> {
    return this.drivers;
  }

  // Update driver status
  async updateDriverStatus(driverId: string, status: Driver['status']): Promise<boolean> {
    try {
      const driver = this.drivers.find(d => d.id === driverId);
      if (!driver) {
        return false;
      }

      driver.status = status;
      return true;
    } catch (error) {
      console.error('Update driver status error:', error);
      return false;
    }
  }
}

export const AuthService = new AuthServiceClass(); 