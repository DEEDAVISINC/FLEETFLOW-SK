// Comprehensive Granular Access Control System
// This system provides fine-grained permission control for every area of the application

import { User, UserRole } from './access';

// ============================================================================
// GRANULAR PERMISSION DEFINITIONS
// ============================================================================

// Page-level permissions - REAL FLEETFLOW BUSINESS OPERATIONS
export interface PagePermissions {
  dispatchCentral: DispatchCentralPermissions;
  brokerBox: BrokerBoxPermissions;
  freightQuoting: FreightQuotingPermissions;
  carrierPortal: CarrierPortalPermissions;
  fleetManagement: FleetManagementPermissions;
  shipperPortfolio: ShipperPortfolioPermissions;
  routeOptimization: RouteOptimizationPermissions;
  maintenance: MaintenancePermissions;
  compliance: CompliancePermissions;
  accounting: AccountingPermissions;
  notificationHub: NotificationHubPermissions;
  scheduling: SchedulingPermissions;
  fleetFlowUniversity: FleetFlowUniversityPermissions;
  freightFlowRfx: FreightFlowRfxPermissions;
  aiFlow: AiFlowPermissions;
  documentation: DocumentationPermissions;
}

// Dispatch Central - Load management and assignments
export interface DispatchCentralPermissions {
  canViewPage: boolean;
  canViewAllLoads: boolean;
  canCreateNewLoad: boolean;
  canAssignDrivers: boolean;
  canEditLoadStatus: boolean;
  canViewDriverStatus: boolean;
  canDispatchLoads: boolean;
  canViewWorkflowStatus: boolean;
  canOverrideWorkflow: boolean;
  canViewLoadHistory: boolean;
  canExportLoadData: boolean;
  canManageEmergencies: boolean;
}

// Broker Box - Broker operations and RFx responses
export interface BrokerBoxPermissions {
  canViewPage: boolean;
  canCreateLoads: boolean;
  canManageCustomers: boolean;
  canGenerateQuotes: boolean;
  canViewRfxResponses: boolean;
  canProcessPayments: boolean;
}

// Freight Quoting - Rate calculations and quotes
export interface FreightQuotingPermissions {
  canViewPage: boolean;
  canCreateQuotes: boolean;
  canEditRates: boolean;
  canViewPricing: boolean;
}

// Carrier Portal - Driver/carrier load board
export interface CarrierPortalPermissions {
  canViewPage: boolean;
  canViewAvailableLoads: boolean;
  canBookLoads: boolean;
  canUpdateStatus: boolean;
}

// Fleet Management - Vehicles, drivers, equipment
export interface FleetManagementPermissions {
  canViewPage: boolean;
  canManageVehicles: boolean;
  canManageDrivers: boolean;
  canViewPerformance: boolean;
}

// Shipper Portfolio - Customer management
export interface ShipperPortfolioPermissions {
  canViewPage: boolean;
  canManageShippers: boolean;
  canViewContracts: boolean;
  canGenerateReports: boolean;
}

// Route Optimization - Route planning
export interface RouteOptimizationPermissions {
  canViewPage: boolean;
  canPlanRoutes: boolean;
  canOptimize: boolean;
  canViewMaps: boolean;
}

// Compliance - DOT compliance
export interface CompliancePermissions {
  canViewPage: boolean;
  canManageForms: boolean;
  canViewViolations: boolean;
  canGenerateReports: boolean;
}

// Accounting - Financial operations
export interface AccountingPermissions {
  canViewPage: boolean;
  canProcessPayments: boolean;
  canViewFinancials: boolean;
  canGenerateInvoices: boolean;
}

// Notification Hub - Alerts system
export interface NotificationHubPermissions {
  canViewPage: boolean;
  canSendNotifications: boolean;
  canManageAlerts: boolean;
  canViewHistory: boolean;
}

// Scheduling - Appointments
export interface SchedulingPermissions {
  canViewPage: boolean;
  canScheduleAppointments: boolean;
  canManageCalendar: boolean;
  canViewSchedules: boolean;
}

// FleetFlow University - Training
export interface FleetFlowUniversityPermissions {
  canViewPage: boolean;
  canAccessCourses: boolean;
  canManageTraining: boolean;
  canViewProgress: boolean;
}

// FreightFlow RFx - Competitive intelligence
export interface FreightFlowRfxPermissions {
  canViewPage: boolean;
  canViewRfx: boolean;
  canRespondToRfx: boolean;
  canAnalyzeMarket: boolean;
}

// AI Flow - Automation platform
export interface AiFlowPermissions {
  canViewPage: boolean;
  canConfigureAI: boolean;
  canViewAutomation: boolean;
  canManageWorkflows: boolean;
}

// Documentation - Document generation
export interface DocumentationPermissions {
  canViewPage: boolean;
  canGenerateDocs: boolean;
  canManageTemplates: boolean;
  canViewLibrary: boolean;
}

// ============================================================================
// GRANULAR PERMISSION IMPLEMENTATION
// ============================================================================

// Financial page granular permissions
export interface FinancialPermissions {
  canViewPage: boolean;
  canViewInvoices: boolean;
  canCreateInvoices: boolean;
  canEditInvoices: boolean;
  canDeleteInvoices: boolean;
  canViewPayments: boolean;
  canProcessPayments: boolean;
  canViewExpenses: boolean;
  canCreateExpenses: boolean;
  canEditExpenses: boolean;
  canViewProfitLoss: boolean;
  canViewCashFlow: boolean;
  canViewTaxReports: boolean;
  canExportFinancialData: boolean;
  canViewBankingInfo: boolean;
  canManageAccounts: boolean;
  canViewAuditTrail: boolean;
}

// Training page granular permissions
export interface TrainingPermissions {
  canViewPage: boolean;
  canViewOwnProgress: boolean;
  canViewAllProgress: boolean;
  canTakeQuizzes: boolean;
  canViewCertificates: boolean;
  canDownloadCertificates: boolean;
  canManageTrainingContent: boolean;
  canAssignTrainingModules: boolean;
  canViewTrainingAnalytics: boolean;
  canCreateCustomTraining: boolean;
  canManageInstructors: boolean;
  canViewTrainingHistory: boolean;
  assignedModules: string[]; // Specific modules user can access
}

// Settings page granular permissions
export interface SettingsPermissions {
  canViewPage: boolean;
  canViewUserManagement: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canManagePermissions: boolean;
  canViewSystemSettings: boolean;
  canEditSystemSettings: boolean;
  canViewSecuritySettings: boolean;
  canEditSecuritySettings: boolean;
  canViewIntegrationSettings: boolean;
  canEditIntegrationSettings: boolean;
  canViewAuditLogs: boolean;
  canExportUserData: boolean;
  canManageRoles: boolean;
  canViewSystemHealth: boolean;
}

// Reports page granular permissions
export interface ReportsPermissions {
  canViewPage: boolean;
  canViewOperationalReports: boolean;
  canViewFinancialReports: boolean;
  canViewPerformanceReports: boolean;
  canViewComplianceReports: boolean;
  canCreateCustomReports: boolean;
  canScheduleReports: boolean;
  canExportReports: boolean;
  canViewHistoricalReports: boolean;
  canShareReports: boolean;
  canManageReportTemplates: boolean;
}

// Workflow page granular permissions
export interface WorkflowPermissions {
  canViewPage: boolean;
  canViewWorkflowTemplates: boolean;
  canCreateWorkflows: boolean;
  canEditWorkflows: boolean;
  canDeleteWorkflows: boolean;
  canExecuteWorkflows: boolean;
  canViewWorkflowHistory: boolean;
  canManageAutomations: boolean;
  canViewWorkflowAnalytics: boolean;
  canConfigureNotifications: boolean;
}

// Notifications page granular permissions
export interface NotificationPermissions {
  canViewPage: boolean;
  canViewAllNotifications: boolean;
  canViewOwnNotifications: boolean;
  canCreateNotifications: boolean;
  canEditNotifications: boolean;
  canDeleteNotifications: boolean;
  canManageNotificationSettings: boolean;
  canViewNotificationHistory: boolean;
  canConfigureAlerts: boolean;
}

// Documents page granular permissions
export interface DocumentPermissions {
  canViewPage: boolean;
  canViewAllDocuments: boolean;
  canViewOwnDocuments: boolean;
  canUploadDocuments: boolean;
  canEditDocuments: boolean;
  canDeleteDocuments: boolean;
  canDownloadDocuments: boolean;
  canShareDocuments: boolean;
  canManageDocumentCategories: boolean;
  canViewDocumentHistory: boolean;
  canSetDocumentPermissions: boolean;
}

// Maintenance page granular permissions
export interface MaintenancePermissions {
  canViewPage: boolean;
  canViewMaintenanceSchedule: boolean;
  canCreateMaintenanceRecords: boolean;
  canEditMaintenanceRecords: boolean;
  canDeleteMaintenanceRecords: boolean;
  canViewVehicleInformation: boolean;
  canEditVehicleInformation: boolean;
  canViewMaintenanceHistory: boolean;
  canScheduleMaintenance: boolean;
  canViewMaintenanceCosts: boolean;
  canManageMaintenanceProviders: boolean;
}

// Performance page granular permissions
export interface PerformancePermissions {
  canViewPage: boolean;
  canViewOwnPerformance: boolean;
  canViewTeamPerformance: boolean;
  canViewAllPerformance: boolean;
  canViewPerformanceMetrics: boolean;
  canViewPerformanceTrends: boolean;
  canSetPerformanceGoals: boolean;
  canViewPerformanceComparisons: boolean;
  canExportPerformanceData: boolean;
  canManagePerformanceReviews: boolean;
}

// Quoting page granular permissions
export interface QuotingPermissions {
  canViewPage: boolean;
  canCreateQuotes: boolean;
  canViewAllQuotes: boolean;
  canViewOwnQuotes: boolean;
  canEditQuotes: boolean;
  canDeleteQuotes: boolean;
  canSendQuotes: boolean;
  canViewQuoteHistory: boolean;
  canManageQuoteTemplates: boolean;
  canViewQuoteAnalytics: boolean;
  canApproveQuotes: boolean;
}

// Routes page granular permissions
export interface RoutePermissions {
  canViewPage: boolean;
  canViewAllRoutes: boolean;
  canViewAssignedRoutes: boolean;
  canCreateRoutes: boolean;
  canEditRoutes: boolean;
  canDeleteRoutes: boolean;
  canOptimizeRoutes: boolean;
  canViewRouteAnalytics: boolean;
  canManageRouteTemplates: boolean;
  canViewRouteHistory: boolean;
}

// Carrier Verification page granular permissions
export interface CarrierVerificationPermissions {
  canViewPage: boolean;
  canViewCarrierProfiles: boolean;
  canCreateCarrierProfiles: boolean;
  canEditCarrierProfiles: boolean;
  canDeleteCarrierProfiles: boolean;
  canVerifyCarriers: boolean;
  canViewVerificationHistory: boolean;
  canManageVerificationCriteria: boolean;
  canExportCarrierData: boolean;
  canViewCarrierPerformance: boolean;
}

// Shipper Portal page granular permissions  
export interface ShipperPortalPagePermissions {
  canViewPage: boolean;
  canViewShipperRequests: boolean;
  canCreateShipperRequests: boolean;
  canEditShipperRequests: boolean;
  canDeleteShipperRequests: boolean;
  canViewShipperHistory: boolean;
  canManageShipperAccounts: boolean;
  canViewShipperAnalytics: boolean;
  canCommunicateWithShippers: boolean;
}

// SMS Workflow page granular permissions
export interface SmsWorkflowPermissions {
  canViewPage: boolean;
  canViewSmsTemplates: boolean;
  canCreateSmsTemplates: boolean;
  canEditSmsTemplates: boolean;
  canDeleteSmsTemplates: boolean;
  canSendSms: boolean;
  canViewSmsHistory: boolean;
  canManageSmsAutomation: boolean;
  canViewSmsAnalytics: boolean;
  canConfigureSmsSettings: boolean;
}

// ============================================================================
// GRANULAR ACCESS CONTROL FUNCTIONS
// ============================================================================

/**
 * Get comprehensive page permissions for a user
 */
export function getUserPagePermissions(user: User, assignedPermissions?: string[]): PagePermissions {
  const role = user.role;
  const isAdmin = role === 'admin';
  const isManager = role === 'manager' || isAdmin;
  const isDispatcher = role === 'dispatcher' || isManager;
  const isBroker = role === 'broker';
  const isDriver = role === 'driver';

  // If user has assigned permissions, use those; otherwise use role defaults
  const hasPermission = (permission: string) => {
    if (assignedPermissions) {
      return assignedPermissions.includes(permission) || assignedPermissions.includes('all');
    }
    return false; // Default to false if no assigned permissions
  };

  return {
    dispatchCentral: {
      canViewPage: hasPermission('dispatch_central.view') || isDispatcher,
      canViewAllLoads: hasPermission('dispatch_central.view_loads') || isDispatcher,
      canCreateNewLoad: hasPermission('dispatch_central.create_loads') || isDispatcher,
      canAssignDrivers: hasPermission('dispatch_central.assign_drivers') || isDispatcher,
      canEditLoadStatus: hasPermission('dispatch_central.edit_loads') || isDispatcher,
      canViewDriverStatus: hasPermission('dispatch_central.view_loads') || isDispatcher,
      canDispatchLoads: hasPermission('dispatch_central.view_loads') || isDispatcher,
      canViewWorkflowStatus: hasPermission('dispatch_central.track_loads') || isDispatcher,
      canOverrideWorkflow: hasPermission('dispatch_central.workflow_override') || isManager,
      canViewLoadHistory: hasPermission('dispatch_central.view_loads') || isDispatcher,
      canExportLoadData: hasPermission('dispatch_central.view_loads') || isManager,
      canManageEmergencies: hasPermission('dispatch_central.emergency_management') || isManager,
    },

    brokerBox: {
      canViewPage: hasPermission('broker_box.view') || isBroker,
      canCreateLoads: hasPermission('broker_box.create_loads') || isBroker,
      canManageCustomers: hasPermission('broker_box.manage_customers') || isBroker,
      canGenerateQuotes: hasPermission('broker_box.generate_quotes') || isBroker,
      canViewRfxResponses: hasPermission('broker_box.view_rfx_responses') || isBroker,
      canProcessPayments: hasPermission('broker_box.process_payments') || isManager,
    },

    // Add other sections as needed for the remaining FleetFlow categories
    maintenance: {
      canViewPage: hasPermission('maintenance.view') || isDispatcher,
      canScheduleService: hasPermission('maintenance.schedule_service') || isDispatcher,
      canTrackRepairs: hasPermission('maintenance.track_repairs') || isDispatcher,
      canVendorManagement: hasPermission('maintenance.vendor_management') || isManager,
      canCostTracking: hasPermission('maintenance.cost_tracking') || isManager,
      canPredictiveAlerts: hasPermission('maintenance.predictive_alerts') || isDispatcher,
      canEditRateInformation: hasPermission('dispatch.edit_rates') || isManager,
      canViewCarrierInformation: hasPermission('dispatch.view_carriers') || isDispatcher,
      canManageLoadPriority: hasPermission('dispatch.manage_priority') || isDispatcher,
    },

    analytics: {
      canViewPage: hasPermission('analytics.view') || isManager,
      canViewRevenueAnalytics: hasPermission('analytics.revenue') || isManager,
      canViewPerformanceMetrics: hasPermission('analytics.performance') || isManager,
      canViewDriverAnalytics: hasPermission('analytics.drivers') || isManager,
      canViewRouteAnalytics: hasPermission('analytics.routes') || isManager,
      canViewCustomerAnalytics: hasPermission('analytics.customers') || isManager,
      canViewFinancialTrends: hasPermission('analytics.financial') || isManager,
      canViewOperationalMetrics: hasPermission('analytics.operational') || isManager,
      canExportAnalytics: hasPermission('analytics.export') || isManager,
      canCreateCustomReports: hasPermission('analytics.custom_reports') || isManager,
      canViewHistoricalData: hasPermission('analytics.historical') || isManager,
      canAccessRealTimeData: hasPermission('analytics.realtime') || isManager,
      canViewPredictiveAnalytics: hasPermission('analytics.predictive') || isAdmin,
      canViewBenchmarkData: hasPermission('analytics.benchmarks') || isManager,
    },

    financial: {
      canViewPage: hasPermission('financial.view') || isManager,
      canViewInvoices: hasPermission('financial.view_invoices') || isManager,
      canCreateInvoices: hasPermission('financial.create_invoices') || isManager,
      canEditInvoices: hasPermission('financial.edit_invoices') || isManager,
      canDeleteInvoices: hasPermission('financial.delete_invoices') || isAdmin,
      canViewPayments: hasPermission('financial.view_payments') || isManager,
      canProcessPayments: hasPermission('financial.process_payments') || isManager,
      canViewExpenses: hasPermission('financial.view_expenses') || isManager,
      canCreateExpenses: hasPermission('financial.create_expenses') || isManager,
      canEditExpenses: hasPermission('financial.edit_expenses') || isManager,
      canViewProfitLoss: hasPermission('financial.profit_loss') || isManager,
      canViewCashFlow: hasPermission('financial.cash_flow') || isManager,
      canViewTaxReports: hasPermission('financial.tax_reports') || isManager,
      canExportFinancialData: hasPermission('financial.export') || isManager,
      canViewBankingInfo: hasPermission('financial.banking') || isAdmin,
      canManageAccounts: hasPermission('financial.manage_accounts') || isAdmin,
      canViewAuditTrail: hasPermission('financial.audit_trail') || isAdmin,
    },

    training: {
      canViewPage: hasPermission('training.view') || true,
      canViewOwnProgress: hasPermission('training.own_progress') || true,
      canViewAllProgress: hasPermission('training.all_progress') || isManager,
      canTakeQuizzes: hasPermission('training.take_quizzes') || true,
      canViewCertificates: hasPermission('training.view_certificates') || true,
      canDownloadCertificates: hasPermission('training.download_certificates') || true,
      canManageTrainingContent: hasPermission('training.manage_content') || isAdmin,
      canAssignTrainingModules: hasPermission('training.assign_modules') || isManager,
      canViewTrainingAnalytics: hasPermission('training.analytics') || isManager,
      canCreateCustomTraining: hasPermission('training.create_custom') || isAdmin,
      canManageInstructors: hasPermission('training.manage_instructors') || isAdmin,
      canViewTrainingHistory: hasPermission('training.view_history') || isManager,
      assignedModules: (user as any).assignedTrainingModules || [],
    },

    settings: {
      canViewPage: hasPermission('settings.view') || isAdmin,
      canViewUserManagement: hasPermission('settings.user_management') || isAdmin,
      canCreateUsers: hasPermission('settings.create_users') || isAdmin,
      canEditUsers: hasPermission('settings.edit_users') || isAdmin,
      canDeleteUsers: hasPermission('settings.delete_users') || isAdmin,
      canManagePermissions: hasPermission('settings.manage_permissions') || isAdmin,
      canViewSystemSettings: hasPermission('settings.system_settings') || isAdmin,
      canEditSystemSettings: hasPermission('settings.edit_system') || isAdmin,
      canViewSecuritySettings: hasPermission('settings.security_settings') || isAdmin,
      canEditSecuritySettings: hasPermission('settings.edit_security') || isAdmin,
      canViewIntegrationSettings: hasPermission('settings.integration_settings') || isAdmin,
      canEditIntegrationSettings: hasPermission('settings.edit_integrations') || isAdmin,
      canViewAuditLogs: hasPermission('settings.audit_logs') || isAdmin,
      canExportUserData: hasPermission('settings.export_users') || isAdmin,
      canManageRoles: hasPermission('settings.manage_roles') || isAdmin,
      canViewSystemHealth: hasPermission('settings.system_health') || isAdmin,
    },

    reports: {
      canViewPage: hasPermission('reports.view') || isManager,
      canViewOperationalReports: hasPermission('reports.operational') || isManager,
      canViewFinancialReports: hasPermission('reports.financial') || isManager,
      canViewPerformanceReports: hasPermission('reports.performance') || isManager,
      canViewComplianceReports: hasPermission('reports.compliance') || isManager,
      canCreateCustomReports: hasPermission('reports.create_custom') || isManager,
      canScheduleReports: hasPermission('reports.schedule') || isManager,
      canExportReports: hasPermission('reports.export') || isManager,
      canViewHistoricalReports: hasPermission('reports.historical') || isManager,
      canShareReports: hasPermission('reports.share') || isManager,
      canManageReportTemplates: hasPermission('reports.manage_templates') || isAdmin,
    },

    workflow: {
      canViewPage: hasPermission('workflow.view') || isDispatcher,
      canViewWorkflowTemplates: hasPermission('workflow.view_templates') || isDispatcher,
      canCreateWorkflows: hasPermission('workflow.create') || isDispatcher,
      canEditWorkflows: hasPermission('workflow.edit') || isDispatcher,
      canDeleteWorkflows: hasPermission('workflow.delete') || isManager,
      canExecuteWorkflows: hasPermission('workflow.execute') || isDispatcher,
      canViewWorkflowHistory: hasPermission('workflow.view_history') || isDispatcher,
      canManageAutomations: hasPermission('workflow.manage_automations') || isManager,
      canViewWorkflowAnalytics: hasPermission('workflow.analytics') || isManager,
      canConfigureNotifications: hasPermission('workflow.configure_notifications') || isManager,
    },

    notifications: {
      canViewPage: hasPermission('notifications.view') || true,
      canViewAllNotifications: hasPermission('notifications.view_all') || isManager,
      canViewOwnNotifications: hasPermission('notifications.view_own') || true,
      canCreateNotifications: hasPermission('notifications.create') || isManager,
      canEditNotifications: hasPermission('notifications.edit') || isManager,
      canDeleteNotifications: hasPermission('notifications.delete') || isManager,
      canManageNotificationSettings: hasPermission('notifications.manage_settings') || isAdmin,
      canViewNotificationHistory: hasPermission('notifications.view_history') || isManager,
      canConfigureAlerts: hasPermission('notifications.configure_alerts') || isManager,
    },

    documents: {
      canViewPage: hasPermission('documents.view') || true,
      canViewAllDocuments: hasPermission('documents.view_all') || isManager,
      canViewOwnDocuments: hasPermission('documents.view_own') || true,
      canUploadDocuments: hasPermission('documents.upload') || true,
      canEditDocuments: hasPermission('documents.edit') || isDispatcher,
      canDeleteDocuments: hasPermission('documents.delete') || isManager,
      canDownloadDocuments: hasPermission('documents.download') || true,
      canShareDocuments: hasPermission('documents.share') || isDispatcher,
      canManageDocumentCategories: hasPermission('documents.manage_categories') || isManager,
      canViewDocumentHistory: hasPermission('documents.view_history') || isManager,
      canSetDocumentPermissions: hasPermission('documents.set_permissions') || isManager,
    },

    maintenance: {
      canViewPage: hasPermission('maintenance.view') || isDispatcher,
      canViewMaintenanceSchedule: hasPermission('maintenance.view_schedule') || isDispatcher,
      canCreateMaintenanceRecords: hasPermission('maintenance.create_records') || isDispatcher,
      canEditMaintenanceRecords: hasPermission('maintenance.edit_records') || isDispatcher,
      canDeleteMaintenanceRecords: hasPermission('maintenance.delete_records') || isManager,
      canViewVehicleInformation: hasPermission('maintenance.view_vehicles') || isDispatcher,
      canEditVehicleInformation: hasPermission('maintenance.edit_vehicles') || isManager,
      canViewMaintenanceHistory: hasPermission('maintenance.view_history') || isDispatcher,
      canScheduleMaintenance: hasPermission('maintenance.schedule') || isDispatcher,
      canViewMaintenanceCosts: hasPermission('maintenance.view_costs') || isManager,
      canManageMaintenanceProviders: hasPermission('maintenance.manage_providers') || isManager,
    },

    performance: {
      canViewPage: hasPermission('performance.view') || true,
      canViewOwnPerformance: hasPermission('performance.view_own') || true,
      canViewTeamPerformance: hasPermission('performance.view_team') || isDispatcher,
      canViewAllPerformance: hasPermission('performance.view_all') || isManager,
      canViewPerformanceMetrics: hasPermission('performance.view_metrics') || isDispatcher,
      canViewPerformanceTrends: hasPermission('performance.view_trends') || isManager,
      canSetPerformanceGoals: hasPermission('performance.set_goals') || isManager,
      canViewPerformanceComparisons: hasPermission('performance.view_comparisons') || isManager,
      canExportPerformanceData: hasPermission('performance.export') || isManager,
      canManagePerformanceReviews: hasPermission('performance.manage_reviews') || isManager,
    },

    quoting: {
      canViewPage: hasPermission('quoting.view') || isDispatcher,
      canCreateQuotes: hasPermission('quoting.create') || isDispatcher,
      canViewAllQuotes: hasPermission('quoting.view_all') || isManager,
      canViewOwnQuotes: hasPermission('quoting.view_own') || isBroker,
      canEditQuotes: hasPermission('quoting.edit') || isDispatcher,
      canDeleteQuotes: hasPermission('quoting.delete') || isManager,
      canSendQuotes: hasPermission('quoting.send') || isDispatcher,
      canViewQuoteHistory: hasPermission('quoting.view_history') || isDispatcher,
      canManageQuoteTemplates: hasPermission('quoting.manage_templates') || isManager,
      canViewQuoteAnalytics: hasPermission('quoting.analytics') || isManager,
      canApproveQuotes: hasPermission('quoting.approve') || isManager,
    },

    routes: {
      canViewPage: hasPermission('routes.view') || isDispatcher,
      canViewAllRoutes: hasPermission('routes.view_all') || isDispatcher,
      canViewAssignedRoutes: hasPermission('routes.view_assigned') || isDriver,
      canCreateRoutes: hasPermission('routes.create') || isDispatcher,
      canEditRoutes: hasPermission('routes.edit') || isDispatcher,
      canDeleteRoutes: hasPermission('routes.delete') || isManager,
      canOptimizeRoutes: hasPermission('routes.optimize') || isDispatcher,
      canViewRouteAnalytics: hasPermission('routes.analytics') || isManager,
      canManageRouteTemplates: hasPermission('routes.manage_templates') || isManager,
      canViewRouteHistory: hasPermission('routes.view_history') || isDispatcher,
    },

    carrierVerification: {
      canViewPage: hasPermission('carrier.view') || isDispatcher,
      canViewCarrierProfiles: hasPermission('carrier.view_profiles') || isDispatcher,
      canCreateCarrierProfiles: hasPermission('carrier.create_profiles') || isDispatcher,
      canEditCarrierProfiles: hasPermission('carrier.edit_profiles') || isDispatcher,
      canDeleteCarrierProfiles: hasPermission('carrier.delete_profiles') || isManager,
      canVerifyCarriers: hasPermission('carrier.verify') || isDispatcher,
      canViewVerificationHistory: hasPermission('carrier.view_history') || isDispatcher,
      canManageVerificationCriteria: hasPermission('carrier.manage_criteria') || isManager,
      canExportCarrierData: hasPermission('carrier.export') || isManager,
      canViewCarrierPerformance: hasPermission('carrier.view_performance') || isDispatcher,
    },

    shipperPortal: {
      canViewPage: hasPermission('shipper.view') || isDispatcher,
      canViewShipperRequests: hasPermission('shipper.view_requests') || isDispatcher,
      canCreateShipperRequests: hasPermission('shipper.create_requests') || isDispatcher,
      canEditShipperRequests: hasPermission('shipper.edit_requests') || isDispatcher,
      canDeleteShipperRequests: hasPermission('shipper.delete_requests') || isManager,
      canViewShipperHistory: hasPermission('shipper.view_history') || isDispatcher,
      canManageShipperAccounts: hasPermission('shipper.manage_accounts') || isManager,
      canViewShipperAnalytics: hasPermission('shipper.analytics') || isManager,
      canCommunicateWithShippers: hasPermission('shipper.communicate') || isDispatcher,
    },

    smsWorkflow: {
      canViewPage: hasPermission('sms.view') || isDispatcher,
      canViewSmsTemplates: hasPermission('sms.view_templates') || isDispatcher,
      canCreateSmsTemplates: hasPermission('sms.create_templates') || isDispatcher,
      canEditSmsTemplates: hasPermission('sms.edit_templates') || isDispatcher,
      canDeleteSmsTemplates: hasPermission('sms.delete_templates') || isManager,
      canSendSms: hasPermission('sms.send') || isDispatcher,
      canViewSmsHistory: hasPermission('sms.view_history') || isDispatcher,
      canManageSmsAutomation: hasPermission('sms.manage_automation') || isManager,
      canViewSmsAnalytics: hasPermission('sms.analytics') || isManager,
      canConfigureSmsSettings: hasPermission('sms.configure_settings') || isManager,
    },
  };
}

/**
 * Check if user has a specific granular permission
 */
export function hasGranularPermission(
  user: User, 
  permissionPath: string,
  assignedPermissions?: string[]
): boolean {
  const permissions = getUserPagePermissions(user, assignedPermissions);
  
  // Navigate through the permission object using dot notation
  const pathParts = permissionPath.split('.');
  let current: any = permissions;
  
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return Boolean(current);
}

/**
 * Get all available permission options for assignment
 */
export function getAllAvailablePermissions(): PermissionOption[] {
  return [
    // 🚛 DISPATCH CENTRAL - Load management and assignments
    { id: 'dispatch_central.view', name: 'View Dispatch Central', category: 'Dispatch Central', description: 'Access main dispatch operations center' },
    { id: 'dispatch_central.view_loads', name: 'View All Loads', category: 'Dispatch Central', description: 'View all loads in load board' },
    { id: 'dispatch_central.create_loads', name: 'Create New Loads', category: 'Dispatch Central', description: 'Create freight loads and assignments' },
    { id: 'dispatch_central.assign_drivers', name: 'Assign Drivers to Loads', category: 'Dispatch Central', description: 'Match drivers with freight loads' },
    { id: 'dispatch_central.edit_loads', name: 'Edit Load Details', category: 'Dispatch Central', description: 'Modify load information and status' },
    { id: 'dispatch_central.track_loads', name: 'Real-time Load Tracking', category: 'Dispatch Central', description: 'Monitor loads in real-time' },
    { id: 'dispatch_central.emergency_management', name: 'Emergency Management', category: 'Dispatch Central', description: 'Handle emergency situations and overrides' },
    { id: 'dispatch_central.workflow_override', name: 'Workflow Override', category: 'Dispatch Central', description: 'Override workflow restrictions when needed' },
    { id: 'dispatch_central.ai_matching', name: 'AI Load Matching', category: 'Dispatch Central', description: 'Access AI-powered load-driver matching system' },

    // 🏢 BROKER BOX - Broker operations and RFx responses
    { id: 'broker_box.view', name: 'View Broker Box', category: 'Broker Box', description: 'Access broker operations center' },
    { id: 'broker_box.manage_customers', name: 'Customer Management', category: 'Broker Box', description: 'Manage customer relationships and profiles' },
    { id: 'broker_box.create_loads', name: 'Create Broker Loads', category: 'Broker Box', description: 'Create loads for brokerage operations' },
    { id: 'broker_box.rate_negotiation', name: 'Rate Negotiation', category: 'Broker Box', description: 'Negotiate rates with carriers and shippers' },
    { id: 'broker_box.commission_tracking', name: 'Commission Tracking', category: 'Broker Box', description: 'Track broker commissions and performance' },
    { id: 'broker_box.load_board_access', name: 'Load Board Integration', category: 'Broker Box', description: 'Access external load boards (DAT, Truckstop.com)' },
    { id: 'broker_box.payment_processing', name: 'Payment Processing', category: 'Broker Box', description: 'Process payments and settlements' },

    // 💰 FREIGHT QUOTING - Rate calculations and quotes
    { id: 'freight_quoting.view', name: 'View Freight Quoting', category: 'Freight Quoting', description: 'Access freight quoting system' },
    { id: 'freight_quoting.create_quotes', name: 'Generate Quotes', category: 'Freight Quoting', description: 'Create professional freight quotes' },
    { id: 'freight_quoting.edit_rates', name: 'Edit Rate Tables', category: 'Freight Quoting', description: 'Modify freight rates and pricing structures' },
    { id: 'freight_quoting.market_intelligence', name: 'Market Intelligence', category: 'Freight Quoting', description: 'Access market pricing data and trends' },
    { id: 'freight_quoting.nmfta_integration', name: 'NMFTA Integration', category: 'Freight Quoting', description: 'Use NMFTA freight classifications' },
    { id: 'freight_quoting.calculator', name: 'Freight Calculator', category: 'Freight Quoting', description: 'Use advanced freight calculation tools' },
    { id: 'freight_quoting.approval_workflow', name: 'Quote Approvals', category: 'Freight Quoting', description: 'Approve or reject freight quotes' },

    // 🚚 CARRIER PORTAL - Driver/carrier load board
    { id: 'carrier_portal.view', name: 'View Carrier Portal', category: 'Carrier Portal', description: 'Access carrier and driver portal' },
    { id: 'carrier_portal.available_loads', name: 'View Available Loads', category: 'Carrier Portal', description: 'View loads available for booking' },
    { id: 'carrier_portal.book_loads', name: 'Book Loads', category: 'Carrier Portal', description: 'Book and accept available loads' },
    { id: 'carrier_portal.update_status', name: 'Update Load Status', category: 'Carrier Portal', description: 'Update load progress and status' },
    { id: 'carrier_portal.document_upload', name: 'Document Upload', category: 'Carrier Portal', description: 'Upload POD and required documents' },
    { id: 'carrier_portal.payment_status', name: 'Payment Status', category: 'Carrier Portal', description: 'View payment status and history' },

    // 🚛 FLEET MANAGEMENT - Vehicles, drivers, equipment
    { id: 'fleet_management.view', name: 'View Fleet Management', category: 'Fleet Management', description: 'Access fleet management system' },
    { id: 'fleet_management.vehicle_tracking', name: 'Vehicle Tracking', category: 'Fleet Management', description: 'Real-time GPS tracking of fleet vehicles' },
    { id: 'fleet_management.driver_management', name: 'Driver Management', category: 'Fleet Management', description: 'Manage driver profiles and assignments' },
    { id: 'fleet_management.performance_analytics', name: 'Performance Analytics', category: 'Fleet Management', description: 'View fleet performance metrics and analytics' },
    { id: 'fleet_management.fuel_management', name: 'Fuel Management', category: 'Fleet Management', description: 'Monitor fuel usage and efficiency' },
    { id: 'fleet_management.safety_monitoring', name: 'Safety Monitoring', category: 'Fleet Management', description: 'Monitor safety metrics and violations' },
    { id: 'fleet_management.equipment_management', name: 'Equipment Management', category: 'Fleet Management', description: 'Manage trailers and equipment inventory' },

    // 🏢 SHIPPER PORTFOLIO - Customer management
    { id: 'shipper_portfolio.view', name: 'View Shipper Portfolio', category: 'Shipper Portfolio', description: 'Access shipper customer management' },
    { id: 'shipper_portfolio.manage_shippers', name: 'Manage Shipper Accounts', category: 'Shipper Portfolio', description: 'Add, edit, and manage shipper customers' },
    { id: 'shipper_portfolio.contract_management', name: 'Contract Management', category: 'Shipper Portfolio', description: 'Manage shipping contracts and agreements' },
    { id: 'shipper_portfolio.relationship_analytics', name: 'Relationship Analytics', category: 'Shipper Portfolio', description: 'Analyze customer relationships and profitability' },
    { id: 'shipper_portfolio.communication_hub', name: 'Communication Hub', category: 'Shipper Portfolio', description: 'Manage communication with shipper customers' },
    { id: 'shipper_portfolio.credit_management', name: 'Credit Management', category: 'Shipper Portfolio', description: 'Manage customer credit and payment terms' },

    // 🗺️ ROUTE OPTIMIZATION - Route planning
    { id: 'route_optimization.view', name: 'View Route Optimization', category: 'Route Optimization', description: 'Access route planning system' },
    { id: 'route_optimization.plan_routes', name: 'Plan Routes', category: 'Route Optimization', description: 'Create and optimize delivery routes' },
    { id: 'route_optimization.google_maps', name: 'Google Maps Integration', category: 'Route Optimization', description: 'Use Google Maps for route planning' },
    { id: 'route_optimization.traffic_analysis', name: 'Traffic Analysis', category: 'Route Optimization', description: 'Analyze traffic patterns and delays' },
    { id: 'route_optimization.fuel_optimization', name: 'Fuel Optimization', category: 'Route Optimization', description: 'Optimize routes for fuel efficiency' },
    { id: 'route_optimization.multi_stop', name: 'Multi-stop Planning', category: 'Route Optimization', description: 'Plan routes with multiple pickup/delivery points' },

    // 🔧 MAINTENANCE - Service & repairs
    { id: 'maintenance.view', name: 'View Maintenance', category: 'Maintenance', description: 'Access maintenance management system' },
    { id: 'maintenance.schedule_service', name: 'Schedule Service', category: 'Maintenance', description: 'Schedule preventive and corrective maintenance' },
    { id: 'maintenance.track_repairs', name: 'Track Repairs', category: 'Maintenance', description: 'Track repair history and costs' },
    { id: 'maintenance.vendor_management', name: 'Vendor Management', category: 'Maintenance', description: 'Manage maintenance vendors and services' },
    { id: 'maintenance.cost_tracking', name: 'Cost Tracking', category: 'Maintenance', description: 'Track maintenance costs and budgets' },
    { id: 'maintenance.predictive_alerts', name: 'Predictive Alerts', category: 'Maintenance', description: 'Receive predictive maintenance alerts' },

    // ✅ COMPLIANCE - DOT compliance
    { id: 'compliance.view', name: 'View Compliance Center', category: 'Compliance', description: 'Access DOT compliance management' },
    { id: 'compliance.fmcsa_forms', name: 'FMCSA Forms', category: 'Compliance', description: 'Manage FMCSA regulatory forms' },
    { id: 'compliance.safety_monitoring', name: 'Safety Monitoring', category: 'Compliance', description: 'Monitor CSA scores and safety metrics' },
    { id: 'compliance.violation_tracking', name: 'Violation Tracking', category: 'Compliance', description: 'Track and manage regulatory violations' },
    { id: 'compliance.drug_alcohol', name: 'Drug & Alcohol Testing', category: 'Compliance', description: 'Manage drug and alcohol testing programs' },
    { id: 'compliance.audit_support', name: 'Audit Support', category: 'Compliance', description: 'Support for regulatory audits and inspections' },
    { id: 'compliance.hos_monitoring', name: 'HOS Monitoring', category: 'Compliance', description: 'Monitor Hours of Service compliance' },

    // 💰 ACCOUNTING - Financial operations
    { id: 'accounting.view', name: 'View Accounting', category: 'Accounting', description: 'Access accounting and financial management' },
    { id: 'accounting.invoicing', name: 'Invoice Management', category: 'Accounting', description: 'Create and manage customer invoices' },
    { id: 'accounting.settlements', name: 'Driver Settlements', category: 'Accounting', description: 'Process driver and carrier settlements' },
    { id: 'accounting.expense_tracking', name: 'Expense Tracking', category: 'Accounting', description: 'Track and categorize business expenses' },
    { id: 'accounting.financial_reports', name: 'Financial Reporting', category: 'Accounting', description: 'Generate financial reports and statements' },
    { id: 'accounting.tax_management', name: 'Tax Management', category: 'Accounting', description: 'Manage tax reporting and compliance' },
    { id: 'accounting.profit_analysis', name: 'Profit Analysis', category: 'Accounting', description: 'Analyze profitability by load, customer, route' },

    // 📝 NOTIFICATION HUB - Alerts system
    { id: 'notification_hub.view', name: 'View Notification Hub', category: 'Notification Hub', description: 'Access notification and alerts center' },
    { id: 'notification_hub.send_alerts', name: 'Send Alerts', category: 'Notification Hub', description: 'Send notifications to drivers and staff' },
    { id: 'notification_hub.sms_integration', name: 'SMS Integration', category: 'Notification Hub', description: 'Send SMS notifications and alerts' },
    { id: 'notification_hub.email_alerts', name: 'Email Alerts', category: 'Notification Hub', description: 'Send email notifications and alerts' },
    { id: 'notification_hub.emergency_alerts', name: 'Emergency Alerts', category: 'Notification Hub', description: 'Send emergency and critical alerts' },
    { id: 'notification_hub.alert_history', name: 'Alert History', category: 'Notification Hub', description: 'View history of sent notifications' },

    // 📅 SCHEDULING - Appointments
    { id: 'scheduling.view', name: 'View Scheduling', category: 'Scheduling', description: 'Access appointment and scheduling system' },
    { id: 'scheduling.appointments', name: 'Manage Appointments', category: 'Scheduling', description: 'Schedule pickup and delivery appointments' },
    { id: 'scheduling.calendar_management', name: 'Calendar Management', category: 'Scheduling', description: 'Manage driver and vehicle calendars' },
    { id: 'scheduling.availability', name: 'Availability Management', category: 'Scheduling', description: 'Manage driver and equipment availability' },
    { id: 'scheduling.time_slot_management', name: 'Time Slot Management', category: 'Scheduling', description: 'Manage delivery time slots and windows' },

    // 🎓 FLEETFLOW UNIVERSITY - Training platform
    { id: 'fleetflow_university.view', name: 'View FleetFlow University', category: 'FleetFlow University', description: 'Access training and certification platform' },
    { id: 'fleetflow_university.take_courses', name: 'Take Training Courses', category: 'FleetFlow University', description: 'Access and complete training courses' },
    { id: 'fleetflow_university.view_progress', name: 'View Training Progress', category: 'FleetFlow University', description: 'Track training completion and progress' },
    { id: 'fleetflow_university.certificates', name: 'Training Certificates', category: 'FleetFlow University', description: 'Generate and download training certificates' },
    { id: 'fleetflow_university.manage_content', name: 'Manage Training Content', category: 'FleetFlow University', description: 'Create and manage training materials' },
    { id: 'fleetflow_university.assign_training', name: 'Assign Training', category: 'FleetFlow University', description: 'Assign training modules to employees' },
    { id: 'fleetflow_university.training_analytics', name: 'Training Analytics', category: 'FleetFlow University', description: 'View training completion analytics and reports' },

    // 🔍 FREIGHTFLOW RFx - Competitive intelligence
    { id: 'freightflow_rfx.view', name: 'View FreightFlow RFx', category: 'FreightFlow RFx', description: 'Access RFx competitive intelligence system' },
    { id: 'freightflow_rfx.respond_rfp', name: 'Respond to RFPs', category: 'FreightFlow RFx', description: 'Create responses to Request for Proposals' },
    { id: 'freightflow_rfx.respond_rfq', name: 'Respond to RFQs', category: 'FreightFlow RFx', description: 'Create responses to Request for Quotes' },
    { id: 'freightflow_rfx.market_intelligence', name: 'Market Intelligence', category: 'FreightFlow RFx', description: 'Access competitive market intelligence' },
    { id: 'freightflow_rfx.bid_tracking', name: 'Bid Tracking', category: 'FreightFlow RFx', description: 'Track submitted bids and responses' },
    { id: 'freightflow_rfx.win_loss_analysis', name: 'Win/Loss Analysis', category: 'FreightFlow RFx', description: 'Analyze bid success rates and factors' },

    // 🤖 AI FLOW - Automation platform
    { id: 'ai_flow.view', name: 'View AI Flow', category: 'AI Flow', description: 'Access AI automation platform' },
    { id: 'ai_flow.configure_automation', name: 'Configure Automation', category: 'AI Flow', description: 'Set up automated workflows and processes' },
    { id: 'ai_flow.ai_dispatch', name: 'AI Dispatcher', category: 'AI Flow', description: 'Use AI-powered dispatch recommendations' },
    { id: 'ai_flow.predictive_analytics', name: 'Predictive Analytics', category: 'AI Flow', description: 'Access AI-powered predictive insights' },
    { id: 'ai_flow.machine_learning', name: 'Machine Learning Models', category: 'AI Flow', description: 'Configure and monitor ML models' },
    { id: 'ai_flow.automation_monitoring', name: 'Automation Monitoring', category: 'AI Flow', description: 'Monitor automated processes and performance' },

    // 📄 DOCUMENTATION - Document generation
    { id: 'documentation.view', name: 'View Documentation', category: 'Documentation', description: 'Access document generation system' },
    { id: 'documentation.generate_bol', name: 'Generate Bill of Lading', category: 'Documentation', description: 'Generate professional BOL documents' },
    { id: 'documentation.generate_invoices', name: 'Generate Invoices', category: 'Documentation', description: 'Generate customer invoices and billing' },
    { id: 'documentation.manage_templates', name: 'Manage Templates', category: 'Documentation', description: 'Create and manage document templates' },
    { id: 'documentation.digital_signatures', name: 'Digital Signatures', category: 'Documentation', description: 'Collect and manage digital signatures' },
    { id: 'documentation.document_storage', name: 'Document Storage', category: 'Documentation', description: 'Store and manage documents in cloud' },
    { id: 'documentation.pod_management', name: 'POD Management', category: 'Documentation', description: 'Manage Proof of Delivery documents' }
  ];
}

export interface PermissionOption {
  id: string;
  name: string;
  category: string;
  description: string;
}

/**
 * Enhanced user interface with granular permissions
 */
export interface UserWithGranularPermissions extends User {
  assignedPermissions?: string[];
  assignedTrainingModules?: string[];
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
}
