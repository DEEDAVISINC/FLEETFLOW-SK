/**
 * FleetFlow User Creation Trigger Service
 * Automatically triggers contractor onboarding for dispatch and broker users
 */

import ContractorWorkflowService, { ContractorWorkflowTrigger } from './ContractorWorkflowService'
import UserIdentificationService from './UserIdentificationService'

export interface UserCreationEvent {
  userId: string;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    hiredDate: string;
    location?: string;
    address?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  createdBy: string;
  createdAt: Date;
  source: 'user_management' | 'admin_panel' | 'bulk_import' | 'api';
  metadata?: any;
}

export interface TriggerConfiguration {
  enabled: boolean;
  triggerRoles: string[];
  autoStart: boolean;
  requiresApproval: boolean;
  approvalRequired: boolean;
  notificationSettings: {
    notifyAdmin: boolean;
    notifyUser: boolean;
    notifyHR: boolean;
    emailTemplate: string;
    smsEnabled: boolean;
  };
  workflowSettings: {
    skipSteps: string[];
    customSteps: string[];
    priorityLevel: 'normal' | 'high' | 'urgent';
    timeoutDays: number;
  };
}

export interface TriggerLog {
  id: string;
  userId: string;
  triggerType: 'automatic' | 'manual';
  success: boolean;
  workflowSessionId?: string;
  error?: string;
  triggeredAt: Date;
  triggeredBy: string;
  processingTime: number;
  metadata?: any;
}

export class UserCreationTriggerService {
  private static readonly DEFAULT_CONFIG: TriggerConfiguration = {
    enabled: true,
    triggerRoles: ['Dispatcher', 'Broker Agent'],
    autoStart: true,
    requiresApproval: false,
    approvalRequired: false,
    notificationSettings: {
      notifyAdmin: true,
      notifyUser: true,
      notifyHR: true,
      emailTemplate: 'contractor_onboarding_welcome',
      smsEnabled: false
    },
    workflowSettings: {
      skipSteps: [],
      customSteps: [],
      priorityLevel: 'normal',
      timeoutDays: 30
    }
  };

  private static config: TriggerConfiguration = this.DEFAULT_CONFIG;
  private static triggerLogs: TriggerLog[] = [];

  /**
   * Main trigger function called when a user is created
   */
  static async onUserCreated(event: UserCreationEvent): Promise<TriggerLog> {
    const startTime = Date.now();
    const logEntry: TriggerLog = {
      id: this.generateLogId(),
      userId: event.userId,
      triggerType: 'automatic',
      success: false,
      triggeredAt: new Date(),
      triggeredBy: event.createdBy,
      processingTime: 0,
      metadata: {
        source: event.source,
        userRole: event.userData.role,
        userEmail: event.userData.email
      }
    };

    try {
      console.info(`🔄 User creation trigger fired for: ${event.userData.email} (${event.userData.role})`);

      // Check if trigger is enabled
      if (!this.config.enabled) {
        throw new Error('User creation trigger is disabled');
      }

      // Check if user role requires contractor onboarding
      if (!this.shouldTriggerOnboarding(event.userData.role)) {
        console.info(`⏭️ Skipping onboarding for role: ${event.userData.role}`);
        logEntry.success = true;
        logEntry.metadata.skipped = true;
        logEntry.metadata.reason = 'Role does not require contractor onboarding';
        return logEntry;
      }

      // Create workflow trigger data
      const workflowTrigger = await this.createWorkflowTrigger(event);

      // Check if approval is required
      if (this.config.requiresApproval) {
        await this.requestApproval(workflowTrigger);
        logEntry.success = true;
        logEntry.metadata.approvalRequested = true;
        return logEntry;
      }

      // Start contractor onboarding workflow
      const workflowSession = await ContractorWorkflowService.triggerOnboarding(workflowTrigger);
      
      logEntry.success = true;
      logEntry.workflowSessionId = workflowSession.id;
      logEntry.metadata.workflowStatus = workflowSession.status;

      // Send notifications
      await this.sendNotifications(event, workflowSession);

      console.info(`✅ Contractor onboarding triggered successfully for: ${event.userData.email}`);
      console.info(`📋 Workflow session ID: ${workflowSession.id}`);

    } catch (error: any) {
      console.error(`❌ Failed to trigger contractor onboarding for: ${event.userData.email}`, error);
      logEntry.error = error.message;
      logEntry.success = false;

      // Send error notifications
      await this.sendErrorNotifications(event, error);
    } finally {
      logEntry.processingTime = Date.now() - startTime;
      this.triggerLogs.push(logEntry);
    }

    return logEntry;
  }

  /**
   * Manually trigger contractor onboarding for a user
   */
  static async manualTrigger(userId: string, triggeredBy: string): Promise<TriggerLog> {
    const startTime = Date.now();
    const logEntry: TriggerLog = {
      id: this.generateLogId(),
      userId: userId,
      triggerType: 'manual',
      success: false,
      triggeredAt: new Date(),
      triggeredBy: triggeredBy,
      processingTime: 0,
      metadata: {
        source: 'manual_trigger'
      }
    };

    try {
      console.info(`🔄 Manual trigger fired for user: ${userId} by: ${triggeredBy}`);

      // Get user data (this would typically come from a database)
      const userData = await this.getUserData(userId);
      
      if (!userData) {
        throw new Error(`User not found: ${userId}`);
      }

      // Create user creation event
      const event: UserCreationEvent = {
        userId: userId,
        userData: userData,
        createdBy: triggeredBy,
        createdAt: new Date(),
        source: 'admin_panel'
      };

      // Create workflow trigger
      const workflowTrigger = await this.createWorkflowTrigger(event);

      // Start contractor onboarding workflow
      const workflowSession = await ContractorWorkflowService.triggerOnboarding(workflowTrigger);
      
      logEntry.success = true;
      logEntry.workflowSessionId = workflowSession.id;
      logEntry.metadata.workflowStatus = workflowSession.status;

      // Send notifications
      await this.sendNotifications(event, workflowSession);

      console.info(`✅ Manual contractor onboarding triggered for: ${userData.email}`);

    } catch (error: any) {
      console.error(`❌ Manual trigger failed for user: ${userId}`, error);
      logEntry.error = error.message;
      logEntry.success = false;
    } finally {
      logEntry.processingTime = Date.now() - startTime;
      this.triggerLogs.push(logEntry);
    }

    return logEntry;
  }

  /**
   * Check if user role should trigger contractor onboarding
   */
  private static shouldTriggerOnboarding(userRole: string): boolean {
    return this.config.triggerRoles.includes(userRole);
  }

  /**
   * Create workflow trigger data
   */
  private static async createWorkflowTrigger(event: UserCreationEvent): Promise<ContractorWorkflowTrigger> {
    const { userData } = event;

    // Generate user identifiers
    const userIdentifiers = UserIdentificationService.generateUserIdentifiers({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role as any,
      department: userData.department,
      hiredDate: userData.hiredDate,
      location: userData.location || 'Main Office'
    });

    return {
      userId: event.userId,
      userRole: userData.role as 'Dispatcher' | 'Broker Agent',
      triggerType: 'user_creation',
      userData: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        department: userData.department,
        hiredDate: userData.hiredDate,
        userIdentifiers: userIdentifiers
      },
      triggeredAt: new Date(),
      triggeredBy: event.createdBy
    };
  }

  /**
   * Request approval for contractor onboarding
   */
  private static async requestApproval(workflowTrigger: ContractorWorkflowTrigger): Promise<void> {
    // This would send approval request to administrators
    console.info(`📋 Approval requested for contractor onboarding: ${workflowTrigger.userData.email}`);
    
    // In a real implementation, this would:
    // 1. Create an approval request record
    // 2. Send email to administrators
    // 3. Create system notification
    // 4. Set up timeout for approval
  }

  /**
   * Send notifications for successful trigger
   */
  private static async sendNotifications(event: UserCreationEvent, workflowSession: any): Promise<void> {
    const { notificationSettings } = this.config;
    const { userData } = event;

    // Notify user
    if (notificationSettings.notifyUser) {
      await this.sendUserNotification(userData, workflowSession);
    }

    // Notify administrators
    if (notificationSettings.notifyAdmin) {
      await this.sendAdminNotification(userData, workflowSession);
    }

    // Notify HR
    if (notificationSettings.notifyHR) {
      await this.sendHRNotification(userData, workflowSession);
    }
  }

  /**
   * Send user notification
   */
  private static async sendUserNotification(userData: any, workflowSession: any): Promise<void> {
    const subject = 'Welcome to FleetFlow - Contractor Onboarding Started';
    const message = `
      Dear ${userData.firstName},

      Welcome to FleetFlow Transportation! Your contractor onboarding process has been automatically initiated.

      What's Next:
      1. Check your email for document signing links
      2. Complete the required training modules
      3. Set up your system access

      Your onboarding ID: ${workflowSession.id}

      If you have any questions, please contact our support team.

      Best regards,
      FleetFlow Transportation Team
    `;

    console.info(`📧 User notification sent to: ${userData.email}`);
    // In a real implementation, this would send actual email
  }

  /**
   * Send admin notification
   */
  private static async sendAdminNotification(userData: any, workflowSession: any): Promise<void> {
    const subject = 'New Contractor Onboarding Initiated';
    const message = `
      A new contractor onboarding process has been automatically initiated.

      User Details:
      - Name: ${userData.firstName} ${userData.lastName}
      - Email: ${userData.email}
      - Role: ${userData.role}
      - Department: ${userData.department}
      - Hired Date: ${userData.hiredDate}

      Workflow Session: ${workflowSession.id}
      Status: ${workflowSession.status}

      Monitor progress in the admin panel.
    `;

    console.info(`📧 Admin notification sent for: ${userData.email}`);
    // In a real implementation, this would send to admin users
  }

  /**
   * Send HR notification
   */
  private static async sendHRNotification(userData: any, workflowSession: any): Promise<void> {
    const subject = 'New Contractor Onboarding - HR Review Required';
    const message = `
      A new contractor onboarding process requires HR review.

      Contractor: ${userData.firstName} ${userData.lastName}
      Department: ${userData.department}
      Start Date: ${userData.hiredDate}

      Please review and approve the onboarding process.

      Workflow ID: ${workflowSession.id}
    `;

    console.info(`📧 HR notification sent for: ${userData.email}`);
    // In a real implementation, this would send to HR users
  }

  /**
   * Send error notifications
   */
  private static async sendErrorNotifications(event: UserCreationEvent, error: Error): Promise<void> {
    const subject = 'Contractor Onboarding Trigger Failed';
    const message = `
      Failed to trigger contractor onboarding for new user.

      User: ${event.userData.firstName} ${event.userData.lastName}
      Email: ${event.userData.email}
      Role: ${event.userData.role}
      
      Error: ${error.message}
      
      Please manually trigger the onboarding process.
    `;

    console.error(`📧 Error notification sent for: ${event.userData.email}`);
    // In a real implementation, this would send to system administrators
  }

  /**
   * Get user data (mock implementation)
   */
  private static async getUserData(userId: string): Promise<any> {
    // In a real implementation, this would fetch from database
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      role: 'Dispatcher',
      department: 'Operations',
      hiredDate: '2024-01-15',
      location: 'Main Office'
    };
  }

  /**
   * Update trigger configuration
   */
  static updateConfiguration(newConfig: Partial<TriggerConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.info('🔧 Trigger configuration updated:', this.config);
  }

  /**
   * Get current configuration
   */
  static getConfiguration(): TriggerConfiguration {
    return { ...this.config };
  }

  /**
   * Get trigger logs
   */
  static getTriggerLogs(limit: number = 50): TriggerLog[] {
    return this.triggerLogs
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get trigger statistics
   */
  static getStatistics(): {
    totalTriggers: number;
    successfulTriggers: number;
    failedTriggers: number;
    averageProcessingTime: number;
    triggersByRole: Record<string, number>;
    recentActivity: TriggerLog[];
  } {
    const logs = this.triggerLogs;
    const successful = logs.filter(log => log.success);
    const failed = logs.filter(log => !log.success);
    
    const triggersByRole: Record<string, number> = {};
    logs.forEach(log => {
      const role = log.metadata?.userRole || 'Unknown';
      triggersByRole[role] = (triggersByRole[role] || 0) + 1;
    });

    const averageProcessingTime = logs.length > 0 
      ? logs.reduce((sum, log) => sum + log.processingTime, 0) / logs.length 
      : 0;

    return {
      totalTriggers: logs.length,
      successfulTriggers: successful.length,
      failedTriggers: failed.length,
      averageProcessingTime: Math.round(averageProcessingTime),
      triggersByRole,
      recentActivity: logs.slice(-10)
    };
  }

  /**
   * Generate unique log ID
   */
  private static generateLogId(): string {
    return `TRG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Enable/disable trigger system
   */
  static setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    console.info(`🔧 Trigger system ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if trigger system is enabled
   */
  static isEnabled(): boolean {
    return this.config.enabled;
  }
}

export default UserCreationTriggerService 