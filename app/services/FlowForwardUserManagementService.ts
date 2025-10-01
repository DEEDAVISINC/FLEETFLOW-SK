/**
 * Flow Forward User Management Service
 *
 * Multi-tenant user management for freight forwarding platform
 * Handles user roles, permissions, and billing for different tiers
 */

export interface FlowForwardUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: FlowForwardUserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  tenantId: string;
  permissions: FlowForwardPermission[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    phone?: string;
    avatar?: string;
    timezone: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      shipmentAlerts: boolean;
      quoteAlerts: boolean;
      paymentAlerts: boolean;
    };
  };
}

export interface FlowForwardTenant {
  id: string;
  companyName: string;
  domain?: string; // For custom domains
  subscriptionTier: FlowForwardTier;
  maxUsers: number;
  currentUsers: number;
  billingEmail: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  settings: {
    currency: string;
    timezone: string;
    defaultOriginPorts: string[];
    defaultDestinationPorts: string[];
    autoNotifications: boolean;
    apiAccess: boolean;
    customBranding: boolean;
  };
  subscription: {
    status: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    paymentMethod?: string;
    lastPaymentDate?: Date;
    nextPaymentDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type FlowForwardTier =
  | 'SOLO' // $149/month - 1 user
  | 'PROFESSIONAL' // $549/month - 2-5 users
  | 'ELITE' // $999/month - 6-10 users
  | 'ENTERPRISE'; // $1999/month - 11-25 users

export type FlowForwardUserRole =
  | 'OWNER' // Full access to everything
  | 'ADMIN' // Can manage users, settings, billing
  | 'MANAGER' // Can manage shipments, quotes, customers
  | 'OPERATIONS' // Can create/view shipments, track cargo
  | 'SALES' // Can create quotes, manage customers
  | 'ACCOUNTING' // Can view financials, create invoices
  | 'VIEWER'; // Read-only access

export type FlowForwardPermission =
  // Shipment Management
  | 'SHIPMENTS_CREATE'
  | 'SHIPMENTS_VIEW'
  | 'SHIPMENTS_EDIT'
  | 'SHIPMENTS_DELETE'
  | 'SHIPMENTS_TRACK'

  // Quote Management
  | 'QUOTES_CREATE'
  | 'QUOTES_VIEW'
  | 'QUOTES_EDIT'
  | 'QUOTES_APPROVE'
  | 'QUOTES_DELETE'

  // Customer Management
  | 'CUSTOMERS_CREATE'
  | 'CUSTOMERS_VIEW'
  | 'CUSTOMERS_EDIT'
  | 'CUSTOMERS_DELETE'

  // Contract Management
  | 'CONTRACTS_CREATE'
  | 'CONTRACTS_VIEW'
  | 'CONTRACTS_EDIT'
  | 'CONTRACTS_APPROVE'

  // Financial
  | 'INVOICES_CREATE'
  | 'INVOICES_VIEW'
  | 'PAYMENTS_VIEW'
  | 'FINANCIAL_REPORTS'

  // User Management
  | 'USERS_INVITE'
  | 'USERS_MANAGE'
  | 'USERS_VIEW'

  // Settings
  | 'SETTINGS_VIEW'
  | 'SETTINGS_EDIT'

  // API & Integrations
  | 'API_ACCESS'
  | 'INTEGRATIONS_MANAGE';

export interface PricingTier {
  id: FlowForwardTier;
  name: string;
  price: number;
  currency: string;
  maxUsers: number;
  features: string[];
  additionalUserPrice: number; // Cost per additional user beyond base
  billingCycle: 'monthly' | 'yearly';
}

export class FlowForwardUserManagementService {
  private static readonly TIERS: Record<FlowForwardTier, PricingTier> = {
    SOLO: {
      id: 'SOLO',
      name: 'Flow Forward Solo',
      price: 149,
      currency: 'USD',
      maxUsers: 1,
      additionalUserPrice: 0, // No additional users allowed
      billingCycle: 'monthly',
      features: [
        'Ocean & Air Freight Quoting',
        'Basic Shipment Tracking',
        '5 Customer Contacts',
        'Email Notifications',
        'Basic Reports',
        'Mobile App Access',
      ],
    },
    PROFESSIONAL: {
      id: 'PROFESSIONAL',
      name: 'Flow Forward Professional',
      price: 549,
      currency: 'USD',
      maxUsers: 5,
      additionalUserPrice: 89, // $89 per additional user
      billingCycle: 'monthly',
      features: [
        'Everything in Solo',
        'Advanced Shipment Tracking',
        'Unlimited Customer Contacts',
        'Contract Management',
        'Customs Documentation',
        'API Access',
        'Priority Support',
        'Advanced Reports',
      ],
    },
    ELITE: {
      id: 'ELITE',
      name: 'Flow Forward Elite',
      price: 999,
      currency: 'USD',
      maxUsers: 10,
      additionalUserPrice: 79, // $79 per additional user
      billingCycle: 'monthly',
      features: [
        'Everything in Professional',
        'Cross-Border Intelligence',
        'Maritime Intelligence',
        'Custom Branding',
        'Advanced Analytics',
        'Dedicated Account Manager',
        'Custom Integrations',
        'White-label Options',
      ],
    },
    ENTERPRISE: {
      id: 'ENTERPRISE',
      name: 'Flow Forward Enterprise',
      price: 1999,
      currency: 'USD',
      maxUsers: 25,
      additionalUserPrice: 69, // $69 per additional user
      billingCycle: 'monthly',
      features: [
        'Everything in Elite',
        'Unlimited Users (25+ available)',
        'FleetFlow AI Intelligence',
        'Custom Domain',
        'SSO Integration',
        'Advanced Security',
        '24/7 Premium Support',
        'Custom Development',
      ],
    },
  };

  private static readonly ROLE_PERMISSIONS: Record<
    FlowForwardUserRole,
    FlowForwardPermission[]
  > = {
    OWNER: [
      'SHIPMENTS_CREATE',
      'SHIPMENTS_VIEW',
      'SHIPMENTS_EDIT',
      'SHIPMENTS_DELETE',
      'SHIPMENTS_TRACK',
      'QUOTES_CREATE',
      'QUOTES_VIEW',
      'QUOTES_EDIT',
      'QUOTES_APPROVE',
      'QUOTES_DELETE',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_VIEW',
      'CUSTOMERS_EDIT',
      'CUSTOMERS_DELETE',
      'CONTRACTS_CREATE',
      'CONTRACTS_VIEW',
      'CONTRACTS_EDIT',
      'CONTRACTS_APPROVE',
      'INVOICES_CREATE',
      'INVOICES_VIEW',
      'PAYMENTS_VIEW',
      'FINANCIAL_REPORTS',
      'USERS_INVITE',
      'USERS_MANAGE',
      'USERS_VIEW',
      'SETTINGS_VIEW',
      'SETTINGS_EDIT',
      'API_ACCESS',
      'INTEGRATIONS_MANAGE',
    ],
    ADMIN: [
      'SHIPMENTS_CREATE',
      'SHIPMENTS_VIEW',
      'SHIPMENTS_EDIT',
      'SHIPMENTS_TRACK',
      'QUOTES_CREATE',
      'QUOTES_VIEW',
      'QUOTES_EDIT',
      'QUOTES_APPROVE',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_VIEW',
      'CUSTOMERS_EDIT',
      'CONTRACTS_VIEW',
      'CONTRACTS_EDIT',
      'INVOICES_VIEW',
      'PAYMENTS_VIEW',
      'FINANCIAL_REPORTS',
      'USERS_INVITE',
      'USERS_MANAGE',
      'USERS_VIEW',
      'SETTINGS_VIEW',
      'SETTINGS_EDIT',
      'API_ACCESS',
      'INTEGRATIONS_MANAGE',
    ],
    MANAGER: [
      'SHIPMENTS_CREATE',
      'SHIPMENTS_VIEW',
      'SHIPMENTS_EDIT',
      'SHIPMENTS_TRACK',
      'QUOTES_CREATE',
      'QUOTES_VIEW',
      'QUOTES_EDIT',
      'QUOTES_APPROVE',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_VIEW',
      'CUSTOMERS_EDIT',
      'CONTRACTS_VIEW',
      'INVOICES_VIEW',
      'PAYMENTS_VIEW',
      'USERS_VIEW',
      'SETTINGS_VIEW',
    ],
    OPERATIONS: [
      'SHIPMENTS_CREATE',
      'SHIPMENTS_VIEW',
      'SHIPMENTS_EDIT',
      'SHIPMENTS_TRACK',
      'QUOTES_VIEW',
      'CUSTOMERS_VIEW',
      'INVOICES_VIEW',
    ],
    SALES: [
      'QUOTES_CREATE',
      'QUOTES_VIEW',
      'QUOTES_EDIT',
      'CUSTOMERS_CREATE',
      'CUSTOMERS_VIEW',
      'CUSTOMERS_EDIT',
      'CONTRACTS_VIEW',
    ],
    ACCOUNTING: [
      'SHIPMENTS_VIEW',
      'QUOTES_VIEW',
      'CUSTOMERS_VIEW',
      'INVOICES_CREATE',
      'INVOICES_VIEW',
      'PAYMENTS_VIEW',
      'FINANCIAL_REPORTS',
    ],
    VIEWER: [
      'SHIPMENTS_VIEW',
      'QUOTES_VIEW',
      'CUSTOMERS_VIEW',
      'INVOICES_VIEW',
      'PAYMENTS_VIEW',
    ],
  };

  /**
   * Get pricing tier information
   */
  static getPricingTier(tier: FlowForwardTier): PricingTier {
    return this.TIERS[tier];
  }

  /**
   * Get all pricing tiers
   */
  static getAllPricingTiers(): PricingTier[] {
    return Object.values(this.TIERS);
  }

  /**
   * Calculate total monthly cost for a tenant
   */
  static calculateMonthlyCost(
    tier: FlowForwardTier,
    userCount: number
  ): {
    basePrice: number;
    additionalUsers: number;
    additionalUserCost: number;
    totalCost: number;
    currency: string;
  } {
    const tierInfo = this.TIERS[tier];
    const baseUsers =
      tier === 'SOLO'
        ? 1
        : tier === 'PROFESSIONAL'
          ? 2
          : tier === 'ELITE'
            ? 6
            : 11;
    const additionalUsers = Math.max(0, userCount - baseUsers);
    const additionalUserCost = additionalUsers * tierInfo.additionalUserPrice;

    return {
      basePrice: tierInfo.price,
      additionalUsers,
      additionalUserCost,
      totalCost: tierInfo.price + additionalUserCost,
      currency: tierInfo.currency,
    };
  }

  /**
   * Check if tenant can add more users
   */
  static canAddUsers(tenant: FlowForwardTenant): boolean {
    return tenant.currentUsers < tenant.maxUsers;
  }

  /**
   * Get cost to add one more user
   */
  static getAdditionalUserCost(tier: FlowForwardTier): number {
    return this.TIERS[tier].additionalUserPrice;
  }

  /**
   * Create a new tenant
   */
  static createTenant(
    tenantData: Omit<
      FlowForwardTenant,
      'id' | 'currentUsers' | 'createdAt' | 'updatedAt'
    >
  ): FlowForwardTenant {
    const tenant: FlowForwardTenant = {
      ...tenantData,
      id: this.generateTenantId(),
      currentUsers: 1, // Owner user
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to database
    return tenant;
  }

  /**
   * Create the first user (owner) for a tenant
   */
  static createOwnerUser(
    tenantId: string,
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }
  ): FlowForwardUser {
    const user: FlowForwardUser = {
      id: this.generateUserId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'OWNER',
      status: 'ACTIVE',
      tenantId,
      permissions: this.ROLE_PERMISSIONS.OWNER,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        phone: userData.phone,
        timezone: 'America/New_York',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true,
          shipmentAlerts: true,
          quoteAlerts: true,
          paymentAlerts: true,
        },
      },
    };

    // TODO: Save to database
    return user;
  }

  /**
   * Invite a new user to a tenant
   */
  static inviteUser(
    tenantId: string,
    inviterUserId: string,
    inviteData: {
      email: string;
      role: FlowForwardUserRole;
      firstName?: string;
      lastName?: string;
    }
  ): { success: boolean; user?: FlowForwardUser; error?: string } {
    // TODO: Get tenant from database
    const tenant = this.getTenantById(tenantId);

    if (!tenant) {
      return { success: false, error: 'Tenant not found' };
    }

    if (!this.canAddUsers(tenant)) {
      return { success: false, error: 'Maximum users reached for this tier' };
    }

    // Check if inviter has permission
    const inviter = this.getUserById(inviterUserId);
    if (!inviter || !inviter.permissions.includes('USERS_INVITE')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const user: FlowForwardUser = {
      id: this.generateUserId(),
      email: inviteData.email,
      firstName: inviteData.firstName || '',
      lastName: inviteData.lastName || '',
      role: inviteData.role,
      status: 'PENDING',
      tenantId,
      permissions: this.ROLE_PERMISSIONS[inviteData.role],
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        timezone: 'America/New_York',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true,
          shipmentAlerts: true,
          quoteAlerts: true,
          paymentAlerts: true,
        },
      },
    };

    // TODO: Save user and send invitation email
    tenant.currentUsers += 1;

    return { success: true, user };
  }

  /**
   * Change user role
   */
  static changeUserRole(
    tenantId: string,
    targetUserId: string,
    changerUserId: string,
    newRole: FlowForwardUserRole
  ): {
    success: boolean;
    error?: string;
  } {
    const changer = this.getUserById(changerUserId);
    if (!changer || !changer.permissions.includes('USERS_MANAGE')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const targetUser = this.getUserById(targetUserId);
    if (!targetUser || targetUser.tenantId !== tenantId) {
      return { success: false, error: 'User not found' };
    }

    if (targetUser.role === 'OWNER') {
      return { success: false, error: 'Cannot change owner role' };
    }

    targetUser.role = newRole;
    targetUser.permissions = this.ROLE_PERMISSIONS[newRole];
    targetUser.updatedAt = new Date();

    // TODO: Save to database
    return { success: true };
  }

  /**
   * Upgrade tenant subscription tier
   */
  static upgradeTenant(
    tenantId: string,
    newTier: FlowForwardTier
  ): {
    success: boolean;
    cost?: number;
    error?: string;
  } {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) {
      return { success: false, error: 'Tenant not found' };
    }

    const newTierInfo = this.TIERS[newTier];
    const currentCost = this.calculateMonthlyCost(
      tenant.subscriptionTier,
      tenant.currentUsers
    );
    const newCost = this.calculateMonthlyCost(newTier, tenant.currentUsers);

    tenant.subscriptionTier = newTier;
    tenant.maxUsers = newTierInfo.maxUsers;
    tenant.updatedAt = new Date();

    // TODO: Save to database and process payment
    return { success: true, cost: newCost.totalCost };
  }

  /**
   * Get permissions for a role
   */
  static getRolePermissions(
    role: FlowForwardUserRole
  ): FlowForwardPermission[] {
    return this.ROLE_PERMISSIONS[role];
  }

  /**
   * Check if user has permission
   */
  static hasPermission(
    user: FlowForwardUser,
    permission: FlowForwardPermission
  ): boolean {
    return user.permissions.includes(permission);
  }

  /**
   * Get users by tenant
   */
  static getUsersByTenant(tenantId: string): FlowForwardUser[] {
    // TODO: Query database
    return [];
  }

  /**
   * Generate tenant ID
   */
  private static generateTenantId(): string {
    return `ff_tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate user ID
   */
  private static generateUserId(): string {
    return `ff_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Mock methods for database operations (replace with actual DB calls)
   */
  private static getTenantById(tenantId: string): FlowForwardTenant | null {
    // TODO: Replace with actual database query
    return null;
  }

  private static getUserById(userId: string): FlowForwardUser | null {
    // TODO: Replace with actual database query
    return null;
  }
}
