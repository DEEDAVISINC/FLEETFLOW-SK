'use client';

import React, { useState, useEffect } from 'react';
import { driverTaxService, DriverTaxData, DriverTaxSummary } from '../drivers/services/DriverTaxService';

interface DriverTaxDashboardProps {
  driverId: string;
  driverName?: string;
}

const DriverTaxDashboard: React.FC<DriverTaxDashboardProps> = ({ driverId, driverName }) => {
  const [taxData, setTaxData] = useState<DriverTaxData | null>(null);
  const [taxSummary, setSummary] = useState<DriverTaxSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jurisdictions' | 'receipts'>('overview');

  useEffect(() => {
    const loadTaxData = () => {
      try {
        const data = driverTaxService.getDriverTaxData(driverId);
        const summary = driverTaxService.getDriverTaxSummary(driverId);
        setTaxData(data);
        setSummary(summary);
      } catch (error) {
        console.error('Error loading tax data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTaxData();
  }, [driverId]);

  const getAlerts = () => {
    if (!taxSummary) return [];
    
    const alerts = [];
    const today = new Date();
    const filingDue = new Date(taxSummary.currentQuarter.filingDue);
    const daysUntilDue = Math.ceil((filingDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Filing alerts
    if (taxSummary.currentQuarter.status === 'needs-filing') {
      if (daysUntilDue <= 7) {
        alerts.push({
          type: 'urgent',
          icon: '🚨',
          title: 'URGENT: IFTA Filing Due Soon',
          message: `Q4 2024 IFTA filing is due in ${daysUntilDue} days (${filingDue.toLocaleDateString()})`,
          action: 'File IFTA Return'
        });
      } else if (daysUntilDue <= 30) {
        alerts.push({
          type: 'warning',
          icon: '⚠️',
          title: 'IFTA Filing Due Soon',
          message: `Q4 2024 IFTA filing is due in ${daysUntilDue} days (${filingDue.toLocaleDateString()})`,
          action: 'Prepare Filing'
        });
      }
    }

    // Compliance alerts
    if (!taxSummary.compliance.receiptsComplete) {
      alerts.push({
        type: 'warning',
        icon: '📋',
        title: 'Missing Fuel Receipts',
        message: 'Some fuel receipts are missing or not uploaded',
        action: 'Upload Receipts'
      });
    }

    // Overdue items
    taxSummary.compliance.overdueItems.forEach(item => {
      alerts.push({
        type: 'urgent',
        icon: '🔴',
        title: 'Overdue Action Required',
        message: item,
        action: 'Take Action'
      });
    });

    return alerts;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#10b981';
      case 'filed': return '#3b82f6';
      case 'needs-filing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return '✅';
      case 'filed': return '📄';
      case 'needs-filing': return '⏰';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📊</div>
        <div>Loading tax dashboard...</div>
      </div>
    );
  }

  if (!taxData || !taxSummary) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚫</div>
        <h3 style={{ color: '#dc2626', marginBottom: '8px' }}>No Tax Data Available</h3>
        <p style={{ color: 'rgba(45, 55, 72, 0.7)' }}>
          Tax information is not available for driver ID: {driverId}
        </p>
      </div>
    );
  }

  const alerts = getAlerts();

  return (
    <div style={{ width: '100%' }}>
      {/* Tax Dashboard Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 'bold', 
            color: '#2d3748', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📊 Tax Dashboard
            <span style={{
              background: getStatusColor(taxSummary.currentQuarter.status),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getStatusIcon(taxSummary.currentQuarter.status)} {taxSummary.currentQuarter.status.toUpperCase()}
            </span>
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.6)' }}>
            Last Updated: {taxData.lastUpdated.toLocaleDateString()}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {taxSummary.currentQuarter.totalMiles.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>Miles (Q4 2024)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              ${taxSummary.currentQuarter.totalFuel.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>Fuel Purchases</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              ${taxSummary.currentQuarter.totalTax.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>Tax Liability</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {Math.ceil((new Date(taxSummary.currentQuarter.filingDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>Days Until Due</div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {alerts.map((alert, index) => (
            <div key={index} style={{
              background: alert.type === 'urgent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `2px solid ${alert.type === 'urgent' ? '#ef4444' : '#f59e0b'}`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{alert.icon}</span>
                <div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: alert.type === 'urgent' ? '#dc2626' : '#d97706',
                    marginBottom: '4px'
                  }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.8)' }}>
                    {alert.message}
                  </div>
                </div>
              </div>
              <button style={{
                background: alert.type === 'urgent' ? '#ef4444' : '#f59e0b',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}>
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid rgba(45, 55, 72, 0.1)',
          padding: '0 24px'
        }}>
          {[
            { id: 'overview', label: '📋 Overview', icon: '📋' },
            { id: 'jurisdictions', label: '🗺️ Jurisdictions', icon: '🗺️' },
            { id: 'receipts', label: '🧾 Fuel Receipts', icon: '🧾' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '16px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : 'rgba(45, 55, 72, 0.7)',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Year-to-Date Summary</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛣️</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    {taxSummary.yearToDate.totalMiles.toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.9 }}>Total Miles (YTD)</div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⛽</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    ${taxSummary.yearToDate.totalFuel.toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.9 }}>Fuel Purchased (YTD)</div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    ${taxSummary.yearToDate.totalTax.toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.9 }}>Tax Liability (YTD)</div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💸</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
                    ${taxSummary.yearToDate.refundsReceived.toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.9 }}>Refunds Received (YTD)</div>
                </div>
              </div>

              <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>Compliance Status</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '16px' 
              }}>
                <div style={{
                  border: '1px solid rgba(45, 55, 72, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {taxSummary.compliance.iftaUpToDate ? '✅' : '❌'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>IFTA Status</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                      {taxSummary.compliance.iftaUpToDate ? 'Up to date' : 'Action required'}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  border: '1px solid rgba(45, 55, 72, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {taxSummary.compliance.receiptsComplete ? '✅' : '❌'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>Fuel Receipts</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                      {taxSummary.compliance.receiptsComplete ? 'All uploaded' : 'Missing receipts'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jurisdictions' && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Jurisdiction Breakdown</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Jurisdiction</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Miles</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Fuel ($)</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Gallons</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Tax Rate</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Tax Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxData.jurisdictions.map((jurisdiction, index) => (
                      <tr key={index} style={{ 
                        borderBottom: '1px solid rgba(45, 55, 72, 0.1)',
                        background: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                      }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>
                          {jurisdiction.jurisdiction} ({jurisdiction.jurisdictionCode})
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {jurisdiction.miles.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          ${jurisdiction.fuelPurchased.toFixed(2)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {jurisdiction.fuelGallons.toFixed(1)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          ${jurisdiction.taxRate.toFixed(3)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#f59e0b' }}>
                          ${jurisdiction.taxDue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'receipts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#2d3748' }}>Recent Fuel Receipts</h3>
                <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                  {taxData.fuelReceipts.filter(r => r.uploaded).length} of {taxData.fuelReceipts.length} uploaded
                </div>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {taxData.fuelReceipts.slice(0, 20).map((receipt, index) => (
                  <div key={index} style={{
                    border: '1px solid rgba(45, 55, 72, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    background: receipt.uploaded ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', color: '#2d3748' }}>
                          {receipt.vendor}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(45, 55, 72, 0.6)' }}>
                          {receipt.receiptNumber}
                        </span>
                        {receipt.uploaded && <span style={{ color: '#10b981' }}>✅</span>}
                        {!receipt.uploaded && <span style={{ color: '#f59e0b' }}>⏳</span>}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                        {receipt.date.toLocaleDateString()} • {receipt.location} ({receipt.jurisdiction})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#2d3748' }}>
                        {receipt.gallons.toFixed(1)} gal
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                        ${receipt.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverTaxDashboard;
