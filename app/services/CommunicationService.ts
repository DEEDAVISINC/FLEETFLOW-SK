import nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

// Communication interfaces
export interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  replyTo?: string;
  fromName?: string;
}

export interface SMSMessage {
  to: string;
  message: string;
  mediaUrls?: string[];
}

export interface VoiceCall {
  to: string;
  script: string;
  voiceId?: string;
  callbackUrl?: string;
}

export interface SocialMediaPost {
  platform: 'facebook' | 'linkedin' | 'instagram' | 'manual';
  content: string;
  mediaUrls?: string[];
  targetAudience?: any;
}

export interface CommunicationResult {
  success: boolean;
  messageId?: string;
  callId?: string;
  postId?: string;
  error?: string;
  timestamp: Date;
  channel: 'email' | 'sms' | 'voice' | 'social_media';
  recipientCount: number;
  cost?: number;
}

export class CommunicationService {
  private twilioClient?: Twilio;
  private emailTransporter?: nodemailer.Transporter;

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Initialize Twilio
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

    if (twilioAccountSid && twilioAuthToken) {
      this.twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
    }

    // Initialize Email Service (SMTP)
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.emailTransporter = nodemailer.createTransporter(emailConfig);
    }
  }

  // Email Communication
  async sendEmail(
    message: EmailMessage,
    tenantId: string,
    agentId: string
  ): Promise<CommunicationResult> {
    try {
      if (!this.emailTransporter) {
        throw new Error('Email service not configured');
      }

      // Check rate limits
      await this.checkRateLimit(tenantId, 'email');

      const recipients = Array.isArray(message.to) ? message.to : [message.to];
      const ccRecipients = Array.isArray(message.cc)
        ? message.cc
        : message.cc
          ? [message.cc]
          : [];
      const bccRecipients = Array.isArray(message.bcc)
        ? message.bcc
        : message.bcc
          ? [message.bcc]
          : [];

      const totalRecipients =
        recipients.length + ccRecipients.length + bccRecipients.length;

      const mailOptions = {
        from: message.fromName
          ? `${message.fromName} <${process.env.SMTP_USER}>`
          : process.env.SMTP_USER,
        to: recipients.join(', '),
        cc: ccRecipients.length > 0 ? ccRecipients.join(', ') : undefined,
        bcc: bccRecipients.length > 0 ? bccRecipients.join(', ') : undefined,
        replyTo: message.replyTo,
        subject: message.subject,
        html: message.htmlContent,
        text: message.textContent || this.htmlToText(message.htmlContent),
        attachments: message.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      };

      const result = await this.emailTransporter.sendMail(mailOptions);

      // Record usage
      await this.recordUsage(tenantId, 'email', totalRecipients);

      // Log the communication
      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'email',
        recipients: recipients.concat(ccRecipients, bccRecipients),
        content: message.htmlContent,
        subject: message.subject,
        messageId: result.messageId,
        success: true,
        timestamp: new Date(),
      });

      return {
        success: true,
        messageId: result.messageId,
        timestamp: new Date(),
        channel: 'email',
        recipientCount: totalRecipients,
        cost: this.calculateEmailCost(totalRecipients),
      };
    } catch (error) {
      console.error('Error sending email:', error);

      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'email',
        recipients: Array.isArray(message.to) ? message.to : [message.to],
        content: message.htmlContent,
        subject: message.subject,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        channel: 'email',
        recipientCount: 0,
      };
    }
  }

  // SMS Communication
  async sendSMS(
    message: SMSMessage,
    tenantId: string,
    agentId: string
  ): Promise<CommunicationResult> {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio SMS service not configured');
      }

      // Check rate limits
      await this.checkRateLimit(tenantId, 'sms');

      const messageOptions: any = {
        body: message.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: message.to,
      };

      if (message.mediaUrls && message.mediaUrls.length > 0) {
        messageOptions.mediaUrl = message.mediaUrls;
      }

      const result = await this.twilioClient.messages.create(messageOptions);

      // Record usage
      await this.recordUsage(tenantId, 'sms', 1);

      // Log the communication
      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'sms',
        recipients: [message.to],
        content: message.message,
        messageId: result.sid,
        success: true,
        timestamp: new Date(),
      });

      return {
        success: true,
        messageId: result.sid,
        timestamp: new Date(),
        channel: 'sms',
        recipientCount: 1,
        cost: this.calculateSMSCost(),
      };
    } catch (error) {
      console.error('Error sending SMS:', error);

      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'sms',
        recipients: [message.to],
        content: message.message,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        channel: 'sms',
        recipientCount: 0,
      };
    }
  }

  // Voice Communication
  async makeCall(
    call: VoiceCall,
    tenantId: string,
    agentId: string
  ): Promise<CommunicationResult> {
    try {
      if (!this.twilioClient) {
        throw new Error('Twilio Voice service not configured');
      }

      // Check rate limits
      await this.checkRateLimit(tenantId, 'call');

      // Create TwiML for the call script
      const twiml = this.generateTwiML(call.script);

      const callOptions = {
        twiml: twiml,
        to: call.to,
        from: process.env.TWILIO_PHONE_NUMBER,
        statusCallback: call.callbackUrl,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
      };

      const result = await this.twilioClient.calls.create(callOptions);

      // Record usage
      await this.recordUsage(tenantId, 'call', 1);

      // Log the communication
      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'voice',
        recipients: [call.to],
        content: call.script,
        messageId: result.sid,
        success: true,
        timestamp: new Date(),
      });

      return {
        success: true,
        callId: result.sid,
        timestamp: new Date(),
        channel: 'voice',
        recipientCount: 1,
        cost: this.calculateCallCost(),
      };
    } catch (error) {
      console.error('Error making call:', error);

      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'voice',
        recipients: [call.to],
        content: call.script,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        channel: 'voice',
        recipientCount: 0,
      };
    }
  }

  // Social Media Communication
  async postToSocialMedia(
    post: SocialMediaPost,
    tenantId: string,
    agentId: string
  ): Promise<CommunicationResult> {
    try {
      // Check rate limits
      await this.checkRateLimit(tenantId, 'social_post');

      let result: any;

      switch (post.platform) {
        case 'facebook':
          result = await this.postToFacebook(post);
          break;
        case 'linkedin':
          result = await this.postToLinkedIn(post);
          break;
        case 'instagram':
          result = await this.postToInstagram(post);
          break;
        case 'manual':
          result = await this.handleManualPost(post);
          break;
        default:
          throw new Error(`Unsupported platform: ${post.platform}`);
      }

      // Record usage
      await this.recordUsage(tenantId, 'social_post', 1);

      // Log the communication
      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'social_media',
        recipients: [post.platform],
        content: post.content,
        messageId: result.id,
        success: true,
        timestamp: new Date(),
      });

      return {
        success: true,
        postId: result.id,
        timestamp: new Date(),
        channel: 'social_media',
        recipientCount: 1,
        cost: this.calculateSocialMediaCost(),
      };
    } catch (error) {
      console.error('Error posting to social media:', error);

      await this.logCommunication({
        tenantId,
        agentId,
        channel: 'social_media',
        recipients: [post.platform],
        content: post.content,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        channel: 'social_media',
        recipientCount: 0,
      };
    }
  }

  // Helper methods
  private generateTwiML(script: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="${process.env.TWILIO_VOICE || 'alice'}">${script}</Say>
    <Record timeout="30" transcribe="true" transcribeCallback="${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/transcription"/>
</Response>`;
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  private async postToFacebook(post: SocialMediaPost): Promise<{ id: string }> {
    // Facebook Graph API integration
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    if (!accessToken || !pageId) {
      throw new Error('Facebook API not configured');
    }

    const response = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: post.content,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    return await response.json();
  }

  private async postToLinkedIn(post: SocialMediaPost): Promise<{ id: string }> {
    // LinkedIn API integration
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const personId = process.env.LINKEDIN_PERSON_ID;

    if (!accessToken || !personId) {
      throw new Error('LinkedIn API not configured');
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: `urn:li:person:${personId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const result = await response.json();
    return { id: result.id };
  }

  private async postToInstagram(
    post: SocialMediaPost
  ): Promise<{ id: string }> {
    // Instagram Graph API integration
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      throw new Error(
        'Instagram API not configured - Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID'
      );
    }

    // First, create a media object
    const mediaResponse = await fetch(
      `https://graph.instagram.com/${accountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url:
            post.mediaUrls?.[0] ||
            'https://via.placeholder.com/1080x1080/22c55e/ffffff?text=FleetFlow', // Default image if no media
          caption: post.content,
          access_token: accessToken,
        }),
      }
    );

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.text();
      throw new Error(
        `Instagram media creation failed: ${mediaResponse.status} - ${errorData}`
      );
    }

    const mediaData = await mediaResponse.json();
    const mediaId = mediaData.id;

    // Then, publish the media
    const publishResponse = await fetch(
      `https://graph.instagram.com/${accountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: mediaId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.text();
      throw new Error(
        `Instagram publish failed: ${publishResponse.status} - ${errorData}`
      );
    }

    const publishData = await publishResponse.json();
    return { id: publishData.id };
  }

  private async handleManualPost(
    post: SocialMediaPost
  ): Promise<{ id: string }> {
    // Manual posting - just log the content for manual execution
    console.log('📝 Manual Post Content Generated:');
    console.log('Platform:', 'Choose platform manually');
    console.log('Content:', post.content);
    if (post.mediaUrls?.length) {
      console.log('Media URLs:', post.mediaUrls);
    }
    console.log('Target Audience:', post.targetAudience);

    // Generate a unique ID for tracking
    const manualId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return { id: manualId };
  }

  private async checkRateLimit(tenantId: string, type: string): Promise<void> {
    // Implementation would check database rate limits
    // For now, just log the check
    console.info(`Checking rate limit for tenant ${tenantId}, type ${type}`);
  }

  private async recordUsage(
    tenantId: string,
    type: string,
    count: number
  ): Promise<void> {
    // Implementation would record usage in database
    console.info(`Recording usage for tenant ${tenantId}: ${count} ${type}(s)`);
  }

  private async logCommunication(logData: {
    tenantId: string;
    agentId: string;
    channel: string;
    recipients: string[];
    content: string;
    subject?: string;
    messageId?: string;
    success: boolean;
    error?: string;
    timestamp: Date;
  }): Promise<void> {
    // Implementation would log to conversation_logs table
    console.info('Logging communication:', logData);
  }

  private calculateEmailCost(recipientCount: number): number {
    // Example pricing: $0.001 per email
    return recipientCount * 0.001;
  }

  private calculateSMSCost(): number {
    // Example pricing: $0.0075 per SMS
    return 0.0075;
  }

  private calculateCallCost(): number {
    // Example pricing: $0.013 per minute (estimate 2 minutes average)
    return 0.013 * 2;
  }

  private calculateSocialMediaCost(): number {
    // Example pricing: $0.01 per post
    return 0.01;
  }

  // Public method to get communication history
  async getCommunicationHistory(
    tenantId: string,
    agentId?: string,
    channel?: string,
    limit: number = 50
  ): Promise<any[]> {
    // Implementation would query conversation_logs table
    console.info(`Getting communication history for tenant ${tenantId}`);
    return [];
  }

  // Public method to get communication statistics
  async getCommunicationStats(
    tenantId: string,
    agentId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalEmails: number;
    totalSMS: number;
    totalCalls: number;
    totalSocialPosts: number;
    totalCost: number;
    successRate: number;
  }> {
    // Implementation would aggregate from conversation_logs table
    console.info(`Getting communication stats for tenant ${tenantId}`);

    return {
      totalEmails: 0,
      totalSMS: 0,
      totalCalls: 0,
      totalSocialPosts: 0,
      totalCost: 0,
      successRate: 0,
    };
  }
}
