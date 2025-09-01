/**
 * Multi-Tenant Utility Functions for FleetFlow
 * Handles tenant identification, validation, and context management
 */

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  domain?: string;
}

interface UserTenantInfo {
  userId: string;
  tenantId: string;
  role: string;
  department: string;
  permissions: string[];
}

// Mock tenant data - in production, this would come from database
const MOCK_TENANTS: Record<string, TenantInfo> = {
  'acme-logistics': {
    id: 'acme-logistics',
    name: 'Acme Logistics Inc',
    slug: 'acme-logistics',
    plan: 'professional',
    status: 'active',
    domain: 'acme-logistics.com',
  },
  'beta-transport': {
    id: 'beta-transport',
    name: 'Beta Transport LLC',
    slug: 'beta-transport',
    plan: 'enterprise',
    status: 'active',
    domain: 'betatransport.com',
  },
  'gamma-freight': {
    id: 'gamma-freight',
    name: 'Gamma Freight Solutions',
    slug: 'gamma-freight',
    plan: 'basic',
    status: 'active',
    domain: 'gamma-freight.net',
  },
};

// Mock user-tenant relationships - in production, this would come from database
const MOCK_USER_TENANTS: Record<string, UserTenantInfo> = {
  'user-123': {
    userId: 'user-123',
    tenantId: 'acme-logistics',
    role: 'Dispatcher',
    department: 'DC',
    permissions: [
      'loads.view',
      'loads.create',
      'invoices.create',
      'square.use',
    ],
  },
  'user-456': {
    userId: 'user-456',
    tenantId: 'beta-transport',
    role: 'Manager',
    department: 'MGR',
    permissions: [
      'loads.view',
      'loads.create',
      'loads.manage',
      'invoices.manage',
      'square.admin',
    ],
  },
  'user-789': {
    userId: 'user-789',
    tenantId: 'gamma-freight',
    role: 'Broker',
    department: 'BB',
    permissions: ['loads.view', 'loads.create', 'rfx.manage'],
  },
};

/**
 * Get tenant ID from various sources
 * Priority order: JWT token > Header > Cookie > URL > Default
 */
export function getTenantId(
  request?: Request | { headers: Headers }
): string | null {
  if (typeof window === 'undefined' && request) {
    // Server-side: Extract from request

    // Method 1: From x-tenant-id header
    const tenantHeader = request.headers.get?.('x-tenant-id');
    if (tenantHeader) return tenantHeader;

    // Method 2: From Authorization header (JWT)
    const authHeader = request.headers.get?.('authorization');
    if (authHeader) {
      try {
        // In production, decode JWT and extract tenant ID
        // const token = authHeader.replace('Bearer ', '');
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // return decoded.tenantId;

        // For demo, extract from mock token
        if (authHeader.includes('acme')) return 'acme-logistics';
        if (authHeader.includes('beta')) return 'beta-transport';
        if (authHeader.includes('gamma')) return 'gamma-freight';
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }

    // Method 3: From cookie header
    const cookieHeader = request.headers.get?.('cookie');
    if (cookieHeader) {
      const tenantCookie = cookieHeader
        .split(';')
        .find((c) => c.trim().startsWith('tenantId='));
      if (tenantCookie) {
        return tenantCookie.split('=')[1];
      }
    }

    // Method 4: From URL (for demo/development)
    const url = new URL(request.url || 'http://localhost');
    const tenantParam = url.searchParams.get('tenantId');
    if (tenantParam) return tenantParam;
  } else if (typeof window !== 'undefined') {
    // Client-side: Extract from browser

    // Method 1: From localStorage
    const storedTenantId = localStorage.getItem('tenantId');
    if (storedTenantId) return storedTenantId;

    // Method 2: From cookie
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('tenantId='));
    if (cookieValue) {
      return cookieValue.split('=')[1];
    }

    // Method 3: From URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenantId');
    if (tenantParam) {
      // Store for future use
      localStorage.setItem('tenantId', tenantParam);
      return tenantParam;
    }

    // Method 4: From subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    if (MOCK_TENANTS[subdomain]) {
      return subdomain;
    }
  }

  // Default tenant for development/demo
  return 'acme-logistics';
}

/**
 * Get current user's tenant information
 */
export function getCurrentUserTenant(userId?: string): UserTenantInfo | null {
  // In production, this would query the database
  const currentUserId = userId || getCurrentUserId();
  return MOCK_USER_TENANTS[currentUserId] || null;
}

/**
 * Get tenant information by ID
 */
export function getTenantInfo(tenantId: string): TenantInfo | null {
  return MOCK_TENANTS[tenantId] || null;
}

/**
 * Mock function to get current user ID
 * In production, this would come from authentication context
 */
function getCurrentUserId(): string {
  // This would typically come from JWT token, session, or auth context
  return 'user-123'; // Mock user ID
}

/**
 * Validate if user has permission for an action within their tenant
 */
export function hasPermission(permission: string, userId?: string): boolean {
  const userTenant = getCurrentUserTenant(userId);
  if (!userTenant) return false;

  return userTenant.permissions.includes(permission);
}

/**
 * Validate if user belongs to a specific tenant
 */
export function belongsToTenant(tenantId: string, userId?: string): boolean {
  const userTenant = getCurrentUserTenant(userId);
  return userTenant?.tenantId === tenantId;
}

/**
 * Get tenant-specific configuration
 */
export async function getTenantConfig(
  tenantId: string,
  configType: string
): Promise<any> {
  // In production, this would query the tenant_integrations table

  // Mock configurations
  const mockConfigs: Record<string, Record<string, any>> = {
    'acme-logistics': {
      square: {
        applicationId: 'sq0idb-acme123',
        environment: 'sandbox',
        locationId: 'location-acme',
        enabled: true,
        connected: true,
      },
      stripe: {
        publishableKey: 'pk_test_acme123',
        environment: 'test',
        enabled: false,
        connected: false,
      },
    },
    'beta-transport': {
      square: {
        applicationId: 'sq0idb-beta456',
        environment: 'sandbox',
        locationId: 'location-beta',
        enabled: true,
        connected: true,
      },
      quickbooks: {
        clientId: 'qb_client_beta',
        environment: 'sandbox',
        enabled: true,
        connected: true,
      },
    },
    'gamma-freight': {
      stripe: {
        publishableKey: 'pk_test_gamma789',
        environment: 'test',
        enabled: true,
        connected: true,
      },
    },
  };

  return mockConfigs[tenantId]?.[configType] || null;
}

/**
 * Set tenant-specific configuration
 */
export async function setTenantConfig(
  tenantId: string,
  configType: string,
  config: any
): Promise<boolean> {
  // In production, this would update the tenant_integrations table
  try {
    console.info(
      `Setting ${configType} config for tenant ${tenantId}:`,
      config
    );

    // Validate user has permission to modify tenant config
    if (!hasPermission(`${configType}.admin`)) {
      throw new Error(
        'Insufficient permissions to modify tenant configuration'
      );
    }

    // Validate user belongs to the tenant
    if (!belongsToTenant(tenantId)) {
      throw new Error('User does not belong to this tenant');
    }

    // Mock save operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    return true;
  } catch (error) {
    console.error('Error setting tenant config:', error);
    return false;
  }
}

/**
 * Generate tenant-scoped API headers
 */
export function getTenantHeaders(tenantId?: string): Record<string, string> {
  const currentTenantId = tenantId || getTenantId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (currentTenantId) {
    headers['x-tenant-id'] = currentTenantId;
  }

  // Add authorization header if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Create tenant-aware fetch wrapper
 */
export async function tenantFetch(
  url: string,
  options: RequestInit = {},
  tenantId?: string
): Promise<Response> {
  const currentTenantId = tenantId || getTenantId();

  const headers = {
    ...getTenantHeaders(currentTenantId),
    ...((options.headers as Record<string, string>) || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Tenant-aware URL builder
 */
export function buildTenantUrl(
  basePath: string,
  params: Record<string, any> = {}
): string {
  const tenantId = getTenantId();
  const url = new URL(basePath, window.location.origin);

  // Add tenant ID as parameter
  if (tenantId) {
    url.searchParams.set('tenantId', tenantId);
  }

  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Client-side tenant context hook data
 */
export function getTenantContext(): {
  tenantId: string | null;
  tenantInfo: TenantInfo | null;
  userTenant: UserTenantInfo | null;
  hasPermission: (permission: string) => boolean;
} {
  const tenantId = getTenantId();
  const tenantInfo = tenantId ? getTenantInfo(tenantId) : null;
  const userTenant = getCurrentUserTenant();

  return {
    tenantId,
    tenantInfo,
    userTenant,
    hasPermission: (permission: string) => hasPermission(permission),
  };
}

/**
 * Switch tenant (for multi-tenant users)
 */
export function switchTenant(newTenantId: string): boolean {
  try {
    // Validate user has access to the new tenant
    // In production, check if user is a member of the target tenant

    if (typeof window !== 'undefined') {
      localStorage.setItem('tenantId', newTenantId);
      document.cookie = `tenantId=${newTenantId}; path=/; secure; samesite=strict`;

      // Reload the page to apply new tenant context
      window.location.reload();
    }

    return true;
  } catch (error) {
    console.error('Error switching tenant:', error);
    return false;
  }
}

const tenantUtils = {
  getTenantId,
  getCurrentUserTenant,
  getTenantInfo,
  hasPermission,
  belongsToTenant,
  getTenantConfig,
  setTenantConfig,
  getTenantHeaders,
  tenantFetch,
  buildTenantUrl,
  getTenantContext,
  switchTenant,
};

export default tenantUtils;
