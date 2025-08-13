'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../config/access';
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
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user data
  const { user, permissions } = getCurrentUser();

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearDropdownTimer();
    };
  }, []);

  // Helper function to get user display info
  const getUserDisplayInfo = () => {
    const roleDisplayMap = {
      admin: {
        title: 'System Administrator',
        badges: ['Manager Access', 'Full Permissions'],
      },
      dispatcher: {
        title: 'Dispatch Operations',
        badges: ['Dispatch Access', 'Operations'],
      },
      broker: { title: 'Freight Broker', badges: ['Broker Access', 'Sales'] },
      driver: {
        title: 'Professional Driver',
        badges: ['Driver Access', 'Mobile'],
      },
      manager: {
        title: 'Operations Manager',
        badges: ['Manager Access', 'Oversight'],
      },
    };

    return (
      roleDisplayMap[user.role] || {
        title: 'FleetFlow User',
        badges: ['User Access'],
      }
    );
  };

  const userInfo = getUserDisplayInfo();
  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const clearDropdownTimer = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
  };

  const startDropdownTimer = () => {
    clearDropdownTimer();
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    }, 3000); // Auto-close after 3 seconds
  };

  const handleDropdownClick = (dropdownName: string) => {
    const isOpening = activeDropdown !== dropdownName;
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setActiveSubDropdown(null); // Close any sub-dropdowns when main dropdown changes

    if (isOpening) {
      startDropdownTimer(); // Start auto-close timer when opening
    } else {
      clearDropdownTimer(); // Clear timer when manually closing
    }
  };

  const handleSubDropdownClick = (subDropdownName: string) => {
    setActiveSubDropdown(
      activeSubDropdown === subDropdownName ? null : subDropdownName
    );
    // Restart timer when interacting with sub-dropdowns
    startDropdownTimer();
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    clearDropdownTimer();
  };

  // Handle mouse enter to pause auto-close
  const handleDropdownMouseEnter = () => {
    clearDropdownTimer();
  };

  // Handle mouse leave to restart auto-close
  const handleDropdownMouseLeave = () => {
    if (activeDropdown) {
      startDropdownTimer();
    }
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
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
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
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
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
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
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

          {/* GO WITH THE FLOW - Single Button */}
          <Link href='/go-with-the-flow' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                color: 'white',
                padding: '8px 14px',
                border: '2px solid #f4a832',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 0 8px rgba(244, 168, 50, 0.3)',
              }}
            >
              🌊 GO WITH THE FLOW
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
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
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
                <Link
                  href='/insurance-partnerships'
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
                  🛡️ Insurance Partnerships
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
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
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
                  href='/ai-company-dashboard'
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
                  🤖 AI Company Dashboard
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
                  👤 User Profile Template
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
                <Link
                  href='/analytics'
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
                  📊 Analytics Dashboard
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
                  href='/billing'
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
                  💳 Subscriptions
                </Link>
                <Link
                  href='/billing-invoices'
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
                  🧾 Billing & Invoices
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

          {/* User Profile Dropdown */}
          <div style={{ position: 'relative', marginLeft: '10px' }}>
            <div
              onClick={() => handleDropdownClick('userprofile')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #14b8a6, #0d9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
                transition: 'all 0.2s ease',
                transform:
                  activeDropdown === 'userprofile' ? 'scale(1.05)' : 'scale(1)',
                border:
                  activeDropdown === 'userprofile'
                    ? '2px solid #10b981'
                    : '2px solid transparent',
              }}
            >
              {userInitials}
            </div>

            {/* User Profile Dropdown Menu */}
            {activeDropdown === 'userprofile' && (
              <div
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                style={{
                  position: 'absolute',
                  background: 'white',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '16px 0',
                  top: '100%',
                  right: 0,
                  minWidth: '320px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  zIndex: 1001,
                  marginTop: '8px',
                }}
              >
                {/* User Info Header */}
                <div
                  style={{
                    padding: '0 20px 16px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #14b8a6, #0d9488)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {userInitials}
                    </div>
                    <div>
                      <div
                        style={{
                          color: '#111827',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {user.name}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>
                        {userInfo.title}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#059669',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {userInfo.badges[0]}
                    </span>
                    {userInfo.badges[1] && (
                      <span
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#2563eb',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {userInfo.badges[1]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Access Items */}
                <div style={{ padding: '8px 0' }}>
                  <div
                    onClick={() => handleSubDropdownClick('userprofileview')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        'rgba(20, 184, 166, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = 'transparent')
                    }
                  >
                    <span style={{ fontSize: '16px' }}>👤</span>
                    My Profile & Access {activeSubDropdown === 'userprofileview' ? '🔽' : '▼'}
                  </div>

                  <Link
                    href='/settings'
                    onClick={handleDropdownClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#374151',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        'rgba(20, 184, 166, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = 'transparent')
                    }
                  >
                    <span style={{ fontSize: '16px' }}>⚙️</span>
                    Account Settings
                  </Link>

                  <Link
                    href='/notifications'
                    onClick={handleDropdownClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      color: '#374151',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        'rgba(20, 184, 166, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = 'transparent')
                    }
                  >
                    <span style={{ fontSize: '16px' }}>🔔</span>
                    Notifications
                  </Link>
                </div>

                {/* Access Summary */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Current Access Level
                  </div>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: '#374151', fontSize: '13px' }}>
                        Operations
                      </span>
                      <span
                        style={{
                          color: permissions.canEditLoads
                            ? '#10b981'
                            : '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {permissions.canEditLoads ? '✓ Full' : '✗ Limited'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: '#374151', fontSize: '13px' }}>
                        Analytics
                      </span>
                      <span
                        style={{
                          color: permissions.canViewAllLoads
                            ? '#10b981'
                            : '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {permissions.canViewAllLoads ? '✓ Full' : '✗ Limited'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: '#374151', fontSize: '13px' }}>
                        User Management
                      </span>
                      <span
                        style={{
                          color: permissions.hasManagementAccess
                            ? '#10b981'
                            : '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {permissions.hasManagementAccess
                          ? '✓ Admin'
                          : '✗ No Access'}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: '#374151', fontSize: '13px' }}>
                        Financial
                      </span>
                      <span
                        style={{
                          color: permissions.canViewFinancials
                            ? '#10b981'
                            : '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {permissions.canViewFinancials
                          ? '✓ Manager'
                          : '✗ No Access'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Session Info
                  </div>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#6b7280' }}>Last Login:</span>
                      <span style={{ color: '#374151' }}>Today 9:15 AM</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#6b7280' }}>Session:</span>
                      <span style={{ color: '#10b981', fontWeight: '500' }}>
                        Active
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#6b7280' }}>IP Address:</span>
                      <span style={{ color: '#374151' }}>192.168.1.100</span>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div style={{ padding: '8px 0' }}>
                  <button
                    onClick={handleDropdownClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        'rgba(220, 38, 38, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = 'transparent')
                    }
                  >
                    <span style={{ fontSize: '16px' }}>🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
