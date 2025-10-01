'use client';

import { useState } from 'react';
import {
  FlowForwardTier,
  FlowForwardUserManagementService,
} from '../services/FlowForwardUserManagementService';

export default function FlowForwardPricingPage() {
  const [selectedTier, setSelectedTier] = useState<FlowForwardTier | null>(
    null
  );
  const [userCount, setUserCount] = useState(1);

  const tiers = FlowForwardUserManagementService.getAllPricingTiers();

  const handleTierSelect = (tier: FlowForwardTier) => {
    setSelectedTier(tier);
    // Reset user count based on tier
    if (tier === 'SOLO') setUserCount(1);
    else if (tier === 'PROFESSIONAL') setUserCount(2);
    else if (tier === 'ELITE') setUserCount(6);
    else setUserCount(11);
  };

  const calculatePricing = (tier: FlowForwardTier, users: number) => {
    return FlowForwardUserManagementService.calculateMonthlyCost(tier, users);
  };

  const selectedTierInfo = selectedTier
    ? FlowForwardUserManagementService.getPricingTier(selectedTier)
    : null;
  const pricing = selectedTier
    ? calculatePricing(selectedTier, userCount)
    : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '40px 20px',
        color: 'white',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Flow Forward Pricing
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Enterprise freight forwarding software designed for growing businesses
        </p>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '10px',
          }}
        >
          All prices in USD, billed monthly • No setup fees • Cancel anytime
        </div>
      </div>

      {/* Pricing Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto 60px',
        }}
      >
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isPopular = tier.id === 'PROFESSIONAL';

          return (
            <div
              key={tier.id}
              onClick={() => handleTierSelect(tier.id)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))'
                  : 'rgba(15, 23, 42, 0.8)',
                border: isSelected
                  ? '2px solid #06b6d4'
                  : isPopular
                    ? '2px solid #f59e0b'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '40px 30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: isSelected
                  ? '0 20px 40px rgba(6, 182, 212, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow =
                    '0 20px 40px rgba(0, 0, 0, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(0, 0, 0, 0.4)';
                }
              }}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Tier Header */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: 'white',
                  }}
                >
                  {tier.name}
                </h3>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    color: '#06b6d4',
                    marginBottom: '8px',
                  }}
                >
                  ${tier.price}
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    /month
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '20px',
                  }}
                >
                  {tier.id === 'SOLO'
                    ? '1 user included'
                    : tier.id === 'PROFESSIONAL'
                      ? '2-5 users included'
                      : tier.id === 'ELITE'
                        ? '6-10 users included'
                        : '11-25 users included'}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '30px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          marginRight: '12px',
                          fontSize: '16px',
                        }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Users */}
              {tier.id !== 'SOLO' && (
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '4px',
                    }}
                  >
                    Additional users: ${tier.additionalUserPrice}/month each
                  </div>
                </div>
              )}

              {/* Select Button */}
              <button
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isSelected
                    ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* User Count Calculator */}
      {selectedTier && selectedTierInfo && (
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto 60px',
            padding: '40px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '20px',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '30px',
              color: 'white',
            }}
          >
            Configure Your Team
          </h3>

          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'white',
              }}
            >
              Number of Users: {userCount}
            </label>
            <input
              type='range'
              min={
                selectedTier === 'SOLO'
                  ? 1
                  : selectedTier === 'PROFESSIONAL'
                    ? 2
                    : selectedTier === 'ELITE'
                      ? 6
                      : 11
              }
              max={selectedTierInfo.maxUsers}
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '8px',
              }}
            >
              <span>
                Min:{' '}
                {selectedTier === 'SOLO'
                  ? 1
                  : selectedTier === 'PROFESSIONAL'
                    ? 2
                    : selectedTier === 'ELITE'
                      ? 6
                      : 11}
              </span>
              <span>Max: {selectedTierInfo.maxUsers}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          {pricing && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '30px',
              }}
            >
              <h4
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: 'white',
                }}
              >
                Monthly Cost Breakdown
              </h4>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Base Plan ({selectedTierInfo.name})
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    ${pricing.basePrice}
                  </span>
                </div>

                {pricing.additionalUsers > 0 && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Additional Users ({pricing.additionalUsers} × $
                      {selectedTierInfo.additionalUserPrice})
                    </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      ${pricing.additionalUserCost}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                  }}
                >
                  <span style={{ color: 'white', fontWeight: '700' }}>
                    Total Monthly
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontWeight: '800',
                      fontSize: '20px',
                    }}
                  >
                    ${pricing.totalCost}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 24px rgba(6, 182, 212, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 16px rgba(6, 182, 212, 0.3)';
            }}
          >
            Start Free Trial - 14 Days
          </button>

          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '16px',
            }}
          >
            No credit card required • Full access during trial • Cancel anytime
          </p>
        </div>
      )}

      {/* Features Comparison */}
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '40px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3
          style={{
            fontSize: '28px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '40px',
            color: 'white',
          }}
        >
          Why Choose Flow Forward?
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#06b6d4',
              }}
            >
              🚢
            </div>
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: 'white',
              }}
            >
              Complete Freight Forwarding
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6',
              }}
            >
              Ocean, air, and ground freight management with real-time tracking
              and automated documentation.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#10b981',
              }}
            >
              🤖
            </div>
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: 'white',
              }}
            >
              AI-Powered Intelligence
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6',
              }}
            >
              Smart recommendations for route optimization, container
              consolidation, and revenue maximization.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#8b5cf6',
              }}
            >
              🛃
            </div>
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: 'white',
              }}
            >
              Global Compliance
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6',
              }}
            >
              Automated customs documentation, denied party screening, and
              international trade compliance.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#f59e0b',
              }}
            >
              📊
            </div>
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: 'white',
              }}
            >
              Advanced Analytics
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6',
              }}
            >
              Comprehensive business intelligence with performance metrics,
              profitability analysis, and forecasting.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '20px',
          }}
        >
          Questions? Contact our sales team
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href='mailto:sales@fleetflowapp.com'
            style={{
              color: '#06b6d4',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            📧 sales@fleetflowapp.com
          </a>
          <a
            href='tel:+18333863509'
            style={{
              color: '#06b6d4',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            📞 (833) 386-3509
          </a>
          <a
            href='https://fleetflowapp.com'
            style={{
              color: '#06b6d4',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            🌐 fleetflowapp.com
          </a>
        </div>
        <p
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '20px',
          }}
        >
          © 2025 FleetFlow TMS LLC. All rights reserved. | WOSB Certified
        </p>
      </div>
    </div>
  );
}
