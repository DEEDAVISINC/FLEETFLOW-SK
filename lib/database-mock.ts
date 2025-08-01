// Mock database service for development when Supabase is not available
import { DBDriver, DBLoad, DBVehicle } from './database';

// Mock data for development
const mockLoads: DBLoad[] = [
  {
    id: '1',
    load_number: 'LF-25001-ATLMIA-WMT-DVFL-001',
    origin: 'Atlanta, GA',
    destination: 'Miami, FL',
    pickup_date: '2024-01-15',
    delivery_date: '2024-01-17',
    status: 'available',
    rate: 2500.0,
    weight: '45,000 lbs',
    equipment: 'Dry Van',
    carrier_name: 'ABC Trucking',
    driver_name: 'John Smith',
    broker_name: 'FleetFlow Brokerage',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    load_number: 'LF-25002-CHIDET-FRD-DVFL-002',
    origin: 'Chicago, IL',
    destination: 'Detroit, MI',
    pickup_date: '2024-01-16',
    delivery_date: '2024-01-18',
    status: 'assigned',
    rate: 1800.0,
    weight: '38,000 lbs',
    equipment: 'Reefer',
    carrier_name: 'XYZ Transport',
    driver_name: 'Mike Johnson',
    broker_name: 'FleetFlow Brokerage',
    created_at: '2024-01-11T14:30:00Z',
    updated_at: '2024-01-11T14:30:00Z',
  },
  {
    id: '3',
    load_number: 'LF-25003-LAXNYC-AMZ-DVFL-003',
    origin: 'Los Angeles, CA',
    destination: 'New York, NY',
    pickup_date: '2024-01-20',
    delivery_date: '2024-01-25',
    status: 'in_transit',
    rate: 4200.0,
    weight: '42,000 lbs',
    equipment: 'Dry Van',
    carrier_name: 'West Coast Logistics',
    driver_name: 'Sarah Wilson',
    broker_name: 'FleetFlow Brokerage',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z',
  },
];

const mockDrivers: DBDriver[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@abctrucking.com',
    license_number: 'CDL123456',
    vehicle_id: '1',
    status: 'available',
    location: {
      lat: 33.749,
      lng: -84.388,
      address: 'Atlanta, GA',
    },
    hours_of_service: {
      remaining: 8.5,
      last_reset: '2024-01-10T00:00:00Z',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    phone: '+1 (555) 234-5678',
    email: 'mike.johnson@xyztransport.com',
    license_number: 'CDL234567',
    vehicle_id: '2',
    status: 'on_route',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: 'Chicago, IL',
    },
    hours_of_service: {
      remaining: 6.2,
      last_reset: '2024-01-10T00:00:00Z',
    },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-11T14:30:00Z',
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    phone: '+1 (555) 345-6789',
    email: 'sarah.wilson@westcoastlogistics.com',
    license_number: 'CDL345678',
    vehicle_id: '3',
    status: 'loading',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Los Angeles, CA',
    },
    hours_of_service: {
      remaining: 11.8,
      last_reset: '2024-01-10T00:00:00Z',
    },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-12T09:15:00Z',
  },
];

const mockVehicles: DBVehicle[] = [
  {
    id: '1',
    vehicle_number: 'TRK-001',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2022,
    vin: '1FUJA6CV12L123456',
    plate_number: 'ABC123',
    equipment_type: 'Dry Van',
    status: 'active',
    driver_id: '1',
    location: {
      lat: 33.749,
      lng: -84.388,
      address: 'Atlanta, GA',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    vehicle_number: 'TRK-002',
    make: 'Kenworth',
    model: 'T680',
    year: 2021,
    vin: '1XKDD49X7PJ123456',
    plate_number: 'XYZ789',
    equipment_type: 'Reefer',
    status: 'active',
    driver_id: '2',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: 'Chicago, IL',
    },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-11T14:30:00Z',
  },
  {
    id: '3',
    vehicle_number: 'TRK-003',
    make: 'Peterbilt',
    model: '579',
    year: 2023,
    vin: '1XPBD49X7PJ123456',
    plate_number: 'WCL456',
    equipment_type: 'Dry Van',
    status: 'active',
    driver_id: '3',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Los Angeles, CA',
    },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-12T09:15:00Z',
  },
];

// Mock database service with the same interface as the real database
export const mockLoadService = {
  async getAll(): Promise<DBLoad[]> {
    return mockLoads;
  },

  async getById(id: string): Promise<DBLoad | null> {
    return mockLoads.find((load) => load.id === id) || null;
  },

  async create(
    load: Omit<DBLoad, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    const newLoad: DBLoad = {
      id: (mockLoads.length + 1).toString(),
      ...load,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockLoads.push(newLoad);
    return newLoad.id;
  },

  async update(id: string, updates: Partial<DBLoad>): Promise<void> {
    const index = mockLoads.findIndex((load) => load.id === id);
    if (index !== -1) {
      mockLoads[index] = {
        ...mockLoads[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }
  },

  async delete(id: string): Promise<void> {
    const index = mockLoads.findIndex((load) => load.id === id);
    if (index !== -1) {
      mockLoads.splice(index, 1);
    }
  },

  async getByStatus(status: DBLoad['status']): Promise<DBLoad[]> {
    return mockLoads.filter((load) => load.status === status);
  },
};

export const mockDriverService = {
  async getAll(): Promise<DBDriver[]> {
    return mockDrivers;
  },

  async getById(id: string): Promise<DBDriver | null> {
    return mockDrivers.find((driver) => driver.id === id) || null;
  },

  async create(
    driver: Omit<DBDriver, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    const newDriver: DBDriver = {
      id: (mockDrivers.length + 1).toString(),
      ...driver,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDrivers.push(newDriver);
    return newDriver.id;
  },

  async update(id: string, updates: Partial<DBDriver>): Promise<void> {
    const index = mockDrivers.findIndex((driver) => driver.id === id);
    if (index !== -1) {
      mockDrivers[index] = {
        ...mockDrivers[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }
  },

  async updateLocation(
    id: string,
    location: DBDriver['location']
  ): Promise<void> {
    const index = mockDrivers.findIndex((driver) => driver.id === id);
    if (index !== -1) {
      mockDrivers[index].location = location;
      mockDrivers[index].updated_at = new Date().toISOString();
    }
  },

  async getAvailable(): Promise<DBDriver[]> {
    return mockDrivers.filter((driver) => driver.status === 'available');
  },
};

export const mockVehicleService = {
  async getAll(): Promise<DBVehicle[]> {
    return mockVehicles;
  },

  async getById(id: string): Promise<DBVehicle | null> {
    return mockVehicles.find((vehicle) => vehicle.id === id) || null;
  },

  async create(
    vehicle: Omit<DBVehicle, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    const newVehicle: DBVehicle = {
      id: (mockVehicles.length + 1).toString(),
      ...vehicle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockVehicles.push(newVehicle);
    return newVehicle.id;
  },

  async update(id: string, updates: Partial<DBVehicle>): Promise<void> {
    const index = mockVehicles.findIndex((vehicle) => vehicle.id === id);
    if (index !== -1) {
      mockVehicles[index] = {
        ...mockVehicles[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }
  },

  async getActive(): Promise<DBVehicle[]> {
    return mockVehicles.filter((vehicle) => vehicle.status === 'active');
  },
};

export const mockAssignLoadToDriver = async (
  loadId: string,
  driverId: string,
  vehicleId: string
): Promise<void> => {
  // Update load status
  const loadIndex = mockLoads.findIndex((load) => load.id === loadId);
  if (loadIndex !== -1) {
    mockLoads[loadIndex].status = 'assigned';
    mockLoads[loadIndex].driver_name =
      mockDrivers.find((d) => d.id === driverId)?.name || '';
    mockLoads[loadIndex].updated_at = new Date().toISOString();
  }

  // Update driver status
  const driverIndex = mockDrivers.findIndex((driver) => driver.id === driverId);
  if (driverIndex !== -1) {
    mockDrivers[driverIndex].status = 'on_route';
    mockDrivers[driverIndex].vehicle_id = vehicleId;
    mockDrivers[driverIndex].updated_at = new Date().toISOString();
  }

  // Update vehicle assignment
  const vehicleIndex = mockVehicles.findIndex(
    (vehicle) => vehicle.id === vehicleId
  );
  if (vehicleIndex !== -1) {
    mockVehicles[vehicleIndex].driver_id = driverId;
    mockVehicles[vehicleIndex].updated_at = new Date().toISOString();
  }
};
