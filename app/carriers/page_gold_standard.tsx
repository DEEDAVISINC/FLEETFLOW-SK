'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Load, getLoadsForUser } from '../services/loadService';

export default function CarrierPortal() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load available loads for carriers
    const availableLoads = getLoadsForUser().filter(
      (load) => load.status === 'Available' || load.status === 'Draft'
    );
    setLoads(availableLoads);
  }, []);

  // Filter loads based on search
  const filteredLoads = loads.filter((load) => {
    return (
      !searchTerm ||
      load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.equipment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleBidOnLoad = (load: Load) => {
    alert(
      `Bid feature coming soon for load ${load.id}! This will allow carriers to submit competitive bids.`
    );
  };

  const getStatusColor = (status: Load['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800'
      style={{ paddingTop: '80px' }}
    >
      {/* Header */}
      <div className='p-6'>
        <Link href='/' className='inline-block'>
          <button className='group rounded-xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:transform hover:bg-white/30 hover:shadow-lg'>
            <span className='mr-2'>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div className='container mx-auto px-6 pb-8'>
        {/* Page Header */}
        <div className='mb-8 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg'>
          <h1 className='mb-3 text-4xl font-bold text-white drop-shadow-lg'>
            🚚 CARRIER PORTAL
          </h1>
          <p className='text-xl text-white/90'>
            Available Loads & Freight Opportunities - Book High-Paying Loads
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[
            {
              label: 'Available Loads',
              value: filteredLoads.length,
              color: 'from-green-500 to-green-600',
              icon: '📋',
            },
            {
              label: 'Avg Rate',
              value: `$${filteredLoads.length > 0 ? Math.round(filteredLoads.reduce((sum, load) => sum + load.rate, 0) / filteredLoads.length).toLocaleString() : '0'}`,
              color: 'from-blue-500 to-blue-600',
              icon: '💰',
            },
            {
              label: 'Top Rate',
              value: `$${Math.max(...filteredLoads.map((load) => load.rate), 0).toLocaleString()}`,
              color: 'from-orange-500 to-orange-600',
              icon: '🎯',
            },
            {
              label: 'Support',
              value: '24/7',
              color: 'from-purple-500 to-purple-600',
              icon: '🕐',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className='rounded-xl bg-white/90 p-4 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-xl'
            >
              <div
                className={`bg-gradient-to-r ${stat.color} mb-3 rounded-lg py-3 text-2xl font-bold text-white shadow-md`}
              >
                <div className='mb-1 text-sm opacity-90'>{stat.icon}</div>
                <div>{stat.value}</div>
              </div>
              <div className='text-sm font-semibold text-gray-700'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className='mb-8 rounded-xl bg-white/95 p-6 shadow-lg backdrop-blur-sm'>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              placeholder='Search loads by ID, origin, destination, equipment, broker...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-gray-900 shadow-sm focus:border-transparent focus:ring-2 focus:ring-green-500'
            />
          </div>
        </div>

        {/* Load Board Table */}
        <div className='overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-xl backdrop-blur-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Load ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Route
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Equipment
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Broker
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Rate
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Pickup Date
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {filteredLoads.map((load) => (
                  <tr
                    key={load.id}
                    className='transition-colors duration-200 hover:bg-green-50'
                  >
                    <td className='px-6 py-4 text-sm font-bold whitespace-nowrap text-gray-900'>
                      {load.id}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      <div className='font-semibold'>{load.origin}</div>
                      <div className='text-xs text-gray-500'>
                        {load.destination}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
                        {load.equipment}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      {load.brokerName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(load.status)}`}
                      >
                        {load.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      <div className='text-lg font-bold text-green-600'>
                        ${load.rate.toLocaleString()}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                      {new Date(load.pickupDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium whitespace-nowrap'>
                      <button
                        onClick={() => handleBidOnLoad(load)}
                        className='rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-green-600 hover:to-green-700'
                      >
                        Book Load
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoads.length === 0 && (
            <div className='py-16 text-center'>
              <div className='mb-2 text-lg text-gray-500'>
                📭 No loads available
              </div>
              <div className='text-sm text-gray-400'>
                Check back later for new freight opportunities
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
