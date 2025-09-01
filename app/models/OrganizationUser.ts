export interface OrganizationUser {
  id: string;
  userId: string; // Reference to user account
  organizationId: string;
  role: 'owner' | 'admin' | 'agent' | 'dispatcher' | 'staff';
  permissions: string[];
  active: boolean;
  invitedAt: Date;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationUser['role'];
  permissions: string[];
  token: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface AddUserToOrganizationParams {
  userId: string;
  organizationId: string;
  role: OrganizationUser['role'];
  permissions: string[];
}

export interface InviteUserToOrganizationParams {
  organizationId: string;
  email: string;
  role: OrganizationUser['role'];
  permissions: string[];
}

export interface UpdateUserRoleParams {
  organizationId: string;
  userId: string;
  role: OrganizationUser['role'];
  permissions: string[];
}

// Permission constants
export const PERMISSIONS = {
  // Organization management
  MANAGE_ORGANIZATION: 'manage_organization',
  MANAGE_SUBSCRIPTION: 'manage_subscription',
  MANAGE_USERS: 'manage_users',

  // Load management
  VIEW_LOADS: 'view_loads',
  CREATE_LOADS: 'create_loads',
  EDIT_LOADS: 'edit_loads',
  DELETE_LOADS: 'delete_loads',

  // Carrier management
  VIEW_CARRIERS: 'view_carriers',
  CREATE_CARRIERS: 'create_carriers',
  EDIT_CARRIERS: 'edit_carriers',
  DELETE_CARRIERS: 'delete_carriers',

  // Driver management
  VIEW_DRIVERS: 'view_drivers',
  CREATE_DRIVERS: 'create_drivers',
  EDIT_DRIVERS: 'edit_drivers',
  DELETE_DRIVERS: 'delete_drivers',

  // Financial management
  VIEW_FINANCIALS: 'view_financials',
  CREATE_INVOICES: 'create_invoices',
  EDIT_INVOICES: 'edit_invoices',

  // Reporting
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',

  // All permissions
  ALL: '*',
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role permission mappings
export const ROLE_PERMISSIONS: Record<
  OrganizationUser['role'],
  PermissionType[]
> = {
  owner: [PERMISSIONS.ALL],
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SUBSCRIPTION,
    PERMISSIONS.VIEW_LOADS,
    PERMISSIONS.CREATE_LOADS,
    PERMISSIONS.EDIT_LOADS,
    PERMISSIONS.DELETE_LOADS,
    PERMISSIONS.VIEW_CARRIERS,
    PERMISSIONS.CREATE_CARRIERS,
    PERMISSIONS.EDIT_CARRIERS,
    PERMISSIONS.DELETE_CARRIERS,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.CREATE_DRIVERS,
    PERMISSIONS.EDIT_DRIVERS,
    PERMISSIONS.DELETE_DRIVERS,
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.CREATE_INVOICES,
    PERMISSIONS.EDIT_INVOICES,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_DATA,
  ],
  agent: [
    PERMISSIONS.VIEW_LOADS,
    PERMISSIONS.CREATE_LOADS,
    PERMISSIONS.EDIT_LOADS,
    PERMISSIONS.VIEW_CARRIERS,
    PERMISSIONS.CREATE_CARRIERS,
    PERMISSIONS.EDIT_CARRIERS,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.CREATE_DRIVERS,
    PERMISSIONS.EDIT_DRIVERS,
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.CREATE_INVOICES,
  ],
  dispatcher: [
    PERMISSIONS.VIEW_LOADS,
    PERMISSIONS.CREATE_LOADS,
    PERMISSIONS.EDIT_LOADS,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.CREATE_DRIVERS,
    PERMISSIONS.EDIT_DRIVERS,
    PERMISSIONS.DELETE_DRIVERS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  staff: [
    PERMISSIONS.VIEW_LOADS,
    PERMISSIONS.VIEW_CARRIERS,
    PERMISSIONS.VIEW_DRIVERS,
    PERMISSIONS.VIEW_FINANCIALS,
  ],
};

