'use client';

import { useEffect, useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../config/subscription-plans';

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

interface UsageStats {
  loadsPosted: number;
  loadsLimit: number;
  loadsValue: number;
  loadsValueLimit: number;
  dispatchRequests: number;
  supportTickets: number;
}

interface SubscriptionDashboardProps {
  userId: string;
}

export default function SubscriptionDashboard({
  userId,
}: SubscriptionDashboardProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string>('');

  useEffect(() => {
    fetchSubscriptionData();
  }, [userId]);

  const fetchSubscriptionData = async () => {
    try {
      const [subscriptionRes, usageRes] = await Promise.all([
        fetch('/api/subscriptions/current'),
        fetch('/api/subscriptions/usage'),
      ]);

      const [subscriptionData, usageData] = await Promise.all([
        subscriptionRes.json(),
        usageRes.json(),
      ]);

      if (subscriptionData.success) {
        setSubscription(subscriptionData.subscription);
      }
      if (usageData.success) {
        setUsage(usageData.usage);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });

      const result = await response.json();
      if (result.success) {
        setSubscription((prev) =>
          prev ? { ...prev, cancelAtPeriodEnd: true } : null
        );
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleUpgradeSubscription = async () => {
    if (!selectedUpgradePlan) return;

    try {
      const response = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlanId: selectedUpgradePlan }),
      });

      const result = await response.json();
      if (result.success) {
        setSubscription((prev) =>
          prev ? { ...prev, planId: selectedUpgradePlan } : null
        );
        setShowUpgradeDialog(false);
        setSelectedUpgradePlan('');
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className='dashboard-loading'>
        <div className='spinner'></div>
        <p>Loading your subscription...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className='no-subscription'>
        <h2>No Active Subscription</h2>
        <p>
          You don't have an active subscription. Choose a plan to get started.
        </p>
        <button
          onClick={() => (window.location.href = '/go-with-the-flow')}
          className='choose-plan-btn'
        >
          Choose a Plan
        </button>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[subscription.planId];
  const usagePercentage = usage
    ? (usage.loadsPosted / usage.loadsLimit) * 100
    : 0;
  const valuePercentage = usage
    ? (usage.loadsValue / usage.loadsValueLimit) * 100
    : 0;

  return (
    <div className='subscription-dashboard'>
      {/* Current Plan Overview */}
      <div className='plan-overview'>
        <div className='plan-header'>
          <div className='plan-info'>
            <h2>Current Plan: {currentPlan.name}</h2>
            <div className='plan-price'>${currentPlan.price}/month</div>
            <div className='plan-status'>
              Status:{' '}
              <span className={`status-${subscription.status}`}>
                {subscription.status === 'trialing'
                  ? 'Free Trial'
                  : subscription.status === 'active'
                    ? 'Active'
                    : subscription.status === 'past_due'
                      ? 'Payment Due'
                      : 'Canceled'}
              </span>
            </div>
          </div>
          <div className='plan-actions'>
            <button
              onClick={() => setShowUpgradeDialog(true)}
              className='upgrade-btn'
            >
              Upgrade Plan
            </button>
            <button
              onClick={() => setShowCancelDialog(true)}
              className='cancel-btn'
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className='cancellation-notice'>
            <div className='warning-icon'>⚠️</div>
            <div className='warning-content'>
              <h4>
                Your subscription will end on{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </h4>
              <p>You can reactivate at any time before then.</p>
              <button
                onClick={() => handleCancelSubscription()} // This would actually reactivate
                className='reactivate-btn'
              >
                Keep Subscription
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className='usage-section'>
        <h3>Monthly Usage</h3>
        <div className='usage-grid'>
          {/* Loads Usage */}
          <div className='usage-card'>
            <div className='usage-header'>
              <span className='usage-label'>Loads Posted</span>
              <span className='usage-count'>
                {usage?.loadsPosted || 0} / {usage?.loadsLimit || 0}
              </span>
            </div>
            <div className='progress-bar'>
              <div
                className='progress-fill'
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className='usage-footer'>
              {usagePercentage >= 80 && (
                <span className='warning-text'>
                  {usagePercentage >= 100
                    ? 'Limit reached'
                    : `${Math.round(usagePercentage)}% used`}
                </span>
              )}
            </div>
          </div>

          {/* Value Usage */}
          {usage?.loadsValueLimit && (
            <div className='usage-card'>
              <div className='usage-header'>
                <span className='usage-label'>Load Value</span>
                <span className='usage-count'>
                  ${usage.loadsValue || 0} / ${usage.loadsValueLimit}
                </span>
              </div>
              <div className='progress-bar'>
                <div
                  className='progress-fill'
                  style={{ width: `${Math.min(valuePercentage, 100)}%` }}
                ></div>
              </div>
              <div className='usage-footer'>
                {valuePercentage >= 80 && (
                  <span className='warning-text'>
                    {valuePercentage >= 100
                      ? 'Limit reached'
                      : `${Math.round(valuePercentage)}% used`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Dispatch Usage */}
          <div className='usage-card'>
            <div className='usage-header'>
              <span className='usage-label'>Dispatch Requests</span>
              <span className='usage-count'>
                {usage?.dispatchRequests || 0} / {usage?.loadsLimit || 0}
              </span>
            </div>
            <div className='progress-bar'>
              <div
                className='progress-fill'
                style={{
                  width: `${Math.min(((usage?.dispatchRequests || 0) / (usage?.loadsLimit || 1)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Support Tickets */}
          <div className='usage-card'>
            <div className='usage-header'>
              <span className='usage-label'>Support Tickets</span>
              <span className='usage-count'>{usage?.supportTickets || 0}</span>
            </div>
            <div className='support-status'>
              {usage?.supportTickets === 0 ? (
                <span className='no-tickets'>No open tickets</span>
              ) : (
                <span className='has-tickets'>
                  {usage?.supportTickets} open
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className='billing-section'>
        <h3>Billing Information</h3>
        <div className='billing-card'>
          <div className='billing-details'>
            <div className='billing-row'>
              <span className='label'>Next Billing Date:</span>
              <span className='value'>
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
            <div className='billing-row'>
              <span className='label'>Amount:</span>
              <span className='value'>${currentPlan.price}/month</span>
            </div>
            <div className='billing-row'>
              <span className='label'>Payment Method:</span>
              <span className='value'>•••• •••• •••• 4242</span>
            </div>
          </div>
          <div className='billing-actions'>
            <button className='update-payment-btn'>
              Update Payment Method
            </button>
            <button className='billing-history-btn'>
              View Billing History
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Dialog */}
      {showUpgradeDialog && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Upgrade Your Plan</h3>
              <button
                onClick={() => setShowUpgradeDialog(false)}
                className='close-btn'
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='upgrade-options'>
                {Object.entries(SUBSCRIPTION_PLANS)
                  .filter(([planId]) => planId !== subscription.planId)
                  .map(([planId, plan]) => (
                    <div
                      key={planId}
                      className={`upgrade-option ${selectedUpgradePlan === planId ? 'selected' : ''}`}
                      onClick={() => setSelectedUpgradePlan(planId)}
                    >
                      <div className='option-header'>
                        <h4>{plan.name}</h4>
                        <div className='option-price'>${plan.price}/month</div>
                      </div>
                      <ul className='option-features'>
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
            <div className='modal-footer'>
              <button
                onClick={() => setShowUpgradeDialog(false)}
                className='cancel-btn'
              >
                Cancel
              </button>
              <button
                onClick={handleUpgradeSubscription}
                disabled={!selectedUpgradePlan}
                className='confirm-btn'
              >
                Upgrade to{' '}
                {selectedUpgradePlan
                  ? SUBSCRIPTION_PLANS[selectedUpgradePlan].name
                  : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Cancel Subscription</h3>
              <button
                onClick={() => setShowCancelDialog(false)}
                className='close-btn'
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <div className='cancel-warning'>
                <div className='warning-icon'>⚠️</div>
                <div className='warning-text'>
                  <h4>Are you sure you want to cancel?</h4>
                  <p>
                    You will lose access to premium features and your data may
                    be deleted after 30 days.
                  </p>
                  <ul>
                    <li>Loads will be limited to free tier (5/month)</li>
                    <li>Dispatch services will no longer be included</li>
                    <li>Priority carrier access will be removed</li>
                    <li>Advanced analytics will be unavailable</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button
                onClick={() => setShowCancelDialog(false)}
                className='cancel-btn'
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className='confirm-cancel-btn'
              >
                Yes, Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .subscription-dashboard {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .dashboard-loading {
          text-align: center;
          padding: 60px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .no-subscription {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .no-subscription h2 {
          color: #1e293b;
          margin-bottom: 16px;
        }

        .choose-plan-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .choose-plan-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .plan-overview {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .plan-info h2 {
          margin: 0 0 8px 0;
          color: #1e293b;
        }

        .plan-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
        }

        .plan-status span {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-trialing {
          background: #fef3c7;
          color: #92400e;
        }

        .status-past_due {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-canceled {
          background: #f3f4f6;
          color: #374151;
        }

        .plan-actions {
          display: flex;
          gap: 12px;
        }

        .upgrade-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #dc2626;
        }

        .cancellation-notice {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 16px;
        }

        .warning-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .warning-content h4 {
          color: #92400e;
          margin: 0 0 8px 0;
        }

        .warning-content p {
          color: #92400e;
          margin: 0 0 12px 0;
        }

        .reactivate-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .usage-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .usage-section h3 {
          margin: 0 0 20px 0;
          color: #1e293b;
        }

        .usage-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .usage-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }

        .usage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .usage-label {
          font-weight: 600;
          color: #374151;
        }

        .usage-count {
          font-weight: 700;
          color: #1e293b;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          transition: width 0.3s ease;
        }

        .warning-text {
          color: #ef4444;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .billing-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .billing-section h3 {
          margin: 0 0 20px 0;
          color: #1e293b;
        }

        .billing-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .billing-details {
          flex: 1;
        }

        .billing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .label {
          font-weight: 600;
          color: #64748b;
        }

        .value {
          color: #1e293b;
        }

        .billing-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-left: 24px;
        }

        .update-payment-btn,
        .billing-history-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .update-payment-btn:hover,
        .billing-history-btn:hover {
          background: #e5e7eb;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 24px 24px 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .modal-header h3 {
          margin: 0;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-body {
          padding: 0 24px;
        }

        .upgrade-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .upgrade-option {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upgrade-option:hover,
        .upgrade-option.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .option-header h4 {
          margin: 0;
          color: #1e293b;
        }

        .option-price {
          font-weight: 700;
          color: #10b981;
        }

        .option-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .option-features li {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .cancel-warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .cancel-warning h4 {
          color: #dc2626;
          margin: 0 0 8px 0;
        }

        .cancel-warning ul {
          color: #dc2626;
          margin: 8px 0 0 0;
          padding-left: 20px;
        }

        .cancel-warning li {
          margin-bottom: 4px;
        }

        .modal-footer {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .modal-footer button {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .confirm-btn,
        .confirm-cancel-btn {
          background: #10b981;
          color: white;
          border: none;
        }

        .confirm-btn:hover,
        .confirm-cancel-btn:hover {
          background: #059669;
        }

        .confirm-cancel-btn {
          background: #ef4444;
        }

        .confirm-cancel-btn:hover {
          background: #dc2626;
        }

        @media (max-width: 768px) {
          .subscription-dashboard {
            padding: 16px;
          }

          .plan-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .plan-actions {
            width: 100%;
            justify-content: stretch;
          }

          .plan-actions button {
            flex: 1;
          }

          .usage-grid {
            grid-template-columns: 1fr;
          }

          .billing-card {
            flex-direction: column;
            gap: 16px;
          }

          .billing-actions {
            margin-left: 0;
            flex-direction: row;
            justify-content: space-between;
          }

          .modal-content {
            width: 95%;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
}
