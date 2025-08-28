'use client';

import { useEffect, useState } from 'react';
import DocumentsPortalButton from '../components/DocumentsPortalButton';
import UserSubscriptionManager from '../components/UserSubscriptionManager';
import { ContractorOnboardingWorkflow } from '../onboarding/contractor-onboarding/components/ContractorOnboardingWorkflow';
import FleetFlowExtensionService from '../services/FleetFlowExtensionService';
import UserProfileWorkflowService, {
  TrainingAssignment,
  UserProfileWorkflowData,
} from '../services/UserProfileWorkflowService';

// Comprehensive mock users with ALL detailed information + drivers with carrier onboarding
const mockUsers: any[] = [];

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
          'dispatch-invoice-creation',
        ],
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
          'broker-performance-metrics',
        ],
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
          'rfx-approval-workflow',
        ],
      },
      routes: {
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
          'routes-cost-analysis',
        ],
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
          'tracking-history-logs',
        ],
      },
    },
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
          'drivers-payroll-integration',
        ],
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
          'portal-communication-tools',
        ],
      },
    },
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
          'fleet-warranty-tracking',
        ],
      },
      vehicles: {
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
          'vehicles-cost-tracking',
        ],
      },
      maintenance: {
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
          'maintenance-warranty-claims',
        ],
      },
    },
  },
  analytics: {
    name: 'ANALYTICS',
    icon: '📊',
    color: '#6366f1',
    subPages: {
      reports: {
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
          'reports-archive-management',
        ],
      },
      performance: {
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
          'performance-alert-system',
        ],
      },
      financials: {
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
          'financials-audit-trails',
        ],
      },
    },
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
          'dot-record-keeping',
        ],
      },
      safety: {
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
          'safety-emergency-procedures',
        ],
      },
      certificates: {
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
          'certificates-renewal-tracking',
        ],
      },
    },
  },
  resources: {
    name: 'RESOURCES',
    icon: '📚',
    color: '#f97316',
    subPages: {
      'fleetflow-university': {
        name: 'FleetFlow University℠',
        icon: '🎓',
        sections: [
          'university-course-catalog',
          'university-enrollment-management',
          'university-progress-tracking',
          'university-certification-programs',
          'university-instructor-tools',
          'university-content-library',
          'university-assessment-tools',
          'university-reporting-analytics',
        ],
      },
      documentation: {
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
          'docs-update-notifications',
        ],
      },
      support: {
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
          'support-resolution-tracking',
        ],
      },
    },
  },
  'quickbooks-integration': {
    name: 'QUICKBOOKS INTEGRATION',
    icon: '🧾',
    color: '#10b981',
    subPages: {
      'company-settings': {
        name: 'Company Settings',
        icon: '🏢',
        sections: [
          'quickbooks-connection-manage',
          'quickbooks-oauth-setup',
          'quickbooks-company-info',
          'quickbooks-environment-config',
          'quickbooks-token-management',
          'quickbooks-error-handling',
          'quickbooks-sync-status',
          'quickbooks-connection-test',
        ],
      },
      'feature-management': {
        name: 'Feature Management',
        icon: '⚙️',
        sections: [
          'quickbooks-payroll-enable',
          'quickbooks-ach-enable',
          'quickbooks-invoicing-enable',
          'quickbooks-auto-withdrawal-enable',
          'quickbooks-sync-schedule',
          'quickbooks-data-mapping',
          'quickbooks-error-notifications',
          'quickbooks-audit-logs',
        ],
      },
      'user-dashboard-integration': {
        name: 'User Dashboard Integration',
        icon: '📊',
        sections: [
          'quickbooks-status-widget',
          'quickbooks-sync-indicators',
          'quickbooks-error-display',
          'quickbooks-last-sync-time',
          'quickbooks-feature-status',
          'quickbooks-connection-status',
          'quickbooks-sync-progress',
          'quickbooks-notification-badges',
        ],
      },
      'payroll-integration': {
        name: 'Payroll Integration',
        icon: '💰',
        sections: [
          'quickbooks-payroll-sync',
          'quickbooks-payroll-export',
          'quickbooks-payroll-mapping',
          'quickbooks-payroll-schedule',
          'quickbooks-payroll-approval',
          'quickbooks-payroll-reports',
          'quickbooks-payroll-taxes',
          'quickbooks-payroll-deductions',
        ],
      },
      'ach-payment-integration': {
        name: 'ACH Payment Integration',
        icon: '🏦',
        sections: [
          'quickbooks-ach-setup',
          'quickbooks-ach-authorization',
          'quickbooks-ach-processing',
          'quickbooks-ach-settlement',
          'quickbooks-ach-error-handling',
          'quickbooks-ach-compliance',
          'quickbooks-ach-reporting',
          'quickbooks-ach-audit-trail',
        ],
      },
      'invoicing-integration': {
        name: 'Invoicing Integration',
        icon: '🧾',
        sections: [
          'quickbooks-invoice-create',
          'quickbooks-invoice-sync',
          'quickbooks-invoice-templates',
          'quickbooks-invoice-approval',
          'quickbooks-invoice-payment',
          'quickbooks-invoice-reporting',
          'quickbooks-invoice-tracking',
          'quickbooks-invoice-archiving',
        ],
      },
      'auto-withdrawal-integration': {
        name: 'Auto Withdrawal Integration',
        icon: '🔄',
        sections: [
          'quickbooks-auto-withdrawal-setup',
          'quickbooks-auto-withdrawal-schedule',
          'quickbooks-auto-withdrawal-monitoring',
          'quickbooks-auto-withdrawal-approval',
          'quickbooks-auto-withdrawal-error-handling',
          'quickbooks-auto-withdrawal-compliance',
          'quickbooks-auto-withdrawal-reporting',
          'quickbooks-auto-withdrawal-audit',
        ],
      },
    },
  },
  // NEW COMPREHENSIVE CATEGORIES - 8 MAJOR MISSING SECTIONS
  'ai-flow-platform': {
    name: 'AI FLOW PLATFORM',
    icon: '🤖',
    color: '#ec4899',
    subPages: {
      'ai-flow-dashboard': {
        name: 'AI Flow Dashboard',
        icon: '📊',
        sections: [
          'ai-flow-main-dashboard',
          'ai-flow-analytics-overview',
          'ai-flow-lead-generation-hub',
          'ai-flow-performance-metrics',
          'ai-flow-revenue-tracking',
          'ai-flow-system-monitoring',
          'ai-flow-automation-status',
          'ai-flow-integration-health',
        ],
      },
      'lead-generation-system': {
        name: 'Lead Generation System',
        icon: '🎯',
        sections: [
          'lead-fmcsa-api-integration',
          'lead-weather-gov-integration',
          'lead-exchange-rate-api',
          'lead-thomasnet-integration',
          'lead-prospecting-tools',
          'lead-conversion-tracking',
          'lead-scoring-system',
          'lead-automated-outreach',
        ],
      },
      'ai-negotiator-service': {
        name: 'AI Negotiator Service',
        icon: '🤝',
        sections: [
          'ai-negotiator-rate-negotiations',
          'ai-negotiator-contract-terms',
          'ai-negotiator-rfx-bidding',
          'ai-negotiator-carrier-agreements',
          'ai-negotiator-psychological-tactics',
          'ai-negotiator-strategy-adjustment',
          'ai-negotiator-performance-tracking',
          'ai-negotiator-learning-system',
        ],
      },
      'smart-auto-bidding': {
        name: 'Smart Auto-Bidding',
        icon: '⚡',
        sections: [
          'auto-bidding-rules-engine',
          'auto-bidding-who-criteria',
          'auto-bidding-what-criteria',
          'auto-bidding-when-criteria',
          'auto-bidding-where-criteria',
          'auto-bidding-how-much-criteria',
          'auto-bidding-risk-assessment',
          'auto-bidding-management-approval',
        ],
      },
    },
  },
  'call-center-communications': {
    name: 'CALL CENTER & COMMUNICATIONS',
    icon: '📞',
    color: '#8b5cf6',
    subPages: {
      'freeswitch-dialer': {
        name: 'FreeSWITCH Dialer',
        icon: '☎️',
        sections: [
          'dialer-call-management',
          'dialer-agent-routing',
          'dialer-call-recording',
          'dialer-real-time-monitoring',
          'dialer-queue-management',
          'dialer-performance-analytics',
          'dialer-integration-management',
          'dialer-system-configuration',
        ],
      },
      'sms-workflow-system': {
        name: 'SMS Workflow System',
        icon: '💬',
        sections: [
          'sms-automated-messaging',
          'sms-workflow-triggers',
          'sms-template-management',
          'sms-delivery-tracking',
          'sms-response-handling',
          'sms-compliance-management',
          'sms-analytics-reporting',
          'sms-integration-apis',
        ],
      },
      'multi-channel-communications': {
        name: 'Multi-Channel Communications',
        icon: '📡',
        sections: [
          'multi-channel-unified-inbox',
          'multi-channel-message-routing',
          'multi-channel-response-automation',
          'multi-channel-escalation-management',
          'multi-channel-analytics-dashboard',
          'multi-channel-integration-hub',
          'multi-channel-compliance-tracking',
          'multi-channel-performance-metrics',
        ],
      },
    },
  },
  'crm-customer-management': {
    name: 'CRM & CUSTOMER MANAGEMENT',
    icon: '👥',
    color: '#f59e0b',
    subPages: {
      'crm-suite': {
        name: 'CRM Suite',
        icon: '📋',
        sections: [
          'crm-contact-management',
          'crm-account-management',
          'crm-opportunity-tracking',
          'crm-sales-pipeline',
          'crm-activity-logging',
          'crm-relationship-mapping',
          'crm-customer-segmentation',
          'crm-interaction-history',
        ],
      },
      'sales-pipeline': {
        name: 'Sales Pipeline',
        icon: '📈',
        sections: [
          'pipeline-lead-qualification',
          'pipeline-opportunity-management',
          'pipeline-stage-progression',
          'pipeline-conversion-tracking',
          'pipeline-forecasting-tools',
          'pipeline-performance-analytics',
          'pipeline-automated-workflows',
          'pipeline-reporting-dashboard',
        ],
      },
      'customer-portal': {
        name: 'Customer Portal',
        icon: '🌐',
        sections: [
          'portal-customer-dashboard',
          'portal-shipment-tracking',
          'portal-invoice-management',
          'portal-document-sharing',
          'portal-communication-tools',
          'portal-service-requests',
          'portal-analytics-access',
          'portal-mobile-access',
        ],
      },
    },
  },
  'warehousing-3pl-operations': {
    name: 'WAREHOUSING & 3PL OPERATIONS',
    icon: '🏢',
    color: '#06b6d4',
    subPages: {
      'warehouse-management': {
        name: 'Warehouse Management',
        icon: '📦',
        sections: [
          'warehouse-inventory-tracking',
          'warehouse-receiving-operations',
          'warehouse-put-away-process',
          'warehouse-picking-operations',
          'warehouse-packing-shipping',
          'warehouse-cycle-counting',
          'warehouse-space-optimization',
          'warehouse-labor-management',
        ],
      },
      'cross-docking-operations': {
        name: 'Cross-Docking Operations',
        icon: '🔄',
        sections: [
          'cross-dock-inbound-scheduling',
          'cross-dock-staging-management',
          'cross-dock-sorting-operations',
          'cross-dock-outbound-planning',
          'cross-dock-flow-optimization',
          'cross-dock-quality-control',
          'cross-dock-performance-tracking',
          'cross-dock-exception-handling',
        ],
      },
      'vendor-portal-integration': {
        name: 'Vendor Portal Integration',
        icon: '🤝',
        sections: [
          'vendor-portal-onboarding',
          'vendor-portal-performance-tracking',
          'vendor-portal-communication-hub',
          'vendor-portal-document-management',
          'vendor-portal-payment-processing',
          'vendor-portal-compliance-monitoring',
          'vendor-portal-analytics-reporting',
          'vendor-portal-integration-apis',
        ],
      },
    },
  },
  'government-contracts-rfp': {
    name: 'GOVERNMENT CONTRACTS & RFP',
    icon: '🏛️',
    color: '#dc2626',
    subPages: {
      'sam-gov-integration': {
        name: 'SAM.gov Integration',
        icon: '🇺🇸',
        sections: [
          'sam-gov-opportunity-discovery',
          'sam-gov-contract-tracking',
          'sam-gov-vendor-registration',
          'sam-gov-compliance-monitoring',
          'sam-gov-bid-submission',
          'sam-gov-award-notifications',
          'sam-gov-performance-reporting',
          'sam-gov-api-management',
        ],
      },
      'rfp-discovery-system': {
        name: 'RFP Discovery System',
        icon: '🔍',
        sections: [
          'rfp-opportunity-scanning',
          'rfp-matching-algorithms',
          'rfp-qualification-assessment',
          'rfp-response-management',
          'rfp-collaboration-tools',
          'rfp-submission-tracking',
          'rfp-win-loss-analysis',
          'rfp-pipeline-management',
        ],
      },
      'enterprise-rfps': {
        name: 'Enterprise RFPs',
        icon: '🏢',
        sections: [
          'enterprise-rfp-monitoring',
          'enterprise-rfp-qualification',
          'enterprise-rfp-response-automation',
          'enterprise-rfp-collaboration',
          'enterprise-rfp-pricing-tools',
          'enterprise-rfp-presentation-builder',
          'enterprise-rfp-submission-management',
          'enterprise-rfp-relationship-tracking',
        ],
      },
      'instantmarkets-integration': {
        name: 'InstantMarkets Integration',
        icon: '⚡',
        sections: [
          'instantmarkets-opportunity-feed',
          'instantmarkets-automated-matching',
          'instantmarkets-bid-automation',
          'instantmarkets-performance-tracking',
          'instantmarkets-analytics-dashboard',
          'instantmarkets-integration-management',
          'instantmarkets-notification-system',
          'instantmarkets-reporting-tools',
        ],
      },
    },
  },
  'financial-services-integration': {
    name: 'FINANCIAL SERVICES INTEGRATION',
    icon: '💰',
    color: '#059669',
    subPages: {
      'banking-integration': {
        name: 'Banking Integration',
        icon: '🏦',
        sections: [
          'banking-account-management',
          'banking-transaction-monitoring',
          'banking-automated-payments',
          'banking-cash-flow-management',
          'banking-reconciliation-tools',
          'banking-fraud-detection',
          'banking-compliance-reporting',
          'banking-api-management',
        ],
      },
      'fuel-card-management': {
        name: 'Fuel Card Management',
        icon: '⛽',
        sections: [
          'fuel-card-comdata-integration',
          'fuel-card-efs-integration',
          'fuel-card-fleetcor-integration',
          'fuel-card-wex-integration',
          'fuel-card-transaction-monitoring',
          'fuel-card-spending-controls',
          'fuel-card-reporting-analytics',
          'fuel-card-fraud-prevention',
        ],
      },
      'insurance-provider-integration': {
        name: 'Insurance Provider Integration',
        icon: '🛡️',
        sections: [
          'insurance-policy-management',
          'insurance-claims-processing',
          'insurance-risk-assessment',
          'insurance-premium-tracking',
          'insurance-compliance-monitoring',
          'insurance-certificate-management',
          'insurance-renewal-automation',
          'insurance-reporting-analytics',
        ],
      },
      'tax-services': {
        name: 'Tax Services',
        icon: '📊',
        sections: [
          'tax-bandits-form-2290',
          'tax-ifta-integration',
          'tax-multi-state-filing',
          'tax-quarterly-reporting',
          'tax-compliance-monitoring',
          'tax-audit-preparation',
          'tax-payment-processing',
          'tax-analytics-reporting',
        ],
      },
    },
  },
  'system-administration': {
    name: 'SYSTEM ADMINISTRATION',
    icon: '⚙️',
    color: '#7c3aed',
    subPages: {
      'user-profile-management': {
        name: 'User Profile Management',
        icon: '👤',
        sections: [
          'profile-account-settings',
          'profile-security-preferences',
          'profile-notification-settings',
          'profile-access-permissions',
          'profile-activity-logging',
          'profile-session-management',
          'profile-data-privacy',
          'profile-integration-preferences',
        ],
      },
      'system-configuration': {
        name: 'System Configuration',
        icon: '🔧',
        sections: [
          'system-global-settings',
          'system-feature-toggles',
          'system-performance-tuning',
          'system-scaling-configuration',
          'system-maintenance-scheduling',
          'system-update-management',
          'system-environment-variables',
          'system-logging-configuration',
        ],
      },
      'api-management': {
        name: 'API Management',
        icon: '🔌',
        sections: [
          'api-key-management',
          'api-rate-limiting',
          'api-authentication-config',
          'api-endpoint-monitoring',
          'api-usage-analytics',
          'api-integration-testing',
          'api-documentation-management',
          'api-security-configuration',
        ],
      },
      'security-settings': {
        name: 'Security Settings',
        icon: '🔒',
        sections: [
          'security-access-control',
          'security-authentication-methods',
          'security-encryption-settings',
          'security-audit-logging',
          'security-threat-monitoring',
          'security-compliance-tracking',
          'security-incident-response',
          'security-vulnerability-management',
        ],
      },
      'backup-recovery': {
        name: 'Backup & Recovery',
        icon: '💾',
        sections: [
          'backup-automated-schedules',
          'backup-data-retention',
          'backup-recovery-procedures',
          'backup-disaster-planning',
          'backup-integrity-verification',
          'backup-storage-management',
          'backup-monitoring-alerts',
          'backup-compliance-reporting',
        ],
      },
    },
  },
  'training-certification': {
    name: 'TRAINING & CERTIFICATION',
    icon: '🎓',
    color: '#e11d48',
    subPages: {
      'training-management': {
        name: 'Training Management',
        icon: '📚',
        sections: [
          'training-program-administration',
          'training-content-management',
          'training-scheduling-tools',
          'training-resource-allocation',
          'training-compliance-tracking',
          'training-performance-assessment',
          'training-reporting-analytics',
          'training-integration-systems',
        ],
      },
      'certificate-generation': {
        name: 'Certificate Generation',
        icon: '📜',
        sections: [
          'certificate-template-management',
          'certificate-automated-generation',
          'certificate-digital-signatures',
          'certificate-verification-system',
          'certificate-expiration-tracking',
          'certificate-renewal-automation',
          'certificate-compliance-reporting',
          'certificate-integration-apis',
        ],
      },
      'progress-tracking': {
        name: 'Progress Tracking',
        icon: '📈',
        sections: [
          'progress-individual-tracking',
          'progress-milestone-management',
          'progress-completion-reporting',
          'progress-performance-analytics',
          'progress-intervention-alerts',
          'progress-goal-setting',
          'progress-competency-mapping',
          'progress-dashboard-tools',
        ],
      },
      'instructor-tools': {
        name: 'Instructor Tools',
        icon: '👨‍🏫',
        sections: [
          'instructor-content-delivery',
          'instructor-student-management',
          'instructor-assessment-tools',
          'instructor-grading-system',
          'instructor-communication-hub',
          'instructor-resource-library',
          'instructor-performance-tracking',
          'instructor-reporting-tools',
        ],
      },
      'assessment-system': {
        name: 'Assessment System',
        icon: '📝',
        sections: [
          'assessment-test-creation',
          'assessment-automated-grading',
          'assessment-proctoring-tools',
          'assessment-analytics-reporting',
          'assessment-cheating-prevention',
          'assessment-adaptive-testing',
          'assessment-feedback-systems',
          'assessment-certification-pathways',
        ],
      },
    },
  },
};

// Utility functions - Department color system
interface DepartmentColorScheme {
  color: string;
  background: string;
  border?: string;
  department?: string;
}

const getDepartmentColor = (
  input: string | undefined,
  returnObject: boolean = false
): string | DepartmentColorScheme => {
  if (!input) {
    return returnObject
      ? {
          color: 'rgba(255, 255, 255, 0.7)',
          background: 'rgba(255, 255, 255, 0.1)',
        }
      : '#6b7280';
  }

  let departmentCode = input;

  // If input looks like a user identifier (contains dashes), extract department code
  if (input.includes('-')) {
    const parts = input.split('-');
    if (parts.length >= 2) {
      departmentCode = parts[1];
    }
  }

  departmentCode = departmentCode.toUpperCase();

  switch (departmentCode) {
    case 'DC': // Dispatcher - blue
      return returnObject
        ? {
            color: '#3b82f6',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            department: 'Dispatcher',
          }
        : '#3b82f6';
    case 'BB': // Broker - orange
      return returnObject
        ? {
            color: '#f97316',
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            department: 'Broker',
          }
        : '#f97316';
    case 'DM': // Driver - yellow
      return returnObject
        ? {
            color: '#f4a832',
            background: 'rgba(244, 168, 50, 0.15)',
            border: '1px solid rgba(244, 168, 50, 0.3)',
            department: 'Driver',
          }
        : '#f4a832';
    case 'MGR': // Management - purple
      return returnObject
        ? {
            color: '#9333ea',
            background: 'rgba(147, 51, 234, 0.15)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            department: 'Management',
          }
        : '#9333ea';
    default:
      return returnObject
        ? {
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'rgba(255, 255, 255, 0.1)',
          }
        : '#6b7280';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusIcon = (status: string) => {
  return status === 'active' ? '🟢' : status === 'pending' ? '🟡' : '🔴';
};

const getWorkflowStepIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return '✅';
    case 'in_progress':
      return '⏳';
    case 'pending':
      return '⭕';
    default:
      return '⭕';
  }
};

const getDocumentStatusIcon = (status: string) => {
  switch (status) {
    case 'signed':
      return '✅';
    case 'verified':
      return '✅';
    case 'sent':
      return '📤';
    case 'pending':
      return '⏳';
    default:
      return '❌';
  }
};

const getPermissionDisplayName = (permission: string) => {
  const permissionLabels: { [key: string]: string } = {
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
    'support-resolution-tracking': 'Resolution Tracking',

    // QUICKBOOKS INTEGRATION - Company Settings
    'quickbooks-connection-manage': 'Connection Management',
    'quickbooks-oauth-setup': 'OAuth Setup',
    'quickbooks-company-info': 'Company Information',
    'quickbooks-environment-config': 'Environment Configuration',
    'quickbooks-token-management': 'Token Management',
    'quickbooks-error-handling': 'Error Handling',
    'quickbooks-sync-status': 'Sync Status',
    'quickbooks-connection-test': 'Connection Testing',

    // QUICKBOOKS INTEGRATION - Feature Management
    'quickbooks-payroll-enable': 'Payroll Enable',
    'quickbooks-ach-enable': 'ACH Enable',
    'quickbooks-invoicing-enable': 'Invoicing Enable',
    'quickbooks-auto-withdrawal-enable': 'Auto Withdrawal Enable',
    'quickbooks-sync-schedule': 'Sync Schedule',
    'quickbooks-data-mapping': 'Data Mapping',
    'quickbooks-error-notifications': 'Error Notifications',
    'quickbooks-audit-logs': 'Audit Logs',

    // QUICKBOOKS INTEGRATION - User Dashboard Integration
    'quickbooks-status-widget': 'Status Widget',
    'quickbooks-sync-indicators': 'Sync Indicators',
    'quickbooks-error-display': 'Error Display',
    'quickbooks-last-sync-time': 'Last Sync Time',
    'quickbooks-feature-status': 'Feature Status',
    'quickbooks-connection-status': 'Connection Status',
    'quickbooks-sync-progress': 'Sync Progress',
    'quickbooks-notification-badges': 'Notification Badges',

    // QUICKBOOKS INTEGRATION - Payroll Integration
    'quickbooks-payroll-sync': 'Payroll Sync',
    'quickbooks-payroll-export': 'Payroll Export',
    'quickbooks-payroll-mapping': 'Payroll Mapping',
    'quickbooks-payroll-schedule': 'Payroll Schedule',
    'quickbooks-payroll-approval': 'Payroll Approval',
    'quickbooks-payroll-reports': 'Payroll Reports',
    'quickbooks-payroll-taxes': 'Payroll Taxes',
    'quickbooks-payroll-deductions': 'Payroll Deductions',

    // QUICKBOOKS INTEGRATION - ACH Payment Integration
    'quickbooks-ach-setup': 'ACH Setup',
    'quickbooks-ach-authorization': 'ACH Authorization',
    'quickbooks-ach-processing': 'ACH Processing',
    'quickbooks-ach-settlement': 'ACH Settlement',
    'quickbooks-ach-error-handling': 'ACH Error Handling',
    'quickbooks-ach-compliance': 'ACH Compliance',
    'quickbooks-ach-reporting': 'ACH Reporting',
    'quickbooks-ach-audit-trail': 'ACH Audit Trail',

    // QUICKBOOKS INTEGRATION - Invoicing Integration
    'quickbooks-invoice-create': 'Invoice Creation',
    'quickbooks-invoice-sync': 'Invoice Sync',
    'quickbooks-invoice-templates': 'Invoice Templates',
    'quickbooks-invoice-approval': 'Invoice Approval',
    'quickbooks-invoice-payment': 'Invoice Payment',
    'quickbooks-invoice-reporting': 'Invoice Reporting',
    'quickbooks-invoice-tracking': 'Invoice Tracking',
    'quickbooks-invoice-archiving': 'Invoice Archiving',

    // QUICKBOOKS INTEGRATION - Auto Withdrawal Integration
    'quickbooks-auto-withdrawal-setup': 'Auto Withdrawal Setup',
    'quickbooks-auto-withdrawal-schedule': 'Auto Withdrawal Schedule',
    'quickbooks-auto-withdrawal-monitoring': 'Auto Withdrawal Monitoring',
    'quickbooks-auto-withdrawal-approval': 'Auto Withdrawal Approval',
    'quickbooks-auto-withdrawal-error-handling':
      'Auto Withdrawal Error Handling',
    'quickbooks-auto-withdrawal-compliance': 'Auto Withdrawal Compliance',
    'quickbooks-auto-withdrawal-reporting': 'Auto Withdrawal Reporting',
    'quickbooks-auto-withdrawal-audit': 'Auto Withdrawal Audit',
  };

  return (
    permissionLabels[permission] ||
    permission
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

export default function UserManagement() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPermissionCategory, setExpandedPermissionCategory] = useState<
    string | null
  >(null);
  const [expandedSubPages, setExpandedSubPages] = useState<{
    [key: string]: boolean;
  }>({});
  const [userPermissions, setUserPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [userWorkflowData, setUserWorkflowData] = useState<{
    [userId: string]: UserProfileWorkflowData;
  }>({});
  const [showTrainingAssignment, setShowTrainingAssignment] = useState(false);
  const [showContractorOnboarding, setShowContractorOnboarding] =
    useState(false);
  const [onboardingUser, setOnboardingUser] = useState<any>(null);

  const workflowService = UserProfileWorkflowService.getInstance();
  const extensionService = FleetFlowExtensionService.getInstance();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = filteredUsers[currentUserIndex] || {
    id: 'no-users',
    name: 'No Users',
    email: 'no-users@configured.com',
    department: 'None',
    departmentCode: 'NONE',
    position: 'No Position',
    status: 'inactive',
    permissions: {},
    systemAccess: { level: 'None', allowedSystems: [] },
    emergencyContact: { name: 'N/A', relation: 'N/A', phone: 'N/A' },
    notes: 'No users have been configured yet',
  };

  // Initialize user permissions from current user
  useEffect(() => {
    if (currentUser?.permissions) {
      setUserPermissions(
        currentUser.permissions as unknown as { [key: string]: boolean }
      );
    }
  }, [currentUser]);

  // Load workflow data for all users
  useEffect(() => {
    const workflowData: { [userId: string]: UserProfileWorkflowData } = {};
    mockUsers.forEach((user) => {
      const userData = workflowService.getUserProfileWorkflow(user.id);
      if (userData) {
        workflowData[user.id] = userData;
      }
    });
    setUserWorkflowData(workflowData);
  }, [workflowService]);

  const isDriver = currentUser?.departmentCode === 'DM';
  const workflow = isDriver
    ? (currentUser as any)?.carrierWorkflow
    : (currentUser as any)?.contractorWorkflow;

  const toggleSubPage = (subPageKey: string) => {
    setExpandedSubPages((prev) => ({
      ...prev,
      [subPageKey]: !prev[subPageKey],
    }));
  };

  const toggleGrantAllSubPage = (subPageKey: string, sections: string[]) => {
    const currentGranted = sections.filter(
      (section) => userPermissions[section]
    ).length;
    const allGranted = currentGranted === sections.length;

    // If all are granted, deny all. Otherwise, grant all
    const newPermissions = { ...userPermissions };

    sections.forEach((section) => {
      newPermissions[section] = !allGranted;
    });

    setUserPermissions(newPermissions);

    // Here you would typically save to database
    console.log(`Updated permissions for ${subPageKey}:`, newPermissions);
  };

  const toggleSectionPermission = (sectionKey: string) => {
    const newPermissions = {
      ...userPermissions,
      [sectionKey]: !userPermissions[sectionKey],
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
    const originalPermissions = currentUser.permissions as unknown as {
      [key: string]: boolean;
    };
    return (
      JSON.stringify(originalPermissions) !== JSON.stringify(userPermissions)
    );
  };

  // Handle training assignment
  const handleAssignTraining = (userId: string, moduleIds: string[]) => {
    const availableModules = workflowService.getAvailableModules();
    const assignments: TrainingAssignment[] = moduleIds
      .map((moduleId, index) => {
        const trainingModule = availableModules.find((m) => m.id === moduleId);
        if (!trainingModule) return null;

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30 * (index + 1));

        return {
          moduleId: trainingModule.id,
          moduleName: trainingModule.name,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          priority: index === 0 ? 'Critical' : index === 1 ? 'High' : 'Medium',
          assignedBy: 'ADMIN_MANUAL_ASSIGN',
          instructor: trainingModule.instructor,
          status: 'assigned',
        } as TrainingAssignment;
      })
      .filter(Boolean) as TrainingAssignment[];

    workflowService.assignTrainingToUser(userId, assignments);

    // Refresh workflow data
    const userData = workflowService.getUserProfileWorkflow(userId);
    if (userData) {
      setUserWorkflowData((prev) => ({
        ...prev,
        [userId]: userData,
      }));
    }
  };

  // Handle auto-assign role-based FleetFlow University training
  const handleStartContractorOnboarding = (user: any) => {
    setOnboardingUser({
      id: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      email: user.email,
      phone: user.phone || '',
      role:
        user.departmentCode === 'DC'
          ? 'dispatcher'
          : user.departmentCode === 'BB'
            ? 'broker_agent'
            : 'both',
    });
    setShowContractorOnboarding(true);
  };

  const handleContractorOnboardingComplete = (finalData: any) => {
    console.log('Contractor onboarding completed:', finalData);

    // Store signed documents in user's profile
    if (onboardingUser && finalData) {
      try {
        // Import the user document service
        import('../services/UserDocumentService').then(
          ({ userDocumentService }) => {
            userDocumentService.storeICAOnboardingDocuments(
              onboardingUser.id,
              finalData.icaDocument,
              finalData.signatureData,
              finalData.ndaAcknowledgment
            );
          }
        );
      } catch (error) {
        console.error('Error storing signed documents:', error);
      }
    }

    alert(
      `🎉 Employee onboarding completed for ${onboardingUser?.firstName} ${onboardingUser?.lastName}! ICA signed successfully. Documents saved to user profile.`
    );
    setShowContractorOnboarding(false);
    setOnboardingUser(null);
    // In production, this would update the user's onboarding status in the database
  };

  const handleContractorOnboardingCancel = () => {
    setShowContractorOnboarding(false);
    setOnboardingUser(null);
  };

  const handleAutoAssignTraining = (userId: string, departmentCode: string) => {
    const roleTrainingMap: Record<string, string[]> = {
      DC: [
        'fleetflow_technology_systems',
        'fleetflow_dispatch_mastery',
        'fleetflow_workflow_ecosystem',
        'fleetflow_compliance_training',
      ], // Dispatcher - FleetFlow system training
      BB: [
        'fleetflow_technology_systems',
        'fleetflow_broker_mastery',
        'fleetflow_customer_service',
        'fleetflow_financial_management',
      ], // Broker - FleetFlow system training
      DM: [
        'fleetflow_technology_systems',
        'fleetflow_compliance_training',
        'fleetflow_sms_notifications',
      ], // Driver - FleetFlow system training
      MGR: [
        'fleetflow_admin_management',
        'fleetflow_analytics_reporting',
        'fleetflow_workflow_ecosystem',
        'fleetflow_financial_management',
      ], // Manager - FleetFlow system training
    };

    const moduleIds = roleTrainingMap[departmentCode] || [];
    if (moduleIds.length > 0) {
      handleAssignTraining(userId, moduleIds);
    }
  };

  if (!currentUser) {
    return (
      <div
        style={{
          background:
            'radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), radial-gradient(circle at 40% 80%, #667eea 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          padding: '80px 20px 20px 20px',
        }}
      >
        <div style={{ color: 'white', textAlign: 'center' }}>
          No users found matching search criteria.
        </div>
      </div>
    );
  }

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
      {/* Animated Background Elements */}
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
        {/* Enterprise Command Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ef4444, #f59e0b)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>👥</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  👥 FLEETFLOW™ USER MANAGEMENT COMMAND
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 12px 0',
                      fontWeight: '500',
                    }}
                  >
                    Access Control & Permissions Intelligence Platform
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: '1px solid #10b981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      🟢 ACCESS CONTROL ACTIVE
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      System Status: OPTIMAL • {filteredUsers.length} Users
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type='text'
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  width: '200px',
                }}
              />
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                🔄 REFRESH
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                ➕ ADD USER
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '25px',
            alignItems: 'start',
          }}
        >
          {/* User Navigation */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              height: 'fit-content',
            }}
          >
            {/* User Avatar Card */}
            <div
              style={{
                background: `${getDepartmentColor(currentUser?.departmentCode, false) as string}20`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: `2px solid ${getDepartmentColor(currentUser?.departmentCode, false) as string}66`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: getDepartmentColor(
                    currentUser?.departmentCode,
                    false
                  ) as string,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  margin: '0 auto 16px',
                  fontWeight: 'bold',
                }}
              >
                {currentUser?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              <h3
                style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                {currentUser?.name}
              </h3>

              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                {currentUser?.position}
              </div>

              <div
                style={{
                  background:
                    currentUser?.status === 'active'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  color:
                    currentUser?.status === 'active' ? '#dc2626' : '#14b8a6',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'inline-block',
                }}
              >
                <span>{getStatusIcon(currentUser?.status)}</span>{' '}
                {currentUser?.status.toUpperCase()}
              </div>
            </div>

            {/* Navigation Controls */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <DocumentsPortalButton variant='small' />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={() =>
                    setCurrentUserIndex(
                      (prev) =>
                        (prev - 1 + filteredUsers.length) % filteredUsers.length
                    )
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  ← Previous
                </button>

                <span style={{ color: 'white', fontSize: '14px' }}>
                  {currentUserIndex + 1} of {filteredUsers.length}
                </span>

                <button
                  onClick={() =>
                    setCurrentUserIndex(
                      (prev) => (prev + 1) % filteredUsers.length
                    )
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Page Indicators */}
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {filteredUsers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentUserIndex(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background:
                      index === currentUserIndex
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* User Details Panel */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Account Details */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
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
                {currentUser?.departmentCode === 'FBB'
                  ? '🏢 Owner Details (BUSINESS ENTITY)'
                  : '👤 Account Details'}
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  fontSize: '12px',
                }}
              >
                {/* Left Column */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {/* Email Field */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
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
                        wordBreak: 'break-all',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {currentUser?.email || 'Not provided'}
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
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
                        fontFamily: 'monospace',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {currentUser?.phone || 'Not provided'}
                    </div>
                  </div>

                  {/* FleetFlow Extension Field */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      📞 <strong>FLEETFLOW EXTENSION</strong>
                    </div>
                    <div
                      style={{
                        background: (() => {
                          const color = extensionService.getDepartmentColor(
                            currentUser?.departmentCode || 'MGR'
                          );
                          // Convert hex to rgb for rgba
                          const r = parseInt(color.slice(1, 3), 16);
                          const g = parseInt(color.slice(3, 5), 16);
                          const b = parseInt(color.slice(5, 7), 16);
                          return `rgba(${r}, ${g}, ${b}, 0.1)`;
                        })(),
                        color: extensionService.getDepartmentColor(
                          currentUser?.departmentCode || 'MGR'
                        ),
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: (() => {
                          const color = extensionService.getDepartmentColor(
                            currentUser?.departmentCode || 'MGR'
                          );
                          const r = parseInt(color.slice(1, 3), 16);
                          const g = parseInt(color.slice(3, 5), 16);
                          const b = parseInt(color.slice(5, 7), 16);
                          return `1px solid rgba(${r}, ${g}, ${b}, 0.3)`;
                        })(),
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: 'monospace',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>
                        {(() => {
                          const extension = extensionService.getUserExtension(
                            currentUser?.id || ''
                          );
                          return extension
                            ? `Ext. ${extension.extension}`
                            : 'Not assigned';
                        })()}
                      </span>
                      {(() => {
                        const extension = extensionService.getUserExtension(
                          currentUser?.id || ''
                        );
                        return extension?.phoneSetupComplete ? (
                          <span style={{ fontSize: '10px', color: '#22c55e' }}>
                            ✅ Setup Complete
                          </span>
                        ) : (
                          <span style={{ fontSize: '10px', color: '#f59e0b' }}>
                            ⚠️ Setup Pending
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Department Field */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      🏢 <strong>DEPARTMENT</strong>
                    </div>
                    {(() => {
                      const deptColorScheme = getDepartmentColor(
                        currentUser?.department,
                        true
                      ) as DepartmentColorScheme;
                      return (
                        <div
                          style={{
                            color: deptColorScheme.color,
                            background: deptColorScheme.background,
                            border: deptColorScheme.border,
                            padding: '10px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          <span>
                            {currentUser?.department || 'Not assigned'}
                          </span>
                          {deptColorScheme.department && (
                            <span style={{ fontSize: '10px', opacity: 0.7 }}>
                              {deptColorScheme.department}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Right Column */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {/* Security Level Field */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
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
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        letterSpacing: '1px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {(currentUser as any)?.systemAccess?.securityLevel ||
                        'STANDARD'}
                    </div>
                  </div>

                  {/* User ID Field - Enhanced */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      🆔 <strong>USER IDENTIFIER</strong>
                    </div>
                    {(() => {
                      const colorScheme = getDepartmentColor(
                        currentUser?.id,
                        true
                      ) as DepartmentColorScheme;
                      return (
                        <div
                          style={{
                            color: colorScheme.color,
                            background: colorScheme.background,
                            border: colorScheme.border,
                            padding: '10px 12px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          <span>{currentUser?.id}</span>
                          {colorScheme.department && (
                            <span
                              style={{
                                fontSize: '10px',
                                opacity: 0.8,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {colorScheme.department}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Hire Date Field */}
                  <div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
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
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {formatDate(currentUser?.hiredDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FleetGuard AI Security Analysis */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
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
                🛡️ FleetGuard AI Security Analysis
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {/* Security Status */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '24px',
                      marginBottom: '4px',
                    }}
                  >
                    ✅
                  </div>
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}
                  >
                    SECURITY STATUS
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                    }}
                  >
                    Verified & Active
                  </div>
                </div>

                {/* Fraud Detection */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      marginBottom: '4px',
                    }}
                  >
                    🔍
                  </div>
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}
                  >
                    FRAUD DETECTION
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                    }}
                  >
                    Continuously Monitored
                  </div>
                </div>

                {/* Risk Assessment */}
                <div
                  style={{
                    background:
                      currentUser?.departmentCode === 'DM'
                        ? 'rgba(245, 158, 11, 0.1)'
                        : 'rgba(16, 185, 129, 0.1)',
                    border:
                      currentUser?.departmentCode === 'DM'
                        ? '1px solid rgba(245, 158, 11, 0.2)'
                        : '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color:
                        currentUser?.departmentCode === 'DM'
                          ? '#f59e0b'
                          : '#10b981',
                      fontSize: '24px',
                      marginBottom: '4px',
                    }}
                  >
                    {currentUser?.departmentCode === 'DM' ? '⚠️' : '🛡️'}
                  </div>
                  <div
                    style={{
                      color:
                        currentUser?.departmentCode === 'DM'
                          ? '#f59e0b'
                          : '#10b981',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}
                  >
                    RISK LEVEL
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                    }}
                  >
                    {currentUser?.departmentCode === 'DM'
                      ? 'Medium (Driver)'
                      : 'Low (Internal)'}
                  </div>
                </div>

                {/* BrokerSnapshot Integration */}
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#a855f7',
                      fontSize: '24px',
                      marginBottom: '4px',
                    }}
                  >
                    📊
                  </div>
                  <div
                    style={{
                      color: '#a855f7',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}
                  >
                    BROKERSNAPSHOT
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                    }}
                  >
                    {currentUser?.departmentCode === 'DM'
                      ? 'Financial Check'
                      : 'N/A (Internal)'}
                  </div>
                </div>
              </div>

              {/* FleetGuard AI Features */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  🔐 Active Security Features:
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  {[
                    'Address Verification',
                    'Document Authentication',
                    'Behavioral Analysis',
                    currentUser?.departmentCode === 'DM'
                      ? 'Carrier Screening'
                      : 'Internal Monitoring',
                    currentUser?.departmentCode === 'DM'
                      ? 'Financial Intelligence'
                      : 'Access Control',
                    'Real-time Alerts',
                  ].map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Role-Specific Security Information */}
              <div
                style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px',
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.4',
                }}
              >
                {currentUser?.departmentCode === 'MGR' &&
                  '🔑 Executive Level: Full access to all FleetGuard AI security reports and carrier risk assessments across the entire platform.'}
                {currentUser?.departmentCode === 'DC' &&
                  '📋 Dispatcher: Access to carrier fraud detection for load assignment decisions and real-time security alerts.'}
                {currentUser?.departmentCode === 'BB' &&
                  '💼 Broker: Comprehensive carrier vetting with FMCSA + BrokerSnapshot integration for informed partner selection.'}
                {currentUser?.departmentCode === 'DM' &&
                  '🚛 Driver/Carrier: Enhanced onboarding security with document verification, address validation, and financial screening.'}
              </div>
            </div>

            {/* Business Entity Information - Only for FBB users - BEFORE ONBOARDING */}
            {currentUser.departmentCode === 'FBB' &&
              currentUser.businessInfo && (
                <>
                  {/* Company Information */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px',
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
                      🏢 Company Information
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          🏢 <strong>COMPANY NAME</strong>
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}
                        >
                          {currentUser.businessInfo.companyName}
                        </div>

                        <div style={{ marginTop: '8px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            🆔 <strong>COMPANY ID</strong>
                          </div>
                          <div
                            style={{
                              color: '#f59e0b',
                              fontWeight: '600',
                              fontSize: '13px',
                              padding: '4px 8px',
                              background: 'rgba(245, 158, 11, 0.1)',
                              borderRadius: '4px',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            {currentUser.businessInfo.companyId ||
                              'Not assigned'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          🚛 <strong>MC NUMBER</strong>
                        </div>
                        <div
                          style={{
                            color: '#10b981',
                            fontWeight: '600',
                            fontSize: '13px',
                            padding: '4px 8px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '4px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          {currentUser.businessInfo.mcNumber || 'Not provided'}
                        </div>

                        <div style={{ marginTop: '8px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
                            🔢 <strong>DOT NUMBER</strong>
                          </div>
                          <div
                            style={{
                              color: '#3b82f6',
                              fontWeight: '600',
                              fontSize: '13px',
                              padding: '4px 8px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              borderRadius: '4px',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            {currentUser.businessInfo.dotNumber ||
                              'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        📍 <strong>BUSINESS ADDRESS</strong>
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '13px',
                        }}
                      >
                        {currentUser.businessInfo.businessAddress}
                      </div>
                    </div>
                  </div>

                  {/* Business Operations */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px',
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
                      🎯 Business Operations
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          🗺️ <strong>SERVICE TERRITORIES</strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                          }}
                        >
                          {currentUser.businessInfo.territories.map(
                            (territory, index) => (
                              <span
                                key={index}
                                style={{
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#60a5fa',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                }}
                              >
                                {territory}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          🚚 <strong>SPECIALIZATIONS</strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                          }}
                        >
                          {currentUser.businessInfo.specializations.map(
                            (spec, index) => (
                              <span
                                key={index}
                                style={{
                                  background: 'rgba(16, 185, 129, 0.2)',
                                  color: '#34d399',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                }}
                              >
                                {spec}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Management */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px',
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
                      👥 Agent Management
                    </h4>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        🎯 <strong>BROKER AGENTS UNDER THIS COMPANY</strong>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {(() => {
                          const childAgents = mockUsers.filter(
                            (user) =>
                              user.departmentCode === 'BB' &&
                              user.parentCompanyId === currentUser.id
                          );

                          if (childAgents.length === 0) {
                            return (
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '12px',
                                  fontStyle: 'italic',
                                  padding: '8px 12px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                No broker agents assigned yet
                              </div>
                            );
                          }

                          return childAgents.map((agent, index) => (
                            <div
                              key={index}
                              style={{
                                background: 'rgba(249, 115, 22, 0.2)',
                                color: '#fb923c',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: '1px solid rgba(249, 115, 22, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span>👤</span>
                              <span>{agent.name}</span>
                              <span
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '10px',
                                }}
                              >
                                ({agent.id})
                              </span>
                            </div>
                          ));
                        })()}
                      </div>

                      <div
                        style={{
                          marginTop: '12px',
                          padding: '8px 12px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '6px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#60a5fa',
                        }}
                      >
                        📊 Total Active Agents:{' '}
                        {
                          mockUsers.filter(
                            (user) =>
                              user.departmentCode === 'BB' &&
                              user.parentCompanyId === currentUser.id
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </>
              )}

            {/* Onboarding Progress */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
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
                🚀 Onboarding Progress
              </h4>

              {/* Role-based onboarding status */}
              {currentUser.departmentCode === 'MGR' ? (
                // Admin/Manager view - shows team overview
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#3b82f6',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      7
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '10px',
                      }}
                    >
                      🔄 Active Workflows
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      3
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '10px',
                      }}
                    >
                      ⏳ Pending Approvals
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      12
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '10px',
                      }}
                    >
                      ✅ Completed
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#ef4444',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      2
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '10px',
                      }}
                    >
                      ⚠️ Stuck/Delayed
                    </div>
                  </div>
                </div>
              ) : currentUser.departmentCode === 'DM' ? (
                // Driver view - shows individual progress
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      DRIVER ONBOARDING
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      100% COMPLETE
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      height: '8px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        height: '100%',
                        width: '100%',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                  <div
                    style={{ display: 'flex', gap: '8px', fontSize: '10px' }}
                  >
                    <span style={{ color: '#10b981' }}>✅ Profile Setup</span>
                    <span style={{ color: '#10b981' }}>✅ Document Upload</span>
                    <span style={{ color: '#10b981' }}>
                      ✅ Equipment Assignment
                    </span>
                    <span style={{ color: '#10b981' }}>✅ Portal Access</span>
                  </div>
                </div>
              ) : currentUser.departmentCode === 'BB' ||
                currentUser.departmentCode === 'DC' ||
                currentUser.departmentCode === 'MGR' ||
                currentUser.departmentCode === 'CS' ? (
                // Internal Staff view - shows ICA onboarding progress
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      ICA ONBOARDING
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {currentUser.departmentCode === 'MGR'
                        ? '100% COMPLETE'
                        : currentUser.departmentCode === 'BB'
                          ? '70% COMPLETE'
                          : currentUser.departmentCode === 'DC'
                            ? '40% COMPLETE'
                            : '20% COMPLETE'}
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      height: '8px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        background:
                          currentUser.departmentCode === 'MGR'
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : currentUser.departmentCode === 'BB'
                              ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                              : currentUser.departmentCode === 'DC'
                                ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                : 'linear-gradient(90deg, #ef4444, #dc2626)',
                        height: '100%',
                        width:
                          currentUser.departmentCode === 'MGR'
                            ? '100%'
                            : currentUser.departmentCode === 'BB'
                              ? '70%'
                              : currentUser.departmentCode === 'DC'
                                ? '40%'
                                : '20%',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      fontSize: '9px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅ Personal Info</span>
                    <span style={{ color: '#10b981' }}>✅ Experience</span>
                    <span
                      style={{
                        color:
                          currentUser.departmentCode === 'CS'
                            ? 'rgba(255, 255, 255, 0.4)'
                            : '#10b981',
                      }}
                    >
                      {currentUser.departmentCode === 'CS' ? '⏳' : '✅'}{' '}
                      Background
                    </span>
                    <span
                      style={{
                        color:
                          currentUser.departmentCode === 'CS' ||
                          currentUser.departmentCode === 'DC'
                            ? 'rgba(255, 255, 255, 0.4)'
                            : '#10b981',
                      }}
                    >
                      {currentUser.departmentCode === 'CS' ||
                      currentUser.departmentCode === 'DC'
                        ? '⏳'
                        : '✅'}{' '}
                      Documents
                    </span>
                    <span
                      style={{
                        color:
                          currentUser.departmentCode !== 'MGR'
                            ? 'rgba(255, 255, 255, 0.4)'
                            : '#10b981',
                      }}
                    >
                      {currentUser.departmentCode !== 'MGR' ? '⏳' : '✅'} ICA
                      Signed
                    </span>
                    <span
                      style={{
                        color:
                          currentUser.departmentCode !== 'MGR'
                            ? 'rgba(255, 255, 255, 0.4)'
                            : '#10b981',
                      }}
                    >
                      {currentUser.departmentCode !== 'MGR' ? '⏳' : '✅'}{' '}
                      Training
                    </span>
                  </div>

                  {/* ICA Onboarding Button for Incomplete Users */}
                  {currentUser.departmentCode !== 'MGR' && (
                    <button
                      onClick={() =>
                        handleStartContractorOnboarding(currentUser)
                      }
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #d946ef, #c026d3)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      📄 Complete ICA Onboarding
                    </button>
                  )}
                </div>
              ) : (
                // Carrier view - shows own progress
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      CARRIER ONBOARDING
                    </span>
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      66% COMPLETE
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      height: '8px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        height: '100%',
                        width: '66%',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                  <div
                    style={{ display: 'flex', gap: '8px', fontSize: '10px' }}
                  >
                    <span style={{ color: '#10b981' }}>
                      ✅ FMCSA Verification
                    </span>
                    <span style={{ color: '#10b981' }}>✅ Travel Limits</span>
                    <span style={{ color: '#10b981' }}>✅ Documents</span>
                    <span style={{ color: '#f59e0b' }}>🔄 Factoring</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                      ⏳ Agreements
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                      ⏳ Portal
                    </span>
                  </div>
                </div>
              )}

              {/* Recent onboarding activity */}
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '10px',
                    fontWeight: '600',
                    marginBottom: '6px',
                  }}
                >
                  RECENT ACTIVITY
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {currentUser.departmentCode === 'DM'
                    ? '✅ Driver portal access activated (2 hours ago)'
                    : currentUser.departmentCode === 'MGR'
                      ? '✅ ICA onboarding completed successfully (1 hour ago)'
                      : currentUser.departmentCode === 'BB'
                        ? '📝 Independent Contractor Agreement signed (3 hours ago)'
                        : currentUser.departmentCode === 'DC'
                          ? '🔍 Background check completed (1 day ago)'
                          : currentUser.departmentCode === 'CS'
                            ? '📄 Personal information submitted for review (2 days ago)'
                            : '📄 Insurance certificate uploaded for review (4 hours ago)'}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
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
                      {(currentUser as any)?.emergencyContact?.name ||
                        'Not provided'}
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
                      {(currentUser as any)?.emergencyContact?.relation ||
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
                      {(currentUser as any)?.emergencyContact?.phone ||
                        'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Alternative Phone Badge - Only show if exists */}
                {(currentUser as any)?.emergencyContact?.altPhone && (
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
                        {(currentUser as any)?.emergencyContact?.altPhone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* EXPANDABLE KPI Access Granting System */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>🔐 Access Granting System</span>
                {hasUnsavedChanges() && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#fbbf24',
                        fontWeight: '600',
                      }}
                    >
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
                        transition: 'all 0.2s ease',
                      }}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                )}
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {Object.entries(permissionCategories).map(
                  ([categoryKey, category]) => {
                    // Calculate total sections across all sub-pages
                    const totalSections = Object.values(
                      category.subPages
                    ).reduce(
                      (total, subPage) => total + subPage.sections.length,
                      0
                    );
                    const grantedSections = Object.values(
                      category.subPages
                    ).reduce((granted, subPage) => {
                      return (
                        granted +
                        subPage.sections.filter(
                          (section: string) => userPermissions[section]
                        ).length
                      );
                    }, 0);
                    const isExpanded =
                      expandedPermissionCategory === categoryKey;

                    return (
                      <div
                        key={categoryKey}
                        onClick={() =>
                          setExpandedPermissionCategory(
                            isExpanded ? null : categoryKey
                          )
                        }
                        style={{
                          background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          border: `1px solid ${category.color}`,
                          cursor: 'pointer',
                          transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                          boxShadow: isExpanded
                            ? `0 4px 12px ${category.color}40`
                            : 'none',
                        }}
                      >
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '11px',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                          }}
                        >
                          {category.icon} {category.name}
                          <span style={{ fontSize: '8px' }}>
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '8px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: '600',
                          }}
                        >
                          {grantedSections}/{totalSections} GRANTED
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Expanded Permission Details with Hierarchical Sub-Pages */}
              {expandedPermissionCategory && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${(permissionCategories as any)[expandedPermissionCategory].color}20, ${(permissionCategories as any)[expandedPermissionCategory].color}10)`,
                    border: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}60`,
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '12px',
                  }}
                >
                  <h5
                    style={{
                      color: 'white',
                      margin: '0 0 16px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {
                      (permissionCategories as any)[expandedPermissionCategory]
                        .icon
                    }{' '}
                    {
                      (permissionCategories as any)[expandedPermissionCategory]
                        .name
                    }{' '}
                    - Access Control
                  </h5>

                  {/* Sub-Pages with Retractable Sections */}
                  {Object.entries(
                    (permissionCategories as any)[expandedPermissionCategory]
                      .subPages
                  ).map(([subPageKey, subPage]: [string, any]) => {
                    const isSubPageExpanded =
                      expandedSubPages[
                        `${expandedPermissionCategory}-${subPageKey}`
                      ];
                    const grantedInSubPage = subPage.sections.filter(
                      (section: string) => userPermissions[section]
                    ).length;
                    const allGranted =
                      grantedInSubPage === subPage.sections.length;

                    return (
                      <div
                        key={subPageKey}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}40`,
                          borderRadius: '6px',
                          marginBottom: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Sub-Page Header */}
                        <div
                          onClick={() =>
                            toggleSubPage(
                              `${expandedPermissionCategory}-${subPageKey}`
                            )
                          }
                          style={{
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isSubPageExpanded
                              ? `${(permissionCategories as any)[expandedPermissionCategory].color}20`
                              : 'transparent',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            {subPage.icon} {subPage.name}
                            <span
                              style={{
                                fontSize: '8px',
                                background: allGranted
                                  ? '#10b981'
                                  : grantedInSubPage > 0
                                    ? '#f59e0b'
                                    : '#6b7280',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {grantedInSubPage}/{subPage.sections.length}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            {isSubPageExpanded ? '▼' : '▶'}
                          </div>
                        </div>

                        {/* Expanded Sub-Page Sections */}
                        {isSubPageExpanded && (
                          <div
                            style={{
                              padding: '16px',
                              background: 'rgba(0, 0, 0, 0.1)',
                              borderTop: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}30`,
                            }}
                          >
                            {/* Grant All Toggle */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: `${(permissionCategories as any)[expandedPermissionCategory].color}20`,
                                borderRadius: '4px',
                                marginBottom: '12px',
                                border: `1px solid ${(permissionCategories as any)[expandedPermissionCategory].color}50`,
                              }}
                            >
                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                }}
                              >
                                🎯 Grant All {subPage.name} Access
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGrantAllSubPage(
                                    `${expandedPermissionCategory}-${subPageKey}`,
                                    subPage.sections
                                  );
                                }}
                                style={{
                                  background: allGranted
                                    ? '#10b981'
                                    : '#6b7280',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '9px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {allGranted ? '✅ ALL GRANTED' : '❌ GRANT ALL'}
                              </button>
                            </div>

                            {/* Individual Section Toggles */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '8px',
                              }}
                            >
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
                                      border: `1px solid ${
                                        hasAccess
                                          ? (permissionCategories as any)[
                                              expandedPermissionCategory
                                            ].color
                                          : '#6b7280'
                                      }66`,
                                      borderRadius: '4px',
                                      padding: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: 'white',
                                        fontSize: '9px',
                                        fontWeight: '600',
                                      }}
                                    >
                                      {getPermissionDisplayName(section)}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '8px',
                                        fontWeight: 'bold',
                                        color: hasAccess
                                          ? '#10b981'
                                          : '#ef4444',
                                      }}
                                    >
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

            {/* AI Flow Lead Generation Status - For Brokers and Dispatchers */}
            {(currentUser?.departmentCode === 'BB' ||
              currentUser?.departmentCode === 'DC') && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
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

                {/* Check if user has AI Flow status data */}
                {currentUser.aiFlowStatus ? (
                  <div
                    style={{
                      background: currentUser.aiFlowStatus.isOptedIn
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: `1px solid ${currentUser.aiFlowStatus.isOptedIn ? '#10b981' : '#ef4444'}`,
                      position: 'relative',
                    }}
                  >
                    {/* Status Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: currentUser.aiFlowStatus.isOptedIn
                          ? '12px'
                          : '0',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: currentUser.aiFlowStatus.isOptedIn
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'linear-gradient(135deg, #ef4444, #dc2626)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                          }}
                        >
                          {currentUser.aiFlowStatus.isOptedIn ? '✅' : '❌'}
                        </div>
                        <div>
                          <div
                            style={{
                              color: currentUser.aiFlowStatus.isOptedIn
                                ? '#10b981'
                                : '#ef4444',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            {currentUser.aiFlowStatus.isOptedIn
                              ? 'OPTED IN'
                              : 'OPTED OUT'}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '11px',
                            }}
                          >
                            Status:{' '}
                            {currentUser.aiFlowStatus.status?.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={() => {
                          const newStatus = !currentUser.aiFlowStatus.isOptedIn;
                          // Update user status
                          setUsers((prevUsers) =>
                            prevUsers.map((user) =>
                              user.id === currentUser.id
                                ? {
                                    ...user,
                                    aiFlowStatus: {
                                      ...user.aiFlowStatus,
                                      isOptedIn: newStatus,
                                      status: newStatus ? 'active' : 'inactive',
                                      optInDate: newStatus
                                        ? new Date().toISOString().split('T')[0]
                                        : user.aiFlowStatus?.optInDate,
                                    },
                                  }
                                : user
                            )
                          );
                          alert(
                            `AI Flow Lead Generation ${newStatus ? 'enabled' : 'disabled'} for ${currentUser.name}`
                          );
                        }}
                        style={{
                          background: currentUser.aiFlowStatus.isOptedIn
                            ? '#ef4444'
                            : '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {currentUser.aiFlowStatus.isOptedIn
                          ? 'Opt Out'
                          : 'Opt In'}
                      </button>
                    </div>

                    {/* Opted In Performance Details */}
                    {currentUser.aiFlowStatus.isOptedIn && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '6px',
                          padding: '8px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              marginBottom: '2px',
                            }}
                          >
                            AGREEMENT
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            {currentUser.aiFlowStatus.agreementNumber}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '8px',
                            }}
                          >
                            {currentUser.aiFlowStatus.optInDate}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              marginBottom: '2px',
                            }}
                          >
                            LEADS
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            {currentUser.aiFlowStatus.leadCount}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '8px',
                            }}
                          >
                            {currentUser.aiFlowStatus.conversionRate} conversion
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              marginBottom: '2px',
                            }}
                          >
                            REVENUE
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            {currentUser.aiFlowStatus.monthlyRevenue}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '8px',
                            }}
                          >
                            Commission:{' '}
                            {currentUser.aiFlowStatus.commissionOwed}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              marginBottom: '2px',
                            }}
                          >
                            TIER
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            {currentUser.aiFlowStatus.performanceTier}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '8px',
                            }}
                          >
                            Last: {currentUser.aiFlowStatus.lastLeadDate}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Opted Out Message */}
                    {!currentUser.aiFlowStatus.isOptedIn && (
                      <div
                        style={{
                          color: '#dc2626',
                          fontSize: '12px',
                          fontWeight: '500',
                          marginTop: '8px',
                        }}
                      >
                        ⚠️ Not receiving AI-generated leads or subject to{' '}
                        {currentUser?.departmentCode === 'DC' ? '25%' : '50%'}
                        revenue sharing agreement.
                      </div>
                    )}

                    {/* Performance Alert */}
                    {currentUser.aiFlowStatus.isOptedIn &&
                      parseFloat(currentUser.aiFlowStatus.conversionRate) <
                        15 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '8px',
                            background: '#fbbf24',
                            color: '#92400e',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
                          }}
                        >
                          ⚠️ LOW CONVERSION
                        </div>
                      )}
                  </div>
                ) : (
                  // No AI Flow data - show setup option
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: '#60a5fa',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '8px',
                      }}
                    >
                      📋 AI Flow Lead Generation Not Configured
                    </div>
                    <button
                      onClick={() => {
                        // Initialize AI Flow status for this broker
                        setUsers((prevUsers) =>
                          prevUsers.map((user) =>
                            user.id === currentUser.id
                              ? {
                                  ...user,
                                  aiFlowStatus: {
                                    isOptedIn: false,
                                    optInDate: null,
                                    agreementSigned: false,
                                    agreementNumber: null,
                                    leadCount: 0,
                                    conversionRate: '0%',
                                    monthlyRevenue: '$0',
                                    commissionOwed: '$0',
                                    lastLeadDate: null,
                                    performanceTier: 'Not Active',
                                    status: 'inactive',
                                  },
                                }
                              : user
                          )
                        );
                      }}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Set Up AI Flow
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Portal Invitation Status */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>🔗 Portal Invitation Status</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      background: 'rgba(59, 130, 246, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📧 Send Invitation
                  </button>
                  <button
                    style={{
                      background: 'rgba(251, 191, 36, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Resend
                  </button>
                </div>
              </h4>

              {/* Mock invitation status - in production this would come from the invitation service */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Invitation Status:</strong>
                    <span
                      style={{
                        color:
                          currentUser?.status === 'active'
                            ? '#10b981'
                            : '#fbbf24',
                        marginLeft: '4px',
                        fontWeight: 'bold',
                      }}
                    >
                      {currentUser?.status === 'active'
                        ? '✅ Setup Completed'
                        : '⏳ Pending Setup'}
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Portal Access:</strong>
                    <span
                      style={{
                        color:
                          currentUser?.status === 'active'
                            ? '#10b981'
                            : '#6b7280',
                        marginLeft: '4px',
                      }}
                    >
                      {currentUser?.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Login Created:</strong>{' '}
                    {currentUser?.status === 'active' ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Invitation Sent:</strong>{' '}
                    {formatDate(currentUser?.hiredDate)}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Setup Completed:</strong>{' '}
                    {currentUser?.status === 'active'
                      ? formatDate(currentUser?.lastActive)
                      : 'Not completed'}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Last Login:</strong>{' '}
                    {currentUser?.status === 'active'
                      ? formatDate(currentUser?.lastActive)
                      : 'Never'}
                  </div>
                </div>
              </div>

              {/* Notification when user completes setup */}
              {currentUser?.status === 'active' && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    borderRadius: '6px',
                    padding: '8px',
                    marginTop: '12px',
                    fontSize: '11px',
                    color: '#10b981',
                    fontWeight: '600',
                  }}
                >
                  🎉 User has successfully created their login profile and
                  completed portal setup!
                </div>
              )}

              {currentUser?.status !== 'active' && (
                <div
                  style={{
                    background: 'rgba(251, 191, 36, 0.2)',
                    border: '1px solid #fbbf24',
                    borderRadius: '6px',
                    padding: '8px',
                    marginTop: '12px',
                    fontSize: '11px',
                    color: '#fbbf24',
                    fontWeight: '600',
                  }}
                >
                  ⏳ Waiting for user to complete their account setup via
                  invitation email...
                </div>
              )}
            </div>

            {/* Notes */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
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
                📝 Notes
              </h4>
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line',
                }}
              >
                {(currentUser as any)?.notes}
              </div>
            </div>

            {/* COMPREHENSIVE WORKFLOW TRACKING - 5-7 Step Process Checklist */}
            {workflow && (
              <div style={{ marginTop: '20px' }}>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  {isDriver
                    ? '🚛 Carrier Onboarding Progress'
                    : '🤝 Contractor Onboarding Progress'}
                </h4>

                {/* Overall Progress Summary */}
                <div
                  style={{
                    background:
                      workflow?.status === 'completed'
                        ? 'linear-gradient(135deg, #dc2626, #059669)'
                        : 'linear-gradient(135deg, #eab308, #ca8a04)',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: `1px solid ${workflow?.status === 'completed' ? '#dc2626' : '#fbbf24'}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <h5
                      style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      📋 Overall Progress ({workflow?.status?.toUpperCase()})
                    </h5>
                    <span
                      style={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {workflow?.progressPercentage}%
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      height: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        height: '100%',
                        width: `${workflow?.progressPercentage}%`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>

                {/* DETAILED STEP-BY-STEP CHECKLIST */}
                <div style={{ marginBottom: '16px' }}>
                  <h5
                    style={{
                      color: 'white',
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    📝 Step-by-Step Checklist
                  </h5>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {workflow?.steps?.map((step: any) => (
                      <div
                        key={step.id}
                        style={{
                          background:
                            step.status === 'completed'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : step.status === 'in_progress'
                                ? 'rgba(251, 191, 36, 0.2)'
                                : 'rgba(107, 114, 128, 0.2)',
                          borderRadius: '8px',
                          padding: '12px',
                          border: `1px solid ${
                            step.status === 'completed'
                              ? '#dc2626'
                              : step.status === 'in_progress'
                                ? '#fbbf24'
                                : '#6b7280'
                          }66`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>
                          {getWorkflowStepIcon(step.status)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '12px',
                            }}
                          >
                            {step.name}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '10px',
                            }}
                          >
                            {step.status}
                            {step.completedAt &&
                              ` • ${formatDate(step.completedAt)}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DOCUMENT STATUS & TRAINING/VEHICLE PROGRESS */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {/* Document Status Tracking */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <h5
                      style={{
                        color: 'white',
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      📄 Documents Status
                    </h5>
                    <div style={{ display: 'grid', gap: '4px' }}>
                      {workflow?.documents?.map((doc: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '4px 0',
                            fontSize: '10px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
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
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    {isDriver ? (
                      <>
                        <h5
                          style={{
                            color: 'white',
                            margin: '0 0 8px 0',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          🚚 Vehicle & Compliance
                        </h5>
                        <div style={{ fontSize: '9px' }}>
                          {(workflow as any)?.vehicleAssignment && (
                            <>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  marginBottom: '2px',
                                }}
                              >
                                <strong>Truck:</strong> #
                                {
                                  (workflow as any).vehicleAssignment
                                    .truckNumber
                                }
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  marginBottom: '2px',
                                }}
                              >
                                <strong>Trailer:</strong>{' '}
                                {
                                  (workflow as any).vehicleAssignment
                                    .trailerType
                                }
                              </div>
                            </>
                          )}
                          {(workflow as any)?.compliance && (
                            <>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  marginBottom: '2px',
                                }}
                              >
                                <strong>DOT:</strong>{' '}
                                {(workflow as any).compliance.dotNumber}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                <strong>SAFER Score:</strong>{' '}
                                {(workflow as any).compliance.saferScore}/100
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h5
                          style={{
                            color: 'white',
                            margin: '0 0 8px 0',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          📚 Training Progress (
                          {(workflow as any)?.training?.overallProgress || 0}%)
                        </h5>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '4px',
                            height: '4px',
                            overflow: 'hidden',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              background:
                                'linear-gradient(135deg, #f4a832, #2563eb)',
                              height: '100%',
                              width: `${(workflow as any)?.training?.overallProgress || 0}%`,
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '9px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '2px',
                            }}
                          >
                            <strong>Required:</strong>{' '}
                            {(workflow as any)?.training?.required?.length || 0}{' '}
                            modules
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '2px',
                            }}
                          >
                            <strong>Completed:</strong>{' '}
                            {(workflow as any)?.training?.completed?.length ||
                              0}{' '}
                            modules
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            <strong>In Progress:</strong>{' '}
                            {(workflow as any)?.training?.inProgress?.length ||
                              0}{' '}
                            modules
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Training Management & Workflow Status - Role-Based */}
            <div
              style={{
                background:
                  currentUser.departmentCode === 'DM'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(245, 158, 11, 0.1)',
                border:
                  currentUser.departmentCode === 'DM'
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <h4
                style={{
                  color:
                    currentUser.departmentCode === 'DM' ? '#10b981' : '#f59e0b',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {currentUser.departmentCode === 'DM'
                  ? '🚛 Driver Onboarding & OTR Access'
                  : '🎓 FleetFlow University℠ Training Management'}
              </h4>

              {!userWorkflowData[currentUser.id] ? (
                <div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                    }}
                  >
                    {currentUser.departmentCode === 'DM'
                      ? 'Initialize driver onboarding workflow to begin carrier onboarding process.'
                      : 'Initialize training workflow to assign FleetFlow University℠ modules.'}
                  </p>
                  <button
                    onClick={() =>
                      handleAutoAssignTraining(
                        currentUser.id,
                        currentUser.departmentCode
                      )
                    }
                    style={{
                      background:
                        currentUser.departmentCode === 'DM'
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {currentUser.departmentCode === 'DM'
                      ? '🚛 Start Driver Onboarding'
                      : '🎓 Grant University Access'}
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                        }}
                      >
                        Workflow Status:
                      </span>
                      <span
                        style={{
                          background:
                            userWorkflowData[currentUser.id]?.workflowStatus ===
                            'active'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(245, 158, 11, 0.2)',
                          color:
                            userWorkflowData[currentUser.id]?.workflowStatus ===
                            'active'
                              ? '#10b981'
                              : '#f59e0b',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {userWorkflowData[
                          currentUser.id
                        ]?.workflowStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h5
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {currentUser.departmentCode === 'DM'
                        ? '📊 Driver Onboarding Progress:'
                        : '📊 Training Progress Overview:'}
                    </h5>
                    {currentUser.departmentCode === 'DM' ? (
                      // Driver onboarding progress
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: '#10b981' }}>
                          📋 Current Step:{' '}
                          {userWorkflowData[currentUser.id]
                            ?.carrierOnboardingStatus?.currentStep || 1}{' '}
                          of 6
                        </span>
                        <span style={{ color: '#3b82f6' }}>
                          ✅ Completed Steps:{' '}
                          {userWorkflowData[currentUser.id]
                            ?.carrierOnboardingStatus?.completedSteps?.length ||
                            0}
                        </span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          📊 Overall:{' '}
                          {userWorkflowData[currentUser.id]
                            ?.carrierOnboardingStatus?.overallProgress || 0}
                          %
                        </span>
                      </div>
                    ) : (
                      // FleetFlow University training progress
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: '#10b981' }}>
                          ✅ Completed:{' '}
                          {userWorkflowData[
                            currentUser.id
                          ]?.trainingProgress?.filter(
                            (p) => p.status === 'completed'
                          ).length || 0}
                        </span>
                        <span style={{ color: '#3b82f6' }}>
                          📚 In Progress:{' '}
                          {userWorkflowData[
                            currentUser.id
                          ]?.trainingProgress?.filter(
                            (p) => p.status === 'in_progress'
                          ).length || 0}
                        </span>
                        <span style={{ color: '#f59e0b' }}>
                          ⏳ Pending:{' '}
                          {userWorkflowData[
                            currentUser.id
                          ]?.trainingProgress?.filter(
                            (p) => p.status === 'not_started'
                          ).length || 0}
                        </span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          📋 Overall:{' '}
                          {Math.round(
                            ((userWorkflowData[
                              currentUser.id
                            ]?.trainingProgress?.filter(
                              (p) => p.status === 'completed'
                            ).length || 0) /
                              (userWorkflowData[currentUser.id]
                                ?.trainingProgress?.length || 1)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h5
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {currentUser.departmentCode === 'DM'
                        ? '📋 Onboarding Steps:'
                        : '📚 Assigned Training Modules:'}
                    </h5>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                    >
                      {currentUser.departmentCode === 'DM'
                        ? // Driver onboarding steps
                          [
                            'FMCSA Verification',
                            'Travel Limits',
                            'Documents',
                            'Factoring',
                            'Agreements',
                            'Portal Setup',
                          ].map((step, index) => {
                            const isCompleted = (
                              userWorkflowData[currentUser.id]
                                ?.carrierOnboardingStatus?.completedSteps || []
                            ).includes(step);
                            const isCurrent =
                              (userWorkflowData[currentUser.id]
                                ?.carrierOnboardingStatus?.currentStep || 1) ===
                              index + 1;
                            return (
                              <span
                                key={index}
                                style={{
                                  background: isCompleted
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : isCurrent
                                      ? 'rgba(59, 130, 246, 0.2)'
                                      : 'rgba(107, 114, 128, 0.2)',
                                  color: isCompleted
                                    ? '#10b981'
                                    : isCurrent
                                      ? '#3b82f6'
                                      : '#6b7280',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                }}
                              >
                                {isCompleted ? '✅' : isCurrent ? '🔄' : '⏳'}{' '}
                                {step}
                              </span>
                            );
                          })
                        : // FleetFlow University training modules
                          userWorkflowData[
                            currentUser.id
                          ]?.trainingAssignments?.map((assignment, index) => (
                            <span
                              key={index}
                              style={{
                                background:
                                  assignment.status === 'completed'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(59, 130, 246, 0.2)',
                                color:
                                  assignment.status === 'completed'
                                    ? '#10b981'
                                    : '#3b82f6',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '500',
                              }}
                            >
                              {assignment.moduleName}
                            </span>
                          )) || []}
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                  >
                    {currentUser.departmentCode === 'DM' ? (
                      // Driver/Carrier action buttons
                      <>
                        <button
                          onClick={() =>
                            handleAutoAssignTraining(
                              currentUser.id,
                              currentUser.departmentCode
                            )
                          }
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          🚛 Continue Driver Onboarding
                        </button>
                        <button
                          onClick={() =>
                            alert(
                              'Driver OTR Flow access will be granted upon onboarding completion'
                            )
                          }
                          style={{
                            background:
                              'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📱 Driver OTR Flow Access
                        </button>
                      </>
                    ) : (
                      // Internal staff action buttons
                      <>
                        <button
                          onClick={() =>
                            handleAutoAssignTraining(
                              currentUser.id,
                              currentUser.departmentCode
                            )
                          }
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          🎓 Grant FleetFlow Training Access
                        </button>
                        <button
                          onClick={() =>
                            alert('Custom training selection coming soon!')
                          }
                          style={{
                            background:
                              'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📝 Custom Training Access (Coming Soon)
                        </button>
                        {currentUser.departmentCode !== 'MGR' && (
                          <button
                            onClick={() =>
                              handleStartContractorOnboarding(currentUser)
                            }
                            style={{
                              background:
                                'linear-gradient(135deg, #d946ef, #c026d3)',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            📄 Complete ICA Onboarding
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Subscription Management */}
            <div
              style={{
                marginBottom: '20px',
              }}
            >
              <UserSubscriptionManager
                userId={'DEFAULT-USER-001'}
                isCompact={true}
              />
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <button
                style={{
                  background: 'rgba(16, 185, 129, 0.8)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                ✏️ Edit User
              </button>
              <button
                style={{
                  background: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                📋 View Full Details
              </button>
              <button
                style={{
                  background: 'rgba(239, 68, 68, 0.8)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                🗑️
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                🔮 Prospective Permissions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contractor Onboarding Modal */}
      {showContractorOnboarding && onboardingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <ContractorOnboardingWorkflow
              contractorData={onboardingUser}
              onComplete={handleContractorOnboardingComplete}
              onCancel={handleContractorOnboardingCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
