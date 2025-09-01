/**
 * Enhanced User Management Service
 * Supports both individual users AND business entities (freight brokerage companies)
 * Integrates with existing UserIdentificationService for FBB/BB hierarchy
 */

import UserIdentificationService, {
  UserIdentificationData,
} from './UserIdentificationService';

// Enhanced user data structure supporting both individuals and business entities
export interface EnhancedUserData {
  // Core user information (existing)
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  departmentCode: string;
  position: string;
  hiredDate: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;

  // User type distinction
  userType: 'individual' | 'business_entity';

  // Business entity information (for FBB companies)
  businessInfo?: {
    companyName: string;
    businessAddress: string;
    mcNumber?: string;
    dotNumber?: string;
    businessPhone: string;
    businessEmail: string;
    ownerName: string;
    businessType: 'freight_brokerage' | 'carrier' | 'shipper' | 'other';
    incorporationDate?: string;
    taxId?: string;
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      expirationDate: string;
      coverageAmount: number;
    };
    territories: string[];
    specializations: string[];
  };

  // Individual user information (existing structure)
  personalInfo?: {
    emergencyContact: {
      name: string;
      relation: string;
      phone: string;
      altPhone?: string;
    };
  };

  // Hierarchy relationships
  parentCompanyId?: string; // For BB agents linked to FBB companies
  childAgents?: string[]; // For FBB companies with BB agents

  // System access and permissions (existing)
  systemAccess: {
    level: string;
    accessCode: string;
    securityLevel: string;
    allowedSystems: string[];
  };

  permissions: Record<string, boolean>;
  notes: string;

  // Workflow tracking (existing)
  workflow?: {
    sessionId: string;
    status: string;
    currentStep: number;
    totalSteps: number;
    progressPercentage: number;
    startedAt?: string;
    completedAt?: string;
    steps: any[];
    documents: any[];
    training?: any;
  };

  // AI Flow status (existing)
  aiFlowStatus?: {
    isOptedIn: boolean;
    optInDate?: string;
    agreementSigned: boolean;
    agreementNumber?: string;
    leadCount?: number;
    conversionRate?: string;
    monthlyRevenue?: string;
    commissionOwed?: string;
    lastLeadDate?: string;
    performanceTier?: string;
    status: string;
  };
}

export interface BusinessRegistrationData {
  // Business entity details
  companyName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  mcNumber?: string;
  dotNumber?: string;
  taxId?: string;

  // Owner/Contact information
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  position: string;

  // Business operations
  territories: string[];
  specializations: string[];
  businessType: 'freight_brokerage' | 'carrier' | 'shipper';

  // Registration details
  incorporationDate?: string;
  password: string;
  confirmPassword: string;
}

export class EnhancedUserManagementService {
  /**
   * Create a business entity (FBB company) in user management
   */
  static async createBusinessEntity(
    registrationData: BusinessRegistrationData
  ): Promise<{
    success: boolean;
    userId?: string;
    message: string;
  }> {
    try {
      // Validate required fields
      if (
        !registrationData.companyName ||
        !registrationData.ownerFirstName ||
        !registrationData.ownerLastName
      ) {
        return {
          success: false,
          message: 'Missing required company or owner information',
        };
      }

      // Generate user identification data
      const identificationData: UserIdentificationData = {
        firstName: registrationData.ownerFirstName,
        lastName: registrationData.ownerLastName,
        email: registrationData.ownerEmail,
        role: 'Freight Brokerage',
        department: 'Freight Brokerage',
        hiredDate: new Date().toISOString().split('T')[0],
        phoneNumber: registrationData.ownerPhone,
      };

      const userIdentifiers =
        UserIdentificationService.generateUserIdentifiers(identificationData);

      // Create enhanced user data for business entity
      const businessUser: EnhancedUserData = {
        id: userIdentifiers.userId,
        name: `${registrationData.ownerFirstName} ${registrationData.ownerLastName}`,
        email: registrationData.ownerEmail,
        phone: registrationData.ownerPhone,
        department: 'Freight Brokerage',
        departmentCode: 'FBB',
        position: registrationData.position || 'Owner/Manager',
        hiredDate: new Date().toISOString().split('T')[0],
        role: 'Freight Brokerage',
        status: 'active',
        lastActive: new Date().toISOString(),
        userType: 'business_entity',

        businessInfo: {
          companyName: registrationData.companyName,
          businessAddress: registrationData.businessAddress,
          mcNumber: registrationData.mcNumber,
          dotNumber: registrationData.dotNumber,
          businessPhone: registrationData.businessPhone,
          businessEmail: registrationData.businessEmail,
          ownerName: `${registrationData.ownerFirstName} ${registrationData.ownerLastName}`,
          businessType: 'freight_brokerage',
          incorporationDate: registrationData.incorporationDate,
          taxId: registrationData.taxId,
          territories: registrationData.territories,
          specializations: registrationData.specializations,
        },

        childAgents: [], // Will be populated as agents are added

        systemAccess: {
          level: 'Freight Brokerage Operations',
          accessCode: userIdentifiers.accessCode,
          securityLevel: 'Level 4 - Brokerage Owner',
          allowedSystems: [
            'Brokerage Portal',
            'Agent Management',
            'Financial Dashboard',
            'Load Management',
            'Customer Portal',
            'Compliance Center',
          ],
        },

        permissions: this.getDefaultBusinessPermissions(),
        notes: `Freight brokerage company: ${registrationData.companyName}\nOwner: ${registrationData.ownerFirstName} ${registrationData.ownerLastName}\nRegistered: ${new Date().toLocaleDateString()}`,
      };

      // In production, this would save to database
      console.info('Creating business entity:', businessUser);

      return {
        success: true,
        userId: userIdentifiers.userId,
        message: 'Freight brokerage company registered successfully',
      };
    } catch (error) {
      console.error('Business entity creation error:', error);
      return { success: false, message: 'Failed to create business entity' };
    }
  }

  /**
   * Create an individual user (BB agent) linked to a business entity
   */
  static async createAgentUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    parentCompanyId: string;
    territories: string[];
    specializations: string[];
    password: string;
  }): Promise<{
    success: boolean;
    userId?: string;
    message: string;
  }> {
    try {
      // Generate user identification data
      const identificationData: UserIdentificationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'Broker Agent',
        department: 'Broker Agent',
        hiredDate: new Date().toISOString().split('T')[0],
        phoneNumber: userData.phone,
        parentBrokerageId: userData.parentCompanyId,
      };

      const userIdentifiers =
        UserIdentificationService.generateUserIdentifiers(identificationData);

      // Create enhanced user data for individual agent
      const agentUser: EnhancedUserData = {
        id: userIdentifiers.userId,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone,
        department: 'Broker Agent',
        departmentCode: 'BB',
        position: userData.position,
        hiredDate: new Date().toISOString().split('T')[0],
        role: 'Broker Agent',
        status: 'active',
        lastActive: new Date().toISOString(),
        userType: 'individual',

        parentCompanyId: userData.parentCompanyId,

        personalInfo: {
          emergencyContact: {
            name: 'To be provided',
            relation: 'Unknown',
            phone: 'Not provided',
          },
        },

        systemAccess: {
          level: 'Broker Agent Operations',
          accessCode: userIdentifiers.accessCode,
          securityLevel: 'Level 3 - Broker Agent',
          allowedSystems: [
            'Agent Portal',
            'Load Management',
            'Customer Communication',
            'Performance Dashboard',
          ],
        },

        permissions: this.getDefaultAgentPermissions(),
        notes: `Broker agent under ${userData.parentCompanyId}\nSpecializations: ${userData.specializations.join(', ')}\nTerritories: ${userData.territories.join(', ')}`,
      };

      // In production, this would save to database and update parent company
      console.info('Creating agent user:', agentUser);

      return {
        success: true,
        userId: userIdentifiers.userId,
        message: 'Broker agent registered successfully',
      };
    } catch (error) {
      console.error('Agent user creation error:', error);
      return { success: false, message: 'Failed to create agent user' };
    }
  }

  /**
   * Get enhanced user data by ID
   */
  static getEnhancedUserById(userId: string): EnhancedUserData | null {
    // In production, this would query the database
    // For now, return mock data based on the existing mockUsers structure
    return null;
  }

  /**
   * Get all business entities (FBB companies)
   */
  static getBusinessEntities(): EnhancedUserData[] {
    // In production, this would query users where userType = 'business_entity'
    return [];
  }

  /**
   * Get agents for a business entity
   */
  static getAgentsForBusiness(businessId: string): EnhancedUserData[] {
    // In production, this would query users where parentCompanyId = businessId
    return [];
  }

  /**
   * Convert existing mockUser to enhanced format
   */
  static convertMockUserToEnhanced(mockUser: any): EnhancedUserData {
    return {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      department: mockUser.department,
      departmentCode: mockUser.departmentCode,
      position: mockUser.position,
      hiredDate: mockUser.hiredDate,
      role: mockUser.role,
      status: mockUser.status,
      lastActive: mockUser.lastActive,
      userType:
        mockUser.departmentCode === 'FBB' ? 'business_entity' : 'individual',

      // For business entities, extract business info if available
      businessInfo:
        mockUser.departmentCode === 'FBB'
          ? {
              companyName: mockUser.name + ' Brokerage',
              businessAddress: 'Business address not provided',
              businessPhone: mockUser.phone,
              businessEmail: mockUser.email,
              ownerName: mockUser.name,
              businessType: 'freight_brokerage',
              territories: ['Regional'],
              specializations: ['General Freight'],
            }
          : undefined,

      // For individuals, use existing emergency contact
      personalInfo: mockUser.emergencyContact
        ? {
            emergencyContact: mockUser.emergencyContact,
          }
        : undefined,

      systemAccess: mockUser.systemAccess,
      permissions: mockUser.permissions,
      notes: mockUser.notes,
      workflow: mockUser.contractorWorkflow || mockUser.carrierWorkflow,
      aiFlowStatus: mockUser.aiFlowStatus,
    };
  }

  /**
   * Get default permissions for business entities (FBB)
   */
  private static getDefaultBusinessPermissions(): Record<string, boolean> {
    return {
      // Full business management permissions
      'user-management': true,
      'agent-management': true,
      'financial-oversight': true,
      'load-management': true,
      'customer-management': true,
      'compliance-monitoring': true,
      'reporting-analytics': true,
      'system-configuration': true,
    };
  }

  /**
   * Get default permissions for agents (BB)
   */
  private static getDefaultAgentPermissions(): Record<string, boolean> {
    return {
      // Limited agent permissions
      'load-management': true,
      'customer-communication': true,
      'performance-tracking': true,
      'document-management': true,
      'task-management': true,

      // Restricted permissions
      'financial-oversight': false,
      'agent-management': false,
      'system-configuration': false,
    };
  }

  /**
   * Validate business registration data
   */
  static validateBusinessRegistration(data: BusinessRegistrationData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.companyName) errors.push('Company name is required');
    if (!data.businessAddress) errors.push('Business address is required');
    if (!data.ownerFirstName) errors.push('Owner first name is required');
    if (!data.ownerLastName) errors.push('Owner last name is required');
    if (!data.ownerEmail) errors.push('Owner email is required');
    if (!data.businessEmail) errors.push('Business email is required');
    if (!data.password) errors.push('Password is required');
    if (data.password !== data.confirmPassword)
      errors.push('Passwords do not match');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.ownerEmail && !emailRegex.test(data.ownerEmail)) {
      errors.push('Invalid owner email format');
    }
    if (data.businessEmail && !emailRegex.test(data.businessEmail)) {
      errors.push('Invalid business email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default EnhancedUserManagementService;
