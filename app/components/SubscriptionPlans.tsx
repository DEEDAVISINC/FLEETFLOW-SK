'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../config/subscription-plans';

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void;
  selectedPlan?: string;
  userTier?: string;
}

export default function SubscriptionPlans({
  onSelectPlan,
  selectedPlan,
  userTier,
}: SubscriptionPlansProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div className='subscription-plans-container'>
      <div className='plans-header'>
        <h2>Choose Your GO WITH THE FLOW Plan</h2>
        <p>
          Start free, scale with premium features. Carriers get FREE access
          forever.
        </p>
      </div>

      <div className='plans-grid'>
        {Object.entries(SUBSCRIPTION_PLANS).map(([planId, plan]) => (
          <div
            key={planId}
            className={`plan-card ${selectedPlan === planId ? 'selected' : ''} ${
              userTier === planId ? 'current' : ''
            } ${hoveredPlan === planId ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredPlan(planId)}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => onSelectPlan(planId)}
          >
            {/* Plan Header */}
            <div className='plan-header'>
              <div className='plan-icon'>{plan.icon}</div>
              <h3 className='plan-name'>{plan.name}</h3>
              <div className='plan-price'>
                <span className='currency'>$</span>
                <span className='amount'>{plan.price}</span>
                <span className='period'>/month</span>
              </div>
              <p className='plan-limits'>
                {plan.limits.loadsPerMonth === -1
                  ? 'Unlimited loads'
                  : `${plan.limits.loadsPerMonth} loads/month`}
              </p>
            </div>

            {/* Plan Features */}
            <div className='plan-features'>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index} className='feature-item'>
                    <span className='checkmark'>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Plan Actions */}
            <div className='plan-actions'>
              {userTier === planId ? (
                <button className='current-plan-btn' disabled>
                  Current Plan
                </button>
              ) : planId === 'free' ? (
                <button className='select-plan-btn primary'>
                  Start FREE Trial
                </button>
              ) : (
                <button className='select-plan-btn'>
                  {userTier === 'free' ? 'Upgrade Now' : 'Select Plan'}
                </button>
              )}
            </div>

            {/* Popular Badge */}
            {planId === 'professional' && (
              <div className='popular-badge'>Most Popular</div>
            )}

            {/* Current Plan Indicator */}
            {userTier === planId && (
              <div className='current-indicator'>✓ Active</div>
            )}
          </div>
        ))}
      </div>

      {/* Plan Comparison Table */}
      <div className='plan-comparison'>
        <h3>Compare All Features</h3>
        <div className='comparison-table'>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <th key={plan.id}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Loads per month</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id}>
                    {plan.limits.loadsPerMonth === -1
                      ? 'Unlimited'
                      : plan.limits.loadsPerMonth}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Load value cap</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id}>
                    {plan.limits.loadValueCap
                      ? `$${plan.limits.loadValueCap}`
                      : 'None'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Dispatch services</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id}>
                    {plan.limits.dispatchServices ? '✓ Included' : '✗'}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Support level</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id}>{plan.limits.supportLevel}</td>
                ))}
              </tr>
              <tr>
                <td>API access</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id}>{plan.limits.apiAccess ? '✓' : '✗'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Verification Notice */}
      <div className='verification-notice'>
        <div className='notice-icon'>🔒</div>
        <div className='notice-content'>
          <h4>Business Verification Required</h4>
          <p>
            All accounts require verified business credentials, insurance, and
            compliance documentation for marketplace access.
          </p>
          <a href='/verification' className='learn-more-link'>
            Learn about verification →
          </a>
        </div>
      </div>

      <style jsx>{`
        .subscription-plans-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .plans-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .plans-header h2 {
          font-size: 2.5rem;
          color: #1e293b;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .plans-header p {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
        }

        .plan-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .plan-card.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .plan-card.current {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.02);
        }

        .plan-card.hovered {
          transform: translateY(-2px);
        }

        .plan-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .plan-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .plan-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          margin-bottom: 8px;
        }

        .currency {
          font-size: 1.5rem;
          color: #64748b;
          margin-right: 4px;
        }

        .amount {
          font-size: 3rem;
          font-weight: 800;
          color: #1e293b;
        }

        .period {
          font-size: 1.2rem;
          color: #64748b;
          margin-left: 4px;
        }

        .plan-limits {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0;
        }

        .plan-features {
          margin-bottom: 32px;
        }

        .plan-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          font-size: 0.95rem;
          color: #374151;
        }

        .checkmark {
          color: #10b981;
          font-weight: bold;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .plan-actions {
          text-align: center;
        }

        .select-plan-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .select-plan-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .select-plan-btn.primary {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .select-plan-btn.primary:hover {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .current-plan-btn {
          background: #e5e7eb;
          color: #6b7280;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: not-allowed;
          width: 100%;
        }

        .popular-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .current-indicator {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .plan-comparison {
          background: rgba(15, 23, 42, 0.8);
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 40px;
        }

        .plan-comparison h3 {
          color: white;
          text-align: center;
          margin-bottom: 32px;
          font-size: 1.8rem;
        }

        .comparison-table {
          overflow-x: auto;
        }

        .comparison-table table {
          width: 100%;
          border-collapse: collapse;
          color: white;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 16px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .comparison-table th {
          background: rgba(59, 130, 246, 0.1);
          font-weight: 700;
          color: #3b82f6;
        }

        .verification-notice {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notice-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .notice-content h4 {
          color: #10b981;
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .notice-content p {
          color: white;
          margin: 0 0 12px 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .learn-more-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .learn-more-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: 1fr;
          }

          .plan-card {
            padding: 24px;
          }

          .plans-header h2 {
            font-size: 2rem;
          }

          .comparison-table {
            font-size: 0.8rem;
          }

          .verification-notice {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
