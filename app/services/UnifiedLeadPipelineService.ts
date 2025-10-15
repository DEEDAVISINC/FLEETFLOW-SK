/**
 * Unified Lead Pipeline Service
 * Orchestrates the complete lead-to-conversion workflow:
 * Lead Generation → SALESFLOW.AI → LIVEFLOW.AI
 */

import { liveFlowAI } from './LiveFlowAI';
import { salesEmailAutomation } from './SalesEmailAutomationService';
import { FMCSAReverseLeadService } from './fmcsa-reverse-lead-service';

export interface UnifiedLead {
  id: string;
  source: 'FMCSA' | 'TruckingPlanet' | 'ThomasNet' | 'Manual' | 'Carriers';
  companyName: string;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  leadScore: number;
  salesStage: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed';
  salesflowStatus: 'Not Started' | 'In Sequence' | 'Completed' | 'Paused';
  liveflowInteractions: number;
  estimatedValue: number;
  createdAt: Date;
  lastActivity: Date;
  tags: string[];
}

export interface PipelineMetrics {
  totalLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  salesflowEngagement: number;
  liveflowCallRate: number;
  revenueGenerated: number;
}

export class UnifiedLeadPipelineService {
  private static instance: UnifiedLeadPipelineService;
  private activeLeads: Map<string, UnifiedLead> = new Map();
  private pipelineMetrics: PipelineMetrics = {
    totalLeads: 0,
    conversionRate: 0,
    averageResponseTime: 0,
    salesflowEngagement: 0,
    liveflowCallRate: 0,
    revenueGenerated: 0,
  };

  private constructor() {
    console.info('🚀 Unified Lead Pipeline Service initialized');
  }

  public static getInstance(): UnifiedLeadPipelineService {
    if (!UnifiedLeadPipelineService.instance) {
      UnifiedLeadPipelineService.instance = new UnifiedLeadPipelineService();
    }
    return UnifiedLeadPipelineService.instance;
  }

  /**
   * Start the complete lead pipeline for a new lead
   */
  public async startLeadPipeline(
    leadData: Partial<UnifiedLead>
  ): Promise<UnifiedLead> {
    const newLead: UnifiedLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: leadData.source || 'Manual',
      companyName: leadData.companyName || '',
      contactInfo: leadData.contactInfo || {},
      leadScore: leadData.leadScore || 0,
      salesStage: 'New',
      salesflowStatus: 'Not Started',
      liveflowInteractions: 0,
      estimatedValue: leadData.estimatedValue || 0,
      createdAt: new Date(),
      lastActivity: new Date(),
      tags: leadData.tags || [],
    };

    // Add to active leads
    this.activeLeads.set(newLead.id, newLead);
    this.pipelineMetrics.totalLeads++;

    console.info(
      `🎯 New lead pipeline started: ${newLead.companyName} (${newLead.source})`
    );

    // Start SALESFLOW.AI sequence
    await this.startSalesflowSequence(newLead);

    return newLead;
  }

  /**
   * Generate leads from all sources
   */
  public async generateLeads(): Promise<UnifiedLead[]> {
    const allLeads: UnifiedLead[] = [];

    try {
      // FMCSA Reverse Shipper Leads
      console.info('🏛️ Scanning FMCSA for shipper leads...');
      try {
        const fmcsaLeads = await this.generateFMCSALeads();
        allLeads.push(...fmcsaLeads);
        console.info(`✅ FMCSA: ${fmcsaLeads.length} leads generated`);
      } catch (error) {
        console.warn(
          '⚠️ FMCSA lead generation unavailable, using other sources'
        );
        // Continue without FMCSA leads rather than failing entirely
      }

      // TruckingPlanet Leads
      console.info('🚛 Scanning TruckingPlanet for carrier leads...');
      const truckingPlanetLeads = await this.generateTruckingPlanetLeads();
      allLeads.push(...truckingPlanetLeads);

      // ThomasNet Leads
      console.info('🏭 Scanning ThomasNet for industrial leads...');
      const thomasNetLeads = await this.generateThomasNetLeads();
      allLeads.push(...thomasNetLeads);

      // Carrier Leads (additional TruckingPlanet carriers)
      console.info('🚛 Scanning for additional carrier leads...');
      const carrierLeads = await this.generateCarrierLeads();
      allLeads.push(...carrierLeads);

      console.info(
        `🎯 Generated ${allLeads.length} total leads from all sources`
      );

      // Start pipelines for high-quality leads
      const highQualityLeads = allLeads.filter((lead) => lead.leadScore >= 70);
      for (const lead of highQualityLeads) {
        await this.startLeadPipeline(lead);
      }

      return allLeads;
    } catch (error) {
      console.error('❌ Lead generation failed:', error);
      return allLeads;
    }
  }

  /**
   * Start SALESFLOW.AI sequence for a lead
   */
  private async startSalesflowSequence(lead: UnifiedLead): Promise<void> {
    try {
      if (!lead.contactInfo.email) {
        console.warn(
          `⚠️ No email for ${lead.companyName} - skipping SALESFLOW.AI`
        );
        return;
      }

      // Update lead status
      lead.salesflowStatus = 'In Sequence';
      lead.lastActivity = new Date();

      console.info(`📧 Starting SALESFLOW.AI for ${lead.companyName}`);

      // SALESFLOW.AI handles the email sequence
      // This would integrate with your actual SALESFLOW.AI service
      await salesEmailAutomation.startSequence({
        leadId: lead.id,
        email: lead.contactInfo.email,
        companyName: lead.companyName,
        source: lead.source,
        leadScore: lead.leadScore,
      });
    } catch (error) {
      console.error(`❌ SALESFLOW.AI failed for ${lead.companyName}:`, error);
      lead.salesflowStatus = 'Not Started';
    }
  }

  /**
   * Handle call interactions with LIVEFLOW.AI
   */
  public async handleCallInteraction(
    leadId: string,
    callData: any
  ): Promise<void> {
    const lead = this.activeLeads.get(leadId);
    if (!lead) return;

    lead.liveflowInteractions++;
    lead.lastActivity = new Date();

    console.info(
      `📞 LIVEFLOW.AI call for ${lead.companyName} (${lead.liveflowInteractions} interactions)`
    );

    // LIVEFLOW.AI handles real-time call assistance
    // This would integrate with your actual LIVEFLOW.AI service
    await liveFlowAI.processCallData(leadId, callData);
  }

  /**
   * Update lead stage and metrics
   */
  public updateLeadStage(
    leadId: string,
    newStage: UnifiedLead['salesStage']
  ): void {
    const lead = this.activeLeads.get(leadId);
    if (!lead) return;

    const oldStage = lead.salesStage;
    lead.salesStage = newStage;
    lead.lastActivity = new Date();

    console.info(`📈 ${lead.companyName}: ${oldStage} → ${newStage}`);

    // Update metrics
    this.updatePipelineMetrics();
  }

  /**
   * Generate FMCSA leads
   */
  private async generateFMCSALeads(): Promise<UnifiedLead[]> {
    try {
      const fmcsaService = new FMCSAReverseLeadService();
      const results = await fmcsaService.generateShipperLeads({
        minPowerUnits: 10,
        states: ['CA', 'TX', 'FL', 'IL', 'NY'],
      });

      // results.leads contains the actual array of shipper leads
      return results.leads.map((lead) => ({
        id: `fmcsa_${lead.id}`,
        source: 'FMCSA' as const,
        companyName: lead.companyName,
        contactInfo: {
          phone: lead.contactInfo.phone,
          address: `${lead.contactInfo.city}, ${lead.contactInfo.state}`,
        },
        leadScore: lead.leadScore,
        salesStage: 'New' as const,
        salesflowStatus: 'Not Started' as const,
        liveflowInteractions: 0,
        estimatedValue: lead.estimatedMonthlyRevenue,
        createdAt: new Date(),
        lastActivity: new Date(),
        tags: ['FMCSA', 'Shipper', lead.businessInfo.operationType],
      }));
    } catch (error) {
      console.error('❌ FMCSA lead generation failed:', error);
      return [];
    }
  }

  /**
   * Generate TruckingPlanet leads
   */
  private async generateTruckingPlanetLeads(): Promise<UnifiedLead[]> {
    try {
      // Use TruckingPlanet API to get carrier leads
      const response = await fetch(
        '/api/trucking-planet?action=carriers&minTrucks=10'
      );
      const data = await response.json();

      if (data.success && data.data.carriers) {
        return data.data.carriers.slice(0, 50).map((carrier: any) => ({
          id: `tp_${carrier.id}`,
          source: 'TruckingPlanet' as const,
          companyName: carrier.companyName,
          contactInfo: {
            phone: carrier.contactInfo?.phone,
            address:
              `${carrier.location?.city || ''}, ${carrier.location?.state || ''}`.trim(),
          },
          leadScore: carrier.leadScore || 60,
          salesStage: 'New' as const,
          salesflowStatus: 'Not Started' as const,
          liveflowInteractions: 0,
          estimatedValue: carrier.estimatedValue || 15000,
          createdAt: new Date(),
          lastActivity: new Date(),
          tags: [
            'TruckingPlanet',
            'Carrier',
            carrier.equipmentType || 'Unknown',
          ],
        }));
      }

      return [];
    } catch (error) {
      console.error('❌ TruckingPlanet lead generation failed:', error);
      return [];
    }
  }

  /**
   * Generate additional carrier leads
   */
  private async generateCarrierLeads(): Promise<UnifiedLead[]> {
    try {
      // Use TruckingPlanet API to get additional carrier leads with different filters
      const response = await fetch(
        '/api/trucking-planet?action=carriers&minTrucks=25&states=CA,TX,FL,IL,NY'
      );
      const data = await response.json();

      if (data.success && data.data.carriers) {
        return data.data.carriers.slice(0, 30).map((carrier: any) => ({
          id: `carrier_${carrier.id}`,
          source: 'Carriers' as const,
          companyName: carrier.companyName,
          contactInfo: {
            phone: carrier.contactInfo?.phone,
            address:
              `${carrier.location?.city || ''}, ${carrier.location?.state || ''}`.trim(),
          },
          leadScore: carrier.leadScore || 70,
          salesStage: 'New' as const,
          salesflowStatus: 'Not Started' as const,
          liveflowInteractions: 0,
          estimatedValue: carrier.estimatedValue || 25000,
          createdAt: new Date(),
          lastActivity: new Date(),
          tags: [
            'Carriers',
            'TruckingPlanet',
            carrier.equipmentType || 'Mixed Fleet',
          ],
        }));
      }

      return [];
    } catch (error) {
      console.error('❌ Carrier lead generation failed:', error);
      return [];
    }
  }

  /**
   * Generate ThomasNet leads
   */
  private async generateThomasNetLeads(): Promise<UnifiedLead[]> {
    try {
      // Use ThomasNet API to get manufacturer leads
      const response = await fetch(
        '/api/thomas-net?industry=manufacturing&limit=50'
      );
      const data = await response.json();

      if (data.success && data.data.manufacturers) {
        return data.data.manufacturers.map((manufacturer: any) => ({
          id: `tn_${manufacturer.id}`,
          source: 'ThomasNet' as const,
          companyName: manufacturer.companyName,
          contactInfo: {
            email: manufacturer.contactInfo?.email,
            phone: manufacturer.contactInfo?.phone,
            address:
              `${manufacturer.location?.city || ''}, ${manufacturer.location?.state || ''}`.trim(),
          },
          leadScore: manufacturer.leadScore || 65,
          salesStage: 'New' as const,
          salesflowStatus: 'Not Started' as const,
          liveflowInteractions: 0,
          estimatedValue: manufacturer.estimatedValue || 20000,
          createdAt: new Date(),
          lastActivity: new Date(),
          tags: [
            'ThomasNet',
            'Manufacturer',
            manufacturer.industry || 'Manufacturing',
          ],
        }));
      }

      return [];
    } catch (error) {
      console.error('❌ ThomasNet lead generation failed:', error);
      return [];
    }
  }

  /**
   * Update pipeline metrics
   */
  private updatePipelineMetrics(): void {
    const leads = Array.from(this.activeLeads.values());

    this.pipelineMetrics.conversionRate =
      leads.filter((l) => l.salesStage === 'Closed').length / leads.length;
    this.pipelineMetrics.salesflowEngagement =
      leads.filter((l) => l.salesflowStatus === 'In Sequence').length /
      leads.length;
    this.pipelineMetrics.liveflowCallRate =
      leads.reduce((sum, l) => sum + l.liveflowInteractions, 0) / leads.length;
  }

  /**
   * Get pipeline metrics
   */
  public getMetrics(): PipelineMetrics {
    return { ...this.pipelineMetrics };
  }

  /**
   * Get all active leads
   */
  public getActiveLeads(): UnifiedLead[] {
    return Array.from(this.activeLeads.values());
  }

  /**
   * Get lead by ID
   */
  public getLead(leadId: string): UnifiedLead | undefined {
    return this.activeLeads.get(leadId);
  }
}

// Export singleton instance
export const unifiedLeadPipeline = UnifiedLeadPipelineService.getInstance();
