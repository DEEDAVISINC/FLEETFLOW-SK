// Organization-Aware Data Service
// Provides organization-specific data filtering for multi-user organizations
// Supports brokerage, dispatch, carrier, and shipper organizations

import { getCurrentUser } from '../config/access';
import { OrganizationUser, PERMISSIONS } from '../models/OrganizationUser';
import { organizationService } from './OrganizationService';
import { Load } from './loadService';

export interface OrganizationContext {
  userId: string;
  userRole: OrganizationUser['role'];
  userName: string;
  userEmail: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
  permissions: string[];
}

export class OrganizationDataService {
  /**
   * Get current user's organization context
   */
  static async getOrganizationContext(): Promise<OrganizationContext | null> {
    try {
      // Get current organization from localStorage or context
      const currentOrgId = localStorage.getItem('currentOrganizationId');
      if (!currentOrgId) {
        return null;
      }

      const { user } = getCurrentUser();
      const userOrg = await organizationService.getUserOrganizationRole(
        user.id,
        currentOrgId
      );

      if (!userOrg) {
        return null;
      }

      const organization =
        await organizationService.getOrganization(currentOrgId);

      return {
        userId: user.id,
        userRole: userOrg.role,
        userName: user.name,
        userEmail: user.email,
        organizationId: currentOrgId,
        organizationName: organization?.name || 'Unknown Organization',
        organizationType: organization?.type || 'brokerage',
        permissions: userOrg.permissions,
      };
    } catch (error) {
      console.error('Error getting organization context:', error);
      return null;
    }
  }

  /**
   * Filter loads for current organization (organization-specific data isolation)
   * Returns only loads belonging to the current organization
   */
  static async filterLoadsForOrganization(allLoads: Load[]): Promise<Load[]> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return [];
    }

    // Owners and admins see all organization loads
    if (context.userRole === 'owner' || context.userRole === 'admin') {
      return allLoads.filter(
        (load) => load.organizationId === context.organizationId
      );
    }

    // Agents and dispatchers see loads they can access based on permissions
    if (context.permissions.includes(PERMISSIONS.VIEW_LOADS)) {
      return allLoads.filter((load) => {
        const isOrgLoad = load.organizationId === context.organizationId;

        // If user can create/manage loads, they see more
        if (
          context.permissions.includes(PERMISSIONS.CREATE_LOADS) ||
          context.permissions.includes(PERMISSIONS.EDIT_LOADS)
        ) {
          return isOrgLoad;
        }

        // Otherwise, only loads they're assigned to or created
        return (
          isOrgLoad &&
          (load.dispatcherId === context.userId ||
            load.brokerId === context.userId ||
            load.assignedBy === context.userId ||
            load.assignedTo === context.userId ||
            load.status === 'Available') // Available loads within organization
        );
      });
    }

    return [];
  }

  /**
   * Filter notifications for current organization
   */
  static async filterNotificationsForOrganization(
    allNotifications: any[]
  ): Promise<any[]> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return [];
    }

    // Owners and admins see all organization notifications
    if (context.userRole === 'owner' || context.userRole === 'admin') {
      return allNotifications.filter(
        (notification) => notification.organizationId === context.organizationId
      );
    }

    // Filter notifications by user involvement within organization
    return allNotifications.filter((notification) => {
      const isOrgNotification =
        notification.organizationId === context.organizationId;

      if (!isOrgNotification) return false;

      // Include notifications that mention this user
      const messageContent = notification.message?.toLowerCase() || '';
      const userName = context.userName.toLowerCase();
      const userId = context.userId.toLowerCase();

      return (
        messageContent.includes(userName) ||
        messageContent.includes(userId) ||
        notification.userId === context.userId ||
        notification.assignedTo === context.userId ||
        notification.type === 'system_alert' || // System alerts go to everyone
        notification.type === 'organization_alert' // Organization-wide alerts
      );
    });
  }

  /**
   * Filter drivers for current organization
   */
  static async filterDriversForOrganization(allDrivers: any[]): Promise<any[]> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return [];
    }

    // Owners and admins see all organization drivers
    if (context.userRole === 'owner' || context.userRole === 'admin') {
      return allDrivers.filter(
        (driver) => driver.organizationId === context.organizationId
      );
    }

    // Users with driver management permissions see drivers they can access
    if (context.permissions.includes(PERMISSIONS.VIEW_DRIVERS)) {
      return allDrivers.filter((driver) => {
        const isOrgDriver = driver.organizationId === context.organizationId;

        // If user can manage drivers, they see more
        if (
          context.permissions.includes(PERMISSIONS.CREATE_DRIVERS) ||
          context.permissions.includes(PERMISSIONS.EDIT_DRIVERS)
        ) {
          return isOrgDriver;
        }

        // Otherwise, only drivers they're assigned to
        return (
          isOrgDriver &&
          (driver.assignedDispatcher === context.userId ||
            driver.managedBy === context.userId ||
            driver.status === 'available')
        );
      });
    }

    return [];
  }

  /**
   * Filter carriers for current organization
   */
  static async filterCarriersForOrganization(
    allCarriers: any[]
  ): Promise<any[]> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return [];
    }

    // Owners and admins see all organization carriers
    if (context.userRole === 'owner' || context.userRole === 'admin') {
      return allCarriers.filter(
        (carrier) => carrier.organizationId === context.organizationId
      );
    }

    // Users with carrier management permissions see carriers they can access
    if (context.permissions.includes(PERMISSIONS.VIEW_CARRIERS)) {
      return allCarriers.filter((carrier) => {
        const isOrgCarrier = carrier.organizationId === context.organizationId;

        // If user can manage carriers, they see more
        if (
          context.permissions.includes(PERMISSIONS.CREATE_CARRIERS) ||
          context.permissions.includes(PERMISSIONS.EDIT_CARRIERS)
        ) {
          return isOrgCarrier;
        }

        // Otherwise, only carriers they're assigned to
        return (
          isOrgCarrier &&
          (carrier.primaryContact === context.userId ||
            carrier.managedBy === context.userId ||
            carrier.status === 'active')
        );
      });
    }

    return [];
  }

  /**
   * Filter invoices for current organization
   */
  static async filterInvoicesForOrganization(
    allInvoices: any[]
  ): Promise<any[]> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return [];
    }

    // Owners and admins see all organization invoices
    if (context.userRole === 'owner' || context.userRole === 'admin') {
      return allInvoices.filter(
        (invoice) => invoice.organizationId === context.organizationId
      );
    }

    // Users with financial permissions see invoices they can access
    if (context.permissions.includes(PERMISSIONS.VIEW_FINANCIALS)) {
      return allInvoices.filter((invoice) => {
        const isOrgInvoice = invoice.organizationId === context.organizationId;

        // If user can manage invoices, they see more
        if (
          context.permissions.includes(PERMISSIONS.CREATE_INVOICES) ||
          context.permissions.includes(PERMISSIONS.EDIT_INVOICES)
        ) {
          return isOrgInvoice;
        }

        // Otherwise, only invoices they're involved with
        return (
          isOrgInvoice &&
          (invoice.createdBy === context.userId ||
            invoice.dispatcherId === context.userId ||
            invoice.brokerId === context.userId ||
            invoice.assignedTo === context.userId)
        );
      });
    }

    return [];
  }

  /**
   * Get organization-specific load board data
   * Shows available loads within the organization
   */
  static async getOrganizationLoadBoard(allLoads: Load[]): Promise<Load[]> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return [];
    }

    // Return available loads for the organization's marketplace
    return allLoads.filter(
      (load) =>
        load.organizationId === context.organizationId &&
        (load.status === 'Available' || load.status === 'Draft')
    );
  }

  /**
   * Check if user has access to specific load within organization
   */
  static async hasAccessToLoad(load: Load): Promise<boolean> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return false;
    }

    // Must be from the same organization
    if (load.organizationId !== context.organizationId) {
      return false;
    }

    // Owners and admins have access to everything in their organization
    if (context.userRole === 'owner' || context.userRole === 'admin') {
      return true;
    }

    // Check if user is involved with this load
    return (
      load.dispatcherId === context.userId ||
      load.brokerId === context.userId ||
      load.assignedBy === context.userId ||
      load.assignedTo === context.userId ||
      load.status === 'Available' // Available loads within organization
    );
  }

  /**
   * Get organization-specific dashboard statistics
   */
  static async getOrganizationStats(allLoads: Load[]): Promise<any> {
    const orgLoads = await this.filterLoadsForOrganization(allLoads);
    const context = await this.getOrganizationContext();

    if (!context) {
      return {};
    }

    const stats = {
      total: orgLoads.length,
      available: orgLoads.filter((l) => l.status === 'Available').length,
      assigned: orgLoads.filter((l) => l.status === 'Assigned').length,
      broadcasted: orgLoads.filter((l) => l.status === 'Broadcasted').length,
      driverSelected: orgLoads.filter((l) => l.status === 'Driver Selected')
        .length,
      orderSent: orgLoads.filter((l) => l.status === 'Order Sent').length,
      inTransit: orgLoads.filter((l) => l.status === 'In Transit').length,
      delivered: orgLoads.filter((l) => l.status === 'Delivered').length,
      unassigned: orgLoads.filter(
        (l) => !l.dispatcherId && l.status !== 'Available'
      ).length,
      organization: {
        id: context.organizationId,
        name: context.organizationName,
        type: context.organizationType,
        userRole: context.userRole,
      },
    };

    return stats;
  }

  /**
   * Get organization dashboard metrics for display
   */
  static async getOrganizationDashboardMetrics(
    allLoads: Load[],
    allDrivers: any[],
    allCarriers: any[]
  ): Promise<any> {
    const context = await this.getOrganizationContext();
    if (!context) {
      return {};
    }

    const orgLoads = await this.filterLoadsForOrganization(allLoads);
    const orgDrivers = await this.filterDriversForOrganization(allDrivers);
    const orgCarriers = await this.filterCarriersForOrganization(allCarriers);

    // Calculate revenue metrics (mock for now - would come from invoices)
    const totalRevenue = orgLoads
      .filter((l) => l.status === 'Delivered')
      .reduce((sum, load) => sum + (load.rate || 0), 0);

    const monthlyRevenue = totalRevenue; // Simplified - would calculate for current month

    return {
      organization: {
        name: context.organizationName,
        type: context.organizationType,
        role: context.userRole,
      },
      loads: {
        total: orgLoads.length,
        active: orgLoads.filter((l) =>
          ['Assigned', 'In Transit', 'Driver Selected', 'Order Sent'].includes(
            l.status
          )
        ).length,
        available: orgLoads.filter((l) => l.status === 'Available').length,
        completed: orgLoads.filter((l) => l.status === 'Delivered').length,
      },
      drivers: {
        total: orgDrivers.length,
        available: orgDrivers.filter((d) => d.status === 'available').length,
        active: orgDrivers.filter((d) => d.status === 'active').length,
      },
      carriers: {
        total: orgCarriers.length,
        active: orgCarriers.filter((c) => c.status === 'active').length,
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
      },
      performance: {
        completionRate:
          orgLoads.length > 0
            ? (orgLoads.filter((l) => l.status === 'Delivered').length /
                orgLoads.length) *
              100
            : 0,
        activeLoadRatio:
          orgLoads.length > 0
            ? (orgLoads.filter((l) => l.status === 'In Transit').length /
                orgLoads.length) *
              100
            : 0,
      },
    };
  }

  /**
   * Log organization activity for audit trail
   */
  static async logOrganizationActivity(
    action: string,
    data: any
  ): Promise<void> {
    const context = await this.getOrganizationContext();

    if (context) {
      console.info(`[ORG-${context.organizationId}] ${action}:`, {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        userId: context.userId,
        userName: context.userName,
        userRole: context.userRole,
        timestamp: new Date().toISOString(),
        action,
        data,
      });
    }
  }

  /**
   * TRAINING MANAGEMENT METHODS
   */

  /**
   * Get organization-specific training courses
   */
  static async getOrganizationCourses(organizationId: string): Promise<any[]> {
    try {
      const coursesKey = `org-${organizationId}-courses`;
      const storedCourses = localStorage.getItem(coursesKey);

      if (storedCourses) {
        return JSON.parse(storedCourses);
      }

      // Return empty array if no organization-specific courses exist
      return [];
    } catch (error) {
      console.error('Error getting organization courses:', error);
      return [];
    }
  }

  /**
   * Save organization-specific training courses
   */
  static async saveOrganizationCourses(
    organizationId: string,
    courses: any[]
  ): Promise<void> {
    try {
      const coursesKey = `org-${organizationId}-courses`;
      localStorage.setItem(coursesKey, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving organization courses:', error);
      throw error;
    }
  }

  /**
   * Get user training progress for an organization
   */
  static async getUserTrainingProgress(
    organizationId: string,
    userId: string
  ): Promise<{ [key: string]: boolean }> {
    try {
      const progressKey = `org-${organizationId}-user-${userId}-training-progress`;
      const storedProgress = localStorage.getItem(progressKey);

      if (storedProgress) {
        return JSON.parse(storedProgress);
      }

      return {};
    } catch (error) {
      console.error('Error getting user training progress:', error);
      return {};
    }
  }

  /**
   * Save user training progress for an organization
   */
  static async saveUserTrainingProgress(
    organizationId: string,
    userId: string,
    progress: { [key: string]: boolean }
  ): Promise<void> {
    try {
      const progressKey = `org-${organizationId}-user-${userId}-training-progress`;
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user training progress:', error);
      throw error;
    }
  }

  /**
   * Get organization training analytics
   */
  static async getOrganizationTrainingAnalytics(
    organizationId: string
  ): Promise<any> {
    try {
      const analyticsKey = `org-${organizationId}-training-analytics`;
      const storedAnalytics = localStorage.getItem(analyticsKey);

      if (storedAnalytics) {
        return JSON.parse(storedAnalytics);
      }

      // Return default analytics structure
      return {
        totalUsers: 0,
        enrolledUsers: 0,
        completedCourses: 0,
        averageCompletionRate: 0,
        courseCompletions: {},
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting organization training analytics:', error);
      return {};
    }
  }

  /**
   * Update organization training analytics
   */
  static async updateOrganizationTrainingAnalytics(
    organizationId: string,
    analytics: any
  ): Promise<void> {
    try {
      const analyticsKey = `org-${organizationId}-training-analytics`;
      analytics.lastUpdated = new Date().toISOString();
      localStorage.setItem(analyticsKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error updating organization training analytics:', error);
      throw error;
    }
  }
}

export default OrganizationDataService;
