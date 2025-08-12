// Multi-Tenant Data Service
// Provides user-specific data filtering while maintaining global load board access
// Supports both individual dispatchers and dispatch companies

import { getCurrentUser } from '../config/access';
import { Load } from './loadService';

export interface TenantContext {
  userId: string;
  userRole: 'admin' | 'dispatcher' | 'driver' | 'broker';
  userName: string;
  userEmail: string;
  brokerId?: string;
}

export class MultiTenantDataService {
  /**
   * Get current user's tenant context
   */
  static getTenantContext(): TenantContext {
    const { user } = getCurrentUser();
    return {
      userId: user.id,
      userRole: user.role,
      userName: user.name,
      userEmail: user.email,
      brokerId: user.brokerId,
    };
  }

  /**
   * Filter loads for current tenant (user-specific data isolation)
   * Returns only loads assigned to or managed by the current user
   */
  static filterLoadsForTenant(allLoads: Load[]): Load[] {
    const context = this.getTenantContext();
    
    // Admin sees all loads
    if (context.userRole === 'admin') {
      return allLoads;
    }

    // Dispatchers see:
    // 1. Loads assigned to them (dispatcherId matches)
    // 2. Available loads they can pick up
    // 3. Loads they created/managed
    if (context.userRole === 'dispatcher') {
      return allLoads.filter(load => 
        load.dispatcherId === context.userId ||
        load.status === 'Available' ||
        load.brokerId === context.userId ||
        load.assignedBy === context.userId
      );
    }

    // Brokers see:
    // 1. Loads they created (brokerId matches)
    // 2. Available loads in the marketplace
    if (context.userRole === 'broker') {
      return allLoads.filter(load =>
        load.brokerId === context.brokerId ||
        load.brokerId === context.userId ||
        load.status === 'Available'
      );
    }

    // Drivers see loads assigned to them or available for pickup
    if (context.userRole === 'driver') {
      return allLoads.filter(load =>
        load.assignedTo === context.userId ||
        load.status === 'Available'
      );
    }

    return [];
  }

  /**
   * Filter notifications for current tenant
   */
  static filterNotificationsForTenant(allNotifications: any[]): any[] {
    const context = this.getTenantContext();
    
    // Admin sees all notifications
    if (context.userRole === 'admin') {
      return allNotifications;
    }

    // Filter notifications by user involvement
    return allNotifications.filter(notification => {
      // Include notifications that mention this user
      const messageContent = notification.message.toLowerCase();
      const userName = context.userName.toLowerCase();
      const userId = context.userId.toLowerCase();
      
      return (
        messageContent.includes(userName) ||
        messageContent.includes(userId) ||
        notification.userId === context.userId ||
        notification.assignedTo === context.userId ||
        notification.type === 'system_alert' // System alerts go to everyone
      );
    });
  }

  /**
   * Filter drivers for current tenant
   */
  static filterDriversForTenant(allDrivers: any[]): any[] {
    const context = this.getTenantContext();
    
    // Admin sees all drivers
    if (context.userRole === 'admin') {
      return allDrivers;
    }

    // Dispatchers and brokers see drivers assigned to them or available
    return allDrivers.filter(driver =>
      driver.assignedDispatcher === context.userId ||
      driver.managedBy === context.userId ||
      driver.status === 'available' ||
      !driver.assignedDispatcher // Unassigned drivers available to all
    );
  }

  /**
   * Filter carriers for current tenant
   */
  static filterCarriersForTenant(allCarriers: any[]): any[] {
    const context = this.getTenantContext();
    
    // Admin sees all carriers
    if (context.userRole === 'admin') {
      return allCarriers;
    }

    // Dispatchers and brokers see carriers they work with or available ones
    return allCarriers.filter(carrier =>
      carrier.primaryContact === context.userId ||
      carrier.managedBy === context.userId ||
      carrier.status === 'active' ||
      !carrier.primaryContact // Available carriers
    );
  }

  /**
   * Filter invoices for current tenant
   */
  static filterInvoicesForTenant(allInvoices: any[]): any[] {
    const context = this.getTenantContext();
    
    // Admin sees all invoices
    if (context.userRole === 'admin') {
      return allInvoices;
    }

    // Filter invoices by user involvement
    return allInvoices.filter(invoice =>
      invoice.createdBy === context.userId ||
      invoice.dispatcherId === context.userId ||
      invoice.brokerId === context.userId ||
      invoice.assignedTo === context.userId
    );
  }

  /**
   * Get global load board data (shared marketplace)
   * This is NOT filtered by tenant - all users see the same load board
   */
  static getGlobalLoadBoard(allLoads: Load[]): Load[] {
    // Return all available loads for the global marketplace
    return allLoads.filter(load => 
      load.status === 'Available' || 
      load.status === 'Draft'
    );
  }

  /**
   * Check if user has access to specific load
   */
  static hasAccessToLoad(load: Load): boolean {
    const context = this.getTenantContext();
    
    // Admin has access to everything
    if (context.userRole === 'admin') {
      return true;
    }

    // Check if user is involved with this load
    return (
      load.dispatcherId === context.userId ||
      load.brokerId === context.userId ||
      load.assignedBy === context.userId ||
      load.assignedTo === context.userId ||
      load.status === 'Available' // Available loads are public
    );
  }

  /**
   * Get tenant-specific dashboard statistics
   */
  static getTenantStats(allLoads: Load[]): any {
    const tenantLoads = this.filterLoadsForTenant(allLoads);
    
    return {
      total: tenantLoads.length,
      available: tenantLoads.filter(l => l.status === 'Available').length,
      assigned: tenantLoads.filter(l => l.status === 'Assigned').length,
      broadcasted: tenantLoads.filter(l => l.status === 'Broadcasted').length,
      driverSelected: tenantLoads.filter(l => l.status === 'Driver Selected').length,
      orderSent: tenantLoads.filter(l => l.status === 'Order Sent').length,
      inTransit: tenantLoads.filter(l => l.status === 'In Transit').length,
      delivered: tenantLoads.filter(l => l.status === 'Delivered').length,
      unassigned: tenantLoads.filter(l => !l.dispatcherId && l.status !== 'Available').length,
    };
  }

  /**
   * Log tenant activity for audit trail
   */
  static logTenantActivity(action: string, data: any): void {
    const context = this.getTenantContext();
    
    console.log(`[TENANT-${context.userId}] ${action}:`, {
      userId: context.userId,
      userName: context.userName,
      userRole: context.userRole,
      timestamp: new Date().toISOString(),
      action,
      data,
    });
  }
}

export default MultiTenantDataService;






