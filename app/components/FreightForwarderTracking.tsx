'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import FreightNotificationService from '../services/FreightNotificationService';
import FreightTrackingDatabase from '../services/FreightTrackingDatabase';
import VesselTrackingService, {
  VesselPosition,
} from '../services/VesselTrackingService';
import { WebSocketNotificationService } from '../services/WebSocketNotificationService';
import VesselMap from './VesselMap';

// Tracking milestone types
export interface TrackingMilestone {
  id: string;
  status: 'completed' | 'in_progress' | 'pending' | 'delayed';
  title: string;
  description: string;
  location: string;
  timestamp?: Date;
  estimatedTime?: Date;
  icon: string;
}

export interface ContainerTracking {
  shipmentId: string;
  containerNumber: string;
  sealNumber: string;
  mode: 'ocean' | 'air' | 'ground';
  currentStatus: string;
  vesselMMSI?: string;
  vesselIMO?: string;
  vesselName?: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    port?: string;
  };
  origin: { port: string; country: string };
  destination: { port: string; country: string };
  etd: Date;
  eta: Date;
  milestones: TrackingMilestone[];
  documents: {
    bol: boolean;
    invoice: boolean;
    packingList: boolean;
    customsDeclaration: boolean;
  };
}

export default function FreightForwarderTracking({
  shipmentId,
  onClose,
}: {
  shipmentId: string;
  onClose: () => void;
}) {
  const [tracking, setTracking] = useState<ContainerTracking>({
    shipmentId: 'FF-SH-2025-001',
    containerNumber: 'MSCU4567890',
    sealNumber: 'SEL-123456',
    mode: 'ocean',
    currentStatus: 'In Transit to Destination Port',
    vesselMMSI: '366999712',
    vesselIMO: 'IMO9876543',
    vesselName: 'MSC MEDITERRANEAN',
    currentLocation: {
      lat: 35.4437,
      lng: 139.638,
      address: 'Pacific Ocean - En Route',
      port: 'Approaching Long Beach',
    },
    origin: { port: 'Shanghai (CNSHA)', country: 'China' },
    destination: { port: 'Long Beach (USLGB)', country: 'USA' },
    etd: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    milestones: [
      {
        id: '1',
        status: 'completed',
        title: 'Container Picked Up',
        description: 'Container picked up from supplier warehouse',
        location: 'Shanghai, China',
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        icon: '📦',
      },
      {
        id: '2',
        status: 'completed',
        title: 'Port of Origin Arrival',
        description: 'Container arrived at Shanghai Port',
        location: 'Port of Shanghai (CNSHA)',
        timestamp: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        icon: '⚓',
      },
      {
        id: '3',
        status: 'completed',
        title: 'Loaded on Vessel',
        description: 'Container loaded on vessel',
        location: 'Port of Shanghai',
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        icon: '🚢',
      },
      {
        id: '4',
        status: 'in_progress',
        title: 'Ocean Transit (GPS Tracked)',
        description: 'Real-time vessel tracking via FREE AISStream.io',
        location: 'Pacific Ocean',
        icon: '🌊',
      },
      {
        id: '5',
        status: 'pending',
        title: 'Port Arrival',
        description: 'Arriving at Long Beach Port',
        location: 'Port of Long Beach',
        estimatedTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        icon: '⚓',
      },
      {
        id: '6',
        status: 'pending',
        title: 'Customs Clearance',
        description: 'DDP customs clearance',
        location: 'Long Beach Customs',
        estimatedTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        icon: '🏛️',
      },
      {
        id: '7',
        status: 'pending',
        title: 'Drayage (FleetFlow GPS)',
        description: 'Truck transport with FleetFlow GPS tracking',
        location: 'Los Angeles, CA',
        estimatedTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        icon: '🚛',
      },
      {
        id: '8',
        status: 'pending',
        title: 'Delivered',
        description: 'Container delivered',
        location: 'Customer Warehouse',
        estimatedTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        icon: '✅',
      },
    ],
    documents: {
      bol: true,
      invoice: true,
      packingList: true,
      customsDeclaration: false,
    },
  });

  const [liveVesselPosition, setLiveVesselPosition] =
    useState<VesselPosition | null>(null);
  const [isTrackingActive, setIsTrackingActive] = useState(false);

  useEffect(() => {
    // Start tracking this vessel
    if (tracking.vesselMMSI && tracking.mode === 'ocean') {
      console.info('🚢 Starting vessel tracking for:', tracking.vesselMMSI);

      // Initialize database persistence
      FreightTrackingDatabase.saveShipment({
        id: tracking.shipmentId,
        shipment_id: tracking.shipmentId,
        container_number: tracking.containerNumber,
        vessel_mmsi: tracking.vesselMMSI,
        vessel_imo: tracking.vesselIMO,
        vessel_name: tracking.vesselName || 'Unknown Vessel',
        mode: tracking.mode,
        service_type: 'DDP',
        origin_port: tracking.origin.port,
        origin_country: tracking.origin.country,
        destination_port: tracking.destination.port,
        destination_country: tracking.destination.country,
        current_status: tracking.currentStatus,
        etd: tracking.etd,
        eta: tracking.eta,
        fleetflow_source: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Enable notifications (would use real email/phone in production)
      FreightNotificationService.enableNotifications({
        shipmentId: tracking.shipmentId,
        customerEmail: 'customer@example.com', // Would come from booking
        customerPhone: '+1234567890', // Would come from booking
        notifyOnMilestones: true,
        notifyOnDelays: true,
        notifyOnArrival: true,
      });

      const vesselService = VesselTrackingService;
      vesselService.trackVessel(
        tracking.shipmentId,
        tracking.containerNumber,
        tracking.vesselMMSI,
        tracking.vesselIMO
      );

      // Connect to FREE AISStream
      vesselService.connectToAISStream();
      setIsTrackingActive(true);

      // Listen for position updates via WebSocket
      const wsService = WebSocketNotificationService.getInstance();
      const handlePositionUpdate = (message: any) => {
        if (
          message.type === 'vessel_position_update' &&
          message.data?.shipmentId === tracking.shipmentId
        ) {
          console.info('📍 Received vessel position update:', message.data);
          setLiveVesselPosition({
            mmsi: message.data.vessel.mmsi,
            imo: message.data.vessel.imo,
            shipName: message.data.vessel.name,
            latitude: message.data.position.lat,
            longitude: message.data.position.lng,
            speed: message.data.position.speed,
            course: 0,
            heading: message.data.position.heading,
            timestamp: message.data.position.timestamp,
          });

          // Update current location
          setTracking((prev) => ({
            ...prev,
            currentLocation: {
              ...prev.currentLocation,
              lat: message.data.position.lat,
              lng: message.data.position.lng,
              address: `At Sea - ${message.data.position.speed.toFixed(1)} knots`,
            },
          }));

          // Save tracking history to database
          FreightTrackingDatabase.saveTrackingHistory({
            shipment_id: tracking.shipmentId,
            latitude: message.data.position.lat,
            longitude: message.data.position.lng,
            speed: message.data.position.speed,
            heading: message.data.position.heading,
            source: 'ais_stream',
            timestamp: new Date(message.data.position.timestamp),
          });
        }
      };

      // Subscribe to notifications (simplified - in production use proper event listener)
      const checkInterval = setInterval(() => {
        const position = vesselService.getVesselPosition(tracking.shipmentId);
        if (position) {
          setLiveVesselPosition(position);
        }
      }, 5000); // Check every 5 seconds

      return () => {
        clearInterval(checkInterval);
        vesselService.stopTracking(tracking.shipmentId);
      };
    }
  }, [tracking.shipmentId, tracking.vesselMMSI]);

  const getStatusColor = (status: TrackingMilestone['status']) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      case 'delayed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: TrackingMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle style={{ width: '20px', height: '20px' }} />;
      case 'in_progress':
        return <Navigation style={{ width: '20px', height: '20px' }} />;
      case 'pending':
        return <Clock style={{ width: '20px', height: '20px' }} />;
      case 'delayed':
        return <AlertTriangle style={{ width: '20px', height: '20px' }} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 2000,
        overflowY: 'auto',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#1e293b',
          borderRadius: '16px',
          padding: '30px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '30px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 10px 0',
              }}
            >
              🚢 Container Tracking (FREE GPS Integration)
            </h2>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '10px',
              }}
            >
              Container: {tracking.containerNumber} | Seal:{' '}
              {tracking.sealNumber}
            </div>
            <div
              style={{
                display: 'inline-block',
                background: isTrackingActive
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(107, 114, 128, 0.2)',
                border: `1px solid ${isTrackingActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                color: isTrackingActive ? '#10b981' : '#9ca3af',
                fontWeight: '600',
              }}
            >
              {isTrackingActive
                ? '🟢 LIVE TRACKING ACTIVE'
                : '⚪ Tracking Standby'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
            Close
          </button>
        </div>

        {/* Interactive Map Visualization */}
        {liveVesselPosition && (
          <div style={{ marginBottom: '30px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '15px',
              }}
            >
              🗺️ Live Vessel Position Map
            </h3>
            <VesselMap
              position={{
                lat: liveVesselPosition.latitude,
                lng: liveVesselPosition.longitude,
                vesselName: tracking.vesselName || 'Unknown Vessel',
                speed: liveVesselPosition.speed,
                heading: liveVesselPosition.heading,
                timestamp: liveVesselPosition.timestamp,
              }}
              route={{
                origin: {
                  lat: 31.2304,
                  lng: 121.4737,
                  name: tracking.origin.port,
                },
                destination: {
                  lat: 33.7701,
                  lng: -118.1937,
                  name: tracking.destination.port,
                },
              }}
              showRoute={true}
              height='500px'
            />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
          }}
        >
          {/* Tracking Timeline */}
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              📍 Shipment Journey
            </h3>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '30px',
                  bottom: '30px',
                  width: '3px',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />

              {tracking.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  style={{
                    position: 'relative',
                    paddingLeft: '70px',
                    marginBottom: '30px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `${getStatusColor(milestone.status)}20`,
                      border: `3px solid ${getStatusColor(milestone.status)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                    }}
                  >
                    {milestone.icon}
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: `1px solid ${getStatusColor(milestone.status)}30`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                            margin: '0 0 5px 0',
                          }}
                        >
                          {milestone.title}
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                            margin: 0,
                          }}
                        >
                          {milestone.description}
                        </p>
                      </div>
                      <div style={{ color: getStatusColor(milestone.status) }}>
                        {getStatusIcon(milestone.status)}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '10px',
                      }}
                    >
                      <MapPin
                        style={{
                          width: '14px',
                          height: '14px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {milestone.location}
                      </span>
                    </div>
                    {milestone.timestamp && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: '8px',
                        }}
                      >
                        ✓ {milestone.timestamp.toLocaleString()}
                      </div>
                    )}
                    {milestone.estimatedTime && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: '8px',
                        }}
                      >
                        ⏱️ ETA: {milestone.estimatedTime.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Live Vessel Tracking */}
            {liveVesselPosition && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#34d399',
                    marginBottom: '15px',
                  }}
                >
                  🟢 LIVE Position (AISStream)
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      Coordinates:
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {liveVesselPosition.latitude.toFixed(4)}°,{' '}
                      {liveVesselPosition.longitude.toFixed(4)}°
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      Speed:
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {liveVesselPosition.speed.toFixed(1)} knots
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      Last Update:
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {new Date(
                        liveVesselPosition.timestamp
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vessel Info */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#60a5fa',
                  marginBottom: '15px',
                }}
              >
                🚢 Vessel Information
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '4px',
                    }}
                  >
                    Vessel Name
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {tracking.vesselName}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '4px',
                    }}
                  >
                    IMO / MMSI
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {tracking.vesselIMO} / {tracking.vesselMMSI}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '4px',
                    }}
                  >
                    ETD / ETA
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {tracking.etd.toLocaleDateString()} /{' '}
                    {tracking.eta.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Free Tracking Notice */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#fbbf24',
                  marginBottom: '15px',
                }}
              >
                🔔 FREE Tracking Active
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                Real-time vessel tracking powered by FREE AISStream.io API.
                Automatic notifications for port arrivals, customs clearance,
                and delivery. FleetFlow GPS activates for drayage phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
