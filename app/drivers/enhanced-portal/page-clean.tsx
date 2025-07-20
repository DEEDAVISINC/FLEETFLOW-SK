'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { onboardingIntegration, DriverPortalProfile } from '../../services/onboarding-integration';
import { checkPermission } from '../../config/access';
import DriverTaxDashboard from '../../components/DriverTaxDashboard';
import { driverTaxService } from '../services/DriverTaxService';

const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
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
        color: '#2d3748', 
        marginBottom: '16px' 
      }}>Access Restricted</h1>
      <p style={{ 
        color: 'rgba(45, 55, 72, 0.8)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need driver portal permissions to access this system.
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

// Driver Dashboard View Component
const DriverDashboardView: React.FC<{ driver?: DriverPortalProfile }> = ({ driver }) => {
  const allDrivers = onboardingIntegration.getAllDrivers();
  const demoDriver = driver || allDrivers[0];

  // Get tax alert information
  const driverId = demoDriver ? `driver_${String(allDrivers.indexOf(demoDriver) + 1).padStart(3, '0')}` : '';
  const taxAlerts = driverId ? driverTaxService.getDriverAlerts(driverId) : { urgent: 0, warning: 0, total: 0 };
  const hasUrgentTaxAlerts = driverId ? driverTaxService.hasUrgentAlerts(driverId) : false;

  if (!demoDriver) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
        <h2 style={{ color: '#2d3748', fontSize: '1.5rem', marginBottom: '16px' }}>
          No Driver Data Available
        </h2>
        <p style={{ color: 'rgba(45, 55, 72, 0.7)' }}>
          Please complete carrier onboarding to create driver accounts.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Driver Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '3rem' }}>👤</div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
              Welcome, {demoDriver.personalInfo.name}
            </h2>
            <p style={{ color: 'rgba(45, 55, 72, 0.7)', margin: 0 }}>
              {demoDriver.employmentInfo.carrierName} • {demoDriver.employmentInfo.role === 'owner_operator' ? 'Owner Operator' : 'Company Driver'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: 'bold' }}>✅</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Account Active</div>
          </div>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>0</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Active Loads</div>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 'bold' }}>0</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Completed</div>
          </div>
          
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#ef4444', fontWeight: 'bold' }}>
              {taxAlerts.total}
            </div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Tax Alerts</div>
            {hasUrgentTaxAlerts && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 'bold'
              }}>
                !
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          🚀 Quick Actions
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '📊', title: 'Tax Dashboard', desc: `View IFTA data, tax liability, and filing alerts${taxAlerts.total > 0 ? ` (${taxAlerts.total} alerts)` : ''}`, isHighlighted: taxAlerts.total > 0 },
            { icon: '📋', title: 'View Assigned Loads', desc: 'Check your current and upcoming deliveries' },
            { icon: '📍', title: 'Update Location', desc: 'Share your current location with dispatch' },
            { icon: '📷', title: 'Upload POD', desc: 'Upload proof of delivery documents' },
            { icon: '💬', title: 'Message Dispatch', desc: 'Communicate with your dispatcher' },
            { icon: '📄', title: 'View Documents', desc: 'Access your employment documents' },
            { icon: '⚙️', title: 'Settings', desc: 'Update your profile and preferences' }
          ].map((action, index) => (
            <button
              key={index}
              style={{
                background: action.isHighlighted ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                border: action.isHighlighted ? '2px solid #f59e0b' : '1px solid rgba(45, 55, 72, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (action.isHighlighted) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(245, 158, 11, 0.2)';
                } else {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.1)';
                }
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                if (action.isHighlighted) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(245, 158, 11, 0.1)';
                } else {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                }
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {action.isHighlighted && hasUrgentTaxAlerts && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  !
                </div>
              )}
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{action.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '4px' }}>
                {action.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                {action.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tax Dashboard */}
      <DriverTaxDashboard 
        driverId={driverId}
        driverName={demoDriver.personalInfo.name}
      />
    </div>
  );
};

export default function EnhancedDriverPortal() {
  // Check permissions first
  if (!checkPermission('canViewDriverPortal')) {
    return <AccessRestricted />;
  }

  const [drivers, setDrivers] = useState<DriverPortalProfile[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverPortalProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activated' | 'pending'>('all');
  const [activeTab, setActiveTab] = useState<'management' | 'login' | 'dashboard'>('dashboard');

  useEffect(() => {
    // Load all drivers from the integration service
    const allDrivers = onboardingIntegration.getAllDrivers();
    setDrivers(allDrivers);
  }, []);

  const uniqueCarriers = Array.from(new Set(drivers.map(d => d.employmentInfo.carrierName))).sort();

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = !searchTerm || 
      driver.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.employmentInfo.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.personalInfo.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCarrier = carrierFilter === 'all' || driver.employmentInfo.carrierName === carrierFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'activated' && driver.credentials.accountActivated) ||
      (statusFilter === 'pending' && !driver.credentials.accountActivated);
    
    return matchesSearch && matchesCarrier && matchesStatus;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
      padding: '80px 20px 20px 20px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#2d3748',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2d3748',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
          }}>
            🚛 DRIVER PORTAL WITH TAX DASHBOARD
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(45, 55, 72, 0.8)',
            margin: 0
          }}>
            Complete driver management with integrated tax filing and IFTA alerts
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px 16px 0 0',
          marginBottom: 0
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(45, 55, 72, 0.1)' }}>
            {[
              { id: 'dashboard', label: '📱 Driver Dashboard', desc: 'Driver View - Individual Dashboard with Tax Alerts' },
              { id: 'management', label: '👥 Driver Management', desc: 'Admin View - All Drivers Management' },
              { id: 'login', label: '🔑 Login Demo', desc: 'Demo Login Page' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  padding: '20px',
                  border: 'none',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #f7c52d, #f4a832)' : 'transparent',
                  borderBottom: activeTab === tab.id ? '3px solid #f7c52d' : '3px solid transparent',
                  color: activeTab === tab.id ? '#2d3748' : 'rgba(45, 55, 72, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {tab.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          padding: '32px',
          minHeight: '600px'
        }}>
          {/* Driver Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <DriverDashboardView />
          )}

          {/* Management Tab Content would go here */}
          {activeTab === 'management' && (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
              <h2 style={{ color: '#2d3748', fontSize: '1.5rem', marginBottom: '16px' }}>
                Driver Management
              </h2>
              <p style={{ color: 'rgba(45, 55, 72, 0.7)' }}>
                Driver management interface would be shown here.
              </p>
            </div>
          )}

          {/* Login Tab Content would go here */}
          {activeTab === 'login' && (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔑</div>
              <h2 style={{ color: '#2d3748', fontSize: '1.5rem', marginBottom: '16px' }}>
                Login Demo
              </h2>
              <p style={{ color: 'rgba(45, 55, 72, 0.7)' }}>
                Login demonstration interface would be shown here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
