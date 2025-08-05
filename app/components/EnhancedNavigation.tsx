'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ManagerAccessControlService } from '../services/ManagerAccessControlService';
import GlobalNotificationBell from './GlobalNotificationBell';

// Enhanced Navigation Component with Role-Based Admin Profile Dropdown
export default function EnhancedNavigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [isBrokerAgent, setIsBrokerAgent] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Mock current user data (in production, this would come from auth context)
  const [currentUser] = useState({
    id: 'FM-MGR-2023005',
    name: 'Frank Miller',
    email: 'frank.miller@fleetflow.com',
    role: 'Fleet Manager',
    department: 'Management',
    permissions: ['all'],
    lastLogin: 'Current session',
    avatar: 'FM'
  });

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = () => {
      const managerStatus = ManagerAccessControlService.isCurrentUserManager();
      const brokerAgentStatus = ManagerAccessControlService.isCurrentUserBrokerAgent();
      setIsManager(managerStatus);
      setIsBrokerAgent(brokerAgentStatus);
    };

    checkUserRole();
  }, []);

  // Role-based menu configuration
  const getProfileMenuItems = () => {
    const baseItems = [
      { icon: '👤', label: 'Profile Settings', href: '/profile', category: 'profile' },
      { icon: '🔔', label: 'Notification Settings', href: '/notifications', category: 'profile' },
      { icon: '📚', label: 'FleetFlow University℠', href: '/training', category: 'profile' },
      { icon: '🎯', label: 'Quick Actions', href: '/quick-actions', category: 'profile' },
    ];

    const managerItems = [
      { icon: '🏢', label: 'Portal Management', href: '/admin/portals', category: 'management' },
      { icon: '💰', label: 'Billing & Subscriptions', href: '/admin/billing', category: 'management' },
      { icon: '👥', label: 'User Management', href: '/user-management', category: 'management' },
      { icon: '📊', label: 'System Analytics', href: '/admin/analytics', category: 'management' },
      { icon: '🎛️', label: 'Admin Dashboard', href: '/admin/dashboard', category: 'management' },
    ];

    const adminItems = [
      { icon: '⚙️', label: 'System Settings', href: '/settings', category: 'admin' },
      { icon: '🔧', label: 'Feature Flags', href: '/admin/features', category: 'admin' },
      { icon: '🔌', label: 'API Management', href: '/admin/api', category: 'admin' },
      { icon: '📝', label: 'Audit Logs', href: '/admin/logs', category: 'admin' },
      { icon: '🔐', label: 'Security Center', href: '/admin/security', category: 'admin' },
    ];

    if (currentUser.role === 'Fleet Manager' || isManager) {
      return [...baseItems, ...managerItems, ...adminItems];
    } else if (currentUser.role === 'Manager') {
      return [...baseItems, ...managerItems];
    } else {
      return baseItems;
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setActiveSubDropdown(null);
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    } else {
      setActiveDropdown(dropdown);
      setActiveSubDropdown(null);
    }
    setShowProfileDropdown(false);
  };

  const handleSubDropdownToggle = (subDropdown: string) => {
    setActiveSubDropdown(activeSubDropdown === subDropdown ? null : subDropdown);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
    setActiveSubDropdown(null);
    setShowProfileDropdown(false);
  };

  console.log('Navigation render - activeDropdown:', activeDropdown, 'activeSubDropdown:', activeSubDropdown);

  return (
    <nav
      ref={navRef}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={handleDropdownClose}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🚛 FleetFlow
          </Link>

          {/* Main Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Operations Dropdown */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => handleDropdownToggle('operations')}
                style={{
                  background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                  color: 'white',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                🚚 OPERATIONS ▼
              </button>
              {activeDropdown === 'operations' && (
                <div
                  style={{
                    position: 'absolute',
                    background: 'white',
                    minWidth: '240px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    borderRadius: '12px',
                    padding: '12px 0',
                    top: '100%',
                    left: 0,
                    border: '1px solid rgba(0,0,0,0.1)',
                    zIndex: 1001,
                  }}
                >
                  <Link href="/dispatch" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    📋 Dispatch Central
                  </Link>
                  <Link href="/broker" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    📦 Broker Box
                  </Link>
                  <Link href="/quoting" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    💰 Freight Quoting
                  </Link>
                  <Link href="/carriers" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    🚛 Carrier Portal
                  </Link>
                  <Link href="/tracking" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    📍 Live Load Tracking
                  </Link>
                </div>
              )}
            </div>

            {/* Fleet Management Dropdown */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => handleDropdownToggle('fleet')}
                style={{
                  background: 'linear-gradient(145deg, #14B8A6, #0D9488)',
                  color: 'white',
                  padding: '12px 20px',
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
                  <Link href="/vehicles" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    🚚 Vehicles
                  </Link>
                  <Link href="/drivers" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    👥 Drivers
                  </Link>
                  <Link href="/routes" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    🗺️ Routes
                  </Link>
                  <Link href="/maintenance" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#14b8a6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    🔧 Maintenance
                  </Link>
                </div>
              )}
            </div>

            {/* Analytics Dropdown */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => handleDropdownToggle('analytics')}
                style={{
                  background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
                  color: 'white',
                  padding: '12px 20px',
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
                📊 ANALYTICS ▼
              </button>
              {activeDropdown === 'analytics' && (
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
                  <Link href="/analytics" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#8b5cf6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    📈 Analytics Dashboard
                  </Link>
                  <Link href="/reports" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#8b5cf6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    📋 Reports
                  </Link>
                  <Link href="/performance" onClick={handleDropdownClose} style={{ display: 'block', padding: '10px 20px', color: '#8b5cf6', textDecoration: 'none', fontSize: '0.85rem' }}>
                    🎯 Performance
                  </Link>
                </div>
              )}
            </div>

            {/* AI Flow */}
            <Link
              href="/ai-flow"
              onClick={handleDropdownClose}
              style={{
                background: 'linear-gradient(145deg, #F59E0B, #D97706)',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🤖 AI FLOW
            </Link>
          </div>

          {/* Right Side - Notifications & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GlobalNotificationBell department='admin' />

            {/* Enhanced User Profile Dropdown */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
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
                  boxShadow: showProfileDropdown 
                    ? '0 8px 25px rgba(14, 165, 233, 0.4)' 
                    : '0 4px 12px rgba(14, 165, 233, 0.25)',
                  transform: showProfileDropdown ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {currentUser.avatar}
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    background: 'white',
                    minWidth: '320px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    overflow: 'hidden',
                  }}
                >
                  {/* Profile Header */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #0EA5E9, #2DD4BF)',
                      padding: '20px',
                      color: 'white',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        {currentUser.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {currentUser.name}
                        </div>
                        <div style={{ opacity: 0.9, fontSize: '14px' }}>
                          {currentUser.role} • {currentUser.department}
                        </div>
                        <div style={{ opacity: 0.8, fontSize: '12px' }}>
                          Last login: {currentUser.lastLogin}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items by Category */}
                  <div style={{ padding: '8px 0' }}>
                    {/* Profile Section */}
                    <div style={{ padding: '8px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Profile
                    </div>
                    {getProfileMenuItems().filter(item => item.category === 'profile').map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setShowProfileDropdown(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 20px',
                          textDecoration: 'none',
                          color: '#374151',
                          transition: 'all 0.2s ease',
                          borderLeft: '3px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.borderLeftColor = '#0EA5E9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{item.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {item.label}
                        </span>
                      </Link>
                    ))}

                    {/* Management Section */}
                    {(currentUser.role === 'Fleet Manager' || isManager) && (
                      <>
                        <div style={{ padding: '8px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                          Management
                        </div>
                        {getProfileMenuItems().filter(item => item.category === 'management').map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setShowProfileDropdown(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 20px',
                              textDecoration: 'none',
                              color: '#374151',
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f3f4f6';
                              e.currentTarget.style.borderLeftColor = '#f59e0b';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderLeftColor = 'transparent';
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>{item.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </>
                    )}

                    {/* Admin Section */}
                    {currentUser.role === 'Fleet Manager' && (
                      <>
                        <div style={{ padding: '8px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                          Administration
                        </div>
                        {getProfileMenuItems().filter(item => item.category === 'admin').map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => setShowProfileDropdown(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 20px',
                              textDecoration: 'none',
                              color: '#374151',
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f3f4f6';
                              e.currentTarget.style.borderLeftColor = '#dc2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderLeftColor = 'transparent';
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>{item.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Logout Section */}
                  <div
                    style={{
                      borderTop: '1px solid #e5e7eb',
                      padding: '12px 20px',
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        // Add logout logic here
                        console.log('Logout clicked');
                        alert('Logout functionality would be implemented here');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0',
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderRadius = '6px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}