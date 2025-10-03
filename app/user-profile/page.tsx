'use client';

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ExecutiveComplianceCenter from '../components/ExecutiveComplianceCenter';
import OpenELDOnboardingSetup from '../components/OpenELDOnboardingSetup';
import PhoneConnectionSetup from '../components/PhoneConnectionSetup';
import UserSubscriptionManager from '../components/UserSubscriptionManager';
import FleetFlowExtensionService from '../services/FleetFlowExtensionService';
import {
  ICAOnboardingRecord,
  ICAOnboardingService,
  ICAOnboardingStep,
} from '../services/ICAOnboardingService';
import UserProfileWorkflowService, {
  UserProfileWorkflowData,
} from '../services/UserProfileWorkflowService';
import UserDataService, {
  UserProfile as UserProfileType,
} from '../services/user-data-service';
import UserIdentifierService from '../services/user-identifier-service';

// Default empty user profile structure
const getDefaultUserProfile = () => ({
  id: '',
  name: 'Not configured',
  email: 'Not configured',
  phone: 'Not configured',
  department: 'Not assigned',
  departmentCode: 'N/A',
  position: 'Not assigned',
  hiredDate: '',
  role: 'Not assigned',
  status: 'inactive',
  lastActive: '',
  cdlNumber: '',
  carrierMC: '',
  usDot: '',
  companyName: 'Not configured',
  systemAccess: {
    level: 'No access',
    accessCode: '',
    securityLevel: 'No clearance',
    allowedSystems: [],
  },
  emergencyContact: {
    name: 'Not provided',
    relation: 'Not specified',
    phone: 'Not provided',
    altPhone: 'Not provided',
  },
  notes: 'Profile not configured',
  permissions: {},
  // Training progress data - empty state
  trainingProgress: {
    required: [],
    completed: [],
    inProgress: [],
    overallProgress: 0,
    totalModules: 0,
    completedModules: 0,
    inProgressModules: 0,
    pendingModules: 0,
  },
});

// Permission categories with colors - exactly from user-management
const permissionCategories = {
  operations: {
    name: 'OPERATIONS',
    icon: '🚛',
    color: '#3b82f6',
  },
  'driver-management': {
    name: 'DRIVER MANAGEMENT',
    icon: '👥',
    color: '#f4a832',
  },
  fleetflow: {
    name: 'FLEETFLOW',
    icon: '🎯',
    color: '#14b8a6',
  },
  analytics: {
    name: 'ANALYTICS',
    icon: '📊',
    color: '#6366f1',
  },
  compliance: {
    name: 'COMPLIANCE',
    icon: '✅',
    color: '#dc2626',
  },
  resources: {
    name: 'RESOURCES',
    icon: '📚',
    color: '#f97316',
  },
  'quickbooks-integration': {
    name: 'QUICKBOOKS INTEGRATION',
    icon: '🧾',
    color: '#10b981',
  },
  'ai-flow-platform': {
    name: 'AI FLOW PLATFORM',
    icon: '🤖',
    color: '#ec4899',
  },
  'call-center-communications': {
    name: 'CALL CENTER & COMMUNICATIONS',
    icon: '📞',
    color: '#8b5cf6',
  },
  'crm-customer-management': {
    name: 'CRM & CUSTOMER MANAGEMENT',
    icon: '👥',
    color: '#f59e0b',
  },
  'warehousing-3pl-operations': {
    name: 'WAREHOUSING & 3PL OPERATIONS',
    icon: '🏢',
    color: '#06b6d4',
  },
  'government-contracts-rfp': {
    name: 'GOVERNMENT CONTRACTS & RFP',
    icon: '🏛️',
    color: '#dc2626',
  },
  'financial-services-integration': {
    name: 'FINANCIAL SERVICES INTEGRATION',
    icon: '💰',
    color: '#059669',
  },
  'system-administration': {
    name: 'SYSTEM ADMINISTRATION',
    icon: '⚙️',
    color: '#7c3aed',
  },
  'training-certification': {
    name: 'TRAINING & CERTIFICATION',
    icon: '🎓',
    color: '#e11d48',
  },
};

// Get permission category color based on permission name
const getPermissionCategoryColor = (permissionName: string) => {
  // Map permission prefixes to categories
  const categoryMapping: { [key: string]: string } = {
    dispatch: 'operations',
    fleet: 'fleetflow',
    driver: 'driver-management',
    analytics: 'analytics',
    reports: 'analytics',
    safety: 'compliance',
    system: 'system-administration',
    training: 'training-certification',
    ai: 'ai-flow-platform',
    call: 'call-center-communications',
    crm: 'crm-customer-management',
    warehouse: 'warehousing-3pl-operations',
    government: 'government-contracts-rfp',
    financial: 'financial-services-integration',
    quickbooks: 'quickbooks-integration',
    resources: 'resources',
  };

  // Find matching category
  const prefix = permissionName.split('-')[0].toLowerCase();
  const categoryKey = categoryMapping[prefix] || 'system-administration';
  const category =
    permissionCategories[categoryKey as keyof typeof permissionCategories];

  return category ? category.color : '#10b981'; // Default to green if no match
};

// Department color mapping - exactly from user-management
const getDepartmentColor = (
  identifier: string | undefined,
  isUserIdType = false
) => {
  if (!identifier)
    return {
      color: '#6b7280',
      background: 'rgba(107, 114, 128, 0.1)',
      border: '1px solid rgba(107, 114, 128, 0.2)',
      department: 'Unknown',
    };

  let deptCode = '';
  if (isUserIdType) {
    const parts = identifier.split('-');
    if (parts.length >= 2) {
      deptCode = parts[1];
    }
  } else {
    deptCode = identifier;
  }

  const colorSchemes: Record<string, any> = {
    DC: {
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      department: 'Dispatch',
    },
    BB: {
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.1)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      department: 'Brokerage',
    },
    DM: {
      color: '#eab308',
      background: 'rgba(234, 179, 8, 0.1)',
      border: '1px solid rgba(234, 179, 8, 0.2)',
      department: 'Driver Mgmt',
    },
    MGR: {
      color: '#8b5cf6',
      background: 'rgba(139, 92, 246, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      department: 'Management',
    },
    CS: {
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      department: 'Customer Success',
    },
  };

  return colorSchemes[deptCode] || colorSchemes['DC'];
};

// Format date function - exactly from user-management
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function UserProfile() {
  const [mounted, setMounted] = useState(false);
  const [userPermissions, setUserPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [icaOnboarding, setIcaOnboarding] =
    useState<ICAOnboardingRecord | null>(null);
  const [selectedStep, setSelectedStep] = useState<ICAOnboardingStep | null>(
    null
  );
  const [workflowData, setWorkflowData] =
    useState<UserProfileWorkflowData | null>(null);
  const [showOpenELDSetup, setShowOpenELDSetup] = useState(false);
  const [phoneDialerEnabled, setPhoneDialerEnabled] = useState(true);

  const [currentUser, setCurrentUser] = useState(getDefaultUserProfile());
  const { data: session, status } = useSession();
  const userDataService = UserDataService.getInstance();
  const userIdentifierService = UserIdentifierService.getInstance();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status === 'loading') return;

    // Load real user data from NextAuth session and UserDataService
    const loadUserProfile = async () => {
      try {
        if (session?.user) {
          // Try to get user from UserDataService first
          let userProfile = userDataService.getCurrentUser();

          // If no current user in service, try to find by email or create from session
          if (!userProfile || userProfile.id === '') {
            // Use the FleetFlow user ID from NextAuth session or generate from email
            const userId =
              (session.user as any).fleetflowUserId ||
              userIdentifierService.getUserId(session.user.email || '');

            // Try to login with the mapped user ID
            userProfile = userDataService.loginUser(userId);

            // If still no user profile, create a basic one from session
            if (!userProfile || userProfile.id === '') {
              userProfile = {
                ...getDefaultUserProfile(),
                id: userId,
                name: session.user.name || 'User',
                firstName: session.user.name?.split(' ')[0] || 'User',
                lastName:
                  session.user.name?.split(' ').slice(1).join(' ') || '',
                email: session.user.email || '',
                department: 'General',
                departmentCode: 'GEN',
                position: 'User',
                role: 'User',
                hiredDate: new Date().toISOString().split('T')[0],
                location: 'Remote',
                status: 'active',
                lastLogin: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                createdDate: new Date().toISOString().split('T')[0],
              };
            }
          }

          if (userProfile) {
            console.info('🔐 User profile loaded:', {
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              sessionEmail: session.user.email,
            });

            setCurrentUser(userProfile as any);
          } else {
            console.error('❌ Failed to load user profile');
            setCurrentUser(getDefaultUserProfile());
          }
        } else {
          // No session - user not logged in
          console.info('🚪 No active session - user not logged in');
          setCurrentUser(getDefaultUserProfile());
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setCurrentUser(getDefaultUserProfile());
      }
    };

    loadUserProfile();
  }, [mounted, session, status, userDataService]);
  const workflowService = UserProfileWorkflowService.getInstance();
  const extensionService = FleetFlowExtensionService.getInstance();

  // Check phone dialer status on component mount
  useEffect(() => {
    if (!mounted) return;

    const dialerStatus = localStorage.getItem(
      `fleetflow-phone-dialer-${currentUser.id}`
    );
    setPhoneDialerEnabled(dialerStatus !== 'disabled');
  }, [currentUser.id, mounted]);

  // Initialize user permissions and ICA onboarding
  useEffect(() => {
    if (currentUser?.permissions) {
      setUserPermissions(
        currentUser.permissions as unknown as { [key: string]: boolean }
      );
    }

    // Load appropriate onboarding based on user type
    if (currentUser.departmentCode === 'DM') {
      // DM users get driver onboarding workflow - handled by OnboardingIntegrationService
      console.info(
        '🚛 DM User: Driver onboarding will be loaded from carrier system'
      );
      // Driver onboarding is managed separately - we'll show it in the UI below
      setIcaOnboarding(null);
    } else {
      // Non-DM users get ICA onboarding
      const icaService = ICAOnboardingService.getInstance();
      let onboardingRecord = icaService.getICAOnboarding(currentUser.id);

      if (!onboardingRecord) {
        onboardingRecord = icaService.createICAOnboarding(
          currentUser.id,
          currentUser.departmentCode
        );
      }

      setIcaOnboarding(onboardingRecord);
    }

    // Initialize workflow data - this connects to the complete profile workflow system
    const userWorkflow = workflowService.getUserProfileWorkflow(currentUser.id);
    if (userWorkflow) {
      setWorkflowData(userWorkflow);
    } else {
      // If no workflow exists, create one (simulates user creation from user-management)
      console.info('🔄 Initializing user workflow for:', currentUser.name);

      // Initialize empty workflow data - no mock data
      if (currentUser.departmentCode === 'DM') {
        const emptyUserProfile: UserProfileType = {
          ...currentUser,
          firstName: currentUser.name?.split(' ')[0] || '',
          lastName: currentUser.name?.split(' ')[1] || '',
          location: 'Not configured',
          lastLogin: '',
          createdDate: currentUser.hiredDate,
          status: 'inactive' as const,
        };

        const emptyWorkflowData: UserProfileWorkflowData = {
          user: emptyUserProfile,
          trainingAssignments: [],
          trainingProgress: [],
          icaOnboardingStatus: {
            currentStep: 0,
            completedSteps: [],
            overallProgress: 0,
          },
          carrierOnboardingStatus: {
            currentStep: 0,
            overallProgress: 0,
            completedSteps: [],
          },
          workflowStatus: 'training',
        };
        setWorkflowData(emptyWorkflowData);
      }
    }
  }, [currentUser, workflowService]);

  // Handle step completion
  const handleStepComplete = (stepId: string) => {
    if (icaOnboarding) {
      const icaService = ICAOnboardingService.getInstance();
      const updatedRecord = icaService.updateStepStatus(
        currentUser.id,
        stepId,
        true
      );
      if (updatedRecord) {
        setIcaOnboarding(updatedRecord);
      }
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
          padding: '60px 16px 16px 16px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '48px', marginBottom: '16px', color: 'white' }}
          >
            ⏳
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
            Loading User Profile...
          </div>
        </div>
      </div>
    );
  }

  // Exact return structure from user-management with proper styling
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements - exactly from user-management */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
        `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />

      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Main Profile Container - exactly from user-management structure */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Profile Header */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
              padding: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    margin: '0 0 8px 0',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    background: `linear-gradient(135deg, ${getDepartmentColor(currentUser?.id, true).color}, #ffffff)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {currentUser.name}
                </h2>
                {/* Show company name for Owner Operators */}
                {currentUser.position === 'Owner Operator' &&
                  currentUser.companyName && (
                    <div
                      style={{
                        color: '#fbbf24',
                        fontSize: '20px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        textShadow: '0 2px 4px rgba(251, 191, 36, 0.3)',
                      }}
                    >
                      🚛 {currentUser.companyName}
                    </div>
                  )}
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    fontWeight: '500',
                    marginBottom: '8px',
                  }}
                >
                  {currentUser.position} • {currentUser.department}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  Last active: {formatDate(currentUser.lastActive)}
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#60a5fa',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(59, 130, 246, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    📊 Dashboard
                  </button>
                </Link>
                <div
                  style={{
                    background:
                      currentUser.status === 'active'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    color:
                      currentUser.status === 'active' ? '#dc2626' : '#14b8a6',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    display: 'inline-block',
                  }}
                >
                  <span>
                    {currentUser.status === 'active'
                      ? '🟢'
                      : currentUser.status === 'pending'
                        ? '🟡'
                        : '🔴'}
                  </span>{' '}
                  {currentUser.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Section - exactly from user-management */}
          <div
            style={{
              padding: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👤 Account Details
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <div>
                {/* Full Name Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    👤 <strong>FULL NAME</strong>
                  </div>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#60a5fa',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {currentUser.name}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      marginTop: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📧 <strong>EMAIL ADDRESS</strong>
                  </div>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#60a5fa',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '13px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {currentUser.email}
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      marginTop: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📱 <strong>PHONE NUMBER</strong>
                  </div>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#34d399',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontSize: '13px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {currentUser.phone}
                  </div>
                </div>

                {/* Department Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      marginTop: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    🏢 <strong>DEPARTMENT</strong>
                  </div>
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: '#fbbf24',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      fontSize: '13px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {currentUser.department}
                  </div>
                </div>
              </div>

              <div>
                {/* Security Level Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    🔒 <strong>SECURITY LEVEL</strong>
                  </div>
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#f87171',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {currentUser.systemAccess.securityLevel}
                  </div>
                </div>

                {/* User ID Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      marginTop: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    🆔 <strong>USER IDENTIFIER</strong>
                  </div>
                  {(() => {
                    const colorScheme = getDepartmentColor(
                      currentUser?.id,
                      true
                    );
                    return (
                      <div
                        style={{
                          color: colorScheme.color,
                          background: colorScheme.background,
                          border: colorScheme.border,
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          textAlign: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {currentUser.id}
                      </div>
                    );
                  })()}
                </div>

                {/* Hire Date Field */}
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                      marginTop: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📅 <strong>HIRE DATE</strong>
                  </div>
                  <div
                    style={{
                      background: 'rgba(20, 184, 166, 0.1)',
                      color: '#2dd4bf',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(20, 184, 166, 0.2)',
                      fontSize: '13px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {formatDate(currentUser.hiredDate)}
                  </div>
                </div>

                {/* Executive/Brokerage specific fields */}
                {currentUser.departmentCode === 'MGR' && (
                  <>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          marginTop: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        🚛 <strong>BROKER MC</strong>
                      </div>
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          color: '#fbbf24',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          fontSize: '13px',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {currentUser.carrierMC || 'Not configured'}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          marginTop: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        🛡️ <strong>US DOT</strong>
                      </div>
                      <div
                        style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#a78bfa',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          fontSize: '13px',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {currentUser.usDot || 'DOT-7654321'}
                      </div>
                    </div>
                  </>
                )}

                {/* Driver/Carrier specific fields */}
                {currentUser.departmentCode === 'DM' && (
                  <>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          marginTop: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        🚗 <strong>CDL LICENSE</strong>
                      </div>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#34d399',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          fontSize: '13px',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {currentUser.cdlNumber || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          marginTop: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        🚛 <strong>CARRIER MC</strong>
                      </div>
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          color: '#fbbf24',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          fontSize: '13px',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {currentUser.carrierMC || 'MC-987654'}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          marginTop: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        🛡️ <strong>US DOT</strong>
                      </div>
                      <div
                        style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#a78bfa',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          fontSize: '13px',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {currentUser.usDot || 'Not configured'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div
            style={{
              padding: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                🆘 Emergency Contact
              </h4>
              {/* Badge/Tag Style Layout */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                {/* Contact Name Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background:
                      'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.08))',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    minWidth: '120px',
                    boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    👤
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600',
                        marginBottom: '2px',
                      }}
                    >
                      Contact
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#c4b5fd',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {currentUser?.emergencyContact?.name || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Relationship Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background:
                      'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(239, 68, 68, 0.08))',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    minWidth: '100px',
                    boxShadow: '0 2px 8px rgba(244, 63, 94, 0.1)',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    ❤️
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600',
                        marginBottom: '2px',
                      }}
                    >
                      Relation
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#fda4af',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {currentUser?.emergencyContact?.relation ||
                        'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Primary Phone Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.08))',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    minWidth: '140px',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>
                    📞
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600',
                        marginBottom: '2px',
                      }}
                    >
                      Primary
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#86efac',
                        fontWeight: '600',
                        fontFamily: 'monospace',
                      }}
                    >
                      {currentUser?.emergencyContact?.phone || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Alternative Phone Badge - Only show if exists */}
                {currentUser?.emergencyContact?.altPhone && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background:
                        'linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(100, 116, 139, 0.08))',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      minWidth: '140px',
                      boxShadow: '0 2px 8px rgba(148, 163, 184, 0.1)',
                    }}
                  >
                    <span style={{ fontSize: '16px', marginRight: '8px' }}>
                      📱
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontWeight: '600',
                          marginBottom: '2px',
                        }}
                      >
                        Alternative
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#cbd5e1',
                          fontWeight: '600',
                          fontFamily: 'monospace',
                        }}
                      >
                        {currentUser?.emergencyContact?.altPhone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role-Based Onboarding Progress Section */}
          {(currentUser.departmentCode !== 'DM'
            ? icaOnboarding
            : workflowData?.carrierOnboardingStatus) && (
            <div
              style={{
                padding: '32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {currentUser.departmentCode === 'DM'
                  ? '🚛 My Driver Onboarding Progress'
                  : '🚀 My ICA Onboarding Progress'}
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Progress:{' '}
                  {currentUser.departmentCode === 'DM'
                    ? `${workflowData?.carrierOnboardingStatus?.currentStep || 1} of 6 steps`
                    : `${icaOnboarding?.currentStep} of ${icaOnboarding?.totalSteps} steps`}
                </span>
                <span
                  style={{
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {currentUser.departmentCode === 'DM'
                    ? `${workflowData?.carrierOnboardingStatus?.overallProgress || 0}% Complete`
                    : `${Math.round(icaOnboarding?.progressPercentage || 0)}% Complete`}
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    height: '100%',
                    width: `${
                      currentUser.departmentCode === 'DM'
                        ? workflowData?.carrierOnboardingStatus
                            ?.overallProgress || 0
                        : icaOnboarding?.progressPercentage || 0
                    }%`,
                    borderRadius: '8px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                {currentUser.departmentCode === 'DM'
                  ? // Driver onboarding steps
                    [
                      {
                        id: 'fmcsa',
                        title: 'FMCSA Verification',
                        icon: '🚛',
                        description:
                          'Verify carrier credentials and safety ratings',
                      },
                      {
                        id: 'limits',
                        title: 'Travel Limits',
                        icon: '🗺️',
                        description:
                          'Set operational boundaries and service areas',
                      },
                      {
                        id: 'documents',
                        title: 'Documents',
                        icon: '📋',
                        description:
                          'Upload insurance, permits, and certifications',
                      },
                      {
                        id: 'openeld',
                        title: 'OpenELD Setup',
                        icon: '📱',
                        description:
                          'Configure Electronic Logging Device for compliance',
                      },
                      {
                        id: 'factoring',
                        title: 'Factoring',
                        icon: '💰',
                        description:
                          'Configure payment and factoring preferences',
                      },
                      {
                        id: 'agreements',
                        title: 'Agreements',
                        icon: '📝',
                        description: 'Review and sign carrier agreements',
                      },
                      {
                        id: 'portal',
                        title: 'Portal Setup',
                        icon: '👤',
                        description: 'Complete driver portal configuration',
                      },
                    ].map((step, index) => {
                      const isCompleted = (
                        workflowData?.carrierOnboardingStatus?.completedSteps ||
                        []
                      ).includes(step.title);
                      const isCurrent =
                        (workflowData?.carrierOnboardingStatus?.currentStep ||
                          1) ===
                        index + 1;
                      return (
                        <div
                          key={step.id}
                          onClick={() => {
                            if (step.id === 'openeld' && !isCompleted) {
                              setShowOpenELDSetup(true);
                            }
                          }}
                          style={{
                            background: isCompleted
                              ? 'rgba(16, 185, 129, 0.1)'
                              : isCurrent
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(255, 255, 255, 0.05)',
                            border: isCompleted
                              ? '1px solid rgba(16, 185, 129, 0.3)'
                              : isCurrent
                                ? '1px solid rgba(245, 158, 11, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
                            <span style={{ fontSize: '24px' }}>
                              {step.icon}
                            </span>
                            <div>
                              <h5
                                style={{
                                  color: isCompleted
                                    ? '#10b981'
                                    : isCurrent
                                      ? '#f59e0b'
                                      : 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  margin: '0 0 4px 0',
                                }}
                              >
                                {step.title}
                              </h5>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '12px',
                                }}
                              >
                                {step.description}
                              </div>
                            </div>
                          </div>

                          {isCompleted && (
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '12px',
                                fontWeight: '600',
                                marginTop: '8px',
                              }}
                            >
                              ✅ Completed
                            </div>
                          )}

                          {isCurrent && !isCompleted && (
                            <div
                              style={{
                                color: '#f59e0b',
                                fontSize: '12px',
                                fontWeight: '600',
                                marginTop: '8px',
                              }}
                            >
                              🔄 In Progress
                            </div>
                          )}
                        </div>
                      );
                    })
                  : // ICA onboarding steps for non-DM users
                    icaOnboarding?.steps.map((step) => (
                      <div
                        key={step.id}
                        onClick={() => setSelectedStep(step)}
                        style={{
                          background: step.completed
                            ? 'rgba(16, 185, 129, 0.1)'
                            : step.current
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(255, 255, 255, 0.05)',
                          border: step.completed
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : step.current
                              ? '1px solid rgba(245, 158, 11, 0.3)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
                          <span style={{ fontSize: '24px' }}>{step.icon}</span>
                          <div>
                            <h5
                              style={{
                                color: step.completed
                                  ? '#10b981'
                                  : step.current
                                    ? '#f59e0b'
                                    : 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                fontWeight: '600',
                                margin: '0 0 4px 0',
                              }}
                            >
                              {step.title}
                            </h5>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              {step.description}
                            </div>
                          </div>
                        </div>

                        {step.current && !step.completed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStepComplete(step.id);
                            }}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              border: 'none',
                              cursor: 'pointer',
                              marginTop: '8px',
                            }}
                          >
                            ✅ Complete Step
                          </button>
                        )}

                        {step.completed && (
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginTop: '8px',
                            }}
                          >
                            ✅ Completed{' '}
                            {step.completedAt &&
                              `on ${formatDate(step.completedAt)}`}
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* Role-Based Training Progress Section */}
          {currentUser.departmentCode !== 'DM' && (
            <div
              style={{
                padding: '32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🎓 FleetFlow University℠ Training Progress
              </h3>

              {/* Training Overview Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#10b981',
                      marginBottom: '4px',
                    }}
                  >
                    {workflowData?.trainingProgress.filter(
                      (p) => p.status === 'completed'
                    ).length || 0}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Completed
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      marginBottom: '4px',
                    }}
                  >
                    {workflowData?.trainingProgress.filter(
                      (p) => p.status === 'in_progress'
                    ).length || 0}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    In Progress
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#ef4444',
                      marginBottom: '4px',
                    }}
                  >
                    {workflowData?.trainingProgress.filter(
                      (p) => p.status === 'not_started'
                    ).length || 0}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Pending
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      marginBottom: '4px',
                    }}
                  >
                    {workflowData?.trainingProgress &&
                    workflowData.trainingProgress.length > 0
                      ? Math.round(
                          workflowData.trainingProgress.reduce(
                            (sum, p) => sum + p.progress,
                            0
                          ) / workflowData.trainingProgress.length
                        )
                      : 0}
                    %
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Overall
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    height: '100%',
                    width: `${
                      workflowData?.trainingProgress &&
                      workflowData.trainingProgress.length > 0
                        ? Math.round(
                            workflowData.trainingProgress.reduce(
                              (sum, p) => sum + p.progress,
                              0
                            ) / workflowData.trainingProgress.length
                          )
                        : 0
                    }%`,
                    borderRadius: '8px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Training Modules */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Completed Modules */}
                {workflowData?.trainingProgress
                  .filter((p) => p.status === 'completed')
                  .map((module, index) => (
                    <div
                      key={`completed-${index}`}
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
                        <span style={{ fontSize: '20px' }}>✅</span>
                        <div>
                          <h5
                            style={{
                              color: '#10b981',
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {module.moduleName}
                          </h5>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                            }}
                          >
                            Completed {module.completedDate || 'Recently'}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Score: {module.score || 85}%
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '11px',
                          }}
                        >
                          Instructor: {module.instructor}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* In Progress Modules */}
                {workflowData?.trainingProgress
                  .filter((p) => p.status === 'in_progress')
                  .map((module, index) => (
                    <div
                      key={`progress-${index}`}
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>📚</span>
                        <div>
                          <h5
                            style={{
                              color: '#f59e0b',
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {module.moduleName}
                          </h5>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                            }}
                          >
                            Started {module.startedDate || 'Recently'}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          height: '6px',
                          overflow: 'hidden',
                          marginBottom: '8px',
                        }}
                      >
                        <div
                          style={{
                            background: '#f59e0b',
                            height: '100%',
                            width: `${module.progress}%`,
                            borderRadius: '6px',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            color: '#f59e0b',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {module.progress}% Complete
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '11px',
                          }}
                        >
                          Due: TBD
                        </div>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                          marginTop: '4px',
                        }}
                      >
                        Instructor: {module.instructor}
                      </div>
                    </div>
                  ))}

                {/* Pending Modules */}
                {workflowData?.trainingProgress
                  .filter((p) => p.status === 'not_started')
                  .map((module, index) => (
                    <div
                      key={`pending-${index}`}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
                        <span style={{ fontSize: '20px' }}>⏳</span>
                        <div>
                          <h5
                            style={{
                              color: '#ef4444',
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {module.moduleName}
                          </h5>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                            }}
                          >
                            Not started
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Assignment Pending
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* My Granted Permissions Section - exactly from user-management */}
          <div
            style={{
              padding: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🔑 My Granted Permissions
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '12px',
              }}
            >
              {Object.entries(userPermissions)
                .filter(([_, granted]) => granted)
                .map(([permission, _]) => {
                  const categoryColor = getPermissionCategoryColor(permission);
                  return (
                    <div
                      key={permission}
                      style={{
                        background: categoryColor,
                        border: `1px solid ${categoryColor}`,
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ color: 'white', fontSize: '16px' }}>
                        ✅
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {permission
                          .replace(/-/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* AI Flow & Phone Dialer Opt-in Features - For Brokers and Dispatchers */}
          {(currentUser?.departmentCode === 'BB' ||
            currentUser?.departmentCode === 'DC') && (
            <div
              style={{
                padding: '32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  🤖 AI Flow Lead Generation{' '}
                  {currentUser?.departmentCode === 'DC'
                    ? '(Dispatcher)'
                    : '(Broker)'}
                </h4>

                {/* AI Flow Status with Toggle */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #10b981',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                      ✅ OPTED IN - AI LEAD GENERATION ACTIVE
                    </div>
                    <button
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        alert(
                          'AI Flow Lead Generation disabled for ' +
                            currentUser.name
                        );
                      }}
                    >
                      OPT OUT
                    </button>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    Last Lead Generated: Today at 2:15 PM
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      12 Leads Today
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      85% Success Rate
                    </div>
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      $2.4K Revenue
                    </div>
                  </div>
                </div>

                {/* Phone Dialer Status with Toggle */}
                <div
                  style={{
                    background: phoneDialerEnabled
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: phoneDialerEnabled
                      ? '1px solid #10b981'
                      : '1px solid #ef4444',
                    marginTop: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        color: phoneDialerEnabled ? '#10b981' : '#ef4444',
                        fontWeight: 'bold',
                      }}
                    >
                      📞 PHONE DIALER -{' '}
                      {phoneDialerEnabled ? 'ACTIVE' : 'DISABLED'}
                    </div>
                    <button
                      style={{
                        background: phoneDialerEnabled ? '#ef4444' : '#22c55e',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (phoneDialerEnabled) {
                          localStorage.setItem(
                            `fleetflow-phone-dialer-${currentUser.id}`,
                            'disabled'
                          );
                          setPhoneDialerEnabled(false);
                          alert(
                            currentUser.name !== 'Not configured'
                              ? `📞 Phone Dialer disconnected for ${currentUser.name}. The phone widget will disappear.`
                              : '📞 Phone Dialer disconnected. The phone widget will disappear.'
                          );
                        } else {
                          localStorage.removeItem(
                            `fleetflow-phone-dialer-${currentUser.id}`
                          );
                          setPhoneDialerEnabled(true);
                          alert(
                            currentUser.name !== 'Not configured'
                              ? `📞 Phone Dialer connected for ${currentUser.name}. The phone widget will appear shortly.`
                              : '📞 Phone Dialer connected. The phone widget will appear shortly.'
                          );
                        }
                        // Small delay to let state update, then refresh to show/hide widget
                        setTimeout(() => {
                          if (typeof window !== 'undefined') {
                            window.location.reload();
                          }
                        }, 800);
                      }}
                    >
                      {phoneDialerEnabled ? 'DISCONNECT' : 'CONNECT'}
                    </button>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    {(() => {
                      const extension = extensionService.getUserExtension(
                        currentUser.id
                      );
                      return extension
                        ? `Extension: ${extension.extension} • Status: ${extension.status === 'active' ? 'Available' : 'Inactive'}`
                        : 'Extension: Not assigned • Status: Pending';
                    })()}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      23 Calls Today
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      92% Connect Rate
                    </div>
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      4.2m Talk Time
                    </div>
                  </div>
                </div>

                {/* Phone Setup Department - Available when Phone Dialer is Active */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginTop: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        color: '#f59e0b',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      🔧 PHONE SETUP & CONFIGURATION
                    </div>
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      AVAILABLE
                    </div>
                  </div>

                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    Configure your phone system settings, connection setup, and
                    dialer preferences
                  </div>

                  {/* Phone Setup Actions */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    <Link
                      href='/call-flow'
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#fbbf24',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center',
                        textDecoration: 'none',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(245, 158, 11, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(245, 158, 11, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      🔧 Open Phone Setup
                    </Link>

                    <button
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(59, 130, 246, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(59, 130, 246, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onClick={() => {
                        setShowOpenELDSetup(!showOpenELDSetup);
                      }}
                    >
                      ⚙️ Configuration
                    </button>

                    <button
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#22c55e',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(16, 185, 129, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(16, 185, 129, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      onClick={() => {
                        alert(
                          currentUser.name !== 'Not configured'
                            ? `Testing phone connection for ${currentUser.name}`
                            : 'Cannot test connection - user profile not configured'
                        );
                      }}
                    >
                      🧪 Test Connection
                    </button>
                  </div>

                  {/* Connection Status */}
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 6px #22c55e',
                      }}
                    />
                    <span
                      style={{
                        color: '#22c55e',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {(() => {
                        const extension = extensionService.getUserExtension(
                          currentUser.id
                        );
                        return extension
                          ? `Phone System Connected • FreeSWITCH Online • Extension ${extension.extension} Active`
                          : 'Phone System Disconnected • Extension Not Assigned';
                      })()}
                    </span>
                  </div>

                  {/* Embedded Phone Setup - Shows when Configuration is clicked */}
                  {showOpenELDSetup && (
                    <div
                      style={{
                        marginTop: '16px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <h5
                          style={{
                            color: '#f59e0b',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            margin: 0,
                          }}
                        >
                          🔧 Phone System Configuration
                        </h5>
                        <button
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setShowOpenELDSetup(false)}
                        >
                          ✕ Close
                        </button>
                      </div>

                      {/* Embedded Phone Setup Component */}
                      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                        <PhoneConnectionSetup
                          user={currentUser}
                          onSetupComplete={(setupData) => {
                            console.info(
                              'Phone setup completed for user:',
                              setupData
                            );
                            alert(
                              currentUser.name !== 'Not configured'
                                ? `Phone setup completed successfully for ${currentUser.name}!`
                                : 'Phone setup completed successfully!'
                            );
                            setShowOpenELDSetup(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Executive Compliance Center - Only for executive users */}
          {['Admin', 'Manager', 'Owner', 'President'].includes(
            currentUser.role
          ) && (
            <div
              style={{
                padding: '32px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ⚖️ Executive Regulatory Compliance Center
              </h4>
              <ExecutiveComplianceCenter
                userId={currentUser.id}
                userRole={currentUser.role}
              />
            </div>
          )}

          {/* Notes Section - exactly from user-management */}
          <div
            style={{
              padding: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📝 Profile Notes
            </h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '100px',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                }}
              >
                {currentUser.notes || 'No additional notes on file.'}
              </div>
            </div>
          </div>

          {/* Subscription Management */}
          <div
            style={{
              padding: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <UserSubscriptionManager
              userId={currentUser.id}
              isCompact={false}
            />
          </div>

          {/* Action Buttons - exactly from user-management */}
          <div
            style={{
              padding: '32px',
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              ✏️ Edit Profile
            </button>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #047857)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {currentUser.departmentCode === 'DM'
                ? '📋 Load History'
                : '📊 Load Details'}
            </button>
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {currentUser.departmentCode === 'DM'
                ? '📱 ELD Settings'
                : '🔔 Notification Settings'}
            </button>
          </div>
        </div>

        {/* Step Detail Modal */}
        {selectedStep && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setSelectedStep(null)}
          >
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '32px' }}>{selectedStep.icon}</span>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  {selectedStep.title}
                </h3>
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: '0 0 20px 0',
                }}
              >
                {selectedStep.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setSelectedStep(null)}
                  style={{
                    background: 'rgba(107, 114, 128, 0.2)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                {selectedStep.current && !selectedStep.completed && (
                  <button
                    onClick={() => {
                      handleStepComplete(selectedStep.id);
                      setSelectedStep(null);
                    }}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✅ Complete Step
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OpenELD Setup Modal */}
        {showOpenELDSetup && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowOpenELDSetup(false)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <OpenELDOnboardingSetup
                onComplete={() => {
                  setShowOpenELDSetup(false);
                  // Update the workflow data to mark OpenELD as completed
                  if (workflowData) {
                    const updatedWorkflowData = {
                      ...workflowData,
                      carrierOnboardingStatus: {
                        ...workflowData.carrierOnboardingStatus!,
                        currentStep: 5, // Move to next step (Factoring)
                        overallProgress: 71, // Update progress
                        completedSteps: [
                          ...(workflowData.carrierOnboardingStatus
                            ?.completedSteps || []),
                          'OpenELD Setup',
                        ],
                      },
                    };
                    setWorkflowData(updatedWorkflowData);
                  }
                }}
                driverId={currentUser.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
