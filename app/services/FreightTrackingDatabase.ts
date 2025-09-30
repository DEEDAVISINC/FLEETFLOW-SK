// 📊 Freight Tracking Database Service
// Handles Supabase persistence for vessel tracking, history, and analytics

export interface ShipmentTrackingRecord {
  id: string;
  shipment_id: string;
  container_number: string;
  vessel_mmsi?: string;
  vessel_imo?: string;
  vessel_name?: string;
  mode: 'ocean' | 'air' | 'ground';
  service_type: 'DDP' | 'DDU' | 'FOB' | 'CIF';
  origin_port: string;
  origin_country: string;
  destination_port: string;
  destination_country: string;
  current_status: string;
  etd: Date;
  eta: Date;
  fleetflow_source: boolean;
  customer_email?: string;
  customer_phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TrackingHistoryRecord {
  id: string;
  shipment_id: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  source: 'ais_stream' | 'ais_hub' | 'fleetflow_gps' | 'manual';
  timestamp: Date;
  metadata?: any;
}

export interface MilestoneRecord {
  id: string;
  shipment_id: string;
  milestone_type: string;
  status: 'completed' | 'in_progress' | 'pending' | 'delayed';
  location: string;
  timestamp?: Date;
  estimated_time?: Date;
  notified_customer: boolean;
  created_at: Date;
}

class FreightTrackingDatabase {
  private static instance: FreightTrackingDatabase;

  // In-memory storage for development (would use Supabase in production)
  private shipments: Map<string, ShipmentTrackingRecord> = new Map();
  private trackingHistory: TrackingHistoryRecord[] = [];
  private milestones: MilestoneRecord[] = [];

  private constructor() {
    console.info('📊 Freight Tracking Database initialized');
  }

  public static getInstance(): FreightTrackingDatabase {
    if (!FreightTrackingDatabase.instance) {
      FreightTrackingDatabase.instance = new FreightTrackingDatabase();
    }
    return FreightTrackingDatabase.instance;
  }

  // Save shipment tracking record
  async saveShipment(shipment: ShipmentTrackingRecord): Promise<void> {
    try {
      shipment.updated_at = new Date();
      this.shipments.set(shipment.shipment_id, shipment);

      console.info('✅ Shipment saved to database:', shipment.shipment_id);

      // In production, would be:
      // await supabase.from('freight_shipments').upsert(shipment);
    } catch (error) {
      console.error('❌ Error saving shipment:', error);
      throw error;
    }
  }

  // Get shipment by ID
  async getShipment(
    shipmentId: string
  ): Promise<ShipmentTrackingRecord | null> {
    return this.shipments.get(shipmentId) || null;

    // In production:
    // const { data } = await supabase
    //   .from('freight_shipments')
    //   .select('*')
    //   .eq('shipment_id', shipmentId)
    //   .single();
    // return data;
  }

  // Save tracking history point
  async saveTrackingHistory(
    history: Omit<TrackingHistoryRecord, 'id'>
  ): Promise<void> {
    try {
      const record: TrackingHistoryRecord = {
        ...history,
        id: `history-${Date.now()}-${Math.random()}`,
      };

      this.trackingHistory.push(record);

      console.info('📍 Tracking point saved:', {
        shipment: record.shipment_id,
        position: `${record.latitude.toFixed(4)}, ${record.longitude.toFixed(4)}`,
        source: record.source,
      });

      // In production:
      // await supabase.from('tracking_history').insert(record);
    } catch (error) {
      console.error('❌ Error saving tracking history:', error);
    }
  }

  // Get tracking history for shipment
  async getTrackingHistory(
    shipmentId: string,
    limit: number = 100
  ): Promise<TrackingHistoryRecord[]> {
    const history = this.trackingHistory
      .filter((h) => h.shipment_id === shipmentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return history;

    // In production:
    // const { data } = await supabase
    //   .from('tracking_history')
    //   .select('*')
    //   .eq('shipment_id', shipmentId)
    //   .order('timestamp', { ascending: false })
    //   .limit(limit);
    // return data || [];
  }

  // Save milestone
  async saveMilestone(
    milestone: Omit<MilestoneRecord, 'id' | 'created_at'>
  ): Promise<void> {
    try {
      const record: MilestoneRecord = {
        ...milestone,
        id: `milestone-${Date.now()}-${Math.random()}`,
        created_at: new Date(),
      };

      this.milestones.push(record);

      console.info('✅ Milestone saved:', {
        type: record.milestone_type,
        status: record.status,
        shipment: record.shipment_id,
      });

      // In production:
      // await supabase.from('milestones').insert(record);
    } catch (error) {
      console.error('❌ Error saving milestone:', error);
    }
  }

  // Get milestones for shipment
  async getMilestones(shipmentId: string): Promise<MilestoneRecord[]> {
    return this.milestones
      .filter((m) => m.shipment_id === shipmentId)
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    // In production:
    // const { data } = await supabase
    //   .from('milestones')
    //   .select('*')
    //   .eq('shipment_id', shipmentId)
    //   .order('created_at', { ascending: true });
    // return data || [];
  }

  // Get all active shipments
  async getActiveShipments(): Promise<ShipmentTrackingRecord[]> {
    return Array.from(this.shipments.values()).filter(
      (s) => !['delivered', 'cancelled'].includes(s.current_status)
    );

    // In production:
    // const { data } = await supabase
    //   .from('freight_shipments')
    //   .select('*')
    //   .not('current_status', 'in', '(delivered,cancelled)')
    //   .order('created_at', { ascending: false });
    // return data || [];
  }

  // Get tracking analytics
  async getTrackingAnalytics(shipmentId: string): Promise<{
    totalPoints: number;
    averageSpeed: number;
    distanceTraveled: number;
    estimatedTimeRemaining: number;
  }> {
    const history = await this.getTrackingHistory(shipmentId);

    if (history.length === 0) {
      return {
        totalPoints: 0,
        averageSpeed: 0,
        distanceTraveled: 0,
        estimatedTimeRemaining: 0,
      };
    }

    // Calculate average speed
    const totalSpeed = history.reduce((sum, h) => sum + h.speed, 0);
    const averageSpeed = totalSpeed / history.length;

    // Calculate distance traveled (simplified - would use Haversine in production)
    let distanceTraveled = 0;
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      const distance = this.calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
      distanceTraveled += distance;
    }

    return {
      totalPoints: history.length,
      averageSpeed,
      distanceTraveled,
      estimatedTimeRemaining: 0, // Would calculate based on destination
    };
  }

  // Helper: Calculate distance between two points (Haversine formula)
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Clear all data (for testing)
  clearAll(): void {
    this.shipments.clear();
    this.trackingHistory = [];
    this.milestones = [];
    console.info('🗑️ All tracking data cleared');
  }
}

export default FreightTrackingDatabase.getInstance();

// SQL Schema for production (Supabase)
export const SUPABASE_SCHEMA = `
-- Freight Shipments Table
CREATE TABLE IF NOT EXISTS freight_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id VARCHAR(50) UNIQUE NOT NULL,
  container_number VARCHAR(20),
  vessel_mmsi VARCHAR(20),
  vessel_imo VARCHAR(20),
  vessel_name VARCHAR(100),
  mode VARCHAR(10) CHECK (mode IN ('ocean', 'air', 'ground')),
  service_type VARCHAR(10) CHECK (service_type IN ('DDP', 'DDU', 'FOB', 'CIF')),
  origin_port VARCHAR(100),
  origin_country VARCHAR(50),
  destination_port VARCHAR(100),
  destination_country VARCHAR(50),
  current_status VARCHAR(50),
  etd TIMESTAMP,
  eta TIMESTAMP,
  fleetflow_source BOOLEAN DEFAULT false,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracking History Table
CREATE TABLE IF NOT EXISTS tracking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id VARCHAR(50) REFERENCES freight_shipments(shipment_id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(6, 2),
  heading DECIMAL(5, 2),
  source VARCHAR(20) CHECK (source IN ('ais_stream', 'ais_hub', 'fleetflow_gps', 'manual')),
  timestamp TIMESTAMP NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id VARCHAR(50) REFERENCES freight_shipments(shipment_id),
  milestone_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('completed', 'in_progress', 'pending', 'delayed')),
  location VARCHAR(200),
  timestamp TIMESTAMP,
  estimated_time TIMESTAMP,
  notified_customer BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tracking_history_shipment ON tracking_history(shipment_id, timestamp DESC);
CREATE INDEX idx_milestones_shipment ON milestones(shipment_id, created_at);
CREATE INDEX idx_shipments_status ON freight_shipments(current_status);
CREATE INDEX idx_shipments_fleetflow ON freight_shipments(fleetflow_source);
`;
