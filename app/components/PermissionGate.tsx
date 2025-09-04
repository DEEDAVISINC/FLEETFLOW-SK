'use client';

import { ReactNode } from 'react';
import { usePermissions } from '../contexts/OrganizationContext';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, requires ALL permissions, otherwise ANY
}

interface RoleGateProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, requires ALL roles, otherwise ANY
}

interface OrganizationGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Component that shows content only if user has specific permission
export function PermissionGate({
  permission,
  children,
  fallback = null,
  requireAll = false,
}: PermissionGateProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  const hasAccess = requireAll
    ? hasAllPermissions(permission.split(',').map((p) => p.trim()))
    : hasPermission(permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Component that shows content only if user has specific role(s)
export function RoleGate({
  roles,
  children,
  fallback = null,
  requireAll = false,
}: RoleGateProps) {
  const { role } = usePermissions();

  const hasAccess = requireAll
    ? roles.every((requiredRole) => role === requiredRole)
    : roles.some((requiredRole) => role === requiredRole);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Component that shows content only if user is in an organization
export function OrganizationGate({
  children,
  fallback = null,
}: OrganizationGateProps) {
  const { currentOrganization } = usePermissions();

  return currentOrganization ? <>{children}</> : <>{fallback}</>;
}

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: string,
  fallback?: ReactNode
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGate permission={permission} fallback={fallback}>
        <WrappedComponent {...props} />
      </PermissionGate>
    );
  };
}

// Higher-order component for role-based rendering
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  roles: string[],
  fallback?: ReactNode,
  requireAll = false
) {
  return function RoleWrappedComponent(props: P) {
    return (
      <RoleGate roles={roles} fallback={fallback} requireAll={requireAll}>
        <WrappedComponent {...props} />
      </RoleGate>
    );
  };
}

// Utility component for conditional rendering based on ownership
export function IfOwner({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGate roles={['owner']} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

// Utility component for conditional rendering based on admin access
export function IfAdmin({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGate roles={['owner', 'admin']} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

// Utility component for conditional rendering based on management permissions
export function IfCanManage({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate
      permission='manage_users,manage_organization'
      fallback={fallback}
    >
      {children}
    </PermissionGate>
  );
}


