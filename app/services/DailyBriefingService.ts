/**
 * Daily Briefing Generator Service
 * Generates personalized morning briefings with Claude AI assistance
 * Integrates with FleetFlow's notification system
 */

import { ClaudeAIService } from '@/lib/claude-ai-service';
import {
  NotificationService,
  notificationService,
} from './NotificationService';

export interface DailyBriefingData {
  topPriorities: PriorityItem[];
  meetings: MeetingItem[];
  followUps: FollowUpItem[];
  strategicQuestions: StrategicQuestion[];
  successDefinition: string;
  userContext: UserContext;
}

export interface PriorityItem {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  urgency: 'low' | 'medium' | 'high';
  category: string;
  dependencies?: string[];
}

export interface MeetingItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  participants: string[];
  location: string;
  prepNotes: string[];
  outcomes?: string[];
}

export interface FollowUpItem {
  id: string;
  description: string;
  originalContext: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  relatedEntity?: {
    type: string;
    id: string;
    url: string;
  };
}

export interface StrategicQuestion {
  question: string;
  context: string;
  importance: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface UserContext {
  userId: string;
  tenantId: string;
  role: string;
  department: string;
  currentProjects: string[];
  recentActivities: ActivityItem[];
  preferences: BriefingPreferences;
}

export interface ActivityItem {
  id: string;
  type: 'task_completed' | 'meeting_held' | 'issue_resolved' | 'deal_closed';
  description: string;
  timestamp: Date;
  impact: 'low' | 'medium' | 'high';
}

export interface BriefingPreferences {
  briefingTime: string; // "08:00" format
  includeWeekends: boolean;
  focusAreas: string[];
  notificationChannels: ('in-app' | 'email' | 'sms')[];
  tone: 'professional' | 'casual' | 'motivational';
  length: 'brief' | 'standard' | 'detailed';
}

export class DailyBriefingService {
  private claudeService: ClaudeAIService;
  private notificationService: NotificationService;

  constructor() {
    // Initialize Claude service with existing system configuration
    this.claudeService = new ClaudeAIService();
    this.notificationService = notificationService;
  }

  /**
   * Generate a personalized daily briefing for a user
   */
  async generateDailyBriefing(
    userId: string,
    tenantId: string
  ): Promise<DailyBriefingData> {
    console.info(`📋 Generating daily briefing for user: ${userId}`);

    try {
      // Gather user context
      const userContext = await this.gatherUserContext(userId, tenantId);

      // Generate briefing sections
      const briefingData: DailyBriefingData = {
        topPriorities: await this.generateTopPriorities(userContext),
        meetings: await this.generateMeetings(userContext),
        followUps: await this.generateFollowUps(userContext),
        strategicQuestions: await this.generateStrategicQuestions(userContext),
        successDefinition: await this.generateSuccessDefinition(userContext),
        userContext,
      };

      console.info(
        `✅ Daily briefing generated successfully for user: ${userId}`
      );
      return briefingData;
    } catch (error) {
      console.error('❌ Error generating daily briefing:', error);

      // Return a basic fallback briefing
      return this.generateFallbackBriefing(userId, tenantId);
    }
  }

  /**
   * Send daily briefing via notification system
   */
  async sendDailyBriefing(briefingData: DailyBriefingData): Promise<void> {
    const { userContext } = briefingData;

    // Format briefing as notification
    const briefingMessage = this.formatBriefingMessage(briefingData);

    const notification = {
      type: 'system' as const,
      title: '🌅 Your Daily Briefing',
      message: briefingMessage,
      priority: 'medium' as const,
      userId: userContext.userId,
      tenantId: userContext.tenantId,
      category: 'daily_briefing',
      channels: userContext.preferences.notificationChannels,
      data: {
        briefingData,
        generatedAt: new Date().toISOString(),
      },
      actions: [
        {
          id: 'view_full_briefing',
          label: 'View Full Briefing',
          type: 'modal' as const,
          payload: { modal: 'daily_briefing', briefingData },
          style: 'primary' as const,
          icon: '📋',
        },
        {
          id: 'schedule_briefing_time',
          label: 'Adjust Briefing Time',
          type: 'navigate' as const,
          payload: { url: '/settings/briefing-preferences' },
          style: 'secondary' as const,
          icon: '⚙️',
        },
      ],
    };

    await this.notificationService.sendNotification(notification);
  }

  /**
   * Schedule daily briefings for users
   */
  async scheduleDailyBriefing(
    userId: string,
    tenantId: string,
    scheduleTime: string = '08:00'
  ): Promise<void> {
    console.info(
      `⏰ Scheduling daily briefing for user: ${userId} at ${scheduleTime}`
    );

    // Calculate next briefing time
    const now = new Date();
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const nextBriefing = new Date(now);
    nextBriefing.setHours(hours, minutes, 0, 0);

    // If briefing time has passed today, schedule for tomorrow
    if (nextBriefing <= now) {
      nextBriefing.setDate(nextBriefing.getDate() + 1);
    }

    const briefingData = await this.generateDailyBriefing(userId, tenantId);
    await this.sendDailyBriefing(briefingData);

    console.info(
      `✅ Daily briefing scheduled for: ${nextBriefing.toISOString()}`
    );
  }

  private async gatherUserContext(
    userId: string,
    tenantId: string
  ): Promise<UserContext> {
    // In a real implementation, this would fetch from your database
    // For now, return mock context
    return {
      userId,
      tenantId,
      role: 'dispatcher',
      department: 'Operations',
      currentProjects: [
        'Q4 Load Optimization',
        'Carrier Onboarding Automation',
        'Route Planning Enhancement',
      ],
      recentActivities: [
        {
          id: 'activity_1',
          type: 'task_completed',
          description: 'Completed carrier compliance review for 15 carriers',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          impact: 'high',
        },
        {
          id: 'activity_2',
          type: 'meeting_held',
          description:
            'Team standup meeting - discussed load optimization metrics',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          impact: 'medium',
        },
      ],
      preferences: {
        briefingTime: '08:00',
        includeWeekends: false,
        focusAreas: ['operations', 'compliance', 'optimization'],
        notificationChannels: ['in-app'],
        tone: 'professional',
        length: 'standard',
      },
    };
  }

  private async generateTopPriorities(
    userContext: UserContext
  ): Promise<PriorityItem[]> {
    try {
      const prompt = `Generate 3-5 top priorities for a ${userContext.role} in the ${userContext.department} department of a freight brokerage company.

Context:
- Current projects: ${userContext.currentProjects.join(', ')}
- Recent activities: ${userContext.recentActivities.map((a) => a.description).join('; ')}
- Focus areas: ${userContext.preferences.focusAreas.join(', ')}

Each priority should include:
- Title
- Description (2-3 sentences)
- Estimated time (e.g., "2 hours", "30 minutes")
- Urgency level (low/medium/high)
- Category
- Dependencies (if any)

Format as JSON array of priority objects.`;

      const response = await this.claudeService.generateResponse(prompt);

      if (response) {
        try {
          // Claude might return the JSON with some extra text, so we need to extract just the JSON part
          const jsonMatch = response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          return JSON.parse(response);
        } catch (parseError) {
          console.warn(
            'Failed to parse Claude response as JSON, using fallback:',
            parseError
          );
        }
      }
    } catch (error) {
      console.error('Error generating priorities with Claude:', error);
    }

    return this.generateMockPriorities(userContext);
  }

  private async generateMeetings(
    userContext: UserContext
  ): Promise<MeetingItem[]> {
    try {
      const prompt = `Generate 2-4 relevant meetings for a ${userContext.role} in the ${userContext.department} department.

Include:
- Meeting title
- Time (realistic business hours)
- Duration
- Participants
- Location (virtual/physical)
- Preparation notes
- Expected outcomes

Format as JSON array.`;

      const response = await this.claudeService.generateResponse(prompt);

      if (response) {
        try {
          const jsonMatch = response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          return JSON.parse(response);
        } catch (parseError) {
          console.warn(
            'Failed to parse Claude response as JSON, using fallback:',
            parseError
          );
        }
      }
    } catch (error) {
      console.error('Error generating meetings with Claude:', error);
    }

    return this.generateMockMeetings(userContext);
  }

  private async generateFollowUps(
    userContext: UserContext
  ): Promise<FollowUpItem[]> {
    try {
      const prompt = `Based on recent activities, generate 3-5 follow-ups needed for a ${userContext.role}.

Recent activities: ${userContext.recentActivities.map((a) => a.description).join('; ')}

Each follow-up should include:
- Description
- Original context
- Due date
- Priority
- Related entity (if applicable)

Format as JSON array.`;

      const response = await this.claudeService.generateResponse(prompt);

      if (response) {
        try {
          const jsonMatch = response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          return JSON.parse(response);
        } catch (parseError) {
          console.warn(
            'Failed to parse Claude response as JSON, using fallback:',
            parseError
          );
        }
      }
    } catch (error) {
      console.error('Error generating follow-ups with Claude:', error);
    }

    return this.generateMockFollowUps(userContext);
  }

  private async generateStrategicQuestions(
    userContext: UserContext
  ): Promise<StrategicQuestion[]> {
    try {
      const prompt = `Generate 3-5 strategic questions that a ${userContext.role} should consider today.

Context:
- Department: ${userContext.department}
- Current projects: ${userContext.currentProjects.join(', ')}
- Focus areas: ${userContext.preferences.focusAreas.join(', ')}

Each question should include:
- The question
- Context/background
- Importance level
- Timeframe for consideration

Format as JSON array.`;

      const response = await this.claudeService.generateResponse(prompt);

      if (response) {
        try {
          const jsonMatch = response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          return JSON.parse(response);
        } catch (parseError) {
          console.warn(
            'Failed to parse Claude response as JSON, using fallback:',
            parseError
          );
        }
      }
    } catch (error) {
      console.error('Error generating strategic questions with Claude:', error);
    }

    return this.generateMockStrategicQuestions(userContext);
  }

  private async generateSuccessDefinition(
    userContext: UserContext
  ): Promise<string> {
    try {
      const prompt = `Write a motivating success definition for today for a ${userContext.role} in ${userContext.department}.

Context:
- Projects: ${userContext.currentProjects.join(', ')}
- Focus areas: ${userContext.preferences.focusAreas.join(', ')}

Make it specific, actionable, and focused on deep work rather than just task completion.
Keep it to 2-3 sentences.`;

      const response = await this.claudeService.generateResponse(prompt);

      if (response) {
        return response.trim();
      }
    } catch (error) {
      console.error('Error generating success definition with Claude:', error);
    }

    return this.generateMockSuccessDefinition(userContext);
  }

  // Mock data generators for fallback
  private generateMockPriorities(userContext: UserContext): PriorityItem[] {
    return [
      {
        id: 'priority_1',
        title: 'Review Carrier Compliance Status',
        description:
          'Complete the quarterly compliance review for active carriers. Ensure all documentation is current and identify any gaps that need immediate attention.',
        estimatedTime: '2 hours',
        urgency: 'high',
        category: 'Compliance',
      },
      {
        id: 'priority_2',
        title: 'Optimize Route Planning',
        description:
          "Review and optimize the current week's load assignments using the new AI route optimization tool. Focus on reducing empty miles and improving fuel efficiency.",
        estimatedTime: '1.5 hours',
        urgency: 'medium',
        category: 'Operations',
      },
      {
        id: 'priority_3',
        title: 'Team Performance Review',
        description:
          'Analyze team performance metrics from the past week and prepare feedback for the upcoming team meeting. Identify areas for improvement and celebrate successes.',
        estimatedTime: '45 minutes',
        urgency: 'medium',
        category: 'Management',
      },
    ];
  }

  private generateMockMeetings(userContext: UserContext): MeetingItem[] {
    return [
      {
        id: 'meeting_1',
        title: 'Daily Operations Standup',
        time: '09:00',
        duration: '30 minutes',
        participants: [
          'Operations Team',
          'Dispatch Manager',
          'Carrier Relations',
        ],
        location: 'Conference Room A',
        prepNotes: [
          'Review overnight load completions',
          'Discuss any urgent carrier issues',
          'Update on current load assignments',
        ],
      },
      {
        id: 'meeting_2',
        title: 'Carrier Partnership Review',
        time: '14:00',
        duration: '1 hour',
        participants: [
          'Carrier Relations Manager',
          'Senior Dispatcher',
          'Operations Director',
        ],
        location: 'Virtual Meeting',
        prepNotes: [
          'Prepare carrier performance metrics',
          'Review contract renewal candidates',
          'Discuss capacity expansion opportunities',
        ],
      },
    ];
  }

  private generateMockFollowUps(userContext: UserContext): FollowUpItem[] {
    return [
      {
        id: 'followup_1',
        description:
          'Follow up on insurance certificate renewal for Carrier XYZ',
        originalContext:
          'Certificate expires in 30 days - discussed in compliance review',
        dueDate: 'Today',
        priority: 'high',
        relatedEntity: {
          type: 'carrier',
          id: 'carrier_xyz',
          url: '/carriers/carrier_xyz',
        },
      },
      {
        id: 'followup_2',
        description: 'Send rate confirmation for Load #FL2024-0892',
        originalContext:
          'Customer requested confirmation during booking process',
        dueDate: 'End of day',
        priority: 'medium',
        relatedEntity: {
          type: 'load',
          id: 'FL2024-0892',
          url: '/loads/FL2024-0892',
        },
      },
    ];
  }

  private generateMockStrategicQuestions(
    userContext: UserContext
  ): StrategicQuestion[] {
    return [
      {
        question:
          'How can we improve our carrier onboarding process to reduce time-to-first-load?',
        context:
          'Recent carrier feedback indicates onboarding takes too long, affecting our competitive advantage.',
        importance: 'high',
        timeframe: 'This quarter',
      },
      {
        question:
          'What metrics should we track to better predict and prevent load delays?',
        context:
          'Load delay incidents have increased 15% this month, impacting customer satisfaction.',
        importance: 'medium',
        timeframe: 'Next month',
      },
      {
        question:
          'How might emerging AI technologies improve our route optimization?',
        context:
          'Competitors are adopting AI for route planning with reported efficiency gains.',
        importance: 'medium',
        timeframe: 'Next quarter',
      },
    ];
  }

  private generateMockSuccessDefinition(userContext: UserContext): string {
    return "Today, success means completing the carrier compliance review with actionable improvements identified, optimizing at least 80% of this week's loads for maximum efficiency, and having meaningful strategic discussions that advance our operational excellence. Focus on deep work that creates lasting value rather than just checking boxes.";
  }

  private generateFallbackBriefing(
    userId: string,
    tenantId: string
  ): DailyBriefingData {
    return {
      topPriorities: this.generateMockPriorities({
        userId,
        tenantId,
        role: 'dispatcher',
        department: 'Operations',
        currentProjects: [],
        recentActivities: [],
        preferences: {
          briefingTime: '08:00',
          includeWeekends: false,
          focusAreas: [],
          notificationChannels: ['in-app'],
          tone: 'professional',
          length: 'standard',
        },
      }),
      meetings: [],
      followUps: [],
      strategicQuestions: [],
      successDefinition:
        'Today, success means focusing on high-impact activities that move our key initiatives forward and create lasting value for the team and organization.',
      userContext: {
        userId,
        tenantId,
        role: 'dispatcher',
        department: 'Operations',
        currentProjects: [],
        recentActivities: [],
        preferences: {
          briefingTime: '08:00',
          includeWeekends: false,
          focusAreas: [],
          notificationChannels: ['in-app'],
          tone: 'professional',
          length: 'standard',
        },
      },
    };
  }

  private formatBriefingMessage(briefingData: DailyBriefingData): string {
    const { topPriorities, meetings, followUps, successDefinition } =
      briefingData;

    let message = `🌅 Good morning! Here's your daily briefing:\n\n`;

    // Top Priorities
    message += `🎯 TOP PRIORITIES (${topPriorities.length}):\n`;
    topPriorities.slice(0, 3).forEach((priority, index) => {
      const urgencyEmoji =
        priority.urgency === 'high'
          ? '🔴'
          : priority.urgency === 'medium'
            ? '🟡'
            : '🟢';
      message += `${index + 1}. ${urgencyEmoji} ${priority.title} (${priority.estimatedTime})\n`;
    });

    // Meetings
    if (meetings.length > 0) {
      message += `\n📅 MEETINGS (${meetings.length}):\n`;
      meetings.slice(0, 2).forEach((meeting, index) => {
        message += `${index + 1}. ${meeting.title} at ${meeting.time}\n`;
      });
    }

    // Follow-ups
    if (followUps.length > 0) {
      message += `\n📝 FOLLOW-UPS (${followUps.length}):\n`;
      followUps.slice(0, 2).forEach((followUp, index) => {
        const priorityEmoji =
          followUp.priority === 'high'
            ? '🔴'
            : followUp.priority === 'medium'
              ? '🟡'
              : '🟢';
        message += `${index + 1}. ${priorityEmoji} ${followUp.description}\n`;
      });
    }

    // Success Definition
    message += `\n🎯 TODAY'S SUCCESS: ${successDefinition.substring(0, 150)}${successDefinition.length > 150 ? '...' : ''}`;

    return message;
  }
}

// Export singleton instance
export const dailyBriefingService = new DailyBriefingService();
