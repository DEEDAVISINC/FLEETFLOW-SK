'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import DashboardView from '../components/DashboardView';
import DocumentManagementPanel from '../components/DocumentManagementPanel';
import FreightForwarderDashboardGuide from '../components/FreightForwarderDashboardGuide';
import NotificationPanel from '../components/NotificationPanel';
import ReportsPanel from '../components/ReportsPanel';
import {
  ClientShipment,
  clientPortalService,
} from '../services/ClientPortalService';
import ExportService from '../services/ExportService';

function CustomsAgentPortalContent() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [freightForwarderId, setFreightForwarderId] = useState<string | null>(
    null
  );
  const [shipments, setShipments] = useState<ClientShipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<ClientShipment[]>(
    []
  );
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const client = searchParams?.get('client');
        const ff = searchParams?.get('ff');

        // Demo mode: If no parameters, use demo data
        const demoMode = !client || !ff;
        const finalClient = client || 'CLIENT-001';
        const finalFF = ff || 'FF-001';

        setClientId(finalClient);
        setFreightForwarderId(finalFF);

        // Load shipments and stats
        const [shipmentsData, statsData] = await Promise.all([
          clientPortalService.getClientShipments(finalClient, 'demo-user'),
          clientPortalService.getClientDashboardStats(finalClient),
        ]);

        setShipments(shipmentsData);
        setFilteredShipments(shipmentsData);
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading portal data:', err);
        setError('Failed to load portal data. Please try again later.');
        setLoading(false);
      }
    };

    loadPortalData();
  }, [searchParams]);

  useEffect(() => {
    // Filter shipments based on search query and status
    let filtered = shipments;

    if (searchQuery) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.shipmentNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.destination
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shipment.cargoDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (shipment) => shipment.status === statusFilter
      );
    }

    setFilteredShipments(filtered);
  }, [searchQuery, statusFilter, shipments]);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'spin 2s linear infinite',
            }}
          >
            🚢
          </div>
          <div style={{ fontSize: '18px' }}>Loading portal...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: 'white',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ margin: '0 0 16px 0', color: '#f87171' }}>
            Access Error
          </h2>
          <p style={{ margin: '0', color: 'rgba(255,255,255,0.8)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '30px',
        paddingTop: '100px',
        color: 'white',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Dashboard Guide */}
      <FreightForwarderDashboardGuide onStepClick={handleTabClick} />

      {/* Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background:
              'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🚢
          </div>
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '800',
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Customs Agent Portal
            </h1>
            <p style={{ margin: '0', color: 'rgba(255,255,255,0.8)' }}>
              Client ID: {clientId}
            </p>
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
            <p style={{ margin: '0 0 4px 0', color: 'rgba(255,255,255,0.7)' }}>
              Welcome back, Customs Agent
            </p>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Freight Forwarder: {freightForwarderId}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{ fontSize: '18px', fontWeight: '600', color: '#06b6d4' }}
            >
              Customs Agent
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Portal Access Level
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(6, 182, 212, 0.2)',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Total Shipments
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#06b6d4',
                margin: '8px 0',
              }}
            >
              {stats.totalShipments}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Active Shipments
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#22c55e',
                margin: '8px 0',
              }}
            >
              {stats.activeShipments}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(234, 88, 12, 0.2)',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Pending Documents
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ea580c',
                margin: '8px 0',
              }}
            >
              {stats.pendingDocuments}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              On-Time Delivery
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#8b5cf6',
                margin: '8px 0',
              }}
            >
              {stats.onTimeDelivery}%
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: '🏠 Dashboard', color: '#06b6d4' },
            { id: 'shipments', label: '📦 Shipments', color: '#059669' },
            { id: 'documents', label: '📄 Documents', color: '#dc2626' },
            { id: 'communication', label: '💬 Messages', color: '#7c3aed' },
            { id: 'reports', label: '📊 Reports', color: '#ea580c' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '14px 20px',
                border: 'none',
                background:
                  selectedTab === tab.id
                    ? tab.color
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'all 0.2s',
                boxShadow:
                  selectedTab === tab.id ? `0 0 20px ${tab.color}40` : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          minHeight: '600px',
        }}
      >
        {selectedTab === 'shipments' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0',
                  color: '#06b6d4',
                }}
              >
                Your Shipments
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() =>
                    ExportService.exportShipmentsToCSV(filteredShipments)
                  }
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📊 Export to Excel
                </button>
                <button
                  onClick={() =>
                    ExportService.exportShipmentsToPDF(filteredShipments)
                  }
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📄 Export to PDF
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              <input
                type='text'
                placeholder='🔍 Search by shipment #, origin, destination, or cargo...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  'ALL',
                  'IN_TRANSIT',
                  'AT_PORT',
                  'CUSTOMS_CLEARANCE',
                  'DELIVERED',
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    style={{
                      padding: '8px 16px',
                      background:
                        statusFilter === status
                          ? 'rgba(6, 182, 212, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                      border:
                        statusFilter === status
                          ? '1px solid #06b6d4'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color:
                        statusFilter === status
                          ? '#06b6d4'
                          : 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: statusFilter === status ? '600' : '400',
                    }}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredShipments.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0' }}>
                  No shipments found matching your criteria
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredShipments.map((shipment) => (
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
                        alignItems: 'start',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {shipment.shipmentNumber}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.6)',
                          }}
                        >
                          {shipment.origin} → {shipment.destination}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {shipment.status}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {shipment.cargoDescription}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '12px',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <div>
                        ETD: {new Date(shipment.etd).toLocaleDateString()}
                      </div>
                      <div>
                        ETA: {new Date(shipment.eta).toLocaleDateString()}
                      </div>
                      <div>
                        Value: {shipment.currency}{' '}
                        {shipment.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'dashboard' && stats && (
          <DashboardView stats={stats} onNavigate={setSelectedTab} />
        )}

        {selectedTab === 'documents' && clientId && (
          <DocumentManagementPanel
            clientId={clientId}
            userId='demo-user'
            userRole='CLIENT_AGENT'
          />
        )}

        {selectedTab === 'communication' && (
          <NotificationPanel userId='demo-user' />
        )}

        {selectedTab === 'reports' && clientId && (
          <ReportsPanel clientId={clientId} userRole='CLIENT_AGENT' />
        )}
      </div>
    </div>
  );
}

export default function CustomsAgentPortalPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Loading...
        </div>
      }
    >
      <CustomsAgentPortalContent />
    </Suspense>
  );
}
