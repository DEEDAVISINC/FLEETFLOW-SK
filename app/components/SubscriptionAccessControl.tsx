/**
 * Subscription Access Control Component
 * Protects features based on user's subscription status and permissions
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';

interface SubscriptionAccessControlProps {
  children: ReactNode;
  requiredFeature?: string;
  requiredTier?: string;
  fallback?: ReactNode;
  userId?: string;
  showUpgradePrompt?: boolean;
}

interface AccessState {
  hasAccess: boolean;
  reason?: string;
  subscription?: any;
  isLoading: boolean;
}

export default function SubscriptionAccessControl({
  children,
  requiredFeature,
  requiredTier,
  fallback,
  userId,
  showUpgradePrompt = true,
}: SubscriptionAccessControlProps) {
  const [accessState, setAccessState] = useState<AccessState>({
    hasAccess: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAccess();
  }, [userId, requiredFeature, requiredTier]);

  const checkAccess = async () => {
    try {
      if (!userId) {
        setAccessState({
          hasAccess: false,
          reason: 'No user ID provided',
          isLoading: false,
        });
        return;
      }

      // Get user's subscription
      const subscription =
        SubscriptionManagementService.getUserSubscription(userId);
      const trialStatus = SubscriptionManagementService.getTrialStatus(userId);

      if (!subscription) {
        setAccessState({
          hasAccess: false,
          reason: 'No active subscription found',
          subscription: null,
          isLoading: false,
        });
        return;
      }

      // Check if subscription is active or in trial
      const isActive = subscription.status === 'active';
      const isInTrial = trialStatus.isInTrial;

      if (!isActive && !isInTrial) {
        setAccessState({
          hasAccess: false,
          reason: 'Subscription expired',
          subscription,
          isLoading: false,
        });
        return;
      }

      // Check feature access if required
      if (requiredFeature) {
        const hasFeature = SubscriptionManagementService.hasFeatureAccess(
          userId,
          requiredFeature
        );

        if (!hasFeature) {
          const tier = SubscriptionManagementService.getSubscriptionTier(
            subscription.subscriptionTierId
          );

          setAccessState({
            hasAccess: false,
            reason: `Feature requires ${requiredFeature.replace(/_/g, ' ').replace(/\./g, ' ')}`,
            subscription,
            isLoading: false,
          });
          return;
        }
      }

      // Check tier access if required
      if (requiredTier) {
        const currentTier = SubscriptionManagementService.getSubscriptionTier(
          subscription.subscriptionTierId
        );

        if (currentTier?.id !== requiredTier) {
          setAccessState({
            hasAccess: false,
            reason: `Requires ${requiredTier.replace(/-/g, ' ').toUpperCase()} tier`,
            subscription,
            isLoading: false,
          });
          return;
        }
      }

      // Access granted
      setAccessState({
        hasAccess: true,
        subscription,
        isLoading: false,
      });
    } catch (error) {
      console.error('Subscription access check failed:', error);
      setAccessState({
        hasAccess: false,
        reason: 'Access check failed',
        isLoading: false,
      });
    }
  };

  const renderUpgradePrompt = () => {
    if (!showUpgradePrompt) return null;

    const handleUpgrade = () => {
      window.location.href = '/plans';
    };

    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          color: '#92400e',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h3
          style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}
        >
          Upgrade Required
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
          {accessState.reason ||
            'This feature requires a higher subscription tier.'}
        </p>
        <button
          onClick={handleUpgrade}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 8px 25px rgba(245, 158, 11, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          View Plans & Upgrade
        </button>
      </div>
    );
  };

  const renderTrialPrompt = () => {
    if (
      !accessState.subscription ||
      accessState.subscription.status !== 'trial'
    ) {
      return null;
    }

    const trialStatus = SubscriptionManagementService.getTrialStatus(userId!);

    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '1px solid #3b82f6',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          color: '#1e40af',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
        <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
          Trial Active - {trialStatus.daysRemaining} days remaining
        </p>
      </div>
    );
  };

  if (accessState.isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
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

  if (accessState.hasAccess) {
    return (
      <div>
        {renderTrialPrompt()}
        {children}
      </div>
    );
  }

  // Show fallback or upgrade prompt
  return fallback || renderUpgradePrompt();
}

// Hook for programmatic access checking
export function useSubscriptionAccess(
  userId?: string,
  requiredFeature?: string,
  requiredTier?: string
) {
  const [accessState, setAccessState] = useState<AccessState>({
    hasAccess: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!userId) {
          setAccessState({
            hasAccess: false,
            reason: 'No user ID provided',
            isLoading: false,
          });
          return;
        }

        // Get user's subscription
        const subscription =
          SubscriptionManagementService.getUserSubscription(userId);
        const trialStatus =
          SubscriptionManagementService.getTrialStatus(userId);

        if (!subscription) {
          setAccessState({
            hasAccess: false,
            reason: 'No active subscription found',
            subscription: null,
            isLoading: false,
          });
          return;
        }

        // Check if subscription is active or in trial
        const isActive = subscription.status === 'active';
        const isInTrial = trialStatus.isInTrial;

        if (!isActive && !isInTrial) {
          setAccessState({
            hasAccess: false,
            reason: 'Subscription expired',
            subscription,
            isLoading: false,
          });
          return;
        }

        // Check feature access if required
        if (requiredFeature) {
          const hasFeature = SubscriptionManagementService.hasFeatureAccess(
            userId,
            requiredFeature
          );

          if (!hasFeature) {
            setAccessState({
              hasAccess: false,
              reason: `Feature requires ${requiredFeature.replace(/_/g, ' ').replace(/\./g, ' ')}`,
              subscription,
              isLoading: false,
            });
            return;
          }
        }

        // Check tier access if required
        if (requiredTier) {
          const currentTier = SubscriptionManagementService.getSubscriptionTier(
            subscription.subscriptionTierId
          );

          if (currentTier?.id !== requiredTier) {
            setAccessState({
              hasAccess: false,
              reason: `Requires ${requiredTier.replace(/-/g, ' ').toUpperCase()} tier`,
              subscription,
              isLoading: false,
            });
            return;
          }
        }

        // Access granted
        setAccessState({
          hasAccess: true,
          subscription,
          isLoading: false,
        });
      } catch (error) {
        console.error('Subscription access check failed:', error);
        setAccessState({
          hasAccess: false,
          reason: 'Access check failed',
          isLoading: false,
        });
      }
    };

    checkAccess();
  }, [userId, requiredFeature, requiredTier]);

  return accessState;
}
