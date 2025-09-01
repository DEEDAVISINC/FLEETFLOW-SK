import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { organizationService } from '../services/OrganizationService';
import { checkAction, checkPermission } from '../utils/accessControl';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  organization?: {
    id: string;
    role: string;
    permissions: string[];
  };
}

export interface AuthResult {
  authenticated: boolean;
  authorized: boolean;
  user?: any;
  organization?: any;
  error?: string;
}

/**
 * Authenticate user and check organization access
 */
export async function authenticateOrganizationRequest(
  request: NextRequest,
  organizationId?: string,
  requiredPermission?: string,
  requiredAction?: string
): Promise<AuthResult> {
  try {
    // Get user session
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        authenticated: false,
        authorized: false,
        error: 'Not authenticated',
      };
    }

    const user = {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
    };

    // If no organization ID is required, just return authenticated user
    if (!organizationId) {
      return {
        authenticated: true,
        authorized: true,
        user,
      };
    }

    // Get user's role in the organization
    const userRole = await organizationService.getUserOrganizationRole(
      user.id,
      organizationId
    );

    if (!userRole) {
      return {
        authenticated: true,
        authorized: false,
        user,
        error: 'User is not a member of this organization',
      };
    }

    const organization = {
      id: organizationId,
      role: userRole.role,
      permissions: userRole.permissions,
    };

    // Check specific permission if required
    if (requiredPermission) {
      const permissionCheck = checkPermission(
        userRole.permissions,
        requiredPermission as any
      );

      if (!permissionCheck.hasAccess) {
        return {
          authenticated: true,
          authorized: false,
          user,
          organization,
          error: permissionCheck.reason,
        };
      }
    }

    // Check specific action if required
    if (requiredAction) {
      const actionCheck = checkAction(
        userRole.role,
        userRole.permissions,
        requiredAction
      );

      if (!actionCheck.hasAccess) {
        return {
          authenticated: true,
          authorized: false,
          user,
          organization,
          error: actionCheck.reason,
        };
      }
    }

    return {
      authenticated: true,
      authorized: true,
      user,
      organization,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      authorized: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Middleware function for protecting API routes
 */
export async function withOrganizationAuth(
  request: NextRequest,
  organizationId?: string,
  options?: {
    requiredPermission?: string;
    requiredAction?: string;
    allowPublicAccess?: boolean;
  }
): Promise<{ success: boolean; data?: any; response?: NextResponse }> {
  const auth = await authenticateOrganizationRequest(
    request,
    organizationId,
    options?.requiredPermission,
    options?.requiredAction
  );

  if (!auth.authenticated) {
    return {
      success: false,
      response: NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  if (!auth.authorized) {
    return {
      success: false,
      response: NextResponse.json(
        { error: auth.error || 'Access denied' },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    data: auth,
  };
}

/**
 * Helper function to get organization ID from URL params
 */
export function getOrganizationIdFromParams(params: any): string | undefined {
  return params?.id || params?.organizationId;
}

/**
 * Common authorization patterns
 */
export const AuthorizationPatterns = {
  // Organization management
  MANAGE_ORGANIZATION: { requiredPermission: 'manage_organization' },
  MANAGE_SUBSCRIPTION: { requiredPermission: 'manage_subscription' },
  MANAGE_USERS: { requiredPermission: 'manage_users' },

  // Load operations
  VIEW_LOADS: { requiredAction: 'view_loads' },
  CREATE_LOADS: { requiredAction: 'create_loads' },
  EDIT_LOADS: { requiredAction: 'edit_loads' },
  DELETE_LOADS: { requiredAction: 'delete_loads' },

  // Carrier operations
  VIEW_CARRIERS: { requiredAction: 'view_carriers' },
  CREATE_CARRIERS: { requiredAction: 'create_carriers' },
  EDIT_CARRIERS: { requiredAction: 'edit_carriers' },

  // Driver operations
  VIEW_DRIVERS: { requiredAction: 'view_drivers' },
  CREATE_DRIVERS: { requiredAction: 'create_drivers' },
  EDIT_DRIVERS: { requiredAction: 'edit_drivers' },

  // Financial operations
  VIEW_FINANCIALS: { requiredAction: 'view_financials' },
  CREATE_INVOICES: { requiredAction: 'create_invoices' },

  // Reporting
  VIEW_REPORTS: { requiredAction: 'view_reports' },
  EXPORT_DATA: { requiredAction: 'export_data' },
} as const;

