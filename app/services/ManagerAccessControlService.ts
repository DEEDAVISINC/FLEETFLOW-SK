// FleetFlow Manager-Only Access Control Service
// CRITICAL SECURITY: Only company managers can access payment routing and financial management

import { User, getCurrentUser } from '../config/access';

// Manager verification result
export interface ManagerVerification {
  isVerified: boolean;
  managerId: string;
  companyId: string;
  companyName: string;
  accessLevel: 'COMPANY_MANAGER' | 'DENIED';
  permissions: CompanyManagerPermissions;
}

// Company structure managed by manager
export interface CompanyStructure {
  manager: User;
  company: BrokerCompany;
  brokerAgents: BrokerAgent[];
  totalAgents: number;
  companyStatus: 'active' | 'inactive' | 'suspended';
}

// Company manager permissions (MANAGER ONLY)
export interface CompanyManagerPermissions {
  // COMPANY PAYMENT MANAGEMENT (MANAGER ONLY)
  companyPaymentManagement: {
    canViewCompanyAccounts: boolean; // TRUE for managers only
    canEditCompanyBankAccounts: boolean; // TRUE for managers only
    canVerifyPaymentAccounts: boolean; // TRUE for managers only
    canViewPaymentRouting: boolean; // TRUE for managers only
    canModifyPaymentRouting: boolean; // TRUE for managers only
    canAccessPaymentAudits: boolean; // TRUE for managers only
  };

  // AGENT COMMISSION MANAGEMENT (MANAGER ONLY)
  agentCommissionManagement: {
    canViewAllAgentCommissions: boolean; // TRUE for managers only
    canModifyCommissionRates: boolean; // TRUE for managers only
    canApproveCommissionPayments: boolean; // TRUE for managers only
    canViewCommissionReports: boolean; // TRUE for managers only
    canManageCommissionStructure: boolean; // TRUE for managers only
  };

  // COMPANY FINANCIAL OVERSIGHT (MANAGER ONLY)
  companyFinancialOversight: {
    canViewCompanyRevenue: boolean; // TRUE for managers only
    canViewAgentPerformance: boolean; // TRUE for managers only
    canViewProfitMargins: boolean; // TRUE for managers only
    canAccessFinancialReports: boolean; // TRUE for managers only
    canManageCompanyBilling: boolean; // TRUE for managers only
  };

  // AGENT MANAGEMENT (MANAGER ONLY)
  agentManagement: {
    canAddRemoveAgents: boolean; // TRUE for managers only
    canModifyAgentPermissions: boolean; // TRUE for managers only
    canViewAgentActivity: boolean; // TRUE for managers only
    canSuspendAgents: boolean; // TRUE for managers only
    canManageAgentOnboarding: boolean; // TRUE for managers only
  };
}

// Broker agent restrictions (CRITICAL)
export interface BrokerAgentRestrictions {
  // PAYMENT ACCESS (ALL FALSE FOR AGENTS)
  paymentAccess: {
    canViewCompanyAccounts: false; // ALWAYS FALSE
    canEditBankAccounts: false; // ALWAYS FALSE
    canViewPaymentRouting: false; // ALWAYS FALSE
    canAccessFinancialReports: false; // ALWAYS FALSE
    canViewCommissionRates: false; // ALWAYS FALSE
  };

  // WHAT AGENTS CAN ACCESS
  allowedAccess: {
    canViewOwnCommissions: boolean; // TRUE - own commission only
    canCreateQuotes: boolean; // TRUE
    canManageOwnShippers: boolean; // TRUE
    canViewOwnPerformance: boolean; // TRUE
    canAccessOwnReports: boolean; // TRUE
  };
}

// Company and agent interfaces
export interface BrokerCompany {
  companyId: string;
  companyName: string;
  managerId: string;
  status: 'active' | 'inactive' | 'suspended';
  paymentAccount: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  taxId: string;
  establishedDate: string;
}

export interface BrokerAgent {
  agentId: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  managerId: string;
  status: 'active' | 'inactive' | 'suspended';
  commissionRate: number;
  hireDate: string;
  permissions: BrokerAgentRestrictions['allowedAccess'];
}

// Mock company data
const MOCK_COMPANIES: BrokerCompany[] = [
  {
    companyId: 'comp-001',
    companyName: 'Global Freight Solutions',
    managerId: 'mgr-001',
    status: 'active',
    paymentAccount: {
      bankName: 'Chase Business Banking',
      accountNumber: '****-****-1234',
      routingNumber: '021000021',
      accountType: 'checking',
    },
    billingAddress: {
      street: '123 Freight Ave',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
    },
    taxId: '12-3456789',
    establishedDate: '2020-01-15',
  },
  {
    companyId: 'comp-002',
    companyName: 'Swift Freight',
    managerId: 'mgr-002',
    status: 'active',
    paymentAccount: {
      bankName: 'Bank of America Business',
      accountNumber: '****-****-5678',
      routingNumber: '026009593',
      accountType: 'checking',
    },
    billingAddress: {
      street: '456 Logistics Blvd',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
    },
    taxId: '98-7654321',
    establishedDate: '2019-03-22',
  },
];

// Mock broker agents
const MOCK_BROKER_AGENTS: BrokerAgent[] = [
  {
    agentId: 'broker-001',
    name: 'John Smith',
    email: 'john.smith@globalfreight.com',
    companyId: 'comp-001',
    companyName: 'Global Freight Solutions',
    managerId: 'mgr-001',
    status: 'active',
    commissionRate: 0.05,
    hireDate: '2023-01-15',
    permissions: {
      canViewOwnCommissions: true,
      canCreateQuotes: true,
      canManageOwnShippers: true,
      canViewOwnPerformance: true,
      canAccessOwnReports: true,
    },
  },
  {
    agentId: 'broker-002',
    name: 'Maria Garcia',
    email: 'maria.garcia@swift.com',
    companyId: 'comp-002',
    companyName: 'Swift Freight',
    managerId: 'mgr-002',
    status: 'active',
    commissionRate: 0.06,
    hireDate: '2023-02-20',
    permissions: {
      canViewOwnCommissions: true,
      canCreateQuotes: true,
      canManageOwnShippers: true,
      canViewOwnPerformance: true,
      canAccessOwnReports: true,
    },
  },
];

export class ManagerAccessControlService {
  /**
   * CRITICAL: Verify user is a company manager
   */
  static async verifyCompanyManager(
    userId?: string
  ): Promise<ManagerVerification> {
    try {
      const { user } = getCurrentUser();
      const currentUserId = userId || user.id;

      // Must be manager role AND MGR department
      const isManager =
        user.role === 'manager' && user.departmentCode === 'MGR';

      if (!isManager) {
        throw new Error(
          'ACCESS_DENIED: Company payment management requires manager role'
        );
      }

      // Get manager's company
      const managerCompany = this.getManagerCompany(currentUserId);

      if (!managerCompany) {
        throw new Error('ACCESS_DENIED: No company found for manager');
      }

      return {
        isVerified: true,
        managerId: currentUserId,
        companyId: managerCompany.companyId,
        companyName: managerCompany.companyName,
        accessLevel: 'COMPANY_MANAGER',
        permissions: this.getManagerPermissions(),
      };
    } catch (error) {
      console.error('Manager verification failed:', error);
      return {
        isVerified: false,
        managerId: '',
        companyId: '',
        companyName: '',
        accessLevel: 'DENIED',
        permissions: this.getDeniedPermissions(),
      };
    }
  }

  /**
   * CRITICAL: Block agent access to company functions
   */
  static blockAgentAccess(userId: string, requestedResource: string): void {
    const { user } = getCurrentUser();

    // Check if user is broker agent trying to access company functions
    if (user.role === 'broker' && user.departmentCode === 'BB') {
      const restrictedResources = [
        'company-payment-accounts',
        'agent-commission-management',
        'company-financial-reports',
        'payment-routing-settings',
        'company-billing-management',
      ];

      if (restrictedResources.includes(requestedResource)) {
        throw new Error(
          `ACCESS_DENIED: Broker agents cannot access ${requestedResource}`
        );
      }
    }
  }

  /**
   * Get manager's company and associated agents
   */
  static async getManagerCompanyStructure(
    managerId: string
  ): Promise<CompanyStructure> {
    const { user } = getCurrentUser();

    // Get company managed by this manager
    const company = this.getManagerCompany(managerId);

    if (!company) {
      throw new Error('No company found for manager');
    }

    // Get all agents under this company
    const brokerAgents = this.getBrokerAgentsByCompany(company.companyId);

    return {
      manager: user,
      company,
      brokerAgents,
      totalAgents: brokerAgents.length,
      companyStatus: company.status,
    };
  }

  /**
   * Get company by manager ID
   */
  private static getManagerCompany(managerId: string): BrokerCompany | null {
    return (
      MOCK_COMPANIES.find((company) => company.managerId === managerId) || null
    );
  }

  /**
   * Get broker agents by company ID
   */
  private static getBrokerAgentsByCompany(companyId: string): BrokerAgent[] {
    return MOCK_BROKER_AGENTS.filter((agent) => agent.companyId === companyId);
  }

  /**
   * Get full manager permissions (all TRUE)
   */
  private static getManagerPermissions(): CompanyManagerPermissions {
    return {
      companyPaymentManagement: {
        canViewCompanyAccounts: true,
        canEditCompanyBankAccounts: true,
        canVerifyPaymentAccounts: true,
        canViewPaymentRouting: true,
        canModifyPaymentRouting: true,
        canAccessPaymentAudits: true,
      },
      agentCommissionManagement: {
        canViewAllAgentCommissions: true,
        canModifyCommissionRates: true,
        canApproveCommissionPayments: true,
        canViewCommissionReports: true,
        canManageCommissionStructure: true,
      },
      companyFinancialOversight: {
        canViewCompanyRevenue: true,
        canViewAgentPerformance: true,
        canViewProfitMargins: true,
        canAccessFinancialReports: true,
        canManageCompanyBilling: true,
      },
      agentManagement: {
        canAddRemoveAgents: true,
        canModifyAgentPermissions: true,
        canViewAgentActivity: true,
        canSuspendAgents: true,
        canManageAgentOnboarding: true,
      },
    };
  }

  /**
   * Get denied permissions (all FALSE)
   */
  private static getDeniedPermissions(): CompanyManagerPermissions {
    return {
      companyPaymentManagement: {
        canViewCompanyAccounts: false,
        canEditCompanyBankAccounts: false,
        canVerifyPaymentAccounts: false,
        canViewPaymentRouting: false,
        canModifyPaymentRouting: false,
        canAccessPaymentAudits: false,
      },
      agentCommissionManagement: {
        canViewAllAgentCommissions: false,
        canModifyCommissionRates: false,
        canApproveCommissionPayments: false,
        canViewCommissionReports: false,
        canManageCommissionStructure: false,
      },
      companyFinancialOversight: {
        canViewCompanyRevenue: false,
        canViewAgentPerformance: false,
        canViewProfitMargins: false,
        canAccessFinancialReports: false,
        canManageCompanyBilling: false,
      },
      agentManagement: {
        canAddRemoveAgents: false,
        canModifyAgentPermissions: false,
        canViewAgentActivity: false,
        canSuspendAgents: false,
        canManageAgentOnboarding: false,
      },
    };
  }

  /**
   * Check if current user is a manager
   */
  static isCurrentUserManager(): boolean {
    const { user } = getCurrentUser();
    return user.role === 'manager' && user.departmentCode === 'MGR';
  }

  /**
   * Check if current user is a broker agent
   */
  static isCurrentUserBrokerAgent(): boolean {
    const { user } = getCurrentUser();
    return user.role === 'broker' && user.departmentCode === 'BB';
  }
}
