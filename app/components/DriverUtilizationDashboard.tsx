'use client';

import {
  AlertTriangle,
  Battery,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Package,
  Search,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DriverUtilizationMetrics {
  driverId: string;
  driverName: string;
  currentStatus: 'driving' | 'loading' | 'unloading' | 'resting' | 'available';
  utilizationScore: number; // 0-100
  hoursWorkedToday: number;
  hoursWorkedThisWeek: number;
  remainingHours: {
    daily: number;
    weekly: number;
  };
  truckCapacity: {
    weight: number; // percentage used
    volume: number; // percentage used
    pallets: number; // count used
    revenue: number; // current load value
  };
  currentLoads: number;
  nextDelivery?: {
    location: string;
    estimatedTime: string;
    hoursRemaining: number;
  };
  opportunities: {
    available: number;
    recommended: number;
    potentialRevenue: number;
  };
  performance: {
    revenueToday: number;
    revenueThisWeek: number;
    milesThisWeek: number;
    onTimePercentage: number;
  };
}

interface FleetUtilizationSummary {
  totalDrivers: number;
  activeDrivers: number;
  averageUtilization: number;
  totalRevenue: number;
  totalHours: number;
  hosCompliance: number;
  optimizationOpportunities: number;
}

export default function DriverUtilizationDashboard() {
  const [allDrivers, setAllDrivers] = useState<DriverUtilizationMetrics[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<
    DriverUtilizationMetrics[]
  >([]);
  const [fleetSummary, setFleetSummary] = useState<FleetUtilizationSummary>({
    totalDrivers: 0,
    activeDrivers: 0,
    averageUtilization: 0,
    totalRevenue: 0,
    totalHours: 0,
    hosCompliance: 0,
    optimizationOpportunities: 0,
  });
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Filtering and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [utilizationFilter, setUtilizationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'name' | 'utilization' | 'revenue' | 'hours'
  >('utilization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(12); // Show 12 drivers per page
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Mock data - in production, this would come from your real-time data source
  useEffect(() => {
    const generateMockData = (): DriverUtilizationMetrics[] => {
      const firstNames = [
        'John',
        'Maria',
        'David',
        'Sarah',
        'Mike',
        'Lisa',
        'Robert',
        'Jennifer',
        'Michael',
        'Linda',
        'William',
        'Elizabeth',
        'Richard',
        'Patricia',
        'Charles',
        'Barbara',
        'Joseph',
        'Susan',
        'Thomas',
        'Jessica',
        'Christopher',
        'Karen',
        'Daniel',
        'Nancy',
        'Matthew',
        'Betty',
        'Anthony',
        'Helen',
        'Mark',
        'Sandra',
        'Donald',
        'Donna',
        'Steven',
        'Carol',
        'Paul',
        'Ruth',
        'Andrew',
        'Sharon',
        'Joshua',
        'Michelle',
        'Kenneth',
        'Laura',
        'Kevin',
        'Sarah',
        'Brian',
        'Kimberly',
      ];

      const lastNames = [
        'Rodriguez',
        'Santos',
        'Thompson',
        'Johnson',
        'Chen',
        'Williams',
        'Brown',
        'Davis',
        'Miller',
        'Wilson',
        'Moore',
        'Taylor',
        'Anderson',
        'Thomas',
        'Jackson',
        'White',
        'Harris',
        'Martin',
        'Garcia',
        'Martinez',
        'Robinson',
        'Clark',
        'Lewis',
        'Lee',
        'Walker',
        'Hall',
        'Allen',
        'Young',
        'Hernandez',
        'King',
        'Wright',
        'Lopez',
        'Hill',
        'Scott',
        'Green',
        'Adams',
        'Baker',
        'Gonzalez',
        'Nelson',
        'Carter',
        'Mitchell',
        'Perez',
        'Roberts',
        'Turner',
      ];

      // Driver data will be loaded from fleet management system
      const drivers: any[] = [];
      return drivers;
    };

    const updateData = () => {
      // Driver data will be loaded from real fleet management service
      const driverData: any[] = [];
      setAllDrivers(driverData);

      // Calculate fleet summary
      const summary: FleetUtilizationSummary = {
        totalDrivers: driverData.length,
        activeDrivers: driverData.filter((d) => d.currentStatus !== 'resting')
          .length,
        averageUtilization:
          driverData.reduce((sum, d) => sum + d.utilizationScore, 0) /
          driverData.length,
        totalRevenue: driverData.reduce(
          (sum, d) => sum + d.performance.revenueToday,
          0
        ),
        totalHours: driverData.reduce((sum, d) => sum + d.hoursWorkedToday, 0),
        hosCompliance:
          (driverData.filter((d) => d.remainingHours.daily > 1).length /
            driverData.length) *
          100,
        optimizationOpportunities: driverData.reduce(
          (sum, d) => sum + d.opportunities.recommended,
          0
        ),
      };
      setFleetSummary(summary);
    };

    updateData();

    // Auto-refresh every 30 seconds if enabled
    const interval = autoRefresh ? setInterval(updateData, 30000) : undefined;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Filter and sort drivers
  useEffect(() => {
    let filtered = [...allDrivers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (driver) =>
          driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.driverId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (driver) => driver.currentStatus === statusFilter
      );
    }

    // Apply utilization filter
    if (utilizationFilter !== 'all') {
      switch (utilizationFilter) {
        case 'high':
          filtered = filtered.filter((driver) => driver.utilizationScore >= 80);
          break;
        case 'medium':
          filtered = filtered.filter(
            (driver) =>
              driver.utilizationScore >= 50 && driver.utilizationScore < 80
          );
          break;
        case 'low':
          filtered = filtered.filter((driver) => driver.utilizationScore < 50);
          break;
        case 'needs-optimization':
          filtered = filtered.filter(
            (driver) => driver.opportunities.recommended > 0
          );
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'name':
          aValue = a.driverName;
          bValue = b.driverName;
          break;
        case 'utilization':
          aValue = a.utilizationScore;
          bValue = b.utilizationScore;
          break;
        case 'revenue':
          aValue = a.performance.revenueToday;
          bValue = b.performance.revenueToday;
          break;
        case 'hours':
          aValue = a.hoursWorkedToday;
          bValue = b.hoursWorkedToday;
          break;
        default:
          aValue = a.utilizationScore;
          bValue = b.utilizationScore;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    setFilteredDrivers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    allDrivers,
    searchTerm,
    statusFilter,
    utilizationFilter,
    sortBy,
    sortOrder,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'driving':
        return '#3b82f6';
      case 'loading':
        return '#f59e0b';
      case 'unloading':
        return '#8b5cf6';
      case 'available':
        return '#10b981';
      case 'resting':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getUtilizationColor = (score: number) => {
    if (score >= 85) return '#10b981'; // Green - excellent
    if (score >= 70) return '#f59e0b'; // Yellow - good
    if (score >= 50) return '#f97316'; // Orange - fair
    return '#ef4444'; // Red - poor
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TrendingUp size={28} style={{ color: '#3b82f6' }} />
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
              }}
            >
              Driver Utilization Dashboard
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              {filteredDrivers.length} of {allDrivers.length} drivers shown
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            Auto-refresh (30s)
          </label>
          <div
            style={{
              padding: '4px 8px',
              background: autoRefresh
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(107, 114, 128, 0.1)',
              borderRadius: '6px',
              fontSize: '12px',
              color: autoRefresh ? '#065f46' : '#6b7280',
              fontWeight: '600',
            }}
          >
            {autoRefresh ? '🟢 LIVE' : '⏸️ PAUSED'}
          </div>
        </div>
      </div>

      {/* Fleet Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '12px',
            padding: '16px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>
              Active Drivers
            </span>
          </div>
          <div
            style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}
          >
            {fleetSummary.activeDrivers}/{fleetSummary.totalDrivers}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '12px',
            padding: '16px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Battery size={20} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>
              Avg Utilization
            </span>
          </div>
          <div
            style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}
          >
            {Math.round(fleetSummary.averageUtilization)}%
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '12px',
            padding: '16px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>
              Today's Revenue
            </span>
          </div>
          <div
            style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}
          >
            {formatCurrency(fleetSummary.totalRevenue)}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '12px',
            padding: '16px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>
              Opportunities
            </span>
          </div>
          <div
            style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}
          >
            {fleetSummary.optimizationOpportunities}
          </div>
        </div>
      </div>

      {/* Filtering and Search Controls */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          {/* Search */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px',
              }}
            >
              Search Drivers
            </label>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}
              />
              <input
                type='text'
                placeholder='Name or ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 8px 8px 32px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px',
              }}
            >
              Status
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 32px 8px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                  appearance: 'none',
                }}
              >
                <option value='all'>All Status</option>
                <option value='driving'>Driving</option>
                <option value='loading'>Loading</option>
                <option value='unloading'>Unloading</option>
                <option value='available'>Available</option>
                <option value='resting'>Resting</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Utilization Filter */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px',
              }}
            >
              Utilization
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={utilizationFilter}
                onChange={(e) => setUtilizationFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 32px 8px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                  appearance: 'none',
                }}
              >
                <option value='all'>All Levels</option>
                <option value='high'>High (80%+)</option>
                <option value='medium'>Medium (50-79%)</option>
                <option value='low'>Low (&lt;50%)</option>
                <option value='needs-optimization'>Needs Optimization</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px',
              }}
            >
              Sort By
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 32px 8px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: 'white',
                    appearance: 'none',
                  }}
                >
                  <option value='utilization'>Utilization</option>
                  <option value='revenue'>Revenue</option>
                  <option value='hours'>Hours</option>
                  <option value='name'>Name</option>
                </select>
                <ChevronDown
                  size={16}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
                style={{
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '4px',
              }}
            >
              View
            </label>
            <div
              style={{
                display: 'flex',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
              }}
            >
              <button
                onClick={() => setViewMode('table')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  background: viewMode === 'table' ? '#3b82f6' : 'white',
                  color: viewMode === 'table' ? 'white' : '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '5px 0 0 5px',
                }}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  background: viewMode === 'grid' ? '#3b82f6' : 'white',
                  color: viewMode === 'grid' ? 'white' : '#374151',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderRadius: '0 5px 5px 0',
                }}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Driver List */}
      {viewMode === 'table' ? (
        // Table View
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Driver
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Utilization
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Hours Today
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Revenue
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Capacity
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Opportunities
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentDrivers.map((driver, index) => (
                  <tr
                    key={driver.driverId}
                    style={{
                      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                      background:
                        index % 2 === 0
                          ? 'rgba(255, 255, 255, 0.5)'
                          : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Truck size={16} style={{ color: '#3b82f6' }} />
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                            }}
                          >
                            {driver.driverName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {driver.driverId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: getStatusColor(driver.currentStatus),
                          }}
                        />
                        <span
                          style={{
                            fontSize: '12px',
                            textTransform: 'capitalize',
                            color: '#374151',
                          }}
                        >
                          {driver.currentStatus}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '6px',
                            background: 'rgba(0, 0, 0, 0.1)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${driver.utilizationScore}%`,
                              height: '100%',
                              background: getUtilizationColor(
                                driver.utilizationScore
                              ),
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: getUtilizationColor(driver.utilizationScore),
                          }}
                        >
                          {driver.utilizationScore}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        {formatHours(driver.hoursWorkedToday)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {formatHours(driver.remainingHours.daily)} left
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#10b981',
                        }}
                      >
                        {formatCurrency(driver.performance.revenueToday)}
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#374151' }}>
                        {Math.round(
                          (driver.truckCapacity.weight +
                            driver.truckCapacity.volume) /
                            2
                        )}
                        %
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {driver.truckCapacity.pallets} pallets
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {driver.opportunities.recommended > 0 ? (
                        <div
                          style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'inline-block',
                          }}
                        >
                          {driver.opportunities.recommended}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          None
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() =>
                          setSelectedDriver(
                            selectedDriver === driver.driverId
                              ? null
                              : driver.driverId
                          )
                        }
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontWeight: '500',
                        }}
                      >
                        {selectedDriver === driver.driverId
                          ? 'Hide'
                          : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '16px',
          }}
        >
          {currentDrivers.map((driver) => (
            <div
              key={driver.driverId}
              onClick={() =>
                setSelectedDriver(
                  selectedDriver === driver.driverId ? null : driver.driverId
                )
              }
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: `2px solid ${
                  selectedDriver === driver.driverId
                    ? '#3b82f6'
                    : 'rgba(0, 0, 0, 0.1)'
                }`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedDriver !== driver.driverId) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDriver !== driver.driverId) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Driver Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Truck size={20} style={{ color: '#3b82f6' }} />
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    {driver.driverName}
                  </span>
                </div>

                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getStatusColor(driver.currentStatus),
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      textTransform: 'capitalize',
                    }}
                  >
                    {driver.currentStatus}
                  </span>
                </div>
              </div>

              {/* Utilization Score */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Utilization Score
                  </span>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: getUtilizationColor(driver.utilizationScore),
                    }}
                  >
                    {driver.utilizationScore}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${driver.utilizationScore}%`,
                      height: '100%',
                      background: getUtilizationColor(driver.utilizationScore),
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px',
                    }}
                  >
                    Hours Today
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    {formatHours(driver.hoursWorkedToday)} /{' '}
                    {formatHours(driver.remainingHours.daily)} left
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px',
                    }}
                  >
                    Capacity Used
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                    }}
                  >
                    {Math.round(
                      (driver.truckCapacity.weight +
                        driver.truckCapacity.volume) /
                        2
                    )}
                    % • {driver.truckCapacity.pallets} pallets
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px',
                    }}
                  >
                    Current Revenue
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#10b981',
                    }}
                  >
                    {formatCurrency(driver.truckCapacity.revenue)}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '2px',
                    }}
                  >
                    Opportunities
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#f59e0b',
                    }}
                  >
                    {driver.opportunities.recommended} recommended
                  </div>
                </div>
              </div>

              {/* Next Delivery */}
              {driver.nextDelivery && (
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    padding: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    <MapPin size={14} style={{ color: '#3b82f6' }} />
                    <span style={{ fontSize: '12px', color: '#3b82f6' }}>
                      Next Delivery
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#1f2937' }}>
                    {driver.nextDelivery.location} •{' '}
                    {formatHours(driver.nextDelivery.hoursRemaining)} remaining
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {selectedDriver === driver.driverId && (
                <div
                  style={{
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                    paddingTop: '12px',
                    marginTop: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <strong>Week Performance:</strong>
                      <br />
                      Revenue:{' '}
                      {formatCurrency(driver.performance.revenueThisWeek)}
                      <br />
                      Miles: {driver.performance.milesThisWeek.toLocaleString()}
                      <br />
                      On-time: {driver.performance.onTimePercentage}%
                    </div>
                    <div>
                      <strong>Optimization:</strong>
                      <br />
                      Available loads: {driver.opportunities.available}
                      <br />
                      Potential revenue:{' '}
                      {formatCurrency(driver.opportunities.potentialRevenue)}
                      <br />
                      <button
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          marginTop: '4px',
                        }}
                      >
                        Optimize Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredDrivers.length)} of{' '}
            {filteredDrivers.length} drivers
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: currentPage === 1 ? '#f9fafb' : 'white',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                fontSize: '14px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: currentPage === pageNum ? '#3b82f6' : 'white',
                      color: currentPage === pageNum ? 'white' : '#374151',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: currentPage === pageNum ? '600' : '400',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: currentPage === totalPages ? '#f9fafb' : 'white',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                fontSize: '14px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
          🎯 Continuous Optimization Active
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          System automatically finds and implements load consolidation
          opportunities every 5 minutes while maintaining HOS compliance
        </div>
      </div>
    </div>
  );
}
