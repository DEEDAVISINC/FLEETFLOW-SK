'use client';

import { useEffect, useState } from 'react';

// Comprehensive mock users with ALL detailed information + drivers with carrier onboarding
const mockUsers = [
  {
    id: 'FM-MGR-2023005',
    name: 'Frank Miller',
    email: 'frank.miller@fleetflowapp.com',
    phone: '(555) 123-4567',
    department: 'Management',
    departmentCode: 'MGR',
    position: 'Operations Manager',
    hiredDate: '2023-01-15',
    role: 'Fleet Manager',
    status: 'active',
    lastActive: '2024-01-15T10:30:00Z',
    systemAccess: {
      level: 'Full Administrative',
      accessCode: 'ACC-FM-MGR',
      securityLevel: 'Level 5 - Executive',
      allowedSystems: ['Full System Access', 'User Management', 'Financial Reports', 'System Configuration']
    },
    emergencyContact: {
      name: 'Linda Miller',
      relation: 'Spouse',
      phone: '(555) 987-1234',
      altPhone: '(555) 444-5555'
    },
    notes: '• Senior management with full system access\n• Authorized for all financial and operational decisions\n• Emergency contact updated January 2024\n• Completed executive leadership training',
    permissions: {
      // User Management - Full Access
      'user-account-view': true,
      'user-account-edit': true,
      'user-permissions-grant': true,
      'user-permissions-revoke': true,
      'user-workflow-modify': true,
      'user-notes-manage': true,
      'user-emergency-contact-edit': true,
      'user-status-change': true,
      'user-delete-account': true,

      // Dispatch Operations - Full Access
      'dispatch-load-create': true,
      'dispatch-load-assign': true,
      'dispatch-driver-assign': true,
      'dispatch-route-optimize': true,
      'dispatch-emergency-override': true,
      'dispatch-load-modify': true,
      'dispatch-status-update': true,
      'dispatch-communication-manage': true,
      'dispatch-load-delete': true,

      // Fleet Management - Full Access
      'fleet-vehicle-tracking': true,
      'fleet-maintenance-schedule': true,
      'fleet-driver-performance': true,
      'fleet-routes-manage': true,
      'fleet-vehicle-assign': true,
      'fleet-inspection-manage': true,
      'fleet-fuel-monitoring': true,
      'fleet-compliance-track': true,
      'fleet-vehicle-modify': true,

      // Broker Operations - Full Access
      'broker-quote-create': true,
      'broker-rate-negotiate': true,
      'broker-customer-manage': true,
      'broker-contract-sign': true,
      'broker-payment-process': true,
      'broker-margin-view': true,
      'broker-analytics-access': true,
      'broker-rfq-respond': true,
      'broker-load-board-access': true,

      // Analytics & Reports - Full Access
      'analytics-financial-view': true,
      'analytics-performance-view': true,
      'analytics-predictive-access': true,
      'reports-generate': true,
      'reports-export': true,
      'reports-schedule': true,
      'dashboard-customize': true,
      'kpi-configure': true,
      'analytics-real-time-access': true,

      // Compliance & Safety - Full Access
      'compliance-dot-manage': true,
      'compliance-audit-access': true,
      'safety-violations-view': true,
      'certificates-manage': true,
      'inspection-schedule': true,
      'driver-qualification-verify': true,
      'safety-training-assign': true,
      'compliance-reporting': true,
      'safety-incident-manage': true
    },
    contractorWorkflow: {
      sessionId: 'CWS-FM-MGR-2023005',
      status: 'completed',
      currentStep: 7,
      totalSteps: 7,
      progressPercentage: 100,
      startedAt: '2023-01-15T09:00:00Z',
      completedAt: '2023-01-20T16:00:00Z',
      steps: [
        { id: 'personal_info', name: 'Personal Information', status: 'completed', completedAt: '2023-01-15T09:05:00Z' },
        { id: 'experience_verification', name: 'Experience Verification', status: 'completed', completedAt: '2023-01-15T10:15:00Z' },
        { id: 'background_check', name: 'Background Check', status: 'completed', completedAt: '2023-01-16T14:30:00Z' },
        { id: 'contract_signing', name: 'Contract Signing', status: 'completed', completedAt: '2023-01-17T11:20:00Z' },
        { id: 'nda_signing', name: 'NDA Signing', status: 'completed', completedAt: '2023-01-17T11:25:00Z' },
        { id: 'training_completion', name: 'Training Modules', status: 'completed', completedAt: '2023-01-19T15:30:00Z' },
        { id: 'system_access_grant', name: 'Full System Access', status: 'completed', completedAt: '2023-01-20T16:00:00Z' }
      ],
      documents: [
        { type: 'contractor_agreement', status: 'signed', signedAt: '2023-01-17T11:20:00Z' },
        { type: 'nda', status: 'signed', signedAt: '2023-01-17T11:25:00Z' },
        { type: 'w9', status: 'signed', signedAt: '2023-01-18T10:00:00Z' }
      ],
      training: {
        required: ['Management Fundamentals', 'Fleet Operations', 'Financial Management', 'Safety Leadership'],
        completed: ['Management Fundamentals', 'Fleet Operations', 'Financial Management', 'Safety Leadership'],
        inProgress: [],
        overallProgress: 100
      }
    }
  },
  {
    id: 'SJ-DC-2024014',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@fleetflowapp.com',
    phone: '(555) 234-5678',
    department: 'Dispatch',
    departmentCode: 'DC',
    position: 'Senior Dispatcher',
    hiredDate: '2024-01-20',
    role: 'Independent Contractor - Dispatcher',
    status: 'active',
    lastActive: '2024-01-15T09:45:00Z',
    systemAccess: {
      level: 'Dispatch Operations',
      accessCode: 'ACC-SJ-DC',
      securityLevel: 'Level 3 - Dispatcher',
      allowedSystems: ['Dispatch Console', 'Load Management', 'Route Planning', 'Driver Communication']
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relation: 'Husband',
      phone: '(555) 876-5432',
      altPhone: '(555) 999-8888'
    },
    notes: '• Independent contractor dispatcher with excellent performance\n• Specializes in long-haul route optimization\n• NDA signature pending review\n• Strong communication skills with drivers',
    permissions: {
      'fleet-management': false,
      'fleet-routes': true,
      'fleet-maintenance': false,
      'fleet-tracking': true,
      'fleet-vehicles': true,
      'fleet-drivers': true,
      'analytics-reports': true,
      'analytics-performance': true,
      'analytics-financial': false,
      'analytics-operational': true,
      'analytics-predictive': false,
      'compliance-dot': true,
      'compliance-safety': true,
      'compliance-audits': false,
      'compliance-certificates': false,
      'compliance-violations': true,
      'resources-university': true,
      'resources-documentation': true,
      'resources-training': true,
      'resources-support': true,
      'dispatch-central': true,
      'dispatch-loads': true,
      'dispatch-drivers': true,
      'broker-operations': false,
      'broker-customers': false,
      'broker-rates': false,
      'broker-quotes': false
    },
    contractorWorkflow: {
      sessionId: 'CWS-SJ-DC-2024014',
      status: 'active',
      currentStep: 5,
      totalSteps: 7,
      progressPercentage: 71,
      startedAt: '2024-01-20T09:00:00Z',
      steps: [
        { id: 'personal_info', name: 'Personal Information', status: 'completed', completedAt: '2024-01-20T09:05:00Z' },
        { id: 'experience_verification', name: 'Experience Verification', status: 'completed', completedAt: '2024-01-20T10:15:00Z' },
        { id: 'background_check', name: 'Background Check', status: 'completed', completedAt: '2024-01-21T14:30:00Z' },
        { id: 'contract_signing', name: 'Contract Signing', status: 'completed', completedAt: '2024-01-22T11:20:00Z' },
        { id: 'nda_signing', name: 'NDA Signing', status: 'completed', completedAt: '2024-01-22T11:25:00Z' },
        { id: 'training_completion', name: 'Training Modules', status: 'in_progress', startedAt: '2024-01-22T14:00:00Z' },
        { id: 'system_access_grant', name: 'Full System Access', status: 'pending' }
      ],
      documents: [
        { type: 'contractor_agreement', status: 'signed', signedAt: '2024-01-22T11:20:00Z' },
        { type: 'nda', status: 'signed', signedAt: '2024-01-22T11:25:00Z' },
        { type: 'w9', status: 'pending' }
      ],
      training: {
        required: ['Dispatch Fundamentals', 'Load Management', 'Driver Communication', 'Safety Protocols'],
        completed: ['Dispatch Fundamentals', 'Load Management'],
        inProgress: ['Driver Communication'],
        overallProgress: 75
      }
    }
  },
  {
    id: 'MW-BB-2024061',
    name: 'Mike Wilson',
    email: 'mike.wilson@fleetflowapp.com',
    phone: '(555) 345-6789',
    department: 'Brokerage',
    departmentCode: 'BB',
    position: 'Freight Broker',
    hiredDate: '2024-02-01',
    role: 'Independent Contractor - Broker',
    status: 'active',
    lastActive: '2024-01-15T11:20:00Z',
    systemAccess: {
      level: 'Broker Operations',
      accessCode: 'ACC-MW-BB',
      securityLevel: 'Level 4 - Broker',
      allowedSystems: ['Freight Marketplace', 'Load Boards', 'Customer Portal', 'Rate Management']
    },
    emergencyContact: {
      name: 'Jennifer Wilson',
      relation: 'Wife',
      phone: '(555) 765-4321',
      altPhone: '(555) 888-7777'
    },
    notes: '• Experienced freight broker with 8+ years in industry\n• Background check currently in progress\n• Specializes in refrigerated freight\n• Strong network of carrier relationships',
    permissions: {
      'fleet-management': false,
      'fleet-routes': true,
      'fleet-maintenance': false,
      'fleet-tracking': true,
      'fleet-vehicles': false,
      'fleet-drivers': false,
      'analytics-reports': true,
      'analytics-performance': false,
      'analytics-financial': true,
      'analytics-operational': true,
      'analytics-predictive': true,
      'compliance-dot': false,
      'compliance-safety': false,
      'compliance-audits': false,
      'compliance-certificates': false,
      'compliance-violations': false,
      'resources-university': true,
      'resources-documentation': true,
      'resources-training': true,
      'resources-support': true,
      'dispatch-central': true,
      'dispatch-loads': true,
      'dispatch-drivers': false,
      'broker-operations': true,
      'broker-customers': true,
      'broker-rates': true,
      'broker-quotes': true
    },
    contractorWorkflow: {
      sessionId: 'CWS-MW-BB-2024061',
      status: 'active',
      currentStep: 3,
      totalSteps: 7,
      progressPercentage: 43,
      startedAt: '2024-02-01T09:00:00Z',
      steps: [
        { id: 'personal_info', name: 'Personal Information', status: 'completed', completedAt: '2024-02-01T09:05:00Z' },
        { id: 'experience_verification', name: 'Experience Verification', status: 'completed', completedAt: '2024-02-01T10:15:00Z' },
        { id: 'background_check', name: 'Background Check', status: 'in_progress', startedAt: '2024-02-02T09:00:00Z' },
        { id: 'contract_signing', name: 'Contract Signing', status: 'pending' },
        { id: 'nda_signing', name: 'NDA Signing', status: 'pending' },
        { id: 'training_completion', name: 'Training Modules', status: 'pending' },
        { id: 'system_access_grant', name: 'Full System Access', status: 'pending' }
      ],
      documents: [
        { type: 'contractor_agreement', status: 'pending' },
        { type: 'nda', status: 'pending' },
        { type: 'w9', status: 'pending' }
      ],
      training: {
        required: ['Broker Fundamentals', 'Rate Negotiation', 'Customer Relations', 'Market Analysis'],
        completed: [],
        inProgress: [],
        overallProgress: 0
      }
    }
  },
  {
    id: 'JD-DC-2024015',
    name: 'John Davis',
    email: 'john.davis@fleetflowapp.com',
    phone: '(555) 456-7890',
    department: 'Dispatch',
    departmentCode: 'DC',
    position: 'Lead Dispatcher',
    hiredDate: '2024-01-25',
    role: 'Independent Contractor - Dispatcher',
    status: 'active',
    lastActive: '2024-01-15T14:15:00Z',
    systemAccess: {
      level: 'Senior Dispatch',
      accessCode: 'ACC-JD-DC',
      securityLevel: 'Level 4 - Senior Dispatcher',
      allowedSystems: ['Advanced Dispatch Console', 'Load Management', 'Route Optimization', 'Team Management']
    },
    emergencyContact: {
      name: 'Mary Davis',
      relation: 'Mother',
      phone: '(555) 654-3210',
      altPhone: '(555) 777-6666'
    },
    notes: '• Completed full contractor onboarding successfully\n• All training modules finished with excellent scores\n• Granted full system access\n• Team lead for night shift operations',
    permissions: {
      'fleet-management': false,
      'fleet-routes': true,
      'fleet-maintenance': false,
      'fleet-tracking': true,
      'fleet-vehicles': true,
      'fleet-drivers': true,
      'analytics-reports': true,
      'analytics-performance': true,
      'analytics-financial': false,
      'analytics-operational': true,
      'analytics-predictive': false,
      'compliance-dot': true,
      'compliance-safety': true,
      'compliance-audits': false,
      'compliance-certificates': false,
      'compliance-violations': true,
      'resources-university': true,
      'resources-documentation': true,
      'resources-training': true,
      'resources-support': true,
      'dispatch-central': true,
      'dispatch-loads': true,
      'dispatch-drivers': true,
      'broker-operations': false,
      'broker-customers': false,
      'broker-rates': false,
      'broker-quotes': false
    },
    contractorWorkflow: {
      sessionId: 'CWS-JD-DC-2024015',
      status: 'completed',
      currentStep: 7,
      totalSteps: 7,
      progressPercentage: 100,
      startedAt: '2024-01-25T09:00:00Z',
      completedAt: '2024-02-05T17:00:00Z',
      steps: [
        { id: 'personal_info', name: 'Personal Information', status: 'completed', completedAt: '2024-01-25T09:05:00Z' },
        { id: 'experience_verification', name: 'Experience Verification', status: 'completed', completedAt: '2024-01-25T10:15:00Z' },
        { id: 'background_check', name: 'Background Check', status: 'completed', completedAt: '2024-01-26T14:30:00Z' },
        { id: 'contract_signing', name: 'Contract Signing', status: 'completed', completedAt: '2024-01-27T11:20:00Z' },
        { id: 'nda_signing', name: 'NDA Signing', status: 'completed', completedAt: '2024-01-27T11:25:00Z' },
        { id: 'training_completion', name: 'Training Modules', status: 'completed', completedAt: '2024-02-03T16:30:00Z' },
        { id: 'system_access_grant', name: 'Full System Access', status: 'completed', completedAt: '2024-02-05T17:00:00Z' }
      ],
      documents: [
        { type: 'contractor_agreement', status: 'signed', signedAt: '2024-01-27T11:20:00Z' },
        { type: 'nda', status: 'signed', signedAt: '2024-01-27T11:25:00Z' },
        { type: 'w9', status: 'signed', signedAt: '2024-01-28T10:00:00Z' }
      ],
      training: {
        required: ['Advanced Dispatch', 'Load Coordination', 'Leadership Skills', 'Crisis Management'],
        completed: ['Advanced Dispatch', 'Load Coordination', 'Leadership Skills', 'Crisis Management'],
        inProgress: [],
        overallProgress: 100
      }
    }
  },
  {
    id: 'RL-DM-2024032',
    name: 'Robert Lopez',
    email: 'robert.lopez@fleetflowapp.com',
    phone: '(555) 567-8901',
    department: 'Driver Management',
    departmentCode: 'DM',
    position: 'Regional Driver',
    hiredDate: '2024-03-01',
    role: 'Company Driver',
    status: 'active',
    lastActive: '2024-01-15T08:30:00Z',
    systemAccess: {
      level: 'Driver Operations',
      accessCode: 'ACC-RL-DM',
      securityLevel: 'Level 2 - Driver',
      allowedSystems: ['Driver Portal', 'Load Tracking', 'Communication Hub', 'Vehicle Inspection']
    },
    emergencyContact: {
      name: 'Maria Lopez',
      relation: 'Wife',
      phone: '(555) 890-1234',
      altPhone: '(555) 321-6543'
    },
    notes: '• Experienced regional driver with clean record\n• FMCSA verification completed successfully\n• Vehicle assignment: Truck #147 with 53ft dry van\n• Preferred routes: East Coast corridors',
    permissions: {
      'fleet-management': false,
      'fleet-routes': true,
      'fleet-maintenance': false,
      'fleet-tracking': true,
      'fleet-vehicles': false,
      'fleet-drivers': false,
      'analytics-reports': false,
      'analytics-performance': false,
      'analytics-financial': false,
      'analytics-operational': false,
      'analytics-predictive': false,
      'compliance-dot': true,
      'compliance-safety': true,
      'compliance-audits': false,
      'compliance-certificates': true,
      'compliance-violations': false,
      'resources-university': true,
      'resources-documentation': true,
      'resources-training': true,
      'resources-support': true,
      'dispatch-central': false,
      'dispatch-loads': false,
      'dispatch-drivers': false,
      'broker-operations': false,
      'broker-customers': false,
      'broker-rates': false,
      'broker-quotes': false
    },
    carrierWorkflow: {
      sessionId: 'COS-RL-DM-2024032',
      status: 'active',
      currentStep: 4,
      totalSteps: 5,
      progressPercentage: 80,
      startedAt: '2024-03-01T09:00:00Z',
      steps: [
        { id: 'fmcsa_verification', name: 'FMCSA Verification', status: 'completed', completedAt: '2024-03-01T10:30:00Z' },
        { id: 'document_upload', name: 'Document Upload', status: 'completed', completedAt: '2024-03-02T14:20:00Z' },
        { id: 'factoring_setup', name: 'Factoring Setup', status: 'completed', completedAt: '2024-03-03T11:15:00Z' },
        { id: 'agreement_signing', name: 'Agreement Signing', status: 'completed', completedAt: '2024-03-04T09:45:00Z' },
        { id: 'portal_setup', name: 'Portal Setup', status: 'in_progress', startedAt: '2024-03-04T10:00:00Z' }
      ],
      documents: [
        { type: 'cdl_license', status: 'verified', signedAt: '2024-03-01T10:30:00Z' },
        { type: 'dot_medical', status: 'verified', signedAt: '2024-03-01T10:30:00Z' },
        { type: 'carrier_agreement', status: 'signed', signedAt: '2024-03-04T09:45:00Z' },
        { type: 'insurance_certificate', status: 'verified', signedAt: '2024-03-02T14:20:00Z' }
      ],
      vehicleAssignment: {
        truckNumber: '147',
        trailerType: '53ft Dry Van',
        assignedAt: '2024-03-04T15:30:00Z',
        status: 'active'
      },
      compliance: {
        dotNumber: 'DOT-3847291',
        mcNumber: 'MC-875439',
        saferScore: 85,
        lastInspection: '2024-02-28T14:00:00Z'
      }
    }
  },
  {
    id: 'AS-DM-2024028',
    name: 'Angela Smith',
    email: 'angela.smith@fleetflowapp.com',
    phone: '(555) 678-9012',
    department: 'Driver Management',
    departmentCode: 'DM',
    position: 'Owner Operator',
    hiredDate: '2024-02-28',
    role: 'Independent Contractor Driver',
    status: 'active',
    lastActive: '2024-01-15T16:45:00Z',
    systemAccess: {
      level: 'Owner Operator',
      accessCode: 'ACC-AS-DM',
      securityLevel: 'Level 3 - Owner Operator',
      allowedSystems: ['Advanced Driver Portal', 'Load Management', 'Settlement Tracking', 'Maintenance Records']
    },
    emergencyContact: {
      name: 'David Smith',
      relation: 'Brother',
      phone: '(555) 789-0123',
      altPhone: '(555) 456-7890'
    },
    notes: '• Owner operator with own equipment (2022 Peterbilt 579)\n• Carrier onboarding completed successfully\n• Specializes in high-value freight\n• Excellent safety rating and compliance record',
    permissions: {
      'fleet-management': false,
      'fleet-routes': true,
      'fleet-maintenance': true,
      'fleet-tracking': true,
      'fleet-vehicles': false,
      'fleet-drivers': false,
      'analytics-reports': true,
      'analytics-performance': true,
      'analytics-financial': false,
      'analytics-operational': false,
      'analytics-predictive': false,
      'compliance-dot': true,
      'compliance-safety': true,
      'compliance-audits': true,
      'compliance-certificates': true,
      'compliance-violations': true,
      'resources-university': true,
      'resources-documentation': true,
      'resources-training': true,
      'resources-support': true,
      'dispatch-central': false,
      'dispatch-loads': false,
      'dispatch-drivers': false,
      'broker-operations': false,
      'broker-customers': false,
      'broker-rates': false,
      'broker-quotes': false
    },
    carrierWorkflow: {
      sessionId: 'COS-AS-DM-2024028',
      status: 'completed',
      currentStep: 5,
      totalSteps: 5,
      progressPercentage: 100,
      startedAt: '2024-02-28T09:00:00Z',
      completedAt: '2024-03-05T17:00:00Z',
      steps: [
        { id: 'fmcsa_verification', name: 'FMCSA Verification', status: 'completed', completedAt: '2024-02-28T11:30:00Z' },
        { id: 'document_upload', name: 'Document Upload', status: 'completed', completedAt: '2024-03-01T15:20:00Z' },
        { id: 'factoring_setup', name: 'Factoring Setup', status: 'completed', completedAt: '2024-03-02T10:15:00Z' },
        { id: 'agreement_signing', name: 'Agreement Signing', status: 'completed', completedAt: '2024-03-03T14:45:00Z' },
        { id: 'portal_setup', name: 'Portal Setup', status: 'completed', completedAt: '2024-03-05T17:00:00Z' }
      ],
      documents: [
        { type: 'cdl_license', status: 'verified', signedAt: '2024-02-28T11:30:00Z' },
        { type: 'dot_medical', status: 'verified', signedAt: '2024-02-28T11:30:00Z' },
        { type: 'carrier_agreement', status: 'signed', signedAt: '2024-03-03T14:45:00Z' },
        { type: 'insurance_certificate', status: 'verified', signedAt: '2024-03-01T15:20:00Z' }
      ],
      vehicleAssignment: {
        truckNumber: 'OO-AS-001',
        trailerType: 'Owner Equipment',
        assignedAt: '2024-03-05T17:00:00Z',
        status: 'active'
      },
      compliance: {
        dotNumber: 'DOT-9847532',
        mcNumber: 'MC-927156',
        saferScore: 92,
        lastInspection: '2024-02-25T09:00:00Z'
      }
    }
  }
];

// Permission categories with hierarchical sub-pages and granular section permissions
const permissionCategories = {
  operations: {
    name: 'OPERATIONS',
    icon: '🚛',
    color: '#3b82f6',
    subPages: {
      'dispatch-central': {
        name: 'Dispatch Central',
        icon: '🎯',
        sections: [
          'dispatch-header-stats',
          'dispatch-communication-hub',
          'dispatch-dashboard-tab',
          'dispatch-dashboard-stats',
          'dispatch-load-management-tab',
          'dispatch-general-loadboard',
          'dispatch-live-tracking-tab',
          'dispatch-tracking-dashboard',
          'dispatch-invoices-tab',
          'dispatch-invoice-management',
          'dispatch-notifications-tab',
          'dispatch-invoice-creation'
        ]
      },
      'broker-box': {
        name: 'Broker Agent Portal',
        icon: '👤',
        sections: [
          'broker-dashboard-overview',
          'broker-customer-management',
          'broker-rate-negotiations',
          'broker-quote-generation',
          'broker-load-posting',
          'broker-carrier-network',
          'broker-financial-tracking',
          'broker-performance-metrics'
        ]
      },
      'freightflow-rfx': {
        name: 'FreightFlow RFx',
        icon: '💼',
        sections: [
          'rfx-request-management',
          'rfx-bid-evaluation',
          'rfx-supplier-network',
          'rfx-contract-management',
          'rfx-analytics-reporting',
          'rfx-approval-workflow'
        ]
      },
      'routes': {
        name: 'Routes',
        icon: '🗺️',
        sections: [
          'routes-planning-interface',
          'routes-optimization-engine',
          'routes-real-time-tracking',
          'routes-performance-analytics',
          'routes-fuel-optimization',
          'routes-driver-assignments',
          'routes-schedule-management',
          'routes-weather-integration',
          'routes-traffic-monitoring',
          'routes-cost-analysis'
        ]
      },
      'live-load-tracking': {
        name: 'Live Load Tracking',
        icon: '📍',
        sections: [
          'tracking-real-time-map',
          'tracking-status-updates',
          'tracking-eta-calculations',
          'tracking-notifications',
          'tracking-shipper-portal',
          'tracking-driver-communications',
          'tracking-alerts-system',
          'tracking-history-logs'
        ]
      }
    }
  },
  'driver-management': {
    name: 'DRIVER MANAGEMENT',
    icon: '👥',
    color: '#f4a832',
    subPages: {
      'fleet-drivers': {
        name: 'Fleet Drivers',
        icon: '🚗',
        sections: [
          'drivers-profile-management',
          'drivers-onboarding-process',
          'drivers-performance-tracking',
          'drivers-schedule-management',
          'drivers-qualification-verification',
          'drivers-training-assignments',
          'drivers-violation-management',
          'drivers-communication-hub',
          'drivers-document-management',
          'drivers-payroll-integration'
        ]
      },
      'driver-portal': {
        name: 'Driver Portal',
        icon: '🎯',
        sections: [
          'portal-dashboard-access',
          'portal-load-assignments',
          'portal-schedule-viewing',
          'portal-document-upload',
          'portal-training-modules',
          'portal-performance-metrics',
          'portal-communication-tools'
        ]
      }
    }
  },
  fleetflow: {
    name: 'FLEETFLOW',
    icon: '🎯',
    color: '#14b8a6',
    subPages: {
      'fleet-management': {
        name: 'Fleet Management',
        icon: '🚛',
        sections: [
          'fleet-overview-dashboard',
          'fleet-vehicle-inventory',
          'fleet-maintenance-scheduling',
          'fleet-fuel-management',
          'fleet-insurance-tracking',
          'fleet-compliance-monitoring',
          'fleet-cost-analysis',
          'fleet-utilization-metrics',
          'fleet-asset-tracking',
          'fleet-replacement-planning',
          'fleet-vendor-management',
          'fleet-warranty-tracking'
        ]
      },
      'vehicles': {
        name: 'Vehicles',
        icon: '🚚',
        sections: [
          'vehicles-inventory-management',
          'vehicles-inspection-tracking',
          'vehicles-maintenance-history',
          'vehicles-fuel-efficiency',
          'vehicles-registration-docs',
          'vehicles-insurance-records',
          'vehicles-telematics-data',
          'vehicles-cost-tracking'
        ]
      },
      'maintenance': {
        name: 'Maintenance',
        icon: '🔧',
        sections: [
          'maintenance-scheduling-system',
          'maintenance-work-orders',
          'maintenance-vendor-management',
          'maintenance-parts-inventory',
          'maintenance-cost-tracking',
          'maintenance-preventive-alerts',
          'maintenance-history-reports',
          'maintenance-warranty-claims'
        ]
      }
    }
  },
  analytics: {
    name: 'ANALYTICS',
    icon: '📊',
    color: '#6366f1',
    subPages: {
      'reports': {
        name: 'Reports',
        icon: '📈',
        sections: [
          'reports-generation-tools',
          'reports-custom-dashboards',
          'reports-scheduled-delivery',
          'reports-export-functions',
          'reports-data-filtering',
          'reports-visualization-options',
          'reports-sharing-permissions',
          'reports-archive-management'
        ]
      },
      'performance': {
        name: 'Performance',
        icon: '⚡',
        sections: [
          'performance-kpi-tracking',
          'performance-driver-metrics',
          'performance-fleet-efficiency',
          'performance-cost-analysis',
          'performance-benchmarking',
          'performance-trend-analysis',
          'performance-predictive-analytics',
          'performance-alert-system'
        ]
      },
      'financials': {
        name: 'Financials',
        icon: '💰',
        sections: [
          'financials-profit-loss',
          'financials-cost-centers',
          'financials-revenue-tracking',
          'financials-expense-management',
          'financials-budget-planning',
          'financials-cash-flow',
          'financials-tax-reporting',
          'financials-audit-trails'
        ]
      }
    }
  },
  compliance: {
    name: 'COMPLIANCE',
    icon: '✅',
    color: '#dc2626',
    subPages: {
      'dot-compliance': {
        name: 'DOT Compliance',
        icon: '🛡️',
        sections: [
          'dot-hours-service',
          'dot-driver-qualification',
          'dot-vehicle-inspection',
          'dot-drug-testing',
          'dot-safety-ratings',
          'dot-violation-management',
          'dot-audit-preparation',
          'dot-record-keeping'
        ]
      },
      'safety': {
        name: 'Safety',
        icon: '⚠️',
        sections: [
          'safety-incident-reporting',
          'safety-training-programs',
          'safety-policy-management',
          'safety-risk-assessment',
          'safety-inspection-schedules',
          'safety-violation-tracking',
          'safety-performance-metrics',
          'safety-emergency-procedures'
        ]
      },
      'certificates': {
        name: 'Certificates',
        icon: '📋',
        sections: [
          'certificates-driver-licenses',
          'certificates-medical-cards',
          'certificates-endorsements',
          'certificates-training-certs',
          'certificates-vehicle-registrations',
          'certificates-insurance-docs',
          'certificates-expiration-alerts',
          'certificates-renewal-tracking'
        ]
      }
    }
  },
  resources: {
    name: 'RESOURCES',
    icon: '📚',
    color: '#f97316',
    subPages: {
      'fleetflow-university': {
        name: 'FleetFlow University',
        icon: '🎓',
        sections: [
          'university-course-catalog',
          'university-enrollment-management',
          'university-progress-tracking',
          'university-certification-programs',
          'university-instructor-tools',
          'university-content-library',
          'university-assessment-tools',
          'university-reporting-analytics'
        ]
      },
      'documentation': {
        name: 'Documentation',
        icon: '📄',
        sections: [
          'docs-policy-manuals',
          'docs-procedure-guides',
          'docs-training-materials',
          'docs-compliance-templates',
          'docs-version-control',
          'docs-search-functionality',
          'docs-access-permissions',
          'docs-update-notifications'
        ]
      },
      'support': {
        name: 'Support',
        icon: '🎧',
        sections: [
          'support-ticket-system',
          'support-knowledge-base',
          'support-chat-assistance',
          'support-phone-support',
          'support-remote-assistance',
          'support-escalation-management',
          'support-feedback-collection',
          'support-resolution-tracking'
        ]
      }
    }
  }
};

// Utility functions
const getDepartmentColor = (code: string) => {
  switch (code) {
    case 'MGR': return '#f97316';
    case 'DC': return '#f4a832';
    case 'BB': return '#6366f1';
    case 'DM': return '#eab308';
    default: return '#6b7280';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusIcon = (status: string) => {
  return status === 'active' ? '🟢' : status === 'pending' ? '🟡' : '🔴';
};

const getWorkflowStepIcon = (status: string) => {
  switch (status) {
    case 'completed': return '✅';
    case 'in_progress': return '⏳';
    case 'pending': return '⭕';
    default: return '⭕';
  }
};

const getDocumentStatusIcon = (status: string) => {
  switch (status) {
    case 'signed': return '✅';
    case 'verified': return '✅';
    case 'sent': return '📤';
    case 'pending': return '⏳';
    default: return '❌';
  }
};

const getPermissionDisplayName = (permission: string) => {
  const permissionLabels: {[key: string]: string} = {
    // OPERATIONS - Dispatch Central Sections
    'dispatch-header-stats': 'Header & Stats Section',
    'dispatch-communication-hub': 'Communication Hub',
    'dispatch-dashboard-tab': 'Dashboard Tab Access',
    'dispatch-dashboard-stats': 'Dashboard Statistics Grid',
    'dispatch-load-management-tab': 'Load Management Tab',
    'dispatch-general-loadboard': 'General Loadboard Section',
    'dispatch-live-tracking-tab': 'Live Tracking Tab',
    'dispatch-tracking-dashboard': 'Tracking Dashboard Section',
    'dispatch-invoices-tab': 'Invoices Tab Access',
    'dispatch-invoice-management': 'Invoice Management Section',
    'dispatch-notifications-tab': 'Notifications Tab Access',
    'dispatch-invoice-creation': 'Invoice Creation Modal',

    // OPERATIONS - Broker Box Sections
    'broker-dashboard-overview': 'Agent Dashboard Overview',
    'broker-customer-management': 'Agent Customer Management',
    'broker-rate-negotiations': 'Agent Rate Negotiations',
    'broker-quote-generation': 'Agent Quote Generation',
    'broker-load-posting': 'Agent Load Posting',
    'broker-carrier-network': 'Agent Carrier Network',
    'broker-financial-tracking': 'Agent Financial Tracking',
    'broker-performance-metrics': 'Agent Performance Metrics',

    // OPERATIONS - FreightFlow RFx Sections
    'rfx-request-management': 'Request Management',
    'rfx-bid-evaluation': 'Bid Evaluation',
    'rfx-supplier-network': 'Supplier Network',
    'rfx-contract-management': 'Contract Management',
    'rfx-analytics-reporting': 'Analytics & Reporting',
    'rfx-approval-workflow': 'Approval Workflow',

    // OPERATIONS - Routes Sections
    'routes-planning-interface': 'Planning Interface',
    'routes-optimization-engine': 'Optimization Engine',
    'routes-real-time-tracking': 'Real-Time Tracking',
    'routes-performance-analytics': 'Performance Analytics',
    'routes-fuel-optimization': 'Fuel Optimization',
    'routes-driver-assignments': 'Driver Assignments',
    'routes-schedule-management': 'Schedule Management',
    'routes-weather-integration': 'Weather Integration',
    'routes-traffic-monitoring': 'Traffic Monitoring',
    'routes-cost-analysis': 'Cost Analysis',

    // OPERATIONS - Live Load Tracking Sections
    'tracking-real-time-map': 'Real-Time Map',
    'tracking-status-updates': 'Status Updates',
    'tracking-eta-calculations': 'ETA Calculations',
    'tracking-notifications': 'Tracking Notifications',
    'tracking-shipper-portal': 'Shipper Portal',
    'tracking-driver-communications': 'Driver Communications',
    'tracking-alerts-system': 'Alerts System',
    'tracking-history-logs': 'History Logs',

    // DRIVER MANAGEMENT - Fleet Drivers Sections
    'drivers-profile-management': 'Profile Management',
    'drivers-onboarding-process': 'Onboarding Process',
    'drivers-performance-tracking': 'Performance Tracking',
    'drivers-schedule-management': 'Schedule Management',
    'drivers-qualification-verification': 'Qualification Verification',
    'drivers-training-assignments': 'Training Assignments',
    'drivers-violation-management': 'Violation Management',
    'drivers-communication-hub': 'Communication Hub',
    'drivers-document-management': 'Document Management',
    'drivers-payroll-integration': 'Payroll Integration',

    // DRIVER MANAGEMENT - Driver Portal Sections
    'portal-dashboard-access': 'Dashboard Access',
    'portal-load-assignments': 'Load Assignments',
    'portal-schedule-viewing': 'Schedule Viewing',
    'portal-document-upload': 'Document Upload',
    'portal-training-modules': 'Training Modules',
    'portal-performance-metrics': 'Performance Metrics',
    'portal-communication-tools': 'Communication Tools',

    // FLEETFLOW - Fleet Management Sections
    'fleet-overview-dashboard': 'Overview Dashboard',
    'fleet-vehicle-inventory': 'Vehicle Inventory',
    'fleet-maintenance-scheduling': 'Maintenance Scheduling',
    'fleet-fuel-management': 'Fuel Management',
    'fleet-insurance-tracking': 'Insurance Tracking',
    'fleet-compliance-monitoring': 'Compliance Monitoring',
    'fleet-cost-analysis': 'Cost Analysis',
    'fleet-utilization-metrics': 'Utilization Metrics',
    'fleet-asset-tracking': 'Asset Tracking',
    'fleet-replacement-planning': 'Replacement Planning',
    'fleet-vendor-management': 'Vendor Management',
    'fleet-warranty-tracking': 'Warranty Tracking',

    // FLEETFLOW - Vehicles Sections
    'vehicles-inventory-management': 'Inventory Management',
    'vehicles-inspection-tracking': 'Inspection Tracking',
    'vehicles-maintenance-history': 'Maintenance History',
    'vehicles-fuel-efficiency': 'Fuel Efficiency',
    'vehicles-registration-docs': 'Registration Documents',
    'vehicles-insurance-records': 'Insurance Records',
    'vehicles-telematics-data': 'Telematics Data',
    'vehicles-cost-tracking': 'Cost Tracking',

    // FLEETFLOW - Maintenance Sections
    'maintenance-scheduling-system': 'Scheduling System',
    'maintenance-work-orders': 'Work Orders',
    'maintenance-vendor-management': 'Vendor Management',
    'maintenance-parts-inventory': 'Parts Inventory',
    'maintenance-cost-tracking': 'Cost Tracking',
    'maintenance-preventive-alerts': 'Preventive Alerts',
    'maintenance-history-reports': 'History Reports',
    'maintenance-warranty-claims': 'Warranty Claims',

    // ANALYTICS - Reports Sections
    'reports-generation-tools': 'Generation Tools',
    'reports-custom-dashboards': 'Custom Dashboards',
    'reports-scheduled-delivery': 'Scheduled Delivery',
    'reports-export-functions': 'Export Functions',
    'reports-data-filtering': 'Data Filtering',
    'reports-visualization-options': 'Visualization Options',
    'reports-sharing-permissions': 'Sharing Permissions',
    'reports-archive-management': 'Archive Management',

    // ANALYTICS - Performance Sections
    'performance-kpi-tracking': 'KPI Tracking',
    'performance-driver-metrics': 'Driver Metrics',
    'performance-fleet-efficiency': 'Fleet Efficiency',
    'performance-cost-analysis': 'Cost Analysis',
    'performance-benchmarking': 'Benchmarking',
    'performance-trend-analysis': 'Trend Analysis',
    'performance-predictive-analytics': 'Predictive Analytics',
    'performance-alert-system': 'Alert System',

    // ANALYTICS - Financials Sections
    'financials-profit-loss': 'Profit & Loss',
    'financials-cost-centers': 'Cost Centers',
    'financials-revenue-tracking': 'Revenue Tracking',
    'financials-expense-management': 'Expense Management',
    'financials-budget-planning': 'Budget Planning',
    'financials-cash-flow': 'Cash Flow',
    'financials-tax-reporting': 'Tax Reporting',
    'financials-audit-trails': 'Audit Trails',

    // COMPLIANCE - DOT Compliance Sections
    'dot-hours-service': 'Hours of Service',
    'dot-driver-qualification': 'Driver Qualification',
    'dot-vehicle-inspection': 'Vehicle Inspection',
    'dot-drug-testing': 'Drug Testing',
    'dot-safety-ratings': 'Safety Ratings',
    'dot-violation-management': 'Violation Management',
    'dot-audit-preparation': 'Audit Preparation',
    'dot-record-keeping': 'Record Keeping',

    // COMPLIANCE - Safety Sections
    'safety-incident-reporting': 'Incident Reporting',
    'safety-training-programs': 'Training Programs',
    'safety-policy-management': 'Policy Management',
    'safety-risk-assessment': 'Risk Assessment',
    'safety-inspection-schedules': 'Inspection Schedules',
    'safety-violation-tracking': 'Violation Tracking',
    'safety-performance-metrics': 'Performance Metrics',
    'safety-emergency-procedures': 'Emergency Procedures',

    // COMPLIANCE - Certificates Sections
    'certificates-driver-licenses': 'Driver Licenses',
    'certificates-medical-cards': 'Medical Cards',
    'certificates-endorsements': 'Endorsements',
    'certificates-training-certs': 'Training Certificates',
    'certificates-vehicle-registrations': 'Vehicle Registrations',
    'certificates-insurance-docs': 'Insurance Documents',
    'certificates-expiration-alerts': 'Expiration Alerts',
    'certificates-renewal-tracking': 'Renewal Tracking',

    // RESOURCES - FleetFlow University Sections
    'university-course-catalog': 'Course Catalog',
    'university-enrollment-management': 'Enrollment Management',
    'university-progress-tracking': 'Progress Tracking',
    'university-certification-programs': 'Certification Programs',
    'university-instructor-tools': 'Instructor Tools',
    'university-content-library': 'Content Library',
    'university-assessment-tools': 'Assessment Tools',
    'university-reporting-analytics': 'Reporting & Analytics',

    // RESOURCES - Documentation Sections
    'docs-policy-manuals': 'Policy Manuals',
    'docs-procedure-guides': 'Procedure Guides',
    'docs-training-materials': 'Training Materials',
    'docs-compliance-templates': 'Compliance Templates',
    'docs-version-control': 'Version Control',
    'docs-search-functionality': 'Search Functionality',
    'docs-access-permissions': 'Access Permissions',
    'docs-update-notifications': 'Update Notifications',

    // RESOURCES - Support Sections
    'support-ticket-system': 'Ticket System',
    'support-knowledge-base': 'Knowledge Base',
    'support-chat-assistance': 'Chat Assistance',
    'support-phone-support': 'Phone Support',
    'support-remote-assistance': 'Remote Assistance',
    'support-escalation-management': 'Escalation Management',
    'support-feedback-collection': 'Feedback Collection',
    'support-resolution-tracking': 'Resolution Tracking'
  };

  return permissionLabels[permission] || permission.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default function UserManagement() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPermissionCategory, setExpandedPermissionCategory] = useState<string | null>(null);
  const [expandedSubPages, setExpandedSubPages] = useState<{[key: string]: boolean}>({});
  const [userPermissions, setUserPermissions] = useState<{[key: string]: boolean}>({});

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = filteredUsers[currentUserIndex];

  // Initialize user permissions from current user
  useEffect(() => {
    if (currentUser?.permissions) {
      setUserPermissions(currentUser.permissions as {[key: string]: boolean});
    }
  }, [currentUser]);

  const isDriver = currentUser?.departmentCode === 'DM';
  const workflow = isDriver ? (currentUser as any)?.carrierWorkflow : (currentUser as any)?.contractorWorkflow;

  const toggleSubPage = (subPageKey: string) => {
    setExpandedSubPages(prev => ({
      ...prev,
      [subPageKey]: !prev[subPageKey]
    }));
  };

  const toggleGrantAllSubPage = (subPageKey: string, sections: string[]) => {
    const currentGranted = sections.filter(section => userPermissions[section]).length;
    const allGranted = currentGranted === sections.length;

    // If all are granted, deny all. Otherwise, grant all
    const newPermissions = { ...userPermissions };

    sections.forEach(section => {
      newPermissions[section] = !allGranted;
    });

    setUserPermissions(newPermissions);

    // Here you would typically save to database
    console.log(`Updated permissions for ${subPageKey}:`, newPermissions);
  };

  const toggleSectionPermission = (sectionKey: string) => {
    const newPermissions = {
      ...userPermissions,
      [sectionKey]: !userPermissions[sectionKey]
    };

    setUserPermissions(newPermissions);

    // Here you would typically save to database
    console.log(`Toggled ${sectionKey} to ${newPermissions[sectionKey]}`);
  };

  const savePermissions = () => {
    // Here you would save to database
    console.log('Saving permissions:', userPermissions);
    alert('Permissions saved successfully!');
  };

  const hasUnsavedChanges = () => {
    if (!currentUser?.permissions) return false;
    const originalPermissions = currentUser.permissions as {[key: string]: boolean};
    return JSON.stringify(originalPermissions) !== JSON.stringify(userPermissions);
  };

  if (!currentUser) {
    return (
      <div style={{
        background: 'radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #667eea 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '80px 20px 20px 20px'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>No users found matching search criteria.</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #667eea 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px'
            }}>👥 User Management</h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              Comprehensive user dashboard with detailed permissions & workflow tracking
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '12px',
                outline: 'none',
                width: '200px'
              }}
            />
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              🔄 Refresh
            </button>
            <button style={{
              background: 'rgba(16, 185, 129, 0.8)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              ➕ Add User
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>

          {/* User Navigation */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>

            {/* User Avatar Card */}
            <div style={{
              background: `${getDepartmentColor(currentUser?.departmentCode)}20`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: `2px solid ${getDepartmentColor(currentUser?.departmentCode)}66`,
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: getDepartmentColor(currentUser?.departmentCode),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: 'white',
                margin: '0 auto 16px',
                fontWeight: 'bold'
              }}>
                {currentUser?.name.split(' ').map(n => n[0]).join('')}
              </div>

              <h3 style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>
                {currentUser?.name}
              </h3>

              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                {currentUser?.position}
              </div>

              <div style={{
                background: currentUser?.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: currentUser?.status === 'active' ? '#dc2626' : '#14b8a6',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                <span>{getStatusIcon(currentUser?.status)}</span> {currentUser?.status.toUpperCase()}
              </div>
            </div>

            {/* Navigation Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setCurrentUserIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ← Previous
              </button>

              <span style={{ color: 'white', fontSize: '14px' }}>
                {currentUserIndex + 1} of {filteredUsers.length}
              </span>

              <button
                onClick={() => setCurrentUserIndex((prev) => (prev + 1) % filteredUsers.length)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Next →
              </button>
            </div>

            {/* Page Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {filteredUsers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentUserIndex(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: index === currentUserIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* User Details Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>

            {/* Account Details */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{
                color: 'white',
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                👤 Account Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    <strong>Email:</strong> {currentUser?.email}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    <strong>Phone:</strong> {currentUser?.phone}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Department:</strong> {currentUser?.department}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    <strong>Security Level:</strong> {(currentUser as any)?.systemAccess?.securityLevel}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                    <strong>User ID:</strong> {currentUser?.id}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Hired:</strong> {formatDate(currentUser?.hiredDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{
                color: 'white',
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                🆘 Emergency Contact
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                    <strong>Name:</strong> {(currentUser as any)?.emergencyContact?.name}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Relation:</strong> {(currentUser as any)?.emergencyContact?.relation}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                    <strong>Phone:</strong> {(currentUser as any)?.emergencyContact?.phone}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Alt Phone:</strong> {(currentUser as any)?.emergencyContact?.altPhone}
                  </div>
                </div>
              </div>
            </div>

            {/* EXPANDABLE KPI Access Granting System */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{
                color: 'white',
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>🔐 Access Granting System</span>
                {hasUnsavedChanges() && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '10px',
                      color: '#fbbf24',
                      fontWeight: '600'
                    }}>
                      ⚠️ Unsaved Changes
                    </span>
                    <button
                      onClick={savePermissions}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                )}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {Object.entries(permissionCategories).map(([categoryKey, category]) => {
                  // Calculate total sections across all sub-pages
                  const totalSections = Object.values(category.subPages).reduce((total, subPage) => total + subPage.sections.length, 0);
                  const grantedSections = Object.values(category.subPages).reduce((granted, subPage) => {
                    return granted + subPage.sections.filter((section: string) => userPermissions[section]).length;
                  }, 0);
                  const isExpanded = expandedPermissionCategory === categoryKey;

                  return (
                    <div
                      key={categoryKey}
                      onClick={() => setExpandedPermissionCategory(isExpanded ? null : categoryKey)}
                      style={{
                        background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                        border: `1px solid ${category.color}`,
                        cursor: 'pointer',
                        transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        boxShadow: isExpanded ? `0 4px 12px ${category.color}40` : 'none'
                      }}
                    >
                      <div style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '11px',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        {category.icon} {category.name}
                        <span style={{ fontSize: '8px' }}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: '600'
                      }}>
                        {grantedSections}/{totalSections} GRANTED
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expanded Permission Details with Hierarchical Sub-Pages */}
              {expandedPermissionCategory && (
                <div style={{
                  background: `linear-gradient(135deg, ${(permissionCategories as any)[expandedPermissionCategory].color}20, ${(permissionCategories as any)[expandedPermissionCategory].color}10)`,
                  border: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}60`,
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '12px'
                }}>
                  <h5 style={{
                    color: 'white',
                    margin: '0 0 16px 0',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {(permissionCategories as any)[expandedPermissionCategory].icon} {(permissionCategories as any)[expandedPermissionCategory].name} - Access Control
                  </h5>

                  {/* Sub-Pages with Retractable Sections */}
                  {Object.entries((permissionCategories as any)[expandedPermissionCategory].subPages).map(([subPageKey, subPage]: [string, any]) => {
                    const isSubPageExpanded = expandedSubPages[`${expandedPermissionCategory}-${subPageKey}`];
                    const grantedInSubPage = subPage.sections.filter((section: string) => userPermissions[section]).length;
                    const allGranted = grantedInSubPage === subPage.sections.length;

                    return (
                      <div key={subPageKey} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}40`,
                        borderRadius: '6px',
                        marginBottom: '12px',
                        overflow: 'hidden'
                      }}>
                        {/* Sub-Page Header */}
                        <div
                          onClick={() => toggleSubPage(`${expandedPermissionCategory}-${subPageKey}`)}
                          style={{
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isSubPageExpanded ? `${(permissionCategories as any)[expandedPermissionCategory].color}20` : 'transparent',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {subPage.icon} {subPage.name}
                            <span style={{
                              fontSize: '8px',
                              background: allGranted ? '#10b981' : grantedInSubPage > 0 ? '#f59e0b' : '#6b7280',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {grantedInSubPage}/{subPage.sections.length}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            {isSubPageExpanded ? '▼' : '▶'}
                          </div>
                        </div>

                        {/* Expanded Sub-Page Sections */}
                        {isSubPageExpanded && (
                          <div style={{
                            padding: '16px',
                            background: 'rgba(0, 0, 0, 0.1)',
                            borderTop: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}30`
                          }}>
                            {/* Grant All Toggle */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: `${(permissionCategories as any)[expandedPermissionCategory].color}20`,
                              borderRadius: '4px',
                              marginBottom: '12px',
                              border: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}50`
                            }}>
                              <div style={{
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: '700'
                              }}>
                                🎯 Grant All {subPage.name} Access
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGrantAllSubPage(`${expandedPermissionCategory}-${subPageKey}`, subPage.sections);
                                }}
                                style={{
                                  background: allGranted ? '#10b981' : '#6b7280',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '9px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {allGranted ? '✅ ALL GRANTED' : '❌ GRANT ALL'}
                              </button>
                            </div>

                            {/* Individual Section Toggles */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                              gap: '8px'
                            }}>
                              {subPage.sections.map((section: string) => {
                                const hasAccess = userPermissions[section];

                                return (
                                  <div
                                    key={section}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSectionPermission(section);
                                    }}
                                    style={{
                                      background: hasAccess
                                        ? `${(permissionCategories as any)[expandedPermissionCategory].color}30`
                                        : 'rgba(107, 114, 128, 0.2)',
                                      border: `1px solid ${hasAccess
                                        ? (permissionCategories as any)[expandedPermissionCategory].color
                                        : '#6b7280'}66`,
                                      borderRadius: '4px',
                                      padding: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <div style={{
                                      color: 'white',
                                      fontSize: '9px',
                                      fontWeight: '600'
                                    }}>
                                      {getPermissionDisplayName(section)}
                                    </div>
                                    <div style={{
                                      fontSize: '8px',
                                      fontWeight: 'bold',
                                      color: hasAccess ? '#10b981' : '#ef4444'
                                    }}>
                                      {hasAccess ? '✅' : '❌'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{
                color: 'white',
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                📝 Notes
              </h4>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.4',
                whiteSpace: 'pre-line'
              }}>
                {(currentUser as any)?.notes}
              </div>
            </div>

            {/* COMPREHENSIVE WORKFLOW TRACKING - 5-7 Step Process Checklist */}
            {workflow && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  {isDriver ? '🚛 Carrier Onboarding Progress' : '🤝 Contractor Onboarding Progress'}
                </h4>

                {/* Overall Progress Summary */}
                <div style={{
                  background: workflow?.status === 'completed'
                    ? 'linear-gradient(135deg, #dc2626, #059669)'
                    : 'linear-gradient(135deg, #eab308, #ca8a04)',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: `1px solid ${workflow?.status === 'completed' ? '#dc2626' : '#fbbf24'}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <h5 style={{
                      color: 'white',
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      📋 Overall Progress ({workflow?.status?.toUpperCase()})
                    </h5>
                    <span style={{
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {workflow?.progressPercentage}%
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      height: '100%',
                      width: `${workflow?.progressPercentage}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* DETAILED STEP-BY-STEP CHECKLIST */}
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{
                    color: 'white',
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    📝 Step-by-Step Checklist
                  </h5>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {workflow?.steps?.map((step: any) => (
                      <div key={step.id} style={{
                        background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                                   step.status === 'in_progress' ? 'rgba(251, 191, 36, 0.2)' :
                                   'rgba(107, 114, 128, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        border: `1px solid ${
                          step.status === 'completed' ? '#dc2626' :
                          step.status === 'in_progress' ? '#fbbf24' :
                          '#6b7280'
                        }66`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '14px' }}>
                          {getWorkflowStepIcon(step.status)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '12px'
                          }}>
                            {step.name}
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '10px'
                          }}>
                            {step.status}{step.completedAt && ` • ${formatDate(step.completedAt)}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DOCUMENT STATUS & TRAINING/VEHICLE PROGRESS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                  {/* Document Status Tracking */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <h5 style={{
                      color: 'white',
                      margin: '0 0 8px 0',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      📄 Documents Status
                    </h5>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {workflow?.documents?.map((doc: any, index: number) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                          fontSize: '10px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>{getDocumentStatusIcon(doc.status)}</span>
                            <span style={{ color: 'white' }}>
                              {doc.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {doc.status.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Training Progress OR Vehicle/Compliance Info */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    {isDriver ? (
                      <>
                        <h5 style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          🚚 Vehicle & Compliance
                        </h5>
                        <div style={{ fontSize: '9px' }}>
                          {(workflow as any)?.vehicleAssignment && (
                            <>
                              <div style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: '2px'
                              }}>
                                <strong>Truck:</strong> #{(workflow as any).vehicleAssignment.truckNumber}
                              </div>
                              <div style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: '2px'
                              }}>
                                <strong>Trailer:</strong> {(workflow as any).vehicleAssignment.trailerType}
                              </div>
                            </>
                          )}
                          {(workflow as any)?.compliance && (
                            <>
                              <div style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: '2px'
                              }}>
                                <strong>DOT:</strong> {(workflow as any).compliance.dotNumber}
                              </div>
                              <div style={{
                                color: 'rgba(255, 255, 255, 0.7)'
                              }}>
                                <strong>SAFER Score:</strong> {(workflow as any).compliance.saferScore}/100
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 style={{
                          color: 'white',
                          margin: '0 0 8px 0',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          📚 Training Progress ({(workflow as any)?.training?.overallProgress || 0}%)
                        </h5>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '4px',
                          height: '4px',
                          overflow: 'hidden',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #f4a832, #2563eb)',
                            height: '100%',
                            width: `${(workflow as any)?.training?.overallProgress || 0}%`,
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                        <div style={{ fontSize: '9px' }}>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '2px'
                          }}>
                            <strong>Required:</strong> {(workflow as any)?.training?.required?.length || 0} modules
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '2px'
                          }}>
                            <strong>Completed:</strong> {(workflow as any)?.training?.completed?.length || 0} modules
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.7)'
                          }}>
                            <strong>In Progress:</strong> {(workflow as any)?.training?.inProgress?.length || 0} modules
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button style={{
                background: 'rgba(16, 185, 129, 0.8)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                flex: 1
              }}>
                ✏️ Edit User
              </button>
              <button style={{
                background: 'rgba(59, 130, 246, 0.8)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                flex: 1
              }}>
                📋 View Full Details
              </button>
              <button style={{
                background: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                🗑️
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
