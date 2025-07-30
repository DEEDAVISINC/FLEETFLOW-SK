'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '../components/Logo';
import { checkPermission } from '../config/access';
import { useShipper } from '../contexts/ShipperContext';

// Access control component
const AccessRestricted = () => (
  <div
    style={{
      background: `
      linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
      radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
    `,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}
  >
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px 32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'white',
          marginBottom: '16px',
        }}
      >
        Management Access Required
      </h1>
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '16px',
          lineHeight: '1.6',
        }}
      >
        You need management or admin permissions to access the Shipper
        Management Hub.
      </p>
      <Link href='/' style={{ textDecoration: 'none' }}>
        <button
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Go Back
        </button>
      </Link>
    </div>
  </div>
);

// Shipper Card Component
const ShipperCard: React.FC<{ shipper: any; onClick: () => void }> = ({
  shipper,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#059669';
      case 'pending':
        return '#f59e0b';
      case 'inactive':
        return '#dc2626';
      case 'suspended':
        return '#d97706';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'pending':
        return '⏳';
      case 'inactive':
        return '❌';
      case 'suspended':
        return '⚠️';
      default:
        return '❓';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 12px 40px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3
            style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '4px',
            }}
          >
            {shipper.companyName}
          </h3>
          <div
            style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
          >
            {shipper.industry || 'Manufacturing'}
          </div>
        </div>
        <div
          style={{
            background: getStatusColor(shipper.status || 'active'),
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {getStatusIcon(shipper.status || 'active')}
          {(shipper.status || 'active').charAt(0).toUpperCase() +
            (shipper.status || 'active').slice(1)}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
          >
            Locations:
          </span>
          <span style={{ color: 'white', fontWeight: '500' }}>
            {shipper.locations?.length || 3}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
          >
            Active Loads:
          </span>
          <span style={{ color: 'white', fontWeight: '500' }}>
            {Math.floor(Math.random() * 15) + 1}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
          >
            Monthly Volume:
          </span>
          <span style={{ color: 'white', fontWeight: '500' }}>
            ${Math.floor(Math.random() * 500) + 100}K
          </span>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        Primary: {shipper.locations?.[0]?.city || 'Detroit'},{' '}
        {shipper.locations?.[0]?.state || 'MI'}
      </div>
    </div>
  );
};

export default function ShipperManagementHub() {
  // Check access permission - Management/Admin only
  if (
    !checkPermission('canManageShipperPortal') &&
    !checkPermission('canViewShipperPortal')
  ) {
    return <AccessRestricted />;
  }

  // Generate proper 9-character freight industry identifiers for shippers
  const generateShipperIdentifier = (
    companyName: string,
    industry: string
  ): string => {
    // Map industries to commodity codes
    const commodityCodes: Record<string, string> = {
      'Steel Manufacturing': '070', // Steel products
      Automotive: '065', // Auto parts
      'Food & Beverage': '040', // Food products
      'Chemical Manufacturing': '080', // Chemicals
      Electronics: '085', // Electronics
      Retail: '050', // General merchandise
      Construction: '075', // Construction materials
      Pharmaceutical: '090', // Pharmaceuticals
    };

    const commodityCode = commodityCodes[industry] || '070';

    // Extract company initials
    const initials = companyName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();

    return `${initials}-204-${commodityCode}`;
  };

  const { shippers, loadRequests, setLoadRequests } = useShipper();
  const [activeView, setActiveView] = useState<
    'dashboard' | 'directory' | 'loads' | 'analytics' | 'contracts'
  >('dashboard');
  const [selectedShipper, setSelectedShipper] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'pending' | 'suspended'
  >('all');

  // Mock additional shippers for management view with proper freight industry identifiers
  const [allShippers, setAllShippers] = useState([
    ...shippers.map((shipper) => ({
      ...shipper,
      id: generateShipperIdentifier(
        shipper.companyName,
        shipper.industry || 'Retail'
      ),
    })),
    {
      id: 'DSW-204-070', // Detroit Steel Works - Steel Manufacturing
      companyName: 'Detroit Steel Works',
      industry: 'Steel Manufacturing',
      status: 'active',
      locations: [
        {
          id: 'loc-1',
          name: 'Detroit Plant',
          city: 'Detroit',
          state: 'MI',
          zip: '48201',
        },
        {
          id: 'loc-2',
          name: 'Warren Facility',
          city: 'Warren',
          state: 'MI',
          zip: '48089',
        },
      ],
      contacts: [
        {
          name: 'Mike Johnson',
          email: 'mike@detroitsteel.com',
          phone: '(313) 555-0123',
        },
      ],
    },
    {
      id: 'MAP-204-065',
      companyName: 'Midwest Auto Parts',
      industry: 'Automotive',
      status: 'active',
      locations: [
        {
          id: 'loc-3',
          name: 'Chicago Distribution',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
        },
      ],
      contacts: [
        {
          name: 'Sarah Davis',
          email: 'sarah@midwestauto.com',
          phone: '(312) 555-0456',
        },
      ],
    },
    {
      id: 'AMZ-204-050',
      companyName: 'Great Lakes Chemicals',
      industry: 'Chemical Manufacturing',
      status: 'pending',
      locations: [
        {
          id: 'loc-4',
          name: 'Toledo Plant',
          city: 'Toledo',
          state: 'OH',
          zip: '43604',
        },
      ],
      contacts: [
        {
          name: 'Robert Wilson',
          email: 'robert@greatlakeschem.com',
          phone: '(419) 555-0789',
        },
      ],
    },
    {
      id: 'TGT-204-050',
      companyName: 'Midwest Food Distributors',
      industry: 'Food & Beverage',
      status: 'active',
      locations: [
        {
          id: 'loc-5',
          name: 'Milwaukee Warehouse',
          city: 'Milwaukee',
          state: 'WI',
          zip: '53202',
        },
        {
          id: 'loc-6',
          name: 'Green Bay Facility',
          city: 'Green Bay',
          state: 'WI',
          zip: '54301',
        },
      ],
      contacts: [
        {
          name: 'Lisa Anderson',
          email: 'lisa@midwestfood.com',
          phone: '(414) 555-0321',
        },
      ],
    },
    {
      id: 'CHM-204-080',
      companyName: 'Industrial Equipment Co',
      industry: 'Heavy Machinery',
      status: 'inactive',
      locations: [
        {
          id: 'loc-7',
          name: 'Cleveland Factory',
          city: 'Cleveland',
          state: 'OH',
          zip: '44101',
        },
      ],
      contacts: [
        {
          name: 'David Brown',
          email: 'david@industrialeq.com',
          phone: '(216) 555-0654',
        },
      ],
    },
  ]);

  // Mock all load requests for management view
  const allLoadRequests = [
    ...loadRequests,
    // Additional mock load requests from other shippers
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `req-mgmt-${i + 1}`,
      shipperId:
        allShippers[Math.floor(Math.random() * allShippers.length)]?.id ||
        'DSW-204-070',
      requestType: ['load', 'rfp', 'quote_request'][
        Math.floor(Math.random() * 3)
      ] as any,
      status: ['pending', 'quoted', 'accepted', 'completed', 'cancelled'][
        Math.floor(Math.random() * 5)
      ] as any,
      submittedDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      pickupDate: new Date(
        Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0],
      deliveryDate: new Date(
        Date.now() + Math.random() * 21 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0],
      pickupLocation: allShippers[
        Math.floor(Math.random() * allShippers.length)
      ]?.locations?.[0] || { name: 'Factory', city: 'Detroit', state: 'MI' },
      deliveryLocation: {
        city: ['Chicago', 'Milwaukee', 'Cleveland', 'Toledo', 'Indianapolis'][
          Math.floor(Math.random() * 5)
        ],
        state: 'IL',
      },
      commodity: {
        name: [
          'Steel Coils',
          'Auto Parts',
          'Chemicals',
          'Food Products',
          'Machinery',
        ][Math.floor(Math.random() * 5)],
        freightClass: '85',
        hazmat: false,
        temperature: 'ambient' as any,
      },
      weight: Math.floor(Math.random() * 40000) + 5000,
      pieces: Math.floor(Math.random() * 50) + 1,
      submittedBy: 'System User',
    })),
  ];

  const filteredShippers = allShippers.filter((shipper) => {
    const matchesSearch =
      !searchTerm ||
      shipper.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipper.industry &&
        shipper.industry.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || shipper.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleShipperClick = (shipper: any) => {
    setSelectedShipper(shipper);
    setShowDetailModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedShipper(null);
    setShowDetailModal(false);
  };

  // Calculate management statistics
  const getManagementStats = () => {
    const totalShippers = allShippers.length;
    const activeShippers = allShippers.filter(
      (s) => s.status === 'active'
    ).length;
    const pendingShippers = allShippers.filter(
      (s) => s.status === 'pending'
    ).length;
    const totalLoadRequests = allLoadRequests.length;
    const activeLoads = allLoadRequests.filter(
      (l) => l.status === 'accepted' || l.status === 'quoted'
    ).length;
    const monthlyVolume = allLoadRequests.reduce(
      (sum, load) => sum + (load.weight || 0),
      0
    );
    const avgLoadValue = 2500; // Mock average
    const totalRevenue = totalLoadRequests * avgLoadValue;

    return {
      totalShippers,
      activeShippers,
      pendingShippers,
      totalLoadRequests,
      activeLoads,
      monthlyVolume,
      totalRevenue,
      avgLoadValue,
    };
  };

  const stats = getManagementStats();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
        radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Header */}
      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '16px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Logo />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                  }}
                >
                  🏢 Shipper Management Hub
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1.1rem',
                    margin: '0',
                  }}
                >
                  Complete oversight of all shippers and vendors
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setActiveView('directory')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>📁</span>
                View Directory
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>📊</span>
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '24px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'dashboard', label: '📊 Overview', icon: '📊' },
            { id: 'directory', label: '🏢 Shipper Directory', icon: '🏢' },
            { id: 'loads', label: '📋 All Load Requests', icon: '📋' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' },
            { id: 'contracts', label: '📄 Contracts', icon: '📄' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              style={{
                background:
                  activeView === tab.id
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'transparent',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                if (activeView !== tab.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (activeView !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minHeight: '600px',
          }}
        >
          {/* Dashboard Overview */}
          {activeView === 'dashboard' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                📊 Management Dashboard
              </h2>

              {/* Management KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      marginBottom: '8px',
                    }}
                  >
                    {stats.totalShippers}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Total Shippers
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                      marginTop: '4px',
                    }}
                  >
                    {stats.activeShippers} Active • {stats.pendingShippers}{' '}
                    Pending
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    {stats.totalLoadRequests}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Total Load Requests
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                      marginTop: '4px',
                    }}
                  >
                    {stats.activeLoads} Active Loads
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      marginBottom: '8px',
                    }}
                  >
                    ${(stats.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Monthly Revenue
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                      marginTop: '4px',
                    }}
                  >
                    Avg ${stats.avgLoadValue.toLocaleString()}/Load
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      marginBottom: '8px',
                    }}
                  >
                    {(stats.monthlyVolume / 1000000).toFixed(1)}M
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Monthly Volume (lbs)
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                      marginTop: '4px',
                    }}
                  >
                    Across All Shippers
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  ⚡ Quick Management Actions
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      label: '➕ Add New Shipper',
                      color: '#10b981',
                      action: () => setActiveView('directory'),
                    },
                    {
                      label: '📊 View All Analytics',
                      color: '#3b82f6',
                      action: () => setActiveView('analytics'),
                    },
                    {
                      label: '📋 Review Pending Requests',
                      color: '#f59e0b',
                      action: () => setActiveView('loads'),
                    },
                    {
                      label: '📄 Manage Contracts',
                      color: '#8b5cf6',
                      action: () => setActiveView('contracts'),
                    },
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      style={{
                        background: action.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shipper Directory */}
          {activeView === 'directory' && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  🏢 Shipper Directory
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type='text'
                    placeholder='Search shippers...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  >
                    <option value='all'>All Status</option>
                    <option value='active'>Active</option>
                    <option value='pending'>Pending</option>
                    <option value='inactive'>Inactive</option>
                    <option value='suspended'>Suspended</option>
                  </select>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {filteredShippers.map((shipper) => (
                  <div
                    key={shipper.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleShipperClick(shipper)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '20px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        {shipper.companyName.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '8px',
                          }}
                        >
                          <h3
                            style={{
                              fontWeight: '600',
                              color: 'white',
                              margin: 0,
                              fontSize: '18px',
                            }}
                          >
                            {shipper.companyName}
                          </h3>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            ID: {shipper.id.toUpperCase()}
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '12px',
                            fontSize: '14px',
                          }}
                        >
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Industry:
                            </span>{' '}
                            {shipper.industry || 'Manufacturing'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Locations:
                            </span>{' '}
                            {shipper.locations?.length || 3} Facilities
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Primary Contact:
                            </span>{' '}
                            {shipper.contacts?.[0]?.name || 'John Smith'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Phone:
                            </span>{' '}
                            {shipper.contacts?.[0]?.phone || '(555) 123-4567'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Email:
                            </span>{' '}
                            {shipper.contacts?.[0]?.email ||
                              'contact@company.com'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Joined:
                            </span>{' '}
                            {new Date(
                              Date.now() -
                                Math.random() * 365 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '32px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#4ade80',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {Math.floor(Math.random() * 15) + 1}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Active Loads
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#fbbf24',
                            margin: '0 0 4px 0',
                          }}
                        >
                          ${Math.floor(Math.random() * 500) + 100}K
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Monthly Volume
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#8b5cf6',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {Math.floor(Math.random() * 50) + 20}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Total Loads
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#06b6d4',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {(Math.random() * 5).toFixed(1)}★
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Rating
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background:
                            (shipper.status || 'active') === 'active'
                              ? 'rgba(74, 222, 128, 0.2)'
                              : (shipper.status || 'active') === 'pending'
                                ? 'rgba(251, 191, 36, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                          color:
                            (shipper.status || 'active') === 'active'
                              ? '#4ade80'
                              : (shipper.status || 'active') === 'pending'
                                ? '#fbbf24'
                                : '#ef4444',
                          border: `1px solid ${
                            (shipper.status || 'active') === 'active'
                              ? '#4ade80'
                              : (shipper.status || 'active') === 'pending'
                                ? '#fbbf24'
                                : '#ef4444'
                          }`,
                          minWidth: '80px',
                          textAlign: 'center',
                        }}
                      >
                        {(shipper.status || 'active')
                          .replace('_', ' ')
                          .toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredShippers.length === 0 && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    🔍
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    No Shippers Found
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* All Load Requests */}
          {activeView === 'loads' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                📋 All Load Requests ({allLoadRequests.length})
              </h2>

              <div style={{ display: 'grid', gap: '16px' }}>
                {allLoadRequests.slice(0, 10).map((request) => {
                  const shipper = allShippers.find(
                    (s) => s.id === request.shipperId
                  );
                  return (
                    <div
                      key={request.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 25px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '12px',
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '1.1rem',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            {shipper?.companyName || 'Unknown Shipper'} -{' '}
                            {request.commodity.name}
                          </h3>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.9rem',
                            }}
                          >
                            Request #{request.id} •{' '}
                            {new Date(
                              request.submittedDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div
                          style={{
                            background:
                              request.status === 'pending'
                                ? '#f59e0b'
                                : request.status === 'accepted'
                                  ? '#10b981'
                                  : request.status === 'completed'
                                    ? '#059669'
                                    : '#6b7280',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                          }}
                        >
                          {request.status.replace('_', ' ')}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '12px',
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div>
                          📍 {request.pickupLocation.city},{' '}
                          {request.pickupLocation.state}
                        </div>
                        <div>
                          🎯 {request.deliveryLocation.city},{' '}
                          {request.deliveryLocation.state}
                        </div>
                        <div>⚖️ {request.weight?.toLocaleString()} lbs</div>
                        <div>
                          📅 {new Date(request.pickupDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                📈 Shipper Analytics & Performance
              </h2>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Advanced Analytics Coming Soon
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Comprehensive shipper performance metrics, revenue analytics,
                  and predictive insights.
                </p>
              </div>
            </div>
          )}

          {/* Contracts View */}
          {activeView === 'contracts' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                📄 Contract Management
              </h2>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  Master Contract Management
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '24px',
                  }}
                >
                  View and manage all shipper contracts and agreements from a
                  centralized hub.
                </p>
                <Link
                  href='/broker/contracts'
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Access Contract System
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shipper Detail Modal */}
      {showDetailModal && selectedShipper && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0',
                }}
              >
                {selectedShipper.companyName}
              </h2>
              <button
                onClick={handleCloseDetails}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                  }}
                >
                  📋 Company Information
                </h3>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    display: 'grid',
                    gap: '6px',
                  }}
                >
                  <div>
                    <strong>Shipper ID:</strong>{' '}
                    {selectedShipper.id.toUpperCase()}
                  </div>
                  <div>
                    <strong>Industry:</strong>{' '}
                    {selectedShipper.industry || 'Manufacturing'}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        color:
                          (selectedShipper.status || 'active') === 'active'
                            ? '#4ade80'
                            : '#fbbf24',
                        textTransform: 'capitalize',
                      }}
                    >
                      {(selectedShipper.status || 'active').replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <strong>Total Locations:</strong>{' '}
                    {selectedShipper.locations?.length || 0}
                  </div>
                  <div>
                    <strong>Joined Date:</strong>{' '}
                    {new Date(
                      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                  }}
                >
                  👤 Primary Contact
                </h3>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    display: 'grid',
                    gap: '6px',
                  }}
                >
                  <div>
                    <strong>Name:</strong>{' '}
                    {selectedShipper.contacts?.[0]?.name || 'John Smith'}
                  </div>
                  <div>
                    <strong>Title:</strong>{' '}
                    {selectedShipper.contacts?.[0]?.title ||
                      'Logistics Manager'}
                  </div>
                  <div>
                    <strong>Email:</strong>{' '}
                    {selectedShipper.contacts?.[0]?.email ||
                      'contact@company.com'}
                  </div>
                  <div>
                    <strong>Phone:</strong>{' '}
                    {selectedShipper.contacts?.[0]?.phone || '(555) 123-4567'}
                  </div>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                  }}
                >
                  📊 Performance Metrics
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(74, 222, 128, 0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#4ade80',
                      }}
                    >
                      {Math.floor(Math.random() * 15) + 1}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Active Loads
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                      }}
                    >
                      ${Math.floor(Math.random() * 500) + 100}K
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Monthly Volume
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#8b5cf6',
                      }}
                    >
                      {Math.floor(Math.random() * 50) + 20}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Total Loads
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#06b6d4',
                      }}
                    >
                      {(Math.random() * 5).toFixed(1)}★
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Rating
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                  }}
                >
                  💼 Financial Information
                </h3>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    display: 'grid',
                    gap: '6px',
                  }}
                >
                  <div>
                    <strong>Payment Terms:</strong> Net{' '}
                    {Math.floor(Math.random() * 3) * 15 + 15} Days
                  </div>
                  <div>
                    <strong>Credit Rating:</strong>{' '}
                    {
                      ['A+', 'A', 'A-', 'B+', 'B'][
                        Math.floor(Math.random() * 5)
                      ]
                    }
                  </div>
                  <div>
                    <strong>Total Revenue:</strong> $
                    {(Math.floor(Math.random() * 5000) + 1000).toLocaleString()}
                  </div>
                  <div>
                    <strong>Average Load Value:</strong> $
                    {(Math.floor(Math.random() * 3000) + 1500).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    marginBottom: '8px',
                  }}
                >
                  📍 Locations
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedShipper.locations?.map(
                    (location: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            marginBottom: '4px',
                          }}
                        >
                          {location.name}
                        </div>
                        <div>
                          {location.city}, {location.state} {location.zip}
                        </div>
                        {location.contactPhone && (
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.6)',
                              marginTop: '4px',
                            }}
                          >
                            📞 {location.contactPhone}
                          </div>
                        )}
                      </div>
                    )
                  ) || (
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ fontWeight: '600', color: 'white' }}>
                          Main Facility
                        </div>
                        <div>Detroit, MI 48201</div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ fontWeight: '600', color: 'white' }}>
                          Distribution Center
                        </div>
                        <div>Chicago, IL 60601</div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ fontWeight: '600', color: 'white' }}>
                          Warehouse
                        </div>
                        <div>Milwaukee, WI 53202</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
