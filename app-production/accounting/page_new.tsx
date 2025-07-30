'use client';

import React, { useState, useEffect } from 'react';
import { checkPermission, ACCESS_MESSAGES } from '../config/access';

// Access Control Component
const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '40px 32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
      <h1 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '16px' 
      }}>Access Restricted</h1>
      <p style={{ 
        color: 'rgba(255, 255, 255, 0.9)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need appropriate permissions to access the accounting section.
      </p>
      <p style={{ 
        fontSize: '0.9rem', 
        color: 'rgba(255, 255, 255, 0.7)', 
        marginBottom: '24px' 
      }}>
        Contact your administrator for access to financial data.
      </p>
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
      >
        Go Back
      </button>
    </div>
  </div>
);

// Data Interfaces
interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  outstandingReceivables: number;
  cashFlow: number;
  avgPaymentDays: number;
  collectionRate: number;
}

interface Settlement {
  id: string;
  type: 'driver' | 'carrier' | 'broker';
  entityName: string;
  amount: number;
  period: string;
  status: 'pending' | 'approved' | 'paid';
  dueDate: string;
}

// Financial Metrics Card Component
const MetricCard = ({ title, value, emoji, color }: { title: string; value: string; emoji: string; color: string }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => {
    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
  }}
  onMouseOut={(e) => {
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
  }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.8)', 
          marginBottom: '8px',
          fontWeight: '500'
        }}>{title}</p>
        <p style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          color: 'white',
          margin: 0
        }}>{value}</p>
      </div>
      <div style={{
        fontSize: '2.5rem',
        opacity: 0.8
      }}>{emoji}</div>
    </div>
  </div>
);

// Settlement Table Component
const SettlementsTable = ({ settlements }: { settlements: Settlement[] }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflowX: 'auto'
  }}>
    <h3 style={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '20px'
    }}>Recent Settlements</h3>
    
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Type</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Entity</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Period</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Amount</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {settlements.slice(0, 5).map((settlement, index) => (
            <tr key={settlement.id} style={{
              borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.05)'}
            onMouseOut={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '12px' }}>
                <span style={{
                  background: settlement.type === 'broker' ? '#dbeafe' :
                             settlement.type === 'driver' ? '#dcfce7' : '#fef3c7',
                  color: settlement.type === 'broker' ? '#1e40af' :
                         settlement.type === 'driver' ? '#166534' : '#92400e',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>{settlement.type}</span>
              </td>
              <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>{settlement.entityName}</td>
              <td style={{ padding: '12px', color: '#6b7280' }}>{settlement.period}</td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#059669' }}>${settlement.amount.toLocaleString()}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  background: settlement.status === 'paid' ? '#dcfce7' :
                             settlement.status === 'approved' ? '#dbeafe' : '#fef3c7',
                  color: settlement.status === 'paid' ? '#166534' :
                         settlement.status === 'approved' ? '#1e40af' : '#92400e',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>{settlement.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function AccountingPage() {
  const [selectedRole, setSelectedRole] = useState<'broker' | 'dispatcher' | 'driver' | 'carrier'>('dispatcher');

  // Check access permission
  if (!checkPermission('hasFinancialsAccess')) {
    return <AccessRestricted />;
  }

  // Mock data
  const mockMetrics: FinancialMetrics = {
    totalRevenue: 125800,
    totalExpenses: 89650,
    netProfit: 36150,
    profitMargin: 28.7,
    outstandingReceivables: 27350,
    cashFlow: 18500,
    avgPaymentDays: 18.5,
    collectionRate: 94.2
  };

  const mockSettlements: Settlement[] = [
    { id: '1', type: 'broker', entityName: 'John Smith', amount: 3200, period: 'Dec 2024', status: 'pending', dueDate: '2024-12-31' },
    { id: '2', type: 'driver', entityName: 'Mike Johnson', amount: 2800, period: 'Dec 2024', status: 'approved', dueDate: '2024-12-30' },
    { id: '3', type: 'carrier', entityName: 'ABC Transport', amount: 15000, period: 'Dec 2024', status: 'paid', dueDate: '2024-12-28' },
    { id: '4', type: 'broker', entityName: 'Sarah Wilson', amount: 2900, period: 'Dec 2024', status: 'paid', dueDate: '2024-12-25' },
    { id: '5', type: 'driver', entityName: 'Tom Davis', amount: 3100, period: 'Dec 2024', status: 'pending', dueDate: '2025-01-02' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '40px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>💰 FleetFlow Accounting</h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Comprehensive financial management and settlement tracking
          </p>
          
          {/* Role Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {(['broker', 'dispatcher', 'driver', 'carrier'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  background: selectedRole === role 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: selectedRole === role ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => {
                  if (selectedRole !== role) {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.3)';
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedRole !== role) {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                  }
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <MetricCard 
            title="Total Revenue" 
            value={`$${mockMetrics.totalRevenue.toLocaleString()}`} 
            emoji="💰" 
            color="#059669"
          />
          <MetricCard 
            title="Net Profit" 
            value={`$${mockMetrics.netProfit.toLocaleString()}`} 
            emoji="📈" 
            color="#3b82f6"
          />
          <MetricCard 
            title="Cash Flow" 
            value={`$${mockMetrics.cashFlow.toLocaleString()}`} 
            emoji="💵" 
            color="#8b5cf6"
          />
          <MetricCard 
            title="Collection Rate" 
            value={`${mockMetrics.collectionRate}%`} 
            emoji="📊" 
            color="#f59e0b"
          />
        </div>

        {/* Settlements Table */}
        <SettlementsTable settlements={mockSettlements} />

        {/* Quick Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center'
          }}>Quick Actions</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { label: '📊 Generate Financial Report', color: '#3b82f6' },
              { label: '💳 Process Settlements', color: '#059669' },
              { label: '📋 Export Data', color: '#8b5cf6' },
              { label: '⚙️ Accounting Settings', color: '#f59e0b' }
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.background = action.color;
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
