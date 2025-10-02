'use client';

/**
 * Master Automated Lead Generation Orchestrator
 *
 * Coordinates ALL lead generation systems across FleetFlow:
 * - ImportYeti (DDP China importers)
 * - ThomasNet (Manufacturers)
 * - AI Lead Gen (FMCSA, Weather, Economic, Trade)
 * - Unified Leads (TruckingPlanet + ThomasNet)
 * - LinkedIn Lead Sync
 * - Custom industry-specific sources
 *
 * Runs everything automatically on schedules with zero manual work.
 */

import { automatedScraperService } from './AutomatedImportYetiScraperService';
import { ddpLeadGenService } from './DDPLeadGenerationService';

interface LeadSource {
  id: string;
  name: string;
  enabled: boolean;
  scheduleMinutes: number;
  lastRun: Date | null;
  nextRun: Date | null;
  totalLeadsGenerated: number;
  status: 'idle' | 'running' | 'error';
  targetIndustries: string[];
}

interface OrchestratorConfig {
  globalEnabled: boolean;
  sources: Map<string, LeadSource>;
}

class MasterLeadGenerationOrchestrator {
  private config: OrchestratorConfig;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.config = {
      globalEnabled: true,
      sources: new Map([
        // DDP ImportYeti Scraper (China importers)
        [
          'importyeti',
          {
            id: 'importyeti',
            name: 'ImportYeti Scraper (China DDP)',
            enabled: true,
            scheduleMinutes: 1440, // Daily
            lastRun: null,
            nextRun: null,
            totalLeadsGenerated: 0,
            status: 'idle',
            targetIndustries: ['steel', 'metal', 'aluminum'],
          },
        ],

        // ThomasNet Manufacturer Scraper
        [
          'thomasnet',
          {
            id: 'thomasnet',
            name: 'ThomasNet Manufacturers',
            enabled: true,
            scheduleMinutes: 360, // Every 6 hours
            lastRun: null,
            nextRun: null,
            totalLeadsGenerated: 0,
            status: 'idle',
            targetIndustries: [
              'automotive',
              'manufacturing',
              'steel',
              'construction',
            ],
          },
        ],

        // AI Lead Generation (Multi-source)
        [
          'ai-leadgen',
          {
            id: 'ai-leadgen',
            name: 'AI Lead Gen (7 Sources)',
            enabled: true,
            scheduleMinutes: 240, // Every 4 hours
            lastRun: null,
            nextRun: null,
            totalLeadsGenerated: 0,
            status: 'idle',
            targetIndustries: [
              'freight',
              'logistics',
              'manufacturing',
              'wholesale',
            ],
          },
        ],

        // Unified Leads (TruckingPlanet + ThomasNet)
        [
          'unified',
          {
            id: 'unified',
            name: 'Unified Leads (Multi-Source)',
            enabled: true,
            scheduleMinutes: 480, // Every 8 hours
            lastRun: null,
            nextRun: null,
            totalLeadsGenerated: 0,
            status: 'idle',
            targetIndustries: ['shippers', 'manufacturers', 'distributors'],
          },
        ],

        // LinkedIn Lead Sync (if credentials available)
        [
          'linkedin',
          {
            id: 'linkedin',
            name: 'LinkedIn Lead Sync',
            enabled: false, // Disabled until credentials added
            scheduleMinutes: 120, // Every 2 hours
            lastRun: null,
            nextRun: null,
            totalLeadsGenerated: 0,
            status: 'idle',
            targetIndustries: ['b2b', 'logistics', 'freight'],
          },
        ],
      ]),
    };

    console.log('🎯 Master Lead Generation Orchestrator initialized');
  }

  /**
   * Start ALL automated lead generation sources
   */
  public startAllSources(): void {
    if (!this.config.globalEnabled) {
      console.log('⚠️ Global automation is disabled');
      return;
    }

    console.log('🚀 Starting Master Lead Generation Orchestrator...\n');

    for (const [sourceId, source] of this.config.sources) {
      if (source.enabled) {
        this.startSource(sourceId);
      }
    }

    console.log(
      `✅ Orchestrator started with ${this.getEnabledSourceCount()} active sources\n`
    );
  }

  /**
   * Stop ALL automated lead generation
   */
  public stopAllSources(): void {
    console.log('🛑 Stopping all lead generation sources...');

    for (const sourceId of this.intervals.keys()) {
      this.stopSource(sourceId);
    }

    console.log('✅ All sources stopped');
  }

  /**
   * Start a specific source
   */
  public startSource(sourceId: string): void {
    const source = this.config.sources.get(sourceId);
    if (!source) {
      console.error(`❌ Source not found: ${sourceId}`);
      return;
    }

    if (!source.enabled) {
      console.log(`⚠️ Source disabled: ${source.name}`);
      return;
    }

    // Don't start if already running
    if (this.intervals.has(sourceId)) {
      console.log(`⚠️ Source already running: ${source.name}`);
      return;
    }

    // Run immediately
    this.runSource(sourceId);

    // Schedule recurring runs
    const intervalMs = source.scheduleMinutes * 60 * 1000;
    const interval = setInterval(() => {
      this.runSource(sourceId);
    }, intervalMs);

    this.intervals.set(sourceId, interval);

    console.log(
      `✅ ${source.name} - scheduled every ${source.scheduleMinutes} minutes`
    );
  }

  /**
   * Stop a specific source
   */
  public stopSource(sourceId: string): void {
    const interval = this.intervals.get(sourceId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(sourceId);

      const source = this.config.sources.get(sourceId);
      if (source) {
        source.status = 'idle';
        console.log(`🛑 Stopped: ${source.name}`);
      }
    }
  }

  /**
   * Run a specific source manually
   */
  public async runSource(sourceId: string): Promise<void> {
    const source = this.config.sources.get(sourceId);
    if (!source) return;

    source.status = 'running';
    source.lastRun = new Date();
    source.nextRun = new Date(Date.now() + source.scheduleMinutes * 60 * 1000);

    console.log(`\n🔄 Running: ${source.name}...`);

    try {
      let leadsGenerated = 0;

      switch (sourceId) {
        case 'importyeti':
          leadsGenerated = await this.runImportYetiScraper();
          break;
        case 'thomasnet':
          leadsGenerated = await this.runThomasNetScraper();
          break;
        case 'ai-leadgen':
          leadsGenerated = await this.runAILeadGen();
          break;
        case 'unified':
          leadsGenerated = await this.runUnifiedLeads();
          break;
        case 'linkedin':
          leadsGenerated = await this.runLinkedInSync();
          break;
        default:
          console.warn(`⚠️ Unknown source: ${sourceId}`);
      }

      source.totalLeadsGenerated += leadsGenerated;
      source.status = 'idle';

      console.log(
        `✅ ${source.name} - Generated ${leadsGenerated} leads (Total: ${source.totalLeadsGenerated})`
      );
    } catch (error) {
      source.status = 'error';
      console.error(`❌ ${source.name} error:`, error);
    }
  }

  /**
   * Source Implementations
   */

  private async runImportYetiScraper(): Promise<number> {
    // Trigger the automated scraper service
    automatedScraperService.runManually();
    // Get current lead count
    const leadsBefore = ddpLeadGenService.getAllLeads().length;
    // Wait a bit for scraping to complete
    await this.sleep(3000);
    // Get new lead count
    const leadsAfter = ddpLeadGenService.getAllLeads().length;
    return leadsAfter - leadsBefore;
  }

  private async runThomasNetScraper(): Promise<number> {
    try {
      const response = await fetch('/api/thomas-net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'freight_focused_search',
          location: 'United States',
          limit: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.results?.length || 0;
      }
    } catch (error) {
      console.error('ThomasNet error:', error);
    }
    return 0;
  }

  private async runAILeadGen(): Promise<number> {
    try {
      const response = await fetch(
        '/api/lead-generation?action=generate&industry=freight,manufacturing&freightNeed=high'
      );

      if (response.ok) {
        const data = await response.json();
        return data.data?.totalLeads || 0;
      }
    } catch (error) {
      console.error('AI Lead Gen error:', error);
    }
    return 0;
  }

  private async runUnifiedLeads(): Promise<number> {
    try {
      const response = await fetch('/api/unified-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {
            industry: ['automotive', 'steel', 'manufacturing'],
            companySize: 'medium',
          },
          options: {
            includeThomasNet: true,
            includeTruckingPlanet: true,
            maxLeadsPerSource: 10,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.leads?.length || 0;
      }
    } catch (error) {
      console.error('Unified Leads error:', error);
    }
    return 0;
  }

  private async runLinkedInSync(): Promise<number> {
    // LinkedIn sync happens automatically via LinkedInLeadSyncService
    // This is just a placeholder to track it in the orchestrator
    console.log('   LinkedIn: Auto-syncing in background...');
    return 0;
  }

  /**
   * Configuration & Status Methods
   */

  public enableSource(sourceId: string): void {
    const source = this.config.sources.get(sourceId);
    if (source) {
      source.enabled = true;
      this.startSource(sourceId);
      console.log(`✅ Enabled: ${source.name}`);
    }
  }

  public disableSource(sourceId: string): void {
    const source = this.config.sources.get(sourceId);
    if (source) {
      source.enabled = false;
      this.stopSource(sourceId);
      console.log(`🛑 Disabled: ${source.name}`);
    }
  }

  public setSourceSchedule(sourceId: string, minutes: number): void {
    const source = this.config.sources.get(sourceId);
    if (source) {
      source.scheduleMinutes = minutes;
      // Restart source with new schedule
      if (this.intervals.has(sourceId)) {
        this.stopSource(sourceId);
        this.startSource(sourceId);
      }
      console.log(`⚙️ ${source.name} - schedule updated to ${minutes} minutes`);
    }
  }

  public getAllSources(): LeadSource[] {
    return Array.from(this.config.sources.values());
  }

  public getSourceStatus(sourceId: string): LeadSource | undefined {
    return this.config.sources.get(sourceId);
  }

  public getEnabledSourceCount(): number {
    return Array.from(this.config.sources.values()).filter((s) => s.enabled)
      .length;
  }

  public getTotalLeadsGenerated(): number {
    return Array.from(this.config.sources.values()).reduce(
      (sum, source) => sum + source.totalLeadsGenerated,
      0
    );
  }

  public getOverallStatus() {
    const sources = Array.from(this.config.sources.values());
    return {
      globalEnabled: this.config.globalEnabled,
      totalSources: sources.length,
      enabledSources: sources.filter((s) => s.enabled).length,
      runningSources: sources.filter((s) => s.status === 'running').length,
      totalLeadsGenerated: this.getTotalLeadsGenerated(),
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        enabled: s.enabled,
        status: s.status,
        scheduleMinutes: s.scheduleMinutes,
        lastRun: s.lastRun,
        nextRun: s.nextRun,
        totalLeadsGenerated: s.totalLeadsGenerated,
      })),
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton
export const masterLeadOrchestrator = new MasterLeadGenerationOrchestrator();
export default masterLeadOrchestrator;
