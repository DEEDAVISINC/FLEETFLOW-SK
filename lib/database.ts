// Database service for FleetFlow using Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nleqplwwothhxgrovnjw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';

// Check if environment variables are properly set for production
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Database: Using fallback Supabase values. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for production.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load Management
export interface DBLoad {
  id?: string;
  load_number: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  status: 'available' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  rate: number;
  weight: string;
  equipment: string;
  carrier_name?: string;
  driver_name?: string;
  broker_name?: string;
  created_at: string;
  updated_at: string;
}

export interface DBDriver {
  id?: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  vehicle_id?: string;
  status: 'available' | 'on_route' | 'loading' | 'unloading' | 'off_duty';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  hours_of_service: {
    remaining: number;
    last_reset: string;
  };
  created_at: string;
  updated_at: string;
}

export interface DBVehicle {
  id?: string;
  vehicle_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  plate_number: string;
  equipment_type: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  driver_id?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  created_at: string;
  updated_at: string;
}

// Load Operations
export const loadService = {
  async getAll(): Promise<DBLoad[]> {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<DBLoad | null> {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async create(load: Omit<DBLoad, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('loads')
      .insert([{
        ...load,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async update(id: string, updates: Partial<DBLoad>): Promise<void> {
    const { error } = await supabase
      .from('loads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('loads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getByStatus(status: DBLoad['status']): Promise<DBLoad[]> {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Driver Operations
export const driverService = {
  async getAll(): Promise<DBDriver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<DBDriver | null> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async create(driver: Omit<DBDriver, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('drivers')
      .insert([{
        ...driver,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async update(id: string, updates: Partial<DBDriver>): Promise<void> {
    const { error } = await supabase
      .from('drivers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateLocation(id: string, location: DBDriver['location']): Promise<void> {
    const { error } = await supabase
      .from('drivers')
      .update({
        location,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async getAvailable(): Promise<DBDriver[]> {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('status', 'available')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
};

// Vehicle Operations
export const vehicleService = {
  async getAll(): Promise<DBVehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('vehicle_number');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<DBVehicle | null> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async create(vehicle: Omit<DBVehicle, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        ...vehicle,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async update(id: string, updates: Partial<DBVehicle>): Promise<void> {
    const { error } = await supabase
      .from('vehicles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async getActive(): Promise<DBVehicle[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'active')
      .order('vehicle_number');
    
    if (error) throw error;
    return data || [];
  }
};

// Batch Operations
export const batchService = {
  async assignLoadToDriver(loadId: string, driverId: string, vehicleId: string): Promise<void> {
    const now = new Date().toISOString();
    
    // Update load
    const { error: loadError } = await supabase
      .from('loads')
      .update({
        status: 'assigned',
        driver_id: driverId,
        vehicle_id: vehicleId,
        updated_at: now
      })
      .eq('id', loadId);
    
    if (loadError) throw loadError;

    // Update driver
    const { error: driverError } = await supabase
      .from('drivers')
      .update({
        status: 'on_route',
        vehicle_id: vehicleId,
        updated_at: now
      })
      .eq('id', driverId);
    
    if (driverError) throw driverError;

    // Update vehicle
    const { error: vehicleError } = await supabase
      .from('vehicles')
      .update({
        driver_id: driverId,
        updated_at: now
      })
      .eq('id', vehicleId);
    
    if (vehicleError) throw vehicleError;
  }
};
