'use client';

import React, { useState } from 'react';

interface PortalUser {
  id: string;
  email: string;
  role: 'owner_operator' | 'company_driver' | 'fleet_manager' | 'dispatcher';
  firstName: string;
  lastName: string;
  phone: string;
  permissions: string[];
  accountCreated: boolean;
  initialPasswordSent: boolean;
  lastLogin?: string;
  status: 'pending' | 'active' | 'suspended';
  businessType?:
    | 'owner_operator'
    | 'small_fleet'
    | 'company_fleet'
    | 'mixed_operation';
  portalSections?: string[];
}

interface PortalSetupData {
  portalEnabled: boolean;
  users: PortalUser[];
  portalFeatures: string[];
  trainingCompleted: boolean;
  portalUrl?: string;
  businessType:
    | 'owner_operator'
    | 'small_fleet'
    | 'company_fleet'
    | 'mixed_operation';
  unifiedPortalConfig: {
    enableLoadBoard: boolean;
    enableBusinessMetrics: boolean;
    restrictCompanyDrivers: boolean;
    allowBidManagement: boolean;
  };
}

interface PortalSetupProps {
  onPortalSetup: (data: PortalSetupData) => void;
  onComplete: (data: PortalSetupData) => void;
  onBack: () => void;
}

export const PortalSetup: React.FC<PortalSetupProps> = ({
  onPortalSetup,
  onComplete,
  onBack,
}) => {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [businessType, setBusinessType] = useState<
    'owner_operator' | 'small_fleet' | 'company_fleet' | 'mixed_operation'
  >('owner_operator');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'document_upload',
    'load_tracking',
    'invoice_status',
  ]);
  const [currentUserForm, setCurrentUserForm] = useState<Partial<PortalUser>>({
    role: 'owner_operator',
    permissions: ['full_access'],
    businessType: 'owner_operator',
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [setupInProgress, setSetupInProgress] = useState(false);
  const [unifiedPortalConfig, setUnifiedPortalConfig] = useState({
    enableLoadBoard: true,
    enableBusinessMetrics: true,
    restrictCompanyDrivers: true,
    allowBidManagement: true,
  });

  const availableFeatures = [
    {
      id: 'document_upload',
      name: 'Document Upload',
      description: 'Upload and manage required documents',
    },
    {
      id: 'load_tracking',
      name: 'Load Tracking',
      description: 'Real-time tracking of assigned loads',
    },
    {
      id: 'invoice_status',
      name: 'Invoice Status',
      description: 'View payment and invoice status',
    },
    {
      id: 'settlement_history',
      name: 'Settlement History',
      description: 'Access historical settlement reports',
    },
    {
      id: 'driver_management',
      name: 'Driver Management',
      description: 'Manage driver profiles and documents',
    },
    {
      id: 'equipment_tracking',
      name: 'Equipment Tracking',
      description: 'Track and manage equipment',
    },
    {
      id: 'communication',
      name: 'Communication Hub',
      description: 'Direct messaging with dispatch',
    },
    {
      id: 'compliance_alerts',
      name: 'Compliance Alerts',
      description: 'Notifications for expiring documents',
    },
    {
      id: 'load_board_access',
      name: 'Load Board Access',
      description: 'Access to available loads for bidding',
    },
    {
      id: 'business_analytics',
      name: 'Business Analytics',
      description: 'Revenue and performance metrics',
    },
    {
      id: 'bid_management',
      name: 'Bid Management',
      description: 'Submit and track load bids',
    },
  ];

  const enhancedRolePermissions = {
    owner_operator: [
      // Driver functions
      'my_loads_workflow',
      'document_upload',
      'eld_integration',
      'load_status',
      // Carrier functions
      'load_board_access',
      'bid_management',
      'business_metrics',
      'invoice_management',
      'settlement_reports',
      'full_access',
    ],
    company_driver: [
      'assigned_loads_only',
      'workflow_completion',
      'document_upload',
      'dispatch_communication',
      'hours_tracking',
      'load_status',
      'basic_tracking',
    ],
    fleet_manager: [
      'all_driver_oversight',
      'load_assignment',
      'carrier_load_board',
      'financial_reporting',
      'user_management',
      'business_analytics',
      'full_access',
      'driver_management',
      'equipment_tracking',
    ],
    dispatcher: [
      'load_assignment',
      'driver_communication',
      'route_optimization',
      'dispatch_coordination',
      'load_tracking',
      'document_review',
    ],
  };

  const businessTypeConfigs = {
    owner_operator: {
      defaultUsers: [
        {
          role: 'owner_operator',
          permissions: enhancedRolePermissions.owner_operator,
        },
      ],
      portalSections: [
        'dashboard',
        'my_loads',
        'load_board',
        'business',
        'documents',
      ],
      recommendedFeatures: [
        'document_upload',
        'load_tracking',
        'load_board_access',
        'bid_management',
        'business_analytics',
      ],
      description: 'Individual owner-operator with their own truck',
    },
    small_fleet: {
      defaultUsers: [
        {
          role: 'fleet_manager',
          permissions: enhancedRolePermissions.fleet_manager,
        },
        {
          role: 'owner_operator',
          permissions: enhancedRolePermissions.owner_operator,
        },
      ],
      portalSections: [
        'dashboard',
        'my_loads',
        'load_board',
        'fleet_management',
        'business',
      ],
      recommendedFeatures: [
        'document_upload',
        'load_tracking',
        'load_board_access',
        'driver_management',
        'business_analytics',
      ],
      description:
        '2-10 trucks with mix of owner-operators and company drivers',
    },
    company_fleet: {
      defaultUsers: [
        {
          role: 'fleet_manager',
          permissions: enhancedRolePermissions.fleet_manager,
        },
        {
          role: 'company_driver',
          permissions: enhancedRolePermissions.company_driver,
        },
      ],
      portalSections: [
        'dashboard',
        'assigned_loads',
        'documents',
        'fleet_management',
      ],
      recommendedFeatures: [
        'document_upload',
        'load_tracking',
        'driver_management',
        'compliance_alerts',
      ],
      description: 'Company-owned fleet with employed drivers only',
    },
    mixed_operation: {
      defaultUsers: [
        {
          role: 'fleet_manager',
          permissions: enhancedRolePermissions.fleet_manager,
        },
        {
          role: 'owner_operator',
          permissions: enhancedRolePermissions.owner_operator,
        },
        {
          role: 'company_driver',
          permissions: enhancedRolePermissions.company_driver,
        },
      ],
      portalSections: [
        'dashboard',
        'my_loads',
        'load_board',
        'fleet_management',
        'business',
      ],
      recommendedFeatures: [
        'document_upload',
        'load_tracking',
        'load_board_access',
        'driver_management',
        'business_analytics',
        'bid_management',
      ],
      description:
        'Mixed operation with both company drivers and owner-operators',
    },
  };

  // Update recommended features when business type changes
  const handleBusinessTypeChange = (newBusinessType: typeof businessType) => {
    setBusinessType(newBusinessType);
    const config = businessTypeConfigs[newBusinessType];
    setSelectedFeatures(config.recommendedFeatures);

    // Update unified portal config based on business type
    setUnifiedPortalConfig({
      enableLoadBoard: [
        'owner_operator',
        'small_fleet',
        'mixed_operation',
      ].includes(newBusinessType),
      enableBusinessMetrics: [
        'owner_operator',
        'small_fleet',
        'mixed_operation',
      ].includes(newBusinessType),
      restrictCompanyDrivers: ['company_fleet', 'mixed_operation'].includes(
        newBusinessType
      ),
      allowBidManagement: [
        'owner_operator',
        'small_fleet',
        'mixed_operation',
      ].includes(newBusinessType),
    });
  };

  const addUser = () => {
    if (
      !currentUserForm.firstName ||
      !currentUserForm.lastName ||
      !currentUserForm.email
    ) {
      return;
    }

    const config = businessTypeConfigs[businessType];
    const newUser: PortalUser = {
      id: `user_${Date.now()}`,
      email: currentUserForm.email!,
      role: currentUserForm.role as PortalUser['role'],
      firstName: currentUserForm.firstName!,
      lastName: currentUserForm.lastName!,
      phone: currentUserForm.phone || '',
      permissions:
        enhancedRolePermissions[
          currentUserForm.role as keyof typeof enhancedRolePermissions
        ] || [],
      accountCreated: false,
      initialPasswordSent: false,
      status: 'pending',
      businessType: businessType,
      portalSections: config.portalSections,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserForm({
      role: 'company_driver',
      permissions: ['basic_access'],
      businessType: businessType,
    });
    setShowUserForm(false);
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const createAccounts = async () => {
    setSetupInProgress(true);

    try {
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const updatedUsers = users.map((user) => {
        // Create free driver subscription for drivers
        const subscriptionTier =
          user.role === 'company_driver' || user.role === 'owner_operator'
            ? 'driver_free'
            : 'university'; // Default for other roles

        return {
          ...user,
          accountCreated: true,
          initialPasswordSent: true,
          status: 'active' as const,
          subscriptionTier,
          subscriptionStatus: 'active',
          subscriptionExpiresAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ), // 1 year
          permissions: [
            ...user.permissions,
            ...(subscriptionTier === 'driver_free'
              ? [
                  'driver_otr_flow',
                  'dispatch_connection',
                  'basic_notifications',
                ]
              : []),
          ],
        };
      });

      setUsers(updatedUsers);

      // Log subscription creation for drivers
      updatedUsers.forEach((user) => {
        if (user.subscriptionTier === 'driver_free') {
          console.info(
            `✅ Created FREE Driver subscription for ${user.firstName} ${user.lastName} (${user.email})`
          );
        }
      });
    } catch (error) {
      console.error('Account creation failed:', error);
    } finally {
      setSetupInProgress(false);
    }
  };

  const handleComplete = () => {
    const portalData: PortalSetupData = {
      portalEnabled,
      users,
      portalFeatures: selectedFeatures,
      trainingCompleted,
      portalUrl: portalEnabled
        ? `https://portal.fleetflowapp.com/carrier/${Date.now()}`
        : undefined,
      businessType,
      unifiedPortalConfig,
    };

    onPortalSetup(portalData);
    onComplete(portalData);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner_operator':
        return '👑';
      case 'company_driver':
        return '🚛';
      case 'fleet_manager':
        return '👨‍💼';
      case 'dispatcher':
        return '📞';
      default:
        return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'suspended':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const allUsersActive =
    users.length > 0 && users.every((user) => user.accountCreated);
  const canComplete = portalEnabled
    ? allUsersActive && trainingCompleted
    : true;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          👤 Portal Access Setup
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Configure driver and carrier portal access and permissions
        </p>
      </div>

      {/* Portal Toggle */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            Enable Portal Access
          </h3>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <input
              type='checkbox'
              checked={portalEnabled}
              onChange={(e) => setPortalEnabled(e.target.checked)}
              style={{ transform: 'scale(1.5)' }}
            />
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              {portalEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          Portal access allows drivers and carrier staff to upload documents,
          track loads, view settlements, and communicate directly with dispatch.
        </p>
      </div>

      {portalEnabled && (
        <>
          {/* Feature Selection */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              🔧 Portal Features
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '12px',
              }}
            >
              {availableFeatures.map((feature) => (
                <label
                  key={feature.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedFeatures.includes(feature.id)
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      selectedFeatures.includes(feature.id)
                        ? 'rgba(59, 130, 246, 0.5)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeatures((prev) => [...prev, feature.id]);
                      } else {
                        setSelectedFeatures((prev) =>
                          prev.filter((f) => f !== feature.id)
                        );
                      }
                    }}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      {feature.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {feature.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Business Type Selection */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              🏢 Business Type
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {Object.entries(businessTypeConfigs).map(([type, config]) => (
                <label
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background:
                      businessType === type
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      businessType === type
                        ? 'rgba(59, 130, 246, 0.5)'
                        : 'rgba(255, 255, 255, 0.1)'
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type='radio'
                    name='businessType'
                    checked={businessType === type}
                    onChange={() =>
                      handleBusinessTypeChange(type as typeof businessType)
                    }
                    style={{ transform: 'scale(1.3)' }}
                  />
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      {type
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {config.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Unified Portal Configuration */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              ⚙️ Unified Portal Settings
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '12px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: unifiedPortalConfig.enableLoadBoard
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    unifiedPortalConfig.enableLoadBoard
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type='checkbox'
                  checked={unifiedPortalConfig.enableLoadBoard}
                  onChange={(e) =>
                    setUnifiedPortalConfig((prev) => ({
                      ...prev,
                      enableLoadBoard: e.target.checked,
                    }))
                  }
                  style={{ transform: 'scale(1.3)' }}
                />
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Enable Load Board
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Allow users to view and bid on available loads.
                  </div>
                </div>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: unifiedPortalConfig.enableBusinessMetrics
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    unifiedPortalConfig.enableBusinessMetrics
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type='checkbox'
                  checked={unifiedPortalConfig.enableBusinessMetrics}
                  onChange={(e) =>
                    setUnifiedPortalConfig((prev) => ({
                      ...prev,
                      enableBusinessMetrics: e.target.checked,
                    }))
                  }
                  style={{ transform: 'scale(1.3)' }}
                />
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Enable Business Metrics
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Access revenue and performance reports.
                  </div>
                </div>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: unifiedPortalConfig.restrictCompanyDrivers
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    unifiedPortalConfig.restrictCompanyDrivers
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type='checkbox'
                  checked={unifiedPortalConfig.restrictCompanyDrivers}
                  onChange={(e) =>
                    setUnifiedPortalConfig((prev) => ({
                      ...prev,
                      restrictCompanyDrivers: e.target.checked,
                    }))
                  }
                  style={{ transform: 'scale(1.3)' }}
                />
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Restrict Company Drivers
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Only allow company drivers to access the portal.
                  </div>
                </div>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: unifiedPortalConfig.allowBidManagement
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${
                    unifiedPortalConfig.allowBidManagement
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type='checkbox'
                  checked={unifiedPortalConfig.allowBidManagement}
                  onChange={(e) =>
                    setUnifiedPortalConfig((prev) => ({
                      ...prev,
                      allowBidManagement: e.target.checked,
                    }))
                  }
                  style={{ transform: 'scale(1.3)' }}
                />
                <div>
                  <div
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Allow Bid Management
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Enable users to submit and manage load bids.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* User Management */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                👥 Portal Users
              </h3>
              <button
                onClick={() => setShowUserForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                + Add User
              </button>
            </div>

            {/* User List */}
            {users.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
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
                          gap: '16px',
                        }}
                      >
                        <div style={{ fontSize: '1.5rem' }}>
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 'bold' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.9rem',
                            }}
                          >
                            {user.email} •{' '}
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <span
                          style={{
                            background: getStatusColor(user.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {user.accountCreated ? '✅ Active' : '⏳ Pending'}
                        </span>
                        <button
                          onClick={() => removeUser(user.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {users.some((user) => !user.accountCreated) && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={createAccounts}
                      disabled={setupInProgress}
                      style={{
                        background: setupInProgress
                          ? '#6b7280'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: setupInProgress ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {setupInProgress
                        ? '⏳ Creating Accounts...'
                        : '🚀 Create Portal Accounts'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Add User Form */}
            {showUserForm && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  Add New Portal User
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <input
                    type='text'
                    placeholder='First Name'
                    value={currentUserForm.firstName || ''}
                    onChange={(e) =>
                      setCurrentUserForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  />
                  <input
                    type='text'
                    placeholder='Last Name'
                    value={currentUserForm.lastName || ''}
                    onChange={(e) =>
                      setCurrentUserForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  />
                  <input
                    type='email'
                    placeholder='Email Address'
                    value={currentUserForm.email || ''}
                    onChange={(e) =>
                      setCurrentUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  />
                  <select
                    value={currentUserForm.role}
                    onChange={(e) =>
                      setCurrentUserForm((prev) => ({
                        ...prev,
                        role: e.target.value as any,
                      }))
                    }
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    }}
                  >
                    <option value='owner_operator'>👑 Owner Operator</option>
                    <option value='company_driver'>🚛 Company Driver</option>
                    <option value='fleet_manager'>👨‍💼 Fleet Manager</option>
                    <option value='dispatcher'>📞 Dispatcher</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={addUser}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowUserForm(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Training Completion */}
          {allUsersActive && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                📚 Portal Training
              </h3>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '12px',
                  }}
                >
                  📋{' '}
                  <strong>
                    Portal training materials have been sent to all users:
                  </strong>
                </p>
                <ul
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    paddingLeft: '20px',
                  }}
                >
                  <li>Portal navigation and basic features</li>
                  <li>Document upload procedures</li>
                  <li>Load tracking and communication</li>
                  <li>Security best practices</li>
                </ul>
              </div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                <input
                  type='checkbox'
                  checked={trainingCompleted}
                  onChange={(e) => setTrainingCompleted(e.target.checked)}
                  style={{ transform: 'scale(1.3)' }}
                />
                Training materials reviewed and users have been onboarded
              </label>
            </div>
          )}
        </>
      )}

      {/* Summary */}
      {portalEnabled && allUsersActive && trainingCompleted && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
          <h3
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            Portal Setup Complete!
          </h3>
          <p
            style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}
          >
            All users have been created and training is complete. Portal is
            ready for use.
          </p>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              display: 'inline-block',
            }}
          >
            <strong>Portal URL:</strong> https://portal.fleetflowapp.com/carrier/
            {Date.now()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ← Back to Agreements
        </button>

        <div style={{ textAlign: 'center' }}>
          {!canComplete && portalEnabled && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
              }}
            >
              {!allUsersActive && 'Create portal accounts and '}
              {!trainingCompleted && 'complete training'}
            </div>
          )}
        </div>

        <button
          onClick={handleComplete}
          disabled={!canComplete}
          style={{
            background: canComplete
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : '#6b7280',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: canComplete ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: canComplete
              ? '0 4px 16px rgba(16, 185, 129, 0.3)'
              : 'none',
          }}
        >
          🎉 Complete Onboarding
        </button>
      </div>
    </div>
  );
};
