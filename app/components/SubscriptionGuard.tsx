'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SquareSubscriptionService } from '../services/SquareSubscriptionService';

export interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredAccess?: 'admin' | 'dispatcher' | 'broker' | 'trial' | 'basic';
  requiredFeature?: string;
  fallbackComponent?: React.ReactNode;
  redirectOnFail?: string;
  showUpgradePrompt?: boolean;
}

export interface UserAccess {
  hasAccess: boolean;
  userTier: string;
  requiredTier: string;
  canUpgrade: boolean;
  blockingReason?: string;
}

export default function SubscriptionGuard({
  children,
  requiredAccess = 'trial',
  requiredFeature,
  fallbackComponent,
  redirectOnFail,
  showUpgradePrompt = true,
}: SubscriptionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accessResult, setAccessResult] = useState<UserAccess | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      if (redirectOnFail) {
        router.push(redirectOnFail);
      } else {
        router.push('/auth/signin');
      }
      return;
    }

    if (status === 'authenticated') {
      checkUserAccess();
    }
  }, [status, session, requiredAccess, requiredFeature]);

  const checkUserAccess = async () => {
    try {
      const userEmail = session?.user?.email;

      if (!userEmail) {
        setAccessResult({
          hasAccess: false,
          userTier: 'none',
          requiredTier: requiredAccess,
          canUpgrade: true,
          blockingReason: 'No user email found',
        });
        setIsChecking(false);
        return;
      }

      // Map demo accounts to user IDs
      const userIdMap: Record<string, string> = {
        'admin@fleetflowapp.com': 'admin-001',
        'dispatch@fleetflowapp.com': 'disp-001',
      };

      const userId =
        userIdMap[userEmail] || userEmail.replace('@', '-').replace('.', '-');

      // Get user subscription info
      let userTier = 'trial';
      let hasSubscriptionAccess = false;

      // Check admin access
      if (userEmail === 'admin@fleetflowapp.com') {
        userTier = 'admin';
        hasSubscriptionAccess = true;
      }
      // Check dispatcher access
      else if (userEmail === 'dispatch@fleetflowapp.com') {
        userTier = 'dispatcher';
        hasSubscriptionAccess = true;
      }
      // Check subscription services
      else {
        try {
          const squareService = new SquareSubscriptionService();
          const subscriptionInfo =
            await squareService.getUserSubscriptionInfo(userId);

          if (subscriptionInfo?.subscriptions?.length > 0) {
            const activeSubscription = subscriptionInfo.subscriptions.find(
              (sub: any) => sub.status === 'active' || sub.status === 'trial'
            );

            if (activeSubscription) {
              hasSubscriptionAccess = true;
              const planIds = subscriptionInfo.activePlans || [];

              if (planIds.some((plan: string) => plan.includes('enterprise'))) {
                userTier = 'admin';
              } else if (
                planIds.some((plan: string) => plan.includes('broker'))
              ) {
                userTier = 'broker';
              } else if (
                planIds.some((plan: string) => plan.includes('dispatcher'))
              ) {
                userTier = 'dispatcher';
              }
            }
          }
        } catch (error) {
          console.warn(
            'Subscription check failed, defaulting to trial:',
            error
          );
        }
      }

      // Check if user has required access level
      const hasAccess = checkAccessLevel(
        userTier,
        requiredAccess,
        requiredFeature
      );

      setAccessResult({
        hasAccess,
        userTier,
        requiredTier: requiredAccess,
        canUpgrade: !hasAccess && userTier !== 'admin',
        blockingReason: hasAccess
          ? undefined
          : `Requires ${requiredAccess} access level`,
      });
    } catch (error) {
      console.error('Error checking user access:', error);
      setAccessResult({
        hasAccess: false,
        userTier: 'unknown',
        requiredTier: requiredAccess,
        canUpgrade: true,
        blockingReason: 'Error checking subscription',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const checkAccessLevel = (
    userTier: string,
    requiredTier: string,
    feature?: string
  ): boolean => {
    // Access level hierarchy (higher levels include lower levels)
    const tierHierarchy: Record<string, number> = {
      trial: 0,
      basic: 1,
      dispatcher: 2,
      broker: 3,
      admin: 4,
    };

    const userLevel = tierHierarchy[userTier] || 0;
    const requiredLevel = tierHierarchy[requiredTier] || 0;

    // Check specific feature access
    if (feature) {
      const featureAccess: Record<string, string[]> = {
        'advanced-reports': ['admin', 'broker'],
        'user-management': ['admin'],
        billing: ['admin'],
        'api-access': ['admin', 'broker'],
        'white-label': ['admin'],
        'multi-tenant': ['admin'],
        'load-tracking': ['dispatcher', 'broker', 'admin'],
        'carrier-management': ['broker', 'admin'],
        'driver-management': ['dispatcher', 'admin'],
      };

      const allowedTiers = featureAccess[feature] || [];
      return allowedTiers.includes(userTier);
    }

    return userLevel >= requiredLevel;
  };

  // Show loading state
  if (isChecking || status === 'loading') {
    return (
      <div
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '10px',
          }}
        ></div>
        Checking access permissions...
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

  // No access result available
  if (!accessResult) {
    return fallbackComponent || <div>Unable to verify access permissions</div>;
  }

  // User has access - show content
  if (accessResult.hasAccess) {
    return <>{children}</>;
  }

  // User doesn't have access - handle based on props
  if (redirectOnFail) {
    router.push(redirectOnFail);
    return null;
  }

  // Show fallback component if provided
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Show upgrade prompt if enabled
  if (showUpgradePrompt) {
    return (
      <UpgradePrompt
        accessResult={accessResult}
        requiredFeature={requiredFeature}
      />
    );
  }

  // Default access denied message
  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
      }}
    >
      <h3>Access Restricted</h3>
      <p>This feature requires {accessResult.requiredTier} access level.</p>
      <p>Your current level: {accessResult.userTier}</p>
    </div>
  );
}

// Upgrade Prompt Component
function UpgradePrompt({
  accessResult,
  requiredFeature,
}: {
  accessResult: UserAccess;
  requiredFeature?: string;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        margin: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
        Premium Feature
      </h2>
      <p style={{ margin: '0 0 24px 0', fontSize: '16px', opacity: 0.9 }}>
        {requiredFeature
          ? `The "${requiredFeature}" feature requires ${accessResult.requiredTier} access.`
          : `This feature requires ${accessResult.requiredTier} access level.`}
      </p>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', opacity: 0.8 }}>
        Your current level: <strong>{accessResult.userTier}</strong>
      </p>

      {accessResult.canUpgrade && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href='/pricing'>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              🚀 Upgrade Now
            </button>
          </Link>
          <Link href='/contact-sales'>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              💬 Contact Sales
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Hook for checking access in components
export const useSubscriptionAccess = () => {
  const { data: session } = useSession();

  const checkFeatureAccess = (feature: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!session?.user?.email) {
        resolve(false);
        return;
      }

      // Quick check for demo accounts
      if (session.user.email === 'admin@fleetflowapp.com') {
        resolve(true);
        return;
      }

      if (session.user.email === 'dispatch@fleetflowapp.com') {
        const dispatcherFeatures = ['load-tracking', 'driver-management'];
        resolve(dispatcherFeatures.includes(feature));
        return;
      }

      // For other users, default to basic trial access
      const trialFeatures = ['basic-tracking', 'basic-reports'];
      resolve(trialFeatures.includes(feature));
    });
  };

  return { checkFeatureAccess };
};

