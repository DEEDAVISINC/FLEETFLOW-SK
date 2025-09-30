'use client';

import { Maximize2, Minimize2, Ship } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface VesselMapPosition {
  lat: number;
  lng: number;
  vesselName: string;
  speed: number;
  heading: number;
  timestamp: string;
}

export interface MapRoute {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  waypoints?: { lat: number; lng: number }[];
}

export default function VesselMap({
  position,
  route,
  showRoute = true,
  height = '400px',
}: {
  position: VesselMapPosition;
  route?: MapRoute;
  showRoute?: boolean;
  height?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: position.lat,
    lng: position.lng,
  });
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    drawMap();
  }, [position, route, mapCenter, zoom, isFullscreen]);

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw ocean background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e3a5f');
    gradient.addColorStop(1, '#0c1e3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Convert lat/lng to canvas coordinates
    const latLngToCanvas = (lat: number, lng: number) => {
      // Simple mercator projection
      const x = ((lng + 180) / 360) * width;
      const latRad = (lat * Math.PI) / 180;
      const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
      const y = height / 2 - (mercN / Math.PI) * (height / 2);
      return { x, y };
    };

    // Draw route if provided
    if (route && showRoute) {
      const originPos = latLngToCanvas(route.origin.lat, route.origin.lng);
      const destPos = latLngToCanvas(
        route.destination.lat,
        route.destination.lng
      );

      // Draw route line
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(originPos.x, originPos.y);

      // Draw waypoints if provided
      if (route.waypoints) {
        route.waypoints.forEach((wp) => {
          const pos = latLngToCanvas(wp.lat, wp.lng);
          ctx.lineTo(pos.x, pos.y);
        });
      }

      ctx.lineTo(destPos.x, destPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw origin port
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(originPos.x, originPos.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw destination port
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(destPos.x, destPos.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw port labels
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(route.origin.name, originPos.x, originPos.y - 15);
      ctx.fillText(route.destination.name, destPos.x, destPos.y - 15);
    }

    // Draw vessel position
    const vesselPos = latLngToCanvas(position.lat, position.lng);

    // Draw vessel wake (trail)
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(vesselPos.x, vesselPos.y);
    const wakeLength = 30;
    const headingRad = (position.heading * Math.PI) / 180;
    ctx.lineTo(
      vesselPos.x - Math.sin(headingRad) * wakeLength,
      vesselPos.y + Math.cos(headingRad) * wakeLength
    );
    ctx.stroke();

    // Draw vessel icon (ship)
    ctx.save();
    ctx.translate(vesselPos.x, vesselPos.y);
    ctx.rotate((position.heading * Math.PI) / 180);

    // Ship body
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();

    // Ship outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction indicator
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(5, -15);
    ctx.lineTo(-5, -15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw vessel info popup
    const popupX = vesselPos.x + 25;
    const popupY = vesselPos.y - 40;
    const popupWidth = 200;
    const popupHeight = 80;

    // Popup background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(popupX, popupY, popupWidth, popupHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Popup content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(position.vesselName, popupX + 10, popupY + 20);

    ctx.font = '12px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(
      `Speed: ${position.speed.toFixed(1)} knots`,
      popupX + 10,
      popupY + 40
    );
    ctx.fillText(
      `Heading: ${position.heading.toFixed(0)}°`,
      popupX + 10,
      popupY + 58
    );

    // Draw coordinates on canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${position.lat.toFixed(4)}°, ${position.lng.toFixed(4)}°`,
      10,
      height - 10
    );

    // Draw timestamp
    ctx.textAlign = 'right';
    ctx.fillText(
      `Updated: ${new Date(position.timestamp).toLocaleTimeString()}`,
      width - 10,
      height - 10
    );
  };

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        background: '#0f172a',
        borderRadius: isFullscreen ? 0 : '12px',
        overflow: 'hidden',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      }}
    >
      {/* Map Controls */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
        }}
      >
        <button
          onClick={() => setZoom(Math.min(zoom + 1, 10))}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          +
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 1, 1))}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          −
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isFullscreen ? (
            <Minimize2 style={{ width: '16px', height: '16px' }} />
          ) : (
            <Maximize2 style={{ width: '16px', height: '16px' }} />
          )}
        </button>
      </div>

      {/* Map Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '10px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '12px',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <Ship style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
          <span>Live Vessel Position</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
          <span>Origin Port</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#f59e0b',
            }}
          />
          <span>Destination Port</span>
        </div>
      </div>

      {/* Canvas Map */}
      <canvas
        ref={canvasRef}
        width={isFullscreen ? window.innerWidth : 800}
        height={isFullscreen ? window.innerHeight : parseInt(height)}
        style={{
          width: '100%',
          height: isFullscreen ? '100vh' : height,
          cursor: 'grab',
        }}
      />
    </div>
  );
}
