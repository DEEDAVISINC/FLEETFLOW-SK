'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { checkPermission, getCurrentUser } from '../config/access';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';

const Navigation = ({ showLogo = true }: { showLogo?: boolean }) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFleetDropdownOpen, setIsFleetDropdownOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] =
    useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

  // Hide navigation on dedicated pages where it wasn't specifically requested
  const hiddenPaths = ['/drivers/dashboard', '/dispatch', '/driver-portal'];

  if (pathname && hiddenPaths.includes(pathname)) {
    return null;
  }

  const { user } = getCurrentUser();
  const hasManagementAccess = checkPermission('hasManagementAccess');
  // For demo, use user role as userId (replace with real userId in production)
  const userId = user.role;

  const navItems = [
    { id: 'dashboard', label: '🏠 Dashboard', href: '/' },
    { id: 'dispatch', label: 'Dispatch Central', href: '/dispatch' },
    { id: 'broker', label: 'Broker Box', href: '/broker' },
    { id: 'quoting', label: 'Freight Quoting', href: '/quoting' },
    { id: 'carriers', label: 'Carrier Portal', href: '/carriers' },
    {
      id: 'user-management',
      label: '👥 Digital Rolodex',
      href: '/user-management',
    },
  ];

  const fleetItems = [
    { id: 'vehicles', label: 'Vehicles', href: '/vehicles', icon: '🚛' },
    { id: 'drivers', label: 'Drivers', href: '/drivers', icon: '👥' },
    { id: 'shippers', label: 'Shippers', href: '/shippers', icon: '🏢' },
    { id: 'routes', label: 'Routes', href: '/routes', icon: '🗺️' },
    {
      id: 'maintenance',
      label: 'Maintenance',
      href: '/maintenance',
      icon: '🔧',
    },
  ];

  const managementItems = [
    {
      id: 'user-management',
      label: 'User Management',
      href: '/user-management',
      icon: '👥',
    },
    {
      id: 'driver-otr-flow',
      label: 'Driver OTR Flow',
      href: '/admin/driver-otr-flow',
      icon: '🚛',
    },
    { id: 'financials', label: 'Financials', href: '/financials', icon: '💰' },
    { id: 'ai', label: 'AI Dashboard', href: '/ai', icon: '🤖' },
    {
      id: 'broker-management',
      label: 'Broker Management',
      href: '/broker-management',
      icon: '🏢',
    },
    {
      id: 'carrier-verification',
      label: 'Carrier Verification',
      href: '/carrier-verification',
      icon: '🔍',
    },
    { id: 'settings', label: 'Settings', href: '/settings', icon: '⚙️' },
    { id: 'training', label: 'Training', href: '/training', icon: '🎓' },
    {
      id: 'documentation',
      label: 'Documentation Hub',
      href: '/documentation',
      icon: '📚',
    },
  ];

  const resourceItems = [
    {
      id: 'documents',
      label: 'Document Generation',
      href: '/documents',
      icon: '📄',
    },
    {
      id: 'resources',
      label: 'Resource Library',
      href: '/resources',
      icon: '📚',
    },
    { id: 'safety', label: 'Safety Resources', href: '/safety', icon: '🦺' },
    {
      id: 'compliance',
      label: 'Compliance Tools',
      href: '/compliance',
      icon: '✅',
    },
  ];

  const reportsItems = [
    { id: 'reports', label: 'Fleet Reports', href: '/reports', icon: '📊' },
    {
      id: 'analytics',
      label: 'Analytics Dashboard',
      href: '/analytics',
      icon: '📈',
    },
    {
      id: 'performance',
      label: 'Performance Metrics',
      href: '/performance',
      icon: '🎯',
    },
    {
      id: 'insights',
      label: 'Business Insights',
      href: '/insights',
      icon: '💡',
    },
  ];

  return (
    <nav className='nav-2d' style={{ position: 'relative', zIndex: 100000 }}>
      <div className='container mx-auto px-6'>
        <div className='flex items-center justify-between py-4'>
          <div className='flex items-center space-x-8'>
            <Link
              href='/'
              className='group flex cursor-pointer items-center space-x-3'
              onClick={() => setActiveTab('dashboard')}
            >
              {showLogo && (
                <div className='flex h-8 w-8 transform items-center justify-center rounded-xl bg-blue-600 text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110'>
                  🚛
                </div>
              )}
              <h1 className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent transition-all duration-300 group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-indigo-700'>
                FleetFlow
              </h1>
            </Link>
          </div>
          {/* Right side: Search + Navigation + Bell */}
          <div className='flex items-center gap-1'>
            {/* Search Bar */}
            <div className='mr-3'>
              <SearchBar />
            </div>
            {/* Navigation Items */}
            <div className='flex items-center gap-1'>
              <NotificationBell userId={userId} />
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-item-2d ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Fleet Management Dropdown */}
              <div className='relative'>
                <button
                  className={`nav-item-2d flex items-center gap-2 ${
                    [
                      'vehicles',
                      'drivers',
                      'shippers',
                      'routes',
                      'maintenance',
                    ].includes(activeTab)
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => {
                    setIsFleetDropdownOpen(!isFleetDropdownOpen);
                    // Close other dropdowns
                    setIsResourcesDropdownOpen(false);
                    setIsReportsDropdownOpen(false);
                    setIsManagementDropdownOpen(false);
                  }}
                  onBlur={(e) => {
                    // Only close if focus is not moving to a child element
                    setTimeout(() => {
                      if (
                        !e.currentTarget.parentElement?.contains(
                          document.activeElement
                        )
                      ) {
                        setIsFleetDropdownOpen(false);
                      }
                    }, 150);
                  }}
                >
                  Fleet Management
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isFleetDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isFleetDropdownOpen && (
                  <div
                    className='modal-2d absolute top-full left-0 mt-2 min-w-56'
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      boxShadow:
                        '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 999999,
                      position: 'absolute',
                    }}
                  >
                    {fleetItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className='flex items-center gap-3 px-6 py-4 text-gray-700 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsFleetDropdownOpen(false);
                        }}
                      >
                        <span className='text-xl'>{item.icon}</span>
                        <span className='font-medium'>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className='relative'>
                <button
                  className={`nav-item-2d flex items-center gap-2 ${
                    ['documents', 'resources', 'safety', 'compliance'].includes(
                      activeTab
                    )
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => {
                    setIsResourcesDropdownOpen(!isResourcesDropdownOpen);
                    // Close other dropdowns
                    setIsFleetDropdownOpen(false);
                    setIsReportsDropdownOpen(false);
                    setIsManagementDropdownOpen(false);
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      if (
                        !e.currentTarget.parentElement?.contains(
                          document.activeElement
                        )
                      ) {
                        setIsResourcesDropdownOpen(false);
                      }
                    }, 150);
                  }}
                >
                  Resources
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isResourcesDropdownOpen && (
                  <div
                    className='modal-2d absolute top-full left-0 mt-2 min-w-56'
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      boxShadow:
                        '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 999999,
                    }}
                  >
                    {resourceItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className='flex items-center gap-3 px-6 py-4 text-gray-700 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50'
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsResourcesDropdownOpen(false);
                        }}
                      >
                        <span className='text-xl'>{item.icon}</span>
                        <span className='font-medium'>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Reports & Analytics Dropdown */}
              <div className='relative'>
                <button
                  className={`nav-item-2d flex items-center gap-2 ${
                    [
                      'reports',
                      'analytics',
                      'performance',
                      'insights',
                    ].includes(activeTab)
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => {
                    setIsReportsDropdownOpen(!isReportsDropdownOpen);
                    // Close other dropdowns
                    setIsFleetDropdownOpen(false);
                    setIsResourcesDropdownOpen(false);
                    setIsManagementDropdownOpen(false);
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      if (
                        !e.currentTarget.parentElement?.contains(
                          document.activeElement
                        )
                      ) {
                        setIsReportsDropdownOpen(false);
                      }
                    }, 150);
                  }}
                >
                  Reports & Analytics
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isReportsDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isReportsDropdownOpen && (
                  <div
                    className='modal-2d absolute top-full left-0 mt-2 min-w-56'
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      boxShadow:
                        '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 999999,
                    }}
                  >
                    {reportsItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className='flex items-center gap-3 px-6 py-4 text-gray-700 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50'
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsReportsDropdownOpen(false);
                        }}
                      >
                        <span className='text-xl'>{item.icon}</span>
                        <span className='font-medium'>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Management Dashboard Dropdown - Always Visible */}
              <div className='relative'>
                <button
                  className={`nav-item-2d flex items-center gap-2 border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 hover:from-red-100 hover:to-orange-100 ${
                    [
                      'user-management',
                      'financials',
                      'ai',
                      'settings',
                    ].includes(activeTab)
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => {
                    setIsManagementDropdownOpen(!isManagementDropdownOpen);
                    // Close other dropdowns
                    setIsFleetDropdownOpen(false);
                    setIsResourcesDropdownOpen(false);
                    setIsReportsDropdownOpen(false);
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      if (
                        !e.currentTarget.parentElement?.contains(
                          document.activeElement
                        )
                      ) {
                        setIsManagementDropdownOpen(false);
                      }
                    }, 150);
                  }}
                  title='Management Dashboard'
                >
                  🔒 Management
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isManagementDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isManagementDropdownOpen && (
                  <div
                    className='modal-2d animate-fadeInUp absolute top-full left-0 mt-2 min-w-64 border-red-200'
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #fca5a5',
                      boxShadow:
                        '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 999999,
                    }}
                  >
                    <div className='rounded-t-xl border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-3'>
                      <span className='flex items-center gap-2 text-sm font-semibold text-red-700'>
                        🔒 MANAGEMENT ACCESS
                      </span>
                    </div>
                    {managementItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className='flex items-center gap-3 px-4 py-3 text-gray-700 transition-colors last:rounded-b-lg hover:bg-red-50'
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsManagementDropdownOpen(false);
                        }}
                      >
                        <span className='text-lg'>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>{' '}
            {/* Close navigation items div */}
          </div>{' '}
          {/* Close right side container */}
          <div className='flex items-center gap-4'>
            <span className='text-gray-600'>
              Welcome, {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
            {!hasManagementAccess && (
              <Link
                href='/settings'
                className='btn btn-secondary'
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
