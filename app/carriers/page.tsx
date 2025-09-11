'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { getLoadsForCarrierPortal, Load } from '../services/loadService';

// Define the Load type inline for now
interface Load {
  id: string;
  brokerId: string;
  brokerName: string;
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  status: string;
  pickupDate: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  loadBoardNumber?: string; // Added for phone communication
}

export default function CarrierPortal() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/carrier-loads');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('API did not return an array');
        }

        setLoads(data);
        setError(null);
      } catch (err) {
        setLoads([]);
        setError('Failed to load carrier loads. Please try again later.');
        console.error('Carrier portal fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoads();
  }, []);

  // Filter loads based on search
  const filteredLoads = loads.filter((load) => {
    return (
      !searchTerm ||
      load.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.equipment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleGenerateRateConfirmation = (load: Load) => {
    // Store load data in localStorage for auto-population
    const documentData = {
      id: `rate-confirmation-${load.id}-${Date.now()}`,
      type: 'rate-confirmation',
      loadId: load.id,
      data: {
        ...load,
        carrierName: 'Your Company', // This would come from user profile in production
        pickupDate: load.pickupDate || new Date().toLocaleDateString(),
        deliveryDate:
          load.deliveryDate ||
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      },
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(documentData);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Open documents page with rate confirmation tab
    window.open(`/documents?loadId=${load.id}&tab=rate-confirmation`, '_blank');
  };

  const handleGenerateBOL = (load: Load) => {
    // Store load data in localStorage for auto-population
    const documentData = {
      id: `bill-of-lading-${load.id}-${Date.now()}`,
      type: 'bill-of-lading',
      loadId: load.id,
      data: {
        ...load,
        weight: load.weight || '40,000 lbs',
        equipment: load.equipment || 'Dry Van',
        pickupDate: load.pickupDate || new Date().toLocaleDateString(),
        deliveryDate:
          load.deliveryDate ||
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      },
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(documentData);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Open documents page with bill of lading tab
    window.open(`/documents?loadId=${load.id}&tab=bill-of-lading`, '_blank');
  };

  const handleBidOnLoad = (load: Load) => {
    alert(
      `Bid feature coming soon for load ${load.id}! This will allow carriers to submit competitive bids.`
    );
  };

  const getStatusColor = (status: Load['status']) => {
    switch (status) {
      case 'Available':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Assigned':
        return { bg: '#fef3c7', text: '#a16207' };
      case 'In Transit':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'Delivered':
        return { bg: '#f3f4f6', text: '#374151' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #059669, #047857, #0f766e)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}
      {/* Back Button */}
      <div
        style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}
      >
        <Link
          href='/'
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header and Compliance Widget Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Main Header */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 12px 0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              🚚 CARRIER PORTAL
            </h1>
            <p
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 8px 0',
              }}
            >
              Available Loads & Freight Opportunities - Book High-Paying Loads
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(139, 92, 246, 0.9)',
                margin: 0,
                fontWeight: '600',
              }}
            >
              🛡️ Enhanced with FACIS™ Carrier Intelligence & Verification
            </p>
          </div>

          {/* Compliance Widget */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Link
              href='/carriers/compliance'
              style={{ textDecoration: 'none', height: '100%' }}
            >
              <div
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  padding: '16px',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: 'white',
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    🚨 DOT Compliance Status
                  </h3>
                  <div
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ACTION REQUIRED
                  </div>
                </div>

                <div style={{ color: 'white', marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        Compliance Score
                      </span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        76%
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        Status
                      </span>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                        }}
                      >
                        REQUIRES ATTENTION
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: 'white',
                  }}
                >
                  <strong>🚨 Critical Issues:</strong>
                  <p style={{ margin: '4px 0 0' }}>
                    Insurance certificate expires in 15 days
                  </p>
                </div>

                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    View Full Compliance Dashboard
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      style={{ marginLeft: '4px' }}
                    >
                      <path d='M5 12h14' />
                      <path d='M12 5l7 7-7 7' />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            {
              label: 'Available Loads',
              value: filteredLoads.length,
              color: 'linear-gradient(135deg, #10b981, #059669)',
              icon: '📋',
            },
            {
              label: 'Avg Rate',
              value: `$${filteredLoads.length > 0 ? Math.round(filteredLoads.reduce((sum, load) => sum + load.rate, 0) / filteredLoads.length).toLocaleString() : '0'}`,
              color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              icon: '💰',
            },
            {
              label: 'Top Rate',
              value: `$${Math.max(...filteredLoads.map((load) => load.rate), 0).toLocaleString()}`,
              color: 'linear-gradient(135deg, #f97316, #ea580c)',
              icon: '🎯',
            },
            {
              label: 'Support',
              value: '24/7',
              color: 'linear-gradient(135deg, #a855f7, #9333ea)',
              icon: '🕐',
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div
                style={{
                  background: stat.color,
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    marginBottom: '8px',
                  }}
                >
                  {stat.icon}
                </div>
                <div>{stat.value}</div>
              </div>
              <div
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none',
              }}
            >
              <svg
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              placeholder='Search loads by ID, origin, destination, equipment, broker...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#059669';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(5, 150, 105, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            />
          </div>
        </div>

        {/* Load Board Table */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '12px',
                      height: '12px',
                      background: '#059669',
                      borderRadius: '50%',
                      animation: `bounce 1.4s ease-in-out infinite both`,
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: '#6B7280', fontSize: '16px' }}>
                Loading available loads...
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead
                  style={{
                    background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      📞 Board #
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Load ID
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Route
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Equipment
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Broker
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>
                      Status
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Pickup Date
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: 'white' }}>
                  {(() => {
                    try {
                      return filteredLoads.map((load, index) => (
                        <tr
                          key={load.id}
                          style={{
                            borderTop: index > 0 ? '1px solid #E5E7EB' : 'none',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#059669',
                              fontFamily: 'monospace',
                            }}
                          >
                            {load.loadBoardNumber || '000000'}
                          </td>
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#111827',
                            }}
                          >
                            {load.id}
                          </td>
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#111827',
                            }}
                          >
                            <div style={{ fontWeight: '600' }}>
                              {load.origin}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              {load.destination}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#111827',
                            }}
                          >
                            <span
                              style={{
                                background: '#dbeafe',
                                color: '#1e40af',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              {load.equipment}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#111827',
                            }}
                          >
                            {load.brokerName}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span
                              style={{
                                background: getStatusColor(load.status).bg,
                                color: getStatusColor(load.status).text,
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}
                            >
                              {load.status}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#111827',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#059669',
                                fontSize: '18px',
                              }}
                            >
                              ${load.rate?.toLocaleString?.() ?? load.rate}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#111827',
                            }}
                          >
                            {load.pickupDate
                              ? new Date(load.pickupDate).toLocaleDateString()
                              : ''}
                          </td>
                          <td
                            style={{ padding: '16px 24px', fontSize: '14px' }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleGenerateRateConfirmation(load)
                                }
                                style={{
                                  background:
                                    'linear-gradient(135deg, #3b82f6, #2563eb)',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform =
                                    'translateY(-1px)';
                                  e.currentTarget.style.boxShadow =
                                    '0 4px 12px rgba(59, 130, 246, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                                title='Generate Rate Confirmation'
                              >
                                📄 Rate Conf
                              </button>
                              <button
                                onClick={() => handleGenerateBOL(load)}
                                style={{
                                  background:
                                    'linear-gradient(135deg, #f59e0b, #d97706)',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform =
                                    'translateY(-1px)';
                                  e.currentTarget.style.boxShadow =
                                    '0 4px 12px rgba(245, 158, 11, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                                title='Generate Bill of Lading'
                              >
                                📋 BOL
                              </button>
                              <button
                                onClick={() => handleBidOnLoad(load)}
                                style={{
                                  background:
                                    'linear-gradient(135deg, #10b981, #059669)',
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background =
                                    'linear-gradient(135deg, #059669, #047857)';
                                  e.currentTarget.style.transform =
                                    'translateY(-1px)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background =
                                    'linear-gradient(135deg, #10b981, #059669)';
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                }}
                              >
                                Book Load
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    } catch (err) {
                      setError(
                        'A rendering error occurred. Please contact support.'
                      );
                      console.error('Carrier portal render error:', err);
                      return (
                        <tr>
                          <td
                            colSpan={8}
                            style={{
                              color: '#b91c1c',
                              textAlign: 'center',
                              padding: '24px',
                            }}
                          >
                            A rendering error occurred. Please contact support.
                          </td>
                        </tr>
                      );
                    }
                  })()}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && filteredLoads.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div
                style={{
                  color: '#6B7280',
                  fontSize: '18px',
                  marginBottom: '8px',
                }}
              >
                📭 No loads available
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                Check back later for new freight opportunities
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
