'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import EDIService from '../services/EDIService';
import {
  Load,
  assignLoadToDispatcher,
  assignLoadToDriver,
  getGlobalLoadBoard,
  getLoadStats,
} from '../services/loadService';

export default function EnhancedLoadBoard() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'available' | 'assigned' | 'in-transit' | 'delivered'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<
    'rate' | 'distance' | 'pickupDate' | 'status'
  >('rate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [stats, setStats] = useState<any>({});
  const [viewMode, setViewMode] = useState<'table' | 'tracking'>('tracking'); // Add tracking view mode
  const [isLoading, setIsLoading] = useState(true);

  // Generate Load Board Numbers for loads that don't have them
  const generateLoadBoardNumber = (load: Load) => {
    if (load.loadBoardNumber) return load.loadBoardNumber;

    try {
      const loadBoardId = EDIService.generateLoadBoardId({
        brokerName: load.brokerName || 'FleetFlow Management',
        shipperInfo: {
          companyName: load.shipperName || 'Unknown Shipper',
          permanentId: load.shipperId,
        },
        dispatcherName: load.dispatcherName,
        loadType: load.loadType || 'FTL',
        equipment: load.equipment,
      });

      return loadBoardId.loadBoardNumber;
    } catch (error) {
      console.error('Error generating load board number:', error);
      return '000000';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const currentUser = getCurrentUser();

        // Get loads based on user role and flow stage
        let userLoads: Load[] = [];

        // Load board is global marketplace - all users see all available loads
        userLoads = getGlobalLoadBoard();

        // Add Load Board Numbers to loads that don't have them
        const loadsWithBoardNumbers = userLoads.map((load) => ({
          ...load,
          loadBoardNumber:
            load.loadBoardNumber || generateLoadBoardNumber(load),
        }));

        setLoads(loadsWithBoardNumbers);
        setFilteredLoads(loadsWithBoardNumbers);

        const loadStats = getLoadStats();
        setStats(loadStats);
      } catch (error) {
        console.error('Error loading loads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up real-time refresh every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = [...loads];

    // Filter by tab
    if (selectedTab !== 'all') {
      filtered = filtered.filter(
        (load) => load.status.toLowerCase() === selectedTab
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((load) => load.status === selectedStatus);
    }

    // Filter by equipment
    if (selectedEquipment !== 'all') {
      filtered = filtered.filter(
        (load) => load.equipment === selectedEquipment
      );
    }

    // Filter by search term (now includes Load Board Number)
    if (searchTerm) {
      filtered = filtered.filter(
        (load) =>
          load.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          load.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          load.equipment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (load.dispatcherName &&
            load.dispatcherName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (load.loadBoardNumber && load.loadBoardNumber.includes(searchTerm)) ||
          (load.shipperName &&
            load.shipperName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort loads
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'rate':
          aValue = a.rate || 0;
          bValue = b.rate || 0;
          break;
        case 'distance':
          aValue = parseFloat(a.distance?.replace(/[mi,]/g, '') || '0');
          bValue = parseFloat(b.distance?.replace(/[mi,]/g, '') || '0');
          break;
        case 'pickupDate':
          aValue = new Date(a.pickupDate || '').getTime();
          bValue = new Date(b.pickupDate || '').getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLoads(filtered);
  }, [
    loads,
    selectedTab,
    searchTerm,
    sortBy,
    sortOrder,
    selectedStatus,
    selectedEquipment,
  ]);

  const getAvailableDispatchers = () => [
    { id: 'disp-001', name: 'Sarah Johnson' },
    { id: 'disp-002', name: 'Mike Chen' },
    { id: 'disp-003', name: 'Lisa Rodriguez' },
  ];

  const handleGenerateRateConfirmation = (load: Load) => {
    // Store load data in localStorage for auto-population
    const documentData = {
      id: `rate-confirmation-${load.id}-${Date.now()}`,
      type: 'rate-confirmation',
      loadId: load.id,
      data: {
        ...load,
        carrierName: load.dispatcherName || 'TBD',
        pickupDate: new Date().toLocaleDateString(),
        deliveryDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      },
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(documentData);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Open documents page with rate confirmation tab
    window.open(`/documents?loadId=${load.id}&tab=rate-confirmation`, '_blank');
  };

  const handleGenerateBOL = (load: Load) => {
    // Store load data in localStorage for auto-population
    const documentData = {
      id: `bill-of-lading-${load.id}-${Date.now()}`,
      type: 'bill-of-lading',
      loadId: load.id,
      data: {
        ...load,
        weight: load.weight || '40,000 lbs',
        equipment: load.equipment || 'Dry Van',
        pickupDate: new Date().toLocaleDateString(),
        deliveryDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      },
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(documentData);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Open documents page with bill of lading tab
    window.open(`/documents?loadId=${load.id}&tab=bill-of-lading`, '_blank');
  };

  const handleDispatcherAssignment = (loadId: string, dispatcherId: string) => {
    if (!dispatcherId) return;

    const updatedLoad = assignLoadToDispatcher(loadId, dispatcherId);
    if (updatedLoad) {
      // Update the local state to reflect the change
      setLoads((prevLoads) =>
        prevLoads.map((load) => (load.id === loadId ? updatedLoad : load))
      );
      setFilteredLoads((prevFiltered) =>
        prevFiltered.map((load) => (load.id === loadId ? updatedLoad : load))
      );
    }
  };

  // 🚛 Driver Load Acceptance with Schedule Integration
  const handleDriverAcceptance = async (loadId: string) => {
    const currentUser = getCurrentUser();

    // For demo purposes, assume we have driver information
    const driverId = currentUser?.user?.id || 'driver-001';
    const driverName = currentUser?.user?.name || 'Demo Driver';

    try {
      const result = await assignLoadToDriver(loadId, driverId, driverName);

      if (result.success) {
        // Update the local state to reflect the change
        setLoads((prevLoads) =>
          prevLoads.map((load) => (load.id === loadId ? result.load! : load))
        );
        setFilteredLoads((prevFiltered) =>
          prevFiltered.map((load) => (load.id === loadId ? result.load! : load))
        );

        // Show success message
        const message = result.schedule
          ? `✅ Load ${loadId} accepted and added to your schedule!`
          : `✅ Load ${loadId} accepted! ${result.error ? `Note: ${result.error}` : ''}`;

        alert(message);

        console.info('✅ Load accepted and integrated with schedule:', {
          load: result.load,
          schedule: result.schedule,
        });
      } else {
        alert(`❌ Failed to accept load: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error accepting load:', error);
      alert(`❌ Error accepting load: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'assigned':
        return '#3b82f6';
      case 'in transit':
        return '#f59e0b';
      case 'delivered':
        return '#22c55e';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const uniqueStatuses = Array.from(new Set(loads.map((load) => load.status)));
  const uniqueEquipment = Array.from(
    new Set(loads.map((load) => load.equipment).filter(Boolean))
  );

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: 'linear-gradient(135deg, #22223a, #1e2748)',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <h1
        style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '30px' }}
      >
        Loads - John Smith (ID: broker-js001)
      </h1>

      {/* Header Stats */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            {
              label: 'Total Loads',
              value: stats.totalLoads || loads.length,
              color: '#10b981',
              icon: '📋',
            },
            {
              label: 'Available',
              value:
                stats.availableLoads ||
                loads.filter((l) => l.status === 'Available').length,
              color: '#3b82f6',
              icon: '🚛',
            },
            {
              label: 'Assigned',
              value:
                stats.assignedLoads ||
                loads.filter((l) => l.status === 'Assigned').length,
              color: '#f59e0b',
              icon: '📦',
            },
            {
              label: 'In Transit',
              value:
                stats.inTransitLoads ||
                loads.filter((l) => l.status === 'In Transit').length,
              color: '#22c55e',
              icon: '🚚',
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                border: `1px solid ${stat.color}40`,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
            alignItems: 'end',
          }}
        >
          {/* Search */}
          <div>
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                placeholder='🔍 Search loads...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px 8px 32px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12px',
                  width: '100%',
                  backdropFilter: 'blur(10px)',
                  color: '#1f2937',
                  transition: 'all 0.2s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
              >
                🔍
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
              }}
            >
              <option value='all'>All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
              }}
            >
              <option value='all'>All Equipment</option>
              {uniqueEquipment.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
              }}
            >
              <option value='rate'>Sort by Rate</option>
              <option value='distance'>Sort by Distance</option>
              <option value='pickupDate'>Sort by Pickup Date</option>
              <option value='status'>Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setViewMode('tracking')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                viewMode === 'tracking'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: viewMode === 'tracking' ? '#10b981' : 'white',
              border:
                viewMode === 'tracking'
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            📍 Live Tracking View
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                viewMode === 'table'
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: viewMode === 'table' ? '#3b82f6' : 'white',
              border:
                viewMode === 'table'
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            📊 Table View
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { key: 'all', label: 'All Loads', count: loads.length },
            {
              key: 'available',
              label: 'Available',
              count: loads.filter((l) => l.status === 'Available').length,
            },
            {
              key: 'assigned',
              label: 'Assigned',
              count: loads.filter((l) => l.status === 'Assigned').length,
            },
            {
              key: 'in-transit',
              label: 'In Transit',
              count: loads.filter((l) => l.status === 'In Transit').length,
            },
            {
              key: 'delivered',
              label: 'Delivered',
              count: loads.filter((l) => l.status === 'Delivered').length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              style={{
                background:
                  selectedTab === tab.key
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Load Board */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
        }}
      >
        {/* Dispatcher Assignment Info */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#60a5fa',
          }}
        >
          💡 <strong>Load Actions:</strong> 🚛 <strong>Accept Load</strong>{' '}
          button allows drivers to accept loads directly and add them to their
          schedule. <strong>Dispatcher Assignment:</strong> dropdown assigns
          loads to dispatchers. Once assigned, loads move to ""Assigned"" status.
        </div>
        {filteredLoads.length === 0 ? (
          <div
            style={{
              padding: '50px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px',
            }}
          >
            🚛 No loads found matching your criteria
          </div>
        ) : viewMode === 'tracking' ? (
          // Live Tracking View - Similar to Vendor Portal
          isLoading ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              🔄 Loading real-time load data...
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {filteredLoads.map((load, index) => (
                <div
                  key={load.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '12px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  {/* Load Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#10b981',
                        }}
                      >
                        📞 {load.loadBoardNumber || '000000'}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {load.id}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#22c55e',
                        }}
                      >
                        ${load.rate?.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {load.equipment}
                      </div>
                    </div>
                  </div>

                  {/* Route Information */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        📍 Origin
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {load.origin}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        🎯 Destination
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {load.destination}
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Tracking */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        📍 Current Location
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {load.currentLocation?.lat
                          ? 'GPS Active'
                          : 'Location Pending'}
                        , {load.origin.split(',')[1]?.trim() || 'Route Active'}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {load.currentLocation?.lat
                          ? `${load.currentLocation.lat.toFixed(4)}° N, ${load.currentLocation.lng.toFixed(4)}° W`
                          : 'GPS coordinates pending'}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        ⏰ ETA
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {new Date(
                          load.realTimeETA || load.deliveryDate
                        ).toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {load.estimatedProgress || 0}% complete
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        🚛 Status
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        <span
                          style={{
                            background: getStatusColor(load.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {load.status}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {load.distance}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Route Progress
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#10b981',
                          fontWeight: '600',
                        }}
                      >
                        {load.estimatedProgress || 0}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${load.estimatedProgress || 0}%`,
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #10b981, #22c55e)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}
                  >
                    <button
                      style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleGenerateRateConfirmation(load)}
                      style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title='Generate Rate Confirmation'
                    >
                      📄 Rate Conf
                    </button>
                    <button
                      onClick={() => handleGenerateBOL(load)}
                      style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(245, 158, 11, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title='Generate Bill of Lading'
                    >
                      📋 BOL
                    </button>
                    {load.status === 'Available' && (
                      <>
                        {/* Only show Accept Load button for dispatchers and drivers, not brokers */}
                        {getCurrentUser()?.user?.role !== 'broker' && (
                          <button
                            onClick={() => handleDriverAcceptance(load.id)}
                            style={{
                              padding: '8px 16px',
                              background:
                                'linear-gradient(135deg, #22c55e, #16a34a)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '700',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform =
                                'translateY(-2px)';
                              e.currentTarget.style.boxShadow =
                                '0 4px 16px rgba(34, 197, 94, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow =
                                '0 2px 8px rgba(34, 197, 94, 0.3)';
                            }}
                            title='Accept this load and add to your schedule'
                          >
                            🚛 Accept Load
                          </button>
                        )}
                        <select
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            fontSize: '12px',
                          }}
                          onChange={(e) =>
                            handleDispatcherAssignment(load.id, e.target.value)
                          }
                        >
                          <option value=''>Assign Dispatcher</option>
                          {getAvailableDispatchers().map((dispatcher) => (
                            <option key={dispatcher.id} value={dispatcher.id}>
                              {dispatcher.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {/* Load Board Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '80px 70px 1.2fr 1fr 100px 80px 90px 80px 90px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>📞 Board #</div>
              <div>ID</div>
              <div>Route</div>
              <div>Broker</div>
              <div>Rate</div>
              <div>Status</div>
              <div>Equipment</div>
              <div>Distance</div>
              <div>Actions & Assignment</div>
            </div>

            {/* Load Board Rows */}
            {filteredLoads.map((load, index) => (
              <div
                key={load.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '80px 70px 1.2fr 1fr 100px 80px 90px 80px 90px',
                  gap: '8px',
                  padding: '10px 12px',
                  background:
                    index % 2 === 0
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontSize: '11px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    index % 2 === 0
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)';
                }}
              >
                <div
                  style={{
                    fontWeight: '700',
                    color: '#10b981',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '4px',
                    padding: '2px 4px',
                  }}
                >
                  {load.loadBoardNumber || '000000'}
                </div>
                <div style={{ fontWeight: '600', color: '#60a5fa' }}>
                  {load.id}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{load.origin}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>
                    → {load.destination}
                  </div>
                </div>
                <div style={{ fontSize: '11px' }}>{load.brokerName}</div>
                <div style={{ fontWeight: '700', color: '#22c55e' }}>
                  ${load.rate?.toLocaleString()}
                </div>
                <div>
                  <span
                    style={{
                      background: getStatusColor(load.status),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: '600',
                    }}
                  >
                    {load.status}
                  </span>
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  {load.equipment || 'N/A'}
                </div>
                <div style={{ fontSize: '10px' }}>{load.distance}</div>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    flexDirection: 'column',
                  }}
                >
                  <button
                    style={{
                      padding: '4px 8px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: '600',
                    }}
                  >
                    View
                  </button>
                  {load.status === 'Available' && (
                    <>
                      {/* Only show Accept button for dispatchers and drivers, not brokers */}
                      {getCurrentUser()?.user?.role !== 'broker' && (
                        <button
                          onClick={() => handleDriverAcceptance(load.id)}
                          style={{
                            padding: '3px 8px',
                            background:
                              'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '8px',
                            fontWeight: '700',
                            marginBottom: '2px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background =
                              'linear-gradient(135deg, #16a34a, #15803d)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background =
                              'linear-gradient(135deg, #22c55e, #16a34a)';
                          }}
                          title='Accept this load'
                        >
                          🚛 Accept
                        </button>
                      )}
                      <select
                        value={load.dispatcherId || ''}
                        onChange={(e) =>
                          handleDispatcherAssignment(load.id, e.target.value)
                        }
                        style={{
                          padding: '2px 4px',
                          fontSize: '8px',
                          borderRadius: '3px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value=''>Assign Dispatcher</option>
                        {getAvailableDispatchers().map((dispatcher) => (
                          <option key={dispatcher.id} value={dispatcher.id}>
                            {dispatcher.name}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                  {load.dispatcherName && (
                    <div
                      style={{
                        fontSize: '8px',
                        opacity: 0.8,
                        textAlign: 'center',
                      }}
                    >
                      {load.dispatcherName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
