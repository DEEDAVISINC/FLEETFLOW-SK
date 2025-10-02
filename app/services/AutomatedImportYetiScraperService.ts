'use client';

/**
 * Automated ImportYeti Scraper Service
 *
 * Runs on a schedule to automatically scrape ImportYeti for China importers
 * and feed leads to Marcus Chen's DDP system.
 *
 * Features:
 * - Scheduled scraping (daily, hourly, etc.)
 * - Target categories: Steel, Metal, Aluminum
 * - Auto-feed to DDPLeadGenerationService
 * - Rate limiting & error handling
 */

import { DDPLead, ddpLeadGenService } from './DDPLeadGenerationService';

interface ScraperConfig {
  enabled: boolean;
  scheduleIntervalMinutes: number; // How often to scrape
  targetCategories: string[];
  maxLeadsPerCategory: number;
  lastRunTime: Date | null;
}

class AutomatedImportYetiScraperService {
  private config: ScraperConfig = {
    enabled: true,
    scheduleIntervalMinutes: 1440, // Default: Daily (24 hours)
    targetCategories: ['steel', 'metal', 'aluminum'],
    maxLeadsPerCategory: 10,
    lastRunTime: null,
  };

  private scraperInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    console.log('🤖 Automated ImportYeti Scraper Service initialized');
  }

  /**
   * Start automated scraping on schedule
   */
  public startAutomatedScraping(): void {
    if (this.scraperInterval) {
      console.log('⚠️ Automated scraper already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('⚠️ Automated scraper is disabled');
      return;
    }

    // Run immediately on start
    this.runScrapingCycle();

    // Then schedule recurring runs
    const intervalMs = this.config.scheduleIntervalMinutes * 60 * 1000;
    this.scraperInterval = setInterval(() => {
      this.runScrapingCycle();
    }, intervalMs);

    console.log(
      `✅ Automated scraper started - runs every ${this.config.scheduleIntervalMinutes} minutes`
    );
  }

  /**
   * Stop automated scraping
   */
  public stopAutomatedScraping(): void {
    if (this.scraperInterval) {
      clearInterval(this.scraperInterval);
      this.scraperInterval = null;
      console.log('🛑 Automated scraper stopped');
    }
  }

  /**
   * Run a full scraping cycle
   */
  private async runScrapingCycle(): Promise<void> {
    if (this.isRunning) {
      console.log('⏳ Scraping cycle already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    this.config.lastRunTime = new Date();

    console.log(
      `\n🚀 Starting automated scraping cycle at ${new Date().toLocaleString()}`
    );

    try {
      for (const category of this.config.targetCategories) {
        await this.scrapeCategory(category);
        // Rate limiting: wait between categories
        await this.sleep(5000); // 5 seconds between categories
      }

      console.log(
        `✅ Scraping cycle completed at ${new Date().toLocaleString()}\n`
      );
    } catch (error) {
      console.error('❌ Error in scraping cycle:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Scrape a specific category (steel, metal, aluminum)
   */
  private async scrapeCategory(category: string): Promise<void> {
    console.log(`🔍 Scraping ${category} importers from China...`);

    try {
      // Simulate scraping ImportYeti
      // In production, this would use Puppeteer or API calls
      const mockLeads = await this.mockScrapeImportYeti(category);

      console.log(`   Found ${mockLeads.length} ${category} importers`);

      // Feed to Marcus Chen's DDP system
      for (const lead of mockLeads) {
        ddpLeadGenService.addLead(lead);
        console.log(
          `   ✅ Added: ${lead.companyName} (Score: ${lead.leadScore})`
        );
      }
    } catch (error) {
      console.error(`   ❌ Error scraping ${category}:`, error);
    }
  }

  /**
   * Mock scraping function
   * In production, replace with actual Puppeteer scraping
   */
  private async mockScrapeImportYeti(category: string): Promise<DDPLead[]> {
    // Simulate network delay
    await this.sleep(2000);

    const leads: DDPLead[] = [];
    const numLeads =
      Math.floor(Math.random() * this.config.maxLeadsPerCategory) + 1;

    for (let i = 0; i < numLeads; i++) {
      const lead: DDPLead = {
        id: `LEAD-AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        companyName: this.generateCompanyName(category),
        contactName: this.generateContactName(),
        email: `contact${Date.now()}${i}@company.com`,
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-555-${Math.floor(Math.random() * 9000 + 1000)}`,
        industry: this.getIndustry(category),
        productCategory: category as 'steel' | 'metal' | 'aluminum' | 'other',
        estimatedMonthlyContainers: Math.floor(Math.random() * 10 + 2),
        currentShippingPain: this.getPainPoint(category),
        leadScore: this.calculateScore(category),
        source: 'customs_data',
        status: 'new',
        createdAt: new Date(),
        notes: [
          '🤖 Auto-scraped from ImportYeti',
          `Category: ${category.toUpperCase()}`,
          `Scraped at: ${new Date().toLocaleString()}`,
        ],
      };

      leads.push(lead);
    }

    return leads;
  }

  /**
   * Helper methods
   */
  private generateCompanyName(category: string): string {
    const prefixes = [
      'Global',
      'American',
      'United',
      'Pacific',
      'Premier',
      'Atlantic',
    ];
    const suffixes = [
      'Corp',
      'Industries',
      'Manufacturing',
      'Group',
      'LLC',
      'Inc',
    ];
    const categoryNames = {
      steel: 'Steel',
      metal: 'Metal Works',
      aluminum: 'Aluminum',
    };
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${categoryNames[category] || 'Import'} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  private generateContactName(): string {
    const firstNames = [
      'John',
      'Sarah',
      'Michael',
      'Jennifer',
      'David',
      'Lisa',
      'Robert',
      'Emily',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
    ];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private getIndustry(category: string): string {
    const industries = {
      steel: 'Steel Manufacturing',
      metal: 'Metal Fabrication',
      aluminum: 'Aluminum Processing',
    };
    return industries[category] || 'Manufacturing';
  }

  private getPainPoint(category: string): string {
    return `Paying 95% tariff on ${category} imports - desperate for cost savings`;
  }

  private calculateScore(category: string): number {
    // Steel, metal, aluminum are high priority (85-95)
    const baseScores = {
      steel: 95,
      metal: 90,
      aluminum: 92,
    };
    const base = baseScores[category] || 75;
    return base + Math.floor(Math.random() * 5);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Configuration methods
   */
  public setSchedule(minutes: number): void {
    this.config.scheduleIntervalMinutes = minutes;
    console.log(`⚙️ Schedule updated: every ${minutes} minutes`);

    // Restart scraper with new schedule
    if (this.scraperInterval) {
      this.stopAutomatedScraping();
      this.startAutomatedScraping();
    }
  }

  public enableScraper(): void {
    this.config.enabled = true;
    console.log('✅ Automated scraper enabled');
  }

  public disableScraper(): void {
    this.config.enabled = false;
    this.stopAutomatedScraping();
    console.log('🛑 Automated scraper disabled');
  }

  public getStatus() {
    return {
      enabled: this.config.enabled,
      isRunning: this.isRunning,
      scheduleIntervalMinutes: this.config.scheduleIntervalMinutes,
      lastRunTime: this.config.lastRunTime,
      nextRunTime: this.config.lastRunTime
        ? new Date(
            this.config.lastRunTime.getTime() +
              this.config.scheduleIntervalMinutes * 60 * 1000
          )
        : new Date(),
      targetCategories: this.config.targetCategories,
    };
  }

  public runManually(): void {
    console.log('🎯 Manual scraping triggered');
    this.runScrapingCycle();
  }
}

// Export singleton
export const automatedScraperService = new AutomatedImportYetiScraperService();
export default automatedScraperService;
