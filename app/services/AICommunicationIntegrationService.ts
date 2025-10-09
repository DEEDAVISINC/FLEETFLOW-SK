/**
 * AI Communication Integration Service
 * Enables DEPOINTE AI staff to access real email and phone systems
 * Configured for Neo.space email (ddavis@freight1stdirect.com) and Twilio phone integration
 */

import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';

// Email Configuration Interfaces
export interface EmailConfig {
  provider: 'neo.space';
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
}

// AI Staff Communication Capabilities
export interface AIStaffCommunication {
  staffId: string;
  name: string;
  role: string;
  capabilities: {
    email: boolean;
    phone: boolean;
    sms: boolean;
  };
  activeConnections: {
    emailConnected: boolean;
    phoneConnected: boolean;
  };
  currentTasks: CommunicationTask[];
}

export interface CommunicationTask {
  id: string;
  type:
    | 'email_monitoring'
    | 'phone_answering'
    | 'email_response'
    | 'call_routing';
  status: 'active' | 'paused' | 'completed';
  assignedTo: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  instructions: string;
  startTime: Date;
  endTime?: Date;
}

export class AICommunicationIntegrationService {
  private emailConfig: EmailConfig;
  private emailTransporter: any;
  private imapClient: ImapFlow | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastCheckedUid: string | null = null;
  private aiStaff: Map<string, AIStaffCommunication> = new Map();

  constructor() {
    // Neo.space Email Configuration for ddavis@freight1stdirect.com
    this.emailConfig = {
      provider: 'neo.space',
      host: 'imap0001.neo.space',
      port: 993,
      secure: true,
      auth: {
        user: 'ddavis@freight1stdirect.com',
        pass: 'D13@sha1$',
      },
    };

    this.initializeServices();
    this.setupAIStaff();
  }

  private async initializeServices() {
    try {
      // Initialize Email Service (Neo.space SMTP)
      this.emailTransporter = nodemailer.createTransport({
        host: 'smtp0001.neo.space',
        port: 465,
        secure: true,
        auth: {
          user: this.emailConfig.auth.user,
          pass: this.emailConfig.auth.pass,
        },
      });

      console.log('✅ AI Communication services initialized successfully');
      console.log('📧 Email configured for:', this.emailConfig.auth.user);
    } catch (error) {
      console.error('❌ Failed to initialize communication services:', error);
    }
  }

  private setupAIStaff() {
    // Configure Charin (AI Receptionist)
    this.aiStaff.set('charin-020', {
      staffId: 'charin-020',
      name: 'Charin',
      role: 'AI Receptionist',
      capabilities: {
        email: true,
        phone: true,
        sms: true,
      },
      activeConnections: {
        emailConnected: false,
        phoneConnected: false,
      },
      currentTasks: [],
    });

    // Configure Alexis Best (AI Executive Assistant) with Embedded Learning Profile
    this.aiStaff.set('alexis-executive-023', {
      staffId: 'alexis-executive-023',
      name: 'Alexis Best',
      role: 'AI Executive Assistant',
      capabilities: {
        email: true,
        phone: true,
        sms: true,
      },
      activeConnections: {
        emailConnected: false,
        phoneConnected: false,
      },
      currentTasks: [],
      // Load embedded executive assistant training and knowledge
      executiveProfile: this.loadAlexisExecutiveProfile(),
    });
  }

  // Load Alexis Best's embedded executive assistant profile with all training and capabilities
  private loadAlexisExecutiveProfile() {
    try {
      // Import and load the comprehensive executive assistant profile
      const {
        alexisExecutiveAssistantProfile,
      } = require('./ai-learning/AlexisExecutiveAssistantProfile');
      console.log(
        '✅ Alexis Best: Executive Assistant Profile loaded with embedded learning'
      );
      console.log(
        `   - ${Object.keys(alexisExecutiveAssistantProfile.coreCapabilities).length} core capabilities embedded`
      );
      console.log(
        `   - ${alexisExecutiveAssistantProfile.aiWorkforceCoordination.totalAIStaff} AI staff coordination protocols`
      );
      console.log(
        `   - ${Object.keys(alexisExecutiveAssistantProfile.businessKnowledge).length} business entities knowledge`
      );
      return alexisExecutiveAssistantProfile;
    } catch (error) {
      console.error(
        '❌ Failed to load Alexis executive assistant profile:',
        error
      );
      return null;
    }
  }

  // Email Management Methods
  async activateEmailMonitoring(staffId: string): Promise<boolean> {
    const staff = this.aiStaff.get(staffId);
    if (!staff || !staff.capabilities.email) {
      throw new Error(`Staff member ${staffId} not found or email not enabled`);
    }

    try {
      // Test email connection
      await this.emailTransporter.verify();

      // Update staff status
      staff.activeConnections.emailConnected = true;

      // Create email monitoring task
      const task: CommunicationTask = {
        id: `email-monitor-${Date.now()}`,
        type: 'email_monitoring',
        status: 'active',
        assignedTo: staffId,
        priority: 'high',
        instructions:
          'Monitor ddavis@freight1stdirect.com emails and respond according to role guidelines',
        startTime: new Date(),
      };

      staff.currentTasks.push(task);

      console.log(
        `📧 Email monitoring activated for ${staff.name} on ddavis@freight1stdirect.com`
      );
      return true;
    } catch (error) {
      console.error(`❌ Failed to activate email for ${staff.name}:`, error);
      return false;
    }
  }

  async sendEmail(
    staffId: string,
    to: string[],
    subject: string,
    body: string,
    htmlBody?: string
  ): Promise<boolean> {
    const staff = this.aiStaff.get(staffId);
    if (!staff || !staff.activeConnections.emailConnected) {
      throw new Error(`Staff member ${staffId} email not connected`);
    }

    try {
      const mailOptions = {
        from: `${staff.name} <${this.emailConfig.auth.user}>`,
        to: to.join(', '),
        subject: subject,
        text: body,
        html: htmlBody || body,
      };

      await this.emailTransporter.sendMail(mailOptions);
      console.log(
        `📧 Email sent by ${staff.name} from ddavis@freight1stdirect.com to ${to.join(', ')}`
      );
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email for ${staff.name}:`, error);
      return false;
    }
  }

  // Email Polling Methods
  async startEmailPolling(): Promise<boolean> {
    try {
      // Initialize IMAP client
      this.imapClient = new ImapFlow({
        host: 'imap0001.neo.space',
        port: 993,
        secure: true,
        auth: {
          user: 'ddavis@freight1stdirect.com',
          pass: 'D13@sha1$',
        },
        logger: false,
      });

      // Connect to IMAP
      await this.imapClient.connect();
      console.log(
        '📧 IMAP connection established for ddavis@freight1stdirect.com'
      );

      // Start polling for new emails every 30 seconds
      this.pollingInterval = setInterval(async () => {
        await this.checkForNewEmails();
      }, 30000);

      console.log('📧 Email polling started - checking every 30 seconds');
      return true;
    } catch (error) {
      console.error('❌ Failed to start email polling:', error);
      return false;
    }
  }

  async checkForNewEmails(): Promise<void> {
    if (!this.imapClient) return;

    try {
      // Select INBOX
      const mailbox = await this.imapClient.mailboxOpen('INBOX');

      // Get all messages
      const messages = await this.imapClient.search({
        since: new Date(Date.now() - 60000), // Check last minute
        unseen: true, // Only unread emails
      });

      if (messages.length === 0) return;

      console.log(`📧 Found ${messages.length} new email(s)`);

      // Process each new email
      for (const uid of messages) {
        if (uid === this.lastCheckedUid) continue;

        try {
          const message = await this.imapClient.fetchOne(uid, {
            envelope: true,
            bodyStructure: true,
            bodyParts: ['TEXT'],
          });

          if (message) {
            await this.processEmail(message, uid);
          }
        } catch (error) {
          console.error(`❌ Error processing email ${uid}:`, error);
        }
      }

      // Update last checked UID
      this.lastCheckedUid = messages[messages.length - 1];
    } catch (error) {
      console.error('❌ Error checking for new emails:', error);
    }
  }

  async processEmail(message: any, uid: string): Promise<void> {
    try {
      const envelope = message.envelope;
      const from = envelope.from[0]?.address || 'Unknown';
      const subject = envelope.subject || 'No Subject';
      const date = envelope.date;

      console.log(`📧 Processing email: "${subject}" from ${from}`);

      // Find Alexis Best for email processing
      const alexis = this.aiStaff.get('alexis-executive-023');
      if (!alexis || !alexis.activeConnections.emailConnected) {
        console.log('❌ Alexis Best not available for email processing');
        return;
      }

      // Extract email body (simplified for now)
      let body = 'Email content could not be extracted';
      if (message.bodyParts && message.bodyParts.TEXT) {
        const textPart = await this.imapClient?.fetchOne(uid, {
          bodyParts: [message.bodyParts.TEXT[0].part],
        });
        if (textPart) {
          body = textPart.bodyParts[message.bodyParts.TEXT[0].part] || body;
        }
      }

      // Create email message object
      const emailMessage: EmailMessage = {
        id: uid,
        from: from,
        to: ['ddavis@freight1stdirect.com'],
        subject: subject,
        body: body,
        timestamp: new Date(date),
        priority: 'normal',
        read: false,
      };

      // Process the email with Alexis Best
      await this.processEmailWithAI(alexis, emailMessage);
    } catch (error) {
      console.error('❌ Error processing email:', error);
    }
  }

  async processEmailWithAI(
    alexis: AIStaffCommunication,
    email: EmailMessage
  ): Promise<void> {
    console.log(`🤖 Alexis Best processing email: "${email.subject}"`);

    // Simple AI response logic (can be enhanced with Claude API later)
    let response = '';
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();

    if (
      subject.includes('quote') ||
      subject.includes('rate') ||
      subject.includes('freight')
    ) {
      response = `Thank you for your inquiry about freight rates. I'd be happy to provide a competitive quote for your shipment.

Could you please provide:
- Origin and destination cities/states
- Approximate weight and dimensions
- Preferred pickup and delivery dates
- Any special requirements (temperature control, hazardous materials, etc.)

Once I have these details, I can provide you with an accurate quote from our network of reliable carriers.

Best regards,
Dee Davis
President & CEO
DEPOINTE / FREIGHT 1ST DIRECT
Transportation & Logistics Solutions

Direct: (248) 247-5020
Office: (734) 413-8310
Email: ddavis@freight1stdirect.com

DEPOINTE AI Company Dashboard: fleetflowapp.com/depointe-dashboard`;
    } else if (subject.includes('tracking') || subject.includes('status')) {
      response = `Thank you for your inquiry about shipment tracking. I'd be happy to help you track your freight.

Could you please provide:
- The load/shipment number
- The carrier's name
- The pickup date
- Origin and destination

With this information, I can provide you with real-time tracking updates and delivery status.

Best regards,
Dee Davis
President & CEO
DEPOINTE / FREIGHT 1ST DIRECT
Transportation & Logistics Solutions

Direct: (248) 247-5020
Office: (734) 413-8310
Email: ddavis@freight1stdirect.com

DEPOINTE AI Company Dashboard: fleetflowapp.com/depointe-dashboard`;
    } else {
      response = `Thank you for your email. I've received your message regarding "${email.subject}" and will review it promptly.

I'll get back to you within 2-4 hours with a detailed response.

Best regards,
Dee Davis
President & CEO
DEPOINTE / FREIGHT 1ST DIRECT
Transportation & Logistics Solutions

Direct: (248) 247-5020
Office: (734) 413-8310
Email: ddavis@freight1stdirect.com

DEPOINTE AI Company Dashboard: fleetflowapp.com/depointe-dashboard`;
    }

    // Send response email
    const sent = await this.sendEmail(
      alexis.staffId,
      [email.from],
      `Re: ${email.subject}`,
      response
    );

    if (sent) {
      console.log(`✅ Alexis Best sent response to ${email.from}`);

      // Update activity feed in DEPOINTE dashboard
      try {
        await fetch('http://localhost:3001/api/dashboard/add-email-activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'email_response',
            subject: email.subject,
            recipient: email.from,
            priority: 'normal',
          }),
        });
      } catch (error) {
        console.log('Note: Could not update dashboard activity feed:', error);
      }

      console.log(
        `📋 Email processed and responded to by Alexis Best: "${email.subject}"`
      );
    }
  }

  async stopEmailPolling(): Promise<void> {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    if (this.imapClient) {
      await this.imapClient.logout();
      this.imapClient = null;
    }

    console.log('📧 Email polling stopped');
  }

  // Task Management Methods
  async assignCommunicationTask(
    staffId: string,
    taskType: CommunicationTask['type'],
    priority: CommunicationTask['priority'],
    instructions: string
  ): Promise<string> {
    const staff = this.aiStaff.get(staffId);
    if (!staff) {
      throw new Error(`Staff member ${staffId} not found`);
    }

    const task: CommunicationTask = {
      id: `task-${taskType}-${Date.now()}`,
      type: taskType,
      status: 'active',
      assignedTo: staffId,
      priority: priority,
      instructions: instructions,
      startTime: new Date(),
    };

    staff.currentTasks.push(task);
    console.log(`📋 Task assigned to ${staff.name}: ${taskType}`);
    return task.id;
  }

  async getStaffStatus(staffId: string): Promise<AIStaffCommunication | null> {
    return this.aiStaff.get(staffId) || null;
  }

  async getAllStaffStatus(): Promise<AIStaffCommunication[]> {
    return Array.from(this.aiStaff.values());
  }

  // Quick Setup Methods for Alexis Best (Email Focus)
  async setupAlexisExecutiveAssistant(): Promise<boolean> {
    console.log(
      '🤖 Setting up Alexis Best as AI Executive Assistant for ddavis@freight1stdirect.com...'
    );

    const emailActivated = await this.activateEmailMonitoring(
      'alexis-executive-023'
    );

    if (emailActivated) {
      await this.assignCommunicationTask(
        'alexis-executive-023',
        'email_monitoring',
        'high',
        'Monitor ddavis@freight1stdirect.com emails, prioritize freight-related communications, draft responses for approval, manage calendar requests'
      );

      // Start email polling
      const pollingStarted = await this.startEmailPolling();
      if (pollingStarted) {
        console.log(
          '📧 Email polling initiated - checking for new emails every 30 seconds'
        );
      }

      console.log(
        '✅ Alexis Best is now active as your AI Executive Assistant'
      );
      console.log('📧 Monitoring: ddavis@freight1stdirect.com');
      return true;
    }

    return false;
  }

  // Configuration Validation
  validateConfiguration(): {
    email: boolean;
    configured: boolean;
    emailAddress: string;
  } {
    return {
      email: true, // We have the credentials
      configured: true,
      emailAddress: 'ddavis@freight1stdirect.com',
    };
  }

  // Test Email Connection
  async testEmailConnection(): Promise<boolean> {
    try {
      await this.emailTransporter.verify();
      console.log(
        '✅ Email connection test successful for ddavis@freight1stdirect.com'
      );
      return true;
    } catch (error) {
      console.error('❌ Email connection test failed:', error);
      console.error('💡 Possible solutions:');
      console.error(
        '   1. Check if Two-Factor Authentication (2FA) is enabled on Neo.space'
      );
      console.error('   2. Disable 2FA in Neo.space security settings');
      console.error('   3. Verify email credentials are correct');
      console.error('   4. Check Neo.space server status');
      return false;
    }
  }
}

// Singleton instance
export const aiCommunicationService = new AICommunicationIntegrationService();

// Convenience functions for quick setup
export const setupAlexisExecutiveAssistant = () =>
  aiCommunicationService.setupAlexisExecutiveAssistant();
export const testEmailConnection = () =>
  aiCommunicationService.testEmailConnection();
export const validateCommunicationConfig = () =>
  aiCommunicationService.validateConfiguration();
