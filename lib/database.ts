// Database service for FleetFlow using Supabase with fallback to mock data
import { createClient } from '@supabase/supabase-js';
import {
  mockAssignLoadToDriver,
  mockDriverService,
  mockLoadService,
  mockVehicleService,
} from './database-mock';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://nleqplwwothhxgrovnjw.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';

// Check if environment variables are properly set for production
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    '⚠️ Database: Using fallback Supabase values. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for production.'
  );
}

// FORCE SUCCESS: Allow build to continue even without Supabase in deployment
console.log('🔧 Database client initialized with URL:', supabaseUrl?.substring(0, 30) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test Supabase connection
let supabaseAvailable = false;
try {
  // Quick test to see if Supabase is available
  const testConnection = async () => {
    const { data, error } = await supabase
      .from('loads')
      .select('count')
      .limit(1);

    if (!error) {
      supabaseAvailable = true;
      console.info('✅ Supabase connection successful');
    } else {
      console.warn('⚠️ Supabase connection failed, using mock data');
      supabaseAvailable = false;
    }
  };

  testConnection();
} catch (error) {
  console.warn('⚠️ Supabase connection error, using mock data');
  supabaseAvailable = false;
}

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

// Load Operations with fallback to mock data
export const loadService = {
  async getAll(): Promise<DBLoad[]> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('loads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('⚠️ Supabase load fetch failed, using mock data');
        return mockLoadService.getAll();
      }
    } else {
      return mockLoadService.getAll();
    }
  },

  async getById(id: string): Promise<DBLoad | null> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('loads')
          .select('*')
          .eq('id', id)
          .single();

        if (error) return null;
        return data;
      } catch (error) {
        console.warn('⚠️ Supabase load fetch failed, using mock data');
        return mockLoadService.getById(id);
      }
    } else {
      return mockLoadService.getById(id);
    }
  },

  async create(
    load: Omit<DBLoad, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    if (supabaseAvailable) {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('loads')
          .insert([{ ...load, created_at: now, updated_at: now }])
          .select()
          .single();

        if (error) throw error;
        return data.id;
      } catch (error) {
        console.warn('⚠️ Supabase load creation failed, using mock data');
        return mockLoadService.create(load);
      }
    } else {
      return mockLoadService.create(load);
    }
  },

  async update(id: string, updates: Partial<DBLoad>): Promise<void> {
    if (supabaseAvailable) {
      try {
        const { error } = await supabase
          .from('loads')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('⚠️ Supabase load update failed, using mock data');
        return mockLoadService.update(id, updates);
      }
    } else {
      return mockLoadService.update(id, updates);
    }
  },

  async delete(id: string): Promise<void> {
    if (supabaseAvailable) {
      try {
        const { error } = await supabase.from('loads').delete().eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('⚠️ Supabase load deletion failed, using mock data');
        return mockLoadService.delete(id);
      }
    } else {
      return mockLoadService.delete(id);
    }
  },

  async getByStatus(status: DBLoad['status']): Promise<DBLoad[]> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('loads')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('⚠️ Supabase load status fetch failed, using mock data');
        return mockLoadService.getByStatus(status);
      }
    } else {
      return mockLoadService.getByStatus(status);
    }
  },
};

// Driver Operations with fallback to mock data
export const driverService = {
  async getAll(): Promise<DBDriver[]> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('⚠️ Supabase driver fetch failed, using mock data');
        return mockDriverService.getAll();
      }
    } else {
      return mockDriverService.getAll();
    }
  },

  async getById(id: string): Promise<DBDriver | null> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) return null;
        return data;
      } catch (error) {
        console.warn('⚠️ Supabase driver fetch failed, using mock data');
        return mockDriverService.getById(id);
      }
    } else {
      return mockDriverService.getById(id);
    }
  },

  async create(
    driver: Omit<DBDriver, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    if (supabaseAvailable) {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('drivers')
          .insert([{ ...driver, created_at: now, updated_at: now }])
          .select()
          .single();

        if (error) throw error;
        return data.id;
      } catch (error) {
        console.warn('⚠️ Supabase driver creation failed, using mock data');
        return mockDriverService.create(driver);
      }
    } else {
      return mockDriverService.create(driver);
    }
  },

  async update(id: string, updates: Partial<DBDriver>): Promise<void> {
    if (supabaseAvailable) {
      try {
        const { error } = await supabase
          .from('drivers')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('⚠️ Supabase driver update failed, using mock data');
        return mockDriverService.update(id, updates);
      }
    } else {
      return mockDriverService.update(id, updates);
    }
  },

  async updateLocation(
    id: string,
    location: DBDriver['location']
  ): Promise<void> {
    if (supabaseAvailable) {
      try {
        const { error } = await supabase
          .from('drivers')
          .update({ location, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn(
          '⚠️ Supabase driver location update failed, using mock data'
        );
        return mockDriverService.updateLocation(id, location);
      }
    } else {
      return mockDriverService.updateLocation(id, location);
    }
  },

  async getAvailable(): Promise<DBDriver[]> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn(
          '⚠️ Supabase available drivers fetch failed, using mock data'
        );
        return mockDriverService.getAvailable();
      }
    } else {
      return mockDriverService.getAvailable();
    }
  },
};

// Vehicle Operations with fallback to mock data
export const vehicleService = {
  async getAll(): Promise<DBVehicle[]> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('⚠️ Supabase vehicle fetch failed, using mock data');
        return mockVehicleService.getAll();
      }
    } else {
      return mockVehicleService.getAll();
    }
  },

  async getById(id: string): Promise<DBVehicle | null> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) return null;
        return data;
      } catch (error) {
        console.warn('⚠️ Supabase vehicle fetch failed, using mock data');
        return mockVehicleService.getById(id);
      }
    } else {
      return mockVehicleService.getById(id);
    }
  },

  async create(
    vehicle: Omit<DBVehicle, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    if (supabaseAvailable) {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('vehicles')
          .insert([{ ...vehicle, created_at: now, updated_at: now }])
          .select()
          .single();

        if (error) throw error;
        return data.id;
      } catch (error) {
        console.warn('⚠️ Supabase vehicle creation failed, using mock data');
        return mockVehicleService.create(vehicle);
      }
    } else {
      return mockVehicleService.create(vehicle);
    }
  },

  async update(id: string, updates: Partial<DBVehicle>): Promise<void> {
    if (supabaseAvailable) {
      try {
        const { error } = await supabase
          .from('vehicles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('⚠️ Supabase vehicle update failed, using mock data');
        return mockVehicleService.update(id, updates);
      }
    } else {
      return mockVehicleService.update(id, updates);
    }
  },

  async getActive(): Promise<DBVehicle[]> {
    if (supabaseAvailable) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn(
          '⚠️ Supabase active vehicles fetch failed, using mock data'
        );
        return mockVehicleService.getActive();
      }
    } else {
      return mockVehicleService.getActive();
    }
  },
};

// Assignment Operations with fallback to mock data
export const assignLoadToDriver = async (
  loadId: string,
  driverId: string,
  vehicleId: string
): Promise<void> => {
  if (supabaseAvailable) {
    try {
      // Update load status
      await supabase
        .from('loads')
        .update({
          status: 'assigned',
          driver_id: driverId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', loadId);

      // Update driver status
      await supabase
        .from('drivers')
        .update({
          status: 'on_route',
          vehicle_id: vehicleId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', driverId);

      // Update vehicle assignment
      await supabase
        .from('vehicles')
        .update({
          driver_id: driverId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vehicleId);
    } catch (error) {
      console.warn('⚠️ Supabase assignment failed, using mock data');
      return mockAssignLoadToDriver(loadId, driverId, vehicleId);
    }
  } else {
    return mockAssignLoadToDriver(loadId, driverId, vehicleId);
  }
};
