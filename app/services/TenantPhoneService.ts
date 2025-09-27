/**
 * Tenant Phone Number Management Service
 * Manages phone numbers for each tenant in multi-tenant environment
 */

import { getCurrentUser } from '../config/access';

export interface TenantPhoneConfig {
  tenantId: string;
  tenantName: string;
  primaryPhone: string;
  backupPhone?: string;
  twilioSubAccount?: string;
  freeswitchExtension?: string;
  callerIdName: string;
  smsEnabled: boolean;
  voiceEnabled: boolean;
  provider: 'twilio' | 'freeswitch' | 'both';
}

export interface PhoneUsageStats {
  tenantId: string;
  totalCalls: number;
  callsToday: number;
  totalCost: number;
  lastCallTime: string;
}

export class TenantPhoneService {
  private static instance: TenantPhoneService;
  private tenantPhones: Map<string, TenantPhoneConfig> = new Map();

  private constructor() {
    this.initializeTenantPhones();
  }

  public static getInstance(): TenantPhoneService {
    if (!TenantPhoneService.instance) {
      TenantPhoneService.instance = new TenantPhoneService();
    }
    return TenantPhoneService.instance;
  }

  /**
   * Initialize with demo tenant phone numbers
   * In production, this would load from database
   */
  private initializeTenantPhones(): void {
    const demoConfigs: TenantPhoneConfig[] = [
      {
        tenantId: 'global-freight-solutions',
        tenantName: 'Global Freight Solutions',
        primaryPhone: '+1-833-555-0001',
        backupPhone: '+1-833-555-0002',
        twilioSubAccount: 'AC_global_freight',
        freeswitchExtension: '1001',
        callerIdName: 'Global Freight',
        smsEnabled: true,
        voiceEnabled: true,
        provider: 'both',
      },
      {
        tenantId: 'swift-freight',
        tenantName: 'Swift Freight',
        primaryPhone: '+1-833-555-0003',
        backupPhone: '+1-833-555-0004',
        twilioSubAccount: 'AC_swift_freight',
        freeswitchExtension: '1002',
        callerIdName: 'Swift Freight',
        smsEnabled: true,
        voiceEnabled: true,
        provider: 'both',
      },
      {
        tenantId: 'express-cargo',
        tenantName: 'Express Cargo',
        primaryPhone: '+1-833-555-0005',
        backupPhone: '+1-833-555-0006',
        twilioSubAccount: 'AC_express_cargo',
        freeswitchExtension: '1003',
        callerIdName: 'Express Cargo',
        smsEnabled: true,
        voiceEnabled: true,
        provider: 'both',
      },
      {
        tenantId: 'fleetflow-demo',
        tenantName: 'FleetFlow Demo Company',
        primaryPhone: '+1-833-386-3509', // Our existing Twilio number
        backupPhone: '+1-833-555-0000',
        twilioSubAccount: 'main_account',
        freeswitchExtension: '1000',
        callerIdName: 'FleetFlow',
        smsEnabled: true,
        voiceEnabled: true,
        provider: 'both',
      },
      {
        tenantId: 'depointe-fleetflow',
        tenantName: 'DEPOINTE AI Company',
        primaryPhone: '+1-833-386-3509', // Production Twilio number
        backupPhone: '+1-888-DEPOINTE',
        twilioSubAccount: 'AC_depointe',
        freeswitchExtension: '2000',
        callerIdName: 'DEPOINTE AI',
        smsEnabled: true,
        voiceEnabled: true,
        provider: 'both',
      },
    ];

    demoConfigs.forEach((config) => {
      this.tenantPhones.set(config.tenantId, config);
    });
  }

  /**
   * Get current user's tenant phone configuration
   */
  public getCurrentTenantPhoneConfig(): TenantPhoneConfig | null {
    try {
      // For DEPOINTE dashboard users, always return the DEPOINTE configuration
      // Check both client-side and server-side path detection
      let isDepointeDashboard = false;

      if (typeof window !== 'undefined') {
        // Client-side path detection
        isDepointeDashboard =
          window.location.pathname.includes('depointe-dashboard');
      } else {
        // Server-side: Default to DEPOINTE configuration since it's the primary dashboard
        console.info(
          '📞 TenantPhoneService: Server-side call, defaulting to DEPOINTE configuration'
        );
        isDepointeDashboard = true;
      }

      if (isDepointeDashboard) {
        console.info(
          '📞 TenantPhoneService: Using DEPOINTE configuration for dashboard'
        );
        return this.tenantPhones.get('depointe-fleetflow') || null;
      }

      // Only attempt to get user info on client-side
      if (typeof window !== 'undefined') {
        const { user } = getCurrentUser();

        // Map user to tenant ID based on company or role
        let tenantId = 'fleetflow-demo'; // Default

        if (user.companyName) {
          // Map company names to tenant IDs
          const companyToTenantMap: Record<string, string> = {
            'Global Freight Solutions': 'global-freight-solutions',
            'Swift Freight': 'swift-freight',
            'Express Cargo': 'express-cargo',
          };
          tenantId = companyToTenantMap[user.companyName] || 'fleetflow-demo';
        }

        return this.tenantPhones.get(tenantId) || null;
      }

      // Server-side fallback to DEPOINTE
      return this.tenantPhones.get('depointe-fleetflow') || null;
    } catch (error) {
      console.error('❌ Error getting tenant phone config:', error);
      // Fallback to DEPOINTE configuration
      return this.tenantPhones.get('depointe-fleetflow') || null;
    }
  }

  /**
   * Get tenant phone config by tenant ID
   */
  public getTenantPhoneConfig(tenantId: string): TenantPhoneConfig | null {
    return this.tenantPhones.get(tenantId) || null;
  }

  /**
   * Get DEPOINTE AI Company phone configuration directly
   */
  public getDepointePhoneConfig(): TenantPhoneConfig | null {
    console.info(
      '📞 TenantPhoneService: Getting DEPOINTE phone configuration directly'
    );
    return this.tenantPhones.get('depointe-fleetflow') || null;
  }

  /**
   * Get phone number for outbound calls
   */
  public getOutboundPhoneNumber(tenantId?: string): string {
    let config: TenantPhoneConfig | null;

    if (tenantId) {
      config = this.getTenantPhoneConfig(tenantId);
    } else {
      config = this.getCurrentTenantPhoneConfig();
    }

    if (!config) {
      // Fallback to system default
      return '+1-833-386-3509';
    }

    return config.primaryPhone;
  }

  /**
   * Get caller ID name for calls
   */
  public getCallerIdName(tenantId?: string): string {
    let config: TenantPhoneConfig | null;

    if (tenantId) {
      config = this.getTenantPhoneConfig(tenantId);
    } else {
      config = this.getCurrentTenantPhoneConfig();
    }

    return config?.callerIdName || 'FleetFlow';
  }

  /**
   * Check if tenant can make voice calls
   */
  public canMakeVoiceCalls(tenantId?: string): boolean {
    let config: TenantPhoneConfig | null;

    if (tenantId) {
      config = this.getTenantPhoneConfig(tenantId);
    } else {
      config = this.getCurrentTenantPhoneConfig();
    }

    return config?.voiceEnabled || false;
  }

  /**
   * Get preferred calling provider for tenant
   */
  public getPreferredProvider(tenantId?: string): 'twilio' | 'freeswitch' {
    let config: TenantPhoneConfig | null;

    if (tenantId) {
      config = this.getTenantPhoneConfig(tenantId);
    } else {
      config = this.getCurrentTenantPhoneConfig();
    }

    if (config?.provider === 'both' || config?.provider === 'freeswitch') {
      return 'freeswitch';
    }
    return 'twilio';
  }

  /**
   * Get Twilio subaccount for tenant calls
   */
  public getTwilioSubAccount(tenantId?: string): string | null {
    let config: TenantPhoneConfig | null;

    if (tenantId) {
      config = this.getTenantPhoneConfig(tenantId);
    } else {
      config = this.getCurrentTenantPhoneConfig();
    }

    return config?.twilioSubAccount || null;
  }

  /**
   * Get FreeSWITCH extension for tenant
   */
  public getFreeSwitchExtension(tenantId?: string): string | null {
    let config: TenantPhoneConfig | null;

    if (tenantId) {
      config = this.getTenantPhoneConfig(tenantId);
    } else {
      config = this.getCurrentTenantPhoneConfig();
    }

    return config?.freeswitchExtension || null;
  }

  /**
   * Add or update tenant phone configuration
   */
  public setTenantPhoneConfig(config: TenantPhoneConfig): void {
    this.tenantPhones.set(config.tenantId, config);
  }

  /**
   * Get all tenant phone configurations (admin only)
   */
  public getAllTenantPhoneConfigs(): TenantPhoneConfig[] {
    const { user } = getCurrentUser();
    if (user.role !== 'admin') {
      throw new Error('Access denied: Admin access required');
    }

    return Array.from(this.tenantPhones.values());
  }

  /**
   * Get phone usage statistics for tenant
   */
  public getPhoneUsageStats(tenantId?: string): PhoneUsageStats {
    const config = tenantId
      ? this.getTenantPhoneConfig(tenantId)
      : this.getCurrentTenantPhoneConfig();

    if (!config) {
      return {
        tenantId: tenantId || 'unknown',
        totalCalls: 0,
        callsToday: 0,
        totalCost: 0,
        lastCallTime: 'Never',
      };
    }

    // Mock data - in production, this would query call logs
    return {
      tenantId: config.tenantId,
      totalCalls: Math.floor(Math.random() * 500) + 100,
      callsToday: Math.floor(Math.random() * 20) + 5,
      totalCost: Math.floor(Math.random() * 1000) + 200,
      lastCallTime: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const tenantPhoneService = TenantPhoneService.getInstance();
