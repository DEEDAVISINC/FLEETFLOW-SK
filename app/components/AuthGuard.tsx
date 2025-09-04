/**
 * Authentication Guard Component
 * Ensures users are properly authenticated and have valid subscriptions
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import UserDataService from '../services/user-data-service';
import UserIdentifierService from '../services/user-identifier-service';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireSubscription?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireSubscription = false,
  fallback,
  redirectTo = '/auth/signin',
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Check authentication
        if (requireAuth && status !== 'loading') {
          if (status === 'unauthenticated') {
            if (redirectTo) {
              router.push(redirectTo);
            }
            setIsAuthorized(false);
            setIsChecking(false);
            return;
          }
        }

        // Check subscription if required
        if (requireSubscription && session?.user) {
          try {
            const userDataService = UserDataService.getInstance();
            const userIdentifierService = UserIdentifierService.getInstance();
            const userId =
              (session.user as any).fleetflowUserId ||
              userIdentifierService.getUserId(session.user.email || '');

            // Verify subscription status
            const subscriptionResponse = await fetch(
              '/api/auth/verify-subscription',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  email: session.user.email,
                }),
              }
            );

            const subscriptionResult = await subscriptionResponse.json();

            if (!subscriptionResponse.ok) {
              if (subscriptionResult.requiresPayment) {
                // Redirect to plans page with message
                router.push(
                  `/plans?message=${encodeURIComponent(subscriptionResult.message)}`
                );
                setIsAuthorized(false);
                setIsChecking(false);
                return;
              }
            }

            // Set user in UserDataService for consistency
            const userProfile = userDataService.loginUser(userId);
            if (userProfile) {
              console.info('🔐 AuthGuard: User authenticated and authorized', {
                userId: userProfile.id,
                name: userProfile.name,
                hasSubscription: !!subscriptionResult?.success,
              });
            }
          } catch (error) {
            console.error('Subscription verification failed:', error);
            // Allow access even if subscription check fails (graceful degradation)
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authorization check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [session, status, requireAuth, requireSubscription, router, redirectTo]);

  // Show loading state
  if (status === 'loading' || isChecking) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
          <p className='text-gray-600'>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show fallback or redirect if not authorized
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // If we get here, a redirect should have already been triggered
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-600' />
          <p className='text-red-600'>Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authorized
  return <>{children}</>;
}

// Hook for checking authentication status
export function useAuthStatus() {
  const { data: session, status } = useSession();
  const userDataService = UserDataService.getInstance();

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    userProfile: userDataService.getCurrentUser(),
    session,
  };
}
