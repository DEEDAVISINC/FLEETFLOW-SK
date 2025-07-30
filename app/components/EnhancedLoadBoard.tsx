'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import EDIService from '../services/EDIService';
import LoadIdentificationService from '../services/LoadIdentificationService';
import {
  Load,
  getBrokerLoads,
  getDispatcherLoads,
  getLoadStats,
  getMainDashboardLoads,
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

  // Generate proper Load Identifier ID for loads
  const generateProperLoadId = (load: Load) => {
    try {
      const currentUser = getCurrentUser();
      const brokerInitials =
        currentUser.initials ||
        currentUser.name
          ?.split(' ')
          .map((n) => n[0])
          .join('') ||
        'FL';

      const identifiers = LoadIdentificationService.generateLoadIdentifiers({
        origin: load.origin,
        destination: load.destination,
        pickupDate: load.pickupDate || new Date().toISOString(),
        equipment: load.equipment,
        loadType: load.loadType as
          | 'FTL'
          | 'LTL'
          | 'Partial'
          | 'Expedited'
          | 'Hazmat',
        brokerInitials: brokerInitials,
        shipperName: load.shipperName,
        weight: load.weight?.toString(),
        rate: load.rate,
      });

      return identifiers.loadId;
    } catch (error) {
      console.error('Error generating load identifier:', error);
      return load.id; // Fallback to original ID
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = getCurrentUser();

        // Get loads based on user role and flow stage
        let userLoads: Load[] = [];

        if (currentUser.role === 'broker') {
          // Brokers see their own loads in broker board
          userLoads = getBrokerLoads(currentUser.id);
        } else if (currentUser.role === 'dispatcher') {
          // Dispatchers see loads assigned to them
          userLoads = getDispatcherLoads(currentUser.id);
        } else {
          // Other users see all loads
          userLoads = getMainDashboardLoads();
        }

        // Add Load Board Numbers to loads that don't have them
        const loadsWithProperIds = userLoads.map((load) => ({
          ...load,
          properLoadId: generateProperLoadId(load),
          loadBoardNumber:
            load.loadBoardNumber || generateLoadBoardNumber(load),
        }));

        setLoads(loadsWithProperIds);
        setFilteredLoads(loadsWithProperIds);

        const loadStats = getLoadStats();
        setStats(loadStats);
      } catch (error) {
        console.error('Error loading loads:', error);
      }
    };

    loadData();
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
          load.properLoadId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          {/* Search */}
          <div>
            <input
              type='text'
              placeholder='Search by Load Identifier, ID, route, broker, equipment, dispatcher, or Load Board Number...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                width: '300px',
                backdropFilter: 'blur(10px)',
              }}
            />
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
              <div>Actions</div>
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
                  {load.properLoadId || load.id}
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
                <div>
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
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
