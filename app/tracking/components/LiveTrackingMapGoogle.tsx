'use client';

import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
  useLoadScript,
} from '@react-google-maps/api';
import React, { useCallback, useState } from 'react';

interface Shipment {
  id: string;
  status: 'in-transit' | 'delivered' | 'delayed' | 'loading' | 'unloading';
  origin: string;
  destination: string;
  carrier: string;
  progress: number;
  currentLocation: [number, number]; // [lng, lat]
  originCoords: [number, number];
  destCoords: [number, number];
  speed: number;
  eta: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: string;
  temperature?: number;
  humidity?: number;
  fuelLevel?: number;
  lastUpdate?: string;
  alerts?: string[];
  priority: 'high' | 'medium' | 'low';
  value: number;
  weight: number;
  commodity: string;
  createdDate?: string;
  pickupDate?: string;
  deliveryDate?: string;
  customerName?: string;
  miles?: number;
}

interface MapFeatures {
  showTraffic: boolean;
  showWeather: boolean;
  showSatellite: boolean;
  showClustering: boolean;
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

interface LiveTrackingMapProps {
  shipments: Shipment[];
  selectedShipment: string | null;
  onSelectShipment: (shipmentId: string | null) => void;
  autoTracking: boolean;
  showRoutes: boolean;
  mapFeatures: MapFeatures;
}

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
};

const mapOptions = {
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#2d3748' }], // Dark gray for city/place names
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ffffff' }, { weight: 2 }], // White outline for readability
    },
  ],
};

// Status colors
const statusColors = {
  'in-transit': '#3b82f6',
  delivered: '#10b981',
  delayed: '#ef4444',
  loading: '#f59e0b',
  unloading: '#8b5cf6',
};

export default React.memo(function LiveTrackingMapGoogle({
  shipments,
  selectedShipment,
  onSelectShipment,
  autoTracking,
  showRoutes,
  mapFeatures,
}: LiveTrackingMapProps) {
  console.log(
    '🗺️ Google Maps component rendering with',
    shipments.length,
    'shipments'
  );

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(null);

  // Calculate center based on selected shipment or all shipments
  const center = React.useMemo(() => {
    if (selectedShipment && shipments.find((s) => s.id === selectedShipment)) {
      const shipment = shipments.find((s) => s.id === selectedShipment)!;
      return {
        lat: shipment.currentLocation[1],
        lng: shipment.currentLocation[0],
      };
    }

    // Center of US as default
    return { lat: 39.8283, lng: -98.5795 };
  }, [selectedShipment, shipments]);

  const handleMarkerClick = useCallback(
    (shipmentId: string) => {
      console.log('📍 Marker clicked:', shipmentId);
      setActiveInfoWindow(shipmentId);
      onSelectShipment(shipmentId);
    },
    [onSelectShipment]
  );

  const handleInfoWindowClose = useCallback(() => {
    setActiveInfoWindow(null);
  }, []);

  // Handle loading and error states
  if (loadError) {
    return (
      <div
        style={{
          width: '100%',
          height: '600px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h3 style={{ marginBottom: '12px' }}>Error Loading Google Maps</h3>
          <p style={{ opacity: 0.8 }}>{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          width: '100%',
          height: '600px',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <div>Loading Google Maps...</div>
        </div>
      </div>
    );
  }

  if (!API_KEY || API_KEY === 'demo-key' || API_KEY.includes('your_')) {
    return (
      <div
        style={{
          width: '100%',
          height: '600px',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ marginBottom: '12px' }}>Google Maps API Key Required</h3>
          <p style={{ opacity: 0.8, marginBottom: '16px' }}>
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
          </p>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              📦 {shipments.length} shipment{shipments.length !== 1 ? 's' : ''}{' '}
              loaded
            </div>
            {selectedShipment && <div>✓ Selected: {selectedShipment}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={selectedShipment ? 10 : 5}
      options={{
        ...mapOptions,
        mapTypeId: mapFeatures.mapType || 'roadmap',
      }}
    >
      {/* Render shipment markers */}
      {shipments.map((shipment) => {
        const position = {
          lat: shipment.currentLocation[1],
          lng: shipment.currentLocation[0],
        };

        return (
          <React.Fragment key={shipment.id}>
            <Marker
              position={position}
              onClick={() => handleMarkerClick(shipment.id)}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                fillColor: statusColors[shipment.status],
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 10,
              }}
              label={{
                text: shipment.status === 'in-transit' ? '🚚' : '📦',
                color: '#ffffff',
                fontSize: '16px',
              }}
            />

            {activeInfoWindow === shipment.id && (
              <InfoWindow
                position={position}
                onCloseClick={handleInfoWindowClose}
              >
                <div
                  style={{
                    padding: '12px',
                    minWidth: '280px',
                    color: '#1e293b',
                    background: '#ffffff',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 12px 0',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      fontSize: '16px',
                      borderBottom: '2px solid #e2e8f0',
                      paddingBottom: '8px',
                    }}
                  >
                    {shipment.id}
                  </h3>
                  <div
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.8',
                      color: '#334155',
                    }}
                  >
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1e293b' }}>Status:</strong>{' '}
                      <span
                        style={{
                          color: statusColors[shipment.status],
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          fontSize: '12px',
                        }}
                      >
                        {shipment.status}
                      </span>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1e293b' }}>Origin:</strong>{' '}
                      <span style={{ color: '#475569' }}>
                        {shipment.origin}
                      </span>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1e293b' }}>Destination:</strong>{' '}
                      <span style={{ color: '#475569' }}>
                        {shipment.destination}
                      </span>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1e293b' }}>Carrier:</strong>{' '}
                      <span style={{ color: '#475569' }}>
                        {shipment.carrier}
                      </span>
                    </div>
                    {shipment.driverName && (
                      <div style={{ marginBottom: '6px' }}>
                        <strong style={{ color: '#1e293b' }}>Driver:</strong>{' '}
                        <span style={{ color: '#475569' }}>
                          {shipment.driverName}
                        </span>
                      </div>
                    )}
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1e293b' }}>Progress:</strong>{' '}
                      <span
                        style={{
                          color: '#10b981',
                          fontWeight: 'bold',
                        }}
                      >
                        {shipment.progress}%
                      </span>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ color: '#1e293b' }}>Speed:</strong>{' '}
                      <span style={{ color: '#475569' }}>
                        {shipment.speed} mph
                      </span>
                    </div>
                    <div style={{ marginBottom: '0' }}>
                      <strong style={{ color: '#1e293b' }}>ETA:</strong>{' '}
                      <span style={{ color: '#475569' }}>
                        {new Date(shipment.eta).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Draw route line if enabled */}
            {showRoutes && (
              <Polyline
                path={[
                  {
                    lat: shipment.originCoords[1],
                    lng: shipment.originCoords[0],
                  },
                  {
                    lat: shipment.currentLocation[1],
                    lng: shipment.currentLocation[0],
                  },
                  {
                    lat: shipment.destCoords[1],
                    lng: shipment.destCoords[0],
                  },
                ]}
                options={{
                  strokeColor: statusColors[shipment.status],
                  strokeOpacity: 0.6,
                  strokeWeight: 3,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );
});
