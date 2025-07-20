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
  agingCategory: 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days';
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
  agingCategory: 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days';
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
  carrierMcNumber: string;
  driverName: string;
  driverPhone: string;
  invoiceAmount: number;
  factorRate: number;
  factoredAmount: number;
  advanceAmount: number;
  reserveAmount: number;
  status: 'Submitted' | 'Approved' | 'Funded' | 'Collected';
  submissionDate: string;
  fundingDate?: string;
  collectionDate?: string;
  factorCompany: string;
  route: {
    origin: string;
    destination: string;
    miles: number;
  };
  bankInfo?: {
    accountName: string;
    routingNumber: string;
    accountNumber: string; // Would be masked in real system
  };
}

interface FinancialMetrics {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  avgDaysToPayment: number;
  currentReceivables: number;
  overdueReceivables: number;
  collectionRate: number;
  totalInvoices: number;
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

// Shipper Invoices Table Component (for brokers)
const ShipperInvoicesTable = ({ invoices }: { invoices: ShipperInvoice[] }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflowX: 'auto'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        margin: 0
      }}>📋 Shipper Invoices</h3>
      
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          Total: {invoices.length} invoices
        </div>
        <div style={{
          background: 'rgba(245, 158, 11, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          Outstanding: {invoices.filter(inv => inv.status !== 'Paid').length}
        </div>
      </div>
    </div>
    
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Invoice ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Shipper</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Route</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Amount</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Due Date</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Days Outstanding</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id} style={{
              borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.05)'}
            onMouseOut={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '12px', fontWeight: '500', color: '#374151', fontFamily: 'monospace' }}>
                {invoice.id}
              </td>
              <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                <div>{invoice.shipperName}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {invoice.shipperCompany}
                </div>
              </td>
              <td style={{ padding: '12px', color: '#6b7280' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                  {invoice.loadDetails.origin} → {invoice.loadDetails.destination}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {invoice.loadDetails.equipment} • {invoice.loadDetails.weight ? `${invoice.loadDetails.weight} lbs` : ''} • {invoice.loadDetails.miles} mi
                </div>
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>
                ${invoice.amount.toLocaleString()}
              </td>
              <td style={{ padding: '12px', color: '#6b7280' }}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  background: invoice.status === 'Paid' ? '#dcfce7' :
                             invoice.status === 'Sent' ? '#dbeafe' :
                             invoice.status === 'Pending' ? '#fef3c7' : '#fecaca',
                  color: invoice.status === 'Paid' ? '#166534' :
                         invoice.status === 'Sent' ? '#1e40af' :
                         invoice.status === 'Pending' ? '#92400e' : '#dc2626',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>{invoice.status}</span>
              </td>
              <td style={{ padding: '12px' }}>
                {invoice.status === 'Paid' ? (
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Paid</span>
                ) : invoice.daysOutstanding === 0 ? (
                  <span style={{ color: '#6b7280' }}>Current</span>
                ) : (
                  <div>
                    <span style={{
                      fontWeight: 'bold',
                      color: invoice.daysOutstanding <= 30 ? '#f59e0b' :
                             invoice.daysOutstanding <= 60 ? '#ea580c' : '#dc2626'
                    }}>
                      {invoice.daysOutstanding} days
                    </span>
                    <div style={{
                      fontSize: '0.7rem',
                      color: invoice.daysOutstanding <= 30 ? '#f59e0b' :
                             invoice.daysOutstanding <= 60 ? '#ea580c' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {invoice.agingCategory}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Dispatcher Invoices Table Component
const InvoicesTable = ({ invoices }: { invoices: DispatcherInvoice[] }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflowX: 'auto'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        margin: 0
      }}>Dispatcher Fee Invoices</h3>
      
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          Total: {invoices.length} invoices
        </div>
        <div style={{
          background: 'rgba(245, 158, 11, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          Outstanding: {invoices.filter(inv => inv.status !== 'Paid').length}
        </div>
      </div>
    </div>
    
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Invoice ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Carrier</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Route</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Fee</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Due Date</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Days Outstanding</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id} style={{
              borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(5, 150, 105, 0.05)'}
            onMouseOut={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '12px', fontWeight: '500', color: '#374151', fontFamily: 'monospace' }}>
                {invoice.id}
              </td>
              <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                <div>{invoice.carrierName}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Load: {invoice.loadId}
                </div>
              </td>
              <td style={{ padding: '12px', color: '#6b7280' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                  {invoice.loadDetails.origin} → {invoice.loadDetails.destination}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {invoice.loadDetails.equipment} • {invoice.loadDetails.miles} mi
                </div>
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#059669' }}>
                ${invoice.dispatchFee.toLocaleString()}
              </td>
              <td style={{ padding: '12px', color: '#6b7280' }}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  background: invoice.status === 'Paid' ? '#dcfce7' :
                             invoice.status === 'Sent' ? '#dbeafe' :
                             invoice.status === 'Pending' ? '#fef3c7' : '#fecaca',
                  color: invoice.status === 'Paid' ? '#166534' :
                         invoice.status === 'Sent' ? '#1e40af' :
                         invoice.status === 'Pending' ? '#92400e' : '#dc2626',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>{invoice.status}</span>
              </td>
              <td style={{ padding: '12px' }}>
                {invoice.status === 'Paid' ? (
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>Paid</span>
                ) : invoice.daysOutstanding === 0 ? (
                  <span style={{ color: '#6b7280' }}>Current</span>
                ) : (
                  <div>
                    <span style={{
                      fontWeight: 'bold',
                      color: invoice.daysOutstanding <= 30 ? '#f59e0b' :
                             invoice.daysOutstanding <= 60 ? '#ea580c' : '#dc2626'
                    }}>
                      {invoice.daysOutstanding} days
                    </span>
                    <div style={{
                      fontSize: '0.7rem',
                      color: invoice.daysOutstanding <= 30 ? '#f59e0b' :
                             invoice.daysOutstanding <= 60 ? '#ea580c' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {invoice.agingCategory}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Payroll Table Component
const PayrollTable = ({ records }: { records: PayrollRecord[] }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflowX: 'auto'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        margin: 0
      }}>💼 Payroll Records</h3>
      
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          Total: {records.length} employees
        </div>
        <div style={{
          background: 'rgba(245, 158, 11, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          Pending: {records.filter(r => r.status === 'Pending').length}
        </div>
      </div>
    </div>
    
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.9)', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Employee</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Role</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Pay Period</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Gross Pay</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Commissions</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Net Pay</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} style={{
              borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(5, 150, 105, 0.05)'}
            onMouseOut={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                <div>{record.employeeName}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  ID: {record.id}
                </div>
              </td>
              <td style={{ padding: '12px', color: '#6b7280' }}>
                <span style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>{record.role}</span>
              </td>
              <td style={{ padding: '12px', color: '#6b7280', fontSize: '0.9rem' }}>
                {record.payPeriod}
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#374151' }}>
                ${record.grossPay.toLocaleString()}
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#059669' }}>
                ${record.commissions?.toLocaleString() || '0'}
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>
                ${record.netPay.toLocaleString()}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  background: record.status === 'Paid' ? '#dcfce7' :
                             record.status === 'Processed' ? '#dbeafe' : '#fef3c7',
                  color: record.status === 'Paid' ? '#166534' :
                         record.status === 'Processed' ? '#1e40af' : '#92400e',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>{record.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Factoring Table Component
const FactoringTable = ({ records }: { records: FactoringRecord[] }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflowX: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          margin: 0
        }}>🏦 Driver/Carrier Factoring</h3>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            Total: {records.length} loads
          </div>
          <div style={{
            background: 'rgba(34, 197, 94, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            Funded: {records.filter(r => r.status === 'Funded').length}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
          >
            + Add Factoring Record
          </button>
        </div>
      </div>

      {showAddForm && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
            📝 Add New Factoring Record
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {[
              { label: 'Load ID', placeholder: 'LD-2024-XXX' },
              { label: 'Carrier Name', placeholder: 'Carrier Company Name' },
              { label: 'MC Number', placeholder: 'MC-XXXXXX' },
              { label: 'Driver Name', placeholder: 'Driver Full Name' },
              { label: 'Driver Phone', placeholder: '(555) 123-4567' },
              { label: 'Invoice Amount', placeholder: '$5,000' },
              { label: 'Factor Rate %', placeholder: '3.5' },
              { label: 'Factor Company', placeholder: 'Factoring Company' }
            ].map((field, index) => (
              <div key={index}>
                <label style={{ 
                  color: 'white', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '4px'
                }}>
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              💾 Save Factoring Record
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(5, 150, 105, 0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Load/Carrier</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Driver Info</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Route</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Invoice/Rate</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Advanced</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Factor Company</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id} style={{
                borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(5, 150, 105, 0.05)'}
              onMouseOut={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                  <div style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{record.loadId}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{record.carrierName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    MC: {record.carrierMcNumber}
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  <div style={{ fontWeight: '500' }}>{record.driverName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    📞 {record.driverPhone}
                  </div>
                </td>
                <td style={{ padding: '12px', color: '#6b7280' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                    {record.route.origin} → {record.route.destination}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {record.route.miles} miles
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>
                    ${record.invoiceAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Rate: {record.factorRate}%
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: '#059669' }}>
                    ${record.advanceAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '500' }}>
                    Reserve: ${record.reserveAmount.toLocaleString()}
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '0.9rem', color: '#374151' }}>
                  {record.factorCompany}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: record.status === 'Funded' ? '#dcfce7' :
                               record.status === 'Approved' ? '#dbeafe' :
                               record.status === 'Submitted' ? '#fef3c7' : 
                               record.status === 'Collected' ? '#f0fdf4' : '#fecaca',
                    color: record.status === 'Funded' ? '#166534' :
                           record.status === 'Approved' ? '#1e40af' :
                           record.status === 'Submitted' ? '#92400e' : 
                           record.status === 'Collected' ? '#15803d' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>{record.status}</span>
                  {record.fundingDate && (
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                      Funded: {new Date(record.fundingDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AccountingPage() {
  // Check access permission
  if (!checkPermission('hasFinancialsAccess')) {
    return <AccessRestricted />;
  }

  // State management
  const [currentSection, setCurrentSection] = useState<'invoices' | 'payroll' | 'factoring'>('invoices');
  const [currentViewRole, setCurrentViewRole] = useState<'broker' | 'dispatcher'>('broker');

  // Get current user and role
  const { user } = getCurrentUser();
  const userRole = currentViewRole; // Use state instead of user.role for demo

  // Mock data - Shipper Invoices (what shippers owe for freight services)
  const shipperMetrics: FinancialMetrics = {
    totalInvoiced: 285750,
    totalPaid: 248200,
    totalOutstanding: 37550,
    avgDaysToPayment: 28.5,
    currentReceivables: 28400,
    overdueReceivables: 9150,
    collectionRate: 86.9,
    totalInvoices: 48
  };

  // Mock data - Dispatcher Fee Invoices (what carriers owe for dispatch services)
  const dispatcherMetrics: FinancialMetrics = {
    totalInvoiced: 28750,
    totalPaid: 22400,
    totalOutstanding: 6350,
    avgDaysToPayment: 24.5,
    currentReceivables: 4200,
    overdueReceivables: 2150,
    collectionRate: 77.9,
    totalInvoices: 42
  };

  // Mock data - Payroll Summary
  const payrollMetrics = {
    totalPayroll: 48750,
    totalCommissions: 12400,
    totalDeductions: 8200,
    netPayroll: 52950,
    employeeCount: 12,
    pendingPayments: 8
  };

  // Mock data - Factoring Summary  
  const factoringMetrics = {
    totalFactored: 234250,
    totalAdvanced: 210330,
    totalReserved: 23920,
    avgFactorRate: 3.1,
    pendingSubmissions: 1,
    activeFunds: 3,
    completedTransactions: 2,
    totalCarriers: 5
  };

  // Mock data - Shipper Invoices (what shippers owe for freight services)
  const shipperInvoices: ShipperInvoice[] = [
    {
      id: 'SHP-2024-001',
      shipperName: 'John Manufacturing',
      shipperCompany: 'John Manufacturing Co.',
      loadId: 'LD-2024-789',
      amount: 4850,
      invoiceDate: '2024-12-05',
      dueDate: '2025-01-04',
      status: 'Sent',
      loadDetails: {
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        equipment: 'Reefer',
        weight: 42000,
        miles: 650
      },
      daysOutstanding: 2,
      agingCategory: 'Current'
    },
    {
      id: 'SHP-2024-002', 
      shipperName: 'Global Electronics',
      shipperCompany: 'Global Electronics Inc.',
      loadId: 'LD-2024-790',
      amount: 6200,
      invoiceDate: '2024-11-20',
      dueDate: '2024-12-20',
      status: 'Overdue',
      loadDetails: {
        origin: 'Los Angeles, CA',
        destination: 'Phoenix, AZ', 
        equipment: 'Dry Van',
        weight: 38500,
        miles: 370
      },
      daysOutstanding: 17,
      agingCategory: '1-30 Days'
    },
    {
      id: 'SHP-2024-003',
      shipperName: 'Fresh Foods Corp',
      shipperCompany: 'Fresh Foods Corporation',
      loadId: 'LD-2024-791',
      amount: 3750,
      invoiceDate: '2024-12-10',
      dueDate: '2025-01-09',
      status: 'Paid',
      loadDetails: {
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        equipment: 'Reefer',
        weight: 28000,
        miles: 175
      },
      daysOutstanding: 0,
      agingCategory: 'Current'
    }
  ];

  // Mock data - Dispatcher Fee Invoices (what carriers owe for dispatch services)
  const mockInvoices: DispatcherInvoice[] = [
    {
      id: 'INV-2024-001',
      loadId: 'LD-2024-456',
      carrierName: 'ABC Transport LLC',
      dispatchFee: 875,
      invoiceDate: '2024-12-01',
      dueDate: '2024-12-31',
      status: 'Paid' as const,
      loadDetails: {
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        equipment: 'Dry Van',
        miles: 662
      },
      daysOutstanding: 0,
      agingCategory: 'Current' as const
    },
    {
      id: 'INV-2024-002',
      loadId: 'LD-2024-789',
      carrierName: 'Reliable Freight Co',
      dispatchFee: 650,
      invoiceDate: '2024-12-15',
      dueDate: '2025-01-14',
      status: 'Overdue' as const,
      loadDetails: {
        origin: 'Chicago, IL',
        destination: 'Houston, TX',
        equipment: 'Refrigerated',
        miles: 1083
      },
      daysOutstanding: 22,
      agingCategory: '1-30 Days' as const
    },
    {
      id: 'INV-2024-003',
      loadId: 'LD-2024-123',
      carrierName: 'Express Logistics',
      dispatchFee: 725,
      invoiceDate: '2024-12-20',
      dueDate: '2025-01-19',
      status: 'Sent' as const,
      loadDetails: {
        origin: 'Los Angeles, CA',
        destination: 'Phoenix, AZ',
        equipment: 'Flatbed',
        miles: 372
      },
      daysOutstanding: 17,
      agingCategory: 'Current' as const
    },
    {
      id: 'INV-2024-004',
      loadId: 'LD-2024-567',
      carrierName: 'Mountain View Transport',
      dispatchFee: 950,
      invoiceDate: '2025-01-02',
      dueDate: '2025-02-01',
      status: 'Pending' as const,
      loadDetails: {
        origin: 'Denver, CO',
        destination: 'Salt Lake City, UT',
        equipment: 'Dry Van',
        miles: 525
      },
      daysOutstanding: 0,
      agingCategory: 'Current' as const
    },
    {
      id: 'INV-2024-005',
      loadId: 'LD-2024-890',
      carrierName: 'Quick Haul Inc',
      dispatchFee: 425,
      invoiceDate: '2024-11-15',
      dueDate: '2024-12-15',
      status: 'Overdue' as const,
      loadDetails: {
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        equipment: 'Dry Van',
        miles: 174
      },
      daysOutstanding: 52,
      agingCategory: '31-60 Days' as const
    }
  ];

  // Mock data - Payroll Records
  const payrollRecords: PayrollRecord[] = [
    {
      id: 'PAY-2024-001',
      employeeName: 'Sarah Johnson',
      role: 'dispatcher',
      payPeriod: '12/01/24 - 12/15/24',
      grossPay: 3200,
      commissions: 850,
      deductions: 425,
      netPay: 3625,
      status: 'Paid',
      payDate: '2024-12-20'
    },
    {
      id: 'PAY-2024-002', 
      employeeName: 'Mike Chen',
      role: 'dispatcher',
      payPeriod: '12/01/24 - 12/15/24',
      grossPay: 2800,
      commissions: 720,
      deductions: 380,
      netPay: 3140,
      status: 'Processed'
    },
    {
      id: 'PAY-2024-003',
      employeeName: 'John Smith',
      role: 'broker',
      payPeriod: '12/01/24 - 12/15/24', 
      grossPay: 4500,
      commissions: 1200,
      deductions: 620,
      netPay: 5080,
      status: 'Pending'
    }
  ];

  // Mock data - Factoring Records
  const factoringRecords: FactoringRecord[] = [
    {
      id: 'FCT-2024-001',
      loadId: 'LD-2024-789',
      carrierName: 'ABC Transport LLC',
      carrierMcNumber: 'MC-758392',
      driverName: 'Carlos Rodriguez',
      driverPhone: '(555) 123-4567',
      invoiceAmount: 4850,
      factorRate: 3.5,
      factoredAmount: 4680,
      advanceAmount: 4212,
      reserveAmount: 468,
      status: 'Funded',
      submissionDate: '2024-12-15',
      fundingDate: '2024-12-16',
      collectionDate: '2024-12-30',
      factorCompany: 'TruckCash Factoring',
      route: {
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        miles: 662
      },
      bankInfo: {
        accountName: 'ABC Transport LLC',
        routingNumber: '061000227',
        accountNumber: '****7892'
      }
    },
    {
      id: 'FCT-2024-002',
      loadId: 'LD-2024-790', 
      carrierName: 'Express Logistics Inc',
      carrierMcNumber: 'MC-945127',
      driverName: 'Maria Santos',
      driverPhone: '(555) 987-6543',
      invoiceAmount: 3200,
      factorRate: 2.8,
      factoredAmount: 3110,
      advanceAmount: 2799,
      reserveAmount: 311,
      status: 'Approved',
      submissionDate: '2024-12-18',
      factorCompany: 'FastFactor Pro',
      route: {
        origin: 'Chicago, IL',
        destination: 'Houston, TX',
        miles: 1083
      },
      bankInfo: {
        accountName: 'Express Logistics Inc',
        routingNumber: '071923909',
        accountNumber: '****3456'
      }
    },
    {
      id: 'FCT-2024-003',
      loadId: 'LD-2024-791',
      carrierName: 'Mountain View Transport',
      carrierMcNumber: 'MC-672841',
      driverName: 'James Wilson',
      driverPhone: '(555) 456-7890',
      invoiceAmount: 5200,
      factorRate: 3.2,
      factoredAmount: 5034,
      advanceAmount: 4531,
      reserveAmount: 503,
      status: 'Submitted',
      submissionDate: '2024-12-20',
      factorCompany: 'QuickPay Factoring',
      route: {
        origin: 'Denver, CO',
        destination: 'Salt Lake City, UT',
        miles: 525
      },
      bankInfo: {
        accountName: 'Mountain View Transport',
        routingNumber: '102000076',
        accountNumber: '****9012'
      }
    },
    {
      id: 'FCT-2024-004',
      loadId: 'LD-2024-792',
      carrierName: 'Sunshine Freight Co',
      carrierMcNumber: 'MC-381952',
      driverName: 'Roberto Martinez',
      driverPhone: '(555) 321-0987',
      invoiceAmount: 3750,
      factorRate: 3.8,
      factoredAmount: 3608,
      advanceAmount: 3247,
      reserveAmount: 361,
      status: 'Funded',
      submissionDate: '2024-12-10',
      fundingDate: '2024-12-11',
      factorCompany: 'TruckCash Factoring',
      route: {
        origin: 'Phoenix, AZ',
        destination: 'Los Angeles, CA',
        miles: 372
      },
      bankInfo: {
        accountName: 'Sunshine Freight Co',
        routingNumber: '122000661',
        accountNumber: '****5678'
      }
    },
    {
      id: 'FCT-2024-005',
      loadId: 'LD-2024-793',
      carrierName: 'Elite Carriers LLC',
      carrierMcNumber: 'MC-529103',
      driverName: 'Jennifer Adams',
      driverPhone: '(555) 654-3210',
      invoiceAmount: 6200,
      factorRate: 2.5,
      factoredAmount: 6045,
      advanceAmount: 5441,
      reserveAmount: 604,
      status: 'Collected',
      submissionDate: '2024-11-28',
      fundingDate: '2024-11-29',
      collectionDate: '2024-12-28',
      factorCompany: 'FastFactor Pro',
      route: {
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        miles: 174
      },
      bankInfo: {
        accountName: 'Elite Carriers LLC',
        routingNumber: '125000024',
        accountNumber: '****2345'
      }
    }
  ];

  // Broker-specific invoices (what the broker owes for dispatch services)
  const brokerInvoices: DispatcherInvoice[] = [
    {
      id: 'INV-2024-B01',
      loadId: 'LD-2024-890',
      carrierName: 'My Dispatch Service',
      dispatchFee: 750,
      invoiceDate: '2024-12-15',
      dueDate: '2025-01-14',
      status: 'Sent' as const,
      loadDetails: {
        origin: 'Miami, FL',
        destination: 'Orlando, FL',
        equipment: 'Dry Van',
        miles: 235
      },
      daysOutstanding: 7,
      agingCategory: 'Current' as const
    },
    {
      id: 'INV-2024-B02',
      loadId: 'LD-2024-891',
      carrierName: 'My Dispatch Service',
      dispatchFee: 625,
      invoiceDate: '2024-12-20',
      dueDate: '2025-01-19',
      status: 'Pending' as const,
      loadDetails: {
        origin: 'Tampa, FL',
        destination: 'Jacksonville, FL',
        equipment: 'Refrigerated',
        miles: 195
      },
      daysOutstanding: 0,
      agingCategory: 'Current' as const
    },
    {
      id: 'INV-2024-B03',
      loadId: 'LD-2024-892',
      carrierName: 'My Dispatch Service',
      dispatchFee: 875,
      invoiceDate: '2024-11-25',
      dueDate: '2024-12-25',
      status: 'Overdue' as const,
      loadDetails: {
        origin: 'Atlanta, GA',
        destination: 'Savannah, GA',
        equipment: 'Flatbed',
        miles: 250
      },
      daysOutstanding: 42,
      agingCategory: '31-60 Days' as const
    }
  ];

  // Choose data based on user role and current section
  const getCurrentMetrics = () => {
    if (currentSection === 'payroll') return payrollMetrics;
    if (currentSection === 'factoring') return factoringMetrics;
    return userRole === 'broker' ? shipperMetrics : dispatcherMetrics;
  };

  const getCurrentInvoices = () => {
    if (currentSection === 'payroll') return payrollRecords;
    if (currentSection === 'factoring') return factoringRecords;
    return userRole === 'broker' ? shipperInvoices : mockInvoices;
  };

  const currentMetrics = getCurrentMetrics();
  const currentInvoices = getCurrentInvoices();

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
          }}>💰 FleetFlow Accounting</h1>
          <div style={{
            display: 'inline-block',
            background: userRole === 'broker' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(5, 150, 105, 0.3)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            marginBottom: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            {userRole === 'broker' ? '🏢 Broker View' : '📋 Dispatcher View'} • {userRole === 'broker' ? 'John Smith (Global Freight)' : 'Sarah Johnson (Dispatcher)'}
          </div>
          
          {/* Role Switcher Button */}
          <div style={{ marginBottom: '12px' }}>
            <button
              onClick={() => setCurrentViewRole(currentViewRole === 'broker' ? 'dispatcher' : 'broker')}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = 'none';
              }}
            >
              🔄 Switch to {userRole === 'broker' ? 'Dispatcher' : 'Broker'} View
            </button>
          </div>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '0px',
            lineHeight: '1.6'
          }}>
            {userRole === 'broker' 
              ? 'Track payment status for your dispatch service fees'
              : 'Track your dispatch fee invoices, payment status, and aging'
            }
          </p>
        </div>

        {/* Section Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'invoices', label: '📋 Invoices', desc: userRole === 'broker' ? 'Shipper Invoices' : 'Dispatch Fees' },
            { id: 'payroll', label: '💼 Payroll', desc: 'Employee Payments' },
            { id: 'factoring', label: '🏦 Factoring', desc: 'Driver/Carrier Funding' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id as any)}
              style={{
                background: currentSection === section.id 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: currentSection === section.id 
                  ? '2px solid rgba(255, 255, 255, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                if (currentSection !== section.id) {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (currentSection !== section.id) {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <div>{section.label}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{section.desc}</div>
            </button>
          ))}
        </div>

        {/* Financial Metrics Grid */}
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
                value={`$${(currentMetrics as FinancialMetrics).totalInvoiced.toLocaleString()}`} 
                emoji="💰" 
                color="#059669"
              />
              <MetricCard 
                title="Total Paid" 
                value={`$${(currentMetrics as FinancialMetrics).totalPaid.toLocaleString()}`} 
                emoji="✅" 
                color="#3b82f6"
              />
              <MetricCard 
                title="Outstanding" 
                value={`$${(currentMetrics as FinancialMetrics).totalOutstanding.toLocaleString()}`} 
                emoji="⏰" 
                color="#f59e0b"
              />
              <MetricCard 
                title="Collection Rate" 
                value={`${(currentMetrics as FinancialMetrics).collectionRate}%`} 
                emoji="📊" 
                color="#8b5cf6"
              />
            </>
          )}
          
          {currentSection === 'payroll' && (
            <>
              <MetricCard 
                title="Total Payroll" 
                value={`$${(currentMetrics as any).totalPayroll.toLocaleString()}`} 
                emoji="💼" 
                color="#059669"
              />
              <MetricCard 
                title="Total Commissions" 
                value={`$${(currentMetrics as any).totalCommissions.toLocaleString()}`} 
                emoji="🎯" 
                color="#3b82f6"
              />
              <MetricCard 
                title="Net Payroll" 
                value={`$${(currentMetrics as any).netPayroll.toLocaleString()}`} 
                emoji="💳" 
                color="#f59e0b"
              />
              <MetricCard 
                title="Employee Count" 
                value={`${(currentMetrics as any).employeeCount}`} 
                emoji="👥" 
                color="#8b5cf6"
              />
            </>
          )}
          
          {currentSection === 'factoring' && (
            <>
              <MetricCard 
                title="Total Factored" 
                value={`$${(currentMetrics as any).totalFactored.toLocaleString()}`} 
                emoji="🏦" 
                color="#059669"
              />
              <MetricCard 
                title="Total Advanced" 
                value={`$${(currentMetrics as any).totalAdvanced.toLocaleString()}`} 
                emoji="💸" 
                color="#3b82f6"
              />
              <MetricCard 
                title="Average Rate" 
                value={`${(currentMetrics as any).avgFactorRate}%`} 
                emoji="📈" 
                color="#f59e0b"
              />
              <MetricCard 
                title="Total Carriers" 
                value={`${(currentMetrics as any).totalCarriers}`} 
                emoji="🚛" 
                color="#8b5cf6"
              />
            </>
          )}
        </div>

        {/* Dynamic Table Section */}
        {currentSection === 'invoices' && userRole === 'broker' && (
          <ShipperInvoicesTable invoices={currentInvoices as ShipperInvoice[]} />
        )}
        
        {currentSection === 'invoices' && userRole === 'dispatcher' && (
          <InvoicesTable invoices={currentInvoices as DispatcherInvoice[]} />
        )}
        
        {currentSection === 'payroll' && (
          <PayrollTable records={currentInvoices as PayrollRecord[]} />
        )}
        
        {currentSection === 'factoring' && (
          <FactoringTable records={currentInvoices as FactoringRecord[]} />
        )}

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
              { label: '📊 Generate Financial Report', color: '#10b981' },
              { label: '💳 Process Settlements', color: '#10b981' },
              { label: '📋 Export Data', color: '#10b981' },
              { label: '⚙️ Accounting Settings', color: '#10b981' }
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
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
