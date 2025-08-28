/**
 * Phone System Add-On Manager
 * Allows users to view and manage their phone system subscriptions
 */

'use client';

import { useEffect, useState } from 'react';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';
import { getCurrentUser } from '../config/access';

interface PhoneUsage {
  minutesUsed: number;
  smsUsed: number;
  minutesLimit: number;
  smsLimit: number;
  overageCharges: number;
  remainingMinutes: number;
  remainingSMS: number;
}

interface PhoneAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
}

export default function PhoneSystemAddOnManager() {
  const [phoneUsage, setPhoneUsage] = useState<PhoneUsage | null>(null);
  const [phoneAddons, setPhoneAddons] = useState<PhoneAddon[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [selectedAddon, setSelectedAddon] = useState<string>('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = getCurrentUser();

  useEffect(() => {
    loadPhoneData();
  }, []);

  const loadPhoneData = () => {
    try {
      // Get current subscription
      const subscription = SubscriptionManagementService.getUserSubscription(user.id);
      setCurrentSubscription(subscription);

      // Get phone usage
      const usage = SubscriptionManagementService.getPhoneUsage(user.id);
      setPhoneUsage(usage);

      // Get available phone add-ons
      const addons = SubscriptionManagementService.getAlacarteModules()
        .filter(m => m.id.startsWith('phone-'))
        .map(addon => ({
          ...addon,
          isActive: subscription ? 
            SubscriptionManagementService.hasFeatureAccess(user.id, `phone.${addon.id}`) : false
        }));
      setPhoneAddons(addons);

    } catch (error) {
      console.error('Error loading phone data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoneSystem = async (addonId: string) => {
    try {
      setIsLoading(true);
      
      // In production, this would integrate with Stripe/billing
      console.log(`Adding phone system: ${addonId}`);
      
      // Simulate adding the add-on
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reload data
      loadPhoneData();
      
      alert('✅ Phone system add-on activated! Your new features are now available.');
    } catch (error) {
      console.error('Error adding phone system:', error);
      alert('❌ Failed to activate phone system. Please try again.');
    } finally {
      setIsLoading(false);
      setShowUpgrade(false);
    }
  };

  const formatUsage = (used: number, limit: number): string => {
    if (limit === -1) return `${used} (Unlimited)`;
    return `${used}/${limit}`;
  };

  const getUsageColor = (used: number, limit: number): string => {
    if (limit === -1) return '#10b981'; // Green for unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return '#ef4444'; // Red for high usage
    if (percentage >= 75) return '#f59e0b'; // Amber for medium usage
    return '#10b981'; // Green for low usage
  };

  const getCurrentPhonePlan = (): string => {
    if (!currentSubscription) return 'No phone plan';
    
    const tier = SubscriptionManagementService.getSubscriptionTier(currentSubscription.subscriptionTierId);
    if (!tier) return 'Unknown plan';

    // Check what's included
    if (tier.features.some(f => f.includes('Unlimited phone'))) return 'Enterprise Phone (Unlimited)';
    if (tier.features.some(f => f.includes('500 phone minutes'))) return 'Professional Phone (500 min)';
    if (tier.features.some(f => f.includes('100 phone minutes'))) return 'Basic Phone (100 min)';
    
    return 'Phone add-on required';
  };

  if (isLoading) {
    return (
      <div style={{
        padding: '32px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '16px' }}>📞</div>
        <div>Loading phone system data...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderRadius: '16px',
      color: 'white',
      maxWidth: '800px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #60a5fa, #34d399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📞 FleetFlow Phone System
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '16px'
        }}>
          Professional business phone system with CRM integration
        </p>
      </div>

      {/* Current Plan Status */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#60a5fa'
        }}>
          📋 Current Plan Status
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
              Current Plan
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#60a5fa' }}>
              {getCurrentPhonePlan()}
            </div>
          </div>

          {phoneUsage && (
            <>
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                  Phone Minutes
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: getUsageColor(phoneUsage.minutesUsed, phoneUsage.minutesLimit)
                }}>
                  {formatUsage(phoneUsage.minutesUsed, phoneUsage.minutesLimit)}
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                  SMS Messages
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: getUsageColor(phoneUsage.smsUsed, phoneUsage.smsLimit)
                }}>
                  {formatUsage(phoneUsage.smsUsed, phoneUsage.smsLimit)}
                </div>
              </div>

              {phoneUsage.overageCharges > 0 && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                    Overage Charges
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#fca5a5' }}>
                    ${phoneUsage.overageCharges.toFixed(2)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Available Add-Ons */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#34d399'
          }}>
            💼 Available Phone Add-Ons
          </h3>
          <button
            onClick={() => setShowUpgrade(!showUpgrade)}
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#34d399',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {showUpgrade ? 'Hide Options' : 'View Options'}
          </button>
        </div>

        {showUpgrade && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {phoneAddons.map(addon => (
              <div key={addon.id} style={{
                background: addon.isActive 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${addon.isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '20px',
                position: 'relative'
              }}>
                {addon.isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#22c55e',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    ✅ ACTIVE
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: addon.isActive ? '#22c55e' : 'white',
                    marginBottom: '4px'
                  }}>
                    {addon.name}
                  </h4>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#60a5fa',
                    marginBottom: '8px'
                  }}>
                    {addon.id === 'phone-usage' ? '$0.02/min' : `$${addon.price}/month`}
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '16px'
                  }}>
                    {addon.description}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px'
                  }}>
                    Features:
                  </div>
                  <ul style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    paddingLeft: '16px',
                    margin: 0
                  }}>
                    {addon.features.map((feature, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {!addon.isActive && (
                  <button
                    onClick={() => {
                      setSelectedAddon(addon.id);
                      handleAddPhoneSystem(addon.id);
                    }}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  >
                    {isLoading && selectedAddon === addon.id 
                      ? '⏳ Activating...' 
                      : `Add ${addon.name}`}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage Guidelines */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#fbbf24',
          marginBottom: '8px'
        }}>
          💡 Phone System Information
        </h4>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.5'
        }}>
          <p style={{ marginBottom: '8px' }}>
            • <strong>Overage Charges:</strong> $0.02/minute for calls, $0.05/SMS when limits exceeded
          </p>
          <p style={{ marginBottom: '8px' }}>
            • <strong>CRM Integration:</strong> All calls automatically logged and synced with customer records
          </p>
          <p style={{ marginBottom: '8px' }}>
            • <strong>Multi-Tenant:</strong> Each company gets their own phone number and caller ID
          </p>
          <p style={{ margin: 0 }}>
            • <strong>Professional Features:</strong> Call recording, transcription, and real-time monitoring included
          </p>
        </div>
      </div>
    </div>
  );
}














