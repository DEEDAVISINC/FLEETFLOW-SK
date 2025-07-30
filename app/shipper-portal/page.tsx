'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AddShipperForm from '../components/AddShipperForm';
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

  // Function to scroll to top with fallback mechanisms
  const scrollToTop = () => {
    console.log('Scrolling to top');

    // Try multiple scroll methods to ensure it works across browsers
    document.documentElement.scrollTop = 0; // For most browsers
    document.body.scrollTop = 0; // For Safari
    window.scrollTo(0, 0); // General method
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); // Modern browsers

    // If all else fails, reload the page - guaranteed to reset scroll position
    if (
      document.documentElement.scrollTop !== 0 &&
      document.body.scrollTop !== 0
    ) {
      console.log('Forcing page reload to reset scroll position');
      window.location.reload();
    }
  };

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
    | 'dashboard'
    | 'directory'
    | 'loads'
    | 'analytics'
    | 'contracts'
    | 'portfolio'
    | 'database'
    | 'settings'
    | 'vendor-portal'
  >('dashboard');
  const [selectedShipper, setSelectedShipper] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'pending' | 'suspended'
  >('all');
  const [showAddShipperForm, setShowAddShipperForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    if (mounted) {
      scrollToTop();
      console.log('View changed to:', activeView);
    }
  }, [activeView, mounted]);

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
                onClick={() => {
                  console.log('Directory button clicked');
                  scrollToTop();
                  setActiveView('directory');
                }}
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
                onClick={() => {
                  console.log('Analytics button clicked');
                  scrollToTop();
                  setActiveView('analytics');
                }}
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
            { id: 'portfolio', label: '📈 Portfolio', icon: '📈' },
            { id: 'database', label: '💾 Database', icon: '💾' },
            { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
            { id: 'vendor-portal', label: '🏢 Vendor Portal', icon: '🏢' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Tab clicked:', tab.id);
                scrollToTop();
                setActiveView(tab.id as any);
              }}
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
                      action: () => {
                        console.log('Quick action: View Directory');
                        scrollToTop();
                        setActiveView('directory');
                      },
                    },
                    {
                      label: '📊 View All Analytics',
                      color: '#3b82f6',
                      action: () => {
                        console.log('Quick action: View Analytics');
                        scrollToTop();
                        setActiveView('analytics');
                      },
                    },
                    {
                      label: '📋 Review Pending Requests',
                      color: '#f59e0b',
                      action: () => {
                        console.log('Quick action: Review Pending Requests');
                        scrollToTop();
                        setActiveView('loads');
                      },
                    },
                    {
                      label: '📄 Manage Contracts',
                      color: '#8b5cf6',
                      action: () => {
                        console.log('Quick action: Manage Contracts');
                        scrollToTop();
                        setActiveView('contracts');
                      },
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

          {/* Portfolio View */}
          {activeView === 'portfolio' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                📈 Shipper Portfolio Overview
              </h2>

              {/* Portfolio Metrics */}
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
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    🏢
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {mounted ? allShippers.length : '--'}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Total Shippers
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    ✅
                  </div>
                  <div
                    style={{
                      color: '#059669',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {mounted
                      ? allShippers.filter((s) => s.status === 'active').length
                      : '--'}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Active Shippers
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    📦
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {mounted ? loadRequests.length : '--'}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Total Load Requests
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    📸
                  </div>
                  <div
                    style={{
                      color: '#fbbf24',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {mounted
                      ? allShippers.filter(
                          (s) =>
                            (s as any).photoRequirements
                              ?.pickupPhotosRequired ||
                            (s as any).photoRequirements?.deliveryPhotosRequired
                        ).length
                      : '--'}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Photo Requirements Set
                  </div>
                </div>
              </div>

              {/* Top Performing Shippers */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '20px',
                  }}
                >
                  🏆 Top Performing Shippers
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {mounted ? (
                    allShippers.slice(0, 5).map((shipper, index) => (
                      <div
                        key={shipper.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <div
                            style={{
                              background:
                                index === 0
                                  ? '#fbbf24'
                                  : index === 1
                                    ? '#94a3b8'
                                    : '#a78bfa',
                              color: 'white',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                            }}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <div style={{ color: 'white', fontWeight: '600' }}>
                              {shipper.companyName}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '13px',
                              }}
                            >
                              {shipper.industry || 'Manufacturing'}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#059669', fontWeight: 'bold' }}>
                            ${((index + 1) * 45000).toLocaleString()}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '13px',
                            }}
                          >
                            Revenue
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textAlign: 'center',
                        padding: '20px',
                      }}
                    >
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Database View */}
          {activeView === 'database' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                💾 Shipper Database
              </h2>

              {/* Search and Filter Controls */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type='text'
                  placeholder='Search shippers...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '14px',
                    flex: '1',
                    minWidth: '200px',
                  }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option
                    value='all'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    All Status
                  </option>
                  <option
                    value='active'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Active
                  </option>
                  <option
                    value='inactive'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Inactive
                  </option>
                  <option
                    value='pending'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Pending
                  </option>
                  <option
                    value='suspended'
                    style={{ background: '#1f2937', color: 'white' }}
                  >
                    Suspended
                  </option>
                </select>
              </div>

              {/* Database Table */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <th
                          style={{
                            color: 'white',
                            textAlign: 'left',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Company
                        </th>
                        <th
                          style={{
                            color: 'white',
                            textAlign: 'left',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Industry
                        </th>
                        <th
                          style={{
                            color: 'white',
                            textAlign: 'left',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            color: 'white',
                            textAlign: 'left',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Locations
                        </th>
                        <th
                          style={{
                            color: 'white',
                            textAlign: 'left',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Photo Req.
                        </th>
                        <th
                          style={{
                            color: 'white',
                            textAlign: 'center',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mounted ? (
                        allShippers
                          .filter(
                            (shipper) =>
                              shipper.companyName
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) &&
                              (statusFilter === 'all' ||
                                shipper.status === statusFilter)
                          )
                          .map((shipper) => (
                            <tr
                              key={shipper.id}
                              style={{
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background =
                                  'rgba(255, 255, 255, 0.1)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background =
                                  'transparent';
                              }}
                            >
                              <td style={{ padding: '16px 12px' }}>
                                <div
                                  style={{ color: 'white', fontWeight: '600' }}
                                >
                                  {shipper.companyName}
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '12px',
                                  }}
                                >
                                  ID: {shipper.id}
                                </div>
                              </td>
                              <td
                                style={{
                                  padding: '16px 12px',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '14px',
                                }}
                              >
                                {shipper.industry || 'Manufacturing'}
                              </td>
                              <td style={{ padding: '16px 12px' }}>
                                <span
                                  style={{
                                    background:
                                      shipper.status === 'active'
                                        ? '#059669'
                                        : shipper.status === 'pending'
                                          ? '#f59e0b'
                                          : '#dc2626',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {shipper.status}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: '16px 12px',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '14px',
                                }}
                              >
                                {shipper.locations?.length || 0}
                              </td>
                              <td
                                style={{
                                  padding: '16px 12px',
                                  textAlign: 'center',
                                }}
                              >
                                {(shipper as any).photoRequirements
                                  ?.pickupPhotosRequired ||
                                (shipper as any).photoRequirements
                                  ?.deliveryPhotosRequired ? (
                                  <span
                                    style={{
                                      color: '#fbbf24',
                                      fontSize: '16px',
                                    }}
                                  >
                                    📸
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.4)',
                                      fontSize: '16px',
                                    }}
                                  >
                                    —
                                  </span>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: '16px 12px',
                                  textAlign: 'center',
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedShipper(shipper);
                                    setShowDetailModal(true);
                                  }}
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #059669, #047857)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            style={{
                              textAlign: 'center',
                              padding: '40px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            Loading shipper data...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Results Summary */}
                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  {mounted
                    ? `Showing ${
                        allShippers.filter(
                          (shipper) =>
                            shipper.companyName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) &&
                            (statusFilter === 'all' ||
                              shipper.status === statusFilter)
                        ).length
                      } of ${allShippers.length} shippers`
                    : 'Loading shipper data...'}
                </div>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                ⚙️ Shipper Management Settings
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}
              >
                {/* Add New Shipper */}
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                    🏢
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Add New Shipper
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '20px',
                      lineHeight: '1.5',
                    }}
                  >
                    Add new shippers with customizable photo requirements that
                    flow through to driver workflows.
                  </p>
                  <button
                    onClick={() => setShowAddShipperForm(true)}
                    style={{
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 20px rgba(5, 150, 105, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    🏢 Add New Shipper
                  </button>
                </div>

                {/* Photo Requirements Management */}
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                    📸
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Photo Requirements
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '20px',
                      lineHeight: '1.5',
                    }}
                  >
                    Configure default photo requirements for pickup and delivery
                    workflows per shipper.
                  </p>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 20px rgba(8, 145, 178, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    📸 Manage Photo Policies
                  </button>
                </div>

                {/* System Configuration */}
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                    ⚙️
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    System Settings
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '20px',
                      lineHeight: '1.5',
                    }}
                  >
                    Configure notifications, data export settings, and system
                    preferences.
                  </p>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 20px rgba(124, 58, 237, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    ⚙️ System Config
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Portal View */}
          {activeView === 'vendor-portal' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '24px',
                }}
              >
                🏢 Vendor/Shipper Portal Access
              </h2>

              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    📋 About Vendor Portal Access
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                    }}
                  >
                    The Vendor Portal provides shippers/vendors with simplified
                    load tracking access. When you add a new shipper, portal
                    credentials are automatically created and sent via email.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginTop: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                        📋
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        BOL Created
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Pickup completed notification
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                        🛣️
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        Transit Update
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Real-time location & ETA
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                        ✅
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        Delivered
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.9rem',
                        }}
                      >
                        Completion confirmation
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Portal Management */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}
              >
                {/* Portal Credentials Management */}
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                    🔐
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Portal Credentials
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '20px',
                      lineHeight: '1.5',
                    }}
                  >
                    Manage vendor portal access credentials. Automatically
                    created when adding new shippers.
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        Portal URL
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        https://app.fleetflow.com/vendor-login
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        Active Portal Users
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.9rem',
                        }}
                      >
                        {
                          allShippers.filter((s) => s.status === 'active')
                            .length
                        }{' '}
                        shippers with portal access
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portal Analytics */}
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                    📊
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Portal Usage Analytics
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '20px',
                      lineHeight: '1.5',
                    }}
                  >
                    Track vendor engagement and portal activity metrics.
                  </p>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Daily Active Users
                      </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        {Math.floor(Math.random() * 20) + 15}
                      </span>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Avg. Session Time
                      </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        {Math.floor(Math.random() * 10) + 5} min
                      </span>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Load Inquiries
                      </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        {Math.floor(Math.random() * 50) + 25}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Portal Actions */}
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
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                    ⚡
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Portal Management
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '20px',
                      lineHeight: '1.5',
                    }}
                  >
                    Quick actions for vendor portal management and support.
                  </p>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        textAlign: 'left',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 6px 20px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      🔄 Refresh Portal Credentials
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #047857)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        textAlign: 'left',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      📧 Send Welcome Emails
                    </button>
                    <button
                      onClick={() => window.open('/vendor-login', '_blank')}
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        textAlign: 'left',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 6px 20px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      🌐 Test Vendor Portal
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Vendor Portal Users */}
              <div style={{ marginTop: '32px' }}>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '20px',
                  }}
                >
                  👥 Active Portal Users
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {allShippers
                    .filter((s) => s.status === 'active')
                    .slice(0, 6)
                    .map((shipper, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '1.1rem',
                              fontWeight: '600',
                              margin: 0,
                            }}
                          >
                            {shipper.companyName}
                          </h4>
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#10b981',
                            }}
                          />
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '8px',
                          }}
                        >
                          Username:{' '}
                          {shipper.companyName
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, '')
                            .substring(0, 15)}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '12px',
                          }}
                        >
                          Last Login: {Math.floor(Math.random() * 7) + 1} days
                          ago
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              flex: 1,
                            }}
                          >
                            Reset Password
                          </button>
                          <button
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              flex: 1,
                            }}
                          >
                            Disable
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Shipper Form Modal */}
      {showAddShipperForm && (
        <AddShipperForm onClose={() => setShowAddShipperForm(false)} />
      )}

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
