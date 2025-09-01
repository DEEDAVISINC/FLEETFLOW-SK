'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Simplified Navigation Component for Testing
export default function TestNavigation() {
  const pathname = usePathname();
  const isCarrierPlatform = pathname === '/carrier-landing';
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleDropdownClick = (dropdownName: string) => {
    console.info(
      'Dropdown clicked:',
      dropdownName,
      'Current active:',
      activeDropdown
    );
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownClose = () => {
    console.info('Closing dropdown');
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        console.info('Clicked outside, closing dropdown');
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.info('Navigation render - activeDropdown:', activeDropdown);

  return (
    <nav
      ref={navRef}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <Link
          href='/'
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
          }}
        >
          🚛 FleetFlow
        </Link>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {/* OPERATIONS Dropdown - Blue */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('operations')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚛 OPERATIONS ▼
            </button>
            <div
              style={{
                display: activeDropdown === 'operations' ? 'block' : 'none',
                position: 'absolute',
                background: 'white',
                minWidth: '200px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '12px 0',
                top: '100%',
                left: 0,
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 1001,
              }}
            >
              <Link
                href='/dispatch'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                🚛 Dispatch Central
              </Link>
              <Link
                href='/broker/dashboard'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                🏢 Broker Box
              </Link>
            </div>
          </div>

          {/* DRIVER MANAGEMENT Dropdown - Yellow/Orange */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('drivers')}
              style={{
                background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
                color: '#2d3748',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚛 DRIVER MANAGEMENT ▼
            </button>
            <div
              style={{
                display: activeDropdown === 'drivers' ? 'block' : 'none',
                position: 'absolute',
                background: 'white',
                minWidth: '220px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '12px 0',
                top: '100%',
                left: 0,
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 1001,
              }}
            >
              <Link
                href='/carrier-landing'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#f4a832',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                🌐 Carrier Network
              </Link>
              <Link
                href='/drivers'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#f4a832',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                🚛 Driver Management
              </Link>
              <Link
                href='/admin/driver-otr-flow'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#f4a832',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                👥 Admin: Driver OTR Flow
              </Link>
              <Link
                href='/onboarding/carrier-onboarding'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#f4a832',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                🚛 Carrier Onboarding
              </Link>
              <Link
                href='/carriers/enhanced-portal'
                onClick={handleDropdownClose}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#f4a832',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                🏢 Enhanced Carrier Portal
              </Link>
            </div>
          </div>

          {/* ANALYTICS - Single Button */}
          <Link href='/analytics' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📊 ANALYTICS
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
