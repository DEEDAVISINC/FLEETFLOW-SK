'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useOrganization } from '../contexts/OrganizationContext';
import { checkAction } from '../utils/accessControl';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredAction?: string;
  requiredRole?: string;
  requiredRoles?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
  organizationRequired?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredAction,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo,
  organizationRequired = true,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentOrganization, userRole, userPermissions, isLoading } =
    useOrganization();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for session and organization loading
    if (status === 'loading' || isLoading) {
      setHasAccess(null);
      return;
    }

    // Check authentication
    if (status === 'unauthenticated') {
      setHasAccess(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      return;
    }

    // Check organization requirement
    if (organizationRequired && !currentOrganization) {
      setHasAccess(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      return;
    }

    // Check role requirements
    if (requiredRole && userRole !== requiredRole) {
      setHasAccess(false);
      return;
    }

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      setHasAccess(false);
      return;
    }

    // Check permission requirements
    if (requiredPermission) {
      const permissionCheck = checkAction(
        userRole,
        userPermissions,
        requiredPermission
      );
      if (!permissionCheck.hasAccess) {
        setHasAccess(false);
        return;
      }
    }

    // Check action requirements
    if (requiredAction) {
      const actionCheck = checkAction(
        userRole,
        userPermissions,
        requiredAction
      );
      if (!actionCheck.hasAccess) {
        setHasAccess(false);
        return;
      }
    }

    // All checks passed
    setHasAccess(true);
  }, [
    session,
    status,
    currentOrganization,
    userRole,
    userPermissions,
    isLoading,
    requiredPermission,
    requiredAction,
    requiredRole,
    requiredRoles,
    organizationRequired,
    redirectTo,
    router,
  ]);

  // Loading state
  if (hasAccess === null) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!hasAccess) {
    if (redirectTo) {
      return null; // Will redirect via useEffect
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    // Default access denied UI
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-24 w-24 text-red-500'>
            <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>
            Access Denied
          </h2>
          <p className='mt-2 text-gray-600'>
            You don't have permission to access this page.
          </p>
          <div className='mt-6'>
            <button
              onClick={() => router.back()}
              className='rounded-lg bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700'
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Access granted
  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  protectionOptions: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedPageComponent(props: P) {
    return (
      <ProtectedRoute {...protectionOptions}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}

// Specialized protection components
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['owner', 'admin']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function OwnerOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole='owner' fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function ManagerOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['owner', 'admin']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function WithPermission({
  children,
  permission,
  fallback,
}: {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}) {
  return (
    <ProtectedRoute requiredAction={permission} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}


