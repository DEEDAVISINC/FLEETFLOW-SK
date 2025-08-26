'use client';

import { getCurrentUser } from '../config/access';
import {
  BrokerageConsolidatedMetrics,
  brokerAgentIntegrationService,
} from './BrokerAgentIntegrationService';
import { getLoadsForTenant } from './loadService';

export interface BrokerPerformanceMetrics {
  totalLoads: number;
  activeLoads: number;
  completedLoads: number;
  totalRevenue: number;
  avgMargin: number;
  winRate: number;
  customerCount: number;
  avgLoadValue: number;
  monthlyGrowth: number;
  topCustomers: Array<{
    name: string;
    revenue: number;
    loadCount: number;
  }>;
}

export interface LoadBidding {
  loadId: string;
  bidAmount: number;
  margin: number;
  bidStatus: 'pending' | 'won' | 'lost' | 'expired';
  submittedAt: string;
  notes?: string;
}

export interface BrokerMarginTracking {
  loadId: string;
  customerRate: number;
  carrierRate: number;
  margin: number;
  marginPercent: number;
  targetMargin: number;
  status: 'on_target' | 'below_target' | 'above_target';
}

class BrokerAnalyticsService {
  // Get comprehensive broker performance metrics
  getBrokerPerformanceMetrics(): BrokerPerformanceMetrics {
    const currentUser = getCurrentUser();
    const tenantLoads = getLoadsForTenant();

    // Filter loads for current broker
    const brokerLoads = tenantLoads.filter(
      (load) =>
        load.brokerId === currentUser?.user?.id ||
        load.brokerName === currentUser?.user?.name
    );

    const completedLoads = brokerLoads.filter(
      (load) => load.status === 'Delivered'
    );
    const activeLoads = brokerLoads.filter((load) =>
      ['In Transit', 'Assigned', 'Loading'].includes(load.status)
    );

    // Calculate revenue and margins
    const totalRevenue = completedLoads.reduce(
      (sum, load) => sum + (load.rate || 0),
      0
    );
    const avgLoadValue =
      completedLoads.length > 0 ? totalRevenue / completedLoads.length : 0;

    // Mock margin calculation (20-25% broker upcharge)
    const avgMargin = 22.5; // Average 22.5% margin
    const monthlyGrowth = 15.3; // 15.3% month-over-month growth

    // Mock win rate calculation
    const totalBids = brokerLoads.length + 15; // Assume some lost bids
    const winRate = (brokerLoads.length / totalBids) * 100;

    // Mock top customers
    const topCustomers = [
      { name: 'Walmart Distribution', revenue: 125000, loadCount: 23 },
      { name: 'Amazon Logistics', revenue: 98000, loadCount: 18 },
      { name: 'Target Supply Chain', revenue: 87000, loadCount: 16 },
      { name: 'Home Depot Freight', revenue: 76000, loadCount: 14 },
      { name: 'Costco Wholesale', revenue: 65000, loadCount: 12 },
    ];

    return {
      totalLoads: brokerLoads.length,
      activeLoads: activeLoads.length,
      completedLoads: completedLoads.length,
      totalRevenue,
      avgMargin,
      winRate: Math.round(winRate * 10) / 10,
      customerCount: new Set(brokerLoads.map((load) => load.shipperName)).size,
      avgLoadValue: Math.round(avgLoadValue),
      monthlyGrowth,
      topCustomers,
    };
  }

  // Track margin performance for loads
  getMarginTracking(): BrokerMarginTracking[] {
    const tenantLoads = getLoadsForTenant();
    const currentUser = getCurrentUser();

    const brokerLoads = tenantLoads.filter(
      (load) =>
        load.brokerId === currentUser?.user?.id ||
        load.brokerName === currentUser?.user?.name
    );

    return brokerLoads.map((load) => {
      const customerRate = load.rate || 0;
      const carrierRate = Math.round(customerRate * 0.775); // 22.5% margin
      const margin = customerRate - carrierRate;
      const marginPercent = (margin / customerRate) * 100;
      const targetMargin = 22.5;

      let status: 'on_target' | 'below_target' | 'above_target';
      if (
        marginPercent >= targetMargin - 2 &&
        marginPercent <= targetMargin + 2
      ) {
        status = 'on_target';
      } else if (marginPercent < targetMargin - 2) {
        status = 'below_target';
      } else {
        status = 'above_target';
      }

      return {
        loadId: load.id,
        customerRate,
        carrierRate,
        margin,
        marginPercent: Math.round(marginPercent * 10) / 10,
        targetMargin,
        status,
      };
    });
  }

  // Get bidding history and active bids
  getBiddingHistory(): LoadBidding[] {
    const currentUser = getCurrentUser();

    // Mock bidding data - in production this would come from database
    return [
      {
        loadId: 'FL-2025-001',
        bidAmount: 2450,
        margin: 22.5,
        bidStatus: 'won',
        submittedAt: '2025-01-19T10:30:00Z',
        notes: 'Competitive rate, reliable customer',
      },
      {
        loadId: 'FL-2025-002',
        bidAmount: 3200,
        margin: 25.0,
        bidStatus: 'pending',
        submittedAt: '2025-01-19T14:15:00Z',
        notes: 'Premium rate for expedited delivery',
      },
      {
        loadId: 'FL-2025-003',
        bidAmount: 1850,
        margin: 20.0,
        bidStatus: 'lost',
        submittedAt: '2025-01-18T16:45:00Z',
        notes: 'Rate too low, carrier availability limited',
      },
      {
        loadId: 'FL-2025-004',
        bidAmount: 2750,
        margin: 23.5,
        bidStatus: 'expired',
        submittedAt: '2025-01-18T09:20:00Z',
        notes: 'Bid expired before customer response',
      },
    ];
  }

  // Market rate intelligence
  getMarketRateIntelligence(route: string, equipment: string) {
    // Mock market data - in production would integrate with DAT, Truckstop.com APIs
    const mockRates = {
      'Atlanta-Miami': { avg: 2400, high: 2800, low: 2100, trend: 'up' },
      'Chicago-Houston': { avg: 3100, high: 3500, low: 2800, trend: 'stable' },
      'Los Angeles-Phoenix': {
        avg: 1200,
        high: 1400,
        low: 1000,
        trend: 'down',
      },
      'Dallas-Denver': { avg: 2200, high: 2600, low: 1900, trend: 'up' },
    };

    const routeKey = route.replace(' → ', '-').replace(', ', '-');
    return (
      mockRates[routeKey as keyof typeof mockRates] || {
        avg: 2000,
        high: 2400,
        low: 1700,
        trend: 'stable' as const,
      }
    );
  }

  // Submit a bid for a load
  submitBid(
    loadId: string,
    bidAmount: number,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock bid submission
        const margin = ((bidAmount - bidAmount * 0.775) / bidAmount) * 100;

        if (margin < 15) {
          resolve({
            success: false,
            message: 'Bid rejected: Margin too low (minimum 15% required)',
          });
        } else {
          resolve({
            success: true,
            message: 'Bid submitted successfully! Customer will be notified.',
          });
        }
      }, 1000);
    });
  }

  // ===============================
  // AGENT AGGREGATION METHODS
  // ===============================

  /**
   * Get comprehensive brokerage metrics including all agent data
   */
  getBrokerageOverviewMetrics(): BrokerageConsolidatedMetrics & {
    managementInsights: {
      topPerformingAgent: string;
      lowestPerformingAgent: string;
      avgAgentRevenue: number;
      agentRetentionRate: number;
      loadDistributionEfficiency: number;
    };
  } {
    const consolidatedMetrics =
      brokerAgentIntegrationService.getBrokerageConsolidatedMetrics();
    const agents = brokerAgentIntegrationService.getAllBrokerageAgents();

    // Calculate management insights
    const sortedByRevenue = agents.sort(
      (a, b) => b.performance.monthlyRevenue - a.performance.monthlyRevenue
    );
    const topPerformingAgent = sortedByRevenue[0]?.name || 'N/A';
    const lowestPerformingAgent =
      sortedByRevenue[sortedByRevenue.length - 1]?.name || 'N/A';
    const avgAgentRevenue =
      agents.length > 0
        ? agents.reduce(
            (sum, agent) => sum + agent.performance.monthlyRevenue,
            0
          ) / agents.length
        : 0;

    // Mock retention and efficiency metrics
    const agentRetentionRate = 94.5; // 94.5% retention rate
    const loadDistributionEfficiency = 87.3; // 87.3% efficiency in load distribution

    return {
      ...consolidatedMetrics,
      managementInsights: {
        topPerformingAgent,
        lowestPerformingAgent,
        avgAgentRevenue: Math.round(avgAgentRevenue),
        agentRetentionRate,
        loadDistributionEfficiency,
      },
    };
  }

  /**
   * Get all loads created by agents (for brokerage load board)
   */
  getAllAgentLoads() {
    return brokerAgentIntegrationService.getAllAgentLoads();
  }

  /**
   * Get loads ready for dispatch (flows to Dispatch Central)
   */
  getLoadsForDispatch() {
    return brokerAgentIntegrationService.getLoadsForDispatch();
  }

  /**
   * Get multimodal transport recommendations for a specific load
   */
  getMultimodalRecommendations(loadId: string) {
    return brokerAgentIntegrationService.getMultimodalRecommendations(loadId);
  }

  /**
   * Update load transport mode
   */
  updateLoadTransportMode(loadId: string, newMode: string, newRate: number) {
    return brokerAgentIntegrationService.updateLoadTransportMode(loadId, newMode, newRate);
  }

  /**
   * Get cost savings opportunities across all loads
   */
  getCostSavingsOpportunities() {
    return brokerAgentIntegrationService.getCostSavingsOpportunities();
  }

  /**
   * Get real-time agent performance comparison
   */
  getAgentPerformanceRanking() {
    const agents = brokerAgentIntegrationService.getAllBrokerageAgents();

    return agents
      .map((agent) => ({
        rank: 0, // Will be calculated
        agentId: agent.id,
        agentName: agent.name,
        revenue: agent.performance.monthlyRevenue,
        loads: agent.performance.totalLoads,
        margin: agent.performance.avgMargin,
        successRate: agent.performance.successRate,
        efficiency:
          (agent.performance.successRate * agent.performance.avgMargin) / 100,
        customerCount: agent.performance.customerCount,
        lastActive: agent.lastActive,
      }))
      .sort((a, b) => b.efficiency - a.efficiency)
      .map((agent, index) => ({ ...agent, rank: index + 1 }));
  }

  /**
   * Get combined broker + agent performance metrics
   */
  getCombinedPerformanceMetrics(): BrokerPerformanceMetrics & {
    agentMetrics: BrokerageConsolidatedMetrics;
    loadSourceBreakdown: {
      brokerLoads: number;
      agentLoads: number;
      totalLoads: number;
      agentContributionPercent: number;
    };
  } {
    const standardMetrics = this.getBrokerPerformanceMetrics();
    const agentMetrics =
      brokerAgentIntegrationService.getBrokerageConsolidatedMetrics();
    const agentLoads = brokerAgentIntegrationService.getAllAgentLoads();

    // Calculate load source breakdown
    const brokerLoads = standardMetrics.totalLoads;
    const agentLoadCount = agentLoads.length;
    const totalCombinedLoads = brokerLoads + agentLoadCount;
    const agentContributionPercent =
      totalCombinedLoads > 0 ? (agentLoadCount / totalCombinedLoads) * 100 : 0;

    return {
      ...standardMetrics,
      // Update totals to include agent data
      totalLoads: totalCombinedLoads,
      totalRevenue: standardMetrics.totalRevenue + agentMetrics.totalRevenue,
      customerCount:
        standardMetrics.customerCount + agentMetrics.totalCustomers,
      agentMetrics,
      loadSourceBreakdown: {
        brokerLoads,
        agentLoads: agentLoadCount,
        totalLoads: totalCombinedLoads,
        agentContributionPercent:
          Math.round(agentContributionPercent * 10) / 10,
      },
    };
  }
}

export const brokerAnalyticsService = new BrokerAnalyticsService();
