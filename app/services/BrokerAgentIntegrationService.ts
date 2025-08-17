'use client';

import { getCurrentUser } from '../config/access';
import { createLoad } from './loadService';
// Temporarily commenting out to resolve crypto import issue
// import { FleetFlowSystemOrchestrator } from './system-orchestrator';

export interface BrokerAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  brokerageId: string;
  brokerageName: string;
  managerName: string;
  permissions: {
    canCreateLoads: boolean;
    canModifyRates: boolean;
    canManageCarriers: boolean;
    maxContractValue: number;
    requiresApprovalOver: number;
  };
  performance: {
    totalQuotes: number;
    quotesAccepted: number;
    totalLoads: number;
    activeLoads: number;
    monthlyRevenue: number;
    avgMargin: number;
    successRate: number;
    customerCount: number;
  };
  createdAt: string;
  lastActive: string;
}

export interface AgentQuote {
  id: string;
  agentId: string;
  agentName: string;
  type: 'LTL' | 'FTL' | 'Specialized' | 'Warehousing' | 'Multi-Service';
  quoteNumber: string;
  timestamp: number;
  baseRate: number;
  fuelSurcharge?: number;
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  data: any;
  customer?: {
    company: string;
    contact: string;
    email: string;
  };
}

export interface AgentLoad {
  id: string;
  agentId: string;
  agentName: string;
  brokerageId: string;
  loadNumber: string;
  origin: string;
  destination: string;
  rate: number;
  margin: number;
  marginPercent: number;
  equipment: string;
  weight: string;
  pickupDate: string;
  deliveryDate: string;
  status: string;
  shipperName: string;
  createdAt: string;
  managementNotes?: string;
}

export interface BrokerageConsolidatedMetrics {
  totalAgents: number;
  activeAgents: number;
  totalQuotes: number;
  quotesAccepted: number;
  conversionRate: number;
  totalLoads: number;
  activeLoads: number;
  totalRevenue: number;
  avgMargin: number;
  totalCustomers: number;
  topAgents: Array<{
    name: string;
    revenue: number;
    loadCount: number;
    successRate: number;
  }>;
  agentPerformanceComparison: Array<{
    agentName: string;
    revenue: number;
    loads: number;
    margin: number;
    successRate: number;
  }>;
}

class BrokerAgentIntegrationService {
  // Temporarily commenting out to resolve crypto import issue
  // private systemOrchestrator: FleetFlowSystemOrchestrator;

  constructor() {
    // this.systemOrchestrator = new FleetFlowSystemOrchestrator();
  }

  // ===============================
  // AGENT MANAGEMENT
  // ===============================

  /**
   * Get current agent profile with brokerage context
   */
  getCurrentAgent(): BrokerAgent | null {
    const currentUser = getCurrentUser();
    if (!currentUser?.user) return null;

    // Mock agent data - in production, fetch from database
    const mockAgent: BrokerAgent = {
      id: currentUser.user.id,
      name: currentUser.user.name,
      email: `${currentUser.user.name.toLowerCase().replace(' ', '.')}@fleetflow.com`,
      phone: '+1 (555) 123-4567',
      department: 'Broker Agent',
      brokerageId: 'brokerage-001',
      brokerageName: 'FleetFlow Brokerage',
      managerName: 'Sarah Johnson',
      permissions: {
        canCreateLoads: true,
        canModifyRates: true,
        canManageCarriers: false,
        maxContractValue: 50000,
        requiresApprovalOver: 25000,
      },
      performance: {
        totalQuotes: 127,
        quotesAccepted: 73,
        totalLoads: 45,
        activeLoads: 8,
        monthlyRevenue: 45230,
        avgMargin: 18.5,
        successRate: 73.2,
        customerCount: 23,
      },
      createdAt: '2024-01-15T09:00:00Z',
      lastActive: new Date().toISOString(),
    };

    return mockAgent;
  }

  /**
   * Get all agents under the current brokerage
   */
  getAllBrokerageAgents(): BrokerAgent[] {
    const currentUser = getCurrentUser();
    if (!currentUser?.user) return [];

    // Mock multiple agents for the brokerage
    return [
      {
        id: 'agent-001',
        name: 'Emily Davis',
        email: 'emily.davis@fleetflow.com',
        phone: '+1 (555) 123-4567',
        department: 'Broker Agent',
        brokerageId: 'brokerage-001',
        brokerageName: 'FleetFlow Brokerage',
        managerName: 'Sarah Johnson',
        permissions: {
          canCreateLoads: true,
          canModifyRates: true,
          canManageCarriers: false,
          maxContractValue: 50000,
          requiresApprovalOver: 25000,
        },
        performance: {
          totalQuotes: 127,
          quotesAccepted: 73,
          totalLoads: 45,
          activeLoads: 8,
          monthlyRevenue: 45230,
          avgMargin: 18.5,
          successRate: 73.2,
          customerCount: 23,
        },
        createdAt: '2024-01-15T09:00:00Z',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'agent-002',
        name: 'Michael Chen',
        email: 'michael.chen@fleetflow.com',
        phone: '+1 (555) 234-5678',
        department: 'Broker Agent',
        brokerageId: 'brokerage-001',
        brokerageName: 'FleetFlow Brokerage',
        managerName: 'Sarah Johnson',
        permissions: {
          canCreateLoads: true,
          canModifyRates: true,
          canManageCarriers: false,
          maxContractValue: 75000,
          requiresApprovalOver: 35000,
        },
        performance: {
          totalQuotes: 156,
          quotesAccepted: 89,
          totalLoads: 67,
          activeLoads: 12,
          monthlyRevenue: 62750,
          avgMargin: 21.3,
          successRate: 78.4,
          customerCount: 31,
        },
        createdAt: '2024-01-10T08:30:00Z',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'agent-003',
        name: 'Jessica Rodriguez',
        email: 'jessica.rodriguez@fleetflow.com',
        phone: '+1 (555) 345-6789',
        department: 'Broker Agent',
        brokerageId: 'brokerage-001',
        brokerageName: 'FleetFlow Brokerage',
        managerName: 'Sarah Johnson',
        permissions: {
          canCreateLoads: true,
          canModifyRates: false,
          canManageCarriers: false,
          maxContractValue: 35000,
          requiresApprovalOver: 15000,
        },
        performance: {
          totalQuotes: 98,
          quotesAccepted: 54,
          totalLoads: 38,
          activeLoads: 6,
          monthlyRevenue: 38900,
          avgMargin: 16.8,
          successRate: 69.1,
          customerCount: 19,
        },
        createdAt: '2024-02-01T10:15:00Z',
        lastActive: new Date().toISOString(),
      },
    ];
  }

  // ===============================
  // QUOTE INTEGRATION
  // ===============================

  /**
   * Submit quote from agent portal to brokerage system
   */
  async submitAgentQuote(
    quoteData: any
  ): Promise<{ success: boolean; quoteId: string; message: string }> {
    try {
      const currentAgent = this.getCurrentAgent();
      if (!currentAgent) {
        throw new Error('Agent not authenticated');
      }

      const quote: AgentQuote = {
        id: `QUOTE-${Date.now()}`,
        agentId: currentAgent.id,
        agentName: currentAgent.name,
        type: quoteData.type,
        quoteNumber: quoteData.quoteNumber,
        timestamp: Date.now(),
        baseRate: quoteData.baseRate,
        fuelSurcharge: quoteData.fuelSurcharge,
        total: quoteData.total,
        status: 'pending',
        data: quoteData.data,
        customer: quoteData.customer,
      };

      // Store quote in system (in production, save to database)
      console.log('💰 Agent Quote Submitted:', quote);

      // Integrate with brokerage analytics
      await this.updateBrokerageMetrics('quote_submitted', quote);

      return {
        success: true,
        quoteId: quote.id,
        message:
          'Quote submitted successfully and forwarded to brokerage management',
      };
    } catch (error: any) {
      console.error('Error submitting agent quote:', error);
      return {
        success: false,
        quoteId: '',
        message: error.message || 'Failed to submit quote',
      };
    }
  }

  // ===============================
  // LOAD INTEGRATION
  // ===============================

  /**
   * Create load from agent portal and integrate with system orchestrator
   */
  async createAgentLoad(
    loadData: any
  ): Promise<{ success: boolean; loadId: string; message: string }> {
    try {
      const currentAgent = this.getCurrentAgent();
      if (!currentAgent) {
        throw new Error('Agent not authenticated');
      }

      // Enhance load data with agent information
      const enhancedLoadData = {
        ...loadData,
        brokerId: currentAgent.id,
        brokerName: currentAgent.name,
        agentId: currentAgent.id,
        agentName: currentAgent.name,
        brokerageId: currentAgent.brokerageId,
        brokerageName: currentAgent.brokerageName,
        managerName: currentAgent.managerName,
        createdByAgent: true,
        requiresApproval:
          loadData.rate > currentAgent.permissions.requiresApprovalOver,
      };

      // Create load through standard service
      const load = await createLoad(enhancedLoadData);

      // Temporarily commenting out system orchestrator call
      // Process through system orchestrator for distribution
      // const workflow = await this.systemOrchestrator.processLoad(load);
      const workflow = { id: 'temp-workflow', status: 'created' }; // Temporary mock

      // Create agent load record for tracking
      const agentLoad: AgentLoad = {
        id: load.id,
        agentId: currentAgent.id,
        agentName: currentAgent.name,
        brokerageId: currentAgent.brokerageId,
        loadNumber:
          load.loadBoardNumber || `LB-${Date.now().toString().slice(-6)}`,
        origin: load.origin,
        destination: load.destination,
        rate: load.rate,
        margin: load.rate * 0.225, // 22.5% margin
        marginPercent: 22.5,
        equipment: load.equipment,
        weight: load.weight,
        pickupDate: load.pickupDate,
        deliveryDate: load.deliveryDate,
        status: load.status,
        shipperName: load.shipperName || 'Unknown Shipper',
        createdAt: new Date().toISOString(),
        managementNotes: enhancedLoadData.requiresApproval
          ? 'Requires management approval due to high value'
          : undefined,
      };

      console.log('🚛 Agent Load Created:', agentLoad);
      console.log('🔄 Workflow Initiated:', workflow);

      // Update brokerage metrics
      await this.updateBrokerageMetrics('load_created', agentLoad);

      return {
        success: true,
        loadId: load.id,
        message: `Load ${agentLoad.loadNumber} created successfully and added to brokerage load board. ${enhancedLoadData.requiresApproval ? 'Pending management approval.' : 'Available for dispatch.'}`,
      };
    } catch (error: any) {
      console.error('Error creating agent load:', error);
      return {
        success: false,
        loadId: '',
        message: error.message || 'Failed to create load',
      };
    }
  }

  // ===============================
  // ANALYTICS AGGREGATION
  // ===============================

  /**
   * Get consolidated metrics for all agents under brokerage
   */
  getBrokerageConsolidatedMetrics(): BrokerageConsolidatedMetrics {
    const agents = this.getAllBrokerageAgents();

    // Aggregate all agent performance
    const totalQuotes = agents.reduce(
      (sum, agent) => sum + agent.performance.totalQuotes,
      0
    );
    const quotesAccepted = agents.reduce(
      (sum, agent) => sum + agent.performance.quotesAccepted,
      0
    );
    const totalLoads = agents.reduce(
      (sum, agent) => sum + agent.performance.totalLoads,
      0
    );
    const activeLoads = agents.reduce(
      (sum, agent) => sum + agent.performance.activeLoads,
      0
    );
    const totalRevenue = agents.reduce(
      (sum, agent) => sum + agent.performance.monthlyRevenue,
      0
    );
    const totalCustomers = agents.reduce(
      (sum, agent) => sum + agent.performance.customerCount,
      0
    );

    const conversionRate =
      totalQuotes > 0 ? (quotesAccepted / totalQuotes) * 100 : 0;
    const avgMargin =
      agents.length > 0
        ? agents.reduce((sum, agent) => sum + agent.performance.avgMargin, 0) /
          agents.length
        : 0;

    // Top performing agents
    const topAgents = agents
      .sort(
        (a, b) => b.performance.monthlyRevenue - a.performance.monthlyRevenue
      )
      .slice(0, 5)
      .map((agent) => ({
        name: agent.name,
        revenue: agent.performance.monthlyRevenue,
        loadCount: agent.performance.totalLoads,
        successRate: agent.performance.successRate,
      }));

    // Agent performance comparison
    const agentPerformanceComparison = agents.map((agent) => ({
      agentName: agent.name,
      revenue: agent.performance.monthlyRevenue,
      loads: agent.performance.totalLoads,
      margin: agent.performance.avgMargin,
      successRate: agent.performance.successRate,
    }));

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter((agent) => {
        const lastActive = new Date(agent.lastActive);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastActive > oneDayAgo;
      }).length,
      totalQuotes,
      quotesAccepted,
      conversionRate: Math.round(conversionRate * 10) / 10,
      totalLoads,
      activeLoads,
      totalRevenue,
      avgMargin: Math.round(avgMargin * 10) / 10,
      totalCustomers,
      topAgents,
      agentPerformanceComparison,
    };
  }

  /**
   * Update brokerage-level metrics when agent actions occur
   */
  private async updateBrokerageMetrics(
    action: 'quote_submitted' | 'quote_accepted' | 'load_created',
    data: any
  ): Promise<void> {
    try {
      // In production, this would update database records
      console.log(`📊 Brokerage Metrics Updated - Action: ${action}`, data);

      // Trigger real-time updates to brokerage dashboard
      // This could use WebSocket or other real-time communication

      // Update system orchestrator if needed
      if (action === 'load_created') {
        // Additional load processing could happen here
      }
    } catch (error) {
      console.error('Error updating brokerage metrics:', error);
    }
  }

  // ===============================
  // LOAD BOARD INTEGRATION
  // ===============================

  /**
   * Get all loads created by agents for brokerage load board
   */
  getAllAgentLoads(): AgentLoad[] {
    const agents = this.getAllBrokerageAgents();

    // Mock agent loads - in production, fetch from database
    const mockLoads: AgentLoad[] = [
      {
        id: 'FL-2025-007',
        agentId: 'agent-001',
        agentName: 'Emily Davis',
        brokerageId: 'brokerage-001',
        loadNumber: 'LB-100007',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        rate: 2450,
        margin: 551.25,
        marginPercent: 22.5,
        equipment: 'Dry Van',
        weight: '24,000 lbs',
        pickupDate: '2025-01-20',
        deliveryDate: '2025-01-21',
        status: 'Available',
        shipperName: 'Atlanta Distribution Co.',
        createdAt: '2025-01-19T14:30:00Z',
      },
      {
        id: 'FL-2025-008',
        agentId: 'agent-002',
        agentName: 'Michael Chen',
        brokerageId: 'brokerage-001',
        loadNumber: 'LB-100008',
        origin: 'Jacksonville, FL',
        destination: 'Tampa, FL',
        rate: 1850,
        margin: 415.875,
        marginPercent: 22.5,
        equipment: 'Reefer',
        weight: '18,500 lbs',
        pickupDate: '2025-01-21',
        deliveryDate: '2025-01-22',
        status: 'Assigned',
        shipperName: 'Fresh Foods Corp',
        createdAt: '2025-01-19T16:15:00Z',
      },
      {
        id: 'FL-2025-009',
        agentId: 'agent-003',
        agentName: 'Jessica Rodriguez',
        brokerageId: 'brokerage-001',
        loadNumber: 'LB-100009',
        origin: 'Orlando, FL',
        destination: 'Savannah, GA',
        rate: 2100,
        margin: 472.5,
        marginPercent: 22.5,
        equipment: 'Flatbed',
        weight: '32,000 lbs',
        pickupDate: '2025-01-22',
        deliveryDate: '2025-01-23',
        status: 'Available',
        shipperName: 'Construction Materials Inc.',
        createdAt: '2025-01-19T11:45:00Z',
        managementNotes: 'Heavy machinery load - verify carrier equipment',
      },
    ];

    return mockLoads;
  }

  /**
   * Get loads ready for dispatch (flows to Dispatch Central)
   */
  getLoadsForDispatch(): AgentLoad[] {
    return this.getAllAgentLoads().filter((load) =>
      ['Available', 'Assigned', 'Ready for Pickup'].includes(load.status)
    );
  }
}

export const brokerAgentIntegrationService =
  new BrokerAgentIntegrationService();
