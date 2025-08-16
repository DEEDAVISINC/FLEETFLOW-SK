/**
 * FleetFlow Brokerage Hierarchy Service
 * Manages parent-child relationships between Freight Brokerage Businesses (FBB) and Broker Agents (BB)
 * Handles user registration, authentication, and access control within the hierarchy
 */

import UserIdentificationService, {
  UserIdentificationData,
} from './UserIdentificationService';

export interface BrokerageCompany {
  id: string;
  userId: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  mcNumber?: string;
  dotNumber?: string;
  isActive: boolean;
  registrationDate: string;
  agents: BrokerAgent[];
  performanceMetrics: BrokeragePerformanceMetrics;
}

export interface BrokerAgent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  parentBrokerageId: string;
  isActive: boolean;
  hiredDate: string;
  position: string;
  permissions: AgentPermissions;
  performanceMetrics: AgentPerformanceMetrics;
  lastLoginDate?: string;
  profilePicture?: string;
}

export interface AgentPermissions {
  canCreateLoads: boolean;
  canModifyRates: boolean;
  canAccessFinancials: boolean;
  canViewAllCompanyLoads: boolean;
  canManageCarriers: boolean;
  canGenerateReports: boolean;
  maxContractValue: number;
  requiresApprovalOver: number;
  territories: string[];
  loadTypes: string[];
}

export interface BrokeragePerformanceMetrics {
  totalRevenue: number;
  totalLoads: number;
  averageMargin: number;
  activeAgents: number;
  customerSatisfactionScore: number;
  totalAgentPerformanceScore: number;
}

export interface AgentPerformanceMetrics {
  loadsHandled: number;
  revenue: number;
  margin: number;
  customerRating: number;
  onTimeDeliveryRate: number;
  responseTime: number; // hours
  lastMonthPerformance: {
    loads: number;
    revenue: number;
    margin: number;
  };
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'Freight Brokerage' | 'Broker Agent';
  parentBrokerageId?: string; // Required for BB agents
  companyName?: string; // Required for FBB
  address?: string; // Required for FBB
  mcNumber?: string;
  dotNumber?: string;
  position?: string; // For BB agents
  territories?: string[];
  specializations?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserSession {
  userId: string;
  email: string;
  role: 'FBB' | 'BB';
  firstName: string;
  lastName: string;
  parentBrokerageId?: string;
  permissions: AgentPermissions | 'FULL_ACCESS';
  sessionId: string;
  loginTime: string;
  lastActivity: string;
}

export class BrokerageHierarchyService {
  // Mock data for demonstration - in production, this would be in a database
  private static brokerageCompanies: BrokerageCompany[] = [
    {
      id: 'MW-FBB-2024046',
      userId: 'MW-FBB-2024046',
      companyName: 'Wilson Freight Brokerage',
      ownerName: 'Mike Wilson',
      email: 'mike@wilsonfreight.com',
      phone: '+1-555-0123',
      address: '1234 Business Ave, Chicago, IL 60601',
      mcNumber: 'MC-123456',
      dotNumber: 'DOT-789012',
      isActive: true,
      registrationDate: '2024-02-15',
      agents: [],
      performanceMetrics: {
        totalRevenue: 2450000,
        totalLoads: 1250,
        averageMargin: 15.5,
        activeAgents: 3,
        customerSatisfactionScore: 4.6,
        totalAgentPerformanceScore: 4.4,
      },
    },
  ];

  private static brokerAgents: BrokerAgent[] = [
    {
      id: 'ED-BB-2024061',
      userId: 'ED-BB-2024061',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily@wilsonfreight.com',
      phone: '+1-555-0124',
      parentBrokerageId: 'MW-FBB-2024046',
      isActive: true,
      hiredDate: '2024-03-01',
      position: 'Senior Broker Agent',
      permissions: {
        canCreateLoads: true,
        canModifyRates: true,
        canAccessFinancials: false, // Limited financial access
        canViewAllCompanyLoads: false, // Only their assigned loads
        canManageCarriers: true,
        canGenerateReports: true,
        maxContractValue: 50000,
        requiresApprovalOver: 25000,
        territories: ['West Coast', 'Southwest'],
        loadTypes: ['Dry Van', 'Refrigerated', 'Flatbed'],
      },
      performanceMetrics: {
        loadsHandled: 52,
        revenue: 185000,
        margin: 16.2,
        customerRating: 4.8,
        onTimeDeliveryRate: 98.5,
        responseTime: 0.5,
        lastMonthPerformance: {
          loads: 12,
          revenue: 45000,
          margin: 17.1,
        },
      },
    },
  ];

  private static userSessions: UserSession[] = [];

  /**
   * Register a new brokerage company (FBB)
   */
  static async registerBrokerage(userData: UserRegistrationData): Promise<{
    success: boolean;
    userId?: string;
    message: string;
  }> {
    try {
      if (userData.role !== 'Freight Brokerage') {
        return {
          success: false,
          message: 'Invalid role for brokerage registration',
        };
      }

      // Check if email already exists
      const existingBrokerage = this.brokerageCompanies.find(
        (b) => b.email === userData.email
      );
      if (existingBrokerage) {
        return { success: false, message: 'Email already registered' };
      }

      // Generate user identifiers
      const identificationData: UserIdentificationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'Freight Brokerage',
        department: 'Freight Brokerage',
        hiredDate: new Date().toISOString().split('T')[0],
      };

      const userIdentifiers =
        UserIdentificationService.generateUserIdentifiers(identificationData);

      // Create brokerage company
      const newBrokerage: BrokerageCompany = {
        id: userIdentifiers.userId,
        userId: userIdentifiers.userId,
        companyName:
          userData.companyName ||
          `${userData.firstName} ${userData.lastName} Brokerage`,
        ownerName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
        mcNumber: userData.mcNumber,
        dotNumber: userData.dotNumber,
        isActive: true,
        registrationDate: new Date().toISOString().split('T')[0],
        agents: [],
        performanceMetrics: {
          totalRevenue: 0,
          totalLoads: 0,
          averageMargin: 0,
          activeAgents: 0,
          customerSatisfactionScore: 0,
          totalAgentPerformanceScore: 0,
        },
      };

      this.brokerageCompanies.push(newBrokerage);

      return {
        success: true,
        userId: userIdentifiers.userId,
        message: 'Brokerage registered successfully',
      };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  }

  /**
   * Register a new broker agent (BB) under a brokerage
   */
  static async registerAgent(userData: UserRegistrationData): Promise<{
    success: boolean;
    userId?: string;
    message: string;
  }> {
    try {
      if (userData.role !== 'Broker Agent') {
        return {
          success: false,
          message: 'Invalid role for agent registration',
        };
      }

      if (!userData.parentBrokerageId) {
        return {
          success: false,
          message: 'Parent brokerage ID required for agent registration',
        };
      }

      // Verify parent brokerage exists
      const parentBrokerage = this.brokerageCompanies.find(
        (b) => b.id === userData.parentBrokerageId
      );
      if (!parentBrokerage) {
        return { success: false, message: 'Parent brokerage not found' };
      }

      // Check if email already exists
      const existingAgent = this.brokerAgents.find(
        (a) => a.email === userData.email
      );
      if (existingAgent) {
        return { success: false, message: 'Email already registered' };
      }

      // Generate user identifiers
      const identificationData: UserIdentificationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'Broker Agent',
        department: 'Broker Agent',
        hiredDate: new Date().toISOString().split('T')[0],
        parentBrokerageId: userData.parentBrokerageId,
      };

      const userIdentifiers =
        UserIdentificationService.generateUserIdentifiers(identificationData);

      // Create default agent permissions
      const defaultPermissions: AgentPermissions = {
        canCreateLoads: true,
        canModifyRates: false, // Requires approval initially
        canAccessFinancials: false,
        canViewAllCompanyLoads: false,
        canManageCarriers: true,
        canGenerateReports: false,
        maxContractValue: 25000,
        requiresApprovalOver: 10000,
        territories: userData.territories || ['Local'],
        loadTypes: ['Dry Van'],
      };

      // Create broker agent
      const newAgent: BrokerAgent = {
        id: userIdentifiers.userId,
        userId: userIdentifiers.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        parentBrokerageId: userData.parentBrokerageId,
        isActive: true,
        hiredDate: new Date().toISOString().split('T')[0],
        position: userData.position || 'Broker Agent',
        permissions: defaultPermissions,
        performanceMetrics: {
          loadsHandled: 0,
          revenue: 0,
          margin: 0,
          customerRating: 0,
          onTimeDeliveryRate: 0,
          responseTime: 0,
          lastMonthPerformance: {
            loads: 0,
            revenue: 0,
            margin: 0,
          },
        },
      };

      this.brokerAgents.push(newAgent);

      // Update parent brokerage active agents count
      parentBrokerage.performanceMetrics.activeAgents++;

      return {
        success: true,
        userId: userIdentifiers.userId,
        message: 'Agent registered successfully',
      };
    } catch (error) {
      return { success: false, message: 'Agent registration failed' };
    }
  }

  /**
   * Authenticate user login
   */
  static async authenticateUser(credentials: LoginCredentials): Promise<{
    success: boolean;
    session?: UserSession;
    message: string;
  }> {
    // Check brokerage companies first
    const brokerage = this.brokerageCompanies.find(
      (b) => b.email === credentials.email
    );
    if (brokerage) {
      // In production, verify password hash
      const session: UserSession = {
        userId: brokerage.userId,
        email: brokerage.email,
        role: 'FBB',
        firstName: brokerage.ownerName.split(' ')[0],
        lastName: brokerage.ownerName.split(' ')[1] || '',
        permissions: 'FULL_ACCESS',
        sessionId: `session-${Date.now()}`,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      this.userSessions.push(session);
      return { success: true, session, message: 'Login successful' };
    }

    // Check broker agents
    const agent = this.brokerAgents.find((a) => a.email === credentials.email);
    if (agent) {
      // In production, verify password hash
      const session: UserSession = {
        userId: agent.userId,
        email: agent.email,
        role: 'BB',
        firstName: agent.firstName,
        lastName: agent.lastName,
        parentBrokerageId: agent.parentBrokerageId,
        permissions: agent.permissions,
        sessionId: `session-${Date.now()}`,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      this.userSessions.push(session);
      return { success: true, session, message: 'Login successful' };
    }

    return { success: false, message: 'Invalid credentials' };
  }

  /**
   * Get brokerage by ID
   */
  static getBrokerageById(id: string): BrokerageCompany | null {
    return this.brokerageCompanies.find((b) => b.id === id) || null;
  }

  /**
   * Get agent by ID
   */
  static getAgentById(id: string): BrokerAgent | null {
    return this.brokerAgents.find((a) => a.id === id) || null;
  }

  /**
   * Get all agents for a brokerage
   */
  static getAgentsByBrokerageId(brokerageId: string): BrokerAgent[] {
    return this.brokerAgents.filter(
      (agent) => agent.parentBrokerageId === brokerageId
    );
  }

  /**
   * Update agent permissions (FBB only)
   */
  static updateAgentPermissions(
    agentId: string,
    permissions: Partial<AgentPermissions>,
    updatedBy: string
  ): boolean {
    // Verify updater is FBB and has authority over this agent
    const agent = this.getAgentById(agentId);
    if (!agent) return false;

    const updater = this.getBrokerageById(updatedBy);
    if (!updater || agent.parentBrokerageId !== updatedBy) return false;

    // Update permissions
    agent.permissions = { ...agent.permissions, ...permissions };
    return true;
  }

  /**
   * Deactivate/activate agent
   */
  static toggleAgentStatus(agentId: string, brokerageId: string): boolean {
    const agent = this.getAgentById(agentId);
    if (!agent || agent.parentBrokerageId !== brokerageId) return false;

    agent.isActive = !agent.isActive;

    // Update parent brokerage active agents count
    const brokerage = this.getBrokerageById(brokerageId);
    if (brokerage) {
      const activeCount = this.getAgentsByBrokerageId(brokerageId).filter(
        (a) => a.isActive
      ).length;
      brokerage.performanceMetrics.activeAgents = activeCount;
    }

    return true;
  }

  /**
   * Get user session by session ID
   */
  static getSession(sessionId: string): UserSession | null {
    return this.userSessions.find((s) => s.sessionId === sessionId) || null;
  }

  /**
   * Update last activity for session
   */
  static updateSessionActivity(sessionId: string): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.lastActivity = new Date().toISOString();
    }
  }

  /**
   * Logout user
   */
  static logout(sessionId: string): boolean {
    const index = this.userSessions.findIndex((s) => s.sessionId === sessionId);
    if (index !== -1) {
      this.userSessions.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get consolidated brokerage dashboard data
   */
  static getBrokerageDashboardData(brokerageId: string) {
    const brokerage = this.getBrokerageById(brokerageId);
    if (!brokerage) return null;

    const agents = this.getAgentsByBrokerageId(brokerageId);
    const activeAgents = agents.filter((a) => a.isActive);

    return {
      brokerage,
      agents: activeAgents,
      summary: {
        totalAgents: agents.length,
        activeAgents: activeAgents.length,
        totalLoads: agents.reduce(
          (sum, agent) => sum + agent.performanceMetrics.loadsHandled,
          0
        ),
        totalRevenue: agents.reduce(
          (sum, agent) => sum + agent.performanceMetrics.revenue,
          0
        ),
        averageMargin:
          activeAgents.length > 0
            ? agents.reduce(
                (sum, agent) => sum + agent.performanceMetrics.margin,
                0
              ) / activeAgents.length
            : 0,
        topPerformer: agents.reduce(
          (top, agent) =>
            agent.performanceMetrics.revenue >
            (top?.performanceMetrics.revenue || 0)
              ? agent
              : top,
          null as BrokerAgent | null
        ),
      },
    };
  }

  /**
   * Get agent dashboard data
   */
  static getAgentDashboardData(agentId: string) {
    const agent = this.getAgentById(agentId);
    if (!agent) return null;

    const parentBrokerage = this.getBrokerageById(agent.parentBrokerageId);

    return {
      agent,
      parentBrokerage,
      goals: {
        monthlyLoadTarget: 15,
        monthlyRevenueTarget: 50000,
        currentMonthLoads: agent.performanceMetrics.lastMonthPerformance.loads,
        currentMonthRevenue:
          agent.performanceMetrics.lastMonthPerformance.revenue,
        progressPercentage: Math.round(
          (agent.performanceMetrics.lastMonthPerformance.loads / 15) * 100
        ),
      },
      recentActivity: [
        {
          date: '2024-01-15',
          action: 'Load Created',
          details: 'ATL-MIA-WMT-12345',
        },
        {
          date: '2024-01-14',
          action: 'Rate Negotiated',
          details: '$2,350 → $2,500',
        },
        {
          date: '2024-01-13',
          action: 'Carrier Assigned',
          details: 'ABC Trucking Co.',
        },
      ],
    };
  }
}

export default BrokerageHierarchyService;
