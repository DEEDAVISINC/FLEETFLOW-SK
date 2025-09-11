'use client';

import { useEffect, useState } from 'react';
import {
  CrossPortalRelationships,
  LoadboardFilters,
  unifiedLoadboardService,
} from '../services/UnifiedLoadboardService';
import { Load } from '../services/loadService';

interface UnifiedLoadboardProps {
  portalId: string;
  title?: string;
  showFilters?: boolean;
  showCrossPortalInfo?: boolean;
  showRealTimeStatus?: boolean;
  maxLoads?: number;
  className?: string;
}

export default function UnifiedLoadboard({
  portalId,
  title = 'Unified Loadboard',
  showFilters = true,
  showCrossPortalInfo = true,
  showRealTimeStatus = true,
  maxLoads = 50,
  className = '',
}: UnifiedLoadboardProps) {
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filters, setFilters] = useState<LoadboardFilters>({
    status: 'all',
    equipment: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [crossPortalInfo, setCrossPortalInfo] =
    useState<CrossPortalRelationships>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  useEffect(() => {
    let subscriptionId: string;

    const initializeLoadboard = async () => {
      try {
        // Subscribe to real-time loadboard updates
        subscriptionId = unifiedLoadboardService.subscribeToLoadboard(
          portalId,
          (updatedLoads) => {
            setLoads(updatedLoads);
            setLastSync(new Date());
            setIsLoading(false);
          }
        );

        // Get initial loads for this portal
        const initialLoads = unifiedLoadboardService.getLoadsForPortal(
          portalId,
          filters
        );
        setLoads(initialLoads);

        // Get initial stats
        const initialStats = unifiedLoadboardService.getRealTimeStats(portalId);
        setStats(initialStats);

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing unified loadboard:', error);
        setIsLoading(false);
      }
    };

    initializeLoadboard();

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionId) {
        unifiedLoadboardService.unsubscribeFromLoadboard(subscriptionId);
      }
    };
  }, [portalId]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...loads];

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((load) => load.status === filters.status);
    }

    // Apply equipment filter
    if (filters.equipment && filters.equipment !== 'all') {
      filtered = filtered.filter(
        (load) => load.equipment === filters.equipment
      );
    }

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (load) =>
          load.id.toLowerCase().includes(searchLower) ||
          load.origin.toLowerCase().includes(searchLower) ||
          load.destination.toLowerCase().includes(searchLower) ||
          (load.brokerName &&
            load.brokerName.toLowerCase().includes(searchLower)) ||
          (load.dispatcherName &&
            load.dispatcherName.toLowerCase().includes(searchLower))
      );
    }

    // Limit results
    if (maxLoads && filtered.length > maxLoads) {
      filtered = filtered.slice(0, maxLoads);
    }

    setFilteredLoads(filtered);
  }, [loads, filters, searchTerm, maxLoads]);

  // Update stats when loads change
  useEffect(() => {
    const newStats = unifiedLoadboardService.getRealTimeStats(portalId);
    setStats(newStats);
  }, [loads, portalId]);

  // Handle load selection for cross-portal info
  const handleLoadSelect = (load: Load) => {
    setSelectedLoad(load);
    if (showCrossPortalInfo) {
      const crossPortal =
        unifiedLoadboardService.getCrossPortalLoadRelationships(load.id);
      setCrossPortalInfo(crossPortal);
    }
  };

  // Handle filter changes
  const handleFilterChange = (
    filterType: keyof LoadboardFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Force synchronization
  const handleForceSync = () => {
    unifiedLoadboardService.forceSynchronization();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Available: 'bg-green-100 text-green-800 border-green-200',
      Assigned: 'bg-blue-100 text-blue-800 border-blue-200',
      'In Transit': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Delivered: 'bg-purple-100 text-purple-800 border-purple-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200',
      Broadcasted: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={`rounded-lg bg-white p-6 shadow-lg ${className}`}>
        <div className='animate-pulse'>
          <div className='mb-4 h-6 w-1/3 rounded bg-gray-200' />
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-16 rounded bg-gray-200' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-white shadow-lg ${className}`}>
      {/* Header */}
      <div className='border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
            <p className='text-sm text-gray-600'>
              Last synchronized: {lastSync.toLocaleTimeString()}
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            {showRealTimeStatus && (
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                <span className='text-sm text-gray-600'>Live</span>
              </div>
            )}
            <button
              onClick={handleForceSync}
              className='rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600'
            >
              🔄 Sync
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className='border-b border-gray-200 bg-gray-50 px-6 py-3'>
        <div className='flex items-center space-x-6 text-sm'>
          <div className='flex items-center space-x-2'>
            <span className='font-medium text-gray-700'>Total:</span>
            <span className='font-bold text-blue-600'>{stats.total || 0}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <span className='font-medium text-gray-700'>Available:</span>
            <span className='font-bold text-green-600'>
              {stats.available || 0}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <span className='font-medium text-gray-700'>In Transit:</span>
            <span className='font-bold text-yellow-600'>
              {stats.inTransit || 0}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <span className='font-medium text-gray-700'>Delivered:</span>
            <span className='font-bold text-purple-600'>
              {stats.delivered || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      {showFilters && (
        <div className='border-b border-gray-200 bg-gray-50 px-6 py-4'>
          <div className='flex flex-wrap items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium text-gray-700'>
                Status:
              </label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className='rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>All Statuses</option>
                <option value='Available'>Available</option>
                <option value='Assigned'>Assigned</option>
                <option value='In Transit'>In Transit</option>
                <option value='Delivered'>Delivered</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
            </div>

            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium text-gray-700'>
                Equipment:
              </label>
              <select
                value={filters.equipment || 'all'}
                onChange={(e) =>
                  handleFilterChange('equipment', e.target.value)
                }
                className='rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>All Equipment</option>
                <option value='Dry Van'>Dry Van</option>
                <option value='Flatbed'>Flatbed</option>
                <option value='Reefer'>Reefer</option>
                <option value='Power Only'>Power Only</option>
              </select>
            </div>

            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium text-gray-700'>
                Search:
              </label>
              <input
                type='text'
                placeholder='Search loads...'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className='w-48 rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>
      )}

      {/* Loads Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Load ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Origin → Destination
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Rate
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Equipment
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Broker
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Dispatcher
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                Pickup Date
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {filteredLoads.map((load) => (
              <tr
                key={load.id}
                onClick={() => handleLoadSelect(load)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedLoad?.id === load.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className='px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                  {load.loadBoardNumber || load.id}
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                  <div>
                    <div className='font-medium'>{load.origin}</div>
                    <div className='text-gray-500'>→</div>
                    <div className='font-medium'>{load.destination}</div>
                  </div>
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                  {formatCurrency(load.rate)}
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                  {load.equipment}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusColor(load.status)}`}
                  >
                    {load.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                  {load.brokerName || 'N/A'}
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                  {load.dispatcherName || 'Unassigned'}
                </td>
                <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                  {formatDate(load.pickupDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-Portal Information */}
      {showCrossPortalInfo &&
        selectedLoad &&
        Object.keys(crossPortalInfo).length > 0 && (
          <div className='border-t border-blue-200 bg-blue-50 px-6 py-4'>
            <h3 className='mb-3 text-lg font-semibold text-blue-900'>
              Cross-Portal Information for Load {selectedLoad.id}
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {crossPortalInfo.brokerPortal && (
                <div className='rounded border border-blue-200 bg-white p-3'>
                  <h4 className='mb-2 font-medium text-blue-800'>
                    Broker Portal
                  </h4>
                  <div className='space-y-1 text-sm'>
                    <div>
                      <span className='font-medium'>Broker:</span>{' '}
                      {crossPortalInfo.brokerPortal.brokerName}
                    </div>
                    <div>
                      <span className='font-medium'>Shipper:</span>{' '}
                      {crossPortalInfo.brokerPortal.shipperName}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>{' '}
                      {crossPortalInfo.brokerPortal.status}
                    </div>
                  </div>
                </div>
              )}

              {crossPortalInfo.dispatchCentral && (
                <div className='rounded border border-blue-200 bg-white p-3'>
                  <h4 className='mb-2 font-medium text-blue-800'>
                    Dispatch Central
                  </h4>
                  <div className='space-y-1 text-sm'>
                    <div>
                      <span className='font-medium'>Dispatcher:</span>{' '}
                      {crossPortalInfo.dispatchCentral.dispatcherName}
                    </div>
                    <div>
                      <span className='font-medium'>Assigned:</span>{' '}
                      {formatDate(
                        crossPortalInfo.dispatchCentral.assignmentDate || ''
                      )}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>{' '}
                      {crossPortalInfo.dispatchCentral.status}
                    </div>
                  </div>
                </div>
              )}

              {crossPortalInfo.vendorPortal && (
                <div className='rounded border border-blue-200 bg-white p-3'>
                  <h4 className='mb-2 font-medium text-blue-800'>
                    Vendor Portal
                  </h4>
                  <div className='space-y-1 text-sm'>
                    <div>
                      <span className='font-medium'>Shipper:</span>{' '}
                      {crossPortalInfo.vendorPortal.shipperName}
                    </div>
                    <div>
                      <span className='font-medium'>Shipment Status:</span>{' '}
                      {crossPortalInfo.vendorPortal.shipmentStatus}
                    </div>
                  </div>
                </div>
              )}

              {crossPortalInfo.carrierPortal && (
                <div className='rounded border border-blue-200 bg-white p-3'>
                  <h4 className='mb-2 font-medium text-blue-800'>
                    Carrier Portal
                  </h4>
                  <div className='space-y-1 text-sm'>
                    <div>
                      <span className='font-medium'>Driver:</span>{' '}
                      {crossPortalInfo.carrierPortal.driverName}
                    </div>
                    <div>
                      <span className='font-medium'>Status:</span>{' '}
                      {crossPortalInfo.carrierPortal.status}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Empty State */}
      {filteredLoads.length === 0 && (
        <div className='px-6 py-12 text-center'>
          <div className='mb-4 text-6xl text-gray-400'>🚛</div>
          <h3 className='mb-2 text-lg font-medium text-gray-900'>
            No loads found
          </h3>
          <p className='text-gray-500'>
            {searchTerm ||
            filters.status !== 'all' ||
            filters.equipment !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'No loads are currently available for this portal'}
          </p>
        </div>
      )}
    </div>
  );
}
