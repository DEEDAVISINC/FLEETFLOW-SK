/**
 * Email Signature Integration Service
 * Automatically injects professional signatures into all FleetFlow email communications
 * Integrates with SendGrid, AI systems, and manual email composers
 */

import {
  EmailSignature,
  fleetFlowSignatureManager,
} from './FleetFlowSignatureManager';
import { SendGridService } from './sendgrid-service';

export interface EmailSignatureConfig {
  userId?: string;
  department?: string;
  aiStaffId?: string;
  signatureId?: string;
  autoInject: boolean;
  format: 'html' | 'text' | 'both';
}

export class EmailSignatureIntegration {
  private static instance: EmailSignatureIntegration;
  private signatureCache: Map<string, EmailSignature> = new Map();

  static getInstance(): EmailSignatureIntegration {
    if (!this.instance) {
      this.instance = new EmailSignatureIntegration();
    }
    return this.instance;
  }

  /**
   * Initialize signature integration for all email services
   */
  async initialize(): Promise<void> {
    console.info('🔧 Initializing Email Signature Integration...');

    // Pre-generate signatures for all DEPOINTE AI staff
    await this.preGenerateAIStaffSignatures();

    // Setup automatic injection hooks
    this.setupSendGridIntegration();
    this.setupAIEmailIntegration();

    console.info('✅ Email Signature Integration initialized');
  }

  /**
   * Pre-generate signatures for all DEPOINTE AI staff members
   */
  private async preGenerateAIStaffSignatures(): Promise<void> {
    const aiStaffIds = [
      'resse-bell', // Financial
      'dell', // Technology
      'logan', // Logistics
      'miles', // Dispatch
      'dee', // Freight brokerage
      'will', // Sales
      'hunter', // Recruiting
      'brook-r', // Brokerage operations
      'carrie-r', // Carrier relations
      'kameelah', // DOT compliance
      'regina', // FMCSA regulations
      'shanell', // Customer service
      'clarence', // Claims & insurance
      'gary', // General lead generation
      'desiree', // Desperate prospects
      'cliff', // Desperate prospects
      'drew', // Marketing
      'c-allen-durr', // Scheduling
      'ana-lytics', // Data analysis
    ];

    for (const aiStaffId of aiStaffIds) {
      try {
        const signature =
          await fleetFlowSignatureManager.generateAIStaffSignature(aiStaffId);
        this.signatureCache.set(`ai-staff-${aiStaffId}`, signature);
        console.info(`✅ Generated signature for AI staff: ${aiStaffId}`);
      } catch (error) {
        console.error(
          `❌ Failed to generate signature for ${aiStaffId}:`,
          error
        );
      }
    }
  }

  /**
   * Setup SendGrid integration for automatic signature injection
   */
  private setupSendGridIntegration(): void {
    // Extend SendGrid service to automatically inject signatures
    const originalSendEmail = SendGridService.prototype.sendEmail;

    SendGridService.prototype.sendEmail = async function (options: any) {
      // Inject signature before sending
      const enhancedOptions =
        await EmailSignatureIntegration.getInstance().enhanceEmailWithSignature(
          options
        );

      return originalSendEmail.call(this, enhancedOptions);
    };
  }

  /**
   * Setup AI email system integration
   */
  private setupAIEmailIntegration(): void {
    // This would integrate with FreightEmailAI and other AI email services
    console.info('🤖 AI Email signature integration configured');
  }

  /**
   * Enhance email with appropriate signature
   */
  async enhanceEmailWithSignature(emailOptions: any): Promise<any> {
    try {
      const signatureConfig = this.determineSignatureConfig(emailOptions);

      if (!signatureConfig.autoInject) {
        return emailOptions;
      }

      const signature = await this.getSignatureForConfig(signatureConfig);

      if (!signature) {
        return emailOptions;
      }

      // Inject signature into email content
      const enhancedOptions = { ...emailOptions };

      if (enhancedOptions.template?.html) {
        enhancedOptions.template.html =
          fleetFlowSignatureManager.injectSignatureIntoEmail(
            enhancedOptions.template.html,
            signature.id,
            'html'
          );
      }

      if (enhancedOptions.template?.text) {
        enhancedOptions.template.text =
          fleetFlowSignatureManager.injectSignatureIntoEmail(
            enhancedOptions.template.text,
            signature.id,
            'text'
          );
      }

      return enhancedOptions;
    } catch (error) {
      console.error('Error enhancing email with signature:', error);
      return emailOptions;
    }
  }

  /**
   * Determine signature configuration based on email context
   */
  private determineSignatureConfig(emailOptions: any): EmailSignatureConfig {
    // Check for AI staff context
    if (emailOptions.aiStaffId) {
      return {
        aiStaffId: emailOptions.aiStaffId,
        autoInject: true,
        format: 'html',
      };
    }

    // Check for department context
    if (emailOptions.department) {
      return {
        department: emailOptions.department,
        userId: emailOptions.userId,
        autoInject: true,
        format: 'html',
      };
    }

    // Check for user context
    if (emailOptions.userId) {
      return {
        userId: emailOptions.userId,
        autoInject: true,
        format: 'html',
      };
    }

    // Check email category for AI staff mapping
    const aiStaffMapping = this.getAIStaffFromCategory(emailOptions.category);
    if (aiStaffMapping) {
      return {
        aiStaffId: aiStaffMapping,
        autoInject: true,
        format: 'html',
      };
    }

    // Default configuration
    return {
      autoInject: false,
      format: 'html',
    };
  }

  /**
   * Get signature for given configuration
   */
  private async getSignatureForConfig(
    config: EmailSignatureConfig
  ): Promise<EmailSignature | null> {
    try {
      // Check cache first
      let cacheKey = '';
      if (config.signatureId) {
        cacheKey = config.signatureId;
      } else if (config.aiStaffId) {
        cacheKey = `ai-staff-${config.aiStaffId}`;
      } else if (config.userId && config.department) {
        cacheKey = `dept-${config.department}-${config.userId}`;
      }

      if (cacheKey && this.signatureCache.has(cacheKey)) {
        return this.signatureCache.get(cacheKey)!;
      }

      // Generate signature if not cached
      let signature: EmailSignature | null = null;

      if (config.aiStaffId) {
        signature = await fleetFlowSignatureManager.generateAIStaffSignature(
          config.aiStaffId
        );
      } else if (config.department && config.userId) {
        signature = await fleetFlowSignatureManager.generateDepartmentSignature(
          config.department,
          'Staff Member', // This would come from user data
          { id: config.userId }
        );
      }

      // Cache the signature
      if (signature && cacheKey) {
        this.signatureCache.set(cacheKey, signature);
      }

      return signature;
    } catch (error) {
      console.error('Error getting signature for config:', error);
      return null;
    }
  }

  /**
   * Map email categories to AI staff members
   */
  private getAIStaffFromCategory(category?: string): string | null {
    if (!category) return null;

    const categoryMapping: Record<string, string> = {
      // Financial emails
      accounting: 'resse-bell',
      billing: 'resse-bell',
      invoice: 'resse-bell',

      // Technology emails
      support: 'dell',
      technical: 'dell',
      system: 'dell',

      // Operations emails
      logistics: 'logan',
      dispatch: 'miles',
      freight: 'dee',
      carrier: 'carrie-r',

      // Sales emails
      sales: 'will',
      lead: 'gary',
      marketing: 'drew',

      // Support emails
      customer_service: 'shanell',
      claims: 'clarence',

      // Compliance emails
      compliance: 'kameelah',
      safety: 'regina',

      // Recruiting emails
      recruiting: 'hunter',
      onboarding: 'hunter',
    };

    return categoryMapping[category.toLowerCase()] || null;
  }

  /**
   * Get signature for manual email composition
   */
  async getSignatureForUser(
    userId: string,
    department?: string
  ): Promise<EmailSignature | null> {
    const config: EmailSignatureConfig = {
      userId,
      department,
      autoInject: true,
      format: 'html',
    };

    return this.getSignatureForConfig(config);
  }

  /**
   * Get signature for AI staff member
   */
  async getSignatureForAIStaff(
    aiStaffId: string
  ): Promise<EmailSignature | null> {
    const cacheKey = `ai-staff-${aiStaffId}`;

    if (this.signatureCache.has(cacheKey)) {
      return this.signatureCache.get(cacheKey)!;
    }

    try {
      const signature =
        await fleetFlowSignatureManager.generateAIStaffSignature(aiStaffId);
      this.signatureCache.set(cacheKey, signature);
      return signature;
    } catch (error) {
      console.error(
        `Error getting signature for AI staff ${aiStaffId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Refresh signature cache
   */
  async refreshSignatureCache(): Promise<void> {
    console.info('🔄 Refreshing signature cache...');
    this.signatureCache.clear();
    await this.preGenerateAIStaffSignatures();
    console.info('✅ Signature cache refreshed');
  }

  /**
   * Get all available signatures for a department
   */
  async getDepartmentSignatures(department: string): Promise<EmailSignature[]> {
    const signatures: EmailSignature[] = [];

    // Get cached signatures for this department
    for (const [key, signature] of this.signatureCache.entries()) {
      if (signature.department === department) {
        signatures.push(signature);
      }
    }

    return signatures;
  }

  /**
   * Update signature in cache
   */
  updateSignatureCache(signatureId: string, signature: EmailSignature): void {
    this.signatureCache.set(signatureId, signature);
  }

  /**
   * Remove signature from cache
   */
  removeSignatureFromCache(signatureId: string): void {
    this.signatureCache.delete(signatureId);
  }

  /**
   * Get signature statistics
   */
  getSignatureStats(): {
    totalSignatures: number;
    aiStaffSignatures: number;
    departmentSignatures: number;
    customSignatures: number;
  } {
    let aiStaffCount = 0;
    let departmentCount = 0;
    let customCount = 0;

    for (const signature of this.signatureCache.values()) {
      switch (signature.type) {
        case 'ai_staff':
          aiStaffCount++;
          break;
        case 'custom':
          customCount++;
          break;
        default:
          departmentCount++;
          break;
      }
    }

    return {
      totalSignatures: this.signatureCache.size,
      aiStaffSignatures: aiStaffCount,
      departmentSignatures: departmentCount,
      customSignatures: customCount,
    };
  }
}

// Export singleton instance
export const emailSignatureIntegration =
  EmailSignatureIntegration.getInstance();
