'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ManagerAccessControlService } from '../services/ManagerAccessControlService';
import GlobalNotificationBell from './GlobalNotificationBell';
import Logo from './Logo';

// Professional Navigation Component with Nested Dropdowns
export default function ProfessionalNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(
    null
  );
  const [isManager, setIsManager] = useState(false);
  const [isBrokerAgent, setIsBrokerAgent] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = () => {
      const managerStatus = ManagerAccessControlService.isCurrentUserManager();
      const brokerAgentStatus =
        ManagerAccessControlService.isCurrentUserBrokerAgent();
      setIsManager(managerStatus);
      setIsBrokerAgent(brokerAgentStatus);
    };

    checkUserRole();
  }, []);

  const handleDropdownClick = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setActiveSubDropdown(null); // Close any sub-dropdowns when main dropdown changes
  };

  const handleSubDropdownClick = (subDropdownName: string) => {
    setActiveSubDropdown(
      activeSubDropdown === subDropdownName ? null : subDropdownName
    );
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Don't handle click outside if clicking on freight quote buttons
      if (target.closest('.freight-quote-button')) {
        return;
      }

      // Only handle click outside if there's actually an active dropdown
      if (
        (activeDropdown || activeSubDropdown) &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setActiveDropdown(null);
        setActiveSubDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, activeSubDropdown]);

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
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Logo size='large' variant='gradient' showText={true} />
        </Link>

        <div
          style={{
            display: 'flex',
            gap: '3px',
            alignItems: 'center',
          }}
        >
          {/* OPERATIONS Dropdown - Blue */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('operations')}
              style={{
                background:
                  activeDropdown === 'operations'
                    ? 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              �� OPERATIONS {activeDropdown === 'operations' ? '🔽' : '▼'}
            </button>
            {activeDropdown === 'operations' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  left: 0,
                  border: '2px solid #3b82f6',
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
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Dispatch Central
                </Link>
                <Link
                  href='/broker'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🏢 Broker Operations
                </Link>
                <Link
                  href='/freightflow-rfx'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  📋 FreightFlow RFx℠
                </Link>
              </div>
            )}
          </div>

          {/* DRIVER MANAGEMENT Dropdown - Yellow */}
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
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚛 DRIVER MANAGEMENT ▼
            </button>
            {activeDropdown === 'drivers' && (
              <div
                style={{
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
                  href='/drivers'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f4a832',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Driver Management
                </Link>
                <Link
                  href='/onboarding/carrier-onboarding'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f4a832',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
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
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🏢 Enhanced Carrier Portal
                </Link>
              </div>
            )}
          </div>

          {/* FLEETFLOW Dropdown - Teal */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('fleet')}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🚛 FLEETFLOW ▼
            </button>
            {activeDropdown === 'fleet' && (
              <div
                style={{
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
                  href='/vehicles'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Fleet Management
                </Link>
                <Link
                  href='/routes'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  🗺️ Route Optimization
                </Link>
                <Link
                  href='/quoting'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                  }}
                >
                  💰 Freight Quoting
                </Link>
                <Link
                  href='/tracking'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🗺️ Live Load Tracking
                </Link>
              </div>
            )}
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
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📊 ANALYTICS
            </button>
          </Link>

          {/* COMPLIANCE - Single Button */}
          <Link href='/compliance' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✅ COMPLIANCE
            </button>
          </Link>

          {/* RESOURCES Dropdown - Orange */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('resources')}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              📚 RESOURCES ▼
            </button>
            {activeDropdown === 'resources' && (
              <div
                style={{
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
                  href='/university'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🎓 FleetFlow University℠
                </Link>
                <Link
                  href='/resources'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📚 Resources Library
                </Link>
                <Link
                  href='/safety'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🦺 Safety Resources
                </Link>
                <Link
                  href='/documents'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📄 Documents
                </Link>
                <Link
                  href='/documentation'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#f97316',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📋 Documents Hub
                </Link>
              </div>
            )}
          </div>

          {/* SETTINGS/ADMIN Dropdown - Purple */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => handleDropdownClick('settings')}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                padding: '10px 18px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              ⚙️ ADMIN ▼
            </button>
            {activeDropdown === 'settings' && (
              <div
                style={{
                  position: 'absolute',
                  background: 'white',
                  minWidth: '240px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '12px 0',
                  top: '100%',
                  right: 0,
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 1001,
                }}
              >
                <Link
                  href='/settings'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ⚙️ Settings
                </Link>
                <Link
                  href='/user-management'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  👥 User Management
                </Link>
                <Link
                  href='/settings'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px 10px 40px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '400',
                    opacity: '0.8',
                  }}
                >
                  👤 User Profile
                </Link>
                <Link
                  href='/dialer'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px 10px 40px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '400',
                    opacity: '0.8',
                  }}
                >
                  📞 Phone Dialer
                </Link>

                {/* MANAGER-ONLY ITEMS */}
                {isManager && (
                  <>
                    <Link
                      href='/financials'
                      onClick={handleDropdownClose}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        color: '#8B5CF6',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderLeft: '3px solid #8B5CF6',
                      }}
                    >
                      💰 Company Financial Management
                    </Link>
                    <Link
                      href='/subscription-management/subscription-dashboard'
                      onClick={handleDropdownClose}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        color: '#8B5CF6',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderLeft: '3px solid #8B5CF6',
                      }}
                    >
                      💳 Subscription Plans & Billing
                    </Link>
                    <Link
                      href='/billing'
                      onClick={handleDropdownClose}
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        color: '#8B5CF6',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderLeft: '3px solid #8B5CF6',
                      }}
                    >
                      💰 Billing & Pricing
                    </Link>
                    <div
                      style={{
                        padding: '8px 20px',
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      🔒 Manager Only
                    </div>
                  </>
                )}

                {/* RESTRICTED MESSAGE FOR BROKER AGENTS */}
                {isBrokerAgent && (
                  <div
                    style={{
                      padding: '12px 20px',
                      fontSize: '0.8rem',
                      color: '#EF4444',
                      fontWeight: '500',
                      background: 'rgba(239, 68, 68, 0.05)',
                      borderLeft: '3px solid #EF4444',
                      fontStyle: 'italic',
                    }}
                  >
                    🔒 Financial & billing management
                    <br />
                    requires manager access
                  </div>
                )}
                <Link
                  href='/admin/driver-otr-flow'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🚛 Driver OTR Flow
                </Link>
                <Link
                  href='/admin/accounting'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  💰 Accounting & Finance
                </Link>
                <Link
                  href='/reports'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  📊 Reports & Analytics
                </Link>
                <Link
                  href='/vendor-management'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🤝 Vendor Management
                </Link>
                <Link
                  href='/vendor-portal'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px 10px 40px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '400',
                    opacity: '0.8',
                  }}
                >
                  🏢 Vendor/Shipper Portal
                </Link>
                <Link
                  href='/automation-demo'
                  onClick={handleDropdownClose}
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  🔧 Tech System
                </Link>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <GlobalNotificationBell department='admin' />

          {/* User Avatar */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #0EA5E9, #2DD4BF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginLeft: '10px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
            }}
          >
            A
          </div>
        </div>
      </div>
    </nav>
  );
}
