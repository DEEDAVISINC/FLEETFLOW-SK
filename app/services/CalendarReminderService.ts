/**
 * Calendar Reminder Service for Alexis Best (AI Executive Assistant)
 * Manages calendar events, reminders, and follow-up scheduling
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  reminderDates: string[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category:
    | 'government_contract'
    | 'meeting'
    | 'deadline'
    | 'follow_up'
    | 'general';
  relatedEntity?: {
    type: 'bpa' | 'rfp' | 'contract' | 'customer' | 'project';
    id: string;
    name: string;
  };
  actionRequired?: boolean;
  attendees?: string[];
  location?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface CalendarReminder {
  id: string;
  eventId: string;
  reminderDate: string;
  message: string;
  sent: boolean;
  sentAt?: string;
  type: 'email' | 'dashboard' | 'push' | 'sms';
}

class CalendarReminderService {
  private events: Map<string, CalendarEvent> = new Map();
  private reminders: Map<string, CalendarReminder> = new Map();
  private reminderCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the calendar reminder service
   */
  private initializeService() {
    console.log('📅 Calendar Reminder Service initialized by Alexis Best');

    // Load any persisted events from localStorage if in browser
    if (typeof window !== 'undefined') {
      this.loadEventsFromStorage();
    }

    // Start reminder check interval (every hour)
    this.startReminderChecks();
  }

  /**
   * Create a new calendar event
   */
  createEvent(
    event: Omit<CalendarEvent, 'id' | 'createdAt' | 'status'>
  ): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: this.generateEventId(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    this.events.set(newEvent.id, newEvent);
    this.createRemindersForEvent(newEvent);
    this.saveEventsToStorage();

    console.log(
      `📅 Calendar event created: ${newEvent.title} (${newEvent.id})`
    );
    return newEvent;
  }

  /**
   * Create reminders for an event
   */
  private createRemindersForEvent(event: CalendarEvent) {
    event.reminderDates.forEach((reminderDate) => {
      const reminder: CalendarReminder = {
        id: this.generateReminderId(),
        eventId: event.id,
        reminderDate,
        message: `Reminder: ${event.title}`,
        sent: false,
        type: 'dashboard',
      };
      this.reminders.set(reminder.id, reminder);
    });
  }

  /**
   * Create BPA follow-up event (NAWCAD specific)
   */
  createBPAFollowUpEvent(
    solicitationNumber: string,
    submissionDate: string,
    followUpDate: string,
    contactEmail: string
  ): CalendarEvent {
    const followUpDateObj = new Date(followUpDate);
    const sevenDaysBefore = new Date(followUpDateObj);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
    const threeDaysBefore = new Date(followUpDateObj);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    const oneDayBefore = new Date(followUpDateObj);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    return this.createEvent({
      title: `BPA Follow-Up: ${solicitationNumber}`,
      description: `Follow up on NAWCAD BPA application submitted on ${submissionDate}.

Contact: ${contactEmail}
Solicitation: ${solicitationNumber}

Action Required:
- Check for response from NAWCAD
- If no response received, send follow-up email
- Use template: NAWCAD BPA Follow-Up
- BCC: info@deedavis.biz

Submission Details:
- Date Submitted: ${submissionDate}
- CAGE Code: 8UMX3
- UEID: HJB4KNYJVGZ1
- TWIC Certified: Yes

This reminder was created by Alexis Best, your AI Executive Assistant.`,
      startDate: followUpDate,
      reminderDates: [
        sevenDaysBefore.toISOString(),
        threeDaysBefore.toISOString(),
        oneDayBefore.toISOString(),
        followUpDateObj.toISOString(),
      ],
      priority: 'high',
      category: 'follow_up',
      relatedEntity: {
        type: 'bpa',
        id: solicitationNumber,
        name: `NAWCAD BPA - ${solicitationNumber}`,
      },
      actionRequired: true,
      attendees: ['ddavis@freight1stdirect.com'],
      status: 'pending',
      createdBy: 'alexis-executive-023',
      metadata: {
        solicitationNumber,
        submissionDate,
        contactEmail,
        templateId: 'nawcad-bpa-followup',
        bccAddress: 'info@deedavis.biz',
      },
    });
  }

  /**
   * Get event by ID
   */
  getEvent(eventId: string): CalendarEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * Get all events
   */
  getAllEvents(): CalendarEvent[] {
    return Array.from(this.events.values());
  }

  /**
   * Get upcoming events (next 30 days)
   */
  getUpcomingEvents(daysAhead: number = 30): CalendarEvent[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return Array.from(this.events.values())
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate >= now &&
          eventDate <= futureDate &&
          event.status === 'pending'
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }

  /**
   * Get events by category
   */
  getEventsByCategory(category: CalendarEvent['category']): CalendarEvent[] {
    return Array.from(this.events.values()).filter(
      (event) => event.category === category
    );
  }

  /**
   * Get pending reminders for today
   */
  getPendingRemindersForToday(): CalendarReminder[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(this.reminders.values()).filter((reminder) => {
      if (reminder.sent) return false;
      const reminderDate = new Date(reminder.reminderDate);
      return reminderDate >= today && reminderDate < tomorrow;
    });
  }

  /**
   * Mark event as completed
   */
  completeEvent(eventId: string): boolean {
    const event = this.events.get(eventId);
    if (!event) return false;

    event.status = 'completed';
    this.saveEventsToStorage();
    console.log(`✅ Event completed: ${event.title}`);
    return true;
  }

  /**
   * Cancel event
   */
  cancelEvent(eventId: string): boolean {
    const event = this.events.get(eventId);
    if (!event) return false;

    event.status = 'cancelled';
    this.saveEventsToStorage();
    console.log(`❌ Event cancelled: ${event.title}`);
    return true;
  }

  /**
   * Mark reminder as sent
   */
  markReminderSent(reminderId: string): boolean {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return false;

    reminder.sent = true;
    reminder.sentAt = new Date().toISOString();
    return true;
  }

  /**
   * Check for due reminders and send notifications
   */
  private checkAndSendReminders() {
    const now = new Date();
    const reminders = Array.from(this.reminders.values());

    reminders.forEach((reminder) => {
      if (reminder.sent) return;

      const reminderDate = new Date(reminder.reminderDate);
      if (reminderDate <= now) {
        this.sendReminder(reminder);
      }
    });
  }

  /**
   * Send a reminder notification
   */
  private sendReminder(reminder: CalendarReminder) {
    const event = this.events.get(reminder.eventId);
    if (!event) return;

    console.log(`🔔 Reminder: ${reminder.message}`);
    console.log(`   Event: ${event.title}`);
    console.log(`   Date: ${event.startDate}`);

    // Mark as sent
    this.markReminderSent(reminder.id);

    // TODO: Integrate with actual notification system
    // This would trigger dashboard notifications, emails, etc.
  }

  /**
   * Start periodic reminder checks
   */
  private startReminderChecks() {
    // Check every hour
    this.reminderCheckInterval = setInterval(
      () => {
        this.checkAndSendReminders();
      },
      60 * 60 * 1000
    );
  }

  /**
   * Stop reminder checks
   */
  stopReminderChecks() {
    if (this.reminderCheckInterval) {
      clearInterval(this.reminderCheckInterval);
      this.reminderCheckInterval = null;
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique reminder ID
   */
  private generateReminderId(): string {
    return `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save events to localStorage
   */
  private saveEventsToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const eventsArray = Array.from(this.events.entries());
      const remindersArray = Array.from(this.reminders.entries());

      localStorage.setItem(
        'alexis-calendar-events',
        JSON.stringify(eventsArray)
      );
      localStorage.setItem(
        'alexis-calendar-reminders',
        JSON.stringify(remindersArray)
      );
    } catch (error) {
      console.error('Failed to save calendar events to storage:', error);
    }
  }

  /**
   * Load events from localStorage
   */
  private loadEventsFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const eventsData = localStorage.getItem('alexis-calendar-events');
      const remindersData = localStorage.getItem('alexis-calendar-reminders');

      if (eventsData) {
        const eventsArray = JSON.parse(eventsData);
        this.events = new Map(eventsArray);
        console.log(
          `📅 Loaded ${this.events.size} calendar events from storage`
        );
      }

      if (remindersData) {
        const remindersArray = JSON.parse(remindersData);
        this.reminders = new Map(remindersArray);
        console.log(`🔔 Loaded ${this.reminders.size} reminders from storage`);
      }
    } catch (error) {
      console.error('Failed to load calendar events from storage:', error);
    }
  }

  /**
   * Calculate days until event
   */
  getDaysUntilEvent(eventId: string): number | null {
    const event = this.events.get(eventId);
    if (!event) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}

// Export singleton instance
export const calendarReminderService = new CalendarReminderService();
