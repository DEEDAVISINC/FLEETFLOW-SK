'use client';

import React, { useState, useEffect } from 'react';
import { checkPermission, getCurrentUser, ACCESS_MESSAGES } from '../config/access';

// Access Control Component
const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #059669, #047857)',
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
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Go Back
      </button>
    </div>
  </div>
);

// Comprehensive Data Interfaces
interface ShipperInvoice {
  id: string;
  shipperName: string;
  shipperCompany: string;
  loadId: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails: {
    origin: string;
    destination: string;
    equipment: string;
    weight?: number;
    miles?: number;
  };
  daysOutstanding: number;
}

interface DispatcherInvoice {
  id: string;
  loadId: string;
  carrierName: string;
  dispatchFee: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails: {
    origin: string;
    destination: string;
    equipment: string;
    miles?: number;
  };
  daysOutstanding: number;
}

interface PayrollRecord {
  id: string;
  employeeName: string;
  role: 'dispatcher' | 'broker' | 'manager';
  payPeriod: string;
  grossPay: number;
  commissions?: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Processed' | 'Paid';
  payDate?: string;
}

interface FactoringRecord {
  id: string;
  loadId: string;
  carrierName: string;
  driverName: string;
  invoiceAmount: number;
  factorRate: number;
  factoredAmount: number;
  advanceAmount: number;
  reserveAmount: number;
  status: 'Submitted' | 'Approved' | 'Funded' | 'Collected';
  submissionDate: string;
  fundingDate?: string;
}

// Section Navigation Component
const SectionNav = ({ currentSection, setCurrentSection }: {
  currentSection: string;
  setCurrentSection: (section: 'invoices' | 'payroll' | 'factoring') => void;
}) => (
  <div style={{
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }}>
    {[
      { id: 'invoices', label: '💰 Invoices & Receivables', icon: '📄' },
      { id: 'payroll', label: '👥 Payroll & Commissions', icon: '💵' },
      { id: 'factoring', label: '🏦 Factoring & Cash Flow', icon: '💳' }
    ].map((section) => (
      <button
        key={section.id}
        onClick={() => setCurrentSection(section.id as any)}
        style={{
          background: currentSection === section.id 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(255, 255, 255, 0.15)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)',
          transform: currentSection === section.id ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: currentSection === section.id 
            ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        onMouseOver={(e) => {
          if (currentSection !== section.id) {
            (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.25)';
            (e.target as HTMLElement).style.transform = 'translateY(-1px)';
          }
        }}
        onMouseOut={(e) => {
          if (currentSection !== section.id) {
            (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }
        }}
      >
        {section.icon} {section.label}
      </button>
    ))}
  </div>
);

// Metric Card Component
const MetricCard = ({ title, value, emoji, color, subtitle }: { 
  title: string; 
  value: string; 
  emoji: string; 
  color: string;
  subtitle?: string;
}) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
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
        {subtitle && (
          <p style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginTop: '4px',
            margin: 0
          }}>{subtitle}</p>
        )}
      </div>
      <div style={{
        fontSize: '2.5rem',
        opacity: 0.8
      }}>{emoji}</div>
    </div>
  </div>
);

export default function AccountingPage() {
  // Check access permission
  if (!checkPermission('hasFinancialsAccess')) {
    return <AccessRestricted />;
  }

  // State management
  const [currentSection, setCurrentSection] = useState<'invoices' | 'payroll' | 'factoring'>('invoices');
  const [currentViewRole, setCurrentViewRole] = useState<'broker' | 'dispatcher'>('broker');

  // Get current user
  const { user } = getCurrentUser();

  // Mock Data
  const mockData = {
    shipper: {
      metrics: {
        totalInvoiced: 285750,
        totalPaid: 248200,
        totalOutstanding: 37550,
        collectionRate: 86.9,
        totalInvoices: 48
      },
      invoices: [
        {
          id: 'SHP-2024-001',
          shipperName: 'John Manufacturing',
          shipperCompany: 'John Manufacturing Co.',
          loadId: 'LD-2024-789',
          amount: 4850,
          invoiceDate: '2024-12-05',
          dueDate: '2025-01-04',
          status: 'Sent' as const,
          loadDetails: {
            origin: 'Atlanta, GA',
            destination: 'Miami, FL',
            equipment: 'Reefer',
            weight: 42000,
            miles: 650
          },
          daysOutstanding: 2
        },
        {
          id: 'SHP-2024-002', 
          shipperName: 'Global Electronics',
          shipperCompany: 'Global Electronics Inc.',
          loadId: 'LD-2024-790',
          amount: 6200,
          invoiceDate: '2024-11-20',
          dueDate: '2024-12-20',
          status: 'Overdue' as const,
          loadDetails: {
            origin: 'Los Angeles, CA',
            destination: 'Phoenix, AZ', 
            equipment: 'Dry Van',
            weight: 38500,
            miles: 370
          },
          daysOutstanding: 17
        }
      ]
    },
    dispatcher: {
      metrics: {
        totalInvoiced: 28750,
        totalPaid: 22400,
        totalOutstanding: 6350,
        collectionRate: 77.9,
        totalInvoices: 42
      },
      invoices: [
        {
          id: 'INV-2024-001',
          loadId: 'LD-2024-456',
          carrierName: 'ABC Transport LLC',
          dispatchFee: 875,
          invoiceDate: '2024-12-01',
          dueDate: '2024-12-31',
          status: 'Paid' as const,
          loadDetails: {
            origin: 'Dallas, TX',
            destination: 'Houston, TX',
            equipment: 'Dry Van',
            miles: 240
          },
          daysOutstanding: 0
        }
      ]
    },
    payroll: {
      metrics: {
        totalPayroll: 48750,
        totalCommissions: 12400,
        netPayroll: 52950,
        employeeCount: 12,
        pendingPayments: 8
      },
      records: [
        {
          id: 'PAY-2024-001',
          employeeName: 'Sarah Johnson',
          role: 'dispatcher' as const,
          payPeriod: 'Dec 1-15, 2024',
          grossPay: 3200,
          commissions: 850,
          deductions: 480,
          netPay: 3570,
          status: 'Processed' as const,
          payDate: '2024-12-16'
        }
      ]
    },
    factoring: {
      metrics: {
        totalFactored: 156750,
        totalAdvanced: 140075,
        avgFactorRate: 3.2,
        pendingSubmissions: 5,
        activeFunds: 8
      },
      records: [
        {
          id: 'FAC-2024-001',
          loadId: 'LD-2024-456',
          carrierName: 'ABC Transport LLC',
          driverName: 'Robert Williams',
          invoiceAmount: 4500,
          factorRate: 3.0,
          factoredAmount: 4365,
          advanceAmount: 3927,
          reserveAmount: 438,
          status: 'Funded' as const,
          submissionDate: '2024-12-01',
          fundingDate: '2024-12-02'
        }
      ]
    }
  };

  // Get current section data
  const getCurrentData = () => {
    switch (currentSection) {
      case 'invoices':
        return currentViewRole === 'broker' ? mockData.shipper : mockData.dispatcher;
      case 'payroll':
        return mockData.payroll;
      case 'factoring':
        return mockData.factoring;
      default:
        return mockData.shipper;
    }
  };

  const currentData = getCurrentData();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #059669, #047857)',
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
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>💰 FleetFlow Accounting Hub</h1>
          
          {/* Section Navigation */}
          <SectionNav currentSection={currentSection} setCurrentSection={setCurrentSection} />
          
          {/* Role Switcher (only for invoices section) */}
          {currentSection === 'invoices' && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'inline-block',
                background: currentViewRole === 'broker' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(5, 150, 105, 0.3)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                {currentViewRole === 'broker' ? '🏢 Broker View' : '📋 Dispatcher View'}
              </div>
              <br />
              <button
                onClick={() => setCurrentViewRole(currentViewRole === 'broker' ? 'dispatcher' : 'broker')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                🔄 Switch to {currentViewRole === 'broker' ? 'Dispatcher' : 'Broker'} View
              </button>
            </div>
          )}
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '0px',
            lineHeight: '1.6'
          }}>
            {currentSection === 'invoices' 
              ? (currentViewRole === 'broker' 
                  ? 'Track shipper invoices and receivables'
                  : 'Track dispatcher fee invoices and payments')
              : currentSection === 'payroll'
                ? 'Manage employee payroll and commission payments'
                : 'Manage factoring and cash flow financing'
            }
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {currentSection === 'invoices' && (
            <>
              <MetricCard 
                title="Total Invoiced" 
                value={`$${currentData.metrics.totalInvoiced.toLocaleString()}`} 
                emoji="💰" 
                color="#059669"
              />
              <MetricCard 
                title="Total Paid" 
                value={`$${currentData.metrics.totalPaid?.toLocaleString() || '0'}`} 
                emoji="✅" 
                color="#3b82f6"
              />
              <MetricCard 
                title="Outstanding" 
                value={`$${currentData.metrics.totalOutstanding?.toLocaleString() || '0'}`} 
                emoji="⏰" 
                color="#f59e0b"
              />
              <MetricCard 
                title="Collection Rate" 
                value={`${currentData.metrics.collectionRate}%`} 
                emoji="📈" 
                color="#ef4444"
              />
            </>
          )}
          
          {currentSection === 'payroll' && (
            <>
              <MetricCard 
                title="Total Payroll" 
                value={`$${mockData.payroll.metrics.totalPayroll.toLocaleString()}`} 
                emoji="💵" 
                color="#059669"
              />
              <MetricCard 
                title="Commissions" 
                value={`$${mockData.payroll.metrics.totalCommissions.toLocaleString()}`} 
                emoji="🎯" 
                color="#3b82f6"
              />
              <MetricCard 
                title="Net Payroll" 
                value={`$${mockData.payroll.metrics.netPayroll.toLocaleString()}`} 
                emoji="💰" 
                color="#8b5cf6"
              />
              <MetricCard 
                title="Employees" 
                value={`${mockData.payroll.metrics.employeeCount}`} 
                emoji="👥" 
                color="#ef4444"
                subtitle={`${mockData.payroll.metrics.pendingPayments} pending`}
              />
            </>
          )}
          
          {currentSection === 'factoring' && (
            <>
              <MetricCard 
                title="Total Factored" 
                value={`$${mockData.factoring.metrics.totalFactored.toLocaleString()}`} 
                emoji="🏦" 
                color="#059669"
              />
              <MetricCard 
                title="Advanced" 
                value={`$${mockData.factoring.metrics.totalAdvanced.toLocaleString()}`} 
                emoji="💳" 
                color="#3b82f6"
              />
              <MetricCard 
                title="Avg Factor Rate" 
                value={`${mockData.factoring.metrics.avgFactorRate}%`} 
                emoji="📊" 
                color="#f59e0b"
              />
              <MetricCard 
                title="Active Funds" 
                value={`${mockData.factoring.metrics.activeFunds}`} 
                emoji="⚡" 
                color="#ef4444"
                subtitle={`${mockData.factoring.metrics.pendingSubmissions} pending`}
              />
            </>
          )}
        </div>

        {/* Content Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            {currentSection === 'invoices' 
              ? (currentViewRole === 'broker' ? 'Shipper Invoices' : 'Dispatcher Fee Invoices')
              : currentSection === 'payroll'
                ? 'Payroll Records'
                : 'Factoring Records'
            }
          </h3>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            padding: '16px',
            overflow: 'auto'
          }}>
            <p style={{ color: '#374151', textAlign: 'center', padding: '20px' }}>
              {currentSection === 'invoices' 
                ? `${currentViewRole === 'broker' ? 'Shipper' : 'Dispatcher'} invoice table will be displayed here`
                : currentSection === 'payroll'
                  ? 'Payroll records table will be displayed here'
                  : 'Factoring records table will be displayed here'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
