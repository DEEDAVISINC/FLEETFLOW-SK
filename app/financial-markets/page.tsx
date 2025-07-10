'use client';

import React from 'react';
import Link from 'next/link';
import FinancialDashboard from '../components/FinancialDashboard';

export default function FinancialMarketsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>💹</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  Financial Markets Center
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0'
                }}>
                  Real-time market intelligence for strategic decision making
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Live Market Data Active
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Auto-refresh: Every hour
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href="https://fred.stlouisfed.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                📊 FRED Data
              </a>
              <a 
                href="https://www.alphavantage.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                📈 Alpha Vantage
              </a>
            </div>
          </div>
        </div>

        {/* Financial Dashboard */}
        <FinancialDashboard />

        {/* Educational Resources */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            color: 'white', 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>📚</span>
            Financial Intelligence Resources
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0' }}>
                🛡️ Fuel Hedging Strategies
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                Learn how to protect your fleet from fuel price volatility using futures contracts, 
                fuel cards with price protection, and strategic purchasing timing.
              </p>
              <div style={{ marginTop: '12px' }}>
                <span style={{ 
                  background: '#10b981',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Risk Management
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0' }}>
                💱 Cross-Border Optimization
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                Maximize profitability on US-Canada routes by timing currency exchanges, 
                understanding rate fluctuations, and optimizing payment schedules.
              </p>
              <div style={{ marginTop: '12px' }}>
                <span style={{ 
                  background: '#3b82f6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  International Trade
                </span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0' }}>
                📊 Market Analysis Tools
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                Understand how to read market indicators, interpret price trends, 
                and make data-driven decisions about rate negotiations and contract timing.
              </p>
              <div style={{ marginTop: '12px' }}>
                <span style={{ 
                  background: '#8b5cf6',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Market Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          <Link href="/accounting" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                Accounting Integration
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                Apply market insights to financial planning
              </p>
            </div>
          </Link>

          <Link href="/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                Advanced Analytics
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                Deep dive into performance metrics
              </p>
            </div>
          </Link>

          <Link href="/routes" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                Route Optimization
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                Fuel-efficient route planning
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
