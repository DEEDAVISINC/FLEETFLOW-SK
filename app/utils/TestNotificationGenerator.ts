/**
 * Test Notification Generator
 * Utility for generating test notifications to verify the notification system works correctly
 */

import { getCurrentUser } from '../config/access';
import {
  NotificationData,
  notificationService,
} from '../services/NotificationService';
import { businessEventGenerator } from './BusinessEventGenerator';

// ============================================================================
// TEST NOTIFICATION GENERATOR
// ============================================================================

export class TestNotificationGenerator {
  constructor() {
    console.info('🧪 TestNotificationGenerator initialized');
  }

  /**
   * Generate a simple test notification
   */
  async generateSimpleTestNotification(): Promise<void> {
    const { user } = getCurrentUser();

    const testNotification: NotificationData = {
      type: 'system',
      title: 'Test Notification',
      message:
        'This is a test notification to verify the notification system is working correctly.',
      priority: 'medium',
      userId: user.id,
      tenantId: 'default',
      category: 'system_test',
      channels: ['in-app'],
      actions: [
        {
          id: 'test_action',
          label: 'Test Action',
          type: 'navigate',
          payload: { url: '/notifications' },
          style: 'primary',
          icon: '✅',
        },
      ],
    };

    await notificationService.sendNotification(testNotification);
    console.info('✅ Test notification sent');
  }

  /**
   * Generate multiple test notifications with different types
   */
  async generateVarietyTestNotifications(): Promise<void> {
    const { user } = getCurrentUser();

    const testNotifications: NotificationData[] = [
      {
        type: 'system',
        title: 'System Update Available',
        message: 'A new system update is available for FleetFlow.',
        priority: 'low',
        userId: user.id,
        tenantId: 'default',
        category: 'system_update',
        channels: ['in-app'],
        actions: [
          {
            id: 'view_update',
            label: 'View Details',
            type: 'navigate',
            payload: { url: '/settings' },
            style: 'primary',
            icon: '🔄',
          },
        ],
      },
      {
        type: 'shipment',
        title: 'Load Status Update',
        message: 'Load FL-2025-TEST has been picked up and is in transit.',
        priority: 'medium',
        userId: user.id,
        tenantId: 'default',
        category: 'load_update',
        channels: ['in-app'],
        actions: [
          {
            id: 'track_load',
            label: 'Track Load',
            type: 'navigate',
            payload: { url: '/dispatch?tab=tracking' },
            style: 'primary',
            icon: '🚛',
          },
        ],
      },
      {
        type: 'compliance',
        title: 'URGENT: DOT Filing Reminder',
        message:
          'Your quarterly DOT filing is due in 2 days. Please complete as soon as possible.',
        priority: 'high',
        userId: user.id,
        tenantId: 'default',
        category: 'compliance_urgent',
        channels: ['in-app'],
        actions: [
          {
            id: 'complete_filing',
            label: 'Complete Filing',
            type: 'navigate',
            payload: { url: '/compliance' },
            style: 'danger',
            icon: '⚠️',
          },
        ],
      },
      {
        type: 'billing',
        title: 'Payment Received',
        message:
          'Payment of $3,500 received from ABC Logistics for Invoice #INV-2025-001.',
        priority: 'low',
        userId: user.id,
        tenantId: 'default',
        category: 'payment_received',
        channels: ['in-app'],
        actions: [
          {
            id: 'view_payment',
            label: 'View Details',
            type: 'navigate',
            payload: { url: '/billing' },
            style: 'success',
            icon: '💰',
          },
        ],
      },
      {
        type: 'maintenance',
        title: 'Vehicle Service Reminder',
        message: 'Truck #TRK-789 is due for preventive maintenance in 3 days.',
        priority: 'medium',
        userId: user.id,
        tenantId: 'default',
        category: 'maintenance_reminder',
        channels: ['in-app'],
        actions: [
          {
            id: 'schedule_service',
            label: 'Schedule Service',
            type: 'navigate',
            payload: { url: '/maintenance' },
            style: 'primary',
            icon: '🔧',
          },
        ],
      },
    ];

    // Send notifications with delays to simulate real-world timing
    for (let i = 0; i < testNotifications.length; i++) {
      setTimeout(async () => {
        await notificationService.sendNotification(testNotifications[i]);
        console.info(
          `✅ Test notification ${i + 1} sent: ${testNotifications[i].title}`
        );
      }, i * 1000); // 1 second delay between each
    }

    console.info(
      `📢 Generating ${testNotifications.length} variety test notifications...`
    );
  }

  /**
   * Generate business event test notifications
   */
  async generateBusinessEventTestNotifications(): Promise<void> {
    console.info('🎯 Generating business event test notifications...');

    try {
      await businessEventGenerator.generateTestNotifications('default');
      console.info('✅ Business event test notifications generated');
    } catch (error) {
      console.error(
        '❌ Failed to generate business event notifications:',
        error
      );
    }
  }

  /**
   * Clear all test notifications for the current user
   */
  async clearTestNotifications(): Promise<void> {
    const { user } = getCurrentUser();

    try {
      // Get all notifications for the user
      const notifications = await notificationService.getUserNotifications(
        user.id,
        {
          limit: 100,
          includeRead: true,
        }
      );

      // Filter for test notifications
      const testNotificationIds = notifications
        .filter(
          (n) =>
            n.category?.includes('test') ||
            n.category?.includes('system_test') ||
            n.title?.includes('Test')
        )
        .map((n) => n.id!)
        .filter((id) => id);

      if (testNotificationIds.length > 0) {
        await notificationService.archiveNotifications(testNotificationIds);
        console.info(
          `🗑️ Cleared ${testNotificationIds.length} test notifications`
        );
      } else {
        console.info('ℹ️ No test notifications to clear');
      }
    } catch (error) {
      console.error('❌ Failed to clear test notifications:', error);
    }
  }

  /**
   * Generate critical priority notification to test escalation
   */
  async generateCriticalNotification(): Promise<void> {
    const { user } = getCurrentUser();

    const criticalNotification: NotificationData = {
      type: 'emergency',
      title: 'CRITICAL: Emergency Alert',
      message:
        'This is a critical test notification to verify high-priority alert handling.',
      priority: 'critical',
      userId: user.id,
      tenantId: 'default',
      category: 'emergency_test',
      channels: ['in-app'],
      actions: [
        {
          id: 'emergency_response',
          label: 'Emergency Response',
          type: 'navigate',
          payload: { url: '/emergency' },
          style: 'danger',
          icon: '🚨',
        },
        {
          id: 'contact_manager',
          label: 'Contact Manager',
          type: 'modal',
          payload: { modal: 'contact_manager' },
          style: 'secondary',
          icon: '📞',
        },
      ],
    };

    await notificationService.sendNotification(criticalNotification);
    console.info('🚨 Critical test notification sent');
  }
}

// ============================================================================
// GLOBAL TEST FUNCTIONS (Available in browser console)
// ============================================================================

// Export singleton instance
export const testNotificationGenerator = new TestNotificationGenerator();

// Global functions for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testNotifications = {
    simple: () => testNotificationGenerator.generateSimpleTestNotification(),
    variety: () => testNotificationGenerator.generateVarietyTestNotifications(),
    business: () =>
      testNotificationGenerator.generateBusinessEventTestNotifications(),
    critical: () => testNotificationGenerator.generateCriticalNotification(),
    clear: () => testNotificationGenerator.clearTestNotifications(),

    // Helper function to show all available test commands
    help: () => {
      console.info(`
🧪 FleetFlow Notification Test Commands:

testNotifications.simple()    - Generate a simple test notification
testNotifications.variety()   - Generate 5 different notification types
testNotifications.business()  - Generate business event notifications
testNotifications.critical()  - Generate a critical priority notification
testNotifications.clear()     - Clear all test notifications

Example usage:
testNotifications.variety()   // Generates multiple test notifications
testNotifications.clear()     // Clears all test notifications
      `);
    },
  };

  console.info(
    '🧪 Test notification commands loaded! Type testNotifications.help() for usage.'
  );
}
