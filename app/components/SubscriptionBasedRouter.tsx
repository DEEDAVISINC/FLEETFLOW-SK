'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SquareSubscriptionService } from '../services/SquareSubscriptionService';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';

export interface UserRouting {
  userId: string;
  subscriptionTier: string;
  accessLevel: 'admin' | 'dispatcher' | 'broker' | 'trial' | 'basic';
  redirectTo: string;
  permissions: string[];
}

export default function SubscriptionBasedRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(true);
  const [userRouting, setUserRouting] = useState<UserRouting | null>(null);

  useEffect(() => {
    if (status === 'loading') return; // Still loading session

    if (status === 'unauthenticated') {
      // Not signed in, redirect to signin
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      routeUserBasedOnSubscription();
    }
  }, [status, session]);

  const routeUserBasedOnSubscription = async () => {
    try {
      const userEmail = session?.user?.email;
      const userName = session?.user?.name || 'User';

      if (!userEmail) {
        console.error('No user email found in session');
        router.push('/auth/signin');
        return;
      }

      // Map demo accounts to user IDs (same as in SquareSubscriptionService)
      const userIdMap: Record<string, string> = {
        'info@deedavis.biz': 'DEPOINTE-ADMIN-001',
        'admin@fleetflowapp.com': 'admin-001',
        'dispatch@fleetflowapp.com': 'disp-001',
      };

      const userId =
        userIdMap[userEmail] || userEmail.replace('@', '-').replace('.', '-');

      console.log('🔍 Checking subscription for user:', userId, userEmail);

      // Try to get subscription info from Square service first
      const squareService = new SquareSubscriptionService();
      let subscriptionInfo;

      try {
        subscriptionInfo = await squareService.getUserSubscriptionInfo(userId);
      } catch (error) {
        console.warn(
          'Square subscription check failed, trying general subscription service:',
          error
        );
      }

      // Fallback to general subscription management service
      if (!subscriptionInfo) {
        try {
          const generalSubscription =
            SubscriptionManagementService.getUserSubscription(userId);
          if (generalSubscription) {
            subscriptionInfo = {
              subscriptions: [generalSubscription],
              activePlans: [generalSubscription.subscriptionTierId],
              accessiblePages: [],
              restrictedFeatures: [],
              usageLimits: {
                maxUsers: 10,
                maxDataStorage: 1000,
                apiCallLimit: 1000,
              },
            };
          }
        } catch (error) {
          console.warn('General subscription check failed:', error);
        }
      }

      // Determine user routing based on subscription info
      const routing = determineUserRouting(userId, userEmail, subscriptionInfo);

      setUserRouting(routing);

      console.log('✅ User routing determined:', routing);

      // Route user to appropriate dashboard
      router.push(routing.redirectTo);
    } catch (error) {
      console.error('Error during subscription-based routing:', error);
      // Default fallback - route to basic dashboard
      router.push('/fleetflowdash');
    } finally {
      setIsRouting(false);
    }
  };

  const determineUserRouting = (
    userId: string,
    userEmail: string,
    subscriptionInfo: any
  ): UserRouting => {
    // DEPOINTE Admin - full access
    if (userEmail === 'info@deedavis.biz' || userId === 'DEPOINTE-ADMIN-001') {
      return {
        userId,
        subscriptionTier: 'admin',
        accessLevel: 'admin',
        redirectTo: '/fleetflowdash', // Admin dashboard
        permissions: ['*'], // Full permissions
      };
    }

    // Admin user - full access
    if (userEmail === 'admin@fleetflowapp.com' || userId === 'admin-001') {
      return {
        userId,
        subscriptionTier: 'admin',
        accessLevel: 'admin',
        redirectTo: '/fleetflowdash', // Admin dashboard
        permissions: ['*'], // Full permissions
      };
    }

    // Dispatcher user - dispatch focused access
    if (userEmail === 'dispatch@fleetflowapp.com' || userId === 'disp-001') {
      return {
        userId,
        subscriptionTier: 'dispatcher',
        accessLevel: 'dispatcher',
        redirectTo: '/dispatch', // Dispatch dashboard
        permissions: ['dispatch', 'drivers', 'loads', 'tracking'],
      };
    }

    // Check if user has active subscription
    if (subscriptionInfo?.subscriptions?.length > 0) {
      const activeSubscription = subscriptionInfo.subscriptions.find(
        (sub: any) => sub.status === 'active' || sub.status === 'trial'
      );

      if (activeSubscription) {
        // Route based on subscription plan
        const planIds = subscriptionInfo.activePlans || [];

        if (
          planIds.some(
            (plan: string) =>
              plan.includes('enterprise') || plan.includes('admin')
          )
        ) {
          return {
            userId,
            subscriptionTier: 'enterprise',
            accessLevel: 'admin',
            redirectTo: '/fleetflowdash',
            permissions: ['admin', 'dispatch', 'broker', 'reports', 'users'],
          };
        }

        if (planIds.some((plan: string) => plan.includes('broker'))) {
          return {
            userId,
            subscriptionTier: 'broker',
            accessLevel: 'broker',
            redirectTo: '/broker/dashboard',
            permissions: ['broker', 'loads', 'carriers', 'customers'],
          };
        }

        if (planIds.some((plan: string) => plan.includes('dispatcher'))) {
          return {
            userId,
            subscriptionTier: 'dispatcher',
            accessLevel: 'dispatcher',
            redirectTo: '/dispatch',
            permissions: ['dispatch', 'drivers', 'loads', 'tracking'],
          };
        }
      }
    }

    // Default: Basic/Trial access
    return {
      userId,
      subscriptionTier: 'trial',
      accessLevel: 'trial',
      redirectTo: '/fleetflowdash', // Basic dashboard with limited features
      permissions: ['basic', 'trial'],
    };
  };

  // Show loading state while routing
  if (isRouting || status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }}
          ></div>
          🔐 Authenticating and checking subscription...
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Return children once routing is complete
  return <>{children}</>;
}

// Export routing utilities for use in other components
export const useUserRouting = () => {
  const { data: session } = useSession();

  const getCurrentUserRouting = async (): Promise<UserRouting | null> => {
    if (!session?.user?.email) return null;

    // Implement similar logic as above but for hooks usage
    const userEmail = session.user.email;
    const userIdMap: Record<string, string> = {
      'admin@fleetflowapp.com': 'admin-001',
      'dispatch@fleetflowapp.com': 'disp-001',
    };

    const userId =
      userIdMap[userEmail] || userEmail.replace('@', '-').replace('.', '-');

    // Return basic routing info without redirecting
    if (userEmail === 'info@deedavis.biz') {
      return {
        userId,
        subscriptionTier: 'admin',
        accessLevel: 'admin',
        redirectTo: '/fleetflowdash',
        permissions: ['*'],
      };
    }

    if (userEmail === 'admin@fleetflowapp.com') {
      return {
        userId,
        subscriptionTier: 'admin',
        accessLevel: 'admin',
        redirectTo: '/fleetflowdash',
        permissions: ['*'],
      };
    }

    if (userEmail === 'dispatch@fleetflowapp.com') {
      return {
        userId,
        subscriptionTier: 'dispatcher',
        accessLevel: 'dispatcher',
        redirectTo: '/dispatch',
        permissions: ['dispatch', 'drivers', 'loads', 'tracking'],
      };
    }

    return {
      userId,
      subscriptionTier: 'trial',
      accessLevel: 'trial',
      redirectTo: '/fleetflowdash',
      permissions: ['basic', 'trial'],
    };
  };

  return { getCurrentUserRouting };
};
