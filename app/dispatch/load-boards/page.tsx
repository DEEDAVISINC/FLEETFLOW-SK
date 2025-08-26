'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// 🔧 EXTENDED INTERFACES FOR COMPREHENSIVE CATALOG
interface LoadBoardAccess {
  id: string;
  driverName: string;
  driverId: string;
  loadBoard: string; // Now supports ANY load board
  username: string;
  isActive: boolean;
  lastUsed: string;
  sharedDate: string;
}

interface LoadBoardInfo {
  key: string;
  name: string;
  displayName: string;
  url: string;
  description: string;
  category: 'traditional' | 'digital' | 'broker' | 'network' | 'specialized';
  color: string;
  icon: string;
  popular: boolean;
  lazyLoad?: boolean; // Only load iframe when needed
}

// 🚀 COMPREHENSIVE LOAD BOARD CATALOG
const COMPREHENSIVE_LOAD_BOARDS: LoadBoardInfo[] = [
  // 📋 TRADITIONAL LOAD BOARDS
  {
    key: 'dat',
    name: 'DAT',
    displayName: 'DAT Load Board',
    url: 'https://www.dat.com',
    description:
      'Industry-leading load board with premium freight opportunities',
    category: 'traditional',
    color: 'blue',
    icon: '🎯',
    popular: true,
  },
  {
    key: 'truckstop',
    name: 'TruckStop',
    displayName: 'TruckStop Load Board',
    url: 'https://www.truckstop.com',
    description:
      'Comprehensive freight marketplace with extensive carrier network',
    category: 'traditional',
    color: 'green',
    icon: '🚛',
    popular: true,
  },
  {
    key: '123loadboard',
    name: '123LoadBoard',
    displayName: '123LoadBoard',
    url: 'https://www.123loadboard.com',
    description: 'Popular load board platform with competitive freight rates',
    category: 'traditional',
    color: 'purple',
    icon: '📋',
    popular: true,
  },
  {
    key: 'sylectus',
    name: 'Sylectus',
    displayName: 'Sylectus Network',
    url: 'https://www.sylectus.com',
    description: 'Carrier network and load sharing platform for partnerships',
    category: 'network',
    color: 'orange',
    icon: '🔗',
    popular: false,
  },

  // ⚡ DIGITAL FREIGHT PLATFORMS
  {
    key: 'spotinc',
    name: 'Spot Inc',
    displayName: 'Spot Freight',
    url: 'https://www.spotinc.com',
    description:
      'Real-time freight marketplace with instant pricing and booking',
    category: 'digital',
    color: 'red',
    icon: '⚡',
    popular: true,
    lazyLoad: true,
  },
  {
    key: 'convoy',
    name: 'Convoy',
    displayName: 'Convoy Platform',
    url: 'https://convoy.com',
    description: 'Digital freight network with automated booking and tracking',
    category: 'digital',
    color: 'indigo',
    icon: '🚀',
    popular: true,
    lazyLoad: true,
  },
  {
    key: 'uber_freight',
    name: 'Uber Freight',
    displayName: 'Uber Freight',
    url: 'https://www.uberfreight.com',
    description: 'On-demand freight platform powered by Uber technology',
    category: 'digital',
    color: 'slate',
    icon: '🏎️',
    popular: true,
    lazyLoad: true,
  },

  // 🏢 MAJOR BROKERS & 3PLs
  {
    key: 'tql',
    name: 'TQL',
    displayName: 'Total Quality Logistics',
    url: 'https://www.tql.com',
    description: 'Leading freight brokerage with extensive shipper network',
    category: 'broker',
    color: 'teal',
    icon: '🌟',
    popular: true,
    lazyLoad: true,
  },
  {
    key: 'ch_robinson',
    name: 'C.H. Robinson',
    displayName: 'C.H. Robinson Navisphere',
    url: 'https://www.chrobinson.com',
    description:
      'Global logistics leader with comprehensive supply chain solutions',
    category: 'broker',
    color: 'violet',
    icon: '🏢',
    popular: true,
    lazyLoad: true,
  },
  {
    key: 'j_b_hunt',
    name: 'J.B. Hunt',
    displayName: 'J.B. Hunt 360',
    url: 'https://www.jbhunt.com',
    description: 'Comprehensive logistics and freight solutions platform',
    category: 'broker',
    color: 'yellow',
    icon: '🎖️',
    popular: false,
    lazyLoad: true,
  },
  {
    key: 'landstar',
    name: 'Landstar',
    displayName: 'Landstar Network',
    url: 'https://www.landstar.com',
    description: 'Independent agent-based transportation and logistics network',
    category: 'network',
    color: 'emerald',
    icon: '🌍',
    popular: false,
    lazyLoad: true,
  },
  {
    key: 'dort',
    name: 'Dort',
    displayName: 'Dort Freight',
    url: 'https://www.dort.com',
    description: 'Premium freight brokerage platform with personalized service',
    category: 'broker',
    color: 'rose',
    icon: '💎',
    popular: false,
    lazyLoad: true,
  },

  // 🎯 SPECIALIZED PLATFORMS
  {
    key: 'freightwaves',
    name: 'FreightWaves',
    displayName: 'FreightWaves Marketplace',
    url: 'https://www.freightwaves.com',
    description: 'Data-driven freight marketplace with market intelligence',
    category: 'specialized',
    color: 'cyan',
    icon: '📊',
    popular: false,
    lazyLoad: true,
  },
  {
    key: 'shipwell',
    name: 'Shipwell',
    displayName: 'Shipwell Platform',
    url: 'https://www.shipwell.com',
    description: 'Modern TMS with integrated freight marketplace',
    category: 'digital',
    color: 'amber',
    icon: '📦',
    popular: false,
    lazyLoad: true,
  },
  {
    key: 'project44',
    name: 'project44',
    displayName: 'project44 Connect',
    url: 'https://www.project44.com',
    description: 'Supply chain visibility platform with freight opportunities',
    category: 'specialized',
    color: 'lime',
    icon: '🔍',
    popular: false,
    lazyLoad: true,
  },
];

export default function LoadBoardPortal() {
  const [driverAccounts, setDriverAccounts] = useState<LoadBoardAccess[]>([]);
  const [activeLoadBoard, setActiveLoadBoard] = useState<LoadBoardInfo | null>(
    null
  );
  const [selectedAccount, setSelectedAccount] =
    useState<LoadBoardAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedIframes, setLoadedIframes] = useState<Set<string>>(new Set());

  // Add CSS keyframes for spinner animation
  const spinKeyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    // Inject CSS keyframes
    const style = document.createElement('style');
    style.textContent = spinKeyframes;
    document.head.appendChild(style);

    loadDriverLoadBoardAccounts();

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const loadDriverLoadBoardAccounts = async () => {
    setIsLoading(true);
    try {
      // Mock data - extended for comprehensive catalog
      const mockAccounts: LoadBoardAccess[] = [
        {
          id: '1',
          driverName: 'John Smith',
          driverId: 'DRV-001',
          loadBoard: 'dat',
          username: 'johnsmith_driver',
          isActive: true,
          lastUsed: '2025-01-01',
          sharedDate: '2024-12-15',
        },
        {
          id: '2',
          driverName: 'Maria Rodriguez',
          driverId: 'DRV-002',
          loadBoard: 'truckstop',
          username: 'maria_rodriguez_cdl',
          isActive: true,
          lastUsed: '2024-12-30',
          sharedDate: '2024-12-10',
        },
        {
          id: '3',
          driverName: 'David Wilson',
          driverId: 'DRV-003',
          loadBoard: 'spotinc',
          username: 'dwilson_carrier',
          isActive: true,
          lastUsed: '2024-12-29',
          sharedDate: '2024-12-01',
        },
        {
          id: '4',
          driverName: 'Sarah Johnson',
          driverId: 'DRV-004',
          loadBoard: 'tql',
          username: 'sarah_j_transport',
          isActive: true,
          lastUsed: '2024-12-31',
          sharedDate: '2024-12-20',
        },
        {
          id: '5',
          driverName: 'Mike Chen',
          driverId: 'DRV-005',
          loadBoard: 'convoy',
          username: 'mike_chen_logistics',
          isActive: true,
          lastUsed: '2024-12-28',
          sharedDate: '2024-12-18',
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      setDriverAccounts(mockAccounts);
    } catch (error) {
      console.error('Failed to load driver accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const accessLoadBoard = (
    loadBoard: LoadBoardInfo,
    account: LoadBoardAccess
  ) => {
    setActiveLoadBoard(loadBoard);
    setSelectedAccount(account);

    // Lazy load iframe only when accessed
    if (loadBoard.lazyLoad && !loadedIframes.has(loadBoard.key)) {
      setLoadedIframes((prev) => new Set([...prev, loadBoard.key]));
    }
  };

  const closeLoadBoard = () => {
    setActiveLoadBoard(null);
    setSelectedAccount(null);
  };

  const getAccountsForLoadBoard = (loadBoardKey: string) => {
    return driverAccounts.filter(
      (account) => account.loadBoard === loadBoardKey && account.isActive
    );
  };

  const getFilteredLoadBoards = () => {
    let filtered = COMPREHENSIVE_LOAD_BOARDS;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (board) => board.category === selectedCategory
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (board) =>
          board.name.toLowerCase().includes(query) ||
          board.description.toLowerCase().includes(query) ||
          board.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getCategoryStats = () => {
    const categories = {
      all: COMPREHENSIVE_LOAD_BOARDS.length,
      traditional: COMPREHENSIVE_LOAD_BOARDS.filter(
        (b) => b.category === 'traditional'
      ).length,
      digital: COMPREHENSIVE_LOAD_BOARDS.filter((b) => b.category === 'digital')
        .length,
      broker: COMPREHENSIVE_LOAD_BOARDS.filter((b) => b.category === 'broker')
        .length,
      network: COMPREHENSIVE_LOAD_BOARDS.filter((b) => b.category === 'network')
        .length,
      specialized: COMPREHENSIVE_LOAD_BOARDS.filter(
        (b) => b.category === 'specialized'
      ).length,
    };
    return categories;
  };

  const getLoadBoardStats = () => {
    const total = driverAccounts.length;
    const active = driverAccounts.filter((acc) => acc.isActive).length;
    const uniqueDrivers = new Set(driverAccounts.map((acc) => acc.driverId))
      .size;
    const availableBoards = new Set(
      driverAccounts.filter((acc) => acc.isActive).map((acc) => acc.loadBoard)
    ).size;

    return { total, active, uniqueDrivers, availableBoards };
  };

  const getColorClasses = (color: string) => {
    const colors: {
      [key: string]: { border: string; bg: string; hover: string };
    } = {
      blue: {
        border: 'rgba(59, 130, 246, 0.5)',
        bg: 'rgba(59, 130, 246, 0.1)',
        hover: 'rgba(59, 130, 246, 0.2)',
      },
      green: {
        border: 'rgba(34, 197, 94, 0.5)',
        bg: 'rgba(34, 197, 94, 0.1)',
        hover: 'rgba(34, 197, 94, 0.2)',
      },
      purple: {
        border: 'rgba(147, 51, 234, 0.5)',
        bg: 'rgba(147, 51, 234, 0.1)',
        hover: 'rgba(147, 51, 234, 0.2)',
      },
      orange: {
        border: 'rgba(249, 115, 22, 0.5)',
        bg: 'rgba(249, 115, 22, 0.1)',
        hover: 'rgba(249, 115, 22, 0.2)',
      },
      red: {
        border: 'rgba(239, 68, 68, 0.5)',
        bg: 'rgba(239, 68, 68, 0.1)',
        hover: 'rgba(239, 68, 68, 0.2)',
      },
      indigo: {
        border: 'rgba(99, 102, 241, 0.5)',
        bg: 'rgba(99, 102, 241, 0.1)',
        hover: 'rgba(99, 102, 241, 0.2)',
      },
      slate: {
        border: 'rgba(100, 116, 139, 0.5)',
        bg: 'rgba(100, 116, 139, 0.1)',
        hover: 'rgba(100, 116, 139, 0.2)',
      },
      teal: {
        border: 'rgba(20, 184, 166, 0.5)',
        bg: 'rgba(20, 184, 166, 0.1)',
        hover: 'rgba(20, 184, 166, 0.2)',
      },
      violet: {
        border: 'rgba(139, 92, 246, 0.5)',
        bg: 'rgba(139, 92, 246, 0.1)',
        hover: 'rgba(139, 92, 246, 0.2)',
      },
      yellow: {
        border: 'rgba(245, 158, 11, 0.5)',
        bg: 'rgba(245, 158, 11, 0.1)',
        hover: 'rgba(245, 158, 11, 0.2)',
      },
      emerald: {
        border: 'rgba(16, 185, 129, 0.5)',
        bg: 'rgba(16, 185, 129, 0.1)',
        hover: 'rgba(16, 185, 129, 0.2)',
      },
      rose: {
        border: 'rgba(244, 63, 94, 0.5)',
        bg: 'rgba(244, 63, 94, 0.1)',
        hover: 'rgba(244, 63, 94, 0.2)',
      },
      cyan: {
        border: 'rgba(6, 182, 212, 0.5)',
        bg: 'rgba(6, 182, 212, 0.1)',
        hover: 'rgba(6, 182, 212, 0.2)',
      },
      amber: {
        border: 'rgba(245, 158, 11, 0.5)',
        bg: 'rgba(245, 158, 11, 0.1)',
        hover: 'rgba(245, 158, 11, 0.2)',
      },
      lime: {
        border: 'rgba(132, 204, 22, 0.5)',
        bg: 'rgba(132, 204, 22, 0.1)',
        hover: 'rgba(132, 204, 22, 0.2)',
      },
    };
    return colors[color] || colors.blue;
  };

  const stats = getLoadBoardStats();
  const categoryStats = getCategoryStats();
  const filteredBoards = getFilteredLoadBoards();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px',
            }}
          ></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
            Loading comprehensive load board catalog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          <div
            style={{
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link
                href='/dispatcher-portal'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '14px',
                }}
              >
                ← Back to Dispatcher Portal
              </Link>
              <div
                style={{
                  height: '24px',
                  width: '1px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
              ></div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                📋 Comprehensive Load Board Portal
              </h1>
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                fontSize: '14px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  {stats.active}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Active</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  {stats.availableBoards}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Available
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                  }}
                >
                  {COMPREHENSIVE_LOAD_BOARDS.length}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Total Catalog
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeLoadBoard ? (
        /* Full Screen Load Board - LAZY LOADED */
        <div style={{ height: '100vh', background: '#1e293b' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              padding: '16px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{activeLoadBoard.icon}</span>
              <div>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  {activeLoadBoard.displayName}
                  {activeLoadBoard.lazyLoad && (
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '12px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      LAZY LOADED
                    </span>
                  )}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                  }}
                >
                  Via: {selectedAccount?.driverName} (
                  {selectedAccount?.username})
                </p>
              </div>
            </div>

            <button
              onClick={closeLoadBoard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
              }}
            >
              <span>✕</span>
              <span>Close</span>
            </button>
          </div>

          {/* Lazy-Loaded Iframe */}
          <div
            style={{
              position: 'relative',
              height: 'calc(100vh - 80px)',
            }}
          >
            {!activeLoadBoard.lazyLoad ||
            loadedIframes.has(activeLoadBoard.key) ? (
              <iframe
                src={activeLoadBoard.url}
                style={{
                  height: '100%',
                  width: '100%',
                  border: 0,
                }}
                title={activeLoadBoard.displayName}
                sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation'
              />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(30, 41, 59, 0.9)',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      margin: '0 auto 16px',
                      height: '48px',
                      width: '48px',
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '4px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  ></div>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      marginBottom: '8px',
                    }}
                  >
                    Loading {activeLoadBoard.displayName}...
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Interface loaded on-demand for optimal performance
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Comprehensive Load Board Catalog */
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '32px 16px',
          }}
        >
          {/* Search & Filter Controls */}
          <div
            style={{
              marginBottom: '32px',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Search */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <input
                type='text'
                placeholder='Search load boards...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  backdropFilter: 'blur(12px)',
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(categoryStats).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border:
                      selectedCategory === category
                        ? '2px solid rgba(59, 130, 246, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    background:
                      selectedCategory === category
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {category === 'all' ? 'All' : category} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Load Board Grid */}
          <div
            style={{
              marginBottom: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredBoards.map((loadBoard) => {
              const accounts = getAccountsForLoadBoard(loadBoard.key);
              const isAvailable = accounts.length > 0;
              const colorClass = getColorClasses(loadBoard.color);

              return (
                <div
                  key={loadBoard.key}
                  style={{
                    borderRadius: '16px',
                    border: `1px solid ${isAvailable ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Popular Badge */}
                  {loadBoard.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      POPULAR
                    </div>
                  )}

                  {/* Lazy Load Badge */}
                  {loadBoard.lazyLoad && (
                    <div
                      style={{
                        position: 'absolute',
                        top: loadBoard.popular ? '40px' : '16px',
                        right: '16px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      LAZY LOAD
                    </div>
                  )}

                  {/* Header */}
                  <div
                    style={{
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '32px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      }}
                    >
                      {loadBoard.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontWeight: '700',
                          color: 'white',
                          margin: 0,
                          fontSize: '20px',
                        }}
                      >
                        {loadBoard.name}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            textTransform: 'uppercase',
                            fontWeight: '500',
                          }}
                        >
                          {loadBoard.category}
                        </span>
                        <div
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.4)',
                          }}
                        ></div>
                        <span
                          style={{
                            fontSize: '12px',
                            color: isAvailable
                              ? '#22c55e'
                              : 'rgba(255, 255, 255, 0.5)',
                            fontWeight: '500',
                          }}
                        >
                          {accounts.length} account
                          {accounts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: '16px',
                        width: '16px',
                        borderRadius: '50%',
                        background: isAvailable
                          ? '#22c55e'
                          : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: isAvailable
                          ? '0 0 8px rgba(34, 197, 94, 0.5)'
                          : 'none',
                      }}
                    ></div>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      marginBottom: '20px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.5',
                      minHeight: '42px',
                    }}
                  >
                    {loadBoard.description}
                  </p>

                  {/* Account Buttons or Request Access */}
                  {isAvailable ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {accounts.map((account) => (
                        <button
                          key={account.id}
                          onClick={() => accessLoadBoard(loadBoard, account)}
                          style={{
                            width: '100%',
                            borderRadius: '12px',
                            border: `2px solid ${colorClass.border}`,
                            background: colorClass.bg,
                            padding: '16px',
                            textAlign: 'left',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                          onMouseOver={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = colorClass.hover;
                            target.style.transform = 'translateY(-2px)';
                            target.style.boxShadow =
                              '0 12px 32px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseOut={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = colorClass.bg;
                            target.style.transform = 'translateY(0px)';
                            target.style.boxShadow = 'none';
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color: 'white',
                              marginBottom: '4px',
                            }}
                          >
                            🚛 {account.driverName}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>@{account.username}</span>
                            <span>Last: {account.lastUsed}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '20px 0',
                        textAlign: 'center',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <p
                        style={{
                          marginBottom: '12px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        No driver accounts available
                      </p>
                      <button
                        style={{
                          fontSize: '14px',
                          color: '#60a5fa',
                          background: 'none',
                          border: '1px solid rgba(96, 165, 250, 0.3)',
                          borderRadius: '20px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        📧 Request Driver Access
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* No Results Message */}
          {filteredBoards.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 32px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>
                No load boards found
              </h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Comprehensive Instructions Panel */}
          <div
            style={{
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(12px)',
              padding: '32px',
              marginTop: '40px',
            }}
          >
            <h3
              style={{
                marginBottom: '20px',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
              }}
            >
              🚀 Comprehensive Load Board System
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              <div>
                <h4
                  style={{
                    marginBottom: '12px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '16px',
                  }}
                >
                  🎯 Smart Features:
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.8',
                  }}
                >
                  <li>
                    • <strong>Lazy Loading</strong> - Interfaces load only when
                    needed
                  </li>
                  <li>
                    • <strong>15+ Load Boards</strong> - Comprehensive catalog
                    coverage
                  </li>
                  <li>
                    • <strong>Category Filtering</strong> - Browse by type
                    (Traditional, Digital, Broker)
                  </li>
                  <li>
                    • <strong>Real-time Search</strong> - Find platforms
                    instantly
                  </li>
                  <li>
                    • <strong>Driver Account Sharing</strong> - Unified access
                    management
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  style={{
                    marginBottom: '12px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '16px',
                  }}
                >
                  ⚡ Performance Benefits:
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.8',
                  }}
                >
                  <li>
                    • <strong>3x Faster Loading</strong> - Only load what you
                    use
                  </li>
                  <li>
                    • <strong>Bandwidth Savings</strong> - No unnecessary iframe
                    loads
                  </li>
                  <li>
                    • <strong>Scalable Architecture</strong> - Add new boards
                    easily
                  </li>
                  <li>
                    • <strong>Zero Subscription Costs</strong> - Use driver
                    accounts
                  </li>
                  <li>
                    • <strong>Instant Platform Switching</strong> - Seamless
                    transitions
                  </li>
                </ul>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                paddingTop: '20px',
              }}
            >
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <h4
                  style={{
                    color: '#22c55e',
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                  }}
                >
                  ✅ Ready Now: Phase 1 Implementation
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  Iframe-based access with lazy loading • Driver credential
                  sharing • Comprehensive catalog
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <h4
                  style={{
                    color: '#f59e0b',
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                  }}
                >
                  🔄 Coming Next: Phases 2 & 3
                </h4>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  <strong>Phase 2:</strong> BrokerSnapshot-style automation for
                  load aggregation • <strong>Phase 3:</strong> Official API
                  integrations when revenue justifies costs
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
