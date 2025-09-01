'use client';

import Link from 'next/link';
import { useState } from 'react';
import PhotoUploadComponent from '../../../components/PhotoUploadComponent';
import SignaturePad from '../../../components/SignaturePad';
import { photoUploadService } from '../../../lib/photoUploadService';
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
  const [selectedLoadPhotos, setSelectedLoadPhotos] = useState<any>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [driverLocation, setDriverLocation] = useState({
    lat: 33.749, // Atlanta coordinates
    lng: -84.388,
    lastUpdated: new Date().toISOString(),
    speed: 0,
    heading: 0,
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
  const sendSMSNotification = async (
    loadId: string,
    message: string,
    type: 'pickup' | 'delivery' | 'status' | 'emergency'
  ) => {
    setSmsLoading(loadId);
    try {
      const load = currentLoads.find((l) => l.id === loadId);
      if (!load) return;

      // SMS to dispatch
      const dispatchRecipients = [
        {
          id: 'dispatch-001',
          name: 'Dispatch Center',
          phone: '+15551234567', // This would come from company settings
          type: 'broker' as const,
        },
      ];

      const loadData = {
        id: load.id,
        origin: load.pickup,
        destination: load.delivery,
        rate: '$2,450', // This would come from load data
        pickupDate: load.dueDate,
        equipment: 'Dry Van',
      };

      await smsService.sendCustomMessage(
        loadData,
        dispatchRecipients,
        `${driverInfo.name} (${driverInfo.id}): ${message} - Load ${loadId}`,
        type === 'emergency' ? 'urgent' : 'normal'
      );

      console.info('SMS notification sent successfully');
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    } finally {
      setSmsLoading(null);
    }
  };

  // Photo upload function
  const uploadLoadPhoto = async (
    file: File,
    loadId: string,
    category: 'pickup' | 'delivery' | 'confirmation' | 'inspection'
  ) => {
    try {
      const result = await photoUploadService.uploadFile(file, {
        category,
        driverId: driverInfo.id,
        loadId,
        onProgress: (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [`${loadId}_${file.name}`]: progress.percentage,
          }));
        },
      });

      console.info('Photo uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to upload photo:', error);
      throw error;
    }
  };

  // Mock driver data - TODO: This should flow from carrier setup page connected to FMCSA/BrokerSnapshot
  const driverInfo = {
    name: 'John Smith',
    id: 'D001',
    vehicle: 'Truck #247',
    status: 'Available',
    carrier: 'ROAD RIDERS INC',
    mcNumber: 'MC-123456',
    dotNumber: 'DOT-987654',
  };

  const currentLoads = [
    {
      id: 'L001',
      pickup: 'Chicago, IL',
      delivery: 'Detroit, MI',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      status: 'In Transit',
      dueDate: 'Jul 5, 2025',
      trackingEnabled: true,
      equipment: 'Dry Van',
      deliveryDate: '2025-07-05T14:00:00Z',
      pickupDate: '2025-07-04T08:00:00Z',
      documents: {
        rateConfirmation: 'RC-L001-2025.pdf',
        billOfLading: 'BOL-L001-2025.pdf',
        loadSheet: 'LS-L001-2025.pdf',
      },
    },
    {
      id: 'L002',
      pickup: 'Detroit, MI',
      delivery: 'Cleveland, OH',
      origin: 'Detroit, MI',
      destination: 'Cleveland, OH',
      status: 'Assigned',
      dueDate: 'Jul 6, 2025',
      trackingEnabled: true,
      equipment: 'Reefer',
      deliveryDate: '2025-07-06T16:00:00Z',
      pickupDate: '2025-07-06T08:00:00Z',
      documents: {
        rateConfirmation: 'RC-L002-2025.pdf',
        billOfLading: 'BOL-L002-2025.pdf',
        loadSheet: 'LS-L002-2025.pdf',
      },
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.7)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Black Road Lines */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
          opacity: 0.1,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
          opacity: 0.1,
          zIndex: 1,
        }}
      />

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            padding: '24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#2d3748',
              margin: '0 0 8px 0',
              textShadow: '2px 2px 4px rgba(255,255,255,0.5)',
            }}
          >
            Welcome back to {driverInfo.carrier}! 🚛
          </h1>
          <p
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#4a5568',
              margin: '0 0 8px 0',
            }}
          >
            Driver: {driverInfo.name}
          </p>
          <p
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#6b7280',
              margin: '0 0 16px 0',
            }}
          >
            {driverInfo.mcNumber} • {driverInfo.dotNumber} • DOT Authorized
            Carrier
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              marginTop: '16px',
            }}
          >
            <div>
              <strong>Driver ID:</strong> {driverInfo.id}
            </div>
            <div>
              <strong>Vehicle:</strong> {driverInfo.vehicle}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                {driverInfo.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Driver Loads */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            padding: '32px',
            minHeight: '500px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 24px 0',
              }}
            >
              My Assigned Loads
            </h2>
            <p
              style={{
                color: '#4a5568',
                fontSize: '16px',
                marginBottom: '24px',
              }}
            >
              View and manage your assigned loads, track live location, send
              notifications, and access documents.
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
              {currentLoads.map((load) => (
                <div
                  key={load.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#2d3748',
                          margin: '0 0 8px 0',
                        }}
                      >
                        Load {load.id}
                      </h3>
                      <div
                        style={{
                          fontSize: '16px',
                          color: '#4a5568',
                          marginBottom: '8px',
                        }}
                      >
                        <strong>Route:</strong> {load.pickup} → {load.delivery}
                      </div>
                      <div style={{ fontSize: '14px', color: '#4a5568' }}>
                        <strong>Due Date:</strong> {load.dueDate}
                      </div>
                    </div>
                    <div
                      style={{
                        background:
                          load.status === 'In Transit' ? '#22c55e' : '#f59e0b',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {load.status}
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                  >
                    <button
                      onClick={() => setSelectedLoadTracking(load)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      📍 Live Tracking
                    </button>
                    <button
                      onClick={() => setSelectedLoadPhotos(load)}
                      style={{
                        background: '#8b5cf6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      📸 Upload Photos
                    </button>
                    <button
                      onClick={() =>
                        sendSMSNotification(
                          load.id,
                          `Arrived at pickup location for ${load.pickup}`,
                          'pickup'
                        )
                      }
                      disabled={smsLoading === load.id}
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        opacity: smsLoading === load.id ? 0.7 : 1,
                      }}
                    >
                      {smsLoading === load.id
                        ? '⏳ Sending...'
                        : '📱 Notify Pickup'}
                    </button>
                    <button
                      onClick={() =>
                        sendSMSNotification(
                          load.id,
                          `Delivered load at ${load.delivery}`,
                          'delivery'
                        )
                      }
                      disabled={smsLoading === load.id}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        opacity: smsLoading === load.id ? 0.7 : 1,
                      }}
                    >
                      {smsLoading === load.id
                        ? '⏳ Sending...'
                        : '🚚 Notify Delivery'}
                    </button>
                    <button
                      onClick={() => setSelectedLoadDocs(load)}
                      style={{
                        background: '#6366f1',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      📄 Documents
                    </button>
                    <button
                      onClick={() =>
                        sendSMSNotification(
                          load.id,
                          `Emergency: Need immediate assistance with load ${load.id}`,
                          'emergency'
                        )
                      }
                      disabled={smsLoading === load.id}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        opacity: smsLoading === load.id ? 0.7 : 1,
                      }}
                    >
                      {smsLoading === load.id
                        ? '⏳ Sending...'
                        : '🚨 Emergency'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documents Modal */}
        {selectedLoadDocs && (
          <div
            style={{
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
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2d3748',
                    margin: 0,
                  }}
                >
                  Documents for Load {selectedLoadDocs.id}
                </h3>
                <button
                  onClick={() => setSelectedLoadDocs(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '16px', color: '#4a5568' }}>
                <strong>Route:</strong> {selectedLoadDocs.pickup} →{' '}
                {selectedLoadDocs.delivery}
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#2d3748',
                        marginBottom: '4px',
                      }}
                    >
                      📄 Rate Confirmation
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedLoadDocs.documents.rateConfirmation}
                    </div>
                  </div>
                  <button
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Download
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#2d3748',
                        marginBottom: '4px',
                      }}
                    >
                      📋 Bill of Lading
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedLoadDocs.documents.billOfLading}
                    </div>
                  </div>
                  <button
                    style={{
                      background: '#22c55e',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Download
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#2d3748',
                        marginBottom: '4px',
                      }}
                    >
                      📊 Load Sheet
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedLoadDocs.documents.loadSheet}
                    </div>
                  </div>
                  <button
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
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
                    cursor: 'pointer',
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
          <div
            style={{
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
              padding: '20px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '95vw',
                width: '1200px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
              }}
            >
              <RealTimeTrackingDashboard
                load={selectedLoadTracking}
                isModal={true}
                onClose={() => setSelectedLoadTracking(null)}
              />
            </div>
          </div>
        )}

        {/* Photo Upload Modal */}
        {selectedLoadPhotos && (
          <div
            style={{
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
              padding: '20px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '90vw',
                width: '800px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                padding: '32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2d3748',
                    margin: 0,
                  }}
                >
                  📸 Upload Photos for Load {selectedLoadPhotos.id}
                </h3>
                <button
                  onClick={() => setSelectedLoadPhotos(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '16px', color: '#4a5568' }}>
                <strong>Route:</strong> {selectedLoadPhotos.pickup} →{' '}
                {selectedLoadPhotos.delivery}
              </div>

              {/* Photo Categories */}
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Pickup Photos */}
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#15803d',
                      marginBottom: '12px',
                    }}
                  >
                    📦 Pickup Photos
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#4a5568',
                      marginBottom: '16px',
                    }}
                  >
                    Upload photos of cargo being loaded, BOL, seal numbers, etc.
                  </p>
                  <PhotoUploadComponent
                    category='pickup'
                    driverId={driverInfo.id}
                    loadId={selectedLoadPhotos.id}
                    maxFiles={10}
                    title='Upload Pickup Photos'
                    description='Take photos during pickup'
                    onUploadComplete={(urls) => {
                      console.info('Pickup photos uploaded:', urls);
                      // You can update load data here
                    }}
                  />
                </div>

                {/* Delivery Photos */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1d4ed8',
                      marginBottom: '12px',
                    }}
                  >
                    🚚 Delivery Photos
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#4a5568',
                      marginBottom: '16px',
                    }}
                  >
                    Upload photos of delivery completion, unloading, receiver
                    signature, etc.
                  </p>
                  <PhotoUploadComponent
                    category='delivery'
                    driverId={driverInfo.id}
                    loadId={selectedLoadPhotos.id}
                    maxFiles={10}
                    title='Upload Delivery Photos'
                    description='Take photos during delivery'
                    onUploadComplete={(urls) => {
                      console.info('Delivery photos uploaded:', urls);
                      // You can update load data here
                    }}
                  />
                </div>

                {/* Inspection Photos */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#d97706',
                      marginBottom: '12px',
                    }}
                  >
                    🔍 Inspection Photos
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#4a5568',
                      marginBottom: '16px',
                    }}
                  >
                    Upload photos of vehicle inspection, damage reports, etc.
                  </p>
                  <PhotoUploadComponent
                    category='inspection'
                    driverId={driverInfo.id}
                    loadId={selectedLoadPhotos.id}
                    maxFiles={10}
                    title='Upload Inspection Photos'
                    description='Document vehicle and cargo inspection'
                    onUploadComplete={(urls) => {
                      console.info('Inspection photos uploaded:', urls);
                      // You can update load data here
                    }}
                  />
                </div>

                {/* Digital Signature */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#7c3aed',
                      marginBottom: '12px',
                    }}
                  >
                    ✍️ Digital Signature
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#4a5568',
                      marginBottom: '16px',
                    }}
                  >
                    Capture receiver signature for delivery confirmation
                  </p>
                  <SignaturePad
                    onSignatureChange={(signature) => {
                      console.info('Signature captured:', signature);
                      // You can save signature here
                    }}
                    placeholder='Receiver signature'
                    width={350}
                    height={120}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={() => setSelectedLoadPhotos(null)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href='/drivers/portal' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(220, 38, 38, 0.8)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
