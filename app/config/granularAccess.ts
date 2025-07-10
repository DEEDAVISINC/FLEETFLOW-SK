// Comprehensive Granular Access Control System
// This system provides fine-grained permission control for every area of the application

import { User, UserRole } from './access';

// ============================================================================
// GRANULAR PERMISSION DEFINITIONS
// ============================================================================

// Page-level permissions
export interface PagePermissions {
  dashboard: DashboardPermissions;
  dispatch: DispatchPermissions;
  analytics: AnalyticsPermissions;
  financial: FinancialPermissions;
  training: TrainingPermissions;
  settings: SettingsPermissions;
  reports: ReportsPermissions;
  workflow: WorkflowPermissions;
  notifications: NotificationPermissions;
  documents: DocumentPermissions;
  maintenance: MaintenancePermissions;
  performance: PerformancePermissions;
  quoting: QuotingPermissions;
  routes: RoutePermissions;
  carrierVerification: CarrierVerificationPermissions;
  shipperPortal: ShipperPortalPermissions;
  smsWorkflow: SmsWorkflowPermissions;
}

// Dashboard page granular permissions
export interface DashboardPermissions {
  canViewPage: boolean;
  canViewRevenueMetrics: boolean;
  canViewLoadCounts: boolean;
  canViewActiveLoads: boolean;
  canViewPerformanceCharts: boolean;
  canViewRecentActivities: boolean;
  canViewQuickActions: boolean;
  canCreateNewLoad: boolean;
  canEditLoadStatus: boolean;
  canViewAllUserActivities: boolean;
  canExportDashboardData: boolean;
  canCustomizeDashboard: boolean;
}

// Dispatch page granular permissions
export interface DispatchPermissions {
  canViewPage: boolean;
  canViewAllLoads: boolean;
  canViewAssignedLoads: boolean;
  canCreateLoads: boolean;
  canEditLoads: boolean;
  canDeleteLoads: boolean;
  canAssignDrivers: boolean;
  canAssignDispatchers: boolean;
  canViewLoadDetails: boolean;
  canUpdateLoadStatus: boolean;
  canViewDriverLocations: boolean;
  canSendDriverMessages: boolean;
  canViewLoadHistory: boolean;
  canExportLoadData: boolean;
  canViewRateInformation: boolean;
  canEditRateInformation: boolean;
  canViewCarrierInformation: boolean;
  canManageLoadPriority: boolean;
}

// Analytics page granular permissions
export interface AnalyticsPermissions {
  canViewPage: boolean;
  canViewRevenueAnalytics: boolean;
  canViewPerformanceMetrics: boolean;
  canViewDriverAnalytics: boolean;
  canViewRouteAnalytics: boolean;
  canViewCustomerAnalytics: boolean;
  canViewFinancialTrends: boolean;
  canViewOperationalMetrics: boolean;
  canExportAnalytics: boolean;
  canCreateCustomReports: boolean;
  canViewHistoricalData: boolean;
  canAccessRealTimeData: boolean;
  canViewPredictiveAnalytics: boolean;
  canViewBenchmarkData: boolean;
}

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
export interface ShipperPortalPermissions {
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
    dashboard: {
      canViewPage: hasPermission('dashboard.view') || isDispatcher,
      canViewRevenueMetrics: hasPermission('dashboard.revenue') || isManager,
      canViewLoadCounts: hasPermission('dashboard.loads') || isDispatcher,
      canViewActiveLoads: hasPermission('dashboard.active_loads') || isDispatcher,
      canViewPerformanceCharts: hasPermission('dashboard.performance') || isManager,
      canViewRecentActivities: hasPermission('dashboard.activities') || isDispatcher,
      canViewQuickActions: hasPermission('dashboard.quick_actions') || isDispatcher,
      canCreateNewLoad: hasPermission('dashboard.create_load') || isDispatcher,
      canEditLoadStatus: hasPermission('dashboard.edit_status') || isDispatcher,
      canViewAllUserActivities: hasPermission('dashboard.all_activities') || isManager,
      canExportDashboardData: hasPermission('dashboard.export') || isManager,
      canCustomizeDashboard: hasPermission('dashboard.customize') || true,
    },

    dispatch: {
      canViewPage: hasPermission('dispatch.view') || isDispatcher,
      canViewAllLoads: hasPermission('dispatch.view_all') || isDispatcher,
      canViewAssignedLoads: hasPermission('dispatch.view_assigned') || isBroker || isDriver,
      canCreateLoads: hasPermission('dispatch.create') || isDispatcher,
      canEditLoads: hasPermission('dispatch.edit') || isDispatcher,
      canDeleteLoads: hasPermission('dispatch.delete') || isManager,
      canAssignDrivers: hasPermission('dispatch.assign_drivers') || isDispatcher,
      canAssignDispatchers: hasPermission('dispatch.assign_dispatchers') || isManager,
      canViewLoadDetails: hasPermission('dispatch.view_details') || isDispatcher || isBroker,
      canUpdateLoadStatus: hasPermission('dispatch.update_status') || isDispatcher || isDriver,
      canViewDriverLocations: hasPermission('dispatch.driver_locations') || isDispatcher,
      canSendDriverMessages: hasPermission('dispatch.message_drivers') || isDispatcher,
      canViewLoadHistory: hasPermission('dispatch.view_history') || isDispatcher,
      canExportLoadData: hasPermission('dispatch.export') || isManager,
      canViewRateInformation: hasPermission('dispatch.view_rates') || isDispatcher,
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
    // Dashboard permissions
    { id: 'dashboard.view', name: 'View Dashboard', category: 'Dashboard', description: 'Access to main dashboard page' },
    { id: 'dashboard.revenue', name: 'View Revenue Metrics', category: 'Dashboard', description: 'View revenue and financial metrics on dashboard' },
    { id: 'dashboard.loads', name: 'View Load Counts', category: 'Dashboard', description: 'View load statistics and counts' },
    { id: 'dashboard.active_loads', name: 'View Active Loads', category: 'Dashboard', description: 'View currently active loads' },
    { id: 'dashboard.performance', name: 'View Performance Charts', category: 'Dashboard', description: 'View performance metrics and charts' },
    { id: 'dashboard.activities', name: 'View Recent Activities', category: 'Dashboard', description: 'View recent system activities' },
    { id: 'dashboard.quick_actions', name: 'View Quick Actions', category: 'Dashboard', description: 'Access to quick action buttons' },
    { id: 'dashboard.create_load', name: 'Create New Load', category: 'Dashboard', description: 'Create new loads from dashboard' },
    { id: 'dashboard.edit_status', name: 'Edit Load Status', category: 'Dashboard', description: 'Edit load status from dashboard' },
    { id: 'dashboard.all_activities', name: 'View All User Activities', category: 'Dashboard', description: 'View activities of all users' },
    { id: 'dashboard.export', name: 'Export Dashboard Data', category: 'Dashboard', description: 'Export dashboard data and reports' },
    { id: 'dashboard.customize', name: 'Customize Dashboard', category: 'Dashboard', description: 'Customize dashboard layout and widgets' },

    // Dispatch permissions
    { id: 'dispatch.view', name: 'View Dispatch Board', category: 'Dispatch', description: 'Access to dispatch board page' },
    { id: 'dispatch.view_all', name: 'View All Loads', category: 'Dispatch', description: 'View all loads in the system' },
    { id: 'dispatch.view_assigned', name: 'View Assigned Loads', category: 'Dispatch', description: 'View only assigned loads' },
    { id: 'dispatch.create', name: 'Create Loads', category: 'Dispatch', description: 'Create new freight loads' },
    { id: 'dispatch.edit', name: 'Edit Loads', category: 'Dispatch', description: 'Edit existing load information' },
    { id: 'dispatch.delete', name: 'Delete Loads', category: 'Dispatch', description: 'Delete loads from the system' },
    { id: 'dispatch.assign_drivers', name: 'Assign Drivers', category: 'Dispatch', description: 'Assign drivers to loads' },
    { id: 'dispatch.assign_dispatchers', name: 'Assign Dispatchers', category: 'Dispatch', description: 'Assign dispatchers to loads' },
    { id: 'dispatch.view_details', name: 'View Load Details', category: 'Dispatch', description: 'View detailed load information' },
    { id: 'dispatch.update_status', name: 'Update Load Status', category: 'Dispatch', description: 'Update load status and progress' },
    { id: 'dispatch.driver_locations', name: 'View Driver Locations', category: 'Dispatch', description: 'View real-time driver locations' },
    { id: 'dispatch.message_drivers', name: 'Message Drivers', category: 'Dispatch', description: 'Send messages to drivers' },
    { id: 'dispatch.view_history', name: 'View Load History', category: 'Dispatch', description: 'View historical load data' },
    { id: 'dispatch.export', name: 'Export Load Data', category: 'Dispatch', description: 'Export load data and reports' },
    { id: 'dispatch.view_rates', name: 'View Rate Information', category: 'Dispatch', description: 'View freight rates and pricing' },
    { id: 'dispatch.edit_rates', name: 'Edit Rate Information', category: 'Dispatch', description: 'Edit freight rates and pricing' },
    { id: 'dispatch.view_carriers', name: 'View Carrier Information', category: 'Dispatch', description: 'View carrier profiles and data' },
    { id: 'dispatch.manage_priority', name: 'Manage Load Priority', category: 'Dispatch', description: 'Set and manage load priorities' },

    // Analytics permissions
    { id: 'analytics.view', name: 'View Analytics', category: 'Analytics', description: 'Access to analytics dashboard' },
    { id: 'analytics.revenue', name: 'View Revenue Analytics', category: 'Analytics', description: 'View revenue and financial analytics' },
    { id: 'analytics.performance', name: 'View Performance Metrics', category: 'Analytics', description: 'View performance analytics' },
    { id: 'analytics.drivers', name: 'View Driver Analytics', category: 'Analytics', description: 'View driver performance analytics' },
    { id: 'analytics.routes', name: 'View Route Analytics', category: 'Analytics', description: 'View route optimization analytics' },
    { id: 'analytics.customers', name: 'View Customer Analytics', category: 'Analytics', description: 'View customer analytics and insights' },
    { id: 'analytics.financial', name: 'View Financial Trends', category: 'Analytics', description: 'View financial trends and forecasting' },
    { id: 'analytics.operational', name: 'View Operational Metrics', category: 'Analytics', description: 'View operational efficiency metrics' },
    { id: 'analytics.export', name: 'Export Analytics', category: 'Analytics', description: 'Export analytics data and reports' },
    { id: 'analytics.custom_reports', name: 'Create Custom Reports', category: 'Analytics', description: 'Create custom analytics reports' },
    { id: 'analytics.historical', name: 'View Historical Data', category: 'Analytics', description: 'Access historical analytics data' },
    { id: 'analytics.realtime', name: 'Access Real-time Data', category: 'Analytics', description: 'Access real-time analytics data' },
    { id: 'analytics.predictive', name: 'View Predictive Analytics', category: 'Analytics', description: 'Access predictive analytics and forecasting' },
    { id: 'analytics.benchmarks', name: 'View Benchmark Data', category: 'Analytics', description: 'View industry benchmarks and comparisons' },

    // Financial permissions
    { id: 'financial.view', name: 'View Financial Dashboard', category: 'Financial', description: 'Access to financial management page' },
    { id: 'financial.view_invoices', name: 'View Invoices', category: 'Financial', description: 'View invoice information' },
    { id: 'financial.create_invoices', name: 'Create Invoices', category: 'Financial', description: 'Create new invoices' },
    { id: 'financial.edit_invoices', name: 'Edit Invoices', category: 'Financial', description: 'Edit existing invoices' },
    { id: 'financial.delete_invoices', name: 'Delete Invoices', category: 'Financial', description: 'Delete invoices from system' },
    { id: 'financial.view_payments', name: 'View Payments', category: 'Financial', description: 'View payment information' },
    { id: 'financial.process_payments', name: 'Process Payments', category: 'Financial', description: 'Process and manage payments' },
    { id: 'financial.view_expenses', name: 'View Expenses', category: 'Financial', description: 'View expense information' },
    { id: 'financial.create_expenses', name: 'Create Expenses', category: 'Financial', description: 'Create new expense records' },
    { id: 'financial.edit_expenses', name: 'Edit Expenses', category: 'Financial', description: 'Edit existing expense records' },
    { id: 'financial.profit_loss', name: 'View Profit & Loss', category: 'Financial', description: 'View profit and loss statements' },
    { id: 'financial.cash_flow', name: 'View Cash Flow', category: 'Financial', description: 'View cash flow statements' },
    { id: 'financial.tax_reports', name: 'View Tax Reports', category: 'Financial', description: 'View tax-related reports' },
    { id: 'financial.export', name: 'Export Financial Data', category: 'Financial', description: 'Export financial data and reports' },
    { id: 'financial.banking', name: 'View Banking Information', category: 'Financial', description: 'View bank account information' },
    { id: 'financial.manage_accounts', name: 'Manage Accounts', category: 'Financial', description: 'Manage financial accounts' },
    { id: 'financial.audit_trail', name: 'View Audit Trail', category: 'Financial', description: 'View financial audit trail' },

    // Training permissions
    { id: 'training.view', name: 'View Training Center', category: 'Training', description: 'Access to training center' },
    { id: 'training.own_progress', name: 'View Own Progress', category: 'Training', description: 'View personal training progress' },
    { id: 'training.all_progress', name: 'View All Progress', category: 'Training', description: 'View all users training progress' },
    { id: 'training.take_quizzes', name: 'Take Quizzes', category: 'Training', description: 'Take training quizzes and assessments' },
    { id: 'training.view_certificates', name: 'View Certificates', category: 'Training', description: 'View training certificates' },
    { id: 'training.download_certificates', name: 'Download Certificates', category: 'Training', description: 'Download training certificates' },
    { id: 'training.manage_content', name: 'Manage Training Content', category: 'Training', description: 'Manage training materials and content' },
    { id: 'training.assign_modules', name: 'Assign Training Modules', category: 'Training', description: 'Assign training modules to users' },
    { id: 'training.analytics', name: 'View Training Analytics', category: 'Training', description: 'View training analytics and reports' },
    { id: 'training.create_custom', name: 'Create Custom Training', category: 'Training', description: 'Create custom training modules' },
    { id: 'training.manage_instructors', name: 'Manage Instructors', category: 'Training', description: 'Manage instructor accounts and assignments' },
    { id: 'training.view_history', name: 'View Training History', category: 'Training', description: 'View training completion history' },

    // Settings permissions
    { id: 'settings.view', name: 'View Settings', category: 'Settings', description: 'Access to settings page' },
    { id: 'settings.user_management', name: 'View User Management', category: 'Settings', description: 'Access user management interface' },
    { id: 'settings.create_users', name: 'Create Users', category: 'Settings', description: 'Create new user accounts' },
    { id: 'settings.edit_users', name: 'Edit Users', category: 'Settings', description: 'Edit existing user accounts' },
    { id: 'settings.delete_users', name: 'Delete Users', category: 'Settings', description: 'Delete user accounts' },
    { id: 'settings.manage_permissions', name: 'Manage Permissions', category: 'Settings', description: 'Assign and manage user permissions' },
    { id: 'settings.system_settings', name: 'View System Settings', category: 'Settings', description: 'View system configuration settings' },
    { id: 'settings.edit_system', name: 'Edit System Settings', category: 'Settings', description: 'Edit system configuration settings' },
    { id: 'settings.security_settings', name: 'View Security Settings', category: 'Settings', description: 'View security configuration' },
    { id: 'settings.edit_security', name: 'Edit Security Settings', category: 'Settings', description: 'Edit security configuration' },
    { id: 'settings.integration_settings', name: 'View Integration Settings', category: 'Settings', description: 'View third-party integrations' },
    { id: 'settings.edit_integrations', name: 'Edit Integration Settings', category: 'Settings', description: 'Configure third-party integrations' },
    { id: 'settings.audit_logs', name: 'View Audit Logs', category: 'Settings', description: 'View system audit logs' },
    { id: 'settings.export_users', name: 'Export User Data', category: 'Settings', description: 'Export user data and reports' },
    { id: 'settings.manage_roles', name: 'Manage Roles', category: 'Settings', description: 'Create and manage user roles' },
    { id: 'settings.system_health', name: 'View System Health', category: 'Settings', description: 'View system health and status' },

    // Additional area permissions continue...
    // Reports, Workflow, Notifications, Documents, Maintenance, Performance, Quoting, Routes, Carrier Verification, Shipper Portal, SMS Workflow
    // Each with their specific granular permissions as defined in the interfaces above
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
