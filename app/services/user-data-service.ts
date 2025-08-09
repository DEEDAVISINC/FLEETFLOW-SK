/**
 * User Data Service
 * Manages user profile data flow between User Management (admin) and individual user Settings portal
 */

export interface UserProfile {
  // Basic Identity
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Employment Information
  department: string;
  departmentCode: string;
  position: string;
  role: string;
  hiredDate: string;
  location: string;

  // Account Status
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdDate: string;
  lastActive: string;

  // Personal Information
  bio?: string;
  profilePhoto?: string;

  // System Access Information
  systemAccess: {
    level: string;
    accessCode: string;
    securityLevel: string;
    allowedSystems: string[];
  };

  // Emergency Contact
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
    altPhone?: string;
  };

  // Admin Notes (visible to admins only, not to individual users)
  notes?: string;

  // Permissions (comprehensive access control)
  permissions?: Record<string, boolean>;

  // User Preferences (set by individual user)
  preferences?: {
    theme: string;
    language: string;
    timezone: string;
    dashboardLayout: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      loadAlerts: boolean;
      maintenanceReminders: boolean;
      systemUpdates: boolean;
    };
  };

  // Activity Log
  recentActivity?: Array<{
    date: string;
    action: string;
    type: string;
    icon: string;
  }>;
}

class UserDataService {
  private static instance: UserDataService;
  private currentUser: UserProfile | null = null;
  private allUsers: UserProfile[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  /**
   * Initialize with mock data from User Management
   * In a real app, this would come from a database/API
   */
  private initializeMockData(): void {
    this.allUsers = [
      {
        id: 'FM-MGR-20230115-1',
        name: 'Frank Miller',
        firstName: 'Frank',
        lastName: 'Miller',
        email: 'frank.miller@fleetflow.com',
        phone: '(555) 123-4567',
        department: 'Management',
        departmentCode: 'MGR',
        position: 'Operations Manager',
        role: 'Fleet Manager',
        hiredDate: '2023-01-15',
        location: 'Main Office',
        status: 'active',
        lastActive: '2024-12-18T14:30:00Z',
        lastLogin: 'Current session',
        createdDate: '2023-01-15',
        bio: 'Experienced fleet manager with 15+ years in transportation logistics. Passionate about optimizing operations and ensuring driver safety.',
        systemAccess: {
          level: 'Full Administrative',
          accessCode: 'ACC-FM-MGR',
          securityLevel: 'Level 5 - Executive',
          allowedSystems: [
            'Full System Access',
            'User Management',
            'Financial Reports',
            'System Configuration',
          ],
        },
        emergencyContact: {
          name: 'Linda Miller',
          relation: 'Spouse',
          phone: '(555) 987-1234',
          altPhone: '(555) 444-5555',
        },
        notes:
          '• Senior management with full system access\n• Authorized for all financial and operational decisions\n• Emergency contact updated January 2024\n• Completed executive leadership training',
        permissions: {
          // User Management - Full Access
          'user-account-view': true,
          'user-account-edit': true,
          'user-permissions-grant': true,
          'user-permissions-revoke': true,
          'user-workflow-modify': true,
          'user-notes-manage': true,
          'user-emergency-contact-edit': true,
          'user-status-change': true,
          'user-delete-account': true,

          // Dispatch Operations - Full Access
          'dispatch-load-create': true,
          'dispatch-load-assign': true,
          'dispatch-driver-assign': true,
          'dispatch-route-optimize': true,
          'dispatch-emergency-override': true,
          'dispatch-load-modify': true,
          'dispatch-status-update': true,
          'dispatch-communication-manage': true,
          'dispatch-load-delete': true,

          // Fleet Management - Full Access
          'fleet-vehicle-tracking': true,
          'fleet-maintenance-schedule': true,
          'fleet-driver-performance': true,
          'fleet-routes-manage': true,
          'fleet-vehicle-assign': true,
          'fleet-inspection-manage': true,
          'fleet-fuel-monitoring': true,
          'fleet-compliance-track': true,
          'fleet-vehicle-modify': true,

          // Broker Operations - Full Access
          'broker-quote-create': true,
          'broker-rate-negotiate': true,
          'broker-customer-manage': true,
          'broker-contract-sign': true,
          'broker-payment-process': true,
          'broker-margin-view': true,
          'broker-analytics-access': true,
          'broker-rfq-respond': true,
          'broker-load-board-access': true,

          // Analytics & Reports - Full Access
          'analytics-financial-view': true,
          'analytics-performance-view': true,
          'analytics-predictive-access': true,
          'reports-generate': true,
          'reports-export': true,
          'reports-schedule': true,
          'dashboard-customize': true,
          'kpi-configure': true,
          'analytics-real-time-access': true,

          // Compliance & Safety - Full Access
          'compliance-dot-manage': true,
          'compliance-audit-access': true,
          'safety-violations-view': true,
          'certificates-manage': true,
          'inspection-schedule': true,
          'driver-qualification-verify': true,

          // Financial & Administrative - Full Access
          'financial-reports-access': true,
          'system-configuration': true,
          'admin-panel-access': true,
          'billing-management': true,
          'contract-management': true,
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'America/New_York',
          dashboardLayout: 'standard',
          notifications: {
            email: true,
            sms: true,
            push: true,
            loadAlerts: true,
            maintenanceReminders: true,
            systemUpdates: false,
          },
        },
        recentActivity: [
          {
            date: '2024-12-18 14:30',
            action: 'Updated driver assignment for Load FL-001',
            type: 'dispatch',
            icon: '🚛',
          },
          {
            date: '2024-12-18 13:15',
            action: 'Generated financial report for Q4',
            type: 'report',
            icon: '📊',
          },
          {
            date: '2024-12-18 11:45',
            action: 'Approved maintenance request for Vehicle T-001',
            type: 'maintenance',
            icon: '🔧',
          },
          {
            date: '2024-12-18 10:20',
            action: 'Updated customer profile for ABC Logistics',
            type: 'customer',
            icon: '👥',
          },
          {
            date: '2024-12-18 09:30',
            action: 'Logged into FleetFlow dashboard',
            type: 'login',
            icon: '🔐',
          },
        ],
      },
      {
        id: 'SJ-DC-20240114-1',
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@fleetflow.com',
        phone: '(555) 234-5678',
        department: 'Dispatch',
        departmentCode: 'DC',
        position: 'Senior Dispatcher',
        role: 'Dispatcher',
        hiredDate: '2024-01-14',
        location: 'Main Office',
        status: 'active',
        lastActive: '2024-12-18T13:45:00Z',
        lastLogin: '2024-12-18 13:45',
        createdDate: '2024-01-14',
        bio: 'Skilled dispatcher with expertise in route optimization and driver coordination. Committed to efficient logistics operations.',
        systemAccess: {
          level: 'Dispatch Operations',
          accessCode: 'ACC-SJ-DC',
          securityLevel: 'Level 3 - Operations',
          allowedSystems: [
            'Dispatch Center',
            'Load Management',
            'Driver Communication',
            'Route Planning',
          ],
        },
        emergencyContact: {
          name: 'Mike Johnson',
          relation: 'Spouse',
          phone: '(555) 876-5432',
        },
        preferences: {
          theme: 'dark',
          language: 'en',
          timezone: 'America/Chicago',
          dashboardLayout: 'compact',
          notifications: {
            email: true,
            sms: true,
            push: true,
            loadAlerts: true,
            maintenanceReminders: false,
            systemUpdates: true,
          },
        },
        recentActivity: [
          {
            date: '2024-12-18 13:45',
            action: 'Assigned Load FL-002 to Driver Rodriguez',
            type: 'dispatch',
            icon: '🚛',
          },
          {
            date: '2024-12-18 12:30',
            action: 'Updated route for Load FL-001',
            type: 'routing',
            icon: '🗺️',
          },
          {
            date: '2024-12-18 11:15',
            action: 'Communicated with Driver Thompson',
            type: 'communication',
            icon: '📞',
          },
        ],
      },
      {
        id: 'ED-BB-20240601-2',
        name: 'Emily Davis',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@fleetflow.com',
        phone: '(555) 345-6789',
        department: 'Brokerage',
        departmentCode: 'BB',
        position: 'Freight Broker',
        role: 'Broker',
        hiredDate: '2024-06-01',
        location: 'Main Office',
        status: 'active',
        lastActive: '2024-12-18T12:20:00Z',
        lastLogin: '2024-12-18 12:20',
        createdDate: '2024-06-01',
        bio: 'Experienced freight broker specializing in customer relationships and rate negotiations. Focused on building long-term partnerships.',
        systemAccess: {
          level: 'Broker Operations',
          accessCode: 'ACC-ED-BB',
          securityLevel: 'Level 3 - Operations',
          allowedSystems: [
            'Broker Portal',
            'Customer Management',
            'Rate Negotiation',
            'Load Board Access',
          ],
        },
        emergencyContact: {
          name: 'Robert Davis',
          relation: 'Father',
          phone: '(555) 654-3210',
        },
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'America/New_York',
          dashboardLayout: 'detailed',
          notifications: {
            email: true,
            sms: false,
            push: true,
            loadAlerts: true,
            maintenanceReminders: false,
            systemUpdates: true,
          },
        },
        recentActivity: [
          {
            date: '2024-12-18 12:20',
            action: 'Negotiated rate for ABC Logistics contract',
            type: 'negotiation',
            icon: '💰',
          },
          {
            date: '2024-12-18 11:30',
            action: 'Created quote for XYZ Shipping',
            type: 'quote',
            icon: '📋',
          },
          {
            date: '2024-12-18 10:45',
            action: 'Updated customer profile for DEF Transport',
            type: 'customer',
            icon: '👥',
          },
        ],
      },
    ];
  }

  /**
   * Simulate user login - in real app this would validate credentials
   * For demo purposes, we'll use the first user (Frank Miller)
   */
  public loginUser(userId: string = 'FM-MGR-20230115-1'): UserProfile | null {
    const user = this.allUsers.find((u) => u.id === userId);
    if (user) {
      this.currentUser = user;
      // Update last login time
      this.currentUser.lastLogin = 'Current session';
      this.currentUser.lastActive = new Date().toISOString();

      // Add login activity
      if (!this.currentUser.recentActivity) {
        this.currentUser.recentActivity = [];
      }
      this.currentUser.recentActivity.unshift({
        date: new Date().toLocaleString(),
        action: 'Logged into FleetFlow dashboard',
        type: 'login',
        icon: '🔐',
      });

      return this.currentUser;
    }
    return null;
  }

  /**
   * Get current logged-in user
   */
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  /**
   * Update user profile (for individual user settings)
   */
  public updateUserProfile(updates: Partial<UserProfile>): boolean {
    if (!this.currentUser) return false;

    // Merge updates with current user data
    this.currentUser = { ...this.currentUser, ...updates };

    // Add activity log entry
    if (!this.currentUser.recentActivity) {
      this.currentUser.recentActivity = [];
    }
    this.currentUser.recentActivity.unshift({
      date: new Date().toLocaleString(),
      action: 'Updated personal profile information',
      type: 'profile',
      icon: '👤',
    });

    // In real app, this would save to database
    console.log('User profile updated:', this.currentUser);
    return true;
  }

  /**
   * Update user preferences
   */
  public updateUserPreferences(
    preferences: UserProfile['preferences']
  ): boolean {
    if (!this.currentUser) return false;

    this.currentUser.preferences = preferences;

    // Add activity log entry
    if (!this.currentUser.recentActivity) {
      this.currentUser.recentActivity = [];
    }
    this.currentUser.recentActivity.unshift({
      date: new Date().toLocaleString(),
      action: 'Updated system preferences',
      type: 'preferences',
      icon: '⚙️',
    });

    return true;
  }

  /**
   * Get all users (for admin User Management page)
   */
  public getAllUsers(): UserProfile[] {
    return this.allUsers;
  }

  /**
   * Create new user (from User Management page)
   */
  public createUser(
    userData: Omit<
      UserProfile,
      'id' | 'createdDate' | 'lastLogin' | 'lastActive'
    >
  ): UserProfile {
    const newUser: UserProfile = {
      ...userData,
      id: this.generateUserId(
        userData.firstName,
        userData.lastName,
        userData.departmentCode,
        userData.hiredDate
      ),
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      lastActive: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/New_York',
        dashboardLayout: 'standard',
        notifications: {
          email: true,
          sms: true,
          push: true,
          loadAlerts: true,
          maintenanceReminders: true,
          systemUpdates: false,
        },
      },
      recentActivity: [
        {
          date: new Date().toLocaleString(),
          action: 'Account created by administrator',
          type: 'account',
          icon: '🆕',
        },
      ],
    };

    this.allUsers.push(newUser);
    return newUser;
  }

  /**
   * Generate user ID in FleetFlow format: {FirstInitial}{LastInitial}-{DepartmentCode}-{HireDateCode}-{SequenceNumber}
   */
  private generateUserId(
    firstName: string,
    lastName: string,
    departmentCode: string,
    hiredDate: string
  ): string {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    // Parse date parts directly to avoid timezone issues
    const [year, month, day] = hiredDate.split('-');
    const hireDateCode = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;

    // Calculate sequence number for the year
    const sequenceNumber = this.calculateSequenceNumber(parseInt(year));

    return `${firstInitial}${lastInitial}-${departmentCode}-${hireDateCode}-${sequenceNumber}`;
  }

  /**
   * Calculate sequence number for user creation within a year
   * 1-365 for first 365 users, then 11, 12, 13... for additional users
   */
  private calculateSequenceNumber(year: number): string {
    // Count existing users created in the same year
    const usersInYear = this.allUsers.filter((user) => {
      const userYear = parseInt(user.id.split('-')[2].substring(0, 4));
      return userYear === year;
    }).length;

    const nextSequence = usersInYear + 1;

    if (nextSequence <= 365) {
      return nextSequence.toString();
    } else {
      // For users beyond 365, use double digits starting from 11
      const extraUsers = nextSequence - 365;
      return (10 + extraUsers).toString();
    }
  }

  /**
   * Logout current user
   */
  public logoutUser(): void {
    if (this.currentUser) {
      // Add logout activity
      if (!this.currentUser.recentActivity) {
        this.currentUser.recentActivity = [];
      }
      this.currentUser.recentActivity.unshift({
        date: new Date().toLocaleString(),
        action: 'Logged out of FleetFlow dashboard',
        type: 'logout',
        icon: '🚪',
      });
    }
    this.currentUser = null;
  }
}

export default UserDataService;
