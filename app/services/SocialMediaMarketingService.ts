import { CommunicationService } from './CommunicationService';

export interface MarketingCampaign {
  id: string;
  name: string;
  content: string;
  targetAudience: string;
  hashtags: string[];
  platform: 'facebook' | 'linkedin' | 'instagram' | 'manual';
  schedule?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
}

export interface MarketingPost {
  campaignId: string;
  content: string;
  mediaUrls?: string[];
  hashtags: string[];
  targetAudience: string;
  complianceLabel?: string;
}

export class SocialMediaMarketingService {
  private communicationService: CommunicationService;

  constructor() {
    this.communicationService = new CommunicationService();
  }

  // Social Media Marketing Compliance Features
  private readonly COMPLIANCE_RULES = {
    maxPostsPerHour: 2, // Conservative rate limiting for remaining platforms
    requiredDisclosure: true,
    maxHashtags: 3,
    minIntervalMinutes: 60, // Minimum 1 hour between posts
    businessHoursOnly: true, // Only post during business hours
  };

  async scheduleMarketingPost(
    campaign: MarketingCampaign,
    tenantId: string,
    agentId: string
  ): Promise<{ success: boolean; postId?: string; scheduledFor?: Date }> {
    try {
      // Validate compliance before posting
      await this.validateCompliance(campaign);

      // Check rate limits
      await this.checkMarketingRateLimit(tenantId);

      const post: MarketingPost = {
        campaignId: campaign.id,
        content: this.formatMarketingContent(campaign),
        hashtags: campaign.hashtags,
        targetAudience: campaign.targetAudience,
        complianceLabel: '🤖 FleetFlow AI Marketing',
      };

      // Post to social media (Facebook/LinkedIn/Instagram)
      const result = await this.communicationService.postToSocialMedia(
        {
          platform: campaign.platform,
          content: post.content,
          targetAudience: post.targetAudience,
          mediaUrls: post.mediaUrls,
        },
        tenantId,
        agentId
      );

      // Log the marketing post
      await this.logMarketingPost({
        campaignId: campaign.id,
        tenantId,
        agentId,
        platform: campaign.platform,
        content: post.content,
        postId: result.postId,
        status: 'posted',
        timestamp: new Date(),
      });

      return {
        success: true,
        postId: result.postId,
      };
    } catch (error) {
      console.error('Marketing post failed:', error);

      // Log failed post
      await this.logMarketingPost({
        campaignId: campaign.id,
        tenantId,
        agentId,
        platform: campaign.platform,
        content: campaign.content,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      });

      return {
        success: false,
      };
    }
  }

  private async validateCompliance(campaign: MarketingCampaign): Promise<void> {
    // Check content length
    if (campaign.content.length > 280) {
      throw new Error('Post content exceeds X/Twitter 280 character limit');
    }

    // Validate hashtags
    if (campaign.hashtags.length > this.COMPLIANCE_RULES.maxHashtags) {
      throw new Error(
        `Too many hashtags. Maximum allowed: ${this.COMPLIANCE_RULES.maxHashtags}`
      );
    }

    // Check business hours (if enabled)
    if (this.COMPLIANCE_RULES.businessHoursOnly) {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 8 || hour > 18) {
        // 8 AM to 6 PM
        throw new Error(
          'Posting outside business hours. Social media compliance requires business hours posting.'
        );
      }
    }
  }

  private async checkMarketingRateLimit(tenantId: string): Promise<void> {
    // Check recent posts to ensure we're not exceeding rate limits
    const recentPosts = await this.getRecentPosts(tenantId, 60); // Last 60 minutes

    if (recentPosts.length >= this.COMPLIANCE_RULES.maxPostsPerHour) {
      throw new Error(
        `Rate limit exceeded. Maximum ${this.COMPLIANCE_RULES.maxPostsPerHour} posts per hour.`
      );
    }
  }

  private formatMarketingContent(campaign: MarketingCampaign): string {
    let content = campaign.content;

    // Add hashtags for supported platforms
    if (campaign.hashtags.length > 0) {
      content += '\n\n' + campaign.hashtags.map((tag) => `#${tag}`).join(' ');
    }

    // Add compliance disclosure
    if (this.COMPLIANCE_RULES.requiredDisclosure) {
      content += '\n\n🤖 FleetFlow AI Marketing';
    }

    return content;
  }

  private async getRecentPosts(
    tenantId: string,
    minutes: number
  ): Promise<any[]> {
    // Implementation would query marketing_posts table
    // For now, return empty array
    return [];
  }

  private async logMarketingPost(logData: {
    campaignId: string;
    tenantId: string;
    agentId: string;
    platform: string;
    content: string;
    postId?: string;
    status: string;
    error?: string;
    timestamp: Date;
  }): Promise<void> {
    // Implementation would log to marketing_posts table
    console.info('Marketing post logged:', logData);
  }

  // Get marketing analytics
  async getMarketingAnalytics(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalPosts: number;
    engagement: number;
    successRate: number;
    topPerformingContent: string[];
  }> {
    // Implementation would aggregate from marketing_posts and analytics tables
    return {
      totalPosts: 0,
      engagement: 0,
      successRate: 0,
      topPerformingContent: [],
    };
  }
}
