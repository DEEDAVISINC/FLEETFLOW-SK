'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./components/LiveTrackingMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        fontSize: '18px',
        fontWeight: '500',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <div>Loading Interactive Map...</div>
        <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
          Real-time tracking data
        </div>
      </div>
    </div>
  ),
});

interface Shipment {
  id: string;
  status: 'in-transit' | 'delivered' | 'delayed' | 'loading' | 'unloading';
  origin: string;
  destination: string;
  carrier: string;
  progress: number;
  currentLocation: [number, number];
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

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    status: string[];
    priority: string[];
    dateRange: { start: string; end: string } | null;
    searchTerm: string;
    valueRange: { min: number; max: number } | null;
    carriers: string[];
  };
  isDefault?: boolean;
}

// Enhanced Map Features State
interface MapFeatures {
  showTraffic: boolean;
  showWeather: boolean;
  showSatellite: boolean;
  showClustering: boolean;
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export default function LiveTrackingPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    'overview' | 'tracking' | 'analytics'
  >('overview');

  // ... existing code ...
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'SHP-001',
      status: 'in-transit',
      origin: 'Los Angeles, CA',
      destination: 'Chicago, IL',
      carrier: 'Swift Transport',
      progress: 65,
      currentLocation: [36.7783, -110.4179],
      originCoords: [34.0522, -118.2437],
      destCoords: [41.8781, -87.6298],
      speed: 65,
      eta: '2024-01-15 14:30',
      driverName: 'John Smith',
      driverPhone: '555-0123',
      vehicleInfo: 'Truck #T-456',
      temperature: 72,
      humidity: 45,
      fuelLevel: 78,
      lastUpdate: '2024-01-14 10:15',
      alerts: ['Weather Alert', 'Traffic Delay'],
      priority: 'high',
      value: 25000,
      weight: 15000,
      commodity: 'Electronics',
      createdDate: '2024-01-10',
      pickupDate: '2024-01-12',
      deliveryDate: '2024-01-15',
      customerName: 'TechCorp Industries',
      miles: 2015,
    },
    {
      id: 'SHP-002',
      status: 'delivered',
      origin: 'Miami, FL',
      destination: 'Atlanta, GA',
      carrier: 'FedEx Freight',
      progress: 100,
      currentLocation: [33.749, -84.388],
      originCoords: [25.7617, -80.1918],
      destCoords: [33.749, -84.388],
      speed: 0,
      eta: '2024-01-14 16:00',
      driverName: 'Sarah Johnson',
      driverPhone: '555-0456',
      vehicleInfo: 'Truck #F-789',
      temperature: 68,
      humidity: 52,
      fuelLevel: 45,
      lastUpdate: '2024-01-14 16:00',
      alerts: [],
      priority: 'medium',
      value: 18000,
      weight: 12000,
      commodity: 'Machinery',
      createdDate: '2024-01-09',
      pickupDate: '2024-01-11',
      deliveryDate: '2024-01-14',
      customerName: 'Manufacturing Co.',
      miles: 662,
    },
    {
      id: 'SHP-003',
      status: 'delayed',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      carrier: 'UPS Freight',
      progress: 45,
      currentLocation: [41.2033, -73.0468],
      originCoords: [40.7128, -74.006],
      destCoords: [42.3601, -71.0589],
      speed: 0,
      eta: '2024-01-15 09:00',
      driverName: 'Mike Wilson',
      driverPhone: '555-0789',
      vehicleInfo: 'Truck #U-123',
      temperature: 65,
      humidity: 48,
      fuelLevel: 62,
      lastUpdate: '2024-01-14 08:30',
      alerts: ['Mechanical Issue', 'ETA Delay'],
      priority: 'high',
      value: 32000,
      weight: 18000,
      commodity: 'Pharmaceuticals',
      createdDate: '2024-01-11',
      pickupDate: '2024-01-13',
      deliveryDate: '2024-01-15',
      customerName: 'MedSupply Corp',
      miles: 215,
    },
    {
      id: 'SHP-004',
      status: 'loading',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      carrier: 'Pacific Freight',
      progress: 0,
      currentLocation: [47.6062, -122.3321],
      originCoords: [47.6062, -122.3321],
      destCoords: [45.5152, -122.6784],
      speed: 0,
      eta: '2024-01-15 11:00',
      driverName: 'Emily Davis',
      driverPhone: '555-0321',
      vehicleInfo: 'Truck #P-567',
      temperature: 70,
      humidity: 55,
      fuelLevel: 95,
      lastUpdate: '2024-01-14 09:00',
      alerts: ['Loading in Progress'],
      priority: 'low',
      value: 12000,
      weight: 8000,
      commodity: 'Textiles',
      createdDate: '2024-01-12',
      pickupDate: '2024-01-14',
      deliveryDate: '2024-01-15',
      customerName: 'Fashion Retail Inc.',
      miles: 173,
    },
    {
      id: 'SHP-005',
      status: 'unloading',
      origin: 'Dallas, TX',
      destination: 'Houston, TX',
      carrier: 'Lone Star Logistics',
      progress: 95,
      currentLocation: [29.7604, -95.3698],
      originCoords: [32.7767, -96.797],
      destCoords: [29.7604, -95.3698],
      speed: 0,
      eta: '2024-01-14 18:00',
      driverName: 'Carlos Rodriguez',
      driverPhone: '555-0654',
      vehicleInfo: 'Truck #L-890',
      temperature: 75,
      humidity: 60,
      fuelLevel: 40,
      lastUpdate: '2024-01-14 17:30',
      alerts: ['Unloading at Destination'],
      priority: 'medium',
      value: 21000,
      weight: 14000,
      commodity: 'Food Products',
      createdDate: '2024-01-13',
      pickupDate: '2024-01-14',
      deliveryDate: '2024-01-14',
      customerName: 'SuperMarket Chain',
      miles: 239,
    },
  ]);

  // Filter and Search States
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'id' | 'status' | 'eta' | 'progress' | 'created' | 'miles'
  >('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [valueRange, setValueRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Enhanced States
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(
    new Set()
  );
  const [mapFeatures, setMapFeatures] = useState<MapFeatures>({
    showTraffic: false,
    showWeather: false,
    showSatellite: false,
    showClustering: true,
    mapType: 'roadmap',
  });

  // Filter Presets
  const [filterPresets] = useState<FilterPreset[]>([
    {
      id: 'all',
      name: 'All Shipments',
      filters: {
        status: [],
        priority: [],
        dateRange: null,
        searchTerm: '',
        valueRange: null,
        carriers: [],
      },
      isDefault: true,
    },
    {
      id: 'in-transit',
      name: 'In Transit',
      filters: {
        status: ['in-transit'],
        priority: [],
        dateRange: null,
        searchTerm: '',
        valueRange: null,
        carriers: [],
      },
    },
    {
      id: 'high-priority',
      name: 'High Priority',
      filters: {
        status: [],
        priority: ['high'],
        dateRange: null,
        searchTerm: '',
        valueRange: null,
        carriers: [],
      },
    },
    {
      id: 'high-value',
      name: 'High Value',
      filters: {
        status: [],
        priority: [],
        dateRange: null,
        searchTerm: '',
        valueRange: { min: 25000, max: 1000000 },
        carriers: [],
      },
    },
  ]);

  const [selectedPreset, setSelectedPreset] = useState<string>('all');

  // Auto-refresh for live updates - TEMPORARILY DISABLED TO FIX INFINITE RENDER
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setShipments(prev => prev.map(shipment => {
  //       if (shipment.status === 'in-transit') {
  //         const newProgress = Math.min(100, shipment.progress + Math.random() * 2)
  //         return {
  //           ...shipment,
  //           progress: newProgress,
  //           lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ')
  //         }
  //       }
  //       return shipment
  //     }))
  //   }, 30000) // Update every 30 seconds

  //   return () => clearInterval(interval)
  // }, [])

  // Handle bulk selection
  const handleBulkSelect = (shipmentId: string, isSelected: boolean) => {
    setSelectedShipments((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(shipmentId);
      } else {
        newSet.delete(shipmentId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedShipments(new Set(filteredShipments.map((s) => s.id)));
    } else {
      setSelectedShipments(new Set());
    }
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const shipmentsToExport =
      selectedShipments.size > 0
        ? filteredShipments.filter((s) => selectedShipments.has(s.id))
        : filteredShipments;

    const csvHeaders = [
      'ID',
      'Status',
      'Origin',
      'Destination',
      'Carrier',
      'Progress',
      'Speed',
      'ETA',
      'Driver',
      'Phone',
      'Vehicle',
      'Priority',
      'Value',
      'Weight',
      'Commodity',
      'Customer',
      'Created',
      'Pickup',
      'Delivery',
      'Miles',
    ];

    const csvData = shipmentsToExport.map((shipment) => [
      shipment.id,
      shipment.status,
      shipment.origin,
      shipment.destination,
      shipment.carrier,
      `${shipment.progress}%`,
      `${shipment.speed} mph`,
      shipment.eta,
      shipment.driverName || '',
      shipment.driverPhone || '',
      shipment.vehicleInfo || '',
      shipment.priority,
      `$${shipment.value.toLocaleString()}`,
      `${shipment.weight.toLocaleString()} lbs`,
      shipment.commodity,
      shipment.customerName || '',
      shipment.createdDate || '',
      shipment.pickupDate || '',
      shipment.deliveryDate || '',
      shipment.miles || '',
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `fleetflow-shipments-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedShipments.size === 0) return;

    const validStatuses = [
      'in-transit',
      'delivered',
      'delayed',
      'loading',
      'unloading',
    ];
    if (!validStatuses.includes(newStatus)) return;

    setShipments((prev) =>
      prev.map((shipment) =>
        selectedShipments.has(shipment.id)
          ? { ...shipment, status: newStatus as any }
          : shipment
      )
    );
    setSelectedShipments(new Set());
  };

  // Apply filter preset
  const applyFilterPreset = (presetId: string) => {
    const preset = filterPresets.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    setFilterStatus(preset.filters.status);
    setSelectedPriority(preset.filters.priority);
    setDateRange(preset.filters.dateRange);
    setSearchTerm(preset.filters.searchTerm);
    setValueRange(preset.filters.valueRange);
    setSelectedCarriers(preset.filters.carriers);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterStatus([]);
    setSelectedPriority([]);
    setDateRange(null);
    setSearchTerm('');
    setValueRange(null);
    setSelectedCarriers([]);
    setSelectedPreset('all');
  };

  // Filter shipments based on current filters
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      // Status filter
      if (filterStatus.length > 0 && !filterStatus.includes(shipment.status)) {
        return false;
      }

      // Priority filter
      if (
        selectedPriority.length > 0 &&
        !selectedPriority.includes(shipment.priority)
      ) {
        return false;
      }

      // Date range filter
      if (dateRange && shipment.createdDate) {
        const shipmentDate = new Date(shipment.createdDate);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        if (shipmentDate < startDate || shipmentDate > endDate) {
          return false;
        }
      }

      // Value range filter
      if (valueRange) {
        if (
          shipment.value < valueRange.min ||
          shipment.value > valueRange.max
        ) {
          return false;
        }
      }

      // Carrier filter
      if (
        selectedCarriers.length > 0 &&
        !selectedCarriers.includes(shipment.carrier)
      ) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          shipment.id.toLowerCase().includes(searchLower) ||
          shipment.carrier.toLowerCase().includes(searchLower) ||
          shipment.origin.toLowerCase().includes(searchLower) ||
          shipment.destination.toLowerCase().includes(searchLower) ||
          shipment.driverName?.toLowerCase().includes(searchLower) ||
          shipment.customerName?.toLowerCase().includes(searchLower) ||
          shipment.commodity.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [
    shipments,
    filterStatus,
    selectedPriority,
    dateRange,
    searchTerm,
    valueRange,
    selectedCarriers,
  ]);

  // Sort filtered shipments
  const sortedShipments = useMemo(() => {
    return [...filteredShipments].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'eta':
          comparison = new Date(a.eta).getTime() - new Date(b.eta).getTime();
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'created':
          comparison =
            new Date(a.createdDate || '').getTime() -
            new Date(b.createdDate || '').getTime();
          break;
        case 'miles':
          comparison = (a.miles || 0) - (b.miles || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredShipments, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit':
        return '#3b82f6';
      case 'delivered':
        return '#10b981';
      case 'delayed':
        return '#ef4444';
      case 'loading':
        return '#f59e0b';
      case 'unloading':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Stats calculations
  const stats = useMemo(() => {
    const totalShipments = shipments.length;
    const inTransit = shipments.filter((s) => s.status === 'in-transit').length;
    const delivered = shipments.filter((s) => s.status === 'delivered').length;
    const delayed = shipments.filter((s) => s.status === 'delayed').length;
    const totalValue = shipments.reduce((sum, s) => sum + s.value, 0);
    const avgProgress =
      shipments.reduce((sum, s) => sum + s.progress, 0) / totalShipments;
    const totalMiles = shipments.reduce((sum, s) => sum + (s.miles || 0), 0);
    const highPriority = shipments.filter((s) => s.priority === 'high').length;

    return {
      totalShipments,
      inTransit,
      delivered,
      delayed,
      totalValue,
      avgProgress,
      totalMiles,
      highPriority,
      onTimeRate: Math.round((delivered / (delivered + delayed)) * 100 || 0),
    };
  }, [shipments]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '16px 24px' }}>
        <Link href='/'>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>📍</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Live Load Tracking Center
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Real-time shipment monitoring & intelligent logistics
                  management
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                    ></div>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Live Tracking Active
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📊 Reports
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #059669, #047857)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #10b981, #059669)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                + New Shipment
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'tracking', label: 'Live Tracking', icon: '🗺️' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              style={{
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background:
                  activeView === tab.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.15)',
                color: activeView === tab.id ? '#1e40af' : 'white',
                backdropFilter: 'blur(10px)',
                border:
                  activeView === tab.id
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                transform:
                  activeView === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:
                  activeView === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                    : 'none',
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* Total Shipments */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Total Shipments
                    </p>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {stats.totalShipments}
                    </p>
                    <p
                      style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}
                    >
                      Active tracking
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>📦</span>
                  </div>
                </div>
              </div>

              {/* In Transit */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      In Transit
                    </p>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {stats.inTransit}
                    </p>
                    <p
                      style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}
                    >
                      Moving now
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>🚛</span>
                  </div>
                </div>
              </div>

              {/* Delivered */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Delivered
                    </p>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {stats.delivered}
                    </p>
                    <p
                      style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}
                    >
                      Completed
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>✅</span>
                  </div>
                </div>
              </div>

              {/* Total Value */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      Total Value
                    </p>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {formatCurrency(stats.totalValue)}
                    </p>
                    <p
                      style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}
                    >
                      Cargo value
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Shipments */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px',
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Recent Shipments
                </h2>
                <button
                  onClick={() => setActiveView('tracking')}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View All
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {sortedShipments.slice(0, 5).map((shipment) => (
                  <div
                    key={shipment.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: getStatusColor(shipment.status),
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        {shipment.id.split('-')[1]}
                      </div>
                      <div>
                        <h3
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                          }}
                        >
                          {shipment.origin} → {shipment.destination}
                        </h3>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          {shipment.carrier} • {shipment.driverName}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '32px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {shipment.progress}%
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            margin: 0,
                          }}
                        >
                          Progress
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            color: getStatusColor(shipment.status),
                            fontSize: '14px',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {formatStatus(shipment.status)}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            margin: 0,
                          }}
                        >
                          Status
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {formatCurrency(shipment.value)}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            margin: 0,
                          }}
                        >
                          Value
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 24px 0',
                }}
              >
                Quick Actions
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px',
                }}
              >
                <button
                  onClick={() => setActiveView('tracking')}
                  style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                    🗺️
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Live Tracking Map
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Real-time visualization of all shipments
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('analytics')}
                  style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                    📈
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Analytics Dashboard
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Performance insights and reports
                  </p>
                </button>

                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                    📊
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Export Data
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Download shipment reports as CSV
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Tracking Tab */}
        {activeView === 'tracking' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '24px 32px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                🗺️ Live Tracking Map
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Real-time shipment monitoring with interactive map visualization
              </p>
            </div>

            <div style={{ padding: '32px' }}>
              {/* Filter Presets */}
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Filter Presets:
                  </span>
                  {filterPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyFilterPreset(preset.id)}
                      style={{
                        background:
                          selectedPreset === preset.id
                            ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}
                >
                  <input
                    type='text'
                    placeholder='Search shipments, carriers, drivers, customers, commodities...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                  </button>
                </div>

                {/* Advanced Filters */}
                {showAdvancedFilters && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {/* Date Range Filter */}
                    <div>
                      <label
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Date Range:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type='date'
                          value={dateRange?.start || ''}
                          onChange={(e) =>
                            setDateRange((prev) => ({
                              ...prev,
                              start: e.target.value,
                              end: prev?.end || '',
                            }))
                          }
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        />
                        <input
                          type='date'
                          value={dateRange?.end || ''}
                          onChange={(e) =>
                            setDateRange((prev) => ({
                              ...prev,
                              end: e.target.value,
                              start: prev?.start || '',
                            }))
                          }
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Value Range Filter */}
                    <div>
                      <label
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Value Range:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type='number'
                          placeholder='Min'
                          value={valueRange?.min || ''}
                          onChange={(e) =>
                            setValueRange((prev) => ({
                              ...prev,
                              min: parseInt(e.target.value) || 0,
                              max: prev?.max || 1000000,
                            }))
                          }
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        />
                        <input
                          type='number'
                          placeholder='Max'
                          value={valueRange?.max || ''}
                          onChange={(e) =>
                            setValueRange((prev) => ({
                              ...prev,
                              max: parseInt(e.target.value) || 1000000,
                              min: prev?.min || 0,
                            }))
                          }
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Sort By:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        >
                          <option value='id'>ID</option>
                          <option value='status'>Status</option>
                          <option value='eta'>ETA</option>
                          <option value='progress'>Progress</option>
                          <option value='created'>Created Date</option>
                          <option value='miles'>Miles</option>
                        </select>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value as any)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        >
                          <option value='asc'>Ascending</option>
                          <option value='desc'>Descending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bulk Operations */}
              {selectedShipments.size > 0 && (
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '14px' }}>
                    {selectedShipments.size} of {filteredShipments.length}{' '}
                    selected
                  </span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={handleExportCSV}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Export Selected
                    </button>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkStatusUpdate(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                    >
                      <option value=''>Update Status</option>
                      <option value='in-transit'>In Transit</option>
                      <option value='delivered'>Delivered</option>
                      <option value='delayed'>Delayed</option>
                      <option value='loading'>Loading</option>
                      <option value='unloading'>Unloading</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Map and Shipment List */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 400px',
                  gap: '24px',
                  minHeight: '600px',
                }}
              >
                {/* Map */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <MapComponent
                    shipments={sortedShipments}
                    selectedShipment={selectedShipment?.id || null}
                    onSelectShipment={(shipmentId) => {
                      const shipment = shipmentId
                        ? sortedShipments.find((s) => s.id === shipmentId)
                        : null;
                      setSelectedShipment(shipment || null);
                    }}
                    autoTracking={true}
                    showRoutes={true}
                    mapFeatures={mapFeatures}
                  />
                </div>

                {/* Shipment List */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      Shipments ({filteredShipments.length})
                    </h3>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={
                          selectedShipments.size === filteredShipments.length &&
                          filteredShipments.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        style={{ margin: 0 }}
                      />
                      Select All
                    </label>
                  </div>
                  <div
                    style={{
                      maxHeight: '540px',
                      overflowY: 'auto',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {sortedShipments.map((shipment) => (
                      <ShipmentCard
                        key={shipment.id}
                        shipment={shipment}
                        isSelected={selectedShipment?.id === shipment.id}
                        onSelect={() => setSelectedShipment(shipment)}
                        getStatusColor={getStatusColor}
                        formatStatus={formatStatus}
                        getPriorityColor={getPriorityColor}
                        formatCurrency={formatCurrency}
                        isSelectedForBulk={selectedShipments.has(shipment.id)}
                        onBulkSelect={handleBulkSelect}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeView === 'analytics' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '24px 32px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                📈 Analytics Dashboard
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Performance insights and comprehensive shipping analytics
              </p>
            </div>

            <div style={{ padding: '32px' }}>
              {/* KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    ⚡
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {Math.round(stats.avgProgress)}%
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Avg Progress
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    🎯
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.onTimeRate}%
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    On-Time Rate
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    🚚
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.totalMiles.toLocaleString()}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Total Miles
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    ⚠️
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.highPriority}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    High Priority
                  </p>
                </div>
              </div>

              {/* Status Distribution */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '32px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0',
                  }}
                >
                  Status Distribution
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {[
                    {
                      status: 'in-transit',
                      count: stats.inTransit,
                      color: '#3b82f6',
                    },
                    {
                      status: 'delivered',
                      count: stats.delivered,
                      color: '#10b981',
                    },
                    {
                      status: 'delayed',
                      count: stats.delayed,
                      color: '#ef4444',
                    },
                    {
                      status: 'loading',
                      count: shipments.filter((s) => s.status === 'loading')
                        .length,
                      color: '#f59e0b',
                    },
                    {
                      status: 'unloading',
                      count: shipments.filter((s) => s.status === 'unloading')
                        .length,
                      color: '#8b5cf6',
                    },
                  ].map((item) => (
                    <div
                      key={item.status}
                      style={{
                        background: `${item.color}20`,
                        border: `1px solid ${item.color}40`,
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          color: item.color,
                          fontSize: '24px',
                          fontWeight: 'bold',
                          marginBottom: '4px',
                        }}
                      >
                        {item.count}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {formatStatus(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carrier Performance */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0',
                  }}
                >
                  Carrier Performance
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {Array.from(new Set(shipments.map((s) => s.carrier))).map(
                    (carrier) => {
                      const carrierShipments = shipments.filter(
                        (s) => s.carrier === carrier
                      );
                      const avgProgress =
                        carrierShipments.reduce(
                          (sum, s) => sum + s.progress,
                          0
                        ) / carrierShipments.length;
                      const onTimeCount = carrierShipments.filter(
                        (s) => s.status === 'delivered'
                      ).length;
                      const delayedCount = carrierShipments.filter(
                        (s) => s.status === 'delayed'
                      ).length;
                      const onTimeRate =
                        (onTimeCount / (onTimeCount + delayedCount)) * 100 || 0;

                      return (
                        <div
                          key={carrier}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: '0 0 4px 0',
                              }}
                            >
                              {carrier}
                            </h4>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '12px',
                                margin: 0,
                              }}
                            >
                              {carrierShipments.length} shipments
                            </p>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '24px',
                            }}
                          >
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  color: '#4ade80',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {Math.round(avgProgress)}%
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '12px',
                                }}
                              >
                                Avg Progress
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  color: '#3b82f6',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {Math.round(onTimeRate)}%
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '12px',
                                }}
                              >
                                On-Time Rate
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced SummaryCard component
function EnhancedSummaryCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          fontSize: '1rem',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          color,
          fontWeight: 800,
          fontSize: '1.25rem',
          marginBottom: '3px',
          textAlign: 'center',
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: '#475569',
          fontWeight: 600,
          fontSize: '0.7rem',
          textAlign: 'center',
          lineHeight: '1.2',
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Enhanced ShipmentCard component with bulk selection
function ShipmentCard({
  shipment,
  isSelected,
  onSelect,
  getStatusColor,
  formatStatus,
  getPriorityColor,
  formatCurrency,
  isSelectedForBulk,
  onBulkSelect,
}: {
  shipment: Shipment;
  isSelected: boolean;
  onSelect: () => void;
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  formatCurrency: (value: number) => string;
  isSelectedForBulk?: boolean;
  onBulkSelect?: (shipmentId: string, isSelected: boolean) => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected
          ? 'rgba(59, 130, 246, 0.15)'
          : 'rgba(255, 255, 255, 0.95)',
        border: isSelected
          ? '1px solid rgba(59, 130, 246, 0.4)'
          : '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        margin: '0 16px 12px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          {/* Bulk Selection Checkbox */}
          {onBulkSelect && (
            <input
              type='checkbox'
              checked={isSelectedForBulk || false}
              onChange={(e) => {
                e.stopPropagation();
                onBulkSelect(shipment.id, e.target.checked);
              }}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#3b82f6',
                marginTop: '2px',
              }}
            />
          )}
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: '#0f172a',
                marginBottom: '4px',
              }}
            >
              {shipment.id}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#475569',
                marginBottom: '4px',
              }}
            >
              {shipment.carrier}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div
            style={{
              background: getStatusColor(shipment.status),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.625rem',
              fontWeight: 600,
            }}
          >
            {formatStatus(shipment.status)}
          </div>
          <div
            style={{
              background: getPriorityColor(shipment.priority),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.625rem',
              fontWeight: 600,
            }}
          >
            {shipment.priority.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            marginBottom: '2px',
          }}
        >
          From: {shipment.origin}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            marginBottom: '2px',
          }}
        >
          To: {shipment.destination}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
          }}
        >
          ETA: {shipment.eta}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <span style={{ fontSize: '0.625rem', color: '#475569' }}>
            Progress
          </span>
          <span
            style={{ fontSize: '0.625rem', color: '#0f172a', fontWeight: 600 }}
          >
            {shipment.progress}%
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(148, 163, 184, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${shipment.progress}%`,
              height: '100%',
              background: getStatusColor(shipment.status),
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Driver and Vehicle Info */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            marginBottom: '2px',
          }}
        >
          Driver: {shipment.driverName}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            marginBottom: '2px',
          }}
        >
          Vehicle: {shipment.vehicleInfo}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
          }}
        >
          Speed: {shipment.speed} mph
        </div>
      </div>

      {/* Cargo Info */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            marginBottom: '2px',
          }}
        >
          Cargo: {shipment.commodity}
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
            marginBottom: '2px',
          }}
        >
          Weight: {shipment.weight.toLocaleString()} lbs
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#334155',
          }}
        >
          Value: {formatCurrency(shipment.value)}
        </div>
      </div>

      {/* Alerts */}
      {shipment.alerts && shipment.alerts.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div
            style={{
              fontSize: '0.625rem',
              color: '#f59e0b',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            🚨 Alerts:
          </div>
          {shipment.alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                fontSize: '0.625rem',
                color: '#fbbf24',
                marginLeft: '8px',
              }}
            >
              • {alert}
            </div>
          ))}
        </div>
      )}

      {/* Last Update */}
      <div
        style={{
          fontSize: '0.625rem',
          color: '#64748b',
          textAlign: 'right',
        }}
      >
        Updated: {shipment.lastUpdate}
      </div>
    </div>
  );
}
