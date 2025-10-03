/**
 * FLEETFLOW CLIENT AUTHENTICATION SERVICE
 * Mock authentication for client users until real database is connected
 */

export interface ClientUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';
  clientId: string;
  clientName: string;
  freightForwarderId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthSession {
  user: ClientUser;
  token: string;
  expiresAt: Date;
}

class ClientAuthService {
  private static instance: ClientAuthService;
  private sessions: Map<string, AuthSession> = new Map();
  private users: Map<string, ClientUser> = new Map();

  private constructor() {
    this.initializeMockUsers();
  }

  public static getInstance(): ClientAuthService {
    if (!ClientAuthService.instance) {
      ClientAuthService.instance = new ClientAuthService();
    }
    return ClientAuthService.instance;
  }

  private initializeMockUsers(): void {
    // Mock client users for testing
    const mockUsers: ClientUser[] = [
      {
        id: 'USER-001',
        email: 'john.smith@abcshipping.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'ADMIN',
        clientId: 'CLIENT-001',
        clientName: 'ABC Shipping Corporation',
        freightForwarderId: 'FF-001',
        permissions: [
          'shipments:read',
          'shipments:write',
          'documents:read',
          'documents:write',
          'reports:read',
        ],
        isActive: true,
      },
      {
        id: 'USER-002',
        email: 'jane.doe@abcshipping.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'USER',
        clientId: 'CLIENT-001',
        clientName: 'ABC Shipping Corporation',
        freightForwarderId: 'FF-001',
        permissions: ['shipments:read', 'documents:read', 'documents:write'],
        isActive: true,
      },
      {
        id: 'USER-003',
        email: 'viewer@abcshipping.com',
        firstName: 'View',
        lastName: 'Only',
        role: 'VIEWER',
        clientId: 'CLIENT-001',
        clientName: 'ABC Shipping Corporation',
        freightForwarderId: 'FF-001',
        permissions: ['shipments:read', 'documents:read'],
        isActive: true,
      },
    ];

    mockUsers.forEach((user) => this.users.set(user.email, user));
  }

  /**
   * Login with email and password
   */
  public async login(email: string, password: string): Promise<AuthSession> {
    try {
      // In production: Validate credentials against database
      // For now: Simple mock authentication
      const user = this.users.get(email.toLowerCase());

      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('Account is inactive');
      }

      // Create session token
      const token = this.generateToken();
      const session: AuthSession = {
        user,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      // Store session
      this.sessions.set(token, session);
      user.lastLogin = new Date();

      // In production: Store session in secure HTTP-only cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('client_auth_token', token);
        localStorage.setItem('client_user', JSON.stringify(user));
      }

      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Login with magic link token (from email)
   */
  public async loginWithToken(token: string): Promise<AuthSession> {
    try {
      const session = this.sessions.get(token);

      if (!session) {
        throw new Error('Invalid or expired token');
      }

      if (new Date() > session.expiresAt) {
        this.sessions.delete(token);
        throw new Error('Session expired');
      }

      return session;
    } catch (error) {
      console.error('Token login error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  public getCurrentUser(): ClientUser | null {
    if (typeof window === 'undefined') return null;

    try {
      const token = localStorage.getItem('client_auth_token');
      if (!token) return null;

      const session = this.sessions.get(token);
      if (!session) {
        // Try to load from localStorage
        const userStr = localStorage.getItem('client_user');
        if (userStr) {
          return JSON.parse(userStr);
        }
        return null;
      }

      if (new Date() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Logout current user
   */
  public logout(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('client_auth_token');
    if (token) {
      this.sessions.delete(token);
    }

    localStorage.removeItem('client_auth_token');
    localStorage.removeItem('client_user');
  }

  /**
   * Check if user has permission
   */
  public hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.permissions.includes(permission);
  }

  /**
   * Generate session token
   */
  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send magic link email (mock)
   */
  public async sendMagicLink(email: string): Promise<void> {
    try {
      const user = this.users.get(email.toLowerCase());

      if (!user) {
        // Don't reveal if email exists
        return;
      }

      const token = this.generateToken();
      const session: AuthSession = {
        user,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      };

      this.sessions.set(token, session);

      // In production: Send actual email with link
      const magicLink = `${window.location.origin}/customs-agent-portal?token=${token}`;
      console.log(`Magic link for ${email}: ${magicLink}`);

      // For demo: Show alert
      alert(`Magic link sent! (Demo mode)\n\nLink: ${magicLink}`);
    } catch (error) {
      console.error('Send magic link error:', error);
      throw error;
    }
  }

  /**
   * Validate access to client data
   */
  public canAccessClient(clientId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.clientId === clientId;
  }

  /**
   * Get user's client ID
   */
  public getUserClientId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.clientId : null;
  }

  /**
   * Get user's freight forwarder ID
   */
  public getUserFreightForwarderId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.freightForwarderId : null;
  }
}

export const clientAuthService = ClientAuthService.getInstance();
export default clientAuthService;
