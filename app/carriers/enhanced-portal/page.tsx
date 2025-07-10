'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { onboardingIntegration, CarrierPortalProfile } from '../services/onboarding-integration';
import { checkPermission } from '../config/access';

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
        You need carrier portal management permissions to access this system.
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

const CarrierCard: React.FC<{ carrier: CarrierPortalProfile; onClick: () => void }> = ({ carrier, onClick }) => {
  const getStatusColor = (status: CarrierPortalProfile['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'suspended': return '#f59e0b';
      case 'under_review': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: CarrierPortalProfile['status']) => {
    switch (status) {
      case 'active': return '✅';
      case 'suspended': return '⚠️';
      case 'under_review': return '🔍';
      default: return '❓';
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%'
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.3rem', 
            fontWeight: 'bold', 
            margin: 0, 
            marginBottom: '4px' 
          }}>
            {carrier.companyInfo.legalName}
          </h3>
          {carrier.companyInfo.dbaName && (
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.9rem', 
              margin: 0, 
              marginBottom: '8px' 
            }}>
              DBA: {carrier.companyInfo.dbaName}
            </p>
          )}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.8)' 
          }}>
            <span>DOT: {carrier.companyInfo.dotNumber}</span>
            <span>MC: {carrier.companyInfo.mcNumber}</span>
          </div>
        </div>
        <span style={{
          background: getStatusColor(carrier.status),
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textTransform: 'capitalize',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {getStatusIcon(carrier.status)} {carrier.status.replace('_', ' ')}
        </span>
      </div>

      {/* Performance Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        marginBottom: '16px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {carrier.performance.totalLoads}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>Total Loads</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {carrier.performance.onTimeDelivery}%
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>On Time</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {carrier.performance.avgRating}⭐
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>Rating</div>
        </div>
      </div>

      {/* Equipment Types */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem', marginBottom: '8px' }}>
          Equipment: {carrier.companyInfo.equipmentTypes.join(', ') || 'Not specified'}
        </div>
      </div>

      {/* Portal Status */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{
          color: carrier.portalAccess.enabled ? '#10b981' : '#f59e0b',
          fontSize: '1.2rem'
        }}>
          {carrier.portalAccess.enabled ? '✅' : '⏳'}
        </div>
        <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
          Portal: {carrier.portalAccess.enabled ? 'Active' : 'Inactive'} 
          ({carrier.portalAccess.users.length} users)
        </span>
      </div>
    </div>
  );
};

export default function EnhancedCarrierPortal() {
  // Check access permission
  if (!checkPermission('canManageCarrierPortal')) {
    return <AccessRestricted />;
  }

  const [carriers, setCarriers] = useState<CarrierPortalProfile[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierPortalProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'under_review'>('all');

  useEffect(() => {
    // Load all carriers from the integration service
    const allCarriers = onboardingIntegration.getAllCarriers();
    setCarriers(allCarriers);
  }, []);

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = !searchTerm || 
      carrier.companyInfo.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.companyInfo.mcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.companyInfo.dotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || carrier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCarrierClick = (carrier: CarrierPortalProfile) => {
    setSelectedCarrier(carrier);
  };

  const handleCloseDetails = () => {
    setSelectedCarrier(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #059669, #047857, #0f766e)',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
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
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚚 ENHANCED CARRIER PORTAL
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Manage onboarded carriers and their portal access
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          {[
            { label: 'Total Carriers', value: carriers.length, color: '#3b82f6' },
            { label: 'Active', value: carriers.filter(c => c.status === 'active').length, color: '#10b981' },
            { label: 'Under Review', value: carriers.filter(c => c.status === 'under_review').length, color: '#f59e0b' },
            { label: 'Portal Enabled', value: carriers.filter(c => c.portalAccess.enabled).length, color: '#8b5cf6' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: stat.color,
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by company name, MC, or DOT number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '300px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="under_review">Under Review</option>
            </select>
            <Link href="/onboarding/carrier-onboarding/new">
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ➕ Add New Carrier
              </button>
            </Link>
          </div>
        </div>

        {/* Carriers Grid */}
        {filteredCarriers.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>
              No Carriers Found
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
              {carriers.length === 0 
                ? "No carriers have been onboarded yet. Start by adding a new carrier through the onboarding process."
                : "No carriers match your current search criteria."
              }
            </p>
            {carriers.length === 0 && (
              <Link href="/onboarding/carrier-onboarding/new">
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  🚛 Start Carrier Onboarding
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {filteredCarriers.map((carrier) => (
              <CarrierCard
                key={carrier.carrierId}
                carrier={carrier}
                onClick={() => handleCarrierClick(carrier)}
              />
            ))}
          </div>
        )}

        {/* Carrier Details Modal */}
        {selectedCarrier && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {selectedCarrier.companyInfo.legalName}
                </h2>
                <button
                  onClick={handleCloseDetails}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Carrier Details Content */}
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <h3 style={{ color: '#374151', marginBottom: '12px' }}>Company Information</h3>
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <p><strong>Legal Name:</strong> {selectedCarrier.companyInfo.legalName}</p>
                    {selectedCarrier.companyInfo.dbaName && (
                      <p><strong>DBA:</strong> {selectedCarrier.companyInfo.dbaName}</p>
                    )}
                    <p><strong>MC Number:</strong> {selectedCarrier.companyInfo.mcNumber}</p>
                    <p><strong>DOT Number:</strong> {selectedCarrier.companyInfo.dotNumber}</p>
                    <p><strong>Phone:</strong> {selectedCarrier.companyInfo.phone}</p>
                    <p><strong>Email:</strong> {selectedCarrier.companyInfo.email}</p>
                    <p><strong>Address:</strong> {selectedCarrier.companyInfo.physicalAddress}</p>
                    <p><strong>Safety Rating:</strong> {selectedCarrier.companyInfo.safetyRating}</p>
                    <p><strong>Equipment:</strong> {selectedCarrier.companyInfo.equipmentTypes.join(', ')}</p>
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#374151', marginBottom: '12px' }}>Portal Access</h3>
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                    <p><strong>Status:</strong> {selectedCarrier.portalAccess.enabled ? '✅ Enabled' : '❌ Disabled'}</p>
                    <p><strong>Users:</strong> {selectedCarrier.portalAccess.users.length}</p>
                    {selectedCarrier.portalAccess.users.map((user, index) => (
                      <div key={index} style={{ marginLeft: '20px', fontSize: '0.85rem', color: '#6b7280' }}>
                        • {user.name} ({user.email}) - {user.role}
                        {user.lastLogin && <span> - Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#374151', marginBottom: '12px' }}>Performance</h3>
                  <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                    <p><strong>Total Loads:</strong> {selectedCarrier.performance.totalLoads}</p>
                    <p><strong>On-Time Delivery:</strong> {selectedCarrier.performance.onTimeDelivery}%</p>
                    <p><strong>Average Rating:</strong> {selectedCarrier.performance.avgRating}⭐</p>
                    {selectedCarrier.performance.lastLoadDate && (
                      <p><strong>Last Load:</strong> {new Date(selectedCarrier.performance.lastLoadDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
