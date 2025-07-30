import { PortalUser } from '../onboarding/carrier-onboarding/components/PortalSetup';

// User ID generation service
export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  departmentCode: string;
  role: string;
  businessType: string;
  accessLevel: 'pending' | 'active' | 'suspended';
  createdFrom: 'carrier_onboarding' | 'manual_creation';
  onboardingCompleted: boolean;
  hireDate: string;
  portalAccess: {
    sections: string[];
    permissions: string[];
  };
  tenantId?: string;
  managementReviewRequired: boolean;
}

export interface OnboardingCompletionData {
  tenantId: string;
  tenantName: string;
  businessType:
    | 'owner_operator'
    | 'small_fleet'
    | 'company_fleet'
    | 'mixed_operation';
  users: PortalUser[];
  portalConfig: {
    enableLoadBoard: boolean;
    enableBusinessMetrics: boolean;
    restrictCompanyDrivers: boolean;
    allowBidManagement: boolean;
  };
  completedAt: string;
}

export interface ManagementNotification {
  id: string;
  type: 'new_user_access_request';
  tenantId: string;
  tenantName: string;
  userId: string;
  userName: string;
  userRole: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'denied';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

class OnboardingUserIntegrationService {
  // Department code mapping based on roles
  private getDepartmentMapping(
    role: string,
    businessType: string
  ): { code: string; name: string; color: string } {
    const mappings = {
      owner_operator: { code: 'OO', name: 'Owner Operator', color: '#14b8a6' }, // Teal - FLEETFLOW color
      company_driver: {
        code: 'DM',
        name: 'Driver Management',
        color: '#f4a832',
      }, // Yellow - DRIVER MANAGEMENT color
      fleet_manager: {
        code: 'CM',
        name: 'Carrier Management',
        color: '#6366f1',
      }, // Purple - Management color
      dispatcher: { code: 'DC', name: 'Dispatch Central', color: '#3b82f6' }, // Blue - OPERATIONS color
    };

    return (
      mappings[role as keyof typeof mappings] || {
        code: 'GEN',
        name: 'General',
        color: '#6b7280',
      }
    );
  }

  // Generate User ID using the established format: {UserInitials}-{DepartmentCode}-{HireDateCode}
  private generateUserId(
    firstName: string,
    lastName: string,
    role: string,
    businessType: string,
    hireDate: Date
  ): string {
    // Get user initials
    const userInitials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

    // Get department code
    const { code: departmentCode } = this.getDepartmentMapping(
      role,
      businessType
    );

    // Generate hire date code (YYYYDDD format - year + day of year)
    const year = hireDate.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear =
      Math.floor(
        (hireDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const hireDateCode = `${year}${dayOfYear.toString().padStart(3, '0')}`;

    return `${userInitials}-${departmentCode}-${hireDateCode}`;
  }

  // Convert onboarding user to UserProfile for user management
  private createUserProfile(
    onboardingUser: PortalUser,
    onboardingData: OnboardingCompletionData
  ): UserProfile {
    const hireDate = new Date(onboardingData.completedAt);
    const department = this.getDepartmentMapping(
      onboardingUser.role,
      onboardingData.businessType
    );

    const userId = this.generateUserId(
      onboardingUser.firstName,
      onboardingUser.lastName,
      onboardingUser.role,
      onboardingData.businessType,
      hireDate
    );

    return {
      userId,
      firstName: onboardingUser.firstName,
      lastName: onboardingUser.lastName,
      email: onboardingUser.email,
      phone: onboardingUser.phone,
      department: department.name,
      departmentCode: department.code,
      role: onboardingUser.role,
      businessType: onboardingData.businessType,
      accessLevel: 'pending', // Always requires management approval
      createdFrom: 'carrier_onboarding',
      onboardingCompleted: true,
      hireDate: hireDate.toISOString(),
      portalAccess: {
        sections: onboardingUser.portalSections || [],
        permissions: onboardingUser.permissions || [],
      },
      tenantId: onboardingData.tenantId,
      managementReviewRequired: true,
    };
  }

  // Create management notification for new user access request
  private createManagementNotification(
    userProfile: UserProfile,
    tenantName: string
  ): ManagementNotification {
    return {
      id: `mgmt_notify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'new_user_access_request',
      tenantId: userProfile.tenantId!,
      tenantName,
      userId: userProfile.userId,
      userName: `${userProfile.firstName} ${userProfile.lastName}`,
      userRole: userProfile.role,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
  }

  // Main integration method - called when carrier onboarding completes
  public async processOnboardingCompletion(
    onboardingData: OnboardingCompletionData
  ): Promise<{
    userProfiles: UserProfile[];
    managementNotifications: ManagementNotification[];
    success: boolean;
    message: string;
  }> {
    try {
      const userProfiles: UserProfile[] = [];
      const managementNotifications: ManagementNotification[] = [];

      // Process each user from onboarding
      for (const onboardingUser of onboardingData.users) {
        // Create user profile for user management system
        const userProfile = this.createUserProfile(
          onboardingUser,
          onboardingData
        );
        userProfiles.push(userProfile);

        // Create management notification for access approval
        const notification = this.createManagementNotification(
          userProfile,
          onboardingData.tenantName
        );
        managementNotifications.push(notification);

        console.log(
          `✅ User Profile Created: ${userProfile.userId} (${userProfile.firstName} ${userProfile.lastName})`
        );
        console.log(`📧 Management Notification Created: ${notification.id}`);
      }

      // In production, these would be saved to database
      await this.saveUserProfiles(userProfiles);
      await this.sendManagementNotifications(managementNotifications);

      return {
        userProfiles,
        managementNotifications,
        success: true,
        message: `Successfully processed ${userProfiles.length} users from onboarding. Management notifications sent for access approval.`,
      };
    } catch (error) {
      console.error('❌ Onboarding integration failed:', error);
      return {
        userProfiles: [],
        managementNotifications: [],
        success: false,
        message: `Failed to process onboarding completion: ${error}`,
      };
    }
  }

  // Save user profiles to user management system
  private async saveUserProfiles(userProfiles: UserProfile[]): Promise<void> {
    // In production, this would save to database
    // For now, we'll simulate the API call
    console.log('💾 Saving user profiles to User Management system...');

    for (const profile of userProfiles) {
      // Simulate API call to user management
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(
        `   - Saved: ${profile.userId} (${profile.firstName} ${profile.lastName})`
      );
    }
  }

  // Send notifications to management for access approval
  private async sendManagementNotifications(
    notifications: ManagementNotification[]
  ): Promise<void> {
    // In production, this would send actual notifications (email, SMS, in-app)
    console.log('📧 Sending management notifications...');

    for (const notification of notifications) {
      // Simulate notification sending
      await new Promise((resolve) => setTimeout(resolve, 50));
      console.log(
        `   - Notification sent: ${notification.userName} (${notification.userId}) needs access approval`
      );
    }
  }

  // Get all pending management notifications
  public async getPendingNotifications(
    tenantId?: string
  ): Promise<ManagementNotification[]> {
    // In production, this would fetch from database
    // For now, return mock data
    return [
      {
        id: 'mgmt_notify_001',
        type: 'new_user_access_request',
        tenantId: 'tenant_001',
        tenantName: 'ABC Transport LLC',
        userId: 'JD-OO-2025002',
        userName: 'John Davis',
        userRole: 'owner_operator',
        requestedAt: '2025-01-02T10:30:00Z',
        status: 'pending',
      },
      {
        id: 'mgmt_notify_002',
        type: 'new_user_access_request',
        tenantId: 'tenant_001',
        tenantName: 'ABC Transport LLC',
        userId: 'SM-DM-2025002',
        userName: 'Sarah Miller',
        userRole: 'company_driver',
        requestedAt: '2025-01-02T11:15:00Z',
        status: 'pending',
      },
    ];
  }

  // Approve or deny access request
  public async processAccessRequest(
    notificationId: string,
    action: 'approve' | 'deny',
    reviewedBy: string,
    notes?: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // In production, this would update database records
      console.log(
        `🔑 Processing access request: ${notificationId} - ${action.toUpperCase()}`
      );
      console.log(`   - Reviewed by: ${reviewedBy}`);
      if (notes) console.log(`   - Notes: ${notes}`);

      // Simulate database update
      await new Promise((resolve) => setTimeout(resolve, 200));

      return {
        success: true,
        message: `Access request ${action === 'approve' ? 'approved' : 'denied'} successfully.`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to process access request: ${error}`,
      };
    }
  }

  // Get user profile by User ID
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    // In production, this would fetch from database
    // For now, return mock data based on User ID format
    const [initials, deptCode, dateCode] = userId.split('-');

    if (!initials || !deptCode || !dateCode) {
      return null;
    }

    // Mock user profile based on ID structure
    return {
      userId,
      firstName: 'Mock',
      lastName: 'User',
      email: `${userId.toLowerCase()}@example.com`,
      phone: '(555) 123-4567',
      department: this.getDepartmentMapping('owner_operator', 'owner_operator')
        .name,
      departmentCode: deptCode,
      role: 'owner_operator',
      businessType: 'owner_operator',
      accessLevel: 'pending',
      createdFrom: 'carrier_onboarding',
      onboardingCompleted: true,
      hireDate: new Date().toISOString(),
      portalAccess: {
        sections: ['dashboard', 'my_loads', 'load_board'],
        permissions: ['load_tracking', 'document_upload', 'bid_management'],
      },
      tenantId: 'tenant_001',
      managementReviewRequired: true,
    };
  }
}

export default new OnboardingUserIntegrationService();
