'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ShipperPortfolioPage() {
  const [activeView, setActiveView] = useState<
    'portfolio' | 'database' | 'analytics'
  >('portfolio');

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        padding: '80px 20px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '3rem',
              marginBottom: '20px',
              color: '#1f2937',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📈 Shipper Portfolio Analytics
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Comprehensive shipper relationship management, portfolio tracking,
            and business analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
            borderBottom: '2px solid #e5e7eb',
            gap: '40px',
          }}
        >
          <button
            onClick={() => setActiveView('portfolio')}
            style={{
              background: 'none',
              border: 'none',
              padding: '15px 20px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: activeView === 'portfolio' ? '#667eea' : '#6b7280',
              borderBottom:
                activeView === 'portfolio'
                  ? '3px solid #667eea'
                  : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            🏢 Shipper Portfolio
          </button>
          <button
            onClick={() => setActiveView('database')}
            style={{
              background: 'none',
              border: 'none',
              padding: '15px 20px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: activeView === 'database' ? '#667eea' : '#6b7280',
              borderBottom:
                activeView === 'database'
                  ? '3px solid #667eea'
                  : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            📋 Shipper Database
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            style={{
              background: 'none',
              border: 'none',
              padding: '15px 20px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: activeView === 'analytics' ? '#667eea' : '#6b7280',
              borderBottom:
                activeView === 'analytics'
                  ? '3px solid #667eea'
                  : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            📊 Shipper Analytics
          </button>
        </div>

        {/* Content Area */}
        <div style={{ minHeight: '500px' }}>
          {/* Portfolio View */}
          {activeView === 'portfolio' && (
            <div>
              <h2
                style={{
                  fontSize: '2rem',
                  marginBottom: '30px',
                  color: '#374151',
                }}
              >
                🏢 Active Shipper Portfolio
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '25px',
                  marginBottom: '40px',
                }}
              >
                {/* Portfolio Stats */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                    📊 Portfolio Overview
                  </h3>
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    --
                  </div>
                  <p>Active Shippers</p>
                  <div
                    style={{
                      marginTop: '15px',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                    }}
                  >
                    Data loading...
                  </div>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                    💰 Revenue Generated
                  </h3>
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    $--
                  </div>
                  <p>This Quarter</p>
                  <div
                    style={{
                      marginTop: '15px',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                    }}
                  >
                    Data loading...
                  </div>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                    🚛 Active Loads
                  </h3>
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    --
                  </div>
                  <p>In Transit</p>
                  <div
                    style={{
                      marginTop: '15px',
                      fontSize: '0.9rem',
                      opacity: 0.9,
                    }}
                  >
                    Data loading...
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                <Link
                  href='/shippers/database'
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'white',
                      padding: '25px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(102, 126, 234, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <h3
                      style={{
                        color: '#667eea',
                        marginBottom: '15px',
                        fontSize: '1.3rem',
                      }}
                    >
                      📋 Shipper Database
                    </h3>
                    <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                      Access comprehensive shipper database with contact
                      information, service history, and performance metrics.
                    </p>
                    <div
                      style={{
                        color: '#667eea',
                        fontWeight: '600',
                        marginTop: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      View Database →
                    </div>
                  </div>
                </Link>

                <div
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(16, 185, 129, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      marginBottom: '15px',
                      fontSize: '1.3rem',
                    }}
                  >
                    ➕ Add New Shipper
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    Onboard new shippers with automated verification,
                    documentation, and profile setup.
                  </p>
                  <div
                    style={{
                      color: '#10b981',
                      fontWeight: '600',
                      marginTop: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Add Shipper →
                  </div>
                </div>

                <div
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(245, 158, 11, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <h3
                    style={{
                      color: '#f59e0b',
                      marginBottom: '15px',
                      fontSize: '1.3rem',
                    }}
                  >
                    📊 Performance Reports
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    Generate detailed performance reports and analytics for
                    shipper relationships and profitability.
                  </p>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontWeight: '600',
                      marginTop: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    View Reports →
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database View */}
          {activeView === 'database' && (
            <div>
              <h2
                style={{
                  fontSize: '2rem',
                  marginBottom: '30px',
                  color: '#374151',
                }}
              >
                📋 Shipper Database
              </h2>
              <div
                style={{
                  background: 'white',
                  padding: '40px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '15px',
                    color: '#374151',
                  }}
                >
                  Comprehensive Shipper Database
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: '30px',
                    maxWidth: '600px',
                    margin: '0 auto 30px',
                  }}
                >
                  Access detailed shipper information, contact details, service
                  history, performance metrics, and relationship management
                  tools.
                </p>
                <Link
                  href='/shippers/database'
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Access Database →
                </Link>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div>
              <h2
                style={{
                  fontSize: '2rem',
                  marginBottom: '30px',
                  color: '#374151',
                }}
              >
                📊 Shipper Analytics
              </h2>
              <div
                style={{
                  background: 'white',
                  padding: '40px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '15px',
                    color: '#374151',
                  }}
                >
                  Advanced Shipper Analytics
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: '30px',
                    maxWidth: '600px',
                    margin: '0 auto 30px',
                  }}
                >
                  Deep insights into shipper performance, profitability
                  analysis, relationship trends, and business intelligence
                  dashboards.
                </p>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  View Analytics →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
