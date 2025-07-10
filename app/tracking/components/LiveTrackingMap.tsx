'use client'

import React, { useEffect, useRef, useCallback, useMemo } from 'react'

// Add debounce utility function
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface Shipment {
  id: string
  status: 'in-transit' | 'delivered' | 'delayed'
  origin: string
  destination: string
  carrier: string
  progress: number
  currentLocation: [number, number]
  originCoords: [number, number]
  destCoords: [number, number]
  speed: number
  eta: string
  driverName?: string
  driverPhone?: string
  vehicleInfo?: string
}

interface LiveTrackingMapProps {
  shipments: Shipment[]
  selectedShipment: string | null
  onSelectShipment: (id: string) => void
  autoTracking: boolean
  showRoutes: boolean
}

export default React.memo(function LiveTrackingMap({
  shipments,
  selectedShipment,
  onSelectShipment,
  autoTracking,
  showRoutes
}: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const routesRef = useRef<{ [key: string]: any }>({})
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce shipments updates to reduce map re-renders
  const debouncedShipments = useDebounce(shipments, 100)

  // Memoize status color function
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'in-transit': return '#2563eb'
      case 'delivered': return '#10b981'
      case 'delayed': return '#ef4444'
      default: return '#6b7280'
    }
  }, [])

  // Memoize shipments array to prevent unnecessary re-renders
  const memoizedShipments = useMemo(() => debouncedShipments, [debouncedShipments])

  // Optimized map update function
  const updateMapMarkers = useCallback((L: any) => {
    if (!mapInstanceRef.current) return

    // Clear existing markers and routes efficiently
    Object.values(markersRef.current).forEach((marker: any) => {
      try {
        marker.remove()
      } catch (e) {
        // Ignore errors if marker already removed
      }
    })
    Object.values(routesRef.current).forEach((route: any) => {
      try {
        route.remove()
      } catch (e) {
        // Ignore errors if route already removed
      }
    })
    markersRef.current = {}
    routesRef.current = {}

    // Add shipments to map
    memoizedShipments.forEach((shipment: Shipment) => {
      addShipmentToMap(shipment, L)
    })
  }, [memoizedShipments, showRoutes, getStatusColor])

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Import Leaflet dynamically
      import('leaflet').then((L) => {
        // Initialize map
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current!).setView([39.8283, -98.5795], 4)

          // Add tile layer with performance options
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            updateWhenZooming: false,
            updateWhenIdle: true
          }).addTo(mapInstanceRef.current)
        }

        // Debounce map updates
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current)
        }

        updateTimeoutRef.current = setTimeout(() => {
          updateMapMarkers(L)
        }, 50)
      })
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [updateMapMarkers])

  // Auto-tracking effect
  useEffect(() => {
    if (autoTracking && selectedShipment && mapInstanceRef.current) {
      const shipment = memoizedShipments.find((s: Shipment) => s.id === selectedShipment)
      if (shipment) {
        mapInstanceRef.current.panTo(shipment.currentLocation)
      }
    }
  }, [autoTracking, selectedShipment, memoizedShipments])

  // Focus on selected shipment
  useEffect(() => {
    if (selectedShipment && mapInstanceRef.current) {
      const shipment = memoizedShipments.find((s: Shipment) => s.id === selectedShipment)
      if (shipment && markersRef.current[selectedShipment]) {
        mapInstanceRef.current.setView(shipment.currentLocation, 8)
        markersRef.current[selectedShipment].openPopup()
      }
    }
  }, [selectedShipment, memoizedShipments])

  const addShipmentToMap = useCallback((shipment: Shipment, L: any) => {
    if (!mapInstanceRef.current) return

    // Get status color
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'in-transit': return '#2563eb'
        case 'delivered': return '#10b981'
        case 'delayed': return '#ef4444'
        default: return '#6b7280'
      }
    }

    // Create custom icon
    const iconHtml = `
      <div style="
        background: ${getStatusColor(shipment.status)};
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
        position: relative;
      ">
        🚚
        ${shipment.status === 'in-transit' ? `
          <div style="
            position: absolute;
            top: -5px;
            right: -5px;
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            border: 1px solid white;
            animation: pulse 2s infinite;
          "></div>
        ` : ''}
      </div>
    `

    const customIcon = L.divIcon({
      html: iconHtml,
      iconSize: [30, 30],
      className: 'custom-marker'
    })

    // Create popup content
    const popupContent = `
      <div style="min-width: 250px; font-family: system-ui;">
        <div style="font-weight: bold; margin-bottom: 8px; color: ${getStatusColor(shipment.status)}; font-size: 1.1rem;">
          ${shipment.id}
        </div>
        <div style="margin-bottom: 4px;"><strong>Status:</strong> ${shipment.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
        <div style="margin-bottom: 4px;"><strong>Driver:</strong> ${shipment.driverName || 'N/A'}</div>
        <div style="margin-bottom: 4px;"><strong>Phone:</strong> ${shipment.driverPhone || 'N/A'}</div>
        <div style="margin-bottom: 4px;"><strong>Vehicle:</strong> ${shipment.vehicleInfo || 'N/A'}</div>
        <div style="margin-bottom: 4px;"><strong>Carrier:</strong> ${shipment.carrier}</div>
        <div style="margin-bottom: 4px;"><strong>Route:</strong> ${shipment.origin} → ${shipment.destination}</div>
        <div style="margin-bottom: 4px;"><strong>Progress:</strong> ${shipment.progress}%</div>
        <div style="margin-bottom: 4px;"><strong>Speed:</strong> ${shipment.speed} mph</div>
        <div style="margin-bottom: 4px;"><strong>ETA:</strong> ${shipment.eta}</div>
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
          <button onclick="window.parent.postMessage({type: 'selectShipment', id: '${shipment.id}'}, '*')" 
                  style="background: ${getStatusColor(shipment.status)}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">
            Track This Load
          </button>
        </div>
      </div>
    `

    // Add marker
    const marker = L.marker(shipment.currentLocation, { icon: customIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(popupContent)
      .on('click', () => onSelectShipment(shipment.id))

    markersRef.current[shipment.id] = marker

    // Add route if enabled
    if (showRoutes) {
      const route = L.polyline([
        shipment.originCoords,
        shipment.currentLocation,
        shipment.destCoords
      ], {
        color: getStatusColor(shipment.status),
        weight: 3,
        opacity: 0.6,
        dashArray: shipment.status === 'in-transit' ? '10, 10' : null
      }).addTo(mapInstanceRef.current)

      routesRef.current[shipment.id] = route
    }

    // Add origin marker
    L.circleMarker(shipment.originCoords, {
      radius: 8,
      fillColor: '#10b981',
      color: 'white',
      weight: 2,
      fillOpacity: 1
    }).addTo(mapInstanceRef.current)
      .bindPopup(`<div style="font-weight: bold;">Origin</div><div>${shipment.origin}</div>`)

    // Add destination marker
    L.circleMarker(shipment.destCoords, {
      radius: 8,
      fillColor: '#ef4444',
      color: 'white',
      weight: 2,
      fillOpacity: 1
    }).addTo(mapInstanceRef.current)
      .bindPopup(`<div style="font-weight: bold;">Destination</div><div>${shipment.destination}</div>`)
  }, [getStatusColor, onSelectShipment])

  // Handle center map
  const centerMap = useCallback(() => {
    if (mapInstanceRef.current && memoizedShipments.length > 0) {
      import('leaflet').then((L) => {
        const bounds = L.latLngBounds(memoizedShipments.map((s: Shipment) => s.currentLocation))
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
      })
    }
  }, [memoizedShipments])

  // Listen for messages from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'selectShipment') {
        onSelectShipment(event.data.id)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelectShipment])

  return (
    <>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }} 
      />
      
      {/* Center Map Button */}
      <button
        onClick={centerMap}
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          zIndex: 500,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '0.75rem',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          fontSize: '1rem'
        }}
        title="Center Map"
      >
        🎯
      </button>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
})
