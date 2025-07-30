'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import RealTimeTrackingDashboard from '../../components/RealTimeTrackingDashboard';
import { smsService } from '../../services/sms';

// TODO: Integrate with Carrier Setup Page
// - Carrier name, MC#, DOT# should come from FMCSA API integration
// - BrokerSnapshot integration for real-time carrier verification
// - Driver assignment and vehicle data from carrier management system

export default function DriverDashboardPage() {
  const [selectedLoadDocs, setSelectedLoadDocs] = useState<any>(null);
  const [smsLoading, setSmsLoading] = useState<string | null>(null);
  const [selectedLoadTracking, setSelectedLoadTracking] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState({
    lat: 33.7490, // Atlanta coordinates
    lng: -84.3880,
    lastUpdated: new Date().toISOString(),
    speed: 0,
    heading: 0
  });

  // Simulate real-time location updates - TEMPORARILY DISABLED TO FIX INFINITE RENDER
  // useEffect(() => {
  //   const updateLocation = () => {
  //     setDriverLocation(prev => ({
  //       lat: prev.lat + (Math.random() - 0.5) * 0.01,
  //       lng: prev.lng + (Math.random() - 0.5) * 0.01,
  //       lastUpdated: new Date().toISOString(),
  //       speed: Math.floor(Math.random() * 70 + 5), // 5-75 mph
  //       heading: Math.floor(Math.random() * 360)
  //     }));
  //   };

  //   const interval = setInterval(updateLocation, 30000); // Update every 30 seconds
  //   return () => clearInterval(interval);
  // }, []);

  // SMS notification function
  const sendSMSNotification = async (loadId: string, message: string, type: 'pickup' | 'delivery' | 'status' | 'emergency') => {
    setSmsLoading(loadId);
    try {
      const load = currentLoads.find(l => l.id === loadId);
      if (!load) return;

      // SMS to dispatch
      const dispatchRecipients = [{
        id: 'dispatch-001',
        name: 'Dispatch Center',
        phone: '+15551234567', // This would come from company settings
        type: 'broker' as const
      }];

      const loadData = {
        id: load.id,
        origin: load.pickup,
        destination: load.delivery,
        rate: '$2,450', // This would come from load data
        pickupDate: load.dueDate,
        equipment: 'Dry Van'
      };

      await smsService.sendCustomMessage(
        loadData,
        dispatchRecipients,
        `${driverInfo.name} (${driverInfo.id}): ${message} - Load ${loadId}`,
        type === 'emergency' ? 'urgent' : 'normal'
      );

      console.log('SMS notification sent successfully');
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    } finally {
      setSmsLoading(null);
    }
  };

  // Mock driver data - TODO: This should flow from carrier setup page connected to FMCSA/BrokerSnapshot
  const driverInfo = {
    name: "John Smith",
    id: "D001",
    vehicle: "Truck #247",
    status: "Available",
    carrier: "ROAD RIDERS INC",
    mcNumber: "MC-123456",
    dotNumber: "DOT-987654"
  };

  const currentLoads = [
    {
      id: "L001",
      pickup: "Chicago, IL",
      delivery: "Detroit, MI",
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      status: "In Transit",
      dueDate: "Jul 5, 2025",
      trackingEnabled: true,
      equipment: "Dry Van",
      deliveryDate: "2025-07-05T14:00:00Z",
      pickupDate: "2025-07-04T08:00:00Z",
      documents: {
        rateConfirmation: "RC-L001-2025.pdf",
        billOfLading: "BOL-L001-2025.pdf",
        loadSheet: "LS-L001-2025.pdf"
      }
    },
    {
      id: "L002",
      pickup: "Detroit, MI",
      delivery: "Cleveland, OH",
      origin: "Detroit, MI",
      destination: "Cleveland, OH",
      status: "Assigned",
      dueDate: "Jul 6, 2025",
      trackingEnabled: true,
      equipment: "Reefer",
      deliveryDate: "2025-07-06T16:00:00Z",
      pickupDate: "2025-07-06T08:00:00Z",
      documents: {
        rateConfirmation: "RC-L002-2025.pdf",
        billOfLading: "BOL-L002-2025.pdf",
        loadSheet: "LS-L002-2025.pdf"
      }
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.7)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
      paddingTop: '80px',
      position: 'relative'
    }}>
      {/* Black Road Lines */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.1,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.1,
        zIndex: 1
      }}></div>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          padding: '24px',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#2d3748',
            margin: '0 0 8px 0',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
          }}>
            Welcome back to {driverInfo.carrier}! 🚛
          </h1>
          <p style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#4a5568',
            margin: '0 0 8px 0'
          }}>
            Driver: {driverInfo.name}
          </p>
          <p style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#6b7280',
            margin: '0 0 16px 0'
          }}>
            {driverInfo.mcNumber} • {driverInfo.dotNumber} • DOT Authorized Carrier
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginTop: '16px' }}>
            <div><strong>Driver ID:</strong> {driverInfo.id}</div>
            <div><strong>Vehicle:</strong> {driverInfo.vehicle}</div>
            <div><strong>Status:</strong> <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{driverInfo.status}</span></div>
          </div>
        </div>



        {/* Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0 0 20px 20px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          padding: '32px',
          minHeight: '500px',
          position: 'relative',
          zIndex: 2
        }}>
          <div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Dashboard Overview
              </h2>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>2</div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>Active Loads</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>450</div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>Miles to Go</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>32</div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>Hours This Week</div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>�</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>$2,450</div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>Earnings (Week)</div>
                </div>
              </div>

              {/* Current Loads */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', margin: '0 0 16px 0' }}>
                  Current Loads
                </h3>
                {currentLoads.map((load) => (
                  <div key={load.id} style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#2d3748' }}>Load {load.id}</div>
                      <div style={{ fontSize: '14px', color: '#4a5568' }}>
                        {load.pickup} → {load.delivery}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        background: load.status === 'In Transit' ? '#22c55e' : '#f59e0b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {load.status}
                      </div>
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>Due: {load.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>


            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                My Loads
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px', marginBottom: '24px' }}>
                View and manage your assigned loads, update delivery status, and track progress.
              </p>

              <div style={{ display: 'grid', gap: '16px' }}>
                {currentLoads.map((load) => (
                  <div key={load.id} style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748', margin: '0 0 8px 0' }}>
                          Load {load.id}
                        </h3>
                        <div style={{ fontSize: '16px', color: '#4a5568', marginBottom: '8px' }}>
                          <strong>Route:</strong> {load.pickup} → {load.delivery}
                        </div>
                        <div style={{ fontSize: '14px', color: '#4a5568' }}>
                          <strong>Due Date:</strong> {load.dueDate}
                        </div>
                      </div>
                      <div style={{
                        background: load.status === 'In Transit' ? '#22c55e' : '#f59e0b',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {load.status}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        View Details
                      </button>
                      <button
                        onClick={() => setSelectedLoadTracking(load)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        📍 Live Tracking
                      </button>
                      <button
                        onClick={() => sendSMSNotification(load.id, `Arrived at pickup location for ${load.pickup}`, 'pickup')}
                        disabled={smsLoading === load.id}
                        style={{
                          background: '#22c55e',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          opacity: smsLoading === load.id ? 0.7 : 1
                        }}
                      >
                        {smsLoading === load.id ? '📱 Sending...' : '📱 Notify Pickup'}
                      </button>
                      <button
                        onClick={() => sendSMSNotification(load.id, `Load ${load.id} delivered successfully to ${load.delivery}`, 'delivery')}
                        disabled={smsLoading === load.id}
                        style={{
                          background: '#8b5cf6',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          opacity: smsLoading === load.id ? 0.7 : 1
                        }}
                      >
                        {smsLoading === load.id ? '📱 Sending...' : '📱 Notify Delivery'}
                      </button>
                      <button style={{
                        background: '#6366f1',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        Navigation
                      </button>
                      <button
                        onClick={() => setSelectedLoadDocs(load)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        📄 View Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>

          {activeTab === 'routes' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Routes & Navigation
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
                  Interactive Route Map
                </h3>
                <p style={{ color: '#4a5568', fontSize: '16px', marginBottom: '24px' }}>
                  View your optimized routes, real-time traffic updates, and GPS navigation for all assigned loads.
                </p>
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Open Route Map
                </button>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                My Documents
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {[
                  { name: 'Commercial Driver License', status: 'Valid', expires: 'Dec 2025' },
                  { name: 'DOT Medical Certificate', status: 'Valid', expires: 'Aug 2025' },
                  { name: 'Hazmat Certification', status: 'Expires Soon', expires: 'Jul 2025' },
                  { name: 'Vehicle Inspection Report', status: 'Current', expires: 'Sep 2025' }
                ].map((doc, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>📄</div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: '0 0 8px 0' }}>
                      {doc.name}
                    </h3>
                    <div style={{
                      color: doc.status === 'Expires Soon' ? '#f59e0b' : '#22c55e',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {doc.status}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4a5568' }}>
                      Expires: {doc.expires}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timesheet' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Revenue
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '16px' }}>
                  This Week's Revenue Summary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>$2,450</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>Gross Revenue</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>$2,100</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>Net Revenue</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>1,250</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>Miles Driven</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>$1.96</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>Per Mile Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicle' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                My Vehicle - {driverInfo.vehicle}
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
                      Vehicle Status
                    </h3>
                    <div style={{ fontSize: '14px', color: '#22c55e', marginBottom: '8px' }}>✅ Operational</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>Last Inspection: Jun 28, 2025</div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
                      Maintenance
                    </h3>
                    <div style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '8px' }}>⚠️ Oil Change Due</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>Next Service: Jul 15, 2025</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                  Messages & SMS
                </h2>
                <button
                  onClick={() => sendSMSNotification('EMERGENCY', 'EMERGENCY: Driver needs immediate assistance!', 'emergency')}
                  disabled={smsLoading === 'EMERGENCY'}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: smsLoading === 'EMERGENCY' ? 0.7 : 1
                  }}
                >
                  {smsLoading === 'EMERGENCY' ? '🚨 Sending...' : '🚨 Emergency SMS'}
                </button>
              </div>

              {/* SMS Quick Actions */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '16px' }}>
                  Quick SMS Notifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <button
                    onClick={() => sendSMSNotification('STATUS', 'Driver started shift and is available for dispatch', 'status')}
                    disabled={!!smsLoading}
                    style={{
                      background: '#22c55e',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: smsLoading ? 0.7 : 1
                    }}
                  >
                    📱 Start Shift
                  </button>
                  <button
                    onClick={() => sendSMSNotification('STATUS', 'Driver taking mandatory break - will resume in 30 minutes', 'status')}
                    disabled={!!smsLoading}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: smsLoading ? 0.7 : 1
                    }}
                  >
                    ⏸️ Break Time
                  </button>
                  <button
                    onClick={() => sendSMSNotification('STATUS', 'Driver shift completed - going off duty', 'status')}
                    disabled={!!smsLoading}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: smsLoading ? 0.7 : 1
                    }}
                  >
                    🏁 End Shift
                  </button>
                  <button
                    onClick={() => sendSMSNotification('STATUS', 'Experiencing delays - ETA updated', 'status')}
                    disabled={!!smsLoading}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      opacity: smsLoading ? 0.7 : 1
                    }}
                  >
                    ⚠️ Delay Alert
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div style={{ display: 'grid', gap: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                  Recent Messages
                </h3>
                {[
                  { from: 'Dispatch', message: 'Route updated for Load L002', time: '2 hours ago', unread: true, type: 'SMS' },
                  { from: 'Fleet Manager', message: 'DOT inspection scheduled for next week', time: '1 day ago', unread: false, type: 'Email' },
                  { from: 'HR Department', message: 'Payroll processed successfully', time: '2 days ago', unread: false, type: 'App' },
                  { from: 'Dispatch', message: 'New load available: ATL → MIA, $2,500', time: '3 days ago', unread: false, type: 'SMS' }
                ].map((msg, index) => (
                  <div key={index} style={{
                    background: msg.unread ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: msg.unread ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>{msg.from}</span>
                        <span style={{
                          background: msg.type === 'SMS' ? '#22c55e' : msg.type === 'Email' ? '#3b82f6' : '#6b7280',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          {msg.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>{msg.time}</div>
                    </div>
                    <div style={{ color: '#4a5568' }}>{msg.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                My Profile
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
                      Personal Information
                    </h3>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Name:</strong> {driverInfo.name}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Driver ID:</strong> {driverInfo.id}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Phone:</strong> (555) 123-4567
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Email:</strong> john.smith@roadriders.com
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
                      Carrier Information
                    </h3>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Carrier:</strong> {driverInfo.carrier}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>MC Number:</strong> {driverInfo.mcNumber}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>DOT Number:</strong> {driverInfo.dotNumber}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>DOT Status:</strong> <span style={{ color: '#22c55e' }}>Active</span>
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>FMCSA Rating:</strong> Satisfactory
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
                      Emergency Contact
                    </h3>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Name:</strong> Jane Smith
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Relationship:</strong> Spouse
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      <strong>Phone:</strong> (555) 123-4568
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Modal */}
        {selectedLoadDocs && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
                  Documents for Load {selectedLoadDocs.id}
                </h3>
                <button
                  onClick={() => setSelectedLoadDocs(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '16px', color: '#4a5568' }}>
                <strong>Route:</strong> {selectedLoadDocs.pickup} → {selectedLoadDocs.delivery}
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                      📄 Rate Confirmation
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedLoadDocs.documents.rateConfirmation}
                    </div>
                  </div>
                  <button style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Download
                  </button>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                      📋 Bill of Lading
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedLoadDocs.documents.billOfLading}
                    </div>
                  </div>
                  <button style={{
                    background: '#22c55e',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Download
                  </button>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                      📊 Load Sheet
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedLoadDocs.documents.loadSheet}
                    </div>
                  </div>
                  <button style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Download
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => setSelectedLoadDocs(null)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Tracking Modal */}
        {selectedLoadTracking && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '95vw',
              width: '1200px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <RealTimeTrackingDashboard
                load={selectedLoadTracking}
                isModal={true}
                onClose={() => setSelectedLoadTracking(null)}
              />
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/drivers/portal" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(220, 38, 38, 0.8)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Logout
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
