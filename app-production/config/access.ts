// FleetFlow Complete Section-Level Access Control System
// This allows access control down to individual sections within each page

export interface PageSectionPermissions {
  // DASHBOARD PAGE SECTIONS
  dashboard: {
    canViewRevenue: boolean;
    canViewLoadStatistics: boolean;
    canViewPerformanceCharts: boolean;
    canViewQuickActions: boolean;
    canViewAlerts: boolean;
    canViewRecentActivity: boolean;
    canExportData: boolean;
  };
  
  // DISPATCH CENTRAL PAGE SECTIONS
  dispatchCentral: {
    canViewLoadBoard: boolean;
    canCreateLoads: boolean;
    canAssignDrivers: boolean;
    canViewDriverLocations: boolean;
    canAccessRoutePlanning: boolean;
    canViewCommunicationHub: boolean;
    canGenerateDocuments: boolean;
    canViewRealTimeTracking: boolean;
    canManageDispatchFees: boolean;
    canViewLoadHistory: boolean;
  };
  
  // BROKER BOX PAGE SECTIONS  
  brokerBox: {
    canViewShipperManagement: boolean;
    canCreateQuotes: boolean;
    canPostLoads: boolean;
    canViewMarketRates: boolean;
    canAccessRfxCenter: boolean;
    canViewPerformanceAnalytics: boolean;
    canManageCustomerRelations: boolean;
    canAccessLoadMatching: boolean;
    canViewCommissionTracking: boolean;
    canManageBrokerTools: boolean;
  };
  
  // DRIVER MANAGEMENT PAGE SECTIONS
  driverManagement: {
    canViewDriverList: boolean;
    canCreateDriverProfiles: boolean;
    canEditDriverDetails: boolean;
    canViewDriverPerformance: boolean;
    canManageDriverScheduling: boolean;
    canAccessDriverCommunication: boolean;
    canViewDriverDocuments: boolean;
    canManageDriverOnboarding: boolean;
    canViewDriverFinancials: boolean;
    canAccessDriverPortal: boolean;
  };
  
  // FLEETFLOW (ROUTES/VEHICLES) PAGE SECTIONS
  fleetFlow: {
    canViewRouteOptimization: boolean;
    canCreateRoutes: boolean;
    canViewVehicleManagement: boolean;
    canAccessMaintenanceScheduling: boolean;
    canViewFuelManagement: boolean;
    canAccessFleetTracking: boolean;
    canViewFleetAnalytics: boolean;
    canManageVehicleDocuments: boolean;
    canViewFleetPerformance: boolean;
    canAccessFleetReporting: boolean;
  };
  
  // ANALYTICS PAGE SECTIONS (RESTRICTED)
  analytics: {
    canViewRevenueAnalytics: boolean;
    canViewPerformanceMetrics: boolean;
    canViewCustomerAnalytics: boolean;
    canViewOperationalAnalytics: boolean;
    canViewProfitabilityAnalysis: boolean;
    canViewTrendAnalysis: boolean;
    canCreateCustomReports: boolean;
    canExportAnalyticsData: boolean;
    canViewRealTimeMetrics: boolean;
    canAccessPredictiveAnalytics: boolean;
  };
  
  // FINANCIALS PAGE SECTIONS (RESTRICTED)
  financials: {
    canViewInvoicing: boolean;
    canViewAccountsReceivable: boolean;
    canViewAccountsPayable: boolean;
    canViewPayroll: boolean;
    canViewCashFlow: boolean;
    canViewProfitLoss: boolean;
    canViewTaxDocuments: boolean;
    canProcessPayments: boolean;
    canViewFinancialReports: boolean;
    canAccessAuditTrail: boolean;
  };
  
  // SETTINGS PAGE SECTIONS (ADMIN)
  settings: {
    canViewUserManagement: boolean;
    canCreateUsers: boolean;
    canEditPermissions: boolean;
    canViewSystemSettings: boolean;
    canManageIntegrations: boolean;
    canViewSecuritySettings: boolean;
    canAccessBackupSettings: boolean;
    canViewAuditLogs: boolean;
    canManageCompanySettings: boolean;
    canAccessDeveloperTools: boolean;
  };
  
  // TRAINING PAGE SECTIONS
  training: {
    canViewTrainingModules: boolean;
    canTakeQuizzes: boolean;
    canViewCertificates: boolean;
    canViewProgress: boolean;
    canAccessInstructor: boolean;
    canManageTrainingContent: boolean;
    canViewAllUserProgress: boolean;
    canAssignTraining: boolean;
    canGenerateCertificates: boolean;
    canAccessTrainingAnalytics: boolean;
  };
  
  // COMPLIANCE PAGE SECTIONS
  compliance: {
    canViewDOTCompliance: boolean;
    canManageDriverQualifications: boolean;
    canViewSafetyRecords: boolean;
    canAccessInspectionReports: boolean;
    canViewViolationTracking: boolean;
    canManageComplianceDocuments: boolean;
    canViewCSAScores: boolean;
    canAccessAuditPrep: boolean;
    canViewComplianceAnalytics: boolean;
    canManageComplianceAlerts: boolean;
  };
  
  // ACCOUNTING PAGE SECTIONS (FINANCIAL)
  accounting: {
    canViewRevenueDashboard: boolean;
    canViewExpenseTracking: boolean;
    canViewInvoiceManagement: boolean;
    canViewPayrollProcessing: boolean;
    canViewTaxManagement: boolean;
    canViewFinancialReporting: boolean;
    canViewCashFlowAnalysis: boolean;
    canProcessPayments: boolean;
    canViewAccountingAudit: boolean;
    canAccessFinancialSettings: boolean;
  };
}

export const USER_ROLES = {
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  BROKER: 'broker', 
  MANAGER: 'manager',
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Deep partial type for custom permissions
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentCode?: string;
  customPermissions?: DeepPartial<PageSectionPermissions>; // Override specific permissions
  brokerId?: string;
  dispatcherId?: string;
  assignedBrokers?: string[];
  companyName?: string;
}

// GRANULAR SECTION-LEVEL PERMISSIONS BY ROLE
export const getSectionPermissions = (user: User): PageSectionPermissions => {
  const { role, customPermissions } = user;
  
  // Default permissions by role
  let permissions: PageSectionPermissions;
  
  switch (role) {
    case 'admin':
      // Admins get access to ALL sections
      permissions = {
        dashboard: {
          canViewRevenue: true,
          canViewLoadStatistics: true,
          canViewPerformanceCharts: true,
          canViewQuickActions: true,
          canViewAlerts: true,
          canViewRecentActivity: true,
          canExportData: true
        },
        dispatchCentral: {
          canViewLoadBoard: true,
          canCreateLoads: true,
          canAssignDrivers: true,
          canViewDriverLocations: true,
          canAccessRoutePlanning: true,
          canViewCommunicationHub: true,
          canGenerateDocuments: true,
          canViewRealTimeTracking: true,
          canManageDispatchFees: true,
          canViewLoadHistory: true
        },
        brokerBox: {
          canViewShipperManagement: true,
          canCreateQuotes: true,
          canPostLoads: true,
          canViewMarketRates: true,
          canAccessRfxCenter: true,
          canViewPerformanceAnalytics: true,
          canManageCustomerRelations: true,
          canAccessLoadMatching: true,
          canViewCommissionTracking: true,
          canManageBrokerTools: true
        },
        driverManagement: {
          canViewDriverList: true,
          canCreateDriverProfiles: true,
          canEditDriverDetails: true,
          canViewDriverPerformance: true,
          canManageDriverScheduling: true,
          canAccessDriverCommunication: true,
          canViewDriverDocuments: true,
          canManageDriverOnboarding: true,
          canViewDriverFinancials: true,
          canAccessDriverPortal: true
        },
        fleetFlow: {
          canViewRouteOptimization: true,
          canCreateRoutes: true,
          canViewVehicleManagement: true,
          canAccessMaintenanceScheduling: true,
          canViewFuelManagement: true,
          canAccessFleetTracking: true,
          canViewFleetAnalytics: true,
          canManageVehicleDocuments: true,
          canViewFleetPerformance: true,
          canAccessFleetReporting: true
        },
        analytics: {
          canViewRevenueAnalytics: true,
          canViewPerformanceMetrics: true,
          canViewCustomerAnalytics: true,
          canViewOperationalAnalytics: true,
          canViewProfitabilityAnalysis: true,
          canViewTrendAnalysis: true,
          canCreateCustomReports: true,
          canExportAnalyticsData: true,
          canViewRealTimeMetrics: true,
          canAccessPredictiveAnalytics: true
        },
        financials: {
          canViewInvoicing: true,
          canViewAccountsReceivable: true,
          canViewAccountsPayable: true,
          canViewPayroll: true,
          canViewCashFlow: true,
          canViewProfitLoss: true,
          canViewTaxDocuments: true,
          canProcessPayments: true,
          canViewFinancialReports: true,
          canAccessAuditTrail: true
        },
        settings: {
          canViewUserManagement: true,
          canCreateUsers: true,
          canEditPermissions: true,
          canViewSystemSettings: true,
          canManageIntegrations: true,
          canViewSecuritySettings: true,
          canAccessBackupSettings: true,
          canViewAuditLogs: true,
          canManageCompanySettings: true,
          canAccessDeveloperTools: true
        },
        training: {
          canViewTrainingModules: true,
          canTakeQuizzes: true,
          canViewCertificates: true,
          canViewProgress: true,
          canAccessInstructor: true,
          canManageTrainingContent: true,
          canViewAllUserProgress: true,
          canAssignTraining: true,
          canGenerateCertificates: true,
          canAccessTrainingAnalytics: true
        },
        compliance: {
          canViewDOTCompliance: true,
          canManageDriverQualifications: true,
          canViewSafetyRecords: true,
          canAccessInspectionReports: true,
          canViewViolationTracking: true,
          canManageComplianceDocuments: true,
          canViewCSAScores: true,
          canAccessAuditPrep: true,
          canViewComplianceAnalytics: true,
          canManageComplianceAlerts: true
        },
        accounting: {
          canViewRevenueDashboard: true,
          canViewExpenseTracking: true,
          canViewInvoiceManagement: true,
          canViewPayrollProcessing: true,
          canViewTaxManagement: true,
          canViewFinancialReporting: true,
          canViewCashFlowAnalysis: true,
          canProcessPayments: true,
          canViewAccountingAudit: true,
          canAccessFinancialSettings: true
        }
      };
      break;
      
    case 'manager':
      permissions = {
        dashboard: {
          canViewRevenue: true,
          canViewLoadStatistics: true,
          canViewPerformanceCharts: true,
          canViewQuickActions: true,
          canViewAlerts: true,
          canViewRecentActivity: true,
          canExportData: true
        },
        dispatchCentral: {
          canViewLoadBoard: true,
          canCreateLoads: true,
          canAssignDrivers: true,
          canViewDriverLocations: true,
          canAccessRoutePlanning: true,
          canViewCommunicationHub: true,
          canGenerateDocuments: true,
          canViewRealTimeTracking: true,
          canManageDispatchFees: true,
          canViewLoadHistory: true
        },
        brokerBox: {
          canViewShipperManagement: true,
          canCreateQuotes: true,
          canPostLoads: true,
          canViewMarketRates: true,
          canAccessRfxCenter: true,
          canViewPerformanceAnalytics: true,
          canManageCustomerRelations: true,
          canAccessLoadMatching: true,
          canViewCommissionTracking: true,
          canManageBrokerTools: true
        },
        driverManagement: {
          canViewDriverList: true,
          canCreateDriverProfiles: true,
          canEditDriverDetails: true,
          canViewDriverPerformance: true,
          canManageDriverScheduling: true,
          canAccessDriverCommunication: true,
          canViewDriverDocuments: true,
          canManageDriverOnboarding: true,
          canViewDriverFinancials: true,
          canAccessDriverPortal: true
        },
        fleetFlow: {
          canViewRouteOptimization: true,
          canCreateRoutes: true,
          canViewVehicleManagement: true,
          canAccessMaintenanceScheduling: true,
          canViewFuelManagement: true,
          canAccessFleetTracking: true,
          canViewFleetAnalytics: true,
          canManageVehicleDocuments: true,
          canViewFleetPerformance: true,
          canAccessFleetReporting: true
        },
        analytics: {
          canViewRevenueAnalytics: true,
          canViewPerformanceMetrics: true,
          canViewCustomerAnalytics: true,
          canViewOperationalAnalytics: true,
          canViewProfitabilityAnalysis: true,
          canViewTrendAnalysis: true,
          canCreateCustomReports: true,
          canExportAnalyticsData: true,
          canViewRealTimeMetrics: true,
          canAccessPredictiveAnalytics: true
        },
        financials: {
          canViewInvoicing: true,
          canViewAccountsReceivable: true,
          canViewAccountsPayable: true,
          canViewPayroll: true,
          canViewCashFlow: true,
          canViewProfitLoss: true,
          canViewTaxDocuments: true,
          canProcessPayments: false, // Restricted
          canViewFinancialReports: true,
          canAccessAuditTrail: true
        },
        settings: {
          canViewUserManagement: true,
          canCreateUsers: true,
          canEditPermissions: false, // Admin only
          canViewSystemSettings: false, // Admin only
          canManageIntegrations: false, // Admin only
          canViewSecuritySettings: false, // Admin only
          canAccessBackupSettings: false, // Admin only
          canViewAuditLogs: true,
          canManageCompanySettings: true,
          canAccessDeveloperTools: false // Admin only
        },
        training: {
          canViewTrainingModules: true,
          canTakeQuizzes: true,
          canViewCertificates: true,
          canViewProgress: true,
          canAccessInstructor: true,
          canManageTrainingContent: true,
          canViewAllUserProgress: true,
          canAssignTraining: true,
          canGenerateCertificates: true,
          canAccessTrainingAnalytics: true
        },
        compliance: {
          canViewDOTCompliance: true,
          canManageDriverQualifications: true,
          canViewSafetyRecords: true,
          canAccessInspectionReports: true,
          canViewViolationTracking: true,
          canManageComplianceDocuments: true,
          canViewCSAScores: true,
          canAccessAuditPrep: true,
          canViewComplianceAnalytics: true,
          canManageComplianceAlerts: true
        },
        accounting: {
          canViewRevenueDashboard: true,
          canViewExpenseTracking: true,
          canViewInvoiceManagement: true,
          canViewPayrollProcessing: true,
          canViewTaxManagement: true,
          canViewFinancialReporting: true,
          canViewCashFlowAnalysis: true,
          canProcessPayments: false, // Admin only
          canViewAccountingAudit: true,
          canAccessFinancialSettings: false // Admin only
        }
      };
      break;
      
    case 'dispatcher':
      permissions = {
        dashboard: {
          canViewRevenue: false, // No revenue access
          canViewLoadStatistics: true,
          canViewPerformanceCharts: true,
          canViewQuickActions: true,
          canViewAlerts: true,
          canViewRecentActivity: true,
          canExportData: false // No export access
        },
        dispatchCentral: {
          canViewLoadBoard: true,
          canCreateLoads: false, // Dispatchers receive loads from brokers
          canAssignDrivers: true,
          canViewDriverLocations: true,
          canAccessRoutePlanning: true,
          canViewCommunicationHub: true,
          canGenerateDocuments: true,
          canViewRealTimeTracking: true,
          canManageDispatchFees: true,
          canViewLoadHistory: true
        },
        brokerBox: {
          canViewShipperManagement: false, // No broker access
          canCreateQuotes: false,
          canPostLoads: false,
          canViewMarketRates: false,
          canAccessRfxCenter: false,
          canViewPerformanceAnalytics: false,
          canManageCustomerRelations: false,
          canAccessLoadMatching: false,
          canViewCommissionTracking: false,
          canManageBrokerTools: false
        },
        driverManagement: {
          canViewDriverList: true,
          canCreateDriverProfiles: true,
          canEditDriverDetails: true,
          canViewDriverPerformance: true,
          canManageDriverScheduling: true,
          canAccessDriverCommunication: true,
          canViewDriverDocuments: true,
          canManageDriverOnboarding: true,
          canViewDriverFinancials: false, // No financial access
          canAccessDriverPortal: true
        },
        fleetFlow: {
          canViewRouteOptimization: true,
          canCreateRoutes: true,
          canViewVehicleManagement: true,
          canAccessMaintenanceScheduling: true,
          canViewFuelManagement: false, // No financial access
          canAccessFleetTracking: true,
          canViewFleetAnalytics: false, // No analytics access
          canManageVehicleDocuments: true,
          canViewFleetPerformance: true,
          canAccessFleetReporting: false // No reporting access
        },
        analytics: {
          // NO ACCESS TO ANALYTICS
          canViewRevenueAnalytics: false,
          canViewPerformanceMetrics: false,
          canViewCustomerAnalytics: false,
          canViewOperationalAnalytics: false,
          canViewProfitabilityAnalysis: false,
          canViewTrendAnalysis: false,
          canCreateCustomReports: false,
          canExportAnalyticsData: false,
          canViewRealTimeMetrics: false,
          canAccessPredictiveAnalytics: false
        },
        financials: {
          // NO ACCESS TO FINANCIALS
          canViewInvoicing: false,
          canViewAccountsReceivable: false,
          canViewAccountsPayable: false,
          canViewPayroll: false,
          canViewCashFlow: false,
          canViewProfitLoss: false,
          canViewTaxDocuments: false,
          canProcessPayments: false,
          canViewFinancialReports: false,
          canAccessAuditTrail: false
        },
        settings: {
          // LIMITED SETTINGS ACCESS
          canViewUserManagement: false,
          canCreateUsers: false,
          canEditPermissions: false,
          canViewSystemSettings: false,
          canManageIntegrations: false,
          canViewSecuritySettings: false,
          canAccessBackupSettings: false,
          canViewAuditLogs: false,
          canManageCompanySettings: false,
          canAccessDeveloperTools: false
        },
        training: {
          canViewTrainingModules: true,
          canTakeQuizzes: true,
          canViewCertificates: true,
          canViewProgress: true,
          canAccessInstructor: false,
          canManageTrainingContent: false,
          canViewAllUserProgress: false,
          canAssignTraining: false,
          canGenerateCertificates: false,
          canAccessTrainingAnalytics: false
        },
        compliance: {
          canViewDOTCompliance: true,
          canManageDriverQualifications: true,
          canViewSafetyRecords: true,
          canAccessInspectionReports: true,
          canViewViolationTracking: true,
          canManageComplianceDocuments: true,
          canViewCSAScores: true,
          canAccessAuditPrep: false,
          canViewComplianceAnalytics: false,
          canManageComplianceAlerts: true
        },
        accounting: {
          // NO ACCESS TO ACCOUNTING
          canViewRevenueDashboard: false,
          canViewExpenseTracking: false,
          canViewInvoiceManagement: false,
          canViewPayrollProcessing: false,
          canViewTaxManagement: false,
          canViewFinancialReporting: false,
          canViewCashFlowAnalysis: false,
          canProcessPayments: false,
          canViewAccountingAudit: false,
          canAccessFinancialSettings: false
        }
      };
      break;
      
    case 'broker':
      permissions = {
        dashboard: {
          canViewRevenue: false, // Limited revenue access
          canViewLoadStatistics: true,
          canViewPerformanceCharts: true,
          canViewQuickActions: true,
          canViewAlerts: true,
          canViewRecentActivity: true,
          canExportData: false
        },
        dispatchCentral: {
          canViewLoadBoard: false, // Brokers don't manage dispatch
          canCreateLoads: false,
          canAssignDrivers: false,
          canViewDriverLocations: false,
          canAccessRoutePlanning: false,
          canViewCommunicationHub: false,
          canGenerateDocuments: false,
          canViewRealTimeTracking: false,
          canManageDispatchFees: false,
          canViewLoadHistory: false
        },
        brokerBox: {
          canViewShipperManagement: true,
          canCreateQuotes: true,
          canPostLoads: true,
          canViewMarketRates: true,
          canAccessRfxCenter: true,
          canViewPerformanceAnalytics: true,
          canManageCustomerRelations: true,
          canAccessLoadMatching: true,
          canViewCommissionTracking: true,
          canManageBrokerTools: true
        },
        driverManagement: {
          canViewDriverList: false, // No driver management
          canCreateDriverProfiles: false,
          canEditDriverDetails: false,
          canViewDriverPerformance: false,
          canManageDriverScheduling: false,
          canAccessDriverCommunication: false,
          canViewDriverDocuments: false,
          canManageDriverOnboarding: false,
          canViewDriverFinancials: false,
          canAccessDriverPortal: false
        },
        fleetFlow: {
          canViewRouteOptimization: false, // Limited fleet access
          canCreateRoutes: false,
          canViewVehicleManagement: false,
          canAccessMaintenanceScheduling: false,
          canViewFuelManagement: false,
          canAccessFleetTracking: false,
          canViewFleetAnalytics: false,
          canManageVehicleDocuments: false,
          canViewFleetPerformance: false,
          canAccessFleetReporting: false
        },
        analytics: {
          // NO ACCESS TO ANALYTICS
          canViewRevenueAnalytics: false,
          canViewPerformanceMetrics: false,
          canViewCustomerAnalytics: false,
          canViewOperationalAnalytics: false,
          canViewProfitabilityAnalysis: false,
          canViewTrendAnalysis: false,
          canCreateCustomReports: false,
          canExportAnalyticsData: false,
          canViewRealTimeMetrics: false,
          canAccessPredictiveAnalytics: false
        },
        financials: {
          // NO ACCESS TO FINANCIALS
          canViewInvoicing: false,
          canViewAccountsReceivable: false,
          canViewAccountsPayable: false,
          canViewPayroll: false,
          canViewCashFlow: false,
          canViewProfitLoss: false,
          canViewTaxDocuments: false,
          canProcessPayments: false,
          canViewFinancialReports: false,
          canAccessAuditTrail: false
        },
        settings: {
          // NO SETTINGS ACCESS
          canViewUserManagement: false,
          canCreateUsers: false,
          canEditPermissions: false,
          canViewSystemSettings: false,
          canManageIntegrations: false,
          canViewSecuritySettings: false,
          canAccessBackupSettings: false,
          canViewAuditLogs: false,
          canManageCompanySettings: false,
          canAccessDeveloperTools: false
        },
        training: {
          canViewTrainingModules: true,
          canTakeQuizzes: true,
          canViewCertificates: true,
          canViewProgress: true,
          canAccessInstructor: false,
          canManageTrainingContent: false,
          canViewAllUserProgress: false,
          canAssignTraining: false,
          canGenerateCertificates: false,
          canAccessTrainingAnalytics: false
        },
        compliance: {
          canViewDOTCompliance: true,
          canManageDriverQualifications: false,
          canViewSafetyRecords: false,
          canAccessInspectionReports: false,
          canViewViolationTracking: false,
          canManageComplianceDocuments: false,
          canViewCSAScores: false,
          canAccessAuditPrep: false,
          canViewComplianceAnalytics: false,
          canManageComplianceAlerts: false
        },
        accounting: {
          // NO ACCESS TO ACCOUNTING
          canViewRevenueDashboard: false,
          canViewExpenseTracking: false,
          canViewInvoiceManagement: false,
          canViewPayrollProcessing: false,
          canViewTaxManagement: false,
          canViewFinancialReporting: false,
          canViewCashFlowAnalysis: false,
          canProcessPayments: false,
          canViewAccountingAudit: false,
          canAccessFinancialSettings: false
        }
      };
      break;
      
    case 'driver':
      permissions = {
        dashboard: {
          canViewRevenue: false, // NO REVENUE ACCESS
          canViewLoadStatistics: true, // Only own load stats
          canViewPerformanceCharts: true, // Only own performance
          canViewQuickActions: true,
          canViewAlerts: true,
          canViewRecentActivity: true,
          canExportData: false
        },
        dispatchCentral: {
          // NO DISPATCH ACCESS
          canViewLoadBoard: false,
          canCreateLoads: false,
          canAssignDrivers: false,
          canViewDriverLocations: false,
          canAccessRoutePlanning: false,
          canViewCommunicationHub: false,
          canGenerateDocuments: false,
          canViewRealTimeTracking: false,
          canManageDispatchFees: false,
          canViewLoadHistory: false
        },
        brokerBox: {
          // NO BROKER ACCESS
          canViewShipperManagement: false,
          canCreateQuotes: false,
          canPostLoads: false,
          canViewMarketRates: false,
          canAccessRfxCenter: false,
          canViewPerformanceAnalytics: false,
          canManageCustomerRelations: false,
          canAccessLoadMatching: false,
          canViewCommissionTracking: false,
          canManageBrokerTools: false
        },
        driverManagement: {
          // NO MANAGEMENT ACCESS
          canViewDriverList: false,
          canCreateDriverProfiles: false,
          canEditDriverDetails: false,
          canViewDriverPerformance: false,
          canManageDriverScheduling: false,
          canAccessDriverCommunication: false,
          canViewDriverDocuments: false,
          canManageDriverOnboarding: false,
          canViewDriverFinancials: false,
          canAccessDriverPortal: true // Own portal only
        },
        fleetFlow: {
          // LIMITED FLEET ACCESS
          canViewRouteOptimization: false,
          canCreateRoutes: false,
          canViewVehicleManagement: false,
          canAccessMaintenanceScheduling: false,
          canViewFuelManagement: false,
          canAccessFleetTracking: false,
          canViewFleetAnalytics: false,
          canManageVehicleDocuments: false,
          canViewFleetPerformance: false,
          canAccessFleetReporting: false
        },
        analytics: {
          // NO ACCESS TO ANALYTICS
          canViewRevenueAnalytics: false,
          canViewPerformanceMetrics: false,
          canViewCustomerAnalytics: false,
          canViewOperationalAnalytics: false,
          canViewProfitabilityAnalysis: false,
          canViewTrendAnalysis: false,
          canCreateCustomReports: false,
          canExportAnalyticsData: false,
          canViewRealTimeMetrics: false,
          canAccessPredictiveAnalytics: false
        },
        financials: {
          // NO ACCESS TO FINANCIALS
          canViewInvoicing: false,
          canViewAccountsReceivable: false,
          canViewAccountsPayable: false,
          canViewPayroll: false,
          canViewCashFlow: false,
          canViewProfitLoss: false,
          canViewTaxDocuments: false,
          canProcessPayments: false,
          canViewFinancialReports: false,
          canAccessAuditTrail: false
        },
        settings: {
          // NO SETTINGS ACCESS
          canViewUserManagement: false,
          canCreateUsers: false,
          canEditPermissions: false,
          canViewSystemSettings: false,
          canManageIntegrations: false,
          canViewSecuritySettings: false,
          canAccessBackupSettings: false,
          canViewAuditLogs: false,
          canManageCompanySettings: false,
          canAccessDeveloperTools: false
        },
        training: {
          canViewTrainingModules: true,
          canTakeQuizzes: true,
          canViewCertificates: true,
          canViewProgress: true, // Own progress only
          canAccessInstructor: false,
          canManageTrainingContent: false,
          canViewAllUserProgress: false,
          canAssignTraining: false,
          canGenerateCertificates: false,
          canAccessTrainingAnalytics: false
        },
        compliance: {
          canViewDOTCompliance: true, // Own compliance only
          canManageDriverQualifications: false,
          canViewSafetyRecords: true, // Own records only
          canAccessInspectionReports: true, // Own reports only
          canViewViolationTracking: true, // Own violations only
          canManageComplianceDocuments: false,
          canViewCSAScores: false,
          canAccessAuditPrep: false,
          canViewComplianceAnalytics: false,
          canManageComplianceAlerts: false
        },
        accounting: {
          // NO ACCESS TO ACCOUNTING
          canViewRevenueDashboard: false,
          canViewExpenseTracking: false,
          canViewInvoiceManagement: false,
          canViewPayrollProcessing: false,
          canViewTaxManagement: false,
          canViewFinancialReporting: false,
          canViewCashFlowAnalysis: false,
          canProcessPayments: false,
          canViewAccountingAudit: false,
          canAccessFinancialSettings: false
        }
      };
      break;
      
    case 'instructor':
      permissions = {
        dashboard: {
          canViewRevenue: false,
          canViewLoadStatistics: false,
          canViewPerformanceCharts: true,
          canViewQuickActions: true,
          canViewAlerts: true,
          canViewRecentActivity: true,
          canExportData: false
        },
        dispatchCentral: {
          canViewLoadBoard: false,
          canCreateLoads: false,
          canAssignDrivers: false,
          canViewDriverLocations: false,
          canAccessRoutePlanning: false,
          canViewCommunicationHub: false,
          canGenerateDocuments: false,
          canViewRealTimeTracking: false,
          canManageDispatchFees: false,
          canViewLoadHistory: false
        },
        brokerBox: {
          canViewShipperManagement: false,
          canCreateQuotes: false,
          canPostLoads: false,
          canViewMarketRates: false,
          canAccessRfxCenter: false,
          canViewPerformanceAnalytics: false,
          canManageCustomerRelations: false,
          canAccessLoadMatching: false,
          canViewCommissionTracking: false,
          canManageBrokerTools: false
        },
        driverManagement: {
          canViewDriverList: false,
          canCreateDriverProfiles: false,
          canEditDriverDetails: false,
          canViewDriverPerformance: false,
          canManageDriverScheduling: false,
          canAccessDriverCommunication: false,
          canViewDriverDocuments: false,
          canManageDriverOnboarding: false,
          canViewDriverFinancials: false,
          canAccessDriverPortal: false
        },
        fleetFlow: {
          canViewRouteOptimization: false,
          canCreateRoutes: false,
          canViewVehicleManagement: false,
          canAccessMaintenanceScheduling: false,
          canViewFuelManagement: false,
          canAccessFleetTracking: false,
          canViewFleetAnalytics: false,
          canManageVehicleDocuments: false,
          canViewFleetPerformance: false,
          canAccessFleetReporting: false
        },
        analytics: {
          canViewRevenueAnalytics: false,
          canViewPerformanceMetrics: false,
          canViewCustomerAnalytics: false,
          canViewOperationalAnalytics: false,
          canViewProfitabilityAnalysis: false,
          canViewTrendAnalysis: false,
          canCreateCustomReports: false,
          canExportAnalyticsData: false,
          canViewRealTimeMetrics: false,
          canAccessPredictiveAnalytics: false
        },
        financials: {
          canViewInvoicing: false,
          canViewAccountsReceivable: false,
          canViewAccountsPayable: false,
          canViewPayroll: false,
          canViewCashFlow: false,
          canViewProfitLoss: false,
          canViewTaxDocuments: false,
          canProcessPayments: false,
          canViewFinancialReports: false,
          canAccessAuditTrail: false
        },
        settings: {
          canViewUserManagement: true, // Can manage students
          canCreateUsers: false,
          canEditPermissions: false,
          canViewSystemSettings: false,
          canManageIntegrations: false,
          canViewSecuritySettings: false,
          canAccessBackupSettings: false,
          canViewAuditLogs: false,
          canManageCompanySettings: false,
          canAccessDeveloperTools: false
        },
        training: {
          canViewTrainingModules: true,
          canTakeQuizzes: true,
          canViewCertificates: true,
          canViewProgress: true,
          canAccessInstructor: true,
          canManageTrainingContent: true,
          canViewAllUserProgress: true,
          canAssignTraining: true,
          canGenerateCertificates: true,
          canAccessTrainingAnalytics: true
        },
        compliance: {
          canViewDOTCompliance: true,
          canManageDriverQualifications: false,
          canViewSafetyRecords: true,
          canAccessInspectionReports: false,
          canViewViolationTracking: false,
          canManageComplianceDocuments: false,
          canViewCSAScores: false,
          canAccessAuditPrep: false,
          canViewComplianceAnalytics: false,
          canManageComplianceAlerts: false
        },
        accounting: {
          canViewRevenueDashboard: false,
          canViewExpenseTracking: false,
          canViewInvoiceManagement: false,
          canViewPayrollProcessing: false,
          canViewTaxManagement: false,
          canViewFinancialReporting: false,
          canViewCashFlowAnalysis: false,
          canProcessPayments: false,
          canViewAccountingAudit: false,
          canAccessFinancialSettings: false
        }
      };
      break;
      
    default:
      // Default to no access
      permissions = {
        dashboard: {
          canViewRevenue: false,
          canViewLoadStatistics: false,
          canViewPerformanceCharts: false,
          canViewQuickActions: false,
          canViewAlerts: false,
          canViewRecentActivity: false,
          canExportData: false
        },
        dispatchCentral: {
          canViewLoadBoard: false,
          canCreateLoads: false,
          canAssignDrivers: false,
          canViewDriverLocations: false,
          canAccessRoutePlanning: false,
          canViewCommunicationHub: false,
          canGenerateDocuments: false,
          canViewRealTimeTracking: false,
          canManageDispatchFees: false,
          canViewLoadHistory: false
        },
        brokerBox: {
          canViewShipperManagement: false,
          canCreateQuotes: false,
          canPostLoads: false,
          canViewMarketRates: false,
          canAccessRfxCenter: false,
          canViewPerformanceAnalytics: false,
          canManageCustomerRelations: false,
          canAccessLoadMatching: false,
          canViewCommissionTracking: false,
          canManageBrokerTools: false
        },
        driverManagement: {
          canViewDriverList: false,
          canCreateDriverProfiles: false,
          canEditDriverDetails: false,
          canViewDriverPerformance: false,
          canManageDriverScheduling: false,
          canAccessDriverCommunication: false,
          canViewDriverDocuments: false,
          canManageDriverOnboarding: false,
          canViewDriverFinancials: false,
          canAccessDriverPortal: false
        },
        fleetFlow: {
          canViewRouteOptimization: false,
          canCreateRoutes: false,
          canViewVehicleManagement: false,
          canAccessMaintenanceScheduling: false,
          canViewFuelManagement: false,
          canAccessFleetTracking: false,
          canViewFleetAnalytics: false,
          canManageVehicleDocuments: false,
          canViewFleetPerformance: false,
          canAccessFleetReporting: false
        },
        analytics: {
          canViewRevenueAnalytics: false,
          canViewPerformanceMetrics: false,
          canViewCustomerAnalytics: false,
          canViewOperationalAnalytics: false,
          canViewProfitabilityAnalysis: false,
          canViewTrendAnalysis: false,
          canCreateCustomReports: false,
          canExportAnalyticsData: false,
          canViewRealTimeMetrics: false,
          canAccessPredictiveAnalytics: false
        },
        financials: {
          canViewInvoicing: false,
          canViewAccountsReceivable: false,
          canViewAccountsPayable: false,
          canViewPayroll: false,
          canViewCashFlow: false,
          canViewProfitLoss: false,
          canViewTaxDocuments: false,
          canProcessPayments: false,
          canViewFinancialReports: false,
          canAccessAuditTrail: false
        },
        settings: {
          canViewUserManagement: false,
          canCreateUsers: false,
          canEditPermissions: false,
          canViewSystemSettings: false,
          canManageIntegrations: false,
          canViewSecuritySettings: false,
          canAccessBackupSettings: false,
          canViewAuditLogs: false,
          canManageCompanySettings: false,
          canAccessDeveloperTools: false
        },
        training: {
          canViewTrainingModules: false,
          canTakeQuizzes: false,
          canViewCertificates: false,
          canViewProgress: false,
          canAccessInstructor: false,
          canManageTrainingContent: false,
          canViewAllUserProgress: false,
          canAssignTraining: false,
          canGenerateCertificates: false,
          canAccessTrainingAnalytics: false
        },
        compliance: {
          canViewDOTCompliance: false,
          canManageDriverQualifications: false,
          canViewSafetyRecords: false,
          canAccessInspectionReports: false,
          canViewViolationTracking: false,
          canManageComplianceDocuments: false,
          canViewCSAScores: false,
          canAccessAuditPrep: false,
          canViewComplianceAnalytics: false,
          canManageComplianceAlerts: false
        },
        accounting: {
          canViewRevenueDashboard: false,
          canViewExpenseTracking: false,
          canViewInvoiceManagement: false,
          canViewPayrollProcessing: false,
          canViewTaxManagement: false,
          canViewFinancialReporting: false,
          canViewCashFlowAnalysis: false,
          canProcessPayments: false,
          canViewAccountingAudit: false,
          canAccessFinancialSettings: false
        }
      };
  }
  
  // Apply custom permission overrides if they exist
  if (customPermissions) {
    Object.keys(customPermissions).forEach(pageKey => {
      const page = pageKey as keyof PageSectionPermissions;
      if (permissions[page] && customPermissions[page]) {
        Object.assign(permissions[page], customPermissions[page]);
      }
    });
  }
  
  return permissions;
};

// Mock users with custom permission examples
export const MOCK_USERS: User[] = [
  { id: 'admin-001', name: 'System Admin', email: 'admin@fleetflowapp.com', role: 'admin', departmentCode: 'MGR' },
  { id: 'mgr-001', name: 'Fleet Manager', email: 'manager@fleetflowapp.com', role: 'manager', departmentCode: 'MGR' },
  
  // Dispatchers (DC Department)
  { id: 'disp-001', name: 'Sarah Johnson', email: 'sarah@fleetflowapp.com', role: 'dispatcher', departmentCode: 'DC', assignedBrokers: ['broker-001', 'broker-002'] },
  { id: 'disp-002', name: 'Mike Chen', email: 'mike@fleetflowapp.com', role: 'dispatcher', departmentCode: 'DC', assignedBrokers: ['broker-003'] },
  
  // Brokers (BB Department)
  { id: 'broker-001', name: 'John Smith', email: 'john.smith@globalfreight.com', role: 'broker', departmentCode: 'BB', brokerId: 'broker-001', dispatcherId: 'disp-001', companyName: 'Global Freight Solutions' },
  { id: 'broker-002', name: 'Maria Garcia', email: 'maria.garcia@swift.com', role: 'broker', departmentCode: 'BB', brokerId: 'broker-002', dispatcherId: 'disp-001', companyName: 'Swift Freight' },
  { id: 'broker-003', name: 'David Wilson', email: 'david.wilson@express.com', role: 'broker', departmentCode: 'BB', brokerId: 'broker-003', dispatcherId: 'disp-002', companyName: 'Express Cargo' },
  
  // Drivers (DM Department)
  { id: 'driver-001', name: 'Robert Johnson', email: 'robert.j@fleetflowapp.com', role: 'driver', departmentCode: 'DM' },
  { id: 'driver-002', name: 'Michelle Davis', email: 'michelle.d@fleetflowapp.com', role: 'driver', departmentCode: 'DM' },
  
  // Instructors
  { id: 'instructor-001', name: 'Dr. Patricia Wilson', email: 'p.wilson@fleetflowapp.com', role: 'instructor', departmentCode: 'MGR' },
  
  // Example: Custom permissions for a dispatcher with limited access
  { 
    id: 'disp-003', 
    name: 'Limited Dispatcher', 
    email: 'limited@fleetflowapp.com', 
    role: 'dispatcher', 
    departmentCode: 'DC',
    customPermissions: {
      driverManagement: {
        canViewDriverFinancials: false, // Override: No financial access
        canManageDriverOnboarding: false // Override: No onboarding access
      }
    }
  }
];

// Main function to get current user with section permissions
export const getCurrentUser = (): { user: User; permissions: PageSectionPermissions } => {
  // Change this ID to test different users and permission levels:
  const currentUserId = 'admin-001'; // Try: 'broker-001', 'disp-001', 'driver-001', 'disp-003'
  
  const user = MOCK_USERS.find(u => u.id === currentUserId) || MOCK_USERS[0];
  const permissions = getSectionPermissions(user);
  
  return { user, permissions };
};

// Helper functions for section-level access checking
export const canAccessDashboardSection = (section: keyof PageSectionPermissions['dashboard']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.dashboard[section];
};

export const canAccessDispatchSection = (section: keyof PageSectionPermissions['dispatchCentral']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.dispatchCentral[section];
};

export const canAccessBrokerSection = (section: keyof PageSectionPermissions['brokerBox']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.brokerBox[section];
};

export const canAccessDriverManagementSection = (section: keyof PageSectionPermissions['driverManagement']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.driverManagement[section];
};

export const canAccessFleetFlowSection = (section: keyof PageSectionPermissions['fleetFlow']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.fleetFlow[section];
};

export const canAccessAnalyticsSection = (section: keyof PageSectionPermissions['analytics']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.analytics[section];
};

export const canAccessFinancialsSection = (section: keyof PageSectionPermissions['financials']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.financials[section];
};

export const canAccessSettingsSection = (section: keyof PageSectionPermissions['settings']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.settings[section];
};

export const canAccessTrainingSection = (section: keyof PageSectionPermissions['training']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.training[section];
};

export const canAccessComplianceSection = (section: keyof PageSectionPermissions['compliance']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.compliance[section];
};

export const canAccessAccountingSection = (section: keyof PageSectionPermissions['accounting']): boolean => {
  const { permissions } = getCurrentUser();
  return permissions.accounting[section];
};

// Backwards compatibility
export const checkPermission = (permission: string): boolean => {
  const { permissions } = getCurrentUser();
  
  switch (permission) {
    case 'hasManagementAccess':
      return permissions.analytics.canViewRevenueAnalytics || permissions.financials.canViewInvoicing;
    case 'hasAnalyticsAccess':
      return permissions.analytics.canViewRevenueAnalytics;
    case 'hasFinancialsAccess':
      return permissions.financials.canViewInvoicing;
    case 'canEditLoads':
      return permissions.dispatchCentral.canCreateLoads;
    case 'canViewFinancials':
      return permissions.financials.canViewInvoicing;
    default:
      return true;
  }
};

// Training access (keeping existing interface)
export interface TrainingAccess {
  canAccessTraining: boolean;
  allowedModules: string[];
  canViewCertificates: boolean;
  canManageTraining?: boolean;
  canViewAllProgress?: boolean;
}

export const TRAINING_MODULES = {
  DISPATCH: 'dispatch',
  BROKER: 'broker',
  COMPLIANCE: 'compliance',
  SAFETY: 'safety',
  TECHNOLOGY: 'technology',
  CUSTOMER: 'customer',
  WORKFLOW: 'workflow',
  SMS: 'sms'
} as const;

export const getTrainingAccess = (userRole: UserRole): TrainingAccess => {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return {
        canAccessTraining: true,
        allowedModules: Object.values(TRAINING_MODULES),
        canViewCertificates: true,
        canManageTraining: true,
        canViewAllProgress: true
      };

    case USER_ROLES.MANAGER:
      return {
        canAccessTraining: true,
        allowedModules: Object.values(TRAINING_MODULES),
        canViewCertificates: true,
        canViewAllProgress: true
      };

    case USER_ROLES.DISPATCHER:
      return {
        canAccessTraining: true,
        allowedModules: [
          TRAINING_MODULES.DISPATCH,
          TRAINING_MODULES.WORKFLOW,
          TRAINING_MODULES.COMPLIANCE,
          TRAINING_MODULES.SAFETY,
          TRAINING_MODULES.TECHNOLOGY,
          TRAINING_MODULES.CUSTOMER
        ],
        canViewCertificates: true
      };

    case USER_ROLES.BROKER:
      return {
        canAccessTraining: true,
        allowedModules: [
          TRAINING_MODULES.BROKER,
          TRAINING_MODULES.WORKFLOW,
          TRAINING_MODULES.COMPLIANCE,
          TRAINING_MODULES.CUSTOMER
        ],
        canViewCertificates: true
      };

    case USER_ROLES.DRIVER:
      return {
        canAccessTraining: true,
        allowedModules: [
          TRAINING_MODULES.SAFETY,
          TRAINING_MODULES.COMPLIANCE,
          TRAINING_MODULES.TECHNOLOGY
        ],
        canViewCertificates: true
      };

    default:
      return {
        canAccessTraining: false,
        allowedModules: [],
        canViewCertificates: false
      };
  }
};
