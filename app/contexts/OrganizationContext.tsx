'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Organization {
  id: string;
  name: string;
  type: 'brokerage' | 'dispatch_agency' | 'carrier' | 'shipper';
  subscription: {
    plan: string;
    seats: {
      total: number;
      used: number;
      available: number;
    };
    billingCycle: 'monthly' | 'annual';
    price: number;
    nextBillingDate: string;
  };
  billing: {
    contactName: string;
    contactEmail: string;
    squareCustomerId: string;
  };
  role?: string;
  permissions?: string[];
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  userOrganizations: Organization[];
  setCurrentOrganization: (org: Organization | null) => void;
  switchOrganization: (orgId: string) => Promise<boolean>;
  userRole: string;
  userPermissions: string[];
  isLoading: boolean;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>(
    []
  );
  const [userRole, setUserRole] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // AUTHENTICATION DISABLED: Skip organization loading completely
  useEffect(() => {
    console.log('🚨 OrganizationProvider: Authentication disabled - skipping organization loading');
    setIsLoading(false);
  }, []);

  // Set current organization when organizations are loaded
  useEffect(() => {
    if (userOrganizations.length > 0 && !currentOrganization) {
      // Try to get from session storage first
      const storedOrgId = localStorage.getItem('currentOrganizationId');
      if (storedOrgId) {
        const storedOrg = userOrganizations.find(
          (org) => org.id === storedOrgId
        );
        if (storedOrg) {
          setCurrentOrganizationWithRole(storedOrg);
          return;
        }
      }

      // Default to first organization
      setCurrentOrganizationWithRole(userOrganizations[0]);
    }
  }, [userOrganizations, currentOrganization]);

  const loadUserOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/organizations');
      const data = await response.json();

      if (data.success) {
        setUserOrganizations(data.organizations);
      } else {
        console.error('Failed to load organizations:', data.error);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentOrganizationWithRole = async (organization: Organization) => {
    setCurrentOrganization(organization);

    // Load user role and permissions for this organization
    try {
      const response = await fetch(
        `/api/organizations/${organization.id}/members/me`
      );
      const data = await response.json();

      if (data.success) {
        setUserRole(data.role);
        setUserPermissions(data.permissions || []);
        // Update organization with role and permissions
        setCurrentOrganization((prev) =>
          prev
            ? {
                ...prev,
                role: data.role,
                permissions: data.permissions,
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error loading user role:', error);
    }

    // Store in localStorage
    localStorage.setItem('currentOrganizationId', organization.id);
  };

  const switchOrganization = async (orgId: string): Promise<boolean> => {
    try {
      const organization = userOrganizations.find((org) => org.id === orgId);
      if (!organization) {
        console.error('Organization not found:', orgId);
        return false;
      }

      // Update current organization on server
      const response = await fetch('/api/user/current-organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId }),
      });

      const data = await response.json();

      if (data.success) {
        await setCurrentOrganizationWithRole(organization);
        return true;
      } else {
        console.error('Failed to switch organization:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error switching organization:', error);
      return false;
    }
  };

  const refreshOrganizations = async () => {
    await loadUserOrganizations();
  };

  const contextValue: OrganizationContextType = {
    currentOrganization,
    userOrganizations,
    setCurrentOrganization: setCurrentOrganizationWithRole,
    switchOrganization,
    userRole,
    userPermissions,
    isLoading,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    );
  }
  return context;
}

// Hook for checking permissions
export function usePermissions() {
  const { userPermissions } = useOrganization();

  const hasPermission = (permission: string): boolean => {
    return (
      userPermissions.includes(permission) || userPermissions.includes('*')
    );
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: userPermissions,
  };
}

// Hook for checking user role
export function useRole() {
  const { userRole } = useOrganization();

  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin' || isOwner;
  const isAgent = userRole === 'agent' || isAdmin;
  const isDispatcher = userRole === 'dispatcher' || isAgent;
  const isStaff = userRole === 'staff' || isDispatcher;

  return {
    role: userRole,
    isOwner,
    isAdmin,
    isAgent,
    isDispatcher,
    isStaff,
  };
}




