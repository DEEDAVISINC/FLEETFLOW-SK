/**
 * Dynamic Campaign Optimization Seeding Service
 * Seeds the optimization service with sample campaigns and data
 */

import { dynamicCampaignOptimizationService } from './DynamicCampaignOptimizationService';

export class DynamicCampaignOptimizationSeedingService {
  /**
   * Seed the optimization service with sample data
   */
  static async seedOptimizationData(): Promise<void> {
    console.info('🎯 Seeding Dynamic Campaign Optimization...');

    // Check if already seeded
    const existingCampaigns =
      dynamicCampaignOptimizationService.getActiveCampaigns();
    if (existingCampaigns.length > 0) {
      console.info('📊 Campaign optimization already seeded, skipping...');
      return;
    }

    // Seed sample campaigns
    await this.seedSampleCampaigns();

    console.info('✅ Dynamic Campaign Optimization seeded successfully!');
  }

  private static async seedSampleCampaigns(): Promise<void> {
    const campaigns = [
      {
        campaignId: 'desperate_shippers_blitz_active',
        name: 'Desperate Shippers Blitz',
        targetType: 'desperate_shippers',
        initialMetrics: {
          leadsGenerated: 127,
          contactsReached: 203,
          conversionRate: 34.2,
          costPerLead: 145,
          revenueGenerated: 156700,
          aiStaffUtilized: 3,
          responseTime: 23,
          engagementRate: 78.5,
        },
      },
      {
        campaignId: 'manufacturing_giants_campaign',
        name: 'Manufacturing Giants Campaign',
        targetType: 'manufacturers',
        initialMetrics: {
          leadsGenerated: 89,
          contactsReached: 134,
          conversionRate: 42.1,
          costPerLead: 285,
          revenueGenerated: 198600,
          aiStaffUtilized: 2,
          responseTime: 18,
          engagementRate: 82.3,
        },
      },
      {
        campaignId: 'owner_operator_army_active',
        name: 'Owner Operator Army',
        targetType: 'owner_operators',
        initialMetrics: {
          leadsGenerated: 203,
          contactsReached: 267,
          conversionRate: 28.7,
          costPerLead: 98,
          revenueGenerated: 98400,
          aiStaffUtilized: 3,
          responseTime: 31,
          engagementRate: 71.9,
        },
      },
      {
        campaignId: 'safety_crisis_rescue',
        name: 'Safety Crisis Rescue',
        targetType: 'safety_violations',
        initialMetrics: {
          leadsGenerated: 156,
          contactsReached: 189,
          conversionRate: 38.9,
          costPerLead: 167,
          revenueGenerated: 145800,
          aiStaffUtilized: 2,
          responseTime: 27,
          engagementRate: 85.2,
        },
      },
    ];

    for (const campaign of campaigns) {
      await dynamicCampaignOptimizationService.startCampaign(
        campaign.campaignId,
        campaign.targetType.replace('_', '_') + '_blitz', // Map to preset IDs
        campaign.initialMetrics
      );

      // Add some historical updates to create trends
      const updates = this.generateHistoricalUpdates(campaign);
      for (const update of updates) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
        await dynamicCampaignOptimizationService.updateCampaignMetrics(
          campaign.campaignId,
          update.metrics
        );
      }

      console.info(
        `📊 Seeded campaign: ${campaign.name} (${campaign.campaignId})`
      );
    }
  }

  private static generateHistoricalUpdates(
    campaign: any
  ): Array<{ metrics: any }> {
    const updates = [];
    const daysBack = 7;

    for (let i = daysBack; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate realistic daily metrics based on campaign type
      const dailyMetrics = this.generateDailyMetrics(campaign, i);

      updates.push({
        metrics: dailyMetrics,
      });
    }

    return updates;
  }

  private static generateDailyMetrics(campaign: any, daysAgo: number): any {
    const baseMetrics = campaign.initialMetrics;

    // Add some realistic variation
    const variation = 0.85 + Math.random() * 0.3; // 85-115% variation

    return {
      leadsGenerated: Math.round((baseMetrics.leadsGenerated * variation) / 7),
      contactsReached: Math.round(
        (baseMetrics.contactsReached * variation) / 7
      ),
      conversionRate: Math.max(
        0,
        Math.min(100, baseMetrics.conversionRate + (Math.random() - 0.5) * 10)
      ),
      costPerLead: Math.max(
        0,
        baseMetrics.costPerLead + (Math.random() - 0.5) * 50
      ),
      revenueGenerated: Math.round(
        (baseMetrics.revenueGenerated * variation) / 7
      ),
      aiStaffUtilized: baseMetrics.aiStaffUtilized,
      responseTime: Math.max(
        5,
        Math.min(120, baseMetrics.responseTime + (Math.random() - 0.5) * 20)
      ),
      engagementRate: Math.max(
        0,
        Math.min(100, baseMetrics.engagementRate + (Math.random() - 0.5) * 15)
      ),
    };
  }
}

// Auto-seed when module is loaded in browser
if (typeof window !== 'undefined') {
  // Delay seeding to ensure service is initialized
  setTimeout(() => {
    DynamicCampaignOptimizationSeedingService.seedOptimizationData();
  }, 2500);
}

