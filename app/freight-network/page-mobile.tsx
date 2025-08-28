'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  NetworkCapacity,
  NetworkLoad,
  NetworkMetrics,
  NetworkPartner,
  freightNetworkService,
} from '../services/FreightNetworkService';

export default function FreightNetworkPageMobile() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'loads' | 'capacity' | 'partners' | 'analytics'
  >('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [networkData, setNetworkData] = useState<{
    loads: NetworkLoad[];
    capacity: NetworkCapacity[];
    partners: NetworkPartner[];
    metrics: NetworkMetrics | null;
  }>({
    loads: [],
    capacity: [],
    partners: [],
    metrics: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    setIsLoading(true);
    try {
      // For development, use mock data
      const mockData = freightNetworkService.generateMockNetworkData();

      // Simulate network metrics
      const mockMetrics: NetworkMetrics = {
        totalLoads: 1247,
        activeCarriers: 89,
        totalRevenue: 485000,
        averageRate: 2850,
        onTimePercentage: 96.5,
        networkUtilization: 78.3,
        revenueGrowth: 23.7,
        carrierSatisfaction: 4.6,
      };

      setNetworkData({
        loads: mockData.loads,
        capacity: mockData.capacity,
        partners: mockData.partners,
        metrics: mockMetrics,
      });
    } catch (error) {
      console.error('Failed to load network data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'loads', label: 'Loads', icon: '🚛' },
    { id: 'capacity', label: 'Capacity', icon: '📦' },
    { id: 'partners', label: 'Partners', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700'>
      {/* Mobile-Optimized Header */}
      <div className='sticky top-0 z-50 border-b border-white/30 bg-white/20 backdrop-blur-lg'>
        <div className='px-4 py-3 sm:px-6'>
          <div className='flex items-center justify-between'>
            {/* Back Button & Title */}
            <div className='flex items-center space-x-3'>
              <Link href='/'>
                <button className='rounded-lg border border-white/30 bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/30'>
                  <svg
                    className='h-5 w-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>
              </Link>
              <div>
                <h1 className='text-lg font-bold text-white sm:text-xl'>
                  Freight Network
                </h1>
                <p className='text-xs text-white/70 sm:text-sm'>
                  Carrier Operations Hub
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='rounded-lg border border-white/30 bg-white/20 p-2 md:hidden'
            >
              <svg
                className='h-6 w-6 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-Responsive Navigation */}
      <div className='border-b border-white/20 bg-white/10 backdrop-blur-md'>
        {/* Desktop Tabs */}
        <div className='hidden overflow-x-auto px-4 md:flex'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-white bg-white/20 text-white'
                  : 'border-transparent text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className='mr-2'>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`transition-all duration-300 md:hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
        >
          <div className='bg-white/20 backdrop-blur-md'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/30 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className='mr-3 text-lg'>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Active Tab Display */}
        <div className='bg-white/10 px-4 py-2 md:hidden'>
          <div className='flex items-center'>
            <span className='mr-2 text-lg'>
              {tabs.find((tab) => tab.id === activeTab)?.icon}
            </span>
            <span className='font-medium text-white'>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          {/* Overview Tab - Mobile Optimized */}
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* Network Metrics - Mobile Grid */}
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-white'>1,247</div>
                      <div className='text-sm text-white/80'>Total Loads</div>
                    </div>
                    <div className='text-2xl'>🚛</div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-white'>89</div>
                      <div className='text-sm text-white/80'>
                        Active Carriers
                      </div>
                    </div>
                    <div className='text-2xl'>👥</div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-white'>$485K</div>
                      <div className='text-sm text-white/80'>Total Revenue</div>
                    </div>
                    <div className='text-2xl'>💰</div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-white'>96.5%</div>
                      <div className='text-sm text-white/80'>On Time</div>
                    </div>
                    <div className='text-2xl'>⏰</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Mobile Optimized */}
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>📋</div>
                  <div className='text-sm font-medium text-white'>
                    Post Load
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>🔍</div>
                  <div className='text-sm font-medium text-white'>
                    Find Carriers
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>📊</div>
                  <div className='text-sm font-medium text-white'>
                    Analytics
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>💬</div>
                  <div className='text-sm font-medium text-white'>Messages</div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>📱</div>
                  <div className='text-sm font-medium text-white'>
                    Mobile App
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>⚙️</div>
                  <div className='text-sm font-medium text-white'>Settings</div>
                </button>
              </div>

              {/* Recent Activity - Mobile Cards */}
              <div className='rounded-xl border border-white/40 bg-white/30 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>📈</span>
                  Recent Network Activity
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <div className='rounded-full bg-green-500 p-2'>
                      <span className='text-sm'>✓</span>
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium text-white'>
                        Load FL-2024-001 Completed
                      </div>
                      <div className='text-sm text-white/70'>
                        Atlanta, GA → Miami, FL • $2,850 • ABC Trucking
                      </div>
                      <div className='text-xs text-white/50'>2 hours ago</div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='rounded-full bg-blue-500 p-2'>
                      <span className='text-sm'>🚛</span>
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium text-white'>
                        New Carrier Joined Network
                      </div>
                      <div className='text-sm text-white/70'>
                        XYZ Logistics • DOT: 12345 • MC: 67890
                      </div>
                      <div className='text-xs text-white/50'>4 hours ago</div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='rounded-full bg-purple-500 p-2'>
                      <span className='text-sm'>📦</span>
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium text-white'>
                        High Priority Load Posted
                      </div>
                      <div className='text-sm text-white/70'>
                        Dallas, TX → Houston, TX • $1,950 • Urgent
                      </div>
                      <div className='text-xs text-white/50'>6 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loads Tab - Mobile Optimized */}
          {activeTab === 'loads' && (
            <div className='space-y-6'>
              {/* Search/Filter Bar - Mobile Friendly */}
              <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <input
                    type='text'
                    placeholder='Search by origin, destination, or load ID'
                    className='flex-1 rounded-xl border border-white/50 bg-white/80 px-4 py-3 text-base focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <button className='rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600'>
                    Search Loads
                  </button>
                </div>
              </div>

              {/* Available Loads - Mobile Cards */}
              <div className='space-y-4'>
                {[1, 2, 3, 4, 5].map((load) => (
                  <div
                    key={load}
                    className='rounded-xl border border-white/40 bg-white/30 p-6 backdrop-blur-lg'
                  >
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center gap-2'>
                          <span className='rounded bg-green-500 px-2 py-1 text-xs font-bold text-white'>
                            AVAILABLE
                          </span>
                          <span className='text-sm text-white/60'>
                            Posted 2 hours ago
                          </span>
                        </div>
                        <h4 className='font-bold text-white'>
                          Load #FL-{2024000 + load}
                        </h4>
                        <p className='mb-2 text-sm text-white/80'>
                          Atlanta, GA → Jacksonville, FL
                        </p>
                        <div className='grid grid-cols-2 gap-4 text-sm text-white/70'>
                          <div>
                            <span className='font-medium'>Equipment:</span> Dry
                            Van 53ft
                          </div>
                          <div>
                            <span className='font-medium'>Weight:</span> 45,000
                            lbs
                          </div>
                          <div>
                            <span className='font-medium'>Pickup:</span> Dec 21,
                            8:00 AM
                          </div>
                          <div>
                            <span className='font-medium'>Delivery:</span> Dec
                            22, 2:00 PM
                          </div>
                        </div>
                      </div>
                      <div className='text-center sm:text-right'>
                        <div className='text-2xl font-bold text-green-400'>
                          $2,{850 + load * 50}
                        </div>
                        <div className='text-sm text-white/60'>
                          {285 + load * 15} miles
                        </div>
                        <div className='text-xs text-white/60'>
                          ${(10 + load * 0.2).toFixed(2)}/mile
                        </div>
                        <div className='mt-3 flex gap-2'>
                          <button className='flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 sm:flex-none'>
                            Accept Load
                          </button>
                          <button className='flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 sm:flex-none'>
                            Negotiate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className='text-center'>
                <button className='rounded-xl bg-white/20 px-8 py-3 font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30'>
                  Load More Loads
                </button>
              </div>
            </div>
          )}

          {/* Capacity Tab - Mobile Optimized */}
          {activeTab === 'capacity' && (
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='mb-4 text-2xl font-bold text-white'>
                  Available Capacity
                </h2>
                <p className='text-white/80'>
                  Carriers with available trucks and capacity
                </p>
              </div>

              {/* Capacity Cards - Mobile Friendly */}
              <div className='space-y-4'>
                {[1, 2, 3, 4].map((carrier) => (
                  <div
                    key={carrier}
                    className='rounded-xl border border-white/40 bg-white/30 p-6 backdrop-blur-lg'
                  >
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center gap-2'>
                          <span className='rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white'>
                            VERIFIED
                          </span>
                          <span className='text-sm text-white/60'>
                            4.8★ Rating
                          </span>
                        </div>
                        <h4 className='font-bold text-white'>
                          {carrier === 1
                            ? 'ABC Trucking LLC'
                            : carrier === 2
                              ? 'XYZ Logistics'
                              : carrier === 3
                                ? 'Premium Transport'
                                : 'Elite Freight'}
                        </h4>
                        <div className='mt-2 grid grid-cols-2 gap-4 text-sm text-white/70'>
                          <div>
                            <span className='font-medium'>Location:</span>{' '}
                            Atlanta, GA
                          </div>
                          <div>
                            <span className='font-medium'>Equipment:</span> Dry
                            Van
                          </div>
                          <div>
                            <span className='font-medium'>Available:</span>{' '}
                            {carrier + 1} trucks
                          </div>
                          <div>
                            <span className='font-medium'>Radius:</span>{' '}
                            {250 + carrier * 50} miles
                          </div>
                        </div>
                      </div>
                      <div className='text-center sm:text-right'>
                        <div className='text-lg font-bold text-white'>
                          ${(2.5 + carrier * 0.3).toFixed(2)}/mile
                        </div>
                        <div className='text-sm text-white/60'>
                          Average Rate
                        </div>
                        <button className='mt-3 w-full rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 sm:w-auto'>
                          Contact Carrier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partners Tab - Mobile Optimized */}
          {activeTab === 'partners' && (
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='mb-4 text-2xl font-bold text-white'>
                  Network Partners
                </h2>
                <p className='text-white/80'>
                  Trusted carriers and logistics partners
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {[1, 2, 3, 4, 5, 6].map((partner) => (
                  <div
                    key={partner}
                    className='rounded-xl border border-white/40 bg-white/30 p-6 text-center backdrop-blur-lg'
                  >
                    <div className='mb-4 text-4xl'>
                      {partner % 3 === 0
                        ? '🚛'
                        : partner % 2 === 0
                          ? '🏢'
                          : '👥'}
                    </div>
                    <h3 className='mb-2 font-bold text-white'>
                      {partner === 1
                        ? 'ABC Trucking'
                        : partner === 2
                          ? 'XYZ Logistics'
                          : partner === 3
                            ? 'Premium Transport'
                            : partner === 4
                              ? 'Elite Freight'
                              : partner === 5
                                ? 'Global Shipping'
                                : 'Swift Delivery'}
                    </h3>
                    <div className='mb-4 text-sm text-white/70'>
                      <div>DOT: 123456{partner}</div>
                      <div>MC: 78901{partner}</div>
                      <div className='mt-2 text-amber-400'>
                        ★★★★★ 4.{8 + (partner % 2)}/5
                      </div>
                    </div>
                    <div className='mb-4 grid grid-cols-2 gap-2 text-xs text-white/60'>
                      <div>{20 + partner * 5} Trucks</div>
                      <div>{500 + partner * 100} Loads</div>
                      <div>98.{partner}% On-Time</div>
                      <div>${(2.5 + partner * 0.2).toFixed(2)}/mi Avg</div>
                    </div>
                    <button className='w-full rounded-lg bg-purple-500 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600'>
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab - Mobile Optimized */}
          {activeTab === 'analytics' && (
            <div className='space-y-6'>
              <div className='text-center'>
                <h2 className='mb-4 text-2xl font-bold text-white'>
                  Network Analytics
                </h2>
                <p className='text-white/80'>Performance insights and trends</p>
              </div>

              {/* KPI Cards - Mobile Grid */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <div className='rounded-xl border border-white/40 bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 text-center backdrop-blur-lg'>
                  <div className='text-3xl font-bold text-green-400'>
                    +23.7%
                  </div>
                  <div className='text-sm text-white/80'>Revenue Growth</div>
                  <div className='text-xs text-white/60'>vs last month</div>
                </div>

                <div className='rounded-xl border border-white/40 bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 text-center backdrop-blur-lg'>
                  <div className='text-3xl font-bold text-blue-400'>78.3%</div>
                  <div className='text-sm text-white/80'>
                    Network Utilization
                  </div>
                  <div className='text-xs text-white/60'>Optimal range</div>
                </div>

                <div className='rounded-xl border border-white/40 bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 text-center backdrop-blur-lg'>
                  <div className='text-3xl font-bold text-purple-400'>4.6★</div>
                  <div className='text-sm text-white/80'>
                    Carrier Satisfaction
                  </div>
                  <div className='text-xs text-white/60'>Excellent rating</div>
                </div>

                <div className='rounded-xl border border-white/40 bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-6 text-center backdrop-blur-lg'>
                  <div className='text-3xl font-bold text-amber-400'>
                    $2,850
                  </div>
                  <div className='text-sm text-white/80'>Average Rate</div>
                  <div className='text-xs text-white/60'>Per load</div>
                </div>
              </div>

              {/* Chart Placeholder - Mobile Friendly */}
              <div className='rounded-xl border border-white/40 bg-white/30 p-6 text-center backdrop-blur-lg'>
                <div className='mb-4 text-6xl'>📊</div>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  Performance Analytics
                </h3>
                <p className='mb-4 text-sm text-white/70'>
                  Interactive charts and detailed analytics coming soon
                </p>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='rounded-lg bg-white/20 p-3'>
                    <div className='font-bold text-white'>Daily Loads</div>
                    <div className='text-white/70'>45 avg/day</div>
                  </div>
                  <div className='rounded-lg bg-white/20 p-3'>
                    <div className='font-bold text-white'>Response Time</div>
                    <div className='text-white/70'>2.3 min avg</div>
                  </div>
                  <div className='rounded-lg bg-white/20 p-3'>
                    <div className='font-bold text-white'>Success Rate</div>
                    <div className='text-white/70'>94.2%</div>
                  </div>
                  <div className='rounded-lg bg-white/20 p-3'>
                    <div className='font-bold text-white'>Active Routes</div>
                    <div className='text-white/70'>127 routes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Footer */}
      <div className='mt-8 border-t border-white/20 bg-white/10 p-4 text-center backdrop-blur-md'>
        <p className='text-sm text-white/60'>
          Freight Network - Mobile Optimized v1.0
        </p>
        <p className='mt-1 text-xs text-white/40'>
          Connecting carriers and shippers nationwide
        </p>
      </div>
    </div>
  );
}
