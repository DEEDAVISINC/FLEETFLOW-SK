// 🚢 Vessel Tracking Service
// FREE vessel tracking using AISStream.io and AIS Hub APIs
// Integrates with FleetFlow's WebSocket notification system

import { WebSocketNotificationService } from './WebSocketNotificationService';

export interface VesselPosition {
  mmsi: string; // Maritime Mobile Service Identity
  imo?: string; // International Maritime Organization number
  shipName: string;
  latitude: number;
  longitude: number;
  speed: number; // Speed over ground (knots)
  course: number; // Course over ground (degrees)
  heading: number; // True heading (degrees)
  timestamp: string;
  destination?: string;
  eta?: string;
  shipType?: string;
  flag?: string;
}

export interface ShipmentTracking {
  shipmentId: string;
  containerNumber: string;
  vesselMMSI: string;
  vesselIMO?: string;
  currentPosition?: VesselPosition;
  lastUpdated?: Date;
}

class VesselTrackingService {
  private static instance: VesselTrackingService;
  private aisStreamWS: WebSocket | null = null;
  private trackedVessels: Map<string, ShipmentTracking> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;

  private constructor() {
    console.info('🚢 Initializing Vessel Tracking Service (FREE APIs)');
  }

  public static getInstance(): VesselTrackingService {
    if (!VesselTrackingService.instance) {
      VesselTrackingService.instance = new VesselTrackingService();
    }
    return VesselTrackingService.instance;
  }

  // Connect to FREE AISStream.io WebSocket
  public connectToAISStream(): void {
    if (typeof window === 'undefined') {
      console.info('⚠️ Vessel tracking only available in browser environment');
      return;
    }

    try {
      console.info('🌊 Connecting to AISStream.io (FREE)...');

      // FREE WebSocket connection - no API key required!
      this.aisStreamWS = new WebSocket('wss://stream.aisstream.io/v0/stream');

      this.aisStreamWS.onopen = () => {
        console.info(
          '✅ Connected to AISStream.io - FREE vessel tracking active!'
        );
        this.reconnectAttempts = 0;

        // Subscribe to AIS messages
        if (this.aisStreamWS) {
          this.aisStreamWS.send(
            JSON.stringify({
              APIKey: 'demo', // Can use 'demo' for testing, or get free key
              BoundingBoxes: [
                // Global coverage - track vessels worldwide
                [
                  [-90, -180],
                  [90, 180],
                ],
              ],
            })
          );
        }
      };

      this.aisStreamWS.onmessage = (event) => {
        try {
          const aisData = JSON.parse(event.data);
          this.handleAISMessage(aisData);
        } catch (error) {
          console.warn('⚠️ Error parsing AIS message:', error);
        }
      };

      this.aisStreamWS.onerror = (error) => {
        console.error('❌ AISStream WebSocket error:', error);
      };

      this.aisStreamWS.onclose = () => {
        console.info('🔌 AISStream connection closed');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('❌ Failed to connect to AISStream:', error);
      this.attemptReconnect();
    }
  }

  // Handle incoming AIS messages
  private handleAISMessage(aisData: any): void {
    try {
      if (!aisData.MetaData || !aisData.Message) return;

      const mmsi = aisData.MetaData.MMSI?.toString();

      // Check if this is a vessel we're tracking
      const shipment = this.findShipmentByMMSI(mmsi);
      if (!shipment) return;

      // Extract vessel position
      const position: VesselPosition = {
        mmsi,
        imo: aisData.MetaData.IMO,
        shipName: aisData.MetaData.ShipName || 'Unknown Vessel',
        latitude: aisData.MetaData.latitude,
        longitude: aisData.MetaData.longitude,
        speed: aisData.Message.Sog || 0, // Speed over ground
        course: aisData.Message.Cog || 0, // Course over ground
        heading: aisData.Message.TrueHeading || 0,
        timestamp: aisData.MetaData.time_utc || new Date().toISOString(),
        destination: aisData.MetaData.Destination,
        shipType: aisData.MetaData.ShipType,
      };

      // Update tracked shipment
      shipment.currentPosition = position;
      shipment.lastUpdated = new Date();
      this.trackedVessels.set(shipment.shipmentId, shipment);

      // Notify FleetFlow system
      this.notifyPositionUpdate(shipment, position);

      console.info(
        `📍 Vessel position updated: ${position.shipName} @ ${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`
      );
    } catch (error) {
      console.warn('⚠️ Error handling AIS message:', error);
    }
  }

  // Notify FleetFlow notification system of position update
  private notifyPositionUpdate(
    shipment: ShipmentTracking,
    position: VesselPosition
  ): void {
    try {
      const wsService = WebSocketNotificationService.getInstance();

      wsService.sendMessage({
        type: 'vessel_position_update',
        timestamp: new Date().toISOString(),
        data: {
          shipmentId: shipment.shipmentId,
          containerNumber: shipment.containerNumber,
          vessel: {
            name: position.shipName,
            mmsi: position.mmsi,
            imo: position.imo,
          },
          position: {
            lat: position.latitude,
            lng: position.longitude,
            speed: position.speed,
            heading: position.heading,
            timestamp: position.timestamp,
          },
        },
      });
    } catch (error) {
      console.warn('⚠️ Failed to send position notification:', error);
    }
  }

  // Track a vessel for a shipment
  public trackVessel(
    shipmentId: string,
    containerNumber: string,
    vesselMMSI: string,
    vesselIMO?: string
  ): void {
    const tracking: ShipmentTracking = {
      shipmentId,
      containerNumber,
      vesselMMSI,
      vesselIMO,
    };

    this.trackedVessels.set(shipmentId, tracking);
    console.info(
      `🚢 Now tracking vessel ${vesselMMSI} for shipment ${shipmentId}`
    );

    // Connect to AISStream if not already connected
    if (!this.aisStreamWS || this.aisStreamWS.readyState !== WebSocket.OPEN) {
      this.connectToAISStream();
    }
  }

  // Stop tracking a vessel
  public stopTracking(shipmentId: string): void {
    this.trackedVessels.delete(shipmentId);
    console.info(`🛑 Stopped tracking shipment ${shipmentId}`);
  }

  // Get current vessel position
  public getVesselPosition(shipmentId: string): VesselPosition | null {
    const shipment = this.trackedVessels.get(shipmentId);
    return shipment?.currentPosition || null;
  }

  // Get all tracked shipments
  public getTrackedShipments(): ShipmentTracking[] {
    return Array.from(this.trackedVessels.values());
  }

  // Find shipment by vessel MMSI
  private findShipmentByMMSI(mmsi: string): ShipmentTracking | undefined {
    return Array.from(this.trackedVessels.values()).find(
      (s) => s.vesselMMSI === mmsi
    );
  }

  // Attempt reconnection with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(
        '❌ Max reconnection attempts reached. Vessel tracking unavailable.'
      );
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.info(
      `🔄 Attempting to reconnect to AISStream (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
    );

    setTimeout(() => {
      this.connectToAISStream();
    }, delay);
  }

  // Fallback: Get vessel data from AIS Hub API (FREE)
  public async getVesselDataFromAISHub(
    mmsi: string
  ): Promise<VesselPosition | null> {
    try {
      // AIS Hub provides free API access
      const response = await fetch(
        `http://data.aishub.net/ws.php?username=demo&format=1&output=json&mmsi=${mmsi}`
      );

      if (!response.ok) throw new Error('AIS Hub API request failed');

      const data = await response.json();

      if (data[0]?.ERROR) {
        console.warn('⚠️ AIS Hub API error:', data[0].ERROR);
        return null;
      }

      const vessel = data[0];
      return {
        mmsi: vessel.MMSI,
        shipName: vessel.NAME || 'Unknown Vessel',
        latitude: parseFloat(vessel.LATITUDE),
        longitude: parseFloat(vessel.LONGITUDE),
        speed: parseFloat(vessel.SOG) || 0,
        course: parseFloat(vessel.COG) || 0,
        heading: parseFloat(vessel.HEADING) || 0,
        timestamp: vessel.TIME || new Date().toISOString(),
        destination: vessel.DESTINATION,
        shipType: vessel.TYPE,
      };
    } catch (error) {
      console.error('❌ Error fetching from AIS Hub:', error);
      return null;
    }
  }

  // Calculate ETA based on current position and speed
  public calculateETA(
    currentLat: number,
    currentLng: number,
    destLat: number,
    destLng: number,
    speedKnots: number
  ): Date {
    // Calculate distance using Haversine formula
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = ((destLat - currentLat) * Math.PI) / 180;
    const dLng = ((destLng - currentLng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((currentLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceNM = R * c;

    // Calculate time to destination
    const hoursToDestination = distanceNM / (speedKnots || 1); // Avoid division by zero
    const eta = new Date(Date.now() + hoursToDestination * 60 * 60 * 1000);

    return eta;
  }

  // Disconnect from tracking services
  public disconnect(): void {
    if (this.aisStreamWS) {
      this.aisStreamWS.close();
      this.aisStreamWS = null;
    }
    this.trackedVessels.clear();
    console.info('🔌 Vessel tracking service disconnected');
  }
}

export default VesselTrackingService.getInstance();
