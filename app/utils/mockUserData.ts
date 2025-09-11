// Mock User Data with Enhanced Section Permissions and Condition Status
import { UserPermissionProfile, UserConditionStatus } from './sectionPermissions';

export interface EnhancedUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Broker Agent' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: string[]; // Basic permissions
  sectionPermissions: string[]; // Section permission IDs
  conditionStatus: UserConditionStatus;
  accessBlocks: {
    type: 'section' | 'page' | 'app';
    target: string;
    reason: string;
    until?: string;
  }[];
  createdDate: string;
  
  // New identification fields
  brokerInitials?: string;
  systemId?: string;
  employeeCode?: string;
  accessCode?: string;
  securityLevel?: number;
  department?: string;
  location?: string;
  phoneNumber?: string;
  hiredDate?: string;
}

export const MOCK_ENHANCED_USERS: EnhancedUser[] = [
  {
    id: 'U001',
    name: 'Fleet Manager',
    email: 'manager@fleetflowapp.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Current session',
    permissions: ['all'],
    sectionPermissions: [
      'dashboard.metrics.revenue',
      'dashboard.metrics.loads',
      'dashboard.quick-actions',
      'dispatch.load-board',
      'dispatch.create-load',
      'dispatch.assign-drivers',
      'dispatch.rate-management',
      'drivers.view-all',
      'drivers.compliance-tracking',
      'drivers.performance-metrics',
      'drivers.schedule-management',
      'analytics.financial-reports',
      'analytics.operational-metrics',
      'analytics.export-data',
      'settings.user-management',
      'settings.system-config',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'basic_system_training', 'admin_certification'],
        inProgress: [],
        required: ['safety_training', 'basic_system_training'],
        overallCompletion: 100
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-12-31',
        licenseStatus: 'valid',
        hosViolations: 0,
        safetyScore: 95
      },
      certification: {
        active: ['system_administrator', 'compliance_officer'],
        expired: [],
        required: ['system_administrator']
      },
      performance: {
        rating: 4.8,
        onTimeDelivery: 98.5,
        safetyIncidents: 0
      }
    },
    accessBlocks: [],
    createdDate: '2024-01-01'
  },
  {
    id: 'U002',
    name: 'Sarah Johnson',
    email: 'sarah.j@fleetflowapp.com',
    role: 'Dispatcher',
    status: 'Active',
    lastLogin: '2024-12-18 14:30',
    permissions: ['dashboard_view', 'dispatch_access', 'routes_manage', 'drivers_manage', 'invoices_view'],
    sectionPermissions: [
      'dashboard.metrics.loads',
      'dashboard.quick-actions',
      'dispatch.load-board',
      'dispatch.create-load',
      'dispatch.assign-drivers',
      'drivers.view-all',
      'drivers.schedule-management',
      'analytics.operational-metrics',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'basic_system_training', 'dispatch_certification', 'load_creation_training'],
        inProgress: ['schedule_management_training'],
        required: ['safety_training', 'basic_system_training', 'dispatch_certification'],
        overallCompletion: 85
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-06-30',
        licenseStatus: 'valid',
        hosViolations: 0,
        safetyScore: 92
      },
      certification: {
        active: ['dispatch_operator'],
        expired: [],
        required: ['dispatch_operator']
      },
      performance: {
        rating: 4.2,
        onTimeDelivery: 94.5,
        safetyIncidents: 0
      }
    },
    accessBlocks: [
      {
        type: 'section',
        target: 'drivers.schedule-management',
        reason: 'Schedule management training in progress',
        until: '2024-12-31'
      }
    ],
    createdDate: '2024-01-15'
  },
  {
    id: 'U003',
    name: 'John Smith',
    email: 'j.smith@fleetflowapp.com',
    role: 'Driver',
    status: 'Active',
    lastLogin: '2024-12-18 09:15',
    permissions: ['dashboard_view', 'routes_manage'],
    sectionPermissions: [
      'dashboard.metrics.loads',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'driver_onboarding'],
        inProgress: ['hos_regulations'],
        required: ['safety_training', 'driver_onboarding', 'hos_regulations'],
        overallCompletion: 67
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-03-15',
        licenseStatus: 'valid',
        hosViolations: 1,
        safetyScore: 88
      },
      certification: {
        active: ['commercial_driver_license'],
        expired: [],
        required: ['commercial_driver_license']
      },
      performance: {
        rating: 4.0,
        onTimeDelivery: 91.2,
        safetyIncidents: 1
      }
    },
    accessBlocks: [],
    createdDate: '2024-02-01'
  },
  {
    id: 'U004',
    name: 'Mike Wilson',
    email: 'mike.wilson@fleetflowapp.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-12-19 12:15',
    permissions: ['dashboard_view', 'vehicles_manage', 'drivers_manage', 'reports_view', 'invoices_view'],
    sectionPermissions: [
      'dashboard.metrics.revenue',
      'dashboard.metrics.loads',
      'dashboard.quick-actions',
      'dispatch.load-board',
      'dispatch.create-load',
      'dispatch.assign-drivers',
      'drivers.view-all',
      'drivers.compliance-tracking',
      'drivers.performance-metrics',
      'drivers.schedule-management',
      'analytics.financial-reports',
      'analytics.operational-metrics',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'basic_system_training', 'manager_certification'],
        inProgress: ['data_handling_certification'],
        required: ['safety_training', 'basic_system_training', 'manager_certification'],
        overallCompletion: 90
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-09-30',
        licenseStatus: 'valid',
        hosViolations: 0,
        safetyScore: 96
      },
      certification: {
        active: ['compliance_officer', 'operations_manager'],
        expired: [],
        required: ['operations_manager']
      },
      performance: {
        rating: 4.5,
        onTimeDelivery: 96.8,
        safetyIncidents: 0
      }
    },
    accessBlocks: [
      {
        type: 'section',
        target: 'analytics.export-data',
        reason: 'Data handling certification in progress',
        until: '2024-12-25'
      }
    ],
    createdDate: '2024-01-20'
  },
  {
    id: 'U005',
    name: 'Jessica Davis',
    email: 'jessica.davis@fleetflowapp.com',
    role: 'Driver',
    status: 'Inactive',
    lastLogin: '2024-12-10 16:45',
    permissions: ['dashboard_view'],
    sectionPermissions: [],
    conditionStatus: {
      training: {
        completed: ['safety_training'],
        inProgress: [],
        required: ['safety_training', 'driver_onboarding', 'hos_regulations'],
        overallCompletion: 33
      },
      compliance: {
        dotStatus: 'violation',
        medicalCertExpiry: '2024-12-01', // Expired
        licenseStatus: 'suspended',
        hosViolations: 3,
        safetyScore: 65
      },
      certification: {
        active: [],
        expired: ['commercial_driver_license'],
        required: ['commercial_driver_license']
      },
      performance: {
        rating: 2.8,
        onTimeDelivery: 78.5,
        safetyIncidents: 2
      }
    },
    accessBlocks: [
      {
        type: 'app',
        target: 'entire_application',
        reason: 'DOT compliance violation and suspended license',
        until: '2025-01-15'
      },
      {
        type: 'app',
        target: 'entire_application',
        reason: 'Required training modules not completed',
        until: 'until_training_complete'
      }
    ],
    createdDate: '2024-03-01'
  },
  {
    id: 'U006',
    name: 'Sarah Martinez',
    email: 'sarah.martinez@fleetflowapp.com',
    role: 'Broker Agent',
    status: 'Active',
    lastLogin: '2024-12-19 15:45',
    permissions: ['dashboard_view', 'broker_operations', 'freight_quoting', 'client_management'],
    sectionPermissions: [
      'dashboard.metrics.revenue',
      'dashboard.quick-actions',
      'broker.load-board',
      'broker.client-management',
      'broker.rate-negotiation',
      'broker.capacity-search',
      'quoting.freight-quotes',
      'quoting.rate-calculation',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'broker_certification', 'negotiation_training'],
        inProgress: ['advanced_broker_training'],
        required: ['safety_training', 'broker_certification'],
        overallCompletion: 85
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-06-30',
        licenseStatus: 'valid',
        hosViolations: 0,
        safetyScore: 92
      },
      certification: {
        active: ['broker_license', 'freight_brokerage_authority'],
        expired: [],
        required: ['broker_license', 'freight_brokerage_authority']
      },
      performance: {
        rating: 4.6,
        onTimeDelivery: 94,
        safetyIncidents: 0
      }
    },
    accessBlocks: [],
    createdDate: '2024-03-10'
  },
  {
    id: 'U007',
    name: 'Mike Johnson',
    email: 'mike.johnson@owneroperator.com',
    role: 'Driver',
    status: 'Active',
    lastLogin: '2024-12-18 16:45',
    permissions: ['dashboard_view', 'dispatch_access', 'load_tracking'],
    sectionPermissions: [
      'dashboard.metrics.loads',
      'dispatch.load-board',
      'drivers.view-profile',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'basic_system_training'],
        inProgress: ['carrier_onboarding'],
        required: ['safety_training', 'basic_system_training', 'carrier_onboarding'],
        overallCompletion: 75
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-08-15',
        licenseStatus: 'valid',
        hosViolations: 0,
        safetyScore: 92
      },
      certification: {
        active: ['owner_operator_certification'],
        expired: [],
        required: ['owner_operator_certification']
      },
      performance: {
        rating: 4.6,
        onTimeDelivery: 97.8,
        safetyIncidents: 0
      }
    },
    accessBlocks: [],
    createdDate: '2024-01-10',
    department: 'Owner/Operator',
    location: 'Regional Hub',
    phoneNumber: '(555) 234-5678',
    hiredDate: '2024-01-10'
  },
  {
    id: 'U008',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@owneroperator.com',
    role: 'Driver',
    status: 'Active',
    lastLogin: '2024-12-18 14:20',
    permissions: ['dashboard_view', 'dispatch_access', 'load_tracking'],
    sectionPermissions: [
      'dashboard.metrics.loads',
      'dispatch.load-board',
      'drivers.view-profile',
      'app.access'
    ],
    conditionStatus: {
      training: {
        completed: ['safety_training', 'basic_system_training', 'carrier_onboarding'],
        inProgress: [],
        required: ['safety_training', 'basic_system_training', 'carrier_onboarding'],
        overallCompletion: 100
      },
      compliance: {
        dotStatus: 'compliant',
        medicalCertExpiry: '2025-11-30',
        licenseStatus: 'valid',
        hosViolations: 0,
        safetyScore: 94
      },
      certification: {
        active: ['owner_operator_certification'],
        expired: [],
        required: ['owner_operator_certification']
      },
      performance: {
        rating: 4.8,
        onTimeDelivery: 98.5,
        safetyIncidents: 0
      }
    },
    accessBlocks: [],
    createdDate: '2024-01-05',
    department: 'Owner/Operator',
    location: 'Regional Hub',
    phoneNumber: '(555) 345-6789',
    hiredDate: '2024-01-05'
  }
];

// Training modules that can be completed
export const TRAINING_MODULES = [
  { id: 'safety_training', name: 'Safety Training', required: true, category: 'Safety' },
  { id: 'basic_system_training', name: 'Basic System Training', required: true, category: 'System' },
  { id: 'driver_onboarding', name: 'Driver Onboarding', required: true, category: 'Driver' },
  { id: 'hos_regulations', name: 'Hours of Service Regulations', required: true, category: 'Compliance' },
  { id: 'dispatch_certification', name: 'Dispatch Certification', required: false, category: 'Dispatch' },
  { id: 'load_creation_training', name: 'Load Creation Training', required: false, category: 'Dispatch' },
  { id: 'schedule_management_training', name: 'Schedule Management Training', required: false, category: 'Management' },
  { id: 'data_handling_certification', name: 'Data Handling Certification', required: false, category: 'Security' },
  { id: 'admin_certification', name: 'Admin Certification', required: false, category: 'Administration' },
  { id: 'manager_certification', name: 'Manager Certification', required: false, category: 'Management' }
];

// Certification types
export const CERTIFICATION_TYPES = [
  { id: 'commercial_driver_license', name: 'Commercial Driver License', category: 'Driver' },
  { id: 'system_administrator', name: 'System Administrator', category: 'Admin' },
  { id: 'compliance_officer', name: 'Compliance Officer', category: 'Compliance' },
  { id: 'dispatch_operator', name: 'Dispatch Operator', category: 'Dispatch' },
  { id: 'operations_manager', name: 'Operations Manager', category: 'Management' }
];
