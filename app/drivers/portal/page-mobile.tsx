'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for pallet scanning component
const PalletScanningSystem = dynamic(
  () => import('../../components/PalletScanningSystem'),
  {
    loading: () => (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500' />
          <p className='text-gray-600'>Loading scanning system...</p>
        </div>
      </div>
    ),
  }
);

export default function DriversPortalMobile() {
  const [activeTab, setActiveTab] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'login', label: 'Login', icon: '🔐' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'marketplace', label: 'Marketplace', icon: '🎯' },
    { id: 'pallet-scan', label: 'Pallet Scan', icon: '📦' },
    { id: 'routes', label: 'Routes', icon: '🗺️' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'performance', label: 'Performance', icon: '⭐' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500'>
      {/* Mobile-Optimized Header */}
      <div className='sticky top-0 z-50 border-b border-white/30 bg-white/20 backdrop-blur-lg'>
        <div className='px-4 py-3 sm:px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='text-2xl'>🚛</div>
              <div>
                <h1 className='text-lg font-bold text-gray-800 sm:text-xl'>
                  Driver OTR Portal
                </h1>
                <p className='hidden text-xs text-gray-600 sm:block sm:text-sm'>
                  Over The Road Flow Management
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='rounded-lg border border-white/30 bg-white/20 p-2 md:hidden'
            >
              <svg
                className='h-6 w-6 text-gray-800'
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
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-white bg-white/20 text-gray-800'
                  : 'border-transparent text-gray-600 hover:bg-white/10 hover:text-gray-800'
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
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/30 text-gray-800'
                    : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
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
            <span className='font-medium text-gray-800'>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          {/* Login Tab - Mobile Optimized */}
          {activeTab === 'login' && (
            <div className='space-y-6'>
              <div className='mb-8 text-center'>
                <h2 className='mb-2 text-2xl font-bold text-gray-800 sm:text-3xl'>
                  Driver Login
                </h2>
                <p className='text-gray-600'>Access your OTR dashboard</p>
              </div>

              {/* Mobile-Friendly Login Form */}
              <div className='mx-auto max-w-md rounded-2xl border border-white/40 bg-white/30 p-6 shadow-xl backdrop-blur-lg sm:p-8'>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-semibold text-gray-700'>
                      Driver ID / Email
                    </label>
                    <input
                      type='text'
                      placeholder='Enter your driver ID or email'
                      className='w-full rounded-xl border border-white/50 bg-white/80 px-4 py-3 text-base transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-semibold text-gray-700'>
                      Password
                    </label>
                    <input
                      type='password'
                      placeholder='Enter your password'
                      className='w-full rounded-xl border border-white/50 bg-white/80 px-4 py-3 text-base transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div className='flex items-center justify-between text-sm'>
                    <label className='flex items-center'>
                      <input type='checkbox' className='mr-2 rounded' />
                      <span className='text-gray-700'>Remember me</span>
                    </label>
                    <a
                      href='#'
                      className='text-gray-600 transition-colors hover:text-gray-800'
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button className='w-full transform rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-gray-800 hover:to-gray-900'>
                    Sign In to OTR Portal
                  </button>
                </div>
              </div>

              {/* Quick Access Cards - Mobile Grid */}
              <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3'>
                <div className='cursor-pointer rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>📱</div>
                  <div className='text-sm font-medium text-gray-800'>
                    Emergency
                  </div>
                  <div className='mt-1 text-xs text-gray-600'>24/7 Support</div>
                </div>
                <div className='cursor-pointer rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>🚛</div>
                  <div className='text-sm font-medium text-gray-800'>
                    Available Loads
                  </div>
                  <div className='mt-1 text-xs text-gray-600'>
                    Find loads nearby
                  </div>
                </div>
                <div className='cursor-pointer rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>📍</div>
                  <div className='text-sm font-medium text-gray-800'>
                    My Location
                  </div>
                  <div className='mt-1 text-xs text-gray-600'>
                    Share location
                  </div>
                </div>
              </div>

              {/* Demo Login Options */}
              <div className='mt-8 text-center'>
                <p className='mb-4 text-sm text-gray-600'>Demo Access:</p>
                <div className='mx-auto flex max-w-md flex-col gap-2 sm:flex-row'>
                  <button className='flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600'>
                    Demo Driver Login
                  </button>
                  <button className='flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600'>
                    Guest Access
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Tab - Mobile Optimized */}
          {activeTab === 'dashboard' && (
            <div className='space-y-6'>
              <div className='mb-6 text-center'>
                <h2 className='text-xl font-bold text-gray-800 sm:text-2xl'>
                  OTR Dashboard
                </h2>
                <p className='text-gray-600'>Welcome back, John Smith</p>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {/* Metric Cards - Mobile Friendly */}
                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-gray-800'>3</div>
                      <div className='text-sm text-gray-600'>Active Loads</div>
                    </div>
                    <div className='text-2xl'>📦</div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-gray-800'>
                        2,847
                      </div>
                      <div className='text-sm text-gray-600'>
                        Miles This Week
                      </div>
                    </div>
                    <div className='text-2xl'>🛣️</div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-gray-800'>
                        98%
                      </div>
                      <div className='text-sm text-gray-600'>On-Time Rate</div>
                    </div>
                    <div className='text-2xl'>⏰</div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-2xl font-bold text-gray-800'>
                        $8,450
                      </div>
                      <div className='text-sm text-gray-600'>This Week</div>
                    </div>
                    <div className='text-2xl'>💰</div>
                  </div>
                </div>
              </div>

              {/* Mobile-Responsive Current Load Card */}
              <div className='rounded-xl border border-white/40 bg-white/30 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-800'>
                  <span className='mr-2'>🚛</span>
                  Current Load - Priority
                </h3>

                <div className='space-y-4'>
                  <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-bold text-gray-800'>
                          Load #OTR-2024-001
                        </div>
                        <div className='text-sm text-gray-600'>
                          Pickup: Atlanta, GA
                        </div>
                        <div className='text-sm text-gray-600'>
                          Delivery: Miami, FL
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='rounded-lg bg-green-500 px-2 py-1 text-xs font-bold text-white'>
                          IN TRANSIT
                        </div>
                        <div className='mt-1 text-sm text-gray-600'>
                          Due: 2hrs
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <button className='flex-1 rounded-lg bg-blue-500 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600'>
                        📍 Update Location
                      </button>
                      <button className='flex-1 rounded-lg bg-green-500 py-3 text-sm font-medium text-white transition-colors hover:bg-green-600'>
                        🗺️ Navigate
                      </button>
                    </div>
                    <button className='w-full rounded-lg bg-purple-500 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-600'>
                      📱 Contact Dispatch
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Mobile Optimized */}
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>📷</div>
                  <div className='text-sm font-medium text-gray-800'>
                    Upload POD
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>⏰</div>
                  <div className='text-sm font-medium text-gray-800'>
                    Log Hours
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>⛽</div>
                  <div className='text-sm font-medium text-gray-800'>
                    Fuel Report
                  </div>
                </button>
                <button className='rounded-xl border border-white/30 bg-white/20 p-4 text-center backdrop-blur-md transition-colors hover:bg-white/30'>
                  <div className='mb-2 text-2xl'>🔧</div>
                  <div className='text-sm font-medium text-gray-800'>
                    Maintenance
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Marketplace Tab - Mobile Optimized */}
          {activeTab === 'marketplace' && (
            <div className='space-y-6'>
              <div className='mb-6 text-center'>
                <h2 className='text-xl font-bold text-gray-800 sm:text-2xl'>
                  Load Marketplace
                </h2>
                <p className='text-gray-600'>
                  Available loads near your location
                </p>
              </div>

              {/* Search/Filter Bar - Mobile Friendly */}
              <div className='rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <input
                    type='text'
                    placeholder='Search by origin, destination, or load type'
                    className='flex-1 rounded-xl border border-white/50 bg-white/80 px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <button className='rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600'>
                    Search
                  </button>
                </div>
              </div>

              {/* Available Loads - Mobile Cards */}
              <div className='space-y-4'>
                <div className='rounded-xl border border-white/40 bg-white/30 p-6 backdrop-blur-lg'>
                  <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='rounded bg-green-500 px-2 py-1 text-xs font-bold text-white'>
                          HIGH PAY
                        </span>
                        <span className='text-sm text-gray-600'>
                          Posted 2 hours ago
                        </span>
                      </div>
                      <h4 className='font-bold text-gray-800'>
                        Atlanta, GA → Jacksonville, FL
                      </h4>
                      <p className='mb-2 text-sm text-gray-600'>
                        Dry Van • 53ft • 45,000 lbs
                      </p>
                      <p className='text-sm text-gray-600'>
                        Pickup: Tomorrow 8:00 AM
                      </p>
                      <p className='text-sm text-gray-600'>
                        Delivery: Dec 22, 2:00 PM
                      </p>
                    </div>
                    <div className='text-center sm:text-right'>
                      <div className='text-2xl font-bold text-green-600'>
                        $2,850
                      </div>
                      <div className='text-sm text-gray-600'>285 miles</div>
                      <div className='text-xs text-gray-600'>$10.00/mile</div>
                      <button className='mt-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600'>
                        Express Interest
                      </button>
                    </div>
                  </div>
                </div>

                <div className='rounded-xl border border-white/40 bg-white/30 p-6 backdrop-blur-lg'>
                  <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white'>
                          URGENT
                        </span>
                        <span className='text-sm text-gray-600'>
                          Posted 45 minutes ago
                        </span>
                      </div>
                      <h4 className='font-bold text-gray-800'>
                        Miami, FL → Charlotte, NC
                      </h4>
                      <p className='mb-2 text-sm text-gray-600'>
                        Refrigerated • 53ft • 42,000 lbs
                      </p>
                      <p className='text-sm text-gray-600'>
                        Pickup: Today 6:00 PM
                      </p>
                      <p className='text-sm text-gray-600'>
                        Delivery: Dec 21, 10:00 AM
                      </p>
                    </div>
                    <div className='text-center sm:text-right'>
                      <div className='text-2xl font-bold text-green-600'>
                        $3,200
                      </div>
                      <div className='text-sm text-gray-600'>380 miles</div>
                      <div className='text-xs text-gray-600'>$8.42/mile</div>
                      <button className='mt-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600'>
                        Quick Bid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!['login', 'dashboard', 'marketplace'].includes(activeTab) && (
            <div className='py-12 text-center'>
              <div className='mb-4 text-6xl'>🚧</div>
              <h3 className='mb-2 text-xl font-semibold text-gray-800'>
                {tabs.find((tab) => tab.id === activeTab)?.label} Section
              </h3>
              <p className='mb-6 text-gray-600'>
                Mobile-optimized interface for{' '}
                {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{' '}
                is being developed...
              </p>
              <div className='mx-auto max-w-md rounded-xl border border-white/30 bg-white/20 p-6 backdrop-blur-md'>
                <p className='text-sm text-gray-700'>
                  This section will include mobile-optimized features for:
                </p>
                <ul className='mt-3 space-y-1 text-sm text-gray-600'>
                  {activeTab === 'routes' && (
                    <>
                      <li>• GPS navigation integration</li>
                      <li>• Route optimization</li>
                      <li>• Real-time traffic updates</li>
                      <li>• Waypoint management</li>
                    </>
                  )}
                  {activeTab === 'schedule' && (
                    <>
                      <li>• Calendar view optimized for mobile</li>
                      <li>• Load scheduling</li>
                      <li>• Time management</li>
                      <li>• Availability updates</li>
                    </>
                  )}
                  {activeTab === 'documents' && (
                    <>
                      <li>• Mobile document viewer</li>
                      <li>• Photo capture and upload</li>
                      <li>• Digital signatures</li>
                      <li>• Document organization</li>
                    </>
                  )}
                  {activeTab === 'performance' && (
                    <>
                      <li>• Performance metrics dashboard</li>
                      <li>• Earnings tracking</li>
                      <li>• Safety scores</li>
                      <li>• Achievement badges</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Pallet Scanning Tab - Mobile Optimized */}
          {activeTab === 'pallet-scan' && (
            <div className='space-y-6'>
              <div className='mb-6 text-center'>
                <h2 className='text-xl font-bold text-gray-800 sm:text-2xl'>
                  📦 Pallet Scanning
                </h2>
                <p className='text-sm text-gray-600'>
                  Scan pallets for real-time shipment visibility
                </p>
              </div>

              {/* Mobile Load Selection */}
              <div className='space-y-4 rounded-xl border border-white/40 bg-white/30 p-4 backdrop-blur-lg'>
                <h3 className='font-semibold text-gray-800'>Current Load</h3>
                <select className='w-full rounded-xl border border-white/50 bg-white/80 px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none'>
                  <option value=''>Select Load ID</option>
                  <option value='MKT-001'>MKT-001 - Dallas to Houston</option>
                  <option value='MKT-002'>
                    MKT-002 - Austin to San Antonio
                  </option>
                  <option value='MKT-003'>MKT-003 - Fort Worth to OKC</option>
                </select>
                <select className='w-full rounded-xl border border-white/50 bg-white/80 px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none'>
                  <option value=''>Current Location</option>
                  <option value='crossdock'>🏭 Crossdock (Loading)</option>
                  <option value='delivery'>📍 Delivery Location</option>
                </select>
              </div>

              {/* Important Notice - Mobile */}
              <div className='rounded-xl border border-blue-500/40 bg-blue-500/20 p-4 backdrop-blur-lg'>
                <div className='flex items-start gap-3'>
                  <span className='text-lg text-blue-400'>ℹ️</span>
                  <div>
                    <h4 className='text-sm font-medium text-blue-200'>
                      MARKETPLACE BIDDING
                    </h4>
                    <p className='text-xs leading-relaxed text-blue-300'>
                      All LTL drivers must scan pallets at every touchpoint for
                      visibility and accuracy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pallet Scanning Component */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-4 backdrop-blur-lg'>
                <PalletScanningSystem
                  loadId='MKT-001'
                  driverId='DRV-12345'
                  currentLocation='crossdock'
                  workflowMode='loading'
                  onScanComplete={(scan) => {
                    console.log('Mobile crossdock scan completed:', scan);
                  }}
                  onWorkflowComplete={(summary) => {
                    console.log(
                      'Mobile crossdock workflow completed:',
                      summary
                    );
                    alert(
                      `✅ Loading Complete!\nScanned: ${summary.totalScanned}/${summary.totalExpected} pallets`
                    );
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Footer */}
      <div className='mt-8 border-t border-white/20 bg-white/10 p-4 text-center backdrop-blur-md'>
        <p className='text-sm text-gray-600'>
          FleetFlow Driver OTR Portal - Mobile Optimized v1.0
        </p>
        <p className='mt-1 text-xs text-gray-500'>
          Designed for professional drivers on the road
        </p>
      </div>
    </div>
  );
}
