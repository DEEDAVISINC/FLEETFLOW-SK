'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  ShipperAccount,
  shipperAccountService,
} from '../services/shipper-account-service';

function ShipperPortalContent() {
  const searchParams = useSearchParams();
  const [account, setAccount] = useState<ShipperAccount | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchParams) {
      setError(
        'Unable to access page parameters. Please refresh and try again.'
      );
      setLoading(false);
      return;
    }

    const accountId = searchParams.get('account');
    const token = searchParams.get('token');

    if (accountId && token) {
      // Validate token and load account
      try {
        const foundAccount = shipperAccountService.findAccountById(accountId);
        if (foundAccount) {
          setAccount(foundAccount);
        } else {
          setError('Account not found. Please check your access link.');
        }
      } catch (err) {
        setError('Invalid access credentials. Please contact support.');
      }
    } else {
      setError(
        'Missing access credentials. Please use the link from your email.'
      );
    }

    setLoading(false);
  }, [searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚚</div>
          <h2>Loading your FleetFlow portal...</h2>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            maxWidth: '500px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Access Error</h2>
          <p
            style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}
          >
            {error}
          </p>
          <button
            onClick={() => (window.location.href = '/go-with-the-flow')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🚚 Request New Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              🚚 FleetFlow Shipper Portal
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0',
                fontSize: '16px',
              }}
            >
              Welcome back, {account.contactName} • {account.companyName}
            </p>
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '8px',
                padding: '8px 12px',
                marginTop: '12px',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12px',
                  marginRight: '8px',
                }}
              >
                Go with the Flow ID:
              </span>
              <span
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                }}
              >
                {account.goWithFlowId}
              </span>
            </div>
          </div>
          <div
            style={{
              background:
                account.status === 'active'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            {account.status}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'shipments', label: '📦 Shipments', icon: '📦' },
          { id: 'quotes', label: '💰 Quotes', icon: '💰' },
          { id: 'account', label: '⚙️ Account', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'transparent',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
              <div
                style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}
              >
                {account.totalShipments}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Total Shipments
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <div
                style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}
              >
                {formatCurrency(account.totalSpent)}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Total Spent
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
              <div
                style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}
              >
                {formatDate(account.createdDate)}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Member Since
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Quick Actions
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <button
                onClick={() => window.open('/go-with-the-flow', '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🚚 Request New Quote
              </button>
              <button
                onClick={() => setActiveTab('shipments')}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                📦 Track Shipments
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                💰 View Quotes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipments Tab */}
      {activeTab === 'shipments' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            📦 Your Shipments
          </h3>

          {account.shipmentHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}
              >
                No shipments yet. Request your first quote to get started!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {account.shipmentHistory.map((shipment) => (
                <div
                  key={shipment.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: '0',
                      }}
                    >
                      {shipment.origin} → {shipment.destination}
                    </h4>
                    <div
                      style={{
                        background:
                          shipment.status === 'delivered'
                            ? '#10b981'
                            : shipment.status === 'in_transit'
                              ? '#f59e0b'
                              : shipment.status === 'booked'
                                ? '#3b82f6'
                                : '#6b7280',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {shipment.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Equipment:
                      </span>
                      <div style={{ color: 'white', fontWeight: '500' }}>
                        {shipment.equipmentType}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Weight:
                      </span>
                      <div style={{ color: 'white', fontWeight: '500' }}>
                        {shipment.weight.toLocaleString()} lbs
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Pickup:
                      </span>
                      <div style={{ color: 'white', fontWeight: '500' }}>
                        {formatDate(shipment.pickupDate)}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Quotes:
                      </span>
                      <div style={{ color: 'white', fontWeight: '500' }}>
                        {shipment.quotes.length} received
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            💰 Your Quotes
          </h3>

          {account.shipmentHistory.flatMap((s) => s.quotes).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}
              >
                No quotes yet. Submit a freight request to receive competitive
                quotes!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {account.shipmentHistory.map((shipment) =>
                shipment.quotes.map((quote) => (
                  <div
                    key={quote.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          margin: '0',
                        }}
                      >
                        {quote.carrierName}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background:
                              quote.confidence >= 90
                                ? '#10b981'
                                : quote.confidence >= 80
                                  ? '#f59e0b'
                                  : '#6b7280',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {quote.confidence}% confidence
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '600',
                          }}
                        >
                          {formatCurrency(quote.rate)}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                          }}
                        >
                          Route:
                        </span>
                        <div style={{ color: 'white', fontWeight: '500' }}>
                          {shipment.origin} → {shipment.destination}
                        </div>
                      </div>
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                          }}
                        >
                          ETA:
                        </span>
                        <div style={{ color: 'white', fontWeight: '500' }}>
                          {quote.eta}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {quote.features.map((feature, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: 'rgba(255, 255, 255, 0.9)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            ⚙️ Account Settings
          </h3>

          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Account Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                Account Information
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Company Name:
                  </span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {account.companyName}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Contact Name:
                  </span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {account.contactName}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Email:
                  </span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {account.email}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Phone:
                  </span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {account.phone || 'Not provided'}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Account Type:
                  </span>
                  <span
                    style={{
                      color: 'white',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                    }}
                  >
                    {account.accountType}
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                Preferences
              </h4>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Preferred Equipment:
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '8px',
                    }}
                  >
                    {account.preferences.preferredEquipment.map(
                      (equipment, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          {equipment}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Default Pickup Regions:
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '8px',
                    }}
                  >
                    {account.preferences.defaultPickupRegions.map(
                      (region, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          {region}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
        }}
      >
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
          Need help? Contact FleetFlow Support at{' '}
          <a
            href='mailto:support@fleetflowapp.com'
            style={{ color: '#3b82f6', textDecoration: 'none' }}
          >
            support@fleetflowapp.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ShipperPortal() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      }
    >
      <ShipperPortalContent />
    </Suspense>
  );
}
