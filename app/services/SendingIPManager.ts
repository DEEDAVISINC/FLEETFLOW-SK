/**
 * FleetFlow Sending IP Manager
 * Manages IP address rotation and reputation for email deliverability
 * Works with SendGrid IP Pools to optimize email sending infrastructure
 */

import { EmailResult } from './sendgrid-service';

export interface IPDetails {
  ip: string;
  pool: string;
  warmupStatus: 'warming' | 'active' | 'quarantined' | 'retired';
  reputationScore: number; // 0-100
  lastUsed: Date;
  dailyVolume: number;
  dailyLimit: number;
  weeklyVolume: number;
  weeklyLimit: number;
  bounceRate: number; // 0-1
  spamComplaintRate: number; // 0-1
  createdAt: Date;
  lastChecked: Date;
}

export interface IPPool {
  name: string;
  purpose: 'marketing' | 'transactional' | 'warmup' | 'critical';
  ips: IPDetails[];
  isDefault: boolean;
  isActive: boolean;
}

interface SendingIPManagerConfig {
  useIPPools: boolean;
  monitorReputation: boolean;
  autoQuarantine: boolean;
  apiKey?: string;
}

export class SendingIPManager {
  private ipPools: IPPool[] = [];
  private useIPPools: boolean;
  private monitorReputation: boolean;
  private autoQuarantine: boolean;
  private apiKey: string | undefined;
  private reputationThresholds = {
    excellent: 90,
    good: 80,
    fair: 70,
    poor: 60,
  };

  constructor(config: SendingIPManagerConfig) {
    this.useIPPools = config.useIPPools;
    this.monitorReputation = config.monitorReputation;
    this.autoQuarantine = config.autoQuarantine;
    this.apiKey = config.apiKey;

    // Initialize with empty pools
    this.initializeDefaultPools();

    console.log(
      `🌐 Sending IP Manager initialized (IP Pools: ${this.useIPPools ? 'Enabled' : 'Disabled'})`
    );
  }

  /**
   * Initialize the IP pool system
   */
  async initialize(): Promise<boolean> {
    if (!this.useIPPools) {
      console.log('⚠️ IP Pools are disabled. Using default SendGrid IP.');
      return false;
    }

    if (!this.apiKey) {
      console.log('⚠️ No API key provided for IP Pool management.');
      return false;
    }

    try {
      // In a real implementation, this would fetch IP pools from SendGrid
      // For now, we'll use mock data
      await this.fetchIPPoolsFromSendGrid();
      console.log(
        `✅ Initialized ${this.ipPools.length} IP pools with ${this.getTotalIPs()} IPs`
      );
      return true;
    } catch (error) {
      console.error('Failed to initialize IP pools:', error);
      return false;
    }
  }

  /**
   * Select the optimal IP for sending a specific type of email
   */
  selectOptimalIP(
    emailType: 'marketing' | 'transactional' | 'critical'
  ): IPDetails | null {
    if (!this.useIPPools) {
      return null; // Use default IP
    }

    // Find the appropriate pool for this email type
    const pool = this.findPoolForEmailType(emailType);
    if (!pool || pool.ips.length === 0) {
      console.log(`⚠️ No IPs available for ${emailType} emails`);
      return null;
    }

    // Filter out quarantined or retired IPs
    const availableIPs = pool.ips.filter(
      (ip) => ip.warmupStatus === 'active' && ip.dailyVolume < ip.dailyLimit
    );

    if (availableIPs.length === 0) {
      console.log(`⚠️ No available IPs in the ${pool.name} pool`);
      return null;
    }

    // Find the IP with the highest reputation that hasn't reached its daily limit
    return this.findBestIP(availableIPs);
  }

  /**
   * Update IP statistics after sending emails
   */
  async updateIPStats(ip: string, results: EmailResult[]): Promise<void> {
    if (!this.useIPPools) return;

    const ipDetail = this.findIPByAddress(ip);
    if (!ipDetail) return;

    // Update usage statistics
    ipDetail.dailyVolume += results.length;
    ipDetail.weeklyVolume += results.length;
    ipDetail.lastUsed = new Date();

    // Calculate bounce rate and complaint rate
    const sent = results.length;
    const bounced = results.filter((r) => !r.success).length;
    const newBounceRate = bounced / sent;

    // Update the IP's metrics with weighted averaging (recent results count more)
    ipDetail.bounceRate = ipDetail.bounceRate * 0.7 + newBounceRate * 0.3;

    // If the bounce rate exceeds thresholds, take action
    if (this.autoQuarantine && ipDetail.bounceRate > 0.05) {
      // 5% bounce rate is concerning
      await this.quarantineIP(ipDetail);
    }
  }

  /**
   * Check IP reputation across all pools
   */
  async checkAllIPReputations(): Promise<void> {
    if (!this.useIPPools || !this.monitorReputation) return;

    console.log('🔍 Checking reputation for all IPs');

    for (const pool of this.ipPools) {
      for (const ip of pool.ips) {
        if (
          ip.warmupStatus === 'quarantined' ||
          ip.warmupStatus === 'retired'
        ) {
          continue;
        }

        try {
          const reputation = await this.checkIPReputation(ip.ip);
          ip.reputationScore = reputation;
          ip.lastChecked = new Date();

          // Take action based on reputation score
          if (
            reputation < this.reputationThresholds.poor &&
            this.autoQuarantine
          ) {
            await this.quarantineIP(ip);
            console.log(
              `⚠️ IP ${ip.ip} quarantined due to poor reputation (${reputation})`
            );
          }
        } catch (error) {
          console.error(`Failed to check reputation for IP ${ip.ip}:`, error);
        }
      }
    }
  }

  /**
   * Quarantine an IP with delivery issues
   */
  async quarantineIP(ip: IPDetails): Promise<boolean> {
    if (!this.useIPPools) return false;

    // In a real implementation, this would update the IP pool in SendGrid
    console.log(`🔒 Quarantining IP ${ip.ip} due to delivery issues`);
    ip.warmupStatus = 'quarantined';

    // Check if we need to activate a replacement IP
    const pool = this.findPoolForIP(ip.ip);
    if (!pool) return false;

    const activeIPs = pool.ips.filter((i) => i.warmupStatus === 'active');
    if (activeIPs.length < 2) {
      // Try to activate another IP in the pool
      const warmingIPs = pool.ips.filter((i) => i.warmupStatus === 'warming');
      if (warmingIPs.length > 0) {
        const oldestWarmingIP = warmingIPs.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )[0];

        oldestWarmingIP.warmupStatus = 'active';
        console.log(
          `✅ Activated IP ${oldestWarmingIP.ip} to replace quarantined IP`
        );
      }
    }

    return true;
  }

  /**
   * Get available IP pools
   */
  getIPPools(): IPPool[] {
    return this.ipPools;
  }

  /**
   * Get IP reputation overview
   */
  getReputationOverview(): {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    quarantined: number;
  } {
    const allIPs = this.ipPools.flatMap((pool) => pool.ips);

    return {
      excellent: allIPs.filter(
        (ip) => ip.reputationScore >= this.reputationThresholds.excellent
      ).length,
      good: allIPs.filter(
        (ip) =>
          ip.reputationScore >= this.reputationThresholds.good &&
          ip.reputationScore < this.reputationThresholds.excellent
      ).length,
      fair: allIPs.filter(
        (ip) =>
          ip.reputationScore >= this.reputationThresholds.fair &&
          ip.reputationScore < this.reputationThresholds.good
      ).length,
      poor: allIPs.filter(
        (ip) =>
          ip.reputationScore < this.reputationThresholds.fair &&
          ip.warmupStatus !== 'quarantined'
      ).length,
      quarantined: allIPs.filter((ip) => ip.warmupStatus === 'quarantined')
        .length,
    };
  }

  /**
   * Get total available IPs
   */
  getTotalIPs(): number {
    return this.ipPools.reduce((sum, pool) => sum + pool.ips.length, 0);
  }

  /**
   * Get active IPs
   */
  getActiveIPs(): number {
    return this.ipPools.reduce(
      (sum, pool) =>
        sum + pool.ips.filter((ip) => ip.warmupStatus === 'active').length,
      0
    );
  }

  /**
   * Initialize default IP pools
   */
  private initializeDefaultPools(): void {
    // Create empty pools
    this.ipPools = [
      {
        name: 'marketing',
        purpose: 'marketing',
        ips: [],
        isDefault: false,
        isActive: true,
      },
      {
        name: 'transactional',
        purpose: 'transactional',
        ips: [],
        isDefault: true,
        isActive: true,
      },
      {
        name: 'warmup',
        purpose: 'warmup',
        ips: [],
        isDefault: false,
        isActive: true,
      },
      {
        name: 'critical',
        purpose: 'critical',
        ips: [],
        isDefault: false,
        isActive: true,
      },
    ];
  }

  /**
   * Find the appropriate pool for a given email type
   */
  private findPoolForEmailType(
    emailType: 'marketing' | 'transactional' | 'critical'
  ): IPPool | undefined {
    return this.ipPools.find(
      (pool) => pool.purpose === emailType && pool.isActive
    );
  }

  /**
   * Find IP by address
   */
  private findIPByAddress(ip: string): IPDetails | undefined {
    for (const pool of this.ipPools) {
      const found = pool.ips.find((ipDetails) => ipDetails.ip === ip);
      if (found) return found;
    }
    return undefined;
  }

  /**
   * Find the pool that contains a specific IP
   */
  private findPoolForIP(ip: string): IPPool | undefined {
    return this.ipPools.find((pool) =>
      pool.ips.some((ipDetails) => ipDetails.ip === ip)
    );
  }

  /**
   * Find the best IP to use based on reputation and usage
   */
  private findBestIP(ips: IPDetails[]): IPDetails {
    // Sort by reputation (highest first) and then by usage (lowest first)
    return [...ips].sort((a, b) => {
      if (b.reputationScore !== a.reputationScore) {
        return b.reputationScore - a.reputationScore;
      }
      // If reputation is the same, use the one with lowest usage
      return a.dailyVolume / a.dailyLimit - b.dailyVolume / b.dailyLimit;
    })[0];
  }

  /**
   * Fetch IP pools from SendGrid
   */
  private async fetchIPPoolsFromSendGrid(): Promise<void> {
    // In a real implementation, this would call SendGrid's API
    // For now, we'll populate with mock data

    // Mock marketing IPs
    this.ipPools[0].ips = this.createMockIPs(3, this.ipPools[0].name);

    // Mock transactional IPs
    this.ipPools[1].ips = this.createMockIPs(4, this.ipPools[1].name);

    // Mock warmup IPs
    this.ipPools[2].ips = this.createMockIPs(
      2,
      this.ipPools[2].name,
      'warming'
    );

    // Mock critical IPs
    this.ipPools[3].ips = this.createMockIPs(2, this.ipPools[3].name);
  }

  /**
   * Check IP reputation with SendGrid
   */
  private async checkIPReputation(ip: string): Promise<number> {
    // In a real implementation, this would call SendGrid's API
    // For now, we'll return a random score between 80 and 98
    return 80 + Math.floor(Math.random() * 18);
  }

  /**
   * Create mock IPs for development
   */
  private createMockIPs(
    count: number,
    poolName: string,
    status: 'warming' | 'active' = 'active'
  ): IPDetails[] {
    const ips: IPDetails[] = [];

    for (let i = 0; i < count; i++) {
      // Generate a random IP address
      const ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

      ips.push({
        ip: ipAddress,
        pool: poolName,
        warmupStatus: status,
        reputationScore: 85 + Math.floor(Math.random() * 15), // 85-99
        lastUsed: new Date(Date.now() - Math.random() * 86400000), // Within the last 24 hours
        dailyVolume: Math.floor(Math.random() * 500),
        dailyLimit: 2000,
        weeklyVolume: Math.floor(Math.random() * 2500),
        weeklyLimit: 10000,
        bounceRate: Math.random() * 0.03, // 0-3% bounce rate
        spamComplaintRate: Math.random() * 0.002, // 0-0.2% complaint rate
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 86400000
        ), // 0-30 days ago
        lastChecked: new Date(
          Date.now() - Math.floor(Math.random() * 24) * 3600000
        ), // 0-24 hours ago
      });
    }

    return ips;
  }
}

// Export singleton instance
export const sendingIPManager = new SendingIPManager({
  useIPPools: !!process.env.SENDGRID_API_KEY,
  monitorReputation: true,
  autoQuarantine: true,
  apiKey: process.env.SENDGRID_API_KEY,
});
