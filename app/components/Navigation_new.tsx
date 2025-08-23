'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FleetFlowLogo from './Logo';

const Navigation = () => {
  const pathname = usePathname();
  const [isFleetDropdownOpen, setIsFleetDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/fleetflowdash', icon: '📊' },
    { id: 'dispatch', label: 'Dispatch', href: '/dispatch', icon: '🎯' },
    { id: 'broker', label: 'Broker', href: '/broker', icon: '🤝' },
    { id: 'quoting', label: 'Quoting', href: '/quoting', icon: '💰' },
    { id: 'reports', label: 'Reports', href: '/reports', icon: '📈' },
    { id: 'resources', label: 'Resources', href: '/resources', icon: '📚' },
    { id: 'training', label: 'Training', href: '/training', icon: '🎓' },
    { id: 'settings', label: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const fleetItems = [
    {
      id: 'vehicles',
      label: 'Vehicles',
      href: '/vehicles',
      icon: '🚛',
      desc: 'Manage fleet vehicles',
    },
    {
      id: 'drivers',
      label: 'Drivers',
      href: '/drivers',
      icon: '👥',
      desc: 'Driver management',
    },
    {
      id: 'routes',
      label: 'Routes',
      href: '/routes',
      icon: '🗺️',
      desc: 'Route planning',
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      href: '/maintenance',
      icon: '🔧',
      desc: 'Service & repairs',
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFleetDropdownOpen(false);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Main Navigation */}
      <nav className='sticky top-0 z-50 border-b border-gray-200/50 bg-white/95 shadow-lg backdrop-blur-lg'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <Link
              href='/'
              className='group flex items-center space-x-3 transition-opacity hover:opacity-80'
            >
              <div className='transform transition-transform group-hover:scale-105'>
                <FleetFlowLogo
                  size='medium'
                  variant='gradient'
                  showText={true}
                  useCustomLogo={true}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden items-center space-x-1 lg:flex'>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900'
                  }`}
                >
                  <span className='text-lg transition-transform group-hover:scale-110'>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Fleet Management Dropdown */}
              <div className='relative'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFleetDropdownOpen(!isFleetDropdownOpen);
                  }}
                  className={`group flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    fleetItems.some((item) => isActive(item.href))
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-gray-900'
                  }`}
                >
                  <span className='text-lg transition-transform group-hover:scale-110'>
                    🚚
                  </span>
                  <span>Fleet</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isFleetDropdownOpen ? 'rotate-180' : ''}`}
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

                {/* Dropdown Menu */}
                {isFleetDropdownOpen && (
                  <div className='absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200/50 bg-white/95 py-2 shadow-xl backdrop-blur-lg'>
                    <div className='border-b border-gray-100 px-4 py-2'>
                      <h3 className='flex items-center text-sm font-semibold text-gray-900'>
                        <span className='mr-2 text-lg'>🚚</span>
                        Fleet Management
                      </h3>
                    </div>
                    {fleetItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`group block px-4 py-3 text-sm transition-colors hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 ${
                          isActive(item.href)
                            ? 'border-r-2 border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                            : ''
                        }`}
                        onClick={() => setIsFleetDropdownOpen(false)}
                      >
                        <div className='flex items-center space-x-3'>
                          <span className='text-lg transition-transform group-hover:scale-110'>
                            {item.icon}
                          </span>
                          <div>
                            <div className='font-medium text-gray-900'>
                              {item.label}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className='rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-t border-gray-200/50 bg-white/95 backdrop-blur-lg lg:hidden'>
            <div className='space-y-2 px-4 py-4'>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className='text-lg'>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className='mt-4 border-t border-gray-200 pt-2'>
                <div className='px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase'>
                  Fleet Management
                </div>
                {fleetItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className='text-lg'>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
